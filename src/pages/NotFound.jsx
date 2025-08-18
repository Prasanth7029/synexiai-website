import React from "react";
import { Link } from "react-router-dom";
import { FaHome, FaGhost, FaCompass } from "react-icons/fa";
import { motion } from "framer-motion";

const MotionDiv = motion.div;
const MotionH1 = motion.h1;
const MotionP = motion.p;

export default function NotFound() {
 return (
 <MotionDiv
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 transition={{ duration: 0.5 }}
 className="min-h-screen flex flex-col items-center justify-center text-center px-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100 transition-colors duration-300"
 >
 <div className="max-w-md mx-auto">
 {/* Animated ghost icon */}
 <MotionDiv
 animate={{
 y: [0, -15, 0],
 rotate: [0, 5, -5, 0],
 }}
 transition={{
 repeat: Infinity,
 duration: 3,
 ease: "easeInOut",
 }}
 className="mb-8"
 >
 <FaGhost className="text-8xl mx-auto text-[#00f7ff] drop-shadow-lg" />
 </MotionDiv>

 {/* 404 text with better animation */}
 <MotionH1
 initial={{ scale: 0.8, opacity: 0 }}
 animate={{ scale: 1, opacity: 1 }}
 transition={{ delay: 0.2, type: "spring" }}
 className="text-7xl md:text-8xl font-extrabold mb-6 text-[#00f7ff] drop-shadow-lg"
 >
 404
 </MotionH1>

 {/* Error message */}
 <MotionP
 initial={{ y: 20, opacity: 0 }}
 animate={{ y: 0, opacity: 1 }}
 transition={{ delay: 0.4 }}
 className="text-xl md:text-2xl mb-6 font-medium"
 >
 Oops! The page you're looking for vanished into the digital void.
 </MotionP>

 {/* Additional helpful message */}
 <MotionP
 initial={{ y: 20, opacity: 0 }}
 animate={{ y: 0, opacity: 1 }}
 transition={{ delay: 0.6 }}
 className="text-gray-600 dark:text-gray-400 mb-8"
 >
 Maybe the URL was mistyped, or the page was moved to another
 dimension.
 </MotionP>

 {/* Action buttons */}
 <MotionDiv
 initial={{ y: 20, opacity: 0 }}
 animate={{ y: 0, opacity: 1 }}
 transition={{ delay: 0.8 }}
 className="flex flex-col sm:flex-row justify-center gap-4"
 >
 <Link
 to="/"
 className="flex items-center justify-center px-6 py-3 bg-[#00f7ff] hover:bg-cyan-400 text-gray-900 font-semibold rounded-lg shadow-md transition-all duration-300 transform hover:scale-105"
 >
 <FaHome className="mr-2" />
 Back to Home
 </Link>

 <Link
 to="/explore"
 className="flex items-center justify-center px-6 py-3 bg-transparent border-2 border-[#00f7ff] text-[#00f7ff] hover:bg-[#00f7ff]/10 font-semibold rounded-lg shadow-md transition-all duration-300 transform hover:scale-105"
 >
 <FaCompass className="mr-2" />
 Explore Content
 </Link>
 </MotionDiv>

 {/* Fun fact */}
 <MotionDiv
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 transition={{ delay: 1 }}
 className="mt-12 p-4 bg-[#00f7ff]/10 border border-[#00f7ff]/30 rounded-lg text-sm"
 >
 <p>Did you know? The first 404 error appeared at CERN in 1990!</p>
 </MotionDiv>
 </div>
 </MotionDiv>
 );
}
