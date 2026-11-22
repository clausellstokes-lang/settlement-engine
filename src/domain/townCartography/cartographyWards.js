/**
 * townCartography/cartographyWards.js — TC-3a, THE WARD LOWERING AND THE NAMING.
 *
 * THE ONE LAW (DESIGN_TOWN_CARTOGRAPHY §1) decides this file's whole shape: the
 * cartography layers are a SYNTHESIS STAGE INSIDE the TownSceneManifest, never a
 * parallel town generator. So this stage does NOT partition space a second time. The
 * canonical districts the manifest already publishes ARE the wards — a ward is a
 * district drawn in ink — and this module lowers each one verbatim. A second district
 * graph or a street-face partitioner would be exactly the fork the ONE LAW prevents.
 *
 * ── THE PREMISES ARE CHECKED, NEVER REPAIRED ─────────────────────────────────
 * A ward source that is concave, over the vertex cap, or holds its own centroid
 * outside its polygon THROWS rather than being quietly reshaped into something the
 * dossier never agreed to. TC-3b's carving is a theorem about a convex fan, and a
 * silently repaired source would turn that theorem into a coincidence.
 *
 * ── THE POOLS ARE INJECTED, NEVER IMPORTED (CR-TC3A-1) ───────────────────────
 * `namingPools` arrives as an argument from above the lazy boundary. Importing
 * src/data/namingData.js here would drag a 68,656-byte table into the bounded
 * manifest-compiler chunk, which is the measured reason this module exists as a
 * separate leaf at all. The canonical home of the pools stays src/data/namingData.js;
 * nothing here copies, mutates, digests, or stores them.
 *
 * Pure and headless: no store, no clock, no randomness beyond the two named naming
 * forks, no I/O, no module-scope mutable state. Zero any-casts.
 *
 * @enforced-by tests/domain/townCartographyWards.test.js
 * @enforced-by tests/domain/townCartographyDeterminism.test.js
 */

import { createPRNG } from '../../kernel/prng.js';
import { TOWN_CARTOGRAPHY_WARD_KINDS } from '../townScene/cartographyContract.js';
import { scenePointInPolygon } from '../townScene/sceneCompilePrimitives.js';
import {
  byCodepoint,
  generatedProvenance,
  list,
  planPolygon,
  premise,
  record,
  roundedMean,
  sourceDistricts,
} from './cartographyPlan.js';
import { TOWN_CARTOGRAPHY_TUNING, cartographyBand } from './cartographyTuning.js';

const T = TOWN_CARTOGRAPHY_TUNING;

/**
 * THE TWO NAMED NAMING FORKS. Each is a single-colon label: `fork('a::b')` derives
 * the same seed string a fork CHAIN derives (kernel/prng.js's delimiter contract),
 * so a family embedding the delimiter could silently alias another stream. These
 * never do, and the determinism scan pins it.
 */
const STREET_NAME_FORK = 'carto:names:street';
const WARD_NAME_FORK = 'carto:names:ward';

/** The culture whose non-empty pools are the final naming fallback. */
const DEFAULT_CULTURE = 'germanic';

/**
 * @typedef {import('./cartographyPlan.js').PlanPoint} PlanPoint
 * @typedef {import('./cartographyPlan.js').SourceDistrict} SourceDistrict
 * @typedef {{ prefixes: string[], suffixes: string[] }} NamePools
 * @typedef {{ id: string, kind: string, name: string, polygon: PlanPoint[],
 *   tonePermille: number, districtId: string|null, lynchElement: string,
 *   provenance: import('./cartographyPlan.js').CartographyProvenance,
 *   decidedBy: string }} CartographyWardRow
 */

/**
 * A convex polygon has cross products of one sign (zero, for a collinear vertex,
 * is compatible with both). Integer arithmetic only: a float predicate here would
 * make convexity engine-dependent for the same seed.
 * @param {PlanPoint[]} polygon
 * @returns {boolean}
 */
