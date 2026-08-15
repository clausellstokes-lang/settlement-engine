/**
 * seaLanes.js — Phase 5.5 mover wave M8: SEA LANES MATERIALIZED (design §4j).
 *
 * Water becomes the highway it historically was — but access is EARNED, not free.
 * This is the BUILDER side of the reserved `seaLanes` digest slot (the read side —
 * the dormancy gate, the sea-augmented routing, the storm-season blend — lives in
 * distanceRead.js, reading the SELF-DESCRIBING frozen slot straight off the digest,
 * exactly as M3's seasonal READ reads the seasonalOverlay slot). Keeping the read
 * in distanceRead is why distanceRead never imports THIS module: seaLanes pulls the
 * institution catalog to enumerate water-access capability, and a distanceRead→
 * catalog edge would force the catalog into that light leaf's chunk. So the split
 * mirrors spatialCost (builder) / distanceRead (reader) precisely.
 *
 * THE OWNER'S PORT RULE (§4j) — eligibility = GEOGRAPHY ∧ INSTITUTIONS, both
 * DERIVED at digest build (pure functions of the frozen geometry + the institution
 * roster), so ports EMERGE mid-campaign the moment a settlement founds a harbour
 * (the receipted re-canonize path re-derives them):
 *
 *   • GEOGRAPHY (necessary): the settlement's cell is coastal (a land cell with an
 *     ocean/off-map neighbour) OR sits on a river course (r[cell] != 0). A
 *     landlocked settlement can NEVER buy its way onto the water.
 *   • CAPABILITY (sufficient once geography holds): the settlement HAS a water-
 *     access institution from the catalog (dock / harbour / shipyard / boatyard /
 *     ferry / fishing community — enumerated from the ACTUAL catalog by its own
 *     'port' / 'shipbuilding' tags + `tradeRouteRequired: ['port', …]`, never a new
 *     authored flag). A coastal settlement WITHOUT a dock is a beach, not a port.
 *
 * THE SEA/RIVER EDGE SET (the keystone schema reservation, now settled): a SEPARATE
 * edge set beside the frozen land distance field (the PART VI air/teleport pattern),
 * materialized ONLY when ≥2 eligible ports exist. Water lanes connect the eligible
 * ports; the frozen land distanceMatrix is NEVER re-baked (the read folds the sea
 * edges into the routing graph at READ time — distanceRead). Water is the historical
 * ORDER-OF-MAGNITUDE advantage: LOW cost, HIGH capacity vs land — so a cheap sea
 * lane beats a long land haul and an island-with-a-harbour is a HUB, not a hermit
 * (the isolation inversion). Every cost constant is documented below.
 *
 * STORM SEASON (M3 composes): the slot carries its OWN self-describing per-season
 * sea multiplier (`stormSeasonCost`) — winter storms price up the cheap sea route
 * exactly when the granary math bites — kept SEPARATE from the land seasonalOverlay
 * (whose frozen table + golden are untouched by this wave). Read-time only.
 *
 * V1 SCOPE (architect, §4j): edges + port-gates. Blockade + piracy compose through
 * the EXISTING danger/interdiction seams (piracy = M1 embattlement on the port
 * nodes a sea route traverses; naval blockade = the supply layer's sea routing +
 * hostile-gate interception — a port needs BOTH land AND sea cut to starve). The
 * ship-crew rumor carrier + refugee sea passage ride the sea-aware read.
 *
 * SCOPE SUPERSESSION (W-NAVY, design §0 — the conscious amendment): the owner's three
 * naval laws supersede M8's original "NO FLEET COMBAT" boundary. HOW honors the frozen
 * slot: THIS MODULE STILL MINTS NO BATTLE — the seaLanes digest slot is battle-free and
 * byte-frozen (its exact keys are pinned). Fleet combat, convoys, and blockades now live
 * in the NAVAL LAYER (spatial/navalLayer.js + worldPulse/navalKernel.js), whose state
 * rides a NEW `spatialLedgers.navalTransit` ledger — NEVER this frozen slot.
 *
 * PURE + seeded + lazy: no iframe, no tier/auth, no Date/Math.random. Imported ONLY
 * by spatialDigest.js (the lazy canonize chunk) ⇒ zero first-paint bytes. The slot
 * rides the EXISTING spatialDigest reserved slot — no new worldState ledger key, no
 * new eager literal. Dormant (no opt-in / <2 ports) ⇒ slot null ⇒ byte-identical.
 */

