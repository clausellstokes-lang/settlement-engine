/**
 * App.jsx — Pure layout shell. Zero state declarations.
 *
 * All state lives in the Zustand store (src/store/).
 * This component handles navigation, header/footer chrome,
 * and renders the active view. Each view reads its own
 * state from the store via selectors.
 *
 * Views:
 *   generate    — Settlement creation wizard
 *   settlements — Saved settlements library
 *   map         — Fantasy World Map (FMG integration)
 *   neighbour   — Neighbourhood System
 *   compendium  — Rules & data compendium
 *   howto       — About page (how-to guide + comparisons)
 *   account     — Full account page (post-auth)
 *   admin       — Developer admin panel (elevated roles only)
 */
import { useState, useEffect, lazy, Suspense } from 'react';
import { MapPin, FolderOpen, BookOpen, Map as MapIcon, Zap, User, Shield, Headphones, Images, Info } from 'lucide-react';
import useIsMobile from './hooks/useIsMobile';
import { useStore } from './store/index.js';
import { flag as _readFlag } from './lib/flags.js';
import { useRoute, navigate, replacePath } from './hooks/useRoute.js';
import { titleForView, guardForView, viewToPath } from './lib/routes.js';
import { GOLD, GOLD_BG, INK, INK_DEEP, MUTED, SECOND, sans, serif_, SP, R, FS, swatch } from './components/theme.js';
import { resolveViewBackground } from './config/pageBackgrounds.js';
import AccountMenu from './components/AccountMenu.jsx';
import CampaignSyncBanner from './components/CampaignSyncBanner.jsx';

// Lazy-loaded views
const GenerateWizard  = lazy(() => import('./components/GenerateWizard.jsx'));
const SettlementsPanel = lazy(() => import('./components/SettlementsPanel'));
const CompendiumPanel = lazy(() => import('./components/CompendiumPanel'));
const HowToUse        = lazy(() => import('./components/HowToUse'));
const WorldMap         = lazy(() => import('./components/WorldMap.jsx'));
const AuthModal        = lazy(() => import('./components/AuthModal.jsx'));
const PurchaseModal    = lazy(() => import('./components/PurchaseModal.jsx'));
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
const VerifyEmailPage   = lazy(() => import('./components/auth/VerifyEmailPage.jsx'));

import OnboardingCoach from './components/OnboardingCoach.jsx';
import PostGenCoach from './components/PostGenCoach.jsx';
import DevFlagPanel from './components/dev/DevFlagPanel.jsx';
import DevEmailBanner from './components/dev/DevEmailBanner.jsx';
// P103 / X-2 — Active pricing-moment card (inline, not modal). Renders
// when a moment fires; cooldown enforced by the moments library so it
// can't hammer the user.
const PricingMomentCard = lazy(() => import('./components/pricing/PricingMomentCard.jsx'));

// Top-nav destinations. Gallery sits between Compendium and About. (Workshop /
// "Custom Generate" was removed; the /workshop route redirects to Create.)
// Pricing stays a header hero link (HERO_LINKS), not a primary destination.
const NAV = [
  { id: 'generate',    label: 'Create',      Icon: MapPin },
  { id: 'settlements', label: 'Settlements', Icon: FolderOpen },
  { id: 'map',         label: 'World Map',   Icon: MapIcon },
  { id: 'compendium',  label: 'Compendium',  Icon: BookOpen },
  { id: 'gallery',     label: 'Gallery',     Icon: Images },
  { id: 'howto',       label: 'About',       Icon: Info },
];

// Secondary header links. "Pricing" was pulled from the top bar — subscription
// and credit management now lives in the account-chip dropdown for signed-in
// users (and inline on the Create page once an anonymous visitor hits the cap).
// Kept as an (empty) array so the hero-link render sites still work and future
// links can be added back here.
const HERO_LINKS = [];

function Loading() {
  return (
    <div style={{ padding: 40, textAlign: 'center', color: MUTED, fontFamily: sans }}>
      Loading...
    </div>
  );
}

