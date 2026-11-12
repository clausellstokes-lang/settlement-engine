/**
 * coherenceAgreeCures.test.js — COHERENCE-AGREE's cures, one pin each (the chair's charter of
 * 2026-11-11, §2): the town's own drawn facts override a terrain table, and a fact has one reader.
 * Each describe block was red at the lane's base (99bcc6944) and turns green with its own commit.
 */
import { beforeAll, describe, expect, test } from 'vitest';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';

import { generateResourceAnalysis } from '../../src/generators/resourceGenerator.js';
import { generateSafetyProfile } from '../../src/generators/safetyProfile.js';
import { foodLandOf } from '../../src/generators/foodLand.js';
import { getInstFlags } from '../../src/generators/helpers.js';
import { institutionsPoolKey } from '../../src/domain/display/stateProse/generalStateProse.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';

describe('cure 1: the critical imports never deny a live local resource', () => {
  test('"metals" is not a critical import beside live iron; it is with no metal at all', () => {
    expect(generateResourceAnalysis('plains', ['iron_deposits', 'iron', 'metalwork'], [], []).imports.critical).not.toContain('metals'); // anchored: the next line holds metals present for a town with no metal
    expect(generateResourceAnalysis('plains', ['gems'], [], []).imports.critical).toContain('metals');
  });
  test('"Charcoal and fuel" is not a critical import beside peat or coal', () => {
    expect(generateResourceAnalysis('mountain', ['marshlands', 'peat'], [], []).imports.critical).not.toContain('Charcoal and fuel'); // anchored: the third line below holds the import present with no fuel
    expect(generateResourceAnalysis('mountain', ['coal_deposits', 'coal'], [], []).imports.critical).not.toContain('Charcoal and fuel'); // anchored: the next line holds the import present with no fuel
    expect(generateResourceAnalysis('mountain', [], [], []).imports.critical).toContain('Charcoal and fuel');
  });
});

describe('cure 2: the strengths and the strategic line are the town\'s', () => {
  test('a plains town with no fields, herds or crossroads claims no plains strength and is no heartland', () => {
    const bare = generateResourceAnalysis('plains', ['honey'], [], [], { tradeRouteAccess: 'road' });
    expect(bare.economicStrengths).toEqual([]);
    expect(bare.strategicValue).toBe('Medium - open country, but exposed to raids');
  });
  test('a strength the town stands on stays, and the route can carry one', () => {
    const fields = generateResourceAnalysis('plains', ['grain_fields', 'grain', 'flour'], [], [], { tradeRouteAccess: 'crossroads' });
    expect(fields.economicStrengths).toEqual(['Grain production', 'Central trade hub']);
    expect(fields.strategicValue).toBe('Medium - agricultural heartland, but exposed to raids');
  });
  test('a forest town with game and no timber provides game', () => {
    expect(generateResourceAnalysis('forest', ['hunting_grounds', 'game meat'], [], []).strategicValue).toBe('Low-Medium - provides game, difficult to besiege');
  });
});

describe('cure 3: the safety writer reads the mercenary fact from the defence home', () => {
  test('a hireling hall beside the town watch is not "a mercenary company provides enforcement"', () => {
    const profile = generateSafetyProfile({ priorityEconomy: 50, priorityMilitary: 50, priorityCriminal: 20 }, 'town',
      [{ name: 'Town watch' }, { name: 'Hireling hall' }, { name: 'Town council' }]);
    expect(profile.guardEffectivenessDesc).not.toMatch(/mercenary compan/i); // anchored: the next line holds the watch named in the same text
    expect(profile.guardEffectivenessDesc).toMatch(/watch/i);
  });
});

const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true,
  selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
const birth = (seed) => generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: seed.split('-')[1] }), null, { seed });

describe('cure 4: the import list tells the food record\'s story', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });
  test('agree-town-0 and agree-town-3 grow nine tenths of their need or more and say how little grain they bring in', () => expectNoSeedFailures(collectSeedFailures(['agree-town-0', 'agree-town-3'], (seed) => {
    const eco = birth(seed).economicState;
    expect(eco.foodSecurity.foodRecord.grownPct).toBeGreaterThanOrEqual(90);
    expect(eco.primaryImports.filter((label) => /^(?:bulk )?grain(?: and foodstuffs)?$/i.test(label))).toEqual([]);
    expect(eco.primaryImports).toContain('Grain (a little, beside its own harvest)');
  }), 'the grain import says how little'));
});

