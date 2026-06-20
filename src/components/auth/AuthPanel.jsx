/**
 * components/auth/AuthPanel.jsx — the shared sign-in / sign-up / reset /
 * verify form body.
 *
 * This is the single implementation of the email + OAuth auth flow. It's
 * rendered two ways:
 *   - inside AuthModal (overlay chrome, tab toggle, internal mode switching)
 *   - inside the dedicated /signin · /register · /reset-password pages
 *     (page chrome, tabs hidden, mode switches navigate between pages)
 *
 * The only behavioural difference is how mode switches resolve, controlled
 * by the optional `onModeChange` prop:
 *   - omitted (modal)  → switch the internal mode state in place
 *   - provided (pages) → the parent navigates to the sibling route
 *
 * Magic-link is the default method (WCAG 2.2 SC 3.3.8 + better conversion);
 * the legacy password path lives behind the "More options" disclosure.
 */
import { useState } from 'react';
import { Mail } from 'lucide-react';
import { useStore } from '../../store/index.js';
import { GOLD, GOLD_BG, MUTED, SECOND, BORDER, sans, SP, R, FS } from '../theme.js';
import { isConfigured } from '../../lib/supabase.js';
import { getTierDisplayName } from '../../config/pricing.js';
import { flag } from '../../lib/flags.js';
import { t } from '../../copy/index.js';
import Button from '../primitives/Button.jsx';
import {
  // `Button` here is the auth-page full-width CTA (its own prop API: always
  // width:100%, variants primary/success/danger/ghost) — kept under an alias so
  // the design-system Button primitive above can own the canonical name.
  Input, Checkbox, Button as AuthCTAButton, Alert, OAuthButton, OrDivider, GoogleGlyph, DiscordGlyph,
} from './authUI.jsx';

// AuthPanel's internal mode vocabulary → the public route view id its
// dedicated page lives at. The modal switches modes in place and never
// touches this; the /signin · /register · /reset-password pages use it to
// turn an onModeChange(mode) callback into a navigate(view). 'verify' is
// absent on purpose — that transition stays inline ("check your inbox").
export const AUTH_MODE_VIEW = Object.freeze({
  signin: 'signin',
  signup: 'register',
  reset: 'reset-password',
});

