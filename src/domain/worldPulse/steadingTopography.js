/**
 * steadingTopography.js — W-E / J-D4: THE SATELLITE'S GROUND.
 *
 * Directive 4 ("satellite births place within reason of the parent and derive
 * starting resources from the map's topography and cues") realized under J-D4:
 * "satellites sample spatial rasters READ-ONLY at a seeded draw inside the orbit
 * annulus; they never join the frozen spatial digest; resource derivation uses the
 * sampled topography through the existing resource-strike vocabulary."
 *
 * ── WHAT THE FROZEN DIGEST ACTUALLY CARRIES (the honest raster inventory) ─────
 * The captured FMG pack (per-cell h / biome / r / p / c) is consumed ONCE at an
 * entitled canonize and is NOT persisted. What survives into worldState, and
 * therefore what a tick-time reader may sample, is:
 *   • `costField[]`  — DENSE per-cell integer traversal cost. 0 is the IMPASSABLE
 *     sentinel (ocean / off-map). Every other value folds biome, the elevation
 *     premium and the river bias into ONE number under the frozen cost law.
 *   • `territory[]`  — DENSE per-cell settlement INDEX (-1 = ocean / unreached):
 *     the Voronoi-of-settlements partition. `territory[c] === parentIndex` is the
 *     digest's own statement that cell c is the parent's country.
 *   • `routeReceipts` — per primary hop, the gate crossing with its two boundary
 *     CELLS and the NAMED terrain class of each (`terrainA` / `terrainB`, the
 *     TERRAIN_CLASSES vocabulary). Present in every digest, no opt-in.
 * There is NO per-cell biome array and NO per-cell adjacency or centroid, so a
 * candidate cell's ground is read from TWO evidenced sources and never guessed:
 *   1. `gate_terrain` — the digest NAMED this cell's terrain class. Authoritative.
 *   2. `cost_band`    — no name recorded; the integer cost is banded into the same
 *      closed landform vocabulary. This is a TRAVERSABILITY read, not a biome
 *      identification, and the header of LANDFORM_COST_BANDS says exactly which
 *      arithmetic it inverts.
 *
 * ── THE ANNULUS (a recorded divergence, vetoable) ─────────────────────────────
 * The frozen digest does not persist each settlement's own seed cell, so a
 * RADIUS-based annulus is not derivable read-only. The annulus is therefore
 * realized as the parent's EXCLUSIVE TERRITORY — the ground the digest itself
 * says is nearer this parent than any other — with the parent's gate cells as its
 * outer rim. That is directive 4's "within reason of the parent" in the digest's
 * own vocabulary. JUDGMENT (vetoable): if a radius annulus is wanted, the digest
 * must persist seed cells, which is a canon shape change and owner-gated.
 *
 * ── ZERO IMPORTS FROM THE SPATIAL BUILDER (first-paint law) ───────────────────
 * This module reads the cost law off the FROZEN digest and re-declares the two
 * literals it needs (the IMPASSABLE sentinel and the terrain-class names) rather
 * than importing spatialCost.js. That mirrors distanceRead.js's own rule: giving
 * spatialCost a second distinct-chunk importer forces it into a shared chunk and
 * leaks eager first-paint bytes. The class names are plain strings inside the
 * digest, so the frozen data is self-describing and the import is unnecessary.
 *
 * ── DETERMINISM ──────────────────────────────────────────────────────────────
 * Pure. Candidate enumeration is a function of (digest, parentId) alone — a fixed
 * stride, codepoint-ordered gate keys, no rng — so the annulus does not move
 * between ticks. Only the PICK is seeded, through a draw the caller supplies from
 * a keyed fork under the satellite lane's own stream family
 * (`satellite:<parent>:<tick>:site`), which leaves the existing satellite fork's
 * draw sequence untouched.
 *
 * @enforced-by tests/domain/steadingTopography.test.js
 */

import { getCompatibleResources } from '../resourceTerrainCompatibility.js';
import { RESOURCE_DATA } from '../../data/resourceData.js';
// The Weyl cell subsampler. It USED to live in this file; W-G needed the same
// sampler for realm-scale candidate enumeration, so it moved to a zero-import
// leaf and both lanes now read ONE writer (a second copy is how one lane silently
// regresses while the other stays correct). Behaviour is byte-identical.
import { spreadIndices } from '../lowDiscrepancy.js';

