// src/components/visuals/GlobeFallback.jsx
import React from "react";

export default function GlobeFallback({ variant = "idle" }) {
  const spin =
    variant === "loading"
      ? "spin 6s linear infinite"
      : "spin 18s linear infinite";

  return (
    <div className="w-full h-full max-w-full max-h-full overflow-hidden grid place-items-center">
      <div className="relative w-full h-full max-w-[100%] max-h-[100%] aspect-square">
        {/* Outer glow */}
        <div className="absolute -inset-6 rounded-full bg-[radial-gradient(circle_at_center,rgba(34,211,238,.25),transparent_60%)] blur-xl" />

        {/* Planet core */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "radial-gradient(40% 40% at 35% 35%, rgba(255,255,255,.25), transparent), radial-gradient(circle at 50% 50%, #60a5fa 0%, #06b6d4 55%, #1e293b 100%)",
          }}
        />

        {/* Subtle meridians */}
        <div
          className="absolute inset-0 rounded-full opacity-30 mix-blend-screen"
          style={{
            background:
              "repeating-conic-gradient(from 0deg, rgba(255,255,255,.15) 0deg 1deg, transparent 1deg 6deg)",
          }}
        />

        {/* Latitude rings */}
        <div
          className="absolute inset-0 rounded-full border border-white/10"
          style={{ animation: spin }}
        />
        <div
          className="absolute inset-3 rounded-full border border-white/10"
          style={{ animation: "spin 22s linear infinite reverse" }}
        />

        {/* Gloss highlight */}
        <div className="absolute inset-0 rounded-full bg-[radial-gradient(60%_40%_at_30%_25%,rgba(255,255,255,.35),transparent_60%)]" />
      </div>
    </div>
  );
}
