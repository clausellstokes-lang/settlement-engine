/**
 * authSecurity.js — the Account "Security" section's auth-service methods,
 * split out of auth.js so they load LAZILY (with the account surface) instead
 * of in the first-paint entry closure.
 *
 * These are the standard Supabase auth API wrappers (updateUser /
 * getUserIdentities / linkIdentity / unlinkIdentity / signOut({scope:'global'}))
 * plus a self-read of the caller's account_number. They are ONLY ever called
 * from the lazy Account page (AccountSecuritySection / ReferralCard), so keeping
 * their bodies out of the eager auth.js keeps them off the first-paint byte
 * budget (the closure ratchet in tests/build/vendorPdfLazy.test.js). auth.js
 * exposes each on the `auth` service via a thin `import('./authSecurity.js')`
 * wrapper, so callers still route through the auth service exactly as before.
 *
 * This module imports ONLY from ./supabase.js — deliberately NOT from ./auth.js.
 * A static back-edge to auth.js (which dynamically imports THIS file) would form
 * a cycle that forces Rollup to co-locate this code back into the eager entry
 * chunk, defeating the split. The two tiny helpers it needs from auth.js
 * (the mock-store read/write) and describeOAuthError are therefore inlined
 * below (mock-mode / error-copy only; no behavioral divergence).
 *
 * Errors are mapped to safe, non-leaky messages — a security surface must never
 * disclose which factor failed.
 */

import { supabase, isConfigured } from './supabase.js';

// Mirror of auth.js' mock-store constants/helpers (inlined to keep this module
// off the eager chunk — see the header note). MUST match auth.js' key so mock
// sign-out-everywhere clears the same session the rest of mock auth wrote.
const MOCK_STORAGE_KEY = 'settlement_mock_auth';
function mockLoadAuth() {
  try { return JSON.parse(localStorage.getItem(MOCK_STORAGE_KEY)); }
  catch { return null; }
}
function mockSaveAuth(data) {
  if (data) localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(data));
  else localStorage.removeItem(MOCK_STORAGE_KEY);
}

/**
 * Map a raw Supabase OAuth error to a safe, non-leaky display string (inlined
 * copy of auth.js' describeOAuthError, used by linkIdentity).
 * @param {{ message?: string } | null} error
 * @returns {string}
 */
function describeOAuthError(error) {
  const raw = String(error?.message || '').toLowerCase();
  if (raw.includes('not enabled') || raw.includes('unsupported provider')) {
    return 'That sign-in option isn’t available right now. Use your email instead.';
  }
  return 'Sign-in failed. Please try again.';
}

// ── Supabase implementations ─────────────────────────────────────────────────

/**
 * Re-authenticate the signed-in user with their CURRENT password before a
 * sensitive change (password rotation). Verified by attempting a password
 * sign-in against the user's own email; signInWithPassword refreshes the
 * session for the SAME user, so it is safe mid-session and logs no one else in.
 * A failure throws ONE generic error so we never disclose email-exists vs.
 * wrong-password.
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
    throw new Error('Re-authentication failed. Please check your password and try again.');
  }
}

/**
 * Change password with a current-password re-auth gate. Verifies the current
 * password first (so a hijacked, still-open session can't silently rotate the
 * password), then updates. Errors map to safe, generic messages.
 *
 * @param {{ currentPassword: string, newPassword: string }} args
 */
async function supabaseChangePassword({ currentPassword, newPassword }) {
  await supabaseReauthenticateWithPassword(currentPassword);
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) {
    throw new Error(error.message || 'Could not update your password. Please try again.');
  }
}

/**
 * List the OAuth/email identities linked to this account. Drives the Linked
 * Accounts UI. Returns a plain array (empty on any failure) so the UI degrades
 * gracefully.
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
 * Constrained to our own origin (mirrors auth.js' sign-in redirect).
 *
 * @param {'google' | 'discord'} provider
 */
async function supabaseLinkIdentity(provider) {
  const { data, error } = await supabase.auth.linkIdentity({
    provider,
    options: { redirectTo: `${window.location.origin}` },
  });
  if (error) {
    /** @type {any} */ (error).userMessage = describeOAuthError(error);
    throw new Error(/** @type {any} */ (error).userMessage);
  }
  return data;
}

/**
 * Unlink an OAuth identity. Supabase refuses to remove the LAST identity (that
 * would orphan the account), so the UI keeps one provider connected; we let the
 * server enforce it and surface a safe message if it rejects.
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
 * Read the caller's own immutable account number (SF-XXXXXXX, migration 075).
 * RLS lets a user SELECT their own profile row. Returns null on any failure so
 * the referral card degrades to its "assigned shortly" copy rather than
 * throwing. auth state doesn't carry this handle, so the surface fetches it.
 *
 * @returns {Promise<string|null>}
 */
async function supabaseGetAccountNumber() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    const { data, error } = await supabase
      .from('profiles')
      .select('account_number')
      .eq('id', user.id)
      .single();
    if (error || !data) return null;
    return data.account_number || null;
  } catch {
    return null;
  }
}

// ── Single concurrent session (§7.3, M-9d) ───────────────────────────────────

