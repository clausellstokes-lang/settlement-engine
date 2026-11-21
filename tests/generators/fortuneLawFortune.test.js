/**
 * fortuneLawFortune.test.js — FORTUNE JUDGED AGAINST THE PLACE'S OWN SIZE (FORTUNE-1, unit U2:
 * FS1, and FS4's calm floor), in `src/generators/economy/prosperity.js`, under the fortune law only.
 *
 * ⭐ WHAT THIS FILE PROVES, in the brief's order (`docs/chair/2026-11-20/content/fortune/briefs/U2.md`):
 *   (a) DARK — over a grid of direct calls (every size; road, crossroads, isolated; trades below,
 *       at and above the expectation; income counts 0, 5, 7), `computeBaseProsperity` and
 *       `deriveProsperityLabels` with no marker equal their values under `_fortuneLawVersion: 1`
 *       and under every garbage marker ('2', NaN, 3). Under law 1 every line computes as today.
 *   (b) LIT, direct — under 2 a city and a village alike in all but size read the same base; a
 *       city thin in trades (below 0.75 of its expectation) reads one step below one at it; the
 *       income-diversity count moves nothing.
 *   (c) THE FLOOR — under 2 a calm place holding its required economy reads at least Poor after
 *       the label's steps (economy output under 15, crime 65 or more); under a crisis, at an
 *       isolated thorp, or without its required economy, it is unfloored; under 1, today's value.
 *   (d) BORN, forced (COMMON's fixture arm) — twelve births (two a size, untouched settings) under
 *       2: the printed and the standing labels are what the functions compute from each town's
 *       own record; the same twelve with no marker are byte-identical (JSON) to a birth under 1.
 *
 * Every expectation is COMPUTED from `FORTUNE_LAW_TUNING`, `PROSPERITY_LABELS` and today's code
 * (the law-1 call on the same inputs), never a quoted label list.
 *
 * @enforced-by this test
 */
import { beforeAll, describe, expect, test } from 'vitest';

import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import {
  computeBaseProsperity,
  deriveProsperityLabels,
  standingBaseProsperity,
} from '../../src/generators/economy/prosperity.js';
import { getInstFlags } from '../../src/generators/priorityHelpers.js';
import { generateFoodSecurity } from '../../src/generators/foodGenerator.js';
import {
  FORTUNE_LAW_CONFIG_KEY,
  FORTUNE_LAW_TUNING,
  SIZE_RELATIVE_FORTUNE_LAW_VERSION,
  DEFAULT_FORTUNE_LAW_VERSION,
} from '../../src/domain/fortune/fortuneLaw.js';
import { PROSPERITY_LABELS } from '../../src/domain/prosperityRank.js';
import { isMaterializedCustomContent } from '../../src/domain/content/customContentSemanticAuthority.js';
import { createPRNG } from '../../src/kernel/prng.js';
import { setActiveRng, clearActiveRng } from '../../src/kernel/rngContext.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { legacyConfig } from '../helpers/fortuneLegacyConfig.js';

const LIT = SIZE_RELATIVE_FORTUNE_LAW_VERSION;
/** The six sizes, read off the law's own table (never re-typed here). */
const SIZES = Object.keys(FORTUNE_LAW_TUNING.depthExpectation);
/** A food record that moves nothing: the food term is held still so the size is the only difference. */
const NO_FOOD = Object.freeze({ prosperityMod: null });
/** A house of the required economy (`computeBaseProsperity`'s floor regex reads its name). */
const REQUIRED_HOUSE = Object.freeze({ name: 'Weekly market', category: 'Economy' });
/** A criminal house: crime reads its full dial beside one (`getInstFlags`), so the crime step is reachable. */
const GUILD = Object.freeze({ name: "Thieves' guild", category: 'Criminal' });
/** A trade house that is not of the required economy. */
const PLAIN_HOUSE = Object.freeze({ name: 'Trade house', category: 'Economy' });

/** `n` plain trade houses (Economy and Crafts, none custom): the depth term's count. */
const trades = (n) => Array.from({ length: n }, (_, i) => ({ name: `Trade house ${i}`, category: i % 2 ? 'Crafts' : 'Economy' }));
/** `n` income rows: the diversity term's count. */
const incomes = (n) => Array.from({ length: n }, (_, i) => ({ source: `Source ${i}`, percentage: 10 }));

/** A config with the marker set to `marker` (the key absent when `marker` is the ABSENT sentinel). */
const ABSENT = Symbol('absent');
const withMarker = (config, marker) => (marker === ABSENT ? { ...config } : { ...config, [FORTUNE_LAW_CONFIG_KEY]: marker });
const lit = (config) => withMarker(config, LIT);
const dark = (config) => withMarker(config, DEFAULT_FORTUNE_LAW_VERSION);

