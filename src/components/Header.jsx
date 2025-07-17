import React, { useEffect, useState } from "react";
import Hamburger from "./Hamburger";
import { Link, useLocation } from "react-router-dom";
import { FaMoon, FaSun } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { FiGithub, FiTwitter, FiLinkedin } from "react-icons/fi";

export default function Header() {
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem("theme") === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
  });
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Theme effect
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

  // Close menu on route change
  useEffect(() => {
    closeMenu();
  }, [location.pathname]);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  const socialLinks = [
    { icon: <FiGithub />, url: "https://github.com" },
    { icon: <FiTwitter />, url: "https://twitter.com" },
    { icon: <FiLinkedin />, url: "https://linkedin.com" },
  ];

  return (
    <header className={`sticky top-0 z-50 backdrop-blur-lg transition-all duration-500 ${
      scrolled
        ? "bg-black/90 dark:bg-gray-900/90 shadow-lg shadow-cyan-500/10 border-b border-cyan-400/20"
        : "bg-black/70 dark:bg-gray-900/70 border-b border-transparent"
    }`}>
      <nav className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        {/* Logo with animation */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link
            to="/"
            className="text-2xl font-bold tracking-wide focus:outline-none"
          >
            <span className="bg-gradient-to-r from-cyan-400 to-teal-500 bg-clip-text text-transparent">
              SynexiAI
            </span>
            <span className="text-cyan-400 text-xs align-super ml-1">®</span>
          </Link>
        </motion.div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <div className="flex gap-6">
            {navLinks.map(({ label, path }) => (
              <Link
                key={label}
                to={path}
                className={`relative px-1 py-2 text-sm font-medium transition-colors duration-300 focus:outline-none ${
                  location.pathname === path
                    ? "text-white"
                    : "text-cyan-300 hover:text-white"
                }`}
              >
                {label}
                {location.pathname === path && (
                  <motion.span
                    layoutId="activeNav"
                    className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan-400"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4 ml-4">
            {/* Social Links */}
            <div className="flex gap-3 border-r border-gray-700 pr-4">
              {socialLinks.map(({ icon, url }, index) => (
                <a
                  key={index}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-cyan-400 transition-colors duration-300 p-1"
                  aria-label={`Social link ${index + 1}`}
                >
                  {icon}
                </a>
              ))}
            </div>

            {/* Theme Toggle */}
            <button
              onClick={() => setIsDark(!isDark)}
              className="relative w-12 h-6 rounded-full bg-gray-700 dark:bg-cyan-900 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
              <motion.div
                className={`absolute top-1/2 w-5 h-5 rounded-full flex items-center justify-center ${
                  isDark ? "bg-yellow-300 left-6" : "bg-white left-1"
                }`}
                initial={false}
                animate={{
                  left: isDark ? "1.5rem" : "0.25rem",
                }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              >
                {isDark ? (
                  <FaSun className="text-gray-800 text-xs" />
                ) : (
                  <FaMoon className="text-gray-600 text-xs" />
                )}
              </motion.div>
            </button>
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center gap-4">
          <button
            onClick={() => setIsDark(!isDark)}
            className="p-2 rounded-full text-gray-300 hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDark ? <FaSun /> : <FaMoon />}
          </button>

          <Hamburger
            open={menuOpen}
            onChange={toggleMenu}
            aria-label="Toggle navigation menu"
          />
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden overflow-hidden"
          >
            <div className="bg-gradient-to-b from-black/90 to-gray-900/90 backdrop-blur-lg px-6 py-4">
              {navLinks.map(({ label, path }) => (
                <motion.div
                  key={label}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Link
                    to={path}
                    onClick={closeMenu}
                    className={`block py-3 px-2 rounded-lg text-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 ${
                      location.pathname === path
                        ? "text-white bg-cyan-500/10"
                        : "text-cyan-300 hover:text-white hover:bg-gray-800"
                    }`}
                  >
                    {label}
                  </Link>
                </motion.div>
              ))}

              <div className="flex justify-center gap-6 mt-6 pt-4 border-t border-gray-800">
                {socialLinks.map(({ icon, url }, index) => (
                  <a
                    key={index}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-2xl text-gray-400 hover:text-cyan-400 transition-colors duration-300 p-2"
                    aria-label={`Social link ${index + 1}`}
                  >
                    {icon}
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}