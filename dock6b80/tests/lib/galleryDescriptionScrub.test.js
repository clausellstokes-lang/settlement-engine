/** @vitest-environment jsdom */
/**
 * tests/lib/galleryDescriptionScrub.test.js — gallery_description scrub on READ.
 *
 * gallery_description is sanitized rich-text HTML, but there is no server/DB
 * scrub: RLS lets an owner write raw HTML straight to the settlements table via
 * a direct update, bypassing the JS sanitize-on-write. The READ normalizers
 * (sanitizeTile → tile, sanitizeDossier → dossier) are the chokepoint that must
 * make the surfaced `description` HTML-safe regardless of the stored value, so
 * any downstream consumer (card, dossier, PDF, json export) is covered even if
 * it forgets to sanitize at the render sink.
 *
 * jsdom env: sanitizeGalleryHtml needs a real DOM for the DOMPurify allowlist.
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

// A raw owner write that never went through sanitize-on-write: an image with an
// onerror handler — the classic stored-XSS vector.
const RAW_XSS = '<img src=x onerror="alert(document.cookie)">A fine town.';

describe('gallery_description — sanitized on READ (defense-in-depth-at-rest)', () => {
  it('scrubs a raw <img onerror> from the DOSSIER description normalizer', async () => {
    queueDossierRow({ ...baseRow(), gallery_description: RAW_XSS });
    const dossier = await fetchPublicDossier('s1');
    // No live event handler survives the read normalizer.
    expect(dossier.description).not.toMatch(/onerror/i);
    expect(dossier.description).not.toMatch(/<img/i);
    // The benign text body is preserved.
    expect(dossier.description).toMatch(/A fine town\./);
  });

  it('scrubs a raw <img onerror> from the TILE description normalizer', async () => {
    supabase.rpc.mockResolvedValueOnce({
      data: [{
        id: '1', public_slug: 's1', name: 'Bramblefen', tier: 'town',
        gallery_description: RAW_XSS,
        total_count: 1,
      }],
      error: null,
    }); // list_gallery_dossiers
    const { items } = await fetchPublicGallery({ page: 0, pageSize: 24 });
    expect(items).toHaveLength(1);
    expect(items[0].description).not.toMatch(/onerror/i);
    expect(items[0].description).not.toMatch(/<img/i);
    expect(items[0].description).toMatch(/A fine town\./);
  });

  it('strips a raw <script> tag the owner wrote directly', async () => {
    queueDossierRow({ ...baseRow(), gallery_description: '<script>steal()</script>hello' });
    const dossier = await fetchPublicDossier('s1');
    expect(dossier.description).not.toMatch(/<script/i);
    expect(dossier.description).not.toMatch(/steal\(\)/);
    expect(dossier.description).toMatch(/hello/);
  });

  it('preserves the allowed rich-text formatting set', async () => {
    queueDossierRow({ ...baseRow(), gallery_description: '<p><strong>Bold</strong> and <em>italic</em>.</p>' });
    const dossier = await fetchPublicDossier('s1');
    expect(dossier.description).toMatch(/<strong>Bold<\/strong>/);
    expect(dossier.description).toMatch(/<em>italic<\/em>/);
  });

  it('returns an empty string for a missing description column', async () => {
    queueDossierRow(baseRow());
    expect((await fetchPublicDossier('s1')).description).toBe('');
  });
});
