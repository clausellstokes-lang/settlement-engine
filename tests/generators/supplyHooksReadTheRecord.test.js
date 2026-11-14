/**
 * tests/generators/supplyHooksReadTheRecord.test.js — R2-CODE-A-8, item 7 (ROUND-3-CUT #208): the
 * outlook hook "One importer now brings in all the grain" printed in towns whose own import list holds
 * no grain (rr2s-hamlet-plague_onset-rand-1 imports herbs and incense and lives on fish; r2r-thorp-19
 * imports salt). THE CHAIR'S RULING: a line names an import or a source only where the record holds it.
 * The importer reads the import list (`factsOf(…).imports`, the record's `primaryImports`); where it
 * holds no grain the hook is not written (no twin: no other line is true of a town that buys no grain).
 * Under a siege the earlier pin stands (importerHookNoTrade.test.js): a magic channel the balance names
 * can still carry the grain, and with no channel the hoard is told. No draw: a T branch.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { deriveSupplyRiskAnalysis } from '../../src/generators/economy/foodBalance.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';

const IMPORTER = /One importer now brings in all the grain/;
const BALANCE = { deficit: 50, dailyProduction: 100, dailyNeed: 150, importCoverage: 25, importChannel: 'river trade' };
const importerFor = (/** @type {string[]} */ imports) => deriveSupplyRiskAnalysis(1000, 'plains', [], { tradeRouteAccess: 'river' }, BALANCE, () => ({ imports }))
  .plotHooks.some((h) => IMPORTER.test(h.hook));

describe('the importer names grain only where the record imports it', () => {
  it('an import list with no grain writes no importer; one with grain keeps it', () => {
    expect(importerFor(['Salt', 'Medicinal herbs'])).toBe(false);
    expect(importerFor([])).toBe(false);
    expect(importerFor(['Salt', 'Grain'])).toBe(true);
    expect(importerFor(['Bulk grain (local fields depleted)'])).toBe(true);
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
const printsImporter = (s) => (s.economicViability?.plotHooks || []).some((/** @type {any} */ h) => IMPORTER.test(h.hook));
/** @param {any} s */
const importsGrain = (s) => (s.economicState?.primaryImports || []).some((/** @type {unknown} */ x) => /grain/i.test(typeof x === 'string' ? x : String(/** @type {any} */ (x)?.name ?? '')));

describe('the cut\'s towns and their guards, born as the app births them', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });
  it('no town whose import list holds no grain is told an importer brings in all its grain', () => {
    const towns = ['rr2s-hamlet-plague_onset-rand-1', 'r2r-thorp-19', 'r2r-thorp-41'].map((seed) => ({ seed, s: born(seed) }));
    const falseImporter = towns.filter(({ s }) => !importsGrain(s) && printsImporter(s)).map(({ seed }) => seed);
    expect(falseImporter).toEqual([]);
  });
  it('the guard towns, which import grain, keep the importer (a famine hamlet; a besieged city fed through its teleportation circle)', () => {
    const towns = ['r2r-hamlet-16', 'r2s-under_siege-city-0'].map((seed) => ({ seed, s: born(seed) }));
    expect(towns.map(({ seed, s }) => [seed, importsGrain(s), printsImporter(s)])).toEqual(towns.map(({ seed }) => [seed, true, true]));
  });
});
