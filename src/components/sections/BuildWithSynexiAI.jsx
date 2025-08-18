// src/components/sections/BuildWithSynexiAI.jsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import PersonaSwitch from "../PersonaSwitch";
import { usePersona } from "../../context/PersonaContext";

// Copy per persona (kept local to the section; you can move to /content if preferred)
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
 { label: "Investor Deck", to: "/portfolio?asset=pitch" }, // keep the deck under Projects for now
 ],
 },
 developer: {
 title: "APIs, SDKs & Real-Time",
 blurb:
 "Ship faster with REST/WebSocket APIs, JS/TS SDKs, and examples that deploy in minutes.",
 bullets: [
 "Starter kits (React, Vite, Spring Boot)",
 "Streaming APIs & webhooks",
 "Auth patterns (JWT, API keys)",
 ],
 ctas: [
 { label: "Explore Tech Stack", to: "/#/tech" },
 { label: "See Live Demos", to: "/portfolio" },
 ],
 },
 partner: {
 title: "Co-Build with SynexiAI",
 blurb:
 "Joint solutions, white-label options, and data-safe microservices tailored to your requirements.",
 bullets: [
 "Integration playbooks",
 "SLAs & support tiers",
 "Go-to-market collaboration",
 ],
 ctas: [
 { label: "Partnerships", to: "/#/contact" },
 { label: "Case Studies", to: "/portfolio" },
 ],
 },
 // Optional: what to show if persona = 'general'
 general: {
 title: "Build with SynexiAI",
 blurb:
 "APIs, partnerships, and demos for investors, developers, and collaborators.",
 bullets: [
 "Investor KPIs & roadmap",
 "Dev SDKs & streaming APIs",
 "Co-build partner playbooks",
 ],
 ctas: [
 { label: "Explore Tech Stack", to: "/#/tech" },
 { label: "See Live Demos", to: "/portfolio" },
 ],
 },
};

export default function BuildWithSynexiAI() {
 const { persona, setPersona } = usePersona();
 const key = copy[persona] ? persona : "general";
 const data = copy[key];

 return (
 <section className="relative overflow-hidden">
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
 {/* Header row */}
 <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
 <div>
 <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
 Build with SynexiAI
 </h2>
 <p className="text-sm text-gray-600 dark:text-gray-400">
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
 transition={{ duration: 0.18 }}
 className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch"
 >
 <div className="md:col-span-2 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl p-5 ">
 <h3 className="text-xl sm:text-2xl font-bold mb-2">{data.title}</h3>
 <p className="text-gray-800 dark:text-gray-300 mb-4">{data.blurb}</p>
 <ul className="space-y-2 text-sm text-gray-800 dark:text-gray-300">
 {data.bullets.map((b, i) => (
 <li key={i} className="flex items-start">
 <span className="mt-1 mr-2 h-1.5 w-1.5 rounded-full bg-cyan-400" />
 <span>{b}</span>
 </li>
 ))}
 </ul>
 </div>
 <div className="bg-gradient-to-br from-cyan-600/20 to-teal-600/20 border border-white/10 rounded-2xl p-5">
 <div className="grid gap-3">
 {data.ctas.map((c, i) => (
 <Link
 key={i}
 to={c.to}
 className="text-center rounded-lg px-4 py-2.5 bg-gradient-to-r from-cyan-600 to-teal-500 hover:from-cyan-500 hover:to-teal-400 text-white font-medium transition-colors active:scale-95"
 >
 {c.label}
 </Link>
 ))}
 </div>
 <p className="text-[11px] text-gray-600 dark:text-gray-400 mt-3 text-center">
 No spam. Clear docs. Real demos.
 </p>
 </div>
 </motion.div>
 </AnimatePresence>
 </div>
 </section>
 );
}
