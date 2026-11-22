/**
 * tickIndices.js — WeakMap-cached per-advance indices that replace the O(S²) per-advance rescans
 * flagged by cycle-3 Wave 4 (H17, H18, M17, M18). PURE, read-only, byte-identical: every index is
 * built by a SINGLE pass that mirrors the exact scan it replaces, so a consult returns precisely
 * what the original linear scan returned (same elements, same order, same first-wins/short-circuit
 * semantics). The Wave-4 byte-identity receipt is the proof; index/memoize ONLY — never reorder
 * iteration, never change a tie-break, never consume rng.
 *
 * CACHE KEY: the GRAPH object (or the settlements array for the settlement lookup). Each index is
 * memoized on that object's identity via a WeakMap, so a consult after the first is O(1) and the
 * entry GCs with its graph — no cross-advance leak. A structurally different graph is a new object
 * ⇒ a fresh (correct) index; nothing here is ever stale.
 *
 * INSTRUMENTATION (tickScanBudget.test.js seam): a module-level counter records index-build element
 * visits (the linear work) + defensive fallbacks. It is a handful of integer adds per BUILD (once
 * per graph), never in the per-consult hot path, so production cost is effectively nil and behavior
 * is untouched (the counters never affect a returned value).
 *
 * Consumers must treat every returned array as READ-ONLY (they already did — the replaced scans
 * were all `.some`/`.filter`/`.map`/for-of reads); a cached array is shared across consults. The
 * element-returning indices are generic so the caller's element type flows straight through.
 *
 * @enforced-by tests/perf/tickScanBudget.test.js
 */
import { isLiveWarFront } from './warFrontReads.js';
import { asObject } from '../roads/state.js';
import { compareCodepoint } from '../deterministicSort.js';
import { RUMOR_TRADE_CHANNEL_TYPES } from '../spatial/rumorNetwork.js';

/** @typedef {Record<string, unknown>} Obj */

// ── Instrumentation (test seam) ──────────────────────────────────────────────
const stats = { scanOps: 0, builds: 0, consults: 0, fallbacks: 0 };
// The relationship-state fallback is keyed by an ordered key SHAPE rather than
// object identity: pulse state is immutably rebuilt every tick, while its
// relationship keys normally stay stable for long stretches. Cache only the
// keys that match a queried pair; values are always read from the CURRENT
// relationshipStates object, so a label transition can never go stale.
/** @type {WeakMap<object, { keys: string[], signature: string }>} */
let relationshipStateShapeCache = new WeakMap();
/**
 * @typedef {{
 *   ids: Set<string>,
 *   byPair: Map<string, string[]>,
 *   legacyByPair: Map<string, string[]>,
 * }} RelationshipStatePairIndex
 */
/** @type {Map<string, RelationshipStatePairIndex>} */
const relationshipStatePairCache = new Map();
const RELATIONSHIP_STATE_SHAPE_CACHE_MAX = 16;
/** @type {readonly string[]} */
const NO_RELATIONSHIP_STATE_KEYS = Object.freeze([]);
/** @returns {{ scanOps: number, builds: number, consults: number, fallbacks: number }} */
export function __tickIndexStats() { return { ...stats }; }
export function __resetTickIndexStats() {
  stats.scanOps = 0;
  stats.builds = 0;
  stats.consults = 0;
  stats.fallbacks = 0;
  // Tests compare cold drives at different scales. Reset the bounded
  // cross-object shape cache with the counters so those measurements remain
  // order-independent and reproducible.
  relationshipStateShapeCache = new WeakMap();
  relationshipStatePairCache.clear();
}

/** Canonical unordered pair key (relationship reads match a↔b in either direction). */
function pairKey(/** @type {string} */ a, /** @type {string} */ b) { return a < b ? `${a} ${b}` : `${b} ${a}`; }

/** Collision-proof unordered key for the relationship-state pair cache. */
function statePairKey(/** @type {string} */ a, /** @type {string} */ b) {
  return JSON.stringify(a < b ? [a, b] : [b, a]);
}

/** @param {unknown} v @returns {string} */
function idStr(v) { return String(v); }

// ── H17a: settlement-by-id lookup (replaces settlementForState's linear .find) ─
/** @type {WeakMap<object, Map<string, unknown>>} */
const settlementByIdCache = new WeakMap();
/**
 * FIRST-wins id → snapshot-item map (Array.prototype.find returns the FIRST match), keyed on the
 * settlements array. Consult with String(id). Byte-identical to
 * `settlements.find(it => String(it.id) === String(id)) || null`.
 * @template T
 * @param {{ settlements?: readonly T[] } | null | undefined} snapshot
 * @returns {Map<string, T>}
 */
