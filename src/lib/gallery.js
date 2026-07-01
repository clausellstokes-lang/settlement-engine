/**
 * gallery.js — Client API for the public dossier gallery.
 *
 * Responsibilities:
 *   - publish/unpublish a settlement the caller owns (RPCs).
 *   - List public dossiers for the /gallery page through safe RPCs.
 *   - Fetch a single public dossier by slug through a sanitized RPC.
 *   - Track view counts politely.
 *
 * Privacy:
 *   Public readers must not query the `settlements` table for raw data.
 *   The database exposes only safe gallery RPCs; the client sanitizer is
 *   defense in depth for mocks, older local databases, and future columns.
 */

import { supabase, isConfigured } from './supabase.js';
import { toPublicSafe } from '../domain/display/publicSafe.js';
import { sanitizeGalleryHtml } from './sanitizeGalleryHtml.js';
import { getDeviceToken } from './deviceToken.js';
import { track, EVENTS } from './analytics.js';

const LIST_PAGE_SIZE = 24;
const DEFAULT_SORT = 'relevant';

export const GALLERY_SORT_OPTIONS = Object.freeze([
  ['relevant', 'Most relevant'],
  ['top_voted', 'Top voted'],
  ['most_viewed', 'Most viewed'],
  ['most_commented', 'Most discussed'],
  ['newest', 'Newest'],
  ['recently_updated', 'Recently updated'],
  ['population_desc', 'Population: high to low'],
  ['population_asc', 'Population: low to high'],
  ['name_asc', 'A-Z'],
]);

// IN-list facets the public feed accepts. governmentType + stability were
// dropped: the engine writes a free-text faction name / composite label for
// each, so no bounded sidebar vocabulary can ever match them (migration 063).
// culture + prosperity are the new bounded-vocab facets.
const FILTER_ARRAY_KEYS = Object.freeze(['tier', 'terrain', 'magicLevel', 'culture', 'prosperity']);

/**
 * Publish a settlement to the gallery. Returns the public slug the
 * caller should use to build a /gallery/{slug} URL.
 */
export async function publishSettlement(settlementId, metadata = null) {
  if (!isConfigured) throw new Error('Supabase not configured');
  if (metadata && Object.keys(metadata).length) {
    await updateGalleryMetadata(settlementId, metadata);
  }
  const { data, error } = await supabase.rpc('publish_settlement', { target_id: settlementId });
  if (error) throw new Error(error.message || 'Publish failed');
  // GALLERY_PUBLISHED — fire-and-forget on success. Only props derivable at
  // this API layer: image presence + narrated-share opt-in (from the metadata
  // the caller passed). tier / canon_phase aren't available here without
  // changing the signature, so they're intentionally omitted.
  try {
    track(EVENTS.GALLERY_PUBLISHED, {
      has_image: !!(metadata && String(metadata.imageUrl || '').trim()),
      share_narrated: metadata?.shareNarrated === true,
    });
  } catch { /* analytics never affects publish */ }
  return data; // slug string
}

/**
 * Fetch a clone-ready, server-sanitized dossier for import. Server-gated on
 * gallery_importable + is_public + auth (migration 048): returns null when the
 * dossier isn't importable / not found / the caller is anonymous. The payload
 * is the SAME sanitized projection the gallery page shows (never raw data, never
 * the generation seed) — importing exposes nothing the viewer didn't already see.
 */
export async function fetchDossierForImport(slug) {
  if (!isConfigured) throw new Error('Supabase not configured');
  if (!slug || typeof slug !== 'string') return null;
  const { data, error } = await supabase.rpc('import_gallery_dossier', { dossier_slug: slug });
  if (error) throw new Error(error.message || 'Import fetch failed');
  const row = Array.isArray(data) ? data[0] : data;
  if (!row) return null;
  return { id: row.id, name: row.name, tier: row.tier, settlement: stripImportConfidential(row.data) };
}

/**
 * Client defense-in-depth for the import payload. The import_gallery_dossier RPC
 * is server-gated and already sanitized, but every OTHER gallery read re-clamps
 * client-side because RLS/raw writes mean the row can't be fully trusted — this
 * path was the one exception. Strip only the keys that are NEVER legitimately
 * shared (so this is non-lossy for an opted-in DM share's secrets/hooks/prose):
 * the generation seed (the RPC contract promises it is absent) and the DM scratch
 * notes that toPublicSafe drops even in owner-opted full mode (publicSafe.js).
 */
function stripImportConfidential(data) {
  if (!data || typeof data !== 'object') return data;
  const out = { ...data };
  delete out.seed;           // contract: "never the generation seed"
  delete out.dmNotes;        // truly-confidential DM scratch — dropped even in full mode
  delete out.dossierNotes;
  delete out.narrativeNotes;
  return out;
}

/** Remove from the gallery. Slug is preserved server-side for re-share. */
export async function unpublishSettlement(settlementId) {
  if (!isConfigured) throw new Error('Supabase not configured');
  const { error } = await supabase.rpc('unpublish_settlement', { target_id: settlementId });
  if (error) throw new Error(error.message || 'Unpublish failed');
  try { track(EVENTS.GALLERY_UNPUBLISHED, {}); } catch { /* never affects unpublish */ }
}

export async function updateGalleryMetadata(settlementId, metadata = {}) {
  if (!isConfigured) throw new Error('Supabase not configured');
  if (!settlementId) throw new Error('Missing settlement id');
  const patch = galleryMetadataPatch(metadata);
  const { error } = await supabase
    .from('settlements')
    .update(patch)
    .eq('id', settlementId);
  if (error) throw new Error(error.message || 'Gallery metadata update failed');
  return patch;
}

