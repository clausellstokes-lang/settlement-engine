/**
 * domain/resourceSites.js — MF-T2N: the resource LOCATION deriver.
 *
 * A Shape-1 PURE DERIVER at the domain root (the ageBands.js precedent; charter
 * draft-PRODUCERS-PLAN §3, ruled at ODQ §433 C2). It answers WHERE a settlement's
 * nearby resource actually sits — a compass bearing, a distance band and the
 * terrain family — for every entry the settlement already carries in
 * `config.nearbyResources` (written back by generators/steps/resolveResources.js).
 *
 * NOTHING IS STORED. The sites are re-derived from stored facts on every call,
 * identically, forever: same settlement facts → same sites across processes and
 * sessions. THE PROMISE holds trivially — a seed is a starting world, and its
 * seams sit where its seed put them.
 *
 * THE GOLDEN TRAP, AND WHY GENERATION NEVER IMPORTS THIS LEAF: the generator
 * golden hashes JSON.stringify(settlement) WHOLE, so a stored site would flip
 * every manifest row. This leaf is imported by nothing on the generation path
 * (foundingCatalog.js's law: golden-inert BY CONSTRUCTION) and lands DARK; the
 * dossier pool that speaks it is a content-train car (ODQ §433 C3).
 *
 * THE RULES ARE FROZEN v1 — `sourceKind: 'DERIVED_V1'` rides in every record.
 * Changing any rule below (the wind count, the admissible band sets, the anchor
 * precedence, the hash) is a DECLARED SHIFT by construction and mints a v2 kind;
 * it never silently moves a v1 site.
 *
 * FINITE-SEMANTICS: every field is a closed vocabulary. There are no free numbers
 * and no tuning constants — the hash picks UNIFORMLY BY MODULUS within a
 * type-bounded set, the spatial octant idiom (spatialSubstrateRead.approachOctant).
 *
 * THE DERIVER CANNOT INVENT (WF-1A's refusal discipline): a resource absent from
 * the roster yields no site; a malformed roster yields []; never a throw.
 * Depletion is NOT read — a worked-out seam still sits where it sits (location is
 * not condition; join by key to resourceSemantics.nativeResourceConditionRecords).
 *
 * IDENTITY: the seed-stable `settlement.id` (normalizeSettlement's
 * idFromSeed(_seed), attached at assembleSettlement) leads, so a RENAME never
 * moves a site; `name` is the fallback for an un-normalised object only.
 *
 * PURE: no Date, no Math.random, no Intl, no I/O, no store. Every import is an
 * import-free leaf (stablePart, resourceSemantics, resourceData, geographyData).
 */

import { RESOURCE_DATA } from '../data/resourceData.js';
import { TERRAIN_DATA } from '../data/geographyData.js';
import { resourceSemanticsFor } from './resourceSemantics.js';
import { stablePart } from './worldPulse/stablePart.js';

/** The derivation version every record carries. A rule change mints a new kind. */
export const RESOURCE_SITE_SOURCE_KIND = 'DERIVED_V1';

/** The EIGHT winds, clockwise from north. Index = the hash's octant. */
export const RESOURCE_SITE_BEARINGS = Object.freeze(
  ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'],
);

/** The distance bands, nearest first. */
export const RESOURCE_SITE_BANDS = Object.freeze(['AT_HAND', 'NEAR', 'DAYS_REACH']);

/** The typed gap when neither the resource nor the settlement names a terrain. */
export const UNANCHORED = 'UNANCHORED';

/** The terrain families a site may sit in: the landed terrain table plus the gap. */
export const RESOURCE_SITE_TERRAIN_ANCHORS = Object.freeze(
  [...Object.keys(TERRAIN_DATA), UNANCHORED],
);

/** The semantic type of a resource the roster names but the native table does not know. */
export const UNTYPED_RESOURCE = 'UNTYPED';

/**
 * Which bands a resource of each semantic TYPE may sit in. The type vocabulary is
 * resourceSemantics.js's (pinned by resourceTaxonomyClassification.test.js). A
 * POSITIONAL resource (harbour, crossroads, pass, oasis, spring) is OCCUPIED by the
 * settlement; INFRASTRUCTURE (a mill site) is built at its water; a RENEWABLE field
 * or forest is the working hinterland; an EXHAUSTIBLE seam or quarry — and a
 * MAGICAL node — is worked from a distance. An UNTYPED (custom) resource is
 * unconstrained. The seed's hash picks WITHIN the set; the set is grammar, not a dial.
 * @type {Readonly<Record<string, ReadonlyArray<string>>>}
 */
export const ADMISSIBLE_BANDS_BY_TYPE = Object.freeze({
  positional: Object.freeze(['AT_HAND']),
  infrastructure: Object.freeze(['AT_HAND']),
  renewable: Object.freeze(['AT_HAND', 'NEAR']),
  exhaustible: Object.freeze(['NEAR', 'DAYS_REACH']),
  magical: Object.freeze(['NEAR', 'DAYS_REACH']),
  [UNTYPED_RESOURCE]: RESOURCE_SITE_BANDS,
});

