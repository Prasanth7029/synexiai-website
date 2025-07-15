import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaBars, FaTimes, FaMoon, FaSun } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem("theme") === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
  });
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation(); // Close menu on route change

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

  useEffect(() => {
    closeMenu(); // close menu when route changes
  }, [location.pathname]);

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
    <header className="sticky top-0 z-50 backdrop-blur-md bg-black/80 shadow shadow-cyan-500/10 border-b border-cyan-400/10 transition-all duration-300">
      <nav className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/"
          className="text-cyan-400 text-2xl font-bold tracking-wide hover:glow focus:outline-none focus:ring-2 focus:ring-cyan-500"
        >
          SynexiAI
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-6 text-cyan-300 font-medium text-base">
          {navLinks.map(({ label, path }) => (
            <Link
              key={label}
              to={path}
              className="hover:text-white transition-colors duration-200 px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Right-side buttons */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle Button */}
          <button
            onClick={() => setIsDark(!isDark)}
            className="p-2 rounded-full bg-gray-800 text-white hover:bg-cyan-500 hover:text-black transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDark ? <FaSun className="text-lg" /> : <FaMoon className="text-lg" />}
          </button>

          {/* Hamburger */}
          <button
            onClick={toggleMenu}
            className="text-cyan-400 md:hidden text-2xl focus:outline-none focus:ring-2 focus:ring-cyan-500"
            aria-label="Toggle Navigation Menu"
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-[#111] dark:bg-black px-6 pb-6 pt-2 text-cyan-300"
          >
            {navLinks.map(({ label, path }) => (
              <Link
                key={label}
                to={path}
                onClick={closeMenu}
                className="block py-2 px-3 rounded hover:bg-cyan-700/10 transition-colors duration-200 focus:outline-none focus:ring-1 focus:ring-cyan-400"
              >
                {label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
