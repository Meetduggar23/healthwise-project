import { useMemo, useState } from "react";
import { BODY_REGIONS, ORGANS } from "../data/bodyRegions";

export type BodyView = "front" | "back";
export type BodySex = "male" | "female";

export interface SelectedShape {
  shapeId: string;
  regionId: string;
  label: string;
  organName?: string;
}

export interface BodyShapeMeta {
  shapeId: string;
  regionId: string;
  view: BodyView;
  label: string;
}

/** Every selectable shape — single source of truth (tests import this). */
export const BODY_SHAPES: BodyShapeMeta[] = [
  { shapeId: "head", regionId: "head", view: "front", label: "Head" },
  { shapeId: "head-back", regionId: "head", view: "back", label: "Head (back)" },
  { shapeId: "neck", regionId: "neck", view: "front", label: "Neck" },
  { shapeId: "neck-back", regionId: "neck", view: "back", label: "Neck (back)" },
  { shapeId: "chest", regionId: "chest", view: "front", label: "Chest" },
  { shapeId: "abdomen", regionId: "abdomen", view: "front", label: "Abdomen" },
  { shapeId: "pelvis", regionId: "pelvis", view: "front", label: "Pelvis" },
  { shapeId: "pelvis-back", regionId: "pelvis", view: "back", label: "Pelvis (back)" },
  { shapeId: "back-upper", regionId: "back-upper", view: "back", label: "Upper Back" },
  { shapeId: "back-lower", regionId: "back-lower", view: "back", label: "Lower Back" },
  { shapeId: "arm-left", regionId: "arm", view: "front", label: "Left Arm" },
  { shapeId: "arm-right", regionId: "arm", view: "front", label: "Right Arm" },
  { shapeId: "arm-left-back", regionId: "arm", view: "back", label: "Left Arm (back)" },
  { shapeId: "arm-right-back", regionId: "arm", view: "back", label: "Right Arm (back)" },
  { shapeId: "hand-left", regionId: "hand", view: "front", label: "Left Hand" },
  { shapeId: "hand-right", regionId: "hand", view: "front", label: "Right Hand" },
  { shapeId: "hand-left-back", regionId: "hand", view: "back", label: "Left Hand (back)" },
  { shapeId: "hand-right-back", regionId: "hand", view: "back", label: "Right Hand (back)" },
  { shapeId: "leg-left", regionId: "leg", view: "front", label: "Left Leg" },
  { shapeId: "leg-right", regionId: "leg", view: "front", label: "Right Leg" },
  { shapeId: "leg-left-back", regionId: "leg", view: "back", label: "Left Leg (back)" },
  { shapeId: "leg-right-back", regionId: "leg", view: "back", label: "Right Leg (back)" },
  { shapeId: "knee-left", regionId: "knee", view: "front", label: "Left Knee" },
  { shapeId: "knee-right", regionId: "knee", view: "front", label: "Right Knee" },
  { shapeId: "foot-left", regionId: "foot", view: "front", label: "Left Foot" },
  { shapeId: "foot-right", regionId: "foot", view: "front", label: "Right Foot" },
  { shapeId: "foot-left-back", regionId: "foot", view: "back", label: "Left Foot (back)" },
  { shapeId: "foot-right-back", regionId: "foot", view: "back", label: "Right Foot (back)" },
];

const TORSO_MALE = {
  chest: "M62,84 Q100,72 138,84 L132,164 Q100,172 68,164 Z",
  abdomen: "M68,168 L132,168 L128,226 Q100,233 72,226 Z",
  pelvis: "M72,229 L128,229 L122,268 Q100,277 78,268 Z",
};
const TORSO_FEMALE = {
  chest: "M62,84 Q100,72 138,84 Q134,120 132,164 Q100,172 68,164 Q66,120 62,84 Z",
  abdomen: "M70,168 L130,168 L126,226 Q100,232 74,226 Z",
  pelvis: "M70,229 L130,229 L124,270 Q100,279 76,270 Z",
};

interface BodyMapProps {
  view: BodyView;
  onViewChange: (v: BodyView) => void;
  sex: BodySex;
  onSexChange: (s: BodySex) => void;
  showOrgans: boolean;
  onOrgansChange: (v: boolean) => void;
  selected: SelectedShape | null;
  onSelect: (s: SelectedShape) => void;
}

