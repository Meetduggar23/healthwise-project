import { useState } from "react";
import { CATEGORY_IMAGES } from "../lib/medicalLibrary";
import { CategoryArt } from "./CategoryArt";

interface TopicImageProps {
  category: string;
  label: string;
  showCredit?: boolean;
}

/**
 * Verified Commons photo when one exists for the category, otherwise the
 * original SVG illustration. Any failed load falls back to the illustration,
 * so a broken image is never shown.
 */
export function TopicImage({ category, label, showCredit }: TopicImageProps) {
  const [failed, setFailed] = useState(false);
  const img = CATEGORY_IMAGES[category];
  if (!img || failed) {
    return (
      <div style={{ height: "100%" }}>
        <CategoryArt category={category} label={label} />
        {showCredit && (
          <p className="muted" style={{ fontSize: "0.78rem", marginTop: 6 }}>
            Original HealthWise illustration (no external image used for this category).
          </p>
        )}
      </div>
    );
  }
  return (
    <div style={{ height: "100%" }}>
      <img
        src={img.url}
        alt={img.alt}
        loading="lazy"
        referrerPolicy="no-referrer"
        onError={() => setFailed(true)}
        style={{ width: "100%", height: showCredit ? "auto" : "100%", maxHeight: showCredit ? 320 : undefined, objectFit: "cover", display: "block" }}
      />
      {showCredit && (
        <p className="muted" style={{ fontSize: "0.78rem", marginTop: 6 }}>
          {img.alt}.{" "}
          <a href={img.page} target="_blank" rel="noopener noreferrer">
            Image source: {img.credit}
          </a>
        </p>
      )}
    </div>
  );
}
