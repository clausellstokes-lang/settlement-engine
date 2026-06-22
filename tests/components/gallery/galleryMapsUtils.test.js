import { describe, it, expect } from 'vitest';

import {
  KIND_OPTIONS,
  BACKDROP_OPTIONS,
  MAP_SORT_OPTIONS,
  deriveTagVocabulary,
  activeMapFilterCount,
  applyMapFilters,
  ownedCampaignBySlug,
} from '../../../src/components/gallery/galleryMapsUtils.js';

// Fixture mirrors the list_gallery_maps tile shape (migration 045).
const ITEMS = [
  { slug: 'a', name: 'Coastal Realm', description: 'a windswept shore', kind: 'map_with_campaign', backdrop_kind: 'image', tags: ['coastal', 'trade'], published_at: '2026-01-03T00:00:00Z', view_count: 5 },
  { slug: 'b', name: 'Blank Canvas', description: 'empty terrain', kind: 'map', backdrop_kind: 'fmg', tags: ['blank'], published_at: '2026-01-02T00:00:00Z', view_count: 40 },
  { slug: 'c', name: 'Mountain Pass', description: 'high crags', kind: 'map_with_campaign', backdrop_kind: 'fmg', tags: ['mountain', 'trade'], published_at: '2026-01-05T00:00:00Z', view_count: 12 },
];

describe('galleryMapsUtils option catalogs', () => {
  it('uses the engine kind values with voice-clean labels (no ampersand)', () => {
    expect(KIND_OPTIONS.map(([id]) => id)).toEqual(['map', 'map_with_campaign']);
    expect(KIND_OPTIONS.find(([id]) => id === 'map_with_campaign')[1]).toBe('Map and campaign');
    expect(KIND_OPTIONS.some(([, label]) => label.includes('&'))).toBe(false);
  });

  it('maps backdrop_kind to readable labels', () => {
    expect(BACKDROP_OPTIONS.map(([id]) => id)).toEqual(['image', 'fmg']);
  });

  it('offers only the two stable sorts (newest, most_viewed)', () => {
    expect(MAP_SORT_OPTIONS.map(([id]) => id)).toEqual(['newest', 'most_viewed']);
  });
});

describe('deriveTagVocabulary', () => {
  it('returns the sorted, de-duped union of tags', () => {
    expect(deriveTagVocabulary(ITEMS)).toEqual(['blank', 'coastal', 'mountain', 'trade']);
  });
  it('tolerates empty / malformed input', () => {
    expect(deriveTagVocabulary()).toEqual([]);
    expect(deriveTagVocabulary([{ tags: null }, {}])).toEqual([]);
  });
});

describe('activeMapFilterCount', () => {
  it('counts every active facet including the boolean toggle', () => {
    expect(activeMapFilterCount({ kind: ['map'], backdrop: [], tags: ['trade'], hasSettlements: true })).toBe(3);
    expect(activeMapFilterCount({})).toBe(0);
  });
});

