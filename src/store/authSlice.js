/**
 * authSlice — Authentication state, role-based access, and tier-based permission gates.
 *
 * Tiers (subscription-based, controls feature access):
 *   'anon'    – no account, can generate up to TOWN size, no saves (the
 *               funnel strategy raised the anon ceiling from village to
 *               town so first-time visitors get a meaningful artifact
 *               worth signing up to save).
 *   'free'    – account, all sizes, 3 saves (Wanderer / Free tier),
 *               no neighbour/export/map-chains.
 *   'premium' – Cartographer: unlimited saves, neighbour system,
 *               PDF/JSON export, map supply chains.
 *
 * Roles (orthogonal to tier, controls administrative privileges):
 *   'user'      – default, no admin access
 *   'developer' – full bypass of all tier restrictions, admin panel access
 *   'admin'     – admin panel access, user management
 *
 * Developers/admins bypass ALL tier gates automatically.
 * AI features are gated by credits (creditsSlice), not tier — except developers get unlimited.
 */

import { auth as authService } from '../lib/auth.js';
import { DEFAULT_MODEL_PREFERENCE } from '../config/pricing.js';

// Source of truth for tier ceilings is src/config/pricing.js — TIERS.{key}.maxSize.
// This map mirrors those ceilings so the auth-gating layer never drifts:
//   wanderer/free    → capital    (a free account unlocks every size)
//   cartographer/    → capital
//   founder lifetime → capital
//
// Anonymous ALONE is capped at town: the no-account funnel previews up to Town,
// and signing up for a free account unlocks the full size ladder (the landing's
// locked City/Metropolis pills are the sign-in conversion hook).
// Exported so the derived tier-facts DISPLAY module (src/config/tierFacts.js)
// can pin its per-tier claims to this ENFORCEMENT map — one source, one contract
// test, no drift across the conversion surfaces.
//
// PDF export (owner ruling 2026-07-13): only premium gets UNLIMITED free export
// (`export: true`). The free tier's `export` is false — it does NOT export freely;
// it buys a durable per-dossier PDF right ($2.99, the single-dossier ladder). The
// export surfaces read `canExport()` and route a non-exporting tier to the
// entitlement/purchase rung (BuyThisDossier). Anon has always been false (the anon
// one-shot buy path). This flip activates the built-but-dormant $2.99 ladder.
export const TIER_GATE = {
  anon:    { maxTier: 'town',    maxSaves: 0,        neighbour: false, export: false, mapChains: false, customContent: false },
  free:    { maxTier: 'capital', maxSaves: 3,        neighbour: false, export: false, mapChains: false, customContent: false },
  premium: { maxTier: 'capital', maxSaves: Infinity, neighbour: true,  export: true,  mapChains: true,  customContent: true  },
};

// `capital` is the legacy tier name that lines up with pricing.js's maxSize
// values; `metropolis` is the engine-side tier rank (city/capital both fall
// inside it for size scaling purposes). The cap above limits the wizard's
// settType selector; the engine itself can still produce metropolis-scaled
// output internally for elevated roles.
const TIER_RANK = { thorp: 0, hamlet: 1, village: 2, town: 3, city: 4, capital: 5, metropolis: 5 };

// Sentinel settType values that are not concrete tiers: they resolve to a real
// tier during generation, and the post-resolution re-gate (settlementSlice)
// checks the RESOLVED tier. Allowing them here keeps Random/Custom selectable
// for every account tier (ported master fix).
const ALLOWED_UNRANKED_TIERS = new Set(['random', 'custom']);

/** Roles that bypass all tier restrictions */
const ELEVATED_ROLES = ['developer', 'admin'];

// Elevated roles (admin / developer) carry a perpetual Cartographer (premium)
// status: they never pay, and their account reads as Cartographer everywhere
// `auth.tier` is consulted. Whatever billing tier the profile reports is
// overridden to 'premium' for these roles.
function resolveTier(tier, role) {
  return ELEVATED_ROLES.includes(role) ? 'premium' : (tier || 'free');
}
let authUnsubscribe = null;
// M-9d — teardown for the single-session validation loop (focus/visibility + interval).
let sessionValidationCleanup = null;

