/**
 * App.jsx — Pure layout shell. Zero engine/domain state declarations.
 *
 * All state lives in the Zustand store (src/store/). This component handles
 * navigation, header/footer chrome, and renders the active view via AppViews.
 * Each view reads its own state from the store via selectors.
 *
 * Views:
 *   home        — Welcome landing (marketing front door)
 *   generate    — Settlement creation wizard
 *   settlements — Saved settlements library
 *   realm       — The Realm hub (World Map + Pulse / Chronicle / Pantheon)
 *   compendium  — Rules & data compendium
 *   howto       — About page (how-to guide + comparisons)
 *   gallery     — Community gallery
 *   terms/privacy/refunds — Legal / trust pages
 *   account     — Full account page (post-auth)
 *   admin       — Developer admin panel (elevated roles only)
 */
import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { Zap, Shield, X } from 'lucide-react';
import HouseDevice from './components/brand/HouseDevice.jsx';
import useIsMobile from './hooks/useIsMobile';
import { useStore } from './store/index.js';
import { initOutbox } from './store/campaignSliceShared.js';
import { useRoute, navigate, replacePath } from './hooks/useRoute.js';
import { useFocusOnViewChange } from './hooks/useFocusOnViewChange.js';
import { guardForView, viewToPath, NAV } from './lib/routes.js';
import { applyDocumentHead } from './lib/seo.js';
import { supportMailto } from './copy/support.js';
// The eager shell reads ONLY footer.* copy — copy/footer.js carries that one
// namespace with an identical t(). Importing copy/index.js here would drag the
// whole en.js registry into the first-paint entry closure (byte budget).
import { t } from './copy/footer.js';
import {
  GOLD, GOLD_BG, INK, INK_DEEP, PARCH_100, BORDER, BODY, SLATE, SLATE_BG, sans, serif_, SP, R, FS, swatch,
} from './components/theme.js';
import { resolveViewBackground } from './config/pageBackgrounds.js';
import AccountMenu from './components/AccountMenu.jsx';
import FeatureErrorBoundary from './components/FeatureErrorBoundary.jsx';
import Button from './components/primitives/Button.jsx';
import IconButton from './components/primitives/IconButton.jsx';
// The route→component registry + shared Loading live in AppViews (extracted so
// the shell stays legible; the view table has one home).
import { AppViews, Loading } from './AppViews.jsx';

// Modals stay in the shell (not view-switched): they overlay whatever view is up.
const AuthModal     = lazy(() => import('./components/AuthModal.jsx'));
const PurchaseModal = lazy(() => import('./components/PurchaseModal.jsx'));
// The cloud-sync banner renders null unless a persist actually fails, so it is
// never first-paint critical — lazy so its code + icons stay off the entry's
// static closure (first-paint byte budget).
const CampaignSyncBanner = lazy(() => import('./components/CampaignSyncBanner.jsx'));

// The post-generate coach hosts the guidance registry's single wizard-postgen
// whisper (the "what's next" moves). Self-gates on a settlement + the unified
// sf:guidance dismissal; lazy keeps it off first paint (byte budget).
const PostGenCoach = lazy(() => import('./components/PostGenCoach.jsx'));

// The two DEV panels are always-mounted but NOT first-paint critical (they
// render null in production). Lazy so their code + icon references stay off the
// entry's static closure (first-paint byte budget — tests/build/vendorPdfLazy.test.js).
const DevFlagPanel   = lazy(() => import('./components/dev/DevFlagPanel.jsx'));
const DevEmailBanner = lazy(() => import('./components/dev/DevEmailBanner.jsx'));
// Active pricing-moment card — inline, not a modal. Renders when a moment fires;
// cooldown enforced by the moments library so it can't hammer the user.
const PricingMomentCard = lazy(() => import('./components/pricing/PricingMomentCard.jsx'));
// Global floating feedback affordance (files a support ticket, tagged with the
// active generation-id spine). Always mounted, self-gating on `visible`, so lazy
// keeps its code + icons off the entry's first-paint closure.
// The global floating-widget cluster (feedback widget + Surveyor S1 analyst panel),
// lazy so both stay off first paint; each self-gates on `visible`.
const FloatingAffordances = lazy(() => import('./components/FloatingAffordances.jsx'));

// Auth + checkout chrome the floating feedback widget stays off (its own
// contract): the sign-in door, recovery, and the single-dossier landing.
const AUTH_ROUTE_VIEWS = new Set([
  'signin', 'register', 'reset-password', 'set-new-password',
  'verify-email', 'confirm-email', 'dossier-success',
]);

// Mobile bottom nav: an EXPLICIT priority order rather than slicing the desktop
// NAV order, otherwise inserting/reordering a NAV item silently evicts whatever
// falls past the slice. The Realm is omitted (the map workspace is too
// constrained for small screens; it stays in the desktop nav and its routes
// still resolve). Welcome/home is reached via the mobile brand button.
const MOBILE_NAV_PRIORITY = ['generate', 'settlements', 'gallery', 'compendium', 'howto'];

