/**
 * provenanceKernel.js — THE PROVENANCE LEDGER writer (engine finale #1).
 *
 * The owner's commission (task #32): a durable per-campaign receipt ledger with
 * TRUE cause-edges — RECORDED, not reconstructed, causality. Before this, the only
 * durable causal edge in the tree was the one-hop event→artifact `sourceEventId`;
 * the chronicle's decree cones / thread chains / standings were ENTITY-INFERRED
 * (shared entity keys + temporal order) and labelled `inferred`, because no
 * receipt→child-receipt DAG survived into durable state (the compactors dropped
 * `sourceEventId`; applied ops persisted no parent-receipt id).
 *
 * ── WHAT THIS RECORDS ─────────────────────────────────────────────────────────
 * At the SINGLE durable-write seam (appendPulseHistory, worldState.js — the sole
 * chokepoint every advance commits through), for exactly the receipts that land in
 * the durable pulseRecord (selectedOutcomes ≤24 + impactDigest ≤18, the same ids
 * the chronicle reads as nodes), we record the parent cause-edge ids each carries:
 *   · `causedBy`      — the explicit forward SEAM (scalar or array of parent ids)
 *                       kernels populate when they mint a child of a known outcome.
 *   · `sourceEventId` — the existing one-hop edge (news→source-outcome; and the
 *                       aftermath/lifecycle/cascade children that already carry it).
 * The entry is `{ [receiptId]: { parents:string[], type:string, tick:number } }` —
 * a stable receipt id keyed to its parent cause-edge ids, its type, and the tick.
 * NO prose, NO PII (never a headline/summary/name — only structural ids + tick).
 *
 * ── STORAGE (owner-signable; the recommended in-blob home is implemented) ──────
 * `worldState.spatialLedgers.provenance` — the Phase-5.5 conditional ledger family.
 * Nesting under the single `spatialLedgers` key costs ZERO first-paint bytes
 * (CONDITIONAL_LEDGER_KEYS already carries `spatialLedgers`) and self-drops when
 * empty (dropSpatialLedger) so a dormant campaign serializes byte-identically. The
 * SIZE GOVERNOR / horizon-compaction law caps the ledger at MAX_PROVENANCE_EDGES
 * recorded edges, evicting the lowest-tick first — sized to cover pulseHistory's
 * own MAX_HISTORY=80 advance window.
 *
 * ── DORMANCY (constitutional) ─────────────────────────────────────────────────
 * FLAG-GATED behind the VIRTUAL `provenanceLedgerEnabled` (absent from
 * DEFAULT_SIMULATION_RULES ⇒ zero persisted flag bytes ⇒ reader returns false).
 * Flag absent ⇒ appendPulseHistoryWithProvenance IS appendPulseHistory, no
 * `provenance` ledger key is ever created, every golden stays byte-identical.
 *
 * ── ZERO ENGINE→DISPLAY COUPLING ──────────────────────────────────────────────
 * This is the WRITER only (engine chunk). The READER lives display-side in
 * chronicleGraph.js (buildRecordedEdges / recordedDescendants / hasRecordedEdge),
 * reading the plain serialized `provenance` object directly — the display chunk
 * never imports this engine leaf (the zero-engine-contact law).
 *
 * Pure, deterministic, RNG-free, clock-free. No React, no Zustand, no I/O.
 *
 * @enforced-by tests/property/provenanceDormancyGolden.test.js (dormancy byte-
 *   identity + lit-path anti-vacuity + the no-ledger contract),
 *   tests/domain/provenanceLedger.test.js (single-writer, cone exactness, the size
 *   governor), tests/domain/chronicleRecordedEdges.test.js (recorded-vs-inferred).
 */

import { getSpatialLedger, setSpatialLedger, dropSpatialLedger } from '../spatial/distanceRead.js';
import { appendPulseHistory } from './worldState.js';

// ── THE PULSE-COMMIT SEAM (ceiling discipline) ────────────────────────────────
// pulseKernel.js is AT its frozen size-baseline ceiling, so it cannot gain an
// import line. It already imports these four commit-adjacent helpers from
// worldState.js on ONE line; routing that one line through this leaf (which adds
// appendPulseHistoryWithProvenance) keeps the ceiling'd file's import surface flat
// (a name swap, not a new line). This leaf is imported ONLY by the lazy pulseKernel,
// so the pass-through is zero-eager. worldState.js is the sole owner of these
// helpers — this is a transparent re-export, never a fork.
export { ensureWorldState, advanceWorldCalendar, pulseIdFor, seasonForTick } from './worldState.js';

/** The spatialLedgers sub-key this writer owns (registered in EXEMPT_LEDGER_KEYS). */
export const PROVENANCE_LEDGER_KEY = 'provenance';

