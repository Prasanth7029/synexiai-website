// src/components/AIFactRotator.jsx — updated
// - Fixes: stale cache on Shuffle/interval, stable UI key, Explain-with-AI handoff
// - Notes:
//   * Ensure your Netlify function returns no-store headers (see snippet below)
//   * ChatWidget should listen for the "chatwidget:open" event to prefill input

import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaLightbulb, FaRobot } from "react-icons/fa";
import { FiRefreshCw, FiCopy, FiCheck, FiAlertCircle, FiShare } from "react-icons/fi";
import { fnUrl } from "../lib/api.js";

const FETCH_MS = 0.75 * 60 * 1000; // 15s rotation
const TICK_MS = 1000;               // countdown tick

export default function AIFactRotator({
  className = "",
  title = "AI Insights",
  subtitle = "Fresh knowledge every 45 seconds",
}) {
  const [fact, setFact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [lastFetchAt, setLastFetchAt] = useState(Date.now());
  const [now, setNow] = useState(Date.now());
  const [isHovered, setIsHovered] = useState(false);

  const fetchTimerRef = useRef(null);
  const tickTimerRef = useRef(null);
  const hiddenRef = useRef(typeof document !== "undefined" ? document.hidden : false);

  const timeLeft = Math.max(0, lastFetchAt + FETCH_MS - now);
  const progress = 1 - timeLeft / FETCH_MS; // 0..1

  const fetchFact = useCallback(async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const url = `${fnUrl("ai-fact")}?t=${Date.now()}`; // cache-buster
      const res = await fetch(url, {
        method: "GET",
        cache: "no-store",
        headers: { "Cache-Control": "no-cache" },
      });

      const ct = res.headers.get("content-type") || "";
      if (!ct.includes("application/json")) {
        const raw = await res.text();
        throw new Error(`Non-JSON response: ${raw.slice(0, 120)}…`);
      }

      const data = await res.json();
      if (!res.ok || data.ok === false) {
        throw new Error(data?.error || "Failed to load AI fact.");
      }

      // Force a fresh UI key on every successful fetch
      setFact({ ...data, updatedAt: new Date().toISOString() });
      setLastFetchAt(Date.now());
    } catch (e) {
      console.error("fact fetch failed", e);
      setErrorMsg(e?.message || "Couldn't load a fact.");
      setFact({
        category: "Info",
        fact: "We're refreshing facts. Please try again in a moment.",
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

  // initial + interval
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
      /* ignore */
    }
  };

  const onShare = async () => {
    try {
      const text = fact ? `${fact.fact} — ${fact.category}` : "";
      if (navigator.share) {
        await navigator.share({ title: "AI Insight", text });
      } else {
        await onCopy();
      }
      setShared(true);
      setTimeout(() => setShared(false), 1200);
    } catch {
      /* ignore */
    }
  };

  const onShuffle = () => fetchFact();

  const onExplain = () => {
    const text = fact
      ? `Explain this in simple terms and give 2 examples:\n\n"${fact.fact}"`
      : "Explain the latest AI fact.";

    // Preferred: event that your ChatWidget listens to
    window.dispatchEvent(new CustomEvent("chatwidget:open", { detail: { prompt: text } }));

    // Fallback if you exposed a helper
    if (typeof window.openChatWith === "function") {
      try { window.openChatWith(text); } catch { /* ignore */ }
    }
  };

  return (
    <motion.section
      aria-live="polite"
      className={[
        "relative rounded-2xl overflow-hidden",
        "bg-gradient-to-br from-gray-900/80 to-gray-950/90 backdrop-blur-xl",
        "border border-gray-700/30 shadow-2xl shadow-blue-500/10",
        "hover:shadow-blue-500/20 transition-all duration-500",
        className,
      ].join(" ")}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -2 }}
    >
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-violet-500/5 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIiBzdHJva2U9IiMzMzMiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMiI+PHBhdGggZD0iTTAgMGg2MHY2MEgweiIvPjwvZz48L3N2Zz4=')] opacity-20" />
      </div>

      {/* Content */}
      <div className="relative z-10 p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-start gap-4">
            <motion.span
              className="inline-grid place-items-center w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 text-white shadow-lg"
              animate={{ rotate: isHovered ? 10 : 0 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <FaRobot className="text-lg" aria-hidden />
            </motion.span>
            <div>
              <h3 className="text-xl font-bold text-white tracking-tight">{title}</h3>
              <p className="text-sm text-gray-400 mt-1">{subtitle}</p>
            </div>
          </div>

          <CategoryPill label={fact?.category || "—"} />
        </div>

        {/* Body */}
        <div className="mb-6 min-h-[120px]">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="skeleton"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="space-y-4"
              >
                <div className="h-5 w-11/12 rounded-md bg-white/5 overflow-hidden">
                  <div className="h-full w-1/2 bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent animate-[shimmer_1.5s_infinite]" />
                </div>
                <div className="h-5 w-9/12 rounded-md bg-white/5 overflow-hidden">
                  <div className="h-full w-2/3 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent animate-[shimmer_1.5s_infinite_0.2s]" />
                </div>
                <div className="h-5 w-10/12 rounded-md bg-white/5 overflow-hidden">
                  <div className="h-full w-3/5 bg-gradient-to-r from-transparent via-violet-500/20 to-transparent animate-[shimmer_1.5s_infinite_0.4s]" />
                </div>
                <style>{`@keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(200%); } }`}</style>
              </motion.div>
            ) : (
              <motion.div
                key={fact?.updatedAt || "fact"}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="space-y-4"
              >
                <p className="text-lg leading-relaxed text-gray-100 tracking-wide">{fact?.fact}</p>

                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400">
                  <span className="inline-flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {fact?.updatedAt ? new Date(fact.updatedAt).toLocaleTimeString() : "—"}
                  </span>

                  {errorMsg && (
                    <span className="inline-flex items-center gap-1.5 text-rose-400/90">
                      <FiAlertCircle aria-hidden /> {errorMsg}
                    </span>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer: countdown + actions */}
        <div className="flex items-center justify-between gap-4">
          {/* progress bar */}
          <div className="flex-1">
            <div className="flex items-center justify-between text-xs text-gray-400 mb-1.5">
              <span>Next refresh</span>
              <span>{formatTime(timeLeft)}</span>
            </div>
            <div className="h-1.5 rounded-full bg-gray-800 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-500"
                initial={false}
                animate={{ width: `${Math.round(progress * 100)}%` }}
                transition={{ type: "tween", duration: 0.9 }}
              />
            </div>
          </div>

          {/* actions */}
          <div className="flex items-center gap-2">
            <ActionBtn title="Explain with AI" onClick={onExplain} icon={<FaLightbulb />} />
            <ActionBtn title="Refresh" onClick={onShuffle} disabled={loading} icon={<FiRefreshCw className={loading ? "animate-spin" : ""} />} />
            <ActionBtn title={copied ? "Copied!" : "Copy"} onClick={onCopy} icon={copied ? <FiCheck /> : <FiCopy />} />
            <ActionBtn title={shared ? "Shared!" : "Share"} onClick={onShare} icon={<FiShare />} />
          </div>
        </div>
      </div>
    </motion.section>
  );
}

/* ------------------------------- Subcomponents ------------------------------ */

function CategoryPill({ label }) {
  return (
    <motion.span
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-700/50 bg-gradient-to-r from-gray-800/50 to-gray-900/50 text-xs font-medium text-cyan-400 backdrop-blur-sm shadow-sm"
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 400 }}
    >
      <span className="w-2 h-2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 shadow-sm" />
      {label}
    </motion.span>
  );
}

function ActionBtn({ title, onClick, icon, disabled }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={[
        "group relative inline-flex items-center justify-center p-2.5 rounded-xl",
        "bg-gradient-to-br from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800",
        "border border-gray-700/50 shadow-sm",
        "transition-all duration-300 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed",
        "text-gray-300 hover:text-white",
      ].join(" ")}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.95 }}
      title={title}
    >
      <span className="relative z-10 text-base">{icon}</span>
      <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-violet-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </motion.button>
  );
}

/* ---------------------------------- Utils ---------------------------------- */

function formatTime(ms) {
  const s = Math.max(0, Math.round(ms / 1000));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${String(r).padStart(2, "0")}`;
}