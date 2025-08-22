// src/games/ScoreContext.jsx
import React, { createContext, useContext, useMemo, useState } from "react";

const ScoreCtx = createContext(null);
export function useScore() { return useContext(ScoreCtx); }

export function ScoreProvider({ children }) {
  const [scores, setScores] = useState({}); // { [gameId]: { best:number, last:number, wins:number, plays:number } }

  const api = useMemo(() => ({
    record(gameId, delta, won=false) {
      setScores(prev => {
        const cur = prev[gameId] || { best: 0, last: 0, wins: 0, plays: 0 };
        const last = Math.max(0, cur.last + delta);
        const best = Math.max(cur.best, last);
        return {
          ...prev,
          [gameId]: {
            best,
            last,
            wins: cur.wins + (won ? 1 : 0),
            plays: cur.plays + 1,
          }
        };
      });
    },
    snapshot: () => scores,
    reset(gameId) {
      setScores(prev => ({ ...prev, [gameId]: { best:0,last:0,wins:0,plays:0 } }));
    },
  }), [scores]);

  return <ScoreCtx.Provider value={api}>{children}</ScoreCtx.Provider>;
}
