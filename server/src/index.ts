import express from "express";
import session from "express-session";
import cors from "cors";
import path from "node:path";
import fs from "node:fs";
import { env } from "./env.js";
import { authRouter } from "./auth.js";
import { adminRouter } from "./admin.js";
import { appointmentsRouter, adminAppointmentsRouter } from "./appointments.js";
import { chatbotRouter } from "./chatbot.js";
import { libraryRouter } from "./library.js";

const app = express();
const isProd = env.nodeEnv === "production";

app.set("trust proxy", 1);
app.use(express.json({ limit: "100kb" }));

// Minimal security headers (no extra dependency for this demo).
app.use((_req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("Referrer-Policy", "no-referrer");
  next();
});

// In dev, allow the Vite dev server origin with credentials.
if (!isProd) {
  app.use(
    cors({
      origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
      credentials: true,
    }),
  );
}

app.use(
  session({
    name: "healthwise.sid",
    secret: env.sessionSecret || "healthwise-dev-secret-change-me",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: isProd, // requires HTTPS in production
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    },
  }),
);

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    aiConfigured: Boolean(env.aiApiKey),
    time: new Date().toISOString(),
  });
});

app.use("/api/auth", authRouter);
app.use("/api/admin", adminRouter);
app.use("/api/appointments", appointmentsRouter);
app.use("/api/admin/appointments", adminAppointmentsRouter);
app.use("/api/chat", chatbotRouter);
app.use("/api/knowledge", libraryRouter);

// Serve the built client in production.
const clientDist = path.resolve(process.cwd(), "../client/dist");
if (isProd && fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get("*", (_req, res) => res.sendFile(path.join(clientDist, "index.html")));
}

app.use((_req, res) => res.status(404).json({ error: "Not found." }));

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error & { status?: number; type?: string }, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  if (err.type === "entity.too.large") {
    res.status(413).json({ error: "Request is too large. Please shorten your message." });
    return;
  }
  if (err instanceof SyntaxError && "body" in err) {
    res.status(400).json({ error: "Invalid request format." });
    return;
  }
  console.error("[healthwise] error:", err.message);
  res.status(500).json({ error: "Something went wrong. Please try again." });
});

app.listen(env.port, () => {
  console.log(`[healthwise] API listening on http://localhost:${env.port} (${env.nodeEnv})`);
  console.log(`[healthwise] Demo login: ${env.demoEmail} (password from DEMO_PASSWORD)`);
  console.log(`[healthwise] Admin login: ${env.adminEmail} (password from ADMIN_PASSWORD)`);
  console.log(`[healthwise] AI provider: ${env.aiApiKey ? `configured (${env.aiModel})` : "not configured — using built-in medical knowledge"}`);
  console.log("[healthwise] No database in use — appointments live in shared server memory and are lost on restart.");
});