import { institutionalCatalog, catalogIdForName } from '../../data/institutionalCatalog.js';
import {
  isMaterializedCustomContent,
} from '../content/customContentSemanticAuthority.js';
import { LAND_HEIGHT } from './spatialCost.js';

// The self-describing slot version. Bumping it is a DISCRETE re-canonize event
// (§V.1) — an existing frozen digest keeps its own seaLanes forever; only an
// explicit spatial re-canonize re-derives. Never a silent drift on load.
export const SEA_LANE_VERSION = 1;

// ── The water ECONOMICS constants (documented; the §4j order-of-magnitude) ─────
// Land per-cell entry cost is COST_SCALE-quantized to ~90..1560 (BIOME_COST 0.9..
// >4 × elevMult × COST_SCALE 100), and a primary land hop composes several such
// steps × integer cell distance — a median primary hop in the fixtures is in the
// low thousands. A sea lane's cost is the geometric port-to-port centroid distance
// scaled by SEA_COST_PER_DIST — an ORDER OF MAGNITUDE below the land per-distance
// rate, so water is decisively cheaper for the same span (the historical
// advantage). Floored at SEA_LANE_MIN_COST so no zero-weight lane can create a free
// cycle in the routing graph.
export const SEA_COST_PER_DIST = 12; // vs land's ~90..1560 per cell-step: ~10× cheaper
export const SEA_LANE_MIN_COST = 1;

// HIGH capacity — the other half of the historical advantage (a ship moves what a
// caravan cannot). Recorded on each edge for the schema + future flow work; v1
// routing reads cost, not capacity (no capacity throttle yet — the abstraction).
export const SEA_LANE_CAPACITY = 10; // vs an implicit land capacity of 1

// The SPARSE edge budget: within a water body a port links to its K nearest ports
// (coastal hopping) PLUS a spanning tree that guarantees the body's ports form ONE
// connected sea-graph (the hub property — any port reaches any other by water, multi-
// hop). This is O(K·P + P) per water body, NOT the O(P²) clique — so a 90-port realm
// cannot blow the digest cap (the clique did: ~4,000 edges), and no lane ever crosses
// land or joins two SEPARATE seas (the reachability constraint).
export const SEA_LANE_K_NEIGHBOURS = 4;

// STORM SEASON (round 19 composes, §4j): winter closes/prices-up the cheap sea
// route; the mud-shoulder seasons raise it modestly; summer is the calm sailing
// season (1.0). FINITE and ≥ 1 (a storm never DISCOUNTS the crossing, and — the
// slow-not-sever law — never SEVERS it: a winter grain ship is dear + slow, not
// impossible). Kept on the slot (self-describing) so the land seasonalOverlay table
// + its golden are byte-untouched by this wave.
export const STORM_SEASON_COST = Object.freeze({
  spring: 1.3, summer: 1.0, autumn: 1.5, winter: 2.5,
});

// ── Small pure helpers ────────────────────────────────────────────────────────
/** @param {unknown} v @returns {number} */
function num(v) {
  return typeof v === 'number' && Number.isFinite(v) ? v : 0;
}

/**
 * Boolean-only custom-provenance adapter for the compact roster shape below.
 *
 * @param {unknown} institution
 * @returns {boolean}
 */
function hasCustomContentProvenance(institution) {
  return isMaterializedCustomContent(institution);
}

