import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop({ behavior = "smooth" }) {
  const { pathname, search, hash } = useLocation();

  useEffect(() => {
    // Ensure the browser won't restore a previous scroll position
    const prev = window.history.scrollRestoration;
    try { window.history.scrollRestoration = "manual"; } catch {}

    // Helper: force all common scrollers to top
    const forceTop = () => {
      const el = document.scrollingElement || document.documentElement;
      el.scrollTop = 0;
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      window.scrollTo({ top: 0, left: 0, behavior });
    };

    // Helper: focus main without scrolling it back into view
    const focusMain = () => {
      const main = document.getElementById("main");
      if (main && typeof main.focus === "function") {
        try { main.focus({ preventScroll: true }); } catch { main.focus(); }
      }
    };

    // Do the work after the new route paints, and again after layout settles
    const run = () => {
      if (hash) {
        // If you are NOT using HashRouter for routing, this will work for #section jumps
        const id = hash.slice(1);
        const target = document.getElementById(id);
        if (target) {
          target.scrollIntoView({ behavior, block: "start" });
          focusMain();
          return;
        }
      }

      // No hash (or element not found) — go to absolute top
      forceTop();
      focusMain();

      // Re-run after layout/AOS/Framer/image shifts
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          forceTop();
          // tiny timeout to catch late async CSS/layout
          setTimeout(forceTop, 0);
        });
      });
    };

    // Kick off after this paint
    requestAnimationFrame(run);

    return () => {
      try { window.history.scrollRestoration = prev; } catch {}
    };
  }, [pathname, search, hash, behavior]);

  return null;
}
