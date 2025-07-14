import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 bg-white dark:bg-black text-black dark:text-white transition-colors duration-300">
      <h1 className="text-6xl font-extrabold mb-6 text-[#00f7ff] drop-shadow-lg animate-pulse">
        404
      </h1>
      <p className="text-xl mb-4">
        Oops! The page you're looking for doesn’t exist.
      </p>
      <Link
        to="/"
        className="mt-4 px-6 py-3 bg-[#00f7ff] text-black rounded-md font-semibold shadow-md hover:bg-cyan-400 transition transform hover:scale-105"
      >
        ← Back to Home
      </Link>
    </div>
  );
}
