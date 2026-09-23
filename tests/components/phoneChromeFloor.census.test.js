/**
 * phoneChromeFloor.census.test.js — THE PHONE FLOORS AS A FACT ABOUT THE SOURCE,
 * NOT ABOUT ONE FIXTURE SEED'S STRING LENGTHS — AND ABOUT EVERY ROUTE, NOT A
 * HAND-LISTED EIGHTEEN.
 *
 * `dossierPhoneFloorAllViews` renders the real dossier and measures what a reader
 * is given, which is the right instrument and the only one that can see a
 * computed size. It has one structural limit, and review 13 named it: it measures
 * a line ONLY once that line's own text reaches MIN_CHARS (45), because below
 * that a four-character badge is glanced at rather than read. So whether a 10px
 * trait row is a violation is decided by how long the generator happened to make
 * THIS settlement's traits. Nothing about the source decides it.
 *
 * At the census's first run that was not a hypothetical: 456 inline `fontSize`
 * literals below the chrome floor sat in src/components/new, every one of them a
 * violation waiting for a seed that made its line long enough, and the rendered
 * walk was green over all eighteen views.
 *
 * ⭐ SO THIS ARM READS SOURCE AND NOTHING ELSE. It cannot see a computed size and
 * does not try to; it asserts the WIRING, which is content-independent by
 * construction:
 *
 *   every `fontSize` whose literal is below the phone chrome floor must pass
 *   through `chromeFontSize` or `proseFontSize`, or carry a `// phone-floor:`
 *   ruling on its own line or the one above.
 *
 * The two arms are not redundant and neither subsumes the other. The rendered
 * walk sees a size this one cannot compute (a stylesheet, a cascade, a prop); this
 * one sees a surface the walk never mounts — WarTab's treaty stamps rendered at
 * SEVEN PIXELS for the life of that file and no instrument in this repo could say
 * so, because War is not one of the eighteen views.
 *
 * ⛔⛔ THE TREE COMES FROM THE ROUTER NOW, AND THAT IS THIS FILE'S SECOND CURE
 * (ODQ §934.24 — "the floors, estate-wide; one rule for every route").
 *
 * The boundary used to be the single directory `src/components/new`, declared
 * here by hand with every neighbouring directory listed as deliberately OUT. It
 * was an honest ruling about the dossier and a silent one about everything else:
 * /create, the landing, the library, the gallery, the compendium, the Realm, the
 * account and admin desks, the legal pages and the whole shell of modals were not
 * exempted from the floors — they were never on the list to be exempted FROM. One
 * hand-maintained tree name is how a surface goes unmeasured for its whole life,
 * which is the same failure the WarTab paragraph above describes, one level up.
 *
 * So the list is DERIVED (tests/helpers/routeClosure.js): `src/lib/routes.js`
 * declares every route, `src/AppViews.jsx` maps each view to its page component,
 * and the census tree is the union of those pages' import subtrees plus the
 * SHELL — App.jsx's own chrome, which renders on every route and which AppViews
 * therefore never names. A route added to ROUTES arrives here already carrying
 * its surface; a route that renders nothing (the retired redirect paths) says so
 * in the registry rather than being absent from it.
 *
 * ⚠ LAZY EDGES ARE FOLLOWED, DELIBERATELY. Every page in AppViews is declared as
 * `lazy(() => import('./components/X.jsx'))`, so the derivation must already read
 * one `import()` to find a root at all — and the dossier's eighteen tab panels,
 * the Realm's map pane and the workbench all hang off another. A walk that
 * stopped at the first dynamic edge would measure the shells and call the estate
 * covered. FOLLOW_ALL is that rule applied consistently, not a liberty.
 *
 * ⚠ NO TOKEN TABLE IS RESTATED HERE. `FS` comes from src/design/tokens.js and the
 * floor from src/design/proseScale.js, so "below the floor" is derived from the
 * two modules that define it. A hand-copied table is the drift this file would
 * otherwise become: add `FS['11.75']` tomorrow and a restated list would go on
 * passing while the new step shipped bare.
 */

import { describe, expect, test } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// ⭐ THE RULE ITSELF LIVES IN ONE PLACE (2026-09-19, ODQ §934.22 item 2). It was
// written here and it is still this file's rule; it moved to a sibling leaf the day a
// SECOND surface had to be held to it — the phone's bottom nav and the Create page
// (tests/components/publicChromeFloor.census.test.js). Everything that made this file
// what it is stayed: the anti-vacuity floors and every executed control below, and the
// TREE — which this car takes from the router rather than from a hand-written name,
// retiring the boundary ruling the leaf was lifted alongside. Only the scanner left,
// so the two censuses cannot drift into two rules wearing one name.
//
// ⚠ NO TOKEN TABLE IS RESTATED, AND THE LEAF DOES NOT RESTATE ONE EITHER: it derives
// SUB_FLOOR_KEYS from src/design/tokens.js and the floor from src/design/proseScale.js,
// so the header's ruling above holds through the move.
import {
  PHONE_CHROME_FLOOR, SUB_FLOOR_KEYS, censusOfSource,
} from './phoneFloorCensus.shared.mjs';
import {
  FOLLOW_ALL, importClosure, moduleSpecifiers, resolveRelative, routeClosures,
} from '../helpers/routeClosure.js';

