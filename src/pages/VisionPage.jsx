import React from "react";

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
    <main
      style={{
        padding: "3rem 1.5rem",
        color: "#ffffff",
        backgroundColor: "#0a0a0a",
        minHeight: "100vh",
        maxWidth: "1000px",
        margin: "0 auto",
      }}
    >
      <h1
        style={{ fontSize: "2.5rem", marginBottom: "1rem", color: "#00f7ff" }}
        data-aos="fade-up"
      >
        🌠 Vision & Future Goals
      </h1>
      <p
        style={{
          fontSize: "1.2rem",
          color: "#ccc",
          marginBottom: "3rem",
        }}
        data-aos="fade-up"
        data-aos-delay="100"
      >
        Our 5, 10, and 20-year roadmap to revolutionize technology, cities, and the human-AI experience.
      </p>

      {roadmap.map((milestone, index) => (
        <section
          key={index}
          style={{
            marginBottom: "3rem",
            padding: "2rem",
            background: "#1a1a1a",
            borderRadius: "1rem",
            boxShadow: "0 0 20px #00f7ff22",
          }}
          data-aos="fade-up"
          data-aos-delay={150 * (index + 1)}
        >
          <h2
            style={{
              fontSize: "1.5rem",
              color: "#00f7ff",
              marginBottom: "1rem",
            }}
          >
            📅 {milestone.year}
          </h2>
          <ul style={{ paddingLeft: "1.5rem", fontSize: "1.05rem", lineHeight: "1.9" }}>
            {milestone.goals.map((goal, idx) => (
              <li key={idx}>{goal}</li>
            ))}
          </ul>
        </section>
      ))}
    </main>
  );
}
