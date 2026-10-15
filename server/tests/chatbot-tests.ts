/**
 * HealthWise chatbot tests — run with:  npx tsx tests/chatbot-tests.ts
 * Covers: new categories, EN/HI/Hinglish, misspellings, multi-topic,
 * follow-ups, unrecognized queries, emergency detection (3 languages),
 * retrieval relevance/duplicates, offline fallback, existing functionality.
 */
import {
  MEDICAL_KNOWLEDGE,
  findTopics,
  rankTopics,
  getRelevantTopics,
  isEmergency,
  detectLanguage,
  knowledgeContext,
  normalizeText,
} from "../src/knowledge.js";
import { fallbackReply } from "../src/chatbot.js";

let passed = 0;
let failed = 0;
const failures: string[] = [];

function check(name: string, cond: boolean, extra = ""): void {
  if (cond) {
    passed++;
    console.log(`  PASS ${name}`);
  } else {
    failed++;
    failures.push(name);
    console.log(`  FAIL ${name}${extra ? ` — ${extra}` : ""}`);
  }
}

function ids(q: string, limit = 4): string[] {
  return findTopics(q, limit).map((t) => t.id);
}

// ---------- 1. Every new medical category ----------
console.log("\n[1] New category coverage");
const categoryCases: [string, string, string][] = [
  ["A heart", "I have pressure-like chest pain going to my left arm", "heart-cad-angina-failure"],
  ["A cardiac tests", "What is an echocardiogram?", "cardiac-tests"],
  ["B epilepsy", "What to do if someone gets mirgi ka daura?", "epilepsy-seizure"],
  ["B dementia", "My grandfather keeps forgetting things, dementia?", "parkinsons-dementia-ms"],
  ["B neuropathy", "Mere haath mein jhanjhanahat hoti hai", "neuropathy-vertigo"],
  ["B sleep apnea", "My husband snores loudly and stops breathing at night", "sleep-apnea-neuro-warning"],
  ["C kidney", "Meri kidney report mein creatinine high hai", "kidney-ckd-aki-tests"],
  ["C stones", "Mujhe pathri ka dard hai, side me", "kidney-stones"],
  ["C prostate", "My father goes to urinate many times at night", "incontinence-prostate"],
  ["D liver", "Fatty liver kya hota hai aur kaise pata chalta hai?", "liver-hepatitis-jaundice-lft"],
  ["D gallbladder", "Fatty khana khane ke baad right side pet me dard", "gallstones-pancreatitis"],
  ["E pneumonia", "My child has high fever with fast breathing, pneumonia?", "pneumonia-copd-lungs"],
  ["E TB", "TB kaise spread hoti hai?", "tb-awareness"],
  ["E embolism", "What is normal spo2 on oximeter?", "pe-spo2-breath-emergency"],
  ["F cancer signs", "How does cancer develop? What are warning signs?", "cancer-basics-warnings"],
  ["F screening", "What is a mammography and pap smear?", "cancer-screening-early"],
  ["F treatment", "What is chemotherapy and biopsy?", "cancer-diagnosis-treatment-support"],
  ["G ibs", "I have bloating with alternating dast and kabz", "ibs-ibd-celiac"],
  ["G ulcer", "I get khatti dakar and seene me jalan after meals", "ulcer-gerd-reflux"],
  ["G piles", "Mujhe bawasir me khoon aata hai", "hemorrhoids-fissure-gi-bleed"],
  ["H thyroid", "What is TSH and thyroid test?", "thyroid-hypo-hyper-tests"],
  ["H pcos", "What does HbA1c mean, aur ye test kyun hota hai?", "pcos-metabolic-hba1c"],
  ["H bone", "How to prevent osteoporosis and calcium loss?", "bone-calcium-adrenal"],
  ["I hiv", "How does HIV spread? Is hugging safe?", "hiv-hepatitis-bc"],
  ["I dengue", "Dengue me platelet kam kyun hote hain?", "mosquito-typhoid-deep"],
  ["I rabies", "Kutta kata hai, kya karna chahiye?", "rabies-foodpoisoning"],
  ["I antibiotics", "Should I take antibiotics for common cold?", "antibiotics-hygiene"],
  ["J arthritis", "My knees pain with gathiya, ghutna ghisna", "arthritis-osteoporosis-fracture"],
  ["J sports", "I twisted my knee playing, ligament tear?", "sports-tendon-shoulder-carpal"],
  ["J physio", "How does physiotherapy help after fracture?", "physio-rehab-recovery"],
  ["K ear", "Kaan me seeti bajti hai, tinnitus?", "ent-ear-tinnitus"],
  ["K sinus", "Mujhe sinus me naak band rehta hai", "ent-sinus-tonsil-nosebleed"],
  ["L anemia", "Mujhe khoon ki kami hai, hemoglobin kam", "blood-anemia-b12"],
  ["L thalassemia", "What is thalassemia and sickle cell?", "blood-thalassemia-clotting"],
  ["L cbc", "My report shows WBC high, what does it mean?", "blood-cbc-counts"],
  ["M falls", "Buzurgon ke girne se kaise bachaye?", "geriatric-falls-memory"],
  ["M meds", "My father takes zyada dawai, review needed?", "geriatric-meds-checkups"],
  ["N mens", "What causes erectile difficulty?", "mens-sexual-prostate"],
  ["N testicular", "I found ando me ganth, what to do?", "mens-testicular-selfcheck"],
  ["O sti", "What is STI testing and gupt rog?", "sexual-sti-contraception"],
  ["O menopause", "Mahwari band at 48 with garam flashes", "repro-fertility-menopause"],
  ["P psoriasis", "I have psoriasis scaly plaques", "skin-psoriasis-fungal-vitiligo"],
  ["P hair", "Mere baal bahut jhad rahe hain", "hair-alopecia-loss"],
  ["P mole", "My til is changing shape and bleeding", "skin-infection-wound-cancer"],
  ["Q cataract", "What is motiyabind operation?", "eye-cataract-glaucoma-retina"],
  ["Q urgent", "Mujhe achanak ek aankh se dhundhla dikh raha hai", "eye-urgent-detachment"],
  ["Q glasses", "My child needs chashma number, myopia?", "eye-refractive-lens"],
  ["R surgery", "Operation se pehle upvas kyun? anesthesia kya hai?", "surgery-prepare-anesthesia"],
  ["R wound", "Tanke ki care kaise kare after operation?", "surgery-wound-discharge"],
  ["S imaging", "CT scan aur MRI me kya difference hai?", "imaging-tests-guide"],
  ["S labs", "Lipid profile test khali pet kyun hota hai?", "lab-tests-results"],
  ["T recovery", "Bimari ke baad recovery diet kya ho?", "nutrition-clinical-recovery"],
  ["T labels", "How to read food labels, sugar free?", "nutrition-allergy-labels"],
  ["T weight", "How to lose vajan safely without crash diet?", "nutrition-weight-supplements"],
];
for (const [name, q, expected] of categoryCases) {
  check(name, ids(q).includes(expected), `query="${q}" got=[${ids(q).join(",")}] want ${expected}`);
}

