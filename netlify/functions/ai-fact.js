// netlify/functions/ai-fact.js
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// A small rotating pool so we don't always ask the same thing
const TOPICS = [
  { category: "AI • Research",    prompt: "Share a surprising, lesser-known current insight from AI research." },
  { category: "AI • Production",  prompt: "Share a concrete tip for shipping reliable AI features in production." },
  { category: "ML • MLOps",       prompt: "Share a sharp MLOps best practice that avoids hidden failure modes." },
  { category: "Security • AI",    prompt: "Share a security gotcha when integrating LLMs into web apps." },
  { category: "Performance • Web",prompt: "Share a performance trick for modern React/Vite apps shipping to Netlify." },
  { category: "Energy • Green IT",prompt: "Share one actionable fact about carbon-aware compute or ARM efficiency." },
];

// Build strong no-cache headers (CDN + browser)
const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
};
const NO_CACHE = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
  "Pragma": "no-cache",
  "Expires": "0",
  "Surrogate-Control": "no-store",
  // Netlify's CDN honors standard cache headers, but this extra one doesn't hurt:
  "Netlify-CDN-Cache-Control": "no-store",
};

export async function handler(event) {
  try {
    if (event.httpMethod === "OPTIONS") {
      return { statusCode: 200, headers: { ...CORS }, body: "" };
    }

    // Add a nonce to force variety and defeat any stale intermediaries
    const nonce = Math.random().toString(36).slice(2);
    // Pick a topic at random each call
    const idx = Math.floor(Math.random() * TOPICS.length);
    const { category, prompt } = TOPICS[idx];

    // Give the model permission to be punchy + non-repetitive
    const userAsk = `${prompt}
- Keep it to 1-2 sentences.
- Make it specific and practical (no fluff).
- Avoid repeating common tips; be fresh.
- Include ONE concrete example or stat if relevant.
- Today is: ${new Date().toISOString()}.
- Nonce: ${nonce}.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",            // light & fast; tweak as you like
      temperature: 1.0,                 // encourage variety
      top_p: 0.95,
      messages: [
        { role: "system", content: "You produce crisp, factual mini-insights. No emojis. No markdown headings." },
        { role: "user",   content: userAsk },
      ],
    });

    const text = (completion.choices?.[0]?.message?.content || "")
      .trim()
      // tiny guardrails to avoid trailing whitespace/bullets
      .replace(/^\s*[-•]\s*/g, "");

    // Fallback if API produced nothing
    const fact = text || "AI tip: Prefer smaller, faster models in UX-critical paths; pipe the heavy analysis to background jobs.";

    return {
      statusCode: 200,
      headers: { ...CORS, ...NO_CACHE },
      body: JSON.stringify({
        ok: true,
        category,
        fact,
        // Lets your component show a readable time; you also add updatedAt client-side
        generatedAt: new Date().toISOString(),
        // Echo the nonce so you can verify uniqueness in the Network tab if needed
        nonce,
      }),
    };
  } catch (err) {
    console.error("ai-fact failed:", err);
    return {
      statusCode: 200,
      headers: { ...CORS, ...NO_CACHE },
      body: JSON.stringify({
        ok: false,
        error: "AI generation failed. Please try again.",
      }),
    };
  }
}
