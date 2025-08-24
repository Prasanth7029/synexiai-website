// src/components/projects/ProjectCard.jsx
import React from "react";
import useAskAI from "../../lib/useAskAI.js";
import { motion } from "framer-motion";

const MotionArticle = motion.article;

export default function ProjectCard({ item, idx = 0 }) {
  const askAI = useAskAI();
  const onExplain = () =>
    askAI({
      type: "explain-project",
      persona: localStorage.getItem("persona") || "general",
      autoSend: true,
      project: {
        id: item.id,
        title: item.title,
        blurb: item.blurb,
        tech: item.tech,
        status: item.status,
        category: item.category,
        tags: item.tags,
      },
    });

  return (
    <MotionArticle
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.4, delay: idx * 0.03 }}
      className={[
        "h-full min-w-0 flex flex-col",
        "rounded-2xl border border-[var(--border-color)]",
        "bg-[var(--card-bg)]/60 shadow-sm hover:shadow-cyan-500/10",
        // compact padding & height on phones
        "min-h-[140px] md:min-h-[220px] p-3 sm:p-4 md:p-6",
        "transition-[box-shadow,transform] duration-300",
      ].join(" ")}
      role="region"
      aria-label={item.title}
    >
      {/* header */}
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-semibold text-[clamp(13px,3.6vw,16px)] md:text-[18px]">
          {item.title}
        </h3>
        <span className="text-[10px] sm:text-[11px] px-2 py-1 rounded-full bg-white/5 border border-white/10 whitespace-nowrap">
          {item.status}
        </span>
      </div>

      {/* blurb */}
      <p className="mt-2 text-[clamp(12px,3.4vw,14px)] opacity-90 leading-snug">
        {item.blurb}
      </p>

      {/* tech */}
      <div className="mt-3 flex flex-wrap gap-2">
        {(item.tech ?? []).slice(0, 4).map((t) => (
          <span
            key={t}
            className="text-[10px] sm:text-[11px] px-2 py-1 rounded-full bg-white/5 border border-white/10"
          >
            {t}
          </span>
        ))}
      </div>

      {/* tags */}
      <div className="mt-3 flex flex-wrap gap-2">
        {(item.tags ?? []).map((t) => (
          <span
            key={t}
            className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20"
          >
            {t}
          </span>
        ))}
      </div>

      {/* links + CTA */}
      <div className="mt-4 flex flex-wrap items-center gap-3">
        {item.links?.demo && (
          <a href={item.links.demo} target="_blank" rel="noreferrer noopener" className="text-sm underline">
            Demo
          </a>
        )}
        {item.links?.repo && (
          <a href={item.links.repo} target="_blank" rel="noreferrer noopener" className="text-sm underline">
            Repo
          </a>
        )}
        {item.links?.doc && (
          <a href={item.links.doc} target="_blank" rel="noreferrer noopener" className="text-sm underline">
            Docs
          </a>
        )}

        <span className="ml-auto" />
        <button
          onClick={onExplain}
          className="text-sm px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500"
        >
          Explain with AI
        </button>
      </div>
    </MotionArticle>
  );
}
