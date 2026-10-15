/**
 * Pure triage logic for the Symptom Checker (testable, no DOM).
 * Emergency patterns are checked FIRST; routine advice never precedes them.
 */

export interface CheckInput {
  regionId: string;
  regionName: string;
  symptoms: string[];
  severity: number; // 1–10
  onset: "sudden" | "gradual";
  duration: string;
}

export type TriageLevel = "emergency" | "urgent" | "routine";

export interface TriageResult {
  level: TriageLevel;
  reasons: string[];
}

/** Fragments that always mean emergency, regardless of region. */
const EMERGENCY_FRAGMENTS = [
  "worst headache",
  "facial droop",
  "slurred speech",
  "one-sided weakness",
  "chest pain or pressure",
  "difficulty breathing",
  "pain spreading to arm",
  "blood in stool or vomit",
  "severe sudden pelvic pain",
  "bladder or bowel changes",
  "cold, pale",
  "cannot bear weight",
  "deformity after injury",
  "fever with severe stiffness",
  "non-healing sore",
];

const norm = (s: string) => s.toLowerCase();

export function triageCheck(input: CheckInput): TriageResult {
  const reasons: string[] = [];
  const syms = input.symptoms.map(norm);

  const hitFrag = EMERGENCY_FRAGMENTS.find((f) => syms.some((s) => s.includes(f)));
  if (hitFrag) {
    reasons.push(`Red-flag symptom selected ("${hitFrag}")`);
  }

  // Dangerous combinations.
  const has = (frag: string) => syms.some((s) => s.includes(frag));
  if (input.regionId === "chest" && has("chest pain") && (has("breathing") || has("pain spreading"))) {
    reasons.push("Chest pain combined with breathing difficulty or spreading pain");
  }
  if (input.regionId === "leg" && has("cold, pale") && has("pain")) {
    reasons.push("Painful cold/pale limb suggests blocked circulation");
  }
  if (input.severity >= 9 && input.onset === "sudden" && ["chest", "head", "abdomen"].includes(input.regionId)) {
    reasons.push(`Sudden ${input.severity}/10 pain in a critical region`);
  }

  if (reasons.length > 0) return { level: "emergency", reasons };

  if (input.severity >= 7) reasons.push(`High pain score (${input.severity}/10)`);
  if (input.onset === "sudden") reasons.push("Sudden onset");
  if (reasons.length > 0) return { level: "urgent", reasons };

  return { level: "routine", reasons: ["No red-flag symptoms selected"] };
}

/** One-line context string handed to the chatbot via /chat?q=. */
export function checkerContext(input: CheckInput): string {
  const syms = input.symptoms.length > 0 ? input.symptoms.join(", ") : "no specific symptoms ticked";
  return (
    `I used the Symptom Checker: region ${input.regionName}, symptoms: ${syms}; ` +
    `severity ${input.severity}/10, onset ${input.onset}, duration ${input.duration || "not specified"}. ` +
    `Please explain possible causes in general terms without diagnosing me.`
  );
}
