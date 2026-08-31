/**
 * tests/domain/anticipatedReactions.test.js — W-SEAT D5 (SEAT-4)'s home.
 *
 * §741: "each settlement's risk assessment for any major decision considers how each
 * relevant foreign power — or its counterpart seat in that settlement — will react." The
 * payoff is a decision that gets HELD BACK, with a receipt naming whose answer was feared,
 * and the arms below are ordered so that payoff is the last thing proved rather than the
 * first thing assumed.
 *
 * ⚠ GRADE, STATED (SEAT-1's standing request): the CHOKE arms are DISCOVERY-grade — they
 * move a live routing decision that nothing in the tree could move before. Everything above
 * them is REGRESSION-grade or instrumental.
 */

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import {
  REACTION_BANDS,
  REACTION_TUNING,
  reactionsLit,
  relevantPowersFor,
  reactionOf,
  anticipatedReactionsFor,
  heldBackBy,
  applyAnticipatedReactions,
} from '../../src/domain/worldPulse/anticipatedReactions.js';
import { BELIEF_TUNING } from '../../src/domain/worldPulse/beliefMap.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

const SELF = 'ford';
const ALLY = 'crown';
const FOE = 'delve';
const OVERLORD = 'ironhold';

const LIT = { foreignSeatEnabled: true };
const DARK = {};

/** A world whose belief layer is ACTIVE (the spatial marker present, infoMode non-omniscient). */
function worldWith({ rules = LIT, beliefs = null, treaties = null, occupations = null } = {}) {
  return {
    spatialCanonVersion: 1,
    simulationRules: { infoMode: 'full', ...rules },
    ...(occupations ? { occupations } : {}),
    spatialLedgers: {
      ...(beliefs ? { beliefMaps: beliefs } : {}),
      ...(treaties ? { treaties } : {}),
    },
  };
}

function snapshotWith(edges, worldState) {
  return { byId: new Map(), settlements: [], worldState, regionalGraph: { edges, channels: [] } };
}

const EDGES = [
  { id: 'e1', from: SELF, to: ALLY, relationshipType: 'allied' },
  { id: 'e2', from: FOE, to: SELF, relationshipType: 'hostile' },
];

/** A belief record the observer holds ABOUT a subject, in the governing-seat slot. */
const beliefsOf = (subjectRows) => ({ [SELF]: { seat: subjectRows } });

/** A live subordinating treaty in which SELF is the obligor and `obligee` the obligee. */
const subordinatingTreaty = (obligee) => ({
  t1: { victorId: obligee, loserId: SELF, terms: [{ type: 'tribute', complianceState: 'honored' }] },
});

// ── (1) The gate and the dormant identity ───────────────────────────────────

describe('SEAT-4 — the gate', () => {
  it('rides foreignSeatEnabled with the strict === true idiom, refusing truthy non-true', () => {
    expect(reactionsLit({ simulationRules: LIT })).toBe(true);
    for (const truthy of ['true', 1, {}, [], 'yes']) {
      expect(reactionsLit({ simulationRules: { foreignSeatEnabled: truthy } }), String(truthy)).toBe(false);
    }
    expect(reactionsLit({ simulationRules: {} })).toBe(false);
    expect(reactionsLit(null)).toBe(false);
  });

  it('DARK: the forecast is the SAME EMPTY REFERENCE every time, not an equal copy', () => {
    // Reference identity is what lets the choke pass claim byte-identity by construction:
    // a dark call cannot allocate, so it cannot perturb anything downstream.
    const ws = worldWith({ rules: DARK });
    const snap = snapshotWith(EDGES, ws);
    const a = anticipatedReactionsFor(ws, snap, SELF);
    const b = anticipatedReactionsFor(ws, snap, SELF);
    expect(a).toBe(b);
    expect(a).toEqual([]);
  });

  it('LIT but with no relevant power: still the same empty reference', () => {
    const ws = worldWith({});
    expect(anticipatedReactionsFor(ws, snapshotWith([], ws), SELF)).toBe(anticipatedReactionsFor(ws, snapshotWith([], ws), SELF));
  });

  it('an unnamed decider forecasts nothing rather than throwing', () => {
    const ws = worldWith({});
    expect(anticipatedReactionsFor(ws, snapshotWith(EDGES, ws), '')).toEqual([]);
    expect(anticipatedReactionsFor(ws, snapshotWith(EDGES, ws), null)).toEqual([]);
  });
});

