/**
 * galleryHubs.test.js — the facet-hub manifest + routing (GALLERY-2 phase 2).
 *
 * Pins:
 *   • the manifest: 15 hubs (7 terrains + 6 tiers + at-war + most-alive),
 *     derived from the CANONICAL vocabularies (no fork), frozen, unique paths,
 *     each with a locked query the server honors.
 *   • routing: every hub path resolves to the gallery view with the right hub
 *     params; /gallery/at-war and /gallery/most-alive resolve as HUBS, not as
 *     dossier slugs (the ordering trap); a real slug still resolves as a slug;
 *     viewToPath round-trips every hub.
 *   • crawlability posture: no hub path is guarded or noindexed.
 */
import { describe, it, expect } from 'vitest';
import { GALLERY_HUBS, HUB_BY_PATH, resolveHub } from '../../src/lib/galleryHubs.js';
import { TERRAIN_OPTIONS, TIER_OPTIONS } from '../../src/components/gallery/galleryUtils.js';
import { resolveLocation, viewToPath } from '../../src/lib/routes.js';
import { NOINDEX_VIEWS, RETIRED_VIEWS } from '../../scripts/generate-sitemap.mjs';

describe('the hub manifest', () => {
  it('is exactly the canonical vocabularies + the two boolean hubs (15 total)', () => {
    expect(GALLERY_HUBS).toHaveLength(TERRAIN_OPTIONS.length + TIER_OPTIONS.length + 2);
    for (const kind of TERRAIN_OPTIONS) expect(HUB_BY_PATH[`/gallery/terrain/${kind}`]).toBeTruthy();
    for (const tier of TIER_OPTIONS) expect(HUB_BY_PATH[`/gallery/tier/${tier}`]).toBeTruthy();
    expect(HUB_BY_PATH['/gallery/at-war']).toBeTruthy();
    expect(HUB_BY_PATH['/gallery/most-alive']).toBeTruthy();
  });

  it('paths are unique and frozen; every hub carries title + blurb + a locked query', () => {
    const paths = GALLERY_HUBS.map(h => h.path);
    expect(new Set(paths).size).toBe(paths.length);
    expect(Object.isFrozen(GALLERY_HUBS)).toBe(true);
    for (const hub of GALLERY_HUBS) {
      expect(Object.isFrozen(hub)).toBe(true);
      expect(hub.title.length).toBeGreaterThan(3);
      expect(hub.blurb.length).toBeGreaterThan(20);
      expect(hub.query.filters || hub.query.sort).toBeTruthy();
    }
    expect(HUB_BY_PATH['/gallery/most-alive'].query.sort).toBe('most_alive');
    expect(HUB_BY_PATH['/gallery/at-war'].query.filters).toEqual({ atWar: true });
  });
});

describe('hub routing (the PARAM_ROUTES ordering trap)', () => {
  it('every hub path resolves to the gallery view with hub params, and resolveHub round-trips it', () => {
    for (const hub of GALLERY_HUBS) {
      const { view, params } = resolveLocation(hub.path);
      expect(view, hub.path).toBe('gallery');
      expect(params.hub, hub.path).toBeTruthy();
      expect(params.slug, hub.path).toBeUndefined();
      expect(resolveHub(params.hub)?.id, hub.path).toBe(hub.id);
    }
  });

  it('/gallery/at-war and /gallery/most-alive are HUBS, never dossier slugs', () => {
    expect(resolveLocation('/gallery/at-war').params).toEqual({ hub: { facet: 'at-war' } });
    expect(resolveLocation('/gallery/most-alive').params).toEqual({ hub: { facet: 'most-alive' } });
  });

  it('a real dossier slug still resolves as a slug', () => {
    const { view, params } = resolveLocation('/gallery/abc123xyz');
    expect(view).toBe('gallery');
    expect(params).toEqual({ slug: 'abc123xyz' });
  });

  it('an unknown hub value resolves to the gallery view with a hub param resolveHub rejects (in-page not-found)', () => {
    const { params } = resolveLocation('/gallery/terrain/lava_fields');
    expect(params.hub).toEqual({ facet: 'terrain', value: 'lava_fields' });
    expect(resolveHub(params.hub)).toBeNull();
  });

  it('viewToPath round-trips every hub (back/forward + canonical URLs)', () => {
    for (const hub of GALLERY_HUBS) {
      const { params } = resolveLocation(hub.path);
      expect(viewToPath('gallery', params)).toBe(hub.path);
    }
  });
});

describe('crawlability posture', () => {
  it('the gallery view is neither guarded, noindexed, nor retired — hubs render for anon crawlers', () => {
    expect(NOINDEX_VIEWS.has('gallery')).toBe(false);
    expect(RETIRED_VIEWS.has('gallery')).toBe(false);
  });
});