describe('applyMapFilters', () => {
  it('defaults to newest (published_at desc) and does not mutate input', () => {
    const out = applyMapFilters(ITEMS, {});
    expect(out.map(m => m.slug)).toEqual(['c', 'a', 'b']);
    expect(ITEMS[0].slug).toBe('a'); // input untouched
  });

  it('sorts by view_count desc for most_viewed', () => {
    const out = applyMapFilters(ITEMS, { sort: 'most_viewed' });
    expect(out.map(m => m.slug)).toEqual(['b', 'c', 'a']);
  });

  it('filters by kind', () => {
    const out = applyMapFilters(ITEMS, { filters: { kind: ['map'] } });
    expect(out.map(m => m.slug)).toEqual(['b']);
  });

  it('filters by backdrop', () => {
    const out = applyMapFilters(ITEMS, { filters: { backdrop: ['image'] } });
    expect(out.map(m => m.slug)).toEqual(['a']);
  });

  it('has-settlements toggle keeps only map_with_campaign', () => {
    const out = applyMapFilters(ITEMS, { filters: { hasSettlements: true } });
    expect(out.map(m => m.slug).sort()).toEqual(['a', 'c']);
  });

  it('filters by tags (any-of), case-insensitively', () => {
    const out = applyMapFilters(ITEMS, { filters: { tags: ['TRADE'] } });
    expect(out.map(m => m.slug).sort()).toEqual(['a', 'c']);
  });

  it('searches over name, description, and tags', () => {
    expect(applyMapFilters(ITEMS, { search: 'crags' }).map(m => m.slug)).toEqual(['c']);
    expect(applyMapFilters(ITEMS, { search: 'coastal' }).map(m => m.slug)).toEqual(['a']);
    expect(applyMapFilters(ITEMS, { search: 'blank canvas' }).map(m => m.slug)).toEqual(['b']);
  });

  it('combines facet + search + sort', () => {
    const out = applyMapFilters(ITEMS, {
      filters: { tags: ['trade'] },
      search: 'realm',
      sort: 'most_viewed',
    });
    expect(out.map(m => m.slug)).toEqual(['a']);
  });

  // Regression: faceting must run over the FULL fetched batch (GalleryMaps now
  // fetches the RPC's 60-cap, not a 36 head). most_viewed must surface the
  // globally most-viewed map even when it sits deep in the batch.
  it('surfaces the globally most-viewed map from a full batch', () => {
    const batch = Array.from({ length: 50 }, (_, i) => ({
      slug: `m${i}`,
      name: `Map ${i}`,
      kind: 'map',
      backdrop_kind: 'fmg',
      tags: [],
      published_at: `2026-01-${String((i % 28) + 1).padStart(2, '0')}T00:00:00Z`,
      view_count: i, // last item is the most-viewed
    }));
    const out = applyMapFilters(batch, { sort: 'most_viewed' });
    expect(out[0].slug).toBe('m49');
  });
});

describe('ownedCampaignBySlug (owner edit gate)', () => {
  it('keys ONLY currently-public campaigns with a non-empty publicSlug', () => {
    const campaigns = [
      { id: 'c1', name: 'Coastal Realm', publicSlug: 'a', isPublic: true },
      { id: 'c2', name: 'Draft', publicSlug: 'd', isPublic: false }, // not public
      { id: 'c3', name: 'No slug', publicSlug: '', isPublic: true }, // empty slug
      { id: 'c4', name: 'Null slug', publicSlug: null, isPublic: true }, // missing slug
      null, // malformed entry
      { id: 'c5', name: 'Mountain Pass', publicSlug: 'c', isPublic: true },
    ];
    const map = ownedCampaignBySlug(campaigns);

    expect(map.get('a')?.id).toBe('c1');
    expect(map.get('c')?.id).toBe('c5');
    // Strict gate: anything not public with a real slug must be absent.
    expect(map.get('d')).toBeUndefined();
    expect(map.get('')).toBeUndefined();
    expect(map.size).toBe(2);
  });

  it('tolerates empty / malformed input (anonymous users see no Edit)', () => {
    expect(ownedCampaignBySlug().size).toBe(0);
    expect(ownedCampaignBySlug(null).size).toBe(0);
    expect(ownedCampaignBySlug([]).size).toBe(0);
  });

  it('gates the Edit affordance: owned slug resolves an id, non-owned is undefined', () => {
    // Mirrors the GalleryMaps per-tile derivation: items vs the owned lookup.
    const items = [{ slug: 'a' }, { slug: 'b' }];
    const campaigns = [{ id: 'c1', publicSlug: 'a', isPublic: true }];
    const ownedBySlug = ownedCampaignBySlug(campaigns);

    // Tile 'a' is owned -> Edit shown, shareMap/unshareMap key on c1.
    const ownedA = ownedBySlug.get(items[0].slug) || null;
    expect(ownedA?.id).toBe('c1');
    expect(!!ownedA).toBe(true);

    // Tile 'b' is not owned -> no Edit (strict).
    const ownedB = ownedBySlug.get(items[1].slug) || null;
    expect(ownedB).toBeNull();
  });
});
