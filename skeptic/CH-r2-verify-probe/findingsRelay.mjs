// CH-V4 probe: a hop-0 'paragon_findings' arrival record (CH §8's declared content, built as RN §3.4 says:
// the landed arrival record, relayedTick null) at the meeting town — does the landed relay carry it to a
// third court, with partyIds [post] intact (so reportsBySubject keys it as a report about the post there)?
// And does a second seed of the SAME leak eventRef at a town already holding it make a new arrival?
import { advanceRumorLedgers, rumorEventKey, maxHopsFor } from '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/a73343ed-904d-46d0-a0f5-2969909eb66e/scratchpad/master-81f1cd963/src/domain/spatial/rumorNetwork.js';
import { buildSpatialDigest } from '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/a73343ed-904d-46d0-a0f5-2969909eb66e/scratchpad/master-81f1cd963/src/domain/spatial/index.js';
import { makeGridPack, placeSettlements } from '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/a73343ed-904d-46d0-a0f5-2969909eb66e/scratchpad/master-81f1cd963/tests/fixtures/spatialPackFixtures.js';
const ids = ['meet', 'home', 'third', 'post'];
const pack = makeGridPack({ cols: 24, rows: 18 });
const placements = placeSettlements(pack, ids.length).map((p, i) => ({ id: ids[i], cellId: p.cellId }));
const digest = buildSpatialDigest({ pack, placements });
const ch = (id, a, b) => ({ id, type: 'trade_route', from: a, to: b, status: 'confirmed' });
const graph = { channels: [ch('e1', 'meet', 'home'), ch('e2', 'meet', 'third')] };
const eventRef = 'rendezvous:wnpc_x:10';
const key = rumorEventKey(eventRef);
const seed = { eventRef, eventTick: 10, carrier: 'trade', arrivalTick: 10, hopCount: 0,
  lineageIds: [eventRef, 't0:' + eventRef + '@meet'], corroborationRoots: ['t0:' + eventRef + '@meet'],
  provenance: { originId: 'meet', relayIds: [] }, completeness01: 1, accuracy01: 1, framing: [],
  significance: 'notable', score: 0,
  content: { what: 'paragon_findings', whereId: 'post', scope: 'settlement', magnitude: 0, partyIds: ['post'],
    causeClass: null, deityName: null, visibility: 'mechanical', paragonId: 'wnpc_x' }, relayedTick: null };
let ws = { simulationRules: { infoMode: 'perfect_delayed' }, spatialCanonVersion: 1, spatialDigest: digest,
  spatialLedgers: { rumorLedgers: { meet: { [key]: seed } } } };
console.log('maxHopsFor(notable seed, scope settlement) =', maxHopsFor(seed));
const firstSeen = {};
for (let t = 10; t <= 40; t += 1) {
  const r = advanceRumorLedgers({ worldState: ws, feedEntries: [], graph, tick: t });
  ws = { ...ws, spatialLedgers: { ...ws.spatialLedgers, rumorLedgers: r.next } };
  for (const sid of ['meet', 'home', 'third']) {
    const rec = ws.spatialLedgers.rumorLedgers?.[sid]?.[key];
    if (rec && rec.arrivalTick <= t && !firstSeen[sid]) firstSeen[sid] = { heardAtTick: t, hop: rec.hopCount, partyIds: rec.content.partyIds, whereId: rec.content.whereId, visibility: rec.content.visibility, what: rec.content.what };
  }
}
console.log('first heard (arrivalTick <= tick):', JSON.stringify(firstSeen));
for (const sid of ['meet', 'home', 'third']) {
  const rec = ws.spatialLedgers.rumorLedgers?.[sid]?.[key];
  console.log(sid, rec ? JSON.stringify({ hop: rec.hopCount, arrivalTick: rec.arrivalTick, partyIds: rec.content.partyIds, whereId: rec.content.whereId, visibility: rec.content.visibility }) : 'none');
}
// Leak dedupe: a held leak record at 'meet' (arrival 10), then a second seed of the same eventRef at tick 14
const leakRef = 'leak:wnpc_x:merewick'; const lk = rumorEventKey(leakRef);
const mk = (t) => ({ ...seed, eventRef: leakRef, eventTick: t, arrivalTick: t, lineageIds: [leakRef, 't0:' + leakRef + '@meet'],
  corroborationRoots: ['t0:' + leakRef + '@meet'], content: { ...seed.content, what: 'paragon_leak', whereId: '', partyIds: [] } });
let ws2 = { ...ws, spatialLedgers: { rumorLedgers: { meet: { [lk]: mk(10) } } } };
// emulate RN's second seed: merge an incoming hop-0 record into the existing one via the landed mergeArrival
import('/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/a73343ed-904d-46d0-a0f5-2969909eb66e/scratchpad/master-81f1cd963/src/domain/spatial/rumorNetwork.js').then(({ mergeArrival }) => {
  const merged = mergeArrival(ws2.spatialLedgers.rumorLedgers.meet[lk], mk(14));
  console.log('leak re-seed at t14 merged arrivalTick =', merged.arrivalTick, '(a new arrival would read 14)');
});
