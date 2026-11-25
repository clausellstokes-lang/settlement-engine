#!/usr/bin/env node
// GUARD (R24j 8): compare two trees' births of one plan (guard-births.census.jsx outputs).
// node guard-births-compare.mjs <before.jsonl> <after.jsonl> [label]
import { readFileSync } from 'node:fs';
const read = (f) => new Map(readFileSync(f, 'utf8').trim().split('\n').map((l) => JSON.parse(l)).map((r) => [r.seed, r]));
const [a, b, label = ''] = process.argv.slice(2);
const A = read(a); const B = read(b);
let n = 0; let whole = 0; let rest = 0; let keys = 0; const stamps = new Map(); const odd = [];
for (const [seed, x] of A) {
  const y = B.get(seed); if (!y) { odd.push(`${seed}: missing after`); continue; }
  n += 1;
  if (x.whole !== y.whole) whole += 1;
  if (x.withoutVersion !== y.withoutVersion) { rest += 1; odd.push(`${seed}: moved beyond the version`); }
  if (x.keys !== y.keys) { keys += 1; odd.push(`${seed}: key order or set moved`); }
  const s = `${x.generatorVersion} -> ${y.generatorVersion}`; stamps.set(s, (stamps.get(s) || 0) + 1);
}
console.log(`${label}: births ${n}; whole record moved ${whole}; moved with generatorVersion set apart ${rest}; key order/set moved ${keys}; stamps ${[...stamps].map(([s, c]) => `${s} ×${c}`).join(', ')}`);
if (odd.length) console.log(odd.slice(0, 20).join('\n'));
