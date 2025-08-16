// src/components/chat/ChatDock.jsx
import React, { useEffect, useRef, useState, useCallback } from "react";
import ReactMarkdown from "react-markdown";

// ✅ reuse the same API the ChatWidget uses
import { chatAxios } from "../../lib/chatAxios";
import { fnUrl } from "../../lib/api";

// ---------- helpers ----------
function roadmapFromStatus(status) {
  switch ((status || "").toLowerCase()) {
    case "poc":
      return [
        "Validate core hypothesis with 2–3 datasets",
        "Collect feedback & refine metrics",
        "Decide go/no-go",
      ];
    case "alpha":
      return [
        "Hardening & load testing",
        "Auth, quotas, rate limits",
        "Internal dogfood rollout",
      ];
    case "mvp":
      return [
        "Pilot with 3–5 users",
        "Observability & rollback paths",
        "Docs, pricing, onboarding",
      ];
    case "stable":
      return [
        "Scale adoption & SLAs",
        "Plugins/SDKs & integrations",
        "Security reviews & compliance",
      ];
    case "design":
      return [
        "Write spec & acceptance criteria",
        "UX flows & mockups",
        "Milestones & success metrics",
      ];
    default:
      return [
        "Define success metrics",
        "Iterate quickly with user feedback",
        "Plan GA criteria",
      ];
  }
}

