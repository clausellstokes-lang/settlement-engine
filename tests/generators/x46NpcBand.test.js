/**
 * X-46 car 4 — THE NPC BAND (`docs/DESIGN_X46_SCALE_TRAIN.md` §5).
 *
 * Register VII's named-NPC mass band takes the owner's figures, and the sizing stage reads
 * the settlement's POPULATION inside its tier's band as one more tilt, so the named roster
 * follows the population while the band's edges stay where the table puts them. The car is
 * built DARK: `REGISTER_VII_SIGNATURE` is the owner's and is never flipped here; the lit
 * arms below reach Register VII through the config marker a lit signature would mint at the
 * birth boundary (`newSettlementDensityLaw`), never through the file.
 */
import { describe, it, expect } from 'vitest';
import {
  DENSITY_BANDS, PARTICULAR_TILTS, TIER_ORDER,
} from '../../src/domain/density/densityBands.js';
import { POPULATION_RANGES } from '../../src/data/constants.js';
import { createPRNG } from '../../src/kernel/prng.js';
import * as densityRoll from '../../src/generators/density/densityRoll.js';

const { rollDensityPlan } = densityRoll;
// Read through the namespace so this file still LOADS on a tip without the export (the
// red-first run): the tilt's own tests then fail by assertion, not by an import error.
const populationTilt = (tier, population) => /** @type {any} */ (densityRoll).populationTilt(tier, population);

/** A power roster shaped like `powerStructure.factions`' seats, strongest first. */
const POWERS = Array.from({ length: 12 }, (_, i) => ({
  key: `pow${String(i).padStart(2, '0')}`,
  name: `Power ${i}`,
  category: ['government', 'economy', 'religious', 'military', 'noble', 'criminal'][i % 6],
  power: 30 - i * 2,
  isGoverning: i === 0,
  officeRoleKey: null,
}));

describe('X-46 car 4 (i) — Register VII\'s mass band is the owner\'s figures', () => {
  it('reads 1–2 / 2–4 / 4–7 / 6–12 / 12–18 / 18–30, smallest tier first', () => {
    // The chair's proposal on the ledger (2026-11-02, not vetoed), the metropolis ceiling 30
    // kept from Register VII because "18-and-up" needs an edge the roll can clamp to.
    expect(TIER_ORDER.map(t => [DENSITY_BANDS[t].mass.min, DENSITY_BANDS[t].mass.max]))
      .toEqual([[1, 2], [2, 4], [4, 7], [6, 12], [12, 18], [18, 30]]);
  });

  it('every adjacent pair of bands touches or overlaps, so the overlap can agree within one person', () => {
    for (let i = 1; i < TIER_ORDER.length; i += 1) {
      const lower = DENSITY_BANDS[TIER_ORDER[i - 1]].mass;
      const upper = DENSITY_BANDS[TIER_ORDER[i]].mass;
      expect(upper.min - lower.max).toBeLessThanOrEqual(1);
    }
  });
});

describe('X-46 car 4 (ii) — the population tilt moves the centre and never the edges', () => {
  // The overlap points of the owner's population bands, each read under BOTH tiers whose
  // bands hold it (§5: "the overlap agrees within one person").
  const OVERLAP = [[100, 'hamlet', 'village'], [400, 'village', 'town'],
    [2500, 'town', 'city'], [15000, 'city', 'metropolis']];
  const CORPUS = 400;

  /** Mean named mass over a corpus at one population, unremarkable particulars. */
  const meanMassAt = (tier, population) => {
    let sum = 0;
    for (let i = 0; i < CORPUS; i += 1) {
      sum += rollDensityPlan({
        tier, population, rng: createPRNG(`x46-tilt-${tier}-${population}-${i}`), powers: POWERS,
      }).namedMass;
    }
    return sum / CORPUS;
  };

  it('the tuning surface carries one population entry, a fraction of the band\'s width', () => {
    expect(typeof PARTICULAR_TILTS.population).toBe('number');
    expect(PARTICULAR_TILTS.population).toBeGreaterThan(0);
    expect(PARTICULAR_TILTS.population).toBeLessThanOrEqual(1);
  });

  it('reads the position inside the tier\'s own population band, clamped and centred', () => {
    const P = PARTICULAR_TILTS.population;
    for (const tier of TIER_ORDER) {
      const band = POPULATION_RANGES[tier];
      expect(populationTilt(tier, band.min)).toBeCloseTo(-P, 12);
      expect(populationTilt(tier, band.max)).toBeCloseTo(P, 12);
      expect(populationTilt(tier, (band.min + band.max) / 2)).toBeCloseTo(0, 12);
      // Clamped: a population outside the band reads as its nearer edge, never beyond.
      expect(populationTilt(tier, band.min - 1000)).toBeCloseTo(-P, 12);
      expect(populationTilt(tier, band.max * 10)).toBeCloseTo(P, 12);
    }
    // Absent or garbage ⇒ no tilt at all: the pure roll's callers that pass no population
    // (the §810.2b distribution-shape corpus) keep their exact draws.
    for (const v of [undefined, null, NaN, 'many', Infinity]) expect(populationTilt('town', v)).toBe(0);
  });

  it('an absent population rolls exactly the plan it rolled before the tilt existed', () => {
    for (let i = 0; i < 60; i += 1) {
      const tier = TIER_ORDER[i % TIER_ORDER.length];
      const base = { tier, powers: POWERS, particulars: { prosperity01: (i % 11) / 10 } };
      const without = rollDensityPlan({ ...base, rng: createPRNG(`x46-absent-${i}`) });
      const withNull = rollDensityPlan({ ...base, population: null, rng: createPRNG(`x46-absent-${i}`) });
      expect(JSON.stringify(withNull)).toBe(JSON.stringify(without));
    }
  });

  it('the edges hold under every population and every particular: zero mass outside the band', () => {
    for (const tier of TIER_ORDER) {
      const band = POPULATION_RANGES[tier];
      const mass = DENSITY_BANDS[tier].mass;
      const seen = new Set();
      for (let i = 0; i < CORPUS; i += 1) {
        const plan = rollDensityPlan({
          tier,
          population: band.min + ((band.max - band.min) * (i % 21)) / 20,
          rng: createPRNG(`x46-edge-${tier}-${i}`),
          powers: POWERS,
          // The particulars at their extremes, both ways, so the summed tilt overshoots.
          particulars: i % 2
            ? { prosperity01: 1, connectivity01: 1, war01: 0, corruption01: 0 }
            : { prosperity01: 0, connectivity01: 0, war01: 1, corruption01: 1 },
        });
        expect(plan.namedMass).toBeGreaterThanOrEqual(mass.min);
        expect(plan.namedMass).toBeLessThanOrEqual(mass.max);
        seen.add(plan.namedMass);
      }
      // …and the band's whole width is still reached.
      expect(seen.size).toBe(mass.max - mass.min + 1);
    }
  });

  it('the bottom of a band rolls lower than its top, at every tier', () => {
    for (const tier of TIER_ORDER) {
      const band = POPULATION_RANGES[tier];
      expect(meanMassAt(tier, band.max)).toBeGreaterThan(meanMassAt(tier, band.min));
    }
  });

  for (const [population, lower, upper] of OVERLAP) {
    it(`the overlap agrees within one person at ${population} (${lower} / ${upper})`, () => {
      expect(Math.abs(meanMassAt(lower, population) - meanMassAt(upper, population)))
        .toBeLessThanOrEqual(1);
    });
  }
});

