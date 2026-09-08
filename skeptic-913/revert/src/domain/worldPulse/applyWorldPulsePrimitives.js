// applyWorldPulsePrimitives — the shape-level primitives of the apply pass: the deep
// clone, the affected-save fan-out for one outcome, the settlement change test and the
// save-like projection. Pure derivations that write no world state. Split verbatim out
// of applyWorldPulse.js by THE DECOMPOSITION WAVE (war tranche, file 4); every body here
// is byte-identical to its pre-split declaration.
import { deepClone } from '../clone.js';

export function clone(/** @type {any} */ value) {
  return value == null ? value : deepClone(value);
}

export function affectedSaveIdsForOutcome(/** @type {any} */ outcome) {
  const ids = new Set();
  for (const delta of outcome.populationDeltas || []) {
    if (delta?.saveId) ids.add(String(delta.saveId));
  }
  for (const delta of outcome.foodStockpileDeltas || []) {
    if (delta?.saveId) ids.add(String(delta.saveId));
  }
  if (outcome.targetSaveId && (outcome.condition || outcome.tierChange || outcome.resourcePatch || outcome.institutionPatch || outcome.powerTransfer || outcome.deityReembed || outcome.lifecyclePatch)) {
    ids.add(String(outcome.targetSaveId));
  }
  return [...ids];
}

export function settlementChanged(/** @type {any} */ beforeSettlement, /** @type {any} */ afterSettlement) {
  if (beforeSettlement === afterSettlement) return false;
  try {
    return JSON.stringify(beforeSettlement) !== JSON.stringify(afterSettlement);
  } catch {
    return true;
  }
}

export function saveLike(/** @type {any} */ entry, /** @type {any} */ settlement) {
  return {
    id: String(entry.saveId),
    name: entry.save?.name || settlement?.name || String(entry.saveId),
    settlement,
  };
}
