/**
 * @vitest-environment jsdom
 *
 * servicesImpairedHouseLine.test.jsx — DS-SUP-3's SECOND LENS, JOINED TO ITS ROW
 * (owner order 2026-09-19: "some other sections need the same adjustment" — the
 * adjustment the Defense tab already has).
 *
 * ── THE DEFECT ───────────────────────────────────────────────────────────────
 * `services.catalogStanding` draws TWO lenses of DS-SUP-3. Lens A is about the
 * CATALOG — where the town stands against what a place its rung is expected to
 * keep — and frames the catalog correctly. Lens B names ONE HOUSE, by name
 * (`{institution}`, filled from ServicesTab's own impairment sets), and it
 * printed in the same paragraph at the TOP of the tab: a sentence about a
 * particular building, a screen and a half above the row that building's service
 * sits on, leaving the reader to pair the two by searching for a name. That is
 * the shape the owner reported on the Defense tab's threat sentences, and the
 * cure there is the model: the sentence renders UNDER the row it is about.
 *
 * ── WHAT IS PINNED, AND WHY BOTH HALVES ──────────────────────────────────────
 * PRESENCE alone would pass if the sentence were rendered twice; ABSENCE alone
 * would pass if the desk fell silent and the page printed nothing anywhere. So
 * the arms are: the sentence reaches the reader EXACTLY ONCE, inside the joined
 * element; and the POSITION paragraph, proven live by lens A, does not carry it.
 *
 * ⚠ THE SENTENCES ARE COMPUTED THROUGH THE SHIPPED READ PATH, never written out
 * (tests/helpers/drawnProse.js, and `tests/lint/proseDrawnAnchors.walker.test.js`
 * refuses a literal). Which member a pool draws is a function of the seed and the
 * draw rule, so a literal anchor reds on a re-index while the thing it guards is
 * perfectly well.
 */
import { afterEach, describe, expect, test } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';

import { ServicesTab } from '../../src/components/new/tabs/ServicesTab.jsx';
import { deriveNotableAbsences } from '../../src/domain/display/servicesDisplay.js';
import {
  impairedServicePoolKey, serviceCatalogPoolKey,
} from '../../src/domain/display/stateProse/economyStateProse.js';
import { drawnMember, poolMemberTexts } from '../helpers/drawnProse.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

afterEach(cleanup);

const SEED = 'impairburg-1';
const HOUSE = 'The Ironworks';
const TOWN = 'Impairburg';

/**
 * ⚠ THE CATALOG IS A MAP, NOT A LIST OF KEYS. `deriveNotableAbsences(tier, map)`
 * asks `Array.isArray(map[k]) && map[k].length` of each expected category, so a
 * fixture that handed it an ARRAY of category names would read EVERY category as
 * missing and the catalog lens would draw the food-gap pool for a town with a
 * tavern. The same object is the tab's `services` prop, so the desk's reading and
 * the rendered catalog are one catalog rather than two that happen to agree.
 *
 * A town tier expects food, healing, equipment, information and lodging; this one
 * keeps four of the five.
 */
const SERVICES = Object.freeze({
  equipment: [
    { name: 'Smith', institution: HOUSE },
    { name: 'Wheelwright', institution: 'The Wheel Yard' },
  ],
  food: [{ name: 'Tavern' }],
  healing: [{ name: 'Herbalist' }],
  lodging: [{ name: 'Common room' }],
});

/**
 * A town whose smithy is open and short of what it works with. The dependency is
 * `critical`, which is what `computeChainSets` turns into the IMPAIRED set, and
 * the impaired service names `The Ironworks` as its institution — the join key.
 */
function settlement() {
  return {
    id: 'settlement.impairburg',
    _seed: SEED,
    name: TOWN,
    tier: 'town',
    config: { tradeRouteAccess: 'road' },
    availableServices: SERVICES,
    institutions: [
      { name: HOUSE, category: 'economy', priorityCategory: 'economy' },
    ],
    economicState: {
      tradeDependencies: [{
        institution: HOUSE,
        resource: 'iron',
        impact: 'The ore road is cut at the pass.',
        severity: 'critical',
        affectedServices: ['Smith'],
      }],
    },
  };
}

/** The two sentences this position draws, through the shipped read path. */
function drawnPair(s) {
  const shared = {
    leaf: 'economy', blockId: 'DS-SUP-3', seed: SEED, audience: 'dm',
    slots: { settlement: TOWN, institution: HOUSE },
  };
  return {
    catalog: drawnMember({
      ...shared,
      poolKey: serviceCatalogPoolKey(deriveNotableAbsences(s.tier, s.availableServices), s.tier),
    }),
    impaired: drawnMember({ ...shared, poolKey: impairedServicePoolKey(HOUSE) }),
  };
}

const renderTab = (s) => render(
  <ServicesTab services={SERVICES} settlement={s} narrativeNote={null} />,
);

