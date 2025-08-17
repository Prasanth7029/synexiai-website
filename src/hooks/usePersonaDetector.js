//Users/prashanthkunchanapalli/intelljprojects/synexiai-website/src/hooks/usePersonaDetector.js
import { useEffect } from "react";
import { usePersona } from "../context/PersonaContext";

export default function usePersonaDetector() {
  const { setPersona } = usePersona();

  useEffect(() => {
    const handler = (e) => {
      const el = e.target.closest?.("[data-persona]");
      if (el) {
        const p = el.getAttribute("data-persona");
        if (p) setPersona(p);
      }
    };
    window.addEventListener("click", handler, true);
    return () => window.removeEventListener("click", handler, true);
  }, [setPersona]);
}
