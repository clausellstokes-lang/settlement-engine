/**
 * galleryCampaignFacets.test.js — the campaign-side aliveness/world-age seam
 * (GALLERY-2 phase 2, migrations 147/149).
 *
 * Pins:
 *   • campaignFacets carries aliveness + worldAge from the SAME shared
 *     derivations the settlement path uses (lib/galleryAliveness.js), so the
 *     two publish snapshots can never diverge.
 *   • galleryMapMetadataPatch (via updateMapGalleryMetadata's returned patch)
 *     writes gallery_facet_aliveness / gallery_facet_world_age with the twin
 *     clamps (0–100 int; canonical band vocabulary; null = unknown), and
 *     preserves on omission.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';

vi.mock('../../../src/lib/supabase.js', () => {
  const builder = { update: vi.fn().mockReturnThis(), eq: vi.fn().mockResolvedValue({ error: null }) };
  return {
    supabase: { from: vi.fn(() => builder), rpc: vi.fn(() => Promise.resolve({ data: [], error: null })) },
    isConfigured: true,
  };
});

import { campaignFacets } from '../../../src/components/gallery/galleryMapsUtils.js';
import { computeAliveness, campaignWorldAgeBand } from '../../../src/lib/galleryAliveness.js';
import { updateMapGalleryMetadata } from '../../../src/lib/gallery.js';

afterEach(() => vi.clearAllMocks());

const campaign = (pulses, elapsedWeeks) => ({
  worldState: {
    pulseHistory: Array.from({ length: pulses }, (_, i) => ({ id: `p${i}` })),
    tick: elapsedWeeks,
    calendar: { elapsedWeeks },
  },
});

describe('campaignFacets — the phase-2 keys (147/149)', () => {
  it('derives aliveness + worldAge through the SHARED module (no fork, no drift)', () => {
    const c = campaign(40, 29);
    const facets = campaignFacets(c, []);
    expect(facets.aliveness).toBe(computeAliveness(c));
    expect(facets.worldAge).toBe(campaignWorldAgeBand(c));
    expect(facets.worldAge).toBe('this-year'); // 29 weeks → this-year band
  });

  it('a world-less campaign reads null for both (unknown, never zero/fresh)', () => {
    const facets = campaignFacets({}, []);
    expect(facets.aliveness).toBeNull();
    expect(facets.worldAge).toBeNull();
    // The 088 keys are untouched by the phase-2 additions.
    expect(facets).toMatchObject({ memberBand: 'hamlet-cluster', atWar: false });
  });
});

describe('galleryMapMetadataPatch — the phase-2 branches (edit-after-publish twin)', () => {
  it('writes clamped aliveness + vocabulary-checked worldAge', async () => {
    const patch = await updateMapGalleryMetadata('map-id', { aliveness: 87.4, worldAge: 'this-season' });
    expect(patch.gallery_facet_aliveness).toBe(87);
    expect(patch.gallery_facet_world_age).toBe('this-season');
  });

  it('clamps out-of-range and rejects an unknown band to null', async () => {
    const patch = await updateMapGalleryMetadata('map-id', { aliveness: 9001, worldAge: 'the-before-times' });
    expect(patch.gallery_facet_aliveness).toBe(100);
    expect(patch.gallery_facet_world_age).toBeNull();
  });

  it('MERGE-PATCH: omission never touches the columns; explicit null clears', async () => {
    const omitted = await updateMapGalleryMetadata('map-id', { description: 'x' });
    expect('gallery_facet_aliveness' in omitted).toBe(false);
    expect('gallery_facet_world_age' in omitted).toBe(false);
    const cleared = await updateMapGalleryMetadata('map-id', { aliveness: null, worldAge: null });
    expect(cleared.gallery_facet_aliveness).toBeNull();
    expect(cleared.gallery_facet_world_age).toBeNull();
  });
});
