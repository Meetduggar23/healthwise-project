import { useCallback, useEffect, useState } from "react";
import { api, type ChatTurn } from "../api/client";

export interface ChatMessage extends ChatTurn {
  id: number;
}

export interface StoredConversation {
  id: number;
  title: string;
  messages: ChatMessage[];
  updatedAt: number;
}

const KEY = "healthwise.demo.conversations.v1";

function readConversations(): StoredConversation[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as StoredConversation[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeConversations(list: StoredConversation[]) {
  localStorage.setItem(KEY, JSON.stringify(list));
}

let idCounter = 1;
const nextId = () => idCounter++;

export function useChat() {
  const [conversations, setConversations] = useState<StoredConversation[]>(() =>
    readConversations().sort((a, b) => b.updatedAt - a.updatedAt),
  );
  const [activeId, setActiveId] = useState<number | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const persist = (list: StoredConversation[]) => {
    setConversations([...list].sort((a, b) => b.updatedAt - a.updatedAt));
    writeConversations(list);
  };

  const openConversation = useCallback(
    (id: number) => {
      const conv = readConversations().find((c) => c.id === id);
      setActiveId(id);
      setMessages(conv ? conv.messages : []);
      setError("");
    },
    [],
  );

  const startConversation = useCallback(() => {
    setActiveId(null);
    setMessages([]);
    setError("");
  }, []);

  const removeConversation = useCallback((id: number) => {
    const remaining = readConversations().filter((c) => c.id !== id);
    persist(remaining);
    setActiveId((current) => {
      if (current === id) {
        setMessages([]);
        return null;
      }
      return current;
    });
  }, []);

  const send = useCallback(
    async (text: string, base?: ChatMessage[]) => {
      const content = text.trim();
      if (!content || sending) return;
      setSending(true);
      setError("");

      const userMsg: ChatMessage = { id: nextId(), role: "user", content };
      const newMessages = [...(base ?? messages), userMsg];
      setMessages(newMessages);

      try {
        const turns: ChatTurn[] = newMessages.slice(-12).map((m) => ({
          role: m.role,
          content: m.content,
        }));
        const r = await api.sendChatMessage(turns);
        const assistantMsg: ChatMessage = { id: nextId(), role: "assistant", content: r.reply };
        const finalMessages = [...newMessages, assistantMsg];
        setMessages(finalMessages);

        const all = readConversations();
        const title =
          content.length > 42 ? content.slice(0, 42) + "..." : content;
        if (activeId) {
          const updated = all.map((c) =>
            c.id === activeId ? { ...c, messages: finalMessages, updatedAt: Date.now() } : c,
          );
          persist(updated);
        } else {
          const conv: StoredConversation = {
            id: Date.now(),
            title,
            messages: finalMessages,
            updatedAt: Date.now(),
          };
          persist([conv, ...all]);
          setActiveId(conv.id);
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "Could not send your message.");
        setMessages(newMessages);
      } finally {
        setSending(false);
      }
    },
    [messages, sending, activeId],
  );

  /** Re-attempt the last failed user message without duplicating it. */
  const retry = useCallback(() => {
    if (sending || messages.length === 0) return;
    const last = messages[messages.length - 1];
    if (last.role !== "user") return;
    setError("");
    void send(last.content, messages.slice(0, -1));
  }, [sending, messages, send]);

  useEffect(() => {
    writeConversations(readConversations());
  }, []);

  return {
    conversations,
    activeId,
    messages,
    sending,
    error,
    setError,
    openConversation,
    startConversation,
    removeConversation,
    send,
    retry,
  };
}
