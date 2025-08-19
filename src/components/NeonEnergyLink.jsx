import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiRefreshCw, FiZap, FiHelpCircle, FiClock, FiTarget, FiInfo } from "react-icons/fi";
import { FaTrophy } from "react-icons/fa";

/**
 * Tile types (pipe shapes):
 * 0: straight ─ (left-right)
 * 1: straight │ (top-bottom)
 * 2: elbow └ (top-right)   rot90 cycles elbow direction
 * 3: elbow ┘ (top-left)
 * 4: elbow ┌ (bottom-right)
 * 5: elbow ┐ (bottom-left)
 * 6: tee ┴ (top-left-right)
 * 7: tee ┬ (bottom-left-right)
 * 8: tee ┤ (top-bottom-left)
 * 9: tee ├ (top-bottom-right)
 * 10: cross ┼ (all four)
 */
const ALL_TYPES = [0,1,2,3,4,5,6,7,8,9,10];
const DEFAULT_SIZE = 6; // 6x6 board

/** For each type+rotation, what directions are open? */
function openings(type, rot) {
  const rot4 = ((rot % 4) + 4) % 4;
  switch (type) {
    case 0: return rot4 % 2 === 0 ? ["L","R"] : ["U","D"];
    case 1: return rot4 % 2 === 0 ? ["U","D"] : ["L","R"];
    case 2: return rotateDirs(["U","R"], rot4);
    case 3: return rotateDirs(["U","L"], rot4);
    case 4: return rotateDirs(["D","R"], rot4);
    case 5: return rotateDirs(["D","L"], rot4);
    case 6: return rotateDirs(["U","L","R"], rot4);
    case 7: return rotateDirs(["D","L","R"], rot4);
    case 8: return rotateDirs(["U","D","L"], rot4);
    case 9: return rotateDirs(["U","D","R"], rot4);
    case 10: return ["U","D","L","R"];
    default: return [];
  }
}
function rotateDirs(dirs, times) {
  const map = { U:0, R:1, D:2, L:3 };
  const rmap = ["U","R","D","L"];
  return dirs.map(d => rmap[(map[d] + times) % 4]);
}
function neighbor(x,y, dir) {
  if (dir==="U") return [x, y-1, "D"];
  if (dir==="D") return [x, y+1, "U"];
  if (dir==="L") return [x-1, y, "R"];
  if (dir==="R") return [x+1, y, "L"];
  return [x,y,""];
}
function inBounds(x,y, size) { return x>=0 && y>=0 && x<size && y<size; }

/** Build a randomized board with a guaranteed solvable backbone path */
function makeBoard(size) {
  // Create empty
  const cells = Array.from({length: size}, () =>
    Array.from({length: size}, () => ({ type: 0, rot: 0 }))
  );
  // Lay a random snake-like path from (0,0) to (size-1,size-1)
  const path = [[0,0]];
  let cx = 0, cy = 0;
  while (cx !== size-1 || cy !== size-1) {
    const moves = [];
    if (cx < size-1) moves.push([cx+1, cy]); // right
    if (cy < size-1) moves.push([cx, cy+1]); // down
    if (Math.random() < 0.25 && cx > 0) moves.push([cx-1, cy]); // occasional left
    if (Math.random() < 0.25 && cy > 0) moves.push([cx, cy-1]); // occasional up
    // pick next that doesn't go out of bounds too often and avoids repeats
    moves.sort(() => Math.random()-0.5);
    let moved = false;
    for (const [nx,ny] of moves) {
      if (!inBounds(nx,ny, size)) continue;
      const key = `${nx}:${ny}`;
      const seen = new Set(path.map(p => `${p[0]}:${p[1]}`));
      if (seen.has(key) && (nx!==size-1 || ny!==size-1)) continue;
      cx=nx; cy=ny; path.push([cx,cy]); moved=true; break;
    }
    if (!moved) {
      // fallback: step right or down
      if (cx < size-1) cx++;
      else if (cy < size-1) cy++;
      path.push([cx,cy]);
    }
  }
  // Convert backbone path segments into suitable pipe types + rotations
  const board = cells.map(row => row.map(_=>({type:2,rot:0})));
  const dirsOf = (a,b) => {
    const dx = b[0]-a[0], dy=b[1]-a[1];
    if (dx===1) return "R";
    if (dx===-1) return "L";
    if (dy===1) return "D";
    return "U";
  };
  for (let i=0;i<path.length;i++){
    const [x,y]=path[i];
    const need = new Set();
    if (i>0) need.add(dirsOf(path[i], path[i-1]));
    if (i<path.length-1) need.add(dirsOf(path[i], path[i+1]));
    // choose tile with exactly those openings (2 for elbow/straight, 3 for tee on turns)
    const combos = [
      { type:10, rots:[0,1,2,3] }, // cross (always works; we'll rotate later)
      { type:0, rots:[0,1,2,3] },  // straights
      { type:1, rots:[0,1,2,3] },
      { type:2, rots:[0,1,2,3] },{ type:3, rots:[0,1,2,3] },
      { type:4, rots:[0,1,2,3] },{ type:5, rots:[0,1,2,3] },
      { type:6, rots:[0,1,2,3] },{ type:7, rots:[0,1,2,3] },
      { type:8, rots:[0,1,2,3] },{ type:9, rots:[0,1,2,3] },
    ];
    let picked = null;
    for (const c of combos) {
      for (const r of c.rots) {
        const o = openings(c.type, r);
        if (need.size<=o.length && [...need].every(d=>o.includes(opposite(d)))) {
          picked = {type:c.type, rot:r}; break;
        }
      }
      if (picked) break;
    }
    if (!picked) picked = { type:10, rot: 0 };
    board[y][x] = picked;
  }
  // Randomize rotations to create the actual puzzle, plus sprinkle decorative pieces
  for (let y=0;y<size;y++){
    for (let x=0;x<size;x++){
      const base = board[y][x];
      const addNoise = Math.random()<0.35;
      const t = addNoise ? ALL_TYPES[Math.floor(Math.random()*ALL_TYPES.length)] : base.type;
      const r = Math.floor(Math.random()*4);
      board[y][x] = { type: t, rot: r };
    }
  }
  return board;
}
function opposite(d){ return d==="U"?"D":d==="D"?"U":d==="L"?"R":"L"; }

