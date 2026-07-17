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
import { REACTION_KEYS } from '../data/galleryReactionVocab.js';
import { AGE_BAND_IDS } from '../domain/ageBands.js';
import { clampAliveness } from './galleryAliveness.js';

const LIST_PAGE_SIZE = 24;
const DEFAULT_SORT = 'relevant';

export const GALLERY_SORT_OPTIONS = Object.freeze([
  ['relevant', 'Most relevant'],
  // GALLERY-2 phase 2 (migration 148): the publish-time aliveness snapshot —
  // worlds with the most lived simulation first; un-stamped shares fall back
  // to relevance order (server-side nulls-last).
  ['most_alive', 'Most alive'],
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
// each, so no bounded sidebar vocabulary can ever match them, AND the server
// list RPC (list_gallery_dossiers, migration 063/071) never filtered on them —
// they were dead chips. culture + prosperity are the bounded-vocab facets the
// server actually honors (migration 063).
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

/** Remove from the gallery. Slug is preserved server-side for re-share. */
export async function unpublishSettlement(settlementId) {
  if (!isConfigured) throw new Error('Supabase not configured');
  const { error } = await supabase.rpc('unpublish_settlement', { target_id: settlementId });
  if (error) throw new Error(error.message || 'Unpublish failed');
  try { track(EVENTS.GALLERY_UNPUBLISHED, {}); } catch { /* never affects unpublish */ }
}

/**
 * Fetch a clone-ready dossier payload for IMPORT. Server-gated on
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
 * path is no exception. Strip only the keys that are NEVER legitimately shared
 * (non-lossy for an opted-in DM share's secrets/hooks/prose): the generation
 * seed (the RPC contract promises it is absent) and the DM scratch notes that
 * toPublicSafe drops even in owner-opted full mode (publicSafe.js).
 */
function stripImportConfidential(data) {
  if (!data || typeof data !== 'object') return data;
  const out = { ...data };
  // Contract: "never the generation seed". The engine persists it as `_seed`
  // (top-level AND config._seed) plus the raw authoring `_config` — with any of
  // them, the importer could regenerate the full UNSANITIZED settlement through
  // the deterministic engine. `seed` covers drifted/legacy shapes. `config`
  // itself stays (it drives public display facets); clone it before deleting so
  // the caller's row object is never mutated.
  delete out.seed;
  delete out._seed;
  delete out._config;
  if (out.config && typeof out.config === 'object') {
    out.config = { ...out.config };
    delete out.config._seed;
  }
  delete out.dmNotes;        // truly-confidential DM scratch — dropped even in full mode
  delete out.dossierNotes;
  delete out.narrativeNotes;
  return out;
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
 * Build the publish_map RPC param bag (migration 089) from the MapShareEditor's
 * buildShareOpts keys. First-publish (shareMap) MUST write the SAME sanitized
 * values the edit-after-publish path (galleryMapMetadataPatch → updateMapGalleryMetadata)
 * writes, or a freshly published map diverges from the same map re-saved: before
 * this, shareMap forwarded only kind/description/tags, so the living-world reveal,
 * cover image + alt, importable flag, realm-arc summary and facets all silently
 * dropped on the FIRST publish (finding components-commerce-2). Every text field is
 * sanitized/bounded here to match the edit path; the world snapshot + sections
 * additionally pass the server-side forbidden-key scan (089), the real privacy
 * boundary. Exported so the client↔RPC param-parity contract test can pin these
 * keys against the migration's function signature.
 *
 * @param {{
 *   kind?: string, description?: string, tags?: string[]|string,
 *   importable?: boolean, imageUrl?: string, imageAlt?: string, shareWorld?: boolean,
 *   worldSections?: string[], worldSnapshot?: object|null, realmArcSummary?: string,
 *   facets?: object|null,
 * }} [opts]
 * @returns {Object} the publish_map RPC params (p_* keys; target_id is added by shareMap)
 */
export function publishMapParams({
  kind = 'map', description = '', tags = null,
  importable, imageUrl, imageAlt, shareWorld,
  worldSections, worldSnapshot, realmArcSummary, facets,
} = {}) {
  const cleanDescription = sanitizeGalleryHtml(String(description || '').slice(0, 8000)).trim().slice(0, 4000);
  const rawImageUrl = String(imageUrl || '').trim().slice(0, 1000);
  const cleanAlt = String(imageAlt || '').trim().slice(0, 220);
  const cleanSummary = realmArcSummary === undefined
    ? null
    : (sanitizeRealmArcSummary(String(realmArcSummary || '')) || null);
  const cleanSections = worldSections === undefined
    ? null
    : [...new Set(
        (Array.isArray(worldSections) ? worldSections : [])
          .map(key => String(key || '').trim())
          .filter(key => WORLD_SECTION_KEYS.includes(key)),
      )];
  const snapOk = worldSnapshot && typeof worldSnapshot === 'object' && !Array.isArray(worldSnapshot);
  const facetsOk = facets && typeof facets === 'object' && !Array.isArray(facets);
  return {
    p_kind: kind === 'map_with_campaign' ? 'map_with_campaign' : 'map',
    p_description: cleanDescription || null,
    // Empty clamp result publishes as null (not []) so the row's tag facet reads
    // "unset" rather than "zero tags" (ported master fix).
    p_tags: (() => { const c = clampTags(tags); return c.length ? c : null; })(),
    // undefined ⇒ null so the RPC's coalesce(..., current) preserves a prior value.
    p_importable: importable === undefined ? null : importable === true,
    // Only forward a safe, non-empty cover; empty/unsafe ⇒ null (RPC preserves).
    p_image_url: rawImageUrl && isSafePublicImageUrl(rawImageUrl) ? rawImageUrl : null,
    p_image_alt: cleanAlt || null,
    p_share_world: shareWorld === undefined ? null : shareWorld === true,
    p_world_sections: cleanSections,
    p_world_snapshot: worldSnapshot === undefined ? null : (snapOk ? worldSnapshot : null),
    p_realm_arc_summary: cleanSummary,
    p_facets: facetsOk ? facets : null,
  };
}

/**
 * Publish a campaign's map to the gallery. Accepts the full MapShareEditor
 * buildShareOpts bag and forwards ALL of it to publish_map (see publishMapParams).
 * kind: 'map' (blank canvas) | 'map_with_campaign'.
 */
export async function shareMap(campaignId, opts = {}) {
  if (!isConfigured) throw new Error('Supabase not configured');
  if (!UUID_RE.test(String(campaignId || ''))) throw new Error('Save this campaign to the cloud before sharing its map.');
  const params = publishMapParams(opts);
  const { data, error } = await supabase.rpc('publish_map', { target_id: campaignId, ...params });
  if (error) throw new Error(error.message || 'Map share failed');
  try { track(EVENTS.GALLERY_PUBLISHED, { kind: params.p_kind }); } catch { /* analytics never affects publish */ }
  return data; // slug
}

export async function unshareMap(campaignId) {
  if (!isConfigured) throw new Error('Supabase not configured');
  const { error } = await supabase.rpc('unpublish_map', { target_id: campaignId });
  if (error) throw new Error(error.message || 'Map unshare failed');
  try { track(EVENTS.GALLERY_UNPUBLISHED, { kind: 'map' }); } catch { /* never affects unshare */ }
}

/**
 * Server-side facet normalizer for the map gallery (list_gallery_maps p_filters,
 * migration 090). Forwards the array facets (kind / backdrop / tags) and the
 * boolean toggles (has-settlements, importable). Mirrors normalizeGalleryFilters
 * so an empty facet never narrows the server query. (Ported master fix, W6 —
 * the RPC accepted p_filters all along; the client never forwarded it.)
 */
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

/** Browse public maps (anonymized tiles). */
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

/** Fetch one public map payload (blank-canvas backdrop in Phase 1). */
export async function fetchGalleryMap(slug) {
  if (!isConfigured || !slug) return null;
  const { data, error } = await supabase.rpc('get_gallery_map', { p_slug: slug });
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

  const [voteState, reactionState, moreByCreator] = await Promise.all([
    fetchGalleryVoteState(row.id),
    fetchGalleryReactionState(row.id),
    fetchMoreByCreator(slug),
  ]);

  return {
    ...sanitizeDossier({
      ...row,
      net_votes: voteState.netVotes,
      moreByCreator,
    }),
    voteState,
    reactionState,
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

// ── Structured reactions (GALLERY-2 phase 2, migration 146) ──────────────────
// Six fixed fiction-register phrases (src/data/galleryReactionVocab.js), never
// free text. Same seam shape as votes: a toggle RPC + a state read, both
// normalized through sanitizeReactionState (key-allowlisted, count-clamped)
// because every gallery read re-clamps client-side.

/**
 * Normalize RPC reaction rows ([{ reaction_key, reaction_count, mine }]) into
 * { counts: {key: n}, mine: {key: true} }. Unknown keys are dropped (bounded
 * vocabulary — defense in depth over a drifted row); counts clamp to ≥ 0.
 * Also accepts a jsonb counts object ({ key: n }) — the tile-row shape.
 * @param {Array<Object>|Object|null} raw
 * @returns {{ counts: Record<string, number>, mine: Record<string, boolean> }}
 */
export function sanitizeReactionState(raw) {
  /** @type {Record<string, number>} */ const counts = {};
  /** @type {Record<string, boolean>} */ const mine = {};
  if (Array.isArray(raw)) {
    for (const row of raw) {
      const key = row?.reaction_key;
      if (!REACTION_KEYS.includes(key)) continue;
      counts[key] = Math.max(0, Math.floor(Number(row?.reaction_count)) || 0);
      if (row?.mine === true) mine[key] = true;
    }
  } else if (raw && typeof raw === 'object') {
    for (const key of REACTION_KEYS) {
      const n = Math.max(0, Math.floor(Number(raw[key])) || 0);
      if (n > 0) counts[key] = n;
    }
  }
  return { counts, mine };
}

/**
 * Toggle one of the six fixed reactions on a public settlement. Returns the
 * settlement's full post-toggle reaction state. Auth-required server-side
 * (toggle_gallery_reaction raises for anon/banned/over-velocity callers).
 */
export async function toggleGalleryReaction(settlementId, reactionKey) {
  if (!isConfigured) throw new Error('Supabase not configured');
  if (!REACTION_KEYS.includes(reactionKey)) throw new Error('Unknown reaction');
  const { data, error } = await supabase.rpc('toggle_gallery_reaction', {
    target_settlement_id: settlementId,
    reaction: reactionKey,
  });
  if (error) throw new Error(error.message || 'Reaction failed');
  try { track(EVENTS.GALLERY_ENGAGEMENT, { action: 'reaction' }); } catch { /* never affects the toggle */ }
  return sanitizeReactionState(Array.isArray(data) ? data : []);
}

/** Per-key reaction counts + which the caller gave. Anon-safe (mine stays {}). */
export async function fetchGalleryReactionState(settlementId) {
  if (!isConfigured || !settlementId) return { counts: {}, mine: {} };
  const { data, error } = await supabase.rpc('get_gallery_reaction_state', { target_settlement_id: settlementId });
  if (error) return { counts: {}, mine: {} };
  return sanitizeReactionState(Array.isArray(data) ? data : []);
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
    description:  sanitizeGalleryHtml(row.gallery_description || ''), // read-path scrub (ported master fix)
    imageUrl:     row.gallery_image_url || '',
    imageAlt:     row.gallery_image_alt || '',
    tags:         sanitizeGalleryTags(row.gallery_tags), // read-path clamp (ported master fix)
    population:   Number(row.population ?? data.population) || null,
    terrain:      row.terrain || data?.config?.terrain || data?.geography?.terrain || data?.terrain || '',
    governmentType: row.government_type || readGovernmentType(data),
    magicLevel:   row.magic_level || data?.config?.magicLevel || data?.magicLevel || '',
    stability:    row.stability || data?.viability?.stability || data?.systemState?.stability || data?.stability || '',
    primaryResource: row.primary_resource || data?.config?.nearbyResources?.[0] || data?.nearbyResources?.[0] || '',
    threatLevel:  row.threat_level || data?.threatProfile?.level || data?.defense?.threatLevel || data?.threatLevel || '',
    // Facet snapshot columns (migration 063) — surfaced on the tile so the
    // listing can filter/render culture, prosperity, patron deity and the live
    // at-war flag without touching the payload (ported master fix, W6).
    culture:      row.culture || data?.config?.culture || '',
    prosperity:   row.prosperity || data?.economicState?.prosperity || '',
    primaryDeity: row.primary_deity || data?.config?.primaryDeitySnapshot?.name || '',
    atWar:        row.at_war === true,
    netVotes:     Math.max(0, Number(row.net_votes) || 0),
    commentCount: Math.max(0, Number(row.comment_count) || 0),
    // GALLERY-2 phase 2 (migration 148 tile columns; absent rows read empty/null).
    // reactions: per-key counts as a jsonb object — key-allowlisted + clamped.
    reactions:    sanitizeReactionState(row.reactions || null).counts,
    // aliveness: the publish-time snapshot (0–100 int; null = shared before the
    // score existed — the owner re-shares to stamp it).
    aliveness:    sanitizeAliveness(row.aliveness),
  };
}

// Read-path aliveness clamp = THE shared null-safe clamp (galleryAliveness.js;
// a bare Number(null) would smear "unknown" into 0).
const sanitizeAliveness = clampAliveness;

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

function sanitizeDossier(row) {
  return {
    id:           row.id,
    slug:         row.public_slug,
    name:         row.name,
    tier:         row.tier,
    // Owner opt-in: when gallery_share_dm is set, publish the full DM view
    // unstripped (the server RPC already returns it raw in that case; this keeps
    // the client defense-in-depth from re-stripping what the owner chose to show).
    // Per-member overrides (092/093) reveal/hide individual NPCs regardless of the
    // settlement-level flag; the client projection mirrors the server splice.
    settlement:   toPublicSafe(row.data, {
      full: row.gallery_share_dm === true,
      memberOverrides: (row.gallery_member_overrides && typeof row.gallery_member_overrides === 'object' && !Array.isArray(row.gallery_member_overrides))
        ? row.gallery_member_overrides : null,
    }),
    // The event chronicle (separate allowlisted column, migration 032) —
    // deliberately NOT routed through toPublicSafe; see sanitizeChronicle.
    chronicle:    sanitizeChronicle(row.chronicle),
    // Owner opted to reveal DM-private content — the public viewer must render in
    // DM mode (not player view), or the DM tabs/secrets stay hidden despite the
    // data being present. See PublicDossierView.
    shareDm:      row.gallery_share_dm === true,
    // Owner opt-in: gates the "Import" affordance on the detail page (the
    // import_gallery_dossier RPC is the server-authoritative gate; this only
    // decides whether to SHOW the button). get_gallery_dossier returns this flag
    // (migration 047/071).
    importable:   row.gallery_importable === true,
    publishedAt:  row.published_at,
    updatedAt:    row.updated_at || row.gallery_updated_at || row.published_at,
    viewCount:    row.view_count ?? 0,
    description:  sanitizeGalleryHtml(row.gallery_description || ''), // read-path scrub (ported master fix)
    imageUrl:     row.gallery_image_url || '',
    imageAlt:     row.gallery_image_alt || '',
    tags:         sanitizeGalleryTags(row.gallery_tags), // read-path clamp (ported master fix)
    netVotes:     Math.max(0, Number(row.net_votes) || 0),
    commentCount: Math.max(0, Number(row.comment_count) || 0),
    // §S4 realm-arc digest — written at publish (gallery_realm_arc_summary) but
    // previously never READ back; sanitized+bounded on read (ported master fix).
    realmArcSummary: sanitizeRealmArcSummary(row.gallery_realm_arc_summary),
    // GALLERY-2 phase 2: the publish-time aliveness snapshot (148 dossier column;
    // null for rows shared before the score existed).
    aliveness:    sanitizeAliveness(row.aliveness),
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
  // Patron-deity presence facet (gallery_facet_deity, migration 063).
  if (filters.hasDeity) out.hasDeity = true;
  // Owner import opt-in facet (gallery_importable, migration 047; surfaced as a
  // list facet by migration 071). Narrows to dossiers their owner allowed to clone.
  if (filters.importable) out.importable = true;
  return out;
}

function galleryMetadataPatch(metadata = {}) {
  // MERGE-PATCH semantics (ported master fix, master-merge W6): every field is
  // written ONLY when the caller provided it (!== undefined), like the
  // shareNarrated/shareDm/facet fields below have always been. The old shape
  // wrote description/image/alt/tags unconditionally, so a partial bag (e.g. a
  // caller updating just { importable: true }) silently wiped the published
  // metadata. An explicitly provided empty value still clears its column —
  // omission is what preserves.
  const patch = {
    gallery_updated_at: new Date().toISOString(),
  };
  // Descriptions are sanitized rich-text HTML (§4c). Sanitize ON WRITE (the
  // same idiom as galleryMapMetadataPatch below): there is no server/DB-side
  // scrub of gallery_description, so sanitizing the stored value is what makes
  // it XSS-safe regardless of which consumer renders it. Cap the raw input
  // before sanitizing, then bound the sanitized result to the column budget.
  if (metadata.description !== undefined) {
    const description = sanitizeGalleryHtml(String(metadata.description || '').slice(0, 8000)).trim().slice(0, 4000);
    patch.gallery_description = description || null;
  }
  if (metadata.imageUrl !== undefined) {
    const imageUrl = String(metadata.imageUrl || '').trim().slice(0, 1000);
    patch.gallery_image_url = isSafePublicImageUrl(imageUrl) ? imageUrl : null;
  }
  if (metadata.imageAlt !== undefined) {
    const imageAlt = String(metadata.imageAlt || '').trim().slice(0, 220);
    patch.gallery_image_alt = imageAlt || null;
  }
  if (metadata.tags !== undefined) {
    // The shared clamp (see clampTags below): per-tag length bound + count cap,
    // the same write-path clamp the map twin (galleryMapMetadataPatch) uses.
    patch.gallery_tags = clampTags(metadata.tags);
  }
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
  // Per-member visibility overrides (migration 092/093): a keyed map of
  // { revealDm?, allowImport? } that reveals/hides individual member NPCs
  // independent of the settlement-level shareDm flag. Clamped on write (below).
  if (metadata.memberOverrides !== undefined) {
    patch.gallery_member_overrides = clampMemberOverrides(metadata.memberOverrides);
  }
  // Owner opt-in: let other users import (clone) this public dossier into their
  // own library. Off by default; the import RPC honors this flag (migration 047).
  if (metadata.importable !== undefined) {
    patch.gallery_importable = metadata.importable === true;
  }
  // §S4 — the public-safe realm-arc digest (war/pantheon epic). A DERIVED scalar,
  // not the raw chronicle. Sanitized to plain bounded text so the gallery row can
  // never carry markup or an unbounded blob (migration 070).
  if (metadata.realmArcSummary !== undefined) {
    const summary = sanitizeRealmArcSummary(String(metadata.realmArcSummary || ''));
    patch.gallery_realm_arc_summary = summary || null;
  }
  // Facet snapshots (migration 063). Captured at publish/re-share time from the
  // REAL settlement attributes — culture/prosperity/deity from the persisted
  // data, atWar from the owning campaign's LIVE war ledger (which the gallery row
  // cannot recompute on its own). ShareToGallery derives these; clamp + null
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
  // GALLERY-2 phase 2 (migration 147). The aliveness snapshot: 0–100 int from
  // the owning campaign's live worldState (src/lib/galleryAliveness.js) —
  // exactly at_war's Path-A posture (client-derived, owner-RLS write). null
  // (no owning campaign) clears the column so a save that LEFT its campaign
  // never keeps a stale liveness claim.
  if (metadata.facetAliveness !== undefined) {
    patch.gallery_facet_aliveness = clampAliveness(metadata.facetAliveness);
  }
  // The sharer-editable gallery title (migration 147): sanitized like the blurb
  // (same DOMPurify pass), then reduced to plain bounded text — a title is a
  // NAME, not rich text. Empty clears the column (the tile helper's coalesce
  // falls back to settlements.name).
  if (metadata.title !== undefined) {
    patch.gallery_title = sanitizeGalleryTitle(metadata.title) || null;
  }
  return patch;
}

const GALLERY_TITLE_LIMIT = 120;

/**
 * Title clamp shared by write + read: the blurb's sanitizer first (moderation
 * parity), then strip any residual markup to inert text, collapse whitespace,
 * bound to GALLERY_TITLE_LIMIT.
 * @param {unknown} value
 * @returns {string}
 */
function sanitizeGalleryTitle(value) {
  if (typeof value !== 'string') return '';
  return sanitizeGalleryHtml(value.slice(0, 1000))
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, GALLERY_TITLE_LIMIT);
}

/**
 * Final shape gate for the gallery_member_overrides column: keep only string keys
 * mapping to an object with boolean revealDm / allowImport, capped at 1000 members
 * so a hand-crafted payload can't bloat the row. Anything malformed collapses to {}.
 * @param {any} raw
 * @returns {Record<string, {revealDm?: boolean, allowImport?: boolean}>}
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
    if (typeof val.revealDm === 'boolean') entry.revealDm = val.revealDm;
    if (typeof val.allowImport === 'boolean') entry.allowImport = val.allowImport;
    if (Object.keys(entry).length) { out[key] = entry; n += 1; }
  }
  return out;
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

// ── Map-gallery (saved_maps) metadata: share-editor read + edit-after-publish ──
// The saved_maps gallery_* columns (migration 088) carry the map-share editor's
// metadata (cover, alt, tags, description, world-snapshot reveal). No server/DB
// scrub exists for these columns, so every text field is sanitized + bounded on
// write, and read back sanitized too.

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

const REALM_ARC_SUMMARY_LIMIT = 600;

// The public-safe realm-arc digest (§S4) re-clamped to a plain bounded scalar:
// plain text only (strip angle brackets so the digest can never carry markup),
// length-bounded. Defense in depth over a drifted/malicious row.
function sanitizeRealmArcSummary(value) {
  if (typeof value !== 'string') return '';
  return value.replace(/[<>]/g, '').trim().slice(0, REALM_ARC_SUMMARY_LIMIT);
}

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

// The canonical age-band vocabulary (the 147 CHECK constraint mirrors it).
// domain/ageBands.js is a zero-import pure leaf, so this costs nothing.
const WORLD_AGE_BANDS = AGE_BAND_IDS;

/**
 * Build the saved_maps gallery-metadata patch from an editor metadata bag.
 * Mirrors galleryMetadataPatch (settlements) but targets the saved_maps
 * gallery_* columns, plus the map-only world-snapshot trio. Every text field is
 * sanitized + bounded on write (no server/DB scrub exists for these columns).
 *
 * @param {{
 *   description?: string, imageUrl?: string, imageAlt?: string,
 *   tags?: string[]|string, importable?: boolean, realmArcSummary?: string,
 *   memberBand?: string, dominantCulture?: string, tierSpread?: string,
 *   atWar?: boolean, shareWorld?: boolean, worldSections?: string[],
 *   worldSnapshot?: object|null,
 * }} [metadata]
 * @returns {Object} the saved_maps update patch
 */
function galleryMapMetadataPatch(metadata = {}) {
  const description = sanitizeGalleryHtml(String(metadata.description || '').slice(0, 8000)).trim().slice(0, 4000);
  const imageAlt = String(metadata.imageAlt || '').trim().slice(0, 220);
  const patch = {
    gallery_description: description || null,
    gallery_image_alt: imageAlt || null,
    gallery_tags: clampTags(metadata.tags),
    gallery_updated_at: new Date().toISOString(),
  };
  // PRESERVE-ON-OMIT: only set gallery_image_url when a non-empty value is
  // provided, so a mis-seed can never null an existing cover.
  const rawImageUrl = String(metadata.imageUrl || '').trim().slice(0, 1000);
  if (rawImageUrl) {
    patch.gallery_image_url = isSafePublicImageUrl(rawImageUrl) ? rawImageUrl : null;
  }
  if (metadata.importable !== undefined) {
    patch.gallery_importable = metadata.importable === true;
  }
  if (metadata.realmArcSummary !== undefined) {
    const summary = sanitizeRealmArcSummary(String(metadata.realmArcSummary || ''));
    patch.gallery_realm_arc_summary = summary || null;
  }
  // CAMPAIGN facet snapshots (migration 088: member_band / dominant_culture /
  // tier_spread / at_war). Clamp + null empties so a facet column never holds ''.
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
  // GALLERY-2 phase 2 (147/149): the campaign aliveness + world-age snapshots,
  // mirroring the settlement twin's clamps (null = unknown, never 0).
  if (metadata.aliveness !== undefined) {
    patch.gallery_facet_aliveness = clampAliveness(metadata.aliveness);
  }
  if (metadata.worldAge !== undefined) {
    const band = String(metadata.worldAge || '');
    patch.gallery_facet_world_age = WORLD_AGE_BANDS.includes(band) ? band : null;
  }
  if (metadata.shareWorld !== undefined) {
    patch.gallery_share_world = metadata.shareWorld === true;
  }
  // Which world-snapshot sections the public preview may render. Clamp to the
  // bounded allowlist (drop unknown keys, dedupe) so a drifted row can never
  // name an un-vetted section.
  if (metadata.worldSections !== undefined) {
    const sections = Array.isArray(metadata.worldSections) ? metadata.worldSections : [];
    patch.gallery_world_sections = [...new Set(
      sections
        .map(key => String(key || '').trim())
        .filter(key => WORLD_SECTION_KEYS.includes(key)),
    )];
  }
  // The world snapshot itself — a PUBLIC-SAFE jsonb projection the CALLER built
  // (serializeWorldSnapshotPublic) and already sanitized. Pass-through, or null
  // when absent; reject a non-object so the column never holds a scalar/array.
  if (metadata.worldSnapshot !== undefined) {
    const snap = metadata.worldSnapshot;
    patch.gallery_world_snapshot = (snap && typeof snap === 'object' && !Array.isArray(snap)) ? snap : null;
  }
  return patch;
}

/**
 * Fetch ONLY the saved_maps gallery_* columns for the owner, so the share editor
 * can seed its edit-after-publish draft (cover, alt, importable, world sections)
 * with the values already persisted. FAILS GRACEFULLY: pre-088 the columns are
 * absent and the select errors — we return null and the editor keeps its default
 * draft rather than overwriting a saved cover with an empty one.
 *
 * @param {string} campaignId saved_maps row id (the campaign id)
 * @returns {Promise<{
 *   imageUrl: string, imageAlt: string, importable: boolean,
 *   worldSections: string[]|null, shareWorld: boolean, description: string, tags: string[],
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
