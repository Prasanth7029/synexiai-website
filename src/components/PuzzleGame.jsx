// src/components/PuzzleGame.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaPlay, FaRedo, FaCheck } from "react-icons/fa";

export default function PuzzleGame() {
  const [sequence, setSequence] = useState([]);
  const [userInput, setUserInput] = useState([]);
  const [level, setLevel] = useState(1);
  const [status, setStatus] = useState("idle"); // idle | showing | input | success | fail

  // Generate random sequence
  const generateSequence = (len) =>
    Array.from({ length: len }, () => Math.floor(Math.random() * 9) + 1);

  // Start new game
  const startGame = () => {
    const seq = generateSequence(level + 2);
    setSequence(seq);
    setUserInput([]);
    setStatus("showing");

    // Show sequence for 2s * length
    setTimeout(() => setStatus("input"), (seq.length * 1000) + 1000);
  };

  const handleInput = (num) => {
    if (status !== "input") return;
    const next = [...userInput, num];
    setUserInput(next);

    if (next.join("") === sequence.join("")) {
      setStatus("success");
      setTimeout(() => {
        setLevel((l) => l + 1);
        startGame();
      }, 1500);
    } else if (!sequence.join("").startsWith(next.join(""))) {
      setStatus("fail");
    }
  };

  return (
    <section className="p-6 max-w-md mx-auto">
      <motion.div
        className="rounded-2xl p-6 text-center border border-cyan-400
                   bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900
                   shadow-lg shadow-cyan-500/20"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 className="text-xl font-bold mb-2 text-cyan-300">
          🔮 Puzzle Memory Game
        </h3>
        <p className="text-sm mb-4 text-gray-400">
          Watch the numbers, then repeat them in order!
        </p>

        {status === "idle" && (
          <button
            onClick={startGame}
            className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500
                       text-white flex items-center justify-center gap-2 mx-auto"
          >
            <FaPlay /> Start
          </button>
        )}

        {status === "showing" && (
          <div className="text-3xl font-mono text-cyan-400 animate-pulse">
            {sequence.join(" ")}
          </div>
        )}

        {status === "input" && (
          <div className="grid grid-cols-3 gap-3 mt-4">
            {[1,2,3,4,5,6,7,8,9].map((n) => (
              <button
                key={n}
                onClick={() => handleInput(n)}
                className="px-4 py-3 text-lg font-bold rounded-lg
                           bg-slate-700 hover:bg-cyan-600
                           text-cyan-300 hover:text-white"
              >
                {n}
              </button>
            ))}
          </div>
        )}

        {status === "success" && (
          <div className="text-green-400 flex items-center justify-center gap-2 mt-3">
            <FaCheck /> Great! Next level…
          </div>
        )}

        {status === "fail" && (
          <div className="text-rose-400 flex flex-col items-center gap-2 mt-3">
            ❌ Wrong! Sequence was:
            <span className="font-mono">{sequence.join(" ")}</span>
            <button
              onClick={startGame}
              className="px-4 py-2 mt-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white flex items-center gap-2"
            >
              <FaRedo /> Retry
            </button>
          </div>
        )}
      </motion.div>
    </section>
  );
}
