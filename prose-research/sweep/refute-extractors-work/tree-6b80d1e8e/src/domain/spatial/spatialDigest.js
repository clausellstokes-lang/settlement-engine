/**
 * spatialDigest.js — the FROZEN spatial canon digest builder (Phase 5.5 KEYSTONE).
 *
 * Given a CAPTURED FMG pack (cell arrays h/biome/r/p/c) and the placed
 * settlements, this PURE module derives — once, at an entitled canonize — the
 * immutable spatial digest the whole spatial program reads. Nothing here touches
 * the iframe, tier/auth, Date, or Math.random: the digest is a seeded, replay-safe
 * function of the frozen pack, so the same pack + same placements ⇒ a byte-
 * identical digest forever (that is the keystone invariant).
 *
 * THE ALGORITHM (II.4, the prescribed shape — NEVER all-pairs cell-level A*):
 *   1. Quantize the land cost field to integers (spatialCost.js).
 *   2. ONE multi-source integer Dijkstra seeded from every settlement's cell at
 *      once → per land cell: nearest settlement (TERRITORY / a Voronoi-of-
 *      settlements partition), integer distance-to-nearest, and predecessor —
 *      O(cells·log cells), independent of N². Explicit deterministic tie-breaks:
 *      equal cost ⇒ pop the lower cell index; equal tentative ⇒ keep the lower
 *      predecessor index (II.3-1). Positive integer edge weights ⇒ every relaxer
 *      of a cell finalizes strictly before it, so the winning predecessor is the
 *      lowest-indexed relaxer regardless of heap order — provably deterministic.
 *   3. Scan cell edges once → territory ADJACENCY: a boundary crossing between
 *      territories A,B costs dist[u]+edge(u,v)+dist[v]; the MIN over all crossings
 *      is the base distance between the two NEIGHBOURING settlements, and the
 *      cheapest crossing cells are their GATE.
 *   4. On the resulting SPARSE settlement graph (N nodes, not cells): Floyd-
 *      Warshall → the full distance MATRIX; BFS depth → neighbour TIERS
 *      (1 primary / 2 secondary / 3 tertiary+). This tiny N-node all-pairs is NOT
 *      the forbidden cell-level all-pairs.
 *   5. ROUTE RECEIPTS (§V.1) per primary hop: the gate segment + cost breakdown by
 *      terrain class — the "why this road?" audit trail. Non-adjacent routes
 *      compose from primary-hop receipts along the distanceMatrix path (kept O(N),
 *      not O(N²), so the digest stays compact — see the size ruling).
 *
 * Three version axes are stamped into the digest (§V.1 / VI.2-2):
 * spatialGeometryVersion (the frozen geometry — NOT `geometryVersion`, which
 * name-collides with a live store field), costLawVersion (how cost is computed),
 * overlayVersion (live overlays, inert this wave). Four RESERVED null slots
 * (seaLanes §4j, airField / teleportEdges — the PART VI separate edge sets,
 * seasonalOverlay §4i SEASONS-B) are schema-present so their own waves can
 * materialize them without a schema break.
 */

import {
  buildCostField,
  quantizeCellCost,
  quantizeDist,
  terrainClassOf,
  terrainAgreement,
  buildSeasonalOverlay,
  SEASONAL_OVERLAY_VERSION,
} from './spatialCost.js';
import { buildSeaLanes } from './seaLanes.js';
import { buildTeleportEdges } from './teleportEdges.js';
import { deriveLakes } from './waterBodies.js';

// ── Input shapes (the captured pack + placements the builder consumes) ───────
/**
 * The frozen FMG cell arrays as a capture hands them over (pack.cells). Every
 * field is optional — a ragged or partial capture is normalized by
 * normalizeSpatialPack (absent arrays read as empty; cellCount clamps to the
 * shortest driving array).
 *
 * EVERY FIELD HERE IS PACK-INDEXED. The climate arrays are NOT — they live on
 * SpatialPackGrid below, under their own denominator (W-CAP CAP-1 / D1).
 * @typedef {Object} SpatialPackCells
 * @property {number[]} [h]      per-cell height (FMG 0..100; land >= 20)
 * @property {number[]} [biome]  per-cell FMG biome id
 * @property {number[]} [r]      per-cell river id (0 = none)
 * @property {Array<[number, number]|number[]>} [p]  per-cell centroid [x, y]
 * @property {number[][]} [c]    per-cell adjacent cell ids
 * @property {number[]} [fl]     per-cell FLUX (FMG Uint16 water flow; 0 = none)
 * @property {number[]} [g]      per-cell GRID cell index — the ONLY bridge from
 *   pack space into grid space (FMG `pack.cells.g`)
 */

/**
 * The frozen FMG GRID cell arrays (W-CAP CAP-1 / D1). A SEPARATE denominator from
 * SpatialPackCells: these are indexed by GRID cell, and a pack cell reaches its own
 * row only through `cells.g[packCell]`. FMG generates climate on the grid and never
 * re-projects it onto the pack, so capturing it any other way would either invent a
 * projection or silently mis-index (§711.6 — an undeclared unit acquires a different
 * one at every consumer).
 * @typedef {Object} SpatialPackGrid
 * @property {number[]} [temp]   per-GRID-cell temperature, DEGREES CELSIUS (Int8, -128..127)
 * @property {number[]} [prec]   per-GRID-cell precipitation, FMG's own 0..255 units (Uint8)
 */

/**
 * A captured FMG pack (the digest builder's raw input) — nullish-tolerant.
 * @typedef {{ cells?: SpatialPackCells | null, grid?: SpatialPackGrid | null }
 *   | null | undefined} CapturedSpatialPack
 */

/**
 * One raw settlement placement row as callers supply it (the live capture, the
 * store seam, or a test fixture): settlement id + FMG cell. Tolerant — the row
 * may be nullish and its fields loosely typed; resolveSeeds normalizes
 * (String/Number) and drops the invalid. The optional `institutions` roster (M8/M9c
 * capability read) and `magicExists` (MG-3a — the realm magic toggle's per-settlement
 * projection) ride the row so eligibility stays a pure function of the frozen inputs.
 * @typedef {{ id?: string|number|null, cellId?: number|string|null,
 *   institutions?: unknown, magicExists?: unknown } | null | undefined} SpatialPlacementRow
 */

