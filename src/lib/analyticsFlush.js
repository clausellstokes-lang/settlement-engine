/**
 * analyticsFlush.js — the LAZY flush half of the first-party analytics transport
 * (the applier of the eager-leaf/lazy-applier split; the eager leaf is
 * analyticsQueue.js).
 *
 * Owns everything that runs at FLUSH time: the consent purge, envelope build
 * (incl. the sessionId + corpus + market stamps), the per-envelope snapshot cap,
 * the network send (fetch / sendBeacon), drain accounting, and retry/backoff.
 * Loaded via a memoized dynamic import from analyticsQueue — PRIMED on the first
 * enqueue — so none of this, nor lib/sessionId.js (which ONLY this module
 * imports), reaches the first-paint entry closure (the FP-2a dep-import pattern;
 * asserted by tests/build/vendorPdfLazy.test.js's closure ratchet).
 *
 * ⚠️ Do NOT import this module statically from any eager module — the ONLY
 * importer must be analyticsQueue's loadFlush() dynamic import (plus tests).
 *
 * The queue lanes live in analyticsQueueState.js (shared with the eager leaf —
 * NOT imported from analyticsQueue itself, so the pair stays acyclic under the
 * layerBoundaries cycle ratchet); this module reads and mutates them in place.
 */

import { getConsent } from './consent.js';
import { EVENTS_REV } from './analyticsEvents.js';
import { getSessionId } from './sessionId.js';
import { __queueState as S, recordBytes, scheduleSpill, clearSpill } from './analyticsQueueState.js';

const MAX_ENVELOPE_BYTES = 256 * 1024; // ingest payload ceiling — force-drain to fit, never no-op
const MAX_ATTEMPTS = 5;
const BACKOFF_MS = [1_000, 4_000, 16_000, 60_000, 60_000];

// Snapshot-cap contract (lib-infra-3): the client sends at most this many snapshots
// per envelope; the ingest fn keeps the SAME cap and counts any overflow as rejected.
// Both sides are pinned to this value by a cross-contract test (client ≤ server),
// so a multi-settlement export can never silently lose member snapshots the way the
// old client-sends-all / server-slice(0,2) mismatch did. Overflow stays queued and
// drains on the next flush.
export const MAX_SNAPSHOTS_PER_ENVELOPE = 20;

let _attempt = 0;
let _inFlight = false; // guards against overlapping flushes (interval + size-trigger + retry)
// Tracked retry handle so a queued backoff retry can be cancelled when a later
// flush already succeeded (no double-fire) and on reset (no cross-test leak).
let _retryTimer = null;

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

// ── Provenance corpus stamp (PHASE6_DATA_LIFECYCLE.md §1) ─────────────────────
// Every envelope is stamped with the corpus it came from so the research plane
// can filter by data source (and structurally exclude synthetic/dogfood from any
// production dataset): 'synthetic' = deterministic sweeps + e2e/test runs;
// 'dogfood' = the owner's / elevated users' own usage; 'production' = real users
// (the default). Precedence: synthetic wins even for an elevated user (an e2e run
// is synthetic regardless of who is logged in), matching §1's "e2e runs" row.
// The elevated predicate is host-registered on the EAGER leaf (setAnalyticsElevated)
// and read here at flush time via the shared state.
function isSyntheticContext() {
  try {
    const env = /** @type {any} */ (import.meta.env) || {};
    if (env.MODE === 'test') return true;                 // vitest / unit
    if (env.VITE_E2E_LOCAL_DATA === 'true') return true;  // playwright / e2e
  } catch { /* import.meta may be unavailable */ }
  try { if (/** @type {any} */ (globalThis)?.process?.env?.VITEST) return true; } catch { /* ignore */ }
  return false;
}
function resolveCorpus() {
  if (isSyntheticContext()) return 'synthetic';
  try { if (S.elevatedGetter && S.elevatedGetter() === true) return 'dogfood'; } catch { /* a bad getter must never break transport */ }
  return 'production';
}

// ── sessionId stamp (lib-infra-5) ─────────────────────────────────────────────
// Default: this module's own lib/sessionId import (zero eager — it folds into this
// lazy chunk). A host/test-registered getter on the eager seam overrides it. The
// ingest fn validates body.sessionId with uuidOrNull, so a non-uuid id is dropped
// server-side (no cross-session identity).
function resolveSessionId() {
  const g = S.sessionIdGetter;
  if (g) {
    try { const v = g(); return typeof v === 'string' ? v : undefined; }
    catch { return undefined; } // a bad getter must never break transport
  }
  try { const v = getSessionId(); return typeof v === 'string' ? v : undefined; }
  catch { return undefined; }
}

// ── Consent purge (research revoked → drop research-plane records) ────────────
function purgeRevoked() {
  const c = getConsent();
  if (!c.research) {
    S.events = S.events.filter(e => e._class !== 'research');
    S.edits = [];
    // lib-infra-2: a snapshot carrying a `structural` payload was BUILT under
    // research consent (researchCapture only builds it then, and the research-tier
    // hot columns ride the same payload), so revoking research consent purges those
    // records here at flush time — the key is already on the record, so no per-record
    // tier stamp is needed at enqueue. A product-tier snapshot (no structural) carries
    // no research columns and legitimately survives revocation.
    S.snapshots = S.snapshots.filter(s => !(s && s.structural && typeof s.structural === 'object'));
    S.pulseEffects = [];
  }
  if (!c.essential) { // full opt-out / DNT → nothing first-party either
    S.events = []; S.edits = []; S.snapshots = []; S.pulseEffects = [];
  }
}

