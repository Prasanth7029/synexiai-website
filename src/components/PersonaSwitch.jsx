// src/components/PersonaSwitch.jsx
import React from "react";
import { usePersona } from "../context/PersonaContext";
import { motion, useReducedMotion } from "framer-motion";

const CHOICES = [
  { id: "investor", label: "Investor" },
  { id: "developer", label: "Developer" },
  { id: "partner",  label: "Partner"  },
];

export default function PersonaSwitch({ className = "" }) {
  const { persona, setPersona } = usePersona() ?? { persona: "developer", setPersona: () => {} };
  const reduceMotion = useReducedMotion();

  // Mobile: simple select (prevents crowding + “annoying” tap targets)
  return (
    <div className={className}>
      {/* Mobile dropdown */}
      <div className="sm:hidden">
        <label htmlFor="sxPersona" className="sr-only">Choose persona</label>
        <select
          id="sxPersona"
          value={persona}
          onChange={(e) => setPersona(e.target.value)}
          className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--card-bg)] px-3 py-2 text-sm"
        >
          {CHOICES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
        </select>
      </div>

      {/* Desktop segmented control */}
      <div
        role="tablist"
        aria-label="Persona switch"
        className="hidden sm:inline-flex items-center rounded-full border border-[var(--border-color)] bg-[var(--card-bg)] p-1 shadow-sm"
      >
        {CHOICES.map(c => {
          const active = persona === c.id;
          return (
            <button
              key={c.id}
              role="tab"
              aria-selected={active}
              aria-controls={`panel-${c.id}`}
              tabIndex={active ? 0 : -1}
              onClick={() => setPersona(c.id)}
              className={
                "relative mx-1 my-0.5 rounded-full px-3 py-1 text-sm transition-colors outline-none " +
                (active ? "text-[var(--card-text)]" : "opacity-80 hover:opacity-100")
              }
            >
              {!reduceMotion && active && (
                <motion.span
                  layoutId="sxPersonaPill"
                  className="absolute inset-0 rounded-full"
                  style={{ background: "var(--bg-gradient)" }}
                  transition={{ type: "spring", stiffness: 400, damping: 28 }}
                />
              )}
              <span className="relative z-10">{c.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
