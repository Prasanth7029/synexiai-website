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
import { canUseWebGL } from "../../lib/canUseWebGL.js";
import ErrorBoundary from "../ErrorBoundary.jsx";

const MotionDiv = motion.div;

/* --------------------------------------------------------------------------
 * Mobile-safe size observer with graceful fallback
 * - Uses ResizeObserver when available
 * - Falls back to rAF-throttled window resize + initial measurement
 * - Avoids zero-size on iOS/older Android WebViews
 * ------------------------------------------------------------------------- */
function useElementSize() {
  const ref = useRef(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  const measure = useCallback(() => {
    if (!ref.current) return;
    const { width, height } = ref.current.getBoundingClientRect();
    if (width && height) setSize({ width: Math.round(width), height: Math.round(height) });
  }, []);

  useLayoutEffect(() => {
    if (!ref.current || typeof window === "undefined") return;

    let cleanupFns = [];
    let ro;

    // 1) Initial measure
    measure();

    // 2) ResizeObserver when available
    if ("ResizeObserver" in window) {
      ro = new ResizeObserver((entries) => {
        const cr = entries[0]?.contentRect;
        if (cr) setSize({ width: Math.round(cr.width), height: Math.round(cr.height) });
        else measure();
      });
      ro.observe(ref.current);
      cleanupFns.push(() => ro && ro.disconnect());
    }

    // 3) rAF-throttled window resize
    let raf = 0;
    const onResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(measure);
    };
    window.addEventListener("orientationchange", onResize, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    cleanupFns.push(() => {
      cancelAnimationFrame(raf);
      window.removeEventListener("orientationchange", onResize);
      window.removeEventListener("resize", onResize);
    });

    return () => cleanupFns.forEach((fn) => fn());
  }, [measure]);

  return [ref, size];
}

/* --------------------------------- component ------------------------------- */
export default function GlobeSection({
  showHeader = false,
  controls = false,
  size = "md",
  sizePx,
  className = "",
  allow3DOnSmall = false,
} = {}) {
  const [allow3D, setAllow3D] = useState(false);
  const [vpRef, vpSize] = useElementSize();

  const tokenMap = { sm: 180, md: 280, lg: 520 };
  const resolvedPx = Number.isFinite(sizePx)
    ? Number(sizePx)
    : typeof size === "number"
    ? size
    : tokenMap[size] ?? tokenMap.md;

  const clampExpr = `min(${resolvedPx}px, 90vw)`;

  const computeAllow3D = useCallback(() => {
    if (typeof window === "undefined") return false;

    const prefersReduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    const verySmall = window.innerWidth < 420;

    const forceFallback =
      import.meta.env.VITE_FORCE_GLOBE_FALLBACK === "1" ||
      (() => {
        try {
          return localStorage.getItem("sx_globe_fallback") === "1";
        } catch {
          return false;
        }
      })();

    const smallScreenBlock = verySmall && !allow3DOnSmall;
    return !prefersReduced && !smallScreenBlock && !forceFallback && canUseWebGL();
  }, [allow3DOnSmall]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setAllow3D(computeAllow3D());
    const onResize = () => setAllow3D(computeAllow3D());
    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("orientationchange", onResize, { passive: true });
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
    };
  }, [computeAllow3D]);

  const retry3D = () => setAllow3D(computeAllow3D());
  const forceFallback = () => {
    try {
      localStorage.setItem("sx_globe_fallback", "1");
    } catch {}
    setAllow3D(false);
  };
  const clearForce = () => {
    try {
      localStorage.removeItem("sx_globe_fallback");
    } catch {}
    retry3D();
  };

  return (
    <section
      id="synexiai-globe"
      aria-labelledby={showHeader ? "globe-title" : undefined}
      className={`relative flex flex-col items-center ${className}`}
    >
      {/* Optional header */}
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
            className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500"
          >
            SynexiAI • Global by Design
          </h2>
          <p className="mt-2 md:mt-3 text-lg md:text-xl text-gray-700 dark:text-gray-300">
            AI + Clean Infrastructure, anywhere on Earth
          </p>
        </MotionDiv>
      )}

      {/* Controls */}
      {controls && (
        <div className="absolute right-3 top-3 z-10 flex items-center gap-2 text-xs">
          <span
            className={`px-2 py-1 rounded-full ${
              allow3D ? "bg-emerald-500/20 text-emerald-300" : "bg-amber-500/20 text-amber-300"
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

      {/* Viewport */}
      <div
        ref={vpRef}
        className="relative globe-viewport"
        style={{
          width: clampExpr,
          height: clampExpr,
          maxWidth: "90vw",
          maxHeight: "90vw",
          aspectRatio: "1 / 1",
          overflow: "hidden",
          WebkitTapHighlightColor: "transparent",
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
          <div style={{ width: "100%", height: "100%" }}>
            <GlobeFallback />
          </div>
        )}
      </div>
    </section>
  );
}
