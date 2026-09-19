/**
 * publicChromeFloor.census.test.js — THE PHONE FLOORS REACH THE PUBLIC CHROME:
 * THE BOTTOM NAV AND THE CREATE PAGE.
 *
 * The floor law (src/design/proseScale.js) was written for the dossier and enforced
 * only there — tests/components/phoneChromeFloor.census.test.js governs
 * `src/components/new` and nothing else, and its own boundary ruling says so in the
 * plainest terms: the primitives, the perimeter and the brand mark are OUT because
 * "the phone floors are not the ruling in force" on them.
 *
 * On 2026-09-19 a browser walk at 391px counted THIRTY-THREE text leaves below the
 * 12px chrome floor on /create alone (ODQ §934.22 item 2). Among them: every label
 * in the primary nav at 10px — Create, Library, Realm, Gallery, Compendium — the
 * tier gauge's population bands ("61–400") at 10px, and "You've explored hamlet,
 * village, town.", "forever" and "per month" at 11px. None of it was the dossier, so
 * none of it was measured, so none of it reddened.
 *
 * ⭐ THIS CENSUS IS THE SAME RULE OVER A DIFFERENT SURFACE. The scanner is imported
 * from ./phoneFloorCensus.shared.mjs — the dossier census's own, lifted so the two
 * cannot drift into two rules wearing one name. Every `fontSize` whose literal is
 * below the chrome floor must pass through `chromeFontSize` or `proseFontSize`, or
 * carry a written `// phone-floor:` ruling.
 *
 * ⛔ A ROSTER OF FILES, NOT A DIRECTORY, AND THAT IS FORCED BY THE SURFACES. The
 * dossier census can say "src/components/new" because one tree draws one thing. The
 * public chrome does not work that way: the primary nav lives in src/App.jsx, the
 * Create hero in src/components/HomeHero.jsx, its pricing cards one directory over,
 * its sample strip in src/components/generate/. A directory rule would either miss
 * them or swallow the whole estate. So the roster names each file WITH THE SURFACE IT
 * DRAWS, and every entry is asserted to exist — a renamed or moved file reds here
 * instead of silently leaving the census.
 *
 * ⛔ AND THE BASELINES ARE EXACT IN BOTH DIRECTIONS. Per file, the number of sites on
 * each helper. More than the row claims is a new sub-floor size wrapped without a
 * reader looking at it; FEWER is a floored line that has gone back to a bare literal
 * or left the surface. Both take a re-measure and a note, which is the point.
 *
 * ⚠ WHAT NO TEST HERE CAN SEE, SAID PLAINLY. jsdom computes no layout, so nothing
 * below proves the 391px page stopped overflowing, or that a 12px "COMPENDIUM" still
 * fits its fifth of a phone before the ellipsis takes it. Those are measurements for
 * a browser and the chair re-walks them. What IS proved here is the wiring, which is
 * content-independent: every sub-floor size on these surfaces now passes through a
 * helper that cannot return less than the floor on a phone, and returns the desktop
 * size unchanged above the breakpoint.
 */

import { describe, expect, test } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import {
  PHONE_CHROME_FLOOR, SUB_FLOOR_KEYS, censusOfSource, emptyCensus,
} from './phoneFloorCensus.shared.mjs';
import { PHONE_PROSE_FLOOR, chromeFontSize, proseFontSize } from '../../src/design/proseScale.js';
import { legacy } from '../../src/design/tokens.js';

const ROOT = process.cwd();

/**
 * ⭐ THE ROSTER — each file, the surface it draws, and its EXACT census.
 *
 * `chrome` / `prose` are the counts of sub-floor sizes routed through each helper;
 * `ruled` counts bare sites carrying a written `// phone-floor:` ruling. A file with
 * all three at zero is here because it is PART OF THE SURFACE and must stay measured:
 * the day someone writes an 11px line into it, this census is already watching.
 */
