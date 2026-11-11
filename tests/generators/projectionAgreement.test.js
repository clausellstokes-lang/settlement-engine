/**
 * projectionAgreement.test.js — COHERENCE-AGREE's guard (the chair's charter of 2026-11-11, §2):
 * ONE FACT, ONE ANSWER. The generation's coherence receipt (`generationCoherence.js ::
 * projectionAgreementFindings`) asserts that every field of the record stating a fact the town's own
 * drawn record answers agrees with it: the terrain's must-import list, strengths and strategic line
 * against the town's live resources; the viability hooks against the war record and the live
 * resources; the safety text against the defence home; the import list against the food record.
 *
 * ARM 1 (guard-the-guard) builds one record per finding and proves the arm convicts it and clears
 * its twin. ARM 2 births the corpus seeds that disagreed at the lane's base (99bcc6944; the corpus
 * of `docs/chair/2026-11-11/` — seeds `agree-<tier>-<i>`, every browser dial on random) and holds
 * `resource_truth` and `food_verdict` clean on each: red before the cures, green after.
 */
import { beforeAll, describe, expect, test } from 'vitest';

import { projectionAgreementFindings } from '../../src/generators/generationCoherence.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';

const record = (over = {}) => ({
  config: { terrainType: 'plains', tradeRouteAccess: 'road', ...(over.config || {}) },
  resourceAnalysis: { availableResources: [], imports: { critical: [], reasons: {} }, economicStrengths: [], strategicValue: '', ...(over.resourceAnalysis || {}) },
  economicState: { primaryImports: [], foodSecurity: { foodRecord: { grownPct: 50 } }, safetyProfile: {}, ...(over.economicState || {}) },
  economicViability: { plotHooks: over.hooks || [] },
  institutions: over.institutions || [],
});
const details = (r) => { const f = projectionAgreementFindings(r); return [...f.resource, ...f.food].map((x) => x.detail); };

describe('the projection-agreement arm convicts each disagreement and clears its twin', () => {
  test('a must-import beside the live resource that yields it', () => {
    const critical = { critical: ['metals'], reasons: { metals: 'Plains terrain cannot produce this locally' } };
    expect(details(record({ resourceAnalysis: { availableResources: ['iron_deposits', 'iron'], imports: critical } }))).toContain('A terrain must-import names a material a live local resource yields.');
    expect(details(record({ resourceAnalysis: { availableResources: ['precious_metals'], imports: critical } }))).toEqual([]);
  });
  test('a strength with nothing under it; a strength the table does not know', () => {
    expect(details(record({ resourceAnalysis: { economicStrengths: ['Mining'] } }))).toContain("A terrain strength has nothing of the town's under it.");
    expect(details(record({ resourceAnalysis: { economicStrengths: ['Mining'], availableResources: ['stone_quarry'] } }))).toEqual([]);
    expect(details(record({ resourceAnalysis: { economicStrengths: ['River trade'] }, config: { tradeRouteAccess: 'river' } }))).toEqual([]);
    expect(details(record({ resourceAnalysis: { economicStrengths: ['Basket weaving'] } }))).toContain('A terrain strength has no support row.');
  });
  test('a strategic yield clause the town does not stand on', () => {
    const forest = (line, available) => record({ config: { terrainType: 'forest' }, resourceAnalysis: { strategicValue: line, availableResources: available } });
    expect(details(forest('Low-Medium - provides timber and game, difficult to besiege', ['hunting_grounds']))).toContain('The strategic line names a yield the town does not have.');
    expect(details(forest('Low-Medium - provides game, difficult to besiege', ['hunting_grounds']))).toEqual([]);
    expect(details(forest('Low-Medium - difficult to besiege', []))).toEqual([]);
  });
  test('a hook that asserts a war the record does not hold, or a scarcity the town does not have', () => {
    expect(details(record({ hooks: [{ hook: 'War has taken the iron.' }] }))).toContain('A hook asserts a war the record does not hold.');
    expect(details(record({ hooks: [{ hook: 'The iron merchants have doubled their price.' }], resourceAnalysis: { availableResources: ['iron_deposits'] } })))
      .toContain('A hook makes a material scarce that a live local resource yields.');
    expect(details(record({ hooks: [{ hook: 'The iron merchants have doubled their price.' }] }))).toEqual([]);
  });
  test('the safety text naming a mercenary company the defence home does not list', () => {
    const safety = { guardEffectivenessDesc: 'A mercenary company provides enforcement.' };
    expect(details(record({ economicState: { safetyProfile: safety } }))).toContain('The safety text names a mercenary company the defence record does not list.');
    expect(details(record({ economicState: { safetyProfile: safety }, institutions: [{ name: 'Mercenary company' }] }))).toEqual([]);
  });
  test('the import list against the food record', () => {
    const grown = (pct, imports) => record({ economicState: { primaryImports: imports, foodSecurity: { foodRecord: { grownPct: pct } } } });
    expect(details(grown(95, ['Grain']))).toContain('Grain stands as a primary import, unqualified, where the town grows most of its need.');
    expect(details(grown(80, ['Grain']))).toEqual([]);
    expect(details(grown(95, ['Grain (a little, beside its own harvest)']))).toEqual([]);
    const spent = record({ config: { nearbyResources: ['grain_fields'], nearbyResourcesNativeDepleted: [] }, economicState: { primaryImports: ['Bulk grain (local fields depleted)'] } });
    expect(details(spent)).toContain('A shortage import stands beside the resource it says is spent.');
  });
  test('available worked land the food record does not count as a source', () => {
    const land = (sources) => record({ config: { nearbyResources: ['grazing_land'], nearbyResourcesNativeDepleted: [] },
      economicState: { foodSecurity: { foodRecord: { grownPct: 50, foodSources: sources } } } });
    expect(details(land([]))).toContain('Available worked land is not among the food sources.');
    expect(details(land(['livestock']))).toEqual([]);
  });
});

/** The seeds that disagreed at the base, by finding (the lane's corpus measure). */
const SEEDS = ['agree-town-2', 'agree-town-5', 'agree-village-0', 'agree-village-1', 'agree-village-2', 'agree-village-5', 'agree-village-7', 'agree-village-14',
  'agree-village-28', 'agree-town-0', 'agree-town-3', 'agree-town-7', 'agree-town-8', 'agree-town-14', 'agree-town-43', 'agree-town-73'];
const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true,
  selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };

describe('the corpus seeds that disagreed at the base agree', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });
  test.each(SEEDS)('%s: resource_truth and food_verdict hold no finding', (seed) => {
    const tier = seed.split('-')[1];
    const settlement = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: tier }), null, { seed });
    const findings = settlement.generationCoherenceReceipt.checks
      .filter((c) => c.id === 'resource_truth' || c.id === 'food_verdict')
      .flatMap((c) => c.findings.map((f) => `${f.path}: ${f.detail} ${f.evidence || ''}`));
    expect(findings).toEqual([]);
  });
});