describe('cure 5: the viability hooks open events and do not answer the record otherwise', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });
  test('agree-village-28, agree-town-0 and agree-town-3 are at peace and no hook says war took their iron', () => expectNoSeedFailures(collectSeedFailures(['agree-village-28', 'agree-town-0', 'agree-town-3'], (seed) => {
    const hooks = (birth(seed).economicViability?.plotHooks || []).map((h) => h.hook);
    expect(hooks.filter((h) => /\b(?:war|armies)\b/i.test(h))).toEqual([]);
    expect(hooks.some((h) => /\biron\b/i.test(h))).toBe(true);
  }), 'no war hook in peace'));
  test('agree-village-1, agree-village-14 and agree-town-8 have a live material and no hook makes it scarce', () => expectNoSeedFailures(collectSeedFailures(['agree-village-1', 'agree-village-14', 'agree-town-8'], (seed) => {
    const s = birth(seed);
    const live = s.resourceAnalysis.availableResources;
    const scarce = (s.economicViability?.plotHooks || []).map((h) => h.hook).filter((h) => (
      (/\b(?:iron|metal)\b/i.test(h) && live.includes('iron_deposits'))
      || (/\btimber\b/i.test(h) && ['managed_forest', 'mountain_timber', 'shipbuilding_timber', 'timber'].some((k) => live.includes(k)))));
    expect(scarce).toEqual([]);
  }), 'no scarcity of a live material'));
});

describe('cure 6 (the chair\'s food-sources ruling): worked land is a source by its own name', () => {
  const land = (resources, institutions = []) => foodLandOf('town', institutions, { nearbyResources: resources, nearbyResourcesNativeDepleted: [], tradeRouteAccess: 'road', terrainType: 'plains' }, 'road');
  test('available fields are grain and available grazing is livestock, with no farm or pastoral row', () => {
    expect(land(['grain_fields', 'grazing_land']).foodSources).toEqual(['grain', 'livestock']);
  });
  test('naming the source grows nothing: the land\'s capacity is what the institutions make it', () => {
    expect(land(['grain_fields', 'grazing_land']).effectiveAgri).toBe(land([]).effectiveAgri);
  });
  test('hunting grounds stay wild land for a town with no hunters', () => {
    expect(land(['hunting_grounds']).foodSources).toEqual([]);
  });
});

describe('cure 8: the health summary\'s "paid hands" reads the defence home', () => {
  test('a militia and walls are not paid hands; a watch is', () => {
    const inst = { hasMilitaryInst: true };
    expect(institutionsPoolKey(inst, { institutions: [{ name: 'Citizen militia' }, { name: 'Town walls' }] })).not.toBe('GARRISONED');
    expect(institutionsPoolKey(inst, { institutions: [{ name: 'Town watch' }] })).toBe('GARRISONED');
  });
});

describe('cure 9: the flag bag\'s hired company and gate are the defence home\'s answers', () => {
  test('a veteran\'s lodge is not a mercenary company, and a palisade has no gates of record', () => {
    expect(getInstFlags({}, [{ name: "Veteran's lodge" }]).inst.hasMercenary).toBe(false);
    expect(getInstFlags({}, [{ name: 'Palisade or earthworks' }]).inst.hasGates).toBe(false);
    expect(getInstFlags({}, [{ name: 'Mercenary company' }, { name: 'Town walls' }]).inst).toMatchObject({ hasMercenary: true, hasGates: true });
  });
});

/**
 * F9 (COHERENCE-AGREE-3, REVIEW-AGREE): the market's latent second readers re-pointed to the market home —
 * viability.js's city-without-a-market warning and economicState.js's Market Taxes. THE PIN THAT NO PRINTED LINE
 * MOVES: on births across the four browser tiers, the name list each reader kept answers what the home answers
 * (measured on the 2,866-birth L2 corpus at 65ce74ce6: equal on every one), so the re-point is a change of
 * reader, never of answer.
 */
describe('F9: the market readers follow the market home, and no answer moves', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });
  test('the old name lists and the home agree on every roster', async () => {
    const { hasMarketInstitution } = await import('../../src/domain/facts/market.js');
    const { nativeSemanticNames } = await import('../../src/domain/content/customContentSemanticAuthority.js');
    const seeds = ['village', 'town', 'city', 'metropolis'].flatMap((tier) => Array.from({ length: 8 }, (_, i) => `agree-${tier}-${i}`));
    expectNoSeedFailures(collectSeedFailures(seeds, (seed) => {
      const settlement = birth(seed);
      const names = nativeSemanticNames(settlement.institutions).map((n) => n.toLowerCase());
      const named = (...kws) => kws.some((kw) => names.some((n) => n.includes(kw)));
      const home = hasMarketInstitution(settlement.institutions);
      expect(named('market', 'merchant', 'district'), `${seed}: the viability reader`).toBe(home);
      if (named('district market', 'multiple market', 'daily market', 'market square', 'weekly market', 'annual fair')) expect(home, `${seed}: a market-tax name`).toBe(true);
    }), 'the market readers agree with the home');
  });
});

