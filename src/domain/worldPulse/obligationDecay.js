import { foldObligations, REACTION_TUNING } from '../spatial/generosityReactions.js';
import { getSpatialLedger, setSpatialLedger, dropSpatialLedger } from '../spatial/distanceRead.js';

/**
 * The single unconditional per-tick obligation-decay owner. Mutation movers
 * must call foldObligations with decayPerTick:0 so elapsed time is charged once.
 * @template {Record<string, unknown>} T
 * @param {T} worldState
 * @param {number} tick
 * @returns {T}
 */
export function advanceObligationDecay(worldState, tick) {
  const prior = getSpatialLedger(worldState, 'obligations');
  if (!prior) return worldState;
  const next = foldObligations(/** @type {Record<string, unknown>} */ (prior), {
    now: tick, decayPerTick: REACTION_TUNING.OBLIGATION_DECAY,
  });
  const advanced = next
    ? setSpatialLedger(worldState, 'obligations', next)
    : dropSpatialLedger(worldState, 'obligations');
  return /** @type {T} */ (advanced);
}
