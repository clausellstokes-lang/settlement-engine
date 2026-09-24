/**
 * tests/domain/pactRenewalGr5b.test.js — GR-5b: THE RENEWAL WINDOW (lane FP-B3; the brief
 * BUILD-FP-B3-gr5b.md as ruled by the chair's FP-15, 2026-09-24).
 *
 * A treaty inside its window renews through the pact verb, the tick's one answer step and
 * `amendPactInstrument` with the lineage act `renewed`, at the same pair key, and the new
 * holders swear; a refused renewal lapses CLEAN. The renewal's logic lives in ONE leaf
 * (`pactRenewal.js`); the verb and the answer step carry a fold call each, and every other
 * road through them is pinned BYTE-IDENTICAL to the base by digest (A2).
 *
 * The standing instrument every arm renews is signed through the REAL formation door
 * (`signPactProposal`) at SIGN_TICK, so its clauses, lineage, provenance and signature are
 * the estate's own, never a hand-built record.
 *
 * The new symbols are read through NAMESPACE imports on purpose, so the red-first plant of
 * the pre-change sources (with an empty leaf in place of the new one) reds each arm by title
 * instead of failing the file at link time.
 */
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it, vi } from 'vitest';

import * as manifest from '../../src/domain/events/realmManifest.js';
import * as renewal from '../../src/domain/worldPulse/pactRenewal.js';
import * as amendment from '../../src/domain/worldPulse/pactAmendment.js';
import { applyRealmVerbOrder, buildRealmVerbOutcome } from '../../src/domain/worldPulse/realmVerbExecution.js';
import {
  PACT_DRAFT_LENS, advancePeacetimePacts, draftPactSheet, signPactProposal,
} from '../../src/domain/worldPulse/pactFormation.js';
import { answerDueTickFor, openPactProposal, pactProposalsOf } from '../../src/domain/worldPulse/pactProposals.js';
import { treatyLedgerOf } from '../../src/domain/worldPulse/treatyEnforcement.js';
import { oathHolderOf } from '../../src/domain/worldPulse/oathHolder.js';
import { TERM_CATALOG } from '../../src/domain/worldPulse/peaceTermsCatalog.js';
import { draftTerms } from '../../src/domain/worldPulse/peaceTermsDrafting.js';
import { CURRENT_TREATY_TICKS_PER_YEAR } from '../../src/domain/worldPulse/treatyClock.js';
import { buildSpatialDigest } from '../../src/domain/spatial/index.js';
import { hopWeeks } from '../../src/domain/spatial/distanceRead.js';
import { makeGridPack, placeSettlements } from '../fixtures/spatialPackFixtures.js';
import { A_ECONOMY, B_ECONOMY, pactWorld, relKey } from '../helpers/pactFixture.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

// The ONE amendment writer, wrapped so an arm can see the act it is called with (the real
// body still runs).
vi.mock('../../src/domain/worldPulse/pactAmendment.js', async (importOriginal) => {
  const actual = /** @type {Record<string, any>} */ (await importOriginal());
  return { ...actual, amendPactInstrument: vi.fn(actual.amendPactInstrument) };
});

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

