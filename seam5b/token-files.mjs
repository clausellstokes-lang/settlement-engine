import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { astTokens } from '../laneSEAM/scripts/wiring-census.mjs';
const ROOT = process.argv[2];
const files = [];
const walk = (dir) => { for (const n of readdirSync(dir)) { const abs = join(dir, n); if (statSync(abs).isDirectory()) { walk(abs); continue; } if (abs.endsWith('.js')) files.push(abs); } };
walk(join(ROOT, 'src/generators')); walk(join(ROOT, 'src/domain'));
/** @type {Map<string, Map<string, number>>} token -> file -> first line */
const idx = new Map();
for (const abs of files) {
  const rel = relative(ROOT, abs);
  const { writes, parsed } = astTokens(readFileSync(abs, 'utf8'));
  if (!parsed) continue;
  for (const w of writes) {
    if (!idx.has(w.name)) idx.set(w.name, new Map());
    const m = idx.get(w.name);
    if (!m.has(rel)) m.set(rel, w.line);
  }
}
const census = JSON.parse(readFileSync(join(ROOT, 'docs/content/wiring-census.json'), 'utf8'));
const tokens = new Map();
for (const r of census.rows) for (const p of (r.reads || [])) for (const t of String(p).split(/[^A-Za-z_$0-9]+/).filter(Boolean)) tokens.set(t, (tokens.get(t)||0)+1);
const rows = [...tokens.keys()].sort().map((t) => {
  const m = idx.get(t) || new Map();
  return { token: t, files: m.size, list: [...m].map(([f,l]) => `${f}:${l}`) };
});
for (const r of rows.sort((a,b)=>a.files-b.files || (a.token<b.token?-1:1))) {
  console.log(String(r.files).padStart(3) + '  ' + r.token.padEnd(24) + '  ' + (r.files <= 12 ? r.list.join(' · ') : '(diffuse)'));
}
