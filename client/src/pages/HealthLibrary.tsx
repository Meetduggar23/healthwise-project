import { useMemo, useState } from "react";
import { LIBRARY } from "../data/healthContent";

export function HealthLibrary() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return LIBRARY.filter((c) => !category || c.id === category).flatMap((c) =>
      c.entries
        .filter(
          (e) =>
            !q ||
            e.title.toLowerCase().includes(q) ||
            e.en.toLowerCase().includes(q) ||
            (e.hi ?? "").includes(query.trim()) ||
            (e.hinglish ?? "").toLowerCase().includes(q) ||
            e.tags.some((t) => t.includes(q)),
        )
        .map((e) => ({ cat: c.title, entry: e })),
    );
  }, [query, category]);

  return (
    <div className="page">
      <h1>Health Library</h1>
      <p className="sub">
        Searchable health education in English, Hindi, and Hinglish — curated from the
        HealthWise knowledge curriculum. General information only.
      </p>
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="field-row">
          <div className="field" style={{ marginBottom: 0 }}>
            <label htmlFor="lib-q">Search</label>
            <input id="lib-q" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Try ‘thyroid’, ‘bukhar’, ‘vaccine’…" maxLength={80} />
          </div>
          <div className="field" style={{ marginBottom: 0 }}>
            <label htmlFor="lib-c">Category</label>
            <select id="lib-c" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">All categories</option>
              {LIBRARY.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
            </select>
          </div>
        </div>
      </div>

      {results.length === 0 ? (
        <div className="card empty">
          <h2>No matches</h2>
          <p className="sub" style={{ textAlign: "center" }}>Try a different word or clear the search.</p>
        </div>
      ) : (
        <div className="lib-grid">
          {results.map((r, i) => (
            <div className="card lib-card" key={`${r.entry.title}-${i}`}>
              <div className="lib-cat">{r.cat}</div>
              <h3>{r.entry.title}</h3>
              <p>{r.entry.en}</p>
              {r.entry.hi && <p className="lib-hi">{r.entry.hi}</p>}
              {r.entry.hinglish && <p className="lib-hi">{r.entry.hinglish}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
