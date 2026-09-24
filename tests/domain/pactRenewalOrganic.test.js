/**
 * tests/domain/pactRenewalOrganic.test.js — GR-RENEWAL U1: THE ORGANIC RENEWAL PROPOSER (the lane
 * brief BUILD-FP-GR-renewal-lane.md, from READ 3's renewal row: "0 of 1,094 proposals had the
 * renewal trigger, and both instruments lapsed unrenewed").
 *
 * GR-5b built the renewal window and its answer, but only the DM's verb could ask: the leaf's
 * predicate (`RENEWAL_WORLD_CONDITIONS.renewalWindowOpen`) had no consumer in the world. The pact
 * stage now asks on its own: in the first weeks of an instrument's window (as long as one answer
 * takes on that pair's road), a court OWED something on the instrument asks its counterpart to
 * renew it, through the SAME conjuncts the seal reads. The row rides the ledger's one writer with
 * the trigger `renewal` and the tick's one answer road: accepted renews, refused lapses clean.
 *
 * Every standing instrument here is signed through the REAL doors: a peacetime pact through
 * `signPactProposal`, a war's end through the war door's own drafter (`draftTerms`) in the shape
 * `peaceTerms.js :: mintTreaty` writes. The new symbols are read through NAMESPACE imports, so the
 * red-first plant of the pre-change sources reds each arm by title instead of failing at link time.
 */
import { createHash } from 'node:crypto';
import { describe, expect, it } from 'vitest';

import * as manifest from '../../src/domain/events/realmManifest.js';
import * as renewal from '../../src/domain/worldPulse/pactRenewal.js';
import * as formation from '../../src/domain/worldPulse/pactFormation.js';
import { applyRealmVerbOrder, buildRealmVerbOutcome } from '../../src/domain/worldPulse/realmVerbExecution.js';
import { answerDueTickFor, openPactProposal, pactProposalsOf } from '../../src/domain/worldPulse/pactProposals.js';
import { treatyLedgerOf } from '../../src/domain/worldPulse/treatyEnforcement.js';
import { termBudgetFor } from '../../src/domain/worldPulse/peaceTermsAppraisal.js';
import { draftTerms } from '../../src/domain/worldPulse/peaceTermsDrafting.js';
import { treatyPairKey } from '../../src/domain/worldPulse/peaceTermsPrimitives.js';
import { CURRENT_TREATY_TICKS_PER_YEAR } from '../../src/domain/worldPulse/treatyClock.js';
import { A_ECONOMY, B_ECONOMY, pactWorld, relKey } from '../helpers/pactFixture.js';

// ── THE FIXTURE AND THE IDENTITY HARNESS, recorded at the base 90cbf7963 before a line of U1 ──
const sha = (value) => createHash('sha256').update(JSON.stringify(value)).digest('hex');
const SIGN_TICK = 0;
const npc = (id, name, seat) => ({ id, name, factionAffiliation: seat, role: 'official' });
const court = (id, economicState, roster) => ({
  id, name: id,
  settlement: {
    id, name: id, economicState: { ...economicState },
    powerStructure: { publicLegitimacy: { score: 60, label: 'Stable' }, factions: [{ faction: `${id} seat`, category: 'military', power: 78, isGoverning: true }], conflicts: [] },
    npcs: roster.map((row) => ({ ...row })),
  },
});
const ROSTERS = Object.freeze({
  A: [npc('npc_a1', 'Aldric Thorne', 'A seat')],
  B: [npc('npc_b1', 'Bregan Holt', 'B seat')],
  L: [npc('npc_l1', 'Lorn Ashe', 'L seat')],
  V: [npc('npc_v1', 'Varo Keel', 'V seat')],
});
// THE PAIR'S EDGE (FPQ-35): relationship records are found only through the edge that joins the pair.
const snapshotAB = () => ({
  settlements: [court('A', A_ECONOMY, ROSTERS.A), court('B', B_ECONOMY, ROSTERS.B)],
  regionalGraph: { edges: [{ from: 'A', to: 'B' }] },
});
const snapshotLV = () => ({
  settlements: [court('L', B_ECONOMY, ROSTERS.L), court('V', A_ECONOMY, ROSTERS.V)],
  regionalGraph: { edges: [{ from: 'L', to: 'V' }] },
});
const settlementOfIn = (snapshot) => (id) => snapshot.settlements.find((item) => item.id === id)?.settlement ?? null;
const LIT = Object.freeze({ treatyRenewalEnabled: true, oathHolderEnabled: true });
/** A peacetime instrument signed through the REAL formation door at SIGN_TICK: a reciprocal
 *  trade pact, one clause owed each way. */
