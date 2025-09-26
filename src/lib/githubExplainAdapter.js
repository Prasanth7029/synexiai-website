// src/lib/githubExplainAdapter.js
// Convert a GitHub repo into the format ChatWidget understands

export function repoToExplainPayload(repo) {
  if (!repo) return null;

  return {
    project: {
      id: repo.id,
      title: repo.name || "Repository",
      blurb: repo.description || "No description provided.",
      tech: [repo.language || "Unknown"],
      status: "mvp", // you can improve this later based on repo topics
    },
    persona: "general",
    autoSend: true,
  };
}
