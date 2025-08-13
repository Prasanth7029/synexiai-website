import React, { useEffect, useRef, useState, useCallback } from "react";
import ReactMarkdown from "react-markdown";

// ✅ NEW: reuse the same API the ChatWidget uses
import { chatAxios } from "../../lib/chatAxios";
import { fnUrl } from "../../lib/api";

// ---------- helpers ----------
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
`**Project:** ${title}

**Value** — ${value}

**Stack** — ${stack}

**Roadmap**
${roadmap}`
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

// ---------- NEW: backend call for generic Q&A ----------
async function fetchAssistantReply(userText, signal) {
  // very short history keeps payload light; you can expand later
  const payload = { messages: [{ role: "user", content: userText }] };

  const { data } = await chatAxios.post(
    fnUrl("chat-assistant"),
    payload,
    { timeout: 10000, signal }
  );

  if (data?.error) throw new Error(data.error);
  if (data?.reply) return data.reply;
  if (data?.choices?.[0]?.message?.content) return data.choices[0].message.content;

  // Fallback if the server returned no text
  return "Here’s a quick answer:\n\nArtificial Intelligence (AI) is software that learns patterns from data to make predictions, generate content, or automate decisions. Modern AI uses large neural networks (LLMs, vision models) and runs on GPUs/TPUs. Typical steps: collect data → train → evaluate → deploy → monitor.";
}

// ---------- component ----------
export default function ChatDock() {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [msgs, setMsgs] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem("sx_chat")) || []; }
    catch { return []; }
  });
  const [typing, setTyping] = useState(false);

  const scrollRef = useRef(null);
  const contextRef = useRef(null);
  const lastEventRef = useRef({ key: "", ts: 0 });
  const controllerRef = useRef(null);

  // persist
  useEffect(() => {
    try { sessionStorage.setItem("sx_chat", JSON.stringify(msgs)); } catch {}
  }, [msgs]);

  // auto-scroll
  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [msgs, typing, open]);

  // bridge + auto-fill
  useEffect(() => {
    async function onAsk(e) {
      const payload = e.detail || {};
      const key = `${payload.type || "ask"}::${payload.project?.id || payload.title || ""}`;
      const now = Date.now();
      if (lastEventRef.current.key === key && now - lastEventRef.current.ts < 800) return;
      lastEventRef.current = { key, ts: now };

      contextRef.current = payload;
      setOpen(true);

      const userText = buildUserPrompt(payload);
      if (payload.autoSend) {
        const userMsg = { role: "user", text: userText, ts: Date.now() };
        setMsgs(m => [...m, userMsg]);
        setTyping(true);

        // project summary or backend Q&A
        try {
          let answer;
          if (payload.project) {
            answer = formatAnswer(payload);
          } else {
            controllerRef.current = new AbortController();
            answer = await fetchAssistantReply(userText, controllerRef.current.signal);
          }
          setMsgs(m => [...m, { role: "assistant", text: answer, ts: Date.now() }]);
        } catch (err) {
          setMsgs(m => [...m, { role: "assistant", text:
            `❗️I couldn’t fetch an answer right now.\n\nQuick tip: AI = software that learns from data to predict, generate, or automate. Typical flow: collect → train → evaluate → deploy → monitor.`, ts: Date.now() }]);
        } finally {
          setTyping(false);
          controllerRef.current = null;
        }
        setDraft("");
      } else {
        setDraft(userText);
      }
    }
    window.addEventListener("synexiai:ask", onAsk);
    window.__synexiaiChat = { open: () => setOpen(true), openWith: (p) => onAsk({ detail: p }) };
    return () => window.removeEventListener("synexiai:ask", onAsk);
  }, []);

  function clearChat() {
    setMsgs([]);
    setDraft("");
    contextRef.current = null;
    try { sessionStorage.removeItem("sx_chat"); } catch {}
  }

  // send handler (uses backend when no project context)
  const send = useCallback(async () => {
    const text = draft.trim();
    if (!text || typing) return;

    const userMsg = { role: "user", text, ts: Date.now() };
    setMsgs(m => [...m, userMsg]);
    setDraft("");
    setTyping(true);

    const ctx = contextRef.current;
    try {
      let assistantText;
      if (ctx?.project) {
        assistantText = formatAnswer(ctx);
      } else {
        controllerRef.current = new AbortController();
        assistantText = await fetchAssistantReply(text, controllerRef.current.signal);
      }
      setMsgs(m => [...m, { role: "assistant", text: assistantText, ts: Date.now() }]);
    } catch (err) {
      setMsgs(m => [...m, { role: "assistant", text:
        `❗️Sorry, I hit an error.\n\nHere’s a quick summary:\nAI (Artificial Intelligence) uses learned patterns (models) to solve tasks like understanding text, classifying images, or generating content. Modern AI relies on neural networks, GPUs/TPUs, and MLOps for data/monitoring.`, ts: Date.now() }]);
    } finally {
      setTyping(false);
      controllerRef.current = null;
    }
  }, [draft, typing]);

  function onKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  return (
    <>
      {/* FAB (left bottom per your layout) */}
      <button
        onClick={() => setOpen(v => !v)}
        className="fixed bottom-6 left-6 z-40 h-14 w-14 rounded-full bg-gradient-to-r from-cyan-600 to-blue-600 shadow-lg hover:from-cyan-500 hover:to-blue-500"
        aria-label="Open SynexiAI chat dock"
      >
        💬
      </button>

      {/* Panel */}
      {open && (
        <div className="fixed bottom-24 left-6 z-40 w-[360px] max-w-[92vw] rounded-2xl border border-white/10 bg-[#0b1220]/95 backdrop-blur-md shadow-2xl">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
            <div className="text-sm font-semibold">Dock • Quick Explain</div>
            <div className="flex items-center gap-2">
              <button onClick={clearChat} className="text-xs opacity-80 hover:opacity-100">Clear</button>
              <button onClick={() => setOpen(false)} className="opacity-80 hover:opacity-100">✕</button>
            </div>
          </div>

          <div ref={scrollRef} className="max-h-[50vh] overflow-y-auto p-4 space-y-3 text-sm">
            {msgs.length === 0 && !typing && (
              <div className="opacity-70">Ask anything. Try: “What is AI?” or “Explain SynexiAI’s vision.”</div>
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
