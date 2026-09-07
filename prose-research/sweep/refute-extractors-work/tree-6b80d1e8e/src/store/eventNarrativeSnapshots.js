/**
 * Pure event-keyed narrative archive helpers shared by legacy and
 * server-authoritative canon-event writers.
 */

import { cloneJson } from './settlementSliceHelpers.js';

export const MAX_EVENT_NARRATIVE_SNAPSHOTS = 10;

/**
 * @param {Object|null} aiData
 * @param {{eventId?:string, aiSettlement?:Object, ts?:string}} [entry]
 */
export function appendEventNarrativeSnapshot(
  aiData,
  { eventId, aiSettlement, ts } = {},
) {
  if (!eventId || !aiSettlement) return aiData;
  const previous = aiData && typeof aiData === 'object' ? aiData : {};
  const existing = Array.isArray(previous.eventNarrativeSnapshots)
    ? previous.eventNarrativeSnapshots
    : [];
  const retained = existing.filter((snapshot) => snapshot?.eventId !== eventId);
  retained.push({
    eventId,
    ts: ts || new Date().toISOString(),
    aiSettlement: cloneJson(aiSettlement),
  });
  return {
    ...previous,
    eventNarrativeSnapshots: retained.slice(-MAX_EVENT_NARRATIVE_SNAPSHOTS),
  };
}

/**
 * The ONE stamp condition shared by both canon-event writers — legacy
 * settlementSlice.applyEvent and the server-authoritative command transaction
 * (R-3 writer unification, atlas VI.10 #157b). When the save carries an AI
 * narrative and the event has an id, archive the PRE-event prose keyed by that
 * id; otherwise stamp nothing. Returns the next aiData, or null when there is
 * nothing to stamp. Writer parity is pinned by
 * tests/store/narrativeStampParity.test.js — lanes call THIS helper and must
 * not add stamp conditions of their own.
 *
 * @param {{aiData?:Object}|null} beforeSave the cached save row before the event
 * @param {{event?:Object, logEntry?:Object, appliedAt?:string}} [input]
 */
export function stampPreEventNarrative(beforeSave, { event, logEntry, appliedAt } = {}) {
  const eventId = event?.id || logEntry?.event?.id;
  const narrative = beforeSave?.aiData?.aiSettlement;
  if (!eventId || !narrative) return null;
  return appendEventNarrativeSnapshot(beforeSave.aiData, {
    eventId: String(eventId),
    aiSettlement: narrative,
    ts: appliedAt,
  });
}
