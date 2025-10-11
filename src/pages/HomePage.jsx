// src/pages/HomePage.jsx
import React, { useEffect, lazy, Suspense, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaReact, FaServer, FaBell, FaChartLine, FaBrain, FaGamepad } from "react-icons/fa";

import HeroBanner from "../components/HeroBanner";
import FeatureCard from "../components/FeatureCard";
import BuildWithSynexiAI from "../components/sections/BuildWithSynexiAI.jsx";
import AIFactRotator from "../components/AIFactRotator.jsx";

// Content
import { projects as portfolio } from "../content/projects.js";
import { partnerOrgs, testimonials, milestones } from "../content/socialProof.js";

// Persona-aware content
import { usePersona } from "../context/PersonaContext.jsx";
import { personaCopy } from "../content/personaCopy.js";
import usePersonaDetector from "../hooks/usePersonaDetector.js";

const MotionDiv = motion.div;

/* Lazy heavy sections for faster TTI */
const SocialProofSection = lazy(() => import("../components/social/SocialProofSection.jsx"));
const ProjectsSection = lazy(() => import("../components/projects/ProjectsSection.jsx"));
const AIPipeline = lazy(() => import("../components/visuals/AIPipeline.jsx"));
const MetricCard = lazy(() => import("../components/visuals/MetricCard.jsx"));

/* Skeleton for lazy sections — themed surface */
function SectionSkeleton({ className = "" }) {
  return (
    <div
      className={`w-full h-40 rounded-xl border animate-pulse ${className}`}
      aria-hidden="true"
      style={{
        background: "color-mix(in oklab, var(--card-bg) 86%, transparent)",
        borderColor: "var(--border-color)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
      }}
    />
  );
}

/* Feature list (icons recolored via tokens) */
const features = [
  {
    icon: <FaReact className="text-4xl" style={{ color: "var(--brand-cyan)" }} />,
    title: "Modular Architecture",
    description: "Solutions born from the fusion of AI, cloud systems, and renewable intelligence",
    delay: 0.1,
  },
  {
    icon: <FaServer className="text-4xl" style={{ color: "var(--brand-cyan)" }} />,
    title: "AI Microservices",
    description: "Scalable AI-powered dashboards and microservice ecosystems",
    delay: 0.2,
  },
  {
    icon: <FaBell className="text-4xl" style={{ color: "var(--brand-cyan)" }} />,
    title: "Real-Time Systems",
    description: "Notification layers and seamless third-party integrations",
    delay: 0.3,
  },
  {
    icon: (
      <FaChartLine
        className="text-4xl"
        style={{ color: "color-mix(in oklab, var(--brand-cyan) 30%, #22c55e)" }}
      />
    ),
    title: "Data Applications",
    description: "Cloud-native, data-driven applications with actionable insights",
    delay: 0.4,
  },
  {
    icon: <FaBrain className="text-4xl" style={{ color: "var(--brand-cyan)" }} />,
    title: "Innovation Engine",
    description: "The digital core of SynexiAI's future technologies",
    delay: 0.5,
  },
];

