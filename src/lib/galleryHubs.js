/**
 * lib/galleryHubs.js — the programmatic FACET HUB manifest (GALLERY-2 phase 2).
 *
 * Each hub is a crawlable landing page listing the public dossiers matching one
 * high-value facet — a browse-and-index surface per facet value, not a new
 * query engine (each locks existing list_gallery_dossiers filters/sort).
 *
 * THE HUB SET (enumerated from the existing facet machinery):
 *   • terrain kinds  — /gallery/terrain/:kind   (TERRAIN_OPTIONS, 7)
 *   • tiers          — /gallery/tier/:tier      (TIER_OPTIONS, 6)
 *   • at war         — /gallery/at-war          (the gallery_facet_at_war facet)
 *   • most alive     — /gallery/most-alive      (the 'most_alive' sort, 148)
 * = 15 hubs. The option arrays are imported from the CANONICAL vocabulary
 * module (components/gallery/galleryUtils.js — zero-import, node-safe), so a
 * facet vocabulary change reshapes the hub set automatically.
 *
 * CONSUMERS:
 *   • src/lib/routes.js — PARAM_ROUTES matchers (placed BEFORE the dossier
 *     slug route: /gallery/at-war would otherwise match the slug pattern).
 *   • scripts/generate-sitemap.mjs — emits every hub URL (static +
 *     deterministic — no network, unlike the per-slug gallery fan-out).
 *   • components/gallery/GalleryHubPage.jsx — resolves a hub id to its query
 *     + copy.
 *
 * Pure data. No React, no DOM — importable by the node-side generator.
 */

import { TERRAIN_OPTIONS, TIER_OPTIONS } from '../components/gallery/galleryUtils.js';

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1).replace(/_/g, ' ');

/**
 * @typedef {{ id: string, path: string, title: string, blurb: string,
 *   query: { filters?: Record<string, unknown>, sort?: string } }} GalleryHub
 */

/** @type {ReadonlyArray<GalleryHub>} */
export const GALLERY_HUBS = Object.freeze([
  ...TERRAIN_OPTIONS.map(kind => Object.freeze({
    id: `terrain-${kind}`,
    path: `/gallery/terrain/${kind}`,
    title: `${cap(kind)} Settlements`,
    blurb: `Public D&D settlements raised on ${kind.replace(/_/g, ' ')} terrain — browse, react, and import them into your own campaign.`,
    query: Object.freeze({ filters: Object.freeze({ terrain: Object.freeze([kind]) }) }),
  })),
  ...TIER_OPTIONS.map(tier => Object.freeze({
    id: `tier-${tier}`,
    path: `/gallery/tier/${tier}`,
    title: `${cap(tier)} Settlements`,
    blurb: `Every public ${tier} in the gallery — settlements of ${tier} scale, shared by their DMs.`,
    query: Object.freeze({ filters: Object.freeze({ tier: Object.freeze([tier]) }) }),
  })),
  Object.freeze({
    id: 'at-war',
    path: '/gallery/at-war',
    title: 'Settlements at War',
    blurb: 'Public settlements published from campaigns whose realms are at war — sieges underway, trade wars flipped.',
    query: Object.freeze({ filters: Object.freeze({ atWar: true }) }),
  }),
  Object.freeze({
    id: 'most-alive',
    path: '/gallery/most-alive',
    title: 'The Most Alive Worlds',
    blurb: 'Settlements from the most deeply simulated campaigns — ranked by lived world-time and pulse history, not clicks.',
    query: Object.freeze({ sort: 'most_alive' }),
  }),
]);

/** path → hub lookup (frozen). */
export const HUB_BY_PATH = Object.freeze(
  Object.fromEntries(GALLERY_HUBS.map(h => [h.path, h])),
);

/**
 * Resolve the hub for a route params.hub descriptor ({ facet, value? }).
 * @param {{ facet?: string, value?: string } | null | undefined} hubParam
 * @returns {GalleryHub | null}
 */
export function resolveHub(hubParam) {
  if (!hubParam || typeof hubParam !== 'object') return null;
  const { facet, value } = hubParam;
  const path = value ? `/gallery/${facet}/${value}` : `/gallery/${facet}`;
  return HUB_BY_PATH[path] || null;
}
