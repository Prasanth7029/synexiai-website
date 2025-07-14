import React from "react";
import Layout from "../components/Layout";
import { Helmet } from "react-helmet-async";
import TeamMemberCard from "../components/TeamMemberCard"; // New component
import ValueCard from "../components/ValueCard"; // New component
import { FaRocket, FaBrain, FaHandshake, FaGlobe, FaLightbulb } from "react-icons/fa";

// Team data (could be moved to a separate file)
const teamMembers = [
  {
    name: "Venkat Sai Prasanth Kunchanapalli",
    role: "Founder & Visionary",
    bio: "Full-stack engineer, AI researcher, and future entrepreneur building systems that matter.",
    expertise: ["Microservices", "AI Architecture", "Strategic Vision"],
    image: "/assets/team/prasanth.jpg"
  }
];

// Core values data
const coreValues = [
  {
    icon: <FaBrain className="text-2xl" />,
    title: "Innovation with Purpose",
    description: "We build solutions that solve real problems, not just showcase technology"
  },
  {
    icon: <FaRocket className="text-2xl" />,
    title: "Build from Zero, Think for Forever",
    description: "Our systems are designed with longevity and scalability in mind"
  },
  {
    icon: <FaLightbulb className="text-2xl" />,
    title: "Clarity, Creativity, Execution",
    description: "From vision to implementation with clear thinking and creative solutions"
  },
  {
    icon: <FaGlobe className="text-2xl" />,
    title: "Technology that Uplifts",
    description: "We measure success by positive human impact, not just technical achievements"
  },
  {
    icon: <FaHandshake className="text-2xl" />,
    title: "Transparency & Trust",
    description: "Open communication and ethical practices in everything we do"
  }
];

export default function AboutPage() {
  return (
    <Layout>
      <Helmet>
        <title>About SynexiAI | Our Vision and Values</title>
        <meta name="description" content="Learn about SynexiAI's mission, core values, and the vision driving our innovative solutions" />
      </Helmet>

      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-20 text-white">
        {/* Hero Section */}
        <section className="mb-20 text-center" data-aos="fade-up">
          <h1 className="text-4xl md:text-6xl font-bold text-cyan-400 mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
            About SynexiAI
          </h1>
          <p className="text-xl md:text-2xl leading-9 text-gray-300 max-w-4xl mx-auto">
            <strong className="text-cyan-300">SynexiAI</strong> is not just a company — it's a movement. We're building
            intelligent systems that empower people, transform industries, and shape the future.
          </p>
        </section>

        {/* Founder Spotlight */}
        <section className="mb-20" data-aos="fade-up">
          <div className="bg-gray-900/50 rounded-2xl p-8 md:p-10 border border-cyan-500/20 shadow-lg shadow-cyan-500/10">
            <h2 className="text-3xl font-bold text-cyan-400 mb-6">Our Origin Story</h2>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <p className="text-lg leading-8 text-gray-300 mb-6">
                  Founded by <strong className="text-cyan-300">Venkat Sai Prasanth Kunchanapalli</strong>,
                  SynexiAI emerged from a simple equation: <span className="italic">software + intelligence + vision = transformation</span>.
                </p>
                <p className="text-lg leading-8 text-gray-300">
                  What began as a solo mission has grown into a collective of engineers, designers, and thinkers committed to
                  building technology that lasts and matters.
                </p>
              </div>
              <div className="flex justify-center">
                <div className="relative w-64 h-64 rounded-full overflow-hidden border-4 border-cyan-400/30 shadow-lg">
                  <img
                    src="src/assets/team/prasanth.jpg"
                    alt="Venkat Sai Prasanth Kunchanapalli"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "src/assets/team/placeholder.jpg";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="mb-20" data-aos="fade-up">
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
        </section>

        {/* Mission Section */}
        <section className="mb-20" data-aos="fade-up">
          <div className="bg-gradient-to-r from-cyan-900/30 to-blue-900/30 rounded-2xl p-8 md:p-10 border border-cyan-500/20">
            <h2 className="text-3xl font-bold text-cyan-400 mb-6">Our Mission</h2>
            <p className="text-xl leading-9 text-gray-300">
              We exist to <strong className="text-cyan-300">bridge the gap</strong> between cutting-edge technology and
              real-world impact. Through intelligent systems, platforms, and ideas, we're creating tools that
              empower individuals and organizations to achieve what was previously unimaginable.
            </p>
          </div>
        </section>

        {/* Long-Term Vision */}
        <section className="mb-10" data-aos="fade-up">
          <h2 className="text-3xl font-bold text-cyan-400 mb-8 text-center">🚀 Our Vision for the Future</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-900/50 rounded-xl p-6 border border-cyan-500/10">
              <h3 className="text-xl font-semibold text-cyan-300 mb-4">Technological Goals</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-cyan-400 mr-2">•</span>
                  <span>Build scalable microservice platforms that set industry standards</span>
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-400 mr-2">•</span>
                  <span>Develop AI solutions for healthcare, education, and sustainable energy</span>
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-400 mr-2">•</span>
                  <span>Create intuitive dashboards that make complex data accessible</span>
                </li>
              </ul>
            </div>
            <div className="bg-gray-900/50 rounded-xl p-6 border border-cyan-500/10">
              <h3 className="text-xl font-semibold text-cyan-300 mb-4">Impact Goals</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-cyan-400 mr-2">•</span>
                  <span>Establish a future city powered by renewable tech and ethical AI</span>
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-400 mr-2">•</span>
                  <span>Become a global benchmark for responsible innovation</span>
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-400 mr-2">•</span>
                  <span>Empower the next generation of builders and thinkers</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center mt-16" data-aos="fade-up">
          <h3 className="text-2xl font-semibold text-cyan-400 mb-4">Ready to be part of our journey?</h3>
          <p className="text-lg text-gray-300 mb-6 max-w-2xl mx-auto">
            Whether you're a potential collaborator, client, or future team member, we'd love to connect.
          </p>
          <button className="px-8 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-medium rounded-lg transition-colors duration-300 shadow-lg shadow-cyan-500/20">
            Get in Touch
          </button>
        </section>
      </div>
    </Layout>
  );
}