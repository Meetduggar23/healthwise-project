import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useChat } from "../components/useChat";
import { Messages } from "../components/ChatWidget";

export function ChatPage() {
  const chat = useChat();
  const [draft, setDraft] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [params, setParams] = useSearchParams();
  const askedRef = useRef(false);

  // Deep link from the Medicine Library ("Ask AI about X"): auto-send ?q= once.
  useEffect(() => {
    const q = params.get("q");
    if (q && !askedRef.current && !chat.sending && chat.messages.length === 0) {
      askedRef.current = true;
      chat.send(q);
      setParams({}, { replace: true });
    }
  });

  return (
    <div className="page">
      <h1>AI Medical Chatbot</h1>
      <p className="sub">
        Chat with HealthWise AI about general health topics. Your conversations are saved in this browser.
      </p>
      <div className="chat-layout" style={{ position: "relative" }}>
        <aside className={`chat-sidebar ${sidebarOpen ? "open" : ""}`}>
          <header>
            <strong>Conversations</strong>
            <button
              className="btn btn-sm"
              onClick={() => { chat.startConversation(); setSidebarOpen(false); }}
            >
              + New chat
            </button>
          </header>
          <div className="conv-list">
            {chat.conversations.map((c) => (
              <div
                key={c.id}
                className={`conv-item ${c.id === chat.activeId ? "active" : ""}`}
                onClick={() => { chat.openConversation(c.id); setSidebarOpen(false); }}
              >
                <span className="t">{c.title}</span>
                <button
                  className="x"
                  aria-label="Delete conversation"
                  onClick={(e) => { e.stopPropagation(); chat.removeConversation(c.id); }}
                >
                  ×
                </button>
              </div>
            ))}
            {chat.conversations.length === 0 && (
              <div style={{ padding: 16, color: "var(--muted)", fontSize: "0.9rem" }}>
                No conversations yet. Start a new chat!
              </div>
            )}
          </div>
        </aside>

        <div className="chat-main">
          <div className="chat-head">
            <button className="btn btn-ghost btn-sm" onClick={() => setSidebarOpen((o) => !o)} aria-label="Toggle conversations">
              ☰
            </button>
            <img src="/logo.png" alt="HealthWise" />
            <div>
              <div className="name">HealthWise AI</div>
              <div className="tag">Online — health information assistant</div>
            </div>
          </div>
          <Messages messages={chat.messages} sending={chat.sending} />
          {chat.error && <div className="alert alert-error" style={{ margin: 10 }}>{chat.error}</div>}
          <form
            className="chat-input"
            onSubmit={(e) => {
              e.preventDefault();
              chat.send(draft);
              setDraft("");
            }}
          >
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Ask a health question…"
              maxLength={2000}
              aria-label="Type your message"
            />
            <button className="btn" type="submit" disabled={chat.sending || !draft.trim()}>
              {chat.sending ? <span className="spinner" /> : "Send"}
            </button>
          </form>
          <div className="chat-disclaimer">
            General information only — not medical advice. In an emergency, call 112 (India) or open <Link to="/emergency">Emergency Help</Link>.
          </div>
        </div>
      </div>
    </div>
  );
}
