/**
 * faithEventFilter.js — which event-log entries carry FAITH content.
 *
 * The two deity event kinds embed the deity's NAME in their generated
 * narration ("<name> is proclaimed the settlement's patron deity", registry
 * SET_PRIMARY_DEITY.narrate / IMPOSE_CULT.narrate), so any surface that
 * renders the event log to a non-premium viewer — or into a non-premium
 * export — must drop these entries, mirroring the faithChapterVisible seam.
 * (SHIFT_TIER is the settlement-SIZE tier event; its narration names no
 * deity and stays visible.)
 *
 * Zero-import display leaf (the deityConstants.js pattern) so lazy surfaces
 * can share it without moving any chunk boundary.
 */

// Type-only reference to the domain's canonical event shape (a JSDoc import()
// is erased at build — no runtime edge, so this stays a zero-import leaf).
/**
 * One event-log entry as this display seam tolerantly reads it: the canonical
 * EventLogEntry (src/domain/types.js), projected to the members the gate and
 * its display consumers touch — every field optional, because display surfaces
 * read partial/legacy logs defensively.
 * @typedef {{ event?: Partial<import('../types.js').Event>,
 *             narrativeSummary?: string } | null | undefined} FaithGateableEntry
 */

export const FAITH_EVENT_TYPES = Object.freeze(['SET_PRIMARY_DEITY', 'IMPOSE_CULT']);

/** @param {FaithGateableEntry} entry an EventLogEntry */
export function isFaithEventEntry(entry) {
  return FAITH_EVENT_TYPES.includes(String(entry?.event?.type || ''));
}

/**
 * The event log as a non-faith viewer may see it. Identity when unlocked.
 * @param {FaithGateableEntry[] | null | undefined} eventLog
 * @param {{ faithUnlocked?: boolean }} [opts]
 * @returns {FaithGateableEntry[]}
 */
export function gateFaithEvents(eventLog, { faithUnlocked = false } = {}) {
  const log = Array.isArray(eventLog) ? eventLog : [];
  return faithUnlocked ? log : log.filter(e => !isFaithEventEntry(e));
}

export default gateFaithEvents;