// ── Map gallery (Project 2) ──────────────────────────────────────────────────
// Maps publish from saved_maps (the campaign row). All public reads go through
// SECURITY DEFINER RPCs (migration 045). campaignId IS the saved_maps row id for
// cloud-synced campaigns; a local-only (non-uuid) campaign must sync first.

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Publish a campaign's map to the gallery. kind: 'map' (blank canvas) |
 * 'map_with_campaign'. `importable` is the owner opt-in (saved_maps.gallery_importable,
 * migration 072): pass a boolean to set it, or omit it to leave the prior choice
 * untouched (publish_map coalesces null → current). The toolbar's plain share omits
 * it, so a fresh share stays non-importable (column default) until the owner opts in.
 *
 * The share-editor opts (image, world snapshot, realm-arc summary, facets) are
 * the SAME fields galleryMapMetadataPatch sanitizes; here they ride the
 * publish_map RPC params so a single publish call both flips is_public and
 * captures the metadata snapshot. The world snapshot is built + sanitized by the
 * CALLER (serializeWorldSnapshotPublic) and passed through as-is. Each optional
 * field coalesces null → current server-side, so an omitted opt leaves the prior
 * value untouched (same posture as p_importable).
 *
 * @param {string} campaignId saved_maps row id (must be a synced uuid)
 * @param {{
 *   kind?: string,
 *   description?: string,
 *   tags?: string[]|null,
 *   importable?: boolean,
 *   imageUrl?: string,
 *   imageAlt?: string,
 *   shareWorld?: boolean,
 *   worldSections?: string[],
 *   worldSnapshot?: object|null,
 *   realmArcSummary?: string,
 *   facets?: object|null,
 * }} [opts]
 */
export async function shareMap(campaignId, {
  kind = 'map',
  description = '',
  tags = null,
  importable,
  imageUrl,
  imageAlt,
  shareWorld,
  worldSections,
  worldSnapshot,
  realmArcSummary,
  facets,
} = {}) {
  if (!isConfigured) throw new Error('Supabase not configured');
  if (!UUID_RE.test(String(campaignId || ''))) throw new Error('Save this campaign to the cloud before sharing its map.');
  // Sanitize the text/url fields the same way the direct-update patch does, so
  // the publish path and the edit-after-publish path store identical shapes
  // (defense in depth — there is no server/DB scrub of these columns).
  const safeImageUrl = imageUrl === undefined ? undefined : (() => {
    const trimmed = String(imageUrl || '').trim().slice(0, 1000);
    return isSafePublicImageUrl(trimmed) ? trimmed : null;
  })();
  const safeSections = worldSections === undefined ? undefined : [...new Set(
    (Array.isArray(worldSections) ? worldSections : [])
      .map(key => String(key || '').trim())
      .filter(key => WORLD_SECTION_KEYS.includes(key)),
  )];
  const safeSnapshot = worldSnapshot === undefined
    ? undefined
    : ((worldSnapshot && typeof worldSnapshot === 'object' && !Array.isArray(worldSnapshot)) ? worldSnapshot : null);
  const { data, error } = await supabase.rpc('publish_map', {
    target_id: campaignId,
    p_kind: kind === 'map_with_campaign' ? 'map_with_campaign' : 'map',
    // Sanitize rich-text on write to the SAME budget as galleryMapMetadataPatch /
    // the settlement path (there is no server/DB scrub of gallery_description): cap
    // raw generously, sanitize, then trim to 4000 VISIBLE chars. The old raw 500-
    // char slice both under-budgeted and shipped unsanitized HTML on first publish.
    p_description: (sanitizeGalleryHtml(String(description || '').slice(0, 8000)).trim().slice(0, 4000)) || null,
    p_tags: (() => { const clamped = clampTags(tags); return clamped.length ? clamped : null; })(),
    p_importable: importable === undefined ? null : importable === true,
    p_image_url: safeImageUrl === undefined ? null : safeImageUrl,
    p_image_alt: imageAlt === undefined ? null : (String(imageAlt || '').trim().slice(0, 220) || null),
    p_share_world: shareWorld === undefined ? null : shareWorld === true,
    p_world_sections: safeSections === undefined ? null : safeSections,
    p_world_snapshot: safeSnapshot === undefined ? null : safeSnapshot,
    p_realm_arc_summary: realmArcSummary === undefined ? null : (sanitizeRealmArcSummary(String(realmArcSummary || '')) || null),
    p_facets: (facets && typeof facets === 'object' && !Array.isArray(facets)) ? facets : null,
  });
  if (error) throw new Error(error.message || 'Map share failed');
  try { track(EVENTS.GALLERY_PUBLISHED, { kind }); } catch { /* analytics never affects publish */ }
  return data; // slug
}

export async function unshareMap(campaignId) {
  if (!isConfigured) throw new Error('Supabase not configured');
  const { error } = await supabase.rpc('unpublish_map', { target_id: campaignId });
  if (error) throw new Error(error.message || 'Map unshare failed');
  try { track(EVENTS.GALLERY_UNPUBLISHED, { kind: 'map' }); } catch { /* never affects unshare */ }
}

/**
 * Browse public maps (anonymized tiles). Filter/sort/search run SERVER-SIDE
 * (migration 065) — the tile carries import_count + a REAL member_count, and the
 * RPC applies the kind/backdrop/tags/has-settlements facets + ilike search +
 * ORDER BY before pagination. Owner identity is never projected.
 */
export async function fetchGalleryMaps({ page = 0, pageSize = 24, sort = 'newest', search = '', filters = {} } = {}) {
  if (!isConfigured) return { items: [] };
  const { data, error } = await supabase.rpc('list_gallery_maps', {
    p_page: page,
    p_page_size: pageSize,
    p_sort_key: sort,
    p_search_query: search || '',
    p_filters: normalizeMapFilters(filters),
  });
  if (error) throw new Error(error.message || 'Could not load shared maps');
  return { items: Array.isArray(data) ? data : [] };
}

// Forward only the map facets the RPC understands: the non-empty IN-list arrays
// (kind / backdrop / tags) and the boolean toggles (has-settlements, importable).
// Mirrors normalizeGalleryFilters so an empty facet never narrows the server query.
export function normalizeMapFilters(filters = {}) {
  const out = {};
  for (const key of ['kind', 'backdrop', 'tags']) {
    const arr = Array.isArray(filters[key]) ? filters[key].filter(Boolean).map(String) : [];
    if (arr.length) out[key] = arr;
  }
  if (filters.hasSettlements) out.hasSettlements = true;
  // Owner import opt-in facet (saved_maps.gallery_importable, migration 072) —
  // forwarded only when truthy so an unchecked toggle never narrows the query.
  if (filters.importable) out.importable = true;
  return out;
}

/**
 * Fire-and-forget import counter for a shared map. Called from the import path
 * (campaignSlice) after a successful clone; the importer is not the map's owner,
 * so the bump runs in a SECURITY DEFINER RPC (bump_map_import, migration 065).
 * A counter failure must never fail the import, so the error is swallowed.
 */
