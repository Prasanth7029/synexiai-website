import React from "react";
import { motion } from "framer-motion";

export default function ValueCard({ icon, title, description, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay / 1000, duration: 0.5 }}
      className="bg-gray-900/60 rounded-xl p-6 text-center border border-cyan-500/10 shadow-lg hover:shadow-cyan-400/10 transition-shadow duration-300"
    >
      <div className="mb-4 text-cyan-300 flex justify-center">{icon}</div>
      <h4 className="text-lg font-semibold text-cyan-200 mb-2">{title}</h4>
      <p className="text-sm text-gray-300">{description}</p>
    </motion.div>
  );
}