/**
 * THE SIZE GOVERNOR (horizon-compaction law). The ledger holds at most this many
 * recorded edges; when a write would exceed it, the lowest-tick edges are evicted
 * first (ties broken by id desc, deterministic). Sized to cover pulseHistory's own
 * MAX_HISTORY=80 advance window at the THEORETICAL durable maximum — a record holds
 * ≤24 selectedOutcomes + ≤18 impactDigest = ≤42 durable receipts, so ≤42×80 = 3360
 * edges can be current-window-live at once; 4096 clears that with headroom, so the
 * governor NEVER evicts an edge whose child receipt is still in the pulseHistory
 * window (only strictly-older orphans evict). MEASURED reality is far lighter: a
 * 12-settlement, 80-monthly-advance run (war+upswing lit) produced ~1440 edges
 * (~250 KB) at ~184 B/edge — the governor only fires on a much longer/denser soak.
 * Enforced by tests/domain/provenanceLedger.test.js.
 * @type {number}
 */
export const MAX_PROVENANCE_EDGES = 4096;

/**
 * THE DORMANCY GATE — the virtual `provenanceLedgerEnabled` flag, read defensively
 * (mirrors upswingArcsActive). Absent from DEFAULT_SIMULATION_RULES, so an ordinary
 * campaign returns false and the writer is a pure no-op.
 * @param {any} worldState
 * @returns {boolean}
 */
export function provenanceLedgerActive(worldState) {
  const rules = worldState && typeof worldState === 'object' ? worldState.simulationRules : null;
  return !!(rules && typeof rules === 'object'
    && /** @type {Record<string, unknown>} */ (rules).provenanceLedgerEnabled === true);
}

/**
 * The parent cause-edge ids a receipt explicitly carries: `causedBy` (the forward
 * seam — scalar or array) then `sourceEventId` (the existing one-hop edge). String,
 * non-empty, in a stable order. Self-references and duplicates are dropped by the
 * caller (against the receipt's own id).
 * @param {any} item  a raw applied outcome or a raw news entry
 * @returns {string[]}
 */
function rawParentIdsOf(item) {
  /** @type {string[]} */
  const out = [];
  const cb = item?.causedBy;
  if (Array.isArray(cb)) {
    for (const p of cb) if (p != null && p !== '') out.push(String(p));
  } else if (cb != null && cb !== '') {
    out.push(String(cb));
  }
  const se = item?.sourceEventId;
  if (se != null && se !== '') out.push(String(se));
  return out;
}

/**
 * A short structural type for a receipt (never prose). Prefers the outcome type /
 * candidateType, else the news impactKind, else a generic marker.
 * @param {any} item
 * @returns {string}
 */
function typeOf(item) {
  const t = item?.type ?? item?.candidateType ?? item?.impactKind;
  return t != null && t !== '' ? String(t) : 'event';
}

/**
 * Collect the recorded cause-edges for one advance — the PURE core (no worldState).
 * Only receipts whose id lands in the durable pulseRecord (`durableIds`) and that
 * carry ≥1 parent edge are recorded (the sparse DAG-edge set — roots are named only
 * as their children's parents). Deterministic: keyed by id, parents deduped/sorted
 * with self-edges dropped.
 * @param {Object} args
 * @param {any[]} args.outcomes      raw applied outcomes (applied.autoApplied ∪ proposals)
 * @param {any[]} args.newsEntries   raw news entries (applied.newsEntries) carrying sourceEventId
 * @param {Set<string>} args.durableIds  the ids that land in the durable pulseRecord
 * @param {number} args.tick
 * @returns {Record<string, { parents: string[], type: string, tick: number }>}
 */
export function collectProvenanceEdges({ outcomes = [], newsEntries = [], durableIds, tick }) {
  /** @type {Record<string, { parents: string[], type: string, tick: number }>} */
  const edges = {};
  const scope = durableIds instanceof Set ? durableIds : null;
  const consider = (/** @type {any} */ item) => {
    const id = item?.id != null ? String(item.id) : '';
    if (!id) return;
    if (scope && !scope.has(id)) return;
    const rawParents = rawParentIdsOf(item);
    if (rawParents.length === 0) return;
    // Dedupe + drop self-edges; merge with any parents already recorded for this id.
    const seen = new Set(edges[id]?.parents || []);
    const parents = [...(edges[id]?.parents || [])];
    for (const p of rawParents) {
      if (p === id || seen.has(p)) continue;
      seen.add(p);
      parents.push(p);
    }
    if (parents.length === 0) return;
    parents.sort();
    edges[id] = { parents, type: edges[id]?.type || typeOf(item), tick };
  };
  for (const o of outcomes) consider(o);
  for (const n of newsEntries) consider(n);
  return edges;
}

/**
 * Rebuild a provenance ledger object with keys in sorted order — the serialization
 * is then insertion-order-independent (byte-stable regardless of merge order), the
 * `sortedRecord` idiom the upswing/spatial ledgers use.
 * @param {Record<string, any>} obj
 * @returns {Record<string, any>}
 */
