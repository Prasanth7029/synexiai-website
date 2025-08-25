// src/pages/games/GamesPage.jsx
import React, {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiZap, FiX } from "react-icons/fi";
import { FaGamepad } from "react-icons/fa";
import RoadmapUnlocker from "../../components/sections/RoadmapUnlocker.jsx";
import ScoreHUD from "../../components/games/ScoreHUD.jsx";
import { useProgress } from "@/context/ProgressContext.jsx";

/* -------------------------------------------------------------------------- */
/* Auto-discover every puzzle/game under components/puzzles/*.jsx             */
/* - eager for metadata (title, id, etc.)                                     */
/* - lazy for component code                                                  */
/* -------------------------------------------------------------------------- */
const modsLazy  = import.meta.glob("../../components/puzzles/*.jsx");
const modsEager = import.meta.glob("../../components/puzzles/*.jsx", { eager: true });

const toTitle = (p) =>
  p
    .split("/")
    .pop()
    .replace(".jsx", "")
    .replace(/([A-Z])/g, " $1")
    .replace(/[-_]/g, " ")
    .trim();

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

function useBodyScrollLock(locked) {
  useEffect(() => {
    const prev = document.body.style.overflow;
    if (locked) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev || "";
    };
  }, [locked]);
}

export default function GamesPage() {
  const query = useQuery();
  const navigate = useNavigate();
  const { canPlay, needForGame } = useProgress();

  /* ----------------------------- Build registry ---------------------------- */
  const games = useMemo(() => {
    const list = Object.entries(modsEager).map(([path, mod]) => {
      const meta = mod?.gameMeta || {};
      const id =
        (meta.id ||
          path.split("/").pop().replace(".jsx", "").toLowerCase())
          .replace(/\s+/g, "-");
      return {
        id,
        path,
        title: meta.title || toTitle(path),
        description: meta.description || "Play this mini-game.",
        thumbnail: meta.thumbnail || null,
        loader: modsLazy[path], // function that returns import()
      };
    });
    list.sort((a, b) => a.title.localeCompare(b.title));
    return list;
  }, []);

  const [openId, setOpenId] = useState(null);

  /* --------------------------- Sync from ?play= once ----------------------- */
  useEffect(() => {
    const want = query.get("play");
    if (want && games.some((g) => g.id === want)) {
      setOpenId((prev) => (prev ?? want));
    }
    // Only on mount / when games change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [games]);

  /* ---------------------------- Keep URL in sync --------------------------- */
  useEffect(() => {
    if (!games.length) return;
    const url = openId ? `/games?play=${openId}` : `/games`;
    // use replace to avoid polluting history on open/close
    navigate(url, { replace: true });
  }, [openId, games.length, navigate]);

  const active = openId ? games.find((g) => g.id === openId) : null;
  const onOpen = useCallback((id) => setOpenId(id), []);
  const onClose = useCallback(() => setOpenId(null), []);

  useBodyScrollLock(Boolean(openId));

  /* -------------------- Lazy-load active component on demand --------------- */
  const ActiveComp = useMemo(
    () => (active ? lazy(active.loader) : null),
    [active],
  );

  /* ------------------------------- ESC to close ---------------------------- */
  useEffect(() => {
    if (!openId) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openId, onClose]);

  /* ----------------------- Warm-preload on hover/idle ---------------------- */
  const idleIdRef = useRef(null);
  useEffect(() => {
    // Idle preload: fetch first card in view (optional micro-boost)
    if (!games.length) return;
    const prewarm = () => {
      const first = games[0];
      if (first?.loader) {
        // fire and forget; cache fills
        first.loader();
      }
    };
    if ("requestIdleCallback" in window) {
      idleIdRef.current = window.requestIdleCallback(prewarm, { timeout: 2000 });
    } else {
      idleIdRef.current = setTimeout(prewarm, 500);
    }
    return () => {
      if (idleIdRef.current) {
        if ("cancelIdleCallback" in window) {
          window.cancelIdleCallback(idleIdRef.current);
        } else {
          clearTimeout(idleIdRef.current);
        }
      }
    };
  }, [games]);

  return (
    <section className="min-h-screen py-10">
      <div className="mx-auto max-w-6xl px-4">
        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-3xl md:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400 mb-6"
        >
          SynexiAI — Games & Puzzles
        </motion.h1>

        <ScoreHUD />

        {/* Showcase Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {games.map((g) => {
            const playable = canPlay(g.id);
            const need = needForGame(g.id);
            const handleEnter = () => {
              // Preload module on hover/focus for instant open
              try {
                g.loader?.();
              } catch (_) {
                /* no-op */
              }
            };

            return (
              <button
                key={g.id}
                onMouseEnter={handleEnter}
                onFocus={handleEnter}
                onClick={() => playable && onOpen(g.id)}
                className="relative group text-left rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all p-0 overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                aria-label={`Open ${g.title}`}
                disabled={!playable}
                // NOTE: use real disabled to prevent accidental activation
              >
                {/* Thumbnail / fallback */}
                {g.thumbnail ? (
                  <img
                    src={g.thumbnail}
                    alt={`${g.title} thumbnail`}
                    className="w-full h-40 object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <div className="w-full h-40 bg-gradient-to-br from-cyan-600/30 to-blue-600/30 flex items-center justify-center">
                    <FaGamepad className="text-3xl opacity-80" aria-hidden="true" />
                  </div>
                )}

                <div className="p-4">
                  <h3 className="font-semibold">{g.title}</h3>
                  <p className="mt-1 text-sm opacity-80 line-clamp-2">
                    {g.description}
                  </p>
                  <div className="mt-3 inline-flex items-center gap-2 text-cyan-300 group-hover:text-white transition-colors">
                    Play now <span aria-hidden>→</span>
                  </div>
                </div>

                {!playable && (
                  <div
                    className="absolute inset-0 bg-black/60 grid place-items-center"
                    aria-hidden="true"
                  >
                    <div className="rounded-md border border-white/20 bg-black/70 px-3 py-1 text-sm">
                      Locked • need <b>{need}</b>
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Modal Player */}
      <AnimatePresence>
        {active && (
          <motion.div
            className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="game-dialog-title"
            aria-describedby="game-dialog-desc"
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) onClose();
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, y: 12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 12, scale: 0.98 }}
                transition={{ duration: 0.18 }}
                className="relative w-full max-w-3xl max-h-[90vh] rounded-2xl border border-white/10 bg-black/80 p-3 shadow-2xl overflow-hidden"
                onMouseDown={(e) => e.stopPropagation()}
              >
                {/* header */}
                <div className="flex items-center justify-between gap-3 px-2 py-1">
                  <div>
                    <h2 id="game-dialog-title" className="text-lg font-semibold">
                      {active.title}
                    </h2>
                    <p id="game-dialog-desc" className="text-xs opacity-70">
                      {active.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={onClose}
                      className="inline-flex items-center justify-center rounded-md border border-white/10 w-9 h-9 hover:bg-white/10"
                      aria-label="Close dialog"
                    >
                      <FiX aria-hidden="true" />
                    </button>
                  </div>
                </div>

                {/* content */}
                <div
                  className="mt-2 rounded-xl border border-white/10 bg-black/40 overflow-auto"
                  style={{ height: "calc(90vh - 80px)" }}
                >
                  <Suspense
                    fallback={
                      <div className="flex h-full items-center justify-center">
                        <FiZap className="text-3xl animate-pulse" aria-hidden="true" />
                        <span className="ml-2">Loading game…</span>
                      </div>
                    }
                  >
                    <div className="min-h-full">
                      {ActiveComp && <ActiveComp />}
                    </div>
                  </Suspense>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Roadmap unlocker below the grid */}
      <RoadmapUnlocker />
    </section>
  );
}
