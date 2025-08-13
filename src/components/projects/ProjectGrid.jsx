import React, { useMemo } from "react";
import ProjectCard from "./ProjectCard.jsx";

export default function ProjectGrid({ items = [], state, limit }) {
  const filtered = useMemo(() => {
    const q = (state.q || "").toLowerCase();
    return items.filter(p => {
      const cat = !state.category || p.category === state.category;
      const text = !q || [p.title, p.blurb, ...(p.tech||[]), ...(p.tags||[])].join(" ").toLowerCase().includes(q);
      const tag = !state.tag || (p.tags||[]).includes(state.tag);
      return cat && text && tag;
    });
  }, [items, state]);

  const list = limit ? filtered.slice(0, limit) : filtered;

  if (!list.length) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-8 text-center opacity-80">
        No projects found. Try clearing filters.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {list.map((p, i) => <ProjectCard key={p.id} item={p} idx={i} />)}
    </div>
  );
}