export function settlementByIdIndex(snapshot) {
  const list = Array.isArray(snapshot?.settlements) ? snapshot.settlements : null;
  if (!list) { stats.fallbacks += 1; return new Map(); }
  const hit = settlementByIdCache.get(list);
  if (hit) { stats.consults += 1; return /** @type {Map<string, T>} */ (hit); }
  /** @type {Map<string, T>} */
  const idx = new Map();
  for (const item of list) {
    stats.scanOps += 1;
    const key = idStr(/** @type {{ id?: unknown }} */ (item)?.id);
    if (!idx.has(key)) idx.set(key, item); // FIRST-wins, matching .find
  }
  stats.builds += 1;
  settlementByIdCache.set(list, /** @type {Map<string, unknown>} */ (idx));
  return idx;
}

// ── H17b + M18a: edge adjacency (edges touching a settlement, in edge order) ──
/** @type {WeakMap<object, Map<string, unknown[]>>} */
const edgeAdjCache = new WeakMap();
/**
 * id → edges touching id (from===id || to===id), each edge once per DISTINCT endpoint (self-loops
 * appear once), preserving edge-array order. Byte-identical to
 * `edges.filter(e => String(e.from) === id || String(e.to) === id)` for that id. Keyed on the graph.
 * @template T
 * @param {{ edges?: readonly T[] } | null | undefined} graph  a regional graph ({ edges })
 * @returns {Map<string, T[]>}
 */
export function edgeAdjacencyIndex(graph) {
  if (!graph || typeof graph !== 'object') { stats.fallbacks += 1; return new Map(); }
  const hit = edgeAdjCache.get(graph);
  if (hit) { stats.consults += 1; return /** @type {Map<string, T[]>} */ (hit); }
  /** @type {Map<string, T[]>} */
  const idx = new Map();
  const edges = Array.isArray(graph.edges) ? graph.edges : [];
  for (const e of edges) {
    stats.scanOps += 1;
    const rec = /** @type {{ from?: unknown, to?: unknown }} */ (e);
    const from = idStr(rec?.from);
    const to = idStr(rec?.to);
    let a = idx.get(from); if (!a) { a = []; idx.set(from, a); } a.push(e);
    if (to !== from) { let b = idx.get(to); if (!b) { b = []; idx.set(to, b); } b.push(e); }
  }
  stats.builds += 1;
  edgeAdjCache.set(graph, /** @type {Map<string, unknown[]>} */ (idx));
  return idx;
}

// ── M18b: channels-by-`to` (replaces incomingChannels' full channel filter) ──
/** @type {WeakMap<object, Map<string, unknown[]>>} */
const channelsByToCache = new WeakMap();
/**
 * to → channels with that `to`, preserving channel-array order. incomingChannels then filters this
 * O(degree) bucket by type + confirmed-status, byte-identical to the original full-array filter.
 * Keyed on the graph.
 * @template T
 * @param {{ channels?: readonly T[] } | null | undefined} graph  a regional graph ({ channels })
 * @returns {Map<string, T[]>}
 */
export function channelsByToIndex(graph) {
  if (!graph || typeof graph !== 'object') { stats.fallbacks += 1; return new Map(); }
  const hit = channelsByToCache.get(graph);
  if (hit) { stats.consults += 1; return /** @type {Map<string, T[]>} */ (hit); }
  /** @type {Map<string, T[]>} */
  const idx = new Map();
  const channels = Array.isArray(graph.channels) ? graph.channels : [];
  for (const c of channels) {
    stats.scanOps += 1;
    const to = idStr(/** @type {{ to?: unknown }} */ (c)?.to);
    let a = idx.get(to); if (!a) { a = []; idx.set(to, a); } a.push(c);
  }
  stats.builds += 1;
  channelsByToCache.set(graph, /** @type {Map<string, unknown[]>} */ (idx));
  return idx;
}

// ── M17: trade-neighbour index (replaces per-NPC tradeNeighbours rescan) ──────
// RUMOR_TRADE_CHANNEL_TYPES + compareCodepoint are imported from the SAME sources
// rumorNetwork.tradeNeighbours uses, so this index reproduces it byte-for-byte (no lockstep drift).
/** @type {WeakMap<object, Map<string, Array<{ neighbourId: string, edgeId: string }>>>} */
const tradeNeighbourCache = new WeakMap();
/**
 * sid → tradeNeighbours(graph, sid), byte-identical to rumorNetwork.tradeNeighbours: confirmed
 * trade channels touching sid, deduped per neighbour keeping the codepoint-MIN edgeId, sorted by
 * neighbourId. Built in ONE channel pass (both endpoints of each channel are recorded), so the
 * per-endpoint dedup/sort reproduces the per-sid function output. Keyed on the graph.
 * @param {Obj | null | undefined} graph
 * @returns {Map<string, Array<{ neighbourId: string, edgeId: string }>>}
 */
