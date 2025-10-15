// src/components/Container.jsx
import React from "react";
import { motion } from "framer-motion";

/**
 * SynexiAI Container
 * - Provides a consistent centered layout on all screens (13–17″ laptops)
 * - Supports optional entrance animation via Framer Motion
 * - Works seamlessly with Tailwind container settings (tailwind.config.js)
 */

export default function Container({
  children,
  animate = false,
  className = "",
}) {
  const Wrapper = animate ? motion.div : "div";

  return (
    <Wrapper
      className={`w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`}
      {...(animate && {
        initial: { opacity: 0, y: 30 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, ease: "easeOut" },
      })}
    >
      {children}
    </Wrapper>
  );
}
