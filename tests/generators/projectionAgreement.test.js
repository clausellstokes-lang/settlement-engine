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
import { resourceShortageImport } from '../../src/domain/resourceSemantics.js'; // re-keyed by identity: the label names its own land now
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
    // F4 (REVIEW-AGREE): both directions — a peacetime iron event where the record holds a war
    const peace = 'A new toll on the iron road has made metal dear. Nobody will say who set it, and the tools still need mending.';
    const atWar = (hook) => ({ ...record({ hooks: [{ hook }] }), stress: [{ type: 'wartime' }] });
    expect(details(atWar(peace))).toContain('A hook presumes the peace where the record holds a war.');
    expect(details(record({ hooks: [{ hook: peace }] }))).toEqual([]);
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
    // F6 (REVIEW-AGREE): the foodways line against the market home
    const foodways = (line, institutions) => record({ economicState: { foodSecurity: { foodRecord: { grownPct: 50, foodwaysLine: line } } }, institutions });
    expect(paths(foodways('(planted) Markets structure urban food supply.', []))).toContain('economicState.foodSecurity.foodRecord.foodwaysLine');
    expect(details(foodways('(planted) Markets structure urban food supply.', [{ name: 'Weekly market' }]))).toEqual([]);
  });
  test('F11: the trade line against the prosperity label beside it', () => {
    const said = (line, prosperity) => details(record({ economicState: { situationDesc: line, prosperity } }));
    const slow = 'Commerce is sluggish; little is bought or sold and many crafts are in decline.';
    expect(said(slow, 'Prosperous')).toContain('The trade line says the opposite of the prosperity label beside it.');
    expect(said(slow, 'Poor')).toEqual([]);
    expect(said("Trade is brisk, the guilds are well run, and the settlement's coffers fill steadily.", 'Struggling')).toContain('The trade line says the opposite of the prosperity label beside it.');
    expect(said('Trade proceeds at an ordinary pace for a settlement of this size.', 'Wealthy')).toEqual([]);
  });
  test('F5, F12: the safety text\'s gates and watch against the defence home', () => {
    const says = (line, institutions) => details(record({ economicState: { safetyProfile: { safetyDesc: line } }, institutions }));
    expect(says('(planted) Everyone comes in by the gates.', [{ name: 'Palisade' }])).toContain('The safety text names gates the defence record does not hold.');
    expect(says('(planted) Everyone comes in by the gates.', [{ name: 'Town walls' }, { name: 'Gatehouse' }])).toEqual([]);
    expect(says('(planted) No gates to bribe and no walls to watch.', [{ name: 'Palisade' }])).toEqual([]);
    // F12: the watch, named where none stands
    expect(says('(planted) The charter hall handles threats the watch cannot.', [{ name: 'Citizen militia' }])).toContain('The safety text names a watch the defence record does not hold.');
    expect(says('(planted) The charter hall handles threats the watch cannot.', [{ name: 'Town watch' }])).toEqual([]);
  });
  test('Part B (iii): a rolled resource off the access it requires; a hand-chosen roster is exempt', () => {
    const at = (route, random) => details(record({ config: { tradeRouteAccess: route, nearbyResourcesRandom: random }, resourceAnalysis: { availableResources: ['crossroads_position'] } }));
    expect(at('road', true)).toContain('A rolled resource stands off the access it requires.');
    expect(at('crossroads', true)).toEqual([]);
    expect(at('road', false)).toEqual([]);
  });
  test('F1 (COHERENCE-AGREE-6): an active chain printing a resource whose row refuses the access', () => {
    const toll = { label: 'Strategic Crossroads Toll', resource: 'Strategic Crossroads', resourceKey: 'crossroads_position', needKey: 'trade_entrepot', chainId: 'crossroads_trade' };
    const runs = (route, chain) => details(record({ config: { tradeRouteAccess: route }, economicState: { activeChains: [chain] } }));
    // the printed source reads the access through the leaf: the toll prints its river and port names, so clean
    expect(runs('river', toll)).toEqual([]);
    expect(runs('port', toll)).toEqual([]);
    expect(runs('crossroads', toll)).toEqual([]);
    // a chain whose printed source has no entry for the access is convicted (a mis-keyed toll prints the crossroads)
    expect(runs('river', { ...toll, chainId: 'not_the_toll' })).toContain("A chain prints a resource whose row refuses the town's access.");
  });
  test('the import list against the food record', () => {
    const grown = (pct, imports) => record({ economicState: { primaryImports: imports, foodSecurity: { foodRecord: { grownPct: pct } } } });
    expect(details(grown(95, ['Grain']))).toContain('Grain stands as a primary import, unqualified, where the town grows most of its need.');
    expect(details(grown(80, ['Grain']))).toEqual([]);
    expect(details(grown(95, ['Grain (a little, beside its own harvest)']))).toEqual([]);
    // F8 (REVIEW-AGREE): the bracketed shortage says how little too (the compound good is the demand pass's: reported)
    expect(details(grown(101, ['Bulk grain (local fields depleted)']))).toContain('Grain stands as a primary import, unqualified, where the town grows most of its need.');
    expect(details(grown(100, ['Grain and produce (local floodplain unproductive)']))).toContain('Grain stands as a primary import, unqualified, where the town grows most of its need.');
    // STOP 1 (the chair, 2026-11-12): the demand pass's compound good says how little too
    expect(details(grown(100, ['Grain and salted pork']))).toContain('Grain stands as a primary import, unqualified, where the town grows most of its need.');
    expect(details(grown(100, ['Salted pork and a little grain']))).toEqual([]);
    expect(details(grown(80, ['Grain and salted pork']))).toEqual([]);
    const spent = record({ config: { nearbyResources: ['grain_fields'], nearbyResourcesNativeDepleted: [] }, economicState: { primaryImports: [resourceShortageImport('grain_fields')] } });
    expect(details(spent)).toContain('A shortage import stands beside the resource it says is spent.');
    // F12b (REVIEW-AGREE): the bracket's land against every live resource of that land
    const pasture = (label) => record({ resourceAnalysis: { availableResources: ['alpine_pasture'] }, economicState: { primaryImports: [label] } });
    expect(details(pasture('Livestock and dairy (local pastures depleted)'))).toContain('A shortage import says land is spent that a live resource is.');
    expect(details(pasture('Livestock and dairy (local grazing land depleted)'))).toEqual([]);
    // the chair's widening (2026-11-12): the words, not the key — forests beside mountain timber, fields beside a floodplain
    const beside = (label, live) => record({ resourceAnalysis: { availableResources: live }, economicState: { primaryImports: [label] } });
    expect(details(beside('Timber (local forests cleared)', ['mountain_timber']))).toContain('A shortage import says land is spent that a live resource is.');
    expect(details(beside('Bulk grain (local fields depleted)', ['fertile_floodplain']))).toContain('A shortage import says land is spent that a live resource is.');
    expect(details(beside('Timber (local managed woodland cleared)', ['mountain_timber']))).toEqual([]);
    expect(details(beside('Timber (local mountain timber cleared)', ['managed_forest']))).toEqual([]);
    expect(details(beside('Iron ore (local mines exhausted)', ['coal_deposits']))).toContain('A shortage import says land is spent that a live resource is.');
    expect(details(beside('Iron ore (local iron mines exhausted)', ['coal_deposits']))).toEqual([]);
    // F7 (REVIEW-AGREE): an income line selling a surplus the food record does not hold
    const sells = (foodRecord) => record({ economicState: { primaryImports: [], foodSecurity: { foodRecord },
      incomeSources: [{ source: 'Grain Sales', desc: 'Surplus from local harvest (planted) sold on.' }] } });
    expect(details(sells({ grownPct: 29, band: 'famine', growsMoreThanEats: false }))).toContain('An income line sells a surplus the food record does not hold.');
    expect(details(sells({ grownPct: 120, band: 'surplus', growsMoreThanEats: true }))).toEqual([]);
  });
  test('an income line naming a local resource the town lacks; a must-import note beside a live material', () => {
    const income = (available) => record({ resourceAnalysis: { availableResources: available },
      economicState: { incomeSources: [{ source: 'Iron & Metalwork', desc: 'Local ore (planted) for the smithy.' }] } });
    expect(details(income(['coal_deposits', 'coal']))).toContain('An income line names a local resource the town does not have.');
    expect(details(income(['iron_deposits']))).toEqual([]);
    // F3 (REVIEW-AGREE, 2026-11-12): gold and silver are not the smith's ore — the material table's answer
    expect(details(income(['precious_metals']))).toContain('An income line names a local resource the town does not have.');
    const note = (category) => ({ ...record({ resourceAnalysis: { availableResources: ['managed_forest'] } }),
      economicViability: { plotHooks: [], dependencies: [{ category, title: 'Imports timber' }] } });
    expect(details(note('Resource Import'))).toContain('The viability notes an import a live local resource yields.');
    expect(details(note('Provisioning at Scale'))).toEqual([]);
  });
  test('F2 (COHERENCE-AGREE-6): a good only refused chains make, on the export list or produced locally', () => {
    const chains = [{ status: 'impaired', outputs: ['Quality tools and weapons', 'Charcoal'] }, { status: 'running', resourceInputCondition: 'available', outputs: ['Charcoal'] }];
    const lists = (primaryExports, localProduction) => details(record({ economicState: { activeChains: chains, primaryExports, localProduction } }));
    expect(lists(['Quality tools and weapons'], [])).toContain('A trade list carries a good only a refused chain makes.');
    expect(lists(['Quality tools and weapons (naval route only)'], [])).toContain('A trade list carries a good only a refused chain makes.');
    expect(lists([], ['quality tools and weapons'])).toContain('A trade list carries a good only a refused chain makes.');
    // twins: a good a yielding chain also makes, and a good no chain makes
    expect(lists(['Charcoal (transit)'], ['Salt'])).toEqual([]);
  });
  test('F2\'s fifth writer (COHERENCE-AGREE-8): the member reads every writer\'s good, a service\'s export label too', () => {
    // the member reads the FINAL lists, so it judges every writer's good; a writer's own parenthetical (the service
    // map's "(letters of credit)") is read off as the list's suffixes are
    const bank = [{ status: 'impaired', outputs: ['Financial services', 'International banking services'] }];
    const lists = (primaryExports) => details(record({ economicState: { activeChains: bank, primaryExports, localProduction: [] } }));
    expect(lists(['Financial services (letters of credit)'])).toContain('A trade list carries a good only a refused chain makes.');
    // twin: a service no refused chain makes
    expect(lists(['Legal services (contracts, notarial)'])).toEqual([]);
    // a service whose label is not its good: the member reads the good the service map names
    const school = [{ status: 'impaired', resourceInputCondition: 'depleted', outputs: ['Higher education'] }];
    const taught = details(record({ economicState: { activeChains: school, primaryExports: ['Educational services (degrees, training)'], localProduction: [] } }));
    expect(taught).toContain('A trade list carries a good only a refused chain makes.');
  });
  test('Part B (i): "no established food chains" beside a roster that works its own land', () => {
    const said = (institutions) => details({ ...record({ institutions, economicState: { foodSecurity: { diversityNote: 'no established food chains', foodRecord: { grownPct: 90 } } } }), tier: 'village' });
    expect(said([{ name: 'Farmland' }, { name: 'Common grazing land' }])).toContain('The food record says no food chains beside a roster that works its own land.');
    expect(said([{ name: 'Parish church' }])).toEqual([]);
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

/**
 * THE REVIEWER'S SEEDS (REVIEW-AGREE-65ce74ce6, 2026-11-12), by finding: towns the lane never birthed (the
 * §0 dials, every one on random; `stress` forces a crisis as the review's `rvwfam-*` and `rvw-ten-*` did).
 * Each disagreed at 65ce74ce6; each holds resource_truth and food_verdict clean after its cure.
 */
const REVIEW_SEEDS = [
  // F3: "Local ore feeds the smithy" beside gold or silver alone, and an iron import
  { seed: 'rvw12-town-13', tier: 'town' }, { seed: 'rvw12-town-37', tier: 'town' }, { seed: 'rvw-ten-6', tier: 'city' },
  // F7: "Grain Sales: Surplus from local harvest" in famine and deficit towns
  { seed: 'rvw12b-town-275', tier: 'town' }, { seed: 'rvw12b-town-103', tier: 'town' }, { seed: 'rvw12b-town-427', tier: 'town' },
  // F8: a town growing all its grain "imports bulk grain (local fields depleted)" or its floodplain's produce
  { seed: 'rvw12-town-34', tier: 'town' }, { seed: 'rvw12-town-59', tier: 'town' }, { seed: 'rvw12-town-3', tier: 'town' }, { seed: 'rvw-ten-4', tier: 'town' },
  // F12b: "Livestock and dairy (local pastures depleted)" beside a live alpine pasture
  { seed: 'rvw12-city-1', tier: 'city' }, { seed: 'rvw12b-city-33', tier: 'city' }, { seed: 'rvw12b-city-136', tier: 'city' },
  // F6: the foodways line names a market the market home denies
  { seed: 'rvw12-village-0', tier: 'village' }, { seed: 'rvw12-village-14', tier: 'village' },
  // F5: "Everyone comes and goes by the gates" in a palisade village with no gate
  { seed: 'rvw12-village-3', tier: 'village' }, { seed: 'rvw12-village-19', tier: 'village' }, { seed: 'rvw12-village-22', tier: 'village' },
  { seed: 'rvw12-village-34', tier: 'village' }, { seed: 'rvw12-village-45', tier: 'village' }, { seed: 'rvw12-village-50', tier: 'village' },
  { seed: 'rvw12-village-53', tier: 'village' }, { seed: 'rvw-ten-2', tier: 'village' },
  // F12: "…handles threats the watch cannot" with no watch (rvw12-village-50 and rvw-ten-2, above)
  { seed: 'rvw12-village-6', tier: 'village' }, { seed: 'rvw12b-village-28', tier: 'village' }, { seed: 'rvw12b-village-174', tier: 'village' },
  { seed: 'rvw12b-village-229', tier: 'village' },
  // F4: a town at war or at the front draws a peacetime iron event; the war line never printed
  // (rvw12-village-7 and -8: the review's "site reads peace" seeds, at war and at the front; they draw no iron hook)
  { seed: 'rvw12-village-7', tier: 'village' }, { seed: 'rvw12-village-8', tier: 'village' }, { seed: 'rvw-ten-7', tier: 'city', stress: 'under_siege' },
  { seed: 'rvw12-town-81', tier: 'town' }, { seed: 'rvw12-city-60', tier: 'city' }, { seed: 'rvw12-city-67', tier: 'city' }, { seed: 'rvw12-metropolis-23', tier: 'metropolis' },
  // STOP 1 (F8's compound half): "Grain and salted pork" and its kin in towns growing 90% or more
  { seed: 'rvw12-town-19', tier: 'town' }, { seed: 'rvw12-town-121', tier: 'town' }, { seed: 'rvw12b-town-186', tier: 'town' },
  // Part B (i): Farmland, Common grazing land and a Dairy farmer beside "no established food chains"
  { seed: 'rvw-ten-3', tier: 'village', stress: 'wartime' }, { seed: 'agree-thorp-2', tier: 'thorp' }, { seed: 'agree-hamlet-0', tier: 'hamlet' },
  // the forest label (the chair's ruling, 2026-11-12): "Timber (local forests cleared)" beside live timber
  // (rvw-ten-4, in the arm for F8, also holds the iron label beside coal: the mines word is read now)
  { seed: 'rvw12-city-71', tier: 'city' }, { seed: 'rvw12b-town-171', tier: 'town' }, { seed: 'rvw12b-town-251', tier: 'town' }, { seed: 'rvw12b-city-156', tier: 'city' },
  // Part B (iii): the review's road village with "Central trade hub", toll and transit exports
  { seed: 'rvw12-village-19', tier: 'village' }, { seed: 'agree-town-1', tier: 'town' },
  // F11: "Commerce is sluggish" beside "Comfortable" or "Prosperous" (rvw-ten-6, above, beside "Prosperous")
  { seed: 'rvw12-town-8', tier: 'town' }, { seed: 'rvw12-town-20', tier: 'town' }, { seed: 'rvw12-town-32', tier: 'town' },
  // F2 (REVIEW-AGREE-2, COHERENCE-AGREE-6): a good only refused chains make, sold or produced locally
  { seed: 'r2read-city-4', tier: 'city' }, { seed: 'r2r-city-42', tier: 'city' }, { seed: 'r2r-city-6', tier: 'city' }, { seed: 'agree-village-32', tier: 'village' },
  // F1 (REVIEW-AGREE-2, COHERENCE-AGREE-6): the crossroads toll on a river and on a port
  { seed: 'r2read-village-1', tier: 'village' }, { seed: 'r2r-city-14', tier: 'city' }, { seed: 'r2read-metropolis-2', tier: 'metropolis' }, { seed: 'r2r-village-2', tier: 'village' },
  // F3 (REVIEW-AGREE-2, COHERENCE-AGREE-6): births the review's planted faults reach. G2 (the safety writer's company
  // read off the garrison) is convicted on these three; G5 (the foodways market filter removed) on the next three.
  { seed: 'agree-town-146', tier: 'town' }, { seed: 'agree-city-60', tier: 'city' }, { seed: 'rvw12b-metropolis-52', tier: 'metropolis' },
  { seed: 'agree-thorp-56', tier: 'thorp' }, { seed: 'r2r-hamlet-5', tier: 'hamlet' }, { seed: 'rvw12-village-25', tier: 'village' },
  // F3 (ii): the surplus member's subject ("Surplus from local harvest" printed), live in no birth above
  { seed: 'agree-town-56', tier: 'town' }, { seed: 'r2r-town-2', tier: 'town' },
];
describe('the reviewer\'s seeds agree', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });
  test('every reviewer seed: resource_truth and food_verdict hold no finding', () => expectNoSeedFailures(collectSeedFailures(REVIEW_SEEDS.map((r) => r.seed), (seed) => {
    const { tier, stress } = REVIEW_SEEDS.find((r) => r.seed === seed) || {};
    const forced = stress ? { selectedStressesRandom: false, selectedStresses: [stress] } : {};
    const settlement = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: tier, ...forced }), null, { seed });
    const findings = settlement.generationCoherenceReceipt.checks
      .filter((c) => c.id === 'resource_truth' || c.id === 'food_verdict')
      .flatMap((c) => c.findings.map((f) => `${f.path}: ${f.detail} ${f.evidence || ''}`));
    expect(findings, seed).toEqual([]);
  }), 'the reviewer\'s seeds agree'));
});

