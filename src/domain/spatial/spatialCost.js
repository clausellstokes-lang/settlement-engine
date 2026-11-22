/**
 * spatialCost.js — the LAND cost field, lifted out of the FMG iframe and made
 * pure + integer-quantized (Phase 5.5 KEYSTONE).
 *
 * The ONLY routing code in the repo lived INSIDE the map iframe
 * (public/map/sf-bridge.js:634-672 landCost/seaCost + BIOME_COST): async over
 * postMessage, over raw floats, discarded each session. This module LIFTS that
 * cost function into the pure domain layer so the spatial digest is a seeded,
 * replay-safe function of a CAPTURED pack — it NEVER traverses the iframe bridge.
 * The cost values here are a verbatim port of the iframe's BIOME_COST table +
 * elevation/river biasing (so a digest built here matches the geography the map
 * already draws roads over); only the QUANTIZATION and the terrain-class bucketing
 * are new.
 *
 * DETERMINISM: every value is a pure function of the frozen pack arrays
 * (h/biome/r/p/c). We quantize the per-cell cost field to integers (COST_SCALE)
 * and derive integer edge weights (costFieldInt × integer euclidean distance) so
 * that path cost is EXACT integer arithmetic — gate/tier membership is a step
 * function of cost and cannot flip on a float tie (II.2). Impassable (ocean / off
 * -map) cells carry no cost-field entry and are never traversed (mirrors the
 * iframe's `if (!isFinite(nc)) continue`).
 *
 * SCOPE: LAND cost field only. seaCostRaw is lifted for parity/receipts but sea
 * routing is a RESERVED slot this wave (§4j) — the digest builder routes on land.
 *
 * PURE: no iframe, no tier/auth read, no Date/Math.random. The domain stays
 * tier-blind (the entitlement gate lives at the store call site).
 */

// FMG biome ids → base traversal cost. Verbatim from sf-bridge.js:639-653 so the
// lifted field matches the map's own routing. Missing biomes fall back to 2.0.
// (0 marine, 1 hot desert, 2 cold desert, 3 savanna, 4 grassland, 5 tropical
//  seasonal, 6 temperate deciduous, 7 tropical rainforest, 8 temperate rainforest,
//  9 taiga, 10 tundra, 11 glacier, 12 wetland)
export const BIOME_COST = Object.freeze([
  99,   // marine (guarded by isLand; never routed on in land mode)
  1.8,  // hot desert
  1.6,  // cold desert
  1.0,  // savanna
  0.9,  // grassland
  1.6,  // tropical seasonal forest
  1.9,  // temperate deciduous forest
  2.6,  // tropical rainforest
  2.2,  // temperate rainforest
  2.2,  // taiga
  1.5,  // tundra
  4.0,  // glacier
  1.9,  // wetland
]);

// The land / ocean threshold (FMG heights are 0..100; land ≥ 20). Verbatim.
export const LAND_HEIGHT = 20;

// Quantization scales. COST_SCALE turns the float cell cost (~0.9..15) into a
// compact integer (~90..1500). DIST_SCALE turns euclidean centroid distance into
// an integer; edge weight = costFieldInt × distInt is then EXACT integer
// arithmetic. These scales are part of the FROZEN cost law — bumping either is a
// costLawVersion change, never a silent re-derive (§V.1).
export const COST_SCALE = 100;
export const DIST_SCALE = 1;

// Terrain classes for route receipts (§V.1 "cost breakdown by terrain class").
// Elevation is an overlay: any cell above the mountain-penalty threshold reads as
// 'mountain' regardless of biome (that is where its cost premium comes from).
export const TERRAIN_CLASSES = Object.freeze([
  'water', 'desert', 'grassland', 'forest', 'wetland', 'tundra', 'glacier', 'mountain',
]);
export const MOUNTAIN_HEIGHT = 60; // matches the iframe's elevMult knee (h > 60)

