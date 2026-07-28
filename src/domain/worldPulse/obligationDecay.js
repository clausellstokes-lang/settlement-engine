import { foldObligations, REACTION_TUNING } from '../spatial/generosityReactions.js';
import { getSpatialLedger, setSpatialLedger, dropSpatialLedger } from '../spatial/distanceRead.js';

/**
 * The single unconditional per-tick obligation-decay owner. Mutation movers
 * must call foldObligations with decayPerTick:0 so elapsed time is charged once.
 * @param {any} worldState
 * @param {number} tick
 */
export function advanceObligationDecay(worldState, tick) {
  const prior = getSpatialLedger(worldState, 'obligations');
  if (!prior) return worldState;
  const next = foldObligations(/** @type {Record<string, unknown>} */ (prior), {
    now: tick, decayPerTick: REACTION_TUNING.OBLIGATION_DECAY,
  });
  return next
    ? setSpatialLedger(worldState, 'obligations', next)
    : dropSpatialLedger(worldState, 'obligations');
}
