/**
 * conquestFeasibilityWr8.test.js — WR-8 amendment N2, THE FEASIBILITY BELIEF.
 *
 * The amendment asks for three pins by hand, and each is here because it is the
 * one a plausible-looking implementation would fail:
 *
 *   THE MISTAKEN-FEASIBILITY PIN, BOTH DIRECTIONS, RECEIPTED. A court that
 *   believed a conquest in reach and was wrong, and a court that believed itself
 *   doomed and was not — each with a receipt honest enough to say so after the
 *   fact. A composite that could only ever be right would mean the fog does not
 *   reach this read.
 *
 *   THE BOOKS-COLLAPSE FIXTURE. The same seat, on two states that differ only in
 *   the believed threat, keeping two books below the band and one above it.
 *   Proved on a seat whose books genuinely DIVERGE below the band, because a
 *   fixture whose books already agree proves nothing about collapsing them.
 *
 *   THE FEASIBILITY-ASYMMETRY DIRECTIONAL PIN. Being conquered moves behaviour
 *   more than conquering, proved on ONE MIRRORED STATE PAIR — the same magnitude
 *   pointed both ways — or the band is a number nobody checked.
 *
 * Plus the seam pins the wave cannot ship without: the four consumers draw from
 * the read (not from state), an unknown observation stays unknown instead of
 * becoming a neutral fact, non-overlapping ranges receipt THE GRIND rather than
 * erroring, and the pulse wiring is BYTE-IDENTICAL while the doctrine is dark —
 * with a lit control on the same fixture so the dormancy pin is not vacuous.
 *
 * @enforced-by this file
 */
import { describe, expect, test } from 'vitest';

import * as feasibilityModule from '../../src/domain/worldPulse/conquestFeasibility.js';
import {
  CONQUEST_FEASIBILITY_TUNING,
  collapseSeatBooksUnderThreat,
  conquestMarchAdvised,
  conquestMotivePressure01,
  conquestTermsRange,
  mistakenFeasibilityReceipt,
  readConquestFeasibility,
  termsRangesOverlap,
} from '../../src/domain/worldPulse/conquestFeasibility.js';
import {
  conquestBeliefBandsFor,
  conquestDoctrineActive,
  conquestJoinLift01,
  conquestMarchAdvisedFor,
  conquestMarchOrder,
  openWarFrontCount,
  ownExhaustionWord,
  ownStoresWord,
  ownStrengthBandIndex,
  readConquestFeasibilityFor,
  readConquestIntentFor,
  CONQUEST_REQUIRED_RULES,
  CONQUEST_STAGE_TUNING,
} from '../../src/domain/worldPulse/conquestDoctrineStage.js';
import { hostileTargetsOf } from '../../src/domain/worldPulse/warIntent.js';
import { readCoalitionJoinDecisions } from '../../src/domain/worldPulse/warCoalitionDecision.js';

/** A court that believes itself far the stronger of the pair. */
const CONFIDENT = Object.freeze({
  partyId: 'ironhold',
  counterpartId: 'thornwall',
  ownStrengthBand: 'dominant',
  rivalStrengthBand: 'spent',
  ownAllyStrengthBand: 'pressing',
  rivalAllyStrengthBand: 'quiet',
  ownStoresBand: 'deep',
  ownWarExhaustionBand: 'quiet',
});

/** The rival's own picture: outmatched, friendless, hungry and four years tired. */
const DOOMED = Object.freeze({
  partyId: 'thornwall',
  counterpartId: 'ironhold',
  ownStrengthBand: 'spent',
  rivalStrengthBand: 'dominant',
  ownAllyStrengthBand: 'quiet',
  rivalAllyStrengthBand: 'pressing',
  ownStoresBand: 'bare',
  ownWarExhaustionBand: 'decisive',
});

/**
 * THE MIRROR PAIR, built solely for the asymmetry pin and deliberately separate
 * from the two fixtures above.
 *
 * The asymmetry claim is about DIRECTION, so the two states must differ in
 * nothing but direction — and the reserves leg is NOT direction-symmetric (a
 * court's own granary appears undivided in both reads, by design: a full granary
 * makes a siege survivable exactly as it makes one sustainable). So the mirror
 * gives both courts the SAME reserves and swaps only the two edges, which is the
 * exact condition under which `conquestReach01` of one equals
 * `beingConqueredRisk01` of the other. Reusing CONFIDENT/DOOMED here would have
 * compared two different magnitudes and called the difference an asymmetry.
 */
const MIRROR_STRONG = Object.freeze({
  partyId: 'ironhold',
  counterpartId: 'thornwall',
  ownStrengthBand: 'dominant',
  rivalStrengthBand: 'spent',
  ownAllyStrengthBand: 'pressing',
  rivalAllyStrengthBand: 'quiet',
  ownStoresBand: 'stocked',
  ownWarExhaustionBand: 'present',
});

const MIRROR_WEAK = Object.freeze({
  partyId: 'thornwall',
  counterpartId: 'ironhold',
  ownStrengthBand: 'spent',
  rivalStrengthBand: 'dominant',
  ownAllyStrengthBand: 'quiet',
  rivalAllyStrengthBand: 'pressing',
  // The reserves leg is held IDENTICAL on purpose — see the note above.
  ownStoresBand: 'stocked',
  ownWarExhaustionBand: 'present',
});