/**
 * One primary-hop route receipt (§V.1): the gate crossing between two adjacent
 * territories, its total cost, the boundary segment, and the cost attributed by
 * terrain class — the "why this road?" audit trail.
 * @typedef {Object} RouteReceipt
 * @property {[string, string]} between  the two settlement ids (codepoint-sorted)
 * @property {number} cost               total primary-hop cost (integer)
 * @property {Array<{ cellA: number, cellB: number, cost: number, terrainA: string, terrainB: string }>} segments
 * @property {Record<string, number>} byTerrain  cost attributed per terrain class
 */

// The version axes this build stamps. Bumping any of these is a DISCRETE re-
// canonize event (§V.1): an existing frozen digest keeps its own axes forever —
// only an explicit spatial re-canonize re-derives. Never a silent drift on load.
export const SPATIAL_GEOMETRY_VERSION = 1;
export const COST_LAW_VERSION = 1;
export const OVERLAY_VERSION = 1;

// V-6 BIOME TRUTH: the version of the additive biome sub-digest (per-settlement +
// per-leg FMG biome). Self-describing so a materializing wave can evolve the shape
// under its own version, never a silent drift on an old canon (§V.1 semantics).
export const BIOME_TEXTURE_VERSION = 1;

// W-CAP CAP-3 CLIMATE TRUTH: the version of the additive climate-band sub-digest
// (per-settlement `harsh | standard | mild | unknown`, banded from the captured
// GRID climate at the settlement's own grid cell). Self-describing on the
// biomeTexture precedent, so a later law change is a discrete re-canonize under its
// own version and an old canon keeps its own forever (§V.1 semantics).
export const CLIMATE_BAND_VERSION = 1;

// The closed band vocabulary. `unknown` is the honest fourth state — the capture
// carried no climate for this settlement's grid cell, so the band is not merely
// un-computed but un-KNOWABLE from this pack (the `terrainAgreement` tri-state idiom,
// and the same word A1.2.14 mandates where climate is uncaptured).
export const CLIMATE_BANDS = Object.freeze(['harsh', 'standard', 'mild', 'unknown']);

// ── THE BAND CUTS, AND WHERE EACH NUMBER COMES FROM ───────────────────────────
// The band answers "how hard is the food year here", which is the question
// SEASONS_TUNING's amplitude table has always answered from the settlement's
// DECLARED terrain word — a proxy for a climate the engine could not read. It can
// read it now.
//
// Every cut below is FMG's own, read out of its `Biomes.getId` in the fork source,
// so the bands sit on the same lines FMG's own biome matrix turns on:
//   • `temperature < -5`                       ⇒ Glacier (its habitability table: 0)
//   • `temperature >= 25 && moisture < 8`      ⇒ Hot desert (habitability 4)
//   • moisture band 0 is `moisture < 5`        ⇒ the whole DESERT ROW of its matrix
//     (`const i = Math.min(moisture / 5 | 0, 4)`), habitability 4–10 at every
//     temperature — which is why low precipitation alone is harsh.
//   • `MILD_MIN_TEMP_C = 4` is the knee in FMG's OWN WETTEST matrix row: that row
//     reads biome 8 (temperate rainforest, habitability 90) while its temperature
//     index `o = min(max(20 - temp, 0), 25)` is 1..16 — i.e. temp 4..19 — and drops
//     to biome 9 (taiga, habitability 12) at o = 17, i.e. temp 3.
//   • `MILD_MIN_PREC = 10` is FMG's moisture band 2, the first band whose matrix row
//     leaves the desert/savanna range entirely.
// ⚠ ORDER MATTERS AND IS PART OF THE LAW: harsh is decided FIRST, so a hot wet place
// is mild while a hot DRY place is harsh. A cold-but-wet cell (taiga) lands in
// `standard` rather than `harsh` — a deliberate, vetoable middle: FMG rates it
// habitability 12, but a boreal forest still has a growing year, unlike ice.
export const GLACIAL_TEMP_C = -5;
export const HOT_DESERT_TEMP_C = 25;
export const HOT_DESERT_PREC = 8;
export const ARID_PREC = 5;
export const MILD_MIN_TEMP_C = 4;
export const MILD_MIN_PREC = 10;

// W-SEAM: the version of the additive CAPTURE RECEIPT — what the capture noticed
// about the placements it was handed, as opposed to the geography it derived.
// Self-describing on the biomeTexture precedent, so a later seam can widen the shape
// under its own version and an old canon keeps its own forever (§V.1 semantics).
// The receipt records PROBLEMS ONLY, exactly as `skippedSettlements` does: a capture
// with nothing to report carries NO key at all, so every existing canon, golden and
// fixture digest is byte-identical.
export const CAPTURE_RECEIPT_VERSION = 1;

// The four reserved edge/overlay slots, schema-present + null by default. Frozen
// so every digest carries the same shape and a materializing wave (§4j sea lanes,
// air/teleport edge sets, §4i seasonal overlay) can light its slot without a
// schema break. M3 (SEASONS-B) lights `seasonalOverlay` ON OPT-IN ONLY; M8 (SEA
// LANES) lights `seaLanes` ON OPT-IN ONLY. Default (every pre-M3/M8 canon / golden)
// keeps EVERY slot null ⇒ the seasonal + sea reads are dormant ⇒ byte-identical.
// The KEY ORDER is fixed (airField, seaLanes, seasonalOverlay, teleportEdges) so a
// materializing wave changes a slot's VALUE, never the serialized shape. M9c (TELEPORT
// BLOCS) lights `teleportEdges` ON OPT-IN ONLY; default (every pre-M9c canon / golden)
// keeps it null ⇒ the teleport read is dormant ⇒ byte-identical. The other null slots
// stay null (their own waves light them).
/** @param {object|null} [seasonalOverlay] @param {object|null} [seaLanes] @param {object|null} [teleportEdges] */
function reservedSlots(seasonalOverlay = null, seaLanes = null, teleportEdges = null) {
  return { airField: null, seaLanes: seaLanes ?? null, seasonalOverlay: seasonalOverlay ?? null, teleportEdges: teleportEdges ?? null };
}

