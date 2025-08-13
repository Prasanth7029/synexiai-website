import React from "react";

export default function LogoCloud({ items = [] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
      {items.map((it) => (
        <a
          key={it.name}
          href={it.url}
          className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm px-4 py-6 text-center"
        >
          <span className="text-sm font-semibold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">
            {it.name}
          </span>
          <span className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-white/5" />
        </a>
      ))}
    </div>
  );
}
