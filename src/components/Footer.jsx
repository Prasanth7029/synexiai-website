import React from "react";
import { Link, NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaGithub,
  FaLinkedin,
  FaGlobe,
  FaTwitter,
  FaDiscord,
} from "react-icons/fa";
import { SiNotion } from "react-icons/si";
import VisitorsBar from "./VisitorsBar.jsx";

const MotionDiv = motion.div;
const MotionLi = motion.li;
const MotionA = motion.a;

export default function Footer() {
  const year = new Date().getFullYear();
  const headingId = "site-footer-heading-nav";

  const socialLinks = [
    { icon: <FaGithub />,  url: "https://github.com/synexiai",           label: "GitHub" },
    { icon: <FaLinkedin />, url: "https://www.linkedin.com/company/synexisai", label: "LinkedIn" },
    { icon: <FaGlobe />,   url: "https://www.synexiai.online",           label: "Website" },
    { icon: <FaTwitter />, url: "https://twitter.com/synexiai",          label: "Twitter" },
    { icon: <FaDiscord />, url: "https://discord.gg/synexiai",           label: "Discord" },
    { icon: <SiNotion />,  url: "https://synexiai.notion.site",          label: "Notion" },
  ];

  // Use /portfolio instead of /projects (App.jsx redirects anyway)
  const navLinks = [
    { label: "Home",     path: "/" },
    { label: "About",    path: "/about" },
    { label: "Portfolio",path: "/portfolio" },
    { label: "Vision",   path: "/vision" },
    { label: "Tech",     path: "/tech" },
    { label: "Contact",  path: "/contact" },
    { label: "Games", path: "/games" },
    { label: "AI News", path: "/ai-news" },
  ];

  return (
    <footer
      className="relative  from-black to-[#0a0a0a]   pt-20 pb-12 px-6 overflow-hidden border-t border-cyan-500/20"
      aria-labelledby={headingId}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-cyan-400/10 rounded-full blur-[100px] animate-float-slow" />
        <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-teal-500/10 rounded-full blur-[120px] animate-float-medium" />
        <div className="absolute top-1/3 right-1/3 w-[200px] h-[200px] bg-purple-500/10 rounded-full blur-[80px] animate-float-fast" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Visitors / Updated Bar */}
        <VisitorsBar className="mb-10" />

        {/* Main Content */}
        <MotionDiv
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-16"
        >
          {/* Brand Column */}
          <div className="md:col-span-4">
            <MotionDiv
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="text-3xl font-bold tracking-tight mb-4"
            >
              <Link
                to="/"
                data-prefetch="/"
                className="bg-gradient-to-r from-cyan-400 to-teal-500 bg-clip-text text-transparent inline-block focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-black rounded"
              >
                SynexiAI
              </Link>
            </MotionDiv>
            <p className="text-gray-400 text-sm max-w-xs">
              Building the future of AI-powered solutions through innovative
              technology and visionary thinking.
            </p>
          </div>

          {/* Navigation Column */}
          <nav className="md:col-span-4" aria-label="Footer Navigation">
            <h3
              id={headingId}
              className="text-cyan-400 font-semibold mb-4 text-sm uppercase tracking-wider"
            >
              Navigation
            </h3>
            <ul className="space-y-3">
              {navLinks.map((link, index) => (
                <MotionLi
                  key={link.label}
                  initial={{ x: -20, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                  viewport={{ once: true }}
                >
                  <NavLink
                    to={link.path}
                    data-prefetch={link.path}
                    className={({ isActive }) =>
                      [
                        "text-sm flex items-center group transition-colors duration-300",
                        isActive ? "text-cyan-400" : "text-gray-300 hover:text-cyan-400",
                      ].join(" ")
                    }
                  >
                    <span className="w-1 h-1 bg-cyan-400 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    {link.label}
                  </NavLink>
                </MotionLi>
              ))}
            </ul>
          </nav>

          {/* Connect Column */}
          <div className="md:col-span-4">
            <h3 className="text-cyan-400 font-semibold mb-4 text-sm uppercase tracking-wider">
              Connect
            </h3>
            <div className="flex flex-wrap gap-3" role="list" aria-label="Social links">
              {socialLinks.map((social, index) => (
                <MotionA
                  key={`${social.label}-${index}`}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.05, type: "spring", stiffness: 300 }}
                  viewport={{ once: true }}
                  className="w-10 h-10 rounded-full bg-gray-900/50 border border-gray-800 flex items-center justify-center text-gray-300 hover:text-cyan-400 hover:border-cyan-400/30 transition-all duration-300 group relative overflow-hidden"
                  aria-label={social.label}
                >
                  <span className="relative z-10">{social.icon}</span>
                  <span className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </MotionA>
              ))}
            </div>
          </div>
        </MotionDiv>

        {/* Divider */}
        <div className="border-t border-gray-800/50 my-8" />

        {/* Bottom Section */}
        <MotionDiv
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm"
        >
          <div className="text-gray-500">
            © {year} SynexiAI. All rights reserved.
          </div>

          <div className="flex gap-6 text-gray-500">
            <Link to="/privacy" data-prefetch="/privacy" className="hover:text-cyan-400 transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" data-prefetch="/terms" className="hover:text-cyan-400 transition-colors">
              Terms of Service
            </Link>
            <Link to="/cookie-policy" data-prefetch="/cookie-policy" className="hover:text-cyan-400 transition-colors">
              Cookie Policy
            </Link>
          </div>
        </MotionDiv>
      </div>

      {/* Floating Particles */}
      {[...Array(15)].map((_, i) => (
        <MotionDiv
          key={i}
          className="absolute rounded-full bg-cyan-400/20 pointer-events-none"
          initial={{
            x: Math.random() * 100 - 50,
            y: Math.random() * 100 - 50,
            width: Math.random() * 4 + 1,
            height: Math.random() * 4 + 1,
            opacity: Math.random() * 0.5 + 0.1,
          }}
          animate={{
            y: [0, Math.random() * 60 - 30],
            opacity: [0.2, 0.8, 0.2],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        />
      ))}
    </footer>
  );
}
