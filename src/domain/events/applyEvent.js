/**
 * domain/events/applyEvent.js — Commit an event to the settlement.
 *
 * Phase 18 (Tier 2.2): this is now a thin wrapper around
 * `runEventPipeline`. Both previewEvent and applyEvent run the same
 * canonical flow, so what the preview promised is exactly what the
 * apply delivers. The only thing apply does differently is persist
 * the mutated settlement and write the EventLogEntry.
 *
 * Pure function — no store, no React.
 */

import { deriveSystemState } from '../state/deriveSystemState.js';
import { runEventPipeline } from './eventPipeline.js';

/** @typedef {import('../types.js').Event} Event */
/** @typedef {import('../types.js').SystemState} SystemState */
/** @typedef {import('../types.js').EventLogEntry} EventLogEntry */

/**
 * @param {Object} args
 * @param {Object} args.settlement
 * @param {SystemState} args.systemState  before-state for the log entry
 * @param {Event}  args.event
 * @param {string} [args.now] deterministic ISO timestamp for replay/tests
 * @returns {{ logEntry: EventLogEntry, nextSystemState: SystemState, nextSettlement: Object }}
 */
export function applyEvent({ settlement, systemState, event, now = null }) {
  const beforeState = systemState || deriveSystemState(settlement);
  const timedEvent = /** @type {any} */ (event);
  const appliedAt = timedEvent?.timestamp || timedEvent?.createdAt || now || new Date().toISOString();
  const result = runEventPipeline(settlement, event, { now: appliedAt });

  const logEntry = /** @type {EventLogEntry} */ ({
    event,
    appliedAt,
    beforeState,
    afterState: result.afterSystemState,
    deltas: result.systemStateDeltas,
    factionResponses: result.factionResponses,
    narrativeSummary: result.narrativeSummary,
    // Phase 18 additions — the substrate-layer delta and the structured
    // faction-relationship deltas are persisted alongside the legacy
    // 4-dim delta, so the timeline UI / AI overlay can read either.
    causalStateDeltas: result.causalStateDeltas,
    factionRelationshipDeltas: result.factionRelationshipDeltas,
  });

  return {
    logEntry,
    nextSystemState: result.afterSystemState,
    nextSettlement: result.nextSettlement,
  };
}
