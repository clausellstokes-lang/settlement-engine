/**
 * domain/display/relationshipChronicle.js — WHAT THIS RELATIONSHIP SURVIVED.
 *
 * LONG TAIL #39 / docs/world-pulse-roadmap.md §4d, the half that had no surface:
 * the engine keeps SIX durable per-edge archives and, until this leaf, ZERO
 * readers outside the engine and the AI grounding payload. DESK-4's
 * PerspectiveStandings already says what a settlement's standings ARE; this says
 * what they SURVIVED.
 *
 * A PURE view-time projection over state the engine already persists. It READS;
 * it never writes. No store, no rng, no wall clock, no new persisted field, no
 * change to any store shape — every line it prints was already on disk.
 *
 * ── ⛔ THE DECAY TRAP, AND WHY THIS FILE EXISTS AT ALL ────────────────────────
 * `buildRelationshipPostures` (worldPulse/relationshipMemory.js) already composes
 * a human-worded per-edge row with a `recentMemory` list, and it LOOKS like the
 * finished chronicle. IT IS NOT ONE. `memoryEntry` returns null whenever
 * `relationshipMemoryWeight` is 0, and that weight is 0 for an undated row and
 * for anything older than RELATIONSHIP_MEMORY_MAX_LOOKBACK_TICKS = 24. So
 * `recentMemory` is a 24-tick DECAY WINDOW built to classify a present posture —
 * exactly the wrong instrument for "what did this alliance survive", because the
 * alliance the question is about is usually older than 24 weeks. A surface built
 * on it would silently forget precisely what it was asked to remember, while the
 * durable turningPoints / allianceCalls / coalitionSettlements archives sat
 * unread beside it.
 *
 * THIS LEAF THEREFORE APPLIES NO DECAY AND NO LOOKBACK CUTOFF. A 40-tick-old
 * turning point renders. That is the whole point, and the suite's negative
 * control pins it.
 *
 * ── WHAT IT DOES REUSE ───────────────────────────────────────────────────────
 * relationshipMemory's DEDUPE REASONING, without its decay: one world event
 * lands in up to three stores at once (applyRelationshipPatch writes an incident
 * row AND, for a label change, a history row AND a turning point; a hierarchy
 * resolution writes incident + history + hierarchyResolutions in one call), so
 * each event must be counted ONCE. The outcome id is stamped on every row the
 * apply path writes and therefore claims identity FIRST, regardless of which
 * tick the rows landed on; the (tick, type) join is the fallback for rows that
 * predate the stamp.
 *
 * And its HONEST-MEMORY rule (S3): a `proposal`-mode outcome in pulseHistory is a
 * QUESTION the pulse asked, not an event that happened. A pending or dismissed
 * proposal must never become a chronicle line — the chronicle would be claiming
 * a war that was only ever contemplated.
 *
 * ── ZERO ENGINE IMPORTS (the chronicleReadModel precedent) ───────────────────
 * The display chunk never imports the worldPulse engine chunk. Two small engine
 * rules are therefore replicated here as LOCAL COPIES, each pinned against its
 * canonical source IN THE TEST ONLY, which freezes the relationship without
 * coupling the runtime closure: `relationshipKeyOf` (relationshipKeyFromEdge) and
 * `mechanicalOutcomesOf` (pulseHelpers.outcomesForMechanicalHistory). The posture
 * WORDS are not replicated at all — they are read off the `relationshipMemory`
 * blob that `refreshRelationshipMemory` stamps onto every relationship state each
 * pulse, which is the persisted read that earns that field family its
 * persistence.
 *
 * Deterministic and codepoint-stable; total on garbage (a malformed world yields
 * [] rather than throwing); a fresh campaign yields [] — the byte-identical
 * off-state every display leaf in this estate owes.
 *
 * ⚠ THIS LEAF PRINTS NO WORDS FOR AN INCIDENT TYPE. It carries the engine's own
 * token through untouched, deliberately: turning a type into English is the
 * lexicon's job (humanizeEngineTokens.js), and a surface that renders a row of
 * this model without going through that lexicon is putting an engine token in
 * front of a reader.
 *
 * @enforced-by tests/domain/display/relationshipChronicle.test.js
 */

/** Codepoint-stable string compare (never locale-sensitive). */
const byStr = (/** @type {string} */ a, /** @type {string} */ b) => (a < b ? -1 : a > b ? 1 : 0);

/** @param {unknown} v @returns {unknown[]} */
const arr = (v) => (Array.isArray(v) ? v : []);

/** @param {unknown} v @returns {Record<string, unknown>} */
const obj = (v) => (v && typeof v === 'object' && !Array.isArray(v) ? /** @type {Record<string, unknown>} */ (v) : {});

