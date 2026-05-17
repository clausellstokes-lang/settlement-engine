/**
 * domain/events/previewEvent.js — Compute the consequences of an event
 * WITHOUT mutating anything.
 *
 * The user clicks "Burn the granary" → previewEvent runs → UI shows
 * "Resilience falls Stable→Strained, Resource Pressure rises Strained→
 * Vulnerable, Merchant Guild gains leverage." User clicks Confirm →
 * applyEvent commits exactly what the preview promised.
 *
 * Pure function — no store, no React, no side effects, no I/O. Takes a
 * settlement + current state + event, returns a structured preview the
 * caller can either show as a "what would happen" panel or feed
 * straight into applyEvent.
 *
 * The preview deliberately reuses deriveSystemState rather than just
 * adding the event's stateDeltas to the current state. That way any
 * other change to the settlement (a separate event in flight, a draft
 * edit) is reflected in the preview consistently.
 */

import { EVENT_REGISTRY } from './registry.js';
import { deriveSystemState } from '../state/deriveSystemState.js';
import { compareSystemState } from '../state/compareSystemState.js';
import { generateFactionResponses } from './factionResponses.js';
import { clamp01, bandFor } from '../state/bands.js';

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
  const spec = EVENT_REGISTRY[event?.type];
  if (!spec) {
    return emptyPreview(event, systemState, [
      { severity: 'mismatch', message: `Unknown event type: ${event?.type}` },
    ]);
  }
  if (spec.requiresTarget && !event.targetId) {
    return emptyPreview(event, systemState, [
      { severity: 'mismatch', message: `${spec.label} requires a target` },
    ]);
  }

  const beforeState = systemState || deriveSystemState(settlement);

  // Apply state deltas additively to the *value* of each dimension,
  // then re-derive bands. We don't re-derive from the settlement here
  // because the underlying simulation hasn't actually changed yet —
  // this is a forecast based on the event's known impact.
  // `spec.stateDeltas` may use 1 or 2 args depending on whether the
  // event type needs the settlement context (e.g. ADD_NPC factors in
  // existing NPC count). The registry's loose typing means tsc can't
  // tell at the call site; cast through `any` to express that we know
  // the second arg is accepted by every spec we have today.
  const rawDeltas = /** @type {Function} */ (spec.stateDeltas)(event, settlement) || {};
  const afterState = applyStateDeltas(beforeState, rawDeltas);

  const deltas = compareSystemState(beforeState, afterState);

  // Affected pipeline-step keys for downstream rerun. The store will
  // hand these to `rerunAffected` after the user confirms.
   
  const affectedSteps = []; // populated lazily — registry is the source of truth

  // Faction responses — currently only the Merchant Guild archetype
  // produces output. Other factions return nothing until their
  // archetypes are authored (see factionResponses.js).
  let factionResponses = [];
  try {
    factionResponses = generateFactionResponses(settlement, event);
  } catch (e) {
    console.warn('[previewEvent] faction response generation failed:', e);
  }

  return {
    event,
    beforeState,
    afterState,
    deltas,
    factionResponses,
    narrativeSummary: /** @type {Function} */ (spec.narrate)(event, settlement),
    affectedSteps,
    warnings: [],
  };
}

/**
 * Add a flat delta map onto a SystemState's values, returning a new
 * SystemState with refreshed bands. Drivers and risks are carried
 * through unchanged from the before-state — they describe the
 * underlying simulation, which the preview hasn't actually touched.
 * The applyEvent step that follows will commit the rerun and re-derive
 * drivers from the updated settlement.
 *
 * @param {SystemState} state
 * @param {Partial<Record<keyof SystemState, number>>} deltas
 * @returns {SystemState}
 */
function applyStateDeltas(state, deltas) {
  /** @type {SystemState} */
  const next = /** @type {SystemState} */ ({});
  for (const key of Object.keys(state)) {
    const dim = state[key];
    const change = deltas[key] ?? 0;
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

function emptyPreview(event, beforeState, warnings) {
  return {
    event,
    beforeState: beforeState || null,
    afterState:  beforeState || null,
    deltas: [],
    factionResponses: [],
    narrativeSummary: '',
    affectedSteps: [],
    warnings,
  };
}
