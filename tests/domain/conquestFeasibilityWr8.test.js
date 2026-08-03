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

import {
  CONQUEST_FEASIBILITY_TUNING,
  collapseSeatBooksUnderThreat,
  conquestMarchAdvised,
  conquestMotivePressure01,
  conquestTermsRange,
  conquestVoteWeight01,
  mistakenFeasibilityReceipt,
  readConquestFeasibility,
  termsRangesOverlap,
} from '../../src/domain/worldPulse/conquestFeasibility.js';
import {
  conquestBeliefBandsFor,
  conquestDoctrineActive,
  conquestMarchOrder,
  ownExhaustionWord,
  ownStoresWord,
  readConquestFeasibilityFor,
  CONQUEST_REQUIRED_RULES,
} from '../../src/domain/worldPulse/conquestDoctrineStage.js';
import { hostileTargetsOf } from '../../src/domain/worldPulse/warIntent.js';

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

  test('the K.6 vote weight is belief-sourced, and says so', () => {
    const strong = conquestVoteWeight01(readConquestFeasibility(CONFIDENT));
    const weak = conquestVoteWeight01(readConquestFeasibility(DOOMED));
    expect(strong).toBeGreaterThan(Number(weak));
    expect(Number(weak)).toBeGreaterThanOrEqual(CONQUEST_FEASIBILITY_TUNING.VOTE_FLOOR);
    expect(conquestVoteWeight01(readConquestFeasibility({ ...CONFIDENT, rivalStrengthBand: 'unknown' }))).toBeNull();
    // THE FORK, RECORDED IN A PIN: a member that believes itself strong votes as
    // though it were. Two members with IDENTICAL true state and different
    // pictures must weigh differently, or the vote has quietly gone back to
    // reading truth.
    const flattered = conquestVoteWeight01(readConquestFeasibility({
      ...DOOMED, ownStrengthBand: 'dominant',
    }));
    expect(flattered).toBeGreaterThan(Number(weak));
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
    relationshipStates: {},
    spatialLedgers: {
      beliefMaps: {
        ironhold: {
          seat: {
            // The court believes the far-off `zeta` is spent and thornwall strong,
            // so a conquest of `zeta` is what it believes is in reach — and `zeta`
            // sorts LAST codepoint-wise, which is what makes the reorder visible.
            zeta: { strengthBand: 0, allianceLabel: 'hostile', confidence01: 1 },
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
    },
  };
  const byId = new Map([
    ['ironhold', stocked],
    ['thornwall', { id: 'thornwall', settlement: { name: 'Thornwall', tier: 'town', population: 3000 } }],
    ['zeta', { id: 'zeta', settlement: { name: 'Zeta', tier: 'village', population: 400 } }],
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
    // One open front is the ordinary case and reads quiet; four is decisive.
    expect(ownExhaustionWord(1)).toBe('quiet');
    expect(ownExhaustionWord(2)).toBe('present');
    expect(ownExhaustionWord(5)).toBe('decisive');
  });
});
