import React, {
  Suspense,
  useEffect,
  useState,
  useCallback,
  useLayoutEffect,
  useRef,
} from "react";
import { motion } from "framer-motion";
const GlobeCanvas = React.lazy(() => import("./GlobeCanvas.jsx"));
import GlobeFallback from "./GlobeFallback.jsx";
import { canUseWebGL } from "../../lib/canUseWebGL.js";
import ErrorBoundary from "../ErrorBoundary.jsx";

/* ------------------------------ size observer ----------------------------- */
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

/* --------------------------------- component ------------------------------- */
export default function GlobeSection({
  showHeader = false,   // hide title/subtitle by default (homepage wants clean hero)
  controls   = false,   // only show status chip + force/try buttons if you opt in
  size       = "md",    // "sm" | "md" | "lg" | number(px)
  className  = "",
} = {}) {
  const [allow3D, setAllow3D] = useState(false);
  const [vpRef, vpSize] = useElementSize();

  // Resolve target square size (mobile-first, caps to 90vw automatically)
  const sizePx =
    typeof size === "number"
      ? size
      : size === "sm"
      ? 220
      : size === "lg"
      ? 360
      : 280; // "md" default

  const computeAllow3D = useCallback(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

    // turn 3D off for very small screens (fallback looks better + cheaper)
    const verySmall =
      typeof window !== "undefined" && window.innerWidth < 420;

    const forceFallback =
      import.meta.env.VITE_FORCE_GLOBE_FALLBACK === "1" ||
      (typeof window !== "undefined" &&
        localStorage.getItem("sx_globe_fallback") === "1");

    return !prefersReduced && !verySmall && !forceFallback && canUseWebGL();
  }, []);

  useEffect(() => {
    setAllow3D(computeAllow3D());
    const onResize = () => setAllow3D(computeAllow3D());
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, [computeAllow3D]);

  const retry3D = () => setAllow3D(computeAllow3D());
  const forceFallback = () => {
    try { localStorage.setItem("sx_globe_fallback", "1"); } catch {}
    setAllow3D(false);
  };
  const clearForce = () => {
    try { localStorage.removeItem("sx_globe_fallback"); } catch {}
    retry3D();
  };

  return (
    <section
      id="synexiai-globe"
      aria-labelledby={showHeader ? "globe-title" : undefined}
      className={`relative flex flex-col items-center ${className}`}
    >
      {/* Optional header (OFF by default for homepage hero) */}
      {showHeader && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-4 md:mb-6"
        >
          <h2
            id="globe-title"
            className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent
                       bg-gradient-to-r from-cyan-400 to-blue-500"
          >
            SynexiAI • Global by Design
          </h2>
          <p className="mt-2 md:mt-3 text-lg md:text-xl text-gray-700 dark:text-gray-300">
            AI + Clean Infrastructure, anywhere on Earth
          </p>
        </motion.div>
      )}

      {/* Controls (opt-in only) */}
      {controls && (
        <div className="absolute right-3 top-3 z-10 flex items-center gap-2 text-xs">
          <span
            className={`px-2 py-1 rounded-full ${
              allow3D
                ? "bg-emerald-500/20 text-emerald-300"
                : "bg-amber-500/20 text-amber-300"
            }`}
          >
            {allow3D ? "3D: on" : "3D: off (fallback)"}
          </span>
          {allow3D ? (
            <button
              onClick={forceFallback}
              className="rounded-full border border-white/10 px-2 py-1 hover:bg-white/10"
            >
              Force fallback
            </button>
          ) : (
            <button
              onClick={clearForce}
              className="rounded-full border border-white/10 px-2 py-1 hover:bg-white/10"
            >
              Try 3D
            </button>
          )}
        </div>
      )}

      {/* Square viewport (observed) */}
      <div
        ref={vpRef}
        className="relative"
        style={{
          width: `min(${sizePx}px, 90vw)`,
          height: `min(${sizePx}px, 90vw)`,
        }}
        aria-label="Interactive globe"
      >
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
    </section>
  );
}
