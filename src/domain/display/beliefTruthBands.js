/**
 * domain/display/beliefTruthBands.js — THE DISPLAY-SAFE BANDED TRUTH PROVIDER
 * (FP IN-6 U3; DESIGN_FP_INFORMATION.md §5 IN-6 "the strength-axis gap closes";
 * J-INF-11; DESIGN_FP_ARCH_IN.md S27).
 *
 * WHAT IT COMPLETES. BeliefDivergenceBand v1 shipped the belief WITHOUT its truth:
 * settlementBeliefs reports where a belief is wrong only when the caller supplies a
 * `truthOf`, and the strength truth is engine math (settlementStrength over the live
 * pressure index), so the v1 header refused to rebuild it in the display layer (the
 * two-writer hazard). This module is that provider, built so the refusal still holds:
 * it re-derives NOTHING. It composes the engine's own one-home functions, in the order
 * the belief advance composes them:
 *   buildWorldSnapshot            the snapshot every kernel reads (worldSnapshot.js)
 *   deriveSettlementPressures +   the pressure index settlementStrength reads
 *     pressureIndex               (pressureModel.js)
 *   relationshipNeighbourhood     the TRUE observer to subject label (beliefMap.js)
 *   groundTruthBelief             the record a fully informed observer would hold,
 *                                 the same one the cold start seeds (beliefMap.js)
 * and projects only that record's BANDS: the integer strength band, the posture
 * readiness anchor, the relationship label, the public faith name. Never the raw
 * ground truth (no strength score, no pressure, no confidence), so what reaches the
 * DM is a band to set beside the believed band, which is the display-safe half of
 * J-INF-11. The parity pin (tests/domain/beliefTruthBands.test.js) holds these bands
 * equal to the engine's own cold-start seed on a fixture corpus, so a silent fork of
 * the assembly reds.
 *
 * AUDIENCE. DM truth: premium or elevated only, by the includeGroundTruth convention.
 * The player call (the default) answers null and builds nothing, so no truth is even
 * computed for a viewer who may not see it (fail-closed). A dormant world (no belief
 * map) answers null too, so the dark UI never pays for a snapshot.
 *
 * Pure: no store, no rng, no clock. Total on garbage (an absent campaign answers null).
 * CONSUMER: components/map/BeliefDivergenceBand.jsx (the divergence rows a DM reads).
 */

import { buildWorldSnapshot } from '../worldPulse/worldSnapshot.js';
import { deriveSettlementPressures, pressureIndex } from '../worldPulse/pressureModel.js';
import { groundTruthBelief, relationshipNeighbourhood } from '../worldPulse/beliefMap.js';
import { hasBeliefMaps } from './settlementBeliefs.js';

/** @typedef {import('./settlementBeliefs.js').SubjectTruth} SubjectTruth */
/** @typedef {import('../worldPulse/beliefMap.js').GroundTruthCtx} GroundTruthCtx */
/**
 * The campaign members this provider reads; the snapshot builder reads the rest.
 * @typedef {{ worldState?: { tick?: unknown, spatialLedgers?: unknown } | null, settlementIds?: unknown[], regionalGraph?: unknown }} BeliefCampaign
 */

/** @param {unknown} v @returns {number} */
function wholeTick(v) {
  return typeof v === 'number' && Number.isFinite(v) ? Math.max(0, Math.floor(v)) : 0;
}

/**
 * The DM's truth provider for one campaign: observer id to a `truthOf` for
 * settlementBeliefs. Null for a player viewer or a dormant world.
 *
 * Per subject: null when the realm does not carry that settlement (no truth is
 * claimed about a place the snapshot cannot see). The relationship label is present
 * only when the observer's declared neighbourhood names the pair, because that is the
 * only true label the engine holds; elsewhere the axis is left out rather than filled
 * with the belief itself.
 *
 * @param {Object} [args]
 * @param {BeliefCampaign | null} [args.campaign]  the live campaign (settlementIds, regionalGraph, worldState)
 * @param {unknown[]} [args.saves]    the realm's settlement saves
 * @param {boolean} [args.includeGroundTruth]  DM/premium only; the default false answers null
 * @returns {((observerId: string) => ((subjectId: string) => SubjectTruth | null)) | null}
 */
export function beliefTruthProvider({ campaign = null, saves = [], includeGroundTruth = false } = {}) {
  if (includeGroundTruth !== true) return null; // player projection: no truth, fail-closed
  const worldState = campaign?.worldState;
  if (!hasBeliefMaps(worldState)) return null; // dormant: nothing to compare, nothing built
  const snapshot = buildWorldSnapshot({ campaign, saves, worldState });
  /** @type {GroundTruthCtx} */
  const ctx = {
    byId: snapshot.byId,
    pressureIdx: pressureIndex(deriveSettlementPressures(snapshot)),
    worldState: snapshot.worldState,
    axesActive: false,
    subjectAxes: null,
  };
  const neighbours = relationshipNeighbourhood(snapshot, snapshot.worldState);
  const now = wholeTick(snapshot.worldState?.tick);
  return (observerId) => (subjectId) => {
    const sid = String(subjectId);
    if (!snapshot.byId.has(sid)) return null;
    const label = neighbours.get(String(observerId))?.get(sid);
    const truth = groundTruthBelief(sid, label || 'unknown', ctx, now);
    /** @type {SubjectTruth} */
    const bands = {
      strengthBand: truth.strengthBand,
      readiness: truth.readiness,
      faithLabel: truth.faithLabel ?? null,
    };
    if (label) bands.allianceLabel = label;
    return bands;
  };
}
