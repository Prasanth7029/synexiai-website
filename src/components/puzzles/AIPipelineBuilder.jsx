// src/components/puzzles/AIPipelineBuilder.jsx
// @refresh reset
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useProgress } from "@/context/ProgressContext.jsx";

/* ------------------------------- Levels ---------------------------------- */
const LEVELS = [
  { name: "Starter", target: ["Data","Clean","Features","Train","Evaluate","Deploy"], hintLimit: 1, multiplier: 1.0 },
  { name: "Pro",     target: ["Data","Label","Clean","Features","Train","Evaluate","Deploy"], hintLimit: 1, multiplier: 1.2 },
  { name: "Expert",  target: ["Ingest","Data","Label","Clean","Augment","Features","Train","Evaluate","Deploy","Monitor"], hintLimit: 2, multiplier: 1.5 },
];

const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  if (a.join("|") === arr.join("|")) return shuffle(arr);
  return a;
};

const STREAK_KEY = "synexiai:aibuilder:streak";
const BEST_KEY   = "synexiai:aibuilder:best";

/** Keep this id aligned with ProgressContext and GamesPage grid */
export const gameMeta = {
  id: "aiBuilder",
  title: "AI Pipeline Builder",
  description: "Drag steps into the correct order to ship an ML pipeline. Faster time, fewer moves, fewer hints = higher score.",
  thumbnail: "/assets/games/aipipeline.png",
};

