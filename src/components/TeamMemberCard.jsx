import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaLinkedin, FaGithub, FaTwitter, FaEnvelope } from "react-icons/fa";

export default function TeamMemberCard({
  name,
  role,
  bio,
  expertise,
  image,
  socialLinks = {},
  delay = 0
}) {
  const [isHovered, setIsHovered] = useState(false);

  const socialIcons = {
    linkedin: <FaLinkedin className="text-[#0A66C2]" />,
    github: <FaGithub className="text-gray-300" />,
    twitter: <FaTwitter className="text-[#1DA1F2]" />,
    email: <FaEnvelope className="text-cyan-400" />
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay * 0.1, duration: 0.5 }}
      whileHover={{ y: -5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative bg-gradient-to-b from-gray-900/50 to-gray-900/80 rounded-2xl p-6 border border-cyan-500/20 shadow-lg hover:shadow-cyan-500/30 transition-all duration-300 overflow-hidden group"
    >
      {/* Animated background effect */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 0.1 : 0 }}
        className="absolute inset-0 bg-gradient-to-br from-cyan-500/30 to-purple-500/30 -z-10 transition-opacity duration-500"
      />

      {/* Glow effect */}
      <div className="absolute -inset-1 bg-cyan-500/10 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-20" />

      <div className="flex flex-col items-center text-center">
        {/* Profile image with animation */}
        <motion.div
          animate={{
            scale: isHovered ? 1.05 : 1,
            boxShadow: isHovered ? "0 10px 25px -5px rgba(34, 211, 238, 0.3)" : "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
          }}
          className="relative w-32 h-32 mb-4 rounded-full overflow-hidden border-4 border-cyan-500/30 shadow-lg"
        >
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/assets/team/placeholder.jpg";
            }}
          />
          {/* Status indicator */}
          <div className="absolute bottom-1 right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900" />
        </motion.div>

        {/* Name and role */}
        <h3 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
          {name}
        </h3>
        <p className="text-sm text-cyan-300 font-medium mt-1">{role}</p>

        {/* Bio with animated underline */}
        <motion.p
          className="relative text-sm text-gray-300 mt-3 pb-1"
        >
          {bio}
          <motion.span
            className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-cyan-400"
            animate={{
              width: isHovered ? "60%" : "0%",
              left: isHovered ? "20%" : "50%"
            }}
            transition={{ duration: 0.4 }}
          />
        </motion.p>

        {/* Expertise section */}
        <div className="mt-4 w-full">
          <h4 className="text-xs font-semibold text-cyan-300 mb-2 uppercase tracking-wider">
            Expertise
          </h4>
          <div className="flex flex-wrap justify-center gap-2">
            {expertise.map((skill, index) => (
              <motion.span
                key={index}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 + (index * 0.05) }}
                className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-gray-800 text-cyan-300 border border-cyan-500/20"
              >
                {skill}
              </motion.span>
            ))}
          </div>
        </div>

        {/* Social links */}
        {Object.keys(socialLinks).length > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-800/50 w-full">
            <div className="flex justify-center gap-4">
              {Object.entries(socialLinks).map(([platform, url]) => (
                <motion.a
                  key={platform}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -3, scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="text-xl p-2 rounded-full bg-gray-800/50 hover:bg-gray-700/50 transition-colors duration-300"
                  aria-label={`${name}'s ${platform}`}
                >
                  {socialIcons[platform]}
                </motion.a>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}