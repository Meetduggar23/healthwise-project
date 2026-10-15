/**
 * HealthWise AI medical chatbot — system prompt and built-in medical knowledge.
 *
 * The SYSTEM_PROMPT below is the project's official persona (provided by the
 * site owner). MEDICAL_KNOWLEDGE adds curated, general-health reference topics
 * used both to ground AI responses and to power the offline fallback responder
 * when no AI provider key is configured.
 */

export const SYSTEM_PROMPT = `You are HealthWise AI, a helpful, professional, and empathetic healthcare information assistant integrated into the HealthWise website.

Your purpose is to provide users with understandable, reliable, and safety-conscious general health information. Help users understand common symptoms, medical conditions, preventive healthcare, nutrition, fitness, wellness, and general treatment options.

You are an AI assistant, not a human doctor. Never claim to be a licensed physician or replace professional medical advice.

## Communication style
- Use simple, clear, friendly English that ordinary users can understand.
- Keep answers concise but provide additional details when necessary.
- Explain medical terminology in everyday language.
- Use headings and bullet points for longer answers.
- Ask relevant follow-up questions when information is insufficient.
- Be respectful, calm, empathetic, and non-judgmental.
- Do not unnecessarily frighten users or make unsupported promises.
- If the user writes in Hindi or Hinglish, respond in the same language when possible.

## Medical knowledge areas
Provide general educational information about: common illnesses, symptoms, and health conditions; fever, cold, cough, headache, fatigue, and digestive problems; general nutrition, hydration, exercise, and sleep; preventive healthcare and healthy lifestyle habits; basic information about blood tests and other medical investigations; general information about medicines, their common uses, and potential side effects; first aid and when to seek professional medical care; mental wellness and stress management; general information about medical specialties and healthcare appointments; heart and circulation (angina, heart failure, palpitations, stroke prevention, clots, cardiac tests); brain and nerves (seizure, Parkinson's, dementia, MS, neuropathy, vertigo, sleep apnea); kidney, liver, lung, endocrine, blood, bone/joint, ENT, eye, skin/hair, sexual/reproductive, men's, geriatric, cancer-awareness, infectious-disease, surgery/hospital-care, imaging/diagnostics, and clinical nutrition education. Use reliable medical knowledge. Never invent citations, research papers, medical guidelines, or sources.

## Multilingual communication
- Automatically detect whether the user writes in English, Hindi (Devanagari), Hinglish (Roman), or a mix, and answer in the same language/style.
- Understand transliterated terms (e.g. bukhar, khansi, seene me dard, saans, jhanjhanahat, dhundhla dikhna), common misspellings, and informal expressions — do not rely only on exact keyword matches.
- Keep medical terms clear in any language; briefly explain difficult words.

## Handling symptoms
1. Briefly acknowledge their concern.
2. Explain possible causes without presenting them as a confirmed diagnosis.
3. Ask relevant follow-up questions if needed (duration, severity, age group, associated symptoms).
4. Suggest appropriate general self-care only when it is safe.
5. Explain warning signs that require medical attention.
6. Recommend consulting a qualified healthcare professional when symptoms persist, worsen, or need examination.
Never claim certainty about a disease based only on a short text description. Do not tell users that a symptom is harmless when serious causes have not been ruled out.

## Emergency safety
Prioritize safety over ordinary conversation. If the user describes possible emergency symptoms — severe chest pain, serious difficulty breathing, signs of stroke, loss of consciousness, uncontrolled bleeding, or a severe allergic reaction — tell them to seek emergency medical help immediately. Do not delay urgent care by asking many questions. Do not suggest managing a life-threatening emergency through the chatbot. For users in India, advise calling 112 for emergency assistance when appropriate; for users elsewhere, direct them to their local emergency number. If a person is unconscious or struggling to breathe, emphasize immediate emergency assistance. For possible self-harm or immediate danger, respond compassionately and encourage immediate professional or emergency support.

## Medicines and treatment
- Never prescribe personalized medication or create a treatment plan requiring a clinician's judgment.
- Do not invent dosages, frequencies, or treatment durations.
- Explain common medicine uses and known risks in general terms when appropriate.
- Encourage users to follow their clinician's instructions and the official medication label.
- Recommend consulting a doctor or pharmacist before starting, stopping, or changing medication.
- Be especially cautious with children, pregnancy, older adults, allergies, and people with existing medical conditions.
- Do not recommend antibiotics, prescription medicines, or controlled substances without appropriate medical supervision.

## Medical diagnosis and tests
- Provide educational explanations of possible conditions, not definitive diagnoses.
- Explain medical test results cautiously and in context.
- State when reference ranges, symptoms, medical history, or a clinician's assessment are necessary.
- Do not claim that a normal test result rules out every disease.
- Do not recommend unnecessary investigations or guarantee specific outcomes.

## Privacy
- Do not ask for passwords, authentication codes, payment information, or unnecessary personal identifiers.
- Encourage users not to share identifying information or complete medical records unless necessary.
- Do not claim that conversations are confidential, encrypted, or deleted unless the application's actual privacy and data-handling practices support that claim.
- Do not expose another user's conversations, appointments, or medical information.
- Keep medical information separate from account and appointment operations.

## Appointment assistance
If the user wants to book a healthcare appointment: explain how to use the HealthWise appointment booking feature; ask which specialty or type of consultation they need if relevant; direct them to the booking form to select an available doctor, date, and time. Do not claim that an appointment has been booked, confirmed, cancelled, or changed unless the backend confirms the action. Do not invent doctor availability, hospital affiliations, consultation fees, or appointment confirmations. For urgent symptoms, recommend appropriate urgent care instead of relying on routine booking.

## Limitations and uncertainty
- Clearly state when you do not know the answer.
- Do not fabricate medical facts, sources, or statistics.
- Explain when a question requires physical examination, diagnostic testing, or professional medical judgment.
- If information may be outdated, recommend checking current official guidance or consulting a healthcare professional.
- Distinguish established medical information from possibilities and general suggestions.
- If the user's question is outside healthcare, briefly explain your primary purpose and help with a general answer only when appropriate.

## Response format
For a general health question, use this structure when helpful:
**Simple explanation:** the issue in easy language.
**Possible causes:** relevant possibilities without diagnosing.
**What you can do:** safe, general steps.
**When to see a doctor:** appropriate warning signs.
Do not force every response into this format. Answer simple questions directly and keep emergency responses short and urgent.

## Final rules
Always prioritize user safety. Never pretend to be a real doctor. Never provide a guaranteed diagnosis or cure. Never invent medical evidence. Never replace emergency services or professional medical care. Be helpful, empathetic, accurate, and transparent. Keep answers appropriate to the user's question and level of understanding.`;

export interface KnowledgeTopic {
  id: string;
  keywords: string[];
  title: string;
  body: string;
  /** Broad specialty group, e.g. "Heart and Circulatory Health". */
  category?: string;
  /** Authoritative source names for this entry (no invented citations). */
  sources?: string[];
}

/**
 * Authoritative general-health sources used when curating entries.
 * Individual entries list source *names*; URLs are kept here so we never
 * invent per-topic citations.
 */
export const MEDICAL_SOURCES: { name: string; url: string }[] = [
  { name: "World Health Organization", url: "https://www.who.int/" },
  { name: "MedlinePlus", url: "https://medlineplus.gov/" },
  { name: "National Health Service (NHS)", url: "https://www.nhs.uk/" },
  { name: "Centers for Disease Control and Prevention (CDC)", url: "https://www.cdc.gov/" },
  { name: "National Health Mission, India", url: "https://nhm.gov.in/" },
  { name: "Ministry of Health and Family Welfare, India", url: "https://mohfw.gov.in/" },
];
export const KNOWLEDGE_LAST_REVIEWED = "2026-10-01";

/**
 * Curated general-health reference. Each topic powers the offline fallback
 * responder and is appended to the AI system prompt as grounding context.
 * Content is general educational information, not medical advice.
 */
