/**
 * domain/events/eventPipeline.js — Unified event preview/apply/derive flow.
 *
 * Tier 2.2 of the roadmap. Before Phase 18, `previewEvent` and
 * `applyEvent` ran on *different* code paths:
 *
 *   previewEvent: applyStateDeltas(beforeState, spec.stateDeltas(event))
 *   applyEvent:   deriveSystemState(mutateSettlement(settlement, event))
 *
 * The two could (and did) disagree — the preview promised one outcome,
 * the applied change produced another. This file collapses both into a
 * single canonical flow:
 *
 *   1. Validate the event against the registry
 *   2. Clone-and-mutate the settlement (mutateSettlement)
 *   3. Re-derive SystemState (4-dim UI surface) from the mutated clone
 *   4. Apply the registry's authored stateDeltas additively on top
 *      (this preserves the authored-effect surface that mutate doesn't
 *      structurally model — e.g. "food storage damage raises resource
 *      pressure by +12" lives in the registry, not in the derivation)
 *   5. Re-derive CausalState (14-variable substrate, Phase 17)
 *   6. Compute deltas at both layers (compareSystemState +
 *      compareCausalState)
 *   7. Compute Phase 14 faction relationship deltas
 *   8. Compute faction responses (Phase 9+)
 *   9. Emit the narrative summary
 *
 * Both `previewEvent` and `applyEvent` become thin wrappers around
 * `runEventPipeline`. The CONTRACT this pins: preview and apply
 * produce the same `afterSystemState`, `afterCausalState`, and same
 * delta lists for the same input. The drift is eliminated by
 * construction.
 *
 * Pure function. The input settlement is never mutated.
 */

import { EVENT_REGISTRY } from './registry.js';
import { mutateSettlement } from './mutate.js';
import { deriveSystemState } from '../state/deriveSystemState.js';
import { compareSystemState } from '../state/compareSystemState.js';
import { generateFactionResponses } from './factionResponses.js';
import { clamp01, bandFor } from '../state/bands.js';
import { deriveCausalState, compareCausalState } from '../causalState.js';
import { recalculateFactionRelationships } from '../factionRelationshipUpdate.js';

/** @typedef {import('../types.js').Event} Event */
/** @typedef {import('../types.js').SystemState} SystemState */

// ── Authored-delta application ───────────────────────────────────────────
// Identical math to the legacy previewEvent#applyStateDeltas, kept here
// so the pipeline can layer the registry's authored deltas on top of
// the structurally-derived SystemState.

function applyAuthoredStateDeltas(state, deltas) {
  if (!state) return state;
  /** @type {SystemState} */
  const next = /** @type {SystemState} */ ({});
  for (const key of Object.keys(state)) {
    const dim = state[key];
    const change = deltas?.[key] ?? 0;
    const value = Math.round(clamp01((dim?.value ?? 50) + change));
    next[key] = {
      value,
      band: bandFor(value),
      drivers: dim?.drivers || [],
      risks:   dim?.risks || [],
    };
  }
  return next;
}

// ── Single shared flow ───────────────────────────────────────────────────

/**
 * @typedef {Object} EventPipelineResult
 *
 * Every consumer (preview / apply / future Tier 4.17 counterfactual)
 * receives the same envelope.
 *
 * @property {Event}        event
 * @property {Object}       beforeSettlement
 * @property {Object}       nextSettlement
 * @property {SystemState}  beforeSystemState
 * @property {SystemState}  afterSystemState
 * @property {Object}       beforeCausalState
 * @property {Object}       afterCausalState
 * @property {Array<Object>} systemStateDeltas
 * @property {Array<Object>} causalStateDeltas
 * @property {Array<Object>} factionRelationshipDeltas
 * @property {Array<Object>} factionResponses
 * @property {string}       narrativeSummary
 * @property {Array<Object>} warnings
 */

/**
 * Run the unified event pipeline. Pure; idempotent.
 *
 * @param {Object} settlement
 * @param {Event}  event
 * @param {Object} [options]
 * @param {boolean} [options.skipFactionResponses=false]
 * @returns {EventPipelineResult}
 */
