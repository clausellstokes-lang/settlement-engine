/**
 * auth.js — Authentication service layer.
 *
 * Wraps Supabase auth with graceful fallback to mock mode when
 * Supabase is not configured (no env vars). This lets the app
 * run locally without a backend while using the same API surface.
 *
 * Tier resolution:
 *   - 'anon' = no session
 *   - 'free' = authenticated, no premium profile grant
 *   - 'premium' = profiles.tier === 'premium'
 *
 * Role resolution (orthogonal to tier):
 *   - 'user'      = default, normal user
 *   - 'developer' = full access, bypasses all gates
 *   - 'admin'     = admin panel access
 *   (set via profiles.role only; user_metadata is not trusted)
 */

import { supabase, isConfigured, setSessionPersistence } from './supabase.js';
import { DEFAULT_MODEL_PREFERENCE, normalizeModelPreference } from '../config/pricing.js';

// Owner-override email for CLIENT-SIDE admin-UI gating only — never a security
// boundary (the server re-validates every privileged action via admin-actions +
// RLS + profiles.role). Configurable via VITE_OWNER_EMAIL, empty by default so
// no personal address is hardcoded in the shipped bundle. When unset the owner
// still gets admin UI through their server-set profiles.role; this is purely a
// convenience shortcut. Fail-closed: empty env grants no one the shortcut.
const OWNER_EMAIL = String(import.meta.env.VITE_OWNER_EMAIL || '').trim().toLowerCase();

/** Resolve display name from user metadata. */
function resolveDisplayName(user) {
  if (!user) return null;
  const meta = user.user_metadata || {};
  return meta.display_name || null;
}

function normalizeTier(value, fallback = 'free') {
  return value === 'premium' || value === 'free' ? value : fallback;
}

function normalizeRole(value) {
  return ['developer', 'admin'].includes(value) ? value : 'user';
}

function isOwnerEmail(email) {
  if (!OWNER_EMAIL) return false; // fail-closed: no configured owner → no shortcut
  return String(email || '').trim().toLowerCase() === OWNER_EMAIL;
}

function buildProfileResult(user, data = {}) {
  const owner = isOwnerEmail(user?.email || data?.email);
  return {
    tier: normalizeTier(data.tier),
    role: owner ? 'admin' : normalizeRole(data.role),
    displayName: data.display_name || resolveDisplayName(user),
    isFounder: data.is_founder === true,
    avatarUrl: data.avatar_url || null,
    emailNotifications: data.email_notifications !== false,
    modelPreference: normalizeModelPreference(data.model_preference),
  };
}

/**
 * Fetch profile-backed auth grants from the profiles table, the source of
 * truth for every privileged gate. On failure, fall back to safe non-
 * privileged defaults rather than trusting user-writable metadata.
 */
async function fetchProfileAuth(user) {
  if (!user) {
    return { tier: 'anon', role: 'user', displayName: null, isFounder: false, avatarUrl: null, emailNotifications: true, modelPreference: DEFAULT_MODEL_PREFERENCE };
  }
  if (!supabase) {
    return buildProfileResult(user, {});
  }
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('role, display_name, tier, is_founder, avatar_url, email_notifications, model_preference, email')
      .eq('id', user.id)
      .single();
    if (!error && data) {
      return buildProfileResult(user, data);
    }
  } catch {
    // Safe defaults below.
  }
  return buildProfileResult(user, {});
}

function authPayload(user, session, profile, extra = {}) {
  return {
    user,
    session,
    tier: profile.tier,
    role: profile.role,
    displayName: profile.displayName,
    isFounder: profile.isFounder,
    avatarUrl: profile.avatarUrl,
    emailNotifications: profile.emailNotifications,
    modelPreference: profile.modelPreference,
    ...extra,
  };
}

// ── Supabase auth methods ───────────────────────────────────────────────────

