/**
 * tests/domain/pactRenegotiationGr5c.test.js — GR-5c: RENEGOTIATION FROM STRENGTH (lane FP-B4;
 * the brief BUILD-FP-B4-gr5c.md, at the integration tip 57b52b510).
 *
 * Mid-term, a court whose BELIEVED lead over its counterpart has swung past the band since the
 * signing demands new terms: a `renegotiation` row through the ledger's one writer, the ask
 * capped, the court's own demand coloured by its posture. The counterpart answers through the
 * tick's one answer step: ACCEPTED is a `renegotiated` lineage act through
 * `amendPactInstrument` at the same pair key; REFUSED is a strain fact on the demander through
 * the existing strain idiom, and the treaty stands.
 *
 * The standing instrument every arm reads is the WAR DOOR's: its record is the shape
 * `peaceTerms.js :: mintTreaty` writes (the margin it recorded, the two war parties) and its
 * clauses are drafted by the war door's own drafter (`draftTerms`) at the margin's own
 * normalized value, so no clause here is hand-spelled.
 *
 * The new symbols are read through NAMESPACE imports on purpose, so the red-first plant of the
 * pre-change sources reds each arm by title instead of failing the file at link time.
 */
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it, vi } from 'vitest';

import * as manifest from '../../src/domain/events/realmManifest.js';
import * as renewal from '../../src/domain/worldPulse/pactRenewal.js';
import * as amendment from '../../src/domain/worldPulse/pactAmendment.js';
import * as triggers from '../../src/domain/worldPulse/pactTriggers.js';
import * as posture from '../../src/domain/worldPulse/strategicPosture.js';
import { applyRealmVerbOrder, buildRealmVerbOutcome } from '../../src/domain/worldPulse/realmVerbExecution.js';
import { PACT_DRAFT_LENS, advancePeacetimePacts, draftPactSheet } from '../../src/domain/worldPulse/pactFormation.js';
import { openPactProposal, pactProposalsOf } from '../../src/domain/worldPulse/pactProposals.js';
import { treatyLedgerOf } from '../../src/domain/worldPulse/treatyEnforcement.js';
import { termBudgetFor } from '../../src/domain/worldPulse/peaceTermsAppraisal.js';
import { PEACE_TERMS_TUNING } from '../../src/domain/worldPulse/peaceTermsCatalog.js';
import { draftTerms } from '../../src/domain/worldPulse/peaceTermsDrafting.js';
import { treatyPairKey } from '../../src/domain/worldPulse/peaceTermsPrimitives.js';
import { CURRENT_TREATY_TICKS_PER_YEAR } from '../../src/domain/worldPulse/treatyClock.js';
import { strengthBandOf, strengthOfBand } from '../../src/domain/worldPulse/beliefMap.js';
import { settlementStrength } from '../../src/domain/worldPulse/relationshipEvolution.js';
import { A_ECONOMY, B_ECONOMY, SEAT, pactWorld, relKey } from '../helpers/pactFixture.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

// The ONE amendment writer, wrapped so an arm can see the act it is called with (the real
// body still runs).
vi.mock('../../src/domain/worldPulse/pactAmendment.js', async (importOriginal) => {
  const actual = /** @type {Record<string, any>} */ (await importOriginal());
  return { ...actual, amendPactInstrument: vi.fn(actual.amendPactInstrument) };
});
// The posture read, wrapped the same way, so the dark arm can prove the opener never reaches it.
vi.mock('../../src/domain/worldPulse/strategicPosture.js', async (importOriginal) => {
  const actual = /** @type {Record<string, any>} */ (await importOriginal());
  return { ...actual, courtPostureOf: vi.fn(actual.courtPostureOf) };
});

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

