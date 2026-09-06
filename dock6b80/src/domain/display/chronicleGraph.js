/**
 * domain/display/chronicleGraph.js — THE CHRONICLE causal-link primitive (W-R2
 * CHRONICLE, design docs/DESIGN_CHRONICLE_LEGIBILITY.md §2 + §5).
 *
 * ONE shared graph read, consumed by BOTH the thread extractor (§2) and the
 * decree tracker's causal cone (§5) so threads and cones are the SAME graph read
 * (the ×RECEIPTS row of the coherence matrix). Pure, deterministic, RNG-free,
 * clock-free — a view-time projection over the DURABLE stores only (nothing
 * persists; the SM town-map precedent).
 *
 * ── THE SUBSTRATE (surveyed, not assumed — the §6 sourcing rule) ──────────────
 * The chronicle reads `worldState.pulseHistory[]` (the collapsed per-ADVANCE
 * records the interval durably wrote) — NEVER the capped display feed
 * `wizardNews` (240). Each record carries `selectedOutcomes[]` (<=24) +
 * `impactDigest[]` (<=18), each with typed `reasons` and entity keys
 * (targetSaveId / factionId / npcId / relationshipKey / stressor.id /
 * affectedSettlementIds). pulseHistory is itself CAPPED at MAX_HISTORY=80 records
 * — a §6 FINDING reported in the wave's survey, not papered over.
 *
 * ── THE REPORTED SEAM (design §5c assumed more than the tree carries) ─────────
 * There is NO durable receipt→child-receipt DAG. The engine's `Receipt`
 * (domain/trace.js) is derive-on-read and its edges name ENTITY/subsystem ids,
 * not parent-receipt ids; applied ops persist no stable causal-receipt id. So the
 * "causal cone" and thread "chains" are INFERRED here from shared entity keys +
 * temporal (per-advance) order — an honest entity-proximity graph, NOT an exact
 * provenance walk. This is a REPORTED SEAM (zero engine edits per the brief), and
 * every derived link is labelled `inferred` so no prose over-claims causality.
 *
 * @enforced-by tests/domain/chronicleGraph.test.js (determinism + taxonomy pin +
 *   bounded threads + no-wizardNews structural source scan)
 */

import { PULSE_IMPACT_FALLBACK, PULSE_OUTCOME_FALLBACK } from './receiptClauseFloor.js';

/**
 * The eight drama classes, in the codepoint-deterministic priority order that
 * types a thread by its DOMINANT (highest-priority) member. This mirrors the
 * engine's canonical `DRAMA_CLASS_PRIORITY` (domain/worldPulse/decisionTier.js)
 * but is duplicated here DELIBERATELY so the display chunk never imports the
 * worldPulse engine chunk (the zero-engine-contact law). Drift is caught by a
 * pin that imports the canonical list ONLY in the test — freezing the
 * relationship without coupling the runtime closure.
 * @type {ReadonlyArray<string>}
 */
export const DRAMA_CLASSES = Object.freeze([
  'war', 'succession_coup', 'plague', 'calamity', 'schism_contest', 'economic_shock', 'boom_flourishing', 'reframe',
]);

/** Rank of a class for dominance (lower = higher priority). Unknown ⇒ after all. */
const CLASS_RANK = Object.freeze(
  DRAMA_CLASSES.reduce((/** @type {Record<string, number>} */ m, c, i) => { m[c] = i; return m; }, {}),
);

/**
 * A stressor TYPE → drama class map, mirroring DRAMA_CLASS_REGISTRY's
 * `stressor_birth_<type>` entries. Types absent here fall through to the
 * candidate/rule heuristic in `dramaClassForNode`. Pinned against the registry
 * in the test (no silent divergence).
 * @type {Readonly<Record<string, string>>}
 */
const STRESSOR_CLASS = Object.freeze({
  siege: 'war', wartime: 'war', occupation: 'war',
  disease_outbreak: 'plague',
  magic_deadzone: 'calamity', magical_instability: 'calamity', monster_raider_pressure: 'calamity',
  coup_detat: 'succession_coup', succession_void: 'succession_coup', political_fracture: 'succession_coup',
  religious_conversion_fracture: 'schism_contest', insurgency: 'schism_contest', rebellion: 'schism_contest', slave_revolt: 'schism_contest',
  market_shock: 'economic_shock', indebtedness: 'economic_shock', famine: 'economic_shock',
});

