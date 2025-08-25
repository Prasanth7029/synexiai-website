import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { projects } from "../content/projects.js";
import ProjectsSection from "../components/projects/ProjectsSection.jsx";

const MotionDiv = motion.div;

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
    className="rounded-lg border border-white/10 bg-white/5 p-3 sm:p-4 shadow-lg xs-card xs-shadow"
  >
    <div className="text-cyan-400 text-lg sm:text-2xl mb-1.5" aria-hidden="true">
      {icon}
    </div>
    <div className="font-bold text-[15px] sm:text-3xl">{value}</div>
    <div className="text-gray-400 xs-text">{label}</div>
  </MotionDiv>
);

const ProjectCard = ({ repo, index }) => (
  <MotionDiv
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.08 }}
    whileHover={{ y: -5 }}
    className="rounded-xl p-3 sm:p-6 border border-white/10 bg-white/5 shadow-lg hover:shadow-cyan-500/20 transition-all h-full xs-card"
  >
    <div className="flex justify-between items-start mb-3 gap-3 min-w-0">
      <h3 className="xs-text-md sm:text-xl font-semibold text-cyan-400 min-w-0">
        <a
          href={repo.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline break-words"
        >
          {repo.name}
        </a>
      </h3>
      <span className="xs-text text-gray-400 shrink-0">
        {formatDate(repo.updated_at)}
      </span>
    </div>

    <p className="text-gray-300 mb-3 line-clamp-3 xs-text-sm sm:text-[14px]">
      {repo.description || "No description provided"}
    </p>

    {repo.language && (
      <div className="flex items-center gap-2 mb-3">
        <span
          className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full"
          style={{ backgroundColor: getLanguageColor(repo.language) }}
          aria-hidden="true"
        />
        <span className="xs-text text-gray-400">{repo.language}</span>
      </div>
    )}

    <div className="mt-auto flex justify-between xs-text text-gray-400">
      <span>⭐ {repo.stargazers_count}</span>
      <span>🔀 {repo.forks_count}</span>
      <span>👁️ {repo.watchers_count}</span>
    </div>
  </MotionDiv>
);

const VisionCard = ({ title, description, icon, color }) => (
  <MotionDiv
    whileHover={{ y: -5 }}
    className="p-3 sm:p-6 md:p-8 rounded-xl border border-white/10 bg-white/5 shadow-lg h-full flex flex-col xs-card"
  >
    <div className={`text-2xl sm:text-3xl mb-3 ${color}`} aria-hidden="true">
      {icon}
    </div>
    <h3 className="xs-text-md sm:text-xl font-bold mb-2">{title}</h3>
    <p className="text-gray-300 xs-text-sm sm:text-[14px]">{description}</p>
  </MotionDiv>
);

const RoadmapPhase = ({ phase, title, focus, timeline, icon, color }) => (
  <MotionDiv
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5 }}
    className="relative pl-9 sm:pl-8 py-3 sm:py-4 border-l-2 border-cyan-500/30"
  >
    <div
      className={`absolute left-[-12px] sm:left-[-15px] top-2.5 sm:top-4 w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center ${color} text-white`}
      aria-hidden="true"
    >
      {icon}
    </div>
    <div className="text-cyan-400 xs-text sm:text-sm">{phase}</div>
    <h3 className="xs-text-md sm:text-xl font-bold mb-1.5 sm:mb-2">{title}</h3>
    <p className="text-gray-300 mb-2 sm:mb-3 xs-text-sm sm:text-[14px]">{focus}</p>
    <div className="xs-text sm:text-sm text-gray-400 flex items-center gap-2">
      <span aria-hidden="true">📅</span> {timeline}
    </div>
  </MotionDiv>
);

