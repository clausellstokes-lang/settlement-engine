import { preserveWorldConditions, worldAuthoredConditions } from './worldPulse/reconcile.js';

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
    at: options.now || new Date().toISOString(),
    source: options.source || 'settlement_change',
    changeType: compactLabel(options.changeType) || 'update',
    changeLabel: compactLabel(options.changeLabel),
    preservedWorldConditionIds: carried,
  };
  return {
    ...reconciled,
    reconciliationLog: [
      ...(Array.isArray(reconciled.reconciliationLog) ? reconciled.reconciliationLog.slice(-19) : []),
      entry,
    ],
  };
}
