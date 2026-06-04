/**
 * components/auth/VerifyEmailPage.jsx - the dedicated /verify-email route.
 *
 * This is the landing page for the confirmation link in the sign-up email.
 * The Supabase client parses the token from the URL on load (detectSessionInUrl)
 * and establishes the session, which flips the store's auth tier via the
 * onAuthStateChange listener wired in initAuth (App mounts that on start).
 *
 * So this page is a thin status surface over auth state:
 *   - loading            → "Confirming your email..."
 *   - signed in (≠ anon) → "Email confirmed!" then redirect to /create
 *   - still anon         → link was invalid/expired; offer Sign In
 *
 * It establishes no session itself and reads no token - it only reflects the
 * result, so there's nothing here to spoof or replay.
 */
import { useEffect } from 'react';
import { CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { useStore } from '../../store/index.js';
import { navigate, navigatePath } from '../../hooks/useRoute.js';
import { GOLD, SECOND, MUTED, FS, SP } from '../theme.js';
import { AuthPageShell, Button, Alert } from './authUI.jsx';

export default function VerifyEmailPage() {
  const authTier = useStore(s => s.auth.tier);
  const authLoading = useStore(s => s.auth.loading);

  const confirmed = !authLoading && authTier !== 'anon';

  // Once confirmed, give the user a beat to read the success state, then
  // drop them into the app. Replace (not push) so Back doesn't loop here.
  useEffect(() => {
    if (!confirmed) return undefined;
    const id = setTimeout(() => navigatePath('/create', { replace: true }), 1600);
    return () => clearTimeout(id);
  }, [confirmed]);

  return (
    <AuthPageShell title="Verify your email">
      <div style={{ display: 'flex', flexDirection: 'column', gap: SP.lg, textAlign: 'center' }}>
        {authLoading ? (
          <>
            <Loader size={40} color={GOLD} style={{ margin: '0 auto' }} />
            <p style={{ fontSize: FS.md, color: SECOND, margin: 0, lineHeight: 1.5 }}>
              Confirming your email...
            </p>
          </>
        ) : confirmed ? (
          <>
            <CheckCircle size={40} color={GOLD} style={{ margin: '0 auto' }} />
            <Alert type="success">
              Your email is confirmed. Taking you to your settlements...
            </Alert>
            <Button onClick={() => navigatePath('/create', { replace: true })}>
              Continue
            </Button>
          </>
        ) : (
          <>
            <AlertCircle size={40} color={MUTED} style={{ margin: '0 auto' }} />
            <Alert type="error">
              This confirmation link is invalid or has expired. Try signing in -
              if your account isn't active yet, request a fresh link.
            </Alert>
            <Button variant="ghost" onClick={() => navigate('signin')}>
              Go to Sign In
            </Button>
          </>
        )}
      </div>
    </AuthPageShell>
  );
}