// ── SEASONS-B (M3): the seasonal cost overlay LAW ─────────────────────────────
// The reserved `seasonalOverlay` digest slot (§4i, round 19) materializes as a
// per-SEASON × per-TERRAIN-CLASS cost MULTIPLIER — a MULTIPLICATIVE layer on top
// of the frozen base cost field. It is versioned + frozen INTO the digest at an
// entitled re-canonize (§V.1: "old canon freezes under its own cost-law; a change
// is a discrete re-canonize event, never a silent drift"), and applied at READ
// TIME in distanceRead (the frozen distanceMatrix is NEVER re-baked).
//
// ROUND 19 — SLOW, NOT SEVER: winter makes a mountain pass NEAR-impassable
// (a large multiplier) but NEVER infinite/cut — so a snowed-in town is dear to
// reach yet still RESCUABLE by spring. Every entry is a FINITE multiplier ≥ 1
// (a seasonal cost is never a discount, and never a severance).
export const SEASONAL_OVERLAY_VERSION = 2;

// The hard bound the SLOW-NOT-SEVER law guarantees: no terrain in any season
// multiplies cost by more than this FINITE factor (winter × mountain is the
// worst case). The read-time blend is a cost-weighted average of table entries,
// so a route's effective multiplier is always in [1, SLOW_NOT_SEVER_MAX].
export const SLOW_NOT_SEVER_MAX = 6;

// The per-season × per-terrain multiplier table (the cost LAW). Keyed by the
// SEASONS-A season labels × the terrainClassOf vocabulary. Summer is the
// baseline (1.0 on land — the good campaigning season); winter is harshest
// (mountain 6× near-impassable-but-finite, deep wetland/tundra slow); spring/
// autumn are the mud/rain shoulders. 'water' stays 1.0 (the land digest never
// routes on it). Every value FINITE and ≥ 1, and ≤ SLOW_NOT_SEVER_MAX.
export const SEASON_TERRAIN_COST = Object.freeze({
  spring: Object.freeze({ water: 1, desert: 1.1, grassland: 1.15, forest: 1.2, wetland: 1.4, tundra: 1.3, glacier: 1.7, mountain: 1.6 }),
  summer: Object.freeze({ water: 1, desert: 1.0, grassland: 1.0, forest: 1.0, wetland: 1.0, tundra: 1.0, glacier: 1.2, mountain: 1.0 }),
  autumn: Object.freeze({ water: 1, desert: 1.0, grassland: 1.05, forest: 1.15, wetland: 1.3, tundra: 1.25, glacier: 1.5, mountain: 1.35 }),
  winter: Object.freeze({ water: 1, desert: 1.2, grassland: 1.5, forest: 1.8, wetland: 2.3, tundra: 2.8, glacier: 5.0, mountain: 6.0 }),
});

/**
 * The seasonal overlay OBJECT stamped into the frozen digest's reserved slot at
 * an entitled M3 re-canonize. Self-describing (carries its own version + the full
 * cost law) so an old canon freezes under its own table forever (§V.1) and a
 * future law change is a discrete re-canonize, never a silent drift on load. The
 * READ side (the terrain-weighted blend) lives in distanceRead — it reads
 * seasonTerrainCost straight off this frozen object, so this module needs no
 * reader import (which would force spatialCost into a shared chunk).
 * @returns {{ version: number, seasonTerrainCost: typeof SEASON_TERRAIN_COST }}
 */
export function buildSeasonalOverlay() {
  return { version: SEASONAL_OVERLAY_VERSION, seasonTerrainCost: SEASON_TERRAIN_COST };
}

// ── GEOGRAPHY: proximity to navigable water (pure reads of the frozen pack) ────
// Moved here from seaLanes.js by W-SEAM SEAM-1 (S3), VERBATIM. This module is the
// zero-import leaf that already owns LAND_HEIGHT and terrainClassOf, so keeping the
// two water reads here lets `terrainAgreement` (below) decide the config
// vocabulary's `coastal` / `riverside` against the SAME single writer the sea-lane
// port derivation uses — instead of forking a second coastality law into a display
// path. seaLanes.js re-exports both, so every existing import site is untouched.
/**
 * Is a land cell COASTAL — adjacent to an ocean / off-map cell? A neighbour below
 * LAND_HEIGHT (or a missing/out-of-range neighbour, treated as the map edge / open
 * water) makes the cell a shore. Pure function of the frozen pack.
 * @param {{ h: number[], c: number[][], cellCount: number }} pack @param {number} cell
 * @returns {boolean}
 */
