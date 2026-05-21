/**
 * gallery.js — Client API for the public dossier gallery (migration 008).
 *
 * Responsibilities:
 *   - publish/unpublish a settlement the caller owns (RPCs).
 *   - List public dossiers for the /gallery page (paginated).
 *   - Fetch a single public dossier by slug (no auth required).
 *   - Track view counts politely.
 *
 * Privacy:
 *   When we hand a public dossier to a non-owner viewer, we strip
 *   anything that could identify the owner: email, display name, save
 *   metadata. The `data` jsonb is what gets shown — and that's the
 *   pure settlement object, which contains no owner identity by design.
 */

import { supabase, isConfigured } from './supabase.js';

const LIST_PAGE_SIZE = 24;

/**
 * Publish a settlement to the gallery. Returns the public slug the
 * caller should use to build a /gallery/{slug} URL.
 */
export async function publishSettlement(settlementId) {
  if (!isConfigured) throw new Error('Supabase not configured');
  const { data, error } = await supabase.rpc('publish_settlement', { target_id: settlementId });
  if (error) throw new Error(error.message || 'Publish failed');
  return data; // slug string
}

/** Remove from the gallery. Slug is preserved server-side for re-share. */
export async function unpublishSettlement(settlementId) {
  if (!isConfigured) throw new Error('Supabase not configured');
  const { error } = await supabase.rpc('unpublish_settlement', { target_id: settlementId });
  if (error) throw new Error(error.message || 'Unpublish failed');
}

/**
 * Fetch the public gallery listing.
 *
 * @param {Object} [opts]
 * @param {number} [opts.page=0]              — Zero-indexed page number.
 * @param {number} [opts.pageSize]            — Items per page; defaults to LIST_PAGE_SIZE.
 * @param {boolean} [opts.excludeCurated=true] — When true, hides curated dossiers from this listing
 *                                              (they appear in the curated section instead).
 * @returns {Promise<{ items, hasMore }>}
 */
export async function fetchPublicGallery({ page = 0, pageSize = LIST_PAGE_SIZE, excludeCurated = true } = {}) {
  if (!isConfigured) return { items: [], hasMore: false };

  const from = page * pageSize;
  const to   = from + pageSize - 1;

  // Select only the columns we need to render a tile. The full `data`
  // jsonb stays on the server until the viewer opens a specific
  // dossier — keeps the listing query small and cacheable.
  let query = supabase
    .from('settlements')
    .select('id, public_slug, name, tier, published_at, view_count, is_curated', { count: 'exact' })
    .eq('is_public', true);

  if (excludeCurated) {
    // Hide curated dossiers from the community listing — they get
    // their own surface above via fetchCuratedGallery(). This avoids
    // duplicating the same tile in two sections.
    query = query.eq('is_curated', false);
  }

  const { data, error, count } = await query
    .order('published_at', { ascending: false })
    .range(from, to);

  if (error) {
    console.error('[gallery] listing failed:', error);
    return { items: [], hasMore: false };
  }

  return {
    items: (data || []).map(sanitizeTile),
    hasMore: (count ?? 0) > (page + 1) * pageSize,
    total: count ?? null,
  };
}

/**
 * Fetch the curated gallery — hand-picked exemplary dossiers shown
 * above the community listing. Returns dossiers in their explicit
 * curation order (curated_order asc, nulls last → published_at desc).
 *
 * Backed by the `list_curated_dossiers()` RPC (migration 011) so the
 * sort logic lives server-side and stays consistent with any future
 * server-side curation tooling. Returns an empty array if Supabase
 * isn't configured.
 */
export async function fetchCuratedGallery() {
  if (!isConfigured) return [];

  const { data, error } = await supabase.rpc('list_curated_dossiers');
  if (error) {
    console.error('[gallery] curated listing failed:', error);
    return [];
  }

  return (data || []).map(row => ({
    id:          row.id,
    slug:        row.public_slug,
    name:        row.name,
    tier:        row.tier,
    publishedAt: row.published_at,
    viewCount:   row.view_count ?? 0,
    curated:     true,
  }));
}

/**
 * Admin-only: mark a dossier as curated (or unmark it). The server
 * RPC gates this to developer/admin roles and writes an audit row.
 *
 * @param {string} settlementId — The settlement to curate.
 * @param {boolean} curated     — Target state.
 * @param {number} [sortOrder]  — Optional explicit sort index within the curated section.
 */
export async function setCurated(settlementId, curated, sortOrder = null) {
  if (!isConfigured) throw new Error('Supabase not configured');
  const { error } = await supabase.rpc('set_curated', {
    target_id:  settlementId,
    curated,
    sort_order: sortOrder,
  });
  if (error) throw new Error(error.message || 'Curation toggle failed');
}

/**
 * Fetch a single public dossier by its slug. Returns the full
 * settlement payload (the same shape the OutputContainer renders),
 * stripped of owner identifiers.
 */
export async function fetchPublicDossier(slug) {
  if (!isConfigured) return null;
  if (!slug || typeof slug !== 'string') return null;

  const { data, error } = await supabase
    .from('settlements')
    .select('id, public_slug, name, tier, data, published_at, view_count')
    .eq('is_public', true)
    .eq('public_slug', slug)
    .maybeSingle();

  if (error) {
    console.error('[gallery] dossier fetch failed:', error);
    return null;
  }
  if (!data) return null;

  // Fire-and-forget view bump. We don't want a slow counter write to
  // delay rendering; failure here just leaves the number stale.
  bumpPublicView(slug).catch(() => { /* swallow */ });

  return sanitizeDossier(data);
}

async function bumpPublicView(slug) {
  if (!isConfigured) return;
  const { error } = await supabase.rpc('bump_public_view', { slug });
  if (error && import.meta?.env?.DEV) {
    console.warn('[gallery] bump_public_view failed:', error.message);
  }
}

// ── Sanitizers ────────────────────────────────────────────────────────────
// Defense in depth. The RLS policy already prevents owner fields from
// being readable by non-owners, but we strip a fixed allowlist here so
// a future column addition (e.g. user_id leaking via a JOIN) can't
// accidentally expose author identity through this codepath.

function sanitizeTile(row) {
  return {
    id:           row.id,
    slug:         row.public_slug,
    name:         row.name,
    tier:         row.tier,
    publishedAt:  row.published_at,
    viewCount:    row.view_count ?? 0,
    curated:      row.is_curated ?? false,
  };
}

function sanitizeDossier(row) {
  return {
    slug:         row.public_slug,
    name:         row.name,
    tier:         row.tier,
    settlement:   row.data,         // the full settlement object
    publishedAt:  row.published_at,
    viewCount:    row.view_count ?? 0,
  };
}
