// D-PT-p5 probe (read-only imports of master 81f1cd963; nothing edited; the design is unbuilt, so the
// cured rules are MODELLED — (A) and (C) on a toy world, (B) on master's own readers).
// Run: node p5Probe.mjs <master worktree path>
// (A) P5C-6 the DEADLINE arm of needPlaceOf: PT §8.4/§8.6's weekly fold, verbatim, before and after the cure.
//       each week: earliestArrivalTick = min(eat, tick + journeyWeeks(whereabouts -> needPlace(tick)))   (only when needPlace != null)
//       reachedTick = the first evaluation AFTER the answer's tick at which whereabouts ∩ needPlace(tick) ≠ ∅
//       verdict at T: made_good (KEEP_PLEDGE | reachedTick ≤ T) else fell_short if eat ≤ T else came_to_nothing
//     before: needPlaceOf has no DEADLINE arm (a summons' { deedId }, an offer) ⇒ null every week.
//     after:  the DEADLINE arm = the actor's own town (the summoning, inviting or offering court).
// (B) P5C-8 backing_voided's court arm: the landed pair label AS THE HIGHER AUTHORITY BELIEVES IT —
//     readBeliefRelationship(higher, backer, ws, relationshipTypeBetween(graph, ws, higher, backer)) ∈ the landed
//     hostile set {rival, cold_war, hostile} ⇒ voided. The round-5 rule asked RN for courtRegardOf(c:, c:),
//     which R51 answers null (pair_state) — modelled as "never fires".
// (C) P5C-22 (WC-PT-54) the town's gate re-hearing: the posture last heard = the newest closedRecent party_gate row
//     of this town's court closed since the arrival whose `how` is a gate posture; none ⇒ plain admitted.
const M = process.argv[2];
const out = {};

// ---------- (A) ----------
const W = { Kell: { Kell: 0, Tolle: 1, Ashford: 2, Merewick: 6 }, Tolle: { Kell: 1, Tolle: 0, Ashford: 1, Merewick: 5 },
  Ashford: { Kell: 2, Tolle: 1, Ashford: 0, Merewick: 4 }, Merewick: { Kell: 6, Tolle: 5, Ashford: 4, Merewick: 0 } };
const journey = (fromIds, toIds) => Math.min(...fromIds.flatMap((f) => toIds.map((t) => W[f][t])));
function judge({ answerTick, T, partyAt, court, keep = false }, rule) {
  let eat = Infinity; let reached = null;
  const needPlace = () => (rule === 'after' ? [court] : null);
  for (let tick = answerTick + 1; tick <= T; tick++) {
    const here = partyAt(tick); const need = needPlace(tick);
    if (need) {
      eat = Math.min(eat, tick + journey(here, need));
      if (reached == null && here.some((s) => need.includes(s))) reached = tick;
    }
  }
  const verdict = keep || (reached != null && reached <= T) ? 'made_good' : (eat <= T ? 'fell_short' : 'came_to_nothing');
  const charge = verdict === 'fell_short' ? 'MISS_FALL · mag (RN §7)' : verdict === 'made_good' ? 'TRUE_RISE · mag' : 'none';
  return { verdict, credibility: charge, earliestArrivalTick: Number.isFinite(eat) ? eat : null, reachedTick: reached };
}
const casesA = {
  'A1 Kell summons the party; yes given at Tolle (a week away) at tick 0; term ends tick 4; the party never rides': { answerTick: 0, T: 4, court: 'Kell', partyAt: () => ['Tolle'] },
  'A2 Merewick summons; yes at Kell (six weeks away); term ends tick 2; the party never rides': { answerTick: 0, T: 2, court: 'Merewick', partyAt: () => ['Kell'] },
  'A3 Kell invites the party; yes at Tolle; the party rides to Kell at tick 2; the day is tick 4; no click': { answerTick: 0, T: 4, court: 'Kell', partyAt: (t) => (t >= 2 ? ['Kell'] : ['Tolle']) },
  'A4 yes given IN Kell to Kell\'s summons, the party leaves the same session for Ashford (P35\'s rule)': { answerTick: 0, T: 4, court: 'Kell', partyAt: () => ['Ashford'] },
  'A5 yes given IN Kell to Kell\'s summons, the party stays through one advance': { answerTick: 0, T: 4, court: 'Kell', partyAt: () => ['Kell'] },
  'A6 Kell employs the party (term of service 26 weeks); yes at Tolle; the party reports at Kell in week 3 and rides on': { answerTick: 0, T: 26, court: 'Kell', partyAt: (t) => (t === 3 ? ['Kell'] : ['Tolle']) },
};
out.A = {};
for (const [name, c] of Object.entries(casesA)) out.A[name] = { before: judge(c, 'before'), after: judge(c, 'after') };

