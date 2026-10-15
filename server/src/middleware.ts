import type { Request, Response, NextFunction } from "express";

declare module "express-session" {
  interface SessionData {
    userId?: number;
    /** Admin flag kept separate from the patient session (userId). */
    adminId?: number;
  }
}

export interface AuthedRequest extends Request {
  userId: number;
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const userId = req.session?.userId;
  if (!userId) {
    res.status(401).json({ error: "Please log in to continue." });
    return;
  }
  (req as unknown as AuthedRequest).userId = userId;
  next();
}

/** Admin-only guard. Hiding links in the UI is not security — this runs server-side. */
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const adminId = req.session?.adminId;
  if (!adminId) {
    const loggedInAsPatient = Boolean(req.session?.userId);
    res.status(loggedInAsPatient ? 403 : 401).json({
      error: loggedInAsPatient
        ? "Admin access required."
        : "Please log in as an admin to continue.",
    });
    return;
  }
  next();
}

/** Returns the authenticated user's id. Call only after requireAuth. */
export function authedId(req: Request): number {
  const id = (req as unknown as AuthedRequest).userId;
  if (!id) throw new Error("Not authenticated");
  return id;
}