// ── CAPABILITY: the water-access institution set, enumerated from the catalog ──
// A settlement HAS water access when it carries an institution the catalog marks
// maritime: its def declares a 'port' or 'shipbuilding' tag, OR its
// `tradeRouteRequired` lists 'port' (docks, shipyards, boatyards, ferries, fishing
// communities — whatever the ACTUAL catalog holds, no authored flag). Built once
// (a pure derivation of the frozen catalog) and matched id-FIRST (a DM-renamed but
// catalog-stamped institution keeps its capability) with a name fallback (a
// genuinely unstamped legacy/custom row matches by canonical name). Current
// provenance-stamped custom presentation names stop at the authority boundary.
// NB: no `tier`/`auth`/`premium` identifier appears here — the domain stays
// tier-blind (invariant test).
const WATER_ACCESS = (() => {
  /** @type {Set<string>} */
  const names = new Set();
  /** @type {Set<string>} */
  const ids = new Set();
  const isMaritime = (/** @type {{ tags?: unknown, tradeRouteRequired?: unknown }} */ def) => {
    const tags = Array.isArray(def?.tags) ? def.tags.map(String) : [];
    if (tags.includes('port') || tags.includes('shipbuilding')) return true;
    const routes = Array.isArray(def?.tradeRouteRequired) ? def.tradeRouteRequired.map(String) : [];
    return routes.includes('port');
  };
  for (const group of Object.values(institutionalCatalog || {})) {
    for (const entries of Object.values(/** @type {Record<string, Record<string, unknown>>} */ (group) || {})) {
      for (const [name, def] of Object.entries(entries || {})) {
        if (!isMaritime(/** @type {{ tags?: unknown }} */ (def))) continue;
        names.add(name);
        const id = catalogIdForName(name);
        if (id) ids.add(id);
      }
    }
  }
  return { names, ids };
})();

/** The set of catalog institution NAMES that grant water access (for tests/receipts). */
export function waterAccessInstitutionNames() {
  return [...WATER_ACCESS.names].sort();
}

/**
 * Does an institution roster grant water access? Each row may be a string name or a
 * `{ name, catalogId? }` object (the settlement roster shape). Matches id-first
 * (a catalog-stamped renamed institution keeps capability) then by canonical
 * name for native/unstamped legacy rows.
 * @param {Array<string | { name?: unknown, catalogId?: unknown, id?: unknown }> | null | undefined} institutions
 * @returns {boolean}
 */
export function hasWaterAccessInstitution(institutions) {
  const rows = Array.isArray(institutions) ? institutions : [];
  for (const row of rows) {
    if (row == null) continue;
    if (typeof row === 'string') {
      if (WATER_ACCESS.names.has(row) || (catalogIdForName(row) && WATER_ACCESS.ids.has(/** @type {string} */ (catalogIdForName(row))))) return true;
      continue;
    }
    // Current custom names are presentation-only. String rows and provenance-
    // free objects retain the historical fallback for legacy saves.
    if (hasCustomContentProvenance(row)) continue;
    const stampedId = row.catalogId != null ? String(row.catalogId) : null;
    if (stampedId && WATER_ACCESS.ids.has(stampedId)) return true;
    const name = row.name != null ? String(row.name) : (row.id != null ? String(row.id) : '');
    if (name && WATER_ACCESS.names.has(name)) return true;
    const idByName = name ? catalogIdForName(name) : null;
    if (idByName && WATER_ACCESS.ids.has(idByName)) return true;
  }
  return false;
}

// ── GEOGRAPHY: proximity to navigable water (pure reads of the frozen pack) ────
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

// ── PORT ELIGIBILITY = geography ∧ institutions (the pure derivation) ──────────
/**
 * @typedef {Object} PortEligibility
 * @property {string} id
 * @property {number} cellId
 * @property {boolean} coastal            geography: a shore cell
 * @property {boolean} river              geography: a river-course cell
 * @property {boolean} waterAccess        capability: a maritime institution present
 * @property {boolean} port               coastal|river ∧ waterAccess (the §4j rule)
 */

/**
 * Derive per-seed port eligibility. GEOGRAPHY IS NECESSARY, INSTITUTIONS SUFFICIENT:
 * a seed is a port iff it is on/at navigable water AND holds a water-access
 * institution. Pure + deterministic (a function of the frozen pack + the roster);
 * codepoint-sorted by id.
 * @param {{ h:number[], r:number[], c:number[][], cellCount:number }} pack
 * @param {Array<{ id:string, cellId:number }>} seeds  the resolved digest seeds (land, distinct cell)
 * @param {Record<string, Array<string | { name?: unknown, catalogId?: unknown }>>} institutionsById
 * @returns {PortEligibility[]}
 */