// ── A deterministic integer binary min-heap (dist asc, then cell index asc) ──
// A strict total order (cell index is unique), so the heap's shape — and thus
// every pop order — is a pure function of the pushes. Lazy deletion (stale
// entries skipped on pop) keeps it decrease-key-free and order-stable.
function makeHeap() {
  /** @type {Array<{ d: number, c: number }>} */
  const a = [];
  const less = (/** @type {{d:number,c:number}} */ x, /** @type {{d:number,c:number}} */ y) =>
    (x.d !== y.d ? x.d < y.d : x.c < y.c);
  const swap = (/** @type {number} */ i, /** @type {number} */ j) => { const t = a[i]; a[i] = a[j]; a[j] = t; };
  return {
    get size() { return a.length; },
    push(/** @type {number} */ d, /** @type {number} */ c) {
      a.push({ d, c });
      let i = a.length - 1;
      while (i > 0) {
        const p = (i - 1) >> 1;
        if (less(a[i], a[p])) { swap(i, p); i = p; } else break;
      }
    },
    pop() {
      const top = a[0];
      const last = a.pop();
      if (a.length > 0 && last) {
        a[0] = last;
        let i = 0;
        for (;;) {
          const l = 2 * i + 1;
          const r = 2 * i + 2;
          let m = i;
          if (l < a.length && less(a[l], a[m])) m = l;
          if (r < a.length && less(a[r], a[m])) m = r;
          if (m === i) break;
          swap(i, m); i = m;
        }
      }
      return top;
    },
  };
}

/**
 * Normalize the captured pack into the frozen cell arrays + a stable cell count.
 * cellCount is the shortest of the driving arrays (h drives land/impassable, p
 * drives geometry, c drives adjacency) so a ragged capture can't index off the
 * end. Pure structural read; no mutation of the input.
 *
 * W-CAP CAP-1 (D1) widened this in ONE act with the bridge that feeds it — because
 * this function SILENTLY DROPS every key it does not name, a capture field that
 * lands here unhandled is invisible rather than broken, and no test that never
 * normalizes would catch it. Two rules hold the widening honest:
 *
 *   1. THE DRIVING SET IS UNCHANGED. `cellCount` is still `min(h, p, c)` — the new
 *      arrays are EXCLUDED from it, exactly as `r` and `biome` always were. A pack
 *      whose flux array is short (or absent) must not shrink the map; the reader
 *      bounds itself instead.
 *   2. TWO DENOMINATORS, NEVER MIXED. `h/biome/r/p/c/fl/g` are PACK-indexed and
 *      bounded by `cellCount`; `temp/prec` are GRID-indexed and bounded by
 *      `gridCellCount`. A pack cell reaches its climate row ONLY through
 *      `g[packCell]`. Both counts are returned so a consumer never has to infer a
 *      bound from an array length that a ragged capture may have truncated.
 *
 * @param {CapturedSpatialPack} pack
 */
export function normalizeSpatialPack(pack) {
  /** @type {SpatialPackCells} */
  const cells = pack?.cells || {};
  /** @type {SpatialPackGrid} */
  const gridCells = pack?.grid || {};
  const h = Array.isArray(cells.h) ? cells.h : [];
  const biome = Array.isArray(cells.biome) ? cells.biome : [];
  const r = Array.isArray(cells.r) ? cells.r : [];
  const p = Array.isArray(cells.p) ? cells.p : [];
  const c = Array.isArray(cells.c) ? cells.c : [];
  // CAP-1 — PACK-indexed, non-driving (the r/biome precedent).
  const fl = Array.isArray(cells.fl) ? cells.fl : [];
  const g = Array.isArray(cells.g) ? cells.g : [];
  // CAP-1 — GRID-indexed, its own denominator.
  const temp = Array.isArray(gridCells.temp) ? gridCells.temp : [];
  const prec = Array.isArray(gridCells.prec) ? gridCells.prec : [];
  const cellCount = Math.min(h.length, p.length, c.length);
  const gridCellCount = Math.min(temp.length, prec.length);
  return { h, biome, r, p, c, fl, g, temp, prec, cellCount, gridCellCount };
}

/**
 * W-SEAM SEAM-2 — THE ONE CELL-RESOLUTION LAW.
 *
 * Which cell does a point fall in? Exactly one answer, in exactly one place, because
 * two consumers need it and two implementations would drift: the capture's cell
 * re-resolution (SEAM-2) and the territory view's flood seeds (POLIS-4, which cannot
 * use stored ids at all — instant worlds carry `cellId: null`). Amendment A1.2 §9
 * fixes the spec, and it is fixed for determinism, not for speed:
 *
 *   - SQUARED distance, compared directly. No `sqrt`, no `hypot`. Both are correctly
 *     rounded in IEEE-754, but the comparison does not need them, and every operation
 *     removed is one fewer place for two consumers to round differently.
 *   - FIRST minimum wins — a strict `<` keeps the earliest index on an exact tie, so
 *     the answer is the LOWEST-INDEX nearest cell. This mirrors the digest's own
 *     tie-break law (equal tentative ⇒ lower index) rather than inventing a second one.
 *
 * Pure, total, allocation-free. Returns null when the point is not finite or the pack
 * carries no usable centroid — never a guess, never a fallback cell.
 *
 * NB it answers NEAREST CENTROID, which is what the iframe's own `findCell` computes
 * over the same `cells.p` (a quadtree nearest-point query). That equivalence is what
 * lets the capture use a placement's stored cellId as a WITNESS that its stored x/y
 * are in the captured pack's coordinate frame at all.
 *
 * @param {number} x @param {number} y
 * @param {Array<[number, number]>|number[][]} points `pack.cells.p`
 * @param {number} [cellCount] optional bound (normalizeSpatialPack's cellCount)
 * @returns {number|null} the cell index, or null
 */
export function nearestCellTo(x, y, points, cellCount) {
  const px = Number(x);
  const py = Number(y);
  if (!Number.isFinite(px) || !Number.isFinite(py)) return null;
  const P = Array.isArray(points) ? points : [];
  const bound = Number(cellCount);
  const n = Number.isFinite(bound) ? Math.min(Math.max(0, Math.trunc(bound)), P.length) : P.length;
  let best = -1;
  let bestD2 = Infinity;
  for (let i = 0; i < n; i++) {
    const p = P[i];
    if (!p) continue;
    const dx = Number(p[0]) - px;
    const dy = Number(p[1]) - py;
    if (!Number.isFinite(dx) || !Number.isFinite(dy)) continue;
    const d2 = dx * dx + dy * dy;
    // Strict `<`: an exact tie leaves `best` on the EARLIER index.
    if (d2 < bestD2) { bestD2 = d2; best = i; }
  }
  return best >= 0 ? best : null;
}

/**
 * Resolve the placed settlements into deterministic seeds: [{ id, cellId }]
 * sorted by codepoint id, each land + on a distinct cell (the lower-id settlement
 * keeps a shared cell). Impassable (non-land) or off-map seeds are dropped and
 * reported so the caller can see why a settlement is absent from the digest.
 * @param {SpatialPlacementRow[] | null | undefined} placements
 * @param {{ h:number[], cellCount:number }} pack
 */
