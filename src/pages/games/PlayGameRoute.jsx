// src/pages/games/PlayGameRoute.jsx
import React, { lazy, Suspense } from "react";
import { useParams } from "react-router-dom";

const modules = import.meta.glob("../../components/puzzles/*.jsx");

export default function PlayGameRoute() {
  const { id } = useParams();
  const entry = Object.entries(modules).find(([p]) =>
    p.toLowerCase().includes(`/puzzles/${id}.jsx`)
  );
  if (!entry) return <div className="p-6">Game not found.</div>;
  const Comp = lazy(entry[1]);

  return (
    <Suspense fallback={<div className="p-6">Loading…</div>}>
      <Comp />
    </Suspense>
  );
}