// ── (2) The bounded set — three substrates, and never a fourth ──────────────

describe('SEAT-4 — the bounded relevant set', () => {
  it('unions relationship edges, treaty counterparties and the seat patron', () => {
    const ws = worldWith({
      treaties: subordinatingTreaty(OVERLORD),
      occupations: { [SELF]: { occupierId: 'garrisonhold', state: 'stabilized', resistance: 0.2 } },
    });
    const powers = relevantPowersFor(ws, snapshotWith(EDGES, ws), SELF);
    // ALLY and FOE by edge, OVERLORD by treaty, garrisonhold by seat.
    expect(powers).toEqual([ALLY, FOE, 'garrisonhold', OVERLORD].sort());
  });

  it('is codepoint-sorted and never contains the decider itself', () => {
    const selfEdge = [...EDGES, { id: 'e3', from: SELF, to: SELF, relationshipType: 'allied' }];
    const ws = worldWith({});
    const powers = relevantPowersFor(ws, snapshotWith(selfEdge, ws), SELF);
    // ANCHORED (EP-1): ALLY travels the SAME edge loop that would admit the self-edge, so a
    // drift that stopped reading `regionalGraph.edges` at all — the one regression this arm
    // exists to catch — reds on the anchor instead of passing the exclusion vacuously.
    expectAbsentWithAnchor(powers, SELF, ALLY, 'relevantPowersFor drops the decider');
    expect([...powers].sort()).toEqual(powers);
  });

  it('⭐ a garbage ledger yields a set rather than a throw — and this arm FOUND A CRASH', () => {
    // This arm went RED on its first run, and the throw was NOT in this file. `foreignSeatOf`
    // → `vassalageSeat` called `normalizeRelationshipEdge(rawEdge)` on every element of the
    // edge array, and that helper's `edge = {}` default fires only on `undefined` — so a
    // literal `null` in the array slipped past it and threw on `.relationshipType`, against
    // `rulingPowerSeat.js`'s own header promise of "INERT-NOT-CRASH on absent/garbage
    // ledgers". SEAT-1 shipped it with one caller; the seat resolver now has three (the seat
    // books, the primacy axis, this forecast), so a throw there takes a whole pulse down
    // rather than degrading a single read. Cured at the seat leaf, pinned here.
    const ws = { spatialCanonVersion: 1, simulationRules: LIT, spatialLedgers: { treaties: 'nonsense' } };
    expect(() => relevantPowersFor(ws, snapshotWith('nope', ws), SELF)).not.toThrow();
    expect(relevantPowersFor(ws, { regionalGraph: { edges: [null, {}, 7] } }, SELF)).toEqual([]);
    // The crash reproduced through the FORECAST too, which is the path that would have
    // taken the pulse down; both entry points are pinned.
    expect(() => anticipatedReactionsFor(ws, { worldState: ws, regionalGraph: { edges: [null] } }, SELF)).not.toThrow();
  });
});

// ── (3) The band, from the three inputs the record actually holds ───────────

