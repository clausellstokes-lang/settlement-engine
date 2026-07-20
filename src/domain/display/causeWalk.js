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

/** The graceful line at a root cause AND at an absent ledger (the spec's phrasing). */
export const NO_DEEPER_MEMORY = 'The ledger holds no deeper memory of this.';
/** The distinct honest line when the world recorded no causality ledger at all. */
export const LEDGER_DARK_LINE = 'This world keeps no recorded ledger of causes.';
/** What a covert hop reads as to a viewer who does not see DM secrets. */
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
 */

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
 * @property {string} type
 * @property {string[]} settlementIds
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
 * @returns {ResolvedReceipt & { redacted: boolean }}
 */
function resolveReceipt(id, index, ledger, seesSecrets) {
  const found = index.get(id);
  const ledgerEntry = ledger ? ledger[id] : undefined;
  const covert = found ? found.covert : false;
  if (covert && !seesSecrets) {
    return { headline: REDACTED_HOP, tick: found ? found.tick : (ledgerEntry?.tick ?? null), type: 'hidden', settlementIds: [], covert: true, redacted: true };
  }
  if (found) return { ...found, redacted: false };
  // A parent not in pulseHistory (e.g. a root sourceEventId): fall back to the
  // ledger's structural type — an honest "an earlier cause", never invented prose.
  return {
    headline: 'an earlier cause',
    tick: ledgerEntry && Number.isFinite(ledgerEntry.tick) ? Number(ledgerEntry.tick) : null,
    type: ledgerEntry?.type || 'event',
    settlementIds: [],
    covert: false,
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
      root: { headline: REDACTED_HOP, tick: rootResolvedFull ? rootResolvedFull.tick : null, type: 'hidden', settlementIds: [], covert: true },
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
      chain.push({ id: pid, depth, headline: r.headline, tick: r.tick, type: r.type, settlementIds: r.settlementIds, redacted: r.redacted });
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
