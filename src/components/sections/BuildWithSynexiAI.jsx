// src/components/sections/BuildWithSynexiAI.jsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import PersonaSwitch from "../PersonaSwitch";
import { usePersona } from "../../context/PersonaContext";

/* Persona copy (kept local; move to /content if you prefer) */
const copy = {
  investor: {
    title: "Build with SynexiAI",
    blurb:
      "Back AI-first products with real metrics: time-to-market, R&D velocity, unit costs per inference, and security posture.",
    bullets: [
      "Quarterly roadmap & measurable KPIs",
      "Risk-managed pilots with rollbacks",
      "Security-by-design & compliance path",
    ],
    ctas: [
      { label: "See Live Demos", to: "/portfolio" },
      { label: "Investor Deck", to: "/portfolio?asset=pitch" },
    ],
  },
  developer: {
    title: "APIs, SDKs & Real-Time",
    blurb:
      "Ship faster with REST/WebSocket APIs, JS/TS SDKs, and examples that deploy in minutes.",
    bullets: ["Starter kits (React, Vite, Spring Boot)", "Streaming APIs & webhooks", "Auth patterns (JWT, API keys)"],
    ctas: [
      { label: "Explore Tech Stack", to: "/#/tech" },
      { label: "See Live Demos", to: "/portfolio" },
    ],
  },
  partner: {
    title: "Co-Build with SynexiAI",
    blurb:
      "Joint solutions, white-label options, and data-safe microservices tailored to your requirements.",
    bullets: ["Integration playbooks", "SLAs & support tiers", "Go-to-market collaboration"],
    ctas: [
      { label: "Partnerships", to: "/#/contact" },
      { label: "Case Studies", to: "/portfolio" },
    ],
  },
  general: {
    title: "Build with SynexiAI",
    blurb: "APIs, partnerships, and demos for investors, developers, and collaborators.",
    bullets: ["Investor KPIs & roadmap", "Dev SDKs & streaming APIs", "Co-build partner playbooks"],
    ctas: [
      { label: "Explore Tech Stack", to: "/#/tech" },
      { label: "See Live Demos", to: "/portfolio" },
    ],
  },
};

export default function BuildWithSynexiAI() {
  const { persona } = usePersona();
  const key = copy[persona] ? persona : "general";
  const data = copy[key];

  return (
    <section className="relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        {/* Header row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6 mb-6">
          <div className="min-w-0">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight brand-gradient bg-clip-text text-transparent">
              Build with SynexiAI
            </h2>
            <p
              className="text-sm sm:text-base mt-1"
              style={{ color: "color-mix(in oklab, var(--color-text) 75%, transparent)" }}
            >
              APIs, SDKs, and real-time services to ship AI-first products — fast.
            </p>
          </div>
          <PersonaSwitch className="self-start sm:self-auto" />
        </div>

        {/* Panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch"
          >
            {/* Left: content card */}
            <div className="md:col-span-2 card p-5 sm:p-6 md:p-7 min-w-0">
              <h3 className="text-xl sm:text-2xl font-bold mb-2" style={{ color: "var(--color-text)" }}>
                {data.title}
              </h3>
              <p className="mb-4" style={{ color: "color-mix(in oklab, var(--color-text) 86%, transparent)" }}>
                {data.blurb}
              </p>

              <ul className="space-y-2 text-sm">
                {data.bullets.map((b, i) => (
                  <li key={i} className="flex items-start">
                    <span className="dot-accent" aria-hidden="true" />
                    <span style={{ color: "color-mix(in oklab, var(--color-text) 88%, transparent)" }}>{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: action card */}
            <div
              className="section p-5 sm:p-6 md:p-7"
              style={{
                background:
                  "linear-gradient(180deg, rgba(255,255,255,.02), rgba(255,255,255,0))",
              }}
            >
              <div className="grid gap-3">
                {data.ctas.map((c, i) => (
                  <Link
                    key={i}
                    to={c.to}
                    className="btn-primary text-center rounded-xl px-4 py-2.5 sm:py-3"
                  >
                    {c.label}
                  </Link>
                ))}
              </div>
              <p
                className="text-[11px] mt-3 text-center"
                style={{ color: "color-mix(in oklab, var(--color-text) 65%, transparent)" }}
              >
                No spam. Clear docs. Real demos.
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