describe('SEAT-4 — the reaction band', () => {
  it('the vocabulary is closed and ordered friendliest → sharpest', () => {
    expect([...REACTION_BANDS]).toEqual(['supportive', 'indifferent', 'wary', 'opposed']);
  });

  it('a friendly label reads supportive, a hostile one wary, and a mobilized hostile OPPOSED', () => {
    const ws = worldWith({});
    const snap = snapshotWith(EDGES, ws);
    expect(reactionOf(ws, snap, SELF, ALLY, 'allied').band).toBe('supportive');
    expect(reactionOf(ws, snap, SELF, FOE, 'hostile').band).toBe('wary');
    // Readiness is the ONE state axis the belief record holds that bears on how an answer
    // is likely to be delivered, so it is the only thing that sharpens `wary` into `opposed`.
    const mobilized = worldWith({
      beliefs: beliefsOf({ [FOE]: { allianceLabel: 'hostile', readiness: 0.9, confidence01: 0.8 } }),
    });
    expect(reactionOf(mobilized, snapshotWith(EDGES, mobilized), SELF, FOE, 'hostile').band).toBe('opposed');
  });

  it('an unlabelled power is indifferent', () => {
    const ws = worldWith({});
    expect(reactionOf(ws, snapshotWith(EDGES, ws), SELF, 'stranger', '').band).toBe('indifferent');
  });

  it('⚠ THE RULING: an ABSENT record keeps the DECLARED label but drops the confidence', () => {
    // A1.1.3 says "entry-absent ⇒ indifferent at low confidence". The estate's own law says
    // the opposite for this axis: `readBeliefRelationship` returns GROUND TRUTH on
    // `unknown`, because "the declared relationship is public, so absence is NON-paranoid".
    // The ruling splits them: the ESTATE wins on the LABEL, the AMENDMENT on the CONFIDENCE.
    const ws = worldWith({}); // beliefs active, but no record about ALLY
    const r = reactionOf(ws, snapshotWith(EDGES, ws), SELF, ALLY, 'allied');
    expect(r.basis).toBe('unknown');
    expect(r.band, 'a court cannot forget whether it is sworn to a neighbour').toBe('supportive');
    expect(r.confidence01).toBe(BELIEF_TUNING.MIN_CONFIDENCE);
    // ...and for the NEUTRAL labels that dominate a real map the two rules AGREE, which is
    // why the divergence is narrow rather than a wholesale override of the amendment.
    const neutral = reactionOf(ws, snapshotWith(EDGES, ws), SELF, 'stranger', '');
    expect(neutral.band).toBe('indifferent');
    expect(neutral.confidence01).toBe(BELIEF_TUNING.MIN_CONFIDENCE);
  });

  it('a HELD record overrides the declared label with the believed (possibly stale) one', () => {
    // The whole point of the belief layer: a court acts on what it was last told.
    const ws = worldWith({
      beliefs: beliefsOf({ [ALLY]: { allianceLabel: 'hostile', readiness: 0.1, confidence01: 0.7 } }),
    });
    const r = reactionOf(ws, snapshotWith(EDGES, ws), SELF, ALLY, 'allied');
    expect(r.basis).toBe('belief');
    expect(r.band).toBe('wary');
    expect(r.confidence01).toBe(0.7);
  });

  it('DORMANT belief layer ⇒ ground truth verbatim at full confidence', () => {
    // `belief()`'s own identity fallback, inherited rather than re-implemented: no spatial
    // marker ⇒ `source: 'truth'` ⇒ the court reads the world as it is.
    const ws = { simulationRules: LIT, spatialLedgers: {} };
    const r = reactionOf(ws, snapshotWith(EDGES, ws), SELF, FOE, 'hostile');
    expect(r.basis).toBe('truth');
    expect(r.confidence01).toBe(1);
  });

  it('the casus flag is TRUE STRUCTURE, never a believed one', () => {
    // A formal compact is a contract and contracts read true (the A3 lord-knows-his-vassals
    // precedent). A casus computed from a stale picture would let a court talk itself out of
    // an obligation it demonstrably has.
    const ws = worldWith({ treaties: subordinatingTreaty(OVERLORD) });
    const snap = snapshotWith(EDGES, ws);
    expect(reactionOf(ws, snap, SELF, OVERLORD, '').casus).toBe(true);
    expect(reactionOf(ws, snap, SELF, ALLY, 'allied').casus).toBe(false);
    // A tie the other way round gives the DECIDER standing, not the power: SELF is the
    // obligee there, so nobody holds a compact over SELF.
    const inverted = worldWith({ treaties: { t1: { victorId: SELF, loserId: OVERLORD, terms: [{ type: 'tribute' }] } } });
    expect(reactionOf(inverted, snapshotWith(EDGES, inverted), SELF, OVERLORD, '').casus).toBe(false);
  });
});

