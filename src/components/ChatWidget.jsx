// src/components/ChatWidget.jsx
import React, { useState, useRef, useEffect, useCallback } from "react";
import ReactDOM from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaRobot, FaTimes, FaInfoCircle, FaUsers, FaProjectDiagram, FaHandshake } from "react-icons/fa";
import { IoMdSend } from "react-icons/io";

// Reuse your existing helpers
import { chatAxios } from "../lib/chatAxios";
import { fnUrl } from "../lib/api.js";
import { companyInfo } from "../lib/companyInfo.js";

/* --------------------------------------------------------------------------
 * Small utils
 * -------------------------------------------------------------------------- */
const AVATAR_URL = "/assets/logoSynexiai.png";
const now = () => new Date().toISOString();
const _fabSize = 50; // reserved for tweaks

function escapeHtml(s = "") {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
function linkify(text = "") {
  const escaped = escapeHtml(text);
  const urlRE = /(\b(https?|ftp):\/\/[^\s<]+)/gi;
  return escaped.replace(
    urlRE,
    (url) =>
      `<a href="${url}" target="_blank" rel="noopener noreferrer" class="underline decoration-cyan-400/60 hover:decoration-cyan-300">${url}</a>`,
  );
}
function stripMarkdown(text = "") {
  return (text || "")
    .replace(/\*\*(.*?)\*\*/g, "$1") // **bold**
    .replace(/__(.*?)__/g, "$1") // __underline__ (md)
    .replace(/`([^`]*)`/g, "$1") // `code`
    .replace(/^#+\s*(.*)$/gm, "$1") // # headings
    .replace(/\[(.*?)\]\((.*?)\)/g, "$1 ($2)"); // [text](url)
}

/* --------------------------------------------------------------------------
 * Brand-aware + General answering
 * -------------------------------------------------------------------------- */
function isBrandQuestion(text = "") {
  return /\b(synexi(ai)?|company|about\s+you|team|projects?|collaborat(e|ion)|contact)\b/i.test(text);
}
function looksLikeBrandBlurb(t = "") {
  return /For direct inquiries:|Contact us:\s*Email:/i.test(t) || /SynexiAI is focused/i.test(t);
}
function buildSystemPrompt(userText = "", forceGeneral = false) {
  if (forceGeneral || !isBrandQuestion(userText)) {
    // Default: free, general-purpose assistant
    return `You are a helpful, general-purpose AI assistant. Answer the user's question directly and do NOT insert company marketing, mission, or contact info unless the user explicitly asks about the company/team/projects/collaboration/contact. Keep answers accurate, concise, and conversational.`;
  }
  // Brand-aware mode (only when the user asks brand things)
  return `You are SynexiAI's site assistant.
If the user asks about the company/team/projects/collaboration/contact, use ONLY these official details:
- Name: ${companyInfo.name}
- Mission: "${companyInfo.mission}"
- Vision: "${companyInfo.vision}"
- Founder: ${companyInfo.team.founder}
- Team: ${companyInfo.team.members.join(", ")}
- Projects: ${companyInfo.projects.join(", ")}
- Contact: ${companyInfo.contact.email} | ${companyInfo.contact.phone}
For unrelated questions, answer generally and do NOT add company marketing or contact info.`;
}

async function fetchAssistantReply(history, signal, forceGeneral = false) {
  const lastUser = [...history].reverse().find((m) => m.role === "user");
  const sys = buildSystemPrompt(lastUser?.content || "", forceGeneral);
  const messages = [{ role: "system", content: sys }, ...history.map((m) => ({ role: m.role, content: m.content }))];

  const { data } = await chatAxios.post(
    fnUrl("chat-assistant"),
    { messages },
    { timeout: 20000, signal },
  );

  if (data?.error) throw new Error(data.error);
  if (data?.reply) return data.reply;
  return data?.choices?.[0]?.message?.content ?? "I’m here—ask me anything!";
}

/* --------------------------------------------------------------------------
 * Optional: Project explain block (kept for future triggers)
 * -------------------------------------------------------------------------- */
