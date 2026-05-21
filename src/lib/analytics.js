/**
 * analytics.js — Tier 8.8 / 8.9 funnel + event tracking.
 *
 * Single-export entry point. Callers do:
 *
 *   import { track, EVENTS } from '../lib/analytics.js';
 *   track(EVENTS.HOMEPAGE_VIEW);
 *   track(EVENTS.ANONYMOUS_GENERATION_COMPLETED, { tier: 'town' });
 *
 * Provider-agnostic by design. The actual transport is one swap:
 *   - Default: dev-mode console log + no-op in prod (safe to ship
 *     without a provider token). Lets us validate the call-site
 *     placements before paying for a tool.
 *   - To enable a real provider:
 *       npm i @vercel/analytics  // or posthog-js / plausible-tracker / mixpanel-browser
 *       set ANALYTICS_PROVIDER in the dispatch table below
 *       set VITE_ANALYTICS_TOKEN in .env / Vercel project env
 *
 * Funnel hierarchy — Tier 8.8 ships only the *minimum 4*:
 *   - HOMEPAGE_VIEW                 — anonymous landing impression
 *   - ANONYMOUS_GENERATION_COMPLETED— anon hit the engine successfully
 *   - SIGNUP_AFTER_ANON             — auth completed AFTER a prior anon gen
 *     (so we know the funnel converted, not just "someone signed up")
 *   - PAID_AFTER_ANON               — paid action following an anon
 *
 * Tier 8.9 expands to the full 19-event schema (constants defined
 * here so wiring is a one-import addition per call site). Validation
 * gate (per the roadmap): build the full schema only after the 4
 * minimum events show movement.
 *
 * Privacy posture:
 *   - No PII. Events carry coarse properties (tier, route, settlement
 *     size band) — never names, emails, settlement contents.
 *   - User id is hashed before send (sha-256 → first 16 chars).
 *     Sufficient for funnel correlation; useless for re-identifying
 *     a user from event logs.
 *   - DNT is respected: navigator.doNotTrack === '1' silences all
 *     events client-side regardless of provider.
 */

// ── Event constants ────────────────────────────────────────────────────────
// Tier 8.8 minimum + Tier 8.9 full schema, frozen so call sites get
// autocomplete + drift protection. Names are snake_case stable strings;
// renames here will break dashboards downstream, so they're locked in.

export const EVENTS = Object.freeze({
  // ── Tier 8.8 — minimum 4-event funnel ─────────────────────────────────
  HOMEPAGE_VIEW:                  'homepage_view',
  ANONYMOUS_GENERATION_COMPLETED: 'anonymous_generation_completed',
  SIGNUP_AFTER_ANON:              'signup_after_anon',
  PAID_AFTER_ANON:                'paid_after_anon',

  // ── Tier 8.9 — full schema (queue; ship as call sites are wired) ──────
  ANONYMOUS_GENERATION_STARTED:   'anonymous_generation_started',
  DOSSIER_PREVIEW_VIEWED:         'dossier_preview_viewed',
  HOW_SIMULATED_OPENED:           'how_simulated_opened',
  SIGNUP_GATE_SEEN:               'signup_gate_seen',
  SIGNUP_STARTED:                 'signup_started',
  SIGNUP_COMPLETED:               'signup_completed',
  SETTLEMENT_SAVED:               'settlement_saved',
  PDF_EXPORT_CLICKED:             'pdf_export_clicked',
  SINGLE_DOSSIER_CHECKOUT_STARTED:'single_dossier_checkout_started',
  SINGLE_DOSSIER_PURCHASED:       'single_dossier_purchased',
  PREMIUM_MODAL_SEEN:             'premium_modal_seen',
  PREMIUM_CHECKOUT_STARTED:       'premium_checkout_started',
  PREMIUM_PURCHASED:              'premium_purchased',
  AI_NARRATIVE_CLICKED:           'ai_narrative_clicked',
  AI_NARRATIVE_COMPLETED:         'ai_narrative_completed',
  CREDITS_EXHAUSTED:              'credits_exhausted',
  NEIGHBOR_PREVIEW_CLICKED:       'neighbor_preview_clicked',
  UPGRADE_AFTER_NEIGHBOR_CLICKED: 'upgrade_after_neighbor_clicked',
});

// ── Anon-prior tracking (drives SIGNUP_AFTER_ANON / PAID_AFTER_ANON) ───────
// We mark a localStorage flag the first time an anonymous user completes
// a generation. On signup, if the flag is set we fire SIGNUP_AFTER_ANON
// instead of (or in addition to) the generic SIGNUP_COMPLETED. The flag
// is intentionally never cleared — once a user converted via the anon
// funnel, that's permanent attribution.

