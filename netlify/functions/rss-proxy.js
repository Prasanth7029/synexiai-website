// netlify/functions/rss-proxy.js
import Parser from "rss-parser";

const CATEGORY_FEEDS = {
  ai: "https://www.artificialintelligence-news.com/feed/",
  database: "https://db-engines.com/en/rss/blog.xml",
  renewable: "https://cleantechnica.com/feed/",
  innovation: "https://techcrunch.com/feed/",
};

// Helper: timeout a promise
function withTimeout(promise, ms) {
  return Promise.race([
    promise,
    new Promise((_, rej) =>
      setTimeout(() => rej(new Error("Request timeout")), ms),
    ),
  ]);
}

export async function handler(event) {
  // CORS preflight
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
      },
      body: "",
    };
  }

  const { category } = event.queryStringParameters || {};

  // Unknown category?
  const feedUrl = CATEGORY_FEEDS[category];
  if (!feedUrl) {
    console.warn(`RSS proxy: unknown category=${category}`);
    return jsonResponse([]);
  }

  try {
    // Fetch raw XML with timeout and custom UA
    const res = await withTimeout(
      fetch(feedUrl, { headers: { "User-Agent": "Mozilla/5.0" } }),
      10000,
    );

    if (!res.ok) {
      console.warn(`RSS proxy: fetch status ${res.status} for ${feedUrl}`);
      return jsonResponse([]);
    }

    const xml = await res.text();
    const parser = new Parser();
    const feed = await withTimeout(parser.parseString(xml), 8000);

    // Map items
    const items = (feed.items || []).slice(0, 5).map((item, i) => ({
      id: `rss-${category}-${i}-${Date.now()}`,
      title: item.title || "Untitled",
      description:
        item.contentSnippet ||
        (item.content && item.content.substring(0, 200) + "...") ||
        "No description available",
      url: item.link || "#",
      imageUrl:
        item.enclosure?.url ||
        extractFirstImage(item.content) ||
        "/fallback-image.jpg",
      date: item.isoDate || item.pubDate || new Date().toISOString(),
      source: feed.title || "Unknown source",
      category,
      type: "blog",
    }));

    return jsonResponse(items);
  } catch (error) {
    console.error("RSS proxy error:", error);
    // Always return 200 + empty array on any failure
    return jsonResponse([]);
  }
}

// Utility to send JSON + CORS
function jsonResponse(data) {
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify(data),
  };
}

function extractFirstImage(content) {
  if (!content) return null;
  const match = content.match(/<img[^>]+src="?([^"\s]+)"?[^>]*>/i);
  return match ? match[1] : null;
}
