/**
 * tests/generators/timberHookForestHeld.test.js — R2-CODE-A-8, item 7 (ROUND-3-CUT #1004, #1336): the
 * outlook hook "Something is killing the forest the timber comes from … find out what is in those
 * woods?" printed in towns whose record holds no forest at all (rr2s-metropolis-plague_onset-port-1:
 * a coastal metropolis whose only resource is a magical node) or whose forest is worked out
 * (rr2s-city-occupied-rand-1: "It has worked out its managed woodland"). The hook fires on the
 * terrain's must-import list, which says nothing of a forest. THE CHAIR'S RULING: a line names an
 * import or a source only where the record holds it; under a siege nothing is brought in by road.
 * The line (and its navigable twin) is written only where the roster's resources hold a timber
 * stand still standing (`availableNativeResourceKeys`: managed_forest, shipbuilding_timber,
 * mountain_timber, not depleted), and not under a siege that cuts every road with no channel past it
 * (`siegeCutsImports`, the importer's rule). Elsewhere it is not written (no twin: a twin naming the
 * import would be new words, left to the owner). No draw: a T branch.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { deriveSupplyRiskAnalysis } from '../../src/generators/economy/foodBalance.js';
import { availableNativeResourceKeys } from '../../src/domain/resourceSemantics.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';

const TIMBER = /the forest the timber comes from/;
/** Composed at the merge of the line (976db5b19): the timber branch draws the forest sentence or the line's rafts sentence by `pick` (population + institutions, no roll); a population of 801 beside one sawmill draws the forest one. */
const TIMBER_HOOK = /the forest the timber comes from|The timber rafts stopped coming/;
const SAWMILL = [{ name: 'Sawmill', category: 'Crafts' }];
const BALANCE = { deficit: 0, dailyProduction: 10, dailyNeed: 10 };
const timberFor = (/** @type {any} */ config, balance = BALANCE) => deriveSupplyRiskAnalysis(801, { mustImport: ['timber'] }, SAWMILL, { tradeRouteAccess: 'road', terrainType: 'plains', tier: 'town', ...config }, balance)
  .plotHooks.some((h) => TIMBER.test(h.hook));

describe('the timber line names a forest only where the record holds one', () => {
  it('no stand of timber, or a stand worked out, writes no line; a standing forest keeps it', () => {
    expect(timberFor({ nearbyResources: ['magical_node'] })).toBe(false);
    expect(timberFor({ nearbyResources: ['managed_forest'], nearbyResourcesDepleted: ['managed_forest'] })).toBe(false);
    expect(timberFor({ nearbyResources: ['managed_forest'] })).toBe(true);
    expect(timberFor({ nearbyResources: ['mountain_timber', 'iron_deposits'] })).toBe(true);
  });
  it('a siege with no channel past it writes no line; a siege a channel still feeds keeps it', () => {
    expect(timberFor({ nearbyResources: ['managed_forest'], stressTypes: ['under_siege'] })).toBe(false);
    expect(timberFor({ nearbyResources: ['managed_forest'], stressTypes: ['under_siege'] }, { ...BALANCE, importChannel: 'teleportation circle' })).toBe(true);
  });
});

const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
/** The lane's births in the app's shape (probes/R2-CODE-A-3/b740.mjs :: cfgFor). @param {string} seed */
function born(seed) {
  let m = seed.match(/^r2r-(\w+)-(\d+)$/);
  let cfg;
  if (m) cfg = { ...DEFAULT_CONFIG, ...DIALS, settType: m[1] };
  else if ((m = seed.match(/^r2s-(\w+)-(thorp|hamlet|village|town|city|metropolis)-(\d+)$/))) cfg = { ...DEFAULT_CONFIG, ...DIALS, selectedStresses: [m[1]], selectedStressesRandom: false, settType: m[2] };
  else {
    m = /** @type {RegExpMatchArray} */ (seed.match(/^rr2s-(\w+)-([a-z_+]+)-([a-z_]+)-(\d+)$/));
    cfg = { ...DEFAULT_CONFIG, ...(m[3] === 'rand' ? {} : { tradeRouteAccess: m[3] }), settType: m[1], selectedStressesRandom: false, selectedStresses: m[2] === 'calm' ? [] : m[2].split('+'), _randomizePriorities: true };
  }
  return /** @type {any} */ (generateSettlementPipeline(birthConfig(cfg), null, { seed, customContent: {} }));
}
/** @param {any} s */
const printsTimberHook = (s) => (s.economicViability?.plotHooks || []).some((/** @type {any} */ h) => TIMBER_HOOK.test(h.hook));
/** @param {any} s */
const printsTimber = (s) => (s.economicViability?.plotHooks || []).some((/** @type {any} */ h) => TIMBER.test(h.hook));
/** @param {any} s */
const forestHeld = (s) => availableNativeResourceKeys(s.config).some((k) => /^(managed_forest|shipbuilding_timber|mountain_timber)$/.test(k));

describe('the cut\'s towns and their guard, born as the app births them', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });
  it('no town whose record holds no standing timber is told the forest its timber comes from is dying', () => {
    const towns = ['rr2s-metropolis-plague_onset-port-1', 'rr2s-city-occupied-rand-1', 'r2r-city-4', 'r2r-village-4'].map((seed) => ({ seed, s: born(seed) }));
    const falseForest = towns.filter(({ s }) => !forestHeld(s) && printsTimber(s)).map(({ seed }) => seed);
    expect(falseForest).toEqual([]);
  });
  it('the guard towns, with a forest standing, keep the timber hook, whichever sentence the draw of the line gives (a calm city with a managed forest; a village by shipbuilding timber)', () => {
    const towns = ['r2r-city-26', 'r2r-village-11'].map((seed) => ({ seed, s: born(seed) }));
    expect(towns.map(({ seed, s }) => [seed, forestHeld(s), printsTimberHook(s)])).toEqual(towns.map(({ seed }) => [seed, true, true]));
  });
});
