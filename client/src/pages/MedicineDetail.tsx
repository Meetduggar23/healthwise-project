import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { MEDICINES, NA } from "../data/medicines";
import { MedicineImage } from "../components/MedicineImage";

const RECENT_KEY = "healthwise.med.recent.v1";

function remember(id: string) {
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    const list = (JSON.parse(raw ?? "[]") as string[]).filter((x) => x !== id);
    localStorage.setItem(RECENT_KEY, JSON.stringify([id, ...list].slice(0, 6)));
  } catch {
    /* private mode — recently-viewed simply stays empty */
  }
}

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="med-section">
      <h2>{title}</h2>
      {children}
    </section>
  );
}

function List({ items }: { items: string[] }) {
  const list = items.length > 0 ? items : [NA];
  return (
    <ul className="prep-list">
      {list.map((x, i) => <li key={i}>{x}</li>)}
    </ul>
  );
}

function Para({ text }: { text: string }) {
  return <p className="med-para">{text || NA}</p>;
}

export function MedicineDetail() {
  const { id } = useParams<{ id: string }>();
  const m = MEDICINES.find((x) => x.id === id);

  useEffect(() => {
    if (m) remember(m.id);
    window.scrollTo(0, 0);
  }, [m?.id]);

  if (!m) {
    return (
      <div className="page">
        <div className="card empty">
          <h2>Medicine not found</h2>
          <p className="sub" style={{ textAlign: "center" }}>
            This entry does not exist in the library. It may have been removed or the link is incorrect.
          </p>
          <Link to="/medicines" className="btn">Back to Medicine Library</Link>
        </div>
      </div>
    );
  }

  const toc: [string, string][] = [
    ["overview", "Overview"],
    ["uses", "Common uses"],
    ["how", "How it works"],
    ["forms", "Available forms"],
    ["side", "Common side effects"],
    ["serious", "Serious effects & warnings"],
    ["precautions", "Precautions"],
    ["interactions", "Interactions"],
    ["pregnancy", "Pregnancy & breastfeeding"],
    ["age", "Children & older adults"],
    ["safeuse", "Safe use"],
    ["overdose", "Overdose"],
    ["rx", "Prescription / OTC"],
    ["refs", "References"],
  ];

  const askQ = encodeURIComponent(`Tell me about ${m.name} (${m.generic}) — uses and side effects`);

  return (
    <div className="page">
      <Link to="/medicines" className="btn btn-ghost btn-sm" style={{ marginBottom: 14 }}>← Medicine Library</Link>

      <div className="card med-hero">
        <div className="med-hero-img">
          <MedicineImage url={m.imageUrl} alt={m.imageAlt} form={m.forms[0] ?? "tablet"} />
        </div>
        <div>
          <div className="chip-row">
            {m.categories.map((c) => <span key={c} className="chip">{c}</span>)}
          </div>
          <h1 style={{ marginTop: 8 }}>{m.name}</h1>
          <p className="sub" style={{ marginBottom: 8 }}>{m.generic}</p>
          <p className="med-para">{m.summary}</p>
          <p className="muted" style={{ fontSize: "0.8rem" }}>
            {m.imageUrl ? "Illustrative photo — not the actual brand pack. " : ""}
            {m.imagePage ? (<a href={m.imagePage} target="_blank" rel="noopener noreferrer">Image source: {m.imageCredit}</a>) : m.imageCredit}
            {" · "}Brands include: {m.brands.join(", ")}
          </p>
          <div style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
            <Link to={`/chat?q=${askQ}`} className="btn btn-sm">Ask HealthWise AI</Link>
          </div>
        </div>
      </div>

      <div className="med-detail-grid">
        <nav className="card med-toc" aria-label="On this page">
          <strong>On this page</strong>
          <ol>
            {toc.map(([anchor, label]) => (
              <li key={anchor}><a href={`#${anchor}`}>{label}</a></li>
            ))}
          </ol>
        </nav>

        <div className="card med-article">
          <Section id="overview" title={`What is ${m.name}?`}>
            <Para text={m.summary} />
          </Section>
          <Section id="uses" title="Common uses & approved indications">
            <List items={m.uses} />
          </Section>
          <Section id="how" title="How it works">
            <Para text={m.howItWorks} />
          </Section>
          <Section id="forms" title="Available forms">
            <List items={m.forms} />
          </Section>
          <Section id="side" title="Common side effects">
            <List items={m.sideEffects} />
          </Section>
          <Section id="serious" title="Serious side effects & warning signs">
            <div className="alert alert-error">
              Get emergency help (call <a href="tel:112">112</a>) for breathing trouble,
              facial swelling, fainting, or any rapidly worsening reaction.
            </div>
            <List items={m.seriousWarnings} />
          </Section>
          <Section id="precautions" title="Contraindications & precautions">
            <List items={m.precautions} />
          </Section>
          <Section id="interactions" title="Known interactions">
            <List items={m.interactions} />
          </Section>
          <Section id="pregnancy" title="Pregnancy & breastfeeding">
            <Para text={m.pregnancy} />
          </Section>
          <Section id="age" title="Children & older adults">
            <Para text={m.childElderly} />
          </Section>
          <Section id="safeuse" title="General instructions for safe use">
            <List items={m.safeUse} />
          </Section>
          <Section id="overdose" title="Overdose guidance">
            <Para text={m.overdose} />
          </Section>
          <Section id="rx" title="Prescription or over the counter?">
            <Para text={m.rx} />
          </Section>
          <Section id="refs" title="References & review date">
            <ul className="prep-list">
              {m.refs.map((r) => (
                <li key={r.url + r.label}>
                  <a href={r.url} target="_blank" rel="noopener noreferrer">{r.label}</a>
                </li>
              ))}
            </ul>
            <p className="muted" style={{ marginTop: 8 }}>Last reviewed: {m.reviewed}. Summarized in our own words; see sources for full monographs.</p>
          </Section>

          <div className="alert alert-info" style={{ marginTop: 20, marginBottom: 0 }}>
            Educational information only — not a prescription or personal medical advice.
            This content has not been individually verified by a doctor. Do not start, stop,
            or change any medicine without your doctor's or pharmacist's guidance.
          </div>
        </div>
      </div>
    </div>
  );
}
