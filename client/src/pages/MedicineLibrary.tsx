import { useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MEDICINES, MEDICINE_CATEGORIES, type MedicineEntry } from "../data/medicines";
import { MedicineImage } from "../components/MedicineImage";

const PAGE_SIZE = 9;
const RECENT_KEY = "healthwise.med.recent.v1";

function readRecent(): string[] {
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    const parsed = JSON.parse(raw ?? "[]") as string[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function matchScore(m: MedicineEntry, q: string): number {
  const query = q.trim().toLowerCase();
  if (!query) return 1;
  const words = query.split(/\s+/);
  let score = 0;
  const hay = {
    name: m.name.toLowerCase(),
    generic: m.generic.toLowerCase(),
    brands: m.brands.join(" ").toLowerCase(),
    uses: m.uses.join(" ").toLowerCase(),
    cats: m.categories.join(" ").toLowerCase(),
    keys: m.keywords.join(" ").toLowerCase(),
  };
  for (const w of words) {
    if (hay.name.includes(w)) score += 5;
    if (hay.generic.includes(w)) score += 4;
    if (hay.brands.includes(w)) score += 4;
    if (hay.keys.includes(w)) score += 3;
    if (hay.uses.includes(w)) score += 2;
    if (hay.cats.includes(w)) score += 1;
  }
  return score;
}

export function MedicineCard({ m }: { m: MedicineEntry }) {
  return (
    <article className="card med-card">
      <div className="med-img">
        <MedicineImage url={m.imageUrl} alt={m.imageAlt} form={m.forms[0] ?? "tablet"} />
      </div>
      <div className="med-body">
        <h3>{m.name}</h3>
        <div className="med-generic">{m.generic}</div>
        <p className="med-desc">{m.summary}</p>
        <div className="chip-row">
          {m.categories.slice(0, 2).map((c) => (
            <span key={c} className="chip">{c}</span>
          ))}
        </div>
        <Link to={`/medicines/${m.id}`} className="btn btn-outline btn-sm" style={{ marginTop: 12 }}>
          View Details
        </Link>
      </div>
    </article>
  );
}

export function MedicineLibrary() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [focused, setFocused] = useState(false);
  const blurTimer = useRef<number | null>(null);

  const results = useMemo(() => {
    const q = query.trim();
    return MEDICINES.filter((m) => !category || m.categories.includes(category))
      .map((m) => ({ m, s: matchScore(m, q) }))
      .filter((x) => !q || x.s > 0)
      .sort((a, b) => b.s - a.s || a.m.name.localeCompare(b.m.name))
      .map((x) => x.m);
  }, [query, category]);

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];
    return MEDICINES.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.generic.toLowerCase().includes(q) ||
        m.brands.some((b) => b.toLowerCase().includes(q)) ||
        m.keywords.some((k) => k.toLowerCase().includes(q)),
    ).slice(0, 6);
  }, [query]);

  const featured = useMemo(() => MEDICINES.filter((m) => m.featured), []);
  const recent = useMemo(() => {
    const ids = readRecent();
    return ids.map((id) => MEDICINES.find((m) => m.id === id)).filter((m): m is MedicineEntry => Boolean(m));
  }, [query, category]);

  const reset = () => {
    setQuery("");
    setCategory("");
    setVisible(PAGE_SIZE);
  };

  const shown = results.slice(0, visible);
  const browsing = query.trim() !== "" || category !== "";

  return (
    <div className="page">
      <h1>Medicine Information Library</h1>
      <p className="sub">
        General educational information about common medicines — what they are for, how they
        work, side effects, precautions, and safe use. Not prescriptions and not personal
        medical advice. Always consult your doctor or pharmacist.
      </p>

      <div className="card" style={{ marginBottom: 18 }}>
        <div className="med-search-row">
          <div className="med-search-wrap">
            <label htmlFor="med-q" className="sr-only">Search medicines</label>
            <input
              id="med-q"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setVisible(PAGE_SIZE); }}
              onFocus={() => setFocused(true)}
              onBlur={() => { blurTimer.current = window.setTimeout(() => setFocused(false), 150); }}
              onKeyDown={(e) => { if (e.key === "Escape") setFocused(false); }}
              placeholder="Search brand, generic name, or use — e.g. crocin, antibiotic, bp…"
              maxLength={80}
              autoComplete="off"
              role="combobox"
              aria-expanded={focused && suggestions.length > 0}
              aria-controls="med-suggest"
            />
            {focused && suggestions.length > 0 && (
              <ul className="med-suggest" id="med-suggest" role="listbox">
                {suggestions.map((m) => (
                  <li key={m.id} role="option" aria-selected="false">
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => { setFocused(false); navigate(`/medicines/${m.id}`); }}
                    >
                      <strong>{m.name}</strong>
                      <span> · {m.generic}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {(query || category) && (
            <button className="btn btn-ghost btn-sm" onClick={reset}>Reset</button>
          )}
        </div>
        <div className="chip-row" style={{ marginTop: 12 }}>
          <button className={`chip-btn${category === "" ? " active" : ""}`} onClick={() => { setCategory(""); setVisible(PAGE_SIZE); }}>
            All ({MEDICINES.length})
          </button>
          {MEDICINE_CATEGORIES.map((c) => {
            const n = MEDICINES.filter((m) => m.categories.includes(c)).length;
            if (n === 0) return null;
            return (
              <button
                key={c}
                className={`chip-btn${category === c ? " active" : ""}`}
                onClick={() => { setCategory(category === c ? "" : c); setVisible(PAGE_SIZE); }}
              >
                {c} ({n})
              </button>
            );
          })}
        </div>
      </div>

      {!browsing && recent.length > 0 && (
        <>
          <h2>Recently viewed</h2>
          <div className="med-grid" style={{ marginBottom: 26 }}>
            {recent.map((m) => <MedicineCard key={m.id} m={m} />)}
          </div>
        </>
      )}

      {!browsing && (
        <>
          <h2>Featured medicines</h2>
          <div className="med-grid" style={{ marginBottom: 26 }}>
            {featured.map((m) => <MedicineCard key={m.id} m={m} />)}
          </div>
        </>
      )}

      <h2>{browsing ? `Results (${results.length})` : "All medicines"}</h2>
      {results.length === 0 ? (
        <div className="card empty">
          <h2>No medicines found</h2>
          <p className="sub" style={{ textAlign: "center" }}>
            Nothing matches “{query}”{category ? ` in ${category}` : ""}. Try a generic name
            (e.g. paracetamol), a brand (e.g. crocin), or a use (e.g. fever, bp, allergy).
          </p>
          <button className="btn btn-outline" onClick={reset}>Clear search &amp; filters</button>
        </div>
      ) : (
        <>
          <div className="med-grid">
            {(browsing ? shown : MEDICINES).map((m) => <MedicineCard key={m.id} m={m} />)}
          </div>
          {browsing && visible < results.length && (
            <div style={{ textAlign: "center", marginTop: 20 }}>
              <p className="sub">Showing {shown.length} of {results.length}</p>
              <button className="btn btn-outline" onClick={() => setVisible((v) => v + PAGE_SIZE)}>
                Load More
              </button>
            </div>
          )}
        </>
      )}

      <div className="alert alert-info" style={{ marginTop: 24 }}>
        Educational information only — not a prescription. Medicines can have
        contraindications and interactions. Consult your doctor or pharmacist for personal
        decisions. In an emergency (overdose, severe allergy), call <a href="tel:112">112</a>.
      </div>
    </div>
  );
}
