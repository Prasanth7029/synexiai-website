import { access, constants as fsconst } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
const PAGES = path.resolve('public/knowledge/pages.json');

const hasPages = existsSync(PAGES);
const hasKey = !!process.env.OPENAI_API_KEY;

if (!hasPages) {
  console.warn('[kb:embed] Skipped: missing public/knowledge/pages.json');
  process.exit(0);
}
if (!hasKey) {
  console.warn('[kb:embed] Skipped: OPENAI_API_KEY not set');
  process.exit(0);
}

// If both exist, run the real embedder
const { default: run } = await import('./build-embeddings.mjs');
await run?.(); // support either default export or side-effect script
