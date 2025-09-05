// src/components/Layout.jsx
import React from "react";
import { motion } from "framer-motion";
import Header from "./Header";
import Footer from "./Footer";
import ChatWidget from "./ChatWidget";

export default function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-svh antialiased bg-[var(--bg-gradient)] text-[var(--text-color)]">
      <Header />
      <main id="main" tabIndex={-1} className="flex-1 pb-24 sm:pb-0">
        {children}
      </main>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
      >
        <Footer />
      </motion.div>
      <ChatWidget side="right" z={9999} desktopWidthPx={360} />
    </div>
  );
}