/** The DENSE cost field's impassable sentinel (spatialCost.IMPASSABLE, re-declared
 *  here so this leaf never imports the builder — see the first-paint law above).
 *  Real land costs are always >= 90, so 0 is unambiguous. */
export const IMPASSABLE_COST = 0;

/**
 * THE CLOSED LANDFORM VOCABULARY — the only ground a steading may sit on.
 * Nothing outside this list may reach a record, a receipt or a news line.
 * @type {ReadonlyArray<string>}
 */
export const STEADING_LANDFORMS = Object.freeze([
  'river_lowland', 'open_lowland', 'broken_flat', 'woodland',
  'marsh', 'cold_flat', 'arid_flat', 'upland', 'ice',
]);

/**
 * THE COST-BAND READ (the `cost_band` evidence source). The frozen cost law is
 * `round((BIOME_COST[biome] * elevMult) * 100) + (river ? 30 : 0)` with
 * elevMult > 1 only above the mountain knee, so:
 *   <= 110  the cheapest ground there is (grassland 90, savanna 100)
 *   <= 140  that same easy ground carrying the river bias (120 / 130). No bare
 *           biome costs between 101 and 140, so this band is reachable ONLY
 *           through the river term, which is why it reads as a river course.
 *   <= 185  passable but poorer going (tundra 150, the deserts 160/180)
 *   <= 280  heavy going: closed cover (deciduous/wetland 190, taiga and the
 *           rainforests 220/260) and their river variants
 *   >  280  the elevation premium (and glacier 400)
 * This is a TRAVERSABILITY band, not a biome identification: several biomes share
 * a band, and a LOW mountain is genuinely cheap ground. Where the digest recorded
 * a NAME for the cell (a gate), that name wins over the band.
 * @type {ReadonlyArray<{ max: number, landform: string }>}
 */
export const LANDFORM_COST_BANDS = Object.freeze([
  Object.freeze({ max: 110, landform: 'open_lowland' }),
  Object.freeze({ max: 140, landform: 'river_lowland' }),
  Object.freeze({ max: 185, landform: 'broken_flat' }),
  Object.freeze({ max: 280, landform: 'woodland' }),
  Object.freeze({ max: Infinity, landform: 'upland' }),
]);

/** The digest's NAMED terrain classes (spatialCost TERRAIN_CLASSES) → landform.
 *  'water' maps to null: a steading is never placed on water.
 *  @type {Readonly<Record<string, string|null>>} */
export const TERRAIN_CLASS_LANDFORM = Object.freeze({
  water: null,
  grassland: 'open_lowland',
  desert: 'arid_flat',
  forest: 'woodland',
  wetland: 'marsh',
  tundra: 'cold_flat',
  glacier: 'ice',
  mountain: 'upland',
});

/** Placement SUITABILITY weight per landform (the seeded pick's weighting).
 *  Watered lowland is the best ground a frontier family can ask for; bare rock
 *  and ice are last but never impossible.
 *  @type {Readonly<Record<string, number>>} */
export const LANDFORM_SUITABILITY = Object.freeze({
  river_lowland: 8,
  open_lowland: 5,
  woodland: 3,
  broken_flat: 3,
  marsh: 2,
  cold_flat: 2,
  arid_flat: 2,
  upland: 1,
  ice: 1,
});

/** Landform → the (terrain, route) pair the EXISTING resource vocabulary reads.
 *  These are the generator's own canonical terrain names (resolveTerrain.js) and
 *  trade-route access keys, so `getCompatibleResources` answers exactly the
 *  question generation would have asked at this ground.
 *  @type {Readonly<Record<string, { terrain: string, route: string }>>} */
