import { Router } from "express";
import bcrypt from "bcryptjs";
import rateLimit from "express-rate-limit";
import { z } from "zod";
import { env } from "./env.js";
import { requireAdmin } from "./middleware.js";

/**
 * Separate admin authentication. Credentials come from server-side
 * environment variables (ADMIN_EMAIL / ADMIN_PASSWORD) and the password
 * hash never leaves the backend. The admin flag (session.adminId) is
 * independent of the patient flag (session.userId).
 */
export const adminRouter = Router();

// Slow down credential guessing on the admin login.
const adminLoginLimiter = rateLimit({ windowMs: 10 * 60_000, max: 20, standardHeaders: true });

const adminPasswordHash = bcrypt.hashSync(env.adminPassword, 10);

const adminUser = { id: 1, name: env.adminName, email: env.adminEmail };

/** Public admin profile (id/name/email only — never a secret). */
export const adminProfile = { ...adminUser };

/** Verifies admin credentials server-side (for reuse by the unified login). */
export function verifyAdminCredentials(email: string, password: string): boolean {
  return email === env.adminEmail && bcrypt.compareSync(password, adminPasswordHash);
}

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Please enter a valid email address."),
  password: z.string().min(1, "Please enter your password."),
});

adminRouter.post("/login", adminLoginLimiter, (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0].message });
    return;
  }
  const { email, password } = parsed.data;
  if (!verifyAdminCredentials(email, password)) {
    res.status(401).json({ error: "Invalid admin email or password." });
    return;
  }
  req.session.regenerate((err) => {
    if (err) {
      res.status(500).json({ error: "Could not start your session. Please try again." });
      return;
    }
    req.session.adminId = adminUser.id;
    res.json({ user: adminUser });
  });
});

adminRouter.post("/logout", (req, res) => {
  req.session.adminId = undefined;
  req.session.save((err) => {
    if (err) {
      res.status(500).json({ error: "Could not log you out. Please try again." });
      return;
    }
    res.json({ ok: true });
  });
});

adminRouter.get("/me", requireAdmin, (_req, res) => {
  res.json({ user: adminUser });
});
