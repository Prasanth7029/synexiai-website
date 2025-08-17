import React, { useEffect, lazy, Suspense, useMemo } from "react";
import { Link } from "react-router-dom";
import FeatureCard from "../components/FeatureCard";
import { motion } from "framer-motion";
import {
  FaReact,
  FaServer,
  FaBell,
  FaChartLine,
  FaBrain,
} from "react-icons/fa";
import HeroBanner from "../components/HeroBanner";
import BuildWithSynexiAI from "../components/sections/BuildWithSynexiAI.jsx";
import { projects as portfolio } from "../content/projects.js";


const MotionDiv     = motion.div;
const MotionSection = motion.section;
const MotionP       = motion.p;
const MotionH2      = motion.h2;
const MotionH3      = motion.h3;

// Lazy heavy sections for faster TTI in prod
const SocialProofSection = lazy(
  () => import("../components/social/SocialProofSection.jsx"),
);
const ProjectsSection = lazy(
  () => import("../components/projects/ProjectsSection.jsx"),
);
const AIPipeline = lazy(() => import("../components/visuals/AIPipeline.jsx"));
const MetricCard = lazy(() => import("../components/visuals/MetricCard.jsx"));

// Content
import {
  partnerOrgs,
  testimonials,
  milestones,
} from "../content/socialProof.js";


// Persona-aware content
import { usePersona } from "../context/PersonaContext.jsx";
import { personaCopy } from "../content/personaCopy.js";
import usePersonaDetector from "../hooks/usePersonaDetector.js";


// Small skeletons for lazy sections
function SectionSkeleton({ className = "" }) {
  return (
    <div
      className={`w-full h-40 rounded-xl border border-white/10 bg-white/5 animate-pulse ${className}`}
    />
  );
}

const features = [
  {
    icon: <FaReact className="text-4xl text-cyan-400" />,
    title: "Modular Architecture",
    description:
      "Solutions born from the fusion of AI, cloud systems, and renewable intelligence",
    delay: 0.1,
  },
  {
    icon: <FaServer className="text-4xl text-cyan-400" />,
    title: "AI Microservices",
    description: "Scalable AI-powered dashboards and microservice ecosystems",
    delay: 0.2,
  },
  {
    icon: <FaBell className="text-4xl text-cyan-400" />,
    title: "Real-Time Systems",
    description: "Notification layers and seamless third-party integrations",
    delay: 0.3,
  },
  {
    icon: <FaChartLine className="text-4xl text-cyan-400" />,
    title: "Data Applications",
    description:
      "Cloud-native, data-driven applications with actionable insights",
    delay: 0.4,
  },
  {
    icon: <FaBrain className="text-4xl text-cyan-400" />,
    title: "Innovation Engine",
    description: "The digital core of SynexiAI's future technologies",
    delay: 0.5,
  },
];

