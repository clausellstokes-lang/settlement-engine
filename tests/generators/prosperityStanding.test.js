/**
 * prosperityStanding.test.js — COHERENCE-UPKEEP-5, the chair's R3: pay reads the STANDING label.
 *
 * Prosperity's own writer stores, beside `economicState.prosperity`, `prosperityStanding`: the
 * label the place would carry with NO crisis in force (the food record and the base read with
 * the crises emptied, the label then read from that base with the SAME Subsistence draw
 * replayed, never a second draw). The stores are laid by at the standing label's share.
 *
 * The pins were measured on fresh births no seat tuned on (`v3build-*`):
 *   - `printed` at e1b2f9c1f, the tree without this change (the printed label must not move);
 *   - `standing` and `months` in a scratch copy of e1b2f9c1f carrying the probe's two measuring
 *     lines (docs/chair/2026-11-13/probes/UPKEEP-5/measure-lines.patch): the label with no
 *     crisis, the draw replayed, and the months laid by at that label's share.
 */
import { beforeAll, describe, expect, test } from 'vitest';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { keepOf, keepOfRecord } from '../../src/domain/facts/keep.js';
import { deriveProsperityLabel, deriveProsperityLabels } from '../../src/generators/economy/prosperity.js';
import { createPRNG } from '../../src/kernel/prng.js';
import { setActiveRng, clearActiveRng } from '../../src/kernel/rngContext.js';

const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };

/** seed -> [tier, forced crisis, printed label at e1b2f9c1f, standing label, months at the standing share] */
const PINS = Object.freeze({
  'v3build-thorp-0': ['thorp', null, 'Struggling', 'Struggling', 1.4],
  'v3build-hamlet-1': ['hamlet', null, 'Struggling', 'Poor', 1.5],
  'v3build-hamlet-2': ['hamlet', null, 'Struggling', 'Moderate', 1.6],
  'v3build-village-0': ['village', null, 'Struggling', 'Moderate', 1.7],
  'v3build-town-1': ['town', null, 'Moderate', 'Comfortable', 6.1],
  'v3build-city-0': ['city', null, 'Struggling', 'Comfortable', 8.7],
  'v3build-city-2': ['city', null, 'Wealthy', 'Wealthy', 9],
  'v3build-metropolis-1': ['metropolis', null, 'Moderate', 'Moderate', 14.1],
  'v3build-famine-town-0': ['town', 'famine', 'Struggling', 'Moderate', 1.4],
  'v3build-famine-city-0': ['city', 'famine', 'Struggling', 'Comfortable', 7],
  'v3build-under_siege-city-0': ['city', 'under_siege', 'Struggling', 'Wealthy', 8.8],
  'v3build-wartime-town-0': ['town', 'wartime', 'Comfortable', 'Wealthy', 6.3],
  'v3build-occupied-city-0': ['city', 'occupied', 'Poor', 'Prosperous', 9],
});

/** @param {string} seed */
function born(seed) {
  const [tier, stress] = PINS[seed];
  const cfg = stress
    ? birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: tier, selectedStresses: [stress], selectedStressesRandom: false })
    : birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: tier });
  return generateSettlementPipeline(cfg, null, { seed, customContent: {} });
}

describe('the standing label (R3): the label with no crisis in force, stored by prosperity\'s writer', () => {
  /** @type {Record<string, any>} */
  const births = {};
  beforeAll(async () => {
    await loadGenerationLawPayloads();
    for (const seed of Object.keys(PINS)) births[seed] = born(seed);
  });

  test('the printed label is the label the tree printed before the change, on every pin', () => {
    const got = Object.fromEntries(Object.keys(PINS).map((k) => [k, births[k].economicState.prosperity]));
    expect(got).toEqual(Object.fromEntries(Object.entries(PINS).map(([k, row]) => [k, row[2]])));
  });

  test('economicState.prosperityStanding is the probe\'s reading, on every pin', () => {
    const got = Object.fromEntries(Object.keys(PINS).map((k) => [k, births[k].economicState.prosperityStanding]));
    expect(got).toEqual(Object.fromEntries(Object.entries(PINS).map(([k, row]) => [k, row[3]])));
  });

  test('the stores are laid by at the standing label\'s share', () => {
    const got = Object.fromEntries(Object.keys(PINS).map((k) => [k, births[k].economicState.foodSecurity.storageMonths]));
    expect(got).toEqual(Object.fromEntries(Object.entries(PINS).map(([k, row]) => [k, row[4]])));
  });

  test('keepOfRecord reads the standing label, and an old save without it reads the label it has', () => {
    for (const k of Object.keys(PINS)) {
      expect(keepOfRecord(births[k].economicState), k).toEqual(keepOf(PINS[k][3]));
    }
    expect(keepOfRecord({ prosperity: 'Struggling' })).toEqual(keepOf('Struggling'));
    expect(keepOfRecord({ prosperity: 'Struggling', prosperityStanding: 'Wealthy' })).toEqual(keepOf('Wealthy'));
    expect(keepOfRecord(undefined)).toEqual(keepOf(undefined));
  });

  test('the two labels take the draw the one label took: no second draw', () => {
    const cfg = { tier: 'thorp', tradeRouteAccess: 'isolated', stressTypes: ['famine'], priorityEconomy: 50 };
    for (const seed of ['sub-a', 'sub-b', 'sub-c', 'sub-d', 'sub-e', 'sub-f']) {
      const one = createPRNG(seed); const prevA = setActiveRng(one);
      const label = deriveProsperityLabel('Subsistence', cfg, []);
      const after1 = one.random();
      clearActiveRng(prevA);
      const two = createPRNG(seed); const prevB = setActiveRng(two);
      const both = deriveProsperityLabels('Subsistence', 'Subsistence', cfg, []);
      const after2 = two.random();
      clearActiveRng(prevB);
      expect(both.prosperity, seed).toBe(label);
      expect(after2, `${seed}: the stream sits where the one label left it`).toBe(after1);
    }
  });
});
