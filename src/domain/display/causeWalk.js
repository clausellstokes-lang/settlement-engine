/**
 * domain/display/causeWalk.js — THE CAUSE-WALK read model (VISION WAVE V-4).
 * "Click the coup, find the famine": from any chronicle receipt, walk the recorded
 * provenance DAG BACKWARD, each hop carrying its receipt, down to the roots.
 *
 * Receipts culture as an EXPERIENCE. Pure, view-time, zero-write: reads only the
 * durable `worldState.spatialLedgers.provenance` ledger (the recorded cause-edges,
 * keyed receiptId → { parents, type, tick }) + `worldState.pulseHistory[]` (to
 * resolve a receipt id to its persisted headline/tick). NEVER imports the engine
 * writer (the zero-engine-contact law). Absent ledger ⇒ ledgerDark ⇒ the graceful
 * line — byte-inert to a world that never lit provenanceLedgerEnabled.
 *
 * ── THE SECRETS SEAM (no covert leak) ─────────────────────────────────────────
 * The ledger stores only ids+tick+type (no prose, no covert). The LEAK vector is
 * resolving a receipt id back to its pulseHistory headline: a covert cause
 * (corruption, a covert bloc/mobilizer) must not surface to a non-DM viewer. So:
 *   1. buildCauseWalk takes `seesSecrets`; when false, every covert hop is REDACTED
 *      (headline → a fixed placeholder; settlementIds → []) — the walk still shows
 *      the SHAPE of causality but never the hidden content.
 *   2. If the STARTING receipt is itself covert and the viewer is not a DM, the whole
 *      walk is gated (the affordance shows nothing but the redaction note).
 * The panel additionally self-gates to seesSecrets (a cause-walk is a DM tool); this
 * read-model redaction is defense-in-depth so the data never leaks even if rendered.
 *
 * @enforced-by tests/domain/causeWalk.test.js (backward resolution over a lit DAG,
 *   root + absent-flag grace, and the secrets-seam no-leak pin).
 */

import { buildRecordedEdges, nodesFromRecord } from './chronicleGraph.js';
import { UNRECEIPTED_HOP } from './receiptClauseFloor.js';

/** The graceful line at a root cause AND at an absent ledger (the spec's phrasing). */
export const NO_DEEPER_MEMORY = 'The ledger holds no deeper memory of this.';
/** The distinct honest line when the world recorded no causality ledger at all. */
export const LEDGER_DARK_LINE = 'This world keeps no recorded ledger of causes.';
/**
 * What a covert hop reads as to a viewer who does not see DM secrets. This one
 * stays HERE, beside the redaction that produces it, because a covert hop is
 * additionally marked STRUCTURALLY (`redacted:true`) and every consumer reads the
 * boolean. The UNRECEIPTED line has no such marker — nothing but the string says
 * "no receipt was found" — so it lives in `receiptClauseFloor.js` with the other
 * placeholder clauses, where the composer's guard can bind to it without reaching
 * through this read model.
 */
export const REDACTED_HOP = 'a cause the ledger keeps hidden';

/**
 * Whether a raw receipt carries a covert marker. The durable receipt drops the
 * top-level `covert` flag, but covert markers survive inside cloned payloads
 * (metadata / proposalPayload / stressor / institutionPatch) — the corruption/
 * covert-bloc surfaces. Checked defensively (the visibilityAudit precedent).
 * @param {unknown} raw
 * @returns {boolean}
 */
export function receiptIsCovert(raw) {
  if (!raw || typeof raw !== 'object') return false;
  const r = /** @type {Record<string, unknown>} */ (raw);
  if (r.covert === true) return true;
  for (const nest of ['metadata', 'proposalPayload', 'stressor', 'institutionPatch']) {
    const v = r[nest];
    if (v && typeof v === 'object' && /** @type {Record<string, unknown>} */ (v).covert === true) return true;
  }
  return false;
}

