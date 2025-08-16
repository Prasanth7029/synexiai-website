// netlify/functions/chat-assistant.js
import OpenAI from "openai";
import { companyInfo } from "../../src/lib/companyInfo.js";

// ---------- OpenAI client ----------
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 10000, // 10s
});

// ---------- Helpers ----------
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// General assistant (default) — answer ANY question
const generalSystemPrompt =
  "You are a helpful, general-purpose AI assistant. " +
  "Answer the user's question directly and do NOT inject company marketing or contact info unless the user asks about the company/team/projects/collaboration/contact. " +
  "Be accurate, concise, and helpful.";

// Brand-aware assistant — only when asked about SynexiAI
const brandSystemPrompt =
  "You are SynexiAI's official assistant. " +
  "Use ONLY the canonical facts provided. Keep answers concise and factual. " +
  "For unrelated questions, answer generally and do NOT add company marketing or contact info.";

function classifyIntent(text = "") {
  const t = (text || "").toLowerCase();
  if (/(^|\b)(team|member|who.*(ceo|founder)|lead|cto)(\b|$)/i.test(t)) return "team";
  if (/(project|working on|build|repo|github)/i.test(t)) return "projects";
  if (/(collab|partner|invest|work with|contact)/i.test(t)) return "collab";
  if (/(company|mission|vision|about|synexiai)/i.test(t)) return "company";
  return "other";
}

function ensureContactTail(text = "") {
  const email = companyInfo.contact.email;
  const phone = companyInfo.contact.phone;
  if (!text.includes(email) || !text.includes(phone)) {
    const tail = `\n\nContact us:\nEmail: ${email}\nPhone: ${phone}`;
    return (text || "") + tail;
  }
  return text;
}

function factsReply(kind) {
  const { name, mission, vision, contact, team, projects } = companyInfo;
  const members = team.members.join(", ");
  const projectList = projects.join(", ");

  switch (kind) {
    case "team":
      return `Our founder is ${team.founder}. Key team members include: ${members}.`;
    case "projects":
      return `Current projects: ${projectList}.`;
    case "collab":
      return `We welcome collaborations! Contact ${contact.email} or call ${contact.phone}.`;
    case "company":
      return `${name} is focused on ${mission}. Our vision is ${vision}.`;
    default:
      return `I can answer questions about ${name}. Ask about our team, projects, or mission.`;
  }
}

function safeParse(body) {
  try {
    return JSON.parse(body || "{}");
  } catch {
    return {};
  }
}

// ---------- Lambda handler ----------
export async function handler(event) {
  // CORS preflight
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers: CORS_HEADERS, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  if (!process.env.OPENAI_API_KEY) {
    return {
      statusCode: 500,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      body: JSON.stringify({ error: "OPENAI_API_KEY is not set" }),
    };
  }

  try {
    const { messages = [] } = safeParse(event.body);

    // Split out any client-provided system messages (we respect the latest one)
    const clientSystems = messages.filter((m) => m?.role === "system");
    const userMessages = messages.filter((m) => m?.role !== "system");
    const lastUser = userMessages[userMessages.length - 1]?.content || "";

    // Decide mode from the last user message (and respect client system override if present)
    const intent = classifyIntent(lastUser);
    const clientSystemOverride = clientSystems.at(-1)?.content || "";

    const inBrandMode =
      intent !== "other" ||
      /brand[-\s]?mode|synexiai\s+mode|company\s+mode/i.test(clientSystemOverride);

    // If user asked about company/team/projects/collab/contact → canonical facts (zero hallucination)
    if (inBrandMode && intent !== "other") {
      const reply = factsReply(intent);
      // Only append contact for brand intents
      const withContact =
        intent === "company" || intent === "team" || intent === "projects" || intent === "collab"
          ? ensureContactTail(reply)
          : reply;
      return {
        statusCode: 200,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
        body: JSON.stringify({ reply: withContact }),
      };
    }

    // Otherwise: general AI chat (no forced company contact/footer)
    const system = {
      role: "system",
      content: clientSystemOverride?.trim() ? clientSystemOverride : generalSystemPrompt,
    };

    // Only include the facts card in brand mode to avoid biasing general answers
    const factsCard = inBrandMode
      ? {
          role: "system",
          content:
            `FACTS:\n` +
            `Name: ${companyInfo.name}\n` +
            `Mission: ${companyInfo.mission}\n` +
            `Vision: ${companyInfo.vision}\n` +
            `Founder: ${companyInfo.team.founder}\n` +
            `Team: ${companyInfo.team.members.join(", ")}\n` +
            `Projects: ${companyInfo.projects.join(", ")}\n` +
            `Contact: ${companyInfo.contact.email} | ${companyInfo.contact.phone}`,
        }
      : null;

    const apiMessages = [system, ...(factsCard ? [factsCard] : []), ...userMessages];

    const completion = await openai.chat.completions.create({
      // You can keep 3.5 if you want; 4o-mini gives better quality/cost today
      model: "gpt-4o-mini",
      temperature: 0.2,
      max_tokens: 600,
      messages: apiMessages,
    });

    let reply = completion?.choices?.[0]?.message?.content || "I’m here—ask me anything!";
    // In general mode we DO NOT append contact info.
    // In brand mode (without a specific brand intent) we also avoid contact tail to prevent spammy answers.

    return {
      statusCode: 200,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      body: JSON.stringify({ reply }),
    };
  } catch (error) {
    console.error("chat-assistant error:", error);
    return {
      statusCode: 500,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      body: JSON.stringify({ error: error.message || "Unexpected error" }),
    };
  }
}