export function tradeNeighbourIndex(graph) {
  if (!graph || typeof graph !== 'object') { stats.fallbacks += 1; return new Map(); }
  const hit = tradeNeighbourCache.get(graph);
  if (hit) { stats.consults += 1; return hit; }
  const channels = Array.isArray(graph.channels) ? graph.channels : [];
  /** @type {Map<string, Map<string, string>>} sid -> (neighbour -> min edgeId) */
  const byS = new Map();
  const note = (/** @type {string} */ sid, /** @type {string} */ neighbour, /** @type {string} */ edgeId) => {
    let m = byS.get(sid); if (!m) { m = new Map(); byS.set(sid, m); }
    const prior = m.get(neighbour);
    if (prior === undefined || compareCodepoint(edgeId, prior) < 0) m.set(neighbour, edgeId);
  };
  for (const raw of channels) {
    stats.scanOps += 1;
    const channel = /** @type {{ status?: unknown, type?: unknown, from?: unknown, to?: unknown, id?: unknown }} */ (raw);
    if (!channel || channel.status !== 'confirmed') continue;
    if (!RUMOR_TRADE_CHANNEL_TYPES.includes(idStr(channel.type))) continue;
    const from = idStr(channel.from);
    const to = idStr(channel.to);
    if (from === to) continue; // neighbour is the OTHER endpoint; a self channel has none
    const edgeId = idStr(channel.id ?? `edge.${from}.${to}`);
    note(from, to, edgeId); // tradeNeighbours(from) sees neighbour=to
    note(to, from, edgeId); // tradeNeighbours(to)   sees neighbour=from
  }
  /** @type {Map<string, Array<{ neighbourId: string, edgeId: string }>>} */
  const idx = new Map();
  for (const [sid, m] of byS) {
    idx.set(sid, [...m.entries()]
      .map(([neighbourId, edgeId]) => ({ neighbourId, edgeId }))
      .sort((a, b) => compareCodepoint(a.neighbourId, b.neighbourId)));
  }
  stats.builds += 1;
  tradeNeighbourCache.set(graph, idx);
  return idx;
}

// ── H18: war/relationship reads (atWarWith, relationshipTypeBetween) ──────────
/**
 * @typedef {Object} WarRelIndex
 * @property {Set<string>} openWarPairs   pair keys with a live war-front channel (== atOpenWar)
 * @property {Map<string, string>} edgeRtByPair  pair key -> FIRST non-empty edge relationshipType
 * @property {Set<string>} settlementIds  ids addressable through the graph
 */
/** @type {WeakMap<object, WarRelIndex>} */
const warRelCache = new WeakMap();
/**
 * Graph-derived halves of atOpenWar (live war fronts, either direction) and the edge scan inside
 * relationshipTypeBetween (first pair-matching edge with a non-empty relationshipType). Keyed on
 * the graph. The worldState.relationshipStates fallback is NOT graph-derived, so it stays per-call
 * (relationshipTypeBetweenIdx below), reached only when no edge supplied a relationship.
 * @param {Obj} graph
 * @returns {WarRelIndex}
 */
function warRelIndex(graph) {
  const hit = warRelCache.get(graph);
  if (hit) { stats.consults += 1; return hit; }
  const g = asObject(graph);
  /** @type {Set<string>} */
  const openWarPairs = new Set();
  /** @type {Set<string>} */
  const settlementIds = new Set();
  const nodes = Array.isArray(g.nodes) ? /** @type {unknown[]} */ (g.nodes) : [];
  for (const n of nodes) {
    stats.scanOps += 1;
    const id = idStr(asObject(n).id || '');
    if (id) settlementIds.add(id);
  }
  const channels = Array.isArray(g.channels) ? /** @type {unknown[]} */ (g.channels) : [];
  for (const c of channels) {
    stats.scanOps += 1;
    const ch = asObject(c);
    const from = idStr(ch.from || '');
    const to = idStr(ch.to || '');
    if (from) settlementIds.add(from);
    if (to) settlementIds.add(to);
    if (isLiveWarFront(c)) {
      openWarPairs.add(pairKey(idStr(ch.from), idStr(ch.to)));
    }
  }
  /** @type {Map<string, string>} */
  const edgeRtByPair = new Map();
  const edges = Array.isArray(g.edges) ? /** @type {unknown[]} */ (g.edges) : [];
  for (const e of edges) {
    stats.scanOps += 1;
    const edge = asObject(e);
    const from = idStr(edge.from || '');
    const to = idStr(edge.to || '');
    if (from) settlementIds.add(from);
    if (to) settlementIds.add(to);
    const rt = String(edge.relationshipType || '');
    if (!rt) continue;
    const key = pairKey(from, to);
    if (!edgeRtByPair.has(key)) edgeRtByPair.set(key, rt); // FIRST non-empty rt, in edge order
  }
  /** @type {WarRelIndex} */
  const idx = { openWarPairs, edgeRtByPair, settlementIds };
  stats.builds += 1;
  warRelCache.set(graph, idx);
  return idx;
}

