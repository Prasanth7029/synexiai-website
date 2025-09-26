import React from "react";
import { motion } from "framer-motion";
import GitHubCard from "./GitHubCard.jsx";

const MotionDiv = motion.div;

const StatCard = ({ icon, label, value }) => (
  <MotionDiv
    whileHover={{ y: -3 }}
    className="rounded-lg border border-white/10 bg-white/5 p-3 sm:p-4 shadow-lg xs-card xs-shadow"
  >
    <div className="text-lg sm:text-2xl mb-1.5" aria-hidden="true">
      {icon}
    </div>
    <div className="font-bold text-[15px] sm:text-3xl">{value}</div>
    <div className="xs-text">{label}</div>
  </MotionDiv>
);

export default function GitHubSection({
  profile,
  repos,
  totals,
  githubUser,
  onExplain,
}) {
  return (
    <MotionDiv
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.35 }}
      className="mb-14 sm:mb-20"
    >
      <div className="flex flex-col md:flex-row gap-6 sm:gap-8 items-center mb-8 sm:mb-12">
        {/* Left text block */}
        <div className="md:w-1/2">
          <h2 className="font-bold mb-3 sm:mb-4 text-[clamp(1.1rem,4vw,2.1rem)] xs-h2">
            The Foundation: Code
          </h2>
          <p className="text-gray-300 mb-4 sm:mb-6 xs-text-sm">
            GitHub represents the first step in our journey—the technical
            foundation upon which we’re building the SynexisAI vision. These
            projects demonstrate our commitment to excellence in software
            engineering and innovative problem-solving.
          </p>
          <p className="xs-text-sm">
            <span className="font-medium">Remember:</span> This is just the
            beginning. These repositories are the building blocks for the
            revolutionary technologies that will power our AI-optimized
            databases and renewable energy systems.
          </p>
        </div>

        {/* Profile + stats */}
        <div className="md:w-1/2 rounded-xl p-4 sm:p-8 border border-white/10 bg-white/5 shadow-lg w-full xs-card">
          <div className="flex items-center gap-4 sm:gap-6 mb-4 sm:mb-6">
            <img
              src={
                profile?.avatar_url ||
                "https://avatars.githubusercontent.com/u/583231?v=4"
              }
              alt={`${profile?.login || githubUser} GitHub avatar`}
              className="w-12 h-12 sm:w-20 sm:h-20 rounded-full border-2 border-cyan-400 object-cover"
              onError={(e) => {
                e.currentTarget.src =
                  "https://avatars.githubusercontent.com/u/583231?v=4";
              }}
            />
            <div className="min-w-0">
              <h2 className="text-[16px] sm:text-2xl font-bold truncate">
                {profile?.name || profile?.login || githubUser}
              </h2>
              <p className="text-gray-400 mb-1.5 sm:mb-2 line-clamp-2 xs-text-sm sm:text-[14px]">
                {profile?.bio || "Building the future of technology"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <StatCard icon="📦" label="Repos" value={profile?.public_repos ?? repos.length} />
            <StatCard icon="👥" label="Followers" value={profile?.followers ?? 0} />
            <StatCard icon="⭐" label="Stars" value={totals.stars} />
            <StatCard icon="🔀" label="Forks" value={totals.forks} />
          </div>
        </div>
      </div>

      {/* Repos Grid */}
      <div className="mb-8 sm:mb-12">
        <h3 className="text-[16px] sm:text-2xl font-bold mb-4 sm:mb-6 text-center">
          Phase 1: Technical Foundations
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-8 items-stretch">
          {repos.map((repo, index) => (
            <GitHubCard
              key={repo.id || `${repo.name}-${index}`}
              repo={repo}
              index={index}
              onExplain={onExplain}
            />
          ))}
        </div>
      </div>
    </MotionDiv>
  );
}
