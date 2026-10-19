// V-RN-r3 probe (refuting verifier, round 3b). READ-ONLY imports of master 81f1cd963.
// Never edits the worktree; never runs the test suite; never touches git.
// Usage: node rnR3Verify.mjs <master worktree>  > rnR3Verify.out
//
// P1. The findings telling as RN §3.4 r3 SPECIFIES IT (hop-0 origin the MEETING town,
//     `relayedTick: null`, "relays it exactly as a feed seed") against CH §8 r3 / RULINGS-ROUND3 B
//     CH-V4 (origin the EMPLOYER'S SEAT, the continuation guard PRE-STAMPED): who ever holds it.
// P2. RN §5.5 r3's court voice term `sign × credibilityWeight(credibilityScoreOf(...)) × 0.5`
//     against the person voice `sign × net(hearer's regard of speaker) × 0.5`, read on RN's own
//     band edges (±0.1 · ±0.35 · ±0.65), for a hearer that feels NOTHING about the speaker and for
//     a hearer that is the speaker's enemy.
const M = process.argv[2];
const { advanceRumorLedgers, rumorEventKey } = await import(`${M}/src/domain/spatial/rumorNetwork.js`);
const { buildSpatialDigest } = await import(`${M}/src/domain/spatial/index.js`);
const { makeGridPack, placeSettlements } = await import(`${M}/tests/fixtures/spatialPackFixtures.js`);
const { credibilityWeight, credibilityScoreOf } = await import(`${M}/src/domain/worldPulse/informationStatecraft.js`);

const out = {};

// ── P1 ──────────────────────────────────────────────────────────────────────
const ids = ['home', 'meet', 'third', 'post', 'fourth'];
const pack = makeGridPack({ cols: 24, rows: 18 });
const placements = placeSettlements(pack, ids.length).map((p, i) => ({ id: ids[i], cellId: p.cellId }));
const digest = buildSpatialDigest({ pack, placements });
const ch = (id, a, b) => ({ id, type: 'trade_route', from: a, to: b, status: 'confirmed' });
// home — meet — third — post ; meet — fourth (a court that is neither the employer nor the post)
const graph = { channels: [ch('e1', 'home', 'meet'), ch('e2', 'meet', 'third'), ch('e3', 'third', 'post'), ch('e4', 'meet', 'fourth')] };

function run(label, originId, stamped) {
  const eventRef = 'rendezvous:wnpc_x:10';
  const key = rumorEventKey(eventRef);
  const seed = { eventRef, eventTick: 10, carrier: 'trade', arrivalTick: 10, hopCount: 0,
    lineageIds: [eventRef, `t0:${eventRef}@${originId}`], corroborationRoots: [`t0:${eventRef}@${originId}`],
    provenance: { originId, relayIds: [] }, completeness01: 1, accuracy01: 1, framing: [],
    significance: 'notable', score: 0,
    content: { what: 'paragon_findings', whereId: 'post', scope: 'settlement', magnitude: 0, partyIds: ['post'],
      causeClass: null, deityName: null, visibility: 'mechanical', paragonId: 'wnpc_x' },
    relayedTick: stamped ? 10 : null };
  let ws = { simulationRules: { infoMode: 'perfect_delayed' }, spatialCanonVersion: 1, spatialDigest: digest,
    spatialLedgers: { rumorLedgers: { [originId]: { [key]: seed } } } };
  const everHeld = new Set();
  for (let t = 10; t <= 40; t += 1) {
    const r = advanceRumorLedgers({ worldState: ws, feedEntries: [], graph, tick: t });
    ws = { ...ws, spatialLedgers: { ...ws.spatialLedgers, rumorLedgers: r.next } };
    for (const sid of ids) if (ws.spatialLedgers.rumorLedgers?.[sid]?.[key]) everHeld.add(sid);
  }
  return { label, originId, relayedTickAtSeed: stamped ? 10 : null, everHeld: [...everHeld].sort() };
}
out.P1_findingsTelling = [
  run('RN §3.4 r3 as written (origin the meeting town; relayedTick null)', 'meet', false),
  run('RN §3.4 r3 relayedTick null, origin corrected to the seat', 'home', false),
  run('CH §8 r3 / RULINGS-ROUND3 B CH-V4 (origin the seat; guard pre-stamped)', 'home', true),
];

// ── P2 ──────────────────────────────────────────────────────────────────────
const BANDS = [[-0.65, 'hatred'], [-0.35, 'enmity'], [-0.1, 'mistrust'], [0.1, 'indifference'], [0.35, 'fondness'], [0.65, 'esteem'], [Infinity, 'adoration']];
const band = (net) => { for (const [edge, w] of BANDS) { if (net < edge || (edge === Infinity)) return w; } return 'adoration'; };
// RN §5.1: ±0.1 indifference; ±0.35; ±0.65 — read as: net ≤ −0.65 hatred · ≤ −0.35 enmity · < −0.1 mistrust ·
// within ±0.1 indifference · > 0.1 fondness · ≥ 0.35 esteem · ≥ 0.65 adoration (the inclusive side is DRAFT;
// the probe reads the strict side, which can only UNDER-state the swing).
const neutralScore = credibilityScoreOf({ spatialLedgers: {} }, 'varn', 100);
const sign = -1; // a condemnation
const courtTerm = (w) => +(sign * w * 0.5).toFixed(4);
const personTerm = (hearerNetOfSpeaker) => +(sign * hearerNetOfSpeaker * 0.5).toFixed(4);
out.P2_voiceTerms = {
  courtStockAbsent_score: neutralScore,
  courtStockAbsent_weight: credibilityWeight(neutralScore),
  weightFloor_scoreMinus99: credibilityWeight(-99),
  weightCeil_score99: credibilityWeight(99),
  courtVoice_hearerIndifferentToSpeaker: { term: courtTerm(credibilityWeight(neutralScore)), band: band(courtTerm(credibilityWeight(neutralScore))) },
  courtVoice_hearerIsSpeakersEnemy_sameTerm: { term: courtTerm(credibilityWeight(neutralScore)), band: band(courtTerm(credibilityWeight(neutralScore))), note: 'the court formula reads no hearer relation' },
  courtVoice_trustedCourt: { term: courtTerm(credibilityWeight(99)), band: band(courtTerm(credibilityWeight(99))) },
  personVoice_hearerIndifferentToSpeaker: { term: personTerm(0), band: band(personTerm(0)) },
  personVoice_hearerHatesSpeaker_net_m0_5: { term: personTerm(-0.5), band: band(personTerm(-0.5)) },
  personVoice_hearerEsteemsSpeaker_net_0_5: { term: personTerm(0.5), band: band(personTerm(0.5)) },
  perDeedLensCap_sev: 0.4,
};

console.log(JSON.stringify(out, null, 1));