/**
 * The provenance ledger off a worldState (recorded cause-edges), or undefined.
 * Plain read of the Phase-5.5 conditional ledger family — no engine import.
 * @param {unknown} worldState
 * @returns {Record<string, { parents?: ReadonlyArray<string>, type?: string, tick?: number }>|undefined}
 */
function provenanceOf(worldState) {
  const ws = worldState && typeof worldState === 'object' ? /** @type {Record<string, unknown>} */ (worldState) : null;
  const ledgers = ws && ws.spatialLedgers && typeof ws.spatialLedgers === 'object'
    ? /** @type {Record<string, unknown>} */ (ws.spatialLedgers) : null;
  const prov = ledgers ? ledgers.provenance : undefined;
  return prov && typeof prov === 'object' && !Array.isArray(prov)
    ? /** @type {Record<string, { parents?: ReadonlyArray<string>, type?: string, tick?: number }>} */ (prov)
    : undefined;
}

/**
 * A resolved receipt (the display atoms a hop shows).
 * @typedef {Object} ResolvedReceipt
 * @property {string} headline
 * @property {number|null} tick
 * @property {string} type
 * @property {string[]} settlementIds
 * @property {boolean} covert
 * @property {string[]} lineageIds   the telling lineages the receipt already carries
 * @property {number} accuracy01     1 when the record measured no drift
 */

/**
 * THE RECORDED EDGE TYPE of one receipt — its OWN structural type, read verbatim
 * off the provenance ledger row keyed by its id (`{ parents, type, tick }`).
 *
 * WHY THIS IS A SEPARATE FIELD FROM `type` (chair ruling CR-HR-F4). A resolved
 * hop's `type` is `dramaClass || kind` — the CHRONICLE's eight-class display
 * taxonomy, computed by `dramaClassForNode` from `stressor.type` / `candidateType`
 * / `ruleFamily`, which never reads the receipt's own `type` at all. So a
 * `plant_exposed` outcome resolves as `'outcome'`, and every consumer reading a
 * hop's `type` as an EDGE type was reading a display class instead. The Herald's
 * type-warranted connective pools (exposed / refused / breached / dissolved) were
 * therefore unreachable from the shipped walk: the vocabulary existed, the corpus
 * shipped, and no live hop could ever license it.
 *
 * The ledger already holds the honest answer — `provenanceKernel.typeOf` records
 * the outcome's `type ?? candidateType ?? impactKind` — so this is a DERIVED READ,
 * never a new persisted shape and never a writer. A receipt with no ledger row of
 * its own (a root cause, named only as its children's parent) has no recorded type
 * and reads `null`, which is honest: the walk genuinely does not know.
 * @param {{ type?: string }|undefined} ledgerEntry
 * @returns {string|null}
 */
function recordedTypeOf(ledgerEntry) {
  const t = ledgerEntry && typeof ledgerEntry.type === 'string' ? ledgerEntry.type.trim() : '';
  return t || null;
}

/**
 * THE INTEGRITY ATOMS a receipt already carries — read, never derived. The
 * causality popup's manipulation disclosure classifies a link from these two
 * persisted fields plus the disinfo ledger; without them every link would fall
 * to UNKNOWN and the disclosure could never tell the truth it holds. Both are
 * plain reads off the same raw record the headline comes from, and both are
 * ABSENT-SAFE: a receipt that carries neither reads as an undrifted telling with
 * no lineage, which is exactly what an ordinary engine receipt is.
 * @param {unknown} raw
 * @returns {{ lineageIds: string[], accuracy01: number }}
 */
function integrityAtomsOf(raw) {
  const r = raw && typeof raw === 'object' ? /** @type {Record<string, unknown>} */ (raw) : {};
  const lineage = Array.isArray(r.lineageIds)
    ? r.lineageIds.map(String)
    : (typeof r.lineageId === 'string' && r.lineageId ? [r.lineageId] : []);
  const accuracy = typeof r.accuracy01 === 'number' && Number.isFinite(r.accuracy01) ? r.accuracy01 : 1;
  return { lineageIds: lineage, accuracy01: accuracy };
}