function formatAnswer(ctx) {
  const p = ctx?.project || {};
  const title = p.title || "Untitled";
  const value =
    p.blurb || "Clear, measurable gains in speed, reliability, and cost.";
  const stack = p.tech && p.tech.length ? p.tech.join(", ") : "TBD";
  const roadmap = roadmapFromStatus(p.status)
    .map((s) => `- ${s}`)
    .join("\n");

  return `**Project:** ${title}

**Value** — ${value}

**Stack** — ${stack}

**Roadmap**
${roadmap}`;
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

// ---- Brand heuristics + system guard (client side) ----
function isBrandQuestion(text = "") {
  return /synexi(ai)?|company|about\s+you|team|projects?|collaborat(e|ion)|contact/i.test(
    text,
  );
}
function looksLikeBrandBlurb(t = "") {
  return /For direct inquiries:|Contact us:\s*Email:/i.test(t) ||
         /SynexiAI is focused/i.test(t);
}
function buildDockSystemPrompt(userText = "", forceGeneral = false) {
  if (forceGeneral || !isBrandQuestion(userText)) {
    return `You are a helpful, general-purpose AI assistant.
Answer the user's question directly and do NOT insert company marketing, mission, or contact info unless the user asks about the company/team/projects/collaboration/contact. Keep answers accurate and concise.`;
  }
  return `You are SynexiAI's site assistant.
If the user asks about the company/team/projects/collaboration/contact, use the official details.
For unrelated questions, answer generally and do NOT add company marketing or contact info.`;
}

// ---------- general Q&A using backend with history + system guard ----------
async function fetchAssistantReplyWithHistory(history, signal, forceGeneral = false) {
  const lastUser = [...history].reverse().find((m) => m.role === "user");
  const sys = buildDockSystemPrompt(lastUser?.text || "", forceGeneral);

  const messages = [
    { role: "system", content: sys },
    ...history.map((m) => ({ role: m.role, content: m.text })),
  ];

  const { data } = await chatAxios.post(
    fnUrl("chat-assistant"),
    { messages },
    { timeout: 20000, signal },
  );

  if (data?.error) throw new Error(data.error);
  if (data?.reply) return data.reply;
  return data?.choices?.[0]?.message?.content ?? "I’m here—ask me anything!";
}

// ---------- component ----------
export default function ChatDock({
  side = "right", // "right" | "left"
  z = 60,
  inset = 24,
  bottom = 24,
}) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [msgs, setMsgs] = useState(() => {
    try {
      return JSON.parse(sessionStorage.getItem("sx_chat")) || [];
    } catch {
      return [];
    }
  });
  const [typing, setTyping] = useState(false);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  const scrollRef = useRef(null);
  const contextRef = useRef(null);
  const lastEventRef = useRef({ key: "", ts: 0 });
  const controllerRef = useRef(null);

  // responsiveness
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // lock body scroll on mobile when open
  useEffect(() => {
    if (!isMobile) return;
    const body = document.body;
    if (open) {
      const prev = body.style.overflow;
      body.style.overflow = "hidden";
      return () => {
        body.style.overflow = prev;
      };
    }
  }, [open, isMobile]);

  // persist
  useEffect(() => {
    try {
      sessionStorage.setItem("sx_chat", JSON.stringify(msgs));
    } catch { /* no op */}
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
        setMsgs((m) => [...m, userMsg]);
        setTyping(true);
        setError(null);

        try {
          let answer;
          if (payload.project) {
            answer = formatAnswer(payload);
          } else {
            controllerRef.current = new AbortController();
            const minimalHistory = [...msgs.slice(-8), userMsg].filter(
              (m) => m.role === "user" || m.role === "assistant",
            );
            // try once with context-aware system message
            answer = await fetchAssistantReplyWithHistory(
              minimalHistory,
              controllerRef.current.signal,
            );
            // if backend still returns brand blurb for a non-brand question, retry in forced general mode
            if (!isBrandQuestion(userText) && looksLikeBrandBlurb(answer)) {
              answer = await fetchAssistantReplyWithHistory(
                minimalHistory,
                controllerRef.current.signal,
                true,
              );
            }
          }
          setMsgs((m) => [...m, { role: "assistant", text: answer, ts: Date.now() }]);
        } catch (err) {
          setMsgs((m) => [
            ...m,
            {
              role: "assistant",
              text: "❗️I couldn’t fetch an answer right now. Please try again in a moment.",
              ts: Date.now(),
            },
          ]);
          setError(err);
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
    window.__synexiaiChat = {
      open: () => setOpen(true),
      openWith: (p) => onAsk({ detail: p }),
    };
    return () => window.removeEventListener("synexiai:ask", onAsk);
  }, [msgs]);

  function clearChat() {
    setMsgs([]);
    setDraft("");
    setError(null);
    contextRef.current = null;
    try {
      sessionStorage.removeItem("sx_chat");
    } catch { /* no op */ }
  }

  // send handler (general AI chat with short history)
  const send = useCallback(async () => {
    const text = draft.trim();
    if (!text || typing) return;

    const userMsg = { role: "user", text, ts: Date.now() };
    setMsgs((m) => [...m, userMsg]);
    setDraft("");
    setTyping(true);
    setError(null);

    const ctx = contextRef.current;

    try {
      let assistantText;
      controllerRef.current = new AbortController();

      if (ctx?.project) {
        // project explainer mode
        assistantText = formatAnswer(ctx);
      } else {
        // regular AI mode with recent history (acts like normal chat)
        const history = [...msgs.slice(-10), userMsg].filter(
          (m) => m.role === "user" || m.role === "assistant",
        );

        // 1st pass: context-aware guard
        assistantText = await fetchAssistantReplyWithHistory(
          history,
          controllerRef.current.signal,
        );

        // If backend still injects brand blurb on non-brand question → force general once
        if (!isBrandQuestion(text) && looksLikeBrandBlurb(assistantText)) {
          assistantText = await fetchAssistantReplyWithHistory(
            history,
            controllerRef.current.signal,
            true,
          );
        }
      }

      setMsgs((m) => [...m, { role: "assistant", text: assistantText, ts: Date.now() }]);
    } catch (err) {
      if (err?.name !== "CanceledError" && err?.message !== "canceled") {
        setMsgs((m) => [
          ...m,
          { role: "assistant", text: "❗️Sorry, something went wrong. Please try again.", ts: Date.now() },
        ]);
        setError(err);
      }
    } finally {
      setTyping(false);
      controllerRef.current = null;
    }
  }, [draft, typing, msgs]);

  function onKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  const stop = () => {
    try {
      controllerRef.current?.abort();
    } catch { /* no op */ }
  };

  // ---------- positioning (safe-area aware) ----------
  const safeBottom = `calc(${bottom}px + env(safe-area-inset-bottom, 0px))`;
  const sheetLift = isMobile ? 72 : 80;
  const panelBottom = `calc(${sheetLift}px + env(safe-area-inset-bottom, 0px))`;
  const sideKey = side === "left" ? "left" : "right";

  return (
    <>
      {/* FAB */}
      <button
        onClick={() => setOpen((v) => !v)}
        style={{ position: "fixed", bottom: safeBottom, [sideKey]: `${inset}px`, zIndex: z }}
        className="h-14 w-14 rounded-full bg-gradient-to-r from-cyan-600 to-blue-600 shadow-lg hover:from-cyan-500 hover:to-blue-500 ring-1 ring-white/20 text-white"
        aria-label="Open SynexiAI chat dock"
      >
        💬
      </button>

      {/* Panel */}
      {open && (
        <div
          style={{
            position: "fixed",
            bottom: panelBottom,
            [sideKey]: `${inset}px`,
            width: isMobile ? "min(92vw, 420px)" : "380px",
            maxWidth: "92vw",
            zIndex: z,
          }}
          className="rounded-2xl border border-white/10 bg-[#0b1220]/95 backdrop-blur-md shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
            <div className="text-sm font-semibold">Dock • Quick Explain</div>
            <div className="flex items-center gap-2">
              {typing && (
                <button
                  onClick={stop}
                  className="text-xs px-2 py-1 rounded bg-white/10 hover:bg-white/20 border border-white/20"
                >
                  Stop
                </button>
              )}
              <button onClick={clearChat} className="text-xs opacity-80 hover:opacity-100">
                Clear
              </button>
              <button onClick={() => setOpen(false)} className="opacity-80 hover:opacity-100" aria-label="Close chat">
                ✕
              </button>
            </div>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            className={`p-4 space-y-3 text-sm overflow-y-auto bg-gradient-to-b from-transparent to-black/5 ${
              isMobile ? "max-h-[60svh]" : "max-h-[60vh]"
            }`}
          >
            {msgs.length === 0 && !typing && (
              <div className="opacity-70">
                Ask anything. Try: “What is AI?” or “Explain SynexiAI’s vision.”
              </div>
            )}

            {msgs.map((m, i) => (
              <div key={i} className={m.role === "user" ? "text-right" : ""}>
                <div
                  className={`inline-block rounded-xl px-3 py-2 ${
                    m.role === "user" ? "bg-cyan-600/20" : "bg-white/5"
                  }`}
                >
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

            {error && (
              <div className="px-3 py-2 rounded-lg text-xs bg-rose-900/40 border border-rose-700/50 text-rose-100">
                {error.message || "Something went wrong. Please try again."}
              </div>
            )}
          </div>

          {/* Composer */}
          <div
            className="p-3 border-t border-white/10 flex gap-2 bg-white/5 backdrop-blur-md"
            style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
          >
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Type your question… (Enter to send, Shift+Enter for newline)"
              rows={isMobile ? 2 : 2}
              className="flex-1 rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-cyan-400 resize-none"
            />
            <button
              onClick={send}
              className="px-3 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white disabled:opacity-50"
              disabled={!draft.trim() || typing}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}
