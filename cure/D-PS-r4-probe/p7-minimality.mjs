// D-PS-r4 probe — minor 1 (P7) as RULED (RULINGS-ROUND4 B PS: "P7 restated as a MINIMALITY pin").
// Uses the LANDED reads of master 81f1cd963 (read-only): distanceRead.js :: seasonalPathCost,
// spatialCost.js :: buildSeasonalOverlay, embattlement.js :: scoreRoute. The landed
// `shortestPath` is module-private: replayed here line for line (strict-less relax, the
// lower-codepoint predecessor on a tie, the lowest (cost, codepoint) frontier pop).
// Run: node p7-minimality.mjs <master-worktree>
const M = process.argv[2];
const { seasonalPathCost } = await import(`${M}/src/domain/spatial/distanceRead.js`);
const { buildSeasonalOverlay } = await import(`${M}/src/domain/spatial/spatialCost.js`);
const { scoreRoute } = await import(`${M}/src/domain/spatial/embattlement.js`);
const pk = (a, b) => (a < b ? `${a}|${b}` : `${b}|${a}`);
function shortestPath(adj, from, to, blocked) {
  if (from === to) return { path: [from], cost: 0 };
  const dist = new Map([[from, 0]]); const prev = new Map(); const done = new Set();
  for (;;) {
    let u = null; let best = Infinity;
    for (const [n, d] of dist) { if (done.has(n)) continue; if (d < best || (d === best && (u == null || n < u))) { best = d; u = n; } }
    if (u == null || u === to) break;
    done.add(u);
    for (const nb of [...(adj.get(u)?.keys() ?? [])].sort()) {
      if (done.has(nb) || blocked.has(pk(u, nb))) continue;
      const cand = best + adj.get(u).get(nb); const known = dist.has(nb) ? dist.get(nb) : Infinity;
      if (cand < known || (cand === known && u < (prev.get(nb) ?? '￿'))) { dist.set(nb, cand); prev.set(nb, u); }
    }
  }
  if (!dist.has(to)) return null;
  const path = [to]; let cur = to;
  while (cur !== from) { const p = prev.get(cur); if (p == null) return null; path.push(p); cur = p; }
  return { path: path.reverse(), cost: dist.get(to) };
}
// O→B→D is the direct road (B refuses). Around B: O→C→D over a mountain pass (base 110,
// the base-cheapest detour) and O→E→D on grass (base 130).
const receipts = {
  [pk('O', 'B')]: { cost: 50, byTerrain: { grassland: 50 } }, [pk('B', 'D')]: { cost: 50, byTerrain: { grassland: 50 } },
  [pk('O', 'C')]: { cost: 55, byTerrain: { mountain: 55 } }, [pk('C', 'D')]: { cost: 55, byTerrain: { mountain: 55 } },
  [pk('O', 'E')]: { cost: 65, byTerrain: { grassland: 65 } }, [pk('E', 'D')]: { cost: 65, byTerrain: { grassland: 65 } },
};
const digest = { reserved: { seasonalOverlay: buildSeasonalOverlay() }, routeReceipts: receipts };
const adj = new Map();
for (const [k, r] of Object.entries(receipts)) { const [a, b] = k.split('|'); for (const [x, y] of [[a, b], [b, a]]) { if (!adj.has(x)) adj.set(x, new Map()); adj.get(x).set(y, r.cost); } }
const avoid = new Set(['B']);
const blocked = new Set([...Object.keys(receipts)].filter(k => k.split('|').some(n => avoid.has(n))));
// ROUND-3 routeAvoiding: ONE shortest path by BASE cost over the avoided graph.
const r3 = shortestPath(adj, 'O', 'D', blocked);
// ROUND-4 cure: the avoided graph's candidates (its shortest path + one single-edge detour per edge,
// the landed candidateRoutes construction), re-scored as the landed chooseRoute does.
const prim = shortestPath(adj, 'O', 'D', blocked); const cands = [prim]; const seen = new Set([prim.path.join('>')]);
for (let i = 0; i + 1 < prim.path.length; i++) { const alt = shortestPath(adj, 'O', 'D', new Set([...blocked, pk(prim.path[i], prim.path[i + 1])])); if (alt && !seen.has(alt.path.join('>'))) { cands.push(alt); seen.add(alt.path.join('>')); } }
const out = [];
for (const season of ['summer', 'winter']) {
  const scored = cands.map(c => ({ path: c.path.join('>'), base: c.cost, seasonal: seasonalPathCost(digest, c.path, c.cost, season), eff: scoreRoute(c.path, {}, seasonalPathCost(digest, c.path, c.cost, season), 1, 50).effectiveCost }));
  const pick = scored.reduce((b, s) => (!b || s.eff < b.eff || (s.eff === b.eff && s.path < b.path) ? s : b), null);
  const r3s = scored.find(s => s.path === r3.path.join('>'));
  const minimal = scored.every(s => pick.seasonal <= s.seasonal);
  const direct = seasonalPathCost(digest, ['O', 'B', 'D'], 100, season);
  out.push(`${season}: candidates ${scored.map(s => `${s.path} base ${s.base} seasonal ${s.seasonal}`).join(' ; ')}`);
  out.push(`  round-3 routeAvoiding (base-cheapest) = ${r3s.path} seasonal ${r3s.seasonal}; minimal in season: ${scored.every(s => r3s.seasonal <= s.seasonal)}`);
  out.push(`  round-4 pick (chooseRoute's re-score over the avoided candidates) = ${pick.path} seasonal ${pick.seasonal}; MINIMALITY pin holds: ${minimal}`);
  out.push(`  the struck round-3 pin "never less than the direct route's march AT THE SAME SEASON" (direct O>B>D seasonal ${direct}): ${pick.seasonal >= direct}`);
}
console.log(out.join('\n'));
