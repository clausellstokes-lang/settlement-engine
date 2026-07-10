/**
 * stressorSeverity.js — leaf module for the per-settlement stressor severity read.
 *
 * Extracted out of stressors.js to BREAK an ESM import cycle:
 *   stressors.js → stressorGates.js → foodStockpile.js → stressors.js
 * foodStockpile only needed `effectiveStressorSeverity` from stressors, which is a
 * pure leaf (clamp01 + a min). Hoisting it here (a module that imports nothing from
 * worldPulse) lets foodStockpile and stressors both depend DOWNWARD on this leaf
 * instead of foodStockpile reaching back UP into stressors. No behavior change.
 */

/** Clamp to [0, 1]. VERBATIM copy of the former stressors.js clamp01 — a
 *  non-finite (incl. non-number) input becomes 0, then Math clamps. Kept
 *  byte-for-byte so the determinism golden master is unaffected.
 *  @param {number} value
 *  @returns {number} */
export function clamp01(value) {
  const n = Number.isFinite(value) ? value : 0;
  return Math.max(0, Math.min(1, n));
}

/**
 * The severity a stressor actually exerts on ONE settlement: the recorded global
 * severity, optionally tightened by a per-settlement override (the lower of the two).
 * @param {import('../settlement.schema.js').SimStressor} stressor
 * @param {string|number} saveId
 * @returns {number}
 */
export function effectiveStressorSeverity(stressor, saveId) {
  const recorded = clamp01(stressor?.severity ?? 0);
  const entry = stressor?.severityBySettlement?.[String(saveId)];
  return Number.isFinite(entry) ? Math.min(recorded, clamp01(entry)) : recorded;
}
