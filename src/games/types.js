// src/games/types.js
export const DEFAULT_GAME_META = {
  id: "",            // unique id, e.g., "pipe-flow"
  title: "",         // display name
  description: "",   // short rules
  author: "SynexiAI",
  minScoreToWin: 1,  // simple, can be anything per game
};

export function makeGameMeta(meta) {
  return { ...DEFAULT_GAME_META, ...meta };
}
