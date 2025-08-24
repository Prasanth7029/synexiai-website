// src/components/FeatureCard.jsx
import React from "react";
import { motion } from "framer-motion";

const MotionArticle = motion.article;

export default function FeatureCard({
  icon,
  title,
  description,
  delay = 0,
  className = "",
}) {
  return (
    <MotionArticle
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay }}
      role="region"
      aria-label={title}
      className={[
        // layout
        "group flex h-full min-w-0 flex-col justify-between",
        // tighter on mobile; scale up at md+
        "min-h-[140px] md:min-h-[220px]",
        "rounded-2xl border border-[var(--border-color)]",
        // background + shadow polish
        "bg-white/5 shadow-sm hover:shadow-cyan-500/10",
        "transition-[transform,box-shadow,background] duration-300",
        // responsive padding
        "p-3 sm:p-4 md:p-6",
        className,
      ].join(" ")}
    >
      {/* Top row: icon + title + desc */}
      <div className="min-w-0">
        <div
          className={[
            "mb-4 sm:mb-5 inline-flex items-center justify-center",
            "h-10 w-10 sm:h-11 sm:w-11 md:h-12 md:w-12",
            "rounded-xl bg-cyan-500/10 border border-cyan-400/20",
            "ring-0 group-hover:ring-2 group-hover:ring-cyan-400/30",
            "transition-shadow",
          ].join(" ")}
          aria-hidden="true"
        >
          {icon /* keep incoming icon styling */}
        </div>

        <h3
          className={[
            "font-semibold leading-snug text-gray-900 dark:text-gray-100",
            // fluid, compact title sizing
            "text-[clamp(13px,3.6vw,16px)] md:text-[clamp(16px,2.2vw,20px)]",
          ].join(" ")}
        >
          {title}
        </h3>

        {description && (
          <p
            className={[
              "mt-2 sm:mt-3 text-gray-700 dark:text-gray-300",
              // fluid, compact body sizing
              "text-[clamp(12px,3.4vw,14px)] md:text-[clamp(14px,2vw,16px)]",
              "leading-snug",
              "line-clamp-3",
            ].join(" ")}
          >
            {description}
          </p>
        )}
      </div>

      {/* Bottom accent line on hover */}
      <div
        aria-hidden="true"
        className={[
          "mt-5 sm:mt-6 h-px w-full",
          "bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent",
          "opacity-0 group-hover:opacity-100 transition-opacity",
        ].join(" ")}
      />
    </MotionArticle>
  );
}