// The repo root under vitest. NOT `import.meta.url`: a jsdom environment rewrites
// it to a `/@fs/…` dev-server path, which readdirSync cannot open — the same trap
// the InstitutionLink census documents.
const ROOT = process.cwd();

/** The layer this census governs: what a route renders, wherever it lives. */
const CENSUS_LAYER = 'src/components/';

/** The acceptance test whose surface this file is the source-side twin of. */
const ACCEPTANCE_TEST = 'tests/components/dossierPhoneFloorAllViews.test.jsx';

/** The shell's entry, and the module it must NOT descend into (that is the route table). */
const SHELL_ENTRY = 'src/App.jsx';
const ROUTE_TABLE = 'src/AppViews.jsx';

export { censusOfSource };

// ── the tree, derived from the router ────────────────────────────────────────

/**
 * The SHELL: what App.jsx renders around every route — the perimeter, the
 * command palette, the purchase and feedback modals, the surveyor desks.
 *
 * Crawled from App.jsx with the route table CUT, because App imports AppViews and
 * AppViews reaches every page: without the cut the shell row would simply be the
 * union of all the others and would prove nothing about the chrome in particular.
 */
function shellFiles() {
  const entry = join(ROOT, SHELL_ENTRY);
  const cut = join(ROOT, ROUTE_TABLE);
  const seen = new Set([entry]);
  const queue = [entry];
  while (queue.length) {
    const file = queue.shift();
    for (const spec of moduleSpecifiers(readFileSync(file, 'utf8'), FOLLOW_ALL)) {
      const dep = resolveRelative(file, spec);
      if (!dep || seen.has(dep) || dep === cut) continue;
      seen.add(dep);
      queue.push(dep);
    }
  }
  return [...seen].map((f) => f.slice(ROOT.length + 1).replace(/\\/g, '/'))
    .filter((r) => r.startsWith(CENSUS_LAYER)).sort();
}

const ROUTES = await routeClosures(ROOT, FOLLOW_ALL);
const SHELL = shellFiles();

/** One parse per file however many surfaces reach it. */
const perFile = new Map();
function censusOfFile(rel) {
  if (!perFile.has(rel)) perFile.set(rel, censusOfSource(readFileSync(join(ROOT, rel), 'utf8'), rel));
  return perFile.get(rel);
}

/** Roll one surface's component files up into the shape the registry pins. */
function surveyOf(files) {
  const acc = { files: files.length, floored: 0, ruled: 0, bare: 0 };
  for (const rel of files) {
    const one = censusOfFile(rel);
    acc.floored += one.chrome.length + one.prose.length;
    acc.ruled += one.ruled.length + one.suppressed.length;
    acc.bare += one.bare.length;
  }
  return acc;
}

const SURFACES = [
  ...ROUTES.map((r) => ({
    key: r.path,
    view: r.view,
    roots: r.roots.length,
    files: r.files.filter((f) => f.startsWith(CENSUS_LAYER)),
  })),
  { key: '(shell)', view: 'App.jsx around every route', roots: 1, files: SHELL },
];

const MEASURED = Object.fromEntries(
  SURFACES.map((s) => [s.key, { roots: s.roots, ...surveyOf(s.files) }]),
);

/** Every component file any surface reaches, once. */
const CENSUS_FILES = [...new Set(SURFACES.flatMap((s) => s.files))].sort();
const CENSUS = (() => {
  const all = { bare: [], chrome: [], prose: [], ruled: [], suppressed: [], misclassified: [], outOfScope: [] };
  for (const rel of CENSUS_FILES) {
    const one = censusOfFile(rel);
    for (const key of Object.keys(all)) all[key].push(...one[key]);
  }
  return all;
})();

// ── the registry ─────────────────────────────────────────────────────────────

