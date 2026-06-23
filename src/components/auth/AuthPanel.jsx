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
 * Password is the primary method: email then password show inline, always.
 * The email sign-in link and OAuth (Google, Discord) are alternatives, in a
 * group below the primary CTA. Forgot-password is surfaced directly for
 * sign-in.
 */
import { useState } from 'react';
import { useStore } from '../../store/index.js';
import { GOLD, GOLD_TXT, GOLD_BG, MUTED, SECOND, BORDER, sans, SP, R, FS } from '../theme.js';
import { isConfigured } from '../../lib/supabase.js';
import { getTierDisplayName } from '../../config/pricing.js';
import { flag } from '../../lib/flags.js';
import { t } from '../../copy/index.js';
import Button from '../primitives/Button.jsx';
import SecurityQuestionsFields from './SecurityQuestionsFields.jsx';
import ForgotPasswordFlow from './ForgotPasswordFlow.jsx';
import { useConfirmPolling } from '../../hooks/useConfirmPolling.js';
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
  const authSetSecurityAnswers = useStore(s => s.authSetSecurityAnswers);

  const [mode, setMode] = useState(initialMode); // 'signin' | 'signup' | 'reset' | 'verify'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // sign-up only
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Security questions (sign-up only). Captured on the form, then STASHED so the
  // post-confirmation polling auto-login can persist them the moment a session
  // exists — set_my_security_answers needs auth.uid(), which signUp doesn't
  // grant while email confirmation is pending. `securityStash` holds the four
  // values across the form → verify → poll-success transition.
  const [q1, setQ1] = useState('');
  const [a1, setA1] = useState('');
  const [q2, setQ2] = useState('');
  const [a2, setA2] = useState('');
  const [securityStash, setSecurityStash] = useState(null);
  // True once the verify screen's bounded poll exhausts its window without a
  // confirmation — swaps the calm "we'll sign you in" note for a fall-back hint.
  const [pollTimedOut, setPollTimedOut] = useState(false);
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
    setConfirmPassword('');
    setMagicSent(false);
    // Clear any stashed security-question state so a later return to sign-up
    // starts clean and a stale stash can't be re-persisted to the wrong session.
    setQ1(''); setA1(''); setQ2(''); setA2('');
    setSecurityStash(null);
    setPollTimedOut(false);
    if (onModeChange) onModeChange(next);
    else setMode(next);
  };

  // First-question setter that drops a colliding second pick: if the user picks
  // the same question they'd already chosen for slot 2, clear slot 2 so the two
  // can never be equal (the second <select> also excludes the first pick going
  // forward; this guards the change-after-the-fact case).
  const chooseQ1 = (next) => {
    setQ1(next);
    if (next && next === q2) setQ2('');
  };

  // Sign-up security-question validity, surfaced both as the submit guard and to
  // disable the CTA until satisfied. Both questions chosen, distinct, answered.
  const securityComplete =
    Boolean(q1) && Boolean(q2) && q1 !== q2 && a1.trim() !== '' && a2.trim() !== '';

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

  // Persist the stashed security answers against a now-live session. Best-effort:
  // the account already exists, so a transient RPC failure must NOT block the
  // user — we surface a calm "set them later" note and move on. Returns nothing;
  // it clears the stash on success so it can't double-fire.
  const persistSecurityAnswers = async (answers) => {
    if (!answers) return;
    try {
      await authSetSecurityAnswers(answers);
      setSecurityStash(null);
    } catch {
      // Non-fatal: the account is valid; they can set questions from Account.
      setSecurityStash(null);
      setMessage(t('auth.security.saveDeferred'));
    }
  };

  // Fired by the verify-screen poll the instant the confirmation link is clicked
  // (anywhere) and the silent sign-in succeeds. A session now exists, so this is
  // the first safe moment to write the security answers, then hand off to onAuthed.
  const handleConfirmed = async () => {
    await persistSecurityAnswers(securityStash);
    onAuthed?.();
  };

  const handleSignUp = async () => {
    if (!email.trim() || !password) return;
    if (password.length < 6) { setError(t('auth.error.passwordTooShort')); return; }
    if (password !== confirmPassword) { setError(t('auth.error.passwordMismatch')); return; }
    // Security questions are mandatory for email/password sign-up.
    if (!q1 || !q2) { setError(t('auth.security.error.bothRequired')); return; }
    if (q1 === q2) { setError(t('auth.security.error.distinct')); return; }
    if (!a1.trim() || !a2.trim()) { setError(t('auth.security.error.bothRequired')); return; }
    setError(null);
    setLoading(true);
    // Stash the answers BEFORE the network call so the polling auto-login can
    // persist them even though this signUp returns no session (confirmation
    // pending). Normalized casing/whitespace happens server-side in the RPC.
    const answers = { q1, a1: a1.trim(), q2, a2: a2.trim() };
    setSecurityStash(answers);
    try {
      const { needsVerification } = await authSignUp(email.trim(), password);
      if (needsVerification) {
        setPollTimedOut(false);
        setMode('verify'); // inline "check your inbox" — the poll takes over
      } else {
        // Auto-confirmed (dev / mock): a session already exists, so persist the
        // answers immediately rather than waiting on a poll that won't run.
        await persistSecurityAnswers(answers);
        onAuthed?.();
      }
    } catch (e) {
      setError(e.message || t('auth.error.signUpFailed'));
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

  // Post-signup auto-login: while the "check your inbox" verify screen shows,
  // poll signInWithPassword with the just-entered credentials. The instant the
  // confirmation link is clicked (here or on any device) the poll succeeds →
  // handleConfirmed persists the stashed answers and runs onAuthed. Bounded:
  // stops on success / after ~5 min (→ pollTimedOut note) / on unmount. No-ops
  // in mock mode (no real confirmation gate). See useConfirmPolling.
  useConfirmPolling({
    active: mode === 'verify',
    email: email.trim(),
    password,
    onConfirmed: handleConfirmed,
    onTimeout: () => setPollTimedOut(true),
    // A genuine failure (wrong password is implausible here since we just set
    // it, but network faults happen): surface it on the verify screen rather
    // than poll silently forever.
    onError: (e) => setError(e.message || t('auth.error.signInFailed')),
  });

  // Password is the primary inline path: sign-up creates an account, anything
  // else signs in. The email sign-in link is an explicit alternative below.
  const submit = mode === 'signup' ? handleSignUp : handleSignIn;
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
  // The window now WAITS here: useConfirmPolling silently signs the user in the
  // moment they click the confirmation link (any device). The note explains the
  // wait; if the bounded poll exhausts its window we swap in a fall-back hint.
  if (mode === 'verify') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: SP.lg, textAlign: 'center' }}>
        <Alert type="success">
          {t('auth.verify.sent', { email })}
        </Alert>
        {error && <Alert type="error">{error}</Alert>}
        <p role="status" aria-live="polite" style={{ fontSize: FS.sm, color: SECOND, margin: 0, lineHeight: 1.5 }}>
          {pollTimedOut ? t('auth.verify.pollingTimedOut') : t('auth.verify.polling')}
        </p>
        <Button variant="ghost" size="sm" onClick={() => requestMode('signin')}>
          {t('auth.button.backToSignIn')}
        </Button>
      </div>
    );
  }

  // ── Forgot-password challenge ─────────────────────────────────────────────
  // The reset mode is now the security-question challenge (email → random
  // question → reset link), run through the auth-recovery edge function. The
  // multi-step flow lives in its own component to keep this file lean; "back to
  // sign in" routes through requestMode so pages navigate and the modal switches
  // in place, exactly like every other mode transition here.
  if (mode === 'reset') {
    return <ForgotPasswordFlow onBackToSignIn={() => requestMode('signin')} />;
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

      {/* Primary path: email then password, always inline. Sign-up adds a
          confirm-password field directly below. */}
      <Input type="email" placeholder={t('auth.placeholder.email')} value={email} onChange={setEmail} onKeyDown={onEnter} />
      <Input type="password" placeholder={t('auth.placeholder.password')} value={password} onChange={setPassword} onKeyDown={onEnter} />
      {mode === 'signup' && (
        <Input type="password" placeholder={t('auth.placeholder.confirmPassword')} value={confirmPassword} onChange={setConfirmPassword} onKeyDown={onEnter} />
      )}

      {/* Security questions — sign-up only, AFTER confirm-password. The answers
          are stashed and persisted server-side (bcrypt-hashed) once a session
          exists; they never reach the client unhashed beyond this form. */}
      {mode === 'signup' && (
        <SecurityQuestionsFields
          q1={q1} a1={a1} q2={q2} a2={a2}
          setQ1={chooseQ1} setA1={setA1} setQ2={setQ2} setA2={setA2}
          onKeyDown={onEnter}
        />
      )}

      {mode === 'signin' && (
        <Checkbox checked={rememberMe} onChange={setRememberMe} label={t('auth.rememberMe')} />
      )}

      <AuthCTAButton onClick={submit} disabled={loading || (mode === 'signup' && !securityComplete)}>
        {loading
          ? t('auth.button.working')
          : (mode === 'signup' ? t('auth.button.createAcct') : t('auth.button.signIn'))}
      </AuthCTAButton>

      {/* Forgot-password, surfaced directly for sign-in (no longer buried in a
          disclosure). Routes to the reset-request mode. */}
      {mode === 'signin' && (
        <Button variant="ghost" size="sm" onClick={() => requestMode('reset')}>
          {t('auth.password.forgot')}
        </Button>
      )}

      {/* ── Alternatives ──────────────────────────────────────────────────────
          Placed BELOW the email/password form, never above it: password stays
          the primary path. Order: Google, Discord, then the email sign-in link.
          The OAuth buttons no-op gracefully until the provider is enabled in the
          Supabase dashboard (the wrapper maps "provider not enabled" to a safe
          message rather than throwing). The email-link button drives the same
          "check your inbox" close as the legacy magic path. */}
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
          <AuthCTAButton variant="ghost" onClick={handleMagicLink} disabled={loading}>
            {t('auth.button.emailLink')}
          </AuthCTAButton>
        </div>
      )}
      {!showGoogle && !showDiscord && (
        // No OAuth providers enabled: the email sign-in link still needs a home,
        // so it gets its own full-width alternative under the primary CTA.
        <div style={{ display: 'flex', flexDirection: 'column', gap: SP.sm, marginTop: SP.sm }}>
          <OrDivider label={t('auth.oauth.divider')} />
          <AuthCTAButton variant="ghost" onClick={handleMagicLink} disabled={loading}>
            {t('auth.button.emailLink')}
          </AuthCTAButton>
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
