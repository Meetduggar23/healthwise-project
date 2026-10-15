/**
 * Curated static health-education content for the Emergency, Library, FAQ
 * and Visit-Prep pages. General information only — no invented sources.
 * Drawn from the same curriculum as the built-in medical knowledge base.
 */

export interface EmergencyNumber {
  label: string;
  number: string;
  href: string;
  note: string;
}

export const EMERGENCY_NUMBERS: EmergencyNumber[] = [
  { label: "Integrated emergency helpline (India)", number: "112", href: "tel:112", note: "India's single emergency response number for police, fire and medical help." },
  { label: "Ambulance (Maharashtra)", number: "108", href: "tel:108", note: "Ambulance emergency service operating in Maharashtra and several other states." },
];

export interface FirstAidTopic {
  id: string;
  title: string;
  callNow: string;
  steps: string[];
}

export const FIRST_AID: FirstAidTopic[] = [
  {
    id: "bleeding",
    title: "Severe bleeding",
    callNow: "Call 112 / 108 immediately for heavy or uncontrolled bleeding.",
    steps: [
      "Press firmly on the wound with a clean cloth or bandage.",
      "Keep pressing without repeatedly lifting to check.",
      "Raise the injured part above heart level if possible.",
      "Do not remove objects stuck deep in the wound.",
    ],
  },
  {
    id: "burns",
    title: "Burns",
    callNow: "Call emergency services for large burns, burns on the face/hands/feet, or breathing difficulty.",
    steps: [
      "Cool the burn under clean running water for at least 20 minutes.",
      "Remove jewellery or tight items near the area gently.",
      "Cover loosely with a clean cloth or cling film.",
      "Do not apply ice, toothpaste, oil, or raw remedies.",
    ],
  },
  {
    id: "choking",
    title: "Choking",
    callNow: "If the person cannot breathe, cough, or speak — call emergency services at once.",
    steps: [
      "Encourage forceful coughing if they can still cough.",
      "If they cannot breathe, give up to 5 firm back blows between the shoulder blades.",
      "Follow with abdominal thrusts if trained to do so.",
      "Start CPR if trained and the person becomes unconscious.",
    ],
  },
  {
    id: "stroke",
    title: "Suspected stroke (FAST)",
    callNow: "Call 112 immediately — note the time symptoms started.",
    steps: [
      "Face: is one side drooping?",
      "Arms: can they raise both arms evenly?",
      "Speech: is speech slurred or strange?",
      "Time: get emergency help without delay; do not drive them yourself.",
    ],
  },
  {
    id: "chest-pain",
    title: "Severe chest pain",
    callNow: "Call 112 immediately for crushing chest pain, pain spreading to arm/jaw, sweating, or breathlessness.",
    steps: [
      "Stop all activity and sit or lie down.",
      "Call emergency services rather than driving to hospital.",
      "Loosen tight clothing and stay calm.",
      "Do not manage a possible heart attack through a chatbot.",
    ],
  },
  {
    id: "breathing",
    title: "Breathing difficulty",
    callNow: "Call 112 for severe breathlessness, blue lips, inability to speak, or fainting.",
    steps: [
      "Sit upright; do not lie flat.",
      "Move to fresh air and loosen tight clothing.",
      "Use a prescribed inhaler or action plan if one exists.",
      "Get emergency help first; do not wait to see if it passes.",
    ],
  },
  {
    id: "seizure",
    title: "Seizures",
    callNow: "Call emergency services if a seizure lasts over 5 minutes, repeats, or breathing is difficult.",
    steps: [
      "Cushion the head and move hard objects away.",
      "Turn the person onto their side if possible.",
      "Do not hold them down or put anything in the mouth.",
      "Note the duration and stay until recovery.",
    ],
  },
  {
    id: "allergy",
    title: "Severe allergic reaction",
    callNow: "Call 112 for swelling of lips/face/tongue, breathing trouble, or dizziness after exposure.",
    steps: [
      "Use a prescribed adrenaline auto-injector if available.",
      "Keep the person sitting upright (or lying on the side if vomiting).",
      "Do not give food, drink, or extra medicines.",
      "Send someone to meet the ambulance if possible.",
    ],
  },
  {
    id: "poisoning",
    title: "Suspected poisoning",
    callNow: "Call emergency services immediately; keep the container or label for identification.",
    steps: [
      "Do not induce vomiting unless a professional instructs it.",
      "Rinse the mouth; for chemical splashes rinse skin/eyes with water.",
      "Keep the person still and breathing comfortably.",
      "Note what was taken, how much, and when.",
    ],
  },
];

export interface LibraryEntry {
  title: string;
  en: string;
  hi?: string;
  hinglish?: string;
  tags: string[];
}