/** F13 (COHERENCE-AGREE-3, REVIEW-AGREE): the income lines on the town's own land are declared, keyed by the text the branch prints. */
describe('F13: the income lines are declared where they are printed', () => {
  test('each key is a line economicState.js prints, each atom is declarable, each twin answers its original', async () => {
    const { INCOME_LINE_SIBLINGS, LOCAL_COAL_LINE, GRAIN_SURPLUS_LINE } = await import('../../src/generators/economy/incomeLineSiblings.js');
    const { assertDeclarable } = await import('../../src/domain/facts/factVocabulary.js');
    const { DECLARATION_CHANNELS } = await import('../../scripts/lib/table-pools.mjs');
    expect(Object.keys(INCOME_LINE_SIBLINGS)).toEqual([GRAIN_SURPLUS_LINE, LOCAL_COAL_LINE]);
    expect(DECLARATION_CHANNELS.map((c) => c.name)).toContain('INCOME_LINE_SIBLINGS');
    const { readFileSync } = await import('node:fs');
    const site = readFileSync(new URL('../../src/generators/economy/economicState.js', import.meta.url), 'utf8');
    for (const [key, set] of Object.entries(INCOME_LINE_SIBLINGS)) {
      expect(set[0].text).toBe(key);
      for (const line of set) for (const atom of [...(line.needs || []), ...(line.excludes || [])]) expect(assertDeclarable(atom).dimension, atom).toBeTruthy();
      if (set[1]) expect(set[1].twinOf).toBe(key);
    }
    // the branch prints each by its declared constant, so a reworded line cannot leave its declaration behind
    expect(site).toMatch(/\? GRAIN_SURPLUS_LINE\b/);
    expect(site).toMatch(/\? LOCAL_COAL_LINE\b/);
    expect(site).not.toContain('Local coal fires the forges');
  });
});

/**
 * STOP 2 (b) (COHERENCE-AGREE-3, the chair's ruling, 2026-11-12): the Court Fees and Gate Tolls lines read the
 * defence home's narrower facts (`hasCourthouse`, `hasTollGate`), whose names moved there from the economy's own
 * lists. THE PIN THAT NO PRINTED LINE MOVES: on births across the four browser tiers each old list answers what
 * the home answers, and the record's two income lines stand exactly where the home says.
 */
describe('STOP 2 (b): Court Fees and Gate Tolls read the home, and no answer moves', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });
  test('the old lists, the home and the printed lines agree on every roster', async () => {
    const { defenseFactsOf } = await import('../../src/domain/defense/defenseFacts.js');
    const { nativeSemanticNames } = await import('../../src/domain/content/customContentSemanticAuthority.js');
    const seeds = ['village', 'town', 'city', 'metropolis'].flatMap((tier) => Array.from({ length: 8 }, (_, i) => `agree-${tier}-${i}`));
    expectNoSeedFailures(collectSeedFailures(seeds, (seed) => {
      const settlement = birth(seed);
      const names = nativeSemanticNames(settlement.institutions).map((n) => n.toLowerCase());
      const named = (...kws) => kws.some((kw) => names.some((n) => n.includes(kw)));
      const home = defenseFactsOf(settlement);
      expect(named('courthouse', 'multiple court', 'city hall'), `${seed}: the court-fee list`).toBe(home.hasCourthouse);
      expect(named('gate', 'town wall', 'city wall'), `${seed}: the gate-toll list`).toBe(home.hasTollGate);
      const income = settlement.economicState.incomeSources.map((e) => e.source);
      expect(income.includes('Court Fees & Fines'), `${seed}: Court Fees where the home keeps a courthouse`).toBe(home.hasCourthouse);
      if (income.includes('Gate Tolls')) expect(home.hasTollGate, `${seed}: Gate Tolls only at a toll gate`).toBe(true);
    }), 'Court Fees and Gate Tolls agree with the home');
  });
});

/**
 * ITEM 1 (a) (COHERENCE-AGREE-4, 2026-11-12): the theocratic economic-situation line and its no-market twin name
 * the church, so each declares the sacred house beside the market it needs or refuses. The branch fires only beside
 * a cathedral or a monastery (`priorityHelpers.js :: theocraticEconomy`), so the declaration is true wherever the
 * line prints and the resolution answers as before: with a sacred house the pair resolves on the market alone.
 */
