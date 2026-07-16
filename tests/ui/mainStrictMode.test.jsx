/**
 * @vitest-environment jsdom
 *
 * mainStrictMode.test.jsx — the app is mounted inside React.StrictMode, with the
 * ErrorBoundary kept as the outermost app wrapper.
 *
 * StrictMode double-invokes effects/renders in DEV to surface missing effect
 * cleanup, unsafe lifecycles, and impure render — a genuine correctness net.
 * The ErrorBoundary must stay ABOVE App so a render crash still funnels to
 * reportError via componentDidCatch. This test imports the real src/main.jsx
 * with its boot-time side-effect modules mocked, captures the root render, and
 * asserts the element tree is StrictMode → ErrorBoundary → App.
 *
 * If someone drops the StrictMode wrapper (or reorders it below the boundary),
 * this fails.
 */

import { describe, test, expect, vi, beforeEach } from 'vitest';
import React from 'react';

// Capture what main.jsx renders into the root. createRoot(...).render(el) is the
// single mount call; we grab `el` to inspect the wrapper chain.
const captured = { rootEl: null };
vi.mock('react-dom/client', () => ({
  default: { createRoot: () => ({ render: (el) => { captured.rootEl = el; } }) },
  createRoot: () => ({ render: (el) => { captured.rootEl = el; } }),
}));

// App renders nothing here — we only care about the wrapper chain, not its tree.
vi.mock('../../src/App', () => ({ default: function App() { return null; } }));

// Silence every boot-time side effect main.jsx fires at module load so the
// import is inert (no analytics, no token emission, no global handlers).
vi.mock('../../src/store', () => ({ useStore: Object.assign(() => {}, { getState: () => ({}), subscribe: () => () => {} }) }));
vi.mock('../../src/design/tokens.js', async (importOriginal) => ({
  ...(await importOriginal()),
  emitCssTokens: vi.fn(),
}));
vi.mock('../../src/lib/analyticsProvider.js', () => ({ installAnalyticsProvider: vi.fn() }));
vi.mock('../../src/lib/analyticsQueue.js', () => ({
  installAnalyticsQueue: vi.fn(),
  setSessionIdGetter: vi.fn(),
  // main.jsx imports this on this lineage (LINEAGE ADAPT, master merge W6).
  setAnalyticsElevated: vi.fn(),
}));
vi.mock('../../src/lib/analytics.js', () => ({ track: vi.fn(), EVENTS: new Proxy({}, { get: (_t, k) => String(k) }) }));
vi.mock('../../src/lib/session.js', () => ({ returnVisitBand: () => ({ is_return: false, days_since_last_visit_band: 'na' }), stampVisit: vi.fn(), getSessionId: () => 's' }));
vi.mock('../../src/lib/errorReporter.js', () => ({ reportError: vi.fn(), installGlobalErrorHandlers: vi.fn() }));
vi.mock('../../src/lib/flags.js', () => ({ persistUrlFlags: vi.fn() }));
vi.mock('../../src/lib/copyGuard.js', () => ({ installCopyGuard: vi.fn() }));
vi.mock('../../src/index.css', () => ({}));
vi.mock('../../src/styles/a11y.css', () => ({}));

beforeEach(() => {
  captured.rootEl = null;
  // main.jsx calls document.getElementById('root'); give it a mount node.
  document.body.innerHTML = '<div id="root"></div>';
});

describe('main.jsx — StrictMode wrapping', () => {
  test('renders StrictMode → ErrorBoundary → App', async () => {
    await import('../../src/main.jsx');

    const rootEl = captured.rootEl;
    expect(rootEl).toBeTruthy();

    // Outermost element is React.StrictMode.
    expect(rootEl.type).toBe(React.StrictMode);

    // Its single child is the ErrorBoundary (a class component, kept outermost
    // app wrapper so componentDidCatch still funnels crashes to reportError).
    const boundary = rootEl.props.children;
    expect(boundary).toBeTruthy();
    expect(typeof boundary.type).toBe('function');
    expect(boundary.type.prototype?.componentDidCatch).toBeTypeOf('function');

    // The boundary wraps App.
    const app = boundary.props.children;
    expect(app).toBeTruthy();
    expect(typeof app.type).toBe('function');
  });
});
