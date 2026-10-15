import dotenv from "dotenv";

dotenv.config();

function required(name: string, fallback = ""): string {
  return process.env[name] ?? fallback;
}

export const env = {
  port: parseInt(required("PORT", "4000"), 10),
  nodeEnv: required("NODE_ENV", "development"),
  sessionSecret: required("SESSION_SECRET", ""),
  // Predefined demo account (validated server-side only; never sent to the frontend).
  demoEmail: required("DEMO_EMAIL", "meetduggar@gmail.com").toLowerCase(),
  demoName: required("DEMO_NAME", "Meet Duggar"),
  demoPassword: required("DEMO_PASSWORD", "meet2005"),
  // Separate admin account for the admin dashboard (server-side only).
  // Defaults suit the local college demo; override via environment in any
  // shared/public deployment. Never expose these to the frontend.
  adminEmail: required("ADMIN_EMAIL", "admin@healthwise.in").toLowerCase(),
  adminName: required("ADMIN_NAME", "Administrator"),
  adminPassword: required("ADMIN_PASSWORD", "meet2005"),
  aiApiKey: required("AI_API_KEY"),
  aiApiBase: required("AI_API_BASE", "https://api.openai.com/v1").replace(/\/+$/, ""),
  aiModel: required("AI_MODEL", "gpt-4o-mini"),
};

if (!env.sessionSecret && env.nodeEnv === "production") {
  throw new Error("SESSION_SECRET must be set in production.");
}