export default function AuthPanel({
  initialMode = 'signin',   // 'signin' | 'signup' | 'reset' | 'verify'
  onAuthed,                 // called after a session is established (password paths)
  onModeChange,             // (mode) => void — pages navigate; modal switches in place
  showTabs = true,          // modal shows the Sign In / Create Account toggle
}) {
  const authSignUp = useStore(s => s.authSignUp);
  const authSignIn = useStore(s => s.authSignIn);
  const authResetPassword = useStore(s => s.authResetPassword);
  const authMagicLink = useStore(s => s.authMagicLink);
  const authOAuth = useStore(s => s.authOAuth);

  const [mode, setMode] = useState(initialMode); // 'signin' | 'signup' | 'reset' | 'verify'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [authMethod, setAuthMethod] = useState('magic'); // 'magic' | 'password'
  const [moreOpen, setMoreOpen] = useState(false);

  // User-initiated mode switch. Pages hand this to the router (changes the
  // URL); the modal switches in place. The signup → verify transition is
  // NOT routed through here — it stays inline ("check your inbox").
  const requestMode = (next) => {
    setError(null);
    setMessage(null);
    setMoreOpen(false);
    if (onModeChange) onModeChange(next);
    else setMode(next);
  };

  const showGoogle  = flag('googleOauth');
  const showDiscord = flag('discordOauth');

  const handleOAuth = async (provider) => {
    setError(null);
    setLoading(true);
    try {
      const result = await authOAuth(provider);
      if (result?.mock) {
        setMessage(`OAuth (${provider}) is mocked in local mode. No real sign-in occurred.`);
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
      onAuthed?.();
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
        setMode('verify'); // inline "check your inbox" — no route change
      } else {
        onAuthed?.();
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

  const submit = authMethod === 'magic'
    ? handleMagicLink
    : mode === 'signup' ? handleSignUp : handleSignIn;
  const onEnter = (e) => { if (e.key === 'Enter') submit(); };

  // ── Email verification (post sign-up "check your inbox") ──────────────────
  if (mode === 'verify') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: SP.lg, textAlign: 'center' }}>
        <Mail size={40} color={GOLD} style={{ margin: '0 auto' }} />
        <Alert type="success">
          We sent a confirmation link to <strong>{email}</strong>. Check your inbox and click the link to activate your account.
        </Alert>
        <AuthCTAButton variant="ghost" onClick={() => requestMode('signin')}>
          Back to Sign In
        </AuthCTAButton>
      </div>
    );
  }

  // ── Password reset request ────────────────────────────────────────────────
  if (mode === 'reset') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: SP.lg }}>
        <p style={{ fontSize: FS.md, color: SECOND, margin: 0, lineHeight: 1.5 }}>
          Enter your email and we'll send a link to reset your password.
        </p>
        {error && <Alert type="error">{error}</Alert>}
        {message && <Alert type="success">{message}</Alert>}
        <Input type="email" placeholder="Email address" value={email} onChange={setEmail} />
        <AuthCTAButton onClick={handleResetPassword} disabled={loading}>
          {loading ? 'Sending...' : 'Send Reset Link'}
        </AuthCTAButton>
        <Button variant="ghost" size="sm" onClick={() => requestMode('signin')}>
          Back to Sign In
        </Button>
      </div>
    );
  }

  // ── Sign-in / Sign-up ─────────────────────────────────────────────────────
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: SP.md }}>
      {showTabs && (
        <div style={{ display: 'flex', borderRadius: R.md, overflow: 'hidden', border: `1px solid ${BORDER}` }}>
          {[['signin', 'Sign In'], ['signup', 'Create Account']].map(([id, label]) => (
            // Bespoke segmented-control tab: flex:1 borderless square segments
            // clipped by the parent's overflow:hidden, with a conditional gold
            // active fill driven by `mode === id`. The Button primitive forces
            // its own 1px border + R.lg rounding, which would break the seamless
            // segmented look — so this stays raw (accessible via its text label).
            <button key={id} type="button" onClick={() => requestMode(id)}
              aria-pressed={mode === id}
              style={{
                flex: 1, padding: `${SP.sm}px 0`,
                background: mode === id ? GOLD_BG : 'transparent',
                border: 'none', cursor: 'pointer',
                fontSize: FS.sm, fontWeight: mode === id ? 700 : 500,
                color: mode === id ? GOLD : MUTED, fontFamily: sans,
              }}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      <p style={{ fontSize: FS.md, color: SECOND, margin: 0, lineHeight: 1.5 }}>
        {mode === 'signup'
          ? t('auth.signupSubtitle', { tier: getTierDisplayName('free') })
          : t('auth.signinSubtitle')}
      </p>

      {error && <Alert type="error">{error}</Alert>}
      {message && <Alert type="success">{message}</Alert>}

      <Input type="email" placeholder={t('auth.placeholder.email')} value={email} onChange={setEmail} onKeyDown={onEnter} />
      {authMethod === 'password' && (
        <Input type="password" placeholder={t('auth.placeholder.password')} value={password} onChange={setPassword} onKeyDown={onEnter} />
      )}

      {authMethod === 'password' && mode === 'signin' && (
        <Checkbox checked={rememberMe} onChange={setRememberMe} label={t('auth.rememberMe')} />
      )}

      <AuthCTAButton onClick={submit} disabled={loading}>
        {loading
          ? t('auth.button.working')
          : authMethod === 'magic'
            ? t('auth.button.sendLink')
            : (mode === 'signup' ? t('auth.button.createAcct') : t('auth.button.signIn'))}
      </AuthCTAButton>

      {/* ── OAuth alternatives ────────────────────────────────────────────────
          Placed BELOW the email/password form, never above it: password +
          magic-link stay the primary path; Google/Discord are alternatives.
          Each button no-ops gracefully until the provider is enabled in the
          Supabase dashboard (the wrapper maps "provider not enabled" to a safe
          message rather than throwing). */}
      {(showGoogle || showDiscord) && (
        <div data-testid="oauth-section" style={{ display: 'flex', flexDirection: 'column', gap: SP.sm }}>
          <OrDivider label={t('auth.oauth.divider')} />
          {showGoogle && (
            <OAuthButton
              glyph={<GoogleGlyph />}
              label="Google"
              onClick={() => handleOAuth('google')}
              disabled={loading}
            />
          )}
          {showDiscord && (
            <OAuthButton
              glyph={<DiscordGlyph />}
              label="Discord"
              onClick={() => handleOAuth('discord')}
              disabled={loading}
            />
          )}
        </div>
      )}

      <Button
        variant="ghost"
        size="sm"
        onClick={() => setMoreOpen(o => !o)}
        aria-expanded={moreOpen}
      >
        {moreOpen ? t('auth.button.moreClose') : t('auth.button.moreOpen')}
      </Button>

      {moreOpen && (
        <div style={{
          display: 'flex', flexDirection: 'column', gap: SP.sm,
          padding: `${SP.md}px ${SP.md}px`,
          background: 'rgba(248, 240, 220, 0.35)',
          border: `1px solid ${BORDER}`,
          borderRadius: R.md,
          fontSize: FS.xs, color: SECOND,
        }}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => { setAuthMethod(m => m === 'magic' ? 'password' : 'magic'); setError(null); setMessage(null); }}
            style={{ justifyContent: 'flex-start' }}
          >
            {authMethod === 'magic' ? t('auth.button.usePassword') : t('auth.button.useMagic')}
          </Button>
          {authMethod === 'password' && mode === 'signin' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => requestMode('reset')}
              style={{ justifyContent: 'flex-start' }}
            >
              {t('auth.password.forgot')}
            </Button>
          )}
        </div>
      )}

      {!isConfigured && (
        <div style={{ textAlign: 'center', fontSize: FS.xxs, color: MUTED, fontStyle: 'italic' }}>
          {t('auth.localMode')}
        </div>
      )}
    </div>
  );
}
