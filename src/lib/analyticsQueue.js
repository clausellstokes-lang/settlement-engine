/**
 * analyticsQueue.js — first-party event transport (the sink).
 *
 * track() (analytics.js) enqueues here AFTER consent/class gating. This module
 * owns batching, durable spill, and delivery to the ingest edge function. It is
 * the FIRST-PARTY plane; the third-party provider mirror (Plausible/PostHog) is
 * handled separately in analytics.js and only ever receives essential-class
 * events (research data never leaves first-party storage).
 *
 * Contract guarantees (doc §6):
 *   - never throws, never blocks the UI;
 *   - survives reloads/crashes via localStorage spill;
 *   - flushes on size / interval / pagehide (sendBeacon);
 *   - drops research-class records if research consent is revoked before flush;
 *   - disables itself (silently) when Supabase is unconfigured.
 */

import { isConfigured } from './supabase.js';
import { getConsent } from './consent.js';
import { EVENTS_REV } from './analyticsEvents.js';
import { getDeviceToken } from './deviceToken.js';

const SPILL_KEY = 'sf_evt_queue_v1';
const FLUSH_SIZE = 20;
const FLUSH_INTERVAL_MS = 30_000;
const MAX_RECORDS = 300;          // drop-oldest beyond this
const MAX_ATTEMPTS = 5;
const BACKOFF_MS = [1_000, 4_000, 16_000, 60_000, 60_000];
const MAX_ENVELOPE_BYTES = 256 * 1024; // ingest payload ceiling — force-drain to fit, never no-op
const MAX_RECORD_BYTES = 64 * 1024;    // reject a single oversize research record at enqueue

let _events = [];     // [{ event, props, ts, subjectId?, _class }]
let _edits = [];      // research-plane edit rows
let _snapshots = [];  // research-plane snapshot rows
let _pulseEffects = []; // research-plane world-pulse per-effect mutation rows
let _droppedCount = 0;
let _attempt = 0;
let _inFlight = false; // guards against overlapping flushes (interval + size-trigger + retry)
let _intervalStarted = false;
let _intervalId = null;
let _ring = [];       // DEV ring buffer for the debug overlay (last 100)

function nowMs() { try { return Date.now(); } catch { return 0; } }
function uuid() {
  try { if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID(); } catch { /* fall */ }
  return 'b-' + nowMs().toString(36) + '-' + Math.abs((nowMs() * 31) | 0).toString(36);
}
function ingestUrl() {
  try {
    const base = import.meta.env.VITE_SUPABASE_URL;
    return base ? `${String(base).replace(/\/$/, '')}/functions/v1/ingest-events` : null;
  } catch { return null; }
}
function deviceToken() {
  // Mint/read via getDeviceToken() so the token is created consistently with the
  // gallery view-dedup path (and the storage-key literal isn't duplicated here —
  // a rename in deviceToken.js would otherwise silently strip the analytics token).
  try { return getDeviceToken() || undefined; }
  catch { return undefined; }
}
function appVersion() {
  try { return import.meta.env.VITE_APP_VERSION || undefined; } catch { return undefined; }
}

// Session-id seam: wired from the lifecycle install (see installAnalyticsQueue) so
// this module stays dependency-free from session.js. Until wired, envelopes ship
// without a sessionId (the prior behaviour) rather than throwing.
let _sessionIdGetter = null;
/** Wire the session-id source so buildEnvelope can stamp `sessionId`. */
export function setSessionIdGetter(getter) {
  _sessionIdGetter = typeof getter === 'function' ? getter : null;
}
function sessionId() {
  try { return (_sessionIdGetter && _sessionIdGetter()) || undefined; } catch { return undefined; }
}

// Tracked retry handle so a queued backoff retry can be cancelled when a later
// flush already succeeded (no double-fire) and on reset (no cross-test leak).
let _retryTimer = null;

// ── Durable spill ────────────────────────────────────────────────────────────
let _spillTimer = null;
function scheduleSpill() {
  if (_spillTimer || typeof localStorage === 'undefined') return;
  _spillTimer = setTimeout(() => {
    _spillTimer = null;
    try {
      localStorage.setItem(SPILL_KEY, JSON.stringify({
        events: _events, edits: _edits, snapshots: _snapshots, pulseEffects: _pulseEffects, dropped: _droppedCount,
      }));
    } catch { /* quota — accept loss */ }
  }, 1_000);
}
function restoreSpill() {
  try {
    if (typeof localStorage === 'undefined') return;
    const raw = localStorage.getItem(SPILL_KEY);
    if (!raw) return;
    const d = JSON.parse(raw);
    if (Array.isArray(d?.events)) _events = d.events.concat(_events);
    if (Array.isArray(d?.edits)) _edits = d.edits.concat(_edits);
    if (Array.isArray(d?.snapshots)) _snapshots = d.snapshots.concat(_snapshots);
    if (Array.isArray(d?.pulseEffects)) _pulseEffects = d.pulseEffects.concat(_pulseEffects);
    _droppedCount += Number(d?.dropped) || 0;
    capQueue();
  } catch { /* ignore malformed spill */ }
}
function clearSpill() {
  // Cancel a pending spill write (queue is empty / being reset — nothing to persist)
  // and drop any already-persisted spill.
  if (_spillTimer) { try { clearTimeout(_spillTimer); } catch { /* ignore */ } _spillTimer = null; }
  try { if (typeof localStorage !== 'undefined') localStorage.removeItem(SPILL_KEY); } catch { /* ignore */ }
}

