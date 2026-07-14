import React from 'react';
import { FS, swatch } from './components/theme.js';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import './styles/a11y.css';
import { useStore } from './store';
import { emitCssTokens } from './design/tokens.js';
import { installAnalyticsProvider } from './lib/analyticsProvider.js';
import { installAnalyticsQueue, setAnalyticsElevated } from './lib/analyticsQueue.js';
import { track, EVENTS } from './lib/analytics.js';
import { returnVisitBand, stampVisit } from './lib/session.js';
import { reportError, installGlobalErrorHandlers } from './lib/errorReporter.js';

// Emit design tokens as CSS custom properties on :root so stylesheets and
// inline styles can read them as `var(--color-gold-500)`, `var(--space-4)`,
// `var(--sem-text-body)`, etc. JS imports keep working unchanged.
emitCssTokens();

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

class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(e) { return { error: e }; }
  componentDidCatch(e, info) {
    console.error('=== RENDER ERROR ===');
    console.error('Error:', e.message);
    console.error('Stack:', e.stack);
    console.error('Component stack:', info.componentStack);
    reportError(e, { kind: 'react.render', componentStack: info?.componentStack });
  }
  render() {
    if (this.state.error) {
      return React.createElement('div', {
        style: { padding: 24, fontFamily: 'monospace', background: swatch.dangerBg, border: `2px solid ${swatch.danger}`, margin: 16, borderRadius: 8 }
      },
        React.createElement('h2', null, 'Render Error'),
        React.createElement('pre', { style: { whiteSpace: 'pre-wrap', fontSize: FS.sm } },
          this.state.error.message + '\n\n' + this.state.error.stack
        )
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  React.createElement(ErrorBoundary, null,
    React.createElement(App)
  )
);
