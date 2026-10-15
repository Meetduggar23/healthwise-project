import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useChat, type ChatMessage } from "./useChat";
import { renderChatHtml } from "./chatMarkdown";

function ChatIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

export function Messages({ messages, sending }: { messages: ChatMessage[]; sending: boolean }) {
  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  return (
    <div className="chat-messages">
      {messages.length === 0 && !sending && (
        <div className="msg msg-bot">
          <p><strong>Hello! I'm HealthWise AI.</strong></p>
          <p>Ask me about symptoms, common conditions, nutrition, fitness, first aid, medicines, or which specialist to see. How can I help?</p>
        </div>
      )}
      {messages.map((m) =>
        m.role === "user" ? (
          <div key={m.id} className="msg msg-user">{m.content}</div>
        ) : (
          <div key={m.id} className="msg msg-bot" dangerouslySetInnerHTML={{ __html: renderChatHtml(m.content) }} />
        ),
      )}
      {sending && (
        <div className="msg msg-bot">
          <span className="typing"><span /><span /><span /></span>
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  );
}

export function ChatWidget() {
  // Free to use without login — no account required to ask health questions.
  // Hidden on the full chat page itself (the page is the interface there).
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const chat = useChat();
  const { pathname } = useLocation();
  if (pathname === "/chat") return null;

  return (
    <>
      <button className="chat-fab" onClick={() => setOpen((o) => !o)} aria-label="Open AI medical chatbot">
        {open ? <span style={{ fontSize: "1.4rem" }}>×</span> : <ChatIcon />}
      </button>
      {open && (
        <div className="chat-panel" role="dialog" aria-label="HealthWise AI chatbot">
          <div className="chat-head">
            <img src="/logo.png" alt="" />
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
            <button className="btn" type="submit" disabled={chat.sending || !draft.trim()} style={{ borderRadius: 999 }} aria-label="Send message">
              {chat.sending ? <span className="spinner" /> : <SendIcon />}
            </button>
          </form>
          <div className="chat-disclaimer">
            General information only — not medical advice. In an emergency, call 112 (India) or open <Link to="/emergency">Emergency Help</Link>.
          </div>
        </div>
      )}
    </>
  );
}
