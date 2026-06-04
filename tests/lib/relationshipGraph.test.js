/**
 * tests/lib/relationshipGraph.test.js - Tier 3.8 coverage.
 */

import { describe, test, expect } from 'vitest';
import {
  EFFECT_CATEGORIES,
  PROPAGATION_MATRIX,
  buildGraph,
  computeModifiers,
  getSettlementModifiers,
  getAllModifiers,
  fmtMod,
  dominantEffect,
  REL_LABELS,
} from '../../src/lib/relationshipGraph.js';

describe('catalogs', () => {
  test('EFFECT_CATEGORIES exposes 5 canonical categories', () => {
    expect(EFFECT_CATEGORIES.map(c => c.key)).toEqual([
      'economy', 'safety', 'supply', 'political', 'defensibility',
    ]);
  });

  test('PROPAGATION_MATRIX has every relationship type with all 5 categories + decay', () => {
    for (const [type, m] of Object.entries(PROPAGATION_MATRIX)) {
      expect(m, type).toHaveProperty('economy');
      expect(m).toHaveProperty('safety');
      expect(m).toHaveProperty('supply');
      expect(m).toHaveProperty('political');
      expect(m).toHaveProperty('defensibility');
      expect(typeof m.decay).toBe('number');
    }
  });

  test('REL_LABELS covers every relationship type', () => {
    for (const type of Object.keys(PROPAGATION_MATRIX)) {
      expect(REL_LABELS[type], type).toBeTruthy();
    }
  });
});

describe('fmtMod()', () => {
  test('returns "0" for tiny values', () => {
    expect(fmtMod(0)).toBe('0');
    expect(fmtMod(0.004)).toBe('0');
    expect(fmtMod(-0.004)).toBe('0');
  });

  test('adds + sign for positive non-trivial values', () => {
    expect(fmtMod(0.25)).toBe('+0.25');
  });

  test('shows negative values as-is', () => {
    expect(fmtMod(-0.5)).toBe('-0.50');
  });
});

describe('dominantEffect()', () => {
  test('returns the category with greatest absolute modifier', () => {
    expect(dominantEffect({
      economy: 0.1, safety: -0.4, supply: 0.05, political: 0.0, defensibility: 0.2,
    })).toBe('safety');
  });

  test('returns null when all are zero', () => {
    expect(dominantEffect({
      economy: 0, safety: 0, supply: 0, political: 0, defensibility: 0,
    })).toBeNull();
  });
});

// ── Graph + modifiers ──────────────────────────────────────────────────

function save(id, name, neighbours = [], extra = {}) {
  return {
    id,
    name,
    settlement: {
      name,
      neighbourNetwork: neighbours,
      ...extra.settlement,
    },
    config: extra.config || {},
    tier: extra.tier || 'town',
  };
}

describe('buildGraph()', () => {
  test('builds adjacency from neighbourNetwork name matches', () => {
    const A = save('a', 'Aford', [{ neighbourName: 'Bton', relationshipType: 'trade_partner' }]);
    const B = save('b', 'Bton', [{ neighbourName: 'Aford', relationshipType: 'trade_partner' }]);
    const graph = buildGraph([A, B]);
    const aEdges = graph.get('a');
    expect(aEdges.length).toBe(1);
    expect(aEdges[0].targetId).toBe('b');
  });

  test('returns map with empty arrays for isolated settlements', () => {
    const A = save('a', 'Aford');
    const graph = buildGraph([A]);
    expect(graph.get('a')).toEqual([]);
  });
});

describe('computeModifiers()', () => {
  test('returns 5-category totals + breakdown', () => {
    const A = save('a', 'Aford', [{ neighbourName: 'Bton', relationshipType: 'trade_partner' }]);
    const B = save('b', 'Bton', [{ neighbourName: 'Aford', relationshipType: 'trade_partner' }]);
    const graph = buildGraph([A, B]);
    const saveIndex = new Map([['a', A], ['b', B]]);
    const result = computeModifiers('a', graph, saveIndex);
    expect(result).toHaveProperty('totals');
    expect(result).toHaveProperty('sources');
    for (const cat of EFFECT_CATEGORIES.map(c => c.key)) {
      expect(typeof result.totals[cat]).toBe('number');
    }
  });

  test('returns zeros for isolated settlement', () => {
    const A = save('a', 'Aford');
    const graph = buildGraph([A]);
    const saveIndex = new Map([['a', A]]);
    const result = computeModifiers('a', graph, saveIndex);
    for (const cat of EFFECT_CATEGORIES.map(c => c.key)) {
      expect(result.totals[cat]).toBe(0);
    }
  });
});

describe('getSettlementModifiers()', () => {
  test('wraps buildGraph + computeModifiers for a single settlement', () => {
    const A = save('a', 'Aford', [{ neighbourName: 'Bton', relationshipType: 'hostile' }]);
    const B = save('b', 'Bton', [{ neighbourName: 'Aford', relationshipType: 'hostile' }]);
    const result = getSettlementModifiers('a', [A, B]);
    expect(result.totals).toBeTruthy();
    // Hostile neighbour produces negative defensibility for A
    expect(result.totals.defensibility).toBeLessThan(0);
  });

  test('returns zeros + empty sources for missing settlement', () => {
    const result = getSettlementModifiers('missing', []);
    expect(result.totals.economy).toBe(0);
    expect(result.sources).toEqual([]);
  });
});

describe('getAllModifiers()', () => {
  test('returns a Map keyed by settlement id', () => {
    const A = save('a', 'Aford', [{ neighbourName: 'Bton', relationshipType: 'trade_partner' }]);
    const B = save('b', 'Bton', [{ neighbourName: 'Aford', relationshipType: 'trade_partner' }]);
    const all = getAllModifiers([A, B]);
    expect(all instanceof Map).toBe(true);
    expect(all.get('a')).toBeTruthy();
    expect(all.get('b')).toBeTruthy();
    expect(all.get('a').totals).toBeTruthy();
  });
});
