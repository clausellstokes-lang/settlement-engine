/**
 * gallery.js - Client API for the public dossier gallery.
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

const FILTER_ARRAY_KEYS = Object.freeze(['tier', 'terrain', 'governmentType', 'magicLevel', 'stability']);

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
  return data; // slug string
}

/** Remove from the gallery. Slug is preserved server-side for re-share. */
export async function unpublishSettlement(settlementId) {
  if (!isConfigured) throw new Error('Supabase not configured');
  const { error } = await supabase.rpc('unpublish_settlement', { target_id: settlementId });
  if (error) throw new Error(error.message || 'Unpublish failed');
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
 * Fetch the curated gallery - hand-picked exemplary dossiers shown
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
 * @param {string} settlementId - The settlement to curate.
 * @param {boolean} curated     - Target state.
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
  const { error } = await supabase.rpc('bump_public_view', { slug });
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
    terrain:      row.terrain || data?.config?.terrain || data?.geography?.terrain || data?.terrain || '',
    governmentType: row.government_type || data?.powerStructure?.governmentType || data?.government?.type || data?.governmentType || '',
    magicLevel:   row.magic_level || data?.config?.magicLevel || data?.magicLevel || '',
    stability:    row.stability || data?.viability?.stability || data?.systemState?.stability || data?.stability || '',
    primaryResource: row.primary_resource || data?.config?.nearbyResources?.[0] || data?.nearbyResources?.[0] || '',
    threatLevel:  row.threat_level || data?.threatProfile?.level || data?.defense?.threatLevel || data?.threatLevel || '',
    netVotes:     Math.max(0, Number(row.net_votes) || 0),
    commentCount: Math.max(0, Number(row.comment_count) || 0),
  };
}

const PRIVATE_KEY_RE = /(secret|private|dm|gm|guidance|note|plotHook|plot_hooks|hook|compass|chronicle|pinnedNpc|aiData|aiSettlement|aiDailyLife|narrativeNotes|identityMarkers|frictionPoints|connectionsMap)/i;

function sanitizePublicValue(value, path = []) {
  if (Array.isArray(value)) {
    return value
      .map(item => sanitizePublicValue(item, path))
      .filter(item => item !== undefined);
  }
  if (!value || typeof value !== 'object') return value;

  const out = {};
  for (const [key, child] of Object.entries(value)) {
    const childPath = [...path, key];
    if (PRIVATE_KEY_RE.test(key)) continue;
    if (childPath.includes('npcs') && ['goal', 'secret', 'plotHooks', 'relationships'].includes(key)) continue;
    if (childPath.includes('history') && key === 'currentTensions') {
      out[key] = sanitizePublicValue(child, childPath);
      continue;
    }
    const sanitized = sanitizePublicValue(child, childPath);
    if (sanitized !== undefined) out[key] = sanitized;
  }
  return out;
}

function sanitizePublicSettlement(settlement) {
  const clean = sanitizePublicValue(settlement || {});
  delete clean.aiData;
  delete clean.plotHooks;
  delete clean.dmCompass;
  delete clean.dossierNotes;
  delete clean.notes;
  if (Array.isArray(clean.npcs)) {
    clean.npcs = clean.npcs.map(npc => ({
      id: npc.id,
      name: npc.name,
      role: npc.role,
      title: npc.title,
      category: npc.category,
      personality: npc.personality,
      physical: npc.physical,
      factionAffiliation: npc.factionAffiliation,
      secondaryAffiliation: npc.secondaryAffiliation,
      presentation: npc.presentation,
      influence: npc.influence,
    })).filter(npc => npc.name || npc.role);
  }
  return clean;
}

function sanitizeDossier(row) {
  return {
    id:           row.id,
    slug:         row.public_slug,
    name:         row.name,
    tier:         row.tier,
    settlement:   sanitizePublicSettlement(row.data),
    publishedAt:  row.published_at,
    updatedAt:    row.updated_at || row.gallery_updated_at || row.published_at,
    viewCount:    row.view_count ?? 0,
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
  return out;
}

function galleryMetadataPatch(metadata = {}) {
  const description = String(metadata.description || '').trim().slice(0, 1200);
  const imageUrl = String(metadata.imageUrl || '').trim().slice(0, 1000);
  const imageAlt = String(metadata.imageAlt || '').trim().slice(0, 220);
  const tags = Array.isArray(metadata.tags)
    ? metadata.tags
    : String(metadata.tags || '').split(',');
  return {
    gallery_description: description || null,
    gallery_image_url: isSafePublicImageUrl(imageUrl) ? imageUrl : null,
    gallery_image_alt: imageAlt || null,
    gallery_tags: tags
      .map(tag => String(tag || '').trim().toLowerCase().replace(/[^a-z0-9 -]+/g, ''))
      .filter(Boolean)
      .slice(0, 12),
    gallery_updated_at: new Date().toISOString(),
  };
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
