// PS-r2 probe 2: count intermediate nodes NEVER read by PS §4.1's rule "N = path[i+1] for the current rounded index i".
const M = process.argv[2];
const { buildSpatialDigest } = await import(`${M}/src/domain/spatial/index.js`);
const { planMarch, armyRecordOf, stepArmyPosition } = await import(`${M}/src/domain/spatial/armyTransit.js`);
const F = await import(`${M}/tests/fixtures/spatialPackFixtures.js`);
function scan(name, input) {
  const digest = buildSpatialDigest(input);
  const ids = (digest.settlements || input.placements || []).map((s) => String(s.id ?? s));
  let marches = 0, withMiss = 0, missed = 0; const ex = [];
  for (const o of ids) for (const d of ids) {
    if (o === d) continue;
    const plan = planMarch(digest, {}, o, d, 0.5, null, 0, null); if (!plan) continue; marches++;
    const p = plan.path; const read = new Set();
    let rec = armyRecordOf({ armyId: o, originId: o, destId: d, path: p, departTick: plan.departTick, arrivalTick: plan.arrivalTick });
    for (let t = 0; t <= plan.arrivalTick; t++) { rec = stepArmyPosition(rec, t); const i = Math.min(p.length - 1, Math.round(rec.position01 * (p.length - 1))); if (i + 1 < p.length) read.add(i + 1); }
    const miss = []; for (let k = 1; k < p.length - 1; k++) if (!read.has(k)) miss.push(k);
    if (miss.length) { withMiss++; missed += miss.length; if (ex.length < 2) ex.push({ o, d, hops: p.length - 1, weeks: plan.marchWeeks, unreadIdx: miss }); }
  }
  return { name, marches, marchesWithUnreadIntermediate: withMiss, unreadIntermediateNodes: missed, ex };
}
const grid = F.makeGridPack({ cols: 24, rows: 18 });
const ports = F.makeGridPack({ cols: 24, rows: 18 });
const coast = F.makePortCoastPack(8);
console.log(JSON.stringify([
  scan('grid-24x18-12', { pack: grid, placements: F.placeSettlements(grid, 12) }),
  scan('ports-24x18', { pack: ports, placements: F.placePortSettlements(ports, { nCoastal: 3, nRiver: 2, nInland: 3 }), seaLanes: true, seasonalRoads: true }),
  scan('portCoast-8', { ...coast, seaLanes: true, seasonalRoads: true }),
], null, 1));
