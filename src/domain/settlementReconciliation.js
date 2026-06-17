import { preserveWorldConditions, worldAuthoredConditions } from './worldPulse/reconcile.js';
import { wallClockNow } from './clock.js';

function conditionId(condition) {
  return condition?.archetype || condition?.id || condition?.label || null;
}

function compactLabel(value) {
  const text = String(value || '').trim();
  return text ? text.slice(0, 160) : null;
}

export function reconcileSettlementChange(nextSettlement, priorSettlement, options = {}) {
  if (!nextSettlement || !priorSettlement) return nextSettlement;
  const carried = worldAuthoredConditions(priorSettlement).map(conditionId).filter(Boolean);
  const reconciled = preserveWorldConditions(nextSettlement, priorSettlement);
  const entry = {
    at: options.now || wallClockNow(),
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
