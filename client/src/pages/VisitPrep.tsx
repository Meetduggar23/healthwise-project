import { VISIT_PREP_SECTIONS } from "../data/healthContent";

export function VisitPrep() {
  return (
    <div className="page">
      <h1>Preparing for Your Visit</h1>
      <p className="sub">
        A little preparation makes every doctor visit more useful — for you and your doctor.
      </p>
      <div className="tool-grid">
        {VISIT_PREP_SECTIONS.map((s) => (
          <div className="card" key={s.title}>
            <h2>{s.title}</h2>
            <ul className="prep-list">
              {s.points.map((p, i) => <li key={i}>{p}</li>)}
            </ul>
          </div>
        ))}
      </div>
      <p className="sub" style={{ marginTop: 18, fontSize: "0.85rem" }}>
        HealthWise is a college demonstration. It does not provide real hospital services;
        always confirm arrangements with the actual clinic or hospital you visit.
      </p>
    </div>
  );
}
