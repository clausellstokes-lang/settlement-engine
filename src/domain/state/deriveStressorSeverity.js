/**
 * domain/state/deriveStressorSeverity.js — A crisis onset's severity is a
 * CONSEQUENCE of the settlement's preexisting state, not a number the DM dials.
 *
 * The simulation philosophy is "outcomes derive from state": when a DM applies
 * a stressor, how hard it lands depends on how much the settlement can already
 * take. A calm, resilient town shrugs off a real-but-survivable onset; a town
 * already at the edge takes a hard one. deriveSystemState is the canonical
 * preexisting-pressure signal (a pure function of the settlement), so the onset
 * severity folds its four dimensions into one 0–1 number.
 *
 * Determinism: this is a pure function of deriveSystemState's output plus the
 * static weights below — no rng, no timestamps. The same settlement always
 * yields the same severity, which is what keeps the crisis triple (entry,
 * condition, roaming twin) agreeing.
 *
 * Range: 0.45–0.80. Deliberately narrow. Derivation never manufactures a
 * trivial non-event (the old 'minor' 0.35) or an instant catastrophe (above
 * 'severe' 0.85): a calm settlement bottoms out near 0.45 (just into moderate
 * territory), a maximally pressured one tops out near 0.80 (just under severe).
 *
 * Static fallback: a sparse settlement (early pipeline output, headless test)
 * derives all-default dimensions, which collapse `pressure` to a mid value and
 * yield ~0.55. If anything upstream goes non-finite, the explicit floor returns
 * 0.6 — the same default the consumers' `?? 0.6` always used.
 */

import { deriveSystemState } from './deriveSystemState.js';

/**
 * Clamp a 0..1 fraction to its bounds — local so this leaf imports only the derive.
 * @param {number} n
 * @returns {number}
 */
const clamp01frac = (n) => (n < 0 ? 0 : n > 1 ? 1 : n);

/** The static fallback severity — preserved verbatim from the old `?? 0.6`. */
export const STATIC_ONSET_SEVERITY = 0.6;

/** The derived-onset band: a calm settlement lands here, a pressured one at MAX. */
export const ONSET_SEVERITY_MIN = 0.45;
export const ONSET_SEVERITY_MAX = 0.80;

/**
 * Fold a settlement's preexisting pressure (low resilience + volatility +
 * external threat + resource pressure) into a single 0–1 onset severity.
 *
 * Weights bias toward resilience — the engine's own "shocks are absorbed" axis
 * (BAND_HINT.Stable) — because it is the most direct reading of whether the
 * settlement can take a hit. The remaining weight splits across the three
 * "bad-when-high" dimensions.
 *
 * @param {Object} settlement — the engine's settlement object (tolerant of sparse input)
 * @returns {number} onset severity in [0.45, 0.80]; the static 0.6 floor on a non-finite derive.
 */
export function deriveOnsetSeverity(settlement) {
  let ss;
  try {
    ss = deriveSystemState(settlement);
  } catch {
    return STATIC_ONSET_SEVERITY;
  }
  const resilience       = Number(ss?.resilience?.value);
  const volatility       = Number(ss?.volatility?.value);
  const externalThreat   = Number(ss?.externalThreat?.value);
  const resourcePressure = Number(ss?.resourcePressure?.value);
  if (![resilience, volatility, externalThreat, resourcePressure].every(Number.isFinite)) {
    return STATIC_ONSET_SEVERITY;
  }

  // pressureLoad in 0..1: how stressed the settlement ALREADY is. Low resilience
  // raises it (the settlement cannot absorb the shock); the three pressure dials
  // raise it directly.
  const pressure = clamp01frac((
    (100 - resilience)   * 0.40
    + volatility         * 0.25
    + externalThreat     * 0.20
    + resourcePressure   * 0.15
  ) / 100);

  const span = ONSET_SEVERITY_MAX - ONSET_SEVERITY_MIN;
  const severity = ONSET_SEVERITY_MIN + pressure * span;
  if (!Number.isFinite(severity)) return STATIC_ONSET_SEVERITY;
  // Round to 2 places — the same granularity DM-picked severities used, so the
  // derived number reads cleanly in the dossier and the triple compares exactly.
  return Math.round(severity * 100) / 100;
}

/**
 * Resolve an APPLY_STRESSOR event's onset severity: an explicitly-authored
 * `payload.severity` always wins (back-compat — every test that pins a specific
 * severity passes it explicitly); only an ABSENT severity is derived from the
 * BEFORE settlement's preexisting pressure.
 *
 * `?? `, never `||`: a deliberate `payload.severity = 0` is present-and-zero,
 * not absent, and must not trigger derivation.
 *
 * @param {Object} settlement — the BEFORE settlement the consequence derives from
 * @param {{ payload?: { severity?: number } }} event
 * @returns {number} the resolved onset severity in [0, 1].
 */
export function resolveOnsetSeverity(settlement, event) {
  const authored = event?.payload?.severity;
  if (authored != null) {
    const n = Number(authored);
    return Number.isFinite(n) ? Math.max(0, Math.min(1, n)) : STATIC_ONSET_SEVERITY;
  }
  return deriveOnsetSeverity(settlement);
}
