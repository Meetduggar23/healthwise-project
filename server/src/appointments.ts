import { Router } from "express";
import { z } from "zod";
import { requireAdmin, requireAuth } from "./middleware.js";
import { env } from "./env.js";

/**
 * Shared server-side in-memory appointment store (college demo, NO database).
 *
 * - One collection per running server process: every user booking through
 *   this server reads/writes the same list, so the admin dashboard sees
 *   exactly what patients submitted.
 * - Appointments are LOST when the server restarts. This is not durable
 *   storage — never claim bookings are permanently saved.
 * - Ownership is enforced server-side: patients only ever receive their own
 *   records (matched by account email); only admins may list/update all.
 */

export type AppointmentStatus = "Pending" | "Confirmed" | "Completed" | "Cancelled";

export interface Appointment {
  id: string;
  patient_name: string;
  patient_email: string;
  doctor_name: string;
  specialization: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM (24h)
  reason: string;
  status: AppointmentStatus;
  created_at: string;
  updated_at: string;
}

const appointments: Appointment[] = [];

function todayStr(): string {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

function makeId(): string {
  return `HW-${Date.now().toString(36).toUpperCase()}${Math.floor(Math.random() * 1296)
    .toString(36)
    .toUpperCase()
    .padStart(2, "0")}`;
}

/** The single demo patient account owns bookings made under its session. */
function ownerEmailFor(): string {
  // requireAuth already ran on this router; the demo build has one account.
  return env.demoEmail;
}

const bookSchema = z.object({
  patient_name: z.string().trim().min(2, "Please enter the patient name.").max(80),
  doctor_name: z.string().trim().max(80).default(""),
  specialization: z.string().trim().max(60).default(""),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Please choose an appointment date."),
  time: z.string().regex(/^\d{2}:\d{2}$/, "Please choose an appointment time."),
  reason: z.string().trim().min(3, "Please describe the reason for your visit.").max(500),
});

export const appointmentsRouter = Router();
export const adminAppointmentsRouter = Router();

// ---------- Patient routes ----------

appointmentsRouter.use(requireAuth);

appointmentsRouter.get("/mine", (req, res) => {
  const owner = ownerEmailFor();
  const mine = appointments
    .filter((a) => a.patient_email === owner)
    .sort((a, b) => (a.date === b.date ? a.time.localeCompare(b.time) : a.date.localeCompare(b.date)));
  res.json({ appointments: mine });
});

appointmentsRouter.post("/", (req, res) => {
  const parsed = bookSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0].message });
    return;
  }
  const input = parsed.data;
  if (!input.doctor_name && !input.specialization) {
    res.status(400).json({ error: "Please choose a doctor or a specialization." });
    return;
  }
  if (input.date < todayStr()) {
    res.status(400).json({ error: "Appointments cannot be booked for past dates." });
    return;
  }
  const owner = ownerEmailFor();
  const dup = appointments.find(
    (a) =>
      a.patient_email === owner &&
      a.status !== "Cancelled" &&
      a.doctor_name === input.doctor_name &&
      a.specialization === input.specialization &&
      a.date === input.date &&
      a.time === input.time,
  );
  if (dup) {
    res.status(409).json({ error: "You already have an appointment at this date and time." });
    return;
  }
  const now = new Date().toISOString();
  const appt: Appointment = {
    ...input,
    id: makeId(),
    patient_email: owner,
    status: "Pending",
    created_at: now,
    updated_at: now,
  };
  appointments.push(appt);
  res.status(201).json({ appointment: appt });
});

appointmentsRouter.post("/:id/cancel", (req, res) => {
  const owner = ownerEmailFor();
  const appt = appointments.find((a) => a.id === req.params.id && a.patient_email === owner);
  if (!appt) {
    res.status(404).json({ error: "Appointment not found." });
    return;
  }
  if (appt.status === "Cancelled") {
    res.status(400).json({ error: "This appointment is already cancelled." });
    return;
  }
  if (appt.status === "Completed") {
    res.status(400).json({ error: "Completed appointments cannot be cancelled." });
    return;
  }
  appt.status = "Cancelled";
  appt.updated_at = new Date().toISOString();
  res.json({ appointment: appt });
});

// ---------- Admin routes (all appointments, status management) ----------

adminAppointmentsRouter.use(requireAdmin);

adminAppointmentsRouter.get("/", (_req, res) => {
  const all = [...appointments].sort((a, b) => b.created_at.localeCompare(a.created_at));
  res.json({ appointments: all });
});

const statusSchema = z.object({
  status: z.enum(["Pending", "Confirmed", "Completed", "Cancelled"]),
});

adminAppointmentsRouter.patch("/:id", (req, res) => {
  const parsed = statusSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid status. Use Pending, Confirmed, Completed, or Cancelled." });
    return;
  }
  const appt = appointments.find((a) => a.id === req.params.id);
  if (!appt) {
    res.status(404).json({ error: "Appointment not found." });
    return;
  }
  appt.status = parsed.data.status;
  appt.updated_at = new Date().toISOString();
  res.json({ appointment: appt });
});
