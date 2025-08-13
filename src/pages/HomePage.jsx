import React, { useEffect } from "react";
import HeroBanner from "../components/HeroBanner";
import FeatureCard from "../components/FeatureCard";
import { FaReact, FaServer, FaBell, FaChartLine, FaBrain } from "react-icons/fa";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { partnerOrgs, testimonials, milestones } from "../content/socialProof.js";
import SocialProofSection from "../components/social/SocialProofSection.jsx";
import { projects } from "../content/projects.js";
import ProjectsSection from "../components/projects/ProjectsSection.jsx";



// ✅ NEW: persona-aware content
import { usePersona } from "../context/PersonaContext.jsx";
import { personaCopy } from "../content/personaCopy.js";
import usePersonaDetector from "../hooks/usePersonaDetector.js";
// (Optional) If you want a visible toggle on the page:
import PersonaSwitch from "../components/PersonaSwitch.jsx";
import GlobeSection from "../components/visuals/GlobeSection.jsx";
import AIPipeline from "../components/visuals/AIPipeline.jsx";
import MetricCard from "../components/visuals/MetricCard.jsx";


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
    description: "Cloud-native, data-driven applications with actionable insights",
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
  useEffect(() => { window.scrollTo(0, 0); }, []);

  // ✅ Persona-aware copy
  usePersonaDetector(); // enables click-based hints anywhere using data-persona="..."
  const { persona } = usePersona();
  const p = personaCopy[persona] || personaCopy.general;

  return (
    <>
      {/* Keep HeroBanner clean—let the global background from index.css show */}
      <HeroBanner
        // ✅ Light persona-aware text handoff to HeroBanner (optional, if HeroBanner uses props)
        title={p.heroTitle}
        subtitle={p.heroSubtitle}
        // You can also ignore the above props if HeroBanner is standalone
      />

      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-20 text-gray-900 dark:text-gray-100">
        {/* Persona intro row */}
        <section className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row md:items-end md:justify-between gap-4"
          >
            <div>
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
                {p.heroTitle}
              </h1>
              <p className="mt-3 text-lg sm:text-xl opacity-90">{p.heroSubtitle}</p>
            </div>

            {/* If you want a visible persona switcher on the page, uncomment: */}
             <PersonaSwitch />
          </motion.div>

          {/* Quick persona‑specific CTAs */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            {p.ctas?.map((cta) => (
              <Link
                key={cta.label}
                to={cta.to}
                className="relative group inline-flex items-center rounded-full border border-[var(--border-color)] px-5 py-2 text-sm backdrop-blur-sm hover:shadow-lg transition"
                data-persona={persona} // reinforces current persona on click
              >
                <span className="relative z-10">{cta.label}</span>
                <span
                  className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition"
                  style={{ background: "var(--border-glow)" }}
                />
              </Link>
            ))}
          </div>
          {/* ---- NEW: Interactive Visuals ---- */}
            <GlobeSection size="sm" align="right" />

            <div className="mb-20 grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <AIPipeline />
              </div>
              <div className="lg:col-span-1">
                <MetricCard />
              </div>
            </div>
        </section>

        {/* Social Proof Section */}
        <SocialProofSection logos={partnerOrgs} stats={milestones} quotes={testimonials} />

        {/* Projects Section */}
        <ProjectsSection items={projects} title="Featured Projects" preview limit={6} />



        {/* Features Section */}
        <section id="tri-force" aria-labelledby="tri-force-title" className="mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
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

            {/* Glass panel wrapper for cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              <FeatureCard
                icon={<FaBrain className="text-4xl text-cyan-400" />}
                title="AI Innovation"
                description="Next-gen ML, LLMs, and predictive systems"
                delay={0.1}
                className="bg-white/5 border border-white/10 backdrop-blur-sm"
              />
              <FeatureCard
                icon={<FaServer className="text-4xl text-cyan-400" />}
                title="Cloud & Databases"
                description="Self-healing, scalable, hybrid cloud"
                delay={0.2}
                className="bg-white/5 border border-white/10 backdrop-blur-sm"
              />
              <FeatureCard
                icon={<FaChartLine className="text-4xl text-green-400" />}
                title="Renewable Tech"
                description="Energy-aware AI & green data infrastructure"
                delay={0.3}
                className="bg-white/5 border border-white/10 backdrop-blur-sm"
              />
            </div>
          </motion.div>
        </section>

        {/* Extended Features */}
        <section id="what-powers-synexiai" aria-labelledby="powers-title" className="mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
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
              Solutions born from the fusion of AI, cloud systems, and renewable intelligence
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
            {features.map((feature, index) => (
              <FeatureCard
                key={`${feature.title}-${index}`}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                delay={feature.delay}
                className="bg-white/5 border border-white/10 backdrop-blur-sm"
              />
            ))}
          </div>
        </section>

        {/* Mission Statement */}
        <section
          id="mission"
          aria-labelledby="mission-title"
          className="px-4 sm:px-8 py-12 sm:py-16 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md shadow-xl shadow-cyan-500/10 mb-24"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, amount: 0.2 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h3 id="mission-title" className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-8">
              "From <span className="text-cyan-500">Zero to Forever</span> — Building Systems That Last"
            </h3>
            <p className="text-xl text-gray-800 dark:text-gray-300 leading-relaxed">
              Our philosophy centers on creating technology that evolves with time,
              solving tomorrow's problems with today's innovation. We architect systems
              that grow more valuable with each iteration.
            </p>
          </motion.div>
        </section>

        {/* Final CTA */}
        <section id="cta" aria-labelledby="cta-title" className="text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true, amount: 0.2 }}
          >
            <h3 id="cta-title" className="text-3xl md:text-4xl font-bold text-cyan-400 mb-8">
              Ready to Build the Future With Us?
            </h3>
            <p className="text-xl text-gray-700 dark:text-gray-300 mb-10 max-w-2xl mx-auto">
              Whether you're looking to collaborate, invest, or join our team, we're excited to connect.
            </p>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-block">
              <Link
                to="/contact"
                className="inline-block px-6 sm:px-10 py-3 sm:py-5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl text-xl font-semibold shadow-lg shadow-cyan-500/30 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                aria-label="Go to contact page to get started"
                data-persona={persona}
              >
                Get Started Today
              </Link>
            </motion.div>
          </motion.div>
        </section>
      </div>
    </>
  );
}
