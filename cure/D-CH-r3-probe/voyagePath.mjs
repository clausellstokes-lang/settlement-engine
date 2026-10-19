// D-CH-r3 probe (A.13, diagnostic): the route and the landed walker's visited nodes for one coast voyage.
const M = process.argv[2];
const { buildSpatialDigest } = await import(`${M}/src/domain/spatial/index.js`);
const { candidateRoutes, hopWeeks } = await import(`${M}/src/domain/spatial/distanceRead.js`);
const { classifyLegModes } = await import(`${M}/src/domain/roads/seaRoads.js`);
const { advanceWanderer } = await import(`${M}/src/domain/worldPulse/npcCirculationTransit.js`);
const F = await import(`${M}/tests/fixtures/spatialPackFixtures.js`);
const coast = F.makePortCoastPack(8);
const digest = buildSpatialDigest({ ...coast, seaLanes: true, seasonalRoads: true });
for (const [o, d] of [['p000', 'p004'], ['p000', 'p007']]) {
  const r = candidateRoutes(digest, o, d, 1)[0];
  const path = r.path.map(String);
  console.log(JSON.stringify({ o, d, path, modes: classifyLegModes(digest, path), cost: r.cost, weeks: hopWeeks(digest, o, d) }));
  let at = o; let leg = null; const visited = [];
  for (let t = 0; t < 60; t += 1) {
    const s = advanceWanderer({ digest, atSettlementId: at, leg, destId: d, tick: t });
    if (s.leg && !leg) visited.push(`t${t}:depart ${at}->${s.leg.toId} arr ${s.leg.arrivalTick}`);
    if (s.arrived) visited.push(`t${t}:arrive ${s.atSettlementId}`);
    at = s.atSettlementId; leg = s.leg;
    if (s.arrived && s.atSettlementId === d) break;
  }
  console.log(visited.join(' | '));
}
