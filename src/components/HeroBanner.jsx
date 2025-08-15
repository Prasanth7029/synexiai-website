// src/components/HeroBanner.jsx
import React, { useState, useEffect, useCallback, lazy, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaArrowDown } from "react-icons/fa";
import { Link } from "react-router-dom";
import GlobeSection from "../components/visuals/GlobeSection.jsx";
import { canUseWebGL } from "../lib/canUseWebGL.js";

const Particles = lazy(() => import("react-tsparticles"));
const MotionLink = motion(Link);

const ROTATING_TEXTS = [
  "Welcome to SynexiAI",
  "We Build the Future",
  "AI • Vision • Innovation",
  "Zero to Forever",
];

const SCROLL_PROMPT_THRESHOLD = 50;
const TEXT_ROTATION_INTERVAL = 3000;
const LOAD_TIMEOUT = 3000;

export default function HeroBanner() {
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
    const onScroll = () => setShowScrollPrompt(window.scrollY < SCROLL_PROMPT_THRESHOLD);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* --------------------- Desktop-only particles (no AOS) -------------------- */
  useEffect(() => {
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    const isDesktop = window.matchMedia?.("(min-width: 768px)")?.matches;
    if (!reduced && isDesktop) {
      const t = setTimeout(() => setMountParticles(true), 800);
      return () => clearTimeout(t);
    }
  }, []);

  /* -------------------- Decide if we render the mobile globe ---------------- */
  const computeMobileGlobe = useCallback(() => {
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    const isPhone = !window.matchMedia?.("(min-width: 768px)")?.matches;
    const wideEnough = (typeof window !== "undefined" ? window.innerWidth : 0) >= 320;
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

  const particlesInit = useCallback(async () => {}, []);
  const particlesLoaded = useCallback(async () => {}, []);

  return (
    <section
      className="
        relative z-10 w-full
        min-h-[100svh]
        flex items-stretch justify-center overflow-hidden
        pb-0 pt-0
      "
    >
      {/* Background (desktop only) */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 pointer-events-none opacity-70 hidden md:block
                   bg-[conic-gradient(from_180deg_at_50%_50%,rgba(0,255,255,0.30),rgba(0,122,255,0.30),rgba(0,255,255,0.30))]
                   bg-[length:200%_200%] animate-[gradient-rotate_15s_linear_infinite]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 z-10 pointer-events-none overflow-hidden hidden md:block"
      >
        <div className="absolute z-10 w-[450px] h-[450px] bg-cyan-500/20 blur-[90px] rounded-full left-[5%] top-[15%] animate-float-slow" />
        <div className="absolute z-10 w-[550px] h-[550px] bg-blue-500/10 blur-[110px] rounded-full right-[5%] bottom-[5%] animate-float" />
      </div>

      {/* Video overlay */}
      <div aria-hidden="true" className="absolute inset-0 z-[12] pointer-events-none">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          className={`hero-video w-full h-full object-cover transition-opacity duration-1000 ${
            isLoaded ? "opacity-50" : "opacity-0"
          }`}
          poster="/hero-poster.jpg"
          tabIndex={-1}
        >
          <source src="/hero-bg.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/35 dark:bg-black/45" />
      </div>

      {/* Desktop particles */}
      {mountParticles && (
        <Suspense fallback={null}>
          <Particles
            id="tsparticles"
            init={particlesInit}
            loaded={particlesLoaded}
            options={{
              fullScreen: { enable: false },
              background: { color: "transparent" },
              particles: {
                number: { value: 24 },
                color: { value: "#22d3ee" },
                opacity: { value: 0.2 },
                size: { value: 3 },
                move: { enable: true, speed: 0.4, direction: "none", outModes: "bounce" },
              },
              detectRetina: true,
            }}
            className="absolute inset-0 z-[18] pointer-events-none hidden md:block"
          />
        </Suspense>
      )}

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
            {/* Mobile globe (now allowed on small screens) */}
            {allowMobileGlobe && (
              <div className="md:hidden flex justify-center pt-2 mb-2">
                <div className="relative w-[148px] h-[148px] opacity-90">
                  <GlobeSection
                    showHeader={false}
                    controls={false}
                    sizePx={192}
                    allow3DOnSmall={true}   // ✅ critical for iOS/phones
                  />
                </div>
              </div>
            )}

            {/* Rotating headline */}
            <div className="h-16 xs:h-20 sm:h-28 md:h-40 flex items-center justify-center md:justify-start mb-2 sm:mb-4">
              <AnimatePresence mode="wait">
                <motion.h1
                  key={currentTextIndex}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -18 }}
                  transition={{ duration: 0.45, ease: "easeOut" }}
                  className="font-extrabold leading-[0.98] tracking-tight subpixel-antialiased
                             text-[clamp(1.6rem,6.2vw,3.2rem)] md:text-[clamp(2.75rem,4vw,4.75rem)]
                             bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500
                             whitespace-normal"
                >
                  {ROTATING_TEXTS[currentTextIndex]}
                </motion.h1>
              </AnimatePresence>
            </div>

            {/* Subtitle */}
            <motion.p
              className="text-base sm:text-lg md:text-2xl text-gray-800 dark:text-gray-300 mb-2 max-w-2xl md:max-w-none mx-auto md:mx-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25, duration: 0.6 }}
            >
              SynexiAI is the next-generation innovation hub where{" "}
              <span className="text-cyan-700 dark:text-cyan-400 font-medium">
                Artificial Intelligence
              </span>
              , futuristic IT, and bold ideas converge.
            </motion.p>

            {/* CTAs */}
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
                className="px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500
                           text-white rounded-xl text-base sm:text-lg font-medium shadow-lg shadow-cyan-500/30
                           transition-[transform,background-color,box-shadow] duration-300 will-change-transform md:active:scale-95"
              >
                Explore Our Vision →
              </MotionLink>

              <MotionLink
                to="/projects"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="px-6 py-3 sm:px-8 sm:py-4 border-2 border-cyan-600 dark:border-cyan-400 text-cyan-700 dark:text-cyan-400
                           hover:bg-cyan-600/10 dark:hover:bg-cyan-400/10 rounded-xl text-base sm:text-lg font-medium transition-colors duration-300 md:active:scale-95"
              >
                View Projects
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
                  <p className="text-xs text-gray-800 dark:text-gray-300 mb-1">Scroll down</p>
                  <FaArrowDown className="text-gray-900 dark:text-white text-lg opacity-80" />
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
              <p className="text-sm text-gray-800 dark:text-gray-300 mb-1">Scroll down</p>
              <FaArrowDown className="text-gray-900 dark:text-white text-xl opacity-80" />
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
