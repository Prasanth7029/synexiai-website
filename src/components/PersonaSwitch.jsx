import React from "react";
import { motion } from "framer-motion";
import { usePersona } from "../context/PersonaContext";

const choices = [
  { id: "investor", label: "Investor" },
  { id: "developer", label: "Developer" },
  { id: "partner", label: "Partner" },
];

export default function PersonaSwitch({ className = "" }) {
  const { persona, setPersona } = usePersona();

  return (
    <div
      className={
        "inline-flex items-center rounded-full border border-[var(--border-color)] bg-[var(--card-bg)] p-1 shadow-sm " +
        className
      }
      role="tablist"
      aria-label="Persona switch"
    >
      {choices.map((c) => {
        const active = persona === c.id;
        return (
          <button
            key={c.id}
            role="tab"
            aria-selected={active}
            onClick={() => setPersona(c.id)}
            className={
              "relative mx-1 my-0.5 rounded-full px-3 py-1 text-sm transition-colors " +
              (active
                ? "text-[var(--card-text)]"
                : "opacity-80 hover:opacity-100")
            }
          >
            {active && (
              <motion.span
                layoutId="sxPersonaPill"
                className="absolute inset-0 rounded-full"
                style={{ background: "var(--bg-gradient)" }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">{c.label}</span>
          </button>
        );
      })}
    </div>
  );
}
