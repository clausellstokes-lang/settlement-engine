/**
 * FeatureErrorBoundary.jsx — reusable error boundary for high-stakes feature
 * panels.
 *
 * The app previously had boundaries in only two places: the root (main.jsx) and
 * SettlementDetail's DetailErrorBoundary. Everything else — the live dossier
 * tab render, the world map, the community gallery — would propagate an
 * uncaught render throw all the way to the root boundary, which blanks the
 * ENTIRE app to a raw error dump. A single malformed settlement / map / gallery
 * payload should degrade to a recoverable in-place fallback, not a white screen.
 *
 * This is a class component because React error boundaries can only be class
 * components (getDerivedStateFromError / componentDidCatch have no hook form).
 * It mirrors the two existing patterns it consolidates:
 *   • DetailErrorBoundary (SettlementDetail.jsx) — small inline fallback + a
 *     console.error scoped log.
 *   • the root ErrorBoundary (main.jsx) — reportError() telemetry.
 * Doing BOTH gives defense-in-depth: the panel recovers locally AND the failure
 * is still reported, so a swallowed throw never becomes an invisible bug.
 *
 * `resetKeys`: pass values that identify the content being rendered (e.g. a
 * settlement id, the active tab). When any of them changes, the boundary clears
 * its error state and re-renders children — so navigating away from the broken
 * input recovers automatically without a remount or page reload.
 */
import { Component } from 'react';
import { reportError } from '../lib/errorReporter.js';
import Button from './primitives/Button.jsx';
import { FS, SP, R, sans, swatch } from './theme.js';

/** Shallow per-element comparison of two resetKeys arrays. */
function keysChanged(a, b) {
  if (a === b) return false;
  if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) return true;
  for (let i = 0; i < a.length; i += 1) {
    if (!Object.is(a[i], b[i])) return true;
  }
  return false;
}

export default class FeatureErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
    this.handleRetry = this.handleRetry.bind(this);
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    const label = this.props.label || 'feature';
    // Local, scoped log (mirrors DetailErrorBoundary) …
    console.error(`[${label}] render failed`, error, info);
    // … plus structured telemetry (mirrors the root boundary), so the recovery
    // never hides the failure from monitoring.
    reportError(error, {
      kind: this.props.kind || 'react.render.feature',
      componentStack: info?.componentStack,
    });
  }

  componentDidUpdate(prevProps) {
    // Auto-recover when the identifying inputs change (e.g. user navigated to a
    // different settlement / tab). The conditional guard is the documented
    // React pattern for resetKeys-style recovery: it only runs while errored and
    // only when the keys actually changed, so it can't loop.
    if (this.state.error && keysChanged(prevProps.resetKeys, this.props.resetKeys)) {
      this.setState({ error: null });
    }
  }

  handleRetry() {
    this.setState({ error: null });
  }

  render() {
    if (this.state.error) {
      // A caller may supply a bespoke fallback (element, or a render function
      // given the error + a retry callback). Otherwise use the default card.
      const { fallback } = this.props;
      if (typeof fallback === 'function') return fallback(this.state.error, this.handleRetry);
      if (fallback !== undefined && fallback !== null) return fallback;

      const title = this.props.fallbackTitle || 'Something went wrong rendering this view.';
      return (
        <div
          role="alert"
          style={{
            margin: SP.md,
            padding: SP.lg,
            border: `1px solid ${swatch.danger}`,
            borderRadius: R.lg,
            background: swatch.dangerBg,
            color: swatch.danger,
            fontSize: FS.sm,
            fontFamily: sans,
          }}
        >
          <div style={{ fontWeight: 700, marginBottom: SP.xs }}>{title}</div>
          <div style={{ marginBottom: SP.sm, color: swatch.mutedBrown }}>
            The rest of the app is still working. You can try again or navigate away.
          </div>
          <Button variant="danger" size="sm" onClick={this.handleRetry} style={{ minHeight: 44 }}>
            Try again
          </Button>
        </div>
      );
    }
    return this.props.children;
  }
}
