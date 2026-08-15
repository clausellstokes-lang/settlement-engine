/**
 * demographicsRates.test.js — WAVE P1, THE TABLES AND THE THREE DERIVATIONS.
 *
 * The kernel's step is only as honest as the numbers it steps on, so this file pins
 * the reads themselves: that K_food is a real ceiling rather than a function of the
 * head count, that cutting a food artery makes it FALL, that min(K_food, D_tier)
 * names WHICH wall binds, and that natural mortality has no path to zero.
 *
 * Every band read here is derived from the LIVE exported table rather than restated,
 * so a tuning change moves the expectation with the code instead of reddening a
 * transcription.
 */
import { describe, expect, test } from 'vitest';
import {
  BIRTH_BANDS,
  BIRTH_BAND_WORDS,
  BINDING_KINDS,
  DEATH_BAND_WORDS,
  DEMOGRAPHIC_TUNING,
  DENSITY_CEILINGS,
  IMPORT_SOURCES,
  MOUTHS_PER_FOOD_UNIT,
  NATURAL_DEATH_BANDS,
  TERRAIN_DENSITY_ADJUST,
  demographicRates,
  demographicsActive,
  densityCeilingOf,
  effectiveBoundOf,
  foodCapacityOf,
  foodDeficit01Of,
  integerize,
  pressureOf,
  reliefCreditorCount,
} from '../../src/domain/worldPulse/demographicsRates.js';
import { TIER_ORDER, POPULATION_RANGES } from '../../src/data/constants.js';
import {
  DEMOGRAPHIC_PLANS_LEDGER,
  WORKS_TUNING,
} from '../../src/domain/worldPulse/demographicsWorks.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';

/** A settlement carrying real food physics. */
function place({
  tier = 'town', terrain = 'plains', population = 1200, dailyProduction = 6000,
  importDependency = 0.2, deficitPct = 0, named = 0,
} = {}) {
  return {
    population,
    tier,
    name: 'Ashford',
    config: { tier, terrainType: terrain },
    economicState: {
      foodSecurity: {
        dailyNeed: population * 2,
        dailyProduction,
        deficitPct,
        surplusPct: 5,
        importDependency,
        storageMonths: 6,
        resilienceScore: 60,
      },
    },
    npcs: Array.from({ length: named }, (_, i) => ({ id: `npc_${i}` })),
  };
}

const goodsEdge = (a, b, tally) => ({
  a, b, grade: 'road', mode: 'land',
  usage: {
    tally: { goods: tally },
    flows: { goods: 'brisk' },
    receipts: { goods: ['shipment'] },
    reasonGoods: ['grain'],
    lastTick: 4,
  },
});

const routedWorld = (edges) => ({
  simulationRules: { demographicsEnabled: true, routeLifecycleEnabled: true },
  spatialLedgers: { routeNetwork: { edges } },
});

const p5aWorksWorld = infrastructure => ({
  spatialLedgers: {
    [DEMOGRAPHIC_PLANS_LEDGER]: {
      p5a: { works: { infrastructure } },
    },
  },
});

const p5aDensityCeiling = (tier, terrain, infrastructure) => densityCeilingOf(
  place({ tier, terrain }),
  p5aWorksWorld(infrastructure),
  'p5a',
);

describe('the dormancy gate reads the virtual flag and nothing else', () => {
  test('absent, false, and every garbage shape are DARK; only an explicit true is lit', () => {
    expect(demographicsActive(null)).toBe(false);
    expect(demographicsActive(undefined)).toBe(false);
    expect(demographicsActive({})).toBe(false);
    expect(demographicsActive({ simulationRules: {} })).toBe(false);
    expect(demographicsActive({ simulationRules: { demographicsEnabled: false } })).toBe(false);
    // Fail CLOSED on truthy non-booleans: a corrupted rules blob must not light a
    // simulation-changing engine (the BOOLEAN_KEYS fail-closed precedent).
    expect(demographicsActive({ simulationRules: { demographicsEnabled: 1 } })).toBe(false);
    expect(demographicsActive({ simulationRules: { demographicsEnabled: 'true' } })).toBe(false);
    expect(demographicsActive({ simulationRules: 'nope' })).toBe(false);
    expect(demographicsActive({ simulationRules: { demographicsEnabled: true } })).toBe(true);
  });
});