/**
 * ⭐⭐ THE ROUTE REGISTRY — WHAT THE CENSUS MEASURED ON EVERY SURFACE THE ROUTER
 * DECLARES, AND THE ONLY PLACE AN UNFLOORED SURFACE MAY BE NAMED.
 *
 * ⛔ A ROUTE WITH NO ROW REDS, BY PATH. That is the arm this whole rewrite exists
 * for: the previous registry was a directory name, so a new page could ship
 * without anyone deciding whether its type had a floor. Now the router adds the
 * row's KEY and a human must add its numbers.
 *
 * WHAT EACH FIELD PINS, AND WHY THEY ARE PINNED DIFFERENTLY:
 *
 *   roots    EXACT. How many page components AppViews renders for this view. 0 is
 *            a real and legal answer — the retired redirect paths (/about,
 *            /how-to, /workshop, /compare*) render nothing while App's redirect
 *            effect forwards them — and pinning it is what tells a reader the
 *            difference between "renders nothing" and "the derivation broke".
 *   files    A FLOOR (>=). The failure mode is a closure that COLLAPSES — a page
 *            that stops importing its own subtree, or a derivation that silently
 *            resolves nothing — and a floor catches exactly that. Growth needs no
 *            pin: a file newly reached is censused like every other, so anything
 *            it brings with it arrives in `bare`. An exact pin here would red on
 *            any import added anywhere in a 205-file subtree, which buys nothing
 *            and costs every lane a merge.
 *   floored  EXACT. Sites that pass a helper. This number moves only when someone
 *            touches a fontSize, so a drop means a floored surface stopped being
 *            floored (or stopped existing) — which "zero violations" cannot see.
 *   ruled    EXACT. Sites carrying a written `// phone-floor:` ruling. See RULINGS.
 *   bare     EXACT, and it is ZERO except where a row names an `owner`.
 *
 * ⛔ `owner` IS THE ONLY EXEMPTION AND IT IS A HANDOVER, NOT A VERDICT. It says a
 * surface's sub-floor sizes belong to a lane that is curing them in a different
 * branch, and its number is the count that lane has left to do. It may only ever
 * FALL: the arm below refuses a row whose bare count has RISEN, so an exempted
 * surface cannot quietly grow new violations behind the name of the lane fixing
 * the old ones. When that lane lands, the number goes to 0 and `owner` goes with it.
 *
 * RE-MEASURED 2026-09-19 ON THE CONSIST (lane 34's composition). Lane 29 measured
 * its own branch; these rows are this tree, 35 cars later, and the drift is those
 * cars' — new files on nine surfaces, a second root on /realm, /map and /admin, and
 * lane 28's shared ClerkNote site floored in the consist (/realm and /map bare 1 ->
 * 0). Nothing here raises a floor; every number is a count.
 *   554 component files over 36 routes and the shell, 127 sub-floor sites left,
 *   all of them still on the three surfaces lane 28 owns (98 + 19 + 10).
 *
 * ⭐ /pricing CURED AND UN-OWNED (FIX-P5, 2026-09-20, ODQ §934.63 F9). Ten of that 127
 * were the pricing page's, and the public-path walk found them on the phone: eleven-pixel
 * prose on the page that asks for money. They are cured, /pricing's row loses its `owner`,
 * and the estate now has 117 sub-floor sites left on the two surfaces lane 28 still owns
 * (98 + 19).
 */