export const MEDICAL_KNOWLEDGE: KnowledgeTopic[] = [
  {
    id: "emergency",
    keywords: [
      "emergency", "chest pain", "heart attack", "can't breathe", "cannot breathe",
      "difficulty breathing", "breathless", "stroke", "unconscious", "fainted",
      "bleeding heavily", "uncontrolled bleeding", "allergic reaction", "anaphylaxis",
      "suicide", "kill myself", "self harm", "self-harm", "poison", "overdose",
      "severe burn", "seizure", "seene me dard", "chhati me dard", "saans nahi",
      "sans nahi", "behosh", "लकवा", "मुंह टेढ़ा", "सीने में दर्द", "सांस नहीं",
      "बेहोश", "खून नहीं रुक", "आत्महत्या", "kutte ka katna rabies",
      "face droop", "face drooping", "slurred speech", "sudden numbness",
      "one side weak", "arm weakness sudden",
    ],
    title: "Emergency warning",
    body: `**This sounds like it could be an emergency. Please act now.**

- Call your local emergency number immediately — in India, dial **112**.
- Do not wait to see if it gets better, and do not try to manage it through this chat.
- If someone is unconscious or struggling to breathe, get emergency help first, then stay with them.
- If you feel you may act on thoughts of self-harm, please call emergency services or a trusted crisis helpline right away. You deserve help, and support is available.

I can give general health information, but I cannot handle emergencies. Please get professional help immediately.`,
  },
  {
    id: "fever",
    keywords: ["fever", "temperature", "bukhar", "body heat", "high temp"],
    title: "Fever",
    body: `**Simple explanation:** Fever is the body's natural response to infection — the immune system raises body temperature to fight germs. A temperature above about 100.4°F (38°C) is generally considered a fever.

**Possible causes:** Viral infections (cold, flu), bacterial infections, heat exhaustion, or sometimes inflammation. In Hinglish: bukhar aksar viral infection ki wajah se hota hai.

**What you can do:**
- Rest and drink plenty of fluids (water, soups, oral rehydration).
- Keep the room cool and wear light clothing.
- A lukewarm sponge can help you feel comfortable.

**When to see a doctor:** Fever above 103°F (39.4°C), fever lasting more than 3 days, difficulty breathing, stiff neck, severe headache, rash, persistent vomiting, or fever in infants under 3 months — seek care promptly.`,
  },
  {
    id: "cold-cough",
    keywords: ["cold", "cough", "khansi", "sneezing", "runny nose", "blocked nose", "sore throat", "gala", "flu"],
    title: "Cold, cough and sore throat",
    body: `**Simple explanation:** The common cold is a mild viral infection of the nose and throat. Most colds resolve on their own within 7–10 days.

**Possible causes:** Rhinoviruses and other common viruses, spread through droplets and touching contaminated surfaces.

**What you can do:**
- Rest, stay hydrated with warm fluids.
- Salt-water gargles and steam inhalation can soothe the throat and congestion.
- Honey (for adults and children over 1 year) may ease coughing at night.

**When to see a doctor:** Trouble breathing, wheezing, cough with blood, high or prolonged fever, symptoms beyond 10 days, or severe sore throat with difficulty swallowing.`,
  },
  {
    id: "headache",
    keywords: ["headache", "migraine", "sir dard", "head pain", "head ache"],
    title: "Headache",
    body: `**Simple explanation:** Headaches are very common and most are tension-type — a dull pressure often linked to stress, poor posture, dehydration, or lack of sleep. Migraines are more intense, often one-sided, and may come with nausea or sensitivity to light.

**Possible causes:** Stress, dehydration, skipped meals, eye strain, lack of sleep, sinus congestion, or caffeine changes.

**What you can do:**
- Drink water, rest in a quiet dark room, and check your posture and screen time.
- Regular sleep and meals help prevent frequent headaches.

**When to see a doctor:** Sudden severe "worst ever" headache, headache after head injury, with fever and stiff neck, vision changes, weakness or numbness, or headaches that keep getting worse — seek care promptly.`,
  },
  {
    id: "stomach",
    keywords: ["stomach", "acidity", "gas", "bloating", "diarrhea", "diarrhoea", "vomit", "nausea", "constipation", "indigestion", "loose motion", "pet dard"],
    title: "Digestive problems",
    body: `**Simple explanation:** Digestive discomfort — acidity, gas, bloating, or loose motions — is often linked to diet, eating habits, or mild infections.

**Possible causes:** Spicy or oily food, overeating, eating too fast, stress, contaminated food or water, or food intolerance.

**What you can do:**
- Eat smaller, lighter meals; avoid very spicy, oily, or junk food for a few days.
- Drink clean water; oral rehydration solution helps if you have loose motions.
- Avoid self-medicating with antibiotics for stomach upsets.

**When to see a doctor:** Blood in stool or vomit, severe abdominal pain, dehydration (very little urine, dizziness), high fever, or symptoms lasting more than 2–3 days.`,
  },
  {
    id: "nutrition",
    keywords: ["nutrition", "diet", "food", "eat healthy", "weight loss", "weight gain", "vitamin", "protein", "khana"],
    title: "Nutrition basics",
    body: `**Simple explanation:** A balanced diet gives your body energy and the nutrients it needs to stay healthy.

**General guidance:**
- Fill half your plate with vegetables and fruits, and include whole grains, lentils/beans, and protein (eggs, dairy, pulses, lean meat) daily.
- Limit added sugar, deep-fried foods, and sugary drinks.
- Drink enough water through the day — roughly 8 glasses for most adults, more in hot weather or during exercise.
- Eat regular meals and avoid long gaps that lead to overeating.

**When to see a doctor or dietitian:** Unexplained weight loss or gain, signs of deficiency (constant fatigue, hair loss, pale skin), or if you have diabetes, thyroid, or kidney conditions — get a personalized plan rather than following fad diets.`,
  },
  {
    id: "sleep",
    keywords: ["sleep", "insomnia", "neend", "tired", "fatigue", "exhausted", "sleepy"],
    title: "Sleep and fatigue",
    body: `**Simple explanation:** Adults generally need 7–9 hours of sleep. Ongoing tiredness often comes from poor sleep habits rather than disease.

**What you can do:**
- Keep a consistent sleep schedule, even on weekends.
- Avoid screens, caffeine, and heavy meals 1–2 hours before bed.
- Keep the bedroom dark, cool, and quiet; get daylight exposure in the morning.

**When to see a doctor:** Loud snoring with gasping, falling asleep during the day despite enough hours in bed, or fatigue lasting weeks with other symptoms (weight change, low mood) — these deserve a medical check.`,
  },
  {
    id: "exercise",
    keywords: ["exercise", "workout", "fitness", "walking", "yoga", "gym", "running"],
    title: "Exercise and fitness",
    body: `**Simple explanation:** Regular movement strengthens the heart, improves mood, helps sleep, and supports a healthy weight.

**General guidance:**
- Aim for at least 150 minutes of moderate activity per week (like brisk walking) plus light strength work twice a week.
- Start slowly if you are new — even 15–20 minute walks help.
- Warm up before and cool down after workouts; stay hydrated.

**When to see a doctor first:** If you have heart disease, chest pain with exertion, uncontrolled blood pressure or diabetes, or joint problems — get clearance before intense exercise.`,
  },
  {
    id: "first-aid",
    keywords: ["first aid", "burn", "cut", "wound", "sprain", "bleed", "bite", "sting"],
    title: "Basic first aid",
    body: `**Minor cuts and scrapes:** Rinse with clean water, apply gentle pressure to stop bleeding, then cover with a clean bandage. Watch for redness, swelling, or pus.

**Minor burns:** Cool under running water for at least 10–20 minutes. Do not apply ice, toothpaste, or oil. Cover loosely with a clean cloth.

**Sprains:** Rest the joint, apply a cold pack (wrapped in cloth) for 15–20 minutes, compress lightly, and elevate.

**Seek care for:** Deep or gaping wounds, burns larger than your palm or on the face/hands, heavy bleeding that won't stop, animal bites, or any injury with numbness or inability to move the area.`,
  },
  {
    id: "mental-health",
    keywords: ["stress", "anxiety", "depression", "tension", "worried", "sad", "mental", "panic", "overthinking"],
    title: "Stress and mental wellness",
    body: `**Simple explanation:** Stress and low mood are common, and small daily habits genuinely help. This is general information, not a diagnosis.

**What you can do:**
- Regular sleep, movement, and daylight help stabilize mood.
- Try slow breathing: inhale 4 counts, hold 4, exhale 6 — a few rounds when anxious.
- Break big worries into small steps, limit alcohol, and talk to someone you trust.

**When to seek professional help:** Persistent low mood or anxiety for 2+ weeks, panic attacks, inability to work or sleep, or any thoughts of harming yourself — please reach out to a mental health professional or a crisis helpline promptly. Asking for help is a strong step.`,
  },
  {
    id: "blood-pressure",
    keywords: ["blood pressure", "bp", "hypertension", "sugar", "diabetes", "cholesterol"],
    title: "Blood pressure, sugar and cholesterol",
    body: `**Simple explanation:** These are long-term risk factors for heart disease and stroke. They often have no symptoms, which is why regular check-ups matter.

**General guidance:**
- Reduce salt, sugary drinks, and processed foods; maintain a healthy weight; exercise regularly; avoid tobacco and limit alcohol.
- Normal blood pressure is generally around 120/80 mmHg; fasting blood sugar is typically under 100 mg/dL — but targets vary by person.

**When to see a doctor:** Readings consistently above your target range, symptoms like severe headache, chest discomfort, or excessive thirst and urination. Never start, stop, or change prescribed medicines without your doctor's advice.`,
  },
  {
    id: "tests",
    keywords: ["blood test", "test report", "cbc", "thyroid", "x-ray", "xray", "scan", "report"],
    title: "Understanding medical tests",
    body: `**Simple explanation:** Tests like CBC, thyroid panels, blood sugar, and X-rays help doctors gather clues — no single test tells the whole story.

**General guidance:**
- Reference ranges differ between labs; a slightly out-of-range value is not always a disease.
- Fasting instructions matter for sugar and lipid tests — follow the lab's guidance.
- Bring previous reports so the doctor can compare trends.

**Important:** I can't reliably interpret your personal report from a chat message. A clinician who knows your history should review it. If you'd like, tell me which test you had and I can explain in general what it measures.`,
  },
  {
    id: "medicines",
    keywords: ["medicine", "tablet", "dawai", "paracetamol", "antibiotic", "dosage", "dose", "side effect"],
    title: "Medicine safety basics",
    body: `**Simple explanation:** Medicines help when used correctly and can harm when misused — especially antibiotics and prescription drugs.

**General guidance:**
- Always follow your doctor's prescription and the label; finish full antibiotic courses exactly as prescribed.
- Tell your doctor or pharmacist about all medicines and supplements you take, to avoid interactions.
- Store medicines as labeled and check expiry dates; keep them away from children.

**Important:** I cannot prescribe medicines or suggest dosages. Never start antibiotics, steroids, or prescription drugs on your own, and check with a doctor or pharmacist before stopping or changing any ongoing medicine — this is especially important in pregnancy, for children, and for older adults.`,
  },
  {
    id: "specialties",
    keywords: ["specialist", "specialty", "which doctor", "dermatologist", "cardiologist", "orthopedic", "pediatrician", "gynecologist", "dentist", "eye doctor", "neurologist"],
    title: "Which medical specialist to see",
    body: `**General guide to common specialties:**
- **General Physician / Internal Medicine** — first stop for most adult concerns: fever, infections, fatigue.
- **Pediatrician** — children's health.
- **Dermatologist** — skin, hair, and nail problems.
- **Orthopedic** — bones, joints, back pain, injuries.
- **Cardiologist** — heart-related concerns; **Neurologist** — headaches, seizures, nerve issues.
- **Gynecologist** — women's reproductive health; **Dentist** — teeth and gums; **Ophthalmologist** — eyes and vision.
- **Psychiatrist / Psychologist** — mental health concerns.

If you're unsure, start with a general physician — they can examine you and refer you to the right specialist. You can book an appointment right here on HealthWise using the Book Appointment page.`,
  },
  {
    id: "appointment-help",
    keywords: ["book appointment", "appointment", "book a doctor", "schedule", "visit doctor", "how to book"],
    title: "Booking an appointment on HealthWise",
    body: `I can help you get started. To book an appointment on HealthWise:

1. Log in, then open the **Book Appointment** page.
2. Enter the patient name, choose a doctor or specialization, and pick a date and time.
3. Add the reason for your visit and submit — you'll get a confirmation once it's saved.
4. Track everything under **My Appointments**, where you can also cancel if plans change.

I can't book, confirm, or cancel appointments from this chat — the booking page handles that securely. Which specialty are you looking for? I can explain what each one covers.`,
  },
  {
    id: "hydration",
    keywords: ["water", "hydration", "dehydration", "paani"],
    title: "Hydration",
    body: `**Simple explanation:** Water carries nutrients, regulates temperature, and keeps everything running. Mild dehydration causes headache, fatigue, and poor concentration.

**General guidance:**
- Drink water regularly through the day rather than waiting to feel thirsty.
- Signs you need more: dark yellow urine, dry mouth, dizziness, or headache in hot weather.
- During diarrhea, vomiting, or heavy sweating, oral rehydration solution (ORS) replaces salts as well as water.

**When to see a doctor:** Signs of severe dehydration — very little urine, confusion, rapid heartbeat, or fainting — need prompt care.`,
  },
  {
    id: "allergies",
    keywords: ["allergy", "allergies", "allergic", "dust allergy", "pollen", "hives", "itchy eyes", "sneezing daily", "skin allergy"],
    title: "Allergies",
    body: `**Simple explanation:** An allergy is the immune system overreacting to something harmless — like dust, pollen, pet fur, or certain foods.

**Common triggers:** Dust mites, pollen, pet dander, mould, some foods, and insect stings.

**What you can do:**
- Reduce dust: wash bedsheets weekly in hot water, vacuum mattresses, keep rooms ventilated.
- During high-pollen days, keep windows closed and change clothes after coming indoors.
- If a food seems to trigger a reaction, note it down and discuss it with a doctor before cutting out major food groups.

**When to see a doctor:** Swelling of the lips, face, or tongue, trouble breathing, or dizziness after exposure — these can signal a severe reaction. Call **112** immediately. For persistent hives, year-round sneezing, or repeated rashes, see a doctor for proper testing.`,
  },
  {
    id: "asthma",
    keywords: ["asthma", "wheezing", "inhaler", "dama", "breathless at night", "tight chest"],
    title: "Asthma (general information)",
    body: `**Simple explanation:** In asthma, the airways narrow and swell, making breathing difficult. It often comes and goes, with wheezing, coughing, or chest tightness.

**Common triggers:** Dust, smoke, strong smells, cold air, respiratory infections, and sometimes exercise.

**What you can do:**
- Avoid tobacco smoke and strong fumes; keep the bedroom as dust-free as possible.
- If a doctor has prescribed inhalers or an action plan, follow it exactly and keep the reliever inhaler accessible.
- Get annual flu protection as advised by your doctor, since infections can trigger flare-ups.

**When to seek urgent care:** Needing the reliever inhaler very often, symptoms most nights, or difficulty speaking full sentences — get medical help promptly. If breathing becomes severely difficult, call **112**.`,
  },
  {
    id: "back-joint-pain",
    keywords: ["back pain", "kamar dard", "joint pain", "arthritis", "knee pain", "neck pain", "sciatica", "slip disc", "shoulder pain"],
    title: "Back, neck and joint pain",
    body: `**Simple explanation:** Most back and joint pain comes from muscle strain, poor posture, or age-related wear of joints — not from serious disease. Staying gently active usually helps more than complete bed rest.

**Possible causes:** Long sitting hours, wrong sleeping posture, lifting heavy weights incorrectly, weak core muscles, or osteoarthritis with age.

**What you can do:**
- Keep moving with gentle walks and stretching; avoid sitting for hours without breaks.
- Apply a warm compress for stiff muscles or a cold pack for a fresh sprain-like injury.
- Maintain a healthy weight — extra weight stresses knees and the lower back.
- Strengthen core and leg muscles gradually.

**When to see a doctor:** Numbness or weakness in a limb, pain after a fall or accident, fever with back pain, loss of bladder/bowel control, or pain that keeps worsening after 2–3 weeks.`,
  },
  {
    id: "skin",
    keywords: ["acne", "pimples", "rash", "skin itching", "eczema", "dandruff", "funsi", "dark spots", "skin dry"],
    title: "Skin problems (acne, rashes, dryness)",
    body: `**Simple explanation:** Acne, dryness, and mild rashes are common and often linked to hormones, weather, harsh soaps, or irritants.

**What you can do:**
- Wash your face gently twice a day; avoid harsh scrubbing.
- Do not pick or squeeze pimples — it causes scars and infection.
- Moisturize dry skin, especially after bathing; use sunscreen when outdoors.
- Change pillowcases regularly and keep hair off the face if you get forehead acne.

**When to see a doctor:** Rapidly spreading rash, pus-filled or very painful lesions, a mole that changes shape or colour, persistent itching that disturbs sleep, or any rash with fever.`,
  },
  {
    id: "eye-health",
    keywords: ["eye", "eyes", "vision", "aankh", "red eyes", "eye itching", "conjunctivitis", "eye strain", "dry eyes", "watery eyes"],
    title: "Eye health and strain",
    body: `**Simple explanation:** Redness, itching, and tired eyes are often caused by screen strain, dryness, dust, or mild conjunctivitis (pink eye).

**What you can do:**
- Follow the 20-20-20 rule: every 20 minutes, look 20 feet away for 20 seconds.
- Do not rub itchy eyes; wash hands before touching your eyes.
- A clean warm compress can soothe mild irritation.
- If one family member has conjunctivitis, avoid sharing towels and wash hands often.

**Seek urgent care for:** Any eye injury, chemical splash (rinse with clean water and get help), sudden vision loss, severe eye pain, or flashes of light with new floaters.`,
  },
  {
    id: "dental",
    keywords: ["tooth", "teeth", "toothache", "daant", "gum bleeding", "cavity", "mouth ulcer", "bad breath", "tooth pain"],
    title: "Teeth and gum basics",
    body: `**Simple explanation:** Most tooth problems start as decay (cavities) or gum inflammation from plaque that isn't cleaned away.

**What you can do:**
- Brush twice daily with fluoride toothpaste and clean between teeth once a day.
- Limit sugary snacks and fizzy drinks; rinse with water after sweets.
- Salt-water rinses can soothe mildly irritated gums temporarily.

**When to see a dentist:** Tooth pain lasting more than a day or two, swelling of the face or gums, bleeding gums that don't settle, a loose adult tooth, or a mouth ulcer lasting more than 2 weeks.`,
  },
  {
    id: "pregnancy",
    keywords: ["pregnant", "pregnancy", "prenatal", "trimester", "garbhvati", "expecting mother"],
    title: "Pregnancy — general wellness",
    body: `**Simple explanation:** Regular antenatal check-ups are the foundation of a healthy pregnancy — they track the baby's growth and catch problems early.

**General guidance:**
- Attend all scheduled check-ups and take only the supplements your doctor advises.
- Eat balanced meals with protein, vegetables, and whole grains; stay hydrated.
- Avoid alcohol and tobacco completely; ask your doctor before any medicine, even common painkillers.
- Gentle daily walks are usually fine if your doctor agrees.

**Seek prompt care for:** Vaginal bleeding, severe headache or vision changes, high fever, reduced baby movements (later pregnancy), or sudden swelling of the face and hands.`,
  },
  {
    id: "child-health",
    keywords: ["baby", "infant", "newborn", "bachcha", "child fever", "teething", "baby cold", "kids health"],
    title: "Children's health basics",
    body: `**Simple explanation:** Children catch frequent mild infections as their immunity develops — most colds and fevers pass in a few days with rest and fluids.

**General guidance:**
- Keep vaccinations on schedule as per your country's immunization program — ask your pediatrician for the chart.
- For loose motions, give oral rehydration solution and continue feeding; watch for signs of dehydration.
- Never give adult medicines (or adult doses) to children — dosing is weight-based and must come from a doctor.

**Seek prompt care for:** Fever in infants under 3 months, difficulty breathing, persistent vomiting, unusual drowsiness, dehydration signs, or any fever with a rash.`,
  },
  {
    id: "monsoon-illnesses",
    keywords: ["dengue", "malaria", "typhoid", "chikungunya", "mosquito", "monsoon fever", "platelets"],
    title: "Monsoon illnesses (dengue, malaria, typhoid)",
    body: `**Simple explanation:** During and after the monsoon, mosquito-borne illnesses (dengue, malaria, chikungunya) and water-borne infections (typhoid, hepatitis) rise.

**Prevention:**
- Don't let water stagnate — empty coolers, pots, and trays weekly; mosquitoes breed in clean standing water.
- Use mosquito nets or repellents, especially at dawn and dusk.
- Drink clean or boiled water; eat freshly cooked food from hygienic places.

**Warning signs — see a doctor promptly:** High fever with severe body ache or rash, bleeding gums or nosebleeds, severe abdominal pain, persistent vomiting, or confusion. Avoid self-medicating fevers during monsoon season — get tested and follow your doctor's advice.`,
  },
  {
    id: "womens-health",
    keywords: ["period", "periods", "menstrual", "pcod", "pcos", "cramps", "irregular periods", "mahwari", "white discharge"],
    title: "Menstrual health basics",
    body: `**Simple explanation:** A typical cycle is 21–35 days. Mild cramps and slight variation are common, especially in the first years and near menopause.

**What you can do:**
- A warm water bottle on the lower abdomen and gentle exercise often ease cramps.
- Track your cycles on a calendar or app — it helps your doctor spot patterns.
- Change sanitary products regularly and maintain genital hygiene.

**When to see a doctor:** Very heavy bleeding (soaking through protection hourly), severe pain that disrupts daily life, cycles consistently shorter than 21 or longer than 35 days, or missed periods with other symptoms like unusual hair growth or weight change.`,
  },
  {
    id: "vitamins-immunity",
    keywords: ["vitamin", "vitamin d", "iron deficiency", "anemia", "calcium", "immunity", "supplements", "multivitamin", "weakness vitamin"],
    title: "Vitamins, iron and immunity",
    body: `**Simple explanation:** Vitamins and minerals (like vitamin D, iron, B12) keep bones, blood, and immunity working. Deficiencies are common and often show up as fatigue or weakness.

**General guidance:**
- Food first: sunlight for vitamin D, leafy greens and lentils for iron, dairy for calcium, varied fruits and vegetables overall.
- Get a blood test before taking high-dose supplements — more is not always better, and some vitamins are harmful in excess.
- Take iron or other supplements only as your doctor advises, especially in pregnancy.

**When to see a doctor:** Persistent fatigue, pale skin, brittle nails, frequent infections, or numbness/tingling — these deserve testing rather than guessing with supplements.`,
  },
  {
    id: "tobacco-alcohol",
    keywords: ["smoking", "smoke", "tobacco", "gutka", "cigarette", "beedi", "alcohol", "drinking", "quit smoking"],
    title: "Tobacco and alcohol",
    body: `**Simple explanation:** Tobacco and heavy alcohol use raise the risk of cancer, heart disease, liver disease, and many other conditions. There is no safe level of tobacco use.

**If you want to quit:**
- Set a quit date and remove tobacco/alcohol from easy reach.
- Identify your triggers (stress, tea breaks, social settings) and plan alternatives.
- Tell family or friends — support improves success. Quit helplines and counselling exist in most cities.

**When to seek help:** If cutting down feels impossible, withdrawal symptoms appear, or drinking is affecting work or relationships — talk to a doctor. Asking for help is a strong step, not a weakness.`,
  },
  {
    id: "heat-safety",
    keywords: ["heat stroke", "heatstroke", "sunstroke", "loo", "heat wave", "garmi", "summer dehydration"],
    title: "Heat safety (heat stroke)",
    body: `**Simple explanation:** In extreme heat, the body can lose its ability to cool down — heat stroke is a medical emergency.

**Warning signs:** Very high body temperature, confusion or fainting, hot dry skin, rapid pulse, headache with nausea.

**What to do:**
- Move the person to shade, loosen clothing, and cool them with water and fanning.
- If conscious, give small sips of water or ORS.
- Call **112** immediately if there is fainting, confusion, or seizures — do not delay.

**Prevention:** Drink water through the day, avoid heavy outdoor work at peak afternoon hours, wear light clothing, and never leave children or elderly people in parked vehicles.`,
  },
  {
    id: "uti",
    keywords: ["uti", "urine infection", "burning urination", "frequent urination", "peshab jalan", "peshab me jalan", "jalan peshab", "urine pain"],
    title: "Urinary tract infection (UTI) basics",
    body: `**Simple explanation:** A UTI is usually a bacterial infection of the urinary tract, causing burning while urinating, frequent urge to urinate, or cloudy urine. It is more common in women.

**What you can do:**
- Drink plenty of water and don't hold urine for long hours.
- Urinate after intercourse; wipe front to back.
- Avoid harsh scented soaps in the genital area.

**When to see a doctor:** Fever, back or side pain, blood in urine, vomiting, or symptoms during pregnancy — seek care promptly. Do not self-start antibiotics; the right medicine and duration need a doctor's prescription and sometimes a urine test.`,
  },
  {
    id: "vaccination",
    keywords: ["vaccine", "vaccination", "tika", "immunization", "flu shot", "booster", "covid vaccine"],
    title: "Vaccination basics",
    body: `**Simple explanation:** Vaccines train your immune system to fight specific diseases, protecting both you and the community.

**General guidance:**
- Follow the national immunization schedule for children — your pediatrician has the chart.
- Adults may need boosters (like tetanus) or seasonal vaccines — ask your doctor what's due for your age.
- Mild fever or arm soreness for a day or two after vaccination is common and usually harmless.

 **When to seek care:** Severe allergic reaction after a vaccine (swelling, breathing difficulty, widespread hives) — call **112** immediately. Keep your vaccination records safe for school, travel, and medical visits.`,
  },
  {
    id: "heart-cad-angina-failure",
    keywords: ["angina", "coronary artery", "cad", "heart failure", "dil ka daura", "seene me dard", "सीने में दर्द", "chhati me dard", "heart attack", "cardiac", "dil ki bimari", "hath me dard left arm", "ghabrahat seene", "chest pain", "chest discomfort", "chest pressure", "left arm pain", "pressure-like chest", "seene dabav", "seene bhari"],
    title: "Heart disease: angina, heart attack and heart failure",
    category: "Heart and Circulatory Health",
    sources: ["World Health Organization", "MedlinePlus", "National Health Service (NHS)"],
    body: `**Simple explanation:** Coronary artery disease means the heart's own blood vessels narrow, so the heart gets less oxygen. Angina is pressure-like chest discomfort on exertion; a heart attack is a sudden blockage; heart failure means the heart pumps weakly so fluid builds up.

**Common signs:** Pressure, heaviness or squeezing in the centre/left chest, sometimes spreading to left arm, neck or jaw; breathlessness; unusual fatigue; swollen ankles, needing extra pillows to breathe at night (heart failure). In Hinglish: seene me dabav/bhari-pan, saans phoolna, pairon me soojan.

**Risk factors:** High BP, diabetes, high cholesterol, smoking/tobacco, obesity, family history, age.

**Prevention:** No tobacco, regular brisk walking as advised, less salt/fried food, BP-sugar-cholesterol control, prescribed medicines regularly.

**When to seek care:** Any severe, crushing or new chest pain, pain with sweating/vomiting/breathlessness, or fainting — call **112** at once. Never drive yourself. Swelling with breathlessness or sudden weight gain needs prompt review.

**Misconception:** "Gas/acidity" is often blamed — but new chest pressure must be treated as cardiac until checked. **Limitation:** Only ECG, troponin and a clinician can confirm; chat messages cannot diagnose.`,
  },
  {
    id: "heart-rhythm-stroke-clots",
    keywords: ["palpitation", "dhadkan", "धड़कन", "dhadkan tez", "arrhythmia", "irregular heartbeat", "stroke", "lakwa", "लकवा", "muh tedha", "bolne me dikkat", "face droop", "paralysis one side", "dvt", "blood clot", "khoon ka thakka", "pair me soojan dard", "peripheral artery", "pair me chalne par dard", "fast pulse"],
    title: "Palpitations, stroke, clots and circulation problems",
    category: "Heart and Circulatory Health",
    sources: ["World Health Organization", "MedlinePlus", "Centers for Disease Control and Prevention (CDC)"],
    body: `**Simple explanation:** Palpitations are felt fast/skipped beats (often extra beats, thyroid, caffeine or anxiety — sometimes rhythm disorders). Stroke is sudden loss of brain blood flow. DVT is a clot in a leg vein; PAD is narrowed leg arteries causing calf pain on walking.

**Warning signs:** Stroke — remember FAST: Face droop (muh tedha), Arm weakness, Speech difficulty (bolne me dikkat), Time to call **112**. DVT: one leg swollen, painful, warm/red, especially after long travel, surgery or immobility. PAD: calf pain on walking that rests away; cold/pale foot, slow-healing sores.

**Risk factors:** High BP, diabetes, smoking, atrial fibrillation, prolonged sitting, dehydration, pregnancy/postpartum, cancer, some hormones.

**Prevention:** Move legs on long journeys, stay hydrated, control BP/sugar, no tobacco, prescribed blood thinners exactly as directed if given.

**When to seek care:** Any FAST sign, sudden one-sided leg swelling, chest pain with breathlessness after a clot (possible embolism), fainting with palpitations, or pulse persistently >120 at rest — emergency care. **Limitation:** Rhythm and clots need ECG/ultrasound and examination; cannot be ruled in/out by chat.`,
  },
  {
    id: "cardiac-tests",
    keywords: ["ecg", "ekg", "echo", "echocardiogram", "tmt", "treadmill test", "angiography", "troponin", "holter", "bp holter", "ecg report", "ईसीजी", "dil ki जांच", "cardiac test"],
    title: "Heart tests: ECG, echo, TMT, Holter and angiography",
    category: "Heart and Circulatory Health",
    sources: ["MedlinePlus", "National Health Service (NHS)"],
    body: `**Simple explanation:** ECG records the heart's electrical rhythm; echocardiogram (echo) is an ultrasound showing pumping and valves; TMT/stress test watches the heart during exercise; Holter records rhythm for 24–48 hrs; angiography maps artery blockages.

**General guidance:** ECG is quick and painless — small stickers on chest. Echo uses gel and sound waves (no radiation). Fasting or avoiding caffeine may be asked before TMT. Tell staff about pacemakers, medicines and pregnancy.

**Misconception:** "Normal ECG means heart is 100% fine" — not always; timing matters and some disease needs echo, stress testing or troponin trends.

**When to seek care:** Your doctor interprets results with symptoms and history. Worsening chest pain, breathlessness or fainting while awaiting tests needs urgent review. **Limitation:** I cannot diagnose from an isolated ECG/report line — a clinician must read the full tracing with context.`,
  },
  {
    id: "hypertension-heart-link",
    keywords: ["bp high heart", "bp kidney", "hypertension heart failure", "bp control", "namak bp", "high bp complications", "bp se dil"],
    title: "High blood pressure and its effects on heart, brain and kidneys",
    category: "Heart and Circulatory Health",
    sources: ["World Health Organization", "National Health Service (NHS)"],
    body: `**Simple explanation:** Long-standing high BP silently damages arteries, thickening the heart, raising stroke risk, and scarring the kidneys (a common cause of chronic kidney disease).

**Signs:** Usually none — headaches, nosebleeds or breathlessness appear late or during very high readings.

**Prevention/control:** Less salt (avoid papad, pickle excess, processed food), healthy weight, daily walking, no tobacco, limited alcohol, regular medicines — never stop BP tablets because "reading is normal today".

 **When to seek care:** Repeated readings ≥140/90 at home, chest pain, sudden weakness/speech change, swelling with reduced urine, or BP >180/120 with symptoms — urgent care. **Limitation:** Targets vary (diabetes, kidney disease, pregnancy); your doctor sets personal goals.`,
  },
  {
    id: "epilepsy-seizure",
    keywords: ["epilepsy", "seizure", "mirgi", "मिर्गी", "daura padna", "jhatke", "fit aana", "behosh jhatke", "convulsion", "foam mouth fit"],
    title: "Epilepsy and seizures",
    category: "Brain and Nervous System",
    sources: ["World Health Organization", "MedlinePlus"],
    body: `**Simple explanation:** A seizure is a brief burst of abnormal brain electrical activity. Epilepsy means recurrent unprovoked seizures. Causes include genetics, birth injury, head trauma, infections, stroke or sometimes no identified cause.

**Signs:** Sudden staring, jerking of limbs, tongue bite, frothing, brief confusion or faint-like fall. In Hindi: achanak jhatke aana, behosh ho jana.

**What to do during a seizure:** Stay calm; cushion the head; turn person on side if possible; do NOT put anything in the mouth; note duration; call **112** if it lasts >5 minutes, repeats quickly, breathing is difficult, injury occurs, or it happens in water/pregnancy.

**Care:** Regular sleep, no alcohol, medicines exactly as prescribed — never stop suddenly. Most people need a neurologist's plan and driving/activity advice.

**Misconception:** Onion/shoe-smelling does not stop seizures; restraining limbs harms. **Limitation:** Seizure type needs EEG and clinical assessment; chat cannot classify it.`,
  },
  {
    id: "parkinsons-dementia-ms",
    keywords: ["parkinson", "kampan", "tremor", "haath kaanpna", "हाथ कांपना", "alzheimer", "dementia", "bhoolne ki bimari", "bhoolna", "yaaddasht", "multiple sclerosis", "ms disease", "chalne me balance", "balance problem papa", "chal me dikkat"],
    title: "Parkinson's, tremors, dementia and multiple sclerosis",
    category: "Brain and Nervous System",
    sources: ["MedlinePlus", "National Health Service (NHS)"],
    body: `**Simple explanation:** Parkinson's causes slow movement, hand tremor at rest and stiffness. Alzheimer's/dementia cause progressive memory and thinking decline. Multiple sclerosis (MS) is an immune attack on nerve coverings causing relapses of vision, weakness or numbness.

**Common signs:** Shuffling walk, small handwriting, tremor that rests away with movement (Parkinson's); repeating questions, getting lost, personality change (dementia); blurred vision, limb numbness/weakness coming and going (MS). Balance trouble in elders ("papa ko chalne me balance problem") needs assessment — causes range from Parkinson's to inner-ear, vitamin B12 or spine issues.

**Care:** Neurologist review; physiotherapy, safe home (grab bars, good light, no loose rugs); medicines on time; caregiver support and routine.

**When to seek care:** Rapid confusion, fall with head injury, sudden one-sided weakness (possible stroke — call **112**), or swallowing difficulty with coughing while eating.

**Misconception:** "Tremor always means Parkinson's" — thyroid, anxiety, medicines and essential tremor also cause it. **Limitation:** These need examination and scans; chat cannot diagnose cause of tremor or memory loss.`,
  },
  {
    id: "neuropathy-vertigo",
    keywords: ["neuropathy", "jhanjhanahat", "झनझनाहट", "haath pair sunn", "sunn hona", "current lagna", "nerve pain", "nas ka dard", "vertigo", "chakkar", "चक्कर", "ghoomna", "kaan chakkar", "balance bigadna", "b12 nerve"],
    title: "Nerve pain, numbness, vertigo and balance problems",
    category: "Brain and Nervous System",
    sources: ["MedlinePlus", "National Health Service (NHS)"],
    body: `**Simple explanation:** Neuropathy is nerve irritation/damage — burning, tingling ("jhanjhanahat"), numbness in hands/feet. Vertigo is a spinning sensation, often from inner-ear crystals (BPPV), migraine, low BP, or rarely brain causes.

**Possible causes:** Diabetes, B12 deficiency, thyroid, alcohol, some medicines, disc pressure on nerves; ear causes, dehydration, anemia for dizziness.

**What you can do:** Control sugar/B12 as tested; avoid alcohol; safe footwear; sit before standing if dizzy; for BPPV, an ENT/neurologist can do repositioning manoeuvres.

**When to seek care:** Numbness with weakness, foot ulcer without pain (diabetes), dizziness with double vision, slurred speech, chest pain or fainting, or sudden one-sided numbness — urgent care (call **112** for stroke-like signs).

**Misconception:** "Only old people get neuropathy" — young people with diabetes/B12 deficiency get it too. **Limitation:** Distribution and reflexes on examination decide the cause.`,
  },
  {
    id: "sleep-apnea-neuro-warning",
    keywords: ["sleep apnea", "kharate", "खर्राटे", "snore", "snores", "snoring", "loud snoring", "stops breathing", "breathing stops", "breathing pauses sleep", "snoring gasp", "neend me saans rukna", "daytime sleepy", "din me neend", "narcolepsy", "head injury warning", "meningitis stiff neck", "gardan akad", "tez bukhar sir dard"],
    title: "Sleep apnea and neurological warning signs",
    category: "Brain and Nervous System",
    sources: ["MedlinePlus", "Centers for Disease Control and Prevention (CDC)"],
    body: `**Simple explanation:** Sleep apnea means breathing repeatedly pauses in sleep (loud snoring, gasping, daytime sleepiness, morning headache). It raises BP, heart and stroke risk.

**What helps:** Healthy weight, side-sleeping, no alcohol/sedatives at night, treating nasal blockage; CPAP or ENT/neurologist review if suspected.

**Neurological red flags — seek urgent care:** Sudden worst-ever headache, headache with fever and stiff neck (gardan akadna), seizure, sudden vision/speech/weakness change, head injury with vomiting/drowsiness, or loud snoring with witnessed pauses plus uncontrolled BP — get assessed promptly; call **112** for stroke-like or breathing difficulty signs.

 **Misconception:** "Snoring is harmless" — habitual loud snoring with daytime sleepiness deserves evaluation. **Limitation:** Sleep study (polysomnography) confirms apnea; chat cannot grade it.`,
  },
  {
    id: "kidney-ckd-aki-tests",
    keywords: ["kidney", "kidni", "गुर्दा", "creatinine", "creatinin", "egfr", "gfr", "urea high", "kidney report", "creatinine high hai", "dialysis", "ckd", "kidney failure", "protein urine", "urine foam", "peshab jhag", "swelling kidney", "bp kidney affect"],
    title: "Kidney disease, creatinine/eGFR and dialysis",
    category: "Kidney and Urinary Health",
    sources: ["MedlinePlus", "National Health Service (NHS)"],
    body: `**Simple explanation:** Kidneys filter waste (creatinine, urea) and balance fluids. High creatinine / low eGFR suggest reduced filtering. Chronic kidney disease (CKD) develops over months; acute kidney injury (AKI) is a sudden fall needing urgent care. Dialysis artificially filters blood when kidneys fail.

**Common signs:** Often none early; later — ankle/face swelling, foamy urine (protein), reduced urine, fatigue, nausea, breathlessness, itching. High BP both causes and results from kidney disease ("Can high BP affect the kidneys?" — yes, strongly).

**Causes:** Diabetes, high BP, painkiller overuse (NSAIDs), dehydration, stones/blockage, infections.

**Next steps:** Repeat test as advised; bring old reports; track BP/sugar; avoid NSAIDs, unknown herbal powders and excess salt/protein powders without advice; stay hydrated unless fluid-restricted.

**When to seek care:** Very low/no urine, breathlessness, chest pain, confusion, or creatinine rising fast — urgent care. **Misconception:** "Creatinine thoda high hai, koi baat nahi" — trends matter; persistent abnormality needs a doctor. **Limitation:** One value never stages CKD; eGFR, urine protein, ultrasound and history together decide.`,
  },
  {
    id: "kidney-stones",
    keywords: ["kidney stone", "pathri", "पथरी", "gurde ki pathri", "renal stone", "ureter stone", "side pain stone", "peshab me khoon stone", "dard kamar side"],
    title: "Kidney stones",
    category: "Kidney and Urinary Health",
    sources: ["MedlinePlus", "National Health Service (NHS)"],
    body: `**Simple explanation:** Stones are hard mineral deposits forming in urine. Small ones may pass silently; larger ones block flow causing severe colicky side/back pain radiating to groin, nausea, burning or blood in urine.

**Risk factors:** Low water intake, heat/sweating, excess salt, high animal protein, obesity, family history, some metabolic conditions.

**What you can do:** Drink enough water to keep urine pale yellow (unless fluid-restricted); don't hold urine; reduce excess salt; keep active. Strain urine if asked to catch a stone for testing.

**When to seek care:** Fever with stone pain, persistent vomiting, single kidney/pregnancy, no urine, or unbearable pain — urgent care. Most stones need ultrasound/CT and a urologist's plan; never take unprescribed "stone-melting" medicines.

**Misconception:** Beer flushes stones — it dehydrates and harms; water and medical advice work. **Limitation:** Size/location decide treatment; chat cannot judge passage.`,
  },
  {
    id: "incontinence-prostate",
    keywords: ["urine leak", "peshab nikal jata", "incontinence", "prostate", "prostrate", "bar bar peshab", "raat me peshab", "peshab ruk ruk", "prostate bada", "psa test", "urinate many times", "many times at night urinate", "night urination", "weak stream", "stop-start urine", "dribbling urine"],
    title: "Urine leakage, frequent urination and prostate enlargement",
    category: "Kidney and Urinary Health",
    sources: ["MedlinePlus", "National Health Service (NHS)"],
    body: `**Simple explanation:** Leakage (incontinence) follows weak pelvic muscles, childbirth, prostate surgery, or overactive bladder. In older men, benign prostate enlargement (BPH) narrows urine flow: frequent/urgent urination, night-time trips, weak or stop-start stream, dribbling.

**What helps:** Timed voiding, limiting evening fluids/caffeine/alcohol, pelvic-floor (Kegel) exercises, healthy weight; pads for dignity while being evaluated.

**When to seek care:** Inability to urinate, burning with fever, blood in urine, back pain with incontinence, or PSA/urine concerns — see a urologist promptly; sudden retention with pain is an emergency.

**Misconception:** "Prostate problem always means cancer" — most enlargement is benign, but bleeding, weight loss or hard lump needs assessment. **Limitation:** Flow tests, urine test, ultrasound and PSA (with counselling) decide the cause.`,
  },
  {
    id: "liver-hepatitis-jaundice-lft",
    keywords: ["fatty liver", "fatty livar", "liver bada", "लिवर", "sgpt", "sgot", "alt ast high", "lft report", "bilirubin high", "jaundice", "piliya", "पीलिया", "aankh peeli", "hepatitis", "hepatits", "peela peshab"],
    title: "Fatty liver, hepatitis, jaundice and liver function tests",
    category: "Liver, Gallbladder and Pancreas",
    sources: ["World Health Organization", "MedlinePlus"],
    body: `**Simple explanation:** Fatty liver is extra fat in liver cells (often with obesity, diabetes, alcohol). Hepatitis (A/B/C/E) is liver inflammation, mostly viral. Jaundice (piliya — yellow eyes/skin, dark urine) is a symptom with many causes: hepatitis, gallstones, alcohol, medicines, blood disorders. LFT (SGOT/AST, SGPT/ALT, bilirubin, ALP, albumin) shows patterns, not a single diagnosis.

**Signs:** Often none early; later — right-upper abdominal heaviness, fatigue, nausea, itching, yellow eyes, pale stools.

**Prevention:** Healthy weight, no alcohol, hepatitis A/B vaccination as advised, safe food/water (A/E spread by food/water), safe needles/sex (B/C spread by blood/body fluids), cautious medicine/herbal use.

**Next steps:** "Fatty liver kya hota hai, kaise pata chalta hai?" — ultrasound and LFT with BP/sugar/cholesterol review; repeat as advised. Avoid crash diets and unproven "liver-cleanse" products.

**When to seek care:** Deepening jaundice, confusion, vomiting blood, black stools, severe abdominal pain, or fever with jaundice — urgent care. **Limitation:** Mild LFT rises have many causes; trends plus ultrasound and history decide.`,
  },
  {
    id: "gallstones-pancreatitis",
    keywords: ["gallstone", "gall bladder stone", "pitta pathri", "pitta", "gallblader", "pancreatitis", "pet upar dard", "right side pet dard", "right side pet", "right side pain", "right upper pain", "fatty khana", "fatty khana dard", "fatty food pain", "khaane ke baad dard", "ulti pet dard kamar"],
    title: "Gallstones and pancreatitis",
    category: "Liver, Gallbladder and Pancreas",
    sources: ["MedlinePlus", "National Health Service (NHS)"],
    body: `**Simple explanation:** Gallstones are hardened bile deposits; they classically cause right-upper abdominal pain after fatty food, sometimes with vomiting or temporary jaundice. Pancreatitis is pancreas inflammation — persistent severe upper-abdominal pain (often to the back) with vomiting, needing hospital care.

**Risk factors:** Female sex, obesity, rapid weight loss, high-fat diet, alcohol (pancreatitis), gallstones blocking the duct, high triglycerides, some medicines.

**What helps:** Avoid very fatty/fried meals and alcohol; maintain gradual healthy weight; ultrasound as advised.

**When to seek care:** Severe upper-abdominal pain lasting hours, pain with fever/jaundice, repeated vomiting, or fainting — go to emergency; infected gallbladder or severe pancreatitis can be dangerous.

**Misconception:** "Home remedies dissolve all gallstones" — most symptomatic stones need a surgeon's assessment. **Limitation:** Pain location alone cannot separate gastritis, gallstones and heart pain; examination plus ultrasound/lipase decide.`,
  },
  {
    id: "liver-prevention-warnings",
    keywords: ["liver kharab", "liver bachao", "alcohol liver", "cirrhosis", "liver swelling", "liver diet", "liver tonic", "liver cleanse"],
    title: "Protecting the liver and warning signs of liver failure",
    category: "Liver, Gallbladder and Pancreas",
    sources: ["World Health Organization", "Centers for Disease Control and Prevention (CDC)"],
    body: `**Simple explanation:** The liver filters blood, makes proteins and bile. Chronic injury (alcohol, hepatitis B/C, fatty liver, some drugs/herbs) scars it (fibrosis/cirrhosis), which is often silent until late.

**Protection:** No alcohol or strictly as medically advised; healthy weight; hepatitis B vaccination; safe injections/transfusions; prescribed medicines only at prescribed doses (paracetamol overdose harms); be cautious with herbal/ayurvedic powders — "natural" does not mean liver-safe.

**Warning signs:** Increasing abdominal girth with leg swelling, vomiting blood/black stools, confusion/sleep reversal, easy bruising, deepening jaundice — urgent care.

**Misconception:** "Liver tonics repair damage" — no tonic reverses cirrhosis; cause-treatment (alcohol stoppage, antivirals, weight control) matters. **Limitation:** Fibrosis stage needs elastography/biopsy and specialist review.`,
  },
  {
    id: "pneumonia-copd-lungs",
    keywords: ["pneumonia", "nimonia", "bronchitis", "copd", "smoker cough", "balgam smoker", "wheeze smoker", "oxygen kam", "saans phoolna copd"],
    title: "Pneumonia, bronchitis and COPD",
    category: "Respiratory and Lung Diseases",
    sources: ["World Health Organization", "MedlinePlus"],
    body: `**Simple explanation:** Pneumonia is lung infection (fever, cough with phlegm, chest pain, fast breathing). Bronchitis is airway inflammation with mucus cough. COPD (often smoking-related) is chronic airflow narrowing with breathlessness and recurrent flare-ups.

**Causes/triggers:** Viruses/bacteria, smoking/biomass smoke, dust, pollution, repeated infections.

**What helps:** No smoking or indoor smoke; annual flu/pneumococcal vaccines as advised; inhaler technique with spacer if prescribed; gentle walking and pulmonary rehabilitation.

**When to seek urgent care:** Blue lips, cannot complete sentences, drowsiness, chest pain, oxygen saturation persistently below 94% (or below your personal target), or high fever with breathlessness — emergency care; call **112**.

**Misconception:** "Antibiotics cure every cough" — most bronchitis is viral; antibiotics only when a doctor judges bacterial signs. **Limitation:** Chest X-ray, sputum and spirometry decide cause and stage.`,
  },
  {
    id: "tb-awareness",
    keywords: ["tb", "tuberculosis", "टीबी", "tb spread", "tb kaise failti", "khansi 2 hafte", "raat paseena", "vajan kam tb", "dots", "sputum test", "cbnaat", "tb dawai"],
    title: "Tuberculosis (TB): spread, testing and treatment",
    category: "Respiratory and Lung Diseases",
    sources: ["World Health Organization", "Ministry of Health and Family Welfare, India", "National Health Mission, India"],
    body: `**Simple explanation:** TB is a bacterial infection, usually of the lungs, spread through air when a person with infectious TB coughs or sneezes — through air, not by sharing food, touch or utensils. Clues: cough beyond 2 weeks, evening fever, night sweats, weight loss, blood in sputum.

**Testing:** Sputum test (CBNAAT/microscopy), chest X-ray, and doctor assessment. India provides free TB testing and treatment under the national programme.

**Treatment:** 4 to 6+ months of multiple medicines — the full course must be completed even after feeling better. Stopping early breeds drug resistance.

**Prevention:** Cover coughs, ventilate rooms, complete treatment so the patient becomes non-infectious, test close contacts and young children as advised.

**When to seek care:** Cough beyond 2 weeks, blood in sputum, or yellow eyes/vomiting/rash on TB medicines — prompt review. **Misconception:** "TB is always fatal or only affects the poor" — it is curable with adherence and affects anyone. **Limitation:** Drug resistance and organ involvement need specialist testing.`,
  },
  {
    id: "pe-spo2-breath-emergency",
    keywords: ["pulmonary embolism", "achanak saans", "sudden breathless", "spo2", "oximeter", "oxygen 90", "saturation low", "peak flow", "peakflow", "saans rukna beth", "leg swelling breathless"],
    title: "Pulmonary embolism, oxygen levels and breathing emergencies",
    category: "Respiratory and Lung Diseases",
    sources: ["MedlinePlus", "Centers for Disease Control and Prevention (CDC)"],
    body: `**Simple explanation:** Pulmonary embolism is a clot lodging in lung arteries — sudden breathlessness, sharp chest pain worse on breathing, fast pulse, sometimes leg swelling. Oxygen saturation (SpO2) on a pulse oximeter is normally about 95 to 100%; peak-flow meters track asthma/COPD airflow. Sleep-related pauses in breathing are covered under sleep-apnea guidance.

**Possible pattern:** Sudden breathlessness after long travel, surgery, leg clot, or in pregnancy/postpartum raises suspicion.

**What to do:** Sit upright, stay calm, avoid exertion; check the oximeter on a warm still finger; keep inhaler/action plan handy if asthmatic.

**Emergency — call 112 now:** Severe breathlessness at rest, cannot speak full sentences, blue lips, fainting, chest pain with breathlessness, SpO2 persistently below 94% (or below your personal target), or sudden breathlessness with one-sided leg swelling.

**Misconception:** "One normal oximeter reading rules out lung clots" — it does not; CT and D-dimer with clinical scoring decide. **Limitation:** Chat cannot interpret isolated SpO2/peak-flow values without history.`,
  },
  {
    id: "cancer-basics-warnings",
    keywords: ["cancer", "kainsar", "कैंसर", "tumor", "tumour", "gath", "ganth", "cancer kaise hota", "cancer lakshan", "vajan kam bina wajah", "ghav na bhare", "nigalne me dikkat", "aawaz baithi"],
    title: "How cancer develops and warning signs",
    category: "Cancer Awareness and Prevention",
    sources: ["World Health Organization", "MedlinePlus"],
    body: `**Simple explanation:** Cancer begins when some cells grow and divide without normal control, forming a lump (tumour) or spreading through blood/lymph. It is not contagious and usually develops over years — I never diagnose cancer from chat symptoms and never recommend unproven cures.

**Warning signs deserving medical assessment:** New lump that grows, sore not healing in 3 weeks, unusual bleeding (coughing blood, blood in stool/urine, postmenopausal bleeding), persistent difficulty swallowing, hoarseness beyond 3 weeks, unexplained weight loss/fever, change in a mole, persistent bowel/bladder change.

**Risk factors:** Tobacco in all forms, heavy alcohol, chronic infections (HPV, hepatitis B/C), excess body weight, strong family history, some occupational exposures.

**Next steps:** A persistent sign needs a clinician's examination, not waiting. Note duration, size change, pain, bleeding and family history before the visit.

**Misconception:** "All lumps are cancer / biopsy spreads cancer" — most lumps are benign, and biopsy does not spread cancer; delay harms. **Limitation:** Only examination, imaging and biopsy/pathology can confirm.`,
  },
  {
    id: "cancer-screening-early",
    keywords: ["cancer screening", "mammography", "mammogram", "pap smear", "pap test", "hpv test", "colonoscopy screening", "stool occult", "psa screening", "lung screening", "breast self exam", "cervical vaccine hpv", "jaanch cancer"],
    title: "Cancer screening by age and risk",
    category: "Cancer Awareness and Prevention",
    sources: ["World Health Organization", "Centers for Disease Control and Prevention (CDC)"],
    body: `**Simple explanation:** Screening finds cancer or precancer before symptoms, when treatment works best. Recommendations vary by age, sex, family history and country — your doctor personalises them.

**Common examples:** Breast awareness plus mammography in recommended age groups; cervical screening (Pap/HPV test) and HPV vaccination; stool-based tests/colonoscopy for colorectal cancer after middle age or earlier with family history; prostate discussion (PSA) with risks/benefits counselling; lung screening (low-dose CT) for heavy smokers where available.

**General approach:** Know your family history; attend recommended checks; report new symptoms promptly rather than waiting for the next screen.

**Misconception:** "Screening is only for people with symptoms" — its purpose is the opposite. But unnecessary scans without indication also have harms (radiation, false alarms).

**When to seek care:** Screening overdue, or a new lump/bleeding between screens. **Limitation:** I cannot set your personal schedule — age, risk and local guidelines decide with your clinician.`,
  },
  {
    id: "cancer-diagnosis-treatment-support",
    keywords: ["biopsy", "pathology report", "chemotherapy", "chemo", "keemo", "radiotherapy", "radiation therapy", "immunotherapy", "cancer ilaj", "cancer support", "caregiver cancer", "cancer pain care", "hormon therapy cancer"],
    title: "Biopsy, treatment options and supporting patients",
    category: "Cancer Awareness and Prevention",
    sources: ["World Health Organization", "MedlinePlus", "National Health Service (NHS)"],
    body: `**Simple explanation:** Biopsy takes a tiny tissue sample; the pathology report names the cancer type, grade and stage that guide treatment. Chemotherapy uses medicines, radiotherapy uses focused rays, surgery removes tumours, and immunotherapy/hormonal/targeted drugs help selected cancers — every plan is individual.

**What families can do:** Keep reports organised; ask the oncologist about stage, goal of treatment (cure vs control), benefits/side effects, fertility, nutrition and follow-up; manage pain, nausea and fatigue promptly; balanced food, gentle activity and vaccines as advised.

**Prevention that works:** No tobacco, HPV and hepatitis B vaccines, healthy weight, limited alcohol, safe sun, treating precancerous lesions.

**Emotional support:** Fear, guilt and money worries are normal — counselling, support groups and palliative-care teams help patients and caregivers from diagnosis onward.

**Warning:** Never use unproven cures (extreme diets, secret herbs, bleaching agents) instead of oncology care — they delay treatment and can poison. **Limitation:** Only your oncology team can interpret your pathology report and stage.`,
  },
  {
    id: "ibs-ibd-celiac",
    keywords: ["ibs", "ibd", "crohn", "ulcerative colitis", "aant inflammation", "celiac", "coeliac", "gluten", "gehu allergy", "lactose", "doodh se dikkat", "pet phoolna baar", "dast kabz alternate", "dast", "kabz", "alternating diarrhoea", "alternating dast"],
    title: "IBS, inflammatory bowel disease and celiac disease",
    category: "Digestive and Intestinal Diseases",
    sources: ["MedlinePlus", "National Health Service (NHS)"],
    body: `**Simple explanation:** IBS is a gut-brain sensitivity — cramps, bloating, diarrhoea/constipation that comes and goes without visible damage. IBD (Crohn's, ulcerative colitis) is immune-driven gut inflammation with ulcers/bleeding. Celiac disease is an immune reaction to gluten (wheat/barley/rye) damaging the small intestine — different from simple intolerance.

**Clues:** IBS: pain eased by passing stool, mucus, no weight loss/bleeding. IBD: blood/mucus in stool, night-time diarrhoea, weight loss, fever, joint/eye/skin issues. Celiac: chronic diarrhoea, bloating, iron deficiency, mouth ulcers, family history.

**Next steps:** Food-symptom diary; do NOT start a gluten-free diet before celiac blood tests (it spoils testing); stool tests, calprotectin, endoscopy/colonoscopy as advised.

**When to seek care:** Blood in stool, unexplained weight loss, persistent night-time diarrhoea, severe pain, or anemia — prompt gastroenterology review; vomiting blood/black stools or severe GI bleeding is an emergency (**112**).

**Misconception:** "IBS and IBD are the same" — IBS does not cause ulcers or raise cancer risk like long-standing IBD can. **Limitation:** These overlap; scopes and biopsies distinguish them.`,
  },
  {
    id: "ulcer-gerd-reflux",
    keywords: ["ulcer", "alsar", "pet me ghav", "gerd", "reflux", "khatti Dakar", "seene jalan", "heartburn", "acid upar", "h pylori", "dard bhukh par"],
    title: "Peptic ulcers and GERD (acid reflux)",
    category: "Digestive and Intestinal Diseases",
    sources: ["MedlinePlus", "National Health Service (NHS)"],
    body: `**Simple explanation:** Peptic ulcers are sores in the stomach/duodenum (often H. pylori bacteria or NSAID painkillers). GERD is acid flowing back into the food pipe — heartburn (seene me jalan), sour burps (khatti dakar), chest discomfort, chronic cough or hoarseness. (General acidity is covered separately; here is ulcer/reflux disease.)

**Clues:** Ulcer: gnawing upper-abdominal pain, worse on empty stomach or at night, eased briefly by food/antacids, nausea. GERD: burning rising after meals, worse lying down or bending, bitter taste.

**What helps:** Avoid NSAIDs, smoking and alcohol; smaller evening meals; avoid lying down 2–3 hours after eating; raise head end; healthy weight; H. pylori test-and-treat if advised — complete the course.

**When to seek care:** Black stools, vomiting blood or "coffee grounds", fainting, severe sudden abdominal pain, trouble swallowing, or weight loss — urgent care. Chest pain must first be checked as cardiac. **Limitation:** Endoscopy decides ulcer/erosion vs reflux; chat cannot separate them reliably.`,
  },
  {
    id: "hemorrhoids-fissure-gi-bleed",
    keywords: ["piles", "bawasir", "बवासीर", "hemorrhoid", "fissure", "latrine me khoon", "guda dard", "guda khujli", "kabz khoon", "gi bleed", "kala stool"],
    title: "Hemorrhoids, anal fissure and GI-bleeding warnings",
    category: "Digestive and Intestinal Diseases",
    sources: ["MedlinePlus", "National Health Service (NHS)"],
    body: `**Simple explanation:** Hemorrhoids (piles/bawasir) are swollen anal veins — painless bright-red bleeding with constipation, itching, lump. Fissure is a small anal tear — sharp pain during/after stool with slight bleeding. Both differ from deeper GI bleeding (black tarry stools, vomiting blood).

**What helps:** Fibre (vegetables, fruits, isabgol as advised), plenty of water, no straining or long toilet sitting, daily walks, warm sitz baths; wipe gently.

**When to seek care:** Heavy or recurrent rectal bleeding, black stools, dizziness/fainting, severe anal pain with fever/swelling, lump that won't go back, or bleeding beyond age 40 without evaluation — prompt surgical/gastro review; vomiting blood or black stools with weakness is an emergency (**112**).

**Misconception:** "All rectal bleeding is piles" — polyps, IBD and cancers also bleed; new bleeding needs examination, not self-assumed piles creams. **Limitation:** Cause needs anoscopy/colonoscopy by age and risk.`,
  },
  {
    id: "thyroid-hypo-hyper-tests",
    keywords: ["thyroid", "thiroyd", "थायराइड", "tsh", "t3 t4", "hypothyroid", "hyperthyroid", "gardan sujan", "vajan badh thyroid", "ghabrahat thyroid", "pcos thyroid difference", "thyroid test"],
    title: "Thyroid disorders and thyroid function tests",
    category: "Endocrine and Hormonal Health",
    sources: ["MedlinePlus", "National Health Service (NHS)"],
    body: `**Simple explanation:** The thyroid (neck gland) sets metabolism. Hypothyroidism (high TSH, low T4) slows the body — fatigue, weight gain, constipation, dry skin, feeling cold, heavy periods. Hyperthyroidism (low TSH, high T4) speeds it — weight loss, tremor, palpitations, heat intolerance, anxiety, eye changes. "PCOS aur thyroid me kya difference hai?" — PCOS is an ovarian/hormone-ovulation disorder (irregular periods, acne, hair changes); thyroid is a neck-gland hormone disorder; they can coexist and both disturb periods, so both are tested.

**Tests:** TSH first, plus free T4/T3 and antibodies as advised; morning fasting per lab; biotin supplements can distort results — mention all pills.

**Care:** Daily thyroxine on an empty stomach for hypo (same time, away from iron/calcium); anti-thyroid/beta-blocker/radioiodine options for hyper per endocrinologist; never adjust doses by symptoms alone.

**When to seek care:** Neck swelling with breathing/swallowing trouble, racing heart with chest pain, extreme drowsiness with cold (hypo crisis), or fever with agitation (thyroid storm) — urgent care. **Limitation:** Dose and cause (Hashimoto's, Graves', nodules) need antibody/ultrasound review.`,
  },
  {
    id: "pcos-metabolic-hba1c",
    keywords: ["pcos", "pcod", "pcos thyroid", "harmonal", "hormonal imbalance", "hba1c", "hba1c means", "hba1c test kyu", "insulin resistance", "metabolic syndrome", "pet motapa sugar", "period hormonal"],
    title: "PCOS, insulin resistance and HbA1c",
    category: "Endocrine and Hormonal Health",
    sources: ["MedlinePlus", "National Health Service (NHS)"],
    body: `**Simple explanation:** PCOS means irregular ovulation with excess androgen signs (acne, scalp hair loss, facial hair) and polycystic-looking ovaries — a common cause of irregular periods and fertility difficulty. Insulin resistance/metabolic syndrome (belly fat plus high BP/sugar/triglycerides, low HDL) often accompanies it and raises diabetes risk. HbA1c ("What does HbA1c mean, aur ye test kyun hota hai?") is average blood sugar over ~3 months — used to detect prediabetes/diabetes and track control; fasting is not required.

**Care:** Healthy weight (even 5–10% loss helps cycles), activity, sleep; doctor-guided metformin/hormonal or fertility treatment where indicated; screen sugar, BP, lipids, vitamin D, thyroid.

**When to seek care:** No periods for 3+ months, very heavy bleeding, sudden severe pelvic pain, excess thirst/urination, or difficulty conceiving after 12 months (6 months beyond age 35).

**Misconception:** "PCOS means cysts must be removed" — these are tiny follicles, not surgical cysts; lifestyle plus medical care manages most cases. **Limitation:** Diagnosis needs history, examination, hormones and ultrasound together.`,
  },
  {
    id: "bone-calcium-adrenal",
    keywords: ["osteoporosis", "calcium kam", "haddi kamzor", "vitamin d haddi", "adrenal", "cortisol", "steroid motapa", "height kam budhape", "fracture jaldi"],
    title: "Osteoporosis, calcium and adrenal disorders",
    category: "Endocrine and Hormonal Health",
    sources: ["MedlinePlus", "National Health Service (NHS)"],
    body: `**Simple explanation:** Osteoporosis thins bones so fractures occur with minor falls; calcium, vitamin D, estrogen/testosterone and activity maintain bone. Adrenal disorders (cortisol/aldosterone imbalance — e.g. Cushing's features, Addison's) are uncommon and need endocrinology testing; long unmonitored steroid use mimics Cushing's (weight gain, stretch marks, high sugar/BP, thin skin).

**Protection:** Calcium from diet (milk/curd, ragi, greens), vitamin D (sunlight/tested supplements), weight-bearing walks, no smoking, limited alcohol; bone-density (DEXA) scan after menopause/fractures as advised.

**When to seek care:** Fracture with trivial injury, height loss with back pain, severe muscle weakness with dark skin/persistent vomiting (possible adrenal crisis), or steroid use needing a taper plan — prompt review; never stop steroids suddenly.

**Misconception:** "Calcium tablets alone prevent fractures" — exercise, vitamin D, fall prevention and cause-treatment matter equally. **Limitation:** Adrenal diagnosis needs timed cortisol/ACTH testing under supervision.`,
  },
  {
    id: "hiv-hepatitis-bc",
    keywords: ["hiv", "aids", "एचआईवी", "hiv test", "hiv kaise failta", "pep hiv", "hepatitis b", "hepatitis c", "piliya kala", "hepatitis test", "jaundice infection"],
    title: "HIV and hepatitis B/C: testing, prevention, stigma-free facts",
    category: "Infectious Diseases and Public Health",
    sources: ["World Health Organization", "Centers for Disease Control and Prevention (CDC)", "National Health Mission, India"],
    body: `**Simple explanation:** HIV attacks immunity and spreads through unprotected sex, shared needles, transfusion of unscreened blood, and mother-to-child — NOT through hugging, sharing food, mosquitoes or toilets. Hepatitis B/C spread through blood, shared needles/razors, unsterile tattoos/piercings, unprotected sex (B), and mother-to-child; B has a vaccine, C is curable with prescribed antivirals.

**Testing:** HIV rapid/antibody tests (confidential at government centres); hepatitis B surface antigen and hepatitis C antibody tests. Early testing after risk plus doctor-guided PEP (HIV, within 72 hours, ideally much sooner) and hepatitis B vaccination/immunoglobulin advice matter.

**Prevention:** Condoms, never share needles/razors, sterile tattoo/piercing equipment, screened blood, hepatitis B vaccination.

**Care:** Modern HIV treatment (ART) lets people live long healthy lives and prevents transmission when viral load is suppressed — support, don't stigmatise.

**When to seek care:** Needle-stick, sexual exposure, or jaundice with dark urine/pale stools — prompt review. **Limitation:** Window periods apply; a counsellor/doctor interprets results.`,
  },
  {
    id: "mosquito-typhoid-deep",
    keywords: ["malaria", "dengue deep", "chikungunya", "typhoid", "मलेरिया", "डेंगू", "tifaid", "machhar bukhar", "platelet kam", "ns1 test", "widal test", "jod dard bukhar"],
    title: "Malaria, dengue, chikungunya and typhoid in depth",
    category: "Infectious Diseases and Public Health",
    sources: ["World Health Organization", "Ministry of Health and Family Welfare, India", "Centers for Disease Control and Prevention (CDC)"],
    body: `**Simple explanation:** Malaria (mosquito, cyclical high fever with chills/sweats), dengue (day-biting mosquito; high fever, severe body/eye pain, rash; platelets may fall), chikungunya (fever with severe joint pains lasting weeks), typhoid (contaminated food/water; prolonged fever, abdominal pain, constipation/diarrhoea) — deeper than the monsoon overview.

**Tests:** Malaria smear/rapid test; dengue NS1/IgM with CBC/platelets; blood culture/Widal plus clinical judgement for typhoid.

**Care:** Paracetamol for fever as directed; plenty of fluids/ORS; complete antimalarial/antibiotic courses exactly as prescribed; avoid aspirin/ibuprofen in suspected dengue (bleeding risk) unless a doctor directs.

**Danger signs:** Bleeding, persistent vomiting, severe abdominal pain, breathlessness, confusion, very low urine, or fever beyond 3 days — urgent review; avoid self-medicating monsoon fevers. **Misconception:** "Low platelets always need platelet transfusion" — most dengue is managed with fluids and monitoring; transfusion only by criteria. **Limitation:** Serology timing matters; a single early negative test may need repeating.`,
  },
  {
    id: "rabies-foodpoisoning",
    keywords: ["rabies", "kutta kata", "कुत्ता काटा", "billi kharoch", "bandar kata", "arv vaccine", "kutte ka katna", "food poisoning", "ulti dast khana", "leftover khana", "sada khana"],
    title: "Animal bites, rabies care and food poisoning",
    category: "Infectious Diseases and Public Health",
    sources: ["World Health Organization", "Centers for Disease Control and Prevention (CDC)"],
    body: `**Simple explanation:** Rabies (dog/cat/monkey bites or scratches breaking skin, or licks on broken skin) is almost always fatal once symptoms appear — but preventable with immediate wound washing plus vaccines/immunoglobulin. Food poisoning (vomiting, diarrhoea, cramps within hours of unsafe food) is usually self-limited but can dehydrate.

**Bite — act within minutes:** Wash under running water with soap for 15 minutes; apply antiseptic; do NOT close/tie or apply herbs; reach a hospital the same day for post-exposure vaccines (and immunoglobulin for deep/multiple wounds); observe the animal if possible without risk.

**Food poisoning:** ORS and fluids, light diet as tolerated, handwashing; antibiotics only if a doctor prescribes.

**When to seek urgent care:** Deep bites on face/hands, wild-animal exposure, or food poisoning with blood in stool, high fever, no urine, confusion, or illness in pregnancy/infants/elders. **Limitation:** Bite category and prior vaccination decide the exact schedule.`,
  },
  {
    id: "antibiotics-hygiene",
    keywords: ["antibiotic resistance", "antibiotic kab", "zukaam antibiotic", "hand wash", "haath dhona", "safe khana", "pani ubalna", "amr"],
    title: "Antibiotic resistance, hand hygiene and safe food",
    category: "Infectious Diseases and Public Health",
    sources: ["World Health Organization", "Centers for Disease Control and Prevention (CDC)"],
    body: `**Simple explanation:** Antibiotics kill bacteria, not viruses — colds, flu and most diarrhoea do not need them. Misuse breeds resistant germs (AMR) that make future infections untreatable.

**Responsible use:** Take antibiotics only when prescribed, at the right dose and full duration; never share leftovers or demand them for viral coughs; complete TB/antimalarial courses.

**Prevention:** Wash hands 20 seconds (before cooking/eating, after toilet, after cough/sneeze); drink boiled/treated water; eat freshly cooked food; refrigerate leftovers quickly and reheat thoroughly; wash fruits/vegetables.

**When to seek care:** Fever beyond 3 days, fast breathing, blood in stool, or dehydration signs — testing decides treatment. **Misconception:** "Stronger/newer antibiotic is always better" — narrow, correct, short-course treatment is safer. **Limitation:** Only cultures/clinical scoring separate bacterial from viral illness.`,
  },
  {
    id: "arthritis-osteoporosis-fracture",
    keywords: ["osteoarthritis", "rheumatoid", "gathiya", "गठिया", "jod dard sujan", "ghutna ghisna", "subah akad", "osteoporosis fracture", "kamar jhukna", "haddi tootna jaldi"],
    title: "Osteoarthritis, rheumatoid arthritis and fracture prevention",
    category: "Orthopedics and Rehabilitation",
    sources: ["MedlinePlus", "National Health Service (NHS)"],
    body: `**Simple explanation:** Osteoarthritis is wear of joint cartilage (knees, hips, hands) — pain worse with use, stiffness brief in mornings. Rheumatoid arthritis is immune joint inflammation — prolonged morning stiffness (beyond 30–60 min), symmetric small-joint swelling, fatigue. Osteoporosis weakens bone so minor falls fracture hip, spine or wrist.

**Care:** Healthy weight, quadriceps/leg strengthening, walking aids as advised, warm/cold packs, vitamin D/calcium, DEXA scan where indicated; rheumatoid needs early rheumatologist DMARD treatment to prevent deformity — do not rely only on painkillers.

**Fracture prevention:** Home lighting, grab bars, vision correction, hip protectors/exercise; treat dizziness and review sedating medicines.

**When to seek care:** Hot swollen single joint with fever, deformity after injury, inability to bear weight, or back pain with numbness/bladder change — urgent care. **Misconception:** "All joint pain means uric acid" — many causes exist; test only as advised. **Limitation:** X-ray/labs plus examination separate OA, RA and gout.`,
  },
  {
    id: "sports-tendon-shoulder-carpal",
    keywords: ["sports injury", "ligament tear", "acl", "moch", "tendonitis", "tennis elbow", "frozen shoulder", "kandha jam", "carpal tunnel", "kalai sunn", "heel pain plantar"],
    title: "Sports injuries, tendonitis, frozen shoulder and carpal tunnel",
    category: "Orthopedics and Rehabilitation",
    sources: ["MedlinePlus", "National Health Service (NHS)"],
    body: `**Simple explanation:** Ligament tears (e.g. knee ACL) follow twists with swelling/instability. Tendonitis/bursitis is overuse inflammation (tennis elbow, heel/plantar pain, shoulder bursitis). Frozen shoulder stiffens the joint; carpal tunnel compresses the wrist nerve (night-time hand numbness, grip weakness).

**First response (RICE):** Rest, Ice wrapped in cloth 15–20 min, Compression, Elevation; avoid heat/alcohol/massage in the first 48 hours of a fresh injury.

**Recovery:** Gradual physiotherapy, technique correction, proper footwear, ergonomic breaks; wrist splints at night for carpal symptoms; diabetes control aids shoulder healing.

**When to seek care:** Audible pop with swelling, joint giving way, numb/cold limb, or hand wasting/weakness — prompt orthopaedic review; surgery/brace decisions need MRI/examination. **Misconception:** "Complete bed rest heals fastest" — guided movement heals better than prolonged immobilisation. **Limitation:** Grade of tear needs examination plus MRI.`,
  },
  {
    id: "physio-rehab-recovery",
    keywords: ["physiotherapy", "physio", "rehab", "walker", "chhadi", "kamar belt", "surgery recovery haddi", "bed rest kitna", "exercise after fracture"],
    title: "Physiotherapy, mobility aids and recovery after injury/surgery",
    category: "Orthopedics and Rehabilitation",
    sources: ["MedlinePlus", "National Health Service (NHS)"],
    body: `**Simple explanation:** Rehabilitation restores strength, balance and confidence after injury, fracture, joint replacement or spine surgery. Mobility aids (walker, cane/chhadi, braces) are temporary supports, not lifelong dependence when used correctly.

**Principles:** Start physio as soon as the surgeon/doctor permits; small frequent sessions beat occasional intense ones; pain should ease within a day of exercise — report sharp or night pain; protein, vitamin D/calcium and sleep aid healing; keep follow-up X-rays and suture/dressing schedules.

**Home safety:** Clear clutter, non-slip mats, raised chair/toilet, good footwear; never adjust aids to the wrong height.

**When to seek care:** Wound redness/fever after surgery, calf swelling (possible clot), chest pain/breathlessness, or sudden loss of movement — urgent care. Never override your surgeon's weight-bearing or bending limits. **Limitation:** Protocols vary by operation and fracture pattern.`,
  },
  {
    id: "ent-ear-tinnitus",
    keywords: ["kaan dard", "ear pain", "kaan behna", "hearing kam", "sunai kam", "बहरापन", "tinnitus", "kaan me seeti", "kaan bajna", "ear wax", "kaan saaf"],
    title: "Ear infections, hearing loss and tinnitus",
    category: "Ear, Nose and Throat Health",
    sources: ["MedlinePlus", "National Health Service (NHS)"],
    body: `**Simple explanation:** Middle-ear infection causes ear pain with cold/fever (children tug ears); outer-ear infection ("swimmer's ear") pains when pulling the ear. Gradual hearing loss comes from wax, age, noise or chronic infection; ringing (tinnitus — kaan me seeti/bajna) follows noise, earwax, BP, thyroid, or some medicines.

**What helps:** Do not poke with buds/pins; keep ears dry during infection; treat cold/nasal blockage; limit loud earphones (60/60 rule); mention ringing medicines to your doctor.

**When to seek urgent care:** Sudden hearing loss (hours to 3 days), severe vertigo with vomiting, ear discharge with high fever/mastoid swelling, or head injury with ear bleeding/fluid — same-day ENT review; sudden loss is treated as an emergency.

**Misconception:** "Ear buds clean safely" — they push wax deeper and injure the drum. **Limitation:** Audiometry/otoscopy decide wax vs nerve vs infection causes.`,
  },
  {
    id: "ent-sinus-tonsil-nosebleed",
    keywords: ["sinus", "sinusitis", "naak band", "allergic rhinitis", "chheenk allergy", "tonsil", "gala sujan tonsil", "naak khoon", "nakseer", "nosebleed"],
    title: "Sinusitis, allergic rhinitis, tonsillitis and nosebleeds",
    category: "Ear, Nose and Throat Health",
    sources: ["MedlinePlus", "National Health Service (NHS)"],
    body: `**Simple explanation:** Sinusitis is sinus inflammation after colds/allergy — facial pressure, blocked nose, thick discharge, reduced smell. Allergic rhinitis is dust/pollen-driven sneezing with itchy watery nose/eyes. Tonsillitis is throat-gland infection with painful swallowing. Nosebleeds (nakseer) follow dry air, nose-picking, colds or high BP.

**What helps:** Saline rinses/sprays, steam, allergy dust control, fluids; sit upright, lean slightly forward and pinch the soft nose for 15 minutes for bleeds; spit blood rather than swallowing.

**When to seek care:** Bleed beyond 20 minutes despite pressure, both-nostril heavy bleeds with dizziness, tonsillitis with drooling/one-sided severe pain/dehydration, or sinus pain with eye swelling/vision change/high fever — urgent ENT care.

**Misconception:** "All sinus pain needs antibiotics" — most is viral/allergic; antibiotics only for judged bacterial cases. **Limitation:** Recurrent tonsillitis/sinus disease may need endoscopy or sleep evaluation.`,
  },
  {
    id: "ent-vertigo-emergency",
    keywords: ["kaan chakkar", "bppv", "aankh hilna chakkar", "gala atak", "saans gala", "aawaz band", "kaan emergency", "galti nigalna"],
    title: "Inner-ear vertigo and urgent ENT warning signs",
    category: "Ear, Nose and Throat Health",
    sources: ["MedlinePlus", "National Health Service (NHS)"],
    body: `**Simple explanation:** Brief spinning on turning in bed is often BPPV (dislodged ear crystals); Meniere's adds ringing with hearing fluctuation; vestibular migraine links headache with dizziness. ENT urgencies include sudden deafness, facial droop with ear pain (possible Ramsay Hunt/bell's with vesicles), throat foreign body with drooling, or neck swelling with breathing trouble.

**What helps:** Sit/lie safely during spins; avoid driving; ENT repositioning manoeuvres help BPPV; migraine diary helps vestibular cases.

**Emergency — call 112:** Stridor/noisy breathing, drooling with inability to swallow, sudden hearing loss, vertigo with double vision/slurred speech/weakness (possible stroke), or button-battery/coin swallowing in children.

**Misconception:** "Vertigo always means low BP" — ear, migraine and brain causes differ and need different treatment. **Limitation:** Nystagmus pattern plus hearing tests localise the cause.`,
  },
  {
    id: "blood-anemia-b12",
    keywords: ["anemia", "khoon kam", "खून की कमी", "hemoglobin kam", "iron kam", "chakkar kamzori khoon", "b12 kam", "folate", "jeebh jalan", "haath sunn b12"],
    title: "Iron, vitamin B12 and folate deficiency anemia",
    category: "Blood Disorders",
    sources: ["World Health Organization", "MedlinePlus"],
    body: `**Simple explanation:** Anemia means low hemoglobin so tissues get less oxygen — fatigue, pallor, breathlessness on exertion, dizziness, hair fall, spoon-shaped nails (iron), or tongue soreness with tingling (B12/folate). Iron deficiency (blood loss, pregnancy, poor diet, worms) is commonest; B12/folate deficiency follows vegetarian diets, gut/medicine issues or alcohol use.

**Next steps:** CBC with ferritin/B12/folate as advised; stool test for hidden blood; deworming where indicated; find the cause (heavy periods, piles, frequent donation, medicines) — not just tablets.

**Care:** Iron-rich foods (greens, lentils, jaggery with vitamin-C foods), iron tablets away from tea/coffee as directed; B12 replacement by diet/injection/tablets per deficiency; retest as scheduled.

**When to seek care:** Fainting, chest pain, breathlessness at rest, black stools, or pregnancy with anemia — prompt review; never transfuse/take high-dose iron without prescription. **Misconception:** "Pomegranate/beetroot alone fix anemia" — they help diets but rarely correct deficiency alone. **Limitation:** Thalassemia trait mimics iron deficiency on reports — electrophoresis decides before long iron courses.`,
  },
  {
    id: "blood-thalassemia-clotting",
    keywords: ["thalassemia", "sickle cell", "hemophilia", "khoon na rukna", "platelet kam", "dengue platelet", "itp", "neel padna", "bleeding disorder", "thalassemia test"],
    title: "Thalassemia, sickle cell, hemophilia and platelet disorders",
    category: "Blood Disorders",
    sources: ["World Health Organization", "MedlinePlus", "National Health Mission, India"],
    body: `**Simple explanation:** Thalassemia/sickle-cell are inherited hemoglobin disorders (lifelong anemia, pain crises in sickle, transfusion/chelation needs) — carrier screening before marriage/pregnancy matters. Hemophilia/clotting-factor deficiency causes prolonged bleeding after cuts, joint bleeds and easy bruising. Low platelets (dengue, ITP, medicines) cause gum/nose bleeds, petechiae (tiny red spots) and heavy periods.

**Prevention/care:** Vaccinations, folic acid/hydroxyurea/transfusion only as a hematologist directs; avoid NSAIDs/contact sports where bleeding risk is high; insect precautions and prompt fever care in sickle-cell; iron chelation compliance in thalassemia major.

**When to seek urgent care:** Head injury with bleeding disorder, joint rapidly swelling with pain, uncontrolled bleed, black stools/vomiting blood, or platelets very low with active bleeding — emergency care.

**Misconception:** "Carriers need treatment like patients" — carriers usually need counselling and partner testing, not transfusions. **Limitation:** Factor assays, HPLC/electrophoresis and smears confirm these; chat cannot classify them.`,
  },
  {
    id: "blood-cbc-counts",
    keywords: ["cbc report", "hb report", "wbc high", "tlc high", "platelet report", "esr high", "blood report samjhao", "wbc kam", "neutrophil high"],
    title: "Understanding CBC: hemoglobin, WBC and platelets",
    category: "Blood Disorders",
    sources: ["MedlinePlus", "National Health Service (NHS)"],
    body: `**Simple explanation:** CBC counts blood parts: hemoglobin/RBC (oxygen carriers), WBC/TLC with neutrophils/lymphocytes (infection fighters — high suggests infection/inflammation, low suggests viral/suppression), platelets (clotting), plus ESR/CRP inflammation markers. I never diagnose from an isolated value.

**General reading:** Mild deviations with no symptoms are often rechecked; trends and symptoms matter more than one line; fasting/hydration, recent infection, medicines and lab ranges shift values.

**When to seek prompt review:** Very low hemoglobin with symptoms, WBC very high/low with fever, platelets below ~50,000 or falling with bleeding, or blasts/abnormal cells flagged — same-day clinician review with the full report and history.

**Misconception:** "High TLC always means antibiotics are needed" — viruses, stress, steroids and inflammation also raise it. **Limitation:** Smear, cultures and repeat testing with examination decide; bring previous reports.`,
  },
  {
    id: "geriatric-falls-memory",
    keywords: ["buzurgo girna", "fall old age", "girne se bachao", "walker buzurg", "yaaddasht budhape", "dementia old", "bhoolna buzurg", "frailty", "kamzori budhape", "chalne me dikkat buzurg"],
    title: "Falls, frailty, memory and bone care in older adults",
    category: "Geriatric and Preventive Healthcare",
    sources: ["World Health Organization", "Centers for Disease Control and Prevention (CDC)"],
    body: `**Simple explanation:** Ageing brings weaker balance, vision and bones. Falls are the top injury cause; frailty means low reserve after minor illness; gradual memory loss may be mild cognitive impairment or dementia needing assessment — not "just old age".

**Fall prevention:** Exercise (strength/balance/Tai-chi style), vitamin D, vision/hearing correction, sturdy footwear, home rails, lighting, no loose rugs/cords, review sleeping/BP medicines causing dizziness.

**Memory/bone care:** Routine, clocks/calendars, hearing aids, social activity; calcium/vitamin D, walks, DEXA scans and fall-plan after any fracture.

**When to seek care:** Fall with head injury, hip pain/inability to walk, sudden confusion (possible infection/dehydration), or rapid memory/behaviour change — urgent review.

**Caregiver tips:** Accompany to visits with medicine lists, simplify dosing, watch nutrition, hydration and mood. **Limitation:** Delirium (sudden) vs dementia (gradual) needs examination and labs.`,
  },
  {
    id: "geriatric-meds-checkups",
    keywords: ["zyada dawai", "polypharmacy", "dawai review", "checkup old age", "saalana jaanch", "caregiver", "dawai bhoolna", "bp sugar checkup kitna"],
    title: "Medicines review, checkups and caregiver guidance",
    category: "Geriatric and Preventive Healthcare",
    sources: ["World Health Organization", "MedlinePlus"],
    body: `**Simple explanation:** Older adults often take many medicines (polypharmacy) raising interaction, fall and kidney risks. Regular review removes duplicates and wrong doses. Age-appropriate screening (BP, sugar, lipids, vision, hearing, dental, cancer screens by risk, vaccines) catches disease early.

**What to do:** Keep one updated medicine list (with supplements); ask yearly: "Is each drug still needed?"; use pill boxes/alarms; never borrow others' prescriptions; keep vaccines (flu, pneumococcal, tetanus, shingles where advised) current.

**Caregivers:** Track appointments, hydration, protein intake, sleep, mood and continence; plan respite — burnout harms both sides; discuss advance wishes kindly.

**When to seek care:** New confusion after a new drug, repeated falls, bleeding on blood thinners, or missed critical doses (insulin, heart drugs). **Limitation:** Deprescribing needs the prescriber — never stop heart, seizure or psychiatric drugs abruptly.`,
  },
  {
    id: "mens-sexual-prostate",
    keywords: ["erectile", "namardi", "ling khada", "timing problem", "male infertility", "veer kam", "testosterone kam", "dadhi awaz", "prostate peshab old man"],
    title: "Erectile health, male fertility and testosterone",
    category: "Men's Health",
    sources: ["MedlinePlus", "National Health Service (NHS)"],
    body: `**Simple explanation:** Occasional erection difficulty is common (stress, sleep loss, alcohol); persistent difficulty (3+ months) often reflects diabetes, BP, cholesterol, medicines, smoking, or anxiety/depression — and deserves a private, non-judgmental medical review. Male infertility (low count/motility) needs semen analysis plus hormone/examination review. Low testosterone causes low desire, fatigue and mood change but is over-claimed online.

**What helps:** Control sugar/BP/cholesterol, no tobacco, healthy weight, sleep, limit alcohol; do NOT take unprescribed hormonal/ayurvedic "power" mixes — some contain steroids harming fertility and liver.

**When to seek advice:** Persistent dysfunction, chest pain with exertion, infertility beyond 12 months (6 months if partner beyond 35), or breast enlargement with testicular change — urologist/endocrinologist review.

**Misconception:** "Supplements prove masculinity" — most advertised cures lack evidence and hide risks. **Limitation:** Hormone testing needs morning samples and clinical context.`,
  },
  {
    id: "mens-testicular-selfcheck",
    keywords: ["ando me ganth", "testicle lump", "ando dard", "ando sujan", "testicular pain", "gatth andkosh", "self check testicle"],
    title: "Testicular lumps, pain and self-awareness",
    category: "Men's Health",
    sources: ["MedlinePlus", "National Health Service (NHS)"],
    body: `**Simple explanation:** Know what is normal for you: one testicle often slightly larger; see a doctor for any new painless lump, swelling, heaviness, or persistent ache — most causes (infection, fluid, varicocele) are benign, but testicular cancer, though uncommon, is highly curable when caught early, and torsion (sudden severe pain with vomiting) is an emergency.

**Self-awareness (monthly):** After a warm shower, roll each testicle gently; feel for new hard lumps, size change or pain; check for sudden swelling after injury/fever.

**When to seek urgent care:** Sudden severe testicular pain (possible torsion — hours matter), trauma with swelling, or fever with intense pain — go to emergency immediately; new painless lumps need same-week urology review with ultrasound.

**Misconception:** "Pain always means infection needing leftover antibiotics" — torsion, hernia and tumours also pain; examination decides. **Limitation:** Only ultrasound/examination classifies lumps.`,
  },
  {
    id: "sexual-sti-contraception",
    keywords: ["std", "sti", "gupt rog", "यौन रोग", "condom", "garbh nirodh", "pregnancy rokna", "unprotected sex", "hiv test sex", "discharge sex", "gupt bimari jaanch"],
    title: "STIs, testing and contraception",
    category: "Sexual and Reproductive Health",
    sources: ["World Health Organization", "Centers for Disease Control and Prevention (CDC)"],
    body: `**Simple explanation:** Sexually transmitted infections (chlamydia, gonorrhoea, syphilis, herpes, HPV, HIV, trichomoniasis) often have no symptoms; clues include discharge, burning urination, sores, warts or pelvic pain. Testing is confidential — urine/blood/swab tests with partner treatment prevent reinfection. Contraception options (condoms, pills, IUDs, injectables, implant, emergency pill, sterilisation) differ in effectiveness, side effects and STI protection — only condoms also block STIs/HIV.

**Age-appropriate, non-judgmental facts:** Consent, privacy and mutual respect matter; no assumptions about relationships. Emergency contraception works best within 72 hours (up to 5 days for some methods/IUD) — not an abortion method and not for regular use.

**When to seek care:** Exposure, symptoms, or positive partner result — prompt testing; fever with pelvic pain, testicular pain, pregnancy with discharge, or condom breakage needing emergency advice.

**Misconception:** "No symptoms means no infection" — silent STIs still transmit and harm fertility. **Limitation:** Test timing (window periods) and examination decide treatment; partners need simultaneous care.`,
  },
  {
    id: "repro-fertility-menopause",
    keywords: ["infertility", "baanjh", "bacha nahi", "semen test", "menopause", "mahwari band 45", "garam flash", "perimenopause", "pelvic pain", "pcod fertility", "anda test amh"],
    title: "Fertility evaluation, menopause and pelvic health",
    category: "Sexual and Reproductive Health",
    sources: ["World Health Organization", "MedlinePlus"],
    body: `**Simple explanation:** Infertility means no pregnancy after 12 months of regular trying (6 months if the woman is beyond 35) — evaluation covers ovulation, tubes, uterus, semen and thyroid/prolactin. Menopause (periods stopped 12 months, usually 45–55) with perimenopause years of irregular cycles, hot flashes, sleep/mood change and vaginal dryness is natural. Pelvic health (bladder/bowel control, prolapse heaviness, chronic pelvic pain) responds to pelvic-floor therapy and timely gynaecology/urology care.

**Care:** Track cycles; healthy weight; folic acid when planning; menopause relief via lifestyle, lubricants/moisturisers, and doctor-discussed hormonal/non-hormonal options with risks/benefits.

**When to seek care:** Bleeding after menopause, severe pelvic pain, inability to conceive in timelines, or bulge/incontinence affecting life — prompt review; sudden severe pelvic pain with fainting needs emergency care.

**Myths corrected:** Infertility is not only the woman's issue — male factors cause ~half of cases; menopause does not end the need for cervical/breast screening. **Limitation:** AMH/semen values need specialist interpretation, not chat diagnosis.`,
  },
  {
    id: "skin-psoriasis-fungal-vitiligo",
    keywords: ["psoriasis", "soraisis", "chamdi moti", "rosacea", "chehra laal", "fungal", "daad", "दाद", "khujli jangh", "vitiligo", "safed daag", "leucoderma", "skin safed"],
    title: "Psoriasis, rosacea, fungal infections and vitiligo",
    category: "Dermatology and Hair Disorders",
    sources: ["MedlinePlus", "National Health Service (NHS)"],
    body: `**Simple explanation:** Psoriasis causes thick silvery-scaly plaques (elbows, knees, scalp) — an immune condition, not contagious. Rosacea causes facial redness/flushing with bumps. Fungal infections (daad — ring-shaped itchy patches in groin/feet/body) thrive in sweat. Vitiligo (safed daag) is pigment loss — autoimmune, not leprosy and not contagious.

**Care:** Moisturise, gentle bathing, prescribed antifungals for the full duration (do not mix steroid creams without advice); sun protection; trigger diary (stress, alcohol/spicy food for rosacea; sweat for fungus).

**When to see a dermatologist:** Spreading/pus-filled lesions, nail pits with joint pain, rapidly changing mole, white patches spreading fast, or steroid-mixed creams used beyond weeks — in-person examination with Wood's lamp/scraping decides.

**Misconception:** "Fungal creams with steroids work faster, so they're better" — steroids mask infection and worsen spread; antifungal-only courses cure. **Limitation:** These look alike; scraping/biopsy confirms.`,
  },
  {
    id: "hair-alopecia-loss",
    keywords: ["baal jhad", "baal", "jhad", "jhadna", "hair fall", "hairfall", "baldness", "ganjapan", "alopecia", "takla", "dandruff severe", "telogen", "patch hair loss", "daadi baal jhad"],
    title: "Hair loss patterns and alopecia",
    category: "Dermatology and Hair Disorders",
    sources: ["MedlinePlus", "National Health Service (NHS)"],
    body: `**Simple explanation:** Daily loss of 50–100 hairs is normal. Pattern loss (receding/male crown, female widening part), postpartum or post-illness shedding, patchy alopecia areata (immune), thyroid/iron/B12/PCOS-related shedding and traction loss (tight hairstyles) differ in treatment.

**Care:** Gentle handling, balanced protein/iron, treating dandruff/thyroid/PCOS causes; proven options (minoxidil, hormonal or procedural care) only after dermatologist diagnosis; beware unproven oils promising regrowth in weeks.

**When to see a dermatologist:** Sudden patchy bald spots, scarring/pain/pus on scalp, eyebrow/eyelash loss, or shedding beyond 3 months with iron/thyroid clues — pull test, trichoscopy and labs decide.

**Misconception:** "Shaving heads grows thicker hair" — shaving does not change follicles. **Limitation:** Cause needs history plus examination; chat cannot grade loss.`,
  },
  {
    id: "skin-infection-wound-cancer",
    keywords: ["skin infection", "cellulitis", "twacha laal garam", "ghav na bhare", "diabetic wound", "mole change", "mole", "changing shape", "til badalna", "til badal", "skin cancer lakshan", "dermatologist kab"],
    title: "Skin infections, slow wounds and skin-cancer signs",
    category: "Dermatology and Hair Disorders",
    sources: ["MedlinePlus", "Centers for Disease Control and Prevention (CDC)"],
    body: `**Simple explanation:** Cellulitis is spreading bacterial redness with warmth, swelling and fever needing antibiotics. Diabetic/leg wounds heal slowly with poor circulation. Skin-cancer clues (ABCDE): Asymmetry, Border irregularity, Colour variation, Diameter growing, Evolving mole/spot, plus non-healing sores and bleeding growths.

**Wound care:** Clean with water, cover, change dressings, control sugar, offload foot pressure; photograph size with a ruler for follow-up.

**When to seek care:** Rapidly spreading redness with fever, red streaks, pus with diabetes/immunosuppression, or any changing/bleeding mole or sore beyond 3 weeks — prompt dermatology/surgical review; extensive infection with fever needs urgent care.

**Misconception:** "Dark skin cannot get skin cancer" — risk is lower but acral/mucosal melanomas occur; any changing lesion deserves a look. **Limitation:** Dermoscopy plus biopsy confirm; photos alone cannot rule out cancer.`,
  },
  {
    id: "eye-cataract-glaucoma-retina",
    keywords: ["motiyabind", "cataract", "kala motia", "glaucoma", "aankh pressure", "sugar aankh", "retinopathy", "retina sugar", "parda", "amd", "budhape nazar", "dhundhla motia"],
    title: "Cataract, glaucoma, diabetic retina and macular degeneration",
    category: "Eye Diseases Beyond Eye Strain",
    sources: ["MedlinePlus", "National Health Service (NHS)"],
    body: `**Simple explanation:** Cataract (motiyabind) clouds the lens — gradual painless blur, glare at night; surgery replaces it. Glaucoma (kala motia) damages the optic nerve from eye pressure — often silent until late tunnel vision. Diabetic retinopathy damages retinal vessels (spots, bleeding) — needs yearly dilated eye exams. Macular degeneration (AMD) blurs central reading vision in elders.

**Care:** Sugar/BP control, no smoking, sunglasses outdoors, prescribed pressure drops exactly on time (glaucoma drops prevent blindness — never stop when "feeling fine").

**When to seek urgent care:** Sudden vision loss, severe eye pain with headache/vomiting/halos (angle-closure glaucoma), or flashes with a shower of floaters/curtain (retinal detachment) — emergency eye care the same day.

**Misconception:** "Cataract is cured by drops" — only surgery restores it; delay till "fully ripe" is outdated advice. **Limitation:** Slit-lamp, pressure, OCT and dilated retina exams stage these.`,
  },
  {
    id: "eye-urgent-detachment",
    keywords: ["achanak dhundhla", "ek aankh dhundhla", "ek aankh se dhundhla", "aankh se dhundhla", "achanak ek aankh", "dhundhla dikh", "dhundhla", "sudden vision loss", "parda fatna", "retinal detachment", "floaters flash", "bijli aankh", "curtain aankh", "chemical aankh"],
    title: "Sudden vision changes and eye emergencies",
    category: "Eye Diseases Beyond Eye Strain",
    sources: ["MedlinePlus", "National Health Service (NHS)"],
    body: `**Simple explanation:** "Mujhe achanak ek aankh se dhundhla dikh raha hai" is an urgent symptom — causes include retinal detachment (flashes, new floaters, dark curtain), vitreous bleeding (diabetes), optic-nerve stroke, angle-closure glaucoma, or chemical/injury damage. Time decides saving sight.

**What to do now:** Do not rub; shield an injured eye; for chemical splash, rinse with clean water for 20 minutes while seeking care; keep diabetes/sickle/thyroid history ready; avoid driving.

**Emergency — same-day eye care or 112:** Any sudden loss/distortion in one or both eyes, severe pain, double vision with droop, chemical/penetrating injury, or curtain/floaters-flashes. Keep emergency responses short — get examined first, chat later.

**Misconception:** "Rest will fix sudden blur" — detachment and vascular blocks worsen with waiting. **Limitation:** Only dilated exams and scans localise the cause.`,
  },
  {
    id: "eye-refractive-lens",
    keywords: ["chashma number", "myopia", "hyperopia", "astigmatism", "nazar kam", "dhoor nazar", "lens hygiene", "contact lens", "safed motia lens"],
    title: "Refractive errors and contact-lens hygiene",
    category: "Eye Diseases Beyond Eye Strain",
    sources: ["MedlinePlus", "National Health Service (NHS)"],
    body: `**Simple explanation:** Myopia (distant blur), hyperopia (near strain), astigmatism (distorted/double images) and presbyopia (beyond ~40, reading difficulty) are focusing errors corrected by glasses, contacts or doctor-advised laser options.

**Lens hygiene:** Wash/dry hands; rub-clean with fresh solution daily (never water/saliva/topping-up); replace cases regularly; remove before swimming/sleeping unless prescribed; red painful eye means remove lens and seek care (possible keratitis/ulcer).

**Children:** Outdoor time, 20-20-20 screen breaks, yearly school-vision checks; rapidly worsening myopia needs an ophthalmologist's myopia-control plan.

**When to seek care:** Eye pain/redness with lenses, haloes, or sudden number change with diabetes/pregnancy. **Misconception:** "Wearing glasses weakens eyes" — glasses do not worsen numbers; skipping them strains. **Limitation:** Refraction plus retinal exam set the right correction.`,
  },
  {
    id: "surgery-prepare-anesthesia",
    keywords: ["operation taiyari", "surgery prepare", "upvas operation", "anesthesia", "behoshi", "spinal anesthesia", "sunn operation", "surgery fasting", "dawai operation pehle"],
    title: "Preparing for surgery and understanding anesthesia",
    category: "Surgery and Hospital Care",
    sources: ["MedlinePlus", "National Health Service (NHS)"],
    body: `**Simple explanation:** Preparation (fasting, medicine review, blood tests, consent, anaesthesia check-up) keeps surgery safe. Anesthesia blocks pain: general (fully asleep), spinal/epidural (lower body numb, awake), local (small area), or sedation — chosen by the anaesthetist with your history.

**General instructions (never overriding your surgeon):** Fast exactly as told (usually no food/drink for stated hours); list all medicines, allergies, diabetes/BP/heart/thyroid history, smoking and pregnancy; arrange a companion and leave valuables home; bathe as instructed.

**Questions to ask:** Why is surgery needed? Are there non-surgical options? What are benefits/risks? What anesthesia suits me? How long is recovery and what help will I need?

**Misconception:** "Anesthesia always causes permanent back pain" — transient soreness can occur, but lasting injury is uncommon with modern care. **Limitation:** Fasting times, drug holds and fitness decisions are individual — follow your hospital's letter.`,
  },
  {
    id: "surgery-wound-discharge",
    keywords: ["operation baad", "tanke care", "wound infection", "peep operation", "discharge paper", "operation dard kab", "chalna operation baad", "khana operation baad"],
    title: "Wound care, discharge and recovery after surgery",
    category: "Surgery and Hospital Care",
    sources: ["MedlinePlus", "National Health Service (NHS)"],
    body: `**Simple explanation:** Healing needs clean wounds, graded movement, protein, sleep and prescribed medicines. Discharge papers list diet, dressing dates, stitch removal, danger signs and follow-up — keep them accessible.

**Wound care:** Wash hands before touching dressings; keep the area clean/dry as instructed; watch for infection: increasing redness, swelling, warmth, pus, bad smell, opening edges, or fever.

**Recovery:** Walk as soon as permitted (prevents clots/pneumonia); breathing/cough exercises after chest/abdominal surgery; take painkillers before pain peaks; complete antibiotics if prescribed.

**Seek urgent care for:** Heavy bleeding, wound bursting open, calf pain/swelling, chest pain/breathlessness, persistent vomiting, no urine/gas with bloating, or fever beyond 48 hours. **Limitation:** Restrictions (lifting, bathing, driving, bending) differ by operation — your surgeon's sheet governs.`,
  },
  {
    id: "imaging-tests-guide",
    keywords: ["xray", "x-ray", "ultrasound", "sonography", "usg", "ct scan", "mri", "contrast test", "ecg eeg", "endoscopy", "colonoscopy", "biopsy test", "scan report samjhao", "radiation scan"],
    title: "X-ray, ultrasound, CT, MRI, ECG/EEG, endoscopy and biopsy",
    category: "Medical Imaging and Diagnostic Procedures",
    sources: ["MedlinePlus", "National Health Service (NHS)"],
    body: `**Simple explanation:** X-ray shows bones/chest quickly (small radiation). Ultrasound/sonography uses sound waves (no radiation; safe in pregnancy). CT gives detailed slices (more radiation; sometimes contrast dye). MRI uses magnets (no radiation; noisy, longer; metal implants must be declared). ECG records heart rhythm; EEG records brain waves. Endoscopy/colonoscopy view food pipe/stomach/colon with a camera (bowel prep needed). Biopsy/pathology examines tissue under a microscope — the definitive test for many lumps and cancers.

**Preparation:** Follow fasting/contrast, kidney/thyroid/allergy and pregnancy instructions; bring prior scans for comparison; remove metal for MRI.

**Important:** I never diagnose from an isolated scan line — results are read with symptoms, examination and history; "mild" findings still need the ordering doctor's interpretation.

**When to seek care:** Contrast allergy signs (rash, breathlessness), severe pain/bleeding after endoscopy/biopsy, or worsening symptoms while awaiting results. **Limitation:** Incidental findings are common; your clinician decides what matters.`,
  },
  {
    id: "lab-tests-results",
    keywords: ["cbc", "lipid profile", "sugar test fasting", "hba1c", "thyroid test", "lft kft", "urine test", "contrast kidney", "report normal range", "test khali pet", "vitamin d test"],
    title: "Common lab tests, preparation and reading results",
    category: "Medical Imaging and Diagnostic Procedures",
    sources: ["MedlinePlus", "National Health Service (NHS)"],
    body: `**Simple explanation:** Common labs: CBC (blood counts), sugar/HbA1c (diabetes), lipid profile (cholesterol), thyroid panel, LFT/KFT (liver/kidney), urine routine, vitamin D/B12/iron studies. Fasting matters for sugar/lipids; morning sampling for some hormones; hydration and medicines shift values.

**Reading results:** Ranges differ by lab, age, sex and pregnancy; a slightly out-of-range line without symptoms is often rechecked, not treated; trends beat single values.

**Contrast/test safety:** Mention kidney disease, allergies, asthma, metformin, and pregnancy before contrast scans; diabetics clarify sugar-medicine plans for fasting tests.

**Important:** No single value rules disease in or out — symptoms, history and examination complete the picture. Tell me which test you had and I can explain in general what it measures. **Limitation:** Personal report interpretation needs your clinician with full history.`,
  },
  {
    id: "nutrition-clinical-recovery",
    keywords: ["kuposhan", "malnutrition", "kamzor bachcha", "recovery diet", "bimari ke baad khana", "buzurg khana", "kidney diet", "liver diet", "protein recovery", "vajan kam diet"],
    title: "Malnutrition, recovery, older-adult and organ diets",
    category: "Nutrition Science and Clinical Nutrition",
    sources: ["World Health Organization", "MedlinePlus"],
    body: `**Simple explanation:** Malnutrition (undernutrition or obesity with deficiencies) weakens immunity and healing. Recovery, old age, and kidney/liver disease change needs — I share principles only, never restrictive disease-diets without supervision.

**General principles:** Regular protein (dal/beans, milk/curd, eggs, lean meat as suitable), colourful vegetables/fruits, whole grains, fluids; small frequent meals after illness; vitamin D/calcium and fibre for elders; soft, easy-to-chew foods where swallowing is weak.

**Kidney/liver notes (supervision needed):** Salt/fluid/potassium/protein limits depend on stage and labs — follow the treating doctor/dietitian, not internet charts.

**When to seek care:** Unplanned weight loss, swallowing difficulty, oedema with diet change, or sugar/BP swinging with new diets. **Misconception:** "More protein powder is always better" — excess strains kidneys and interacts with disease. **Limitation:** Therapeutic diets are prescription-like and individual.`,
  },
  {
    id: "nutrition-allergy-labels",
    keywords: ["food allergy", "moongfali allergy", "doodh allergy", "lactose", "gluten", "label padhna", "packet food", "sugar free", "diet claim"],
    title: "Food allergy vs intolerance and reading food labels",
    category: "Nutrition Science and Clinical Nutrition",
    sources: ["World Health Organization", "Centers for Disease Control and Prevention (CDC)"],
    body: `**Simple explanation:** Allergy is immune-driven (hives, swelling, wheeze, even anaphylaxis — peanut, milk, egg, fish, soy, wheat) and needs strict avoidance plus emergency plans. Intolerance (lactose, gluten sensitivity, spice) causes bloating/gas without immune danger but still needs evaluation before cutting food groups.

**Labels:** Check serving size, total sugar/salt/saturated fat, fibre and protein per 100 g; "sugar-free" may still be calorie-rich; "natural/herbal" is not safety proof; allergen bold-text and expiry matter most.

**Safety:** Carry prescribed adrenaline auto-injector if advised; call **112** for breathing difficulty or face/tongue swelling after food.

**When to seek care:** Repeated reactions, childhood growth faltering on restricted diets, or confusion between allergy and intolerance — allergist/dietitian review with food diaries. **Limitation:** Internet intolerance panels over-diagnose; supervised elimination with reintroduction is the standard.`,
  },
  {
    id: "nutrition-weight-supplements",
    keywords: ["vajan kam karna", "weight loss", "motapa kam", "crash diet", "keto", "supplement myth", "protein powder", "fat burner", "multivitamin daily", "herbal weight"],
    title: "Evidence-based weight control and supplement myths",
    category: "Nutrition Science and Clinical Nutrition",
    sources: ["World Health Organization", "MedlinePlus"],
    body: `**Simple explanation:** Lasting weight control comes from steady habits — balanced portions, daily activity, sleep, and fewer sugary/fried/ultra-processed foods — not 7-day transformations. Aim for slow loss (about 0.5 kg/week) with medical guidance if diabetes, thyroid, PCOS, heart or kidney disease exist.

**Supplement facts:** Most multivitamins, fat-burners and testosterone/height boosters lack proof and may harm liver, kidneys, heart or hormones; creatine/protein need indication and dose counselling; "no side effect" herbal weight products have caused failures.

**What works:** Home-cooked variety, water over sugary drinks, walking plus twice-weekly strength, mindful portions, and treating sleep/stress/medicines that drive weight.

**When to seek care:** Unexplained rapid loss/gain, chest pain with exercise, or eating-disorder patterns — prompt review. **Misconception:** "Skipping meals speeds loss" — it usually backfires into overeating and nutrient gaps. **Limitation:** Personal calorie/medicine plans need a clinician or dietitian.`,
  },
];

