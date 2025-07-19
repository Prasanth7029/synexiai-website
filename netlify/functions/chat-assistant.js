// netlify/functions/chat-assistant.js
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 10000 // 10 second timeout
});

export async function handler(event) {
  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: ''
    };
  }

  try {
    const { messages } = JSON.parse(event.body);

    const systemMessage = {
      role: "system",
      content: "You are the SynexiAI assistant. Your job is to introduce our vision, goals, and help visitors navigate the site."
    };

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // Consider using this if gpt-4 is too expensive
      messages: [systemMessage, ...messages.filter(m => m.role !== "system")],
      temperature: 0.7
    });

    if (!response.choices?.[0]?.message) {
      throw new Error("Invalid response format from OpenAI");
    }

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        reply: response.choices[0].message.content,
        fullResponse: response // For debugging
      })
    };

  } catch (error) {
    console.error("Chat-assistant error:", error);
    return {
      statusCode: error.status || 500,
      headers: {
        "Content-Type": "application/json",
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      })
    };
  }
}