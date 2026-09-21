/** @vitest-environment jsdom */
/**
 * tests/components/launchLock.pricing.test.jsx - THE PRE-LAUNCH LOCKOUT on the
 * pricing group's purchase controls (lib/launchGate.js).
 *
 * THE OWNER (2026-09-16): "disable all purchase buttons on the website until we are
 * ready to launch. People can make accounts but temporarily, all buttons for
 * purchase including subscriptions are to have a pill that says available at launch."
 *
 * The gate is NOT mocked here, so this is the build the site ships today: closed.
 * Every case pins a control DISABLED with the pill INSIDE it (or inside the label
 * for the consent checkbox). The same controls' live behaviour, with the gate open,
 * stays pinned in their own files (pricingPageHydrationGate, purchaseModal,
 * purchaseReferralRedeem, referralFunnelTelemetry, pricingMomentRouting).
 *
 * NON-VACUITY: payments are CONFIGURED and auth is HYDRATED in this harness, so the
 * older disabling arms (notConfigured, the hydration gate, an in-flight checkout)
 * cannot be what disables a control; the gate is the only cause left. The controls
 * that are NOT purchases (Manage subscription, the Wanderer plan, the gold sign-in
 * moment) are driven in the same harness and must stay live with no pill.
 */
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';

const mocks = vi.hoisted(() => ({
  startCheckout: vi.fn(),
  storeState: /** @type {Record<string, any>} */ ({}),
}));

vi.mock('../../src/lib/supabase.js', () => ({
  isConfigured: true,
  withTimeout: (p) => p,
  supabase: {
    auth: {
      getSession: async () => ({ data: { session: null } }),
      getUser: async () => ({ data: { user: null } }),
    },
    functions: { invoke: async () => ({ data: null, error: null }) },
    rpc: async () => ({ data: null, error: null }),
    // hasPriorReferral reads referrals directly (RLS-scoped select).
    from: () => ({ select: () => ({ eq: () => ({ limit: async () => ({ data: [], error: null }) }) }) }),
  },
}));
// PRODUCTS stays the real active catalog (the modal derives its pack buttons from
// it); startCheckout is observable.
vi.mock('../../src/lib/stripe.js', async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, startCheckout: (...a) => mocks.startCheckout(...a), startCustomerPortal: vi.fn() };
});
vi.mock('../../src/lib/founderSeats.js', () => ({ FOUNDER_SEAT_CAP: 30, fetchFounderSeatsRemaining: vi.fn(async () => 17) }));
vi.mock('../../src/store/index.js', () => {
  function useStore(selector) { return selector(mocks.storeState); }
  useStore.subscribe = () => () => {};
  useStore.getState = () => mocks.storeState;
  return { useStore };
});

import PricingPage from '../../src/components/PricingPage.jsx';
import PurchaseModal from '../../src/components/PurchaseModal.jsx';
import PricingMomentCard from '../../src/components/pricing/PricingMomentCard.jsx';
import { purchasesOpen } from '../../src/lib/launchGate.js';
import { AVAILABLE_AT_LAUNCH } from '../../src/components/primitives/AvailableAtLaunchPill.jsx';
import { PRODUCTS } from '../../src/lib/stripe.js';
import { getActivePacks } from '../../src/config/pricing.js';
import { SINGLE_DOSSIER_PRICE } from '../../src/config/tierFacts.js';
import { t } from '../../src/copy/index.js';

/** A hydrated, signed-in free reader on a configured build, plus the moment openers. */
function setStore(overrides = {}) {
  mocks.storeState = {
    creditBalance: 12,
    auth: { user: { id: 'u1' }, tier: 'free', isFounder: false, displayName: '', loading: false },
    savedSettlements: [],
    lifetimeNarrateCount: 0,
    isElevated: () => false,
    activePricingMoment: null,
    clearActivePricingMoment: vi.fn(),
    setPurchaseModalOpen: vi.fn(),
    setAuthModalOpen: vi.fn(),
    ...overrides,
  };
}

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

beforeEach(() => {
  window.localStorage.clear();
  window.sessionStorage.clear();
  window.history.replaceState({}, '', '/');
  mocks.startCheckout.mockReset();
  setStore();
});
afterEach(() => {
  cleanup();
  window.localStorage.clear();
});

describe('launch lock (pricing group): this build ships with purchases closed', () => {
  test('the gate reads closed in this build, so every case below measures the shipped state', () => {
    expect(purchasesOpen()).toBe(false);
  });
});