const ROSTER = Object.freeze({
  'src/App.jsx': {
    surface: "the phone's bottom bar — the WHOLE of the primary nav below 1024px, where the painted words leave the header",
    chrome: 1, prose: 0, ruled: 0,
  },
  'src/components/HomeHero.jsx': {
    surface: 'the /create hero: the tier gauge (station labels + population bands) and the at-cap unlock block',
    chrome: 1, prose: 3, ruled: 0,
  },
  'src/components/AnonTierTeaser.jsx': {
    surface: "the /create pricing cards shown once an anonymous visitor is capped — the Founder card's own defect line",
    chrome: 2, prose: 2, ruled: 0,
  },
  'src/components/generate/WizardEmptyState.jsx': {
    surface: 'the /create landing frame that mounts the hero and the mode picker',
    chrome: 0, prose: 0, ruled: 0,
  },
  'src/components/generate/ModeSelector.jsx': {
    surface: "the /create Basic/Advanced picker",
    chrome: 0, prose: 0, ruled: 0,
  },
  'src/components/generate/ClerkNote.jsx': {
    surface: 'the rubric-headed notice every Create surface raises for a failure or a refusal',
    chrome: 1, prose: 0, ruled: 0,
  },
  'src/components/generate/FoundingWorlds.jsx': {
    surface: 'the /create sample strip: each card name, its size·terrain meta, its teaser and its tags',
    chrome: 2, prose: 1, ruled: 0,
  },
  'src/components/home/WelcomeBackCard.jsx': {
    surface: "the signed-in /create card above the hero",
    chrome: 1, prose: 0, ruled: 0,
  },
});

function censusOfRoster() {
  const all = { ...emptyCensus(), files: 0 };
  /** @type {Record<string, {chrome: number, prose: number, ruled: number}>} */
  const perFile = {};
  for (const rel of Object.keys(ROSTER)) {
    const abs = join(ROOT, rel);
    if (!existsSync(abs)) { perFile[rel] = { chrome: -1, prose: -1, ruled: -1 }; continue; }
    const one = censusOfSource(readFileSync(abs, 'utf8'), rel);
    for (const key of Object.keys(emptyCensus())) all[key].push(...one[key]);
    all.files += 1;
    perFile[rel] = { chrome: one.chrome.length, prose: one.prose.length, ruled: one.ruled.length };
  }
  return { ...all, perFile };
}

const CENSUS = censusOfRoster();