/**
 * Ordered relationship-state keys whose legacy id contains BOTH settlement
 * ids. This is the exact fallback predicate used by
 * roads/embassyHazard.relationshipTypeBetween; caching the matching key list
 * changes no join semantics and preserves Object.keys insertion order.
 *
 * The cache is split in two:
 *   1. a WeakMap captures Object.keys once for each immutable state object;
 *   2. a small bounded map reuses pair matches across successive immutable
 *      state objects with the same ordered key shape.
 *
 * Only keys are cached. Callers read the current record values afterward, so
 * relationshipType changes under a stable shape remain immediately visible.
 *
 * @param {Obj} states
 * @param {WarRelIndex} graphIndex
 * @returns {RelationshipStatePairIndex}
 */
function relationshipStatePairIndex(states, graphIndex) {
  let shape = relationshipStateShapeCache.get(states);
  if (!shape) {
    const keys = Object.keys(states);
    stats.scanOps += keys.length;
    shape = { keys, signature: JSON.stringify(keys) };
    relationshipStateShapeCache.set(states, shape);
  } else {
    stats.consults += 1;
  }

  const ids = [...graphIndex.settlementIds].sort(compareCodepoint);
  const indexSignature = JSON.stringify([shape.signature, ids]);
  let index = relationshipStatePairCache.get(indexSignature);
  if (!index) {
    const byPair = new Map();
    const idSet = new Set(ids);
    // One ordered pass over the key shape builds every graph-addressable
    // substring pair. If short ids overlap inside a longer legacy key, all
    // matching pairs receive that key, exactly as repeated String.includes
    // queries did. Key order is the outer loop, so first-key-wins is retained.
    for (const key of shape.keys) {
      /** @type {string[]} */
      const matchedIds = [];
      for (const id of ids) {
        stats.scanOps += 1;
        if (key.includes(id)) matchedIds.push(id);
      }
      for (let i = 0; i < matchedIds.length; i += 1) {
        for (let j = i; j < matchedIds.length; j += 1) {
          const cacheKey = statePairKey(matchedIds[i], matchedIds[j]);
          let matchedKeys = byPair.get(cacheKey);
          if (!matchedKeys) {
            matchedKeys = [];
            byPair.set(cacheKey, matchedKeys);
          }
          matchedKeys.push(key);
        }
      }
    }
    index = { ids: idSet, byPair, legacyByPair: new Map() };
    relationshipStatePairCache.set(indexSignature, index);
    if (relationshipStatePairCache.size > RELATIONSHIP_STATE_SHAPE_CACHE_MAX) {
      const oldest = relationshipStatePairCache.keys().next().value;
      if (typeof oldest === 'string') relationshipStatePairCache.delete(oldest);
    }
    stats.builds += 1;
  } else {
    stats.consults += 1;
  }
  return index;
}

/**
 * Resolve the ordered matching-key list. Graph-addressable ids use the complete
 * shape-level pair index; unusual legacy callers whose ids are absent from the
 * graph retain the old on-demand String.includes scan and cache its exact result.
 * @param {Obj} states
 * @param {WarRelIndex} graphIndex
 * @param {string} a
 * @param {string} b
 * @returns {readonly string[]}
 */
function relationshipStateKeysForPair(states, graphIndex, a, b) {
  const index = relationshipStatePairIndex(states, graphIndex);
  const cacheKey = statePairKey(a, b);
  if (index.ids.has(a) && index.ids.has(b)) {
    const hit = index.byPair.get(cacheKey);
    stats.consults += 1;
    return hit || NO_RELATIONSHIP_STATE_KEYS;
  }

  const prior = index.legacyByPair.get(cacheKey);
  if (prior) {
    stats.consults += 1;
    return prior;
  }
  const matched = [];
  const shape = relationshipStateShapeCache.get(states);
  for (const key of shape?.keys || []) {
    stats.scanOps += 1;
    if (key.includes(a) && key.includes(b)) matched.push(key);
  }
  index.legacyByPair.set(cacheKey, matched);
  stats.builds += 1;
  return matched;
}

