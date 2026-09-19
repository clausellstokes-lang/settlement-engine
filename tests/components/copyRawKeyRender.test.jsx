/** @vitest-environment jsdom */
/**
 * copyRawKeyRender.test.jsx — NO SURFACE MAY PRINT A COPY KEY AT A READER.
 *
 * `t()` renders the KEY when it cannot resolve one, on purpose: a typo then shows as
 * harmless text instead of taking the page down, and dev warns. The cost of that
 * kindness is that a DELETED key is indistinguishable from a working one until
 * somebody looks at the page. On 2026-09-19 somebody did (ODQ §934.22 item 1): the
 * Founder card in the Create page's at-cap teaser printed
 *
 *     pricing.tiers.founder.priceLabel
 *     pricing.tiers.founder.priceSub
 *
 * as literal text in its 32px focal slot and the line under it, at 1440px and at
 * 391px, and the second of them — 29 unbreakable characters in a flex row — was the
 * SOLE cause of that page's horizontal overflow on a phone (documentElement
 * scrollWidth 437 against clientWidth 385).
 *
 * The keys were deleted by ruling months earlier (copy/en.js: a chair is given, never
 * sold) and the two readers went on asking for them. Nothing reddened, because
 * nothing in the estate looked at RENDERED TEXT for key shapes.
 *
 * ⭐ THE RULE. Render the surfaces that draw a tier card and walk every TEXT NODE:
 * no node's trimmed text may be a bare dotted path (`/^[a-z]+(\.[a-zA-Z]+)+$/`) —
 * the exact shape `t()`'s fallback produces and a shape no sentence in this product
 * has. The sibling walker (tests/lint/copyKeyResolution.walker.test.js) asks the
 * complementary question of the SOURCE: does every literal key a component names
 * still resolve? Neither subsumes the other — the walker cannot see a key built from
 * a template (`pricing.tiers.${tier.key}.priceLabel` is exactly that), and this test
 * cannot see a key on a branch it does not render.
 *
 * ⛔ THE ANTI-VACUITY ARMS ARE NOT DECORATION. Both assertions below are "this list
 * is empty", which is also what a render that produced no text at all yields — and a
 * mocked-out page that throws into a Suspense fallback produces exactly that. So each
 * surface asserts a FLOOR of measured text nodes, and the detector is executed
 * against a control string that IS a raw key.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render } from '@testing-library/react';

/**
 * ⭐ `t()`'s OWN FALLBACK SHAPE, AND NOTHING WIDER. A dotted path whose first segment
 * is all-lowercase and whose every later segment is a bare identifier. The product's
 * prose never looks like this: a sentence carries spaces, a number carries digits, a
 * filename carries an extension after a dot but also a slash or a space around it.
 * Anchored at both ends against the node's TRIMMED text, so "Ends. Then more." is not
 * a match and `a.b` alone is.
 */
const RAW_KEY = /^[a-z]+(\.[a-zA-Z]+)+$/;

beforeEach(() => { window.localStorage.clear(); window.history.replaceState({}, '', '/'); });
afterEach(() => { cleanup(); window.localStorage.clear(); });

// Network leaves, stubbed exactly as tests/ui/pricingPageBands.test.jsx stubs them.
vi.mock('../../src/lib/stripe.js', () => ({ startCheckout: vi.fn(), startCustomerPortal: vi.fn() }));
vi.mock('../../src/lib/supabase.js', () => ({ isConfigured: false, supabase: null, withTimeout: (p) => p }));
vi.mock('../../src/lib/founderSeats.js', () => ({ FOUNDER_SEAT_CAP: 30, fetchFounderSeatsRemaining: vi.fn(async () => 17) }));

const storeState = {
  auth: { tier: 'anon', isFounder: false, displayName: '', loading: false },
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

import AnonTierTeaser from '../../src/components/AnonTierTeaser.jsx';
import PricingPage from '../../src/components/PricingPage.jsx';
import { getVisibleTiers } from '../../src/config/pricing.js';
import { tierPriceSlot } from '../../src/copy/index.js';

/**
 * Every text node under `root`, trimmed, empties dropped.
 * @param {Element} root
 * @returns {string[]}
 */
function textNodes(root) {
  const out = [];
  const walker = root.ownerDocument.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const text = (node.nodeValue || '').trim();
    if (text) out.push(text);
  }
  return out;
}

