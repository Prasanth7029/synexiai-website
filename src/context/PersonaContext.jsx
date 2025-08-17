//Users/prashanthkunchanapalli/intelljprojects/synexiai-website/src/context/PersonaContext.jsx
/* eslint-disable react-refresh/only-export-components */
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const PersonaContext = createContext({
  persona: "general", // 'investor' | 'developer' | 'partner' | 'general'
  source: "heuristic", // 'query' | 'storage' | 'heuristic' | 'manual'
  setPersona: () => {},
});

const STORAGE_KEY = "sx_persona";
const ALLOWED = ["investor", "developer", "partner", "general"];

function detectHeuristic() {
  try {
    const ref = document.referrer || "";
    if (/github|stack(over)?flow|npm/i.test(ref)) return "developer";
    if (/linkedin|angel|crunchbase|pitchbook/i.test(ref)) return "investor";
    if (/partner|alliance|vendor/i.test(ref)) return "partner";
  } catch {
    // no-op
  }
  const loc = (
    window.location.hash ||
    window.location.pathname ||
    ""
  ).toLowerCase();
  if (/tech|stack|api|docs/.test(loc)) return "developer";
  if (/invest/.test(loc)) return "investor";
  if (/partner/.test(loc)) return "partner";
  return "general";
}

function readQueryPersona() {
  try {
    // support HashRouter (?persona=...) and normal search params
    const hash = window.location.hash || "";
    const query = hash.includes("?")
      ? hash.split("?")[1]
      : window.location.search.slice(1);
    const params = new URLSearchParams(query);
    const p = params.get("persona");
    if (p && ALLOWED.includes(p)) return p;
  } catch {
    // no-op
  }
  return null;
}

export function PersonaProvider({ children }) {
  const [persona, setPersonaState] = useState("general");
  const [source, setSource] = useState("heuristic");

  useEffect(() => {
    const qp = readQueryPersona();
    const stored = (() => {
      try {
        return localStorage.getItem(STORAGE_KEY);
      } catch {
        return null;
      }
    })();

    if (qp) {
      setPersonaState(qp);
      setSource("query");
      try {
        localStorage.setItem(STORAGE_KEY, qp);
      } catch {
        // no-op
      }
      return;
    }
    if (stored && ALLOWED.includes(stored)) {
      setPersonaState(stored);
      setSource("storage");
      return;
    }
    const heur = detectHeuristic();
    setPersonaState(heur);
    setSource("heuristic");
  }, []);

  const setPersona = (p) => {
    if (!ALLOWED.includes(p)) return;
    setPersonaState(p);
    setSource("manual");
    try {
      localStorage.setItem(STORAGE_KEY, p);
    } catch {
      // no-op
    }
  };

  const value = useMemo(
    () => ({ persona, source, setPersona }),
    [persona, source],
  );
  return (
    <PersonaContext.Provider value={value}>{children}</PersonaContext.Provider>
  );
}

export function usePersona() {
  return useContext(PersonaContext);
}
