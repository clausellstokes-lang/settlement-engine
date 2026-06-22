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
import { useStore } from '../../store/index.js';
import { GOLD, GOLD_TXT, GOLD_BG, MUTED, SECOND, BORDER, sans, SP, R, FS } from '../theme.js';
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
  // A successful magic-link send swaps the form for a dedicated "check your
  // inbox" close (P9 peak/end) rather than re-rendering the same form under a
  // green strip — a boolean, not the dual-purpose `message` string, gates it.
  const [magicSent, setMagicSent] = useState(false);

  // User-initiated mode switch. Pages hand this to the router (changes the
  // URL); the modal switches in place. The signup → verify transition is
  // NOT routed through here — it stays inline ("check your inbox").
  const requestMode = (next) => {
    setError(null);
    setMessage(null);
    setMoreOpen(false);
    setMagicSent(false);
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
        // Dev-only branch (fires only when !isConfigured): keep it terse and
        // free of engine-internal wording ("local mode" / "mocked") — a GM who
        // somehow hits it still reads a plain next step, not an internals leak.
        setMessage(t('auth.localMode'));
      }
      // Real mode: Supabase has navigated away; nothing more to do.
    } catch (e) {
      setError(e.message || t('auth.error.oauthFailed'));
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
      setError(e.message || t('auth.error.signInFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (!email.trim() || !password) return;
    if (password.length < 6) { setError(t('auth.error.passwordTooShort')); return; }
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
      setError(e.message || t('auth.error.signUpFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email.trim()) { setError(t('auth.error.emailRequired')); return; }
    setError(null);
    setLoading(true);
    try {
      await authResetPassword(email.trim());
      setMessage(t('auth.reset.sent'));
    } catch (e) {
      setError(e.message || t('auth.error.resetFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleMagicLink = async () => {
    if (!email.trim()) { setError(t('auth.error.emailRequired')); return; }
    setError(null);
    setLoading(true);
    try {
      await authMagicLink(email.trim());
      setMagicSent(true);
    } catch (e) {
      setError(e.message || t('auth.error.magicLinkFailed'));
    } finally {
      setLoading(false);
    }
  };

  // Forward affordances out of the sent-state: re-fire the link, or clear back
  // to the form to correct a mistyped address (P9 — a satisfying, actionable
  // close, never a dead-end on an untouchable form).
  const resendMagicLink = () => { setMagicSent(false); handleMagicLink(); };
  const editEmail = () => { setMagicSent(false); setError(null); setMessage(null); };

  const submit = authMethod === 'magic'
    ? handleMagicLink
    : mode === 'signup' ? handleSignUp : handleSignIn;
  const onEnter = (e) => { if (e.key === 'Enter') submit(); };

  // ── Magic-link sent ("check your inbox") ──────────────────────────────────
  // The default auth path's close. Mirrors the verify branch shape (status
  // + next steps) so the most-common flow ends on a satisfying,
  // actionable note rather than a flat form the user has no reason to touch.
  if (magicSent) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: SP.lg, textAlign: 'center' }}>
        <Alert type="success">
          {t('auth.magic.sent', { email: email.trim() })}
        </Alert>
        <div style={{ display: 'flex', flexDirection: 'column', gap: SP.xs }}>
          <Button variant="ghost" size="sm" onClick={resendMagicLink} disabled={loading}>
            {loading ? t('auth.button.working') : t('auth.button.resend')}
          </Button>
          <Button variant="ghost" size="sm" onClick={editEmail}>
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
        <Alert type="success">
          {t('auth.verify.sent', { email })}
        </Alert>
        <Button variant="ghost" size="sm" onClick={() => requestMode('signin')}>
          {t('auth.button.backToSignIn')}
        </Button>
      </div>
    );
  }

  // ── Password reset request ────────────────────────────────────────────────
  if (mode === 'reset') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: SP.lg }}>
        <p style={{ fontSize: FS.md, color: SECOND, margin: 0, lineHeight: 1.5 }}>
          {t('auth.reset.prose')}
        </p>
        {error && <Alert type="error">{error}</Alert>}
        {message && <Alert type="success">{message}</Alert>}
        <Input type="email" placeholder={t('auth.placeholder.email')} value={email} onChange={setEmail} />
        <AuthCTAButton onClick={handleResetPassword} disabled={loading}>
          {loading ? t('auth.button.working') : 'Send reset link'}
        </AuthCTAButton>
        <Button variant="ghost" size="sm" onClick={() => requestMode('signin')}>
          {t('auth.button.backToSignIn')}
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
                // Active state in two non-color channels (weight + a gold
                // underline) so it survives the squint/grayscale test, not
                // hue alone. GOLD_TXT/SECOND are the AA-legible label tokens
                // (gold-500/MUTED fail 4.5:1 as control text).
                borderBottom: mode === id ? `2px solid ${GOLD}` : '2px solid transparent',
                fontSize: FS.sm, fontWeight: mode === id ? 700 : 500,
                color: mode === id ? GOLD_TXT : SECOND, fontFamily: sans,
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
      {authMethod === 'magic' && (
        // Plain gloss on the default path: name what happens next so the absent
        // password field reads as deliberate, not missing.
        <p style={{ fontSize: FS.xs, color: SECOND, margin: 0, lineHeight: 1.5 }}>
          No password needed. We email you a sign-in link.
        </p>
      )}
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
        <div data-testid="oauth-section" style={{ display: 'flex', flexDirection: 'column', gap: SP.sm, marginTop: SP.sm }}>
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
        aria-controls="auth-more-options"
        style={{ marginTop: SP.xs }}
      >
        {moreOpen ? t('auth.button.moreClose') : t('auth.button.moreOpen')}
      </Button>

      {moreOpen && (
        // Revealed sub-options under the CTA — a spaced/indented cluster, not a
        // framed panel-in-panel (P5 anti-box-soup): the indent + spacing carry
        // the subordination, no border/tint card needed.
        <div id="auth-more-options" style={{
          display: 'flex', flexDirection: 'column', gap: SP.xs,
          paddingLeft: SP.md,
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
        <div style={{ textAlign: 'center', fontSize: FS.xs, color: MUTED, fontStyle: 'italic' }}>
          {t('auth.localMode')}
        </div>
      )}
    </div>
  );
}
