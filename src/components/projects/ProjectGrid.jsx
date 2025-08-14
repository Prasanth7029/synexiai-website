import React, { useMemo } from "react";
import ProjectCard from "./ProjectCard.jsx";

/**
 * ProjectGrid
 * - Mobile-first grid with safe wrapping
 * - Prevents overflow via min-w-0 wrappers around each card
 * - Case-insensitive filters for category, tag, and text
 *
 * Props:
 *  - items: Array<Project>
 *  - state: { q?: string, category?: string, tag?: string }
 *  - limit?: number
 *  - className?: string (optional additional classes for outer wrapper)
 */
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

    return items.filter((p) => {
      const title = (p.title || "").toLowerCase();
      const blurb = (p.blurb || "").toLowerCase();
      const tech = (Array.isArray(p.tech) ? p.tech : []).map((t) =>
        String(t).toLowerCase(),
      );
      const tags = (Array.isArray(p.tags) ? p.tags : []).map((t) =>
        String(t).toLowerCase(),
      );
      const cat = (p.category || "").toLowerCase();

      // Category match: allow "all" or empty to mean "no filter"
      const categoryOk = !selCat || selCat === "all" || cat === selCat;

      // Text search across title + blurb + tech + tags
      const textOk =
        !q ||
        title.includes(q) ||
        blurb.includes(q) ||
        tech.some((t) => t.includes(q)) ||
        tags.some((t) => t.includes(q));

      // Tag filter
      const tagOk = !selTag || tags.includes(selTag);

      return categoryOk && textOk && tagOk;
    });
  }, [items, state.q, state.category, state.tag]);

  const list = limit ? filtered.slice(0, limit) : filtered;

  if (!list.length) {
    return (
      <div
        className="rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)]/60
                   backdrop-blur-md p-8 text-center opacity-90"
        role="status"
        aria-live="polite"
      >
        No projects found. Try clearing filters or searching a different term.
      </div>
    );
  }

  return (
    <div
      className={[
        // Mobile-first grid
        "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
        // Use auto-fit at wide screens for nicer wrapping without overflow
        "xl:[grid-template-columns:repeat(auto-fit,minmax(260px,1fr))]",
        // Comfortable gaps
        "gap-4 sm:gap-5 lg:gap-6",
        className,
      ].join(" ")}
    >
      {list.map((p, i) => (
        // min-w-0 ensures child content (long words, code blocks) doesn't widen the column
        <div key={p.id ?? i} className="min-w-0">
          <ProjectCard item={p} idx={i} />
        </div>
      ))}
    </div>
  );
}
