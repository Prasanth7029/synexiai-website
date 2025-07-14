import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import HomePage from "./pages/HomePage.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import ProjectsPage from "./pages/ProjectsPage.jsx";
import BlogPage from "./pages/BlogPage.jsx";
import VisionPage from "./pages/VisionPage.jsx";

function App() {
  return (
    <Router>
      <header className="header-nav">
        <nav className="nav-links">
          <Link to="/" style={linkStyle}>Home</Link>
          <Link to="/about" style={linkStyle}>About</Link>
          <Link to="/projects" style={linkStyle}>Projects</Link>
          <Link to="/blog" style={linkStyle}>Blog</Link>
          <Link to="/vision" style={linkStyle}>Vision</Link>
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/vision" element={<VisionPage />} />
        </Routes>
      </main>

      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} SynexiAI. All rights reserved.</p>
      </footer>
    </Router>
  );
}

const linkStyle = {
  color: "#00f7ff",
  textDecoration: "none",
  margin: "0 15px",
  fontSize: "1.1rem",
  fontWeight: "500",
  transition: "all 0.3s ease-in-out"
};

export default App;