const ROUTE_BASELINE = Object.freeze({
  // ⛔ lane 28 (the create page, the tier picker, the landing and the header nav)
  // owns these three surfaces in its own branch. Every site counted here is in
  // src/components/generate, src/components/home, src/components/pricing or the
  // /create-only panels in src/components — none of it is reachable from any
  // other route except the four ClerkNote sites the Realm shares, named below.
  '/create':                { roots: 1, files: 165, floored: 750, ruled: 5, bare: 98, owner: 'lane 28 — the create page + the tier picker' },
  '/home':                  { roots: 1, files: 19, floored: 6, ruled: 4, bare: 19, owner: 'lane 28 — the landing' },
  // The Realm lazily mounts the create flow's ClerkNote for its one advisory
  // line, so lane 28's file lands on a route it does not own. One site.
  // ⭐ RE-MEASURED AT THE TRAIN TIP (2026-09-23, the chair; U25): /realm and /map floored 484 -> 485 —
  // EM-E3's advance report adds ONE correctly floored anchor line reached by both routes
  // (src/components/map/AdvanceReport.jsx); attributed by planting the pre-change body.
  '/realm':                 { roots: 2, files: 153, floored: 485, ruled: 1, bare: 0, owner: 'lane 28 — generate/ClerkNote.jsx, mounted here' },
  '/map':                   { roots: 2, files: 153, floored: 485, ruled: 1, bare: 0, owner: 'lane 28 — generate/ClerkNote.jsx, mounted here' },

  // floored 991 -> 992 (review wave 2 car 3, 2026-09-19): the Library's sample fork used to
  // answer EVERY null with the purchase modal, so it now renders the estate's refusal notice
  // above the cards — primitives/RefusalNotice.jsx, which mounts generate/ClerkNote.jsx, and
  // ClerkNote carries exactly ONE floored site (`chromeFontSize(FS.xs, mobile)`). The line is
  // FLOORED, not bare: `bare` holds at 0, so nothing sub-floor shipped with it. The same
  // component was already in /create's, /home's and the Realm's closures, which is why this
  // is the only route that moved.
  // floored 992 -> 991 and /gallery 795 -> 794 (browser pass 3, lane 36 cars 3/4/6, 2026-09-19):
  // the dossier closure both routes open lost ONE floored span net — status and key mounts
  // re-expressed through statusCase and the label seams, and the Power tab's raw coup-weight
  // span retired. `bare` holds at 0 on both, so nothing sub-floor shipped; the routes lane 36
  // re-recorded on its own base already carry the move, which is why only these two fell.
  // ⭐ /pricing LEFT THE OWNED LIST (FIX-P5, ODQ §934.63 F9). Its row read
  // `bare: 10, owner: 'lane 28 — the pricing page'`; the ten are cured, so the number is
  // 0 and — by this registry's own law — `owner` goes with it. floored 7 -> 17 is those
  // exact ten sites arriving on a helper, measured on this tree and on the untouched base:
  // /pricing is the ONLY row this lane moves, and every other row below is byte-identical
  // between the two measurements.
  // ⚠ WHAT THIS ROW STILL CANNOT SEE, AND WHERE THAT IS HELD. The scanner judges a literal
  // only when it reads BELOW the 12 px CHROME floor, so the eleven 12 px `<p>` lines the
  // review measured on this page are invisible to it in both directions: they were bare
  // and unreported, and now they are on `proseFontSize` and still uncounted. That half of
  // the cure is pinned in tests/components/publicChromeFloor.census.test.js, which grew a
  // PROSE-floor arm over a named pricing roster for exactly this gap.
  '/pricing':               { roots: 1, files: 14, floored: 17, ruled: 3, bare: 0 },
  '/settlements':           { roots: 1, files: 206, floored: 991, ruled: 4, bare: 0 },
  '/compendium':            { roots: 1, files: 51, floored: 211, ruled: 3, bare: 0 },
  '/about/what-this-is':    { roots: 1, files: 16, floored: 5, ruled: 1, bare: 0 },
  '/about/guide':           { roots: 1, files: 12, floored: 11, ruled: 3, bare: 0 },
  '/account':               { roots: 1, files: 46, floored: 105, ruled: 5, bare: 0 },
  '/admin':                 { roots: 2, files: 29, floored: 86, ruled: 1, bare: 0 },
  '/gallery':               { roots: 1, files: 154, floored: 794, ruled: 4, bare: 0 },
  '/founders':              { roots: 1, files: 13, floored: 6, ruled: 1, bare: 0 },
  '/first-hundred':         { roots: 1, files: 6, floored: 4, ruled: 1, bare: 0 },
  '/roadmap':               { roots: 1, files: 6, floored: 3, ruled: 1, bare: 0 },
  '/world':                 { roots: 1, files: 4, floored: 5, ruled: 1, bare: 0 },
  '/terms':                 { roots: 1, files: 5, floored: 2, ruled: 0, bare: 0 },
  '/privacy':               { roots: 1, files: 5, floored: 2, ruled: 0, bare: 0 },
  '/refunds':               { roots: 1, files: 5, floored: 2, ruled: 0, bare: 0 },
  '/covenant':              { roots: 1, files: 5, floored: 2, ruled: 0, bare: 0 },
  '/bounty':                { roots: 1, files: 5, floored: 2, ruled: 0, bare: 0 },
  '/screen':                { roots: 1, files: 14, floored: 31, ruled: 3, bare: 0 },
    // ⭐ floored 4 -> 5 on 2026-09-20 (REVIEW-P F10): the sign-in surface now raises the
    // guarded route's reason through primitives/RefusalNotice.jsx, and ClerkNote's rubric
    // is a chrome line that takes the phone floor. A NEW floored line, not a cured bare one.
  '/signin':                { roots: 1, files: 11, floored: 5, ruled: 1, bare: 0 },
  '/register':              { roots: 1, files: 11, floored: 4, ruled: 1, bare: 0 },
  '/reset-password':        { roots: 1, files: 11, floored: 4, ruled: 1, bare: 0 },
  '/set-new-password':      { roots: 1, files: 7, floored: 3, ruled: 1, bare: 0 },
  '/verify-email':          { roots: 1, files: 7, floored: 3, ruled: 1, bare: 0 },
  '/confirm-email':         { roots: 1, files: 7, floored: 3, ruled: 1, bare: 0 },
  '/checkout/success':      { roots: 1, files: 6, floored: 4, ruled: 1, bare: 0 },

  // The retired redirect surfaces. Their ROUTES entries exist so old links still
  // resolve (lib/routes.js `redirectForView`), and AppViews renders nothing for
  // them on purpose — one frame of blank beats one frame of the page being left.
  // `roots: 0` is therefore the correct measurement, not a missing one.
  '/about':                 { roots: 0, files: 0, floored: 0, ruled: 0, bare: 0 },
  '/how-to':                { roots: 0, files: 0, floored: 0, ruled: 0, bare: 0 },
  '/workshop':              { roots: 0, files: 0, floored: 0, ruled: 0, bare: 0 },
  '/compare':               { roots: 0, files: 0, floored: 0, ruled: 0, bare: 0 },
  '/compare/chatgpt':       { roots: 0, files: 0, floored: 0, ruled: 0, bare: 0 },
  '/compare/worldographer': { roots: 0, files: 0, floored: 0, ruled: 0, bare: 0 },
  '/compare/kanka':         { roots: 0, files: 0, floored: 0, ruled: 0, bare: 0 },

  // App.jsx's own chrome. It is on the list because it renders on every route and
  // AppViews names none of it — the exact shape of hole this rewrite closes.
  //
  // ⭐ RE-MEASURED BY EM-D1 (2026-09-23), floored 138 -> 143, and the cause is a REACH
  // rather than a new small size. App.jsx's closure now follows one `lazy(() =>
  // import('./components/edit/EditModeShell.jsx'))` edge, so the shell survey reaches the
  // settlement editor's volume for the first time: the door, its two field controls and
  // the two primitives they mount. Every one of the five new sites was ALREADY FLOORED
  // where it lives, and they attribute exactly —
  //   src/components/edit/FreeField.jsx          1
  //   src/components/edit/PoolField.jsx          1
  //   src/components/generate/ClerkNote.jsx      1
  //   src/components/primitives/PortablePopup.jsx 2
  // EM-D1's own leaf contributes ZERO: `EditModeShell.jsx` spells no sub-floor size at
  // all, so it is neither floored nor bare nor ruled here. `bare` stays 0 and `ruled`
  // stays 3 for the same reason, and `files` is a FLOOR the grown tree (61 -> 68) still
  // clears — growth needs no pin, by this registry's own rule above.
  //
  // ⭐ RE-MEASURED AT THE TRAIN TIP (2026-09-23, the chair; judgment 271 / U25), floored 143 -> 144:
  // TWO branches moved this row without seeing each other — EM-D1 re-recorded 138 -> 143 above
  // (the reach into the editor), and EM-D4's surveyor bridge added ONE floored line in
  // src/components/surveyor/InterpretApplyPanel.jsx without touching this census. EM-E3 and
  // EM-F3 were measured at zero for this row with their component bodies planted. `bare`
  // stays 0 and `ruled` stays 3; `files` is a FLOOR the grown tree still clears.
  '(shell)':                { roots: 1, files: 61, floored: 144, ruled: 3, bare: 0 },
});

