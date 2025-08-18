import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ProjectFilters from "./ProjectFilters.jsx";
import ProjectGrid from "./ProjectGrid.jsx";

export default function ProjectsSection({
 items = [],
 title = "Featured Portfolio",
 preview = false,
 limit = 6,
 id = "portfolio",
 ctaLabel = "View all work",
 ctaTo = "/portfolio",
}) {
 const safeItems = Array.isArray(items) ? items : [];
 const [state, setState] = useState({ category: "", q: "", tag: "" });

 const allTags = useMemo(
 () => Array.from(new Set(safeItems.flatMap((p) => p?.tags ?? []))),
 [safeItems],
 );

 const hasMore = preview && safeItems.length > limit;

 return (
 <section id={id} className="mb-20">
 <h2 className="text-center text-2xl sm:text-3xl md:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">
 {title}
 </h2>

 <ProjectFilters state={state} setState={setState} allTags={allTags} />

 <ProjectGrid
 items={safeItems}
 state={state}
 limit={preview ? limit : undefined}
 />

 {hasMore && (
 <div className="mt-6 text-center">
 <Link
 to={ctaTo}
 className="inline-block px-5 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500"
 aria-label="Go to the full portfolio page"
 >
 {ctaLabel}
 </Link>
 </div>
 )}
 </section>
 );
}
