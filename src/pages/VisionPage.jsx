import React from "react";
import Container from "../components/Container";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import ErrorBoundary from "../components/ErrorBoundary";
import { FaDownload, FaHandshake, FaRocket, FaChartLine } from "react-icons/fa";

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
    color: "bg-cyan-500"
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
    color: "bg-teal-500"
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
    color: "bg-purple-500"
  },
];

const statusIcons = {
  completed: "✅",
  "in-progress": "🔄",
  planned: "📅"
};

const statusColors = {
  completed: "text-green-400",
  "in-progress": "text-yellow-400",
  planned: "text-gray-400"
};

export default function VisionPage() {
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
        <Container animate className="text-white relative overflow-hidden">
          {/* Background elements */}
          <div className="absolute inset-0 overflow-hidden -z-10">
            <div className="absolute top-0 left-1/4 w-[300px] h-[300px] bg-cyan-500/10 rounded-full blur-[100px] animate-float-slow" />
            <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-teal-500/10 rounded-full blur-[120px] animate-float-medium" />
          </div>

          {/* Hero section */}
          <section className="relative z-10 text-center py-16 md:py-24">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl mx-auto"
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                <span className="bg-gradient-to-r from-cyan-400 to-teal-500 bg-clip-text text-transparent">
                  SynexiAI Vision
                </span>
                <span className="text-cyan-400 ml-3">🌌</span>
              </h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed"
              >
                Our strategic roadmap to revolutionize artificial intelligence and build sustainable, human-centric systems
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <Link
                  to="/contact"
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-cyan-500 to-teal-500 text-black font-semibold rounded-xl hover:shadow-lg hover:shadow-cyan-500/30 transition-all duration-300 group"
                >
                  <span>Join Our Mission</span>
                  <FaRocket className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </motion.div>
          </section>

          {/* Roadmap section */}
          <section className="relative z-10 py-12">
            <div className="max-w-6xl mx-auto">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                className="text-3xl md:text-4xl font-bold text-center mb-16 text-cyan-400"
              >
                Strategic Roadmap
              </motion.h2>

              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-8 md:left-1/2 top-0 h-full w-1 bg-gradient-to-b from-cyan-500 to-purple-500 -translate-x-1/2" />

                {roadmap.map((milestone, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className={`relative mb-16 ${index % 2 === 0 ? "md:pr-[50%] md:pl-8" : "md:pl-[50%] md:pr-8"}`}
                  >
                    {/* Timeline dot */}
                    <div className={`absolute top-1 left-8 md:left-1/2 w-6 h-6 ${milestone.color} rounded-full shadow-lg -translate-x-1/2 flex items-center justify-center text-white`}>
                      {milestone.icon}
                    </div>

                    <motion.div
                      whileHover={{ y: -5 }}
                      className={`bg-gradient-to-br from-gray-900/80 to-gray-800/80 p-8 rounded-2xl shadow-xl border border-gray-700/50 backdrop-blur-sm ${index % 2 === 0 ? "md:mr-8" : "md:ml-8"}`}
                    >
                      <div className="flex items-center mb-6">
                        <h3 className="text-2xl font-bold text-cyan-300">{milestone.year}</h3>
                      </div>
                      <ul className="space-y-4">
                        {milestone.goals.map((goal, idx) => (
                          <motion.li
                            key={idx}
                            initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: idx * 0.05 }}
                            className={`flex items-start ${statusColors[goal.status]}`}
                          >
                            <span className="mr-3 mt-1">{statusIcons[goal.status]}</span>
                            <span>{goal.text}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Milestone markers */}
          <section className="py-12">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto"
            >
              <div className="relative h-2 bg-gray-700 rounded-full overflow-hidden mb-8">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-teal-500 opacity-30" />
                {[0, 20, 40, 60, 80, 100].map((pos, idx) => (
                  <div
                    key={idx}
                    className="absolute top-1/2 w-4 h-4 bg-cyan-400 rounded-full -translate-x-1/2 -translate-y-1/2"
                    style={{ left: `${pos}%` }}
                  />
                ))}
              </div>
              <div className="flex justify-between px-4">
                {["2025", "2027", "2030", "2035", "2040", "2045+"].map((year, idx) => (
                  <motion.div
                    key={year}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.05, duration: 0.4 }}
                    className="text-center"
                  >
                    <div className="text-cyan-400 font-bold">{year}</div>
                    <div className="text-xs text-gray-400 mt-1">Milestone</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </section>

          {/* CTA sections */}
          <section className="grid md:grid-cols-2 gap-8 mb-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 p-8 rounded-2xl border border-cyan-400/20 backdrop-blur-sm"
            >
              <div className="flex items-center mb-4">
                <FaHandshake className="text-cyan-400 text-2xl mr-3" />
                <h3 className="text-2xl font-bold text-cyan-300">Join Our Journey</h3>
              </div>
              <p className="text-gray-300 mb-6">
                Whether you're a researcher, builder, or visionary — SynexiAI welcomes collaborators who believe in building systems that matter.
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-lg transition-all duration-300 group"
              >
                <span>Connect With Us</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 p-8 rounded-2xl border border-teal-400/20 backdrop-blur-sm"
            >
              <div className="flex items-center mb-4">
                <FaChartLine className="text-teal-400 text-2xl mr-3" />
                <h3 className="text-2xl font-bold text-teal-300">Investor Materials</h3>
              </div>
              <p className="text-gray-300 mb-6">
                Access our detailed investor deck with financial projections, technology deep dives, and partnership opportunities.
              </p>
              <a
                href="/assets/SynexiAI-Investor-Deck.pdf"
                download
                className="inline-flex items-center px-6 py-3 bg-teal-600 hover:bg-teal-500 text-white font-semibold rounded-lg transition-all duration-300 group"
              >
                <FaDownload className="mr-2" />
                <span>Download Investor Deck</span>
              </a>
            </motion.div>
          </section>
        </Container>
      </ErrorBoundary>
    </>
  );
}