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

/**
 * Original anatomical vector illustration (no third-party image, no watermark,
 * no licensing risk). Every entry below is an individually selectable SVG
 * region aligned to the artwork; the drawing scales losslessly (viewBox).
 */
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
  { shapeId: "upper-arm-left", regionId: "arm", view: "front", label: "Left Upper Arm" },
  { shapeId: "upper-arm-right", regionId: "arm", view: "front", label: "Right Upper Arm" },
  { shapeId: "upper-arm-left-back", regionId: "arm", view: "back", label: "Left Upper Arm (back)" },
  { shapeId: "upper-arm-right-back", regionId: "arm", view: "back", label: "Right Upper Arm (back)" },
  { shapeId: "forearm-left", regionId: "arm", view: "front", label: "Left Forearm" },
  { shapeId: "forearm-right", regionId: "arm", view: "front", label: "Right Forearm" },
  { shapeId: "forearm-left-back", regionId: "arm", view: "back", label: "Left Forearm (back)" },
  { shapeId: "forearm-right-back", regionId: "arm", view: "back", label: "Right Forearm (back)" },
  { shapeId: "hand-left", regionId: "hand", view: "front", label: "Left Hand" },
  { shapeId: "hand-right", regionId: "hand", view: "front", label: "Right Hand" },
  { shapeId: "hand-left-back", regionId: "hand", view: "back", label: "Left Hand (back)" },
  { shapeId: "hand-right-back", regionId: "hand", view: "back", label: "Right Hand (back)" },
  { shapeId: "thigh-left", regionId: "leg", view: "front", label: "Left Thigh" },
  { shapeId: "thigh-right", regionId: "leg", view: "front", label: "Right Thigh" },
  { shapeId: "thigh-left-back", regionId: "leg", view: "back", label: "Left Thigh (back)" },
  { shapeId: "thigh-right-back", regionId: "leg", view: "back", label: "Right Thigh (back)" },
  { shapeId: "knee-left", regionId: "knee", view: "front", label: "Left Knee" },
  { shapeId: "knee-right", regionId: "knee", view: "front", label: "Right Knee" },
  { shapeId: "calf-left", regionId: "leg", view: "front", label: "Left Calf" },
  { shapeId: "calf-right", regionId: "leg", view: "front", label: "Right Calf" },
  { shapeId: "calf-left-back", regionId: "leg", view: "back", label: "Left Calf (back)" },
  { shapeId: "calf-right-back", regionId: "leg", view: "back", label: "Right Calf (back)" },
  { shapeId: "ankle-left", regionId: "foot", view: "front", label: "Left Ankle" },
  { shapeId: "ankle-right", regionId: "foot", view: "front", label: "Right Ankle" },
  { shapeId: "ankle-left-back", regionId: "foot", view: "back", label: "Left Ankle (back)" },
  { shapeId: "ankle-right-back", regionId: "foot", view: "back", label: "Right Ankle (back)" },
  { shapeId: "foot-left", regionId: "foot", view: "front", label: "Left Foot" },
  { shapeId: "foot-right", regionId: "foot", view: "front", label: "Right Foot" },
  { shapeId: "foot-left-back", regionId: "foot", view: "back", label: "Left Foot (back)" },
  { shapeId: "foot-right-back", regionId: "foot", view: "back", label: "Right Foot (back)" },
];

