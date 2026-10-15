import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { LIBRARY } from "../data/healthContent";
import {
  displayCategory,
  fetchTopics,
  searchTopics,
  type LibTopic,
} from "../lib/medicalLibrary";
import { TopicImage } from "../components/TopicImage";

const GUIDE_IMG: Record<string, string> = {
  specialties: "General Health and Preventive Care",
  tests: "Medical Tests and Diagnostics",
  "first-aid": "First Aid and Emergency Care",
  prevention: "Vaccination and Immunization",
  lifestyle: "General Health and Preventive Care",
  terms: "General Health and Preventive Care",
};

export function HealthLibrary() {
  const location = useLocation();
  const isMedicalLibrary = location.pathname.startsWith("/medical-library");
  const libraryPath = location.pathname.startsWith("/medical-library") ? "/medical-library" : "/library";
  const [tab, setTab] = useState<"guide" | "topics">(isMedicalLibrary ? "topics" : "guide");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [topics, setTopics] = useState<LibTopic[]>([]);
  const [topicsError, setTopicsError] = useState("");
  const [topicsLoading, setTopicsLoading] = useState(true);
  const [letter, setLetter] = useState("");

  const resetFilters = useCallback(() => {
    setQuery("");
    setCategory("");
    setLetter("");
  }, []);

  useEffect(() => {
    setTab(isMedicalLibrary ? "topics" : "guide");
    resetFilters();
  }, [isMedicalLibrary, resetFilters]);

  useEffect(() => {
    fetchTopics()
      .then(setTopics)
      .catch((e) => setTopicsError(e instanceof Error ? e.message : "Could not load topics."))
      .finally(() => setTopicsLoading(false));
  }, []);

  const guideResults = useMemo(() => {
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
        .map((e) => ({ cat: c.title, catId: c.id, entry: e })),
    );
  }, [query, category]);

  const topicResults = useMemo(() => {
    let list = searchTopics(
      topics.filter((t) => displayCategory(t) !== null),
      query,
    );
    if (category) {
      list = list.filter((t) => displayCategory(t) === category);
    }
    if (letter) list = list.filter((t) => t.title.toUpperCase().startsWith(letter));
    return list;
  }, [topics, query, category, letter]);

  const letters = useMemo(() => {
    const set = new Set(topics.map((t) => t.title.charAt(0).toUpperCase()));
    return [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"].filter((l) => set.has(l));
  }, [topics]);

  const reset = resetFilters;

  return (
    <div className="page">
      <h1>{isMedicalLibrary ? "Medicine Information Library" : "Health Library"}</h1>
      <p className="sub">
        Searchable health education in English, Hindi, and Hinglish — curated guides plus
        every medical topic from the HealthWise chatbot knowledge base. General information only.
      </p>

      <div className="tabs" style={{ marginBottom: 16 }}>
        <button className={tab === "guide" ? "active" : ""} onClick={() => { setTab("guide"); reset(); }}>
          Health Guide
        </button>
        <button className={tab === "topics" ? "active" : ""} onClick={() => { setTab("topics"); reset(); }}>
          Medical Topics
        </button>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <div className="field-row">
          <div className="field" style={{ marginBottom: 0 }}>
            <label htmlFor="lib-q" data-testid="ml-q">Search</label>
            <input id="lib-q" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Try ‘thyroid’, ‘bukhar’, ‘vaccine’…" maxLength={80} />
          </div>
          <div className="field" style={{ marginBottom: 0 }}>
            <label htmlFor="lib-c">Category</label>
            <select id="lib-c" value={category} onChange={(e) => { setCategory(e.target.value); setLetter(""); }}>
              <option value="">All categories</option>
              {tab === "guide"
                ? LIBRARY.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)
                : [...new Set(topics.map((t) => displayCategory(t)).filter((c): c is string => c !== null))].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
            </select>
          </div>
        </div>
        {(query || category || letter) && (
          <div style={{ marginTop: 10 }}>
            <button className="btn btn-ghost btn-sm" onClick={reset}>Reset</button>
          </div>
        )}
      </div>

      {tab === "guide" ? (
        guideResults.length === 0 ? (
          <div className="card empty">
            <h2>No matches</h2>
            <p className="sub" style={{ textAlign: "center" }}>Try a different word or clear the search.</p>
          </div>
        ) : (
          <div className="lib-grid cat-grid">
            {guideResults.map((r, i) => (
              <div className="card lib-card" key={`${r.entry.title}-${i}`}>
                <div className="lib-card-top">
                  <div className="cat-art cat-art-sm">
                    <TopicImage category={GUIDE_IMG[r.catId] ?? "General Health and Preventive Care"} label={`${r.cat} illustration`} />
                  </div>
                  <div>
                    <div className="lib-cat">{r.cat}</div>
                    <h3>{r.entry.title}</h3>
                  </div>
                </div>
                <p>{r.entry.en}</p>
                {r.entry.hi && <p className="lib-hi">{r.entry.hi}</p>}
                {r.entry.hinglish && <p className="lib-hi">{r.entry.hinglish}</p>}
              </div>
            ))}
          </div>
        )
      ) : topicsLoading ? (
        <div className="card empty">
          <p className="sub">Loading medical topics…</p>
        </div>
      ) : topicsError ? (
        <div className="card empty">
          <h2>Something went wrong</h2>
          <p className="sub" style={{ textAlign: "center" }}>{topicsError}</p>
          <button className="btn" onClick={() => window.location.reload()}>Try Again</button>
        </div>
      ) : (
        <>
          {topicResults.length === 0 ? (
            <div className="card empty">
              <h2>No topics found</h2>
              <p className="sub" style={{ textAlign: "center" }}>Try “pet dard”, “fever”, or “thyroid”.</p>
              <button className="btn btn-outline" onClick={reset}>Clear search &amp; filters</button>
            </div>
          ) : (
            <div className="med-grid">
              {topicResults.slice(0, 24).map((t) => {
                const cat = displayCategory(t) ?? "";
                return (
                  <Link key={t.id} to={`${libraryPath}/topic/${t.id}`} className="card med-card">
                    <div className="med-img med-img-sm">
                      <TopicImage category={cat} label={`${cat} illustration`} />
                    </div>
                    <div className="med-body">
                      <h3>{t.title}</h3>
                      <div className="med-generic">{cat}</div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
          {topicResults.length > 24 && (
            <p className="sub" style={{ marginTop: 12 }}>Showing 24 of {topicResults.length} — refine your search to narrow down.</p>
          )}
          <h2 style={{ marginTop: 26 }}>A–Z browsing</h2>
          <div className="chip-row">
            {letters.map((l) => (
              <button key={l} className={`chip-btn${letter === l ? " active" : ""}`} onClick={() => setLetter(letter === l ? "" : l)}>{l}</button>
            ))}
          </div>
        </>
      )}

      <div className="alert alert-info" style={{ marginTop: 24 }}>
        Educational information only — not a diagnosis. In an emergency call <a href="tel:112">112</a>.
      </div>
    </div>
  );
}