// ---------- (B) ----------
const B = await import(`${M}/src/domain/worldPulse/beliefMap.js`);
const E = await import(`${M}/src/domain/roads/embassyHazard.js`);
const HOSTILE_SET = new Set(['rival', 'cold_war', 'hostile']); // embassyHazard.js / roadsKernel.js / seaRoads.js HOSTILE_RUNGS; beliefMap.js's HOSTILE
// The paramount (Crown) hears a deed backed by its member Kell's court.
const wsBelief = (label) => ({ tick: 100, spatialCanonVersion: 1, simulationRules: { infoMode: 'full' },
  spatialLedgers: { beliefMaps: { Crown: { seat: { Kell: { allianceLabel: label, strengthBand: 'modest', confidence01: 0.6 } } } } } });
const wsOmni = () => ({ tick: 100, simulationRules: { infoMode: 'omniscient' } });
const graph = (rt) => ({ edges: [{ from: 'Crown', to: 'Kell', relationshipType: rt }], channels: [] });
const voidCourtArm = (g, w) => {
  const truthType = E.relationshipTypeBetween(g, w, 'Crown', 'Kell');
  const believed = B.readBeliefRelationship('Crown', 'Kell', w, truthType);
  return { truthType, believed, beliefsActive: B.beliefsActive(w), courtArm: HOSTILE_SET.has(String(believed)) ? 'voided' : 'upheld',
    round5Rule: 'courtRegardOf(c:Crown, c:Kell) → null (R51, pair_state) ⇒ the arm never fires' };
};
const casesB = [
  ['belief rival over truth tax_authority (the crown believes its vassal a rival)', wsBelief('rival'), graph('tax_authority')],
  ['belief cold_war over truth tax_authority', wsBelief('cold_war'), graph('tax_authority')],
  ['belief protector over truth rival (the crown thinks the member loyal)', wsBelief('protector'), graph('rival')],
  ['belief hostile over truth hostile', wsBelief('hostile'), graph('hostile')],
  ['omniscient, truth rival', wsOmni(), graph('rival')],
  ['omniscient, truth tax_authority (a sworn member)', wsOmni(), graph('tax_authority')],
  ['omniscient, no edge at all', wsOmni(), { edges: [], channels: [] }],
];
out.B = {};
for (const [name, w, g] of casesB) out.B[name] = voidCourtArm(g, w);

// ---------- (C) ----------
// rows: { kind, actorKey, closedTick, how }; the party arrived at Kell at tick 10 (presentAt.sinceTick).
const GATE_POSTURES = new Set(['refused', 'admitted_under_watch']);
const postureLastHeard = (closedRecent, courtKey, sinceTick) => {
  const rows = closedRecent.filter((r) => r.kind === 'party_gate' && r.actorKey === courtKey && r.closedTick >= sinceTick && GATE_POSTURES.has(r.how));
  rows.sort((a, b) => b.closedTick - a.closedTick);
  return rows.length ? rows[0].how : 'admitted';
};
const rehear = (closedRecent, courtKey, sinceTick, defaultNow) => {
  const last = postureLastHeard(closedRecent, courtKey, sinceTick);
  return { lastHeard: last, defaultNow, minted: defaultNow !== 'admitted' && defaultNow !== last };
};
const arrivalRow = { kind: 'party_gate', actorKey: 'c:Kell', closedTick: 11, how: 'refused' }; // the hearing heard `refused`
out.C = {
  'C1 heard refused at arrival (the DM AMENDED it to admitted — the row keeps the posture heard); default still refused': rehear([arrivalRow], 'c:Kell', 10, 'refused'),
  'C2 the posture changes to admitted_under_watch while the party stays': rehear([arrivalRow], 'c:Kell', 10, 'admitted_under_watch'),
  'C3 the posture softens to plain admitted (never heard)': rehear([arrivalRow], 'c:Kell', 10, 'admitted'),
  'C4 arrival default was plain admitted (no card, no row); the court turns hostile: refused': rehear([], 'c:Kell', 10, 'refused'),
  'C5 a body-half row of Kell\'s land since the arrival (how `passed`) is not a posture; default refused after C1': rehear([arrivalRow, { kind: 'party_gate', actorKey: 'c:Kell', closedTick: 13, how: 'passed' }], 'c:Kell', 10, 'refused'),
  'C6 the arrival row was EVICTED from the 16-row archive; default still refused (one re-statement)': rehear([], 'c:Kell', 10, 'refused'),
  'C7 a row from an EARLIER stay (closed tick 5, before this arrival) does not count': rehear([{ kind: 'party_gate', actorKey: 'c:Kell', closedTick: 5, how: 'refused' }], 'c:Kell', 10, 'refused'),
};
console.log(JSON.stringify(out, null, 2));