export default function HomePage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  usePersonaDetector();
  const { persona } = usePersona();
  const p = personaCopy[persona] || personaCopy.general;

  // Honor reduced motion
  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

  const featureItems = useMemo(() => features, []);

  return (
    <>
      {/* Hero */}
      <HeroBanner className="hero-no-grid hero-veil" title={p.heroTitle} subtitle={p.heroSubtitle} />

      {/* Main content container */}
      <div
        className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-20"
        style={{ color: "var(--color-text)" }}
      >
        {/* Tri-Force */}
        <section id="tri-force" aria-labelledby="tri-force-title" className="mb-24 scroll-mt-[calc(var(--header-h,64px)+16px)]">
          <MotionDiv
            initial={prefersReduced ? false : { opacity: 0, y: 20 }}
            whileInView={prefersReduced ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, amount: 0.2 }}
            className="text-center max-w-5xl mx-auto"
          >
            <h2
              id="tri-force-title"
              className="text-[clamp(1.65rem,3.8vw,2.75rem)] font-bold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-green-400"
            >
              The SynexiAI Tri-Force
            </h2>
            <p className="text-base sm:text-lg md:text-xl" style={{ color: "color-mix(in oklab, var(--color-text) 80%, transparent)" }}>
              Everything we build stems from these 3 power pillars
            </p>

            <div className="grid-2-3 auto-rows-fr gap-8 items-stretch [grid-auto-rows:1fr] mt-10">
              <div className="min-w-0 h-full">
                <FeatureCard
                  icon={<FaBrain className="text-4xl" style={{ color: "var(--brand-cyan)" }} />}
                  title="AI Innovation"
                  description="Next-gen ML, LLMs, and predictive systems"
                  delay={0.1}
                  className="h-full card"
                />
              </div>
              <div className="min-w-0 h-full">
                <FeatureCard
                  icon={<FaServer className="text-4xl" style={{ color: "var(--brand-cyan)" }} />}
                  title="Cloud & Databases"
                  description="Self-healing, scalable, hybrid cloud"
                  delay={0.2}
                  className="h-full card"
                />
              </div>
              <div className="min-w-0 h-full">
                <FeatureCard
                  icon={
                    <FaChartLine
                      className="text-4xl"
                      style={{ color: "color-mix(in oklab, var(--brand-cyan) 30%, #22c55e)" }}
                    />
                  }
                  title="Renewable Tech"
                  description="Energy-aware AI & green data infrastructure"
                  delay={0.3}
                  className="h-full card"
                />
              </div>
            </div>
          </MotionDiv>
        </section>

        {/* Extended Features */}
        <section id="what-powers-synexiai" aria-labelledby="powers-title" className="mb-24 scroll-mt-[calc(var(--header-h,64px)+16px)]">
          <MotionDiv
            initial={prefersReduced ? false : { opacity: 0, y: 20 }}
            whileInView={prefersReduced ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
              Why SynexiAI Exists
            </h2>
            <p className="max-w-3xl mx-auto text-lg md:text-xl leading-relaxed text-[color:var(--color-muted)]">
              Technology should not only advance our world — it should preserve it.{" "}
              <span className="text-[color:var(--brand-cyan)] font-medium">
                SynexiAI bridges Artificial Intelligence with Renewable Energy
              </span>{" "}
              to create systems that think intelligently and act sustainably.
            </p>
          </MotionDiv>

          <div className="grid-2-3 auto-rows-fr gap-4 sm:gap-6 md:gap-8 items-stretch">
            {featureItems.map((feature, idx) => (
              <div className="min-w-0 h-full" key={`${feature.title}-${idx}`}>
                <FeatureCard
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  delay={feature.delay}
                  className="h-full card"
                />
              </div>
            ))}
          </div>
        </section>

        {/* Mission */}
        <section
          id="mission"
          aria-labelledby="mission-title"
          className="px-4 sm:px-8 py-12 sm:py-16 rounded-3xl mb-24 scroll-mt-[calc(var(--header-h,64px)+16px)] section"
        >
          <MotionDiv
            initial={prefersReduced ? false : { opacity: 0, y: 20 }}
            whileInView={prefersReduced ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, amount: 0.2 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h3 id="mission-title" className="text-[clamp(1.4rem,3.2vw,2.1rem)] font-bold mb-8" style={{ color: "var(--color-text)" }}>
              “From <span style={{ color: "var(--brand-cyan)" }}>Zero to Forever</span> — Building Systems That Last”
            </h3>
            <p
              className="text-base sm:text-lg md:text-xl leading-relaxed"
              style={{ color: "color-mix(in oklab, var(--color-text) 85%, transparent)" }}
            >
              Our philosophy centers on creating technology that evolves with time, solving tomorrow’s problems with
              today’s innovation. We architect systems that grow more valuable with each iteration.
            </p>
          </MotionDiv>
        </section>
        {/* AI Fact Rotator */}
      <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 my-6">
        <AIFactRotator size="sm" className="sx-chat" />
      </div>
        {/* Social Proof */}
        <section id="proof" className="scroll-mt-[calc(var(--header-h,64px)+16px)]">
          <Suspense fallback={<SectionSkeleton className="h-48" />}>
            <SocialProofSection logos={partnerOrgs} stats={milestones} quotes={testimonials} />
          </Suspense>
        </section>

        {/* Projects */}
        <section id="portfolio" className="scroll-mt-[calc(var(--header-h,64px)+16px)]">
          <Suspense fallback={<SectionSkeleton className="h-56" />}>
            <ProjectsSection items={portfolio} title="Featured portfolio" preview limit={6} />
          </Suspense>
        </section>

          {/* Games CTA */}
          <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-12" aria-labelledby="games-cta-title">
            <div className="section p-6 sm:p-8 text-center">
              <div className="flex items-center justify-center gap-3 mb-2">
                <FaGamepad className="text-2xl" aria-hidden="true" style={{ color: "var(--brand-cyan)" }} />
                <h2 id="games-cta-title" className="text-xl sm:text-2xl font-bold">
                  Play Our Games & Puzzles
                </h2>
              </div>
              <p
                className="max-w-2xl mx-auto"
                style={{ opacity: 0.85, color: "color-mix(in oklab, var(--color-text) 85%, transparent)" }}
              >
                Try our interactive mini-games — logic, energy routing, pipeline building, and more — all curated in one
                place.
              </p>
              <div className="mt-4">
                <Link
                  to="/games"
                  className="btn-ghost inline-flex items-center gap-2 px-5 py-3 text-sm sm:text-base"
                  aria-label="Open the Games page"
                >
                  Open Games <span aria-hidden>→</span>
                </Link>
              </div>
            </div>
          </section>

        {/* Final CTA */}
        <section id="cta" aria-labelledby="cta-title" className="text-center scroll-mt-[calc(var(--header-h,64px)+16px)]">
          <MotionDiv
            initial={prefersReduced ? false : { opacity: 0 }}
            whileInView={prefersReduced ? {} : { opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true, amount: 0.2 }}
          >
            <h3 id="cta-title" className="text-[clamp(1.4rem,3.2vw,2.1rem)] font-bold mb-8" style={{ color: "var(--brand-cyan)" }}>
              Ready to Build the Future With Us?
            </h3>
            <p
              className="text-base sm:text-lg md:text-xl mb-10 max-w-2xl mx-auto"
              style={{ color: "color-mix(in oklab, var(--color-text) 80%, transparent)" }}
            >
              Whether you’re looking to collaborate, invest, or join our team, we’re excited to connect.
            </p>
            <MotionDiv whileHover={{ scale: prefersReduced ? 1 : 1.05 }} whileTap={{ scale: prefersReduced ? 1 : 0.95 }} className="inline-block">
              <Link
                to="/contact"
                className="btn-primary inline-block  text-lg md:text-xl font-semibold focus:outline-none focus-visible:ring-2"
                aria-label="Go to contact page to get started"
                data-persona={persona}
              >
                Get Started Today
              </Link>
            </MotionDiv>
          </MotionDiv>
        </section>
      </div>
    </>
  );
}
