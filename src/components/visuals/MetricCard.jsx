// src/components/visuals/MetricCard.jsx
import React, { useEffect, useMemo, useState } from "react";

/* --------------------------- Tiny SVG Sparkline --------------------------- */
function Sparkline({ values = [], w = 140, h = 36, pad = 4, className = "" }) {
  const d = useMemo(() => {
    if (!values.length) return "";
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = Math.max(1, max - min);
    const normY = (v) => h - pad - ((v - min) / range) * (h - pad * 2);
    const step = (w - pad * 2) / Math.max(1, values.length - 1);
    return values
      .map((v, i) => `${i === 0 ? "M" : "L"} ${pad + i * step} ${normY(v)}`)
      .join(" ");
  }, [values, w, h, pad]);

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <path
        d={d}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ------------------------------- Metric Card ------------------------------ */
export default function MetricCard({
  title = "Renewable Uptime",
  initialValue = 99.9,
  seedSeries = [88, 92, 91, 95, 96, 97, 98.4, 99.1, 98.9, 99.3, 99.9],
  autoUpdate = true,    // set to false for screenshots
  tickMs = 3000,
  min = 85,
  max = 99.9,
  size = "md",          // "sm" | "md"
  precision = 1,        // decimal places for the big stat
  className = "",
}) {
  const [value, setValue] = useState(initialValue);
  const [series, setSeries] = useState(seedSeries);

  // Size presets: compact on phones
  const S =
    size === "sm"
      ? {
          pad: "p-4",
          title: "text-base",
          sub: "text-[11px]",
          stat: "text-3xl",
          spark: "w-28 h-8 sm:w-36 sm:h-9",
          barH: "h-1",
        }
      : {
          pad: "p-6",
          title: "text-xl",
          sub: "text-sm",
          stat: "text-4xl",
          spark: "w-40 h-10",
          barH: "h-1.5",
        };

  // Respect reduced motion: pause auto updates
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
        setValue(rounded); // keep value in sync with sparkline
        return [...prev.slice(-19), rounded];
      });
    }, tickMs);
    return () => clearInterval(id);
  }, [autoUpdate, prefersReduced, tickMs, min, max, initialValue]);

  const stat = useMemo(() => Number(value).toFixed(precision), [value, precision]);
  const labelId = useMemo(
    () => `metric-title-${Math.random().toString(36).slice(2, 8)}`,
    []
  );

  return (
    <section
      role="region"
      aria-labelledby={labelId}
      className={[
        "rounded-3xl border border-[var(--border-color)]",
        "bg-[var(--card-bg)]/60 shadow-xl shadow-cyan-500/10",
        "min-w-0", // prevent grid overflow
        S.pad,
        className,
      ].join(" ")}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p id={labelId} className="text-xs sm:text-sm opacity-80">
            {title}
          </p>
          <p className={`${S.stat} font-extrabold text-cyan-400`}>{stat}%</p>
        </div>

        {/* Sparkline inherits text color; keep it cyan for consistency */}
        <Sparkline values={series} className={`${S.spark} text-cyan-400`} />
      </div>

      <p className={`${S.sub} mt-2 opacity-75`}>
        {autoUpdate && !prefersReduced
          ? "Live metric (demo) • auto-updates"
          : "Static metric (screenshot mode)"}
      </p>
    </section>
  );
}
