// D-CH-r3 probe (CH-V4): the posted operative's findings seeded at the EMPLOYER'S SEAT with the continuation
// guard pre-stamped (relayedTick = the seed tick) never leave the home court's ledger; the control (unstamped,
// the round-2b shape) relays. Also: a notable / score-0 seed's hop budget and TTL. Master read-only.
// Usage: node findingsHome.mjs <master worktree>
const M = process.argv[2];
const { advanceRumorLedgers, rumorEventKey, maxHopsFor, RUMOR_TTL_TICKS } = await import(`${M}/src/domain/spatial/rumorNetwork.js`);
const { buildSpatialDigest } = await import(`${M}/src/domain/spatial/index.js`);
const { makeGridPack, placeSettlements } = await import(`${M}/tests/fixtures/spatialPackFixtures.js`);
const ids = ['home', 'meet', 'third', 'post'];
const pack = makeGridPack({ cols: 24, rows: 18 });
const placements = placeSettlements(pack, ids.length).map((p, i) => ({ id: ids[i], cellId: p.cellId }));
const digest = buildSpatialDigest({ pack, placements });
const ch = (id, a, b) => ({ id, type: 'trade_route', from: a, to: b, status: 'confirmed' });
const graph = { channels: [ch('e1', 'home', 'meet'), ch('e2', 'meet', 'third'), ch('e3', 'third', 'post')] };

function run(stamped) {
  const eventRef = 'rendezvous:wnpc_x:10';
  const key = rumorEventKey(eventRef);
  const seed = { eventRef, eventTick: 10, carrier: 'trade', arrivalTick: 10, hopCount: 0,
    lineageIds: [eventRef, 't0:' + eventRef + '@home'], corroborationRoots: ['t0:' + eventRef + '@home'],
    provenance: { originId: 'home', relayIds: [] }, completeness01: 1, accuracy01: 1, framing: [],
    significance: 'notable', score: 0,
    content: { what: 'paragon_findings', whereId: 'post', scope: 'settlement', magnitude: 0, partyIds: ['post'],
      causeClass: null, deityName: null, visibility: 'mechanical', paragonId: 'wnpc_x' },
    relayedTick: stamped ? 10 : null };
  let ws = { simulationRules: { infoMode: 'perfect_delayed' }, spatialCanonVersion: 1, spatialDigest: digest,
    spatialLedgers: { rumorLedgers: { home: { [key]: seed } } } };
  const everHeld = new Set(); let homeExpiredAt = null;
  for (let t = 10; t <= 40; t += 1) {
    const r = advanceRumorLedgers({ worldState: ws, feedEntries: [], graph, tick: t });
    ws = { ...ws, spatialLedgers: { ...ws.spatialLedgers, rumorLedgers: r.next } };
    for (const sid of ids) if (ws.spatialLedgers.rumorLedgers?.[sid]?.[key]) everHeld.add(sid);
    if (homeExpiredAt == null && !ws.spatialLedgers.rumorLedgers?.home?.[key]) homeExpiredAt = t;
  }
  return { stamped, everHeld: [...everHeld].sort(), homeRecordGoneAtTick: homeExpiredAt };
}
console.log(JSON.stringify({ maxHopsForNotableScore0: maxHopsFor({ significance: 'notable', score: 0 }), ttlNotable: RUMOR_TTL_TICKS.notable }));
console.log(JSON.stringify(run(true)));
console.log(JSON.stringify(run(false)));
