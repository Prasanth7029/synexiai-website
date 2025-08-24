// src/components/social/SocialProofSection.jsx
import React from "react";
import LogoCloud from "./LogoCloud.jsx";
import Milestones from "./Milestones.jsx";
import Testimonials from "./Testimonials.jsx";

export default function SocialProofSection({
  logos = [],
  stats = [],
  quotes = [],
}) {
  return (
    <section id="social-proof" className="mb-20">
      <h2 className="text-center text-2xl sm:text-3xl md:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-green-400">
        Trusted momentum
      </h2>

      <div className="max-w-6xl mx-auto space-y-10">
        {/* Logos: many items → use 1→2→3→4→5 helper (we start at 2 on phones) */}
        <LogoCloud items={logos} className="grid-1-2-3-4-5" />

        {/* Stats: compact cards → 2 on phones, 3 on md+ */}
        <Milestones items={stats} className="grid-2-3 auto-rows-fr" />

        {/* Testimonials: cards → 2 on phones, 3 on md+ */}
        <Testimonials items={quotes} className="grid-2-3 auto-rows-fr" />
      </div>
    </section>
  );
}
