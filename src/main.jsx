import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import './styles/a11y.css';
import { useStore } from './store';
import { emitCssTokens } from './design/tokens.js';
import { installAnalyticsProvider } from './lib/analyticsProvider.js';

// Emit design tokens as CSS custom properties on :root so stylesheets and
// inline styles can read them as `var(--color-gold-500)`, `var(--space-4)`,
// `var(--sem-text-body)`, etc. JS imports keep working unchanged.
emitCssTokens();

// Tier 8.8 — install the analytics provider (Plausible by default, when
// VITE_PLAUSIBLE_DOMAIN is set; PostHog as an opt-in alternative). No-op
// when neither env var is set, in which case analytics.js falls back to
// the dev-mode console log. The 4 wired funnel events
// (homepage_view / anonymous_generation_completed / signup_after_anon /
// paid_after_anon) flow straight through to whichever provider was
// installed.
installAnalyticsProvider();

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
  }
  render() {
    if (this.state.error) {
      return React.createElement('div', {
        style: { padding: 24, fontFamily: 'monospace', background: '#fee', border: '2px solid red', margin: 16, borderRadius: 8 }
      },
        React.createElement('h2', null, 'Render Error'),
        React.createElement('pre', { style: { whiteSpace: 'pre-wrap', fontSize: 12 } },
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
