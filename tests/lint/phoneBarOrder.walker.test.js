/**
 * phoneBarOrder.walker.test.js — ONE ORDER EVERYWHERE, AND THE BAR CANNOT DRIFT FROM
 * THE PAINTING.
 *
 * ── THE ORDER (the owner, ODQ §934.26 ADDENDUM) ────────────────────────────────
 * "i swap compendium before gallery because that is also how it is on the desktop
 * arrow." The ruling as built: "The phone bar is Create, Library | Compendium, Gallery,
 * About — the desktop arrow's own order … Built from ONE constant: the bar derives its
 * items from the header's nav order (Realm and Sign In filtered out, About appended),
 * and a walker pins the equality, so the two surfaces cannot drift."
 *
 * ── WHAT WAS THERE BEFORE, AND WHY A COMMENT WOULD NOT HAVE HELD ───────────────
 * App.jsx held `MOBILE_NAV_PRIORITY`, a hand-kept array of five or six view ids, sliced
 * to the seat count. It existed for a real reason — so the seat the cap evicted was
 * About and not whatever happened to fall past the slice — and it carried a SECOND
 * ORDER as a side effect: it named Gallery before Compendium while the painting has
 * them the other way. Nothing reddened, because nothing compared the two surfaces. That
 * is the drift this file exists against, and it is structural: the bar now reads
 * `barNav()` off the same NAV the painting's hit regions are pinned to.
 *
 * ── THE END-TO-END CLAIM ───────────────────────────────────────────────────────
 * tests/components/arrowGeometry.test.js already holds NAV_HIT's keys to NAV's ids in
 * NAV's order — the PAINTING against the table. This file holds the BAR against the
 * painting, through the same table, so the chain runs painted word → NAV → bar with no
 * unpinned link in it. Neither test subsumes the other: that one would stay green if the
 * bar grew a parallel array, and this one would stay green if the painting were re-cut.
 *
 * @enforced-by itself (every arm executes the shipped derivation)
 */

import { describe, expect, test } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { NAV, NAV_FLOW, PHONE_NAV_EXCLUDED, ROUTES, barNav } from '../../src/lib/routes.js';
import { NAV_HIT } from '../../src/components/nav/arrowGeometry.js';

const ROOT = process.cwd();
const APP = readFileSync(join(ROOT, 'src/App.jsx'), 'utf8');
/**
 * App.jsx with its comments stripped. The source arms below ask what the file DOES, and
 * the file legitimately NAMES the retired array in prose to say what it replaced — a
 * check over raw text would red on its own explanation, which is how a walker teaches
 * people to delete the history instead of the code.
 */
