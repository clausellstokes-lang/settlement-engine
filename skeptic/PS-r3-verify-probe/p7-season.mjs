// V-PS-r3 probe — minor 1 (P7): can a node-avoiding detour be CHEAPER than the direct
// route's march AT THE SAME SEASON? Uses the LANDED seasonal reads from master 81f1cd963
// (read-only): `pathSeasonMultiplier`, `seasonalPathCost` (distanceRead.js) and the
// landed law `buildSeasonalOverlay` (spatialCost.js). `pathCost(digest, o, d, season)`
// (what `hopWeeks` and so `planMarch` price) is `round(base × pathSeasonMultiplier(
// routePath, season))` over the base-CHEAPEST candidate route — replayed here on that path.
// Run: node p7-season.mjs <master-worktree>
const M = process.argv[2];
const { pathSeasonMultiplier, seasonalPathCost } = await import(`${M}/src/domain/spatial/distanceRead.js`);
const { buildSeasonalOverlay } = await import(`${M}/src/domain/spatial/spatialCost.js`);
const pk = (a, b) => (a < b ? `${a}|${b}` : `${b}|${a}`);
// O → B → D over a mountain pass (B is the refusing holder); O → C → D around it on grass.
const digest = {
  reserved: { seasonalOverlay: buildSeasonalOverlay() },
  routeReceipts: {
    [pk('O', 'B')]: { cost: 50, byTerrain: { mountain: 50 } },
    [pk('B', 'D')]: { cost: 50, byTerrain: { mountain: 50 } },
    [pk('O', 'C')]: { cost: 60, byTerrain: { grassland: 60 } },
    [pk('C', 'D')]: { cost: 60, byTerrain: { grassland: 60 } },
  },
};
const direct = ['O', 'B', 'D'], detour = ['O', 'C', 'D'];
const out = [];
for (const season of ['summer', 'winter']) {
  const d = seasonalPathCost(digest, direct, 100, season);
  const r = seasonalPathCost(digest, detour, 120, season);
  out.push(`${season}: direct (base 100, mult ${pathSeasonMultiplier(digest, direct, season)}) = ${d}; detour avoiding B (base 120, mult ${pathSeasonMultiplier(digest, detour, season)}) = ${r}; detour < direct at the SAME season: ${r < d}`);
}
console.log(out.join('\n'));
