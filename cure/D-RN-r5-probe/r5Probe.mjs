// D-RN-r5 probe (disposition lane, round 5a). READ-ONLY imports of master 81f1cd963. Never edits the
// worktree; never runs the test suite; never touches git.
// Usage: node r5Probe.mjs <master worktree> > r5Probe.out.json
//
// A. OD-RN-48 / RULINGS-ROUND4 §E (the verifier's FAIL A.8): the landed `readBeliefRelationship`
//    on five worlds (dormant · omniscient with the marker · belief with a record · belief with no
//    record · a self read), and RN's CURED `pairNet` (the label THROUGH BELIEF, A.8's form; the
//    vassal contract read true, the landed carve-out; κ's trust/resentment term only where the
//    label read is the true one; `unknown` as no tie) against the round-4 truth read.
// B. RN-X2 / RULINGS-ROUND5 B.10: a court's voice is a TALE whose hearer set is the walk from the
//    court's town at the hop budget by the court's tier, over the landed `tradeNeighbours` and the
//    landed `maxHopsFor`; contrast the round-4 "office scope" (a small town's at home = ring 0).
const M = process.argv[2];
const { readBeliefRelationship, beliefsActive, GOVERNING_SEAT_KEY } = await import(`${M}/src/domain/worldPulse/beliefMap.js`);
const { setSpatialLedger } = await import(`${M}/src/domain/spatial/spatialLedgerAccess.js`);
const { RELATIONSHIP_DEFAULTS } = await import(`${M}/src/domain/worldPulse/relationshipState.js`);
const { tradeNeighbours, maxHopsFor } = await import(`${M}/src/domain/spatial/rumorNetwork.js`);
const { TIER_ORDER } = await import(`${M}/src/data/constants.js`);

const out = {};

// ── A ───────────────────────────────────────────────────────────────────────
const rec = (label) => ({ readiness: 0, strengthBand: 2, allianceLabel: label, faithLabel: null, confidence01: 0.6, lastUpdateTick: 10 });
const withBelief = (ws, obs, subj, label) => setSpatialLedger(ws, 'beliefMaps', { [obs]: { [GOVERNING_SEAT_KEY]: { [subj]: rec(label) } } });
const dormant = { simulationRules: { infoMode: 'full' } };                       // no canon marker
const omni = { spatialCanonVersion: 1, simulationRules: { infoMode: 'omniscient' } };
const live = { spatialCanonVersion: 1, simulationRules: { infoMode: 'full' } };
out.A_readBeliefRelationship = {
  dormant_with_record: readBeliefRelationship('varn', 'kell', withBelief(dormant, 'varn', 'kell', 'hostile'), 'rival'),
  omniscient_with_record: readBeliefRelationship('varn', 'kell', withBelief(omni, 'varn', 'kell', 'hostile'), 'rival'),
  belief_with_record: readBeliefRelationship('varn', 'kell', withBelief(live, 'varn', 'kell', 'hostile'), 'rival'),
  belief_record_unknown_label: readBeliefRelationship('varn', 'kell', withBelief(live, 'varn', 'kell', 'unknown'), 'rival'),
  belief_no_record: readBeliefRelationship('varn', 'kell', live, 'rival'),
  self: readBeliefRelationship('varn', 'varn', withBelief(live, 'varn', 'varn', 'hostile'), 'neutral'),
  beliefsActive: { dormant: beliefsActive(dormant), omni: beliefsActive(omni), live: beliefsActive(live) },
};

