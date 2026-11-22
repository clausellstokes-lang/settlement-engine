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
 * the durable pulseRecord (selectedOutcomes ≤24 + mechanicalOutcomes ≤8 +
 * impactDigest ≤18), we record the parent cause-edge ids each carries:
 *   · `causedBy`      — the explicit forward SEAM (scalar or array of parent ids)
 *                       kernels populate when they mint a child of a known outcome.
 *   · `sourceEventId` — the existing one-hop edge (news→source-outcome; and the
 *                       aftermath/lifecycle/cascade children that already carry it).
 * An ordinary pulse write is
 * `{ [receiptId]: { parents:string[], type:string, tick:number } }` — a stable
 * receipt id keyed to its parent cause-edge ids, its type, and the tick.
 * Mechanical audit roots add `receiptClass:"mechanical"`; interval collapse may
 * temporarily add `retentionClass:"collapsed_ancestor"` while an otherwise
 * removed receipt remains reachable ancestry. NO prose, NO PII (never a
 * headline/summary/name — only structural ids, class markers, and tick).
 *
 * ── STORAGE (owner-signable; the recommended in-blob home is implemented) ──────
 * `worldState.spatialLedgers.provenance` — the Phase-5.5 conditional ledger family.
 * Nesting under the single `spatialLedgers` key costs ZERO first-paint bytes
 * (CONDITIONAL_LEDGER_KEYS already carries `spatialLedgers`) and self-drops when
 * empty (dropSpatialLedger) so a dormant campaign serializes byte-identically. The
 * SIZE GOVERNOR / horizon-compaction law caps the ledger at MAX_PROVENANCE_EDGES
 * recorded edges, evicting the lowest-tick first — sized to cover pulseHistory's
 * own MAX_HISTORY=80 advance window. Mechanical receipts remain provenance-visible
 * without becoming public Chronicle nodes.
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
 * ≤24 selectedOutcomes + ≤8 mechanicalOutcomes + ≤18 impactDigest = ≤50 durable
 * receipts, so ≤50×80 = 4000
 * edges can be current-window-live at once; 4096 clears that with headroom, so the
 * governor NEVER evicts an edge whose child receipt is still in the pulseHistory
 * window (only strictly-older orphans evict). MEASURED reality is far lighter: a
 * 12-settlement, 80-monthly-advance run (war+upswing lit) produced ~1440 edges
 * (~250 KB) at ~184 B/edge — the governor only fires on a much longer/denser soak.
 * Enforced by tests/domain/provenanceLedger.test.js.
 * @type {number}
 */
export const MAX_PROVENANCE_EDGES = 4096;

// ── Shapes (the fields this writer reads; everything else rides through) ───────

/**
 * A raw applied outcome or news entry — only the fields the writer reads are named.
 * @typedef {Object} ProvReceipt
 * @property {string|number} [id]
 * @property {string} [type]
 * @property {string} [candidateType]
 * @property {string} [impactKind]
 * @property {string} [recordMode]
 * @property {string|number|ReadonlyArray<string|number>} [causedBy]  explicit parent seam
 * @property {string|number} [sourceEventId]                          existing one-hop edge
 */

/**
 * One recorded receipt/edge entry. Mechanical roots are retained with an empty
 * parents array so the audit can distinguish state motion from public events.
 * Ordinary pulse writes keep the legacy public/impact
 * `{ parents, type, tick }` shape. `retentionClass` is added only by interval
 * collapse, and only while a removed receipt remains required as ancestry.
 * @typedef {{ parents: string[], type: string, tick: number, receiptClass?: 'mechanical',
 *   retentionClass?: 'collapsed_ancestor' }} ProvEntry
 */

/** The ledger: receipt id → its recorded entry. @typedef {Record<string, ProvEntry>} ProvLedger */

/** The minimal worldState surface this writer reads/writes. @typedef {Record<string, unknown>} ProvWorldState */

/**
 * THE DORMANCY GATE — the virtual `provenanceLedgerEnabled` flag, read defensively
 * (mirrors upswingArcsActive). Absent from DEFAULT_SIMULATION_RULES, so an ordinary
 * campaign returns false and the writer is a pure no-op.
 * @param {ProvWorldState|null|undefined} worldState
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
 * @param {ProvReceipt} item  a raw applied outcome or a raw news entry
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
 * @param {ProvReceipt} item
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
 * @param {ProvReceipt[]} args.outcomes      raw applied outcomes (applied.autoApplied ∪ proposals)
 * @param {ProvReceipt[]} args.newsEntries   raw news entries (applied.newsEntries) carrying sourceEventId
 * @param {Set<string>} args.durableIds  the ids that land in the durable pulseRecord
 * @param {Set<string>} [args.mechanicalIds] state-only receipt ids
 * @param {number} args.tick
 * @returns {ProvLedger}
 */