export const LANDFORM_SITE_ACCESS = Object.freeze({
  river_lowland: Object.freeze({ terrain: 'riverside', route: 'river' }),
  marsh: Object.freeze({ terrain: 'riverside', route: 'river' }),
  open_lowland: Object.freeze({ terrain: 'plains', route: 'road' }),
  broken_flat: Object.freeze({ terrain: 'plains', route: 'road' }),
  cold_flat: Object.freeze({ terrain: 'plains', route: 'road' }),
  arid_flat: Object.freeze({ terrain: 'desert', route: 'desert_road' }),
  woodland: Object.freeze({ terrain: 'forest', route: 'isolated' }),
  upland: Object.freeze({ terrain: 'mountain', route: 'mountain_pass' }),
  ice: Object.freeze({ terrain: 'plains', route: 'isolated' }),
});

/** THE AUTHORED LEAN — what each ground is FOR, in RESOURCE_DATA keys only (a
 *  closed vocabulary; every key is pinned to exist). The lean supplies the
 *  flavour; legality still comes from getCompatibleResources, so a leaned key
 *  that the ground forbids simply never appears.
 *  @type {Readonly<Record<string, ReadonlyArray<string>>>} */
export const LANDFORM_RESOURCE_LEAN = Object.freeze({
  river_lowland: Object.freeze(['river_fish', 'river_mills', 'fertile_floodplain', 'river_clay']),
  marsh: Object.freeze(['marshlands', 'river_fish', 'foraging_areas', 'river_clay']),
  open_lowland: Object.freeze(['grain_fields', 'grazing_land', 'hunting_grounds']),
  broken_flat: Object.freeze(['grazing_land', 'hunting_grounds', 'foraging_areas']),
  cold_flat: Object.freeze(['grazing_land', 'hunting_grounds', 'foraging_areas']),
  arid_flat: Object.freeze(['oasis_water', 'date_palms', 'camel_herds', 'desert_salt']),
  woodland: Object.freeze(['managed_forest', 'hunting_grounds', 'foraging_areas', 'ancient_grove']),
  upland: Object.freeze(['stone_quarry', 'iron_deposits', 'coal_deposits', 'mountain_timber']),
  ice: Object.freeze(['hunting_grounds', 'foraging_areas']),
});

/** The in-world NAME of each ground (the Herald's noun phrase; legibility law).
 *  @type {Readonly<Record<string, string>>} */
export const LANDFORM_PLACE_NAME = Object.freeze({
  river_lowland: 'the river bank',
  open_lowland: 'the open lowland',
  broken_flat: 'the rough flats',
  woodland: 'the treeline',
  marsh: 'the marsh edge',
  cold_flat: 'the cold flats',
  arid_flat: 'the dry flats',
  upland: 'the high ground',
  ice: 'the edge of the ice',
});

export const STEADING_TOPOGRAPHY_TUNING = Object.freeze({
  // The strided hinterland scan: at most this many probe positions across the
  // whole cell array (a founding is E0-rare, and the scan is O(SCAN_PROBES)).
  SCAN_PROBES: 512,
  // Hard ceiling on the candidate set the seeded pick weighs (bounded count).
  CANDIDATE_CAP: 16,
  // How many resource keys a newborn steading starts with.
  SITE_RESOURCE_CAP: 3,
  // The weighted blend: the ground's own lean, the trades the settlers bring out
  // of the parent, and a floor so nothing legal is structurally unreachable.
  LEAN_WEIGHT: 6,
  INHERIT_WEIGHT: 3,
  POOL_WEIGHT: 1,
});

const T = STEADING_TOPOGRAPHY_TUNING;

/** Codepoint comparator (device/locale-stable). @param {string} a @param {string} b */
function codepoint(a, b) {
  return a < b ? -1 : a > b ? 1 : 0;
}

/**
 * The landform a raw cost integer reads as, or null when the cell is water /
 * impassable (never a site).
 * @param {unknown} cost
 * @returns {string|null}
 */
export function landformOfCost(cost) {
  const q = typeof cost === 'number' && Number.isFinite(cost) ? cost : -1;
  if (q <= IMPASSABLE_COST) return null;
  for (const band of LANDFORM_COST_BANDS) if (q <= band.max) return band.landform;
  return 'upland';
}

/**
 * The digest read-shape this module samples (a subset of SpatialDigest — every
 * field optional so a ragged/legacy digest is total, never a throw).
 * @typedef {{ settlementIds?: string[], costField?: number[], territory?: number[],
 *   routeReceipts?: Record<string, { between?: [string, string],
 *     segments?: Array<{ cellA?: number, cellB?: number, terrainA?: string, terrainB?: string }> }> }} TopoDigest
 */

