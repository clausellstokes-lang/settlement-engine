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
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import {
  DENSITY_BANDS, PARTICULAR_TILTS, REGISTER_VII_SIGNATURE, TIER_ORDER,
} from '../../src/domain/density/densityBands.js';
import {
  DENSITY_LAW_CONFIG_KEY, NEW_SETTLEMENT_DENSITY_LAW_VERSION, REGISTER_VII_DENSITY_LAW_VERSION,
  newSettlementDensityLaw,
} from '../../src/domain/density/densityLaw.js';
import { rollNamedMass } from '../../src/generators/density/applyDensityLaw.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { rawBitFormOf } from '../helpers/dormancyOracle.js';
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

describe('X-46 car 4 (iii) — dark, the world is byte-identical; lit (in this test only), the roster follows the people', () => {
  // ⛔ THE DARK ARM. The digests were first recorded at 8cc245db0 (the coherence window's tip plus
  // car 1's bands, BEFORE this car) by this file's own recipe: `rawBitFormOf` of the whole
  // generated settlement, default config, no density marker (the dark v1 seam). Any byte moved on
  // a v1 world reds here, seed by seed.
  // RE-KEYED 2026-11-04 (chair's ruling P4(i)): the premise "byte-identical to 8cc245db0" died at the
  // compose of the window branch, where thirteen other lanes and the two food dials changed generation
  // (all sixty moved). The sixty digests were re-captured by the same recipe at the composed tip
  // (lane/window-rung1-2026-11-04, re-captured once more at RUNG1D after F9, READER-INSTRUMENTS and F10 composed, at 54daafda; each born twice and equal), so the arm now guards
  // the DARK PATH against future drift, which is its purpose.
  // RE-KEYED BY IDENTITY 2026-11-06 (LANDING-9, the rung-1 landing at 3c62e8ef5): 2 of 60 moved, x46-dark-thorp-005
  // (b18f5fcf… → d926eacd…) and x46-dark-thorp-009 (fa6b4b35… → 64023a9b…), by THE FOOD PER CENT FROM THE POUNDS,
  // record 34 (docs/shift-records/2026-11-06-rung1-34-food-per-cent-from-pounds.json), lane H's 66b1407bd. MEASURED by
  // this file's recipe per first-parent stage from 3d8a74e4b (0 moved): 0 at every step to 471780f4a; 2 at 18fd6b442,
  // and that stage minus 66b1407bd moves 0 (minus 8e92c0440 or 5f6d243b2 still 2). Re-captured at 3c62e8ef5, twice and equal.
  // RE-KEYED BY IDENTITY 2026-11-07 (WIRING-W0 cause 1, THE MIGRATION DIRECTION DECLARED ONCE, the chair's R-W7 (e);
  // record docs/shift-records/2026-11-07-w0-01-migration-direction.json, commit 343bd4eec on the rung-1 candidate
  // 76febf9b0, where all sixty held): 2 of 60 moved, x46-dark-town-001 (9bd732dc… → 26b72764…) and
  // x46-dark-metropolis-009 (d1e18894… → 32a6052b…), the two mass_migration places of the sixty (their record gains
  // stress[].direction and its config projection, the stability label names the one direction, the arrivals vignette
  // and secret pool). Re-captured by this file's recipe at 343bd4eec, twice and equal.
  // RE-KEYED BY IDENTITY again at the lane tip (WIRING-W0 records 02-05: one import share, one food-source count, the legacy
  // annotations dated at birth and the date in one home; every v1 world carries a food record and annotations): 60 of 60
  // moved. Re-captured by this file's recipe at 1dd31a377, twice and equal.
  // RE-KEYED BY IDENTITY 2026-11-07 (LANDING-R2, the pool census composed on rung 1's final 1bff51c6d, §934.105): 60 of 60
  // moved. The cause is the census's generator changes — the same 33 lane commits the generator golden's record names
  // (docs/shift-records/2026-11-06-rung2-01-census-composed-generator-master.json, the chair's ruled exception: per-cause
  // stages are unbuildable on this landing). MEASURED by this file's recipe: rung 1's final 1bff51c6d 0 moved (green there);
  // the census side f5dc50c6b red; the all-row mover on its own lineage, 73fa1a1e7 (reader-tonight-wants R11 unit 3, the 76
  // registry goals rewritten in the house register) against its parent 7f0632463, moves 60 of 60 by itself. Re-captured at
  // the tip dd2aab21d, twice and equal (fixture tests/fixtures/x46-npc-band-dark-digests.json).
  const DARK = /** @type {Record<string, string>} */ (JSON.parse(readFileSync(
    fileURLToPath(new URL('../fixtures/x46-npc-band-dark-digests.json', import.meta.url)), 'utf8',
  )));

  // RE-KEYED 2026-11-04 (was: "the signature is unflipped and the create boundary still mints nothing"):
  // the chair lit Register VII under the owner's word of 2026-11-04 (ODQ §934.104), so the create
  // boundary now mints the v2 marker. The dark seam below is still forced and still byte-identical.
  it('the signature is lit and the create boundary mints the v2 marker', () => {
    expect(REGISTER_VII_SIGNATURE).toEqual({ signed: true, live: true });
    expect(NEW_SETTLEMENT_DENSITY_LAW_VERSION).toBe(REGISTER_VII_DENSITY_LAW_VERSION);
    expect(newSettlementDensityLaw()).toEqual({ [DENSITY_LAW_CONFIG_KEY]: REGISTER_VII_DENSITY_LAW_VERSION });
  });

  it('sixty seeds (ten a tier) generate byte-identically to the dark digests captured at the window tip (2026-11-04)', () => {
    const seeds = Object.keys(DARK);
    expect(seeds).toHaveLength(60);
    /** @type {string[]} */ const moved = [];
    for (const seed of seeds) {
      const tier = seed.split('-')[2];
      const s = generateSettlementPipeline({ settType: tier, tier }, null, { seed, customContent: {} });
      if (rawBitFormOf(s) !== DARK[seed]) moved.push(seed);
    }
    expect(moved, 'v1 worlds this car moved').toEqual([]);
  }, 300_000);

  // ⭐ THE LIT SEAM. Lighting the signature changes exactly one thing for a new world: the
  // create boundary mints `{ [DENSITY_LAW_CONFIG_KEY]: REGISTER_VII_DENSITY_LAW_VERSION }`
  // (`newSettlementDensityLaw`), and every seam reads the law from the world's own config.
  // Handing that marker to the pipeline HERE is the lit world, with the file left dark.
  const LIT = { [DENSITY_LAW_CONFIG_KEY]: REGISTER_VII_DENSITY_LAW_VERSION };
  const LIT_SEEDS = 120;
  /** @type {Map<string, Array<{population: number, named: number, s: any}>>} */
  const litWorlds = new Map();
  const litFor = (tier) => {
    if (!litWorlds.has(tier)) {
      litWorlds.set(tier, Array.from({ length: LIT_SEEDS }, (_, i) => {
        const s = generateSettlementPipeline(
          { settType: tier, tier, ...LIT }, null,
          { seed: `x46-npc-${tier}-${String(i).padStart(3, '0')}`, customContent: {} },
        );
        // 2026-11-04 (chair's ruling P4(ii)): the band counts the ROLLED roster, so the crisis car's
        // TEMPORARY person (CRISIS-1: a required crisis role with no holder, `temporary: true`) is not
        // counted. Composed on the window branch, x46-npc-thorp-005 carried one (a Healer, the third
        // person against the thorp band's 2).
        return { population: s.population, named: s.npcs.filter((n) => n.temporary !== true).length, s };
      }));
    }
    return /** @type {Array<{population: number, named: number, s: any}>} */ (litWorlds.get(tier));
  };

  for (const tier of TIER_ORDER) {
    it(`${tier}: 120 lit worlds land inside the owner's band, and ρ(population, named people) > 0.4`, () => {
      const band = DENSITY_BANDS[tier].mass;
      const worlds = litFor(tier);
      const named = worlds.map(w => w.named);
      // 2026-11-07 PEOPLE-1 CAST (the people car's lane 1; docs/PEOPLE_1_CAST_2026-11-07.md): the named people are the CAST — one card per face-bearing house plus the
      // seat's and the `other` powers' mints (R-P2, R-P4) — and the `mass` band is unread (M-5; it stays signed in
      // densityBands.js, byte-identical, read here only to prove it still exists). The roster follows the HOUSES,
      // and the houses follow the population through the institution budget, so the rank correlation is kept.
      expect(band.min).toBeGreaterThan(0);
      expect(Math.min(...named)).toBeGreaterThanOrEqual(1);
      for (const w of worlds) expect(w.named).toBeLessThanOrEqual((w.s.institutions || []).length + (w.s.powerStructure?.factions || []).length);
      // The step function is gone: inside one tier, more people means more named people — except at the THORP,
      // whose cast is one to four faces (a household, an elder's house, a shrine) at every population of the band,
      // so the population carries no rank signal there (measured 0.085 at the lane's tip; the cast is the roster's,
      // not the population's). The claim is kept from the hamlet up.
      if (tier === 'thorp') expect(spearman(worlds.map(w => w.population), named)).toBeGreaterThanOrEqual(0);
      else expect(spearman(worlds.map(w => w.population), named)).toBeGreaterThan(0.4);
    }, 300_000);
  }

  it('§817-Q1 under the lit seam: office coverage stays a constraint on the roll — nothing appended, every house crewed', () => {
    for (const tier of TIER_ORDER) {
      for (const { s } of litFor(tier)) {
        expect(s.npcs.filter(n => n.generatedAs === 'faction_structural')).toHaveLength(0);
        // 2026-11-07 PEOPLE-1 CAST (the people car's lane 1; docs/PEOPLE_1_CAST_2026-11-07.md): "every house crewed" is retired with the roster law — a power with no
        // face-bearing house of its archetype is at zero by R-P5 (castPowers.test.js holds the exact claim); the
        // GOVERNING house is always crewed (the seat, R-P2).
        const gov = (s.powerStructure?.factions || []).find((f) => f.isGoverning);
        if (gov) expect(s.npcs.some((n) => (n.memberships || []).some((m) => m.power === (gov.faction || gov.name)))).toBe(true);
      }
    }
  }, 300_000);

  // The overlap through the population seam's own adapter (`rollNamedMass`), lit by config:
  // the same population read under both tiers whose bands hold it.
  for (const [population, lower, upper] of [[100, 'hamlet', 'village'], [400, 'village', 'town'],
    [2500, 'town', 'city'], [15000, 'city', 'metropolis']]) {
    it(`the overlap agrees within one person at ${population} (${lower} / ${upper}) through the population seam`, () => {
      const meanAt = (tier) => {
        let sum = 0;
        for (let i = 0; i < 400; i += 1) {
          sum += /** @type {number} */ (rollNamedMass({
            tier, population: /** @type {number} */ (population), config: LIT,
            powerStructure: { factions: POWERS.map(p => ({ faction: p.key, category: p.category, power: p.power, isGoverning: p.isGoverning })) },
            rng: createPRNG(`x46-seam-${tier}-${population}-${i}`),
          }));
        }
        return sum / 400;
      };
      expect(Math.abs(meanAt(lower) - meanAt(upper))).toBeLessThanOrEqual(1);
    });
  }
});

/** Spearman's rank correlation, ties averaged. @param {number[]} a @param {number[]} b */
function spearman(a, b) {
  const rank = (xs) => {
    const order = xs.map((v, i) => [v, i]).sort((x, y) => x[0] - y[0]);
    const r = new Array(xs.length);
    for (let i = 0; i < order.length;) {
      let j = i;
      while (j + 1 < order.length && order[j + 1][0] === order[i][0]) j += 1;
      for (let k = i; k <= j; k += 1) r[order[k][1]] = (i + j) / 2;
      i = j + 1;
    }
    return r;
  };
  const ra = rank(a);
  const rb = rank(b);
  const mean = xs => xs.reduce((s, v) => s + v, 0) / xs.length;
  const ma = mean(ra);
  const mb = mean(rb);
  let cov = 0; let va = 0; let vb = 0;
  for (let i = 0; i < ra.length; i += 1) {
    cov += (ra[i] - ma) * (rb[i] - mb);
    va += (ra[i] - ma) ** 2;
    vb += (rb[i] - mb) ** 2;
  }
  return va && vb ? cov / Math.sqrt(va * vb) : 0;
}
