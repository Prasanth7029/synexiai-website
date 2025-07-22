// src/components/ChatWidget.jsx
import React, { useState, useRef, useEffect, useCallback } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FaRobot, FaTimes, FaInfoCircle, FaUsers, FaProjectDiagram, FaHandshake, FaRegThumbsUp, FaRegThumbsDown } from "react-icons/fa";
import { IoMdSend } from "react-icons/io";
import { fnUrl } from "../lib/api.js";
import { companyInfo } from "../lib/companyInfo.js";

const AVATAR_URL = "/assets/logoSynexiai.png";
const now = () => new Date().toISOString();
const LOCAL_STORAGE_KEY = "synexi-chat-history-v1";

const quickQuestions = [
  { icon: <FaInfoCircle className="mr-2" />, text: "Tell me about your company" },
  { icon: <FaUsers className="mr-2" />, text: "Who is on your team?" },
  { icon: <FaProjectDiagram className="mr-2" />, text: "What projects are you working on?" },
  { icon: <FaHandshake className="mr-2" />, text: "How can we collaborate?" }
];

const enhancedSystemPrompt = `
You are the official AI assistant for ${companyInfo.name}. Follow these rules STRICTLY:
COMPANY INFORMATION (USE ONLY THESE DETAILS):
- Name: ${companyInfo.name}
- Mission: "${companyInfo.mission}"
- Vision: "${companyInfo.vision}"
- Founder: ${companyInfo.team.founder}
- Team: ${companyInfo.team.members.join(', ')}
- Projects: ${companyInfo.projects.join(', ')}
- Contact: ${companyInfo.contact.email} | ${companyInfo.contact.phone}
RESPONSE GUIDELINES:
1. For company questions:
   "We are ${companyInfo.name}. ${companyInfo.mission} Our vision is ${companyInfo.vision}."
2. For founder/team questions:
   "Our founder is ${companyInfo.team.founder}. Key team members include: ${companyInfo.team.members.join(', ')}."
3. For project questions:
   "Current projects: ${companyInfo.projects.join(', ')}."
4. For collaboration:
   "We welcome collaborations! Contact ${companyInfo.contact.email} or call ${companyInfo.contact.phone}."
5. Unknown questions:
   "I specialize in ${companyInfo.name} information. Could you clarify your question?"
6. ALWAYS end with:
   "\\n\\nFor direct inquiries:\\nEmail: ${companyInfo.contact.email}\\nPhone: ${companyInfo.contact.phone}"
`;

const initialMessages = [
  {
    role: "system",
    content: enhancedSystemPrompt,
    timestamp: now(),
  },
  {
    role: "assistant",
    content: `👋 Hello! I'm your ${companyInfo.name} assistant.<br><br>
How can I help you today? Here are some suggestions:<br>
- Tell me about ${companyInfo.name}<br>
- Who leads your team?<br>
- What projects are you working on?<br>
- How can we collaborate?<br><br>
Ask me anything!`,
    timestamp: now(),
    id: "greeting"
  },
];

function FeedbackButtons({ onFeedback, disabled, given }) {
  return (
    <div className="flex items-center gap-1 mt-1">
      <button
        className={`p-1 rounded hover:bg-cyan-100 dark:hover:bg-cyan-900 transition-colors ${given === "up" ? "text-green-500" : "text-gray-400"}`}
        title="Helpful"
        disabled={disabled || given}
        onClick={() => onFeedback("up")}
        aria-label="Thumbs up"
        type="button"
      >
        <FaRegThumbsUp />
      </button>
      <button
        className={`p-1 rounded hover:bg-rose-100 dark:hover:bg-rose-900 transition-colors ${given === "down" ? "text-red-500" : "text-gray-400"}`}
        title="Not helpful"
        disabled={disabled || given}
        onClick={() => onFeedback("down")}
        aria-label="Thumbs down"
        type="button"
      >
        <FaRegThumbsDown />
      </button>
      {given && (
        <span className="ml-1 text-xs text-cyan-500">
          Thanks for your feedback!
        </span>
      )}
    </div>
  );
}