function Shape({
  id, label, selected, onPick, children,
}: {
  id: string; label: string; selected: boolean;
  onPick: () => void; children: React.ReactNode;
}) {
  return (
    <g
      role="button"
      tabIndex={0}
      aria-label={`Select ${label}`}
      aria-pressed={selected}
      className={`body-shape${selected ? " selected" : ""}`}
      onClick={onPick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onPick();
        }
      }}
    >
      <title>{label}</title>
      {children}
    </g>
  );
}

export function BodyMap(props: BodyMapProps) {
  const { view, selected } = props;
  const [q, setQ] = useState("");
  const torso = props.sex === "female" ? TORSO_FEMALE : TORSO_MALE;

  const pick = (shapeId: string, regionId: string, label: string, organName?: string) =>
    props.onSelect({ shapeId, regionId, label, organName });

  const isSel = (shapeId: string) => selected?.shapeId === shapeId;

  const matches = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (query.length < 2) return [];
    const seen = new Set<string>();
    return BODY_SHAPES.filter((s) => {
      if (!s.label.toLowerCase().includes(query) && !s.regionId.replace("-", " ").includes(query)) return false;
      if (seen.has(s.regionId + view)) return false;
      seen.add(s.regionId + view);
      return s.view === view;
    }).slice(0, 8);
  }, [q, view]);

  const organFor = (viewFilter: BodyView) => ORGANS.filter((o) => o.view === viewFilter);

  return (
    <div>
      <div className="body-controls">
        <div className="seg" role="group" aria-label="Body view">
          <button className={view === "front" ? "active" : ""} onClick={() => props.onViewChange("front")}>Front</button>
          <button className={view === "back" ? "active" : ""} onClick={() => props.onViewChange("back")}>Back</button>
        </div>
        <div className="seg" role="group" aria-label="Body illustration">
          <button className={props.sex === "male" ? "active" : ""} onClick={() => props.onSexChange("male")}>Male</button>
          <button className={props.sex === "female" ? "active" : ""} onClick={() => props.onSexChange("female")}>Female</button>
        </div>
        <button
          className={`chip-btn${props.showOrgans ? " active" : ""}`}
          onClick={() => props.onOrgansChange(!props.showOrgans)}
          aria-pressed={props.showOrgans}
        >
          {props.showOrgans ? "Hide organs" : "Show organs"}
        </button>
      </div>

      <div className="field" style={{ marginTop: 12 }}>
        <label htmlFor="body-search">Find a body part</label>
        <input
          id="body-search" value={q} onChange={(e) => setQ(e.target.value)}
          placeholder="Type e.g. knee, chest, kidney…" maxLength={40} autoComplete="off"
        />
      </div>
      {matches.length > 0 && (
        <div className="chip-row" style={{ marginBottom: 10 }}>
          {matches.map((s) => (
            <button key={s.shapeId} className="chip-btn" onClick={() => { pick(s.shapeId, s.regionId, s.label); setQ(""); }}>
              {s.label}
            </button>
          ))}
        </div>
      )}

      <svg viewBox="0 0 200 430" className="body-svg" role="group" aria-label={`Human body, ${view} view`}>
        {view === "front" ? (
          <>
            <Shape id="s-head" label="Head" selected={isSel("head")} onPick={() => pick("head", "head", "Head")}>
              <ellipse cx="100" cy="34" rx="24" ry="28" />
              <circle cx="91" cy="32" r="2.4" className="face" />
              <circle cx="109" cy="32" r="2.4" className="face" />
              <path d="M92,48 Q100,53 108,48" className="face-line" />
            </Shape>
            <Shape id="s-neck" label="Neck" selected={isSel("neck")} onPick={() => pick("neck", "neck", "Neck")}>
              <rect x="89" y="60" width="22" height="18" rx="5" />
            </Shape>
            <Shape id="s-chest" label="Chest" selected={isSel("chest")} onPick={() => pick("chest", "chest", "Chest")}>
              <path d={torso.chest} />
              {props.sex === "female" && <path d="M78,118 Q100,130 122,118" className="detail-line" />}
            </Shape>
            <Shape id="s-abdomen" label="Abdomen" selected={isSel("abdomen")} onPick={() => pick("abdomen", "abdomen", "Abdomen")}>
              <path d={torso.abdomen} />
              <circle cx="100" cy="200" r="2.5" className="detail-line" />
            </Shape>
            <Shape id="s-pelvis" label="Pelvis" selected={isSel("pelvis")} onPick={() => pick("pelvis", "pelvis", "Pelvis")}>
              <path d={torso.pelvis} />
            </Shape>
            <Shape id="s-arm-l" label="Left Arm" selected={isSel("arm-left")} onPick={() => pick("arm-left", "arm", "Left Arm")}>
              <rect x="42" y="92" width="20" height="112" rx="10" transform="rotate(5 52 92)" />
            </Shape>
            <Shape id="s-arm-r" label="Right Arm" selected={isSel("arm-right")} onPick={() => pick("arm-right", "arm", "Right Arm")}>
              <rect x="138" y="92" width="20" height="112" rx="10" transform="rotate(-5 148 92)" />
            </Shape>
            <Shape id="s-hand-l" label="Left Hand" selected={isSel("hand-left")} onPick={() => pick("hand-left", "hand", "Left Hand")}>
              <rect x="38" y="202" width="24" height="36" rx="12" />
              <path d="M44,238 L44,246 M50,238 L50,246 M56,238 L56,246" className="detail-line" />
            </Shape>
            <Shape id="s-hand-r" label="Right Hand" selected={isSel("hand-right")} onPick={() => pick("hand-right", "hand", "Right Hand")}>
              <rect x="138" y="202" width="24" height="36" rx="12" />
              <path d="M144,238 L144,246 M150,238 L150,246 M156,238 L156,246" className="detail-line" />
            </Shape>
            <Shape id="s-leg-l" label="Left Leg" selected={isSel("leg-left")} onPick={() => pick("leg-left", "leg", "Left Leg")}>
              <rect x="74" y="272" width="24" height="108" rx="12" />
            </Shape>
            <Shape id="s-leg-r" label="Right Leg" selected={isSel("leg-right")} onPick={() => pick("leg-right", "leg", "Right Leg")}>
              <rect x="102" y="272" width="24" height="108" rx="12" />
            </Shape>
            <Shape id="s-knee-l" label="Left Knee" selected={isSel("knee-left")} onPick={() => pick("knee-left", "knee", "Left Knee")}>
              <ellipse cx="86" cy="322" rx="14" ry="10" />
            </Shape>
            <Shape id="s-knee-r" label="Right Knee" selected={isSel("knee-right")} onPick={() => pick("knee-right", "knee", "Right Knee")}>
              <ellipse cx="114" cy="322" rx="14" ry="10" />
            </Shape>
            <Shape id="s-foot-l" label="Left Foot" selected={isSel("foot-left")} onPick={() => pick("foot-left", "foot", "Left Foot")}>
              <rect x="62" y="382" width="36" height="17" rx="8" />
            </Shape>
            <Shape id="s-foot-r" label="Right Foot" selected={isSel("foot-right")} onPick={() => pick("foot-right", "foot", "Right Foot")}>
              <rect x="102" y="382" width="36" height="17" rx="8" />
            </Shape>
            {props.showOrgans && organFor("front").map((o) => (
              <OrganDot key={o.id} organ={o} selected={selected?.organName === o.name} onPick={() => pick(`organ-${o.id}`, o.regionId, `${o.name} (${BODY_REGIONS.find((r) => r.id === o.regionId)?.name ?? ""})`, o.name)} />
            ))}
          </>
        ) : (
          <>
            <Shape id="s-head-b" label="Head (back)" selected={isSel("head-back")} onPick={() => pick("head-back", "head", "Head (back)")}>
              <ellipse cx="100" cy="34" rx="24" ry="28" />
              <path d="M78,30 Q100,6 122,30" className="detail-line" />
            </Shape>
            <Shape id="s-neck-b" label="Neck (back)" selected={isSel("neck-back")} onPick={() => pick("neck-back", "neck", "Neck (back)")}>
              <rect x="89" y="60" width="22" height="18" rx="5" />
            </Shape>
            <Shape id="s-back-u" label="Upper Back" selected={isSel("back-upper")} onPick={() => pick("back-upper", "back-upper", "Upper Back")}>
              <path d="M62,84 Q100,72 138,84 L132,150 Q100,158 68,150 Z" />
              <path d="M100,86 L100,146 M76,100 Q100,110 124,100" className="detail-line" />
            </Shape>
            <Shape id="s-back-l" label="Lower Back" selected={isSel("back-lower")} onPick={() => pick("back-lower", "back-lower", "Lower Back")}>
              <path d={torso.abdomen} />
              <path d="M100,172 L100,222" className="detail-line" />
            </Shape>
            <Shape id="s-pelvis-b" label="Pelvis (back)" selected={isSel("pelvis-back")} onPick={() => pick("pelvis-back", "pelvis", "Pelvis (back)")}>
              <path d={torso.pelvis} />
              <path d="M100,232 Q96,252 100,268 M84,248 Q92,256 90,264 M116,248 Q108,256 110,264" className="detail-line" />
            </Shape>
            <Shape id="s-arm-lb" label="Left Arm (back)" selected={isSel("arm-left-back")} onPick={() => pick("arm-left-back", "arm", "Left Arm (back)")}>
              <rect x="42" y="92" width="20" height="112" rx="10" transform="rotate(5 52 92)" />
            </Shape>
            <Shape id="s-arm-rb" label="Right Arm (back)" selected={isSel("arm-right-back")} onPick={() => pick("arm-right-back", "arm", "Right Arm (back)")}>
              <rect x="138" y="92" width="20" height="112" rx="10" transform="rotate(-5 148 92)" />
            </Shape>
            <Shape id="s-hand-lb" label="Left Hand (back)" selected={isSel("hand-left-back")} onPick={() => pick("hand-left-back", "hand", "Left Hand (back)")}>
              <rect x="38" y="202" width="24" height="36" rx="12" />
            </Shape>
            <Shape id="s-hand-rb" label="Right Hand (back)" selected={isSel("hand-right-back")} onPick={() => pick("hand-right-back", "hand", "Right Hand (back)")}>
              <rect x="138" y="202" width="24" height="36" rx="12" />
            </Shape>
            <Shape id="s-leg-lb" label="Left Leg (back)" selected={isSel("leg-left-back")} onPick={() => pick("leg-left-back", "leg", "Left Leg (back)")}>
              <rect x="74" y="272" width="24" height="108" rx="12" />
            </Shape>
            <Shape id="s-leg-rb" label="Right Leg (back)" selected={isSel("leg-right-back")} onPick={() => pick("leg-right-back", "leg", "Right Leg (back)")}>
              <rect x="102" y="272" width="24" height="108" rx="12" />
            </Shape>
            <Shape id="s-foot-lb" label="Left Foot (back)" selected={isSel("foot-left-back")} onPick={() => pick("foot-left-back", "foot", "Left Foot (back)")}>
              <rect x="62" y="382" width="36" height="17" rx="8" />
            </Shape>
            <Shape id="s-foot-rb" label="Right Foot (back)" selected={isSel("foot-right-back")} onPick={() => pick("foot-right-back", "foot", "Right Foot (back)")}>
              <rect x="102" y="382" width="36" height="17" rx="8" />
            </Shape>
            {props.showOrgans && organFor("back").map((o) => (
              <OrganDot key={o.id} organ={o} selected={selected?.organName === o.name} onPick={() => pick(`organ-${o.id}`, o.regionId, `${o.name} (${BODY_REGIONS.find((r) => r.id === o.regionId)?.name ?? ""})`, o.name)} />
            ))}
          </>
        )}
      </svg>
      <p className="muted" style={{ fontSize: "0.82rem", textAlign: "center" }}>
        Stylised illustration — region positions are approximate. Use search if selection is difficult.
      </p>
    </div>
  );
}

