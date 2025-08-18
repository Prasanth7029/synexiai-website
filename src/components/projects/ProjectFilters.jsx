import React, { useMemo } from "react";
import { PROJECT_CATEGORIES } from "../../content/projects.js";

export default function ProjectFilters({ state, setState, allTags = [] }) {
 const { category, q, tag } = state;
 const tags = useMemo(() => allTags.slice(0, 16), [allTags]);

 return (
 <div className="rounded-2xl border border-white/10 bg-white/5 p-4 mb-6">
 <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
 {/* categories */}
 <div className="flex flex-wrap gap-2">
 {["All", ...PROJECT_CATEGORIES].map((c) => {
 const active = (c === "All" && !category) || c === category;
 return (
 <button
 key={c}
 onClick={() =>
 setState((s) => ({ ...s, category: c === "All" ? "" : c }))
 }
 className={`px-3 py-1.5 rounded-full text-sm border ${active ? "bg-cyan-500/20 border-cyan-400/30" : "bg-white/5 border-white/10"}`}
 >
 {c}
 </button>
 );
 })}
 </div>

 {/* search */}
 <input
 value={q}
 onChange={(e) => setState((s) => ({ ...s, q: e.target.value }))}
 placeholder="Search projects…"
 className="mt-2 md:mt-0 w-full md:w-64 rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-cyan-400"
 />
 </div>

 {/* tags */}
 <div className="mt-3 flex flex-wrap gap-2">
 <button
 onClick={() => setState((s) => ({ ...s, tag: "" }))}
 className={`px-3 py-1 rounded-full text-xs border ${!tag ? "bg-cyan-500/20 border-cyan-400/30" : "bg-white/5 border-white/10"}`}
 >
 All tags
 </button>
 {tags.map((t) => (
 <button
 key={t}
 onClick={() =>
 setState((s) => ({ ...s, tag: s.tag === t ? "" : t }))
 }
 className={`px-3 py-1 rounded-full text-xs border ${tag === t ? "bg-cyan-500/20 border-cyan-400/30" : "bg-white/5 border-white/10"}`}
 >
 {t}
 </button>
 ))}
 </div>
 </div>
 );
}
