// AGREE-FOLLOW-UP probe 2 — compare two siteScan outputs: the aggregate movement (checked
// against siteCoherenceRatchet's frozen baseline for the base side) and every town whose
// row changed, with its old and new key, exports, token lines and resource roster delta.
// usage: node siteDiff.mjs <base.json> <tip.json> <baseline.json> <out.json>
import { readFileSync, writeFileSync } from 'node:fs';
const [b, t, bl, out] = process.argv.slice(2).map((p, i) => (i < 3 ? JSON.parse(readFileSync(p, 'utf8')) : p));
const agg = (rows) => rows.reduce((m, r) => ((m[r.key] = (m[r.key] || 0) + 1), m), {});
const A = agg(b.rows), B = agg(t.rows);
const same = (x, y) => JSON.stringify(Object.entries(x).sort()) === JSON.stringify(Object.entries(y).sort());
console.log('base aggregate equals frozen baseline rows:', same(A, bl.rows));
console.log('mismatch kind vs production, base/tip:', b.rows.filter((r) => r.kind !== r.prodKind).length, t.rows.filter((r) => r.kind !== r.prodKind).length);
const keys = [...new Set([...Object.keys(A), ...Object.keys(B)])].sort();
const moved = keys.filter((k) => (A[k] || 0) !== (B[k] || 0)).map((k) => `${k}: ${A[k] || 0} -> ${B[k] || 0}`);
console.log(`moved rows ${moved.length}:\n  ` + moved.join('\n  '));
const changed = [];
for (let i = 0; i < b.rows.length; i++) {
  const x = b.rows[i], y = t.rows[i];
  if (x.id !== y.id) throw new Error('row identity drift at ' + i);
  if (x.key === y.key) continue;
  changed.push({ idx: i, id: x.id, oldKey: x.key, newKey: y.key, oldExports: x.exports, newExports: y.exports,
    newTokenLines: y.tokenLines, oldTokenLines: x.tokenLines,
    resGone: x.resources.filter((r) => !y.resources.includes(r)), resNew: y.resources.filter((r) => !x.resources.includes(r)),
    newResources: y.resources, newChains: y.chains, newInstitutions: y.institutions, oldResources: x.resources });
}
console.log(`changed towns ${changed.length}; same key but other fields not compared`);
for (const c of changed) console.log(`  #${c.idx} ${c.id}: ${c.oldKey} -> ${c.newKey} | res -${c.resGone.join('/')} +${c.resNew.join('/')} | token lines ${JSON.stringify(c.newTokenLines)}`);
writeFileSync(out, JSON.stringify(changed, null, 1));
