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

const strictSystemPrompt =
  "You are SynexiAI's assistant. Use ONLY the facts provided by the system/user. " +
  "Never invent names, roles, or projects. Keep answers concise and factual.";

function classifyIntent(text = "") {
  const t = (text || "").toLowerCase();
  if (/(^|\b)(team|member|who.*(ceo|founder)|lead|cto)(\b|$)/i.test(t)) return "team";
  if (/(project|working on|build|repo|github)/i.test(t)) return "projects";
  if (/(collab|partner|invest|work with|contact)/i.test(t)) return "collab";
  if (/(company|mission|vision|about)/i.test(t)) return "company";
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
      return ensureContactTail(
        `Our founder is ${team.founder}. Key team members include: ${members}.`
      );
    case "projects":
      return ensureContactTail(`Current projects: ${projectList}.`);
    case "collab":
      return ensureContactTail(
        `We welcome collaborations! Contact ${contact.email} or call ${contact.phone}.`
      );
    case "company":
      return ensureContactTail(`${name} is focused on ${mission}. Our vision is ${vision}.`);
    default:
      return ensureContactTail(
        `I can answer questions about ${name}. Ask about our team, projects, or mission.`
      );
  }
}

function safeParse(body) {
  try {
    return JSON.parse(body || "{}");
  } catch {
    return {};
  }
}

// Basic validation: the reply must include at least one canonical fact
function looksLikeFacts(text = "") {
  const required = [
    companyInfo.name,
    companyInfo.team.founder,
    ...companyInfo.team.members,
    ...companyInfo.projects,
    companyInfo.contact.email,
    companyInfo.contact.phone,
  ];
  return required.some((needle) => (text || "").includes(needle));
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
    const userMessages = messages.filter((m) => m?.role !== "system");
    const lastUser = userMessages[userMessages.length - 1]?.content || "";
    const intent = classifyIntent(lastUser);

    // For sensitive intents, return canonical facts immediately (0% chance to hallucinate)
    if (intent !== "other") {
      const reply = factsReply(intent);
      return {
        statusCode: 200,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
        body: JSON.stringify({ reply }),
      };
    }

    // Otherwise, allow the model to paraphrase — but be deterministic & constrained
    const system = { role: "system", content: strictSystemPrompt };
    const companyCard = {
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
    };

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      temperature: 0,
      max_tokens: 300,
      messages: [system, companyCard, ...userMessages],
    });

    let reply = completion?.choices?.[0]?.message?.content || "";
    if (!looksLikeFacts(reply)) {
      // If the LLM tried to wander, snap back to generic facts
      reply = factsReply("company");
    }
    reply = ensureContactTail(reply);

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
