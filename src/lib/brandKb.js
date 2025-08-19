// src/lib/brandKb.js
import { companyInfo } from "./companyInfo.js";

/**
 * Tiny KB — expand as needed or swap for a real embedding search later.
 */
const KB = [
  { id: "mission",  text: companyInfo.mission },
  { id: "vision",   text: companyInfo.vision },
  { id: "projects", text: companyInfo.projects.join(" • ") },
  { id: "team",     text: `Founder: ${companyInfo.team.founder}. Team: ${companyInfo.team.members.join(", ")}` },
  { id: "contact",  text: `Email: ${companyInfo.contact.email}. Phone: ${companyInfo.contact.phone}` },
];

/**
 * Simple term-overlap scorer; good enough for small KBs.
 */
export function findKbSnippets(q = "", k = 2) {
  const terms = (q || "").toLowerCase().split(/\W+/).filter(Boolean);
  const score = (t) => terms.reduce((s, w) => s + (t.toLowerCase().includes(w) ? 1 : 0), 0);
  return [...KB]
    .map((x) => ({ ...x, _score: score(x.text) }))
    .sort((a, b) => b._score - a._score)
    .slice(0, k)
    .map((x) => `(${x.id}) ${x.text}`);
}
