// Every non-string difference between two births, tallied by path (array indices folded).
import { readFileSync } from 'node:fs';
const [, , A, B] = process.argv; const tally = new Map(); const add = (p, k) => tally.set(p + ' :: ' + k, (tally.get(p + ' :: ' + k) || 0) + 1);
const walk = (a, b, p) => {
  if (typeof a === 'string' && typeof b === 'string') return;
  if (a === null || b === null || typeof a !== 'object' || typeof b !== 'object') { if (a !== b) add(p, typeof a === typeof b ? 'value' : 'type'); return; }
  if (Array.isArray(a) !== Array.isArray(b)) return add(p, 'type');
  if (Array.isArray(a)) { if (a.length !== b.length) add(p, 'length'); for (let i = 0; i < Math.min(a.length, b.length); i++) walk(a[i], b[i], p + '[]'); return; }
  const ka = Object.keys(a), kb = Object.keys(b); if (ka.join() !== kb.join()) add(p, 'keys');
  for (const k of ka) if (k in b) walk(a[k], b[k], p ? p + '.' + k : k);
};
for (const c of ['golden', 'census']) {
  const rd = (d) => new Map(readFileSync(`${d}/${c}.jsonl`, 'utf8').split('\n').filter(Boolean).map((l) => { const r = JSON.parse(l); return [r.key, r.doc]; }));
  const a = rd(A), b = rd(B); for (const [k, d] of a) walk(d, b.get(k), c);
}
for (const [k, v] of [...tally].sort((x, y) => y[1] - x[1])) console.log(String(v).padStart(7), k);
