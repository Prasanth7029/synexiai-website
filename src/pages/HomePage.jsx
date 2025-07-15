// pages/index.js
import React from "react";
import Layout from "../components/Layout";
import HeroBanner from "../components/HeroBanner";
import { FaReact, FaServer, FaBell, FaChartLine, FaBrain } from "react-icons/fa";
import FeatureCard from "../components/FeatureCard";
import { motion } from "framer-motion";

const features = [
  {
    icon: <FaReact className="text-4xl text-cyan-400" />,
    title: "Modular Architecture",
    description: "Solutions born from the fusion of AI, cloud systems, and renewable intelligence",
    delay: 0.1
  },
  {
    icon: <FaServer className="text-4xl text-cyan-400" />,
    title: "AI Microservices",
    description: "Scalable AI-powered dashboards and microservice ecosystems",
    delay: 0.2
  },
  {
    icon: <FaBell className="text-4xl text-cyan-400" />,
    title: "Real-Time Systems",
    description: "Notification layers and seamless third-party integrations",
    delay: 0.3
  },
  {
    icon: <FaChartLine className="text-4xl text-cyan-400" />,
    title: "Data Applications",
    description: "Cloud-native, data-driven applications with actionable insights",
    delay: 0.4
  },
  {
    icon: <FaBrain className="text-4xl text-cyan-400" />,
    title: "Innovation Engine",
    description: "The digital core of SynexiAI's future technologies",
    delay: 0.5
  }
];

export default function HomePage() {
  return (
    <Layout>
      <HeroBanner />
      
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-24 text-black dark:text-white">
        {/* Features Section */}
        <section className="mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-5xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-green-400">
              The SynexiAI Tri-Force
            </h2>
            <p className="text-lg md:text-xl text-gray-400 mb-10">
              Everything we build stems from these 3 power pillars
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard icon={<FaBrain className="text-4xl text-cyan-400" />} title="AI Innovation" description="Next-gen ML, LLMs, and predictive systems" delay={0.1} />
              <FeatureCard icon={<FaServer className="text-4xl text-cyan-400" />} title="Cloud & Databases" description="Self-healing, scalable, hybrid cloud" delay={0.2} />
              <FeatureCard icon={<FaChartLine className="text-4xl text-green-400" />} title="Renewable Tech" description="Energy-aware AI & green data infrastructure" delay={0.3} />
            </div>
          </motion.div>
        </section>
        <section className="mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
              What Powers SynexiAI
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Solutions born from the fusion of AI, cloud systems, and renewable intelligence
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                delay={feature.delay}
              />
            ))}
          </div>
        </section>


        {/* Mission Statement */}
        <section className="py-16 px-8 bg-gradient-to-br from-gray-900 to-cyan-900/30 rounded-3xl border border-cyan-500/20 shadow-xl shadow-cyan-500/20 mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center max-w-4xl mx-auto"
          >
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-8">
              "From <span className="text-cyan-400">Zero to Forever</span> — Building Systems That Last"
            </h3>
            <p className="text-xl text-gray-300 leading-relaxed">
              Our philosophy centers on creating technology that evolves with time,
              solving tomorrow's problems with today's innovation. We architect systems
              that grow more valuable with each iteration.
            </p>
          </motion.div>
        </section>

        {/* Final CTA */}
        <section className="text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-3xl md:text-4xl font-bold text-cyan-400 mb-8">
              Ready to Build the Future With Us?
            </h3>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto">
              Whether you're looking to collaborate, invest, or join our team, we're excited to connect.
            </p>
            <motion.a
              href="/contact"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block px-10 py-5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl text-xl font-semibold shadow-lg shadow-cyan-500/30 transition-all duration-300"
            >
              Get Started Today
            </motion.a>
          </motion.div>
        </section>

      </div>
    </Layout>
  );
}