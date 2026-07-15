/**
 * domain/events/resolveStressorEventSeverity.js — Stamp a DERIVED onset
 * severity onto an APPLY_STRESSOR event whose DM did not pick one.
 *
 * Severity is a CONSEQUENCE of the settlement's preexisting state (see
 * deriveStressorSeverity), not a number authored at the table. But three
 * independent sites read `event.payload.severity` — the registry's
 * APPLY_STRESSOR.stateDeltas, the domain crisisOnset, and the roaming-twin
 * twinDirectiveForEvent — and they MUST agree (the crisis-triple invariant).
 *
 * Resolving once here and stamping the number onto a cloned event means all
 * three read the SAME value without re-deriving against a possibly-mutated
 * settlement (the twin path has no settlement of its own). The pipeline calls
 * this at its single chokepoint and threads the resolved event forward; the
 * store logs and twin-directives that same resolved event.
 *
 * Back-compat: an explicitly-authored `payload.severity` is returned untouched
 * (`?? `, never `||`, so a deliberate 0 survives) — every test that pins a
 * specific severity passes it explicitly and is unaffected. Non-APPLY_STRESSOR
 * events pass through unchanged.
 *
 * Pure — no store, no rng, no timestamps.
 */

import { deriveOnsetSeverity } from '../state/deriveStressorSeverity.js';

/** @typedef {import('../types.js').Event} Event */

/**
 * @param {Object} settlement — the BEFORE settlement the consequence derives from
 * @param {Event} event
 * @returns {Event} the event, or a clone with `payload.severity` derived in.
 */
export function resolveStressorEventSeverity(settlement, event) {
  if (!event || event.type !== 'APPLY_STRESSOR') return event;
  const payload = /** @type {{ severity?: number }} */ (event.payload || {});
  if (payload.severity != null) return event;
  const severity = deriveOnsetSeverity(settlement);
  return { ...event, payload: { ...payload, severity } };
}
