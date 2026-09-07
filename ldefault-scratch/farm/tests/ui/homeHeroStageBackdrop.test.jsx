/** @vitest-environment jsdom */
/**
 * homeHeroStageBackdrop.test.jsx — THE STAGE BACKDROP interaction-gate (C1r-c3).
 *
 * The six evolution stills render as a faint backdrop behind the gauge, keyed to
 * the chosen station. The load-bearing invariant is FIRST-PAINT SAFETY: NO still
 * is fetched until the visitor first touches the gauge, so the hero's LCP pays
 * zero (the funnel's hottest surface). This pins that gate so a future edit can't
 * silently make the backdrop eager (which would regress the hero LCP):
 *   • before any interaction, the backdrop <img> is ABSENT from the DOM (so the
 *     browser has nothing to fetch);
 *   • after the first station pick, it is PRESENT with the chosen tier's src.
 */

import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, cleanup, fireEvent } from '@testing-library/react';

vi.mock('../../src/components/home/WelcomeBackCard.jsx', () => ({ default: () => null }));
vi.mock('../../src/components/AnonTierTeaser.jsx', () => ({ default: () => null }));
vi.mock('../../src/lib/anonGenCounter.js', () => ({
  anonAtCap: () => false,
  anonGensRemaining: () => 3,
  DEFAULT_DAILY_CAP: 3,
}));
vi.mock('../../src/lib/analytics.js', () => ({
  Funnel: { homepageView: vi.fn(), anonGenerationCompleted: vi.fn() },
}));

const storeState = {
  generateSettlement: vi.fn(),
  updateConfig: vi.fn(),
  setWizardMode: vi.fn(),
  setSelectedSettlementId: vi.fn(),
  auth: { tier: 'anon', displayName: null },
};
vi.mock('../../src/store/index.js', () => ({
  useStore: (selector) => selector(storeState),
}));

import HomeHero from '../../src/components/HomeHero.jsx';

const backdrop = (c) => c.querySelector('img.sf-gauge-backdrop');

describe('HomeHero — the stage backdrop is interaction-gated (LCP safety)', () => {
  afterEach(cleanup);

  it('renders NO backdrop image before any gauge interaction', () => {
    const { container } = render(<HomeHero onSignIn={() => {}} onNavigate={() => {}} />);
    expect(backdrop(container)).toBeNull();
  });

  it('renders the chosen tier still only AFTER a station is picked', () => {
    const { container } = render(<HomeHero onSignIn={() => {}} onNavigate={() => {}} />);
    expect(backdrop(container)).toBeNull();

    fireEvent.click(container.querySelector('[data-settlement-size="village"]'));

    const img = backdrop(container);
    expect(img).not.toBeNull();
    expect(img.getAttribute('src')).toBe('/evolution/village.jpg');
    // Decorative: empty alt + aria-hidden so it is never announced.
    expect(img.getAttribute('alt')).toBe('');
    expect(img.getAttribute('aria-hidden')).toBe('true');
  });
});