/**
 * Build receiptId → resolved display, indexed across every pulseHistory record.
 * @param {unknown} worldState
 * @returns {Map<string, ResolvedReceipt>}
 */
function buildReceiptIndex(worldState) {
  /** @type {Map<string, ResolvedReceipt>} */
  const index = new Map();
  const ws = worldState && typeof worldState === 'object' ? /** @type {Record<string, unknown>} */ (worldState) : null;
  const history = ws && Array.isArray(ws.pulseHistory) ? ws.pulseHistory : [];
  for (const record of history) {
    const tick = record && typeof record === 'object' && Number.isFinite(/** @type {Record<string, unknown>} */ (record).tick)
      ? Number(/** @type {Record<string, unknown>} */ (record).tick) : null;
    for (const node of nodesFromRecord(/** @type {import('./chronicleGraph.js').PulseRecord} */ (record))) {
      if (index.has(node.nodeId)) continue;
      index.set(node.nodeId, {
        headline: node.headline,
        tick,
        type: node.dramaClass || node.kind,
        settlementIds: node.settlementIds,
        covert: receiptIsCovert(node.raw),
        ...integrityAtomsOf(node.raw),
      });
    }
  }
  return index;
}

/**
 * One backward hop toward the causes.
 * @typedef {Object} CauseHop
 * @property {string} id
 * @property {number} depth          1 = a direct parent of the root, 2 = its parent, …
 * @property {string} headline
 * @property {number|null} tick
 * @property {string} type          the CHRONICLE display class (`dramaClass || kind`)
 * @property {string|null} recordedType  the receipt's OWN recorded edge/reason type
 *   off its provenance-ledger row, or null when the ledger holds no row for it
 *   (a root cause) or the hop is redacted. See `recordedTypeOf`.
 * @property {string[]} settlementIds
 * @property {string[]} lineageIds   the telling lineages the receipt carries (empty when redacted)
 * @property {number} accuracy01     the drift the record measured (1 when none)
 * @property {boolean} redacted      true when a covert hop was hidden from this viewer
 */

/**
 * @typedef {Object} CauseWalk
 * @property {string} rootId
 * @property {ResolvedReceipt|null} root       the starting receipt (null when unresolved)
 * @property {boolean} ledgerDark              the world recorded no causality ledger
 * @property {boolean} atRoot                  the starting receipt has no recorded parents
 * @property {boolean} gated                   the start is covert and the viewer is not a DM
 * @property {CauseHop[]} chain                nearest → furthest backward
 * @property {string} graceLine                the honest line at a root / dark ledger ('' otherwise)
 */

/**
 * Resolve a receipt id to display atoms, redacting covert content for non-DM viewers.
 * @param {string} id
 * @param {Map<string, ResolvedReceipt>} index
 * @param {Record<string, { type?: string, tick?: number }>|undefined} ledger
 * @param {boolean} seesSecrets
 * @returns {ResolvedReceipt & { redacted: boolean, recordedType: string|null }}
 */
