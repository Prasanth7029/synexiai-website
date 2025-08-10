import React, { useEffect, useMemo, useState, useCallback } from "react";
import Hamburger from "./Hamburger";
import { NavLink, useLocation } from "react-router-dom";
import { FaMoon, FaSun } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { FiGithub, FiTwitter, FiLinkedin } from "react-icons/fi";

export default function Header() {
  // ---- THEME HANDLING (single source of truth) ----
  const storageKey = "theme"; // 'light' | 'dark'

  const getInitialTheme = () => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved === "light" || saved === "dark") return saved;
    } catch (_) {}
    const prefersDark =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    return prefersDark ? "dark" : "light";
  };



  const [theme, setTheme] = useState(getInitialTheme);
  const isDark = theme === "dark";

  const applyTheme = useCallback((next, persist = true) => {
    const root = document.documentElement;

    // Avoid transition flash on theme switch
    root.classList.add("[&_*]:!transition-none");

    // Toggle Tailwind dark mode + set color-scheme for native form controls
    if (next === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    root.style.colorScheme = next;
    root.setAttribute("data-theme", next);

    if (persist) {
      try {
        localStorage.setItem(storageKey, next);
      } catch (_) {}
    }

    // Re-enable transitions next frame
    window.setTimeout(() => {
      root.classList.remove("[&_*]:!transition-none");
    }, 0);
  }, []);

  // Apply once on mount, without double-persist
  useEffect(() => {
    applyTheme(theme, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Apply whenever theme changes (and persist)
  useEffect(() => {
    applyTheme(theme, true);
  }, [theme, applyTheme]);

  // React to system theme changes (only when user hasn't explicitly chosen)
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved === "light" || saved === "dark") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (e) => setTheme(e.matches ? "dark" : "light");
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  // Sync across tabs/windows
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === storageKey && (e.newValue === "light" || e.newValue === "dark")) {
        setTheme(e.newValue);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // ---- NAV / HEADER ----
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Elevation on scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = menuOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = prev || "auto";
    };
  }, [menuOpen]);

  const toggleTheme = () => setTheme(isDark ? "light" : "dark");
  const toggleMenu = () => setMenuOpen((v) => !v);

  const navLinks = useMemo(
    () => [
      { label: "Home", path: "/" },
      { label: "About", path: "/about" },
      { label: "Projects", path: "/projects" },
      { label: "Vision", path: "/vision" },
      { label: "Contact", path: "/contact" },
      { label: "Tech", path: "/tech" },
      { label: "AI News", path: "/ai-news" },
    ],
    []
  );

  const socialLinks = useMemo(
    () => [
      { icon: <FiGithub />, url: "https://github.com" },
      { icon: <FiTwitter />, url: "https://twitter.com" },
      { icon: <FiLinkedin />, url: "https://linkedin.com" },
    ],
    []
  );

  return (
    <header
      className={`sticky top-0 z-50 backdrop-blur-lg transition-all duration-500 ${
        scrolled
          ? "bg-black/90 dark:bg-gray-900/90 shadow-lg shadow-cyan-500/10 border-b border-cyan-400/20"
          : "bg-black/70 dark:bg-gray-900/70 border-b border-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
        {/* Logo */}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="min-w-[120px]">
          <NavLink
            to="/"
            className="text-xl sm:text-2xl font-bold tracking-wide focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded"
          >
            <span className="bg-gradient-to-r from-cyan-400 to-teal-500 bg-clip-text text-transparent">SynexiAI</span>
            <span className="text-cyan-400 text-xs align-super ml-1">®</span>
          </NavLink>
        </motion.div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <div className="flex gap-6">
            {navLinks.map(({ label, path }) => (
              <NavLink
                key={label}
                to={path}
                className={({ isActive }) =>
                  `relative px-1 py-2 text-sm font-medium transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded ${
                    isActive ? "text-white" : "text-cyan-300 hover:text-white"
                  }`
                }
                aria-current={({ isActive }) => (isActive ? "page" : undefined)}
              >
                {({ isActive }) => (
                  <>
                    {label}
                    {isActive && (
                      <motion.span
                        layoutId="activeNav"
                        className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan-400"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </>
                )}
              </NavLink>
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
                  className="text-gray-400 hover:text-cyan-400 transition-colors duration-300 p-1 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                  aria-label={`Social link ${index + 1}`}
                >
                  {icon}
                </a>
              ))}
            </div>

            {/* Theme Toggle (single place) */}
            <button
              onClick={toggleTheme}
              className="relative w-12 h-6 rounded-full bg-gray-700 dark:bg-cyan-900 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
              aria-pressed={isDark}
            >
              <motion.div
                className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center ${
                  isDark ? "bg-yellow-300" : "bg-white"
                }`}
                initial={false}
                animate={{ left: isDark ? "1.5rem" : "0.25rem" }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              >
                {isDark ? <FaSun className="text-gray-800 text-xs" /> : <FaMoon className="text-gray-600 text-xs" />}
              </motion.div>
            </button>
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2 rounded-full text-gray-300 hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            aria-pressed={isDark}
          >
            {isDark ? <FaSun /> : <FaMoon />}
          </button>

          <div className="min-w-[44px] min-h-[44px] flex items-center justify-center">
            <Hamburger open={menuOpen} onChange={toggleMenu} aria-label="Toggle navigation menu" />
          </div>
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
            <div className="bg-gradient-to-b from-black/90 to-gray-900/90 backdrop-blur-lg px-6 py-4 max-h-[80vh] overflow-y-auto">
              {navLinks.map(({ label, path }) => (
                <motion.div key={label} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.3 }}>
                  <NavLink
                    to={path}
                    onClick={() => setMenuOpen(false)}
                    className={({ isActive }) =>
                      `block py-3 px-2 rounded-lg text-lg font-medium transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                        isActive ? "text-white bg-cyan-500/10" : "text-cyan-300 hover:text-white hover:bg-gray-800"
                      }`
                    }
                    aria-current={({ isActive }) => (isActive ? "page" : undefined)}
                  >
                    {label}
                  </NavLink>
                </motion.div>
              ))}

              <div className="flex justify-center gap-6 mt-6 pt-4 border-t border-gray-800">
                {socialLinks.map(({ icon, url }, index) => (
                  <a
                    key={index}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-2xl text-gray-400 hover:text-cyan-400 transition-colors duration-300 p-2 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
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