const baseOf = (config, institutions, incomeCount = 0) => computeBaseProsperity(
  config.tier, config.tradeRouteAccess, institutions, config, null, incomes(incomeCount), NO_FOOD,
).label;

/** `deriveProsperityLabels` with a fresh, fixed RNG (the Subsistence draw is replayed alike on every arm). */
const labelsOf = (base, config, institutions) => {
  const prev = setActiveRng(createPRNG('u2-fortune-labels'));
  try { return deriveProsperityLabels(base, base, config, institutions); } finally { clearActiveRng(prev); }
};

/** The index of a label on the emitted ladder. */
const step = (label) => PROSPERITY_LABELS.indexOf(label);
const POOR = PROSPERITY_LABELS[1];

describe('(a) DARK: with no marker, every line computes exactly as under law 1 and under any garbage marker', () => {
  const MARKERS = [DEFAULT_FORTUNE_LAW_VERSION, '2', Number.NaN, 3];
  /** The trade counts around a size's expectation: thin, at it, deep. */
  const counts = (size) => {
    const e = FORTUNE_LAW_TUNING.depthExpectation[size];
    return [Math.max(0, Math.floor(e * 0.75) - 1), e, Math.ceil(e * 1.3)];
  };
  const grid = [];
  for (const tier of SIZES) {
    for (const route of ['road', 'crossroads', 'isolated']) {
      for (const n of counts(tier)) {
        for (const income of [0, 5, 7]) {
          for (const priorityEconomy of [5, 50, 90]) {
            grid.push({
              config: { tier, settType: tier, tradeRouteAccess: route, monsterThreat: 'heartland', priorityEconomy, priorityMagic: 80, priorityCriminal: 95, magicExists: true },
              institutions: [REQUIRED_HOUSE, ...trades(n)],
              income,
            });
          }
        }
      }
    }
  }

  test('computeBaseProsperity: no marker equals law 1 and every garbage marker, on every cell of the grid', () => {
    const bases = new Set();
    for (const { config, institutions, income } of grid) {
      const today = baseOf(withMarker(config, ABSENT), institutions, income);
      bases.add(today);
      for (const marker of MARKERS) {
        expect(baseOf(withMarker(config, marker), institutions, income), `${JSON.stringify(config)} n=${institutions.length} income=${income} marker=${String(marker)}`).toBe(today);
      }
    }
    expect(bases.size, 'the grid reaches more than one base, so the equality is not vacuous').toBeGreaterThan(2);
  });

  test('deriveProsperityLabels: no marker equals law 1 and every garbage marker, calm and under a crisis, with and without the required economy', () => {
    const bases = [...new Set(grid.map(({ config, institutions, income }) => baseOf(config, institutions, income)))];
    let below = 0;
    for (const { config } of grid.filter((_, i) => i % 9 === 0)) {
      for (const stressTypes of [[], ['indebted'], ['famine']]) {
        for (const priorityCriminal of [10, 95]) {
          for (const institutions of [[REQUIRED_HOUSE, GUILD], [PLAIN_HOUSE, GUILD]]) {
            const c = { ...config, stressTypes, priorityCriminal };
            for (const base of bases) {
              const today = labelsOf(base, withMarker(c, ABSENT), institutions);
              if (step(today.prosperity) < step(POOR) || step(today.prosperityStanding) < step(POOR)) below += 1;
              for (const marker of MARKERS) expect(labelsOf(base, withMarker(c, marker), institutions), `${base} ${JSON.stringify(c)} marker=${String(marker)}`).toEqual(today);
            }
          }
        }
      }
    }
    expect(below, 'the grid reaches labels below Poor, where a mis-gated floor would show').toBeGreaterThan(0);
  });
});

