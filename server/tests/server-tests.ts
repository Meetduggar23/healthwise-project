/**
 * HealthWise server integration tests — run with:  npx tsx tests/server-tests.ts
 * Spawns the real server on a test port and asserts over HTTP:
 * patient/admin auth, route protection, shared in-memory appointments,
 * ownership, chatbot (EN/HI/Hinglish + emergency), calculators, tel: links.
 */
import { spawn, spawnSync, type ChildProcess } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { calcAge, calcBmi, hydrationGuide } from "../../client/src/lib/healthCalc.js";
import { MEDICINES, MEDICINE_CATEGORIES } from "../../client/src/data/medicines.js";
import { MEDICINE_BRIEFS } from "../src/medicineBriefs.js";

const PORT = 4101;
const BASE = `http://127.0.0.1:${PORT}`;

let passed = 0;
let failed = 0;
const failures: string[] = [];

function check(name: string, cond: boolean, extra = ""): void {
  if (cond) {
    passed++;
    console.log(`  PASS ${name}`);
  } else {
    failed++;
    failures.push(name);
    console.log(`  FAIL ${name}${extra ? ` — ${extra}` : ""}`);
  }
}

class Jar {
  cookie = "";
  async req(p: string, init: RequestInit = {}): Promise<{ status: number; body: never }> {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (this.cookie) headers.Cookie = this.cookie;
    const res = await fetch(`${BASE}${p}`, { ...init, headers: { ...headers, ...(init.headers as object ?? {}) } });
    const setCookie = res.headers.get("set-cookie");
    if (setCookie) this.cookie = setCookie.split(";")[0];
    let body: unknown = {};
    try {
      body = await res.json();
    } catch {
      body = {};
    }
    return { status: res.status, body: body as never };
  }
}

