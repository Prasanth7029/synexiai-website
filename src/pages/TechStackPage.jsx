// src/pages/TechStackPage.jsx
import React from "react";
import {
  FaReact, FaNodeJs, FaJava, FaDocker, FaAws, FaPython, FaGithub, FaGitAlt, FaMicrosoft,
} from "react-icons/fa";
import {
  SiSpringboot, SiPostgresql, SiMongodb, SiRedis, SiRabbitmq, SiApachekafka, SiVite,
  SiTailwindcss, SiOpenai, SiGooglecloud,
} from "react-icons/si";
import { motion } from "framer-motion";
import Layout from "../components/Layout";

const techStack = [
  {
    category: "Frontend",
    tools: [
      { name: "React.js", icon: <FaReact />, color: "text-cyan-400", description: "UI Framework for the SynexiAI portal" },
      { name: "Vite", icon: <SiVite />, color: "text-yellow-400", description: "Next-gen frontend tooling" },
      { name: "Tailwind CSS", icon: <SiTailwindcss />, color: "text-blue-400", description: "Utility-first CSS framework" },
    ],
  },
  {
    category: "Backend",
    tools: [
      { name: "Spring Boot", icon: <SiSpringboot />, color: "text-green-400", description: "Java backend framework" },
      { name: "Java", icon: <FaJava />, color: "text-orange-400", description: "Core programming language" },
      { name: "Node.js", icon: <FaNodeJs />, color: "text-lime-400", description: "Backend JS runtime" },
    ],
  },
  {
    category: "Database & Caching",
    tools: [
      { name: "PostgreSQL", icon: <SiPostgresql />, color: "text-blue-500", description: "Relational DB" },
      { name: "MongoDB", icon: <SiMongodb />, color: "text-green-500", description: "NoSQL DB" },
      { name: "Redis", icon: <SiRedis />, color: "text-red-500", description: "In-memory caching" },
    ],
  },
  {
    category: "Messaging & Async",
    tools: [
      { name: "RabbitMQ", icon: <SiRabbitmq />, color: "text-orange-300", description: "Message broker" },
      { name: "Apache Kafka", icon: <SiApachekafka />, color: "text-purple-400", description: "Distributed streaming" },
    ],
  },
  {
    category: "DevOps & CI/CD",
    tools: [
      { name: "Git", icon: <FaGitAlt />, color: "text-red-400", description: "Version control" },
      { name: "GitHub Actions", icon: <FaGithub />, color: "text-gray-300", description: "CI/CD pipeline" },
      { name: "Docker", icon: <FaDocker />, color: "text-blue-300", description: "Containerization" },
    ],
  },
  {
    category: "Cloud & AI",
    tools: [
      { name: "AWS", icon: <FaAws />, color: "text-yellow-300", description: "Cloud provider" },
      { name: "Azure", icon: <FaMicrosoft />, color: "text-blue-300", description: "Cloud provider" },
      { name: "GCP", icon: <SiGooglecloud />, color: "text-red-300", description: "Google Cloud Platform" },
      { name: "OpenAI", icon: <SiOpenai />, color: "text-violet-300", description: "AI foundation model" },
      { name: "Python", icon: <FaPython />, color: "text-yellow-400", description: "AI scripting language" },
    ],
  },
];

export default function TechStackPage() {
  return (
    <>
      <div className="max-w-6xl mx-auto px-6 py-20 text-white">
        <motion.h1
          className="text-4xl md:text-5xl font-bold text-cyan-400 mb-12 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          ⚙️ Our Technology Stack
        </motion.h1>

        {/* Architecture Section */}
        <motion.div
          className="mt-24 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-semibold text-cyan-400 mb-6">
            🧠 SynexiAI System Architecture
          </h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto mb-8">
            Here's how all our technologies work together — from frontend to backend, messaging, and cloud.
          </p>
          <a href="/assets/architecture-diagram.png" target="_blank" rel="noopener noreferrer">
            <img
              src="/assets/architecture-diagram.png"
              alt="System Architecture Diagram"
              className="rounded-xl shadow-lg border border-cyan-500/10 max-w-full h-auto hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/assets/diagram-placeholder.png";
              }}
            />
          </a>
        </motion.div>

        {/* Summary */}
        <p className="text-lg md:text-xl text-gray-300 text-center mt-20 mb-16 max-w-3xl mx-auto">
          Powering SynexiAI with scalable, future-ready tools — across cloud, microservices, AI, and devops automation.
        </p>

        {/* Tech Stack Sections */}
        <div className="space-y-16">
          {techStack.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <h3 className="text-2xl font-semibold text-cyan-300 mb-4">
                {section.category}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {section.tools.map((tool, idx) => (
                  <motion.div
                    key={idx}
                    className="flex flex-col items-center justify-center bg-[#1a1a1a] border border-cyan-500/10 rounded-xl p-5 shadow-md hover:shadow-cyan-500/20 transition-shadow duration-300 hover:scale-105"
                    title={tool.description}
                    whileHover={{ y: -4 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                  >
                    <div className={`text-4xl mb-2 ${tool.color}`}>{tool.icon}</div>
                    <p className="text-sm text-gray-300 text-center">{tool.name}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
}
