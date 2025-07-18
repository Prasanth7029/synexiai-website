import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    inquiryType: "general"
  });

  const [status, setStatus] = useState(null); // 'success' | 'error' | null
  const [showToast, setShowToast] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formPayload = new FormData();
      formPayload.append("name", formData.name);
      formPayload.append("_replyto", formData.email);
      formPayload.append("subject", `[SynexisAI] ${formData.subject || formData.inquiryType}`);
      formPayload.append("message", `Inquiry Type: ${formData.inquiryType}\n\n${formData.message}`);
      formPayload.append("_honey", ""); // Honeypot for spam prevention

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
          inquiryType: "general"
        });
        setTimeout(() => setShowToast(false), 3500);
      } else {
        setStatus("error");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      }
    } catch (error) {
      setStatus("error");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 py-16 px-4 sm:px-6 relative overflow-hidden">
      {/* Floating Particles Background */}
      <div className="absolute inset-0 z-0">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-cyan-500/10"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 10 + 2}px`,
              height: `${Math.random() * 10 + 2}px`,
            }}
            animate={{
              y: [0, Math.random() * 30 - 15],
              x: [0, Math.random() * 30 - 15],
            }}
            transition={{
              duration: Math.random() * 5 + 3,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        ))}
      </div>

      <div className="max-w-2xl mx-auto relative z-10">
        {/* Animated Toast Notification */}
        <AnimatePresence>
          {showToast && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`fixed top-6 right-6 px-6 py-3 rounded-xl shadow-lg z-50 flex items-center space-x-3
                ${status === "success" ? "bg-gradient-to-r from-green-600 to-emerald-700" : "bg-gradient-to-r from-red-600 to-rose-700"}`}
            >
              {status === "success" ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Message sent! We'll contact you soon</span>
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Error sending message. Please try again</span>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-block bg-gradient-to-r from-cyan-600 to-teal-500 text-white px-6 py-2 rounded-full mb-6 text-sm font-medium">
            Connect With The Future
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-teal-300 to-cyan-400">
              Shape Tomorrow Together
            </span>
          </h1>

          <p className="text-lg text-gray-300 max-w-xl mx-auto">
            Whether you're an investor, tech partner, or fellow innovator, let's collaborate to build sustainable AI solutions that transform industries.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-gradient-to-br from-gray-800/30 to-gray-900 rounded-xl p-6 border border-cyan-500/20">
              <div className="text-cyan-400 text-2xl mb-3">🌐</div>
              <h3 className="text-xl font-bold mb-2">Our Vision</h3>
              <p className="text-gray-300">
                Merging AI innovation with sustainable infrastructure to create technology that serves humanity and protects our planet.
              </p>
            </div>

            <div className="bg-gradient-to-br from-gray-800/30 to-gray-900 rounded-xl p-6 border border-cyan-500/20">
              <div className="text-cyan-400 text-2xl mb-3">🤝</div>
              <h3 className="text-xl font-bold mb-2">Partnership Opportunities</h3>
              <ul className="text-gray-300 space-y-2">
                <li>• AI Research Collaborations</li>
                <li>• Green Tech Investments</li>
                <li>• Sustainable Infrastructure</li>
                <li>• Enterprise Solutions</li>
              </ul>
            </div>
          </div>

          <div className="lg:col-span-2">
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              onSubmit={handleSubmit}
              className="bg-gradient-to-br from-gray-800/30 to-gray-900 p-8 rounded-xl border border-cyan-500/20 shadow-xl shadow-cyan-500/10 space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label className="block text-sm mb-2 text-gray-300" htmlFor="name">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-gray-900/50 text-white border border-cyan-500/20 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="Venkat Sai Prasanth"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm mb-2 text-gray-300" htmlFor="email">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-gray-900/50 text-white border border-cyan-500/20 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="hello@synexis.ai"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Subject */}
                <div>
                  <label className="block text-sm mb-2 text-gray-300" htmlFor="subject">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-gray-900/50 text-white border border-cyan-500/20 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="Partnership Opportunity"
                  />
                </div>

                {/* Inquiry Type */}
                <div>
                  <label className="block text-sm mb-2 text-gray-300" htmlFor="inquiryType">
                    Inquiry Type
                  </label>
                  <select
                    name="inquiryType"
                    value={formData.inquiryType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-gray-900/50 text-white border border-cyan-500/20 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="general">General Inquiry</option>
                    <option value="partnership">Partnership Opportunity</option>
                    <option value="investment">Investment Inquiry</option>
                    <option value="technical">Technical Collaboration</option>
                    <option value="press">Press & Media</option>
                    <option value="career">Career Opportunity</option>
                  </select>
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm mb-2 text-gray-300" htmlFor="message">
                  Your Vision
                </label>
                <textarea
                  name="message"
                  rows="6"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-gray-900/50 text-white border border-cyan-500/20 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="How can we collaborate to build a sustainable tech future?"
                />
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-4 rounded-lg font-bold transition-all flex items-center justify-center space-x-2 ${
                  isSubmitting
                    ? "bg-gray-700 cursor-not-allowed"
                    : "bg-gradient-to-r from-cyan-600 to-teal-500 hover:from-cyan-500 hover:to-teal-400"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Sending Message...</span>
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>Send Message to SynexisAI</span>
                  </>
                )}
              </motion.button>
            </motion.form>
          </div>
        </div>

        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center py-8 border-t border-cyan-500/20"
        >
          <h3 className="text-xl font-bold mb-4 text-cyan-400">Other Ways to Connect</h3>
          <div className="flex flex-wrap justify-center gap-6">
            <a href="https://linkedin.com/company/synexisai" target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-300 hover:text-cyan-400 transition">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
              LinkedIn
            </a>
            <a href="https://github.com/synexisai" target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-300 hover:text-cyan-400 transition">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              GitHub
            </a>
            <div className="flex items-center text-gray-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Contact: connect@synexis.ai
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}