/**
 * libraryToolbar.test.js - Contract over the pure filter pipeline.
 *
 * applyLibraryFilters is the reusable query/sort/filter pipeline used
 * by SettlementsPanel and tested in isolation. Pinning behavior here
 * means a future UI rewrite can't silently drift the filter semantics.
 */

import { describe, it, expect } from 'vitest';
import { applyLibraryFilters, SORT_OPTIONS } from '../../src/components/library/LibraryToolbar.jsx';

const fixtures = [
  {
    id: 's1', name: 'Hightower\'s Reach', tier: 'town',
    savedAt: 1700000000000,
    settlement: { name: 'Hightower\'s Reach', npcs: [{ name: 'Velda Marsh' }], factions: [{ faction: 'Salt Guild' }], phase: 'canon' },
    neighbourLinks: [{ targetId: 's2', relType: 'rival' }],
  },
  {
    id: 's2', name: 'Greymoor', tier: 'city',
    savedAt: 1700001000000,
    settlement: { name: 'Greymoor', npcs: [{ name: 'Lord Aldric' }], phase: 'draft' },
    neighbourLinks: [],
  },
  {
    id: 's3', name: 'Stonebrook', tier: 'hamlet',
    savedAt: 1700002000000,
    settlement: { name: 'Stonebrook', phase: 'canon' },
    neighbourLinks: [{ targetId: 's1', relType: 'trade' }],
  },
];

describe('applyLibraryFilters - pipeline', () => {
  it('empty query + default sort → all rows, recent-first', () => {
    const out = applyLibraryFilters(fixtures, {});
    expect(out.length).toBe(3);
    expect(out[0].id).toBe('s3'); // most recent savedAt
    expect(out[2].id).toBe('s1');
  });

  it('query matches name', () => {
    const out = applyLibraryFilters(fixtures, { query: 'greymoor' });
    expect(out.length).toBe(1);
    expect(out[0].id).toBe('s2');
  });

  it('query matches NPC name', () => {
    const out = applyLibraryFilters(fixtures, { query: 'velda' });
    expect(out.length).toBe(1);
    expect(out[0].id).toBe('s1');
  });

  it('query matches faction name', () => {
    const out = applyLibraryFilters(fixtures, { query: 'salt' });
    expect(out.length).toBe(1);
    expect(out[0].id).toBe('s1');
  });

  it('canonOnly filter', () => {
    const out = applyLibraryFilters(fixtures, { filters: { canonOnly: true } });
    expect(out.length).toBe(2);
    expect(out.map(s => s.id).sort()).toEqual(['s1', 's3']);
  });

  it('hasNeighbours filter', () => {
    const out = applyLibraryFilters(fixtures, { filters: { hasNeighbours: true } });
    expect(out.length).toBe(2);
    expect(out.map(s => s.id).sort()).toEqual(['s1', 's3']);
  });

  it('query + filter combine', () => {
    const out = applyLibraryFilters(fixtures, {
      query: 'reach',
      filters: { canonOnly: true },
    });
    expect(out.length).toBe(1);
    expect(out[0].id).toBe('s1');
  });

  it('sort by name', () => {
    const out = applyLibraryFilters(fixtures, { sort: 'name' });
    expect(out.map(s => s.name)).toEqual([
      'Greymoor',
      "Hightower's Reach",
      'Stonebrook',
    ]);
  });

  it('sort by tier (size ascending)', () => {
    const out = applyLibraryFilters(fixtures, { sort: 'tier' });
    expect(out.map(s => s.tier)).toEqual(['hamlet', 'town', 'city']);
  });

  it('empty / nullish input → empty array', () => {
    expect(applyLibraryFilters(null)).toEqual([]);
    expect(applyLibraryFilters([])).toEqual([]);
  });

  it('exports a stable SORT_OPTIONS shape', () => {
    expect(SORT_OPTIONS.recent).toBeDefined();
    expect(SORT_OPTIONS.name).toBeDefined();
    expect(SORT_OPTIONS.tier).toBeDefined();
    expect(typeof SORT_OPTIONS.recent.compare).toBe('function');
  });
});
