import React from "react";
import Container from "../components/Container";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import TeamMemberCard from "../components/TeamMemberCard";
import ValueCard from "../components/ValueCard";
import { Link } from "react-router-dom";
import { coreValues, teamMembers } from "../data/aboutData";

export default function AboutPage() {
  return (
    <>
      <Helmet>
        <title>About SynexiAI | Our Vision and Values</title>
        <meta
          name="description"
          content="Learn about SynexiAI's mission, origin, values, and our vision to revolutionize AI, IT systems, and renewable technologies."
        />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "SynexiAI",
            url: "https://www.synexiai.online",
            logo: "https://www.synexiai.online/assets/logo.svg",
            sameAs: [
              "https://linkedin.com/company/synexiai",
              "https://github.com/synexiai",
            ],
            founder: {
              "@type": "Person",
              name: "Venkat Sai Prasanth Kunchanapalli",
            },
          })}
        </script>
      </Helmet>

      <Container animate className="text-white">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
            About SynexiAI
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-9">
            <strong className="text-cyan-300">SynexiAI</strong> is a movement — not just a company. We engineer
            intelligent systems to reshape industries, empower people, and lead the future.
          </p>
        </motion.section>

        {/* Founder Section */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <div className="bg-gray-900/50 rounded-2xl p-10 border border-cyan-500/20 shadow-lg shadow-cyan-500/10">
            <h2 className="text-3xl font-bold text-cyan-400 mb-10 text-center">Our Origin Story</h2>
            <p className="text-lg text-center text-gray-300 leading-8 max-w-4xl mx-auto mb-10">
              SynexiAI was founded by <strong className="text-cyan-300">Venkat Sai Prasanth Kunchanapalli</strong>, a visionary engineer with a mission:{" "}
              <span className="italic">software + intelligence + purpose = impact</span>.
              What started as a solo developer's dream has grown into a future-focused team building meaningful tech.
            </p>

            <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teamMembers.map((member, index) => (
                <TeamMemberCard key={index} {...member} />
              ))}
            </div>
          </div>
        </motion.section>

        {/* Core Values */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-cyan-400 mb-10 text-center">🌟 Our Core Values</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {coreValues.map((value, index) => (
              <ValueCard
                key={index}
                icon={value.icon}
                title={value.title}
                description={value.description}
                delay={index * 100}
              />
            ))}
          </div>
        </motion.section>

        {/* Mission Section */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <div className="bg-gradient-to-r from-cyan-900/30 to-blue-900/30 rounded-2xl p-10 border border-cyan-500/20">
            <h2 className="text-3xl font-bold text-cyan-400 mb-6">Our Mission</h2>
            <p className="text-xl leading-9 text-gray-300">
              To <strong className="text-cyan-300">bridge technology and real-world impact</strong>. We build intelligent platforms that help industries grow sustainably, responsibly, and exponentially.
            </p>
          </div>
        </motion.section>

        {/* Vision for the Future */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-cyan-400 mb-8 text-center">🚀 Our Vision for the Future</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-900/50 rounded-xl p-6 border border-cyan-500/10">
              <h3 className="text-xl font-semibold text-cyan-300 mb-4">Technological Goals</h3>
              <ul className="space-y-3 text-gray-300">
                <li>• Scalable microservices for global platforms</li>
                <li>• AI products for healthcare, energy, and civic tech</li>
                <li>• Beautiful, intuitive dashboards with real insights</li>
              </ul>
            </div>
            <div className="bg-gray-900/50 rounded-xl p-6 border border-cyan-500/10">
              <h3 className="text-xl font-semibold text-cyan-300 mb-4">Impact Goals</h3>
              <ul className="space-y-3 text-gray-300">
                <li>• Launch a renewable-energy smart city</li>
                <li>• Become the global model for ethical innovation</li>
                <li>• Inspire the next generation of AI builders</li>
              </ul>
            </div>
          </div>
        </motion.section>

        {/* CTA */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mt-10"
        >
          <h3 className="text-2xl font-semibold text-cyan-400 mb-4">Ready to be part of our journey?</h3>
          <p className="text-lg text-gray-300 mb-6 max-w-2xl mx-auto">
            Whether you're a builder, a dreamer, or an investor — let's shape the future together.
          </p>
          <Link to="/contact">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-medium rounded-lg transition-all duration-300 shadow-lg shadow-cyan-500/20"
            >
              Get in Touch
            </motion.button>
          </Link>
        </motion.section>
      </Container>
    </>
  );
}
