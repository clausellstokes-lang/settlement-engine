// mintdiff.mjs <line mints.json> <tip mints.json>: the fork census row's mint seeds that moved, count by count
// (the dumps are written by forkmeasure.test.js.txt, copied into tests/generators/ as a .test.js, MINTDUMP=<file>, run, deleted)
import fs from 'node:fs';
const [a, b] = process.argv.slice(2).map((f) => JSON.parse(fs.readFileSync(f, 'utf8')).map((r) => r[0]));
const cnt = (x) => x.reduce((m, s) => ((m[s] = (m[s] || 0) + 1), m), {});
const A = cnt(a), B = cnt(b);
for (const k of new Set([...a, ...b])) if ((A[k] || 0) !== (B[k] || 0)) console.log(`${A[k] || 0} -> ${B[k] || 0}  ${k}`);
console.log('totals', a.length, '->', b.length);
