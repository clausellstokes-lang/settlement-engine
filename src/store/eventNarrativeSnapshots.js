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
