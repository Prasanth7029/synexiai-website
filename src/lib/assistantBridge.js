// src/lib/assistantBridge.js
// Opens the SynexiAI chat widget with context from GitHub

export function openSynexiAssistant(payload = {}) {
  if (window.__synexiaiChat?.openWith) {
    window.__synexiaiChat.openWith(payload);
  } else if (window.__synexiaiChat?.open) {
    window.__synexiaiChat.open();
  } else {
    console.warn("ChatWidget not ready yet. Payload:", payload);
  }
}
