// src/context/ProgressContext.jsx
import React, { createContext, useContext, useMemo, useState } from "react";

const LS_KEY = "sx_scores_v1";

export const ROADMAP_THRESHOLDS = { five: 500, ten: 1500, twenty: 3500 };

// optional per-game unlock gates (by total points)
export const GAME_UNLOCKS = {
  neon: 0,
  aiBuilder: 300,
  fastMemory: 700,
  carbon: 1100,
  missionQuiz: 1500,
};

const Ctx = createContext(null);

export function ProgressProvider({ children }) {
  const [scores, setScores] = useState(() => {
    try { return JSON.parse(localStorage.getItem(LS_KEY) || "{}"); } catch { return {}; }
  });

  const setScore = (gameId, nextScore) => {
    setScores(prev => {
      const best = Math.max(Number(prev[gameId] || 0), Number(nextScore) || 0);
      const updated = { ...prev, [gameId]: best };
      try { localStorage.setItem(LS_KEY, JSON.stringify(updated)); } catch {}
      return updated;
    });
  };

  const totalScore = useMemo(
    () => Object.values(scores).reduce((a, b) => a + Number(b || 0), 0),
    [scores]
  );

  const pointsTo = (target) => Math.max(0, target - totalScore);

  const nextRoadmapTier = useMemo(() => {
    if (totalScore < ROADMAP_THRESHOLDS.five)   return { tier: "5-Year",   need: pointsTo(ROADMAP_THRESHOLDS.five) };
    if (totalScore < ROADMAP_THRESHOLDS.ten)    return { tier: "10-Year",  need: pointsTo(ROADMAP_THRESHOLDS.ten) };
    if (totalScore < ROADMAP_THRESHOLDS.twenty) return { tier: "20-Year",  need: pointsTo(ROADMAP_THRESHOLDS.twenty) };
    return { tier: "All unlocked", need: 0 };
  }, [totalScore]);

  const canPlay = (gameId) => totalScore >= (GAME_UNLOCKS[gameId] ?? 0);
  const needForGame = (gameId) => Math.max(0, (GAME_UNLOCKS[gameId] ?? 0) - totalScore);

  const value = { scores, setScore, totalScore, nextRoadmapTier, canPlay, needForGame };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useProgress = () => useContext(Ctx);
