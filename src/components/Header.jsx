// src/components/Header.jsx
import React, { useEffect, useMemo, useState, useCallback, useRef } from "react";
import Hamburger from "./Hamburger";
import { NavLink, useLocation } from "react-router-dom";
import { FaMoon, FaSun } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { FiGithub, FiTwitter, FiLinkedin } from "react-icons/fi";

export default function Header() {
  /* ----------------------------- THEME HANDLING ---------------------------- */
  const storageKey = "theme"; // 'light' | 'dark'

  const getInitialTheme = () => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved === "light" || saved === "dark") return saved;
    } catch {}
    const prefersDark =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-color-scheme: dark)").matches;
    return prefersDark ? "dark" : "light";
  };

  const [theme, setTheme] = useState(getInitialTheme);
  const isDark = theme === "dark";

  const applyTheme = useCallback((next, persist = true) => {
    const root = document.documentElement;
    root.classList.add("[&_*]:!transition-none");
    root.classList.toggle("dark", next === "dark");
    root.style.colorScheme = next;
    root.setAttribute("data-theme", next);
    if (persist) {
      try { localStorage.setItem(storageKey, next); } catch {}
    }
    requestAnimationFrame(() => root.classList.remove("[&_*]:!transition-none"));
  }, []);

  useEffect(() => { applyTheme(theme, false); /* initial paint */ }, []); // eslint-disable-line
  useEffect(() => { applyTheme(theme, true); }, [theme, applyTheme]);

  // Respect system if user hasn't chosen
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved === "light" || saved === "dark") return;
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      const onChange = (e) => setTheme(e.matches ? "dark" : "light");
      mq.addEventListener?.("change", onChange);
      return () => mq.removeEventListener?.("change", onChange);
    } catch {}
  }, []);

  // Sync across tabs
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === storageKey && (e.newValue === "light" || e.newValue === "dark")) {
        setTheme(e.newValue);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const toggleTheme = () => setTheme(isDark ? "light" : "dark");

  /* ------------------------------- NAV / UI ------------------------------- */
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const mobileMenuRef = useRef(null);
  const lastActiveEl = useRef(null);
  const headerRef = useRef(null);

  // Publish header height (used by #main calc to avoid jump)
  useEffect(() => {
    const root = document.documentElement;
    const update = () => {
      if (headerRef.current) {
        root.style.setProperty("--header-height", `${headerRef.current.offsetHeight}px`);
      }
    };
    update();
    const ro = new ResizeObserver(update);
    if (headerRef.current) ro.observe(headerRef.current);
    window.addEventListener("resize", update);
    return () => { ro.disconnect(); window.removeEventListener("resize", update); };
  }, [menuOpen]);

  // Close menu on route change
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  // Elevation on scroll
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 10);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Body lock + focus trap when mobile menu open
  useEffect(() => {
    const body = document.body;
    const prev = body.style.overflow;
    if (menuOpen) {
      lastActiveEl.current = document.activeElement;
      body.style.overflow = "hidden";
      mobileMenuRef.current?.querySelector("a,button")?.focus?.();
    } else {
      body.style.overflow = prev || "auto";
      lastActiveEl.current?.focus?.();
    }
    return () => { body.style.overflow = prev || "auto"; };
  }, [menuOpen]);

  const toggleMenu = () => setMenuOpen((v) => !v);

  const navLinks = useMemo(
    () => [
      { label: "Home", path: "/" },
      { label: "About", path: "/about" },
      { label: "Portfolio", path: "/portfolio" },
      { label: "Vision", path: "/vision" },
      { label: "Contact", path: "/contact" },
      { label: "Tech", path: "/tech" },
      { label: "Games", path: "/games" },
      { label: "AI News", path: "/ai-news" },
    ],
    [],
  );

  const socialLinks = useMemo(
    () => [
      { icon: <FiGithub />, url: "https://github.com/synexiai" },
      { icon: <FiTwitter />, url: "https://twitter.com" },
      { icon: <FiLinkedin />, url: "https://www.linkedin.com/company/synexiai" },
    ],
    [],
  );

  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

  /* --------------------------------- RENDER -------------------------------- */
  return (
    <>
      {/* Skip link for keyboard users */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[10000] focus:bg-cyan-600 focus:text-white focus:px-3 focus:py-2 focus:rounded-lg"
      >
        Skip to main content
      </a>

      <header
        ref={headerRef}
        role="banner"
        className={[
          "header header-surface fixed top-0 inset-x-0",
          "z-50 transition-all duration-500",
          scrolled ? "shadow-lg shadow-[rgba(34,211,238,.10)]" : "shadow-none"
        ].join(" ")}
      >
        {/* Animated background layer (light + dark) */}
        <div aria-hidden="true" className="header-ambient">
          <div className="hidden md:block header-pill header-pill-left animate-float-slow" />
          <div className="hidden md:block header-pill header-pill-right animate-float" />
        </div>

        <nav
          className="relative max-w-7xl mx-auto px-4 sm:px-6 py-3 flex justify-between items-center"
          aria-label="Primary"
        >
          {/* Logo */}
          <motion.div
            whileHover={prefersReduced ? {} : { scale: 1.05 }}
            whileTap={prefersReduced ? {} : { scale: 0.95 }}
            className="w-[140px] sm:w-[160px]"
          >
            <NavLink
              to="/"
              className="inline-flex items-baseline text-xl sm:text-2xl font-bold tracking-wide focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--brand-cyan)] rounded"
            >
              <span className="brand-gradient bg-clip-text text-transparent">SynexiAI</span>
              <span className="text-[color:var(--brand-cyan)] text-xs align-super ml-1">®</span>
            </NavLink>
          </motion.div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex gap-6">
              {navLinks.map(({ label, path }) => (
                <NavLink
                  key={label}
                  to={path}
                  className="relative px-1 py-2 text-sm font-medium nav-link focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--brand-cyan)] rounded"
                  aria-label={label}
                >
                  {({ isActive }) => (
                    <>
                      {label}
                      {isActive && (
                        <motion.span
                          layoutId="activeNavUnderline"
                          className="absolute bottom-0 left-0 w-full h-0.5"
                          style={{ backgroundColor: "var(--brand-cyan)" }}
                          transition={prefersReduced ? { duration: 0 } : { type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </div>

            <div className="flex items-center gap-4 ml-4">
              {/* Socials */}
              <div className="flex gap-3 border-r pr-4" style={{ borderColor: "var(--color-border)" }}>
                {socialLinks.map(({ icon, url }, idx) => (
                  <a
                    key={idx}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors duration-300 p-1 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--brand-cyan)]"
                    style={{ color: "var(--color-muted)" }}
                    aria-label={`Open ${url} in new tab`}
                  >
                    {icon}
                  </a>
                ))}
              </div>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="relative w-12 h-6 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2"
                aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
                aria-pressed={isDark}
                style={{
                  backgroundColor: isDark ? "rgba(2,132,199,.25)" : "rgba(0,0,0,.08)",
                  boxShadow: isDark ? "inset 0 0 0 1px rgba(34,211,238,.35)" : "inset 0 0 0 1px rgba(0,0,0,.08)",
                }}
              >
                <motion.div
                  className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: isDark ? "#fde68a" : "#ffffff", color: isDark ? "#111827" : "#4b5563" }}
                  initial={false}
                  animate={{ left: isDark ? "1.5rem" : "0.25rem" }}
                  transition={prefersReduced ? { duration: 0 } : { type: "spring", stiffness: 500, damping: 30 }}
                >
                  {isDark ? <FaSun className="text-xs" /> : <FaMoon className="text-xs" />}
                </motion.div>
              </button>
            </div>
          </div>

          {/* Mobile Controls */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2 rounded-full transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--brand-cyan)]"
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
              aria-pressed={isDark}
              style={{
                color: "var(--color-text)",
                backgroundColor: isDark ? "rgba(255,255,255,.05)" : "rgba(0,0,0,.04)",
              }}
            >
              {isDark ? <FaSun /> : <FaMoon />}
            </button>

            <div className="min-w-[44px] min-h-[44px] flex items-center justify-center">
              <Hamburger
                open={menuOpen}
                onChange={toggleMenu}
                aria-label="Toggle navigation menu"
                aria-expanded={menuOpen}
                aria-controls="mobile-menu"
              />
            </div>
          </div>
        </nav>

        {/* Mobile Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              id="mobile-menu"
              ref={mobileMenuRef}
              role="dialog"
              aria-modal="true"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: prefersReduced ? 0 : 0.28, ease: "easeInOut" }}
              className="md:hidden overflow-hidden"
            >
              <div
                className="px-6 py-4 max-h-[80vh] overflow-y-auto"
                style={{
                  background: isDark
                    ? "linear-gradient(to bottom, rgba(0,0,0,.85), rgba(11,18,32,.92))"
                    : "linear-gradient(to bottom, rgba(255,255,255,.9), rgba(247,250,252,.96))",
                  borderTop: "1px solid var(--color-border)",
                }}
              >
                {navLinks.map(({ label, path }) => (
                  <motion.div
                    key={label}
                    initial={{ x: prefersReduced ? 0 : -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: prefersReduced ? 0 : 0.25 }}
                  >
                    <NavLink
                      to={path}
                      onClick={() => setMenuOpen(false)}
                      className={({ isActive }) =>
                        [
                          "block py-3 px-2 rounded-lg text-lg font-medium transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--brand-cyan)]",
                          isActive
                            ? "bg-[color:var(--brand-cyan)]/10 text-[color:var(--color-text)]"
                            : "text-[color:var(--color-text)]/80 hover:text-[color:var(--color-text)] hover:bg-black/5 dark:hover:bg-white/10",
                        ].join(" ")
                      }
                      aria-label={label}
                    >
                      {label}
                    </NavLink>
                  </motion.div>
                ))}

                <div className="flex justify-center gap-6 mt-6 pt-4" style={{ borderTop: "1px solid var(--color-border)" }}>
                  {socialLinks.map(({ icon, url }, index) => (
                    <a
                      key={index}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-2xl transition-colors duration-300 p-2 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--brand-cyan)]"
                      style={{ color: "var(--color-muted)" }}
                      aria-label={`Open ${url} in new tab`}
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
    </>
  );
}
