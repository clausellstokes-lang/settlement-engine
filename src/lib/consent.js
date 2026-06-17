/**
 * consent.js — three-tier telemetry consent (client side of the model).
 *
 * Tiers (doc §3):
 *   essential — product telemetry. Default ON unless DNT or explicit opt-out.
 *   research  — full structural fingerprints + research-class events. Default OFF,
 *               explicit opt-in only.
 *   ai_prose  — reserved; gates nothing in v1. Named so the UI doesn't churn later.
 *
 * Dependency-free by design (analytics.js imports this; this must not import
 * analytics, or we'd create a cycle). The CONSENT_UPDATED event is fired by the
 * UI caller (PrivacySettings / banner), not here.
 *
 * Server clamps the effective tier (min(client, profiles.telemetry_consent));
 * this client copy decides what is even built/enqueued (defense in depth).
 */

export const CONSENT_KEY = 'sf_consent_v1';
export const CONSENT_TIERS = Object.freeze(['essential', 'research', 'ai_prose']);

/** DNT check — honored as a hard opt-out of ALL telemetry, including essential. */
export function dntEnabled() {
  if (typeof navigator === 'undefined') return false;
  // doNotTrack lives in several non-standard shapes across browsers; cast to any
  // so the type checker (browser-lib-only) doesn't reject the legacy props.
  const nav = /** @type {any} */ (navigator);
  const win = typeof window !== 'undefined' ? /** @type {any} */ (window) : undefined;
  return nav.doNotTrack === '1' || win?.doNotTrack === '1' || nav.msDoNotTrack === '1';
}

function defaults() {
  // essential defaults ON unless DNT; research/ai_prose are opt-in.
  return { essential: !dntEnabled(), research: false, ai_prose: false, updatedAt: 0 };
}

function readRaw() {
  try {
    if (typeof localStorage === 'undefined') return null;
    const raw = localStorage.getItem(CONSENT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

/**
 * Current consent. DNT always forces essential off (it cannot be overridden by
 * a stored grant — DNT is a user-agent-level signal we honor unconditionally).
 * @returns {{essential:boolean, research:boolean, ai_prose:boolean, updatedAt:number}}
 */
export function getConsent() {
  const base = defaults();
  const stored = readRaw();
  const merged = stored && typeof stored === 'object'
    ? {
      essential: stored.essential !== false,
      research: stored.research === true,
      ai_prose: stored.ai_prose === true,
      updatedAt: Number(stored.updatedAt) || 0,
    }
    : base;
  if (dntEnabled()) merged.essential = false; // DNT wins, always
  return merged;
}

/**
 * Update consent. Merges the patch, stamps updatedAt, persists. Returns the new
 * consent. Does NOT fire CONSENT_UPDATED — the caller does (avoids a cycle).
 * `stampMs` lets callers pass a deterministic timestamp (tests); defaults to now.
 */
export function setConsent(patch = {}, stampMs) {
  const cur = getConsent();
  const next = {
    essential: 'essential' in patch ? patch.essential !== false : cur.essential,
    research: 'research' in patch ? patch.research === true : cur.research,
    ai_prose: 'ai_prose' in patch ? patch.ai_prose === true : cur.ai_prose,
    updatedAt: typeof stampMs === 'number' ? stampMs : (cur.updatedAt + 1),
  };
  try {
    if (typeof localStorage !== 'undefined') localStorage.setItem(CONSENT_KEY, JSON.stringify(next));
  } catch { /* storage unavailable — ephemeral consent */ }
  return next;
}

/** Whether an event/data of the given class may be captured under current consent. */
export function isClassAllowed(eventClass, consent = getConsent()) {
  if (eventClass === 'research') return consent.research === true;
  if (eventClass === 'ai_prose') return consent.ai_prose === true;
  return consent.essential === true; // 'essential' (default)
}
