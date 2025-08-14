// src/components/visuals/GlobeSection.jsx
import { motion } from "framer-motion";
import React, {
  Suspense,
  useEffect,
  useState,
  useCallback,
  useLayoutEffect,
  useRef,
} from "react";

const GlobeCanvas = React.lazy(() => import("./GlobeCanvas.jsx"));
import GlobeFallback from "./GlobeFallback.jsx";
import canUseWebGL from "../../lib/canUseWebGL.js";
import ErrorBoundary from "../ErrorBoundary.jsx";

const MotionDiv = motion.div;

/* ------------------------------ size observer ----------------------------- */
function useElementSize() {
  const ref = useRef(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    if (!ref.current || typeof window === "undefined" || !window.ResizeObserver)
      return;
    const ro = new ResizeObserver((entries) => {
      const cr = entries[0]?.contentRect;
      if (cr)
        setSize({ width: Math.round(cr.width), height: Math.round(cr.height) });
    });
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);

  return [ref, size];
}

/* --------------------------------- component ------------------------------- */
export default function GlobeSection({
  showHeader = false,  // hide title/subtitle by default (homepage wants clean hero)
  controls = false,    // show status chip + try/fallback buttons only if enabled
  size = "md",         // "sm" | "md" | "lg" | number(px)
  sizePx,              // explicit pixel override; wins over `size` (great for mobile)
  className = "",
} = {}) {
  const [allow3D, setAllow3D] = useState(false);
  const [vpRef, vpSize] = useElementSize();

  // Token map; still accept numbers via legacy `size`, but `sizePx` wins.
  const tokenMap = { sm: 180, md: 280, lg: 520 };
  const resolvedPx = Number.isFinite(sizePx)
    ? Number(sizePx)
    : typeof size === "number"
      ? size
      : (tokenMap[size] ?? tokenMap.md);

  // Clamp to viewport so it never blows up on small phones
  const clampExpr = `min(${resolvedPx}px, 90vw)`;

  const computeAllow3D = useCallback(() => {
    if (typeof window === "undefined") return false;

    const prefersReduced = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    )?.matches;
    const verySmall = window.innerWidth < 420; // fallback looks better/cheaper here

    const forceFallback =
      import.meta.env.VITE_FORCE_GLOBE_FALLBACK === "1" ||
      localStorage.getItem("sx_globe_fallback") === "1";

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
        <MotionDiv
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
        </MotionDiv>
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
        className="relative globe-viewport pointer-events-none"
        style={{
          width: clampExpr,
          height: clampExpr,
          maxWidth: "90vw",
          maxHeight: "90vw",
          overflow: "hidden", // keep canvas/SVG strictly inside
        }}
        aria-label={allow3D ? "Interactive globe" : "Globe visualization (static)"}
        role={allow3D ? undefined : "img"}
      >
        {allow3D && vpSize.width > 0 ? (
          <ErrorBoundary fallback={<GlobeFallback />}>
            <Suspense fallback={<GlobeFallback variant="loading" />}>
              <GlobeCanvas width={vpSize.width} height={vpSize.height} />
            </Suspense>
          </ErrorBoundary>
        ) : (
          // Wrap fallback to force 100% fill of the viewport box
          <div style={{ width: "100%", height: "100%" }}>
            <GlobeFallback />
          </div>
        )}
      </div>
    </section>
  );
}
