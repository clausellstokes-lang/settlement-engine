/** @vitest-environment jsdom */
/**
 * homeHeroInstantOrigin.test.jsx — instant generation PRESERVES the instant origin.
 *
 * Owner order (2026-07-22): using instant random generation and then pressing
 * Back must return to the instant-generation hero, NOT to a config panel. The
 * back-target is decided by `wizardMode` (null → the Create landing / instant
 * hero; a mode → that config panel), and the instant hero is only ever reached
 * from the null Create-landing state. The bug was that HomeHero's Begin handler
 * stamped setWizardMode('basic') before rolling, overwriting the null origin so
 * Back landed on the basic/advanced config stage.
 *
 * The fix REMEMBERS the origin by not clobbering it: instant generation keeps
 * wizardMode === null. (The generateWizard.smoke pin proves null renders the
 * instant/Create-landing surface, so null-origin → Back → instant page.)
 */

import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';

// Self-gating siblings — never render in this scenario; stub to null so their
// service-layer import chains stay out of the test.
vi.mock('../../src/components/home/WelcomeBackCard.jsx', () => ({ default: () => null }));
vi.mock('../../src/components/AnonTierTeaser.jsx', () => ({ default: () => null }));

// Anon cap helper — signed-in never hits it, but the module is imported.
vi.mock('../../src/lib/anonGenCounter.js', () => ({
  anonAtCap: () => false,
  anonGensRemaining: () => 3,
  DEFAULT_DAILY_CAP: 3,
}));

// Analytics is fire-and-forget.
vi.mock('../../src/lib/analytics.js', () => ({
  Funnel: { homepageView: vi.fn(), anonGenerationCompleted: vi.fn() },
}));

const storeState = {
  generateSettlement: vi.fn(),
  updateConfig: vi.fn(),
  setWizardMode: vi.fn(),
  setSelectedSettlementId: vi.fn(),
  // Signed-in ("Welcome back" instant variant, full size ladder).
  auth: { tier: 'free', displayName: 'Ada' },
};
vi.mock('../../src/store/index.js', () => ({
  useStore: (selector) => selector(storeState),
}));

import HomeHero from '../../src/components/HomeHero.jsx';

describe('HomeHero — instant generation preserves the (null) instant origin', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('rolling from the hero keeps wizardMode null — it never stamps "basic"', () => {
    render(<HomeHero onSignIn={() => {}} onNavigate={() => {}} />);

    // The signed-in instant CTA ("Generate a <size>").
    fireEvent.click(screen.getByRole('button', { name: /generate a /i }));

    // Origin preserved: the roll ran, but no config-mode was stamped.
    expect(storeState.generateSettlement).toHaveBeenCalledTimes(1);
    expect(storeState.setWizardMode).toHaveBeenCalledWith(null);
    expect(storeState.setWizardMode).not.toHaveBeenCalledWith('basic');
    expect(storeState.setWizardMode).not.toHaveBeenCalledWith('advanced');
  });
});
