/**
 * eventComposer/applyOutcome.js — Apply-refusal + batch-outcome helpers extracted
 * from EventComposer.jsx (the max-lines split; behavior-preserving).
 *
 * These encode the store-hooks-state-1 law: a clock-bound queue refusal
 * (advance in flight / parked) is surfaced VISIBLY and the DM's composed intent
 * is never silently dropped — the single-apply form keeps its contents and the
 * batch cart keeps its staged set, each showing the typed reason.
 */
import { ADVANCE_ERROR_TEXT } from '../../../hooks/useRealmInspector.js';

/**
 * The applyRefusal payload for the inline box: a handler veto (§2) carries its
 * veto object; a clock-bound queue refusal carries the typed reason.
 * @param {any} entry  the ok:false ActionResult from applyEvent
 * @param {string} forKey  the current composition key (the box hides when it moves)
 */
export function applyRefusalPayload(entry, forKey) {
  return entry.veto
    ? { ...entry.veto, forKey }
    : { queueReason: entry.before?.reason || null, forKey };
}

/**
 * Prose for the inline Apply-refusal box.
 * @param {any} applyRefusal  the payload from applyRefusalPayload
 * @param {(code:any, detail:any)=>string} vetoProse
 */
export function applyRefusalMessage(applyRefusal, vetoProse) {
  if (applyRefusal?.queueReason) {
    return `✕ ${ADVANCE_ERROR_TEXT[applyRefusal.queueReason] || 'This change could not be queued right now — try again in a moment.'}`;
  }
  return `✕ The world refuses: ${vetoProse(applyRefusal.code, applyRefusal.detail)}`;
}

/**
 * Classify an applyEventBatch result for the BatchCart. A clock-bound refusal
 * with NOTHING landed keeps the staged cart and surfaces the reason; a validation
 * abort (ok:false) is a no-op; otherwise the batch committed.
 * @param {any} r  the applyEventBatch return
 * @returns {{ noop?: boolean, committed: boolean, refusalReason?: string|null, fireStale?: boolean }}
 */
export function batchApplyOutcome(r) {
  if (!r?.ok) return { noop: true, committed: false };
  if (r.queueRefused && (r.logEntries?.length || 0) === 0) {
    return { committed: false, refusalReason: r.warnings?.[0]?.reason || 'advance_in_flight' };
  }
  return { committed: true, fireStale: !r.queuedOnly };
}

/** Prose for the BatchCart's refusal notice (null when there is none). */
export function batchRefusalText(reason) {
  return reason
    ? (ADVANCE_ERROR_TEXT[reason] || 'These changes could not be queued right now — try again in a moment.')
    : null;
}
