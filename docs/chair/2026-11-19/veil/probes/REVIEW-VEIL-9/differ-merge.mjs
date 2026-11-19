// merge the differ's shards; a path is IN THE CLASS on a veil where it differs A/B in >= 2 towns and A/C in at most a
// third as many; RE-ROLL where A/C differs at least half as often as A/B. Prints by veil kind, worst first.
import { readFileSync } from 'node:fs';
const files = process.argv.slice(2); const VK = process.env.VK || 'default';
const towns = []; const rows = {};
for (const f of files) { const x = JSON.parse(readFileSync(f, 'utf8')); towns.push(...x.towns);
  for (const r of x.rows) { const a = rows[r.path] = rows[r.path] || { B: {}, C: {}, ex: {} };
    for (const [v, n] of Object.entries(r.B)) a.B[v] = (a.B[v] || 0) + n; for (const [v, n] of Object.entries(r.C)) a.C[v] = (a.C[v] || 0) + n;
    for (const [k, e] of Object.entries(r.ex)) if (!a.ex[k]) a.ex[k] = e; } }
const withH = towns.filter((t) => Array.isArray(t.hideable)); const threw = towns.filter((t) => t.threw || t.veilThrew);
console.log(`towns ${towns.length}; with a hideable house ${withH.length}; B kept a hideable house ${withH.filter((t) => t.bHasHideable).length}; threw ${threw.length} ${JSON.stringify(threw.slice(0, 2))}`);
for (const vk of VK.split(',')) {
  const list = Object.entries(rows).map(([p, a]) => ({ p, b: a.B[vk] || 0, c: a.C[vk] || 0, ex: a.ex[`B ${vk}`] })).filter((r) => r.b >= 2);
  const cls = list.filter((r) => r.c * 3 <= r.b).sort((x, y) => (y.b - y.c) - (x.b - x.c)); const reroll = list.filter((r) => r.c * 2 >= r.b);
  console.log(`\n== veil ${vk}: paths differing A/B in >= 2 towns ${list.length}; IN THE CLASS ${cls.length}; re-roll ${reroll.length}; between ${list.length - cls.length - reroll.length}`);
  for (const r of cls) console.log(`B ${r.b} | C ${r.c} | ${r.p}\n      ${String(r.ex).slice(0, 330)}`);
}
