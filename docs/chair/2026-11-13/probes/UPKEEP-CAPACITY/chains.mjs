// UPKEEP-CAPACITY: each part's LADDER, read from the catalogue's one home (institutionLadders.js :: UPGRADE_CHAINS,
// the family pairs unioned with the authored cross-family pairs), restricted to the names that open the part.
// A name's rung = its depth on that ladder (1 = no lesser name opens the part); `of` = the ladder's top depth.
// Exported for corpus.mjs; run alone it prints each part's ladders.  node chains.mjs <tree-root> <census.json>
import { readFileSync } from 'node:fs';
export async function partLadders(root, census) {
  const { UPGRADE_CHAINS } = await import(`${root}/src/data/institutionLadders.js`);
  const out = {};
  for (const [part, rows] of Object.entries(census.parts)) {
    const names = new Set(rows.map((r) => r.name));
    const edges = UPGRADE_CHAINS.filter(([a, b]) => names.has(a) && names.has(b));
    const depth = (n, seen = new Set()) => { if (seen.has(n)) return 1; seen.add(n); const ls = edges.filter(([, b]) => b === n).map(([a]) => a); return ls.length ? 1 + Math.max(...ls.map((l) => depth(l, new Set(seen)))) : 1; };
    const comp = new Map(); // component id by union-find over edges
    const find = (x) => { while (comp.get(x) !== x) x = comp.get(x); return x; };
    for (const n of names) comp.set(n, n);
    for (const [a, b] of edges) comp.set(find(a), find(b));
    const top = {}; for (const n of names) { const c = find(n); top[c] = Math.max(top[c] || 0, depth(n)); }
    out[part] = Object.fromEntries([...names].map((n) => { const r = rows.find((x) => x.name === n); return [n.toLowerCase(), { name: n, rung: depth(n), of: top[find(n)], ladder: find(n), tiers: r.tiers, count: r.count }]; }));
  }
  return out;
}
if (process.argv[1] && process.argv[1].endsWith('chains.mjs')) {
  const [root, cj] = process.argv.slice(2);
  const L = await partLadders(root, JSON.parse(readFileSync(cj, 'utf8')));
  for (const [p, m] of Object.entries(L)) {
    console.log(`## ${p}`);
    const byL = {}; for (const v of Object.values(m)) (byL[v.ladder] ||= []).push(v);
    for (const vs of Object.values(byL)) console.log('  ' + vs.sort((a, b) => a.rung - b.rung).map((v) => `${v.name} [${v.rung}/${v.of}; ${v.tiers.join(',')}]`).join(' -> '));
  }
}
