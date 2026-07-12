/**
 * domain/worldPulse/scoringObjective.js — the DEFAULT scoring objective (Phase
 * 5.5 WAVE A, the scorer DOWN-PAYMENT, VI.3).
 *
 * The four move-utility formulas the settlement chooser (settlementStrategy.js
 * enumerateMoves) once inlined are LIFTED here into a single frozen descriptor —
 * the coefficients become DATA. This is the seam for Wave B's per-archetype
 * objective SETS + the new non-war move levers (M9); Wave A ships ONLY the
 * default, and enumerateMoves reconstructs the EXACT same arithmetic from it, so
 * the scores are BYTE-IDENTICAL (golden-pinned). NO objective parameterization
 * beyond the default this wave.
 *
 * The formulas (verbatim, for the reader — enumerateMoves builds these from the
 * fields below in the SAME operation order, so IEEE-754 bytes match):
 *   defend        = clamp01(base + (besieged ? besiegedBonus : 0)
 *                            + (0.5 − sStrength) × weaknessBonus − aggr × aggrDamp)
 *   hold          = clamp01(base − aggr × aggrDamp + exhaustion × exhaustionBonus)
 *   deploy        = clamp01(base + best × marginGain + aggr × aggrGain
 *                            − exhaustion × exhaustionDamp)
 *   sueForPeace   = clamp01(base + perceived × exhaustionGain − aggr × aggrDamp)
 *
 * PURE data leaf — zero imports, zero first-paint bytes (imported only by the
 * lazy chooser).
 */

/**
 * @typedef {Object} ScoringObjective
 * @property {{ base: number, besiegedBonus: number, weaknessBonus: number, aggrDamp: number }} defend
 * @property {{ base: number, aggrDamp: number, exhaustionBonus: number }} hold
 * @property {{ base: number, marginGain: number, aggrGain: number, exhaustionDamp: number }} deploy
 * @property {{ base: number, exhaustionGain: number, aggrDamp: number }} sueForPeace
 */

/** The default (governing-seat) objective — the coefficients extracted verbatim
 *  from the pre-Wave-A inlined formulas. @type {ScoringObjective} */
export const DEFAULT_SCORING_OBJECTIVE = Object.freeze({
  defend: Object.freeze({ base: 0.35, besiegedBonus: 0.4, weaknessBonus: 0.4, aggrDamp: 0.3 }),
  hold: Object.freeze({ base: 0.4, aggrDamp: 0.2, exhaustionBonus: 0.15 }),
  deploy: Object.freeze({ base: 0.3, marginGain: 0.6, aggrGain: 0.5, exhaustionDamp: 0.4 }),
  sueForPeace: Object.freeze({ base: 0.15, exhaustionGain: 0.6, aggrDamp: 0.4 }),
});
