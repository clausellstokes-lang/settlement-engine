// Client-side faceting for the gallery MAPS tab.
//
// Unlike the dossier feed, list_gallery_maps(p_page,p_page_size) accepts only
// pagination — no sort/search/filter args (migration 045). The maps list is one
// non-paginated batch (server cap 60), and GalleryMaps fetches that full cap, so
// all faceting runs client-side over the whole batch — counts, the empty state,
// and most_viewed stay globally true rather than reflecting a truncated head.
// FLAG: server-side map filtering would need new RPC params
// (sort_key/search_query/filters), deferred as unnecessary at current scale.
//
// Tile shape per item (list_gallery_maps): slug, name, kind ('map' |
// 'map_with_campaign'), description, tags (text[]), backdrop_kind ('image' |
// 'fmg'), thumb_url, published_at, view_count. No owner id, no member count.

// kind facet — 'map' is a blank canvas, 'map_with_campaign' bundles settlements.
// '&' renders as 'and' per the house voice.
export const KIND_OPTIONS = Object.freeze([
  ['map', 'Blank map'],
  ['map_with_campaign', 'Map and campaign'],
]);

// backdrop_kind facet — an uploaded image vs procedurally generated terrain.
export const BACKDROP_OPTIONS = Object.freeze([
  ['image', 'Image backdrop'],
  ['fmg', 'Generated terrain'],
]);

// Sort options. FLAG: the tile carries no import/clone count — view_count is the
// only count — so 'most_viewed' (view_count desc) stands in for the requested
// 'most imported'. Both options are stable; newest mirrors the default order.
export const MAP_SORT_OPTIONS = Object.freeze([
  ['newest', 'Newest'],
  ['most_viewed', 'Most viewed'],
]);

export function human(value) {
  return String(value || '').replace(/_/g, ' ');
}

/**
 * Build a strict slug -> owned-campaign lookup for the gallery edit gate.
 *
 * The gallery RPCs anonymize every tile (no user_id, no campaign id), so
 * ownership is proven entirely client-side: a signed-in user owns a tile only
 * when one of their own loaded campaigns is currently public under that slug.
 * Anonymous users have no matching campaigns, so the map stays empty and the
 * Edit affordance never shows. This is UX-correct defense-in-depth; the publish
 * RPCs remain owner-gated on auth.uid() server-side.
 *
 * @param {Array} campaigns the signed-in user's own loaded campaigns
 * @returns {Map<string, object>} publicSlug -> owned campaign
 */
export function ownedCampaignBySlug(campaigns = []) {
  const map = new Map();
  for (const c of Array.isArray(campaigns) ? campaigns : []) {
    if (c && c.isPublic === true && typeof c.publicSlug === 'string' && c.publicSlug) {
      map.set(c.publicSlug, c);
    }
  }
  return map;
}

/**
 * The union of tags across the fetched items, lowercased and de-duped, sorted
 * for a stable chip order. The maps vocabulary is dynamic (owner-authored), not
 * a fixed catalog, so it is derived from the batch rather than declared.
 */
export function deriveTagVocabulary(items = []) {
  const seen = new Set();
  for (const item of Array.isArray(items) ? items : []) {
    const tags = Array.isArray(item?.tags) ? item.tags : [];
    for (const tag of tags) {
      const norm = String(tag || '').trim().toLowerCase();
      if (norm) seen.add(norm);
    }
  }
  return Array.from(seen).sort();
}

/** Count of active facets — drives the "Clear" affordance and section badges. */
export function activeMapFilterCount(filters = {}) {
  let sum = 0;
  sum += Array.isArray(filters.kind) ? filters.kind.length : 0;
  sum += Array.isArray(filters.backdrop) ? filters.backdrop.length : 0;
  sum += Array.isArray(filters.tags) ? filters.tags.length : 0;
  sum += filters.hasSettlements ? 1 : 0;
  return sum;
}

function matchesSearch(item, query) {
  const q = String(query || '').trim().toLowerCase();
  if (!q) return true;
  const tags = Array.isArray(item?.tags) ? item.tags.join(' ') : '';
  const haystack = `${item?.name || ''} ${item?.description || ''} ${tags}`.toLowerCase();
  return haystack.includes(q);
}

function publishedTime(item) {
  const t = new Date(item?.published_at || 0).getTime();
  return Number.isFinite(t) ? t : 0;
}

/**
 * Apply the facet filters, free-text search, and sort to the fetched batch.
 * Returns a new array (never mutates the input).
 *
 * @param {Array} items
 * @param {{ filters?: Object, search?: string, sort?: string }} [opts]
 */
export function applyMapFilters(items = [], { filters = {}, search = '', sort = 'newest' } = {}) {
  const list = Array.isArray(items) ? items.slice() : [];

  const kind = Array.isArray(filters.kind) ? filters.kind : [];
  const backdrop = Array.isArray(filters.backdrop) ? filters.backdrop : [];
  const tags = (Array.isArray(filters.tags) ? filters.tags : []).map(t => String(t).toLowerCase());
  const hasSettlements = !!filters.hasSettlements;

  const filtered = list.filter(item => {
    if (kind.length && !kind.includes(item?.kind)) return false;
    if (backdrop.length && !backdrop.includes(item?.backdrop_kind)) return false;
    // Has-settlements is the only available proxy for member presence — the tile
    // carries no member count, so it narrows to map_with_campaign. FLAG: true
    // member-count filtering would require an RPC column.
    if (hasSettlements && item?.kind !== 'map_with_campaign') return false;
    if (tags.length) {
      const itemTags = (Array.isArray(item?.tags) ? item.tags : []).map(t => String(t).toLowerCase());
      const hasAny = tags.some(t => itemTags.includes(t));
      if (!hasAny) return false;
    }
    if (!matchesSearch(item, search)) return false;
    return true;
  });

  if (sort === 'most_viewed') {
    filtered.sort((a, b) => (Number(b?.view_count) || 0) - (Number(a?.view_count) || 0));
  } else {
    // 'newest' — published_at desc, the default server order.
    filtered.sort((a, b) => publishedTime(b) - publishedTime(a));
  }

  return filtered;
}