/** @param {unknown} v @returns {number|null} */
const tickOf = (v) => (Number.isFinite(v) ? Math.max(0, Math.floor(Number(v))) : null);

/** @param {unknown} v @returns {string|null} */
const textOrNull = (v) => (typeof v === 'string' && v.trim() !== '' ? v.trim() : null);

/**
 * The seven archives a line can come from. `pulse` is the collapsed advance
 * record; the other six are the per-edge stores on the relationship state.
 * @typedef {'pulse'|'incident'|'hierarchy'|'turning-point'|'history'|'alliance-call'|'coalition-settlement'} ChronicleSource
 */

/**
 * @typedef {Object} ChronicleLine  one dated thing that happened to this edge
 * @property {string} id         deterministic; the dedupe identity that claimed it
 * @property {number|null} tick  elapsed weeks, or null when the row was never dated
 * @property {string} type       THE ENGINE'S OWN TOKEN — never reader prose
 * @property {ChronicleSource} source
 * @property {string|null} fromType
 * @property {string|null} toType
 * @property {string|null} reason
 * @property {number|null} severity
 * @property {string|null} outcomeId
 * @property {string|null} counterpartyId  the other party a row names, when it names one
 */

/**
 * @typedef {Object} RelationshipChronicleRow  one edge's whole recorded life
 * @property {string} relationshipKey
 * @property {string} from
 * @property {string} to
 * @property {string} relationshipType  the PRESENT type token
 * @property {string|null} posture      the persisted posture token, when stamped
 * @property {string|null} postureLabel the persisted authored posture phrase
 * @property {ChronicleLine[]} lines    newest first
 * @property {number} lineCount
 * @property {number|null} firstTick
 * @property {number|null} lastTick
 */

/**
 * THE RELATIONSHIP KEY for a graph edge — a LOCAL COPY of
 * worldPulse/relationshipState.js `relationshipKeyFromEdge`, pinned against it in
 * the test (the chronicleReadModel season-constitution precedent: a display
 * sidecar keeps its own copy rather than importing the engine chunk).
 *
 * ⛔ AND NOTE WHAT IT MEANS: when the edge carries an `id`, the key IS that id and
 * is NOT a parseable pair. Nothing downstream may derive settlement names from
 * this string; the names come from the edge's own from/to, which is why this
 * function's callers keep the edge and not just its key.
 * @param {unknown} edge @returns {string}
 */
export function relationshipKeyOf(edge) {
  const e = obj(edge);
  if (e.id) return String(e.id);
  const from = e.from || e.source || e.a || 'unknown-a';
  const to = e.to || e.target || e.b || 'unknown-b';
  return `rel.${from}.${to}`;
}

/**
 * The outcomes a collapsed advance record contributes — a LOCAL COPY of
 * worldPulse/pulseHelpers.js `outcomesForMechanicalHistory` (consequenceOutcomes
 * when present, else selectedOutcomes), pinned against it in the test.
 * @param {unknown} record @returns {Record<string, unknown>[]}
 */
function mechanicalOutcomesOf(record) {
  const r = obj(record);
  const rows = Array.isArray(r.consequenceOutcomes) ? r.consequenceOutcomes : arr(r.selectedOutcomes);
  return rows.map(obj);
}

/**
 * THE APPLIED-OUTCOME MARKERS (relationshipMemory's honest-memory rule, S3). A
 * proposal-mode outcome counts ONLY when something recorded that it was applied:
 * the proposal row stamped `applied`, or an archive row carrying its outcome id.
 * Auto outcomes apply at selection and need no marker.
 * @param {Record<string, unknown>} worldState
 * @param {Record<string, unknown>} relState
 * @returns {Set<string>}
 */
function appliedMarkersFor(worldState, relState) {
  /** @type {Set<string>} */
  const marks = new Set();
  for (const p of arr(worldState.proposals)) {
    const row = obj(p);
    const id = textOrNull(obj(row.outcome).id);
    if (row.status === 'applied' && id) marks.add(id);
  }
  for (const store of ['recentIncidents', 'hierarchyResolutions', 'turningPoints', 'history']) {
    for (const r of arr(relState[store])) {
      const id = textOrNull(obj(r).outcomeId);
      if (id) marks.add(id);
    }
  }
  return marks;
}

/**
 * One archive row as a chronicle line, or null when the row carries no type at
 * all (a shape that cannot be said honestly is dropped rather than guessed).
 * @param {unknown} raw @param {ChronicleSource} source @param {string} [fallbackType]
 * @returns {ChronicleLine|null}
 */
