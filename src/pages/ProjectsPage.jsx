import React from "react";
import Layout from "../components/Layout";

const projects = [
  {
    title: "🧠 MindMap AI Dashboard",
    description:
      "An interactive dashboard to organize, visualize, and manage knowledge using AI-powered tagging and search.",
    tech: "React, Spring Boot, PostgreSQL, JWT Auth",
    link: "https://github.com/Prasanth7029/mindmap-dashboard",
  },
  {
    title: "📦 Inventory Management System",
    description:
      "Microservices-based inventory platform with real-time stock updates, order tracking, and email alerts.",
    tech: "React + Vite, Spring Boot, RabbitMQ, Redis",
    link: "https://github.com/Prasanth7029/inventory-management-system",
  },
  {
    title: "🔔 Social Media Website",
    description:
      "A modern social media platform with user profiles, posts, comments, and real-time notifications.",
    tech: "Java, React, Node.js, Express, MongoDB, Socket.IO, JWT Auth, Spring Boot, Mail API, Kafka, Redis",
    link: "https://github.com/Prasanth7029/social-media-platform",
  },
];

export default function ProjectsPage() {
  return (
    <Layout>
      <div className="w-full max-w-6xl mx-auto px-6 py-20 text-white text-center">
        {/* Page Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-cyan-400 mb-6" data-aos="fade-up">
          🚀 SynexiAI Project Showcase
        </h1>

        {/* Page Description */}
        <p
          className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-16 leading-relaxed"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          Explore our AI-powered systems, microservice architectures, and futuristic solutions
          that shape tomorrow’s digital experience.
        </p>

        {/* Project Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10" data-aos="fade-up" data-aos-delay="150">
          {projects.map((project, index) => (
            <div
              key={index}
              className="bg-[#1a1a1a] rounded-xl p-6 shadow-lg hover:scale-105 transition-transform duration-300 border border-cyan-500/10"
              data-aos="fade-up"
              data-aos-delay={200 * index}
            >
              <h3 className="text-xl font-semibold text-cyan-400 mb-2">{project.title}</h3>
              <p className="text-gray-300 mb-4">{project.description}</p>
              <p className="text-sm text-gray-400">
                <strong>Tech:</strong> {project.tech}
              </p>
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-4 px-4 py-2 bg-cyan-500 text-black font-semibold rounded-lg hover:bg-cyan-400 transition"
              >
                🔗 View Project
              </a>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
