/**
 * placementRaster.js — W-G / J-D1: THE GROUND AUTOPLACEMENT READS.
 *
 * Directive 1 ("one button places all settlements on the realm map balancing sim
 * dynamism and a connected visual web, MATCHING TERRAIN/RESOURCES") needs one
 * question answered per map cell: does this ground match what this settlement was
 * GENERATED to sit on? This module answers it, and nothing else.
 *
 * ── WHY THE LIVE PACK AND NOT THE FROZEN DIGEST (a load-bearing finding) ──────
 * The obvious source is the frozen spatial digest. It cannot serve, for two
 * independent reasons, both verified against the code rather than assumed:
 *   1. NO COORDINATES. The digest's keys are spatialGeometryVersion, costLawVersion,
 *      overlayVersion, settlementIds, cellCount, landCellCount, skippedSettlements,
 *      costField, territory, tiers, distanceMatrix, gates, routeReceipts, reserved.
 *      The per-cell centroid array `p` is CONSUMED at build time and never
 *      persisted, so a digest cell index cannot become the x/y a placement needs.
 *   2. THE WRITE IS LOCKED WHERE THE DIGEST EXISTS. mapSlice.updatePlacement
 *      refuses once `worldState.canonizedAt` is set — which is precisely when a
 *      frozen digest exists. A digest-driven placer could never write.
 * So autoplacement reads the LIVE pack through the same one-shot READ-ONLY RPC the
 * canonize path already uses (bridge.getSpatialPack, mutating nothing), and is by
 * construction a PRE-CANONIZE world-building act. After canonize the realm is
 * frozen and the button refuses out loud — THE PROMISE, not a limitation.
 *
 * ── ONE WRITER FOR THE TERRAIN LAW ───────────────────────────────────────────
 * `terrainClassOf` is imported from spatialCost.js — the frozen cost law's own
 * classifier — so a cell reads the SAME class here that the digest would give it.
 * spatialCost.js is import-free, so this costs the placement chunk nothing but its
 * own 217 lines. What is NOT imported is spatialDigest.js: taking its 10-line
 * `normalizeSpatialPack` would drag institutionalCatalog (via seaLanes /
 * teleportEdges) into a lazy interaction chunk. The normalizer is re-declared here
 * instead and CROSS-CHECKED against the real one in the pins — the same
 * re-declare-and-pin idiom steadingTopography.js uses for the cost constants.
 *
 * ── THE DIVISION OF LABOUR WITH steadingTopography.js ────────────────────────
 * They are not duplicates and neither is the other's vocabulary. steadingTopography
 * asks "what does this ground PRODUCE" (landforms → resource leans, for a newborn
 * satellite). This module asks "does this ground MATCH a settlement's already-
 * generated terrain" (genesis terrain → a fit predicate). Different questions over
 * the same law; folding them would force one to answer in the other's vocabulary.
 *
 * Pure. No rng, no clock, no ambient state.
 *
 * @enforced-by tests/domain/autoplacement.test.js
 */

import { terrainClassOf, LAND_HEIGHT, MOUNTAIN_HEIGHT } from '../spatial/spatialCost.js';

/**
 * THE GENESIS TERRAIN VOCABULARY — resolveTerrain.js's canonical list, verbatim.
 * A settlement's terrain is FROZEN generation truth; autoplacement reads it and
 * may never write it. Pinned equal to the resolver's documented vocabulary.
 * @type {ReadonlyArray<string>}
 */
export const GENESIS_TERRAINS = Object.freeze([
  'plains', 'hills', 'forest', 'riverside', 'coastal', 'mountain', 'desert',
]);

/**
 * THE HILL SHOULDER (authored threshold — JUDGMENT, vetoable).
 * FMG heights run 0..100; land begins at LAND_HEIGHT (20) and `terrainClassOf`
 * calls everything above MOUNTAIN_HEIGHT (60) a mountain, because 60 is the cost
 * law's own elevation knee. That leaves 20..60 undivided, but "plains" and "hills"
 * are distinct genesis terrains that must not both match flat grass. 40 splits the
 * land shoulder in half: 20..40 reads as low ground, 40..60 as high-but-not-
 * mountain. Nothing downstream of the split is tuned to it — moving it re-sorts
 * which cells offer as hills and nothing else.
 */
export const HILL_HEIGHT = 40;