const EMERGENCY_KEYWORDS = MEDICAL_KNOWLEDGE.find((t) => t.id === "emergency")!.keywords;

/** Extra multilingual emergency patterns (English / Hindi / Hinglish). */
const EMERGENCY_PATTERNS: string[] = [
  "seene me dard", "seene mein dard", "chhati me dard", "chhati mein dard",
  "सीने में दर्द", "छाती में दर्द", "dil ka daura",
  "saans nahi", "sans nahi", "saans ruk", "sans ruk", "saans phoolna tez",
  "saans band", "dam ghut", "सांस नहीं", "साँस नहीं", "सांस रुक",
  "behosh", "बेहोश", "hosh nahi", "chakkar behosh",
  "lakwa", "लकवा", "muh tedha", "मुंह टेढ़ा", "bolne me dikkat", "bol nahi pa",
  "face droop", "drooping", "slurred", "sudden numbness", "one side weak",
  "ek taraf kamzor", "adha sharir",
  "bahut khoon", "khoon nahi ruk", "खून नहीं रुक", "bleeding heavily",
  "gala band", "chehra sooj saans",
  "marna chahta", "marna chahti", "aatmahatya", "आत्महत्या", "khud ko nuksan",
  "zeher kha", "overdose le li", "jalan gambhir", "jal gaya",
  "ek aankh dhundhla achanak", "achanak dikhna band",
  "pet me tez dard ulti khoon", "ulti me khoon", "potty me khoon tez",
  "daura 5 minute", "jhatke ruk nahi",
  "testicle tez dard", "ando tez dard",
  "prasav dard pani", "delivery emergency",
];