export default function HomePage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Persona-aware copy
  usePersonaDetector();
  const { persona } = usePersona();
  const p = personaCopy[persona] || personaCopy.general;

  // Honor reduced motion (framer defaults still fine on desktop)
  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

  const featureItems = useMemo(() => features, []);

  return (
    <>
      {/* Keep hero clean */}
      <HeroBanner title={p.heroTitle} subtitle={p.heroSubtitle} />

      <BuildWithSynexiAI />

      {/* Everything below gets its own stacking context so it never hides under the hero */}
      <div className="relative z-20 w-full max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-20 text-gray-900 dark:text-gray-100">
        {/* Persona intro row */}
        <section
          className="mb-12 scroll-mt-[calc(var(--header-h)+16px)]"
          id="intro"
        >
          {/* Pipeline + metric cards (lazy) */}
          <div className="mb-20 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 min-w-0">
              <Suspense fallback={<SectionSkeleton className="h-64" />}>
                <AIPipeline />
              </Suspense>
            </div>
            <div className="lg:col-span-1 min-w-0">
              <Suspense fallback={<SectionSkeleton className="h-64" />}>
                <MetricCard />
              </Suspense>
            </div>
          </div>
        </section>

        {/* Social Proof Section (lazy) */}
        <section id="proof" className="scroll-mt-[calc(var(--header-h)+16px)]">
          <Suspense fallback={<SectionSkeleton className="h-48" />}>
            <SocialProofSection
              logos={partnerOrgs}
              stats={milestones}
              quotes={testimonials}
            />
          </Suspense>
        </section>

        {/* Projects Section (lazy) */}
        <section
          id="portfolio"
          className="scroll-mt-[calc(var(--header-h)+16px)]"
        >
          <Suspense fallback={<SectionSkeleton className="h-56" />}>
            <ProjectsSection
              items={portfolio}
              title="Featured portfolio"
              preview
              limit={6}
            />
          </Suspense>
        </section>

        {/* Tri-Force */}
        <section
          id="tri-force"
          aria-labelledby="tri-force-title"
          className="mb-24 scroll-mt-[calc(var(--header-h)+16px)]"
        >
          <MotionDiv
            initial={prefersReduced ? false : { opacity: 0, y: 20 }}
            whileInView={prefersReduced ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, amount: 0.2 }}
            className="text-center max-w-5xl mx-auto"
          >
            <h2
              id="tri-force-title"
              className="text-2xl sm:text-3xl md:text-5xl font-bold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-green-400"
            >
              The SynexiAI Tri-Force
            </h2>
            <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-10">
              Everything we build stems from these 3 power pillars
            </p>

            {/* Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 items-stretch [grid-auto-rows:1fr]">
              <div className="min-w-0 h-full">
                <FeatureCard
                  icon={<FaBrain className="text-4xl text-cyan-400" />}
                  title="AI Innovation"
                  description="Next-gen ML, LLMs, and predictive systems"
                  delay={0.1}
                  className="h-full bg-white/5 border border-white/10 backdrop-blur-sm"
                />
              </div>
              <div className="min-w-0 h-full">
                <FeatureCard
                  icon={<FaServer className="text-4xl text-cyan-400" />}
                  title="Cloud & Databases"
                  description="Self-healing, scalable, hybrid cloud"
                  delay={0.2}
                  className="h-full bg-white/5 border border-white/10 backdrop-blur-sm"
                />
              </div>
              <div className="min-w-0 h-full">
                <FeatureCard
                  icon={<FaChartLine className="text-4xl text-green-400" />}
                  title="Renewable Tech"
                  description="Energy-aware AI & green data infrastructure"
                  delay={0.3}
                  className="h-full bg-white/5 border border-white/10 backdrop-blur-sm"
                />
              </div>
            </div>
          </MotionDiv>
        </section>

        {/* Extended Features */}
        <section
          id="what-powers-synexiai"
          aria-labelledby="powers-title"
          className="mb-24 scroll-mt-[calc(var(--header-h)+16px)]"
        >
          <MotionDiv
            initial={prefersReduced ? false : { opacity: 0, y: 20 }}
            whileInView={prefersReduced ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16"
          >
            <h2
              id="powers-title"
              className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500"
            >
              What Powers SynexiAI
            </h2>
            <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
              Solutions born from the fusion of AI, cloud systems, and renewable
              intelligence
            </p>
          </MotionDiv>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 items-stretch [grid-auto-rows:1fr]">
            {featureItems.map((feature, index) => (
              <div className="min-w-0 h-full" key={`${feature.title}-${index}`}>
                <FeatureCard
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  delay={feature.delay}
                  className="h-full bg-white/5 border border-white/10 backdrop-blur-sm"
                />
              </div>
            ))}
          </div>
        </section>

        {/* Mission Statement */}
        <section
          id="mission"
          aria-labelledby="mission-title"
          className="px-4 sm:px-8 py-12 sm:py-16 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md shadow-xl shadow-cyan-500/10 mb-24 scroll-mt-[calc(var(--header-h)+16px)]"
        >
          <MotionDiv
            initial={prefersReduced ? false : { opacity: 0, y: 20 }}
            whileInView={prefersReduced ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, amount: 0.2 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h3
              id="mission-title"
              className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-8"
            >
              {'"'}From <span className="text-cyan-500">Zero to Forever</span> —
              Building Systems That Last{'"'}
            </h3>
            <p className="text-xl text-gray-800 dark:text-gray-300 leading-relaxed">
              Our philosophy centers on creating technology that evolves with
              time, solving tomorrow{"'"}s problems with today{"'"}s innovation.
              We architect systems that grow more valuable with each iteration.
            </p>
          </MotionDiv>
        </section>

        {/* Final CTA */}
        <section
          id="cta"
          aria-labelledby="cta-title"
          className="text-center scroll-mt-[calc(var(--header-h)+16px)]"
        >
          <MotionDiv
            initial={prefersReduced ? false : { opacity: 0 }}
            whileInView={prefersReduced ? {} : { opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true, amount: 0.2 }}
          >
            <h3
              id="cta-title"
              className="text-3xl md:text-4xl font-bold text-cyan-400 mb-8"
            >
              Ready to Build the Future With Us?
            </h3>
            <p className="text-xl text-gray-700 dark:text-gray-300 mb-10 max-w-2xl mx-auto">
              Whether you{"'"}re looking to collaborate, invest, or join our
              team, we{"'"}re excited to connect.
            </p>

            <MotionDiv
              whileHover={{ scale: prefersReduced ? 1 : 1.05 }}
              whileTap={{ scale: prefersReduced ? 1 : 0.95 }}
              className="inline-block"
            >
              <Link
                to="/contact"
                className="inline-block px-6 sm:px-10 py-3 sm:py-5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl text-xl font-semibold shadow-lg shadow-cyan-500/30 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
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
