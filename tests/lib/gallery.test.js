/**
 * tests/lib/gallery.test.js - Gallery client API + curation/privacy contract.
 *
 * These tests stub the supabase client and verify the gallery.js library
 * dispatches the right RPC / table calls and sanitizes responses
 * correctly. SQL privacy boundaries are guarded by contract tests and
 * should also be exercised by pgTAP server-side.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

vi.mock('../../src/lib/supabase.js', () => {
  const queryBuilder = (mockResponse) => {
    const builder = {};
    const methods = ['select', 'eq', 'order', 'range', 'maybeSingle', 'update'];
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
  updateGalleryMetadata, toggleGalleryVote, fetchGalleryComments,
  addGalleryComment, deleteGalleryComment, reportGalleryDossier,
  fetchGalleryReports, resolveGalleryReport,
} from '../../src/lib/gallery.js';

afterEach(() => vi.clearAllMocks());

describe('gallery.js - publish/unpublish (RPC)', () => {
  it('publishSettlement calls publish_settlement and returns the slug', async () => {
    supabase.rpc.mockResolvedValueOnce({ data: 'abc123', error: null });
    const slug = await publishSettlement('settlement-uuid');
    expect(supabase.rpc).toHaveBeenCalledWith('publish_settlement', { target_id: 'settlement-uuid' });
    expect(slug).toBe('abc123');
  });

  it('publishSettlement updates metadata before publishing when provided', async () => {
    supabase.from.mockImplementationOnce(() => ({
      update: vi.fn().mockReturnThis(),
      eq: vi.fn().mockResolvedValue({ error: null }),
    }));
    supabase.rpc.mockResolvedValueOnce({ data: 'abc123', error: null });
    const slug = await publishSettlement('settlement-uuid', {
      description: 'A public hook.',
      imageUrl: 'https://example.com/a.jpg',
      tags: 'frontier, high magic',
    });
    expect(slug).toBe('abc123');
    expect(supabase.from).toHaveBeenCalledWith('settlements');
    expect(supabase.rpc).toHaveBeenCalledWith('publish_settlement', { target_id: 'settlement-uuid' });
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

describe('gallery.js - fetchPublicGallery (community listing)', () => {
  beforeEach(() => {
    supabase.rpc.mockResolvedValue({
      data: [
        {
          id: '1',
          public_slug: 's1',
          name: 'Bramblefen',
          tier: 'town',
          published_at: '2025-01-01',
          updated_at: '2025-01-02',
          view_count: 5,
          is_curated: false,
          gallery_description: 'A market town.',
          gallery_image_url: 'https://example.com/bramble.jpg',
          gallery_tags: ['market'],
          population: 1200,
          terrain: 'forest',
          net_votes: 3,
          comment_count: 2,
          total_count: 1,
        },
      ],
      error: null,
    });
  });

  it('calls the filtered listing RPC with sort, search, and filters', async () => {
    await fetchPublicGallery({
      page: 0,
      sort: 'top_voted',
      search: 'bramble',
      filters: { tier: ['town'], hasImage: true },
    });
    expect(supabase.rpc).toHaveBeenCalledWith('list_gallery_dossiers', {
      page_number: 0,
      page_size: 24,
      sort_key: 'top_voted',
      search_query: 'bramble',
      filters: { tier: ['town'], hasImage: true },
      exclude_curated: true,
    });
  });

  it('can be told to include curated tiles via excludeCurated=false', async () => {
    await fetchPublicGallery({ page: 0, excludeCurated: false });
    expect(supabase.rpc).toHaveBeenCalledWith('list_gallery_dossiers', expect.objectContaining({
      exclude_curated: false,
    }));
  });

  it('sanitizes rows to a tile shape (drops user_id, hides DB column names)', async () => {
    const { items } = await fetchPublicGallery({ page: 0 });
    expect(items[0]).toMatchObject({
      id: '1', slug: 's1', name: 'Bramblefen', tier: 'town',
      publishedAt: '2025-01-01', updatedAt: '2025-01-02', viewCount: 5,
      curated: false, description: 'A market town.', imageUrl: 'https://example.com/bramble.jpg',
      tags: ['market'], population: 1200, terrain: 'forest', netVotes: 3, commentCount: 2,
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

  it('does not fall back to direct table reads when the listing RPC is unavailable', async () => {
    supabase.rpc.mockResolvedValueOnce({ data: null, error: { message: 'missing function' } });
    const res = await fetchPublicGallery({ page: 0 });
    expect(res).toEqual({ items: [], hasMore: false, total: 0 });
    expect(supabase.from).not.toHaveBeenCalled();
  });
});

describe('gallery.js - fetchCuratedGallery (Tier 8.1)', () => {
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

describe('gallery.js - setCurated (admin RPC)', () => {
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

describe('gallery.js - fetchPublicDossier (slug lookup)', () => {
  it('returns null for missing/invalid slugs without hitting the network', async () => {
    expect(await fetchPublicDossier(null)).toBe(null);
    expect(await fetchPublicDossier('')).toBe(null);
    expect(await fetchPublicDossier(42)).toBe(null);
    expect(supabase.from).not.toHaveBeenCalled();
    expect(supabase.rpc).not.toHaveBeenCalled();
  });

  it('sanitizes returned dossier (strips owner-identifying columns)', async () => {
    supabase.rpc
      .mockResolvedValueOnce({
        data: [{
          id: '1', public_slug: 's1', name: 'X', tier: 'town',
          data: { foo: 'bar', dmCompass: { secret: true } }, published_at: '2025-01-01', view_count: 3,
        }],
        error: null,
      })
      .mockResolvedValueOnce({ data: null, error: null })  // bump_public_view
      .mockResolvedValueOnce({ data: [{ net_votes: 4, voted: true }], error: null })
      .mockResolvedValueOnce({ data: [], error: null });
    const dossier = await fetchPublicDossier('s1');
    expect(dossier).toMatchObject({
      id: '1',
      slug: 's1', name: 'X', tier: 'town',
      settlement: { foo: 'bar' },
      publishedAt: '2025-01-01', viewCount: 3,
      netVotes: 4,
      voteState: { netVotes: 4, voted: true },
    });
    expect(supabase.rpc).toHaveBeenCalledWith('get_gallery_dossier', { dossier_slug: 's1' });
    // No user_id leak.
    expect(Object.keys(dossier)).not.toContain('user_id');
  });
});

describe('gallery.js - metadata, votes, comments', () => {
  it('updateGalleryMetadata patches public metadata columns', async () => {
    const update = vi.fn().mockReturnThis();
    const eq = vi.fn().mockResolvedValue({ error: null });
    supabase.from.mockReturnValueOnce({ update, eq });
    await updateGalleryMetadata('s1', { description: 'Hello', imageUrl: 'https://x.test/a.jpg', tags: 'a, b' });
    expect(update).toHaveBeenCalledWith(expect.objectContaining({
      gallery_description: 'Hello',
      gallery_image_url: 'https://x.test/a.jpg',
      gallery_tags: ['a', 'b'],
    }));
    expect(eq).toHaveBeenCalledWith('id', 's1');
  });

  it('drops non-http public image URLs before patching metadata', async () => {
    const update = vi.fn().mockReturnThis();
    const eq = vi.fn().mockResolvedValue({ error: null });
    supabase.from.mockReturnValueOnce({ update, eq });
    await updateGalleryMetadata('s1', { imageUrl: 'javascript:alert(1)' });
    expect(update).toHaveBeenCalledWith(expect.objectContaining({
      gallery_image_url: null,
    }));
  });

  it('toggleGalleryVote calls the vote RPC and normalizes the result', async () => {
    supabase.rpc.mockResolvedValueOnce({ data: [{ net_votes: 5, voted: true }], error: null });
    await expect(toggleGalleryVote('s1')).resolves.toEqual({ netVotes: 5, voted: true });
    expect(supabase.rpc).toHaveBeenCalledWith('toggle_gallery_vote', { target_settlement_id: 's1' });
  });

  it('comments use safe RPC helpers', async () => {
    supabase.rpc
      .mockResolvedValueOnce({ data: [{ id: 'c1', body: 'Nice', created_at: '2026-01-01', updated_at: '2026-01-01', can_delete: false, author_label: 'A DM' }], error: null })
      .mockResolvedValueOnce({ data: 'c2', error: null })
      .mockResolvedValueOnce({ data: null, error: null });

    const comments = await fetchGalleryComments('s1');
    expect(comments[0]).toMatchObject({ id: 'c1', body: 'Nice', authorLabel: 'A DM' });
    await addGalleryComment('s1', 'Hello');
    await deleteGalleryComment('c1');
    expect(supabase.rpc).toHaveBeenCalledWith('add_gallery_comment', { target_settlement_id: 's1', comment_body: 'Hello' });
    expect(supabase.rpc).toHaveBeenCalledWith('delete_gallery_comment', { target_comment_id: 'c1' });
  });

  it('reports use the moderation RPC helper', async () => {
    supabase.rpc.mockResolvedValueOnce({ data: 'report-id', error: null });
    await expect(reportGalleryDossier('s1', 'unsafe_content', 'Needs review')).resolves.toBe('report-id');
    expect(supabase.rpc).toHaveBeenCalledWith('report_gallery_dossier', {
      target_settlement_id: 's1',
      report_reason: 'unsafe_content',
      report_body: 'Needs review',
    });
  });

  it('moderation queue helpers use elevated-only report RPCs', async () => {
    supabase.rpc
      .mockResolvedValueOnce({
        data: [{
          report_id: 'r1',
          settlement_id: 's1',
          public_slug: 'bramblefen',
          settlement_name: 'Bramblefen',
          tier: 'town',
          gallery_image_url: 'https://x.test/a.jpg',
          is_public: true,
          report_reason: 'spam',
          report_body: 'Needs review',
          status: 'open',
          report_created_at: '2026-01-01',
          report_updated_at: '2026-01-02',
          reporter_label: 'Gallery reader',
          report_count: 2,
        }],
        error: null,
      })
      .mockResolvedValueOnce({ data: null, error: null });

    const reports = await fetchGalleryReports({ status: 'open', limit: 10 });
    expect(reports[0]).toMatchObject({
      id: 'r1',
      settlementId: 's1',
      slug: 'bramblefen',
      name: 'Bramblefen',
      reason: 'spam',
      status: 'open',
      reportCount: 2,
    });
    expect(supabase.rpc).toHaveBeenCalledWith('list_gallery_reports', {
      report_status: 'open',
      limit_count: 10,
    });

    await resolveGalleryReport('r1', 'resolved', 'Handled');
    expect(supabase.rpc).toHaveBeenCalledWith('resolve_gallery_report', {
      target_report_id: 'r1',
      next_status: 'resolved',
      resolution_note: 'Handled',
    });
  });
});
