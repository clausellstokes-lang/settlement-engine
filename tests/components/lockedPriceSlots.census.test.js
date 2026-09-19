/**
 * lockedPriceSlots.census.test.js — WHAT EVERY TIER CARD'S FOCAL SLOT SAYS WHILE
 * PURCHASES ARE LOCKED.
 *
 * ── THE ORDER ──────────────────────────────────────────────────────────────────
 * ODQ §934.24(3), the owner's words: "the Founder card under the purchase lock says what
 * it means — 'A founding place, held until launch' — not a price that does not resolve."
 * The chair's build order widened that to a CENSUS: name every other tier-card slot that
 * would print a price while purchases are locked, and rule on each.
 *
 * ── WHY A CENSUS AND NOT A SWEEP ───────────────────────────────────────────────
 * The three slots are not the same kind of thing, and the difference is the whole point:
 *
 *   Wanderer      "Free / forever"      quotes NO money. Nothing about it is waiting for
 *                                       launch; it is true today and true after.
 *   Cartographer  "$5.99 / per month"   quotes money, and the money is OWNER-SIGNED.
 *   Founder       a STANDING, not a price — a chair is given, never sold.
 *
 * A blanket "no numbers until launch" would have taken the published subscription price
 * off the pricing page, which is a different decision from the one the owner made, and
 * an owner-gated one (below). So the register rules per slot and REDS IN BOTH DIRECTIONS:
 * a slot that starts quoting money reds, and a slot that stops reds too.
 *
 * ⛔ THE ONE ROW THIS LANE DID NOT CHANGE, AND WHY — RECORDED, NOT DECIDED.
 * Cartographer's "$5.99" is not a loose literal. src/config/pricing.js carries it as
 * `priceCents: 599` with the note "reconciled to the displayed price (owner sign-off
 * 2026-07-17)", so the DISPLAYED price is itself owner-signed. And the launch lock's own
 * order (the owner, 2026-09-16) names the CONTROL as what wears the lock's mark: "all
 * buttons for purchase, including subscriptions, are to have a pill that says Available
 * at launch" — which this card already does (AvailableAtLaunchPill on a disabled CTA,
 * pinned in tests/components/launchLock.pricing.test.jsx). Replacing a signed, published
 * price with a locked-state phrase is a paid-surface change past both recorded owner
 * words, so it is left standing and written down here instead of taken quietly. Flipping
 * it later is one edit to this row and one to the dictionary.
 *
 * @enforced-by itself (every arm executes the shipped resolver over the real catalogue)
 */

import { describe, expect, test } from 'vitest';

import { getVisibleTiers } from '../../src/config/pricing.js';
import { en, tierPriceSlot, tOptional } from '../../src/copy/index.js';
import { purchasesOpen } from '../../src/lib/launchGate.js';

/** Anything that reads as money: a currency mark or a bare number. */
const QUOTES_MONEY = /[$£€]|\d/;
/** The recurrence vocabulary a locked slot may not wear. */
const RECURRENCE = /per month|\/mo\b|monthly|per year|annually/i;

/**
 * ⭐ THE REGISTER — every visible tier's focal slot, its ruling under the lock, and the
 * exact words. `money: true` means the slot legitimately quotes a figure today.
 */
const SLOTS = Object.freeze({
  wanderer: Object.freeze({
    label: 'Free',
    sub: 'forever',
    money: false,
    ruling: 'NOT A PRICE. "Free / forever" quotes no figure and names no recurrence; it is '
      + 'as true under the lock as after it, so the lock has nothing to say about it.',
  }),
  cartographer: Object.freeze({
    label: '$5.99',
    sub: 'per month',
    money: true,
    ruling: 'OWNER-GATED, UNCHANGED (see the header). The displayed price is owner-signed '
      + '(config/pricing.js priceCents 599, "reconciled to the displayed price, owner '
      + 'sign-off 2026-07-17") and the launch lock\'s own order puts the mark on the '
      + 'CONTROL, not on the price. This lane records the question rather than answering it.',
  }),
  founder: Object.freeze({
    label: 'A founding place, held until launch',
    sub: 'Opens with the launch',
    money: false,
    ruling: "THE OWNER'S APPROVED WORDS, §934.24(3). A chair is given, never sold, so the "
      + 'slot carries a STANDING; priceLabel/priceSub stay DELETED, because a key named '
      + 'price* is a key something can render as one.',
  }),
});

const TIERS = getVisibleTiers();