/**
 * One candidate site inside the parent's country.
 * @typedef {Object} SteadingSite
 * @property {number} cell      the frozen-pack cell index (a READ key, never written back)
 * @property {string} landform  a STEADING_LANDFORMS member
 * @property {number} cost      the frozen integer traversal cost at the cell
 * @property {'gate_terrain'|'cost_band'} source  which evidence named the ground
 */

/**
 * THE ORBIT ANNULUS — the bounded, deterministic candidate set inside the
 * parent's own country. The parent's gate cells come FIRST (the outer rim, and
 * the only cells the digest names a terrain class for); a fixed-stride scan of
 * the territory raster supplies the hinterland. No rng: identical for the same
 * (digest, parentId) at every tick.
 *
 * A `prefer` set (the seam's own grounds) reserves HALF the remaining room for
 * matching ground, so a mining camp's rock is enumerated even when it is a thin
 * seam in a wide country; the other half stays ordinary ground, so the settlers
 * are always shown a real choice and the no-seam fallback is never starved.
 *
 * @param {TopoDigest|null|undefined} digest
 * @param {string} parentId
 * @param {{ occupied?: ReadonlyArray<number>, prefer?: ReadonlySet<string> }} [opts]
 *   `occupied` = cells this parent's live steadings already hold
 * @returns {SteadingSite[]}
 */
export function orbitAnnulus(digest, parentId, opts = {}) {
  const ids = Array.isArray(digest?.settlementIds) ? digest.settlementIds : [];
  const territory = Array.isArray(digest?.territory) ? digest.territory : [];
  const costField = Array.isArray(digest?.costField) ? digest.costField : [];
  const parentIndex = ids.indexOf(String(parentId));
  if (parentIndex < 0 || !territory.length || !costField.length) return [];

  const taken = new Set((opts.occupied || []).map((c) => Number(c)));
  /** @type {SteadingSite[]} */
  const out = [];
  const seen = new Set();
  /** @param {number} cell @param {string|null} landform @param {'gate_terrain'|'cost_band'} source */
  const offer = (cell, landform, source) => {
    if (out.length >= T.CANDIDATE_CAP) return;
    if (!Number.isInteger(cell) || cell < 0 || cell >= costField.length) return;
    if (seen.has(cell) || taken.has(cell)) return;
    if (territory[cell] !== parentIndex) return;
    const cost = Number(costField[cell]);
    if (!landform || !STEADING_LANDFORMS.includes(landform)) return;
    seen.add(cell);
    out.push({ cell, landform, cost: Number.isFinite(cost) ? cost : 0, source });
  };

  // ── THE RIM: the parent's gate cells, with the terrain class the digest NAMED.
  const receipts = digest && digest.routeReceipts && typeof digest.routeReceipts === 'object'
    ? digest.routeReceipts
    : {};
  for (const key of Object.keys(receipts).sort(codepoint)) {
    const receipt = receipts[key];
    const between = Array.isArray(receipt?.between) ? receipt.between.map(String) : [];
    if (!between.includes(String(parentId))) continue;
    const segment = Array.isArray(receipt?.segments) ? receipt.segments[0] : null;
    if (!segment) continue;
    /** @type {Array<[number, string]>} */
    const sides = [
      [Number(segment.cellA), String(segment.terrainA || '')],
      [Number(segment.cellB), String(segment.terrainB || '')],
    ];
    for (const [cell, terrainClass] of sides) {
      const named = Object.prototype.hasOwnProperty.call(TERRAIN_CLASS_LANDFORM, terrainClass)
        ? TERRAIN_CLASS_LANDFORM[terrainClass]
        : undefined;
      if (named === undefined) continue;          // an unknown class is not evidence
      // THE TWO SOURCES CARRY DIFFERENT FACTS. The recorded class names the biome
      // but drops the river term; the cost band cannot name a biome but is the ONLY
      // place a river course survives. So a river-course cost keeps its band and the
      // recorded name wins everywhere else. `source` reports which one spoke.
      const band = landformOfCost(costField[cell]);
      if (band === 'river_lowland') offer(cell, band, 'cost_band');
      else offer(cell, named, 'gate_terrain');
    }
  }

  // ── THE HINTERLAND: a bounded sweep of the territory raster, then a LOW-
  // DISCREPANCY subset of what it found. Truncating an index-ordered walk at the
  // cap would hand back only the lowest-indexed corner of the parent's country
  // (FMG cell order is row-major-ish); an arithmetic stride would alias against
  // the row width. Collect first, then spread across the collection.
  const wanted = opts.prefer instanceof Set ? opts.prefer : new Set();
  const stride = Math.max(1, Math.floor(costField.length / T.SCAN_PROBES));
  /** @type {Array<{ cell: number, landform: string }>} */
  const preferred = [];
  /** @type {Array<{ cell: number, landform: string }>} */
  const general = [];
  for (let cell = 0; cell < costField.length; cell += stride) {
    if (territory[cell] !== parentIndex || seen.has(cell) || taken.has(cell)) continue;
    const landform = landformOfCost(costField[cell]);
    if (!landform) continue;
    (wanted.has(landform) ? preferred : general).push({ cell, landform });
  }
  const room = T.CANDIDATE_CAP - out.length;
  if (room > 0) {
    const seamRoom = Math.min(preferred.length, Math.ceil(room / 2));
    for (const k of spreadIndices(preferred.length, seamRoom)) {
      offer(preferred[k].cell, preferred[k].landform, 'cost_band');
    }
    for (const k of spreadIndices(general.length, T.CANDIDATE_CAP - out.length)) {
      offer(general[k].cell, general[k].landform, 'cost_band');
    }
  }
  return out;
}

