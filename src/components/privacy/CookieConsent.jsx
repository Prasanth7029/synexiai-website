// src/components/privacy/CookieConsent.jsx
import React, { useEffect, useState } from "react";

const KEY = "synexi:cookie-consent:v1";

export default function CookieConsent() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const v = localStorage.getItem(KEY);
      if (!v) setOpen(true);
    } catch {
      setOpen(true);
    }
  }, []);

  const acceptAll = () => {
    try { localStorage.setItem(KEY, JSON.stringify({ necessary: true, analytics: true, date: Date.now() })); } catch {}
    setOpen(false);
  };

  const rejectAll = () => {
    try { localStorage.setItem(KEY, JSON.stringify({ necessary: true, analytics: false, date: Date.now() })); } catch {}
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[1200] px-4 pb-4"
      style={{ pointerEvents: "none" }}
      aria-live="polite"
    >
      <div
        className="mx-auto max-w-3xl rounded-2xl border border-[color:var(--color-border,#94a3b8)] bg-[color:var(--color-bg-soft,#0b1220)]/95 backdrop-blur px-5 py-4 shadow-xl"
        style={{ pointerEvents: "auto" }}
      >
        <p className="text-sm text-[color:var(--color-text,#e2e8f0)]">
          We use essential and analytics cookies to improve your experience. You can accept or reject analytics.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            onClick={acceptAll}
            className="h-10 rounded-xl px-4 text-sm font-medium text-white bg-[color:var(--brand-cyan,#22d3ee)]"
          >
            Accept all
          </button>
          <button
            onClick={rejectAll}
            className="h-10 rounded-xl px-4 text-sm font-medium border border-[color:var(--color-border,#94a3b8)] text-[color:var(--color-text,#e2e8f0)]"
          >
            Reject analytics
          </button>
        </div>
      </div>

      {/* spacer so it won't overlap your chat/send button on mobile */}
      <div className="h-16" />
    </div>
  );
}