function capQueue() {
  const total = () => _events.length + _edits.length + _snapshots.length + _pulseEffects.length;
  while (total() > MAX_RECORDS) {
    // drop-oldest across the combined backlog (events first — they're cheapest)
    if (_events.length) _events.shift();
    else if (_pulseEffects.length) _pulseEffects.shift();
    else if (_edits.length) _edits.shift();
    else _snapshots.shift();
    _droppedCount += 1;
  }
}

/** Bytes of a record's JSON (0 if unserializable). */
function recordBytes(r) {
  try { return JSON.stringify(r).length; } catch { return 0; }
}

/**
 * Drop the single largest queued record across all planes. Returns true if one was
 * dropped. Used by flush() to force an oversize envelope under the byte ceiling
 * instead of the old no-op early-return, which could permanently wedge the queue
 * (record COUNT under MAX_RECORDS but byte SIZE over the limit → flush returned
 * forever and nothing — including research data — ever delivered).
 */
function dropLargestRecord() {
  // Class-aware: shed RESEARCH-plane bulk before essential events. Under envelope
  // byte pressure the essential class must survive longer than research data, so we
  // only ever drop an event as a LAST resort (no research record left to drop).
  const pickLargest = (lanes) => {
    let best = null;
    for (const arr of lanes) {
      for (let i = 0; i < arr.length; i++) {
        const size = recordBytes(arr[i]);
        if (!best || size > best.size) best = { arr, idx: i, size };
      }
    }
    return best;
  };
  const best = pickLargest([_pulseEffects, _edits, _snapshots]) || pickLargest([_events]);
  if (!best) return false;
  best.arr.splice(best.idx, 1);
  _droppedCount += 1;
  return true;
}

// ── Consent purge (research revoked → drop research-plane records) ────────────
function purgeRevoked() {
  const c = getConsent();
  if (!c.research) {
    _events = _events.filter(e => e._class !== 'research');
    _edits = [];
    _snapshots = _snapshots.filter(s => s.consentTier !== 'research');
    _pulseEffects = [];
  }
  if (!c.essential) { // full opt-out / DNT → nothing first-party either
    _events = []; _edits = []; _snapshots = []; _pulseEffects = [];
  }
}

// ── PII backstop ─────────────────────────────────────────────────────────────
// The no-PII contract (taxonomy §: coarse enums/bands/counts only) is enforced by
// convention at every track() call site. This is a cheap defense-in-depth backstop
// at the transport layer: a single mis-built call must not persist a settlement
// name / free-text / email to the plaintext localStorage spill or POST it. We drop
// string values that look like an email or are long free-text; primitives, enums,
// bands, and short labels pass through unchanged. Drops are silent (analytics never
// throws); a key is replaced with '[redacted]' so the event still records that the
// prop was present (shape) without leaking its value.
const EMAIL_RE = /[^\s@]+@[^\s@]+\.[^\s@]+/;
const MAX_PROP_STR_LEN = 80; // enum/band/short-label values are well under this
function sanitizeProps(props) {
  if (!props || typeof props !== 'object') return {};
  let mutated = false;
  const out = {};
  for (const k of Object.keys(props)) {
    const v = props[k];
    if (typeof v === 'string' && (v.length > MAX_PROP_STR_LEN || EMAIL_RE.test(v))) {
      out[k] = '[redacted]';
      mutated = true;
    } else {
      out[k] = v;
    }
  }
  if (mutated && import.meta?.env?.DEV) {

    console.warn('[analyticsQueue] redacted suspected PII/free-text in event props');
  }
  return out;
}

