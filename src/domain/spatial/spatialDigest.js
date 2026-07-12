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
  buildSeasonalOverlay,
  SEASONAL_OVERLAY_VERSION,
} from './spatialCost.js';

// ── Input shapes (the captured pack + placements the builder consumes) ───────
/**
 * The frozen FMG cell arrays as a capture hands them over (pack.cells). Every
 * field is optional — a ragged or partial capture is normalized by
 * normalizeSpatialPack (absent arrays read as empty; cellCount clamps to the
 * shortest driving array).
 * @typedef {Object} SpatialPackCells
 * @property {number[]} [h]      per-cell height (FMG 0..100; land >= 20)
 * @property {number[]} [biome]  per-cell FMG biome id
 * @property {number[]} [r]      per-cell river id (0 = none)
 * @property {Array<[number, number]|number[]>} [p]  per-cell centroid [x, y]
 * @property {number[][]} [c]    per-cell adjacent cell ids
 */

/**
 * A captured FMG pack (the digest builder's raw input) — nullish-tolerant.
 * @typedef {{ cells?: SpatialPackCells | null } | null | undefined} CapturedSpatialPack
 */

/**
 * One raw settlement placement row as callers supply it (the live capture, the
 * store seam, or a test fixture): settlement id + FMG cell. Tolerant — the row
 * may be nullish and its fields loosely typed; resolveSeeds normalizes
 * (String/Number) and drops the invalid.
 * @typedef {{ id?: string|number|null, cellId?: number|string|null } | null | undefined} SpatialPlacementRow
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

// The four reserved edge/overlay slots, schema-present + null by default. Frozen
// so every digest carries the same shape and a materializing wave (§4j sea lanes,
// air/teleport edge sets, §4i seasonal overlay) can light its slot without a
// schema break. M3 (SEASONS-B) lights `seasonalOverlay` ON OPT-IN ONLY: default
// (every pre-M3 canon / golden) stays null ⇒ the seasonal read is dormant ⇒
// byte-identical. The OTHER three stay null (their own waves light them).
/** @param {object|null} [seasonalOverlay] */
function reservedSlots(seasonalOverlay = null) {
  return { airField: null, seaLanes: null, seasonalOverlay: seasonalOverlay ?? null, teleportEdges: null };
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
 * @param {CapturedSpatialPack} pack
 */
export function normalizeSpatialPack(pack) {
  /** @type {SpatialPackCells} */
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
 * Build the frozen spatial digest. The ONE public entry point.
 * SEASONS-B (M3): `seasonalRoads:true` LIGHTS the reserved seasonalOverlay slot
 * (a per-season × per-terrain cost law) and stamps overlayVersion to
 * SEASONAL_OVERLAY_VERSION — a DISCRETE re-canonize (§V.1). Omitted (the default,
 * and every existing golden/canon) ⇒ overlay null, overlayVersion 1 ⇒ dormant,
 * byte-identical.
 * @param {{ pack: CapturedSpatialPack, placements?: SpatialPlacementRow[] | null,
 *           spatialGeometryVersion?:number, costLawVersion?:number,
 *           overlayVersion?:number, seasonalRoads?:boolean }} input
 */
export function buildSpatialDigest(input) {
  const pack = normalizeSpatialPack(input?.pack);
  const arrays = { h: pack.h, biome: pack.biome, r: pack.r };
  const { seeds, skipped } = resolveSeeds(input?.placements, pack);

  // M3 opt-in: the seasonal overlay is frozen INTO this canon; dormant by default.
  const seasonalRoads = input?.seasonalRoads === true;
  const seasonalOverlay = seasonalRoads ? buildSeasonalOverlay() : null;

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
    reserved: reservedSlots(seasonalOverlay),
  };
}
