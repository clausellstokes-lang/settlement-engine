/**
 * auth.js — Authentication service layer.
 *
 * Wraps Supabase auth with graceful fallback to mock mode when
 * Supabase is not configured (no env vars). This lets the app
 * run locally without a backend while using the same API surface.
 *
 * Tier resolution:
 *   - 'anon' = no session
 *   - 'free' = authenticated, no premium metadata
 *   - 'premium' = authenticated + user_metadata.tier === 'premium'
 *                  (set by Stripe webhook or admin dashboard)
 *
 * Role resolution (orthogonal to tier):
 *   - 'user'      = default, normal user
 *   - 'developer' = full access, bypasses all gates
 *   - 'admin'     = admin panel access
 *   (set via profiles table role column or user_metadata.role)
 */

import { supabase, isConfigured } from './supabase.js';

/** Resolve tier from Supabase user metadata. */
function resolveTier(user) {
  if (!user) return 'anon';
  const meta = user.user_metadata || {};
  if (meta.tier === 'premium') return 'premium';
  return 'free';
}

/** Resolve role from Supabase user metadata. */
function resolveRole(user) {
  if (!user) return 'user';
  const meta = user.user_metadata || {};
  if (['developer', 'admin'].includes(meta.role)) return meta.role;
  return 'user';
}

/** Resolve display name from user metadata. */
function resolveDisplayName(user) {
  if (!user) return null;
  const meta = user.user_metadata || {};
  return meta.display_name || null;
}

/**
 * Fetch role and display_name from profiles table (source of truth).
 * Falls back to user_metadata if profiles query fails.
 */
async function fetchProfileRole(user) {
  if (!user || !supabase) return { role: resolveRole(user), displayName: resolveDisplayName(user) };
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('role, display_name')
      .eq('id', user.id)
      .single();
    if (!error && data) {
      return {
        role: data.role || 'user',
        displayName: data.display_name || null,
      };
    }
  } catch {
    // Fallback to metadata
  }
  return { role: resolveRole(user), displayName: resolveDisplayName(user) };
}

// ── Supabase auth methods ───────────────────────────────────────────────────

async function supabaseSignUp(email, password) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  const { role, displayName } = await fetchProfileRole(data.user);
  return {
    user: data.user,
    session: data.session,
    tier: resolveTier(data.user),
    role,
    displayName,
    needsVerification: !data.session, // email confirmation required
  };
}

async function supabaseSignIn(email, password, rememberMe = true) {
  // When rememberMe is false, we still sign in but will clear persistence after
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;

  // If rememberMe is false, set session persistence to memory-only
  if (!rememberMe) {
    // Session will exist for this page load only
    try {
      // Remove persisted session so it won't survive a page reload
      localStorage.removeItem(`sb-${new URL(import.meta.env.VITE_SUPABASE_URL).hostname.split('.')[0]}-auth-token`);
    } catch { /* ignore */ }
  }

  const { role, displayName } = await fetchProfileRole(data.user);
  return {
    user: data.user,
    session: data.session,
    tier: resolveTier(data.user),
    role,
    displayName,
  };
}

async function supabaseSignOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

async function supabaseGetSession() {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) throw error;
  if (!session) return null;
  const { role, displayName } = await fetchProfileRole(session.user);
  return {
    user: session.user,
    session,
    tier: resolveTier(session.user),
    role,
    displayName,
  };
}

async function supabaseResetPassword(email) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });
  if (error) throw error;
}

async function supabaseUpdatePassword(newPassword) {
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) throw error;
}

/** Update the user's display name in both metadata and profiles table. */
async function supabaseUpdateDisplayName(displayName) {
  const { error: metaErr } = await supabase.auth.updateUser({
    data: { display_name: displayName },
  });
  if (metaErr) throw metaErr;

  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    await supabase.from('profiles').update({ display_name: displayName }).eq('id', user.id);
  }
}

function supabaseOnAuthChange(callback) {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    async (event, session) => {
      if (session?.user) {
        const { role, displayName } = await fetchProfileRole(session.user);
        callback(event, session.user, session, resolveTier(session.user), role, displayName);
      } else {
        callback(event, null, null, 'anon', 'user', null);
      }
    }
  );
  return () => subscription.unsubscribe();
}

// ── Mock auth methods (local dev without Supabase) ──────────────────────────

const MOCK_STORAGE_KEY = 'settlement_mock_auth';

function mockLoadAuth() {
  try {
    return JSON.parse(localStorage.getItem(MOCK_STORAGE_KEY));
  } catch {
    return null;
  }
}

function mockSaveAuth(data) {
  if (data) {
    localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(data));
  } else {
    localStorage.removeItem(MOCK_STORAGE_KEY);
  }
}

async function mockSignUp(email, password) {
  const user = { id: 'mock_' + Date.now(), email, user_metadata: {} };
  const session = { access_token: 'mock_token_' + Date.now() };
  const result = { user, session, tier: 'free', role: 'user', displayName: null, needsVerification: false };
  mockSaveAuth(result);
  return result;
}

async function mockSignIn(email, password, rememberMe = true) {
  const saved = mockLoadAuth();
  if (saved && saved.user.email === email) {
    return saved;
  }
  // Create new mock user on sign-in (dev convenience)
  return mockSignUp(email, password);
}

async function mockSignOut() {
  mockSaveAuth(null);
}

async function mockGetSession() {
  return mockLoadAuth();
}

async function mockResetPassword() {
  // No-op in mock mode
}

async function mockUpdatePassword() {
  // No-op in mock mode
}

async function mockUpdateDisplayName() {
  // No-op in mock mode
}

function mockOnAuthChange() {
  // No-op — mock mode doesn't have real-time auth changes
  return () => {};
}

// ── Exported API (auto-selects Supabase or mock) ────────────────────────────

export const auth = {
  signUp:             isConfigured ? supabaseSignUp             : mockSignUp,
  signIn:             isConfigured ? supabaseSignIn              : mockSignIn,
  signOut:            isConfigured ? supabaseSignOut             : mockSignOut,
  getSession:         isConfigured ? supabaseGetSession          : mockGetSession,
  resetPassword:      isConfigured ? supabaseResetPassword       : mockResetPassword,
  updatePassword:     isConfigured ? supabaseUpdatePassword      : mockUpdatePassword,
  updateDisplayName:  isConfigured ? supabaseUpdateDisplayName   : mockUpdateDisplayName,
  onAuthChange:       isConfigured ? supabaseOnAuthChange        : mockOnAuthChange,
  isConfigured,
};