export async function bumpMapImport(slug) {
  if (!isConfigured || !slug) return;
  const { error } = await supabase.rpc('bump_map_import', { p_slug: slug });
  if (error && import.meta?.env?.DEV) {
    console.warn('[gallery] bump_map_import failed:', error.message);
  }
}

/** Fetch one public map payload (blank-canvas backdrop in Phase 1). View path. */
export async function fetchGalleryMap(slug) {
  if (!isConfigured || !slug) return null;
  const { data, error } = await supabase.rpc('get_gallery_map', { p_slug: slug });
  if (error) throw new Error(error.message || 'Could not load that map');
  return data || null;
}

/**
 * Fetch a clone-ready map payload for IMPORT. Server-gated on gallery_importable +
 * is_public + auth (migration 072): returns null when the map isn't importable /
 * not found / the caller is anonymous. The payload is the SAME projection the
 * preview shows (never raw map_data / private worldState) — importing exposes
 * nothing the viewer didn't already see. Mirrors fetchDossierForImport (048).
 */
export async function fetchMapForImport(slug) {
  if (!isConfigured || !slug) return null;
  const { data, error } = await supabase.rpc('import_gallery_map', { p_slug: slug });
  if (error) throw new Error(error.message || 'Could not load that map');
  return data || null;
}

/**
 * Fetch the public gallery listing.
 *
 * @param {Object} [opts]
 * @param {number} [opts.page=0]              - Zero-indexed page number.
 * @param {number} [opts.pageSize]            - Items per page; defaults to LIST_PAGE_SIZE.
 * @param {boolean} [opts.excludeCurated=true] - When true, hides curated dossiers from this listing
 *                                              (they appear in the curated section instead).
 * @param {string} [opts.sort='relevant']      - Gallery sort key.
 * @param {string} [opts.search='']            - Search query.
 * @param {Object} [opts.filters]              - Filter object; arrays + booleans.
 * @returns {Promise<{ items: Array<Object>, hasMore: boolean, total: number | null }>}
 */
export async function fetchPublicGallery({
  page = 0,
  pageSize = LIST_PAGE_SIZE,
  excludeCurated = true,
  sort = DEFAULT_SORT,
  search = '',
  filters = {},
} = {}) {
  if (!isConfigured) return { items: [], hasMore: false, total: 0 };

  const rpcResult = await fetchPublicGalleryViaRpc({ page, pageSize, excludeCurated, sort, search, filters });
  return rpcResult || { items: [], hasMore: false, total: 0 };
}

/**
 * Fetch the signed-in user's OWN published dossiers as gallery tiles (§5 "My
 * Settlements"). Owner-scoped server-side via list_my_gallery_dossiers
 * (auth.uid()); no pagination (a user has few). Empty for anon / unconfigured.
 */
