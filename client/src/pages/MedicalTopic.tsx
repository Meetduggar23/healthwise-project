import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import {
  SOURCE_URLS,
  displayCategory,
  fetchTopics,
  rememberTopic,
  parseSections,
  type LibTopic,
} from "../lib/medicalLibrary";
import { TopicImage } from "../components/TopicImage";
import { renderChatHtml } from "../components/chatMarkdown";

export function MedicalTopic() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const isMedicalLibrary = location.pathname.startsWith("/medical-library");
  const libraryPath = isMedicalLibrary ? "/medical-library" : "/library";
  const libraryLabel = isMedicalLibrary ? "Medicine Information Library" : "Health Library";
  const [topics, setTopics] = useState<LibTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTopics()
      .then(setTopics)
      .catch((e) => setError(e instanceof Error ? e.message : "Could not load the topic."))
      .finally(() => setLoading(false));
  }, []);

  const topic = topics.find((t) => t.id === id);

  useEffect(() => {
    if (topic) {
      rememberTopic(topic.id);
      window.scrollTo(0, 0);
    }
  }, [topic?.id]);

  const sections = useMemo(() => (topic ? parseSections(topic.body) : []), [topic]);
  const related = useMemo(() => {
    if (!topic) return [];
    const cat = displayCategory(topic);
    return topics.filter((t) => t.id !== topic.id && displayCategory(t) === cat).slice(0, 6);
  }, [topics, topic]);

  if (loading) {
    return (
      <div className="page">
        <div className="card empty"><p className="sub">Loading topic…</p></div>
      </div>
    );
  }
  if (error || !topic) {
    return (
      <div className="page">
        <div className="card empty">
          <h2>{error ? "Something went wrong" : "Topic not found"}</h2>
          <p className="sub" style={{ textAlign: "center" }}>
            {error || "This entry does not exist in the library."}
          </p>
          <Link to={libraryPath} className="btn">Back to {libraryLabel}</Link>
        </div>
      </div>
    );
  }

  const cat = displayCategory(topic) ?? "";
  const askQ = encodeURIComponent(`Tell me about "${topic.title}" in simple words`);
  const keywords = topic.keywords.filter((k) => !/^[a-z]{1,3}$/i.test(k)).slice(0, 12);

  return (
    <div className="page">
      <Link to={libraryPath} className="btn btn-ghost btn-sm" style={{ marginBottom: 14 }}>← {libraryLabel}</Link>

      <div className="card med-hero">
        <div className="med-hero-img-auto">
          <TopicImage category={cat} label={`${cat} illustration`} showCredit />
        </div>
        <div>
          <div className="chip-row">
            <span className="chip">{cat}</span>
            {keywords.slice(0, 4).map((k) => <span key={k} className="chip chip-plain">{k}</span>)}
          </div>
          <h1 style={{ marginTop: 8 }}>{topic.title}</h1>
          <p className="sub" style={{ marginBottom: 8 }}>
            Also searched as: {keywords.slice(0, 6).join(" · ")}
          </p>
          <div style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
            <Link to={`/chat?q=${askQ}`} className="btn btn-sm">Ask HealthWise AI about this topic</Link>
          </div>
        </div>
      </div>

      <div className="med-detail-grid">
        <nav className="card med-toc" aria-label="On this page">
          <strong>On this page</strong>
          <ol>
            {sections.map((s, i) => (
              <li key={i}><a href={`#sec-${i}`}>{s.heading ?? "Overview"}</a></li>
            ))}
            <li><a href="#sec-refs">References</a></li>
            <li><a href="#sec-related">Related topics</a></li>
          </ol>
        </nav>

        <div className="card med-article">
          {sections.map((s, i) => (
            <section key={i} id={`sec-${i}`} className="med-section">
              {s.heading && <h2>{s.heading}</h2>}
              {s.lines.map((line, j) =>
                line.startsWith("- ") ? null : (
                  <div key={j} className="med-para" dangerouslySetInnerHTML={{ __html: renderChatHtml(line) }} />
                ),
              )}
              {s.lines.some((l) => l.startsWith("- ")) && (
                <ul className="prep-list">
                  {s.lines.filter((l) => l.startsWith("- ")).map((l, j) => (
                    <li key={j} dangerouslySetInnerHTML={{ __html: renderChatHtml(l.slice(2)) }} />
                  ))}
                </ul>
              )}
            </section>
          ))}

          <section id="sec-refs" className="med-section">
            <h2>References and sources</h2>
            {topic.sources.length > 0 ? (
              <ul className="prep-list">
                {topic.sources.map((s) => (
                  <li key={s}>
                    {SOURCE_URLS[s] ? (
                      <a href={SOURCE_URLS[s]} target="_blank" rel="noopener noreferrer">{s}</a>
                    ) : s}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="med-para">General health-education content from the HealthWise knowledge base. No invented citations.</p>
            )}
          </section>

          <section id="sec-related" className="med-section">
            <h2>Related topics</h2>
            {related.length > 0 ? (
              <div className="chip-row">
                {related.map((r) => (
                  <Link key={r.id} to={`${libraryPath}/topic/${r.id}`} className="chip-btn">{r.title}</Link>
                ))}
              </div>
            ) : (
              <p className="med-para">No closely related topics in this category yet.</p>
            )}
            <div style={{ marginTop: 14 }}>
              <Link to="/medicines" className="btn btn-outline btn-sm">Explore the Medicine Library →</Link>
            </div>
          </section>

          <div className="alert alert-info" style={{ marginTop: 20, marginBottom: 0 }}>
            Educational information only — an article or illustration never confirms a diagnosis.
            For personal advice consult a qualified professional. In an emergency call <a href="tel:112">112</a>.
          </div>
        </div>
      </div>
    </div>
  );
}
