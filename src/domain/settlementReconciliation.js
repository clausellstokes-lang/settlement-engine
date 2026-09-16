import { preserveWorldConditions, worldAuthoredConditions } from './worldPulse/reconcile.js';
import { preserveSettlementParentRef } from './settlementParentRef.js';

/** @typedef {import('./settlement.schema.js').CanonicalSettlement} CanonicalSettlement */
/** @typedef {import('./activeConditions.js').ActiveCondition} ActiveCondition */
/** @typedef {CanonicalSettlement & { reconciliationLog?: Object[] }} ReconcilableSettlement */

/**
 * @param {ActiveCondition | null | undefined} condition
 * @returns {string | null}
 */
function conditionId(condition) {
  return condition?.archetype || condition?.id || condition?.label || null;
}

/**
 * @param {unknown} value
 * @returns {string | null}
 */
function compactLabel(value) {
  const text = String(value || '').trim();
  return text ? text.slice(0, 160) : null;
}

/**
 * @param {ReconcilableSettlement | null | undefined} nextSettlement
 * @param {ReconcilableSettlement | null | undefined} priorSettlement
 * @param {{ now?: string, source?: string, changeType?: unknown, changeLabel?: unknown }} [options]
 * @returns {ReconcilableSettlement | null | undefined}
 */
export function reconcileSettlementChange(nextSettlement, priorSettlement, options = {}) {
  if (!nextSettlement || !priorSettlement) return nextSettlement;
  const carried = worldAuthoredConditions(/** @type {any} */ (priorSettlement)).map(conditionId).filter(Boolean);
  const reconciled = /** @type {ReconcilableSettlement} */ (
    preserveSettlementParentRef(
      preserveWorldConditions(nextSettlement, priorSettlement),
      priorSettlement,
    )
  );
  const entry = {
    // `at` is a deterministic, caller-supplied timestamp. When options.now is
    // omitted we record null rather than stamping wall-clock: a reconciliationLog
    // entry is persisted into settlement state, so a Date.now() here would make a
    // regenerated/replayed settlement differ byte-for-byte from its original
    // (breaking snapshot/replay determinism — the same property pendingEdits.js and
    // normalizeSettlement.js preserve by avoiding Math.random on the persist path).
    // Call sites that have a real apply instant (e.g. applyEvent threads
    // logEntry.appliedAt) pass options.now and keep a precise timestamp.
    at: options.now ?? null,
    source: options.source || 'settlement_change',
    changeType: compactLabel(options.changeType) || 'update',
    changeLabel: compactLabel(options.changeLabel),
    preservedWorldConditionIds: carried,
  };
  // A regeneration rebuilds the settlement from config, which carries no
  // receipts trail — fall back to the prior settlement's so chained what-ifs
  // accumulate entries instead of each erasing the last. An event-mutated
  // settlement inherits the trail by spread, so the fallback never
  // double-counts on the applyEvent path.
  const trail = Array.isArray(reconciled.reconciliationLog)
    ? reconciled.reconciliationLog
    : (Array.isArray(priorSettlement.reconciliationLog) ? priorSettlement.reconciliationLog : []);
  return {
    ...reconciled,
    reconciliationLog: [...trail.slice(-19), entry],
  };
}
