/**
 * tests/lib/supplyChains.test.js - Tier 3.8 coverage.
 */

import { describe, test, expect } from 'vitest';
import { CHAIN_DEFS, buildChainEdges } from '../../src/lib/supplyChains.js';

describe('CHAIN_DEFS', () => {
  test('exposes the canonical 6 chains', () => {
    expect(CHAIN_DEFS.length).toBeGreaterThanOrEqual(6);
    const ids = CHAIN_DEFS.map(c => c.id);
    for (const id of ['iron', 'grain', 'timber', 'textile', 'stone', 'luxury']) {
      expect(ids).toContain(id);
    }
  });

  test('every chain has resources + consumers + name + color', () => {
    for (const c of CHAIN_DEFS) {
      expect(typeof c.name).toBe('string');
      expect(typeof c.color).toBe('string');
      expect(Array.isArray(c.resources)).toBe(true);
      expect(Array.isArray(c.consumers)).toBe(true);
      expect(c.resources.length).toBeGreaterThan(0);
      expect(c.consumers.length).toBeGreaterThan(0);
    }
  });
});

describe('buildChainEdges()', () => {
  test('returns empty when neither side produces/consumes', () => {
    const a = { name: 'A', config: { nearbyResources: [] }, institutions: [] };
    const b = { name: 'B', config: { nearbyResources: [] }, institutions: [] };
    expect(buildChainEdges(a, b)).toEqual([]);
  });

  test('A produces iron + B consumes -> A→B iron edge', () => {
    const a = { name: 'Ironmere', config: { nearbyResources: ['iron_ore'] }, institutions: [] };
    const b = { name: 'Forgehome', config: { nearbyResources: [] }, institutions: [{ name: 'Smithy' }] };
    const edges = buildChainEdges(a, b);
    expect(edges.some(e => e.chainId === 'iron' && e.direction === 'A→B')).toBe(true);
  });

  test('bidirectional production/consumption produces two edges', () => {
    const a = {
      name: 'A',
      config: { nearbyResources: ['iron_ore'] },
      institutions: [{ name: 'Carpenter' }],
    };
    const b = {
      name: 'B',
      config: { nearbyResources: ['timber'] },
      institutions: [{ name: 'Smithy' }],
    };
    const edges = buildChainEdges(a, b);
    expect(edges.some(e => e.chainId === 'iron' && e.direction === 'A→B')).toBe(true);
    expect(edges.some(e => e.chainId === 'timber' && e.direction === 'B→A')).toBe(true);
  });

  test('accepts resources as object form', () => {
    const a = { name: 'A', nearbyResources: [{ id: 'grain' }], institutions: [] };
    const b = { name: 'B', institutions: [{ name: 'Bakery' }] };
    const edges = buildChainEdges(a, b);
    expect(edges.some(e => e.chainId === 'grain' && e.direction === 'A→B')).toBe(true);
  });

  test('falls back to legacy `resources` field', () => {
    const a = { name: 'A', resources: ['quarry_stone'], institutions: [] };
    const b = { name: 'B', institutions: [{ name: 'Mason' }] };
    const edges = buildChainEdges(a, b);
    expect(edges.some(e => e.chainId === 'stone')).toBe(true);
  });

  test('handles nullish settlements without throwing', () => {
    expect(() => buildChainEdges(null, null)).not.toThrow();
    expect(() => buildChainEdges({ name: 'A' }, null)).not.toThrow();
  });

  test('does not mutate inputs', () => {
    const a = { name: 'A', config: { nearbyResources: ['iron_ore'] }, institutions: [] };
    const b = { name: 'B', institutions: [{ name: 'Smithy' }] };
    const before = JSON.stringify({ a, b });
    buildChainEdges(a, b);
    expect(JSON.stringify({ a, b })).toBe(before);
  });
});