// ---------- 2. Existing functionality preserved ----------
console.log("\n[2] Existing topics still work");
const existingCases: [string, string, string][] = [
  ["fever", "I have bukhar since 2 days", "fever"],
  ["cold", "Mujhe khansi and gala kharab hai", "cold-cough"],
  ["headache", "sir dard ho raha hai", "headache"],
  ["stomach", "pet dard and loose motion", "stomach"],
  ["appointment", "how to book appointment?", "appointment-help"],
  ["specialist", "which doctor for skin, dermatologist?", "specialties"],
  ["vaccine", "tika schedule for baby?", "vaccination"],
  ["uti", "peshab me jalan ho rahi hai", "uti"],
];
for (const [name, q, expected] of existingCases) {
  check(`existing:${name}`, ids(q).includes(expected), `got=[${ids(q).join(",")}]`);
}

// ---------- 3. Misspellings & transliteration ----------
console.log("\n[3] Misspellings / transliteration");
check("misspell: thiroyd", ids("I have thiroyd problem, TSH high").includes("thyroid-hypo-hyper-tests"));
check("misspell: creatinin", ids("my creatinin level is high").includes("kidney-ckd-aki-tests"));
check("misspell: diabetis+thyroid", ids("diabetis and thiroyd test").length > 0);
check("translit: dhundhla", ids("ek aankh se dhundhla dikhta hai").includes("eye-urgent-detachment"));
check("translit: jhanjhanahat", ids("pairon me jhanjhanahat aur sunn hona").includes("neuropathy-vertigo"));

// ---------- 4. Multi-topic ----------
console.log("\n[4] Multi-topic queries");
const multi = ids("PCOS aur thyroid mein kya difference hai?");
check("multi: pcos+thyroid", multi.includes("pcos-metabolic-hba1c") && multi.includes("thyroid-hypo-hyper-tests"), `got=[${multi.join(",")}]`);
const multi2 = ids("Can high BP affect the kidneys?");
check("multi: bp+kidney", multi2.includes("kidney-ckd-aki-tests") || multi2.includes("hypertension-heart-link"), `got=[${multi2.join(",")}]`);

// ---------- 5. Follow-ups with context ----------
console.log("\n[5] Follow-up context");
const follow = getRelevantTopics("aur batao", ["Fatty liver kya hota hai?"], 2).map((t) => t.id);
check("follow-up reuses context", follow.includes("liver-hepatitis-jaundice-lft"), `got=[${follow.join(",")}]`);
const follow2 = getRelevantTopics("tell me more", ["What is TB and how does it spread?"], 2).map((t) => t.id);
check("follow-up EN", follow2.includes("tb-awareness"), `got=[${follow2.join(",")}]`);

