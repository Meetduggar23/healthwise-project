/**
 * Original medical illustrations for library categories (no external images,
 * no licensing risk, never a broken link). One motif per category group.
 */

const MOTIFS: Record<string, React.ReactNode> = {
  heart: (
    <>
      <path d="M32 52 C22 40 14 34 14 25 C14 18 19 14 24 14 C28 14 31 17 32 20 C33 17 36 14 40 14 C45 14 50 18 50 25 C50 34 42 40 32 52 Z" fill="#d32f2f" />
      <path d="M10 12 H22 M12 8 V16 M42 48 H54 M44 44 V52" stroke="#d32f2f" strokeWidth="3" strokeLinecap="round" />
    </>
  ),
  brain: (
    <>
      <circle cx="32" cy="30" r="16" fill="none" stroke="#d32f2f" strokeWidth="3" />
      <path d="M32 14 C26 20 26 26 32 30 C38 34 38 40 32 46 M32 14 C38 20 38 26 32 30" fill="none" stroke="#d32f2f" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M32 46 V54 M26 54 H38" stroke="#8a97a5" strokeWidth="3" strokeLinecap="round" />
    </>
  ),
  lungs: (
    <>
      <path d="M26 14 C20 24 18 36 20 50 L28 50 C30 38 30 26 29 14 Z" fill="#d32f2f" />
      <path d="M38 14 C44 24 46 36 44 50 L36 50 C34 38 34 26 35 14 Z" fill="#d32f2f" />
      <path d="M32 8 V14" stroke="#8a97a5" strokeWidth="3" strokeLinecap="round" />
    </>
  ),
  stomach: (
    <>
      <ellipse cx="32" cy="32" rx="20" ry="22" fill="none" stroke="#d32f2f" strokeWidth="3" />
      <path d="M32 14 C30 24 30 30 26 34 C22 38 22 44 28 46 C32 47 36 45 36 41" fill="none" stroke="#d32f2f" strokeWidth="2.6" strokeLinecap="round" />
    </>
  ),
  kidney: (
    <>
      <path d="M24 16 C18 24 18 40 24 48 C28 52 34 50 34 44 C34 38 30 36 28 32 C26 28 26 22 28 18 Z" fill="#d32f2f" />
      <path d="M40 16 C46 24 46 40 40 48 C36 52 30 50 30 44 C30 38 34 36 36 32 C38 28 38 22 36 18 Z" fill="#d32f2f" opacity="0.65" />
    </>
  ),
  bone: (
    <>
      <path d="M22 44 L42 20" stroke="#d32f2f" strokeWidth="7" strokeLinecap="round" />
      <circle cx="20" cy="46" r="6" fill="#d32f2f" />
      <circle cx="26" cy="50" r="6" fill="#d32f2f" />
      <circle cx="38" cy="14" r="6" fill="#d32f2f" />
      <circle cx="44" cy="18" r="6" fill="#d32f2f" />
    </>
  ),
  skin: (
    <>
      <path d="M20 12 H44 V40 C44 50 38 54 32 54 C26 54 20 50 20 40 Z" fill="none" stroke="#d32f2f" strokeWidth="3" />
      <circle cx="27" cy="24" r="1.8" fill="#d32f2f" />
      <circle cx="35" cy="30" r="1.8" fill="#d32f2f" />
      <circle cx="29" cy="38" r="1.8" fill="#d32f2f" />
    </>
  ),
  eye: (
    <>
      <path d="M8 32 C16 20 24 16 32 16 C40 16 48 20 56 32 C48 44 40 48 32 48 C24 48 16 44 8 32 Z" fill="none" stroke="#d32f2f" strokeWidth="3" />
      <circle cx="32" cy="32" r="8" fill="#d32f2f" />
      <circle cx="35" cy="29" r="2.4" fill="#fff" />
    </>
  ),
  ear: (
    <>
      <path d="M26 12 C34 12 40 20 40 32 C40 44 34 52 26 52" fill="none" stroke="#d32f2f" strokeWidth="3" strokeLinecap="round" />
      <path d="M30 22 C34 24 36 30 34 38" fill="none" stroke="#d32f2f" strokeWidth="2.4" strokeLinecap="round" />
    </>
  ),
  baby: (
    <>
      <circle cx="32" cy="20" r="9" fill="none" stroke="#d32f2f" strokeWidth="3" />
      <path d="M22 34 C22 44 26 52 32 52 C38 52 42 44 42 34 Z" fill="none" stroke="#d32f2f" strokeWidth="3" />
    </>
  ),
  woman: (
    <>
      <circle cx="32" cy="16" r="7" fill="none" stroke="#d32f2f" strokeWidth="3" />
      <path d="M32 25 V44 M22 32 L32 28 L42 32 M26 52 L30 44 M38 52 L34 44" fill="none" stroke="#d32f2f" strokeWidth="3" strokeLinecap="round" />
    </>
  ),
  man: (
    <>
      <circle cx="32" cy="14" r="7" fill="none" stroke="#d32f2f" strokeWidth="3" />
      <path d="M20 26 H44 M32 23 V44 M32 44 L25 54 M32 44 L39 54" fill="none" stroke="#d32f2f" strokeWidth="3" strokeLinecap="round" />
    </>
  ),
  senior: (
    <>
      <circle cx="32" cy="16" r="7" fill="none" stroke="#8a97a5" strokeWidth="3" />
      <path d="M32 25 V42 M20 52 L24 34 M20 52 H28" fill="none" stroke="#8a97a5" strokeWidth="3" strokeLinecap="round" />
      <path d="M44 30 V54" stroke="#d32f2f" strokeWidth="3" strokeLinecap="round" />
    </>
  ),
  mind: (
    <>
      <circle cx="32" cy="28" r="16" fill="none" stroke="#d32f2f" strokeWidth="3" />
      <path d="M26 26 H30 M28 32 H38 M32 38 H36" stroke="#d32f2f" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M48 44 L54 50 M54 44 L48 50" stroke="#8a97a5" strokeWidth="3" strokeLinecap="round" />
    </>
  ),
  shield: (
    <>
      <path d="M32 8 L48 15 V30 C48 42 41 49 32 54 C23 49 16 42 16 30 V15 Z" fill="none" stroke="#d32f2f" strokeWidth="3" />
      <path d="M25 30 L30 35 L40 24" fill="none" stroke="#d32f2f" strokeWidth="3" strokeLinecap="round" />
    </>
  ),
  pill: (
    <>
      <rect x="14" y="24" width="36" height="16" rx="8" transform="rotate(-30 32 32)" fill="none" stroke="#d32f2f" strokeWidth="3" />
      <line x1="26" y1="38" x2="38" y2="26" stroke="#d32f2f" strokeWidth="3" />
      <circle cx="48" cy="44" r="6" fill="none" stroke="#8a97a5" strokeWidth="3" />
    </>
  ),
  aid: (
    <>
      <rect x="14" y="20" width="36" height="28" rx="6" fill="none" stroke="#d32f2f" strokeWidth="3" />
      <path d="M32 27 V41 M25 34 H39" stroke="#d32f2f" strokeWidth="3.4" strokeLinecap="round" />
      <path d="M24 20 V14 H40 V20" fill="none" stroke="#8a97a5" strokeWidth="3" />
    </>
  ),
  test: (
    <>
      <path d="M24 8 H40 M27 8 V38 L22 50 H42 L37 38 V8" fill="none" stroke="#d32f2f" strokeWidth="3" strokeLinecap="round" />
      <path d="M25 44 H39" stroke="#8a97a5" strokeWidth="3" strokeLinecap="round" />
    </>
  ),
  scan: (
    <>
      <rect x="14" y="14" width="36" height="36" rx="8" fill="none" stroke="#d32f2f" strokeWidth="3" />
      <circle cx="32" cy="32" r="8" fill="none" stroke="#d32f2f" strokeWidth="2.6" />
      <path d="M38 38 L46 46" stroke="#d32f2f" strokeWidth="3" strokeLinecap="round" />
    </>
  ),
  surgery: (
    <>
      <path d="M18 46 L40 24 M40 24 L46 18 M14 42 L18 46" stroke="#8a97a5" strokeWidth="3" strokeLinecap="round" />
      <circle cx="42" cy="40" r="9" fill="none" stroke="#d32f2f" strokeWidth="3" />
      <path d="M42 36 V44 M38 40 H46" stroke="#d32f2f" strokeWidth="2.6" strokeLinecap="round" />
    </>
  ),
  ribbon: (
    <>
      <path d="M32 8 C38 16 40 24 36 32 L44 54 L32 46 L20 54 L28 32 C24 24 26 16 32 8 Z" fill="none" stroke="#d32f2f" strokeWidth="3" strokeLinejoin="round" />
    </>
  ),
  vaccine: (
    <>
      <path d="M36 10 L46 20 M30 18 L40 28 L26 42 L22 46 L18 42 L22 38 Z" fill="none" stroke="#d32f2f" strokeWidth="3" strokeLinejoin="round" />
      <path d="M14 46 L18 50" stroke="#8a97a5" strokeWidth="3" strokeLinecap="round" />
    </>
  ),
  leaf: (
    <>
      <path d="M14 50 C14 30 28 16 50 14 C48 36 34 50 14 50 Z" fill="none" stroke="#1e8e5a" strokeWidth="3" />
      <path d="M20 44 C28 34 36 26 44 20" fill="none" stroke="#1e8e5a" strokeWidth="2.4" strokeLinecap="round" />
    </>
  ),
  drop: (
    <>
      <path d="M32 8 C24 22 18 30 18 38 C18 46 24 52 32 52 C40 52 46 46 46 38 C46 30 40 22 32 8 Z" fill="none" stroke="#d32f2f" strokeWidth="3" />
    </>
  ),
  general: (
    <>
      <path d="M32 8 V22 M32 42 V56 M8 32 H22 M42 32 H56" stroke="#d32f2f" strokeWidth="4" strokeLinecap="round" />
      <circle cx="32" cy="32" r="7" fill="none" stroke="#8a97a5" strokeWidth="3" />
    </>
  ),
};

