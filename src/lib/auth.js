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

/**
 * Magic-link / OTP sign-in. Sends a one-time link to the user's email;
 * clicking it completes auth without a password. WCAG 2.2 SC 3.3.8
 * (Accessible Authentication, Minimum) explicitly disallows requiring
 * a cognitive function test like password recall — magic link
 * satisfies that without compromising security.
 *
 * Same `auth.signInWithOtp` call as the standard Supabase pattern;
 * we constrain the redirect to our own origin to satisfy the
 * Supabase redirect-allowlist requirement.
 */
async function supabaseSignInWithMagicLink(email) {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      // Restrict to our own origin so a stolen link can't redirect
      // a user into an attacker-controlled callback.
      emailRedirectTo: `${window.location.origin}`,
      shouldCreateUser: true,  // sign up + sign in are unified
    },
  });
  if (error) throw error;
  // No session yet — completion happens when the user clicks the link
  // and Supabase's onAuthStateChange fires.
  return { sentTo: email };
}

/** Mock equivalent for local-dev mode. Pretends success after 200ms. */
async function mockSignInWithMagicLink(email) {
  await new Promise(r => setTimeout(r, 200));
  return { sentTo: email };
}

/**
 * OAuth sign-in. Supabase handles the full redirect dance — we tell it
 * the provider and the URL to return to. On success, the user's session
 * is established when their browser lands back on our origin and the
 * onAuthStateChange listener fires.
 *
 * Provider notes:
 *   - 'google'  — works once the user enables Google as an auth provider
 *                 in the Supabase dashboard (no app code needed beyond
 *                 the dashboard config + redirect-allowlist entry).
 *   - 'discord' — same drill; gated behind the `discordOauth` flag in
 *                 the UI until the Anthropic-Discord review completes.
 *
 * @param {'google' | 'discord' | 'github'} provider
 */
async function supabaseSignInWithOAuth(provider) {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${window.location.origin}`,
    },
  });
  if (error) throw error;
  // signInWithOAuth returns a redirect URL but Supabase navigates the
  // browser itself, so the caller never resolves to a session — that
  // arrives via onAuthStateChange once the user lands back on our origin.
  return data;
}

/** Mock equivalent — surfaces a friendly hint and resolves to no session. */
async function mockSignInWithOAuth(provider) {
  return { provider, mock: true };
}

async function supabaseUpdatePassword(newPassword) {
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) throw error;
}

/**
 * Update the user's display name.
 *
 * Calls the `update_display_name(text)` RPC (migration 009) which is the
 * single safe path for changing display_name — the same migration locks
 * direct UPDATE on protected columns (role/tier/credits/is_founder) so
 * routing through the RPC is necessary anyway for forward-compatibility.
 *
 * Also mirrors into user_metadata so the JWT-cached read stays consistent
 * across page loads without waiting for the profiles row to be refetched.
 *
 * Falls back to the legacy direct UPDATE if the RPC isn't yet exposed —
 * that path stays valid because the column-locking policy still permits
 * display_name writes, even when the RPC isn't available.
 */
async function supabaseUpdateDisplayName(displayName) {
  // Primary path: RPC (introduced in migration 009).
  const { error: rpcErr } = await supabase.rpc('update_display_name', {
    new_name: displayName,
  });

  if (rpcErr) {
    // Either migration 009 hasn't been applied or RPC permission is missing.
    // Fall back to the legacy direct-table write so we don't break on a
    // partial server-side rollout.
    const { error: tableErr } = await supabase
      .from('profiles')
      .update({ display_name: displayName })
      .eq('id', (await supabase.auth.getUser()).data?.user?.id);
    if (tableErr) throw tableErr;
  }

  // Mirror into user_metadata regardless of which path won. This keeps
  // the JWT representation aligned with the profiles row so any code
  // reading from `user.user_metadata.display_name` sees the new value
  // without a separate refresh.
  const { error: metaErr } = await supabase.auth.updateUser({
    data: { display_name: displayName },
  });
  if (metaErr) throw metaErr;
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
  signInWithMagicLink:isConfigured ? supabaseSignInWithMagicLink : mockSignInWithMagicLink,
  signInWithOAuth:    isConfigured ? supabaseSignInWithOAuth     : mockSignInWithOAuth,
  signOut:            isConfigured ? supabaseSignOut             : mockSignOut,
  getSession:         isConfigured ? supabaseGetSession          : mockGetSession,
  resetPassword:      isConfigured ? supabaseResetPassword       : mockResetPassword,
  updatePassword:     isConfigured ? supabaseUpdatePassword      : mockUpdatePassword,
  updateDisplayName:  isConfigured ? supabaseUpdateDisplayName   : mockUpdateDisplayName,
  onAuthChange:       isConfigured ? supabaseOnAuthChange        : mockOnAuthChange,
  isConfigured,
};
