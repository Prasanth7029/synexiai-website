// src/components/ScrollToTop.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * ScrollToTop
 * - On route change:
 *    • if URL has #hash -> scrollIntoView that element
 *    • else -> scroll to page top
 *    • also focus #main (if present) for a11y
 */
export default function ScrollToTop({ behavior = "smooth" }) {
  const { pathname, search, hash } = useLocation();

  useEffect(() => {
    // Wait until the next paint so the new route has rendered
    requestAnimationFrame(() => {
      const main = document.getElementById("main");
      if (hash) {
        const el = document.getElementById(hash.slice(1));
        if (el) {
          el.scrollIntoView({ behavior, block: "start" });
          if (main) main.focus?.();
          return;
        }
      }
      window.scrollTo({ top: 0, left: 0, behavior });
      if (main) main.focus?.();
    });
  }, [pathname, search, hash, behavior]);

  return null;
}