describe('the authored tables are TOTAL over the tier and terrain vocabularies', () => {
  test('every tier in TIER_ORDER has an entry in all four tier tables', () => {
    for (const tier of TIER_ORDER) {
      expect(MOUTHS_PER_FOOD_UNIT[tier], `${tier} mouths-per-unit`).toBeGreaterThan(0);
      expect(DENSITY_CEILINGS[tier], `${tier} density ceiling`).toBeGreaterThan(0);
      expect(BIRTH_BANDS[tier], `${tier} birth band`).toBeGreaterThan(0);
      expect(NATURAL_DEATH_BANDS[tier], `${tier} natural death band`).toBeGreaterThan(0);
    }
    // METROPOLIS INCLUDED is the design's point, not an accident of the loop.
    expect(DENSITY_CEILINGS.metropolis).toBeGreaterThan(0);
    expect(Number.isFinite(DENSITY_CEILINGS.metropolis)).toBe(true);
  });

  test('every density ceiling clears its own tier population band, so a tier can fill and promote', () => {
    for (const tier of TIER_ORDER) {
      expect(DENSITY_CEILINGS[tier], `${tier} ceiling must clear POPULATION_RANGES.${tier}.max`)
        .toBeGreaterThan(POPULATION_RANGES[tier].max);
    }
  });

  test('J-P2: every birth band strictly exceeds its natural-mortality sibling, so zero pressure GROWS', () => {
    // If any tier inverted, that tier would hollow out on its own with no stressor
    // anywhere, and the plateau below would be an artefact of decline rather than a
    // fixed point of the two rates.
    for (const tier of TIER_ORDER) {
      expect(BIRTH_BANDS[tier], `${tier}: birth band must exceed natural mortality`)
        .toBeGreaterThan(NATURAL_DEATH_BANDS[tier]);
    }
  });

  test('the seven canonical terrains all carry an adjustment, and the mountain holds fewer than the plain', () => {
    for (const terrain of ['plains', 'hills', 'forest', 'riverside', 'coastal', 'mountain', 'desert']) {
      expect(TERRAIN_DENSITY_ADJUST[terrain], terrain).toBeGreaterThan(0);
    }
    expect(TERRAIN_DENSITY_ADJUST.mountain).toBeLessThan(TERRAIN_DENSITY_ADJUST.plains);
    expect(TERRAIN_DENSITY_ADJUST.desert).toBeLessThan(TERRAIN_DENSITY_ADJUST.hills);
  });

  test('P5a: the terrain-density order remains strictly harshest-to-most-generous', () => {
    const harshestToMostGenerous = [
      'desert', 'mountain', 'forest', 'hills', 'coastal', 'plains', 'riverside',
    ];
    for (let i = 1; i < harshestToMostGenerous.length; i += 1) {
      const harsher = harshestToMostGenerous[i - 1];
      const moreGenerous = harshestToMostGenerous[i];
      expect(
        TERRAIN_DENSITY_ADJUST[harsher],
        `${harsher} must remain strictly harsher than ${moreGenerous}`,
      ).toBeLessThan(TERRAIN_DENSITY_ADJUST[moreGenerous]);
    }
  });

  test('P5a: maximum public works clear every terrain x tier-promotion pair', () => {
    for (const terrain of Object.keys(TERRAIN_DENSITY_ADJUST)) {
      for (let i = 0; i < TIER_ORDER.length - 1; i += 1) {
        const tier = TIER_ORDER[i];
        const nextTier = TIER_ORDER[i + 1];
        const ceiling = p5aDensityCeiling(tier, terrain, WORKS_TUNING.WORKS_CAP);
        expect(
          ceiling,
          `${terrain} ${tier} at maximum works must clear ${nextTier}'s floor`,
        ).toBeGreaterThanOrEqual(POPULATION_RANGES[nextTier].min);
      }
    }
  });

  test('P5a: the interlock is real — mountain locks without works and desert needs the cap', () => {
    for (let i = 0; i < TIER_ORDER.length - 1; i += 1) {
      const tier = TIER_ORDER[i];
      const nextTier = TIER_ORDER[i + 1];
      const nextFloor = POPULATION_RANGES[nextTier].min;
      expect(
        p5aDensityCeiling(tier, 'mountain', 0),
        `mountain ${tier} without works must remain below ${nextTier}`,
      ).toBeLessThan(nextFloor);
      expect(
        p5aDensityCeiling(tier, 'desert', WORKS_TUNING.WORKS_CAP - 1),
        `desert ${tier} before maximum works must remain below ${nextTier}`,
      ).toBeLessThan(nextFloor);
      expect(p5aDensityCeiling(tier, 'desert', WORKS_TUNING.WORKS_CAP))
        .toBeGreaterThanOrEqual(nextFloor);
    }
  });

  test('P5a: 0.55 is the minimal two-decimal desert factor; the 0.54 mutant stays locked', () => {
    const maxWorksFactor = 1 + WORKS_TUNING.INFRASTRUCTURE_STEP * WORKS_TUNING.WORKS_CAP;
    const clearsEveryTierPair = factor => TIER_ORDER.slice(0, -1).every((tier, i) => (
      Math.round(DENSITY_CEILINGS[tier] * factor * maxWorksFactor)
        >= POPULATION_RANGES[TIER_ORDER[i + 1]].min
    ));

    expect(TERRAIN_DENSITY_ADJUST.desert).toBe(0.55);
    expect(clearsEveryTierPair(TERRAIN_DENSITY_ADJUST.desert)).toBe(true);
    expect(clearsEveryTierPair(0.54)).toBe(false);
    expect(Math.round(DENSITY_CEILINGS.thorp * 0.54 * maxWorksFactor))
      .toBeLessThan(POPULATION_RANGES.hamlet.min);
  });

  test('the closed band vocabularies are non-empty and every produced word is a member', () => {
    expect(BIRTH_BAND_WORDS.length).toBeGreaterThan(0);
    expect(DEATH_BAND_WORDS.length).toBeGreaterThan(0);
    expect(BINDING_KINDS).toEqual(['granary', 'walls']);
    expect(IMPORT_SOURCES).toEqual(['routes', 'generated', 'none']);
    const failures = collectSeedFailures(
      [0, 0.2, 0.4, 0.6, 0.75, 0.9, 1, 1.4, 2, 5],
      (pressure01) => {
        for (const deficit01 of [0, 0.3, 0.95, 4]) {
          const r = demographicRates({ settlement: place(), pressure01, deficit01 });
          expect(BIRTH_BAND_WORDS).toContain(r.birthBand);
          expect(DEATH_BAND_WORDS).toContain(r.deathBand);
        }
      },
    );
    expectNoSeedFailures(failures, 'every pressure/deficit pair produces a word inside the closed vocabularies');
  });
});

