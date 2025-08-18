import React from "react";
import useAskAI from "../../lib/useAskAI.js";
import { motion } from "framer-motion";

const MotionArticle = motion.article;

export default function ProjectCard({ item, idx = 0 }) {
 const askAI = useAskAI();
 const onExplain = () =>
 askAI({
 type: "explain-project",
 persona: localStorage.getItem("persona") || "general",
 autoSend: true, // <-- auto answer on open
 project: {
 id: item.id,
 title: item.title,
 blurb: item.blurb,
 tech: item.tech,
 status: item.status,
 category: item.category,
 tags: item.tags,
 },
 });

 return (
 <MotionArticle
 initial={{ opacity: 0, y: 10 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true, amount: 0.2 }}
 transition={{ duration: 0.4, delay: idx * 0.03 }}
 className="h-full flex flex-col rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)]/60 p-6 shadow-lg"
 >
 <div className="flex items-start justify-between gap-3">
 <h3 className="text-lg font-semibold">{item.title}</h3>
 <span className="text-[11px] px-2 py-1 rounded-full bg-white/5 border border-white/10">
 {item.status}
 </span>
 </div>
 <p className="mt-2 text-sm opacity-90">{item.blurb}</p>

 <div className="mt-3 flex flex-wrap gap-2">
 {item.tech.slice(0, 4).map((t) => (
 <span
 key={t}
 className="text-[11px] px-2 py-1 rounded-full bg-white/5 border border-white/10"
 >
 {t}
 </span>
 ))}
 </div>

 <div className="mt-3 flex flex-wrap gap-2">
 {item.tags.map((t) => (
 <span
 key={t}
 className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20"
 >
 {t}
 </span>
 ))}
 </div>

 <div className="mt-4 flex items-center gap-3">
 {item.links.demo && (
 <a href={item.links.demo} className="text-sm underline">
 Demo
 </a>
 )}
 {item.links.repo && (
 <a href={item.links.repo} className="text-sm underline">
 Repo
 </a>
 )}
 {item.links.doc && (
 <a href={item.links.doc} className="text-sm underline">
 Docs
 </a>
 )}
 <div className="mt-auto pt-4" />
 <button
 onClick={onExplain}
 className="text-sm px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500"
 >
 Explain with AI
 </button>
 </div>
 </MotionArticle>
 );
}
