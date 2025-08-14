export default function useAskAI() {
  return (payload) => {
    // If you have a chat widget, listen for this event globally.
    const evt = new CustomEvent("synexiai:ask", { detail: payload });
    window.dispatchEvent(evt);
    // Safe fallback:
    if (!window.__synexiaiChat) {
      console.info("[AskAI]", payload);
      alert(
        `AI explanation requested for:\n${payload.title}\n\n${payload.prompt}`,
      );
    }
  };
}
