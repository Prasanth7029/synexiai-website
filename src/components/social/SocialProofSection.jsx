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

 <div className="max-w-6xl mx-auto grid gap-10">
 <LogoCloud items={logos} />
 <Milestones items={stats} />
 <Testimonials items={quotes} />
 </div>
 </section>
 );
}
