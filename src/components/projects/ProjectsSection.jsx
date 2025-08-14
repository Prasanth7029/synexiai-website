import React, { useMemo, useState } from "react";
import ProjectFilters from "./ProjectFilters.jsx";
import ProjectGrid from "./ProjectGrid.jsx";

export default function ProjectsSection({
  items = [],
  title = "Projects",
  preview = false,
  limit = 6,
}) {
  const [state, setState] = useState({ category: "", q: "", tag: "" });
  const allTags = useMemo(
    () => Array.from(new Set(items.flatMap((p) => p.tags || []))),
    [items],
  );

  return (
    <section id="projects" className="mb-20">
      <h2 className="text-center text-2xl sm:text-3xl md:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">
        {title}
      </h2>

      <ProjectFilters state={state} setState={setState} allTags={allTags} />
      <ProjectGrid
        items={items}
        state={state}
        limit={preview ? limit : undefined}
      />

      {preview && (
        <div className="mt-6 text-center">
          <a
            href="#/projects"
            className="inline-block px-5 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500"
          >
            View all projects
          </a>
        </div>
      )}
    </section>
  );
}