describe('launch lock: PricingPage tier cards and credit packs', () => {
  test('the Cartographer Subscribe CTA is disabled and wears the pill, while the Wanderer plan stays live', () => {
    render(<PricingPage onNavigate={() => {}} />);
    const cta = screen.getByRole('button', { name: /^Subscribe/ });
    expect(cta.disabled, 'a visitor can still start a subscription checkout before launch').toBe(true);
    expect(within(cta).getByText(AVAILABLE_AT_LAUNCH)).toBeTruthy();
    // Nothing is in flight: the label is its own, not the checkout's "Redirecting".
    expect(screen.queryByText(/Redirecting/i)).toBeNull();
    // CONTROL: the navigate-only Wanderer CTA takes no money, so it is live under
    // its exact label (no pill words in its name).
    const wanderer = screen.getByRole('button', { name: /^Current plan$/ });
    expect(wanderer.disabled).toBe(false);
  });

  test('every credit pack tile is disabled and wears the pill', () => {
    render(<PricingPage onNavigate={() => {}} />);
    const packs = Object.values(getActivePacks());
    expect(packs.length, 'no active packs: the scan broke').toBeGreaterThan(0);
    for (const pack of packs) {
      const name = `${t('pricing.creditPacks.pack', { credits: pack.credits })}, ${pack.price}, ${AVAILABLE_AT_LAUNCH}`;
      const tile = screen.getByRole('button', { name });
      expect(tile.disabled, `pack ${pack.key} can still be bought before launch`).toBe(true);
      expect(within(tile).getByText(AVAILABLE_AT_LAUNCH)).toBeTruthy();
    }
  });

  test('the Manage subscription CTA of a subscriber stays live and wears no pill', () => {
    setStore({ auth: { user: { id: 'u1' }, tier: 'premium', isFounder: false, displayName: '', loading: false } });
    render(<PricingPage onNavigate={() => {}} />);
    // The exact name proves no pill words ride on the billing-portal CTA.
    const manage = screen.getByRole('button', { name: /^Manage subscription$/ });
    expect(manage.disabled, 'a subscriber must always be able to reach billing').toBe(false);
    expect(within(manage).queryByText(AVAILABLE_AT_LAUNCH)).toBeNull();
    // ANCHOR: the pill does render on this same page (a pack tile), so its absence
    // above is a fact about the manage CTA, not about a pill that never renders.
    const firstPack = Object.values(getActivePacks())[0];
    const tile = screen.getByRole('button', {
      name: new RegExp(`^${escapeRe(t('pricing.creditPacks.pack', { credits: firstPack.credits }))}`),
    });
    expect(within(tile).getByText(AVAILABLE_AT_LAUNCH)).toBeTruthy();
  });

  /**
   * ⭐ THE LADDER'S PRICED CELL WEARS THE MARK TOO (FIX-P5, ODQ §934.63 F16).
   *
   * The public-path walk found that every `$` figure on /pricing sat in a section carrying
   * "Available at launch" EXCEPT "$2.99 per settlement" in the comparison table. It was a
   * coverage gap rather than a wrong price: the owner's 2026-09-16 order names the CONTROL
   * as what wears the mark, and a table cell is not a control — so the cell fell out of the
   * rule while still printing a figure a reader is asked to believe resolves today.
   *
   * ⛔ AND THE OTHER DIRECTION IS THE ARM THAT MATTERS. A blanket "mark every cell" would
   * paper the ladder with pills; a ladder cell legitimately says "3 saves", "unlimited" and
   * "1 sample per settlement", and none of those is an offer. So this pins BOTH: the cells
   * that quote a currency mark carry it, and every other cell carries none.
   */
  test('the entitlement ladder marks its priced cells and only its priced cells', () => {
    const { container } = render(<PricingPage onNavigate={() => {}} />);
    // The ladder's own section, by the heading it is labelled from — not by the table,
    // which has no accessible name of its own and would match the task menu's table too.
    const section = container.querySelector('section[aria-labelledby="comparison-heading"]');
    expect(section, 'the comparison section did not render').toBeTruthy();
    /** Every value cell in the ladder, with its rendered words. */
    const cells = [...section.querySelectorAll('td')];
    expect(cells.length, 'the ladder rendered no cells: the scan broke').toBeGreaterThanOrEqual(12);

    const priced = cells.filter((td) => /[$£€]/.test(td.textContent || ''));
    expect(
      priced.length,
      'the ladder no longer quotes a figure anywhere, so the arm below is vacuous',
    ).toBe(1);
    expect(priced[0].textContent).toBe(`${SINGLE_DOSSIER_PRICE} per settlement${AVAILABLE_AT_LAUNCH}`);

    for (const td of priced) {
      expect(
        td.querySelector('[data-launch-pill]'),
        `a ladder cell prints "${td.textContent}" with no lock mark while purchases are closed`,
      ).toBeTruthy();
    }
    const unpriced = cells.filter((td) => !/[$£€]/.test(td.textContent || ''));
    expect(unpriced.length, 'every ladder cell quotes money: the control has no population').toBeGreaterThanOrEqual(10);
    for (const td of unpriced) {
      expect(
        td.querySelector('[data-launch-pill]'),
        `a ladder cell that quotes no figure ("${td.textContent}") wears the lock mark anyway`,
      ).toBeNull();
    }
  });
});