describe('densityCeilingOf — the authored ceiling, terrain-adjusted', () => {
  test('terrain moves the ceiling in the authored direction and never below the floor', () => {
    const plain = densityCeilingOf(place({ tier: 'town', terrain: 'plains' }));
    const mountain = densityCeilingOf(place({ tier: 'town', terrain: 'mountain' }));
    expect(plain).toBe(Math.round(DENSITY_CEILINGS.town * TERRAIN_DENSITY_ADJUST.plains));
    expect(mountain).toBeLessThan(plain);
    // A terrain adjustment is a modifier, never an eviction notice.
    expect(densityCeilingOf(place({ tier: 'thorp', terrain: 'desert' })))
      .toBeGreaterThanOrEqual(DEMOGRAPHIC_TUNING.MIN_DENSITY_CEILING);
  });

  test('an unknown or absent terrain reads as no adjustment, never as a hole', () => {
    expect(densityCeilingOf({ tier: 'town' })).toBe(DENSITY_CEILINGS.town);
    expect(densityCeilingOf({ tier: 'town', config: { terrainType: 'auto' } })).toBe(DENSITY_CEILINGS.town);
    expect(densityCeilingOf({ tier: 'town', config: { terrainType: 'moonscape' } })).toBe(DENSITY_CEILINGS.town);
    // Total on garbage: an unreadable settlement reads at the village default.
    expect(densityCeilingOf(null)).toBe(DENSITY_CEILINGS.village);
    expect(densityCeilingOf({ tier: 'not_a_tier' })).toBe(DENSITY_CEILINGS.village);
  });
});

