import { Router } from "express";
import rateLimit from "express-rate-limit";
import { z } from "zod";
import { env } from "./env.js";
import {
  SYSTEM_PROMPT,
  MEDICAL_KNOWLEDGE,
  DISCLAIMER,
  findTopics,
  getRelevantTopics,
  detectLanguage,
  isEmergency,
  knowledgeContext,
} from "./knowledge.js";
import { findMedicineBriefs, medicineBriefBlock } from "./medicineBriefs.js";

// Public endpoint: the chatbot is free to use without login. No personal
// data is involved, abuse is curbed by rate limiting, and the AI provider
// key stays on the backend.
export const chatbotRouter = Router();

// Gentle rate limit on message sending (per IP).
const messageLimiter = rateLimit({ windowMs: 60_000, max: 30, standardHeaders: true });

// ---------- Offline fallback responder (used when no AI key is configured) ----------

const FOLLOW_UP_RE = /\b(aur batao|aur jankari|more|tell me more|detail|explain more|iska matlab|samjhao|समझाओ)\b/;

function replyInLanguage(lang: string, en: string, hinglish: string, hindi: string): string {
  if (lang === "hi") return hindi;
  if (lang === "hinglish" || lang === "mixed") return hinglish;
  return en;
}

export function fallbackReply(text: string, priorUserTexts: string[] = []): string {
  const trimmed = text.trim();
  if (isEmergency(trimmed)) {
    return MEDICAL_KNOWLEDGE.find((t) => t.id === "emergency")!.body;
  }
  const lang = detectLanguage(trimmed);
  const lower = trimmed.toLowerCase();
  const normLen = trimmed.replace(/\s+/g, " ").length;
  if (/^(hi|hello|hey|namaste|namaskar|satsriakal|good (morning|afternoon|evening)|ram ram)\b/.test(lower) && normLen < 30) {
    return replyInLanguage(
      lang,
      `Hello! I'm **HealthWise AI**, your health information assistant. I can explain symptoms and conditions across heart, brain, kidney, liver, lungs, hormones, infections, bones, ENT, eyes, skin, and more — in English, Hindi, or Hinglish.\n\nWhat would you like to know about?`,
      `Namaste! Main **HealthWise AI** hoon — dil, dimaag, kidney, liver, lungs, hormones, infection, haddi-jod, ENT, aankh, skin aur bhi kai topics par general health jankari de sakta hoon, Hindi, English ya Hinglish me.\n\nAap kya janna chahte hain?`,
      `नमस्ते! मैं **HealthWise AI** हूँ — हृदय, मस्तिष्क, किडनी, लिवर, फेफड़े, हार्मोन, संक्रमण, हड्डी-जोड़, ENT, आंख, त्वचा और कई विषयों पर सामान्य स्वास्थ्य जानकारी दे सकता हूँ।\n\nआप क्या जानना चाहते हैं?`,
    );
  }
  if (/\b(thank|thanks|shukriya|dhanyavad|धन्यवाद)\b/.test(lower)) {
    return replyInLanguage(
      lang,
      `You're welcome! Take care of your health. If anything worries you, don't hesitate to ask — or consult a qualified doctor.`,
      `Koi baat nahi! Apna khayal rakhiye. Agar koi chinta ho to zaroor poochhiye — ya kisi qualified doctor se salah lijiye.`,
      `कोई बात नहीं! अपना ख्याल रखिए। अगर कोई चिंता हो तो ज़रूर पूछिए — या किसी योग्य डॉक्टर से सलाह लीजिए।`,
    );
  }
  // Follow-up relying on conversation context ("aur batao", "tell me more").
  let topics = findTopics(trimmed, 2);
  if (topics.length === 0 && FOLLOW_UP_RE.test(lower)) {
    topics = getRelevantTopics(trimmed, priorUserTexts, 2);
    if (topics.length === 0 && priorUserTexts.length > 0) {
      topics = findTopics(priorUserTexts[priorUserTexts.length - 1], 2);
    }
  }
  // Multi-topic queries: ranked retrieval may return 2 topics; join both.
  // Medicine names additionally pull shared Medicine Library briefs so the
  // chatbot and the library stay consistent (same ids, names, safety lines).
  const briefs = findMedicineBriefs(trimmed, 2);
  if (briefs.length > 0) {
    const briefBody = briefs.map(medicineBriefBlock).join("\n\n---\n\n");
    const topicBody = topics.length > 0 ? `\n\n---\n\n${topics.map((t) => t.body).join("\n\n---\n\n")}` : "";
    return `${briefBody}${topicBody}\n\n_${DISCLAIMER}_`;
  }
  if (topics.length > 0) {
    const body = topics.map((t) => t.body).join("\n\n---\n\n");
    return `${body}\n\n_${DISCLAIMER}_`;
  }
  // Honest limitation: no reliable match — do not invent an answer.
  return replyInLanguage(
    lang,
    `I don't have reliable information on "${trimmed.slice(0, 80)}" in my current knowledge base, so I don't want to guess. I can share general health information on topics like heart, brain, kidney, liver, lungs, TB, thyroid, diabetes, digestion, infections, bones, ENT, eyes, skin, pregnancy, medicines, tests, and healthy lifestyle.\n\nCould you tell me a bit more about what's on your mind? For example: what symptoms you're noticing, and for how long.\n\n_${DISCLAIMER}_`,
    `Mere paas "${trimmed.slice(0, 80)}" par reliable jankari nahi hai, isliye main andaza nahi lagana chahta. Main dil, dimaag, kidney, liver, lungs, TB, thyroid, diabetes, pet, infection, haddi, ENT, aankh, skin, pregnancy, dawai, test aur healthy lifestyle jaise topics par general jankari de sakta hoon.\n\nThoda aur batayenge — jaise kya lakshan hain aur kab se hain?\n\n_${DISCLAIMER}_`,
    `मेरे पास "${trimmed.slice(0, 80)}" पर विश्वसनीय जानकारी नहीं है, इसलिए मैं अंदाज़ा नहीं लगाना चाहता। मैं हृदय, मस्तिष्क, किडनी, लिवर, फेफड़े, टीबी, थायराइड, मधुमेह, पाचन, संक्रमण, हड्डी, ENT, आंख, त्वचा, गर्भावस्था, दवा, जांच और स्वस्थ जीवनशैली जैसे विषयों पर सामान्य जानकारी दे सकता हूँ।\n\nथोड़ा और बताएँगे — जैसे क्या लक्षण हैं और कब से हैं?\n\n_${DISCLAIMER}_`,
  );
}