/** Every RESOURCE_DATA key legal at this ground, through the EXISTING resource
 *  vocabulary (getCompatibleResources), codepoint-ordered so a seeded draw over
 *  it is device-stable. An unknown landform reads as open lowland.
 *  @param {string} landform @returns {string[]} */
export function siteLegalResources(landform) {
  const access = LANDFORM_SITE_ACCESS[landform] || LANDFORM_SITE_ACCESS.open_lowland;
  return getCompatibleResources(access.route, access.terrain)
    .filter((entry) => entry.compatible)
    .map((entry) => String(entry.key))
    .sort(codepoint);
}

/**
 * THE SEAM LAW (the design's founding example, made structural): the grounds a
 * struck vein actually belongs on. Landforms whose authored LEAN names the key
 * come first; if none does, every ground where the key is merely LEGAL; if the
 * key is unknown to the vocabulary, the empty set (no restriction).
 * @param {string|null|undefined} resourceKey
 * @returns {Set<string>}
 */
export function seamLandforms(resourceKey) {
  const key = String(resourceKey || '');
  /** @type {Set<string>} */
  const leaned = new Set();
  if (!key) return leaned;
  for (const landform of STEADING_LANDFORMS) {
    if ((LANDFORM_RESOURCE_LEAN[landform] || []).includes(key)) leaned.add(landform);
  }
  if (leaned.size) return leaned;
  /** @type {Set<string>} */
  const legal = new Set();
  for (const landform of STEADING_LANDFORMS) {
    if (siteLegalResources(landform).includes(key)) legal.add(landform);
  }
  return legal;
}

/** One seeded weighted pick over entries carrying positive integer weights.
 *  Total function: an empty list returns null, an all-zero list returns the first.
 *  @template {{ weight: number }} E
 *  @param {ReadonlyArray<E>} entries @param {() => number} draw @returns {E|null} */
function weightedPick(entries, draw) {
  if (!entries.length) return null;
  let total = 0;
  for (const e of entries) total += Math.max(0, e.weight);
  if (!(total > 0)) return entries[0];
  let r = draw() * total;
  for (const e of entries) {
    r -= Math.max(0, e.weight);
    if (r < 0) return e;
  }
  return entries[entries.length - 1];
}

