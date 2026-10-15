import { useState } from "react";

/** Dosage-form illustration used when a photo is unavailable or fails to load. */
export function FormArt({ form, label }: { form: string; label: string }) {
  const f = form.toLowerCase();
  const isInhaler = f.includes("inhal");
  const isSyrup = f.includes("syrup") || f.includes("suspension") || f.includes("solution");
  const isCream = f.includes("cream") || f.includes("lotion") || f.includes("ointment");
  const isSachet = f.includes("sachet") || f.includes("powder");
  const isCapsule = f.includes("capsule");
  return (
    <svg viewBox="0 0 400 250" role="img" aria-label={label} style={{ width: "100%", height: "100%", display: "block" }}>
      <rect width="400" height="250" fill="#fdeeee" />
      <circle cx="330" cy="45" r="70" fill="#fff" opacity="0.6" />
      <circle cx="60" cy="215" r="50" fill="#fff" opacity="0.5" />
      {isInhaler ? (
        <g fill="#d32f2f">
          <rect x="150" y="90" width="60" height="100" rx="10" />
          <rect x="165" y="55" width="30" height="45" rx="6" />
          <rect x="150" y="170" width="100" height="22" rx="8" opacity="0.55" />
        </g>
      ) : isSyrup ? (
        <g>
          <rect x="175" y="70" width="50" height="120" rx="10" fill="#d32f2f" />
          <rect x="188" y="45" width="24" height="30" rx="4" fill="#b71c1c" />
          <rect x="175" y="120" width="50" height="70" rx="10" fill="#fff" opacity="0.45" />
        </g>
      ) : isCream ? (
        <g>
          <rect x="160" y="95" width="80" height="95" rx="12" fill="#d32f2f" />
          <rect x="178" y="70" width="44" height="30" rx="6" fill="#b71c1c" />
          <rect x="160" y="150" width="80" height="40" rx="12" fill="#fff" opacity="0.4" />
        </g>
      ) : isSachet ? (
        <g>
          <rect x="150" y="80" width="100" height="110" rx="8" fill="#d32f2f" />
          <rect x="150" y="80" width="100" height="18" rx="8" fill="#b71c1c" />
          <rect x="170" y="120" width="60" height="10" rx="5" fill="#fff" opacity="0.8" />
          <rect x="170" y="140" width="40" height="10" rx="5" fill="#fff" opacity="0.6" />
        </g>
      ) : isCapsule ? (
        <g>
          <rect x="120" y="105" width="90" height="36" rx="18" fill="#d32f2f" />
          <rect x="120" y="105" width="45" height="36" rx="18" fill="#fff" opacity="0.85" />
          <rect x="215" y="150" width="90" height="36" rx="18" fill="#b71c1c" />
          <rect x="215" y="150" width="45" height="36" rx="18" fill="#fff" opacity="0.85" />
        </g>
      ) : (
        <g>
          <ellipse cx="160" cy="110" rx="46" ry="26" fill="#d32f2f" />
          <ellipse cx="160" cy="110" rx="46" ry="26" fill="none" stroke="#b71c1c" strokeWidth="3" />
          <line x1="160" y1="84" x2="160" y2="136" stroke="#fff" strokeWidth="4" />
          <ellipse cx="250" cy="150" rx="46" ry="26" fill="#b71c1c" />
          <line x1="250" y1="124" x2="250" y2="176" stroke="#fff" strokeWidth="4" />
        </g>
      )}
    </svg>
  );
}

interface MedicineImageProps {
  url: string | null;
  alt: string;
  form: string;
}

/** Photo with graceful fallback to a dosage-form illustration (never broken). */
export function MedicineImage({ url, alt, form }: MedicineImageProps) {
  const [failed, setFailed] = useState(false);
  if (!url || failed) {
    return <FormArt form={form} label={alt} />;
  }
  return (
    <img
      src={url}
      alt={alt}
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
    />
  );
}