export async function fetchMyGallery() {
  if (!isConfigured) return { items: [], hasMore: false, total: 0 };
  const { data, error } = await supabase.rpc('list_my_gallery_dossiers');
  if (error) {
    console.error('[gallery] my-settlements listing failed:', error);
    return { items: [], hasMore: false, total: 0 };
  }
  const rows = data || [];
  return { items: rows.map(sanitizeTile), hasMore: false, total: rows.length };
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
 * @param {number} [sortOrder]  - Optional explicit sort index within the curated section.
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
 * Fetch a single public dossier by its slug. Returns the sanitized
 * settlement payload that OutputContainer can render read-only.
 */
export async function fetchPublicDossier(slug) {
  if (!isConfigured) return null;
  if (!slug || typeof slug !== 'string') return null;

  const { data, error } = await supabase.rpc('get_gallery_dossier', { dossier_slug: slug });

  if (error) {
    console.error('[gallery] dossier fetch failed:', error);
    return null;
  }
  const row = Array.isArray(data) ? data[0] : data;
  if (!row) return null;

  // Fire-and-forget view bump. We don't want a slow counter write to
  // delay rendering; failure here just leaves the number stale.
  bumpPublicView(slug).catch(() => { /* swallow */ });

  const [voteState, moreByCreator] = await Promise.all([
    fetchGalleryVoteState(row.id),
    fetchMoreByCreator(slug),
  ]);

  return {
    ...sanitizeDossier({
      ...row,
      net_votes: voteState.netVotes,
      moreByCreator,
    }),
    voteState,
  };
}

async function bumpPublicView(slug) {
  if (!isConfigured) return;
  // Pass the anon device token so the server counts at most one view per
  // device per day (§6 dedup). Signed-in viewers are deduped by their uid
  // server-side regardless; the token covers signed-out readers.
  const { error } = await supabase.rpc('bump_public_view', { slug, viewer_token: getDeviceToken() });
  if (error && import.meta?.env?.DEV) {
    console.warn('[gallery] bump_public_view failed:', error.message);
  }
}

export async function fetchMoreByCreator(slug, limit = 6) {
  if (!isConfigured || !slug) return [];
  const { data, error } = await supabase.rpc('list_gallery_more_by_creator', {
    source_slug: slug,
    limit_count: limit,
  });
  if (error) {
    console.error('[gallery] more-by-creator failed:', error);
    return [];
  }
  return (data || []).map(sanitizeTile);
}

export async function toggleGalleryVote(settlementId) {
  if (!isConfigured) throw new Error('Supabase not configured');
  const { data, error } = await supabase.rpc('toggle_gallery_vote', { target_settlement_id: settlementId });
  if (error) throw new Error(error.message || 'Vote failed');
  try { track(EVENTS.GALLERY_ENGAGEMENT, { action: 'vote' }); } catch { /* never affects vote */ }
  const row = Array.isArray(data) ? data[0] : data;
  return { netVotes: Math.max(0, Number(row?.net_votes) || 0), voted: !!row?.voted };
}

export async function fetchGalleryVoteState(settlementId) {
  if (!isConfigured || !settlementId) return { netVotes: 0, voted: false };
  const { data, error } = await supabase.rpc('get_gallery_vote_state', { target_settlement_id: settlementId });
  if (error) return { netVotes: 0, voted: false };
  const row = Array.isArray(data) ? data[0] : data;
  return { netVotes: Math.max(0, Number(row?.net_votes) || 0), voted: !!row?.voted };
}

export async function fetchGalleryComments(settlementId) {
  if (!isConfigured || !settlementId) return [];
  const { data, error } = await supabase.rpc('list_gallery_comments', { target_settlement_id: settlementId });
  if (error) {
    console.error('[gallery] comments failed:', error);
    return [];
  }
  return (data || []).map(row => ({
    id: row.id,
    body: String(row.body || ''),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    canDelete: !!row.can_delete,
    authorLabel: row.author_label || 'A DM',
  }));
}

export async function addGalleryComment(settlementId, body) {
  if (!isConfigured) throw new Error('Supabase not configured');
  const { data, error } = await supabase.rpc('add_gallery_comment', {
    target_settlement_id: settlementId,
    comment_body: body,
  });
  if (error) throw new Error(error.message || 'Comment failed');
  try { track(EVENTS.GALLERY_ENGAGEMENT, { action: 'comment' }); } catch { /* never affects comment */ }
  return data;
}

export async function deleteGalleryComment(commentId) {
  if (!isConfigured) throw new Error('Supabase not configured');
  const { error } = await supabase.rpc('delete_gallery_comment', { target_comment_id: commentId });
  if (error) throw new Error(error.message || 'Delete comment failed');
}

export async function reportGalleryDossier(settlementId, reason = 'other', body = '') {
  if (!isConfigured) throw new Error('Supabase not configured');
  if (!settlementId) throw new Error('Missing settlement id');
  const { data, error } = await supabase.rpc('report_gallery_dossier', {
    target_settlement_id: settlementId,
    report_reason: reason,
    report_body: body,
  });
  if (error) throw new Error(error.message || 'Report failed');
  try { track(EVENTS.GALLERY_ENGAGEMENT, { action: 'report' }); } catch { /* never affects report */ }
  return data;
}

export async function fetchGalleryReports({ status = 'open', limit = 50 } = {}) {
  if (!isConfigured) return [];
  const { data, error } = await supabase.rpc('list_gallery_reports', {
    report_status: status,
    limit_count: limit,
  });
  if (error) throw new Error(error.message || 'Gallery reports could not be loaded');
  return (data || []).map(sanitizeReport);
}

export async function resolveGalleryReport(reportId, status = 'resolved', note = '') {
  if (!isConfigured) throw new Error('Supabase not configured');
  if (!reportId) throw new Error('Missing report id');
  const { error } = await supabase.rpc('resolve_gallery_report', {
    target_report_id: reportId,
    next_status: status,
    resolution_note: note,
  });
  if (error) throw new Error(error.message || 'Gallery report could not be updated');
}

// ── Sanitizers ────────────────────────────────────────────────────────────
// Defense in depth. Server RPCs already return sanitized data, but this
// keeps unit-test fixtures and older local databases from leaking fields
// if a response shape drifts.

// powerStructure.governmentType is never written by the generator — the
// engine persists powerStructure.government as a STRING (the governing
// entry's name doubles as the government type), with governingName as the
// canonical "who governs" field. Legacy rows may carry an object with .type.
// Walk the shapes that actually exist before the legacy top-level fallbacks.
function readGovernmentType(data) {
  const ps = data?.powerStructure || {};
  return ps.governmentType
    || (typeof ps.government === 'string' ? ps.government : ps.government?.type)
    || ps.governingName
    || data?.government?.type
    || data?.governmentType
    || '';
}

// gallery_tags has no server/DB scrub either (RLS lets an owner write the array
// directly), so the read normalizers re-apply the same clamp the write path uses
// (lower-case, strip to [a-z0-9 -], drop empties, cap the count) plus a per-tag
// length bound — defense in depth, so a drifted/malicious row can never smuggle
// markup or an unbounded blob through this field. Mirrors the share-metadata
// write clamp.
const TAG_LENGTH_LIMIT = 40;
const TAG_COUNT_LIMIT = 12;

/**
 * The single tag clamp shared by every gallery path (publish, edit, read) so they
 * can never diverge: lower-case, strip to [a-z0-9 -], bound each tag to
 * TAG_LENGTH_LIMIT, drop empties, cap the count. Accepts an array or a
 * comma-separated string (the editor's raw input shape).
 *
 * @param {string[]|string} tags raw tags (array or comma-separated string)
 * @returns {string[]} the clamped tag list
 */
function clampTags(tags) {
  const list = Array.isArray(tags) ? tags : String(tags || '').split(',');
  return list
    .map(tag => String(tag || '').trim().toLowerCase().replace(/[^a-z0-9 -]+/g, '').slice(0, TAG_LENGTH_LIMIT))
    .filter(Boolean)
    .slice(0, TAG_COUNT_LIMIT);
}

// READ-path clamp: array-only. A non-array stored value is a drifted/malicious
// row, not editor input, so it yields [] rather than being comma-split (the
// write-path behaviour of clampTags). Both share the same per-tag clamp.
function sanitizeGalleryTags(tags) {
  if (!Array.isArray(tags)) return [];
  return clampTags(tags);
}

function sanitizeTile(row) {
  const data = row.data || {};
  return {
    id:           row.id,
    slug:         row.public_slug,
    name:         row.name,
    tier:         row.tier,
    publishedAt:  row.published_at,
    updatedAt:    row.updated_at || row.gallery_updated_at || row.published_at,
    viewCount:    row.view_count ?? 0,
    curated:      row.is_curated ?? false,
    // gallery_description is sanitized rich-text HTML, but there is no server/DB
    // scrub — RLS lets an owner write raw HTML via a direct table update, and
    // sanitizing-on-write only guards values this client wrote. Sanitize on READ
    // too, at the normalizer chokepoint, so the data object is HTML-safe for ANY
    // consumer (card, dossier, PDF, json export) regardless of the stored value.
    description:  sanitizeGalleryHtml(row.gallery_description || ''),
    imageUrl:     row.gallery_image_url || '',
    imageAlt:     row.gallery_image_alt || '',
    tags:         sanitizeGalleryTags(row.gallery_tags),
    population:   Number(row.population ?? data.population) || null,
    terrain:      row.terrain || data?.config?.terrainType || data?.config?.terrainOverride || data?.geography?.terrain || data?.terrain || '',
    governmentType: row.government_type || readGovernmentType(data),
    magicLevel:   row.magic_level || data?.config?.magicLevel || data?.magicLevel || '',
    stability:    row.stability || data?.viability?.stability || data?.systemState?.stability || data?.stability || '',
    primaryResource: row.primary_resource || data?.config?.nearbyResources?.[0] || data?.nearbyResources?.[0] || '',
    threatLevel:  row.threat_level || data?.threatProfile?.level || data?.defense?.threatLevel || data?.threatLevel || '',
    // New facets (migration 063). Server returns stored snapshots; the data
    // fallbacks keep mocks + pre-migration rows truthful.
    culture:      row.culture || data?.config?.culture || '',
    prosperity:   row.prosperity || data?.economicState?.prosperity || '',
    primaryDeity: row.primary_deity || data?.config?.primaryDeitySnapshot?.name || '',
    atWar:        row.at_war === true,
    netVotes:     Math.max(0, Number(row.net_votes) || 0),
    commentCount: Math.max(0, Number(row.comment_count) || 0),
    // Public author name resolved live by owner id (migration 076). Empty when
    // an owner has no external_name yet (pre-075 / mock rows).
    author:       row.author_name || '',
  };
}

// Public-safe sanitization is consolidated in domain/display/publicSafe.js
// (toPublicSafe) — a single, named, tested projection of the display spine
// (doc §1k), mirroring the server's _gallery_sanitize_public_json.

// ── Public chronicle allowlist ──────────────────────────────────────────────
// The get_gallery_dossier RPC ships the event chronicle as a SEPARATE,
// server-projected column (migration 032) — per-entry allowlist of the keys
// below. It must NOT route through toPublicSafe: its /chronicle/i denylist
// would strip it (correctly — chronicle keys INSIDE the settlement data stay
// private). Instead we re-apply the same allowlist here, defense in depth, so
// a drifted or malicious row can never smuggle extra keys (raw EventLogEntries
// carry before/after state snapshots, faction reactions with adventure seeds,
// and rollback blobs that must never ship). Mirrors _gallery_chronicle_entry.
const CHRONICLE_ENTRY_KEYS = Object.freeze(['id', 'appliedAt', 'timestamp', 'narrativeSummary', 'cause', 'partyCaused']);
const CHRONICLE_EVENT_KEYS = Object.freeze(['id', 'type', 'cause', 'partyCaused']);
const CHRONICLE_LIMIT = 50;

// Only scalar values survive — an object smuggled into an allowlisted key
// (e.g. narrativeSummary) is dropped, not serialized.
function chronicleScalar(value) {
  const t = typeof value;
  return (t === 'string' || t === 'number' || t === 'boolean') ? value : undefined;
}

function sanitizeChronicleEntry(raw) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
  const out = {};
  for (const key of CHRONICLE_ENTRY_KEYS) {
    const value = chronicleScalar(raw[key]);
    if (value !== undefined) out[key] = value;
  }
  if (raw.event && typeof raw.event === 'object' && !Array.isArray(raw.event)) {
    const event = {};
    for (const key of CHRONICLE_EVENT_KEYS) {
      const value = chronicleScalar(raw.event[key]);
      if (value !== undefined) event[key] = value;
    }
    if (Object.keys(event).length) out.event = event;
  }
  return Object.keys(out).length ? out : null;
}

