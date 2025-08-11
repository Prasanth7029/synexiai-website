import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import Layout from './components/Layout';
import PrivacyPolicy from "./pages/legal/PrivacyPolicy.jsx";
import TermsOfService from "./pages/legal/TermsOfService.jsx";
import CookiePolicy from "./pages/legal/CookiePolicy.jsx";

import { Suspense, lazy } from 'react';

const HomePage      = lazy(() => import('./pages/HomePage.jsx'));
const AboutPage     = lazy(() => import('./pages/AboutPage.jsx'));
const ProjectsPage  = lazy(() => import('./pages/ProjectsPage.jsx'));
const VisionPage    = lazy(() => import('./pages/VisionPage.jsx'));
const NotFound      = lazy(() => import('./pages/NotFound'));
const ContactPage   = lazy(() => import('./pages/ContactPage'));
const TechStackPage = lazy(() => import('./pages/TechStackPage'));
const NewsPage      = lazy(() => import('./pages/NewsPage'));

// ✅ Defer AOS until idle (or after a tiny delay)
function useDeferredAOS() {
  useEffect(() => {
    let cancelled = false;
    const init = async () => {
      try {
        const [{ default: AOS }] = await Promise.all([
          import('aos'),
          import('aos/dist/aos.css'),
        ]);
        if (!cancelled) {
          AOS.init({ duration: 1000, easing: 'ease-out', once: true, mirror: false });
          AOS.refresh();
        }
      } catch {}
    };
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(() => init());
    } else {
      const t = setTimeout(init, 1200);
      return () => clearTimeout(t);
    }
    return () => { cancelled = true; };
  }, []);
}

function Fallback() {
  return (
    <div className="min-h-[40vh] grid place-items-center">
      <div className="animate-pulse text-sm opacity-70">Loading…</div>
    </div>
  );
}

export default function App() {
  useDeferredAOS();

  return (
    <Router>
      <ScrollToTop />
      <Layout>
        <Suspense fallback={<Fallback />}>
          <Routes>
            <Route path="/"             element={<HomePage />} />
            <Route path="/about"        element={<AboutPage />} />
            <Route path="/projects"     element={<ProjectsPage />} />
            <Route path="/vision"       element={<VisionPage />} />
            <Route path="/contact"      element={<ContactPage />} />
            <Route path="/tech"         element={<TechStackPage />} />
            <Route path="/ai-news"      element={<NewsPage />} />
            <Route path="/privacy"      element={<PrivacyPolicy />} />
            <Route path="/terms"        element={<TermsOfService />} />
            <Route path="/cookie-policy" element={<CookiePolicy />} />
            <Route path="*"             element={<NotFound />} />
          </Routes>
        </Suspense>
      </Layout>
    </Router>
  );
}
