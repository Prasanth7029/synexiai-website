// src/components/social/Testimonials.jsx
import React from "react";
import { motion } from "framer-motion";

const MotionFigure = motion.figure;

export default function Testimonials({ items = [], className = "" }) {
  if (!items.length) return null;

  return (
    <div
      role="list"
      aria-label="Testimonials"
      className={[
        className || "grid-2-3 auto-rows-fr",
        "gap-3 sm:gap-4 md:gap-6",
      ].join(" ")}
    >
      {items.map((t, i) => (
        <MotionFigure
          key={t.id ?? i}
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, delay: i * 0.05 }}
          className="min-w-0 h-full rounded-2xl border border-[var(--border-color)]
                     bg-[var(--card-bg)]/60 p-3 sm:p-4 md:p-6 shadow-sm"
          role="listitem"
        >
          <blockquote className="text-[clamp(12px,3.4vw,14px)] leading-snug opacity-90">
            “{t.quote}”
          </blockquote>
          <figcaption className="mt-3 text-[12px] sm:text-sm opacity-80">
            <span className="font-semibold">{t.author}</span>
            {t.role ? <> — {t.role}</> : null}
          </figcaption>
        </MotionFigure>
      ))}
    </div>
  );
}