/**
 * A compacted pulse outcome / impact-digest entry — the durable record's atoms
 * (the shape pulseHelpers.compactOutcomeForHistory / compactImpactDigest write).
 * Only the fields the chronicle reads are named; the rest ride `unknown`.
 * @typedef {Object} PulseOutcome
 * @property {string} [id]
 * @property {string} [type]
 * @property {string} [candidateType]
 * @property {string} [ruleFamily]
 * @property {string} [targetSaveId]
 * @property {string} [relationshipKey]
 * @property {string} [npcId]
 * @property {string} [factionId]
 * @property {number} [severity]
 * @property {string} [applyMode]
 * @property {string} [headline]
 * @property {string} [summary]
 * @property {ReadonlyArray<unknown>} [reasons]
 * @property {ReadonlyArray<string>} [settlementIds]
 * @property {ReadonlyArray<string>} [affectedSettlementIds]
 * @property {{ id?: string, type?: string, label?: string, severity?: number, affectedSettlementIds?: ReadonlyArray<string> }} [stressor]
 * @property {Record<string, number>} [populationDeltas]
 * @property {{ from?: unknown, to?: unknown, settlementId?: string }} [tierChange]
 * @property {{ kind?: string, settlementId?: string, relationshipKey?: string, targetId?: string, toType?: string, reason?: string }} [proposalPayload]
 * @property {unknown} [relationshipPatch]
 * @property {unknown} [powerTransfer]
 * @property {unknown} [metadata]
 */

/**
 * One worldState.pulseHistory entry — a collapsed ADVANCE record.
 * @typedef {Object} PulseRecord
 * @property {number} [tick]
 * @property {string} [interval]
 * @property {ReadonlyArray<PulseOutcome>} [selectedOutcomes]
 * @property {ReadonlyArray<PulseOutcome>} [impactDigest]
 */

/**
 * A durable world-state shape the chronicle reads (pulseHistory only).
 * @typedef {{ pulseHistory?: ReadonlyArray<PulseRecord> }} ChronicleWorldState
 */

/**
 * One graph node — a flattened outcome/impact with its typing + entity keys.
 * @typedef {Object} ChronicleNode
 * @property {string} nodeId
 * @property {'outcome'|'impact'} kind
 * @property {string|null} dramaClass
 * @property {string[]} keys
 * @property {boolean} decree
 * @property {number|null} severity
 * @property {string} headline
 * @property {string} summary
 * @property {ReadonlyArray<unknown>} reasons
 * @property {string[]} settlementIds
 * @property {PulseOutcome} raw
 */

/**
 * One normalized per-advance entry (advanceEntries element).
 * @typedef {Object} AdvanceEntry
 * @property {number} tick
 * @property {number} prevTick
 * @property {number} spanWeeks
 * @property {string} spanLabel
 * @property {PulseRecord} record
 */

/** @param {PulseRecord} v @returns {number} */
const numTick = (v) => (Number.isFinite(v?.tick) ? Number(v.tick) : 0);

/** Codepoint-stable string compare (never locale-sensitive). */
const byStr = (/** @type {string} */ a, /** @type {string} */ b) => (a < b ? -1 : a > b ? 1 : 0);

/**
 * The named span label for a whole-week count. The engine's four named intervals
 * are {week:1, month:4, season:13, year:52}; a catch-up span is a raw week count
 * (1..26), so we bucket by threshold rather than requiring an exact match. Honest
 * for both the DM-named advance and the wall-clock catch-up.
 * @param {number} weeks
 * @returns {'week'|'month'|'season'|'year'}
 */
export function spanLabelForWeeks(weeks) {
  const w = Math.max(1, Math.floor(Number(weeks) || 1));
  if (w <= 1) return 'week';
  if (w <= 4) return 'month';
  if (w <= 13) return 'season';
  return 'year';
}