// ── THE IDENTITY HARNESS, verbatim from the base measurement (0fd6b9209) ──────────────────
const sha = (value) => createHash('sha256').update(JSON.stringify(value)).digest('hex');
const SIGN_TICK = 0;
const IN_WINDOW = 188;
const npc = (id, name, seat, extra = {}) => ({ id, name, factionAffiliation: seat, role: 'official', ...extra });
const ROSTERS = Object.freeze({
  A: [npc('npc_a1', 'Aldric Thorne', 'A seat'), npc('npc_a2', 'Merek Vance', 'A seat')],
  B: [npc('npc_b1', 'Bregan Holt', 'B seat'), npc('npc_b2', 'Sela Crane', 'B seat')],
});
const court = (id, economicState, roster) => ({
  id, name: id,
  settlement: {
    id, name: id, economicState: { ...economicState },
    powerStructure: { publicLegitimacy: { score: 60, label: 'Stable' }, factions: [{ faction: `${id} seat`, category: 'military', power: 78, isGoverning: true }], conflicts: [] },
    npcs: roster.map((row) => ({ ...row })),
  },
});
// THE PAIR'S EDGE (FPQ-35): the pact stage finds the relationship record `pactWorld` writes only
// through the edge that joins A and B, so the edge the fixture's record key belongs to is declared.
const snapshotOf = (rosters = ROSTERS) => ({
  settlements: [court('A', A_ECONOMY, rosters.A), court('B', B_ECONOMY, rosters.B)],
  regionalGraph: { edges: [{ from: 'A', to: 'B' }] },
});
const settlementOfIn = (snapshot) => (id) => snapshot.settlements.find((item) => item.id === id)?.settlement ?? null;
/** The standing instrument, signed through the REAL formation door at SIGN_TICK. */
function standingWorld({ rules = { treatyRenewalEnabled: true, oathHolderEnabled: true }, beliefs, relationship, tick = IN_WINDOW } = {}) {
  const snapshot = snapshotOf();
  const world = pactWorld({ flag: true, rules, beliefs, relationship });
  const sheet = draftPactSheet({ trigger: 'trade_demand', fromId: 'A', toId: 'B', reciprocal: true, tick: SIGN_TICK, score01: 0 });
  const signed = signPactProposal({
    worldState: world, proposal: { from: 'A', to: 'B', trigger: 'trade_demand', sheet: { terms: sheet.terms } },
    tick: SIGN_TICK, settlementOf: settlementOfIn(snapshot),
  });
  return { ...signed.worldState, tick };
}
const standingTerms = (world) => Object.values(treatyLedgerOf(world) || {})[0].terms;
const reissuedAt = (terms, tick) => terms.map((term) => ({ ...term, mintedTick: tick, expiresTick: tick + (term.expiresTick - term.mintedTick) }));
function openRow(world, trigger, terms, tick = IN_WINDOW) {
  return openPactProposal({ worldState: world, from: 'A', to: 'B', trigger, sheet: { terms }, tick }).worldState;
}
const advanced = (world, tick) => advancePeacetimePacts({ snapshot: snapshotOf(), worldState: world, tick });
const outcomeOf = (r) => ({ worldState: r.worldState, receipts: r.receipts, changed: r.changed, newsEntries: r.newsEntries });
/** Every clause the dial offered at the base, staged and approved through the realm lane. */
function verbDigest() {
  const rows = manifest.PACT_CLAUSE_TYPES.map((termType) => {
    const world = standingWorld();
    const snapshot = { settlements: snapshotOf().settlements };
    const built = buildRealmVerbOutcome({ verb: 'PROPOSE_PACT', args: { fromId: 'A', toId: 'B', termType }, worldState: world, snapshot, tick: IN_WINDOW });
    const applied = built.ok ? applyRealmVerbOrder({ state: world, snapshot, settlementUpdates: new Map(), outcome: built.outcome, tick: IN_WINDOW, now: null }) : null;
    return { termType, built, applied };
  });
  return sha(rows);
}
/** The tick's answer on every non-renewal road: the stacking re-offer, a refusal with memory, an organic mint. */
function tickDigest() {
  const stacked = standingWorld();
  const reoffer = advanced(openRow(stacked, 'trade_demand', reissuedAt(standingTerms(stacked), IN_WINDOW)), IN_WINDOW + 4);
  const cold = standingWorld({ beliefs: null });
  const refusal = advanced(openRow(cold, 'trade_demand', reissuedAt(standingTerms(cold), IN_WINDOW)), IN_WINDOW + 4);
  const fresh = pactWorld({ flag: true, rules: { treatyRenewalEnabled: true } });
  const opened = advanced({ ...fresh, tick: 10 }, 10);
  const minted = advanced(opened.worldState, 14);
  return sha([outcomeOf(reoffer), outcomeOf(refusal), outcomeOf(opened), outcomeOf(minted)]);
}
/** A renewal row in a world whose renewal layer is dark (absent, then false). */
function darkDigest() {
  return sha([undefined, false].map((flag) => {
    const rules = flag === undefined ? { oathHolderEnabled: true } : { oathHolderEnabled: true, treatyRenewalEnabled: flag };
    const world = standingWorld({ rules });
    return outcomeOf(advanced(openRow(world, 'renewal', reissuedAt(standingTerms(world), IN_WINDOW)), IN_WINDOW + 4));
  }));
}
// ── end of the identity harness ─────────────────────────────────────────────────────────────

