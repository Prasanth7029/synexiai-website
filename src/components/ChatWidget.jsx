// src/components/ChatWidget.jsx
import React, { useState, useRef, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FaRobot, FaTimes } from 'react-icons/fa';
import { IoMdSend } from 'react-icons/io';

// Helper functions
const now = () => new Date().toISOString();
const formatTime = (timestamp) =>
  new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

// Company information
const companyInfo = {
  name: "SynexiAI",
  mission: "To revolutionize human-AI collaboration through innovative technology solutions",
  vision: "A future where AI enhances every aspect of human productivity and creativity",
  team: {
    founder: "Venkat sai Prasanth Kunchanapalli",
    members: [
      "Mr. Prasanth Kunchanapalli - Founder & CEO",
      "Mr. Ram Manoj chinthapalli - Chief Technology Officer",
      "Mr. Teja Peddiboyina - Head of Research",
    ]
  },
  projects: [
    "AI-powered knowledge management systems",
    "Next-generation neural interfaces",
    "Ethical AI framework development"
  ],
  pages: {
    about: "/about",
    team: "/team",
    projects: "/projects",
    contact: "/contact"
  }
};

// Initial messages with enhanced system prompt
const initialMessages = [
  {
    role: 'system',
    content: `
    You are the official ${companyInfo.name} assistant. Your primary responsibilities are:
    1. Introduce visitors to our company (mission: "${companyInfo.mission}", vision: "${companyInfo.vision}")
    2. Explain our projects: ${companyInfo.projects.join(', ')}
    3. Introduce our team: Founder ${companyInfo.team.founder} and key members
    4. Direct users to relevant pages: ${Object.entries(companyInfo.pages).map(([name, path]) => `${name} (${path})`).join(', ')}

    Always respond in a friendly, professional tone. For technical questions, provide detailed but accessible answers.
    When mentioning our team or projects, include relevant page links when appropriate.
    `.trim(),
    timestamp: now(),
  },
  {
    role: 'assistant',
    content: `👋 Welcome to ${companyInfo.name}! I'm your AI guide. Ask me about:
    - Our mission: "${companyInfo.mission}"
    - Our vision for the future
    - Our team and projects
    - Or anything else about our work!`,
    timestamp: now(),
  },
];

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const endRef = useRef(null);
  const inputRef = useRef(null);
  const controllerRef = useRef(null);

  // Scroll to bottom on new message or open
  useEffect(() => {
    if (open) {
      endRef.current?.scrollIntoView({ behavior: 'smooth' });
      inputRef.current?.focus();
    }
  }, [messages, open]);

  const sendMessage = useCallback(async () => {
    if (!input.trim() || loading) return;

    // Create new AbortController for each request
    controllerRef.current = new AbortController();
    const signal = controllerRef.current.signal;

    const userMsg = {
      role: 'user',
      content: input.trim(),
      timestamp: now(),
    };

    // Prepare payload - keep last 6 messages (excluding system) for context
    const payload = [
      ...messages.filter(m => m.role !== 'system').slice(-6),
      userMsg
    ];

    // Optimistically update UI
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    setError(null);

    try {
      const { data } = await axios.post('/.netlify/functions/chat-assistant', {
        messages: payload
      }, {
        timeout: 10000,
        signal // Pass the abort signal
      });

      // Process response with enhanced handling
      let responseContent;
      if (data?.error) {
        throw new Error(data.error);
      } else if (data?.reply) {
        responseContent = data.reply;
      } else if (data?.choices?.[0]?.message?.content) {
        responseContent = data.choices[0].message.content;
      } else if (typeof data === 'string') {
        responseContent = data;
      } else {
        responseContent = "I've got some information for you! " +
          `At ${companyInfo.name}, we're focused on ${companyInfo.mission.toLowerCase()}. ` +
          `Learn more on our <a href="${companyInfo.pages.about}" target="_blank">about page</a>.`;
      }

      const aiMsg = {
        role: 'assistant',
        content: responseContent,
        timestamp: now(),
      };

      setMessages(prev => [...prev, aiMsg]);

    } catch (err) {
      // Ignore abort errors
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
          content: `❗️ ${errorContent}`,
          timestamp: now()
        },
      ]);
    } finally {
      setLoading(false);
      controllerRef.current = null;
    }
  }, [input, messages, loading]);

  // Clean up pending requests on unmount
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
        className="fixed bottom-6 right-6 z-[9999] p-4 bg-cyan-600 rounded-full shadow-xl text-white hover:bg-cyan-700 transition-colors"
        aria-label={open ? 'Close chat' : 'Open chat'}
      >
        {open ? <FaTimes size={20} /> : <FaRobot size={20} />}
      </motion.button>

      {/* Chat window */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="chat-window"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-20 right-6 z-[9999] w-80 max-h-[70vh] flex flex-col bg-gray-900 rounded-xl shadow-2xl overflow-hidden border border-gray-700"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-gray-800 border-b border-gray-700">
              <span className="text-white font-semibold">{companyInfo.name} Assistant</span>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-300 hover:text-white p-1 focus:outline-none"
                aria-label="Close chat"
              >
                <FaTimes size={16} />
              </button>
            </div>

            {/* Messages container */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {visibleMessages.map((message, index) => (
                <motion.div
                  key={`${message.timestamp}-${index}`}
                  initial={{ opacity: 0, y: message.role === 'user' ? 10 : -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex max-w-[90%] ${message.role === 'user' ? 'ml-auto justify-end' : 'mr-auto justify-start'}`}
                >
                  <div
                    className={`p-3 rounded-lg ${message.role === 'user'
                      ? 'bg-cyan-600 text-white rounded-br-none'
                      : 'bg-gray-700 text-gray-100 rounded-bl-none'}`}
                    dangerouslySetInnerHTML={{
                      __html: message.content.replace(
                        /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig,
                        url => `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-cyan-300 hover:underline">${url}</a>`
                      )
                    }}
                  >
                  </div>
                </motion.div>
              ))}

              {/* Loading indicator */}
              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex mr-auto justify-start"
                >
                  <div className="p-3 rounded-lg bg-gray-700 text-gray-100 rounded-bl-none">
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
            <div className="p-3 border-t border-gray-700 bg-gray-800">
              {error && (
                <div className="mb-2 px-3 py-2 text-xs text-red-300 bg-red-900/50 rounded">
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
                  className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50"
                  aria-label="Type your message"
                />
                <button
                  onClick={sendMessage}
                  disabled={loading || !input.trim()}
                  className="p-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label="Send message"
                >
                  <IoMdSend size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );

  return ReactDOM.createPortal(widget, document.body);
}