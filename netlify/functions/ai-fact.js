// netlify/functions/ai-fact.js
import OpenAI from "openai";

const HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Content-Type": "application/json",
};

const FIVE_MIN = 0.5 * 60 * 1000;

// lightweight curated fallback
const curatedFacts = [
  { category: "Astronomy",        fact: "Jupiter’s moon Europa likely hides a global subsurface ocean beneath an ice shell." },
  { category: "Renewable Energy", fact: "Utility-scale wind farms often achieve 35–50% capacity factors depending on site conditions." },
  { category: "Computer Science", fact: "Binary search runs in O(log n) time by halving the search space each step." },
  { category: "Physics",          fact: "Graphene is a single layer of carbon atoms arranged in a hexagonal lattice." },
  { category: "History of Tech",  fact: "ENIAC, completed in 1945, was among the first general-purpose electronic computers." },
  { category: "Biology",          fact: "Mitochondria produce most cellular ATP via oxidative phosphorylation." },
  { category: "Energy Storage",   fact: "LFP batteries trade lower energy density for long cycle life and thermal stability." },
];

const categories = [
  "Astronomy","Renewable Energy","Computer Science","Physics",
  "History of Technology","Biology","Energy Storage","Mathematics"
];

let cache = { ts: 0, data: null };

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

export const handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: HEADERS, body: "" };
  }

  try {
    // cache
    const now = Date.now();
    if (cache.data && now - cache.ts < FIVE_MIN) {
      return { statusCode: 200, headers: HEADERS, body: JSON.stringify(cache.data) };
    }

    const qs = event.queryStringParameters || {};
    const mode = (qs.mode || "generate").toLowerCase(); // "generate" | "paraphrase"
    const explicitCategory = qs.category && decodeURIComponent(qs.category);
    const category = explicitCategory || pick(categories);

    const apiKey = process.env.OPENAI_API_KEY;
    const model  = process.env.OPENAI_FACT_MODEL || "gpt-4o-mini";

    let factText = "";
    let usedOpenAI = false;

    if (apiKey) {
      const openai = new OpenAI({ apiKey, timeout: 10_000 });

      if (mode === "generate") {
        const messages = [
          { role: "system", content: "You produce one concise, timeless, widely accepted factual sentence. No speculation. 25 words max. No sources or extra text." },
          { role: "user",   content: `Category: ${category}\nReturn exactly ONE fact sentence.` },
        ];

        // Only set temperature for models that support it
        const opts = { model, messages };
        if (!/^gpt-5/i.test(model)) opts.temperature = 0.2;

        try {
          const chat = await openai.chat.completions.create(opts);
          factText = chat?.choices?.[0]?.message?.content?.trim() || "";
          usedOpenAI = Boolean(factText);
        } catch (err) {
          console.error("[ai-fact] generate error:", err?.message || err);
        }
      } else {
        // paraphrase a curated baseline
        const { fact } = pick(curatedFacts);
        const messages = [
          { role: "system", content: "Rewrite the fact in one crisp sentence without changing meaning. No new claims, dates, or numbers. <= 25 words." },
          { role: "user",   content: `Fact: "${fact}"\nReturn only the sentence.` },
        ];
        const opts = { model, messages };
        if (!/^gpt-5/i.test(model)) opts.temperature = 0.2;

        try {
          const chat = await openai.chat.completions.create(opts);
          factText = chat?.choices?.[0]?.message?.content?.trim() || fact;
          usedOpenAI = true;
        } catch (err) {
          console.error("[ai-fact] paraphrase error:", err?.message || err);
          factText = fact;
        }
      }
    }

    // Fallback if no key or generation failed
    if (!factText) {
      const base = pick(curatedFacts);
      factText = base.fact;
    }

    const payload = {
      ok: true,
      category,
      fact: factText,
      updatedAt: new Date().toISOString(),
      ttlSeconds: 300,
      usedOpenAI,
      mode,
      model,
    };

    cache = { ts: now, data: payload };
    return { statusCode: 200, headers: HEADERS, body: JSON.stringify(payload) };
  } catch (err) {
    console.error("[ai-fact] handler error:", err?.message || err);
    return {
      statusCode: 200,
      headers: HEADERS,
      body: JSON.stringify({ ok: false, error: "AI fact service failed." }),
    };
  }
};
