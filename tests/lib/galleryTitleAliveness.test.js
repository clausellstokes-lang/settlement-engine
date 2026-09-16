/**
 * galleryTitleAliveness.test.js — the write-path branches for the gallery
 * title + aliveness snapshot (GALLERY-2 phase 2, migration 147), pinned through
 * updateGalleryMetadata (which returns the applied patch — the merge-patch
 * contract's observable).
 *
 * What matters:
 *   • MERGE-PATCH: omission preserves (no gallery_title / gallery_facet_aliveness
 *     key in the patch); explicit empty clears (null).
 *   • the title is sanitized like the blurb (same DOMPurify pass) then reduced
 *     to plain bounded text — markup NEVER reaches the column.
 *   • aliveness clamps to an integer 0–100; a non-finite value writes null
 *     (a save that left its campaign sheds its stale liveness claim).
 */
import { describe, it, expect, vi, afterEach } from 'vitest';

vi.mock('../../src/lib/supabase.js', () => {
  const builder = { update: vi.fn().mockReturnThis(), eq: vi.fn().mockResolvedValue({ error: null }) };
  return {
    supabase: { from: vi.fn(() => builder), rpc: vi.fn(() => Promise.resolve({ data: [], error: null })) },
    isConfigured: true,
  };
});

import { updateGalleryMetadata } from '../../src/lib/gallery.js';

afterEach(() => vi.clearAllMocks());

describe('galleryMetadataPatch — title branch (migration 147)', () => {
  it('MERGE-PATCH: an omitted title never touches the column', async () => {
    const patch = await updateGalleryMetadata('id-1', { description: 'hello' });
    expect('gallery_title' in patch).toBe(false);
  });

  it('writes a plain-text title, trimmed and bounded to 120 chars', async () => {
    const patch = await updateGalleryMetadata('id-1', { title: '  The Bastion of Thornwick  ' });
    expect(patch.gallery_title).toBe('The Bastion of Thornwick');
    const long = await updateGalleryMetadata('id-1', { title: 'x'.repeat(500) });
    expect(long.gallery_title).toHaveLength(120);
  });

  it('sanitizes like the blurb: NO markup survives — the stored title is inert plain text', async () => {
    const patch = await updateGalleryMetadata('id-1', {
      title: '<script>alert(1)</script><b>Thornwick</b> <img src=x onerror=alert(1)> Keep',
    });
    // The invariant: no tags/attributes remain (angle brackets gone), so the
    // column can never carry executable or renderable markup. (In a DOM-less
    // env the sanitizer's inert-text fallback may keep a tag's TEXT content —
    // harmless plain text; in the browser DOMPurify drops script bodies too.)
    expect(patch.gallery_title).not.toMatch(/[<>]/);
    expect(patch.gallery_title).not.toMatch(/onerror\s*=/i);
    expect(patch.gallery_title).toContain('Thornwick');
    expect(patch.gallery_title).toContain('Keep');
  });

  it('explicit empty clears (null → the server falls back to settlements.name)', async () => {
    expect((await updateGalleryMetadata('id-1', { title: '' })).gallery_title).toBeNull();
    expect((await updateGalleryMetadata('id-1', { title: '   ' })).gallery_title).toBeNull();
    expect((await updateGalleryMetadata('id-1', { title: 42 })).gallery_title).toBeNull();
  });
});

describe('galleryMetadataPatch — aliveness branch (migration 147)', () => {
  it('MERGE-PATCH: omitted aliveness never touches the column', async () => {
    const patch = await updateGalleryMetadata('id-1', { facetAtWar: true });
    expect('gallery_facet_aliveness' in patch).toBe(false);
    expect(patch.gallery_facet_at_war).toBe(true);
  });

  it('clamps to an integer 0–100', async () => {
    expect((await updateGalleryMetadata('id-1', { facetAliveness: 87 })).gallery_facet_aliveness).toBe(87);
    expect((await updateGalleryMetadata('id-1', { facetAliveness: 87.6 })).gallery_facet_aliveness).toBe(88);
    expect((await updateGalleryMetadata('id-1', { facetAliveness: -3 })).gallery_facet_aliveness).toBe(0);
    expect((await updateGalleryMetadata('id-1', { facetAliveness: 9001 })).gallery_facet_aliveness).toBe(100);
  });

  it('a non-finite score writes null (stale liveness sheds when a save leaves its campaign)', async () => {
    expect((await updateGalleryMetadata('id-1', { facetAliveness: null })).gallery_facet_aliveness).toBeNull();
    expect((await updateGalleryMetadata('id-1', { facetAliveness: NaN })).gallery_facet_aliveness).toBeNull();
    expect((await updateGalleryMetadata('id-1', { facetAliveness: 'alive' })).gallery_facet_aliveness).toBeNull();
  });
});