describe('(b) LIT, direct: under the law the size alone moves nothing, the depth reads the size\'s own expectation, and diversity is retired', () => {
  const alike = (tier) => ({ tier, settType: tier, tradeRouteAccess: 'road', monsterThreat: 'heartland', priorityEconomy: 50, priorityMagic: 80, magicExists: true });
  const atExpectation = (tier) => trades(FORTUNE_LAW_TUNING.depthExpectation[tier]);

  test('a city and a village alike in route, threat, dials, food and trades-at-expectation read the same base', () => {
    const city = baseOf(lit(alike('city')), atExpectation('city'));
    const village = baseOf(lit(alike('village')), atExpectation('village'));
    expect(city).toBe(village);
    // The control: today the same two read apart (the size alone moved them).
    expect(baseOf(dark(alike('city')), atExpectation('city'))).not.toBe(baseOf(dark(alike('village')), atExpectation('village')));
  });

  test('every size alike in all but size reads one base under the law', () => {
    const bases = SIZES.map((t) => baseOf(lit(alike(t)), atExpectation(t)));
    expect(new Set(bases).size).toBe(1);
  });

  test('a city with trades below 0.75 of its expectation reads one step below one at it', () => {
    const cfg = lit({ ...alike('city'), magicExists: false });
    const e = FORTUNE_LAW_TUNING.depthExpectation.city;
    const thin = Math.ceil(e * 0.75) - 1;
    expect(thin).toBeLessThan(e * 0.75);
    const at = baseOf(cfg, trades(e));
    const below = baseOf(cfg, trades(thin));
    expect(step(at) - step(below)).toBe(1);
    // And at 0.75 of it exactly the city is not thin.
    expect(baseOf(cfg, trades(Math.ceil(e * 0.75)))).toBe(at);
  });

  test('the income-diversity count moves nothing under the law (and moves the same inputs today)', () => {
    // An economy dial that leaves the sum a quarter above a whole step, so today's half-point bonus rounds it up.
    const cfg = { ...alike('town'), magicExists: false, priorityEconomy: 60 };
    const institutions = trades(FORTUNE_LAW_TUNING.depthExpectation.town);
    const litBases = [0, 5, 7].map((n) => baseOf(lit(cfg), institutions, n));
    expect(new Set(litBases).size).toBe(1);
    expect(baseOf(dark(cfg), institutions, 7), 'the control: today the count moves this base').not.toBe(baseOf(dark(cfg), institutions, 0));
  });
});

describe('(c) THE FLOOR: a calm place holding its required economy reads at least Poor after the label\'s steps, under the law only', () => {
  const calmCity = { tier: 'city', settType: 'city', tradeRouteAccess: 'road', monsterThreat: 'heartland', priorityEconomy: 5, priorityCriminal: 95, stressTypes: [] };
  const atLeastPoor = (label) => PROSPERITY_LABELS[Math.max(step(POOR), step(label))];
  const HOUSES = [REQUIRED_HOUSE, GUILD];

  test('the arm reaches the steps: economy output under 15 and crime 65 or more', () => {
    const flags = getInstFlags(calmCity, HOUSES);
    expect(flags.economyOutput).toBeLessThan(15);
    expect(flags.criminalEffective).toBeGreaterThanOrEqual(65);
  });

  test('calm, required economy: today below Poor, under the law at least Poor (printed and standing alike)', () => {
    const today = labelsOf(POOR, dark(calmCity), HOUSES);
    expect(step(today.prosperity), 'the steps take today\'s label below Poor').toBeLessThan(step(POOR));
    const under = labelsOf(POOR, lit(calmCity), HOUSES);
    expect(under).toEqual({ prosperity: atLeastPoor(today.prosperity), prosperityStanding: atLeastPoor(today.prosperityStanding) });
  });

  test('under 1 the same place reads today\'s value', () => {
    expect(labelsOf(POOR, dark(calmCity), HOUSES)).toEqual(labelsOf(POOR, withMarker(calmCity, ABSENT), HOUSES));
  });

  test('under a crisis the printed label is unfloored (the standing label reads no crisis, so it is floored)', () => {
    const crisis = { ...calmCity, stressTypes: ['indebted'] };
    const today = labelsOf(POOR, dark(crisis), HOUSES);
    expect(step(today.prosperity)).toBeLessThan(step(POOR));
    const under = labelsOf(POOR, lit(crisis), HOUSES);
    expect(under.prosperity).toBe(today.prosperity);
    expect(under.prosperityStanding).toBe(atLeastPoor(today.prosperityStanding));
  });

  test('an isolated thorp is unfloored (its route makes it Subsistence)', () => {
    const thorp = { ...calmCity, tier: 'thorp', settType: 'thorp', tradeRouteAccess: 'isolated' };
    for (const base of ['Subsistence', POOR]) {
      const today = labelsOf(base, dark(thorp), HOUSES);
      expect(labelsOf(base, lit(thorp), HOUSES)).toEqual(today);
    }
    expect(step(labelsOf(POOR, dark(thorp), HOUSES).prosperity), 'the floor would have had work to do').toBeLessThan(step(POOR));
  });

  test('without its required economy a calm place is unfloored', () => {
    const none = [PLAIN_HOUSE, GUILD];
    const today = labelsOf(POOR, dark(calmCity), none);
    expect(step(today.prosperity)).toBeLessThan(step(POOR));
    expect(labelsOf(POOR, lit(calmCity), none)).toEqual(today);
  });
});