describe('WR-8 N2 — the feasibility belief composite', () => {
  test('the three legs are read, banded, and receipted in the court own voice', () => {
    const read = readConquestFeasibility(CONFIDENT);
    expect(read.known).toBe(true);
    expect(read.believedRelativeStrength01).toBeGreaterThan(0.5);
    expect(read.believedCoalitionReach01).toBeGreaterThan(0.5);
    expect(read.believedHomeFrontReserves01).toBeGreaterThan(0.5);
    expect(read.conquestReachBand).toBe('assured');
    expect(read.threatBand).toBe('safe');
    // The receipt names WHAT was believed, in the words the picture used, so a
    // post-hoc reader can see the judgement rather than only its number.
    expect(read.receipt).toContain('ironhold believes a conquest of thornwall is assured');
    expect(read.receipt).toContain('armies dominant against spent');
  });

  test('a missing observation stays unknown and never becomes a neutral fact', () => {
    // The one translation the finite-semantics law forbids. Each leg is dropped
    // in turn, and each time the WHOLE read must go unknown: a court that has not
    // heard about its rival's allies has not concluded they have none.
    for (const field of ['rivalStrengthBand', 'ownAllyStrengthBand', 'ownStoresBand', 'ownWarExhaustionBand']) {
      const read = readConquestFeasibility({ ...CONFIDENT, [field]: 'unknown' });
      expect(read.known, `${field} unknown`).toBe(false);
      expect(read.conquestReach01, `${field} unknown`).toBeNull();
      expect(read.conquestReachBand, `${field} unknown`).toBe('unknown');
      expect(read.beingConqueredRisk01, `${field} unknown`).toBeNull();
      // The known control immediately below proves these nulls are a live
      // selection rather than a composite that returns null for everything.
      expect(conquestMotivePressure01(read), `${field} unknown`).toBeNull();
    }
    expect(conquestMotivePressure01(readConquestFeasibility(CONFIDENT))).toBeGreaterThan(0);
  });

  test('THE ASYMMETRY, DIRECTIONAL, on one mirrored state pair', () => {
    // The two fixtures are exact mirrors: both edges swapped, reserves held
    // equal. So the strong court's outward reach and the weak court's inward
    // risk are the SAME magnitude pointed opposite ways, and any difference in
    // how far behaviour moves is the band and nothing else.
    const confident = readConquestFeasibility(MIRROR_STRONG);
    const doomed = readConquestFeasibility(MIRROR_WEAK);

    const outward = Number(confident.conquestReach01);
    const inward = Number(doomed.beingConqueredRisk01);
    // THE PIN IS STRONGER THAN EQUAL-MAGNITUDE, AND DELIBERATELY SO. The two
    // magnitudes are NOT identical, because the reserves leg is undivided by
    // design (a full granary makes a siege survivable exactly as it makes one
    // sustainable), so it enters the outward read as itself and the inward read
    // as its complement. The weak court's inward magnitude is therefore the
    // SMALLER of the two — and it still moves behaviour further. A composite
    // without the band could not produce that.
    expect(inward).toBeLessThan(outward);

    const attracted = Number(confident.behaviouralWeight01);
    const frightened = Number(doomed.behaviouralWeight01);
    expect(frightened).toBeGreaterThan(attracted);
    expect(CONQUEST_FEASIBILITY_TUNING.EXISTENTIAL_WEIGHT)
      .toBeGreaterThan(CONQUEST_FEASIBILITY_TUNING.ATTRACTIVE_WEIGHT);
    // Each court's weight comes from the arm it should: the strong court is
    // pulled by what it could take, the weak one is shoved by what it could
    // lose. Without these two, the pin above would also pass on a composite that
    // simply always reported fear.
    // Precision 4: every published number is round4'd at the seam, which is the
    // engine's own convention for a value a receipt may quote.
    expect(attracted).toBeCloseTo(outward * CONQUEST_FEASIBILITY_TUNING.ATTRACTIVE_WEIGHT, 4);
    expect(frightened).toBeCloseTo(inward * CONQUEST_FEASIBILITY_TUNING.EXISTENTIAL_WEIGHT, 4);
  });

  test('capability points at movement, and existential threat stops the column', () => {
    expect(conquestMarchAdvised(readConquestFeasibility(CONFIDENT))).toBe(true);
    // A court that believes itself about to be destroyed does not march out,
    // however weak it believes the neighbour to be. This is the asymmetry with
    // teeth: the same court, same rival, one field changed.
    const cornered = readConquestFeasibility({
      ...CONFIDENT, ownStrengthBand: 'spent', ownStoresBand: 'bare', ownWarExhaustionBand: 'decisive',
      ownAllyStrengthBand: 'quiet', rivalAllyStrengthBand: 'decisive', rivalStrengthBand: 'dominant',
    });
    expect(cornered.threatBand).toBe('existential');
    expect(conquestMarchAdvised(cornered)).toBe(false);
    expect(conquestMarchAdvised(readConquestFeasibility({ ...CONFIDENT, ownStrengthBand: 'unknown' }))).toBe(false);
  });

  test('the bargaining range has two believed ends, and non-overlap IS the grind', () => {
    const strong = conquestTermsRange(readConquestFeasibility(CONFIDENT));
    const weak = conquestTermsRange(readConquestFeasibility(DOOMED));
    expect(strong.known).toBe(true);
    expect(strong.takeByForce01).toBeGreaterThan(Number(strong.mustGiveToSurvive01));
    expect(strong.receipt).toContain('could take');

    // These two courts agree about the world, so their ranges overlap and a
    // settlement exists between them.
    const agreed = termsRangesOverlap(strong, weak);
    expect(agreed.overlaps).toBe(true);
    expect(agreed.receipt).toContain('a settlement exists');

    // Now two courts that BOTH believe themselves the stronger — the classic
    // mutual overestimate. Neither will give what the other means to take.
    const bothProud = conquestTermsRange(readConquestFeasibility({
      ...CONFIDENT, partyId: 'thornwall', counterpartId: 'ironhold',
    }));
    const ground = termsRangesOverlap(strong, bothProud);
    expect(ground.overlaps).toBe(false);
    expect(ground.known).toBe(true);
    // Not an error, not a throw, not a null: a receipted outcome. The war grinds.
    expect(ground.receipt).toContain('the war grinds on');
  });

  test('THE K.6 VOTE HAS EXACTLY ONE DERIVATION, AND IT IS NOT HERE (F4)', () => {
    // Lane W8-C deleted `conquestVoteWeight01`. It was a SECOND answer to the
    // question chair ruling CR-WIRE-A had already closed: the ratification vote's
    // power band comes from the member's own frozen negotiation picture, through
    // envoyRatificationStage's single one-argument derivation, whose signature is
    // source-scanned precisely so no second channel can appear. This pin is what
    // keeps the fork from growing back — it is an ABSENCE pin, so it asserts the
    // module still exports its live surface first, or an empty module would pass.
    expect(typeof feasibilityModule.readConquestFeasibility).toBe('function');
    expect(typeof feasibilityModule.conquestMarchAdvised).toBe('function');
    expect(feasibilityModule.conquestVoteWeight01).toBeUndefined();
    expect(Object.keys(feasibilityModule)).not.toContain('conquestVoteWeight01');
    // VOTE_FLOOR stays: it is the ruling's own record of where the floor sat.
    expect(CONQUEST_FEASIBILITY_TUNING.VOTE_FLOOR).toBeGreaterThan(0);
  });

  test('THE UNWIRED LEDGER IS TRUE (F5) — every deferred read is still exported', () => {
    // The module header names four exports as deliberately-deferred-with-a-consumer
    // rather than dead. If a later sweep deletes one, this reds and points at the
    // ledger, so "documented, not a bug to re-find" stays a fact rather than a
    // comment. Each is exercised for real above; this pin owns the LIST.
    for (const name of ['conquestMotivePressure01', 'conquestTermsRange',
      'termsRangesOverlap', 'collapseSeatBooksUnderThreat']) {
      expect(typeof feasibilityModule[name], `${name} is in the unwired ledger`).toBe('function');
    }
  });
});

