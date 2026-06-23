/**
 * AccountSecuritySection.jsx — "Login & Security" section of the Account page.
 *
 * The headline Phase A2 gap. Self-contained (owns its own local state and calls
 * the auth service directly) so AccountPage stays a thin composition root.
 *
 * Covers:
 *   • Change password — re-auth with the CURRENT password, confirm the new one,
 *     then updateUser({ password }). Errors are generic (never leak which factor
 *     failed). Progressive disclosure: the form is collapsed behind a button.
 *   • Reset via email — reuses the existing resetPasswordForEmail path.
 *   • Linked accounts — lists the connected identities (getUserIdentities) and
 *     offers link (linkIdentity) / unlink (unlinkIdentity) for Google & Discord,
 *     plus an email/magic-link note. Server enforces "keep one provider".
 *   • Sign out everywhere — signOut({ scope: 'global' }) to revoke all sessions.
 *   • Two-factor authentication — a clearly-labeled "coming soon" stub. Future-
 *     ready structure; not implemented.
 */
import { useEffect, useState } from 'react';
import {
  KeyRound, Link2, Unlink, Check,
} from 'lucide-react';
import { auth as authService } from '../../lib/auth.js';
import Button from '../primitives/Button.jsx';
import useIsMobile from '../../hooks/useIsMobile.js';
import {
  GOLD_TXT, INK, MUTED, SECOND, BODY, BORDER, sans, SP, R, FS, swatch,
  DANGER_BORDER, SUCCESS_BORDER, TINT_GOLD,
} from '../theme.js';
import Section from './AccountSection.jsx';
import Pill from '../primitives/Pill.jsx';

const PROVIDER_LABELS = { google: 'Google', discord: 'Discord', email: 'Email & password' };
const LINKABLE = [
  { provider: 'google', label: 'Google' },
  { provider: 'discord', label: 'Discord' },
];

function fieldStyle() {
  return {
    padding: `${SP.sm}px ${SP.md}px`, border: `1px solid ${BORDER}`,
    borderRadius: R.md, fontSize: FS.sm, fontFamily: sans, color: INK,
    boxSizing: 'border-box', width: '100%',
  };
}

function ErrorBanner({ children }) {
  return (
    <div role="alert" style={{ padding: `${SP.sm}px ${SP.md}px`, background: swatch.dangerBg, border: `1px solid ${DANGER_BORDER}`, borderRadius: R.md, fontSize: FS.sm, color: swatch.danger }}>
      {children}
    </div>
  );
}

function OkBanner({ children }) {
  return (
    <div style={{ padding: `${SP.sm}px ${SP.md}px`, background: swatch.successBg, border: `1px solid ${SUCCESS_BORDER}`, borderRadius: R.md, fontSize: FS.sm, color: swatch.success }}>
      {children}
    </div>
  );
}

