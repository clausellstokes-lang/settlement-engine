/**
 * components/auth/ConfirmEmailPage.jsx — the minimal /confirm-email landing.
 *
 * This is where the sign-up confirmation link lands (emailRedirectTo, threaded
 * through supabaseSignUp in lib/auth.js). It is DELIBERATELY a dead-end status
 * page, NOT the app: the ORIGINAL signup window is the one that signs the user
 * in (it polls signInWithPassword and succeeds the instant this link is
 * clicked). So all this page does is:
 *
 *   - reflect that the confirmation was processed (Supabase's detectSessionInUrl
 *     parses the token on load and flips auth state via the onAuthStateChange
 *     listener App wires in initAuth),
 *   - tell the user their original window is signing them in, and they can close
 *     this tab,
 *   - offer a best-effort "close this tab" — honest that browsers block scripts
 *     from closing tabs the user opened, so it may no-op.
 *
 * It establishes no session itself and reads no token directly — it only
 * reflects the result, so there is nothing here to spoof or replay. It never
 * navigates into the app (that would race the original window's auto-login).
 */
import { Loader } from 'lucide-react';
import { useStore } from '../../store/index.js';
import { navigate } from '../../hooks/useRoute.js';
import { GOLD, SECOND, MUTED, FS, SP } from '../theme.js';
import { AuthPageShell, Button, Alert } from './authUI.jsx';
import { t } from '../../copy/index.js';

export default function ConfirmEmailPage() {
  const authTier = useStore(s => s.auth.tier);
  const authLoading = useStore(s => s.auth.loading);

  const confirmed = !authLoading && authTier !== 'anon';

  // Best-effort tab close. Browsers only honour window.close() for windows a
  // script actually opened (not user-typed/navigated tabs), so this commonly
  // no-ops — the copy below sets that expectation honestly.
  const closeTab = () => {
    try { window.close(); } catch { /* blocked by the browser — expected */ }
  };

  return (
    <AuthPageShell title={t('auth.confirm.title')}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: SP.lg, textAlign: 'center' }}>
        {authLoading ? (
          <>
            <Loader size={40} color={GOLD} style={{ margin: '0 auto' }} />
            <p role="status" aria-live="polite" style={{ fontSize: FS.md, color: SECOND, margin: 0, lineHeight: 1.5 }}>
              {t('auth.confirm.confirming')}
            </p>
          </>
        ) : confirmed ? (
          <>
            <Alert type="success">
              {t('auth.confirm.confirmed')}
            </Alert>
            <Button onClick={closeTab}>
              {t('auth.confirm.closeTab')}
            </Button>
            <p style={{ fontSize: FS.sm, color: MUTED, margin: 0, lineHeight: 1.5 }}>
              {t('auth.confirm.closeNote')}
            </p>
          </>
        ) : (
          <>
            <Alert type="error">
              {t('auth.confirm.failed')}
            </Alert>
            <Button variant="ghost" onClick={() => navigate('signin')}>
              {t('auth.confirm.goSignIn')}
            </Button>
          </>
        )}
      </div>
    </AuthPageShell>
  );
}
