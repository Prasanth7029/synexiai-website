import React, { useMemo } from "react";
import { useProgress } from "../../context/ProgressContext.jsx";
import { UNLOCKS, ROADMAP } from "../../data/roadmap.js";
import { motion } from "framer-motion";

function Card({ locked, title, items }) {
  return (
    <div className={`rounded-xl border p-4 ${locked ? "border-white/10 bg-black/20" : "border-cyan-400/40 bg-cyan-400/5"}`}>
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-lg font-semibold">{title}</h4>
        <span className={`text-sm ${locked ? "opacity-60" : "text-cyan-300"}`}>{locked ? "Locked" : "Unlocked"}</span>
      </div>
      <ul className={`space-y-1 text-sm ${locked ? "opacity-60 blur-[1px]" : ""}`}>
        {items.map((t) => <li key={t}>• {t}</li>)}
      </ul>
    </div>
  );
}


export default function RoadmapUnlocker() {
  const { state } = useProgress();

  const total = state.energy.best + state.memory.best + state.aiBuilder.best;

  const unlocked = {
    y5:  total >= UNLOCKS.y5,
    y10: total >= UNLOCKS.y10,
    y20: total >= UNLOCKS.y20,
  };

  return (
    <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <h3 className="text-xl font-bold">Timeline Unlocker</h3>
      <p className="text-sm opacity-80 -mt-2 mb-2">Play puzzles to reveal SynexiAI’s 5, 10, and 20‑year roadmap.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card locked={!unlocked.y5}  title={ROADMAP.y5.title}  items={ROADMAP.y5.points} />
        <Card locked={!unlocked.y10} title={ROADMAP.y10.title} items={ROADMAP.y10.points} />
        <Card locked={!unlocked.y20} title={ROADMAP.y20.title} items={ROADMAP.y20.points} />
      </div>

      <div className="text-xs opacity-70">
        Total score: <span className="font-semibold">{total}</span> •
        5y {UNLOCKS.y5} • 10y {UNLOCKS.y10} • 20y {UNLOCKS.y20}
      </div>
    </motion.section>
  );
}
