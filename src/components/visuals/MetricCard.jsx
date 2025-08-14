import React, { useEffect, useMemo, useState } from "react";

function Sparkline({ values = [] }) {
  const path = useMemo(() => {
    if (!values.length) return "";
    const w = 160,
      h = 40,
      pad = 4;
    const min = Math.min(...values),
      max = Math.max(...values);
    const norm = (v) =>
      h - pad - ((v - min) / (max - min || 1)) * (h - pad * 2);
    const step = (w - pad * 2) / (values.length - 1 || 1);
    return values
      .map((v, i) => `${i === 0 ? "M" : "L"} ${pad + i * step} ${norm(v)}`)
      .join(" ");
  }, [values]);
  return (
    <svg viewBox="0 0 160 40" className="w-40 h-10">
      <path
        d={path}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="text-cyan-400"
      />
    </svg>
  );
}

export default function MetricCard() {
  const [value, setValue] = useState(97.2);
  const [series, setSeries] = useState([88, 92, 91, 95, 96, 97, 97.2]);

  useEffect(() => {
    const id = setInterval(() => {
      setSeries((s) => {
        const next = Math.max(
          85,
          Math.min(99.9, s[s.length - 1] + (Math.random() - 0.4) * 2),
        );
        return [...s.slice(-19), Number(next.toFixed(2))];
      });
      setValue((v) => Number(series[series.length - 1]?.toFixed(2)) || v);
    }, 3000);
    return () => clearInterval(id);
  }, [series]);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-5 shadow-xl shadow-cyan-500/10">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm opacity-80">Renewable Uptime</p>
          <p className="text-3xl font-bold text-cyan-400">{value}%</p>
        </div>
        <Sparkline values={series} />
      </div>
      <p className="mt-2 text-xs opacity-75">
        Live metric (demo) • auto-updates
      </p>
    </div>
  );
}