const APP_CODE = APP.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^[^\n'"`]*\/\/.*$/gm, '');

/** The owner's words, as the bar must read them at phone width. */
const PHONE_BAR_LABELS = ['Create', 'Library', 'Compendium', 'Gallery', 'About'];

describe('THE PHONE BAR — one order, derived from the painting', () => {
  test('the walk is live: the table, the painting and the bar are all present', () => {
    // ⛔ ANTI-VACUITY. Several arms below compare two derived lists, which an empty
    // table would satisfy trivially.
    expect(NAV.length, 'the nav table is empty — has routes.js moved?').toBeGreaterThanOrEqual(6);
    expect(Object.keys(NAV_HIT).length, 'the painting names no regions').toBe(NAV.length);
    expect(APP.length, 'src/App.jsx is empty').toBeGreaterThan(1000);
  });

  test('the phone bar IS the arrow order minus the filtered items', () => {
    const painted = Object.keys(NAV_HIT);
    const expected = painted.filter((id) => !PHONE_NAV_EXCLUDED.includes(id));
    expect(
      barNav(true).map((item) => item.id),
      '\nThe phone bar and the painted arrow no longer read in the same order (§934.26 addendum: '
      + '"the desktop arrow\'s own order", built from ONE constant).\n'
      + 'Do NOT fix this by reordering the bar: reorder ROUTES `nav.order` in src/lib/routes.js, '
      + 'which both surfaces derive from, or change PHONE_NAV_EXCLUDED if a destination really is '
      + 'leaving the phone.\n',
    ).toEqual(expected);
  });

  test('at phone width the bar is exactly the five the owner named, and the Realm is not among them', () => {
    expect(barNav(true).map((item) => item.label)).toEqual(PHONE_BAR_LABELS);
    // anchored: the five labels above are asserted PRESENT on the same derivation, so a
    // bar that derived nothing at all reds there first — this can only be measuring the
    // Realm's absence.
    expect(barNav(true).some((item) => item.id === 'realm'), 'the Realm is back on the phone').toBe(false);
  });

  test('the TABLET keeps the Realm and every seat, in the same one order', () => {
    // 640 to 1023 px: the painted words have left the header but the Realm is still a
    // destination (the owner: "it can be viewed on a tablet"). Six seats, no filter, and
    // the SAME order the phone reads a subset of — which is what makes it one order.
    expect(barNav(false).map((item) => item.id)).toEqual(Object.keys(NAV_HIT));
    expect(barNav(false).map((item) => item.label))
      .toEqual(['Create', 'Library', 'Realm', 'Compendium', 'Gallery', 'About']);
  });

  test('SIGN IN is filtered by construction, not by a list', () => {
    // The owner's order says the bar filters "Realm and Sign In". Sign In never enters
    // NAV: it is an auth route with no `nav` block. Asserting the structural fact is
    // worth more than adding it to PHONE_NAV_EXCLUDED, where it would read as a rule
    // somebody must maintain.
    const authRoutes = ROUTES.filter((r) => r.feedback === false).map((r) => r.view);
    expect(authRoutes, 'presence control: the auth routes are still declared').toContain('signin');
    const navIds = NAV.map((item) => item.id);
    for (const view of authRoutes) {
      // anchored: navIds is the live nav table's own id list, and the presence control above proved authRoutes still declares signin.
      expect(navIds, `${view} reached the nav table — an auth route must carry no nav block`).not.toContain(view);
    }
  });

  test('App.jsx holds NO parallel nav order: it reads the derivation', () => {
    // Anti-vacuity for the comment stripper: if it ate the file, every negative below
    // would pass on an empty string.
    expect(APP_CODE.length, 'the comment stripper ate src/App.jsx').toBeGreaterThan(APP.length / 3);
    expect(
      /\bbarNav\s*\(/.test(APP_CODE),
      'src/App.jsx no longer calls barNav() — the bar has stopped deriving its items',
    ).toBe(true);
    expect(
      /MOBILE_NAV_PRIORITY/.test(APP_CODE),
      '\nsrc/App.jsx has a hand-kept nav array again. That array is what let the bar and the '
      + 'painting disagree about Compendium and Gallery for as long as they did.\n',
    ).toBe(false);
    // …and no OTHER literal list of view ids either — the shape, not the one name.
    const idLiterals = [...APP_CODE.matchAll(/\[\s*('|")generate\1\s*,/g)];
    expect(idLiterals.map((m) => m[0]), 'a new literal array of nav view ids in App.jsx').toEqual([]);
  });

  test('the hairline falls after the working pair, on the phone only', () => {
    // App.jsx derives the divider's seat from NAV_FLOW rather than counting to two. The
    // rule is re-derived here from the shipped constants, so the two cannot disagree:
    // the first cell whose predecessor does not feed it opens the reference pages.
    const seatOf = (items) => items.findIndex((item, i) => i > 0 && NAV_FLOW[items[i - 1].id] !== item.id);
    const phone = barNav(true);
    expect(seatOf(phone), 'the hairline is not after Create · Library').toBe(2);
    expect(phone[seatOf(phone)].label, 'the reference pages do not begin at Compendium').toBe('Compendium');
    // The source really uses that derivation, and gates it on the phone flag.
    expect(APP_CODE).toMatch(/referenceFrom\s*=\s*mobileNav\.findIndex/);
    expect(APP_CODE).toMatch(/isMobile\s*&&\s*i\s*===\s*referenceFrom/);
    // On the tablet the Realm is still inside the working run, so no rule is drawn there
    // even though the derivation would name a seat.
    expect(seatOf(barNav(false)), 'the tablet run should reach the Realm before it breaks').toBe(3);
  });

  test('the exclusion list names only real views, and nothing already absent', () => {
    // A stale row would read as a rule that is doing work when it is doing none.
    const navIds = NAV.map((item) => item.id);
    for (const id of PHONE_NAV_EXCLUDED) {
      expect(navIds, `PHONE_NAV_EXCLUDED names "${id}", which is not in the nav table`).toContain(id);
    }
    expect(PHONE_NAV_EXCLUDED.length, 'the exclusion list is empty — the Realm is back on the phone').toBeGreaterThanOrEqual(1);
  });

  test('the derivation discriminates (executed control)', () => {
    // Every arm above is an equality between two derived lists. If `barNav` stopped
    // filtering, the phone and tablet lists would be equal and several arms would still
    // read as a sensible order — so the difference itself is asserted.
    expect(barNav(true).length, 'barNav no longer filters anything at phone width')
      .toBe(barNav(false).length - PHONE_NAV_EXCLUDED.length);
    expect(barNav(true)).not.toEqual(barNav(false));
  });
});
