import React from "react";

export default function ProgressBar({
  value = 0,
  max = 100,
  showLabel = false,
  size = "md",         // "sm" | "md" | "lg"
  className = "",
}) {
  const pct = Number.isFinite(value) && Number.isFinite(max) && max > 0
    ? Math.max(0, Math.min(100, Math.round((value / max) * 100)))
    : 0;

  const sizes = { sm: "h-1.5", md: "h-2", lg: "h-3" };

  return (
    <div className={className}>
      <div
        className={`w-full ${sizes[size]} rounded-full bg-white/10 ring-1 ring-white/10 overflow-hidden`}
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-[width] duration-500"
          style={{ width: `${pct}%`, minWidth: pct > 0 ? "2px" : 0 }}
        />
      </div>
      {showLabel && (
        <div className="mt-1 text-xs opacity-70">{pct}%</div>
      )}
    </div>
  );
}
