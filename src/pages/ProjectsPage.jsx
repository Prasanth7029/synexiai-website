import React from "react";

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
    link: "https://github.com/Prasanth7029/inventory-management-system", // replace with real
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
    <main
      style={{
        padding: "3rem 1rem",
        color: "#ffffff",
        backgroundColor: "#0a0a0a",
        minHeight: "100vh",
        textAlign: "center",
      }}
    >
      <h1
        style={{
          fontSize: "2.5rem",
          marginBottom: "1rem",
          color: "#00f7ff",
        }}
        data-aos="fade-up"
      >
        🚀 SynexiAI Project Showcase
      </h1>
      <p
        style={{
          fontSize: "1.2rem",
          maxWidth: "700px",
          margin: "0 auto 3rem",
          color: "#cccccc",
        }}
        data-aos="fade-up"
        data-aos-delay="100"
      >
        Explore our AI-powered systems, microservice architectures, and
        futuristic solutions that shape tomorrow’s digital experience.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "2rem",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {projects.map((project, index) => (
          <div
            key={index}
            data-aos="fade-up"
            data-aos-delay={200 * index}
            style={{
              background: "#1a1a1a",
              padding: "2rem",
              borderRadius: "1rem",
              boxShadow: "0 0 25px #00f7ff33",
              transition: "transform 0.3s ease",
              textAlign: "left",
            }}
            className="hover:scale-105"
          >
            <h3 style={{ fontSize: "1.5rem", marginBottom: "0.5rem", color: "#00f7ff" }}>
              {project.title}
            </h3>
            <p style={{ marginBottom: "1rem" }}>{project.description}</p>
            <p style={{ fontSize: "0.9rem", color: "#aaa" }}>
              <strong>Tech:</strong> {project.tech}
            </p>
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-block",
                marginTop: "1rem",
                padding: "0.5rem 1rem",
                backgroundColor: "#00f7ff",
                color: "#0a0a0a",
                borderRadius: "8px",
                fontWeight: "bold",
                textDecoration: "none",
              }}
            >
              🔗 View Project
            </a>
          </div>
        ))}
      </div>
    </main>
  );
}
