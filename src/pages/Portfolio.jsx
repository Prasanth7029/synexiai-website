import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { projects } from "../content/projects.js";


// NEW: extracted GitHub UI + Explain wiring
import GitHubSection from "@/components/github/GitHubSection.jsx";
import { repoToExplainPayload } from "@/lib/githubExplainAdapter.js";
import { useExplainWithAI } from "@/hooks/useExplainWithAI"; // use your existing hook

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

function textVarStyle(varName, fallback) {
  // lets you tap into index.css variables for light/dark while remaining safe if undefined
  return { color: `var(${varName}, ${fallback})` };
}

/* ------------------------------ Local UI --------------------------------- */

const VisionCard = ({ title, description, icon, color }) => (
  <MotionDiv
    whileHover={{ y: -5 }}
    className="p-3 sm:p-6 md:p-8 rounded-xl border border-white/10 shadow-lg h-full flex flex-col xs-card"
    style={{ background: "var(--card, color-mix(in oklab, #0b1220 8%, transparent))" }}
  >
    <div className={`text-2xl sm:text-3xl mb-3 ${color}`} aria-hidden="true">
      {icon}
    </div>
    <h3 className="xs-text-md sm:text-xl font-bold mb-2" >
      {title}
    </h3>
    <p className="xs-text-sm sm:text-[14px]" >
      {description}
    </p>
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
    <div className="xs-text sm:text-sm" >
      {phase}
    </div>
    <h3 className="xs-text-md sm:text-xl font-bold mb-1.5 sm:mb-2" >
      {title}
    </h3>
    <p className="mb-2 sm:mb-3 xs-text-sm sm:text-[14px]" >
      {focus}
    </p>
    <div className="xs-text sm:text-sm flex items-center gap-2" >
      <span aria-hidden="true">📅</span> {timeline}
    </div>
  </MotionDiv>
);

const PartnerLogo = ({ name, logo }) => (
  <MotionDiv
    whileHover={{ scale: 1.05 }}
    className="flex flex-col items-center justify-center rounded-xl border border-white/10 bg-white/5 p-3 sm:p-4 shadow-lg h-full xs-card"
    style={{ background: "var(--card, color-mix(in oklab, #0b1220 8%, transparent))" }}
  >
    <div className="text-2xl sm:text-4xl mb-2 sm:mb-3" aria-hidden="true">
      {logo}
    </div>
    <span className="xs-text-sm sm:text-[14px]" >
      {name}
    </span>
  </MotionDiv>
);

/* --------------------------------- Page ---------------------------------- */