describe('ServicesTab — the impaired house is named where its row is', () => {
  test('the fixture really produces an impaired house (the join has a subject)', () => {
    // ⛔ WITHOUT THIS, EVERY ARM BELOW IS ABOUT A TOWN WITH NOTHING WRONG WITH IT.
    // `computeChainSets` is what turns the dependency into the impairment set, and
    // a shape change there would make the join silent and the negatives vacuous.
    expect(impairedServicePoolKey(HOUSE)).toBe('A CATEGORY PRESENT BUT ITS CHAIN IMPAIRED');
    const { impaired, catalog } = drawnPair(settlement());
    expect(catalog.length).toBeGreaterThan(0);
    expect(impaired.length).toBeGreaterThan(0);
    expect(impaired).not.toBe(catalog); // anchored: both are non-empty drawn members of the same block, proven on the two lines above; two lenses that drew one sentence would make the join untestable.

    // ⛔ THE POOL IS ABOUT THE HOUSE; THE DRAWN MEMBER NEED NOT SAY SO, AND AN ARM
    // THAT DEMANDED IT WAS WRONG RATHER THAN STRICT. Of this pool's three variants
    // two name `{institution}` and the `[street]` one deliberately does not ("The
    // house is still there and cannot do half of what it is known for…") — a
    // perfectly good sentence about a house the ROW names. Asserting the drawn text
    // carried the name made the arm a function of the seed, which is exactly the
    // brittleness tests/helpers/drawnProse.js exists to remove. The real claim is
    // that this pool is the one whose subject is a named house AND that this slot
    // bag can fill it, and that is a property of the POOL, not of the draw.
    const members = poolMemberTexts({
      leaf: 'economy', blockId: 'DS-SUP-3', seed: SEED, audience: 'dm',
      poolKey: impairedServicePoolKey(HOUSE),
      slots: { settlement: TOWN, institution: HOUSE },
    });
    expect(
      members.some((text) => text.includes(HOUSE)),
      'no member of the impaired-house pool names the house — the `{institution}` slot is unfilled '
      + 'or the pool key resolves somewhere else, and the join below would be about nothing',
    ).toBe(true);
    expect(members).toContain(impaired); // the drawn member is one of this pool's own

    renderTab(settlement());
    expect(screen.getByText('Smith'), 'the impaired service row does not render').toBeTruthy();
  });

  test('the sentence reaches the reader EXACTLY ONCE, inside the joined element', () => {
    const s = settlement();
    const { impaired } = drawnPair(s);
    renderTab(s);
    const found = screen.getAllByText(impaired);
    expect(found, 'the impaired-house sentence is printed more than once, or not at all').toHaveLength(1);
    expect(
      found[0].closest('[data-testid="services-impaired-house-line"]'),
      'the sentence renders somewhere other than the row it was joined to',
    ).toBeTruthy();
  });

  test('it renders UNDER the impaired house\'s own row, not above the list', () => {
    const s = settlement();
    const { impaired } = drawnPair(s);
    renderTab(s);
    const joined = screen.getByTestId('services-impaired-house-line');
    const row = screen.getByText('Smith');
    // The joined element follows the row in document order, and both sit in the
    // same category list — which is what "under its row" means in the DOM.
    expect(
      row.compareDocumentPosition(joined) & Node.DOCUMENT_POSITION_FOLLOWING,
      'the sentence does not follow the row it is about',
    ).toBeTruthy();
    expect(joined.textContent).toContain(impaired);
  });

  test('it is OUTSIDE every control — nothing lengthens a button\'s accessible name', () => {
    // The Defense idiom's own constraint: the sentence sits in the card, not in
    // the toggle, so no reader hears a paragraph read out as a button's name.
    const s = settlement();
    const { impaired } = drawnPair(s);
    renderTab(s);
    const joined = screen.getByTestId('services-impaired-house-line');
    expect(joined.closest('button'), 'the sentence is inside a control').toBeNull();
    const controls = screen.getAllByRole('button');
    expect(controls.length, 'the tab rendered no controls, so the exclusion below is vacuous').toBeGreaterThan(0);
    for (const button of controls) {
      // anchored: the sentence is proven present in the joined element above and the control list is proven non-empty on the line above, so an empty text or a vanished sentence cannot pass this.
      expect(button.textContent || '', 'a control now reads the corpus sentence aloud').not.toContain(impaired);
    }
  });

  test('the POSITION paragraph keeps lens A and no longer carries lens B', () => {
    const s = settlement();
    const { catalog, impaired } = drawnPair(s);
    renderTab(s);
    // The position block, located by the lens it still draws. Its own paragraph is
    // the collection under test, and lens A is the liveness anchor: a desk that
    // fell silent would empty it and make this negative vacuous.
    const positionBlock = screen.getByText(catalog).closest('div');
    expect(positionBlock, 'the catalog paragraph is gone — the position fell silent').toBeTruthy();
    expectAbsentWithAnchor(
      positionBlock.textContent, impaired, catalog,
      'DS-SUP-3 lens B left the catalog paragraph for the row it names',
    );
  });

  test('a town with no impaired house draws nothing there (R-DST-K)', () => {
    const s = settlement();
    s.economicState.tradeDependencies = [];
    renderTab(s);
    expect(
      screen.queryByTestId('services-impaired-house-line'),
      'the join renders an empty element for a town with nothing short',
    ).toBeNull();
    // …and the catalog lens still speaks, so the silence above is about lens B
    // alone rather than about a desk that stopped being called.
    expect(screen.getByText(drawnPair(s).catalog)).toBeTruthy();
  });
});
