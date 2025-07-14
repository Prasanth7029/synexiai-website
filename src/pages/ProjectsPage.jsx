import React from "react";
import Layout from "../components/Layout";

const projects = [
  {
    title: "🧠 MindMap AI Dashboard",
    description:
      "An interactive dashboard to organize, visualize, and manage knowledge using AI-powered tagging and search.",
    tech: ["React", "Spring Boot", "PostgreSQL", "JWT Auth"],
    link: "https://github.com/Prasanth7029/mindmap-dashboard",
  },
  {
    title: "📦 Inventory Management System",
    description:
      "Microservices-based inventory platform with real-time stock updates, order tracking, and email alerts.",
    tech: ["React + Vite", "Spring Boot", "RabbitMQ", "Redis"],
    link: "https://github.com/Prasanth7029/inventory-management-system",
  },
  {
    title: "🔔 Social Media Website",
    description:
      "A modern social media platform with user profiles, posts, comments, and real-time notifications.",
    tech: ["Java", "React", "MongoDB", "Spring Boot", "Kafka", "Redis"],
    link: "https://github.com/Prasanth7029/social-media-platform",
  },
];

export default function ProjectsPage() {
  return (
    <Layout>
      <div className="w-full max-w-6xl mx-auto px-6 py-20 text-white text-center">
        {/* Title */}
        <h1
          className="text-4xl md:text-5xl font-bold text-cyan-400 mb-6"
          data-aos="fade-up"
        >
          🚀 SynexiAI Project Showcase
        </h1>

        {/* Subtitle */}
        <p
          className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-16 leading-relaxed"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          Explore our AI-powered systems, microservice architectures, and futuristic solutions
          that shape tomorrow’s digital experience.
        </p>

        {/* Grid */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10"
          data-aos="fade-up"
          data-aos-delay="150"
        >
          {projects.map((project, index) => (
            <div
              key={index}
              className="bg-[#1a1a1a] dark:bg-[#111] rounded-xl p-6 shadow-xl border border-cyan-500/20 hover:border-cyan-400 hover:shadow-cyan-500/20 transition-transform duration-300 hover:scale-105"
              data-aos="fade-up"
              data-aos-delay={200 * index}
            >
              <h3 className="text-2xl font-semibold text-cyan-400 mb-2">
                {project.title}
              </h3>
              <p className="text-gray-300 mb-4">{project.description}</p>

              {/* Tech Tags */}
              <div className="flex flex-wrap gap-2 mb-4 justify-center">
                {project.tech.map((techItem, i) => (
                  <span
                    key={i}
                    className="bg-gray-800 text-gray-200 px-2 py-1 text-xs rounded-full border border-cyan-500/30"
                  >
                    {techItem}
                  </span>
                ))}
              </div>

              {/* GitHub Button */}
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-auto px-4 py-2 bg-cyan-500 text-black font-semibold rounded-md hover:bg-cyan-400 transition"
              >
                🔗 View on GitHub
              </a>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