/**
 * ⛔ THE THRESHOLDS ARE ONE RULE — AND THIS IS THE WHOLE LIST OF EXCEPTIONS.
 *
 * A `// phone-floor:` comment exempts its own line, which makes it an escape
 * hatch unless somebody counts them. Every ruled site's FILE is named here with
 * the reason and the exact number of rulings it carries, so adding a comment
 * somewhere new reds until a reviewer writes down why.
 *
 * All five live rulings are ONE reason, and it is not an exemption from the
 * floor: a shared primitive's size ladder is a table of DESKTOP steps, read later
 * inside the component as `SIZES[size]`. The floor is applied there, at the read,
 * because that is the only place `useIsMobile()` is bound — so the rendered chip
 * does clear 12px on a phone, and the ruling is bookkeeping for a source scanner
 * that cannot follow a table lookup, not a surface left small.
 */
const RULINGS = Object.freeze({
  'src/components/primitives/Badge.jsx': { count: 2, why: 'the desktop size ladder; floored at the `SIZES[size]` read inside Badge' },
  'src/components/primitives/Button.jsx': { count: 1, why: 'the desktop size ladder; floored at the `SIZES[size]` read inside Button' },
  'src/components/primitives/FounderBadge.jsx': { count: 2, why: 'the desktop size ladder; floored at the `SIZES[size]` read inside FounderBadge' },
  // Lane 28's, and it surfaces here only in the composed tree: it is a CLASS ruling on a
  // chromeFontSize call, which the arm collected for the first time in the car above.
  'src/components/generate/FoundingWorlds.jsx': { count: 1, why: 'two- and three-word tag chips glanced at beside the teaser, whose 1.5 line-height alone reads as prose to the shape heuristic' },
  // The one CLASS ruling. `pillStyle` is a detached style factory, so this arm sees
  // no element for it and reads the box as a block card; its single consumer is a
  // `<span role="tooltip">`, which is the inline chip the pill test is about.
  'src/components/BuyThisDossier.jsx': { count: 1, why: 'an inline tooltip pill, consumed on a <span> the source scanner cannot see from a detached factory' },
});

// ── the arms ─────────────────────────────────────────────────────────────────