async function supabaseSignUp(email, password) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  // Supabase returns an OBFUSCATED user with an EMPTY identities array when the
  // email already belongs to an account (it declines to leak existence via an
  // error). Surface that so the UI can steer the user to sign-in / reset instead
  // of "succeeding" into a dead verification limbo. (RP-1 item 5.)
  if (data?.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
    return { existingAccount: true };
  }
  const profile = await fetchProfileAuth(data.user);
  return authPayload(data.user, data.session, profile, {
    needsVerification: !data.session, // email confirmation required
  });
}

async function supabaseSignIn(email, password, rememberMe = true) {
  // Route persistence BEFORE sign-in so the token (and every auto-refresh after)
  // is written to the correct store: sessionStorage when "remember me" is off
  // (cleared on browser close), localStorage otherwise. This replaces the old
  // one-time localStorage delete, which auto-refresh silently undid.
  setSessionPersistence(rememberMe);

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;

  const profile = await fetchProfileAuth(data.user);
  return authPayload(data.user, data.session, profile);
}

async function supabaseSignOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

async function supabaseGetSession() {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) throw error;
  if (!session) return null;
  const profile = await fetchProfileAuth(session.user);
  return authPayload(session.user, session, profile);
}

async function supabaseResetPassword(email) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });
  if (error) throw error;
}

// ── Security questions + gated account recovery (migrations 066-068) ─────────
//
// `RECOVERY_RATE_LIMITED` is a stable sentinel the UI can branch on to show the
// "too many attempts" copy and back off, distinct from a plain wrong answer.
// `RECOVERY_UNAVAILABLE` covers an outage / opaque transport error.
const RECOVERY_RATE_LIMITED = 'recovery_rate_limited';
const RECOVERY_UNAVAILABLE = 'recovery_unavailable';

/**
 * Persist the caller's two security answers via the SECURITY DEFINER RPC
 * `set_my_security_answers` (migration 066). The RPC needs auth.uid(), so this
 * MUST run with a live session — at sign-up that means AFTER the polling
 * auto-login succeeds (signUp itself returns no session when email confirmation
 * is enabled). The raw answers are hashed server-side and never persisted in
 * plaintext; only the stable question ids and the bcrypt hashes are stored.
 *
 * @param {{ q1: string, a1: string, q2: string, a2: string }} answers
 */
async function supabaseSetSecurityAnswers({ q1, a1, q2, a2 }) {
  const { error } = await supabase.rpc('set_my_security_answers', {
    p_q1: q1,
    p_a1: a1,
    p_q2: q2,
    p_a2: a2,
  });
  if (error) throw error;
}

/**
 * Read which of the caller's two security-question slots are set, via the
 * SECURITY DEFINER RPC `get_my_security_question_ids` (migration 066). Returns
 * the stored `{ slot, questionId }` pairs (NEVER the answer hash). Needs a live
 * session (auth.uid()); returns an empty array on any failure so the UI degrades
 * to a "not set yet" state rather than throwing.
 *
 * @returns {Promise<Array<{ slot: number, questionId: string }>>}
 */
async function supabaseGetSecurityQuestionIds() {
  try {
    const { data, error } = await supabase.rpc('get_my_security_question_ids');
    if (error || !Array.isArray(data)) return [];
    return data.map((row) => ({
      slot: Number(row.slot),
      questionId: String(row.question_id),
    }));
  } catch {
    return [];
  }
}

// supabase.functions.invoke surfaces a non-2xx as `error` with the JSON body on
// error.context; normalize both the happy path and the rate-limit/outage cases
// into a shape the store + UI can branch on without knowing transport details.
async function readRecoveryError(error) {
  try {
    const body = await error?.context?.json?.();
    if (body && typeof body === 'object') return body;
  } catch {
    // No JSON body (network error, opaque response) — fall through to status.
  }
  const status = error?.context?.status;
  if (status === 429) return { error: 'rate_limited' };
  if (status === 503) return { error: 'rate_limit_unavailable' };
  return null;
}