function pactAB({ rules = LIT, beliefs, relationship, reciprocal = true } = {}) {
  const snapshot = snapshotAB();
  const world = pactWorld({ flag: true, rules, beliefs, relationship });
  const sheet = formation.draftPactSheet({ trigger: 'trade_demand', fromId: 'A', toId: 'B', reciprocal, tick: SIGN_TICK, score01: 0 });
  const signed = formation.signPactProposal({
    worldState: world, proposal: { from: 'A', to: 'B', trigger: 'trade_demand', sheet: { terms: sheet.terms } },
    tick: SIGN_TICK, settlementOf: settlementOfIn(snapshot),
  });
  return signed.worldState;
}
/** A war's end, in the record shape the war door writes: V the victor, L the bound party; the
 *  clauses drafted by the war door's own drafter at the recorded margin's own value. */
function warLV({ rules = LIT, relationship = {} } = {}) {
  const { margin01 } = termBudgetFor(0.3);
  const drafted = draftTerms({
    ranked: [{ termType: 'tribute', value: 1 }, { termType: 'demilitarization', value: 1 }],
    budget: 3, margin01, press: 1, tick: SIGN_TICK,
  });
  const treaty = {
    parties: ['V', 'L'], victorId: 'V', loserId: 'L', victorName: 'V', loserName: 'L',
    mintedTick: SIGN_TICK, believedMarginAtSignature: 0.3, budgetGranted: 3, budgetSpent: drafted.budgetSpent,
    treatyTicksPerYear: CURRENT_TREATY_TICKS_PER_YEAR, terms: drafted.terms, complianceState: 'honored',
    receipts: ['The Peace of L: signed under V terms.'],
  };
  return pactWorld({
    flag: true, rules, beliefs: null,
    relationshipStates: { [relKey('L', 'V')]: { relationshipType: 'trade_partner', trust: 0.6, ...relationship } },
    treaties: { [treatyPairKey('V', 'L')]: treaty },
  });
}
const instrumentOf = (world) => Object.values(treatyLedgerOf(world) || {})[0];
/** The tick the instrument's window opens: its longest clause's end, less the band. */
const opensAt = (world) => Math.max(...instrumentOf(world).terms.map((t) => t.expiresTick)) - renewal.RENEWAL_WINDOW_TUNING.WINDOW_WEEKS;
const outcomeOf = (r) => ({ worldState: r.worldState, receipts: r.receipts, changed: r.changed, newsEntries: r.newsEntries });
const stage = (world, tick, snapshot = snapshotAB()) => formation.advancePeacetimePacts({ snapshot, worldState: { ...world, tick }, tick });
/** Stage the order through the lane's pure mint, then apply it through the arm dispatcher. */
function proposeThrough(world, tick, args, snapshot) {
  const built = buildRealmVerbOutcome({ verb: 'PROPOSE_PACT', args, worldState: world, snapshot, tick });
  const applied = built.ok
    ? applyRealmVerbOrder({ state: world, snapshot, settlementUpdates: new Map(), outcome: built.outcome, tick, now: null })
    : null;
  return { built, applied };
}
/** THE DM'S VERB, every word its clause dial offers, staged and applied against a peacetime and a
 *  war-door instrument each inside its window: the road U1 must leave byte-identical. */
