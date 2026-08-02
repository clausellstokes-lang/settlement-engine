import { Component } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import './styles/a11y.css';
// THE ORGANIC CRAFT layer (pure CSS — the primitive classes + the generated
// :root token vars). Eager CSS so every surface can speak the manuscript
// grammar; the organic JS stays lazy (tests/design/organicVars.test.js pins it).
import './styles/organic.css';
import './styles/organicVars.css';
import { useStore } from './store';
import { emitCssTokens } from './design/tokens.js';
import { installAnalyticsProvider } from './lib/analyticsProvider.js';
import { installAnalyticsQueue, setAnalyticsElevated } from './lib/analyticsQueue.js';
import { track, EVENTS } from './lib/analytics.js';
import { returnVisitBand, stampVisit } from './lib/session.js';
import { reportError, installGlobalErrorHandlers } from './lib/errorReporter.js';
import OperatorMessagesProvider from './components/account/OperatorMessagesProvider.jsx';

// Emit design tokens as CSS custom properties on :root so stylesheets and
// inline styles can read them as `var(--color-gold-500)`, `var(--space-4)`,
// `var(--sem-text-body)`, etc. JS imports keep working unchanged.
emitCssTokens();

// V-27d IM FELL DISPLAY FACE — taste-gated, OFF by default. ZERO EAGER: both the
// flag registry (lib/flags.js, its own lazy chunk) and the face module load ONLY
// when the flag is on, via dynamic import — so the default flag-off path adds no
// static import to the first-paint closure and injects no @font-face. Lighting it
// is the owner's taste flip AND requires vendoring the IM Fell woff2 (imFellFace.js).
import('./lib/flags.js')
  .then(({ flag }) => {
    if (flag('imFellDisplayFace')) {
      return import('./lib/imFellFace.js').then((m) => m.applyImFellDisplayFace());
    }
    return undefined;
  })
  .catch(() => {});

// Tier 8.8 - install the analytics provider (Plausible by default, when
// VITE_PLAUSIBLE_DOMAIN is set; PostHog as an opt-in alternative). No-op
// when neither env var is set, in which case analytics.js falls back to
// the dev-mode console log. The 4 wired funnel events
// (homepage_view / anonymous_generation_completed / signup_after_anon /
// paid_after_anon) flow straight through to whichever provider was
// installed.
installAnalyticsProvider();

// First-party analytics sink: restore any spilled queue + install flush-on-leave
// handlers, then open the session. Fire-and-forget; no-op if Supabase is
// unconfigured (the queue self-disables) or DNT/opt-out silences telemetry.
installAnalyticsQueue();
// Wire the elevated predicate so the owner's / admins' own usage stamps 'dogfood'
// (structurally excluded from the production corpus) instead of contaminating it as
// 'production' (lib-infra-5). A stored callback read at flush time, so the store is
// hydrated by then. The envelope's sessionId needs no wiring here: the lazy flush
// module (analyticsFlush.js) imports lib/sessionId.js itself, keeping the id
// machinery out of the first-paint closure (the A1-FP reclaim).
setAnalyticsElevated(() => {
  try { const s = useStore.getState(); return typeof s.isElevated === 'function' && s.isElevated() === true; }
  catch { return false; }
});
{
  const rv = returnVisitBand();
  let entry = 'other';
  try {
    const p = (typeof location !== 'undefined' ? location.pathname : '') || '/';
    entry = p === '/' ? 'home'
      : p.startsWith('/dossier') || p.startsWith('/s/') ? 'dossier'
        : p.startsWith('/gallery') ? 'gallery'
          : p.startsWith('/pricing') ? 'pricing' : 'other';
  } catch { /* default */ }
  // Stamp the visit now (rv already captured the PRIOR stamp above).
  stampVisit();

  // session_started's auth_state must be honest. Auth resolves asynchronously
  // after boot (App mounts → initAuth → getSession), so firing 'anon'
  // synchronously here lied for every returning signed-in user. Analytics events
  // queue locally (analyticsQueue), so a 1-2s defer is free: wait for the first
  // auth resolution and read the REAL tier. auth.loading starts `true`
  // (authSlice) and flips false once the session check completes; a fallback
  // timer fires the honest 'unknown' if auth never resolves (misconfig).
  const baseProps = {
    is_return: rv.is_return,
    days_since_last_visit_band: rv.days_since_last_visit_band,
    entry_route_kind: entry,
  };
  const authStateFor = (tier) => (tier === 'anon' || tier === 'free') ? tier : 'premium';
  let sessionStartFired = false;
  const fireSessionStart = (auth_state) => {
    if (sessionStartFired) return;
    sessionStartFired = true;
    track(EVENTS.SESSION_STARTED, { ...baseProps, auth_state });
  };
  const authAtBoot = useStore.getState().auth;
  if (authAtBoot && authAtBoot.loading === false) {
    // Already resolved (e.g. a synchronous rehydrate) — fire immediately.
    fireSessionStart(authStateFor(authAtBoot.tier));
  } else {
    const unsub = useStore.subscribe(
      (s) => s.auth?.loading,
      (loading) => {
        if (loading === false) {
          fireSessionStart(authStateFor(useStore.getState().auth?.tier));
          try { unsub(); } catch { /* already torn down */ }
        }
      },
    );
    // Safety net: still count the session — honestly, as 'unknown' — if auth
    // never resolves (Supabase unconfigured / initAuth never reached).
    setTimeout(() => {
      if (!sessionStartFired) {
        fireSessionStart('unknown');
        try { unsub(); } catch { /* already torn down */ }
      }
    }, 8000);
  }
}

// Production error reporting: window-level errors + unhandled rejections.
// No-op network unless VITE_ERROR_REPORT_URL is set; always logs locally.
installGlobalErrorHandlers();

// Expose store globally in dev so we can validate map features via automation.
if (import.meta.env.DEV) {
  window.__store = useStore;
}

class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(e) { return { error: e }; }
  componentDidCatch(e, info) {
    // reportError always logs locally before forwarding the structured crash
    // envelope. A second console dump here duplicated the same failure four
    // times without adding evidence.
    reportError(e, { kind: 'react.render', componentStack: info?.componentStack });
  }
  render() {
    const { error } = this.state;
    if (error) {
      return (
        <div className="root-error-boundary">
          <h2>Render Error</h2>
          <pre>{error.stack || error.message}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <ErrorBoundary>
    <OperatorMessagesProvider>
      <App />
    </OperatorMessagesProvider>
  </ErrorBoundary>,
);
