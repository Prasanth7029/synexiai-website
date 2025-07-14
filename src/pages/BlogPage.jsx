import React from "react";

const blogPosts = [
  {
    title: "⚙️ Behind the Build: Inventory System Microservices",
    date: "July 12, 2025",
    summary:
      "How we architected SynexiAI’s Inventory System with Spring Boot, RabbitMQ, Redis, and JWT-based auth.",
    link: "#", // placeholder – can point to a Markdown, PDF, or post page
  },
  {
    title: "🧠 The Vision of SynexiAI: 2025 → 2045",
    date: "July 5, 2025",
    summary:
      "A peek into our 20-year roadmap — from AI dashboards to cities powered by renewable tech + intelligence.",
    link: "#",
  },
  {
    title: "🚀 Our Stack in Action: React + Vite + GitHub Pages",
    date: "June 29, 2025",
    summary:
      "Why we chose React with Vite for blazing-fast performance, modular growth, and future AI integrations.",
    link: "#",
  },
];

export default function BlogPage() {
  return (
    <main
      style={{
        padding: "3rem 1rem",
        color: "#ffffff",
        backgroundColor: "#0a0a0a",
        minHeight: "100vh",
        maxWidth: "1100px",
        margin: "0 auto",
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
        📝 SynexiAI Blog & Updates
      </h1>
      <p
        style={{
          fontSize: "1.2rem",
          color: "#ccc",
          marginBottom: "2rem",
        }}
        data-aos="fade-up"
        data-aos-delay="100"
      >
        Thoughts, research, releases, breakthroughs, and more — directly from the heart of innovation.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "2rem",
        }}
      >
        {blogPosts.map((post, index) => (
          <div
            key={index}
            style={{
              background: "#1a1a1a",
              borderRadius: "1rem",
              padding: "1.5rem",
              boxShadow: "0 0 20px #00f7ff33",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
            data-aos="fade-up"
            data-aos-delay={200 * index}
          >
            <div>
              <h2 style={{ color: "#00f7ff", fontSize: "1.5rem", marginBottom: "0.5rem" }}>
                {post.title}
              </h2>
              <p style={{ fontSize: "0.9rem", color: "#999", marginBottom: "1rem" }}>
                📅 {post.date}
              </p>
              <p style={{ fontSize: "1rem", lineHeight: "1.6", color: "#ddd" }}>{post.summary}</p>
            </div>
            <a
              href={post.link}
              style={{
                marginTop: "1.5rem",
                color: "#00f7ff",
                textDecoration: "underline",
                fontWeight: "bold",
                alignSelf: "flex-start",
              }}
            >
              Read more →
            </a>
          </div>
        ))}
      </div>
    </main>
  );
}
