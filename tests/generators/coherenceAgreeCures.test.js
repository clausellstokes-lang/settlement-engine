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
