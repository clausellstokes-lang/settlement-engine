/**
 * domain/townMap/institutionAssignment.js — the TOTAL institution→district
 * assigner (the one genuinely new derivation this feature needs).
 *
 * districtProfile's `inferInstitutions` is a fuzzy name-stem matcher: it links an
 * institution to a quarter only when a >4-char word of the institution's name
 * literally appears in the quarter's name/landmarks. That is right for prose
 * (most institutions correctly attach to nothing) but fatal for a MAP, where
 * every building must stand somewhere. This assigner is TOTAL: every institution
 * lands in exactly one district, chosen by a category-affinity table with
 * codepoint tie-breaks and a per-anchor seeded residual draw, and — when the
 * settlement has no quarters at all (common at thorp/hamlet) — floored to a
 * single synthetic hamlet-cluster district so the buildings still have ground.
 *
 * Pure + deterministic: iteration is codepoint-ordered and the residual rng draw
 * is seeded PER ANCHOR (not by array position), so adding or removing one
 * institution never re-homes the others — anchor stability by construction.
 */

import { compareCodepoint } from '../deterministicSort.js';
import { anchorForInstitution } from './anchors.js';

/** @typedef {ReturnType<typeof import('../../kernel/prng.js').createPRNG>} Rng */

/**
 * @typedef {Object} AssignableInstitution
 * @property {string} [name]
 * @property {string} [catalogId]
 * @property {string} [localUid]
 * @property {string} [priorityCategory]  economy|crafts|trade|military|government|noble|religion|religious|magic|criminal
 */

/**
 * @typedef {Object} AssignableDistrict
 * @property {string} id
 * @property {string} [category]  one of DISTRICT_CATEGORIES
 */

/**
 * @typedef {Object} InstitutionPlacement
 * @property {string} anchorKey    the institution's stable anchor
 * @property {string} districtId   the district it was assigned to
 */

/**
 * @typedef {Object} SyntheticDistrict
 * @property {string} id
 * @property {string} name
 * @property {string} category
 */

/**
 * @typedef {Object} AssignmentResult
 * @property {InstitutionPlacement[]} placements  one entry per institution, anchorKey-sorted
 * @property {boolean} floored                    true when the hamlet-cluster floor was used
 * @property {SyntheticDistrict | null} syntheticDistrict  the floor district, or null
 */

/**
 * Institution `priorityCategory` → ranked preferred district categories (best
 * first). The assigner places each institution in the FIRST ranked category a
 * real district provides; within that category the codepoint-lowest district id
 * wins the tie. An institution whose ranking matches no present district falls
 * through to the seeded residual draw.
 *
 * The ranking is a deliberate design choice: each priority leads with its home
 * category, then degrades toward the civic/residential/other commons that almost
 * every settlement has, so a missing specialist quarter never strands a building.
 * @type {Readonly<Record<string, readonly string[]>>}
 */
export const CATEGORY_AFFINITY = Object.freeze({
  economy:    Object.freeze(['merchant', 'civic', 'craft', 'residential', 'other']),
  trade:      Object.freeze(['merchant', 'foreign', 'civic', 'residential', 'other']),
  crafts:     Object.freeze(['craft', 'industrial', 'merchant', 'residential', 'other']),
  military:   Object.freeze(['military', 'civic', 'noble', 'residential', 'other']),
  government: Object.freeze(['civic', 'noble', 'military', 'residential', 'other']),
  noble:      Object.freeze(['noble', 'civic', 'residential', 'merchant', 'other']),
  religion:   Object.freeze(['religious', 'civic', 'noble', 'residential', 'other']),
  religious:  Object.freeze(['religious', 'civic', 'noble', 'residential', 'other']),
  magic:      Object.freeze(['arcane', 'civic', 'noble', 'residential', 'other']),
  criminal:   Object.freeze(['criminal', 'residential', 'foreign', 'merchant', 'other']),
});

/** Ranking for an unknown/absent priorityCategory — lands in the commons. */
const FALLBACK_AFFINITY = Object.freeze(['other', 'residential', 'civic', 'merchant']);

/** The synthetic floor district id — a quarter-less settlement's single cluster. */
export const HAMLET_CLUSTER_ID = 'district.hamlet-cluster';

/**
 * Total, deterministic institution→district assignment.
 *
 * GUARANTEE (pinned invariant): every institution's anchorKey appears exactly
 * once in `placements`; none dropped, none duplicated. `placements.length`
 * equals `institutions.length`.
 *
 * @param {AssignableInstitution[]} institutions
 * @param {AssignableDistrict[]} districts   the derived districts (may be empty)
 * @param {Rng} rng                          a forked town-map PRNG (seeded upstream)
 * @returns {AssignmentResult}
 */
export function assignInstitutionsToDistricts(institutions, districts, rng) {
  const roster = Array.isArray(institutions) ? institutions : [];
  const realDistricts = Array.isArray(districts) ? districts : [];

  // Floor: a quarter-less settlement collapses to a single synthetic cluster so
  // every building still stands somewhere (flagged, so the model can render a
  // building-scatter cluster rather than a partitioned town).
  const floored = realDistricts.length === 0 && roster.length > 0;
  const syntheticDistrict = floored
    ? { id: HAMLET_CLUSTER_ID, name: 'Settlement Cluster', category: 'residential' }
    : null;
  /** @type {AssignableDistrict[]} */
  const placementDistricts = floored
    ? [{ id: HAMLET_CLUSTER_ID, category: 'residential' }]
    : realDistricts;

  // District ids grouped by category (each list codepoint-sorted for stable
  // ties) plus a flat codepoint-sorted id list for residual draws.
  /** @type {Record<string, string[]>} */
  const idsByCategory = {};
  /** @type {string[]} */
  const allIds = [];
  for (const d of placementDistricts) {
    const id = String(d?.id ?? '');
    if (id === '') continue;
    const category = typeof d?.category === 'string' ? d.category : 'other';
    if (!idsByCategory[category]) idsByCategory[category] = [];
    idsByCategory[category].push(id);
    allIds.push(id);
  }
  for (const category of Object.keys(idsByCategory)) idsByCategory[category].sort(compareCodepoint);
  allIds.sort(compareCodepoint);

  // Anchor each institution, then iterate in codepoint order of anchorKey so any
  // residual draw sequence is stable across runs.
  const anchored = roster.map((inst) => ({ anchorKey: anchorForInstitution(inst), inst }));
  anchored.sort((a, b) => compareCodepoint(a.anchorKey, b.anchorKey));

  /** @type {InstitutionPlacement[]} */
  const placements = [];
  for (const { anchorKey, inst } of anchored) {
    const priority = typeof inst?.priorityCategory === 'string' ? inst.priorityCategory : '';
    const ranking = CATEGORY_AFFINITY[priority] || FALLBACK_AFFINITY;
    let districtId = '';
    for (const category of ranking) {
      const ids = idsByCategory[category];
      if (ids && ids.length > 0) { districtId = ids[0]; break; }
    }
    if (districtId === '' && allIds.length > 0) {
      // No affine district present — a per-anchor seeded residual draw among the
      // existing districts. Seeding by anchorKey (not array position) keeps this
      // institution's home fixed as the roster changes around it.
      districtId = allIds.length === 1
        ? allIds[0]
        : (rng.fork(`residual:${anchorKey}`).pick(allIds) ?? allIds[0]);
    }
    placements.push({ anchorKey, districtId });
  }

  return { placements, floored, syntheticDistrict };
}
