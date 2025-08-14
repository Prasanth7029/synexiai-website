// scripts/generate-site-map.mjs
import { writeFile, mkdir } from "node:fs/promises";
import { dirname, join, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { glob } from "glob";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Adjust patterns to your repo layout
const patterns = ["src/pages/**/*.{jsx,tsx,md,mdx}", "public/**/*.html"];

function normalizeSlashes(p) {
  return p.replaceAll("\\", "/");
}

function fileToRoute(file) {
  // Convert 'src/pages/About.jsx' -> '/about'
  let p = normalizeSlashes(file);
  if (p.startsWith("src/pages/")) p = p.slice("src/pages/".length);
  p = p.replace(/\.(jsx|tsx|md|mdx|html)$/i, "");

  // index routes: 'about/index' -> 'about', '' -> '/'
  p = p.replace(/\/index$/i, "");
  p = p ? `/${p.toLowerCase()}` : "/";
  return p;
}

async function gatherFiles() {
  const files = new Set();
  for (const pattern of patterns) {
    const matches = await glob(pattern, {
      withFileTypes: false,
      dot: false,
      nodir: true,
    });
    matches.forEach((f) => files.add(f));
  }
  return Array.from(files);
}

async function run() {
  const files = await gatherFiles();

  const routes = files
    .filter((f) => !f.includes(`${sep}__tests__${sep}`) && !f.endsWith(".d.ts"))
    .map(fileToRoute)
    .filter(Boolean)
    .sort((a, b) => (a === "/" ? -1 : a.localeCompare(b)));

  const outDir = join(
    __dirname,
    "../netlify/functions/chat-assistant/knowledge",
  );
  await mkdir(outDir, { recursive: true });

  const payload = {
    generatedAt: new Date().toISOString(),
    routes,
  };

  await writeFile(
    join(outDir, "site-map.json"),
    JSON.stringify(payload, null, 2),
    "utf8",
  );

  console.log(
    `[kb:generate] Wrote ${routes.length} route(s) to netlify/functions/chat-assistant/knowledge/site-map.json`,
  );
}

run().catch((err) => {
  console.error("[kb:generate] Failed:", err);
  process.exit(1);
});
