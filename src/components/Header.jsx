import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";

export default function Header() {
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem("theme") === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
  });

  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "About", path: "/about" },
    { label: "Projects", path: "/projects" },
    { label: "Blog", path: "/blog" },
    { label: "Vision", path: "/vision" },
    { label: "Contact", path: "/contact" },
    { label: "Tech", path: "/tech" },
  ];

  return (
    <header className="bg-[#111] dark:bg-black shadow-md sticky top-0 z-50">
      <nav className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="text-cyan-400 text-xl font-bold">SynexiAI</div>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-6 text-[#00f7ff] font-medium text-base">
          {navLinks.map(({ label, path }) => (
            <Link key={label} to={path} className="hover:text-white transition">{label}</Link>
          ))}
        </div>

        {/* Right-side buttons */}
        <div className="flex items-center gap-4">
          {/* Theme toggle */}
          <button
            onClick={() => setIsDark(!isDark)}
            className="text-white bg-[#222] dark:bg-gray-800 px-3 py-2 rounded transition hover:bg-[#333] dark:hover:bg-gray-700 text-sm"
          >
            {isDark ? "☀️ Light" : "🌙 Dark"}
          </button>

          {/* Hamburger */}
          <button onClick={toggleMenu} className="text-cyan-400 md:hidden text-2xl">
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#111] dark:bg-black px-6 pb-6 pt-2 space-y-4 text-[#00f7ff] text-base animate-slideDown">
          {navLinks.map(({ label, path }) => (
            <Link
              key={label}
              to={path}
              onClick={closeMenu}
              className="block py-2 px-3 rounded hover:bg-cyan-800/10"
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
