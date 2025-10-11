// src/components/HeroBanner.jsx
import React, { useState, useEffect, useCallback, lazy, Suspense, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaArrowDown } from "react-icons/fa";
import { Link } from "react-router-dom";
import GlobeSection from "../components/visuals/GlobeSection.jsx";
import { canUseWebGL } from "../lib/canUseWebGL.js";

const Particles = lazy(() => import("react-tsparticles"));
const MotionLink = motion(Link);

const ROTATING_TEXTS = [
  "Welcome to SynexiAI",
  "AI • Sustainability • Innovation",
];

const SCROLL_PROMPT_THRESHOLD = 50;
const TEXT_ROTATION_INTERVAL = 3000;
const LOAD_TIMEOUT = 3000;

export default function HeroBanner({ className = "" }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [showScrollPrompt, setShowScrollPrompt] = useState(true);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [mountParticles, setMountParticles] = useState(false);
  const [allowMobileGlobe, setAllowMobileGlobe] = useState(false);

  /* ----------------------------- Headline rotate ---------------------------- */
  useEffect(() => {
    const id = setInterval(
      () => setCurrentTextIndex((p) => (p + 1) % ROTATING_TEXTS.length),
      TEXT_ROTATION_INTERVAL,
    );
    return () => clearInterval(id);
  }, []);

  /* ------------------------------- Video fade ------------------------------- */
  useEffect(() => {
    const video = document.querySelector(".hero-video");
    const onLoaded = () => setIsLoaded(true);
    if (!video) return;
    video.addEventListener("loadeddata", onLoaded);
    const t = setTimeout(onLoaded, LOAD_TIMEOUT);
    return () => {
      video.removeEventListener("loadeddata", onLoaded);
      clearTimeout(t);
    };
  }, []);

  /* ---------------------------- Scroll prompt hide -------------------------- */
  useEffect(() => {
    const onScroll = () =>
      setShowScrollPrompt(window.scrollY < SCROLL_PROMPT_THRESHOLD);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* --------------------- Desktop-only particles (no AOS) -------------------- */
  useEffect(() => {
    const reduced =
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    const isDesktop = window.matchMedia?.("(min-width: 768px)")?.matches;
    if (!reduced && isDesktop) {
      const t = setTimeout(() => setMountParticles(true), 800);
      return () => clearTimeout(t);
    }
  }, []);

  /* -------------------- Decide if we render the mobile globe ---------------- */
  const computeMobileGlobe = useCallback(() => {
    const reduced =
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    const isPhone = !window.matchMedia?.("(min-width: 768px)")?.matches;
    const wideEnough =
      (typeof window !== "undefined" ? window.innerWidth : 0) >= 320;
    setAllowMobileGlobe(isPhone && wideEnough && !reduced && canUseWebGL());
  }, []);

  useEffect(() => {
    computeMobileGlobe();
    window.addEventListener("resize", computeMobileGlobe);
    window.addEventListener("orientationchange", computeMobileGlobe);
    return () => {
      window.removeEventListener("resize", computeMobileGlobe);
      window.removeEventListener("orientationchange", computeMobileGlobe);
    };
  }, [computeMobileGlobe]);

  /* ---------------------- Theme-aware particles options --------------------- */
  const particleOptions = useMemo(() => {
    // Read current CSS variable so particles match brand color in both themes
    let brandCyan = "#22d3ee";
    try {
      const cs = getComputedStyle(document.documentElement);
      brandCyan = (cs.getPropertyValue("--brand-cyan") || brandCyan).trim();
    } catch {}
    return {
      fullScreen: { enable: false },
      background: { color: "transparent" },
      particles: {
        number: { value: 24 },
        color: { value: brandCyan },
        opacity: { value: 0.22 },
        size: { value: 3 },
        move: {
          enable: true,
          speed: 0.4,
          direction: "none",
          outModes: "bounce",
        },
      },
      detectRetina: true,
    };
  }, []);

  const particlesInit = useCallback(async () => {}, []);
  const particlesLoaded = useCallback(async () => {}, []);

  return (
    <section
      className={
        "relative z-10 w-full min-h-[100svh] flex items-stretch justify-center overflow-hidden pb-0 pt-0 " +
        "hero-no-grid hero-veil " + // provided by index.css
        className
      }
    >

      {/* Video overlay: faint in LIGHT, stronger in DARK; no black veil in LIGHT */}
      <div aria-hidden="true" className="absolute inset-0 z-10 pointer-events-none ">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          className={`hero-video w-full h-full object-cover blur-sm md:blur-md transition-opacity duration-1000`}
          tabIndex={-1}
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>

      </div>

      {/* Desktop particles */}
      {/* {mountParticles && (
        <Suspense fallback={null}>
          <Particles
            id="tsparticles"
            init={particlesInit}
            loaded={particlesLoaded}
            options={particleOptions}
            className="absolute inset-0 z-[18] pointer-events-none hidden md:block"
          />
        </Suspense>
      )} */}

      {/* Foreground */}
      <div className="relative z-30 flex items-center w-full min-h-[100svh] px-4 sm:px-6">
        <div className="w-full max-w-6xl mx-auto grid md:grid-cols-12 items-center gap-8">
          {/* Text column */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="order-2 md:order-1 w-full md:col-span-7 max-w-none mx-auto md:mx-0 text-center md:text-left px-1 sm:px-4"
          >
            {/* Mobile globe */}
            {allowMobileGlobe && (
              <div className="md:hidden flex justify-center pt-2 mb-2">
                <div className="relative w-[148px] h-[148px] opacity-90 drop-shadow-md">
                  <GlobeSection
                    showHeader={false}
                    controls={false}
                    sizePx={192}
                    allow3DOnSmall={true}
                  />
                </div>
              </div>
            )}

            {/* Rotating headline */}
            <div className="h-auto md:h-40 flex flex-col items-center md:items-start justify-center text-center md:text-left mb-4 sm:mb-6">
              <AnimatePresence mode="wait">
                <motion.h1
                  key={currentTextIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="font-semibold tracking-tight subpixel-antialiased
                             bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-emerald-400
                             drop-shadow-[0_1px_6px_rgba(34,211,238,0.35)]
                             whitespace-normal"
                >
                  {ROTATING_TEXTS[currentTextIndex]}
                </motion.h1>

              </AnimatePresence>
               <motion.p
                  className="text-base sm:text-lg md:text-2xl mt-3 md:mt-4 text-[color:var(--color-muted)] max-w-2xl md:max-w-none"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.7, ease: 'easeOut' }}
               >
              <span className="text-[color:var(--brand-cyan)]">
                SynexiAI
              </span>{" "}
              merges{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Artificial Intelligence
              </span>
              ,{" "}
              <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                Cloud Systems
              </span>{" "}
              and{" "}
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Renewable Energy
              </span>{" "}
              to create intelligent, sustainable solutions shaping a smarter future.
            </motion.p>
            </div>
            {/* CTAs (reuse global button classes from index.css) */}
            <motion.div
              className="flex flex-col sm:flex-row md:justify-start justify-center gap-3 sm:gap-4 mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <MotionLink
                to="/about"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="btn-primary md:active:scale-95"
              >
                Discover Our Vision →
              </MotionLink>

              <MotionLink
                to="/projects"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="btn-ghost md:active:scale-95 text-[color:var(--brand-cyan)]"
              >
                Join the Movement
              </MotionLink>
            </motion.div>

            {/* Mobile scroll prompt */}
            {showScrollPrompt && (
              <motion.div
                className="md:hidden mt-8 select-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.0, duration: 0.5 }}
              >
                <motion.div
                  className="flex flex-col items-center"
                  animate={{ y: [0, 10, 0] }}
                  transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
                >
                  <p className="text-xs text-[color:var(--color-text)]/80 mb-1">
                    Scroll down
                  </p>
                  <FaArrowDown className="text-[color:var(--color-text)] text-lg opacity-80" />
                </motion.div>
              </motion.div>
            )}
          </motion.div>

          {/* Desktop globe */}
          <div className="order-1 md:order-2 hidden md:flex justify-center md:col-span-5">
            <GlobeSection showHeader={false} controls={false} size="lg" />
          </div>
        </div>

        {/* Desktop scroll prompt */}
        {showScrollPrompt && (
          <motion.div
            className="hidden md:block absolute left-1/2 -translate-x-1/2 z-20 select-none bottom-16 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.5 }}
          >
            <motion.div
              className="flex flex-col items-center"
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
            >
              <p className="text-sm text-[color:var(--color-text)]/85 mb-1">
                Scroll down
              </p>
              <FaArrowDown className="text-[color:var(--color-text)] text-xl opacity-80" />
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