function lineFromArchiveRow(raw, source, fallbackType = '') {
  const r = obj(raw);
  const type = textOrNull(r.type) || fallbackType;
  if (!type) return null;
  const tick = tickOf(r.tick);
  const outcomeId = textOrNull(r.outcomeId);
  return {
    id: outcomeId ? `outcome:${outcomeId}` : `${source}:${tick == null ? 'undated' : tick}:${type}`,
    tick,
    type,
    source,
    fromType: textOrNull(r.fromType),
    toType: textOrNull(r.toType),
    reason: textOrNull(r.reason),
    severity: Number.isFinite(r.severity) ? Number(r.severity) : null,
    outcomeId,
    counterpartyId: textOrNull(r.thirdPartyId),
  };
}

/**
 * THE DEDUPE, which is the load-bearing half of this model. One world event
 * lands in up to three stores; each must appear ONCE. A row claims every
 * identity it can prove — the outcome id first, then (tick, type) — and a later
 * store whose row matches ANY already-claimed identity is dropped. Store order
 * is relationshipMemory's, for its reason: the richest record of an event claims
 * it before a thinner duplicate can.
 */
class LineLedger {
  constructor() {
    /** @type {ChronicleLine[]} */
    this.lines = [];
    /** @type {Set<string>} */
    this.seen = new Set();
  }

  /** @param {ChronicleLine|null} line @param {(string|null)[]} identities */
  add(line, identities) {
    if (!line) return;
    const keys = identities.filter(Boolean).map(String);
    if (keys.some((k) => this.seen.has(k))) return;
    for (const k of keys) this.seen.add(k);
    this.lines.push(line);
  }
}

/** The (tick, type) join identity, or null when the row cannot prove one.
 *  @param {number|null} tick @param {string|null} type @returns {string|null} */
const joinId = (tick, type) => (tick != null && type ? `join:${tick}:${type}` : null);

/**
 * Every dated thing recorded against ONE relationship edge, newest first, each
 * event exactly once, with NO decay window.
 * @param {Object} args
 * @param {Record<string, unknown>} args.worldState
 * @param {string} args.relationshipKey
 * @param {Record<string, unknown>} args.relState
 * @returns {ChronicleLine[]}
 */
export function relationshipLines({ worldState, relationshipKey, relState }) {
  const ledger = new LineLedger();
  const applied = appliedMarkersFor(worldState, relState);

  // 1 — THE PULSE RECORD. Richest identity (it alone carries both the incident
  // identity and the label payload), so it claims first.
  for (const record of arr(worldState.pulseHistory)) {
    const recordTick = tickOf(obj(record).tick);
    for (const o of mechanicalOutcomesOf(record)) {
      if (String(o.relationshipKey ?? '') !== relationshipKey) continue;
      const id = textOrNull(o.id);
      // S3 honest memory: a question the pulse asked is not a thing that happened.
      if (o.applyMode === 'proposal' && !(id && applied.has(id))) continue;
      const payload = obj(o.proposalPayload);
      const incidentType = textOrNull(obj(o.metadata).incidentType) || textOrNull(o.candidateType);
      const type = incidentType || textOrNull(o.type);
      if (!type) continue;
      const tick = tickOf(o.tick) ?? recordTick;
      ledger.add({
        id: id ? `outcome:${id}` : `pulse:${tick == null ? 'undated' : tick}:${type}`,
        tick,
        type,
        source: 'pulse',
        fromType: textOrNull(payload.fromType),
        toType: textOrNull(payload.toType),
        reason: textOrNull(payload.reason) || textOrNull(o.summary) || textOrNull(o.headline),
        severity: Number.isFinite(o.severity) ? Number(o.severity) : null,
        outcomeId: id,
        counterpartyId: null,
      }, [
        id ? `outcome:${id}` : null,
        joinId(tick, incidentType),
        // A label change also writes a history row typed 'label_proposal_applied'
        // at the same tick; the exclusive label conflict tag guarantees at most one
        // per relationship per tick, so the pair is unambiguous.
        payload.kind === 'relationship_label_change' ? joinId(tick, 'label_proposal_applied') : null,
      ]);
    }
  }

  // 2..5 — THE FOUR TYPE-BEARING PER-EDGE STORES, in relationshipMemory's order.
  /** @type {Array<[string, ChronicleSource, string]>} */
  const stores = [
    ['recentIncidents', 'incident', ''],
    ['hierarchyResolutions', 'hierarchy', 'hierarchy_resolution'],
    ['turningPoints', 'turning-point', ''],
    ['history', 'history', ''],
  ];
  for (const [field, source, fallbackType] of stores) {
    for (const raw of arr(relState[field])) {
      const line = lineFromArchiveRow(raw, source, fallbackType);
      ledger.add(line, line ? [line.outcomeId ? `outcome:${line.outcomeId}` : null, joinId(line.tick, line.type)] : []);
    }
  }

  // 6 — ALLIANCE CALLS. Their own closed identity (`callId`), so they can never
  // collide with an outcome id — and a REFUSED SUMMONS IS A DIPLOMATIC FACT the
  // rolling incident window would have evicted.
  for (const raw of arr(relState.allianceCalls)) {
    const r = obj(raw);
    const callId = textOrNull(r.callId);
    const decision = r.decision === 'joined' || r.decision === 'refused' ? r.decision : null;
    if (!callId || !decision) continue;
    ledger.add({
      id: `call:${callId}`,
      tick: tickOf(r.tick),
      type: `alliance_call_${decision}`,
      source: 'alliance-call',
      fromType: null,
      toType: null,
      reason: null,
      severity: null,
      outcomeId: null,
      counterpartyId: textOrNull(r.enemyId),
    }, [`call:${callId}`]);
  }

  // 7 — COALITION SETTLEMENTS. Same reasoning, own closed identity (`actionId`):
  // who paid, who owed, who forgave is a diplomatic fact, not a rolling incident.
  for (const raw of arr(relState.coalitionSettlements)) {
    const r = obj(raw);
    const actionId = textOrNull(r.actionId);
    const action = textOrNull(r.action);
    const status = textOrNull(r.status);
    if (!actionId || !action || !status) continue;
    ledger.add({
      id: `settlement:${actionId}`,
      tick: tickOf(r.tick),
      type: `coalition_${action}_${status}`,
      source: 'coalition-settlement',
      fromType: null,
      toType: null,
      reason: null,
      severity: null,
      outcomeId: null,
      counterpartyId: textOrNull(r.toId),
    }, [`settlement:${actionId}`]);
  }

  // NEWEST FIRST. An undated row sorts oldest (it cannot claim a place in time),
  // and the row id is the total-order tie-break so the result is byte-stable
  // whatever order the stores arrived in.
  return ledger.lines.sort((a, b) => (b.tick ?? -1) - (a.tick ?? -1) || byStr(a.id, b.id));
}

