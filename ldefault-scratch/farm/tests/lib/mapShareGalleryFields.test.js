/**
 * tests/lib/mapShareGalleryFields.test.js — edit-after-publish data-loss guards
 * for the maps share editor (lib/gallery.js).
 *
 * The campaign-load SELECT deliberately omits the 088 gallery columns (cover, alt,
 * importable, world sections), so the share editor must seed its edit draft from a
 * DEDICATED owner-scoped fetch (fetchCampaignGalleryFields). Without that seed,
 * "Save gallery details" would null the saved cover and re-enable every world
 * section. These tests pin:
 *   1. the dedicated seed fetch (shape + graceful pre-088 failure),
 *   2. the cover PRESERVE-ON-OMIT in galleryMapMetadataPatch (a mis-seed can never
 *      null an existing cover; gallery_importable is written when provided),
 *   3. the shared tag clamp (shareMap clamps p_tags like the edit/read paths).
 */

import { describe, it, expect, vi, afterEach } from 'vitest';

vi.mock('../../src/lib/supabase.js', () => {
  const mockSupabase = {
    from: vi.fn(),
    rpc: vi.fn(() => Promise.resolve({ data: 'slug-1', error: null })),
  };
  return { supabase: mockSupabase, isConfigured: true };
});

import { supabase } from '../../src/lib/supabase.js';
import {
  fetchCampaignGalleryFields,
  updateMapGalleryMetadata,
  shareMap,
} from '../../src/lib/gallery.js';

afterEach(() => vi.clearAllMocks());

const CAMPAIGN_ID = '11111111-2222-3333-4444-555555555555';

// A from() builder whose terminal maybeSingle / update->eq resolves to the given
// response, recording the update patch when present.
function builderFor(response, capture = {}) {
  const builder = {};
  builder.select = vi.fn().mockReturnValue(builder);
  builder.eq = vi.fn().mockReturnValue(builder);
  builder.maybeSingle = vi.fn().mockResolvedValue(response);
  builder.update = vi.fn().mockImplementation(patch => { capture.patch = patch; return builder; });
  // update().eq() resolves to the response; the editor awaits the chain.
  builder.eq = vi.fn().mockImplementation(() => {
    if (capture.patch !== undefined) return Promise.resolve(response);
    return builder;
  });
  return builder;
}

describe('fetchCampaignGalleryFields — dedicated owner-scoped seed', () => {
  it('selects ONLY the gallery columns and maps the row to a draft seed', async () => {
    const select = vi.fn().mockReturnThis();
    const eq = vi.fn().mockReturnThis();
    const maybeSingle = vi.fn().mockResolvedValue({
      data: {
        gallery_image_url: 'https://cdn.test/cover.png',
        gallery_image_alt: 'Map of Eldermoor',
        gallery_importable: true,
        gallery_world_sections: ['worldClock', 'pantheon'],
        gallery_share_world: true,
        gallery_description: 'A coastal realm.',
        gallery_tags: ['Coastal', 'at war'],
      },
      error: null,
    });
    supabase.from.mockReturnValueOnce({ select, eq, maybeSingle });

    const seed = await fetchCampaignGalleryFields(CAMPAIGN_ID);

    expect(supabase.from).toHaveBeenCalledWith('saved_maps');
    // ONLY the gallery columns — the per-page campaign-load SELECT must stay separate.
    const cols = select.mock.calls[0][0];
    expect(cols).toContain('gallery_image_url');
    expect(cols).toContain('gallery_importable');
    expect(cols).toContain('gallery_world_sections');
    expect(cols).not.toMatch(/map_data|map_seed|burg_settlement_map/);
    expect(eq).toHaveBeenCalledWith('id', CAMPAIGN_ID);

    expect(seed).toEqual({
      imageUrl: 'https://cdn.test/cover.png',
      imageAlt: 'Map of Eldermoor',
      importable: true,
      worldSections: ['worldClock', 'pantheon'],
      shareWorld: true,
      description: 'A coastal realm.',
      tags: ['coastal', 'at war'],
    });
  });

  it('returns null GRACEFULLY when the columns do not exist yet (pre-088 error)', async () => {
    const select = vi.fn().mockReturnThis();
    const eq = vi.fn().mockReturnThis();
    const maybeSingle = vi.fn().mockResolvedValue({
      data: null,
      error: { message: 'column saved_maps.gallery_world_sections does not exist' },
    });
    supabase.from.mockReturnValueOnce({ select, eq, maybeSingle });

    await expect(fetchCampaignGalleryFields(CAMPAIGN_ID)).resolves.toBeNull();
  });

  it('returns null when the query throws (never breaks the editor)', async () => {
    supabase.from.mockImplementationOnce(() => { throw new Error('boom'); });
    await expect(fetchCampaignGalleryFields(CAMPAIGN_ID)).resolves.toBeNull();
  });

  it('treats absent world_sections as null (seed unknown ⇒ editor keeps all on)', async () => {
    const select = vi.fn().mockReturnThis();
    const eq = vi.fn().mockReturnThis();
    const maybeSingle = vi.fn().mockResolvedValue({
      data: { gallery_image_url: '', gallery_importable: false, gallery_world_sections: null },
      error: null,
    });
    supabase.from.mockReturnValueOnce({ select, eq, maybeSingle });
    const seed = await fetchCampaignGalleryFields(CAMPAIGN_ID);
    expect(seed.worldSections).toBeNull();
    expect(seed.importable).toBe(false);
  });
});