export default function AccountSecuritySection({ auth, onSignOut }) {
  // Mobile reflow: the description-plus-right-pinned-action rows (2FA, sign-out
  // everywhere) and the linked-accounts rows have no wrap fallback, so a narrow
  // phone squeezes the copy against the button. `actionRow` stacks the action
  // below the text on mobile; desktop keeps the single centred row byte-identical.
  const isMobile = useIsMobile();
  const actionRow = {
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row',
    alignItems: isMobile ? 'flex-start' : 'center',
    gap: SP.md,
  };
  // ── Change password ───────────────────────────────────────────────────────
  const [pwOpen, setPwOpen] = useState(false);
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [pwBusy, setPwBusy] = useState(false);
  const [pwError, setPwError] = useState(null);
  const [pwDone, setPwDone] = useState(false);

  // ── Reset via email ───────────────────────────────────────────────────────
  const [resetBusy, setResetBusy] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  // ── Linked accounts ───────────────────────────────────────────────────────
  const [identities, setIdentities] = useState(null); // null = loading
  const [identityBusy, setIdentityBusy] = useState(null); // provider being mutated
  const [identityError, setIdentityError] = useState(null);

  // ── Sign out everywhere ───────────────────────────────────────────────────
  const [globalBusy, setGlobalBusy] = useState(false);

  useEffect(() => {
    let alive = true;
    authService.getIdentities().then((list) => {
      if (alive) setIdentities(Array.isArray(list) ? list : []);
    }).catch(() => { if (alive) setIdentities([]); });
    return () => { alive = false; };
  }, []);

  const handleChangePassword = async () => {
    setPwError(null);
    setPwDone(false);
    if (!currentPw || !newPw) {
      setPwError('Enter your current and new password.');
      return;
    }
    if (newPw.length < 8) {
      setPwError('Your new password must be at least 8 characters.');
      return;
    }
    if (newPw !== confirmPw) {
      setPwError('The new passwords do not match.');
      return;
    }
    setPwBusy(true);
    try {
      await authService.changePassword({ currentPassword: currentPw, newPassword: newPw });
      setPwDone(true);
      setCurrentPw(''); setNewPw(''); setConfirmPw('');
      setPwOpen(false);
    } catch (e) {
      // Generic by construction — the service already sanitized this.
      setPwError(e?.message || 'Could not update your password. Please try again.');
    } finally {
      setPwBusy(false);
    }
  };

  const handleResetEmail = async () => {
    if (!auth.user?.email) return;
    setResetBusy(true);
    try {
      await authService.resetPassword(auth.user.email);
      setResetSent(true);
    } catch {
      // Never disclose whether the email exists — show the same neutral note.
      setResetSent(true);
    } finally {
      setResetBusy(false);
    }
  };

  const connectedProviders = new Set((identities || []).map(i => i.provider));

  const handleLink = async (provider) => {
    setIdentityError(null);
    setIdentityBusy(provider);
    try {
      await authService.linkIdentity(provider);
      // Real mode redirects away; mock mode returns immediately — refresh list.
      const list = await authService.getIdentities();
      setIdentities(Array.isArray(list) ? list : []);
    } catch (e) {
      setIdentityError(e?.message || 'Could not link this provider.');
    } finally {
      setIdentityBusy(null);
    }
  };

  const handleUnlink = async (identity) => {
    setIdentityError(null);
    setIdentityBusy(identity.provider);
    try {
      await authService.unlinkIdentity(identity);
      const list = await authService.getIdentities();
      setIdentities(Array.isArray(list) ? list : []);
    } catch (e) {
      setIdentityError(e?.message || 'Could not unlink this provider.');
    } finally {
      setIdentityBusy(null);
    }
  };

  const handleSignOutEverywhere = async () => {
    setGlobalBusy(true);
    try {
      await authService.signOutEverywhere();
      // Clear local auth state too (same end-state as a normal sign-out).
      if (typeof onSignOut === 'function') await onSignOut();
    } catch {
      setGlobalBusy(false);
    }
  };

  const onlyOneIdentity = (identities || []).length <= 1;

  return (
    <Section title="Login and security">
      <div style={{ display: 'flex', flexDirection: 'column', gap: SP.xl }}>

        {/* ── Password ──────────────────────────────────────────────────── */}
        <div>
          <div style={{ fontSize: FS.sm, fontWeight: 700, color: INK }}>
            Password
          </div>
          {pwDone && <div style={{ marginTop: SP.sm }}><OkBanner>Your password has been updated.</OkBanner></div>}
          {!pwOpen ? (
            <div style={{ display: 'flex', gap: SP.sm, flexWrap: 'wrap', marginTop: SP.sm }}>
              <Button variant="secondary" size="md" onClick={() => { setPwOpen(true); setPwDone(false); setPwError(null); }}>
                Change password
              </Button>
              <Button variant="ghost" size="md" busy={resetBusy} onClick={handleResetEmail}>
                {resetSent ? 'Reset email sent' : 'Reset via email instead'}
              </Button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: SP.sm, marginTop: SP.sm }}>
              {pwError && <ErrorBanner>{pwError}</ErrorBanner>}
              <input
                aria-label="Current password" type="password" placeholder="Current password"
                value={currentPw} onChange={e => setCurrentPw(e.target.value)}
                autoComplete="current-password" style={fieldStyle()}
              />
              <input
                aria-label="New password" type="password" placeholder="New password (8+ characters)"
                value={newPw} onChange={e => setNewPw(e.target.value)}
                autoComplete="new-password" style={fieldStyle()}
              />
              <input
                aria-label="Confirm new password" type="password" placeholder="Confirm new password"
                value={confirmPw} onChange={e => setConfirmPw(e.target.value)}
                autoComplete="new-password" style={fieldStyle()}
              />
              <div style={{ display: 'flex', gap: SP.sm }}>
                <Button variant="primary" size="md" busy={pwBusy} onClick={handleChangePassword} icon={<Check size={14} />}>
                  Update password
                </Button>
                <Button variant="ghost" size="md" disabled={pwBusy} onClick={() => { setPwOpen(false); setPwError(null); setCurrentPw(''); setNewPw(''); setConfirmPw(''); }}>
                  Cancel
                </Button>
              </div>
              <div style={{ fontSize: FS.xs, color: MUTED }}>
                For your security we re-check your current password before changing it.
              </div>
            </div>
          )}
        </div>

        {/* ── Linked accounts ───────────────────────────────────────────── */}
        <div>
          <div style={{ fontSize: FS.sm, fontWeight: 700, color: INK }}>
            Linked accounts
          </div>
          <p style={{ fontSize: FS.xs, color: BODY, margin: `${SP.xs}px 0 ${SP.sm}px`, lineHeight: 1.5 }}>
            Sign in with any connected provider. You must keep at least one method connected.
          </p>
          {identityError && <div style={{ marginBottom: SP.sm }}><ErrorBanner>{identityError}</ErrorBanner></div>}

          {identities === null ? (
            <div style={{ fontSize: FS.sm, color: BODY }}>Loading…</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: SP.xs }}>
              {LINKABLE.map(({ provider, label }) => {
                const linked = (identities || []).find(i => i.provider === provider);
                const busy = identityBusy === provider;
                return (
                  <div key={provider} style={{ display: 'flex', alignItems: 'center', gap: SP.md, padding: `${SP.xs}px 0`, flexWrap: isMobile ? 'wrap' : 'nowrap' }}>
                    <span style={{ flex: isMobile ? '1 1 100%' : 1, fontSize: FS.sm, color: INK, fontWeight: 600 }}>{label}</span>
                    {linked ? (
                      <>
                        <span style={{ fontSize: FS.xs, color: swatch.success, fontWeight: 700 }}>
                          Connected
                        </span>
                        <Button
                          variant="ghost" size="md" busy={busy}
                          disabled={onlyOneIdentity}
                          title={onlyOneIdentity ? 'You must keep at least one method connected' : undefined}
                          icon={<Unlink size={13} />}
                          onClick={() => handleUnlink(linked)}
                        >
                          Unlink
                        </Button>
                      </>
                    ) : (
                      <Button variant="secondary" size="md" busy={busy} icon={<Link2 size={13} />} onClick={() => handleLink(provider)}>
                        Link
                      </Button>
                    )}
                  </div>
                );
              })}
              {connectedProviders.has('email') && (
                <div style={{ fontSize: FS.xs, color: BODY, marginTop: SP.xs }}>
                  {PROVIDER_LABELS.email} is connected. You can also sign in with a one-time magic link from the sign-in screen.
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Two-factor (coming soon) ──────────────────────────────────── */}
        <div>
          <div style={actionRow}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: SP.sm, fontSize: FS.sm, fontWeight: 700, color: INK }}>
                Two-factor authentication
                <Pill bg={TINT_GOLD} color={GOLD_TXT}>Coming soon</Pill>
              </div>
              <div style={{ fontSize: FS.xs, color: BODY, marginTop: 2, lineHeight: 1.45 }}>
                Add an authenticator-app code on top of your password. We will let you know when it is ready.
              </div>
            </div>
            <Button variant="ghost" size="md" disabled aria-label="Two-factor authentication coming soon">
              Set up
            </Button>
          </div>
        </div>

        {/* ── Sign out everywhere ───────────────────────────────────────── */}
        <div>
          <div style={actionRow}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: FS.sm, fontWeight: 700, color: INK }}>Sign out everywhere</div>
              <div style={{ fontSize: FS.xs, color: BODY, marginTop: 2, lineHeight: 1.45 }}>
                Sign out of every device and browser. Use this if you have lost a device.
              </div>
            </div>
            <Button variant="secondary" size="md" busy={globalBusy} icon={<KeyRound size={13} />} onClick={handleSignOutEverywhere}>
              Sign out all
            </Button>
          </div>
        </div>

        <div style={{ fontSize: FS.xs, color: BODY, fontFamily: sans }}>
          Signed in as <span style={{ color: SECOND, fontWeight: 700 }}>{auth.user?.email}</span>.
        </div>
      </div>
    </Section>
  );
}
