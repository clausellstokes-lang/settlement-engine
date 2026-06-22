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
  return { id: row.id, name: row.name, tier: row.tier, settlement: row.data };
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

/** Publish a campaign's map to the gallery. kind: 'map' (blank canvas) | 'map_with_campaign'. */
export async function shareMap(campaignId, { kind = 'map', description = '', tags = null } = {}) {
  if (!isConfigured) throw new Error('Supabase not configured');
  if (!UUID_RE.test(String(campaignId || ''))) throw new Error('Save this campaign to the cloud before sharing its map.');
  const { data, error } = await supabase.rpc('publish_map', {
    target_id: campaignId,
    p_kind: kind === 'map_with_campaign' ? 'map_with_campaign' : 'map',
    p_description: description ? String(description).slice(0, 500) : null,
    p_tags: Array.isArray(tags) && tags.length ? tags.slice(0, 12) : null,
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
// (kind / backdrop / tags) and the real has-settlements toggle. Mirrors
// normalizeGalleryFilters so an empty facet never narrows the server query.
function normalizeMapFilters(filters = {}) {
  const out = {};
  for (const key of ['kind', 'backdrop', 'tags']) {
    const arr = Array.isArray(filters[key]) ? filters[key].filter(Boolean).map(String) : [];
    if (arr.length) out[key] = arr;
  }
  if (filters.hasSettlements) out.hasSettlements = true;
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
    description:  row.gallery_description || '',
    imageUrl:     row.gallery_image_url || '',
    imageAlt:     row.gallery_image_alt || '',
    tags:         Array.isArray(row.gallery_tags) ? row.gallery_tags : [],
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
  return {
    id:           row.id,
    slug:         row.public_slug,
    name:         row.name,
    tier:         row.tier,
    // Owner opt-in: when gallery_share_dm is set, publish the full DM view
    // unstripped (the server RPC already returns it raw in that case; this keeps
    // the client defense-in-depth from re-stripping what the owner chose to show).
    settlement:   toPublicSafe(row.data, { full: row.gallery_share_dm === true }),
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
    publishedAt:  row.published_at,
    updatedAt:    row.updated_at || row.gallery_updated_at || row.published_at,
    viewCount:    row.view_count ?? 0,
    // Headline living-world state for the dossier hero — the one fact that
    // signals a simulated settlement, not a generator snapshot. Same derivation
    // as the list tile so card and dossier agree.
    stability:    row.stability || row.data?.viability?.stability || row.data?.systemState?.stability || row.data?.stability || '',
    description:  row.gallery_description || '',
    imageUrl:     row.gallery_image_url || '',
    imageAlt:     row.gallery_image_alt || '',
    tags:         Array.isArray(row.gallery_tags) ? row.gallery_tags : [],
    netVotes:     Math.max(0, Number(row.net_votes) || 0),
    commentCount: Math.max(0, Number(row.comment_count) || 0),
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
  if (filters.atWar) out.atWar = true;
  // Population range — only forward finite, non-negative bounds. The RPC reads
  // these as `population >= min` / `population <= max`.
  const min = Number(filters.populationMin);
  const max = Number(filters.populationMax);
  if (Number.isFinite(min) && min > 0) out.populationMin = Math.floor(min);
  if (Number.isFinite(max) && max > 0) out.populationMax = Math.floor(max);
  return out;
}

function galleryMetadataPatch(metadata = {}) {
  // Descriptions are now sanitized rich-text HTML (§4c), so allow more room
  // than the old plaintext cap; the server/render re-sanitize keeps it safe.
  const description = String(metadata.description || '').trim().slice(0, 4000);
  const imageUrl = String(metadata.imageUrl || '').trim().slice(0, 1000);
  const imageAlt = String(metadata.imageAlt || '').trim().slice(0, 220);
  const tags = Array.isArray(metadata.tags)
    ? metadata.tags
    : String(metadata.tags || '').split(',');
  const patch = {
    gallery_description: description || null,
    gallery_image_url: isSafePublicImageUrl(imageUrl) ? imageUrl : null,
    gallery_image_alt: imageAlt || null,
    gallery_tags: tags
      .map(tag => String(tag || '').trim().toLowerCase().replace(/[^a-z0-9 -]+/g, ''))
      .filter(Boolean)
      .slice(0, 12),
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
