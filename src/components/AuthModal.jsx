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

  const handleSignOut = async () => {
    await authSignOut();
    onClose();
  };

  const submit = view === 'signup' ? handleSignUp : handleSignIn;
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: SP.lg }}>
              {/* Tab toggle */}
              <div style={{ display: 'flex', borderRadius: R.md, overflow: 'hidden', border: `1px solid ${BORDER}` }}>
                {[['signin', 'Sign In'], ['signup', 'Create Account']].map(([id, label]) => (
                  <button key={id} onClick={() => { setView(id); setError(null); }}
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
                  ? 'Create a free account to unlock all settlement tiers, save up to 10 settlements, and access the full toolset.'
                  : 'Sign in to your account to access your saved settlements and settings.'}
              </p>

              {error && <Alert type="error">{error}</Alert>}

              <Input type="email" placeholder="Email address" value={email} onChange={setEmail} onKeyDown={onEnter} />
              <Input type="password" placeholder="Password" value={password} onChange={setPassword} onKeyDown={onEnter} />

              {/* Remember Me checkbox — only on sign in */}
              {view === 'signin' && (
                <Checkbox
                  checked={rememberMe}
                  onChange={setRememberMe}
                  label="Remember me on this device"
                />
              )}

              <Button onClick={submit} disabled={loading}>
                {loading ? 'Working...' : view === 'signup' ? 'Create Account' : 'Sign In'}
              </Button>

              {view === 'signin' && (
                <button onClick={() => { setView('reset'); setError(null); }}
                  style={{ background: 'none', border: 'none', color: GOLD, fontSize: FS.xs, cursor: 'pointer', fontFamily: sans, textAlign: 'center' }}>
                  Forgot password?
                </button>
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
                  <RoleBadge role={auth.role} />
                </div>

                <div style={{ display: 'flex', gap: SP.lg, marginTop: SP.md, paddingTop: SP.sm, borderTop: `1px solid ${BORDER}` }}>
                  <div>
                    <div style={{ fontSize: FS.xxs, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Tier</div>
                    <div style={{
                      fontSize: FS.md, fontWeight: 700,
                      color: isElevated ? '#7c3aed' : auth.tier === 'premium' ? '#2a7a2a' : GOLD,
                      textTransform: 'uppercase',
                    }}>
                      {isElevated ? 'Full Access' : auth.tier}
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
                  Upgrade to Premium
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
