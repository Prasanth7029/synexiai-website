import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import ProjectsPage from "./pages/ProjectsPage.jsx";
import BlogPage from "./pages/BlogPage.jsx";
import VisionPage from "./pages/VisionPage.jsx";
import BlogPostPage from "./pages/BlogPostPage.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/vision" element={<VisionPage />} />
        <Route path="/blog/:slug" element={<BlogPostPage />} />
        <Route path="*" element={<div style={{ padding: "2rem", color: "#fff" }}>404 - Page Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;
