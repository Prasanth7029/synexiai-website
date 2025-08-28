import React from "react";
import { motion } from "framer-motion";

const MotionCircle = motion.circle;

export default function AIPipeline() {
 return (
 <section
 id="ai-pipeline"
 aria-labelledby="ai-pipeline-title"
 className="mb-20"
 >
 <div className="text-center mb-8">
 <h2
 id="ai-pipeline-title"
 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400"
 >
 AI Pipeline • From Data to Decisions
 </h2>
 <p className="mt-3 text-lg md:text-xl text-gray-700 dark:text-gray-300">
 Ingest → Train/Optimize → Serve with guardrails
 </p>
 </div>

 <div className="rounded-2xl border border-white/10 bg-white/5 shadow-xl shadow-emerald-500/10 p-6">
 <svg viewBox="0 0 1200 240" >
 {/* Nodes */}
 <g>
 <circle cx="150" cy="120" r="36" className="fill-emerald-400/80" />
 <text
 x="150"
 y="125"
 textAnchor="middle"
 className="fill-black font-semibold"
 >
 Ingest
 </text>

 <circle cx="600" cy="120" r="36" className="fill-cyan-400/80" />
 <text
 x="600"
 y="125"
 textAnchor="middle"
 className="fill-black font-semibold"
 >
 Train
 </text>

 <circle cx="1050" cy="120" r="36" className="fill-blue-400/80" />
 <text
 x="1050"
 y="125"
 textAnchor="middle"
 className="fill-black font-semibold"
 >
 Serve
 </text>
 </g>

 {/* Flow line */}
 <defs>
 <linearGradient id="flow" x1="0" x2="1">
 <stop offset="0%" stopColor="#10b981" />
 <stop offset="50%" stopColor="#06b6d4" />
 <stop offset="100%" stopColor="#3b82f6" />
 </linearGradient>
 </defs>

 <path
 d="M186 120 H 564"
 stroke="url(#flow)"
 strokeWidth="6"
 fill="none"
 strokeLinecap="round"
 />
 <path
 d="M636 120 H 1014"
 stroke="url(#flow)"
 strokeWidth="6"
 fill="none"
 strokeLinecap="round"
 />

 {/* Moving dots */}
 {[0, 0.25, 0.5, 0.75].map((delay, i) => (
 <MotionCircle
 key={i}
 r="5"
 cy="120"
 className="fill-white"
 initial={{ cx: 186 }}
 animate={{ cx: 564 }}
 transition={{ duration: 2.2, repeat: Infinity, delay }}
 />
 ))}
 {[0.1, 0.35, 0.6, 0.85].map((delay, i) => (
 <MotionCircle
 key={`b-${i}`}
 r="5"
 cy="120"
 className="fill-white"
 initial={{ cx: 636 }}
 animate={{ cx: 1014 }}
 transition={{ duration: 2.2, repeat: Infinity, delay }}
 />
 ))}
 </svg>

 <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 text-center text-sm opacity-90">
 <p>
 <strong>Ingest:</strong> ETL, events, sensors
 </p>
 <p>
 <strong>Training:</strong> LLMs + classical ML, AutoTune
 </p>
 <p>
 <strong>Serving:</strong> APIs, streaming, dashboards
 </p>
 </div>
 </div>
 </section>
 );
}
