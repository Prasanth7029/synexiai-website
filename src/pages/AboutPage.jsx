import React from "react";
import Layout from "../components/Layout";

export default function AboutPage() {
  return (
    <Layout>
      <div className="w-full max-w-4xl mx-auto px-6 py-20 text-white">
        {/* About Intro */}
        <section className="mb-16" data-aos="fade-up">
          <h1 className="text-4xl md:text-5xl font-bold text-cyan-400 mb-6">
            About SynexiAI
          </h1>
          <p className="text-lg leading-8 text-gray-300">
            <strong>SynexiAI</strong> is not just a company — it's a movement. We’re building intelligent systems,
            platforms, and ideas that empower people, industries, and the future.
            Founded by dreamer and builder <strong>Venkat Sai Prasanth Kunchanapalli</strong>, SynexiAI is born from
            the belief that <em>software + intelligence + vision = transformation</em>.
          </p>
        </section>

        {/* Core Values */}
        <section className="mb-14" data-aos="fade-up" data-aos-delay="100">
          <h2 className="text-2xl font-semibold text-cyan-400 mb-4">🌟 Our Core Values</h2>
          <ul className="list-disc pl-6 text-gray-300 text-base leading-7 space-y-2">
            <li>🧠 Innovation with Purpose</li>
            <li>🛠️ Build from Zero, Think for Forever</li>
            <li>💡 Clarity, Creativity, and Execution</li>
            <li>🌍 Technology that Uplifts Humanity</li>
            <li>🤝 Transparency and Trust in Everything</li>
          </ul>
        </section>

        {/* Who We Are */}
        <section className="mb-14" data-aos="fade-up" data-aos-delay="200">
          <h2 className="text-2xl font-semibold text-cyan-400 mb-4">🧑‍🚀 Who We Are</h2>
          <p className="text-base leading-7 text-gray-300">
            Our journey began as a solo dream by <strong>Venkat Sai Prasanth Kunchanapalli</strong> —
            a full-stack engineer, AI visionary, and future entrepreneur. From designing microservice architectures
            to building AI dashboards, the mission has always been clear: <em>create something eternal, meaningful,
            and advanced</em>.
          </p>
        </section>

        {/* What We Believe */}
        <section className="mb-14" data-aos="fade-up" data-aos-delay="300">
          <h2 className="text-2xl font-semibold text-cyan-400 mb-4">🌐 What We Believe</h2>
          <p className="text-base leading-7 text-gray-300">
            We believe technology should solve real-world problems and open doors to new opportunities.
            SynexiAI combines engineering, AI, and futuristic vision to transform how people live, think, work, and build.
          </p>
        </section>

        {/* Long-Term Goals */}
        <section data-aos="fade-up" data-aos-delay="400">
          <h2 className="text-2xl font-semibold text-cyan-400 mb-4">🚀 Our Long-Term Goals</h2>
          <ul className="list-disc pl-6 text-gray-300 text-base leading-7 space-y-2">
            <li>🧩 Build scalable microservice platforms & dashboards</li>
            <li>🏥 Deploy real-world AI for healthcare, government, energy, and education</li>
            <li>🏙️ Create a future city powered by renewable tech and data centers</li>
            <li>🌐 Become a global brand for innovation & impact</li>
          </ul>
        </section>
      </div>
    </Layout>
  );
}
