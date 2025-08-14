// src/components/ChatWidget.jsx
import React, { useState, useRef, useEffect, useCallback } from "react";
import ReactDOM from "react-dom";
import { chatAxios } from "../lib/chatAxios";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import {
  FaRobot,
  FaTimes,
  FaInfoCircle,
  FaUsers,
  FaProjectDiagram,
  FaHandshake,
} from "react-icons/fa";
import { IoMdSend } from "react-icons/io";
import { fnUrl } from "../lib/api.js";
import { companyInfo } from "../lib/companyInfo.js";

/* -----------------------------------------------------------------------------
   Helpers
----------------------------------------------------------------------------- */
const AVATAR_URL = "/assets/logoSynexiai.png";
const now = () => new Date().toISOString();

// Quick actions
const quickQuestions = [
  {
    icon: <FaInfoCircle className="mr-2" />,
    text: "Tell me about your company",
  },
  { icon: <FaUsers className="mr-2" />, text: "Who is on your team?" },
  {
    icon: <FaProjectDiagram className="mr-2" />,
    text: "What projects are you working on?",
  },
  { icon: <FaHandshake className="mr-2" />, text: "How can we collaborate?" },
  { icon: <FaInfoCircle className="mr-2" />, text: "Show me your site map" }, // optional RAG overview
];

// Sanitize + linkify (avoid XSS; keep clickable links)
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

// System prompt stays client-side (for your initial greeting context only)
const enhancedSystemPrompt = `You are the official AI assistant for ${companyInfo.name}. Follow these rules STRICTLY:

COMPANY INFORMATION (USE ONLY THESE DETAILS):
- Name: ${companyInfo.name}
- Mission: "${companyInfo.mission}"
- Vision: "${companyInfo.vision}"
- Founder: ${companyInfo.team.founder}
- Team: ${companyInfo.team.members.join(", ")}
- Projects: ${companyInfo.projects.join(", ")}
- Contact: ${companyInfo.contact.email} | ${companyInfo.contact.phone}

RESPONSE GUIDELINES:
1. For company questions:
   "We are ${companyInfo.name}. ${companyInfo.mission} Our vision is ${companyInfo.vision}."
2. For founder/team questions:
   "Our founder is ${companyInfo.team.founder}. Key team members include: ${companyInfo.team.members.join(", ")}."
3. For project questions:
   "Current projects: ${companyInfo.projects.join(", ")}."
4. For collaboration:
   "We welcome collaborations! Contact ${companyInfo.contact.email} or call ${companyInfo.contact.phone}."
5. Unknown questions:
   "I specialize in ${companyInfo.name} information. Could you clarify your question?"
6. ALWAYS end with:
   "\\n\\nFor direct inquiries:\\nEmail: ${companyInfo.contact.email}\\nPhone: ${companyInfo.contact.phone}"
`;

const initialMessages = [
  { role: "system", content: enhancedSystemPrompt, timestamp: now() },
  {
    role: "assistant",
    content: `👋 Hello! I'm your ${companyInfo.name} assistant.

How can I help you today? Here are some suggestions:
- Tell me about ${companyInfo.name}
- Who leads your team?
- What projects are you working on?
- How can we collaborate?

Ask me anything!`,
    timestamp: now(),
  },
];

