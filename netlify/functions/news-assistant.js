import OpenAI from "openai";
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function handler(event) {
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
      },
      body: "",
    };
  }
  try {
    const { messages } = JSON.parse(event.body);
    const systemMessage = {
      role: "system",
      content: `
You are a news assistant. Output EXACTLY one JSON object
with a top-level key "articles", where each article has
id, title, description, category, date, source, imageUrl, and url.
Respond with no commentary or markdown—just pure JSON.
    `.trim(),
    };

    const resp = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [systemMessage, ...messages.filter((m) => m.role !== "system")],
    });

    const text = resp.choices[0].message.content;
    const json = JSON.parse(text); // might still throw if model mis-formats
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(json),
    };
  } catch (error) {
    console.error("News-assistant error:", error);
    return {
      statusCode: error.status || 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ error: error.message }),
    };
  }
}