export function collectProvenanceEdges({
  outcomes = [],
  newsEntries = [],
  durableIds,
  mechanicalIds = new Set(),
  tick,
}) {
  /** @type {ProvLedger} */
  const edges = {};
  const scope = durableIds instanceof Set ? durableIds : null;
  const consider = (/** @type {ProvReceipt} */ item) => {
    const id = item?.id != null ? String(item.id) : '';
    if (!id) return;
    if (scope && !scope.has(id)) return;
    const mechanical = mechanicalIds.has(id);
    const rawParents = rawParentIdsOf(item);
    // Public/impact roots stay sparse as before. Mechanical roots are themselves
    // the audit evidence that an intentionally non-public state mutation landed.
    if (rawParents.length === 0) {
      if (mechanical) {
        edges[id] = { parents: [], type: typeOf(item), tick, receiptClass: 'mechanical' };
      }
      return;
    }
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
    edges[id] = {
      parents,
      type: edges[id]?.type || typeOf(item),
      tick,
      ...(mechanical ? { receiptClass: /** @type {const} */ ('mechanical') } : {}),
    };
  };
  for (const o of outcomes) consider(o);
  for (const n of newsEntries) consider(n);
  return edges;
}

/**
 * Rebuild a provenance ledger object with keys in sorted order — the serialization
 * is then insertion-order-independent (byte-stable regardless of merge order), the
 * `sortedRecord` idiom the upswing/spatial ledgers use.
 * @param {ProvLedger} obj
 * @returns {ProvLedger}
 */
function sortedLedger(obj) {
  /** @type {ProvLedger} */
  const out = {};
  for (const k of Object.keys(obj).sort()) out[k] = obj[k];
  return out;
}

/**
 * THE SIZE GOVERNOR. When the merged ledger exceeds MAX_PROVENANCE_EDGES, keep the
 * highest-tick edges (most recent lineage), evicting the lowest tick first; ties
 * broken by id descending so the survivor set is deterministic. Returns the ledger
 * unchanged (same reference intent) when already within the cap.
 * @param {ProvLedger} ledger
 * @returns {ProvLedger}
 */
function compactToHorizon(ledger) {
  const ids = Object.keys(ledger);
  if (ids.length <= MAX_PROVENANCE_EDGES) return ledger;
  // Rank by (tick desc, id desc); keep the first MAX_PROVENANCE_EDGES.
  const keep = ids
    .sort((a, b) => (ledger[b].tick - ledger[a].tick) || (a < b ? 1 : a > b ? -1 : 0))
    .slice(0, MAX_PROVENANCE_EDGES);
  /** @type {ProvLedger} */
  const next = {};
  for (const id of keep) next[id] = ledger[id];
  return next;
}

/**
 * Record this advance's cause-edges into `worldState.spatialLedgers.provenance`,
 * horizon-compacted. GATED: inactive ⇒ the exact same worldState reference is
 * returned (no ledger key, byte-identical). Active but zero new edges + no prior
 * ledger ⇒ still no key (dormancy-neutral). Pure — never mutates.
 * @param {ProvWorldState} worldState
 * @param {Object} args
 * @param {ProvReceipt[]} args.outcomes
 * @param {ProvReceipt[]} args.newsEntries
 * @param {Set<string>} args.durableIds
 * @param {Set<string>} [args.mechanicalIds]
 * @param {number} args.tick
 * @returns {ProvWorldState} a new worldState (or the same reference when nothing changed)
 */
