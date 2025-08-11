import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { FaLinkedin, FaGithub, FaTwitter, FaEnvelope } from "react-icons/fa";

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

  const allowedPlatforms = new Set(["linkedin", "github", "twitter", "email"]);
  const entries = Object.entries(socialLinks).filter(([p, url]) => allowedPlatforms.has(p) && !!url);

  const normalizeSocial = (platform, url) =>
    platform === "email" && url && !/^mailto:/i.test(url) ? `mailto:${url}` : url;

  const base =
    "relative rounded-2xl p-6 border border-white/10 bg-white/5 backdrop-blur-md " +
    "shadow-lg hover:shadow-cyan-500/30 transition-all duration-300 overflow-hidden group";

  return (
    <motion.div
      role="article"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: delay * 0.1, duration: 0.5 }}
      viewport={{ once: true, amount: 0.2 }}
      whileHover={{ y: -5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`${base} ${className}`}
    >
      {/* Decorative glow layers (non-interactive, behind content) */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-cyan-500/20 to-purple-500/20"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 0.12 : 0 }}
        transition={{ duration: 0.4 }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-1 bg-cyan-500/10 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-20"
      />

      <div className="flex flex-col items-center text-center text-gray-900 dark:text-gray-100">
        {/* Avatar */}
        <motion.div
          animate={{
            scale: isHovered ? 1.05 : 1,
            boxShadow: isHovered
              ? "0 10px 25px -5px rgba(34, 211, 238, 0.30)"
              : "0 4px 6px -1px rgba(0,0,0,0.10)",
          }}
          className="relative w-32 h-32 mb-4 rounded-full overflow-hidden border border-white/20 bg-white/10"
        >
          <img
            src={image}
            alt={`${name} — ${role}`}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "/assets/team/placeholder.jpg";
            }}
          />
          {/* Online dot (decorative) */}
          <span
            aria-hidden="true"
            className="absolute bottom-1 right-1 w-3 h-3 rounded-full bg-green-500 border-2 border-gray-900"
          />
        </motion.div>

        {/* Name / role */}
        <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-teal-400">
          {name}
        </h3>
        <p className="text-sm text-cyan-600 dark:text-cyan-300 font-medium mt-1">
          {role}
        </p>

        {/* Bio with animated underline */}
        {bio && (
          <motion.p className="relative text-sm text-gray-700 dark:text-gray-300 mt-3 pb-1">
            {bio}
            <motion.span
              aria-hidden="true"
              className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-cyan-400"
              animate={{
                width: isHovered ? "60%" : "0%",
                left: isHovered ? "20%" : "50%",
              }}
              transition={{ duration: 0.35 }}
            />
          </motion.p>
        )}

        {/* Expertise */}
        {expertise.filter(Boolean).length > 0 && (
          <div className="mt-4 w-full">
            <h4 className="text-xs font-semibold text-cyan-600 dark:text-cyan-300 mb-2 uppercase tracking-wider">
              Expertise
            </h4>
            <div className="flex flex-wrap justify-center gap-2">
              {expertise.filter(Boolean).map((skill, index) => (
                <motion.span
                  key={`${skill}-${index}`}
                  initial={{ scale: 0.9, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.08 + index * 0.05 }}
                  className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-white/5 border border-white/10 backdrop-blur-sm text-cyan-400"
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </div>
        )}

        {/* Social */}
        {entries.length > 0 && (
          <div className="mt-6 pt-4 w-full border-t border-white/10">
            <div className="flex justify-center gap-3">
              {entries.map(([platform, url]) => (
                <motion.a
                  key={platform}
                  href={normalizeSocial(platform, url)}
                  target={platform === "email" ? undefined : "_blank"}
                  rel={platform === "email" ? undefined : "noopener noreferrer"}
                  whileHover={{ y: -3, scale: 1.1 }}
                  whileTap={{ scale: 0.94 }}
                  className="text-xl p-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                  aria-label={`${name} on ${platform}`}
                  title={`${name} on ${platform}`}
                >
                  <span className="sr-only">{platform}</span>
                  <span
                    className={
                      platform === "linkedin"
                        ? "text-[#0A66C2]"
                        : platform === "twitter"
                        ? "text-[#1DA1F2]"
                        : platform === "github"
                        ? "text-gray-300"
                        : "text-cyan-400"
                    }
                  >
                    {icons[platform]}
                  </span>
                </motion.a>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
