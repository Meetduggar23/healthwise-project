/**
 * Medical Library data layer — fetches the shared chatbot knowledge base
 * (GET /api/knowledge/topics) once and caches it. No duplicated medical
 * content: categorization below is metadata only (topic → category mapping).
 */

export interface LibTopic {
  id: string;
  title: string;
  category: string | null;
  keywords: string[];
  body: string;
  sources: string[];
}

/** Display categories (populated only when topics exist). */
export const DISPLAY_ORDER = [
  "General Health and Preventive Care",
  "Symptoms and Warning Signs",
  "Digestive System",
  "Heart and Circulatory System",
  "Brain and Nervous System",
  "Respiratory System",
  "Kidney and Urinary System",
  "Liver and Pancreas",
  "Hormonal and Endocrine Health",
  "Blood Disorders",
  "Bones, Muscles and Joints",
  "Skin, Hair and Nails",
  "Eyes and Vision",
  "Ear, Nose and Throat",
  "Women's Health",
  "Men's Health",
  "Pregnancy and Maternal Health",
  "Child and Adolescent Health",
  "Older Adult Health",
  "Mental Health",
  "Infectious Diseases",
  "Common Indian and Seasonal Illnesses",
  "Allergies and Immune System",
  "Nutrition and Vitamin Deficiencies",
  "Medicines and Medication Safety",
  "First Aid and Emergency Care",
  "Medical Tests and Diagnostics",
  "Imaging and Scans",
  "Surgery and Recovery",
  "Cancer Awareness",
  "Vaccination and Immunization",
  "Sexual and Reproductive Health",
];

/** Topics intentionally excluded (app navigation help, not medical knowledge). */
export const EXCLUDED_IDS = new Set(["appointment-help"]);

/** Legacy topics (no category field) mapped to display categories. */
const LEGACY_CATEGORY: Record<string, string> = {
  emergency: "First Aid and Emergency Care",
  fever: "Symptoms and Warning Signs",
  "cold-cough": "Symptoms and Warning Signs",
  headache: "Symptoms and Warning Signs",
  stomach: "Digestive System",
  nutrition: "General Health and Preventive Care",
  sleep: "General Health and Preventive Care",
  exercise: "General Health and Preventive Care",
  "first-aid": "First Aid and Emergency Care",
  "mental-health": "Mental Health",
  "blood-pressure": "Heart and Circulatory System",
  tests: "Medical Tests and Diagnostics",
  medicines: "Medicines and Medication Safety",
  specialties: "General Health and Preventive Care",
  hydration: "General Health and Preventive Care",
  allergies: "Allergies and Immune System",
  asthma: "Respiratory System",
  "back-joint-pain": "Bones, Muscles and Joints",
  skin: "Skin, Hair and Nails",
  "eye-health": "Eyes and Vision",
  dental: "General Health and Preventive Care",
  pregnancy: "Pregnancy and Maternal Health",
  "child-health": "Child and Adolescent Health",
  "monsoon-illnesses": "Common Indian and Seasonal Illnesses",
  "womens-health": "Women's Health",
  "vitamins-immunity": "Nutrition and Vitamin Deficiencies",
  "tobacco-alcohol": "General Health and Preventive Care",
  "heat-safety": "Common Indian and Seasonal Illnesses",
  uti: "Kidney and Urinary System",
  vaccination: "Vaccination and Immunization",
};

/** Newer topic categories normalized to display categories. */
const CATEGORY_NORMALIZE: Record<string, string> = {
  "Heart and Circulatory Health": "Heart and Circulatory System",
  "Brain and Nervous System": "Brain and Nervous System",
  "Kidney and Urinary Health": "Kidney and Urinary System",
  "Liver, Gallbladder and Pancreas": "Liver and Pancreas",
  "Respiratory and Lung Diseases": "Respiratory System",
  "Cancer Awareness and Prevention": "Cancer Awareness",
  "Digestive and Intestinal Diseases": "Digestive System",
  "Endocrine and Hormonal Health": "Hormonal and Endocrine Health",
  "Infectious Diseases and Public Health": "Infectious Diseases",
  "Orthopedics and Rehabilitation": "Bones, Muscles and Joints",
  "Ear, Nose and Throat Health": "Ear, Nose and Throat",
  "Blood Disorders": "Blood Disorders",
  "Geriatric and Preventive Healthcare": "Older Adult Health",
  "Men's Health": "Men's Health",
  "Sexual and Reproductive Health": "Sexual and Reproductive Health",
  "Dermatology and Hair Disorders": "Skin, Hair and Nails",
  "Eye Diseases Beyond Eye Strain": "Eyes and Vision",
  "Surgery and Hospital Care": "Surgery and Recovery",
  "Medical Imaging and Diagnostic Procedures": "Imaging and Scans",
  "Nutrition Science and Clinical Nutrition": "Nutrition and Vitamin Deficiencies",
  "General Health": "General Health and Preventive Care",
  "Pregnancy and Maternal Health": "Pregnancy and Maternal Health",
  "Child and Adolescent Health": "Child and Adolescent Health",
  "Mental Health": "Mental Health",
};

