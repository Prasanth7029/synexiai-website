import { useEffect } from 'react';
import AOS from 'aos';
import { HashRouter as Router, Routes, Route } from "react-router-dom";

import HomePage       from "./pages/HomePage.jsx";
import AboutPage      from "./pages/AboutPage.jsx";
import ProjectsPage   from "./pages/ProjectsPage.jsx";
import BlogPage       from "./pages/BlogPage.jsx";
import VisionPage     from "./pages/VisionPage.jsx";
import BlogPostPage   from "./pages/BlogPostPage.jsx";
import NotFound       from "./pages/NotFound";
import ContactPage    from "./pages/ContactPage";
import TechStackPage  from "./pages/TechStackPage";
import ScrollToTop    from "./components/ScrollToTop";
import Layout         from "./components/Layout";
import NewsPage       from './pages/NewsPage';

export default function App() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: 'ease-out',
      once: true,
      mirror: false
    });
    AOS.refresh();
      }, []);

  return (
    <Router>
      <ScrollToTop />
      <Layout>
        <Routes>
          <Route path="/"               element={<HomePage />} />
          <Route path="/about"          element={<AboutPage />} />
          <Route path="/projects"       element={<ProjectsPage />} />
          <Route path="/blog"           element={<BlogPage />} />
          <Route path="/vision"         element={<VisionPage />} />
          <Route path="/blog/:slug"     element={<BlogPostPage />} />
          <Route path="/contact"        element={<ContactPage />} />
          <Route path="/tech"           element={<TechStackPage />} />
          <Route path="/ai-news"        element={<NewsPage />} />
          <Route path="*"               element={<NotFound />} />
        </Routes>
      </Layout>
    </Router>
  );
}