export function runEventPipeline(settlement, event, options = {}) {
  const { skipFactionResponses = false } = options;

  const beforeSettlement = settlement;
  const beforeSystemState = deriveSystemState(beforeSettlement);
  const beforeCausalState = deriveCausalState(beforeSettlement);

  // 1. Validate the event
  const spec = event ? EVENT_REGISTRY[event.type] : null;
  const warnings = [];
  if (!event || !spec) {
    warnings.push({ severity: 'mismatch', message: `Unknown event type: ${event?.type}` });
  } else if (spec.requiresTarget && !event.targetId) {
    warnings.push({ severity: 'mismatch', message: `${spec.label} requires a target` });
  }

  // Early-return if validation failed — no mutation, no deltas
  if (warnings.some(w => w.severity === 'mismatch')) {
    return {
      event,
      beforeSettlement,
      nextSettlement: beforeSettlement,
      beforeSystemState,
      afterSystemState: beforeSystemState,
      beforeCausalState,
      afterCausalState: beforeCausalState,
      systemStateDeltas: [],
      causalStateDeltas: [],
      factionRelationshipDeltas: [],
      factionResponses: [],
      narrativeSummary: '',
      warnings,
    };
  }

  // 2. Mutate a cloned settlement — entity-level changes (status flips,
  //    impairments, NPC patches, propagation). mutateSettlement never
  //    mutates the input.
  const nextSettlement = mutateSettlement({ settlement: beforeSettlement, event });

  // 3. Re-derive structural SystemState from the mutated settlement
  const afterStructural = deriveSystemState(nextSettlement);

  // 4. Apply the registry's authored stateDeltas additively on top.
  //    This preserves the authored-effect surface (e.g. "food_storage
  //    damage → +12 resourcePressure") that the mutation doesn't model
  //    structurally. The result is the canonical afterSystemState that
  //    both preview and apply now use.
  //
  //    Cast: spec.stateDeltas is typed as 1-arg in the registry typedef
  //    but accepts an optional settlement parameter — every spec we
  //    have today honors it. Cast through Function to express that.
  const rawAuthoredDeltas = /** @type {Function} */ (spec.stateDeltas)(event, beforeSettlement) || {};
  const afterSystemState = applyAuthoredStateDeltas(afterStructural, rawAuthoredDeltas);

  // 5. Re-derive CausalState from the mutated settlement (Phase 17
  //    substrate). The substrate reads from supply chains, factions,
  //    NPCs, active conditions, and generator output — most of which
  //    mutateSettlement may have changed.
  const afterCausalState = deriveCausalState(nextSettlement);

  // 6. Compute deltas at both layers
  const systemStateDeltas = compareSystemState(beforeSystemState, afterSystemState);
  const causalStateDeltas = compareCausalState(beforeCausalState, afterCausalState);

  // 7. Phase 14 faction relationship deltas — computed against the
  //    BEFORE settlement because the deltas describe how the event
  //    moves factions, not what the post-event state already reflects.
  let factionRelationshipDeltas = [];
  if (!skipFactionResponses) {
    try {
      factionRelationshipDeltas = recalculateFactionRelationships(beforeSettlement, event);
    } catch (e) {
      warnings.push({ severity: 'soft', message: `Faction relationship calc failed: ${e?.message || e}` });
    }
  }

  // 8. Faction responses (existing system) — computed against the
  //    MUTATED settlement so impaired factions speak as such.
  let factionResponses = [];
  if (!skipFactionResponses) {
    try {
      factionResponses = generateFactionResponses(nextSettlement, event);
    } catch (e) {
      warnings.push({ severity: 'soft', message: `Faction responses failed: ${e?.message || e}` });
    }
  }

  // 9. Narrative summary — uses the BEFORE settlement for label
  //    resolution since the event names what it intended to do.
  //    Same cast as stateDeltas: narrate accepts an optional settlement.
  const narrativeSummary = typeof spec.narrate === 'function'
    ? /** @type {Function} */ (spec.narrate)(event, beforeSettlement)
    : '';

  return {
    event,
    beforeSettlement,
    nextSettlement,
    beforeSystemState,
    afterSystemState,
    beforeCausalState,
    afterCausalState,
    systemStateDeltas,
    causalStateDeltas,
    factionRelationshipDeltas,
    factionResponses,
    narrativeSummary,
    warnings,
  };
}

// ── Diagnostic helpers ───────────────────────────────────────────────────

/**
 * High-level summary of an event pipeline result. Useful for the
 * "what just happened" UI surface and Tier 6.1 AI grounding.
 */
export function summarizeEventResult(result) {
  if (!result) return { lines: [], systemDeltaCount: 0, causalDeltaCount: 0 };
  const lines = [];
  if (result.warnings?.length) {
    for (const w of result.warnings) lines.push(`⚠ ${w.message}`);
  }
  if (result.narrativeSummary) lines.push(result.narrativeSummary);
  for (const d of result.systemStateDeltas || []) {
    lines.push(d.explanation || `${d.key} changed by ${d.change}`);
  }
  for (const d of result.causalStateDeltas || []) {
    lines.push(d.explanation || `${d.variable} changed by ${d.change}`);
  }
  return {
    lines,
    systemDeltaCount: (result.systemStateDeltas || []).length,
    causalDeltaCount: (result.causalStateDeltas || []).length,
    factionDeltaCount: (result.factionRelationshipDeltas || []).length,
  };
}
