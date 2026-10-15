import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  DISPLAY_ORDER,
  POPULAR_IDS,
  displayCategory,
  fetchTopics,
  readRecentIds,
  rememberTopic,
  searchTopics,
  topicType,
  type LibTopic,
} from "../lib/medicalLibrary";
import { CategoryArt } from "../components/CategoryArt";

const TYPES = ["All types", "Conditions", "Symptoms", "Tests & scans", "Medicines", "First aid & emergency"];

function TopicCard({ t }: { t: LibTopic }) {
  const cat = displayCategory(t) ?? "";
  return (
    <Link to={`/medical-library/${t.id}`} className="card med-card" onClick={() => rememberTopic(t.id)}>
      <div className="med-img med-img-sm">
        <CategoryArt category={cat} label={`${cat} illustration`} />
      </div>
      <div className="med-body">
        <h3>{t.title}</h3>
        <div className="med-generic">{cat}</div>
        <p className="med-desc">{t.body.split("\n")[0].slice(0, 160)}</p>
        <span className="btn btn-outline btn-sm" style={{ marginTop: "auto", alignSelf: "flex-start" }}>
          Read More
        </span>
      </div>
    </Link>
  );
}

export function MedicalLibrary() {
  const navigate = useNavigate();
  const [topics, setTopics] = useState<LibTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("All types");
  const [letter, setLetter] = useState("");
  const [focused, setFocused] = useState(false);
  const blurTimer = useRef<number | null>(null);

  useEffect(() => {
    fetchTopics()
      .then(setTopics)
      .catch((e) => setError(e instanceof Error ? e.message : "Could not load the library."))
      .finally(() => setLoading(false));
  }, []);

  const withCat = useMemo(
    () =>
      topics
        .map((t) => ({ t, cat: displayCategory(t) }))
        .filter((x): x is { t: LibTopic; cat: string } => x.cat !== null),
    [topics],
  );

  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    for (const x of withCat) counts.set(x.cat, (counts.get(x.cat) ?? 0) + 1);
    return DISPLAY_ORDER.filter((c) => counts.has(c)).map((c) => ({ name: c, count: counts.get(c) ?? 0 }));
  }, [withCat]);

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];
    return searchTopics(withCat.map((x) => x.t), q).slice(0, 7);
  }, [query, withCat]);

  const results = useMemo(() => {
    let list = searchTopics(withCat.map((x) => x.t), query);
    if (category) list = list.filter((t) => displayCategory(t) === category);
    if (type !== "All types") list = list.filter((t) => topicType(t, displayCategory(t) ?? "") === type);
    if (letter) list = list.filter((t) => t.title.toUpperCase().startsWith(letter));
    return list;
  }, [withCat, query, category, type, letter]);

  const popular = useMemo(
    () => POPULAR_IDS.map((id) => withCat.find((x) => x.t.id === id)?.t).filter((t): t is LibTopic => Boolean(t)),
    [withCat],
  );
  const recent = useMemo(() => {
    const ids = readRecentIds();
    return ids.map((id) => withCat.find((x) => x.t.id === id)?.t).filter((t): t is LibTopic => Boolean(t));
  }, [withCat]);

  const browsing = query.trim() !== "" || category !== "" || type !== "All types" || letter !== "";
  const reset = () => {
    setQuery("");
    setCategory("");
    setType("All types");
    setLetter("");
  };
  const letters = useMemo(() => {
    const set = new Set(withCat.map((x) => x.t.title.charAt(0).toUpperCase()));
    return [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"].filter((l) => set.has(l));
  }, [withCat]);

  return (
    <div className="page">
      <h1>Medical Library</h1>
      <p className="sub">
        Explore {topics.length > 0 ? `${topics.length} ` : ""}health conditions, symptoms, treatments,
        medicines, and medical tests — the same knowledge that powers the HealthWise AI chatbot.
        Educational information only, not medical advice.
      </p>

      {loading ? (
        <div className="card empty"><p className="sub">Loading the library…</p></div>
      ) : error ? (
        <div className="card empty">
          <h2>Something went wrong</h2>
          <p className="sub" style={{ textAlign: "center" }}>{error}</p>
          <button className="btn" onClick={() => window.location.reload()}>Try Again</button>
        </div>
      ) : (
        <>
          <div className="card" style={{ marginBottom: 18 }}>
            <div className="med-search-row">
              <div className="med-search-wrap">
                <label htmlFor="ml-q" className="sr-only">Search the Medical Library</label>
                <input
                  id="ml-q" value={query} onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => setFocused(true)}
                  onBlur={() => { blurTimer.current = window.setTimeout(() => setFocused(false), 150); }}
                  onKeyDown={(e) => { if (e.key === "Escape") setFocused(false); }}
                  placeholder="Search conditions, symptoms, tests — e.g. pet dard, fever, thyroid…"
                  maxLength={80} autoComplete="off" role="combobox"
                  aria-expanded={focused && suggestions.length > 0} aria-controls="ml-suggest"
                />
                {focused && suggestions.length > 0 && (
                  <ul className="med-suggest" id="ml-suggest" role="listbox">
                    {suggestions.map((t) => (
                      <li key={t.id} role="option" aria-selected="false">
                        <button
                          type="button" onMouseDown={(e) => e.preventDefault()}
                          onClick={() => { rememberTopic(t.id); setFocused(false); navigate(`/medical-library/${t.id}`); }}
                        >
                          <strong>{t.title}</strong>
                          <span> · {displayCategory(t)}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              {browsing && <button className="btn btn-ghost btn-sm" onClick={reset}>Reset</button>}
            </div>
            <div className="med-filter-row">
              <select aria-label="Filter by category" value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="">All categories</option>
                {categories.map((c) => <option key={c.name} value={c.name}>{c.name} ({c.count})</option>)}
              </select>
              <select aria-label="Filter by topic type" value={type} onChange={(e) => setType(e.target.value)}>
                {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          {!browsing && (
            <>
              <h2>Browse by category</h2>
              <div className="cat-grid">
                {categories.map((c) => (
                  <button key={c.name} className="card cat-card" onClick={() => setCategory(c.name)}>
                    <div className="cat-art"><CategoryArt category={c.name} label={`${c.name} illustration`} /></div>
                    <div><strong>{c.name}</strong><div className="muted">{c.count} topics</div></div>
                  </button>
                ))}
                <Link to="/medicines" className="card cat-card">
                  <div className="cat-art"><CategoryArt category="Medicines and Medication Safety" label="Medicines illustration" /></div>
                  <div><strong>Medicine Library →</strong><div className="muted">Detailed medicine guides</div></div>
                </Link>
              </div>

              {recent.length > 0 && (
                <>
                  <h2 style={{ marginTop: 26 }}>Recently viewed</h2>
                  <div className="med-grid">
                    {recent.slice(0, 3).map((t) => <TopicCard key={t.id} t={t} />)}
                  </div>
                </>
              )}

              <h2 style={{ marginTop: 26 }}>Popular topics</h2>
              <div className="med-grid">
                {popular.map((t) => <TopicCard key={t.id} t={t} />)}
              </div>

              <h2 style={{ marginTop: 26 }}>A–Z browsing</h2>
              <div className="chip-row">
                {letters.map((l) => (
                  <button key={l} className="chip-btn" onClick={() => setLetter(l)}>{l}</button>
                ))}
              </div>
            </>
          )}

          {browsing && (
            <>
              <h2>Results ({results.length}){letter ? ` — “${letter}”` : ""}</h2>
              {results.length === 0 ? (
                <div className="card empty">
                  <h2>No topics found</h2>
                  <p className="sub" style={{ textAlign: "center" }}>
                    Nothing matches “{query}”. Try English, Hindi, or Hinglish words like
                    “bukhar”, “pet dard”, or “thyroid”.
                  </p>
                  <button className="btn btn-outline" onClick={reset}>Clear search &amp; filters</button>
                </div>
              ) : (
                <div className="med-grid">
                  {results.map((t) => <TopicCard key={t.id} t={t} />)}
                </div>
              )}
            </>
          )}

          <div className="alert alert-info" style={{ marginTop: 24 }}>
            Educational information only — the same knowledge the chatbot uses, not a diagnosis.
            In an emergency call <a href="tel:112">112</a>.
          </div>
        </>
      )}
    </div>
  );
}
