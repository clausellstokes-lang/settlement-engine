// measured.mjs <before.jsonl> <after.jsonl> — the MEASURED top share by size after the probe, and which drafts printed where.
import { readFileSync } from 'node:fs';
const rd = (f) => readFileSync(f, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l));
const [A, B] = [rd(process.argv[2]), rd(process.argv[3])];
for (const s of ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis']) {
  const top = (rows) => { const m = new Map(); for (const r of rows.filter((x) => x.size === s)) m.set(r.masked, (m.get(r.masked) || 0) + 1); return [...m].sort((a, b) => b[1] - a[1]); };
  const a = top(A), b = top(B); const moved = A.filter((r, i) => r.size === s && r.rc !== B[i].rc).length;
  console.log(`${s.padEnd(11)} before ${a[0][1]}/100 distinct ${a.length} | after ${b[0][1]}/100 distinct ${b.length}: ${b[0][0].slice(0, 70)} | next ${b[1][1]}: ${b[1][0].slice(0, 40)} | sentences moved ${moved}`);
}
const m = new Map(); for (const r of B) m.set(r.masked, (m.get(r.masked) || 0) + 1);
console.log('\nevery after-sentence printed by 6+ places (all sizes):'); for (const [k, v] of [...m].sort((a, b) => b[1] - a[1])) if (v >= 6) console.log(String(v).padStart(4), k.slice(0, 110));
