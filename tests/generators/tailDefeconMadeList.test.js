/**
 * tailDefeconMadeList.test.js — TAIL-DEFECON-C (the chair's rulings D6 and D7, 2026-11-14): the record's made list
 * (`economicState.localProduction`, written by `computeActiveChains.js :: deriveLocalProductionFromChains`) names what
 * the town's own houses make, and only goods.
 *
 * Born as the census born its 720 (RECORD-MEASURE-1, `seedcfg.mjs`, the r2r- arm). Each GONE pair was red at the
 * base (345f13157); each KEEP pair is a true sibling in the same town, green before and after.
 *
 * (C2-A) A CATEGORY KEY IS NOT A GOOD: no `trade access`, `maritime access`, `Toll income`, `Market taxes`,
 * `luxury`, `Strategic control` or `water` (302 towns at the base; 0 after; the made list alone moves).
 */
import { beforeAll, describe, expect, test } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';

const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true,
  selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
/** The census's r2r- birth. @param {string} seed */
const birth = (seed) => {
  const m = /** @type {RegExpMatchArray} */ (seed.match(/^r2r-(\w+)-\d+$/));
  return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: m[1] }), null, { seed, customContent: {} });
};
/** @type {Map<string, string[]>} */
const made = new Map();
/** @param {string} seed */
const madeIn = (seed) => {
  if (!made.has(seed)) made.set(seed, /** @type {string[]} */ (birth(seed).economicState.localProduction || []));
  return /** @type {string[]} */ (made.get(seed));
};

/** (seed, the key that must not be listed as made, what is still listed there instead) */
const C2A = [
  ['r2r-thorp-8', 'luxury', 'Honey and beeswax'],
  ['r2r-thorp-4', 'water', 'dates'],
  ['r2r-town-4', 'maritime access', 'salt'],
  ['r2r-town-14', 'Toll income', 'Baked goods'],
  ['r2r-town-14', 'Market taxes', 'grain'],
  ['r2r-town-14', 'trade access', 'flour'],
  ['r2r-town-30', 'Strategic control', 'Overland cargo transport'],
  ['r2r-city-2', 'trade access', 'fish'],
  ['r2r-city-2', 'maritime access', 'Salted fish'],
];

describe('the made list names goods (C2-A)', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });

  test.each(C2A)('%s: "%s" is not listed as made; "%s" still is', (seed, gone, keep) => {
    const list = madeIn(seed);
    expect(list, 'GONE').not.toContain(gone);
    expect(list, 'KEEP').toContain(keep);
  }, 60000);

  test('the place the keys left: r2r-town-14 lists its jeweller\'s cut gemstones (no longer folded by the catalog into the "luxury" key)', () => {
    expect(madeIn('r2r-town-14')).toContain('Cut gemstones');
  }, 60000);
});
