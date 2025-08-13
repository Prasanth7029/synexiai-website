import React from "react";
import { motion } from "framer-motion";

export default function Testimonials({ items = [] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {items.map((t, i) => (
        <motion.blockquote
          key={i}
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, delay: i * 0.05 }}
          className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-5 shadow-lg shadow-cyan-500/10"
        >
          <p className="text-base leading-relaxed text-gray-200">“{t.quote}”</p>
          <footer className="mt-4 text-sm opacity-80">
            <span className="font-semibold">{t.author}</span> — {t.role}
          </footer>
        </motion.blockquote>
      ))}
    </div>
  );
}
