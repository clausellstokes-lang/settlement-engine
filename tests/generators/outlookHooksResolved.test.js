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

// CENSUS-3g unit 5 (R-AM read, R-U / R-G): the starving set. Ledgered since R-AM, the kept-refused
// original read false on 162 of the 1,000 (`tier` 110, `food` 140) and was then dropped by the
// hook-truth pass. The original is reworded to presume only the famine band (no "Villagers"), and
// the moderate gap (Import-Dependent / Pressured: the chair's ruling 1 of 2026-11-03, "a grain-price
// hook for a moderate gap, nothing for a fed place") takes one twin with no famine words.
describe('the starving outlook set (CENSUS-3g unit 5)', () => {
  const STARVING = Object.keys(OUTLOOK_HOOK_SIBLINGS).find((t) => t.startsWith('The settlement is starving.'));
  const SET = OUTLOOK_HOOK_SIBLINGS[STARVING];
  const starvingHooks = (tier, band) => deriveSupplyRiskAnalysis(400, {}, [], { tradeRouteAccess: 'isolated', tier },
    { deficit: 50, dailyProduction: 50, dailyNeed: 100 },
    () => factsOf({ tier, institutions: [], economicState: { foodSecurity: { foodRecord: { band } } } })).plotHooks.map((h) => h.hook);

  it('the original presumes only the famine band: no residents called villagers', () => {
    expect(STARVING).not.toMatch(/villagers?/i);
    expect(SET[0].needs).toEqual(['food: ≤ deficit']);
  });

  it('a starving town keeps the starving hook', () => {
    expect(starvingHooks('town', 'famine')).toEqual([STARVING]);
  });

  it.each(['importDependent', 'pressured'])('a %s gap reads the twin, with no famine words', (band) => {
    const [hook] = starvingHooks('hamlet', band);
    expect(hook).toBe(SET[1].text);
    expect(hook).not.toMatch(/\bstarv|\bbanditry\b|\bfamine\b|villagers?/i);
  });

  it('the twin answers the moderate gap only', () => {
    expect(SET[1]).toMatchObject({ twinOf: STARVING, excludes: ['food: ≤ deficit'], needs: ['food: ≤ pressured'] });
  });
});
