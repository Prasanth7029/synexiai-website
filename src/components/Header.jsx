import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Header() {
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem("theme") === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
      ? true
      : false;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  return (
    <header className="bg-[#111] dark:bg-black py-6 shadow-md sticky top-0 z-50">
      <nav className="flex justify-between items-center max-w-6xl mx-auto px-6">
        <div className="flex gap-8 text-[#00f7ff] font-medium text-lg">
          <Link to="/" className="hover:text-white transition duration-200">Home</Link>
          <Link to="/about" className="hover:text-white transition duration-200">About</Link>
          <Link to="/projects" className="hover:text-white transition duration-200">Projects</Link>
          <Link to="/blog" className="hover:text-white transition duration-200">Blog</Link>
          <Link to="/vision" className="hover:text-white transition duration-200">Vision</Link>
        </div>

        <button
          onClick={() => setIsDark(!isDark)}
          className="text-white bg-[#222] dark:bg-gray-800 px-4 py-2 rounded transition hover:bg-[#333] dark:hover:bg-gray-700"
        >
          {isDark ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
      </nav>
    </header>
  );
}
