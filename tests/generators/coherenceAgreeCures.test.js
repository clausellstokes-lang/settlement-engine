/**
 * coherenceAgreeCures.test.js — COHERENCE-AGREE's cures, one pin each (the chair's charter of
 * 2026-11-11, §2): the town's own drawn facts override a terrain table, and a fact has one reader.
 * Each describe block was red at the lane's base (99bcc6944) and turns green with its own commit.
 */
import { describe, expect, test } from 'vitest';

import { generateResourceAnalysis } from '../../src/generators/resourceGenerator.js';

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
