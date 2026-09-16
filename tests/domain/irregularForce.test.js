/**
 * irregularForce.test.js — W-SEAT D10, car SEAT-7a: the irregular-force law's
 * below-threshold half, and the ALIVENESS of every arm it lights.
 *
 * ⛔ THIS SUITE IS BUILT AGAINST A RECORDED FAILURE CLASS RATHER THAN AGAINST THE FEATURE.
 * A sibling feature shipped THREE arms that did nothing in every possible world, and no
 * test written for that feature caught it, because A DARK WORLD AND A LIT-BUT-INCAPABLE
 * WORLD ARE BYTE-IDENTICAL: dormancy fences, certification rows and coupling rows were all
 * green over code that could not fire. Every describe below therefore carries a POSITIVE
 * arm that fails if the mechanism is switched ON and does nothing, and the verdict arms are
 * DIFFERENTIAL — one seed, two flag settings, opposite outcomes.
 *
 * ⚠ THE TRAP THIS SUITE ALREADY FELL INTO ONCE, RECORDED SO IT IS NOT RE-DISCOVERED. The
 * first fixture drafted for the verdict differential had an UN-GATED incumbent
 * (`incumbent.gated === false`), and `resolveCoupVerdict` short-circuits that case to a
 * flat `pHold = 0.08` WITHOUT EVER READING `share` — so the lit and dark verdicts were
 * identical and a dormancy-shaped assertion would have passed while proving nothing at all.
 * Every verdict fixture here asserts `incumbent.gated` FIRST, so the arm cannot go vacuous
 * if the contender maths is ever re-tuned underneath it.
 */
import { describe, expect, it } from 'vitest';

import { IRREGULAR_TUNING, irregularShareFactor, participation01 } from '../../src/domain/worldPulse/irregularForce.js';
import { coupContenders, resolveCoupVerdict } from '../../src/domain/rulingPowerCoup.js';

/**
 * A settlement with a real contest. `incPower`/`chPower` are the dials that decide whether
 * the incumbent stays GATED, which is what keeps the `share` path reachable.
 * @param {{score:number, incPower?:number, chPower?:number, pop?:number}} a
 */
function town({ score, incPower = 60, chPower = 32, pop = 4200 }) {
  return {
    name: 'Aster', population: pop, tier: 'town',
    powerStructure: {
      governingName: 'Crown',
      publicLegitimacy: { score, govMultiplier: 1 },
      factions: [
        { faction: 'Crown', category: 'government', power: incPower, isGoverning: true },
        { faction: 'Iron Company', category: 'military', power: chPower },
        { faction: 'House Vell', category: 'noble', power: chPower - 2 },
        { faction: 'The Guilds', category: 'merchant', power: chPower - 6 },
      ],
    },
  };
}

/** @param {any} s */
const snapOf = (s) => {
  const items = [{ id: 'a', name: 'Aster', settlement: s }];
  return { settlements: items, byId: new Map(items.map((e) => [e.id, e])) };
};

const LIT = { simulationRules: { irregularForceEnabled: true } };
const DARK = { simulationRules: {} };
/** @param {number} v a deterministic rng: every draw is the same, so pHold is the only variable */
const rngAt = (v) => ({ random: () => v });

describe('D10 SEAT-7a — the factor is EXACTLY 1 when the key is dark', () => {
  it('returns the literal 1 with the flag absent, false, or truthy-not-true', () => {
    const snap = snapOf(town({ score: 0 }));
    expect(irregularShareFactor(DARK, snap, 'a')).toBe(1);
    expect(irregularShareFactor({ simulationRules: { irregularForceEnabled: false } }, snap, 'a')).toBe(1);
    for (const truthy of ['true', 1, {}, [], 'yes']) {
      const w = { simulationRules: { irregularForceEnabled: truthy } };
      expect(irregularShareFactor(w, snap, 'a'), `truthy ${JSON.stringify(truthy)}`).toBe(1);
    }
  });

  it('is INERT on garbage rather than producing a NaN into the pHold clamp', () => {
    const snap = snapOf(town({ score: 0 }));
    for (const bad of [null, undefined, 7, 'world', []]) {
      expect(irregularShareFactor(bad, snap, 'a'), `${bad}`).toBe(1);
    }
    expect(irregularShareFactor(LIT, null, 'a')).toBe(1);
    expect(irregularShareFactor(LIT, snap, 'no-such-settlement')).toBe(1);
  });

  it('a factor of exactly 1 reproduces the verdict BIT for BIT, not merely closely', () => {
    const args = { settlement: town({ score: 0 }), rng: rngAt(0.5), severity: 0.6, rulingAuthorityScore: 42 };
    const omitted = resolveCoupVerdict({ ...args });
    const explicit = resolveCoupVerdict({ ...args, forceRatioFactor: 1 });
    expect(Object.is(explicit.pHold, omitted.pHold)).toBe(true);
    expect(JSON.stringify(explicit)).toBe(JSON.stringify(omitted));
  });
});

