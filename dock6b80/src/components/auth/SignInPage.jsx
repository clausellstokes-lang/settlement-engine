/**
 * components/auth/SignInPage.jsx — the dedicated /signin route.
 *
 * Full-page sign-in: AuthPageShell chrome wrapping the shared AuthPanel in
 * sign-in mode with the tab toggle hidden (mode switches navigate to the
 * sibling /register · /reset-password routes rather than toggling in place).
 *
 * Post-auth redirect: the moment a session is established we leave for the
 * ?next= destination (if it's a safe internal path) or /create. This covers
 * both the synchronous password path (onAuthed) and the async magic-link /
 * OAuth return, where the session lands via onAuthStateChange after mount —
 * hence the effect on authTier in addition to the onAuthed callback.
 */
import { useEffect } from 'react';
import { useStore } from '../../store/index.js';
import { navigate, navigatePath } from '../../hooks/useRoute.js';
import { viewToPath } from '../../lib/routes.js';
import AuthPanel, { AUTH_MODE_VIEW } from './AuthPanel.jsx';
import { AuthPageShell, FooterLink } from './authUI.jsx';
import { t } from '../../copy/index.js';
import { SP } from '../theme.js';

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
      // Route title + subtitle through the shared auth tokens (cross-surface
      // consistency, mirroring RegisterPage): the page formerly hand-wrote both,
      // drifting from the modal/panel copy. Wording stays owned by the copy/voice
      // workstream — this is the structural fix so page and modal read identically.
      title={t('auth.modalTitle')}
      subtitle={t('auth.signinSubtitle')}
      footer={
        // Two subordinate cross-links: the primary path stays the in-card CTA.
        // The direct "Forgot your password?" link (P8) makes reset a visible
        // first click on the page, instead of burying it behind the More-options
        // → password-method disclosure dance.
        <span style={{ display: 'inline-flex', flexWrap: 'wrap', gap: `${SP.xs}px ${SP.md}px`, justifyContent: 'center' }}>
          <span>
            New here?{' '}
            <FooterLink
              href={viewToPath('register')}
              onClick={(e) => { e.preventDefault(); navigate('register'); }}
            >
              Create an account
            </FooterLink>
          </span>
          <FooterLink
            href={viewToPath('reset-password')}
            onClick={(e) => { e.preventDefault(); navigate('reset-password'); }}
          >
            Forgot your password?
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
