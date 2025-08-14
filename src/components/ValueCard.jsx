import { motion } from "framer-motion";
// components/ValueCard.jsx
import React from "react";

const MotionDiv = motion.div;

export default function ValueCard({
  icon,
  title,
  description,
  delay = 0, // seconds, e.g. 0.1, 0.2 ...
  className = "",
  highlightColor = "cyan", // "cyan" | "teal" | "blue" | "purple" | "emerald"
}) {
  const gradientMap = {
    cyan: "from-cyan-400 to-teal-400",
    teal: "from-teal-400 to-emerald-400",
    blue: "from-blue-400 to-cyan-400",
    purple: "from-purple-400 to-cyan-400",
    emerald: "from-emerald-400 to-teal-400",
  };
  const accent = gradientMap[highlightColor] || gradientMap.cyan;

  const base =
    "rounded-xl p-6 text-center bg-white/5 border border-white/10 backdrop-blur-sm " +
    "shadow-lg hover:shadow-cyan-500/20 transition-all duration-300 hover:-translate-y-2";

  return (
    <MotionDiv
      role="article"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay, duration: 0.5 }}
      className={`${base} ${className}`}
    >
      {/* icon in a soft glass circle */}
      <div className="mb-4 flex justify-center">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 border border-white/10">
          {icon}
        </div>
      </div>

      {/* gradient title */}
      <h4
        className={`text-lg font-semibold mb-2 bg-clip-text text-transparent bg-gradient-to-r ${accent}`}
      >
        {title}
      </h4>

      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
        {description}
      </p>
    </MotionDiv>
  );
}
