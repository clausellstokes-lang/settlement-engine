/**
 * analyticsQueue.js — first-party event transport, EAGER LEAF.
 *
 * track() (analytics.js) enqueues here AFTER consent/class gating. This module is
 * the eager half of an eager-leaf / lazy-applier split (the FP-2a dep-import
 * idiom — the A1-FP reclaim): it owns ONLY what synchronous callers need before
 * a flush —
 *   - the enqueue API (events / edits / snapshots / pulseEffects),
 *   - enqueue-time caps (record count + per-record bytes),
 *   - the spill lifecycle (restore on boot; the primitives live in
 *     analyticsQueueState.js, shared with the flush half),
 *   - the thin host seams (setAnalyticsSessionId / setAnalyticsElevated), stored
 *     as callbacks and READ at flush time,
 *   - the flush TRIGGERS (size / interval / pagehide).
 * Everything flush-time — envelope build, consent purge, snapshot caps, the
 * network send, retry/backoff — lives in analyticsFlush.js, loaded via a
 * memoized dynamic import PRIMED on the first enqueue, so it is resolved long
 * before any flush fires. If the page is left before that module ever loads,
 * flushOnLeave() falls back to a SYNCHRONOUS spill — records survive to the next
 * boot and deliver from the restored spill; there is no silent flush-loss path
 * (pinned in tests/lib/analyticsQueue.test.js). The queue lanes live in
 * analyticsQueueState.js so the pair stays acyclic (the layerBoundaries ratchet).
 *
 * Contract guarantees (doc §6):
 *   - never throws, never blocks the UI;
 *   - survives reloads/crashes via localStorage spill;
 *   - flushes on size / interval / pagehide (sendBeacon);
 *   - drops research-plane records if research consent is revoked before flush
 *     (the purge runs at flush time, in analyticsFlush.purgeRevoked);
 *   - disables itself (silently) when Supabase is unconfigured.
 */

import { isConfigured } from './supabase.js';
import {
  __queueState as S, SPILL_KEY, recordBytes, spillNow, scheduleSpill, clearSpill,
} from './analyticsQueueState.js';

const FLUSH_SIZE = 20;
const FLUSH_INTERVAL_MS = 30_000;
const MAX_RECORDS = 300;            // drop-oldest beyond this
const MAX_RECORD_BYTES = 64 * 1024; // reject a single oversize research record at enqueue

let _intervalStarted = false;
let _intervalId = null;
let _ring = [];       // DEV ring buffer for the debug overlay (last 100)

function nowMs() { try { return Date.now(); } catch { return 0; } }

// ── Host seams (stored callbacks; read at flush time via the shared state) ────
/** Register the "is this an elevated (owner/dev/admin) actor" predicate for the dogfood stamp. */
export function setAnalyticsElevated(fn) { S.elevatedGetter = typeof fn === 'function' ? fn : null; }
/** Register a session-id override (tests); production defaults to lib/sessionId.js,
 *  imported by the LAZY flush module so it costs no eager bytes (lib-infra-5). */
export function setAnalyticsSessionId(fn) { S.sessionIdGetter = typeof fn === 'function' ? fn : null; }

// ── Lazy flush module (the loadEngine memoized-import idiom) ──────────────────
let _flushMod = /** @type {any} */ (null);
let _flushLoad = /** @type {Promise<any>|null} */ (null);
function loadFlush() {
  if (_flushMod) return Promise.resolve(_flushMod);
  if (!_flushLoad) {
    _flushLoad = import('./analyticsFlush.js')
      .then((m) => { _flushMod = m; return m; })
      .catch(() => { _flushLoad = null; return null; }); // retriable on a failed chunk load
  }
  return _flushLoad;
}

// ── Spill restore (boot) ─────────────────────────────────────────────────────
function restoreSpill() {
  try {
    if (typeof localStorage === 'undefined') return;
    const raw = localStorage.getItem(SPILL_KEY);
    if (!raw) return;
    const d = JSON.parse(raw);
    if (Array.isArray(d?.events)) S.events = d.events.concat(S.events);
    if (Array.isArray(d?.edits)) S.edits = d.edits.concat(S.edits);
    if (Array.isArray(d?.snapshots)) S.snapshots = d.snapshots.concat(S.snapshots);
    if (Array.isArray(d?.pulseEffects)) S.pulseEffects = d.pulseEffects.concat(S.pulseEffects);
    S.droppedCount += Number(d?.dropped) || 0;
    capQueue();
  } catch { /* ignore malformed spill */ }
}

function capQueue() {
  const total = () => S.events.length + S.edits.length + S.snapshots.length + S.pulseEffects.length;
  while (total() > MAX_RECORDS) {
    // drop-oldest across the combined backlog (events first — they're cheapest)
    if (S.events.length) S.events.shift();
    else if (S.pulseEffects.length) S.pulseEffects.shift();
    else if (S.edits.length) S.edits.shift();
    else S.snapshots.shift();
    S.droppedCount += 1;
  }
}

// ── Public enqueue API ───────────────────────────────────────────────────────
// Every enqueue primes the lazy flush module (memoized — a no-op after the first
// call), so by the time any flush trigger fires the module is resolved and the
// send path is synchronous. The pagehide fallback (flushOnLeave) covers the
// narrow first-enqueue-to-load window with a synchronous spill.

