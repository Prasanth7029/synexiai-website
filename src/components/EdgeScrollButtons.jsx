// src/components/EdgeScrollButtons.jsx
import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

export default function EdgeScrollButtons({
  targetSectionId = "",
  offset = 0,
  scrollContainerSelector = "",
  posDown = "left-6 top-32 z-[10050]",
  posUp   = "left-6 bottom-10 z-[10050]",
  forceVisible = false,
  debug = false,
  sizePx = 44,
}) {
  const [mounted, setMounted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showUp, setShowUp] = useState(false);
  const [showDown, setShowDown] = useState(false);

  const scrollerRef = useRef(null);
  const roRef = useRef(null);
  const rafRef = useRef(0);
  const lastY = useRef(-1);
  const lastMax = useRef(-1);

  const htmlEl = () => document.scrollingElement || document.documentElement;

  const windowMax = () => {
    const h = Math.max(
      document.documentElement.scrollHeight || 0,
      document.body.scrollHeight || 0
    );
    return Math.max(0, h - window.innerHeight);
  };

  const getMax = (el) => (el === window ? windowMax() : Math.max(0, el.scrollHeight - el.clientHeight));

  const getTop = (el) =>
    el === window
      ? (window.pageYOffset || htmlEl().scrollTop || document.body.scrollTop || 0)
      : el.scrollTop;

  const isScrollable = (el) => {
    if (!el) return false;
    if (el === window) return windowMax() > 0;
    const s = getComputedStyle(el);
    return el.scrollHeight > el.clientHeight && /(auto|scroll)/.test(s.overflowY || s.overflow);
  };

  const findScroller = () => {
    if (scrollContainerSelector) {
      const el = document.querySelector(scrollContainerSelector);
      if (isScrollable(el)) return el;
    }
    if (isScrollable(window)) return window;
    const candidates = [document.getElementById("main"), document.querySelector("main"), document.getElementById("root")].filter(Boolean);
    for (const el of candidates) if (isScrollable(el)) return el;
    return window;
  };

  const setBy = (y, max) => {
    if (y !== lastY.current || max !== lastMax.current) {
      lastY.current = y;
      lastMax.current = max;
      const p = max > 0 ? Math.min(1, Math.max(0, y / max)) : 0;
      setProgress(p);
      if (forceVisible) { setShowUp(true); setShowDown(true); }
      else { setShowUp(y > 60); setShowDown(max > 20 && y < max - 24); }
    }
  };

  const watchLoop = () => {
    const el = scrollerRef.current || window;
    setBy(getTop(el), getMax(el));
    rafRef.current = requestAnimationFrame(watchLoop);
  };

  // Use the robust scrolling implementation from second snippet
  const tryScrollOnce = (el, top, smooth = true) => {
    if (!el) return;
    const behavior = smooth ? "smooth" : "auto";
    try {
      if (el === window) {
        const se = htmlEl();
        se?.scrollTo?.({ top, behavior });
        se.scrollTop = top;
        document.body.scrollTop = top;
        window.scrollTo?.(0, top);
      } else {
        el.scrollTo?.({ top, behavior });
        el.scrollTop = top;
      }
    } catch {
      if (el === window) {
        const se = htmlEl();
        se.scrollTop = top;
        document.body.scrollTop = top;
        window.scrollTo(0, top);
      } else {
        el.scrollTop = top;
      }
    }
  };

  const goTo = async (el, top) => {
    const preferred = el || window;
    const candidates = [
      preferred,
      window,
      htmlEl(),
      document.documentElement,
      document.body,
    ].filter(Boolean);

    const baseline = getTop(preferred);
    for (let i = 0; i < candidates.length; i++) {
      const t = candidates[i];
      tryScrollOnce(t, top, true);

      await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));

      const nowTop = getTop(preferred);
      const moved = Math.abs(nowTop - baseline) > 1 || Math.abs(nowTop - top) < 2;
      if (moved) return;

      tryScrollOnce(t, top, false);
      await new Promise(r => requestAnimationFrame(r));
      const nowTop2 = getTop(preferred);
      if (Math.abs(nowTop2 - baseline) > 1 || Math.abs(nowTop2 - top) < 2) return;
    }
  };

  useEffect(() => {
    setMounted(true);
    const scroller = findScroller();
    scrollerRef.current = scroller;

    if (debug) {
      window.__edge = {
        scroller,
        metrics: () => ({ scroller: scroller === window ? "window" : scroller?.id || scroller?.tagName, top: getTop(scroller), max: getMax(scroller) }),
        up: () => goTo(scroller, 0),
        down: () => goTo(scroller, getMax(scroller)),
      };
      console.log("[EdgeBtns] mounted", window.__edge.metrics());
    }

    rafRef.current = requestAnimationFrame(watchLoop);
    const onResize = () => setBy(getTop(scroller), getMax(scroller));
    window.addEventListener("resize", onResize, { passive: true });

    const handleScroll = () => setBy(getTop(scroller), getMax(scroller));
    (scroller === window ? window : scroller).addEventListener("scroll", handleScroll, { passive: true });

    if (typeof ResizeObserver !== "undefined") {
      roRef.current = new ResizeObserver(onResize);
      roRef.current.observe(scroller === window ? document.body : scroller);
    }
    setBy(getTop(scroller), getMax(scroller));

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
      (scroller === window ? window : scroller).removeEventListener("scroll", handleScroll);
      if (roRef.current) roRef.current.disconnect();
      if (debug) delete window.__edge;
    };
  }, [scrollContainerSelector, forceVisible, debug]);

  const goTop = (e) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();
    goTo(scrollerRef.current || window, 0);
  };

  const goBottomOrTarget = (e) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();
    const el = scrollerRef.current || window;
    if (targetSectionId) {
      const t = document.getElementById(targetSectionId);
      if (t) {
        const dest = el === window
          ? getTop(window) + t.getBoundingClientRect().top + offset
          : el.scrollTop + (t.getBoundingClientRect().top - el.getBoundingClientRect().top) + offset;
        return goTo(el, Math.max(0, dest));
      }
    }
    goTo(el, getMax(el));
  };

  /* ===== visuals ===== */
  const size = sizePx;
  const stroke = 3.5;
  const r = (size - stroke) / 2;
  const C = 2 * Math.PI * r;

  const ringDown = "#06B6D4", ringDownBg = "#164E63";
  const ringUp   = "#0EA5E9", ringUpBg   = "#1E3A8A";
  const ringShadow = "drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)]";

  const baseBtn =
    "opacity-70 hover:opacity-100 transition-opacity duration-200 rounded-full relative " +
    "backdrop-blur-sm bg-black/10 focus:outline-none focus:ring-2 focus:ring-offset-2";

  if (!mounted) return null;

  const CommonSVG = ({ fg, bg }) => (
    <svg
      className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ${ringShadow}`}
      width={size}
      height={size}
    >
      <circle cx={size/2} cy={size/2} r={r-1.5} fill="none" stroke={bg} strokeWidth={stroke} opacity="0.55" />
      <circle cx={size/2} cy={size/2} r={r-1.5} fill="none" stroke={fg} strokeWidth={stroke}
              strokeDasharray={C} strokeDashoffset={C * (1 - progress)}
              transform={`rotate(-90 ${size/2} ${size/2})`} strokeLinecap="round" />
    </svg>
  );

  return createPortal(
    <>
      {(forceVisible || showDown) && (
        <button
          type="button"
          onClick={goBottomOrTarget}
          aria-label="Scroll down"
          className={`!fixed ${posDown} ${baseBtn} focus:ring-cyan-300`}
          style={{ width: size, height: size }}
        >
          <CommonSVG fg={ringDown} bg={ringDownBg} />
          <div className="pointer-events-none absolute inset-0 grid place-items-center">
            <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-gradient-to-tr from-emerald-500 to-cyan-500 grid place-items-center">
              <FaArrowDown className="text-white text-sm md:text-base" />
            </div>
          </div>
        </button>
      )}

      {(forceVisible || showUp) && (
        <button
          type="button"
          onClick={goTop}
          aria-label="Scroll to top"
          className={`!fixed ${posUp} ${baseBtn} focus:ring-sky-300`}
          style={{ width: size, height: size }}
        >
          <CommonSVG fg={ringUp} bg={ringUpBg} />
          <div className="pointer-events-none absolute inset-0 grid place-items-center">
            <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-gradient-to-tr from-sky-500 to-blue-600 grid place-items-center">
              <FaArrowUp className="text-white text-sm md:text-base" />
            </div>
          </div>
        </button>
      )}
    </>,
    document.body
  );
}