describe('launch lock: PurchaseModal', () => {
  test('every credit pack button is disabled and wears the pill', () => {
    render(<PurchaseModal onClose={() => {}} />);
    const packs = Object.values(getActivePacks());
    expect(packs.length, 'no active packs: the scan broke').toBeGreaterThan(0);
    for (const pack of packs) {
      const p = PRODUCTS[pack.key];
      expect(p, `pack ${pack.key} is missing from PRODUCTS`).toBeTruthy();
      const button = screen.getByRole('button', { name: `Buy ${p.credits} credits for ${p.price}, ${AVAILABLE_AT_LAUNCH}` });
      expect(button.disabled, `pack ${pack.key} can still be bought before launch`).toBe(true);
      expect(within(button).getByText(AVAILABLE_AT_LAUNCH)).toBeTruthy();
    }
  });

  test('the auto-reload consent checkbox is disabled with the pill beside it', () => {
    render(<PurchaseModal onClose={() => {}} />);
    const checkbox = screen.getByRole('checkbox', { name: /save my card for automatic credit reloads/i });
    expect(checkbox.disabled, 'a card can still be saved for reloads before launch').toBe(true);
    expect(checkbox.checked).toBe(false);
    const label = checkbox.closest('label');
    expect(label, 'the consent row lost its label').toBeTruthy();
    expect(within(label).getByText(AVAILABLE_AT_LAUNCH)).toBeTruthy();
  });

  test('the upgrade-to-Cartographer upsell is disabled and wears the pill', () => {
    render(<PurchaseModal onClose={() => {}} />);
    const upsell = screen.getByRole('button', { name: /upgrade to/i });
    expect(upsell.disabled, 'a subscription can still be started from the modal before launch').toBe(true);
    expect(within(upsell).getByText(AVAILABLE_AT_LAUNCH)).toBeTruthy();
    fireEvent.click(upsell);
    expect(mocks.startCheckout).toHaveBeenCalledTimes(0);
  });
});

describe('launch lock: PricingMomentCard', () => {
  test('the slate See Cartographer CTA is disabled, wears the pill, and opens nothing', () => {
    setStore({ activePricingMoment: { headline: 'Headline', body: 'Body', reason: 'third_save' } });
    render(<PricingMomentCard />);
    const cta = screen.getByRole('button', { name: /^See Cartographer/ });
    expect(cta.disabled, 'the upgrade moment still leads to a purchase before launch').toBe(true);
    expect(within(cta).getByText(AVAILABLE_AT_LAUNCH)).toBeTruthy();
    fireEvent.click(cta);
    expect(mocks.storeState.setPurchaseModalOpen).toHaveBeenCalledTimes(0);
  });

  test('the gold Sign in to unlock CTA stays live with no pill', () => {
    setStore({ activePricingMoment: { headline: 'Headline', body: 'Body', reason: 'signup_unlock' } });
    render(<PricingMomentCard />);
    // The exact name proves no pill words ride on the sign-in CTA.
    const cta = screen.getByRole('button', { name: /^Sign in to unlock$/ });
    expect(cta.disabled).toBe(false);
    expect(within(cta).queryByText(AVAILABLE_AT_LAUNCH)).toBeNull();
    // ANCHOR: the same button is live, so the absence above is about a rendered CTA.
    fireEvent.click(cta);
    expect(mocks.storeState.setAuthModalOpen).toHaveBeenCalledWith(true);
  });
});