/**
 * Drop the single largest queued record across all planes. Returns true if one was
 * dropped. Used by doFlush() to force an oversize envelope under the byte ceiling
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
  const best = pickLargest([S.pulseEffects, S.edits, S.snapshots]) || pickLargest([S.events]);
  if (!best) return false;
  best.arr.splice(best.idx, 1);
  S.droppedCount += 1;
  return true;
}

function buildEnvelope() {
  const c = getConsent();
  return {
    batchId: uuid(),
    sessionId: resolveSessionId(), // lib-infra-5 (seam override → lib/sessionId default)
    deviceToken: deviceToken(),
    appVersion: appVersion(),
    eventsRev: EVENTS_REV,
    consent: c.research ? 'research' : 'product',
    // Market-insights consent plane (design §5): whether this actor opted IN to the
    // sellable aggregate. Off by default (MARKET_INSIGHTS_DEFAULT); omitted when false.
    market: c.market === true || undefined,
    corpus: resolveCorpus(),
    droppedCount: S.droppedCount || undefined,
    events: S.events.map((e, i) => ({ seq: i, event: e.event, ts: e.ts, props: e.props, subjectId: e.subjectId })),
    edits: S.edits.map((e, i) => ({ seq: 1000 + i, ...e })),
    // Cap the per-envelope snapshot batch (lib-infra-3): the ingest fn keeps the same
    // MAX_SNAPSHOTS_PER_ENVELOPE; the overflow stays queued and drains on the next flush.
    snapshots: S.snapshots.slice(0, MAX_SNAPSHOTS_PER_ENVELOPE).map((s, i) => ({ seq: 2000 + i, ...s })),
    pulseEffects: S.pulseEffects.map((p, i) => ({ seq: 3000 + i, ...p })),
  };
}

/**
 * Flush the queue. Fire-and-forget; never throws. Uses beacon when leaving.
 * Callers reach this through the eager leaf's flush()/flushOnLeave() wrappers,
 * which own the isConfigured gate and the not-yet-loaded fallbacks.
 */
export function doFlush({ beacon = false } = {}) {
  try {
    // In-flight guard: a fetch already in flight will drain on success; a second
    // concurrent flush (interval / size-trigger / retry) would double-POST the same
    // batch and desync the backoff counter. Beacon is the last-chance leave path and
    // is always allowed (it can't observe the fetch promise anyway).
    if (_inFlight && !beacon) return;
    purgeRevoked();
    if (!S.events.length && !S.edits.length && !S.snapshots.length && !S.pulseEffects.length) return;
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
    if (!S.events.length && !S.edits.length && !S.snapshots.length && !S.pulseEffects.length) return;

    // Snapshot what we're sending so a concurrent enqueue isn't lost on success. The
    // snapshot lane is capped per envelope (buildEnvelope slice), so only that many are
    // actually delivered — drain must splice the SENT count, not the whole lane, or the
    // uncapped overflow would be dropped undelivered.
    const sentCounts = {
      e: S.events.length, d: S.edits.length,
      s: Math.min(S.snapshots.length, MAX_SNAPSHOTS_PER_ENVELOPE), p: S.pulseEffects.length,
    };

    if (beacon && typeof navigator !== 'undefined' && navigator.sendBeacon) {
      const ok = navigator.sendBeacon(url, new Blob([body], { type: 'application/json' }));
      if (ok) { drain(sentCounts); }
      return;
    }
    if (typeof fetch === 'undefined') return;
    _inFlight = true;
    fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body, keepalive: true })
      .then(res => {
        _inFlight = false;
        if (res && res.ok) { _attempt = 0; drain(sentCounts); }
        else { scheduleRetry(); }
      })
      .catch(() => { _inFlight = false; scheduleRetry(); });
  } catch { _inFlight = false; /* never throw, never wedge the guard */ }
}

function drain(sent) {
  // A successful delivery supersedes any queued backoff retry — cancel it so it
  // can't double-fire a redundant flush after we've already shipped.
  if (_retryTimer) { try { clearTimeout(_retryTimer); } catch { /* ignore */ } _retryTimer = null; }
  S.events.splice(0, sent.e);
  S.edits.splice(0, sent.d);
  S.snapshots.splice(0, sent.s);
  S.pulseEffects.splice(0, sent.p || 0);
  S.droppedCount = 0;
  if (!S.events.length && !S.edits.length && !S.snapshots.length && !S.pulseEffects.length) clearSpill();
  else scheduleSpill();
}

function scheduleRetry() {
  if (_attempt >= MAX_ATTEMPTS) { _attempt = 0; scheduleSpill(); return; } // re-spill for next session
  const delay = BACKOFF_MS[Math.min(_attempt, BACKOFF_MS.length - 1)];
  _attempt += 1;
  // Track the handle so a later success (drain) or a reset can cancel it.
  try { _retryTimer = setTimeout(() => { _retryTimer = null; doFlush(); }, delay); } catch { /* ignore */ }
}

/** Test seam: reset flush-time state (called by analyticsQueue.__resetQueueForTests). */
export function __resetFlushForTests() {
  _attempt = 0; _inFlight = false;
  if (_retryTimer) { try { clearTimeout(_retryTimer); } catch { /* ignore */ } _retryTimer = null; }
}
