import React from "react";
import Layout from "../components/Layout";
import HeroBanner from "../components/HeroBanner";
import { Typewriter } from "react-simple-typewriter";

export default function HomePage() {
  return (
    <Layout>
      <HeroBanner />
      <div className="w-full max-w-7xl mx-auto px-6 py-20 text-white">
        {/* Hero Section */}
        <section className="mb-24 text-center" data-aos="fade-up">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-cyan-400 mb-6 leading-tight">
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

          <p className="text-lg md:text-xl text-gray-300 leading-8 max-w-3xl mx-auto">
            SynexiAI is the next-generation innovation hub where Artificial Intelligence,
            futuristic IT, and bold ideas come together to build a better digital future.
            From visionary projects to mission-driven development, we are building from <strong>zero to forever</strong>.
          </p>

          <a
            href="/about"
            className="inline-block mt-8 px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-lg shadow-lg transition-all duration-300 hover:scale-105 animate-pulse"
          >
            Learn More →
          </a>
        </section>

        {/* What We're Building Section */}
        <section data-aos="fade-up" data-aos-delay="100" className="text-center">
          <h2 className="text-3xl font-semibold text-cyan-400 mb-6">
            ✨ What We’re Building
          </h2>
          <ul className="list-disc text-left text-lg leading-8 max-w-3xl mx-auto pl-6 text-gray-200">
            <li>⚙️ Modular React + Vite Website Architecture</li>
            <li>📂 AI-Powered Dashboards & Microservices</li>
            <li>🌐 Real-Time Notification & Integration Layers</li>
            <li>📈 Data-Driven Applications & Cloud Deployments</li>
            <li>🧠 The Digital Brain of SynexiAI's Innovation Journey</li>
          </ul>
        </section>
      </div>
    </Layout>
  );
}
