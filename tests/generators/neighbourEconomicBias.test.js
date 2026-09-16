/**
 * neighbourEconomicBias.test.js — direct policy tests for the final
 * relationship-derived export adjustment.
 */
import { describe, expect, test } from 'vitest';
import { applyNeighbourEconomicBias } from '../../src/generators/economy/neighbourEconomicBias.js';

const applyBias = ({
  bias,
  mode,
  primaryExports,
  isSubsistenceIsolated = false,
}) => {
  const exports = [...primaryExports];
  const nativeTradeCandidates = { exports: [] };
  applyNeighbourEconomicBias({
    bias,
    mode,
    isSubsistenceIsolated,
    primaryExports: exports,
    nativeTradeCandidates,
  });
  return {
    primaryExports: exports,
    ownedCandidates: nativeTradeCandidates.exports,
  };
};

describe('neighbour economic bias', () => {
  test('hostile suppression caps export variety without inventing ownership', () => {
    const result = applyBias({
      bias: { grain: 0.5 },
      mode: 'suppress',
      primaryExports: ['Grain', 'Iron', 'Timber', 'Wool', 'Salt', 'Stone'],
    });

    expect(result).toEqual({
      primaryExports: ['Grain', 'Iron', 'Timber', 'Wool'],
      ownedCandidates: [],
    });
  });

  test('complementary trade removes only goods marked as competing', () => {
    const result = applyBias({
      bias: { iron: 0.5, grain: 1.2 },
      mode: 'complement',
      primaryExports: ['Iron ore', 'Bulk grain', 'Timber'],
    });

    expect(result.primaryExports).toEqual(['Bulk grain', 'Timber']);
  });

  test('competitive economies intentionally retain overlapping exports', () => {
    const result = applyBias({
      bias: { iron: 0.5 },
      mode: 'compete',
      primaryExports: ['Iron ore', 'Timber'],
    });

    expect(result.primaryExports).toEqual(['Iron ore', 'Timber']);
  });

  test('dependent trade adds patron needs and records their native ownership', () => {
    const result = applyBias({
      bias: { timber: 1.5, wool: 1.6 },
      mode: 'dependent',
      primaryExports: ['Grain', 'Iron', 'Salt', 'Stone', 'Fish', 'Wine', 'Tools'],
    });

    // The established eight-export cap admits the first authored need only.
    expect(result.primaryExports).toEqual([
      'Grain',
      'Iron',
      'Salt',
      'Stone',
      'Fish',
      'Wine',
      'Tools',
      'Timber',
    ]);
    expect(result.ownedCandidates).toEqual(['Timber']);
  });

  test('subsistence isolation overrides every relationship mode', () => {
    const result = applyBias({
      bias: { timber: 1.5 },
      mode: 'dependent',
      primaryExports: [],
      isSubsistenceIsolated: true,
    });

    expect(result).toEqual({
      primaryExports: [],
      ownedCandidates: [],
    });
  });
});
