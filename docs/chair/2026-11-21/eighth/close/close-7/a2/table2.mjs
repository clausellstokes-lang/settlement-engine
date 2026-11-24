// A2 (R24d): the table AS BUILT: each printed|production cell, the fare branch before (the production band) and after
// (the bound), with its count on C and V. node table2.mjs <before-C.jsonl> <before-V.jsonl>
import { readFileSync } from 'node:fs';
const L = ['surplus', 'adequate', 'strained', 'critical', 'collapsed'];
const B = { surplus: ['surplus', 'adequate'], secure: ['surplus', 'adequate'], pressured: ['adequate', 'strained'], importDependent: ['strained', 'critical'], deficit: ['strained', 'critical'], famine: ['critical', 'collapsed'] };
const fare = (p, b) => { const at = L.indexOf(b); if (!B[p] || at < 0) return b; if (p === 'famine' && at <= 1) return b; const [m, n] = B[p].map((x) => L.indexOf(x)); return L[Math.min(Math.max(at, m), n)]; };
const [c, v] = process.argv.slice(2).map((f) => readFileSync(f, 'utf8').trim().split('\n').map((l) => JSON.parse(l)));
const cells = {};
for (const [k, rows] of [['C', c], ['V', v]]) for (const r of rows) { const key = `${r.printed}|${r.prod}`; (cells[key] ||= { C: 0, V: 0 })[k]++; }
console.log('cell\tbefore\tafter\tmoved\tC\tV');
for (const [key, n] of Object.entries(cells).sort()) { const [p, b] = key.split('|'); const a = fare(p, b); console.log([key, b, a + (p === 'famine' && L.indexOf(b) <= 1 ? ' (held: the mirror unit)' : ''), a === b ? '' : 'MOVED', n.C, n.V].join('\t')); }
