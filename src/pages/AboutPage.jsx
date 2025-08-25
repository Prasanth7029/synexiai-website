// src/pages/AboutPage.jsx
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

  // Respect reduced motion
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

      {/* Container: reduce default paddings on mobile; scale up from sm/md */}
      <Container
        animate
        className="relative overflow-hidden text-gray-900 dark:text-gray-100 px-3 sm:px-4 md:px-6"
      >
        {/* Decorative blobs */}
        <div
          className="pointer-events-none absolute inset-0 overflow-hidden -z-10"
          aria-hidden="true"
        >
          <div className="hidden sm:block absolute top-0 left-1/4 w-[240px] h-[240px] md:w-[300px] md:h-[300px] bg-cyan-500/10 rounded-full blur-[48px] md:blur-[100px] animate-float-slow motion-reduce:animate-none" />
          <div className="hidden sm:block absolute bottom-0 right-1/4 w-[300px] h-[300px] md:w-[400px] md:h-[400px] bg-blue-500/10 rounded-full blur-[90px] md:blur-[120px] animate-float-medium motion-reduce:animate-none" />
        </div>

        {/* HERO — very small on mobile, larger later */}
        <MotionSection
          id="about-hero"
          aria-labelledby="about-title"
          initial={prefersReduced ? false : { opacity: 0, y: 40 }}
          whileInView={prefersReduced ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="relative text-center py-10 sm:py-16 md:py-24 scroll-mt-[calc(var(--header-h,64px)+12px)]"
        >
          <div
            className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-black/15 to-transparent dark:from-black/50"
            aria-hidden="true"
          />
          <MotionH1
            id="about-title"
            className="font-bold mb-3 text-[clamp(1.25rem,5.2vw,3.25rem)]"
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
            className="mx-auto leading-relaxed text-[12.5px] sm:text-[14px] md:text-[18px] text-gray-700 dark:text-gray-300 max-w-[58ch]"
          >
            We engineer{" "}
            <span className="text-cyan-600 dark:text-cyan-300 font-medium">
              ethical AI infrastructure
            </span>{" "}
            that transforms industries while protecting fundamental values.
          </MotionP>
        </MotionSection>

        {/* PURPOSE & APPROACH */}
        <MotionSection
          id="purpose-approach"
          aria-labelledby="purpose-title"
          initial={prefersReduced ? false : { opacity: 0 }}
          whileInView={prefersReduced ? {} : { opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="mb-16 sm:mb-20 md:mb-24 relative scroll-mt-[calc(var(--header-h,64px)+12px)]"
        >
          <div className="rounded-2xl sm:rounded-3xl p-3 sm:p-6 md:p-10 border border-[var(--border-color)] bg-[var(--card-bg)]/60 shadow-2xl shadow-cyan-500/10">
            <MotionH2
              id="purpose-title"
              className="font-bold text-center mb-8 sm:mb-10 md:mb-12 text-[clamp(1.1rem,4vw,2.1rem)]"
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
              className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-8 md:gap-12 mb-10 md:mb-16"
              initial={prefersReduced ? false : { opacity: 0 }}
              whileInView={prefersReduced ? {} : { opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="min-w-0">
                <MotionH3
                  className="flex items-center text-cyan-600 dark:text-cyan-300 mb-3 sm:mb-4 text-[15px] sm:text-[17px] md:text-2xl font-bold"
                  initial={prefersReduced ? false : { opacity: 0, x: -20 }}
                  whileInView={prefersReduced ? {} : { opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                >
                  <FaHandshake className="mr-2 sm:mr-3 text-[14px] sm:text-[18px]" aria-hidden="true" />
                  Why We Exist
                </MotionH3>
                <MotionP
                  className="text-[12.5px] sm:text-[14px] md:text-[18px] text-gray-700 dark:text-gray-300 leading-relaxed"
                  initial={prefersReduced ? false : { opacity: 0 }}
                  whileInView={prefersReduced ? {} : { opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                >
                  SynexiAI bridges the gap between cutting-edge AI and
                  real-world needs—delivering systems that are powerful, ethical,
                  and maintainable.
                </MotionP>
              </div>

              <div className="min-w-0">
                <MotionH3
                  className="flex items-center text-teal-600 dark:text-teal-300 mb-3 sm:mb-4 text-[15px] sm:text-[17px] md:text-2xl font-bold"
                  initial={prefersReduced ? false : { opacity: 0, x: 20 }}
                  whileInView={prefersReduced ? {} : { opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                >
                  <FaCogs className="mr-2 sm:mr-3 text-[14px] sm:text-[18px]" aria-hidden="true" />
                  What Makes Us Different
                </MotionH3>
                <MotionP
                  className="text-[12.5px] sm:text-[14px] md:text-[18px] text-gray-700 dark:text-gray-300 leading-relaxed"
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
                  </span>{" "}
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
              <h3 className="text-center mb-6 sm:mb-8 text-cyan-600 dark:text-cyan-400 font-semibold text-[15px] sm:text-[18px] md:text-2xl">
                Our Implementation Process
              </h3>

              {/* 2 on phones → 3 on md → 5 on lg (keeps your custom grid-2-3) */}
              <div className="grid-2-3 lg:grid-cols-5 auto-rows-fr gap-2.5 sm:gap-4 md:gap-6">
                {implementationProcess.map((step, index) => (
                  <div key={step.title} className="min-w-0">
                    <MotionDiv
                      initial={prefersReduced ? false : { opacity: 0, y: 20 }}
                      whileInView={prefersReduced ? {} : { opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.08 }}
                      className="rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 h-full flex flex-col border border-[var(--border-color)] bg-[var(--card-bg)]/60 hover:border-cyan-400/30 transition-colors duration-300"
                    >
                      <div
                        className="mb-2 sm:mb-3 flex justify-center text-[22px] sm:text-3xl"
                        aria-hidden="true"
                      >
                        {step.icon}
                      </div>
                      <h4 className="font-bold text-center mb-1.5 sm:mb-2 min-w-0 text-[12.5px] sm:text-[15px] md:text-[18px]">
                        {step.title}
                      </h4>
                      <p className="text-center leading-snug text-[11.5px] sm:text-[13.5px] md:text-[14.5px] text-gray-700 dark:text-gray-300">
                        {step.description}
                      </p>
                    </MotionDiv>
                  </div>
                ))}
              </div>
            </MotionDiv>
          </div>
        </MotionSection>

        {/* CORE VALUES */}
        <MotionSection
          id="core-values"
          aria-labelledby="values-title"
          initial={prefersReduced ? false : { opacity: 0 }}
          whileInView={prefersReduced ? {} : { opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="mb-16 sm:mb-20 md:mb-24 scroll-mt-[calc(var(--header-h,64px)+12px)]"
        >
          <MotionDiv
            initial={prefersReduced ? false : { opacity: 0, y: 20 }}
            whileInView={prefersReduced ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-center mb-8 sm:mb-12"
          >
            <h2
              id="values-title"
              className="font-bold mb-2 sm:mb-4 text-[clamp(1.1rem,4vw,2.1rem)]"
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">
                Our Core Values
              </span>
            </h2>
            <p className="mx-auto text-[12.5px] sm:text-[14px] md:text-[18px] text-gray-600 dark:text-gray-400 max-w-[60ch]">
              The principles that guide every technical decision we make
            </p>
          </MotionDiv>

          <div className="grid-2-3 lg:grid-cols-4 auto-rows-fr gap-2.5 sm:gap-4 md:gap-6">
            {coreValues.map((value, index) => (
              <div key={value.title ?? index} className="min-w-0">
                <ValueCard
                  icon={value.icon}
                  title={value.title}
                  description={value.description}
                  delay={index * 0.1}
                  highlightColor={index % 2 === 0 ? "cyan" : "teal"}
                  className="bg-white/5 border border-white/10 p-3 sm:p-4 md:p-6 text-[12px] sm:text-[13.5px] md:text-[15px]"
                />
              </div>
            ))}
          </div>
        </MotionSection>

        {/* TEAM */}
        <MotionSection
          id="team"
          aria-labelledby="team-title"
          initial={prefersReduced ? false : { opacity: 0 }}
          whileInView={prefersReduced ? {} : { opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="mb-16 sm:mb-20 md:mb-24 scroll-mt-[calc(var(--header-h,64px)+12px)]"
        >
          <div className="rounded-2xl sm:rounded-3xl p-3 sm:p-6 md:p-10 shadow-2xl shadow-cyan-500/10 bg-[var(--card-bg)]/0">
            <MotionH3
              id="team-title"
              className="text-center text-cyan-600 dark:text-cyan-400 mb-6 sm:mb-8 font-semibold text-[15px] sm:text-[18px] md:text-2xl"
              initial={prefersReduced ? false : { opacity: 0 }}
              whileInView={prefersReduced ? {} : { opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              Our Dedicated Team
            </MotionH3>

            <MotionP
              className="text-center mx-auto mb-8 sm:mb-12 text-[12.5px] sm:text-[14px] md:text-[18px] text-gray-700 dark:text-gray-300 max-w-[60ch]"
              initial={prefersReduced ? false : { opacity: 0 }}
              whileInView={prefersReduced ? {} : { opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              We’re a collective of engineers, researchers, and designers united
              by a shared vision for responsible AI implementation.
            </MotionP>

            <MotionDiv
              className="grid-2-3 lg:grid-cols-4 auto-rows-fr gap-2.5 sm:gap-4 md:gap-6"
              initial={prefersReduced ? false : { opacity: 0 }}
              whileInView={prefersReduced ? {} : { opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {teamMembers.map((member, index) => (
                <div key={member.name ?? index} className="min-w-0">
                  <TeamMemberCard
                    {...member}
                    delay={index * 0.1}
                    className="p-3 sm:p-4 md:p-6 text-[12px] sm:text-[13.5px] md:text-[15px]"
                  />
                </div>
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
          className="text-center py-12 sm:py-14 md:py-16 scroll-mt-[calc(var(--header-h,64px)+12px)]"
        >
          <div className="max-w-4xl mx-auto rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border border-[var(--border-color)] bg-[var(--card-bg)]/60 shadow-xl shadow-cyan-500/10">
            <MotionH2
              id="cta-title"
              initial={prefersReduced ? false : { opacity: 0, y: 20 }}
              whileInView={prefersReduced ? {} : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="font-bold mb-4 sm:mb-6 text-[clamp(1.1rem,4vw,2.1rem)]"
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
              className="mx-auto mb-7 sm:mb-10 leading-relaxed text-[12.5px] sm:text-[14px] md:text-[18px] text-gray-700 dark:text-gray-300 max-w-[60ch]"
            >
              Discover how our AI implementation framework can future-proof your
              organization.
            </MotionP>

            <MotionDiv
              initial={prefersReduced ? false : { opacity: 0 }}
              whileInView={prefersReduced ? {} : { opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex flex-wrap justify-center gap-3 sm:gap-4"
            >
              <Link to="/contact" aria-label="Request a consultation">
                <MotionButton
                  whileHover={{ scale: prefersReduced ? 1 : 1.04 }}
                  whileTap={{ scale: prefersReduced ? 1 : 0.96 }}
                  className="px-4 py-2.5 sm:px-6 sm:py-3 md:px-8 md:py-4 bg-gradient-to-r from-cyan-500 to-teal-500 text-black font-semibold rounded-lg sm:rounded-xl hover:shadow-lg hover:shadow-cyan-500/30 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 text-[12.5px] sm:text-[14px] md:text-[15px]"
                >
                  Request Consultation
                </MotionButton>
              </Link>

              {/* If /solutions isn't a real route yet, change to /portfolio */}
              <Link to="/solutions" aria-label="Explore SynexiAI solutions">
                <MotionButton
                  whileHover={{ scale: prefersReduced ? 1 : 1.04 }}
                  whileTap={{ scale: prefersReduced ? 1 : 0.96 }}
                  className="px-4 py-2.5 sm:px-6 sm:py-3 md:px-8 md:py-4 bg-gray-900 dark:bg-gray-800 hover:bg-gray-800/90 text-white font-semibold rounded-lg sm:rounded-xl border border-gray-700 hover:border-gray-600 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 text-[12.5px] sm:text-[14px] md:text-[15px]"
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
