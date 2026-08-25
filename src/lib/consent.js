/**
 * consent.js — three-tier telemetry consent (client side of the model).
 *
 * Tiers (doc §3):
 *   essential — product telemetry. Default ON unless DNT or explicit opt-out.
 *   research  — full structural fingerprints + research-class events. Default now
 *               ON unless DNT (owner-ratified OPT-OUT, consent model v2). Anonymous
 *               structure only — never names/prose/secrets.
 *   ai_prose  — reserved; gates nothing in v1. Named so the UI doesn't churn later.
 *
 * ── Consent model v2 (the research opt-out flip) ─────────────────────────────
 * `research` default flipped false → !dntEnabled(). CONSENT_KEY is DELIBERATELY
 * NOT bumped: bumping the storage key would discard every stored record and
 * silently re-opt-in users who had explicitly opted out — the opposite of what a
 * flip must preserve. Instead the meaning changed under the SAME key, and prior
 * explicit choices are honored via the `updatedAt` provenance:
 *   - a stored record with updatedAt > 0  ⇒ the user opened the consent UI and
 *     set their preferences ⇒ honor the stored flags VERBATIM (their false stays
 *     false; their true stays true).
 *   - absence, or updatedAt === 0         ⇒ no user choice recorded ⇒ apply the
 *     new defaults (research ON unless DNT).
 * The updatedAt distinction is only real if NOTHING writes a record without user
 * action. Verified: the sole `setConsent` caller is PrivacySettings (a user
 * toggle); no boot/auto path writes consent. `CONSENT_MODEL_VERSION` is stamped
 * on every research capture so a payload's consent basis is auditable.
 *
 * Dependency-free by design (analytics.js imports this; this must not import
 * analytics, or we'd create a cycle). The CONSENT_UPDATED event is fired by the
 * UI caller (PrivacySettings / banner), not here.
 *
 * Server clamps the effective tier (min(client, profiles.telemetry_consent));
 * this client copy decides what is even built/enqueued (defense in depth).
 */

export const CONSENT_KEY = 'sf_consent_v1';
/** Consent-model revision. v2 = the research opt-out flip. Stamped on research captures. */
export const CONSENT_MODEL_VERSION = 2;

// ── Market-insights consent plane (design §5, plane 3) ───────────────────────
// The THIRD consent plane: whether a user's coarse usage may be included in the
// anonymous, aggregate, k-anonymous market-research pack that may be licensed to
// worldbuilder-market buyers (§4). It is its OWN plane because being a user does not
// put you in the sellable aggregate.
//
// DEFAULT: OFF. The design leaves the default to an owner decision (RECOMMEND on —
// the plane is aggregate-only + id-free so on-by-default is defensible — but the
// trust-first posture argues off). We ship the trust-first default; the flip is this
// ONE constant, so the owner's veto is a one-line change (JUDGMENT, vetoable).
export const MARKET_INSIGHTS_DEFAULT = false;

export const CONSENT_TIERS = Object.freeze(['essential', 'research', 'ai_prose', 'market']);

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
  // Consent model v2: essential AND research default ON unless DNT (research is now
  // an OPT-OUT). ai_prose stays opt-in (reserved). market (§5 plane 3) is opt-IN,
  // defaulting to MARKET_INSIGHTS_DEFAULT. updatedAt 0 = "no user choice yet".
  const on = !dntEnabled();
  return { essential: on, research: on, ai_prose: false, market: MARKET_INSIGHTS_DEFAULT, updatedAt: 0 };
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
 * @returns {{essential:boolean, research:boolean, ai_prose:boolean, market:boolean, updatedAt:number}}
 */
export function getConsent() {
  const base = defaults();
  const stored = readRaw();
  // Explicit-choice provenance (model v2): only a user-touched record
  // (updatedAt > 0) overrides the defaults. A stored record with updatedAt 0
  // (there is no writer that produces one today) is treated as untouched, so the
  // new opt-out default applies rather than a phantom "false" the user never set.
  const touched = stored && typeof stored === 'object' && (Number(stored.updatedAt) || 0) > 0;
  const merged = touched
    ? {
      essential: stored.essential !== false,
      research: stored.research === true,
      ai_prose: stored.ai_prose === true,
      // market is opt-IN: a stored value counts only when explicitly true.
      market: stored.market === true,
      updatedAt: Number(stored.updatedAt) || 0,
    }
    : base;
  if (dntEnabled()) { merged.essential = false; merged.research = false; merged.market = false; } // DNT is a hard override of ALL telemetry
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
    market: 'market' in patch ? patch.market === true : cur.market,
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
