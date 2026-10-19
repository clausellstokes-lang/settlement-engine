// D-RN-r4 probe (disposition lane, round 4a). READ-ONLY imports of master 81f1cd963 (and one
// byte-copy of a module-private landed function, extracted from its source text and evaluated
// here — never edited). Never edits the worktree; never runs the test suite; never touches git.
// Usage: node r4Probe.mjs <master worktree> > r4Probe.out.json
//
// A. THE FINDINGS SEED AS CURED (RULINGS-ROUND4 A.9): RN's TELLING_SOURCES arm builds the landed
//    feed seed's own record and COPIES a row's declared `relayedTick` (pre-stamped) and declared
//    `arrivalTick` (= tick + the relay's own price from the meeting town to the seat). Who ever
//    holds the record; when it becomes visible (arrivalTick <= tick, the read model's rule); when
//    it expires. Contrast rows: the round-3 text (meeting town, null guard) and an undeclared
//    row (the leak's default: relayed exactly as a feed seed).
// B. THE COURT VOICE AS CURED (A.15): `sign × credibilityWeight × 0.5 × relationFactor`, capped by
//    the per-deed cap 0.4, the relation factor read by the LANDED banding of the pair label
//    (`envoyChanceMeetingStage.js :: postureBandOf`, module-private — extracted byte-for-byte).
const M = process.argv[2];
const fs = await import('node:fs');
const { advanceRumorLedgers, rumorEventKey, RUMOR_TTL_TICKS } = await import(`${M}/src/domain/spatial/rumorNetwork.js`);
const { buildSpatialDigest } = await import(`${M}/src/domain/spatial/index.js`);
const { hopWeeks } = await import(`${M}/src/domain/spatial/distanceRead.js`);
const { makeGridPack, placeSettlements } = await import(`${M}/tests/fixtures/spatialPackFixtures.js`);
const { credibilityWeight, credibilityScoreOf } = await import(`${M}/src/domain/worldPulse/informationStatecraft.js`);
const stageModule = await import(`${M}/src/domain/worldPulse/envoyChanceMeetingStage.js`);
const { POSTURE_BANDS } = await import(`${M}/src/domain/worldPulse/envoyChanceMeeting.js`);
const { RELATIONSHIP_DEFAULTS } = await import(`${M}/src/domain/worldPulse/relationshipState.js`);

const out = {};

// ── A ───────────────────────────────────────────────────────────────────────
const ids = ['home', 'meet', 'third', 'post', 'fourth'];
const pack = makeGridPack({ cols: 24, rows: 18 });
const placements = placeSettlements(pack, ids.length).map((p, i) => ({ id: ids[i], cellId: p.cellId }));
const digest = buildSpatialDigest({ pack, placements });
const ch = (id, a, b) => ({ id, type: 'trade_route', from: a, to: b, status: 'confirmed' });
const graph = { channels: [ch('e1', 'home', 'meet'), ch('e2', 'meet', 'third'), ch('e3', 'third', 'post'), ch('e4', 'meet', 'fourth')] };

/** RN's arm as cured: the landed feed seed's record, the row's declared guard and arrival copied. */
function seedFromRow(row, now) {
  const originId = row.originIds[0];
  const eventRef = row.eventRef;
  const root = `t0:${eventRef}@${originId}`;
  const eventTick = Math.max(0, Math.floor(row.eventTick));
  const declaredArrival = Number.isFinite(row.arrivalTick) ? Math.floor(row.arrivalTick) : null;
  return {
    eventRef, eventTick, carrier: 'trade',
    arrivalTick: declaredArrival == null ? eventTick : Math.max(eventTick, declaredArrival),
    hopCount: 0, lineageIds: [eventRef, root], corroborationRoots: [root],
    provenance: { originId, relayIds: [] }, completeness01: 1, accuracy01: 1, framing: [],
    significance: row.significance === 'major' ? 'major' : 'notable', score: Math.max(0, Math.round(row.score || 0)),
    content: row.content,
    relayedTick: Number.isInteger(row.relayedTick) ? row.relayedTick : null,
  };
}
const SEASON = null;
function relayPrice(fromId, toId) { // the relay's own price: 0 for one town; else max(1, finite(hopWeeks, 1))
  if (fromId === toId) return 0;
  const w = hopWeeks(digest, fromId, toId, SEASON);
  return Math.max(1, Number.isFinite(w) ? w : 1);
}
function run(label, row, t0) {
  const key = rumorEventKey(row.eventRef);
  const seed = seedFromRow(row, t0);
  let ws = { simulationRules: { infoMode: 'perfect_delayed' }, spatialCanonVersion: 1, spatialDigest: digest,
    spatialLedgers: { rumorLedgers: { [row.originIds[0]]: { [key]: seed } } } };
  const everHeld = new Set(); let firstVisibleAtHome = null; let goneAtHome = null; let seenHome = false;
  for (let t = t0; t <= t0 + 40; t += 1) {
    const r = advanceRumorLedgers({ worldState: ws, feedEntries: [], graph, tick: t, season: SEASON });
    ws = { ...ws, spatialLedgers: { ...ws.spatialLedgers, rumorLedgers: r.next } };
    for (const sid of ids) if (ws.spatialLedgers.rumorLedgers?.[sid]?.[key]) everHeld.add(sid);
    const h = ws.spatialLedgers.rumorLedgers?.[row.originIds[0]]?.[key];
    if (h) { seenHome = true; if (firstVisibleAtHome == null && h.arrivalTick <= t) firstVisibleAtHome = t; }
    else if (seenHome && goneAtHome == null) goneAtHome = t;
  }
  return { label, originId: row.originIds[0], seedArrivalTick: seed.arrivalTick, seedRelayedTick: seed.relayedTick,
    everHeld: [...everHeld].sort(), firstVisibleAtOrigin: firstVisibleAtHome, goneAtOrigin: goneAtHome };
}
const T0 = 10;
const findingsContent = { what: 'paragon_findings', whereId: 'post', scope: 'settlement', magnitude: 0, partyIds: ['post'],
  causeClass: null, deityName: null, visibility: 'mechanical', paragonId: 'wnpc_x' };