const PartnerLogo = ({ name, logo }) => (
  <MotionDiv
    whileHover={{ scale: 1.05 }}
    className="flex flex-col items-center justify-center rounded-xl border border-white/10 bg-white/5 p-3 sm:p-4 shadow-lg h-full xs-card"
  >
    <div className="text-2xl sm:text-4xl mb-2 sm:mb-3" aria-hidden="true">
      {logo}
    </div>
    <span className="text-gray-300 xs-text-sm sm:text-[14px]">{name}</span>
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
            cfg
          ),
        ]);

        if (unmounted) return;
        setProfile(profileRes.data);
        setRepos(reposRes.data || []);
      } catch (err) {
        const canceled =
          err?.name === "CanceledError" ||
          err?.code === "ERR_CANCELED" ||
          (axios.isCancel && axios.isCancel(err));
        if (canceled || unmounted) return;

        console.warn(
          "GitHub API error:",
          err?.response?.status || err?.message || err
        );

        if (err?.response?.status === 401) {
          setErrorMsg("Invalid GitHub token. Falling back to sample projects.");
        } else if (
          err?.response?.status === 403 &&
          err?.response?.headers?.["x-ratelimit-remaining"] === "0"
        ) {
          setErrorMsg("GitHub rate limit reached. Showing sample projects.");
        } else {
          setErrorMsg(
            "GitHub data temporarily unavailable. Showing sample vision projects."
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
    [repos]
  );

  if (loading) {
    return (
      <div className="min-h-svh flex items-center justify-center px-3 xs-px">
        <div className="flex flex-col items-center text-center">
          <div className="w-10 h-10 sm:w-16 sm:h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-3" />
          <div className="text-cyan-500 xs-text-md sm:text-lg">
            Building the future...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-svh py-10 sm:py-16 px-3 sm:px-6 xs-px safe-top">
      <div className="max-w-7xl mx-auto">
        {/* Hero */}
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-10 sm:mb-16 relative overflow-hidden"
        >
          <div
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-500/10 to-transparent opacity-20 pointer-events-none"
            aria-hidden="true"
          />
          <div className="relative z-10">
            <MotionDiv
              initial={{ scale: 0.94 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-block bg-gradient-to-r from-cyan-600 to-teal-500 text-white px-4 py-1.5 rounded-full mb-4 sm:px-6 sm:py-2 sm:mb-6 text-[12px] sm:text-sm font-medium"
            >
              SynexisAI Visionary Portfolio
            </MotionDiv>

            <h1 className="font-bold mb-3 sm:mb-6 text-[clamp(1.1rem,5vw,3.25rem)] xs-h1">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-teal-300 to-cyan-400">
                Beyond Code. Beyond Limits.
              </span>
            </h1>

            <p className="mx-auto leading-relaxed mb-6 sm:mb-8 xs-text-sm sm:text-[14px] md:text-xl text-gray-300">
              Building a future where AI, sustainable infrastructure, and
              renewable energy converge to transform industries and empower
              humanity.
            </p>

            <div className="flex flex-col-1 sm:flex-row justify-center xs-gap gap-3 sm:gap-4">
              <a
                href="#vision"
                className="bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg xs-btn xs-btn-full sm:w-auto sm:px-6 sm:py-3 sm:text-[14px] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                aria-label="Jump to the vision section"
              >
                Explore the Vision
              </a>
              <a
                href={`https://github.com/${GITHUB_USER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-transparent border border-cyan-500 text-cyan-400 hover:bg-cyan-500/10 rounded-lg xs-btn xs-btn-full sm:w-auto sm:px-6 sm:py-3 sm:text-[14px] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                aria-label="Open GitHub profile in new tab"
              >
                View GitHub
              </a>
            </div>
          </div>
        </MotionDiv>

        {errorMsg && (
          <div className="border border-rose-500/30 bg-rose-900/20 text-rose-300 p-3 sm:p-4 rounded-lg mb-6 sm:mb-8 max-w-3xl mx-auto text-center xs-text-sm sm:text-[14px]">
            {errorMsg}
          </div>
        )}

        {/* Core Vision */}
        <MotionDiv
          id="vision"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-14 sm:mb-20 scroll-mt-[calc(var(--header-h,64px)+12px)]"
        >
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="font-bold mb-3 sm:mb-4 text-[clamp(1.05rem,4.2vw,2.1rem)] xs-h2">
              The SynexisAI Trinity
            </h2>
            <p className="text-gray-400 max-w-3xl mx-auto xs-text-sm">
              Three interconnected pillars that will revolutionize technology
              and sustainability
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-8 items-stretch">
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

        {/* Projects showcase from content */}
        <div className="w-full max-w-6xl mx-auto px-3 sm:px-6 py-8 md:py-20 text-gray-100">
          <ProjectsSection items={projects} title="Project Showcase" />
        </div>

        {/* GitHub / Foundation */}
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="mb-14 sm:mb-20"
        >
          <div className="flex flex-col md:flex-row gap-6 sm:gap-8 items-center mb-8 sm:mb-12">
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
              <p className="text-gray-400 xs-text-sm">
                <span className="text-cyan-500 font-medium">Remember:</span>{" "}
                This is just the beginning. These repositories are the building
                blocks for the revolutionary technologies that will power our
                AI-optimized databases and renewable energy systems.
              </p>
            </div>

            <div className="md:w-1/2 rounded-xl p-4 sm:p-8 border border-white/10 bg-white/5 shadow-lg w-full xs-card">
              <div className="flex items-center gap-4 sm:gap-6 mb-4 sm:mb-6">
                <img
                  src={
                    profile?.avatar_url ||
                    "https://avatars.githubusercontent.com/u/583231?v=4"
                  }
                  alt={`${profile?.login || GITHUB_USER} GitHub avatar`}
                  className="w-12 h-12 sm:w-20 sm:h-20 rounded-full border-2 border-cyan-400 object-cover"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://avatars.githubusercontent.com/u/583231?v=4";
                  }}
                />
                <div className="min-w-0">
                  <h2 className="text-[16px] sm:text-2xl font-bold truncate">
                    {profile?.name || profile?.login || GITHUB_USER}
                  </h2>
                  <p className="text-gray-400 mb-1.5 sm:mb-2 line-clamp-2 xs-text-sm sm:text-[14px]">
                    {profile?.bio || "Building the future of technology"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <StatCard
                  icon="📦"
                  label="Repos"
                  value={profile?.public_repos ?? repos.length}
                />
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
                <ProjectCard
                  key={repo.id || `${repo.name}-${index}`}
                  repo={repo}
                  index={index}
                />
              ))}
            </div>
          </div>

          <div className="rounded-xl p-4 text-center border border-cyan-500/20 bg-gradient-to-r from-cyan-900/20 to-teal-900/20">
            <p className="text-[13px] sm:text-xl text-cyan-300">
              “These projects are the seeds from which our AI-optimized
              databases and renewable energy systems will grow.”
            </p>
            <p className="text-gray-400 mt-1 xs-text">
              — Venkat Sai Prasanth, SynexisAI Visionary
            </p>
          </div>
        </MotionDiv>

        {/* Roadmap */}
        <MotionDiv
          id="roadmap"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mb-14 sm:mb-20 scroll-mt-[calc(var(--header-h,64px)+12px)]"
        >
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="font-bold mb-3 sm:mb-4 text-[clamp(1.1rem,4vw,2.1rem)] xs-h2">
              Our Strategic Roadmap
            </h2>
            <p className="text-gray-400 max-w-3xl mx-auto xs-text-sm">
              The journey from code to global impact follows a carefully
              designed three-phase approach
            </p>
          </div>

          <div className="grid grid-cols lg:grid-cols-3 gap-3 sm:gap-8 items-stretch">
            <div className="rounded-xl p-4 sm:p-8 border border-white/10 bg-white/5 shadow-lg h-full xs-card">
              <h3 className="text-[16px] sm:text-2xl font-bold mb-4 sm:mb-6 text-cyan-400">
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

            <div className="rounded-xl p-4 sm:p-8 border border-white/10 bg-white/5 shadow-lg h-full xs-card">
              <h3 className="text-[16px] sm:text-2xl font-bold mb-4 sm:mb-6 text-teal-400">
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

            <div className="rounded-xl p-4 sm:p-8 border border-white/10 bg-white/5 shadow-lg h-full xs-card">
              <h3 className="text-[16px] sm:text-2xl font-bold mb-4 sm:mb-6 text-emerald-400">
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
          id="partnerships"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.65 }}
          className="mb-14 sm:mb-20 scroll-mt-[calc(var(--header-h,64px)+12px)]"
        >
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="font-bold mb-3 sm:mb-4 text-[clamp(1.1rem,4vw,2.1rem)] xs-h2">
              Global Partnerships
            </h2>
            <p className="text-gray-400 max-w-3xl mx-auto xs-text-sm">
              Building alliances with industry leaders to accelerate our mission
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 items-stretch">
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
          className="rounded-2xl p-8 sm:p-12 text-center border border-cyan-500/20 bg-gradient-to-r from-cyan-900/20 to-teal-900/20"
        >
          <h2 className="text-[18px] sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
            Join the Revolution
          </h2>
          <p className="mx-auto mb-6 sm:mb-8 xs-text-md sm:text-xl text-gray-300 max-w-3xl">
            We’re building more than a company—we’re creating a movement that
            will redefine how technology serves humanity while protecting our
            planet.
          </p>

          <div className="flex flex-col sm:flex-row justify-center xs-gap gap-3 sm:gap-4">
            <Link
              to="/contact"
              className="bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg xs-btn xs-btn-full sm:w-auto sm:px-8 sm:py-4 sm:text-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
            >
              Partner With Us
            </Link>
            <a
              href="/assets/synexisai-vision.pdf"
              className="bg-transparent border-2 border-cyan-500 text-cyan-400 hover:bg-cyan-500/10 rounded-lg xs-btn xs-btn-full sm:w-auto sm:px-8 sm:py-4 sm:text-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
            >
              Download Full Vision Deck
            </a>
          </div>

          <div className="mt-6 sm:mt-10 flex justify-center">
            <div className="text-gray-400 xs-text sm:text-sm max-w-2xl">
              <p className="italic mb-1.5 sm:mb-2">
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