export const createAuthSlice = (set, get) => ({
  // ── State ──────────────────────────────────────────────────────────────────
  auth: {
    user: null,           // Supabase user object (null = anonymous)
    session: null,        // Supabase session
    tier: 'anon',         // 'anon' | 'free' | 'premium'
    role: 'user',         // 'user' | 'developer' | 'admin'
    displayName: null,    // custom display name (from profiles table)
    isFounder: false,     // founder lifetime grant (from profiles table)
    avatarUrl: null,      // optional profile avatar URL
    emailNotifications: true,
    modelPreference: DEFAULT_MODEL_PREFERENCE,
    loading: true,        // true while checking initial session
    error: null,          // last auth error message
  },

  // Durable single-dossier export rights (migration 108), cached per SAVED
  // settlement id so the export surfaces don't re-hit has_dossier_entitlement on
  // every render. A map of { [saveId]: boolean }. The server is authoritative;
  // this is a read cache only — refreshed on demand (after a purchase success,
  // after a retro auto-upgrade) and cleared on sign-out.
  dossierEntitlements: {},

  // Single-session eviction banner flag (§7.3, M-9d). TOP-LEVEL (not inside `auth`),
  // so clearAuth's auth-reset leaves it standing — the banner survives the sign-out
  // it announces. NOT persisted (absent from the partialize), so a fresh load is never
  // pre-evicted. Cleared on the next SIGNED_IN.
  sessionEvicted: false,

  // ── Core setters ──────────────────────────────────────────────────────────
  setAuth: (user, session, tier, role, displayName, isFounder = false, avatarUrl = null, emailNotifications = true, modelPreference = DEFAULT_MODEL_PREFERENCE) =>
    set(state => {
      state.auth = {
        user, session,
        tier: resolveTier(tier, role),
        role: role || 'user',
        displayName: displayName || null,
        isFounder: Boolean(isFounder),
        avatarUrl: avatarUrl || null,
        emailNotifications: emailNotifications !== false,
        modelPreference: modelPreference || DEFAULT_MODEL_PREFERENCE,
        loading: false, error: null,
      };
    }),

  clearAuth: () => {
    set(state => {
      state.auth = { user: null, session: null, tier: 'anon', role: 'user', displayName: null, isFounder: false, avatarUrl: null, emailNotifications: true, modelPreference: DEFAULT_MODEL_PREFERENCE, loading: false, error: null };
      // Durable-rights cache is per-user — drop it on sign-out so a later user on
      // the same device never reads the previous account's entitlements.
      state.dossierEntitlements = {};
    });
    try {
      get().clearCampaigns?.();
      get().clearSavedSettlements?.();
      get().clearCloudCustomContent?.();
    } catch {
      // Other slices may not be present in isolated unit tests.
    }
  },

  /**
   * THE EVICTION (§7.3, M-9d) — this session was superseded by a sign-in on another
   * device. THE NON-NEGOTIABLE LIFECYCLE REQUIREMENT: eviction must NEVER destroy
   * unsaved local work. So this does the MINIMUM:
   *   (1) raise the banner flag (sessionEvicted — top-level, survives clearAuth),
   *   (2) sign out ONLY this device's session (LOCAL scope; the other device is the
   *       legitimate winner). The SIGNED_OUT event then transitions auth to anon
   *       exactly as a normal sign-out does; the persist partialize (config +
   *       toggles) is NEVER touched, so unsaved edits survive to re-auth rehydration.
   * It NEVER calls a store-reset (clearSavedSettlements / resetConfig / …) — that is
   * the wall THE LIFECYCLE PIN guards. Supersession DEDUPES: the first eviction wins,
   * later ones no-op (no error-toast storm from N in-flight paid calls all 401-ing).
   */
  evictSession: () => {
    if (get().sessionEvicted) return;                 // dedupe — first supersession wins
    set(state => { state.sessionEvicted = true; });
    // Local-scope sign-out (lazy authSecurity). Fire-and-forget: the banner is already
    // up, and the SIGNED_OUT transition follows on its own. NEVER a global sign-out.
    Promise.resolve(authService.signOutLocalSession?.()).catch(() => { /* banner already shown */ });
  },

  setAuthLoading: (loading) =>
    set(state => { state.auth.loading = loading; }),

  setAuthError: (error) =>
    set(state => { state.auth.error = error; }),

  // ── Durable single-dossier export rights cache (migration 108) ─────────────
  /** Synchronous read of the cached durable-right flag for a saved settlement.
   *  Unknown (never fetched) reads false — the export surface then offers the
   *  purchase path rather than a free export it cannot prove. */
  hasCachedDossierEntitlement: (saveId) => {
    if (!saveId) return false;
    return get().dossierEntitlements[saveId] === true;
  },

  /** Optimistically mark a save's durable right as held (e.g. right after a
   *  successful retro auto-upgrade) without waiting for a refetch. */
  setDossierEntitlement: (saveId, held) =>
    set(state => {
      if (!saveId) return;
      state.dossierEntitlements[saveId] = held === true;
    }),

  /** Drop the whole durable-rights read cache so every saved dossier refetches
   *  its right on next view. Called after a durable purchase completes (the
   *  webhook granted a new right server-side; the buyer's stale `false` must not
   *  linger). */
  clearDossierEntitlements: () =>
    set(state => { state.dossierEntitlements = {}; }),

  /** Refresh the cached durable-right flag for one saved settlement from the
   *  server (has_dossier_entitlement). Fire-and-forget-safe: never throws, and
   *  a transient failure caches false (fail-closed). Resolves to the boolean. */
  refreshDossierEntitlement: async (saveId) => {
    if (!saveId) return false;
    const { fetchHasDossierEntitlement } = await import('../lib/dossierEntitlements.js');
    const held = await fetchHasDossierEntitlement(saveId);
    set(state => { state.dossierEntitlements[saveId] = held; });
    return held;
  },

  // ── Role queries ──────────────────────────────────────────────────────────
  isDeveloper: () => get().auth.role === 'developer',
  isAdmin: () => ELEVATED_ROLES.includes(get().auth.role),
  isElevated: () => ELEVATED_ROLES.includes(get().auth.role),
  /** Whether the user's account tier grants premium benefits (unlimited
   *  chronicle history, supply chains, custom content, etc.). Orthogonal to
   *  role — an elevated role is checked separately via isElevated(). */
  isPremium: () => get().auth.tier === 'premium',
  /** Whether the user holds a Founder Lifetime grant. The profiles row is
   *  the source of truth; user_metadata is only a compatibility mirror. */
  isFounder: () => Boolean(get().auth.isFounder),

  // ── Auth actions (async, call Supabase or mock) ───────────────────────────

  /** Initialize session on app mount. Call once from App.jsx useEffect. */
  initAuth: async () => {
    set(state => { state.auth.loading = true; });
    try {
      const result = await authService.getSession();
      if (result) {
        set(state => {
          state.auth = {
            user: result.user, session: result.session,
            tier: resolveTier(result.tier, result.role), role: result.role || 'user',
            displayName: result.displayName || null,
            isFounder: Boolean(result.isFounder),
            avatarUrl: result.avatarUrl || null,
            emailNotifications: result.emailNotifications !== false,
            modelPreference: result.modelPreference || DEFAULT_MODEL_PREFERENCE,
            loading: false, error: null,
          };
        });
      } else {
        set(state => { state.auth.loading = false; });
      }
    } catch (e) {
      console.error('Auth init error:', e);
      set(state => { state.auth.loading = false; state.auth.error = e.message; });
    }

    // Listen for auth state changes (token refresh, sign out from another tab).
    // initAuth can run more than once under HMR/remounts, so keep exactly one
    // active subscription.
    if (authUnsubscribe) {
      authUnsubscribe();
      authUnsubscribe = null;
    }
    authUnsubscribe = authService.onAuthChange((event, user, session, tier, role, displayName, isFounder, avatarUrl, emailNotifications, modelPreference) => {
      if (event === 'SIGNED_OUT') {
        get().clearAuth();
      } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        const previousUserId = get().auth?.user?.id;
        if (previousUserId && user?.id && previousUserId !== user.id) {
          get().clearCampaigns?.();
          get().clearSavedSettlements?.();
          get().clearCloudCustomContent?.();
        }
        set(state => {
          state.auth = {
            user, session, tier: resolveTier(tier, role),
            role: role || 'user',
            displayName: displayName || null,
            isFounder: Boolean(isFounder),
            avatarUrl: avatarUrl || null,
            emailNotifications: emailNotifications !== false,
            modelPreference: modelPreference || DEFAULT_MODEL_PREFERENCE,
            loading: false, error: null,
          };
          // A fresh sign-in clears any prior eviction banner (§7.3): re-auth returns
          // the user to their (persisted) work with a clean slate.
          state.sessionEvicted = false;
        });

        // M-9d — claim this account to THE CURRENT session (last-login-wins, §7.1).
        // Fire-and-forget via the LAZY sessionClient (off the first-paint closure). Only
        // on a real SIGNED_IN — a TOKEN_REFRESHED keeps the same session_id.
        if (event === 'SIGNED_IN' && user?.id) {
          import('../lib/sessionClient.js').then((m) => m.claimSession()).catch(() => { /* never block auth */ });
        }

        // Tier 8.5 — fire the welcome email once per account. We mark a
        // localStorage flag keyed by user id so we don't double-send on
        // SIGNED_IN events (e.g. after a token refresh or a sign-out +
        // sign-in cycle on the same browser). The send is
        // fire-and-forget — emails never block the auth flow, and an
        // unconfigured RESEND_API_KEY returns a soft 200 from the edge
        // function so this path is silent in dev.
        if (event === 'SIGNED_IN' && user?.id) {
          const flag = `sf_welcomed_${user.id}`;
          try {
            if (typeof localStorage !== 'undefined' && !localStorage.getItem(flag)) {
              localStorage.setItem(flag, '1');
              // Lazy-import the lifecycle helper to avoid pulling
              // emailLifecycle into the critical auth bundle.
              import('../lib/emailLifecycle.js').then(({ notifyWelcome }) => {
                notifyWelcome({ displayName: displayName || 'there' });
              }).catch(() => { /* swallow — never block auth */ });

              // Tier 8.8 — fire SIGNUP_COMPLETED + (if applicable)
              // SIGNUP_AFTER_ANON. We piggyback on the same first-
              // signin-per-user flag so this fires once per account.
              import('../lib/analytics.js').then(({ Funnel }) => {
                Funnel.signupCompleted({ userId: user.id });
              }).catch(() => { /* never block auth */ });
            }
          } catch { /* localStorage unavailable; skip */ }
        }

        // P101 / X-3 — Auth intent fulfillment. If the user clicked
        // "Save this town — free account" before signing in, the
        // authIntents registry has a pending SAVE_SETTLEMENT entry. Now
        // that auth is real, dispatch it. The handler is registered at
        // module init time in store/index.js (see registerSaveIntent).
        if (event === 'SIGNED_IN' && user?.id) {
          import('../lib/authIntents.js').then(({ consume }) => {
            consume({ user, tier, role, displayName, isFounder, avatarUrl, emailNotifications, modelPreference });
          }).catch((e) => {
            console.warn('[authSlice] authIntents.consume failed:', e);
          });
        }
      }
    });

    // M-9d — session validation (focus/visibility + 5-min interval). LAZILY loaded so
    // the listener/interval machinery stays OFF the first-paint closure (LAW 4); its
    // teardown is captured for cleanup once the module resolves.
    if (sessionValidationCleanup) { sessionValidationCleanup(); sessionValidationCleanup = null; }
    import('../lib/sessionClient.js')
      .then(({ startValidation }) => { sessionValidationCleanup = startValidation(get); })
      .catch(() => { /* validation is a convenience; the request gate is the enforcement */ });

    // Combined teardown: unsubscribe onAuthChange AND tear down the validation loop.
    return () => {
      if (authUnsubscribe) { authUnsubscribe(); authUnsubscribe = null; }
      if (sessionValidationCleanup) { sessionValidationCleanup(); sessionValidationCleanup = null; }
    };
  },

  /** Sign up with email + password. Returns { needsVerification } or throws. */
  authSignUp: async (email, password) => {
    set(state => { state.auth.loading = true; state.auth.error = null; });
    try {
      const result = /** @type {any} */ (await authService.signUp(email, password));
      if (result.session) {
        // Auto-confirmed (dev mode or mock)
        set(state => {
          state.auth = {
            user: result.user, session: result.session,
            tier: resolveTier(result.tier, result.role), role: result.role || 'user',
            displayName: result.displayName || null,
            isFounder: Boolean(result.isFounder),
            avatarUrl: result.avatarUrl || null,
            emailNotifications: result.emailNotifications !== false,
            modelPreference: result.modelPreference || DEFAULT_MODEL_PREFERENCE,
            loading: false, error: null,
          };
        });
      } else {
        set(state => { state.auth.loading = false; });
      }
      return { needsVerification: result.needsVerification, existingAccount: result.existingAccount };
    } catch (e) {
      set(state => { state.auth.loading = false; state.auth.error = e.message; });
      throw e;
    }
  },

  /** Sign in with email + password. rememberMe controls session persistence. */
  authSignIn: async (email, password, rememberMe = true) => {
    set(state => { state.auth.loading = true; state.auth.error = null; });
    try {
      const result = await authService.signIn(email, password, rememberMe);
      set(state => {
        state.auth = {
          user: result.user, session: result.session,
          tier: result.tier, role: result.role || 'user',
          displayName: result.displayName || null,
          isFounder: Boolean(result.isFounder),
          avatarUrl: result.avatarUrl || null,
          emailNotifications: result.emailNotifications !== false,
          modelPreference: result.modelPreference || DEFAULT_MODEL_PREFERENCE,
          loading: false, error: null,
        };
      });
    } catch (e) {
      set(state => { state.auth.loading = false; state.auth.error = e.message; });
      throw e;
    }
  },

  /** Sign out. */
  authSignOut: async () => {
    try {
      await authService.signOut();
    } catch (e) {
      console.error('Sign out error:', e);
    }
    get().clearAuth();
  },

  /** Send password reset email. */
  authResetPassword: async (email) => {
    try {
      await authService.resetPassword(email);
    } catch (e) {
      set(state => { state.auth.error = e.message; });
      throw e;
    }
  },

  /**
   * Persist the two security answers captured at sign-up. Thin pass-through to
   * the auth service's set_my_security_answers RPC wrapper — the RPC needs a
   * live session (auth.uid()), so the caller fires this only AFTER a session
   * exists (i.e. once the post-signup polling auto-login succeeds). The raw
   * answers are hashed server-side; nothing sensitive lands in the store.
   *
   * @param {{ q1: string, a1: string, q2: string, a2: string }} answers
   */
  authSetSecurityAnswers: async (answers) => {
    await authService.setSecurityAnswers(answers);
  },

  /**
   * Read which of the caller's two security-question slots are currently set,
   * so the account page can show "set / not set" status. Thin pass-through to
   * the auth service's get_my_security_question_ids RPC wrapper — it returns
   * only the {slot, questionId} pairs (never the answer hash) and needs a live
   * session. Degrades to an empty array on any failure.
   *
   * @returns {Promise<Array<{ slot: number, questionId: string }>>}
   */
  authGetSecurityQuestionIds: async () => {
    return authService.getSecurityQuestionIds();
  },

  /**
   * Forgot-password challenge — step 1. Look up an email through the
   * `auth-recovery` edge function and get ONE random security question. The raw
   * answer hash never reaches the client; this returns only
   * { exists, slot, questionId }. A rate-limit / outage throws a coded Error
   * (e.code, see RECOVERY_RATE_LIMITED) so the UI can back off rather than treat
   * it as a missing account. Thin pass-through; nothing lands in state.
   *
   * @param {string} email
   * @returns {Promise<{ exists: boolean, slot: number|null, questionId: string|null }>}
   */
  authRecoveryLookup: async (email) => {
    return authService.recoveryLookup(email);
  },

  /**
   * Forgot-password challenge — step 2. Submit the answer for the question
   * chosen in step 1. On a correct answer the edge function mails the reset link
   * and this resolves { ok: true }; a wrong answer resolves { ok: false }. A
   * rate-limit / outage throws a coded Error. The answer is sent straight to the
   * function and never persisted in the store.
   *
   * @param {{ email: string, slot: number, answer: string }} args
   * @returns {Promise<{ ok: boolean }>}
   */
  authRecoveryVerify: async ({ email, slot, answer }) => {
    return authService.recoveryVerify({ email, slot, answer });
  },

  /**
   * Set a new password for the CURRENT session. Used by the set-new-password
   * page once a recovery session is active (the recovery link established it).
   * Unlike a signed-in password change this has no current-password re-auth gate
   * — the recovery session IS the proof of identity. The auth-state listener
   * picks up the now-fully-authed session; failures (e.g. expired link) surface
   * to the caller.
   *
   * @param {string} newPassword
   */
  authUpdatePassword: async (newPassword) => {
    try {
      await authService.updatePassword(newPassword);
    } catch (e) {
      set(state => { state.auth.error = e.message; });
      throw e;
    }
  },

  /**
   * Send magic-link / OTP sign-in email. WCAG 2.2 SC 3.3.8 (Accessible
   * Authentication, Minimum) prefers this path over password recall.
   * Resolution happens via the auth-state listener on link click — no
   * follow-up call needed here.
   */
  authMagicLink: async (email) => {
    try {
      const result = await authService.signInWithMagicLink(email);
      return result;  // { sentTo: email }
    } catch (e) {
      set(state => { state.auth.error = e.message; });
      throw e;
    }
  },

  /**
   * Begin an OAuth sign-in flow. Supabase navigates the browser to the
   * provider; we never resolve to a session here. The session is
   * established when the user lands back on our origin and the
   * onAuthStateChange listener fires SIGNED_IN.
   *
   * @param {'google' | 'discord' | 'github'} provider
   */
  authOAuth: async (provider) => {
    set(state => { state.auth.loading = true; state.auth.error = null; });
    try {
      const result = /** @type {any} */ (await authService.signInWithOAuth(provider));
      // Mock-mode short-circuit: there's no real redirect, so report
      // back to the caller instead of leaving the UI in a loading state.
      if (result?.mock) {
        set(state => { state.auth.loading = false; });
      }
      // In real mode the browser is navigating away; no UI update needed.
      return result;
    } catch (e) {
      // Prefer the safe, non-leaky userMessage set by describeOAuthError in
      // lib/auth.js (e.g. a not-yet-enabled provider). Rethrow the original
      // error object so the caller can also read `e.userMessage`.
      const safe = e.userMessage || e.message;
      set(state => { state.auth.loading = false; state.auth.error = safe; });
      throw e;
    }
  },

  // ── Permission queries (elevated roles bypass all gates) ──────────────────
  canSave: () => {
    if (ELEVATED_ROLES.includes(get().auth.role)) return true;
    const { tier } = get().auth;
    return TIER_GATE[tier]?.maxSaves > 0;
  },

  canUseNeighbour: () => {
    if (ELEVATED_ROLES.includes(get().auth.role)) return true;
    const { tier } = get().auth;
    return TIER_GATE[tier]?.neighbour === true;
  },

  canExport: () => {
    if (ELEVATED_ROLES.includes(get().auth.role)) return true;
    const { tier } = get().auth;
    return TIER_GATE[tier]?.export === true;
  },

  // ENFORCED (Owner Ruling #5, 2026-07-17 — "enforce mapChains", flipping the
  // reconciliation-#4 as-shipped-free judgment at its recorded veto handle).
  // Consumers: the <ChainEdges/> render in components/MapOverlay.jsx + the
  // LayersPanel 'Supply chains' toggle + the RoutesToolbar 'Chains' toggle —
  // the gate wraps the AFFORDANCES; the derivation (lib/computeMapChains.js /
  // lib/supplyChains.js) stays tier-blind. Locked toggles stay visible and
  // fire the map_realm_teaser pricing moment. The stored layers.chains default
  // is untouched, so an upgrade restores the layer without re-toggling.
  canUseMapChains: () => {
    if (ELEVATED_ROLES.includes(get().auth.role)) return true;
    const { tier } = get().auth;
    return TIER_GATE[tier]?.mapChains === true;
  },

  /** Whether the user can create/edit custom Compendium content (premium gate). */
  canUseCustomContent: () => {
    if (ELEVATED_ROLES.includes(get().auth.role)) return true;
    const { tier } = get().auth;
    return TIER_GATE[tier]?.customContent === true;
  },

  maxAllowedTier: () => {
    if (ELEVATED_ROLES.includes(get().auth.role)) return 'metropolis';
    const { tier } = get().auth;
    return TIER_GATE[tier]?.maxTier || 'village';
  },

  maxSaves: () => {
    if (ELEVATED_ROLES.includes(get().auth.role)) return Infinity;
    const { tier } = get().auth;
    return TIER_GATE[tier]?.maxSaves ?? 0;
  },

  isTierAllowed: (settlementTier) => {
    if (ELEVATED_ROLES.includes(get().auth.role)) return true;
    // Sentinels resolve to a concrete tier at generation; the post-resolution
    // re-gate checks that. Unknown non-sentinel tiers FAIL CLOSED.
    if (ALLOWED_UNRANKED_TIERS.has(settlementTier)) return true;
    const rank = TIER_RANK[settlementTier];
    if (rank === undefined) return false;
    const maxRank = TIER_RANK[get().maxAllowedTier()];
    if (maxRank === undefined) return false;
    return rank <= maxRank;
  },

  /** Whether the user can afford AI features (developers get unlimited) */
  canAffordAI: (feature) => {
    if (ELEVATED_ROLES.includes(get().auth.role)) return true;
    return get().canAfford(feature);
  },
});
