// src/components/privacy/PrivacyPrefs.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { getConsent, setConsent, applyConsentIntegrations } from "@/lib/consent";

export default function PrivacyPrefs({
  reserveAnchorSelector = ".synexiai-chat, #chat-widget, [data-chat-widget], .chat-fab",
  anchorPaddingPx = 12,
  mobileFallbackBottom = 112, // a touch higher by default
  desktopFallbackBottom = 24,
  zIndex = 50000,
}) {
  const [visible, setVisible] = useState(false);
  const [prefOpen, setPrefOpen] = useState(false);
  const [prefs, setPrefs] = useState(getConsent());
  const [showPill, setShowPill] = useState(false);
  const [bottomExtra, setBottomExtra] = useState(0);
  const [pillHidden, setPillHidden] = useState(false); // ← NEW: hide while typing / keyboard up

  const roRef = useRef(null);
  const anchorRef = useRef(null);
  const isMobileRef = useRef(false);

  // breakpoint helper
  const computeIsMobile = () =>
    (isMobileRef.current =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(max-width: 767px)").matches);

  // --- measure chat widget / FAB and keep a gap above it
  useEffect(() => {
    const anchor =
      document.querySelector(reserveAnchorSelector);
    anchorRef.current = anchor || null;

    const updateOffset = () => {
      const isMobile = computeIsMobile();

      if (!anchorRef.current) {
        setBottomExtra(isMobile ? mobileFallbackBottom : desktopFallbackBottom);
        return;
      }
      const rect = anchorRef.current.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const gapToAnchor = Math.max(0, vh - rect.top) + anchorPaddingPx;
      setBottomExtra(gapToAnchor);
    };

    updateOffset();
    const onResize = () => updateOffset();
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);

    // observe anchor changes
    if (anchorRef.current && "ResizeObserver" in window) {
      roRef.current = new ResizeObserver(updateOffset);
      roRef.current.observe(anchorRef.current);
    }

    // hide pill when keyboard opens (mobile visualViewport height shrinks)
    let vv;
    if ("visualViewport" in window) {
      vv = window.visualViewport;
      const onVV = () => {
        // if the viewport height is much smaller, assume keyboard visible
        const keyboardLikely = vv.height < window.innerHeight - 100;
        setPillHidden(keyboardLikely);
        updateOffset();
      };
      vv.addEventListener("resize", onVV);
      vv.addEventListener("scroll", onVV);
    }

    // hide pill when focus moves inside the chat widget
    const onFocusIn = (e) => {
      if (anchorRef.current && e.target instanceof Element) {
        if (e.target.closest(reserveAnchorSelector)) setPillHidden(true);
      }
    };
    const onFocusOut = (e) => {
      if (anchorRef.current && e.target instanceof Element) {
        if (e.target.closest(reserveAnchorSelector)) setPillHidden(false);
      }
    };
    document.addEventListener("focusin", onFocusIn);
    document.addEventListener("focusout", onFocusOut);

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
      if (roRef.current && anchorRef.current) roRef.current.disconnect();
      if (vv) {
        vv.removeEventListener("resize", () => {});
        vv.removeEventListener("scroll", () => {});
      }
      document.removeEventListener("focusin", onFocusIn);
      document.removeEventListener("focusout", onFocusOut);
    };
  }, [reserveAnchorSelector, anchorPaddingPx, mobileFallbackBottom, desktopFallbackBottom]);

  // consent boot
  useEffect(() => {
    const stored = getConsent();
    const decided =
      stored.updatedAt !== null &&
      (stored.analytics || stored.marketing || stored.necessary);

    if (!decided) {
      setVisible(true);
      setShowPill(false);
    } else {
      setShowPill(true);
    }
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

  // --- positions
  const commonBottom = useMemo(
    () => `calc(env(safe-area-inset-bottom, 0px) + ${Math.round(bottomExtra)}px)`,
    [bottomExtra]
  );

  const bannerStyle = useMemo(
    () => ({ bottom: commonBottom, zIndex }),
    [commonBottom, zIndex]
  );

  // On mobile we dock the pill to the **left**, away from the send button.
  const pillStyle = useMemo(() => {
    const isMobile = isMobileRef.current;
    return isMobile
      ? { bottom: commonBottom, left: "12px", right: "auto", zIndex }
      : { bottom: commonBottom, right: "16px", zIndex };
  }, [commonBottom, zIndex]);

  if (!visible && !prefOpen && !showPill) return null;

  return (
    <>
      {/* Banner */}
      {visible && (
        <div
          className="fixed inset-x-2 md:inset-x-0 md:mx-auto md:max-w-5xl rounded-2xl md:rounded-t-2xl border border-zinc-700/40 bg-[var(--bg-elevated,#0b0b0f)] p-4 md:p-5 shadow-xl"
          style={bannerStyle}
          role="region"
          aria-label="Cookie consent"
        >
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <p className="text-[13px] leading-5 md:text-sm text-[var(--text-color,#eaeaea)]">
              We use cookies and similar technologies for <b>technical/necessary</b> purposes and,
              with your consent, for <b>analytics</b> and <b>marketing</b>, as described in our{" "}
              <a href="/legal/cookies" className="underline hover:opacity-80">
                Cookie Policy
              </a>. Use “Accept” or close this notice to consent. You can change your preferences anytime.
            </p>

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
