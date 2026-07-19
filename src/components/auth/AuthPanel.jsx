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
 * Password is the primary inline path (W5.1 design inversion): email +
 * password render directly, sign-up adds confirm-password. The email
 * sign-in link and the OAuth providers are explicit alternatives BELOW the
 * form — never above it — and sign-up is password-only (mirrors OAuth being
 * withheld from sign-up so account creation stays short).
 */
import { useState } from 'react';
import { Mail } from 'lucide-react';
import { useStore } from '../../store/index.js';
import { GOLD, SECOND, MUTED, BORDER, sans, SP, FS } from '../theme.js';
import { isConfigured } from '../../lib/supabase.js';
import { getTierDisplayName } from '../../config/pricing.js';
import { flag } from '../../lib/flags.js';
import { t } from '../../copy/index.js';
import Button from '../primitives/Button.jsx';
import useIsMobile from '../../hooks/useIsMobile.js';
import ForgotPasswordFlow from './ForgotPasswordFlow.jsx';
import CaptchaGate from '../perimeter/CaptchaGate.jsx';
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
  const authMagicLink = useStore(s => s.authMagicLink);
  const authOAuth = useStore(s => s.authOAuth);

  const [mode, setMode] = useState(initialMode); // 'signin' | 'signup' | 'reset' | 'verify'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // sign-up only
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [magicSent, setMagicSent] = useState(false); // email sign-in link dispatched
  // Wave-D perimeter (INERT until the perimeterCaptcha flag + Turnstile keys are
  // set): the human-verification token for the Supabase-native captcha on
  // signInWithPassword / signUp. Stays null while the flag is off (CaptchaGate
  // renders nothing), and the token rides as an ADDITIVE arg — so the flag-off
  // path is byte-identical. Server enforcement is the owner's Supabase dashboard
  // "Enable Captcha protection" toggle. See docs/PERIMETER_RUNBOOK.md.
  const [captchaToken, setCaptchaToken] = useState(null);
  // The segmented Sign In / Create Account toggle is a RAW <button> (it can't be
  // the Button primitive without breaking the seamless borderless segments), so
  // it misses the primitive's mobile 44px tap floor — apply it inline on mobile.
  const isMobile = useIsMobile();

  // User-initiated mode switch. Pages hand this to the router (changes the
  // URL); the modal switches in place. The signup → verify transition is
  // NOT routed through here — it stays inline ("check your inbox").
  const requestMode = (next) => {
    setError(null);
    setMessage(null);
    setMagicSent(false);
    setConfirmPassword('');
    if (onModeChange) onModeChange(next);
    else setMode(next);
  };

  // OAuth is a sign-IN affordance only — keep the sign-up tab short (email +
  // password + recovery), so the provider buttons never render on 'signup'.
  const oauthAllowed = mode === 'signin';
  const showGoogle  = oauthAllowed && flag('googleOauth');
  const showDiscord = oauthAllowed && flag('discordOauth');

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
      // `userMessage` is the safe, non-leaky string set by describeOAuthError in
      // lib/auth.js — e.g. a not-yet-enabled provider maps to a calm "sign-in
      // option isn't available" rather than a raw Supabase error.
      setError(e.userMessage || e.message || 'OAuth sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async () => {
    if (!email.trim() || !password) return;
    setError(null);
    setLoading(true);
    try {
      // captchaToken is undefined-safe: null while the perimeterCaptcha flag is
      // off, so this call is byte-identical to before until the owner activates it.
      await authSignIn(email.trim(), password, rememberMe, captchaToken || undefined);
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
    // Confirm-password mismatch guard: a typo'd password would otherwise create
    // an account the user can never sign back into. Block submit and say so.
    if (password !== confirmPassword) { setError(t('auth.error.passwordMismatch')); return; }
    setError(null);
    setLoading(true);
    try {
      const { needsVerification, existingAccount } = await authSignUp(email.trim(), password, captchaToken || undefined);
      if (existingAccount) {
        // Supabase reports a signup for an already-registered email with empty
        // identities and no error / no email — the verify screen would never
        // resolve. Point the user at sign-in / reset instead of a dead end.
        setError('That email may already have an account. Try signing in, or reset your password.');
      } else if (needsVerification) {
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

  const handleMagicLink = async () => {
    if (!email.trim()) { setError('Enter your email address'); return; }
    setError(null);
    setLoading(true);
    try {
      await authMagicLink(email.trim());
      setMagicSent(true);
    } catch (e) {
      setError(e.message || 'Could not send sign-in link');
    } finally {
      setLoading(false);
    }
  };

  // Password is the primary inline path: sign-up creates an account, anything
  // else signs in. The email sign-in link is an explicit alternative below.
  const submit = mode === 'signup' ? handleSignUp : handleSignIn;
  const onEnter = (e) => { if (e.key === 'Enter') submit(); };

  // ── Magic-link sent ("check your inbox") ──────────────────────────────────
  // The email sign-in link's close. An actionable note instead of a flat green
  // strip: resend for a lost/expired link, or step back to fix a typo'd email.
  if (magicSent) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: SP.lg, textAlign: 'center' }}>
        <Mail size={40} color={GOLD} style={{ margin: '0 auto' }} />
        <Alert type="success">
          {t('auth.magic.sent', { email: email.trim() })}
        </Alert>
        <div style={{ display: 'flex', flexDirection: 'column', gap: SP.xs }}>
          <Button variant="ghost" size="sm" onClick={handleMagicLink} disabled={loading}>
            {loading ? t('auth.button.working') : t('auth.button.resend')}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => { setMagicSent(false); setError(null); }}>
            {t('auth.button.differentEmail')}
          </Button>
        </div>
      </div>
    );
  }

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

  // ── Forgot-password challenge (Auth Phase 2, gated recovery) ──────────────
  // The reset mode is the security-question challenge (email → one random
  // question → the auth-recovery edge function mails the set-new-password link),
  // NOT a bare "email me a link". The self-contained flow owns its own steps;
  // decision 8's "security questions + gated recovery" posture, as-shipped.
  if (mode === 'reset') {
    return <ForgotPasswordFlow onBackToSignIn={() => requestMode('signin')} />;
  }

  // ── Sign-in / Sign-up ─────────────────────────────────────────────────────
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: SP.md }}>
      {showTabs && (
        <div style={{ display: 'flex', overflow: 'hidden', border: `1px solid ${BORDER}` }}>
          {[['signin', 'Sign In'], ['signup', 'Create Account']].map(([id, label]) => (
            // Bespoke segmented-control tab: flex:1 borderless square segments.
            // The active station is marked by a DRAWN gold rule + gold ink (the
            // nav idiom), never a tinted fill. The Button primitive forces its
            // own border + rounding, which would break the seamless segmented
            // look — so this stays raw (accessible via its text label).
            <button key={id} type="button" onClick={() => requestMode(id)}
              aria-pressed={mode === id}
              style={{
                flex: 1, padding: `${SP.sm}px 0`,
                background: 'transparent',
                border: 'none',
                borderBottom: mode === id ? `2px solid ${GOLD}` : '2px solid transparent',
                cursor: 'pointer',
                fontSize: FS.sm, fontWeight: mode === id ? 700 : 500,
                color: mode === id ? GOLD : MUTED, fontFamily: sans,
                // Mobile 44px tap floor (the primitive's floor doesn't reach this
                // raw segment, so it is applied inline). Desktop unchanged.
                ...(isMobile ? { minHeight: 44 } : null),
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

      {/* Primary path: email then password, always inline. Sign-up adds a
          confirm-password field directly below. */}
      <Input type="email" label={t('auth.placeholder.email')} placeholder={t('auth.placeholder.email')} value={email} onChange={setEmail} onKeyDown={onEnter} />
      <Input type="password" label={t('auth.placeholder.password')} placeholder={t('auth.placeholder.password')} value={password} onChange={setPassword} onKeyDown={onEnter} />
      {mode === 'signup' && (
        <Input type="password" label={t('auth.placeholder.confirmPassword')} placeholder={t('auth.placeholder.confirmPassword')} value={confirmPassword} onChange={setConfirmPassword} onKeyDown={onEnter} />
      )}

      {mode === 'signin' && (
        <Checkbox checked={rememberMe} onChange={setRememberMe} label={t('auth.rememberMe')} />
      )}

      {/* Wave-D human verification (INERT until the perimeterCaptcha flag + keys
          are set). Managed/invisible mode: silent for humans, so it does not add
          a visible step to the form. Renders nothing while the flag is off. */}
      <CaptchaGate action={mode === 'signup' ? 'signup' : 'signin'} onToken={setCaptchaToken} />

      <AuthCTAButton onClick={submit} disabled={loading}>
        {loading
          ? t('auth.button.working')
          : (mode === 'signup' ? t('auth.button.createAcct') : t('auth.button.signIn'))}
      </AuthCTAButton>

      {/* Forgot-password, surfaced directly for sign-in (no longer buried in a
          disclosure). Routes to the security-question reset mode. */}
      {mode === 'signin' && (
        <Button variant="ghost" size="sm" onClick={() => requestMode('reset')}>
          {t('auth.password.forgot')}
        </Button>
      )}

      {/* ── Alternatives ──────────────────────────────────────────────────────
          Placed BELOW the email/password form, never above it: password stays
          the primary path. Order: Discord, Google, then the email sign-in link.
          Sign-up does NOT offer the link — account creation is password-only
          (mirrors OAuth being withheld from sign-up). */}
      {(showDiscord || showGoogle) && (
        <div data-testid="oauth-section" style={{ display: 'flex', flexDirection: 'column', gap: SP.sm, marginTop: SP.sm }}>
          <OrDivider label={t('auth.oauth.divider')} />
          {showDiscord && (
            <OAuthButton
              glyph={<DiscordGlyph />}
              label="Discord"
              onClick={() => handleOAuth('discord')}
              disabled={loading || !isConfigured}
            />
          )}
          {showGoogle && (
            <OAuthButton
              glyph={<GoogleGlyph />}
              label="Google"
              onClick={() => handleOAuth('google')}
              disabled={loading || !isConfigured}
            />
          )}
          <AuthCTAButton variant="ghost" onClick={handleMagicLink} disabled={loading}>
            {t('auth.button.emailLink')}
          </AuthCTAButton>
        </div>
      )}
      {mode === 'signin' && !showDiscord && !showGoogle && (
        // Sign-in only, no OAuth providers enabled: the email sign-in link still
        // needs a home, so it gets its own full-width alternative under the
        // primary CTA.
        <div style={{ display: 'flex', flexDirection: 'column', gap: SP.sm, marginTop: SP.sm }}>
          <OrDivider label={t('auth.oauth.divider')} />
          <AuthCTAButton variant="ghost" onClick={handleMagicLink} disabled={loading}>
            {t('auth.button.emailLink')}
          </AuthCTAButton>
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