/**
 * The normalized per-cell read the placer works over. Every array is dense and
 * indexed by cell; `cellCount` is clamped to the shortest driving array so a
 * ragged capture is total rather than a throw.
 * @typedef {Object} RealmRaster
 * @property {number} cellCount
 * @property {number[]} x        per-cell centroid x, map coordinate space
 * @property {number[]} y        per-cell centroid y
 * @property {Array<string|null>} cls  TERRAIN_CLASSES member, or null for water/off-map
 * @property {number[]} h        per-cell height (FMG 0..100)
 * @property {Uint8Array} river  1 = a river runs through this cell
 * @property {Uint8Array} coast  1 = a LAND cell with at least one water neighbour
 */

/**
 * The captured FMG cell arrays, mirroring spatialDigest's SpatialPackCells. Every
 * field is optional: a ragged or partial capture must read as empty, never throw.
 * @typedef {Object} CapturedPackCells
 * @property {number[]} [h]                per-cell height (FMG 0..100; land >= 20)
 * @property {number[]} [biome]            per-cell FMG biome id
 * @property {number[]} [r]                per-cell river id (0 = none)
 * @property {Array<number[]>} [p]         per-cell centroid [x, y]
 * @property {Array<number[]>} [c]         per-cell adjacent cell ids
 */

/** A captured pack as the bridge hands it over. Nullish-tolerant by contract.
 *  @typedef {{ cells?: CapturedPackCells|null }|null|undefined} CapturedPack */

/**
 * Re-declaration of spatialDigest.normalizeSpatialPack (see the header ruling on
 * why it is not imported). CROSS-CHECKED against the real one in the pins, so this
 * copy can never silently drift from the capture contract.
 * @param {CapturedPack} pack
 * @returns {{ h: number[], biome: number[], r: number[], p: Array<number[]>,
 *   c: Array<number[]>, cellCount: number }}
 */
export function readPackArrays(pack) {
  const cells = pack?.cells || {};
  const h = Array.isArray(cells.h) ? cells.h : [];
  const biome = Array.isArray(cells.biome) ? cells.biome : [];
  const r = Array.isArray(cells.r) ? cells.r : [];
  const p = Array.isArray(cells.p) ? cells.p : [];
  const c = Array.isArray(cells.c) ? cells.c : [];
  const cellCount = Math.min(h.length, p.length, c.length);
  return { h, biome, r, p, c, cellCount };
}

/**
 * Build the placement raster from a captured (or fixture) FMG pack. Pure: the
 * same pack always yields the same raster, which is the first half of "same realm
 * + seed ⇒ same layout".
 *
 * @param {CapturedPack} pack a captured pack — `{ cells: { h, biome, r, p, c } }`
 * @returns {RealmRaster}
 */
export function realmRasterFromPack(pack) {
  const { h, biome, r, p, c, cellCount } = readPackArrays(pack);
  /** @type {number[]} */
  const x = new Array(cellCount);
  /** @type {number[]} */
  const y = new Array(cellCount);
  /** @type {Array<string|null>} */
  const cls = new Array(cellCount);
  /** @type {number[]} */
  const height = new Array(cellCount);
  const river = new Uint8Array(cellCount);
  const coast = new Uint8Array(cellCount);

  for (let i = 0; i < cellCount; i += 1) {
    const point = p[i];
    x[i] = Array.isArray(point) && Number.isFinite(Number(point[0])) ? Number(point[0]) : 0;
    y[i] = Array.isArray(point) && Number.isFinite(Number(point[1])) ? Number(point[1]) : 0;
    const cellH = Number(h[i]);
    height[i] = Number.isFinite(cellH) ? cellH : 0;
    const klass = terrainClassOf(height[i], biome[i]);
    // 'water' is not a ground a settlement may stand on, so it reads as null and
    // every fit predicate below is spared a water special case.
    cls[i] = klass === 'water' ? null : klass;
    river[i] = r[i] ? 1 : 0;
  }

  // THE COAST PASS — a land cell touching water. This is the ONLY honest coastal
  // signal a pack carries: there is no per-cell "is coastal" array, and the cost
  // raster's river band cannot distinguish a river from a shore. Neighbours are
  // read from the pack's own adjacency `c`; an out-of-range neighbour id is
  // treated as UNKNOWN and never as evidence, so a clamped/ragged capture can
  // never manufacture a coastline that is not there.
  for (let i = 0; i < cellCount; i += 1) {
    if (cls[i] === null) continue;
    const neighbours = Array.isArray(c[i]) ? c[i] : [];
    for (const raw of neighbours) {
      const n = Number(raw);
      if (!Number.isInteger(n) || n < 0 || n >= cellCount) continue;
      if (cls[n] === null) { coast[i] = 1; break; }
    }
  }

  return { cellCount, x, y, cls, h: height, river, coast };
}

