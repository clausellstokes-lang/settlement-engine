/**
 * @vitest-environment jsdom
 *
 * tests/components/founderPurchasePathAbsent.test.jsx — THE FOUNDER PURCHASE
 * PATH IS GONE, AND STAYS GONE (DESIGN_FOUNDERS_HALL §1/§5; ODQ §115 + §118).
 *
 * The owner attested on 2026-08-15 that no founder chair has ever been sold —
 * test purchases included — which discharged the build-time never-sold
 * precondition a prior lane recorded in PricingPage.jsx and killed the
 * grandfather arm of DESIGN_FOUNDERS_HALL §1. A chair is given, never sold.
 *
 * ⚠ WHY THIS FILE IS SHAPED THE WAY IT IS. A rendered-surface NEGATIVE carries a
 * recorded second vacuity: it passes when the surface never rendered at all. A
 * crashed PricingPage would green every "does not contain" assertion below. So
 * this pin copies the house idiom already used by
 * tests/components/foundersHallPage.test.jsx — the dead-sentence list rides
 * alongside POSITIVE controls (a real body of text, the band present, the new
 * words present, the CTA reading what it should read). Remove the controls and
 * the pin becomes decoration.
 *
 * ⚠ AND WHY THE STRUCTURAL ARM ASSERTS A SYMBOL, NOT JUST AN ABSENCE. A bare
 * negative over a deleted PRICE_MAP line has nothing positive to hold: someone
 * re-adds the row and the sale is silently back. create-checkout therefore
 * carries an explicit ABOLISHED_PRODUCTS set, and the arm reads THAT.
 *
 * Placed in tests/components/ rather than tests/lint/ on purpose: a tests/lint/
 * walker would incur the §102.3 coverage-row obligation for no gain here.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

beforeEach(() => { window.localStorage.clear(); window.history.replaceState({}, '', '/'); });
afterEach(() => { cleanup(); window.localStorage.clear(); });

// Stripe / supabase / founder-seats are network — stub them (the
// pricingPageBands harness, verbatim).
vi.mock('../../src/lib/stripe.js', () => ({ startCheckout: vi.fn(), startCustomerPortal: vi.fn() }));
vi.mock('../../src/lib/supabase.js', () => ({ isConfigured: false, supabase: null, withTimeout: (p) => p }));
vi.mock('../../src/lib/founderSeats.js', () => ({ FOUNDER_SEAT_CAP: 30, fetchFounderSeatsRemaining: vi.fn(async () => 17) }));

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

import PricingPage from '../../src/components/PricingPage.jsx';
import { TIERS } from '../../src/config/pricing.js';
import { tp } from '../../src/copy/pricingPage.js';

const REPO = path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), '..', '..');
const read = (rel) => fs.readFileSync(path.join(REPO, rel), 'utf8');

// The sentences the superseded design sold a chair with. Every one of these
// reached a reader on /pricing before this cure.
const ABOLISHED_SENTENCES = Object.freeze([
  'Claim a founder seat',
  'Claim a Founder seat',
  'One payment, no clock',
  'seats remaining',
  'seats are gone',
  'Limited to 30 seats',
  '$99',
  'one-time',
  'Pay once',
]);

describe('the founder purchase path is absent from the rendered pricing page', () => {
  it('renders none of the abolished sale sentences', () => {
    const { container } = render(<PricingPage onNavigate={() => {}} />);
    const text = container.textContent;

    // ── NON-VACUITY CONTROLS (mandatory; see the header) ───────────────────
    // A negative over a surface that never rendered is not a negative.
    expect(text.length, 'the pricing page rendered almost nothing — the negatives below are vacuous')
      .toBeGreaterThan(200);
    expect(text, 'the charter band must still be on the page').toContain(tp('band2.charter.name'));
    expect(text, 'the charter must say a chair is given, never sold')
      .toContain(tp('band2.charter.capNote'));
    expect(text, 'the charter CTA must ask for a chair').toContain(tp('band2.charter.cta'));
    expect(tp('band2.charter.cta')).toBe('Request a chair');
    expect(text).toMatch(/by invitation/i);

    // ── THE NEGATIVE ──────────────────────────────────────────────────────
    const survivors = ABOLISHED_SENTENCES.filter((s) => text.includes(s));
    expect(
      survivors,
      `\nThe pricing page still sells a Founder chair. A chair is given, never sold`
      + ` (DESIGN_FOUNDERS_HALL §1, ODQ §118); these sentences must not reach a`
      + ` reader:\n  ${survivors.join('\n  ')}\n`,
    ).toEqual([]);
  });

  it('leaves no un-interpolated {token} behind after the copy rewrite', () => {
    // The charter keys were renamed and re-argumented (seatsRemaining →
    // chairsHeld, and `lead` gained {seats}); a missed interpolation site would
    // print the brace to the reader.
    const { container } = render(<PricingPage onNavigate={() => {}} />);
    // anchored: the same render is asserted non-empty and to CONTAIN four charter strings above, so the subject cannot have silently vanished
    expect(container.textContent).not.toMatch(/\{\w+\}/);
  });
});

describe('the founder purchase path is absent from the source, structurally', () => {
  it('the pricing catalog carries no founder Stripe SKU', () => {
    const src = read('src/config/pricing.js');
    // anchored: the line below asserts the premium SKU is still PRESENT in this same source, so the file cannot have emptied out
    expect(src).not.toMatch(/stripeProduct:\s*'founder_lifetime'/);
    expect(TIERS.founder.stripeProduct).toBeNull();
    // Positive control: the catalog still HAS other SKUs, so the negative above
    // is not passing because the field was renamed away wholesale.
    expect(src).toMatch(/stripeProduct:\s*'premium'/);
  });

  it('create-checkout has no founder price row and refuses the product explicitly', () => {
    const src = read('supabase/functions/create-checkout/index.ts');
    // anchored: ABOLISHED_PRODUCTS and the premium price row are asserted PRESENT in this same source below
    expect(src).not.toMatch(/founder_lifetime:\s*Deno\.env\.get\(/);
    // The POSITIVE half — the whole reason the abolition is a symbol and not a
    // deletion. A future edit that re-adds a price row has to get past this.
    expect(src).toMatch(/const ABOLISHED_PRODUCTS = new Set\(\['founder_lifetime'\]\)/);
    expect(src).toMatch(/ABOLISHED_PRODUCTS\.has\(product\)/);
    // The seat gate it guarded is gone with it (dead-arm class).
    // anchored: same source, whose ABOLISHED_PRODUCTS and premium rows are asserted present two lines up and two lines down
    expect(src).not.toMatch(/FOUNDER_SEAT_LIMIT/);
    // Positive control: the catalog still resolves the products that DO sell.
    expect(src).toMatch(/premium:\s*Deno\.env\.get\('STRIPE_PRICE_PREMIUM'\)/);
  });

  it('no client surface opens a founder checkout any more', () => {
    for (const rel of [
      'src/components/PricingPage.jsx',
      'src/components/pricing/PricingBands.jsx',
      'src/components/pricing/FounderTile.jsx',
    ]) {
      expect(read(rel), `${rel} still opens a founder checkout`)
      // anchored: read() throws on a missing file, and the two lines below assert live symbols in the same PricingPage source
        .not.toMatch(/\(\s*'founder_lifetime'\s*\)/);
    }
    // …and the charter CTA can never be elected the page's loud primary, because
    // that selector requires kind === 'purchase'.
    const page = read('src/components/PricingPage.jsx');
    expect(page).toMatch(/kind: isFounder \? 'current' : 'navigate'/);
    expect(page).toMatch(/if \(ctaFor\(TIERS\.founder\)\.kind === 'purchase'\) return 'founder';/);
  });

  it('THE INBOUND PATH IS UNTOUCHED — the webhook can still refund a historical sale', () => {
    // ⛔ Deliberate, and the opposite of a leftover. stripe-webhook's founder
    // branches are the INBOUND path: refunds, disputes and replays of any
    // historical session must still land, and deleting them would strand one.
    // They are unreachable in practice and correct in principle.
    const webhook = read('supabase/functions/stripe-webhook/index.ts');
    expect(webhook).toMatch(/product\s*===\s*['"]founder_lifetime['"]/);
    expect(webhook).toMatch(/clawbackFounderForSession\s*\(/);
  });
});
