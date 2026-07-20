/**
 * errorReporter.js - provider-agnostic client error reporting.
 *
 * The app previously had no production error tracking: render crashes and
 * unhandled rejections were only console.error'd, so they were invisible once
 * shipped. This is the minimal hook - a single `reportError(error, context)`
 * that ALWAYS logs locally, and - when `VITE_ERROR_REPORT_URL` is configured -
 * fire-and-forgets a compact JSON payload (sendBeacon, falling back to
 * fetch+keepalive). Network is a no-op when the env var is unset, so dev and
 * self-host stay quiet.
 *
 * Point `VITE_ERROR_REPORT_URL` at any sink (a Supabase edge function, a
 * Sentry tunnel, Logflare, etc.). The payload is intentionally tiny and
 * PII-light: message, stack, componentStack, url, user-agent, timestamp,
 * release. The reporter never throws.
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
  const payload = {
    kind: context.kind || 'error',
    message: safe(() => String(e?.message ?? e)) || 'unknown error',
    stack: (safe(() => String(e?.stack || '')) || '').slice(0, 4000),
    componentStack: (safe(() => String(context.componentStack || '')) || '').slice(0, 4000),
    // Origin + pathname ONLY — never the query string or fragment. Those can carry
    // single-use secrets (e.g. the founder-transfer one-click abort token in
    // ?transfer_abort=<token>) that must not be persisted into the client_error_events
    // sink. Honors the app's "no sensitive data in URL params" rule at the log boundary.
    url: safe(() => location.origin + location.pathname) || '',
    ua: safe(() => navigator.userAgent) || '',
    ts: safe(() => new Date().toISOString()) || '',
    release: safe(() => import.meta.env.VITE_RELEASE) || '',
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
