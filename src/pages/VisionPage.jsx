import React from "react";
import Layout from "../components/Layout";

const roadmap = [
  {
    year: "2025 – 2030 (5-Year Vision)",
    goals: [
      "✅ Launch SynexiAI's official platform and dashboard ecosystem",
      "🧠 Build scalable AI-powered microservices (search, alerting, NLP)",
      "🛠️ Deploy real-time systems for healthcare, energy, and education",
      "🌐 Create AI-driven solutions for government & social impact",
    ],
  },
  {
    year: "2030 – 2040 (10-Year Expansion)",
    goals: [
      "🏙️ Design & develop the SynexiAI Renewable Tech Smart City",
      "⚙️ Run high-performance AI data centers for public infrastructure",
      "📡 Launch decentralized systems & citizen AI assistants",
      "🚀 Partner with institutions to drive global research impact",
    ],
  },
  {
    year: "2040 – 2045+ (20-Year Dream)",
    goals: [
      "🌌 Become a global innovation powerhouse in AI + infrastructure",
      "🏛️ Power smart governance, sustainable cities, and open technology",
      "🔗 Connect humanity through intelligent systems and knowledge engines",
      "♾️ Make SynexiAI the heartbeat of the future digital civilization",
    ],
  },
];

export default function VisionPage() {
  return (
    <Layout>
      <div className="w-full max-w-5xl mx-auto px-6 py-20 text-white">
        {/* Title */}
        <h1
          className="text-4xl md:text-5xl font-bold text-cyan-400 mb-6 text-center"
          data-aos="fade-up"
        >
          🌠 Vision & Future Goals
        </h1>

        {/* Subtitle */}
        <p
          className="text-lg md:text-xl text-gray-300 text-center mb-16 max-w-3xl mx-auto"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          Our 5, 10, and 20-year roadmap to revolutionize technology, cities, and the human-AI experience.
        </p>

        {/* Milestones */}
        {roadmap.map((milestone, index) => (
          <section
            key={index}
            className="mb-10 p-6 bg-[#1a1a1a] rounded-xl shadow-lg shadow-cyan-500/10"
            data-aos="fade-up"
            data-aos-delay={150 * (index + 1)}
          >
            <h2 className="text-2xl font-semibold text-cyan-400 mb-4">
              📅 {milestone.year}
            </h2>
            <ul className="list-disc pl-6 text-gray-200 space-y-2 text-base leading-7">
              {milestone.goals.map((goal, idx) => (
                <li key={idx}>{goal}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </Layout>
  );
}
