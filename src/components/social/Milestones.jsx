// src/components/social/Milestones.jsx
import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

/* Count up to a target when the grid comes into view */
function useCountUp(target = 0, duration = 1200, start = false) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    const t0 = performance.now();
    let raf = 0;
    const step = (now) => {
      const p = Math.min(1, (now - t0) / duration);
      setValue(Math.round(target * p));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, start]);
  return value;
}

function StatCard({ label, value, delayIndex, start }) {
  const val = useCountUp(value ?? 0, 1100 + delayIndex * 200, start);
  return (
    <article
      className="h-full rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)]/60
                 p-3 sm:p-4 md:p-6 text-center shadow-sm"
    >
      <div className="text-[clamp(18px,4.5vw,28px)] font-extrabold text-cyan-400">
        {val}
      </div>
      <div className="mt-1 text-[clamp(11px,3.2vw,13px)] opacity-80">{label}</div>
    </article>
  );
}

export default function Milestones({ items = [], className = "" }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  if (!items.length) return null;

  return (
    <div
      ref={ref}
      role="list"
      aria-label="Milestones"
      className={[
        className || "grid-2-3 auto-rows-fr",
        "gap-3 sm:gap-4 md:gap-6",
      ].join(" ")}
    >
      {items.map((m, i) => (
        <div key={m.id ?? m.label ?? i} className="min-w-0" role="listitem">
          <StatCard
            label={m.label}
            value={m.value}
            delayIndex={i}
            start={inView}
          />
        </div>
      ))}
    </div>
  );
}
