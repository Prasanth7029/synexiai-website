import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const MotionDiv     = motion.div;


/* --------------------------------- Utils --------------------------------- */
const GITHUB_USER =
  import.meta.env.VITE_GITHUB_USERNAME?.trim() || "Prasanth7029";
const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN?.trim() || ""; // optional

// NOTE: Frontend tokens are visible to users. Prefer a serverless proxy in production.
const baseHeaders = {
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
  ...(GITHUB_TOKEN ? { Authorization: `Bearer ${GITHUB_TOKEN}` } : {}),
};

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
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "—";
  }
}

/* ------------------------------ UI Components ----------------------------- */

const StatCard = ({ icon, label, value }) => (
  <MotionDiv
    whileHover={{ y: -3 }}
    className="rounded-lg border border-white/10 bg-white/5 backdrop-blur-md p-4 shadow-lg"
  >
    <div className="text-cyan-400 text-2xl mb-2" aria-hidden="true">
      {icon}
    </div>
    <div className="text-3xl font-bold">{value}</div>
    <div className="text-gray-500 dark:text-gray-400 text-sm">{label}</div>
  </MotionDiv>
);

const ProjectCard = ({ repo, index }) => (
  <MotionDiv
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.08 }}
    whileHover={{ y: -5 }}
    className="rounded-xl p-6 border border-white/10 bg-white/5 backdrop-blur-md shadow-lg hover:shadow-cyan-500/20 transition-all"
  >
    <div className="flex justify-between items-start mb-4">
      <h3 className="text-xl font-semibold text-cyan-400">
        <a
          href={repo.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          {repo.name}
        </a>
      </h3>
      <span className="text-xs text-gray-500 dark:text-gray-400">
        {formatDate(repo.updated_at)}
      </span>
    </div>

    <p className="text-gray-700 dark:text-gray-300 mb-4">
      {repo.description || "No description provided"}
    </p>

    {repo.language && (
      <div className="flex items-center gap-2 mb-4">
        <span
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: getLanguageColor(repo.language) }}
          aria-hidden="true"
        />
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {repo.language}
        </span>
      </div>
    )}

    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
      <span>⭐ {repo.stargazers_count}</span>
      <span>🔀 {repo.forks_count}</span>
      <span>👁️ {repo.watchers_count}</span>
    </div>
  </MotionDiv>
);

const VisionCard = ({ title, description, icon, color }) => (
  <MotionDiv
    whileHover={{ y: -5 }}
    className="p-4 sm:p-6 md:p-8 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md shadow-lg"
  >
    <div className={`text-3xl mb-4 ${color}`} aria-hidden="true">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-3">{title}</h3>
    <p className="text-gray-700 dark:text-gray-300">{description}</p>
  </MotionDiv>
);

const RoadmapPhase = ({ phase, title, focus, timeline, icon, color }) => (
  <MotionDiv
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5 }}
    className="relative pl-8 py-4 border-l-2 border-cyan-500/30"
  >
    <div
      className={`absolute left-[-15px] top-4 w-8 h-8 rounded-full flex items-center justify-center ${color} text-white`}
      aria-hidden="true"
    >
      {icon}
    </div>
    <div className="text-cyan-400 text-sm">{phase}</div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-gray-700 dark:text-gray-300 mb-3">{focus}</p>
    <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
      <span aria-hidden="true">📅</span> {timeline}
    </div>
  </MotionDiv>
);

const PartnerLogo = ({ name, logo }) => (
  <MotionDiv
    whileHover={{ scale: 1.05 }}
    className="flex flex-col items-center justify-center rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-4 shadow-lg"
  >
    <div className="text-4xl mb-3" aria-hidden="true">
      {logo}
    </div>
    <span className="text-gray-700 dark:text-gray-300">{name}</span>
  </MotionDiv>
);

/* --------------------------------- Page ---------------------------------- */

