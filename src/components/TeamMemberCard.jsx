// src/components/TeamMemberCard.jsx
import React, { useState, useMemo } from "react";
import { FaLinkedin, FaGithub, FaTwitter, FaEnvelope } from "react-icons/fa";
import { motion } from "framer-motion";

const MotionDiv = motion.div;
const MotionSpan = motion.span;
const MotionP = motion.p;
const MotionA = motion.a;

export default function TeamMemberCard({
  name,
  role,
  bio,
  expertise = [],
  image,
  socialLinks = {},
  delay = 0,
  className = "",
}) {
  const [isHovered, setIsHovered] = useState(false);

  const icons = useMemo(
    () => ({
      linkedin: <FaLinkedin aria-hidden="true" />,
      github: <FaGithub aria-hidden="true" />,
      twitter: <FaTwitter aria-hidden="true" />,
      email: <FaEnvelope aria-hidden="true" />,
    }),
    []
  );

  const allowed = new Set(["linkedin", "github", "twitter", "email"]);
  const entries = Object.entries(socialLinks).filter(([p, url]) => allowed.has(p) && !!url);

  const normalize = (p, url) => (p === "email" && url && !/^mailto:/i.test(url) ? `mailto:${url}` : url);

  // cap chips so rows stay even (adjust numbers if you want)
  const chips = expertise.filter(Boolean).slice(0, 5);

  return (
    <MotionDiv
      role="article"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay: delay * 0.1, duration: 0.5 }}
      whileHover={{ y: -4 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={[
        "relative overflow-hidden group",
        "h-full flex flex-col",                              // ⬅️ allow bottom section to pin to bottom
        "rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)]/60",
        "shadow-sm hover:shadow-cyan-500/20 transition-all duration-300",
        // 🔒 consistent height across rows
        "min-h-[360px] md:min-h-[380px] lg:min-h-[400px]",
        "p-3 sm:p-4 md:p-6",
        className,
      ].join(" ")}
    >
      {/* subtle glow */}
      <MotionDiv
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-cyan-500/15 to-purple-500/15"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 0.12 : 0 }}
        transition={{ duration: 0.35 }}
      />

      <div className="flex flex-col items-center text-center text-gray-900 dark:text-gray-100">
        {/* avatar */}
        <MotionDiv
          animate={{
            scale: isHovered ? 1.04 : 1,
            boxShadow: isHovered
              ? "0 10px 24px -6px rgba(34,211,238,0.28)"
              : "0 4px 10px -4px rgba(0,0,0,0.15)",
          }}
          className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 mb-3 sm:mb-4 rounded-full overflow-hidden border border-white/15 bg-white/10"
        >
          <img
            src={image || "/assets/team/placeholder.jpg"}
            alt={`${name} — ${role}`}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "/assets/team/placeholder.jpg"; }}
          />
          <span aria-hidden="true" className="absolute bottom-1.5 right-1.5 w-3 h-3 rounded-full bg-green-500 border-2 border-[var(--card-bg)]" />
        </MotionDiv>

        {/* name/role */}
        <h3 className="text-[clamp(14px,3.6vw,18px)] font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-teal-400">
          {name}
        </h3>
        <p className="text-[12px] sm:text-[13px] text-cyan-600 dark:text-cyan-300 font-medium mt-1">
          {role}
        </p>

        {/* bio (clamped to keep heights even) */}
        {bio && (
          <MotionP className="relative text-[clamp(12px,3.4vw,14px)] text-gray-700 dark:text-gray-300 mt-3 pb-1 leading-snug line-clamp-4 md:line-clamp-5">
            {bio}
          </MotionP>
        )}

        {/* expertise chips (capped) */}
        {chips.length > 0 && (
          <div className="mt-4 w-full">
            <h4 className="text-[11px] font-semibold text-cyan-600 dark:text-cyan-300 mb-2 uppercase tracking-wider">
              Expertise
            </h4>
            <div className="flex flex-wrap justify-center gap-2">
              {chips.map((skill, i) => (
                <MotionSpan
                  key={`${skill}-${i}`}
                  initial={{ scale: 0.92, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.08 + i * 0.05 }}
                  className="inline-block px-2.5 py-1 text-[11px] font-medium rounded-full text-cyan-400 bg-white/5 border border-white/10"
                >
                  {skill}
                </MotionSpan>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* social row pinned to bottom so all cards end evenly */}
      {entries.length > 0 && (
        <div className="mt-auto pt-3 w-full border-t border-white/10">
          <div className="flex justify-center gap-2.5">
            {entries.map(([platform, url]) => (
              <MotionA
                key={platform}
                href={normalize(platform, url)}
                target={platform === "email" ? undefined : "_blank"}
                rel={platform === "email" ? undefined : "noopener noreferrer"}
                whileHover={{ y: -2, scale: 1.08 }}
                whileTap={{ scale: 0.94 }}
                className="text-lg p-1.5 sm:p-2 rounded-full hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                aria-label={`${name} on ${platform}`}
                title={`${name} on ${platform}`}
              >
                <span
                  className={
                    platform === "linkedin" ? "text-[#0A66C2]"
                    : platform === "twitter" ? "text-[#1DA1F2]"
                    : platform === "github" ? "text-gray-300"
                    : "text-cyan-400"
                  }
                >
                  {icons[platform]}
                </span>
              </MotionA>
            ))}
          </div>
        </div>
      )}
    </MotionDiv>
  );
}
