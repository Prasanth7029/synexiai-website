import React, { Suspense, useEffect, useState, useCallback, useLayoutEffect, useRef } from "react";
import { motion } from "framer-motion";
const GlobeCanvas = React.lazy(() => import("./GlobeCanvas.jsx"));
import GlobeFallback from "./GlobeFallback.jsx";
import { canUseWebGL } from "../../lib/canUseWebGL.js";
import ErrorBoundary from "../ErrorBoundary.jsx";

// Observe the rendered viewport so Globe width/height always match the card
function useElementSize() {
  const ref = useRef(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  useLayoutEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver((entries) => {
      const cr = entries[0]?.contentRect;
      if (cr) setSize({ width: Math.round(cr.width), height: Math.round(cr.height) });
    });
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);
  return [ref, size];
}

export default function GlobeSection() {
  const [allow3D, setAllow3D] = useState(false);
  const [vpRef, vpSize] = useElementSize(); // <— size of square viewport

  const computeAllow3D = useCallback(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    const small = typeof window !== "undefined" && window.innerWidth < 420;
    const forceFallback =
      import.meta.env.VITE_FORCE_GLOBE_FALLBACK === "1" ||
      (typeof window !== "undefined" && localStorage.getItem("sx_globe_fallback") === "1");
    return !prefersReduced && !small && !forceFallback && canUseWebGL();
  }, []);

  useEffect(() => {
    setAllow3D(computeAllow3D());
    const onResize = () => setAllow3D(computeAllow3D());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [computeAllow3D]);

  const retry3D = () => setAllow3D(computeAllow3D());
  const forceFallback = () => { try { localStorage.setItem("sx_globe_fallback", "1"); } catch {} setAllow3D(false); };
  const clearForce = () => { try { localStorage.removeItem("sx_globe_fallback"); } catch {} retry3D(); };

  return (
    <section id="synexiai-globe" aria-labelledby="globe-title" className="mb-16 relative flex flex-col items-center">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-6"
      >
        <h2 id="globe-title" className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
          SynexiAI • Global by Design
        </h2>
        <p className="mt-3 text-lg md:text-xl text-gray-700 dark:text-gray-300">
          AI + Clean Infrastructure, anywhere on Earth
        </p>
      </motion.div>

      {/* Smaller, centered card */}
      <div >
        {/* Status chip */}
        <div className="absolute right-3 top-3 z-10 flex items-center gap-2 text-xs">
          <span className={`px-2 py-1 rounded-full ${allow3D ? "bg-emerald-500/20 text-emerald-300" : "bg-amber-500/20 text-amber-300"}`}>
            {allow3D ? "3D: on" : "3D: off (fallback)"}
          </span>
          {allow3D ? (
            <button onClick={forceFallback} className="rounded-full border border-white/10 px-2 py-1 hover:bg-white/10">Force fallback</button>
          ) : (
            <button onClick={clearForce} className="rounded-full border border-white/10 px-2 py-1 hover:bg-white/10">Try 3D</button>
          )}
        </div>

        {/* Square viewport whose size we observe */}
        <div ref={vpRef} >
          {allow3D && vpSize.width > 0 ? (
            <ErrorBoundary fallback={<GlobeFallback />}>
              <Suspense fallback={<GlobeFallback variant="loading" />}>
                <GlobeCanvas width={vpSize.width} height={vpSize.height} />
              </Suspense>
            </ErrorBoundary>
          ) : (
            <GlobeFallback />
          )}
        </div>
      </div>
    </section>
  );
}
