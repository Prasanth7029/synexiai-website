// src/components/sections/RoadmapUnlocker.jsx
// @refresh reset
import React, { useMemo } from "react";
import { useProgress } from "@/context/ProgressContext.jsx";

const THRESHOLDS = { five: 500, ten: 1500, twenty: 3500 };

const PANELS = [
  {
    key: "five",
    title: "5-Year Goals",
    points: [
      "AI Builder MVP across NLP/Vision/Forecasting",
      "Green micro-datacenter pilot (ARM + solar)",
      "First 10 enterprise customers on AI+Cloud stack",
    ],
  },
  {
    key: "ten",
    title: "10-Year Vision",
    points: [
      "Carbon-aware global workload routing",
      "Autonomous data optimization (self-healing DBs)",
      "Gov/enterprise certifications (SOC2/ISO27001)",
    ],
  },
  {
    key: "twenty",
    title: "20-Year Dream",
    points: [
      "Hyperlocal renewable cloud grid",
      "Neural interfaces for human-AI creativity",
      "Open eco-standard for green compute",
    ],
  },
];

function UnlockCard({ title, locked, need, children }) {
  return (
    <div className="relative rounded-2xl border border-white/10 bg-white/5 p-4 overflow-hidden">
      <h3 className="font-semibold mb-2">{title}</h3>
      <div className={locked ? "pointer-events-none select-none blur-[2px] opacity-60" : ""}>
        {children}
      </div>
      {locked && (
        <div className="absolute inset-0 grid place-items-center">
          <span className="rounded-full border border-white/20 bg-black/60 px-3 py-1 text-sm">
            Locked • need <b>{need}</b>
          </span>
        </div>
      )}
    </div>
  );
}

export default function RoadmapUnlocker() {
  const { scores = {} } = useProgress?.() ?? {};

  // Sum every stored game score (works even as you add new games)
  const total = useMemo(
    () => Object.values(scores).reduce((a, v) => a + (Number(v) || 0), 0),
    [scores],
  );

  const needs = {
    five:    Math.max(0, THRESHOLDS.five    - total),
    ten:     Math.max(0, THRESHOLDS.ten     - total),
    twenty:  Math.max(0, THRESHOLDS.twenty  - total),
  };

  const unlocked = {
    five:   needs.five   === 0,
    ten:    needs.ten    === 0,
    twenty: needs.twenty === 0,
  };

  // Find the next target to guide the player
  const next =
    !unlocked.five   ? { tier: "5-Year",  need: needs.five } :
    !unlocked.ten    ? { tier: "10-Year", need: needs.ten } :
    !unlocked.twenty ? { tier: "20-Year", need: needs.twenty } :
                       { tier: "All unlocked", need: 0 };

  return (
    <section className="max-w-6xl mx-auto mt-10">
      <h2 className="text-2xl font-bold">Roadmap</h2>
      <p className="opacity-80 text-sm">Timeline Unlocker</p>
      <p className="opacity-70 text-xs mt-1">
        Play puzzles to reveal SynexiAI’s 5, 10, and 20-year roadmap.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        {PANELS.map((p) => (
          <UnlockCard
            key={p.key}
            title={p.title}
            locked={!unlocked[p.key]}
            need={needs[p.key]}
          >
            <ul className="text-sm space-y-2">
              {p.points.map((t, i) => (
                <li key={i} className="opacity-90">• {t}</li>
              ))}
            </ul>
          </UnlockCard>
        ))}
      </div>

      <p className="mt-3 text-xs opacity-70">
        Total score: <span className="font-semibold">{Math.round(total)}</span>
        {" • "}5y {THRESHOLDS.five}
        {" • "}10y {THRESHOLDS.ten}
        {" • "}20y {THRESHOLDS.twenty}
        {next.need > 0 ? (
          <> {" • "}Next: <b>{next.tier}</b> (need {next.need})</>
        ) : (
          <> {" • "}<b>All timeline panels unlocked</b></>
        )}
      </p>
    </section>
  );
}
