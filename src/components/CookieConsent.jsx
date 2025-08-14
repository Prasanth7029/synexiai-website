import React, { useEffect, useState } from "react";

const STORAGE_KEY = "synexiai-cookie-consent"; // 'accepted' | 'rejected' | null

export default function CookieConsent() {
  const [choice, setChoice] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (choice === "accepted" && typeof window !== "undefined") {
      // If you use Google Analytics or any tracker, load it here AFTER consent.
      if (typeof window.__loadAnalytics === "function")
        window.__loadAnalytics();
    }
  }, [choice]);

  if (choice) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50">
      <div
        className="mx-auto max-w-4xl m-4 rounded-2xl p-4 shadow-lg
                      bg-white/90 dark:bg-neutral-900/90 backdrop-blur
                      border border-white/20"
      >
        <p className="text-sm mb-3">
          We use cookies to help our site work properly and to understand usage.
          See our{" "}
          <a className="underline" href="/cookie-policy">
            Cookie Policy
          </a>
          .
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => {
              localStorage.setItem(STORAGE_KEY, "accepted");
              setChoice("accepted");
            }}
            className="px-4 py-2 rounded-xl bg-cyan-500 text-black font-medium"
          >
            Accept all
          </button>
          <button
            onClick={() => {
              localStorage.setItem(STORAGE_KEY, "rejected");
              setChoice("rejected");
            }}
            className="px-4 py-2 rounded-xl border border-white/20"
          >
            Reject non-essential
          </button>
          <a
            href="/cookie-policy"
            className="px-4 py-2 text-sm underline self-center"
          >
            Learn more
          </a>
        </div>
      </div>
    </div>
  );
}
