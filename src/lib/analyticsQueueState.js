/**
 * analyticsQueueState.js — the shared substrate of the analytics-transport pair
 * (eager leaf analyticsQueue.js + lazy applier analyticsFlush.js).
 *
 * Exists so the pair stays ACYCLIC: the queue dynamically imports the flush
 * module, and if the flush module imported the queue back for the lanes, that
 * back-edge would be a dependency cycle (the layerBoundaries shrink-only cycle
 * ratchet rightly rejects new ones). Both halves import THIS module instead —
 * the same shape as the campaignSlice / campaignSliceShared idiom.
 *
 * EAGER (analyticsQueue's static import puts it in the entry closure), so keep
 * it to the minimal shared surface: the queue lanes, the record-size helper, and
 * the spill primitives both halves touch. No consent, no network, no session —
 * those live in their respective halves.
 */

const SPILL_KEY = 'sf_evt_queue_v1';
export { SPILL_KEY };

/**
 * Shared queue state — the lanes both halves read and mutate in place, plus the
 * host-registered seams (stored callbacks, read at flush time). Internal to the
 * transport pair; not a public API (the underscore is the contract).
 */
export const __queueState = {
  events: /** @type {any[]} */ ([]),        // [{ event, props, ts, subjectId?, _class }]
  edits: /** @type {any[]} */ ([]),         // research-plane edit rows
  snapshots: /** @type {any[]} */ ([]),     // structural snapshot rows
  pulseEffects: /** @type {any[]} */ ([]),  // research-plane world-pulse per-effect rows
  droppedCount: 0,
  /** host-registered "is this an elevated (owner/dev/admin) actor" predicate (dogfood stamp) */
  elevatedGetter: /** @type {null | (() => boolean)} */ (null),
  /** host/test-registered session-id override; flush falls back to lib/sessionId.js */
  sessionIdGetter: /** @type {null | (() => (string | null | undefined))} */ (null),
};
const S = __queueState;

/** Bytes of a record's JSON (0 if unserializable). */
export function recordBytes(r) {
  try { return JSON.stringify(r).length; } catch { return 0; }
}

// ── Durable spill primitives ─────────────────────────────────────────────────
let _spillTimer = null;

/** Synchronous spill write — also the pagehide fallback when flush isn't loaded. */
export function spillNow() {
  try {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(SPILL_KEY, JSON.stringify({
      events: S.events, edits: S.edits, snapshots: S.snapshots, pulseEffects: S.pulseEffects, dropped: S.droppedCount,
    }));
  } catch { /* quota — accept loss */ }
}

/** Debounced spill (enqueue path + the flush module's drain path). */
export function scheduleSpill() {
  if (_spillTimer || typeof localStorage === 'undefined') return;
  _spillTimer = setTimeout(() => { _spillTimer = null; spillNow(); }, 1_000);
}

/** Cancel a pending spill write and drop any persisted spill. */
export function clearSpill() {
  if (_spillTimer) { try { clearTimeout(_spillTimer); } catch { /* ignore */ } _spillTimer = null; }
  try { if (typeof localStorage !== 'undefined') localStorage.removeItem(SPILL_KEY); } catch { /* ignore */ }
}
