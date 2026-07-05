/**
 * AppViews.jsx — the route→component registry, extracted from App.jsx.
 *
 * App.jsx owns the shell (header, nav, footer, modals, global effects); THIS file
 * owns the one place that maps the current `view` to the page component that renders
 * it, plus the code-split (lazy) imports for those pages. Splitting it keeps the shell
 * legible and gives the view table a single home. `Loading` lives here because both
 * the shell's Suspense fallback and the guarded-view loaders need it.
 *
 * Pure presentational: every input is a prop (no store reads), so it re-renders only
 * when the shell passes new values.
 */
import { Suspense, lazy } from 'react';
import HomeLanding from './components/HomeLanding.jsx';
import { IconsContext } from './components/primitives/IconsContext.js';
import { MUTED, sans } from './components/theme.js';

// Lazy-loaded views (code-split off the first-paint graph).
const GenerateWizard  = lazy(() => import('./components/GenerateWizard.jsx'));
const SettlementsPanel = lazy(() => import('./components/SettlementsPanel'));
const CompendiumPanel = lazy(() => import('./components/CompendiumPanel'));
const HowToUse        = lazy(() => import('./components/HowToUse'));
const WorldMap         = lazy(() => import('./components/WorldMap.jsx'));
const AccountPage      = lazy(() => import('./components/AccountPage.jsx'));
const AdminPanel       = lazy(() => import('./components/AdminPanel.jsx'));
const PricingPage      = lazy(() => import('./components/PricingPage.jsx'));
const GalleryPage      = lazy(() => import('./components/GalleryPage.jsx'));
const SingleDossierSuccessPage = lazy(() => import('./components/SingleDossierSuccessPage.jsx'));
// Dedicated auth routes (/signin · /register · /reset-password · /verify-email).
// Thin page wrappers around the same <AuthPanel> the modal renders.
const SignInPage        = lazy(() => import('./components/auth/SignInPage.jsx'));
const RegisterPage      = lazy(() => import('./components/auth/RegisterPage.jsx'));
const ResetPasswordPage = lazy(() => import('./components/auth/ResetPasswordPage.jsx'));
const SetNewPasswordPage = lazy(() => import('./components/auth/SetNewPasswordPage.jsx'));
const VerifyEmailPage   = lazy(() => import('./components/auth/VerifyEmailPage.jsx'));
const ConfirmEmailPage  = lazy(() => import('./components/auth/ConfirmEmailPage.jsx'));

export function Loading() {
  return (
    <div style={{ padding: 40, textAlign: 'center', color: MUTED, fontFamily: sans }}>
      Loading...
    </div>
  );
}

/**
 * Render the page component for the current `view`. Wrapped by the shell in a
 * Suspense + FeatureErrorBoundary, so this returns bare view content.
 */
export function AppViews({ view, isMobile, setView, setAuthModalOpen, authTier, isElevated, authLoading, params }) {
  return (
    <>
      {view === 'generate'    && <GenerateWizard isMobile={isMobile} onSignIn={() => setAuthModalOpen(true)} onNavigate={setView} />}
      {/* Home is the Welcome landing. A bare root visit ('/')
          canonicalizes here for everyone — logged-out and signed-in
          alike (the front-door effect above); the page adapts its CTAs by
          auth state. Deep links elsewhere are respected. */}
      {view === 'home'        && <HomeLanding isMobile={isMobile} signedIn={authTier !== 'anon'} isPremium={authTier === 'premium' || isElevated} onNavigate={setView} onSignIn={() => setAuthModalOpen(true)} />}
      {view === 'settlements' && <SettlementsPanel onNavigate={setView} routeId={params.id} />}
      {/* The Realm hub. WorldMap is the Realm body (Map + the
          Realm Inspector's Pulse / Chronicle / Pantheon sections). `map`
          still renders it for the one frame before the redirect effect
          upgrades the URL to /realm, so there's no blank flash. */}
      {/* The Realm map is the ONE icons-on surface (template IconCtx parity):
          everything else renders icons-off via the default IconsContext. */}
      {(view === 'realm' || view === 'map') && (
        <IconsContext.Provider value={true}><WorldMap onNavigate={setView} /></IconsContext.Provider>
      )}
      {view === 'compendium'  && <CompendiumPanel standalone />}
      {view === 'howto'       && <HowToUse onNavigate={setView} />}
      {/* Guarded views: render only once authorized. The guard effect
          redirects unauthorized visitors; until the session resolves we
          show the loader rather than flash (or crash on) gated content. */}
      {view === 'account'     && (authLoading ? <Loading /> : authTier !== 'anon' ? <AccountPage onNavigateAdmin={() => setView('admin')} /> : null)}
      {view === 'admin'       && (authLoading ? <Loading /> : isElevated ? <AdminPanel onBack={() => setView('account')} /> : null)}
      {view === 'pricing'     && <PricingPage onNavigate={setView} />}
      {view === 'gallery'     && <GalleryPage onNavigate={setView} routeSlug={params.slug} />}
      {view === 'dossier-success' && (
        <SingleDossierSuccessPage
          onSignUp={() => { setView('generate'); setAuthModalOpen(true); }}
          onGenerateAnother={() => setView('generate')}
        />
      )}
      {view === 'signin'         && <SignInPage />}
      {view === 'register'       && <RegisterPage />}
      {view === 'reset-password' && <ResetPasswordPage />}
      {view === 'set-new-password' && <SetNewPasswordPage />}
      {view === 'verify-email'   && <VerifyEmailPage />}
      {view === 'confirm-email'  && <ConfirmEmailPage />}
    </>
  );
}

// Suspense re-exported so App can keep its shell wrapping terse if desired.
export { Suspense };
