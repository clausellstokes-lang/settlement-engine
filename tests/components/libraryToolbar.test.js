/**
 * libraryToolbar.test.js — Contract over the pure filter pipeline.
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
    settlement: { name: 'Hightower\'s Reach', npcs: [{ name: 'Velda Marsh' }], factions: [{ faction: 'Salt Guild' }], phase: 'canon', neighbourNetwork: [{ name: 'Greymoor', relationshipType: 'rival' }] },
  },
  {
    id: 's2', name: 'Greymoor', tier: 'city',
    savedAt: 1700001000000,
    settlement: { name: 'Greymoor', npcs: [{ name: 'Lord Aldric' }], phase: 'draft', neighbourNetwork: [] },
  },
  {
    id: 's3', name: 'Stonebrook', tier: 'hamlet',
    savedAt: 1700002000000,
    settlement: { name: 'Stonebrook', phase: 'canon', neighbourNetwork: [{ name: 'Hightower\'s Reach', relationshipType: 'trade_partner' }] },
  },
];

describe('applyLibraryFilters — pipeline', () => {
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
    expect(SORT_OPTIONS.attention).toBeDefined();
    expect(typeof SORT_OPTIONS.recent.compare).toBe('function');
  });
});

// ── Phase 3 — the now-wired orphaned filters + living-world filters + attention sort.
describe('applyLibraryFilters — Phase 3 filters', () => {
  const deityTown = {
    id: 'd1', name: 'Faithful', tier: 'town', savedAt: 10,
    settlement: { config: { primaryDeitySnapshot: { name: 'Sol', rankAxis: 'major', alignmentAxis: 'good' } } },
    campaignState: { phase: 'canon', canonizedAt: '2026-01-01', editedAt: '2026-01-01' },
  };
  const editedDraft = {
    id: 'd2', name: 'Workbench', tier: 'village', savedAt: 20,
    settlement: { config: {} },
    // A plain draft with no pending-edit timestamp — should NOT match hasPendingEdits.
    campaignState: { phase: 'draft' },
  };
  const pendingCanon = {
    id: 'd3', name: 'Tweaked', tier: 'city', savedAt: 30,
    settlement: { config: {} },
    campaignState: { phase: 'canon', canonizedAt: '2026-01-01', editedAt: '2026-03-03' },
  };
  const all = [deityTown, editedDraft, pendingCanon];

  it('draftOnly chip (previously orphaned) now filters to drafts', () => {
    const out = applyLibraryFilters(all, { filters: { draftOnly: true } });
    expect(out.map(s => s.id)).toEqual(['d2']);
  });

  it('hasPendingEdits chip (previously orphaned) filters to edited-after-canon', () => {
    const out = applyLibraryFilters(all, { filters: { hasPendingEdits: true } });
    expect(out.map(s => s.id)).toEqual(['d3']);
  });

  it('hasDeity filters to settlements with an embedded primary deity', () => {
    const out = applyLibraryFilters(all, { filters: { hasDeity: true } });
    expect(out.map(s => s.id)).toEqual(['d1']);
  });

  it('atWar matches nothing without campaign context (degrades safely)', () => {
    const out = applyLibraryFilters(all, { filters: { atWar: true } });
    expect(out).toEqual([]);
  });

  it('atWar uses the parent-supplied live-world context', () => {
    const atWarSave = { id: 'w1', name: 'Besieged', tier: 'town', savedAt: 5, settlement: { config: {} } };
    const context = {
      liveWorldFor: (s) => s.id === 'w1'
        ? { worldState: { deployments: { enemy: { targetId: 'w1' } } }, regionalGraph: null }
        : null,
    };
    const out = applyLibraryFilters([atWarSave, editedDraft], { filters: { atWar: true } }, context);
    expect(out.map(s => s.id)).toEqual(['w1']);
  });

  it('campaign selector restricts to one campaign via the parent resolver', () => {
    const context = { campaignIdFor: (s) => (s.id === 'd1' ? 'camp-A' : 'camp-B') };
    const out = applyLibraryFilters(all, { filters: { campaignId: 'camp-A' } }, context);
    expect(out.map(s => s.id)).toEqual(['d1']);
  });

  it('"Needs attention" sort floats the worst-band settlement up', () => {
    const healthy = {
      id: 'h', name: 'Calm', tier: 'town', savedAt: 1,
      settlement: { economicState: { prosperity: 'Wealthy' }, config: { monsterThreat: 'safe' } },
    };
    const crisis = {
      id: 'c', name: 'Burning', tier: 'town', savedAt: 2,
      settlement: {
        economicState: { prosperity: 'Struggling' },
        config: { monsterThreat: 'plagued', nearbyResourcesState: { iron: 'depleted' }, tradeRouteAccess: 'isolated' },
        powerStructure: { factions: [{}, {}, {}, {}, {}], conflicts: [{}, {}, {}] },
        stressors: [{ type: 'siege' }, { type: 'war' }],
      },
    };
    const out = applyLibraryFilters([healthy, crisis], { sort: 'attention' });
    expect(out[0].id).toBe('c');
  });
});
