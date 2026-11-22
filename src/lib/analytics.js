/**
 * analytics.js - funnel + event tracking entry point.
 *
 *   import { track, EVENTS } from '../lib/analytics.js';
 *   track(EVENTS.HOMEPAGE_VIEW);
 *   track(EVENTS.GENERATION_COMPLETED, { tier: 'town' });
 *
 * The event registry now lives in analyticsEvents.js (so the edge ingest
 * function can validate against the same frozen contract); this file re-exports
 * EVENTS so all existing call sites and the `funnel-event-contract` ESLint rule
 * are untouched.
 *
 * Two transport planes (doc §6/§9):
 *   - First-party sink (analyticsQueue) — CANONICAL. Receives every consented
 *     event; the ONLY home for research-class data.
 *   - Third-party mirror (window.__sf_analytics_provider — Plausible/PostHog) —
 *     receives ESSENTIAL-class events only. Research data never leaves
 *     first-party storage.
 *
 * Consent + privacy:
 *   - Three-tier consent (consent.js): research-class events are dropped unless
 *     research consent is granted; an essential opt-out / DNT silences all.
 *   - No PII. Coarse props only (enums, bands, counts) — never names/prose.
 *   - User id is hashed (sha-256 → 16 chars) before any third-party send.
 *   - DNT respected client-side regardless of provider.
 */

import { EVENTS, EVENT_CLASS, classForEvent } from './analyticsEvents.js';
import { getConsent, isClassAllowed, dntEnabled } from './consent.js';
import { enqueueEvent } from './analyticsQueue.js';

export { EVENTS, EVENT_CLASS };

// Per-event dev breadcrumb gate: ON in real dev, OFF under the test runner.
// This console.info fires on EVERY successful track(), and track() is reached
// through fire-and-forget dynamic imports (settlementSlice's edit/generation/
// regional hooks). Vitest runs in DEV mode (import.meta.env.DEV === true), so
// those late-resolving breadcrumbs landed during worker teardown and tripped
// vitest's "Closing rpc while onUserConsoleLog was pending" race — an
// intermittent, cross-file gate failure with no real test impact. Suppressing
// just this high-frequency breadcrumb under test removes the race and the noise;
// the error-path warns below stay on plain DEV so their tests still observe them
// (they only fire on edge cases that the fire-and-forget paths never hit).
const DEV_LOG = !!import.meta?.env?.DEV
  && import.meta?.env?.MODE !== 'test'
  && !(/** @type {any} */ (globalThis)?.process?.env?.VITEST);

// ── Anon-prior tracking (drives SIGNUP_AFTER_ANON / PAID_AFTER_ANON) ───────
const ANON_GENERATED_FLAG = 'sf_anon_generated_v1';

export function markAnonGenerated() {
  try {
    if (typeof localStorage !== 'undefined') localStorage.setItem(ANON_GENERATED_FLAG, '1');
  } catch { /* localStorage unavailable */ }
}

export function hasPriorAnonGeneration() {
  try {
    return typeof localStorage !== 'undefined' && localStorage.getItem(ANON_GENERATED_FLAG) === '1';
  } catch { return false; }
}

// ── User-id hashing (privacy floor, for the third-party mirror only) ─────────
let _hashCache = new Map();
async function hashUserId(userId) {
  if (!userId) return null;
  if (_hashCache.has(userId)) return _hashCache.get(userId);
  if (typeof crypto === 'undefined' || !crypto.subtle) return null;
  try {
    const enc = new TextEncoder().encode(userId);
    const buf = await crypto.subtle.digest('SHA-256', enc);
    const arr = Array.from(new Uint8Array(buf));
    const hex = arr.map(b => b.toString(16).padStart(2, '0')).join('');
    const truncated = hex.slice(0, 16);
    _hashCache.set(userId, truncated);
    return truncated;
  } catch {
    return null;
  }
}

// ── Third-party provider mirror ──────────────────────────────────────────────
async function sendToProvider(event, props) {
  if (typeof window !== 'undefined' && typeof window.__sf_analytics_provider === 'function') {
    try {
      window.__sf_analytics_provider(event, props);
    } catch (e) {
      if (import.meta?.env?.DEV) console.warn('[analytics] provider threw:', e?.message);
    }
    return;
  }
  if (DEV_LOG) console.info(`[analytics] ${event}`, props);
}

// ── Public API ─────────────────────────────────────────────────────────────
/**
 * Track an analytics event. Fire-and-forget; never throws.
 *
 * @param {string} event - one of EVENTS.* constants
 * @param {Object} [props] - coarse properties only (enums/bands/counts, no PII)
 * @param {Object} [opts]
 * @param {string|null} [opts.userId] - Supabase user id; hashed before any mirror
 * @param {string} [opts.subjectId] - settlement/map uuid when relevant
 */
export function track(event, props = {}, opts = {}) {
  if (!event || typeof event !== 'string') return;
  if (dntEnabled()) return;

  // Whitelist - only known events. Catches call-site typos.
  const known = /** @type {string[]} */ (Object.values(EVENTS));
  if (!known.includes(event)) {
    if (import.meta?.env?.DEV) console.warn(`[analytics] unknown event: ${event}`);
    return;
  }

  // Consent + class gate. Research-class events are dropped without research
  // consent; an essential opt-out silences everything.
  const klass = classForEvent(event) || 'essential';
  const consent = getConsent();
  if (!isClassAllowed(klass, consent)) return;

  // First-party canonical sink (research data lives here only).
  enqueueEvent(event, props, { _class: klass, subjectId: opts.subjectId });

  // Third-party mirror — ESSENTIAL class ONLY.
  if (klass !== 'essential') return;
  if (opts.userId) {
    hashUserId(opts.userId).then(hashed => sendToProvider(event, { ...props, userIdHash: hashed || undefined }));
  } else {
    sendToProvider(event, props);
  }
}

/**
 * Convenience for the critical funnel events - wraps `track` with their
 * conditional-firing rules. Also exposes a generic `track` passthrough.
 */
export const Funnel = Object.freeze({
  track,

  homepageView() {
    // sessionStorage can throw (Safari private mode, storage-blocked browsers).
    // The dedup guard is best-effort; on any storage error we skip it and still
    // fire the event, so this documented never-throws path stays true.
    try {
      if (typeof sessionStorage !== 'undefined') {
        if (sessionStorage.getItem('sf_homepage_view_sent') === '1') return;
        sessionStorage.setItem('sf_homepage_view_sent', '1');
      }
    } catch { /* storage unavailable — fall through and fire the event */ }
    track(EVENTS.HOMEPAGE_VIEW);
  },

  anonGenerationCompleted({ tier } = /** @type {{ tier?: string }} */ ({})) {
    markAnonGenerated();
    track(EVENTS.ANONYMOUS_GENERATION_COMPLETED, { tier });
  },

  signupCompleted({ userId } = /** @type {{ userId?: string }} */ ({})) {
    track(EVENTS.SIGNUP_COMPLETED, {}, { userId });
    if (hasPriorAnonGeneration()) track(EVENTS.SIGNUP_AFTER_ANON, {}, { userId });
  },

  paidAction({ kind, userId } = /** @type {{ kind?: string, userId?: string }} */ ({})) {
    if (hasPriorAnonGeneration()) track(EVENTS.PAID_AFTER_ANON, { kind }, { userId });
  },
});
