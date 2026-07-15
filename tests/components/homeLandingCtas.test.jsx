/** @vitest-environment jsdom */
/**
 * homeLandingCtas.test.jsx — the Welcome page adapts its CTAs by auth state
 * (the page now renders for members too, not just anon).
 *
 *   primary CTA → "Forge your first settlement" (anon) / "Forge your next
 *                 settlement" (signed in).
 *   secondary   → anon: "Sign in" (opens the auth modal); signed-in free:
 *                 "Explore Premium" (routes to Pricing); premium/elevated:
 *                 hidden (no upsell to someone who already has it).
 *   sub-CTA     → anon: "Free. No account needed…"; signed-in: a learn-more
 *                 link deep-linking into the About page's Living World tab.
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

function setup(signedIn, isPremium = false) {
  const onNavigate = vi.fn();
  const onSignIn = vi.fn();
  render(<HomeLanding isMobile={false} signedIn={signedIn} isPremium={isPremium} onNavigate={onNavigate} onSignIn={onSignIn} />);
  return { onNavigate, onSignIn };
}

describe('HomeLanding — adaptive CTAs by auth state', () => {
  afterEach(cleanup);

  it('anon: first-settlement + Sign in + free-to-try reassurance, no premium prompt', () => {
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

  it('signed-in free: next-settlement + Explore Premium -> Pricing, learn-more -> About Living World tab', () => {
    const { onNavigate, onSignIn } = setup(true, false);
    // The anon-only copy is gone.
    expect(screen.queryByText('Sign in')).toBeNull();
    expect(screen.queryByText(/No account needed/)).toBeNull();
    // Primary CTA reads "next" for a returning member.
    expect(screen.getByText('Forge your next settlement')).toBeTruthy();
    // Explore Premium routes to the Pricing surface.
    fireEvent.click(screen.getByText('Explore Premium'));
    expect(onNavigate).toHaveBeenCalledWith('pricing');
    // The learn-more link deep-links to the About page's Living World tab.
    fireEvent.click(screen.getByText(/Learn more about the simulator and the Realm map for Cartographers/));
    expect(onNavigate).toHaveBeenCalledWith('howto', { search: '?tab=living' });
    // A member never triggers the auth modal.
    expect(onSignIn).not.toHaveBeenCalled();
  });

  it('premium/elevated: next-settlement CTA, no Explore Premium upsell', () => {
    const { onNavigate, onSignIn } = setup(true, true);
    expect(screen.getByText('Forge your next settlement')).toBeTruthy();
    // No upsell to someone who already has it; not anon, so no Sign in either.
    expect(screen.queryByText('Explore Premium')).toBeNull();
    expect(screen.queryByText('Sign in')).toBeNull();
    expect(onNavigate).not.toHaveBeenCalled();
    expect(onSignIn).not.toHaveBeenCalled();
  });
});