function roadmapFromStatus(status) {
  switch ((status || "").toLowerCase()) {
    case "poc":
      return ["Validate core hypothesis with 2–3 datasets", "Collect feedback & refine metrics", "Decide go/no-go"];
    case "alpha":
      return ["Hardening & load testing", "Auth, quotas, rate limits", "Internal dogfood rollout"];
    case "mvp":
      return ["Pilot with 3–5 users", "Observability & rollback paths", "Docs, pricing, onboarding"];
    case "stable":
      return ["Scale adoption & SLAs", "Plugins/SDKs & integrations", "Security reviews & compliance"];
    case "design":
      return ["Write spec & acceptance criteria", "UX flows & mockups", "Milestones & success metrics"];
    default:
      return ["Define success metrics", "Iterate quickly with user feedback", "Plan GA criteria"];
  }
}
function formatProjectAnswer(ctx, plain = false) {
  const p = ctx?.project || {};
  const title = p.title || "Untitled";
  const value = p.blurb || "a practical initiative to deliver measurable gains in speed, reliability, and cost.";
  const stack = p.tech && p.tech.length ? p.tech.join(", ") : "TBD";
  const roadmap = roadmapFromStatus(p.status);

  if (plain) {
    return `${title} is ${value} It uses ${stack === "TBD" ? "modern tools" : stack} to achieve this. The next steps are ${roadmap.join(", ")}.`;
  }
  return `Project: ${title}\n\nValue — ${value}\n\nStack — ${stack}\n\nRoadmap\n${roadmap.map((s) => "- " + s).join("\n")}`;
}
function buildUserPromptFromPayload(payload = {}) {
  const persona = payload.persona || "general";
  const title = payload.project?.title || payload.title || "this project";
  return `Explain "${title}" to a ${persona} in plain English. Include value, stack, and roadmap.`;
}

/* --------------------------------------------------------------------------
 * Initial greeting (kept lightweight; real system is dynamic per turn)
 * -------------------------------------------------------------------------- */
const initialGreeting = {
  role: "assistant",
  content: `👋 Hello! I'm your ${companyInfo.name} assistant.\n\nAsk me anything — general questions or about SynexiAI. Try:\n• Tell me about ${companyInfo.name}\n• Who leads your team?\n• What projects are you working on?\n• How can we collaborate?`,
  timestamp: now(),
};

const quickQuestions = [
  { icon: <FaInfoCircle className="mr-2" />, text: "Tell me about your company" },
  { icon: <FaUsers className="mr-2" />, text: "Who is on your team?" },
  { icon: <FaProjectDiagram className="mr-2" />, text: "What projects are you working on?" },
  { icon: <FaHandshake className="mr-2" />, text: "How can we collaborate?" },
  { icon: <FaInfoCircle className="mr-2" />, text: "Show me your site map" },
];

/* --------------------------------------------------------------------------
 * Component (Unified Free-Chat)
 * -------------------------------------------------------------------------- */