export function isCoastalCell(pack, cell) {
  const H = pack.h || [];
  if (!(Number(H[cell]) >= LAND_HEIGHT)) return false; // not land ⇒ not a port cell
  const neighbours = (pack.c || [])[cell] || [];
  for (const v of neighbours) {
    if (v == null || v < 0 || v >= pack.cellCount) return true; // map edge ⇒ open water
    if (!(Number(H[v]) >= LAND_HEIGHT)) return true;            // ocean neighbour ⇒ shore
  }
  return false;
}

/** Does a land cell sit on a river course (r[cell] != 0)? A missing/short r entry
 *  (normalizeSpatialPack reads absent/ragged r as [] and cellCount EXCLUDES r) reads
 *  as NO river — require a FINITE non-zero value (mirrors landCostRaw's truthy R test),
 *  never NaN!==0. @param {{ h:number[], r:number[] }} pack @param {number} cell */
export function isRiverCell(pack, cell) {
  const H = pack.h || [];
  if (!(Number(H[cell]) >= LAND_HEIGHT)) return false;
  const rv = Number((pack.r || [])[cell]);
  return Number.isFinite(rv) && rv !== 0;
}

// ── W-CAP CAP-2: RIVER NAVIGABILITY, and the difference between a river and a ford ──
// `isRiverCell` answers "is there a watercourse here", which is the question the cost
// law needs (a river cheapens travel along it). It is NOT the question a PORT needs. A
// headwater trickle and the tidal reach of a great river both read `r != 0`, and a
// settlement on the trickle was granted sea lanes to the ocean — the isolation
// inversion firing where a hull could never float.
//
// The captured flux (`pack.fl`, CAP-1) is what separates them, and the cut is FMG'S OWN,
// read out of the fork source rather than authored: its burg classifier calls a cell a
// River burg only at `cells.r[i] && cells.fl[i] >= 100`. So MIN_NAVIGABLE_FLUX is 100
// because FMG says 100, not because 100 looked right.
export const MIN_NAVIGABLE_FLUX = 100;

// The great-river shoulder. FMG has no named constant for it, so it is derived from the
// only flux-keyed "as big as rivers get" statement its source makes: the river renderer
// widens a course by `min(fl ** 0.7 / FLUX_FACTOR, MAX_FLUX_WIDTH)` with FLUX_FACTOR 500
// and MAX_FLUX_WIDTH 1, so the width SATURATES at `fl = 500 ** (1/0.7) = 7172.51…`.
// Frozen as the integer literal rather than computed at load: a fractional `**` evaluated
// at module-evaluation time is exactly the cross-engine-variance surface the house
// determinism rules exist to keep out of a value a canon can depend on.
// ⚠ JUDGMENT, VETOABLE, AND DELIBERATELY NOT LOAD-BEARING: no eligibility, cost or lane
// depends on this cut. It separates the two NAVIGABLE bands from each other and nothing
// more, so moving it re-labels rivers and changes no behaviour.
export const GREAT_RIVER_FLUX = 7173;

/** The closed navigability vocabulary. `unknown` is the honest fourth state — the
 *  capture carried no flux evidence, so the band is not merely un-computed, it is
 *  un-KNOWABLE from this pack (the `terrainAgreement` tri-state idiom, and the same
 *  `unknown` A1.2.14 mandates for an uncaptured lake subtype). A cell that is not on a
 *  river at all is `null`, not a band.
 *  @type {ReadonlyArray<string>} */
export const RIVER_BANDS = Object.freeze(['stream', 'river', 'great_river', 'unknown']);

/**
 * Does this pack carry USABLE flux evidence?
 *
 * ⚠ THE TEST IS PER-PACK, NOT PER-CELL, and that is load-bearing. A per-cell test would
 * read `fl[cell] === 0` on a pack whose river pass has not run as "a stream", silently
 * demoting every river port on the map to unnavigable — a behaviour cliff triggered by an
 * ABSENT input. FMG's own heightmap editor resets `pack.cells.fl` to a zero Uint16Array
 * while river ids survive (`heightmap-editor.js:371`), so the all-zero pack is real, not
 * hypothetical. Absent, ragged AND all-zero all mean the same thing here — no evidence —
 * and no-evidence degrades to the pre-CAP rule rather than inventing a verdict.
 * @param {{ fl?: number[] }} pack a NORMALIZED pack (normalizeSpatialPack's shape)
 * @returns {boolean}
 */
