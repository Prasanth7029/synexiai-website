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

        {/* Vertical Timeline Container */}
        <div className="relative border-l-4 border-cyan-500 pl-8">
          {roadmap.map((milestone, index) => (
            <div
              key={index}
              className="mb-16 relative"
              data-aos="fade-up"
              data-aos-delay={150 * (index + 1)}
            >
              {/* Dot */}
              <div className="absolute -left-5 top-1 w-4 h-4 bg-cyan-500 rounded-full shadow-lg"></div>

              {/* Card */}
              <div className="bg-[#1a1a1a] dark:bg-[#111] p-6 rounded-xl shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/30 transition duration-300">
                <h2 className="text-2xl font-semibold text-cyan-300 mb-4">
                  📅 {milestone.year}
                </h2>
                <ul className="list-disc pl-6 text-gray-300 space-y-2 text-base leading-7">
                  {milestone.goals.map((goal, idx) => (
                    <li key={`${milestone.year}-${idx}`} data-aos="fade-right" data-aos-delay={100 * idx}>
                      {goal}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-20 text-center" data-aos="fade-up" data-aos-delay="100">
          <h3 className="text-2xl text-cyan-400 font-semibold mb-4">🚀 Join the Future</h3>
          <p className="text-gray-300 text-lg mb-6">
            Ready to be part of SynexiAI’s journey? Let’s build the future — together.
          </p>
          <a
            href="/contact"
            className="inline-block px-6 py-3 bg-cyan-500 text-black font-semibold rounded-lg hover:bg-cyan-400 transition"
          >
            💬 Contact Us
          </a>
        </div>
      </div>
    </Layout>
  );
}