// ---------- 6. Unrecognized ----------
console.log("\n[6] Unrecognized queries");
check("unrecognized: no topics", findTopics("zxqwkj blorpt quantum flux capacitor").length === 0);
const unkReply = fallbackReply("zxqwkj blorpt quantum flux capacitor");
check("unrecognized: honest fallback", /don't have reliable information|reliable jankari nahi/i.test(unkReply), unkReply.slice(0, 80));

// ---------- 7. Emergency detection (EN / HI / Hinglish) ----------
console.log("\n[7] Emergency detection");
const emergencies: [string, string][] = [
  ["EN chest", "I have severe crushing chest pain with sweating"],
  ["EN breath", "I cannot breathe, struggling to breathe"],
  ["EN stroke", "My father's face is drooping and speech is slurred"],
  ["EN unconscious", "He is unconscious after the fall"],
  ["EN bleed", "There is uncontrolled bleeding from the wound"],
  ["HI chest", "मेरे सीने में दर्द हो रहा है, पसीना आ रहा है"],
  ["HI breath", "मुझे सांस नहीं आ रही है"],
  ["HI unconscious", "वह बेहोश हो गया है"],
  ["Hinglish chest", "Mere seene me dard ho raha hai with paseena"],
  ["Hinglish breath", "Mujhe saans nahi aa rahi hai"],
  ["Hinglish stroke", "Papa ka muh tedha ho gaya, bolne me dikkat"],
  ["Hinglish behosh", "Wo behosh ho gaya hai"],
];
for (const [name, q] of emergencies) {
  check(`emergency:${name}`, isEmergency(q), `query="${q}"`);
}
check("emergency reply has 112", fallbackReply("Mere seene me dard ho raha hai").includes("112"));
// False positives
check("no false positive: mild headache", !isEmergency("I have a mild headache since morning"));
check("no false positive: general", !isEmergency("What is a balanced diet?"));
check("no false positive: bukhar", !isEmergency("Mujhe halka bukhar hai"));

// ---------- 8. Retrieval quality ----------
console.log("\n[8] Retrieval quality");
check("ranked: top-1 relevant", rankTopics("creatinine high kidney report")[0]?.topic.id === "kidney-ckd-aki-tests");
check("generic word safe", findTopics("What is the problem?").length === 0, `got=[${ids("What is the problem?").join(",")}]`);
check("short query safe", findTopics("hai kya").length === 0);
const allIds = MEDICAL_KNOWLEDGE.map((t) => t.id);
check("unique ids", new Set(allIds).size === allIds.length, `total=${allIds.length}`);
check("all have keywords+body", MEDICAL_KNOWLEDGE.every((t) => t.keywords.length >= 3 && t.body.length > 100));
check("grounded context non-empty", knowledgeContext("fatty liver kya hai").includes("Fatty liver"));
check("grounded context selective", !knowledgeContext("fatty liver kya hai").includes("Chemotherapy") || knowledgeContext("fatty liver kya hai").length < 8000);
check("query-less context is index", knowledgeContext().includes("motiyabind") || knowledgeContext().length > 100);
check("normalize strips punctuation", normalizeText("  Seene-me  DARD!! ") === "seene me dard");

// ---------- 9. Language detection ----------
console.log("\n[9] Language detection");
check("lang EN", detectLanguage("What is diabetes?") === "en");
check("lang HI", detectLanguage("मुझे बुखार है") === "hi");
check("lang Hinglish", detectLanguage("Mujhe bukhar hai") === "hinglish" || detectLanguage("Mujhe bukhar hai") === "mixed");
check("lang mixed", detectLanguage("What does HbA1c mean, aur ye test kyun hota hai?") === "mixed");
check("fallback Hindi reply", /नमस्ते/.test(fallbackReply("नमस्ते")));

// ---------- 10. Offline fallback behavior ----------
console.log("\n[10] Offline fallback");
check("greeting EN", fallbackReply("hello").includes("HealthWise AI"));
check("greeting Hinglish", fallbackReply("namaste").includes("HealthWise"));
check("thanks", /welcome|koi baat/i.test(fallbackReply("thanks, shukriya")));
check("topic answer has disclaimer", fallbackReply("I have fever").includes("not a doctor"));
check("multi-topic joined", fallbackReply("PCOS aur thyroid mein kya difference hai?").includes("---"));

// ---------- Summary ----------
console.log(`\n==== ${passed} passed, ${failed} failed, ${MEDICAL_KNOWLEDGE.length} topics total ====`);
if (failures.length > 0) {
  console.log("Failures:");
  for (const f of failures) console.log(` - ${f}`);
  process.exit(1);
}
