/**
 * THE NORSE AND SLAVIC SCOPES CLAIM WATER (chair ruling 5, 2026-11-04): "built around the hall
 * and the water", "between river and forest" are gated by the same water fact as the Greek
 * harbour; inland the plain identity sentence stands.
 */
import { describe, expect, it } from 'vitest';
import { cultureScopeLine } from '../../src/domain/summary/settlementQuickGuide.js';

const line = (key, terrainType, tradeRouteAccess) => cultureScopeLine({ culturalIdentity: { key, label: key }, config: { terrainType, tradeRouteAccess } });

describe('waterside scopes', () => {
  it('norse and slavic: no water line in a landlocked place, kept by water', () => {
    for (const key of ['norse', 'slavic']) {
      expect(line(key, 'plains', 'road'), `${key}: no water line in a landlocked place`).toBe('');
      expect(line(key, 'riverside', 'road'), `${key}: kept by water`).not.toBe('');
    }
  });
  it('a dry culture keeps its line inland', () => {
    expect(line('germanic', 'plains', 'road')).not.toBe('');
  });
});
