// PROSE-1, the chair's bar (17:00 UTC): per pool and size, reach = stored places / places of the size,
// top = places printing the commonest line / places of the size; need = ceil(reach / 0.15) eligible lines;
// new lines = max over sizes of (need - median eligible), floored at 0. Ranked by the worst size's top share.
import { readFileSync } from 'node:fs';
const [, , file, outN = '40'] = process.argv;
const PER = 50; const by = new Map();
for (const line of readFileSync(file, 'utf8').split('\n')) {
  if (!line) continue; const r = JSON.parse(line); if (!r.stored) continue;
  const k = `${r.blockId} :: ${r.poolKey}`;
  if (!by.has(k)) by.set(k, new Map()); const s = by.get(k);
  if (!s.has(r.size)) s.set(r.size, new Map()); const p = s.get(r.size);
  if (!p.has(r.seed)) p.set(r.seed, { vids: new Set(), elig: 0 });
  const e = p.get(r.seed); e.vids.add(r.chosenVid); e.elig = Math.max(e.elig, r.eligibleVids.length);
}
const rows = [];
for (const [k, sizes] of by) {
  let worst = 0, add = 0; const cells = [];
  for (const [size, p] of sizes) {
    const c = new Map(); const el = [];
    for (const { vids, elig } of p.values()) { el.push(elig); for (const v of vids) c.set(v, (c.get(v) || 0) + 1); }
    el.sort((a, b) => a - b); const med = el[el.length >> 1];
    const reach = p.size / PER; const top = Math.max(...c.values()) / PER; const need = Math.ceil(reach / 0.15 - 1e-9);
    worst = Math.max(worst, top); if (top > 0.15) add = Math.max(add, need - med);
    cells.push(`${size.slice(0, 4)} r${Math.round(100 * reach)} e${med} top${Math.round(100 * top)} need${need}`);
  }
  rows.push({ k, worst, add: Math.max(0, add), cells });
}
rows.sort((a, b) => b.worst - a.worst);
console.log('| # | worst top (of all places of a size) | new lines | pool | by size (reach %, median eligible, top %, need) |\n|---|---|---|---|---|');
rows.slice(0, +outN).forEach((r, i) => console.log(`| ${i + 1} | ${Math.round(100 * r.worst)}% | ${r.add} | ${r.k} | ${r.cells.join(' · ')} |`));
const over = rows.filter((r) => r.worst > 0.15);
console.log(`\nPools over the bar at some size: ${over.length} of ${rows.length}; new lines to bring all of them to need: ${over.reduce((a, r) => a + r.add, 0)}; head ${outN}: ${rows.slice(0, +outN).reduce((a, r) => a + r.add, 0)}`);
