import React from "react";
import Container from "../components/Container";
import { Helmet } from "react-helmet-async";
import TeamMemberCard from "../components/TeamMemberCard";
import ValueCard from "../components/ValueCard";
import { Link } from "react-router-dom";
import { coreValues, teamMembers } from "../data/aboutData";
import { motion } from "framer-motion";
import {
 FaHandshake,
 FaLightbulb,
 FaChartLine,
 FaGlobeAmericas,
 FaCogs,
 FaShieldAlt,
} from "react-icons/fa";

const MotionSection = motion.section;
const MotionH1 = motion.h1;
const MotionH2 = motion.h2;
const MotionH3 = motion.h3;
const MotionP = motion.p;
const MotionDiv = motion.div;
const MotionButton = motion.button;

export default function AboutPage() {
 const implementationProcess = [
 {
 title: "Research & Discovery",
 description:
 "Deep dive into industry pain points and technological possibilities",
 icon: <FaLightbulb className="text-cyan-400" aria-hidden="true" />,
 },
 {
 title: "System Architecture",
 description:
 "Designing scalable, secure infrastructure for intelligent systems",
 icon: <FaCogs className="text-blue-400" aria-hidden="true" />,
 },
 {
 title: "AI Model Development",
 description:
 "Building specialized models for targeted industry applications",
 icon: <FaChartLine className="text-purple-400" aria-hidden="true" />,
 },
 {
 title: "Security Integration",
 description:
 "Implementing Zero Trust Architecture and blockchain verification",
 icon: <FaShieldAlt className="text-teal-400" aria-hidden="true" />,
 },
 {
 title: "Deployment & Scaling",
 description:
 "Rolling out solutions with continuous improvement mechanisms",
 icon: <FaGlobeAmericas className="text-green-400" aria-hidden="true" />,
 },
 ];

 // Honor reduced motion (doesn't remove animations—just dials them down)
 const prefersReduced =
 typeof window !== "undefined" &&
 window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

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
 <meta
 property="og:description"
 content="Ethical AI infrastructure for industry transformation."
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
 "https://twitter.com/synexiai",
 ],
 description:
 "Building ethical AI infrastructure for industry transformation.",
 })}
 </script>
 </Helmet>

 {/* Let global background from index.css show through */}
 <Container
 animate
 className="relative overflow-hidden text-gray-900 dark:text-gray-100"
 >
 {/* Decorative blobs (non-interactive, behind content) */}
 <div
 className="pointer-events-none absolute inset-0 overflow-hidden -z-10"
 aria-hidden="true"
 >
 <div className="hidden sm:block absolute top-0 left-1/4 w-[300px] h-[300px] bg-cyan-500/10 rounded-full blur-[60px] md:blur-[100px] animate-float-slow motion-reduce:animate-none" />
 <div className="hidden sm:block absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[120px] animate-float-medium motion-reduce:animate-none" />
 </div>

 {/* Hero */}
 <MotionSection
 id="about-hero"
 aria-labelledby="about-title"
 initial={prefersReduced ? false : { opacity: 0, y: 40 }}
 whileInView={prefersReduced ? {} : { opacity: 1, y: 0 }}
 viewport={{ once: true, margin: "-100px" }}
 transition={{ duration: 0.8 }}
 className="relative text-center py-16 sm:py-20 md:py-28 scroll-mt-[calc(var(--header-h,64px)+16px)]"
 >
 <div
 className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-black/20 to-transparent dark:from-black/60"
 aria-hidden="true"
 />
 <MotionH1
 id="about-title"
 className="text-[clamp(1.75rem,4vw,3.75rem)] font-bold mb-6"
 initial={prefersReduced ? false : { opacity: 0, scale: 0.96 }}
 animate={prefersReduced ? {} : { opacity: 1, scale: 1 }}
 transition={{ delay: 0.1 }}
 >
 <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-teal-500">
 About SynexiAI
 </span>
 </MotionH1>
 <MotionP
 initial={prefersReduced ? false : { opacity: 0 }}
 animate={prefersReduced ? {} : { opacity: 1 }}
 transition={{ delay: 0.3, duration: 0.6 }}
 className="text-lg sm:text-xl md:text-2xl text-gray-700 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed"
 >
 We engineer{" "}
 <span className="text-cyan-600 dark:text-cyan-300 font-medium">
 ethical AI infrastructure
 </span>{" "}
 that transforms industries while protecting fundamental values.
 </MotionP>
 </MotionSection>

 {/* Purpose & Approach (glass panel) */}
 <MotionSection
 id="purpose-approach"
 aria-labelledby="purpose-title"
 initial={prefersReduced ? false : { opacity: 0 }}
 whileInView={prefersReduced ? {} : { opacity: 1 }}
 viewport={{ once: true, margin: "-100px" }}
 transition={{ duration: 0.8 }}
 className="mb-24 relative scroll-mt-[calc(var(--header-h,64px)+16px)]"
 >
 <div className="rounded-3xl p-4 sm:p-8 md:p-12 border border-white/10 bg-white/5 shadow-2xl shadow-cyan-500/10">
 <MotionH2
 id="purpose-title"
 className="text-[clamp(1.5rem,3.5vw,2.25rem)] font-bold text-center mb-12"
 initial={prefersReduced ? false : { opacity: 0, y: 20 }}
 whileInView={prefersReduced ? {} : { opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ delay: 0.2 }}
 >
 <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">
 Our Purpose & Approach
 </span>
 </MotionH2>

 <MotionDiv
 className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-16"
 initial={prefersReduced ? false : { opacity: 0 }}
 whileInView={prefersReduced ? {} : { opacity: 1 }}
 viewport={{ once: true }}
 transition={{ duration: 0.6 }}
 >
 <div className="min-w-0">
 <MotionH3
 className="text-2xl font-bold text-cyan-600 dark:text-cyan-300 mb-6 flex items-center"
 initial={prefersReduced ? false : { opacity: 0, x: -20 }}
 whileInView={prefersReduced ? {} : { opacity: 1, x: 0 }}
 viewport={{ once: true }}
 transition={{ delay: 0.3 }}
 >
 <FaHandshake className="mr-3" aria-hidden="true" /> Why We
 Exist
 </MotionH3>
 <MotionP
 className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed"
 initial={prefersReduced ? false : { opacity: 0 }}
 whileInView={prefersReduced ? {} : { opacity: 1 }}
 viewport={{ once: true }}
 transition={{ delay: 0.4 }}
 >
 SynexiAI bridges the gap between cutting-edge AI and
 real-world needs—delivering systems that are powerful,
 ethical, and maintainable.
 </MotionP>
 </div>

 <div className="min-w-0">
 <MotionH3
 className="text-2xl font-bold text-teal-600 dark:text-teal-300 mb-6 flex items-center"
 initial={prefersReduced ? false : { opacity: 0, x: 20 }}
 whileInView={prefersReduced ? {} : { opacity: 1, x: 0 }}
 viewport={{ once: true }}
 transition={{ delay: 0.3 }}
 >
 <FaCogs className="mr-3" aria-hidden="true" /> What Makes Us
 Different
 </MotionH3>
 <MotionP
 className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed"
 initial={prefersReduced ? false : { opacity: 0 }}
 whileInView={prefersReduced ? {} : { opacity: 1 }}
 viewport={{ once: true }}
 transition={{ delay: 0.4 }}
 >
 We design with three pillars:{" "}
 <span className="text-cyan-600 dark:text-cyan-300">
 scalability
 </span>
 ,{" "}
 <span className="text-cyan-600 dark:text-cyan-300">
 security
 </span>
 , and{" "}
 <span className="text-cyan-600 dark:text-cyan-300">
 ethical alignment
 </span>
 —architecting complete cognitive infrastructure, not just
 models.
 </MotionP>
 </div>
 </MotionDiv>

 {/* Implementation Process */}
 <MotionDiv
 initial={prefersReduced ? false : { opacity: 0 }}
 whileInView={prefersReduced ? {} : { opacity: 1 }}
 viewport={{ once: true }}
 transition={{ duration: 0.6 }}
 >
 <h3 className="text-2xl font-semibold text-center text-cyan-600 dark:text-cyan-400 mb-10">
 Our Implementation Process
 </h3>

 {/* Use lg:5 columns to avoid cramped md screens */}
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
 {implementationProcess.map((step, index) => (
 <MotionDiv
 key={step.title}
 initial={prefersReduced ? false : { opacity: 0, y: 20 }}
 whileInView={prefersReduced ? {} : { opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ delay: index * 0.08 }}
 className="rounded-xl p-5 hover:border-cyan-400/30 transition-colors duration-300 h-full flex flex-col"
 >
 <div className="text-3xl mb-3 flex justify-center" aria-hidden="true">
 {step.icon}
 </div>
 <h4 className="font-bold text-center mb-2 min-w-0">{step.title}</h4>
 <p className="text-sm text-gray-700 dark:text-gray-300 text-center">
 {step.description}
 </p>
 </MotionDiv>
 ))}
 </div>
 </MotionDiv>
 </div>
 </MotionSection>

 {/* Core Values */}
 <MotionSection
 id="core-values"
 aria-labelledby="values-title"
 initial={prefersReduced ? false : { opacity: 0 }}
 whileInView={prefersReduced ? {} : { opacity: 1 }}
 viewport={{ once: true, margin: "-100px" }}
 transition={{ duration: 0.8 }}
 className="mb-24 scroll-mt-[calc(var(--header-h,64px)+16px)]"
 >
 <MotionDiv
 initial={prefersReduced ? false : { opacity: 0, y: 20 }}
 whileInView={prefersReduced ? {} : { opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ delay: 0.2 }}
 className="text-center mb-16"
 >
 <h2
 id="values-title"
 className="text-[clamp(1.5rem,3.5vw,2.25rem)] font-bold mb-4"
 >
 <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">
 Our Core Values
 </span>
 </h2>
 <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
 The principles that guide every technical decision we make
 </p>
 </MotionDiv>

 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
 {coreValues.map((value, index) => (
 <ValueCard
 key={value.title ?? index}
 icon={value.icon}
 title={value.title}
 description={value.description}
 delay={index * 0.1}
 highlightColor={index % 2 === 0 ? "cyan" : "teal"}
 className="bg-white/5 border border-white/10 "
 />
 ))}
 </div>
 </MotionSection>

 {/* Team */}
 <MotionSection
 id="team"
 aria-labelledby="team-title"
 initial={prefersReduced ? false : { opacity: 0 }}
 whileInView={prefersReduced ? {} : { opacity: 1 }}
 viewport={{ once: true, margin: "-100px" }}
 transition={{ duration: 0.8 }}
 className="mb-24 scroll-mt-[calc(var(--header-h,64px)+16px)]"
 >
 <div className="rounded-3xl p-4 sm:p-8 md:p-12 shadow-2xl shadow-cyan-500/10">
 <MotionH3
 id="team-title"
 className="text-2xl font-semibold text-center text-cyan-600 dark:text-cyan-400 mb-10"
 initial={prefersReduced ? false : { opacity: 0 }}
 whileInView={prefersReduced ? {} : { opacity: 1 }}
 viewport={{ once: true }}
 transition={{ delay: 0.2 }}
 >
 Our Dedicated Team
 </MotionH3>

 <MotionP
 className="text-center text-gray-700 dark:text-gray-300 max-w-2xl mx-auto mb-12"
 initial={prefersReduced ? false : { opacity: 0 }}
 whileInView={prefersReduced ? {} : { opacity: 1 }}
 viewport={{ once: true }}
 transition={{ delay: 0.3 }}
 >
 We’re a collective of engineers, researchers, and designers united
 by a shared vision for responsible AI implementation.
 </MotionP>

 <MotionDiv
 className="grid sm:grid-cols-3 l:grid-cols-4 gap-3"
 initial={prefersReduced ? false : { opacity: 0 }}
 whileInView={prefersReduced ? {} : { opacity: 1 }}
 viewport={{ once: true }}
 transition={{ duration: 0.6 }}
 >
 {teamMembers.map((member, index) => (
 <TeamMemberCard
 key={member.name ?? index}
 {...member}
 delay={index * 0.1}
 />
 ))}
 </MotionDiv>
 </div>
 </MotionSection>

 {/* CTA */}
 <MotionSection
 id="about-cta"
 aria-labelledby="cta-title"
 initial={prefersReduced ? false : { opacity: 0 }}
 whileInView={prefersReduced ? {} : { opacity: 1 }}
 viewport={{ once: true, margin: "-100px" }}
 transition={{ duration: 0.8 }}
 className="text-center py-16 scroll-mt-[calc(var(--header-h,64px)+16px)]"
 >
 <div className="max-w-4xl mx-auto rounded-3xl p-8 border border-white/10 bg-white/5 shadow-xl shadow-cyan-500/10">
 <MotionH2
 id="cta-title"
 initial={prefersReduced ? false : { opacity: 0, y: 20 }}
 whileInView={prefersReduced ? {} : { opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ delay: 0.2 }}
 className="text-[clamp(1.5rem,3.5vw,2.25rem)] font-bold mb-6"
 >
 <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-teal-400">
 Ready to Transform Your Infrastructure?
 </span>
 </MotionH2>

 <MotionP
 initial={prefersReduced ? false : { opacity: 0 }}
 whileInView={prefersReduced ? {} : { opacity: 1 }}
 viewport={{ once: true }}
 transition={{ delay: 0.4 }}
 className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed"
 >
 Discover how our AI implementation framework can future-proof your
 organization.
 </MotionP>

 <MotionDiv
 initial={prefersReduced ? false : { opacity: 0 }}
 whileInView={prefersReduced ? {} : { opacity: 1 }}
 viewport={{ once: true }}
 transition={{ delay: 0.6 }}
 className="flex flex-wrap justify-center gap-4"
 >
 <Link to="/contact" aria-label="Request a consultation">
 <MotionButton
 whileHover={{ scale: prefersReduced ? 1 : 1.05 }}
 whileTap={{ scale: prefersReduced ? 1 : 0.95 }}
 className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-teal-500 text-black font-semibold rounded-xl hover:shadow-lg hover:shadow-cyan-500/30 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
 >
 Request Consultation
 </MotionButton>
 </Link>

 {/* If /solutions isn't a real route yet, change this to /projects */}
 <Link to="/solutions" aria-label="Explore SynexiAI solutions">
 <MotionButton
 whileHover={{ scale: prefersReduced ? 1 : 1.05 }}
 whileTap={{ scale: prefersReduced ? 1 : 0.95 }}
 className="px-8 py-4 bg-gray-900 dark:bg-gray-800 hover:bg-gray-800/90 text-white font-semibold rounded-xl border border-gray-700 hover:border-gray-600 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
 >
 Explore Solutions
 </MotionButton>
 </Link>
 </MotionDiv>
 </div>
 </MotionSection>
 </Container>
 </>
 );
}
