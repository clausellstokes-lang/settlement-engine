/**
 * errorReporter.js - provider-agnostic client error reporting.
 *
 * The app previously had no production error tracking: render crashes and
 * unhandled rejections were only console.error'd, so they were invisible once
 * shipped. This is the minimal hook - a single `reportError(error, context)`
 * that logs every application error locally, and - when `VITE_ERROR_REPORT_URL`
 * is configured - fire-and-forgets a compact JSON payload (sendBeacon, falling
 * back to fetch+keepalive). Network is a no-op when the env var is unset, so dev
 * and self-host stay quiet. The ONE class it drops on both paths is a benign
 * browser NOTICE that is not an application error at all - dropped from the error
 * log and the beacon, but announced once per page load at DEBUG level so the
 * suppression is never invisible - see BENIGN_BROWSER_NOTICES below for the whole
 * list and the reasoning.
 *
 * Point `VITE_ERROR_REPORT_URL` at any sink (a Supabase edge function, a
 * Sentry tunnel, Logflare, etc.). The payload is intentionally tiny and
 * PII-light: message, stack, componentStack, url, user-agent, timestamp,
 * release. The reporter never throws.
 *
 * R-14 CRASH FORENSICS BY CONSTRUCTION: because the world is deterministic, a
 * crash reproduces locally from FOUR small values — seed + tick + flags_on +
 * build hash (`release`). The store registers a forensics provider at boot
 * (setCrashForensics); reportError snapshots it and WHITELISTS three scalar
 * fields (`forensics: { seed, tick, flags_on }`) into the payload — with the
 * `release` build hash that is already captured, those four values regenerate the
 * exact world state a crash happened in. The whitelist is the no-leak guarantee
 * BY CONSTRUCTION: even if the provider returns a fat object, only the three
 * type-coerced scalars survive — never world state, never PII (the prop-hygiene
 * law). @enforced-by tests/lib/errorReporter.test.js (the forensics shape +
 * no-state pins).
 */

const ENDPOINT =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_ERROR_REPORT_URL) || '';

function safe(fn) {
  try {
    return fn();
  } catch {
    return undefined;
  }
}

// ── R-14 crash-forensics seam ────────────────────────────────────────────────
// The store registers a provider at boot returning the reproduction coordinates
// of the active world. errorReporter stays store-/React-free (a pure lib), so the
// store injects the reader rather than this module importing the store.
/** @type {(() => unknown) | null} */
let _forensicsProvider = null;

/**
 * Register the crash-forensics provider (called once at store init). The provider
 * returns the active world's reproduction coordinates; whatever else it returns is
 * discarded by the whitelist in `forensicsSnapshot`.
 * @param {(() => unknown) | null | undefined} provider
 */
export function setCrashForensics(provider) {
  _forensicsProvider = typeof provider === 'function' ? provider : null;
}

const SEED_MAX = 200;      // seeds are short opaque generation strings; cap defensively
const FLAGS_MAX = 100;     // the flag registry is ~30 entries; cap far above it

/**
 * Snapshot the forensics provider and WHITELIST it to exactly three type-coerced
 * scalar fields. This is the structural no-leak guarantee: no matter what the
 * provider returns, only { seed, tick, flags_on } — all primitives — can escape
 * into the payload. Never throws (a broken provider yields an empty snapshot).
 * @returns {{ seed?: string, tick?: number, flags_on?: string[] }}
 */
function forensicsSnapshot() {
  const raw = safe(() => (_forensicsProvider ? _forensicsProvider() : null));
  if (!raw || typeof raw !== 'object') return {};
  const out = {};
  // seed — a string or number generation coordinate only.
  const seed = /** @type {any} */ (raw).seed;
  if (typeof seed === 'string' || typeof seed === 'number') {
    const s = String(seed).slice(0, SEED_MAX);
    if (s) out.seed = s;
  }
  // tick — a finite world-clock integer only.
  const tick = /** @type {any} */ (raw).tick;
  if (typeof tick === 'number' && Number.isFinite(tick)) out.tick = tick;
  // flags_on — a bounded array of flag NAMES (strings) only; never values/objects.
  const flags = /** @type {any} */ (raw).flags_on;
  if (Array.isArray(flags)) {
    const names = flags.filter((f) => typeof f === 'string').slice(0, FLAGS_MAX);
    out.flags_on = names;
  }
  return out;
}

// ── Benign browser notices — NOT application errors ──────────────────────────
// "ResizeObserver loop completed with undelivered notifications." (and its older
// spelling, "ResizeObserver loop limit exceeded") is a NOTICE the engine posts to
// window.onerror when an observer callback changes layout and the remaining
// notifications are deferred to the next frame. Nothing is dropped — the observer
// runs again on that frame — and the notice arrives with no Error object and no
// stack, so it is unactionable by construction. It is also emitted by ordinary
// correct code: the Realm alone runs measure-then-write observers in MapOverlay,
// useChromeInsets and useChromeWidth, and a desktop Realm mount reported it twice.
// Reporting it as an error buried real crashes in the console AND spent the
// per-session beacon budget below on a non-event. Dropped at this ONE chokepoint,
// before the ERROR log and before the network send. Every other error is untouched.
//
// It is dropped, not erased. A suppression with no trace of its own is how a
// genuine runaway observer loop — one that really does thrash layout — becomes
// invisible to the developer who has to find it. So the FIRST match per page load
// leaves one console.debug naming the class that was dropped; every later match is
// silent, because a real loop fires this notice on every frame and a per-match
// breadcrumb would be the flood the filter exists to stop. Debug is deliberately
// below the console's default level: present when someone goes looking, absent
// from the honest-console bar this filter was written to clear. It never reaches
// the beacon path — a notice is not worth a report at any volume.
const BENIGN_BROWSER_NOTICES = new Set([
  'resizeobserver loop completed with undelivered notifications',
  'resizeobserver loop limit exceeded',
]);