/* Torso variants: female has bust shaping, narrower waist, wider pelvis. */
const TORSO = {
  male: {
    chest: "M78,90 Q120,78 162,90 L156,168 Q120,177 84,168 Z",
    abdomen: "M86,171 L154,171 L150,232 Q120,240 90,232 Z",
    pelvis: "M90,234 L150,234 L144,276 Q120,285 96,276 Z",
  },
  female: {
    chest: "M78,90 Q120,78 162,90 L156,168 Q120,177 84,168 Z",
    abdomen: "M92,171 L148,171 L144,232 Q120,239 96,232 Z",
    pelvis: "M86,234 L154,234 L148,278 Q120,287 92,278 Z",
  },
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

function Region({
  label, selected, onPick, children,
}: {
  label: string; selected: boolean;
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

const M = (x: number) => 240 - x; // mirror helper for right-side coordinates

export function BodyMap(props: BodyMapProps) {
  const { view, sex, selected } = props;
  const [q, setQ] = useState("");
  const torso = TORSO[sex];

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

  const organFor = (v: BodyView) => ORGANS.filter((o) => o.view === v);

  return (
    <div>
      <div className="body-controls">
        <div className="seg" role="group" aria-label="Body view">
          <button className={view === "front" ? "active" : ""} onClick={() => props.onViewChange("front")}>Front</button>
          <button className={view === "back" ? "active" : ""} onClick={() => props.onViewChange("back")}>Back</button>
        </div>
        <div className="seg" role="group" aria-label="Body illustration">
          <button className={sex === "male" ? "active" : ""} onClick={() => props.onSexChange("male")}>Male</button>
          <button className={sex === "female" ? "active" : ""} onClick={() => props.onSexChange("female")}>Female</button>
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

      <svg viewBox="0 0 240 480" className="body-svg anatomy" role="group" aria-label={`Human anatomy, ${sex} ${view} view`}>
        <defs>
          <linearGradient id="skinGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#e2a276" />
            <stop offset="0.5" stopColor="#f0bd93" />
            <stop offset="1" stopColor="#e2a276" />
          </linearGradient>
          <linearGradient id="shortsGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#4a5a70" />
            <stop offset="1" stopColor="#333f52" />
          </linearGradient>
          <radialGradient id="organGrad" cx="0.5" cy="0.4" r="0.8">
            <stop offset="0" stopColor="#e88" />
            <stop offset="1" stopColor="#c44" />
          </radialGradient>
        </defs>

        {view === "front" ? (
          <FrontBody sex={sex} torso={torso} isSel={isSel} pick={pick} showOrgans={props.showOrgans} selectedOrgan={selected?.organName} />
        ) : (
          <BackBody torso={torso} isSel={isSel} pick={pick} showOrgans={props.showOrgans} selectedOrgan={selected?.organName} />
        )}
      </svg>
      <p className="muted" style={{ fontSize: "0.82rem", textAlign: "center" }}>
        Original anatomical illustration — each highlighted zone is separately selectable. Use search if selection is difficult.
      </p>
    </div>
  );
}

interface BodyPartProps {
  sex: BodySex;
  torso: { chest: string; abdomen: string; pelvis: string };
  isSel: (id: string) => boolean;
  pick: (shapeId: string, regionId: string, label: string, organName?: string) => void;
  showOrgans: boolean;
  selectedOrgan?: string;
}

function OrganDot({ id, name, cx, cy, rx, ry, selected, onPick }: {
  id: string; name: string; cx: number; cy: number; rx: number; ry: number;
  selected: boolean; onPick: () => void;
}) {
  return (
    <g
      role="button" tabIndex={0} aria-label={`Select organ ${name}`} aria-pressed={selected}
      className={`body-organ${selected ? " selected" : ""}`} data-organ={id}
      onClick={onPick}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onPick(); } }}
    >
      <title>{name}</title>
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} />
      <text x={cx} y={cy + 3} textAnchor="middle" className="organ-label">{name}</text>
    </g>
  );
}

