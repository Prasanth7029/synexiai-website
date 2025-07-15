import React from "react";
import { motion } from "framer-motion";

export default function Container({ children, animate = false, className = "" }) {
  const Wrapper = animate ? motion.div : "div";

  return (
    <Wrapper
      className={`w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`}
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
