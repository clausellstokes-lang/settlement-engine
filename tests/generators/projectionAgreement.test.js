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
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';

import { projectionAgreementFindings } from '../../src/generators/generationCoherence.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { generateSafetyProfile } from '../../src/generators/safetyProfile.js';

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
    expect(details(forest('Low-Medium - provides timber and game, difficult to besiege', ['hunting_grounds']))).toContain('The strategic line names a yield the town lacks.');
    expect(details(forest('Low-Medium - provides game, difficult to besiege', ['hunting_grounds']))).toEqual([]);
    expect(details(forest('Low-Medium - difficult to besiege', []))).toEqual([]);
  });
  test('a hook that asserts a war the record does not hold, or makes scarce what the town has', () => {
    expect(details(record({ hooks: [{ hook: '(planted) the armies took it all, iron first.' }] }))).toContain('A hook asserts a war the record does not hold.');
    expect(details(record({ hooks: [{ hook: 'The iron merchants have doubled their price.' }], resourceAnalysis: { availableResources: ['iron_deposits'] } })))
      .toContain('A hook makes a material scarce that a live local resource yields.');
    expect(details(record({ hooks: [{ hook: 'The iron merchants have doubled their price.' }] }))).toEqual([]);
  });
  test('the safety text naming a mercenary company the defence home does not list', () => {
    const safety = { guardEffectivenessDesc: '(planted) a mercenary company keeps the peace here.' };
    expect(details(record({ economicState: { safetyProfile: safety } }))).toContain('The safety text names a mercenary company the defence record does not list.');
    expect(details(record({ economicState: { safetyProfile: safety }, institutions: [{ name: 'Mercenary company' }] }))).toEqual([]);
  });
  test('the safety text saying a court sits where the defence home has none, or none where it has one', () => {
    const says = (line, institutions) => record({ economicState: { safetyProfile: { guardEffectivenessDesc: line } }, institutions });
    expect(details(says('(planted) A court exists, though the prison system is limited.', []))).toContain('The safety text says a court sits where the defence record has none.');
    // the measure (2026-11-12): a town hall is a court — its own service row brings disputes before a magistrate
    expect(details(says('(planted) A court exists, though the prison system is limited.', [{ name: 'Town hall' }]))).toEqual([]);
    expect(details(says('(planted) A court exists, though the prison system is limited.', [{ name: 'Town hall', status: 'ruined' }])))
      .toContain('The safety text says a court sits where the defence record has none.');
    const crime = record({ economicState: { safetyProfile: { crimeTypes: [{ desc: '(planted) Without a court, there is no formal mechanism.' }] } }, institutions: [{ name: 'Courthouse' }] });
    expect(details(crime)).toContain('The safety text says no court sits where the defence record has one.');
    expect(details(says('(planted) Without courts or prison, enforcement relies on fines.', []))).toEqual([]);
  });
  test('RED-FIRST: a ruined courthouse does not try the cases (the safety writer reads the court home)', () => {
    const live = [{ name: 'Town watch', category: 'Defense' }, { name: 'Courthouse', category: 'Government' }];
    const ruined = [{ name: 'Town watch', category: 'Defense' }, { name: 'Courthouse', category: 'Government', status: 'ruined' }];
    const said = (institutions) => details(record({ economicState: { safetyProfile: generateSafetyProfile({}, 'town', institutions) }, institutions }));
    // anchored: the live courthouse prints a court sentence the arm accepts; only the ruin differs
    expect(JSON.stringify(generateSafetyProfile({}, 'town', live))).toMatch(/court/);
    expect(said(live)).toEqual([]);
    expect(said(ruined)).toEqual([]);
  });
  test('RED-FIRST: a court with no prison is not "no court" in the crime lines (48 corpus towns at the base)', () => {
    const courtOnly = [{ name: 'Town hall', category: 'Government' }, { name: "Thieves' guild", category: 'Criminal' }];
    const heard = [];
    for (const priorityEconomy of [20, 50, 80]) for (const priorityCriminal of [50, 70, 95]) for (const priorityMilitary of [5, 40]) {
      const config = { priorityEconomy, priorityCriminal, priorityMilitary, priorityMagic: 20 };
      const profile = generateSafetyProfile(config, 'town', courtOnly);
      heard.push(...profile.crimeTypes.map((c) => c.type));
      expect(details(record({ economicState: { safetyProfile: profile }, institutions: courtOnly })), JSON.stringify(config)).toEqual([]);
    }
    expect(heard.length).toBeGreaterThan(0); // anchored: the grid reaches the crime lines
  });
  test('RED-FIRST: the court-without-prison line names no prison (PRESUME\'s register, banked as this lane\'s: 53 towns)', () => {
    const profile = generateSafetyProfile({}, 'town', [{ name: 'Town watch', category: 'Defense' }, { name: 'Town hall', category: 'Government' }]);
    expect(profile.guardEffectivenessDesc).toMatch(/court/); // anchored: the branch prints its court line
    expect(profile.guardEffectivenessDesc).not.toMatch(/prison/i);
  });
  test('the market member: the situation\'s market line against the market home', () => {
    const situation = (line, institutions) => record({ economicState: { situationDesc: line }, institutions });
    const paths = (r) => projectionAgreementFindings(r).resource.map((x) => x.path);
    expect(paths(situation('(planted) markets meet infrequently.', []))).toContain('economicState.situationDesc');
    expect(details(situation('(planted) markets meet infrequently.', [{ name: 'Weekly market' }]))).toEqual([]);
    expect(details(situation('(planted) a busy black market undercuts it.', []))).toEqual([]);
  });
  test('the import list against the food record', () => {
    const grown = (pct, imports) => record({ economicState: { primaryImports: imports, foodSecurity: { foodRecord: { grownPct: pct } } } });
    expect(details(grown(95, ['Grain']))).toContain('Grain stands as a primary import, unqualified, where the town grows most of its need.');
    expect(details(grown(80, ['Grain']))).toEqual([]);
    expect(details(grown(95, ['Grain (a little, beside its own harvest)']))).toEqual([]);
    const spent = record({ config: { nearbyResources: ['grain_fields'], nearbyResourcesNativeDepleted: [] }, economicState: { primaryImports: ['Bulk grain (local fields depleted)'] } });
    expect(details(spent)).toContain('A shortage import stands beside the resource it says is spent.');
  });
  test('an income line naming a local resource the town lacks; a must-import note beside a live material', () => {
    const income = (available) => record({ resourceAnalysis: { availableResources: available },
      economicState: { incomeSources: [{ source: 'Iron & Metalwork', desc: 'Local ore (planted) for the smithy.' }] } });
    expect(details(income(['coal_deposits', 'coal']))).toContain('An income line names a local resource the town does not have.');
    expect(details(income(['iron_deposits']))).toEqual([]);
    const note = (category) => ({ ...record({ resourceAnalysis: { availableResources: ['managed_forest'] } }),
      economicViability: { plotHooks: [], dependencies: [{ category, title: 'Imports timber' }] } });
    expect(details(note('Resource Import'))).toContain('The viability notes an import a live local resource yields.');
    expect(details(note('Provisioning at Scale'))).toEqual([]);
  });
  test('available worked land the food record does not count as a source', () => {
    const land = (sources) => record({ config: { nearbyResources: ['grazing_land'], nearbyResourcesNativeDepleted: [] },
      economicState: { foodSecurity: { foodRecord: { grownPct: 50, foodSources: sources } } } });
    expect(details(land([]))).toContain('Available worked land is not among the food sources.');
    expect(details(land(['livestock']))).toEqual([]);
  });
});

