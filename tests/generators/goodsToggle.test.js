import { afterEach, describe, expect, test } from 'vitest';

import { generateEconomicState } from '../../src/generators/economicGenerator.js';
import { clearActiveRng, setActiveRng } from '../../src/generators/rngContext.js';

// F12(4) regression pin: the trade-goods force/exclude toggle is keyed
// `${tier}_good_${goodName}` — the vocabulary the Trade Dynamics UI writes
// (TradeDynamicsPanel.goodKey). generateEconomicState must honor that key end
// to end. rng pinned to 0 so every probability roll passes and the toggle is
// the only variable under test.

describe('goods force/exclude toggles (${tier}_good_<name>)', () => {
  afterEach(() => clearActiveRng());

  function gen(tier, institutions, route, goodsToggles, config) {
    setActiveRng({ random: () => 0 });
    const state = generateEconomicState(tier, institutions, route, goodsToggles, config);
    clearActiveRng();
    return state;
  }

  const CITY_INSTS = [
    { name: 'Central Market', category: 'Economic' },
    { name: 'Blacksmith Forge', category: 'Crafts' },
    { name: 'Weaver Guild', category: 'Crafts' },
  ];
  const CITY_CFG = { nearbyResources: ['iron_deposits', 'grain_fields', 'timber'] };

  test('forceExclude omits a good that would otherwise export', () => {
    const baseline = gen('city', CITY_INSTS, 'road', {}, CITY_CFG);
    expect(baseline.primaryExports).toContain('Iron ore');

    const excluded = gen(
      'city',
      CITY_INSTS,
      'road',
      { 'city_good_Iron ore': { allow: false, force: false, forceExclude: true } },
      CITY_CFG,
    );
    expect(excluded.primaryExports).not.toContain('Iron ore');
  });

  test('force includes a good that would otherwise be absent', () => {
    const baseline = gen('town', [], 'road', {}, { nearbyResources: [] });
    expect(baseline.primaryExports).not.toContain('Pottery and ceramics');

    const forced = gen(
      'town',
      [],
      'road',
      { 'town_good_Pottery and ceramics': { allow: true, force: true, forceExclude: false } },
      { nearbyResources: [] },
    );
    expect(forced.primaryExports).toContain('Pottery and ceramics');
  });
});
