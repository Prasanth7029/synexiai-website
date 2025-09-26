// src/pages/VisionPage.jsx
import React from "react";
import Container from "../components/Container";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import ErrorBoundary from "../components/ErrorBoundary";
import { FaDownload, FaHandshake, FaRocket, FaChartLine } from "react-icons/fa";
import { motion } from "framer-motion";

/* --------------------------------- Data ---------------------------------- */

const MotionDiv = motion.div;
const MotionH2 = motion.h2;
const MotionP = motion.p;
const MotionLi = motion.li;

const roadmap = [
  {
    year: "2025 – 2030 (Phase 1: Foundation)",
    goals: [
      { text: "Launch SynexiAI's unified platform & intelligent dashboard ecosystem", status: "completed" },
      { text: "Build AI-powered microservices (search, NLP, alerting, analytics)", status: "in-progress" },
      { text: "Implement Zero Trust Architecture & blockchain-backed audit systems", status: "planned" },
      { text: "Apply AI to healthcare, education, energy & civic systems", status: "planned" },
      { text: "Lay groundwork for smart datacenter infrastructure (green energy powered)", status: "planned" },
    ],
    icon: "🛠️",
    color: "bg-cyan-500",
  },
  {
    year: "2030 – 2040 (Phase 2: Expansion)",
    goals: [
      { text: "Launch the SynexiAI Smart City prototype powered by AI + renewables", status: "planned" },
      { text: "Operate AI-driven cloud infrastructure for public systems", status: "planned" },
      { text: "Expand research in self-healing systems & human-AI co-design", status: "planned" },
      { text: "Launch SynexiAI Assistant — the open citizen knowledge engine", status: "planned" },
      { text: "Enable intelligent governance, decentralized civic apps", status: "planned" },
    ],
    icon: "🌐",
    color: "bg-teal-500",
  },
  {
    year: "2040 – 2045+ (Phase 3: Transformation)",
    goals: [
      { text: "Become the global tech standard in AI, cloud & sustainability", status: "planned" },
      { text: "Build the world's first fully self-regulating smart-energy AI city", status: "planned" },
      { text: "Shape governance through real-time citizen-AI collaboration", status: "planned" },
      { text: "Democratize intelligence — tools that uplift every human life", status: "planned" },
    ],
    icon: "🚀",
    color: "bg-purple-500",
  },
];

const statusIcon = { completed: "✅", "in-progress": "🔄", planned: "📅" };
const statusColor = {
  completed: { color: "#34d399" }, // emerald-400
  "in-progress": { color: "#f59e0b" }, // amber-500
  planned: { color: "color-mix(in oklab, var(--color-text) 65%, transparent)" },
};

/* ------------------------------ Subcomponents ----------------------------- */
function CardSurface({ className = "", children }) {
  return (
    <div
      className={["rounded-2xl border shadow-lg", className].join(" ")}
      style={{
        background: "color-mix(in oklab, var(--card-bg) 86%, transparent)",
        borderColor: "var(--border-color)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
      }}
    >
      {children}
    </div>
  );
}

function RoadmapItem({ milestone, index }) {
  return (
    <MotionDiv
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className={`relative mb-16 ${index % 2 === 0 ? "md:pr-[50%] md:pl-10" : "md:pl-[50%] md:pr-10"}`}
    >
      {/* Timeline node */}
      <div
        className={`absolute top-1 left-8 md:left-1/2 w-6 h-6 ${milestone.color} rounded-full shadow-lg -translate-x-1/2
        flex items-center justify-center text-white`}
        aria-hidden="true"
      >
        <span className="text-sm leading-none">{milestone.icon}</span>
      </div>

      {/* Card */}
      <MotionDiv whileHover={{ y: -4 }} className={`${index % 2 === 0 ? "md:mr-8" : "md:ml-8"} min-w-0`}>
        <CardSurface className="p-6 sm:p-8">
          <div className="flex items-center mb-6 min-w-0">
            <h3
              className="text-[clamp(1.25rem,3.5vw,1.75rem)] font-bold break-words brand-gradient"
              style={{ WebkitTextFillColor: "transparent" }}
            >
              {milestone.year}
            </h3>
          </div>

          <ul className="space-y-4">
            {milestone.goals.map((goal, idx) => (
              <MotionLi
                key={`${milestone.year}-${idx}`}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="flex items-start min-w-0"
                style={{ color: "var(--color-text)" }}
              >
                <span className="mr-3 mt-1 shrink-0" aria-hidden="true">
                  <span style={statusColor[goal.status]}>{statusIcon[goal.status] || "•"}</span>
                </span>
                <span style={{ color: "color-mix(in oklab, var(--color-text) 88%, transparent)" }}>{goal.text}</span>
              </MotionLi>
            ))}
          </ul>
        </CardSurface>
      </MotionDiv>
    </MotionDiv>
  );
}

