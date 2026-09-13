// One-off dock probe: the bounded diff of the census door TASTE car M-4 took. Read-only.
const fs = require('fs');
const SC = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/4e3d2f70-f45f-4e14-b571-514c339cfa17/scratchpad/kit';
const D = `${SC}/laneTASTE`;
const before = JSON.parse(fs.readFileSync(`${SC}/taste/m3/census-before-m4.json`, 'utf8'));
const after = JSON.parse(fs.readFileSync(`${D}/docs/content/wiring-census.json`, 'utf8'));
const key = (r) => `${r.block} :: ${r.pool}`;
const b = new Map(before.rows.map((r) => [key(r), r]));
const a = new Map(after.rows.map((r) => [key(r), r]));
const moved = [];
for (const [k, v] of a) {
  const old = b.get(k);
  if (old && JSON.stringify(old) !== JSON.stringify(v)) moved.push(k);
}
console.log(`rows ${before.rows.length} -> ${after.rows.length} · ADDED ${[...a.keys()].filter((k) => !b.has(k)).length}`
  + ` · REMOVED ${[...b.keys()].filter((k) => !a.has(k)).length}`);
console.log(`rows that MOVED: ${moved.length}`);
for (const k of moved) {
  const o = b.get(k);
  const n = a.get(k);
  const fields = [...new Set([...Object.keys(o), ...Object.keys(n)])]
    .filter((f) => JSON.stringify(o[f]) !== JSON.stringify(n[f]));
  console.log(`  ${k}  ${fields.map((f) => `${f} ${JSON.stringify(o[f])} -> ${JSON.stringify(n[f])}`).join(' · ')}`);
}
const sections = [...new Set([...Object.keys(before), ...Object.keys(after)])]
  .filter((s) => JSON.stringify(before[s]) !== JSON.stringify(after[s]));
console.log(`sections moved: ${sections.join(' · ')}`);
for (const k of new Set([...Object.keys(before.totals), ...Object.keys(after.totals)])) {
  if (JSON.stringify(before.totals[k]) !== JSON.stringify(after.totals[k])) {
    console.log(`  totals.${k}: ${JSON.stringify(before.totals[k])} -> ${JSON.stringify(after.totals[k])}`);
  }
}
for (const k of Object.keys(before.rate)) {
  if (JSON.stringify(before.rate[k]) !== JSON.stringify(after.rate[k])) console.log(`  rate.${k} moved`);
}
