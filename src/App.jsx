import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import ProjectsPage from "./pages/ProjectsPage.jsx";
import BlogPage from "./pages/BlogPage.jsx";
import VisionPage from "./pages/VisionPage.jsx";
import BlogPostPage from "./pages/BlogPostPage.jsx";
import NotFound from "./pages/NotFound";
import ContactPage from "./pages/ContactPage";
import TechStackPage from "./pages/TechStackPage";
import ScrollToTop from "./components/ScrollToTop";



function App() {
  return (
    <Router>
    <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/vision" element={<VisionPage />} />
        <Route path="/blog/:slug" element={<BlogPostPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/tech" element={<TechStackPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
