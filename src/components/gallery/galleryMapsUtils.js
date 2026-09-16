// Option catalogs + campaign facets for the gallery MAPS surfaces.
//
// Filter/sort/search now run SERVER-SIDE in list_gallery_maps (migration 065),
// mirroring the dossier feed: GalleryMaps sends its facet/search/sort state to
// the RPC and renders the returned rows directly. This module keeps only the
// pieces that stay client-side — the option catalogs, the owner-edit gate, and
// the campaign-facet derivations.
//
// SPLIT 2026-07-21 (T5, the orphaned-components ruling): the dependency-free
// filter model (BACKDROP_OPTIONS / emptyMapFilters / deriveTagVocabulary /
// activeMapFilterCount) moved to galleryMapsFilters.js so the gallery chunk
// never imports THIS module — its campaign-facet half rides the
// MapShareEditorOverlay chunk, and sharing it across both lazy chunks split
// out a new chunk whose dep-map filename broke the first-paint closure budget
// (+42 B). See galleryMapsFilters.js's header for the full rationale.
//
// Tile shape per item (list_gallery_maps): slug, name, kind ('map' |
// 'map_with_campaign'), description, tags (text[]), backdrop_kind ('image' |
// 'fmg'), thumb_url, published_at, view_count, import_count, member_count,
// importable (the owner import opt-in, migration 072). No owner id (anonymized
// server-side); member_count is the REAL member settlement count the detail RPC
// projects (migration 046).

// kind facet — 'map' is bare terrain, 'map_with_campaign' bundles the populated
// world. The third tuple slot is the helper copy GalleryMaps renders under each
// choice so a sharer knows exactly what travels with the share.
export const KIND_OPTIONS = Object.freeze([
  ['map', 'Map only', 'Bare terrain and geography. No settlements, no world state.'],
  ['map_with_campaign', 'Map and campaign', 'The map populated with its settlements, plus the living world you choose to reveal: the in-world clock, the chronicle, the pantheon, its wars and settlement network, and the dashboard.'],
]);

// The maps/campaigns sort catalog (MAP_SORT_OPTIONS) moved to the gallery-only
// galleryMapsFilters.js — the Maps and Campaigns tabs render the sort dropdown
// and ride the gallery chunk, so importing the catalog from THIS module (the
// share-editor chunk's home) would re-trigger the +42 B shared-chunk rebalance
// the split exists to prevent. See galleryMapsFilters.js's header.

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

// ── Campaign facets + suggested tags (map_with_campaign shares) ─────────────
//
// A campaign share's facets/tags are derived from the SAME real persisted data
// the campaign already carries — never owner free-text. `members` is the
// campaign's member view: [{ name, tier, settlement }], where settlement holds
// the persisted config (config.terrainType, config.culture). `campaign` carries
// mapState (backdrop kind), worldState + regionalGraph (the live war ledger).
// Mirrors suggestedTagsFor(settlement) in ShareToGallery.jsx — read what the
// engine actually persists, lowercase, de-dupe, cap at six.

import { TIER_ORDER } from '../../domain/customContentSchema.js';
import { liveSieges, liveTradeWars } from '../../domain/display/warStatus.js';
import { resolveTerrain } from '../../domain/resolveTerrain.js';
import { computeAliveness, campaignWorldAgeBand } from '../../lib/galleryAliveness.js';

/** @param {any} m a campaign member view ({ tier, settlement }) @returns {string} */
function memberTier(m) {
  return String(m?.tier || m?.settlement?.tier || '').trim().toLowerCase();
}

/** @param {any} m a campaign member view @returns {string} the persisted terrain */
function memberTerrain(m) {
  return String(resolveTerrain(m?.settlement?.config) || '').trim().toLowerCase();
}

/** @param {any} m a campaign member view @returns {string} the persisted culture */
function memberCulture(m) {
  return String(m?.settlement?.config?.culture || '').trim().toLowerCase();
}

/**
 * The most common non-empty value of `pick` across the members, ties broken by
 * first-seen order (stable). Empty string when nothing qualifies.
 * @param {Array<any>} members
 * @param {(m: any) => string} pick
 * @returns {string}
 */
function dominantBy(members, pick) {
  /** @type {Map<string, number>} */
  const counts = new Map();
  for (const m of Array.isArray(members) ? members : []) {
    const v = pick(m);
    if (v) counts.set(v, (counts.get(v) || 0) + 1);
  }
  let best = '';
  let bestN = 0;
  for (const [v, n] of counts) {
    if (n > bestN) { best = v; bestN = n; }
  }
  return best;
}

/**
 * The member-count band facet. A coarse size bucket so the gallery can filter by
 * realm scale without exposing the exact count. Mirrors the dossier facet style.
 * @param {Array<any>} members
 * @returns {'hamlet-cluster' | 'small-realm' | 'large-realm'}
 */