// Is there a persisted Supabase session token on this device? A member returning
// to the bare root should wait for their session to restore (so they aren't
// flashed the marketing landing before being routed to /create); a logged-out
// visitor with no token can be routed immediately. supabase-js stores its token
// under `sb-<project-ref>-auth-token`, so we scan for that shape rather than
// depend on a client export.
function hasStoredSession() {
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith('sb-') && k.includes('-auth-token')) return true;
    }
  } catch { /* private mode → treat as no stored session */ }
  return false;
}

export default function App() {
  const isMobile = useIsMobile();
  // Path-based routing. `useRoute` resolves window.location → { view, … } and
  // re-renders on Back/Forward + programmatic navigation. `setView` aliases the
  // imperative navigator so existing setView(viewId) call sites keep working —
  // they just push a path now. `legacy`/`notFound` drive the URL-upgrade effect
  // below; `params` carries route segments (e.g. /settlements/:id).
  const { view, params, legacy, notFound } = useRoute();
  const setView = navigate;
  // A11y: move focus to <main> on every view change so keyboard / screen-reader
  // users aren't stranded at the top of the DOM after navigating (WCAG 2.4.3).
  // The skip-to-content link + main[tabIndex=-1] below are the target.
  const mainRef = useRef(null);
  useFocusOnViewChange(view, mainRef);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showScrollBottom, setShowScrollBottom] = useState(false);
  // Auth-modal visibility lives on the store's uiSlice (restoration #16) so the
  // signup/unlock PricingMomentCard can open sign-in, not the buy-credits wall.
  // (Value + setter grouped on one line to hold App.jsx at its max-lines ceiling.)
  const authModalOpen = useStore(s => s.authModalOpen), setAuthModalOpen = useStore(s => s.setAuthModalOpen);

  const authTier = useStore(s => s.auth.tier);
  const displayName = useStore(s => s.auth.displayName);
  const authUserId = useStore(s => s.auth.user?.id || null);
  const authLoading = useStore(s => s.auth.loading);
  const isElevated = useStore(s => s.isElevated());
  // Drive the per-view painted background (and the generation-flow override).
  const wizardMode = useStore(s => s.wizardMode);
  // F40: resolveViewBackground only reads `settlement` for TRUTHINESS (it treats
  // it as a boolean "flow active" flag). Subscribing to the whole settlement
  // object re-rendered the entire App shell on every event apply / pending edit /
  // pulse writeback / AI overlay mutation. Subscribe to the boolean instead so
  // the shell only re-renders when the settlement toggles absent↔present.
  const hasSettlement = useStore(s => !!s.settlement);
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
  // Same-device dossier retro auto-upgrade confirmation (108): the silent
  // post-save claim sets this; App renders it as one calm transient toast.
  const dossierClaimToast = useStore(s => s.dossierClaimToast);
  const setDossierClaimToast = useStore(s => s.setDossierClaimToast);

  // ── Bare-root front door ──────────────────────────────────────────────────
  // The bare root (settlementforge.com) canonicalizes for EVERYONE, but not to
  // the same place: logged-out visitors go to /home (the marketing Welcome), and
  // signed-in members go straight to /create (their workspace) — decision 7's
  // member-redirect, so a returning member never lands on marketing. Deep links
  // elsewhere are respected; only the bare root is rewritten. The guard waits for
  // a stored session to restore so a member never flashes the landing first.
  useEffect(() => {
    // No stored token at all ⇒ definitely logged out ⇒ route immediately (no wait,
    // no landing-then-app flash). Otherwise wait for the saved session to restore.
    if (hasStoredSession() && authLoading) return;
    try {
      // Defer the bare-root redirect while a Stripe checkout return is in flight.
      // The return URL is the bare origin '/?checkout=success&session_id=…', and
      // this effect runs synchronously on mount — before the checkout handler's
      // import().then() microtask below. Rewriting to /home here would strip the
      // query string before the reconcile handler can read it, stranding an
      // anonymous one-shot buyer's PAID dossier. The handler consumes + cleans the
      // params, after which a later run of this effect redirects normally.
      if (window.location.search.includes('checkout=')) return;
      const path = window.location.pathname;
      const atRoot = path === '/' || path === '';
      if (atRoot) replacePath(authTier === 'anon' ? '/home' : '/create');
    } catch { /* private mode → fall through to the default */ }
  }, [authLoading, authTier, view]);

  // ── Initialize auth + reconcile post-checkout + boot the outbox ────────────
  // F23: we NEVER declare success from the ?checkout=success URL alone (spoofable
  // + races the webhook). For account-bound products we verify the session
  // server-side, then poll the real entitlement (credit balance / profile tier)
  // until it lands — toasting success only then, a persistent "processing" notice
  // on timeout, and a terminal notice on a verified failure.
  useEffect(() => {
    initAuth();
    initOnboarding();
    // Track K C3 — replay the durable persistence outbox from a prior (possibly
    // dead) tab against the local payload cache, and arm background backoff.
    initOutbox();
    let cancelled = false;
    import('./lib/stripe.js').then(async (stripeLib) => {
      const { checkCheckoutResult, fetchCreditBalance } = stripeLib;
      const result = checkCheckoutResult();

      // Prime the balance on every mount (and capture it as the reconcile baseline).
      const primed = await fetchCreditBalance().catch(() => 0);
      if (!cancelled) setCreditBalance(primed);

      if (!result) return;

      if (result.status === 'success') {
        if (result.product === 'single_dossier') {
          const { attachPendingDossierCheckout, readPendingDossier } = await import('./lib/pendingDossier.js');
          // Two single_dossier checkouts land on the SAME return URL. The ANON
          // one-shot is fingerprinted by its dt token (or a pending-dossier stash
          // written before the Stripe redirect) — NOT the live auth tier: a buyer
          // who signed in DURING the round-trip is still an anonymous one-shot
          // (no durable right was granted server-side, its PDF lives only in the
          // stash). Keying on auth tier would strand their download.
          const isAnonOneShot = !!(result.dossierToken || readPendingDossier());
          if (!isAnonOneShot) {
            // No token, no stash → a SIGNED-IN buyer of a SAVED dossier bought a
            // DURABLE right (108), granted server-side by the webhook keyed to the
            // saveId they picked. Drop the durable-rights read cache so the saved
            // dossier refetches its (now true) right on next view, and confirm
            // calmly — no landing page, no navigation.
            useStore.getState().clearDossierEntitlements?.();
            setCheckoutToast({ text: 'Your dossier PDF is unlocked. It stays yours while this settlement is saved.', persistent: false });
            setTimeout(() => { if (!cancelled) setCheckoutToast(null); }, 4000);
            return;
          }
          // Bind Stripe's session to THIS purchase's token (the dt param) so
          // concurrent purchases never cross-contaminate (F21). Forward
          // session_id + dt to the landing page so it can verify precisely its own
          // paid session — even on a different device where no stash exists.
          attachPendingDossierCheckout(result.sessionId, result.dossierToken || null);
          // Arm the same-device retro-claim voucher with the paid session id (108),
          // so a later sign-up + save of this settlement can silently attach the
          // durable export right. Best-effort; a missing voucher just means the
          // anonymous one-shot stays a one-shot.
          try {
            const { attachDossierClaimSession } = await import('./lib/dossierClaimStash.js');
            attachDossierClaimSession(result.sessionId);
          } catch { /* non-fatal */ }
          const search = [
            result.sessionId ? `session_id=${encodeURIComponent(result.sessionId)}` : '',
            result.dossierToken ? `dt=${encodeURIComponent(result.dossierToken)}` : '',
          ].filter(Boolean).join('&');
          navigate('dossier-success', { replace: true, search: search ? `?${search}` : '' });
          return;
        }

        // Account-bound product: reconcile the entitlement instead of the URL.
        if (!cancelled) setCheckoutToast({ text: 'Confirming your purchase…', persistent: true });
        const { reconcileCheckout, OUTCOME } = await import('./lib/checkoutReconcile.js');
        const outcome = await reconcileCheckout(result, {
          verifySession: (sid) => stripeLib.verifyCheckoutSession(sid),
          fetchCreditBalance: stripeLib.fetchCreditBalance,
          fetchTier: stripeLib.fetchProfileTier,
          baselineBalance: primed,
          onCreditBalance: (bal) => { if (!cancelled) setCreditBalance(bal); },
          onEntitlement: () => initAuth(),   // land the fresh tier/credits in the store
        });
        if (cancelled) return;
        if (outcome.outcome === OUTCOME.SUCCESS) {
          // Paid-conversion funnel: fire ONLY on a server-verified success (never
          // from the ?checkout=success URL alone). checkCheckoutResult() already
          // consumed the URL params, so a remount can never double-fire.
          stripeLib.trackCheckoutSuccess(result.product);
          const msg = result.product === 'premium'
            ? 'Cartographer activated!'
            : result.product === 'founder_lifetime'
              ? 'Welcome aboard, Founder!'
              : 'Credits added!';
          setCheckoutToast({ text: msg, persistent: false });
          setTimeout(() => { if (!cancelled) setCheckoutToast(null); }, 4000);
        } else if (outcome.outcome === OUTCOME.PROCESSING) {
          const ref = (result.sessionId || '').slice(0, 12);
          setCheckoutToast({
            text: `Payment received — your purchase is still processing. Refresh in a minute${ref ? ` (ref ${ref})` : ''}.`,
            persistent: true,
          });
        } else {
          setCheckoutToast({
            text: 'We couldn’t confirm this purchase. If you were charged, contact support with your Stripe receipt.',
            persistent: true,
          });
        }
      } else if (result.status === 'cancelled') {
        // Restore-on-cancel (F21): the buyer bailed out of Stripe. Their in-flight
        // settlement lived only in the stash across the redirect; if the editor is
        // empty, put it back so the artifact they were about to buy isn't lost.
        const { readRestorablePendingDossier } = await import('./lib/pendingDossier.js');
        const restorable = readRestorablePendingDossier();
        if (!cancelled && restorable?.settlement && !useStore.getState().settlement) {
          useStore.getState().setSettlement(restorable.settlement);
          navigate('generate', { replace: true });
          setCheckoutToast({ text: 'Restored the dossier you were about to buy.', persistent: false });
          setTimeout(() => { if (!cancelled) setCheckoutToast(null); }, 5000);
        }
      }
    });
    return () => { cancelled = true; };
  }, [initAuth, initOnboarding, setCreditBalance]);

  // Auto-dismiss the dossier retro-claim confirmation toast after a short read.
  useEffect(() => {
    if (!dossierClaimToast) return undefined;
    const id = setTimeout(() => setDossierClaimToast(null), 6000);
    return () => clearTimeout(id);
  }, [dossierClaimToast, setDossierClaimToast]);

  useEffect(() => {
    if (!authLoading && authTier !== 'anon') {
      loadCampaigns();
    }
  }, [authLoading, authTier, authUserId, loadCampaigns]);

  // Refresh the credit balance on auth transitions (in-session sign-in/out). The
  // mount-only fetch above left a user who signed in after load with a stale
  // balance — blocking AI actions and pushing the purchase modal despite credits.
  useEffect(() => {
    if (authLoading) return;
    import('./lib/stripe.js').then(({ fetchCreditBalance }) =>
      fetchCreditBalance().then(bal => setCreditBalance(bal)));
  }, [authLoading, authUserId, setCreditBalance]);

  // F23: refetch credits + tier on tab focus / visibility (throttled to once per
  // 15s). If a purchase's webhook grant landed while the tab was backgrounded,
  // this surfaces it without a manual reload — and upgrades the store tier the
  // moment premium actually flips server-side.
  useEffect(() => {
    if (authLoading) return;
    let last = 0;
    const refetch = () => {
      if (typeof document !== 'undefined' && document.visibilityState === 'hidden') return;
      const now = Date.now();
      if (now - last < 15000) return;
      last = now;
      import('./lib/stripe.js').then(async ({ fetchCreditBalance, fetchProfileTier }) => {
        try { setCreditBalance(await fetchCreditBalance()); } catch { /* ignore */ }
        // Only chase a tier flip for non-premium accounts (elevated/premium have
        // nothing to gain, anon has no profile).
        if (authTier !== 'anon' && authTier !== 'premium') {
          try {
            if ((await fetchProfileTier()) === 'premium') initAuth();
          } catch { /* ignore */ }
        }
      }).catch(() => {});
    };
    window.addEventListener('focus', refetch);
    document.addEventListener('visibilitychange', refetch);
    return () => {
      window.removeEventListener('focus', refetch);
      document.removeEventListener('visibilitychange', refetch);
    };
  }, [authLoading, authTier, setCreditBalance, initAuth]);

  // ── Auth guards ────────────────────────────────────────────────────────────
  // Gated routes redirect once the session has resolved. 'auth' views bounce
  // anonymous visitors to /signin carrying ?next= (so they return post-login);
  // 'elevated' views bounce non-developers home. Waits on authLoading so we don't
  // act during the initial session check.
  useEffect(() => {
    if (authLoading) return;
    const guard = guardForView(view);
    if (guard === 'auth' && authTier === 'anon') {
      navigate('signin', { replace: true, search: `?next=${encodeURIComponent(viewToPath(view))}` });
    } else if (guard === 'elevated' && !isElevated) {
      navigate('generate', { replace: true });
    }
  }, [view, authTier, isElevated, authLoading]);

  // ── Demoted destinations → redirect to their new homes ─────────────────────
  // The Workshop was removed; /compare* is now a section in About; the World Map
  // moved INTO the Realm hub. The route entries stay (so the URLs still resolve
  // and old links / SEO keep working), but we bounce them to the new surface.
  useEffect(() => {
    if (view === 'workshop') {
      navigate('generate', { replace: true });
    } else if (view === 'map') {
      navigate('realm', { replace: true });
    } else if (view.startsWith('compare')) {
      navigate('howto', { replace: true, search: '?tab=compare' });
    }
  }, [view]);

  // ── Canonical-URL upgrade ──────────────────────────────────────────────────
  // Silently rewrite legacy ?view= links and unknown paths to their canonical
  // path (replaceState, no scroll). Non-view query params (gallery slug, flag
  // overrides) are preserved. The bare root ('/') is DELIBERATELY left to the
  // front-door effect above, which owns it — so which rewrite wins is not a
  // function of effect declaration order.
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

  // ── Document head (title + description + canonical + OG + robots) ───────────
  // Per-route refinement over the static index.html defaults. Compendium keeps
  // its own per-tab head refinement on top of this base (see CompendiumPanel).
  useEffect(() => {
    applyDocumentHead(view, params);
  }, [view, params]);

  // ── Active-view background preload ─────────────────────────────────────────
  // The .page-bg painting is a fixed CSS background, so the browser only
  // discovers its URL after CSS applies — late enough to delay the first painted
  // frame. Preload ONLY the current view's image (incl. the generation-flow
  // scene) so its bytes are already in flight. One reused <link> (found by id) is
  // repointed on every view/flow change, typed to the format the CSS will fetch
  // (WebP where the engine decodes it, else JPEG — see config/pageBackgrounds.js),
  // so preload and paint always agree and no image is fetched twice.
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const { href, type } = resolveViewBackground({ view, wizardMode, settlement: hasSettlement });
    const ID = 'page-bg-preload';
    let link = document.getElementById(ID);
    if (!link) {
      link = document.createElement('link');
      link.id = ID;
      link.rel = 'preload';
      link.as = 'image';
      document.head.appendChild(link);
    }
    link.type = type;
    link.href = href;
  }, [view, wizardMode, hasSettlement]);

  // ── Cloud sync custom content when user enters premium / elevated state ─────
  // Triggers once per tier transition. Migrates local items on first premium
  // sign-in (tracked via a user-scoped localStorage migration flag).
  useEffect(() => {
    if (authLoading) return;
    // Cancellation guard: rapid tier transitions / remounts can start a second
    // migrate→load chain before the first resolves, interleaving them so the
    // displayed custom content reflects a stale snapshot. On cleanup we set
    // ignore=true so a superseded chain bails before its load call.
    let ignore = false;
    const canSyncCloud = authTier === 'premium' || isElevated;
    if (canSyncCloud) {
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
    const id = setTimeout(() => clearOnboardingNudge(), 8000);
    return () => clearTimeout(id);
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

  const handleNavClick = (id) => {
    // Contextual re-click: clicking the ALREADY-ACTIVE Library tab closes any open
    // detail by re-navigating to the base path. (The Create-page first-screen
    // reset needs a store nonce that has not landed yet — a 4a follow-up — so a
    // Create re-click falls through to a normal re-nav for now.)
    if (id === view && id === 'settlements') { setView('settlements'); return; }
    setView(id);
    // Free wanderers clicking Realm see a Cartographer-upgrade pitch (cooldown 24h
    // via the moments library; premium auto-skipped; anon is handled richer on the
    // Realm landing itself, so we fire the lighter moment here only for free users).
    if (id === 'realm' && authTier !== 'anon' && authTier !== 'premium') {
      import('./lib/pricingMoments.js').then(({ triggerPricingMoment }) => {
        const setActive = useStore.getState().setActivePricingMoment;
        triggerPricingMoment('map_clicked', setActive, { tier: authTier });
      }).catch(() => { /* never block navigation */ });
    }
  };

  // Nav is derived wholesale from routes.js (each ROUTES entry with a `nav` block).
  // Adding / relabelling / reordering a tab is a one-place edit in routes.js.
  const visibleNav = NAV;
  const mobileNav = MOBILE_NAV_PRIORITY
    .map(id => visibleNav.find(item => item.id === id))
    .filter(Boolean)
    .slice(0, 5);

  const headerStyle = {
    background: `linear-gradient(to right, ${INK}, ${INK_DEEP})`,
    boxShadow: '0 2px 12px rgba(0,0,0,0.35)',
  };

  // Per-view painted background. On the Create page a generation flow blows up the
  // chosen settlement scene; see src/config/pageBackgrounds.js + index.css.
  const pageBg = resolveViewBackground({ view, wizardMode, settlement: hasSettlement });

  return (
    <>
      {/* Skip-to-content: the first focusable element in the DOM. Visually hidden
          until focused (.skip-link in index.css), it lets keyboard/SR users jump
          past the header/nav straight to <main id="main-content">. */}
      <a href="#main-content" className="skip-link">Skip to content</a>
      <Suspense fallback={null}><CampaignSyncBanner /><PostGenCoach /></Suspense>
      <div
        // Painted clean views (home/settlements/gallery/compendium/pricing/account/
        // admin/howto/legal) get `.page-painted scrim-<profile>`: a flat-cream
        // header band fading into the per-image painting. `home` is clean but NOT
        // painted-below-header — its own dark hero owns the surface.
        className={[
          'parchment-bg',
          pageBg.clean ? '' : 'page-bg',
          pageBg.isFlow ? 'is-flow' : '',
          pageBg.paintedBelowHeader ? `page-painted scrim-${pageBg.scrimProfile}` : '',
        ].filter(Boolean).join(' ')}
        style={{ '--page-bg': pageBg.url, position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}
      >

        {/* ── Mobile header ───────────────────────────────────── */}
        {isMobile && (
          <header style={{
            ...headerStyle,
            padding: `${SP.sm}px ${SP.md}px`,
            position: 'sticky', top: 0, zIndex: 50,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: SP.sm,
            paddingTop: 'calc(env(safe-area-inset-top) + 8px)',
          }}>
            <Button
              variant="ghost"
              onClick={() => setView('home')}
              aria-label="SettlementForge home"
              style={{ gap: SP.xs, minHeight: 44, padding: `0 ${SP.xs}px` }}
            >
              <HouseDevice size={20} style={{ flexShrink: 0 }} />
              <span aria-hidden="true" style={{ fontSize: FS.lg, fontWeight: 800, color: GOLD, fontFamily: serif_, letterSpacing: '0.01em' }}>
                <span style={{ fontSize: '1.28em' }}>S</span>ettlement<span style={{ fontSize: '1.28em' }}>F</span>orge
              </span>
            </Button>

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

        {/* ── Desktop header ──────────────────────────────────── */}
        {!isMobile && (
          <header style={{ ...headerStyle, padding: `${SP.md}px ${SP.xxl}px`, position: 'sticky', top: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: SP.md }}>
            {/* Brand block — the wordmark stands alone. "SettlementForge" reads as a
                single bold serif word with the two capitals (S, F) set a step
                larger. The wordmark doubles as the home link; rendered as a button
                for keyboard + AT access, the h1 keeps heading semantics with its
                per-letter spans hidden from AT (the button's aria-label reads the
                plain name). */}
            <div style={{ display: 'flex', alignItems: 'center', gap: SP.sm }}>
              <button
                type="button"
                onClick={() => setView('home')}
                aria-label="SettlementForge home"
                style={{ background: 'none', border: 'none', padding: 0, margin: 0, cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              >
                <HouseDevice size={26} style={{ marginRight: SP.sm, flexShrink: 0 }} />
                <h1
                  aria-hidden="true"
                  style={{ margin: 0, fontSize: FS.h1, fontWeight: 800, color: GOLD, fontFamily: serif_, letterSpacing: '0.01em', lineHeight: 1.1 }}
                >
                  <span style={{ fontSize: '1.32em', fontWeight: 800 }}>S</span><span>ettlement</span><span style={{ fontSize: '1.32em', fontWeight: 800 }}>F</span><span>orge</span>
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
                        // Active tab is a wayfinding marker, not a CTA: a gold
                        // underline + weight, not a filled cartouche, so the Sign
                        // In chip stays the region's single filled-gold focal point.
                        display: 'flex', alignItems: 'center', gap: SP.xs,
                        padding: `${SP.sm}px ${SP.lg}px`,
                        background: 'transparent',
                        border: 'none',
                        borderBottom: active ? `2px solid ${GOLD}` : '2px solid transparent',
                        borderRadius: 0, cursor: 'pointer',
                        color: active ? GOLD : PARCH_100,
                        fontSize: FS.sm, fontWeight: active ? 700 : 500,
                        fontFamily: sans,
                        letterSpacing: '0.14em', textTransform: 'uppercase',
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

              {/* Persistent credit badge. The balance fetched at mount (and refreshed
                  on auth transitions) reads at a glance from the right cluster. Two
                  channels: the violet count plus the "credits" word carry the
                  meaning, so it never relies on the violet colour alone, and there is
                  no glyph since icons stay off outside the Realm map. Signed-in only.
                  Routes to the subscription-and-credits surface. */}
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
                    background: SLATE_BG,
                    border: `1px solid ${SLATE}`,
                    color: SLATE,
                    fontSize: FS.sm, fontFamily: sans,
                    letterSpacing: '0.02em', cursor: 'pointer',
                    transition: 'all 0.2s', whiteSpace: 'nowrap',
                  }}
                >
                  <span style={{ fontWeight: 700 }}>{creditBalance}</span>
                  <span style={{ fontWeight: 500, opacity: 0.85 }}>credits</span>
                </button>
              )}

              {/* Persistent upgrade path, demoted to ghost: the richer upsell already
                  lives on Pricing, the footer, the Realm locked-state, and the
                  PricingMomentCard, so this stays discoverable without out-shouting
                  the AccountMenu chip. Free tier only. */}
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
              />
            </div>
          </header>
        )}

        {/* ── Main content ────────────────────────────────────── */}
        {/* `main` must NOT establish its own scroll container: a stray overflow-y
            makes it the nearest scroll-clipping ancestor, which silently breaks
            `position: sticky` for descendants (e.g. the wizard toolbar). Default
            `visible` keeps the window as the sole scroller and lets descendant
            sticky bars pin. */}
        <main id="main-content" ref={mainRef} tabIndex={-1} style={{ flex: 1, outline: 'none', padding: isMobile ? `${SP.md}px ${SP.md}px 100px` : `${SP.lg}px ${SP.xxl}px` }}>
          {/* A lazy chunk-load failure (stale deploy, dropped connection) throws
              from inside Suspense. Without a boundary here that throw escapes to the
              root and white-screens the whole app. The boundary sits OUTSIDE
              Suspense so it also catches a synchronous render throw from the
              resolved view; resetKeys={[view]} clears the error on navigation. */}
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
              <AppViews
                view={view}
                isMobile={isMobile}
                setView={setView}
                setAuthModalOpen={setAuthModalOpen}
                authTier={authTier}
                isElevated={isElevated}
                authLoading={authLoading}
                params={params}
              />
            </Suspense>
          </FeatureErrorBoundary>
        </main>

        {/* ── Footer ──────────────────────────────────────────────
            Pricing | Contact | Terms | Privacy above the copyright line. Refunds
            is no longer its own link — the refund policy now lives in the Terms
            "Refunds and cancellation" section (the /refunds URL still resolves).
            Contact routes through supportMailto() so the address is a one-line
            change in copy/support.js, never a hardcoded literal in the shell. */}
        <footer style={{
          background: `linear-gradient(to right, ${INK}, ${INK_DEEP})`,
          borderTop: '1px solid rgba(160,118,42,0.25)',
          padding: isMobile ? `${SP.lg}px ${SP.xl}px 88px` : `${SP.lg}px ${SP.xxl}px`,
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
            <Button variant="ghost" size="sm" onClick={() => setView('pricing')}
              style={{ color: PARCH_100, fontFamily: sans, fontSize: FS.sm, fontWeight: 500, letterSpacing: '0.04em', minHeight: isMobile ? 44 : undefined }}>
              {t('footer.pricing')}
            </Button>
            <span aria-hidden="true" style={{ color: 'rgba(244,234,208,0.4)' }}>|</span>
            <a href={supportMailto()} style={{
              color: PARCH_100, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4,
              padding: isMobile ? `0 ${SP.sm}px` : 0, minHeight: isMobile ? 44 : undefined,
            }}>
              {t('footer.contact')}
            </a>
            <span aria-hidden="true" style={{ color: 'rgba(244,234,208,0.4)' }}>|</span>
            <Button variant="ghost" size="sm" onClick={() => setView('terms')}
              style={{ color: PARCH_100, fontFamily: sans, fontSize: FS.sm, fontWeight: 500, letterSpacing: '0.04em', minHeight: isMobile ? 44 : undefined }}>
              {t('footer.terms')}
            </Button>
            <span aria-hidden="true" style={{ color: 'rgba(244,234,208,0.4)' }}>|</span>
            <Button variant="ghost" size="sm" onClick={() => setView('privacy')}
              style={{ color: PARCH_100, fontFamily: sans, fontSize: FS.sm, fontWeight: 500, letterSpacing: '0.04em', minHeight: isMobile ? 44 : undefined }}>
              {t('footer.privacy')}
            </Button>
          </nav>
          <Button variant="ghost" size="sm" onClick={() => setView('home')} aria-label="SettlementForge home" style={{ minHeight: isMobile ? 44 : undefined }}><HouseDevice size={20} /></Button>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: SP.sm, flexWrap: 'wrap' }}>
            <span>{t('footer.copyright', { year: 2026 })}</span>
            <span aria-hidden="true" style={{ color: 'rgba(244,234,208,0.4)' }}>·</span>
            <span style={{ fontStyle: 'italic' }}>{t('footer.antiAi')}</span>
          </div>
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
            {mobileNav.map(({ id, label }) => {
              const active = view === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => handleNavClick(id)}
                  aria-current={active ? 'page' : undefined}
                  style={{
                    // minWidth:0 lets a flex child shrink below its content width so
                    // the longest label ellipsis-fits at 375px. Five equal columns.
                    flex: 1, minWidth: 0,
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center', gap: SP.xs,
                    minHeight: 44,
                    padding: `${SP.sm + 2}px 2px`,
                    background: active ? GOLD_BG : 'transparent',
                    border: 'none',
                    borderTop: active ? `2px solid ${GOLD}` : '2px solid transparent',
                    cursor: 'pointer',
                    color: active ? GOLD : PARCH_100,
                    fontSize: FS.xxs, fontWeight: active ? 700 : 500,
                    fontFamily: sans,
                    letterSpacing: '0.02em', textTransform: 'uppercase',
                  }}
                >
                  <span style={{ lineHeight: 1, maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Scroll-to-top / scroll-to-bottom stack ────────────── */}
      {(showScrollTop || showScrollBottom) && (() => {
        const btn = {
          // 44×44 to meet the mobile touch-target floor (e2e mobile-pointer-targets).
          width: 44, height: 44, minHeight: 44, borderRadius: R.lg,
          background: 'rgba(28,20,9,0.82)',
          border: '1px solid rgba(160,118,42,0.5)',
          color: GOLD, fontSize: FS['16'],
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
          Hard-gated to signed-out visitors: the modal is the sign-in door, and a
          signup/unlock PricingMomentCard can fire setAuthModalOpen for an already-
          signed-in user. Rather than surface a stale account card that duplicates
          the AccountMenu's actions, an already-authed open is a no-op. */}
      {authModalOpen && authTier === 'anon' && (
        <Suspense fallback={null}>
          <AuthModal
            onClose={() => setAuthModalOpen(false)}
            isMobile={isMobile}
          />
        </Suspense>
      )}

      {/* ── Purchase modal ───────────────────────────────────── */}
      {purchaseModalOpen && (
        <Suspense fallback={null}>
          <PurchaseModal onClose={() => setPurchaseModalOpen(false)} />
        </Suspense>
      )}

      {/* ── Feedback widget (global floating affordance) ─────────
          Off the auth/checkout chrome; self-contained (reads the store, owns its
          open/submit state) so the mount is a one-liner. */}
      <Suspense fallback={null}>
        <FloatingAffordances visible={!AUTH_ROUTE_VIEWS.has(view)} />
      </Suspense>

      {/* ── Checkout result notice ────────────────────────────────
          F23: `checkoutToast` is { text, persistent }. A confirmed success is a
          brief green auto-dismiss toast; a "still processing" / failed-to-confirm
          notice is a PERSISTENT, dismissible amber banner (never a false green
          success) so a lagging/failed webhook can't leave the user misinformed. */}
      {checkoutToast && (
        <div style={{
          position: 'fixed', top: SP.xl, left: '50%', transform: 'translateX(-50%)',
          zIndex: 2000, padding: `${SP.md}px ${SP.xl}px`,
          maxWidth: 'min(92vw, 520px)',
          background: checkoutToast.persistent
            ? 'linear-gradient(135deg, #7a5a1a, #9a7a2a)'
            : 'linear-gradient(135deg, #2a7a2a, #4a8a4a)',
          color: swatch.white, borderRadius: R.xl,
          fontSize: FS.md, fontWeight: 700, fontFamily: sans,
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          animation: 'fadeIn 0.3s ease-out',
          display: 'flex', alignItems: 'center', gap: SP.md,
        }}>
          <span>{checkoutToast.text}</span>
          {checkoutToast.persistent && (
            <span style={{ marginLeft: 'auto', display: 'inline-flex' }}>
              <IconButton
                Icon={X}
                label="Dismiss"
                tone="inverse"
                size="sm"
                onClick={() => setCheckoutToast(null)}
              />
            </span>
          )}
        </div>
      )}

      {/* ── Dossier retro-claim confirmation ──────────────────────
          A quiet, single confirmation that a durable PDF right silently attached
          to a just-saved settlement bought before sign-up. Calm parchment styling
          (not the green success gradient) — it is a gentle grace, not a purchase
          receipt. role="status" so it is announced. */}
      {dossierClaimToast && (
        <div
          role="status"
          style={{
            position: 'fixed', bottom: SP.xxl, left: '50%', transform: 'translateX(-50%)',
            zIndex: 2000, maxWidth: 'min(92vw, 420px)',
            padding: `${SP.md}px ${SP.lg}px`,
            background: PARCH_100, color: BODY,
            border: `1px solid ${BORDER}`, borderRadius: R.lg,
            fontSize: FS.sm, fontWeight: 600, fontFamily: sans, lineHeight: 1.45,
            boxShadow: '0 6px 24px rgba(0,0,0,0.18)',
          }}
        >
          {dossierClaimToast}
        </div>
      )}

      {/* ── Onboarding nudge toast (post-tour tips + intent toasts) ────
          This channel is overloaded — authIntents.SAVE_SETTLEMENT uses it to
          surface "Saved as {name}" after a signup-save flow, so it must survive. */}
      {onboardingNudge && (
        <div
          role="button"
          tabIndex={0}
          onClick={clearOnboardingNudge}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); clearOnboardingNudge(); } }}
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

      {/* DEV-only panels: the feature-flag panel and the send-email
          "unconfigured" banner. DEV-gated so their modules never enter the
          production bundle at all (they already rendered null in prod). */}
      {import.meta.env?.DEV && (
        <Suspense fallback={null}>
          <DevFlagPanel />
          <DevEmailBanner />
        </Suspense>
      )}

      {/* Active pricing moment card. Renders null when no moment is active.
          Suppressed on the Pricing view: an upgrade nudge floating over the page
          that already IS the upgrade surface is redundant chrome. */}
      {view !== 'pricing' && (
        <Suspense fallback={null}>
          <PricingMomentCard />
        </Suspense>
      )}
    </>
  );
}
