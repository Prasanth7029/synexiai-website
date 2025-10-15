// src/components/Layout.jsx
import React from "react";
import { motion } from "framer-motion";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import ChatWidget from "./ChatWidget";

/**
 * SynexiAI Layout
 * - Global shell wrapping all pages
 * - Fixed header, responsive footer, and global ChatWidget
 * - Uses safe height (min-h-screen) instead of min-h-svh for Safari stability
 */

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen antialiased  text-[var(--text-color)] transition-colors duration-300">
      {/* Header */}
      <Header className="header header-surface" />

      {/* Main Content */}
      <main
        id="main"
        tabIndex={-1}
        className="flex-1 pt-[var(--header-height)] pb-24 sm:pb-0 relative z-0"
      >
        <Outlet /> {/* Nested routes render here */}
      </main>

      {/* Footer with fade-up motion */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
      >
        <Footer />
      </motion.div>

      {/* Global Chat Assistant */}
      <ChatWidget side="right" z={9999} desktopWidthPx={360} />
    </div>
  );
}
