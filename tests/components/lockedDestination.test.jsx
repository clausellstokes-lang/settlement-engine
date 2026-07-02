/** @vitest-environment jsdom */
/**
 * lockedDestination.test.jsx — P143 / X-7 contract over the shared
 * "destination sells itself" primitive.
 *
 * Pins:
 *   • Renders eyebrow / headline / body / CTA from props.
 *   • Fires its trackEvent once on mount (per-session, keyed by feature).
 *   • Default CTA opens the purchase modal; an onCta override wins instead.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';

const trackSpy = vi.fn();
vi.mock('../../src/lib/analytics.js', () => ({
  Funnel: { track: (...a) => trackSpy(...a) },
  EVENTS: { LOCKED_DESTINATION_SHOWN: 'locked_destination_shown' },
}));

const setPurchaseModalOpen = vi.fn();
vi.mock('../../src/store/index.js', () => {
  const data = { setPurchaseModalOpen: (...a) => setPurchaseModalOpen(...a) };
  function useStore(selector) { return selector(data); }
  return { useStore };
});

import LockedDestination from '../../src/components/primitives/LockedDestination.jsx';

const baseProps = {
  feature: 'Version history',
  eyebrow: 'Cartographer · Version history',
  headline: 'Every change, on a timeline you can roll back.',
  body: 'Auto-snapshot on canonize, manual snapshot on demand.',
  ctaLabel: 'See Cartographer',
  trackEvent: 'locked_destination_shown',
};

describe('LockedDestination', () => {
  beforeEach(() => {
    trackSpy.mockClear();
    setPurchaseModalOpen.mockClear();
    try { sessionStorage.clear(); } catch { /* ignore */ }
  });
  afterEach(() => cleanup());

  it('renders eyebrow, headline, body, and CTA from props', () => {
    render(<LockedDestination {...baseProps} />);
    expect(screen.getByText('Cartographer · Version history')).toBeTruthy();
    expect(screen.getByText('Every change, on a timeline you can roll back.')).toBeTruthy();
    expect(screen.getByText('Auto-snapshot on canonize, manual snapshot on demand.')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'See Cartographer' })).toBeTruthy();
  });

  it('fires trackEvent once on mount with the feature dimension', () => {
    render(<LockedDestination {...baseProps} />);
    expect(trackSpy).toHaveBeenCalledTimes(1);
    expect(trackSpy).toHaveBeenCalledWith('locked_destination_shown', { feature: 'Version history' });
    // Second mount of the same feature is suppressed (per-session guard).
    render(<LockedDestination {...baseProps} />);
    expect(trackSpy).toHaveBeenCalledTimes(1);
  });

  it('default CTA opens the purchase modal', () => {
    render(<LockedDestination {...baseProps} />);
    fireEvent.click(screen.getByRole('button', { name: 'See Cartographer' }));
    expect(setPurchaseModalOpen).toHaveBeenCalledWith(true);
  });

  it('an onCta override wins over the default modal-open', () => {
    const onCta = vi.fn();
    render(<LockedDestination {...baseProps} onCta={onCta} />);
    fireEvent.click(screen.getByRole('button', { name: 'See Cartographer' }));
    expect(onCta).toHaveBeenCalledTimes(1);
    expect(setPurchaseModalOpen).not.toHaveBeenCalled();
  });

  it('does not claim a free trial (checkout charges immediately — no trial exists)', () => {
    const { container } = render(<LockedDestination {...baseProps} />);
    // The false "Free 7-day trial" subline must be gone across every caller
    // of this shared primitive. Assert on the rendered text, not the source.
    expect(container.textContent).not.toMatch(/trial/i);
    expect(screen.queryByText(/free 7-day trial/i)).toBeNull();
    // Subline still communicates the real plan.
    expect(screen.getByText('$6/mo · cancel anytime')).toBeTruthy();
  });
});
