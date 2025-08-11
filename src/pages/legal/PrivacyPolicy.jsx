import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

const UPDATED = "August 11, 2025";

export default function PrivacyPolicy() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <>
      <Helmet>
        <title>Privacy Policy | SynexiAI</title>
        <meta name="description" content="How SynexiAI collects, uses, and protects your data." />
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
                Privacy Policy
              </h1>
              <p className="text-sm md:text-base opacity-90">Last updated: {UPDATED}</p>
            </div>

            {/* compact prose + accordions */}
            <div className="
              prose prose-xs md:prose-sm dark:prose-invert max-w-none
              prose-p:leading-snug prose-li:leading-snug
              prose-headings:mt-6 prose-headings:mb-2
              prose-ul:my-2 prose-ol:my-2
            ">
              <p>
                This Privacy Policy explains how <strong>SynexiAI</strong> (“we”, “us”, “our”) collects, uses, and safeguards
                personal information when you use <code>synexiai.online</code> and our services (collectively, the “Services”).
              </p>

              <details className="group border border-[var(--border-color)] rounded-xl p-4 bg-[var(--card-bg)]" open>
                <summary className="cursor-pointer font-semibold text-[15px] flex items-center justify-between">
                  <span>Information We Collect</span>
                  <span className="ml-3 text-[var(--primary)] transition-transform group-open:rotate-45">+</span>
                </summary>
                <div className="mt-3">
                  <ul className="space-y-1.5">
                    <li><strong>Contact data</strong> (e.g., name, email) when you submit a form or contact us.</li>
                    <li><strong>Usage data</strong> (pages viewed, device, approximate location).</li>
                    <li>
                      <strong>Cookies</strong> and similar technologies. See our{" "}
                      <Link to="/cookie-policy" className="link-accent">Cookie Policy</Link>.
                    </li>
                    <li><strong>AI chat inputs</strong> you submit in our on-site chat widget to respond and improve the experience.</li>
                  </ul>
                </div>
              </details>

              <details className="group border border-[var(--border-color)] rounded-xl p-4 bg-[var(--card-bg)] mt-3" open>
                <summary className="cursor-pointer font-semibold text-[15px] flex items-center justify-between">
                  <span>How We Use Information</span>
                  <span className="ml-3 text-[var(--primary)] transition-transform group-open:rotate-45">+</span>
                </summary>
                <div className="mt-3">
                  <ul className="space-y-1.5">
                    <li>Provide, maintain, and improve the website and chat experience.</li>
                    <li>Respond to inquiries and support requests.</li>
                    <li>Analyze site performance and security.</li>
                    <li>Comply with legal obligations.</li>
                  </ul>
                </div>
              </details>

              <details className="group border border-[var(--border-color)] rounded-xl p-4 bg-[var(--card-bg)] mt-3">
                <summary className="cursor-pointer font-semibold text-[15px] flex items-center justify-between">
                  <span>Sharing &amp; Disclosure</span>
                  <span className="ml-3 text-[var(--primary)] transition-transform group-open:rotate-45">+</span>
                </summary>
                <div className="mt-3">
                  <p>
                    We do not sell your personal information. We may share data with service providers (e.g., analytics, hosting)
                    under contractual confidentiality and security obligations, or when required by law.
                  </p>
                </div>
              </details>

              <details className="group border border-[var(--border-color)] rounded-xl p-4 bg-[var(--card-bg)] mt-3">
                <summary className="cursor-pointer font-semibold text-[15px] flex items-center justify-between">
                  <span>Data Retention</span>
                  <span className="ml-3 text-[var(--primary)] transition-transform group-open:rotate-45">+</span>
                </summary>
                <div className="mt-3">
                  <p>
                    We retain personal data only as long as necessary for the purposes described or as required by law.
                    You can request deletion where applicable.
                  </p>
                </div>
              </details>

              <details className="group border border-[var(--border-color)] rounded-xl p-4 bg-[var(--card-bg)] mt-3">
                <summary className="cursor-pointer font-semibold text-[15px] flex items-center justify-between">
                  <span>Security</span>
                  <span className="ml-3 text-[var(--primary)] transition-transform group-open:rotate-45">+</span>
                </summary>
                <div className="mt-3">
                  <p>
                    We use reasonable technical and organizational measures to protect your data. No system is 100% secure,
                    but we continuously improve safeguards.
                  </p>
                </div>
              </details>

              <details className="group border border-[var(--border-color)] rounded-xl p-4 bg-[var(--card-bg)] mt-3">
                <summary className="cursor-pointer font-semibold text-[15px] flex items-center justify-between">
                  <span>Your Rights</span>
                  <span className="ml-3 text-[var(--primary)] transition-transform group-open:rotate-45">+</span>
                </summary>
                <div className="mt-3">
                  <p>
                    Depending on your location, you may have rights to access, correct, delete, or restrict processing of your data,
                    and opt-out of certain uses. Contact us to exercise these rights.
                  </p>
                </div>
              </details>

              <details className="group border border-[var(--border-color)] rounded-xl p-4 bg-[var(--card-bg)] mt-3">
                <summary className="cursor-pointer font-semibold text-[15px] flex items-center justify-between">
                  <span>Children’s Privacy</span>
                  <span className="ml-3 text-[var(--primary)] transition-transform group-open:rotate-45">+</span>
                </summary>
                <div className="mt-3">
                  <p>
                    Our Services are not directed to children under 13. We do not knowingly collect their personal information.
                  </p>
                </div>
              </details>

              <details className="group border border-[var(--border-color)] rounded-xl p-4 bg-[var(--card-bg)] mt-3">
                <summary className="cursor-pointer font-semibold text-[15px] flex items-center justify-between">
                  <span>Changes to This Policy</span>
                  <span className="ml-3 text-[var(--primary)] transition-transform group-open:rotate-45">+</span>
                </summary>
                <div className="mt-3">
                  <p>
                    We may update this Policy. We’ll post updates here and revise the “Last updated” date.
                    Please review periodically.
                  </p>
                </div>
              </details>

              <details className="group border border-[var(--border-color)] rounded-xl p-4 bg-[var(--card-bg)] mt-3">
                <summary className="cursor-pointer font-semibold text-[15px] flex items-center justify-between">
                  <span>Contact Us</span>
                  <span className="ml-3 text-[var(--primary)] transition-transform group-open:rotate-45">+</span>
                </summary>
                <div className="mt-3">
                  <p>
                    Email:{" "}
                    <a href="mailto:privacy@synexiai.online" className="link-accent">
                      privacy@synexiai.online
                    </a>
                  </p>
                  <p className="text-xs opacity-70">
                    This page is provided for informational purposes and is not legal advice.
                  </p>
                </div>
              </details>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
