import React from "react";
import { Typewriter } from "react-simple-typewriter";
import HeroBanner from "../components/HeroBanner";

export default function HomePage() {
  return (
    <div className="homepage relative min-h-screen flex flex-col items-center justify-center text-center px-6">
    <HeroBanner />
      <main
        style={{
          padding: "3rem 1rem",
          color: "#ffffff",
          backgroundColor: "#0a0a0a",
          minHeight: "100vh",
          width: "100%",
          maxWidth: "1200px",
        }}
        data-aos="fade-up"
      >
        {/* Hero Section */}
        <section style={{ marginBottom: "4rem" }}>
          <h1 className="text-5xl md:text-6xl font-bold text-cyan-400 mb-6">
            <Typewriter
              words={[
                "Welcome to SynexiAI",
                "We Build the Future",
                "AI • Vision • Innovation",
              ]}
              loop={0}
              cursor
              cursorStyle="|"
              typeSpeed={70}
              deleteSpeed={50}
              delaySpeed={2000}
            />
          </h1>

          <p
            style={{
              fontSize: "1.25rem",
              lineHeight: "1.8",
              maxWidth: "800px",
              margin: "0 auto 2rem",
              textAlign: "center",
            }}
          >
            SynexiAI is the next-generation innovation hub where Artificial
            Intelligence, futuristic IT, and bold ideas come together to build
            a better digital future. From visionary projects to mission-driven
            development, we are building from <strong>zero to forever</strong>.
          </p>

          <a
            href="/about"
            className="inline-block mt-6 px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-lg shadow-xl transition-all duration-300 hover:scale-105 animate-pulse"
          >
            Learn More →
          </a>
        </section>

        {/* What We're Building Section */}
        <section>
          <h2
            style={{
              color: "#00f7ff",
              fontSize: "2rem",
              marginBottom: "1.5rem",
            }}
          >
            ✨ What We’re Building
          </h2>
          <ul
            style={{
              listStyle: "disc",
              paddingLeft: "2rem",
              fontSize: "1.1rem",
              lineHeight: "2",
              textAlign: "left",
              maxWidth: "800px",
              margin: "0 auto",
            }}
          >
            <li>⚙️ Modular React + Vite Website Architecture</li>
            <li>📂 AI-Powered Dashboards & Microservices</li>
            <li>🌐 Real-Time Notification & Integration Layers</li>
            <li>📈 Data-Driven Applications & Cloud Deployments</li>
            <li>🧠 The Digital Brain of SynexiAI's Innovation Journey</li>
          </ul>
        </section>
      </main>
    </div>
  );
}
