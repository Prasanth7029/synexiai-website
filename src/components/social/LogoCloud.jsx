// src/components/social/LogoCloud.jsx
import React from "react";

export default function LogoCloud({ items = [], className = "" }) {
  if (!items.length) return null;

  return (
    <div
      role="list"
      aria-label="Trusted by"
      className={[
        className || "grid-1-2-3-4-5",                 // 2 → 3 → 4 → 5 cols (global utility)
        "items-center justify-items-center",
        "gap-3 sm:gap-4 md:gap-6",
      ].join(" ")}
    >
      {items.map((it, i) => {
        const name = it.name || it.alt || "Partner";
        const href = it.url || it.href;
        const src  = it.logo || it.src || it.image;

        const content = src ? (
          <img
            src={src}
            alt={name}
            className="block max-h-8 sm:max-h-10 md:max-h-12 w-auto opacity-80 group-hover:opacity-100 transition-opacity"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <span className="text-sm font-semibold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">
            {name}
          </span>
        );

        const inner = (
          <>
            {content}
            <span
              className="pointer-events-none absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity bg-white/5"
              aria-hidden="true"
            />
          </>
        );

        return (
          <div key={it.id ?? name ?? i} className="min-w-0" role="listitem">
            {href ? (
              <a
                href={href}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={name}
                className="group relative overflow-hidden rounded-xl px-3 sm:px-4 py-4 sm:py-6 text-center"
              >
                {inner}
              </a>
            ) : (
              <div className="group relative overflow-hidden rounded-xl px-3 sm:px-4 py-4 sm:py-6 text-center">
                {inner}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
