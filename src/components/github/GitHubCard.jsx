import React from "react";
import { motion } from "framer-motion";

const MotionDiv = motion.div;

function getLanguageColor(language) {
  const colors = {
    JavaScript: "#f1e05a",
    Java: "#b07219",
    Python: "#3572A5",
    HTML: "#e34c26",
    CSS: "#563d7c",
    TypeScript: "#2b7489",
    Shell: "#89e051",
    "Jupyter Notebook": "#DA5B0B",
  };
  return colors[language] || "#ccc";
}

function formatDate(date) {
  try {
    return new Date(date).toLocaleDateString(undefined, {
      year: "numeric", month: "short", day: "numeric",
    });
  } catch {
    return "—";
  }
}

export default function GitHubCard({ repo, index, onExplain }) {
  return (
    <MotionDiv
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      whileHover={{ y: -5 }}
      className="rounded-xl p-3 sm:p-6 border border-white/10 bg-white/5 shadow-lg hover:shadow-cyan-500/20 transition-all h-full xs-card"
    >
      <div className="flex justify-between items-start mb-2.5 gap-2 min-w-0">
        <h3 className="text-[13.5px] sm:text-xl font-semibold text-cyan-400 min-w-0 leading-tight">
          <a
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline break-words line-clamp-2"
          >
            {repo.name}
          </a>
        </h3>
        <span className="xs-text shrink-0">{formatDate(repo.updated_at)}</span>
      </div>

      <p className="mb-2 sm:mb-3 line-clamp-2 text-[12px] sm:text-[14px] xs-hide">
        {repo.description || "No description provided"}
      </p>

      {repo.language && (
        <div className="flex items-center gap-2 mb-2">
          <span
            className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full"
            style={{ backgroundColor: getLanguageColor(repo.language) }}
            aria-hidden="true"
          />
          <span className="xs-text">{repo.language}</span>
        </div>
      )}

      <div className="mt-3 sm:mt-4 flex items-center justify-between">
        <div className="mt-auto flex gap-3 xs-text text-gray-400">
          <span>⭐ {repo.stargazers_count}</span>
          <span>🔀 {repo.forks_count}</span>
          <span>👁️ {repo.watchers_count}</span>
        </div>

        {/* Uses your existing Explain flow via parent onExplain(repo) */}
        <button
          onClick={() => onExplain && onExplain(repo)}
          className="text-sm px-3 py-1.5 rounded-lg focus:outline-none focus-visible:ring-2"
          style={{
            backgroundImage: "linear-gradient(to right, var(--secondary), #2563eb)",
            color: "#fff",
            border: "1px solid color-mix(in oklab, var(--secondary) 45%, transparent)",
            boxShadow: "0 8px 24px rgba(34,211,238,.12)",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.filter = "brightness(1.05)")}
          onMouseLeave={(e) => (e.currentTarget.style.filter = "none")}
        >
          Explain with AI
        </button>
      </div>
    </MotionDiv>
  );
}
