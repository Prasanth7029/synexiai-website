// src/components/projects/ProjectGrid.jsx
import React, { useMemo } from "react";
import ProjectCard from "./ProjectCard.jsx";

export default function ProjectGrid({
  items = [],
  state = {},
  limit,
  className = "",
}) {
  const filtered = useMemo(() => {
    const q = (state.q || "").toLowerCase().trim();
    const selCat = (state.category || "").toLowerCase();
    const selTag = (state.tag || "").toLowerCase();

    return (items || []).filter((p) => {
      const title = (p.title || "").toLowerCase();
      const blurb = (p.blurb || "").toLowerCase();
      const tech = (Array.isArray(p.tech) ? p.tech : []).map((t) =>
        String(t).toLowerCase()
      );
      const tags = (Array.isArray(p.tags) ? p.tags : []).map((t) =>
        String(t).toLowerCase()
      );
      const cat = (p.category || "").toLowerCase();

      const categoryOk = !selCat || selCat === "all" || cat === selCat;
      const textOk =
        !q ||
        title.includes(q) ||
        blurb.includes(q) ||
        tech.some((t) => t.includes(q)) ||
        tags.some((t) => t.includes(q));
      const tagOk = !selTag || tags.includes(selTag);

      return categoryOk && textOk && tagOk;
    });
  }, [items, state.q, state.category, state.tag]);

  const list = limit ? filtered.slice(0, limit) : filtered;

  if (!list.length) {
    return (
      <div
        className="rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)]/60 p-8 text-center opacity-90"
        role="status"
        aria-live="polite"
      >
        No projects found. Try clearing filters or searching a different term.
      </div>
    );
  }

  return (
    <div
      role="list"
      aria-label="Projects"
      className={[
        // global utility: 2 on phones → 3 on md+
        "grid-2-3 auto-rows-fr",
        // let XL screens auto-fit wider cards (overrides cols at xl)
        "xl:[grid-template-columns:repeat(auto-fit,minmax(240px,1fr))]",
        // comfortable gaps
        "gap-3 sm:gap-4 md:gap-6",
        className,
      ].join(" ")}
    >
      {list.map((p, i) => (
        <div key={p.id ?? i} className="min-w-0" role="listitem">
          <ProjectCard item={p} idx={i} />
        </div>
      ))}
    </div>
  );
}
