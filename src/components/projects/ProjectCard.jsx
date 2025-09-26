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
      role="region"
      aria-label={item.title}
      className={[
        "h-full min-w-0 flex flex-col",
        // theme-aware shell from tokens in index.css
        "rounded-2xl border",
        "shadow-sm hover:shadow-cyan-500/10",
        "transition-[box-shadow,transform] duration-300",
        // compact padding & height on phones
        "min-h-[140px] md:min-h-[220px] p-3 sm:p-4 md:p-6",
      ].join(" ")}
      style={{
        // pulls from :root / html.dark values
        background: "color-mix(in oklab, var(--card-bg) 85%, transparent)",
        borderColor: "var(--border-color)",
        color: "var(--card-text)",
        // subtle glass in both themes
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
      }}
    >
      {/* header */}
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-semibold text-[clamp(13px,3.6vw,16px)] md:text-[18px]">
          {item.title}
        </h3>

        {/* status pill uses theme tokens */}
        <span
          className="text-[10px] sm:text-[11px] px-2 py-1 rounded-full border whitespace-nowrap"
          style={{
            background:
              "color-mix(in oklab, var(--brand-cyan-soft) 60%, transparent)",
            borderColor: "var(--border-color)",
            color: "var(--color-text)",
          }}
        >
          {item.status}
        </span>
      </div>

      {/* blurb */}
      <p
        className="mt-2 text-[clamp(12px,3.4vw,14px)] leading-snug"
        style={{ opacity: 0.9 }}
      >
        {item.blurb}
      </p>

      {/* tech */}
      <div className="mt-3 flex flex-wrap gap-2">
        {(item.tech ?? []).slice(0, 4).map((t) => (
          <span
            key={t}
            className="text-[10px] sm:text-[11px] px-2 py-1 rounded-full border"
            style={{
              background: "color-mix(in oklab, var(--card-bg) 88%, transparent)",
              borderColor: "var(--border-color)",
            }}
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
            className="text-[10px] px-2 py-0.5 rounded-full border"
            style={{
              background:
                "color-mix(in oklab, var(--brand-cyan-soft) 70%, transparent)",
              color: "color-mix(in oklab, var(--brand-cyan) 85%, #7dd3fc)",
              borderColor: "color-mix(in oklab, var(--brand-cyan) 35%, var(--border-color))",
            }}
          >
            {t}
          </span>
        ))}
      </div>

      {/* links + CTA */}
      <div className="mt-4 flex flex-wrap items-center gap-3">
        {item.links?.demo && (
          <a
            href={item.links.demo}
            target="_blank"
            rel="noreferrer noopener"
            className="text-sm underline"
            style={{ color: "var(--link)" }}
          >
            Demo
          </a>
        )}
        {item.links?.repo && (
          <a
            href={item.links.repo}
            target="_blank"
            rel="noreferrer noopener"
            className="text-sm underline"
            style={{ color: "var(--link)" }}
          >
            Repo
          </a>
        )}
        {item.links?.doc && (
          <a
            href={item.links.doc}
            target="_blank"
            rel="noreferrer noopener"
            className="text-sm underline"
            style={{ color: "var(--link)" }}
          >
            Docs
          </a>
        )}

        <span className="ml-auto" />

        {/* CTA follows your brand gradient but respects focus + tokens */}
        <button
          onClick={onExplain}
          className="text-sm px-3 py-1.5 rounded-lg focus:outline-none focus-visible:ring-2"
          style={{
            backgroundImage:
              "linear-gradient(to right, var(--secondary), #2563eb)",
            color: "#fff",
            border: "1px solid color-mix(in oklab, var(--secondary) 45%, transparent)",
            boxShadow: "0 8px 24px rgba(34,211,238,.12)",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.filter = "brightness(1.05)")}
          onMouseLeave={(e) => (e.currentTarget.style.filter = "none")}
        >
          Explain with AI
        </button>
      </div>
    </MotionArticle>
  );
}
