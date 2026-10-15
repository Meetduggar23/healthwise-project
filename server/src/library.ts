import { Router } from "express";
import { MEDICAL_KNOWLEDGE } from "./knowledge.js";

/**
 * Shared medical-knowledge API for the Medical Library pages.
 * Single source of truth: the same MEDICAL_KNOWLEDGE the chatbot uses.
 * Content is general educational information (no secrets, no personal data),
 * so this endpoint is public like the chatbot. No database involved.
 */
export const libraryRouter = Router();

libraryRouter.get("/topics", (_req, res) => {
  res.json({
    topics: MEDICAL_KNOWLEDGE.map((t) => ({
      id: t.id,
      title: t.title,
      category: t.category ?? null,
      keywords: t.keywords,
      body: t.body,
      sources: t.sources ?? [],
    })),
  });
});