export interface LibraryCategory {
  id: string;
  title: string;
  entries: LibraryEntry[];
}

export const LIBRARY: LibraryCategory[] = [
  {
    id: "specialties",
    title: "Medical specialties",
    entries: [
      { title: "General Physician", en: "First stop for most adult concerns: fever, infections, fatigue.", hinglish: "Bukhar, infection, thakan jaise aam maslon ke liye pehle yahin jayein.", tags: ["doctor", "physician"] },
      { title: "Cardiologist", en: "Heart-related concerns: chest pain, palpitations, blood pressure.", hi: "हृदय संबंधी समस्याएं: सीने में दर्द, धड़कन, रक्तचाप।", tags: ["heart", "dil"] },
      { title: "Neurologist", en: "Headaches, seizures, tremors, numbness, nerve issues.", hinglish: "Sir dard, mirgi, kampan, sunn hona — dimaag aur nas ke doctor.", tags: ["brain", "nerve"] },
      { title: "Dermatologist", en: "Skin, hair, and nail problems.", hinglish: "Skin, baal aur nakhun ke masle.", tags: ["skin"] },
      { title: "Orthopedic", en: "Bones, joints, back pain, fractures, sports injuries.", hinglish: "Haddi, jod, kamar dard, fracture, khel ki chot.", tags: ["bone", "joint"] },
      { title: "Pediatrician", en: "Children's health, growth, and immunization.", hi: "बच्चों का स्वास्थ्य, विकास और टीकाकरण।", tags: ["child", "baby"] },
      { title: "Gynecologist", en: "Women's reproductive health, pregnancy, menstrual concerns.", tags: ["women", "pregnancy"] },
      { title: "Psychiatrist / Psychologist", en: "Mental health: stress, anxiety, depression, sleep problems.", hinglish: "Tension, anxiety, depression, neend — mansik swasthya.", tags: ["mental"] },
      { title: "Ophthalmologist", en: "Eyes and vision: cataract, glaucoma, retina, glasses.", hi: "आंखें और दृष्टि: मोतियाबिंद, काला मोतिया, पर्दा, चश्मा।", tags: ["eye"] },
      { title: "Dentist", en: "Teeth and gums: cavities, gum bleeding, tooth pain.", hinglish: "Daant aur masude: cavity, khoon, dard.", tags: ["dental"] },
      { title: "ENT specialist", en: "Ear, nose, and throat: hearing, sinus, tonsils, vertigo.", tags: ["ent", "ear", "nose"] },
      { title: "Urologist / Nephrologist", en: "Urinary tract, kidneys, prostate concerns.", hinglish: "Peshab, kidney, prostate ke masle.", tags: ["kidney", "urine"] },
    ],
  },
  {
    id: "tests",
    title: "Common medical tests",
    entries: [
      { title: "CBC (Complete Blood Count)", en: "Counts red cells, white cells, and platelets; screens for anemia and infection clues.", hinglish: "Khoon ki kami aur infection ke sanket dekhta hai.", tags: ["blood", "cbc"] },
      { title: "Blood sugar & HbA1c", en: "Fasting sugar is a snapshot; HbA1c reflects ~3-month average glucose.", hinglish: "HbA1c lagbhag 3 mahine ka ausat sugar batata hai.", tags: ["diabetes", "sugar"] },
      { title: "Lipid profile", en: "Cholesterol and triglycerides; usually needs fasting.", tags: ["cholesterol"] },
      { title: "Thyroid panel (TSH, T4)", en: "High TSH with low T4 suggests hypothyroidism; low TSH with high T4 suggests hyperthyroidism.", tags: ["thyroid"] },
      { title: "Liver function test (LFT)", en: "SGOT/SGPT, bilirubin, ALP patterns help assess liver injury or jaundice.", hi: "पीलिया और लिवर की स्थिति समझने में सहायक।", tags: ["liver"] },
      { title: "Kidney function (creatinine, eGFR)", en: "High creatinine / low eGFR suggests reduced kidney filtering; trends matter more than one value.", hinglish: "Creatinine high ya eGFR low ho to doctor se salah lein.", tags: ["kidney", "creatinine"] },
      { title: "Urine routine", en: "Screens for infection, protein, sugar, and blood in urine.", tags: ["urine", "uti"] },
      { title: "ECG", en: "Quick painless recording of the heart's electrical rhythm.", hi: "हृदय की धड़कन की विद्युत जांच।", tags: ["heart", "ecg"] },
      { title: "X-ray / Ultrasound / CT / MRI", en: "X-ray shows bones fast; ultrasound uses sound waves (no radiation); CT gives slices; MRI uses magnets.", tags: ["scan", "imaging"] },
    ],
  },
  {
    id: "first-aid",
    title: "First aid essentials",
    entries: [
      { title: "Minor cuts", en: "Rinse with clean water, press to stop bleeding, cover with a clean bandage.", hinglish: "Saaf paani se dhoyein, dabav dein, patti bandhein.", tags: ["cut", "wound"] },
      { title: "Minor burns", en: "Cool under running water 20 minutes; no ice, toothpaste, or oil.", tags: ["burn"] },
      { title: "Sprains", en: "Rest, ice wrapped in cloth 15–20 min, light compression, elevation.", tags: ["sprain"] },
      { title: "Nosebleeds", en: "Sit upright, lean slightly forward, pinch the soft nose for 15 minutes.", hinglish: "Seedha baithein, naak ke naram hisse ko 15 minute dabayein.", tags: ["nosebleed"] },
      { title: "Emergency rule", en: "Heavy bleeding, large burns, stroke signs, severe chest pain, or breathing trouble — call 112 at once.", hi: "भारी रक्तस्राव, स्ट्रोक, सीने में दर्द या सांस की तकलीफ पर तुरंत 112 पर कॉल करें।", tags: ["emergency", "112"] },
    ],
  },
  {
    id: "prevention",
    title: "Preventive healthcare",
    entries: [
      { title: "Vaccination", en: "Follow the national immunization schedule for children; adults may need boosters.", hi: "बच्चों का टीकाकरण समय पर करवाएं।", tags: ["vaccine"] },
      { title: "Cancer screening", en: "Mammography, Pap/HPV testing, stool tests/colonoscopy, and PSA discussions vary by age and risk — ask your doctor.", tags: ["cancer", "screening"] },
      { title: "Blood pressure & sugar checks", en: "Silent conditions; check periodically, especially with family history or excess weight.", hinglish: "BP-sugar me aksar lakshan nahi hote — niyamit jaanch karayein.", tags: ["bp", "diabetes"] },
      { title: "Hand hygiene", en: "Wash hands 20 seconds before cooking/eating and after toilet or coughs.", tags: ["hygiene"] },
      { title: "Mosquito & water safety", en: "Empty stagnant water weekly; use nets/repellents; drink boiled or treated water.", hi: "जमा पानी हटाएं; उबला पानी पिएं।", tags: ["dengue", "malaria"] },
    ],
  },
  {
    id: "lifestyle",
    title: "Healthy lifestyle",
    entries: [
      { title: "Balanced diet", en: "Half plate vegetables/fruits, whole grains, pulses/protein daily; limit sugar and deep-fried foods.", hinglish: "Aadhi plate sabzi-phal, dal-anaaj roz; meetha-tala kam.", tags: ["diet", "nutrition"] },
      { title: "Activity", en: "At least 150 minutes of brisk walking weekly plus light strength work twice a week.", tags: ["exercise"] },
      { title: "Sleep", en: "7–9 hours for adults; consistent timings, less screens before bed.", hinglish: "Roz 7–9 ghante neend; sone ka samay pakka rakhein.", tags: ["sleep"] },
      { title: "Hydration", en: "Drink regularly; pale-yellow urine is a good sign; use ORS for diarrhoea or heavy sweating.", tags: ["water"] },
      { title: "No tobacco", en: "There is no safe level of tobacco; quit helplines and counselling help.", hi: "तंबाकू का कोई सुरक्षित स्तर नहीं है।", tags: ["tobacco"] },
    ],
  },
  {
    id: "terms",
    title: "Common medical terms",
    entries: [
      { title: "Hypertension", en: "Persistently high blood pressure.", hi: "उच्च रक्तचाप।", hinglish: "High BP.", tags: ["bp"] },
      { title: "Anemia", en: "Low hemoglobin; causes fatigue and pallor.", hi: "खून की कमी।", hinglish: "Khoon ki kami.", tags: ["blood"] },
      { title: "Jaundice (Piliya)", en: "Yellow eyes/skin from excess bilirubin; a symptom with many causes.", hi: "आंखों-त्वचा का पीलापन।", tags: ["liver"] },
      { title: "Fever (Bukhar)", en: "Body temperature above ~100.4°F (38°C), usually fighting infection.", hi: "बुखार।", tags: ["fever"] },
      { title: "SpO2", en: "Blood oxygen saturation on a pulse oximeter; normally ~95–100%.", hinglish: "Oximeter par oxygen level.", tags: ["oxygen"] },
      { title: "BMI", en: "Body mass index from weight and height; a screening estimate, not a diagnosis.", tags: ["weight"] },
      { title: "Biopsy", en: "Tiny tissue sample examined under a microscope to confirm diagnosis.", hi: "ऊतक की सूक्ष्म जांच।", tags: ["cancer", "diagnosis"] },
      { title: "Antibiotics", en: "Kill bacteria, not viruses; take only when prescribed, full course.", hinglish: "Virus par asar nahi; doctor ke kahe par hi lein.", tags: ["medicine"] },
    ],
  },
];

