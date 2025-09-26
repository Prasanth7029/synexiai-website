// src/hooks/useAskAI.js
export default function useAskAI() {
  return (payload) => {
    // Fire global event → your widget listens for this
    const evt = new CustomEvent("synexiai:ask", { detail: payload });
    window.dispatchEvent(evt);

    // Optional fallback if widget not loaded yet
    if (!window.__synexiaiChat) {
      console.info("[AskAI fallback]", payload);
      alert(
        `AI explanation requested for:\n${payload.title}\n\n${payload.prompt}`,
      );
    }
  };
}
