/**
 * domain/worldPulse/stablePart.js — the canonical world-pulse id slug.
 *
 * A TRUE dependency-free leaf (the domain/deityConstants.js pattern). Extracted
 * from worldState.js so the tier-outcome applier leaf (tierOutcomeApply.js —
 * statically reachable from the eager event-mutation router via SHIFT_TIER) can
 * mint the SAME `institution.<slug>` ids the sim mints WITHOUT dragging
 * worldState.js (+ simulationRules/clock/clone) into the first-paint closure.
 *
 * worldState.js imports + re-exports this verbatim, so every sim consumer is
 * unchanged and the slug stays single-sourced: an id minted by the eager
 * SHIFT_TIER handler and one minted by the lazy pulse are byte-identical.
 */

/** @param {any} value */
export function stablePart(value) {
  return String(value || 'unknown')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 80) || 'unknown';
}
