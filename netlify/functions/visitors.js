// netlify/functions/visitors.js
import { getStore } from "@netlify/blobs";

const JSON_HEADERS = {
  "content-type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
};

export default async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: JSON_HEADERS });
  }

  // Site-wide KV store for metrics (strong = read-your-write, avoids stale reads)
  const store = getStore({ name: "metrics", consistency: "strong" });
  const key = "visitors_total";

  // Read current value (0 if empty)
  let current = Number((await store.get(key, { consistency: "strong" })) || "0");

  // Increment on POST; GET just reads (so we can avoid double-counting)
  if (req.method === "POST") {
    current += 1;
    await store.set(key, String(current));
  }

  // Optional base offset to start from a big number (e.g., 224,377,655)
  const base = Number(process.env.VISITOR_BASE || "0");
  const total = current + base;

  return new Response(JSON.stringify({ total }), { status: 200, headers: JSON_HEADERS });
};
