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
import React, { useState, useEffect, lazy, Suspense } from 'react';
import { MapPin, FolderOpen, BookOpen, Sparkles, Map as MapIcon, Zap, User, Shield, Headphones } from 'lucide-react';
import useIsMobile from './hooks/useIsMobile';
import { useStore } from './store/index.js';
import { GOLD, GOLD_B, GOLD_BG, INK, INK_DEEP, MUTED, SECOND, PARCH, BORDER, sans, serif_, SP, R, FS } from './components/theme.js';

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

import OnboardingCoach from './components/OnboardingCoach.jsx';

const NAV = [
  { id: 'generate',    label: 'Create',      Icon: MapPin },
  { id: 'settlements', label: 'Settlements', Icon: FolderOpen },
  { id: 'map',         label: 'World Map',   Icon: MapIcon },
  { id: 'compendium',  label: 'Compendium',  Icon: BookOpen },
  { id: 'howto',       label: 'How To Use',  Icon: Sparkles },
];

function Loading() {
  return (
    <div style={{ padding: 40, textAlign: 'center', color: MUTED, fontFamily: sans }}>
      Loading...
    </div>
  );
}

export default function App() {
  const isMobile = useIsMobile();
  const [view, setView] = useState('generate');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const authTier = useStore(s => s.auth.tier);
  const authRole = useStore(s => s.auth.role);
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
        setCheckoutToast(result.product === 'premium' ? 'Premium activated!' : 'Credits added!');
        setTimeout(() => setCheckoutToast(null), 4000);
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

        {/* ── Desktop header ──────────────────────────────────── */}
        {!isMobile && (
          <header style={{ ...headerStyle, padding: `${SP.md}px ${SP.xxl}px`, position: 'sticky', top: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: SP.md }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: SP.sm }}>
              <MapIcon size={24} color={GOLD} />
              <h1 style={{ margin: 0, fontSize: FS.h1, fontWeight: 700, color: GOLD, fontFamily: serif_, letterSpacing: '0.02em', textTransform: 'lowercase' }}>
                SettlementForge
              </h1>
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
                      {locked && <span style={{ fontSize: 10, marginLeft: 2 }}>PRO</span>}
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
          {view === 'generate' && <OnboardingCoach />}
          <Suspense fallback={<Loading />}>
            {view === 'generate'    && <GenerateWizard isMobile={isMobile} />}
            {view === 'settlements' && <SettlementsPanel onNavigate={setView} />}
            {view === 'map'         && <WorldMap onNavigate={setView} />}
            {view === 'compendium'  && <CompendiumPanel standalone />}
            {view === 'howto'       && <HowToUse standalone />}
            {view === 'account'     && <AccountPage onNavigateAdmin={() => setView('admin')} />}
            {view === 'admin'       && <AdminPanel onBack={() => setView('account')} />}
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
            {visibleNav.slice(0, 5).map(({ id, label, Icon }) => {
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
                    fontSize: 9, fontWeight: active ? 700 : 500,
                    fontFamily: sans,
                    letterSpacing: '0.04em', textTransform: 'uppercase',
                  }}
                >
                  <Icon size={18} />
                  <span style={{ lineHeight: 1 }}>{label}</span>
                </button>
              );
            })}
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
            color: GOLD, fontSize: 16, cursor: 'pointer',
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

      {/* ── Onboarding nudge toast (post-tour tips) ───────────── */}
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
    </>
  );
}