// ---------- AI provider (OpenAI-compatible chat completions) ----------

interface ChatTurn {
  role: "user" | "assistant";
  content: string;
}

async function aiReply(history: ChatTurn[], userText: string): Promise<string | null> {
  if (!env.aiApiKey) return null;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 30_000);
  try {
    // Ground the model with only the most relevant excerpts, not the whole KB.
    // Matched Medicine Library briefs are appended (never the full catalogue).
    const historyUserTexts = history.filter((m) => m.role === "user").map((m) => m.content);
    const relevant = getRelevantTopics(userText, historyUserTexts.slice(0, -1), 4);
    const briefs = findMedicineBriefs(userText, 2);
    const context = relevant.length > 0
      ? relevant.map((t) => `### ${t.title}\n${t.body}`).join("\n\n")
      : knowledgeContext();
    const medContext = briefs.length > 0
      ? `\n\n## Matched Medicine Library entries (briefs; direct the user to the library path for full details)\n${briefs.map((b) => `- ${b.name} (${b.generic}): ${b.summary} Safety: ${b.warning} Library: ${b.path}`).join("\n")}`
      : "";
    const lang = detectLanguage(userText);
    const langNote =
      lang === "hi"
        ? "The user writes in Hindi (Devanagari). Reply in Hindi."
        : lang === "hinglish" || lang === "mixed"
          ? "The user writes in Hinglish (Roman Hindi mixed with English). Reply in the same natural Hinglish style."
          : "The user writes in English. Reply in English.";
    const res = await fetch(`${env.aiApiBase}/chat/completions`, {
      method: "POST",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.aiApiKey}`,
      },
      body: JSON.stringify({
        model: env.aiModel,
        temperature: 0.4,
        max_tokens: 700,
        messages: [
          { role: "system", content: `${SYSTEM_PROMPT}\n\n## Reference knowledge (most relevant excerpts — do not present keyword matching as diagnosis)\n${context}${medContext}\n\n## User language\n${langNote}` },
          ...history.slice(-12).map((m) => ({ role: m.role, content: m.content })),
          { role: "user", content: userText },
        ],
      }),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const content = data.choices?.[0]?.message?.content?.trim();
    return content || null;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

// ---------- Route ----------
// Stateless: the client keeps conversation history in localStorage and sends
// the recent turns with each request. No database is used.

const messageSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().trim().min(1).max(2000),
      }),
    )
    .min(1)
    .max(20),
});

chatbotRouter.post("/message", messageLimiter, async (req, res) => {
  const parsed = messageSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Please type a message." });
    return;
  }
  const history = parsed.data.messages;
  const lastUser = [...history].reverse().find((m) => m.role === "user");
  if (!lastUser) {
    res.status(400).json({ error: "Please type a message." });
    return;
  }
  const userText = lastUser.content.trim();

  // Safety: emergencies always get the emergency response immediately.
  let reply: string | null = null;
  if (isEmergency(userText)) {
    reply = MEDICAL_KNOWLEDGE.find((t) => t.id === "emergency")!.body;
  } else {
    reply = await aiReply(history, userText);
    if (!reply) {
      const priorUserTexts = history.filter((m) => m.role === "user").map((m) => m.content).slice(0, -1);
      reply = fallbackReply(userText, priorUserTexts);
    }
  }

  res.json({ reply });
});
