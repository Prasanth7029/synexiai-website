import React from "react";
import Container from "../components/Container";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import TeamMemberCard from "../components/TeamMemberCard";
import ValueCard from "../components/ValueCard";
import { Link } from "react-router-dom";
import { coreValues, teamMembers } from "../data/aboutData";
import {
  FaHandshake,
  FaLightbulb,
  FaChartLine,
  FaGlobeAmericas,
  FaCogs,
  FaShieldAlt,
} from "react-icons/fa";

export default function AboutPage() {
  const implementationProcess = [
    {
      title: "Research & Discovery",
      description:
        "Deep dive into industry pain points and technological possibilities",
      icon: <FaLightbulb className="text-cyan-400" />,
    },
    {
      title: "System Architecture",
      description:
        "Designing scalable, secure infrastructure for intelligent systems",
      icon: <FaCogs className="text-blue-400" />,
    },
    {
      title: "AI Model Development",
      description: "Building specialized models for targeted industry applications",
      icon: <FaChartLine className="text-purple-400" />,
    },
    {
      title: "Security Integration",
      description: "Implementing Zero Trust Architecture and blockchain verification",
      icon: <FaShieldAlt className="text-teal-400" />,
    },
    {
      title: "Deployment & Scaling",
      description:
        "Rolling out solutions with continuous improvement mechanisms",
      icon: <FaGlobeAmericas className="text-green-400" />,
    },
  ];

  return (
    <>
      <Helmet>
        <title>About SynexiAI | Our Vision and Values</title>
        <link rel="canonical" href="https://www.synexiai.online/about" />
        <meta
          name="description"
          content="Learn about SynexiAI's mission to revolutionize AI implementation through ethical, scalable solutions."
        />
        <meta property="og:title" content="About SynexiAI" />
        <meta property="og:description" content="Ethical AI infrastructure for industry transformation." />
        <meta property="og:image" content="/assets/about-preview.jpg" />
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
              "https://twitter.com/synexiai",
            ],
            description:
              "Building ethical AI infrastructure for industry transformation.",
          })}
        </script>
      </Helmet>

      {/* Let global background from index.css show through */}
      <Container animate className="relative overflow-hidden text-gray-900 dark:text-gray-100">
        {/* Decorative blobs (non-interactive, behind content) */}
        <div
          className="pointer-events-none absolute inset-0 overflow-hidden -z-10"
          aria-hidden="true"
        >
          <div className="hidden sm:block absolute top-0 left-1/4 w-[300px] h-[300px] bg-cyan-500/10 rounded-full blur-[60px] md:blur-[100px] animate-float-slow" />
          <div className="hidden sm:block absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[120px] animate-float-medium" />
        </div>

        {/* Hero */}
        <motion.section
          id="about-hero"
          aria-labelledby="about-title"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="relative text-center py-20 md:py-28"
        >
          <div
            className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-black/20 to-transparent dark:from-black/60"
            aria-hidden="true"
          />
          <motion.h1
            id="about-title"
            className="text-3xl sm:text-5xl md:text-7xl font-bold mb-6"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-teal-500">
              About SynexiAI
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed"
          >
            We engineer <span className="text-cyan-600 dark:text-cyan-300 font-medium">ethical AI infrastructure</span> that transforms industries while protecting fundamental values.
          </motion.p>
        </motion.section>

        {/* Purpose & Approach (glass panel) */}
        <motion.section
          id="purpose-approach"
          aria-labelledby="purpose-title"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="mb-24 relative"
        >
          <div className="rounded-3xl p-4 sm:p-8 md:p-12 border border-white/10 bg-white/5 backdrop-blur-md shadow-2xl shadow-cyan-500/10">
            <motion.h2
              id="purpose-title"
              className="text-3xl md:text-4xl font-bold text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">
                Our Purpose & Approach
              </span>
            </motion.h2>

            <motion.div
              className="grid md:grid-cols-2 gap-8 md:gap-12 mb-16"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div>
                <motion.h3
                  className="text-2xl font-bold text-cyan-600 dark:text-cyan-300 mb-6 flex items-center"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                >
                  <FaHandshake className="mr-3" aria-hidden="true" /> Why We Exist
                </motion.h3>
                <motion.p
                  className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                >
                  SynexiAI bridges the gap between cutting-edge AI and real-world needs—delivering systems that are powerful, ethical, and maintainable.
                </motion.p>
              </div>

              <div>
                <motion.h3
                  className="text-2xl font-bold text-teal-600 dark:text-teal-300 mb-6 flex items-center"
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                >
                  <FaCogs className="mr-3" aria-hidden="true" /> What Makes Us Different
                </motion.h3>
                <motion.p
                  className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                >
                  We design with three pillars: <span className="text-cyan-600 dark:text-cyan-300">scalability</span>, <span className="text-cyan-600 dark:text-cyan-300">security</span>, and{" "}
                  <span className="text-cyan-600 dark:text-cyan-300">ethical alignment</span>—architecting complete cognitive infrastructure, not just models.
                </motion.p>
              </div>
            </motion.div>

            {/* Implementation Process */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-2xl font-semibold text-center text-cyan-600 dark:text-cyan-400 mb-10">
                Our Implementation Process
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
                {implementationProcess.map((step, index) => (
                  <motion.div
                    key={step.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.08 }}
                    className="rounded-xl p-5 border border-white/10 bg-white/5 backdrop-blur-sm hover:border-cyan-400/30 transition-colors duration-300"
                  >
                    <div className="text-3xl mb-3 flex justify-center" aria-hidden="true">
                      {step.icon}
                    </div>
                    <h4 className="font-bold text-center mb-2">{step.title}</h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300 text-center">
                      {step.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Core Values */}
        <motion.section
          id="core-values"
          aria-labelledby="values-title"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="mb-24"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-center mb-16"
          >
            <h2 id="values-title" className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">
                Our Core Values
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              The principles that guide every technical decision we make
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {coreValues.map((value, index) => (
              <ValueCard
                key={value.title ?? index}
                icon={value.icon}
                title={value.title}
                description={value.description}
                delay={index * 0.1}
                highlightColor={index % 2 === 0 ? "cyan" : "teal"}
                className="bg-white/5 border border-white/10 backdrop-blur-sm"
              />
            ))}
          </div>
        </motion.section>

        {/* Team */}
        <motion.section
          id="team"
          aria-labelledby="team-title"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="mb-24"
        >
          <div className="rounded-3xl p-4 sm:p-8 md:p-12 border border-white/10 bg-white/5 backdrop-blur-md shadow-2xl shadow-cyan-500/10">
            <motion.h3
              id="team-title"
              className="text-2xl font-semibold text-center text-cyan-600 dark:text-cyan-400 mb-10"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              Our Dedicated Team
            </motion.h3>

            <motion.p
              className="text-center text-gray-700 dark:text-gray-300 max-w-2xl mx-auto mb-12"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              We’re a collective of engineers, researchers, and designers united by a shared vision for responsible AI implementation.
            </motion.p>

            <motion.div
              className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {teamMembers.map((member, index) => (
                <TeamMemberCard key={member.name ?? index} {...member} delay={index * 0.1} />
              ))}
            </motion.div>
          </div>
        </motion.section>

        {/* CTA */}
        <motion.section
          id="about-cta"
          aria-labelledby="cta-title"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center py-16"
        >
          <div className="max-w-4xl mx-auto rounded-3xl p-8 border border-white/10 bg-white/5 backdrop-blur-md shadow-xl shadow-cyan-500/10">
            <motion.h2
              id="cta-title"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-3xl md:text-4xl font-bold mb-6"
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-teal-400">
                Ready to Transform Your Infrastructure?
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed"
            >
              Discover how our AI implementation framework can future-proof your organization.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap justify-center gap-4"
            >
              <Link to="/contact" aria-label="Request a consultation">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-teal-500 text-black font-semibold rounded-xl hover:shadow-lg hover:shadow-cyan-500/30 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                >
                  Request Consultation
                </motion.button>
              </Link>

              <Link to="/solutions" aria-label="Explore SynexiAI solutions">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gray-900 dark:bg-gray-800 hover:bg-gray-800/90 text-white font-semibold rounded-xl border border-gray-700 hover:border-gray-600 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                >
                  Explore Solutions
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </motion.section>
      </Container>
    </>
  );
}