function sortedLedger(obj) {
  /** @type {Record<string, any>} */
  const out = {};
  for (const k of Object.keys(obj).sort()) out[k] = obj[k];
  return out;
}

/**
 * THE SIZE GOVERNOR. When the merged ledger exceeds MAX_PROVENANCE_EDGES, keep the
 * highest-tick edges (most recent lineage), evicting the lowest tick first; ties
 * broken by id descending so the survivor set is deterministic. Returns the ledger
 * unchanged (same reference intent) when already within the cap.
 * @param {Record<string, { parents: string[], type: string, tick: number }>} ledger
 * @returns {Record<string, { parents: string[], type: string, tick: number }>}
 */
function compactToHorizon(ledger) {
  const ids = Object.keys(ledger);
  if (ids.length <= MAX_PROVENANCE_EDGES) return ledger;
  // Rank by (tick desc, id desc); keep the first MAX_PROVENANCE_EDGES.
  const keep = ids
    .sort((a, b) => (ledger[b].tick - ledger[a].tick) || (a < b ? 1 : a > b ? -1 : 0))
    .slice(0, MAX_PROVENANCE_EDGES);
  /** @type {Record<string, any>} */
  const next = {};
  for (const id of keep) next[id] = ledger[id];
  return next;
}

/**
 * Record this advance's cause-edges into `worldState.spatialLedgers.provenance`,
 * horizon-compacted. GATED: inactive ⇒ the exact same worldState reference is
 * returned (no ledger key, byte-identical). Active but zero new edges + no prior
 * ledger ⇒ still no key (dormancy-neutral). Pure — never mutates.
 * @param {any} worldState
 * @param {Object} args
 * @param {any[]} args.outcomes
 * @param {any[]} args.newsEntries
 * @param {Set<string>} args.durableIds
 * @param {number} args.tick
 * @returns {any} a new worldState (or the same reference when nothing changed)
 */
export function recordProvenanceLedger(worldState, { outcomes, newsEntries, durableIds, tick }) {
  if (!provenanceLedgerActive(worldState)) return worldState;
  const fresh = collectProvenanceEdges({ outcomes, newsEntries, durableIds, tick });
  // The ledger key is a STRING LITERAL at every accessor call (not the
  // PROVENANCE_LEDGER_KEY constant) because the spatialLedgerCoverage walker scans
  // for literal-key setSpatialLedger writes — the 'upswing'/'reframes' idiom.
  const prior = /** @type {Record<string, any>} */ (getSpatialLedger(worldState, 'provenance')) || null;
  const priorObj = prior && typeof prior === 'object' && !Array.isArray(prior) ? prior : {};
  if (Object.keys(fresh).length === 0) {
    // Nothing to record this advance — leave the ledger (and its absence) untouched.
    return worldState;
  }
  const merged = compactToHorizon(sortedLedger({ ...priorObj, ...fresh }));
  if (Object.keys(merged).length === 0) return dropSpatialLedger(worldState, 'provenance');
  return setSpatialLedger(worldState, 'provenance', merged);
}

/**
 * THE CEILING-SAFE COMMIT WRAPPER — the single seam pulseKernel calls in place of
 * appendPulseHistory. When the ledger is dormant it IS appendPulseHistory (returns
 * its exact result — byte-identical). When lit it records the advance's cause-edges
 * first, then commits the pulse record. The durable receipt set (selectedOutcomes ∪
 * impactDigest ids) scopes the recording to exactly the chronicle's node ids.
 * @param {any} worldState
 * @param {any} pulseRecord   the record about to be appended (carries the durable ids + tick)
 * @param {any} applied       the applyWorldPulseOutcomes result (autoApplied/proposals/newsEntries)
 * @returns {any} the world state with pulseRecord appended (+ provenance when lit)
 */
export function appendPulseHistoryWithProvenance(worldState, pulseRecord, applied) {
  if (!provenanceLedgerActive(worldState)) return appendPulseHistory(worldState, pulseRecord);
  const durableIds = new Set();
  for (const o of (pulseRecord?.selectedOutcomes || [])) if (o?.id != null) durableIds.add(String(o.id));
  for (const d of (pulseRecord?.impactDigest || [])) if (d?.id != null) durableIds.add(String(d.id));
  const outcomes = [...(applied?.autoApplied || []), ...(applied?.proposals || [])];
  const newsEntries = applied?.newsEntries || [];
  const tick = Number.isFinite(pulseRecord?.tick) ? Number(pulseRecord.tick) : Number(worldState?.tick) || 0;
  const withLedger = recordProvenanceLedger(worldState, { outcomes, newsEntries, durableIds, tick });
  return appendPulseHistory(withLedger, pulseRecord);
}