describe('(d) BORN, forced: twelve births under the law read what the functions compute; with no marker, byte-identical to law 1', () => {
  const SEEDS = SIZES.flatMap((tier) => [0, 1].map((i) => [tier, `u2-fortune-${tier}-${i}`]));
  /** ABSENT: a LEGACY config (the law's key deleted, whatever the dial); a marker: forced AFTER birthConfig. */
  const born = (tier, seed, marker) => generateSettlementPipeline(
    marker === ABSENT ? legacyConfig({ ...DEFAULT_CONFIG, settType: tier }) : withMarker(birthConfig({ ...DEFAULT_CONFIG, settType: tier }), marker),
    null, { seed, customContent: {} },
  );
  /** @type {Record<string, any>} */ const lits = {};
  /** @type {Record<string, any>} */ const nones = {};
  /** @type {Record<string, any>} */ const ones = {};
  beforeAll(async () => {
    await loadGenerationLawPayloads();
    for (const [tier, seed] of SEEDS) {
      lits[seed] = born(tier, seed, LIT);
      nones[seed] = born(tier, seed, ABSENT);
      ones[seed] = born(tier, seed, DEFAULT_FORTUNE_LAW_VERSION);
    }
  }, 600000);

  /** What the functions compute from a town's own record, under the law its config carries. */
  const recomputed = (town) => {
    const config = town.config;
    const route = config.tradeRouteAccess;
    const income = town.economicState.incomeSources;
    const base = computeBaseProsperity(town.tier, route, town.institutions, config, null, income, generateFoodSecurity(town.tier, town.institutions, { ...config, tradeRouteAccess: route })).label;
    const standing = standingBaseProsperity(town.tier, route, town.institutions, config, null, income);
    const prev = setActiveRng(createPRNG('u2-fortune-born'));
    try { return { base, labels: deriveProsperityLabels(base, standing, config, town.institutions) }; } finally { clearActiveRng(prev); }
  };

  test('the forced arm carries the law into the record', () => {
    const failures = collectSeedFailures(SEEDS, ([, seed]) => {
      expect(lits[seed].config[FORTUNE_LAW_CONFIG_KEY], seed).toBe(LIT);
    });
    expectNoSeedFailures(failures, 'every forced birth carries the law in its config');
  });

  test('under the law, the printed and the standing labels are what the functions compute from each town\'s own record', () => {
    let read = 0;
    const failures = collectSeedFailures(SEEDS, ([, seed]) => {
      const town = lits[seed];
      const depth = town.institutions.filter((i) => !isMaterializedCustomContent(i) && (i.category === 'Economy' || i.category === 'Crafts')).length;
      expect(depth, seed).toBeGreaterThan(0);
      const { base, labels } = recomputed(town);
      if (base === 'Subsistence') {
        // The one Subsistence draw is the birth's own; the printed and the standing labels share it.
        expect(town.economicState.prosperity, seed).toBe(town.economicState.prosperityStanding);
        return;
      }
      expect({ prosperity: town.economicState.prosperity, prosperityStanding: town.economicState.prosperityStanding }, seed).toEqual(labels);
      read += 1;
    });
    expectNoSeedFailures(failures, 'every forced birth reads the labels its own record computes');
    expect(read, 'most of the twelve are read whole (a Subsistence base replays the birth\'s own draw)').toBeGreaterThan(SEEDS.length / 2);
  });

  test('the law moves the born labels of these twelve (the arm is not vacuous)', () => {
    const moved = SEEDS.filter(([, seed]) => lits[seed].economicState.prosperity !== ones[seed].economicState.prosperity
      || lits[seed].economicState.prosperityStanding !== ones[seed].economicState.prosperityStanding);
    expect(moved.length).toBeGreaterThan(0);
  });

  // "with no marker" means a LEGACY config (the law's key deleted), not a bare birthConfig that mints the dial
  test('with no marker the twelve are byte-identical (JSON) to a birth under law 1, the marker\'s own key aside', () => {
    const strip = (town) => JSON.stringify(town, (key, value) => (key === FORTUNE_LAW_CONFIG_KEY ? undefined : value));
    const failures = collectSeedFailures(SEEDS, ([, seed]) => {
      expect(JSON.stringify(nones[seed]).includes(FORTUNE_LAW_CONFIG_KEY), seed).toBe(false);
      expect(strip(ones[seed]), seed).toBe(JSON.stringify(nones[seed]));
    });
    expectNoSeedFailures(failures, 'every markerless birth is byte-identical to its law-1 twin');
  });
});
