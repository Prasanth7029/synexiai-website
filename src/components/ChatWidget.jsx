// src/components/ChatWidget.jsx
import React, { useState, useRef, useEffect, useCallback } from "react";
import ReactDOM from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaRobot, FaTimes, FaInfoCircle, FaUsers, FaProjectDiagram, FaHandshake } from "react-icons/fa";
import { IoMdSend } from "react-icons/io";

import { chatAxios } from "../lib/chatAxios";
import { fnUrl } from "../lib/api.js";
import { companyInfo } from "../lib/companyInfo.js";
import { findKbSnippets } from "../lib/brandKb.js";

/* --------------------------------------------------------------------------
 * Small utils
 * -------------------------------------------------------------------------- */
const AVATAR_URL = "/assets/logoSynexiai.png";
const now = () => new Date().toISOString();

function escapeHtml(s = "") {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function linkify(text = "") {
  const escaped = escapeHtml(text || "");
  return escaped.replace(
    /(\b(https?|ftp):\/\/[^\s<]+)/gi,
    (url) =>
      `<a href="${url}" target="_blank" rel="noopener noreferrer" class="underline decoration-cyan-400/60 hover:decoration-cyan-300">${url}</a>`,
  );
}
function stripMarkdown(text = "") {
  return (text || "")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/__(.*?)__/g, "$1")
    .replace(/`([^`]*)`/g, "$1")
    .replace(/^#+\s*(.*)$/gm, "$1")
    .replace(/\[(.*?)\]\((.*?)\)/g, "$1 ($2)");
}
function normalize(text = "") {
  return (text || "")
    .toLowerCase()
    .replace(/\binvent\b/g, "invest") // map common typo
    .replace(/\bboss\b/g, "founder")  // align to KB
    .trim();
}

/* --------------------------------------------------------------------------
 * Brand-aware + General answering
 * -------------------------------------------------------------------------- */
function isBrandQuestion(text = "") {
  const t = normalize(text);
  return /\b(synexi(ai)?|company|about\s+you|team|projects?|collaborat(e|ion)|contact|vision|mission|founder|ceo|lead(er|ership)|invest(or|ment)?)\b/i.test(
    t,
  );
}
function looksLikeBrandBlurb(t = "") {
  return /For direct inquiries:|Contact us:\s*Email:/i.test(t) || /SynexiAI is focused/i.test(t);
}
function buildSystemPrompt(userText = "", forceGeneral = false) {
  if (forceGeneral || !isBrandQuestion(userText)) {
    return `You are a helpful, general-purpose AI assistant. Answer the user's question directly and do NOT insert company marketing, mission, or contact info unless the user explicitly asks about the company/team/projects/collaboration/contact. Keep answers accurate, concise, and conversational.`;
  }
  const kb = findKbSnippets(userText, 2).join("\n\n");
  return `You are SynexiAI's site assistant.
Use ONLY official details. If information is not in facts/KB, say you don't know.

KB:
${kb}

Facts:
- Name: ${companyInfo.name}
- Mission: ${companyInfo.mission}
- Vision: ${companyInfo.vision}
- Founder: ${companyInfo.team.founder}
- Team: ${companyInfo.team.members.join(", ")}
- Projects: ${companyInfo.projects.join(", ")}
- Contact: ${companyInfo.contact.email} | ${companyInfo.contact.phone}

When the user asks non-brand questions, answer generally without adding brand info.`;
}
async function fetchAssistantReply(history, signal, forceGeneral = false) {
  const lastUser = [...history].reverse().find((m) => m.role === "user");
  const sys = buildSystemPrompt(lastUser?.content || "", forceGeneral);
  const messages = [{ role: "system", content: sys }, ...history.map((m) => ({ role: m.role, content: m.content }))];
  const { data } = await chatAxios.post(fnUrl("chat-assistant"), { messages }, { timeout: 20000, signal });
  if (data?.error) throw new Error(data.error);
  if (data?.reply) return data.reply;
  return data?.choices?.[0]?.message?.content ?? "I'm here—ask me anything!";
}

/* --------------------------------------------------------------------------
 * Optional: Project explain block
 * -------------------------------------------------------------------------- */
