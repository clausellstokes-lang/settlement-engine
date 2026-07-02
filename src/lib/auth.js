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

import { supabase, isConfigured, setSessionPersistence, withTimeout } from './supabase.js';
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
    // Account identity (migration 075). account_number is immutable + private;
    // external_name is the public gallery author name; the name parts are
    // private. All are display-only here — writes route through the dedicated
    // RPCs (update_external_name / update_profile_names), never this read path.
    accountNumber: data.account_number || null,
    externalName: data.external_name || null,
    firstName: data.first_name || null,
    lastName: data.last_name || null,
    preferredName: data.preferred_name || null,
  };
}

/**
 * PostgREST returns this code from `.single()` when the filter matched no row.
 * It is the ONLY error that legitimately means "this user has no profile yet"
 * — every other error (RLS denial, network blip, 5xx) is a TRANSIENT query
 * failure, and treating those as "no row" would silently rebuild the session
 * at free/user and downgrade a premium/admin user mid-flight.
 */
const PROFILE_NO_ROW = 'PGRST116';

/**
 * Fetch profile-backed auth grants from the profiles table, the source of
 * truth for every privileged gate.
 *
 * Failure handling distinguishes two cases:
 *   - NO ROW (PGRST116): the user genuinely has no profile, so safe
 *     non-privileged defaults are the correct grant — never trust the
 *     user-writable metadata for tier/role.
 *   - TRANSIENT failure (any other error / thrown exception): we must NOT
 *     downgrade. Returning defaults here would drop a premium/admin user to
 *     free/user on a momentary blip (and every token refresh re-runs this).
 *     Instead we throw, so the caller preserves the last-known session rather
 *     than overwriting it with a downgrade.
 */
async function fetchProfileAuth(user) {
  if (!user) {
    return { tier: 'anon', role: 'user', displayName: null, isFounder: false, avatarUrl: null, emailNotifications: true, modelPreference: DEFAULT_MODEL_PREFERENCE, accountNumber: null, externalName: null, firstName: null, lastName: null, preferredName: null };
  }
  if (!supabase) {
    return buildProfileResult(user, {});
  }
  const { data, error } = await supabase
    .from('profiles')
    .select('role, display_name, tier, is_founder, avatar_url, email_notifications, model_preference, email, account_number, external_name, first_name, last_name, preferred_name')
    .eq('id', user.id)
    .single();
  if (error && error.code !== PROFILE_NO_ROW) {
    // Transient query failure — do not downgrade. Surface it so the caller
    // keeps the existing session/tier instead of rebuilding at free/user.
    /** @type {Error & { code?: string }} */
    const err = new Error('Profile lookup failed.');
    err.code = 'profile_lookup_failed';
    throw err;
  }
  if (!error && data) {
    return buildProfileResult(user, data);
  }
  // PROFILE_NO_ROW (or a null row with no error): genuinely no profile yet.
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
    accountNumber: profile.accountNumber,
    externalName: profile.externalName,
    firstName: profile.firstName,
    lastName: profile.lastName,
    preferredName: profile.preferredName,
    ...extra,
  };
}

// ── Supabase auth methods ───────────────────────────────────────────────────

// The email-confirmation link lands on a MINIMAL standalone page (NOT the
// original signup window, which polls itself into a session). Threading
// emailRedirectTo here points Supabase's confirmation link at that page; the
// signup window never navigates — it auto-logs-in once the link is clicked
// anywhere. Constrained to our own origin (mirrors the magic-link redirect).
function confirmEmailRedirectTo() {
  return `${window.location.origin}/confirm-email`;
}

async function supabaseSignUp(email, password) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: confirmEmailRedirectTo() },
  });
  if (error) throw error;
  const profile = await fetchProfileAuth(data.user);
  return authPayload(data.user, data.session, profile, {
    needsVerification: !data.session, // email confirmation required
  });
}

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
 * the stored `{ slot, questionId }` pairs (NEVER the answer hash) so the account
 * page can show which questions are configured. Needs a live session
 * (auth.uid()); returns an empty array on any failure so the UI degrades to a
 * "not set yet" state rather than throwing.
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
  // Guard against a hung revoke: supabase.auth.signOut() performs a network
  // token-revoke with no internal timeout, so a stalled connection would leave
  // this awaiting forever. authSignOut (authSlice) calls clearAuth() AFTER this
  // resolves OR rejects — so on timeout we reject, the caller's catch runs, and
  // clearAuth() still clears the local session. The user is signed out locally
  // even if the server revoke never lands (10s — sign-out should feel instant).
  const { error } = await withTimeout(supabase.auth.signOut(), 10000, 'Sign out');
  if (error) throw error;
}

