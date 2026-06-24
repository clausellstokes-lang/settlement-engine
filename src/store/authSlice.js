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
//   wanderer/free    → metropolis  (a free ACCOUNT generates any size — no size paywall)
//   cartographer/    → metropolis  (size is not a premium lever)
//   founder lifetime → metropolis
//
// Anonymous caps at `town` (NOT the same as Wanderer anymore): a free account is
// what unlocks full-size generation, so signing up is the first funnel step. The
// PREMIUM product is the living simulation (advance-time / campaigns / custom
// content / gallery), never settlement size or generation depth.
const TIER_GATE = {
  anon:    { maxTier: 'town',       maxSaves: 0,        neighbour: false, export: false, mapChains: false, customContent: false },
  free:    { maxTier: 'metropolis', maxSaves: 3,        neighbour: false, export: true,  mapChains: false, customContent: false },
  premium: { maxTier: 'metropolis', maxSaves: Infinity, neighbour: true,  export: true,  mapChains: true,  customContent: true  },
};

// `capital` is the legacy tier name that lines up with pricing.js's maxSize
// values; `metropolis` is the engine-side tier rank (city/capital both fall
// inside it for size scaling purposes). The cap above limits the wizard's
// settType selector; the engine itself can still produce metropolis-scaled
// output internally for elevated roles.
const TIER_RANK = { thorp: 0, hamlet: 1, village: 2, town: 3, city: 4, capital: 5, metropolis: 5 };

// Legitimate NON-ranked settType sentinels the wizard's selector offers
// alongside the ranked tiers (ConfigurationPanel's <option value="random"> /
// <option value="custom">). These are not subject to the size paywall: 'random'
// rolls a tier (then re-gated at generation), and 'custom' is a size the user
// types. isTierAllowed must let these through, but FAIL CLOSED on everything
// else (typos, undefined, tampered values) rather than fail open.
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

/**
 * Pull the account-identity fields (migration 075) off a getSession/signIn
 * result into the shape the auth state stores. Null-safe — a result lacking
 * these (mock mode, partial server rollout) yields all-null.
 * @param {object} [result]
 */
