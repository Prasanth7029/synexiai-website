import React from "react";

export default function HeroBanner() {
  return (
    <div className="relative w-full h-[90vh] overflow-hidden">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      >
        <source src="/hero-bg.mp4" type="video/mp4" />
        Your browser does not support HTML5 video.
      </video>

      <div className="absolute inset-0 bg-white/80 dark:bg-black/70 backdrop-blur-sm z-10 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 text-black dark:text-white">
          Welcome to <span className="text-[#00f7ff] drop-shadow-lg">SynexiAI</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-800 dark:text-gray-300 max-w-2xl mb-6">
          Building the future of intelligence — from zero to forever.
        </p>
        <a
          href="#about"
          className="bg-[#00f7ff] hover:bg-cyan-400 text-black font-bold px-6 py-3 rounded-md transition transform hover:scale-105"
        >
          Learn More →
        </a>
      </div>
    </div>
  );
}
