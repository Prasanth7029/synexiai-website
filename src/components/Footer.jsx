import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#111] dark:bg-black text-white dark:text-gray-300 py-10 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Branding */}
        <div className="text-center md:text-left text-lg font-semibold text-cyan-400">
          SynexiAI
        </div>

        {/* Navigation Links */}
        <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm">
          <Link to="/" className="hover:text-cyan-300 transition">Home</Link>
          <Link to="/about" className="hover:text-cyan-300 transition">About</Link>
          <Link to="/projects" className="hover:text-cyan-300 transition">Projects</Link>
          <Link to="/blog" className="hover:text-cyan-300 transition">Blog</Link>
          <Link to="/vision" className="hover:text-cyan-300 transition">Vision</Link>
        </div>

        {/* Copyright */}
        <div className="text-xs text-gray-400 text-center md:text-right">
          © {year} SynexiAI. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
