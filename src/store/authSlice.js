/**
 * authSlice — Authentication state, role-based access, and tier-based permission gates.
 *
 * Tiers (subscription-based, controls feature access):
 *   'anon'    – no account, generate thorp/hamlet/village, no saves
 *   'free'    – account, all tiers, 10 saves, no neighbour/export/map-chains
 *   'premium' – unlimited saves, neighbour system, PDF/JSON, map supply chains
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

const TIER_GATE = {
  anon:    { maxTier: 'village',    maxSaves: 0,        neighbour: false, export: false, mapChains: false, customContent: false },
  free:    { maxTier: 'metropolis', maxSaves: 10,       neighbour: false, export: false, mapChains: false, customContent: false },
  premium: { maxTier: 'metropolis', maxSaves: Infinity, neighbour: true,  export: true,  mapChains: true,  customContent: true  },
};

const TIER_RANK = { thorp: 0, hamlet: 1, village: 2, town: 3, city: 4, metropolis: 5 };

/** Roles that bypass all tier restrictions */
const ELEVATED_ROLES = ['developer', 'admin'];

export const createAuthSlice = (set, get) => ({
  // ── State ──────────────────────────────────────────────────────────────────
  auth: {
    user: null,           // Supabase user object (null = anonymous)
    session: null,        // Supabase session
    tier: 'anon',         // 'anon' | 'free' | 'premium'
    role: 'user',         // 'user' | 'developer' | 'admin'
    displayName: null,    // custom display name (from profiles table)
    loading: true,        // true while checking initial session
    error: null,          // last auth error message
  },

  // ── Core setters ──────────────────────────────────────────────────────────
  setAuth: (user, session, tier, role, displayName) =>
    set(state => {
      state.auth = {
        user, session,
        tier: tier || 'free',
        role: role || 'user',
        displayName: displayName || null,
        loading: false, error: null,
      };
    }),

  clearAuth: () =>
    set(state => {
      state.auth = { user: null, session: null, tier: 'anon', role: 'user', displayName: null, loading: false, error: null };
    }),

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
            tier: result.tier, role: result.role || 'user',
            displayName: result.displayName || null,
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

    // Listen for auth state changes (token refresh, sign out from another tab)
    authService.onAuthChange((event, user, session, tier, role, displayName) => {
      if (event === 'SIGNED_OUT') {
        get().clearAuth();
      } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        set(state => {
          state.auth = {
            user, session, tier,
            role: role || 'user',
            displayName: displayName || null,
            loading: false, error: null,
          };
        });
      }
    });
  },

  /** Sign up with email + password. Returns { needsVerification } or throws. */
  authSignUp: async (email, password) => {
    set(state => { state.auth.loading = true; state.auth.error = null; });
    try {
      const result = await authService.signUp(email, password);
      if (result.session) {
        // Auto-confirmed (dev mode or mock)
        set(state => {
          state.auth = {
            user: result.user, session: result.session,
            tier: result.tier, role: result.role || 'user',
            displayName: result.displayName || null,
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
    const maxTier = get().maxAllowedTier();
    return TIER_RANK[settlementTier] <= TIER_RANK[maxTier];
  },

  /** Whether the user can afford AI features (developers get unlimited) */
  canAffordAI: (feature) => {
    if (ELEVATED_ROLES.includes(get().auth.role)) return true;
    return get().canAfford(feature);
  },
});
