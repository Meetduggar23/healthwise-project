import { Router } from "express";
import bcrypt from "bcryptjs";
import rateLimit from "express-rate-limit";
import { z } from "zod";
import { env } from "./env.js";
import { verifyAdminCredentials, adminProfile } from "./admin.js";
import { requireAuth } from "./middleware.js";

export const authRouter = Router();

// Slow down credential guessing on the patient login.
const loginLimiter = rateLimit({ windowMs: 10 * 60_000, max: 20, standardHeaders: true });

// Predefined demo account. The password is hashed in memory at startup and
// only ever compared on the server — it is never exposed to the frontend.
// For any public deployment, change these via the DEMO_EMAIL / DEMO_PASSWORD
// environment variables instead of editing code.
const passwordHash = bcrypt.hashSync(env.demoPassword, 10);

const demoUser = { id: 1, name: env.demoName, email: env.demoEmail };

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Please enter a valid email address."),
  password: z.string().min(1, "Please enter your password."),
});

authRouter.post("/login", loginLimiter, (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0].message });
    return;
  }
  const { email, password } = parsed.data;
  const emailOk = email === env.demoEmail;
  const passwordOk = bcrypt.compareSync(password, passwordHash);
  if (!emailOk || !passwordOk) {
    res.status(401).json({ error: "Invalid email or password. Please try again." });
    return;
  }
  req.session.regenerate((err) => {
    if (err) {
      res.status(500).json({ error: "Could not start your session. Please try again." });
      return;
    }
    req.session.userId = demoUser.id;
    res.json({ user: demoUser });
  });
});

authRouter.post("/logout", (req, res) => {
  // Clear only the patient flag so a separate admin session in the same
  // browser is preserved (and vice versa).
  req.session.userId = undefined;
  req.session.save((err) => {
    if (err) {
      res.status(500).json({ error: "Could not log you out. Please try again." });
      return;
    }
    res.json({ ok: true });
  });
});

authRouter.get("/me", requireAuth, (_req, res) => {
  res.json({ user: demoUser });
});

// ---------- Unified login ----------
// One login form accepts BOTH accounts: the patient account signs in as a
// patient, the admin account signs in as an admin. The response includes the
// role so the frontend can route to the right dashboard. The error message
// is generic so it does not reveal which account exists.
const unifiedLimiter = rateLimit({ windowMs: 10 * 60_000, max: 20, standardHeaders: true });

authRouter.post("/unified", unifiedLimiter, (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0].message });
    return;
  }
  const { email, password } = parsed.data;
  const isPatient =
    email === env.demoEmail && bcrypt.compareSync(password, passwordHash);
  const isAdmin = !isPatient && verifyAdminCredentials(email, password);
  if (!isPatient && !isAdmin) {
    res.status(401).json({ error: "Invalid email or password. Please try again." });
    return;
  }
  req.session.regenerate((err) => {
    if (err) {
      res.status(500).json({ error: "Could not start your session. Please try again." });
      return;
    }
    if (isAdmin) {
      req.session.adminId = adminProfile.id;
      res.json({ user: adminProfile, role: "admin" });
    } else {
      req.session.userId = demoUser.id;
      res.json({ user: demoUser, role: "patient" });
    }
  });
});