// The breadcrumb above, rate-limited to once per page load for the whole class
// (module scope — a reload starts a fresh session, which is exactly the scope a
// "was anything suppressed here?" question is asked in).
let benignNoticeAnnounced = false;

/**
 * True only for a known benign browser notice. Browsers vary the ENVELOPE (an
 * "Uncaught " prefix, a trailing full stop, casing), so the envelope is normalized
 * away and the notice itself is matched EXACTLY — a real application error that
 * merely mentions ResizeObserver still reports.
 * @param {string} message
 */
function isBenignBrowserNotice(message) {
  const normalized = String(message || '')
    .replace(/^\s*uncaught(\s+error)?\s*:?\s*/i, '')
    .replace(/[.\s]+$/, '')
    .trim()
    .toLowerCase();
  return BENIGN_BROWSER_NOTICES.has(normalized);
}

// Dedup + per-session cap on the NETWORK send only (never the local console): a
// render-loop crash must not fire hundreds of identical beacons. In-memory, no
// PII. The signature (kind|message|first-stack-frame) is the dedup key directly —
// send each distinct signature at most once, never more than MAX_REPORTS total.
const MAX_REPORTS = 25;
const seen = new Set();
let sentCount = 0;

/**
 * Report a client error. Always logs; POSTs only when an endpoint is set.
 * @param {unknown} error
 * @param {{ kind?: string, componentStack?: string }} [context]
 */
export function reportError(error, context = {}) {
  const e = /** @type {any} */ (error);
  const message = safe(() => String(e?.message ?? e)) || 'unknown error';
  // A benign browser notice is not an application error (see
  // BENIGN_BROWSER_NOTICES): drop it before the error log AND before the send,
  // leaving ONE debug breadcrumb per page load so the suppression itself is
  // discoverable when a runaway observer loop has to be hunted down.
  if (isBenignBrowserNotice(message)) {
    if (!benignNoticeAnnounced) {
      benignNoticeAnnounced = true;
      console.debug(
        '[errorReporter] suppressed benign browser notice (ResizeObserver loop); not an application error, reported once per page load:',
        message,
      );
    }
    return;
  }
  const payload = {
    kind: context.kind || 'error',
    message,
    stack: (safe(() => String(e?.stack || '')) || '').slice(0, 4000),
    componentStack: (safe(() => String(context.componentStack || '')) || '').slice(0, 4000),
    // Origin + pathname ONLY — never the query string or fragment. Those can carry
    // single-use secrets (e.g. the founder-transfer one-click abort token in
    // ?transfer_abort=<token>) that must not be persisted into the client_error_events
    // sink. Honors the app's "no sensitive data in URL params" rule at the log boundary.
    url: safe(() => location.origin + location.pathname) || '',
    ua: safe(() => navigator.userAgent) || '',
    ts: safe(() => new Date().toISOString()) || '',
    // The build hash — the fourth reproduction value alongside forensics below.
    release: safe(() => import.meta.env.VITE_RELEASE) || '',
    // R-14: seed + tick + flags_on — the three world-reproduction coordinates,
    // whitelisted to scalars (never world state, never PII). Absent when no
    // provider is registered (SSR / pre-boot / self-host with none wired).
    forensics: forensicsSnapshot(),
  };

  // Always surface locally (no-console is intentionally off in this repo).
  console.error('[error]', payload.kind, payload.message);

  if (!ENDPOINT) return;

  // Dedup + cap (see MAX_REPORTS above). payload fields are already strings.
  const sig = payload.kind + '|' + payload.message + '|' + (payload.stack.split('\n')[1] || '');
  if (seen.has(sig) || sentCount >= MAX_REPORTS) return;
  seen.add(sig);
  sentCount += 1;

  const body = safe(() => JSON.stringify(payload));
  if (!body) return;

  // Fire-and-forget. sendBeacon survives page unload; fall back to fetch.
  const beaconed = safe(
    () =>
      typeof navigator !== 'undefined' &&
      typeof navigator.sendBeacon === 'function' &&
      navigator.sendBeacon(ENDPOINT, body),
  );
  if (beaconed) return;

  safe(() =>
    fetch(ENDPOINT, {
      method: 'POST',
      body,
      keepalive: true,
      headers: { 'content-type': 'application/json' },
      // Silent for the USER (an error reporter must never surface errors), but
      // observable for the DEVELOPER — a reporter that silently fails to report
      // is the worst silent failure, so leave a DEV breadcrumb.
    }).catch((e) => { if (import.meta?.env?.DEV) console.warn('[errorReporter] send failed', e?.message); }),
  );
}

let installed = false;

/**
 * Wire window-level error + unhandledrejection to reportError. Idempotent;
 * safe to call once at bootstrap. No-op outside a browser.
 */
export function installGlobalErrorHandlers() {
  if (installed || typeof window === 'undefined') return;
  installed = true;
  window.addEventListener('error', (e) => {
    reportError(e?.error || e?.message, { kind: 'window.error' });
  });
  window.addEventListener('unhandledrejection', (e) => {
    reportError(e?.reason, { kind: 'unhandledrejection' });
  });
}
