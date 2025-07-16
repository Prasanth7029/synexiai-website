import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaGithub, FaLinkedin, FaGlobe } from "react-icons/fa";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative bg-[#0a0a0a] dark:bg-black text-white py-12 px-6 overflow-hidden border-t border-cyan-500/10">
      {/* Glow Effect */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[400px] h-[400px] bg-cyan-400/10 blur-[140px] z-0" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8"
      >
        {/* Branding */}
        <div className="text-center md:text-left text-2xl font-bold tracking-wide text-cyan-400 hover:glow">
            <Link to="/" className="focus:outline-none focus:ring-2 focus:ring-cyan-500">
          SynexiAI
            </Link>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-cyan-300 font-medium">
          <Link to="/" className="hover:text-white transition">Home</Link>
          <Link to="/about" className="hover:text-white transition">About</Link>
          <Link to="/projects" className="hover:text-white transition">Projects</Link>
          <Link to="/blog" className="hover:text-white transition">Blog</Link>
          <Link to="/vision" className="hover:text-white transition">Vision</Link>
          <Link to="/tech" className="hover:text-white transition">Tech</Link>
          <Link to="/contact" className="hover:text-white transition">Contact</Link>
        </div>

        {/* Social Icons */}
        <div className="flex gap-4 text-xl text-cyan-300">
          <a
            href="https://github.com/synexiai" target="_blank" rel="noopener noreferrer"
            className="hover:text-white transition"
          >
            <FaGithub />
          </a>
          <a
            href="https://linkedin.com/company/synexiai" target="_blank" rel="noopener noreferrer"
            className="hover:text-white transition"
          >
            <FaLinkedin />
          </a>
          <a
            href="https://www.synexiai.online" target="_blank" rel="noopener noreferrer"
            className="hover:text-white transition"
          >
            <FaGlobe />
          </a>
        </div>
      </motion.div>

      {/* Copyright */}
      <div className="relative z-10 mt-8 text-center text-xs text-gray-500">
        © {year} SynexiAI. All rights reserved.
      </div>
    </footer>
  );
}
