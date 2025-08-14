import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";

const UPDATED = "August 11, 2025";

export default function CookiePolicy() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>Cookie Policy | SynexiAI</title>
        <meta
          name="description"
          content="Comprehensive information about how SynexiAI uses cookies to enhance your experience and how you can manage your preferences."
        />
        <meta name="robots" content="index, follow" />
      </Helmet>

      <main className="min-h-screen bg-[var(--bg-gradient)] text-[var(--text-color)]">
        {/* tighter vertical padding */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-4 py-12 sm:py-14">
          {/* tighter card padding */}
          <div className="bg-[var(--card-bg)] text-[var(--card-text)] rounded-2xl shadow-xl p-5 sm:p-7 lg:p-8 backdrop-blur-sm border border-[var(--border-color)]">
            {/* smaller hero */}
            <div className="text-center mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)]">
                Cookie Policy
              </h1>
              <p className="text-sm md:text-base opacity-90">
                Last updated: {UPDATED}
              </p>
            </div>

            {/* compact prose + accordions */}
            <div
              className="
              prose prose-xs md:prose-sm dark:prose-invert max-w-none
              prose-p:leading-snug prose-li:leading-snug
              prose-headings:mt-6 prose-headings:mb-2
              prose-ul:my-2 prose-ol:my-2
            "
            >
              <p>
                This Cookie Policy explains how SynexiAI (“we”, “us”, or “our”)
                uses cookies and similar tracking technologies when you visit{" "}
                <code className="text-[var(--primary)]">
                  www.synexiai.online
                </code>
                .
              </p>

              <details
                className="group border border-[var(--border-color)] rounded-xl p-4 bg-[var(--card-bg)] mt-3"
                open
              >
                <summary className="cursor-pointer font-semibold text-[15px] flex items-center justify-between">
                  <span>What Are Cookies?</span>
                  <span className="ml-3 text-[var(--primary)] transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <div className="mt-3">
                  <p>
                    Cookies are small text files placed on your device to help
                    websites function, improve performance, and provide
                    analytics or personalization.
                  </p>
                </div>
              </details>

              <details
                className="group border border-[var(--border-color)] rounded-xl p-4 bg-[var(--card-bg)] mt-3"
                open
              >
                <summary className="cursor-pointer font-semibold text-[15px] flex items-center justify-between">
                  <span>How We Use Cookies</span>
                  <span className="ml-3 text-[var(--primary)] transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <div className="mt-3">
                  <ul className="space-y-1.5">
                    <li className="flex items-start">
                      <span className="badge-check" />
                      <span>
                        <strong>Essential:</strong> Core functionality (auth,
                        security).
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="badge-check" />
                      <span>
                        <strong>Performance:</strong> Understand site usage
                        (analytics).
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="badge-check" />
                      <span>
                        <strong>Functionality:</strong> Remember preferences.
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="badge-check" />
                      <span>
                        <strong>Marketing:</strong> Relevant content and
                        campaign measurement.
                      </span>
                    </li>
                  </ul>
                </div>
              </details>

              <details className="group border border-[var(--border-color)] rounded-xl p-4 bg-[var(--card-bg)] mt-3">
                <summary className="cursor-pointer font-semibold text-[15px] flex items-center justify-between">
                  <span>Third-Party Cookies</span>
                  <span className="ml-3 text-[var(--primary)] transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <div className="mt-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="card-secondary p-4">
                      <h3 className="font-medium">Google Analytics</h3>
                      <p className="text-xs opacity-90">
                        Website analytics and performance measurement.
                      </p>
                    </div>
                    <div className="card-secondary p-4">
                      <h3 className="font-medium">Hotjar</h3>
                      <p className="text-xs opacity-90">
                        Behavior analysis and feedback.
                      </p>
                    </div>
                    <div className="card-secondary p-4">
                      <h3 className="font-medium">Facebook Pixel</h3>
                      <p className="text-xs opacity-90">
                        Advertising and conversion tracking.
                      </p>
                    </div>
                    <div className="card-secondary p-4">
                      <h3 className="font-medium">Stripe</h3>
                      <p className="text-xs opacity-90">
                        Payment processing and fraud prevention.
                      </p>
                    </div>
                  </div>
                </div>
              </details>

              <details className="group border border-[var(--border-color)] rounded-xl p-4 bg-[var(--card-bg)] mt-3">
                <summary className="cursor-pointer font-semibold text-[15px] flex items-center justify-between">
                  <span>Manage Your Preferences</span>
                  <span className="ml-3 text-[var(--primary)] transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <div className="mt-3">
                  <ol className="list-decimal pl-5 space-y-1.5">
                    <li>
                      <strong>Browser Settings:</strong> Refuse/accept and
                      delete cookies.
                    </li>
                    <li>
                      <strong>Consent Tool:</strong> Use our on-site consent
                      banner when you first visit.
                    </li>
                    <li>
                      <strong>Opt-Out Links:</strong>
                      <ul className="list-disc pl-5 mt-1 space-y-1">
                        <li>
                          <a
                            href="https://tools.google.com/dlpage/gaoptout"
                            className="link-accent"
                          >
                            Google Analytics Opt-out
                          </a>
                        </li>
                        <li>
                          <a
                            href="https://www.facebook.com/ads/preferences"
                            className="link-accent"
                          >
                            Facebook Ad Preferences
                          </a>
                        </li>
                      </ul>
                    </li>
                  </ol>
                </div>
              </details>

              <details className="group border border-[var(--border-color)] rounded-xl p-4 bg-[var(--card-bg)] mt-3">
                <summary className="cursor-pointer font-semibold text-[15px] flex items-center justify-between">
                  <span>Important Notes</span>
                  <span className="ml-3 text-[var(--primary)] transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <div className="mt-3">
                  <ul className="space-y-1.5">
                    <li className="flex items-start">
                      <span className="dot-accent" /> Disabling essential
                      cookies may affect site functionality.
                    </li>
                    <li className="flex items-start">
                      <span className="dot-accent" /> Clearing cookies resets
                      your saved preferences.
                    </li>
                    <li className="flex items-start">
                      <span className="dot-accent" /> We don’t collect personal
                      data via cookies without consent.
                    </li>
                  </ul>
                </div>
              </details>

              <details className="group border border-[var(--border-color)] rounded-xl p-4 bg-[var(--card-bg)] mt-3">
                <summary className="cursor-pointer font-semibold text-[15px] flex items-center justify-between">
                  <span>Changes to This Policy</span>
                  <span className="ml-3 text-[var(--primary)] transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <div className="mt-3">
                  <p>
                    We post updates here and revise the “Last updated” date.
                    Please review periodically.
                  </p>
                </div>
              </details>

              <details className="group border border-[var(--border-color)] rounded-xl p-4 bg-[var(--card-bg)] mt-3">
                <summary className="cursor-pointer font-semibold text-[15px] flex items-center justify-between">
                  <span>Contact Us</span>
                  <span className="ml-3 text-[var(--primary)] transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <div className="mt-3">
                  <ul className="space-y-1.5">
                    <li className="flex items-center">
                      <svg
                        className="w-4 h-4 mr-2 text-[var(--primary)]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      <a
                        href="mailto:privacy@synexiai.online"
                        className="link-accent"
                      >
                        privacy@synexiai.online
                      </a>
                    </li>
                    <li className="flex items-center">
                      <svg
                        className="w-4 h-4 mr-2 text-[var(--primary)]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                      <span className="text-xs md:text-sm">
                        +1 (555) 123-4567
                      </span>
                    </li>
                  </ul>
                </div>
              </details>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
