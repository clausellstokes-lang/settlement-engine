/**
 * domain/events/applyEvent.js — Commit an event to the settlement.
 *
 * v2 (2026): now mutates the actual settlement object via
 * `mutateSettlement`. Earlier shipped state-only because the entity-
 * patch model wasn't built; with that model now in place, applying
 * an event:
 *
 *   1. Mutates the settlement (status flips, impairments, NPC patches,
 *      cross-entity propagation through institution↔faction links)
 *   2. Re-derives SystemState from the mutated settlement so dimensions
 *      reflect the structural truth, not just authored deltas
 *   3. Produces the EventLogEntry the store appends to eventLog
 *
 * Pure function — no store, no React.
 */

import { previewEvent } from './previewEvent.js';
import { mutateSettlement } from './mutate.js';
import { deriveSystemState } from '../state/deriveSystemState.js';
import { compareSystemState } from '../state/compareSystemState.js';
import { generateFactionResponses } from './factionResponses.js';

/** @typedef {import('../types.js').Event} Event */
/** @typedef {import('../types.js').SystemState} SystemState */
/** @typedef {import('../types.js').EventLogEntry} EventLogEntry */

/**
 * @param {Object} args
 * @param {Object} args.settlement
 * @param {SystemState} args.systemState  before-state for the log entry
 * @param {Event}  args.event
 * @returns {{ logEntry: EventLogEntry, nextSystemState: SystemState, nextSettlement: Object }}
 */
export function applyEvent({ settlement, systemState, event }) {
  const beforeState = systemState || deriveSystemState(settlement);

  // 1. Mutate the settlement: status flips, impairments, propagation.
  //    Old state-only path is preserved for the timeline narrative —
  //    we still use previewEvent's narrative summary — but the actual
  //    state recomputation is now from the mutated settlement.
  const nextSettlement = mutateSettlement({ settlement, event });

  // 2. Re-derive SystemState from the mutated settlement so the
  //    bands reflect structural reality. This prevents the "narrative
  //    says granary burned but resilience says everything's fine" gap.
  const afterState = deriveSystemState(nextSettlement);
  const deltas = compareSystemState(beforeState, afterState);

  // 3. Faction responses come from the mutated settlement so newly
  //    impaired factions don't speak as though they're at full strength.
  let factionResponses = [];
  try {
    factionResponses = generateFactionResponses(nextSettlement, event);
  } catch (e) {
    console.warn('[applyEvent] faction responses failed:', e);
  }

  // Narrative summary from the registry — uses the original settlement
  // for label resolution since the event names what it intended to do,
  // not what propagated.
  const preview = previewEvent({ settlement, systemState: beforeState, event });

  const logEntry = /** @type {EventLogEntry} */ ({
    event,
    appliedAt: new Date().toISOString(),
    beforeState,
    afterState,
    deltas,
    factionResponses,
    narrativeSummary: preview.narrativeSummary,
  });

  return { logEntry, nextSystemState: afterState, nextSettlement };
}