const PAIR_NET = { allied: 0.6, trade_partner: 0.3, patron: 0.2, client: 0.2, vassal: 0.2, neutral: 0, criminal_network: -0.2, rival: -0.4, cold_war: -0.6, hostile: -0.8 };
const K = 0.5;
const clamp = (x) => Math.max(-1, Math.min(1, x));
const r4 = (trueLabel, trust, resentment) => {
  const d = RELATIONSHIP_DEFAULTS[trueLabel];
  return clamp(PAIR_NET[trueLabel] + K * ((trust - d.trust) - (resentment - d.resentment)));
};
const r5 = (ws, holder, other, trueLabel, trust, resentment) => {
  const believed = trueLabel === 'vassal' ? 'vassal' : readBeliefRelationship(holder, other, ws, trueLabel);
  if (!(believed in PAIR_NET)) return { label: believed, net: 0 };            // `unknown` ⇒ no tie
  if (believed !== trueLabel) return { label: believed, net: PAIR_NET[believed] }; // no belief carrier for κ
  const d = RELATIONSHIP_DEFAULTS[trueLabel];
  return { label: believed, net: Number(clamp(PAIR_NET[believed] + K * ((trust - d.trust) - (resentment - d.resentment))).toFixed(4)) };
};
// Varn and Kell are truly `rival` with trust 0.20 / resentment 0.70 (a bitter rivalry).
const cases = {
  omniscient: withBelief(omni, 'varn', 'kell', 'hostile'),
  belief_stale_hostile: withBelief(live, 'varn', 'kell', 'hostile'),
  belief_current: withBelief(live, 'varn', 'kell', 'rival'),
  belief_unknown_record: withBelief(live, 'varn', 'kell', 'unknown'),
  belief_no_record: live,
};
out.A_pairNet = { r4_truth_read: Number(r4('rival', 0.2, 0.7).toFixed(4)) };
for (const [k, ws] of Object.entries(cases)) out.A_pairNet[k] = r5(ws, 'varn', 'kell', 'rival', 0.2, 0.7);
out.A_pairNet.vassal_contract_true_despite_stale_belief = r5(withBelief(live, 'varn', 'kell', 'neutral'), 'varn', 'kell', 'vassal', 0.5, 0.1);

// ── B ───────────────────────────────────────────────────────────────────────
// Tier → the rumor road's significance (DRAFT): the rural band and the town `notable` (2 hops),
// city and metropolis `major` (4), a great crown (§4.2's realm row) `major` at the realm score (5).
const sigOfTier = (tier, greatCrown) => greatCrown ? { significance: 'major', score: 95 }
  : (['city', 'metropolis'].includes(tier) ? { significance: 'major', score: 80 } : { significance: 'notable', score: 60 });
const ch = (id, a, b) => ({ id, type: 'trade_route', from: a, to: b, status: 'confirmed' });
const graph = { channels: [ch('e1', 'varn', 'tolle'), ch('e2', 'varn', 'ashford'), ch('e3', 'varn', 'merewick'), ch('e4', 'tolle', 'kell'), ch('e5', 'kell', 'far'), ch('e6', 'far', 'farther'), ch('e7', 'ham', 'kell')] };
function walk(g, origin, hops) {
  const rings = [[origin]]; const seen = new Set([origin]);
  for (let h = 1; h <= hops; h += 1) {
    const next = [];
    for (const id of rings[h - 1]) for (const { neighbourId } of tradeNeighbours(g, id)) if (!seen.has(neighbourId)) { seen.add(neighbourId); next.push(neighbourId); }
    if (!next.length) break; rings.push(next.sort());
  }
  return rings;
}
out.B_tiers = TIER_ORDER;
out.B_walk = {
  varn_town_r5: { budget: maxHopsFor(sigOfTier('town')), rings: walk(graph, 'varn', maxHopsFor(sigOfTier('town'))) },
  varn_town_r4_office_scope_settlement: { rings: [['varn']] },
  hamlet_one_neighbour_r5: { budget: maxHopsFor(sigOfTier('hamlet')), rings: walk(graph, 'ham', maxHopsFor(sigOfTier('hamlet'))) },
  isolated_hamlet_r5: { budget: maxHopsFor(sigOfTier('hamlet')), rings: walk(graph, 'lone', maxHopsFor(sigOfTier('hamlet'))) },
  city_r5: { budget: maxHopsFor(sigOfTier('city')), rings: walk(graph, 'varn', maxHopsFor(sigOfTier('city'))) },
  great_crown_r5: { budget: maxHopsFor(sigOfTier('town', true)) },
};
// The hearer set excludes the court's own commons (A.15): hearers are rings ≥ 1 (and persons
// standing anywhere in reach with their own regard of the court). An isolated court reaches none.
out.B_hearer_towns = Object.fromEntries(Object.entries(out.B_walk).filter(([, v]) => v.rings).map(([k, v]) => [k, v.rings.slice(1).flat()]));
// R62's arithmetic at the stock's neutral weight: −1 (condemnation) × 1.0 × 0.5 × factor, cap 0.4.
const term = (f, w = 1) => Math.max(-0.4, Math.min(0.4, -1 * w * 0.5 * f));
out.B_R62_terms = { tolle_allied: term(1), ashford_no_pair: term(0), merewick_hostile: term(-1), liar_allied: Number(term(1, 0.35).toFixed(4)) };
console.log(JSON.stringify(out, null, 2));