export function recordProvenanceLedger(worldState, {
  outcomes,
  newsEntries,
  durableIds,
  mechanicalIds,
  tick,
}) {
  if (!provenanceLedgerActive(worldState)) return worldState;
  const fresh = collectProvenanceEdges({
    outcomes,
    newsEntries,
    durableIds,
    mechanicalIds,
    tick,
  });
  // The ledger key is a STRING LITERAL at every accessor call (not the
  // PROVENANCE_LEDGER_KEY constant) because the spatialLedgerCoverage walker scans
  // for literal-key setSpatialLedger writes — the 'upswing'/'reframes' idiom.
  const prior = /** @type {ProvLedger|null} */ (getSpatialLedger(worldState, 'provenance')) || null;
  const priorObj = prior && typeof prior === 'object' && !Array.isArray(prior) ? prior : {};
  if (Object.keys(fresh).length === 0) {
    // Nothing to record this advance — leave the ledger (and its absence) untouched.
    return worldState;
  }
  const merged = compactToHorizon(sortedLedger({ ...priorObj, ...fresh }));
  // DEFENSIVE FLOOR — unreachable in practice: `fresh` is non-empty here (the early return
  // above), so merged ⊇ fresh has ≥ 1 key and compactToHorizon only ever DROPS excess edges
  // (floored at MAX_PROVENANCE_EDGES, never to 0). Kept as a defensive drop-when-empty, not a
  // live self-drop path — recordProvenanceLedger never empties the ledger from a non-empty input.
  if (Object.keys(merged).length === 0) return dropSpatialLedger(worldState, 'provenance');
  return setSpatialLedger(worldState, 'provenance', merged);
}

/**
 * Stage-5 interval-collapse twin. Only rows named by pulse records removed in
 * this collapse are eligible for pruning; unrelated manual-proposal provenance
 * remains untouched. A removed row is retained when any surviving/manual row
 * reaches it as an ancestor.
 * @param {ProvWorldState} worldState already carrying the collapsed pulseHistory
 * @param {Array<Record<string, unknown>>} removedPulseRecords
 * @returns {ProvWorldState}
 */
export function reconcileProvenanceAfterHistoryCollapse(worldState, removedPulseRecords = []) {
  if (!provenanceLedgerActive(worldState) || removedPulseRecords.length === 0) return worldState;
  const ledger = /** @type {ProvLedger|null} */ (getSpatialLedger(worldState, 'provenance')) || null;
  if (!ledger || typeof ledger !== 'object' || Array.isArray(ledger)) return worldState;
  const receiptIds = (/** @type {Array<Record<string, unknown>>} */ records) => {
    const ids = new Set();
    for (const record of records) {
      for (const field of ['selectedOutcomes', 'mechanicalOutcomes', 'impactDigest']) {
        const receipts = Array.isArray(record?.[field]) ? record[field] : [];
        for (const receipt of receipts) if (receipt?.id != null) ids.add(String(receipt.id));
      }
    }
    return ids;
  };
  const removedIds = receiptIds(removedPulseRecords);
  if (removedIds.size === 0) return worldState;
  const survivingRecords = Array.isArray(worldState?.pulseHistory)
    ? /** @type {Array<Record<string, unknown>>} */ (worldState.pulseHistory)
    : [];
  const protectedIds = receiptIds(survivingRecords);
  // Every ordinary ledger row not owned by this collapse is a conservative
  // root too (manual proposals and legacy rows have no durable owner marker).
  // A row tagged collapsed_ancestor was retained only for a prior surviving
  // receipt, so it must not become an immortal root on the next collapse.
  for (const id of Object.keys(ledger)) {
    if (!removedIds.has(id) && ledger[id]?.retentionClass !== 'collapsed_ancestor') {
      protectedIds.add(id);
    }
  }
  const pending = [...protectedIds];
  while (pending.length) {
    const id = pending.pop();
    if (!id || !ledger[id]) continue;
    for (const parent of ledger[id].parents || []) {
      const parentId = String(parent);
      if (protectedIds.has(parentId)) continue;
      protectedIds.add(parentId);
      pending.push(parentId);
    }
  }
  const drop = new Set(Object.keys(ledger).filter(id => (
    (removedIds.has(id) || ledger[id]?.retentionClass === 'collapsed_ancestor')
    && !protectedIds.has(id)
  )));
  /** @type {ProvLedger} */
  const next = {};
  let changed = drop.size > 0;
  for (const id of Object.keys(ledger).sort()) {
    if (drop.has(id)) continue;
    const entry = ledger[id];
    if (removedIds.has(id) && protectedIds.has(id)
        && entry.retentionClass !== 'collapsed_ancestor') {
      next[id] = { ...entry, retentionClass: 'collapsed_ancestor' };
      changed = true;
    } else {
      next[id] = entry;
    }
  }
  if (!changed) return worldState;
  if (Object.keys(next).length === 0) return dropSpatialLedger(worldState, 'provenance');
  return setSpatialLedger(worldState, 'provenance', next);
}

