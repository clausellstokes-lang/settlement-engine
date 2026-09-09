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

// clamp01 is the kernel primitive (code-quality-4). The former local copy — a
// VERBATIM copy of the old stressors.js clamp01 (non-finite → 0, then Math clamps)
// — is byte-identical to it over every input (parity-proven in
// tests/kernel/clampPrimitive.parity.test.js), so the determinism golden master
// is unaffected. Imported (not just re-exported) so this module's own callers
// below keep a local binding; re-exported so stressors.js still imports it here.
import { clamp01 } from '../../kernel/math.js';
export { clamp01 };

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
