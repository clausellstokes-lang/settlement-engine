// RANGE-MEASURE: the proper names of each town of a corpus (for "word for word but for names").
// node names.mjs <corpus.jsonl> <out.json>
// Collects every string under a key ending in "name" (name, fullName, settlementName, ...), 1 to 6 words, capitalised,
// plus each part (3+ letters) of a person's name. A collected string that is a name in 2% or more of the corpus's towns is
// GENERIC (a kind of house, a government's label: "Elder Council"), and is NOT masked: only the town's own names are.
import { createReadStream, writeFileSync } from 'node:fs';
import { createInterface } from 'node:readline';
const [IN, OUT] = process.argv.slice(2);
const per = {}; const df = new Map(); let towns = 0;
const rl = createInterface({ input: createReadStream(IN), crlfDelay: Infinity });
for await (const L of rl) {
  if (!L) continue; let r; try { r = JSON.parse(L); } catch { continue; } if (r.error || !r.town) continue; towns++;
  const got = new Set();
  const add = (s) => { s = s.trim(); if (s.length >= 3 && /^[A-Z]/.test(s) && s.split(/\s+/).length <= 6) got.add(s); };
  (function walk(v, k, d) {
    if (d > 12 || v == null) return;
    if (typeof v === 'string') { if (k && /name$/i.test(k)) add(v); return; }
    if (Array.isArray(v)) { v.forEach((x) => walk(x, k, d + 1)); return; }
    if (typeof v === 'object') for (const [kk, vv] of Object.entries(v)) walk(vv, kk, d + 1);
  })(r.town, '', 0);
  for (const n of r.town.npcs || []) if (typeof n?.name === 'string') for (const part of n.name.split(/\s+/)) if (part.length >= 3 && /^[A-Z]/.test(part)) got.add(part);
  if (typeof r.town.name === 'string') got.add(r.town.name);
  per[r.seed] = [...got];
  for (const n of got) df.set(n, (df.get(n) || 0) + 1);
}
const generic = new Set([...df.entries()].filter(([, c]) => c >= Math.max(3, towns * 0.02)).map(([n]) => n));
const out = {};
for (const [seed, ns] of Object.entries(per)) out[seed] = ns.filter((n) => !generic.has(n)).sort((a, b) => b.length - a.length);
writeFileSync(OUT, JSON.stringify({ towns, generic: [...generic], names: out }));
console.log(`towns ${towns}; generic names (not masked) ${generic.size}; e.g.`, [...generic].slice(0, 15));
