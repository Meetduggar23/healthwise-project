import { normalizeText } from "./knowledge.js";

/**
 * Compact medicine briefs for the chatbot — the single shared source that
 * links chat answers to the Medicine Library.
 *
 * These briefs mirror `client/src/data/medicines.ts` (same ids, names,
 * generics, uses, and safety lines). The full catalogue lives client-side;
 * only MATCHED briefs are ever added to prompts, never the whole library.
 * A test enforces id/name consistency between the two files.
 */

export interface MedicineBrief {
  id: string;
  name: string;
  generic: string;
  brands: string[];
  keywords: string[];
  summary: string;
  warning: string;
  path: string;
}

const brief = (
  id: string,
  name: string,
  generic: string,
  brands: string[],
  keywords: string[],
  summary: string,
  warning: string,
): MedicineBrief => ({ id, name, generic, brands, keywords, summary, warning, path: `/medicines/${id}` });

export const MEDICINE_BRIEFS: MedicineBrief[] = [
  brief("paracetamol", "Paracetamol", "Paracetamol (acetaminophen)", ["Crocin", "Calpol", "Dolo"], ["paracetamol", "acetaminophen", "crocin", "calpol", "dolo", "paracitamol", "dolo 650", "bukhar dawai", "fever medicine"], "Used for mild-to-moderate pain and fever; gentle on the stomach but harmless-looking overdose can severely damage the liver.", "Never exceed the labelled amount; many cold/flu products already contain it."),
  brief("ibuprofen", "Ibuprofen", "Ibuprofen (an NSAID)", ["Brufen", "Advil", "Combiflam"], ["ibuprofen", "brufen", "advil", "combiflam", "nsaid", "ibuprufen", "period pain tablet"], "NSAID for pain, fever, and inflammation (sprains, dental, period pain).", "Can irritate the stomach and affect kidneys/heart; avoid with ulcers and in late pregnancy."),
  brief("cetirizine", "Cetirizine", "Cetirizine (antihistamine)", ["Zyrtec", "Cetzine", "Okacet"], ["cetirizine", "zyrtec", "cetzine", "okacet", "allergy tablet", "cetrizine", "chheenk"], "Antihistamine for sneezing, runny nose, itchy eyes, and hives; usually less drowsy than older options.", "Not enough alone for severe allergy with swelling or breathing trouble — call 112."),
  brief("amoxicillin", "Amoxicillin", "Amoxicillin (penicillin antibiotic)", ["Moxikind", "Amoxil", "Novamox"], ["amoxicillin", "moxikind", "amoxil", "novamox", "amoxycillin", "penicillin"], "Prescription-only penicillin antibiotic for diagnosed bacterial infections; useless against viral colds/flu.", "Complete the full course; stop and seek urgent care for allergy signs (rash with breathing trouble)."),
  brief("azithromycin", "Azithromycin", "Azithromycin (macrolide antibiotic)", ["Azithral", "Zithromax", "Azee"], ["azithromycin", "azithral", "zithromax", "azee", "azithromicin", "3 day antibiotic"], "Prescription-only macrolide, often a short 3–5 day course for specific bacterial infections.", "Not for ordinary viral coughs; report palpitations, jaundice, or severe diarrhoea."),
  brief("omeprazole", "Omeprazole", "Omeprazole (proton pump inhibitor)", ["Omez", "Prilosec", "Ocid"], ["omeprazole", "omez", "prilosec", "ocid", "omeprazol", "acidity", "khatti dakar"], "Lowers stomach acid for frequent acidity, reflux, and ulcers; usually before breakfast on medical advice.", "Chest pain must first be ruled out as cardiac; long daily use needs medical review."),
  brief("metformin", "Metformin", "Metformin (antidiabetic)", ["Glycomet", "Glucophage", "Glyciphage"], ["metformin", "glycomet", "glucophage", "glyciphage", "metformine", "sugar dawai"], "First-line type 2 diabetes medicine with diet and exercise; take with meals as directed.", "Needs kidney monitoring; seek urgent care for persistent vomiting with deep rapid breathing."),
  brief("amlodipine", "Amlodipine", "Amlodipine (calcium channel blocker)", ["Amlong", "Norvasc", "Stamlo"], ["amlodipine", "amlong", "norvasc", "stamlo", "amlodepine", "bp tablet"], "Once-daily blood pressure medicine that relaxes vessels; also used for angina.", "Ankle swelling is common; never stop because readings look normal one day."),
  brief("losartan", "Losartan", "Losartan (ARB)", ["Losar", "Cozaar", "Repace"], ["losartan", "losar", "cozaar", "repace", "losarton", "arb"], "Blood pressure medicine that also protects kidneys in diabetes.", "Must not be used in pregnancy; needs potassium/kidney monitoring."),
  brief("atorvastatin", "Atorvastatin", "Atorvastatin (statin)", ["Lipitor", "Atorva", "Storvas"], ["atorvastatin", "lipitor", "atorva", "storvas", "statin", "atorvastatine", "cholesterol tablet"], "Lowers LDL cholesterol to prevent heart attacks and strokes; usually long-term at night.", "Report severe muscle pain with dark urine urgently; avoid in pregnancy."),
  brief("levothyroxine", "Levothyroxine", "Levothyroxine (thyroid hormone)", ["Thyrox", "Eltroxin", "Thyronorm"], ["levothyroxine", "thyrox", "eltroxin", "thyronorm", "thiroyd dawai", "levothiroxine", "tsh medicine"], "Daily thyroid hormone for hypothyroidism, taken on an empty stomach; dose set by TSH tests.", "Take away from iron/calcium; essential and dose-adjusted in pregnancy."),
  brief("salbutamol-inhaler", "Salbutamol Inhaler", "Salbutamol / albuterol (reliever inhaler)", ["Asthalin", "Ventolin", "Salbair"], ["salbutamol", "asthalin", "ventolin", "inhaler", "dama pump", "saans pump", "reliever", "salbutamol"], "Quick-relief puffs that open airways within minutes during wheezing; not a cure for inflammation.", "Rising use means poor control — urgent review; severe breathlessness despite puffs is an emergency."),
  brief("ors", "Oral Rehydration Salts (ORS)", "Oral rehydration salts (glucose + electrolytes)", ["Electral", "Punarjal"], ["ors", "electral", "punarjal", "oral rehydration", "loose motion", "dast dawai", "dehydration"], "Precise salt-sugar mix that helps the gut absorb water during diarrhoea, vomiting, or heat loss.", "Mix exactly as labelled; no urine for hours, confusion, or blood in stool needs urgent care."),
  brief("vitamin-d3", "Vitamin D3", "Cholecalciferol (vitamin D3)", ["D-Rise", "Calcirol", "Tayo"], ["vitamin d", "vitamin d3", "cholecalciferol", "d-rise", "calcirol", "d3 sachet"], "Corrects tested vitamin D deficiency for bones and calcium absorption.", "Test before high-dose courses; mega-doses can dangerously raise calcium."),
  brief("iron-folic-acid", "Iron + Folic Acid (IFA)", "Ferrous salt + folic acid", ["Fefol", "Autrin", "Dexorange"], ["iron", "folic acid", "fefol", "autrin", "dexorange", "anemia tablet", "khoon ki kami", "ifa tablet"], "Treats iron-deficiency anemia; routine in pregnancy at advised amounts.", "Find the cause, not just tablets; keep iron locked away from children."),
  brief("clotrimazole-cream", "Clotrimazole Cream", "Clotrimazole 1% (antifungal)", ["Candid", "Canesten", "Surfaz"], ["clotrimazole", "candid", "canesten", "surfaz", "daad cream", "fungal cream", "ringworm"], "Antifungal cream for ringworm (daad), athlete's foot, and sweat-area infections.", "Steroid-mixed creams worsen fungus; spreading after 2 correct weeks needs review."),
];

export function findMedicineBriefs(text: string, limit = 2): MedicineBrief[] {
  const norm = ` ${normalizeText(text)} `;
  const scored: { b: MedicineBrief; s: number }[] = [];
  for (const b of MEDICINE_BRIEFS) {
    let score = 0;
    for (const k of b.keywords) {
      const kw = normalizeText(k);
      if (!kw) continue;
      if (norm.includes(` ${kw} `) || (kw.length > 5 && norm.includes(kw))) {
        score += kw.includes(" ") ? 3 : 1.6 + kw.length / 25;
      }
    }
    if (score >= 1.4) scored.push({ b, s: score });
  }
  scored.sort((a, b) => b.s - a.s);
  return scored.slice(0, Math.max(1, Math.min(limit, 3))).map((x) => x.b);
}

export function medicineBriefBlock(b: MedicineBrief): string {
  return `**${b.name}** (${b.generic}) — ${b.summary}\n**Safety note:** ${b.warning}\nFull details with uses, side effects, precautions, and sources: ${b.path} (open Medicine Library in the app menu).`;
}
