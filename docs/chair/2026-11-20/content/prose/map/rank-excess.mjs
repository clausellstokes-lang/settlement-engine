// PROSE-1: rank pools by EXCESS over the 15% bar — per pool and size, the places drawing a vid beyond
// 15% of the places drawing the pool, summed over vids and sizes (one place counted once per pool).
import { readFileSync } from 'node:fs';
const [, , file, outN = '45'] = process.argv;
const by = new Map(); // key -> size -> seed -> Set(vid), eligMax
for (const line of readFileSync(file, 'utf8').split('\n')) {
  if (!line) continue; const r = JSON.parse(line);
  const k = `${r.blockId} :: ${r.poolKey}`;
  if (!by.has(k)) by.set(k, { len: r.poolLength, sizes: new Map() });
  const s = by.get(k).sizes; if (!s.has(r.size)) s.set(r.size, new Map());
  const p = s.get(r.size); if (!p.has(r.seed)) p.set(r.seed, { vids: new Set(), elig: 0 });
  const e = p.get(r.seed); e.vids.add(r.chosenVid); e.elig = Math.max(e.elig, r.eligibleVids.length);
}
const rows = [];
for (const [k, { len, sizes }] of by) {
  let excess = 0, places = 0; const cells = [];
  for (const [size, p] of sizes) {
    const n = p.size; places += n; const c = new Map(); const el = [];
    for (const { vids, elig } of p.values()) { el.push(elig); for (const v of vids) c.set(v, (c.get(v) || 0) + 1); }
    const top = Math.max(...c.values()); let ex = 0; for (const v of c.values()) ex += Math.max(0, v - 0.15 * n);
    excess += ex; el.sort((a, b) => a - b);
    cells.push(`${size.slice(0, 4)} ${n}p e${el[el.length >> 1]} top${Math.round(100 * top / n)}%`);
  }
  rows.push({ k, len, places, excess: Math.round(excess), cells });
}
rows.sort((a, b) => b.excess - a.excess);
console.log('| # | excess | places | pool | len | by size (places, median eligible, top share) |\n|---|---|---|---|---|---|');
rows.slice(0, +outN).forEach((r, i) => console.log(`| ${i + 1} | ${r.excess} | ${r.places} | ${r.k} | ${r.len} | ${r.cells.join(' · ')} |`));
console.log(`\nTOTAL excess over all ${rows.length} pools: ${rows.reduce((a, r) => a + r.excess, 0)}; top ${outN}: ${rows.slice(0, +outN).reduce((a, r) => a + r.excess, 0)}`);