export interface FaqItem {
  q: string;
  a: string;
}

export interface FaqCategory {
  id: string;
  title: string;
  items: FaqItem[];
}

export const FAQ: FaqCategory[] = [
  {
    id: "appointments",
    title: "Appointments",
    items: [
      { q: "How do I book an appointment?", a: "Log in, open Book Appointment, enter the patient name, choose a doctor or specialization, pick a date and time, add the reason, and submit. The booking is confirmed only when the app shows the success message." },
      { q: "How do I cancel an appointment?", a: "Open My Appointments, press Cancel Appointment, and confirm. The record is kept and marked Cancelled." },
      { q: "Are bookings permanently saved?", a: "No. This college demo stores bookings in the server's temporary memory, which is cleared when the server restarts. There is no database." },
      { q: "What if my preferred slot is taken?", a: "The booking form rejects duplicate slots for the same doctor and time. Please choose another time." },
    ],
  },
  {
    id: "tests",
    title: "Medical tests",
    items: [
      { q: "Do I need to fast before blood tests?", a: "Sugar and lipid tests usually need fasting — follow the lab's instructions. HbA1c does not need fasting." },
      { q: "Can the chatbot read my report?", a: "It can explain in general what a test measures, but it cannot reliably interpret your personal report. A clinician with your history should review it." },
      { q: "What does a slightly abnormal value mean?", a: "Ranges differ by lab, age, sex, and pregnancy. A mildly out-of-range value without symptoms is often rechecked rather than treated." },
    ],
  },
  {
    id: "general",
    title: "General health",
    items: [
      { q: "Is HealthWise AI a doctor?", a: "No. It is an information assistant that explains general health topics. It never diagnoses or prescribes." },
      { q: "Which languages does the chatbot understand?", a: "English, Hindi (Devanagari), Hinglish (Roman), and mixed sentences. It replies in your language style." },
      { q: "Can I use the health calculators for treatment decisions?", a: "No. BMI, age, and hydration results are educational estimates, not diagnoses. Consult a professional for medical decisions." },
    ],
  },
  {
    id: "emergency",
    title: "Emergency assistance",
    items: [
      { q: "Which number should I call in an emergency in India?", a: "Call 112, India's integrated emergency number. In Maharashtra, 108 also connects ambulance services. Availability may vary by location." },
      { q: "Should I describe emergencies to the chatbot first?", a: "No. Get emergency help first — call 112 immediately. The chatbot cannot handle emergencies." },
      { q: "Where can I find first-aid steps?", a: "Open the Emergency Help page from the navigation for short first-aid guidance and quick-dial buttons." },
    ],
  },
  {
    id: "chatbot",
    title: "Chatbot usage",
    items: [
      { q: "What can I ask the chatbot?", a: "Symptoms, conditions, nutrition, fitness, medicines (general info), tests, first aid, and which specialist to see." },
      { q: "Why did it refuse to diagnose me?", a: "A definitive diagnosis needs examination and tests. The chatbot explains possibilities and warning signs instead." },
      { q: "Are my chats private?", a: "Conversations are stored in your own browser on your device. Do not share passwords or unnecessary personal details." },
    ],
  },
];