describe('THE PHONE FLOORS ON THE PUBLIC CHROME — the bottom nav and /create', () => {
  test('the walk is live: every roster file exists, parsed, and gave the walk work', () => {
    // ⛔ ANTI-VACUITY. Three of the arms below assert an EMPTY list, which a census
    // that read nothing also produces.
    const missing = Object.keys(ROSTER).filter((rel) => !existsSync(join(ROOT, rel)));
    expect(
      missing,
      '\nA roster file is gone. It was named here because it DRAWS PUBLIC CHROME, so either it '
      + 'moved (re-point the row) or the surface went away (delete the row, and say where the '
      + 'chrome went):\n',
    ).toEqual([]);
    expect(CENSUS.files).toBe(Object.keys(ROSTER).length);
    expect(SUB_FLOOR_KEYS.size, 'no FS token reads below the chrome floor — the token table or the floor moved')
      .toBeGreaterThanOrEqual(10);
    expect(
      CENSUS.chrome.length + CENSUS.prose.length + CENSUS.bare.length + CENSUS.ruled.length,
      'the walk judged no sub-floor sizes at all — the `fontSize` shape it looks for has changed',
    ).toBeGreaterThanOrEqual(10);
  });

  test('every sub-floor size on these surfaces passes through a helper or carries a ruling', () => {
    expect(
      CENSUS.bare,
      `\n${CENSUS.bare.length} inline fontSize literal(s) below the ${PHONE_CHROME_FLOOR}px phone chrome floor `
      + 'render at their desktop step on a 375px screen, on a PUBLIC surface — the primary nav, or the '
      + 'page a visitor forges their first settlement on.\n'
      + 'Wrap the size in chromeFontSize(<the FS token>, mobile) — or proseFontSize(...) when the line is '
      + 'a passage a reader reads — binding `mobile` once per component with useIsMobile() ABOVE any '
      + 'early return.\n'
      + 'If a site genuinely must stay smaller, write the reason on its line or the one above as '
      + '`// phone-floor: <why>`; that is a ruling and a reviewer reads it:\n'
      + `${CENSUS.bare.join('\n')}\n`,
    ).toEqual([]);
  });

  test("every helper call's viewport flag is really bound where it is used", () => {
    // A wrapper over an unbound identifier is a ReferenceError on first render, and the
    // sweep that wrote it would have looked exactly as green as a correct one.
    expect(
      CENSUS.outOfScope,
      `\n${CENSUS.outOfScope.length} helper call(s) read a viewport flag no enclosing scope binds:\n`
      + `${CENSUS.outOfScope.join('\n')}\n`,
    ).toEqual([]);
  });

  test('no line the rendered walk would call PROSE sits on the chrome helper', () => {
    expect(
      CENSUS.misclassified,
      `\n${CENSUS.misclassified.length} site(s) take the ${PHONE_CHROME_FLOOR}px chrome floor while carrying the `
      + `shape the rendered walk classifies as PROSE, whose floor is ${PHONE_PROSE_FLOOR}px.\n`
      + 'Move it to proseFontSize(...), or record why it is furniture as `// phone-floor: <why>`:\n'
      + `${CENSUS.misclassified.join('\n')}\n`,
    ).toEqual([]);
  });

  test('the roster baselines are exact in both directions', () => {
    const expected = Object.fromEntries(
      Object.entries(ROSTER).map(([rel, row]) => [rel, { chrome: row.chrome, prose: row.prose, ruled: row.ruled }]),
    );
    expect(
      CENSUS.perFile,
      '\nA roster baseline moved.\n'
      + 'MORE than a row claims → a new sub-floor size was wrapped on a public surface; that is usually '
      + 'right, but RE-MEASURE it (is it chrome or prose?) and raise the row in the same commit.\n'
      + 'FEWER → a floored line went back to a bare literal, or left the surface. Say which, and lower '
      + 'the row, so the floor cannot quietly recede.\n',
    ).toEqual(expected);
  });

  test('DESKTOP IS UNTOUCHED: both helpers are the identity above the breakpoint', () => {
    // The order the cure was taken under is "every chrome label >= 12px and prose >= 14px
    // on the phone; the desktop sizes unchanged". This is the second half, and it is a
    // property of the helpers rather than of any one call site — so it holds for every
    // site in the roster at once, including the ones added tomorrow.
    for (const [key, px] of Object.entries(legacy.FS)) {
      expect(chromeFontSize(px, false), `chromeFontSize moved FS.${key} on desktop`).toBe(px);
      expect(proseFontSize(px, false), `proseFontSize moved FS.${key} on desktop`).toBe(px);
      // …and on a phone neither may LOWER a size: they are floors, never caps.
      expect(chromeFontSize(px, true)).toBeGreaterThanOrEqual(Math.min(px, PHONE_CHROME_FLOOR));
      expect(proseFontSize(px, true)).toBeGreaterThanOrEqual(Math.min(px, PHONE_PROSE_FLOOR));
    }
    // The floors really bind on a phone, for the exact steps this census found.
    expect(chromeFontSize(legacy.FS.xxs, true)).toBe(PHONE_CHROME_FLOOR);
    expect(chromeFontSize(legacy.FS.xs, true)).toBe(PHONE_CHROME_FLOOR);
    expect(proseFontSize(legacy.FS.xs, true)).toBe(PHONE_PROSE_FLOOR);
  });

  test('the detectors discriminate, and a written ruling is honoured (executed controls)', () => {
    // The shared scanner's own controls live with the dossier census; these prove THIS
    // file is calling it correctly rather than asserting over an empty walk.
    const bare = censusOfSource(
      'export const A = () => <div style={{ fontSize: FS.xxs }}>x</div>;', 'control.jsx',
    );
    expect(bare.bare.length, 'a bare sub-floor size is no longer caught').toBe(1);

    const wrapped = censusOfSource(
      'export const A = ({ mobile }) => <div style={{ fontSize: chromeFontSize(FS.xxs, mobile) }}>x</div>;',
      'control.jsx',
    );
    expect(wrapped.bare).toEqual([]);
    expect(wrapped.chrome.length).toBe(1);

    const ruled = censusOfSource(
      '// phone-floor: the numeral is painted inside an 18px bar\n'
      + 'export const A = () => <div style={{ fontSize: FS.xxs }}>x</div>;', 'control.jsx',
    );
    expect(ruled.bare).toEqual([]);
    expect(ruled.ruled.length).toBe(1);

    const overFloor = censusOfSource(
      'export const A = () => <div style={{ fontSize: FS.lg }}>x</div>;', 'control.jsx',
    );
    expect(overFloor.bare, 'a size ABOVE the floor is reported — this has stopped being a floor').toEqual([]);
  });
});