/**
 * The altitudes the zoom pyramid renders for a span (design §1: week ⇒ events
 * only · month ⇒ threads+events · season ⇒ chapter+threads+events · year ⇒ the
 * full pyramid). Always includes the deepest layer (events); scaffolding grows
 * with span. Full descent is always AVAILABLE — this only sets the DEFAULT
 * altitude set the surface opens at.
 * @param {'week'|'month'|'season'|'year'} label
 * @returns {ReadonlyArray<'headline'|'chapters'|'threads'|'events'>}
 */
export function altitudesForSpan(label) {
  switch (label) {
    case 'week':   return Object.freeze(['events']);
    case 'month':  return Object.freeze(['threads', 'events']);
    case 'season': return Object.freeze(['chapters', 'threads', 'events']);
    default:       return Object.freeze(['headline', 'chapters', 'threads', 'events']);
  }
}

/**
 * The entity keys an outcome/impact node touches — the inferred-causality
 * substrate. A node's keys are the ids it references; two nodes are linked when
 * their key sets intersect. Deterministic (sorted), string-typed, deduped.
 * @param {PulseOutcome} o  a compacted pulse outcome or impact-digest entry
 * @returns {string[]}
 */
export function entityKeysOf(o) {
  /** @type {Set<string>} */
  const keys = new Set();
  const add = (/** @type {unknown} */ v) => { if (v != null && v !== '') keys.add(String(v)); };
  add(o?.targetSaveId);
  add(o?.npcId);
  add(o?.factionId);
  // A relationship key names two endpoints (a::b) — split so a war and its peace
  // between the SAME pair share both endpoints.
  if (o?.relationshipKey) {
    add(o.relationshipKey);
    for (const part of String(o.relationshipKey).split(/[:|>-]+/)) add(part);
  }
  // A stressor's id is the STRONGEST spine: one stressor's whole lifecycle is one
  // thread. Its affected settlements are secondary linkage.
  if (o?.stressor) { add(o.stressor.id); for (const id of o.stressor.affectedSettlementIds || []) add(id); }
  for (const id of o?.settlementIds || []) add(id);
  for (const id of o?.affectedSettlementIds || []) add(id);
  // A queued/applied decree's payload names its target too.
  const pay = o?.proposalPayload;
  if (pay && typeof pay === 'object') { add(pay.settlementId); add(pay.relationshipKey); add(pay.targetId); }
  return [...keys].sort(byStr);
}

/**
 * Classify a node into one of the eight drama classes, or null when it belongs to
 * none (a quiet economic drift, a non-dramatic impact). Stressor type wins; then
 * a small candidate/rule heuristic. Pure.
 * @param {PulseOutcome} o
 * @returns {string|null}
 */
export function dramaClassForNode(o) {
  const st = o?.stressor?.type;
  if (st && STRESSOR_CLASS[st]) return STRESSOR_CLASS[st];
  const ct = String(o?.candidateType || '');
  if (STRESSOR_CLASS[ct.replace(/^stressor_birth_/, '')]) return STRESSOR_CLASS[ct.replace(/^stressor_birth_/, '')];
  const fam = String(o?.ruleFamily || '');
  if (fam === 'strategy' || /war|siege|deploy|conquest/i.test(ct)) return 'war';
  if (/coup|succession|government/i.test(ct)) return 'succession_coup';
  if (/plague|disease/i.test(ct)) return 'plague';
  if (/calamity|monster|magic/i.test(ct)) return 'calamity';
  if (/schism|religio|convert|rebel|insurgen|revolt/i.test(ct)) return 'schism_contest';
  if (/market|econom|famine|debt|trade/i.test(ct)) return 'economic_shock';
  if (/boom|flourish|founded|resettl/i.test(ct)) return 'boom_flourishing';
  if (/reframe/i.test(ct)) return 'reframe';
  return null;
}

/**
 * Whether a node is a DM DECREE — an applied DM-queued change surfacing as an
 * outcome. Applied proposals carry `applyMode:'proposal'` and/or a
 * `proposalPayload` (the realm-verb / relationship / faction / siege arms). This
 * is the durable footprint of "the DM's choice" in the collapsed record.
 * @param {PulseOutcome} o
 * @returns {boolean}
 */
