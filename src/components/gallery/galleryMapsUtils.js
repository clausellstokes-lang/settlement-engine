// Option catalogs + active-filter count for the gallery MAPS tab.
//
// Filter/sort/search now run SERVER-SIDE in list_gallery_maps (migration 065),
// mirroring the dossier feed: GalleryMaps sends its facet/search/sort state to
// the RPC and renders the returned rows directly. This module keeps only the
// pieces that stay client-side — the option catalogs, the dynamic tag vocabulary,
// the active-filter count, and the owner-edit gate.
//
// Tile shape per item (list_gallery_maps): slug, name, kind ('map' |
// 'map_with_campaign'), description, tags (text[]), backdrop_kind ('image' |
// 'fmg'), thumb_url, published_at, view_count, import_count, member_count. No
// owner id (anonymized server-side); member_count is the REAL member settlement
// count the detail RPC projects (migration 046).

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

// Sort options, all applied server-side (migration 065). 'most_imported' orders
// by the real import_count; 'most_viewed' by view_count; newest is the default
// published_at desc order.
export const MAP_SORT_OPTIONS = Object.freeze([
  ['newest', 'Newest'],
  ['most_viewed', 'Most viewed'],
  ['most_imported', 'Most imported'],
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
