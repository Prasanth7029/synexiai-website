// src/components/puzzles/FastMemoryGame.jsx
// @refresh reset
import React, { useEffect, useRef, useState } from "react";
import { useProgress } from "@/context/ProgressContext.jsx";

export const gameMeta = {
  id: "fastMemory", // keep stable for unlocker
  title: "Fast Memory",
  description:
    "Watch the glowing tiles (A–D), then click them in the same order. Each round adds one.",
  tags: ["memory", "focus"],
  thumbnail: "/assets/games/memory-thumb.png",
};

const COLORS = ["#22d3ee", "#60a5fa", "#a78bfa", "#f472b6"];
const LS_BEST = "synexiai:fastmemory:best";

function pad(n) {
  return String(n).padStart(2, "0");
}

export default function FastMemoryGame() {
  const { setScore } = useProgress?.() ?? { setScore: () => {} };

  // game state
  const [seq, setSeq] = useState([Math.floor(Math.random() * 4)]);
  const [input, setInput] = useState([]);
  const [round, setRound] = useState(1);

  // phases: idle | watch | play
  const [phase, setPhase] = useState("idle");
  const [status, setStatus] = useState("Press Start to begin");

  // UI helpers
  const [watchIdx, setWatchIdx] = useState(-1); // which step is glowing during watch
  const [runScore, setRunScore] = useState(0);
  const [best, setBest] = useState(() => Number(localStorage.getItem(LS_BEST) || 0) || 0);

  const timer = useRef(null);

  // persist & publish best score
  useEffect(() => {
    try {
      localStorage.setItem(LS_BEST, String(best));
    } catch {}
    setScore("fastMemory", best);
  }, [best, setScore]);

  // playback animation for “watch” phase
  useEffect(() => {
    if (phase !== "watch") return;
    setStatus("Watch the sequence");
    let i = 0;

    function step() {
      if (i >= seq.length) {
        setWatchIdx(-1);
        setPhase("play");
        setStatus("Your turn");
        return;
      }
      setWatchIdx(i);
      timer.current = setTimeout(() => {
        setWatchIdx(-1);
        timer.current = setTimeout(() => {
          i += 1;
          step();
        }, 180); // small gap between highlights
      }, 520); // glow length
    }

    step();
    return () => clearTimeout(timer.current);
  }, [phase, seq]);

  // keyboard (1–4) for accessibility
  useEffect(() => {
    const onKey = (e) => {
      if (phase !== "play") return;
      const map = { "1": 0, "2": 1, "3": 2, "4": 3 };
      if (map[e.key] != null) handleTap(map[e.key]);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, input, seq]);

  function startRound() {
    setPhase("watch");
    setInput([]);
    setStatus("Watch the sequence");
  }

  function newGame() {
    setBest((b) => Math.max(b, runScore)); // keep any improvement
    setRunScore(0);
    setRound(1);
    setSeq([Math.floor(Math.random() * 4)]);
    setInput([]);
    setPhase("idle");
    setStatus("Press Start to begin");
  }

  function handleTap(idx) {
    if (phase !== "play") return;

    const next = [...input, idx];
    setInput(next);

    // wrong input → end run and restart round 1
    if (seq[next.length - 1] !== idx) {
      setStatus("Oops! That wasn’t in the sequence");
      setBest((b) => Math.max(b, runScore));
      setRunScore(0);
      setTimeout(() => {
        setRound(1);
        setSeq([Math.floor(Math.random() * 4)]);
        setInput([]);
        setPhase("idle");
        setStatus("Press Start to try again");
      }, 900);
      return;
    }

    // finished this round successfully
    if (next.length === seq.length) {
      const gained = round * 120;
      const nextRun = runScore + gained;
      setRunScore(nextRun);
      setBest((b) => Math.max(b, nextRun));

      setStatus("Great! Next round…");
      setRound((r) => r + 1);
      setTimeout(() => {
        setSeq((s) => [...s, Math.floor(Math.random() * 4)]);
        setInput([]);
        setPhase("watch");
      }, 700);
    }
  }

  return (
    <div className="w-full max-w-sm mx-auto p-3 sm:p-4">
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div>
          <h3 className="text-lg font-semibold">Fast Memory</h3>
          <p className="text-xs opacity-75">
            Memorize the glowing tiles, then repeat the order.
          </p>
        </div>
        <div className="text-xs opacity-80">{status}</div>
      </div>

      {/* Round & Scores */}
      <div className="flex items-center gap-2 text-xs mb-3">
        <span className="px-2 py-1 rounded bg-black/30">Round {pad(round)}</span>
        <span className="px-2 py-1 rounded bg-black/30">Run: <b>{runScore}</b></span>
        <span className="px-2 py-1 rounded bg-black/30">Best: <b>{best}</b></span>
        <button
          onClick={newGame}
          className="ml-auto px-2 py-1 rounded bg-white/10 hover:bg-white/20"
        >
          Reset
        </button>
      </div>

      {/* Progress dots */}
      <div className="flex items-center gap-1.5 mb-3">
        {Array.from({ length: seq.length }).map((_, i) => {
          const watching = phase === "watch" && watchIdx === i;
          const filled = phase === "play" && i < input.length;
          return (
            <span
              key={i}
              className={[
                "w-2.5 h-2.5 rounded-full transition-all",
                watching ? "bg-cyan-400 scale-125" : filled ? "bg-cyan-300" : "bg-white/25",
              ].join(" ")}
            />
          );
        })}
      </div>

      {/* 2x2 Grid (compact) */}
      <div className="grid grid-cols-2 gap-3">
        {COLORS.map((c, i) => {
          const glowing = phase === "watch" && watchIdx === i;
          const pressed = phase === "play" && input[input.length - 1] === i;
          return (
            <button
              key={i}
              onClick={() => handleTap(i)}
              disabled={phase !== "play"}
              style={{ background: c }}
              className={[
                "h-16 sm:h-20 rounded-xl shadow-inner transition-all",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60",
                glowing ? "ring-4 ring-white/80" : "",
                pressed ? "scale-95" : "active:scale-95",
                phase !== "play" ? "opacity-90 cursor-default" : "hover:brightness-110",
              ].join(" ")}
              aria-label={`Tile ${String.fromCharCode(65 + i)}`}
            >
              <span className="sr-only">Tile {String.fromCharCode(65 + i)}</span>
            </button>
          );
        })}
      </div>

      {/* CTA row */}
      <div className="mt-4 flex items-center justify-between">
        <p className="text-[11px] opacity-70">
          Tip: Start small—A→B→… Each round adds one more.
        </p>
        <button
          onClick={startRound}
          disabled={phase === "watch"}
          className={[
            "px-3 py-1.5 rounded-lg text-sm",
            phase === "play"
              ? "bg-emerald-600 hover:bg-emerald-500"
              : "bg-cyan-600 hover:bg-cyan-500",
            "text-white transition-colors",
          ].join(" ")}
        >
          {phase === "play" ? "Repeat" : "Start"}
        </button>
      </div>
    </div>
  );
}