function OrganDot({ organ, selected, onPick }: { organ: { id: string; name: string }; selected: boolean; onPick: () => void }) {
  const pos: Record<string, { cx: number; cy: number; rx: number; ry: number }> = {
    brain: { cx: 100, cy: 32, rx: 13, ry: 11 },
    heart: { cx: 111, cy: 122, rx: 9, ry: 11 },
    lungs: { cx: 86, cy: 124, rx: 10, ry: 17 },
    liver: { cx: 114, cy: 196, rx: 12, ry: 8 },
    stomach: { cx: 89, cy: 198, rx: 8, ry: 11 },
    kidneys: { cx: 100, cy: 210, rx: 16, ry: 10 },
  };
  const p = pos[organ.id] ?? { cx: 100, cy: 100, rx: 10, ry: 10 };
  return (
    <g
      role="button"
      tabIndex={0}
      aria-label={`Select organ ${organ.name}`}
      aria-pressed={selected}
      className={`body-organ${selected ? " selected" : ""}`}
      onClick={onPick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onPick();
        }
      }}
    >
      <title>{organ.name}</title>
      <ellipse cx={p.cx} cy={p.cy} rx={p.rx} ry={p.ry} />
      <text x={p.cx} y={p.cy + 3.5} textAnchor="middle" className="organ-label">{organ.name}</text>
    </g>
  );
}