export function hasFluxEvidence(pack) {
  const fl = pack?.fl;
  if (!Array.isArray(fl) || fl.length === 0) return false;
  for (let i = 0; i < fl.length; i++) if (Number(fl[i]) > 0) return true;
  return false;
}

/**
 * The navigability band of a river cell: 'stream' | 'river' | 'great_river' | 'unknown',
 * or null when the cell carries no river course at all.
 *
 * Pure, total, and a function of the frozen pack alone. `fluxKnown` is passed in rather
 * than recomputed per cell so the whole-array evidence scan runs ONCE per digest build
 * instead of once per seed.
 * @param {{ h:number[], r:number[], fl?:number[] }} pack a NORMALIZED pack
 * @param {number} cell
 * @param {boolean} fluxKnown  hasFluxEvidence(pack), hoisted by the caller
 * @returns {string|null}
 */
export function riverBandOf(pack, cell, fluxKnown) {
  if (!isRiverCell(pack, cell)) return null;
  if (!fluxKnown) return 'unknown';
  const fl = Number((pack.fl || [])[cell]);
  if (!Number.isFinite(fl)) return 'unknown'; // a ragged tail, not a measured trickle
  if (fl >= GREAT_RIVER_FLUX) return 'great_river';
  return fl >= MIN_NAVIGABLE_FLUX ? 'river' : 'stream';
}

/**
 * Is a river cell NAVIGABLE — can a hull reach it? Only a MEASURED shortfall denies:
 * `stream` is the one band that says no, because it is the one band backed by positive
 * evidence that the flux is too small. `unknown` is navigable, which is precisely how
 * "absent `fl` degrades to today's `r != 0` rule" is spelled — a port never loses
 * eligibility for want of a field the capture did not carry.
 * @param {string|null} band a riverBandOf result
 * @returns {boolean}
 */
export function isNavigableBand(band) {
  return band !== null && band !== 'stream';
}

/** @param {number|undefined} h @param {number|undefined} b */
export function terrainClassOf(h, b) {
  const height = Number(h) || 0;
  if (height < LAND_HEIGHT) return 'water';
  if (height > MOUNTAIN_HEIGHT) return 'mountain';
  switch (b) {
    case 1: case 2: return 'desert';
    case 3: case 4: return 'grassland';
    case 5: case 6: case 7: case 8: case 9: return 'forest';
    case 10: return 'tundra';
    case 11: return 'glacier';
    case 12: return 'wetland';
    default: return 'grassland';
  }
}

// ── W-SEAM SEAM-1 (S3): the two terrain truths, and whether they agree ─────────
// The engine persists a settlement's terrain as `config.terrainType`, read through
// the ONE reader (domain/resolveTerrain.js) over a CLOSED vocabulary minted at
// genesis from the trade route. The map carries a completely different truth — the
// captured FMG pack, classified by terrainClassOf above over its OWN closed
// vocabulary. The two never shared a type, so nothing could compare them and the
// disagreement was permanent and silent: a `terrainType:'coastal'` settlement
// dropped mid-plain is fed as a port by foodBalance forever while
// derivePortEligibility reads coastal:false and never grants it a sea lane.
//
// This is the mapping the two vocabularies were missing. It is a total function
// over CLOSED vocabularies with an honest third state: `unknown` means the two
// vocabularies genuinely cannot speak about this pair, not that we did not check.
// It NEVER rewrites terrainType — genesis derivations hang off that value, and for
// a canon settlement the write would be lived-history-adjacent (the bug-or-truth
// fork). It only reports.

/** The engine-side closed vocabulary (domain/resolveTerrain.js's canonical list). */
export const CONFIG_TERRAIN_CLASSES = Object.freeze([
  'plains', 'hills', 'forest', 'riverside', 'coastal', 'mountain', 'desert',
]);

/** The tri-state verdict vocabulary. */
export const TERRAIN_AGREEMENT_VERDICTS = Object.freeze(['agrees', 'disagrees', 'unknown']);