export function resolveSeeds(placements, pack) {
  const rows = (Array.isArray(placements) ? placements : [])
    .map((pl) => ({ id: String(pl?.id ?? ''), cellId: Number(pl?.cellId) }))
    .filter((pl) => pl.id !== '' && Number.isInteger(pl.cellId))
    .sort((x, y) => (x.id < y.id ? -1 : x.id > y.id ? 1 : 0));
  /** @type {Array<{id:string, cellId:number}>} */
  const seeds = [];
  const skipped = [];
  const usedCells = new Set();
  for (const row of rows) {
    const inRange = row.cellId >= 0 && row.cellId < pack.cellCount;
    const isLand = inRange && Number(pack.h[row.cellId]) >= 20;
    if (!isLand) { skipped.push({ id: row.id, reason: inRange ? 'not_land' : 'off_map' }); continue; }
    if (usedCells.has(row.cellId)) { skipped.push({ id: row.id, reason: 'shared_cell' }); continue; }
    usedCells.add(row.cellId);
    seeds.push({ id: row.id, cellId: row.cellId });
  }
  return { seeds, skipped };
}

/**
 * Sorted-key object builder — insert keys in a stable order so JSON.stringify is
 * byte-identical across builds (non-integer string keys serialize in insertion
 * order; we always insert sorted). Value-type-preserving.
 * @template V
 * @param {Array<[string, V]>} entries
 * @returns {Record<string, V>}
 */
function sortedObject(entries) {
  /** @type {Record<string, V>} */
  const out = {};
  for (const [k, v] of entries.slice().sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0))) {
    out[k] = v;
  }
  return out;
}

const pairKey = (/** @type {string} */ a, /** @type {string} */ b) => (a < b ? `${a}|${b}` : `${b}|${a}`);

/**
 * V-6 BIOME TRUTH — the additive biome sub-digest: per-settlement biome (the raw FMG
 * biome id + the terrain class the cost law reads) and per-leg (gate) biome ids. A PURE
 * function of the frozen pack + the resolved seeds/gates — deterministic and byte-stable
 * (sortedObject key order). An absent/ragged biome cell reads as null (never a throw); the
 * terrain class folds height in (a settlement on a high cell reads 'mountain'). Built ONLY
 * on the biomeTexture opt-in ⇒ omitted when dark ⇒ byte-identical.
 * @param {Array<{id:string, cellId:number}>} seeds
 * @param {string[]} idOf
 * @param {Record<string, { a:string, b:string, cost:number, cellA:number, cellB:number }>} crossings
 * @param {string[]} gateKeys
 * @param {{ h:number[], biome:number[] }} pack
 * @returns {{ version:number, bySettlement: Record<string, {biome:number|null, terrain:string}>,
 *   byLeg: Record<string, {a:number|null, b:number|null}> }}
 */
function buildBiomeTexture(seeds, idOf, crossings, gateKeys, pack) {
  const biomeAt = (/** @type {number} */ cell) => {
    const b = pack.biome[cell];
    return typeof b === 'number' && Number.isInteger(b) ? b : null;
  };
  /** @type {Array<[string, {biome:number|null, terrain:string}]>} */
  const bySettlementEntries = seeds.map((s, k) => [idOf[k], {
    biome: biomeAt(s.cellId),
    terrain: terrainClassOf(pack.h[s.cellId], pack.biome[s.cellId]),
  }]);
  /** @type {Array<[string, {a:number|null, b:number|null}]>} */
  const byLegEntries = gateKeys.map((key) => {
    const g = crossings[key];
    return [key, { a: biomeAt(g.cellA), b: biomeAt(g.cellB) }];
  });
  return {
    version: BIOME_TEXTURE_VERSION,
    bySettlement: sortedObject(bySettlementEntries),
    byLeg: sortedObject(byLegEntries),
  };
}

/**
 * W-CAP CAP-3 — the climate band at ONE pack cell, or `unknown`.
 *
 * ⛔ THE `g` BRIDGE IS THE WHOLE FUNCTION. `temp`/`prec` are GRID-indexed and this
 * cell id is PACK-indexed, so the climate row is reached through `g[packCell]` and
 * NEVER by indexing the climate arrays with a pack id. FMG's own biome pass does
 * exactly this (`prec[cells.g[cell]]`), which is the only reason a projection is not
 * being invented here. A missing `g`, an out-of-range grid id, or a ragged climate
 * array all answer `unknown` — never a guessed band.
 *
 * @param {{ g:number[], temp:number[], prec:number[], gridCellCount:number }} pack a NORMALIZED pack
 * @param {number} cell a PACK cell id
 * @returns {string} a CLIMATE_BANDS member
 */
export function climateBandOf(pack, cell) {
  const gridCell = Number((pack.g || [])[cell]);
  if (!Number.isInteger(gridCell) || gridCell < 0 || gridCell >= pack.gridCellCount) return 'unknown';
  const temp = Number((pack.temp || [])[gridCell]);
  const prec = Number((pack.prec || [])[gridCell]);
  if (!Number.isFinite(temp) || !Number.isFinite(prec)) return 'unknown';
  // Harsh is decided FIRST — see the ordering note at the constants.
  if (temp < GLACIAL_TEMP_C) return 'harsh';
  if (prec < ARID_PREC) return 'harsh';
  if (temp >= HOT_DESERT_TEMP_C && prec < HOT_DESERT_PREC) return 'harsh';
  if (temp >= MILD_MIN_TEMP_C && prec >= MILD_MIN_PREC) return 'mild';
  return 'standard';
}

/**
 * W-CAP CAP-3 CLIMATE TRUTH — the additive climate sub-digest: the banded climate at
 * each settlement's own grid cell, plus the raw readings the band was derived from so
 * a reader can audit the verdict instead of trusting it.
 *
 * A PURE function of the frozen pack + the resolved seeds — deterministic and
 * byte-stable (sortedObject key order). Built ONLY on the climateTexture opt-in ⇒
 * omitted when dark ⇒ byte-identical.
 *
 * ⚠ CAPTURED INPUTS ONLY (A1.2.14): this reads `pack.g/temp/prec` and NEVER a sibling
 * sub-digest. `biomes` is not consulted even though it is adjacent and would look
 * convenient — a sub-digest that reads another sub-digest makes the two impossible to
 * version independently.
 * @param {Array<{id:string, cellId:number}>} seeds
 * @param {string[]} idOf
 * @param {{ g:number[], temp:number[], prec:number[], gridCellCount:number }} pack
 * @returns {{ version:number, bySettlement: Record<string,
 *   {band:string, temp:number|null, prec:number|null}> }}
 */