function roadmapFromStatus(status) {
  switch ((status || "").toLowerCase()) {
    case "poc": return ["Validate core hypothesis with 2–3 datasets", "Collect feedback & refine metrics", "Decide go/no-go"];
    case "alpha": return ["Hardening & load testing", "Auth, quotas, rate limits", "Internal dogfood rollout"];
    case "mvp": return ["Pilot with 3–5 users", "Observability & rollback paths", "Docs, pricing, onboarding"];
    case "stable": return ["Scale adoption & SLAs", "Plugins/SDKs & integrations", "Security reviews & compliance"];
    case "design": return ["Write spec & acceptance criteria", "UX flows & mockups", "Milestones & success metrics"];
    default: return ["Define success metrics", "Iterate quickly with user feedback", "Plan GA criteria"];
  }
}
function formatProjectAnswer(ctx, plain = false) {
  const p = ctx?.project || {};
  const title = p.title || "Untitled";
  const value = p.blurb || "a practical initiative to deliver measurable gains in speed, reliability, and cost.";
  const stack = p.tech && p.tech.length ? p.tech.join(", ") : "TBD";
  const roadmap = roadmapFromStatus(p.status);
  if (plain) return `${title} is ${value} It uses ${stack === "TBD" ? "modern tools" : stack} to achieve this. The next steps are ${roadmap.join(", ")}.`;
  return `Project: ${title}\n\nValue — ${value}\n\nStack — ${stack}\n\nRoadmap\n${roadmap.map((s) => "- " + s).join("\n")}`;
}
function buildUserPromptFromPayload(payload = {}) {
  const persona = payload.persona || "general";
  const title = payload.project?.title || payload.title || "this project";
  return `Explain "${title}" to a ${persona} in plain English. Include value, stack, and roadmap.`;
}

/* --------------------------------------------------------------------------
 * Initial greeting
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
 * Component
 * -------------------------------------------------------------------------- */
