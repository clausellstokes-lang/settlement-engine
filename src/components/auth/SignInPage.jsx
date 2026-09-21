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
import { guardForView, isSafeNextPath, resolveLocation, routeLabelForView, viewToPath } from '../../lib/routes.js';
import AuthPanel, { AUTH_MODE_VIEW } from './AuthPanel.jsx';
import { AuthPageShell, FooterLink } from './authUI.jsx';
import RefusalNotice from '../primitives/RefusalNotice.jsx';
import { REFUSAL_REASONS, refusalOf } from '../../lib/refusalReasons.js';
import { t } from '../../copy/index.js';
import { SP } from '../theme.js';

function readNext() {
  if (typeof window === 'undefined') return '/create';
  return new URLSearchParams(window.location.search).get('next') || '/create';
}

/**
 * ⛔ THE GUARD KEPT THE DESTINATION AND DROPPED THE REASON (REVIEW-P F10, ODQ
 * §934.24(c)). App's auth guard sends an anonymous visitor at a guarded route to
 * `/signin?next=<path>` and that redirect STAYS — it is a door, not a refusal, and it
 * lands the reader back where they were aiming. What was missing is the account of
 * WHY: the 2026-09-20 walk clicked /account, measured `href: /signin?next=%2Faccount`,
 * `notices: []`, and a lead of the generic "Welcome back". The destination was
 * preserved and the cause was thrown away.
 *
 * THIS READS THE SAME `next` THE REDIRECT ALREADY CARRIES and says the one line. It
 * speaks ONLY for a route the router itself calls guarded, so a visitor who opened
 * /signin of their own accord is told nothing they did not ask about, and a `next`
 * that is unsafe, unknown or ungated resolves to no notice at all.
 *
 * @returns {{ reason: string, vars: Record<string, string>|null }|null}
 */
function guardedNextRefusal() {
  const next = typeof window === 'undefined' ? null : new URLSearchParams(window.location.search).get('next');
  // The SAME predicate the post-auth redirect trusts, so a path this page refuses to
  // describe is exactly a path it would refuse to travel to.
  if (!next || !isSafeNextPath(next)) return null;
  const { view } = resolveLocation(next);
  if (guardForView(view) !== 'auth') return null;
  const page = routeLabelForView(view);
  return page ? refusalOf(REFUSAL_REASONS.AUTH_REQUIRED, { page }) : null;
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
      // Route the title through the shared auth token (cross-surface consistency,
      // mirroring RegisterPage): the page formerly hand-wrote it, drifting from the
      // modal/panel copy.
      //
      // ⛔ NO `subtitle` HERE, DELIBERATELY (2026-09-18). AuthPanel renders
      // auth.signinSubtitle itself, directly under this card header (AuthPanel.jsx,
      // the <p> above the error slot), so passing the same token to the shell
      // printed the sentence TWICE, one line apart, on every visit to /signin. The
      // panel keeps it because the panel is the shared writer — the modal renders
      // the same line from the same key — so dropping it here leaves exactly one
      // copy on both surfaces instead of removing it from one.
      title={t('auth.modalTitle')}
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
      {/* The reason sits ABOVE the form, which is its door: the notice names the page
          that is waiting and the next control the reader meets is the one that gets
          them there. Read at render, not latched, so a `next` that changes takes the
          sentence with it. */}
      <RefusalNotice refusal={guardedNextRefusal()} style={{ marginBottom: SP.md }} />
      <AuthPanel
        initialMode="signin"
        showTabs={false}
        onAuthed={goNext}
        onModeChange={goMode}
      />
    </AuthPageShell>
  );
}
