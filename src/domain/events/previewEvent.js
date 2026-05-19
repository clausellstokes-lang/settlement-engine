/**
 * domain/events/previewEvent.js — Compute the consequences of an event
 * WITHOUT mutating anything.
 *
 * The user clicks "Burn the granary" → previewEvent runs → UI shows
 * "Resilience falls Stable→Strained, Resource Pressure rises Strained→
 * Vulnerable, Merchant Guild gains leverage." User clicks Confirm →
 * applyEvent commits exactly what the preview promised.
 *
 * Phase 18 (Tier 2.2): this is now a thin wrapper around
 * `runEventPipeline`. The pipeline is the single canonical flow shared
 * by previewEvent + applyEvent — the drift between "preview promised"
 * and "apply delivered" is eliminated by construction. The preview
 * discards the mutated settlement; apply persists it.
 *
 * Pure function — no store, no React, no side effects, no I/O.
 */

import { deriveSystemState } from '../state/deriveSystemState.js';
import { runEventPipeline } from './eventPipeline.js';

/** @typedef {import('../types.js').Event} Event */
/** @typedef {import('../types.js').SystemState} SystemState */
/** @typedef {import('../types.js').EventPreview} EventPreview */

/**
 * @param {Object} args
 * @param {Object} args.settlement       current settlement
 * @param {SystemState} args.systemState before-state
 * @param {Event}  args.event
 * @returns {EventPreview}
 */
export function previewEvent({ settlement, systemState, event }) {
  const result = runEventPipeline(settlement, event);
  // Note: we intentionally do NOT return result.nextSettlement here.
  // The mutated settlement carries `Date.now()` timestamps in
  // mutateSettlement impairments, which would break the "preview is
  // pure" determinism contract. Consumers that want the projected
  // settlement should call runEventPipeline directly.
  return {
    event: result.event,
    beforeState: systemState || result.beforeSystemState || deriveSystemState(settlement),
    afterState: result.afterSystemState,
    deltas: result.systemStateDeltas,
    factionResponses: result.factionResponses,
    narrativeSummary: result.narrativeSummary,
    affectedSteps: [],
    warnings: result.warnings,
    // Phase 18 additions — substrate + faction-delta access. These
    // don't carry timestamps so they're safe to expose on the legacy
    // pure-preview shape.
    causalStateDeltas: result.causalStateDeltas,
    factionRelationshipDeltas: result.factionRelationshipDeltas,
  };
}
