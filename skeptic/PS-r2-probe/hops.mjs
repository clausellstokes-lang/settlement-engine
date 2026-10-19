// PS-r2 probe: does an army path (planMarch on a NEW-canon digest: seasonal roads + sea lanes)
// (1) traverse sea edges with no land gate between consecutive nodes, and
// (2) advance its rounded node index by >= 2 in one tick (a skipped intermediate node)?
// Read-only imports from the detached master worktree; prints a summary.
const M = process.argv[2];
const { buildSpatialDigest } = await import(`${M}/src/domain/spatial/index.js`);
const { planMarch, armyRecordOf, stepArmyPosition } = await import(`${M}/src/domain/spatial/armyTransit.js`);
const { gateAdjacency, isPort } = await import(`${M}/src/domain/spatial/distanceRead.js`);
const { seaEdgesOfPath } = await import(`${M}/src/domain/spatial/navalLayer.js`);
const F = await import(`${M}/tests/fixtures/spatialPackFixtures.js`);

function scan(name, input, readiness, season) {
  const digest = buildSpatialDigest(input);
  const ids = (digest.settlements || input.placements || []).map((s) => String(s.id ?? s)).filter(Boolean);
  const adj = gateAdjacency(digest);
  let pairs = 0, seaPaths = 0, noGateHops = 0, skipMarches = 0, skippedNodes = 0, intermediatePaths = 0;
  const examples = [];
  for (const o of ids) for (const d of ids) {
    if (o === d) continue;
    const plan = planMarch(digest, {}, o, d, readiness, null, 0, season);
    if (!plan) continue;
    pairs++;
    const path = plan.path;
    if (path.length > 2) intermediatePaths++;
    const sea = seaEdgesOfPath(digest, path);
    if (sea.length) seaPaths++;
    for (let i = 0; i + 1 < path.length; i++) if (!adj.get(path[i])?.has(path[i + 1])) noGateHops++;
    // walk the landed position law tick by tick; record every index skipped
    let rec = armyRecordOf({ armyId: o, originId: o, destId: d, path, departTick: plan.departTick, arrivalTick: plan.arrivalTick });
    let prevIdx = 0; const skipped = [];
    for (let t = 0; t <= plan.arrivalTick; t++) {
      rec = stepArmyPosition(rec, t);
      const idx = Math.min(path.length - 1, Math.round(rec.position01 * (path.length - 1)));
      for (let k = prevIdx + 1; k < idx; k++) if (k > 0 && k < path.length - 1) skipped.push(k);
      prevIdx = idx;
    }
    if (skipped.length) { skipMarches++; skippedNodes += skipped.length; if (examples.length < 3) examples.push({ o, d, hops: path.length - 1, marchWeeks: plan.marchWeeks, sea: sea.length, skipped }); }
  }
  return { name, readiness, season, settlements: ids.length, pairs, intermediatePaths, seaPaths, noGateHops, skipMarches, skippedNodes, examples };
}

const out = [];
const grid = F.makeGridPack({ cols: 24, rows: 18 });
out.push(scan('grid-24x18-12', { pack: grid, placements: F.placeSettlements(grid, 12) }, 0.5, null));
out.push(scan('grid-24x18-12', { pack: grid, placements: F.placeSettlements(grid, 12) }, 0.9, null));
const ports = F.makeGridPack({ cols: 24, rows: 18 });
const portIn = { pack: ports, placements: F.placePortSettlements(ports, { nCoastal: 3, nRiver: 2, nInland: 3 }), seaLanes: true, seasonalRoads: true };
out.push(scan('ports-24x18 (sea+seasons)', portIn, 0.5, null));
out.push(scan('ports-24x18 (sea+seasons)', portIn, 0.5, 'winter'));
const coast = F.makePortCoastPack(8);
out.push(scan('portCoast-8 (sea)', { ...coast, seaLanes: true, seasonalRoads: true }, 0.5, null));
console.log(JSON.stringify(out, null, 1));