/* --------------------------------- Page ---------------------------------- */
export default function VisionPage() {
  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

  return (
    <>
      <Helmet>
        <title>SynexiAI Vision & Future Roadmap</title>
        <meta
          name="description"
          content="Explore SynexiAI's strategic roadmap for transforming AI, smart cities, and civic technology over the next two decades."
        />
        <meta property="og:image" content="/assets/vision-preview.jpg" />
      </Helmet>

      <ErrorBoundary>
        <Container animate className="relative overflow-hidden" style={{ color: "var(--color-text)" }}>
          {/* Subtle blobs */}
          <div className="absolute inset-0 -z-10 pointer-events-none">
            <div className="hidden sm:block absolute top-0 left-1/4 w-[300px] h-[300px] rounded-full blur-[100px]"
                 style={{ background: "color-mix(in oklab, var(--brand-cyan) 18%, transparent)" }} />
            <div className="hidden sm:block absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full blur-[120px]"
                 style={{ background: "color-mix(in oklab, #14b8a6 14%, transparent)" }} />
          </div>

          {/* Hero */}
          <section id="hero" className="relative z-10 text-center py-14 sm:py-16 md:py-24 scroll-mt-[calc(var(--header-h,64px)+16px)]">
            <MotionDiv
              initial={prefersReduced ? false : { opacity: 0, y: 40 }}
              animate={prefersReduced ? {} : { opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl mx-auto px-4"
            >
              <h1 className="text-[clamp(1.75rem,4vw,3.75rem)] font-bold mb-6">
                <span className="brand-gradient bg-clip-text text-transparent">SynexiAI Vision</span>
                <span className="ml-3" aria-hidden="true">🌌</span>
              </h1>

              <MotionP
                initial={prefersReduced ? false : { opacity: 0 }}
                animate={prefersReduced ? {} : { opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="text-lg sm:text-xl md:text-2xl mb-8 leading-relaxed"
                style={{ color: "color-mix(in oklab, var(--color-text) 82%, transparent)" }}
              >
                Our strategic roadmap to revolutionize artificial intelligence
                and build sustainable, human-centric systems
              </MotionP>

              <MotionDiv
                initial={prefersReduced ? false : { opacity: 0, y: 20 }}
                animate={prefersReduced ? {} : { opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <Link
                  to="/contact"
                  className="inline-flex items-center px-8 py-4 rounded-xl font-semibold btn-primary focus:outline-none focus-visible:ring-2"
                  style={{ boxShadow: "0 14px 32px rgba(34,211,238,.18)" }}
                >
                  <span>Join Our Mission</span>
                  <FaRocket className="ml-2 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </Link>
              </MotionDiv>
            </MotionDiv>
          </section>

          {/* Roadmap */}
          <section id="roadmap" className="relative z-10 py-12 pl-4 sm:pl-0 scroll-mt-[calc(var(--header-h,64px)+16px)]">
            <div className="max-w-6xl mx-auto">
              <MotionH2
                initial={prefersReduced ? false : { opacity: 0, y: 20 }}
                whileInView={prefersReduced ? {} : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                className="text-[clamp(1.5rem,3.5vw,2.25rem)] font-bold text-center mb-16 brand-gradient"
                style={{ WebkitTextFillColor: "transparent" }}
              >
                Strategic Roadmap
              </MotionH2>

              <div className="relative">
                {/* Vertical line */}
                <div
                  className="absolute left-8 md:left-1/2 top-0 h-full w-px -translate-x-1/2"
                  aria-hidden="true"
                  style={{
                    background:
                      "linear-gradient(to bottom, var(--brand-cyan), color-mix(in oklab, var(--brand-cyan) 40%, transparent), #a78bfa)",
                  }}
                />

                {roadmap.map((m, i) => (
                  <RoadmapItem key={m.year} milestone={m} index={i} />
                ))}
              </div>
            </div>
          </section>

          {/* Milestone markers */}
          <section id="milestones" className="py-12 scroll-mt-[calc(var(--header-h,64px)+16px)]">
            <MotionDiv
              initial={prefersReduced ? false : { opacity: 0 }}
              whileInView={prefersReduced ? {} : { opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto px-4"
            >
              <CardSurface className="mb-8 h-2 overflow-hidden">
                <div
                  className="absolute inset-0 opacity-30"
                  style={{ background: "linear-gradient(90deg, var(--brand-cyan), #a78bfa, #14b8a6)" }}
                />
                {[0, 20, 40, 60, 80, 100].map((pos) => (
                  <div
                    key={pos}
                    className="absolute top-1/2 w-4 h-4 rounded-full -translate-x-1/2 -translate-y-1/2 shadow"
                    style={{
                      left: `${pos}%`,
                      background: "var(--brand-cyan)",
                      boxShadow: "0 4px 14px rgba(34,211,238,.45)",
                    }}
                    aria-hidden="true"
                  />
                ))}
              </CardSurface>

              <div className="flex justify-between px-2 sm:px-4">
                {["2025", "2027", "2030", "2035", "2040", "2045+"].map((year, idx) => (
                  <MotionDiv
                    key={year}
                    initial={prefersReduced ? false : { opacity: 0, y: 20 }}
                    whileInView={prefersReduced ? {} : { opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.05, duration: 0.4 }}
                    className="text-center"
                  >
                    <div className="font-bold text-sm sm:text-base" style={{ color: "var(--brand-cyan)" }}>
                      {year}
                    </div>
                    <div className="text-[10px] sm:text-xs" style={{ color: "color-mix(in oklab, var(--color-text) 60%, transparent)" }}>
                      Milestone
                    </div>
                  </MotionDiv>
                ))}
              </div>
            </MotionDiv>
          </section>

          {/* CTA panels */}
          <section id="cta-panels" className="grid md:grid-cols-2 gap-8 mb-24 scroll-mt-[calc(var(--header-h,64px)+16px)] px-4 sm:px-0">
            <MotionDiv
              initial={prefersReduced ? false : { opacity: 0, y: 20 }}
              whileInView={prefersReduced ? {} : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <CardSurface className="h-full p-6 sm:p-8">
                <div className="flex items-center mb-4">
                  <FaHandshake className="text-2xl mr-3" style={{ color: "var(--brand-cyan)" }} aria-hidden="true" />
                  <h3 className="text-[clamp(1.25rem,3.5vw,1.75rem)] font-bold brand-gradient" style={{ WebkitTextFillColor: "transparent" }}>
                    Join Our Journey
                  </h3>
                </div>
                <p style={{ color: "color-mix(in oklab, var(--color-text) 82%, transparent)" }} className="mb-6">
                  Whether you're a researcher, builder, or visionary — SynexiAI welcomes collaborators who believe in building systems that matter.
                </p>
                <Link to="/contact" className="btn-primary inline-flex items-center px-6 py-3 rounded-lg font-semibold focus:outline-none focus-visible:ring-2">
                  <span>Connect With Us</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </CardSurface>
            </MotionDiv>

            <MotionDiv
              initial={prefersReduced ? false : { opacity: 0, y: 20 }}
              whileInView={prefersReduced ? {} : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.6 }}
            >
              <CardSurface className="h-full p-6 sm:p-8">
                <div className="flex items-center mb-4">
                  <FaChartLine className="text-2xl mr-3" style={{ color: "#14b8a6" }} aria-hidden="true" />
                  <h3 className="text-[clamp(1.25rem,3.5vw,1.75rem)] font-bold" style={{ color: "color-mix(in oklab, var(--brand-cyan) 70%, #14b8a6)" }}>
                    Investor Materials
                  </h3>
                </div>
                <p style={{ color: "color-mix(in oklab, var(--color-text) 82%, transparent)" }} className="mb-6">
                  Access our detailed investor deck with financial projections, technology deep dives, and partnership opportunities.
                </p>
                <a
                  href="/assets/SynexiAI-Investor-Deck.pdf"
                  download
                  className="inline-flex items-center px-6 py-3 rounded-lg font-semibold focus:outline-none focus-visible:ring-2"
                  style={{
                    backgroundImage: "linear-gradient(to right, #14b8a6, #0ea5e9)",
                    color: "#fff",
                    border: "1px solid color-mix(in oklab, #14b8a6 45%, transparent)",
                    boxShadow: "0 10px 26px rgba(20,184,166,.18)",
                  }}
                >
                  <FaDownload className="mr-2" aria-hidden="true" />
                  <span>Download Investor Deck</span>
                </a>
              </CardSurface>
            </MotionDiv>
          </section>
        </Container>
      </ErrorBoundary>
    </>
  );
}
