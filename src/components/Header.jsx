import React from "react";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="bg-[#111] py-6 shadow-md sticky top-0 z-50">
      <nav className="flex justify-center gap-8 text-[#00f7ff] font-medium text-lg">
        <Link to="/" className="hover:text-white transition duration-200">Home</Link>
        <Link to="/about" className="hover:text-white transition duration-200">About</Link>
        <Link to="/projects" className="hover:text-white transition duration-200">Projects</Link>
        <Link to="/blog" className="hover:text-white transition duration-200">Blog</Link>
        <Link to="/vision" className="hover:text-white transition duration-200">Vision</Link>
      </nav>
    </header>
  );
}
