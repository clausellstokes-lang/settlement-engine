/**
 * W2-FIX-DATA-3 item 3 (REVIEW-W2-FIX-DATA F3): a Mine whose description works a shaft carried the
 * open-cast mine's service line, "Surface-level ore extraction. Lower yield than shaft mining but
 * cheaper to operate." The menu is the hamlet's Mine (open cast), and every Mine takes it. At town,
 * city and metropolis every text the Mine can print (the catalogue's and both variants) works a shaft
 * or an adit with winding gear, so the line was false in 95 of the census's 124 Mine towns (every one
 * of town size or more; e.g. r2r-town-11, r2r-city-6). The line now declares the size it is false at
 * (the tier, a fact the service draw already reads) and that case has its own line; the hamlet's
 * shallow pit keeps the surface line. Red until it does.
 */
import { beforeAll, describe, expect, test } from 'vitest';

import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';

const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
const SURFACE = /Surface-level ore extraction/;

/** The Mine's raw-extraction line in a census birth. */
const extraction = (/** @type {string} */ seed, /** @type {string} */ tier) => {
  const town = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...dials, settType: tier }), null, { seed, customContent: {} });
  const mine = town.institutions.find((/** @type {any} */ i) => /^Mine\b/.test(i.name));
  expect(mine, `${seed} has its mine`).toBeTruthy();
  const row = Object.values(town.availableServices || {}).flat().find((/** @type {any} */ v) => v.institution === mine.name && v.name === 'Raw extraction');
  expect(row, `${seed} lists the mine's raw extraction`).toBeTruthy();
  return { mine: String(mine.desc), line: String(/** @type {any} */ (row).desc) };
};

describe('W2-FIX-DATA-3: the mine\'s service line agrees with the mine it describes', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); }, 120_000);

  test('a shaft mine of town size or more is not called surface digging', () => {
    for (const [seed, tier] of /** @type {const} */ ([['r2r-town-11', 'town'], ['r2r-city-6', 'city'], ['r2r-metropolis-0', 'metropolis']])) {
      const { mine, line } = extraction(seed, tier);
      expect(mine, seed).toMatch(/shaft/);
      expect(line, seed).toMatch(/underground/);
      expect([line].filter((t) => SURFACE.test(t)), seed).toEqual([]);
    }
  }, 120_000);

  test('a hamlet\'s open-cast mine keeps the surface line (r2r-hamlet-3)', () => {
    expect(extraction('r2r-hamlet-3', 'hamlet').line).toMatch(SURFACE);
  }, 120_000);
});