async function supabaseGetSession() {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) throw error;
  if (!session) return null;
  // A transient profile-lookup failure PROPAGATES (fetchProfileAuth throws on a
  // non-PGRST116 error). We deliberately do NOT swallow it into a fallback profile:
  // the only tier source available here is the user-WRITABLE user_metadata (trusting
  // it would let a user self-promote to premium) or buildProfileResult(user,{}) which
  // is a FREE/user DOWNGRADE — both wrong. Rejecting lets initAuth treat it as the
  // retryable transient state it is (a later onAuthChange / retry restores the real
  // tier) instead of persisting a wrong tier. No false grant, no silent downgrade.
  const profile = await fetchProfileAuth(session.user);
  return authPayload(session.user, session, profile);
}

async function supabaseResetPassword(email) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });
  if (error) throw error;
}

// ── Logged-out account recovery (Auth Phase 2) ──────────────────────────────
//
// The forgot-password challenge runs entirely through the `auth-recovery` edge
// function (service-role, rate-limited, bot-guarded — the caller has no JWT).
// We never touch the security-answer hash here; the function returns only the
// random question (lookup) and a boolean (verify). On a correct answer the
// FUNCTION itself mails the reset link, so the client only learns ok:true/false.
//
// `RECOVERY_RATE_LIMITED` is a stable sentinel the UI can branch on to show the
// "too many attempts" copy and back off, distinct from a plain wrong answer.
const RECOVERY_RATE_LIMITED = 'recovery_rate_limited';
const RECOVERY_UNAVAILABLE = 'recovery_unavailable';

// supabase.functions.invoke surfaces a non-2xx as `error` with the JSON body on
// error.context; normalize both the happy path and the rate-limit/again cases
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
    else if (body?.error === 'rate_limit_unavailable') err.code = RECOVERY_UNAVAILABLE;
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
    else if (body?.error === 'rate_limit_unavailable') err.code = RECOVERY_UNAVAILABLE;
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

/**
 * Recognise the "no such account" error class GoTrue returns when
 * `shouldCreateUser:false` is set and the email has no account (or OTP signups
 * are disabled). Across versions this surfaces as the `otp_disabled` code, a
 * 422 "Signups not allowed for otp" message, or a "user not found" message.
 *
 * This is the enumeration-oracle case: letting it throw while a real account
 * resolves success would tell an attacker which emails are registered. We treat
 * the whole class as success-shaped so the caller can't distinguish the two.
 *
 * @param {{ code?: string, status?: number, message?: string } | null} error
 */
function isMagicLinkNoAccountError(error) {
  if (!error) return false;
  const code = String(error.code || '').toLowerCase();
  const msg = String(error.message || '').toLowerCase();
  return (
    code === 'otp_disabled' ||
    code === 'user_not_found' ||
    msg.includes('signups not allowed') ||
    msg.includes('user not found') ||
    msg.includes('not allowed for otp')
  );
}

async function supabaseSignInWithMagicLink(email) {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      // Restrict to our own origin so a stolen link can't redirect
      // a user into an attacker-controlled callback.
      emailRedirectTo: `${window.location.origin}`,
      // Sign-IN surface: never mint a new account here. Creating a user on this
      // path would forge a passwordless account that can never use a password.
      // Only the explicit sign-UP flow creates users.
      shouldCreateUser: false,
    },
  });
  // Suppress the no-account error class so existence stays hidden: a missing
  // account resolves with the SAME success shape as a real send. Other failures
  // (rate limit, network, config) still throw — they aren't existence oracles.
  if (error && !isMagicLinkNoAccountError(error)) throw error;
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
 * The single OAuth redirect target. We send the browser back to the app
 * ROOT (not a bespoke /auth/callback): the Supabase client is created with
 * `detectSessionInUrl: true`, so on return it parses the access/refresh
 * tokens out of the URL hash, persists the session, and fires
 * `onAuthStateChange('SIGNED_IN')` — which authSlice.initAuth already
 * listens for. No dedicated callback route or extra handling is needed.
 *
 * Constrained to our own origin so a tampered redirect can't bounce a user
 * into an attacker-controlled callback (mirrors the magic-link redirect).
 */
function oauthRedirectTo() {
  return `${window.location.origin}`;
}

