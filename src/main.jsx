import React from 'react';
import { FS, swatch } from './components/theme.js';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import './styles/a11y.css';
import { useStore } from './store';
import { emitCssTokens } from './design/tokens.js';
import { installAnalyticsProvider } from './lib/analyticsProvider.js';
import { installAnalyticsQueue, setSessionIdGetter } from './lib/analyticsQueue.js';
import { track, EVENTS } from './lib/analytics.js';
import { returnVisitBand, stampVisit, getSessionId } from './lib/session.js';
import { reportError, installGlobalErrorHandlers } from './lib/errorReporter.js';
import { persistUrlFlags } from './lib/flags.js';
import { installCopyGuard } from './lib/copyGuard.js';

// Emit design tokens as CSS custom properties on :root so stylesheets and
// inline styles can read them as `var(--color-gold-500)`, `var(--space-4)`,
// `var(--sem-text-body)`, etc. JS imports keep working unchanged.
emitCssTokens();

// Persist any ?flag.X= URL overrides to localStorage once, at boot — so they
// survive a refresh that drops the query string. flag()/useFlag still READ the URL
// (highest precedence) but no longer write during render (see flags.js).
persistUrlFlags();

// Install the analytics provider (Plausible by default, when
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
// Wire the session-id source into the queue so every envelope carries a sessionId
// (session.js rotates after 30 min idle). Done before installAnalyticsQueue so any
// spill restored + flushed on boot is already stamped.
setSessionIdGetter(getSessionId);
installAnalyticsQueue();
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
  track(EVENTS.SESSION_STARTED, { is_return: rv.is_return, days_since_last_visit_band: rv.days_since_last_visit_band, auth_state: 'anon', entry_route_kind: entry });
  stampVisit();
}

// Production error reporting: window-level errors + unhandled rejections.
// No-op network unless VITE_ERROR_REPORT_URL is set; always logs locally.
installGlobalErrorHandlers();

// Content-copy deterrent — now OFF by default (copyGuard flag). When enabled it
// blocks casual copy/cut/right-click + disables text selection site-wide, which
// fought the core DM workflow (copying prep into notes / VTT / Discord) more than
// it deterred anyone, and it was never security. No-ops unless the flag is set.
installCopyGuard();

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
      // DEV shows the message + stack inline for fast debugging. PRODUCTION must
      // NOT leak a stack trace to users — show a calm, reassuring fallback with a
      // refresh path instead. The full error is still captured for diagnostics in
      // componentDidCatch (console + reportError), just not rendered to the user.
      const dev = import.meta.env.DEV;
      return React.createElement('div', {
        style: { padding: 24, fontFamily: dev ? 'monospace' : 'inherit', background: swatch.dangerBg, border: `2px solid ${swatch.danger}`, margin: 16, borderRadius: 8, maxWidth: 640 }
      },
        React.createElement('h2', { style: { marginTop: 0 } }, dev ? 'Render Error' : 'Something went wrong'),
        dev
          ? React.createElement('pre', { style: { whiteSpace: 'pre-wrap', fontSize: FS.sm } },
              this.state.error.message + '\n\n' + this.state.error.stack)
          : React.createElement('p', { style: { fontSize: FS.sm, lineHeight: 1.5 } },
              'Your work was not intentionally changed. Refreshing the page usually fixes this — if it keeps happening, please contact support.'),
        !dev && React.createElement('button', {
          onClick: () => window.location.reload(),
          style: { marginTop: 12, padding: '8px 16px', cursor: 'pointer', borderRadius: 6, border: `1px solid ${swatch.danger}`, background: 'transparent', color: 'inherit', font: 'inherit' },
        }, 'Refresh')
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