function buildClimateTexture(seeds, idOf, pack) {
  const readingAt = (/** @type {number} */ cell) => {
    const gridCell = Number((pack.g || [])[cell]);
    if (!Number.isInteger(gridCell) || gridCell < 0 || gridCell >= pack.gridCellCount) {
      return { temp: null, prec: null };
    }
    const temp = Number((pack.temp || [])[gridCell]);
    const prec = Number((pack.prec || [])[gridCell]);
    return {
      temp: Number.isFinite(temp) ? temp : null,
      prec: Number.isFinite(prec) ? prec : null,
    };
  };
  /** @type {Array<[string, {band:string, temp:number|null, prec:number|null}]>} */
  const entries = seeds.map((s, k) => {
    const { temp, prec } = readingAt(s.cellId);
    return [idOf[k], { band: climateBandOf(pack, s.cellId), temp, prec }];
  });
  return { version: CLIMATE_BAND_VERSION, bySettlement: sortedObject(entries) };
}

/**
 * W-SEAM SEAM-1 (S3): the CAPTURE RECEIPT — what the capture noticed about the rows
 * it was handed, as opposed to the geography it derived from them.
 *
 * `terrainDisagreements` records every seeded settlement whose OWN declared terrain
 * (`config.terrainType`, arriving on the placement row) contradicts the geography of
 * the cell it sits on. It never rewrites terrainType — genesis derivations hang off
 * that value and for a canon settlement the write would be lived-history-adjacent.
 * The receipt is the honest middle: the DM can see the two truths disagree and decide.
 *
 * PROBLEMS ONLY (the `skippedSettlements` idiom): `agrees` and `unknown` produce no
 * row, so a healthy realm — and every fixture whose placements carry no terrainType at
 * all — yields an EMPTY receipt, which the caller drops entirely. Absent key ⇒
 * byte-identical to the pre-SEAM digest.
 *
 * @param {Array<{id:string, cellId:number}>} seeds  resolved seeds, seed order
 * @param {string[]} idOf                            settlement id per seed index
 * @param {SpatialPlacementRow[] | null | undefined} placements the input rows
 * @param {{ h:number[], biome:number[], r:number[], c:number[][], cellCount:number }} pack
 * @returns {Array<{ id:string, configTerrain:string, mapTerrain:string }>}
 */
function buildTerrainDisagreements(seeds, idOf, placements, pack) {
  /** @type {Map<string, string>} */
  const declaredById = new Map();
  for (const pl of Array.isArray(placements) ? placements : []) {
    const id = pl == null ? '' : String(pl.id ?? '');
    const declared = pl && /** @type {{ terrainType?: unknown }} */ (pl).terrainType;
    if (id !== '' && typeof declared === 'string' && declared !== '') declaredById.set(id, declared);
  }
  if (declaredById.size === 0) return [];
  /** @type {Array<{ id:string, configTerrain:string, mapTerrain:string }>} */
  const rows = [];
  seeds.forEach((s, k) => {
    const id = idOf[k];
    const declared = declaredById.get(id);
    if (declared === undefined) return;
    // `terrainAgreement` is total over the two CLOSED vocabularies and answers
    // 'unknown' for anything it cannot honestly compare — an unknown config word
    // included, so an imported dossier's private terrain word never reaches the
    // frozen receipt (finite semantics: typed buckets only).
    if (terrainAgreement(declared, pack, s.cellId) !== 'disagrees') return;
    rows.push({
      id,
      configTerrain: declared,
      mapTerrain: terrainClassOf(pack.h[s.cellId], pack.biome[s.cellId]),
    });
  });
  // Seeds already arrive codepoint-sorted by id, so this array is deterministic.
  return rows;
}

/**
 * Build the frozen spatial digest. The ONE public entry point.
 * SEASONS-B (M3): `seasonalRoads:true` LIGHTS the reserved seasonalOverlay slot
 * (a per-season × per-terrain cost law) and stamps overlayVersion to
 * SEASONAL_OVERLAY_VERSION — a DISCRETE re-canonize (§V.1). Omitted (the default,
 * and every existing golden/canon) ⇒ overlay null, overlayVersion 1 ⇒ dormant,
 * byte-identical.
 * SEA LANES (M8): `seaLanes:true` LIGHTS the reserved seaLanes slot — port
 * eligibility (geography ∧ institution, derived here) + the cheap high-capacity
 * water edge set (§4j). Placements may carry an `institutions` roster (the
 * capability read); with fewer than two ELIGIBLE ports the slot stays null (the
 * dormancy floor). Omitted, or opted-in but portless (every existing golden/canon)
 * ⇒ seaLanes null ⇒ dormant, byte-identical.
 * TELEPORT BLOCS (M9c): `teleport:true` LIGHTS the reserved teleportEdges slot — the
 * clique of teleport-capable settlements (a teleportation circle / planar gate on the
 * placement roster), magic-gated + geography-independent (§4e). With fewer than two
 * circle-holders the slot stays null (the dormancy floor). Omitted, or opted-in but
 * <2 holders (every existing golden/canon) ⇒ teleportEdges null ⇒ dormant, byte-identical.
 * MG-3a: a placement row may carry `magicExists:false` (the realm magic toggle's
 * per-settlement projection) — a circle in a mundane world is masonry, so that member is
 * not teleport-capable. Absent ⇒ magical ⇒ every pre-MG canon derives byte-identically.
 * BIOME TRUTH (V-6): `biomeTexture:true` appends the additive `biomes` key (per-settlement
 * biome id + terrain class, and per-leg gate biome) extracted from the captured pack's
 * per-cell biome array. DARK by default: OMITTED (the default, and every existing golden/
 * canon) ⇒ NO biomes key ⇒ BYTE-IDENTICAL. The road scene + travel news read it for
 * biome/season texture. A pure function of the frozen pack ⇒ deterministic extraction.
 * CLIMATE TRUTH (W-CAP CAP-3): `climateTexture:true` appends the additive `climate` key —
 * the banded climate (`harsh|standard|mild|unknown`) at each settlement's own GRID cell,
 * reached through `cells.g`, plus the raw temp/prec the band came from. DARK by default:
 * OMITTED (the default, and every existing golden/canon) ⇒ NO climate key ⇒ BYTE-IDENTICAL.
 * The seasons food year reads it in place of its terrain-word proxy when it is present.
 * LAKE TYPOLOGY (W-CAP CAP-4): `lakes:true` appends the additive `lakes` key — the interior
 * (non-frame-touching) open-water bodies, each with its cell count, shoreline land-cell ids,
 * typed subtype and the water-budget readings behind it. Omitted, or opted-in on a pack with
 * no interior water (every existing golden/canon) ⇒ NO lakes key ⇒ byte-identical.
 * @param {{ pack: CapturedSpatialPack, placements?: SpatialPlacementRow[] | null,
 *           spatialGeometryVersion?:number, costLawVersion?:number,
 *           overlayVersion?:number, seasonalRoads?:boolean, seaLanes?:boolean, teleport?:boolean,
 *           biomeTexture?:boolean, climateTexture?:boolean, lakes?:boolean,
 *           cellResolution?:Array<{id:string, from:number|null, to:number|null, reason:string}>|null,
 *           sidecar?:object|null }} input
 *           `sidecar` is SEAM-3's provenance stamp, typed here as the opaque object this
 *           builder treats it as: it is carried VERBATIM into the capture receipt and never
 *           re-derived, so the digest deliberately knows nothing about its interior.
 */
