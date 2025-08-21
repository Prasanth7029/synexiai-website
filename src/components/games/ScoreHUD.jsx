import React from "react";
import { useProgress, ROADMAP_THRESHOLDS } from "@/context/ProgressContext.jsx";

export default function ScoreHUD() {
  const { totalScore, nextRoadmapTier } = useProgress();
  const max = ROADMAP_THRESHOLDS.twenty;
  const pct = Math.min(100, Math.round((totalScore / max) * 100));

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-3 mb-6">
      <div className="flex items-center justify-between">
        <div className="text-sm opacity-80">Total score</div>
        <div className="text-sm">Next unlock: <span className="font-semibold">{nextRoadmapTier.tier}</span> {nextRoadmapTier.need ? `• need ${nextRoadmapTier.need}` : ""}</div>
      </div>
      <div className="mt-2 h-2 w-full rounded bg-white/10 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-cyan-400 to-blue-500" style={{ width: `${pct}%` }} />
      </div>
      <div className="mt-1 text-xs opacity-70">{totalScore} / {max}</div>
    </div>
  );
}
