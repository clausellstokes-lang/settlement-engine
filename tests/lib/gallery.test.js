/**
 * tests/lib/gallery.test.js — Gallery client API + Tier 8.1 curation contract.
 *
 * These tests stub the supabase client and verify the gallery.js library
 * dispatches the right RPC / table calls and sanitizes responses
 * correctly. The actual SQL is exercised by pgTAP server-side.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

vi.mock('../../src/lib/supabase.js', () => {
  const queryBuilder = (mockResponse) => {
    const builder = {};
    const methods = ['select', 'eq', 'order', 'range', 'maybeSingle'];
    for (const m of methods) {
      builder[m] = vi.fn().mockReturnValue(builder);
    }
    builder.then = (resolve) => resolve(mockResponse);
    return builder;
  };

  const mockSupabase = {
    from: vi.fn(() => queryBuilder({ data: [], error: null, count: 0 })),
    rpc: vi.fn(() => Promise.resolve({ data: [], error: null })),
  };

  return {
    supabase: mockSupabase,
    isConfigured: true,
  };
});

import { supabase } from '../../src/lib/supabase.js';
import {
  publishSettlement, unpublishSettlement,
  fetchPublicGallery, fetchPublicDossier,
  fetchCuratedGallery, setCurated,
} from '../../src/lib/gallery.js';

afterEach(() => vi.clearAllMocks());

describe('gallery.js — publish/unpublish (RPC)', () => {
  it('publishSettlement calls publish_settlement and returns the slug', async () => {
    supabase.rpc.mockResolvedValueOnce({ data: 'abc123', error: null });
    const slug = await publishSettlement('settlement-uuid');
    expect(supabase.rpc).toHaveBeenCalledWith('publish_settlement', { target_id: 'settlement-uuid' });
    expect(slug).toBe('abc123');
  });

  it('publishSettlement throws on RPC error', async () => {
    supabase.rpc.mockResolvedValueOnce({ data: null, error: { message: 'Not owned' } });
    await expect(publishSettlement('x')).rejects.toThrow('Not owned');
  });

  it('unpublishSettlement calls unpublish_settlement', async () => {
    supabase.rpc.mockResolvedValueOnce({ data: null, error: null });
    await unpublishSettlement('settlement-uuid');
    expect(supabase.rpc).toHaveBeenCalledWith('unpublish_settlement', { target_id: 'settlement-uuid' });
  });
});

describe('gallery.js — fetchPublicGallery (community listing)', () => {
  beforeEach(() => {
    // Reset to a clean builder for each test so we can assert sequence.
    supabase.from.mockImplementation(() => {
      const builder = {
        select: vi.fn().mockReturnThis(),
        eq:     vi.fn().mockReturnThis(),
        order:  vi.fn().mockReturnThis(),
        range:  vi.fn().mockResolvedValue({
          data: [
            { id: '1', public_slug: 's1', name: 'Bramblefen', tier: 'town',
              published_at: '2025-01-01', view_count: 5, is_curated: false },
          ],
          error: null,
          count: 1,
        }),
      };
      return builder;
    });
  });

  it('defaults to excluding curated dossiers from the community grid', async () => {
    const builder = supabase.from('settlements');
    supabase.from.mockReturnValueOnce(builder);
    await fetchPublicGallery({ page: 0 });
    // Two .eq() calls should fire: is_public + is_curated.
    expect(builder.eq).toHaveBeenCalledWith('is_public', true);
    expect(builder.eq).toHaveBeenCalledWith('is_curated', false);
  });

  it('can be told to include curated tiles via excludeCurated=false', async () => {
    const builder = supabase.from('settlements');
    supabase.from.mockReturnValueOnce(builder);
    await fetchPublicGallery({ page: 0, excludeCurated: false });
    // Only the is_public filter should fire — no is_curated filter.
    const eqCalls = builder.eq.mock.calls;
    expect(eqCalls.some(c => c[0] === 'is_public')).toBe(true);
    expect(eqCalls.some(c => c[0] === 'is_curated')).toBe(false);
  });

  it('sanitizes rows to a tile shape (drops user_id, hides DB column names)', async () => {
    const { items } = await fetchPublicGallery({ page: 0 });
    expect(items[0]).toEqual({
      id: '1', slug: 's1', name: 'Bramblefen', tier: 'town',
      publishedAt: '2025-01-01', viewCount: 5, curated: false,
    });
    // Defense-in-depth: the row's `user_id` (if it leaked) must not
    // appear anywhere in the sanitized tile.
    expect(Object.keys(items[0])).not.toContain('user_id');
  });

  it('returns empty when supabase is not configured', async () => {
    vi.doMock('../../src/lib/supabase.js', () => ({
      supabase: {}, isConfigured: false,
    }));
    vi.resetModules();
    const { fetchPublicGallery: fn } = await import('../../src/lib/gallery.js');
    const res = await fn({ page: 0 });
    expect(res.items).toEqual([]);
    expect(res.hasMore).toBe(false);
    vi.doUnmock('../../src/lib/supabase.js');
  });
});

describe('gallery.js — fetchCuratedGallery (Tier 8.1)', () => {
  it('calls list_curated_dossiers RPC and returns curated tiles', async () => {
    supabase.rpc.mockResolvedValueOnce({
      data: [
        { id: 'c1', public_slug: 'cur1', name: 'Mossgate', tier: 'town',
          published_at: '2025-01-02', view_count: 12, curated_order: 1 },
        { id: 'c2', public_slug: 'cur2', name: 'Black Crag', tier: 'city',
          published_at: '2025-01-03', view_count: 8, curated_order: 2 },
      ],
      error: null,
    });
    const items = await fetchCuratedGallery();
    expect(supabase.rpc).toHaveBeenCalledWith('list_curated_dossiers');
    expect(items).toHaveLength(2);
    expect(items[0]).toEqual({
      id: 'c1', slug: 'cur1', name: 'Mossgate', tier: 'town',
      publishedAt: '2025-01-02', viewCount: 12, curated: true,
    });
  });

  it('returns [] on RPC error rather than throwing', async () => {
    supabase.rpc.mockResolvedValueOnce({ data: null, error: { message: 'network' } });
    const items = await fetchCuratedGallery();
    expect(items).toEqual([]);
  });

  it('every curated tile has curated:true set', async () => {
    supabase.rpc.mockResolvedValueOnce({
      data: [{ id: '1', public_slug: 'a', name: 'A', tier: 'town', published_at: null, view_count: 0, curated_order: null }],
      error: null,
    });
    const items = await fetchCuratedGallery();
    expect(items.every(t => t.curated === true)).toBe(true);
  });
});

describe('gallery.js — setCurated (admin RPC)', () => {
  it('calls set_curated with target + curated + sort_order', async () => {
    supabase.rpc.mockResolvedValueOnce({ data: null, error: null });
    await setCurated('settlement-uuid', true, 5);
    expect(supabase.rpc).toHaveBeenCalledWith('set_curated', {
      target_id:  'settlement-uuid',
      curated:    true,
      sort_order: 5,
    });
  });

  it('passes null as sort_order by default', async () => {
    supabase.rpc.mockResolvedValueOnce({ data: null, error: null });
    await setCurated('settlement-uuid', false);
    expect(supabase.rpc).toHaveBeenCalledWith('set_curated', {
      target_id:  'settlement-uuid',
      curated:    false,
      sort_order: null,
    });
  });

  it('throws when the RPC returns an error (so the admin UI can surface it)', async () => {
    supabase.rpc.mockResolvedValueOnce({ data: null, error: { message: 'Only admins can change curation status' } });
    await expect(setCurated('x', true)).rejects.toThrow(/admins/i);
  });
});

describe('gallery.js — fetchPublicDossier (slug lookup)', () => {
  it('returns null for missing/invalid slugs without hitting the network', async () => {
    expect(await fetchPublicDossier(null)).toBe(null);
    expect(await fetchPublicDossier('')).toBe(null);
    expect(await fetchPublicDossier(42)).toBe(null);
    expect(supabase.from).not.toHaveBeenCalled();
  });

  it('sanitizes returned dossier (strips owner-identifying columns)', async () => {
    supabase.from.mockImplementationOnce(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockResolvedValue({
        data: {
          id: '1', public_slug: 's1', name: 'X', tier: 'town',
          data: { foo: 'bar' }, published_at: '2025-01-01', view_count: 3,
        },
        error: null,
      }),
    }));
    supabase.rpc.mockResolvedValueOnce({ data: null, error: null });  // bump_public_view
    const dossier = await fetchPublicDossier('s1');
    expect(dossier).toEqual({
      slug: 's1', name: 'X', tier: 'town',
      settlement: { foo: 'bar' },
      publishedAt: '2025-01-01', viewCount: 3,
    });
    // No id, no user_id leak.
    expect(Object.keys(dossier)).not.toContain('id');
    expect(Object.keys(dossier)).not.toContain('user_id');
  });
});