export function isDecreeNode(o) {
  return o?.applyMode === 'proposal' || (o?.proposalPayload != null && typeof o.proposalPayload === 'object');
}

/**
 * Flatten one pulseHistory record into deterministic graph NODES. Outcomes and
 * impact-digest entries both become nodes; each carries its drama class, entity
 * keys, decree flag, and the persisted (already register-safe) headline/summary.
 * Deterministically ordered by node id.
 * @param {PulseRecord} record  a worldState.pulseHistory entry
 * @returns {ChronicleNode[]}
 */
export function nodesFromRecord(record) {
  const outcomes = Array.isArray(record?.selectedOutcomes) ? record.selectedOutcomes : [];
  const impacts = Array.isArray(record?.impactDigest) ? record.impactDigest : [];
  /** @type {ChronicleNode[]} */
  const nodes = [];
  outcomes.forEach((/** @type {PulseOutcome} */ o, /** @type {number} */ i) => {
    nodes.push({
      nodeId: String(o?.id ?? `outcome_${i}`),
      kind: 'outcome',
      dramaClass: dramaClassForNode(o),
      keys: entityKeysOf(o),
      decree: isDecreeNode(o),
      severity: Number.isFinite(o?.severity) ? Number(o.severity) : null,
      // A node with no recorded headline gets a PLACEHOLDER, not a clause. The
      // constant is shared with the composer's guard so the two can never drift
      // into a state where a placeholder is composed as if it were a receipt's
      // own words (lane HR).
      headline: o?.headline || PULSE_OUTCOME_FALLBACK,
      summary: o?.summary || '',
      reasons: Array.isArray(o?.reasons) ? o.reasons : [],
      settlementIds: entityKeysOf(o),
      raw: o,
    });
  });
  impacts.forEach((/** @type {PulseOutcome} */ d, /** @type {number} */ i) => {
    nodes.push({
      nodeId: String(d?.id ?? `impact_${i}`),
      kind: 'impact',
      dramaClass: dramaClassForNode(d),
      keys: entityKeysOf(d),
      decree: false,
      severity: Number.isFinite(d?.severity) ? Number(d.severity) : null,
      headline: d?.headline || PULSE_IMPACT_FALLBACK,
      summary: d?.summary || '',
      reasons: Array.isArray(d?.reasons) ? d.reasons : [],
      settlementIds: entityKeysOf(d),
      raw: d,
    });
  });
  return nodes.sort((a, b) => byStr(a.nodeId, b.nodeId));
}

// ── RECORDED CAUSALITY (THE PROVENANCE LEDGER read-model) ─────────────────────
// The engine finale added a durable receipt→parent cause-edge ledger
// (worldState.spatialLedgers.provenance, keyed by receipt id → { parents, type,
// tick }). These pure readers let the chronicle prefer RECORDED edges over the
// entity-key INFERENCE below wherever the ledger carries them — decree cones,
// thread chains, and cross-links become exact where causality was recorded, and
// stay inferred (and labelled so) elsewhere. The display chunk reads only the plain
// serialized ledger object — it NEVER imports the engine writer (the zero-engine-
// contact law). An empty/absent ledger yields empty maps ⇒ every read falls back to
// inference ⇒ byte-identical to the pre-ledger chronicle.

/**
 * @typedef {Object} RecordedEdges
 * @property {Map<string, Set<string>>} parentsOf    child id → its recorded parent ids
 * @property {Map<string, Set<string>>} childrenOf   parent id → its recorded child ids
 * @property {number} size                           total directed edges
 */

/**
 * Build recorded-edge adjacency from a provenance ledger object. Absent/empty ⇒
 * empty maps (size 0) ⇒ every downstream read is the inferred fallback.
 * @param {Record<string, { parents?: ReadonlyArray<string> }>|null|undefined} provenance
 * @returns {RecordedEdges}
 */