/**
 * THE CHRONICLE: one row per relationship edge that has anything recorded,
 * newest-history-first. An edge with no recorded line is omitted entirely — a
 * dormant relationship is not news, and a realm with none yields [] (the
 * byte-identical off-state).
 * @param {Object} [args]
 * @param {unknown} [args.worldState]
 * @param {unknown} [args.regionalGraph]  the edges; `worldState.regionalGraph` is
 *   used when this is absent, matching every other map surface's resolution
 * @returns {RelationshipChronicleRow[]}
 */
export function relationshipChronicle({ worldState, regionalGraph } = {}) {
  const ws = obj(worldState);
  const states = obj(ws.relationshipStates);
  const graph = obj(regionalGraph ?? ws.regionalGraph);
  /** @type {RelationshipChronicleRow[]} */
  const rows = [];
  /** @type {Set<string>} */
  const done = new Set();
  for (const rawEdge of arr(graph.edges)) {
    const edge = obj(rawEdge);
    const relationshipKey = relationshipKeyOf(edge);
    if (done.has(relationshipKey)) continue;
    done.add(relationshipKey);
    const from = textOrNull(edge.from ?? edge.source ?? edge.a);
    const to = textOrNull(edge.to ?? edge.target ?? edge.b);
    if (!from || !to) continue;
    const relState = obj(states[relationshipKey]);
    const lines = relationshipLines({ worldState: ws, relationshipKey, relState });
    if (lines.length === 0) continue;
    const memory = obj(relState.relationshipMemory);
    const ticks = lines.map((l) => l.tick).filter((t) => t != null).map(Number);
    rows.push({
      relationshipKey,
      from,
      to,
      relationshipType: textOrNull(relState.relationshipType) || 'neutral',
      // The posture WORDS are the engine's own authored phrases, read off the blob
      // refreshRelationshipMemory stamps every pulse. Null on a legacy save that
      // predates the stamp — the surface then says only what it can prove.
      posture: textOrNull(relState.posture) || textOrNull(memory.posture),
      postureLabel: textOrNull(memory.postureLabel),
      lines,
      lineCount: lines.length,
      firstTick: ticks.length ? Math.min(...ticks) : null,
      lastTick: ticks.length ? Math.max(...ticks) : null,
    });
  }
  // The longest-lived relationships lead; the key is the codepoint tie-break, so
  // the order never depends on the order the graph happened to list its edges.
  return rows.sort((a, b) => b.lineCount - a.lineCount || byStr(a.relationshipKey, b.relationshipKey));
}

/**
 * Whether any relationship in this world has a recorded history — the surface's
 * populated gate, so a young realm renders NOTHING rather than an empty heading.
 * @param {unknown} [worldState] @param {unknown} [regionalGraph] @returns {boolean}
 */
export function hasRelationshipChronicle(worldState, regionalGraph) {
  return relationshipChronicle({ worldState, regionalGraph }).length > 0;
}
