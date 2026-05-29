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
 *   howto       — How to use guide
 *   account     — Full account page (post-auth)
 *   admin       — Developer admin panel (elevated roles only)
 */
import { useState, useEffect, lazy, Suspense } from 'react';
import { MapPin, FolderOpen, BookOpen, Sparkles, Map as MapIcon, Zap, User, Shield, Headphones, Settings } from 'lucide-react';
import useIsMobile from './hooks/useIsMobile';
import { useStore } from './store/index.js';
import { flag as _readFlag } from './lib/flags.js';
import { GOLD, GOLD_BG, INK, INK_DEEP, MUTED, SECOND, sans, serif_, SP, R, FS } from './components/theme.js';

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
const ComparePage      = lazy(() => import('./components/ComparePage.jsx'));
const SingleDossierSuccessPage = lazy(() => import('./components/SingleDossierSuccessPage.jsx'));
// P107 / CP-2 — Workshop as top-level destination. The component already
// exists at 1,262 LOC; this lift just gives it a route.
const Workshop = lazy(() => import('./components/Workshop.jsx'));

import OnboardingCoach from './components/OnboardingCoach.jsx';
import OnboardingChecklist from './components/onboarding/OnboardingChecklist.jsx';
import PostGenCoach from './components/PostGenCoach.jsx';
import DevFlagPanel from './components/dev/DevFlagPanel.jsx';
import DevEmailBanner from './components/dev/DevEmailBanner.jsx';
// P103 / X-2 — Active pricing-moment card (inline, not modal). Renders
// when a moment fires; cooldown enforced by the moments library so it
// can't hammer the user.
const PricingMomentCard = lazy(() => import('./components/pricing/PricingMomentCard.jsx'));

// P107 / CP-2 — Workshop nav entry. Promoted from a nested Compendium
// tab to a top-level destination. Cartographer-gated; wanderer/free
// users see a locked-state preview with an Upgrade CTA. Flag-gated so
// the nav stays at 5 items while the redesign cooks.
const NAV_BASE = [
  { id: 'generate',    label: 'Create',      Icon: MapPin },
  { id: 'settlements', label: 'Settlements', Icon: FolderOpen },
  { id: 'map',         label: 'World Map',   Icon: MapIcon },
  { id: 'compendium',  label: 'Compendium',  Icon: BookOpen },
  { id: 'howto',       label: 'How To Use',  Icon: Sparkles },
];
const NAV_WITH_WORKSHOP = [
  { id: 'generate',    label: 'Create',      Icon: MapPin },
  { id: 'settlements', label: 'Settlements', Icon: FolderOpen },
  { id: 'workshop',    label: 'Workshop',    Icon: Settings },
  { id: 'map',         label: 'World Map',   Icon: MapIcon },
  { id: 'compendium',  label: 'Compendium',  Icon: BookOpen },
];
// Resolved at module-init time so a flag flip requires a reload (which
// is intended — flag-flipping mid-session leaves the nav inconsistent
// with deep links).
const NAV = _readFlag('workshopNav') ? NAV_WITH_WORKSHOP : NAV_BASE;

function Loading() {
  return (
    <div style={{ padding: 40, textAlign: 'center', color: MUTED, fontFamily: sans }}>
      Loading...
    </div>
  );
}