// ── Public enqueue API ───────────────────────────────────────────────────────
/** Enqueue a product/research event. _class is the resolved EVENT_CLASS. */
export function enqueueEvent(event, props, opts = {}) {
  if (!isConfigured) return;            // no backend sink configured
  _events.push({ event, props: sanitizeProps(props), ts: nowMs(), subjectId: opts.subjectId, _class: opts._class || 'essential' });
  if (import.meta?.env?.DEV) pushRing({ kind: 'event', event, _class: opts._class || 'essential', props });
  capQueue(); scheduleSpill(); maybeFlush();
}
/** Enqueue a research-plane edit row (already redacted). */
export function enqueueEdit(row) {
  if (!isConfigured) return;
  const rec = { ...row, ts: row.ts || nowMs(), consentTier: 'research' };
  if (recordBytes(rec) > MAX_RECORD_BYTES) { _droppedCount += 1; return; } // reject oversize at the source
  _edits.push(rec);
  capQueue(); scheduleSpill(); maybeFlush();
}
/** Enqueue a structural snapshot (hot + optional structural). */
export function enqueueSnapshot(row) {
  if (!isConfigured) return;
  // Stamp the research tier so purgeRevoked() actually drops these on a
  // research-consent revocation (its _snapshots filter keys on consentTier).
  const rec = { ...row, ts: row.ts || nowMs(), consentTier: 'research' };
  if (recordBytes(rec) > MAX_RECORD_BYTES) { _droppedCount += 1; return; }
  _snapshots.push(rec);
  capQueue(); scheduleSpill(); maybeFlush();
}
/** Enqueue a world-pulse per-effect mutation row (research-plane, redacted). */
export function enqueuePulseEffect(row) {
  if (!isConfigured) return;
  const rec = { ...row, ts: row.ts || nowMs(), consentTier: 'research' };
  if (recordBytes(rec) > MAX_RECORD_BYTES) { _droppedCount += 1; return; }
  _pulseEffects.push(rec);
  capQueue(); scheduleSpill(); maybeFlush();
}

function maybeFlush() {
  if (_events.length + _edits.length + _snapshots.length + _pulseEffects.length >= FLUSH_SIZE) flush();
  startInterval();
}

function startInterval() {
  if (_intervalStarted || typeof setInterval === 'undefined') return;
  _intervalStarted = true;
  try { _intervalId = setInterval(() => flush(), FLUSH_INTERVAL_MS); } catch { /* ignore */ }
}

function buildEnvelope() {
  const c = getConsent();
  return {
    batchId: uuid(),
    sessionId: sessionId(), // wired via setSessionIdGetter (no-op until then)
    deviceToken: deviceToken(),
    appVersion: appVersion(),
    eventsRev: EVENTS_REV,
    consent: c.research ? 'research' : 'product',
    droppedCount: _droppedCount || undefined,
    events: _events.map((e, i) => ({ seq: i, event: e.event, ts: e.ts, props: e.props, subjectId: e.subjectId })),
    edits: _edits.map((e, i) => ({ seq: 1000 + i, ...e })),
    snapshots: _snapshots.map((s, i) => ({ seq: 2000 + i, ...s })),
    pulseEffects: _pulseEffects.map((p, i) => ({ seq: 3000 + i, ...p })),
  };
}

/** Flush the queue. Fire-and-forget; never throws. Uses beacon when leaving. */
export function flush({ beacon = false } = {}) {
  try {
    if (!isConfigured) return;
    // In-flight guard: a fetch already in flight will drain on success; a second
    // concurrent flush (interval / size-trigger / retry) would double-POST the same
    // batch and desync the backoff counter.
    //
    // The beacon (leave) path ALSO honours the guard: the in-flight fetch uses
    // keepalive:true, so it already survives tab unload. Firing a beacon for the
    // same un-drained records would double-deliver them (duplicate ingest rows) and
    // could over-drain the queue (the beacon drains optimistically on the synchronous
    // sendBeacon ok, but those records were never confirmed delivered by EITHER
    // transport). Skip the beacon while a fetch owns the current batch.
    if (_inFlight) return;
    purgeRevoked();
    if (!_events.length && !_edits.length && !_snapshots.length && !_pulseEffects.length) return;
    const url = ingestUrl();
    if (!url) return;

    // Force-drain to fit the envelope ceiling: drop the largest record and rebuild
    // until under the limit (never the old no-op early-return that could wedge the
    // queue forever). Bounded by MAX_RECORDS, and rare given the per-record cap.
    let body = JSON.stringify(buildEnvelope());
    while (body.length > MAX_ENVELOPE_BYTES && dropLargestRecord()) {
      body = JSON.stringify(buildEnvelope());
    }
    if (body.length > MAX_ENVELOPE_BYTES) return; // nothing left to drop yet still over — give up this pass
    // If force-drain emptied every lane (e.g. a single oversize event was the only
    // record), don't POST a record-free envelope — nothing to deliver this pass.
    if (!_events.length && !_edits.length && !_snapshots.length && !_pulseEffects.length) return;

    // Snapshot the actual record REFERENCES being sent so a concurrent enqueue
    // isn't lost on success. We drain by IDENTITY, not count: an enqueue during the
    // in-flight fetch — or a front-shifting capQueue()/purgeRevoked() between send
    // and drain — would make a count-based splice(0, n) remove the WRONG records and
    // silently drop newly-enqueued events. droppedCount is captured too: the envelope
    // reports the CURRENT _droppedCount, so on drain we subtract exactly that (not
    // reset to 0) — a concurrent enqueue+cap between send and drain bumps
    // _droppedCount for the NEXT envelope.
    const sent = {
      events: _events.slice(), edits: _edits.slice(), snapshots: _snapshots.slice(), pulseEffects: _pulseEffects.slice(),
      dropped: _droppedCount,
    };

    if (beacon && typeof navigator !== 'undefined' && navigator.sendBeacon) {
      const ok = navigator.sendBeacon(url, new Blob([body], { type: 'application/json' }));
      if (ok) { drain(sent); }
      return;
    }
    if (typeof fetch === 'undefined') return;
    _inFlight = true;
    fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body, keepalive: true })
      .then(res => {
        _inFlight = false;
        if (res && res.ok) { _attempt = 0; drain(sent); }
        else { scheduleRetry(); }
      })
      .catch(() => { _inFlight = false; scheduleRetry(); });
  } catch { _inFlight = false; /* never throw, never wedge the guard */ }
}

