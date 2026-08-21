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
import { mutateSettlementChecked } from './mutate.js';
import { deriveSystemState } from '../state/deriveSystemState.js';
import { compareSystemState } from '../state/compareSystemState.js';
import { generateFactionResponses } from './factionResponses.js';
import { clamp01, bandForDimension } from '../state/bands.js';
import { deriveCausalState, compareCausalState } from '../causalState.js';
import { recalculateFactionRelationships } from '../factionRelationshipUpdate.js';

/** @typedef {import('../types.js').Event} Event */
/** @typedef {import('../types.js').SystemState} SystemState */
/** @typedef {import('../types.js').StateDimension} StateDimension */
/** @typedef {import('../types.js').Delta} Delta */
/** @typedef {import('../types.js').FactionResponse} FactionResponse */

/**
 * Substrate-layer (Phase 17) diff entry, as produced by compareCausalState.
 * Local shape mirror — causalState.js documents the entry in prose only.
 * @typedef {Object} CausalStateDelta
 * @property {string} variable
 * @property {number} [before]
 * @property {number} [after]
 * @property {number} change
 * @property {string} [bandBefore]
 * @property {string} [bandAfter]
 * @property {string} [polarity]
 * @property {string} [explanation]
 */

/**
 * Pipeline warning entry. `severity: 'mismatch'` aborts the pipeline;
 * `'veto'` is the handler-veto channel (Composer V2 §2) — a gated mutation
 * REFUSED, the pipeline aborts the same way, and `code` carries the stable
 * machine code the affordance-manifest predicates cover; `'soft'` records a
 * non-fatal sub-system failure.
 * @typedef {Object} PipelineWarning
 * @property {string} severity
 * @property {string} message
 * @property {string} [code]
 * @property {string} [detail]
 */

// ── Authored-delta application ───────────────────────────────────────────
// Identical math to the legacy previewEvent#applyStateDeltas, kept here
// so the pipeline can layer the registry's authored deltas on top of
// the structurally-derived SystemState.

/**
 * Layer authored additive deltas onto a derived SystemState.
 * (The Record intersection gives string-key access over the four fixed
 * dimensions; SystemState is structurally assignable to it.)
 * @param {SystemState & Record<string, StateDimension>} state
 * @param {Record<string, number>|null|undefined} deltas
 * @returns {SystemState}
 */
function applyAuthoredStateDeltas(state, deltas) {
  if (!state) return state;
  /** @type {SystemState & Record<string, StateDimension>} */
  const next = /** @type {SystemState & Record<string, StateDimension>} */ ({});
  for (const key of Object.keys(state)) {
    const dim = state[key];
    const change = deltas?.[key] ?? 0;
    const value = Math.round(clamp01((dim?.value ?? 50) + change));
    next[key] = {
      // Polarity-ORIENTED, exactly as deriveSystemState's finalize() bands: this
      // authored layer is what PERSISTS as campaignState.systemState, so banding
      // it through the bare higher-is-better ladder wrote the inverted word into
      // the save for the three lower-is-better dimensions.
      value,
      band: bandForDimension(key, value),
      drivers: dim?.drivers || [],
      risks:   dim?.risks || [],
    };
  }
  return next;
}

/**
 * Re-layer an event's authored stateDeltas onto a freshly-derived SystemState.
 *
 * This is the SAME authored-delta step the pipeline applies internally (step 4),
 * exposed so a caller that re-derives SystemState from a structurally-mutated
 * settlement AFTER the pipeline ran (e.g. the store's applyEvent, which runs
 * reconciliation between mutation and persistence) can preserve the authored
 * effects instead of silently discarding them. Without this, an event whose
 * consequence lives only in the registry's authored deltas (e.g. CUT_TRADE_ROUTE
 * -> resilience -12 / resourcePressure +12 / externalThreat +5) loses that effect
 * the moment anyone re-derives from the settlement alone.
 *
 * Pure; never mutates. Returns `systemState` unchanged if the event has no spec
 * or no authored deltas.
 *
 * @param {SystemState} systemState — a freshly derived SystemState
 * @param {Event}  event
 * @param {Object|null} [settlement] the BEFORE settlement (authored deltas may read it)
 * @returns {SystemState}
 */