// ── THE FIXTURE AND THE IDENTITY HARNESS, verbatim from the base measurement (57b52b510) ──────
const sha = (value) => createHash('sha256').update(JSON.stringify(value)).digest('hex');
const SIGN_TICK = 0;
const YEAR = CURRENT_TREATY_TICKS_PER_YEAR;
/** The instrument's first year-turn: the day its court may raise a demand of its own. */
const TURN = SIGN_TICK + YEAR;
/** The victor's believed lead the war door recorded at the signing. */
const MARGIN = 0.3;
const LIT = Object.freeze({ treatyRenewalEnabled: true, oathHolderEnabled: true });
const npc = (id, name, seat, extra = {}) => ({ id, name, factionAffiliation: seat, role: 'official', ...extra });
const ROSTERS = Object.freeze({
  L: [npc('npc_l1', 'Lorn Ashe', 'L seat'), npc('npc_l2', 'Ilsa Brand', 'L seat')],
  V: [npc('npc_v1', 'Varo Keel', 'V seat'), npc('npc_v2', 'Wenna Dray', 'V seat')],
});
const court = (id, economicState, extra, roster) => ({
  id, name: id,
  settlement: {
    id, name: id, economicState: { ...economicState }, ...extra,
    powerStructure: { publicLegitimacy: { score: 60, label: 'Stable' }, factions: [{ faction: `${id} seat`, category: 'military', power: 78, isGoverning: true }], conflicts: [] },
    npcs: roster.map((row) => ({ ...row })),
  },
});
/** L, the loser, is a hamlet; V, the victor, a city. The real graph edge joins them. */
const snapshotOf = (rosters = ROSTERS) => ({
  settlements: [
    court('L', B_ECONOMY, { tier: 'hamlet', population: 80 }, rosters.L),
    court('V', A_ECONOMY, { tier: 'city', population: 6000 }, rosters.V),
  ],
  regionalGraph: { edges: [{ from: 'L', to: 'V', relationshipType: 'trade_partner' }] },
});
/** The court's own strength, as the kernel injects it at the tick (knowledge, not belief). */
const STRENGTH = Object.freeze({ L: 0.6, V: 0.7 });
const strengthFor = (id) => STRENGTH[id] ?? 0;
/** The war door's record, its clauses drafted by the war door's own drafter at the margin's own value. */
function warDoorTreaty() {
  const { margin01 } = termBudgetFor(MARGIN);
  const drafted = draftTerms({
    ranked: [{ termType: 'tribute', value: 1 }, { termType: 'demilitarization', value: 1 }],
    budget: 3, margin01, press: 1, tick: SIGN_TICK,
  });
  return {
    parties: ['V', 'L'], victorId: 'V', loserId: 'L', victorName: 'V', loserName: 'L',
    mintedTick: SIGN_TICK, believedMarginAtSignature: MARGIN, budgetGranted: 3, budgetSpent: drafted.budgetSpent,
    treatyTicksPerYear: YEAR, terms: drafted.terms, complianceState: 'honored',
    receipts: ['The Peace of L: signed under V terms.'],
  };
}
const belief = (strengthBand, extra = {}) => ({
  readiness: 0, strengthBand, allianceLabel: 'trade_partner', faithLabel: null, confidence01: 0.9, lastUpdateTick: 0, ...extra,
});
/** Each court's picture of the other. `lSeesV: null` means L holds no picture of V at all. */
function beliefsOf({ lSeesV = 2, vSeesL = 4, vScarcity = null } = {}) {
  return {
    ...(lSeesV === null ? {} : { L: { [SEAT]: { V: belief(lSeesV) } } }),
    V: { [SEAT]: { L: belief(vSeesL, vScarcity ? { scarcityBands: vScarcity } : {}) } },
  };
}
function warWorld({ rules = LIT, beliefs = beliefsOf(), relationship = {}, tick = TURN, treaty = warDoorTreaty(), dispositionStats } = {}) {
  const world = pactWorld({
    flag: true, rules, beliefs, dispositionStats,
    relationshipStates: { [relKey('L', 'V')]: { relationshipType: 'trade_partner', trust: 0.6, resentment: 0.1, ...relationship } },
    treaties: { [treatyPairKey('V', 'L')]: treaty },
  });
  return { ...world, tick };
}
const instrumentOf = (world) => Object.values(treatyLedgerOf(world) || {})[0];
const keysOf = (world) => Object.keys(treatyLedgerOf(world) || {});
const outcomeOf = (r) => ({ worldState: r.worldState, receipts: r.receipts, changed: r.changed, newsEntries: r.newsEntries });
const advanced = (world, tick, snapshot = snapshotOf()) => advancePeacetimePacts({ snapshot, worldState: world, tick, strengthFor });
/** Stage the order through the lane's pure mint, then apply it through the arm dispatcher. */
function proposeThrough(world, tick, args) {
  const snapshot = { settlements: snapshotOf().settlements };
  const built = buildRealmVerbOutcome({ verb: 'PROPOSE_PACT', args, worldState: world, snapshot, tick });
  const applied = built.ok
    ? applyRealmVerbOrder({ state: world, snapshot, settlementUpdates: new Map(), outcome: built.outcome, tick, now: null })
    : null;
  return { built, applied };
}
/** Every clause word the dial offered at the base, staged and approved against the war door's instrument. */
function verbDigest() {
  const world = warWorld({ tick: 30 });
  return sha([...manifest.PACT_CLAUSE_TYPES, 'renewal'].map((termType) => ({
    termType, ...proposeThrough(world, 30, { fromId: 'L', toId: 'V', termType }),
  })));
}
/** The answer step over the rows the base already answered: a trade question and an in-window renewal. */
function answerDigest() {
  const world = warWorld({ tick: 30, beliefs: beliefsOf({ vScarcity: { food: 'plentiful' } }) });
  const sheet = draftPactSheet({ trigger: 'trade_demand', fromId: 'V', toId: 'L', reciprocal: false, tick: 30, score01: 0 });
  const traded = openPactProposal({ worldState: world, from: 'V', to: 'L', trigger: 'trade_demand', sheet: { terms: sheet.terms }, tick: 30 });
  const tradeDue = pactProposalsOf(traded.worldState)[0].answerDueTick;
  const ends = Math.max(...instrumentOf(world).terms.map((t) => t.expiresTick));
  const late = { ...world, tick: ends - 10 };
  const renewing = openPactProposal({
    worldState: late, from: 'L', to: 'V', trigger: 'renewal',
    sheet: { terms: renewal.draftRenewalSheet(instrumentOf(late), ends - 10) }, tick: ends - 10,
  });
  const renewDue = pactProposalsOf(renewing.worldState)[0].answerDueTick;
  return sha([outcomeOf(advanced(traded.worldState, tradeDue)), outcomeOf(advanced(renewing.worldState, renewDue))]);
}
/** The lit tick on both sides of the year-turn with the swing BELOW the band: nothing is demanded. */
function belowBandDigest() {
  const world = warWorld({ beliefs: beliefsOf({ lSeesV: 3 }) });
  return sha([TURN - 1, TURN, TURN + 1].map((tick) => outcomeOf(advanced({ ...world, tick }, tick))));
}
/** The year-turn with the swing PAST the band, the renegotiation layer absent and then false. */
function darkDigest() {
  return sha([undefined, false].map((flag) => {
    const rules = flag === undefined ? { oathHolderEnabled: true } : { oathHolderEnabled: true, treatyRenewalEnabled: flag };
    return outcomeOf(advanced(warWorld({ rules }), TURN));
  }));
}
// ── end of the identity harness ───────────────────────────────────────────────────────────

