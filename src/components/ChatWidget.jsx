// src/components/ChatWidget.jsx
import React, { useState, useRef, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FaRobot, FaTimes, FaInfoCircle, FaUsers, FaProjectDiagram, FaHandshake } from 'react-icons/fa';
import { IoMdSend } from 'react-icons/io';
import { fnUrl } from '../lib/api.js';
import { companyInfo } from '../lib/companyInfo.js';

// Helper functions
const now = () => new Date().toISOString();

// Predefined quick questions
const quickQuestions = [
  {
    icon: <FaInfoCircle className="mr-2" />,
    text: "Tell me about your company"
  },
  {
    icon: <FaUsers className="mr-2" />,
    text: "Who is on your team?"
  },
  {
    icon: <FaProjectDiagram className="mr-2" />,
    text: "What projects are you working on?"
  },
  {
    icon: <FaHandshake className="mr-2" />,
    text: "How can we collaborate?"
  }
];

// Enhanced system prompt for the AI (not sent to server, just for initial message context)
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

// Initial messages
const initialMessages = [
  {
    role: 'system',
    content: enhancedSystemPrompt,
    timestamp: now(),
  },
  {
    role: 'assistant',
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

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const endRef = useRef(null);
  const inputRef = useRef(null);
  const controllerRef = useRef(null);

  // Check for mobile devices
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto-open on desktop after 8 seconds
  useEffect(() => {
    if (!isMobile) {
      const timer = setTimeout(() => {
        setOpen(true);
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [isMobile]);

  // Scroll handling
  useEffect(() => {
    if (open) {
      endRef.current?.scrollIntoView({ behavior: 'smooth' });
      inputRef.current?.focus();
    }
  }, [messages, open]);

  // Always show quick questions if only greeting is present or after user closes chat and reopens
  const shouldShowQuickQuestions = () =>
    messages.filter(m => m.role !== 'system').length <= 2;

  const sendMessage = useCallback(async (messageContent = null) => {
    const content = messageContent || input.trim();
    if (!content || loading) return;

    controllerRef.current = new AbortController();
    const signal = controllerRef.current.signal;

    const userMsg = {
      role: 'user',
      content: content,
      timestamp: now(),
    };

    // Only keep last 4 messages for context (excluding system)
    const payload = [
      ...messages.filter(m => m.role !== 'system').slice(-4),
      userMsg
    ];

    setMessages(prev => [...prev, userMsg]);
    if (!messageContent) setInput('');
    setLoading(true);
    setError(null);

    try {
      // Backend does validation, don't send company_info
      const { data } = await axios.post(fnUrl('chat-assistant'), { messages: payload }, {
        timeout: 10000,
        signal
      });

      let responseContent;
      if (data?.error) {
        throw new Error(data.error);
      } else if (data?.reply) {
        responseContent = data.reply;
      } else if (data?.choices?.[0]?.message?.content) {
        responseContent = data.choices[0].message.content;
      } else {
        responseContent = `Thank you for your interest in ${companyInfo.name}! ` +
          `We're focused on ${companyInfo.mission.toLowerCase()}.`;
      }

      // Ensure response ends with contact info
      if (!responseContent.includes(companyInfo.contact.email)) {
        responseContent += `\n\nFor direct inquiries:\nEmail: ${companyInfo.contact.email}\nPhone: ${companyInfo.contact.phone}`;
      }

      const aiMsg = {
        role: 'assistant',
        content: responseContent,
        timestamp: now(),
      };

      setMessages(prev => [...prev, aiMsg]);

    } catch (err) {
      if (err.name === 'CanceledError' || err.message === 'canceled') return;

      console.error('Chat API error:', err);
      setError(err);

      const errorContent = err.response?.data?.error?.message ||
                         err.message ||
                         'Sorry, I encountered an error. Please try again.';

      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: `❗️ ${errorContent}\n\nContact us directly:\nEmail: ${companyInfo.contact.email}\nPhone: ${companyInfo.contact.phone}`,
          timestamp: now()
        },
      ]);
    } finally {
      setLoading(false);
      controllerRef.current = null;
    }
  }, [input, messages, loading]);

  // Clean up pending requests
  useEffect(() => {
    return () => {
      if (controllerRef.current) {
        controllerRef.current.abort();
      }
    };
  }, []);

  // Filter out system messages for display
  const visibleMessages = messages.filter(m => m.role !== 'system');

  // Handle key events
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Chat widget component
  const widget = (
    <>
      {/* Floating toggle button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(o => !o)}
        className={`fixed ${isMobile ? 'bottom-4 right-4 p-3' : 'bottom-6 right-6 p-4'} z-[9999] bg-gradient-to-r from-cyan-600 to-blue-600 rounded-full shadow-xl text-white hover:from-cyan-700 hover:to-blue-700 transition-colors`}
        aria-label={open ? 'Close chat' : 'Open chat'}
      >
        {open ? <FaTimes size={isMobile ? 18 : 20} /> : <FaRobot size={isMobile ? 18 : 20} />}
      </motion.button>

      {/* Chat window */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="chat-window"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className={`fixed ${isMobile ? 'bottom-16 right-2 left-2 w-auto' : 'bottom-20 right-6 w-96'} z-[9999] max-h-[80vh] flex flex-col bg-gray-50 dark:bg-gray-900 rounded-xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700`}
          >
            {/* Header with gradient */}
            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white">
              <div className="flex items-center">
                <FaRobot className="mr-2" />
                <span className="font-semibold">{companyInfo.name} Assistant</span>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-white hover:text-gray-200 p-1 focus:outline-none"
                aria-label="Close chat"
              >
                <FaTimes size={16} />
              </button>
            </div>

            {/* Messages container */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {visibleMessages.map((message, index) => (
                <motion.div
                  key={`${message.timestamp}-${index}`}
                  initial={{ opacity: 0, y: message.role === 'user' ? 10 : -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex max-w-[90%] ${message.role === 'user' ? 'ml-auto justify-end' : 'mr-auto justify-start'}`}
                >
                  <div
                    className={`p-3 rounded-lg ${message.role === 'user'
                      ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-br-none'
                      : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 shadow-sm rounded-bl-none border border-gray-200 dark:border-gray-700'}`}
                    dangerouslySetInnerHTML={{
                      __html: message.content.replace(
                        /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig,
                        url => `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-blue-600 dark:text-blue-400 hover:underline">${url}</a>`
                      ).replace(/\n/g, '<br>')
                    }}
                  />
                </motion.div>
              ))}

              {/* Quick questions (only show after initial message or when chat is cleared) */}
              {shouldShowQuickQuestions() && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="grid grid-cols-2 gap-2 mt-4"
                >
                  {quickQuestions.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => sendMessage(q.text)}
                      className="flex items-center p-2 text-xs bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      {q.icon}
                      <span className="text-left">{q.text}</span>
                    </button>
                  ))}
                </motion.div>
              )}

              {/* Loading indicator */}
              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex mr-auto justify-start"
                >
                  <div className="p-3 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-bl-none shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={endRef} />
            </div>

            {/* Input area */}
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
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your message..."
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50"
                  aria-label="Type your message"
                />
                <button
                  onClick={() => sendMessage()}
                  disabled={loading || !input.trim()}
                  className="p-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg hover:from-cyan-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label="Send message"
                >
                  <IoMdSend size={18} />
                </button>
              </div>
              <div className="mt-2 text-xs text-center text-gray-500 dark:text-gray-400">
                Powered by {companyInfo.name} • <a href="/privacy" className="hover:underline">Privacy Policy</a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );

  return ReactDOM.createPortal(widget, document.body);
}
