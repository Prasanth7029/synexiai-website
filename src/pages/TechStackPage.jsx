import React from "react";
import { Tooltip } from "react-tooltip";
import Layout from "../components/Layout";
import {
  FaReact,
  FaNodeJs,
  FaJava,
  FaDocker,
  FaAws,
  FaPython,
  FaGithub,
  FaGitAlt,
  FaMicrosoft,
} from "react-icons/fa";
import {
  SiSpringboot,
  SiPostgresql,
  SiMongodb,
  SiRedis,
  SiRabbitmq,
  SiApachekafka,
  SiVite,
  SiTailwindcss,
  SiOpenai,
  SiGooglecloud,
} from "react-icons/si";

const techStack = [
  {
    category: "Frontend",
    tools: [
      { name: "React.js", icon: <FaReact />, color: "text-cyan-400", description: "UI Framework for the SynexiAI portal" },
      { name: "Vite", icon: <SiVite />, color: "text-yellow-400" },
      { name: "Tailwind CSS", icon: <SiTailwindcss />, color: "text-blue-400" },
    ],
  },
  {
    category: "Backend",
    tools: [
      { name: "Spring Boot", icon: <SiSpringboot />, color: "text-green-400" },
      { name: "Java", icon: <FaJava />, color: "text-orange-400" },
      { name: "Node.js", icon: <FaNodeJs />, color: "text-lime-400" },
    ],
  },
  {
    category: "Database & Caching",
    tools: [
      { name: "PostgreSQL", icon: <SiPostgresql />, color: "text-blue-500" },
      { name: "MongoDB", icon: <SiMongodb />, color: "text-green-500" },
      { name: "Redis", icon: <SiRedis />, color: "text-red-500" },
    ],
  },
  {
    category: "Messaging & Async",
    tools: [
      { name: "RabbitMQ", icon: <SiRabbitmq />, color: "text-orange-300" },
      { name: "Apache Kafka", icon: <SiApachekafka />, color: "text-purple-400" },
    ],
  },
  {
    category: "DevOps & CI/CD",
    tools: [
      { name: "Git", icon: <FaGitAlt />, color: "text-red-400" },
      { name: "GitHub Actions", icon: <FaGithub />, color: "text-gray-300" },
      { name: "Docker", icon: <FaDocker />, color: "text-blue-300" },
    ],
  },
  {
    category: "Cloud & AI",
    tools: [
      { name: "AWS", icon: <FaAws />, color: "text-yellow-300" },
      { name: "Azure", icon: <FaMicrosoft />, color: "text-blue-300" }, // ✅ Fixed icon
      { name: "GCP", icon: <SiGooglecloud />, color: "text-red-300" },
      { name: "OpenAI", icon: <SiOpenai />, color: "text-violet-300" },
      { name: "Python", icon: <FaPython />, color: "text-yellow-400" },
    ],
  },
];

export default function TechStackPage() {
  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-6 py-20 text-white">
        {/* Title */}
        <h1
          className="text-4xl md:text-5xl font-bold text-cyan-400 mb-6 text-center"
          data-aos="fade-up"
        >
          ⚙️ Our Technology Stack
        </h1>

        {/* Architecture Section */}
        <div className="mt-24 text-center" data-aos="fade-up">
          <h2 className="text-3xl font-semibold text-cyan-400 mb-6">
            🧠 SynexiAI System Architecture
          </h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto mb-8">
            Here's how all our technologies work together — from frontend to backend, messaging, and cloud.
          </p>
          <div className="flex justify-center">
            <img
              src="/assets/architecture-diagram.png"
              alt="System Architecture Diagram"
              className="rounded-xl shadow-lg border border-cyan-500/10 max-w-full h-auto"
            />
          </div>
        </div>



        {/* Subheading */}
        <p
          className="text-lg md:text-xl text-gray-300 text-center mb-16 max-w-3xl mx-auto"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          Powering SynexiAI with scalable, future-ready tools — across cloud, microservices, AI, and devops automation.
        </p>

        {/* Tech Stack Sections */}
        <div className="space-y-12">
          {techStack.map((section, index) => (
            <div key={index} data-aos="fade-up" data-aos-delay={150 * index}>
              <h2 className="text-2xl font-semibold text-cyan-300 mb-4">
                {section.category}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {section.tools.map((tool, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col items-center justify-center bg-[#1a1a1a] border border-cyan-500/10 rounded-xl p-5 shadow-md hover:shadow-cyan-500/20 transition-shadow duration-300"
                    data-tip={`${tool.name} — ${tool.description || "Used in core architecture"}`}
                  >
                    <div className={`text-4xl mb-2 ${tool.color}`}>{tool.icon}</div>
                    <p className="text-sm text-gray-300 text-center">{tool.name}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <Tooltip place="bottom" type="dark" effect="solid" />
    </Layout>
  );
}
