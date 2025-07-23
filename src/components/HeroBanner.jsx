import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaArrowDown } from "react-icons/fa";
import { Link } from "react-router-dom";
import Particles from "react-tsparticles";

const MotionLink = motion(Link);

const TEXTS = [
  "Welcome to SynexiAI",
  "We Build the Future",
  "AI • Vision • Innovation",
  "Zero to Forever",
];

export default function HeroBanner() {
  const [loaded, setLoaded] = useState(false);
  const [scrollPrompt, setScrollPrompt] = useState(true);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  // Text rotation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex((prev) => (prev + 1) % TEXTS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const video = document.querySelector(".hero-video");
    if (video) {
      video.onloadeddata = () => setLoaded(true);
      setTimeout(() => setLoaded(true), 3000);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrollPrompt(window.scrollY < 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const particlesInit = useCallback((engine) => {
    // load tsparticles plugins if needed
  }, []);
  const particlesLoaded = useCallback((container) => {}, []);

  return (
    <div className="relative w-full h-screen flex items-center justify-center overflow-hidden">
      {/* Background Elements */}
      <div
        className="
          absolute inset-0 z-0
          bg-[conic-gradient(from_180deg_at_50%_50%,_rgba(0,255,255,0.3),_rgba(0,122,255,0.3),_rgba(0,255,255,0.3))]
          bg-[length:200%_200%]
          opacity-70
          animate-[gradient-rotate_15s_linear_infinite]
        "
      />

      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute z-10 w-[300px] h-[300px] sm:w-[450px] sm:h-[450px] bg-cyan-500/20 blur-[80px] sm:blur-[100px] rounded-full left-[5%] top-[15%] animate-float-slow" />
        <div className="absolute z-10 w-[350px] h-[350px] sm:w-[550px] sm:h-[550px] bg-blue-500/10 blur-[100px] sm:blur-[140px] rounded-full right-[5%] bottom-[5%] animate-float" />
      </div>

      <div className="absolute inset-0 z-5">
        <video
          loading="lazy"
          autoPlay
          loop
          muted
          playsInline
          className={`hero-video w-full h-full object-cover transition-opacity duration-1000
            ${loaded ? "opacity-50" : "opacity-0"}
          `}
          poster="/hero-poster.jpg"
        >
          <source src="/hero-bg.mp4" type="video/mp4" />
        </video>
        {!loaded && (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-cyan-900" />
        )}
      </div>

      <Particles
        id="tsparticles"
        init={particlesInit}
        loaded={particlesLoaded}
        options={{
          fullScreen: { enable: false },
          background: { color: "transparent" },
          particles: {
            number: { value: 30 },
            color: { value: "#22d3ee" },
            opacity: { value: 0.2 },
            size: { value: 3 },
            move: { enable: true, speed: 0.5, direction: "none", outModes: "bounce" }
          }
        }}
        className="absolute inset-0 z-20 pointer-events-none"
      />

      {/* Content */}
      <div className="relative z-30 flex flex-col items-center justify-center w-full h-screen px-4 sm:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto px-4"
        >
          <div className="h-28 sm:h-36 md:h-40 flex items-center justify-center mb-4 sm:mb-6">
            <AnimatePresence mode="wait">
              <motion.h1
                key={currentTextIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500"
              >
                {TEXTS[currentTextIndex]}
              </motion.h1>
            </AnimatePresence>
          </div>

          <motion.p
            className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-2 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            SynexiAI is the next-generation innovation hub where{" "}
            <span className="text-cyan-400 font-medium">
              Artificial Intelligence
            </span>
            , futuristic IT, and bold ideas converge.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <MotionLink
              to="/about"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl text-base sm:text-lg font-medium shadow-lg shadow-cyan-500/30 transition-all duration-300"
            >
              Explore Our Vision →
            </MotionLink>
            <MotionLink
              to="/projects"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 sm:px-8 sm:py-4 border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400/10 rounded-xl text-base sm:text-lg font-medium transition-all duration-300"
            >
              View Projects
            </MotionLink>
          </motion.div>
        </motion.div>

        {/* Scroll Prompt Arrow */}
        {scrollPrompt && (
          <motion.div
            className="absolute bottom-8 sm:bottom-16 left-1/2 transform -translate-x-1/2 z-30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.6 }}
          >
            <motion.div
              className="flex flex-col items-center"
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <p className="text-xs sm:text-sm text-gray-300 mb-1">Scroll down</p>
              <FaArrowDown className="text-white text-lg sm:text-xl opacity-80" />
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}