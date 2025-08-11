import React from "react";

export default function LoaderScreen() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-0 grid place-items-center bg-[var(--bg-gradient)] text-[var(--text-color)]"
    >
      <div className="sx-loader" aria-label="Loading">
        <div className="sx-sphere-core" />
        <div className="sx-ring sx-ring-1" />
        <div className="sx-ring sx-ring-2" />
        <div className="sx-ring sx-ring-3" />
      </div>
      <span className="sr-only">Loading…</span>
    </div>
  );
}
