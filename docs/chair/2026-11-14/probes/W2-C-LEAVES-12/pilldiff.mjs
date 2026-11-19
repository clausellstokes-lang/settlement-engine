// pilldiff.mjs <a.jsonl> <b.jsonl> [filterSeedsFile]: pills (card outputs, exports, local) and full-row slots in a, gone/new in b
import fs from 'node:fs';
const rd = (f) => Object.fromEntries(fs.readFileSync(f, 'utf8').trim().split('\n').map((l) => JSON.parse(l)).map((r) => [r.seed, r]));
const [a, b] = [rd(process.argv[2]), rd(process.argv[3])];
const tally = {}; const add = (k, seed) => { (tally[k] ||= []).push(seed); };
let towns = new Set();
for (const s of Object.keys(a)) { const A = a[s], B = b[s]; if (!B) continue;
  A.cards.forEach((c, i) => { const bo = new Set(B.cards[i]?.outs || []);
    for (const o of c.outs) if (!bo.has(o)) { add(`card-out GONE | ${o} | ${c.label} | ${(c.houses||[]).join('/')}`, s); towns.add(s); }
    for (const o of B.cards[i]?.outs || []) if (!c.outs.includes(o)) { add(`card-out NEW | ${o} | ${c.label}`, s); towns.add(s); } });
  for (const side of ['exports', 'local']) { const bs = new Set(B[side]);
    for (const x of A[side]) if (!bs.has(x)) { add(`${side} GONE | ${x}`, s); towns.add(s); }
    for (const x of B[side]) if (!A[side].includes(x)) { add(`${side} NEW | ${x}`, s); towns.add(s); } }
  if (JSON.stringify(A.full) !== JSON.stringify(B.full)) add(`full ${A.full ? A.full.house + '>' + A.full.good : 'none'} -> ${B.full ? B.full.house + '>' + B.full.good : 'none'}`, s);
}
const rows = Object.entries(tally).sort((x, y) => y[1].length - x[1].length);
const kinds = {}; for (const [k, v] of rows) { const kk = k.split(' | ')[0]; kinds[kk] = (kinds[kk] || 0) + v.length; }
console.log('towns touched', towns.size, JSON.stringify(kinds));
const lim = +(process.env.LIM || 60);
for (const [k, v] of rows.slice(0, lim)) console.log(v.length, k, '|', v.slice(0, 2).join(' '));
