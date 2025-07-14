import React from "react";

export default function HeroBanner() {
  return (
    <div className="hero-banner-container">
      <video autoPlay loop muted playsInline className="video-bg">
        <source src="/hero-bg.mp4" type="video/mp4" />
        Your browser does not support HTML5 video.
      </video>

      <div className="hero-overlay">
        <h1 className="hero-title">Welcome to <span className="glow">SynexiAI</span></h1>
        <p className="hero-subtext">
          Building the future of intelligence — from zero to forever.
        </p>
        <a href="#about" className="hero-button">Learn More →</a>
      </div>
    </div>
  );
}
