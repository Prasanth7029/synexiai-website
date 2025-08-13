import React, { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";

function roadmapFromStatus(status) {
  switch ((status || "").toLowerCase()) {
    case "poc":    return ["Validate core hypothesis with 2–3 datasets", "Collect feedback & refine metrics", "Decide go/no-go"];
    case "alpha":  return ["Hardening & load testing", "Auth, quotas, rate limits", "Internal dogfood rollout"];
    case "mvp":    return ["Pilot with 3–5 users", "Observability & rollback paths", "Docs, pricing, onboarding"];
    case "stable": return ["Scale adoption & SLAs", "Plugins/SDKs & integrations", "Security reviews & compliance"];
    case "design": return ["Write spec & acceptance criteria", "UX flows & mockups", "Milestones & success metrics"];
    default:       return ["Define success metrics", "Iterate quickly with user feedback", "Plan GA criteria"];
  }
}

function formatAnswer(ctx) {
  const p = ctx?.project || {};
  const title = p.title || "Untitled";
  const value = p.blurb || "Clear, measurable gains in speed, reliability, and cost.";
  const stack = (p.tech && p.tech.length) ? p.tech.join(", ") : "TBD";
  const roadmap = roadmapFromStatus(p.status).map(s => `- ${s}`).join("\n");

  return (
    `**Project:** ${title}\n\n` +
    `**Value** — ${value}\n\n` +
    `**Stack** — ${stack}\n\n` +
    `**Roadmap**\n${roadmap}`
  );
}

function buildUserPrompt(payload) {
  const persona = payload.persona || "general";
  const title = payload.project?.title || payload.title || "this project";
  return `Explain "${title}" to a ${persona} in plain English. Include value, stack, and roadmap.`;
}

function formatTime(ts) {
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function ChatDock() {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [msgs, setMsgs] = useState(() => {
    try {
      const saved = sessionStorage.getItem("sx_chat");
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef(null);
  const contextRef = useRef(null);
  const lastEventRef = useRef({ key: "", ts: 0 });

  // persist
  useEffect(() => {
    try { sessionStorage.setItem("sx_chat", JSON.stringify(msgs)); } catch {}
  }, [msgs]);

  // auto-scroll to bottom
  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [msgs, typing, open]);

  useEffect(() => {
    function onAsk(e) {
      const payload = e.detail || {};
      const key = `${payload.type || "ask"}::${payload.project?.id || payload.title || ""}`;
      const now = Date.now();

      // de-dupe rapid double events
      if (lastEventRef.current.key === key && now - lastEventRef.current.ts < 800) return;
      lastEventRef.current = { key, ts: now };

      contextRef.current = payload;
      setOpen(true);

      const userText = buildUserPrompt(payload);
      if (payload.autoSend && payload.project) {
        // post user message then simulate typing, then assistant answer
        const userMsg = { role: "user", text: userText, ts: Date.now() };
        setMsgs(m => [...m, userMsg]);
        setTyping(true);
        const answer = formatAnswer(payload);
        setTimeout(() => {
          setMsgs(m => [...m, { role: "assistant", text: answer, ts: Date.now() }]);
          setTyping(false);
        }, 450);
        setDraft("");
      } else {
        setDraft(userText);
      }
    }
    window.addEventListener("synexiai:ask", onAsk);
    window.__synexiaiChat = { open: () => setOpen(true), openWith: (p) => onAsk({ detail: p }) };
    return () => window.removeEventListener("synexiai:ask", onAsk);
  }, []);

  function send() {
    if (!draft.trim()) return;
    const user = { role: "user", text: draft.trim(), ts: Date.now() };
    setMsgs(m => [...m, user]);
    setDraft("");

    const ctx = contextRef.current;
    const assistantText = ctx?.project ? formatAnswer(ctx) : "Got it — drafting a detailed answer next.";
    setTyping(true);
    setTimeout(() => {
      setMsgs(m => [...m, { role: "assistant", text: assistantText, ts: Date.now() }]);
      setTyping(false);
    }, 350);
  }

  function onKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  function clearChat() {
    setMsgs([]);
    setDraft("");
    contextRef.current = null;
    try { sessionStorage.removeItem("sx_chat"); } catch {}
  }

  return (
    <>
      {/* FAB */}
      <button
        onClick={() => setOpen(v => !v)}
        className="fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full bg-gradient-to-r from-cyan-600 to-blue-600 shadow-lg hover:from-cyan-500 hover:to-blue-500"
        aria-label="Open SynexiAI chat"
      >
        💬
      </button>

      {/* Panel */}
      {open && (
        <div className="fixed bottom-24 right-6 z-40 w-[360px] max-w-[92vw] rounded-2xl border border-white/10 bg-[#0b1220]/95 backdrop-blur-md shadow-2xl">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
            <div className="text-sm font-semibold">SynexiAI Assistant</div>
            <div className="flex items-center gap-2">
              <button onClick={clearChat} className="text-xs opacity-80 hover:opacity-100">Clear</button>
              <button onClick={() => setOpen(false)} className="opacity-80 hover:opacity-100">✕</button>
            </div>
          </div>

          <div ref={scrollRef} className="max-h-[50vh] overflow-y-auto p-4 space-y-3 text-sm">
            {msgs.length === 0 && !typing && (
              <div className="opacity-70">Ask anything about a project. Try “Explain with AI”.</div>
            )}

            {msgs.map((m, i) => (
              <div key={i} className={m.role === "user" ? "text-right" : ""}>
                <div className={`inline-block rounded-xl px-3 py-2 ${m.role === "user" ? "bg-cyan-600/20" : "bg-white/5"}`}>
                  <div className="prose prose-invert prose-sm max-w-none">
                    <ReactMarkdown>{m.text}</ReactMarkdown>
                  </div>
                  <div className="mt-1 text-[10px] opacity-60 text-right">{formatTime(m.ts)}</div>
                </div>
              </div>
            ))}

            {typing && (
              <div className="inline-block rounded-xl px-3 py-2 bg-white/5">
                <div className="flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:-0.2s]" />
                  <span className="inline-block h-2 w-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:-0.1s]" />
                  <span className="inline-block h-2 w-2 rounded-full bg-cyan-400 animate-bounce" />
                  <span className="text-xs opacity-70 ml-2">typing…</span>
                </div>
              </div>
            )}
          </div>

          <div className="p-3 border-t border-white/10 flex gap-2">
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Type your question… (Enter to send, Shift+Enter for newline)"
              rows={2}
              className="flex-1 rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-cyan-400 resize-none"
            />
            <button onClick={send} className="px-3 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500">
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}
