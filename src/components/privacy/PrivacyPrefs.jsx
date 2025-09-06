// src/components/privacy/CookieConsent.jsx
import React, { useEffect, useState, useMemo } from "react";
import { getConsent, setConsent, applyConsentIntegrations } from "@/lib/consent";

/**
 * Mobile-first cookie consent
 * - Respects iOS safe area
 * - Leaves room for chatbot/FAB on the bottom-right
 * - Stacks actions on small screens; row layout on md+
 */
export default function CookieConsent({
  // extra space to avoid overlapping your chatbot / FAB
  // tweak if your chat button size changes
  bottomReservedPx = 88,
  // z-index kept high but still below your chat widget if it uses > 60k
  zIndex = 50000,
}) {
  const [visible, setVisible] = useState(false);
  const [prefOpen, setPrefOpen] = useState(false);
  const [prefs, setPrefs] = useState(getConsent());
  const [showPill, setShowPill] = useState(false);

  // Compute safe bottom offset (accounts for iOS notch area)
  const bottomInsetStyle = useMemo(() => {
    // env(safe-area-inset-bottom) is supported on iOS Safari; other browsers treat it as 0
    return {
      bottom: `calc(env(safe-area-inset-bottom, 0px) + ${bottomReservedPx}px)`,
      zIndex,
    };
  }, [bottomReservedPx, zIndex]);

  useEffect(() => {
    const stored = getConsent();
    const decided =
      stored.updatedAt !== null &&
      (stored.analytics || stored.marketing || stored.necessary);

    if (!decided) {
      setVisible(true);
      setShowPill(false);
    } else {
      setShowPill(true); // let users reopen preferences later
    }

    // Apply on mount if previously consented
    applyConsentIntegrations();
  }, []);

  const acceptAll = () => {
    const next = setConsent({ analytics: true, marketing: true });
    setPrefs(next);
    setVisible(false);
    setPrefOpen(false);
    setShowPill(true);
    applyConsentIntegrations();
  };

  const rejectAll = () => {
    const next = setConsent({ analytics: false, marketing: false });
    setPrefs(next);
    setVisible(false);
    setPrefOpen(false);
    setShowPill(true);
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
    setShowPill(true);
    applyConsentIntegrations();
  };

  // Nothing to show
  if (!visible && !prefOpen && !showPill) return null;

  return (
    <>
      {/* Compact reopen pill (won't block the chatbot) */}
      {showPill && !visible && !prefOpen && (
        <button
          aria-label="Open privacy preferences"
          onClick={() => setPrefOpen(true)}
          className="fixed right-3 md:right-4 rounded-full border border-zinc-700/50 bg-[var(--bg-elevated,#0b0b0f)] px-3 py-2 text-xs text-[var(--text-color,#eaeaea)] shadow-lg hover:opacity-90"
          style={bottomInsetStyle}
        >
          Privacy
        </button>
      )}

      {/* Banner (bottom sheet) */}
      {visible && (
        <div
          className="fixed inset-x-2 md:inset-x-0 md:mx-auto md:max-w-5xl rounded-2xl md:rounded-t-2xl border border-zinc-700/40 bg-[var(--bg-elevated,#0b0b0f)] p-4 md:p-5 shadow-xl"
          style={bottomInsetStyle}
          role="region"
          aria-label="Cookie consent"
        >
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <p className="text-[13px] leading-5 md:text-sm text-[var(--text-color,#eaeaea)]">
              We use cookies and similar technologies for <b>technical/necessary</b> purposes and,
              with your consent, for <b>analytics</b> and <b>marketing</b>, as described in our{" "}
              <a href="/privacy/cookie-policy" className="underline hover:opacity-80">
                Cookie Policy
              </a>. Use “Accept” or close this notice to consent. You can change your preferences
              anytime.
            </p>

            {/* Actions: stacked on mobile, inline on md+ */}
            <div className="grid gap-2 md:flex md:items-center">
              <button
                onClick={() => setPrefOpen(true)}
                className="rounded-xl border px-4 py-2 text-sm hover:opacity-90 w-full md:w-auto"
              >
                Preferences
              </button>
              <button
                onClick={rejectAll}
                className="rounded-xl border px-4 py-2 text-sm hover:opacity-90 w-full md:w-auto"
              >
                Reject
              </button>
              <button
                onClick={acceptAll}
                className="rounded-xl bg-white/10 px-4 py-2 text-sm backdrop-blur hover:opacity-90 w-full md:w-auto"
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preferences Modal */}
      {prefOpen && (
        <div
          className="fixed inset-0 grid place-items-end md:place-items-center bg-black/60 p-0 md:p-4"
          style={{ zIndex }}
          aria-modal="true"
          role="dialog"
          aria-label="Privacy Preferences"
        >
          {/* Bottom sheet on mobile, centered modal on md+ */}
          <div className="w-full md:max-w-lg rounded-t-2xl md:rounded-2xl border border-zinc-700/40 bg-[var(--bg-elevated,#0b0b0f)] p-5 shadow-2xl"
               style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 16px)" }}>
            <h2 className="mb-1 text-lg md:text-xl font-semibold">Privacy Preferences</h2>
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

            <div className="mt-5 grid gap-2 md:flex md:justify-end">
              <button
                onClick={() => setPrefOpen(false)}
                className="rounded-xl border px-4 py-2 text-sm w-full md:w-auto"
              >
                Cancel
              </button>
              <button
                onClick={rejectAll}
                className="rounded-xl border px-4 py-2 text-sm w-full md:w-auto"
              >
                Reject All
              </button>
              <button
                onClick={savePrefs}
                className="rounded-xl bg-white/10 px-4 py-2 text-sm backdrop-blur w-full md:w-auto"
              >
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
