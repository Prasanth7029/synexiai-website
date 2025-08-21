// src/components/puzzles/PuzzleGame.jsx
// @refresh reset
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaPlay, FaRedo, FaCheck, FaCrown, FaBrain, FaClock,
  FaVolumeUp, FaVolumeMute
} from "react-icons/fa";
import { IoSparkles } from "react-icons/io5";
import { useProgress } from "@/context/ProgressContext.jsx";

/** Keep id aligned with RoadmapUnlocker and GAME_UNLOCKS */
export const gameMeta = {
  id: "memoryMatrix",
  title: "Memory Matrix",
  description: "Memorize the flashing sequence and repeat it. Faster and longer runs = more points.",
  thumbnail: "/assets/games/memory.png",
};

const LS_KEY = "synexiai:fastmemory:best";

export default function PuzzleGame() {
  const { setScore } = useProgress();

  const [sequence, setSequence] = useState([]);
  const [userInput, setUserInput] = useState([]);
  const [level, setLevel] = useState(1);
  const [runScore, setRunScore] = useState(0);
  const [best, setBest] = useState(() => Number(localStorage.getItem(LS_KEY) || 0) || 0);

  const [status, setStatus] = useState("idle"); // idle | showing | input | success | fail
  const [showTutorial, setShowTutorial] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [timeLeft, setTimeLeft] = useState(0);
  const timerRef = useRef(null);

  // global best sync
  useEffect(() => {
    setScore("fastMemory", best);
    try { localStorage.setItem(LS_KEY, String(best)); } catch {}
  }, [best, setScore]);

  /* ------------------------------ Sounds --------------------------------- */
  const playSound = (type) => {
    if (!soundEnabled) return;
    const Ctx = window.AudioContext || window.webkitAudioContext;
    const audioContext = new Ctx();
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    osc.connect(gain); gain.connect(audioContext.destination);
    const tones = { success: 523.25, fail: 196.0, input: 329.63, show: 783.99 };
    osc.frequency.value = tones[type] ?? 440;
    gain.gain.value = type === "input" ? 0.1 : 0.2;
    osc.start();
    gain.gain.exponentialRampToValueAtTime(0.00001, audioContext.currentTime + 0.2);
    osc.stop(audioContext.currentTime + 0.2);
  };

  /* --------------------------- Game mechanics ---------------------------- */
  const generateSequence = (len) => {
    const base = Array.from({ length: len }, () => Math.floor(Math.random() * 9) + 1);
    if (level > 3 && Math.random() > 0.7 && len >= 4) {
      const t = Math.floor(Math.random() * 3);
      if (t === 0) { base[2] = base[0]; base[3] = base[1]; }         // repeat
      if (t === 1) { base.sort((a,b)=>a-b); }                        // ascending
      if (t === 2 && len >= 5) { const m = Math.floor(len/2); for (let i=0;i<m;i++) base[len-1-i] = base[i]; } // mirror
    }
    return base;
  };

  const startGame = () => {
    const seqLength = Math.min(level + 2, 15);
    const seq = generateSequence(seqLength);
    setSequence(seq);
    setUserInput([]);
    setStatus("showing");
    setShowTutorial(false);

    const baseTime = Math.max(3000, seqLength * 700 - level * 100);
    setTimeLeft(baseTime / 1000);

    if (timerRef.current) clearInterval(timerRef.current);
    const showInterval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0.1) {
          clearInterval(timerRef.current);
          setStatus("input");
          setTimeLeft(Math.max(10, 15 - level));
          startInputTimer();
          return 0;
        }
        return prev - 0.1;
      });
    }, 100);
    timerRef.current = showInterval;

    playSound("show");
  };

  const startInputTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0.1) {
          clearInterval(timerRef.current);
          if (status === "input") {
            setStatus("fail");
            playSound("fail");
          }
          return 0;
        }
        return prev - 0.1;
      });
    }, 100);
  };

  const handleInput = (num) => {
    if (status !== "input") return;
    const next = [...userInput, num];
    setUserInput(next);
    playSound("input");

    if (next.join("") === sequence.join("")) {
      clearInterval(timerRef.current);
      const points = level * 100 + Math.floor(timeLeft * 10);
      const nextRun = runScore + points;
      setRunScore(nextRun);
      setBest((b) => Math.max(b, nextRun));

      setStatus("success");
      playSound("success");

      setTimeout(() => {
        setLevel((l) => l + 1);
        startGame();
      }, 1200);
    } else if (!sequence.join("").startsWith(next.join(""))) {
      clearInterval(timerRef.current);
      setStatus("fail");
      playSound("fail");
    }
  };

  const resetGame = () => {
    clearInterval(timerRef.current);
    setLevel(1);
    setRunScore(0);
    setStatus("idle");
    setTimeLeft(0);
  };

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  /* --------------------------------- UI ---------------------------------- */
  const NumberButton = ({ number, onClick, isActive }) => (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`relative rounded-xl font-bold text-lg md:text-xl transition-all duration-200 p-3 md:p-4
        ${isActive
          ? "bg-gradient-to-br from-cyan-400 to-purple-500 text-white shadow-lg shadow-cyan-500/40"
          : "bg-slate-800 text-cyan-300 hover:bg-slate-700"}`}
    >
      {number}
      {isActive && (
        <motion.span initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          className="absolute -top-2 -right-2 text-amber-400">
          <IoSparkles size={16} />
        </motion.span>
      )}
    </motion.button>
  );

  return (
    <section className="p-4 md:p-6 max-w-lg mx-auto">
      <motion.div
        className="rounded-3xl p-5 md:p-7 text-center border border-cyan-500/30
                   bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900
                   shadow-2xl shadow-cyan-500/10 relative overflow-hidden"
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
      >
        {/* floating glow dots */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[1,2,3,4,5].map(i => (
            <motion.div key={i} className="absolute rounded-full bg-cyan-500/10"
              style={{ width: Math.random()*80+20, height: Math.random()*80+20, top: `${Math.random()*100}%`, left: `${Math.random()*100}%` }}
              animate={{ scale: [1,1.2,1], opacity: [0.1,0.3,0.1] }}
              transition={{ duration: Math.random()*5+3, repeat: Infinity, delay: Math.random()*2 }}
            />
          ))}
        </div>

        <div className="relative z-10">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              🧠 Memory Matrix
            </h3>
            <button onClick={() => setSoundEnabled(!soundEnabled)} className="text-slate-400 hover:text-cyan-400 transition-colors">
              {soundEnabled ? <FaVolumeUp /> : <FaVolumeMute />}
            </button>
          </div>

          <div className="flex justify-center gap-4 mb-6">
            <div className="flex items-center gap-2 bg-slate-800/50 px-3 py-1 rounded-full">
              <FaBrain className="text-cyan-400" /><span className="text-sm font-medium">Level {level}</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-800/50 px-3 py-1 rounded-full">
              <FaCrown className="text-amber-400" /><span className="text-sm font-medium">Run: {runScore}</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-800/50 px-3 py-1 rounded-full">
              <FaCrown className="text-purple-400" /><span className="text-sm font-medium">Best: {best}</span>
            </div>
          </div>

          {(status === "showing" || status === "input") && (
            <div className="w-full bg-slate-700 rounded-full h-2 mb-6 overflow-hidden">
              <motion.div className="h-full bg-gradient-to-r from-cyan-500 to-purple-500"
                initial={{ width: "100%" }} animate={{ width: "0%" }}
                transition={{ duration: timeLeft, ease: "linear" }} />
            </div>
          )}

          <AnimatePresence>
            {status === "idle" && showTutorial && (
              <motion.div key="tutorial" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="mb-6 p-4 bg-slate-800/70 rounded-xl border border-cyan-500/30">
                <h4 className="font-semibold text-cyan-300 mb-2">How to Play</h4>
                <p className="text-sm text-slate-300 mb-3">
                  Watch the numbers flash, then click the same sequence. The pace quickens each level.
                </p>
                <div className="flex items-center text-xs text-slate-400 gap-4">
                  <div className="flex items-center gap-1"><FaClock className="text-cyan-400" /> Less time each level</div>
                  <div className="flex items-center gap-1"><FaCrown className="text-amber-400" /> Bonus for speed</div>
                </div>
              </motion.div>
            )}

            {status === "idle" && (
              <motion.div key="idle" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
                <button onClick={startGame}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-purple-600
                             hover:from-cyan-500 hover:to-purple-500 text-white font-semibold
                             flex items-center justify-center gap-2 mx-auto shadow-lg shadow-cyan-500/30
                             transition-all duration-300 hover:shadow-cyan-500/50">
                  <FaPlay /> Start Challenge
                </button>
              </motion.div>
            )}

            {status === "showing" && (
              <motion.div key="showing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mb-6">
                <div className="text-lg text-slate-300 mb-2">Memorize the sequence:</div>
                <div className="flex justify-center gap-3 flex-wrap">
                  {sequence.map((num, index) => (
                    <motion.span key={index} initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: index * 0.3 }}
                      className="inline-block w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-500
                                 text-white font-bold text-xl flex items-center justify-center shadow-lg">
                      {num}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            )}

            {status === "input" && (
              <motion.div key="input" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="text-lg text-slate-300 mb-4">Repeat the sequence:</div>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[1,2,3,4,5,6,7,8,9].map((n) => (
                    <NumberButton key={n} number={n} onClick={() => handleInput(n)}
                      isActive={userInput.length > 0 && userInput[userInput.length - 1] === n}/>
                  ))}
                </div>
                <div className="text-sm text-slate-400">
                  Your input: <span className="font-mono text-cyan-300">{userInput.join(" ")}</span>
                </div>
              </motion.div>
            )}

            {status === "success" && (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                className="text-green-400 flex flex-col items-center gap-3 py-4">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }} className="text-4xl">
                  <FaCheck />
                </motion.div>
                <div className="text-xl font-semibold">Perfect Memory!</div>
                <div className="text-amber-300">Run +{level * 100 + Math.floor(timeLeft * 10)} pts</div>
                <div className="text-sm text-slate-400">Advancing to level {level + 1}…</div>
              </motion.div>
            )}

            {status === "fail" && (
              <motion.div key="fail" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                className="text-rose-400 flex flex-col items-center gap-3 py-4">
                <div className="text-4xl">❌</div>
                <div className="text-xl font-semibold">Sequence Incorrect</div>
                <div className="text-slate-300 text-sm">
                  The sequence was: <span className="font-mono text-cyan-300">{sequence.join(" ")}</span>
                </div>
                <div className="flex gap-3 mt-2">
                  <button onClick={resetGame} className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white flex items-center gap-2">
                    <FaRedo /> New Game
                  </button>
                  <button onClick={startGame}
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-purple-600
                               hover:from-cyan-500 hover:to-purple-500 text-white flex items-center gap-2">
                    <FaPlay /> Try Again
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </section>
  );
}
