/** @vitest-environment jsdom */
/**
 * servicesInstitutionCardNesting.test.jsx — A MODAL MAY NOT OPEN INSIDE A `<p>`.
 *
 * ⛔ THE DEFECT THIS PINS (reported 2026-09-18 as twelve React errors on the
 * Services tab). `primitives/InstitutionLink` renders a fragment: the inline
 * trigger, and BESIDE IT the `InstitutionCard` popover — a `<section
 * role="dialog">` holding a `<header>`, an `<h2>`, its own `<p>`s, `<div>`s and
 * a `<ul>`. The card is rendered in place rather than portalled, so it lands
 * wherever the trigger sits. `serviceComponents.jsx` put the institution
 * attribution line in a `<p>`, so opening a service entry's institution put a
 * whole dialog inside a paragraph and React's DOM-nesting validator printed one
 * error per block element:
 *
 *   In HTML, <h2> cannot be a descendant of <p>. This will cause a hydration error.
 *
 * It is not cosmetic. `</p>` is implied by any block start tag in the HTML
 * parser, so the markup the browser would build from this on a hydrating render
 * is not the tree React thinks it built.
 *
 * ⚠ THE PIN IS ON THE CONSOLE, BECAUSE THAT IS WHERE THE DEFECT SPEAKS. A DOM
 * assertion could not see it: React puts the dialog inside the paragraph in the
 * live DOM quite happily (nesting rules govern PARSING, not appendChild), so
 * the tree looks right and only the validator objects. Spying on console.error
 * is the one reader of the actual fault.
 *
 * ⚠ ANTI-VACUITY. A test that clicked nothing, or clicked something that opened
 * nothing, would pass while proving nothing — which is the exact way a console
 * pin goes quiet. Three floors, asserted BEFORE the console is judged: the tab
 * must render at least one institution trigger, the click must actually open a
 * dialog, and that dialog must carry the heading that is the offending element.
 */

import { afterEach, beforeAll, beforeEach, describe, expect, test, vi } from 'vitest';
import { cleanup, fireEvent, render } from '@testing-library/react';

vi.mock('../../src/lib/supabase.js', () => ({ supabase: {}, isConfigured: false }));

import { ServicesTab } from '../../src/components/new/tabs/ServicesTab.jsx';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';

/** React's own wording for the defect, in every version that has shipped it. */
const NESTING_ERROR = /cannot be a descendant of|validateDOMNesting/i;

// A REAL pipeline settlement: the institution trigger only appears where a
// service resolves to an institution that yields a derived contribution (the
// link's own honesty gate), which a hand fixture does not reproduce.
let town;
beforeAll(() => {
  town = generateSettlementPipeline(
    { settType: 'city', terrain: 'grassland', tradeRouteAccess: 'road' },
    null,
    { seed: 'services-institution-card-nesting', customContent: {} },
  );
}, 120_000);

let errors;
beforeEach(() => {
  errors = [];
  vi.spyOn(console, 'error').mockImplementation((...args) => { errors.push(args.join(' ')); });
  window.matchMedia = vi.fn((query) => ({
    media: query,
    matches: false,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
  }));
});
afterEach(() => { vi.restoreAllMocks(); cleanup(); });

describe('the institution card on the Services tab', () => {
  test('opens without nesting a dialog inside a paragraph', () => {
    const { container } = render(
      <ServicesTab services={town.availableServices} settlement={town} narrativeNote={null} />,
    );

    // ── ANTI-VACUITY, asserted before the console is judged ──────────────────
    const triggers = [...container.querySelectorAll('[aria-haspopup="dialog"]')];
    expect(triggers.length, 'the Services tab offered no institution to expand')
      .toBeGreaterThan(0);

    fireEvent.click(triggers[0]);

    const dialog = container.querySelector('[role="dialog"]');
    expect(dialog, 'clicking the institution opened no card').toBeTruthy();
    expect(dialog.querySelector('h2'), 'the card opened without its heading — the element the defect is about')
      .toBeTruthy();

    // ── THE PIN ──────────────────────────────────────────────────────────────
    // Stated twice on purpose, because the two readers fail differently. This one
    // is structural and survives any change in React's console wording; the one
    // below is the defect's own voice and catches a block element this assertion
    // does not name.
    expect(
      dialog.closest('p'),
      'the institution card opened inside a <p> — give the caller a block container',
    ).toBeNull();

    const nesting = errors.filter(line => NESTING_ERROR.test(line));
    expect(
      nesting,
      `\n${nesting.length} DOM-nesting error(s) while an institution card was open.\n`
      + 'The card is a block-level dialog rendered beside its trigger, so no caller '
      + 'of InstitutionLink may wrap it in a <p>:\n'
      + `${nesting.join('\n')}\n`,
    ).toEqual([]);
  }, 60_000);
});