describe('THE TIER-CARD SLOTS UNDER THE PURCHASE LOCK', () => {
  test('the walk is live: the catalogue, the lock and the resolver are all real', () => {
    // ⛔ ANTI-VACUITY: several arms iterate the catalogue, which an empty one satisfies.
    expect(TIERS.length, 'the pricing catalogue is empty').toBeGreaterThanOrEqual(3);
    expect(
      purchasesOpen({ VITE_PURCHASES_OPEN: 'true' }),
      'the launch gate no longer opens for its own flag — the lock this census is about has moved',
    ).toBe(true);
    // The shipped build: closed. If this ever reads open, the census still holds (the
    // rulings are about what the words SAY), but the reader should know which world
    // they are in, so it is asserted rather than assumed.
    expect(purchasesOpen(), 'purchases are OPEN in this build — re-read every ruling below').toBe(false);
    // The two detectors are executed against real strings, in both directions.
    expect(QUOTES_MONEY.test('$5.99')).toBe(true);
    expect(QUOTES_MONEY.test('A founding place, held until launch')).toBe(false);
    expect(RECURRENCE.test('per month')).toBe(true);
    expect(RECURRENCE.test('forever')).toBe(false);
  });

  test('the register is EXACT over the catalogue: no tier unruled, no stale row', () => {
    expect(TIERS.map((tier) => tier.key).sort()).toEqual(Object.keys(SLOTS).sort());
  });

  test('every slot renders the words its row claims, through the ONE resolver', () => {
    const rendered = Object.fromEntries(TIERS.map((tier) => {
      const { label, sub } = tierPriceSlot(tier.key);
      return [tier.key, { label, sub }];
    }));
    const expected = Object.fromEntries(
      Object.entries(SLOTS).map(([key, row]) => [key, { label: row.label, sub: row.sub }]),
    );
    expect(
      rendered,
      '\nA tier card\'s focal slot changed while purchases are locked.\n'
      + 'If the change is intended, move the row in SLOTS above in the SAME commit and say '
      + 'which order authorised it. The Cartographer row is OWNER-GATED: its displayed price '
      + 'is owner-signed (config/pricing.js) and removing it is a paid-surface decision, not '
      + 'a copy edit.\n',
    ).toEqual(expected);
  });

  test('no slot quotes money except the one the register admits', () => {
    const quoting = TIERS
      .map((tier) => ({ key: tier.key, ...tierPriceSlot(tier.key) }))
      .filter((slot) => QUOTES_MONEY.test(slot.label) || QUOTES_MONEY.test(slot.sub ?? ''))
      .map((slot) => slot.key);
    expect(
      quoting,
      '\nA tier card slot quotes a figure while purchases are locked, and the register does not '
      + 'admit it. Either give the tier its locked state in words (the Founder\'s shape), or add '
      + 'a row here naming the authority for the figure.\n',
    ).toEqual(Object.entries(SLOTS).filter(([, row]) => row.money).map(([key]) => key));
  });

  test('the FOUNDER carries the owner\'s words, no number and no recurrence', () => {
    // ⚠ WHERE THESE WORDS RENDER TODAY, SAID PLAINLY. A later order the same day took the
    // Founder off the public path entirely (config/pricing.js `invitationOnly`, censused
    // in tests/components/invitationOnlyTiers.census.test.jsx), so NO production surface
    // currently draws this slot: the teaser no longer lists the tier and the pricing
    // page's charter band is a different object with its own copy. The words are kept
    // because they are the owner's approved answer for the slot, and because the resolver
    // must have one the moment an invited surface draws the tier — but they are the
    // RESOLVER's answer now, not a rendered string, and this file says so rather than
    // letting a green arm read as coverage of something on screen.
    const { label, sub } = tierPriceSlot('founder');
    expect(label).toBe('A founding place, held until launch');
    expect(sub).toBe('Opens with the launch');
    expect(QUOTES_MONEY.test(label), 'the Founder slot quotes a figure').toBe(false);
    expect(RECURRENCE.test(`${label} ${sub}`), 'the Founder slot names a recurrence').toBe(false);
    // ⛔ THE STANDING RULING, STILL HELD: the cure was never to restore the price keys.
    expect(tOptional('pricing.tiers.founder.priceLabel'), 'the Founder tier grew a priceLabel again').toBeNull();
    expect(tOptional('pricing.tiers.founder.priceSub'), 'the Founder tier grew a priceSub again').toBeNull();
  });

  test('the two ladders never mix: a slot reads as a price OR as a standing, never half of each', () => {
    for (const tier of TIERS) {
      const row = en.pricing.tiers[tier.key];
      const isPriced = typeof row.priceLabel === 'string';
      expect(
        typeof row.standingSub === 'string' && isPriced,
        `tier "${tier.key}" carries BOTH a price and a standing sub-line — the slot would `
        + 'print one ladder\'s label over the other\'s sub-line',
      ).toBe(false);
      const { sub } = tierPriceSlot(tier.key);
      if (sub !== null) {
        expect(sub, `tier "${tier.key}" resolved a sub-line from the other ladder`)
          .toBe(isPriced ? row.priceSub : row.standingSub);
      }
    }
  });

  test('THE ADJACENT MONEY SURFACES are named, so nothing is hidden by scope', () => {
    // The order's rule is about TIER CARD slots. These two also print figures under the
    // lock and are deliberately out of that rule's scope — a one-time dossier and the
    // credit packs are priced offers, not plan standings. They are enumerated here so
    // "the census covered the tier cards" cannot be read as "nothing else quotes money",
    // and so a chair asking the wider question has the list already measured.
    expect(en.pricing.singleDossier.priceLabel).toBe('$2.99');
    expect(en.pricing.creditPacks.perEach).toBe('{price}/ea');
    // Both wear the lock where the owner's 2026-09-16 order put it — on the control.
    // (The controls themselves are pinned in tests/components/launchLock.pricing.test.jsx;
    // this arm only holds the LIST, so a third money surface appearing is visible here.)
    const moneyRows = Object.keys(en.pricing).filter((key) => {
      const block = en.pricing[key];
      return block && typeof block === 'object' && typeof block.priceLabel === 'string';
    });
    expect(moneyRows, 'a NEW priced block appeared under pricing.* — rule on it').toEqual(['singleDossier']);
  });
});
