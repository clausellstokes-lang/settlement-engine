// PG: summarise a measure-<pool>.json. node an.mjs <file>
import { readFileSync } from 'node:fs';
const M = JSON.parse(readFileSync(process.argv[2], 'utf8'));
const inc = (o, k, n = 1) => { o[k] = (o[k] || 0) + n; };
console.log(`POOL ${M.pool} n=${M.n}`);
// (1) Foundations rows: owner's public read (P0) vs the page, per marker; rows reading a re-derived severity
for (const mk of ['default', 'allShown', 'widest']) {
  const lost = {}; const changed = {}; const gained = {}; const sevRead = {}; const sevReadWrong = {}; const ex = {};
  for (const t of M.towns) {
    const m = t.markers[mk]; const o = t.ownerRows; const p = m.rows;
    for (const [l, b] of Object.entries(o)) {
      if (!(l in p)) inc(lost, l); else if (p[l] !== b) { inc(changed, l); ex[l] ??= `${t.seed}: ${b} => ${p[l]}`; }
    }
    for (const l of Object.keys(p)) if (!(l in o)) inc(gained, l);
    for (const l of m.sysOfRederived) if (l in o) { inc(sevRead, l); if (p[l] !== undefined && p[l] !== o[l]) inc(sevReadWrong, l); }
  }
  console.log(`\n[${mk}] rows LOST ${JSON.stringify(lost)}\n  CHANGED ${JSON.stringify(changed)}\n  GAINED ${JSON.stringify(gained)}`);
  console.log(`  rows reading a re-derived severity (owner prints the row): ${JSON.stringify(sevRead)}\n  of them printed with a band != owner: ${JSON.stringify(sevReadWrong)}`);
  console.log(`  examples of CHANGED: ${JSON.stringify(ex)}`);
}
// owner's own record vs owner's public read (sanity: the owner's rows)
let ownDiff = 0; for (const t of M.towns) if (JSON.stringify(t.ownRecRows) !== JSON.stringify(t.ownerRows)) ownDiff++;
console.log(`\nowner record rows != owner public rows on ${ownDiff} towns`);
// (2)(a) presence at every marker
for (const mk of ['default', 'allShown', 'widest']) {
  const absent = {}; const cases = {}; const ex = {};
  for (const t of M.towns) for (const k of t.markers[mk].keys) {
    if (!k.ownerHas || !k.parentServed) continue;
    inc(cases, k.key);
    if (!k.present) { inc(absent, k.key); ex[k.key] ??= t.seed; }
  }
  console.log(`\n[${mk}] PRESENCE (owner holds, parent served): cases ${JSON.stringify(cases)}\n  ABSENT ${JSON.stringify(absent)} ex ${JSON.stringify(ex)}`);
}
// (2)(c) present is not right, at allShown: re-derived (absent served, present on page) vs the owner's stored value
for (const mk of ['allShown', 'default', 'widest']) {
  const cmp = {}; const diff = {}; const ex = {};
  for (const t of M.towns) for (const k of t.markers[mk].keys) {
    if (!k.ownerHas || !k.present || k.servedPre) continue;
    inc(cmp, k.key);
    if (!k.equal) { inc(diff, k.key); ex[k.key] ??= `${t.seed}: owner ${JSON.stringify(k.owner).slice(0, 160)} page ${JSON.stringify(k.page).slice(0, 160)}`; }
  }
  console.log(`\n[${mk}] EQUALITY of re-derived keys: compared ${JSON.stringify(cmp)}\n  DIFFER ${JSON.stringify(diff)}`);
  for (const [k, e] of Object.entries(ex)) console.log(`   ${k}: ${e}`);
}
