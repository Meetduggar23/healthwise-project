import { useState } from "react";
import { EMERGENCY_NUMBERS, FIRST_AID } from "../data/healthContent";

export function Emergency() {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="page">
      <h1>Emergency Help Center</h1>
      <p className="sub">
        Life-threatening emergency? Get professional help first — call now. Do not try to
        manage emergencies through the chatbot.
      </p>

      <div className="emg-grid">
        {EMERGENCY_NUMBERS.map((n) => (
          <div className="card emg-card" key={n.number}>
            <div className="emg-num">{n.number}</div>
            <h2>{n.label}</h2>
            <p className="sub">{n.note}</p>
            <a className="btn" href={n.href}>Call {n.number}</a>
          </div>
        ))}
      </div>
      <div className="alert alert-info" style={{ marginTop: 16 }}>
        Emergency numbers and service availability may vary by location. If these numbers do
        not work where you are, call your local emergency number immediately.
      </div>

      <h2 style={{ marginTop: 32 }}>Quick first-aid guidance</h2>
      <p className="sub">
        Short, cautious steps while professional help is on the way. Each topic tells you
        when to call emergency services.
      </p>
      <div className="faq-list">
        {FIRST_AID.map((t) => (
          <div className="card faq-item" key={t.id}>
            <button className="faq-q" onClick={() => setOpenId((o) => (o === t.id ? null : t.id))}>
              <span>{t.title}</span>
              <span>{openId === t.id ? "−" : "+"}</span>
            </button>
            {openId === t.id && (
              <div className="faq-a">
                <p><strong>{t.callNow}</strong></p>
                <ul>
                  {t.steps.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
      <p className="sub" style={{ marginTop: 18, fontSize: "0.85rem" }}>
        General information only — not medical advice. HealthWise does not provide real
        hospital or ambulance services.
      </p>
    </div>
  );
}