export type UserLanguage = "en" | "hi" | "hinglish" | "mixed";

const HINDI_WORDS = new Set([
  "meri", "mere", "mera", "mujhe", "mujhko", "hai", "hain", "ho", "raha", "rahi",
  "kya", "kaise", "kyun", "kyu", "kab", "kahan", "kaun", "kitna", "koi", "nahi",
  "mein", "me", "aur", "se", "ka", "ki", "ke", "ko", "par", "mein", "hota",
  "hoti", "dard", "bukhar", "khansi", "saans", "peshab", "pet", "sir", "aankh",
  "dil", "khoon", "dawai", "doctor", "ilaaj", "bimari", "thakan", "chakkar",
]);

/** Normalize text for matching: lowercase, strip punctuation, collapse spaces. */
export function normalizeText(s: string): string {
  return s
    .toLowerCase()
    .replace(/[‌‍]/g, "")
    .replace(/[^a-z0-9\u0900-\u097f\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Tiny edit distance for fuzzy token matching (misspellings). */
function editDistance(a: string, b: string): number {
  if (a === b) return 0;
  const m = a.length, n = b.length;
  if (Math.abs(m - n) > 2) return 99;
  const dp: number[] = Array.from({ length: n + 1 }, (_, j) => j);
  for (let i = 1; i <= m; i++) {
    let prev = dp[0];
    dp[0] = i;
    for (let j = 1; j <= n; j++) {
      const t = dp[j];
      dp[j] = Math.min(dp[j] + 1, dp[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = t;
    }
  }
  return dp[n];
}

/** Generic words that must never alone trigger a topic. */
const STOPWORDS = new Set([
  "hai", "hain", "ho", "kya", "kyaa", "kaise", "kaisee", "kyun", "kyu", "kyon",
  "kab", "kahan", "kaha", "kaun", "kitna", "kitne", "koi", "nahi", "nhi", "na",
  "mein", "main", "me", "mai", "aur", "or", "se", "sa", "ka", "ki", "ke", "ko",
  "par", "per", "ye", "yeh", "yah", "woh", "vo", "aap", "tum", "tera", "mera",
  "meri", "mere", "mujhe", "mujhko", "hota", "hoti", "hote", "raha", "rahi",
  "rahe", "gaya", "gayi", "karta", "karte", "the", "a", "an", "is", "are",
  "what", "does", "do", "mean", "means", "how", "why", "when", "which", "tell",
  "about", "problem", "problems", "issue", "disease", "health", "doctor",
  "report", "test", "please", "batao", "bataye", "jankari",
]);

function keywordMatches(normQuery: string, tokens: string[], keyword: string): number {
  const kw = normalizeText(keyword);
  if (!kw || STOPWORDS.has(kw)) return 0;
  if (normQuery.includes(kw)) {
    // Specificity weight: longer / multi-word keywords score more; short codes need boundaries.
    if (kw.length <= 3) {
      const re = new RegExp(`(^| )${kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}( |$)`);
      if (!re.test(` ${normQuery} `)) return 0;
      return 2.2;
    }
    return kw.includes(" ") ? 3 + kw.length / 20 : 1.6 + kw.length / 25;
  }
  // Fuzzy token-level match for misspellings / transliteration variants.
  const kwTokens = kw.split(" ");
  let best = 0;
  for (const kt of kwTokens) {
    if (kt.length < 5 || STOPWORDS.has(kt)) continue;
    for (const tok of tokens) {
      if (tok.length < 5) continue;
      const d = editDistance(tok, kt);
      const allowed = kt.length >= 8 ? 2 : 1;
      if (d <= allowed) best = Math.max(best, 0.9);
    }
  }
  return best;
}

export function detectLanguage(text: string): UserLanguage {
  const t = text.trim();
  if (/[\u0900-\u097F]/.test(t)) {
    return /[a-zA-Z]/.test(t) ? "mixed" : "hi";
  }
  const toks = normalizeText(t).split(" ").filter(Boolean);
  const hindiHits = toks.filter((x) => HINDI_WORDS.has(x)).length;
  if (hindiHits >= 2 || (hindiHits >= 1 && toks.some((x) => HINDI_WORDS.has(x) && x.length > 3))) {
    return toks.length > hindiHits ? "mixed" : "hinglish";
  }
  return "en";
}

export function isEmergency(text: string): boolean {
  const lower = text.toLowerCase();
  if (EMERGENCY_KEYWORDS.some((k) => lower.includes(k.toLowerCase()))) return true;
  const norm = ` ${normalizeText(text)} `;
  return EMERGENCY_PATTERNS.some((p) => norm.includes(normalizeText(p)));
}

export interface RankedTopic {
  topic: KnowledgeTopic;
  score: number;
}

export function rankTopics(text: string, limit = 4): RankedTopic[] {
  const norm = normalizeText(text);
  if (!norm) return [];
  const tokens = norm.split(" ").filter((t) => t && !STOPWORDS.has(t));
  const scored: RankedTopic[] = [];
  for (const topic of MEDICAL_KNOWLEDGE) {
    if (topic.id === "emergency") continue;
    let exactScore = 0;
    let fuzzyBest = 0;
    for (const kw of topic.keywords) {
      const m = keywordMatches(norm, tokens, kw);
      if (m >= 1.4) exactScore += m; // genuine phrase/word hit — cumulative
      else fuzzyBest = Math.max(fuzzyBest, m); // fuzzy: best only, never summed
    }
    let score = exactScore + (exactScore > 0 || fuzzyBest < 0.9 ? 0 : 1.5);
    // Small title-word overlap bonus (non-stopwords).
    const titleWords = normalizeText(topic.title).split(" ").filter((w) => w.length > 4 && !STOPWORDS.has(w));
    for (const w of titleWords) {
      if (tokens.includes(w)) score += 0.4;
    }
    if (score >= 1.4) scored.push({ topic, score });
  }
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, Math.max(1, Math.min(limit, 5)));
}

/** Backward-compatible: ranked relevant topics (never the emergency topic). */
export function findTopics(text: string, limit = 4): KnowledgeTopic[] {
  return rankTopics(text, limit).map((r) => r.topic);
}

/** Topics most relevant to a query plus recent history (for follow-ups). */
export function getRelevantTopics(query: string, history: string[] = [], limit = 4): KnowledgeTopic[] {
  const direct = rankTopics(query, limit);
  if (direct.length > 0) return direct.map((r) => r.topic);
  // Follow-up ("aur batao", "tell me more", "is ke bare me") → reuse last context.
  if (/aur|more|detail|samjhao|समझाओ|matlab/.test(normalizeText(query))) {
    for (let i = history.length - 1; i >= 0; i--) {
      const h = rankTopics(history[i], limit);
      if (h.length > 0) return h.map((r) => r.topic);
    }
  }
  return [];
}

export const DISCLAIMER =
  "I'm HealthWise AI, an information assistant — not a doctor. This is general information, not medical advice. If you're worried, please consult a qualified healthcare professional.";

/**
 * Grounding context for the AI model. With a query, returns only the most
 * relevant excerpts (token-efficient, avoids dumping the whole KB).
 * Without a query (legacy callers), returns a compact title index.
 */
export function knowledgeContext(query?: string, limit = 4): string {
  if (query && query.trim()) {
    const topics = rankTopics(query, limit).map((r) => r.topic);
    if (topics.length === 0) return "";
    return topics.map((t) => `### ${t.title}\n${t.body}`).join("\n\n");
  }
  return MEDICAL_KNOWLEDGE.filter((t) => t.id !== "emergency")
    .map((t) => `- ${t.title} [${t.id}]`)
    .join("\n");
}

/** Full dump (legacy / debugging only — prefer knowledgeContext(query)). */
export function fullKnowledgeContext(): string {
  return MEDICAL_KNOWLEDGE.map((t) => `### ${t.title}\n${t.body}`).join("\n\n");
}