export default function App() {
  const isMobile = useIsMobile();
  // Path-based routing. `useRoute` resolves window.location → { view, … } and
  // re-renders on Back/Forward + programmatic navigation. `setView` aliases
  // the imperative navigator so the existing setView(viewId) call sites (and
  // the onNavigate prop threaded into every panel) keep working unchanged —
  // they just push a path now. `legacy`/`notFound` drive the URL-upgrade
  // effect below; `params` carries route segments (e.g. /settlements/:id).
  const { view, params, legacy, notFound } = useRoute();
  const setView = navigate;
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showScrollBottom, setShowScrollBottom] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const authTier = useStore(s => s.auth.tier);
  const displayName = useStore(s => s.auth.displayName);
  const _authRole = useStore(s => s.auth.role);
  const authUserId = useStore(s => s.auth.user?.id || null);
  const authLoading = useStore(s => s.auth.loading);
  const isElevated = useStore(s => s.isElevated());
  // Drive the per-view painted background (and the generation-flow override).
  const wizardMode = useStore(s => s.wizardMode);
  const settlement = useStore(s => s.settlement);
  // The standing "buy credits" header chip is retired — credits are bought at
  // the moment of need (the insufficient-credits modal). Flip to restore.
  const showHeaderCredits = false;
  const initAuth = useStore(s => s.initAuth);
  const initOnboarding = useStore(s => s.initOnboarding);
  const onboardingNudge = useStore(s => s.onboardingNudge);
  const clearOnboardingNudge = useStore(s => s.clearOnboardingNudge);
  const purchaseModalOpen = useStore(s => s.purchaseModalOpen);
  const setPurchaseModalOpen = useStore(s => s.setPurchaseModalOpen);
  const setCreditBalance = useStore(s => s.setCreditBalance);
  const creditBalance = useStore(s => s.creditBalance);
  const loadCampaigns = useStore(s => s.loadCampaigns);
  const loadCustomContentFromCloud = useStore(s => s.loadCustomContentFromCloud);
  const migrateLocalCustomContentToCloud = useStore(s => s.migrateLocalCustomContentToCloud);
  const clearCloudCustomContent = useStore(s => s.clearCloudCustomContent);
  const [checkoutToast, setCheckoutToast] = useState(null);

  // Initialize auth session on mount + check post-checkout result + load credits
  useEffect(() => {
    initAuth();
    initOnboarding();
    import('./lib/stripe.js').then(async ({ checkCheckoutResult, fetchCreditBalance }) => {
      // Handle Stripe checkout return
      const result = checkCheckoutResult();
      if (result?.status === 'success') {
        if (result.product === 'single_dossier') {
          const { attachPendingDossierCheckout } = await import('./lib/pendingDossier.js');
          attachPendingDossierCheckout(result.sessionId);
          // The single-dossier flow needs a full landing page (PDF
          // download + sign-up upsell), not just a toast. Replace so the
          // Stripe-return URL isn't a Back-button trap.
          navigate('dossier-success', { replace: true });
        } else {
          const msg = result.product === 'premium'
            ? 'Cartographer activated!'
            : result.product === 'founder_lifetime'
              ? 'Welcome aboard, Founder!'
              : 'Credits added!';
          setCheckoutToast(msg);
          setTimeout(() => setCheckoutToast(null), 4000);
        }
      }
      // Always fetch credit balance on mount
      fetchCreditBalance().then(bal => setCreditBalance(bal));
    });
  }, [initAuth, initOnboarding, setCreditBalance]);

  useEffect(() => {
    if (!authLoading && authTier !== 'anon') {
      loadCampaigns();
    }
  }, [authLoading, authTier, authUserId, loadCampaigns]);

  // Refresh the credit balance on auth transitions (in-session sign-in/out).
  // The mount-only fetch above left a user who signed in after load with a stale
  // balance — blocking AI actions and pushing the purchase modal despite credits.
  useEffect(() => {
    if (authLoading) return;
    import('./lib/stripe.js').then(({ fetchCreditBalance }) =>
      fetchCreditBalance().then(bal => setCreditBalance(bal)));
  }, [authLoading, authUserId, setCreditBalance]);

  // ── Auth guards ─────────────────────────────────────────────────────────
  // Gated routes redirect once the session has resolved. 'auth' views bounce
  // anonymous visitors to /signin carrying ?next= (so they return to the
  // gated page post-login); 'elevated' views bounce non-developers home.
  // Waits on authLoading so we don't act during the initial session check.
  useEffect(() => {
    if (authLoading) return;
    const guard = guardForView(view);
    if (guard === 'auth' && authTier === 'anon') {
      navigate('signin', { replace: true, search: `?next=${encodeURIComponent(viewToPath(view))}` });
    } else if (guard === 'elevated' && !isElevated) {
      navigate('generate', { replace: true });
    }
  }, [view, authTier, isElevated, authLoading]);

  // ── Demoted destinations → redirect to their new homes ────────────────────
  // Custom Generate (the Workshop) was removed; /compare* is now a section in
  // About. The route entries stay (so the URLs still resolve and old links /
  // SEO keep working), but we bounce them to the new surface.
  useEffect(() => {
    if (view === 'workshop') {
      navigate('generate', { replace: true });
    } else if (view.startsWith('compare')) {
      navigate('howto', { replace: true, search: '?tab=compare' });
    }
  }, [view]);

  // ── Canonical-URL upgrade ─────────────────────────────────────────────────
  // Silently rewrite legacy ?view= links, unknown paths, and the bare root to
  // their canonical path (replaceState, no scroll). Non-view query params
  // (gallery slug, flag overrides) are preserved. Converges in one extra
  // render: once the URL is canonical, legacy/notFound clear and it no-ops.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!legacy && !notFound && window.location.pathname !== '/') return;
    const sp = new URLSearchParams(window.location.search);
    sp.delete('view');
    const preserved = sp.toString();
    const canonical = viewToPath(view) + (preserved ? `?${preserved}` : '');
    if (canonical !== window.location.pathname + window.location.search) {
      replacePath(canonical);
    }
  }, [view, legacy, notFound]);

  // ── Document title ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (typeof document !== 'undefined') document.title = titleForView(view);
  }, [view]);

  // ── Cloud sync custom content when user enters premium / elevated state ───
  // Triggers once per tier transition. Migrates local items on first premium
  // sign-in (tracked via a user-scoped localStorage migration flag).
  useEffect(() => {
    if (authLoading) return;
    const canSyncCloud = authTier === 'premium' || isElevated;
    if (canSyncCloud) {
      // First migrate any local items, then load the canonical cloud state
      migrateLocalCustomContentToCloud()
        .then(() => loadCustomContentFromCloud())
        .catch(err => console.error('Custom content cloud sync failed:', err));
    } else if (authTier === 'anon') {
      // Sign-out: drop cloud cache, fall back to local (grandfathered) items
      clearCloudCustomContent();
    }
  }, [authTier, authUserId, isElevated, authLoading, loadCustomContentFromCloud, migrateLocalCustomContentToCloud, clearCloudCustomContent]);

  // Auto-dismiss onboarding nudge after 8s
  useEffect(() => {
    if (!onboardingNudge) return;
    const t = setTimeout(() => clearOnboardingNudge(), 8000);
    return () => clearTimeout(t);
  }, [onboardingNudge, clearOnboardingNudge]);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const doc = document.documentElement;
      setShowScrollTop(y > 400);
      // Show the jump-to-bottom control while there's >400px of page left below.
      setShowScrollBottom((window.innerHeight + y) < (doc.scrollHeight - 400));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    onScroll();
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); };
  }, []);

  // Gate premium-only views
  const handleNavClick = (id) => {
    setView(id);
    // P103 / X-2 — map_clicked pricing moment. Wanderers clicking the
    // World Map nav see a Cartographer-upgrade pitch (cooldown 24h via
    // the moments library; premium users are auto-skipped). Fires on
    // navigation rather than landing because the locked-state Map page
    // (P109/X-7) needs the moment context.
    if (id === 'map' && authTier !== 'anon' && authTier !== 'premium') {
      import('./lib/pricingMoments.js').then(({ triggerPricingMoment }) => {
        const setActive = useStore.getState().setActivePricingMoment;
        triggerPricingMoment('map_clicked', setActive, { tier: authTier });
      }).catch(() => { /* never block navigation */ });
    }
  };

  // Filter nav items based on visibility
  const visibleNav = NAV.filter(item => {
    if (item.id === 'map' && authTier === 'anon') return false;
    return true;
  });

  // Mobile bottom nav: pick the slots from an EXPLICIT priority order rather than
  // slicing the desktop NAV order — otherwise inserting/reordering a NAV item
  // silently evicts whatever falls past the slice (this is how About, then Gallery,
  // got dropped). About lives in the account menu on mobile, so it ranks last.
  const MOBILE_NAV_PRIORITY = ['generate', 'settlements', 'map', 'gallery', 'compendium', 'howto'];
  const mobileNav = MOBILE_NAV_PRIORITY
    .map(id => visibleNav.find(item => item.id === id))
    .filter(Boolean)
    .slice(0, _readFlag('mobileSingleChrome') ? 4 : 5);

  const headerStyle = {
    background: `linear-gradient(to right, ${INK}, ${INK_DEEP})`,
    boxShadow: '0 2px 12px rgba(0,0,0,0.35)',
  };

  // Per-view painted background. On the Create page a generation flow blows
  // up the chosen settlement scene (basic→thorpe, advanced→village,
  // custom→city); see src/config/pageBackgrounds.js + .page-bg in index.css.
  const pageBg = resolveViewBackground({ view, wizardMode, settlement });

  return (
    <>
      <CampaignSyncBanner />
      <div
        className={`parchment-bg page-bg${pageBg.isFlow ? ' is-flow' : ''}`}
        style={{ '--page-bg': pageBg.url, position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}
      >

        {/* ── Mobile header ───────────────────────────────────── */}
        {/*
          The bottom nav holds the 5 primary destinations
          (Create / Settlements / Map / Compendium / How To Use) and has
          no room for the Sign In / Account chip. Without this top bar,
          anonymous mobile users had no entry point into AuthModal.

          Slim by design: a single row, brand left, auth chip right.
          Uses the same ink → ink-deep gradient as the bottom nav so the
          top + bottom chrome read as one unified frame.
        */}
        {/* P123 / A-2 — When `mobileSingleChrome` is on, drop the mobile
            top header entirely. The bottom nav becomes the only chrome;
            the auth chip lives there as a 6th slot (added below in the
            bottom-nav block). Frees ~52px of vertical real estate on
            every mobile screen — meaningful on a 640px viewport. */}
        {isMobile && !_readFlag('mobileSingleChrome') && (
          <header style={{
            ...headerStyle,
            padding: `${SP.sm}px ${SP.md}px`,
            position: 'sticky', top: 0, zIndex: 50,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: SP.sm,
            paddingTop: 'calc(env(safe-area-inset-top) + 8px)',
          }}>
            <button
              type="button"
              onClick={() => setView('generate')}
              aria-label="SettlementForge home"
              style={{
                display: 'flex', alignItems: 'center', gap: SP.xs,
                minHeight: 44,
                background: 'none', border: 'none', padding: `0 ${SP.xs}px`, cursor: 'pointer',
              }}
            >
              <MapIcon size={18} color={GOLD} />
              <span style={{ fontSize: FS.lg, fontWeight: 700, color: GOLD, fontFamily: serif_, letterSpacing: '0.02em', textTransform: 'lowercase' }}>
                SettlementForge
              </span>
            </button>

            <AccountMenu
              compact
              isAnon={authTier === 'anon'}
              displayName={displayName}
              isElevated={isElevated}
              onSignIn={() => setAuthModalOpen(true)}
              onAccount={() => setView('account')}
              onManageSubscription={() => setView('pricing')}
            />
          </header>
        )}

        {/* Mobile hero links — Pricing / Gallery / Compare, promoted from the
            footer so mobile keeps top-level access. Standalone strip (not tied
            to the mobile header, which the single-chrome flag can drop). */}
        {isMobile && HERO_LINKS.length > 0 && (
          <div style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center', gap: SP.lg,
            background: `linear-gradient(to right, ${INK}, ${INK_DEEP})`,
            borderTop: '1px solid rgba(160,118,42,0.2)',
            padding: `${SP.xs}px ${SP.md}px`,
          }}>
            {HERO_LINKS.map(({ id, label }) => {
              const active = id === 'compare' ? view.startsWith('compare') : view === id;
              return (
                <button
                  key={id}
                  onClick={() => setView(id)}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: active ? GOLD : MUTED,
                    fontSize: FS.xs, fontWeight: active ? 700 : 500,
                    fontFamily: sans, letterSpacing: '0.06em', textTransform: 'uppercase',
                    padding: `${SP.xs}px ${SP.sm}px`, minHeight: 36,
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>
        )}

        {/* ── Desktop header ──────────────────────────────────── */}
        {!isMobile && (
          <header style={{ ...headerStyle, padding: `${SP.md}px ${SP.xxl}px`, position: 'sticky', top: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: SP.md }}>
            {/* Brand block — logo + wordmark on top row, italic tagline
                beneath. The HomeHero (which carries the full positioning
                block) is gated to anonymous-only; this small tagline
                keeps the "simulator for DMs" framing visible for
                signed-in users who'd otherwise never see it. */}
            <div style={{ display: 'flex', alignItems: 'center', gap: SP.sm }}>
              <MapIcon size={24} color={GOLD} />
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', lineHeight: 1.1 }}>
                <h1 style={{ margin: 0, fontSize: FS.h1, fontWeight: 700, color: GOLD, fontFamily: serif_, letterSpacing: '0.02em', textTransform: 'lowercase' }}>
                  SettlementForge
                </h1>
                <span style={{
                  fontSize: FS.xs, fontWeight: 700,
                  color: swatch['#E0C080'], fontFamily: sans,
                  letterSpacing: '0.10em', textTransform: 'uppercase',
                  marginTop: 3,
                }}>
                  A simulator for Dungeon Masters
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {/* Secondary hero links — Pricing / Gallery / Compare, promoted
                  from the footer. Plain text links, distinct from the boxed
                  primary nav tabs to their right. */}
              <div style={{ display: 'flex', alignItems: 'center', gap: SP.md }}>
                {HERO_LINKS.map(({ id, label }) => {
                  const active = id === 'compare' ? view.startsWith('compare') : view === id;
                  return (
                    <button
                      key={id}
                      onClick={() => setView(id)}
                      style={{
                        background: 'none', border: 'none', cursor: 'pointer',
                        color: active ? GOLD : MUTED,
                        fontSize: FS.sm, fontWeight: active ? 700 : 500,
                        fontFamily: sans, letterSpacing: '0.04em', textTransform: 'uppercase',
                        padding: `${SP.xs}px 0`, transition: 'color 0.2s',
                      }}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
              {HERO_LINKS.length > 0 && <span style={{ width: 1, height: 20, background: 'rgba(160,118,42,0.3)', margin: `0 ${SP.xs}px` }} />}
              <nav style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                {visibleNav.map(({ id, label }) => {
                  const active = view === id;
                  const locked = false;
                  return (
                    <button
                      key={id}
                      onClick={() => handleNavClick(id)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: SP.xs,
                        padding: `${SP.sm}px ${SP.lg}px`,
                        background: active ? GOLD_BG : 'transparent',
                        border: `1px solid ${active ? GOLD : 'rgba(160,118,42,0.2)'}`,
                        borderRadius: R.md, cursor: 'pointer',
                        color: active ? GOLD : locked ? SECOND : MUTED,
                        fontSize: FS.sm, fontWeight: active ? 600 : 500,
                        fontFamily: sans,
                        letterSpacing: '0.04em', textTransform: 'uppercase',
                        transition: 'all 0.2s',
                        opacity: locked ? 0.6 : 1,
                      }}
                    >
                      {label}
                      {locked && <span style={{ fontSize: FS.xxs, marginLeft: 2 }}>PRO</span>}
                    </button>
                  );
                })}
              </nav>

              {/* Credits button — retired from the header (showHeaderCredits=false);
                  credits are bought at the moment of need. Kept, not deleted. */}
              {showHeaderCredits && authTier !== 'anon' && (
                <button
                  onClick={() => setPurchaseModalOpen(true)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 4,
                    padding: `${SP.sm}px ${SP.lg}px`, marginLeft: SP.xs,
                    background: 'rgba(90,42,138,0.15)',
                    border: '1px solid rgba(160,100,220,0.3)',
                    borderRadius: R.md, cursor: 'pointer',
                    color: swatch['#C8A0F0'],
                    fontSize: FS.sm, fontWeight: 600,
                    fontFamily: sans,
                  }}
                >
                  <Zap size={13} />
                  {isElevated ? '\u221E' : creditBalance}
                </button>
              )}

              {/* Admin button (developer/admin only) */}
              {isElevated && (
                <button
                  onClick={() => setView('admin')}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 4,
                    padding: `${SP.sm}px ${SP.md}px`, marginLeft: SP.xs,
                    background: 'rgba(124,58,237,0.15)',
                    border: '1px solid rgba(124,58,237,0.3)',
                    borderRadius: R.md, cursor: 'pointer',
                    color: swatch['#C8A0F0'],
                    fontSize: FS.sm, fontWeight: 600,
                    fontFamily: sans,
                  }}
                  title="Developer Admin Panel"
                >
                  <Shield size={13} />
                </button>
              )}

              {/* Account identity + menu (Account / Manage subscription & credits) */}
              <AccountMenu
                isAnon={authTier === 'anon'}
                displayName={displayName}
                isElevated={isElevated}
                onSignIn={() => setAuthModalOpen(true)}
                onAccount={() => setView('account')}
                onManageSubscription={() => setView('pricing')}
              />
            </div>
          </header>
        )}

        {/* ── Main content ────────────────────────────────────── */}
        <main style={{ flex: 1, overflowY: 'auto', padding: isMobile ? `${SP.md}px ${SP.md}px 100px` : `${SP.lg}px ${SP.xxl}px` }}>
          {/* Onboarding coach (first-run, generate view). Gated to
              signed-in accounts — anonymous visitors don't get the
              coaching banner. The `onboardingDiet` flag still suppresses
              this spotlight-overlay variant when on. */}
          {view === 'generate' && authTier !== 'anon' && !_readFlag('onboardingDiet') && <OnboardingCoach />}
          <Suspense fallback={<Loading />}>
            {view === 'generate'    && <GenerateWizard isMobile={isMobile} onSignIn={() => setAuthModalOpen(true)} onNavigate={setView} />}
            {view === 'settlements' && <SettlementsPanel onNavigate={setView} routeId={params.id} />}
            {view === 'map'         && <WorldMap onNavigate={setView} />}
            {view === 'compendium'  && <CompendiumPanel standalone />}
            {view === 'howto'       && <HowToUse standalone />}
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
            {view === 'verify-email'   && <VerifyEmailPage />}
          </Suspense>
        </main>

        {/* ── Footer ──────────────────────────────────────────── */}
        <footer style={{
          background: `linear-gradient(to right, ${INK}, ${INK_DEEP})`,
          borderTop: '1px solid rgba(160,118,42,0.25)',
          padding: isMobile ? `${SP.lg}px ${SP.xl}px 88px` : `${SP.lg}px ${SP.xxl}px`,
          textAlign: 'center',
          fontFamily: sans,
          fontSize: FS.sm,
          color: MUTED,
          letterSpacing: '0.04em',
          userSelect: 'none',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: SP.lg,
          flexWrap: 'wrap',
        }}>
          <span>&copy; 2026 SettlementForge</span>
          <span style={{ color: 'rgba(160,118,42,0.3)' }}>|</span>
          <span>All rights reserved</span>
          <span style={{ color: 'rgba(160,118,42,0.3)' }}>|</span>
          <a href="mailto:clausellstokes@aol.com" style={{
            color: MUTED, textDecoration: 'none', display: 'inline-flex',
            alignItems: 'center', gap: 4,
            padding: isMobile ? `0 ${SP.sm}px` : 0,
            minHeight: isMobile ? 44 : undefined,
          }}>
            <Headphones size={11} /> Support
          </a>
        </footer>

        {/* ── Mobile bottom nav ───────────────────────────────── */}
        {isMobile && (
          <div style={{
            position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100,
            background: `linear-gradient(to right, ${INK}, ${INK_DEEP})`,
            borderTop: '1px solid rgba(160,118,42,0.25)',
            display: 'flex',
            boxShadow: '0 -4px 20px rgba(0,0,0,0.4)',
            paddingBottom: 'env(safe-area-inset-bottom)',
          }}>
            {mobileNav.map(({ id, label, Icon }) => {
              const active = view === id;
              return (
                <button
                  key={id}
                  onClick={() => handleNavClick(id)}
                  style={{
                    flex: 1, display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center', gap: SP.xs,
                    padding: `${SP.sm + 2}px ${SP.xs}px`,
                    background: active ? GOLD_BG : 'transparent',
                    border: 'none',
                    borderTop: active ? `2px solid ${GOLD}` : '2px solid transparent',
                    cursor: 'pointer',
                    color: active ? GOLD : SECOND,
                    fontSize: FS.micro, fontWeight: active ? 700 : 500,
                    fontFamily: sans,
                    letterSpacing: '0.04em', textTransform: 'uppercase',
                  }}
                >
                  <Icon size={18} />
                  <span style={{ lineHeight: 1 }}>{label}</span>
                </button>
              );
            })}
            {/* P123 / A-2 — Auth chip as 6th bottom-nav slot. Replaces
                the dropped mobile top header. Icon-only, gold-outline
                for anon, green-fill for signed-in. */}
            {_readFlag('mobileSingleChrome') && (
              <button
                onClick={() => authTier === 'anon' ? setAuthModalOpen(true) : setView('account')}
                aria-label={authTier === 'anon' ? 'Sign in' : 'Account'}
                style={{
                  flex: 1, display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center', gap: SP.xs,
                  padding: `${SP.sm + 2}px ${SP.xs}px`,
                  background: 'transparent',
                  border: 'none',
                  borderTop: view === 'account' ? `2px solid ${GOLD}` : '2px solid transparent',
                  cursor: 'pointer',
                  color: authTier === 'anon' ? GOLD : '#4A7A3A',
                  fontSize: FS.micro, fontWeight: 700,
                  fontFamily: sans,
                  letterSpacing: '0.04em', textTransform: 'uppercase',
                }}
              >
                <User size={18} />
                <span style={{ lineHeight: 1 }}>
                  {authTier === 'anon' ? 'Sign in' : 'Account'}
                </span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* ── Scroll-to-top / scroll-to-bottom stack ────────────── */}
      {(showScrollTop || showScrollBottom) && (() => {
        const btn = {
          width: 38, height: 38, borderRadius: R.lg,
          background: 'rgba(28,20,9,0.82)',
          border: '1px solid rgba(160,118,42,0.5)',
          color: GOLD, fontSize: FS['16'], cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 2px 12px rgba(0,0,0,0.4)',
          backdropFilter: 'blur(4px)',
          transition: 'opacity 0.2s',
        };
        return (
          <div style={{
            position: 'fixed', bottom: isMobile ? 70 : SP.xxl, right: SP.xl, zIndex: 200,
            display: 'flex', flexDirection: 'column', gap: 8,
          }}>
            {showScrollTop && (
              <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                title="Back to top" aria-label="Scroll to top" style={btn}>↑</button>
            )}
            {showScrollBottom && (
              <button onClick={() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' })}
                title="Jump to bottom" aria-label="Scroll to bottom" style={btn}>↓</button>
            )}
          </div>
        );
      })()}

      {/* ── Auth modal ────────────────────────────────────────── */}
      {authModalOpen && (
        <Suspense fallback={null}>
          <AuthModal
            onClose={() => setAuthModalOpen(false)}
            onNavigateAccount={() => { setAuthModalOpen(false); setView('account'); }}
          />
        </Suspense>
      )}

      {/* ── Purchase modal ───────────────────────────────────── */}
      {purchaseModalOpen && (
        <Suspense fallback={null}>
          <PurchaseModal onClose={() => setPurchaseModalOpen(false)} />
        </Suspense>
      )}

      {/* ── Checkout success toast ────────────────────────────── */}
      {checkoutToast && (
        <div style={{
          position: 'fixed', top: SP.xl, left: '50%', transform: 'translateX(-50%)',
          zIndex: 2000, padding: `${SP.md}px ${SP.xxl}px`,
          background: 'linear-gradient(135deg, #2a7a2a, #4a8a4a)',
          color: swatch.white, borderRadius: R.xl,
          fontSize: FS.md, fontWeight: 700, fontFamily: sans,
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          animation: 'fadeIn 0.3s ease-out',
        }}>
          {checkoutToast}
        </div>
      )}

      {/* ── Onboarding nudge toast (post-tour tips + intent toasts) ────
          P118 NOTE: this channel is overloaded — authIntents.SAVE_SETTLEMENT
          uses it to surface "Saved as {name}" after a signup-save flow.
          The onboardingDiet flag should NOT suppress those. Only the
          OnboardingCoach overlay is gated (above). If onboarding tips
          ever become a problem, route them through a separate channel. */}
      {onboardingNudge && (
        <div
          onClick={clearOnboardingNudge}
          style={{
            position: 'fixed',
            bottom: isMobile ? 92 : SP.xxl,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 2000,
            maxWidth: 480,
            padding: `${SP.md}px ${SP.lg}px`,
            background: 'linear-gradient(135deg, #fef9ee 0%, #fdf3d8 100%)',
            border: `1.5px solid ${GOLD}`,
            borderLeft: `5px solid ${GOLD}`,
            color: INK,
            borderRadius: R.lg,
            fontSize: FS.sm,
            fontFamily: sans,
            boxShadow: '0 4px 24px rgba(0,0,0,0.35)',
            cursor: 'pointer',
            lineHeight: 1.5,
          }}
        >
          {onboardingNudge}
        </div>
      )}

      {/* Post-generation onboarding coach — three-step "now what" walkthrough.
          Self-gates on flag + first-settlement + not-dismissed state. */}
      <PostGenCoach />

      {/* DEV-only feature-flag panel. Renders nothing in production. */}
      <DevFlagPanel />

      {/* DEV-only banner that surfaces when the send-email edge function
          reports `reason: "unconfigured"` (i.e. Resend secrets missing on
          Supabase). Silent in prod; one-time warning + dismissible UI in dev
          so a contributor doesn't ship-and-pray on email lifecycle changes. */}
      <DevEmailBanner />

      {/* P103 — Active pricing moment card. Always mounted; renders null
          when no moment is active. Bottom-right fixed-position so it
          doesn't fight the dossier or wizard for vertical space. */}
      <Suspense fallback={null}>
        <PricingMomentCard />
      </Suspense>
    </>
  );
}