export function derivePortEligibility(pack, seeds, institutionsById) {
  const roster = institutionsById && typeof institutionsById === 'object' ? institutionsById : {};
  const rows = (Array.isArray(seeds) ? seeds : []).map((s) => {
    const id = String(s.id);
    const cellId = Number(s.cellId);
    const coastal = isCoastalCell(pack, cellId);
    const river = isRiverCell(pack, cellId);
    const waterAccess = hasWaterAccessInstitution(roster[id]);
    return { id, cellId, coastal, river, waterAccess, port: (coastal || river) && waterAccess };
  });
  return rows.sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
}

// ── THE SEA/RIVER EDGE SET (sparse + water-reachability-constrained) ────────────
/** Integer geometric centroid distance between two cells (floored ≥ 1). Pure. */
/** @param {number} a @param {number} b @param {Array<[number,number]|number[]>} p */
function centroidDist(a, b, p) {
  const pa = (p || [])[a];
  const pb = (p || [])[b];
  if (!pa || !pb) return 1;
  const dx = num(pa[0]) - num(pb[0]);
  const dy = num(pa[1]) - num(pb[1]);
  return Math.max(1, Math.round(Math.sqrt(dx * dx + dy * dy)));
}

/** A minimal deterministic union-find (path-compressed) keyed on non-negative ints. */
function makeUnionFind() {
  /** @type {Map<number, number>} */
  const parent = new Map();
  const find = (/** @type {number} */ x) => {
    if (!parent.has(x)) { parent.set(x, x); return x; }
    let root = x;
    while (parent.get(root) !== root) root = /** @type {number} */ (parent.get(root));
    let cur = x;
    while (parent.get(cur) !== root) { const nxt = /** @type {number} */ (parent.get(cur)); parent.set(cur, root); cur = nxt; }
    return root;
  };
  const union = (/** @type {number} */ a, /** @type {number} */ b) => {
    const ra = find(a); const rb = find(b);
    if (ra !== rb) parent.set(ra, rb);
  };
  return { find, union };
}

/**
 * Is a cell NAVIGABLE water — an ocean cell (below land height) OR a river-course
 * cell (land carrying r != 0)? A ship sails both. Pure read of the frozen pack.
 * @param {{ h:number[], r:number[], cellCount:number }} pack @param {number} cell
 */
function isNavigableWater(pack, cell) {
  if (cell == null || cell < 0 || cell >= pack.cellCount) return false;
  const h = Number((pack.h || [])[cell]);
  if (!(h >= LAND_HEIGHT)) return true; // ocean / below land height
  const rv = Number((pack.r || [])[cell]);
  return Number.isFinite(rv) && rv !== 0; // river course on land
}

/**
 * Label every navigable-water cell with its connected-component id (BFS over pack
 * adjacency); land cells stay -1. Two ports can only share a lane if the water they
 * touch is the SAME component — so no lane crosses land or joins two separate seas.
 * @param {{ h:number[], r:number[], c:number[][], cellCount:number }} pack
 * @returns {Int32Array} per-cell component id (-1 = non-navigable land)
 */
function waterComponents(pack) {
  const n = pack.cellCount;
  const comp = new Int32Array(n).fill(-1);
  let next = 0;
  for (let start = 0; start < n; start++) {
    if (comp[start] !== -1 || !isNavigableWater(pack, start)) continue;
    const id = next++;
    comp[start] = id;
    const stack = [start];
    while (stack.length) {
      const u = /** @type {number} */ (stack.pop());
      for (const v of (pack.c || [])[u] || []) {
        if (v == null || v < 0 || v >= n || comp[v] !== -1 || !isNavigableWater(pack, v)) continue;
        comp[v] = id; stack.push(v);
      }
    }
  }
  return comp;
}