export default function ChatWidget({
  side = "right",
  z = 9999,
  autoOpenDesktopMs = 0,
  persistKey = "sx_chat",
  desktopWidthPx = 320,         // narrower fixed width
  density = "compact",          // "compact" | "normal"
  scaleDesktop = 0.9,           // slight shrink on desktop
}) {
  const isCompact = density === "compact";

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

  const [kbOffset, setKbOffset] = useState(0);
  const [safeTop, setSafeTop] = useState(0);

  const endRef = useRef(null);
  const inputRef = useRef(null);
  const controllerRef = useRef(null);
  const contextRef = useRef(null);
  const lastBridgeRef = useRef({ key: "", ts: 0 });

  // tiny memory: name + last brand topic
  const [guestName, setGuestName] = useState(() => {
    try { return localStorage.getItem("sx_guest_name") || ""; } catch { return ""; }
  });
  const lastBrandRef = useRef({ topic: "", entity: "" });

  useEffect(() => { try { if (guestName) localStorage.setItem("sx_guest_name", guestName); } catch {} }, [guestName]);

  useEffect(() => {
    if (!guestName) {
      const t = setTimeout(() => {
        setMessages((prev) => [...prev, { role: "assistant", content: "I can personalize our chat—what should I call you?", timestamp: now() }]);
      }, 600);
      return () => clearTimeout(t);
    }
  }, []); // eslint-disable-line

  /* ---------- responsiveness ---------- */
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // detect sticky headers so panel never hides under them
  useEffect(() => {
    const scan = () => {
      const cand = Array.from(document.querySelectorAll("header, nav, .site-header, #header, #navbar, [data-sticky]"));
      let h = 0;
      for (const el of cand) {
        const cs = window.getComputedStyle(el);
        if (cs.position === "fixed" || cs.position === "sticky") {
          const r = el.getBoundingClientRect();
          if (r.top <= 2 && r.bottom > 0) h = Math.max(h, r.height);
        }
      }
      setSafeTop(Math.min(160, Math.round(h)) || 0);
    };
    scan();
    window.addEventListener("resize", scan);
    window.addEventListener("scroll", scan, { passive: true });
    return () => {
      window.removeEventListener("resize", scan);
      window.removeEventListener("scroll", scan);
    };
  }, []);

  // visual viewport (iOS/Android keyboards)
  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;
    const update = () => {
      const bottomInset = Math.max(0, (window.innerHeight - vv.height - vv.offsetTop) || 0);
      setKbOffset(bottomInset);
    };
    update();
    vv.addEventListener("resize", update);
    vv.addEventListener("scroll", update);
    return () => {
      vv.removeEventListener("resize", update);
      vv.removeEventListener("scroll", update);
    };
  }, []);

  // body scroll lock on mobile
  useEffect(() => {
    if (!isMobile) return;
    const body = document.body;
    if (open) {
      const prev = body.style.overflow;
      body.style.overflow = "hidden";
      return () => { body.style.overflow = prev; };
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
    try { sessionStorage.setItem(persistKey, JSON.stringify(messages)); } catch {}
  }, [messages, persistKey]);

  // scroll & focus
  useEffect(() => {
    if (open) {
      endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
      inputRef.current?.focus();
    }
  }, [messages, open]);

  // esc to close
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // bridge: synexiai:ask
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
      if (payload.autoSend) await sendMessage(userText);
      else setInput(userText);
    }
    window.addEventListener("synexiai:ask", onAsk);
    window.__synexiaiChat = { open: () => setOpen(true), openWith: (p) => onAsk({ detail: p }) };
    return () => window.removeEventListener("synexiai:ask", onAsk);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages, loading]);

  const stopGeneration = () => {
    try { controllerRef.current?.abort(); setLoading(false); } catch {}
  };
  useEffect(() => () => controllerRef.current?.abort(), []);

  const visibleMessages = messages;
  const shouldShowQuick = () => visibleMessages.length <= 2;

  /* --------------------------------------------------------------------------
   * Agent skills (local, instant)
   * -------------------------------------------------------------------------- */
  const SKILLS = {
    "site map": {
      match: /(site\s*map|navigation|sections?)/i,
      run: () => ({
        text:
          "Here’s a quick tour of SynexiAI 👇\n" +
          "• Home — our mission & highlights\n" +
          "• Projects — Green Data Center, AI Chat Assistant, MindMap, Inventory\n" +
          "• Technology — Stack & standards\n" +
          "• Vision — 5/10/20 year goals\n" +
          "• Contact — email & phone",
        actions: [
          { label: "Open Projects", type: "event", event: { name: "synexiai:navigate", detail: { to: "#projects" } } },
          { label: "Open Technology", type: "event", event: { name: "synexiai:navigate", detail: { to: "/tech" } } },
        ],
      }),
    },
    projects: {
      match: /(projects?|what.*working|show.*work)/i,
      run: () => ({
        text:
          "Current projects:\n• AI Chat Assistant\n• MindMap AI Dashboard\n• Inventory Management System\n• Green Data Center Model",
        actions: [
          { label: "Explore Projects", type: "event", event: { name: "synexiai:navigate", detail: { to: "#projects" } } },
          { label: "Explain Green Data Center", type: "ask", payload: { title: "Green Data Center Model", persona: "general", autoSend: true } },
        ],
      }),
    },
    contact: {
      match: /(contact|email|phone|collaborat|partner|invest)/i,
      run: () => ({
        text: `Contact us anytime:\nEmail: ${companyInfo.contact.email}\nPhone: ${companyInfo.contact.phone}`,
        actions: [
          { label: "Email us", type: "link", href: `mailto:${companyInfo.contact.email}` },
          { label: "Call now", type: "link", href: `tel:${companyInfo.contact.phone}` },
        ],
      }),
    },
    investor: {
      match: /\b(invest(or|ment)?|fund|valuation|cap\s*table|equity|pitch|deck)\b/i,
      run: () => ({
        text:
          "Great—here’s our investor quick pack:\n" +
          `• Founder: ${companyInfo.team.founder}\n` +
          `• Mission: ${companyInfo.mission}\n` +
          "• Focus: AI + Green Datacenter + Database Platform\n" +
          "• Next step: 15‑min intro call",
        actions: [
          { label: "Email Investor Relations", type: "link", href: `mailto:${companyInfo.contact.email}?subject=Investor%20Intro%20—%20SynexiAI` },
          { label: "See Projects", type: "event", event: { name: "synexiai:navigate", detail: { to: "#projects" } } },
        ],
      }),
    },
    quiz: {
      match: /(quiz|puzzle|play|game)/i,
      run: () => ({
        text: "Opening a quick SynexiAI quiz. Good luck! 🧠",
        actions: [
          {
            label: "Start Quiz",
            type: "event",
            event: { name: "synexiai:quiz", detail: { topic: "green", shuffle: true } },
          },
        ],
      }),
    },
    recommend: {
      match: /(recommend|where.*start|guide me)/i,
      run: (_, lastUser = "") => {
        const isInvestor = /invest|fund|roi|valuation/i.test(lastUser);
        const isDev = /code|api|stack|sdk|docs|react|spring|java|go/i.test(lastUser);
        const picks = isInvestor
          ? ["Vision page", "Projects → Green Data Center", "Contact"]
          : isDev
          ? ["Technology", "Projects → AI Chat Assistant", "GitHub"]
          : ["About", "Projects", "Vision"];
        return {
          text: `Based on your interest, here’s where to start: ${picks.join(", ")}.`,
          actions: [
            { label: "Open Vision", type: "event", event: { name: "synexiai:navigate", detail: { to: "/vision" } } },
            { label: "Open Technology", type: "event", event: { name: "synexiai:navigate", detail: { to: "/tech" } } },
          ],
        };
      },
    },
  };

  function tryHandleSkill(userText) {
    for (const [, skill] of Object.entries(SKILLS)) {
      if (skill.match.test(userText)) return skill.run(userText, userText);
    }
    return null;
  }

  /* ---------- send ---------- */
  const sendMessage = useCallback(
    async (messageContent = null) => {
      const content = (messageContent ?? input).trim();
      if (!content || loading) return;

      const userMsg = { role: "user", content, timestamp: now() };
      const normalized = normalize(content);

      // capture "my name is ..." before skills/LLM
      const nameMatch = !guestName && content.match(/^my name is\s+(.+)/i);
      if (nameMatch) {
        const raw = nameMatch[1].trim();
        const name = raw.replace(/\b\w/g, (c) => c.toUpperCase());
        setGuestName(name);
        setMessages((prev) => [
          ...prev,
          userMsg,
          { role: "assistant", content: `Nice to meet you, **${name}**! 🚀`, timestamp: now() },
        ]);
        if (!messageContent) setInput("");
        setLoading(false);
        return;
      }

      // track brand topic for simple coref
      if (/\b(founder|ceo|lead|leader)\b/.test(normalized)) {
        lastBrandRef.current = { topic: "leader", entity: companyInfo.team.founder || "our founder" };
      } else if (/\b(team|members?)\b/.test(normalized)) {
        lastBrandRef.current = { topic: "team", entity: "team" };
      } else if (/\b(projects?)\b/.test(normalized)) {
        lastBrandRef.current = { topic: "projects", entity: "projects" };
      } else if (/\b(invest|investor|investment)\b/.test(normalized)) {
        lastBrandRef.current = { topic: "invest", entity: "investor-relations" };
      }

      // quick coreference for short follow-ups (his/he/who is he/name?)
      if (/^(what('?| i)s\s+his\s+name|who\s+is\s+he|his\s+name\??)$/i.test(content)) {
        const leader = companyInfo?.team?.founder || "";
        const reply = leader
          ? `Our founder is **${leader}**. You can reach us at ${companyInfo.contact.email} or ${companyInfo.contact.phone}.`
          : `Our founder information isn’t available yet. You can reach us at ${companyInfo.contact.email}.`;
        setMessages((prev) => [...prev, userMsg, { role: "assistant", content: reply, timestamp: now() }]);
        if (!messageContent) setInput("");
        setLoading(false);
        return;
      }

      // skills (instant local actions)
      const skill = tryHandleSkill(normalized);
      if (skill) {
        setMessages((prev) => [
          ...prev,
          userMsg,
          { role: "assistant", content: skill.text, timestamp: now(), actions: skill.actions || [] },
        ]);
        if (!messageContent) setInput("");
        setLoading(false);
        return;
      }

      // normal LLM path
      setMessages((prev) => [...prev, userMsg]);
      if (!messageContent) setInput("");
      setLoading(true);
      setError(null);

      try {
        controllerRef.current = new AbortController();
        const signal = controllerRef.current.signal;

        const historyWindow = 20;
        const history = [...messages.slice(-historyWindow), userMsg].filter(
          (m) => m.role === "user" || m.role === "assistant",
        );

        const ctx = contextRef.current;
        let responseContent;

        if (ctx?.project) {
          const plain = /what is this|tell me|explain( in simple| to a|)$/i.test(content);
          const projectContext = formatProjectAnswer(ctx, plain);
          const contextualHistory = [{ role: "system", content: `Context for the assistant:\n${projectContext}` }, ...history];
          responseContent = await fetchAssistantReply(contextualHistory, signal);
        } else {
          responseContent = await fetchAssistantReply(history, signal);
        }

        // If user didn't ask brand stuff but reply added brand blurb, re-ask forcing general
        if (!isBrandQuestion(content) && looksLikeBrandBlurb(responseContent)) {
          const forceGeneralHistory = ctx?.project
            ? [{ role: "system", content: "Context:\n" + formatProjectAnswer(ctx, false) }, ...history]
            : history;
          responseContent = await fetchAssistantReply(forceGeneralHistory, signal, true);
        }

        // If brand question, enforce founder + contact presence
        if (isBrandQuestion(content)) {
          const founder = companyInfo.team.founder;
          if (founder && !new RegExp(founder.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i").test(responseContent || "")) {
            responseContent = `Founder: ${founder}\n\n` + responseContent;
          }
          if (!responseContent.includes(companyInfo.contact.email)) {
            responseContent += `\n\nFor direct inquiries:\nEmail: ${companyInfo.contact.email}\nPhone: ${companyInfo.contact.phone}`;
          }
        }

        setMessages((prev) => [...prev, { role: "assistant", content: responseContent, timestamp: now() }]);
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
    [input, messages, loading, guestName],
  );

  useEffect(() => {
    function onOpen(e) {
      // open the panel
      setOpen(true);

      const detail = e?.detail || {};
      const prompt = detail.prompt || "";
      const autoSend = Boolean(detail.autoSend);

      if (prompt) {
        setInput(prompt); // prefill the composer
        // optionally auto-send if requested by caller
        if (autoSend) {
          // queue send on next tick so the UI has opened
          setTimeout(() => sendMessage(prompt), 0);
        }
      }
    }

    window.addEventListener("chatwidget:open", onOpen);
    return () => window.removeEventListener("chatwidget:open", onOpen);
  }, [sendMessage]); // Add sendMessage to dependencies

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // action buttons handler
  const handleAssistantAction = useCallback((a) => {
    if (!a) return;
    if (a.type === "link" && a.href) window.open(a.href, "_blank", "noopener");
    if (a.type === "event" && a.event?.name) {
      window.dispatchEvent(new CustomEvent(a.event.name, { detail: a.event.detail || {} }));
    }
    if (a.type === "ask" && a.payload) {
      window.__synexiaiChat?.openWith?.({ ...a.payload, autoSend: true });
    }
    if (a.type === "quiz") {
      const correct = a.value === "correct";
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: correct
            ? "✅ Correct! Our model blends **AI + ARM + Solar** to schedule workloads by carbon intensity."
            : "❌ Not quite. Try again! Hint: it mixes renewable energy with efficient compute.",
          timestamp: now(),
        },
      ]);
    }
  }, []);

  /* --------------------------------------------------------------------------
   * Layout + sizing (smaller desktop, safe areas, keyboard)
   * -------------------------------------------------------------------------- */
  const desktopInset = 24;
  const mobileInset = 16;
  const panelLiftDesktop = 70;
  const panelLiftMobile = 62;

  const bottomFab = `calc(${isMobile ? mobileInset : desktopInset}px + env(safe-area-inset-bottom, 0px) + ${kbOffset}px)`;
  const panelBottomBase = `calc(${isMobile ? panelLiftMobile : panelLiftDesktop}px + env(safe-area-inset-bottom, 0px) + ${kbOffset}px)`;

  // dynamic max height (respect header + keyboard)
  const topClear = (safeTop || 0) + 100;
  const panelMaxHeight = `calc(100svh - (${topClear}px + ${isMobile ? panelLiftMobile : panelLiftDesktop}px + env(safe-area-inset-bottom, 0px) + ${kbOffset}px))`;

  const scale = isMobile ? 1 : scaleDesktop;

  const fabStyle = {
    position: "fixed",
    bottom: bottomFab,
    [side === "left" ? "left" : "right"]: `${isMobile ? mobileInset : desktopInset}px`,
    zIndex: z + 1,
  };

  const panelStyle = {
    position: "fixed",
    bottom: panelBottomBase,
    [side === "left" ? "left" : "right"]: `${isMobile ? mobileInset : desktopInset}px`,
    width: isMobile ? "calc(100vw - 32px)" : `${desktopWidthPx}px`,
    maxWidth: isMobile ? "calc(100vw - 32px)" : `${desktopWidthPx}px`,
    zIndex: z + 2,
    maxHeight: panelMaxHeight,
    transform: `scale(${scale})`,
    transformOrigin: side === "left" ? "left bottom" : "right bottom",
  };

  // compensate the visual scale so panel still hugs the corner
  const scaledOffset = (1 - scale) * (isMobile ? mobileInset : desktopInset);
  panelStyle.bottom = `calc(${panelBottomBase} + ${scaledOffset}px)`;

  /* --------------------------------------------------------------------------
   * UI
   * -------------------------------------------------------------------------- */
  const widget = (
    <>
      {/* FAB — hide while open to avoid overlap */}
      <AnimatePresence>
        {!open && (
          <motion.button
            key="sx-fab"
            type="button"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setOpen(true)}
            style={fabStyle}
            className={`rounded-full ${isMobile ? "p-3" : "p-3.5"} shadow-2xl text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 ring-1 ring-white/20 backdrop-blur-md`}
            aria-label="Open chat"
          >
            <FaRobot size={isMobile ? 18 : 20} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="sx-chat"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            style={panelStyle}
            className="z-50 flex flex-col overflow-hidden rounded-2xl shadow-[0_20px_60px_-10px_rgba(14,165,233,0.35)] ring-1 ring-white/10 bg-white/5 dark:bg-white/5 backdrop-blur-xl backdrop-saturate-[1.8] mx-2 sm:mx-0"
            aria-live="polite"
            role="dialog"
            aria-modal="true"
          >
            {/* Header */}
            <div className={`flex items-center justify-between ${isCompact ? "px-3 py-2.5" : "px-4 py-3"} bg-gradient-to-r from-cyan-600/90 to-blue-600/90 text-white shadow-md`}>
              <div className="flex items-center">
                <img src={AVATAR_URL} alt="Company Logo" className={`${isCompact ? "w-6 h-6" : "w-7 h-7"} rounded-md mr-2 ring-1 ring-white/20`} />
                <span className={`${isCompact ? "text-sm" : "text-base"} font-semibold`}>{companyInfo.name} Assistant</span>
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
                  onClick={() => { stopGeneration(); setOpen(false); }}
                  className="text-white/90 hover:text-white p-1 focus:outline-none"
                  aria-label="Close chat"
                >
                  <FaTimes size={16} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className={`${isCompact ? "p-3" : "p-4"} flex-1 overflow-y-auto space-y-3 bg-gradient-to-b from-transparent to-black/5`}>
              {visibleMessages.map((message, i) => (
                <motion.div
                  key={`${message.timestamp || i}-${i}`}
                  initial={{ opacity: 0, y: message.role === "user" ? 10 : -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.18 }}
                  className={`flex max-w-[92%] ${message.role === "user" ? "ml-auto justify-end" : "mr-auto justify-start"}`}
                >
                  <div className="flex flex-col">
                    <div
                      className={`${isCompact ? "px-2.5 py-1.5 text-[13px]" : "px-3 py-2 text-sm"} rounded-2xl leading-relaxed ${
                        message.role === "user"
                          ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-br-sm shadow-lg"
                          : "text-gray-900 dark:text-gray-100 bg-white/10 border border-white/15 backdrop-blur-md shadow-lg rounded-bl-sm"
                      }`}
                      dangerouslySetInnerHTML={{
                        __html: linkify(stripMarkdown(message.content || "")).replace(/\n/g, "<br>"),
                      }}
                    />
                    {/* actions under the bubble */}
                    {message.actions?.length ? (
                      <div className={`mt-2 flex flex-wrap gap-2 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                        {message.actions.map((a, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleAssistantAction(a)}
                            className="text-xs px-2.5 py-1.5 rounded-lg border border-white/20 bg-white/10 hover:bg-white/15 backdrop-blur-md"
                          >
                            {a.label}
                          </button>
                        ))}
                      </div>
                    ) : null}
                    <div className={`text-xs mt-1 ${message.role === "user" ? "text-right" : "text-left"} text-gray-500`}>
                      {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Quick actions */}
              {shouldShowQuick() && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.15 }}
                  className="grid grid-cols-2 gap-2 mt-2"
                >
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
            <div className={`${isCompact ? "p-2.5" : "p-3"} border-t border-white/10 bg-white/5 backdrop-blur-md`} style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}>
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
                  placeholder={guestName ? `Talk to us, ${guestName}…` : "Type your message..."}
                  disabled={loading}
                  className={`flex-1 ${isCompact ? "px-3 py-1.5 text-[13px]" : "px-4 py-2"} rounded-xl bg-white/10 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 border border-white/15 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 disabled:opacity-50 backdrop-blur-md`}
                  aria-label="Type your message"
                />
                <button
                  type="button"
                  onClick={() => sendMessage()}
                  disabled={loading || !input.trim()}
                  className={`${isCompact ? "p-1.5" : "p-2"} rounded-xl shadow-md bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
                  aria-label="Send message"
                >
                  <IoMdSend size={isCompact ? 16 : 18} />
                </button>
              </div>

              <div className={`${isCompact ? "mt-1 text-[10px]" : "mt-2 text-[11px]"} text-center text-gray-600 dark:text-gray-400`}>
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