/**
 * Translate a raw Supabase OAuth error into a safe, user-facing message.
 *
 * Account-linking / provider-conflict is the security-sensitive case: if the
 * email behind the OAuth identity is already registered (e.g. via password),
 * Supabase rejects the implicit link rather than silently merging accounts.
 * We surface a clear "sign in with your password" nudge WITHOUT leaking which
 * provider owns the account or whether the email exists — only what's safe.
 *
 * @param {{ message?: string, code?: string, status?: number } | null} error
 * @returns {string} a safe message to show the user
 */
function describeOAuthError(error) {
  const raw = String(error?.message || '').toLowerCase();
  const code = String(error?.code || '').toLowerCase();
  // Supabase reports identity/email collisions a few ways across versions.
  if (
    code.includes('identity_already_exists') ||
    code === 'email_exists' ||
    raw.includes('already registered') ||
    raw.includes('already been registered') ||
    raw.includes('already exists') ||
    raw.includes('already linked') ||
    raw.includes('identity is already')
  ) {
    return 'This email is already registered. Sign in with your password instead, then link this provider from your account settings.';
  }
  // Anything else: a generic, non-leaky failure message.
  return 'Sign-in failed. Please try again.';
}

/**
 * Low-level OAuth kickoff. Supabase handles the full redirect dance — we tell
 * it the provider and the URL to return to. The browser then navigates to the
 * provider, so this never resolves to a session; that arrives via
 * `onAuthStateChange` once the user lands back on our origin (see
 * `oauthRedirectTo`).
 *
 * Returns `{ data, error }` (mirroring the Supabase shape) so callers can
 * branch without a try/catch. `error.userMessage` carries the safe,
 * already-sanitized string for direct display.
 *
 * @param {'google' | 'discord' | 'github'} provider
 */
async function startOAuth(provider) {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: oauthRedirectTo(),
      // Default scopes are sufficient for both Google and Discord (email +
      // basic profile). We deliberately request no extra scopes to keep the
      // consent screen minimal and the review surface small.
    },
  });
  if (error) {
    // `userMessage` is our own safe-display augmentation; the Supabase
    // AuthError type doesn't declare it, so attach it through a loose cast.
    /** @type {any} */ (error).userMessage = describeOAuthError(error);
  }
  return { data, error };
}

/**
 * Google OAuth. Works once Google is enabled as a provider in the Supabase
 * dashboard (client id/secret + the Supabase callback URL added to the Google
 * Cloud OAuth app's authorized redirect URIs). Until then the call no-ops
 * gracefully: Supabase returns a "provider is not enabled" error which we map
 * to a safe message rather than throwing.
 */
async function supabaseSignInWithGoogle() {
  return startOAuth('google');
}

/**
 * Discord OAuth. Same setup as Google — enable the provider in the Supabase
 * dashboard with the Discord developer-portal app's client id/secret and the
 * Supabase callback URL registered as a redirect.
 */
async function supabaseSignInWithDiscord() {
  return startOAuth('discord');
}

/**
 * Back-compat generic entry. Existing callers (authSlice.authOAuth) pass a
 * provider string; new code should prefer the named wrappers above. Throws on
 * error to preserve the prior contract; the named wrappers return { data,
 * error } instead.
 *
 * @param {'google' | 'discord' | 'github'} provider
 */
async function supabaseSignInWithOAuth(provider) {
  const { data, error } = await startOAuth(provider);
  if (error) {
    // Preserve the safe message on the thrown error so UI catch-blocks show it.
    error.message = /** @type {any} */ (error).userMessage || error.message;
    throw error;
  }
  return data;
}

/** Mock equivalent — surfaces a friendly hint and resolves to no session. */
async function mockSignInWithGoogle() {
  return { data: { provider: 'google', mock: true }, error: null };
}

/** Mock equivalent — surfaces a friendly hint and resolves to no session. */
async function mockSignInWithDiscord() {
  return { data: { provider: 'discord', mock: true }, error: null };
}

/** Mock equivalent for the back-compat generic entry. */
async function mockSignInWithOAuth(provider) {
  return { provider, mock: true };
}

async function supabaseUpdatePassword(newPassword) {
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) throw error;
}

