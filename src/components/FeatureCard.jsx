// components/FeatureCard.jsx
import { motion } from "framer-motion";

export default function FeatureCard({ icon, title, description, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      viewport={{ once: true }}
      className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-cyan-500/20 border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:-translate-y-2"
    >
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400">{description}</p>
    </motion.div>
  );
}