// Four config words have a direct counterpart among terrainClassOf's classes
// (plains↔grassland, forest↔forest, desert↔desert, mountain↔mountain), so a
// mismatch BETWEEN counterparts is a real disagreement. Classes with no config
// counterpart (wetland, tundra) stay `unknown` — a plain can carry a tundra band
// and the config has no word for it, so silence is the honest answer. `water` is
// the one universal: a settlement whose own cell is ocean contradicts every land
// terrain the config can name.
//
// `hills` is deliberately almost-blind: terrainClassOf has NO hills class — it sees
// biome bands and one mountain knee, so relief between LAND_HEIGHT and
// MOUNTAIN_HEIGHT is invisible to it. Claiming agreement or disagreement there
// would be inventing a comparison the map cannot make.
//
// `riverside` and `coastal` are not classes at all — they are hydrographic facts,
// so they are decided by isRiverCell / isCoastalCell above (the same single writers
// the sea-lane port derivation reads), not by this table.
// Annotated rather than inferred: `hills`, `riverside` and `coastal` carry an EMPTY
// `agrees` set, which infers as `readonly never[]` and poisons `.includes()` across the
// union (domain-strict TS2345). The annotation states the intent — two closed lists of
// terrain-class words per config word — instead of letting three deliberate holes in the
// mapping dictate the type.
/** @type {Readonly<Record<string, { agrees: readonly string[], disagrees: readonly string[] }>>} */
const AGREEMENT_TABLE = Object.freeze({
  plains: Object.freeze({
    agrees: Object.freeze(['grassland']),
    disagrees: Object.freeze(['water', 'forest', 'desert', 'mountain', 'glacier']),
  }),
  hills: Object.freeze({
    agrees: Object.freeze([]),
    disagrees: Object.freeze(['water']),
  }),
  forest: Object.freeze({
    agrees: Object.freeze(['forest']),
    disagrees: Object.freeze(['water', 'grassland', 'desert', 'mountain', 'glacier']),
  }),
  mountain: Object.freeze({
    agrees: Object.freeze(['mountain']),
    disagrees: Object.freeze(['water', 'grassland', 'forest', 'desert', 'wetland']),
  }),
  desert: Object.freeze({
    agrees: Object.freeze(['desert']),
    disagrees: Object.freeze(['water', 'grassland', 'forest', 'mountain', 'wetland', 'glacier']),
  }),
  // Present so the table is TOTAL over CONFIG_TERRAIN_CLASSES (a walker can assert
  // that), but the hydrographic branch answers first and these are never consulted
  // for a cell that is on the map at all.
  riverside: Object.freeze({ agrees: Object.freeze([]), disagrees: Object.freeze(['water']) }),
  coastal: Object.freeze({ agrees: Object.freeze([]), disagrees: Object.freeze(['water']) }),
});

/**
 * Do the settlement's own declared terrain and the geography under it agree?
 *
 * @param {string|null|undefined} configTerrain a member of CONFIG_TERRAIN_CLASSES
 *   (resolveTerrain's output). Anything else — null, the 'auto' sentinel, an
 *   imported word we do not know — is `unknown`, never a guess.
 * @param {{ h:number[], biome:number[], r:number[], c:number[][], cellCount:number }} pack
 *   the NORMALIZED pack (normalizeSpatialPack's shape).
 * @param {number} cellId the cell the settlement sits on.
 * @returns {'agrees'|'disagrees'|'unknown'}
 */
export function terrainAgreement(configTerrain, pack, cellId) {
  const declared = typeof configTerrain === 'string' ? configTerrain : '';
  if (!Object.prototype.hasOwnProperty.call(AGREEMENT_TABLE, declared)) return 'unknown';
  if (!pack || !Number.isInteger(cellId)) return 'unknown';
  const cellCount = Number(pack.cellCount);
  // Off the map entirely ⇒ there is no geography to compare against. `resolveSeeds`
  // already reports that case as `off_map`; this deriver does not double-count it.
  if (!Number.isFinite(cellCount) || cellId < 0 || cellId >= cellCount) return 'unknown';

  const mapClass = terrainClassOf((pack.h || [])[cellId], (pack.biome || [])[cellId]);

  // The hydrographic pair is decided by the water reads, not by the class table —
  // terrainClassOf says nothing about rivers or shorelines. A cell that is itself
  // water disagrees with both (a settlement is not in the sea).
  if (declared === 'riverside') {
    if (mapClass === 'water') return 'disagrees';
    return isRiverCell(pack, cellId) ? 'agrees' : 'disagrees';
  }
  if (declared === 'coastal') {
    if (mapClass === 'water') return 'disagrees';
    return isCoastalCell(pack, cellId) ? 'agrees' : 'disagrees';
  }

  const row = AGREEMENT_TABLE[declared];
  if (row.agrees.includes(mapClass)) return 'agrees';
  if (row.disagrees.includes(mapClass)) return 'disagrees';
  return 'unknown';
}