/**
 * CHOOSE THE SITE — a seeded, suitability-weighted draw inside the annulus.
 * A resource strike narrows the field to the seam's own grounds first (the mining
 * camp sits at the vein, not at a random orbit point); when no seam-affine
 * candidate exists the full annulus is weighed instead, so the founding never
 * refuses for want of perfect ground.
 *
 * @param {Object} args
 * @param {TopoDigest|null|undefined} args.digest
 * @param {string} args.parentId
 * @param {() => number} args.draw    a keyed-fork draw (`satellite:<parent>:<tick>:site`)
 * @param {ReadonlyArray<number>} [args.occupied]
 * @param {string|null} [args.resourceKey]
 * @returns {SteadingSite|null}
 */
export function chooseSteadingSite({ digest, parentId, draw, occupied = [], resourceKey = null }) {
  const seam = seamLandforms(resourceKey);
  const candidates = orbitAnnulus(digest, parentId, { occupied, prefer: seam });
  if (!candidates.length) return null;
  const affine = seam.size ? candidates.filter((c) => seam.has(c.landform)) : [];
  const field = affine.length ? affine : candidates;
  const picked = weightedPick(
    field.map((site) => ({ site, weight: Number(LANDFORM_SUITABILITY[site.landform]) || 1 })),
    draw,
  );
  return picked ? picked.site : null;
}

/**
 * DERIVE THE STARTING RESOURCES from the SAMPLED ground, through the existing
 * resource-strike vocabulary. Three components, in order:
 *   1. THE SEAM — a struck vein is a FACT the strike already established, so it is
 *      always carried (JUDGMENT, vetoable: legality is not re-litigated against
 *      the ground, because the site was chosen to match the seam in the first
 *      place and the record already carries `resourceKey` unconditionally).
 *   2. THE GROUND'S LEAN — the authored table, filtered to what is legal here.
 *   3. THE TRADES THE SETTLERS BRING — the parent's own holdings, a WEIGHTED
 *      component (never the whole), and only where the ground allows them.
 * Every remaining legal key keeps a floor weight, so nothing legal is structurally
 * unreachable. Bounded at SITE_RESOURCE_CAP.
 *
 * @param {Object} args
 * @param {string} args.landform
 * @param {() => number} args.draw
 * @param {ReadonlyArray<unknown>} [args.parentResources]
 * @param {string|null} [args.resourceKey]
 * @returns {string[]}
 */
export function deriveSteadingResources({ landform, draw, parentResources = [], resourceKey = null }) {
  const legal = siteLegalResources(landform);
  const legalSet = new Set(legal);
  const lean = new Set((LANDFORM_RESOURCE_LEAN[landform] || []).filter((k) => legalSet.has(k)));
  const held = new Set(
    (Array.isArray(parentResources) ? parentResources : [])
      .map((r) => String(r))
      .filter((k) => legalSet.has(k)),
  );
  /** @type {string[]} */
  const picked = [];
  const seam = String(resourceKey || '').trim();
  if (seam) picked.push(seam);
  const entries = legal.map((key) => ({
    key,
    weight: (lean.has(key) ? T.LEAN_WEIGHT : 0) + (held.has(key) ? T.INHERIT_WEIGHT : 0) + T.POOL_WEIGHT,
  }));
  while (picked.length < T.SITE_RESOURCE_CAP) {
    const available = entries.filter((e) => !picked.includes(e.key));
    if (!available.length) break;
    const chosen = weightedPick(available, draw);
    if (!chosen) break;
    picked.push(chosen.key);
  }
  return picked;
}

/** The Herald's noun phrase for a ground ("the river bank"). Total: an unknown
 *  landform reads as open country rather than leaking a key.
 *  @param {string|null|undefined} landform @returns {string} */
export function landformPlaceName(landform) {
  return LANDFORM_PLACE_NAME[String(landform || '')] || 'open country';
}

/** A resource key as house-voice prose ("fishing grounds"). Mirrors the
 *  resourceDynamicsKernel news idiom exactly: the catalog label, lower-cased,
 *  with the underscore spelling as the total fallback.
 *  @param {string} key @returns {string} */
export function resourcePhrase(key) {
  const row = /** @type {Record<string, { label?: unknown }>} */ (
    /** @type {unknown} */ (RESOURCE_DATA))[String(key)];
  const label = row && row.label != null ? String(row.label) : String(key).replace(/_/g, ' ');
  return label.toLowerCase();
}
