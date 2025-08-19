// src/components/AIFactRotator.jsx
import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaLightbulb } from "react-icons/fa";
import { FiRefreshCw, FiCopy, FiCheck, FiAlertCircle } from "react-icons/fi";
import { fnUrl } from "../lib/api.js";

const FETCH_MS = 0.25 * 60 * 1000;     // 15 sec rotation
const TICK_MS  = 1000;              // countdown tick

export default function AIFactRotator({
  className = "",
  title = "AI Fact (every 15 sec)",
}) {
  const [fact, setFact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [lastFetchAt, setLastFetchAt] = useState(Date.now());
  const [now, setNow] = useState(Date.now());

  const fetchTimerRef = useRef(null);
  const tickTimerRef = useRef(null);
  const hiddenRef = useRef(typeof document !== "undefined" ? document.hidden : false);

  const timeLeft = Math.max(0, lastFetchAt + FETCH_MS - now);
  const progress = 1 - timeLeft / FETCH_MS; // 0..1

  const fetchFact = useCallback(async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const url = fnUrl("ai-fact"); // /.netlify/functions/ai-fact
      const res = await fetch(url, { method: "GET" });

      const ct = res.headers.get("content-type") || "";
      if (!ct.includes("application/json")) {
        const raw = await res.text();
        throw new Error(`Non-JSON response: ${raw.slice(0, 120)}…`);
      }

      const data = await res.json();
      if (!res.ok || data.ok === false) {
        throw new Error(data?.error || "Failed to load AI fact.");
      }

      setFact(data);
      setLastFetchAt(Date.now());
    } catch (e) {
      console.error("fact fetch failed", e);
      setErrorMsg(e?.message || "Couldn’t load a fact.");
      setFact({
        category: "Info",
        fact: "We’re refreshing facts. Please try again in a moment.",
        updatedAt: new Date().toISOString(),
      });
      setLastFetchAt(Date.now()); // keep countdown flowing
    } finally {
      setLoading(false);
    }
  }, []);

  // pause/resume when tab hidden
  useEffect(() => {
    const onVisibility = () => {
      hiddenRef.current = document.hidden;
      if (!document.hidden) fetchFact();
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [fetchFact]);

  // initial + 5-min interval
  useEffect(() => {
    fetchFact();
    fetchTimerRef.current = setInterval(() => {
      if (!hiddenRef.current) fetchFact();
    }, FETCH_MS);
    return () => clearInterval(fetchTimerRef.current);
  }, [fetchFact]);

  // per-second countdown tick
  useEffect(() => {
    tickTimerRef.current = setInterval(() => setNow(Date.now()), TICK_MS);
    return () => clearInterval(tickTimerRef.current);
  }, []);

  const onCopy = async () => {
    try {
      const text = fact ? `${fact.fact} — ${fact.category}` : "";
      await navigator.clipboard?.writeText?.(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      // ignore
    }
  };

  const onShuffle = () => fetchFact();

  return (
    <section
      aria-live="polite"
      className={[
        // gradient border shell
        "relative p-[1.25px] rounded-2xl bg-gradient-to-r",
        "from-cyan-500/60 via-blue-500/60 to-violet-600/60",
        "shadow-[0_0_40px_-10px_rgba(56,189,248,0.35)]",
        className,
      ].join(" ")}
    >
      {/* inner card */}
      <div className="rounded-2xl bg-[var(--card-bg)] text-[var(--card-text)] backdrop-blur-sm border border-[var(--border-color)]">
        {/* header */}
        <div className="flex items-center justify-between px-4 sm:px-6 pt-4 sm:pt-5">
          <div className="flex items-center gap-3">
            <span className="inline-grid place-items-center w-9 h-9 rounded-xl bg-gradient-to-br from-amber-300/80 to-yellow-500/80 text-black shadow">
              <FaLightbulb aria-hidden />
            </span>
            <h3 className="text-base sm:text-lg md:text-xl font-semibold">
              {title}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <CategoryPill label={fact?.category || "—"} />
          </div>
        </div>

        {/* body */}
        <div className="px-4 sm:px-6 py-4">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="skeleton"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="space-y-3"
              >
                <div className="h-5 w-11/12 rounded-md bg-white/5 overflow-hidden">
                  <div className="h-full w-1/2 bg-white/10 animate-[shimmer_1.2s_infinite]" />
                </div>
                <div className="h-5 w-9/12 rounded-md bg-white/5 overflow-hidden">
                  <div className="h-full w-2/3 bg-white/10 animate-[shimmer_1.2s_infinite]" />
                </div>
                <style>{`
                  @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(200%); }
                  }
                `}</style>
              </motion.div>
            ) : (
              <motion.div
                key={fact?.updatedAt || "fact"}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="space-y-2"
              >
                <p className="text-[1.05rem] leading-relaxed tracking-[0.01em]">
                  {fact?.fact}
                </p>

                <div className="flex flex-wrap items-center gap-3 text-xs opacity-75">
                  <span>
                    Updated:&nbsp;
                    {fact?.updatedAt
                      ? new Date(fact.updatedAt).toLocaleTimeString()
                      : "—"}
                  </span>

                  {errorMsg && (
                    <span className="inline-flex items-center gap-1 text-rose-400">
                      <FiAlertCircle aria-hidden /> {errorMsg}
                    </span>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* footer actions + countdown */}
        <div className="px-4 sm:px-6 pb-4 sm:pb-5">
          <div className="flex items-center justify-between gap-3">
            {/* progress bar */}
            <div className="flex-1">
              <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500"
                  initial={false}
                  animate={{ width: `${Math.round(progress * 100)}%` }}
                  transition={{ type: "tween", duration: 0.9 }}
                />
              </div>
              <div className="mt-1 text-[11px] opacity-70">
                Next refresh in {formatTime(timeLeft)}
              </div>
            </div>

            {/* actions */}
            <div className="flex items-center gap-2">
              <ActionBtn
                title="Shuffle now"
                onClick={onShuffle}
                disabled={loading}
                icon={<FiRefreshCw className={loading ? "animate-spin" : ""} />}
              />
              <ActionBtn
                title={copied ? "Copied!" : "Copy fact"}
                onClick={onCopy}
                icon={copied ? <FiCheck /> : <FiCopy />}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------- Subcomponents ------------------------------ */

function CategoryPill({ label }) {
  return (
    <span
      className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full border border-[var(--border-color)]
                 bg-white/2 text-xs tracking-wide backdrop-blur-[1px]"
    >
      <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500" />
      {label}
    </span>
  );
}

function ActionBtn({ title, onClick, icon, disabled }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={[
        "group inline-flex items-center gap-2 text-sm px-3.5 py-2 rounded-xl",
        "bg-gradient-to-br from-white/10 to-white/5 hover:from-white/15 hover:to-white/10",
        "border border-[var(--border-color)] shadow-sm",
        "transition active:scale-[0.98] disabled:opacity-60",
      ].join(" ")}
    >
      <span className="grid place-items-center">{icon}</span>
      <span className="whitespace-nowrap">{title}</span>
      <span className="pointer-events-none absolute inset-0 rounded-xl
                       opacity-0 group-hover:opacity-100 transition
                       blur-[6px] bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-violet-500/10" />
    </button>
  );
}

/* ---------------------------------- Utils ---------------------------------- */

function formatTime(ms) {
  const s = Math.max(0, Math.round(ms / 1000));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${String(r).padStart(2, "0")}`;
}