function drain(sent) {
  // A successful delivery supersedes any queued backoff retry — cancel it so it
  // can't double-fire a redundant flush after we've already shipped.
  if (_retryTimer) { try { clearTimeout(_retryTimer); } catch { /* ignore */ } _retryTimer = null; }
  // Remove exactly the records that were sent, by IDENTITY. A count-based
  // splice(0, n) from the front would drop the wrong records when the lane was
  // front-shifted (capQueue drop-oldest / purgeRevoked filter) or appended-to
  // (a concurrent enqueue) during the in-flight fetch. Identity keeps any record
  // enqueued after the snapshot for the next envelope. Sets give O(n) drain.
  const without = (live, shipped) => {
    if (!shipped.length) return;
    const gone = new Set(shipped);
    const keep = live.filter(r => !gone.has(r));
    live.length = 0;
    for (const r of keep) live.push(r);
  };
  without(_events, sent.events);
  without(_edits, sent.edits);
  without(_snapshots, sent.snapshots);
  without(_pulseEffects, sent.pulseEffects);
  // Subtract only the droppedCount that was actually reported in the sent envelope,
  // preserving any drops that occurred AFTER the snapshot (concurrent enqueue+cap)
  // so the next envelope still carries them. Clamp at 0 for safety.
  _droppedCount = Math.max(0, _droppedCount - (sent.dropped || 0));
  if (!_events.length && !_edits.length && !_snapshots.length && !_pulseEffects.length) clearSpill();
  else scheduleSpill();
}

function scheduleRetry() {
  if (_attempt >= MAX_ATTEMPTS) { _attempt = 0; scheduleSpill(); return; } // re-spill for next session
  const delay = BACKOFF_MS[Math.min(_attempt, BACKOFF_MS.length - 1)];
  _attempt += 1;
  // Track the handle so a later success (drain) or a reset can cancel it.
  try { _retryTimer = setTimeout(() => { _retryTimer = null; flush(); }, delay); } catch { /* ignore */ }
}

// ── Lifecycle wiring ─────────────────────────────────────────────────────────
let _installed = false;
/** Install flush-on-leave handlers + restore spill. Call once on app boot. */
export function installAnalyticsQueue() {
  if (_installed || typeof window === 'undefined') return;
  _installed = true;
  restoreSpill();
  startInterval();
  const onLeave = () => flush({ beacon: true });
  try {
    window.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') onLeave(); });
    window.addEventListener('pagehide', onLeave);
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
    depth: _events.length + _edits.length + _snapshots.length + _pulseEffects.length,
    dropped: _droppedCount,
    configured: isConfigured,
  };
}

/** Test seam: reset module state. */
export function __resetQueueForTests() {
  _events = []; _edits = []; _snapshots = []; _pulseEffects = []; _droppedCount = 0; _attempt = 0; _inFlight = false; _ring = [];
  try { if (_intervalId != null && typeof clearInterval !== 'undefined') clearInterval(_intervalId); } catch { /* ignore */ }
  _intervalId = null; _intervalStarted = false;
  // Cancel any pending backoff retry so it can't fire flush() into the next test.
  if (_retryTimer) { try { clearTimeout(_retryTimer); } catch { /* ignore */ } _retryTimer = null; }
  clearSpill(); // also cancels the pending spill-write timer
}