function sanitizeChronicle(entries) {
  if (!Array.isArray(entries)) return [];
  return entries.map(sanitizeChronicleEntry).filter(Boolean).slice(-CHRONICLE_LIMIT);
}

// ── Public realm-arc summary (§S4) ───────────────────────────────────────────
// The campaign's war/pantheon epic ("The Ascendancy of X", "The War of Y") is a
// PUBLIC-SAFE digest DERIVED from the already-public ledgers (pantheon tiers + war
// state) — NOT the raw chronicle, which is DM-private and stripped by both
// sanitizers. It rides its OWN column (gallery_realm_arc_summary), separate from
// the settlement `data` (which toPublicSafe would strip via /chronicle/i if the
// narrative lived inside it). We re-clamp it to a plain bounded scalar here,
// defense in depth, so a drifted/malicious row can never smuggle markup or an
// unbounded blob through this field.
const REALM_ARC_SUMMARY_LIMIT = 600;

function sanitizeRealmArcSummary(value) {
  if (typeof value !== 'string') return '';
  // Plain text only — strip any angle brackets so the digest can never carry
  // markup into the gallery page, and bound the length.
  return value.replace(/[<>]/g, '').trim().slice(0, REALM_ARC_SUMMARY_LIMIT);
}

function sanitizeDossier(row) {
  // Per-member overrides (migration 092). The server RPC already projected row.data
  // through these; passing them into toPublicSafe keeps the client defense-in-depth
  // from re-stripping a member the owner individually revealed (and re-strips one
  // they individually hid), so client + server agree member-for-member.
  const memberOverrides = (row.gallery_member_overrides && typeof row.gallery_member_overrides === 'object' && !Array.isArray(row.gallery_member_overrides))
    ? row.gallery_member_overrides
    : {};
  return {
    id:           row.id,
    slug:         row.public_slug,
    name:         row.name,
    tier:         row.tier,
    // Owner opt-in: when gallery_share_dm is set, publish the full DM view
    // unstripped (the server RPC already returns it raw in that case; this keeps
    // the client defense-in-depth from re-stripping what the owner chose to show).
    settlement:   toPublicSafe(row.data, { full: row.gallery_share_dm === true, memberOverrides }),
    // The event chronicle (separate allowlisted column, migration 032) —
    // deliberately NOT routed through toPublicSafe; see sanitizeChronicle.
    chronicle:    sanitizeChronicle(row.chronicle),
    // §S4 — the public-safe realm-arc digest (a derived scalar, NOT the raw
    // chronicle). Its own column, re-clamped to plain bounded text here.
    realmArcSummary: sanitizeRealmArcSummary(row.gallery_realm_arc_summary),
    // Owner opted to reveal DM-private content — the public viewer must render in
    // DM mode (not player view), or the DM tabs/secrets stay hidden despite the
    // data being present. See PublicDossierView.
    shareDm:      row.gallery_share_dm === true,
    // Owner opt-in (migration 047): may other users clone this into their library?
    importable:   row.gallery_importable === true,
    // Per-member visibility overrides (migration 092), for any UI that surfaces them.
    memberOverrides,
    publishedAt:  row.published_at,
    updatedAt:    row.updated_at || row.gallery_updated_at || row.published_at,
    viewCount:    row.view_count ?? 0,
    // Headline living-world state for the dossier hero — the one fact that
    // signals a simulated settlement, not a generator snapshot. Same derivation
    // as the list tile so card and dossier agree.
    stability:    row.stability || row.data?.viability?.stability || row.data?.systemState?.stability || row.data?.stability || '',
    // Sanitize gallery_description on READ (not just on write): there is no
    // server/DB scrub and RLS lets an owner write raw HTML directly, so this
    // normalizer is the chokepoint that makes the description HTML-safe for any
    // consumer downstream. Mirrors sanitizeTile.
    description:  sanitizeGalleryHtml(row.gallery_description || ''),
    imageUrl:     row.gallery_image_url || '',
    imageAlt:     row.gallery_image_alt || '',
    tags:         sanitizeGalleryTags(row.gallery_tags),
    netVotes:     Math.max(0, Number(row.net_votes) || 0),
    commentCount: Math.max(0, Number(row.comment_count) || 0),
    // Public author name resolved live by owner id (migration 076).
    author:       row.author_name || '',
    moreByCreator: Array.isArray(row.moreByCreator) ? row.moreByCreator.map(sanitizeTile) : [],
  };
}

