/**
 * @vitest-environment jsdom
 *
 * tests/ui/pricingPageVariant.test.jsx — UX Phase 9 pricing A/B seam.
 *
 * The canonical "What the Realm unlocks" surface (PricingPage) must render BOTH
 * copy variants, selected by the `pricingSimulationCopy` flag (ON by default —
 * the simulation-led copy is the shipped conversion surface):
 *   - flag ON (default) → the simulation-led variant Cartographer feature list,
 *     naming NO size as premium.
 *   - flag OFF → the default tier feature framing (unlimited saves wording).
 * Both states now lead with one simulation-led subtitle (the About<->Pricing
 * one-story reconciliation); the flag toggles only the tier feature framing.
 * Each case pins the flag explicitly rather than leaning on the default.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { setFlagOverride } from '../../src/lib/flags.js';

beforeEach(() => { window.localStorage.clear(); window.history.replaceState({}, '', '/'); });
afterEach(() => { cleanup(); window.localStorage.clear(); });

// Stripe / supabase / founder-seats are network — stub them.
vi.mock('../../src/lib/stripe.js', () => ({ startCheckout: vi.fn(), startCustomerPortal: vi.fn() }));
vi.mock('../../src/lib/supabase.js', () => ({ isConfigured: false }));
vi.mock('../../src/lib/founderSeats.js', () => ({ fetchFounderSeatsRemaining: vi.fn(async () => 123) }));

// Store mock — PricingPage reads tier/elevated/founder + useCopy reads audience
// signals off the same store. Defaults: a signed-in free user.
const storeState = {
  auth: { tier: 'free', isFounder: false, displayName: '' },
  savedSettlements: [],
  lifetimeNarrateCount: 0,
  isElevated: () => false,
};
vi.mock('../../src/store/index.js', () => {
  function useStore(selector) { return selector(storeState); }
  useStore.subscribe = () => () => {};
  useStore.getState = () => storeState;
  return { useStore };
});

describe('PricingPage — A/B copy variant', () => {
  it('flag OFF renders the default tier framing under the unified subtitle', async () => {
    setFlagOverride('pricingSimulationCopy', false); // explicit — the default is now ON
    const PricingPage = (await import('../../src/components/PricingPage.jsx')).default;
    const { container } = render(<PricingPage onNavigate={() => {}} />);
    const text = container.textContent.toLowerCase();
    // Both flag states now lead with the one simulation-led subtitle.
    expect(text).toContain('run the region for years');
    // Flag OFF keeps the default tier feature framing (unlimited saves wording).
    expect(text).toContain('unlimited saves');
  });

  it('flag ON renders the simulation-led subtitle + features', async () => {
    // useFlag reads flag() live (localStorage) at render time, so flipping the
    // override before render is enough — no module reset needed.
    setFlagOverride('pricingSimulationCopy', true);
    const PricingPage = (await import('../../src/components/PricingPage.jsx')).default;
    const { container } = render(<PricingPage onNavigate={() => {}} />);
    const text = container.textContent;
    // The simulation-led subtitle.
    expect(text.toLowerCase()).toContain('run the region for years');
    // The Cartographer feature list names the simulation.
    expect(text.toLowerCase()).toMatch(/advance time|war layer|pantheon|self-ending/);
  });
});
