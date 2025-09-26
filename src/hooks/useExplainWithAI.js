import { useCallback } from "react";
import { openSynexiAssistant } from "@/lib/assistantBridge";

export function useExplainWithAI() {
  const explainFn = useCallback((payload) => {
    openSynexiAssistant(payload);
  }, []);

  // keep all call styles so Portfolio.jsx doesn't need edits
  explainFn.explainWithObject = (obj) => openSynexiAssistant(obj);
  explainFn.openWith          = (obj) => openSynexiAssistant(obj);
  explainFn.run               = (text) => openSynexiAssistant({ text });

  return explainFn;
}
