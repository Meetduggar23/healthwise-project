/**
 * Symptom Checker data — one reusable structure for every body region.
 * General educational information (MedlinePlus, NHS, WHO hubs). No dosages,
 * no diagnoses, no personal prescriptions. Emergencies are triaged BEFORE
 * routine advice (see symptomTriage.ts).
 */

export interface RegionCause {
  name: string;
  detail: string;
}

export interface BodyRegion {
  id: string;
  name: string;
  symptoms: string[];
  redFlags: string[];
  causes: RegionCause[];
  selfCare: string[];
  seeDoctor: string[];
  emergency: string[];
  specialists: string[];
  tests: string[];
  treatments: string[];
  surgery: string | null;
  related: string[];
  refs: { label: string; url: string }[];
  /** Extra educational note shown when the Female illustration is active. */
  femaleNote?: string;
}

const HUBS = [
  { label: "MedlinePlus — Health Topics", url: "https://medlineplus.gov/" },
  { label: "NHS — Health Conditions A to Z", url: "https://www.nhs.uk/conditions/" },
  { label: "World Health Organization", url: "https://www.who.int/" },
];

export const BODY_REGIONS: BodyRegion[] = [
  {
    id: "head",
    name: "Head",
    symptoms: ["Headache", "Dizziness", "Nausea or vomiting", "Vision changes", "Scalp tenderness", "Worst headache of my life", "Sudden facial drooping", "Slurred speech"],
    redFlags: ["Worst headache of my life", "Sudden facial drooping", "Slurred speech"],
    causes: [
      { name: "Tension headache", detail: "Dull pressure around the head, often linked to stress, posture, dehydration, or missed sleep." },
      { name: "Migraine", detail: "Stronger, often one-sided pain that may come with nausea or light sensitivity." },
      { name: "Sinus congestion", detail: "Pressure around the forehead and cheeks, worse with colds or allergies." },
      { name: "Eye strain or dehydration", detail: "Long screen time or too little water can trigger aching behind the eyes." },
    ],
    selfCare: ["Rest in a quiet, dark room and drink water", "Check posture, screen breaks, and sleep in the last 24 hours", "A cool cloth on the forehead may comfort tension-type pain"],
    seeDoctor: ["Headaches that keep returning or worsen over weeks", "Headache after a head injury", "Headache with fever and stiff neck", "New headaches after age 50 or with vision changes"],
    emergency: ["Sudden worst-ever headache, especially with vomiting, confusion, or fainting", "Facial drooping, one-sided weakness, or slurred speech (possible stroke) — note the time symptoms started"],
    specialists: ["General Physician", "Neurologist", "Ophthalmologist (if vision-related)"],
    tests: ["Blood pressure check", "Vision testing", "Neurological examination; scans only if the examination suggests them"],
    treatments: ["Doctors treat the cause: lifestyle correction, migraine-specific plans, sinus care, or vision correction — not one fixed tablet for every headache"],
    surgery: null,
    related: ["neck", "chest"],
    refs: HUBS,
  },
  {
    id: "neck",
    name: "Neck",
    symptoms: ["Stiffness", "Pain on movement", "Muscle spasm", "Pain after poor sleep posture", "Tingling down the arm", "Fever with severe stiffness"],
    redFlags: ["Fever with severe stiffness"],
    causes: [
      { name: "Muscle strain", detail: "Poor sleeping posture, long desk hours, or sudden movement overstretches neck muscles." },
      { name: "Cervical spondylosis", detail: "Age-related wear of neck joints and discs causing stiffness and aching." },
      { name: "Nerve irritation", detail: "A pressed neck nerve can send tingling or pain down one arm." },
      { name: "Meningeal irritation (rare, urgent)", detail: "Neck stiffness with high fever and headache needs urgent assessment." },
    ],
    selfCare: ["Gentle movement rather than a stiff collar for ordinary strain", "Warm compress for tight muscles", "Correct pillow height and screen level"],
    seeDoctor: ["Pain lasting beyond 1–2 weeks", "Tingling, numbness, or weakness in an arm or hand", "Neck pain after an accident or fall"],
    emergency: ["Neck stiffness with high fever and headache or rash", "Neck pain with weakness, numbness, or bladder/bowel changes"],
    specialists: ["General Physician", "Orthopedic", "Neurologist (if nerve symptoms)"],
    tests: ["Physical examination and movement testing", "X-ray or MRI only when examination suggests structural disease"],
    treatments: ["Physiotherapy, posture correction, and supervised exercise plans; medicines only as a doctor prescribes"],
    surgery: "Rarely needed — only for confirmed severe nerve or spinal-cord compression after scans and specialist review. Purpose, risks, and recovery are explained by the operating team beforehand.",
    related: ["head", "back-upper", "arm"],
    refs: HUBS,
  },
  {
    id: "chest",
    name: "Chest",
    symptoms: ["Chest pain or pressure", "Difficulty breathing or wheezing", "Palpitations", "Cough", "Heartburn", "Chest tightness", "Pain spreading to arm, neck, or jaw"],
    redFlags: ["Chest pain or pressure", "Difficulty breathing or wheezing", "Pain spreading to arm, neck, or jaw"],
    causes: [
      { name: "Acid reflux", detail: "Burning rising behind the breastbone after meals, often worse lying down." },
      { name: "Muscle or rib strain", detail: "Sharp pain on movement, coughing, or pressing the area after exertion or injury." },
      { name: "Asthma or airway narrowing", detail: "Wheezing, tightness, and breathlessness, often with triggers like dust or smoke." },
      { name: "Heart-related causes", detail: "Pressure-like pain, possibly spreading, with sweating or nausea — always treated as urgent until checked." },
    ],
    selfCare: ["Stop exertion and rest if any chest discomfort appears", "Note what triggers it: meals, movement, cold air, or exertion", "Do not drive yourself anywhere while symptoms persist"],
    seeDoctor: ["Any new, recurrent, or unexplained chest discomfort", "Wheezing or cough lasting weeks", "Palpitations with dizziness or fainting"],
    emergency: ["Crushing or pressure-like chest pain, especially with sweating, nausea, or breathlessness", "Severe breathing difficulty, inability to speak full sentences, or blue lips", "Pain spreading to the arm, neck, or jaw"],
    specialists: ["General Physician", "Cardiologist", "Pulmonologist (if breathing-related)"],
    tests: ["ECG, blood pressure, and oxygen check", "Troponin blood test and chest X-ray when a heart or lung cause is suspected"],
    treatments: ["Doctors treat the confirmed cause: reflux care, inhaler plans, or cardiac care — chest symptoms are never self-triaged by chatbot"],
    surgery: "Considered only for confirmed structural disease (for example, blocked heart arteries or valve problems). The cardiology team explains the purpose, risks, and recovery for each specific procedure.",
    femaleNote: "Breast awareness: know how your breasts normally look and feel, and get any new lump, nipple discharge, skin dimpling, or persistent pain assessed promptly — most lumps are benign, but all deserve a clinician's look. Breast tenderness that follows the monthly cycle is common.",
    related: ["neck", "abdomen", "arm"],
    refs: HUBS,
  },
  {
    id: "abdomen",
    name: "Abdomen",
    symptoms: ["Pain or cramps", "Bloating or gas", "Nausea or vomiting", "Diarrhoea", "Constipation", "Blood in stool or vomit", "Fever with pain"],
    redFlags: ["Blood in stool or vomit", "Fever with pain"],
    causes: [
      { name: "Indigestion and gas", detail: "Eating fast, spicy or oily food, and stress commonly cause temporary discomfort." },
      { name: "Gut infection", detail: "Contaminated food or water causes cramps with diarrhoea or vomiting for a few days." },
      { name: "Acid or ulcer disease", detail: "Gnawing upper-abdominal pain, worse on an empty stomach." },
      { name: "Gallbladder or appendicitis (urgent patterns)", detail: "Right-upper pain after fatty food, or pain moving to the lower-right with fever, need prompt review." },
    ],
    selfCare: ["Small, light meals and clean water; oral rehydration for loose motions", "Avoid alcohol, very spicy food, and self-started antibiotics", "Track pain location, timing, and relation to meals for the doctor"],
    seeDoctor: ["Pain lasting beyond 2–3 days", "Unexplained weight loss", "Repeated vomiting or persistent bloating", "Any blood in stool or vomit"],
    emergency: ["Severe sudden abdominal pain, especially with vomiting, fever, or a rigid belly", "Vomiting blood or black tarry stools with weakness", "Signs of dehydration: very little urine, dizziness, confusion"],
    specialists: ["General Physician", "Gastroenterologist", "General Surgeon (if surgical abdomen suspected)"],
    tests: ["Abdominal examination", "Urine and stool tests; ultrasound when gallbladder, appendix, or organ disease is suspected"],
    treatments: ["Doctors treat the cause: hydration plans, acid care, infection treatment, or surgical referral when indicated"],
    surgery: "Needed for confirmed emergencies (for example, appendicitis) or gallstone disease. Surgeons explain the operation's purpose, risks, and recovery before consent.",
    related: ["chest", "pelvis", "back-lower"],
    refs: HUBS,
  },
  {
    id: "pelvis",
    name: "Pelvis",
    symptoms: ["Lower abdominal pain", "Pain during urination", "Frequent urination", "Irregular bleeding", "Pelvic heaviness", "Severe sudden pelvic pain"],
    redFlags: ["Severe sudden pelvic pain"],
    causes: [
      { name: "Urinary infection", detail: "Burning urination with frequent urge, more common in women." },
      { name: "Menstrual or ovulation pain", detail: "Cyclical lower-abdominal cramps linked to the monthly cycle." },
      { name: "Muscle or joint strain", detail: "Groin or pelvic-floor strain after exertion or childbirth." },
      { name: "Conditions needing assessment", detail: "Persistent heaviness, irregular bleeding, or severe sudden pain need examination, not waiting." },
    ],
    selfCare: ["Drink water and do not hold urine for long hours", "Track cycles and pain timing on a calendar", "Warm compress may ease menstrual cramps"],
    seeDoctor: ["Burning urination with fever or back pain", "Irregular bleeding or bleeding after menopause", "Pelvic pain lasting weeks"],
    emergency: ["Severe sudden pelvic pain, especially with fainting, vomiting, or heavy bleeding", "Inability to urinate with lower-abdominal pain"],
    specialists: ["General Physician", "Gynecologist", "Urologist"],
    tests: ["Urine test", "Ultrasound of the pelvis when infection, stones, or structural causes are suspected"],
    treatments: ["Doctors treat the confirmed cause: infection care, hormonal review, pelvic-floor therapy, or referral as needed"],
    surgery: null,
    femaleNote: "Menstrual health: cycles of 21–35 days are typical — seek care for soaking through protection hourly, severe pain disrupting daily life, or bleeding between periods. In pregnancy, seek prompt care for vaginal bleeding, severe headache or vision changes, sudden face/hand swelling, high fever, or reduced baby movements.",
    related: ["abdomen", "back-lower", "leg"],
    refs: HUBS,
  },
  {
    id: "back-upper",
    name: "Upper Back",
    symptoms: ["Aching between shoulders", "Stiffness", "Pain on deep breath", "Posture-related pain", "Tingling in arms"],
    redFlags: [],
    causes: [
      { name: "Postural strain", detail: "Desk work, phones, and heavy bags overload upper-back muscles." },
      { name: "Muscle spasm", detail: "Sudden awkward movement or overexertion knots the muscles." },
      { name: "Referred pain", detail: "Gallbladder or lung irritation can ache between the shoulder blades." },
    ],
    selfCare: ["Gentle posture breaks every hour; strengthen upper-back muscles gradually", "Warm compress for stiff muscles", "Correct bag weight and screen height"],
    seeDoctor: ["Pain lasting beyond 2–3 weeks", "Tingling or weakness in the arms", "Pain with fever, weight loss, or breathing trouble"],
    emergency: ["Back pain with numbness, weakness, or bladder/bowel changes", "Severe back pain after a fall or accident", "Back pain with chest pain or breathlessness"],
    specialists: ["General Physician", "Orthopedic", "Physiotherapist"],
    tests: ["Posture and movement examination", "X-ray or MRI only when nerve signs or trauma suggest it"],
    treatments: ["Physiotherapy, graded exercise, and ergonomic correction form the usual plan"],
    surgery: "Rarely needed for the upper back — only for confirmed structural disease after scans and specialist review.",
    related: ["neck", "chest", "back-lower", "arm"],
    refs: HUBS,
  },
  {
    id: "back-lower",
    name: "Lower Back",
    symptoms: ["Dull aching", "Sharp pain on bending", "Stiffness in the morning", "Pain going down a leg", "Numbness or weakness in a leg", "Bladder or bowel changes"],
    redFlags: ["Bladder or bowel changes", "Numbness or weakness in a leg"],
    causes: [
      { name: "Muscle or ligament strain", detail: "Wrong lifting, sudden twisting, or weak core muscles — the commonest cause." },
      { name: "Disc irritation (sciatica)", detail: "Leg pain or numbness travelling below the knee suggests nerve involvement." },
      { name: "Age-related joint wear", detail: "Stiffness that eases with gentle movement in older adults." },
      { name: "Kidney or other referred pain", detail: "One-sided pain with fever or burning urination points away from the spine." },
    ],
    selfCare: ["Stay gently active — short walks beat complete bed rest", "Warm compress for stiffness; brief cold pack for a fresh strain", "Lift with bent knees and keep a healthy weight"],
    seeDoctor: ["Pain beyond 2–3 weeks despite self-care", "Pain travelling below the knee with numbness", "Back pain with fever or unexplained weight loss"],
    emergency: ["Loss of bladder/bowel control or numbness around the groin", "Leg weakness that is worsening", "Back pain after major trauma, or with fever in an unwell person"],
    specialists: ["General Physician", "Orthopedic", "Neurologist (if nerve signs)", "Nephrologist (if kidney-type pain)"],
    tests: ["Movement and nerve examination", "MRI only when nerve damage, infection, or fracture is suspected"],
    treatments: ["Most cases improve with activity, physiotherapy, and posture work; injections or surgery are only for selected confirmed cases"],
    surgery: "Considered only for confirmed disc or spinal disease with matching scan findings and failed conservative care. Purpose, risks, and recovery are explained before any decision.",
    related: ["pelvis", "leg", "knee", "back-upper"],
    refs: HUBS,
  },
  {
    id: "arm",
    name: "Arm",
    symptoms: ["Pain", "Swelling", "Numbness or tingling", "Weakness", "Stiffness", "Sudden one-sided weakness", "Pain after injury"],
    redFlags: ["Sudden one-sided weakness"],
    causes: [
      { name: "Muscle or tendon overuse", detail: "Tennis elbow, shoulder strain, or heavy lifting pain that worsens with use." },
      { name: "Neck nerve referral", detail: "Tingling running from the neck into one arm." },
      { name: "Frozen shoulder or joint inflammation", detail: "Stiffness that limits lifting the arm, worse at night." },
      { name: "Fracture or dislocation", detail: "Deformity, severe swelling, or inability to move after a fall." },
    ],
    selfCare: ["Rest the painful movement but keep gentle mobility", "Cold pack for fresh injury; warmth for stiff joints", "Sling only briefly and as advised — prolonged stillness stiffens joints"],
    seeDoctor: ["Numbness, tingling, or weakness", "Swelling that does not settle in days", "Night pain disturbing sleep for weeks"],
    emergency: ["Sudden one-sided arm weakness with speech or face changes (possible stroke)", "Deformed or cold/pale limb after injury", "Rapidly spreading redness with fever"],
    specialists: ["General Physician", "Orthopedic", "Neurologist (if nerve signs)"],
    tests: ["Movement, strength, and reflex testing", "X-ray after trauma; MRI or nerve studies when indicated"],
    treatments: ["Physiotherapy, activity correction, and splints or braces where suitable; medicines only as prescribed"],
    surgery: "Needed for some fractures, tendon tears, or nerve compression confirmed by examination and scans — never decided from chat alone.",
    related: ["neck", "chest", "hand", "back-upper"],
    refs: HUBS,
  },
  {
    id: "hand",
    name: "Hand",
    symptoms: ["Pain", "Stiffness", "Swelling", "Numbness or tingling in fingers", "Weak grip", "Night-time numbness"],
    redFlags: [],
    causes: [
      { name: "Overuse strain", detail: "Typing, tools, or phone grip overload small hand tendons." },
      { name: "Carpal tunnel pressure", detail: "Night-time thumb-side numbness from a squeezed wrist nerve." },
      { name: "Arthritis", detail: "Morning stiffness in finger joints, sometimes with swelling." },
      { name: "Injury or infection", detail: "Bites, cuts, or crush injuries swell fast in the hand and need early review." },
    ],
    selfCare: ["Frequent short breaks and neutral wrist posture", "Night wrist rest in a neutral position if tingling wakes you", "Warm water soaks for stiff arthritic joints"],
    seeDoctor: ["Persistent numbness or weakening grip", "Swelling after a bite, cut, or crush injury", "Joint deformity or long morning stiffness"],
    emergency: ["Hand injury with heavy bleeding, deformity, or a cold/pale finger", "Rapidly spreading redness, severe pain, or fever after a wound"],
    specialists: ["General Physician", "Orthopedic", "Neurologist (if nerve signs)"],
    tests: ["Grip, sensation, and movement testing", "X-ray after injury; nerve-conduction study for suspected carpal tunnel"],
    treatments: ["Splints, activity changes, physiotherapy, and targeted injections or release surgery only for confirmed cases"],
    surgery: "Carpal tunnel release or fracture fixation is considered only after confirmed diagnosis and failed conservative care.",
    related: ["arm", "neck"],
    refs: HUBS,
  },
  {
    id: "leg",
    name: "Leg",
    symptoms: ["Pain", "Swelling", "Numbness", "Weakness", "Stiffness", "Difficulty walking", "Cramps", "Cold, pale, or colour change"],
    redFlags: ["Cold, pale, or colour change"],
    causes: [
      { name: "Muscle strain or cramps", detail: "Overexertion, dehydration, or new exercise causing aching or sudden cramps." },
      { name: "Vein problems", detail: "One-sided swelling, warmth, or visible veins — a sudden one-sided swollen painful leg needs prompt review." },
      { name: "Nerve referral from the back", detail: "Pain or numbness travelling from the buttock down the leg." },
      { name: "Artery or joint disease", detail: "Calf pain on walking that eases with rest, or age-related knee/hip wear." },
    ],
    selfCare: ["Rest, gentle stretching, and fluids for cramps", "Avoid long sitting; move legs on journeys", "Compare both legs — one-sided swelling or colour change needs prompt review, not waiting"],
    seeDoctor: ["One-sided swelling, redness, or warmth", "Numbness or weakness", "Leg pain that limits walking for weeks"],
    emergency: ["Sudden severe leg pain with a cold, pale, or numb limb", "One-sided hugely swollen painful leg, especially with breathlessness or chest pain", "New inability to move or bear weight after injury"],
    specialists: ["General Physician", "Orthopedic", "Vascular Surgeon (if circulation suspected)", "Neurologist (if nerve signs)"],
    tests: ["Circulation and nerve examination of both legs", "Doppler ultrasound when clot or artery disease is suspected"],
    treatments: ["Doctors treat the cause: physiotherapy, compression and movement for veins, or circulation care — compared-leg examination decides"],
    surgery: "Vein procedures or arterial operations are considered only after Doppler-confirmed disease and specialist review.",
    related: ["knee", "foot", "back-lower", "pelvis"],
    refs: HUBS,
  },
  {
    id: "knee",
    name: "Knee",
    symptoms: ["Pain", "Swelling", "Stiffness", "Clicking or locking", "Giving way", "Cannot bear weight", "Deformity after injury"],
    redFlags: ["Cannot bear weight", "Deformity after injury"],
    causes: [
      { name: "Overuse irritation", detail: "Stairs, squats, or new running load the kneecap painfully." },
      { name: "Ligament or cartilage injury", detail: "Twist with a pop, rapid swelling, or the knee giving way." },
      { name: "Arthritis", detail: "Age-related wear or inflammatory swelling with morning stiffness." },
      { name: "Bursitis or tendon pain", detail: "Localised swelling or tenderness from kneeling or jumping sports." },
    ],
    selfCare: ["Relative rest, ice wrapped in cloth, light compression, elevation after a fresh injury", "Strengthen thigh muscles gradually once pain allows", "Maintain healthy weight to unload the joint"],
    seeDoctor: ["Locking, catching, or giving way", "Swelling lasting beyond a few days", "Pain limiting daily walking or stairs for weeks"],
    emergency: ["Deformed knee, inability to bear weight, or a cold/pale foot after injury", "Hot, very painful swollen knee with fever"],
    specialists: ["General Physician", "Orthopedic", "Physiotherapist"],
    tests: ["Stability, movement, and swelling examination", "X-ray for bony injury or arthritis; MRI for suspected ligament/cartilage tears"],
    treatments: ["Physiotherapy and bracing manage most cases; injections or keyhole surgery only for confirmed structural problems"],
    surgery: "Ligament repair or joint replacement is considered only after examination, scans, and failed conservative care — purpose, risks, and rehab explained beforehand.",
    related: ["leg", "foot", "back-lower"],
    refs: HUBS,
  },
  {
    id: "foot",
    name: "Foot",
    symptoms: ["Pain", "Swelling", "Numbness or burning", "Stiffness", "Skin sores or colour change", "Non-healing sore (diabetes)", "Ankle sprain pain"],
    redFlags: ["Non-healing sore (diabetes)"],
    causes: [
      { name: "Sprain or strain", detail: "Twisted ankle with swelling and pain on stepping." },
      { name: "Plantar fascia pain", detail: "Sharp heel pain on first morning steps." },
      { name: "Nerve or circulation change", detail: "Burning numbness (diabetes, B12) or cold pale feet (circulation)." },
      { name: "Footwear and gout", detail: "Tight shoes, high heels, or sudden big-toe joint pain and redness." },
    ],
    selfCare: ["Rest, ice, compression, elevation for fresh sprains", "Supportive footwear; avoid barefoot walking with diabetes", "Check feet daily if diabetic — never ignore a blister or cut"],
    seeDoctor: ["Numbness, burning, or colour changes", "Foot sores that do not heal", "Repeated ankle giving way"],
    emergency: ["Foot injury with deformity or inability to bear weight", "Diabetic foot with spreading redness, pus, or fever", "Sudden cold, pale, painful foot"],
    specialists: ["General Physician", "Orthopedic", "Endocrinologist/Diabetologist (for diabetic feet)", "Dermatologist (for skin sores)"],
    tests: ["Foot, pulse, and sensation examination", "X-ray after injury; blood sugar and B12 when nerve causes are suspected"],
    treatments: ["Bracing, footwear correction, physiotherapy, and diabetes or circulation care as confirmed"],
    surgery: "Bunion, fracture, or deformity correction is considered only after examination, scans, and failed conservative care.",
    related: ["leg", "knee"],
    refs: HUBS,
  },
];

/** Internal organs selectable as an overlay; each maps to a body region. */
export interface OrganOption {
  id: string;
  name: string;
  regionId: string;
  view: "front" | "back";
}

export const ORGANS: OrganOption[] = [
  { id: "brain", name: "Brain", regionId: "head", view: "front" },
  { id: "heart", name: "Heart", regionId: "chest", view: "front" },
  { id: "lungs", name: "Lungs", regionId: "chest", view: "front" },
  { id: "liver", name: "Liver", regionId: "abdomen", view: "front" },
  { id: "stomach", name: "Stomach", regionId: "abdomen", view: "front" },
  { id: "kidneys", name: "Kidneys", regionId: "back-lower", view: "back" },
  { id: "reproductive", name: "Reproductive", regionId: "pelvis", view: "front" },
];

export function getRegion(id: string): BodyRegion | undefined {
  return BODY_REGIONS.find((r) => r.id === id);
}
