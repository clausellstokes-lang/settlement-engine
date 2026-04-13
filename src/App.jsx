/**
 * App.jsx — Pure layout shell. Zero state declarations.
 *
 * All state lives in the Zustand store (src/store/).
 * This component handles navigation, header/footer chrome,
 * and renders the active view. Each view reads its own
 * state from the store via selectors.
 */
import React, { useState, useEffect, lazy, Suspense } from 'react';
import { MapPin, FolderOpen, Upload, BookOpen, Sparkles, Map as MapIcon, Zap } from 'lucide-react';
import useIsMobile from './hooks/useIsMobile';
import { useStore } from './store/index.js';
import { GOLD, GOLD_B, GOLD_BG, INK, INK_DEEP, MUTED, SECOND, PARCH, BORDER, sans, serif_, SP, R, FS } from './components/theme.js';

// Lazy-loaded views
const GenerateWizard  = lazy(() => import('./components/GenerateWizard.jsx'));
const SettlementsPanel = lazy(() => import('./components/SettlementsPanel'));
const NeighbourSystem = lazy(() => import('./components/NeighbourSystem'));
const CompendiumPanel = lazy(() => import('./components/CompendiumPanel'));
const HowToUse        = lazy(() => import('./components/HowToUse'));
const WorldMap         = lazy(() => import('./components/WorldMap.jsx'));
const AuthModal        = lazy(() => import('./components/AuthModal.jsx'));
const PurchaseModal    = lazy(() => import('./components/PurchaseModal.jsx'));

const NAV = [
  { id: 'generate',    label: 'Create',           Icon: MapPin },
  { id: 'settlements', label: 'Settlements',      Icon: FolderOpen },
  { id: 'map',         label: 'World Map',        Icon: MapIcon },
  { id: 'neighbour',   label: 'Neighbour System', Icon: Upload },
  { id: 'compendium',  label: 'Compendium',       Icon: BookOpen },
  { id: 'howto',       label: 'How To Use',       Icon: Sparkles },
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
  const authLoading = useStore(s => s.auth.loading);
  const canUseNeighbour = useStore(s => s.canUseNeighbour());
  const initAuth = useStore(s => s.initAuth);
  const purchaseModalOpen = useStore(s => s.purchaseModalOpen);
  const setPurchaseModalOpen = useStore(s => s.setPurchaseModalOpen);
  const setCreditBalance = useStore(s => s.setCreditBalance);
  const creditBalance = useStore(s => s.creditBalance);
  const [checkoutToast, setCheckoutToast] = useState(null);

  // Initialize auth session on mount + check post-checkout result + load credits
  useEffect(() => {
    initAuth();
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
  }, [initAuth, setCreditBalance]);

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Gate premium-only views
  const handleNavClick = (id) => {
    if (id === 'neighbour' && !canUseNeighbour) {
      setAuthModalOpen(true);
      return;
    }
    setView(id);
  };

  // Filter nav items based on visibility
  const visibleNav = NAV.filter(item => {
    // Hide map tab for anonymous users
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
                Medieval Settlement
              </h1>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <nav style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                {visibleNav.map(({ id, label, Icon }) => {
                  const active = view === id;
                  const locked = id === 'neighbour' && !canUseNeighbour;
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
                  {creditBalance}
                </button>
              )}

              {/* Account button */}
              <button
                onClick={() => setAuthModalOpen(true)}
                style={{
                  padding: `${SP.sm}px ${SP.lg}px`, marginLeft: SP.xs,
                  background: authTier === 'anon' ? GOLD_BG : 'rgba(42,122,42,0.2)',
                  border: `1px solid ${authTier === 'anon' ? 'rgba(160,118,42,0.3)' : 'rgba(42,122,42,0.4)'}`,
                  borderRadius: R.md, cursor: 'pointer',
                  color: authTier === 'anon' ? GOLD : '#4a8a4a',
                  fontSize: FS.sm, fontWeight: 600,
                  fontFamily: sans,
                  letterSpacing: '0.04em', textTransform: 'uppercase',
                }}
              >
                {authTier === 'anon' ? 'Sign In' : authTier === 'premium' ? 'PRO' : 'Account'}
              </button>
            </div>
          </header>
        )}

        {/* ── Main content ────────────────────────────────────── */}
        <main style={{ flex: 1, overflowY: 'auto', padding: isMobile ? `${SP.md}px ${SP.md}px 100px` : `${SP.lg}px ${SP.xxl}px` }}>
          <Suspense fallback={<Loading />}>
            {view === 'generate'    && <GenerateWizard isMobile={isMobile} />}
            {view === 'settlements' && <SettlementsPanel onNavigate={setView} />}
            {view === 'map'         && <WorldMap />}
            {view === 'neighbour'   && <NeighbourSystem />}
            {view === 'compendium'  && <CompendiumPanel standalone />}
            {view === 'howto'       && <HowToUse standalone />}
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
        }}>
          <span>&copy; 2026 Medieval Settlement Generator</span>
          <span style={{ color: 'rgba(160,118,42,0.3)' }}>|</span>
          <span>All rights reserved</span>
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
          <AuthModal onClose={() => setAuthModalOpen(false)} />
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
    </>
  );
}