export function layerAuthoredDeltas(systemState, event, settlement = null) {
  const spec = event ? EVENT_REGISTRY[event.type] : null;
  if (!spec || typeof spec.stateDeltas !== 'function') return systemState;
  const deltas = /** @type {Function} */ (spec.stateDeltas)(event, settlement) || {};
  return applyAuthoredStateDeltas(systemState, deltas);
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
 * @property {Delta[]}      systemStateDeltas
 * @property {CausalStateDelta[]} causalStateDeltas
 * @property {Array<Object>} factionRelationshipDeltas
 * @property {FactionResponse[]} factionResponses
 * @property {string}       narrativeSummary
 * @property {PipelineWarning[]} warnings
 */

/**
 * Run the unified event pipeline. Pure; idempotent.
 *
 * @param {Object} settlement
 * @param {Event}  event
 * @param {Object} [options]
 * @param {boolean} [options.skipFactionResponses=false]
 * @param {string} [options.now] deterministic ISO timestamp for entity annotations
 * @returns {EventPipelineResult}
 */
export function runEventPipeline(settlement, event, options = {}) {
  const { skipFactionResponses = false, now = null } = options;

  const beforeSettlement = settlement;
  const beforeSystemState = deriveSystemState(beforeSettlement);
  const beforeCausalState = deriveCausalState(beforeSettlement);

  // 1. Validate the event
  /** @type {NonNullable<(typeof EVENT_REGISTRY)[Event['type']]>} */
  // @ts-ignore -- the initializer can be null, but every null path exits via
  // the mismatch early-return below; past it, spec is non-null by construction.
  const spec = event ? EVENT_REGISTRY[event.type] : null;
  /** @type {PipelineWarning[]} */
  const warnings = [];
  if (!event || !spec) {
    warnings.push({ severity: 'mismatch', message: `Unknown event type: ${event?.type}` });
  } else if (spec.requiresTarget && !event.targetId) {
    warnings.push({ severity: 'mismatch', message: `${spec.label} requires a target` });
  }

  // Shared abort envelope: validation mismatches and handler vetoes both
  // return the before-state untouched with NO deltas and NO narration.
  const abortResult = () => ({
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
  });

  // Early-return if validation failed — no mutation, no deltas
  if (warnings.some(w => w.severity === 'mismatch')) return abortResult();

  // 2. Mutate a cloned settlement — entity-level changes (status flips,
  //    impairments, NPC patches, propagation). The checked router surfaces
  //    the handler-veto channel (Composer V2 §2): a gated no-op is a blocking
  //    refusal, and deltas + narration must NOT commit on it — the phantom-
  //    event hole (timeline stories the world never did) closes here for
  //    preview and apply alike. Never mutates the input.
  // @ts-ignore -- mutate.js declares args.now as string|undefined but its own
  // default is `now = null`; the declared type there should be string|null.
  const mutated = mutateSettlementChecked({ settlement: beforeSettlement, event, now });
  if (mutated.veto) {
    // Terse eager message (code + detail); the LAZY composer surfaces the full
    // DM-facing prose via the manifest's vetoProse(code, detail).
    warnings.push({
      severity: 'veto',
      code: mutated.veto.code,
      detail: mutated.veto.detail,
      message: `${spec.label || event.type} refused: ${mutated.veto.code}${mutated.veto.detail ? ` (${mutated.veto.detail})` : ''}`,
    });
    return abortResult();
  }
  const nextSettlement = mutated.settlement;

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
  /** @type {ReturnType<typeof recalculateFactionRelationships>} */
  let factionRelationshipDeltas = [];
  if (!skipFactionResponses) {
    try {
      factionRelationshipDeltas = recalculateFactionRelationships(beforeSettlement, event);
    } catch (/** @type {any} */ e) {
      warnings.push({ severity: 'soft', message: `Faction relationship calc failed: ${e?.message || e}` });
    }
  }

  // 8. Faction responses (existing system) — computed against the
  //    MUTATED settlement so impaired factions speak as such.
  /** @type {ReturnType<typeof generateFactionResponses>} */
  let factionResponses = [];
  if (!skipFactionResponses) {
    try {
      factionResponses = generateFactionResponses(/** @type {import('./factionResponses.js').SettlementLike} */ (nextSettlement), event);
    } catch (/** @type {any} */ e) {
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
 *
 * Two-band separation (W6#2): the display bands
 * (Stable/Strained/Vulnerable/Critical) and the causal-substrate bands
 * (surplus/adequate/strained/critical/collapsed) share words at
 * incompatible thresholds, so concatenating both delta families into
 * one list read as one vocabulary contradicting itself. `lines` is the
 * DM-facing summary — warnings, narrative, and the display-band
 * systemStateDeltas only. The substrate's causalStateDeltas ship
 * separately in `diagnosticLines` for internal/debug surfaces; nothing
 * DM-facing should render them.
 *
 * @param {EventPipelineResult|null|undefined} result
 * @returns {{ lines: string[], diagnosticLines: string[], systemDeltaCount: number, causalDeltaCount: number, factionDeltaCount: number }}
 */
export function summarizeEventResult(result) {
  if (!result) {
    return { lines: [], diagnosticLines: [], systemDeltaCount: 0, causalDeltaCount: 0, factionDeltaCount: 0 };
  }
  const lines = [];
  if (result.warnings?.length) {
    for (const w of result.warnings) lines.push(`⚠ ${w.message}`);
  }
  if (result.narrativeSummary) lines.push(result.narrativeSummary);
  for (const d of result.systemStateDeltas || []) {
    lines.push(d.explanation || `${d.key} changed by ${d.change}`);
  }
  const diagnosticLines = [];
  for (const d of result.causalStateDeltas || []) {
    diagnosticLines.push(d.explanation || `${d.variable} changed by ${d.change}`);
  }
  return {
    lines,
    diagnosticLines,
    systemDeltaCount: (result.systemStateDeltas || []).length,
    causalDeltaCount: (result.causalStateDeltas || []).length,
    factionDeltaCount: (result.factionRelationshipDeltas || []).length,
  };
}