describe('foodCapacityOf — K_food is a CEILING, not a function of the head count', () => {
  test('THE RUNAWAY CURE, stated as a property: doubling the population does not move K_food', () => {
    // This is the whole reason the model can plateau. The generator persists
    // dailyProduction once and the pulse food mover never rewrites it (it moves
    // storage, deficit, surplus and resilience only), so more people cannot mint more
    // grain. If this test ever reds, the compounding runaway is back.
    const small = foodCapacityOf(place({ population: 1200, dailyProduction: 6000 }), {}, 'Ashford');
    const doubled = foodCapacityOf(place({ population: 2400, dailyProduction: 6000, importDependency: 0.2 }), {}, 'Ashford');
    expect(small.local).toBe(doubled.local);
    expect(small.local).toBe(Math.floor(6000 * MOUTHS_PER_FOOD_UNIT.town));
  });

  test('a settlement with no food physics reads present:false and zero mouths', () => {
    const bare = foodCapacityOf({ tier: 'town', population: 500 }, {}, 'Bare');
    expect(bare.present).toBe(false);
    expect(bare.mouths).toBe(0);
    expect(bare.importSource).toBe('none');
  });

  test('the tier conversion is the authored one, and a bigger place feeds fewer per unit', () => {
    const thorp = foodCapacityOf(place({ tier: 'thorp', dailyProduction: 1000, importDependency: 0 }), {}, 'T');
    const metro = foodCapacityOf(place({ tier: 'metropolis', dailyProduction: 1000, importDependency: 0 }), {}, 'M');
    expect(thorp.mouthsPerUnit).toBe(MOUTHS_PER_FOOD_UNIT.thorp);
    expect(metro.mouthsPerUnit).toBe(MOUTHS_PER_FOOD_UNIT.metropolis);
    expect(metro.local).toBeLessThan(thorp.local);
  });

  test('SIEGE BY STARVATION: cutting a food artery makes K_food FALL, band by band', () => {
    const s = place({ importDependency: 0.6 });
    const two = foodCapacityOf(s, routedWorld({
      'edge.a': goodsEdge('Ashford', 'Brackwater', 12),
      'edge.b': goodsEdge('Ashford', 'Cairnhold', 9),
    }), 'Ashford');
    const one = foodCapacityOf(s, routedWorld({ 'edge.a': goodsEdge('Ashford', 'Brackwater', 12) }), 'Ashford');
    const none = foodCapacityOf(s, routedWorld({}), 'Ashford');

    expect(two.arteries).toBe(2);
    expect(one.arteries).toBe(1);
    expect(none.arteries).toBe(0);
    expect(two.importSource).toBe('routes');
    // The interdiction shape: each cut artery costs real mouths.
    expect(one.mouths).toBeLessThan(two.mouths);
    expect(none.mouths).toBeLessThan(one.mouths);
    // The fields are untouched by the road: only the import term moved.
    expect(none.local).toBe(two.local);
    // An isolated place keeps the generator's own irregular-traffic trickle rather
    // than dropping to nothing (FOOD_IMPORT_RATES.minorRoutes is real).
    expect(none.imports).toBeGreaterThan(0);
  });

  test('a road that has only ever carried armies is not an artery, so it cannot feed anybody', () => {
    const militaryOnly = {
      a: 'Ashford', b: 'Brackwater', grade: 'road', mode: 'land',
      usage: { tally: { military: 20 }, flows: { military: 'brisk' }, receipts: {}, lastTick: 4 },
    };
    const s = place({ importDependency: 0.6 });
    const withArmy = foodCapacityOf(s, routedWorld({ 'edge.a': militaryOnly }), 'Ashford');
    const withNone = foodCapacityOf(s, routedWorld({}), 'Ashford');
    expect(withArmy.arteries).toBe(0);
    expect(withArmy.mouths).toBe(withNone.mouths);
  });

  test('a DARK route network is not read as "no arteries": the generated channel stands verbatim', () => {
    // The trap this pins: reading a dark ledger as evidence of severance would starve
    // every campaign that never lit the route lifecycle.
    const s = place({ importDependency: 0.6 });
    const dark = foodCapacityOf(s, { simulationRules: { demographicsEnabled: true } }, 'Ashford');
    const cut = foodCapacityOf(s, routedWorld({}), 'Ashford');
    expect(dark.importSource).toBe('generated');
    expect(dark.imports).toBeGreaterThan(cut.imports);
  });

  test('standing relief obligations draw grain away, banded and capped against local production', () => {
    const s = place({ importDependency: 0.2 });
    const obligations = (records) => ({ simulationRules: {}, spatialLedgers: { obligations: records } });
    const rec = (from, to, kind, magnitude) => ({ from, to, kind, magnitude, mintTick: 1, lastTick: 2 });

    const free = foodCapacityOf(s, {}, 'Ashford');
    const owed = foodCapacityOf(s, obligations({
      'B:Ashford:grain_relief': rec('Brackwater', 'Ashford', 'grain_relief', 0.4),
    }), 'Ashford');
    expect(free.obligations).toBe(0);
    expect(owed.obligations).toBeGreaterThan(0);
    expect(owed.mouths).toBeLessThan(free.mouths);
    // Capped: the term can never exceed the authored fraction of LOCAL production.
    const many = foodCapacityOf(s, obligations({
      a: rec('B', 'Ashford', 'grain_relief', 0.4),
      b: rec('C', 'Ashford', 'grain_relief', 0.4),
      c: rec('D', 'Ashford', 'grain_relief', 0.4),
      d: rec('E', 'Ashford', 'grain_relief', 0.4),
      e: rec('F', 'Ashford', 'grain_relief', 0.4),
    }), 'Ashford');
    const cap = DEMOGRAPHIC_TUNING.OBLIGATION_DRAW_FRACTIONS[DEMOGRAPHIC_TUNING.OBLIGATION_DRAW_FRACTIONS.length - 1];
    expect(many.obligations).toBeLessThanOrEqual(Math.floor(free.local * cap));
  });

  test('the obligation census counts CREDITORS only, and ignores every other instrument', () => {
    const ledger = (records) => ({ spatialLedgers: { obligations: records } });
    const rec = (from, to, kind, magnitude) => ({ from, to, kind, magnitude });
    // Debtor side: Ashford RECEIVED relief, so it is not feeding anyone.
    expect(reliefCreditorCount(ledger({ x: rec('Ashford', 'B', 'grain_relief', 0.5) }), 'Ashford')).toBe(0);
    // Credit is a different instrument entirely.
    expect(reliefCreditorCount(ledger({ x: rec('B', 'Ashford', 'credit', 0.5) }), 'Ashford')).toBe(0);
    // A settled (zero-magnitude) obligation draws nothing.
    expect(reliefCreditorCount(ledger({ x: rec('B', 'Ashford', 'grain_relief', 0) }), 'Ashford')).toBe(0);
    expect(reliefCreditorCount(ledger({ x: rec('B', 'Ashford', 'grain_relief', 0.5) }), 'Ashford')).toBe(1);
    expect(reliefCreditorCount(null, 'Ashford')).toBe(0);
  });
});

