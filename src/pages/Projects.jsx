// src/pages/Projects.jsx
import React from "react";
import { projects } from "../content/projects.js";
import ProjectsSection from "../components/projects/ProjectsSection.jsx";

export default function ProjectsPage() {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-20 text-gray-900 dark:text-gray-100">
      <ProjectsSection items={projects} title="Project Showcase" />
    </div>
  );
}