/** The answer's own dwell for an unmeasured pair: derived from the writer, never restated. */
const DUE = answerDueTickFor({ digest: null, fromId: 'A', toId: 'B', tick: IN_WINDOW }).answerDueTick;
/** The standing clauses' span, the drafter's own. */
const SPAN = (() => {
  const [term] = draftPactSheet({ trigger: 'trade_demand', fromId: 'A', toId: 'B', reciprocal: true, tick: SIGN_TICK, score01: 0 }).terms;
  return term.expiresTick - term.mintedTick;
})();
/** The last tick of the standing instrument's life, and the window's own boundary ticks. */
const ENDS = SIGN_TICK + SPAN;
const WINDOW = () => renewal.RENEWAL_WINDOW_TUNING.WINDOW_WEEKS;
const instrumentOf = (world) => Object.values(treatyLedgerOf(world) || {})[0];
const keysOf = (world) => Object.keys(treatyLedgerOf(world) || {});
const ARGS = Object.freeze({ fromId: 'A', toId: 'B', termType: 'renewal' });

/** Stage the order through the lane's pure mint, then apply it through the arm dispatcher. */
function proposeThrough(world, tick, args = ARGS) {
  const snapshot = { settlements: snapshotOf().settlements };
  const built = buildRealmVerbOutcome({ verb: 'PROPOSE_PACT', args, worldState: world, snapshot, tick });
  const applied = built.ok
    ? applyRealmVerbOrder({ state: world, snapshot, settlementUpdates: new Map(), outcome: built.outcome, tick, now: null })
    : null;
  return { built, applied };
}

/** A renewal asked through the verb at IN_WINDOW and answered by the tick's one answer step at DUE. */
function renewThroughVerb({ world = standingWorld(), rosters = ROSTERS } = {}) {
  const asked = proposeThrough(world, IN_WINDOW);
  if (!asked.applied) throw new Error(`the renewal order did not stage: ${asked.built.code}`);
  const answered = advancePeacetimePacts({ snapshot: snapshotOf(rosters), worldState: asked.applied.worldState, tick: DUE });
  return { asked: asked.applied.worldState, answered };
}

const receiptOf = (result, kind) => result.receipts.find((row) => row.kind === kind);
const withoutProposals = (world) => {
  const { pactProposals: _settled, ...ledgers } = world.spatialLedgers || {};
  return JSON.stringify({ ...world, spatialLedgers: ledgers });
};