// ── (4) The hold — and all three conditions are load-bearing ────────────────

describe('SEAT-4 — what actually holds a decision back', () => {
  const opposedWithCasus = { powerId: OVERLORD, band: 'opposed', casus: true, confidence01: 0.8 };

  it('holds on opposed + casus + confidence, and NOT on any two of the three', () => {
    expect(heldBackBy([opposedWithCasus])).toMatchObject({ powerId: OVERLORD });
    // ⛔ EACH CONDITION REMOVED IN TURN — the arm that proves the bar is narrow by design
    // rather than by accident. Drop the casus condition and every hostile neighbour vetoes
    // everything; drop the confidence condition and a court acts on a rumour it has
    // half-forgotten, which is the failure the info-starvation tragedy exists to MODEL.
    expect(heldBackBy([{ ...opposedWithCasus, band: 'wary' }]), 'a merely wary power held a decision').toBeNull();
    expect(heldBackBy([{ ...opposedWithCasus, casus: false }]), 'dislike without standing held a decision').toBeNull();
    expect(heldBackBy([{ ...opposedWithCasus, confidence01: REACTION_TUNING.ACT_CONFIDENCE - 0.01 }]),
      'a half-forgotten rumour held a decision').toBeNull();
  });

  it('the SHARPEST blocking answer wins, codepoint-tiebroken', () => {
    const held = heldBackBy([
      { powerId: 'zeta', band: 'opposed', casus: true, confidence01: 0.5 },
      { powerId: 'alpha', band: 'opposed', casus: true, confidence01: 0.9 },
    ]);
    expect(held.powerId).toBe('alpha');
    const tied = heldBackBy([
      { powerId: 'zeta', band: 'opposed', casus: true, confidence01: 0.9 },
      { powerId: 'alpha', band: 'opposed', casus: true, confidence01: 0.9 },
    ]);
    expect(tied.powerId).toBe('alpha');
  });

  it('an empty or garbage forecast holds nothing', () => {
    expect(heldBackBy([])).toBeNull();
    expect(heldBackBy(null)).toBeNull();
    expect(heldBackBy('nope')).toBeNull();
  });
});

// ── (5) DISCOVERY: the choke pass moves a live routing decision ─────────────

