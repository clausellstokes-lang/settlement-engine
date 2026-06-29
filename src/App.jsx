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
import { Map as MapIcon, Zap, Shield } from 'lucide-react';
import useIsMobile from './hooks/useIsMobile';
import { useStore } from './store/index.js';
import { useRoute, navigate, replacePath } from './hooks/useRoute.js';
import { hasStoredAuthToken } from './lib/supabase.js';
import { titleForView, guardForView, viewToPath } from './lib/routes.js';
import { GOLD, GOLD_BG, INK, INK_DEEP, MUTED, PARCH_100, VIOLET, TINT_VIOLET, sans, serif_, SP, R, FS, swatch, CHROME, bottomClearance } from './components/theme.js';
import { t } from './copy/index.js';
import { resolveViewBackground } from './config/pageBackgrounds.js';
import AccountMenu from './components/AccountMenu.jsx';
import FeatureErrorBoundary from './components/FeatureErrorBoundary.jsx';
import HomeLanding from './components/HomeLanding.jsx';
import CampaignSyncBanner from './components/CampaignSyncBanner.jsx';
import Button from './components/primitives/Button.jsx';
import IconButton from './components/primitives/IconButton.jsx';
import { IconsContext } from './components/primitives/IconsContext.js';

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
const SetNewPasswordPage = lazy(() => import('./components/auth/SetNewPasswordPage.jsx'));
const VerifyEmailPage   = lazy(() => import('./components/auth/VerifyEmailPage.jsx'));
const ConfirmEmailPage  = lazy(() => import('./components/auth/ConfirmEmailPage.jsx'));

import PostGenCoach from './components/PostGenCoach.jsx';
import DevFlagPanel from './components/dev/DevFlagPanel.jsx';
import DevEmailBanner from './components/dev/DevEmailBanner.jsx';
// Active pricing-moment card — inline, not a modal. Renders when a moment
// fires; cooldown enforced by the moments library so it can't hammer the user.
const PricingMomentCard = lazy(() => import('./components/pricing/PricingMomentCard.jsx'));

