/**
 * components/auth/SetNewPasswordPage.jsx — the /set-new-password landing.
 *
 * Where the recovery email link (minted by the auth-recovery edge function,
 * redirectTo = this page) lands. The Supabase client is created with
 * detectSessionInUrl:true, so on load it parses the recovery token out of the
 * URL and fires a 'PASSWORD_RECOVERY' auth event, establishing a short-lived
 * recovery session. With that session active we show a "set a new password"
 * form (new + confirm) → authUpdatePassword (updateUser({ password })) → on
 * success the user is fully authed and we route into the app.
 *
 * Two states:
 *   - recovery session active → the completion form.
 *   - no recovery session (someone opened the page directly) → a calm fallback
 *     that points them at the email-link reset request, so the page is never a
 *     dead end.
 *
 * The recovery session IS the proof of identity (it came from a link mailed to
 * the account's own address on a correct security answer), so there is no
 * current-password re-auth gate here — that gate is for an already-signed-in
 * user changing their password from Account.
 *
 * Conventions: calm voice via the copy registry, no icons beyond the loading
 * spinner shared with the confirm page, theme tokens, every control labelled,
 * no raw button elements, under the 600-line ratchet.
 */
import { useEffect, useState } from 'react';
import { Loader } from 'lucide-react';
import { useStore } from '../../store/index.js';
import { navigate } from '../../hooks/useRoute.js';
import { viewToPath } from '../../lib/routes.js';
import { supabase, isConfigured } from '../../lib/supabase.js';
import { GOLD, SECOND, FS, SP } from '../theme.js';
import { t } from '../../copy/index.js';
import {
  AuthPageShell, FooterLink, Input, Button as AuthCTAButton, Alert, Button,
} from './authUI.jsx';

/**
 * True when the current URL carries Supabase's recovery marker. The recovery
 * link lands with 'type=recovery' in the hash (implicit flow) or the query
 * string (PKCE). Either is a genuine recovery signal; a bare session is not.
 *
 * @returns {boolean}
 */
function urlMarksRecovery() {
  if (typeof window === 'undefined') return false;
  const hash = (window.location.hash || '').replace(/^#/, '');
  const search = (window.location.search || '').replace(/^\?/, '');
  const hashType = new URLSearchParams(hash).get('type');
  const searchType = new URLSearchParams(search).get('type');
  return hashType === 'recovery' || searchType === 'recovery';
}

export default function SetNewPasswordPage() {
  const authUpdatePassword = useStore(s => s.authUpdatePassword);
  const onAuthed = () => navigate('settlements');

  // 'checking' until we know whether a recovery session is present, then
  // 'ready' (show the form) or 'no-session' (show the fallback). In mock /
  // unconfigured mode there is no real token to parse, so we start 'ready'
  // (the lazy initializer keeps this out of the effect — no cascading render).
  const [phase, setPhase] = useState(() => (!isConfigured || !supabase ? 'ready' : 'checking'));
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState(null);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  // Authorize ONLY on a genuine recovery signal — never on a bare session. An
  // ordinary logged-in (or stolen) session reaching this page must NOT be able
  // to rotate the password without the current-password re-auth that the
  // Account security panel requires. Two recovery signals exist:
  //   • the PASSWORD_RECOVERY auth event (the canonical signal), and
  //   • the 'type=recovery' marker the recovery link carries in the URL
  //     (hash for the implicit flow, query for PKCE), which detectSessionInUrl
  //     consumes. We read it on mount to cover the race where the event fired
  //     before we subscribed; the marker persists in the hash long enough to
  //     observe. A SIGNED_IN event or a getSession() session is NOT accepted.
  useEffect(() => {
    // Mock / unconfigured: no real recovery token to parse (phase already
    // initialized to 'ready'); nothing to subscribe to.
    if (!isConfigured || !supabase) return undefined;

    let active = true;
    const settle = (isRecovery) => {
      if (!active) return;
      setPhase(isRecovery ? 'ready' : 'no-session');
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') settle(true);
    });

    // The recovery link carries 'type=recovery' in the URL. detectSessionInUrl
    // may strip it once parsed, so we snapshot it synchronously on mount.
    if (urlMarksRecovery()) settle(true);
    else {
      // Give the event a brief moment to arrive (it may fire just after mount),
      // then conclude no-session. We never fall back to accepting a plain
      // session — only the PASSWORD_RECOVERY event above can still flip us.
      setTimeout(() => settle(false), 1200);
    }

    return () => { active = false; subscription.unsubscribe(); };
  }, []);

  const handleSubmit = async () => {
    if (!password) { setError(t('auth.error.passwordRequired')); return; }
    if (password.length < 6) { setError(t('auth.error.passwordTooShort')); return; }
    if (password !== confirm) { setError(t('auth.error.passwordMismatch')); return; }
    setError(null);
    setLoading(true);
    try {
      await authUpdatePassword(password);
      setDone(true);
      // The update refreshes the session into a full one; route into the app.
      // A short beat lets the success note read before the navigation.
      setTimeout(() => onAuthed(), 1200);
    } catch (e) {
      setError(t('auth.setNew.failed'));
    } finally {
      setLoading(false);
    }
  };

  const onEnter = (e) => { if (e.key === 'Enter') handleSubmit(); };

  return (
    <AuthPageShell
      title={t('auth.setNew.title')}
      subtitle={phase === 'ready' ? t('auth.setNew.prose') : undefined}
      footer={
        <span>
          <FooterLink
            href={viewToPath('signin')}
            onClick={(e) => { e.preventDefault(); navigate('signin'); }}
          >
            {t('auth.button.backToSignIn')}
          </FooterLink>
        </span>
      }
    >
      {phase === 'checking' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: SP.lg, textAlign: 'center' }}>
          <Loader size={40} color={GOLD} style={{ margin: '0 auto' }} />
          <p role="status" aria-live="polite" style={{ fontSize: FS.md, color: SECOND, margin: 0, lineHeight: 1.5 }}>
            {t('auth.confirm.confirming')}
          </p>
        </div>
      )}

      {phase === 'ready' && !done && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: SP.lg }}>
          {error && <Alert type="error">{error}</Alert>}
          <Input
            type="password"
            placeholder={t('auth.setNew.newLabel')}
            value={password}
            onChange={setPassword}
            onKeyDown={onEnter}
          />
          <Input
            type="password"
            placeholder={t('auth.setNew.confirmLabel')}
            value={confirm}
            onChange={setConfirm}
            onKeyDown={onEnter}
          />
          <AuthCTAButton onClick={handleSubmit} disabled={loading}>
            {loading ? t('auth.button.working') : t('auth.setNew.submit')}
          </AuthCTAButton>
        </div>
      )}

      {phase === 'ready' && done && (
        <Alert type="success">{t('auth.setNew.success')}</Alert>
      )}

      {phase === 'no-session' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: SP.lg }}>
          <p style={{ fontSize: FS.md, color: SECOND, margin: 0, lineHeight: 1.5 }}>
            {t('auth.setNew.requestProse')}
          </p>
          <Button variant="ghost" onClick={() => navigate('reset-password')}>
            {t('auth.setNew.requestLink')}
          </Button>
        </div>
      )}
    </AuthPageShell>
  );
}
