/**
 * viabilityFilter.test.js — [pdf-6].
 *
 * The PDF Viability chapter used to print dependency/resource-chain/opportunity/
 * food items the web routes to Economics & Resources, and the SAME v.issues array
 * printed again in the PDF Economics chapter — so one engine issue appeared twice
 * in one document. isViabilityItem is the shared predicate that partitions issues
 * to one home; the PDF viabilitySlice keeps isViabilityItem, economicsSlice keeps
 * the complement.
 */

import { describe, test, expect } from 'vitest';
import {
  isViabilityItem,
  VIABILITY_EXCLUDED_TYPES,
  VIABILITY_EXCLUDED_SEV,
  VIABILITY_EXCLUDED_CATEGORIES,
} from '../../src/domain/display/viabilityFilter.js';

describe('[pdf-6] viability filter partitions issues to one home', () => {
  test('excluded types/severities/categories are NOT viability items', () => {
    for (const type of VIABILITY_EXCLUDED_TYPES) expect(isViabilityItem({ type })).toBe(false);
    for (const severity of VIABILITY_EXCLUDED_SEV) expect(isViabilityItem({ severity })).toBe(false);
    for (const category of VIABILITY_EXCLUDED_CATEGORIES) expect(isViabilityItem({ category })).toBe(false);
  });

  test('genuine viability items (logic violations, critical conflicts) pass', () => {
    expect(isViabilityItem({ severity: 'critical', title: 'Contradiction' })).toBe(true);
    expect(isViabilityItem({ severity: 'high', type: 'out_of_tier' })).toBe(true);
  });

  test('each issue routes to exactly ONE surface (viability XOR economics complement)', () => {
    // Mirrors the two PDF slices: viability keeps isViabilityItem; economics keeps
    // the complement (minus by_design/stress, which belong to neither).
    const issues = [
      { severity: 'critical', title: 'Logic violation' },      // → viability
      { type: 'trade_dependency', severity: 'dependency' },     // → economics
      { type: 'resource_chain', severity: 'warning' },          // → economics
      { severity: 'opportunity', title: 'Export chance' },      // → economics
      { category: 'Water Dependency', severity: 'warning' },    // → economics
      { severity: 'by_design', title: 'Intentional' },          // → neither (own section)
      { type: 'stress_consequence', severity: 'critical' },     // → neither
    ];
    const viability = issues.filter(i => i.severity !== 'by_design' && i.type !== 'stress_consequence' && isViabilityItem(i));
    const economics = issues.filter(i => !isViabilityItem(i) && i.severity !== 'by_design' && i.type !== 'stress_consequence');

    // disjoint
    expect(viability.filter(i => economics.includes(i))).toEqual([]);
    // the logic violation is the only viability item; the four dependency/chain/
    // opportunity/water items are economics; by_design + stress belong to neither.
    expect(viability).toHaveLength(1);
    expect(economics).toHaveLength(4);
  });
});
