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
    expect(hooks).not.toContain(TIMBER); // anchored: the same hooks are proven to carry the twin on the line above
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
    expect(STARVING).not.toMatch(/villagers?/i); // anchored: STARVING is the key found by its opening words above; toMatch type-checks it as a string
    expect(SET[0].needs).toEqual(['food: ≤ deficit']);
  });

  it('a starving town keeps the starving hook', () => {
    expect(starvingHooks('town', 'famine')).toEqual([STARVING]);
  });

  // LANDING-R2 seat E: the band tables below run as plain parameterless tests, each row labelled.
  it('an importDependent or pressured gap reads the twin, with no famine words', () => {
    for (const band of ['importDependent', 'pressured']) {
      const [hook] = starvingHooks('hamlet', band);
      expect(hook, band).toBe(SET[1].text);
      expect(hook, band).not.toMatch(/\bstarv|\bbanditry\b|\bfamine\b|villagers?/i); // anchored: the hook is pinned to the twin's exact text on the line above
    }
  });

  it('the twin answers the moderate gap only', () => {
    expect(SET[1]).toMatchObject({ twinOf: STARVING, excludes: ['food: ≤ deficit'], needs: ['food: ≤ pressured'] });
  });
});

// CENSUS-3h (R-AV, the chair's answer 2): a twin carries only the severity and category the record
// holds. The moderate-gap twin takes the band the food record reads at that birth — its category
// is the band's own label (`FOOD_SECURITY_BANDS`, never re-spelled), its severity the band's grade
// (Import-Dependent `medium`, the record's own grade for that band's hook; Pressured `low`) —
// and never "Survival Crisis / critical", which stays with the famine-band original.
describe('the moderate-gap twin carries the band the record reads (CENSUS-3h, R-AV)', () => {
  const STARVING = Object.keys(OUTLOOK_HOOK_SIBLINGS).find((t) => t.startsWith('The settlement is starving.'));
  const graded = (band) => deriveSupplyRiskAnalysis(400, {}, [], { tradeRouteAccess: 'isolated', tier: 'hamlet' },
    { deficit: 50, dailyProduction: 50, dailyNeed: 100 },
    () => factsOf({ tier: 'hamlet', institutions: [], economicState: { foodSecurity: { foodRecord: { band } } } })).plotHooks[0];

  it('an importDependent gap reads Import-Dependent / medium; a pressured gap, Pressured / low', () => {
    for (const [band, category, severity] of [
      ['importDependent', 'Import-Dependent', 'medium'],
      ['pressured', 'Pressured', 'low'],
    ]) {
      expect(graded(band), band).toMatchObject({ category, severity });
    }
  });

  it('a famine or deficit band keeps the original at Survival Crisis / critical', () => {
    for (const band of ['famine', 'deficit']) {
      expect(graded(band), band).toMatchObject({ hook: STARVING, category: 'Survival Crisis', severity: 'critical' });
    }
  });
});
