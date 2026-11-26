import { readFileSync } from 'node:fs';
const rows = readFileSync(process.argv[2], 'utf8').trim().split('\n').map((l) => JSON.parse(l));
const by = {};
for (const r of rows) {
  const b = (by[r.size] ||= { n: 0, rec: 0, powers: 0, tail: 0, noPrefix: 0, noBase: 0, tailZero: 0, calls: new Set() });
  b.n++; b.rec += r.recordBytes; b.calls.add(r.annotateCalls);
  for (const p of r.powers) { b.powers++; if (p.baseLen === null) b.noBase++; else if (!p.baseIsPrefix) b.noPrefix++; else { b.tail += p.tailLen; if (!p.tailLen) b.tailZero++; } }
}
console.log('size        births  avgRecordB  powers/birth  avgTailB/birth  tail%rec  noBase  baseNotPrefix  emptyTail  annotateCalls');
for (const [z, b] of Object.entries(by)) console.log(z.padEnd(11), String(b.n).padStart(6), String(Math.round(b.rec / b.n)).padStart(11), (b.powers / b.n).toFixed(1).padStart(13), String(Math.round(b.tail / b.n)).padStart(15), (100 * b.tail / b.rec).toFixed(2).padStart(9), String(b.noBase).padStart(7), String(b.noPrefix).padStart(14), String(b.tailZero).padStart(10), [...b.calls].join(','));
