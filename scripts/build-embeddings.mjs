// scripts/build-embeddings.mjs
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import OpenAI from 'openai';

const ROOT = process.cwd();
const PUBLIC_KNOWLEDGE_DIR = path.join(ROOT, 'public', 'knowledge');
const FN_KNOWLEDGE_DIR = path.join(ROOT, 'netlify', 'functions', 'chat-assistant', 'knowledge');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const pages = JSON.parse(await fs.readFile(path.join(PUBLIC_KNOWLEDGE_DIR, 'pages.json'), 'utf8'));

function chunk(text, tokensApprox = 800) {
  const words = text.split(/\s+/);
  const chunks = [];
  for (let i = 0; i < words.length; i += tokensApprox) {
    chunks.push(words.slice(i, i + tokensApprox).join(' '));
  }
  return chunks;
}

const items = [];
for (const p of pages) {
  const parts = chunk(p.preview);
  parts.forEach((c, i) => items.push({
    id: crypto.randomUUID(),
    path: p.path,
    title: p.title,
    text: c
  }));
}

const emb = await openai.embeddings.create({
  model: 'text-embedding-3-small',
  input: items.map(i => i.text)
});

const index = items.map((it, i) => ({ ...it, embedding: emb.data[i].embedding }));

await fs.writeFile(path.join(PUBLIC_KNOWLEDGE_DIR, 'ai-index.json'), JSON.stringify(index));
// copy into function
await fs.writeFile(path.join(FN_KNOWLEDGE_DIR, 'ai-index.json'), JSON.stringify(index));

console.log(`✅ ai-index.json written (${index.length} chunks) to:
- ${PUBLIC_KNOWLEDGE_DIR}
- ${FN_KNOWLEDGE_DIR}`);
