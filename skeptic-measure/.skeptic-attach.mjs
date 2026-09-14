import { readFileSync } from 'node:fs';
const j = JSON.parse(readFileSync('docs/content/wiring-census.json', 'utf8'));
const ac = j.attachCoverage;
console.log('attachCoverage type', Array.isArray(ac) ? 'array ' + ac.length : Object.keys(ac).length + ' keys');
const rows = Array.isArray(ac) ? ac : Object.entries(ac).map(([k, v]) => ({ block: k, ...v }));
console.log('sample', JSON.stringify(rows[0]));
const dark = rows.filter(r => (r.reachedBp ?? r.spinesReachedBp ?? 0) === 0);
console.log('blocks with a RESOLVED spine:', rows.length, '| dark (0 bp reached):', dark.length);
console.log('dark blocks:', dark.map(r => r.block).sort().join(' · '));
for (const b of ['DS-DEF-11', 'DS-DEF-2', 'DS-DEF-9', 'DS-ECO-9', 'DS-POW-3', 'DS-STR-1']) {
  const r = rows.find(x => x.block === b);
  console.log(b, r ? JSON.stringify(r) : 'ABSENT from attachCoverage');
}
console.log('grains block:', JSON.stringify(j.grains));