export function buildRecordedEdges(provenance) {
  /** @type {Map<string, Set<string>>} */
  const parentsOf = new Map();
  /** @type {Map<string, Set<string>>} */
  const childrenOf = new Map();
  let size = 0;
  if (provenance && typeof provenance === 'object' && !Array.isArray(provenance)) {
    for (const childId of Object.keys(provenance)) {
      const parents = provenance[childId]?.parents;
      if (!Array.isArray(parents) || parents.length === 0) continue;
      for (const p of parents) {
        const pid = String(p);
        if (pid === childId) continue;
        let pset = parentsOf.get(childId);
        if (!pset) { pset = new Set(); parentsOf.set(childId, pset); }
        if (!pset.has(pid)) {
          pset.add(pid);
          let cset = childrenOf.get(pid);
          if (!cset) { cset = new Set(); childrenOf.set(pid, cset); }
          cset.add(childId);
          size += 1;
        }
      }
    }
  }
  return { parentsOf, childrenOf, size };
}

/**
 * The recorded transitive descendants of `rootId` — every node reachable by
 * following recorded child edges. Cycle-safe (visited set), deterministic (sorted).
 * Walks THROUGH out-of-scope ids to reach in-scope grandchildren, but only in-scope
 * ids are returned when `scope` is given (a decree's recorded cone = its downstream
 * receipts WITHIN the advance). The root is never in its own cone.
 * @param {string} rootId
 * @param {RecordedEdges} edges
 * @param {Set<string>} [scope]  restrict the returned set to these ids
 * @returns {string[]}
 */
export function recordedDescendants(rootId, edges, scope) {
  const root = String(rootId);
  /** @type {Set<string>} */
  const out = new Set();
  const seen = new Set([root]);
  const stack = [root];
  while (stack.length) {
    const cur = stack.pop();
    const kids = edges?.childrenOf?.get(/** @type {string} */ (cur));
    if (!kids) continue;
    for (const k of kids) {
      if (seen.has(k)) continue;
      seen.add(k);
      if (!scope || scope.has(k)) out.add(k);
      stack.push(k);
    }
  }
  out.delete(root);
  return [...out].sort(byStr);
}

/**
 * The recorded transitive ANCESTORS of `nodeId` — every node reachable by following
 * recorded PARENT edges backward (the mirror of recordedDescendants; the V-4
 * cause-walk substrate: "trace the causes"). Cycle-safe (visited set), deterministic
 * (sorted). Walks THROUGH out-of-scope ids to reach in-scope grandparents, but only
 * in-scope ids are returned when `scope` is given. The node is never its own ancestor.
 * @param {string} nodeId
 * @param {RecordedEdges} edges
 * @param {Set<string>} [scope]  restrict the returned set to these ids
 * @returns {string[]}
 */
export function recordedAncestors(nodeId, edges, scope) {
  const root = String(nodeId);
  /** @type {Set<string>} */
  const out = new Set();
  const seen = new Set([root]);
  const stack = [root];
  while (stack.length) {
    const cur = stack.pop();
    const parents = edges?.parentsOf?.get(/** @type {string} */ (cur));
    if (!parents) continue;
    for (const p of parents) {
      if (seen.has(p)) continue;
      seen.add(p);
      if (!scope || scope.has(p)) out.add(p);
      stack.push(p);
    }
  }
  out.delete(root);
  return [...out].sort(byStr);
}

/**
 * Is there a DIRECT recorded edge between a and b (either direction)? Used to flip a
 * thread cross-link's `inferred` label to recorded.
 * @param {string} aId
 * @param {string} bId
 * @param {RecordedEdges} edges
 * @returns {boolean}
 */
export function hasRecordedEdge(aId, bId, edges) {
  const a = String(aId), b = String(bId);
  return !!(edges?.parentsOf?.get(a)?.has(b) || edges?.parentsOf?.get(b)?.has(a));
}

/**
 * Union-find connected components over the entity-key graph: two nodes are linked
 * when their key sets intersect. Each component becomes a THREAD (design §2, "the
 * causally-linked chain, extracted — never authored"). Deterministic: nodes are
 * pre-sorted by id, so component roots and membership order are stable.
 *
 * When `edges` (the RecordedEdges from the provenance ledger) is supplied and non-
 * empty, RECORDED parent/child pairs also union — so a causally-linked chain the
 * engine recorded stays ONE thread even if it crosses entity boundaries. An empty/
 * omitted `edges` reproduces the pure entity-key components byte-for-byte.
 * @param {ChronicleNode[]} nodes
 * @param {RecordedEdges} [edges]
 * @returns {ChronicleNode[][]}  components, each a node list (input order preserved)
 */