describe('WR-8 N2 — the books collapse under an existential threat', () => {
  // A seat whose books genuinely DIVERGE: a precarious ruler keeping nearly half
  // the decision for itself. Collapsing books that already agree would prove
  // nothing, so the fixture is chosen to have something to collapse.
  const DIVIDED_SEAT = Object.freeze({
    settlementWeight01: 0.55,
    seatWeight01: 0.45,
    patronWeight01: 0,
    continueBias01: 0.8,
    peaceBias01: 0.2,
  });

  test('below the band the seat keeps two books; above it, one', () => {
    const calm = readConquestFeasibility(CONFIDENT);
    const kept = collapseSeatBooksUnderThreat(DIVIDED_SEAT, calm);
    expect(kept.collapsed).toBe(false);
    // Untouched — the ruler and the realm still choose from different books.
    expect(kept.settlementWeight01).toBe(0.55);
    expect(kept.seatWeight01).toBe(0.45);
    expect(kept.receipt).toContain('keeps its own books');

    const doomed = readConquestFeasibility(DOOMED);
    expect(Number(doomed.beingConqueredRisk01))
      .toBeGreaterThanOrEqual(CONQUEST_FEASIBILITY_TUNING.BOOKS_COLLAPSE_FLOOR);
    const folded = collapseSeatBooksUnderThreat(DIVIDED_SEAT, doomed);
    expect(folded.collapsed).toBe(true);
    // The private book SHRANK and the realm's grew by exactly what it lost: the
    // two books are converging, not being replaced.
    expect(folded.seatWeight01).toBeLessThan(0.45);
    expect(folded.settlementWeight01).toBeGreaterThan(0.55);
    expect(folded.settlementWeight01 + folded.seatWeight01 + folded.patronWeight01).toBeCloseTo(1, 6);
    expect(folded.receipt).toContain('a ruler of ashes rules nothing');
  });

  test('a covert patron book folds the same way, and the collapse has a slope', () => {
    const patronSeat = { settlementWeight01: 0.5, seatWeight01: 0, patronWeight01: 0.5 };
    const doomed = readConquestFeasibility(DOOMED);
    const folded = collapseSeatBooksUnderThreat(patronSeat, doomed);
    expect(folded.patronWeight01).toBeLessThan(0.5);
    expect(folded.collapse01).toBeGreaterThan(0);
    // A slope, not a cliff: a court one point over the floor is not instantly
    // selfless. Build a read exactly at the floor and prove the collapse is ~0.
    const atFloor = collapseSeatBooksUnderThreat(patronSeat, {
      partyId: 'x', counterpartId: 'y', known: true,
      beingConqueredRisk01: CONQUEST_FEASIBILITY_TUNING.BOOKS_COLLAPSE_FLOOR,
      threatBand: 'existential', receipt: '',
    });
    expect(atFloor.collapsed).toBe(true);
    expect(atFloor.collapse01).toBe(0);
    expect(atFloor.patronWeight01).toBe(0.5);
  });
});

