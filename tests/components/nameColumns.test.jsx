/**
 * @vitest-environment jsdom
 *
 * nameColumns.test.jsx — THE COLUMNS, RENDERED (owner order 2026-09-19).
 *
 * The owner attached the Power tab's "Institutions behind this power (25)" — a
 * merchant contender with twenty-five houses behind it, each name on its own
 * full-width line — and asked: "could we also have sections like these be in two
 * or three columns to conserve space?".
 *
 * ── WHAT THIS PINS THAT THE WALKER CANNOT ────────────────────────────────────
 * `tests/lint/nameListColumns.walker.test.js` is a census of the SOURCE: which
 * lists are ruled `columns` and whether their site sits inside the primitive. It
 * cannot know how many columns a reader is given, because that is a function of
 * the viewport and of how long the list actually is. This file renders the real
 * tab at three widths and reads the answer off the DOM.
 *
 * ⛔ THE VIEWPORT IS FAKED PER QUERY, NOT PER BOOLEAN. `useIsMobile(bp)` asks
 * `matchMedia('(max-width: <bp-1>px)')`, and the primitive asks it TWICE at two
 * breakpoints — so a fake that answers one boolean for every query cannot tell a
 * 700px screen from a 1100px one, and the three-width arm would be one arm run
 * three times. The fake below parses the query and compares it to a chosen width,
 * which is what makes these three cases three different renders.
 *
 * ⚠ AND THE WIDTH IS CHANGED THROUGH THE STORE'S OWN CHANGE EVENT, not by
 * reloading the module graph. `useIsMobile` caches ONE store per breakpoint in a
 * module-level Map — deliberately, so the whole app costs one matchMedia listener
 * per breakpoint — and that store reads its `matches` once at creation and then
 * only on `change`. A width set after the first render would therefore be invisible
 * to a second one. `vi.resetModules()` would fix that and introduce a worse
 * problem: a freshly imported component tree carries a freshly imported React,
 * while `render` here came from the first graph. So the fake keeps the listeners
 * and `setViewport` fires them, which is the SHIPPED path a real resize takes.
 * Nothing is mounted at that moment (afterEach cleans up), so no update escapes
 * `act`.
 */
