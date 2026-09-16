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
