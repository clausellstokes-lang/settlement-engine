/**
 * THE NORSE AND SLAVIC SCOPES CLAIM WATER (chair ruling 5, 2026-11-04): "built around the hall
 * and the water", "between river and forest" are gated by the same water fact as the Greek
 * harbour; inland the plain identity sentence stands.
 *
 * RUNG-2 LANDING phase B (the chair's ruling of 2026-11-05 10:0x, re-keyed by cause): the slot
 * inland was MUTE, not absent — each now takes its authored inland form, which names no water
 * (`tests/domain/summary/inlandScopePhrases.test.js`).
 */
import { describe, expect, it } from 'vitest';
import { cultureScopeLine } from '../../src/domain/summary/settlementQuickGuide.js';

const line = (key, terrainType, tradeRouteAccess) => cultureScopeLine({ culturalIdentity: { key, label: key }, config: { terrainType, tradeRouteAccess } });

describe('waterside scopes', () => {
  it('norse and slavic: no water line in a landlocked place, kept by water', () => {
    for (const key of ['norse', 'slavic']) {
      expect(line(key, 'plains', 'road'), `${key}: an inland line in a landlocked place`).not.toBe('');
      expect(line(key, 'plains', 'road'), `${key}: no water line in a landlocked place`).not.toMatch(/water|river/); // anchored: the same call is proven non-empty on the line above, and the water line is matched by water below
      expect(line(key, 'riverside', 'road'), `${key}: kept by water`).toMatch(/water|river/);
    }
  });
  it('a dry culture keeps its line inland', () => {
    expect(line('germanic', 'plains', 'road')).not.toBe('');
  });
});
