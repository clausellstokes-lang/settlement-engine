/**
 * tests/generators/outlookHooksResolved.test.js — CENSUS-1f unit 3 (Appendix B item 23, T): the
 * outlook hooks of `foodBalance.js :: deriveSupplyRiskAnalysis` resolve through
 * `resolveSibling(…, OUTLOOK_HOOK_SIBLINGS, …)`: the timber line names shipbuilding only where the
 * water is navigable (CENSUS-3d's `[sea]` class, "shipbuilding" on plains roads).
 *
 * @enforced-by npx vitest run tests/generators/outlookHooksResolved.test.js
 */
import { describe, expect, it } from 'vitest';
import { deriveSupplyRiskAnalysis, OUTLOOK_HOOK_SIBLINGS } from '../../src/generators/economy/foodBalance.js';
import { factsOf } from '../../src/domain/facts/factsOf.js';

const TIMBER = Object.keys(OUTLOOK_HOOK_SIBLINGS).find((t) => t.includes('shipbuilding'));
const TWIN = OUTLOOK_HOOK_SIBLINGS[TIMBER].find((l) => l.twinOf).text;
const INSTITUTIONS = [{ name: 'Sawmill', category: 'Crafts' }];
const BALANCE = { deficit: 0, dailyProduction: 10, dailyNeed: 10 };
const hooksFor = (config) => deriveSupplyRiskAnalysis(800, { mustImport: ['timber'] }, INSTITUTIONS, config,
  BALANCE, () => factsOf({ institutions: INSTITUTIONS, config, tier: 'town' })).plotHooks.map((h) => h.hook);

describe('the outlook hooks resolve (CENSUS-1f unit 3)', () => {
  it('a plains road town is not told its shipbuilding stalls', () => {
    const hooks = hooksFor({ tradeRouteAccess: 'road', terrainType: 'plains', tier: 'town' });
    expect(hooks).toContain(TWIN);
    expect(hooks).not.toContain(TIMBER);
  });

  it('a coastal port keeps the shipbuilding line', () => {
    const hooks = hooksFor({ tradeRouteAccess: 'port', terrainType: 'coastal', tier: 'town' });
    expect(hooks).toContain(TIMBER);
  });
});