/**
 * F3 (COHERENCE-AGREE-6, REVIEW-AGREE-2, the chair's ruling of 2026-11-12): EVERY MEMBER IS REACHED BY ITS FIXED-SEED
 * ARM. Two of the guard's members caught their planted fault in the receipt and reddened nothing, because no arm-2
 * birth gave them a subject. For EVERY member, the arm-2 births in which its subject is live (the thing it reads is
 * printed or held, so the two answers it compares are both there to disagree) number at least one, so a member can
 * never again be empty in silence. The subjects are restated here from the record's raw fields, never by calling the
 * member.
 */
describe('F3: every member of the guard has a live subject in arm 2', () => {
  const safety = (s) => { const p = s.economicState?.safetyProfile || {}; return [p.guardEffectivenessDesc, p.safetyDesc, ...(p.crimeTypes || []).map((c) => c?.desc)].map((x) => String(x || '')); };
  const LIVE = {
    'a terrain must-import': (s) => (s.resourceAnalysis?.imports?.critical || []).some((l) => /cannot produce this locally/.test(String(s.resourceAnalysis?.imports?.reasons?.[l] || ''))),
    'a terrain strength': (s) => (s.resourceAnalysis?.economicStrengths || []).length > 0,
    'a strategic yield clause': (s) => /\bprovides\b|heartland/i.test(String(s.resourceAnalysis?.strategicValue || '')),
    'a rolled resource with an access law': (s) => s.config?.nearbyResourcesRandom !== false && (s.resourceAnalysis?.availableResources || []).includes('crossroads_position'),
    'an active chain on a resource with an access law': (s) => (s.economicState?.activeChains || []).some((c) => c.resourceKey === 'crossroads_position'),
    'a hook naming war': (s) => (s.economicViability?.plotHooks || []).some((h) => /\b(?:war|armies|siege)\b/i.test(String(h?.hook || ''))),
    'a peacetime iron hook': (s) => (s.economicViability?.plotHooks || []).some((h) => /iron road|metal dear|iron merchants/i.test(String(h?.hook || ''))),
    'a hook naming a material': (s) => (s.economicViability?.plotHooks || []).some((h) => /\b(?:iron|metal|timber)\b/i.test(String(h?.hook || ''))),
    'an income line naming a local resource': (s) => (s.economicState?.incomeSources || []).some((e) => /^Local (?:ore|forest|quarry|flocks)\b/.test(String(e?.desc || ''))),
    'a refused chain beside a trade list': (s) => (s.economicState?.activeChains || []).some((c) => c?.status === 'impaired' || c?.resourceInputCondition === 'depleted') && (s.economicState?.primaryExports || []).length > 0,
    'an "Imports …" viability note': (s) => ['dependencies', 'warnings'].some((f) => (s.economicViability?.[f] || []).some((e) => e?.category === 'Resource Import' && /^Imports /.test(String(e?.title || '')))),
    'the safety text naming a mercenary company': (s) => safety(s).slice(0, 2).some((t) => /\bmercenary compan/i.test(t)),
    'the safety text naming gates': (s) => safety(s).some((t) => /\bgates?\b/i.test(t)),
    'the safety text naming the watch': (s) => safety(s).some((t) => /\bthe watch\b/i.test(t)),
    'the safety text naming a court': (s) => safety(s).some((t) => /\bcourts?\b/i.test(t)),
    'the economic situation naming a market': (s) => /\bmarkets?\b/i.test(String(s.economicState?.situationDesc || '')),
    'the trade line beside the prosperity label': (s) => /sluggish|brisk|ordinary pace/i.test(String(s.economicState?.situationDesc || '')),
    'the foodways line naming a market': (s) => /\bmarkets?\b/i.test(String(s.economicState?.foodSecurity?.foodRecord?.foodwaysLine || '')),
    'a grain import where the town grows nine tenths': (s) => (s.economicState?.primaryImports || []).some((l) => /grain/i.test(l)) && Number(s.economicState?.foodSecurity?.foodRecord?.grownPct) >= 90,
    'an income line selling a surplus': (s) => (s.economicState?.incomeSources || []).some((e) => /^Surplus from local harvest\b/.test(String(e?.desc || ''))),
    'a shortage import naming spent land': (s) => (s.economicState?.primaryImports || []).some((l) => /\((?:local|coastal|mountain) /i.test(l)),
    'the zero-source food note': (s) => /no established food chains|own plots/.test(String(s.economicState?.foodSecurity?.diversityNote || '')),
    'available worked land': (s) => (s.config?.nearbyResources || []).some((k) => ['grain_fields', 'fertile_floodplain', 'grazing_land'].includes(k)),
  };
  beforeAll(async () => { await loadGenerationLawPayloads(); });
  test('each member\'s subject is live in at least one arm-2 birth', () => {
    const arm2 = [...SEEDS.map((seed) => ({ seed, tier: seed.split('-')[1] })), ...REVIEW_SEEDS];
    const births = arm2.map(({ seed, tier, stress }) => generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: tier,
      ...(stress ? { selectedStressesRandom: false, selectedStresses: [stress] } : {}) }), null, { seed }));
    const reach = Object.fromEntries(Object.entries(LIVE).map(([member, live]) => [member, births.filter(live).length]));
    expect(Object.keys(reach).length).toBe(23);
    expect(Object.entries(reach).filter(([, n]) => n < 1).map(([member]) => member), JSON.stringify(reach)).toEqual([]);
  }, 120000);
});