function sanitizeReport(row) {
  return {
    id: row.report_id,
    settlementId: row.settlement_id,
    slug: row.public_slug,
    name: row.settlement_name,
    tier: row.tier,
    imageUrl: row.gallery_image_url || '',
    isPublic: row.is_public !== false,
    reason: row.report_reason || 'other',
    body: String(row.report_body || ''),
    status: row.status || 'open',
    createdAt: row.report_created_at,
    updatedAt: row.report_updated_at,
    resolvedAt: row.resolved_at,
    resolutionNote: row.resolution_note || '',
    reporterLabel: row.reporter_label || 'Gallery reader',
    reportCount: Math.max(0, Number(row.report_count) || 0),
  };
}

async function fetchPublicGalleryViaRpc({ page, pageSize, excludeCurated, sort, search, filters }) {
  const { data, error } = await supabase.rpc('list_gallery_dossiers', {
    page_number: page,
    page_size: pageSize,
    sort_key: sort,
    search_query: search,
    filters: normalizeGalleryFilters(filters),
    exclude_curated: excludeCurated,
  });
  if (error) {
    if (import.meta?.env?.DEV) console.warn('[gallery] RPC listing failed, falling back:', error.message);
    return null;
  }
  const rows = data || [];
  const total = Number(rows[0]?.total_count) || rows.length;
  return {
    items: rows.map(sanitizeTile),
    hasMore: total > (page + 1) * pageSize,
    total,
  };
}

function normalizeGalleryFilters(filters = {}) {
  const out = {};
  for (const key of FILTER_ARRAY_KEYS) {
    const arr = Array.isArray(filters[key]) ? filters[key].filter(Boolean).map(String) : [];
    if (arr.length) out[key] = arr;
  }
  if (filters.hasImage) out.hasImage = true;
  if (filters.hasComments) out.hasComments = true;
  if (filters.curatedOnly) out.curatedOnly = true;
  if (filters.hasDeity) out.hasDeity = true;
  // Owner import opt-in facet (gallery_importable, migration 047; surfaced as a
  // list facet by migration 071). Narrows to dossiers their owner allowed to
  // clone.
  if (filters.importable) out.importable = true;
  return out;
}

function galleryMetadataPatch(metadata = {}) {
  // Descriptions are sanitized rich-text HTML (§4c). Sanitize ON WRITE here (not
  // only at render): there is no server/DB-side scrub of gallery_description, so
  // sanitizing the stored value is what makes it XSS-safe regardless of which
  // consumer renders it — a future unsanitized render path can't resurrect stored
  // script. Cap the raw input generously before sanitizing, then hard-bound the
  // sanitized result to the column budget.
  const description = sanitizeGalleryHtml(String(metadata.description || '').slice(0, 8000)).trim().slice(0, 4000);
  const imageUrl = String(metadata.imageUrl || '').trim().slice(0, 1000);
  const imageAlt = String(metadata.imageAlt || '').trim().slice(0, 220);
  const patch = {
    gallery_description: description || null,
    gallery_image_url: isSafePublicImageUrl(imageUrl) ? imageUrl : null,
    gallery_image_alt: imageAlt || null,
    // The single shared tag clamp (clampTags) the read + publish paths use too,
    // so the three can never diverge: lower-case, strip to [a-z0-9 -], bound each
    // tag, drop empties, cap the count. Writing the same shape we'd accept on read
    // keeps a stored row from carrying an unbounded blob the read normalizer would
    // later trim.
    gallery_tags: clampTags(metadata.tags),
    gallery_updated_at: new Date().toISOString(),
  };
  // Owners can opt to publish the AI-narrated dossier instead of the raw
  // simulation; the public RPC honors this flag (see migration 025).
  if (metadata.shareNarrated !== undefined) {
    patch.gallery_share_narrated = metadata.shareNarrated === true;
  }
  // Owner opt-in: publish the entire DM view (secrets, plot hooks, NPC goals +
  // relationships, DM notes + compass) unstripped. Off by default; the public
  // gallery RPC honors this flag (see migration 026).
  if (metadata.shareDm !== undefined) {
    patch.gallery_share_dm = metadata.shareDm === true;
  }
  // Owner opt-in: let other users import (clone) this public dossier into their
  // own library. Off by default; the import RPC honors this flag (migration 047).
  if (metadata.importable !== undefined) {
    patch.gallery_importable = metadata.importable === true;
  }
  // §S4 — the public-safe realm-arc digest (war/pantheon epic). A DERIVED scalar,
  // not the raw chronicle. Sanitized to plain bounded text so the gallery row can
  // never carry markup or an unbounded blob.
  if (metadata.realmArcSummary !== undefined) {
    const summary = sanitizeRealmArcSummary(String(metadata.realmArcSummary || ''));
    patch.gallery_realm_arc_summary = summary || null;
  }
  // Facet snapshots (migration 063). Captured at publish/re-share time from the
  // REAL settlement attributes — culture/prosperity/deity from the persisted
  // data, atWar from the owning campaign's LIVE war ledger (which the gallery row
  // cannot recompute on its own). ShareToGallery derives these; we clamp + null
  // empties here so a facet column never holds an empty string.
  if (metadata.facetCulture !== undefined) {
    patch.gallery_facet_culture = String(metadata.facetCulture || '').trim().slice(0, 64) || null;
  }
  if (metadata.facetProsperity !== undefined) {
    patch.gallery_facet_prosperity = String(metadata.facetProsperity || '').trim().slice(0, 64) || null;
  }
  if (metadata.facetDeity !== undefined) {
    patch.gallery_facet_deity = String(metadata.facetDeity || '').trim().slice(0, 120) || null;
  }
  if (metadata.facetAtWar !== undefined) {
    patch.gallery_facet_at_war = metadata.facetAtWar === true;
  }
  // Per-member (per-NPC) gallery visibility overrides (migration 092). There is no
  // server/DB scrub of this column, so shape-clamp on write (defense in depth, like
  // tags/description): a json object keyed by NPC key, values { revealDm?, allowImport? }
  // with boolean values only. ShareToGallery already drops keys equal to the
  // settlement default; this is the final shape gate.
  if (metadata.memberOverrides !== undefined) {
    patch.gallery_member_overrides = clampMemberOverrides(metadata.memberOverrides);
  }
  return patch;
}

