// src/lib/consent.js
const STORAGE_KEY = "synexiai.consent.v1";

// Default: only Necessary enabled
const DEFAULT_CONSENT = {
  necessary: true,
  analytics: false,
  marketing: false,
  updatedAt: null,
};

export function getConsent() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_CONSENT };
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_CONSENT, ...parsed };
  } catch {
    return { ...DEFAULT_CONSENT };
  }
}

export function setConsent(partial) {
  const next = { ...getConsent(), ...partial, updatedAt: new Date().toISOString() };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}

export function hasConsented(category) {
  const c = getConsent();
  return !!c[category];
}

/**
 * Load a <script> only if the given category is allowed.
 * id: DOM id to avoid duplicate inserts
 */
export function loadScriptWhenConsented({ id, src, inline, category = "analytics", attrs = {} }) {
  if (!hasConsented(category)) return false;
  if (id && document.getElementById(id)) return true;

  const s = document.createElement("script");
  if (id) s.id = id;

  // Attributes (e.g., async, defer, data-*)
  Object.entries(attrs).forEach(([k, v]) => {
    if (v === true) s.setAttribute(k, "");
    else if (v !== false && v != null) s.setAttribute(k, String(v));
  });

  if (src) {
    s.src = src;
  } else if (inline) {
    s.textContent = inline;
  }

  document.head.appendChild(s);
  return true;
}

/**
 * Call this after consent changes to (re)load allowed scripts.
 * Put your integrations here (GA, Meta pixel…)
 */
export function applyConsentIntegrations() {
  const c = getConsent();

  // Example: Google Analytics 4 (replace G-XXXX with your ID)
  // We only attach GA if analytics consent is true.
  if (c.analytics) {
    // gtag base
    loadScriptWhenConsented({
      id: "ga4-gtag",
      src: "https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXX",
      category: "analytics",
      attrs: { async: true },
    });
    // init
    loadScriptWhenConsented({
      id: "ga4-inline",
      category: "analytics",
      inline: `
        window.dataLayer = window.dataLayer || [];
        function gtag(){ dataLayer.push(arguments); }
        gtag('js', new Date());
        gtag('config', 'G-XXXXXXXX', { anonymize_ip: true });
      `,
    });
  } else {
    // Disable GA if previously loaded (soft block)
    window['ga-disable-G-XXXXXXXX'] = true;
  }

  // Example: Marketing pixel (pseudo)
  if (c.marketing) {
    // loadScriptWhenConsented({ id: 'meta-pixel', src: 'https://...', category: 'marketing' })
  }
}
