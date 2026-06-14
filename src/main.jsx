import React from 'react';
import { FS, swatch } from './components/theme.js';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import './styles/a11y.css';
import { useStore } from './store';
import { emitCssTokens } from './design/tokens.js';
import { installAnalyticsProvider } from './lib/analyticsProvider.js';
import { installAnalyticsQueue } from './lib/analyticsQueue.js';
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
