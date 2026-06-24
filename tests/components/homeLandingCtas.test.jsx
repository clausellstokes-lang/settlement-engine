/** @vitest-environment jsdom */
/**
 * homeLandingCtas.test.jsx — the Welcome page adapts its secondary CTA + sub-CTA
 * line by auth state (the page now renders for members too, not just anon).
 *
 *   anon      → "Sign in" (opens the auth modal) + "Free. No account needed…"
 *   signed-in → "Explore Premium" (routes to Pricing) + a learn-more link that
 *               deep-links into the About page's Living World tab (?tab=living).
 *
 * The primitives are stubbed to bare markers so the test isolates the CTA wiring
 * (and avoids the Button primitive's matchMedia-backed mobile-floor read).
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen, fireEvent } from '@testing-library/react';

vi.mock('../../src/components/primitives/Button.jsx', () => ({
  default: ({ children, onClick }) => <button type="button" onClick={onClick}>{children}</button>,
}));
vi.mock('../../src/components/primitives/LifecycleSpine.jsx', () => ({ default: () => <div data-testid="spine" /> }));
vi.mock('../../src/config/pageBackgrounds.js', () => ({ backgroundImageUrl: () => 'about:blank' }));

import HomeLanding from '../../src/components/HomeLanding.jsx';

function setup(signedIn) {
  const onNavigate = vi.fn();
  const onSignIn = vi.fn();
  render(<HomeLanding isMobile={false} signedIn={signedIn} onNavigate={onNavigate} onSignIn={onSignIn} />);
  return { onNavigate, onSignIn };
}

describe('HomeLanding — adaptive CTAs by auth state', () => {
  afterEach(cleanup);

  it('anon: Forge + Sign in + free-to-try reassurance, no premium prompt', () => {
    const { onNavigate, onSignIn } = setup(false);
    expect(screen.getByText('Forge your first settlement')).toBeTruthy();
    expect(screen.getByText('Sign in')).toBeTruthy();
    expect(screen.getByText(/No account needed to forge your first town/)).toBeTruthy();
    // The member-only affordances are absent.
    expect(screen.queryByText('Explore Premium')).toBeNull();
    expect(screen.queryByText(/Learn more about the simulator/)).toBeNull();
    // Sign in opens the auth modal, never navigates.
    fireEvent.click(screen.getByText('Sign in'));
    expect(onSignIn).toHaveBeenCalledTimes(1);
    expect(onNavigate).not.toHaveBeenCalled();
  });

  it('signed-in: Explore Premium -> Pricing, learn-more -> About Living World tab', () => {
    const { onNavigate, onSignIn } = setup(true);
    // The anon-only copy is gone.
    expect(screen.queryByText('Sign in')).toBeNull();
    expect(screen.queryByText(/No account needed/)).toBeNull();
    // Primary CTA is unchanged.
    expect(screen.getByText('Forge your first settlement')).toBeTruthy();
    // Explore Premium routes to the Pricing surface.
    fireEvent.click(screen.getByText('Explore Premium'));
    expect(onNavigate).toHaveBeenCalledWith('pricing');
    // The learn-more link deep-links to the About page's Living World tab.
    fireEvent.click(screen.getByText(/Learn more about the simulator and the Realm map for Cartographers/));
    expect(onNavigate).toHaveBeenCalledWith('howto', { search: '?tab=living' });
    // A member never triggers the auth modal.
    expect(onSignIn).not.toHaveBeenCalled();
  });
});