/**
 * Re-authenticate the signed-in user with their CURRENT password before a
 * sensitive change (password change / account deletion). We verify by
 * attempting a password sign-in against the user's own email; on success the
 * caller may proceed. On failure we throw a single, non-leaky error so we never
 * disclose whether the email exists vs. the password was wrong — the only thing
 * the user learns is "re-auth failed".
 *
 * NOTE: signInWithPassword refreshes the session for the SAME user, so this is
 * safe to call mid-session; it does not log anyone else in.
 *
 * @param {string} currentPassword
 */
async function supabaseReauthenticateWithPassword(currentPassword) {
  const { data: { user } } = await supabase.auth.getUser();
  const email = user?.email;
  if (!email || !currentPassword) {
    throw new Error('Re-authentication failed. Please check your password and try again.');
  }
  const { error } = await supabase.auth.signInWithPassword({ email, password: currentPassword });
  if (error) {
    // Deliberately generic — never reveal which factor failed.
    throw new Error('Re-authentication failed. Please check your password and try again.');
  }
}

/**
 * Change password with a current-password re-auth gate. Verifies the current
 * password first (so a hijacked, still-open session can't silently rotate the
 * password), then updates. Errors are mapped to safe, generic messages.
 *
 * @param {{ currentPassword: string, newPassword: string }} args
 */
async function supabaseChangePassword({ currentPassword, newPassword }) {
  await supabaseReauthenticateWithPassword(currentPassword);
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) {
    // Surface validation problems (e.g. too-short) but keep it generic.
    throw new Error(error.message || 'Could not update your password. Please try again.');
  }
}

/**
 * List the OAuth/email identities linked to this account. Used by the Linked
 * Accounts UI to show which providers are connected and offer link/unlink.
 * Returns a plain array (empty on any failure) so the UI degrades gracefully.
 *
 * @returns {Promise<Array<{ id: string, provider: string, identity_id?: string, email?: string }>>}
 */
async function supabaseGetIdentities() {
  try {
    const { data, error } = await supabase.auth.getUserIdentities();
    if (error || !data) return [];
    return data.identities || [];
  } catch {
    return [];
  }
}

/**
 * Link an additional OAuth provider to the current account. Supabase begins a
 * redirect dance just like sign-in; on return the new identity is attached.
 * Constrained to our own origin (mirrors the sign-in redirect).
 *
 * @param {'google' | 'discord'} provider
 */
async function supabaseLinkIdentity(provider) {
  const { data, error } = await supabase.auth.linkIdentity({
    provider,
    options: { redirectTo: oauthRedirectTo() },
  });
  if (error) {
    /** @type {any} */ (error).userMessage = describeOAuthError(error);
    throw new Error(/** @type {any} */ (error).userMessage);
  }
  return data;
}

/**
 * Unlink an OAuth identity. Supabase refuses to remove the LAST identity (that
 * would orphan the account), so the UI must keep one provider connected; we let
 * the server enforce it and surface a safe message if it rejects.
 *
 * @param {{ provider: string, identity_id?: string }} identity an entry from getIdentities()
 */
async function supabaseUnlinkIdentity(identity) {
  const { error } = await supabase.auth.unlinkIdentity(/** @type {any} */ (identity));
  if (error) {
    throw new Error('Could not unlink this provider. You must keep at least one sign-in method.');
  }
}

/**
 * Sign out of ALL sessions everywhere (every device/tab), not just this one.
 * Uses Supabase's global scope so a lost/forgotten device is revoked.
 */
