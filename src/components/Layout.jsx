// src/components/Layout.jsx
import React, { useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import ChatWidget from "./ChatWidget";

export default function Layout({ children }) {
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      {/* Header */}
      <Header />

      {/* Main content with accessibility and animation */}
      <motion.main
        id="main-content"
        className="flex-grow"
        key={location.pathname} // Ensures animation on route change
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {children}
      </motion.main>

      {/* Footer with fade-in animation */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
      >
        <Footer />
      </motion.div>

      {/* Persistent ChatWidget */}
      <ChatWidget />
    </div>
  );
}
