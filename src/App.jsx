// src/App.jsx
import React, { useEffect, Suspense, lazy } from "react";
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop.jsx";
import LoaderScreen from "./components/LoaderScreen.jsx";
import CookieConsent from "@/components/privacy/PrivacyPrefs.jsx";
import EdgeScrollButtons from "./components/EdgeScrollButtons.jsx"; // ⬅️ mount once at App level

// Lazier: even Layout & legal pages
const Layout         = lazy(() => import("./components/Layout.jsx"));
const HomePage       = lazy(() => import("./pages/HomePage.jsx"));
const AboutPage      = lazy(() => import("./pages/AboutPage.jsx"));
const PortfolioPage  = lazy(() => import("./pages/Portfolio.jsx"));
const VisionPage     = lazy(() => import("./pages/VisionPage.jsx"));
const NotFound       = lazy(() => import("./pages/NotFound.jsx"));
const ContactPage    = lazy(() => import("./pages/ContactPage.jsx"));
const TechStackPage  = lazy(() => import("./pages/TechStackPage.jsx"));
const NewsPage       = lazy(() => import("./pages/NewsPage.jsx"));

const GamesPage      = lazy(() => import("./pages/games/GamesPage.jsx"));
const PlayGameRoute  = lazy(() => import("./pages/games/PlayGameRoute.jsx"));

const PrivacyPolicy  = lazy(() => import("./pages/legal/PrivacyPolicy.jsx"));
const TermsOfService = lazy(() => import("./pages/legal/TermsOfService.jsx"));
const CookiePolicy   = lazy(() => import("./pages/legal/CookiePolicy.jsx"));

/* ----------------------------- Deferred AOS ------------------------------ */
function useDeferredAOS() {
  useEffect(() => {
    let cancelled = false;
    let idleId = null;
    let timeoutId = null;

    const init = async () => {
      try {
        const [{ default: AOS }] = await Promise.all([
          import("aos"),
          import("aos/dist/aos.css"),
        ]);
        if (!cancelled) {
          AOS.init({ duration: 1000, easing: "ease-out", once: true, mirror: false });
          AOS.refresh();
        }
      } catch { /* noop */ }
    };

    if ("requestIdleCallback" in window) {
      idleId = window.requestIdleCallback(init, { timeout: 2000 });
    } else {
      timeoutId = window.setTimeout(init, 1200);
    }

    return () => {
      cancelled = true;
      if (idleId && "cancelIdleCallback" in window) window.cancelIdleCallback(idleId);
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, []);
}

/* --------------------------- Route Prefetcher ---------------------------- */
function RoutePrefetcher() {
  useEffect(() => {
    const map = {
      "/":              () => import("./pages/HomePage.jsx"),
      "/games":         () => import("./pages/games/GamesPage.jsx"),
      "/about":         () => import("./pages/AboutPage.jsx"),
      "/portfolio":     () => import("./pages/Portfolio.jsx"),
      "/vision":        () => import("./pages/VisionPage.jsx"),
      "/contact":       () => import("./pages/ContactPage.jsx"),
      "/tech":          () => import("./pages/TechStackPage.jsx"),
      "/ai-news":       () => import("./pages/NewsPage.jsx"),
      "/privacy":       () => import("./pages/legal/PrivacyPolicy.jsx"),
      "/terms":         () => import("./pages/legal/TermsOfService.jsx"),
      "/cookie-policy": () => import("./pages/legal/CookiePolicy.jsx"),
    };

    // Idle-preload most visited
    let idleId;
    const idlePreload = () => { try { map["/"]?.(); map["/games"]?.(); } catch {} };
    if ("requestIdleCallback" in window) {
      idleId = window.requestIdleCallback(idlePreload, { timeout: 2500 });
    } else {
      setTimeout(idlePreload, 1200);
    }

    // Hover/touch prefetch
    const handler = (e) => {
      const el = e.target?.closest?.("[data-prefetch]");
      if (!el) return;
      const p = el.getAttribute("data-prefetch");
      if (p && map[p]) { try { map[p](); } catch {} }
    };

    document.addEventListener("mouseover", handler, true);
    document.addEventListener("touchstart", handler, { passive: true, capture: true });

    return () => {
      if (idleId && "cancelIdleCallback" in window) window.cancelIdleCallback(idleId);
      document.removeEventListener("mouseover", handler, true);
      document.removeEventListener("touchstart", handler, true);
    };
  }, []);
  return null;
}

export default function App() {
  useDeferredAOS();

  return (
    <Router>
      {/* Always above routes so it listens to every navigation */}
      <ScrollToTop behavior="smooth" />
      <RoutePrefetcher />

      {/* ⬇️ Floating arrows mounted ABOVE Layout. Nothing can clip them. */}
     <EdgeScrollButtons
       // Let it auto-detect the scroller; do NOT pass scrollContainerSelector
       scrollContainerSelector="#main"
       forceVisible
       debug
       posDown="left-6 top-32 z-[200000]"   // ⬅ sit clearly under navbar
       posUp="left-6 bottom-10 z-[200000]" // ⬅ left side, well above chatbot/dock
     />

      <Suspense fallback={<LoaderScreen />}>
        <Layout>
          <Suspense fallback={<LoaderScreen />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/projects" element={<Navigate to="/portfolio" replace />} />
              <Route path="/portfolio" element={<PortfolioPage />} />
              <Route path="/vision" element={<VisionPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/tech" element={<TechStackPage />} />
              <Route path="/ai-news" element={<NewsPage />} />

              {/* Games */}
              <Route path="/games" element={<GamesPage />} />
              <Route path="/games/:id" element={<PlayGameRoute />} />

              {/* Legal */}
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsOfService />} />
              <Route path="/cookie-policy" element={<CookiePolicy />} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
          <CookieConsent />
        </Layout>
      </Suspense>
    </Router>
  );
}
