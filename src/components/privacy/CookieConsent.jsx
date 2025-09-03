// src/components/privacy/CookieConsent.jsx
import React, { useEffect, useState } from "react";
import { getConsent, setConsent, applyConsentIntegrations } from "@/lib/consent";

// Minimal Tailwind styles; adjust to your theme vars and Uiverse elements if you like
export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [prefOpen, setPrefOpen] = useState(false);
  const [prefs, setPrefs] = useState(getConsent());

  useEffect(() => {
    // Show banner only if non-necessary categories are not decided (both false at default)
    const stored = getConsent();
    const decided = stored.updatedAt !== null && (stored.analytics || stored.marketing || stored.necessary);
    // Strategy: if they've never updated, show banner
    if (!decided) setVisible(true);

    // Apply on mount (in case they previously consented)
    applyConsentIntegrations();
  }, []);

  const acceptAll = () => {
    const next = setConsent({ analytics: true, marketing: true });
    setPrefs(next);
    setVisible(false);
    setPrefOpen(false);
    applyConsentIntegrations();
  };

  const rejectAll = () => {
    const next = setConsent({ analytics: false, marketing: false });
    setPrefs(next);
    setVisible(false);
    setPrefOpen(false);
    applyConsentIntegrations();
  };

  const savePrefs = () => {
    const next = setConsent({
      analytics: !!prefs.analytics,
      marketing: !!prefs.marketing,
    });
    setPrefs(next);
    setPrefOpen(false);
    setVisible(false);
    applyConsentIntegrations();
  };

  if (!visible && !prefOpen) return null;

  return (
    <>
      {/* Banner */}
      {visible && (
        <div className="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-5xl rounded-t-2xl border border-zinc-700/40 bg-[var(--bg-elevated,#0b0b0f)] p-4 shadow-lg">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-[var(--text-color,#eaeaea)]">
              We use cookies and similar technologies for <b>technical/necessary</b> purposes and,
              with your consent, for <b>analytics</b> and <b>marketing</b>, as described in our{" "}
              <a href="/privacy/cookie-policy" className="underline hover:opacity-80">
                Cookie Policy
              </a>.
              Use “Accept” or close this notice to consent. You can change your preferences anytime.
            </p>
            <div className="flex gap-2 self-end md:self-auto">
              <button
                onClick={() => setPrefOpen(true)}
                className="rounded-xl border px-3 py-2 text-sm hover:opacity-90"
              >
                Preferences
              </button>
              <button
                onClick={rejectAll}
                className="rounded-xl border px-3 py-2 text-sm hover:opacity-90"
              >
                Reject
              </button>
              <button
                onClick={acceptAll}
                className="rounded-xl bg-white/10 px-3 py-2 text-sm backdrop-blur hover:opacity-90"
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preferences Modal */}
      {prefOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4">
          <div className="w-full max-w-lg rounded-2xl border border-zinc-700/40 bg-[var(--bg-elevated,#0b0b0f)] p-5 shadow-2xl">
            <h2 className="mb-1 text-xl font-semibold">Privacy Preferences</h2>
            <p className="mb-4 text-sm opacity-80">
              Choose which categories you want to allow. Necessary cookies are always on.
            </p>

            <div className="space-y-3">
              <PrefRow
                label="Necessary"
                description="Required for the site to function (security, preferences)."
                checked
                disabled
              />
              <PrefRow
                label="Analytics"
                description="Helps us understand traffic and improve the website."
                checked={!!prefs.analytics}
                onChange={(v) => setPrefs((p) => ({ ...p, analytics: v }))}
              />
              <PrefRow
                label="Marketing"
                description="Used by advertising/retargeting platforms."
                checked={!!prefs.marketing}
                onChange={(v) => setPrefs((p) => ({ ...p, marketing: v }))}
              />
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button onClick={() => setPrefOpen(false)} className="rounded-xl border px-3 py-2 text-sm">
                Cancel
              </button>
              <button onClick={rejectAll} className="rounded-xl border px-3 py-2 text-sm">
                Reject All
              </button>
              <button onClick={savePrefs} className="rounded-xl bg-white/10 px-3 py-2 text-sm backdrop-blur">
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function PrefRow({ label, description, checked, onChange, disabled }) {
  return (
    <div className="flex items-start justify-between rounded-xl border border-zinc-700/40 p-3">
      <div className="pr-3">
        <div className="font-medium">{label}</div>
        <div className="text-sm opacity-70">{description}</div>
      </div>
      <label className="inline-flex cursor-pointer items-center gap-2">
        <input
          type="checkbox"
          className="h-4 w-4"
          checked={!!checked}
          onChange={(e) => onChange?.(e.target.checked)}
          disabled={disabled}
        />
      </label>
    </div>
  );
}