function verbDigest() {
  const words = manifest.REALM_MANIFEST.PROPOSE_PACT.dials.find((d) => d.key === 'termType').options;
  const peace = pactAB();
  const war = warLV();
  return sha([
    ...words.map((termType) => ({ termType, ...proposeThrough({ ...peace, tick: opensAt(peace) + 2 }, opensAt(peace) + 2, { fromId: 'A', toId: 'B', termType }, { settlements: snapshotAB().settlements }) })),
    ...words.map((termType) => ({ termType, ...proposeThrough({ ...war, tick: opensAt(war) + 2 }, opensAt(war) + 2, { fromId: 'V', toId: 'L', termType }, { settlements: snapshotLV().settlements }) })),
  ]);
}
/** THE STAGE with the renewal layer absent and then false, on the day each window opens. */
function darkDigest() {
  return sha([undefined, false].flatMap((flag) => {
    const rules = flag === undefined ? { oathHolderEnabled: true } : { oathHolderEnabled: true, treatyRenewalEnabled: flag };
    const peace = pactAB({ rules });
    const war = warLV({ rules });
    return [outcomeOf(stage(peace, opensAt(peace))), outcomeOf(stage(war, opensAt(war), snapshotLV()))];
  }));
}
// ── end of the identity harness ─────────────────────────────────────────────────────────────

const renewalRows = (world) => pactProposalsOf(world).filter((r) => r.trigger === 'renewal');
const receiptOf = (result, kind) => result.receipts.find((row) => row.kind === kind);
/** One answer on this pair's road with no digest: two floor legs and the deliberation. */
const DWELL = answerDueTickFor({ digest: null, fromId: 'A', toId: 'B', tick: 0 }).answerDueTick;

