// scripts/add-motion-import.mjs
import fs from "node:fs";

const files = [
  "src/components/Footer.jsx",
  "src/components/FeatureCard.jsx",
  "src/components/projects/ProjectCard.jsx",
  "src/components/ValueCard.jsx",
  "src/components/social/Testimonials.jsx",
  "src/components/visuals/GlobeSection.jsx",
  "src/components/visuals/AIPipeline.jsx",
  "src/components/PersonaSwitch.jsx",
  "src/components/TeamMemberCard.jsx",
  "src/pages/Portfolio.jsx",
  "src/pages/VisionPage.jsx",
  "src/pages/HomePage.jsx",
  "src/pages/NotFound.jsx",
  "src/pages/TechStackPage.jsx",
  "src/pages/AboutPage.jsx",
];

for (const f of files) {
  let s = fs.readFileSync(f, "utf8");

  // Only touch files that reference motion.* and don't already import framer-motion
  if (!/motion\./.test(s)) continue;
  if (/from ['"]framer-motion['"]/.test(s)) continue;

  const needsAP = /\bAnimatePresence\b/.test(s);
  const importLine = needsAP
    ? 'import { motion, AnimatePresence } from "framer-motion";'
    : 'import { motion } from "framer-motion";';

  // Insert after the import block (or at top if none found)
  const lines = s.split("\n");
  let insertAt = 0;
  for (let i = 0; i < lines.length; i++) {
    if (!/^import\b/.test(lines[i])) { insertAt = i; break; }
    if (i === lines.length - 1) insertAt = i + 1;
  }
  lines.splice(insertAt, 0, importLine);
  fs.writeFileSync(f, lines.join("\n"), "utf8");
  console.log(`✅ Added import to ${f}`);
}
