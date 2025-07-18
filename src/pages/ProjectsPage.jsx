import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";

// Custom components for our visionary portfolio
const StatCard = ({ icon, label, value }) => (
  <motion.div
    whileHover={{ y: -3 }}
    className="bg-gradient-to-br from-gray-900/50 to-gray-900 p-4 rounded-lg border border-cyan-500/20"
  >
    <div className="text-cyan-400 text-2xl mb-2">{icon}</div>
    <div className="text-3xl font-bold">{value}</div>
    <div className="text-gray-400 text-sm">{label}</div>
  </motion.div>
);

const ProjectCard = ({ repo, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    whileHover={{ y: -5 }}
    className="bg-gradient-to-br from-gray-800/30 to-gray-900 rounded-xl p-6 border border-gray-700 hover:border-cyan-400/30 transition-all"
  >
    <div className="flex justify-between items-start mb-4">
      <h3 className="text-xl font-semibold text-cyan-400">
        <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
          {repo.name}
        </a>
      </h3>
      <span className="text-xs text-gray-400">
        {new Date(repo.updated_at).toLocaleDateString()}
      </span>
    </div>

    <p className="text-gray-300 mb-4">{repo.description || 'No description provided'}</p>

    {repo.language && (
      <div className="flex items-center gap-2 mb-4">
        <span
          className="w-3 h-3 rounded-full"
          style={{
            backgroundColor: getLanguageColor(repo.language)
          }}
        ></span>
        <span className="text-sm text-gray-400">{repo.language}</span>
      </div>
    )}

    <div className="flex justify-between text-sm text-gray-400">
      <span>⭐ {repo.stargazers_count}</span>
      <span>🔀 {repo.forks_count}</span>
      <span>👁️ {repo.watchers_count}</span>
    </div>
  </motion.div>
);

const VisionCard = ({ title, description, icon, color }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="p-6 rounded-xl bg-gradient-to-br from-gray-800/30 to-gray-900 border border-gray-700"
  >
    <div className={`text-3xl mb-4 ${color}`}>{icon}</div>
    <h3 className="text-xl font-bold mb-3">{title}</h3>
    <p className="text-gray-300">{description}</p>
  </motion.div>
);

const RoadmapPhase = ({ phase, title, focus, timeline, icon, color }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5 }}
    className="relative pl-8 py-4 border-l-2 border-cyan-500/30"
  >
    <div className={`absolute left-[-15px] top-4 w-8 h-8 rounded-full flex items-center justify-center ${color} text-white`}>
      {icon}
    </div>
    <div className="text-cyan-400 text-sm">{phase}</div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-gray-300 mb-3">{focus}</p>
    <div className="text-sm text-gray-400 flex items-center gap-2">
      <span>📅</span> {timeline}
    </div>
  </motion.div>
);

const PartnerLogo = ({ name, logo }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className="flex flex-col items-center justify-center bg-gray-800/30 p-4 rounded-xl border border-gray-700"
  >
    <div className="text-4xl mb-3">{logo}</div>
    <span className="text-gray-300">{name}</span>
  </motion.div>
);

