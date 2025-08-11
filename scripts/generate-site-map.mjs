// scripts/generate-site-map.mjs
import { globby } from 'globby';
import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const PUBLIC_KNOWLEDGE_DIR = path.join(ROOT, 'public', 'knowledge');
const FN_KNOWLEDGE_DIR = path.join(ROOT, 'netlify', 'functions', 'chat-assistant', 'knowledge');

function stripTags(s) {
  return s.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

function toPath(p) {
  // src/pages/vision/index.jsx -> /vision
  let out = '/' + p
    .replace(/^src\/pages\//, '')
    .replace(/\.(jsx|tsx|mdx?|js)$/, '')
    .replace(/index$/, '')
    .replace(/\/$/, '');
  return out === '' ? '/' : out;
}

const files = await globby(['src/pages/**/*.{jsx,tsx,js,md,mdx}']);
const pages = await Promise.all(files.map(async (p) => {
  const src = await fs.readFile(p, 'utf8');

  const helmetTitle = (src.match(/<Helmet>[\s\S]*?<title>(.*?)<\/title>/) || [])[1];
  const exportTitle = (src.match(/export\s+const\s+meta\s*=\s*{[\s\S]*?title:\s*["'`](.*?)["'`]/) || [])[1];
  const fallback = path.basename(p).replace(/\.[^/.]+$/, '');
  const title = helmetTitle || exportTitle || fallback;

  const preview = stripTags(src).slice(0, 2000);
  return { title, path: toPath(p), preview };
}));

await fs.mkdir(PUBLIC_KNOWLEDGE_DIR, { recursive: true });
await fs.writeFile(path.join(PUBLIC_KNOWLEDGE_DIR, 'pages.json'), JSON.stringify(pages, null, 2));

// copy for the function bundle (so the lambda can read locally, no HTTP fetch needed)
await fs.mkdir(FN_KNOWLEDGE_DIR, { recursive: true });
await fs.writeFile(path.join(FN_KNOWLEDGE_DIR, 'pages.json'), JSON.stringify(pages));

console.log(`✅ pages.json written (${pages.length} pages) to:
- ${PUBLIC_KNOWLEDGE_DIR}
- ${FN_KNOWLEDGE_DIR}`);
