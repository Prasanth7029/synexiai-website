// components/ValueCard.jsx
import React from "react";
import { motion } from "framer-motion";

const MotionDiv = motion.div;

export default function ValueCard({
  icon,
  title,
  description,
  delay = 0,
  className = "",
  highlightColor = "cyan",
}) {
  const gradientMap = {
    cyan: "from-cyan-400 to-teal-400",
    teal: "from-teal-400 to-emerald-400",
    blue: "from-blue-400 to-cyan-400",
    purple: "from-purple-400 to-cyan-400",
    emerald: "from-emerald-400 to-teal-400",
  };
  const accent = gradientMap[highlightColor] || gradientMap.cyan;

  return (
    <MotionDiv
      role="article"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay, duration: 0.5 }}
      className={[
        "h-full flex flex-col justify-start",
        "rounded-2xl text-center",
        "border border-[var(--border-color)] bg-[var(--card-bg)]/60",
        "shadow-sm hover:shadow-cyan-500/20 transition-all duration-300 hover:-translate-y-1.5",
        // 🔒 make every card the same height across the grid
        "min-h-[200px] sm:min-h-[220px] md:min-h-[240px]",
        "p-3 sm:p-4 md:p-6",
        className,
      ].join(" ")}
    >
      <div className="mb-3 sm:mb-4 flex justify-center">
        <div className="inline-flex h-10 w-10 sm:h-11 sm:w-11 md:h-12 md:w-12 items-center justify-center rounded-xl bg-white/10 border border-white/10">
          {icon}
        </div>
      </div>

      <h4
        className={[
          "font-semibold mb-1.5 sm:mb-2 bg-clip-text text-transparent",
          "text-[clamp(13px,3.6vw,16px)] md:text-[clamp(16px,2.2vw,20px)]",
          `bg-gradient-to-r ${accent}`,
        ].join(" ")}
      >
        {title}
      </h4>

      {description && (
        <p className="text-[clamp(12px,3.4vw,14px)] text-gray-700 dark:text-gray-300 leading-snug line-clamp-3">
          {description}
        </p>
      )}
    </MotionDiv>
  );
}
