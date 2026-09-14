// One-off dock probe: merge the FIVE new modifier rate rows into the committed rate half and
// prove no other rate section moves. TASTE car M-4. Writes only rate-merged.json.
const fs = require('fs');
const SC = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/4e3d2f70-f45f-4e14-b571-514c339cfa17/scratchpad/kit';
const D = `${SC}/laneTASTE`;
const committed = JSON.parse(fs.readFileSync(`${D}/docs/content/wiring-census.json`, 'utf8')).rate;
const fresh = JSON.parse(fs.readFileSync(`${SC}/taste/m3/rate-768.json`, 'utf8'));
const have = new Set(committed.rows.map((r) => `${r.block} ${r.pool}`));
const added = fresh.rows.filter((r) => !have.has(`${r.block} ${r.pool}`));
if (added.length !== 5) throw new Error(`expected 5 new rate rows, got ${added.length}`);
const rows = [...committed.rows, ...added].sort((a, b) => b.towns - a.towns || (a.block < b.block ? -1 : 1));
const uncommon = rows.filter((r) => r.rateBp < 1000).length;
const merged = { ...committed, rows, departureReport: { lineBp: 1000, uncommon, common: rows.length - uncommon } };
for (const k of Object.keys(committed)) {
  if (k === 'rows' || k === 'departureReport') continue;
  if (JSON.stringify(committed[k]) !== JSON.stringify(merged[k])) throw new Error(`section moved: ${k}`);
}
fs.writeFileSync(`${SC}/taste/m3/rate-merged.json`, `${JSON.stringify(merged, null, 2)}\n`);
console.log(`MERGED · rate rows ${committed.rows.length} -> ${rows.length}`);
for (const r of added) console.log(`  + ${r.block} :: ${r.pool}  towns ${r.towns} n ${r.n} rateBp ${r.rateBp} [${r.loBp},${r.hiBp}]`);
console.log(`departureReport ${JSON.stringify(committed.departureReport)} -> ${JSON.stringify(merged.departureReport)}`);
console.log('every other rate section byte-identical: true');
