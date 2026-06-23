/** @vitest-environment jsdom */
/**
 * tests/components/featureErrorBoundary.test.jsx — UI-resilience lane.
 *
 * Pins the reusable FeatureErrorBoundary that now wraps the high-stakes feature
 * panels (the live dossier tab render in OutputContainer, the WorldMap stage,
 * and the gallery list/detail). Contract:
 *   • a child that THROWS during render shows the recoverable fallback (role=
 *     alert) instead of propagating to the root boundary (white screen);
 *   • the failure is still reported via reportError (recovery never hides it);
 *   • "Try again" clears the error and re-renders children;
 *   • a resetKeys change auto-recovers (navigating away from the bad input);
 *   • a non-throwing child renders normally (no fallback).
 */
import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';

// Capture reportError calls without a network side effect.
const reportError = vi.fn();
vi.mock('../../src/lib/errorReporter.js', () => ({
  reportError: (...a) => reportError(...a),
}));

import FeatureErrorBoundary from '../../src/components/FeatureErrorBoundary.jsx';

// A child that throws on demand. `shouldThrow` is read at render time so a
// resetKey-driven re-render with shouldThrow=false recovers.
function Boom({ shouldThrow, label = 'live content' }) {
  if (shouldThrow) throw new Error('malformed data');
  return <div>{label}</div>;
}

let errorSpy;
beforeEach(() => {
  reportError.mockReset();
  // The boundary's componentDidCatch + React both console.error; silence to
  // keep the test output clean while still letting the throw propagate.
  errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  errorSpy.mockRestore();
  cleanup();
});

describe('FeatureErrorBoundary', () => {
  test('renders children normally when they do not throw', () => {
    render(
      <FeatureErrorBoundary label="test.panel">
        <Boom shouldThrow={false} />
      </FeatureErrorBoundary>,
    );
    expect(screen.getByText('live content')).toBeTruthy();
    expect(screen.queryByRole('alert')).toBeNull();
  });

  test('a throwing child renders the recoverable fallback, not a crash', () => {
    render(
      <FeatureErrorBoundary label="test.panel" fallbackTitle="Panel broke.">
        <Boom shouldThrow />
      </FeatureErrorBoundary>,
    );
    const alert = screen.getByRole('alert');
    expect(alert).toBeTruthy();
    expect(alert.textContent).toContain('Panel broke.');
    // The original (broken) child content is NOT shown.
    expect(screen.queryByText('live content')).toBeNull();
  });

  test('reports the failure via reportError (recovery does not hide it)', () => {
    render(
      <FeatureErrorBoundary label="test.panel" kind="react.render.test">
        <Boom shouldThrow />
      </FeatureErrorBoundary>,
    );
    expect(reportError).toHaveBeenCalledTimes(1);
    const [err, ctx] = reportError.mock.calls[0];
    expect(err).toBeInstanceOf(Error);
    expect(err.message).toBe('malformed data');
    expect(ctx.kind).toBe('react.render.test');
  });

  test('"Try again" clears the error and re-renders the (now-healthy) child', () => {
    // The child reads a module-mutable flag at render time, so when "Try again"
    // re-renders the SAME child element, it picks up the flipped value. This
    // models the real case where the retry happens after the bad input is gone.
    let live = true;
    function LiveBoom() {
      if (live) throw new Error('malformed data');
      return <div>live content</div>;
    }
    render(
      <FeatureErrorBoundary label="test.panel">
        <LiveBoom />
      </FeatureErrorBoundary>,
    );
    expect(screen.getByRole('alert')).toBeTruthy();

    // Underlying condition resolves, then the user retries.
    live = false;
    fireEvent.click(screen.getByText('Try again'));
    expect(screen.queryByRole('alert')).toBeNull();
    expect(screen.getByText('live content')).toBeTruthy();
  });

  test('a resetKeys change auto-recovers without a manual retry', () => {
    const { rerender } = render(
      <FeatureErrorBoundary label="test.panel" resetKeys={['slug-a']}>
        <Boom shouldThrow />
      </FeatureErrorBoundary>,
    );
    expect(screen.getByRole('alert')).toBeTruthy();

    // Navigate to a different subject (new resetKey) whose child is healthy.
    rerender(
      <FeatureErrorBoundary label="test.panel" resetKeys={['slug-b']}>
        <Boom shouldThrow={false} label="other content" />
      </FeatureErrorBoundary>,
    );
    expect(screen.queryByRole('alert')).toBeNull();
    expect(screen.getByText('other content')).toBeTruthy();
  });

  test('a custom render-function fallback receives the error and a retry callback', () => {
    render(
      <FeatureErrorBoundary
        label="test.panel"
        fallback={(err, retry) => (
          <button type="button" onClick={retry}>custom: {err.message}</button>
        )}
      >
        <Boom shouldThrow />
      </FeatureErrorBoundary>,
    );
    expect(screen.getByText('custom: malformed data')).toBeTruthy();
  });
});