function futureDate(daysAhead: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

async function waitForHealth(proc: ChildProcess): Promise<boolean> {
  for (let i = 0; i < 100; i++) {
    try {
      const r = await fetch(`${BASE}/api/health`);
      if (r.ok) return true;
    } catch {
      /* not up yet */
    }
    await new Promise((r) => setTimeout(r, 200));
  }
  console.log("Server did not start. Output check recommended.");
  void proc;
  return false;
}

async function main(): Promise<void> {
  const proc: ChildProcess = spawn("npx tsx src/index.ts", {
    cwd: process.cwd(),
    shell: true,
    env: {
      ...process.env,
      PORT: String(PORT),
      NODE_ENV: "development",
      SESSION_SECRET: "test-secret-for-integration-run",
      DEMO_EMAIL: "meetduggar@gmail.com",
      DEMO_PASSWORD: "meet2005",
      ADMIN_EMAIL: "admin@healthwise.in",
      ADMIN_PASSWORD: "meet2005",
    },
    stdio: "ignore",
  });
  try {
    check("server boots", await waitForHealth(proc));

    const anon = new Jar();
    const patient = new Jar();
    const admin = new Jar();

    // ---- 1. patient login/logout ----
    console.log("\n[1] Patient auth");
    let r = await patient.req("/api/auth/login", { method: "POST", body: JSON.stringify({ email: "meetduggar@gmail.com", password: "meet2005" }) });
    check("patient login works", r.status === 200, `status=${r.status}`);
    r = await anon.req("/api/auth/login", { method: "POST", body: JSON.stringify({ email: "meetduggar@gmail.com", password: "wrong" }) });
    check("wrong patient password rejected", r.status === 401, `status=${r.status}`);
    r = await patient.req("/api/auth/me");
    check("patient me works", r.status === 200, `status=${r.status}`);

    // ---- 2. admin login ----
    console.log("\n[2] Admin auth");
    r = await admin.req("/api/admin/login", { method: "POST", body: JSON.stringify({ email: "admin@healthwise.in", password: "meet2005" }) });
    check("admin login accepts configured creds", r.status === 200, `status=${r.status}`);
    r = await anon.req("/api/admin/login", { method: "POST", body: JSON.stringify({ email: "admin@healthwise.in", password: "nope" }) });
    check("wrong admin password rejected", r.status === 401, `status=${r.status}`);
    r = await anon.req("/api/admin/login", { method: "POST", body: JSON.stringify({ email: "meetduggar@gmail.com", password: "meet2005" }) });
    check("patient creds rejected at admin login", r.status === 401, `status=${r.status}`);
    r = await admin.req("/api/admin/me");
    check("admin me works", r.status === 200, `status=${r.status}`);

    // ---- 2b. unified login (one form, both accounts) ----
    console.log("\n[2b] Unified login");
    const uniPatient = new Jar();
    r = await uniPatient.req("/api/auth/unified", { method: "POST", body: JSON.stringify({ email: "meetduggar@gmail.com", password: "meet2005" }) });
    check("unified login: patient role", r.status === 200 && (r.body as { role?: string }).role === "patient", `status=${r.status}`);
    r = await uniPatient.req("/api/appointments/mine");
    check("unified patient session works", r.status === 200, `status=${r.status}`);
    const uniAdmin = new Jar();
    r = await uniAdmin.req("/api/auth/unified", { method: "POST", body: JSON.stringify({ email: "admin@healthwise.in", password: "meet2005" }) });
    check("unified login: admin role", r.status === 200 && (r.body as { role?: string }).role === "admin", `status=${r.status}`);
    r = await uniAdmin.req("/api/admin/me");
    check("unified admin session works", r.status === 200, `status=${r.status}`);
    r = await anon.req("/api/auth/unified", { method: "POST", body: JSON.stringify({ email: "nobody@example.com", password: "wrong" }) });
    check("unified login rejects bad creds", r.status === 401, `status=${r.status}`);

    // ---- 3/4. route protection ----
    console.log("\n[3] Admin route protection");
    r = await anon.req("/api/admin/appointments");
    check("unauth admin API blocked (401)", r.status === 401, `status=${r.status}`);
    r = await patient.req("/api/admin/appointments");
    check("patient blocked from admin API (403)", r.status === 403, `status=${r.status}`);
    r = await anon.req("/api/appointments/mine");
    check("unauth patient appointments blocked (401)", r.status === 401, `status=${r.status}`);

    // ---- 5/6. booking visible to admin; cancel + status ----
    console.log("\n[4] Shared appointments");
    const payload = {
      patient_name: "Test Patient",
      doctor_name: "Dr. Aarav Sharma (Sample)",
      specialization: "General Physician",
      date: futureDate(7),
      time: "10:30",
      reason: "Fever and headache since two days",
    };
    r = await patient.req("/api/appointments", { method: "POST", body: JSON.stringify(payload) });
    check("booking succeeds", r.status === 201, `status=${r.status} body=${JSON.stringify(r.body)}`);
    const createdId = (r.body as { appointment?: { id?: string } }).appointment?.id ?? "";
    check("booking returns an ID", createdId.startsWith("HW-"), `id=${createdId}`);

    r = await patient.req("/api/appointments", { method: "POST", body: JSON.stringify(payload) });
    check("duplicate slot rejected (409)", r.status === 409, `status=${r.status}`);
    r = await patient.req("/api/appointments", { method: "POST", body: JSON.stringify({ ...payload, date: "2000-01-01" }) });
    check("past date rejected (400)", r.status === 400, `status=${r.status}`);

    r = await admin.req("/api/admin/appointments");
    const all = (r.body as { appointments?: { id: string }[] }).appointments ?? [];
    check("booking visible in admin dashboard", all.some((a) => a.id === createdId), `adminCount=${all.length}`);

    r = await patient.req("/api/appointments/mine");
    const mine = (r.body as { appointments?: { id: string }[] }).appointments ?? [];
    check("patient sees own appointment", mine.some((a) => a.id === createdId));

    r = await admin.req(`/api/admin/appointments/${encodeURIComponent(createdId)}`, { method: "PATCH", body: JSON.stringify({ status: "Confirmed" }) });
    check("admin status update works", r.status === 200 && (r.body as { appointment: { status: string } }).appointment.status === "Confirmed", `status=${r.status}`);
    r = await admin.req(`/api/admin/appointments/${encodeURIComponent(createdId)}`, { method: "PATCH", body: JSON.stringify({ status: "Bogus" }) });
    check("invalid status rejected (400)", r.status === 400, `status=${r.status}`);

    r = await patient.req(`/api/appointments/${encodeURIComponent(createdId)}/cancel`, { method: "POST" });
    check("patient cancellation works", r.status === 200, `status=${r.status}`);
    r = await patient.req(`/api/appointments/${encodeURIComponent(createdId)}/cancel`, { method: "POST" });
    check("double cancel rejected (400)", r.status === 400, `status=${r.status}`);

    // ---- 7. ownership: no cross-patient leakage (single demo account model) ----
    console.log("\n[5] Ownership");
    r = await anon.req(`/api/appointments/${encodeURIComponent(createdId)}/cancel`, { method: "POST" });
    check("anon cannot cancel (401)", r.status === 401, `status=${r.status}`);

    // ---- sessions stay separate ----
    console.log("\n[6] Session separation");
    r = await patient.req("/api/auth/logout", { method: "POST" });
    check("patient logout works", r.status === 200, `status=${r.status}`);
    r = await admin.req("/api/admin/me");
    check("admin session survives patient logout", r.status === 200, `status=${r.status}`);
    r = await admin.req("/api/admin/logout", { method: "POST" });
    check("admin logout works", r.status === 200, `status=${r.status}`);
    r = await admin.req("/api/admin/me");
    check("admin session cleared after logout", r.status !== 200, `status=${r.status}`);

    // ---- 11. chatbot still responds EN/HI/Hinglish + emergency ----
    console.log("\n[7] Chatbot preserved");
    await patient.req("/api/auth/login", { method: "POST", body: JSON.stringify({ email: "meetduggar@gmail.com", password: "meet2005" }) });
    const chat = async (text: string): Promise<string> => {
      const rr = await patient.req("/api/chat/message", { method: "POST", body: JSON.stringify({ messages: [{ role: "user", content: text }] }) });
      return (rr.body as { reply?: string }).reply ?? "";
    };
    const enReply = await chat("What is fatty liver?");
    check("chatbot EN responds", enReply.length > 50 && /liver/i.test(enReply), enReply.slice(0, 80));
    const hiReply = await chat("मुझे बुखार है");
    check("chatbot Hindi responds", hiReply.length > 20, hiReply.slice(0, 80));
    const hingReply = await chat("Mere haath mein jhanjhanahat hoti hai");
    check("chatbot Hinglish responds", hingReply.length > 20, hingReply.slice(0, 80));
    const emReply = await chat("Mere seene me dard ho raha hai with paseena");
    check("chatbot emergency gives 112", emReply.includes("112"), emReply.slice(0, 80));
    // Chatbot is free to use without login.
    const anonChat = await anon.req("/api/chat/message", { method: "POST", body: JSON.stringify({ messages: [{ role: "user", content: "What is dengue?" }] }) });
    check(
      "chatbot works without login",
      anonChat.status === 200 && ((anonChat.body as { reply?: string }).reply ?? "").length > 20,
      `status=${anonChat.status}`,
    );

    // ---- 8/9/10. static checks: tel links, calculators, library ----
    console.log("\n[8] Static content + calculators");
    const emgSrc = fs.readFileSync(path.resolve(process.cwd(), "../client/src/data/healthContent.ts"), "utf8");
    check("emergency call button tel:112", emgSrc.includes("tel:112"));
    check("emergency call button tel:108", emgSrc.includes("tel:108"));
    const libSrc = fs.readFileSync(path.resolve(process.cwd(), "../client/src/pages/HealthLibrary.tsx"), "utf8");
    check("library page searchable", /value=\{query\}|onChange/i.test(libSrc) && libSrc.includes("LIBRARY"));

    const bmi = calcBmi(65, 170);
    check("BMI calculator works", bmi.bmi === 22.5 && bmi.category === "Healthy range", JSON.stringify(bmi));
    let bmiErr = "";
    try {
      calcBmi(-5, 170);
    } catch (e) {
      bmiErr = e instanceof Error ? e.message : "";
    }
    check("BMI validates inputs", bmiErr.length > 0);
    const age = calcAge("2000-01-15", "2026-10-15");
    check("age calculator works", age.years === 26 && age.months === 9 && age.days === 0, JSON.stringify(age));
    const hyd = hydrationGuide(65, 30);
    check("hydration calculator works", hyd.litresMin > 2 && hyd.litresMax > hyd.litresMin, JSON.stringify(hyd));
    let hydErr = "";
    try {
      hydrationGuide(0, 0);
    } catch (e) {
      hydErr = e instanceof Error ? e.message : "";
    }
    check("hydration validates inputs", hydErr.length > 0);

    // ---- 9. medicine catalogue integrity + chatbot consistency ----
    console.log("\n[9] Medicine library data");
    check("catalogue has 16 entries", MEDICINES.length === 16, `got=${MEDICINES.length}`);
    const medIds = MEDICINES.map((m) => m.id);
    check("catalogue ids unique", new Set(medIds).size === medIds.length);
    check(
      "required fields present",
      MEDICINES.every(
        (m) =>
          m.name && m.generic && m.brands.length > 0 && m.categories.length > 0 &&
          m.forms.length > 0 && m.summary.length > 40 && m.uses.length > 0 &&
          m.howItWorks.length > 20 && m.sideEffects.length > 0 &&
          m.seriousWarnings.length > 0 && m.precautions.length > 0 &&
          m.overdose.length > 20 && m.rx.length > 10 && m.refs.length > 0 &&
          m.reviewed.length > 0 && m.keywords.length >= 3,
      ),
    );
    check("no personalized dosages", !MEDICINES.some((m) => /take \d+\s*(tablet|mg|ml|drop|spoon|puff)|children[^.]*\d+\s*mg|\d+\s*mg\s*(twice|thrice)|every \d+\s*hours|\d+\s*mg\/kg/i.test([m.summary, m.howItWorks, ...m.safeUse, ...m.uses].join(" "))));
    check("overdose mentions emergency number", MEDICINES.every((m) => m.overdose.includes("112")));
    check("refs are https medical sources", MEDICINES.every((m) => m.refs.every((r) => /^https:\/\/(medlineplus\.gov|www\.nhs\.uk|www\.who\.int)/.test(r.url))));
    check("images have alt + credit fallback", MEDICINES.every((m) => m.imageAlt.length > 5 && m.imageCredit.length > 5));
    check("categories valid", MEDICINES.every((m) => m.categories.every((c) => MEDICINE_CATEGORIES.includes(c))));
    const byId = new Map(MEDICINES.map((m) => [m.id, m]));
    check(
      "briefs match catalogue (id/name/generic)",
      MEDICINE_BRIEFS.length === MEDICINES.length &&
        MEDICINE_BRIEFS.every((b) => {
          const m = byId.get(b.id);
          return m !== undefined && m.name === b.name && m.generic === b.generic && b.path === `/medicines/${b.id}`;
        }),
      `briefs=${MEDICINE_BRIEFS.length}`,
    );
    const medLibSrc = fs.readFileSync(path.resolve(process.cwd(), "../client/src/pages/MedicineLibrary.tsx"), "utf8");
    check("library page has search+filters+load-more", /suggest/i.test(medLibSrc) && /chip/i.test(medLibSrc) && /Load More/.test(medLibSrc));
    const medDetSrc = fs.readFileSync(path.resolve(process.cwd(), "../client/src/pages/MedicineDetail.tsx"), "utf8");
    check("detail page has TOC+refs+disclaimer", /On this page/.test(medDetSrc) && /References/.test(medDetSrc) && /not a prescription/.test(medDetSrc));
  } finally {
    // On Windows, kill() only stops the shell — terminate the whole tree
    // so no orphan server keeps holding the test port.
    if (proc.pid !== undefined) {
      if (process.platform === "win32") {
        spawnSync("taskkill", ["/PID", String(proc.pid), "/T", "/F"], { stdio: "ignore" });
      } else {
        proc.kill();
      }
    }
  }

  console.log(`\n==== ${passed} passed, ${failed} failed ====`);
  if (failures.length > 0) {
    console.log("Failures:");
    for (const f of failures) console.log(` - ${f}`);
    process.exit(1);
  }
}

main().catch((e) => {
  console.error("Test runner error:", e);
  process.exit(1);
});
