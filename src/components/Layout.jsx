import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import Container from "./Container";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";

export default function Layout({ children }) {
  const location = useLocation();

  return (
    <div className="relative min-h-screen flex flex-col transition-colors duration-500 ease-in-out bg-white text-black dark:bg-black dark:text-white overflow-x-hidden">
      {/* Ambient Glow Background */}
      <div className="pointer-events-none absolute top-0 left-0 w-full h-full z-0">
        <div className="absolute w-[600px] h-[600px] bg-cyan-400/10 rounded-full blur-[180px] top-[10%] left-[10%] animate-float" />
        <div className="absolute w-[700px] h-[700px] bg-purple-500/10 rounded-full blur-[200px] bottom-[5%] right-[5%] animate-float-slow" />
      </div>

      {/* ✅ Remove Framer Motion from Header to keep it sticky */}
      <Header />

      {/* Page Content */}
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative z-10 flex-grow py-16"
        >
          <Container animate>{children}</Container>
        </motion.main>
      </AnimatePresence>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
        className="z-50"
      >
        <Footer />
      </motion.div>
    </div>
  );
}