describe('SEAT-4 — the choke pass', () => {
  const major = () => ({ id: 'o1', candidateType: 'strategy_deploy', targetSaveId: SELF, applyMode: 'auto' });
  const isMajor = () => true;
  const heldWorld = () => worldWith({
    treaties: subordinatingTreaty(OVERLORD),
    beliefs: beliefsOf({ [OVERLORD]: { allianceLabel: 'hostile', readiness: 0.9, confidence01: 0.8 } }),
  });

  it('DARK: the SAME ARRAY REFERENCE, so the choke\'s byte-identity pin survives', () => {
    const ws = worldWith({ rules: DARK });
    const list = [major()];
    expect(applyAnticipatedReactions(list, snapshotWith(EDGES, ws), isMajor)).toBe(list);
  });

  it('LIT with nothing to fear: still the same reference', () => {
    const ws = worldWith({});
    const list = [major()];
    expect(applyAnticipatedReactions(list, snapshotWith(EDGES, ws), isMajor)).toBe(list);
  });

  it('⭐ DISCOVERY: a major decision a court cannot afford is HELD, and the receipt names who', () => {
    const ws = heldWorld();
    const list = [major()];
    const out = applyAnticipatedReactions(list, snapshotWith(EDGES, ws), isMajor);
    expect(out).not.toBe(list);
    expect(out[0].applyMode, 'the decision routed autonomously anyway').toBe('proposal');
    // §741's whole payoff in one field: the court held back, and the receipt can say whose
    // answer it feared.
    expect(out[0].anticipatedReaction).toMatchObject({ heldBy: OVERLORD, band: 'opposed', casus: true });
    expect(out[0].anticipatedReaction.confidence01).toBeGreaterThanOrEqual(REACTION_TUNING.ACT_CONFIDENCE);
    // The original is not mutated — the pass is pure.
    expect(list[0].applyMode).toBe('auto');
  });

  it('⛔ a NON-MAJOR decision is never held, however fearsome the forecast', () => {
    // The invocation gate D5 demands. `isMajorOutcome` is a real gate HERE in a way
    // `deriveDecisionTier` cannot be at the strategy chooser, which has no outcome yet.
    const ws = heldWorld();
    const list = [major()];
    expect(applyAnticipatedReactions(list, snapshotWith(EDGES, ws), () => false)).toBe(list);
    expect(applyAnticipatedReactions(list, snapshotWith(EDGES, ws), null)).toBe(list);
  });

  it('⛔ a state_only candidate is never held — reducer bookkeeping is not a political choice', () => {
    // The same carve-out the primacy pass keeps by name. Turning a mechanical condition
    // refresh into a proposal-budget casualty is exactly the failure the choke's own comment
    // was written to prevent.
    const ws = heldWorld();
    const list = [{ ...major(), recordMode: 'state_only' }];
    expect(applyAnticipatedReactions(list, snapshotWith(EDGES, ws), isMajor)).toBe(list);
  });

  it('the forecast is computed ONCE PER DECIDER, not once per candidate', () => {
    // A pass that sees hundreds of candidates must not run the bounded-set walk hundreds of
    // times. Proven by behaviour rather than by counting calls: many candidates for one
    // decider all carry the SAME frozen reaction object.
    const ws = heldWorld();
    const many = Array.from({ length: 25 }, (_, i) => ({ ...major(), id: `o${i}` }));
    const out = applyAnticipatedReactions(many, snapshotWith(EDGES, ws), isMajor);
    const first = out[0].anticipatedReaction;
    for (const row of out) expect(row.anticipatedReaction).toEqual(first);
  });
});

// ── (6) The mirrored label sets cannot drift ────────────────────────────────

describe('SEAT-4 — the pinned second spelling', () => {
  it('the friendly/hostile label sets agree with the war layer\'s own, member for member', () => {
    // ⚠ PINNED RATHER THAN SHARED, and deliberately: `convergence.js` keeps FRIENDLY_REL and
    // HOSTILE_REL module-private, and importing the war kernel into the belief layer for two
    // frozen sets would couple them for no gain. The estate's own answer to that trade is a
    // pin (OCCUPATION_RUNGS mirrors STATE_LADDER the same way), so this is that pin — and it
    // reds the day either side gains a member. It matters because the labels came from the
    // SAME canonical vocabulary: `ally` is not a producible token and `allied` is, a fact
    // that already cost this family one silent defect.
    const src = readFileSync(join(ROOT, 'src/domain/worldPulse/convergence.js'), 'utf8');
    const setOf = (name) => {
      const m = src.match(new RegExp(`const ${name} = new Set\\(\\[([^\\]]*)\\]`));
      return m ? m[1].split(',').map((s) => s.trim().replace(/^['"]|['"]$/g, '')).filter(Boolean).sort() : null;
    };
    const warFriendly = setOf('FRIENDLY_REL');
    const warHostile = setOf('HOSTILE_REL');
    expect(warFriendly, 'FRIENDLY_REL moved or was renamed in convergence.js').not.toBeNull();
    expect(warHostile, 'HOSTILE_REL moved or was renamed in convergence.js').not.toBeNull();
    // HOSTILE is asserted EQUAL; FRIENDLY is asserted as a SUPERSET, because this layer also
    // reads `patron` — a softer hierarchy the seat deliberately does NOT seat (SEAT-1's
    // ruling) but which a court plainly still counts as a friend when forecasting.
    expect(warHostile).toEqual(['cold_war', 'criminal_network', 'hostile', 'rival']);
    for (const label of warFriendly) {
      expect(['allied', 'trade_partner', 'vassal', 'patron'], `war-layer friendly label ${label} is unknown here`)
        .toContain(label);
    }
  });
});