describe('effectiveBoundOf — min(K, D), and WHICH WALL IT IS (J-P1)', () => {
  test('a granary-bound and a wall-bound settlement each name their own wall', () => {
    // GRANARY-BOUND: poor fields, generous ground.
    const granary = place({ tier: 'town', terrain: 'plains', dailyProduction: 3000, importDependency: 0 });
    const gBound = effectiveBoundOf(foodCapacityOf(granary, {}, 'G'), densityCeilingOf(granary));
    expect(gBound.binding).toBe('granary');
    expect(gBound.bound).toBe(gBound.foodCapacity);
    expect(gBound.foodCapacity).toBeLessThan(gBound.densityCeiling);

    // WALL-BOUND: rich fields on a mountain terrace that cannot hold the people.
    const walls = place({ tier: 'town', terrain: 'mountain', dailyProduction: 90000, importDependency: 0 });
    const wBound = effectiveBoundOf(foodCapacityOf(walls, {}, 'W'), densityCeilingOf(walls));
    expect(wBound.binding).toBe('walls');
    expect(wBound.bound).toBe(wBound.densityCeiling);
    expect(wBound.densityCeiling).toBeLessThan(wBound.foodCapacity);
  });

  test('unknown food lets the ground bind alone rather than pretending the place feeds nobody', () => {
    const bare = { tier: 'town', population: 500, config: { tier: 'town', terrainType: 'plains' } };
    const bound = effectiveBoundOf(foodCapacityOf(bare, {}, 'B'), densityCeilingOf(bare));
    expect(bound.foodKnown).toBe(false);
    expect(bound.binding).toBe('walls');
    expect(bound.bound).toBe(densityCeilingOf(bare));
  });

  test('a tie reads as the granary, because food is the cap and density is the rate', () => {
    const tied = effectiveBoundOf({ present: true, mouths: 500 }, 500);
    expect(tied.binding).toBe('granary');
  });

  test('the bound is never zero, so pressure can never divide by nothing', () => {
    const starved = effectiveBoundOf({ present: true, mouths: 0 }, 900);
    expect(starved.bound).toBeGreaterThanOrEqual(1);
    expect(pressureOf(9000, starved.bound)).toBe(DEMOGRAPHIC_TUNING.PRESSURE_MAX);
  });
});