/**
 * O(1)-amortized relationshipTypeBetween — byte-identical to roads/embassyHazard.relationshipTypeBetween:
 * the FIRST pair-matching edge with a non-empty relationshipType, else the relationshipStates
 * substring fallback, else ''. The edge scan is served from the graph index; the now-hot
 * relationshipStates fallback is served from an ordered pair index that reproduces the legacy
 * substring join verbatim.
 * @param {Obj} graph @param {Obj} worldState @param {string} a @param {string} b @returns {string}
 */
export function relationshipTypeBetweenIdx(graph, worldState, a, b) {
  if (!graph || typeof graph !== 'object') { stats.fallbacks += 1; return relationshipTypeBetweenRaw(graph, worldState, a, b); }
  const A = String(a);
  const B = String(b);
  const graphIndex = warRelIndex(graph);
  const edgeRt = graphIndex.edgeRtByPair.get(pairKey(A, B));
  if (edgeRt) return edgeRt;
  const rs = asObject(asObject(worldState).relationshipStates);
  for (const key of relationshipStateKeysForPair(rs, graphIndex, A, B)) {
    const rt = String(asObject(rs[key]).relationshipType || '');
    if (rt) return rt;
  }
  return '';
}

/**
 * O(1)-amortized atWarWith — byte-identical to roads/embassyHazard.atWarWith
 * (atOpenWar(a,b) || relationshipTypeBetween(a,b) === 'hostile'), short-circuit preserved.
 * @param {Obj} graph @param {Obj} worldState @param {string} a @param {string} b @returns {boolean}
 */
export function atWarWithIdx(graph, worldState, a, b) {
  if (!graph || typeof graph !== 'object') { stats.fallbacks += 1; return false; }
  if (warRelIndex(graph).openWarPairs.has(pairKey(String(a), String(b)))) return true;
  return relationshipTypeBetweenIdx(graph, worldState, a, b) === 'hostile';
}

// Defensive raw fallback for a non-object graph (never taken in the pulse) — mirrors the original
// edge-then-relationshipStates scan so even the degenerate path stays byte-correct.
/** @param {Obj} graph @param {Obj} worldState @param {string} a @param {string} b @returns {string} */
function relationshipTypeBetweenRaw(graph, worldState, a, b) {
  const A = String(a);
  const B = String(b);
  const edges = Array.isArray(asObject(graph).edges) ? /** @type {unknown[]} */ (asObject(graph).edges) : [];
  for (const e of edges) {
    const edge = asObject(e);
    if ((idStr(edge.from) === A && idStr(edge.to) === B) || (idStr(edge.from) === B && idStr(edge.to) === A)) {
      const rt = String(edge.relationshipType || '');
      if (rt) return rt;
    }
  }
  const rs = asObject(asObject(worldState).relationshipStates);
  for (const key of Object.keys(rs)) {
    if (key.includes(A) && key.includes(B)) {
      const rt = String(asObject(rs[key]).relationshipType || '');
      if (rt) return rt;
    }
  }
  return '';
}

// ── H18: occupation index (holdings of an occupier; replaces the all-settlements dominion scan) ──
/** @type {WeakMap<object, Map<string, string[]>>} */
const occupiedByCache = new WeakMap();
/**
 * occupierId → the ids it OCCUPIES (str(occupations[held].occupierId) === occupier). Built in one
 * pass over the occupations map; consumers iterate a single occupier's holdings instead of scanning
 * every settlement. Keyed on the occupations object.
 * @param {Obj} occupations  worldState.occupations
 * @returns {Map<string, string[]>}
 */
export function occupiedByIndex(occupations) {
  if (!occupations || typeof occupations !== 'object') { stats.fallbacks += 1; return new Map(); }
  const hit = occupiedByCache.get(occupations);
  if (hit) { stats.consults += 1; return hit; }
  /** @type {Map<string, string[]>} */
  const idx = new Map();
  for (const heldId of Object.keys(occupations)) {
    stats.scanOps += 1;
    const occupier = idStr(asObject(occupations[heldId]).occupierId || '');
    if (!occupier) continue;
    let a = idx.get(occupier); if (!a) { a = []; idx.set(occupier, a); } a.push(String(heldId));
  }
  stats.builds += 1;
  occupiedByCache.set(occupations, idx);
  return idx;
}
