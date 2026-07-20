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
 *
 * NOTE on HomeLanding: the redesign template imported it statically (the Welcome
 * landing IS first paint for anon). This tree's first-paint byte budget is tighter
 * (the kernel/engine extraction shrank the entry), and a static HomeLanding pushed
 * the entry static closure over budget (tests/build/vendorPdfLazy.test.js). It is
 * lazy here — the shell's Suspense shows the brief Loading fallback before the hero.
 * Its proof card lazy-loads from inside HomeLanding.
 */
import { Suspense, lazy } from 'react';
import { IconsContext } from './components/primitives/IconsContext.js';
import { MUTED, sans } from './components/theme.js';
import HouseDevice from './components/brand/HouseDevice.jsx';

// Lazy-loaded views (code-split off the first-paint graph).
const HomeLanding     = lazy(() => import('./components/HomeLanding.jsx'));
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
// Dedicated auth routes (/signin · /register · /reset-password · /verify-email
// · /set-new-password · /confirm-email). Thin page wrappers around the same
// <AuthPanel> the modal renders, plus the two recovery/confirmation landings.
// SetNewPasswordPage (/set-new-password) is where the auth-recovery edge
// function's emailed reset link lands; ConfirmEmailPage (/confirm-email) is the
// sign-up confirmation landing. Both are standalone status pages (they read
// auth/recovery state, not AuthPanel), lazy like the rest of this table so they
// stay off the first-paint graph.
const SignInPage        = lazy(() => import('./components/auth/SignInPage.jsx'));
const RegisterPage      = lazy(() => import('./components/auth/RegisterPage.jsx'));
const ResetPasswordPage = lazy(() => import('./components/auth/ResetPasswordPage.jsx'));
const SetNewPasswordPage = lazy(() => import('./components/auth/SetNewPasswordPage.jsx'));
const VerifyEmailPage   = lazy(() => import('./components/auth/VerifyEmailPage.jsx'));
const ConfirmEmailPage  = lazy(() => import('./components/auth/ConfirmEmailPage.jsx'));
// Legal / trust pages (4c). Lazy — they are off the first-paint graph. The
// retired /refunds URL renders TermsPage (scrolled to its Refunds section), so
// there is no separate RefundsPage chunk.
const TermsPage         = lazy(() => import('./components/legal/TermsPage.jsx'));
const PrivacyPage       = lazy(() => import('./components/legal/PrivacyPage.jsx'));
// R-7/R-9 trust pages + V-18 the DM Screen — all lazy (off the first-paint graph).
const CovenantPage      = lazy(() => import('./components/legal/CovenantPage.jsx'));
const BountyPage        = lazy(() => import('./components/legal/BountyPage.jsx'));
const DmScreen          = lazy(() => import('./components/screen/DmScreen.jsx'));
// The public Founder seat-lineage page. Lazy — off the first-paint graph; its lineage
// read (lib/founderLineage.js) is dynamically imported on mount and fails closed.
const FoundersPage      = lazy(() => import('./components/founders/FoundersPage.jsx'));
// The First Hundred honor roll (/first-hundred) and the public roadmap (/roadmap).
// Lazy — off the first-paint graph; each renders from a committed data module.
const FirstHundredPage  = lazy(() => import('./components/founders/FirstHundredPage.jsx'));
const RoadmapPage       = lazy(() => import('./components/howto/RoadmapPage.jsx'));
// THE SEED POST (V-13): /world/<code> regenerates a shared world client-side.
// Lazy — its dynamic import of the composer/engine stays off the first-paint graph
// (tests/build/worldPageLazy.test.js).
const WorldPage         = lazy(() => import('./components/WorldPage.jsx'));

export function Loading() {
  // The diegetic loading emblem — the still house device over the plain word
  // (owner placement addendum #2: no spinner-replacement theatrics; a still ink
  // mark, reduced-motion safe by construction since nothing animates).
  return (
    <div style={{ padding: 40, textAlign: 'center', color: MUTED, fontFamily: sans }}>
      <HouseDevice size={40} mode="light" weight="standard" style={{ display: 'block', margin: '0 auto 10px', opacity: 0.85 }} />
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
      {/* Home is the Welcome landing. A bare root visit ('/') canonicalizes here
          for logged-out visitors (the front-door effect in App); members are sent
          to /create instead. The page adapts its CTAs by auth state. */}
      {view === 'home'        && <HomeLanding isMobile={isMobile} signedIn={authTier !== 'anon'} isPremium={authTier === 'premium' || isElevated} onNavigate={setView} onSignIn={() => setAuthModalOpen(true)} />}
      {view === 'settlements' && <SettlementsPanel onNavigate={setView} routeId={params.id} />}
      {/* The Realm hub. WorldMap is the Realm body; `map` still renders it for the
          one frame before the redirect effect upgrades the URL to /realm, so
          there's no blank flash. The Realm map is the ONE icons-on surface — the
          IconsContext.Provider opts this subtree in; everything else renders
          icons-off via the default (false) IconsContext. */}
      {(view === 'realm' || view === 'map') && (
        <IconsContext.Provider value={true}><WorldMap onNavigate={setView} /></IconsContext.Provider>
      )}
      {view === 'compendium'  && <CompendiumPanel standalone routeEntry={params.entry} />}
      {view === 'howto'       && <HowToUse standalone />}
      {/* Guarded views: render only once authorized. The guard effect
          redirects unauthorized visitors; until the session resolves we
          show the loader rather than flash (or crash on) gated content. */}
      {view === 'account'     && (authLoading ? <Loading /> : authTier !== 'anon' ? <AccountPage onNavigateAdmin={() => setView('admin')} /> : null)}
      {view === 'admin'       && (authLoading ? <Loading /> : isElevated ? <AdminPanel onBack={() => setView('account')} /> : null)}
      {view === 'pricing'     && <PricingPage onNavigate={setView} />}
      {view === 'gallery'     && <GalleryPage onNavigate={setView} routeSlug={params.slug} routeHub={params.hub} />}
      {view === 'founders'    && <FoundersPage onNavigate={setView} />}
      {view === 'first-hundred' && <FirstHundredPage onNavigate={setView} />}
      {view === 'roadmap'     && <RoadmapPage onNavigate={setView} />}
      {view === 'world'       && <WorldPage code={params.code} onNavigate={setView} />}
      {view === 'terms'       && <TermsPage />}
      {view === 'privacy'     && <PrivacyPage />}
      {view === 'covenant'    && <CovenantPage />}
      {view === 'bounty'      && <BountyPage />}
      {view === 'screen'      && <DmScreen />}
      {/* /refunds is retired as a standalone page — its content is now the Terms
          "Refunds and cancellation" section. The old URL still resolves: it
          renders Terms and scrolls to that subsection, so no emailed/shared
          refund link breaks. */}
      {view === 'refunds'     && <TermsPage scrollToId="terms-refunds" />}
      {view === 'dossier-success' && (
        <SingleDossierSuccessPage
          onSignUp={() => { setView('generate'); setAuthModalOpen(true); }}
          onGenerateAnother={() => setView('generate')}
        />
      )}
      {view === 'signin'           && <SignInPage />}
      {view === 'register'         && <RegisterPage />}
      {view === 'reset-password'   && <ResetPasswordPage />}
      {view === 'set-new-password' && <SetNewPasswordPage />}
      {view === 'verify-email'     && <VerifyEmailPage />}
      {view === 'confirm-email'    && <ConfirmEmailPage />}
    </>
  );
}

// Suspense re-exported so App can keep its shell wrapping terse if desired.
export { Suspense };
