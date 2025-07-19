import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import ChatWidget from './ChatWidget';

export default function Layout({ children }) {
  const location = useLocation();

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      {/* Header */}
      <Header />

      {/* Page Content */}
      <main className="flex-grow">
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
      <ChatWidget />
    </div>
  );
}