/** Enqueue a product/research event. _class is the resolved EVENT_CLASS. */
export function enqueueEvent(event, props, opts = {}) {
  if (!isConfigured) return;            // no backend sink configured
  loadFlush();
  S.events.push({ event, props: props || {}, ts: nowMs(), subjectId: opts.subjectId, _class: opts._class || 'essential' });
  if (import.meta?.env?.DEV) pushRing({ kind: 'event', event, _class: opts._class || 'essential', props });
  capQueue(); scheduleSpill(); maybeFlush();
}
/** Enqueue a research-plane edit row (already redacted). */
export function enqueueEdit(row) {
  if (!isConfigured) return;
  loadFlush();
  const rec = { ...row, ts: row.ts || nowMs(), consentTier: 'research' };
  if (recordBytes(rec) > MAX_RECORD_BYTES) { S.droppedCount += 1; return; } // reject oversize at the source
  S.edits.push(rec);
  capQueue(); scheduleSpill(); maybeFlush();
}
/** Enqueue a structural snapshot (hot + optional structural). A record carrying a
 *  `structural` payload was BUILT under research consent (researchCapture only
 *  builds it then), and the flush-time consent purge keys on that payload directly
 *  (lib-infra-2 — see analyticsFlush.purgeRevoked), so no per-record tier stamp is
 *  needed at enqueue. */
export function enqueueSnapshot(row) {
  if (!isConfigured) return;
  loadFlush();
  const rec = { ...row, ts: row.ts || nowMs() };
  if (recordBytes(rec) > MAX_RECORD_BYTES) { S.droppedCount += 1; return; }
  S.snapshots.push(rec);
  capQueue(); scheduleSpill();
}
/** Enqueue a world-pulse per-effect mutation row (research-plane, redacted). */
export function enqueuePulseEffect(row) {
  if (!isConfigured) return;
  loadFlush();
  const rec = { ...row, ts: row.ts || nowMs(), consentTier: 'research' };
  if (recordBytes(rec) > MAX_RECORD_BYTES) { S.droppedCount += 1; return; }
  S.pulseEffects.push(rec);
  capQueue(); scheduleSpill();
}

function maybeFlush() {
  if (S.events.length + S.edits.length + S.snapshots.length + S.pulseEffects.length >= FLUSH_SIZE) flush();
  startInterval();
}

function startInterval() {
  if (_intervalStarted || typeof setInterval === 'undefined') return;
  _intervalStarted = true;
  try { _intervalId = setInterval(() => flush(), FLUSH_INTERVAL_MS); } catch { /* ignore */ }
}

/**
 * Flush the queue. Fire-and-forget; never throws. Delegates to the lazy flush
 * module (synchronously once loaded; riding its load promise otherwise — rare
 * outside the first ticks, since every enqueue primes the load).
 */
export function flush(opts = {}) {
  try {
    if (!isConfigured) return;
    if (_flushMod) { _flushMod.doFlush(opts); return; }
    // Nothing queued and no module yet → don't fetch a chunk for an empty pass
    // (the idle 30s interval would otherwise load it for no reason).
    if (!S.events.length && !S.edits.length && !S.snapshots.length && !S.pulseEffects.length) return;
    loadFlush().then((m) => { try { if (m) m.doFlush(opts); } catch { /* never throw */ } });
  } catch { /* never throw */ }
}

/**
 * The pagehide/visibilitychange path: beacon-flush when the lazy flush module is
 * resolved; otherwise persist the backlog SYNCHRONOUSLY (spillNow) so nothing is
 * lost — the spill restores on next boot and delivers then. Exported so the
 * no-silent-loss contract is pinnable in tests.
 */
export function flushOnLeave() {
  try {
    if (!isConfigured) return;
    if (_flushMod) { _flushMod.doFlush({ beacon: true }); return; }
    spillNow();
  } catch { /* never throw */ }
}

// ── Lifecycle wiring ─────────────────────────────────────────────────────────
let _installed = false;
/** Install flush-on-leave handlers + restore spill. Call once on app boot. */
export function installAnalyticsQueue() {
  if (_installed || typeof window === 'undefined') return;
  _installed = true;
  restoreSpill();
  startInterval();
  try {
    window.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') flushOnLeave(); });
    window.addEventListener('pagehide', flushOnLeave);
  } catch { /* ignore */ }
}

// ── DEV overlay support ──────────────────────────────────────────────────────
function pushRing(entry) {
  _ring.push({ ...entry, ts: nowMs() });
  if (_ring.length > 100) _ring.shift();
}
/** DEV-only: last 100 enqueued records + queue depth (for DevEventStreamPanel). */
export function debugSnapshot() {
  return {
    ring: _ring.slice(),
    depth: S.events.length + S.edits.length + S.snapshots.length + S.pulseEffects.length,
    dropped: S.droppedCount,
    configured: isConfigured,
  };
}

/** Test seam: reset module state (both halves — flush state too, if loaded). */
export function __resetQueueForTests() {
  S.events = []; S.edits = []; S.snapshots = []; S.pulseEffects = []; S.droppedCount = 0; _ring = [];
  try { if (_intervalId != null && typeof clearInterval !== 'undefined') clearInterval(_intervalId); } catch { /* ignore */ }
  _intervalId = null; _intervalStarted = false;
  // Reset the flush half (in-flight guard, backoff counter, pending retry timer)
  // so a queued retry can't fire flush() into the next test.
  try { if (_flushMod) _flushMod.__resetFlushForTests(); } catch { /* ignore */ }
  clearSpill(); // also cancels the pending spill-write timer
}
/** Test seam: resolve the lazy flush module so flush() behaves synchronously. */
export function __loadFlushForTests() { return loadFlush(); }
/** Test seam: simulate the not-yet-loaded state (pins the flushOnLeave spill fallback). */
export function __unloadFlushForTests() { _flushMod = null; _flushLoad = null; }