/**
 * Compose a COARSE device label (browser + OS family) from the UA — never PII.
 * Feeds claim_current_session and the account Active-session panel.
 * @returns {string}
 */
export function sessionDeviceLabel() {
  try {
    const ua = (typeof navigator !== 'undefined' && navigator.userAgent) || '';
    const browser = /Edg\//.test(ua) ? 'Edge'
      : /OPR\/|Opera/.test(ua) ? 'Opera'
      : /Firefox\//.test(ua) ? 'Firefox'
      : /Chrome\//.test(ua) ? 'Chrome'
      : /Safari\//.test(ua) ? 'Safari' : 'Browser';
    const os = /Windows/.test(ua) ? 'Windows'
      : /Mac OS X|Macintosh/.test(ua) ? 'macOS'
      : /Android/.test(ua) ? 'Android'
      : /iPhone|iPad|iPod/.test(ua) ? 'iOS'
      : /Linux/.test(ua) ? 'Linux' : 'device';
    return `${browser} on ${os}`;
  } catch { return 'Browser'; }
}

/**
 * Claim this account to THE CURRENT session (last-login-wins, §7.1). Fire-and-
 * forget from SIGNED_IN — NEVER throws; a claim failure is a silent no-op (the
 * paid-surface request gate is the real enforcement, not this claim).
 * @param {string} [deviceLabel]
 */
async function supabaseClaimCurrentSession(deviceLabel) {
  try { await supabase.rpc('claim_current_session', { p_device_label: deviceLabel || sessionDeviceLabel() }); }
  catch { /* never block auth on a claim failure */ }
}

/**
 * Is THIS session still the account's current one? Returns TRUE on any error or
 * absent row — LENIENT, matching the server gate's missing-row-ALLOWS rollout
 * safety: the authoritative eviction is the paid-surface request gate, so the
 * client validator never evicts on a transient read failure.
 * @returns {Promise<boolean>}
 */
async function supabaseIsCurrentSession() {
  try {
    const { data, error } = await supabase.rpc('is_current_session');
    if (error) return true;
    return data !== false;
  } catch { return true; }
}

/**
 * Sign out ONLY this device's session (LOCAL scope) — the eviction path. The
 * OTHER device's session is the legitimate winner and must NOT be revoked
 * (never global here). The SIGNED_OUT event still fires and transitions auth to
 * anon exactly as a normal sign-out does.
 */
async function supabaseSignOutLocalSession() {
  try { await supabase.auth.signOut({ scope: 'local' }); }
  catch { /* the SIGNED_OUT event path still runs */ }
}

/**
 * Read the caller's current active-session row (coarse device + signed-in time)
 * for the account Security panel. Owner-SELECT RLS; never throws → null.
 * @returns {Promise<{deviceLabel: string|null, signedInAt: string|null}|null>}
 */
async function supabaseFetchActiveSession() {
  try {
    const { data, error } = await supabase
      .from('current_account_session')
      .select('device_label, signed_in_at')
      .maybeSingle();
    if (error || !data) return null;
    return { deviceLabel: data.device_label || null, signedInAt: data.signed_in_at || null };
  } catch { return null; }
}

// ── Mock implementations (local dev without Supabase) ────────────────────────

async function mockClaimCurrentSession() { /* no-op in mock mode */ }
async function mockIsCurrentSession() { return true; }
async function mockSignOutLocalSession() { mockSaveAuth(null); }
async function mockFetchActiveSession() {
  const saved = mockLoadAuth();
  return saved?.user ? { deviceLabel: sessionDeviceLabel(), signedInAt: new Date().toISOString() } : null;
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

async function mockGetAccountNumber() {
  // Synthetic stable handle so the referral card's copy flow is exercisable
  // end-to-end without a backend.
  const saved = mockLoadAuth();
  return saved?.user ? 'SF-MOCK01' : null;
}

// ── Exported API (auto-selects Supabase or mock; matches auth.js' idiom) ──────

export const reauthenticateWithPassword = isConfigured ? supabaseReauthenticateWithPassword : mockReauthenticateWithPassword;
export const changePassword = isConfigured ? supabaseChangePassword : mockChangePassword;
export const getIdentities = isConfigured ? supabaseGetIdentities : mockGetIdentities;
export const linkIdentity = isConfigured ? supabaseLinkIdentity : mockLinkIdentity;
export const unlinkIdentity = isConfigured ? supabaseUnlinkIdentity : mockUnlinkIdentity;
export const signOutEverywhere = isConfigured ? supabaseSignOutEverywhere : mockSignOutEverywhere;
export const getAccountNumber = isConfigured ? supabaseGetAccountNumber : mockGetAccountNumber;
// Single concurrent session (§7.3, M-9d).
export const claimCurrentSession = isConfigured ? supabaseClaimCurrentSession : mockClaimCurrentSession;
export const isCurrentSession = isConfigured ? supabaseIsCurrentSession : mockIsCurrentSession;
export const signOutLocalSession = isConfigured ? supabaseSignOutLocalSession : mockSignOutLocalSession;
export const fetchActiveSession = isConfigured ? supabaseFetchActiveSession : mockFetchActiveSession;
