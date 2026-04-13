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
 */

import { supabase, isConfigured } from './supabase.js';

/** Resolve tier from Supabase user metadata. */
function resolveTier(user) {
  if (!user) return 'anon';
  const meta = user.user_metadata || {};
  if (meta.tier === 'premium') return 'premium';
  return 'free';
}

// ── Supabase auth methods ───────────────────────────────────────────────────

async function supabaseSignUp(email, password) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  return {
    user: data.user,
    session: data.session,
    tier: resolveTier(data.user),
    needsVerification: !data.session, // email confirmation required
  };
}

async function supabaseSignIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return {
    user: data.user,
    session: data.session,
    tier: resolveTier(data.user),
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
  return {
    user: session.user,
    session,
    tier: resolveTier(session.user),
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

function supabaseOnAuthChange(callback) {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    (event, session) => {
      callback(event, session?.user || null, session, resolveTier(session?.user));
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
  const result = { user, session, tier: 'free', needsVerification: false };
  mockSaveAuth(result);
  return result;
}

async function mockSignIn(email, password) {
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

function mockOnAuthChange() {
  // No-op — mock mode doesn't have real-time auth changes
  return () => {};
}

// ── Exported API (auto-selects Supabase or mock) ────────────────────────────

export const auth = {
  signUp:          isConfigured ? supabaseSignUp          : mockSignUp,
  signIn:          isConfigured ? supabaseSignIn           : mockSignIn,
  signOut:         isConfigured ? supabaseSignOut          : mockSignOut,
  getSession:      isConfigured ? supabaseGetSession       : mockGetSession,
  resetPassword:   isConfigured ? supabaseResetPassword    : mockResetPassword,
  updatePassword:  isConfigured ? supabaseUpdatePassword   : mockUpdatePassword,
  onAuthChange:    isConfigured ? supabaseOnAuthChange     : mockOnAuthChange,
  isConfigured,
};
