import React from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import Header from "./Header";
import Footer from "./Footer";
import ChatWidget from "./ChatWidget";

export default function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen text-white">
      {/* Header */}
      <Header />

      {/* Page Content */}
      <main id="main" className="min-h-screen">
        {children}
      </main>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
      >
        <Footer />
      </motion.div>

      {/* Chat */}
      <ChatWidget side="right" z={9999} />
    </div>
  );
}