export default function AIPipelineBuilder({ className = "" }) {
  const { setScore } = useProgress();

  // level state
  const [levelIdx, setLevelIdx] = useState(0);
  const level = LEVELS[levelIdx];

  // board state
  const [items, setItems] = useState(() => shuffle(level.target));
  const [moves, setMoves] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);

  // session
  const [start, setStart] = useState(Date.now());
  const [elapsed, setElapsed] = useState(0);
  const [solved, setSolved] = useState(false);
  const timerId = useRef(null);

  // persistence
  const [streak, setStreak] = useState(() => Number(localStorage.getItem(STREAK_KEY) || 0) || 0);
  const [best, setBest]     = useState(() => Number(localStorage.getItem(BEST_KEY)   || 0) || 0);
  const [savedTick, setSavedTick] = useState(0);

  // timers
  useEffect(() => {
    clearInterval(timerId.current);
    timerId.current = setInterval(() => setElapsed(Math.floor((Date.now() - start) / 1000)), 250);
    return () => clearInterval(timerId.current);
  }, [start]);

  // derived
  useEffect(() => { setSolved(items.join("|") === level.target.join("|")); }, [items, level]);

  const liveScore = useMemo(() => {
    const base = Math.round(800 * level.multiplier);
    const timePenalty = Math.max(0, elapsed * 3);
    const movePenalty = Math.max(0, (moves - level.target.length) * 8);
    const hintPenalty = hintsUsed * 50;
    const raw = base - timePenalty - movePenalty - hintPenalty;
    const streakBonus = Math.round(Math.max(0, raw) * Math.min(0.25, streak * 0.05)); // up to +25%
    return Math.max(0, raw + streakBonus);
  }, [elapsed, moves, hintsUsed, level, streak]);

  // helpers
  const resetLevel = () => {
    setItems(shuffle(level.target));
    setMoves(0);
    setHintsUsed(0);
    setSolved(false);
    setStart(Date.now());
    setElapsed(0);
  };
  useEffect(() => { resetLevel(); /*eslint-disable-next-line*/ }, [levelIdx]);

  // dnd
  const dragIndex = useRef(null);
  const onDragStart = (idx) => (e) => { dragIndex.current = idx; e.dataTransfer.effectAllowed = "move"; };
  const onDragOver  = (idx) => (e) => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; };
  const onDrop      = (idx) => (e) => {
    e.preventDefault();
    const from = dragIndex.current;
    if (from === null || from === idx) return;
    const next = [...items];
    const [moved] = next.splice(from, 1);
    next.splice(idx, 0, moved);
    dragIndex.current = null;
    setItems(next);
    setMoves((m) => m + 1);
  };

  const useHint = () => {
    if (hintsUsed >= level.hintLimit) return;
    const target = level.target;
    let i = 0; while (i < items.length && items[i] === target[i]) i++;
    if (i >= items.length) return;
    const want = target[i];
    const j = items.indexOf(want);
    if (j === -1 || j === i) return;
    const next = [...items]; [next[i], next[j]] = [next[j], next[i]];
    setItems(next); setMoves((m) => m + 1); setHintsUsed((h) => h + 1);
  };

  const resetStreak = () => { setStreak(0); try { localStorage.setItem(STREAK_KEY, "0"); } catch {} };

  const validateAndScore = () => {
    if (!solved) return;
    const score = liveScore;

    const nextBest = Math.max(best, score);
    setBest(nextBest);
    try { localStorage.setItem(BEST_KEY, String(nextBest)); } catch {}

    // record to global progress as best-of
    setScore("aiBuilder", nextBest);

    const next = streak + 1;
    setStreak(next);
    try { localStorage.setItem(STREAK_KEY, String(next)); } catch {}

    setSavedTick((t) => t + 1);
  };

  const nextLevel = () => setLevelIdx((i) => (i < LEVELS.length - 1 ? i + 1 : 0));

  return (
    <div className={`rounded-xl border border-white/10 bg-white/5 p-4 ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-bold">AI Builder — Arrange the Pipeline</h3>
        <span className="text-xs opacity-75">Level: <b>{level.name}</b></span>
      </div>

      <p className="text-sm opacity-80 mb-3">
        Put steps in the correct order to “train” an ML system. Fewer moves, fewer hints, faster time → higher score.
      </p>

      <div className="flex flex-wrap gap-2 items-center text-xs mb-3 opacity-80">
        <div className="px-2 py-1 rounded bg-black/30">⏱ {elapsed}s</div>
        <div className="px-2 py-1 rounded bg-black/30">🧭 {moves} moves</div>
        <div className="px-2 py-1 rounded bg-black/30">💡 hints {hintsUsed}/{level.hintLimit}</div>
        <div className="px-2 py-1 rounded bg-black/30">🔥 streak {streak}</div>
        <div className="ml-auto px-2 py-1 rounded bg-cyan-500/20 text-cyan-300">Score: {liveScore}</div>
        <div className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-300">Best: {best}</div>
        {savedTick > 0 && <span key={savedTick} className="ml-2 text-[11px] text-emerald-300">Saved!</span>}
      </div>

      <ul className="space-y-2 mb-4">
        {items.map((step, i) => (
          <li key={step} className="flex items-center justify-between bg-black/30 rounded-lg px-3 py-2"
              draggable onDragStart={onDragStart(i)} onDragOver={onDragOver(i)} onDrop={onDrop(i)}>
            <span className="font-mono select-none">{i + 1}. {step}</span>
            <span className={`text-xs ${step === level.target[i] ? "text-emerald-300" : "opacity-50"}`}>
              {step === level.target[i] ? "✓" : "drag me"}
            </span>
          </li>
        ))}
      </ul>

      <div className="flex flex-wrap gap-2">
        <button className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20" onClick={resetLevel}>Restart Level</button>
        <button className={`px-3 py-2 rounded-lg ${hintsUsed < level.hintLimit ? "bg-white/10 hover:bg-white/20" : "bg-gray-700 cursor-not-allowed"}`}
                onClick={useHint} disabled={hintsUsed >= level.hintLimit} title="Swap one incorrect position toward the right order">
          Use Hint
        </button>
        <button className={`px-3 py-2 rounded-lg ${solved ? "bg-cyan-500 hover:bg-cyan-400" : "bg-gray-600 cursor-not-allowed"}`}
                onClick={validateAndScore} disabled={!solved}>
          Validate & Save
        </button>
        <button className={`px-3 py-2 rounded-lg ${solved ? "bg-indigo-500 hover:bg-indigo-400" : "bg-gray-700 cursor-not-allowed"}`}
                onClick={nextLevel} disabled={!solved}>
          Next Level →
        </button>
        <button className="ml-auto px-3 py-2 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-200" onClick={resetStreak}>
          Reset Streak
        </button>
      </div>
    </div>
  );
}
