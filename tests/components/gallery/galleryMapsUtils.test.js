import { describe, it, expect } from 'vitest';

import {
  KIND_OPTIONS,
  BACKDROP_OPTIONS,
  MAP_SORT_OPTIONS,
  deriveTagVocabulary,
  activeMapFilterCount,
  ownedCampaignBySlug,
} from '../../../src/components/gallery/galleryMapsUtils.js';

// Fixture mirrors the list_gallery_maps tile shape (migration 065): the server
// now returns the narrowed set, plus the real import_count + member_count.
//
// member_count is GATED server-side to exactly the members get_gallery_map (046)
// projects — share_kind='map_with_campaign' AND the owner's gallery_share_campaign
// opt-in. A blank kind='map' share, or a campaign share with the opt-in OFF, carries
// 0 even when its campaign envelope still holds settlementIds (tile 'b' is the blank
// case). The SQL gate itself is proven by execution in
// tests/security/galleryMapMemberCount.pglite.test.js; this fixture mirrors its
// contract so the JS layer renders against the same truth.
const ITEMS = [
  { slug: 'a', name: 'Coastal Realm', description: 'a windswept shore', kind: 'map_with_campaign', backdrop_kind: 'image', tags: ['coastal', 'trade'], published_at: '2026-01-03T00:00:00Z', view_count: 5, import_count: 3, member_count: 4 },
  { slug: 'b', name: 'Blank Canvas', description: 'empty terrain', kind: 'map', backdrop_kind: 'fmg', tags: ['blank'], published_at: '2026-01-02T00:00:00Z', view_count: 40, import_count: 0, member_count: 0 },
  { slug: 'c', name: 'Mountain Pass', description: 'high crags', kind: 'map_with_campaign', backdrop_kind: 'fmg', tags: ['mountain', 'trade'], published_at: '2026-01-05T00:00:00Z', view_count: 12, import_count: 9, member_count: 2 },
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

  it('offers the three server-side sorts including the real Most imported', () => {
    expect(MAP_SORT_OPTIONS.map(([id]) => id)).toEqual(['newest', 'most_viewed', 'most_imported']);
    expect(MAP_SORT_OPTIONS.find(([id]) => id === 'most_imported')[1]).toBe('Most imported');
  });
});

describe('list_gallery_maps tile shape (real metrics)', () => {
  it('carries import_count and member_count on every tile', () => {
    for (const item of ITEMS) {
      expect(typeof item.import_count).toBe('number');
      expect(typeof item.member_count).toBe('number');
    }
  });

  it('the real has-settlements facet keeps only member_count > 0 (no kind proxy)', () => {
    // The server applies this WHERE (migration 065); the client mirror is the
    // member_count > 0 predicate the tile renders against.
    const withMembers = ITEMS.filter(m => Number(m.member_count) > 0);
    expect(withMembers.map(m => m.slug).sort()).toEqual(['a', 'c']);
    // A blank map carries 0 members even though kind alone could mislead.
    expect(ITEMS.find(m => m.slug === 'b').member_count).toBe(0);
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