describe('GR-5b — the renewal window: a treaty inside its window renews through the pact verb; a refused renewal lapses clean', () => {
  it('A1: the renewal word joins the EXISTING clause dial, and the verb opens a renewal row that re-offers the standing clauses (P1)', () => {
    const row = manifest.REALM_MANIFEST.PROPOSE_PACT;
    expect(row.dials.map((d) => d.key), 'no fourth dial').toEqual(['fromId', 'toId', 'termType']);
    const clause = row.dials.find((d) => d.key === 'termType');
    expect(clause.options).toEqual([...manifest.PACT_CLAUSE_TYPES, renewal.RENEWAL_TRIGGER]);
    expect(renewal.RENEWAL_TRIGGER).toBe('renewal');
    // The clause list itself stays pure TERM_CATALOG vocabulary; only the dial carries the word.
    expectAbsentWithAnchor(manifest.PACT_CLAUSE_TYPES, 'renewal', 'resource_share', 'the clause list');
    expect(PACT_DRAFT_LENS.renewal, 'the renewal ladder is still the empty one the dial resolves around').toEqual([]);
    const world = standingWorld();
    const { built, applied } = proposeThrough(world, IN_WINDOW);
    expect([built.ok, applied?.refusal ?? null]).toEqual([true, null]);
    const rows = pactProposalsOf(applied.worldState);
    expect(rows.map((r) => [r.from, r.to, r.trigger, r.state, r.openedTick, r.answerDueTick]))
      .toEqual([['A', 'B', 'renewal', 'open', IN_WINDOW, DUE]]);
    expect(rows[0].sheet.terms, 'the sheet is the leaf own renewal draft, never re-spelled')
      .toEqual(renewal.draftRenewalSheet(instrumentOf(world), IN_WINDOW));
    expect(rows[0].sheet.terms.map((t) => [t.type, t.beneficiary, t.mintedTick, t.expiresTick]))
      .toEqual(instrumentOf(world).terms.map((t) => [t.type, t.beneficiary, IN_WINDOW, IN_WINDOW + SPAN]));
  });

  it('A2: every non-renewal road through the verb and the answer step is byte-identical to the base, hashed', () => {
    // Recorded at 0fd6b9209 by this same harness, before a line of GR-5b existed.
    expect(verbDigest(), 'every clause the dial offered at the base, staged and approved').toBe('1c490fa6679d1af95b2166e1f6abebcd3d4e31c78d64ef2a4af006133b3bc14e');
    expect(tickDigest(), 'the stacking re-offer, the refusal with memory, the organic mint').toBe('f5c54332723e617f3df1191857ebe197a588d63c7710edcfb33500bb815b352f');
    expect(darkDigest(), 'a renewal row in a world whose renewal layer is absent, then false').toBe('983f4ed91f8cf803f7b9e5cf1fcf516778865777101f199fef3183ac078e6ae5');
  });

  it('A3: a treaty inside the window renews through the verb, the answer step and amendPactInstrument with the lineage act renewed, at the same pair key', () => {
    const spy = /** @type {import('vitest').Mock} */ (/** @type {unknown} */ (amendment.amendPactInstrument));
    const world = standingWorld();
    const before = instrumentOf(world);
    spy.mockClear();
    const { answered } = renewThroughVerb({ world });
    expect(spy.mock.calls.map(([input]) => input.act), 'the ONE amendment writer, called with the renewal act').toEqual(['renewed']);
    const after = instrumentOf(answered.worldState);
    expect(keysOf(answered.worldState), 'the same instrument at the same key, never a re-mint').toEqual(keysOf(world));
    expect(after.lineage).toEqual([
      ...before.lineage,
      { act: 'renewed', tick: DUE, termIds: before.terms.map((t) => `${t.type}.${t.beneficiary}.${DUE}`).sort() },
    ]);
    // The superseded clauses closed; the same clauses run again from the signing on their own span.
    expect(after.terms.map((t) => [t.type, t.beneficiary, t.mintedTick, t.expiresTick]))
      .toEqual(before.terms.map((t) => [t.type, t.beneficiary, DUE, DUE + SPAN]));
    expect(after.provenance, 'provenance records how the instrument BEGAN').toBe(before.provenance);
    const renewed = receiptOf(answered, 'pact_renewed');
    expect([renewed.ending, renewed.superseded, renewed.renewed]).toEqual([
      'signed', before.terms.map((t) => amendment.termIdOf(t)).sort(), after.terms.map((t) => amendment.termIdOf(t)).sort(),
    ]);
    // anchored: the renewal row is pinned OPEN in A1 before this answer, so its absence here is the settle-and-prune.
    expect(pactProposalsOf(answered.worldState).filter((r) => r.trigger === 'renewal')).toEqual([]);
  });

  it('A4: the new holders swear at the renewal: GR-1 re-stamps at the act through isOffStage, and a dead or off-stage holder never swears', () => {
    const before = instrumentOf(standingWorld());
    expect(before.sworn).toEqual({
      A: { npcId: 'npc_a1', name: 'Aldric Thorne', swornTick: SIGN_TICK },
      B: { npcId: 'npc_b1', name: 'Bregan Holt', swornTick: SIGN_TICK },
    });
    // The same holders still sit: the new oath is theirs, sworn at the signing.
    expect(instrumentOf(renewThroughVerb().answered.worldState).sworn).toEqual({
      A: { npcId: 'npc_a1', name: 'Aldric Thorne', swornTick: DUE },
      B: { npcId: 'npc_b1', name: 'Bregan Holt', swornTick: DUE },
    });
    // The codepoint-first holder of A is exiled and of B is dead: the cast skips both.
    const moved = {
      A: [npc('npc_a1', 'Aldric Thorne', 'A seat', { status: 'exiled' }), ROSTERS.A[1]],
      B: [npc('npc_b1', 'Bregan Holt', 'B seat', { status: 'dead' }), ROSTERS.B[1]],
    };
    expect(instrumentOf(renewThroughVerb({ rosters: moved }).answered.worldState).sworn).toEqual({
      A: { npcId: 'npc_a2', name: 'Merek Vance', swornTick: DUE },
      B: { npcId: 'npc_b2', name: 'Sela Crane', swornTick: DUE },
    });
    // anchored: the landed pick over the SAME moved roster still names the exiled holder, so the skip above is the cast's (R-20: landed doors are not retrofitted).
    expect(oathHolderOf({}, 'A', court('A', A_ECONOMY, moved.A).settlement)?.npcId).toBe('npc_a1');
    // A seat nobody can speak for swears in the seat's voice, exactly as at a mint.
    const emptied = { A: ROSTERS.A, B: [npc('npc_b1', 'Bregan Holt', 'B seat', { status: 'dead' })] };
    expect(Object.keys(instrumentOf(renewThroughVerb({ rosters: emptied }).answered.worldState).sworn)).toEqual(['A']);
    // And when neither seat can: the old signatures do not carry over onto the new oath.
    const silent = { A: [npc('npc_a1', 'Aldric Thorne', 'A seat', { status: 'jailed' })], B: emptied.B };
    const unsigned = instrumentOf(renewThroughVerb({ rosters: silent }).answered.worldState);
    expect([unsigned.lineage.at(-1).act, Object.hasOwn(unsigned, 'sworn')]).toEqual(['renewed', false]);
    // The oath layer dark: the record's signature is left exactly as it stood.
    const darkOath = standingWorld();
    const unlit = { ...darkOath, simulationRules: { ...darkOath.simulationRules, oathHolderEnabled: false } };
    expect(instrumentOf(renewThroughVerb({ world: unlit }).answered.worldState).sworn).toEqual(before.sworn);
  });

  it('A5: outside the window the renewal is not offered: the predicate is false, staging refuses before the queue, and approval refuses with the world untouched', () => {
    const early = ENDS - WINDOW() - 1;
    const far = standingWorld({ tick: early });
    expect(renewal.renewalWeeksLeftOf(instrumentOf(far), early)).toBe(WINDOW() + 1);
    const campaign = (world) => ({ settlementIds: ['A', 'B'], worldState: world });
    const { renewalWindowOpen } = renewal.RENEWAL_WORLD_CONDITIONS;
    expect([renewalWindowOpen.predicate({ id: 'A' }, campaign(far)), renewalWindowOpen.subjects({ id: 'A' }, campaign(far))]).toEqual([false, []]);
    const staged = proposeThrough(far, early);
    expect([staged.built.ok, staged.built.code, staged.applied]).toEqual([false, 'invalid_term_sheet', null]);
    expect(staged.built.prose).toBe(manifest.realmVetoProse('invalid_term_sheet'));
    const before = JSON.stringify(far);
    const outcome = { proposalPayload: { kind: 'realm_verb_order', verb: 'PROPOSE_PACT', args: { ...ARGS } } };
    const armed = applyRealmVerbOrder({ state: far, snapshot: { settlements: snapshotOf().settlements }, settlementUpdates: new Map(), outcome, tick: early, now: null });
    expect(armed.refusal?.code).toBe('invalid_term_sheet');
    expect(armed.worldState).toBe(far);
    expect(JSON.stringify(armed.worldState)).toBe(before);
    // THE BOUNDARY, both sides: the window's own last week is inside, the week before it is not.
    expect(renewal.renewalWindowOpenFor(instrumentOf(far), ENDS - WINDOW())).toBe(true);
    // anchored: the same instrument answers true one line above at the boundary tick, so false here is the one-week step.
    expect(renewal.renewalWindowOpenFor(instrumentOf(far), ENDS - WINDOW() - 1)).toBe(false);
    // anchored: the same instrument is open at the boundary above, so a spent one (every clause at its end) is closed by the expiry law alone.
    expect([renewal.renewalWindowOpenFor(instrumentOf(far), ENDS), renewal.renewalWeeksLeftOf(instrumentOf(far), ENDS)]).toEqual([false, null]);
  });

  it('A6: a refused renewal lapses CLEAN: no trust moves, no pact_refused turning point, nothing but the settled row changes, for both refusing verdicts', () => {
    // NO OVERLAP: no believed demand, so the offer cannot reach the court's reserve.
    const cold = standingWorld({ beliefs: null });
    const asked = proposeThrough(cold, IN_WINDOW).applied.worldState;
    const lapsed = advancePeacetimePacts({ snapshot: snapshotOf(), worldState: asked, tick: DUE });
    const rel = (world) => world.relationshipStates[relKey('A', 'B')];
    // THE PIN FIRST: the relationship record, whole, then the world, whole, before any receipt.
    expect(rel(lapsed.worldState), 'no trust delta and no turning point').toEqual(rel(asked));
    expect(withoutProposals(lapsed.worldState), 'the world is byte-identical but for the settled row').toBe(withoutProposals(asked));
    expect(receiptOf(lapsed, 'pact_renewal_lapsed')?.ending).toBe('no_overlap');
    // anchored: A1 pins the renewal row open before this answer, so an empty queue here is the settle-and-prune.
    expect(pactProposalsOf(lapsed.worldState)).toEqual([]);
    expect(instrumentOf(lapsed.worldState), 'the instrument runs out on its own day, untouched').toEqual(instrumentOf(asked));
    // REFUSED: the court fears the reliance (the dependency arm), the other refusing verdict.
    const leaning = standingWorld({ relationship: { dependency: 1, leverage: 0 } });
    const askedLeaning = proposeThrough(leaning, IN_WINDOW).applied.worldState;
    const refused = advancePeacetimePacts({ snapshot: snapshotOf(), worldState: askedLeaning, tick: DUE });
    expect(rel(refused.worldState), 'no trust delta and no turning point').toEqual(rel(askedLeaning));
    expect(receiptOf(refused, 'pact_renewal_lapsed')?.ending).toBe('refused');
    // THE ANCHOR: the SAME cold world, asked a non-renewal question, DOES remember the refusal,
    // so the silence above is the renewal's lapse and not a world that cannot remember.
    const remembered = advancePeacetimePacts({
      snapshot: snapshotOf(), worldState: openRow(cold, 'trade_demand', renewal.draftRenewalSheet(instrumentOf(cold), IN_WINDOW)), tick: DUE,
    });
    expect(rel(remembered.worldState).trust).toBeLessThan(rel(cold).trust);
    expect((rel(remembered.worldState).turningPoints || []).map((p) => p.kind)).toEqual(['pact_refused']);
    // anchored: the same relationship record carries the pact_refused point on the non-renewal road one assertion above.
    expect((rel(lapsed.worldState).turningPoints || []).map((p) => p.kind)).toEqual([]);
  });

  it('A7: the stacking bypass is the renewal\'s alone: a non-renewal row re-offering the standing clauses still stacks and is refused', () => {
    const world = standingWorld();
    const before = instrumentOf(world);
    const reoffer = advancePeacetimePacts({
      snapshot: snapshotOf(), worldState: openRow(world, 'trade_demand', renewal.draftRenewalSheet(before, IN_WINDOW)), tick: DUE,
    });
    const refused = receiptOf(reoffer, 'pact_refused');
    expect([refused?.ending, refused?.stacking?.length]).toEqual(['refused', before.terms.length]);
    expect(instrumentOf(reoffer.worldState), 'the instrument is untouched by a collision').toEqual(before);
    // anchored: A3 renews the same instrument over the same clauses, so the missing act here is the trigger's doing.
    expect(instrumentOf(reoffer.worldState).lineage.map((entry) => entry.act)).toEqual(['formed']);
  });

  it('A8: the lineage act is growth: renewed joins PACT_LINEAGE_ACTS in codepoint order, appendLineage admits it, and a war after a renewal still closes the renewed clauses', () => {
    expect(amendment.PACT_LINEAGE_ACTS).toContain('renewed');
    expect([...amendment.PACT_LINEAGE_ACTS]).toEqual([...amendment.PACT_LINEAGE_ACTS].sort());
    expect(Object.isFrozen(amendment.PACT_LINEAGE_ACTS)).toBe(true);
    const bare = { parties: ['A', 'B'], mintedTick: 0, terms: [] };
    expect(amendment.appendLineage(bare, { act: 'renewed', tick: 5 }).lineage.map((entry) => entry.act)).toEqual(['formed', 'renewed']);
    // A war between the pair after the renewal closes what they renewed in peace.
    const renewedWorld = renewThroughVerb().answered.worldState;
    const atWar = { ...renewedWorld, relationshipStates: { [relKey('A', 'B')]: { relationshipType: 'hostile', trust: 0.1 } } };
    const closure = amendment.closeTermsBrokenByWar({ worldState: atWar, aId: 'A', bId: 'B', tick: DUE + 1 });
    expect(closure.closed).toEqual(instrumentOf(renewedWorld).terms.map((t) => amendment.termIdOf(t)).sort());
  });

  it('A9: renewalWindowOpen answers true with its subjects inside the window, and false with no subjects when dark, outside the window, or with a question standing', () => {
    const { renewalWindowOpen } = renewal.RENEWAL_WORLD_CONDITIONS;
    const campaign = (world) => ({ settlementIds: ['A', 'B'], worldState: world });
    const answer = (world, id = 'A') => [renewalWindowOpen.predicate({ id }, campaign(world)), renewalWindowOpen.subjects({ id }, campaign(world))];
    expect(answer(standingWorld())).toEqual([true, ['B']]);
    expect(answer(standingWorld(), 'B')).toEqual([true, ['A']]);
    expect(answer(standingWorld({ rules: { oathHolderEnabled: true } })), 'the renewal layer dark').toEqual([false, []]);
    const noPacts = standingWorld();
    expect(answer({ ...noPacts, simulationRules: { ...noPacts.simulationRules, pactFormationEnabled: false } }), 'the pact layer dark').toEqual([false, []]);
    expect(answer(standingWorld({ tick: ENDS - WINDOW() - 1 })), 'outside the window').toEqual([false, []]);
    expect(answer(proposeThrough(standingWorld(), IN_WINDOW).applied.worldState), 'a question already stands between the pair').toEqual([false, []]);
    // anchored: 'A' is a campaign court answered true above; a court outside the campaign is the only change.
    expect(answer(standingWorld(), 'Z')).toEqual([false, []]);
    expect(renewalWindowOpen.source).toBe('live');
    for (const reader of renewalWindowOpen.readers) expect(typeof renewal[reader.symbol], reader.symbol).toBe('function');
  });

  it('A10: the band is a DRAFT row in weeks, above the far court\'s answer on the real road and below the shortest clause the drafters mint', () => {
    const register = JSON.parse(readFileSync(join(ROOT, 'tests/lint/.tuning-register.json'), 'utf8'));
    const row = register.tables['src/domain/worldPulse/pactRenewal.js#RENEWAL_WINDOW_TUNING'];
    expect([row?.status, row?.unit, row?.band, row?.signedAt]).toEqual(['draft', { WINDOW_WEEKS: 'weeks' }, null, null]);
    // THE FLOOR: the longest answer on a real forty-seat road, two legs and the deliberation.
    const pack = makeGridPack({ cols: 48, rows: 36 });
    const placements = placeSettlements(pack, 40);
    const digest = buildSpatialDigest({ pack, placements });
    const ids = placements.map((p) => String(p.id));
    const dwells = [];
    for (let i = 0; i < ids.length; i += 1) {
      for (let j = i + 1; j < ids.length; j += 1) {
        if (hopWeeks(digest, ids[i], ids[j]) == null) continue;
        dwells.push(answerDueTickFor({ digest, fromId: ids[i], toId: ids[j], tick: 0 }).answerDueTick);
      }
    }
    expect(dwells.length, 'the realm is measured, not empty').toBeGreaterThan(100);
    expect(Math.max(...dwells), 'a renewal asked on the window\'s first day is answered while the instrument lives').toBeLessThan(WINDOW());
    // THE CEILING: the shortest clause either door mints. Peace drafts every rung of every
    // ladder; the war door drafts every catalogue clause across a budget sweep down to the
    // one year its affordability law never goes below.
    const peace = Object.entries(PACT_DRAFT_LENS).flatMap(([trigger, ladder]) => ladder.flatMap((rung) =>
      draftPactSheet({ trigger, fromId: 'a', toId: 'b', reciprocal: true, tick: 0, score01: rung.min }).terms))
      .map((term) => term.expiresTick - term.mintedTick);
    const war = Object.keys(TERM_CATALOG).flatMap((termType) => [0.05, 0.1, 0.25, 0.5, 1, 2, 4].flatMap((budget) =>
      draftTerms({ ranked: [{ termType }], budget, margin01: 0, press: 1, tick: 0 }).terms))
      .map((term) => term.expiresTick - term.mintedTick);
    expect(Math.min(...war), 'the war door never mints a clause shorter than a year').toBe(CURRENT_TREATY_TICKS_PER_YEAR);
    expect(Math.min(...peace, ...war), 'no clause is renewable on the day it is signed').toBeGreaterThan(WINDOW());
  });

  it('A11: dark means byte-identical: with treatyRenewalEnabled absent or false the leaf answers nothing, the verb refuses the renewal, and absent equals false', () => {
    const runs = [undefined, false].map((flag) => {
      const rules = flag === undefined ? { oathHolderEnabled: true } : { oathHolderEnabled: true, treatyRenewalEnabled: flag };
      const world = standingWorld({ rules });
      const row = pactProposalsOf(openRow(world, 'renewal', renewal.draftRenewalSheet(instrumentOf(world), IN_WINDOW)))[0];
      const answer = { verdict: 'signed', receipt: '', offer01: 1, reserve01: 0 };
      return {
        sheet: renewal.renewalClauseSheet({ worldState: world, termType: 'renewal', fromId: 'A', toId: 'B', tick: IN_WINDOW }),
        settled: renewal.settleRenewalProposal({ worldState: world, proposal: row, answer, tick: DUE }),
        staged: proposeThrough(world, IN_WINDOW).built.code,
        counterparties: renewal.renewalCounterpartiesFor(world, ['A', 'B'], 'A', IN_WINDOW),
      };
    });
    expect(runs[0]).toEqual({ sheet: { trigger: 'renewal', terms: [] }, settled: null, staged: 'invalid_term_sheet', counterparties: [] });
    expect(JSON.stringify(runs[1]), 'false behaves exactly as absent').toBe(JSON.stringify(runs[0]));
    // anchored: the lit leaf answers a renewal row with a settlement (A3), so null above is the gate alone.
    expect(renewal.settleRenewalProposal({
      worldState: standingWorld(), proposal: { trigger: 'trade_demand', id: 'x', from: 'A', to: 'B' },
      answer: { verdict: 'signed', receipt: '', offer01: 1, reserve01: 0 }, tick: DUE,
    })).toBe(null);
  });

  it('A12: lifecycle: a renewed record JSON round-trips with its memory, a legacy instrument keeps the clauses it was made with, and an instrument that ran out before the answer closes the question without a renewal', () => {
    // MEMORY AND ROUND TRIP: the monotone memory rides every act, and the record survives JSON.
    const remembered = standingWorld();
    const key = keysOf(remembered)[0];
    const strained = { ...remembered, spatialLedgers: { ...remembered.spatialLedgers, treaties: { [key]: { ...instrumentOf(remembered), worstObservedEver: 'strained' } } } };
    const renewed = instrumentOf(renewThroughVerb({ world: strained }).answered.worldState);
    expect([renewed.worstObservedEver, renewed.lineage.map((entry) => entry.act)]).toEqual(['strained', ['formed', 'renewed']]);
    expect(JSON.parse(JSON.stringify(renewed))).toEqual(renewed);
    // A LEGACY instrument (no lineage key): its implied act is written from the record AS IT STOOD.
    const { lineage: _dropped, ...legacy } = instrumentOf(remembered);
    const legacyWorld = { ...remembered, spatialLedgers: { ...remembered.spatialLedgers, treaties: { [key]: legacy } } };
    const legacyRenewed = instrumentOf(renewThroughVerb({ world: legacyWorld }).answered.worldState);
    expect(legacyRenewed.lineage.map((entry) => [entry.act, entry.tick, entry.termIds])).toEqual([
      ['formed', SIGN_TICK, legacy.terms.map((t) => amendment.termIdOf(t)).sort()],
      ['renewed', DUE, legacy.terms.map((t) => `${t.type}.${t.beneficiary}.${DUE}`).sort()],
    ]);
    // RAN OUT BEFORE THE ANSWER: asked in the window's last weeks, answered after the end.
    const late = ENDS - 2;
    const lateWorld = standingWorld({ tick: late });
    const lateAsked = proposeThrough(lateWorld, late).applied.worldState;
    const lateDue = pactProposalsOf(lateAsked)[0].answerDueTick;
    expect(lateDue).toBeGreaterThan(ENDS);
    const expired = advancePeacetimePacts({ snapshot: snapshotOf(), worldState: lateAsked, tick: lateDue });
    expect(receiptOf(expired, 'pact_renewal_lapsed')?.ending).toBe('expired_unanswered');
    expect(instrumentOf(expired.worldState), 'no renewal of a spent instrument').toEqual(instrumentOf(lateAsked));
    expect(expired.worldState.relationshipStates).toEqual(lateAsked.relationshipStates);
    // The question settles `expired` (nobody could answer it), which the stage then prunes; the
    // leaf's own hand-back is where that state is visible.
    const settled = renewal.settleRenewalProposal({
      worldState: lateAsked, proposal: pactProposalsOf(lateAsked)[0],
      answer: { verdict: 'signed', receipt: '', offer01: 1, reserve01: 0 }, tick: lateDue,
    });
    expect([pactProposalsOf(settled.worldState).map((row) => row.state), settled.ledger]).toEqual([['expired'], null]);
  });
});
