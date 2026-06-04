/**
 * tests/domain/distributionDashboard.test.js - Tier 3.10 lean tests.
 */

import { describe, it, expect } from 'vitest';
import {
  aggregateDistribution,
  distributionRows,
  distributionSections,
} from '../../src/domain/distributionDashboard.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';

describe('aggregateDistribution()', () => {
  it('returns blank for empty input', () => {
    const a = aggregateDistribution([]);
    expect(a.n).toBe(0);
    expect(a.institutionFrequency).toEqual({});
  });

  it('returns canonical envelope shape', () => {
    const a = aggregateDistribution([
      { institutions: [{ name: 'Granary' }] },
    ]);
    expect(a).toHaveProperty('n', 1);
    expect(a).toHaveProperty('institutionFrequency');
    expect(a).toHaveProperty('prosperityBands');
    expect(a).toHaveProperty('factionArchetypes');
    expect(a).toHaveProperty('foodSecurity');
    expect(a).toHaveProperty('substrateBandFloors');
    expect(a).toHaveProperty('contradictionTypes');
    expect(a).toHaveProperty('averages');
  });

  it('counts institutions by category', () => {
    const a = aggregateDistribution([
      { institutions: [{ name: 'Granary' }, { name: 'Temple of Light' }] },
      { institutions: [{ name: 'Forge' }] },
    ]);
    expect(a.institutionFrequency.food).toBeGreaterThan(0);
    expect(a.institutionFrequency.religious).toBeGreaterThan(0);
    expect(a.institutionFrequency.craft).toBeGreaterThan(0);
  });

  it('aggregates substrate bands', () => {
    const a = aggregateDistribution([
      { powerStructure: { publicLegitimacy: { score: 80, label: 'Endorsed' } } },
      { powerStructure: { publicLegitimacy: { score: 20, label: 'Crisis' } } },
    ]);
    expect(a.substrateBandFloors.public_legitimacy).toBeTruthy();
    const total = Object.values(a.substrateBandFloors.public_legitimacy).reduce((s, n) => s + n, 0);
    expect(total).toBe(2);
  });

  it('computes averages', () => {
    const a = aggregateDistribution([
      { institutions: [{ name: 'A' }, { name: 'B' }] },
      { institutions: [{ name: 'C' }] },
    ]);
    expect(a.averages.institutions).toBe(1.5);
  });
});

describe('distributionRows()', () => {
  it('returns sorted rows by value descending', () => {
    const a = aggregateDistribution([
      { institutions: [{ name: 'Granary' }, { name: 'Granary' }, { name: 'Forge' }] },
    ]);
    const rows = distributionRows(a, 'institutionFrequency');
    expect(rows[0].value).toBeGreaterThanOrEqual(rows[1].value);
  });

  it('returns [] for unknown section', () => {
    expect(distributionRows({}, 'not_a_section')).toEqual([]);
  });
});

describe('distributionSections()', () => {
  it('exposes the canonical section names', () => {
    const sections = distributionSections();
    expect(sections).toContain('institutionFrequency');
    expect(sections).toContain('prosperityBands');
    expect(sections).toContain('factionArchetypes');
    expect(sections).toContain('contradictionTypes');
  });
});

describe('purity + smoke', () => {
  it('does not mutate input settlements', () => {
    const s = { institutions: [{ name: 'Granary' }] };
    const before = JSON.stringify(s);
    aggregateDistribution([s, s]);
    expect(JSON.stringify(s)).toBe(before);
  });

  it('aggregates over 5 real settlements', () => {
    const ss = [];
    for (let i = 0; i < 5; i++) {
      ss.push(generateSettlementPipeline(
        { settType: 'town', culture: 'germanic' },
        null,
        { seed: `dist-${i}`, customContent: {} },
      ));
    }
    const a = aggregateDistribution(ss);
    expect(a.n).toBe(5);
    expect(a.averages.institutions).toBeGreaterThan(0);
    expect(Object.keys(a.factionArchetypes).length).toBeGreaterThan(0);
  });
});
