import React from "react";
import Container from "../components/Container";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import ErrorBoundary from "../components/ErrorBoundary";

const roadmap = [
  {
    year: "2025 – 2030 (5-Year Vision)",
    goals: [
      "✅ Launch SynexiAI’s unified platform & intelligent dashboard ecosystem",
      "🧠 Build AI-powered microservices (search, NLP, alerting, analytics)",
      "🔐 Implement Zero Trust Architecture & blockchain-backed audit systems",
      "🌍 Apply AI to healthcare, education, energy & civic systems",
      "🚧 Lay groundwork for smart datacenter infrastructure (green energy powered)",
    ],
  },
  {
    year: "2030 – 2040 (10-Year Expansion)",
    goals: [
      "🏙️ Launch the SynexiAI Smart City prototype powered by AI + renewables",
      "⚙️ Operate AI-driven cloud infrastructure for public systems",
      "🧬 Expand research in self-healing systems & human-AI co-design",
      "🤖 Launch SynexiAI Assistant — the open citizen knowledge engine",
      "📡 Enable intelligent governance, decentralized civic apps",
    ],
  },
  {
    year: "2040 – 2045+ (20-Year Dream)",
    goals: [
      "♾️ Become the global tech standard in AI, cloud & sustainability",
      "🌌 Build the world’s first fully self-regulating smart-energy AI city",
      "🏛️ Shape governance through real-time citizen-AI collaboration",
      "💡 Democratize intelligence — tools that uplift every human life",
    ],
  },
];

export default function VisionPage() {
  return (
    <>
      <Helmet>
        <title>SynexiAI Vision & Future Roadmap</title>
        <meta
          name="description"
          content="Explore SynexiAI's 5, 10, and 20 year vision — transforming AI, smart cities, and civic technology."
        />
      </Helmet>

      <ErrorBoundary>
        <Container animate className="text-white">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold text-cyan-400 mb-6 text-center"
          >
            🌠 SynexiAI Vision & Future Goals
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg md:text-xl text-gray-300 text-center mb-16 max-w-3xl mx-auto"
          >
            Our 5, 10, and 20-year roadmap to revolutionize artificial intelligence, smart cities, and digital-human collaboration.
          </motion.p>

          <div className="relative border-l-4 border-cyan-500 pl-8">
            {roadmap.map((milestone, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className="mb-16 relative"
              >
                <div className="absolute -left-5 top-1 w-4 h-4 bg-cyan-500 rounded-full shadow-lg"></div>

                <div className="bg-[#1a1a1a] dark:bg-[#111] p-6 rounded-xl shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/30 transition duration-300">
                  <h2 className="text-2xl font-semibold text-cyan-300 mb-4">
                    🗕️ {milestone.year}
                  </h2>
                  <ul className="list-disc pl-6 text-gray-300 space-y-3 text-base leading-7">
                    {milestone.goals.map((goal, idx) => (
                      <motion.li
                        key={`${milestone.year}-${idx}`}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: 0.05 * idx }}
                      >
                        {goal}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="overflow-x-auto mt-10 py-6">
            <div className="flex gap-6 min-w-[700px] justify-center">
              {["2025", "2027", "2030", "2035", "2040", "2045"].map((year) => (
                <div
                  key={year}
                  className="px-4 py-2 bg-cyan-700/20 rounded-xl text-cyan-300 font-medium shadow text-center"
                  aria-label={`Milestone ${year}`}
                >
                  {year}
                </div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-24 text-center"
          >
            <h3 className="text-2xl text-cyan-400 font-semibold mb-4">
              🚀 Join Our Journey
            </h3>
            <p className="text-gray-300 text-lg mb-6 max-w-2xl mx-auto">
              Whether you're a researcher, builder, or visionary — SynexiAI welcomes collaborators who believe in building systems that matter.
            </p>
            <Link
              to="/contact"
              aria-label="Contact SynexiAI Team"
              className="inline-block px-6 py-3 bg-cyan-500 text-black font-semibold rounded-lg hover:bg-cyan-400 transition shadow-lg shadow-cyan-500/30"
            >
              💬 Let’s Connect
            </Link>
          </motion.div>

          <section className="mt-24 text-center bg-gray-900/40 rounded-2xl px-6 py-10 border border-cyan-400/20">
            <h3 className="text-2xl font-semibold text-cyan-400 mb-4">
              🎯 Investor & Partner Materials
            </h3>
            <p className="text-gray-300 mb-6 max-w-xl mx-auto">
              Interested in backing SynexiAI or forming a strategic partnership? Download our investor vision deck and roadmap.
            </p>
            <a
              href="/assets/SynexiAI-Investor-Deck.pdf"
              download
              aria-label="Download Investor Deck"
              className="inline-block px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-lg transition shadow"
            >
              📅 Download Investor Deck
            </a>
          </section>
        </Container>
      </ErrorBoundary>
    </>
  );
}