const receiptOf = (result, kind) => result.receipts.find((row) => row.kind === kind);
const rel = (world) => world.relationshipStates[relKey('L', 'V')];
const ARGS = Object.freeze({ fromId: 'L', toId: 'V', termType: 'renegotiation' });
/** The loser's own strength off the tick: the one derivation, no pressure index. */
const OWN = () => settlementStrength({ settlement: snapshotOf().settlements[0].settlement }, {});
/** The demand at the year-turn through the tick's own opener, answered at its due by the one answer step. */
function demandAndAnswer({ world = warWorld(), rosters = ROSTERS } = {}) {
  const opened = advanced(world, TURN, snapshotOf(rosters));
  const row = pactProposalsOf(opened.worldState).find((r) => r.trigger === 'renegotiation');
  if (!row) throw new Error('the demand did not open');
  const asked = { ...opened.worldState, tick: row.answerDueTick };
  const answered = advanced(asked, row.answerDueTick, snapshotOf(rosters));
  return { asked, row, answered };
}
/** The world at the answer, with the answering court's picture lit so the answer can sign. */
const signingWorld = (extra = {}) => warWorld({ beliefs: beliefsOf({ vScarcity: { food: 'plentiful' } }), ...extra });
/** A demand opened through the DM's verb, then answered at its due. */
function verbDemand({ world = signingWorld({ tick: 30 }), tick = 30, rosters = ROSTERS } = {}) {
  const asked = proposeThrough(world, tick, ARGS);
  if (!asked.applied) throw new Error(`the renegotiation order did not stage: ${asked.built.code}`);
  const row = pactProposalsOf(asked.applied.worldState).find((r) => r.trigger === 'renegotiation');
  const before = { ...asked.applied.worldState, tick: row.answerDueTick };
  const answered = advanced(before, row.answerDueTick, snapshotOf(rosters));
  return { asked: before, row, answered };
}
const T = () => renewal.RENEGOTIATION_TUNING;

