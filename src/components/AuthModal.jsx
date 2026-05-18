/**
 * AuthModal.jsx — Authentication modal with sign-in, sign-up,
 * password reset, and account management views.
 *
 * Uses the auth service (lib/auth.js) which auto-selects
 * Supabase or mock mode based on env vars.
 *
 * Features:
 *   - Remember Me toggle on sign-in
 *   - Enhanced account view with role badge, display name
 *   - Quick link to full Account page
 *   - Customer support contact link
 */
import React, { useState } from 'react';
import { X, AlertCircle, CheckCircle, Mail, Shield, Crown, User, ExternalLink, Headphones } from 'lucide-react';
import { useStore } from '../store/index.js';
import { GOLD, GOLD_BG, INK, INK_DEEP, MUTED, SECOND, BORDER, CARD, PARCH, CARD_HDR, sans, serif_, SP, R, FS } from './theme.js';
import { isConfigured } from '../lib/supabase.js';
import { getTierDisplayName } from '../config/pricing.js';
import { flag } from '../lib/flags.js';
import { t } from '../copy/index.js';
import FounderBadge from './primitives/FounderBadge.jsx';

// ── OAuth provider helpers ──────────────────────────────────────────────────
// Each provider's brand colour + a tiny SVG glyph. We deliberately keep
// the glyphs inline (vs. pulling a brand-icon package) to control bundle
// size — three providers each at ~100 bytes of SVG beats a 30 KB dep.

function GoogleGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
      <path fill="#EA4335" d="M12 5c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 1.62 14.94.5 12 .5 7.31.5 3.26 3.19 1.28 7.07l3.66 2.84C5.93 7.04 8.7 5 12 5z"/>
      <path fill="#4285F4" d="M23.5 12.28c0-.85-.08-1.67-.21-2.45H12v4.65h6.46c-.28 1.5-1.13 2.78-2.41 3.63l3.55 2.75c2.08-1.92 3.27-4.74 3.27-8.07z"/>
      <path fill="#FBBC05" d="M4.95 14.09a7.66 7.66 0 0 1 0-4.18L1.28 7.07a11.5 11.5 0 0 0 0 9.86l3.67-2.84z"/>
      <path fill="#34A853" d="M12 23.5c3.24 0 5.96-1.07 7.95-2.91l-3.55-2.75c-.98.66-2.24 1.05-4.4 1.05-3.3 0-6.07-2.04-7.05-4.91L1.28 16.93C3.26 20.81 7.31 23.5 12 23.5z"/>
    </svg>
  );
}

function DiscordGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="#5865F2" aria-hidden="true">
      <path d="M20.317 4.37a19.79 19.79 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.74 19.74 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.1 13.1 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.3 12.3 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.84 19.84 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.06.06 0 0 0-.031-.03zM8.02 15.331c-1.183 0-2.157-1.085-2.157-2.42 0-1.333.956-2.418 2.157-2.418 1.21 0 2.176 1.094 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.974 0c-1.183 0-2.156-1.085-2.156-2.42 0-1.333.955-2.418 2.156-2.418 1.211 0 2.176 1.094 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
    </svg>
  );
}

function OAuthButton({ provider, glyph, label, onClick, disabled, soonNote }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={soonNote || `Continue with ${label}`}
      style={{
        width: '100%', padding: `${SP.md}px ${SP.md}px`,
        background: '#fff',
        color: '#1B1408',
        border: `1px solid ${BORDER}`,
        borderRadius: R.lg,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.55 : 1,
        fontFamily: sans, fontSize: 14, fontWeight: 600,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10,
        transition: 'border-color 0.15s, background 0.15s',
      }}
    >
      {glyph}
      <span>Continue with {label}</span>
      {soonNote && (
        <span style={{
          fontSize: 9, fontWeight: 800, letterSpacing: '0.06em',
          textTransform: 'uppercase', color: '#7B4FCF',
          background: '#EBE2FA', padding: '2px 5px', borderRadius: 3,
          marginLeft: 4,
        }}>
          Soon
        </span>
      )}
    </button>
  );
}

function OrDivider() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: SP.sm,
      fontSize: FS.xxs, fontWeight: 700, color: MUTED,
      textTransform: 'uppercase', letterSpacing: '0.08em',
    }} aria-hidden="true">
      <span style={{ flex: 1, height: 1, background: BORDER }} />
      <span>or with email</span>
      <span style={{ flex: 1, height: 1, background: BORDER }} />
    </div>
  );
}