function identityFrom(result = {}) {
  return {
    accountNumber: result.accountNumber || null,
    externalName: result.externalName || null,
    firstName: result.firstName || null,
    lastName: result.lastName || null,
    preferredName: result.preferredName || null,
  };
}
let authUnsubscribe = null;

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
    // Account identity (migration 075). accountNumber is immutable + private;
    // externalName is the public gallery author name; the name parts are private.
    accountNumber: null,
    externalName: null,
    firstName: null,
    lastName: null,
    preferredName: null,
    loading: true,        // true while checking initial session
    error: null,          // last auth error message
  },

  // ── Core setters ──────────────────────────────────────────────────────────
  // `identity` is an APPEND-ONLY trailing object (not a positional arg) so the
  // existing nine-arg callers stay byte-compatible while new identity fields
  // (account_number / external_name / name parts) can be threaded through where
  // a caller has them. Omitted → preserved from the current auth state so a
  // partial setAuth never blanks an already-loaded identity.
  setAuth: (user, session, tier, role, displayName, isFounder = false, avatarUrl = null, emailNotifications = true, modelPreference = DEFAULT_MODEL_PREFERENCE, identity = undefined) =>
    set(state => {
      const prev = state.auth || {};
      state.auth = {
        user, session,
        tier: resolveTier(tier, role),
        role: role || 'user',
        displayName: displayName || null,
        isFounder: Boolean(isFounder),
        avatarUrl: avatarUrl || null,
        emailNotifications: emailNotifications !== false,
        modelPreference: modelPreference || DEFAULT_MODEL_PREFERENCE,
        accountNumber: identity?.accountNumber ?? prev.accountNumber ?? null,
        externalName: identity?.externalName ?? prev.externalName ?? null,
        firstName: identity?.firstName ?? prev.firstName ?? null,
        lastName: identity?.lastName ?? prev.lastName ?? null,
        preferredName: identity?.preferredName ?? prev.preferredName ?? null,
        loading: false, error: null,
      };
    }),

  clearAuth: () => {
    set(state => {
      state.auth = { user: null, session: null, tier: 'anon', role: 'user', displayName: null, isFounder: false, avatarUrl: null, emailNotifications: true, modelPreference: DEFAULT_MODEL_PREFERENCE, accountNumber: null, externalName: null, firstName: null, lastName: null, preferredName: null, loading: false, error: null };
    });
    try {
      get().clearCampaigns?.();
      get().clearSavedSettlements?.();
      get().clearCloudCustomContent?.();
    } catch {
      // Other slices may not be present in isolated unit tests.
    }
  },

  setAuthLoading: (loading) =>
    set(state => { state.auth.loading = loading; }),

  setAuthError: (error) =>
    set(state => { state.auth.error = error; }),

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
            ...identityFrom(result),
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
        });

        // Fire the welcome email once per account. We mark a
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

              // Fire SIGNUP_COMPLETED + (if applicable)
              // SIGNUP_AFTER_ANON. We piggyback on the same first-
              // signin-per-user flag so this fires once per account.
              import('../lib/analytics.js').then(({ Funnel }) => {
                Funnel.signupCompleted({ userId: user.id });
              }).catch(() => { /* never block auth */ });
            }
          } catch { /* localStorage unavailable; skip */ }
        }

        // Auth intent fulfillment. If the user clicked
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
    return authUnsubscribe;
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
            ...identityFrom(result),
            loading: false, error: null,
          };
        });
      } else {
        set(state => { state.auth.loading = false; });
      }
      return { needsVerification: result.needsVerification };
    } catch (e) {
      set(state => { state.auth.loading = false; state.auth.error = e.message; });
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

  /** Sign in with email + password. rememberMe controls session persistence. */
  authSignIn: async (email, password, rememberMe = true) => {
    set(state => { state.auth.loading = true; state.auth.error = null; });
    try {
      const result = await authService.signIn(email, password, rememberMe);
      set(state => {
        state.auth = {
          user: result.user, session: result.session,
          tier: resolveTier(result.tier, result.role), role: result.role || 'user',
          displayName: result.displayName || null,
          isFounder: Boolean(result.isFounder),
          avatarUrl: result.avatarUrl || null,
          emailNotifications: result.emailNotifications !== false,
          modelPreference: result.modelPreference || DEFAULT_MODEL_PREFERENCE,
          ...identityFrom(result),
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
   * Forgot-password challenge — step 1. Look up an email through the
   * `auth-recovery` edge function and get ONE random security question. The
   * raw answer hash never reaches the client; this returns only
   * { exists, slot, questionId }. A rate-limit / outage throws a coded Error
   * (e.code, see RECOVERY_RATE_LIMITED) so the UI can back off rather than
   * treat it as a missing account. Thin pass-through; nothing lands in state.
   *
   * @param {string} email
   * @returns {Promise<{ exists: boolean, slot: number|null, questionId: string|null }>}
   */
  authRecoveryLookup: async (email) => {
    return authService.recoveryLookup(email);
  },

  /**
   * Forgot-password challenge — step 2. Submit the answer for the question
   * chosen in step 1. On a correct answer the edge function mails the reset
   * link and this resolves { ok: true }; a wrong answer resolves { ok: false }.
   * A rate-limit / outage throws a coded Error. The answer is sent straight to
   * the function and never persisted in the store.
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
   * Unlike changePassword this has no current-password re-auth gate — the
   * recovery session IS the proof of identity. The auth-state listener picks up
   * the now-fully-authed session; we surface failures (e.g. expired link) to
   * the caller.
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
   * The named wrappers (`signInWithGoogle`/`signInWithDiscord`) return the
   * Supabase `{ data, error }` shape; we normalize so the caller always sees
   * `{ mock }` in local mode and a thrown, already-sanitized Error otherwise.
   * `error.userMessage` (set in lib/auth.js) is a safe, non-leaky string —
   * including the account-linking conflict nudge — so the UI shows it directly
   * rather than constructing its own.
   *
   * @param {'google' | 'discord' | 'github'} provider
   */
  authOAuth: async (provider) => {
    set(state => { state.auth.loading = true; state.auth.error = null; });
    try {
      const fn = provider === 'google'
        ? authService.signInWithGoogle
        : provider === 'discord'
          ? authService.signInWithDiscord
          : null;
      const { data, error } = fn
        ? /** @type {any} */ (await fn())
        : /** @type {any} */ ({ data: await authService.signInWithOAuth(provider), error: null });

      if (error) {
        // error.userMessage is the safe display string set in lib/auth.js.
        const safe = error.userMessage || error.message || 'Sign-in failed. Please try again.';
        set(state => { state.auth.loading = false; state.auth.error = safe; });
        const err = new Error(safe);
        throw err;
      }

      // Mock-mode short-circuit: there's no real redirect, so report
      // back to the caller instead of leaving the UI in a loading state.
      if (data?.mock) {
        set(state => { state.auth.loading = false; });
      }
      // In real mode the browser is navigating away; no UI update needed.
      return data;
    } catch (e) {
      set(state => { state.auth.loading = false; state.auth.error = e.message; });
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
    // FAIL CLOSED for anything that is neither a known ranked tier nor an
    // explicitly-allowlisted sentinel. A permission gate that returns true for
    // an unknown value (typo / undefined / tampered settType) is a security
    // hole: a caller that forgot to guard the sentinels would silently grant
    // access to an unrecognized tier. So the ONLY non-ranked values that pass
    // are the legitimate wizard sentinels ('random'/'custom'); every other
    // unranked value is denied.
    if (ALLOWED_UNRANKED_TIERS.has(settlementTier)) return true;
    const rank = TIER_RANK[settlementTier];
    if (rank === undefined) return false;
    const maxTier = get().maxAllowedTier();
    const maxRank = TIER_RANK[maxTier];
    // Defense-in-depth: if maxAllowedTier ever resolves to an unranked value,
    // deny rather than compare against undefined (which would clamp to false
    // for every input — fail-open's mirror image, but still wrong to rely on).
    if (maxRank === undefined) return false;
    return rank <= maxRank;
  },

  /** Whether the user can afford AI features (developers get unlimited) */
  canAffordAI: (feature) => {
    if (ELEVATED_ROLES.includes(get().auth.role)) return true;
    return get().canAfford(feature);
  },
});