/* -----------------------------------------------------------------------------
   Component
----------------------------------------------------------------------------- */
export default function ChatWidget({ side = "right", z = 9999 }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  const sideBtn =
    side === "left"
      ? `${isMobile ? "left-4" : "left-6"}`
      : `${isMobile ? "right-4" : "right-6"}`;

  const sidePanel =
    side === "left"
      ? `${isMobile ? "left-2" : "left-6"}`
      : `${isMobile ? "right-2" : "right-6"}`;

  const endRef = useRef(null);
  const inputRef = useRef(null);
  const controllerRef = useRef(null);

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Auto-open on desktop after 8s
  useEffect(() => {
    if (!isMobile) {
      const t = setTimeout(() => setOpen(true), 8000);
      return () => clearTimeout(t);
    }
  }, [isMobile]);

  // Scroll + focus
  useEffect(() => {
    if (open) {
      endRef.current?.scrollIntoView({ behavior: "smooth" });
      inputRef.current?.focus();
    }
  }, [messages, open]);

  // Close on Escape
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Quick suggestions only when greeting + first reply
  const shouldShowQuickQuestions = () =>
    messages.filter((m) => m.role !== "system").length <= 2;

  // Send message
  const sendMessage = useCallback(
    async (messageContent = null) => {
      const content = messageContent || input.trim();
      if (!content || loading) return;

      controllerRef.current = new AbortController();
      const signal = controllerRef.current.signal;

      const userMsg = { role: "user", content, timestamp: now() };
      const payload = [
        ...messages.filter((m) => m.role !== "system").slice(-4),
        userMsg,
      ];

      setMessages((prev) => [...prev, userMsg]);
      if (!messageContent) setInput("");
      setLoading(true);
      setError(null);

      try {
        const { data } = await chatAxios.post(
          fnUrl("chat-assistant"),
          { messages: payload },
          { timeout: 10000, signal },
        );

        let responseContent;
        if (data?.error) throw new Error(data.error);
        else if (data?.reply) responseContent = data.reply;
        else if (data?.choices?.[0]?.message?.content)
          responseContent = data.choices[0].message.content;
        else {
          responseContent = `Thank you for your interest in ${companyInfo.name}! We're focused on ${companyInfo.mission.toLowerCase()}.`;
        }

        if (!responseContent.includes(companyInfo.contact.email)) {
          responseContent += `\n\nFor direct inquiries:\nEmail: ${companyInfo.contact.email}\nPhone: ${companyInfo.contact.phone}`;
        }

        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: responseContent,
            timestamp: now(),
            links: Array.isArray(data?.links) ? data.links : [],
          },
        ]);
      } catch (err) {
        if (err.name === "CanceledError" || err.message === "canceled") return;

        console.error("Chat API error:", err);
        setError(err);

        const errorContent =
          err.response?.data?.error?.message ||
          err.message ||
          "Sorry, I encountered an error. Please try again.";

        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: `❗️ ${errorContent}\n\nContact us directly:\nEmail: ${companyInfo.contact.email}\nPhone: ${companyInfo.contact.phone}`,
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

  // Abort in-flight request
  const stopGeneration = () => {
    try {
      controllerRef.current?.abort();
    } catch {
      // no-op
    }
  };

  // Cleanup on unmount
  useEffect(() => () => controllerRef.current?.abort(), []);

  const visibleMessages = messages.filter((m) => m.role !== "system");

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  /* -----------------------------------------------------------------------------
     UI (glassy look + a11y + link cards for RAG)
  ----------------------------------------------------------------------------- */
  const widget = (
    <>
      {/* Floating toggle button */}
      <motion.button
        type="button"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen((o) => !o)}
        className={`fixed ${isMobile ? "bottom-4" : "bottom-6"} ${sideBtn} ${isMobile ? "p-3" : "p-4"} z-[${z}]
          rounded-full shadow-2xl text-white
          bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700
          ring-1 ring-white/20 backdrop-blur-md`}
        aria-label={open ? "Close chat" : "Open chat"}
      >
        {open ? (
          <FaTimes size={isMobile ? 18 : 20} />
        ) : (
          <FaRobot size={isMobile ? 18 : 20} />
        )}
      </motion.button>

      {/* Chat window */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="chat-window"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className={`fixed ${isMobile ? "bottom-16" : "bottom-20"} ${sidePanel} ${isMobile ? "w-[92vw] max-w-[420px]" : "w-[380px]"} z-[${z}]
             max-h-[80dvh] flex flex-col overflow-hidden
             rounded-2xl shadow-2xl ring-1 ring-white/10
             bg-white/5 dark:bg-white/5 backdrop-blur-xl`}
            aria-live="polite"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-cyan-600/90 to-blue-600/90 text-white shadow-md">
              <div className="flex items-center">
                <img
                  src={AVATAR_URL}
                  alt="Company Logo"
                  className="w-7 h-7 rounded-md mr-2 ring-1 ring-white/20"
                />
                <span className="font-semibold">
                  {companyInfo.name} Assistant
                </span>
              </div>
              <div className="flex items-center gap-2">
                {loading && (
                  <button
                    type="button"
                    onClick={stopGeneration}
                    className="px-2 py-1 text-xs rounded-md bg-white/10 hover:bg-white/20 border border-white/20"
                    aria-label="Stop generating"
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
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gradient-to-b from-transparent to-black/5">
              {visibleMessages.map((message, index) => (
                <motion.div
                  key={`${message.timestamp}-${index}`}
                  initial={{
                    opacity: 0,
                    y: message.role === "user" ? 10 : -10,
                  }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex max-w-[92%] ${message.role === "user" ? "ml-auto justify-end" : "mr-auto justify-start"}`}
                >
                  <div className="flex flex-col">
                    <div
                      className={`px-3 py-2 sm:px-4 sm:py-3 rounded-2xl text-sm leading-relaxed
                        ${
                          message.role === "user"
                            ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-br-sm shadow-lg"
                            : "text-gray-900 dark:text-gray-100 bg-white/10 border border-white/15 backdrop-blur-md shadow-lg rounded-bl-sm"
                        }`}
                      // Safe render (escape + linkify + line breaks)
                      dangerouslySetInnerHTML={{
                        __html: linkify(message.content || "").replace(
                          /\n/g,
                          "<br>",
                        ),
                      }}
                    />

                    {/* Optional: render RAG site links if function returns them */}
                    {message.links?.length > 0 && (
                      <div className="mt-2 grid grid-cols-1 gap-2">
                        {message.links.map((l, i) => (
                          <a
                            key={`${l.path}-${i}`}
                            href={l.path}
                            className="block px-3 py-2 rounded-xl bg-white/10 border border-white/15 backdrop-blur-md
                                       hover:bg-white/15 transition text-sm text-gray-900 dark:text-gray-100"
                          >
                            <div className="font-medium">{l.title}</div>
                            <div className="text-xs opacity-75">{l.path}</div>
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}

              {/* Quick questions */}
              {shouldShowQuickQuestions() && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="grid grid-cols-2 gap-2 mt-2"
                >
                  {quickQuestions.map((q, i) => (
                    <button
                      type="button"
                      key={i}
                      onClick={() => sendMessage(q.text)}
                      className="flex items-center p-2 text-xs rounded-xl transition-all
                                 bg-white/10 hover:bg-white/15 border border-white/15
                                 text-gray-900 dark:text-gray-100 backdrop-blur-md"
                    >
                      {q.icon}
                      <span className="text-left">{q.text}</span>
                    </button>
                  ))}
                </motion.div>
              )}

              {/* Loading bubble */}
              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex mr-auto justify-start"
                >
                  <div className="px-3 py-2 rounded-2xl rounded-bl-sm bg-white/10 border border-white/15 backdrop-blur-md shadow-lg text-gray-900 dark:text-gray-100">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" />
                      <div
                        className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      />
                      <div
                        className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                        style={{ animationDelay: "0.4s" }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={endRef} />
            </div>

            {/* Input */}
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
                  className="flex-1 px-4 py-2 rounded-xl
                             bg-white/10 text-gray-900 dark:text-gray-100
                             placeholder:text-gray-500
                             border border-white/15 focus:outline-none focus:ring-2 focus:ring-cyan-400/50
                             disabled:opacity-50 backdrop-blur-md"
                  aria-label="Type your message"
                />
                <button
                  type="button"
                  onClick={() => sendMessage()}
                  disabled={loading || !input.trim()}
                  className="p-2 rounded-xl shadow-md
                             bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700
                             text-white transition-colors
                             disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Send message"
                >
                  <IoMdSend size={18} />
                </button>
              </div>

              <div className="mt-2 text-[11px] text-center text-gray-600 dark:text-gray-400">
                Powered by {companyInfo.name} •{" "}
                <a href="/privacy" className="underline hover:opacity-80">
                  Privacy Policy
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );

  return ReactDOM.createPortal(widget, document.body);
}