function FrontBody({ sex, torso, isSel, pick, showOrgans, selectedOrgan }: BodyPartProps) {
  const organ = (id: string) => {
    const o = ORGANS.find((x) => x.id === id)!;
    const region = BODY_REGIONS.find((r) => r.id === o.regionId)?.name ?? "";
    return { label: `${o.name} (${region})`, regionId: o.regionId, name: o.name };
  };
  const od = (id: string, cx: number, cy: number, rx: number, ry: number) => {
    const o = organ(id);
    return (
      <OrganDot id={id} name={o.name} cx={cx} cy={cy} rx={rx} ry={ry}
        selected={selectedOrgan === o.name}
        onPick={() => pick(`organ-${id}`, o.regionId, o.label, o.name)} />
    );
  };
  return (
    <>
      {/* HEAD */}
      <Region label="Head" selected={isSel("head")} onPick={() => pick("head", "head", "Head")}>
        <ellipse cx="120" cy="30" rx="23" ry="27" />
        <ellipse cx="96" cy="33" rx="4" ry="6" />
        <ellipse cx="144" cy="33" rx="4" ry="6" />
        <path d="M101,46 Q120,62 139,46" className="ink" />
        <path d="M106,22 L116,22 M124,22 L134,22" className="ink" />
        <ellipse cx="112" cy="31" rx="4" ry="3" className="white" />
        <ellipse cx="128" cy="31" rx="4" ry="3" className="white" />
        <circle cx="112" cy="31" r="1.6" className="inkfill" />
        <circle cx="128" cy="31" r="1.6" className="inkfill" />
        <path d="M120,32 L118,40 L122,41" className="ink" />
        <path d="M112,48 Q120,52 128,48" className="ink" />
      </Region>
      {/* NECK */}
      <Region label="Neck" selected={isSel("neck")} onPick={() => pick("neck", "neck", "Neck")}>
        <path d="M107,55 L133,55 L137,86 L103,86 Z" />
        <path d="M107,60 L88,84 M133,60 L152,84" className="ink" />
        <path d="M113,62 L111,80 M127,62 L129,80" className="ink" />
      </Region>
      {/* CHEST */}
      <Region label="Chest" selected={isSel("chest")} onPick={() => pick("chest", "chest", "Chest")}>
        <path d={torso.chest} />
        <path d="M90,110 Q106,126 119,114 M150,110 Q134,126 121,114" className="ink" />
        {sex === "female" ? (
          <>
            <path d="M90,112 Q100,136 118,130 Q136,136 150,112" className="ink" />
            <circle cx="106" cy="124" r="2.4" className="inkfill" />
            <circle cx="134" cy="124" r="2.4" className="inkfill" />
          </>
        ) : (
          <>
            <circle cx="105" cy="121" r="2" className="inkfill" />
            <circle cx="135" cy="121" r="2" className="inkfill" />
            <path d="M120,84 L120,108" className="ink" />
          </>
        )}
      </Region>
      {/* ABDOMEN */}
      <Region label="Abdomen" selected={isSel("abdomen")} onPick={() => pick("abdomen", "abdomen", "Abdomen")}>
        <path d={torso.abdomen} />
        <path d="M120,172 L120,228" className="ink" />
        <path d="M96,184 L144,184 M94,198 L146,198 M94,212 L146,212" className="ink" />
        <circle cx="120" cy="206" r="2.2" className="inkfill" />
      </Region>
      {/* PELVIS (modest shorts) */}
      <Region label="Pelvis" selected={isSel("pelvis")} onPick={() => pick("pelvis", "pelvis", "Pelvis")}>
        <path d={torso.pelvis} className="shorts" />
        <path d="M120,236 L120,272" className="seam" />
      </Region>
      {/* ARMS */}
      {([["L", 1], ["R", -1]] as const).map(([side, dir]) => {
        const X = (x: number) => (dir === 1 ? x : M(x));
        const lbl = side === "L" ? "Left" : "Right";
        return (
          <g key={side}>
            <Region label={`${lbl} Upper Arm`} selected={isSel(`upper-arm-${side === "L" ? "left" : "right"}`)} onPick={() => pick(`upper-arm-${side === "L" ? "left" : "right"}`, "arm", `${lbl} Upper Arm`)}>
              <path d={`M${X(64)},94 C${X(54)},100 ${X(51)},112 ${X(50)},126 L${X(48)},166 C${X(48)},174 ${X(52)},178 ${X(58)},178 L${X(68)},178 C${X(74)},178 ${X(77)},174 ${X(76)},166 L${X(74)},110 Z`} />
              <path d={`M${X(58)},120 Q${X(62)},145 ${X(60)},165`} className="ink" />
              <ellipse cx={X(63)} cy={102} rx="13" ry="12" />
            </Region>
            <Region label={`${lbl} Forearm`} selected={isSel(`forearm-${side === "L" ? "left" : "right"}`)} onPick={() => pick(`forearm-${side === "L" ? "left" : "right"}`, "arm", `${lbl} Forearm`)}>
              <path d={`M${X(50)},180 L${X(74)},180 L${X(70)},232 Q${X(62)},236 ${X(56)},232 Z`} />
              <path d={`M${X(58)},190 Q${X(60)},210 ${X(59)},226 M${X(66)},190 Q${X(67)},210 ${X(66)},226`} className="ink" />
            </Region>
            <Region label={`${lbl} Hand`} selected={isSel(`hand-${side === "L" ? "left" : "right"}`)} onPick={() => pick(`hand-${side === "L" ? "left" : "right"}`, "hand", `${lbl} Hand`)}>
              <rect x={side === "L" ? 48 : 168} y="234" width="24" height="22" rx="9" />
              {[0, 1, 2, 3].map((f) => (
                <rect key={f} x={(side === "L" ? 49 : 173) + f * 5.5} y="256" width="4.6" height="17" rx="2.3" />
              ))}
              <path d={side === "L" ? "M48,244 Q40,250 42,258" : "M192,244 Q200,250 198,258"} className="ink" />
            </Region>
          </g>
        );
      })}
      {/* LEGS */}
      {([["L", 1], ["R", -1]] as const).map(([side, dir]) => {
        void dir;
        const nm = side === "L" ? "left" : "right";
        const lbl = side === "L" ? "Left" : "Right";
        const tb = side === "L" ? 94 : 122;
        const cb = side === "L" ? 93 : 123;
        const fb = side === "L" ? 90 : 118;
        const kneeCx = side === "L" ? 106 : 134;
        return (
          <g key={side}>
            <Region label={`${lbl} Thigh`} selected={isSel(`thigh-${nm}`)} onPick={() => pick(`thigh-${nm}`, "leg", `${lbl} Thigh`)}>
              <path d={`M${tb},278 L${tb + 24},278 L${tb + 22},348 L${tb + 2},348 Z`} />
              <path d={`M${tb + 6},290 Q${tb + 8},315 ${tb + 7},340 M${tb + 18},290 Q${tb + 18},315 ${tb + 18},340`} className="ink" />
            </Region>
            <Region label={`${lbl} Knee`} selected={isSel(`knee-${nm}`)} onPick={() => pick(`knee-${nm}`, "knee", `${lbl} Knee`)}>
              <circle cx={kneeCx} cy="356" r="10" />
              <circle cx={kneeCx} cy="356" r="5" className="ink" />
            </Region>
            <Region label={`${lbl} Calf`} selected={isSel(`calf-${nm}`)} onPick={() => pick(`calf-${nm}`, "leg", `${lbl} Calf`)}>
              <path d={`M${cb},366 L${cb + 22},366 L${cb + 18},422 L${cb + 4},422 Z`} />
              <path d={`M${cb + 11},374 Q${cb + 15},396 ${cb + 11},416`} className="ink" />
            </Region>
            <Region label={`${lbl} Ankle`} selected={isSel(`ankle-${nm}`)} onPick={() => pick(`ankle-${nm}`, "foot", `${lbl} Ankle`)}>
              <rect x={cb + 2} y="422" width="18" height="10" rx="4" />
            </Region>
            <Region label={`${lbl} Foot`} selected={isSel(`foot-${nm}`)} onPick={() => pick(`foot-${nm}`, "foot", `${lbl} Foot`)}>
              <path d={`M${fb},432 L${fb + 30},432 L${fb + 32},444 Q${fb + 30},452 ${fb + 20},452 L${fb + 2},452 Q${fb - 2},452 ${fb - 2},444 Z`} />
              {[6, 12, 18, 24].map((o) => (
                <path key={o} d={`M${fb + o},452 L${fb + o},446`} className="ink" />
              ))}
            </Region>
          </g>
        );
      })}
      {/* ORGANS */}
      {showOrgans && (
        <>
          {od("brain", 120, 28, 12, 10)}
          {od("lungs", 105, 126, 10, 16)}
          {od("heart", 133, 124, 9, 11)}
          {od("liver", 141, 194, 11, 8)}
          {od("stomach", 100, 198, 8, 11)}
          {od("reproductive", 120, 254, 9, 8)}
        </>
      )}
    </>
  );
}