// tiny hook for viewport width (mobile friendly)
function useViewportWidth() {
  const [w, setW] = useState(
    typeof window !== "undefined" ? window.innerWidth : 390,
  );
  useEffect(() => {
    const on = () => setW(window.innerWidth);
    window.addEventListener("resize", on);
    return () => window.removeEventListener("resize", on);
  }, []);
  return w;
}

function useTick(ms, fn) {
  useEffect(() => {
    const t = setInterval(fn, ms);
    return () => clearInterval(t);
  }, [ms, fn]);
}

function computeFlow(board, src, dst, size) {
  // BFS along matching openings
  const q = [[src.x, src.y]];
  const seen = new Set([`${src.x}:${src.y}`]);
  const pathSet = new Set();

  while (q.length) {
    const [x,y] = q.shift();
    pathSet.add(`${x}:${y}`);

    // Check if cell exists
    if (!board[y] || !board[y][x]) continue;

    const cell = board[y][x];
    const outs = openings(cell.type, cell.rot);

    for (const d of outs) {
      const [nx,ny,need] = neighbor(x,y,d);

      // Check if neighbor is in bounds and exists
      if (!inBounds(nx,ny, size) || !board[ny] || !board[ny][nx]) continue;

      const next = board[ny][nx];
      const opensBack = openings(next.type, next.rot).includes(need);

      if (opensBack) {
        const key = `${nx}:${ny}`;
        if (!seen.has(key)) {
          seen.add(key);
          q.push([nx,ny]);
        }
      }
    }
  }

  return { connected: seen.has(`${dst.x}:${dst.y}`), pathSet };
}

function formatTime(s) {
  const mm = Math.floor(s/60), ss = s%60;
  return `${mm}:${String(ss).padStart(2,"0")}`;
}

/* --------------------------- visual subcomponents --------------------------- */

function Badge({ icon, label }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg border border-white/15 bg-white/10 text-xs">
      <span className="opacity-80">{icon}</span>
      <span className="tracking-wide">{label}</span>
    </span>
  );
}

function CornerMark({ className = "" }) {
  return (
    <span className={`absolute w-3 h-3 rounded-md bg-gradient-to-br ${className} shadow`} />
  );
}

function TileArt({ type, rot, glow, size }) {
  // simple SVG-based pipe + neon glow
  const dirs = openings(type, rot);
  const on = (d) => dirs.includes(d);
  const strokeWidth = size > 6 ? 12 : 14;
  const circleRadius = size > 6 ? 8 : 10;

  return (
    <svg viewBox="0 0 100 100" className="absolute inset-0">
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2.8" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id="pipeGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="rgb(34,211,238)" />
          <stop offset="100%" stopColor="rgb(139,92,246)" />
        </linearGradient>
        <radialGradient id="jointGrad">
          <stop offset="0%" stopColor="rgba(34,211,238,0.9)" />
          <stop offset="100%" stopColor="rgba(139,92,246,0.6)" />
        </radialGradient>
      </defs>
      {/* base grid light */}
      <rect x="0" y="0" width="100" height="100" fill="transparent" />
      {/* pipes */}
      {on("U") && <PipeSeg x1={50} y1={0} x2={50} y2={50} glow={glow} strokeWidth={strokeWidth} />}
      {on("D") && <PipeSeg x1={50} y1={50} x2={50} y2={100} glow={glow} strokeWidth={strokeWidth} />}
      {on("L") && <PipeSeg x1={0} y1={50} x2={50} y2={50} glow={glow} strokeWidth={strokeWidth} />}
      {on("R") && <PipeSeg x1={50} y1={50} x2={100} y2={50} glow={glow} strokeWidth={strokeWidth} />}
      {/* joint */}
      <circle
        cx="50" cy="50" r={circleRadius}
        stroke="rgba(255,255,255,0.7)" strokeWidth="2"
        fill={glow ? "url(#jointGrad)" : "rgba(255,255,255,0.18)"}
        style={{ filter: glow ? "url(#glow)" : "none" }}
      />
    </svg>
  );
}