export default function Portfolio() {
  const [repos, setRepos] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const ac = new AbortController();
    let unmounted = false;

    (async () => {
      setLoading(true);
      setErrorMsg("");

      const cfg = { headers: baseHeaders, timeout: 8000, signal: ac.signal };

      try {
        const [profileRes, reposRes] = await Promise.all([
          axios.get(`https://api.github.com/users/${GITHUB_USER}`, cfg),
          axios.get(
            `https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=9`,
            cfg,
          ),
        ]);

        if (unmounted) return;
        setProfile(profileRes.data);
        setRepos(reposRes.data || []);
      } catch (err) {
        // Ignore dev-time aborts (StrictMode/HMR/navigation)
        const canceled =
          err?.name === "CanceledError" ||
          err?.code === "ERR_CANCELED" ||
          (axios.isCancel && axios.isCancel(err));
        if (canceled || unmounted) return;

        console.warn(
          "GitHub API error:",
          err?.response?.status || err?.message || err,
        );

        // Optional: specific messages for common API responses
        if (err?.response?.status === 401) {
          setErrorMsg("Invalid GitHub token. Falling back to sample projects.");
        } else if (
          err?.response?.status === 403 &&
          err?.response?.headers?.["x-ratelimit-remaining"] === "0"
        ) {
          setErrorMsg("GitHub rate limit reached. Showing sample projects.");
        } else {
          setErrorMsg(
            "GitHub data temporarily unavailable. Showing sample vision projects.",
          );
        }

        setRepos([
          {
            id: 1,
            name: "AI-Optimized DB Engine",
            html_url: "#",
            description:
              "Self-healing database system prototype with real-time query optimization",
            language: "Python",
            stargazers_count: 0,
            forks_count: 0,
            watchers_count: 0,
            updated_at: new Date().toISOString(),
          },
          {
            id: 2,
            name: "Green Cloud Architecture",
            html_url: "#",
            description:
              "Renewable-powered data center design with AI energy management",
            language: "TypeScript",
            stargazers_count: 0,
            forks_count: 0,
            watchers_count: 0,
            updated_at: new Date().toISOString(),
          },
          {
            id: 3,
            name: "Edge AI Energy Orchestrator",
            html_url: "#",
            description:
              "Predictive scaling for edge nodes to minimize carbon & cost",
            language: "JavaScript",
            stargazers_count: 0,
            forks_count: 0,
            watchers_count: 0,
            updated_at: new Date().toISOString(),
          },
        ]);
      } finally {
        if (!unmounted) setLoading(false);
      }
    })();

    return () => {
      unmounted = true;
      ac.abort();
    };
  }, []);

  const totals = useMemo(
    () => ({
      stars: repos.reduce((sum, r) => sum + (r.stargazers_count || 0), 0),
      forks: repos.reduce((sum, r) => sum + (r.forks_count || 0), 0),
    }),
    [repos],
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-4" />
          <div className="text-cyan-500 text-xl">Building the future...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Hero */}
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 relative overflow-hidden"
        >
          <div
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-500/10 to-transparent opacity-20 pointer-events-none"
            aria-hidden="true"
          />
          <div className="relative z-10">
            <MotionDiv
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-block bg-gradient-to-r from-cyan-600 to-teal-500 text-white px-6 py-2 rounded-full mb-6 text-sm font-medium"
            >
              SynexisAI Visionary Portfolio
            </MotionDiv>

            <h1 className="text-2xl sm:text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-teal-300 to-cyan-400">
                Beyond Code. Beyond Limits.
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8">
              Building a future where AI, sustainable infrastructure, and
              renewable energy converge to transform industries and empower
              humanity.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a
                href="#vision"
                className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-lg font-medium transition-all text-center"
              >
                Explore the Vision
              </a>
              <a
                href={`https://github.com/${GITHUB_USER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-transparent border border-cyan-500 text-cyan-400 hover:bg-cyan-500/10 px-6 py-3 rounded-lg font-medium transition-all text-center"
                aria-label="Open GitHub profile in new tab"
              >
                View GitHub
              </a>
            </div>
          </div>
        </MotionDiv>

        {errorMsg && (
          <div className="border border-rose-500/30 bg-rose-900/20 text-rose-300 p-4 rounded-lg mb-8 max-w-3xl mx-auto text-center">
            {errorMsg}
          </div>
        )}

        {/* Core Vision */}
        <MotionDiv
          id="vision"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">The SynexisAI Trinity</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Three interconnected pillars that will revolutionize technology
              and sustainability
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
        </MotionDiv>

        {/* GitHub / Foundation */}
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="mb-20"
        >
          <div className="flex flex-col md:flex-row gap-8 items-center mb-12">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold mb-4">The Foundation: Code</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                GitHub represents the first step in our journey—the technical
                foundation upon which we’re building the SynexisAI vision. These
                projects demonstrate our commitment to excellence in software
                engineering and innovative problem-solving.
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                <span className="text-cyan-500 font-medium">Remember:</span>{" "}
                This is just the beginning. These repositories are the building
                blocks for the revolutionary technologies that will power our
                AI-optimized databases and renewable energy systems.
              </p>
            </div>

            <div className="md:w-1/2 rounded-xl p-8 border border-white/10 bg-white/5 backdrop-blur-md shadow-lg">
              <div className="flex items-center gap-6 mb-6">
                <img
                  src={
                    profile?.avatar_url ||
                    "https://avatars.githubusercontent.com/u/583231?v=4"
                  }
                  alt={`${profile?.login || GITHUB_USER} GitHub avatar`}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-cyan-400 object-cover"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://avatars.githubusercontent.com/u/583231?v=4";
                  }}
                />
                <div>
                  <h2 className="text-2xl font-bold">
                    {profile?.name || profile?.login || GITHUB_USER}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-2">
                    {profile?.bio || "Building the future of technology"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <StatCard
                  icon="📦"
                  label="Repos"
                  value={profile?.public_repos ?? repos.length}
                />
                <StatCard
                  icon="👥"
                  label="Followers"
                  value={profile?.followers ?? 0}
                />
                <StatCard icon="⭐" label="Stars" value={totals.stars} />
                <StatCard icon="🔀" label="Forks" value={totals.forks} />
              </div>
            </div>
          </div>

          {/* Repos Grid */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold mb-6 text-center">
              Phase 1: Technical Foundations
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {repos.map((repo, index) => (
                <ProjectCard
                  key={repo.id || `${repo.name}-${index}`}
                  repo={repo}
                  index={index}
                />
              ))}
            </div>
          </div>

          <div className="rounded-xl p-6 text-center border border-cyan-500/20 bg-gradient-to-r from-cyan-900/20 to-teal-900/20">
            <p className="text-xl text-cyan-300">
              “These projects are the seeds from which our AI-optimized
              databases and renewable energy systems will grow.”
            </p>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              — Venkat Sai Prasanth, SynexisAI Visionary
            </p>
          </div>
        </MotionDiv>

        {/* Roadmap */}
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Strategic Roadmap</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              The journey from code to global impact follows a carefully
              designed three-phase approach
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="rounded-xl p-8 border border-white/10 bg-white/5 backdrop-blur-md shadow-lg">
              <h3 className="text-2xl font-bold mb-6 text-cyan-400">
                Phase 1: AI Innovation Lab
              </h3>
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

            <div className="rounded-xl p-8 border border-white/10 bg-white/5 backdrop-blur-md shadow-lg">
              <h3 className="text-2xl font-bold mb-6 text-teal-400">
                Phase 2: Hybrid Database Centers
              </h3>
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

            <div className="rounded-xl p-8 border border-white/10 bg-white/5 backdrop-blur-md shadow-lg">
              <h3 className="text-2xl font-bold mb-6 text-emerald-400">
                Phase 3: Renewable Energy Integration
              </h3>
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
        </MotionDiv>

        {/* Partnerships */}
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.65 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Global Partnerships</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Building alliances with industry leaders to accelerate our mission
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <PartnerLogo name="AWS Green Energy" logo="☁️" />
            <PartnerLogo name="UN Sustainable Tech" logo="🇺🇳" />
            <PartnerLogo name="Tesla Energy" logo="🔋" />
            <PartnerLogo name="MIT AI Lab" logo="🎓" />
          </div>
        </MotionDiv>

        {/* CTA */}
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="rounded-2xl p-12 text-center border border-cyan-500/20 bg-gradient-to-r from-cyan-900/20 to-teal-900/20"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6">
            Join the Revolution
          </h2>
          <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            We’re building more than a company—we’re creating a movement that
            will redefine how technology serves humanity while protecting our
            planet.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/contact"
              className="bg-cyan-600 hover:bg-cyan-700 text-white px-8 py-4 rounded-lg font-medium text-lg transition-all text-center"
            >
              Partner With Us
            </Link>
            <a
              href="/assets/synexisai-vision.pdf"
              className="bg-transparent border-2 border-cyan-500 text-cyan-400 hover:bg-cyan-500/10 px-8 py-4 rounded-lg font-medium text-lg transition-all text-center"
            >
              Download Full Vision Deck
            </a>
          </div>

          <div className="mt-10 flex justify-center">
            <div className="text-gray-600 dark:text-gray-400 text-sm max-w-2xl">
              <p className="italic mb-2">
                “The future belongs to those who understand that technology must
                serve humanity without compromising our planet.”
              </p>
              <p>— SynexisAI Manifesto</p>
            </div>
          </div>
        </MotionDiv>
      </div>
    </div>
  );
}
