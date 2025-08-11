// scripts/build-embeddings.mjs
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import OpenAI from 'openai';

const ROOT = process.cwd();
const PUBLIC_KNOWLEDGE_DIR = path.join(ROOT, 'public', 'knowledge');
const FN_KNOWLEDGE_DIR = path.join(ROOT, 'netlify', 'functions', 'chat-assistant', 'knowledge');
const PAGES_JSON = path.join(PUBLIC_KNOWLEDGE_DIR, 'pages.json');
const OUT_FILE = 'ai-index.json';

if (!process.env.OPENAI_API_KEY) {
  console.error('[kb:embed] OPENAI_API_KEY is not set.');
  process.exit(1);
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Very light, token-ish chunking by words to keep inputs small.
 * For more precise tokenization you can swap in a tokenizer later.
 */
function chunkByWords(text, wordsPerChunk = 800) {
  if (!text || !text.trim()) return [];
  const words = text.split(/\s+/);
  const chunks = [];
  for (let i = 0; i < words.length; i += wordsPerChunk) {
    chunks.push(words.slice(i, i + wordsPerChunk).join(' '));
  }
  return chunks;
}

/** Deterministic ID (stable across runs) from path+title+index */
function makeDeterministicId({ path: p, title, index }) {
  const h = crypto.createHash('sha256');
  h.update(String(p ?? ''));
  h.update('|');
  h.update(String(title ?? ''));
  h.update('|');
  h.update(String(index ?? 0));
  return h.digest('hex').slice(0, 32);
}

/** Safe mkdir -p */
async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

/** Batch an array into chunks of size n */
function batch(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

async function run() {
  // Load pages
  let pagesRaw;
  try {
    pagesRaw = await fs.readFile(PAGES_JSON, 'utf8');
  } catch (err) {
    console.error(`[kb:embed] Unable to read ${PAGES_JSON}. Did you generate it first?`, err.message);
    process.exit(1);
  }

  let pages;
  try {
    pages = JSON.parse(pagesRaw);
  } catch (err) {
    console.error(`[kb:embed] ${PAGES_JSON} is not valid JSON:`, err.message);
    process.exit(1);
  }

  // Build items (chunks)
  const items = [];
  for (const p of pages) {
    const parts = chunkByWords(p.preview, 800);
    parts.forEach((text, i) => {
      items.push({
        id: makeDeterministicId({ path: p.path, title: p.title, index: i }),
        path: p.path,
        title: p.title,
        text,
      });
    });
  }

  if (items.length === 0) {
    console.warn('[kb:embed] No items to embed (pages.json has empty previews?).');
  }

  // Create embeddings in batches
  const MODEL = 'text-embedding-3-small';
  const BATCH_SIZE = 100; // conservative, reliable

  const batches = batch(items, BATCH_SIZE);
  const results = [];

  for (let bi = 0; bi < batches.length; bi++) {
    const b = batches[bi];
    console.log(`[kb:embed] Embedding batch ${bi + 1}/${batches.length} (${b.length} items)...`);
    const resp = await openai.embeddings.create({
      model: MODEL,
      input: b.map((it) => it.text),
    });

    if (!resp?.data || resp.data.length !== b.length) {
      console.error('[kb:embed] Embedding response size mismatch.');
      process.exit(1);
    }

    for (let i = 0; i < b.length; i++) {
      results.push({
        ...b[i],
        embedding: resp.data[i].embedding,
      });
    }
  }

  // Write outputs
  await ensureDir(PUBLIC_KNOWLEDGE_DIR);
  await ensureDir(FN_KNOWLEDGE_DIR);

  const json = JSON.stringify(results, null, 0);
  await fs.writeFile(path.join(PUBLIC_KNOWLEDGE_DIR, OUT_FILE), json);
  await fs.writeFile(path.join(FN_KNOWLEDGE_DIR, OUT_FILE), json);

  console.log(
    `✅ ${OUT_FILE} written (${results.length} chunks) to:\n- ${PUBLIC_KNOWLEDGE_DIR}\n- ${FN_KNOWLEDGE_DIR}`
  );
}

run().catch((err) => {
  console.error('[kb:embed] Failed:', err);
  process.exit(1);
});