describe('GR-5c — renegotiation from strength: a believed swing past the band demands new terms; acceptance renegotiates, refusal strains', () => {
  it('A1: the trigger is minted at its codepoint place, the tombstone carries both producers, the lens holds its empty ladder and the dial carries the word', () => {
    expect(triggers.PACT_TRIGGERS).toEqual([
      'faith_communion', 'migration_pressure', 'renegotiation', 'renewal', 'shared_threat', 'trade_demand',
    ]);
    // FPQ-33 cured: renewal's producer is the renewal leaf and renegotiation's is this wave's arm
    // of it, so every word of the vocabulary now has a producer and the two lists are equal.
    expect(triggers.PACT_TRIGGERS_PRODUCED).toEqual(triggers.PACT_TRIGGERS);
    expect(renewal.RENEGOTIATION_TRIGGER).toBe('renegotiation');
    expect(PACT_DRAFT_LENS.renegotiation, 'the demand drafts from the standing instrument, never from a lens ladder').toEqual([]);
    const clause = manifest.REALM_MANIFEST.PROPOSE_PACT.dials.find((d) => d.key === 'termType');
    expect(clause.options).toEqual([...manifest.PACT_CLAUSE_TYPES, renewal.RENEGOTIATION_TRIGGER, renewal.RENEWAL_TRIGGER]);
    // The clause list itself stays pure TERM_CATALOG vocabulary; only the dial carries the word.
    expectAbsentWithAnchor(manifest.PACT_CLAUSE_TYPES, 'renegotiation', 'resource_share', 'the clause list');
  });

  it('A2: every road the base already walked is byte-identical, hashed', () => {
    // Recorded at 57b52b510 by this same harness, before a line of GR-5c existed.
    expect(verbDigest(), 'every clause word the dial offered at the base, against the war door instrument').toBe('b93cec824f5b9e21efa985ad00cffada79e98c2fec18d9d48a68208f667ee65f');
    expect(answerDigest(), 'a trade question and an in-window renewal, answered').toBe('795315b7e9bc796bd7a7eed84790685c95588ec55a113c70531a3955c5808efb');
    expect(belowBandDigest(), 'the lit year-turn with the swing below the band').toBe('602f545d44e37a794e4afec55bdecd9f1836a0ffc4a4174cdfd5be1bff48c06a');
    expect(darkDigest(), 'the year-turn past the band with the layer absent, then false').toBe('5a390d1cb673c222be906dbe2b14c0ec07571fd5b45526504b896a656a2280a5');
  });

  it('A3: the demand opens only past the band and only from the demander OWN picture of its counterpart: never truth, never the counterpart picture, never a guess', () => {
    const world = warWorld();
    const treaty = instrumentOf(world);
    // THE SWING, read the leaf's own way: believed self less the demander's picture of the foe,
    // less the lead the war door recorded (from L's side, V's lead is L's deficit).
    const swing = renewal.renegotiationSwingOf({ worldState: world, treaty, demanderId: 'L', counterpartId: 'V', selfStrength01: STRENGTH.L });
    expect(swing).toBeCloseTo(STRENGTH.L - strengthOfBand(2) + MARGIN, 12);
    expect(swing).toBeGreaterThanOrEqual(T().DEMAND_SWING);
    // THE TWO WRONG READS WOULD NOT HAVE OPENED IT, so the demand below convicts both: V's TRUE
    // strength against the same signing, and V's OWN picture of L, each read inside the band.
    expect(STRENGTH.L - STRENGTH.V + MARGIN).toBeLessThan(T().DEMAND_SWING);
    expect(STRENGTH.L - strengthOfBand(4) + MARGIN).toBeLessThan(T().DEMAND_SWING);
    const asked = advanced(world, TURN);
    const rows = pactProposalsOf(asked.worldState);
    expect(rows.map((r) => [r.from, r.to, r.trigger, r.state, r.openedTick])).toEqual([['L', 'V', 'renegotiation', 'open', TURN]]);
    // Every clause L owes, lightened by the swing (inside the cap), keeping its own end.
    const ask = Math.min(T().ASK_CAP, swing);
    expect(rows[0].sheet.terms.map((t) => [t.type, t.magnitude, t.mintedTick, t.expiresTick]))
      .toEqual(treaty.terms.map((t) => [t.type, Math.round(t.magnitude * (1 - ask) * 10000) / 10000, TURN, t.expiresTick]));
    expect(receiptOf(asked, 'pact_renegotiation_demanded')).toMatchObject({ fromId: 'L', toId: 'V', trigger: 'renegotiation' });
    // INSIDE THE BAND: L's picture puts V one band stronger, the swing reads inside the band.
    // anchored: the same world at the same year-turn opens the row above; only L's picture moved.
    expect(pactProposalsOf(advanced(warWorld({ beliefs: beliefsOf({ lSeesV: 3 }) }), TURN).worldState)).toEqual([]);
    // NO PICTURE, NO DEMAND, even where the truth would clear the band by a distance.
    const weakTruth = (id) => ({ L: 0.6, V: 0.4 })[id] ?? 0;
    expect(0.6 - 0.4 + MARGIN, 'the truth would have opened it').toBeGreaterThan(T().DEMAND_SWING);
    const blind = advancePeacetimePacts({ snapshot: snapshotOf(), worldState: warWorld({ beliefs: beliefsOf({ lSeesV: null }) }), tick: TURN, strengthFor: weakTruth });
    // anchored: the same opener opens a row one assertion block above; the demander's missing picture is the only change.
    expect(pactProposalsOf(blind.worldState)).toEqual([]);
    expect(renewal.renegotiationSwingOf({ worldState: warWorld({ beliefs: beliefsOf({ lSeesV: null }) }), treaty, demanderId: 'L', counterpartId: 'V', selfStrength01: 0.6 })).toBe(null);
    // ONLY WHAT THE DEMANDER OWES: a clause V promised L (amended in peace, beneficiary L)
    // stays off L's sheet, and the sheet is the war clauses alone.
    const owedByV = draftPactSheet({ trigger: 'trade_demand', fromId: 'L', toId: 'V', reciprocal: false, tick: SIGN_TICK, score01: 0 }).terms;
    expect(owedByV.map((t) => t.beneficiary)).toEqual(['L']);
    const mixed = advanced(warWorld({ treaty: { ...treaty, terms: [...treaty.terms, ...owedByV] } }), TURN);
    expect(pactProposalsOf(mixed.worldState)[0].sheet.terms.map((t) => t.type)).toEqual(treaty.terms.map((t) => t.type));
    // A PEACE BETWEEN EQUALS RECORDS NO MARGIN, so it offers no swing to measure.
    const { believedMarginAtSignature: _none, ...unrecorded } = treaty;
    expect(renewal.renegotiationSwingOf({ worldState: world, treaty: unrecorded, demanderId: 'L', counterpartId: 'V', selfStrength01: 0.6 })).toBe(null);
  });

  it('A4: the court raises its own demand only on its instrument year-turn and past a band its posture colours: a timid court sits on its strength', () => {
    const world = warWorld();
    // anchored: the same world opens its demand at TURN (A3); the tick either side of the year-turn is the only change.
    for (const tick of [TURN - 1, TURN + 1]) expect(pactProposalsOf(advanced({ ...world, tick }, tick).worldState), `tick ${tick}`).toEqual([]);
    expect(pactProposalsOf(advanced({ ...world, tick: TURN + YEAR }, TURN + YEAR).worldState).map((r) => r.trigger), 'the next year-turn').toEqual(['renegotiation']);
    // THE POSTURE, read through the one bounded factor: a court with a losing memory raises its
    // bar, a winning one lowers it, and a court with none reads the plain band.
    const posture = (score) => (score === null ? null : { score });
    const factorOf = (score) => {
      const opened = advancePeacetimePacts({
        snapshot: snapshotOf(), worldState: warWorld({ dispositionStats: score === null ? undefined : { L: posture(score) } }),
        tick: TURN, strengthFor: (id) => ({ L: 0.47, V: 0.7 })[id] ?? 0,
      });
      return pactProposalsOf(opened.worldState).length;
    };
    const swing = 0.47 - strengthOfBand(2) + MARGIN;
    expect(swing).toBeGreaterThanOrEqual(T().DEMAND_SWING);
    expect([factorOf(-12), factorOf(null), factorOf(12)], 'timid sits, settled and bold demand').toEqual([0, 1, 1]);
    // Below the plain band, only the bold court's lowered bar is cleared.
    const low = (score) => pactProposalsOf(advancePeacetimePacts({
      snapshot: snapshotOf(), worldState: warWorld({ dispositionStats: score === null ? undefined : { L: posture(score) } }),
      tick: TURN, strengthFor: (id) => ({ L: 0.42, V: 0.7 })[id] ?? 0,
    }).worldState).length;
    expect(0.42 - strengthOfBand(2) + MARGIN).toBeLessThan(T().DEMAND_SWING);
    expect([low(-12), low(null), low(12)], 'only the bold court demands below the plain band').toEqual([0, 0, 1]);
  });

  it('A5: the ask never exceeds the cap: a swing past the cap drafts AT the cap, and a swing inside it asks back the swing itself', () => {
    const treaty = instrumentOf(warWorld());
    const sheetAt = (own) => {
      const opened = advancePeacetimePacts({ snapshot: snapshotOf(), worldState: warWorld(), tick: TURN, strengthFor: (id) => ({ L: own, V: 0.7 })[id] ?? 0 });
      return { terms: pactProposalsOf(opened.worldState)[0].sheet.terms, receipt: receiptOf(opened, 'pact_renegotiation_demanded') };
    };
    const lightened = (ask) => treaty.terms.map((t) => [t.type, Math.round(t.magnitude * (1 - ask) * 10000) / 10000]);
    // PAST THE CAP: L believes itself far ahead of where it signed.
    const strong = sheetAt(0.9);
    expect(0.9 - strengthOfBand(2) + MARGIN).toBeGreaterThan(T().ASK_CAP);
    expect(strong.terms.map((t) => [t.type, t.magnitude])).toEqual(lightened(T().ASK_CAP));
    expect(strong.receipt.ask01).toBe(T().ASK_CAP);
    // INSIDE THE CAP, over a sweep of swings: the ask is the swing, to the receipt's own rounding.
    for (const own of [0.46, 0.55, 0.6, 0.65]) {
      const swing = own - strengthOfBand(2) + MARGIN;
      expect(swing, `own ${own}`).toBeLessThan(T().ASK_CAP);
      const { terms, receipt } = sheetAt(own);
      expect(receipt.ask01, `own ${own}`).toBeCloseTo(swing, 4);
      expect(terms.map((t) => [t.type, t.magnitude]), `own ${own}`).toEqual(lightened(swing));
    }
  });

  it('A6: an accepted demand is a renegotiated lineage act through amendPactInstrument at the same pair key: the owed clauses lighter on their own end, the new holders sworn through isOffStage', () => {
    const spy = /** @type {import('vitest').Mock} */ (/** @type {unknown} */ (amendment.amendPactInstrument));
    const world = signingWorld({ tick: 30 });
    const before = instrumentOf(world);
    spy.mockClear();
    const { row, answered } = verbDemand({ world });
    const due = row.answerDueTick;
    expect(receiptOf(answered, 'pact_renegotiated')?.ending).toBe('signed');
    expect(spy.mock.calls.map(([input]) => input.act), 'the ONE amendment writer, called with the renegotiation act').toEqual(['renegotiated']);
    const after = instrumentOf(answered.worldState);
    expect(keysOf(answered.worldState), 'the same instrument at the same key, never a re-mint').toEqual(keysOf(world));
    const ask = Math.min(T().ASK_CAP, OWN() - strengthOfBand(2) + MARGIN);
    expect(after.terms.map((t) => [t.type, t.magnitude, t.mintedTick, t.expiresTick]))
      .toEqual(before.terms.map((t) => [t.type, Math.round(t.magnitude * (1 - ask) * 10000) / 10000, due, t.expiresTick]));
    expect(after.lineage).toEqual([
      ...amendment.lineageOf(before),
      { act: 'renegotiated', tick: due, termIds: after.terms.map((t) => amendment.termIdOf(t)).sort() },
    ]);
    expect([after.believedMarginAtSignature, after.victorId, after.loserId, Object.hasOwn(after, 'provenance')], 'the signing and the parties are untouched').toEqual([MARGIN, 'V', 'L', false]);
    expect(after.sworn).toEqual({
      L: { npcId: 'npc_l1', name: 'Lorn Ashe', swornTick: due },
      V: { npcId: 'npc_v1', name: 'Varo Keel', swornTick: due },
    });
    // The codepoint-first holder of L is exiled: the cast skips him.
    const moved = { ...ROSTERS, L: [npc('npc_l1', 'Lorn Ashe', 'L seat', { status: 'exiled' }), ROSTERS.L[1]] };
    expect(instrumentOf(verbDemand({ rosters: moved }).answered.worldState).sworn.L).toEqual({ npcId: 'npc_l2', name: 'Ilsa Brand', swornTick: due });
    // anchored: A3 pins the renegotiation row open before this answer, so its absence here is the settle-and-prune.
    expect(pactProposalsOf(answered.worldState).filter((r) => r.trigger === 'renegotiation')).toEqual([]);
  });

  it('A7: a refused demand leaves the treaty standing and puts exactly one strain fact on the demander, through the strain idiom, for both refusing verdicts; no casus and no pact memory', () => {
    const settle = (world) => {
      const { asked, answered } = verbDemand({ world });
      return { asked, answered };
    };
    const without = (world) => {
      const { pactProposals: _q, ...ledgers } = world.spatialLedgers || {};
      const { relationshipStates: _r, ...rest } = world;
      return JSON.stringify({ ...rest, spatialLedgers: ledgers });
    };
    for (const [label, world, ending] of [
      ['no overlap', warWorld({ tick: 30 }), 'no_overlap'],
      ['refused', signingWorld({ tick: 30, relationship: { dependency: 1, leverage: 0 } }), 'refused'],
    ]) {
      const { asked, answered } = settle(world);
      expect(receiptOf(answered, 'pact_renegotiation_refused')?.ending, label).toBe(ending);
      // THE TREATY STANDS, AND NOTHING BUT THE PAIR'S RECORD AND THE SETTLED ROW MOVED.
      expect(instrumentOf(answered.worldState), label).toEqual(instrumentOf(asked));
      expect(without(answered.worldState), `${label}: no casus, no ledger, nothing else`).toBe(without(asked));
      const was = rel(asked);
      const now = rel(answered.worldState);
      const strains = (now.recentIncidents || []).filter((incident) => incident.type === 'tribute_strain');
      expect(strains.map((incident) => incident.tick), `${label}: exactly one strain fact`).toEqual([pactProposalsOf(asked)[0].answerDueTick]);
      // The idiom's own increment: a year's strain rate over the treaty's clock, times the relief
      // the refused sheet carried (read off the sheet against the clause it would have replaced).
      const [first] = pactProposalsOf(asked)[0].sheet.terms;
      const held = instrumentOf(asked).terms.find((t) => t.type === first.type);
      expect(1 - first.magnitude / held.magnitude, `${label}: the sheet carried the swing, inside the cap`).toBeCloseTo(Math.min(T().ASK_CAP, OWN() - strengthOfBand(2) + MARGIN), 3);
      expect(now.resentment - was.resentment, label).toBeCloseTo((PEACE_TERMS_TUNING.STRAIN_RESENTMENT_PER_YEAR / YEAR) * (1 - first.magnitude / held.magnitude), 12);
      // …and NOT the pact grammar's refusal memory: no trust delta, no pact_refused turning point.
      expect([now.trust, (now.turningPoints || []).map((point) => point.kind)], label).toEqual([was.trust, []]);
    }
    // NO EDGE, NO FACT: without a real graph edge between the pair the idiom writes nothing.
    const { asked } = settle(warWorld({ tick: 30 }));
    const row = pactProposalsOf(asked)[0];
    const edgeless = advancePeacetimePacts({ snapshot: { ...snapshotOf(), regionalGraph: { edges: [] } }, worldState: { ...asked, tick: row.answerDueTick }, tick: row.answerDueTick, strengthFor });
    expect(rel(edgeless.worldState), 'never a synthesized key').toEqual(rel(asked));
  });

  it('A8: the lineage act is growth, a war closes what was renegotiated, and an instrument is renegotiated once: no second demand spends the same swing', () => {
    expect(amendment.PACT_LINEAGE_ACTS).toEqual(['amended', 'broken_by_war', 'disavowed_by_succession', 'formed', 'renegotiated', 'renewed', 'war_ended']);
    const bare = { parties: ['A', 'B'], mintedTick: 0, terms: [] };
    expect(amendment.appendLineage(bare, { act: 'renegotiated', tick: 5 }).lineage.map((entry) => entry.act)).toEqual(['formed', 'renegotiated']);
    const { answered } = verbDemand();
    const renegotiated = answered.worldState;
    // A war between the pair closes the clauses they renegotiated in peace.
    const atWar = { ...renegotiated, relationshipStates: { [relKey('L', 'V')]: { relationshipType: 'hostile', trust: 0.1 } } };
    const closure = amendment.closeTermsBrokenByWar({ worldState: atWar, aId: 'L', bId: 'V', tick: 200 });
    expect(closure.closed).toEqual(instrumentOf(renegotiated).terms.map((t) => amendment.termIdOf(t)).sort());
    // ONCE: the renegotiated instrument, set back into the fixture's quiet world (no question
    // standing, the same pictures that opened A3's demand), raises no demand at the next
    // year-turn, the verb refuses before the queue, and the counterparty list is empty.
    const nextTurn = warWorld({ treaty: instrumentOf(renegotiated), tick: TURN + YEAR });
    // anchored: the same court at the same year-turn demands in A3; the renegotiated act on the lineage is the only change.
    expect(pactProposalsOf(advanced(nextTurn, TURN + YEAR).worldState)).toEqual([]);
    expect(proposeThrough(nextTurn, TURN + YEAR, ARGS).built.code).toBe('invalid_term_sheet');
    expect(renewal.renegotiationCounterpartiesFor(nextTurn, ['L', 'V'], 'L', TURN + YEAR, 0.9)).toEqual([]);
  });

  it('A9: renegotiationOpen answers true with its subjects past the band, and false with no subjects when dark, inside the band, blind, already renegotiated or with a question standing', () => {
    const { renegotiationOpen } = renewal.RENEGOTIATION_WORLD_CONDITIONS;
    const campaign = (world) => ({ settlementIds: ['L', 'V'], worldState: world });
    const cardOf = (id) => snapshotOf().settlements.find((item) => item.id === id)?.settlement ?? { id };
    const answer = (world, id = 'L') => [renegotiationOpen.predicate(cardOf(id), campaign(world)), renegotiationOpen.subjects(cardOf(id), campaign(world))];
    expect(OWN() - strengthOfBand(2) + MARGIN).toBeGreaterThanOrEqual(T().DEMAND_SWING);
    expect(answer(warWorld())).toEqual([true, ['V']]);
    expect(answer(warWorld(), 'V'), 'the victor owes nothing on a war door instrument').toEqual([false, []]);
    expect(answer(warWorld({ rules: { oathHolderEnabled: true } })), 'the layer dark').toEqual([false, []]);
    expect(answer(warWorld({ beliefs: beliefsOf({ lSeesV: 4 }) })), 'inside the band').toEqual([false, []]);
    expect(answer(warWorld({ beliefs: beliefsOf({ lSeesV: null }) })), 'no picture of the counterpart').toEqual([false, []]);
    expect(answer(warWorld({ treaty: instrumentOf(verbDemand().answered.worldState) })), 'already renegotiated').toEqual([false, []]);
    expect(answer(proposeThrough(warWorld({ tick: 30 }), 30, ARGS).applied.worldState), 'a question already stands').toEqual([false, []]);
    expect(answer(warWorld(), 'Z'), 'a court outside the campaign').toEqual([false, []]);
    expect(renegotiationOpen.source).toBe('live');
    for (const reader of renegotiationOpen.readers) expect(typeof renewal[reader.symbol], reader.symbol).toBe('function');
  });

  it('A10: the DM verb opens the demand with the renegotiation word past the band, refuses it before the queue inside the band, and approval refuses with the world untouched', () => {
    const world = warWorld({ tick: 30 });
    const { built, applied } = proposeThrough(world, 30, ARGS);
    expect([built.ok, applied?.refusal ?? null]).toEqual([true, null]);
    const [row] = pactProposalsOf(applied.worldState);
    expect([row.from, row.to, row.trigger, row.state]).toEqual(['L', 'V', 'renegotiation', 'open']);
    expect(row.sheet.terms, 'the sheet is the leaf own draft, never re-spelled')
      .toEqual(renewal.renewalClauseSheet({ worldState: world, termType: 'renegotiation', fromId: 'L', toId: 'V', tick: 30, snapshot: snapshotOf() }).terms);
    const inside = warWorld({ tick: 30, beliefs: beliefsOf({ lSeesV: 4 }) });
    const staged = proposeThrough(inside, 30, ARGS);
    expect([staged.built.ok, staged.built.code, staged.applied]).toEqual([false, 'invalid_term_sheet', null]);
    const before = JSON.stringify(inside);
    const outcome = { proposalPayload: { kind: 'realm_verb_order', verb: 'PROPOSE_PACT', args: { ...ARGS } } };
    const armed = applyRealmVerbOrder({ state: inside, snapshot: { settlements: snapshotOf().settlements }, settlementUpdates: new Map(), outcome, tick: 30, now: null });
    expect(armed.refusal?.code).toBe('invalid_term_sheet');
    expect(JSON.stringify(armed.worldState)).toBe(before);
    // The victor has nothing to ask back: the verb refuses the word for it too.
    expect(proposeThrough(world, 30, { ...ARGS, fromId: 'V', toId: 'L' }).built.code).toBe('invalid_term_sheet');
  });

  it('A11: the two bands are DRAFT rows in their units, measured against the real drivers: the belief quantizer, the strength derivation and the war door drafter', () => {
    const register = JSON.parse(readFileSync(join(ROOT, 'tests/lint/.tuning-register.json'), 'utf8'));
    const row = register.tables['src/domain/worldPulse/pactRenewal.js#RENEGOTIATION_TUNING'];
    expect([row?.status, row?.unit, row?.band, row?.signedAt]).toEqual(['draft', { ASK_CAP: 'fraction01', DEMAND_SWING: 'fraction01' }, null, null]);
    // THE DEMAND BAND'S FLOOR: the swing two FRESH pictures read on the signing day, across
    // every pair of truths the war door would sign at, from the belief map's own quantizer.
    let signingDay = 0;
    for (let i = 0; i <= 100; i += 1) {
      for (let j = 0; j <= 100; j += 1) {
        const margin = i / 100 - strengthOfBand(strengthBandOf(j / 100));
        if (termBudgetFor(margin).whitePeace) continue;
        signingDay = Math.max(signingDay, j / 100 - strengthOfBand(strengthBandOf(i / 100)) + margin);
      }
    }
    expect(signingDay, 'no instrument is demandable on the day it is signed').toBeLessThan(T().DEMAND_SWING);
    // …AND ITS CEILING: the swing a court's recovery from a war's pressure produces, read off
    // the estate's one strength derivation over the tiers, sizes and pressures a war leaves.
    const recoveries = [];
    for (const tier of ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis']) {
      for (const population of [80, 400, 1500, 6000, 25000]) {
        for (const conflict of [0.3, 0.6, 0.9]) {
          for (const exhaustion of [0, 0.5]) {
            const war = { settlement: { tier, population, activeConditions: exhaustion ? [{ archetype: 'war_exhaustion', severity: exhaustion }] : [] } };
            const peace = { settlement: { tier, population, activeConditions: [] } };
            recoveries.push(settlementStrength(peace, {}) - settlementStrength(war, { conflict, economy: conflict / 2, trade: conflict / 2, legitimacy: conflict / 3 }));
          }
        }
      }
    }
    recoveries.sort((a, b) => a - b);
    const median = recoveries[Math.floor(recoveries.length / 2)];
    expect(T().DEMAND_SWING, 'a typical recovery reaches the band').toBeLessThanOrEqual(median);
    // THE CAP: no typical recovery's ask is capped, and a crushing victory's terms are never
    // halved past what the war door itself would draft at believed parity.
    expect(T().ASK_CAP).toBeGreaterThanOrEqual(median);
    const crushing = draftTerms({ ranked: [{ termType: 'tribute', value: 1 }], budget: 3, margin01: 1, press: 1, tick: 0 }).terms[0].magnitude;
    const parity = draftTerms({ ranked: [{ termType: 'tribute', value: 1 }], budget: 3, margin01: 0, press: 1, tick: 0 }).terms[0].magnitude;
    expect(T().ASK_CAP, 'below the war door own relief at parity from a crushing victory').toBeLessThan(1 - parity / crushing);
  });

  it('A12: dark means byte-identical: with treatyRenewalEnabled absent or false the leaf answers nothing, and absent equals false', () => {
    const runs = [undefined, false].map((flag) => {
      const rules = flag === undefined ? { oathHolderEnabled: true } : { oathHolderEnabled: true, treatyRenewalEnabled: flag };
      const world = warWorld({ rules, tick: 30 });
      const opened = openPactProposal({ worldState: world, from: 'L', to: 'V', trigger: 'renegotiation', sheet: { terms: instrumentOf(world).terms }, tick: 30 });
      const answer = { verdict: 'refused', receipt: '', offer01: 0, reserve01: 1 };
      const demands = renewal.openRenegotiationDemands({ worldState: world, ids: ['L', 'V'], strengthFor, tick: TURN });
      return {
        same: demands.worldState === world,
        receipts: demands.receipts,
        sheet: renewal.renewalClauseSheet({ worldState: world, termType: 'renegotiation', fromId: 'L', toId: 'V', tick: 30, snapshot: snapshotOf() }),
        settled: renewal.settleRenewalProposal({ worldState: opened.worldState, proposal: opened.proposal, answer, tick: 40, snapshot: snapshotOf() }),
        counterparties: renewal.renegotiationCounterpartiesFor(world, ['L', 'V'], 'L', TURN, 0.9),
        staged: proposeThrough(world, 30, ARGS).built.code,
      };
    });
    expect(runs[0]).toEqual({ same: true, receipts: [], sheet: { trigger: 'renegotiation', terms: [] }, settled: null, counterparties: [], staged: 'invalid_term_sheet' });
    // THE CALL PATH: dark, the court's own opener never reaches the posture read at all; lit, it does.
    const spy = /** @type {import('vitest').Mock} */ (/** @type {unknown} */ (posture.courtPostureOf));
    spy.mockClear();
    renewal.openRenegotiationDemands({ worldState: warWorld({ rules: { oathHolderEnabled: true } }), ids: ['L', 'V'], strengthFor, tick: TURN });
    expect(spy.mock.calls.length, 'dark: the posture read is never reached').toBe(0);
    renewal.openRenegotiationDemands({ worldState: warWorld(), ids: ['L', 'V'], strengthFor, tick: TURN });
    expect(spy.mock.calls.length, 'lit: the spy is wired to the real read').toBeGreaterThan(0);
    expect(JSON.stringify(runs[1]), 'false behaves exactly as absent').toBe(JSON.stringify(runs[0]));
    // anchored: the lit leaf settles a renegotiation row (A6, A7), so null above is the gate alone.
    expect(renewal.settleRenewalProposal({
      worldState: warWorld(), proposal: { trigger: 'trade_demand', id: 'x', from: 'L', to: 'V' },
      answer: { verdict: 'signed', receipt: '', offer01: 1, reserve01: 0 }, tick: 60,
    })).toBe(null);
  });

  it('A13: lifecycle: a renegotiated record JSON round-trips with its memory, a legacy instrument keeps the clauses it was made with, and one that ran out before the answer closes the question with no strain', () => {
    const remembered = signingWorld({ tick: 30 });
    const key = keysOf(remembered)[0];
    const strained = { ...remembered, spatialLedgers: { ...remembered.spatialLedgers, treaties: { [key]: { ...instrumentOf(remembered), worstObservedEver: 'strained' } } } };
    const renegotiated = instrumentOf(verbDemand({ world: strained }).answered.worldState);
    expect([renegotiated.worstObservedEver, renegotiated.lineage.map((entry) => entry.act)]).toEqual(['strained', ['formed', 'renegotiated']]);
    expect(JSON.parse(JSON.stringify(renegotiated))).toEqual(renegotiated);
    // A LEGACY record (no lineage key): its implied act is written from the record AS IT STOOD.
    const legacy = instrumentOf(remembered);
    const legacyRenegotiated = instrumentOf(verbDemand({ world: remembered }).answered.worldState);
    expect(legacyRenegotiated.lineage[0]).toEqual({ act: 'formed', tick: SIGN_TICK, termIds: legacy.terms.map((t) => amendment.termIdOf(t)).sort() });
    // RAN OUT BEFORE THE ANSWER: asked in the instrument's last weeks, answered after its end.
    const ends = Math.max(...legacy.terms.map((t) => t.expiresTick));
    const late = warWorld({ tick: ends - 2 });
    const asked = proposeThrough(late, ends - 2, ARGS).applied.worldState;
    const [row] = pactProposalsOf(asked);
    expect(row.answerDueTick).toBeGreaterThan(ends);
    const expired = advancePeacetimePacts({ snapshot: snapshotOf(), worldState: { ...asked, tick: row.answerDueTick }, tick: row.answerDueTick, strengthFor });
    expect(receiptOf(expired, 'pact_renegotiation_lapsed')?.ending).toBe('expired_unanswered');
    expect(expired.worldState.relationshipStates, 'nobody is strained for an instrument that ran out').toEqual(asked.relationshipStates);
    // A SIGNED ANSWER WITH NOTHING LEFT TO LIGHTEN: the sheet's clauses spent while the instrument
    // still binds. The question closes expired, the treaty is untouched, and nobody is strained.
    const binding = warWorld({ tick: 30 });
    const spentSheet = instrumentOf(binding).terms.map((t) => ({ ...t, mintedTick: 29, expiresTick: 30 }));
    const spent = openPactProposal({ worldState: binding, from: 'L', to: 'V', trigger: 'renegotiation', sheet: { terms: spentSheet }, tick: 30 });
    const settled = renewal.settleRenewalProposal({
      worldState: spent.worldState, proposal: spent.proposal,
      answer: { verdict: 'signed', receipt: '', offer01: 1, reserve01: 0 }, tick: 31, snapshot: snapshotOf(),
    });
    expect([settled.receipt.kind, settled.receipt.ending, settled.ledger]).toEqual(['pact_renegotiation_lapsed', 'expired_unanswered', null]);
    expect(settled.worldState.relationshipStates, 'a signed question is never strained').toEqual(spent.worldState.relationshipStates);
  });
});
