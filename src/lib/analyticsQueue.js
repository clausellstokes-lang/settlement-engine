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

const SPILL_KEY = 'sf_evt_queue_v1';
const FLUSH_SIZE = 20;
const FLUSH_INTERVAL_MS = 30_000;
const MAX_RECORDS = 300;          // drop-oldest beyond this
const MAX_ATTEMPTS = 5;
const BACKOFF_MS = [1_000, 4_000, 16_000, 60_000, 60_000];

let _events = [];     // [{ event, props, ts, subjectId?, _class }]
let _edits = [];      // research-plane edit rows
let _snapshots = [];  // research-plane snapshot rows
let _pulseEffects = []; // research-plane world-pulse per-effect mutation rows
let _droppedCount = 0;
let _attempt = 0;
let _intervalStarted = false;
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
  try { return typeof localStorage !== 'undefined' ? localStorage.getItem('sf_view_token') || undefined : undefined; }
  catch { return undefined; }
}
function appVersion() {
  try { return import.meta.env.VITE_APP_VERSION || undefined; } catch { return undefined; }
}

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

// ── Public enqueue API ───────────────────────────────────────────────────────
/** Enqueue a product/research event. _class is the resolved EVENT_CLASS. */
export function enqueueEvent(event, props, opts = {}) {
  if (!isConfigured) return;            // no backend sink configured
  _events.push({ event, props: props || {}, ts: nowMs(), subjectId: opts.subjectId, _class: opts._class || 'essential' });
  if (import.meta?.env?.DEV) pushRing({ kind: 'event', event, _class: opts._class || 'essential', props });
  capQueue(); scheduleSpill(); maybeFlush();
}
/** Enqueue a research-plane edit row (already redacted). */
export function enqueueEdit(row) {
  if (!isConfigured) return;
  _edits.push({ ...row, ts: row.ts || nowMs(), consentTier: 'research' });
  capQueue(); scheduleSpill(); maybeFlush();
}
/** Enqueue a structural snapshot (hot + optional structural). */
export function enqueueSnapshot(row) {
  if (!isConfigured) return;
  _snapshots.push({ ...row, ts: row.ts || nowMs() });
  capQueue(); scheduleSpill();
}
/** Enqueue a world-pulse per-effect mutation row (research-plane, redacted). */
export function enqueuePulseEffect(row) {
  if (!isConfigured) return;
  _pulseEffects.push({ ...row, ts: row.ts || nowMs(), consentTier: 'research' });
  capQueue(); scheduleSpill();
}

function maybeFlush() {
  if (_events.length + _edits.length + _snapshots.length + _pulseEffects.length >= FLUSH_SIZE) flush();
  startInterval();
}

function startInterval() {
  if (_intervalStarted || typeof setInterval === 'undefined') return;
  _intervalStarted = true;
  try { setInterval(() => flush(), FLUSH_INTERVAL_MS); } catch { /* ignore */ }
}

function buildEnvelope() {
  const c = getConsent();
  return {
    batchId: uuid(),
    sessionId: undefined, // stamped by caller wiring if available
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
    purgeRevoked();
    if (!_events.length && !_edits.length && !_snapshots.length && !_pulseEffects.length) return;
    const url = ingestUrl();
    if (!url) return;
    const envelope = buildEnvelope();
    const body = JSON.stringify(envelope);
    if (body.length > 256 * 1024) { capQueue(); return; } // safety; capQueue keeps us bounded

    // Snapshot what we're sending so a concurrent enqueue isn't lost on success.
    const sentCounts = { e: _events.length, d: _edits.length, s: _snapshots.length, p: _pulseEffects.length };

    if (beacon && typeof navigator !== 'undefined' && navigator.sendBeacon) {
      const ok = navigator.sendBeacon(url, new Blob([body], { type: 'application/json' }));
      if (ok) { drain(sentCounts); }
      return;
    }
    if (typeof fetch === 'undefined') return;
    fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body, keepalive: true })
      .then(res => {
        if (res && res.ok) { _attempt = 0; drain(sentCounts); }
        else { scheduleRetry(); }
      })
      .catch(() => scheduleRetry());
  } catch { /* never throw */ }
}

function drain(sent) {
  _events.splice(0, sent.e);
  _edits.splice(0, sent.d);
  _snapshots.splice(0, sent.s);
  _pulseEffects.splice(0, sent.p || 0);
  _droppedCount = 0;
  if (!_events.length && !_edits.length && !_snapshots.length && !_pulseEffects.length) clearSpill();
  else scheduleSpill();
}

function scheduleRetry() {
  if (_attempt >= MAX_ATTEMPTS) { _attempt = 0; scheduleSpill(); return; } // re-spill for next session
  const delay = BACKOFF_MS[Math.min(_attempt, BACKOFF_MS.length - 1)];
  _attempt += 1;
  try { setTimeout(() => flush(), delay); } catch { /* ignore */ }
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
  _events = []; _edits = []; _snapshots = []; _pulseEffects = []; _droppedCount = 0; _attempt = 0; _ring = [];
  clearSpill();
}
