import React from "react";
import Container from "../components/Container";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import TeamMemberCard from "../components/TeamMemberCard";
import ValueCard from "../components/ValueCard";
import { Link } from "react-router-dom";
import { coreValues, teamMembers } from "../data/aboutData";
import { FaHandshake, FaLightbulb, FaChartLine, FaGlobeAmericas } from "react-icons/fa";

export default function AboutPage() {
  return (
    <>
      <Helmet>
        <title>About SynexiAI | Our Vision and Values</title>
        <meta
          name="description"
          content="Learn about SynexiAI's mission, origin, values, and our vision to revolutionize AI, IT systems, and renewable technologies."
        />
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
              "https://twitter.com/synexiai"
            ],
            founder: {
              "@type": "Person",
              name: "Venkat Sai Prasanth Kunchanapalli",
            },
            foundingDate: "2023",
            description: "Engineering intelligent systems to reshape industries and empower people."
          })}
        </script>
      </Helmet>

      <Container animate className="text-white relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 overflow-hidden -z-10">
          <div className="absolute top-0 left-1/4 w-[300px] h-[300px] bg-cyan-500/10 rounded-full blur-[100px] animate-float-slow" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[120px] animate-float-medium" />
        </div>

        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center py-20 md:py-28 relative"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-transparent -z-10" />
          <motion.h1
            className="text-5xl md:text-7xl font-bold mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
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
            className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed"
          >
            <span className="font-semibold text-cyan-300">SynexiAI</span> is building the cognitive infrastructure for tomorrow — where <span className="italic">AI meets purpose</span> to create meaningful impact.
          </motion.p>
        </motion.section>

        {/* Founder Section */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="mb-24 relative"
        >
          <div className="bg-gradient-to-br from-gray-900/70 to-gray-900/90 rounded-3xl p-8 md:p-12 border border-cyan-500/20 shadow-2xl shadow-cyan-500/10 backdrop-blur-sm">
            <motion.h2
              className="text-3xl md:text-4xl font-bold text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">
                Our Origin Story
              </span>
            </motion.h2>

            <motion.div
              className="flex flex-col lg:flex-row gap-12 items-center mb-16"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="lg:w-1/3">
                <motion.div
                  className="relative rounded-2xl overflow-hidden border-4 border-cyan-500/30 shadow-xl"
                  whileHover={{ scale: 1.02 }}
                >
                  <img
                    src="assets/team/prasanth.jpg"
                    alt="Venkat Sai Prasanth Kunchanapalli"
                    className="w-full h-auto object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <h3 className="text-2xl font-bold text-white">Venkat Sai Prasanth Kunchanapalli</h3>
                    <p className="text-cyan-300">Founder & Visionary</p>
                  </div>
                </motion.div>
              </div>

              <div className="lg:w-2/3">
                <motion.p
                  className="text-lg md:text-xl text-gray-300 leading-relaxed"
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                >
                  "What began as a solo developer's passion project in 2023 has evolved into a movement. <span className="text-cyan-300">SynexiAI</span> was born from the belief that technology should serve humanity, not the other way around. Our journey started with simple automation scripts and has grown to encompass AI systems that transform industries."
                </motion.p>
              </div>
            </motion.div>

            <motion.h3
              className="text-2xl font-semibold text-cyan-400 mb-8 text-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              Meet The Team
            </motion.h3>

            <motion.div
              className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {teamMembers.map((member, index) => (
                <TeamMemberCard
                  key={index}
                  {...member}
                  delay={index * 0.1}
                />
              ))}
            </motion.div>
          </div>
        </motion.section>

        {/* Core Values */}
        <motion.section
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">
                Our Core Values
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              The principles that guide every decision we make
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreValues.map((value, index) => (
              <ValueCard
                key={index}
                icon={value.icon}
                title={value.title}
                description={value.description}
                delay={index * 0.1}
                highlightColor={index % 2 === 0 ? "cyan" : "teal"}
              />
            ))}
          </div>
        </motion.section>

        {/* Mission & Vision */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="mb-24 grid md:grid-cols-2 gap-8"
        >
          {/* Mission */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-br from-cyan-900/40 to-blue-900/40 rounded-3xl p-8 border border-cyan-500/30 shadow-xl backdrop-blur-sm"
          >
            <div className="flex items-center mb-6">
              <div className="p-3 bg-cyan-500/20 rounded-lg mr-4">
                <FaHandshake className="text-cyan-400 text-2xl" />
              </div>
              <h2 className="text-2xl font-bold text-cyan-300">Our Mission</h2>
            </div>
            <p className="text-lg text-gray-300 leading-relaxed mb-6">
              To <strong>bridge technology and human potential</strong> through intelligent systems that empower industries to grow sustainably while putting people first.
            </p>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start">
                <span className="text-cyan-400 mr-2">•</span>
                <span>Democratize access to powerful AI tools</span>
              </li>
              <li className="flex items-start">
                <span className="text-cyan-400 mr-2">•</span>
                <span>Build with transparency and ethical responsibility</span>
              </li>
              <li className="flex items-start">
                <span className="text-cyan-400 mr-2">•</span>
                <span>Create technology that serves rather than extracts</span>
              </li>
            </ul>
          </motion.div>

          {/* Vision */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 rounded-3xl p-8 border border-purple-500/30 shadow-xl backdrop-blur-sm"
          >
            <div className="flex items-center mb-6">
              <div className="p-3 bg-purple-500/20 rounded-lg mr-4">
                <FaGlobeAmericas className="text-purple-400 text-2xl" />
              </div>
              <h2 className="text-2xl font-bold text-purple-300">Our Vision</h2>
            </div>
            <p className="text-lg text-gray-300 leading-relaxed mb-6">
              A world where <strong>technology amplifies human potential</strong> without compromising our planet or values — where AI serves as a partner in progress.
            </p>
            <div className="grid gap-4">
              <div className="bg-gray-900/30 rounded-xl p-4 border border-gray-800">
                <h3 className="text-cyan-300 font-medium mb-2 flex items-center">
                  <FaLightbulb className="mr-2" /> Technological Goals
                </h3>
                <ul className="text-gray-300 text-sm space-y-2">
                  <li className="flex items-start">
                    <span className="text-cyan-400 mr-2">•</span>
                    <span>Develop self-improving AI systems</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-cyan-400 mr-2">•</span>
                    <span>Pioneer human-AI collaboration frameworks</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-cyan-400 mr-2">•</span>
                    <span>Build the most intuitive interfaces for complex systems</span>
                  </li>
                </ul>
              </div>
              <div className="bg-gray-900/30 rounded-xl p-4 border border-gray-800">
                <h3 className="text-teal-300 font-medium mb-2 flex items-center">
                  <FaChartLine className="mr-2" /> Impact Goals
                </h3>
                <ul className="text-gray-300 text-sm space-y-2">
                  <li className="flex items-start">
                    <span className="text-teal-400 mr-2">•</span>
                    <span>Launch renewable-powered smart city prototype by 2030</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-teal-400 mr-2">•</span>
                    <span>Reduce AI bias in critical systems by 80%</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-teal-400 mr-2">•</span>
                    <span>Train 1M developers in ethical AI practices</span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        </motion.section>

        {/* CTA Section */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center py-16 relative"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-gray-900/90 rounded-3xl -z-10" />
          <div className="absolute inset-0 bg-[url('/assets/grid-pattern.svg')] bg-center opacity-10 -z-10" />

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-3xl md:text-4xl font-bold mb-6"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-teal-400">
              Join Our Movement
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="text-xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Whether you're a builder, investor, or visionary — help shape the future of responsible AI.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Link to="/contact">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-teal-500 text-black font-semibold rounded-xl hover:shadow-lg hover:shadow-cyan-500/30 transition-all duration-300 flex items-center"
              >
                <span>Get in Touch</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </motion.button>
            </Link>

            <Link to="/careers">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-xl border border-gray-700 hover:border-gray-600 transition-all duration-300 flex items-center"
              >
                <span>Explore Careers</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                </svg>
              </motion.button>
            </Link>
          </motion.div>
        </motion.section>
      </Container>
    </>
  );
}