/** @vitest-environment jsdom */
/**
 * tests/lib/galleryTagsClamp.test.js — gallery_tags clamped on READ.
 *
 * gallery_tags has no server/DB scrub: like gallery_description, RLS lets an
 * owner write the array straight to the settlements table, bypassing the JS
 * write-side clamp. The READ normalizers (sanitizeTile → tile, sanitizeDossier →
 * dossier) are the chokepoint that must lower-case, strip, length-bound, and
 * count-cap the surfaced tags regardless of the stored value — so a card, filter
 * chip, or PDF can never render markup or an unbounded blob from a drifted row.
 */

import { describe, it, expect, vi, afterEach } from 'vitest';

vi.mock('../../src/lib/supabase.js', () => ({
  supabase: {
    from: vi.fn(),
    rpc: vi.fn(() => Promise.resolve({ data: [], error: null })),
  },
  isConfigured: true,
}));

import { supabase } from '../../src/lib/supabase.js';
import { fetchPublicDossier, fetchPublicGallery } from '../../src/lib/gallery.js';

afterEach(() => vi.clearAllMocks());

function queueDossierRow(row) {
  supabase.rpc
    .mockResolvedValueOnce({ data: [row], error: null })            // get_gallery_dossier
    .mockResolvedValueOnce({ data: null, error: null })             // bump_public_view
    .mockResolvedValueOnce({ data: [{ net_votes: 0, voted: false }], error: null }) // vote state
    .mockResolvedValueOnce({ data: [], error: null });              // more by creator
}

const baseRow = () => ({
  id: '1', public_slug: 's1', name: 'Bramblefen', tier: 'town',
  data: { name: 'Bramblefen', population: 1200 },
  published_at: '2026-01-01', view_count: 3,
});

// A raw owner write that never went through the write-side clamp: a markup tag,
// an over-long blob, mixed case, and far more than the count cap.
const RAW_TAGS = [
  '<img src=x onerror=alert(1)>',                    // markup → stripped
  'A'.repeat(200),                                    // unbounded → length-capped
  'CoastalPort',                                      // mixed case → lower-cased
  '   spaced  ',                                      // trimmed
  '',                                                 // empty → dropped
  ...Array.from({ length: 30 }, (_, i) => `t${i}`),  // overflow → count-capped
];

describe('gallery_tags — clamped on READ (defense-in-depth-at-rest)', () => {
  it('clamps tags from the DOSSIER normalizer', async () => {
    queueDossierRow({ ...baseRow(), gallery_tags: RAW_TAGS });
    const { tags } = await fetchPublicDossier('s1');
    expect(tags.length).toBeLessThanOrEqual(12);
    // No angle brackets / markup survives.
    expect(tags.join('|')).not.toMatch(/[<>]/);
    // Every tag is lower-cased and length-bounded.
    for (const tag of tags) {
      expect(tag).toBe(tag.toLowerCase());
      expect(tag.length).toBeLessThanOrEqual(40);
      expect(tag).not.toBe('');
    }
    // The well-formed value survives (lower-cased).
    expect(tags).toContain('coastalport');
  });

  it('clamps tags from the TILE normalizer', async () => {
    supabase.rpc.mockResolvedValueOnce({
      data: [{
        id: '1', public_slug: 's1', name: 'Bramblefen', tier: 'town',
        gallery_tags: RAW_TAGS,
        total_count: 1,
      }],
      error: null,
    }); // list_gallery_dossiers
    const { items } = await fetchPublicGallery({ page: 0, pageSize: 24 });
    expect(items).toHaveLength(1);
    const tags = items[0].tags;
    expect(tags.length).toBeLessThanOrEqual(12);
    expect(tags.join('|')).not.toMatch(/[<>]/);
    for (const tag of tags) {
      expect(tag.length).toBeLessThanOrEqual(40);
    }
  });

  it('returns an empty array for a non-array tags column', async () => {
    queueDossierRow({ ...baseRow(), gallery_tags: 'not-an-array' });
    expect((await fetchPublicDossier('s1')).tags).toEqual([]);
  });
});