/** The raw keys a rendered surface is printing at its reader. */
const rawKeysIn = (root) => textNodes(root).filter((text) => RAW_KEY.test(text));

describe('no rendered surface prints a copy key', () => {
  it('the detector discriminates (executed control)', () => {
    // Three of the four assertions in this file say "empty". A detector that stopped
    // matching would produce that too, so it is run here against the real shapes.
    expect(RAW_KEY.test('pricing.tiers.founder.priceLabel')).toBe(true);
    expect(RAW_KEY.test('pricing.tiers.founder.priceSub')).toBe(true);
    expect(RAW_KEY.test('hero.anonCap.spent')).toBe(true);
    // …and against text the product really renders, which must NOT match.
    for (const real of [
      'By invitation', 'Free', 'forever', '$5.99', 'per month',
      'You’ve explored hamlet, village, town.', 'Wanderer', '61–400',
      'Start free', 'Most popular',
    ]) {
      expect(RAW_KEY.test(real), `"${real}" reads as a raw key`).toBe(false);
    }
  });

  it('the Create page at-cap teaser draws every visible tier without a key', () => {
    const { container } = render(<AnonTierTeaser onSignIn={() => {}} />);
    const nodes = textNodes(container);
    // ANTI-VACUITY: the teaser draws a name, a price slot, a tagline, three features
    // and a CTA for each visible tier. A floor well under that still refuses an empty
    // render, which is the shape a thrown lazy chunk would leave behind.
    expect(nodes.length, 'the teaser rendered almost no text — did it throw?')
      .toBeGreaterThanOrEqual(3 * getVisibleTiers().length);
    expect(
      rawKeysIn(container),
      '\nThe Create page teaser is printing copy KEYS at the reader. A key renders when '
      + '`t()` cannot resolve it — usually because a ruling deleted it and a caller still '
      + 'asks. Resolve the slot through copy/index.js (tierPriceSlot / tOptional) and give '
      + 'the surface real words, or restore the key:\n',
    ).toEqual([]);
  });

  it('the pricing page draws its whole catalogue without a key', () => {
    const { container } = render(<PricingPage onNavigate={() => {}} />);
    const nodes = textNodes(container);
    expect(nodes.length, 'the pricing page rendered almost no text — did it throw?')
      .toBeGreaterThanOrEqual(50);
    expect(
      rawKeysIn(container),
      '\nThe pricing page is printing copy KEYS at the reader:\n',
    ).toEqual([]);
  });

  it('every visible tier has a focal slot that is words, not a key', () => {
    // The render arms above only see the tiers a surface chooses to draw; the pricing
    // page filters the Founder out of its row. This asks the resolver directly, for
    // every tier in the catalogue, so a new tier without a price cannot ship a dotted
    // path into whichever surface draws it first.
    const tiers = getVisibleTiers();
    expect(tiers.length, 'the pricing catalogue is empty').toBeGreaterThanOrEqual(3);
    for (const tier of tiers) {
      const { label, sub } = tierPriceSlot(tier.key);
      expect(label.length, `tier "${tier.key}" has an empty focal slot`).toBeGreaterThan(0);
      expect(RAW_KEY.test(label), `tier "${tier.key}" focal slot is a raw key: ${label}`).toBe(false);
      if (sub !== null) {
        expect(RAW_KEY.test(sub), `tier "${tier.key}" sub-line is a raw key: ${sub}`).toBe(false);
      }
    }
  });

  it('the Founder tier carries a standing and NO price keys (the ruling, still held)', () => {
    // A chair is given, never sold (copy/en.js). The cure for the raw keys was NOT to
    // put priceLabel/priceSub back — that would re-arm every surface to quote a price
    // for a thing that is not for sale, which the purchases-locked law also forbids.
    const { label, sub } = tierPriceSlot('founder');
    expect(label).toBe('By invitation');
    expect(sub).toBeNull();
  });
});