function isConvexPolygon(polygon) {
  let negative = false;
  let positive = false;
  for (let index = 0; index < polygon.length; index++) {
    const a = polygon[index];
    const b = polygon[(index + 1) % polygon.length];
    const c = polygon[(index + 2) % polygon.length];
    const cross = (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
    if (cross < 0) negative = true;
    if (cross > 0) positive = true;
  }
  return !(negative && positive);
}

/** @param {unknown} value @returns {string[]} */
function stringPool(value) {
  /** @type {string[]} */
  const pool = [];
  for (const raw of list(value)) {
    if (typeof raw !== 'string') continue;
    const trimmed = raw.trim();
    if (trimmed) pool.push(trimmed);
  }
  return pool;
}

/** @param {Record<string, unknown>} pools @param {string} key @returns {NamePools} */
function poolsForCulture(pools, key) {
  const entry = record(
    Object.prototype.hasOwnProperty.call(pools, key) ? pools[key] : null,
  );
  return {
    prefixes: stringPool(entry.settlementPrefixes),
    suffixes: stringPool(entry.settlementSuffixes),
  };
}

/**
 * THE CULTURE RESOLUTION, in the order the settlement itself states it. `mixed` and
 * an unknown explicit key both flatten every culture in codepoint-sorted key order,
 * so a mixed town draws from the whole estate rather than from whichever key
 * happened to be first in the source file.
 *
 * An exhausted resolution THROWS rather than composing a nameless stem: with empty
 * pools the composer would emit ` Way`, an untrimmed name the v2 validator rejects
 * three layers from the cause. A premise error names the real one — a bad injection.
 *
 * @param {unknown} settlement
 * @param {unknown} namingPools the injected NAMING_DATA, by reference
 * @returns {NamePools}
 */
function namePoolsFor(settlement, namingPools) {
  const pools = record(namingPools);
  const value = record(settlement);
  const identityKey = record(value.culturalIdentity).key;
  const configKey = record(value.config).culture;
  const key = typeof identityKey === 'string' && identityKey
    ? identityKey
    : typeof configKey === 'string' && configKey ? configKey : DEFAULT_CULTURE;
  const named = poolsForCulture(pools, key);
  if (named.prefixes.length > 0 && named.suffixes.length > 0) return named;

  /** @type {NamePools} */
  const flattened = { prefixes: [], suffixes: [] };
  for (const cultureKey of Object.keys(pools).sort(byCodepoint)) {
    const entry = poolsForCulture(pools, cultureKey);
    flattened.prefixes.push(...entry.prefixes);
    flattened.suffixes.push(...entry.suffixes);
  }
  if (flattened.prefixes.length > 0 && flattened.suffixes.length > 0) return flattened;

  const fallback = poolsForCulture(pools, DEFAULT_CULTURE);
  if (fallback.prefixes.length === 0 || fallback.suffixes.length === 0) {
    throw premise('the injected naming pools carry no usable prefixes or suffixes');
  }
  return fallback;
}

/**
 * One feature name: exactly two draws off its own fork — one prefix, one suffix —
 * so a reordered loop cannot steal another feature's entropy.
 * @param {ReturnType<typeof createPRNG>} root
 * @param {string} family
 * @param {string} id
 * @param {NamePools} pools
 * @param {string} tail
 * @returns {string}
 */
function drawName(root, family, id, pools, tail) {
  const rng = root.fork(`${family}:${id}`);
  const prefix = rng.pick(pools.prefixes);
  const suffix = rng.pick(pools.suffixes);
  const stem = `${typeof prefix === 'string' ? prefix : ''}${typeof suffix === 'string' ? suffix : ''}`;
  return `${stem} ${tail}`;
}

/**
 * Name one family in codepoint-sorted id order, disambiguating a repeated display
 * name with ` 2`, ` 3`, ... in that same order. Names never enter an id or a
 * geometry, so this pass cannot move a single coordinate.
 * @param {ReturnType<typeof createPRNG>} root
 * @param {string} family
 * @param {string[]} ids
 * @param {NamePools} pools
 * @param {string} tail
 * @returns {Map<string, string>}
 */
function nameFamily(root, family, ids, pools, tail) {
  /** @type {Map<string, string>} */
  const names = new Map();
  /** @type {Map<string, number>} */
  const used = new Map();
  for (const id of [...ids].sort(byCodepoint)) {
    const base = drawName(root, family, id, pools, tail);
    const seen = used.get(base) || 0;
    used.set(base, seen + 1);
    names.set(id, seen === 0 ? base : `${base} ${seen + 1}`);
  }
  return names;
}

/** @param {unknown} rows @returns {string[]} */
function streetIds(rows) {
  /** @type {string[]} */
  const ids = [];
  for (const raw of list(rows)) {
    const id = record(raw).id;
    if (typeof id === 'string') ids.push(id);
  }
  return ids;
}

/** @param {unknown} rows @param {Map<string, string>} names @returns {Record<string, unknown>[]} */
function withNames(rows, names) {
  return list(rows).map((raw) => {
    const row = record(raw);
    return { ...row, name: names.get(String(row.id)) || '' };
  });
}

/**
 * LOWER THE CANONICAL DISTRICTS. One ward per district, footprint copied verbatim,
 * kind taken from the district's own category vocabulary. Every premise TC-3b's
 * carving theorem needs is checked here, once.
 * @param {SourceDistrict[]} districts
 * @param {Map<string, string>} names
 * @returns {CartographyWardRow[]}
 */
function lowerWards(districts, names) {
  return districts.map((district) => {
    if (district.footprint.length > T.MAXIMUM_WARD_VERTICES) {
      throw premise(`ward source ${district.id} carries ${district.footprint.length} vertices, over the ${T.MAXIMUM_WARD_VERTICES} cap`);
    }
    if (!isConvexPolygon(district.footprint)) {
      throw premise(`ward source ${district.id} is not convex; TC-3 owns no polygon clipping`);
    }
    if (!scenePointInPolygon(district.centroid[0], district.centroid[1], district.footprint)) {
      throw premise(`ward source ${district.id} has its centroid outside its own polygon`);
    }
    return {
      id: `ward:${district.id}`,
      kind: TOWN_CARTOGRAPHY_WARD_KINDS.includes(district.category) ? district.category : 'other',
      name: names.get(`ward:${district.id}`) || '',
      polygon: district.footprint.map((point) => /** @type {PlanPoint} */ ([point[0], point[1]])),
      tonePermille: district.densityPermille,
      districtId: district.id,
      lynchElement: 'district',
      provenance: generatedProvenance(),
      decidedBy: 'state',
    };
  });
}

/**
 * A-10.3: the arterials converge on ONE place, and the ward holding that place is
 * the town's Lynch NODE. Containment decides it; only when the meeting point falls
 * in no ward at all does distance break the tie, and then id breaks that.
 * @param {CartographyWardRow[]} wards
 * @param {Map<string, PlanPoint>} centroids
 * @param {unknown} arterials
 */
function markNodeWard(wards, centroids, arterials) {
  /** @type {number[]} */
  const xs = [];
  /** @type {number[]} */
  const zs = [];
  for (const raw of list(arterials)) {
    const polyline = planPolygon(record(raw).polyline);
    if (polyline.length === 0) continue;
    const last = polyline[polyline.length - 1];
    xs.push(last[0]);
    zs.push(last[1]);
  }
  if (xs.length === 0 || wards.length === 0) return;
  const meetX = roundedMean(xs);
  const meetZ = roundedMean(zs);
  let chosen = wards.find((ward) => scenePointInPolygon(meetX, meetZ, ward.polygon)) || null;
  if (!chosen) {
    let best = Number.POSITIVE_INFINITY;
    for (const ward of wards) {
      const centroid = centroids.get(ward.id);
      if (!centroid) continue;
      const dx = centroid[0] - meetX;
      const dz = centroid[1] - meetZ;
      const distance = dx * dx + dz * dz;
      if (distance < best) {
        best = distance;
        chosen = ward;
      }
    }
  }
  if (!chosen) return;
  chosen.lynchElement = 'node';
  chosen.decidedBy = 'lynch';
}

/**
 * COMPILE THE TC-3a LAYERS. One ward per canonical district, and a name for every
 * street and every ward. Parcels, carving and institution binding are TC-3b's, which
 * is why this leaf never reaches for `sceneDigest` or `scenePolygonArea`.
 *
 * @param {object} input
 * @param {unknown} input.districts the manifest's canonical districts
 * @param {unknown} input.streets the TC-2 street container
 * @param {unknown} input.settlement the audience-projected settlement
 * @param {string} input.digest the manifest's mapModelDigest
 * @param {string} input.tier the canonical tier
 * @param {unknown} input.namingPools the injected NAMING_DATA, by reference
 * @returns {{ streets: Record<string, unknown>, wards: CartographyWardRow[],
 *   receipts: Readonly<{ wardCount: number, streetNameCount: number,
 *     wardNameCount: number }> }}
 */
export function compileTownWardLayers(input) {
  const districts = sourceDistricts(input.districts);
  const wardCap = cartographyBand(T.MAXIMUM_WARDS, input.tier);
  if (districts.length > wardCap) {
    throw premise(`${districts.length} canonical districts exceed the ${input.tier} ward cap of ${wardCap}`);
  }
  const root = createPRNG(String(input.digest));
  const pools = namePoolsFor(input.settlement, input.namingPools);
  const container = record(input.streets);
  const arterialNames = nameFamily(root, STREET_NAME_FORK, streetIds(container.arterials), pools, 'Way');
  const laneNames = nameFamily(root, STREET_NAME_FORK, streetIds(container.lanes), pools, 'Lane');
  const wardIds = districts.map((district) => `ward:${district.id}`);
  const wardNames = nameFamily(root, WARD_NAME_FORK, wardIds, pools, 'Ward');

  const wards = lowerWards(districts, wardNames);
  /** @type {Map<string, PlanPoint>} */
  const centroids = new Map(districts.map((district) => [`ward:${district.id}`, district.centroid]));
  markNodeWard(wards, centroids, container.arterials);

  const streets = {
    ...container,
    arterials: withNames(container.arterials, arterialNames),
    lanes: withNames(container.lanes, laneNames),
  };
  return {
    streets,
    wards,
    receipts: Object.freeze({
      wardCount: wards.length,
      streetNameCount: arterialNames.size + laneNames.size,
      wardNameCount: wardNames.size,
    }),
  };
}
