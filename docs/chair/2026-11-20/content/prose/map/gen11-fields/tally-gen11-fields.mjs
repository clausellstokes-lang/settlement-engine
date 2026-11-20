// MEASURE-GEN11-FIELDS's tally. usage: node tally-gen11-fields.mjs <dir holding rows.<size>.jsonl>
// Prints reconciliation lines and one row per (check · word · field path): places, findings, one masked example.
import { readFileSync, readdirSync } from 'node:fs';
const dir = process.argv[2];
const rows = readdirSync(dir).filter((f) => /^rows\.\w+\.jsonl$/.test(f))
  .flatMap((f) => readFileSync(`${dir}/${f}`, 'utf8').trim().split('\n').map((l) => JSON.parse(l)));
const pool = rows.filter((r) => r.poolKey === 'criticalIssueCount: critical contradictions on the record');
const nr = rows.filter((r) => r.status === 'needs_review');
console.log(`places ${rows.length} | in pool ${pool.length} | needs_review ${nr.length} | count>0 ${rows.filter((r) => r.count > 0).length}`
  + ` | needs_review & count 0 ${nr.filter((r) => !(r.count > 0)).length}`);
const receiptTotal = nr.reduce((n, r) => n + r.receiptFindings.length, 0);
const foundTotal = nr.reduce((n, r) => n + r.found.length, 0);
console.log(`receipt findings ${receiptTotal} | attributed ${foundTotal} | unnamed ${nr.reduce((n, r) => n + r.unnamed, 0)}`
  + ` | walkMatches ${nr.filter((r) => r.walkMatches).length}/${nr.length} | countsMatch ${nr.filter((r) => r.countsMatch).length}`
  + ` | detailsMatch ${nr.filter((r) => r.detailsMatch).length}`);
const byCheck = {};
for (const r of nr) for (const f of r.found) byCheck[f.check] = (byCheck[f.check] || 0) + 1;
console.log('by check', JSON.stringify(byCheck));
const groups = new Map();
for (const r of nr) for (const f of r.found) {
  const k = `${f.check}\t${f.word}\t${f.field}`;
  const g = groups.get(k) || { places: new Set(), findings: 0, example: f.example, seed: r.seed };
  g.places.add(r.seed); g.findings += 1; groups.set(k, g);
}
const fieldPlaces = new Map();
for (const r of nr) for (const f of r.found) { const s = fieldPlaces.get(f.field) || new Set(); s.add(r.seed); fieldPlaces.set(f.field, s); }
for (const [k, g] of [...groups].sort((a, b) => b[1].places.size - a[1].places.size || b[1].findings - a[1].findings)) {
  console.log(`ROW\t${k}\t${g.places.size}\t${g.findings}\t${g.seed}\t${g.example.replace(/\s+/g, ' ')}`);
}
for (const [f, s] of [...fieldPlaces].sort((a, b) => b[1].size - a[1].size)) console.log(`FIELD\t${f}\t${s.size}`);