export default function ChatWidget() {
  const [messages, setMessages] = useState(() => {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch { /* ignore */ }
    return initialMessages;
  });
  const [feedbackMap, setFeedbackMap] = useState({});
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const endRef = useRef(null);
  const inputRef = useRef(null);
  const controllerRef = useRef(null);
  const liveRegionRef = useRef(null);

  // Responsiveness
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Auto-open on desktop
  useEffect(() => {
    if (!isMobile) {
      const timer = setTimeout(() => setOpen(true), 8000);
      return () => clearTimeout(timer);
    }
  }, [isMobile]);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
      endRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  // Clean up abort controller
  useEffect(() => () => controllerRef.current?.abort(), []);

  const shouldShowQuickQuestions = () =>
    messages.filter(m => m.role !== "system").length <= 2;

  const handleFeedback = (msgIdx, type) => {
    setFeedbackMap(prev => ({ ...prev, [msgIdx]: type }));
    // Optionally send feedback to analytics here
  };

  const resetChat = () => {
    setMessages(initialMessages);
    setFeedbackMap({});
    setInput("");
    setError(null);
    inputRef.current?.focus();
  };

  const sendMessage = useCallback(async (messageContent = null) => {
    const content = messageContent || input.trim();
    if (!content || loading) return;

    controllerRef.current = new AbortController();
    const signal = controllerRef.current.signal;

    const userMsg = {
      role: "user",
      content,
      timestamp: now(),
    };

    // Only last 4 for context (excluding system)
    const contextMsgs = [
      ...messages.filter(m => m.role !== "system").slice(-4),
      userMsg
    ];

    setMessages(prev => [...prev, userMsg]);
    if (!messageContent) setInput("");
    setLoading(true);
    setError(null);

    try {
      const { data } = await axios.post(
        fnUrl("chat-assistant"),
        { messages: contextMsgs },
        { timeout: 10000, signal }
      );

      let responseContent;
      if (data?.error) throw new Error(data.error);
      else if (data?.reply) responseContent = data.reply;
      else if (data?.choices?.[0]?.message?.content)
        responseContent = data.choices[0].message.content;
      else
        responseContent =
          `Thank you for your interest in ${companyInfo.name}! ` +
          `We're focused on ${companyInfo.mission.toLowerCase()}.`;

      if (!responseContent.includes(companyInfo.contact.email)) {
        responseContent += `<br><br>For direct inquiries:<br>Email: <a href="mailto:${companyInfo.contact.email}" class="text-cyan-600 underline">${companyInfo.contact.email}</a><br>Phone: ${companyInfo.contact.phone}`;
      }

      const aiMsg = {
        role: "assistant",
        content: responseContent,
        timestamp: now(),
      };

      setMessages(prev => [...prev, aiMsg]);
      if (liveRegionRef.current) {
        liveRegionRef.current.textContent = "Assistant replied: " + (responseContent.replace(/(<([^>]+)>)/gi, "")).slice(0, 120);
      }
    } catch (err) {
      if (err.name === "CanceledError" || err.message === "canceled") return;
      setError(err);
      const errorContent =
        err.response?.data?.error?.message ||
        err.message ||
        "Sorry, I encountered an error. Please try again.";

      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content: `❗️ ${errorContent}<br><br>Contact us directly:<br>Email: <a href="mailto:${companyInfo.contact.email}" class="text-cyan-600 underline">${companyInfo.contact.email}</a><br>Phone: ${companyInfo.contact.phone}`,
          timestamp: now(),
        }
      ]);
    } finally {
      setLoading(false);
      controllerRef.current = null;
    }
  }, [input, messages, loading]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const visibleMessages = messages.filter(m => m.role !== "system");

  // --------- FIX: Always mount the portal, never conditionally render it ----------
  return ReactDOM.createPortal(
    <div id="synexi-chat-portal-root">
      {/* Floating button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => setOpen(o => !o)}
        className={`fixed ${isMobile ? "bottom-4 right-4 p-3" : "bottom-6 right-6 p-4"} z-[9999] bg-gradient-to-r from-cyan-600 to-blue-600 rounded-full shadow-xl text-white hover:from-cyan-700 hover:to-blue-700 transition-colors`}
        aria-label={open ? "Close chat" : "Open chat"}
        type="button"
      >
        {open ? <FaTimes size={isMobile ? 18 : 22} /> : <FaRobot size={isMobile ? 18 : 22} />}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            key="chat-window"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 60 }}
            className={`fixed ${isMobile ? "bottom-16 right-2 left-2 w-auto" : "bottom-20 right-6 w-[370px]"} z-[9999] max-h-[80vh] flex flex-col bg-white dark:bg-gray-900 rounded-xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700`}
            role="dialog"
            aria-modal="true"
            aria-label={`${companyInfo.name} Assistant Chat`}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white">
              <div className="flex items-center">
                <img src={AVATAR_URL} alt="Company Logo" className="w-7 h-7 rounded-full mr-2" />
                <span className="font-semibold">{companyInfo.name} Assistant</span>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-white hover:text-gray-200 p-1 focus:outline-none"
                aria-label="Close chat"
                type="button"
              >
                <FaTimes size={16} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4" aria-live="polite" ref={liveRegionRef} tabIndex={0} role="log">
              {visibleMessages.map((message, index) => (
                <motion.div
                  key={message.timestamp + "-" + index}
                  initial={{ opacity: 0, y: message.role === "user" ? 10 : -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex max-w-[90%] ${message.role === "user" ? "ml-auto justify-end" : "mr-auto justify-start"}`}
                >
                  <div
                    className={`p-3 rounded-lg text-sm shadow ${message.role === "user"
                      ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-br-none"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 shadow-sm rounded-bl-none border border-gray-200 dark:border-gray-700"
                    }`}
                    dangerouslySetInnerHTML={{
                      __html: message.content.replace(
                        /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig,
                        url => `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-blue-600 dark:text-blue-400 hover:underline">${url}</a>`
                      )
                    }}
                  />
                  {message.role === "assistant" && index !== 0 && (
                    <FeedbackButtons
                      onFeedback={type => handleFeedback(index, type)}
                      disabled={!!feedbackMap[index]}
                      given={feedbackMap[index]}
                    />
                  )}
                </motion.div>
              ))}

              {shouldShowQuickQuestions() && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="grid grid-cols-2 gap-2 mt-4"
                >
                  {quickQuestions.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => sendMessage(q.text)}
                      className="flex items-center p-2 text-xs bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                      type="button"
                    >
                      {q.icon}
                      <span className="text-left">{q.text}</span>
                    </button>
                  ))}
                  <button
                    onClick={resetChat}
                    className="flex items-center p-2 text-xs bg-rose-100 dark:bg-rose-900/70 text-rose-600 dark:text-rose-300 rounded-lg border border-rose-200 dark:border-rose-700 hover:bg-rose-200 dark:hover:bg-rose-800 transition-colors col-span-2 justify-center mt-1"
                    title="Clear chat and restart"
                    type="button"
                  >
                    <FaTimes className="mr-2" /> Reset chat
                  </button>
                </motion.div>
              )}

              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex mr-auto justify-start"
                >
                  <div className="p-3 rounded-lg bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-100 rounded-bl-none shadow-sm border border-gray-300 dark:border-gray-700">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce"></div>
                      <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                      <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={endRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              {error && (
                <div className="mb-2 px-3 py-2 text-xs text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/50 rounded">
                  Error: {error.message}
                </div>
              )}
              <div className="flex items-center space-x-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your message..."
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50"
                  aria-label="Type your message"
                  autoFocus={open}
                />
                <button
                  onClick={() => sendMessage()}
                  disabled={loading || !input.trim()}
                  className="p-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg hover:from-cyan-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label="Send message"
                  type="button"
                >
                  <IoMdSend size={18} />
                </button>
              </div>
              <div className="mt-2 text-xs text-center text-gray-500 dark:text-gray-400">
                Powered by <span className="font-semibold">{companyInfo.name}</span> •{" "}
                <a href="/privacy" className="hover:underline">Privacy Policy</a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>,
    document.body
  );
}