describe('WR-8 N2 — the mistaken-feasibility receipt, BOTH directions', () => {
  test('a court that believed a conquest in reach, and was wrong', () => {
    const read = readConquestFeasibility(CONFIDENT);
    expect(conquestMarchAdvised(read)).toBe(true);
    const wrong = mistakenFeasibilityReceipt(read, { conquestSucceeded: false });
    expect(wrong.mistaken).toBe(true);
    expect(wrong.direction).toBe('overreached');
    expect(wrong.receipt).toContain('marched believing thornwall within reach, and it was not');
    // The belief is QUOTED, not rewritten: the receipt carries the judgement as
    // it was made, which is the only evidence the fog was real.
    expect(wrong.receipt).toContain(read.receipt);
    // And the same court, right, is not accused of a mistake.
    expect(mistakenFeasibilityReceipt(read, { conquestSucceeded: true }).mistaken).toBe(false);
  });

  test('a court that believed itself doomed, and was not', () => {
    const read = readConquestFeasibility(DOOMED);
    expect(read.threatBand).toBe('existential');
    const wrong = mistakenFeasibilityReceipt(read, { wasConquered: false });
    expect(wrong.mistaken).toBe(true);
    expect(wrong.direction).toBe('despaired');
    expect(wrong.receipt).toContain('gave away what it did not have to give');
    expect(wrong.receipt).toContain(read.receipt);
    expect(mistakenFeasibilityReceipt(read, { wasConquered: true }).mistaken).toBe(false);
  });

  test('a court with no judgement is not credited with a mistaken one', () => {
    const blind = readConquestFeasibility({ ...CONFIDENT, rivalStrengthBand: 'unknown' });
    const receipt = mistakenFeasibilityReceipt(blind, { conquestSucceeded: false });
    expect(receipt.mistaken).toBe(false);
    expect(receipt.receipt).toContain('held no judgement to be wrong about');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// THE PULSE WIRING. `hostileTargetsOf` is the one chokepoint both war-opening
// consumers pass through, so the stage is wired there. These pins hold the
// dormancy fence AND prove it is not vacuous, on the same fixture.
// ─────────────────────────────────────────────────────────────────────────────

const LIT_RULES = Object.freeze(Object.fromEntries(
  CONQUEST_REQUIRED_RULES.map((key) => [key, true]),
));

function beliefWorld(rules) {
  return {
    // `infoMode` is load-bearing and defaults to 'omniscient', under which the
    // belief layer is dormant by design and the conquest read has nothing to
    // read. A fogged world is the only world in which this stage does anything.
    simulationRules: { ...rules, infoMode: 'unreliable' },
    spatialCanonVersion: 1,
    // WR-2's ledger gives the court its temper. Without it the INTENT half is
    // unreadable and nothing is ever advised, which is the N3 negative case
    // pinned separately below.
    dispositionStats: { ironhold: { channels: { martial: { stock01: 0.9 } } } },
    relationshipStates: {},
    spatialLedgers: {
      beliefMaps: {
        ironhold: {
          seat: {
            // The court believes the far-off `zeta` is spent and thornwall strong,
            // so a conquest of `zeta` is what it believes is in reach — and `zeta`
            // sorts LAST codepoint-wise, which is what makes the reorder visible.
            // `faithLabel` is the I4 road's landing site: the court believes
            // zeta kneels at an evil altar, which is what licenses the war.
            zeta: { strengthBand: 0, allianceLabel: 'hostile', faithLabel: 'The Iron Maw', confidence01: 1 },
            thornwall: { strengthBand: 4, allianceLabel: 'hostile', confidence01: 1 },
            ironhold: { strengthBand: 4, allianceLabel: 'self', confidence01: 1 },
            everdeep: { strengthBand: 3, allianceLabel: 'allied', confidence01: 1 },
          },
        },
      },
    },
  };
}

function snapshotFor(worldState) {
  const stocked = {
    id: 'ironhold',
    settlement: {
      name: 'Ironhold',
      tier: 'city',
      population: 45000,
      economicState: { foodSecurity: { storageMonths: 9, resilienceScore: 70 } },
      config: { primaryDeitySnapshot: { name: 'The Hammer', alignmentAxis: 'evil' } },
    },
  };
  const byId = new Map([
    ['ironhold', stocked],
    ['thornwall', { id: 'thornwall', settlement: { name: 'Thornwall', tier: 'town', population: 3000 } }],
    ['zeta', {
      id: 'zeta',
      settlement: {
        name: 'Zeta',
        tier: 'village',
        population: 400,
        // The world's own record of who The Iron Maw is. The court's BELIEF
        // names the god; the god's character is public.
        config: { primaryDeitySnapshot: { name: 'The Iron Maw', alignmentAxis: 'evil' } },
      },
    }],
  ]);
  return {
    settlements: [...byId.values()],
    byId,
    worldState,
    regionalGraph: {
      edges: [
        { from: 'ironhold', to: 'thornwall', type: 'hostile' },
        { from: 'ironhold', to: 'zeta', type: 'hostile' },
      ],
    },
  };
}

describe('WR-8 N2 — the movement wiring', () => {
  test('the activation gate demands the whole lit chain, explicitly', () => {
    expect(conquestDoctrineActive(beliefWorld(LIT_RULES))).toBe(true);
    expect(conquestDoctrineActive({ simulationRules: {} })).toBe(false);
    expect(conquestDoctrineActive(null)).toBe(false);
    // EVERY prerequisite is load-bearing: drop each in turn and the doctrine goes
    // dark. This is the flag-dependency ruling — WR-8 lights LAST — held as a
    // structural fact rather than a docstring claim.
    for (const key of CONQUEST_REQUIRED_RULES) {
      const partial = { ...LIT_RULES };
      delete partial[key];
      expect(conquestDoctrineActive({ simulationRules: partial }), `${key} missing`).toBe(false);
    }
  });

  test('DARK: the candidate list comes back as THE SAME ARRAY REFERENCE', () => {
    const dark = beliefWorld({ warLayerEnabled: true, peaceEngineEnabled: true });
    const snapshot = snapshotFor(dark);
    const targets = hostileTargetsOf(snapshot, 'ironhold', 4);
    expect(targets).toEqual(['thornwall', 'zeta']);
    // Byte-identity, not equality: the stage must hand back the exact reference
    // it was given, so the dormant loop allocates nothing and cannot reorder.
    expect(conquestMarchOrder({ worldState: dark, snapshot, fromId: 'ironhold', targets }))
      .toBe(targets);
    // THE INNER GATE, PINNED SEPARATELY AND ON PURPOSE. Dormancy here is held by
    // TWO gates — one at the order, one at the assembly — and a mutant that
    // removes only the first survives the reference-identity pin above, because
    // the second still refuses to produce a read. That is defence in depth, not
    // a hole, but it means the pin above does not on its own prove either gate
    // is live. This assertion is owned by the assembly gate alone.
    expect(conquestBeliefBandsFor({
      worldState: dark, snapshot, observerId: 'ironhold', rivalId: 'zeta', openFronts: 2,
    })).toBeNull();
    // …and the same call in a LIT world returns a real row, so the null above is
    // a live refusal rather than an assembler that never produces anything.
    expect(conquestBeliefBandsFor({
      worldState: beliefWorld(LIT_RULES), snapshot, observerId: 'ironhold', rivalId: 'zeta', openFronts: 2,
    })).not.toBeNull();
  });

  test('LIT: the war the court believes it can win is offered first', () => {
    const lit = beliefWorld(LIT_RULES);
    const snapshot = snapshotFor(lit);
    // The lit control is what makes the dormancy pin above non-vacuous: the same
    // fixture, the same call, and the order genuinely moves.
    expect(hostileTargetsOf(snapshot, 'ironhold', 4)).toEqual(['zeta', 'thornwall']);

    const read = readConquestFeasibilityFor({
      worldState: lit, snapshot, observerId: 'ironhold', rivalId: 'zeta', openFronts: 2,
    });
    expect(read && read.known).toBe(true);
    expect(read && conquestMarchAdvised(read)).toBe(true);
    // …and the rival it believes strong is NOT advised, so the reorder is a
    // decision rather than a blanket promotion.
    const hard = readConquestFeasibilityFor({
      worldState: lit, snapshot, observerId: 'ironhold', rivalId: 'thornwall', openFronts: 2,
    });
    expect(hard && conquestMarchAdvised(hard)).toBe(false);
  });

  test('N3 AT THE SEAM: capability without intent advances nothing', () => {
    // The court still believes zeta is easy prey — the feasibility half is
    // untouched and is asserted below. What is removed is its TEMPER: with no
    // WR-2 disposition on record the intent is unreadable, and an unreadable
    // intent is not a permissive one. This is the negative case the whole N3
    // amendment exists for, held at the exact seam where capability would
    // otherwise leak into movement.
    const lit = beliefWorld(LIT_RULES);
    delete lit.dispositionStats;
    const snapshot = snapshotFor(lit);
    const read = readConquestFeasibilityFor({
      worldState: lit, snapshot, observerId: 'ironhold', rivalId: 'zeta', openFronts: 2,
    });
    expect(read && conquestMarchAdvised(read)).toBe(true);
    const intent = readConquestIntentFor({
      worldState: lit, snapshot, observerId: 'ironhold', rivalId: 'zeta',
    });
    expect(intent && intent.known).toBe(false);
    expect(intent && intent.intent).toBe('none');
    expect(hostileTargetsOf(snapshot, 'ironhold', 4)).toEqual(['thornwall', 'zeta']);
  });

  test('N3 AT THE SEAM: a court that believes the target decent refuses the march', () => {
    // Capability identical, temper identical. The court is simply told the
    // truth about whom zeta worships — a good god — and a conquest it was about
    // to open stops being one it will open. The I4 road runs the other way from
    // here.
    const lit = beliefWorld(LIT_RULES);
    const snapshot = snapshotFor(lit);
    snapshot.byId.get('zeta').settlement.config.primaryDeitySnapshot.alignmentAxis = 'good';
    const intent = readConquestIntentFor({
      worldState: lit, snapshot, observerId: 'ironhold', rivalId: 'zeta',
    });
    expect(intent && intent.known).toBe(true);
    expect(hostileTargetsOf(snapshot, 'ironhold', 4)).toEqual(['thornwall', 'zeta']);
  });

  test('LIT but blind: no belief about the rival leaves the order untouched', () => {
    const lit = beliefWorld(LIT_RULES);
    delete lit.spatialLedgers.beliefMaps.ironhold.seat.zeta;
    const snapshot = snapshotFor(lit);
    const targets = hostileTargetsOf(snapshot, 'ironhold', 4);
    // Silence is not a neutral fact here either: with no picture of `zeta` the
    // court has no reason to prefer it, and the list stands as it was.
    expect(targets).toEqual(['thornwall', 'zeta']);
    expect(readConquestFeasibilityFor({
      worldState: lit, snapshot, observerId: 'ironhold', rivalId: 'zeta',
    })).toBeNull();
  });

  test('the self-reads band honestly, and an absent granary reads unknown', () => {
    expect(ownStoresWord({ settlement: { economicState: { foodSecurity: { storageMonths: 0 } } } })).toBe('bare');
    expect(ownStoresWord({ settlement: { economicState: { foodSecurity: { storageMonths: 99 } } } })).toBe('deep');
    expect(ownStoresWord({ settlement: {} })).toBe('unknown');
    expect(ownStoresWord(null)).toBe('unknown');
    // F3: the ladder now maps FRONTS, not candidates-minus-one. A realm at peace
    // is quiet; the first live war is `present`; four fronts is decisive.
    expect(ownExhaustionWord(0)).toBe('quiet');
    expect(ownExhaustionWord(1)).toBe('present');
    expect(ownExhaustionWord(3)).toBe('pressing');
    expect(ownExhaustionWord(4)).toBe('decisive');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// LANE W8-C — THE VERIFIER'S FINDINGS, EACH PINNED BY THE THING THAT WAS WRONG.
// ─────────────────────────────────────────────────────────────────────────────

describe('W8-C F3 — openFronts counts fronts, and the name matches the number', () => {
  /** A graph carrying real war-layer fronts plus one decoy hostile-relationship front. */
  const frontGraph = {
    channels: [
      { type: 'war_front', from: 'ironhold', to: 'zeta', status: 'confirmed', evidence: [{ source: 'war_layer_deploy' }] },
      { type: 'war_front', from: 'thornwall', to: 'ironhold', status: 'confirmed', evidence: [{ source: 'war_layer_deploy' }] },
      // THE DECOY. A bare hostile-RELATIONSHIP bundle is not a war. If the census
      // counted it, a realm at peace with two sour neighbours would read weary.
      { type: 'war_front', from: 'ironhold', to: 'everdeep', status: 'confirmed', evidence: [{ source: 'relationship_label' }] },
    ],
  };

  test('both directions count, the relationship decoy does not, and duplicates collapse', () => {
    expect(openWarFrontCount({ regionalGraph: frontGraph }, 'ironhold')).toBe(2);
    expect(openWarFrontCount({ regionalGraph: frontGraph }, 'zeta')).toBe(1);
    // A settlement in nobody's war. Reading 0 here is what makes the band's floor
    // reachable — under the old candidate-count wiring it never was.
    expect(openWarFrontCount({ regionalGraph: frontGraph }, 'nowhere')).toBe(0);
    expect(openWarFrontCount({}, 'ironhold')).toBe(0);
    expect(openWarFrontCount(null, 'ironhold')).toBe(0);
    // Two channels between the SAME pair are ONE front.
    expect(openWarFrontCount({
      regionalGraph: {
        channels: [
          { type: 'war_front', from: 'a', to: 'b', status: 'confirmed', evidence: [{ source: 'war_layer_deploy' }] },
          { type: 'war_front', from: 'b', to: 'a', status: 'confirmed', evidence: [{ source: 'war_layer_deploy' }] },
        ],
      },
    }, 'a')).toBe(1);
  });

  test('THE SEMANTIC REPAIR IS OBSERVABLE: candidates no longer move the band', () => {
    // The defect in one assertion. The court's hostile-candidate list and its
    // actual wars are now independent: with the SAME two candidates, adding real
    // fronts to the graph moves the exhaustion band, and it did not before.
    const lit = beliefWorld(LIT_RULES);
    const quiet = snapshotFor(lit);
    const atWar = { ...snapshotFor(lit), regionalGraph: { ...quiet.regionalGraph, channels: frontGraph.channels } };
    const bandOf = (snap) => conquestBeliefBandsFor({
      worldState: lit, snapshot: snap, observerId: 'ironhold', rivalId: 'zeta',
      openFronts: openWarFrontCount(snap, 'ironhold'),
    }).ownWarExhaustionBand;
    expect(bandOf(quiet)).toBe('quiet');
    // Two real fronts (the third channel is the relationship decoy) ⇒ `pressing`.
    expect(bandOf(atWar)).toBe('pressing');
  });
});

describe('W8-C F2 — the own-strength leg is alive, and the constant is dead', () => {
  test('THE BAND VARIES ACROSS COURTS in a world with no self-records at all', () => {
    const lit = beliefWorld(LIT_RULES);
    // The production shape: NOTHING seeds a self-record, because advanceBeliefMaps
    // only ever writes an observer's NEIGHBOURS. This is the state every generated
    // world is in, and it is the state in which the old leg returned the literal
    // middle band for every court in every world.
    delete lit.spatialLedgers.beliefMaps.ironhold.seat.ironhold;
    const snapshot = snapshotFor(lit);
    // ⚠️ ASSERTED THROUGH THE ASSEMBLER, NOT THROUGH THE READER. An earlier draft
    // of this pin called `ownStrengthBandIndex` directly and a mutant that put the
    // literal constant BACK into `conquestBeliefBandsFor` left it green — the
    // producer still varied, the consumer had stopped asking. The spread is
    // therefore read off the ROW the composite actually eats.
    const wordFor = (id) => conquestBeliefBandsFor({
      worldState: lit, snapshot, observerId: id, rivalId: id === 'zeta' ? 'thornwall' : 'zeta',
    })?.ownStrengthBand;
    // Each court needs a belief about the rival it is measured against, or the row
    // is silence for the honest reason and this pin proves nothing.
    lit.spatialLedgers.beliefMaps.thornwall = { seat: { zeta: { strengthBand: 2, allianceLabel: 'hostile', confidence01: 1 } } };
    lit.spatialLedgers.beliefMaps.zeta = { seat: { thornwall: { strengthBand: 2, allianceLabel: 'hostile', confidence01: 1 } } };
    const words = ['ironhold', 'thornwall', 'zeta'].map(wordFor);
    for (const word of words) expect(typeof word, JSON.stringify(words)).toBe('string');
    // THE PIN THE CHAIR ASKED FOR: a real spread. A 45,000-soul city, a 3,000-soul
    // town and a 400-soul village cannot all be the same band, and under the old
    // code they were — every court in every world read the literal `ready`.
    expect(new Set(words).size, JSON.stringify(words)).toBeGreaterThan(1);
    const ladder = ['spent', 'strained', 'ready', 'strong', 'dominant'];
    expect(ladder.indexOf(words[0])).toBeGreaterThan(ladder.indexOf(words[2]));
    // …and the direct reader agrees with the assembled row, so the two are one leg.
    expect(words[0]).toBe(ladder[Number(ownStrengthBandIndex(snapshot, 'ironhold'))]);
  });

  test('the assembled row uses the self-read, and it reaches the composite', () => {
    const lit = beliefWorld(LIT_RULES);
    delete lit.spatialLedgers.beliefMaps.ironhold.seat.ironhold;
    const snapshot = snapshotFor(lit);
    const row = conquestBeliefBandsFor({
      worldState: lit, snapshot, observerId: 'ironhold', rivalId: 'zeta',
    });
    // The row is readable with NO self-record present — which is the whole repair.
    expect(row).not.toBeNull();
    const expectedWord = ['spent', 'strained', 'ready', 'strong', 'dominant'][
      Number(ownStrengthBandIndex(snapshot, 'ironhold'))
    ];
    expect(row.ownStrengthBand).toBe(expectedWord);
  });

  test('SILENCE, NEVER A FLATTERING DEFAULT: an unreadable own strength is null', () => {
    const lit = beliefWorld(LIT_RULES);
    const snapshot = snapshotFor(lit);
    // A court the snapshot does not carry cannot price itself. Null, not `ready`.
    expect(ownStrengthBandIndex(snapshot, 'nobody')).toBeNull();
    expect(conquestBeliefBandsFor({
      worldState: lit, snapshot, observerId: 'nobody', rivalId: 'zeta',
    })).toBeNull();
  });

  test('the self-read stays a SELF read — the rival band is still belief-sourced', () => {
    // K3's fence in one assertion: move only what the court BELIEVES about zeta and
    // the row moves; the truth about zeta never entered the rival leg.
    const lit = beliefWorld(LIT_RULES);
    const snapshot = snapshotFor(lit);
    const before = conquestBeliefBandsFor({
      worldState: lit, snapshot, observerId: 'ironhold', rivalId: 'zeta',
    });
    expect(before.rivalStrengthBand).toBe('spent');
    lit.spatialLedgers.beliefMaps.ironhold.seat.zeta.strengthBand = 4;
    const after = conquestBeliefBandsFor({
      worldState: lit, snapshot, observerId: 'ironhold', rivalId: 'zeta',
    });
    // Identical snapshot, identical truth, different belief ⇒ different row.
    expect(after.rivalStrengthBand).toBe('dominant');
    expect(after.ownStrengthBand).toBe(before.ownStrengthBand);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// W8-C F1 — BOTH war-opening consumers reach the belief, through ONE derivation.
// The shipped claim said `hostileTargetsOf` was the chokepoint both pass through.
// It was not: the opener's coalition arm short-circuits to an empty target list
// and never calls it. These pins hold BOTH arms' reachability, so the corrected
// claim is a fact rather than a second sentence.
// ─────────────────────────────────────────────────────────────────────────────

describe('W8-C F1 — the coalition consumer reaches the same derivation', () => {
  // THE DORMANCY CONTROL IS ONE FLAG. The dark world is the LIT world with
  // `conquestDoctrineEnabled` removed and NOTHING else changed — WR-6's own four
  // flags stay lit in both, so the coalition census itself is identical and the
  // only thing that can differ is WR-8's term.
  const COALITION_DARK_RULES = Object.freeze(Object.fromEntries(
    CONQUEST_REQUIRED_RULES.filter((key) => key !== 'conquestDoctrineEnabled').map((key) => [key, true]),
  ));

  const COALITION_EDGES = Object.freeze([
    { id: 'everdeep|ironhold', from: 'everdeep', to: 'ironhold', relationshipType: 'allied' },
    { id: 'everdeep|zeta', from: 'everdeep', to: 'zeta', relationshipType: 'hostile' },
    { id: 'ironhold|zeta', from: 'ironhold', to: 'zeta', relationshipType: 'hostile' },
    { id: 'ironhold|thornwall', from: 'ironhold', to: 'thornwall', relationshipType: 'hostile' },
  ]);

  /** A world where `everdeep` is at war with `zeta` and calls its ally `ironhold`. */
  function coalitionWorld(rules) {
    const world = beliefWorld(rules);
    world.tick = 5;
    world.deployments = {
      everdeep: {
        targetId: 'zeta',
        sinceTick: 2,
        casusReasons: [{ type: 'grievance', score: 0.8, atTick: 2 }],
      },
    };
    world.relationshipStates = {
      'everdeep|ironhold': { relationshipType: 'allied', pactStrength: 0.9, trust: 0.9, dependency: 0.6 },
      'everdeep|zeta': { relationshipType: 'hostile' },
      'ironhold|zeta': { relationshipType: 'hostile' },
      'ironhold|thornwall': { relationshipType: 'hostile' },
    };
    world.spatialLedgers.warReasons = {
      'everdeep>zeta': {
        reasons: { grievance: { type: 'grievance', score: 0.8, sinceTick: 2, tick: 5 } },
        updatedTick: 5,
      },
    };
    return world;
  }

  function coalitionSnapshot(world) {
    const snapshot = snapshotFor(world);
    snapshot.byId.set('everdeep', {
      id: 'everdeep',
      settlement: { name: 'Everdeep', tier: 'town', population: 5000, powerStructure: { factions: [] } },
    });
    snapshot.settlements = [...snapshot.byId.values()];
    snapshot.regionalGraph = { edges: [...COALITION_EDGES] };
    snapshot.worldState = world;
    return snapshot;
  }

  test('THE MEASUREMENT THAT PROVES THE OLD CLAIM FALSE', () => {
    // `hostileTargetsOf` is where the shipped wiring put the belief. The coalition
    // decision never calls it — it is handed one named enemy. So the two arms
    // cannot share that seam, whatever the docstring said; what they share is the
    // derivation, and that is what these pins assert.
    const lit = coalitionWorld(LIT_RULES);
    const snapshot = coalitionSnapshot(lit);
    // ARM 1 (strategy chooser): reached through the ordering seam.
    expect(hostileTargetsOf(snapshot, 'ironhold', 4)).toEqual(['zeta', 'thornwall']);
    // ARM 2 (coalition): reached through its own seam, SAME derivation, non-zero.
    expect(conquestJoinLift01({
      worldState: lit, snapshot, observerId: 'ironhold', rivalId: 'zeta',
    })).toBe(CONQUEST_STAGE_TUNING.COALITION_JOIN_LIFT01);
    // …and BOTH arms agree, because both call `conquestMarchAdvisedFor`.
    expect(conquestMarchAdvisedFor({
      worldState: lit, snapshot, observerId: 'ironhold', rivalId: 'zeta',
    })).toBe(true);
    expect(conquestMarchAdvisedFor({
      worldState: lit, snapshot, observerId: 'ironhold', rivalId: 'thornwall',
    })).toBe(false);
  });

  test('LIT: the lift reaches the live join decision and is receipted on it', () => {
    const lit = coalitionWorld(LIT_RULES);
    const snapshot = coalitionSnapshot(lit);
    const decisions = readCoalitionJoinDecisions({
      snapshot, worldState: lit, tick: 4, strengthFor: () => 0.5,
    });
    const ironhold = decisions.find((d) => d.partyId === 'ironhold' && d.enemyId === 'zeta');
    expect(ironhold).toBeTruthy();
    // The receipt is on the decision itself, so the term is inspectable rather
    // than merely folded into a float.
    expect(ironhold.conquestLift01).toBe(CONQUEST_STAGE_TUNING.COALITION_JOIN_LIFT01);
  });

  test('DARK: the same decision carries a lift of EXACTLY zero, and the same score', () => {
    // The dormancy fence for arm 2, and it is not vacuous: the lit run above found
    // the same decision with a non-zero lift on the same fixture.
    const dark = coalitionWorld(COALITION_DARK_RULES);
    const snapshot = coalitionSnapshot(dark);
    const decisions = readCoalitionJoinDecisions({
      snapshot, worldState: dark, tick: 4, strengthFor: () => 0.5,
    });
    const ironhold = decisions.find((d) => d.partyId === 'ironhold' && d.enemyId === 'zeta');
    expect(ironhold).toBeTruthy();
    expect(ironhold.conquestLift01).toBe(0);

    // THE TWO GATES, SEPARATED — and this assertion exists because mutation said
    // it had to. The coalition arm's dormancy is held by TWO checks (the assembly
    // gate in `conquestBeliefBandsFor` and the hot-loop short-circuit in
    // `conquestMarchAdvisedFor`), and each alone kept the zero-lift pin above
    // green while the other stood. That is defence in depth, not a hole, but it
    // means the pin above proves neither gate is live. This one is owned by the
    // ASSEMBLY gate alone: dark ⇒ the assembler refuses outright…
    expect(conquestBeliefBandsFor({
      worldState: dark, snapshot, observerId: 'ironhold', rivalId: 'zeta',
    })).toBeNull();
    // …and lit, on the same fixture, it produces a real row, so the null is a
    // live refusal rather than an assembler that never produces anything.
    expect(conquestBeliefBandsFor({
      worldState: coalitionWorld(LIT_RULES), snapshot, observerId: 'ironhold', rivalId: 'zeta',
    })).not.toBeNull();

    // …and the score is the pre-wire float: identical to the lit run MINUS the
    // lift, which is what "lift-only, nothing else moved" means.
    const lit = coalitionWorld(LIT_RULES);
    const litDecision = readCoalitionJoinDecisions({
      snapshot: coalitionSnapshot(lit), worldState: lit, tick: 4, strengthFor: () => 0.5,
    }).find((d) => d.partyId === 'ironhold' && d.enemyId === 'zeta');
    expect(litDecision.score01).toBeCloseTo(
      ironhold.score01 + CONQUEST_STAGE_TUNING.COALITION_JOIN_LIFT01, 10,
    );
  });

  test('THE CENSUS IS UNTOUCHED: the lift creates no candidate it did not have', () => {
    // The hardest thing to get wrong quietly. A weight that also ADMITS would let
    // conquest appetite step over a pact or invent an alliance call. Lit and dark
    // must offer the SAME parties the SAME calls — only the scores may differ.
    const dark = coalitionWorld(COALITION_DARK_RULES);
    const lit = coalitionWorld(LIT_RULES);
    const key = (d) => `${d.partyId}->${d.enemyId}@${d.callId}`;
    const darkKeys = readCoalitionJoinDecisions({
      snapshot: coalitionSnapshot(dark), worldState: dark, tick: 4, strengthFor: () => 0.5,
    }).map(key);
    const litKeys = readCoalitionJoinDecisions({
      snapshot: coalitionSnapshot(lit), worldState: lit, tick: 4, strengthFor: () => 0.5,
    }).map(key);
    expect(litKeys).toEqual(darkKeys);
    expect(darkKeys.length).toBeGreaterThan(0);
  });
});
