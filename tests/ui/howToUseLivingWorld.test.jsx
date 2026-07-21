/**
 * @vitest-environment jsdom
 *
 * tests/ui/howToUseLivingWorld.test.jsx — UX Phase 9 About surfaces.
 *
 * Covers:
 *   - HowToUse renders the new "The Living World" tab + the split "Under the
 *     Hood" (Generation + Simulation) without throwing.
 *   - RegionWakeReplay (the anon "Watch a region wake up" teaser) mounts for an
 *     anon visitor, scrubs deterministically, and renders the scripted arcs.
 *   - PricingPage A/B: the simulation-led copy is selectable behind the flag.
 */

import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, cleanup, fireEvent } from '@testing-library/react';

afterEach(cleanup);

/** Click a HowToUse tab by its label, disambiguating the tab BUTTON from any
 *  body text that mentions the same phrase. */
function clickTab(container, label) {
  const btn = [...container.querySelectorAll('button[role="tab"]')]
    .find(b => b.textContent.trim() === label);
  if (!btn) throw new Error(`tab button not found: ${label}`);
  fireEvent.click(btn);
}

/** Order W2-e — the About page splits into two collapsibles; the Keeper's Handbook
 *  (the tabbed guide) is COLLAPSED by default. Open it so its tabs/content render. */
function expandHandbook(container) {
  const btn = [...container.querySelectorAll('button[aria-expanded]')]
    .find(b => /Keeper/i.test(b.textContent));
  if (btn && btn.getAttribute('aria-expanded') === 'false') fireEvent.click(btn);
}

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

describe('HowToUse — the About manifesto + the Keeper\'s Handbook tabs', () => {
  it('mounts, keeps The Living World tab, and retires the folded-up tabs', async () => {
    const HowToUse = (await import('../../src/components/HowToUse.jsx')).default;
    const { container } = render(<HowToUse standalone />);
    expect(container.firstChild).not.toBeNull();
    expandHandbook(container); // the handbook is collapsed by default (order W2-e)
    const labels = [...container.querySelectorAll('button[role="tab"]')].map(b => b.textContent.trim());
    // The practical handbook keeps The Living World tab.
    expect(labels).toContain('The Living World');
    // DOC WAVE 2/2: "Under the Hood" (derivation mechanics) and "DM Philosophy"
    // were folded UP into the About manifesto (the mechanism + philosophy bands),
    // and the orphaned howto/UnderTheHoodTab.jsx was reaped. Their tabs are gone.
    expect(labels).not.toContain('Under the Hood');
    expect(labels).not.toContain('DM Philosophy');
  });

  it('clicking The Living World renders the thesis + the value ladder', async () => {
    const HowToUse = (await import('../../src/components/HowToUse.jsx')).default;
    const { getAllByText, container } = render(<HowToUse standalone />);
    expandHandbook(container); // the handbook is collapsed by default (order W2-e)
    clickTab(container, 'The Living World');
    // The thesis line.
    expect(container.textContent.toLowerCase()).toContain('runs the region for years');
    // The value ladder rungs.
    expect(getAllByText(/Try it|Save it|Run it/).length).toBeGreaterThan(0);
    // A premium chip on a living-world system.
    expect(container.textContent).toContain('Advance Time');
  });

  it('the About manifesto renders the derivation mechanics (folded up, always visible)', async () => {
    const HowToUse = (await import('../../src/components/HowToUse.jsx')).default;
    const { container } = render(<HowToUse standalone />);
    // The manifesto is a linear trust page — the mechanism band renders on mount,
    // not behind a tab click.
    const text = container.textContent.toLowerCase();
    expect(text).toContain('resolves constraints');
    expect(text).toContain('constraint-driven worldbuilding');
    expect(text).toContain('sliders shift probability');
    expect(text).toContain('causal variables');
  });
});

describe('HowToUse — About split into two collapsibles (order W2-e)', () => {
  it('"What this is" is open by default; the Keeper\'s Handbook is collapsed until opened', async () => {
    const HowToUse = (await import('../../src/components/HowToUse.jsx')).default;
    const { container } = render(<HowToUse standalone />);
    // 'What this is' (the manifesto) is expanded on mount — its mechanism prose shows.
    expect(container.textContent.toLowerCase()).toContain('resolves constraints');
    // 'The Keeper's Handbook' is collapsed — its tab strip is not rendered yet.
    expect(container.querySelectorAll('button[role="tab"]').length).toBe(0);
    // Opening it reveals the tabbed guide.
    expandHandbook(container);
    expect(container.querySelectorAll('button[role="tab"]').length).toBeGreaterThan(0);
  });

  it('a valid ?tab= deep-link auto-expands the Keeper\'s Handbook on arrival', async () => {
    const HowToUse = (await import('../../src/components/HowToUse.jsx')).default;
    const orig = window.location.pathname + window.location.search;
    window.history.replaceState({}, '', '/how-to?tab=living');
    try {
      const { container } = render(<HowToUse standalone />);
      // Deep-link → handbook open without any click → its tabs are present.
      const labels = [...container.querySelectorAll('button[role="tab"]')].map(b => b.textContent.trim());
      expect(labels).toContain('The Living World');
    } finally {
      window.history.replaceState({}, '', orig);
    }
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