/**
 * Step 1 of recovery: look up an email and get ONE random security question.
 * Returns { exists, slot, questionId }. `exists:false` is a legitimate answer
 * (the operator chose reveal-as-described) — the edge function still rate-limits
 * it. A rate-limit or outage maps to a thrown Error tagged with a stable `code`.
 *
 * @param {string} email
 * @returns {Promise<{ exists: boolean, slot: number|null, questionId: string|null }>}
 */
async function supabaseRecoveryLookup(email) {
  const { data, error } = await supabase.functions.invoke('auth-recovery', {
    body: { action: 'lookup', email },
  });
  if (error) {
    const body = await readRecoveryError(error);
    /** @type {Error & { code?: string }} */
    const err = new Error('Recovery lookup failed.');
    if (body?.error === 'rate_limited') err.code = RECOVERY_RATE_LIMITED;
    else err.code = RECOVERY_UNAVAILABLE;
    throw err;
  }
  return {
    exists: data?.exists === true,
    slot: typeof data?.slot === 'number' ? data.slot : null,
    questionId: typeof data?.questionId === 'string' ? data.questionId : null,
  };
}

/**
 * Step 2 of recovery: submit the answer to the question chosen in step 1. On a
 * correct answer the edge function mails the reset link and we return ok:true;
 * a wrong answer returns ok:false. A rate-limit / outage throws a coded Error so
 * the UI can show the back-off copy rather than a generic "wrong answer".
 *
 * @param {{ email: string, slot: number, answer: string }} args
 * @returns {Promise<{ ok: boolean }>}
 */