export function memberBand(members = []) {
  const n = Array.isArray(members) ? members.length : 0;
  if (n <= 3) return 'hamlet-cluster';
  if (n <= 8) return 'small-realm';
  return 'large-realm';
}

/**
 * The live at-war facet for the campaign — true when the campaign's persisted
 * world ledger carries any confirmed siege or any flipped trade war. Reads the
 * same projection ShareToGallery uses for the dossier atWar facet, so a campaign
 * and its members agree. Tolerates a dormant / absent world (⇒ false).
 * @param {any} campaign
 * @returns {boolean}
 */
export function atWar(campaign) {
  const worldState = campaign?.worldState || null;
  const regionalGraph = campaign?.regionalGraph || campaign?.worldState?.regionalGraph || null;
  if (!worldState && !regionalGraph) return false;
  const sieges = liveSieges({ worldState, regionalGraph });
  if (Array.isArray(sieges) && sieges.length > 0) return true;
  const tradeWars = liveTradeWars({ worldState, regionalGraph });
  return Array.isArray(tradeWars) && tradeWars.length > 0;
}

/**
 * The dominant culture across the member settlements (the most common persisted
 * config.culture). Empty string when no member declares one.
 * @param {Array<any>} members
 * @returns {string}
 */
export function dominantCulture(members = []) {
  return dominantBy(members, memberCulture);
}

/**
 * The tier spread facet — 'uniform' when every member shares one tier, otherwise
 * a `<lowest>-to-<highest>` span ordered by TIER_ORDER (e.g. "hamlet-to-city").
 * Empty string when no member carries a recognized tier.
 * @param {Array<any>} members
 * @returns {string}
 */
export function tierSpread(members = []) {
  const present = [];
  for (const m of Array.isArray(members) ? members : []) {
    const t = memberTier(m);
    const rank = TIER_ORDER.indexOf(t);
    if (rank !== -1) present.push({ tier: t, rank });
  }
  if (present.length === 0) return '';
  present.sort((a, b) => a.rank - b.rank);
  const low = present[0].tier;
  const high = present[present.length - 1].tier;
  return low === high ? 'uniform' : `${low}-to-${high}`;
}

/**
 * Up to six suggested tags for a map_with_campaign share, derived entirely from
 * real persisted data — never owner free-text. Mirrors suggestedTagsFor in
 * ShareToGallery.jsx: read the attributes the engine actually writes, lowercase,
 * de-dupe, cap at six. The order favors the most identifying facets first
 * (terrain, scale band, dominant culture, war posture, tier spread) so a trimmed
 * list keeps the strongest signals.
 * @param {any} campaign the owning campaign (mapState, worldState, regionalGraph)
 * @param {Array<any>} members the campaign member view ([{ name, tier, settlement }])
 * @returns {string[]}
 */
export function suggestedTagsForCampaign(campaign = {}, members = []) {
  const list = Array.isArray(members) ? members : [];
  const terrain = dominantBy(list, memberTerrain);
  // Backdrop kind — a custom uploaded image vs procedurally generated terrain.
  const backdropTag = campaign?.mapState?.customBackdrop?.imageUrl
    ? 'image map'
    : (campaign?.mapState?.fmgSnapshot ? 'generated terrain' : '');
  const culture = dominantCulture(list);
  const spread = tierSpread(list);
  const candidates = [
    terrain,
    memberBand(list),
    culture,
    atWar(campaign) ? 'at war' : 'peaceful',
    spread,
    backdropTag,
  ];
  const seen = new Set();
  const out = [];
  for (const raw of candidates) {
    const norm = String(raw || '').trim().toLowerCase();
    if (!norm || seen.has(norm)) continue;
    seen.add(norm);
    out.push(norm);
    if (out.length >= 6) break;
  }
  return out;
}

/**
 * The campaign facet snapshot for a map_with_campaign publish — the values
 * galleryMapMetadataPatch would store so the gallery can filter on them without
 * recomputing live campaign state. Captured at publish time from the persisted
 * data, mirroring the dossier facet snapshot in ShareToGallery.jsx.
 * @param {any} campaign
 * @param {Array<any>} members
 * @returns {{ memberBand: string, atWar: boolean, dominantCulture: string, tierSpread: string,
 *             aliveness: number | null, worldAge: string | null }}
 */
export function campaignFacets(campaign = {}, members = []) {
  const list = Array.isArray(members) ? members : [];
  return {
    memberBand: memberBand(list),
    atWar: atWar(campaign),
    dominantCulture: dominantCulture(list),
    tierSpread: tierSpread(list),
    // GALLERY-2 phase 2 (147/149): the aliveness snapshot + world-age band from
    // the campaign's live worldState — the SAME shared derivations the dossier
    // path uses (lib/galleryAliveness.js), so the two snapshots never diverge.
    aliveness: computeAliveness(campaign),
    worldAge: campaignWorldAgeBand(campaign),
  };
}
