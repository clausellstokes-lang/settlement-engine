// D-CH-r3 probe (A.13): a coast voyage planned port to port as ONE leg, against the landed hop-by-hop leg.
// Reads master read-only. Usage: node voyage.mjs <master worktree>
const M = process.argv[2];
const { buildSpatialDigest } = await import(`${M}/src/domain/spatial/index.js`);
const { candidateRoutes, hopWeeks } = await import(`${M}/src/domain/spatial/distanceRead.js`);
const { classifyLegModes } = await import(`${M}/src/domain/roads/seaRoads.js`);
const { openNamedPersonLeg, namedPersonLegPosition } = await import(`${M}/src/domain/worldPulse/namedPersonTransit.js`);
const { planWanderLeg, advanceWanderer } = await import(`${M}/src/domain/worldPulse/npcCirculationTransit.js`);
const F = await import(`${M}/tests/fixtures/spatialPackFixtures.js`);

const coast = F.makePortCoastPack(8);
const digest = buildSpatialDigest({ ...coast, seaLanes: true, seasonalRoads: true });
const ids = (digest.settlements || coast.placements || []).map((s) => String(s.id ?? s));

/** The voyage rule: from `from`, run the cheapest route forward over consecutive SEA hops; the leg ends at the
 *  first node where the traveller LANDS (the destination, or a node whose next hop leaves by land). */
function voyageEnd(from, dest) {
  const routes = candidateRoutes(digest, from, dest, 1);
  const path = routes.length ? routes[0].path.map(String) : [];
  if (path.length < 2) return null;
  const modes = classifyLegModes(digest, path);
  if (modes[0] !== 'sea') return { path, modes, landing: path[1], seaRun: 0 };
  let j = 1;
  while (j < path.length - 1 && modes[j] === 'sea') j += 1;
  return { path, modes, landing: path[j], seaRun: j };
}

const out = { ports: ids.length, rows: [] };
for (const season of [null, 'winter']) {
  for (const o of ids) for (const d of ids) {
    if (o === d) continue;
    const v = voyageEnd(o, d);
    if (!v || v.seaRun < 2) continue; // only voyages that pass at least one harbour at sea
    const oneLegWeeks = hopWeeks(digest, o, v.landing, season);
    let perHopSum = 0;
    for (let i = 0; i < v.seaRun; i += 1) perHopSum += hopWeeks(digest, v.path[i], v.path[i + 1], season) || 0;
    const leg = openNamedPersonLeg({ fromId: o, toId: v.landing, departTick: 0, nominalWeeks: oneLegWeeks });
    // positions over the voyage: never at a settlement until arrival
    let midSettlements = 0;
    for (let t = 1; t < leg.arrivalTick; t += 1) if (namedPersonLegPosition(leg, t).atSettlementId) midSettlements += 1;
    // the landed hop-by-hop walker for comparison: how many intermediate ARRIVALS does it make before the landing?
    let at = o; let wl = null; let arrivalsBefore = 0; let t = 0;
    while (t < 400) {
      const step = advanceWanderer({ digest, atSettlementId: at, leg: wl, destId: v.landing, tick: t });
      if (step.arrived) { if (step.atSettlementId !== v.landing) arrivalsBefore += 1; else break; }
      at = step.atSettlementId; wl = step.leg; t += 1;
    }
    out.rows.push({ season, from: o, to: d, landing: v.landing, harboursPassedAtSea: v.seaRun - 1,
      oneLegWeeks, perHopSum, legArrivalTick: leg.arrivalTick, midVoyageAtASettlement: midSettlements,
      hopByHopIntermediateArrivals: arrivalsBefore, hopByHopLandingTick: t });
  }
}
const n = out.rows.length;
const summary = {
  voyagesPassingAHarbour: n,
  oneLegNeverAtASettlementMidVoyage: out.rows.every((r) => r.midVoyageAtASettlement === 0),
  hopByHopArrivesAtLeastOnceBeforeLanding: out.rows.every((r) => r.hopByHopIntermediateArrivals >= 1),
  hopByHopIntermediateArrivalsTotal: out.rows.reduce((a, r) => a + r.hopByHopIntermediateArrivals, 0),
  harboursPassedAtSeaTotal: out.rows.reduce((a, r) => a + r.harboursPassedAtSea, 0),
  oneLegNeverSlowerThanHopByHop: out.rows.every((r) => r.legArrivalTick <= r.hopByHopLandingTick),
  oneLegAtLeastOneWeek: out.rows.every((r) => r.legArrivalTick >= 1),
};
console.log(JSON.stringify(summary));
console.log(JSON.stringify(out.rows.slice(0, 6)));
