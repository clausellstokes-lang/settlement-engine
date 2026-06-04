/**
 * components/auth/SignInPage.jsx - the dedicated /signin route.
 *
 * Full-page sign-in: AuthPageShell chrome wrapping the shared AuthPanel in
 * sign-in mode with the tab toggle hidden (mode switches navigate to the
 * sibling /register · /reset-password routes rather than toggling in place).
 *
 * Post-auth redirect: the moment a session is established we leave for the
 * ?next= destination (if it's a safe internal path) or /create. This covers
 * both the synchronous password path (onAuthed) and the async magic-link /
 * OAuth return, where the session lands via onAuthStateChange after mount -
 * hence the effect on authTier in addition to the onAuthed callback.
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

export default function SignInPage() {
  const authTier = useStore(s => s.auth.tier);
  const authLoading = useStore(s => s.auth.loading);

  // Redirect once signed in. Guarded on !loading so we don't act on the
  // brief initial 'anon' before initAuth resolves the stored session.
  useEffect(() => {
    if (!authLoading && authTier !== 'anon') {
      navigatePath(readNext(), { replace: true });
    }
  }, [authTier, authLoading]);

  const goNext = () => navigatePath(readNext(), { replace: true });
  const goMode = (mode) => navigate(AUTH_MODE_VIEW[mode] || 'signin');

  return (
    <AuthPageShell
      title="Welcome back"
      subtitle="Sign in to keep your work - saves, exports, and larger settlements."
      footer={
        <span>
          New here?{' '}
          <FooterLink
            href={viewToPath('register')}
            onClick={(e) => { e.preventDefault(); navigate('register'); }}
          >
            Create an account
          </FooterLink>
        </span>
      }
    >
      <AuthPanel
        initialMode="signin"
        showTabs={false}
        onAuthed={goNext}
        onModeChange={goMode}
      />
    </AuthPageShell>
  );
}