describe('D10 SEAT-7a — participation01, the politics→force bridge, DOES WORK', () => {
  it('rises as the seat loses standing, and is exactly 0 at the commons legitimacy floor', () => {
    const at = (/** @type {number} */ score) => participation01(town({ score }), {}, 'a');
    // ANCHORED: the ladder is strictly monotone across the live range, so a constant-return
    // stub — the shape a dead arm takes — fails here rather than passing quietly.
    expect(at(5)).toBeGreaterThan(at(20));
    expect(at(20)).toBeGreaterThan(at(35));
    expect(at(35)).toBeGreaterThan(at(50));
    expect(at(5)).toBeGreaterThan(0);
    // At/above commonsVoiceKernel's LEGIT_FLOOR the deficit is zero, so nobody comes out.
    expect(at(55)).toBe(0);
    expect(at(90)).toBe(0);
  });

  it('needs BOTH a cause and a faction — the conjunction, driven from each side', () => {
    // A furious town with nobody to rally behind: every challenger below the contender floor.
    const noChallenger = {
      name: 'Aster', population: 4200, tier: 'town',
      powerStructure: {
        governingName: 'Crown', publicLegitimacy: { score: 0, govMultiplier: 1 },
        factions: [{ faction: 'Crown', category: 'government', power: 80, isGoverning: true }],
      },
    };
    expect(participation01(noChallenger, {}, 'a')).toBe(0);
    // A contented town with three strong challengers: the cause term is what is missing.
    expect(participation01(town({ score: 90, incPower: 30, chPower: 48 }), {}, 'a')).toBe(0);
    // And with both present it is positive — so neither zero above was the function's floor.
    expect(participation01(town({ score: 0, incPower: 30, chPower: 48 }), {}, 'a')).toBeGreaterThan(0);
  });

  it('the OCCUPIED arm REPLACES the deficit and never sums with it (A2.2.6)', () => {
    // ⚠ A HAND-BUILT fixture on purpose: the observed-shape corpus is known to carry zero
    // occupation rows of this kind, so a corpus-driven arm here would toggle dead code and
    // prove invariance it never tested — the recorded hazard.
    const s = town({ score: 90 }); // contented: the deficit path yields exactly 0
    const occupied = (/** @type {number} */ resistance) => ({
      simulationRules: { irregularForceEnabled: true },
      occupations: { a: { occupierId: 'o', state: 'extractive', resistance } },
    });
    // Un-occupied, this settlement produces nobody. Occupied, resistance alone raises it —
    // which is only possible if resistance REPLACED the (zero) deficit rather than summing.
    expect(participation01(s, {}, 'a')).toBe(0);
    expect(participation01(s, occupied(0), 'a')).toBe(0);
    expect(participation01(s, occupied(0.9), 'a')).toBeGreaterThan(participation01(s, occupied(0.3), 'a'));
    expect(participation01(s, occupied(0.3), 'a')).toBeGreaterThan(0);
    // And the other direction: a town with a real deficit reads the deficit when free.
    expect(participation01(town({ score: 0 }), {}, 'a')).toBeGreaterThan(0);
  });
});

describe('D10 SEAT-7a — THE DISCOVERY: a town that would rise costs its ruler standing', () => {
  it('the lit factor is bounded by its one dial and falls as the rising grows', () => {
    const f = (/** @type {number} */ score) => irregularShareFactor(LIT, snapOf(town({ score })), 'a');
    const floor = 1 - IRREGULAR_TUNING.SHARE_WEIGHT;
    for (const score of [0, 5, 20, 35, 50, 55, 90]) {
      expect(f(score), `score ${score} within [${floor}, 1]`).toBeGreaterThanOrEqual(floor);
      expect(f(score), `score ${score} within [${floor}, 1]`).toBeLessThanOrEqual(1);
    }
    expect(f(0)).toBeLessThan(f(20));
    expect(f(20)).toBeLessThan(f(35));
    expect(f(0)).toBeLessThan(1); // anchored: the lit arm actually bites on a real fixture
    expect(f(90)).toBe(1);        // and a contented town is untouched, so the bite is about the town
  });

  it('LOWERS the incumbent hold-chance on the same seed — the term does work', () => {
    const s = town({ score: 0, incPower: 60, chPower: 32 });
    // ⛔ GATED FIRST: an un-gated incumbent short-circuits pHold to 0.08 and never reads
    // `share`, which would make every assertion below vacuously equal.
    expect(coupContenders(s).incumbent.gated).toBe(true);
    const args = { settlement: s, rng: rngAt(0.5), severity: 0.6, rulingAuthorityScore: 42 };
    const factor = irregularShareFactor(LIT, snapOf(s), 'a');
    expect(factor).toBeLessThan(1);
    const dark = resolveCoupVerdict({ ...args });
    const lit = resolveCoupVerdict({ ...args, forceRatioFactor: factor });
    expect(lit.pHold).toBeLessThan(dark.pHold);
    // anchored at the measured figures, so a silent re-tune of the contender maths is seen
    expect(dark.pHold).toBe(0.33);
    expect(lit.pHold).toBe(0.3);
  });

  it('CHANGES THE OUTCOME on one seed — the strongest form of the aliveness claim', () => {
    // The differential that a dormancy fence can never make: same settlement, same roll,
    // and the seat SURVIVES dark while it FALLS lit. If this arm ever goes quiet the
    // mechanism has stopped reaching the thing it exists to reach.
    const s = town({ score: 40, incPower: 85, chPower: 32 });
    expect(coupContenders(s).incumbent.gated).toBe(true);
    const factor = irregularShareFactor(LIT, snapOf(s), 'a');
    expect(factor).toBeLessThan(1);
    const at = (/** @type {number|undefined} */ f) => resolveCoupVerdict({
      settlement: s, rng: rngAt(0.4), severity: 0.6, rulingAuthorityScore: 42, forceRatioFactor: f,
    });
    expect(at(undefined).holds).toBe(true);
    expect(at(factor).holds).toBe(false);
  });
});