async function supabaseSignOutEverywhere() {
  const { error } = await supabase.auth.signOut({ scope: 'global' });
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

/**
 * Update the user's PUBLIC gallery author name (external_name).
 *
 * Routes through the `update_external_name(text)` RPC (migration 075), the
 * single safe path: it is SECURITY DEFINER and enforces charset/length, the
 * reserved-word guard, and case-insensitive uniqueness server-side (the unique
 * index is the race backstop). There is intentionally NO direct-table fallback
 * here — unlike display_name, external_name has server-authoritative validation
 * that a plain `.update()` would bypass.
 *
 * @param {string} externalName  Proposed public author name (3-24 chars, [A-Za-z0-9_]).
 * @returns {Promise<string>} The trimmed name as persisted.
 * @throws {Error} With a friendly message when taken/reserved/invalid.
 */
async function supabaseUpdateExternalName(externalName) {
  const { data, error } = await supabase.rpc('update_external_name', {
    new_name: externalName,
  });
  if (error) throw new Error(error.message || 'Could not update your author name.');
  return data;
}

/**
 * Update the PRIVATE name parts (first / last / preferred).
 *
 * Routes through the `update_profile_names(text, text, text)` RPC (migration
 * 075). These fields are owner-writable (not RLS-pinned), but the RPC trims and
 * null-empties uniformly so the client write surface stays consistent.
 *
 * @param {{ firstName?: string, lastName?: string, preferredName?: string }} names
 * @returns {Promise<void>}
 */
async function supabaseUpdateProfileNames(names = {}) {
  const { error } = await supabase.rpc('update_profile_names', {
    p_first: names.firstName ?? null,
    p_last: names.lastName ?? null,
    p_preferred: names.preferredName ?? null,
  });
  if (error) throw new Error(error.message || 'Could not update your profile names.');
}

/** Mock: echo back the trimmed name (no server-side uniqueness in mock mode). */
async function mockUpdateExternalName(externalName) {
  return String(externalName || '').trim();
}

/** Mock: no-op. */
async function mockUpdateProfileNames() {
  // No-op in mock mode.
}

// Bounded retry for a transient profile read on an auth-change event. A
// momentary blip (RLS warm-up, 5xx, network) must not decide a session's fate
// on the first try. We retry fetchProfileAuth a few times with a short backoff;
// the FIRST success returns the real, server-authoritative profile.
//
// This matters most on a one-shot OAuth / magic-link SIGNED_IN: there is no
// prior session in the store to fall back to, so a single transient failure
// would otherwise drop a user who genuinely just authenticated. Retrying gives
// the blip a chance to clear before we surface success. It is equally safe on a
// TOKEN_REFRESHED — a recovered read restores the real tier sooner; an
// unrecovered one still falls through to the deliberate skip below.
//
// We never substitute a tier here: every attempt reads the profiles table (the
// source of truth). We do NOT trust user-writable user_metadata and do NOT
// fabricate a free downgrade — exhausting the retries means the caller is
// skipped, not granted anything.
const PROFILE_RETRY_ATTEMPTS = 4;
const PROFILE_RETRY_BACKOFF_MS = 250;

async function fetchProfileAuthWithRetry(user) {
  let lastError;
  for (let attempt = 0; attempt < PROFILE_RETRY_ATTEMPTS; attempt += 1) {
    try {
      return await fetchProfileAuth(user);
    } catch (e) {
      // PGRST116 never reaches here (fetchProfileAuth returns the no-row
      // defaults rather than throwing), so any throw is a genuine transient
      // failure worth re-attempting.
      lastError = e;
      if (attempt < PROFILE_RETRY_ATTEMPTS - 1) {
        await new Promise(r => setTimeout(r, PROFILE_RETRY_BACKOFF_MS * (attempt + 1)));
      }
    }
  }
  throw lastError;
}

// Monotonic sequence for onAuthStateChange invocations. Each handler captures
// the counter value at its START; before applying its (possibly slow) async
// profile fetch it re-checks the counter and bails if a newer event has since
// begun. This makes a stale resolution a no-op so an older event (e.g. a
// TOKEN_REFRESHED whose profile fetch is slow) cannot resolve AFTER a newer
// SIGNED_OUT and resurrect signed-in state. The exposure is mainly cross-tab
// (BroadcastChannel) — within a single tab auth-js mostly serializes — but the
// guard is cheap and closes the window either way. The happy path (a single
// in-flight event) is unchanged: nothing newer started, so it always applies.
let authChangeSeq = 0;

function supabaseOnAuthChange(callback) {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    async (event, session) => {
      authChangeSeq += 1;
      const mySeq = authChangeSeq;
      if (session?.user) {
        let profile;
        try {
          profile = await fetchProfileAuthWithRetry(session.user);
        } catch {
          // Transient profile-lookup failure that survived every retry. Do NOT
          // rebuild auth from downgraded defaults and do NOT trust the writable
          // user_metadata — skip this event so the store keeps its last-known
          // tier/role (refresh) or stays in its safe logged-out-and-retry state
          // (a first sign-in with no prior session) until a later event or a
          // manual retry succeeds. The retry above already gave a momentary blip
          // its chances; a sustained outage is the deliberate safe failure.
          return;
        }
        // A newer auth event began while this profile fetch was in flight. Its
        // resolution is stale — applying it could resurrect superseded state
        // (e.g. an older TOKEN_REFRESHED landing after a SIGNED_OUT). Drop it.
        if (mySeq !== authChangeSeq) return;
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
          // Account identity (migration 075) as an APPEND-ONLY trailing object so
          // a token refresh re-seeds it from the fresh profile instead of blanking
          // it. Without this, every TOKEN_REFRESHED rebuilds auth without the
          // identity fields until a full profile reload.
          {
            accountNumber: profile.accountNumber,
            externalName: profile.externalName,
            firstName: profile.firstName,
            lastName: profile.lastName,
            preferredName: profile.preferredName,
          },
        );
      } else {
        callback(event, null, null, 'anon', 'user', null, false, null, true, DEFAULT_MODEL_PREFERENCE, null);
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

/**
 * Mock equivalent — no pgcrypto-backed store in local dev, so we record only
 * the (non-secret) question ids on the mock auth blob. The raw answers are
 * deliberately DISCARDED, never persisted, so local dev mirrors the production
 * guarantee that answers never sit in client storage.
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

async function mockUpdatePassword() {
  // No-op in mock mode
}

async function mockReauthenticateWithPassword() {
  // Local dev has no real password store; treat re-auth as a no-op success.
}

async function mockChangePassword() {
  // No-op in mock mode (no real credential to rotate).
}

async function mockGetIdentities() {
  // Mirror a typical password-only account: a single email identity.
  const saved = mockLoadAuth();
  if (!saved?.user) return [];
  return [{ id: 'mock-email', identity_id: 'mock-email', provider: 'email', email: saved.user.email }];
}

async function mockLinkIdentity(provider) {
  return { provider, mock: true };
}

async function mockUnlinkIdentity() {
  // No-op in mock mode.
}

async function mockSignOutEverywhere() {
  mockSaveAuth(null);
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

export const auth = {
  signUp:             isConfigured ? supabaseSignUp             : mockSignUp,
  setSecurityAnswers: isConfigured ? supabaseSetSecurityAnswers  : mockSetSecurityAnswers,
  getSecurityQuestionIds: isConfigured ? supabaseGetSecurityQuestionIds : mockGetSecurityQuestionIds,
  signIn:             isConfigured ? supabaseSignIn              : mockSignIn,
  signInWithMagicLink:isConfigured ? supabaseSignInWithMagicLink : mockSignInWithMagicLink,
  signInWithOAuth:    isConfigured ? supabaseSignInWithOAuth     : mockSignInWithOAuth,
  signInWithGoogle:   isConfigured ? supabaseSignInWithGoogle    : mockSignInWithGoogle,
  signInWithDiscord:  isConfigured ? supabaseSignInWithDiscord   : mockSignInWithDiscord,
  signOut:            isConfigured ? supabaseSignOut             : mockSignOut,
  getSession:         isConfigured ? supabaseGetSession          : mockGetSession,
  resetPassword:      isConfigured ? supabaseResetPassword       : mockResetPassword,
  recoveryLookup:     isConfigured ? supabaseRecoveryLookup      : mockRecoveryLookup,
  recoveryVerify:     isConfigured ? supabaseRecoveryVerify      : mockRecoveryVerify,
  updatePassword:     isConfigured ? supabaseUpdatePassword      : mockUpdatePassword,
  reauthenticateWithPassword: isConfigured ? supabaseReauthenticateWithPassword : mockReauthenticateWithPassword,
  changePassword:     isConfigured ? supabaseChangePassword      : mockChangePassword,
  getIdentities:      isConfigured ? supabaseGetIdentities       : mockGetIdentities,
  linkIdentity:       isConfigured ? supabaseLinkIdentity        : mockLinkIdentity,
  unlinkIdentity:     isConfigured ? supabaseUnlinkIdentity      : mockUnlinkIdentity,
  signOutEverywhere:  isConfigured ? supabaseSignOutEverywhere   : mockSignOutEverywhere,
  updateDisplayName:  isConfigured ? supabaseUpdateDisplayName   : mockUpdateDisplayName,
  updateProfilePreferences: isConfigured ? supabaseUpdateProfilePreferences : mockUpdateProfilePreferences,
  updateExternalName: isConfigured ? supabaseUpdateExternalName   : mockUpdateExternalName,
  updateProfileNames: isConfigured ? supabaseUpdateProfileNames   : mockUpdateProfileNames,
  onAuthChange:       isConfigured ? supabaseOnAuthChange        : mockOnAuthChange,
  isConfigured,
};

// Stable error-code sentinels the recovery UI branches on (rate-limit back-off
// vs. a plain wrong answer). Exported so the store/components don't re-declare
// the strings.
export { RECOVERY_RATE_LIMITED, RECOVERY_UNAVAILABLE };
