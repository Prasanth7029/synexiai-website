// src/components/social/Milestones.jsx
import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

function useCountUp(target = 0, duration = 1200, start = false) {
 const [value, setValue] = useState(0);
 useEffect(() => {
 if (!start) return;
 const t0 = performance.now();
 let raf;
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
 const val = useCountUp(value, 1100 + delayIndex * 200, start);
 return (
 <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-center">
 <div className="text-3xl font-extrabold text-cyan-400">{val}</div>
 <div className="text-xs opacity-80 mt-1">{label}</div>
 </div>
 );
}

export default function Milestones({ items = [] }) {
 const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });
 return (
 <div ref={ref} className="grid grid-cols-3 gap-4">
 {items.map((m, i) => (
 <StatCard
 key={m.label}
 label={m.label}
 value={m.value}
 delayIndex={i}
 start={inView}
 />
 ))}
 </div>
 );
}
