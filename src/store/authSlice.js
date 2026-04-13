/**
 * authSlice — Authentication state and tier-based permission gates.
 *
 * Tiers:
 *   'anon'    – no account, generate thorp/hamlet/village, no saves
 *   'free'    – account, all tiers, 10 saves, no neighbour/export/map-chains
 *   'premium' – unlimited saves, neighbour system, PDF/JSON, map supply chains
 *
 * AI features are gated by credits (creditsSlice), not tier.
 */

import { auth as authService } from '../lib/auth.js';

const TIER_GATE = {
  anon:    { maxTier: 'village', maxSaves: 0,  neighbour: false, export: false, mapChains: false },
  free:    { maxTier: 'metropolis', maxSaves: 10, neighbour: false, export: false, mapChains: false },
  premium: { maxTier: 'metropolis', maxSaves: Infinity, neighbour: true, export: true, mapChains: true },
};

const TIER_RANK = { thorp: 0, hamlet: 1, village: 2, town: 3, city: 4, metropolis: 5 };

export const createAuthSlice = (set, get) => ({
  // ── State ──────────────────────────────────────────────────────────────────
  auth: {
    user: null,           // Supabase user object (null = anonymous)
    session: null,        // Supabase session
    tier: 'anon',         // 'anon' | 'free' | 'premium'
    loading: true,        // true while checking initial session
    error: null,          // last auth error message
  },

  // ── Core setters ──────────────────────────────────────────────────────────
  setAuth: (user, session, tier) =>
    set(state => {
      state.auth = { user, session, tier: tier || 'free', loading: false, error: null };
    }),

  clearAuth: () =>
    set(state => {
      state.auth = { user: null, session: null, tier: 'anon', loading: false, error: null };
    }),

  setAuthLoading: (loading) =>
    set(state => { state.auth.loading = loading; }),

  setAuthError: (error) =>
    set(state => { state.auth.error = error; }),

  // ── Auth actions (async, call Supabase or mock) ───────────────────────────

  /** Initialize session on app mount. Call once from App.jsx useEffect. */
  initAuth: async () => {
    set(state => { state.auth.loading = true; });
    try {
      const result = await authService.getSession();
      if (result) {
        set(state => {
          state.auth = { user: result.user, session: result.session, tier: result.tier, loading: false, error: null };
        });
      } else {
        set(state => { state.auth.loading = false; });
      }
    } catch (e) {
      console.error('Auth init error:', e);
      set(state => { state.auth.loading = false; state.auth.error = e.message; });
    }

    // Listen for auth state changes (token refresh, sign out from another tab)
    authService.onAuthChange((event, user, session, tier) => {
      if (event === 'SIGNED_OUT') {
        get().clearAuth();
      } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        set(state => {
          state.auth = { user, session, tier, loading: false, error: null };
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
          state.auth = { user: result.user, session: result.session, tier: result.tier, loading: false, error: null };
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

  /** Sign in with email + password. */
  authSignIn: async (email, password) => {
    set(state => { state.auth.loading = true; state.auth.error = null; });
    try {
      const result = await authService.signIn(email, password);
      set(state => {
        state.auth = { user: result.user, session: result.session, tier: result.tier, loading: false, error: null };
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

  // ── Permission queries ─────────────────────────────────────────────────────
  canSave: () => {
    const { tier } = get().auth;
    return TIER_GATE[tier]?.maxSaves > 0;
  },

  canUseNeighbour: () => {
    const { tier } = get().auth;
    return TIER_GATE[tier]?.neighbour === true;
  },

  canExport: () => {
    const { tier } = get().auth;
    return TIER_GATE[tier]?.export === true;
  },

  canUseMapChains: () => {
    const { tier } = get().auth;
    return TIER_GATE[tier]?.mapChains === true;
  },

  maxAllowedTier: () => {
    const { tier } = get().auth;
    return TIER_GATE[tier]?.maxTier || 'village';
  },

  maxSaves: () => {
    const { tier } = get().auth;
    return TIER_GATE[tier]?.maxSaves ?? 0;
  },

  isTierAllowed: (settlementTier) => {
    const maxTier = get().maxAllowedTier();
    return TIER_RANK[settlementTier] <= TIER_RANK[maxTier];
  },
});