export const VISIT_PREP_SECTIONS: { title: string; points: string[] }[] = [
  {
    title: "Before the visit",
    points: [
      "Write down your main symptoms: what, since when, what makes them better or worse.",
      "List all medicines, supplements, and allergies with doses.",
      "Note past illnesses, surgeries, and family history of major diseases.",
      "Carry previous prescriptions, test reports, and scans in date order.",
      "Check whether fasting or old records are needed for the appointment.",
    ],
  },
  {
    title: "What to bring",
    points: [
      "A photo ID and the appointment details (ID, date, time).",
      "All current medicine strips or a clear list.",
      "Previous reports — especially the most recent blood tests and scans.",
      "A short written list of your questions, most important first.",
      "A family member or friend for support during important visits.",
    ],
  },
  {
    title: "Questions you may ask your doctor",
    points: [
      "What could be causing my symptoms?",
      "Which tests do I need, and how should I prepare?",
      "What are the treatment options and their benefits and side effects?",
      "How will we know the treatment is working?",
      "Which warning signs should bring me back sooner?",
      "When should I come for follow-up?",
    ],
  },
  {
    title: "After the visit",
    points: [
      "Follow the prescription exactly; ask the pharmacist if anything is unclear.",
      "Complete full courses (antibiotics, TB medicines) even after feeling better.",
      "Keep the discharge or follow-up slip safe for the next visit.",
      "HealthWise is a college demonstration and does not provide real hospital services.",
    ],
  },
];