export default function ChatWidget({
  side = "right",
  z = 9999,
  autoOpenDesktopMs = 0, // default OFF for a normal AI chat feel
  persistKey = "sx_chat",
}) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState(() => {
    try {
      const saved = JSON.parse(sessionStorage.getItem(persistKey) || "[]");
      return saved.length ? saved : [initialGreeting];
    } catch {
      return [initialGreeting];
    }
  });
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  const endRef = useRef(null);
  const inputRef = useRef(null);
  const controllerRef = useRef(null);
  const contextRef = useRef(null);
  const lastBridgeRef = useRef({ key: "", ts: 0 });

  // responsiveness
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // body scroll lock on mobile
  useEffect(() => {
    if (!isMobile) return;
    const body = document.body;
    if (open) {
      const prev = body.style.overflow;
      body.style.overflow = "hidden";
      return () => {
        body.style.overflow = prev;
      };
    }
  }, [open, isMobile]);

  // auto-open (desktop only, optional)
  useEffect(() => {
    if (isMobile || !autoOpenDesktopMs) return;
    const t = setTimeout(() => setOpen(true), autoOpenDesktopMs);
    return () => clearTimeout(t);
  }, [isMobile, autoOpenDesktopMs]);

  // persist session
  useEffect(() => {
    try {
      sessionStorage.setItem(persistKey, JSON.stringify(messages));
    } catch {
      /* no-op */
    }
  }, [messages, persistKey]);

  // scroll & focus
  useEffect(() => {
    if (open) {
      endRef.current?.scrollIntoView({ behavior: "smooth" });
      inputRef.current?.focus();
    }
  }, [messages, open]);

  // esc to close
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // bridge: synexiai:ask (kept compatible with old Dock)
  useEffect(() => {
    async function onAsk(e) {
      const payload = e.detail || {};
      const key = `${payload.type || "ask"}::${payload.project?.id || payload.title || ""}`;
      const ts = Date.now();
      if (lastBridgeRef.current.key === key && ts - lastBridgeRef.current.ts < 800) return;
      lastBridgeRef.current = { key, ts };

      contextRef.current = payload;
      setOpen(true);

      const userText = buildUserPromptFromPayload(payload);
      if (payload.autoSend) {
        await sendMessage(userText);
      } else {
        setInput(userText);
      }
    }
    window.addEventListener("synexiai:ask", onAsk);
    window.__synexiaiChat = {
      open: () => setOpen(true),
      openWith: (payload) => onAsk({ detail: payload }),
    };
    return () => window.removeEventListener("synexiai:ask", onAsk);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages, loading]);

  const stopGeneration = () => {
    try {
      controllerRef.current?.abort();
    } catch {
      /* no-op */
    }
  };
  useEffect(() => () => controllerRef.current?.abort(), []);

  const visibleMessages = messages; // no system msg now; all are visible
  const shouldShowQuick = () => visibleMessages.length <= 2;

  const sendMessage = useCallback(
    async (messageContent = null) => {
      const content = (messageContent ?? input).trim();
      if (!content || loading) return;

      const userMsg = { role: "user", content, timestamp: now() };
      setMessages((prev) => [...prev, userMsg]);
      if (!messageContent) setInput("");
      setLoading(true);
      setError(null);

      try {
        controllerRef.current = new AbortController();
        const signal = controllerRef.current.signal;

        let responseContent;

        // Optional project context → plain explanation for casual prompts
        const ctx = contextRef.current;
        if (ctx?.project) {
          const plain = /what is this|tell me|explain in simple|in plain/i.test(content);
          responseContent = formatProjectAnswer(ctx, plain);
        } else {
          // Keep more history so follow-ups make sense
          const historyWindow = 20; // larger window for better context
          const history = [...messages.slice(-historyWindow), userMsg]
            .filter((m) => m.role === "user" || m.role === "assistant");

          // 1st pass with context-aware system
          responseContent = await fetchAssistantReply(history, signal);

          // If backend injected brand blurb for a non-brand ask → force general once
          if (!isBrandQuestion(content) && looksLikeBrandBlurb(responseContent)) {
            responseContent = await fetchAssistantReply(history, signal, true);
          }

          // If the ask is brandy & contact is missing → append contact once
          if (isBrandQuestion(content) && !responseContent.includes(companyInfo.contact.email)) {
            responseContent += `\n\nFor direct inquiries:\nEmail: ${companyInfo.contact.email}\nPhone: ${companyInfo.contact.phone}`;
          }
        }

        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: responseContent, timestamp: now(), links: [] },
        ]);
      } catch (err) {
        if (err.name === "CanceledError" || err.message === "canceled") return;
        console.error("Chat API error:", err);
        setError(err);
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              `❗️ ${err.response?.data?.error?.message || err.message || "Sorry, I encountered an error. Please try again."}\n\n` +
              `Contact us directly:\nEmail: ${companyInfo.contact.email}\nPhone: ${companyInfo.contact.phone}`,
            timestamp: now(),
          },
        ]);
      } finally {
        setLoading(false);
        controllerRef.current = null;
      }
    },
    [input, messages, loading],
  );

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  /* --------------------------------------------------------------------------
   * UI
   * -------------------------------------------------------------------------- */
  const desktopInset = 24;
  const mobileInset = 16;
  const panelLiftDesktop = 80;
  const panelLiftMobile = 72;

  const bottomFab = `calc(${isMobile ? mobileInset : desktopInset}px + env(safe-area-inset-bottom, 0px))`;
  const panelBottom = `calc(${isMobile ? panelLiftMobile : panelLiftDesktop}px + env(safe-area-inset-bottom, 0px))`;

  const fabStyle = {
    position: "fixed",
    bottom: bottomFab,
    [side === "left" ? "left" : "right"]: `${isMobile ? mobileInset : desktopInset}px`,
    zIndex: z,
  };
  const panelStyle = {
    position: "fixed",
    bottom: panelBottom,
    [side === "left" ? "left" : "right"]: `${isMobile ? mobileInset : desktopInset}px`,
    width: isMobile ? "min(92vw, 420px)" : "380px",
    maxWidth: "92vw",
    zIndex: z,
  };

  const widget = (
    <>
      {/* FAB */}
      <motion.button
        type="button"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen((o) => !o)}
        style={fabStyle}
        className={`rounded-full ${isMobile ? "p-3" : "p-4"} shadow-2xl text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 ring-1 ring-white/20 backdrop-blur-md`}
        aria-label={open ? "Close chat" : "Open chat"}
      >
        {open ? <FaTimes size={isMobile ? 18 : 20} /> : <FaRobot size={isMobile ? 18 : 20} />}
      </motion.button>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="sx-chat"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            style={panelStyle}
            className="z-50 max-h-[80dvh] flex flex-col overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/10 bg-white/5 dark:bg-white/5 backdrop-blur-xl"
            aria-live="polite"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-cyan-600/90 to-blue-600/90 text-white shadow-md">
              <div className="flex items-center">
                <img src={AVATAR_URL} alt="Company Logo" className="w-7 h-7 rounded-md mr-2 ring-1 ring-white/20" />
                <span className="font-semibold">{companyInfo.name} Assistant</span>
              </div>
              <div className="flex items-center gap-2">
                {loading && (
                  <button
                    type="button"
                    onClick={stopGeneration}
                    className="px-2 py-1 text-xs rounded-md bg-white/10 hover:bg-white/20 border border-white/20"
                  >
                    Stop
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="text-white/90 hover:text-white p-1 focus:outline-none"
                  aria-label="Close chat"
                >
                  <FaTimes size={16} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div
              className={`flex-1 p-4 overflow-y-auto space-y-4 bg-gradient-to-b from-transparent to-black/5 ${
                isMobile ? "max-h-[60svh]" : "max-h-[60vh]"
              }`}
            >
              {visibleMessages.map((message, i) => (
                <motion.div
                  key={`${message.timestamp || i}-${i}`}
                  initial={{ opacity: 0, y: message.role === "user" ? 10 : -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex max-w-[92%] ${message.role === "user" ? "ml-auto justify-end" : "mr-auto justify-start"}`}
                >
                  <div className="flex flex-col">
                    <div
                      className={`px-3 py-2 sm:px-4 sm:py-3 rounded-2xl text-sm leading-relaxed ${
                        message.role === "user"
                          ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-br-sm shadow-lg"
                          : "text-gray-900 dark:text-gray-100 bg-white/10 border border-white/15 backdrop-blur-md shadow-lg rounded-bl-sm"
                      }`}
                      dangerouslySetInnerHTML={{
                        __html: linkify(stripMarkdown(message.content || "")).replace(/\n/g, "<br>"),
                      }}
                    />
                  </div>
                </motion.div>
              ))}

              {/* Quick actions */}
              {shouldShowQuick() && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="grid grid-cols-2 gap-2 mt-2">
                  {quickQuestions.map((q, i) => (
                    <button
                      type="button"
                      key={i}
                      onClick={() => sendMessage(q.text)}
                      className="flex items-center p-2 text-xs rounded-xl transition-all bg-white/10 hover:bg-white/15 border border-white/15 text-gray-900 dark:text-gray-100 backdrop-blur-md"
                    >
                      {q.icon}
                      <span className="text-left">{q.text}</span>
                    </button>
                  ))}
                </motion.div>
              )}

              {/* Typing bubble */}
              {loading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex mr-auto justify-start">
                  <div className="px-3 py-2 rounded-2xl rounded-bl-sm bg-white/10 border border-white/15 backdrop-blur-md shadow-lg text-gray-900 dark:text-gray-100">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" />
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0.2s" }} />
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0.4s" }} />
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={endRef} />
            </div>

            {/* Composer */}
            <div className="p-3 border-t border-white/10 bg-white/5 backdrop-blur-md">
              {error && (
                <div className="mb-2 px-3 py-2 text-xs text-rose-600 dark:text-rose-300 bg-rose-100/70 dark:bg-rose-900/40 rounded-lg">
                  Error: {error.message}
                </div>
              )}

              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    if (error) setError(null);
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your message..."
                  disabled={loading}
                  className="flex-1 px-4 py-2 rounded-xl bg-white/10 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 border border-white/15 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 disabled:opacity-50 backdrop-blur-md"
                  aria-label="Type your message"
                />
                <button
                  type="button"
                  onClick={() => sendMessage()}
                  disabled={loading || !input.trim()}
                  className="p-2 rounded-xl shadow-md bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Send message"
                >
                  <IoMdSend size={18} />
                </button>
              </div>

              <div className="mt-2 text-[11px] text-center text-gray-600 dark:text-gray-400" style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}>
                Free chat by {companyInfo.name} • <a href="/privacy" className="underline hover:opacity-80">Privacy Policy</a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );

  return ReactDOM.createPortal(widget, document.body);
}
