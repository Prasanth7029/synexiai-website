import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [status, setStatus] = useState(null); // 'success' | 'error' | null
  const [showToast, setShowToast] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formPayload = new FormData();
      formPayload.append("name", formData.name);
      formPayload.append("_replyto", formData.email); // Formspree expects this key
      formPayload.append("message", formData.message);

      const response = await fetch("https://formspree.io/f/xyzpgkbo", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: formPayload,
      });

      if (response.ok) {
        setStatus("success");
        setShowToast(true);
        setFormData({ name: "", email: "", message: "" });

        // Optional: redirect after 3.5 sec
        setTimeout(() => {
          setShowToast(false);
          window.location.href = "/";
        }, 3500);
      } else {
        setStatus("error");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      }
    } catch (error) {
      setStatus("error");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-6 py-20 text-white relative">
        {/* ✅ TOAST */}
        {showToast && (
          <div className={`fixed top-6 right-6 px-6 py-3 rounded-xl shadow-lg transition-all z-50
            ${status === "success" ? "bg-green-600" : "bg-red-600"}`}>
            {status === "success"
              ? "✅ Message sent successfully!"
              : "❌ Something went wrong. Please try again."}
          </div>
        )}

        <h1
          className="text-4xl md:text-5xl font-bold text-cyan-400 mb-6 text-center"
          data-aos="fade-up"
        >
          💬 Contact Us
        </h1>

        <p
          className="text-lg text-gray-300 text-center mb-12"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          Whether you're a developer, investor, partner, or visionary — get in touch and let's build the future together.
        </p>

        <form
          onSubmit={handleSubmit}
          className="bg-[#1a1a1a] dark:bg-[#111] p-8 rounded-xl shadow-lg shadow-cyan-500/10 space-y-6"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          {/* Name */}
          <div>
            <label className="block text-sm mb-2 text-gray-300" htmlFor="name">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg bg-gray-900 text-white border border-cyan-500/20 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm mb-2 text-gray-300" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg bg-gray-900 text-white border border-cyan-500/20 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm mb-2 text-gray-300" htmlFor="message">
              Message
            </label>
            <textarea
              name="message"
              rows="5"
              value={formData.message}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg bg-gray-900 text-white border border-cyan-500/20 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-cyan-500 text-black font-semibold py-3 rounded-lg hover:bg-cyan-400 transition"
          >
            ✉️ Send Message
          </button>
        </form>
      </div>
    </Layout>
  );
}
