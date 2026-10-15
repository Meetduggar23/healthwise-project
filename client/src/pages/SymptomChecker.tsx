import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { BodyMap, type BodySex, type BodyView, type SelectedShape } from "../components/BodyMap";
import { BODY_REGIONS, getRegion } from "../data/bodyRegions";
import { checkerContext, triageCheck } from "../lib/symptomTriage";

const DURATIONS = ["Less than a day", "1–3 days", "4–7 days", "1–4 weeks", "More than a month"];

export function SymptomChecker() {
  const [view, setView] = useState<BodyView>("front");
  const [sex, setSex] = useState<BodySex>("male");
  const [showOrgans, setShowOrgans] = useState(false);
  const [selected, setSelected] = useState<SelectedShape | null>(null);
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [duration, setDuration] = useState("");
  const [severity, setSeverity] = useState(4);
  const [onset, setOnset] = useState<"sudden" | "gradual">("gradual");
  const [notes, setNotes] = useState("");
  const [checked, setChecked] = useState(false);
  const [error, setError] = useState("");

  const region = selected ? getRegion(selected.regionId) : undefined;

  const pick = (s: SelectedShape) => {
    setSelected(s);
    setSymptoms([]);
    setChecked(false);
    setError("");
  };

  const toggleSymptom = (sym: string) =>
    setSymptoms((list) => (list.includes(sym) ? list.filter((x) => x !== sym) : [...list, sym]));

  const triage = useMemo(() => {
    if (!checked || !selected) return null;
    return triageCheck({
      regionId: selected.regionId,
      regionName: selected.label,
      symptoms,
      severity,
      onset,
      duration,
    });
  }, [checked, selected, symptoms, severity, onset, duration]);

  const askQ = useMemo(() => {
    if (!selected) return "";
    return encodeURIComponent(
      checkerContext({
        regionId: selected.regionId,
        regionName: selected.label,
        symptoms,
        severity,
        onset,
        duration,
      }),
    );
  }, [selected, symptoms, severity, onset, duration]);

  const step = !selected ? 1 : !checked ? 2 : 3;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!selected || !region) {
      setError("Please select a body part first.");
      return;
    }
    if (symptoms.length === 0) {
      setError("Please tick at least one symptom.");
      return;
    }
    if (!duration) {
      setError("Please choose how long the symptoms have lasted.");
      return;
    }
    setChecked(true);
    window.setTimeout(() => {
      document.getElementById("checker-results")?.scrollIntoView({ behavior: "smooth" });
    }, 60);
  };

  return (
    <div className="page">
      <h1>Explore Your Symptoms</h1>
      <p className="sub">Select a body part to explore symptoms and health information. Educational guidance only — never a diagnosis.</p>

      <ol className="steps-bar">
        <li className={step >= 1 ? "active" : ""}><span>1</span> Select region{selected ? `: ${selected.label}` : ""}</li>
        <li className={step >= 2 ? "active" : ""}><span>2</span> Choose symptoms</li>
        <li className={step >= 3 ? "active" : ""}><span>3</span> View information</li>
      </ol>

      {triage?.level === "emergency" && (
        <div className="alert alert-error emg-alert">
          <strong>Possible emergency — act now, not later.</strong>
          <ul>
            {triage.reasons.map((r, i) => <li key={i}>{r}</li>)}
          </ul>
          <div style={{ display: "flex", gap: 10, marginTop: 10, flexWrap: "wrap" }}>
            <a className="btn btn-sm" href="tel:112">Call 112 now</a>
            <a className="btn btn-sm btn-outline" href="tel:108">Call 108 (ambulance)</a>
          </div>
          <p style={{ margin: "10px 0 0" }}>Do not manage this through the chatbot. The general information below is secondary to emergency care.</p>
        </div>
      )}

      <div className="checker-grid">
        <div className="card">
          <BodyMap
            view={view} onViewChange={setView}
            sex={sex} onSexChange={setSex}
            showOrgans={showOrgans} onOrgansChange={setShowOrgans}
            selected={selected} onSelect={pick}
          />
        </div>

        <div className="card">
          <h2>Selected area: {selected ? selected.label : "—"}</h2>
          {!selected && <p className="sub">Click a highlighted region, an organ, or use search to begin.</p>}
          {selected?.organName && (
            <p className="sub">Exploring via organ: <strong>{selected.organName}</strong> → {region?.name} region.</p>
          )}
          {region && (
            <form onSubmit={submit}>
              {error && <div className="alert alert-error">{error}</div>}
              <fieldset className="sym-field">
                <legend>Common symptoms (tick all that apply)</legend>
                {region.symptoms.map((s) => (
                  <label key={s} className="check">
                    <input type="checkbox" checked={symptoms.includes(s)} onChange={() => toggleSymptom(s)} />
                    {s}
                  </label>
                ))}
              </fieldset>
              <div className="field">
                <label htmlFor="sc-duration">Duration of symptoms</label>
                <select id="sc-duration" value={duration} onChange={(e) => setDuration(e.target.value)}>
                  <option value="">— Select —</option>
                  {DURATIONS.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div className="field">
                <label htmlFor="sc-sev">Pain severity: {severity}/10</label>
                <input id="sc-sev" type="range" min={1} max={10} step={1} value={severity} onChange={(e) => setSeverity(Number(e.target.value))} />
              </div>
              <fieldset className="sym-field">
                <legend>How did it start?</legend>
                <label className="check"><input type="radio" name="onset" checked={onset === "sudden"} onChange={() => setOnset("sudden")} /> Suddenly</label>
                <label className="check"><input type="radio" name="onset" checked={onset === "gradual"} onChange={() => setOnset("gradual")} /> Gradually</label>
              </fieldset>
              <div className="field">
                <label htmlFor="sc-notes">Additional details (optional)</label>
                <textarea id="sc-notes" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Anything else, e.g. what makes it better or worse" maxLength={500} />
              </div>
              <button className="btn" type="submit" style={{ width: "100%" }}>Check Symptoms</button>
            </form>
          )}
        </div>
      </div>

      {checked && region && selected && triage && (
        <div id="checker-results" className="card" style={{ marginTop: 20 }}>
          <h2>Information for: {selected.label}{symptoms.length > 0 ? ` — ${symptoms.join(", ")}` : ""}</h2>
          <p className="sub">
            Severity {severity}/10 · {onset} onset · {duration || "duration not specified"}
            {notes.trim() ? ` · Note: ${notes.trim().slice(0, 200)}` : ""}. These are general
            possibilities, <strong>not a diagnosis</strong>.
          </p>

          {triage.level === "urgent" && (
            <div className="alert alert-error">
              <strong>Needs prompt medical attention.</strong>
              <ul>{triage.reasons.map((r, i) => <li key={i}>{r}</li>)}</ul>
              <p style={{ margin: "8px 0 0" }}>Please see a doctor soon — today or tomorrow — rather than waiting.</p>
            </div>
          )}

          <h3>Possible causes</h3>
          <div className="cause-grid">
            {region.causes.map((c) => (
              <div key={c.name} className="cause-card">
                <strong>{c.name}</strong>
                <p>{c.detail}</p>
              </div>
            ))}
          </div>

          <div className="res-grid">
            <div>
              <h3>What you can do</h3>
              <ul className="prep-list">{region.selfCare.map((x, i) => <li key={i}>{x}</li>)}</ul>
            </div>
            <div>
              <h3>When to see a doctor</h3>
              <ul className="prep-list">{region.seeDoctor.map((x, i) => <li key={i}>{x}</li>)}</ul>
            </div>
          </div>

          <h3>Emergency warning signs</h3>
          <div className="alert alert-error" style={{ marginBottom: 8 }}>
            If any of these appear, call <a href="tel:112">112</a> (or <a href="tel:108">108</a> for ambulance) immediately:
          </div>
          <ul className="prep-list">{region.emergency.map((x, i) => <li key={i}>{x}</li>)}</ul>

          <div className="res-grid">
            <div>
              <h3>Which specialist?</h3>
              <ul className="prep-list">{region.specialists.map((x, i) => <li key={i}>{x}</li>)}</ul>
            </div>
            <div>
              <h3>Tests a clinician may consider</h3>
              <ul className="prep-list">{region.tests.map((x, i) => <li key={i}>{x}</li>)}</ul>
              <p className="muted" style={{ fontSize: "0.82rem" }}>Not everyone needs these — the doctor decides after examination.</p>
            </div>
          </div>

          <h3>General treatment approaches</h3>
          <ul className="prep-list">{region.treatments.map((x, i) => <li key={i}>{x}</li>)}</ul>

          {region.surgery && (
            <>
              <h3>Surgery — general information</h3>
              <p className="med-para">{region.surgery}</p>
              <p className="muted" style={{ fontSize: "0.85rem" }}>Surgery is only ever recommended for an individual after confirmed diagnosis, scans where needed, and specialist review — never from a symptom checker.</p>
            </>
          )}

          {sex === "female" && region.femaleNote && (
            <>
              <h3>Women's health note</h3>
              <div className="alert alert-info" style={{ marginBottom: 8 }}>
                {region.femaleNote}
              </div>
            </>
          )}

          <h3>Related regions</h3>
          <div className="chip-row">
            {region.related.map((id) => {
              const r = BODY_REGIONS.find((x) => x.id === id);
              if (!r) return null;
              return (
                <button
                  key={id} className="chip-btn"
                  onClick={() => {
                    pick({ shapeId: id, regionId: id, label: r.name });
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                >
                  {r.name}
                </button>
              );
            })}
          </div>

          <h3>References</h3>
          <ul className="prep-list">
            {region.refs.map((r) => (
              <li key={r.url + r.label}><a href={r.url} target="_blank" rel="noopener noreferrer">{r.label}</a></li>
            ))}
          </ul>

          <div style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
            <Link to={`/chat?q=${askQ}`} className="btn">Ask the AI Assistant</Link>
          </div>
          <div className="alert alert-info" style={{ marginTop: 16, marginBottom: 0 }}>
            Educational information only — not a diagnosis or prescription. If you are worried,
            consult a qualified healthcare professional. In an emergency, call 112.
          </div>
        </div>
      )}
    </div>
  );
}
