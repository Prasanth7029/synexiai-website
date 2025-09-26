// components/ValueCard.jsx
import React from "react";
import { motion, useReducedMotion } from "framer-motion";

const MotionDiv = motion.div;

/**
 * ValueCard
 * - Theme-aware via CSS variables in index.css
 * - Smooth, reduced-motion friendly entrance
 * - Flexible accent gradient via highlightColor
 * - Glassy surface + consistent sizing across grid
 */
export default function ValueCard({
  icon,
  title,
  description,
  delay = 0,
  className = "",
  highlightColor = "cyan", // cyan | teal | blue | purple | emerald
}) {
  const prefersReducedMotion = useReducedMotion();

  // Map prop → gradient stops (CSS vars allow theme alignment)
  const accentStops = {
    cyan:    ["#22d3ee", "#14b8a6"], // brand-cyan → teal
    teal:    ["#14b8a6", "#10b981"],
    blue:    ["#3b82f6", "#22d3ee"],
    purple:  ["#a78bfa", "#22d3ee"],
    emerald: ["#10b981", "#14b8a6"],
  }[highlightColor] || ["#22d3ee", "#14b8a6"];

  const styleCard = {
    background: "color-mix(in oklab, var(--card-bg) 85%, transparent)",
    borderColor: "var(--border-color)",
    color: "var(--color-text)",
    backdropFilter: "blur(8px)",
    WebkitBackdropFilter: "blur(8px)",
  };

  const styleIconRing = {
    background: "color-mix(in oklab, var(--card-bg) 70%, transparent)",
    borderColor: "var(--border-color)",
  };

  const styleTitle = {
    backgroundImage: `linear-gradient(90deg, ${accentStops[0]}, ${accentStops[1]})`,
  };

  return (
    <MotionDiv
      role="article"
      aria-label={title}
      initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
      whileInView={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay, duration: 0.5, ease: "easeOut" }}
      className={[
        "h-full flex flex-col justify-start",
        "rounded-2xl text-center",
        "border shadow-sm hover:shadow-cyan-500/20",
        "transition-all duration-300 will-change-transform",
        "hover:-translate-y-1.5",
        // unified heights on all screens
        "min-h-[200px] sm:min-h-[220px] md:min-h-[240px]",
        "p-3 sm:p-4 md:p-6",
        className,
      ].join(" ")}
      style={styleCard}
    >
      {/* icon */}
      <div className="mb-3 sm:mb-4 flex justify-center">
        <div
          className="inline-flex h-10 w-10 sm:h-11 sm:w-11 md:h-12 md:w-12 items-center justify-center rounded-xl border"
          style={styleIconRing}
          aria-hidden="true"
        >
          {icon}
        </div>
      </div>

      {/* title */}
      <h4
        className={[
          "font-semibold mb-1.5 sm:mb-2",
          "bg-clip-text text-transparent",
          "text-[clamp(13px,3.6vw,16px)] md:text-[clamp(16px,2.2vw,20px)]",
        ].join(" ")}
        style={styleTitle}
      >
        {title}
      </h4>

      {/* description */}
      {description && (
        <p
          className="text-[clamp(12px,3.4vw,14px)] leading-snug line-clamp-3"
          style={{ color: "color-mix(in oklab, var(--color-text) 85%, #6b7280)" }}
        >
          {description}
        </p>
      )}
    </MotionDiv>
  );
}