/** The navigable-water cells a port EMBARKS from: its own cell if it is a river
 *  course, plus every adjacent navigable-water cell (a coastal port boards from the
 *  ocean next door; a river port from its own reach). The ship's voyage is measured
 *  from these cells. @param {{ h:number[], r:number[], c:number[][], cellCount:number }} pack
 *  @param {number} cellId @returns {number[]} sorted unique water cell ids */
function portWaterCells(pack, cellId) {
  const set = new Set();
  if (isNavigableWater(pack, cellId)) set.add(cellId);
  for (const v of (pack.c || [])[cellId] || []) {
    if (v == null || v < 0 || v >= pack.cellCount) continue;
    if (isNavigableWater(pack, v)) set.add(v);
  }
  return [...set].sort((a, b) => a - b);
}

// A deterministic integer-keyed min-heap (dist asc, then cell index asc) — a strict
// total order, so the pop order is a pure function of the pushes (the water-path
// Dijkstra stays replay-stable). Lazy-deletion (stale entries skipped on pop).
function makeWaterHeap() {
  /** @type {Array<{ d: number, c: number }>} */
  const a = [];
  const less = (/** @type {{d:number,c:number}} */ x, /** @type {{d:number,c:number}} */ y) => (x.d !== y.d ? x.d < y.d : x.c < y.c);
  const swap = (/** @type {number} */ i, /** @type {number} */ j) => { const t = a[i]; a[i] = a[j]; a[j] = t; };
  return {
    get size() { return a.length; },
    push(/** @type {number} */ d, /** @type {number} */ c) {
      a.push({ d, c });
      let i = a.length - 1;
      while (i > 0) { const p = (i - 1) >> 1; if (less(a[i], a[p])) { swap(i, p); i = p; } else break; }
    },
    pop() {
      const top = a[0];
      const last = a.pop();
      if (a.length > 0 && last) {
        a[0] = last;
        let i = 0;
        for (;;) {
          const l = 2 * i + 1; const r = 2 * i + 2; let m = i;
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
 * WATER-PATH distances from one port to every navigable-water cell: a deterministic
 * multi-source Dijkstra over the water-cell graph (adjacency = pack.c restricted to
 * navigable water; edge weight = the cells' centroid distance), seeded 0 at the
 * port's embarkation cells. This is the CORRECT sea metric — a voyage that must sail
 * AROUND a peninsula/isthmus is priced by the long coastal path, NOT the straight-line
 * chord (which would underprice it and, with sea ~10× cheaper per distance, make
 * distant ports behave adjacent). Pure; a function of the frozen pack.
 * @param {{ h:number[], r:number[], c:number[][], p:Array<[number,number]|number[]>, cellCount:number }} pack
 * @param {number[]} sources  the port's embarkation water cells
 * @returns {Float64Array} water-path distance to each cell (Infinity = unreachable water / land)
 */
function waterPathFrom(pack, sources) {
  const n = pack.cellCount;
  const dist = new Float64Array(n).fill(Infinity);
  const done = new Uint8Array(n);
  const heap = makeWaterHeap();
  for (const s of sources) { if (s >= 0 && s < n && dist[s] > 0) { dist[s] = 0; heap.push(0, s); } }
  while (heap.size > 0) {
    const top = heap.pop();
    const u = top.c;
    if (done[u]) continue;
    done[u] = 1;
    const du = dist[u];
    for (const v of (pack.c || [])[u] || []) {
      if (v == null || v < 0 || v >= n || done[v] || !isNavigableWater(pack, v)) continue;
      const w = centroidDist(u, v, pack.p);
      const cand = du + w;
      if (cand < dist[v]) { dist[v] = cand; heap.push(cand, v); }
    }
  }
  return dist;
}

/**
 * The frozen seaLanes slot, or NULL when no water lane BEATS the land route between
 * two eligible ports (the dormancy floor). The edge set is SPARSE, WATER-REACHABILITY-
 * constrained, WATER-PATH-priced, and LAND-DOMINATED-pruned:
 *   • REACHABILITY — ports are grouped into SAILING GROUPS by the water body they
 *     touch (a river-mouth port bridges river + sea); a lane connects two ports ONLY
 *     if they share a water body (no lane crosses land or joins two separate seas);
 *   • PRICING — each lane costs the WATER-PATH distance (Dijkstra over the water-cell
 *     graph, sailing around headlands) × the cheap sea rate, NOT the straight chord;
 *   • DOMINATION — a lane is emitted ONLY when its water cost BEATS the frozen land
 *     distance between the two ports (a dominated sea lane is never traversed and would
 *     only corrupt the storm-vs-terrain cost attribution — so we never emit it);
 *   • SPARSITY — within a body, over the non-dominated candidates: a minimum SPANNING
 *     TREE (keeps the sea-dependent ports — e.g. an island — connected) PLUS each
 *     port's K NEAREST partners (coastal-hopping richness). O(P) water-path Dijkstras +
 *     O(K·P + P) persisted edges, so a large port realm can NEVER blow the digest cap.
 * Deterministic (water-cost asc, then codepoint) + codepoint-sorted edges (keyed a<b).
 * @param {{ h:number[], r:number[], c:number[][], p:Array<[number,number]|number[]>, cellCount:number }} pack
 * @param {PortEligibility[]} eligibility
 * @param {(idA:string, idB:string) => number} [landCost]  frozen land distance (Infinity = unreachable by land); default Infinity ⇒ every water lane is non-dominated
 * @returns {{ version:number, ports:string[], edges:Array<{ between:[string,string], cost:number, capacity:number }>, stormSeasonCost: Record<string, number> }|null}
 */
export function buildSeaLaneSet(pack, eligibility, landCost) {
  // derivePortEligibility already returns id-sorted; an order-preserving filter keeps it.
  const ports = (Array.isArray(eligibility) ? eligibility : []).filter((e) => e && e.port);
  if (ports.length < 2) return null;
  const land = typeof landCost === 'function' ? landCost : () => Infinity;

  // REACHABILITY — group ports by the water BODY (connected water component) they
  // touch. A confluence port that touches two components (a river meeting the sea)
  // unions them into one sailing group. Two ports share a group iff their water
  // components share a root — so ports on the SAME sea/river connect, ports on
  // separate water do not.
  const comp = waterComponents(pack);
  const bodies = makeUnionFind(); // over water COMPONENT ids
  const waterCellsOf = ports.map((port) => portWaterCells(pack, port.cellId));
  const compsOf = ports.map((_, i) => {
    const cs = [...new Set(waterCellsOf[i].map((c) => comp[c]).filter((x) => x >= 0))].sort((a, b) => a - b);
    for (let k = 1; k < cs.length; k++) bodies.union(cs[0], cs[k]);
    return cs;
  });
  /** @type {Map<number, number[]>} body root → port indices */
  const byGroup = new Map();
  for (let i = 0; i < ports.length; i++) {
    if (!compsOf[i].length) continue; // a port touching no navigable water
    const g = bodies.find(compsOf[i][0]);
    if (!byGroup.has(g)) byGroup.set(g, []);
    /** @type {number[]} */ (byGroup.get(g)).push(i);
  }

  /** @type {Map<string, { between:[string,string], cost:number, capacity:number }>} */
  const edgeMap = new Map();
  const addEdge = (/** @type {number} */ i, /** @type {number} */ j, /** @type {number} */ seaCost) => {
    const a = ports[i]; const b = ports[j];
    const lo = a.id < b.id ? a.id : b.id;
    const hi = a.id < b.id ? b.id : a.id;
    const key = `${lo}|${hi}`;
    if (edgeMap.has(key)) return;
    edgeMap.set(key, { between: [lo, hi], cost: Math.max(SEA_LANE_MIN_COST, Math.round(seaCost)), capacity: SEA_LANE_CAPACITY });
  };

  for (const members of byGroup.values()) {
    if (members.length < 2) continue; // a lone port in its water body ⇒ no lane
    // PRICING — one water-path Dijkstra per port; read the sea cost to every OTHER
    // port in the body (min over that port's embarkation cells). O(P) Dijkstras.
    const waterCost = new Map(); // "i:j" (i<j) → sea cost (water-path × rate)
    for (const i of members) {
      const distFrom = waterPathFrom(pack, waterCellsOf[i]);
      for (const j of members) {
        if (j <= i) continue;
        let best = Infinity;
        for (const cell of waterCellsOf[j]) if (distFrom[cell] < best) best = distFrom[cell];
        if (Number.isFinite(best)) waterCost.set(`${i}:${j}`, best * SEA_COST_PER_DIST);
      }
    }
    const seaOf = (/** @type {number} */ i, /** @type {number} */ j) => waterCost.get(i < j ? `${i}:${j}` : `${j}:${i}`);
    // DOMINATION — keep only pairs whose water cost BEATS the land route.
    /** @type {Array<[number, number, number]>} [i, j, seaCost] */
    const candidates = [];
    for (let x = 0; x < members.length; x++) {
      for (let y = x + 1; y < members.length; y++) {
        const i = members[x]; const j = members[y];
        const sea = seaOf(i, j);
        if (sea == null) continue; // not water-reachable within the body
        if (sea < land(ports[i].id, ports[j].id)) candidates.push([i, j, sea]);
      }
    }
    if (!candidates.length) continue;
    // Deterministic order: sea cost asc, then codepoint of (idI, idJ).
    candidates.sort((p, q) => (p[2] - q[2])
      || (ports[p[0]].id < ports[q[0]].id ? -1 : ports[p[0]].id > ports[q[0]].id ? 1
        : ports[p[1]].id < ports[q[1]].id ? -1 : ports[p[1]].id > ports[q[1]].id ? 1 : 0));
    // SPARSITY — a spanning tree over the non-dominated candidates (keeps sea-dependent
    // ports connected) PLUS each port's K nearest non-dominated partners.
    const mst = makeUnionFind();
    for (const [i, j, sea] of candidates) {
      if (mst.find(i) !== mst.find(j)) { mst.union(i, j); addEdge(i, j, sea); }
    }
    const nearestBudget = new Map(); // port index → count added
    for (const [i, j, sea] of candidates) {
      const ci = nearestBudget.get(i) || 0;
      const cj = nearestBudget.get(j) || 0;
      if (ci < SEA_LANE_K_NEIGHBOURS || cj < SEA_LANE_K_NEIGHBOURS) {
        addEdge(i, j, sea);
        nearestBudget.set(i, ci + 1); nearestBudget.set(j, cj + 1);
      }
    }
  }
  if (edgeMap.size === 0) return null; // no water lane beats land anywhere ⇒ dormant

  const edges = [...edgeMap.values()].sort((x, y) => {
    const kx = `${x.between[0]}|${x.between[1]}`;
    const ky = `${y.between[0]}|${y.between[1]}`;
    return kx < ky ? -1 : kx > ky ? 1 : 0;
  });
  // `ports` = the nodes the lanes actually connect (a lone unconnected port is not a
  // functional hub) — codepoint-sorted, so isPort reads exactly the sea graph's nodes.
  const connected = [...new Set(edges.flatMap((e) => e.between))].sort();
  return {
    version: SEA_LANE_VERSION,
    ports: connected,
    edges,
    stormSeasonCost: { ...STORM_SEASON_COST },
  };
}

/**
 * The ONE builder entry point spatialDigest calls when `seaLanes:true` is opted in.
 * Derives port eligibility (geography ∧ institution) then builds the water edge set,
 * or NULL when <2 ports / no lane beats land (dormant). Pure + deterministic.
 * @param {{ h:number[], r:number[], c:number[][], p:Array<[number,number]|number[]>, cellCount:number }} pack
 * @param {Array<{ id:string, cellId:number }>} seeds
 * @param {Record<string, Array<string | { name?: unknown, catalogId?: unknown }>>} institutionsById
 * @param {(idA:string, idB:string) => number} [landCost]  the frozen land distance (Infinity when unreachable by land) — dominated lanes are pruned
 * @returns {{ version:number, ports:string[], edges:Array<{ between:[string,string], cost:number, capacity:number }>, stormSeasonCost: Record<string, number> }|null}
 */
export function buildSeaLanes(pack, seeds, institutionsById, landCost) {
  const eligibility = derivePortEligibility(pack, seeds, institutionsById);
  return buildSeaLaneSet(pack, eligibility, landCost);
}
