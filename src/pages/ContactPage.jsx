// src/pages/ContactPage.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * ContactPage — SynexiAI theme-compatible
 * - Transparent glass surfaces via .section/.card and tokens
 * - Inputs follow tokens (card surface, border, focus ring)
 * - Sticky info rail on desktop, fluid form on all screens
 * - Keeps Formspree + validation + toast + particles
 */

export default function ContactPage() {
  // ------------------ State ------------------
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    inquiryType: "general",
  });

  const [status, setStatus] = useState(null); // 'success' | 'error' | null
  const [showToast, setShowToast] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const toastRef = useRef(null);
  const timeoutRef = useRef(null);

  // ------------------ Particles (subtle, theme-aware) ------------------
  const particles = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 15; i++) {
      arr.push({
        id: i,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        size: Math.random() * 10 + 2,
        dy: Math.random() * 30 - 15,
        dx: Math.random() * 30 - 15,
        duration: Math.random() * 5 + 3,
      });
    }
    return arr;
  }, []);

  // ------------------ Effects ------------------
  useEffect(() => {
    if (showToast && toastRef.current) toastRef.current.focus();
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [showToast]);

  // ------------------ Handlers ------------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((s) => ({ ...s, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validate = () => {
    const next = {};
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      next.name = "Please enter your full name.";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      next.email = "Enter a valid email address.";
    }
    if (!formData.message.trim() || formData.message.trim().length < 10) {
      next.message = "Please share a bit more detail (10+ characters).";
    }
    return next;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validate();
    if (Object.keys(v).length) {
      setErrors(v);
      return;
    }

    setIsSubmitting(true);
    try {
      const formPayload = new FormData();
      formPayload.append("name", formData.name);
      formPayload.append("_replyto", formData.email);
      formPayload.append(
        "subject",
        `[SynexiAI] ${formData.subject || formData.inquiryType}`,
      );
      formPayload.append(
        "message",
        `Inquiry Type: ${formData.inquiryType}\n\n${formData.message}`,
      );
      formPayload.append("_honey", ""); // honeypot

      // TIP: move id to env: import.meta.env.VITE_FORMSPREE_ID
      const response = await fetch("https://formspree.io/f/xyzpgkbo", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: formPayload,
      });

      if (response.ok) {
        setStatus("success");
        setShowToast(true);
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
          inquiryType: "general",
        });
        timeoutRef.current = setTimeout(() => setShowToast(false), 3500);
      } else {
        setStatus("error");
        setShowToast(true);
        timeoutRef.current = setTimeout(() => setShowToast(false), 3000);
      }
    } catch {
      setStatus("error");
      setShowToast(true);
      timeoutRef.current = setTimeout(() => setShowToast(false), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ------------------ Reusable styles via tokens ------------------
  const fieldBase =
    "w-full h-12 rounded-lg px-4 focus:outline-none transition";
  const fieldBox = {
    background: "color-mix(in oklab, var(--card-bg) 86%, transparent)",
    color: "var(--color-text)",
    border: "1px solid var(--border-color)",
  };
  const fieldFocus = {
    boxShadow: "0 0 0 2px color-mix(in oklab, var(--primary) 60%, transparent)",
    borderColor: "color-mix(in oklab, var(--primary) 60%, var(--border-color))",
  };
  const textareaBase =
    "w-full rounded-lg px-4 py-3 focus:outline-none transition";

  // ------------------ Render ------------------
  return (
    <div className="relative min-h-screen overflow-hidden py-12 md:py-16">
      {/* Decorative particles (very subtle, token color) */}
      <div className="absolute inset-0 z-0 hidden sm:block pointer-events-none" aria-hidden="true">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full"
            style={{
              top: p.top,
              left: p.left,
              width: p.size,
              height: p.size,
              background:
                "radial-gradient(circle at 40% 40%, color-mix(in oklab, var(--primary) 22%, transparent), transparent 70%)",
            }}
            animate={{ y: [0, p.dy], x: [0, p.dx] }}
            transition={{ duration: p.duration, repeat: Infinity, repeatType: "reverse" }}
          />
        ))}
      </div>

      {/* Toast (glass + accent border; accessible) */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            role="status"
            aria-live="polite"
            tabIndex={-1}
            ref={toastRef}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 w-full max-w-xs rounded-xl shadow-lg z-[60] focus:outline-none section px-5 py-3"
            style={{
              background: "color-mix(in oklab, var(--card-bg) 82%, transparent)",
              borderColor:
                status === "success"
                  ? "color-mix(in oklab, var(--primary) 60%, var(--border-color))"
                  : "color-mix(in oklab, #ef4444 60%, var(--border-color))",
            }}
          >
            <div
              className="flex items-center justify-between gap-3"
              style={{ color: "var(--color-text)" }}
            >
              <div className="flex items-center gap-3">
                {status === "success" ? (
                  <span className="badge-check" aria-hidden="true" />
                ) : (
                  <span
                    aria-hidden="true"
                    className="badge-check"
                    style={{ background: "#ef4444" }}
                  />
                )}
                <span>
                  {status === "success"
                    ? "Message sent! We’ll contact you soon."
                    : "Error sending message. Please try again."}
                </span>
              </div>
              <button
                onClick={() => setShowToast(false)}
                aria-label="Dismiss notification"
                style={{ color: "color-mix(in oklab, var(--color-text) 85%, transparent)" }}
              >
                ✕
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 mx-auto w-11/12 lg:w-4/5 max-w-[1200px] text-center mb-10 md:mb-12"
      >
        <div
          className="inline-block px-6 py-2 rounded-full mb-6 text-sm font-medium"
          style={{
            color: "#fff",
            backgroundImage: "linear-gradient(90deg, var(--secondary), #2563eb)",
          }}
        >
          Connect With The Future
        </div>

        <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-4">
          <span className="bg-clip-text text-transparent brand-gradient">
            Shape Tomorrow Together
          </span>
        </h1>

        <p
          className="text-base sm:text-lg max-w-2xl mx-auto"
          style={{ color: "color-mix(in oklab, var(--color-text) 82%, transparent)" }}
        >
          Whether you’re an investor, tech partner, or fellow innovator, let’s
          collaborate to build sustainable AI solutions that transform
          industries.
        </p>
      </motion.div>

      {/* Main content @ ~80% width */}
      <div className="relative z-10 mx-auto w-11/12 lg:w-4/5 max-w-[1200px]">
        {/* Two-column: fixed 320px + fluid */}
        <div className="grid grid-cols-1 lg:[grid-template-columns:320px_1fr] gap-6 md:gap-8">
          {/* LEFT rail (sticky) */}
          <div className="space-y-6 lg:sticky lg:top-24 self-start">
            <div className="section p-6 h-full">
              <div className="text-2xl mb-3" aria-hidden="true" style={{ color: "var(--primary)" }}>
                🌐
              </div>
              <h3 className="text-xl font-bold mb-2" style={{ color: "var(--color-text)" }}>
                Our Vision
              </h3>
              <p style={{ color: "color-mix(in oklab, var(--color-text) 85%, transparent)" }}>
                Merging AI innovation with sustainable infrastructure to create
                technology that serves humanity and protects our planet.
              </p>
            </div>

            <div className="section p-6 h-full">
              <div className="text-2xl mb-3" aria-hidden="true" style={{ color: "var(--primary)" }}>
                🤝
              </div>
              <h3 className="text-xl font-bold mb-2" style={{ color: "var(--color-text)" }}>
                Partnership Opportunities
              </h3>
              <ul className="space-y-2" style={{ color: "color-mix(in oklab, var(--color-text) 85%, transparent)" }}>
                <li>• AI Research Collaborations</li>
                <li>• Green Tech Investments</li>
                <li>• Sustainable Infrastructure</li>
                <li>• Enterprise Solutions</li>
              </ul>
            </div>
          </div>

          {/* RIGHT form panel */}
          <motion.form
            noValidate
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="section p-4 sm:p-8 shadow-xl"
            style={{ background: "color-mix(in oklab, var(--card-bg) 86%, transparent)" }}
          >
            {/* Responsive 2-up grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Name */}
              <div className="flex flex-col">
                <label htmlFor="name" className="text-sm mb-2" style={{ color: "color-mix(in oklab, var(--color-text) 80%, transparent)" }}>
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className={fieldBase}
                  style={{
                    ...fieldBox,
                    ...(errors.name ? { borderColor: "#fb7185" } : null),
                  }}
                  placeholder="Venkat Sai Prasanth"
                  aria-invalid={!!errors.name}
                  onFocus={(e) => Object.assign(e.currentTarget.style, fieldFocus)}
                  onBlur={(e) => Object.assign(e.currentTarget.style, fieldBox, errors.name ? { borderColor: "#fb7185" } : {})}
                />
                {errors.name && (
                  <p className="mt-1 text-sm" style={{ color: "#fb7185" }}>
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="flex flex-col">
                <label htmlFor="email" className="text-sm mb-2" style={{ color: "color-mix(in oklab, var(--color-text) 80%, transparent)" }}>
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className={fieldBase}
                  style={{
                    ...fieldBox,
                    ...(errors.email ? { borderColor: "#fb7185" } : null),
                  }}
                  placeholder="hello@synexi.ai"
                  aria-invalid={!!errors.email}
                  onFocus={(e) => Object.assign(e.currentTarget.style, fieldFocus)}
                  onBlur={(e) => Object.assign(e.currentTarget.style, fieldBox, errors.email ? { borderColor: "#fb7185" } : {})}
                />
                {errors.email && (
                  <p className="mt-1 text-sm" style={{ color: "#fb7185" }}>
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Subject */}
              <div className="flex flex-col">
                <label htmlFor="subject" className="text-sm mb-2" style={{ color: "color-mix(in oklab, var(--color-text) 80%, transparent)" }}>
                  Subject
                </label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  value={formData.subject}
                  onChange={handleChange}
                  className={fieldBase}
                  style={fieldBox}
                  placeholder="Partnership Opportunity"
                  onFocus={(e) => Object.assign(e.currentTarget.style, fieldFocus)}
                  onBlur={(e) => Object.assign(e.currentTarget.style, fieldBox)}
                />
              </div>

              {/* Inquiry Type */}
              <div className="flex flex-col">
                <label htmlFor="inquiryType" className="text-sm mb-2" style={{ color: "color-mix(in oklab, var(--color-text) 80%, transparent)" }}>
                  Inquiry Type
                </label>
                <select
                  id="inquiryType"
                  name="inquiryType"
                  value={formData.inquiryType}
                  onChange={handleChange}
                  className={fieldBase}
                  style={fieldBox}
                  onFocus={(e) => Object.assign(e.currentTarget.style, fieldFocus)}
                  onBlur={(e) => Object.assign(e.currentTarget.style, fieldBox)}
                >
                  <option value="general">General Inquiry</option>
                  <option value="partnership">Partnership Opportunity</option>
                  <option value="investment">Investment Inquiry</option>
                  <option value="technical">Technical Collaboration</option>
                  <option value="press">Press &amp; Media</option>
                  <option value="career">Career Opportunity</option>
                </select>
              </div>

              {/* Message (span 2) */}
              <div className="md:col-span-2">
                <label htmlFor="message" className="text-sm mb-2" style={{ color: "color-mix(in oklab, var(--color-text) 80%, transparent)" }}>
                  Your Vision
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="6"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className={textareaBase}
                  style={fieldBox}
                  placeholder="How can we collaborate to build a sustainable tech future?"
                  aria-invalid={!!errors.message}
                  onFocus={(e) => Object.assign(e.currentTarget.style, fieldFocus)}
                  onBlur={(e) => Object.assign(e.currentTarget.style, fieldBox)}
                />
                {errors.message && (
                  <p className="mt-1 text-sm" style={{ color: "#fb7185" }}>
                    {errors.message}
                  </p>
                )}
              </div>
            </div>

            {/* Submit */}
            <motion.button
              whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
              whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
              type="submit"
              disabled={isSubmitting}
              className="btn-primary mt-6 w-full h-12 rounded-xl font-bold flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2"
              style={isSubmitting ? { filter: "grayscale(35%)", cursor: "not-allowed" } : undefined}
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span>Sending Message...</span>
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>Send Message to SynexiAI</span>
                </>
              )}
            </motion.button>
          </motion.form>
        </div>

        {/* Other ways to connect */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="text-center py-8 mt-10"
          style={{ borderTop: "1px solid var(--border-color)" }}
        >
          <h3 className="text-xl font-bold mb-4" style={{ color: "var(--primary)" }}>
            Other Ways to Connect
          </h3>
          <div className="flex flex-wrap justify-center gap-6">
            <a
              href="https://linkedin.com/company/synexiai"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center transition"
              style={{ color: "color-mix(in oklab, var(--color-text) 85%, transparent)" }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
              LinkedIn
            </a>
            <a
              href="https://github.com/synexiai"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center transition"
              style={{ color: "color-mix(in oklab, var(--color-text) 85%, transparent)" }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              GitHub
            </a>
            <div className="flex items-center" style={{ color: "color-mix(in oklab, var(--color-text) 85%, transparent)" }}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              kvsprasanth007@gmail.com
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