/**
 * Final shape gate for the gallery_member_overrides column: keep only string keys
 * (bounded) mapping to { revealDm?, allowImport? } with boolean values, capped in
 * count. Drops anything malformed so a drifted bag can never store an unbounded or
 * non-boolean blob the server would then read.
 * @param {any} raw
 */
function clampMemberOverrides(raw) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {};
  /** @type {Record<string, any>} */
  const out = {};
  let n = 0;
  for (const [key, val] of Object.entries(raw)) {
    if (n >= 1000) break;
    if (typeof key !== 'string' || !key || key.length > 200) continue;
    if (!val || typeof val !== 'object') continue;
    /** @type {Record<string, boolean>} */
    const entry = {};
    if (typeof (/** @type {any} */ (val).revealDm) === 'boolean') entry.revealDm = (/** @type {any} */ (val)).revealDm;
    if (typeof (/** @type {any} */ (val).allowImport) === 'boolean') entry.allowImport = (/** @type {any} */ (val)).allowImport;
    if (Object.keys(entry).length) { out[key] = entry; n += 1; }
  }
  return out;
}

// ── Map gallery metadata write (campaigns / saved_maps) ──────────────────────
// The maps share editor edits the saved_maps row's gallery_* columns directly
// (RLS scopes the update to the owner), exactly as the settlement editor edits
// settlements. saved_maps carries the SAME defense-in-depth posture as
// settlements: there is no server/DB scrub of gallery_description / gallery_tags
// / gallery_realm_arc_summary, so the write path must sanitize the stored value
// (sanitizing-on-write is what keeps a future unsanitized render path from
// resurrecting stored markup). Mirrors galleryMetadataPatch field-for-field;
// the only map-specific additions are the world-snapshot trio (share toggle,
// section allowlist, pass-through jsonb snapshot).

// Allowlist of world-snapshot section keys an owner may choose to reveal. The
// snapshot itself is built + sanitized by the caller (the editor, via
// serializeWorldSnapshotPublic); this list bounds WHICH sections the public
// preview is permitted to render, so a drifted/malicious row can never smuggle
// an unknown section key. Mirrors the bounded-vocab posture of FILTER_ARRAY_KEYS.
// The five realm-share reveal sections. These keys MUST match exactly the option
// keys serializeWorldSnapshotPublic (src/domain/display/worldSnapshotPublic.js)
// gates each section on, and the Realm Inspector sections the editor toggles map
// to. A section the editor enables only reaches the public snapshot if BOTH this
// input allowlist and the serializer honour the same key — kept in lockstep.
const WORLD_SECTION_KEYS = Object.freeze([
  'worldClock',
  'chronicle',
  'pantheon',
  'warNetwork',
  'dashboard',
]);

/**
 * Build the saved_maps gallery-metadata patch from an editor metadata bag.
 * Mirrors galleryMetadataPatch (settlements) but targets the saved_maps
 * gallery_* columns, plus the map-only world-snapshot trio. Every text field is
 * sanitized + bounded on write (no server/DB scrub exists for these columns).
 *
 * @param {{
 *   description?: string,
 *   imageUrl?: string,
 *   imageAlt?: string,
 *   tags?: string[]|string,
 *   importable?: boolean,
 *   realmArcSummary?: string,
 *   memberBand?: string,
 *   dominantCulture?: string,
 *   tierSpread?: string,
 *   atWar?: boolean,
 *   shareWorld?: boolean,
 *   worldSections?: string[],
 *   worldSnapshot?: object|null,
 * }} [metadata]
 * @returns {Object} the saved_maps update patch
 */