function Input({ type = 'text', placeholder, value, onChange, onKeyDown }) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={e => onChange(e.target.value)}
      onKeyDown={onKeyDown}
      style={{
        width: '100%', padding: `${SP.md}px ${SP.lg - 2}px`,
        border: `1px solid ${BORDER}`, borderRadius: R.lg,
        fontSize: 14, fontFamily: sans,
        background: '#fff', outline: 'none',
        boxSizing: 'border-box',
      }}
    />
  );
}

function Checkbox({ checked, onChange, label }) {
  return (
    <label style={{
      display: 'flex', alignItems: 'center', gap: SP.sm,
      cursor: 'pointer', fontSize: FS.sm, color: SECOND,
      fontFamily: sans, userSelect: 'none',
    }}>
      <input
        type="checkbox"
        checked={checked}
        onChange={e => onChange(e.target.checked)}
        style={{ accentColor: GOLD, width: 16, height: 16, cursor: 'pointer' }}
      />
      {label}
    </label>
  );
}

function Button({ onClick, children, variant = 'primary', disabled, style: extra }) {
  const styles = {
    primary: { background: GOLD, color: '#fff', border: 'none' },
    success: { background: 'linear-gradient(135deg, #2a7a2a 0%, #4a8a4a 100%)', color: '#fff', border: 'none' },
    danger:  { background: 'transparent', color: '#8b1a1a', border: '1px solid rgba(139,26,26,0.3)' },
    ghost:   { background: 'transparent', color: GOLD, border: `1px solid ${GOLD}` },
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: '100%', padding: `${SP.md}px 0`,
        borderRadius: R.lg, cursor: disabled ? 'not-allowed' : 'pointer',
        fontFamily: sans, fontSize: 14, fontWeight: 700,
        opacity: disabled ? 0.6 : 1,
        transition: 'opacity 0.15s',
        ...styles[variant],
        ...extra,
      }}
    >
      {children}
    </button>
  );
}

function Alert({ type, children }) {
  const colors = {
    error:   { bg: '#fdf4f4', border: '#e8b0b0', text: '#8b1a1a', Icon: AlertCircle },
    success: { bg: '#f0faf2', border: '#a8d8b0', text: '#1a4a20', Icon: CheckCircle },
    info:    { bg: '#fef9ee', border: GOLD, text: SECOND, Icon: Mail },
  };
  const c = colors[type] || colors.info;
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: SP.sm,
      padding: `${SP.sm + 2}px ${SP.md}px`,
      background: c.bg, border: `1px solid ${c.border}`, borderRadius: R.md,
      fontSize: FS.sm, color: c.text, lineHeight: 1.5,
    }}>
      <c.Icon size={16} style={{ flexShrink: 0, marginTop: 1 }} />
      <span>{children}</span>
    </div>
  );
}

/** Role badge component */
function RoleBadge({ role }) {
  if (role === 'user') return null;
  const cfg = {
    developer: { color: '#7c3aed', bg: 'rgba(124,58,237,0.12)', label: 'Developer', Icon: Shield },
    admin:     { color: '#dc2626', bg: 'rgba(220,38,38,0.12)', label: 'Admin', Icon: Shield },
  };
  const c = cfg[role] || cfg.admin;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 3,
      padding: '2px 8px', borderRadius: R.md,
      background: c.bg, color: c.color,
      fontSize: FS.xxs, fontWeight: 700,
      textTransform: 'uppercase', letterSpacing: '0.04em',
    }}>
      <c.Icon size={10} /> {c.label}
    </span>
  );
}