function BackBody({ torso, isSel, pick, showOrgans, selectedOrgan }: Omit<BodyPartProps, "sex">) {
  const organ = (id: string) => {
    const o = ORGANS.find((x) => x.id === id)!;
    const region = BODY_REGIONS.find((r) => r.id === o.regionId)?.name ?? "";
    return { label: `${o.name} (${region})`, regionId: o.regionId, name: o.name };
  };
  const od = (id: string, cx: number, cy: number, rx: number, ry: number) => {
    const o = organ(id);
    return (
      <OrganDot id={id} name={o.name} cx={cx} cy={cy} rx={rx} ry={ry}
        selected={selectedOrgan === o.name}
        onPick={() => pick(`organ-${id}`, o.regionId, o.label, o.name)} />
    );
  };
  return (
    <>
      <Region label="Head (back)" selected={isSel("head-back")} onPick={() => pick("head-back", "head", "Head (back)")}>
        <ellipse cx="120" cy="30" rx="23" ry="27" />
        <path d="M99,26 Q100,8 120,8 Q140,8 141,26 Q138,16 120,15 Q102,16 99,26 Z" className="hair" />
        <ellipse cx="96" cy="33" rx="4" ry="6" />
        <ellipse cx="144" cy="33" rx="4" ry="6" />
      </Region>
      <Region label="Neck (back)" selected={isSel("neck-back")} onPick={() => pick("neck-back", "neck", "Neck (back)")}>
        <path d="M107,55 L133,55 L137,86 L103,86 Z" />
        <path d="M107,60 L88,84 M133,60 L152,84" className="ink" />
      </Region>
      <Region label="Upper Back" selected={isSel("back-upper")} onPick={() => pick("back-upper", "back-upper", "Upper Back")}>
        <path d="M78,90 Q120,78 162,90 L156,152 Q120,160 84,152 Z" />
        <path d="M120,88 L120,148 M100,96 Q120,104 140,96 M94,120 Q120,130 146,120" className="ink" />
        <path d="M96,104 Q92,118 94,132 M144,104 Q148,118 146,132" className="ink" />
      </Region>
      <Region label="Lower Back" selected={isSel("back-lower")} onPick={() => pick("back-lower", "back-lower", "Lower Back")}>
        <path d={torso.abdomen} />
        <path d="M120,174 L120,228" className="spine" />
        {[182, 192, 202, 212, 222].map((y) => (
          <path key={y} d={`M115,${y} L125,${y}`} className="spine" />
        ))}
        <path d="M100,180 Q96,200 98,224 M140,180 Q144,200 142,224" className="ink" />
      </Region>
      <Region label="Pelvis (back)" selected={isSel("pelvis-back")} onPick={() => pick("pelvis-back", "pelvis", "Pelvis (back)")}>
        <path d={torso.pelvis} className="shorts" />
        <path d="M100,238 Q96,256 100,272 M140,238 Q144,256 140,272" className="seam" />
      </Region>
      {([["L", 1], ["R", -1]] as const).map(([side, dir]) => {
        const X = (x: number) => (dir === 1 ? x : M(x));
        const nm = side === "L" ? "left" : "right";
        const lbl = side === "L" ? "Left" : "Right";
        const tb = side === "L" ? 94 : 122;
        const cb = side === "L" ? 93 : 123;
        const fb = side === "L" ? 90 : 118;
        return (
          <g key={side}>
            <Region label={`${lbl} Upper Arm (back)`} selected={isSel(`upper-arm-${nm}-back`)} onPick={() => pick(`upper-arm-${nm}-back`, "arm", `${lbl} Upper Arm (back)`)}>
              <path d={`M${X(64)},94 C${X(54)},100 ${X(51)},112 ${X(50)},126 L${X(48)},166 C${X(48)},174 ${X(52)},178 ${X(58)},178 L${X(68)},178 C${X(74)},178 ${X(77)},174 ${X(76)},166 L${X(74)},110 Z`} />
              <path d={`M${X(66)},120 Q${X(64)},145 ${X(65)},165`} className="ink" />
              <ellipse cx={X(63)} cy={102} rx="13" ry="12" />
            </Region>
            <Region label={`${lbl} Forearm (back)`} selected={isSel(`forearm-${nm}-back`)} onPick={() => pick(`forearm-${nm}-back`, "arm", `${lbl} Forearm (back)`)}>
              <path d={`M${X(50)},180 L${X(74)},180 L${X(70)},232 Q${X(62)},236 ${X(56)},232 Z`} />
              <path d={`M${X(62)},190 Q${X(62)},210 ${X(61)},226`} className="ink" />
            </Region>
            <Region label={`${lbl} Hand (back)`} selected={isSel(`hand-${nm}-back`)} onPick={() => pick(`hand-${nm}-back`, "hand", `${lbl} Hand (back)`)}>
              <rect x={side === "L" ? 48 : 168} y="234" width="24" height="22" rx="9" />
              {[0, 1, 2, 3].map((f) => (
                <rect key={f} x={(side === "L" ? 49 : 173) + f * 5.5} y="256" width="4.6" height="17" rx="2.3" />
              ))}
            </Region>
            <Region label={`${lbl} Thigh (back)`} selected={isSel(`thigh-${nm}-back`)} onPick={() => pick(`thigh-${nm}-back`, "leg", `${lbl} Thigh (back)`)}>
              <path d={`M${tb},278 L${tb + 24},278 L${tb + 22},348 L${tb + 2},348 Z`} />
              <path d={`M${tb + 12},290 Q${tb + 10},315 ${tb + 12},342`} className="ink" />
            </Region>
            <Region label={`${lbl} Calf (back)`} selected={isSel(`calf-${nm}-back`)} onPick={() => pick(`calf-${nm}-back`, "leg", `${lbl} Calf (back)`)}>
              <path d={`M${cb},366 L${cb + 22},366 L${cb + 18},422 L${cb + 4},422 Z`} />
              <path d={`M${cb + 5},374 Q${cb + 11},396 ${cb + 7},418 M${cb + 19},374 Q${cb + 15},396 ${cb + 18},418`} className="ink" />
            </Region>
            <Region label={`${lbl} Ankle (back)`} selected={isSel(`ankle-${nm}-back`)} onPick={() => pick(`ankle-${nm}-back`, "foot", `${lbl} Ankle (back)`)}>
              <rect x={cb + 2} y="422" width="18" height="10" rx="4" />
            </Region>
            <Region label={`${lbl} Foot (back)`} selected={isSel(`foot-${nm}-back`)} onPick={() => pick(`foot-${nm}-back`, "foot", `${lbl} Foot (back)`)}>
              <path d={`M${fb},432 L${fb + 30},432 L${fb + 32},444 Q${fb + 30},452 ${fb + 20},452 L${fb + 2},452 Q${fb - 2},452 ${fb - 2},444 Z`} />
              <path d={`M${fb + 8},440 L${fb + 24},440`} className="ink" />
            </Region>
          </g>
        );
      })}
      {showOrgans && (
        <>
          {od("kidneys", 109, 206, 7, 10)}
          {od("kidneys", 131, 206, 7, 10)}
        </>
      )}
    </>
  );
}
