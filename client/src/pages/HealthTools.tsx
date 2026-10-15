import { useState } from "react";
import { calcAge, calcBmi, hydrationGuide } from "../lib/healthCalc";

export function HealthTools() {
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [bmiOut, setBmiOut] = useState("");
  const [bmiErr, setBmiErr] = useState("");

  const [dob, setDob] = useState("");
  const [ageOut, setAgeOut] = useState("");
  const [ageErr, setAgeErr] = useState("");

  const [hWeight, setHWeight] = useState("");
  const [exercise, setExercise] = useState("0");
  const [hydOut, setHydOut] = useState("");
  const [hydErr, setHydErr] = useState("");

  const runBmi = (e: React.FormEvent) => {
    e.preventDefault();
    setBmiErr("");
    setBmiOut("");
    try {
      const r = calcBmi(Number(weight), Number(height));
      setBmiOut(`BMI ${r.bmi} — ${r.category}.`);
    } catch (err) {
      setBmiErr(err instanceof Error ? err.message : "Invalid input.");
    }
  };

  const runAge = (e: React.FormEvent) => {
    e.preventDefault();
    setAgeErr("");
    setAgeOut("");
    try {
      const r = calcAge(dob);
      setAgeOut(`${r.years} years, ${r.months} months, ${r.days} days.`);
    } catch (err) {
      setAgeErr(err instanceof Error ? err.message : "Invalid input.");
    }
  };

  const runHyd = (e: React.FormEvent) => {
    e.preventDefault();
    setHydErr("");
    setHydOut("");
    try {
      const r = hydrationGuide(Number(hWeight), Number(exercise));
      setHydOut(`About ${r.litresMin}–${r.litresMax} litres per day (${r.glasses}). Increase in hot weather, fever, diarrhoea, or heavy sweating.`);
    } catch (err) {
      setHydErr(err instanceof Error ? err.message : "Invalid input.");
    }
  };

  return (
    <div className="page">
      <h1>Health Tools</h1>
      <p className="sub">
        Educational estimates only — not diagnoses. These tools never prescribe treatment;
        consult a qualified professional for medical decisions.
      </p>

      <div className="tool-grid">
        <div className="card">
          <h2>BMI calculator</h2>
          <p className="sub">Body mass index from weight and height (adults).</p>
          <form onSubmit={runBmi}>
            <div className="field"><label htmlFor="t-weight">Weight (kg)</label>
              <input id="t-weight" type="number" min="1" step="0.1" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="e.g. 65" /></div>
            <div className="field"><label htmlFor="t-height">Height (cm)</label>
              <input id="t-height" type="number" min="1" step="0.1" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="e.g. 170" /></div>
            {bmiErr && <div className="alert alert-error">{bmiErr}</div>}
            {bmiOut && <div className="alert alert-success">{bmiOut}</div>}
            <button className="btn" type="submit" style={{ width: "100%" }}>Calculate BMI</button>
          </form>
          <p className="sub" style={{ marginTop: 12, fontSize: "0.85rem" }}>
            Under 18.5 underweight · 18.5–24.9 healthy · 25–29.9 overweight · 30+ obese range.
            BMI cannot distinguish muscle from fat.
          </p>
        </div>

        <div className="card">
          <h2>Age calculator</h2>
          <p className="sub">Exact age from date of birth.</p>
          <form onSubmit={runAge}>
            <div className="field"><label htmlFor="t-dob">Date of birth</label>
              <input id="t-dob" type="date" value={dob} onChange={(e) => setDob(e.target.value)} /></div>
            {ageErr && <div className="alert alert-error">{ageErr}</div>}
            {ageOut && <div className="alert alert-success">{ageOut}</div>}
            <button className="btn" type="submit" style={{ width: "100%" }}>Calculate Age</button>
          </form>
        </div>

        <div className="card">
          <h2>Hydration guidance</h2>
          <p className="sub">Rough daily fluid estimate by weight and activity.</p>
          <form onSubmit={runHyd}>
            <div className="field"><label htmlFor="t-hw">Weight (kg)</label>
              <input id="t-hw" type="number" min="1" step="0.1" value={hWeight} onChange={(e) => setHWeight(e.target.value)} placeholder="e.g. 65" /></div>
            <div className="field"><label htmlFor="t-ex">Exercise (minutes/day)</label>
              <input id="t-ex" type="number" min="0" max="600" step="1" value={exercise} onChange={(e) => setExercise(e.target.value)} placeholder="e.g. 30" /></div>
            {hydErr && <div className="alert alert-error">{hydErr}</div>}
            {hydOut && <div className="alert alert-success">{hydOut}</div>}
            <button className="btn" type="submit" style={{ width: "100%" }}>Estimate Fluids</button>
          </form>
          <p className="sub" style={{ marginTop: 12, fontSize: "0.85rem" }}>
            Fluid limits differ in kidney, heart, or liver disease — follow your doctor's advice.
          </p>
        </div>
      </div>

      <div className="card" style={{ marginTop: 20 }}>
        <h2>Understanding health measurements</h2>
        <div className="appt-meta">
          <div><strong>Blood pressure</strong> — written as systolic/diastolic (e.g. 120/80 mmHg). A single high reading is not a diagnosis; trends and proper cuff size matter.</div>
          <div><strong>Blood sugar</strong> — fasting sugar is a snapshot; HbA1c reflects the ~3-month average. Targets vary by person.</div>
          <div><strong>SpO2</strong> — oxygen saturation on a pulse oximeter, normally ~95–100%. Cold fingers and movement distort readings.</div>
          <div><strong>Body temperature</strong> — above ~100.4°F (38°C) is generally fever. Measure after resting, not right after hot drinks or exercise.</div>
          <div><strong>Cholesterol (lipid profile)</strong> — LDL, HDL, and triglycerides together describe risk; one value never tells the whole story.</div>
        </div>
      </div>
    </div>
  );
}