describe('galleryMapMetadataPatch — cover PRESERVE-ON-OMIT (via updateMapGalleryMetadata)', () => {
  // REPRODUCING the HIGH "cover destroyed on edit": a save whose imageUrl is empty
  // (e.g. the draft mounted before the persisted cover was seeded) must NOT write
  // gallery_image_url at all, so it cannot null the saved cover.
  it('omits gallery_image_url entirely when imageUrl is empty', async () => {
    const capture = {};
    supabase.from.mockReturnValueOnce(builderFor({ error: null }, capture));
    await updateMapGalleryMetadata(CAMPAIGN_ID, { imageUrl: '', description: 'x' });
    expect(capture.patch).not.toHaveProperty('gallery_image_url');
  });

  it('omits gallery_image_url for a whitespace-only imageUrl', async () => {
    const capture = {};
    supabase.from.mockReturnValueOnce(builderFor({ error: null }, capture));
    await updateMapGalleryMetadata(CAMPAIGN_ID, { imageUrl: '   ' });
    expect(capture.patch).not.toHaveProperty('gallery_image_url');
  });

  it('writes the sanitized cover when a non-empty https url is provided', async () => {
    const capture = {};
    supabase.from.mockReturnValueOnce(builderFor({ error: null }, capture));
    await updateMapGalleryMetadata(CAMPAIGN_ID, { imageUrl: 'https://cdn.test/c.png' });
    expect(capture.patch.gallery_image_url).toBe('https://cdn.test/c.png');
  });

  it('nulls an unsafe non-empty url (still an explicit set, not a preserve)', async () => {
    const capture = {};
    supabase.from.mockReturnValueOnce(builderFor({ error: null }, capture));
    await updateMapGalleryMetadata(CAMPAIGN_ID, { imageUrl: 'javascript:alert(1)' });
    expect(capture.patch.gallery_image_url).toBeNull();
  });

  it('writes gallery_importable when provided, omits it otherwise', async () => {
    const c1 = {};
    supabase.from.mockReturnValueOnce(builderFor({ error: null }, c1));
    await updateMapGalleryMetadata(CAMPAIGN_ID, { importable: true });
    expect(c1.patch.gallery_importable).toBe(true);

    const c2 = {};
    supabase.from.mockReturnValueOnce(builderFor({ error: null }, c2));
    await updateMapGalleryMetadata(CAMPAIGN_ID, { description: 'x' });
    expect(c2.patch).not.toHaveProperty('gallery_importable');
  });
});

describe('shareMap — clamps p_tags like the edit + read paths', () => {
  // REPRODUCING the MED "shareMap does not clamp tags": the publish path used to
  // send a raw slice(0,12), so a markup / over-long / mixed-case / uncapped tag
  // shipped unclamped at first publish while edit + read clamped.
  const RAW_TAGS = [
    '<img src=x onerror=alert(1)>',                    // markup → stripped
    'A'.repeat(200),                                    // unbounded → length-capped
    'CoastalPort',                                      // mixed case → lower-cased
    '   spaced  ',                                      // trimmed
    '',                                                 // empty → dropped
    ...Array.from({ length: 30 }, (_, i) => `t${i}`),  // overflow → count-capped
  ];

  it('clamps p_tags on publish', async () => {
    supabase.rpc.mockResolvedValueOnce({ data: 'slug-1', error: null });
    await shareMap(CAMPAIGN_ID, { tags: RAW_TAGS });
    const params = supabase.rpc.mock.calls[0][1];
    const tags = params.p_tags;
    expect(tags.length).toBeLessThanOrEqual(12);
    expect(tags.join('|')).not.toMatch(/[<>]/);
    for (const tag of tags) {
      expect(tag).toBe(tag.toLowerCase());
      expect(tag.length).toBeLessThanOrEqual(40);
      expect(tag).not.toBe('');
    }
    expect(tags).toContain('coastalport');
  });

  it('sends null p_tags when the clamp yields nothing', async () => {
    supabase.rpc.mockResolvedValueOnce({ data: 'slug-1', error: null });
    await shareMap(CAMPAIGN_ID, { tags: ['<>', '   '] });
    expect(supabase.rpc.mock.calls[0][1].p_tags).toBeNull();
  });
});