/** Per-topic overrides where the category alone would misfile the entry. */
const ID_CATEGORY_OVERRIDE: Record<string, string> = {
  "imaging-tests-guide": "Imaging and Scans",
  "lab-tests-results": "Medical Tests and Diagnostics",
  "cardiac-tests": "Medical Tests and Diagnostics",
  "blood-cbc-counts": "Medical Tests and Diagnostics",
  "thyroid-hypo-hyper-tests": "Hormonal and Endocrine Health",
  "kidney-ckd-aki-tests": "Kidney and Urinary System",
  "liver-hepatitis-jaundice-lft": "Liver and Pancreas",
  "pe-spo2-breath-emergency": "Respiratory System",
  "sleep-apnea-neuro-warning": "Respiratory System",
  "cancer-screening-early": "Cancer Awareness",
  "antibiotics-hygiene": "Medicines and Medication Safety",
  "nutrition-weight-supplements": "Nutrition and Vitamin Deficiencies",
  "geriatric-meds-checkups": "Medicines and Medication Safety",
};

export function displayCategory(t: LibTopic): string | null {
  if (EXCLUDED_IDS.has(t.id)) return null;
  if (ID_CATEGORY_OVERRIDE[t.id]) return ID_CATEGORY_OVERRIDE[t.id];
  if (t.category && CATEGORY_NORMALIZE[t.category]) return CATEGORY_NORMALIZE[t.category];
  if (LEGACY_CATEGORY[t.id]) return LEGACY_CATEGORY[t.id];
  return "General Health and Preventive Care";
}

/** Broad topic type for the type filter. */
export function topicType(t: LibTopic, category: string): string {
  if (["Medical Tests and Diagnostics", "Imaging and Scans"].includes(category)) return "Tests & scans";
  if (category === "Medicines and Medication Safety") return "Medicines";
  if (category === "First Aid and Emergency Care") return "First aid & emergency";
  if (["Symptoms and Warning Signs"].includes(category)) return "Symptoms";
  void t;
  return "Conditions";
}

export const SOURCE_URLS: Record<string, string> = {
  "World Health Organization": "https://www.who.int/",
  MedlinePlus: "https://medlineplus.gov/",
  "National Health Service (NHS)": "https://www.nhs.uk/",
  "Centers for Disease Control and Prevention (CDC)": "https://www.cdc.gov/",
  "National Health Mission, India": "https://nhm.gov.in/",
  "Ministry of Health and Family Welfare, India": "https://mohfw.gov.in/",
};

export const POPULAR_IDS = [
  "fever",
  "stomach",
  "abdominal-pain-guide",
  "headache",
  "blood-pressure",
  "uti",
];

const RECENT_KEY = "healthwise.medlib.recent.v1";

export function readRecentIds(): string[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(RECENT_KEY) ?? "[]") as string[];
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

export function rememberTopic(id: string) {
  try {
    const list = readRecentIds().filter((x) => x !== id);
    localStorage.setItem(RECENT_KEY, JSON.stringify([id, ...list].slice(0, 8)));
  } catch {
    /* private mode — recent list simply stays empty */
  }
}

let cache: LibTopic[] | null = null;

export async function fetchTopics(): Promise<LibTopic[]> {
  if (cache) return cache;
  const res = await fetch("/api/knowledge/topics", { credentials: "include" });
  if (!res.ok) throw new Error(`Library unavailable (${res.status}). Please try again.`);
  const data = (await res.json()) as { topics?: LibTopic[] };
  if (!Array.isArray(data.topics)) throw new Error("Library returned an unexpected response.");
  cache = data.topics;
  return cache;
}

/** Search across titles, keywords (EN/HI/Hinglish), and body text. */
export function searchTopics(topics: LibTopic[], query: string): LibTopic[] {
  const q = query.trim().toLowerCase();
  if (!q) return topics;
  const words = q.split(/\s+/);
  const scored = topics.map((t) => {
    if (EXCLUDED_IDS.has(t.id)) return { t, s: -1 };
    const title = t.title.toLowerCase();
    const keys = t.keywords.join(" ").toLowerCase();
    const body = t.body.toLowerCase();
    let s = 0;
    for (const w of words) {
      if (title.includes(w)) s += 5;
      if (keys.includes(w)) s += 3;
      if (body.includes(w)) s += 1;
    }
    return { t, s };
  });
  return scored
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s || a.t.title.localeCompare(b.t.title))
    .map((x) => x.t);
}

/** Split a topic body into sections on **Heading:** / **Heading** lines. */
export interface TopicSection {
  heading: string | null;
  lines: string[];
}

export function parseSections(body: string): TopicSection[] {
  const sections: TopicSection[] = [];
  let current: TopicSection = { heading: null, lines: [] };
  for (const raw of body.split("\n")) {
    const line = raw.trim();
    if (!line) continue;
    const m = line.match(/^\*\*(.+?)\*\*:?\s*(.*)$/);
    if (m) {
      if (current.heading !== null || current.lines.length > 0) sections.push(current);
      current = { heading: m[1].replace(/:$/, ""), lines: m[2] ? [m[2]] : [] };
    } else {
      current.lines.push(line);
    }
  }
  if (current.heading !== null || current.lines.length > 0) sections.push(current);
  return sections;
}