describe('demographicRates — suppression, strain, and the floor that has no off switch', () => {
  test('J-P2: NATURAL MORTALITY IS A FLOOR. No input anywhere drives death01 below it', () => {
    // The absence of exactly this property is what let a settlement reach 29 trillion.
    const failures = collectSeedFailures(TIER_ORDER, (tier) => {
      const settlement = place({ tier });
      for (const pressure01 of [-5, 0, 0.1, 0.5, 0.75, 1, 1.5, 2, 99]) {
        for (const deficit01 of [-1, 0, 0.2, 0.95, 7]) {
          const r = demographicRates({ settlement, pressure01, deficit01 });
          expect(r.death01, `${tier} p=${pressure01} d=${deficit01}`)
            .toBeGreaterThanOrEqual(NATURAL_DEATH_BANDS[tier]);
          expect(r.death01).toBeGreaterThan(0);
          expect(Number.isFinite(r.death01)).toBe(true);
        }
      }
    });
    expectNoSeedFailures(failures, 'death01 never falls below the tier natural-mortality band');
  });

  test('crowding suppresses births only ABOVE the ease point, and never below zero', () => {
    const settlement = place();
    const band = BIRTH_BANDS.town;
    expect(demographicRates({ settlement, pressure01: 0 }).birth01).toBe(band);
    expect(demographicRates({ settlement, pressure01: DEMOGRAPHIC_TUNING.BIRTH_EASE }).birth01).toBe(band);
    const crowded = demographicRates({ settlement, pressure01: 1 }).birth01;
    expect(crowded).toBeLessThan(band);
    expect(crowded).toBeGreaterThanOrEqual(0);
    expect(demographicRates({ settlement, pressure01: 99 }).birth01).toBeGreaterThanOrEqual(0);
  });

  test('a food deficit raises deaths, and a deeper deficit raises them further', () => {
    const settlement = place();
    const fed = demographicRates({ settlement, pressure01: 0, deficit01: 0 }).death01;
    const hungry = demographicRates({ settlement, pressure01: 0, deficit01: 0.3 }).death01;
    const starving = demographicRates({ settlement, pressure01: 0, deficit01: 0.9 }).death01;
    expect(hungry).toBeGreaterThan(fed);
    expect(starving).toBeGreaterThan(hungry);
    expect(demographicRates({ settlement, pressure01: 0, deficit01: 0.9 }).deathBand).toBe('grievous');
  });

  test('the mortality multiplier is BOUNDED: an unbounded overshoot cannot mint an unbounded death rate', () => {
    const settlement = place();
    const worst = demographicRates({ settlement, pressure01: 1e9, deficit01: 1e9 }).death01;
    const ceiling = NATURAL_DEATH_BANDS.town * (
      1 + DEMOGRAPHIC_TUNING.DEATH_PRESSURE_GAIN * DEMOGRAPHIC_TUNING.DEATH_STRAIN_CAP
      + DEMOGRAPHIC_TUNING.DEATH_DEFICIT_GAIN
    );
    expect(worst).toBeCloseTo(ceiling, 12);
    expect(worst).toBeLessThan(1);
  });

  test('THE FIXED POINT EXISTS AND IT SITS BELOW THE BOUND for every tier', () => {
    // Derived, not asserted: scan pressure and find where births stop outrunning
    // deaths. If any tier had no crossing, that tier would compound forever.
    const failures = collectSeedFailures(TIER_ORDER, (tier) => {
      const settlement = place({ tier });
      let crossing = null;
      for (let p = 0; p <= 2.0001 && crossing === null; p += 0.001) {
        const r = demographicRates({ settlement, pressure01: p, deficit01: 0 });
        if (r.death01 >= r.birth01) crossing = p;
      }
      expect(crossing, `${tier} has NO equilibrium: births outrun deaths at every pressure`).not.toBe(null);
      expect(crossing, `${tier} equilibrium too low to be a real bound`).toBeGreaterThan(0.5);
      expect(crossing, `${tier} equilibrium overshoots its own bound`).toBeLessThan(1);
    });
    expectNoSeedFailures(failures, 'every tier has a stable equilibrium strictly inside its bound');
  });

  test('the deficit read comes from the ONE food read-point and is total on garbage', () => {
    expect(foodDeficit01Of(place({ deficitPct: 40 }))).toBeCloseTo(0.4, 10);
    expect(foodDeficit01Of(place({ deficitPct: 0 }))).toBe(0);
    expect(foodDeficit01Of({ tier: 'town' })).toBe(0);
    expect(foodDeficit01Of(null)).toBe(0);
  });
});

describe('integerize — every term is an integer, and the fraction is a probability', () => {
  test('the whole part always lands and the fraction is the chance of one more', () => {
    expect(integerize(3.4, 0.9)).toBe(3);
    expect(integerize(3.4, 0.3)).toBe(4);
    expect(integerize(3, 0)).toBe(3);
    expect(integerize(0.7, 0.69)).toBe(1);
    expect(integerize(0.7, 0.71)).toBe(0);
  });

  test('it is total: negatives, garbage and a missing roll never mint people', () => {
    expect(integerize(-5, 0)).toBe(0);
    expect(integerize(Number.NaN, 0)).toBe(0);
    // A missing roll defaults to 1, which is the FLOOR rather than the ceiling: an
    // rng-less call must never round the whole realm up.
    expect(integerize(9.99, undefined)).toBe(9);
  });

  test('over many rolls the mean converges on the expected value (the term is unbiased)', () => {
    let total = 0;
    const N = 1000;
    for (let i = 0; i < N; i += 1) total += integerize(2.25, i / N);
    expect(total / N).toBeCloseTo(2.25, 2);
  });
});
