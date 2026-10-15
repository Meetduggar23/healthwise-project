import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useChat } from "../components/useChat";
import { renderChatHtml } from "../components/chatMarkdown";

const SUGGESTIONS = [
  "What could cause my headache?",
  "How can I improve my sleep?",
  "Explain common fever symptoms.",
  "When should I seek medical help?",
];

export function ChatPage() {
  const chat = useChat();
  const [draft, setDraft] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [params, setParams] = useSearchParams();
  const askedRef = useRef(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const stickRef = useRef(true);
  const areaRef = useRef<HTMLTextAreaElement>(null);

  // Deep link (e.g. from the Medicine Library): auto-send ?q= once.
  useEffect(() => {
    const q = params.get("q");
    if (q && !askedRef.current && !chat.sending && chat.messages.length === 0) {
      askedRef.current = true;
      chat.send(q);
      setParams({}, { replace: true });
    }
  });

  // Stick to the bottom only while the user is already near it.
  useEffect(() => {
    if (stickRef.current) {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [chat.messages, chat.sending]);

  const onScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    stickRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < 120;
  };

  const autogrow = () => {
    const el = areaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  };

  const doSend = (text: string) => {
    const content = text.trim();
    if (!content || chat.sending) return;
    stickRef.current = true;
    chat.send(content);
    setDraft("");
    requestAnimationFrame(autogrow);
    setSidebarOpen(false);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      doSend(draft);
    }
  };

  const empty = chat.messages.length === 0 && !chat.sending;

  return (
    <div className="gpt-wrap">
      <aside className={`gpt-side${sidebarOpen ? " open" : ""}`}>
        <button className="btn btn-sm" onClick={() => { chat.startConversation(); setSidebarOpen(false); }}>
          + New chat
        </button>
        <div className="gpt-convs">
          {chat.conversations.map((c) => (
            <div
              key={c.id}
              className={`gpt-conv${c.id === chat.activeId ? " active" : ""}`}
              onClick={() => { chat.openConversation(c.id); setSidebarOpen(false); }}
            >
              <span className="t">{c.title}</span>
              <button
                className="x" aria-label="Delete conversation"
                onClick={(e) => { e.stopPropagation(); chat.removeConversation(c.id); }}
              >
                ×
              </button>
            </div>
          ))}
          {chat.conversations.length === 0 && (
            <div className="gpt-conv-empty">No conversations yet.</div>
          )}
        </div>
        <div className="gpt-side-foot">
          <Link to="/emergency" onClick={() => setSidebarOpen(false)}>Emergency Help</Link>
        </div>
      </aside>
      {sidebarOpen && <div className="gpt-scrim" onClick={() => setSidebarOpen(false)} />}

      <div className="gpt-main">
        <div className="gpt-topbar">
          <button className="btn btn-ghost btn-sm" onClick={() => setSidebarOpen((o) => !o)} aria-label="Toggle conversations">
            ☰
          </button>
          <span className="gpt-title">HealthWise AI</span>
        </div>

        <div className="gpt-scroll" ref={scrollRef} onScroll={onScroll}>
          <div className="gpt-thread">
            {empty ? (
              <div className="gpt-welcome">
                <img src="/logo.png" alt="HealthWise" />
                <h1>How can HealthWise help you today?</h1>
                <p>Ask about symptoms, conditions, nutrition, medicines, or which specialist to see — in English, Hindi, or Hinglish.</p>
                <div className="gpt-suggest">
                  {SUGGESTIONS.map((s) => (
                    <button key={s} onClick={() => doSend(s)} disabled={chat.sending}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {chat.messages.map((m) =>
                  m.role === "user" ? (
                    <div key={m.id} className="gpt-row user">
                      <div className="gpt-bubble">{m.content}</div>
                    </div>
                  ) : (
                    <div key={m.id} className="gpt-row bot">
                      <div className="gpt-answer" dangerouslySetInnerHTML={{ __html: renderChatHtml(m.content) }} />
                    </div>
                  ),
                )}
                {chat.sending && (
                  <div className="gpt-row bot">
                    <div className="gpt-answer">
                      <span className="typing"><span /><span /><span /></span>
                    </div>
                  </div>
                )}
                {chat.error && (
                  <div className="gpt-error" role="alert">
                    <span>{chat.error}</span>
                    <span className="gpt-error-actions">
                      <button className="btn btn-sm" onClick={() => { stickRef.current = true; chat.retry(); }}>Retry</button>
                      <button className="btn btn-ghost btn-sm" onClick={() => chat.setError("")}>Dismiss</button>
                    </span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <div className="gpt-composer-zone">
          <form
            className="gpt-composer"
            onSubmit={(e) => { e.preventDefault(); doSend(draft); }}
          >
            <textarea
              ref={areaRef}
              value={draft}
              rows={1}
              onChange={(e) => { setDraft(e.target.value); autogrow(); }}
              onKeyDown={onKeyDown}
              placeholder="Ask a health question…"
              maxLength={2000}
              aria-label="Type your message"
            />
            <button className="gpt-send" type="submit" disabled={chat.sending || !draft.trim()} aria-label="Send message">
              {chat.sending ? <span className="spinner" /> : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="12" y1="19" x2="12" y2="5" />
                  <polyline points="5 12 12 5 19 12" />
                </svg>
              )}
            </button>
          </form>
          <div className="gpt-note">
            HealthWise provides general health information and does not replace professional medical advice.
          </div>
        </div>
      </div>
    </div>
  );
}