/** The seeds that disagreed at the base, by finding (the lane's corpus measure). */
const SEEDS = ['agree-village-17', 'agree-village-25', 'agree-town-2', 'agree-town-5', 'agree-village-0', 'agree-village-1', 'agree-village-2', 'agree-village-5', 'agree-village-7', 'agree-village-14',
  'agree-village-28', 'agree-town-0', 'agree-town-3', 'agree-town-7', 'agree-town-8', 'agree-town-14', 'agree-town-43', 'agree-town-73',
  // the market member (2026-11-12): the economic situation names a market the town does not have
  'agree-village-8', 'agree-village-11', 'agree-village-20', 'agree-village-21', 'agree-village-34', 'agree-village-39', 'agree-village-42', 'agree-village-56'];
const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true,
  selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };

describe('the corpus seeds that disagreed at the base agree', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });
  test('every seed: resource_truth and food_verdict hold no finding', () => expectNoSeedFailures(collectSeedFailures(SEEDS, (seed) => {
    const tier = seed.split('-')[1];
    const settlement = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: tier }), null, { seed });
    const findings = settlement.generationCoherenceReceipt.checks
      .filter((c) => c.id === 'resource_truth' || c.id === 'food_verdict')
      .flatMap((c) => c.findings.map((f) => `${f.path}: ${f.detail} ${f.evidence || ''}`));
    expect(findings, seed).toEqual([]);
  }), 'the corpus seeds agree'));
});