describe('THE PHONE CHROME FLOOR — a census of the source, on every route the router declares', () => {
  test('the walk is live: it derived routes, parsed their trees, and found sub-floor sizes to judge', () => {
    // ⛔ ANTI-VACUITY, and it is the failure mode a source scanner dies of. A
    // moved tree, a renamed token module or a parser that started throwing all
    // produce an empty walk, and every assertion below passes on nothing. These
    // floors are the measurement at landing, tightened toward reality and never
    // relaxed to admit a budget: 36 routes, 514 component files, 10 sub-floor
    // FS keys (pico nano micro xxs xs 7.5 8.5 9.5 10.5 11.5).
    expect(ROUTES.length, 'the router declared no routes — has src/lib/routes.js moved?')
      .toBeGreaterThanOrEqual(36);
    expect(
      ROUTES.filter((r) => r.roots.length > 0).length,
      'no route resolved a page component — has AppViews stopped declaring them as lazy() imports?',
    ).toBeGreaterThanOrEqual(29);
    expect(CENSUS_FILES.length, 'the census tree is empty — has src/components moved?')
      .toBeGreaterThanOrEqual(514);
    expect(SUB_FLOOR_KEYS.size, 'no FS token reads below the chrome floor — the token table or the floor moved')
      .toBeGreaterThanOrEqual(10);
    expect(
      CENSUS.chrome.length + CENSUS.prose.length + CENSUS.bare.length + CENSUS.ruled.length,
      'the walk judged almost no sub-floor sizes — the `fontSize` shape it looks for has changed',
    ).toBeGreaterThanOrEqual(2000);
  });

  test('every route the router declares carries a registry row, by path', () => {
    const missing = SURFACES.map((s) => s.key).filter((k) => !(k in ROUTE_BASELINE));
    expect(
      missing,
      '\nThe router declares route(s) this census has never ruled on. A new page does not get a '
      + 'floor by default and it does not get an exemption by default either — measure it, cure what '
      + 'breaches, and add its row to ROUTE_BASELINE:\n'
      + `${missing.join('\n')}\n`,
    ).toEqual([]);
    const stale = Object.keys(ROUTE_BASELINE).filter((k) => !SURFACES.some((s) => s.key === k));
    expect(
      stale,
      'ROUTE_BASELINE names a route the router no longer declares — delete the stale row',
    ).toEqual([]);
  });

  test('every sub-floor size passes through a helper or carries a written ruling', () => {
    // Only the surfaces no other lane owns are held to zero here; an owned
    // surface is held to its own row by the arm below, which can only fall.
    const owned = new Set(
      Object.entries(ROUTE_BASELINE).filter(([, v]) => v.owner)
        .flatMap(([key]) => SURFACES.find((s) => s.key === key)?.files || []),
    );
    const mine = CENSUS.bare.filter((line) => !owned.has(line.slice(0, line.indexOf(':'))));
    expect(
      mine,
      `\n${mine.length} inline fontSize literal(s) below the ${PHONE_CHROME_FLOOR}px phone chrome floor `
      + 'render at their desktop step on a 375px screen.\n'
      + 'Wrap the size in chromeFontSize(<the FS token>, mobile) — or proseFontSize(...) when the line '
      + 'is a passage — binding `mobile` once per component with useIsMobile() ABOVE any early return.\n'
      + 'If a site genuinely must stay smaller (a box it would overflow), write the reason on its line '
      + 'or the one above as `// phone-floor: <why>`; that is a ruling and a reviewer reads it:\n'
      + `${mine.join('\n')}\n`,
    ).toEqual([]);
  });

  test('each surface matches its registry row, and an owned surface may only shrink', () => {
    const drift = [];
    for (const { key } of SURFACES) {
      const row = ROUTE_BASELINE[key];
      if (!row) continue;                                    // named by the arm above
      const now = MEASURED[key];
      if (now.roots !== row.roots) drift.push(`  ${key}  roots ${row.roots} -> ${now.roots}`);
      if (now.files < row.files) {
        drift.push(`  ${key}  files COLLAPSED ${row.files} -> ${now.files} — the page stopped reaching its own subtree`);
      }
      if (now.floored !== row.floored) drift.push(`  ${key}  floored ${row.floored} -> ${now.floored}`);
      if (now.ruled !== row.ruled) drift.push(`  ${key}  ruled ${row.ruled} -> ${now.ruled}`);
      if (row.owner ? now.bare > row.bare : now.bare !== row.bare) {
        drift.push(`  ${key}  bare ${row.bare} -> ${now.bare}${row.owner ? `  (owned by ${row.owner} — this number may only fall)` : ''}`);
      }
    }
    expect(
      drift,
      '\nROUTE_BASELINE mismatch. Each row is what this census measured on that surface.\n'
      + 'A `floored` number that FELL means a surface stopped being floored or stopped existing — which '
      + '"zero violations" cannot see. One that ROSE means new floored lines; say so.\n'
      + 'A `bare` number that rose on an OWNED surface means new sub-floor sizes shipped behind the name '
      + 'of the lane that is curing the old ones; cure them instead of raising the row.\n'
      + 'Deliberate? Re-measure, re-record the row in the same car, and name the cause in the commit '
      + 'message.\n'
      + `${drift.join('\n')}\n`,
    ).toEqual([]);
  });

  test('every written ruling is registered, with its reason and its count', () => {
    const byFile = new Map();
    // BOTH KINDS. A ruling on a bare literal exempts the site from the floor; a
    // ruling on a helper call overrides the CLASS the site is held to. The second
    // is a smaller act and it is still an act, and it was unregistered for exactly
    // one commit — which is one commit of an exception nobody had to justify.
    for (const line of [...CENSUS.ruled, ...CENSUS.suppressed]) {
      const rel = line.slice(0, line.indexOf(':'));
      byFile.set(rel, (byFile.get(rel) || 0) + 1);
    }
    const unregistered = [...byFile.keys()].filter((f) => !(f in RULINGS));
    expect(
      unregistered,
      '\nA `// phone-floor:` ruling was written in a file RULINGS does not name. The comment exempts its '
      + 'own line from the floor, so it is an escape hatch until someone writes down why it is not one. '
      + 'Cure the site, or add the file to RULINGS with its count and the reason:\n'
      + `${unregistered.join('\n')}\n`,
    ).toEqual([]);
    const counts = Object.fromEntries([...byFile].sort());
    expect(
      counts,
      'RULINGS counts disagree with the tree — a ruling was added, removed or moved. Update the row '
      + '(or delete it when its last ruling is cured) in the same car.',
    ).toEqual(Object.fromEntries(
      Object.entries(RULINGS).sort().map(([f, v]) => [f, v.count]),
    ));
    for (const [file, v] of Object.entries(RULINGS)) {
      expect(v.why.length, `RULINGS['${file}'] must say WHY, in a sentence a reviewer can disagree with`)
        .toBeGreaterThan(30);
    }
  });

  test('every helper call\'s viewport flag is really bound where it is used', () => {
    // A wrapper over an unbound identifier is not a smaller failure than a bare
    // size — it is a ReferenceError on first render, and the sweep that wrote it
    // would have looked exactly as green as a correct one.
    expect(
      CENSUS.outOfScope,
      `\n${CENSUS.outOfScope.length} helper call(s) read a viewport flag that no enclosing scope binds. `
      + 'Bind it with `const mobile = useIsMobile();` in the component that renders the line, above any '
      + 'early return, or pass it in as an argument when the reader is a plain helper rather than a '
      + 'component:\n'
      + `${CENSUS.outOfScope.join('\n')}\n`,
    ).toEqual([]);
  });

  test('no line the rendered walk would call PROSE sits on the chrome helper', () => {
    expect(
      CENSUS.misclassified,
      `\n${CENSUS.misclassified.length} site(s) take the ${PHONE_CHROME_FLOOR}px chrome floor while carrying the shape `
      + `dossierPhoneFloorAllViews classifies as PROSE, whose floor is higher. Written this way the line `
      + 'renders below what the rendered walk demands and reds only once its text passes 45 characters.\n'
      + 'Move it to proseFontSize(...), or record why it is furniture as `// phone-floor: <why>`:\n'
      + `${CENSUS.misclassified.join('\n')}\n`,
    ).toEqual([]);
  });

  test('the detectors discriminate, and the written ruling is honoured (executed controls)', () => {
    // ⛔ WITHOUT THIS, EVERY GREEN ABOVE IS UNREADABLE. Most of the arms above
    // assert an EMPTY list, which is what a detector that has stopped detecting
    // also produces. Each control is a source string this file parses for real.
    const bare = censusOfSource(
      'export const A = () => <div style={{ fontSize: FS.xxs }}>x</div>;', 'control.jsx',
    );
    expect(bare.bare.length, 'a bare sub-floor size is no longer caught').toBe(1);

    const ruled = censusOfSource(
      '// phone-floor: the numeral is painted inside an 18px bar\n'
      + 'export const A = () => <div style={{ fontSize: FS.xxs }}>x</div>;', 'control.jsx',
    );
    expect(ruled.bare, 'a written ruling no longer exempts its site').toEqual([]);
    expect(ruled.ruled.length, 'a written ruling is no longer counted as one').toBe(1);

    const wrapped = censusOfSource(
      'export const A = ({ mobile }) => <div style={{ fontSize: chromeFontSize(FS.xxs, mobile) }}>x</div>;',
      'control.jsx',
    );
    expect(wrapped.bare, 'a wrapped site is reported as bare').toEqual([]);
    expect(wrapped.outOfScope, 'a flag bound as a destructured prop is read as unbound').toEqual([]);
    expect(wrapped.chrome.length).toBe(1);

    const unbound = censusOfSource(
      'export const A = () => <div style={{ fontSize: chromeFontSize(FS.xxs, mobile) }}>x</div>;',
      'control.jsx',
    );
    expect(unbound.outOfScope.length, 'an unbound viewport flag is no longer caught').toBe(1);

    const overFloor = censusOfSource(
      'export const A = () => <div style={{ fontSize: FS.lg }}>x</div>;', 'control.jsx',
    );
    expect(overFloor.bare, 'a size ABOVE the floor is reported — the census has stopped being a floor').toEqual([]);

    const proseOnChrome = censusOfSource(
      'export const A = ({ mobile }) => <p style={{ fontSize: chromeFontSize(FS.xs, mobile), lineHeight: 1.5 }}>x</p>;',
      'control.jsx',
    );
    expect(proseOnChrome.misclassified.length, 'a prose-shaped line on the chrome helper is no longer caught').toBe(1);

    const pill = censusOfSource(
      'export const A = ({ mobile }) => <span style={{ fontSize: chromeFontSize(FS.xs, mobile), '
      + 'lineHeight: 1.5, padding: 2, background: g }}>x</span>;',
      'control.jsx',
    );
    expect(pill.misclassified, 'a padded, grounded pill is misread as prose').toEqual([]);

    // THE PILL IS INLINE. The same box as a <div> is a notice card, not a chip, and
    // the rendered arm holds it to the prose floor — this is the 25-site class.
    const blockCard = censusOfSource(
      'export const A = ({ mobile }) => <div style={{ fontSize: chromeFontSize(FS.xs, mobile), '
      + 'lineHeight: 1.5, padding: 2, background: g }}>x</div>;',
      'control.jsx',
    );
    expect(blockCard.misclassified.length, 'a BLOCK padded card is read as a pill — the inline test is gone').toBe(1);

    // A written ruling moves that site from "unexplained" to "registered", and the
    // two buckets must never both claim it.
    const ruledCard = censusOfSource(
      '// phone-floor: it is really an inline tooltip\n'
      + 'export const A = ({ mobile }) => <div style={{ fontSize: chromeFontSize(FS.xs, mobile), '
      + 'lineHeight: 1.5, padding: 2, background: g }}>x</div>;',
      'control.jsx',
    );
    expect(ruledCard.misclassified, 'a ruled class-override is still reported as unexplained').toEqual([]);
    expect(ruledCard.suppressed.length, 'a ruled class-override is no longer collected for RULINGS').toBe(1);
  });

  test('the derivation reaches the surfaces it is supposed to reach (executed controls)', () => {
    // ⛔ THE ROUTE WALK'S OWN ANTI-VACUITY. Every count above is a property of
    // whatever the derivation returned, and a derivation that quietly stopped
    // resolving `lazy(() => import(…))` would return shells and pass everything.
    // Three anchors, each one a tree this census is known to govern.
    const dossier = CENSUS_FILES.filter((f) => f.startsWith('src/components/new/'));
    expect(
      dossier.length,
      'the derivation reaches no dossier panel — it has stopped following the lazy edge that mounts '
      + 'them, so the eighteen views this census is the source-side twin of are unmeasured',
    ).toBeGreaterThanOrEqual(45);

    const primitives = CENSUS_FILES.filter((f) => f.startsWith('src/components/primitives/'));
    expect(
      primitives.length,
      'the derivation reaches no shared primitive — Button and Badge carry the size ladders RULINGS names',
    ).toBeGreaterThanOrEqual(30);

    // The shell is the half AppViews cannot name, and the half the old hand-listed
    // registry missed entirely. If the cut stopped working it would be the union
    // of every route instead, which is the other way this row goes vacuous.
    expect(SHELL.length, 'the shell closure is empty — App.jsx no longer reaches its own chrome')
      .toBeGreaterThanOrEqual(60);
    expect(
      SHELL.length,
      'the shell closure is as large as the whole census — the AppViews cut stopped working, so the '
      + 'shell row is measuring every route instead of the chrome around them',
    ).toBeLessThan(CENSUS_FILES.length / 2);

    // The acceptance test this file is the twin of must still reach the census
    // layer, or the two instruments have come apart.
    const twin = importClosure([join(ROOT, ACCEPTANCE_TEST)], FOLLOW_ALL).seen;
    expect(
      [...twin].filter((f) => f.slice(ROOT.length + 1).replace(/\\/g, '/').startsWith(CENSUS_LAYER)).length,
      `${ACCEPTANCE_TEST} reaches nothing inside the census layer — the two instruments have come apart`,
    ).toBeGreaterThanOrEqual(40);
  });
});