export default function App() {
  const isMobile = useIsMobile();
  // Lazy initial state honors deep-link params (?view=gallery|pricing)
  // on first load. This avoids the React 19 "setState in effect"
  // warning that an after-mount setView would otherwise trigger.
  const [view, setView] = useState(() => {
    if (typeof window === 'undefined') return 'generate';
    const params = new URLSearchParams(window.location.search);
    const deepView = params.get('view');
    return (deepView === 'gallery' || deepView === 'pricing') ? deepView : 'generate';
  });
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const authTier = useStore(s => s.auth.tier);
  const _authRole = useStore(s => s.auth.role);
  const authLoading = useStore(s => s.auth.loading);
  const isElevated = useStore(s => s.isElevated());
  const initAuth = useStore(s => s.initAuth);
  const initOnboarding = useStore(s => s.initOnboarding);
  const onboardingNudge = useStore(s => s.onboardingNudge);
  const clearOnboardingNudge = useStore(s => s.clearOnboardingNudge);
  const purchaseModalOpen = useStore(s => s.purchaseModalOpen);
  const setPurchaseModalOpen = useStore(s => s.setPurchaseModalOpen);
  const setCreditBalance = useStore(s => s.setCreditBalance);
  const creditBalance = useStore(s => s.creditBalance);
  const loadCustomContentFromCloud = useStore(s => s.loadCustomContentFromCloud);
  const migrateLocalCustomContentToCloud = useStore(s => s.migrateLocalCustomContentToCloud);
  const clearCloudCustomContent = useStore(s => s.clearCloudCustomContent);
  const [checkoutToast, setCheckoutToast] = useState(null);

  // Initialize auth session on mount + check post-checkout result + load credits
  useEffect(() => {
    initAuth();
    initOnboarding();
    import('./lib/stripe.js').then(({ checkCheckoutResult, fetchCreditBalance }) => {
      // Handle Stripe checkout return
      const result = checkCheckoutResult();
      if (result?.status === 'success') {
        if (result.product === 'single_dossier') {
          // The single-dossier flow needs a full landing page (PDF
          // download + sign-up upsell), not just a toast.
          setView('dossier-success');
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

  // ── Cloud sync custom content when user enters premium / elevated state ───
  // Triggers once per tier transition. Migrates local items on first premium
  // sign-in (tracked via the sf_custom_content_migrated localStorage flag).
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
  }, [authTier, isElevated, authLoading, loadCustomContentFromCloud, migrateLocalCustomContentToCloud, clearCloudCustomContent]);

  // Auto-dismiss onboarding nudge after 8s
  useEffect(() => {
    if (!onboardingNudge) return;
    const t = setTimeout(() => clearOnboardingNudge(), 8000);
    return () => clearTimeout(t);
  }, [onboardingNudge, clearOnboardingNudge]);

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
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

  const headerStyle = {
    background: `linear-gradient(to right, ${INK}, ${INK_DEEP})`,
    boxShadow: '0 2px 12px rgba(0,0,0,0.35)',
  };

  return (
    <>
      <div className="parchment-bg" style={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

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
                background: 'none', border: 'none', padding: 0, cursor: 'pointer',
              }}
            >
              <MapIcon size={18} color={GOLD} />
              <span style={{ fontSize: FS.lg, fontWeight: 700, color: GOLD, fontFamily: serif_, letterSpacing: '0.02em', textTransform: 'lowercase' }}>
                SettlementForge
              </span>
            </button>

            <button
              onClick={() => authTier === 'anon' ? setAuthModalOpen(true) : setView('account')}
              style={{
                display: 'flex', alignItems: 'center', gap: SP.xs,
                padding: `${SP.xs + 1}px ${SP.md}px`,
                background: authTier === 'anon' ? GOLD_BG
                  : isElevated ? 'rgba(124,58,237,0.15)'
                  : 'rgba(42,122,42,0.2)',
                border: `1px solid ${authTier === 'anon' ? 'rgba(160,118,42,0.3)'
                  : isElevated ? 'rgba(124,58,237,0.3)'
                  : 'rgba(42,122,42,0.4)'}`,
                borderRadius: R.md, cursor: 'pointer',
                color: authTier === 'anon' ? GOLD
                  : isElevated ? '#c8a0f0'
                  : '#4a8a4a',
                fontSize: FS.xs, fontWeight: 700,
                fontFamily: sans,
                letterSpacing: '0.04em', textTransform: 'uppercase',
              }}
            >
              <User size={12} />
              {authTier === 'anon' ? 'Sign In'
                : isElevated ? 'DEV'
                : authTier === 'premium' ? 'PRO'
                : 'Account'}
            </button>
          </header>
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
                  color: '#e0c080', fontFamily: sans,
                  letterSpacing: '0.10em', textTransform: 'uppercase',
                  marginTop: 3,
                }}>
                  A simulator for Dungeon Masters
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <nav style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                {visibleNav.map(({ id, label, Icon }) => {
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
                      <Icon size={16} />
                      {label}
                      {locked && <span style={{ fontSize: FS.xxs, marginLeft: 2 }}>PRO</span>}
                    </button>
                  );
                })}
              </nav>

              {/* Credits button (visible when signed in and has credits) */}
              {authTier !== 'anon' && (
                <button
                  onClick={() => setPurchaseModalOpen(true)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 4,
                    padding: `${SP.sm}px ${SP.lg}px`, marginLeft: SP.xs,
                    background: 'rgba(90,42,138,0.15)',
                    border: '1px solid rgba(160,100,220,0.3)',
                    borderRadius: R.md, cursor: 'pointer',
                    color: '#c8a0f0',
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
                    color: '#c8a0f0',
                    fontSize: FS.sm, fontWeight: 600,
                    fontFamily: sans,
                  }}
                  title="Developer Admin Panel"
                >
                  <Shield size={13} />
                </button>
              )}

              {/* Account button */}
              <button
                onClick={() => authTier === 'anon' ? setAuthModalOpen(true) : setView('account')}
                style={{
                  display: 'flex', alignItems: 'center', gap: SP.xs,
                  padding: `${SP.sm}px ${SP.lg}px`, marginLeft: SP.xs,
                  background: authTier === 'anon' ? GOLD_BG
                    : isElevated ? 'rgba(124,58,237,0.15)'
                    : 'rgba(42,122,42,0.2)',
                  border: `1px solid ${authTier === 'anon' ? 'rgba(160,118,42,0.3)'
                    : isElevated ? 'rgba(124,58,237,0.3)'
                    : 'rgba(42,122,42,0.4)'}`,
                  borderRadius: R.md, cursor: 'pointer',
                  color: authTier === 'anon' ? GOLD
                    : isElevated ? '#c8a0f0'
                    : '#4a8a4a',
                  fontSize: FS.sm, fontWeight: 600,
                  fontFamily: sans,
                  letterSpacing: '0.04em', textTransform: 'uppercase',
                }}
              >
                <User size={13} />
                {authTier === 'anon' ? 'Sign In'
                  : isElevated ? 'DEV'
                  : authTier === 'premium' ? 'PRO'
                  : 'Account'}
              </button>
            </div>
          </header>
        )}

        {/* ── Main content ────────────────────────────────────── */}
        <main style={{ flex: 1, overflowY: 'auto', padding: isMobile ? `${SP.md}px ${SP.md}px 100px` : `${SP.lg}px ${SP.xxl}px` }}>
          {/* P118 / O-1 — Onboarding diet. When the `onboardingDiet`
              flag is on, suppress the legacy OnboardingCoach (spotlight
              overlay — flagged 2017 SaaS tic by the critique). The
              OnboardingChecklist + first-dossier callouts (P118-pending)
              become the only onboarding surfaces. Flag-off path keeps
              the legacy behavior intact. */}
          {view === 'generate' && !_readFlag('onboardingDiet') && <OnboardingCoach />}
          {/* Audit's onboarding fix: a 4-step task checklist that auto-
              ticks itself as the user completes lifecycle milestones
              (generate → save → canonize → event → export). Mounts on
              the two views where users actually live; auto-hides when
              all steps are complete or the user dismisses it. */}
          {(view === 'generate' || view === 'settlements') && (
            <div style={{ marginBottom: SP.md }}>
              <OnboardingChecklist />
            </div>
          )}
          <Suspense fallback={<Loading />}>
            {view === 'generate'    && <GenerateWizard isMobile={isMobile} onSignIn={() => setAuthModalOpen(true)} />}
            {view === 'settlements' && <SettlementsPanel onNavigate={setView} />}
            {view === 'map'         && <WorldMap onNavigate={setView} />}
            {view === 'compendium'  && <CompendiumPanel standalone />}
            {view === 'howto'       && <HowToUse standalone />}
            {view === 'workshop'    && <Workshop />}
            {view === 'account'     && <AccountPage onNavigateAdmin={() => setView('admin')} />}
            {view === 'admin'       && <AdminPanel onBack={() => setView('account')} />}
            {view === 'pricing'     && <PricingPage onNavigate={setView} />}
            {view === 'gallery'     && <GalleryPage onNavigate={setView} />}
            {view.startsWith('compare') && <ComparePage view={view} onNavigate={setView} />}
            {view === 'dossier-success' && (
              <SingleDossierSuccessPage
                onSignUp={() => { setView('generate'); setAuthModalOpen(true); }}
                onGenerateAnother={() => setView('generate')}
              />
            )}
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
          <button onClick={() => setView('pricing')} style={{
            background: 'none', border: 'none', color: MUTED, cursor: 'pointer',
            fontFamily: sans, fontSize: FS.sm, letterSpacing: '0.04em',
            padding: 0,
          }}>
            Pricing
          </button>
          <span style={{ color: 'rgba(160,118,42,0.3)' }}>|</span>
          <button onClick={() => setView('gallery')} style={{
            background: 'none', border: 'none', color: MUTED, cursor: 'pointer',
            fontFamily: sans, fontSize: FS.sm, letterSpacing: '0.04em',
            padding: 0,
          }}>
            Gallery
          </button>
          <span style={{ color: 'rgba(160,118,42,0.3)' }}>|</span>
          <button onClick={() => setView('compare')} style={{
            background: 'none', border: 'none', color: MUTED, cursor: 'pointer',
            fontFamily: sans, fontSize: FS.sm, letterSpacing: '0.04em',
            padding: 0,
          }}>
            Compare
          </button>
          <span style={{ color: 'rgba(160,118,42,0.3)' }}>|</span>
          <a href="mailto:clausellstokes@aol.com" style={{
            color: MUTED, textDecoration: 'none', display: 'inline-flex',
            alignItems: 'center', gap: 4,
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
            {visibleNav.slice(0, _readFlag('mobileSingleChrome') ? 4 : 5).map(({ id, label, Icon }) => {
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

      {/* ── Scroll-to-top button ──────────────────────────────── */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          title="Back to top"
          aria-label="Scroll to top"
          style={{
            position: 'fixed', bottom: isMobile ? 70 : SP.xxl, right: SP.xl, zIndex: 200,
            width: 38, height: 38, borderRadius: R.lg,
            background: 'rgba(28,20,9,0.82)',
            border: '1px solid rgba(160,118,42,0.5)',
            color: GOLD, fontSize: FS['16'], cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 12px rgba(0,0,0,0.4)',
            backdropFilter: 'blur(4px)',
            transition: 'opacity 0.2s',
          }}
        >
          ↑
        </button>
      )}

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
          color: '#fff', borderRadius: R.xl,
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
