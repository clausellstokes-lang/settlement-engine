// first-paint static closure of a dist: the entry module(s) of index.html and every static import, recursively.
// usage: node fp-closure.mjs <distA> <distB>  -> per-chunk table (name without hash) of raw bytes, A vs B
import { readFileSync, existsSync } from 'node:fs';
import { join, basename } from 'node:path';
const closure = (dist) => {
  const html = readFileSync(join(dist, 'index.html'), 'utf8');
  const start = [...html.matchAll(/<script[^>]*type="module"[^>]*src="\/?([^"]+)"/g)].map((m) => m[1]);
  const seen = new Map(); const stack = [...start];
  while (stack.length) {
    const rel = stack.pop(); if (seen.has(rel)) continue;
    const p = join(dist, rel); if (!existsSync(p)) continue;
    const src = readFileSync(p, 'utf8'); seen.set(rel, src.length ? Buffer.byteLength(src) : 0);
    for (const m of src.matchAll(/(?:^|[;}\s])import\s*(?:[\w*{}\s,$]+from\s*)?["']\.\/([^"']+\.js)["']/g)) stack.push(join('assets', m[1]));
  }
  const out = new Map();
  for (const [rel, n] of seen) out.set(basename(rel).replace(/-[\w-]{8}\.js$/, ''), (out.get(basename(rel).replace(/-[\w-]{8}\.js$/, '')) ?? 0) + n);
  return out;
};
const [a, b] = process.argv.slice(2).map(closure);
const names = [...new Set([...a.keys(), ...b.keys()])].sort();
let ta = 0, tb = 0; const rows = [];
for (const n of names) { const x = a.get(n) ?? 0, y = b.get(n) ?? 0; ta += x; tb += y; if (x !== y) rows.push([n, x, y, y - x]); }
rows.sort((p, q) => Math.abs(q[3]) - Math.abs(p[3]));
console.log(`chunks: A ${a.size}, B ${b.size}; total raw A ${ta}, B ${tb}, delta ${tb - ta}`);
for (const r of rows) console.log(r.join('\t'));