export function buildSpatialDigest(input) {
  const pack = normalizeSpatialPack(input?.pack);
  const arrays = { h: pack.h, biome: pack.biome, r: pack.r };
  const { seeds, skipped } = resolveSeeds(input?.placements, pack);

  // M3 opt-in: the seasonal overlay is frozen INTO this canon; dormant by default.
  const seasonalRoads = input?.seasonalRoads === true;
  const seasonalOverlay = seasonalRoads ? buildSeasonalOverlay() : null;

  // M8 opt-in: derive ports (geography ∧ institution) + the water edge set, frozen
  // INTO this canon under the reserved seaLanes slot; dormant (null) by default and
  // whenever fewer than two eligible ports exist. The institution roster rides the
  // placement rows (`institutions`), so eligibility is a pure function of the frozen
  // geometry + the roster — re-derived on founding events by a re-canonize (§4j).
  const seaLanesOptIn = input?.seaLanes === true;
  // M9c opt-in: teleport bloc edges (a teleport-capable institution at both ends),
  // frozen INTO this canon under the reserved teleportEdges slot; dormant (null) by
  // default and with <2 circle-holders. Magic-gated + geography-independent (no pack
  // read). Re-derived on founding events by a re-canonize (a new circle changes destiny).
  const teleportOptIn = input?.teleport === true;
  /** @type {Record<string, Array<string | { name?: unknown, catalogId?: unknown }>>} */
  const institutionsById = {};
  // MG-3a (leak L1): the per-settlement magic truth travels WITH the placement, exactly
  // as the institution roster does. Only an EXPLICIT false is recorded — an absent flag
  // means "not asserted" and leaves every pre-MG canon/golden byte-identical.
  /** @type {Record<string, boolean>} */
  const magicById = {};
  // The institution roster is the shared CAPABILITY substrate for BOTH the sea-lane
  // port derivation (geography ∧ institution) AND the teleport eligibility (a magic
  // institution ∧ a world with magic in it). Build it once when EITHER slot opts in — an
  // internal derivation, so building it under teleport does not alter the seaLanes bytes.
  if (seaLanesOptIn || teleportOptIn) {
    for (const pl of Array.isArray(input?.placements) ? input.placements : []) {
      const id = pl == null ? '' : String(pl.id ?? '');
      const insts = pl && /** @type {{ institutions?: unknown }} */ (pl).institutions;
      if (id !== '' && Array.isArray(insts)) institutionsById[id] = insts;
      if (id !== '' && pl && /** @type {{ magicExists?: unknown }} */ (pl).magicExists === false) magicById[id] = false;
    }
  }
  // The edge set is built LATER (after the land distance matrix), so a sea lane can be
  // pruned when the land route already beats it (§4j domination — a dominated sea lane
  // is never traversed and would corrupt the storm-vs-terrain cost attribution).
  /** @type {ReturnType<typeof buildSeaLanes>} */
  let seaLanes = null;

  // M9c: the teleport bloc edge set is geometry-INDEPENDENT (magic bypasses the cost
  // field), so it is built here — a pure function of the seeds + the frozen roster,
  // needing no distance matrix or domination pruning (unlike sea lanes). Null with <2
  // circle-holders (dormant). The KEY ORDER (teleportEdges LAST in reservedSlots) is
  // preserved regardless, so an unlit slot is byte-identical to a pre-M9c digest.
  const teleportEdges = teleportOptIn ? buildTeleportEdges(seeds, institutionsById, magicById) : null;

  const spatialGeometryVersion = Number.isInteger(input?.spatialGeometryVersion) ? input.spatialGeometryVersion : SPATIAL_GEOMETRY_VERSION;
  const costLawVersion = Number.isInteger(input?.costLawVersion) ? input.costLawVersion : COST_LAW_VERSION;
  const overlayVersion = Number.isInteger(input?.overlayVersion)
    ? input.overlayVersion
    : (seasonalRoads ? SEASONAL_OVERLAY_VERSION : OVERLAY_VERSION);

  const costField = buildCostField(arrays, pack.cellCount);
  let landCellCount = 0;
  for (let i = 0; i < costField.length; i++) if (costField[i] > 0) landCellCount++;
  const idOf = seeds.map((s) => s.id); // settlement index → id (sorted)
  const N = seeds.length;

  // ── Step 2: multi-source integer Dijkstra ─────────────────────────────────
  const best = new Float64Array(pack.cellCount).fill(Infinity);
  const nearest = new Int32Array(pack.cellCount).fill(-1); // settlement INDEX
  const pred = new Int32Array(pack.cellCount).fill(-1);    // predecessor cell
  const finalized = new Uint8Array(pack.cellCount);
  const heap = makeHeap();
  for (let k = 0; k < N; k++) {
    const cell = seeds[k].cellId;
    best[cell] = 0;
    nearest[cell] = k;
    pred[cell] = -1;
    heap.push(0, cell);
  }
  while (heap.size > 0) {
    const top = heap.pop();
    const u = top.c;
    if (finalized[u]) continue; // stale (lazy-deleted) entry
    finalized[u] = 1;
    const du = best[u];
    const neighbours = pack.c[u] || [];
    for (let idx = 0; idx < neighbours.length; idx++) {
      const v = neighbours[idx];
      if (v == null || v < 0 || v >= pack.cellCount) continue;
      const cellCostV = costField[v];
      if (!(cellCostV > 0)) continue; // impassable (ocean / off-map): dense-field sentinel 0
      const w = cellCostV * quantizeDist(u, v, pack.p); // positive integer edge weight
      const cand = du + w;
      if (cand < best[v]) {
        best[v] = cand; pred[v] = u; nearest[v] = nearest[u];
        heap.push(cand, v);
      } else if (cand === best[v] && !finalized[v] && u < pred[v]) {
        // Equal tentative ⇒ keep the lower predecessor index (II.3-1). dist is
        // unchanged so no re-push; territory follows the deterministic predecessor.
        pred[v] = u; nearest[v] = nearest[u];
      }
    }
  }

  // ── territory (DENSE per-cell → settlement INDEX; -1 = ocean/unreached) ─────
  // Index-encoded (not id-string) for compactness: a settlement-id string per
  // cell was the single biggest digest field (see the size report). Consumers
  // resolve index → id via digest.settlementIds. A plain array so it JSON-
  // serializes / structured-clones inside the object-shaped digest.
  const territory = new Array(pack.cellCount);
  for (let i = 0; i < pack.cellCount; i++) territory[i] = nearest[i] >= 0 ? nearest[i] : -1;

  // ── Step 3: territory adjacency + gates (one edge scan) ────────────────────
  // For each unordered adjacent territory pair, the cheapest boundary crossing:
  // its cost (base neighbour distance) and the two boundary cells (the gate).
  /** @type {Record<string, { a:string, b:string, cost:number, cellA:number, cellB:number }>} */
  const crossings = {};
  for (let u = 0; u < pack.cellCount; u++) {
    if (nearest[u] < 0) continue;
    const su = nearest[u];
    const du = best[u];
    const neighbours = pack.c[u] || [];
    for (let idx = 0; idx < neighbours.length; idx++) {
      const v = neighbours[idx];
      if (v == null || v < 0 || v >= pack.cellCount) continue;
      if (nearest[v] < 0 || nearest[v] === su) continue; // same territory / impassable
      const cellCostV = costField[v];
      if (!(cellCostV > 0)) continue;
      const crossCost = du + cellCostV * quantizeDist(u, v, pack.p) + best[v];
      const A = idOf[su];
      const B = idOf[nearest[v]];
      const key = pairKey(A, B);
      const prev = crossings[key];
      // Cheapest crossing wins; deterministic tie-break by lower (cellA, cellB).
      const a = A < B ? A : B;
      const b = A < B ? B : A;
      const cellA = A < B ? u : v;
      const cellB = A < B ? v : u;
      if (!prev || crossCost < prev.cost
        || (crossCost === prev.cost && (cellA < prev.cellA || (cellA === prev.cellA && cellB < prev.cellB)))) {
        crossings[key] = { a, b, cost: crossCost, cellA, cellB };
      }
    }
  }

  // Sparse settlement graph: adjacency (id → { neighbourId → cost }).
  /** @type {Record<string, Record<string, number>>} */
  const adj = {};
  for (const id of idOf) adj[id] = {};
  for (const key of Object.keys(crossings)) {
    const { a, b, cost } = crossings[key];
    adj[a][b] = Math.min(adj[a][b] ?? Infinity, cost);
    adj[b][a] = Math.min(adj[b][a] ?? Infinity, cost);
  }

  // ── Step 4a: distance matrix (Floyd-Warshall on the N-node sparse graph) ───
  const INF = Infinity;
  const dist = Array.from({ length: N }, () => new Array(N).fill(INF));
  for (let i = 0; i < N; i++) dist[i][i] = 0;
  for (let i = 0; i < N; i++) {
    for (const [nbId, c] of Object.entries(adj[idOf[i]])) {
      const j = idOf.indexOf(nbId);
      if (j >= 0) dist[i][j] = Math.min(dist[i][j], c);
    }
  }
  for (let k = 0; k < N; k++) {
    for (let i = 0; i < N; i++) {
      if (dist[i][k] === INF) continue;
      for (let j = 0; j < N; j++) {
        const through = dist[i][k] + dist[k][j];
        if (through < dist[i][j]) dist[i][j] = through;
      }
    }
  }

  // ── M8 SEA LANES: build the water edge set now the FROZEN LAND distance matrix is
  //    complete, so a dominated sea lane (land already cheaper) is pruned (§4j). The
  //    land-cost accessor reads the sparse graph's Floyd-Warshall result; an unmapped
  //    pair reads Infinity ⇒ any water lane between them is non-dominated (an island).
  if (seaLanesOptIn) {
    const idxOf = new Map(idOf.map((id, i) => [id, i]));
    const landCost = (/** @type {string} */ a, /** @type {string} */ b) => {
      const ia = idxOf.get(a); const ib = idxOf.get(b);
      return ia == null || ib == null ? Infinity : dist[ia][ib];
    };
    seaLanes = buildSeaLanes(pack, seeds, institutionsById, landCost);
  }

  // ── Step 4b: neighbour tiers (BFS depth on the unweighted sparse graph) ────
  // 1 = primary (direct territory neighbour), 2 = secondary (2 hops), 3 =
  // tertiary/distant (3+ hops or the whole reachable remainder).
  function tierRow(/** @type {number} */ src) {
    const depth = new Array(N).fill(0); // 0 = unreached (self stays 0, skipped below)
    const q = [src];
    const seen = new Uint8Array(N); seen[src] = 1;
    let head = 0;
    while (head < q.length) {
      const cur = q[head++];
      const nbs = Object.keys(adj[idOf[cur]]).map((nb) => idOf.indexOf(nb)).filter((j) => j >= 0).sort((x, y) => x - y);
      for (const j of nbs) {
        if (seen[j]) continue;
        seen[j] = 1; depth[j] = depth[cur] + 1; q.push(j);
      }
    }
    return depth;
  }

  // ── outputs: sorted, id-keyed, byte-stable ─────────────────────────────────
  /** @type {Array<[string, Record<string, number>]>} */
  const distanceEntries = [];
  /** @type {Array<[string, Record<string, number>]>} */
  const tierEntries = [];
  for (let i = 0; i < N; i++) {
    const depth = tierRow(i);
    /** @type {Array<[string, number]>} */
    const dRow = [];
    /** @type {Array<[string, number]>} */
    const tRow = [];
    for (let j = 0; j < N; j++) {
      if (j === i) continue;
      if (dist[i][j] !== INF) dRow.push([idOf[j], dist[i][j]]);
      if (depth[j] > 0) tRow.push([idOf[j], Math.min(3, depth[j])]);
    }
    distanceEntries.push([idOf[i], sortedObject(dRow)]);
    tierEntries.push([idOf[i], sortedObject(tRow)]);
  }

  // ── Step 5: gates + route receipts (per primary hop) ───────────────────────
  const gateKeys = Object.keys(crossings).sort();
  const gates = gateKeys.map((key) => {
    const g = crossings[key];
    return { between: [g.a, g.b], cellA: g.cellA, cellB: g.cellB, cost: g.cost };
  });
  /** @type {Array<[string, RouteReceipt]>} */
  const receiptEntries = gateKeys.map((key) => {
    const g = crossings[key];
    // The primary-hop crossing, attributed to the terrain class of each boundary
    // cell (why this road costs what it costs). Non-adjacent routes compose from
    // these along the distanceMatrix path — kept O(edges) so the digest stays
    // compact under the ~200KB size ruling.
    const classA = terrainClassOf(pack.h[g.cellA], pack.biome[g.cellA]);
    const classB = terrainClassOf(pack.h[g.cellB], pack.biome[g.cellB]);
    const costEnterB = quantizeCellCost(g.cellB, arrays) ?? 0;
    const distAB = quantizeDist(g.cellA, g.cellB, pack.p);
    const crossStep = costEnterB * distAB; // the boundary edge's own weight
    /** @type {Record<string, number>} */
    const byTerrain = {};
    byTerrain[classB] = (byTerrain[classB] || 0) + crossStep;
    // The approach cost on A's side is attributed to A's boundary-cell class.
    byTerrain[classA] = (byTerrain[classA] || 0) + (g.cost - crossStep);
    return [key, {
      between: [g.a, g.b],
      cost: g.cost,
      segments: [{ cellA: g.cellA, cellB: g.cellB, cost: g.cost, terrainA: classA, terrainB: classB }],
      byTerrain: sortedObject(Object.entries(byTerrain)),
    }];
  });

  // V-6 BIOME TRUTH: the additive biome sub-digest, appended LAST and ONLY when opted in.
  // Omitted (the default, every existing golden/canon) ⇒ the returned shape is byte-identical
  // to the pre-V-6 digest (a conditional spread of {} adds no key). Present ⇒ a materializing
  // biomeTexture canon (the seasonalOverlay/seaLanes/teleport opt-in idiom).
  const biomes = input?.biomeTexture === true
    ? buildBiomeTexture(seeds, idOf, crossings, gateKeys, pack)
    : null;

  // W-CAP CAP-3 CLIMATE TRUTH: the additive climate sub-digest, appended after `biomes`
  // and ONLY when opted in. Omitted (the default, every existing golden/canon, and every
  // capture that carried no grid climate) ⇒ NO climate key ⇒ the returned shape is
  // byte-identical to the pre-CAP-3 digest. The KEY ORDER is fixed here once —
  // reserved, biomes, climate, captureReceipt — so a later wave lighting a slot changes
  // a VALUE and never the serialized shape.
  const climate = input?.climateTexture === true
    ? buildClimateTexture(seeds, idOf, pack)
    : null;

  // W-CAP CAP-4 LAKE TYPOLOGY: the additive lake sub-digest, appended after `climate` and
  // ONLY when opted in. Omitted (the default, and every existing golden/canon) ⇒ NO lakes
  // key ⇒ byte-identical. Null also when the pack holds no INTERIOR water at all (every
  // body reaches the map frame), which is the same dormancy floor the seaLanes and
  // teleport slots use: an empty answer is no key, never an empty container.
  const lakes = input?.lakes === true ? deriveLakes(pack) : null;

  // W-SEAM: the additive CAPTURE RECEIPT, appended LAST and ONLY when the capture had
  // something to report. Nothing to report (every existing golden/canon/fixture, and
  // any realm whose declared terrains match the ground) ⇒ NO key ⇒ the returned shape
  // is byte-identical to the pre-SEAM digest.
  const terrainDisagreements = buildTerrainDisagreements(seeds, idOf, input?.placements, pack);
  // SEAM-2's rows arrive already built (the re-resolution happens AT the capture, which
  // is the only place that still holds the placements' stored x/y). The digest carries
  // them verbatim so the two seams share ONE receipt envelope with ONE version.
  const cellResolution = Array.isArray(input?.cellResolution) && input.cellResolution.length
    ? input.cellResolution
    : null;
  // SEAM-3's provenance stamp rides the SAME envelope — one receipt, one version, three
  // seams. It is carried VERBATIM as the capture built it: this builder never re-derives a
  // stamp, because a stamp re-derived here would describe the pack the DIGEST saw rather
  // than the pack the CAPTURE held, and those are the two things the stamp exists to tell
  // apart. Absent (every fixture, every existing canon) ⇒ no key ⇒ byte-identical.
  const captureSidecar = input?.sidecar && typeof input.sidecar === 'object' ? input.sidecar : null;
  const captureReceipt = (terrainDisagreements.length || cellResolution || captureSidecar)
    ? {
      version: CAPTURE_RECEIPT_VERSION,
      ...(cellResolution ? { cellResolution } : {}),
      ...(terrainDisagreements.length ? { terrainDisagreements } : {}),
      ...(captureSidecar ? { sidecar: captureSidecar } : {}),
    }
    : null;

  // ── assemble the digest (fixed key order; object-shaped for the conditional
  //    ledger clone; nested arrays live INSIDE) ───────────────────────────────
  return {
    spatialGeometryVersion,
    costLawVersion,
    overlayVersion,
    settlementIds: idOf.slice(),
    cellCount: pack.cellCount,
    landCellCount,
    skippedSettlements: skipped,
    costField,
    territory,
    tiers: sortedObject(tierEntries),
    distanceMatrix: sortedObject(distanceEntries),
    gates,
    routeReceipts: sortedObject(receiptEntries),
    reserved: reservedSlots(seasonalOverlay, seaLanes, teleportEdges),
    ...(biomes ? { biomes } : {}),
    ...(climate ? { climate } : {}),
    ...(lakes ? { lakes } : {}),
    ...(captureReceipt ? { captureReceipt } : {}),
  };
}
