/**
 * tests/generators/importerHookNoTrade.test.js — R2-CODE-A item 6 (the cold list REVIEW-W2A-3,
 * HIGH #333, MEDIUM #859): "One importer now brings in all the grain and has quadrupled the price"
 * printed under a siege that lets no food in ("No food comes into Lidostagnum by trade."). The
 * hook presumes food comes in by trade; it reads the siege the food balance itself reads (`config.stressTypes`,
 * which sets its route to isolated) and the balance's `importChannel` (a magic channel can still carry food past a
 * siege); where the siege has cut every road, the hoard inside is told instead. No draw: a T branch.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { deriveSupplyRiskAnalysis } from '../../src/generators/economy/foodBalance.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';

const IMPORTER = /One importer now brings in all the grain/;

describe('the importer hook reads the import coverage', () => {
  it('a siege that a magic channel still feeds keeps the importer', () => {
    const { plotHooks } = deriveSupplyRiskAnalysis(1000, 'plains', [], { tradeRouteAccess: 'river', stressTypes: ['under_siege'] }, { deficit: 50, dailyProduction: 100, dailyNeed: 150, importCoverage: 10, importChannel: 'airship trade' });
    expect(plotHooks.some((h) => IMPORTER.test(h.hook))).toBe(true);
  });
  it('a deficit with food coming in by trade keeps the importer', () => {
    const { plotHooks } = deriveSupplyRiskAnalysis(1000, 'plains', [], { tradeRouteAccess: 'river' }, { deficit: 50, dailyProduction: 100, dailyNeed: 150, importCoverage: 25, importChannel: 'river trade' });
    expect(plotHooks.some((h) => IMPORTER.test(h.hook))).toBe(true);
  });
  it('a siege with no channel carrying food in tells the hoard, never an importer', () => {
    const { plotHooks } = deriveSupplyRiskAnalysis(1000, 'plains', [], { tradeRouteAccess: 'river', stressTypes: ['under_siege'] }, { deficit: 50, dailyProduction: 100, dailyNeed: 150 });
    expect(plotHooks.some((h) => IMPORTER.test(h.hook))).toBe(false);
    const hoard = plotHooks.find((h) => h.category === 'Hoarded Food');
    expect(hoard?.hook).toMatch(/^No food comes in by trade now/);
  });
});

describe('the cold list\'s besieged towns, born as the app births them', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });
  it('no importer while no food comes in by trade (every row)', () => {
    expectNoSeedFailures(collectSeedFailures([['rw3-hamlet-under_siege-1'], ['rw3-town-under_siege+famine-1']], ([seed]) => {
      const m = /** @type {RegExpMatchArray} */ (seed.match(/^rw3-(\w+)-([a-z_+]+)-\d+$/));
      const s = /** @type {any} */ (generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: m[1], selectedStressesRandom: false, selectedStresses: m[2].split('+'), _randomizePriorities: true }), null, { seed, customContent: {} }));
      expect(s.economicState.foodSecurity.importCoverage || 0, `${seed}: no food comes in by trade`).toBe(0);
      const hooks = JSON.stringify((s.economicViability?.plotHooks || []).map((/** @type {any} */ h) => h.hook));
      expect(hooks, `${seed}: no importer`).not.toMatch(IMPORTER);
      expect(hooks, `${seed}: the no-trade hook prints`).toMatch(/No food comes in by trade now/);
    }), 'no importer while no food comes in by trade');
  });
});
