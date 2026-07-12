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

export const FAITH_EVENT_TYPES = Object.freeze(['SET_PRIMARY_DEITY', 'IMPOSE_CULT']);

/** @param {{ event?: { type?: string } } | null | undefined} entry an EventLogEntry */
export function isFaithEventEntry(entry) {
  return FAITH_EVENT_TYPES.includes(String(entry?.event?.type || ''));
}

/**
 * The event log as a non-faith viewer may see it. Identity when unlocked.
 * @param {any[]} eventLog
 * @param {{ faithUnlocked?: boolean }} [opts]
 */
export function gateFaithEvents(eventLog, { faithUnlocked = false } = {}) {
  const log = Array.isArray(eventLog) ? eventLog : [];
  return faithUnlocked ? log : log.filter(e => !isFaithEventEntry(e));
}

export default gateFaithEvents;