import { afterEach, beforeAll, describe, expect, test, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';

import PowerTab from '../../src/components/new/tabs/PowerTab.jsx';
import {
  COLUMN_LADDER, MIN_ROWS_PER_COLUMN, columnsForWidth,
} from '../../src/components/primitives/NameColumns.jsx';
import { SUPPORT_BASIS } from '../../src/domain/dossier/powerSupport.js';

afterEach(cleanup);

/** Every listener the shared store has registered, with the breakpoint it watches. */
const LISTENERS = [];
let VIEWPORT = 1200;

/** A matchMedia that answers `(max-width: Npx)` against the current viewport width. */
function installViewport() {
  window.matchMedia = vi.fn((query) => {
    const m = /max-width:\s*(\d+)px/.exec(String(query));
    const max = m ? Number(m[1]) : null;
    const on = (fn) => { LISTENERS.push({ max, fn }); };
    return {
      media: query,
      get matches() { return max === null ? false : VIEWPORT <= max; },
      addEventListener: (_type, fn) => on(fn),
      removeEventListener: () => {},
      addListener: on,
      removeListener: () => {},
    };
  });
}

/** Move the viewport and notify the shared store exactly as a real resize does. */
function setViewport(width) {
  VIEWPORT = width;
  for (const { max, fn } of LISTENERS) fn({ matches: max === null ? false : width <= max });
}

beforeAll(installViewport);

/**
 * A merchant contender with `n` aligned houses behind it. Every institution
 * carries `priorityCategory: 'economy'`, which is the signal
 * `institutionBackingFactionName` joins on, so all `n` land in ONE basis group
 * under ONE caption — the shape the owner's screenshot shows.
 * @param {number} n
 */
function settlementWithHouses(n) {
  return {
    id: 'settlement.columnsburg',
    name: 'Columnsburg',
    tier: 'city',
    powerStructure: {
      factions: [
        { faction: 'Merchant Guilds', power: 70, category: 'economy', desc: 'The houses that hold the market.' },
      ],
    },
    institutions: Array.from({ length: n }, (_, i) => ({
      name: `House ${String(i + 1).padStart(2, '0')}`,
      priorityCategory: 'economy',
    })),
  };
}

/** Render PowerTab at `width` with the power card already open, and hand back its detail. */
function openSupportAt(width, n = 25) {
  setViewport(width);
  const s = settlementWithHouses(n);
  render(<PowerTab powerStructure={s.powerStructure} settlement={s} narrativeNote={null} />);
  const card = screen.getByRole('button', { name: 'Merchant Guilds power details' });
  fireEvent.click(card);
  const detail = document.getElementById(card.getAttribute('aria-controls'));
  expect(detail, 'the power card did not open').toBeTruthy();
  return detail;
}

/** The one columned box inside `detail`, and the count it declares. */
function columnsIn(detail) {
  const boxes = detail.querySelectorAll('[data-name-columns]');
  expect(boxes.length, 'the support list does not render through NameColumns').toBe(1);
  return {
    box: boxes[0],
    declared: Number(boxes[0].getAttribute('data-name-columns')),
    styled: String(boxes[0].style.columnCount),
  };
}

// ── the ladder, as arithmetic ────────────────────────────────────────────────

describe('NameColumns — the ladder', () => {
  test('the ladder is widest-first and floored at zero', () => {
    // Without this, a ladder reordered by an edit would silently give a 1200px
    // screen one column (the first rung it matches) and every arm below would
    // still be about "the number the ladder said".
    const widths = COLUMN_LADDER.map((r) => r.minWidth);
    expect([...widths].sort((a, b) => b - a)).toEqual(widths);
    expect(widths[widths.length - 1], 'the ladder has no floor rung, so a narrow box falls off it').toBe(0);
  });

  test('three columns wide, two in the middle, one on the phone', () => {
    expect(columnsForWidth(1200)).toBe(3);
    expect(columnsForWidth(900)).toBe(3);
    expect(columnsForWidth(899)).toBe(2);
    expect(columnsForWidth(600)).toBe(2);
    expect(columnsForWidth(599)).toBe(1);
    expect(columnsForWidth(375)).toBe(1);
  });

  test('the rows-per-column floor is what stops three columns of two', () => {
    expect(MIN_ROWS_PER_COLUMN).toBeGreaterThanOrEqual(2);
    // 6 rows / 3 per column = 2 columns even at the widest rung.
    expect(Math.min(columnsForWidth(1200), Math.floor(6 / MIN_ROWS_PER_COLUMN))).toBe(2);
    expect(Math.min(columnsForWidth(1200), Math.floor(25 / MIN_ROWS_PER_COLUMN))).toBe(3);
  });
});

// ── the Power tab's own list, rendered at three widths ───────────────────────

describe('the Power tab support list — 25 houses at three widths', () => {
  test('a wide screen lays the twenty-five names in THREE columns', () => {
    const detail = openSupportAt(1200);
    const { declared, styled } = columnsIn(detail);
    expect(declared).toBe(3);
    expect(styled).toBe('3');
  });

  test('a mid screen lays them in TWO', () => {
    const detail = openSupportAt(700);
    const { declared, styled } = columnsIn(detail);
    expect(declared).toBe(2);
    expect(styled).toBe('2');
  });

  test('the phone keeps ONE column — the identity layout', () => {
    const detail = openSupportAt(375);
    const { declared, styled } = columnsIn(detail);
    expect(declared).toBe(1);
    expect(styled).toBe('1');
  });

  test('every name renders exactly once, and the basis caption exactly once', () => {
    const detail = openSupportAt(1200);
    // ⛔ THE ARM THE COLUMNS COULD BREAK. Laying a list in columns must not
    // duplicate a row or drop one, and it must not re-open the stutter the
    // 2026-09-18 car closed: the caption is said ONCE for the whole group however
    // many columns its names are spread across.
    for (let i = 1; i <= 25; i += 1) {
      const name = `House ${String(i).padStart(2, '0')}`;
      expect(within(detail).getAllByText(name), `${name} does not render exactly once`).toHaveLength(1);
    }
    expect(
      within(detail).getAllByText(SUPPORT_BASIS.aligned.merchant),
      'the group caption is repeated — the per-row stutter is back',
    ).toHaveLength(1);
    expect(within(detail).getByText(/Institutions behind this power \(25\)/)).toBeTruthy();
  });

  test('no row may be split across a column boundary', () => {
    const detail = openSupportAt(1200);
    const { box } = columnsIn(detail);
    const wrappers = [...box.children];
    expect(wrappers.length, 'the wrappers are not one per row').toBe(25);
    for (const wrapper of wrappers) {
      expect(wrapper.style.breakInside, 'a row may be sliced across a column').toBe('avoid');
    }
  });

  test('a SHORT list stays single-column however wide the screen is', () => {
    // The primitive's own floor: five houses is not a roster, and three columns
    // of one or two is a caption with orphans under it.
    const detail = openSupportAt(1200, 5);
    const { declared } = columnsIn(detail);
    expect(declared).toBe(1);
    expect(within(detail).getAllByText(SUPPORT_BASIS.aligned.merchant)).toHaveLength(1);
  });
});