describe('item 1 (a): the theocratic pair declares the church it names', () => {
  test('the line and its twin both need the sacred house; the twin still refuses the market', async () => {
    const { PROSPERITY_LINE_SIBLINGS } = await import('../../src/generators/economy/prosperity.js');
    const { resolveSibling } = await import('../../src/domain/facts/drawDeclared.js');
    const key = Object.keys(PROSPERITY_LINE_SIBLINGS).find((k) => k.startsWith('The church controls'));
    const [line, twin] = PROSPERITY_LINE_SIBLINGS[key];
    expect(line.needs).toEqual(['market', 'sacredHouse']);
    expect(twin.needs).toEqual(['sacredHouse']);
    expect(twin.excludes).toEqual(['market']);
    const opts = (facts) => ({ facts, poolId: 'test:theocratic', surface: 'economics', drawKind: 'T' });
    expect(resolveSibling(key, PROSPERITY_LINE_SIBLINGS, opts({ market: true, sacredHouse: true }))).toBe(line.text);
    expect(resolveSibling(key, PROSPERITY_LINE_SIBLINGS, opts({ market: false, sacredHouse: true }))).toBe(twin.text);
  });
});

/**
 * ITEM 2 (COHERENCE-AGREE-4, the chair's ruling on the third seat's STOP 3): the vocabulary gains `court` and
 * `prison`, each the defence home's own atom (`defence.js :: court`, `prison`), so a line that names a court and
 * no prison can declare both. THE PIN THAT NO ANSWER MOVES: the home's prison, read off the live roster, answers
 * what the safety writer's own list (`priorityHelpers.js :: hasPrison`) answers on every roster.
 */
describe('item 2: the court and the prison are the defence home\'s atoms', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });
  test('both are declarable presence atoms homed on the defence record, and read it', async () => {
    const { assertDeclarable, atomHolds, FACT_DIMENSIONS } = await import('../../src/domain/facts/factVocabulary.js');
    for (const atom of ['court', 'prison']) {
      expect(assertDeclarable(atom).dimension).toBe(atom);
      expect(FACT_DIMENSIONS[atom].home).toBe('defence');
    }
    expect(atomHolds('court', { defence: { court: true, prison: false } })).toBe(true);
    expect(atomHolds('prison', { defence: { court: true, prison: false } })).toBe(false);
  });
  test('the home\'s prison answers what the safety writer\'s list answers, on every roster', async () => {
    const { defenseFactsOf } = await import('../../src/domain/defense/defenseFacts.js');
    const { defenceOf } = await import('../../src/domain/facts/defence.js');
    const seeds = ['village', 'town', 'city', 'metropolis'].flatMap((tier) => Array.from({ length: 8 }, (_, i) => `agree-${tier}-${i}`));
    let held = 0;
    expectNoSeedFailures(collectSeedFailures(seeds, (seed) => {
      const settlement = birth(seed);
      const home = defenseFactsOf(settlement);
      expect(home.hasPrison, `${seed}: the prison`).toBe(getInstFlags({}, settlement.institutions).inst.hasPrison);
      expect(defenceOf(settlement).prison).toBe(home.hasPrison);
      if (home.hasPrison) held += 1;
    }), 'the prison has one answer');
    expect(held).toBeGreaterThan(0);
  });
});

/**
 * ITEM 2 (ii) (COHERENCE-AGREE-4): cure 11's three crime lines for a court with no prison are declared where they
 * are printed — each a declared cell needing the court and refusing the prison, the two facts its branch reads
 * (`inst.hasCourtSystem && !inst.hasPrison`). Text unchanged: the cell gives back its text.
 */
describe('item 2 (ii): the court-without-prison crime lines declare both facts', () => {
  test('each " With nowhere to hold the guilty, …" line is a cell that needs the court and excludes the prison', async () => {
    const { readFileSync } = await import('node:fs');
    const { assertDeclarable } = await import('../../src/domain/facts/factVocabulary.js');
    const site = readFileSync(new URL('../../src/generators/safetyProfile.js', import.meta.url), 'utf8');
    const said = [...site.matchAll(/' With nowhere to hold the guilty, [^']*'/g)].map((m) => m[0]);
    const declared = [...site.matchAll(/lineText\(\{ text: (' With nowhere to hold the guilty, [^']*'), needs: \['court'\], excludes: \['prison'\] \}\)/g)].map((m) => m[1]);
    expect(said).toHaveLength(3);
    expect(declared).toEqual(said);
    for (const atom of ['court', 'prison']) expect(assertDeclarable(atom).dimension).toBe(atom);
  });
});
