import React from "react";

export default function AboutPage() {
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
      {/* About Intro */}
      <section style={{ marginBottom: "3.5rem" }} data-aos="fade-up">
        <h1 style={{ fontSize: "2.75rem", color: "#00f7ff", marginBottom: "1rem" }}>
          About SynexiAI
        </h1>
        <p style={{ fontSize: "1.2rem", lineHeight: "1.8" }}>
          <strong>SynexiAI</strong> is not just a company — it's a movement. We’re building intelligent systems, platforms, and ideas that empower people, industries, and the future.
          Founded by dreamer and builder <strong>Venkat Sai Prasanth Kunchanapalli</strong>, SynexiAI is born from the belief that <em>software + intelligence + vision = transformation</em>.
        </p>
      </section>

      {/* Core Values */}
      <section style={{ marginBottom: "3rem" }} data-aos="fade-up" data-aos-delay="100">
        <h2 style={{ fontSize: "1.75rem", color: "#00f7ff", marginBottom: "0.75rem" }}>
          🌟 Our Core Values
        </h2>
        <ul style={{ paddingLeft: "1.5rem", fontSize: "1.05rem", lineHeight: "1.9" }}>
          <li>🧠 Innovation with Purpose</li>
          <li>🛠️ Build from Zero, Think for Forever</li>
          <li>💡 Clarity, Creativity, and Execution</li>
          <li>🌍 Technology that Uplifts Humanity</li>
          <li>🤝 Transparency and Trust in Everything</li>
        </ul>
      </section>

      {/* Who We Are */}
      <section style={{ marginBottom: "3rem" }} data-aos="fade-up" data-aos-delay="200">
        <h2 style={{ fontSize: "1.75rem", color: "#00f7ff", marginBottom: "0.75rem" }}>
          🧑‍🚀 Who We Are
        </h2>
        <p style={{ fontSize: "1.05rem", lineHeight: "1.8" }}>
          Our journey began as a solo dream by <strong>Venkat Sai Prasanth Kunchanapalli</strong> — a full-stack engineer, AI visionary, and future entrepreneur.
          From designing microservice architectures to building AI dashboards, the mission has always been clear: <em>create something eternal, meaningful, and advanced</em>.
        </p>
      </section>

      {/* What We Believe */}
      <section style={{ marginBottom: "3rem" }} data-aos="fade-up" data-aos-delay="300">
        <h2 style={{ fontSize: "1.75rem", color: "#00f7ff", marginBottom: "0.75rem" }}>
          🌐 What We Believe
        </h2>
        <p style={{ fontSize: "1.05rem", lineHeight: "1.8" }}>
          We believe technology should solve real-world problems and open doors to new opportunities.
          SynexiAI combines engineering, AI, and futuristic vision to transform how people live, think, work, and build.
        </p>
      </section>

      {/* Long-Term Goals */}
      <section data-aos="fade-up" data-aos-delay="400">
        <h2 style={{ fontSize: "1.75rem", color: "#00f7ff", marginBottom: "0.75rem" }}>
          🚀 Our Long-Term Goals
        </h2>
        <ul style={{ paddingLeft: "1.5rem", fontSize: "1.05rem", lineHeight: "1.9" }}>
          <li>🧩 Build scalable microservice platforms & dashboards</li>
          <li>🏥 Deploy real-world AI for healthcare, government, energy, and education</li>
          <li>🏙️ Create a future city powered by renewable tech and data centers</li>
          <li>🌐 Become a global brand for innovation & impact</li>
        </ul>
      </section>
    </main>
  );
}