function resolveReceipt(id, index, ledger, seesSecrets) {
  const found = index.get(id);
  const ledgerEntry = ledger ? ledger[id] : undefined;
  const covert = found ? found.covert : false;
  if (covert && !seesSecrets) {
    // A covert hop's LINEAGE is content too: it names the telling a planter
    // seeded. Redaction strips it with the rest, so a non-DM viewer cannot infer
    // a plant from a field the headline no longer carries. The RECORDED TYPE goes
    // with it for the same reason: `plant_exposed` names what the hidden receipt
    // WAS, and a reader who can infer the kind of the thing has been told part of
    // it. `type:'hidden'` is the whole answer a non-DM viewer gets.
    return { headline: REDACTED_HOP, tick: found ? found.tick : (ledgerEntry?.tick ?? null), type: 'hidden', recordedType: null, settlementIds: [], covert: true, lineageIds: [], accuracy01: 1, redacted: true };
  }
  if (found) return { ...found, recordedType: recordedTypeOf(ledgerEntry), redacted: false };
  // A parent not in pulseHistory (e.g. a root sourceEventId): fall back to the
  // ledger's structural type — the honest UNRECEIPTED_HOP line, never invented prose.
  return {
    headline: UNRECEIPTED_HOP,
    tick: ledgerEntry && Number.isFinite(ledgerEntry.tick) ? Number(ledgerEntry.tick) : null,
    type: ledgerEntry?.type || 'event',
    recordedType: recordedTypeOf(ledgerEntry),
    settlementIds: [],
    covert: false,
    lineageIds: [],
    accuracy01: 1,
    redacted: false,
  };
}

/**
 * Trace the causes of a chronicle receipt: a deterministic backward BFS over the
 * recorded provenance DAG, nearest causes first.
 * @param {Object} args
 * @param {unknown} args.worldState
 * @param {string} args.rootId          the receipt id to trace back from
 * @param {boolean} [args.seesSecrets]  true ⇒ DM view (covert hops shown); default false
 * @returns {CauseWalk}
 */
export function buildCauseWalk({ worldState, rootId, seesSecrets = false }) {
  const id = String(rootId);
  const provenance = provenanceOf(worldState);
  const edges = buildRecordedEdges(provenance);
  const index = buildReceiptIndex(worldState);

  const rootResolvedFull = index.get(id) || null;
  const rootCovert = rootResolvedFull ? rootResolvedFull.covert : false;

  // Gate: a covert START receipt is hidden entirely from a non-DM viewer.
  if (rootCovert && !seesSecrets) {
    return {
      rootId: id,
      root: { headline: REDACTED_HOP, tick: rootResolvedFull ? rootResolvedFull.tick : null, type: 'hidden', settlementIds: [], covert: true, lineageIds: [], accuracy01: 1 },
      ledgerDark: edges.size === 0,
      atRoot: true,
      gated: true,
      chain: [],
      graceLine: NO_DEEPER_MEMORY,
    };
  }

  const root = rootResolvedFull ? { ...rootResolvedFull } : null;

  if (edges.size === 0) {
    return { rootId: id, root, ledgerDark: true, atRoot: true, gated: false, chain: [], graceLine: LEDGER_DARK_LINE };
  }

  // Backward level-order BFS over parentsOf. Deterministic: parents sorted within
  // each frontier; a node is visited once (cycle-safe).
  /** @type {CauseHop[]} */
  const chain = [];
  const seen = new Set([id]);
  let frontier = [id];
  let depth = 1;
  while (frontier.length) {
    /** @type {string[]} */
    const nextParents = [];
    for (const cur of frontier) {
      const parents = edges.parentsOf.get(cur);
      if (!parents) continue;
      for (const p of parents) if (!seen.has(p)) { seen.add(p); nextParents.push(p); }
    }
    if (nextParents.length === 0) break;
    nextParents.sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
    for (const pid of nextParents) {
      const r = resolveReceipt(pid, index, provenance, seesSecrets);
      chain.push({ id: pid, depth, headline: r.headline, tick: r.tick, type: r.type, recordedType: r.recordedType, settlementIds: r.settlementIds, lineageIds: r.lineageIds, accuracy01: r.accuracy01, redacted: r.redacted });
    }
    frontier = nextParents;
    depth += 1;
  }

  const atRoot = chain.length === 0;
  return {
    rootId: id,
    root,
    ledgerDark: false,
    atRoot,
    gated: false,
    chain,
    graceLine: atRoot ? NO_DEEPER_MEMORY : '',
  };
}
