import React, { useEffect, useMemo, useState } from "react";

/* ---------- Tiny Sparkline ---------- */
function Sparkline({ values = [], w = 160, h = 40, pad = 4 }) {
  const path = useMemo(() => {
    if (!values.length) return "";
    const min = Math.min(...values);
    const max = Math.max(...values);
    const norm = (v) => h - pad - ((v - min) / (max - min || 1)) * (h - pad * 2);
    const step = (w - pad * 2) / Math.max(1, values.length - 1);
    return values
      .map((v, i) => `${i === 0 ? "M" : "L"} ${pad + i * step} ${norm(v)}`)
      .join(" ");
  }, [values, w, h, pad]);

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-40 h-10">
      <path
        d={path}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="text-cyan-400"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ---------- Metric Card ---------- */
export default function MetricCard({
  title = "Renewable Uptime",
  initialValue = 99.9,
  seedSeries = [88, 92, 91, 95, 96, 97, 98.4, 99.1, 98.9, 99.3, 99.9],
  autoUpdate = true,          // set to false for screenshots
  tickMs = 3000,
  min = 85,
  max = 99.9,
}) {
  const [value, setValue] = useState(initialValue);
  const [series, setSeries] = useState(seedSeries);

  // Respect prefers-reduced-motion: pause auto updates
  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

  useEffect(() => {
    if (!autoUpdate || prefersReduced) return;
    const id = setInterval(() => {
      setSeries((prev) => {
        const last = prev[prev.length - 1] ?? initialValue;
        const jitter = (Math.random() - 0.4) * 2; // small up/down
        const next = Math.max(min, Math.min(max, last + jitter));
        const rounded = Number(next.toFixed(2));
        // update value in the same tick so it stays in sync with the sparkline
        setValue(rounded);
        return [...prev.slice(-19), rounded];
      });
    }, tickMs);
    return () => clearInterval(id);
  }, [autoUpdate, prefersReduced, tickMs, min, max, initialValue]);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-xl shadow-cyan-500/10">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm opacity-80">{title}</p>
          <p className="text-3xl font-bold text-cyan-400">{value}%</p>
        </div>
        <Sparkline values={series} />
      </div>
      <p className="mt-2 text-xs opacity-75">
        {autoUpdate && !prefersReduced ? "Live metric (demo) • auto-updates" : "Static metric (screenshot mode)"}
      </p>
    </div>
  );
}
