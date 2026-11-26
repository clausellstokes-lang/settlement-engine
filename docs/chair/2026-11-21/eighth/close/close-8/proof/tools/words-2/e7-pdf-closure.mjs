#!/usr/bin/env node
/**
 * WORDS-2 · E7 (a): THE DOSSIER PDF'S STATIC IMPORT CLOSURE, with and without the Daily Life chapter's edge into
 * `src/domain/dailyLife.js`. Roots and stop set are `scripts/lib/writer-reach-scan.mjs :: SURFACE_ROOTS['dossier-pdf']`
 * and `SURFACE_CLOSURE_STOP`; edges are static `import … from` / `export … from` (dynamic `import()` is lazy and not
 * followed). Prints: the closure's size each way; the files reached ONLY through dailyLife.js; and of those, the files a
 * leaf deriving the eight PUBLIC slots would still need (everything dailyLife.js's public derivers import) vs would spare.
 * A MEASURE: changes nothing. Usage (from the tree's root): node e7-pdf-closure.mjs
 */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, normalize, relative } from 'node:path';
const ROOT = process.cwd();
const { SURFACE_ROOTS, SURFACE_CLOSURE_STOP } = await import(join(ROOT, 'scripts/lib/writer-reach-scan.mjs'));
const EXT = ['', '.js', '.jsx', '.mjs', '/index.js', '/index.jsx'];
const resolve = (from, spec) => {
  if (!spec.startsWith('.')) return null;
  const base = normalize(join(dirname(from), spec));
  for (const e of EXT) { const p = base + e; if (existsSync(join(ROOT, p)) && /\.(?:m?js|jsx)$/.test(p)) return p; }
  return null;
};
const edges = (file) => {
  const src = readFileSync(join(ROOT, file), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
  const out = [];
  for (const m of src.matchAll(/\b(?:import|export)\s+(?:[^'"`;]*?\s+from\s+)?['"]([^'"]+)['"]/g)) { const r = resolve(file, m[1]); if (r) out.push(r); }
  return out;
};
const closure = (roots, cut = () => false) => {
  const seen = new Set(); const stack = [...roots];
  while (stack.length) {
    const f = stack.pop(); if (seen.has(f)) continue; seen.add(f);
    if (SURFACE_CLOSURE_STOP.some((s) => f.startsWith(s))) continue;
    for (const t of edges(f)) if (!cut(f, t)) stack.push(t);
  }
  return seen;
};
const roots = SURFACE_ROOTS['dossier-pdf'];
const CH = 'src/pdf/sections/IdentityDailyLife.jsx'; const DL = 'src/domain/dailyLife.js';
const all = closure(roots);
const without = closure(roots, (f, t) => f === CH && t === DL);
const only = [...all].filter((f) => !without.has(f)).sort();
console.log(`dossier-pdf closure: ${all.size} files with the chapter's edge, ${without.size} without; ${only.length} reached only through ${DL}:`);
for (const f of only) console.log(`  ${f}`);
// the owner-only slot's own data file and what only it pulls in
const dlEdges = edges(DL);
const OWNER_ONLY = dlEdges.filter((t) => /commonerResentmentsDm/.test(t));
const leaf = closure(roots, (f, t) => (f === DL && OWNER_ONLY.includes(t)));
console.log(`a leaf without the owner-only slot's import (${OWNER_ONLY.join(', ') || 'none'}): ${leaf.size} files (spares ${all.size - leaf.size})`);
