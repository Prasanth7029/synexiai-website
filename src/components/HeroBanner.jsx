import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaArrowDown } from "react-icons/fa";
import { Typewriter } from "react-simple-typewriter";
import { Link } from 'react-router-dom';


const MotionLink = motion(Link);
export default function HeroBanner() {
  const [loaded, setLoaded] = useState(false);
  const [scrollPrompt, setScrollPrompt] = useState(true);


  useEffect(() => {
    const video = document.querySelector(".hero-video");
    if (video) {
      video.onloadeddata = () => setLoaded(true);
      // Fallback in case video doesn't load
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

  return (
    <div className="relative w-full h-screen  flex items-center justify-center">
      {/* Gradient Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute z-0 w-[500px] h-[500px] bg-cyan-500/20 blur-[120px] rounded-full left-[10%] top-[20%] animate-float-slow" />
        <div className="absolute z-0 w-[600px] h-[600px] bg-blue-600/10 blur-[160px] rounded-full right-[5%] bottom-[10%] animate-float" />
      </div>

      {/* Video Background with Fallback Gradient */}
      <div className="absolute inset-0 z-0">
        <video
          loading="lazy"
          autoPlay
          loop
          muted
          playsInline
          className={`hero-video w-full h-full  duration-1000 ${
            loaded ? "opacity-30" : "opacity-0"
          }`}
          poster="/hero-poster.jpg"
        >
          <source src="/hero-bg.mp4" type="video/mp4" />
        </video>
        {!loaded && (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-cyan-900" />
        )}
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-6xl px-4"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
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

            <p className="text-xl md:text-2xl text-gray-300 leading-relaxed max-w-4xl mx-auto mb-8">
              SynexiAI is the next-generation innovation hub where{" "}
              <span className="text-cyan-400 font-medium">Artificial Intelligence</span>, 
              futuristic IT, and bold ideas converge to build a better digital future.
            </p>
          </motion.div>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
            <MotionLink
              to="/about"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl text-lg font-medium shadow-lg shadow-cyan-500/30 transition-all duration-300"
            >
              Explore Our Vision →
            </MotionLink>

            <MotionLink
              to="/projects"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400/10 rounded-xl text-lg font-medium transition-all duration-300"
            >
              View Projects
            </MotionLink>
          </div>
        </motion.div>

        {/* Scroll Prompt */}
        {scrollPrompt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
          >
            <p className="text-sm text-gray-300 mb-2">Scroll to explore</p>
            <motion.div 
              animate={{ y: [0, 10, 0] }} 
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <FaArrowDown className="text-xl text-cyan-400" />
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}