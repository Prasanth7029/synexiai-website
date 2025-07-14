import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaArrowDown } from "react-icons/fa";
import { Typewriter } from "react-simple-typewriter";

export default function HeroBanner() {
  const [loaded, setLoaded] = useState(false);
  const [scrollPrompt, setScrollPrompt] = useState(true);

  // Handle video load
  useEffect(() => {
    const video = document.querySelector(".hero-video");
    if (video) {
      video.onloadeddata = () => setLoaded(true);
    }
  }, []);

  // Hide scroll prompt after scrolling
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrollPrompt(false);
      } else {
        setScrollPrompt(true);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative w-full h-screen min-h-[700px] overflow-hidden">
      {/* 🔹 Video Background with Fallback */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className={`hero-video w-full h-full object-cover transition-opacity duration-1000 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
          poster="/hero-poster.jpg"
        >
          <source src="/hero-bg.webm" type="video/webm" />
          <source src="/hero-bg.mp4" type="video/mp4" />
          <img src="/hero-static.jpg" alt="SynexiAI background" className="w-full h-full object-cover" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/70" />
      </div>

      {/* 🔹 Content Overlay */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
            <Typewriter
              words={[
                "Welcome to SynexiAI",
                "We Build the Future",
                "AI • Vision • Innovation",
                "Zero to Forever",
              ]}
              loop={0}
              cursor
              cursorStyle="_"
              typeSpeed={70}
              deleteSpeed={50}
              delaySpeed={2000}
            />
          </h1>

          <p className="text-lg md:text-xl text-gray-300 leading-8 max-w-3xl mx-auto mb-8">
            SynexiAI is the next-generation innovation hub where{" "}
            <span className="text-cyan-400 font-medium">Artificial Intelligence</span>, futuristic IT,
            and bold ideas converge to build a better digital future.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
            <motion.a
              href="/about"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl text-lg font-medium shadow-lg shadow-cyan-500/20 transition-all duration-300"
            >
              Explore Our Vision →
            </motion.a>

            <motion.a
              href="/projects"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400/10 rounded-xl text-lg font-medium transition-all duration-300"
            >
              View Projects
            </motion.a>
          </div>
        </motion.div>

        {/* 🔹 Scroll Prompt */}
        {scrollPrompt && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
          >
            <p className="text-sm text-gray-300 mb-2">Scroll to explore</p>
            <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
              <FaArrowDown className="text-xl text-cyan-400" />
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
