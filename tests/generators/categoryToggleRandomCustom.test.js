/**
 * categoryToggleRandomCustom.test.js — [generators-pipeline-4].
 *
 * The wizard writes category disables keyed on the DISPLAY tier
 * (resolveDisplayTier): random/empty → `all::${cat}`, custom → `${popTier}::${cat}`.
 * Main assembly used to key off the raw settType sentinel ('random::cat' /
 * 'custom::cat'), so disabling a category did nothing for random/custom while
 * faction pulls honoured it. The shared isCategoryEnabled reader now checks
 * settType, the rolled tier (ctx.tier), and `all::`, so the disable reaches both
 * passes. Criminal is optional-only at these tiers (no required members), so its
 * count drops to zero when the category is disabled.
 *
 * Toggles reach the pipeline via config._categoryToggles (resolveConfig.js:72).
 */

import { describe, test, expect } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';

function gen(cfg, seed) {
  return generateSettlementPipeline(cfg, null, { seed, customContent: {} });
}
function criminalTotal(cfgExtra, base, n) {
  let total = 0;
  for (let i = 0; i < n; i++) {
    const s = gen({ ...base, ...cfgExtra }, `ct-${i}`);
    total += (s.institutions || []).filter((inst) => inst.category === 'Criminal').length;
  }
  return total;
}

describe('[generators-pipeline-4] category disables reach generation for random and custom settTypes', () => {
  test('random settType: all::Criminal=false suppresses criminal institutions', () => {
    const base = { settType: 'random', culture: 'germanic', terrainOverride: 'plains', tradeRouteAccess: 'road' };
    const without = criminalTotal({}, base, 16);
    const withToggle = criminalTotal({ _categoryToggles: { 'all::Criminal': false } }, base, 16);
    expect(without).toBeGreaterThan(0);        // the toggle is non-vacuous
    expect(withToggle).toBe(0);                // disable now honoured (was ignored pre-fix)
  });

  test('custom settType: the resolved-tier key suppresses criminal institutions', () => {
    // pop 3000 resolves to town; the wizard would write `town::Criminal`.
    const base = { settType: 'custom', population: 3000, culture: 'germanic', terrainOverride: 'plains', tradeRouteAccess: 'road' };
    const tier = gen(base, 'probe').config?.tier;
    const without = criminalTotal({}, base, 12);
    const withToggle = criminalTotal({ _categoryToggles: { [`${tier}::Criminal`]: false } }, base, 12);
    expect(without).toBeGreaterThan(0);
    expect(withToggle).toBe(0);
  });
});