/**
 * Raw FLOAT land cost of entering a cell — verbatim port of the iframe's
 * landCost (sf-bridge.js:655-664). Infinity ⇒ impassable (ocean / off-map).
 * @param {number} cell
 * @param {{ h: number[], biome: number[], r: number[] }} arrays
 */
export function landCostRaw(cell, arrays) {
  const H = arrays.h || [];
  const B = arrays.biome || [];
  const R = arrays.r || [];
  const h = H[cell];
  if (!(Number(h) >= LAND_HEIGHT)) return Infinity;
  const b = B[cell] ?? 4;
  const base = BIOME_COST[b] ?? 2.0;
  const elevMult = h > MOUNTAIN_HEIGHT ? 1 + (h - MOUNTAIN_HEIGHT) / 15 : 1;
  const riverBias = R[cell] ? 0.3 : 0;
  return base * elevMult + riverBias;
}

/**
 * Raw FLOAT sea cost — verbatim port of the iframe's seaCost. Lifted for parity
 * and future sea-lane work (§4j, RESERVED this wave); the land digest never calls
 * it. Infinity ⇒ not ocean.
 * @param {number} cell
 * @param {{ h: number[] }} arrays
 */
export function seaCostRaw(cell, arrays) {
  const H = arrays.h || [];
  const h = H[cell];
  if (!(Number(h) < LAND_HEIGHT)) return Infinity;
  return h >= 15 ? 1.2 : 0.9;
}

/**
 * Quantized INTEGER cost of entering a land cell (or null when impassable). The
 * per-cell cost field stored in the digest is this over every land cell.
 * @param {number} cell
 * @param {{ h: number[], biome: number[], r: number[] }} arrays
 * @returns {number|null}
 */
export function quantizeCellCost(cell, arrays) {
  const raw = landCostRaw(cell, arrays);
  if (!Number.isFinite(raw)) return null;
  return Math.round(raw * COST_SCALE);
}

/**
 * Integer euclidean distance between two cell centroids (floored at 1 so no
 * zero-weight edge can create a free cycle). Pure function of the frozen p[]
 * positions.
 * @param {number} a @param {number} b @param {Array<[number,number]|number[]>} p
 */
export function quantizeDist(a, b, p) {
  const pa = p[a];
  const pb = p[b];
  if (!pa || !pb) return 1;
  const dx = pa[0] - pb[0];
  const dy = pa[1] - pb[1];
  return Math.max(1, Math.round(Math.sqrt(dx * dx + dy * dy) * DIST_SCALE));
}

// Impassable sentinel for the DENSE cost field. Real land costs are always ≥ 90
// (min BIOME_COST 0.9 × elevMult ≥ 1 × COST_SCALE 100), so 0 is an unambiguous
// "ocean / off-map, never routed on" marker.
export const IMPASSABLE = 0;

/**
 * Build the quantized per-cell cost field as a DENSE plain integer array indexed
 * by cell (length cellCount): the quantized land cost, or IMPASSABLE (0) for
 * ocean / off-map cells. A dense int array is far more compact than a sparse
 * object with 4-digit string keys (the keys, not the values, dominated the digest
 * size — see the KEYSTONE size report) and is a PLAIN array so it JSON-serializes
 * and structured-clones inside the object-shaped conditional digest.
 * @param {{ h: number[], biome: number[], r: number[] }} arrays
 * @param {number} cellCount
 * @returns {number[]}
 */
export function buildCostField(arrays, cellCount) {
  const field = new Array(cellCount);
  for (let i = 0; i < cellCount; i++) {
    const q = quantizeCellCost(i, arrays);
    field[i] = q === null ? IMPASSABLE : q;
  }
  return field;
}
