/**
 * coherenceAgreeCures.test.js — COHERENCE-AGREE's cures, one pin each (the chair's charter of
 * 2026-11-11, §2): the town's own drawn facts override a terrain table, and a fact has one reader.
 * Each describe block was red at the lane's base (99bcc6944) and turns green with its own commit.
 */
import { beforeAll, describe, expect, test } from 'vitest';

import { generateResourceAnalysis } from '../../src/generators/resourceGenerator.js';
import { generateSafetyProfile } from '../../src/generators/safetyProfile.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';

describe('cure 1: the critical imports never deny a live local resource', () => {
  test('"metals" is not a critical import beside live iron; it is with no metal at all', () => {
    expect(generateResourceAnalysis('plains', ['iron_deposits', 'iron', 'metalwork'], [], []).imports.critical).not.toContain('metals');
    expect(generateResourceAnalysis('plains', ['gems'], [], []).imports.critical).toContain('metals');
  });
  test('"Charcoal and fuel" is not a critical import beside peat or coal', () => {
    expect(generateResourceAnalysis('mountain', ['marshlands', 'peat'], [], []).imports.critical).not.toContain('Charcoal and fuel');
    expect(generateResourceAnalysis('mountain', ['coal_deposits', 'coal'], [], []).imports.critical).not.toContain('Charcoal and fuel');
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
    expect(profile.guardEffectivenessDesc).not.toMatch(/mercenary compan/i);
    expect(profile.guardEffectivenessDesc).toMatch(/watch/i);
  });
});

const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true,
  selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
const birth = (seed) => generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: seed.split('-')[1] }), null, { seed });

describe('cure 4: the import list tells the food record\'s story', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });
  test.each(['agree-town-0', 'agree-town-3'])('%s grows nine tenths of its need or more and says how little grain it brings in', (seed) => {
    const eco = birth(seed).economicState;
    expect(eco.foodSecurity.foodRecord.grownPct).toBeGreaterThanOrEqual(90);
    expect(eco.primaryImports.filter((label) => /^(?:bulk )?grain(?: and foodstuffs)?$/i.test(label))).toEqual([]);
    expect(eco.primaryImports).toContain('Grain (a little, beside its own harvest)');
  });
});
