// src/components/ScrollToTop.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * ScrollToTop
 * - Resets scroll on route changes (ignores hash so we always go to top)
 * - Optional smooth/instant behavior
 */
export default function ScrollToTop({ behavior = "smooth" }) {
 const { pathname, search } = useLocation();

 useEffect(() => {
 // Ensure we scroll after the new page paints
 requestAnimationFrame(() => {
 window.scrollTo({ top: 0, left: 0, behavior });
 });
 }, [pathname, search, behavior]);

 return null;
}