/**
 * E-J — RECORDED PROVENANCE GOES MULTI-HOP. Given this advance's raw news entries and the
 * post-advance regional queued impacts, return the entries with an ADDITIVE `causedBy` on each
 * WAVE receipt: the recorded receipt KEY of its IMMEDIATE-PARENT impact. A derived regional wave
 * (waveDepth ≥ 1) carries `sourceImpactId` = the id of the impact it propagated from, and
 * deriveRegionalImpacts mints a wave and its source impact TOGETHER (same advance) — so the
 * parent's recorded key is this advance's `wizard_news.<tick>.<transition>.<parentImpactId>`,
 * already present among these same newsEntries. Resolving it here needs NO persisted field and
 * NO migration (the parent id is read transiently off the live queued-impact record).
 *
 * Before this, every recorded wave edge was child → ROOT (the wave's `sourceEventId` names its
 * ULTIMATE cause), so the recorded DAG was one-hop-to-root and `deepChains` (a recorded child
 * that is itself a recorded parent) measured ZERO. This adds the IMMEDIATE-parent edge WITHOUT
 * removing the root edge (`sourceEventId` is untouched — the returned entry keeps every field),
 * so full_simulation records genuine ≥2-hop chains (conquest → information shock → import-shortage
 * wave). Additive & pure: returns the SAME array reference when nothing resolves; never mutates an
 * input entry (enriched entries are shallow copies). This lives in the LAZY recorder — the eager
 * first-paint closure is unchanged (the wave receipts already reach here via the durable set).
 *
 * @param {ProvReceipt[]} newsEntries               applied.newsEntries (raw, carrying impactIds + sourceEventId)
 * @param {ReadonlyArray<Record<string, unknown>>|undefined} queuedImpacts  applied.regionalGraph.queuedImpacts
 * @returns {ProvReceipt[]}
 */
export function withWaveCauseEdges(newsEntries, queuedImpacts) {
  if (!Array.isArray(newsEntries) || newsEntries.length === 0 || !Array.isArray(queuedImpacts)) return newsEntries;
  // impactId → its immediate SOURCE impact id (only WAVE impacts carry a non-empty sourceImpactId).
  /** @type {Map<string, string>} */
  const srcByImpactId = new Map();
  for (const q of queuedImpacts) {
    const id = q && q.id != null ? String(q.id) : '';
    const src = q && q.sourceImpactId != null && q.sourceImpactId !== '' ? String(q.sourceImpactId) : '';
    if (id && src) srcByImpactId.set(id, src);
  }
  if (srcByImpactId.size === 0) return newsEntries;
  // impactId → this advance's recorded news key (the receipt id it lands under).
  /** @type {Map<string, string>} */
  const keyByImpactId = new Map();
  for (const e of newsEntries) {
    const iid = e && Array.isArray(/** @type {{ impactIds?: unknown }} */ (e).impactIds) && /** @type {{ impactIds: unknown[] }} */ (e).impactIds.length
      ? String(/** @type {{ impactIds: unknown[] }} */ (e).impactIds[0]) : '';
    if (iid && e?.id != null) keyByImpactId.set(iid, String(e.id));
  }
  let changed = false;
  const out = newsEntries.map((e) => {
    const iid = e && Array.isArray(/** @type {{ impactIds?: unknown }} */ (e).impactIds) && /** @type {{ impactIds: unknown[] }} */ (e).impactIds.length
      ? String(/** @type {{ impactIds: unknown[] }} */ (e).impactIds[0]) : '';
    const src = iid ? srcByImpactId.get(iid) : undefined;
    if (!src) return e;
    const parentKey = keyByImpactId.get(src);
    if (!parentKey || parentKey === String(e.id)) return e;
    changed = true;
    // ADDITIVE: keep every existing field (the sourceEventId → root edge included); add causedBy.
    return { ...e, causedBy: parentKey };
  });
  return changed ? out : newsEntries;
}