/**
 * @typedef {object} ResourceSite
 * @property {string} resource the roster entry, verbatim
 * @property {string} bearing one of RESOURCE_SITE_BEARINGS
 * @property {string} band one of RESOURCE_SITE_BANDS
 * @property {string} terrainAnchor one of RESOURCE_SITE_TERRAIN_ANCHORS
 * @property {'DERIVED_V1'} sourceKind the frozen derivation version
 */

/**
 * The stored facts the deriver reads. Every field is narrowed in-body; a shape
 * that carries none of them yields [].
 * @typedef {object} ResourceSiteInput
 * @property {unknown} [id]
 * @property {unknown} [name]
 * @property {{ nearbyResources?: unknown, terrainType?: unknown } | null} [config]
 */

/**
 * FNV-1a 32-bit with Murmur3's fmix32 avalanche — the estate's pure
 * variant-selection idiom (heraldCausalGrammar.js, spatialSubstrateRead.js),
 * restated here so the leaf stays import-light. The avalanche kills FNV's
 * low-bit parity so a modulus over the low bits is a fair pick.
 * @param {string} str
 * @returns {number} an unsigned 32-bit integer
 */
function mixedHash32(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i += 1) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  h ^= h >>> 16;
  h = Math.imul(h, 0x85ebca6b) >>> 0;
  h ^= h >>> 13;
  h = Math.imul(h, 0xc2b2ae35) >>> 0;
  h ^= h >>> 16;
  return h >>> 0;
}

/**
 * @param {unknown} value
 * @returns {value is string}
 */
const isNonEmptyString = (value) => typeof value === 'string' && value.length > 0;

/**
 * The seed-stable identity: `id` leads (a rename never moves a site), `name`
 * follows for an un-normalised object, and stablePart's own 'unknown' closes it.
 * @param {ResourceSiteInput} settlement
 * @returns {string}
 */
function identityOf(settlement) {
  if (isNonEmptyString(settlement.id)) return settlement.id;
  if (isNonEmptyString(settlement.name)) return settlement.name;
  return stablePart(null);
}

/** The native table, read only for each resource's OWN terrain tie. */
const RESOURCE_TERRAIN_TIES =
  /** @type {Readonly<Record<string, { terrain?: string, terrainRequired?: ReadonlyArray<string> }>>} */ (
    RESOURCE_DATA
  );

/**
 * The terrain family the site sits in. The resource's OWN single tie outranks the
 * settlement's terrain because it is a stored data fact about where that resource
 * sits (a desert oasis, a mountain pasture, a coastal fishery); a resource with no
 * tie, or with several, sits in the settlement's own terrain family.
 * @param {string} resource
 * @param {unknown} settlementTerrain
 * @returns {string}
 */
function terrainAnchorOf(resource, settlementTerrain) {
  const tie = RESOURCE_TERRAIN_TIES[resource];
  if (tie) {
    if (isNonEmptyString(tie.terrain)) return tie.terrain;
    if (Array.isArray(tie.terrainRequired) && tie.terrainRequired.length === 1) {
      return tie.terrainRequired[0];
    }
  }
  if (isNonEmptyString(settlementTerrain)
    && RESOURCE_SITE_TERRAIN_ANCHORS.includes(settlementTerrain)
    && settlementTerrain !== UNANCHORED) {
    return settlementTerrain;
  }
  return UNANCHORED;
}

/**
 * The closed semantic type of a roster entry — the native table's, resolved by
 * key or reviewed label alias, or UNTYPED for a custom resource it does not know.
 * @param {string} resource
 * @returns {string}
 */
function semanticTypeOf(resource) {
  return resourceSemanticsFor(resource)?.type ?? UNTYPED_RESOURCE;
}

/**
 * Derive one typed site per roster entry. Total: never throws; a malformed or
 * empty roster yields []. Order is the roster's own stored order; a duplicate
 * entry collapses to its first occurrence; a non-string entry yields no site.
 * @param {ResourceSiteInput | null | undefined} settlement
 * @returns {ResourceSite[]}
 */
export function deriveResourceSites(settlement) {
  if (!settlement || typeof settlement !== 'object') return [];
  const roster = settlement.config?.nearbyResources;
  if (!Array.isArray(roster) || roster.length === 0) return [];
  const identity = identityOf(settlement);
  const settlementTerrain = settlement.config?.terrainType;
  /** @type {ResourceSite[]} */
  const sites = [];
  const seen = new Set();
  for (const entry of roster) {
    if (!isNonEmptyString(entry) || seen.has(entry)) continue;
    seen.add(entry);
    const token = `${identity}|${stablePart(entry)}`;
    const bearing = RESOURCE_SITE_BEARINGS[mixedHash32(token) % RESOURCE_SITE_BEARINGS.length];
    const admissible = ADMISSIBLE_BANDS_BY_TYPE[semanticTypeOf(entry)]
      ?? ADMISSIBLE_BANDS_BY_TYPE[UNTYPED_RESOURCE];
    const band = admissible[mixedHash32(`${token}|band`) % admissible.length];
    sites.push({
      resource: entry,
      bearing,
      band,
      terrainAnchor: terrainAnchorOf(entry, settlementTerrain),
      sourceKind: RESOURCE_SITE_SOURCE_KIND,
    });
  }
  return sites;
}
