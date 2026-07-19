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

// ── Dedup + per-session sampling cap ─────────────────────────────────────────
// A render-loop crash or a rejection fired every frame must not flood the sink.
// The server side is rate-limited per IP (log-client-error: 60/min), but that is
// a storage-bill backstop, not noise control — a single tab in a crash loop can
// still emit hundreds of identical reports inside one minute. So we gate the
// NETWORK send (never the local console) two ways, both in-session and in-memory
// only (no storage, no PII): send each distinct signature at most once, and never
// more than MAX_REPORTS_PER_SESSION reports total.
const MAX_REPORTS_PER_SESSION = 25;
const sentSignatures = new Set();
let sentCount = 0;

/**
 * Compact, stable per-error signature (dedup key only — computed client-side,
 * never sent). Derived from kind + message + the first stack frame, hashed with
 * FNV-1a into base36 so two crashes from the same site collapse to one report.
 * @param {{kind?:string,message?:string,stack?:string}} payload
 * @returns {string}
 */
function signatureOf(payload) {
  return safe(() => {
    const firstFrame =
      String(payload.stack || '')
        .split('\n')
        .map((l) => l.trim())
        .find((l) => /\bat\b|@/.test(l)) || '';
    const basis = `${payload.kind}\n${payload.message}\n${firstFrame}`;
    let h = 0x811c9dc5;
    for (let i = 0; i < basis.length; i++) {
      h ^= basis.charCodeAt(i);
      h = Math.imul(h, 0x01000193);
    }
    return (h >>> 0).toString(36);
  }) || '';
}

/** Test-only reset of the in-session dedup/cap state. No-op cost in production. */
export function __resetErrorReporterState() {
  sentSignatures.clear();
  sentCount = 0;
}

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
    url: safe(() => location.href) || '',
    ua: safe(() => navigator.userAgent) || '',
    ts: safe(() => new Date().toISOString()) || '',
    release: safe(() => import.meta.env.VITE_RELEASE) || '',
  };

  // Always surface locally (no-console is intentionally off in this repo).
  console.error('[error]', payload.kind, payload.message);

  if (!ENDPOINT) return;

  // Dedup + cap the network send (see MAX_REPORTS_PER_SESSION above).
  const sig = signatureOf(payload);
  if (sig && sentSignatures.has(sig)) return;
  if (sentCount >= MAX_REPORTS_PER_SESSION) return;
  if (sig) sentSignatures.add(sig);
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