function galleryMapMetadataPatch(metadata = {}) {
  // Sanitize ON WRITE (cap the raw input generously before sanitizing, then
  // hard-bound the sanitized result to the column budget) — identical posture
  // to galleryMetadataPatch's gallery_description.
  const description = sanitizeGalleryHtml(String(metadata.description || '').slice(0, 8000)).trim().slice(0, 4000);
  const imageAlt = String(metadata.imageAlt || '').trim().slice(0, 220);
  const patch = {
    gallery_description: description || null,
    gallery_image_alt: imageAlt || null,
    // The single shared tag clamp (clampTags) the settlement write + read paths
    // use too: lower-case, strip to [a-z0-9 -], bound each tag, drop empties, cap
    // the count.
    gallery_tags: clampTags(metadata.tags),
    gallery_updated_at: new Date().toISOString(),
  };
  // Cover PRESERVE-ON-OMIT: only set gallery_image_url when a non-empty value is
  // provided, so a mis-seed (the edit-after-publish draft mounting before the
  // prior cover is fetched) can never null an existing cover. An empty/whitespace
  // value leaves the column untouched; a non-empty value is sanitized + bounded.
  const rawImageUrl = String(metadata.imageUrl || '').trim().slice(0, 1000);
  if (rawImageUrl) {
    patch.gallery_image_url = isSafePublicImageUrl(rawImageUrl) ? rawImageUrl : null;
  }
  // Owner opt-in: let other DMs import (clone) this public map. Written only when
  // provided so an omitted value leaves the prior choice untouched; mirrors the
  // settlement path's gallery_importable.
  if (metadata.importable !== undefined) {
    patch.gallery_importable = metadata.importable === true;
  }
  // §S4 — the public-safe realm-arc digest (war/pantheon epic). A DERIVED
  // scalar, re-clamped to plain bounded text so the map row can never carry
  // markup or an unbounded blob. Mirrors the settlement path.
  if (metadata.realmArcSummary !== undefined) {
    const summary = sanitizeRealmArcSummary(String(metadata.realmArcSummary || ''));
    patch.gallery_realm_arc_summary = summary || null;
  }
  // CAMPAIGN facet snapshots — the saved_maps facet columns are campaign-shaped
  // (migration 088: member_band / dominant_culture / tier_spread / at_war), NOT the
  // settlement-shaped culture/prosperity/deity (those live on the settlements table).
  // The editor's campaignFacets() emits exactly these keys; clamp + null empties so a
  // facet column never holds an empty string.
  if (metadata.memberBand !== undefined) {
    patch.gallery_facet_member_band = String(metadata.memberBand || '').trim().slice(0, 64) || null;
  }
  if (metadata.dominantCulture !== undefined) {
    patch.gallery_facet_dominant_culture = String(metadata.dominantCulture || '').trim().slice(0, 64) || null;
  }
  if (metadata.tierSpread !== undefined) {
    patch.gallery_facet_tier_spread = String(metadata.tierSpread || '').trim().slice(0, 64) || null;
  }
  if (metadata.atWar !== undefined) {
    patch.gallery_facet_at_war = metadata.atWar === true;
  }
  // Owner opt-in: reveal the living-world snapshot alongside the shared map.
  if (metadata.shareWorld !== undefined) {
    patch.gallery_share_world = metadata.shareWorld === true;
  }
  // Which world-snapshot sections the public preview may render. Clamp to the
  // bounded allowlist (drop unknown keys, dedupe, dropping empties) so a
  // drifted row can never name an un-vetted section.
  if (metadata.worldSections !== undefined) {
    const sections = Array.isArray(metadata.worldSections) ? metadata.worldSections : [];
    patch.gallery_world_sections = [...new Set(
      sections
        .map(key => String(key || '').trim())
        .filter(key => WORLD_SECTION_KEYS.includes(key)),
    )];
  }
  // The world snapshot itself — a PUBLIC-SAFE jsonb projection the CALLER built
  // (serializeWorldSnapshotPublic) and already sanitized. lib/gallery does not
  // re-shape it; we only pass it through (or null it out when absent). Reject a
  // non-object so the column never holds a scalar/array smuggled in its place.
  if (metadata.worldSnapshot !== undefined) {
    const snap = metadata.worldSnapshot;
    patch.gallery_world_snapshot = (snap && typeof snap === 'object' && !Array.isArray(snap)) ? snap : null;
  }
  return patch;
}

/**
 * Fetch ONLY the saved_maps gallery_* columns for the owner, so the share editor
 * can seed its edit-after-publish draft (cover, alt, importable, world sections)
 * with the values already persisted — without those, "Save gallery details" would
 * overwrite the saved cover with an empty draft and re-enable every world section.
 *
 * This is a DEDICATED fetch, deliberately kept OUT of the campaign-load SELECT
 * (lib/campaigns.js): that path runs for every user on every page and must stay
 * independent of whether migration 088 (these columns) is applied. Here we own the
 * dependency, so the fetch must FAIL GRACEFULLY: if the columns do not exist yet
 * (pre-088) the query errors, and we return null rather than throwing — the editor
 * simply falls back to its defaults, exactly as before this seed existed.
 *
 * @param {string} campaignId saved_maps row id (the campaign id)
 * @returns {Promise<{
 *   imageUrl: string,
 *   imageAlt: string,
 *   importable: boolean,
 *   worldSections: string[]|null,
 *   shareWorld: boolean,
 *   description: string,
 *   tags: string[],
 * }|null>} the seeded gallery fields, or null when unavailable (pre-088 / not found)
 */
export async function fetchCampaignGalleryFields(campaignId) {
  if (!isConfigured || !campaignId) return null;
  if (!UUID_RE.test(String(campaignId))) return null;
  let result;
  try {
    result = await supabase
      .from('saved_maps')
      .select('gallery_image_url, gallery_image_alt, gallery_importable, gallery_world_sections, gallery_share_world, gallery_description, gallery_tags')
      .eq('id', campaignId)
      .maybeSingle();
  } catch {
    // A thrown query (e.g. the columns do not exist pre-088) must never break the
    // editor — fall back to defaults.
    return null;
  }
  const { data, error } = result || {};
  // Pre-088 the columns are absent and the select errors; treat any error as
  // "no seed available" so the editor keeps its default draft.
  if (error || !data) return null;
  return {
    imageUrl: data.gallery_image_url || '',
    imageAlt: data.gallery_image_alt || '',
    importable: data.gallery_importable === true,
    // null/absent ⇒ "seed unknown" so the editor keeps ALL sections on; an array
    // (even empty) is an explicit owner choice the editor must honour.
    worldSections: Array.isArray(data.gallery_world_sections) ? data.gallery_world_sections : null,
    shareWorld: data.gallery_share_world === true,
    description: sanitizeGalleryHtml(data.gallery_description || ''),
    tags: sanitizeGalleryTags(data.gallery_tags),
  };
}

/**
 * Edit-after-publish for a shared map's gallery metadata. Direct owner-scoped
 * update of the saved_maps gallery_* columns (RLS gates it to the owner),
 * paralleling updateGalleryMetadata for settlements. Returns the applied patch.
 *
 * @param {string} campaignId saved_maps row id
 * @param {Object} [metadata] editor metadata bag (see galleryMapMetadataPatch)
 * @returns {Promise<Object>} the applied patch
 */
export async function updateMapGalleryMetadata(campaignId, metadata = {}) {
  if (!isConfigured) throw new Error('Supabase not configured');
  if (!campaignId) throw new Error('Missing campaign id');
  const patch = galleryMapMetadataPatch(metadata);
  const { error } = await supabase
    .from('saved_maps')
    .update(patch)
    .eq('id', campaignId);
  if (error) throw new Error(error.message || 'Map gallery metadata update failed');
  return patch;
}

function isSafePublicImageUrl(value) {
  if (!value) return false;
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}