// Top-nav destinations. Gallery sits between Compendium and About. (Workshop /
// "Custom Generate" was removed; the /workshop route redirects to Create.)
//
// The Realm IA move:
//   - `settlements` keeps its view id + /settlements path for back-compat, but the
//     LABEL is now "Library".
//   - `realm` is the new destination — the simulation's IA home. It hosts the
//     World Map (+ Pulse / Chronicle / Pantheon via the Realm Inspector). The old
//     `map` view redirects into it; the Realm body IS the World Map workspace.
//     Visible to anon (a locked-state preview), no longer hidden.
const NAV = [
  { id: 'home',        label: 'Welcome' },
  { id: 'generate',    label: 'Create' },
  { id: 'settlements', label: 'Library' },
  { id: 'realm',       label: 'Realm' },
  { id: 'compendium',  label: 'Compendium' },
  { id: 'gallery',     label: 'Gallery' },
  { id: 'howto',       label: 'About' },
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
  // Auth-modal visibility now lives on the store (uiSlice) so app-wide nudges
  // with no prop path to App (PricingMomentCard signup moments) can open
  // sign-in directly. Same boolean setter shape the local useState had, so
  // every existing call site (onSignIn, header avatar, etc.) is unchanged.
  const authModalOpen = useStore(s => s.authModalOpen);
  const setAuthModalOpen = useStore(s => s.setAuthModalOpen);

  const authTier = useStore(s => s.auth.tier);
  const displayName = useStore(s => s.auth.displayName);
  const _authRole = useStore(s => s.auth.role);
  const authUserId = useStore(s => s.auth.user?.id || null);
  const authLoading = useStore(s => s.auth.loading);
  const isElevated = useStore(s => s.isElevated());
  // Drive the per-view painted background (and the generation-flow override).
  const wizardMode = useStore(s => s.wizardMode);
  const settlement = useStore(s => s.settlement);
  const initAuth = useStore(s => s.initAuth);
  const authSignOut = useStore(s => s.authSignOut);
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

  // Bare-root front door. The bare root (settlementforge.com) canonicalizes to
  // /home — the Welcome page — for EVERYONE: logged-out visitors get the
  // marketing CTAs, signed-in members get the member CTAs (Explore Premium +
  // learn-more) on the same Welcome page. Deep links elsewhere are respected;
  // only the bare root is rewritten. The guard still waits for a saved session
  // to restore so a returning member never flashes a mismatched view first.
  useEffect(() => {
    // No stored auth token at all ⇒ definitely logged out ⇒ route immediately,
    // with no wait and no landing-then-app flash. Otherwise wait for the saved
    // session to restore so a returning member never flashes the landing.
    if (hasStoredAuthToken() && authLoading) return;
    try {
      const path = window.location.pathname;
      const atRoot = path === '/' || path === '';
      if (atRoot) replacePath('/home');              // bare root → the Welcome page (all visitors)
    } catch { /* private mode → fall through to the default */ }
  }, [authLoading, authTier, view]);

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
  //
  // The World Map moved INTO the Realm hub. `/map` (and any
  // `?view=map`, which resolveLocation already aliases to `realm`) redirects to
  // `/realm` so legacy links + bookmarks never 404. The Realm body IS the World
  // Map workspace, so the destination is identical content under the new URL.
  useEffect(() => {
    if (view === 'workshop') {
      navigate('generate', { replace: true });
    } else if (view === 'map') {
      navigate('realm', { replace: true });
    } else if (view.startsWith('compare')) {
      navigate('howto', { replace: true, search: '?tab=compare' });
    }
  }, [view]);

  // ── Canonical-URL upgrade ─────────────────────────────────────────────────
  // Silently rewrite legacy ?view= links and unknown paths to their canonical
  // path (replaceState, no scroll). Non-view query params (gallery slug, flag
  // overrides) are preserved. Converges in one extra render: once the URL is
  // canonical, legacy/notFound clear and it no-ops.
  //
  // The bare root ('/') is DELIBERATELY left to the front-door effect above,
  // which owns it (and rewrites it to /home, not the default /create). Earlier
  // this effect also claimed '/', so which rewrite won depended on effect
  // DECLARATION ORDER — front-door first → /home, this first → a /create flash.
  // Excluding '/' here makes the front door the single, order-independent owner
  // of the bare root.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!legacy && !notFound) return;
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
    // Cancellation guard: rapid tier transitions / remounts can start a second
    // migrate→load chain before the first resolves, interleaving migrate and load
    // so the displayed custom content reflects a stale cloud snapshot (or migrate
    // runs twice). On cleanup we set ignore=true so a superseded chain bails before
    // its load call. Matches the cancellation pattern in useGalleryPageState.
    let ignore = false;
    const canSyncCloud = authTier === 'premium' || isElevated;
    if (canSyncCloud) {
      // First migrate any local items, then load the canonical cloud state
      migrateLocalCustomContentToCloud()
        .then(() => { if (!ignore) return loadCustomContentFromCloud(); })
        .catch(err => { if (!ignore) console.error('Custom content cloud sync failed:', err); });
    } else if (authTier === 'anon') {
      // Sign-out: drop cloud cache, fall back to local (grandfathered) items
      clearCloudCustomContent();
    }
    return () => { ignore = true; };
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
    // The Realm nav. Free wanderers clicking Realm see a
    // Cartographer-upgrade pitch (cooldown 24h; premium auto-skipped). Anon are
    // NOT skipped here at click time — the Realm Dashboard fires the richer
    // `map_realm_teaser` moment on landing for both anon and free, so we only
    // fire the lighter `map_clicked` for free users on the click itself.
    if (id === 'realm' && authTier !== 'anon' && authTier !== 'premium') {
      import('./lib/pricingMoments.js').then(({ triggerPricingMoment }) => {
        const setActive = useStore.getState().setActivePricingMoment;
        triggerPricingMoment('map_clicked', setActive, { tier: authTier });
      }).catch(() => { /* never block navigation */ });
    }
  };

  // Sign out from the account menu: clear the session + per-account state
  // (the authSignOut store action calls supabase.auth.signOut() then
  // clearAuth(), which also drops campaigns/saves/custom content), then route
  // home so the user never lingers on an auth-guarded page (e.g. /account).
  const handleSignOut = async () => {
    await authSignOut();
    setView('generate');
  };

  // Filter nav items based on visibility. The Realm is REACHABLE
  // for anon (a locked-state preview), no longer hidden; the old `map`-for-anon
  // hide is gone. Nothing is filtered today, but the seam stays for future gates.
  // The Welcome tab fronts the logged-out landing; signed-in members go straight to
  // Create, so it is dropped from their nav (the landing is logged-out-only).
  // Welcome stays in the nav for everyone, members included; the page adapts its
  // CTAs by auth state (Sign in / free-to-try vs Explore Premium / learn-more)
  // rather than being hidden. Members still LAND on Create from the bare root —
  // the front-door effect gates only `/`, not an explicit /home visit.
  const visibleNav = NAV;

  // Dedicated auth surfaces (/signin · /register · /reset-password ·
  // /verify-email · /confirm-email) render full-bleed: the persistent top nav
  // and the mobile bottom nav are suppressed so the AuthPanel owns the whole
  // frame. Each auth page carries its own back/exit affordance, so no
  // navigation is stranded.
  const isAuthRoute = view === 'signin' || view === 'register' || view === 'reset-password' || view === 'set-new-password' || view === 'verify-email' || view === 'confirm-email';

  // Mobile bottom nav: pick the slots from an EXPLICIT priority order rather than
  // slicing the desktop NAV order, otherwise inserting/reordering a NAV item
  // silently evicts whatever falls past the slice (this is how About, then Gallery,
  // got dropped). About lives in the account menu on mobile, so it ranks last.
  // The Realm (World Map) is omitted on mobile: the map workspace is too
  // constrained for small screens. It stays in the desktop nav, and the /map
  // and /realm routes still resolve from deep links.
  const MOBILE_NAV_PRIORITY = ['generate', 'settlements', 'gallery', 'compendium', 'howto'];
  const mobileNav = MOBILE_NAV_PRIORITY
    .map(id => visibleNav.find(item => item.id === id))
    .filter(Boolean)
    .slice(0, 5);

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
        // Painted clean views (settlements/gallery/compendium/pricing/account/
        // admin/howto) get `.page-painted scrim-<profile>`: a flat-cream header
        // band fading into the per-image painting (see index.css + the
        // scrimProfile from pageBackgrounds.js). `clean` stays for back-compat;
        // `paintedBelowHeader` is the new truth (false for home's dark hero).
        className={[
          'parchment-bg',
          pageBg.clean ? '' : 'page-bg',
          pageBg.isFlow ? 'is-flow' : '',
          pageBg.paintedBelowHeader ? `page-painted scrim-${pageBg.scrimProfile}` : '',
        ].filter(Boolean).join(' ')}
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
        {isMobile && !isAuthRoute && (
          <header style={{
            ...headerStyle,
            padding: `${SP.sm}px ${SP.md}px`,
            position: 'sticky', top: 0, zIndex: 50,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: SP.sm,
            paddingTop: 'calc(env(safe-area-inset-top) + 8px)',
          }}>
            <Button
              variant="ghost"
              onClick={() => setView('generate')}
              aria-label="SettlementForge home"
              icon={<MapIcon size={18} color={GOLD} />}
              style={{
                gap: SP.xs,
                minHeight: 44,
                padding: `0 ${SP.xs}px`,
              }}
            >
              <span aria-hidden="true" style={{ fontSize: FS.lg, fontWeight: 800, color: GOLD, fontFamily: serif_, letterSpacing: '0.01em' }}>
                <span style={{ fontSize: '1.28em' }}>S</span>ettlement<span style={{ fontSize: '1.28em' }}>F</span>orge
              </span>
            </Button>

            <AccountMenu
              compact
              isAnon={authTier === 'anon'}
              displayName={displayName}
              isElevated={isElevated}
              creditBalance={authTier !== 'anon' ? creditBalance : null}
              onSignIn={() => setAuthModalOpen(true)}
              onAccount={() => setView('account')}
              onManageSubscription={() => setView('pricing')}
              onSignOut={handleSignOut}
            />
          </header>
        )}

        {/* ── Desktop header ──────────────────────────────────── */}
        {!isMobile && !isAuthRoute && (
          <header style={{ ...headerStyle, padding: `${SP.md}px ${SP.xxl}px`, position: 'sticky', top: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: SP.md }}>
            {/* Brand block — the wordmark stands alone (the "simulator for DMs"
                subtitle was retired). "SettlementForge" reads as a single bold
                serif word with the two capitals (S, F) set a step larger, a
                quiet two-cap emphasis that keeps the whole word legible. The
                aria-label restores the plain name for assistive tech, since the
                per-letter spans would otherwise read as fragments. */}
            {/* The wordmark doubles as the home link (matches the mobile header's
                brand button) — clicking it returns to Create. Rendered as a button
                for keyboard + AT access; the h1 keeps the heading semantics with
                its per-letter spans hidden from AT (the button's aria-label reads
                the plain name). */}
            <div style={{ display: 'flex', alignItems: 'center', gap: SP.sm }}>
              <button
                type="button"
                onClick={() => setView('generate')}
                aria-label="SettlementForge home"
                style={{ background: 'none', border: 'none', padding: 0, margin: 0, cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              >
                <h1
                  aria-hidden="true"
                  style={{ margin: 0, fontSize: FS.h1, fontWeight: 800, color: GOLD, fontFamily: serif_, letterSpacing: '0.01em', lineHeight: 1.1 }}
                >
                  <span style={{ fontSize: '1.32em', fontWeight: 800 }}>S</span>
                  <span>ettlement</span>
                  <span style={{ fontSize: '1.32em', fontWeight: 800 }}>F</span>
                  <span>orge</span>
                </h1>
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: SP.md }}>
              <nav style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                {visibleNav.map(({ id, label }) => {
                  const active = view === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => handleNavClick(id)}
                      aria-current={active ? 'page' : undefined}
                      style={{
                        display: 'flex', alignItems: 'center', gap: SP.xs,
                        padding: `${SP.sm}px ${SP.lg}px`,
                        // Active tab is a wayfinding marker, not a CTA (P8): a
                        // gold underline + weight (the exact two-channel idiom
                        // the mobile bottom-nav and the auth segmented tab
                        // already use), NOT the former filled-gold cartouche.
                        // That filled pill tied with the gold "Sign In" chip as
                        // a second equally-loud gold block, leaving the anon
                        // region with no single focal point. The underline says
                        // "you are here" without competing as a button — so the
                        // Sign In chip is the only filled-gold element here.
                        background: 'transparent',
                        border: 'none',
                        borderBottom: active ? `2px solid ${GOLD}` : '2px solid transparent',
                        borderRadius: 0, cursor: 'pointer',
                        color: active ? GOLD : PARCH_100,
                        fontSize: FS.sm, fontWeight: active ? 700 : 500,
                        fontFamily: sans,
                        // Title-case the links (Create / Library / Realm): the
                        // labels are already correctly-cased strings; only the
                        // CSS was upcasing them. Voice + template both want
                        // title-case here, not the shouted CREATE/LIBRARY.
                        letterSpacing: '0.04em', textTransform: 'none',
                        transition: 'all 0.2s',
                      }}
                    >
                      {label}
                    </button>
                  );
                })}
              </nav>

              {/* Admin button (developer/admin only) */}
              {isElevated && (
                <IconButton
                  Icon={Shield}
                  label="Admin panel"
                  title="Developer Admin Panel"
                  onClick={() => setView('admin')}
                  size="md"
                />
              )}

              {/* Persistent credit badge. The credit balance fetched at mount
                  (and refreshed on auth transitions) now reads at a glance from
                  the right cluster, not only after opening the account menu.
                  Additive: the green name-chip identity and the ghost Upgrade
                  both stay. Two channels (P7): the violet count plus the
                  "credits" word carry the meaning, so it never relies on the
                  violet colour alone, and there is no glyph since icons stay off
                  outside the Realm map. Signed-in only: an anonymous visitor has
                  no balance to read. Routes to the same subscription-and-credits
                  surface the account menu links to. */}
              {authTier !== 'anon' && (
                <button
                  type="button"
                  onClick={() => setView('pricing')}
                  title="Credits remaining"
                  aria-label={`${creditBalance} credits remaining`}
                  style={{
                    display: 'flex', alignItems: 'center', gap: SP.xs,
                    height: 32, padding: `0 ${SP.md}px`,
                    borderRadius: 999,
                    background: TINT_VIOLET,
                    border: `1px solid ${VIOLET}`,
                    color: VIOLET,
                    fontSize: FS.sm, fontFamily: sans,
                    letterSpacing: '0.02em', cursor: 'pointer',
                    transition: 'all 0.2s', whiteSpace: 'nowrap',
                  }}
                >
                  <span style={{ fontWeight: 700 }}>{creditBalance}</span>
                  <span style={{ fontWeight: 500, opacity: 0.85 }}>credits</span>
                </button>
              )}

              {/* Persistent tier chip. Anon → "Sign in" (the
                  AccountMenu below). Free → an "Upgrade" chip routing to the
                  canonical premium-value surface. Premium → the account chip
                  (no upgrade chip). */}
              {/* Persistent upgrade path, demoted to ghost (P4): the richer
                  upsell already lives on Pricing, the footer, the Realm
                  locked-state, and the PricingMomentCard, so a mid-emphasis
                  secondary pill here co-competed with the identity chip and
                  split the right cluster's focal point. As a ghost text+icon
                  control it stays discoverable without out-shouting the
                  AccountMenu chip, which is the region's single focal control. */}
              {authTier === 'free' && (
                <Button
                  variant="ghost"
                  size="md"
                  icon={<Zap size={13} />}
                  onClick={() => setView('pricing')}
                  style={{ color: PARCH_100, letterSpacing: '0.04em', textTransform: 'uppercase' }}
                >
                  Upgrade
                </Button>
              )}

              {/* Account identity + menu (Account / Manage subscription & credits) */}
              <AccountMenu
                isAnon={authTier === 'anon'}
                displayName={displayName}
                isElevated={isElevated}
                onSignIn={() => setAuthModalOpen(true)}
                onAccount={() => setView('account')}
                onManageSubscription={() => setView('pricing')}
                onSignOut={handleSignOut}
              />
            </div>
          </header>
        )}

        {/* ── Main content ────────────────────────────────────── */}
        {/* `main` must NOT establish its own scroll container. The app shell is
            sized with `minHeight: 100vh` (not a fixed height), so `flex: 1` never
            caps `main`'s height — it grows with content and the WINDOW scrolls.
            A stray `overflow-y: auto` here therefore never engaged as a scroller,
            but it still made `main` the nearest scroll-clipping ancestor, which
            silently broke `position: sticky` for descendants (e.g. the Create
            view's WizardOutputToolbar): the bar resolved its offset against a box
            that never scrolled and so scrolled away with the page instead of
            pinning. Dropping `overflow-y: auto` (default `visible`) keeps the
            window as the sole scroller and lets descendant sticky bars pin. The
            companion `scroll-padding-top` that keeps anchored / focus scrolls
            clear of the pinned chrome lives on the real scroller (the document
            element), set by the view that owns sticky chrome. */}
        <main style={{ flex: 1, padding: isMobile ? `${SP.md}px ${SP.md}px ${CHROME.mainPadMobile}px` : `${SP.lg}px ${SP.xxl}px` }}>
          {/* The pre-generation OnboardingCoach spotlight-overlay was deleted
              along with its forever-off `onboardingDiet` flag-twin: the Checklist
              + first-dossier callouts carry first-run coaching, and PostGenCoach
              (mounted below) is the active post-generation coach. The companion
              onboarding nudge toast survives near the bottom of the tree — it
              doubles as the SAVE_SETTLEMENT intent toast and was never the coach. */}
          {/* A lazy chunk-load failure (stale deploy, dropped connection) throws
              from inside Suspense. Without a boundary here that throw escapes to
              the root and white-screens the whole app. Wrap the routed Suspense
              so a failed view degrades to a recoverable card — reload pulls the
              fresh chunk, and the resetKeys={[view]} clears the error the moment
              the user navigates elsewhere. The boundary sits OUTSIDE Suspense so
              it also catches a synchronous render throw from the resolved view. */}
          <FeatureErrorBoundary
            label="App.route"
            kind="react.render.route"
            resetKeys={[view]}
            fallback={(error, retry) => (
              <div
                role="alert"
                style={{ margin: SP.md, padding: SP.lg, border: `1px solid ${swatch.danger}`, borderRadius: R.lg, background: swatch.dangerBg, color: swatch.danger, fontSize: FS.sm, fontFamily: sans }}
              >
                <div style={{ fontWeight: 700, marginBottom: SP.xs }}>This page couldn&rsquo;t be loaded.</div>
                <div style={{ marginBottom: SP.sm, color: swatch.mutedBrown }}>
                  This can happen after an update. Reload to pull the latest, or try again.
                </div>
                <div style={{ display: 'flex', gap: SP.sm }}>
                  <Button variant="danger" size="sm" onClick={() => window.location.reload()} style={{ minHeight: 44 }}>
                    Reload
                  </Button>
                  <Button variant="ghost" size="sm" onClick={retry} style={{ minHeight: 44 }}>
                    Try again
                  </Button>
                </div>
              </div>
            )}
          >
          <Suspense fallback={<Loading />}>
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
          </Suspense>
          </FeatureErrorBoundary>
        </main>

        {/* ── Footer ──────────────────────────────────────────────
            Pricing + Contact only; About / Compendium / Gallery already live in
            the header nav, so the footer stays lean. Pricing routes to the
            canonical premium-value surface (the same target as the header tier
            chip + the Realm locked-state), so there is ONE "What the Realm
            unlocks" destination. */}
        <footer style={{
          background: `linear-gradient(to right, ${INK}, ${INK_DEEP})`,
          borderTop: '1px solid rgba(160,118,42,0.25)',
          padding: isMobile ? `${SP.lg}px ${SP.xl}px ${bottomClearance(CHROME.footerPadMobile)}` : `${SP.lg}px ${SP.xxl}px`,
          textAlign: 'center',
          fontFamily: sans,
          fontSize: FS.sm,
          color: PARCH_100,
          letterSpacing: '0.04em',
          userSelect: 'none',
          display: 'flex',
          flexDirection: 'column',
          gap: SP.sm,
          alignItems: 'center',
        }}>
          <nav aria-label="Footer" style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            gap: SP.md, flexWrap: 'wrap',
          }}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setView('pricing')}
              style={{
                color: PARCH_100, fontFamily: sans, fontSize: FS.sm, fontWeight: 500,
                letterSpacing: '0.04em', minHeight: isMobile ? 44 : undefined,
              }}
            >
              {t('footer.pricing')}
            </Button>
            <span aria-hidden="true" style={{ color: 'rgba(244,234,208,0.4)' }}>|</span>
            <a href="mailto:settlementforge@gmail.com" style={{
              color: PARCH_100, textDecoration: 'none', display: 'inline-flex',
              alignItems: 'center', gap: 4,
              padding: isMobile ? `0 ${SP.sm}px` : 0,
              minHeight: isMobile ? 44 : undefined,
            }}>
              {t('footer.contact')}
            </a>
          </nav>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: SP.md, flexWrap: 'wrap' }}>
            <span>{t('footer.copyright', { year: 2026 })}</span>
            <span style={{ fontStyle: 'italic' }}>{t('footer.antiAi')}</span>
          </div>
        </footer>

        {/* ── Mobile bottom nav ───────────────────────────────── */}
        {isMobile && !isAuthRoute && (
          <div style={{
            position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100,
            background: `linear-gradient(to right, ${INK}, ${INK_DEEP})`,
            borderTop: '1px solid rgba(160,118,42,0.25)',
            display: 'flex',
            boxShadow: '0 -4px 20px rgba(0,0,0,0.4)',
            paddingBottom: 'env(safe-area-inset-bottom)',
          }}>
            {mobileNav.map(({ id, label }) => {
              const active = view === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => handleNavClick(id)}
                  aria-current={active ? 'page' : undefined}
                  style={{
                    // `minWidth: 0` lets a flex child shrink below its content
                    // width so the longest label ('COMPENDIUM', 10px uppercase)
                    // can ellipsis-fit at 375px instead of forcing the row wider
                    // and clipping. Five equal columns share the row evenly.
                    flex: 1, minWidth: 0,
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center', gap: SP.xs,
                    // Clear the 44px touch-target floor (Apple HIG / Material).
                    // The single-line uppercase label only filled ~32px tall, so
                    // these primary nav tabs were below the floor on mobile.
                    minHeight: 44,
                    // Trim the horizontal padding to 2px so the five labels get
                    // the most width to fit before any ellipsis kicks in.
                    padding: `${SP.sm + 2}px 2px`,
                    background: active ? GOLD_BG : 'transparent',
                    border: 'none',
                    borderTop: active ? `2px solid ${GOLD}` : '2px solid transparent',
                    cursor: 'pointer',
                    color: active ? GOLD : PARCH_100,
                    fontSize: FS.xxs, fontWeight: active ? 700 : 500,
                    fontFamily: sans,
                    // Tighter tracking than the 0.04em elsewhere: at 10px the
                    // extra letter-spacing was the difference between fitting and
                    // clipping the longest label.
                    letterSpacing: '0.02em', textTransform: 'uppercase',
                  }}
                >
                  {/* maxWidth:100% + overflow ellipsis keeps the longest label
                      from clipping mid-glyph: it shrinks-to-fit, then truncates
                      with a guaranteed-readable tail rather than a hard cut. */}
                  <span style={{
                    lineHeight: 1, maxWidth: '100%',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>{label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Scroll-to-top / scroll-to-bottom stack ────────────── */}
      {(showScrollTop || showScrollBottom) && (() => {
        const btn = {
          width: 38, height: 38, minHeight: 38, borderRadius: R.lg,
          background: 'rgba(28,20,9,0.82)',
          border: '1px solid rgba(160,118,42,0.5)',
          color: GOLD, fontSize: FS['16'],
          boxShadow: '0 2px 12px rgba(0,0,0,0.4)',
          backdropFilter: 'blur(4px)',
          transition: 'opacity 0.2s',
        };
        return (
          <div style={{
            position: 'fixed', bottom: isMobile ? bottomClearance(CHROME.fabLift) : SP.xxl, right: SP.xl, zIndex: 200,
            display: 'flex', flexDirection: 'column', gap: 8,
          }}>
            {showScrollTop && (
              <Button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                title="Back to top" aria-label="Scroll to top" style={btn}>↑</Button>
            )}
            {showScrollBottom && (
              <Button onClick={() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' })}
                title="Jump to bottom" aria-label="Scroll to bottom" style={btn}>↓</Button>
            )}
          </div>
        );
      })()}

      {/* ── Auth modal ──────────────────────────────────────────
          Hard-gated to signed-out visitors (P10): the modal is the sign-in
          door, and a signup/unlock PricingMomentCard can fire setAuthModalOpen
          for an already-signed-in user. Rather than surface a stale account
          card that duplicates the AccountMenu's actions (two chromes for one
          job), an already-authed open is a no-op — AccountMenu + /account are
          the single account-management entry point. */}
      {authModalOpen && authTier === 'anon' && (
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
          color: swatch.white, borderRadius: R.xl,
          fontSize: FS.md, fontWeight: 700, fontFamily: sans,
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          animation: 'fadeIn 0.3s ease-out',
        }}>
          {checkoutToast}
        </div>
      )}

      {/* ── Onboarding nudge toast (post-tour tips + intent toasts) ────
          NOTE: this channel is overloaded — authIntents.SAVE_SETTLEMENT
          uses it to surface "Saved as {name}" after a signup-save flow, so it
          must survive even though the OnboardingCoach overlay it once partnered
          was deleted. If onboarding tips ever become a problem, route them
          through a separate channel. */}
      {onboardingNudge && (
        <div
          role="button"
          tabIndex={0}
          onClick={clearOnboardingNudge}
          // preventDefault on the activation keys: a role="button" element is
          // not a native button, so Space would otherwise scroll the page (and
          // Enter could submit an ancestor form) in addition to dismissing.
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); clearOnboardingNudge(); } }}
          style={{
            position: 'fixed',
            bottom: isMobile ? bottomClearance(CHROME.nudgeLift) : SP.xxl,
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

      {/* Active pricing moment card. Renders null when no moment is active.
          Bottom-right fixed-position so it doesn't fight the dossier or wizard
          for vertical space. Suppressed on the Pricing view: an upgrade nudge
          floating over the page that already IS the upgrade surface is
          redundant chrome (and on mobile it stacked atop the pricing CTAs). */}
      {view !== 'pricing' && (
        <Suspense fallback={null}>
          <PricingMomentCard />
        </Suspense>
      )}
    </>
  );
}