const carry = relayPrice('meet', 'home');
out.A_relayPrice_meet_to_home_weeks = carry;
out.A_hopWeeks_meet_home_raw = hopWeeks(digest, 'meet', 'home', SEASON);
out.A_notableTtl = RUMOR_TTL_TICKS.notable;
out.A_findingsTelling = [
  run('round-3 RN text (origin the meeting town; guard null; arrival at once)', {
    eventRef: 'rendezvous:wnpc_x:9', eventTick: T0, originIds: ['meet'], significance: 'notable', score: 0, content: findingsContent }, T0),
  run('A.9 CURED (origin the seat; guard pre-stamped; arrival = tick + the carry)', {
    eventRef: 'rendezvous:wnpc_x:9', eventTick: T0, originIds: ['home'], significance: 'notable', score: 0, content: findingsContent,
    relayedTick: T0, arrivalTick: T0 + carry }, T0),
  run('a row that declares nothing (the leak default: relayed exactly as a feed seed)', {
    eventRef: 'leak:wnpc_x:merewick:3', eventTick: T0, originIds: ['third'], significance: 'notable', score: 0,
    content: { what: 'paragon_leak', whereId: '', partyIds: [], scope: 'settlement', magnitude: 0, causeClass: null, deityName: null, visibility: 'mechanical', paragonId: 'wnpc_x', employerId: 'merewick' } }, T0),
];

// ── B ───────────────────────────────────────────────────────────────────────
const src = fs.readFileSync(`${M}/src/domain/worldPulse/envoyChanceMeetingStage.js`, 'utf8');
const m = src.match(/function postureBandOf\(relationshipType\) \{[\s\S]*?\n\}/);
const body = m ? m[0] : null;
const text = (v) => (v == null ? '' : String(v));
// eslint-disable-next-line no-new-func
const postureBandOf = body ? new Function('text', `${body}; return postureBandOf;`)(text) : null;
out.B_postureBandOf_exported = Object.prototype.hasOwnProperty.call(stageModule, 'postureBandOf');
out.B_postureBandOf_source = body;
out.B_POSTURE_BANDS = POSTURE_BANDS;
const labels = [...Object.keys(RELATIONSHIP_DEFAULTS), ''];
const FACTOR = { friendly: 1, neutral: 0, hostile: -1 };
const CAP = 0.4;
const cw = credibilityWeight(credibilityScoreOf({ spatialLedgers: {} }, 'varn', 100));
const term = (sign, w, rf) => { const raw = sign * w * 0.5 * rf; return +Math.max(-CAP, Math.min(CAP, raw)).toFixed(4); };
out.B_courtStockDark_weight = cw;
out.B_byLabel_condemnation = labels.map((label) => {
  const band = postureBandOf(label);
  return { label: label || '(no pair state)', band, factor: FACTOR[band],
    termStockDark: term(-1, cw, FACTOR[band]), termTrustedCourt: term(-1, credibilityWeight(99), FACTOR[band]),
    termProvenLiar: term(-1, credibilityWeight(-99), FACTOR[band]) };
});
out.B_ownCommons = 'EXCLUDED by rule (no term) — the voice is theirs';
out.B_round3_formula_indifferentHearer = +(-1 * cw * 0.5).toFixed(4);

console.log(JSON.stringify(out, null, 1));