const ANON_GENERATED_FLAG = 'sf_anon_generated_v1';

export function markAnonGenerated() {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(ANON_GENERATED_FLAG, '1');
    }
  } catch { /* localStorage unavailable */ }
}

export function hasPriorAnonGeneration() {
  try {
    return typeof localStorage !== 'undefined' && localStorage.getItem(ANON_GENERATED_FLAG) === '1';
  } catch { return false; }
}

// ── DNT check ──────────────────────────────────────────────────────────────
function dntEnabled() {
  if (typeof navigator === 'undefined') return false;
  // Various browsers / older API shapes.
  return (
    navigator.doNotTrack === '1' ||
    // @ts-ignore
    window?.doNotTrack === '1' ||
    // @ts-ignore
    navigator.msDoNotTrack === '1'
  );
}

// ── User-id hashing (privacy floor) ────────────────────────────────────────
// Uses the Web Crypto SubtleCrypto API in browsers. Hash output is
// truncated to 16 chars — plenty for funnel correlation, not enough to
// reverse to a user id.
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

// ── Provider dispatch ──────────────────────────────────────────────────────
// Default provider: dev-mode console log, no-op in prod. To enable a
// real provider, replace the implementation of `sendToProvider` below
// or set the `__sf_analytics_provider` global from a side-load script.

async function sendToProvider(event, props) {
  // Look for a user-installed provider on the window. This lets a tag-
  // manager or product-analytics SDK plug in without modifying this
  // file. The provider receives the raw event/props.
  if (typeof window !== 'undefined' && typeof window.__sf_analytics_provider === 'function') {
    try {
      window.__sf_analytics_provider(event, props);
    } catch (e) {
      if (import.meta?.env?.DEV) {

        console.warn('[analytics] provider threw:', e?.message);
      }
    }
    return;
  }
  // No provider installed; in DEV, log the call for inspection.
  if (import.meta?.env?.DEV) {

    console.info(`[analytics] ${event}`, props);
  }
}

// ── Public API ─────────────────────────────────────────────────────────────

/**
 * Track an analytics event. Fire-and-forget; never throws or returns
 * a promise the caller has to await.
 *
 * @param {string} event — one of EVENTS.* constants
 * @param {Object} [props] — optional event properties (coarse only, no PII)
 * @param {Object} [opts]
 * @param {string|null} [opts.userId] — Supabase user id; hashed before send
 */
export function track(event, props = {}, opts = {}) {
  if (!event || typeof event !== 'string') return;
  if (dntEnabled()) return;

  // Whitelist check — only fire known events. Catches typos at the
  // call site that would otherwise produce garbage in the dashboard.
  const known = Object.values(EVENTS);
  if (!known.includes(event)) {
    if (import.meta?.env?.DEV) {

      console.warn(`[analytics] unknown event: ${event}`);
    }
    return;
  }

  // Sync provider call — fire-and-forget. The async hashing path
  // resolves separately and updates the payload before send if the
  // user id was supplied.
  if (opts.userId) {
    hashUserId(opts.userId).then(hashed => {
      sendToProvider(event, { ...props, userIdHash: hashed || undefined });
    });
  } else {
    sendToProvider(event, props);
  }
}

/**
 * Convenience for the four critical funnel events — wraps `track`
 * with their conditional-firing rules so call sites don't have to
 * remember them.
 */
export const Funnel = Object.freeze({
  /** Anonymous landing impression. Fire once per session. */
  homepageView() {
    if (typeof sessionStorage !== 'undefined') {
      if (sessionStorage.getItem('sf_homepage_view_sent') === '1') return;
      sessionStorage.setItem('sf_homepage_view_sent', '1');
    }
    track(EVENTS.HOMEPAGE_VIEW);
  },

  /** Anon completed a settlement generation. Marks the conversion attribution. */
  anonGenerationCompleted({ tier } = {}) {
    markAnonGenerated();
    track(EVENTS.ANONYMOUS_GENERATION_COMPLETED, { tier });
  },

  /** Signup completed — only fires the "after_anon" variant when the
   *  user had a prior anon generation. The generic SIGNUP_COMPLETED is
   *  always fired alongside. */
  signupCompleted({ userId } = {}) {
    track(EVENTS.SIGNUP_COMPLETED, {}, { userId });
    if (hasPriorAnonGeneration()) {
      track(EVENTS.SIGNUP_AFTER_ANON, {}, { userId });
    }
  },

  /** Paid action (single dossier / premium / founder). "After_anon"
   *  attribution fires when applicable. */
  paidAction({ kind, userId } = {}) {
    if (hasPriorAnonGeneration()) {
      track(EVENTS.PAID_AFTER_ANON, { kind }, { userId });
    }
  },
});