/**
 * THE FIT PREDICATE — does cell `cell` match genesis terrain `terrain`?
 *
 * TOTAL over GENESIS_TERRAINS and closed: an unknown terrain token fits nothing
 * (it is never silently coerced to plains, because a silent coercion would place a
 * settlement on ground it was not generated for and call it a match). Water is
 * excluded once, at the top, for every terrain.
 *
 * The predicates deliberately OVERLAP where the world does: a river running
 * through a coastal lowland fits `plains`, `riverside` AND `coastal`. Fit is a
 * per-terrain question, never a partition of the map.
 *
 * @param {string|null|undefined} terrain a GENESIS_TERRAINS member
 * @param {RealmRaster} raster
 * @param {number} cell
 * @returns {boolean}
 */
export function terrainFitsCell(terrain, raster, cell) {
  if (!Number.isInteger(cell) || cell < 0 || cell >= raster.cellCount) return false;
  const klass = raster.cls[cell];
  if (klass === null) return false;             // never on water
  const h = raster.h[cell];
  switch (String(terrain || '')) {
    // Open low ground. Tundra counts: it is treeless open country, and a plains
    // settlement on a cold realm has nowhere else honest to stand.
    case 'plains':    return (klass === 'grassland' || klass === 'tundra') && h <= HILL_HEIGHT;
    // The shoulder between low ground and the cost law's mountain knee. Biome-blind
    // on purpose — a wooded hill is still a hill.
    case 'hills':     return h > HILL_HEIGHT && h <= MOUNTAIN_HEIGHT;
    case 'mountain':  return klass === 'mountain';
    case 'forest':    return klass === 'forest';
    case 'desert':    return klass === 'desert';
    // A river cell, or the wetland a river makes. Both are "on the water" without
    // being IN it.
    case 'riverside': return raster.river[cell] === 1 || klass === 'wetland';
    case 'coastal':   return raster.coast[cell] === 1;
    default:          return false;
  }
}

/**
 * Whether a cell is standable ground at all — land, and not the map's water.
 * @param {RealmRaster} raster @param {number} cell @returns {boolean}
 */
export function isLandCell(raster, cell) {
  return Number.isInteger(cell)
    && cell >= 0
    && cell < raster.cellCount
    && raster.cls[cell] !== null
    && raster.h[cell] >= LAND_HEIGHT;
}

/**
 * THE MAP'S OWN CENSUS — how many cells on this realm fit each genesis terrain,
 * counted over EVERY cell, never a subsample. The mismatch census (J-D1's second
 * class) turns on a count of zero, and a subsampled zero would be a lie: it would
 * report "no mountain on this realm" when the sampler merely missed the ridge.
 *
 * @param {RealmRaster} raster
 * @returns {Record<string, number>} every GENESIS_TERRAINS key, present even at 0
 */
export function terrainCensus(raster) {
  /** @type {Record<string, number>} */
  const census = {};
  for (const terrain of GENESIS_TERRAINS) census[terrain] = 0;
  for (let cell = 0; cell < raster.cellCount; cell += 1) {
    if (raster.cls[cell] === null) continue;
    for (const terrain of GENESIS_TERRAINS) {
      if (terrainFitsCell(terrain, raster, cell)) census[terrain] += 1;
    }
  }
  return census;
}

/** The in-world name of a genesis terrain (the Herald's noun phrase; legibility
 *  law). Total: an unknown token reads as open country rather than leaking a key.
 *  @param {string|null|undefined} terrain @returns {string} */
export function terrainPlaceName(terrain) {
  switch (String(terrain || '')) {
    case 'plains':    return 'open plains';
    case 'hills':     return 'high hills';
    case 'forest':    return 'deep forest';
    case 'riverside': return 'a river bank';
    case 'coastal':   return 'the coast';
    case 'mountain':  return 'the mountains';
    case 'desert':    return 'the desert';
    default:          return 'open country';
  }
}