describe('GR-RENEWAL U1 — the organic renewal proposer: the world asks to renew a pact inside its window, through the seal\'s own conjuncts', () => {
  it('U1-A1: a pact inside its window with the conditions met gets a renewal proposal from the world, drafted AS IS and due on the road', () => {
    const world = pactAB();
    const at = opensAt(world);
    const asked = stage(world, at);
    const rows = renewalRows(asked.worldState);
    // A reciprocal pact owes a clause each way, so either court may ask; the codepoint-first does.
    expect(rows.map((r) => [r.from, r.to, r.trigger, r.state, r.openedTick, r.answerDueTick]))
      .toEqual([['A', 'B', 'renewal', 'open', at, at + DWELL]]);
    expect(rows[0].sheet.terms, 'the sheet is the leaf own renewal draft, never re-spelled')
      .toEqual(renewal.draftRenewalSheet(instrumentOf(world), at));
    expect(receiptOf(asked, 'pact_renewal_proposed')).toMatchObject({ fromId: 'A', toId: 'B', trigger: 'renewal', refusal: '' });
    expect(asked.changed).toBe(true);
    // The instrument itself is untouched by the asking.
    expect(instrumentOf(asked.worldState)).toEqual(instrumentOf(world));
  });

  it('U1-A2: outside the window the world asks nothing: the week before it opens, far from it, and once the asking weeks have passed', () => {
    const world = pactAB();
    const at = opensAt(world);
    expect(renewal.renewalWindowOpenFor(instrumentOf(world), at - 1), 'the week before is outside').toBe(false);
    // anchored: the same instrument is asked at `at` (U1-A1); one week earlier is the only change.
    expect(renewalRows(stage(world, at - 1).worldState)).toEqual([]);
    // anchored: the same instrument is asked at `at` (U1-A1); a tick far from the window is the only change.
    expect(renewalRows(stage(world, 60).worldState)).toEqual([]);
    // Past the asking weeks (one answer's length on this road) the window is still open, and the
    // court no longer asks: any question it put is answered after them, so it asks at most once.
    expect(renewal.renewalWindowOpenFor(instrumentOf(world), at + DWELL), 'the window is still open').toBe(true);
    // anchored: the same instrument inside its window, asked at `at`; only the asking weeks have passed.
    expect(renewalRows(stage(world, at + DWELL).worldState)).toEqual([]);
  });

  it('U1-A3: the proposal rides the existing answer road: accepted renews the instrument, refused lapses CLEAN and is never asked again', () => {
    // ACCEPTED: the answering court's own evidence meets its reserve (the GR-5b fixture's demand).
    const world = pactAB();
    const at = opensAt(world);
    const asked = stage(world, at);
    const due = renewalRows(asked.worldState)[0].answerDueTick;
    const answered = stage(asked.worldState, due);
    expect(receiptOf(answered, 'pact_renewed')).toMatchObject({ ending: 'signed', fromId: 'A', toId: 'B' });
    const renewed = instrumentOf(answered.worldState);
    expect(renewed.lineage.map((entry) => [entry.act, entry.tick])).toEqual([['formed', SIGN_TICK], ['renewed', due]]);
    // The renewed clauses run again from the signing, so the next window is years away.
    expect(renewal.renewalWindowOpenFor(renewed, due + 1)).toBe(false);
    // REFUSED: no believed demand on the answering side, so the offer cannot reach its reserve.
    const cold = pactAB({ beliefs: null });
    const coldAsked = stage(cold, at);
    expect(renewalRows(coldAsked.worldState).map((r) => r.from)).toEqual(['A']);
    const lapsed = stage(coldAsked.worldState, due);
    expect(receiptOf(lapsed, 'pact_renewal_lapsed')?.ending).toBe('no_overlap');
    const rel = (w) => w.relationshipStates[relKey('A', 'B')];
    expect(rel(lapsed.worldState), 'a clean lapse: no trust delta, no turning point').toEqual(rel(cold));
    expect(instrumentOf(lapsed.worldState), 'the instrument runs out on its own day, untouched').toEqual(instrumentOf(cold));
    // NEVER ASKED AGAIN: every remaining week of the window, fed forward tick by tick.
    let state = lapsed.worldState;
    const ends = Math.max(...instrumentOf(cold).terms.map((t) => t.expiresTick));
    let asks = 0;
    for (let tick = due + 1; tick < ends; tick += 1) {
      const next = stage(state, tick);
      asks += renewalRows(next.worldState).length;
      state = next.worldState;
    }
    // anchored: the same pair is asked once at `at` above; the lapse is the only change since.
    expect(asks).toBe(0);
  });

  it('U1-A4: a question already standing at the opening defers the ask to its answer, inside the asking weeks, and never past them', () => {
    const world = pactAB();
    const at = opensAt(world);
    // A trade question put two weeks before the window opens, answered two weeks into it.
    const early = at - 2;
    const sheet = formation.draftPactSheet({ trigger: 'trade_demand', fromId: 'B', toId: 'A', reciprocal: false, tick: early, score01: 0 });
    const standing = openPactProposal({ worldState: { ...world, tick: early }, from: 'B', to: 'A', trigger: 'trade_demand', sheet: { terms: sheet.terms }, tick: early }).worldState;
    const tradeDue = pactProposalsOf(standing)[0].answerDueTick;
    expect(tradeDue).toBeGreaterThan(at);
    expect(tradeDue).toBeLessThan(at + DWELL);
    // anchored: the same world is asked at `at` in U1-A1; the standing question is the only change.
    expect(renewalRows(stage(standing, at).worldState), 'blocked on the opening day').toEqual([]);
    const answeredTrade = stage(stage(standing, at).worldState, tradeDue);
    expect(renewalRows(answeredTrade.worldState).map((r) => [r.from, r.to, r.openedTick]), 'asked once the pair is free').toEqual([['A', 'B', tradeDue]]);
    // Past the asking weeks, a pair still blocked is never asked: the court does not chase a
    // window it could not speak in.
    const late = openPactProposal({ worldState: { ...world, tick: at - 1 }, from: 'B', to: 'A', trigger: 'trade_demand', sheet: { terms: sheet.terms }, tick: at - 1 }).worldState;
    const longDue = at + DWELL + 1;
    const slow = { ...late, spatialLedgers: { ...late.spatialLedgers, pactProposals: pactProposalsOf(late).map((r) => ({ ...r, answerDueTick: longDue })) } };
    const freed = stage(stage(slow, at).worldState, longDue);
    // anchored: the pair is asked once free inside the asking weeks one block above; freed only after them here.
    expect(renewalRows(freed.worldState)).toEqual([]);
  });

  it('U1-A5: the court that is owed asks, and a court that only pays never does', () => {
    // THE WAR DOOR: every clause binds the bound party L to the victor V, so V asks, although L
    // is the codepoint-first court.
    const war = warLV();
    const at = opensAt(war);
    const asked = stage(war, at, snapshotLV());
    expect(renewalRows(asked.worldState).map((r) => [r.from, r.to])).toEqual([['V', 'L']]);
    // A ONE-SIDED PEACETIME PACT: the clause runs to A alone, so A asks and B never would.
    const oneSided = pactAB({ reciprocal: false });
    expect(instrumentOf(oneSided).terms.map((t) => t.beneficiary)).toEqual(['A']);
    expect(renewalRows(stage(oneSided, opensAt(oneSided)).worldState).map((r) => [r.from, r.to])).toEqual([['A', 'B']]);
    // With A's hand held (its offers already at their cap), B, which only pays, still does not ask.
    const capped = { ...oneSided, spatialLedgers: { ...oneSided.spatialLedgers, pactProposals: [0, 1].map((i) => ({
      id: `pact.${i}.a.z${i}.trade_demand`, from: 'A', to: `Z${i}`, trigger: 'trade_demand', sheet: { terms: [{ type: 'resource_share' }] },
      openedTick: opensAt(oneSided), answerDueTick: opensAt(oneSided) + 30, state: 'open', transport: 'abstract',
    })) } };
    // anchored: the same one-sided instrument is asked by A one assertion above; A's cap is the only change.
    expect(renewalRows(stage(capped, opensAt(oneSided)).worldState)).toEqual([]);
  });

  it('U1-A6: a pair at war asks nothing, and a dark layer asks nothing', () => {
    // AT THE LEAF, because the stage's own war closure runs first and today empties a warring
    // pair's instrument before any window can be read (the closure reads a legacy record's
    // implied act as negotiated, noticed by GR-5c); the leaf's contract is what is pinned here.
    const war = warLV();
    const at = opensAt(war);
    const ask = (world) => renewalRows(renewal.openRenewalProposals({
      worldState: { ...world, tick: at }, ids: ['L', 'V'], tick: at, snapshot: snapshotLV(),
    }).worldState).map((r) => [r.from, r.to]);
    expect(ask(war), 'at peace, the victor asks').toEqual([['V', 'L']]);
    // anchored: the same instrument is asked one assertion above; the war between the pair is the only change.
    expect(ask(warLV({ relationship: { relationshipType: 'hostile', trust: 0.05 } }))).toEqual([]);
    for (const rules of [{ oathHolderEnabled: true }, { oathHolderEnabled: true, treatyRenewalEnabled: false }]) {
      const dark = pactAB({ rules });
      // anchored: the lit instrument is asked at its opening in U1-A1; the renewal layer is the only change.
      expect(renewalRows(stage(dark, opensAt(dark)).worldState)).toEqual([]);
      expect(renewal.openRenewalProposals({ worldState: dark, ids: ['A', 'B'], tick: opensAt(dark) }).worldState, 'dark hands the reference back').toBe(dark);
    }
  });

  it('U1-A7: the seal and the act agree: every pair the world asks is a subject of renewalWindowOpen at that tick', () => {
    const { renewalWindowOpen } = renewal.RENEWAL_WORLD_CONDITIONS;
    for (const [world, snapshot] of [[pactAB(), snapshotAB()], [warLV(), snapshotLV()]]) {
      const at = opensAt(world);
      const campaign = { settlementIds: snapshot.settlements.map((s) => s.id), worldState: { ...world, tick: at } };
      const asked = renewalRows(stage(world, at, snapshot).worldState);
      expect(asked.length).toBe(1);
      for (const row of asked) {
        expect(renewalWindowOpen.subjects({ id: row.from }, campaign), `${row.from} may ask ${row.to}`).toContain(row.to);
      }
    }
  });

  it('U1-A8: the DM\'s verb path is byte-identical to the base, hashed; and dark means byte-identical at the stage', () => {
    // Recorded at the base 90cbf7963 by this same harness, before a line of U1 existed.
    expect(verbDigest(), 'every word on the dial, staged and applied against a peacetime and a war instrument').toBe('e71967020e268f62d8b78b149d2b9fbcb18f558d332cd44064a8852029e020e8');
    expect(darkDigest(), 'the stage on each window\'s opening day with the renewal layer absent, then false').toBe('cb16785778a4308f78a1612a72b978de23a2c495bcc64f6c977af9e1120d2293');
  });
});