export default function AuthModal({ onClose, onNavigateAccount }) {
  const auth       = useStore(s => s.auth);
  const authSignUp = useStore(s => s.authSignUp);
  const authSignIn = useStore(s => s.authSignIn);
  const authSignOut = useStore(s => s.authSignOut);
  const authResetPassword = useStore(s => s.authResetPassword);
  const authMagicLink = useStore(s => s.authMagicLink);
  const authOAuth = useStore(s => s.authOAuth);
  const setPurchaseModalOpen = useStore(s => s.setPurchaseModalOpen);
  const creditBalance = useStore(s => s.creditBalance);
  const isElevated  = useStore(s => s.isElevated());

  const [view, setView] = useState(auth.user ? 'account' : 'signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  // Auth method: magic-link is the default (WCAG 2.2 SC 3.3.8 prefers
  // it; conversion is also better). Users can switch to legacy password
  // via the "More options" disclosure below — useful for password-managed accounts.
  const [authMethod, setAuthMethod] = useState('magic');  // 'magic' | 'password'
  const [moreOpen, setMoreOpen] = useState(false);

  // Flag-driven OAuth visibility. Defaults are conservative (off) so
  // the buttons never appear in environments where the provider isn't
  // configured. Flip via the dev panel or env var once Supabase has
  // the corresponding OAuth provider registered.
  const showGoogle  = flag('googleOauth');
  const showDiscord = flag('discordOauth');

  const handleOAuth = async (provider) => {
    setError(null);
    setLoading(true);
    try {
      const result = await authOAuth(provider);
      // Mock mode returns immediately with no redirect; show a hint
      // instead of leaving the user staring at a spinner.
      if (result?.mock) {
        setMessage(`OAuth (${provider}) is mocked in local mode — no real sign-in occurred.`);
      }
      // Real mode: Supabase has navigated away; nothing more to do.
    } catch (e) {
      setError(e.message || 'OAuth sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async () => {
    if (!email.trim() || !password) return;
    setError(null);
    setLoading(true);
    try {
      await authSignIn(email.trim(), password, rememberMe);
      onClose();
    } catch (e) {
      setError(e.message || 'Sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (!email.trim() || !password) return;
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setError(null);
    setLoading(true);
    try {
      const { needsVerification } = await authSignUp(email.trim(), password);
      if (needsVerification) {
        setView('verify');
      } else {
        onClose();
      }
    } catch (e) {
      setError(e.message || 'Sign-up failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email.trim()) { setError('Enter your email address'); return; }
    setError(null);
    setLoading(true);
    try {
      await authResetPassword(email.trim());
      setMessage('Check your email for a password reset link.');
    } catch (e) {
      setError(e.message || 'Password reset failed');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Magic link sign-in: user enters email, gets a link, clicks it,
   * Supabase's onAuthStateChange completes auth. We only need to send
   * the email and surface a "check your inbox" confirmation.
   */
  const handleMagicLink = async () => {
    if (!email.trim()) { setError('Enter your email address'); return; }
    setError(null);
    setLoading(true);
    try {
      await authMagicLink(email.trim());
      setMessage(`Check ${email.trim()} for a sign-in link. The link works for 1 hour.`);
    } catch (e) {
      setError(e.message || 'Could not send sign-in link');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await authSignOut();
    onClose();
  };

  // Submit dispatches based on (view, authMethod). Sign-in via magic
  // link is one click; sign-up via magic link still creates the user
  // (Supabase signInWithOtp has shouldCreateUser:true). Password mode
  // keeps the existing dual sign-in / sign-up paths.
  const submit = authMethod === 'magic'
    ? handleMagicLink
    : view === 'signup' ? handleSignUp : handleSignIn;
  const onEnter = (e) => { if (e.key === 'Enter') submit(); };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.6)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        backdropFilter: 'blur(4px)',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: CARD, borderRadius: R.xl,
          border: `1px solid ${BORDER}`,
          boxShadow: '0 8px 40px rgba(0,0,0,0.3)',
          width: '90%', maxWidth: 420, overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: `${SP.lg}px ${SP.xl}px`,
          background: `linear-gradient(to right, ${INK}, ${INK_DEEP})`,
          color: GOLD,
        }}>
          <h2 style={{ margin: 0, fontSize: FS.xl + 1, fontFamily: serif_, fontWeight: 600 }}>
            {view === 'account' ? 'Account' : view === 'verify' ? 'Verify Email' : view === 'reset' ? 'Reset Password' : 'Welcome'}
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: MUTED, cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: `${SP.xxl}px ${SP.xl}px` }}>

          {/* ── Email verification view ─────────────────────────── */}
          {view === 'verify' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: SP.lg, textAlign: 'center' }}>
              <Mail size={40} color={GOLD} style={{ margin: '0 auto' }} />
              <Alert type="success">
                We sent a confirmation link to <strong>{email}</strong>. Check your inbox and click the link to activate your account.
              </Alert>
              <Button variant="ghost" onClick={() => { setView('signin'); setMessage(null); }}>
                Back to Sign In
              </Button>
            </div>
          )}

          {/* ── Password reset view ────────────────────────────── */}
          {view === 'reset' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: SP.lg }}>
              <p style={{ fontSize: FS.md, color: SECOND, margin: 0, lineHeight: 1.5 }}>
                Enter your email and we'll send a link to reset your password.
              </p>
              {error && <Alert type="error">{error}</Alert>}
              {message && <Alert type="success">{message}</Alert>}
              <Input type="email" placeholder="Email address" value={email} onChange={setEmail} />
              <Button onClick={handleResetPassword} disabled={loading}>
                {loading ? 'Sending...' : 'Send Reset Link'}
              </Button>
              <button onClick={() => { setView('signin'); setError(null); setMessage(null); }}
                style={{ background: 'none', border: 'none', color: GOLD, fontSize: FS.sm, cursor: 'pointer', fontFamily: sans }}>
                Back to Sign In
              </button>
            </div>
          )}

          {/* ── Sign-in / Sign-up view ─────────────────────────── */}
          {(view === 'signin' || view === 'signup') && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: SP.md }}>
              {/* Sign-in / Sign-up tab toggle. We keep this even with
                  magic-link as the default because the create-account
                  copy and CTA wording differs. */}
              <div style={{ display: 'flex', borderRadius: R.md, overflow: 'hidden', border: `1px solid ${BORDER}` }}>
                {[['signin', 'Sign In'], ['signup', 'Create Account']].map(([id, label]) => (
                  <button key={id} onClick={() => { setView(id); setError(null); setMoreOpen(false); }}
                    style={{
                      flex: 1, padding: `${SP.sm}px 0`,
                      background: view === id ? GOLD_BG : 'transparent',
                      border: 'none', cursor: 'pointer',
                      fontSize: FS.sm, fontWeight: view === id ? 700 : 500,
                      color: view === id ? GOLD : MUTED, fontFamily: sans,
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <p style={{ fontSize: FS.md, color: SECOND, margin: 0, lineHeight: 1.5 }}>
                {view === 'signup'
                  ? `Create a free ${getTierDisplayName('free')} account to save your work, push to larger sizes, and link settlements in the Neighbourhood System.`
                  : 'Sign in to keep your work — saves, exports, larger settlements, and the Neighbourhood System.'}
              </p>

              {error && <Alert type="error">{error}</Alert>}
              {message && <Alert type="success">{message}</Alert>}

              {/* ── OAuth providers (top of fold) ─────────────────────────
                  Discord renders as a disabled "Soon" placeholder when
                  its flag is on; Google renders as a working button when
                  its flag is on. With both flags off the section is
                  hidden entirely and the email form floats to the top —
                  the legacy behavior, intact. */}
              {(showDiscord || showGoogle) && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: SP.sm }}>
                  {showDiscord && (
                    <OAuthButton
                      provider="discord"
                      glyph={<DiscordGlyph />}
                      label="Discord"
                      onClick={() => handleOAuth('discord')}
                      disabled={true}
                      soonNote={t('auth.discord.placeholder')}
                    />
                  )}
                  {showGoogle && (
                    <OAuthButton
                      provider="google"
                      glyph={<GoogleGlyph />}
                      label="Google"
                      onClick={() => handleOAuth('google')}
                      disabled={loading || !isConfigured}
                    />
                  )}
                  <OrDivider />
                </div>
              )}

              {/* ── Email path (magic-link by default) ───────────────── */}
              <Input type="email" placeholder="Email address" value={email} onChange={setEmail} onKeyDown={onEnter} />
              {authMethod === 'password' && (
                <Input type="password" placeholder="Password" value={password} onChange={setPassword} onKeyDown={onEnter} />
              )}

              {authMethod === 'password' && view === 'signin' && (
                <Checkbox
                  checked={rememberMe}
                  onChange={setRememberMe}
                  label="Remember me on this device"
                />
              )}

              <Button onClick={submit} disabled={loading}>
                {loading
                  ? 'Working...'
                  : authMethod === 'magic'
                    ? 'Send sign-in link'
                    : (view === 'signup' ? 'Create account' : 'Sign in')}
              </Button>

              {/* ── More options disclosure ───────────────────────────
                  Magic-link is the default + recommended; the password
                  path lives behind a click so it doesn't clutter the
                  primary flow but stays reachable for users who prefer
                  password managers. */}
              <button
                type="button"
                onClick={() => setMoreOpen(o => !o)}
                aria-expanded={moreOpen}
                style={{
                  background: 'none', border: 'none', padding: 0,
                  color: GOLD, fontSize: FS.xs, cursor: 'pointer',
                  fontFamily: sans, textAlign: 'center',
                }}
              >
                {moreOpen ? 'Hide more options' : 'More sign-in options'}
              </button>

              {moreOpen && (
                <div style={{
                  display: 'flex', flexDirection: 'column', gap: SP.sm,
                  padding: `${SP.md}px ${SP.md}px`,
                  background: 'rgba(248, 240, 220, 0.35)',
                  border: `1px solid ${BORDER}`,
                  borderRadius: R.md,
                  fontSize: FS.xs, color: SECOND,
                }}>
                  <button
                    type="button"
                    onClick={() => { setAuthMethod(m => m === 'magic' ? 'password' : 'magic'); setError(null); setMessage(null); }}
                    style={{ background:'none', border:'none', color:GOLD, fontSize:FS.xs, cursor:'pointer', fontFamily:sans, textAlign:'left', padding: 0 }}
                  >
                    {authMethod === 'magic' ? 'Use a password instead' : 'Use a magic link instead (recommended)'}
                  </button>
                  {authMethod === 'password' && view === 'signin' && (
                    <button
                      type="button"
                      onClick={() => { setView('reset'); setError(null); }}
                      style={{ background: 'none', border: 'none', color: GOLD, fontSize: FS.xs, cursor: 'pointer', fontFamily: sans, textAlign: 'left', padding: 0 }}
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
              )}

              {!isConfigured && (
                <div style={{ textAlign: 'center', fontSize: FS.xxs, color: MUTED, fontStyle: 'italic' }}>
                  Running in local mode — no backend configured
                </div>
              )}
            </div>
          )}

          {/* ── Account view ───────────────────────────────────── */}
          {view === 'account' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: SP.lg }}>
              {/* User info card */}
              <div style={{ padding: `${SP.md}px ${SP.lg - 2}px`, background: CARD_HDR, borderRadius: R.lg }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: SP.sm }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%',
                    background: `linear-gradient(135deg, ${GOLD} 0%, #b8860b 100%)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontWeight: 700, fontSize: FS.lg,
                  }}>
                    {(auth.displayName || auth.user?.email || '?')[0].toUpperCase()}
                  </div>
                  <div style={{ flex: 1 }}>
                    {auth.displayName && (
                      <div style={{ fontSize: FS.lg, fontWeight: 700, color: INK, fontFamily: serif_ }}>
                        {auth.displayName}
                      </div>
                    )}
                    <div style={{ fontSize: FS.sm, color: MUTED }}>{auth.user?.email}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <RoleBadge role={auth.role} />
                    <FounderBadge size="sm" />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: SP.lg, marginTop: SP.md, paddingTop: SP.sm, borderTop: `1px solid ${BORDER}` }}>
                  <div>
                    <div style={{ fontSize: FS.xxs, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Tier</div>
                    <div style={{
                      fontSize: FS.md, fontWeight: 700,
                      color: isElevated ? '#7c3aed' : auth.tier === 'premium' ? '#2a7a2a' : GOLD,
                      textTransform: 'uppercase',
                    }}>
                      {isElevated ? 'Full Access' : getTierDisplayName(auth.tier)}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: FS.xxs, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Credits</div>
                    <div style={{ fontSize: FS.md, fontWeight: 700, color: '#7c3aed' }}>
                      {isElevated ? '\u221E' : creditBalance}
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              {!isElevated && auth.tier !== 'premium' && (
                <Button variant="success" onClick={() => { onClose(); setPurchaseModalOpen(true); }}>
                  Upgrade to {getTierDisplayName('premium')}
                </Button>
              )}

              {onNavigateAccount && (
                <Button variant="ghost" onClick={() => { onClose(); onNavigateAccount(); }}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: SP.sm }}
                >
                  <User size={14} /> Full Account Settings <ExternalLink size={12} />
                </Button>
              )}

              <div style={{ fontSize: FS.sm, color: SECOND, lineHeight: 1.6 }}>
                {isElevated ? (
                  <>
                    <strong>Developer Access:</strong> All features unlocked, unlimited saves, unlimited AI credits, admin panel.
                  </>
                ) : (
                  <>
                    <strong>Free Account:</strong> All tiers, 10 saves, custom content
                    <br />
                    <strong>Premium:</strong> Unlimited saves, Neighbourhood System, PDF/JSON export, Map supply chains
                  </>
                )}
              </div>

              {/* Support link */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: SP.sm,
                padding: `${SP.sm}px ${SP.md}px`,
                background: '#fef9ee', borderRadius: R.md,
                border: `1px solid rgba(160,118,42,0.2)`,
              }}>
                <Headphones size={14} color={GOLD} />
                <span style={{ fontSize: FS.sm, color: SECOND }}>
                  Need help?{' '}
                  <a href="mailto:clausellstokes@aol.com" style={{ color: GOLD, textDecoration: 'none', fontWeight: 600 }}>
                    Contact Support
                  </a>
                </span>
              </div>

              <Button variant="danger" onClick={handleSignOut}>
                Sign Out
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
