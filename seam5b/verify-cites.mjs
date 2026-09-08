import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { astTokens } from '../laneSEAM/scripts/wiring-census.mjs';
const ROOT = process.argv[2];
const files = [];
const walk = (d) => { for (const n of readdirSync(d)) { const a = join(d, n); if (statSync(a).isDirectory()) { walk(a); continue; } if (a.endsWith('.js')) files.push(a); } };
walk(join(ROOT, 'src/generators')); walk(join(ROOT, 'src/domain'));
const idx = new Map();
for (const abs of files) {
  const rel = relative(ROOT, abs);
  const { writes, parsed } = astTokens(readFileSync(abs, 'utf8'));
  if (!parsed) continue;
  for (const w of writes) {
    if (!idx.has(w.name)) idx.set(w.name, new Set());
    idx.get(w.name).add(`${rel}:${w.line}`);
  }
}
const ROWS = JSON.parse(readFileSync(process.argv[3], 'utf8'));
let bad = 0;
for (const [token, row] of Object.entries(ROWS)) {
  const set = idx.get(token);
  const ok = set && set.has(row.cite);
  if (!ok) { bad += 1; console.log(`MISS  ${token.padEnd(24)} ${row.kind.padEnd(10)} ${row.cite}   have: ${set ? [...set].slice(0,4).join(' · ') : '(no producer)'}`); }
}
console.log(`rows ${Object.keys(ROWS).length} · citations that do NOT appear in the live producer index: ${bad}`);
