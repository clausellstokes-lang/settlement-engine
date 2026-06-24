/**
 * domain/events/applyEvent.js — Commit an event to the settlement.
 *
 * This is now a thin wrapper around
 * `runEventPipeline`. Both previewEvent and applyEvent run the same
 * canonical flow, so what the preview promised is exactly what the
 * apply delivers. The only thing apply does differently is persist
 * the mutated settlement and write the EventLogEntry.
 *
 * Pure function — no store, no React.
 */

import { deriveSystemState } from '../state/deriveSystemState.js';
import { runEventPipeline } from './eventPipeline.js';
import { captureEventUndoSnapshot } from './undoEvent.js';

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
  // Pure function of (settlement, event, now) — no wall-clock read (A+ domain.6).
  // The store passes a real `now` at the apply boundary; preview/replay with no
  // now record a deterministic null appliedAt.
  const appliedAt = timedEvent?.timestamp || timedEvent?.createdAt || now || null;
  const result = runEventPipeline(settlement, event, { now: appliedAt });

  // Pre-event snapshot of the authored records whose writes aren't exactly
  // reversible from provenance (resource / trade-good / stressor events —
  // see undoEvent.js). Everything else an event writes carries event-id
  // provenance and is scrubbed by it on undo; for these the snapshot is the
  // only exact way back. Null for every other event type.
  const undo = captureEventUndoSnapshot(settlement, event);

  const logEntry = /** @type {EventLogEntry} */ ({
    // The pipeline may have RESOLVED the event (a derived APPLY_STRESSOR onset
    // severity stamped in when the DM picked none). Log the resolved event so the
    // timeline, the undo scrub, and the store's roaming-twin directive all read
    // the same severity the mutation and state-deltas used.
    event: result.event ?? event,
    appliedAt,
    beforeState,
    afterState: result.afterSystemState,
    deltas: result.systemStateDeltas,
    factionResponses: result.factionResponses,
    narrativeSummary: result.narrativeSummary,
    // additions — the substrate-layer delta and the structured
    // faction-relationship deltas are persisted alongside the legacy
    // 4-dim delta, so the timeline UI / AI overlay can read either.
    causalStateDeltas: result.causalStateDeltas,
    factionRelationshipDeltas: result.factionRelationshipDeltas,
    ...(undo ? { undo } : {}),
  });

  return {
    logEntry,
    nextSystemState: result.afterSystemState,
    nextSettlement: result.nextSettlement,
  };
}
