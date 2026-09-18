/** @vitest-environment jsdom */
/**
 * homeHeroAnonGauge.test.jsx — THE ANON GAUGE LAW (owner veto, cluster 1a).
 *
 * The HomeHero gauge must render ONLY the viewer's entitlement:
 *   • Anonymous  → hamlet / village / town ONLY. thorp / city / metropolis
 *     are ABSENT (not merely faint-and-disabled). The pre-remediation gauge
 *     mapped the full TIER_ORDER and rendered all six to anon — a live law
 *     violation the e2e flows never caught (they only assert the three ARE
 *     present, never that the capped three are absent). This test closes that
 *     blind spot: it asserts ABSENCE.
 *   • Signed-in  → all six stations (thorp → metropolis).
 *
 * The gauge stations are real <button data-settlement-size> nodes (the e2e
 * locator contract), so the assertion reads them straight off the DOM.
 *
 * It also pins THE FREE-TODAY LINE, which sits under the same CTA and is read
 * off the same counter: the anon allowance is 1 full generation + 2 rerolls
 * (lib/anonGenCounter.js), and the line used to render their SUM against the sum
 * cap — '3 of 3 free today' to a visitor who had one settlement coming. The
 * three states below are the three the counter can actually be in.
 */

import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, cleanup, screen } from '@testing-library/react';
import { t } from '../../src/copy/index.js';

// WelcomeBackCard + AnonTierTeaser are out of scope (they self-gate and never
// render in these scenarios); stub them to null so their service-layer import
// chains stay out of the test.
vi.mock('../../src/components/home/WelcomeBackCard.jsx', () => ({ default: () => null }));
vi.mock('../../src/components/AnonTierTeaser.jsx', () => ({ default: () => null }));

// Anon cap: never at cap, so the gauge + CTA render (not the unlock block).
// The two buckets are MUTABLE so the free-today line can be read in each state
// (vi.hoisted, because the factory runs before the module body's consts).
const anonLeft = vi.hoisted(() => ({ full: 1, reroll: 2 }));
vi.mock('../../src/lib/anonGenCounter.js', () => ({
  anonAtCap: () => false,
  anonFullRemaining: () => anonLeft.full,
  anonRerollRemaining: () => anonLeft.reroll,
}));

// Analytics is fire-and-forget; stub the Funnel the hero calls on mount.
vi.mock('../../src/lib/analytics.js', () => ({
  Funnel: { homepageView: vi.fn(), anonGenerationCompleted: vi.fn() },
}));

// Mutable store singleton — set `storeState.auth.tier` per test.
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

const sizeValues = (container) =>
  Array.from(container.querySelectorAll('[data-settlement-size]'))
    .map(n => n.getAttribute('data-settlement-size'));

describe('HomeHero — the anon gauge law', () => {
  afterEach(cleanup);

  it('anonymous: renders hamlet/village/town ONLY — thorp/city/metropolis are ABSENT', () => {
    storeState.auth = { tier: 'anon', displayName: null };
    const { container } = render(<HomeHero onSignIn={() => {}} onNavigate={() => {}} />);
    const values = sizeValues(container);

    // The three anon stations are present…
    expect(values).toContain('hamlet');
    expect(values).toContain('village');
    expect(values).toContain('town');
    // …and the three capped stations are NOT rendered at all (the law).
    expect(values).not.toContain('thorp');
    expect(values).not.toContain('city');
    expect(values).not.toContain('metropolis');
    expect(values).toHaveLength(3);
  });

  it('signed-in: renders the full six-station ladder (thorp → metropolis)', () => {
    storeState.auth = { tier: 'free', displayName: null };
    const { container } = render(<HomeHero onSignIn={() => {}} onNavigate={() => {}} />);
    const values = sizeValues(container);

    for (const size of ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis']) {
      expect(values).toContain(size);
    }
    expect(values).toHaveLength(6);
  });
});

describe('HomeHero — the free-today line tells the truth about the two buckets', () => {
  afterEach(() => { cleanup(); anonLeft.full = 1; anonLeft.reroll = 2; });

  const renderAnon = () => {
    storeState.auth = { tier: 'anon', displayName: null };
    return render(<HomeHero onSignIn={() => {}} onNavigate={() => {}} />);
  };

  it('a fresh visitor is told one settlement and two rerolls, never "3 of 3"', () => {
    renderAnon();
    expect(screen.getByText(`(${t('hero.v2.subline', { full: 1, rerolls: 2 })})`)).toBeTruthy();
    // ⛔ THE DEFECT: the sum of the two caps, rendered as one interchangeable
    // allowance. Anchored by the live assertion above, which reads the same node.
    expect(screen.queryByText(/3 of 3 free today/)).toBeNull();
  });

  it('one reroll spent reads in the singular', () => {
    anonLeft.reroll = 1;
    renderAnon();
    expect(screen.getByText(`(${t('hero.v2.sublineOneReroll', { full: 1, rerolls: 1 })})`)).toBeTruthy();
  });

  it('the full run spent, rerolls left: the line switches to the rerolls', () => {
    anonLeft.full = 0;
    anonLeft.reroll = 2;
    renderAnon();
    expect(screen.getByText(`(${t('hero.v2.sublineRerolls', { rerolls: 2 })})`)).toBeTruthy();
    expect(screen.queryByText(/free settlement today/)).toBeNull();
  });
});