export default function Portfolio() {
  const [repos, setRepos] = useState([]);
  const [profile, setProfile] = useState(null);

  const [errorMsg, setErrorMsg] = useState("");

  // Use your existing Explain flow (modal, drawer, etc.)
  const explain = useExplainWithAI();

  // Handler the GitHub cards call
  const onExplain = (repo) => {
    const payload = repoToExplainPayload(repo);
    // Call in the format your hook expects:
    if (typeof explain === "function") {
      explain(payload);
    } else if (explain?.explainWithObject) {
      explain.explainWithObject(payload);
    } else if (explain?.run) {
      explain.run(payload.text);
    } else if (explain?.openWith) {
      explain.openWith(payload);
    }
  };

  useEffect(() => {
    const ac = new AbortController();
    let unmounted = false;

    (async () => {


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



  return (
    <div className="min-h-svh py-10 sm:py-16 px-3 sm:px-6 xs-px safe-top">
      <div className="max-w-7xl mx-auto">
        {/* ========================= Hero ========================= */}
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
              className="inline-block bg-gradient-to-r from-cyan-600 to-teal-500 px-4 py-1.5 rounded-full mb-4 sm:px-6 sm:py-2 sm:mb-6 text-[12px] sm:text-sm font-medium"
              style={{ color: "white" }}
            >
              SynexisAI Visionary Portfolio
            </MotionDiv>

            <h1
              className="font-bold mb-3 sm:mb-6 text-[clamp(1.1rem,5vw,3.25rem)] xs-h1"
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-teal-300 to-cyan-400">
                Beyond Code. Beyond Limits.
              </span>
            </h1>

            <p
              className="mx-auto leading-relaxed mb-6 sm:mb-8 xs-text-sm sm:text-[14px] md:text-xl"
            >
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
                className="bg-transparent border border-cyan-500 hover:bg-cyan-500/10 rounded-lg xs-btn xs-btn-full sm:w-auto sm:px-6 sm:py-3 sm:text-[14px] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                aria-label="Open GitHub profile in new tab"
              >
                View GitHub
              </a>
            </div>
          </div>
        </MotionDiv>

        {errorMsg && (
          <div
            className="border border-rose-500/30 bg-rose-900/20 text-rose-300 p-3 sm:p-4 rounded-lg mb-6 sm:mb-8 max-w-3xl mx-auto text-center xs-text-sm sm:text-[14px]"
            role="status"
          >
            {errorMsg}
          </div>
        )}

        {/* ========================= The SynexisAI Trinity ========================= */}
        <MotionDiv
          id="vision"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-14 sm:mb-20 scroll-mt-[calc(var(--header-h,64px)+12px)]"
        >
          <div className="text-center mb-8 sm:mb-12">
            <h2
              className="font-bold mb-3 sm:mb-4 text-[clamp(1.05rem,4.2vw,2.1rem)] xs-h2"
            >
              The SynexisAI Trinity
            </h2>
            <p className="max-w-3xl mx-auto xs-text-sm" style={textVarStyle("--muted-fg", "#a8b3cf")}>
              Three interconnected pillars that will revolutionize technology
              and sustainability
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8 items-stretch">
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

        {/* ========================= GitHub / Foundation (separate component) ========================= */}
        <GitHubSection
          profile={profile}
          repos={repos}
          totals={totals}
          githubUser={GITHUB_USER}
          onExplain={onExplain}
        />

        {/* ========================= Our Strategic Roadmap ========================= */}
        <MotionDiv
          id="roadmap"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mb-14 sm:mb-20 scroll-mt-[calc(var(--header-h,64px)+12px)]"
        >
          <div className="text-center mb-8 sm:mb-12">
            <h2
              className="font-bold mb-3 sm:mb-4 text-[clamp(1.1rem,4vw,2.1rem)] xs-h2"
            >
              Our Strategic Roadmap
            </h2>
            <p className="max-w-3xl mx-auto xs-text-sm" >
              The journey from code to global impact follows a carefully
              designed three-phase approach
            </p>
          </div>

          <div className="grid grid-cols lg:grid-cols-3 gap-3 sm:gap-8 items-stretch">
            <div className="rounded-xl p-4 sm:p-8 border border-white/10 bg-white/5 shadow-lg h-full xs-card"
                 style={{ background: "var(--card, color-mix(in oklab, #0b1220 8%, transparent))" }}>
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

            <div className="rounded-xl p-4 sm:p-8 border border-white/10 bg-white/5 shadow-lg h-full xs-card"
                 style={{ background: "var(--card, color-mix(in oklab, #0b1220 8%, transparent))" }}>
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

            <div className="rounded-xl p-4 sm:p-8 border border-white/10 bg-white/5 shadow-lg h-full xs-card"
                 style={{ background: "var(--card, color-mix(in oklab, #0b1220 8%, transparent))" }}>
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

        {/* ========================= Global Partnerships ========================= */}
        <MotionDiv
          id="partnerships"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.65 }}
          className="mb-14 sm:mb-20 scroll-mt-[calc(var(--header-h,64px)+12px)]"
        >
          <div className="text-center mb-8 sm:mb-12">
            <h2
              className="font-bold mb-3 sm:mb-4 text-[clamp(1.1rem,4vw,2.1rem)] xs-h2"
            >
              Global Partnerships
            </h2>
            <p className="max-w-3xl mx-auto xs-text-sm" >
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

        {/* ========================= CTA ========================= */}
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="rounded-2xl p-8 sm:p-12 text-center from-cyan-900/20 to-teal-900/20"
          style={{ background: "var(--card, color-mix(in oklab, #0b1220 8%, transparent))" }}
        >
          <h2 className="text-[18px] sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6" >
            Join the Revolution
          </h2>
          <p className="mx-auto mb-6 sm:mb-8 xs-text-md sm:text-xl max-w-3xl" >
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
            <div className="xs-text sm:text-sm max-w-2xl" >
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
