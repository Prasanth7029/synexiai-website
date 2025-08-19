import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiRefreshCw, FiZap, FiHelpCircle, FiClock, FiTarget } from "react-icons/fi";
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
const SIZE = 6; // 6x6 board (great on mobile too)

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
function inBounds(x,y) { return x>=0 && y>=0 && x<SIZE && y<SIZE; }

/** Build a randomized board with a guaranteed solvable backbone path */
function makeBoard() {
  // Create empty
  const cells = Array.from({length: SIZE}, () =>
    Array.from({length: SIZE}, () => ({ type: 0, rot: 0 }))
  );
  // Lay a random snake-like path from (0,0) to (SIZE-1,SIZE-1)
  const path = [[0,0]];
  let cx = 0, cy = 0;
  while (cx !== SIZE-1 || cy !== SIZE-1) {
    const moves = [];
    if (cx < SIZE-1) moves.push([cx+1, cy]); // right
    if (cy < SIZE-1) moves.push([cx, cy+1]); // down
    if (Math.random() < 0.25 && cx > 0) moves.push([cx-1, cy]); // occasional left
    if (Math.random() < 0.25 && cy > 0) moves.push([cx, cy-1]); // occasional up
    // pick next that doesn't go out of bounds too often and avoids repeats
    moves.sort(() => Math.random()-0.5);
    let moved = false;
    for (const [nx,ny] of moves) {
      if (!inBounds(nx,ny)) continue;
      const key = `${nx}:${ny}`;
      const seen = new Set(path.map(p => `${p[0]}:${p[1]}`));
      if (seen.has(key) && (nx!==SIZE-1 || ny!==SIZE-1)) continue;
      cx=nx; cy=ny; path.push([cx,cy]); moved=true; break;
    }
    if (!moved) {
      // fallback: step right or down
      if (cx < SIZE-1) cx++;
      else if (cy < SIZE-1) cy++;
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
      { type:10, rots:[0,1,2,3] }, // cross (always works; we’ll rotate later)
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
  for (let y=0;y<SIZE;y++){
    for (let x=0;x<SIZE;x++){
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

export default function NeonEnergyLink({
  size = SIZE,
  onWin = () => {},
}) {
  const [board, setBoard] = useState(() => makeBoard());
  const [moves, setMoves] = useState(0);
  const [startAt] = useState(() => Date.now());
  const [done, setDone] = useState(false);
  const [hint, setHint] = useState(false);
  const [best, setBest] = useState(() => {
    try { return Number(localStorage.getItem("sx_energy_best")||0); } catch { return 0; }
  });

  // fixed endpoints
  const src = { x:0, y:0 };
  const dst = { x:size-1, y:size-1 };

  const elapsed = Math.max(0, Math.floor((Date.now() - startAt)/1000));
  useTick(500, () => { /* just to refresh timer */ });

  const flow = useMemo(() => computeFlow(board, src, dst), [board]);

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
    setBoard(makeBoard());
    setMoves(0);
    setDone(false);
    setHint(false);
  };

  return (
    <div className="rounded-2xl border border-white/15 bg-[rgba(255,255,255,0.06)] backdrop-blur-xl p-2 sm:p-3 shadow-[0_20px_60px_-10px_rgba(56,189,248,0.35)]">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 grid place-items-center rounded-xl bg-gradient-to-br from-emerald-300/80 to-cyan-500/80 text-black shadow">
            <FiZap />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-semibold">Neon Grid — Energy Link</h3>
            <p className="text-xs opacity-70">Rotate tiles to link the **source** (top‑left) to the **core** (bottom‑right).</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <Badge icon={<FiClock />} label={`${formatTime(elapsed)}`} />
          <Badge icon={<FiTarget />} label={`${moves} moves`} />
          <Badge icon={<FaTrophy />} label={`Best ${best}`} />
        </div>
      </div>

      {/* Board */}
      <div
        className="mt-4 grid gap-1 sm:gap-1.5"
        style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}
      >
        {board.map((row, y) =>
          row.map((cell, x) => {
            const isSource = x===src.x && y===src.y;
            const isDest = x===dst.x && y===dst.y;
            const isPath = flow.pathSet.has(`${x}:${y}`);
            return (
              <motion.button
                key={`${x}-${y}`}
                onClick={() => rotate(x,y)}
                whileTap={{ scale: 0.96 }}
                className={[
                  "aspect-square rounded-xl relative border",
                  "bg-white/5 border-white/10 hover:bg-white/10",
                  isPath ? "ring-2 ring-cyan-400/70" : "ring-0",
                ].join(" ")}
              >
                {/* tile art */}
                <TileArt type={cell.type} rot={cell.rot} glow={isPath} />
                {/* markers */}
                {isSource && <CornerMark className="left-1 top-1 from-emerald-300 to-cyan-400" />}
                {isDest && <CornerMark className="right-1 bottom-1 from-fuchsia-300 to-violet-500" />}
              </motion.button>
            );
          })
        )}
      </div>

      {/* Controls */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button
          onClick={reset}
          className="px-3 py-1.5 rounded-xl border border-white/20 bg-white/10 hover:bg-white/15 flex items-center gap-2"
        >
          <FiRefreshCw /> New Grid
        </button>
        <button
          onClick={() => setHint(h => !h)}
          className="px-3 py-1.5 rounded-xl border border-white/20 bg-white/10 hover:bg-white/15 flex items-center gap-2"
        >
          <FiHelpCircle /> {hint ? "Hide Hint" : "Show Hint"}
        </button>

        <div className="ml-auto text-xs opacity-75">
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
            className="mt-3 text-sm rounded-xl border border-white/15 bg-white/10 p-3"
          >
            Tip: focus on ensuring openings match between neighbors. Start from the **source** tile.
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
            className="mt-4 rounded-xl border border-white/15 bg-gradient-to-r from-emerald-400/15 to-cyan-400/10 p-4"
          >
            <div className="text-emerald-300 font-semibold">Core linked! Clean energy flowing. ⚡️</div>
            <div className="text-sm opacity-80 mt-1">Time {formatTime(elapsed)} • Moves {moves}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* --------------------------- visual subcomponents --------------------------- */

function Badge({ icon, label }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg border border-white/15 bg-white/10">
      <span className="opacity-80">{icon}</span>
      <span className="tracking-wide">{label}</span>
    </span>
  );
}

function CornerMark({ className="" }) {
  return (
    <span className={`absolute w-3 h-3 rounded-md bg-gradient-to-br ${className} shadow`} />
  );
}

function TileArt({ type, rot, glow }) {
  // simple SVG-based pipe + neon glow
  const dirs = openings(type, rot);
  const on = (d) => dirs.includes(d);
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
      </defs>
      {/* base grid light */}
      <rect x="0" y="0" width="100" height="100" fill="transparent" />
      {/* pipes */}
      {on("U") && <PipeSeg x1={50} y1={0} x2={50} y2={50} glow={glow} />}
      {on("D") && <PipeSeg x1={50} y1={50} x2={50} y2={100} glow={glow} />}
      {on("L") && <PipeSeg x1={0} y1={50} x2={50} y2={50} glow={glow} />}
      {on("R") && <PipeSeg x1={50} y1={50} x2={100} y2={50} glow={glow} />}
      {/* joint */}
      <circle
        cx="50" cy="50" r="10"
        stroke="rgba(255,255,255,0.7)" strokeWidth="2"
        fill={glow ? "url(#g1)" : "rgba(255,255,255,0.18)"}
        style={{ filter: glow ? "url(#glow)" : "none" }}
      />
      <defs>
        <radialGradient id="g1">
          <stop offset="0%" stopColor="rgba(34,211,238,0.9)" />
          <stop offset="100%" stopColor="rgba(139,92,246,0.6)" />
        </radialGradient>
      </defs>
    </svg>
  );
}

function PipeSeg({ x1,y1,x2,y2, glow }) {
  return (
    <line
      x1={x1} y1={y1} x2={x2} y2={y2}
      stroke={glow ? "url(#grad)" : "rgba(255,255,255,0.55)"}
      strokeWidth="14" strokeLinecap="round"
      style={{ filter: glow ? "url(#glow)" : "none" }}
    >
      <defs>
        <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="rgb(34,211,238)" />
          <stop offset="100%" stopColor="rgb(139,92,246)" />
        </linearGradient>
      </defs>
    </line>
  );
}

/* --------------------------------- helpers --------------------------------- */

function useTick(ms, fn) {
  useEffect(() => {
    const t = setInterval(fn, ms);
    return () => clearInterval(t);
  }, [ms, fn]);
}
function computeFlow(board, src, dst) {
  // BFS along matching openings
  const q = [[src.x, src.y]];
  const seen = new Set([`${src.x}:${src.y}`]);
  const pathSet = new Set();
  while (q.length) {
    const [x,y] = q.shift();
    pathSet.add(`${x}:${y}`);
    const cell = board[y][x];
    const outs = openings(cell.type, cell.rot);
    for (const d of outs) {
      const [nx,ny,need] = neighbor(x,y,d);
      if (!inBounds(nx,ny)) continue;
      const next = board[ny][nx];
      const opensBack = openings(next.type, next.rot).includes(need);
      if (opensBack) {
        const key = `${nx}:${ny}`;
        if (!seen.has(key)) { seen.add(key); q.push([nx,ny]); }
      }
    }
  }
  return { connected: seen.has(`${dst.x}:${dst.y}`), pathSet };
}
function formatTime(s) {
  const mm = Math.floor(s/60), ss = s%60;
  return `${mm}:${String(ss).padStart(2,"0")}`;
}
