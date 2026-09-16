/**
 * tests/lib/galleryImport.test.js — W4c gallery-import client contract.
 *
 * Pins the two client halves of the gallery-import + share-opt-in wave:
 *   1. fetchDossierForImport dispatches the server-gated import_gallery_dossier
 *      RPC and strips the confidential keys (seed / DM scratch) client-side.
 *   2. The share opt-in PERSISTS: updateGalleryMetadata writes gallery_importable
 *      + the facet snapshot columns + the realm-arc digest when the caller opts
 *      in (previously these never round-tripped to the settlements row).
 */

import { describe, it, expect, vi, afterEach } from 'vitest';

vi.mock('../../src/lib/supabase.js', () => {
  const mockSupabase = {
    from: vi.fn(),
    rpc: vi.fn(() => Promise.resolve({ data: [], error: null })),
  };
  return { supabase: mockSupabase, isConfigured: true };
});

import { supabase } from '../../src/lib/supabase.js';
import { fetchDossierForImport, updateGalleryMetadata } from '../../src/lib/gallery.js';

afterEach(() => vi.clearAllMocks());

describe('gallery.js — fetchDossierForImport (import RPC)', () => {
  it('calls import_gallery_dossier with the slug and returns {id,name,tier,settlement}', async () => {
    supabase.rpc.mockResolvedValueOnce({
      data: [{ id: 's1', name: 'Riverwatch', tier: 'town', data: { name: 'Riverwatch', config: { culture: 'norse' } } }],
      error: null,
    });
    const out = await fetchDossierForImport('slug-123');
    expect(supabase.rpc).toHaveBeenCalledWith('import_gallery_dossier', { dossier_slug: 'slug-123' });
    expect(out).toMatchObject({ id: 's1', name: 'Riverwatch', tier: 'town' });
    expect(out.settlement.config.culture).toBe('norse');
  });

  it('strips the generation seed and DM scratch from the import payload (defense in depth)', async () => {
    supabase.rpc.mockResolvedValueOnce({
      data: [{
        id: 's1', name: 'Riverwatch', tier: 'town',
        data: {
          name: 'Riverwatch',
          _seed: 42, seed: 42, _config: { raw: true },
          config: { culture: 'norse', _seed: 99 },
          dmNotes: 'secret', dossierNotes: 'x', narrativeNotes: 'y',
        },
      }],
      error: null,
    });
    const out = await fetchDossierForImport('slug-123');
    const s = out.settlement;
    expect(s._seed).toBeUndefined();
    expect(s.seed).toBeUndefined();
    expect(s._config).toBeUndefined();
    expect(s.config._seed).toBeUndefined();
    expect(s.dmNotes).toBeUndefined();
    expect(s.dossierNotes).toBeUndefined();
    expect(s.narrativeNotes).toBeUndefined();
    // Non-confidential display facets survive.
    expect(s.config.culture).toBe('norse');
  });

  it('returns null when the RPC yields no importable row (not opted-in / anon)', async () => {
    supabase.rpc.mockResolvedValueOnce({ data: [], error: null });
    expect(await fetchDossierForImport('slug-x')).toBeNull();
  });

  it('throws on RPC error', async () => {
    supabase.rpc.mockResolvedValueOnce({ data: null, error: { message: 'not importable' } });
    await expect(fetchDossierForImport('slug-x')).rejects.toThrow('not importable');
  });
});

describe('gallery.js — share opt-in persists (updateGalleryMetadata patch)', () => {
  it('writes gallery_importable + facet snapshot + realm-arc digest when opted in', async () => {
    const updateSpy = vi.fn().mockReturnThis();
    const eqSpy = vi.fn().mockResolvedValue({ error: null });
    supabase.from.mockImplementationOnce(() => ({ update: updateSpy, eq: eqSpy }));

    await updateGalleryMetadata('settlement-uuid', {
      description: 'A public hook.',
      importable: true,
      facetCulture: 'norse',
      facetProsperity: 'Wealthy',
      facetDeity: 'Moradin',
      facetAtWar: true,
      realmArcSummary: 'War came to the vale.',
    });

    expect(supabase.from).toHaveBeenCalledWith('settlements');
    const patch = updateSpy.mock.calls[0][0];
    expect(patch.gallery_importable).toBe(true);
    expect(patch.gallery_facet_culture).toBe('norse');
    expect(patch.gallery_facet_prosperity).toBe('Wealthy');
    expect(patch.gallery_facet_deity).toBe('Moradin');
    expect(patch.gallery_facet_at_war).toBe(true);
    expect(patch.gallery_realm_arc_summary).toBe('War came to the vale.');
    expect(eqSpy).toHaveBeenCalledWith('id', 'settlement-uuid');
  });

  it('omits the opt-in columns entirely when the caller does not provide them (merge-safe)', async () => {
    const updateSpy = vi.fn().mockReturnThis();
    const eqSpy = vi.fn().mockResolvedValue({ error: null });
    supabase.from.mockImplementationOnce(() => ({ update: updateSpy, eq: eqSpy }));

    await updateGalleryMetadata('settlement-uuid', { description: 'Just a description.' });

    const patch = updateSpy.mock.calls[0][0];
    expect('gallery_importable' in patch).toBe(false);
    expect('gallery_facet_culture' in patch).toBe(false);
    expect('gallery_realm_arc_summary' in patch).toBe(false);
  });

  it('nulls an empty facet string rather than storing "" (facet columns stay clean)', async () => {
    const updateSpy = vi.fn().mockReturnThis();
    const eqSpy = vi.fn().mockResolvedValue({ error: null });
    supabase.from.mockImplementationOnce(() => ({ update: updateSpy, eq: eqSpy }));

    await updateGalleryMetadata('settlement-uuid', {
      importable: false, facetCulture: '', facetDeity: '', facetAtWar: false, realmArcSummary: '',
    });

    const patch = updateSpy.mock.calls[0][0];
    expect(patch.gallery_importable).toBe(false);
    expect(patch.gallery_facet_culture).toBeNull();
    expect(patch.gallery_facet_deity).toBeNull();
    expect(patch.gallery_facet_at_war).toBe(false);
    expect(patch.gallery_realm_arc_summary).toBeNull();
  });
});