const CATEGORY_MOTIF: Record<string, string> = {
  "General Health and Preventive Care": "general",
  "Symptoms and Warning Signs": "scan",
  "Digestive System": "stomach",
  "Heart and Circulatory System": "heart",
  "Brain and Nervous System": "brain",
  "Respiratory System": "lungs",
  "Kidney and Urinary System": "kidney",
  "Liver and Pancreas": "stomach",
  "Hormonal and Endocrine Health": "drop",
  "Blood Disorders": "drop",
  "Bones, Muscles and Joints": "bone",
  "Skin, Hair and Nails": "skin",
  "Eyes and Vision": "eye",
  "Ear, Nose and Throat": "ear",
  "Women's Health": "woman",
  "Men's Health": "man",
  "Pregnancy and Maternal Health": "baby",
  "Child and Adolescent Health": "baby",
  "Older Adult Health": "senior",
  "Mental Health": "mind",
  "Infectious Diseases": "shield",
  "Common Indian and Seasonal Illnesses": "shield",
  "Allergies and Immune System": "shield",
  "Nutrition and Vitamin Deficiencies": "leaf",
  "Medicines and Medication Safety": "pill",
  "First Aid and Emergency Care": "aid",
  "Medical Tests and Diagnostics": "test",
  "Imaging and Scans": "scan",
  "Surgery and Recovery": "surgery",
  "Cancer Awareness": "ribbon",
  "Vaccination and Immunization": "vaccine",
  "Sexual and Reproductive Health": "woman",
};

export function CategoryArt({ category, label }: { category: string; label: string }) {
  const motif = MOTIFS[CATEGORY_MOTIF[category] ?? "general"];
  return (
    <svg viewBox="0 0 64 64" role="img" aria-label={label} style={{ width: "100%", height: "100%", display: "block" }}>
      <rect width="64" height="64" fill="#fdeeee" />
      <circle cx="52" cy="10" r="16" fill="#fff" opacity="0.55" />
      <g transform="translate(0,2)">{motif}</g>
    </svg>
  );
}