function PipeSeg({ x1,y1,x2,y2, glow, strokeWidth }) {
  return (
    <line
      x1={x1} y1={y1} x2={x2} y2={y2}
      stroke={glow ? "url(#pipeGrad)" : "rgba(255,255,255,0.55)"}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      style={{ filter: glow ? "url(#glow)" : "none" }}
    />
  );
}

export default function NeonEnergyLink({
  size = DEFAULT_SIZE,
  onWin = () => {},
}) {
  const [board, setBoard] = useState(() => makeBoard(size));
  const [moves, setMoves] = useState(0);
  const [startAt] = useState(() => Date.now());
  const [done, setDone] = useState(false);
  const [hint, setHint] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [difficulty, setDifficulty] = useState(size);
  const [best, setBest] = useState(() => {
    try { return Number(localStorage.getItem("sx_energy_best")||0); } catch { return 0; }
  });

  const vw = useViewportWidth();

  // --- Improved Mobile-first tile sizing ---
  // Estimate available content width, cap at common mobile widths, and adjust for gaps
  const contentMax = Math.min(vw - 32, 420); // Tighter cap for mobile
  const tilePx = Math.max(
    32, // Minimum for touch targets
    Math.min(60, Math.floor((contentMax - 4 * (size - 1)) / size)) // Reduced gap to 4px for denser layout on small screens
  );

  // fixed endpoints
  const src = { x:0, y:0 };
  const dst = { x:size-1, y:size-1 };

  const elapsed = Math.max(0, Math.floor((Date.now() - startAt)/1000));
  useTick(500, () => { /* just to refresh timer */ });

  const flow = useMemo(() => computeFlow(board, src, dst, size), [board, size]);

  useEffect(() => {
    if (flow.connected && !done) {
      setDone(true);
      const score = Math.max(10, Math.floor(10000 / (1 + moves * 7 + elapsed)));
      const nextBest = Math.max(best, score);
      setBest(nextBest);
      try { localStorage.setItem("sx_energy_best", String(nextBest)); } catch {}
      onWin({ moves, elapsed, score });
    }
  }, [flow.connected, done, moves, elapsed, best, onWin]);

  const rotate = (x,y) => {
    if (done) return;
    setBoard(prev => {
      const next = prev.map(row => row.slice());
      next[y][x] = { ...next[y][x], rot: (next[y][x].rot + 1) % 4 };
      return next;
    });
    setMoves(m => m+1);
  };

  const reset = () => {
    setBoard(makeBoard(size));
    setMoves(0);
    setDone(false);
    setHint(false);
  };

  const changeDifficulty = (newSize) => {
    setDifficulty(newSize);
    setBoard(makeBoard(newSize));
    setMoves(0);
    setDone(false);
    setHint(false);
  };

  return (
    <div

    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3 sm:mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 sm:w-9 sm:h-9 grid place-items-center rounded-xl bg-gradient-to-br from-emerald-300/80 to-cyan-500/80 text-black shadow">
            <FiZap className="text-base sm:text-lg" />
          </div>
          <div>
            <h3 className="text-base sm:text-xl font-semibold">Neon Grid — Energy Link</h3>
            <p className="text-[11px] sm:text-xs opacity-70">
              Rotate tiles to link the <strong>source</strong> to the <strong>core</strong>.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-[11px] sm:text-xs self-stretch sm:self-auto">
          <Badge icon={<FiClock />} label={formatTime(elapsed)} />
          <Badge icon={<FiTarget />} label={`${moves} moves`} />
          <Badge icon={<FaTrophy />} label={`Best ${best}`} />
        </div>
      </div>

      {/* Difficulty */}
      <div className="mb-3 sm:mb-4 flex flex-wrap gap-2">
        <span className="text-[11px] sm:text-xs opacity-70 self-center">Difficulty:</span>
        {[4,5,6,7].map(level => (
          <button
            key={level}
            onClick={() => changeDifficulty(level)}
            className={`px-2 py-0.5 sm:px-2.5 sm:py-1 text-[11px] sm:text-xs rounded-lg border ${
              difficulty === level
                ? "border-cyan-400 bg-cyan-400/10 text-cyan-300"
                : "border-white/20 bg-white/5 hover:bg-white/10"
            }`}
          >
            {level === 4 ? "Easy" : level === 5 ? "Medium" : level === 6 ? "Hard" : "Expert"}
          </button>
        ))}
        <button
          onClick={() => setShowInstructions(v => !v)}
          className="ml-auto px-2 py-0.5 sm:px-2.5 sm:py-1 text-[11px] sm:text-xs rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 flex items-center gap-1"
        >
          <FiInfo size={14} /> Help
        </button>
      </div>

      {/* Instructions */}
      <AnimatePresence>
        {showInstructions && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-3 sm:mb-4 overflow-hidden"
          >
            <div className="text-[12px] sm:text-sm rounded-xl border border-white/15 bg-white/10 p-2.5 sm:p-3">
              <h4 className="font-medium mb-1.5 sm:mb-2">How to Play:</h4>
              <ul className="list-disc pl-4 space-y-1 text-[11px] sm:text-xs opacity-90">
                <li>Tap tiles to rotate and form a continuous path</li>
                <li>Connect <span className="text-emerald-300">source</span> (top-left) to the <span className="text-purple-300">core</span> (bottom-right)</li>
                <li>Openings must match between neighbors</li>
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Board Wrapper - Constrained and scrollable if needed */}
        <div
          className="overflow-auto max-w-full mx-auto"
          style={{ maxHeight: 'calc(100vh - 200px)' }} // Prevent full-screen takeover
        >
          <div
            className="grid gap-1 sm:gap-2 mx-auto"
            style={{ gridTemplateColumns: `repeat(${size}, ${tilePx}px)` }}
          >
            {board.map((row, y) =>
              row.map((cell, x) => {
                const isSource = x === 0 && y === 0;
                const isDest = x === size - 1 && y === size - 1;
                const isPath = flow.pathSet.has(`${x}:${y}`);
                return (
                  <motion.button
                    key={`${x}-${y}`}
                    onClick={() => rotate(x, y)}
                    whileTap={{ scale: 0.96 }}
                    className={[
                      "relative rounded-lg sm:rounded-xl border transition-colors",
                      "bg-white/5 border-white/10 hover:bg-white/10",
                      isPath ? "ring-2 ring-cyan-400/70 bg-cyan-400/5" : "ring-0",
                    ].join(" ")}
                    style={{ width: tilePx, height: tilePx, minWidth: tilePx, minHeight: tilePx }}
                  >
                    <TileArt type={cell.type} rot={cell.rot} glow={isPath} size={size} />
                    {isSource && <CornerMark className="left-1 top-1 from-emerald-300 to-cyan-400" />}
                    {isDest && <CornerMark className="right-1 bottom-1 from-fuchsia-300 to-violet-500" />}
                  </motion.button>
                );
              })
            )}
          </div>
        </div>

      {/* Controls */}
      <div className="mt-3 sm:mt-4 flex flex-wrap items-center gap-2">
        <button
          onClick={reset}
          className="px-3 py-1.5 rounded-xl border border-white/20 bg-white/10 hover:bg-white/15 flex items-center gap-2 text-sm"
        >
          <FiRefreshCw size={16} /> New Grid
        </button>
        <button
          onClick={() => setHint(h => !h)}
          className="px-3 py-1.5 rounded-xl border border-white/20 bg-white/10 hover:bg-white/15 flex items-center gap-2 text-sm"
        >
          <FiHelpCircle size={16} /> {hint ? "Hide Hint" : "Show Hint"}
        </button>
        <div className="ml-auto text-[11px] sm:text-xs opacity-75 hidden sm:block">
          Connect all the way to light up the core.
        </div>
      </div>

      {/* Hint */}
      <AnimatePresence>
        {hint && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="mt-3 text-[12px] sm:text-sm rounded-xl border border-white/15 bg-white/10 p-3"
          >
            Tip: Start at the <strong>source</strong> and walk the openings to the <strong>core</strong>.
          </motion.div>
        )}
      </AnimatePresence>

      {/* Win state */}
      <AnimatePresence>
        {done && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="mt-3 sm:mt-4 rounded-xl border border-white/15 bg-gradient-to-r from-emerald-400/15 to-cyan-400/10 p-3 sm:p-4"
          >
            <div className="text-emerald-300 font-semibold flex items-center gap-2">
              <FiZap className="text-cyan-400" /> Core linked! Clean energy flowing. ⚡️
            </div>
            <div className="text-sm opacity-80 mt-1">Time: {formatTime(elapsed)} • Moves: {moves}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}