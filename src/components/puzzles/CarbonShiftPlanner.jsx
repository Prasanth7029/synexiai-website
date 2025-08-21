// src/components/puzzles/CarbonShiftPlanner.jsx
// @refresh reset
import React, { useMemo, useState } from "react";
import { useProgress } from "@/context/ProgressContext.jsx";
import { FiInfo, FiRefreshCw } from "react-icons/fi";

export const gameMeta = {
  id: "carbon",
  title: "Carbon-Aware Planner",
  description: "Schedule batch jobs in the greenest hours.",
  thumbnail: "/assets/games/carbon-thumb.png",
  unlockAt: 1100, // optional: also set in GAME_UNLOCKS
};

const INTENSITY = [
  403,384,394,378,363,364,335,315,283,261,237,216,
  213,220,232,268,285,312,343,354,367,385,380,398
]; // example gCO2/kWh per hour (lower is greener)

const PICK = 6; // choose 6 hours

export default function CarbonShiftPlanner() {
  const { setScore } = useProgress();
  const [chosen, setChosen] = useState(new Set());

  const toggle = (h) => {
    setChosen(prev => {
      const n = new Set(prev);
      if (n.has(h)) n.delete(h);
      else if (n.size < PICK) n.add(h);
      return n;
    });
  };

  // score: normalize green benefit (lower intensity => higher points)
  const { score, done } = useMemo(() => {
    if (chosen.size === 0) return { score: 0, done: false };
    const vals = [...chosen].map(h => INTENSITY[h]);
    const sum = vals.reduce((a,b) => a+b, 0);
    // perfect (best PICK hours) benchmark:
    const best = [...INTENSITY].sort((a,b)=>a-b).slice(0,PICK).reduce((a,b)=>a+b,0);
    const worst = [...INTENSITY].sort((a,b)=>b-a).slice(0,PICK).reduce((a,b)=>a+b,0);
    const norm = 1 - (sum - best) / Math.max(1, (worst - best));
    const pts = Math.round(1000 * Math.max(0, norm));
    return { score: pts, done: chosen.size === PICK };
  }, [chosen]);

  // persist best
  const [best, setBest] = useState(() => {
    try { return Number(localStorage.getItem("sx_carbon_best") || 0); } catch { return 0; }
  });

  const commit = () => {
    const nextBest = Math.max(best, score);
    setBest(nextBest);
    try { localStorage.setItem("sx_carbon_best", String(nextBest)); } catch {}
    setScore("carbon", nextBest);
  };

  const reset = () => setChosen(new Set());

  return (
    <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold">Carbon-Aware Planner</h3>
        <div className="text-sm opacity-80">Pick <b>{PICK}</b> hours • Score: <b>{score}</b> • Best: <b>{best}</b></div>
      </div>
      <p className="text-xs opacity-75 mb-3 flex items-center gap-2"><FiInfo /> Lower carbon = higher score. Mid-day often wins (solar).</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {INTENSITY.map((v, h) => {
          const on = chosen.has(h);
          return (
            <button
              key={h}
              onClick={() => toggle(h)}
              className={`text-left rounded-lg border px-3 py-2 transition ${on ? "border-cyan-400 bg-cyan-400/10" : "border-white/10 bg-white/5 hover:bg-white/10"}`}
            >
              <div className="text-xs opacity-80">{String(h).padStart(2,"0")}:00</div>
              <div className="text-sm font-semibold">{v}</div>
              <div className="mt-1 h-1.5 w-full rounded bg-white/10 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-rose-400 to-yellow-400" style={{ width: `${(v-200)/2.5}%` }} />
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-3 flex items-center gap-2">
        <button onClick={reset} className="px-3 py-1.5 rounded-lg border border-white/20 bg-white/10 hover:bg-white/15 text-sm flex items-center gap-2">
          <FiRefreshCw /> Reset
        </button>
        <div className="ml-auto">
          <button
            onClick={commit}
            disabled={!done}
            className={`px-4 py-1.5 rounded-lg text-sm ${done ? "bg-cyan-600 hover:bg-cyan-500 text-white" : "bg-gray-700 text-gray-300 cursor-not-allowed"}`}
          >
            Save Score
          </button>
        </div>
      </div>
    </div>
  );
}