async function supabaseRecoveryVerify({ email, slot, answer }) {
  const { data, error } = await supabase.functions.invoke('auth-recovery', {
    body: { action: 'verify', email, slot, answer },
  });
  if (error) {
    const body = await readRecoveryError(error);
    /** @type {Error & { code?: string }} */
    const err = new Error('Recovery verification failed.');
    if (body?.error === 'rate_limited') err.code = RECOVERY_RATE_LIMITED;
    else err.code = RECOVERY_UNAVAILABLE;
    throw err;
  }
  return { ok: data?.ok === true };
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
/**
 * Map a raw Supabase OAuth error to a safe, non-leaky display string. The
 * load-bearing case for shipping the OAuth buttons flag-on before the dashboard
 * providers are configured: a "provider not enabled" error reads as a calm
 * "not available right now" instead of a raw Supabase error or a crash.
 * (Richer identity-collision copy is THEIRS' W4 refinement — out of scope here.)
 *
 * @param {{ message?: string, code?: string } | null} error
 * @returns {string} a safe message to show the user
 */
function describeOAuthError(error) {
  const raw = String(error?.message || '').toLowerCase();
  if (raw.includes('not enabled') || raw.includes('unsupported provider')) {
    return 'That sign-in option isn’t available right now. Use your email instead.';
  }
  return 'Sign-in failed. Please try again.';
}

async function supabaseSignInWithOAuth(provider) {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${window.location.origin}`,
    },
  });
  if (error) {
    // `userMessage` is our own safe-display augmentation; the Supabase AuthError
    // type doesn't declare it, so attach it through a loose cast. Callers
    // (authSlice.authOAuth → AuthPanel) prefer it over the raw message.
    /** @type {any} */ (error).userMessage = describeOAuthError(error);
    throw error;
  }
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

async function supabaseUpdateProfilePreferences(prefs = {}) {
  const patch = {};
  if (Object.prototype.hasOwnProperty.call(prefs, 'avatarUrl')) {
    const value = String(prefs.avatarUrl || '').trim();
    patch.avatar_url = value || null;
  }
  if (Object.prototype.hasOwnProperty.call(prefs, 'emailNotifications')) {
    patch.email_notifications = prefs.emailNotifications !== false;
  }
  if (Object.prototype.hasOwnProperty.call(prefs, 'modelPreference')) {
    patch.model_preference = normalizeModelPreference(prefs.modelPreference);
  }
  if (Object.keys(patch).length === 0) return fetchProfileAuth((await supabase.auth.getUser()).data?.user);

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { error } = await supabase
    .from('profiles')
    .update(patch)
    .eq('id', user.id);
  if (error) throw error;

  return fetchProfileAuth(user);
}

function supabaseOnAuthChange(callback) {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    async (event, session) => {
      if (session?.user) {
        const profile = await fetchProfileAuth(session.user);
        callback(
          event,
          session.user,
          session,
          profile.tier,
          profile.role,
          profile.displayName,
          profile.isFounder,
          profile.avatarUrl,
          profile.emailNotifications,
          profile.modelPreference,
        );
      } else {
        callback(event, null, null, 'anon', 'user', null, false, null, true, DEFAULT_MODEL_PREFERENCE);
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

async function mockSignUp(email, _password) {
  const user = { id: 'mock_' + Date.now(), email, user_metadata: {} };
  const session = { access_token: 'mock_token_' + Date.now() };
  const result = {
    user,
    session,
    tier: 'free',
    role: isOwnerEmail(email) ? 'admin' : 'user',
    displayName: null,
    isFounder: false,
    avatarUrl: null,
    emailNotifications: true,
    modelPreference: DEFAULT_MODEL_PREFERENCE,
    needsVerification: false,
  };
  mockSaveAuth(result);
  return result;
}

async function mockSignIn(email, password, _rememberMe = true) {
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

/**
 * Mock security-answer save — local dev has no server hash, so we only record
 * which question ids were chosen (never any answer text) so mockGetSecurity
 * QuestionIds can read them back. Keeps the sign-up flow exercisable end-to-end.
 *
 * @param {{ q1?: string, a1?: string, q2?: string, a2?: string }} [answers]
 */
async function mockSetSecurityAnswers({ q1, q2 } = {}) {
  const saved = mockLoadAuth();
  if (!saved) return;
  mockSaveAuth({ ...saved, securityQuestionIds: [
    { slot: 1, questionId: q1 },
    { slot: 2, questionId: q2 },
  ] });
}

/** Mock equivalent — reads back the question ids recorded by mockSetSecurityAnswers. */
async function mockGetSecurityQuestionIds() {
  const saved = mockLoadAuth();
  const ids = saved?.securityQuestionIds;
  return Array.isArray(ids) ? ids : [];
}

/**
 * Mock recovery lookup — local dev has no real account store, so we pretend the
 * typed email always exists and ask the first security question. Lets the
 * forgot-password challenge flow be exercised end-to-end without a backend.
 */
async function mockRecoveryLookup() {
  await new Promise(r => setTimeout(r, 150));
  return { exists: true, slot: 1, questionId: 'first_pet' };
}

/**
 * Mock recovery verify — in local dev any non-empty answer "matches" so the flow
 * reaches its check-your-email close. No real link is mailed.
 */
async function mockRecoveryVerify({ answer }) {
  await new Promise(r => setTimeout(r, 150));
  return { ok: Boolean(String(answer || '').trim()) };
}

async function mockUpdateDisplayName() {
  // No-op in mock mode
}

async function mockUpdateProfilePreferences(prefs = {}) {
  const saved = mockLoadAuth();
  if (!saved) return null;
  const next = {
    ...saved,
    avatarUrl: Object.prototype.hasOwnProperty.call(prefs, 'avatarUrl') ? (prefs.avatarUrl || null) : saved.avatarUrl,
    emailNotifications: Object.prototype.hasOwnProperty.call(prefs, 'emailNotifications') ? prefs.emailNotifications !== false : saved.emailNotifications,
    modelPreference: Object.prototype.hasOwnProperty.call(prefs, 'modelPreference') ? normalizeModelPreference(prefs.modelPreference) : (saved.modelPreference || DEFAULT_MODEL_PREFERENCE),
  };
  mockSaveAuth(next);
  return next;
}

function mockOnAuthChange() {
  // No-op — mock mode doesn't have real-time auth changes
  return () => {};
}

// ── Exported API (auto-selects Supabase or mock) ────────────────────────────

// Lazily load the Account "Security" methods, kept OFF the first-paint closure.
// Typed Promise<any> so the wrapper arrows below don't have to reconcile the
// module's mock-vs-supabase union return types (JS/tsc inference noise only).
const loadAuthSecurity = () => /** @type {Promise<any>} */ (import('./authSecurity.js'));

export const auth = {
  signUp:             isConfigured ? supabaseSignUp             : mockSignUp,
  signIn:             isConfigured ? supabaseSignIn              : mockSignIn,
  signInWithMagicLink:isConfigured ? supabaseSignInWithMagicLink : mockSignInWithMagicLink,
  signInWithOAuth:    isConfigured ? supabaseSignInWithOAuth     : mockSignInWithOAuth,
  signOut:            isConfigured ? supabaseSignOut             : mockSignOut,
  getSession:         isConfigured ? supabaseGetSession          : mockGetSession,
  resetPassword:      isConfigured ? supabaseResetPassword       : mockResetPassword,
  updatePassword:     isConfigured ? supabaseUpdatePassword      : mockUpdatePassword,
  // Login & security (Account "Security" section) — the implementations live in
  // the LAZILY-loaded ./authSecurity.js so their bodies stay OFF the first-paint
  // entry closure (they are only ever called from the lazy Account page). Each
  // is exposed via a thin dynamic-import wrapper, so callers still route through
  // the auth service + real supabase-js exactly as before.
  reauthenticateWithPassword: (p) => loadAuthSecurity().then(m => m.reauthenticateWithPassword(p)),
  changePassword:     (args) => loadAuthSecurity().then(m => m.changePassword(args)),
  getIdentities:      () => loadAuthSecurity().then(m => m.getIdentities()),
  linkIdentity:       (provider) => loadAuthSecurity().then(m => m.linkIdentity(provider)),
  unlinkIdentity:     (identity) => loadAuthSecurity().then(m => m.unlinkIdentity(identity)),
  signOutEverywhere:  () => loadAuthSecurity().then(m => m.signOutEverywhere()),
  getAccountNumber:   () => loadAuthSecurity().then(m => m.getAccountNumber()),
  // Single concurrent session (§7.3, M-9d). Only signOutLocalSession is exposed here —
  // it is the ONE session call reached from eager store code (evictSession). claim +
  // is-current + fetchActive are called from LAZY modules (sessionClient, the account
  // panel) that import authSecurity directly, so they need no eager wrapper.
  signOutLocalSession: () => loadAuthSecurity().then(m => m.signOutLocalSession()),
  updateDisplayName:  isConfigured ? supabaseUpdateDisplayName   : mockUpdateDisplayName,
  updateProfilePreferences: isConfigured ? supabaseUpdateProfilePreferences : mockUpdateProfilePreferences,
  // Security questions + gated recovery (migrations 066-068).
  setSecurityAnswers:     isConfigured ? supabaseSetSecurityAnswers     : mockSetSecurityAnswers,
  getSecurityQuestionIds: isConfigured ? supabaseGetSecurityQuestionIds : mockGetSecurityQuestionIds,
  recoveryLookup:     isConfigured ? supabaseRecoveryLookup      : mockRecoveryLookup,
  recoveryVerify:     isConfigured ? supabaseRecoveryVerify      : mockRecoveryVerify,
  onAuthChange:       isConfigured ? supabaseOnAuthChange        : mockOnAuthChange,
  isConfigured,
};

// Stable sentinel the forgot-password UI branches on to show the back-off copy
// (distinct from a plain wrong answer). See supabaseRecoveryLookup/Verify.
export { RECOVERY_RATE_LIMITED };
