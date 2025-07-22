import OpenAI from "openai";
import { companyInfo } from '../../src/lib/companyInfo.js';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 10000 // 10 second timeout
});

const strictSystemPrompt = `YOU MUST FOLLOW THESE RULES STRICTLY:

COMPANY INFORMATION (USE ONLY THESE DETAILS):
- Name: ${companyInfo.name}
- Mission: "${companyInfo.mission}"
- Vision: "${companyInfo.vision}"

TEAM:
- Founder: ${companyInfo.team.founder}
- Team Members: ${companyInfo.team.members.join(', ')}

PROJECTS: ${companyInfo.projects.join(', ')}

CONTACT:
- Email: ${companyInfo.contact.email}
- Phone: ${companyInfo.contact.phone}

RESPONSE TEMPLATES:

1. About company:
"${companyInfo.name} is focused on ${companyInfo.mission}. Our vision is ${companyInfo.vision}."

2. About team:
"Our founder is ${companyInfo.team.founder}. Our team includes ${companyInfo.team.members.join(', ')}."

3. About projects:
"We're currently working on: ${companyInfo.projects.join(', ')}."

4. For other questions:
"I can answer questions about ${companyInfo.name}. Please ask about our team, projects, or mission."

5. ALWAYS END WITH:
"\n\nContact us:\nEmail: ${companyInfo.contact.email}\nPhone: ${companyInfo.contact.phone}"

DO NOT:
- Make up names or positions
- Add information not listed above
- Deviate from these templates
`;

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

    // Prepare messages: enforce strict system prompt + user conversation
    const systemMessage = {
      role: "system",
      content: strictSystemPrompt
    };

    const userMessages = messages.filter(m => m.role !== "system");

    // Call OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [systemMessage, ...userMessages],
      temperature: 0.7
    });

    if (!response.choices?.[0]?.message) {
      throw new Error("Invalid response format from OpenAI");
    }

    // Extract and validate the AI's reply
    let reply = response.choices[0].message.content;
    reply = validateResponse(reply);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ reply })
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

function validateResponse(response) {
  const requiredInfo = [
    companyInfo.name,
    companyInfo.team.founder,
    ...companyInfo.team.members,
    ...companyInfo.projects,
    companyInfo.contact.email,
    companyInfo.contact.phone
  ];

  const isValid = requiredInfo.some(info => response.includes(info));
  return isValid ? response : generateFallbackResponse();
}

function generateFallbackResponse() {
  return `I can tell you about ${companyInfo.name}:

Our founder: ${companyInfo.team.founder}
Our team: ${companyInfo.team.members.join(', ')}
Our projects: ${companyInfo.projects.join(', ')}

Contact us:
Email: ${companyInfo.contact.email}
Phone: ${companyInfo.contact.phone}`;
}