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
import { BOTTOM_NAV_ATTR } from '../../src/lib/chromeInsets.js';

const ROOT = process.cwd();
const APP = readFileSync(join(ROOT, 'src/App.jsx'), 'utf8');
/** components/theme.js, the declared path every surface reads its chrome vocabulary from. */
const THEME = readFileSync(join(ROOT, 'src/components/theme.js'), 'utf8');
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

  test('the bar DECLARES itself, so a measurement can tell its seats from the page', () => {
    // ⭐ THE HOOK THE PHONE REACHABILITY WALK MEASURES BY (e2e/phone-horizontal-overflow.spec.js).
    // That walk judges every control on the page against the TOP OF THIS BAR, and it found
    // the bar by a SHAPE: "the first <nav> whose computed position is fixed". A shape is not
    // a contract, and it failed in both directions at once. It matched — and then convicted
    // the bar's own five seats of sitting under the bar on every route it walked (27 reds,
    // CI job 106141849116: `bottom: 812, past: 45`, five controls, identically on all 27),
    // because a seat in a bar pinned to `bottom: 0` ends at the viewport edge by definition.
    // And the day the bar stops being a fixed <nav>, the shape would match NOTHING, the floor
    // would silently become the viewport bottom, and every route would report clean.
    //
    // So the bar carries the estate's declared attribute idiom (BOTTOM_NAV_ATTR in
    // src/lib/chromeInsets.js, the sibling of FOOTER_LINKS_ATTR on the footer's links row),
    // the walk asserts it found one, and THIS arm is the fast test that reds in seconds where
    // that browser job takes fourteen minutes.
    expect(
      BOTTOM_NAV_ATTR,
      'the bar hook was renamed. That is safe for the e2e walk, which reads it from the same '
      + 'leaf — but this arm and the source arm below spell it, so re-spell them together.',
    ).toBe('data-sf-bottom-nav');
    expect(
      THEME,
      'src/components/theme.js stopped re-exporting BOTTOM_NAV_ATTR from the chromeInsets leaf, '
      + 'so App.jsx can no longer read its chrome vocabulary from the one declared path',
    ).toMatch(/BOTTOM_NAV_ATTR[\s\S]{0,200}?from '\.\.\/lib\/chromeInsets\.js'/);
    expect(
      APP_CODE,
      '\nsrc/App.jsx\'s fixed bottom bar no longer carries BOTTOM_NAV_ATTR. The phone '
      + 'reachability walk finds the bar by that hook and asserts it found one, so the browser '
      + 'suite reds on every public route. Put the hook back on the <nav>; do not loosen the walk.\n',
    ).toMatch(/<nav aria-label="Primary" \{\.\.\.\{ \[BOTTOM_NAV_ATTR\]: '' \}\}/);
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

  /**
   * ⭐⭐ THE FIFTH SEAT'S WORD FITS IN IT (ODQ §934.63 F8).
   *
   * The order this file exists for is the owner's FIVE WORDS. It held the order and said
   * nothing about whether the words could be READ, and one of them could not: the
   * anonymous public-path walk measured "Compendium" at 375 px with `scrollWidth 82`
   * against `clientWidth 71` and `text-overflow: ellipsis` — "COMPEND…" on every page of
   * the phone — while Create (45/45), Library (49/49), Gallery (53/53) and About (42/42)
   * fit exactly. The cause was `flex: 1` on the seat, which is `1 1 0%`: five identical
   * fifths of the viewport, 75 px each, 71 px of content after the 2 px side padding.
   *
   * ⛔ THE ARITHMETIC IS WHY A SMALLER FACE WAS NEVER AN OPTION. 375 / 5 = 75 < 82, so at
   * the 12 px chrome floor no equal-share bar can hold that word at any padding. The floor
   * is §934.24(4)'s and the words are §934.26's; the SHARE is the only one of the three
   * nobody ordered, so the share is what gave.
   *
   * ⚠ THE WIDTHS BELOW ARE A RECORDED BROWSER MEASUREMENT, AND THIS FILE SAYS SO RATHER
   * THAN PRETENDING TO COMPUTE THEM. jsdom lays nothing out; these five numbers come from
   * Chromium at 375x812 with a mobile user agent — REVIEW-P's `walk4-phone.json` §G, the
   * capture `02-landing-phone.png`. What is EXECUTED here is the arithmetic over them and
   * the wiring that makes the arithmetic the one that applies: a hand-copied number with
   * no arm over it is the drift the floor censuses warn about, and an arm with no numbers
   * is not a measurement at all.
   */
  describe('the five seats hold their five words at 375', () => {
    /** Chromium at 375x812, 12 px, uppercase, tracking `normal` (REVIEW-P walk4-phone §G). */
    const MEASURED_LABEL_PX = Object.freeze({
      Create: 45, Library: 49, Compendium: 82, Gallery: 53, About: 42,
    });
    /** App.jsx's seat padding: `padding: ${SP.sm + 2}px 2px` — 2 px each side. */
    const SEAT_SIDE_PAD = 2;
    /** The narrowest viewport the phone bar is claimed at. */
    const PHONE_W = 375;

    test('the measured set IS the bar the owner ordered, so the arithmetic is about this bar', () => {
      // ⛔ ANTI-VACUITY: without this the numbers could outlive the labels they were taken
      // from, and the sums below would go on passing for a bar that no longer exists.
      expect(Object.keys(MEASURED_LABEL_PX)).toEqual(PHONE_BAR_LABELS);
      expect(barNav(true).map((item) => item.label)).toEqual(Object.keys(MEASURED_LABEL_PX));
    });

    test('the five words plus their padding fit the phone, so no seat ellipsises', () => {
      const labels = Object.values(MEASURED_LABEL_PX);
      const needed = labels.reduce((a, b) => a + b, 0) + labels.length * SEAT_SIDE_PAD * 2;
      expect(
        needed,
        `\nThe five phone-bar labels need ${needed}px at the 12px floor and the phone is ${PHONE_W}px wide, so a `
        + 'seat must clip. Neither the words (§934.26, the owner) nor the floor (§934.24(4)) may give; if a '
        + 'label has grown, shorten the LABEL in src/lib/routes.js and re-measure in a browser.\n',
      ).toBeLessThanOrEqual(PHONE_W);
      // …and the widest word, which is the one that clipped, has room on its own seat.
      const slack = (PHONE_W - needed) / labels.length;
      expect(
        MEASURED_LABEL_PX.Compendium + SEAT_SIDE_PAD * 2 + slack,
        'the Compendium seat is narrower than the word it has to draw',
      ).toBeGreaterThanOrEqual(MEASURED_LABEL_PX.Compendium);
      // Every seat still clears the touch floor, which equal share gave for free and
      // content sizing has to be checked for: About is the narrowest word.
      expect(
        MEASURED_LABEL_PX.About + SEAT_SIDE_PAD * 2 + slack,
        'the narrowest seat fell under the 44px touch target',
      ).toBeGreaterThanOrEqual(44);
    });

    test('the seats really are sized by their content in the shipped source', () => {
      // The arithmetic above is only the rule in force while the seat takes its basis
      // from its label. `flex: 1` would silently restore equal fifths and every number
      // above would go on agreeing with itself.
      expect(
        APP_CODE,
        '\nThe phone bar seat is back on equal share (`flex: 1` is `1 1 0%`). At 375px that is 71px of '
        + 'content per seat and "COMPENDIUM" needs 82 — the exact clip ODQ §934.63 F8 recorded.\n',
      ).toMatch(/flex:\s*'1 1 auto'/);
      // anchored: the positive toMatch on the SAME string one line above proves APP_CODE is live and still carries the seat's flex declaration, so this excludes a member from a collection already shown to exist.
      expect(APP_CODE, 'a seat reverted to equal share').not.toMatch(/flex:\s*1\s*,\s*minWidth:\s*0/);
      // The label still measures as one unbroken word, which is what makes its basis its
      // own width rather than a wrapped fragment.
      expect(APP_CODE).toMatch(/whiteSpace:\s*'nowrap'/);
    });
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
