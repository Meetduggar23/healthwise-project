import { useMemo, useState } from "react";
import { FAQ } from "../data/healthContent";

export function HealthFaq() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [openKey, setOpenKey] = useState<string | null>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return FAQ.filter((c) => !category || c.id === category).flatMap((c) =>
      c.items
        .filter((it) => !q || it.q.toLowerCase().includes(q) || it.a.toLowerCase().includes(q))
        .map((it) => ({ cat: c.title, item: it })),
    );
  }, [query, category]);

  return (
    <div className="page">
      <h1>Health FAQ</h1>
      <p className="sub">Quick answers about appointments, tests, general health, emergencies, and the chatbot.</p>
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="field-row">
          <div className="field" style={{ marginBottom: 0 }}>
            <label htmlFor="faq-q">Search questions</label>
            <input id="faq-q" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Try ‘cancel’, ‘fasting’, ‘112’…" maxLength={80} />
          </div>
          <div className="field" style={{ marginBottom: 0 }}>
            <label htmlFor="faq-c">Category</label>
            <select id="faq-c" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">All categories</option>
              {FAQ.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
            </select>
          </div>
        </div>
      </div>

      {results.length === 0 ? (
        <div className="card empty">
          <h2>No questions found</h2>
          <p className="sub" style={{ textAlign: "center" }}>Try a different word or category.</p>
        </div>
      ) : (
        <div className="faq-list">
          {results.map((r, i) => {
            const key = `${r.cat}-${i}`;
            return (
              <div className="card faq-item" key={key}>
                <button className="faq-q" onClick={() => setOpenKey((o) => (o === key ? null : key))}>
                  <span><span className="lib-cat">{r.cat}</span><br />{r.item.q}</span>
                  <span>{openKey === key ? "−" : "+"}</span>
                </button>
                {openKey === key && <div className="faq-a"><p>{r.item.a}</p></div>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
