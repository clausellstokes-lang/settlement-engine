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
import { ANON_SIZES, SIZE_LABEL, signInUnlocksSizes } from '../../src/config/tierFacts.js';

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
  // At cap is DERIVED from the same two buckets, exactly as the real module
  // derives it (both spent), so the at-cap arm below cannot disagree with the
  // counting arms above about what state the reader is in.
  anonAtCap: () => anonLeft.full === 0 && anonLeft.reroll === 0,
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

  // The line is read straight off the rendered node, so every arm below is the
  // sentence a visitor actually gets, not a registry lookup agreeing with itself.
  const renderedLine = (container) => {
    const hit = [...container.querySelectorAll('span')]
      .map((el) => el.textContent)
      .find((txt) => /^\(.*\)$/.test(txt || ''));
    return hit || '';
  };

  it('a fresh visitor is told one settlement and two rerolls, never "3 of 3"', () => {
    const { container } = renderAnon();
    expect(renderedLine(container)).toBe('(1 free settlement today, plus 2 rerolls)');
    // ⛔ THE DEFECT: the sum of the two caps, rendered as one interchangeable
    // allowance. Anchored by the live assertion above, which reads the same node.
    expect(screen.queryByText(/3 of 3 free today/)).toBeNull();
  });

  it('one reroll left reads in the singular', () => {
    anonLeft.reroll = 1;
    const { container } = renderAnon();
    expect(renderedLine(container)).toBe('(1 free settlement today, plus 1 reroll)');
  });

  // ⛔ THE CAP-RAISE GUARD. The first cut hardcoded the singular noun and the
  // reroll count into the sentence, so raising DEFAULT_DAILY_FULL_CAP would have
  // rendered "2 free settlement today" on the funnel's hottest line. Both nouns now
  // inflect off their own live count, which is what this arm holds: a bucket count
  // this product has never shipped, rendering correctly anyway.
  it('a raised full cap inflects BOTH nouns, never "2 free settlement"', () => {
    anonLeft.full = 2;
    anonLeft.reroll = 1;
    const { container } = renderAnon();
    expect(renderedLine(container)).toBe('(2 free settlements today, plus 1 reroll)');
  });

  it('no rerolls left drops the clause rather than saying "0 rerolls"', () => {
    anonLeft.reroll = 0;
    const { container } = renderAnon();
    expect(renderedLine(container)).toBe('(1 free settlement today)');
  });

  it('the full run spent, rerolls left: the line switches to the rerolls', () => {
    anonLeft.full = 0;
    anonLeft.reroll = 2;
    const { container } = renderAnon();
    expect(renderedLine(container)).toBe(`(${t('hero.v2.sublineRerolls', { rerolls: 2 })})`);
    expect(screen.queryByText(/free settlement today/)).toBeNull();
  });

  // ⛔ BOTH BUCKETS SPENT: the at-cap unlock block renders, and it named the sizes
  // the reader had ALREADY SPENT. TIER_GATE.anon.maxTier is 'town', and the spent
  // line directly above it says "You've explored hamlet, village, town" — so
  // "unlock thorp through metropolis" sold three of them back. This is the sentence
  // that actually renders; the registry twin (hero.anonCap.unlockTpl) is unrendered.
  //
  // ⚠ AND THEN IT SOLD TWO OF THREE (the owner, 2026-09-19). The correction above
  // over-corrected: the anonymous sizes are hamlet, village and town, so a THORPE is
  // ALSO something signing in unlocks, and the replacement list — "city and metropolis"
  // — was short by one. Hand-typed lists is the class; the sentence now interpolates
  // `signInUnlocksSizes()` (config/tierFacts.js: the ladder minus the anonymous set,
  // Oxford-joined), and THIS ARM READS THE SAME DERIVATION rather than a third copy of
  // the words, so a ceiling that moves cannot leave the pin behind.
  it('at cap, the unlock names the sizes signing in ADDS', () => {
    anonLeft.full = 0;
    anonLeft.reroll = 0;
    const { container } = renderAnon();
    const text = container.textContent;
    expect(text, 'the at-cap block did not render').toContain(t('hero.anonCap.spent'));
    expect(signInUnlocksSizes(), 'the derivation lost the thorpe').toContain('thorpe');
    expect(text).toContain(`to unlock ${signInUnlocksSizes()} and`);
    expect(text).toMatch(new RegExp(`to unlock ${signInUnlocksSizes()} and\\s*save up to`));
    // anchored: the spent line and the unlock sentence are both asserted PRESENT on this same render above, so a block that failed to render reds there first
    expect(text).not.toMatch(/thorp through metropolis/);
    // …and the sizes the reader already spent are not sold back to them.
    for (const key of ANON_SIZES) {
      expect(
        signInUnlocksSizes(),
        `the unlock sentence offers ${key}, which an anonymous visitor already had`,
      ).not.toContain(SIZE_LABEL[key].toLowerCase());
    }
  });
});