export function connectedComponents(nodes, edges) {
  const parent = nodes.map((_, i) => i);
  const find = (/** @type {number} */ x) => { while (parent[x] !== x) { parent[x] = parent[parent[x]]; x = parent[x]; } return x; };
  const union = (/** @type {number} */ a, /** @type {number} */ b) => { const ra = find(a), rb = find(b); if (ra !== rb) parent[Math.max(ra, rb)] = Math.min(ra, rb); };
  // Key → first node index that owns it; unify every later owner with the first.
  /** @type {Map<string, number>} */
  const firstOwner = new Map();
  nodes.forEach((n, i) => {
    for (const k of n.keys) {
      const owner = firstOwner.get(k);
      if (owner == null) firstOwner.set(k, i);
      else union(owner, i);
    }
  });
  // Recorded edges: union each node with any co-present recorded parent (deterministic
  // — node order is fixed; only pairs where BOTH endpoints are in this record union).
  if (edges && edges.size) {
    /** @type {Map<string, number>} */
    const indexOf = new Map();
    nodes.forEach((n, i) => { if (!indexOf.has(n.nodeId)) indexOf.set(n.nodeId, i); });
    nodes.forEach((n, i) => {
      const parents = edges.parentsOf.get(n.nodeId);
      if (!parents) return;
      for (const p of parents) { const j = indexOf.get(p); if (j != null) union(i, j); }
    });
  }
  /** @type {Map<number, ChronicleNode[]>} */
  const groups = new Map();
  nodes.forEach((n, i) => {
    const r = find(i);
    if (!groups.has(r)) groups.set(r, []);
    (groups.get(r) || []).push(n);
  });
  // Root order is ascending node-index (deterministic); a node touching NO shared
  // key is its own singleton component (still a valid one-beat thread).
  return [...groups.keys()].sort((a, b) => a - b).map(r => groups.get(r) || []);
}

/**
 * The dominant drama class of a component — the highest-priority non-null class
 * among its nodes (design §2: a thread is TYPED by its class). Ties break to the
 * priority order; an all-unclassified component yields null (a "quiet" thread).
 * @param {ChronicleNode[]} component
 * @returns {string|null}
 */
export function dominantClass(component) {
  let best = null;
  let bestRank = Infinity;
  for (const n of component) {
    if (!n.dramaClass) continue;
    const r = CLASS_RANK[n.dramaClass] ?? Infinity;
    if (r < bestRank) { bestRank = r; best = n.dramaClass; }
  }
  return best;
}

/**
 * Rank of a class (priority; lower = more urgent). Exposed for the read-model's
 * deterministic thread ordering. Unknown/null ⇒ after every known class.
 * @param {string|null} cls
 * @returns {number}
 */
export function classRank(cls) {
  return cls == null ? Number.MAX_SAFE_INTEGER : (CLASS_RANK[cls] ?? Number.MAX_SAFE_INTEGER - 1);
}

/**
 * Normalize `worldState.pulseHistory` into per-ADVANCE entries, newest-first,
 * each with the span DERIVED from the tick delta to the prior record (the span
 * label is NOT stored on the record — it collapses to 'one_week' — so it is
 * reconstructed here honestly). The first record's span is its own tick (from a
 * zero start). Pure.
 * @param {ChronicleWorldState} worldState
 * @returns {AdvanceEntry[]}
 */
export function advanceEntries(worldState) {
  const history = Array.isArray(worldState?.pulseHistory) ? worldState.pulseHistory : [];
  // Ascending by tick for delta derivation, then reverse to newest-first.
  const asc = [...history].sort((a, b) => numTick(a) - numTick(b));
  /** @type {AdvanceEntry[]} */
  const out = [];
  let prev = 0;
  for (const record of asc) {
    const tick = numTick(record);
    const spanWeeks = Math.max(1, tick - prev);
    out.push({ tick, prevTick: prev, spanWeeks, spanLabel: spanLabelForWeeks(spanWeeks), record });
    prev = tick;
  }
  return out.reverse();
}
