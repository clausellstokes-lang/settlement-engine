/**
 * @vitest-environment jsdom
 *
 * tests/ui/howToUseLivingWorld.test.jsx — UX Phase 9 About surfaces.
 *
 * Covers:
 *   - The Practical Guide (components/HowToUse.jsx, /about/guide) renders "The
 *     Living World" section and keeps the folded-up tabs retired.
 *   - RegionWakeReplay (the anon "Watch a region wake up" teaser) mounts for an
 *     anon visitor, scrubs deterministically, and renders the scripted arcs.
 *   - PricingPage A/B: the simulation-led copy is selectable behind the flag.
 *
 * THE ABOUT SPLIT (docs/DESIGN_ABOUT_PAGES.md) removed the collapsibles and the tab
 * strip by owner order: the guide's sections now render FLAT and always-open, and the
 * manifesto moved to its own page. The tab-clicking and expand-the-handbook helpers
 * these tests used are therefore gone — the behaviour they pinned was deliberately
 * deleted, not silently lost. The split's own structural pins (mapping totality,
 * anchor survival, header parity, heading tree) live in
 * tests/components/aboutSplit.test.jsx.
 */

import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, cleanup, fireEvent } from '@testing-library/react';

afterEach(cleanup);

// Analytics is fire-and-forget — stub so the mount path stays quiet.
vi.mock('../../src/lib/analytics.js', () => ({
  track: vi.fn(),
  Funnel: { track: vi.fn(), homepageView: vi.fn() },
  EVENTS: new Proxy({}, { get: (_t, k) => String(k) }),
}));

// A minimal store mock. useReaderAudience + the replay/sample read a handful of
// selectors; defaults mirror an anon visitor with no settlement.
const storeState = {
  auth: { tier: 'anon', displayName: '' },
  settlement: null,
  savedSettlements: [],
  lifetimeNarrateCount: 0,
};
vi.mock('../../src/store/index.js', () => {
  function useStore(selector) { return selector(storeState); }
  useStore.subscribe = () => () => {};
  useStore.getState = () => storeState;
  return { useStore };
});

describe('The Practical Guide — the de-collapsed Keeper\'s Handbook (/about/guide)', () => {
  it('mounts flat: every section is present at once, and the folded-up tabs stay retired', async () => {
    const HowToUse = (await import('../../src/components/HowToUse.jsx')).default;
    const { container } = render(<HowToUse />);
    expect(container.firstChild).not.toBeNull();
    const headings = [...container.querySelectorAll('h2')].map(h => h.textContent.trim());
    // The guide keeps The Living World, now as a section rather than a tab.
    expect(headings).toContain('The Living World');
    // DOC WAVE 2/2: "Under the Hood" (derivation mechanics) and "DM Philosophy"
    // were folded UP into the About manifesto (the mechanism + philosophy bands),
    // and the orphaned howto/UnderTheHoodTab.jsx was reaped. They stay gone.
    expect(headings).not.toContain('Under the Hood');
    expect(headings).not.toContain('DM Philosophy');
    // §0.2 — the page's OWN chrome carries no collapse/expand state: the two
    // card collapsibles and the tab strip are gone.
    expect(container.querySelectorAll('button[role="tab"]').length).toBe(0);
    // SCOPE NOTE (chair call, vetoable): the FAQ's per-QUESTION disclosures are
    // NOT "the collapsing cards" §0.2 removed. They belong to the shared
    // AccountFAQ component, which the Account page renders too; flattening a
    // long Q&A list here would fork that component and hurt the surface it was
    // built for. What §0.2 removed — the About page's own card chrome — is
    // pinned by source scan in tests/components/aboutSplit.test.jsx.
    const ownDisclosures = [...container.querySelectorAll('button[aria-expanded]')]
      .filter(b => [...container.querySelectorAll('h2')].some(h => h.textContent.trim() === b.textContent.trim()));
    expect(ownDisclosures.length, 'a guide SECTION must never be collapsible').toBe(0);
  });

  it('The Living World content renders WITHOUT a click (it is no longer behind a tab)', async () => {
    const HowToUse = (await import('../../src/components/HowToUse.jsx')).default;
    const { getAllByText, container } = render(<HowToUse />);
    // The thesis line.
    expect(container.textContent.toLowerCase()).toContain('runs the region for years');
    // The value ladder rungs.
    expect(getAllByText(/Try it|Save it|Run it/).length).toBeGreaterThan(0);
    // A premium chip on a living-world system.
    expect(container.textContent).toContain('Advance Time');
  });

  it('the operational claims prose survived the split intact', async () => {
    const HowToUse = (await import('../../src/components/HowToUse.jsx')).default;
    const { container } = render(<HowToUse />);
    const text = container.textContent.toLowerCase();
    // The Power User section's slider + neighbour claims (the ones
    // handbookClaimsParity holds to the live engine) stayed on the guide.
    expect(text).toContain('the five sliders compete for institutional probability');
    expect(text).toContain('cold war seeds clandestine intelligence factions');
  });
});

describe('What this Is — the trust page the manifesto moved to', () => {
  it('renders the derivation mechanics linearly, with no collapse state at all', async () => {
    const AboutPage = (await import('../../src/components/about/AboutWhatThisIs.jsx')).default;
    const { container } = render(<AboutPage />);
    const text = container.textContent.toLowerCase();
    expect(text).toContain('resolves constraints');
    expect(text).toContain('constraint-driven worldbuilding');
    expect(text).toContain('causal variables');
    // The mechanism band's slider line moved WITH the manifesto, not with the guide.
    expect(text).toContain('sliders shift probability');
    expect(container.querySelectorAll('button[aria-expanded]').length).toBe(0);
  });
});

describe('RegionWakeReplay — anon read-only teaser', () => {
  it('mounts for an anon visitor and shows the at-peace opener', async () => {
    const RegionWakeReplay = (await import('../../src/components/home/RegionWakeReplay.jsx')).default;
    const { getByTestId, container } = render(<RegionWakeReplay onUpgrade={() => {}} />);
    expect(getByTestId('region-wake-replay')).toBeTruthy();
    // Month 1 is at peace.
    expect(container.textContent.toLowerCase()).toContain('at peace');
  });

  it('advancing the scrubber surfaces the siege then the war ending', async () => {
    const RegionWakeReplay = (await import('../../src/components/home/RegionWakeReplay.jsx')).default;
    const { getByText, container } = render(<RegionWakeReplay onUpgrade={() => {}} />);
    // Advance to month 2 — a siege forms.
    fireEvent.click(getByText('Advance a month'));
    expect(container.textContent).toMatch(/War of/i);
    // Advance through to the end.
    fireEvent.click(getByText('Advance a month'));
    fireEvent.click(getByText('Advance a month'));
    fireEvent.click(getByText('Advance a month'));
    // The final frame names the peace + offers a Restart.
    expect(getByText('Restart')).toBeTruthy();
  });
});
