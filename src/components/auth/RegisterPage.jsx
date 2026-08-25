/**
 * components/auth/RegisterPage.jsx — the dedicated /register route.
 *
 * Sign-up twin of SignInPage. AuthPanel starts in 'signup' mode with tabs
 * hidden; if the project requires email confirmation the panel flips to its
 * inline "check your inbox" view (no route change). If sign-up returns a live
 * session (confirmation disabled), onAuthed + the authTier effect redirect to
 * ?next= / /create, same as sign-in.
 */
import { useEffect } from 'react';
import { useStore } from '../../store/index.js';
import { navigate, navigatePath } from '../../hooks/useRoute.js';
import { viewToPath } from '../../lib/routes.js';
import AuthPanel, { AUTH_MODE_VIEW } from './AuthPanel.jsx';
import { AuthPageShell, FooterLink } from './authUI.jsx';

function readNext() {
  if (typeof window === 'undefined') return '/create';
  return new URLSearchParams(window.location.search).get('next') || '/create';
}

export default function RegisterPage() {
  const authTier = useStore(s => s.auth.tier);
  const authLoading = useStore(s => s.auth.loading);

  useEffect(() => {
    if (!authLoading && authTier !== 'anon') {
      navigatePath(readNext(), { replace: true });
    }
  }, [authTier, authLoading]);

  const goNext = () => navigatePath(readNext(), { replace: true });
  const goMode = (mode) => navigate(AUTH_MODE_VIEW[mode] || 'signin');

  return (
    <AuthPageShell
      title="Create your account"
      subtitle="Free to start. Save your work, push to larger sizes, and link settlements."
      footer={
        <span>
          Already have an account?{' '}
          <FooterLink
            href={viewToPath('signin')}
            onClick={(e) => { e.preventDefault(); navigate('signin'); }}
          >
            Sign in
          </FooterLink>
        </span>
      }
    >
      <AuthPanel
        initialMode="signup"
        showTabs={false}
        onAuthed={goNext}
        onModeChange={goMode}
      />
    </AuthPageShell>
  );
}