export default function ProjectsPage() {
  const [repos, setRepos] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = import.meta.env.VITE_GITHUB_TOKEN;
        if (!token) throw new Error("GitHub token not configured");

        const config = {
          headers: { Authorization: `token ${token}` },
          timeout: 5000
        };

        const [profileRes, reposRes] = await Promise.all([
          axios.get('https://api.github.com/users/Prasanth7029', config),
          axios.get('https://api.github.com/users/Prasanth7029/repos?sort=updated&per_page=6', config)
        ]);

        setProfile(profileRes.data);
        setRepos(reposRes.data);
        setError(null);
      } catch (err) {
        console.error("API Error:", err.response?.status || err.message);
        setError("GitHub data temporarily unavailable. Showing sample vision projects.");
        setRepos([
          {
            id: 1,
            name: "AI-Optimized DB Engine",
            html_url: "#",
            description: "Self-healing database system prototype with real-time query optimization",
            language: "Python",
            stargazers_count: 0,
            forks_count: 0,
            watchers_count: 0,
            updated_at: new Date().toISOString()
          },
          {
            id: 2,
            name: "Green Cloud Architecture",
            html_url: "#",
            description: "Renewable-powered data center design with AI energy management",
            language: "TypeScript",
            stargazers_count: 0,
            forks_count: 0,
            watchers_count: 0,
            updated_at: new Date().toISOString()
          }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <div className="text-cyan-400 text-xl">Building the future...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 py-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">

        {/* Hero Section with SynexisAI Vision */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-500/10 to-transparent opacity-20"></div>

          <div className="relative z-10">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-block bg-gradient-to-r from-cyan-600 to-teal-500 text-white px-6 py-2 rounded-full mb-6 text-sm font-medium"
            >
              SynexisAI Visionary Portfolio
            </motion.div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-teal-300 to-cyan-400">
                Beyond Code. Beyond Limits.
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8">
              Building a future where AI, sustainable infrastructure, and renewable energy converge to transform industries and empower humanity.
            </p>

            <div className="flex justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-lg font-medium transition-all"
              >
                Explore the Vision
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-transparent border border-cyan-500 text-cyan-400 hover:bg-cyan-500/10 px-6 py-3 rounded-lg font-medium transition-all"
              >
                View GitHub
              </motion.button>
            </div>
          </div>
        </motion.div>

        {error && (
          <div className="bg-gradient-to-r from-red-900/30 to-red-800/20 border border-red-700 text-red-300 p-4 rounded-lg mb-8 max-w-3xl mx-auto text-center">
            {error}
          </div>
        )}

        {/* Core Vision Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">The SynexisAI Trinity</h2>
            <p className="text-gray-400 max-w-3xl mx-auto">
              Three interconnected pillars that will revolutionize technology and sustainability
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <VisionCard
              icon="🤖"
              title="AI Innovation"
              description="Developing self-healing AI systems that optimize databases in real-time, predict infrastructure needs, and drive intelligent decision-making."
              color="text-cyan-400"
            />
            <VisionCard
              icon="💾"
              title="Sustainable Databases"
              description="Building blockchain-secured, renewable-powered data centers that deliver unprecedented performance with minimal environmental impact."
              color="text-teal-400"
            />
            <VisionCard
              icon="🌱"
              title="Renewable Energy"
              description="Creating AI-managed energy ecosystems that harness solar, wind and next-gen storage to power our digital future sustainably."
              color="text-emerald-400"
            />
          </div>
        </motion.div>

        {/* GitHub as Foundation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-20"
        >
          <div className="flex flex-col md:flex-row gap-8 items-center mb-12">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold mb-4">The Foundation: Code</h2>
              <p className="text-gray-300 mb-6">
                GitHub represents the first step in our journey - the technical foundation upon which we're building the SynexisAI vision. These projects demonstrate our commitment to excellence in software engineering and innovative problem-solving.
              </p>
              <p className="text-gray-400">
                <span className="text-cyan-400 font-medium">Remember:</span> This is just the beginning. These repositories are the building blocks for the revolutionary technologies that will power our AI-optimized databases and renewable energy systems.
              </p>
            </div>

            <div className="md:w-1/2 bg-gradient-to-br from-gray-800/30 to-gray-900 rounded-xl p-8 border border-cyan-500/20">
              <div className="flex items-center gap-6 mb-6">
                <img
                  src={profile?.avatar_url || "https://avatars.githubusercontent.com/u/583231?v=4"}
                  alt="GitHub Avatar"
                  className="w-20 h-20 rounded-full border-2 border-cyan-400"
                />
                <div>
                  <h2 className="text-2xl font-bold">
                    {profile?.name || profile?.login || "Prasanth7029"}
                  </h2>
                  <p className="text-gray-400 mb-2">
                    {profile?.bio || "Building the future of technology"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <StatCard
                  icon="📦"
                  label="Repos"
                  value={profile?.public_repos || repos.length}
                />
                <StatCard
                  icon="👥"
                  label="Followers"
                  value={profile?.followers || 12}
                />
                <StatCard
                  icon="⭐"
                  label="Stars"
                  value={repos.reduce((sum, repo) => sum + repo.stargazers_count, 0)}
                />
                <StatCard
                  icon="🔀"
                  label="Forks"
                  value={repos.reduce((sum, repo) => sum + repo.forks_count, 0)}
                />
              </div>
            </div>
          </div>

          {/* GitHub Projects Grid */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold mb-6 text-center">Phase 1: Technical Foundations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {repos.map((repo, index) => (
                <ProjectCard key={repo.id || index} repo={repo} index={index} />
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-r from-cyan-900/30 to-teal-900/30 border border-cyan-500/20 rounded-xl p-6 text-center">
            <p className="text-xl text-cyan-300">
              "These projects are the seeds from which our AI-optimized databases and renewable energy systems will grow."
            </p>
            <p className="text-gray-400 mt-2">- Venkat Sai Prasanth, SynexisAI Visionary</p>
          </div>
        </motion.div>

        {/* Strategic Roadmap */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Strategic Roadmap</h2>
            <p className="text-gray-400 max-w-3xl mx-auto">
              The journey from code to global impact follows a carefully designed three-phase approach
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-gray-800/30 to-gray-900 rounded-xl p-8 border border-cyan-500/20">
              <h3 className="text-2xl font-bold mb-6 text-cyan-400">Phase 1: AI Innovation Lab</h3>
              <RoadmapPhase
                phase="Foundation"
                title="Technical Prototyping"
                focus="Develop core AI algorithms for database optimization and energy management"
                timeline="2024-2025"
                icon="🧪"
                color="bg-cyan-600"
              />
              <RoadmapPhase
                phase="Development"
                title="MVP Launch"
                focus="Release first self-healing database system with AI query optimization"
                timeline="2025-2026"
                icon="🚀"
                color="bg-cyan-600"
              />
              <RoadmapPhase
                phase="Growth"
                title="AI Ecosystem"
                focus="Build comprehensive AI platform for predictive infrastructure management"
                timeline="2026"
                icon="🌐"
                color="bg-cyan-600"
              />
            </div>

            <div className="bg-gradient-to-br from-gray-800/30 to-gray-900 rounded-xl p-8 border border-teal-500/20">
              <h3 className="text-2xl font-bold mb-6 text-teal-400">Phase 2: Hybrid Database Centers</h3>
              <RoadmapPhase
                phase="Foundation"
                title="Green Data Centers"
                focus="Establish first solar-powered database facilities with blockchain security"
                timeline="2026-2027"
                icon="🌞"
                color="bg-teal-600"
              />
              <RoadmapPhase
                phase="Development"
                title="Global Expansion"
                focus="Deploy edge computing nodes in 10 strategic locations worldwide"
                timeline="2027-2028"
                icon="🗺️"
                color="bg-teal-600"
              />
              <RoadmapPhase
                phase="Growth"
                title="Enterprise Adoption"
                focus="Onboard Fortune 500 clients to our sustainable database platform"
                timeline="2028"
                icon="🏢"
                color="bg-teal-600"
              />
            </div>

            <div className="bg-gradient-to-br from-gray-800/30 to-gray-900 rounded-xl p-8 border border-emerald-500/20">
              <h3 className="text-2xl font-bold mb-6 text-emerald-400">Phase 3: Renewable Energy Integration</h3>
              <RoadmapPhase
                phase="Foundation"
                title="Energy AI Platform"
                focus="Launch AI-powered energy management system for smart grids"
                timeline="2028-2029"
                icon="⚡"
                color="bg-emerald-600"
              />
              <RoadmapPhase
                phase="Development"
                title="Global Impact"
                focus="Deploy renewable solutions in developing regions with UN partnership"
                timeline="2029-2030"
                icon="🌍"
                color="bg-emerald-600"
              />
              <RoadmapPhase
                phase="Growth"
                title="Sustainable Future"
                focus="Achieve carbon-negative status across all operations"
                timeline="2030+"
                icon="♻️"
                color="bg-emerald-600"
              />
            </div>
          </div>
        </motion.div>

        {/* Strategic Partnerships */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Global Partnerships</h2>
            <p className="text-gray-400 max-w-3xl mx-auto">
              Building alliances with industry leaders to accelerate our mission
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <PartnerLogo name="AWS Green Energy" logo="☁️" />
            <PartnerLogo name="UN Sustainable Tech" logo="🇺🇳" />
            <PartnerLogo name="Tesla Energy" logo="🔋" />
            <PartnerLogo name="MIT AI Lab" logo="🎓" />
          </div>
        </motion.div>

        {/* Final Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="bg-gradient-to-r from-cyan-900/30 to-teal-900/30 border border-cyan-500/20 rounded-2xl p-12 text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Join the Revolution</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            We're building more than a company - we're creating a movement that will redefine how technology serves humanity while protecting our planet.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-cyan-600 hover:bg-cyan-700 text-white px-8 py-4 rounded-lg font-medium text-lg transition-all"
            >
              Partner With Us
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-transparent border-2 border-cyan-500 text-cyan-400 hover:bg-cyan-500/10 px-8 py-4 rounded-lg font-medium text-lg transition-all"
            >
              Download Full Vision Deck
            </motion.button>
          </div>

          <div className="mt-10 flex justify-center">
            <div className="text-gray-400 text-sm max-w-2xl">
              <p className="italic mb-2">"The future belongs to those who understand that technology must serve humanity without compromising our planet."</p>
              <p>- SynexisAI Manifesto</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// Helper functions
function getLanguageColor(language) {
  const colors = {
    JavaScript: '#f1e05a',
    Java: '#b07219',
    Python: '#3572A5',
    HTML: '#e34c26',
    CSS: '#563d7c',
    TypeScript: '#2b7489',
  };
  return colors[language] || '#ccc';
}