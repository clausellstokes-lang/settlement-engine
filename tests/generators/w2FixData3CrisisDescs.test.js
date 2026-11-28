/**
 * W2-FIX-DATA-3 item 1 (REVIEW-W2-FIX-DATA F1): the institution descriptions that declare a crisis
 * (the town granary under famine, the charnel house's carts under siege) are drawn with the crisis the
 * birth has RESOLVED, not with the caller's raw configuration. The app writes a chosen crisis as
 * `selectedStresses` with `selectedStressesRandom: false` (the configuration panel's shape); the raw
 * configuration then carries no `stressTypes`, and only `resolveStress` threads them into
 * `ctx.effectiveConfig`. Red while `assembleInstitutions` handed the draw `ctx.config`: these census
 * towns printed "prevents famine" / "hold off famine" in a famine and "carts go out at dusk" under siege.
 */
import { beforeAll, describe, expect, test } from 'vitest';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';

import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';

const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };

/** A birth in the app's own shape: the crisis chosen in the panel, random crises off. */
const born = (/** @type {string} */ seed, /** @type {string} */ tier, /** @type {string} */ crisis) => generateSettlementPipeline(
  birthConfig({ ...DEFAULT_CONFIG, ...dials, settType: tier, selectedStresses: [crisis], selectedStressesRandom: false }),
  null,
  { seed, customContent: {} },
);
const descOf = (/** @type {any} */ town, /** @type {RegExp} */ name) => {
  const inst = town.institutions.find((/** @type {any} */ i) => name.test(i.name));
  expect(inst, `the town has its ${name}`).toBeTruthy();
  return String(inst.desc);
};

describe('W2-FIX-DATA-3: a crisis-declaring description reads the crisis the birth resolved (app shape)', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); }, 120_000);

  test('a granary in a famine says the famine is drawing it down, not that it prevents famine', () => {
    expectNoSeedFailures(collectSeedFailures(['r2s-famine-town-0', 'r2s-famine-town-1', 'r2s-famine-town-2', 'r2s-famine-town-3'], (seed) => {
      const town = born(seed, 'town', 'famine');
      expect([].concat(town.stress).map((/** @type {any} */ s) => s.type)).toContain('famine');
      const desc = descOf(town, /granary/i);
      expect(desc, seed).toMatch(/has not been enough|drawing them down faster/);
      expect([desc].filter((t) => /prevents famine|hold off famine/.test(t)), seed).toEqual([]);
    }), 'every famine granary reads the famine');
  }, 120_000);

  test('a charnel house under siege sends no cart out to the new ground', () => {
    expectNoSeedFailures(collectSeedFailures(['r2s-under_siege-city-1', 'r2s-under_siege-city-2'], (seed) => {
      const town = born(seed, 'city', 'under_siege');
      expect([].concat(town.stress).map((/** @type {any} */ s) => s.type)).toContain('under_siege');
      const desc = descOf(town, /charnel/i);
      expect(desc, seed).toMatch(/no cart goes out|with the roads cut it now holds/);
      expect([desc].filter((t) => /carts (?:that )?go out at dusk|Carts go out at dusk/.test(t)), seed).toEqual([]);
    }), 'every siege charnel house sends no cart');
  }, 120_000);

  // The second arm: a crisis rolled by chance (random crises on) can still be dropped by the
  // confirm pass after the description is drawn. These four census towns roll a famine or a siege
  // that the confirm pass drops: they end calm, so their granary or charnel house keeps its calm
  // line. Red when the draw read every crisis threaded into effectiveConfig (the twin printed a
  // famine or a siege the finished town does not have).
  test('a crisis the confirm pass drops is not read by the description: the calm line stays', () => {
    for (const [seed, tier, name, calm] of /** @type {const} */ ([
      ['r2r-town-31', 'town', /granary/i, /hold off famine|prevents famine/],
      ['r2r-city-22', 'city', /charnel/i, /carts (?:that )?go out at dusk|Carts go out at dusk/],
      ['r2r-city-28', 'city', /charnel/i, /carts (?:that )?go out at dusk|Carts go out at dusk/],
      ['r2r-city-45', 'city', /charnel/i, /carts (?:that )?go out at dusk|Carts go out at dusk/],
    ])) {
      const town = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...dials, settType: tier }), null, { seed, customContent: {} });
      const crises = [].concat(town.stress || []).map((/** @type {any} */ s) => s?.type);
      expect(crises.filter((t) => t === 'famine' || t === 'under_siege'), seed).toEqual([]);
      expect(descOf(town, name), seed).toMatch(calm);
    }
  }, 120_000);
});