/**
 * THE CEILING-SAFE COMMIT WRAPPER — the single seam pulseKernel calls in place of
 * appendPulseHistory. When the ledger is dormant it IS appendPulseHistory (returns
 * its exact result — byte-identical). When lit it records the advance's cause-edges
 * first, then commits the pulse record. The durable receipt set (selectedOutcomes ∪
 * mechanicalOutcomes ∪ impactDigest ids) scopes the recording to the public
 * chronicle plus its compact mechanical audit. The
 * record/applied params are read structurally (cast to the fields used) so the
 * broadly-typed kernel call site passes without an `any`.
 * @param {ProvWorldState} worldState
 * @param {Record<string, unknown>} pulseRecord   carries the durable ids + tick
 * @param {Record<string, unknown>} applied       the applyWorldPulseOutcomes result
 * @returns {ProvWorldState} the world state with pulseRecord appended (+ provenance when lit)
 */
export function appendPulseHistoryWithProvenance(worldState, pulseRecord, applied) {
  if (!provenanceLedgerActive(worldState)) return appendPulseHistory(worldState, pulseRecord);
  const rec = /** @type {{ tick?: number, selectedOutcomes?: ProvReceipt[], mechanicalOutcomes?: ProvReceipt[], impactDigest?: ProvReceipt[] }} */ (pulseRecord || {});
  const app = /** @type {{ autoApplied?: ProvReceipt[], proposals?: ProvReceipt[], newsEntries?: ProvReceipt[], regionalGraph?: { queuedImpacts?: ReadonlyArray<Record<string, unknown>> } }} */ (applied || {});
  /** @type {Set<string>} */
  const durableIds = new Set();
  const mechanicalIds = new Set();
  for (const o of (rec.selectedOutcomes || [])) if (o?.id != null) durableIds.add(String(o.id));
  for (const o of (rec.mechanicalOutcomes || [])) {
    if (o?.id == null) continue;
    const id = String(o.id);
    durableIds.add(id);
    mechanicalIds.add(id);
  }
  for (const d of (rec.impactDigest || [])) {
    if (d?.id == null) continue;
    const id = String(d.id);
    durableIds.add(id);
  }
  const outcomes = [...(app.autoApplied || []), ...(app.proposals || [])];
  // E-J: enrich wave receipts with their immediate-parent recorded key (additive, dark).
  const newsEntries = withWaveCauseEdges(app.newsEntries || [], app.regionalGraph?.queuedImpacts);
  const tick = Number.isFinite(rec.tick) ? Number(rec.tick) : Number(worldState?.tick) || 0;
  const withLedger = recordProvenanceLedger(worldState, {
    outcomes,
    newsEntries,
    durableIds,
    mechanicalIds,
    tick,
  });
  return appendPulseHistory(withLedger, pulseRecord);
}

/**
 * correctness-4 — the MANUAL-APPLY (DM decree) twin of appendPulseHistoryWithProvenance: record a
 * hand-approved decree's cause-edges so it leaves a recorded-causality entry too, not only organic
 * pulses. applyWorldPulseProposal has no pulseRecord to append, so this records the ledger DIRECTLY.
 * The durable set is the applied outcomes ∪ news ids (a decree's own receipts scope its recording).
 * FLAG-GATED: recordProvenanceLedger returns the input worldState untouched when dark ⇒ byte-identical.
 * @param {ProvWorldState} worldState  the post-apply worldState (status already stamped)
 * @param {Record<string, unknown>} applied  the applyWorldPulseOutcomes result (read structurally)
 * @param {number} tick
 * @returns {ProvWorldState}
 */
export function recordProposalProvenance(worldState, applied, tick) {
  const app = /** @type {{ autoApplied?: ProvReceipt[], proposals?: ProvReceipt[], newsEntries?: ProvReceipt[], regionalGraph?: { queuedImpacts?: ReadonlyArray<Record<string, unknown>> } }} */ (applied || {});
  const outcomes = [...(app.autoApplied || []), ...(app.proposals || [])];
  // E-J: a hand-approved decree that queues regional waves records the immediate-parent edge too.
  const newsEntries = withWaveCauseEdges(app.newsEntries || [], app.regionalGraph?.queuedImpacts);
  const durableIds = new Set([...outcomes, ...newsEntries].map((r) => (r && r.id != null ? String(r.id) : '')).filter(Boolean));
  const mechanicalIds = new Set((app.autoApplied || [])
    .filter((o) => o?.recordMode === 'state_only' && o?.id != null)
    .map((o) => String(o.id)));
  return recordProvenanceLedger(worldState, {
    outcomes,
    newsEntries,
    durableIds,
    mechanicalIds,
    tick,
  });
}
