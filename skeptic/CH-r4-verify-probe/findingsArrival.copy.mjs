// D-CH-r4 probe (CH-Wm2 · RULINGS-ROUND4 A.9): the posted operative's findings seed at the EMPLOYER'S SEAT, the
// continuation guard pre-stamped, with arrivalTick = tick + hopWeeks(meeting, seat) — the report travels home at
// the one news speed. Checks: never relayed (held by `home` alone); IN TRANSIT (arrivalTick > now) until it lands,
// so the read model (`arrivalTick <= now`, beliefMap.js :: reportsBySubject) cannot hear it early; the TTL counts
// from the arrival (in-transit records never age). Master read-only. Usage: node findingsArrival.mjs <master>
const M = process.argv[2];
const { advanceRumorLedgers, rumorEventKey, RUMOR_TTL_TICKS } = await import(`${M}/src/domain/spatial/rumorNetwork.js`);
const { buildSpatialDigest } = await import(`${M}/src/domain/spatial/index.js`);
const { hopWeeks } = await import(`${M}/src/domain/spatial/distanceRead.js`);
const { makeGridPack, placeSettlements } = await import(`${M}/tests/fixtures/spatialPackFixtures.js`);
const ids = ['home', 'meet', 'third', 'post'];
const pack = makeGridPack({ cols: 24, rows: 18 });
const placements = placeSettlements(pack, ids.length).map((p, i) => ({ id: ids[i], cellId: p.cellId }));
const digest = buildSpatialDigest({ pack, placements });
const ch = (id, a, b) => ({ id, type: 'trade_route', from: a, to: b, status: 'confirmed' });
const graph = { channels: [ch('e1', 'home', 'meet'), ch('e2', 'meet', 'third'), ch('e3', 'third', 'post')] };
const travel = Math.max(1, Math.ceil(Number(hopWeeks(digest, 'meet', 'home')) || 1));
function run(stamped, delay) {
  const eventRef = 'rendezvous:wnpc_x:10'; const key = rumorEventKey(eventRef); const T0 = 10;
  const seed = { eventRef, eventTick: T0, carrier: 'trade', arrivalTick: T0 + delay, hopCount: 0,
    lineageIds: [eventRef, 't0:' + eventRef + '@home'], corroborationRoots: ['t0:' + eventRef + '@home'],
    provenance: { originId: 'home', relayIds: [] }, completeness01: 1, accuracy01: 1, framing: [],
    significance: 'notable', score: 0,
    content: { what: 'paragon_findings', whereId: 'post', scope: 'settlement', magnitude: 0, partyIds: ['post'],
      causeClass: null, deityName: null, visibility: 'mechanical', paragonId: 'wnpc_x' },
    relayedTick: stamped ? T0 : null };
  let ws = { simulationRules: { infoMode: 'perfect_delayed' }, spatialCanonVersion: 1, spatialDigest: digest,
    spatialLedgers: { rumorLedgers: { home: { [key]: seed } } } };
  const everHeld = new Set(); let firstHeardAtHome = null; let goneAt = null;
  for (let t = T0; t <= T0 + 40; t += 1) {
    const r = advanceRumorLedgers({ worldState: ws, feedEntries: [], graph, tick: t });
    ws = { ...ws, spatialLedgers: { ...ws.spatialLedgers, rumorLedgers: r.next } };
    for (const sid of ids) if (ws.spatialLedgers.rumorLedgers?.[sid]?.[key]) everHeld.add(sid);
    const rec = ws.spatialLedgers.rumorLedgers?.home?.[key];
    if (rec && firstHeardAtHome == null && Number(rec.arrivalTick) <= t) firstHeardAtHome = t;
    if (goneAt == null && !rec) goneAt = t;
  }
  return { stamped, delay, everHeld: [...everHeld].sort(), firstHeardAtHome, goneAtTick: goneAt };
}
console.log(JSON.stringify({ hopWeeksMeetToHome: hopWeeks(digest, 'meet', 'home'), travelTicks: travel, ttlNotable: RUMOR_TTL_TICKS.notable }));
console.log(JSON.stringify(run(true, travel)));
console.log(JSON.stringify(run(true, 4)));
console.log(JSON.stringify(run(true, 0)));
console.log(JSON.stringify(run(false, travel)));
