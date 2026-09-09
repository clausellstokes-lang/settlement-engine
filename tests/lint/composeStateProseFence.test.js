/**
 * composeStateProseFence.test.js — ARCH-COMPOSED-PROSE car 3a: THE IMPORT FENCE AND THE
 * LOCALE-API BAN around the composer.
 *
 * ── THE TWO CLASSES THIS FILE EXISTS FOR ────────────────────────────────────────────
 *
 * 1. THE SEAM IS REACHED BY EXACTLY THE DESKS A LANDED CAR HAS ROUTED, AND BY NOTHING ELSE.
 *    Car 3a lands the composer and six candidate leaves and proves the corpus cannot move,
 *    on the strength of one fact: nothing calls them. Cars 3b–3g then route ONE DESK EACH,
 *    each ending on its own zero-drift manifest run, "so a drift is diagnosed against one
 *    desk's diff, not six" (ARCH §2.7). A lane that wires a second desk in the same commit
 *    destroys that property silently — the manifest would still be green if both routings
 *    happen to be byte-identical, and nobody would learn which one to blame when they are
 *    not. So the fence is not "nobody imports this": it is `ROUTED_DESKS` below, an EXACT
 *    roster that grows by ONE LINE PER CAR, in the same commit as the desk it admits. A
 *    seventh importer, or a desk reaching for another desk's candidates leaf, reds.
 *    And an EAGER import is worse than early: the prose corpus rides the lazy data
 *    chunk against 5,878 B of first-paint margin (`tests/build/vendorPdfLazy.test.js`), so a
 *    desk pulled into the eager graph re-files the whole corpus into the first-paint chunk.
 *    That gate needs a BUILD; this one is a source scan and runs on every gate.
 *
 * 2. THE COMPOSER MAY NOT REACH A LOCALE API. `localeCompare`, `Intl` and `toLocale*` all
 *    read the host's ICU/CLDR tables, so the SAME seed on two devices can order two
 *    candidate keys differently and compose two different sentences. The estate already bans
 *    `localeCompare` over `src/domain/**` from two sides (eslint and
 *    `tests/lint/localeCompareGuard.test.js`); what is NEW here is `Intl` and `toLocale*`
 *    over this module, and a ban asserted at the place the comparator actually lives, so a
 *    reader of the composer finds its own guard rather than inferring one.
 *
 * ⛔ EVERY ARM IS PLANT-CONVICTED THROUGH THE SAME SCANNER THE LIVE ARM USES. A fence whose
 * failure path has never run is a fence nobody has proven closes: the planted eager import
 * and the planted `localeCompare` below are driven through `importersOf` and `bannedApisIn`,
 * never through a second copy of them, so a scanner that stopped resolving paths reds on the
 * plant instead of passing on both halves.
 *
 * @enforced-by this file
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import {
  dirname, join, relative, resolve,
} from 'node:path';
import { describe, expect, test } from 'vitest';

import { CAR_4_LEAF_SPECIFIERS } from '../../src/domain/display/stateProse/composeStateProse.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

/** The seam this file fences. */
const COMPOSER = 'src/domain/display/stateProse/composeStateProse.js';
/** The kernel, and the only module the composer may import today. */
const KERNEL = './stateProseKernel.js';
/** The six sibling leaves, one per desk (M-F7). */
const CANDIDATE_LEAVES = Object.freeze([
  'src/domain/display/stateProse/defenseStateProseCandidates.js',
  'src/domain/display/stateProse/economyStateProseCandidates.js',
  'src/domain/display/stateProse/generalStateProseCandidates.js',
  'src/domain/display/stateProse/powerStateProseCandidates.js',
  'src/domain/display/stateProse/stressorsStateProseCandidates.js',
  'src/domain/display/stateProse/warFaithStateProseCandidates.js',
]);

/**
 * ⭐ THE ROSTER OF ROUTED DESKS — the fence's live half, and the ONE LINE a wiring car adds.
 *
 * Cars 3b–3g route one desk each, smallest first: stressors (2 call sites) · economy (1) ·
 * warFaith (1) · power (7) · defense (9) · general (11). Each car adds its own line here in
 * the same commit as the routing, so "one desk per car" is machine-checked rather than
 * promised: a second desk wired in the same commit reds on the arms below, by name, and the
 * receipt's per-stage manifest run keeps its diagnostic value.
 * @type {ReadonlyArray<{car: string, desk: string}>}
 */
const ROUTED_DESKS = Object.freeze([
  { car: '3b', desk: 'stressors' },
  { car: '3c', desk: 'economy' },
  { car: '3d', desk: 'warFaith' },
  { car: '3e', desk: 'power' },
  { car: '3f', desk: 'defense' },
  { car: '3g', desk: 'general' },
]);

/** The desk composer each routed car wired, repo-relative. */
const ROUTED_COMPOSERS = Object.freeze(ROUTED_DESKS
  .map(({ desk }) => `src/domain/display/stateProse/${desk}StateProse.js`).sort());
/** The candidates leaf each routed desk may now import, and no other. */
const ROUTED_LEAVES = Object.freeze(ROUTED_DESKS
  .map(({ desk }) => `src/domain/display/stateProse/${desk}StateProseCandidates.js`).sort());

/** Static `from '…'` specifiers only, the coupling walker's own reader. */
const IMPORT_RE = /(?:^|\n)\s*(?:import|export)\b[^;'"]*?from\s*['"]([^'"]+)['"]/g;
/** A dynamic `import('…')`, which a static reader would otherwise miss entirely. */
const DYNAMIC_IMPORT_RE = /\bimport\s*\(\s*['"]([^'"]+)['"]\s*\)/g;

/**
 * The locale APIs a seeded composer may not reach. `localeCompare` and `toLocale*` are
 * matched as CALLS so the words survive in prose; `Intl` is matched as an identifier,
 * because `Intl.Collator` and `new Intl.NumberFormat` are both reaches.
 */
const BANNED_APIS = Object.freeze([
  ['localeCompare', /\.localeCompare\s*\(/],
  ['toLocale*', /\.toLocale[A-Za-z]*\s*\(/],
  ['Intl', /(?:^|[^A-Za-z0-9_$.])Intl\s*\./],
]);

/** @param {string} dir @param {string[]} out */
function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (/\.(?:js|jsx)$/.test(full)) out.push(full);
  }
  return out;
}

/** Every source file under `src/`, repo-relative with forward slashes. */
const SRC_FILES = walk(join(ROOT, 'src'))
  .map((abs) => relative(ROOT, abs).replace(/\\/g, '/')).sort();

/** @param {string} rel @returns {string} */
const read = (rel) => readFileSync(join(ROOT, rel), 'utf8');

/**
 * Strip line and block comments so a scan reads CODE. The composer's own header names
 * `localeCompare` and `Intl` in the sentence that bans them, and a scanner that counted the
 * ban as a violation would force the guard to go undocumented to stay green.
 * @param {string} source
 * @returns {string}
 */
function codeOnly(source) {
  return source.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/(^|[^:])\/\/.*$/gm, '$1');
}

/**
 * Every module specifier a file imports, static and dynamic, in source order.
 * @param {string} source
 * @returns {string[]}
 */
function specifiersIn(source) {
  const code = codeOnly(source);
  return [
    ...[...code.matchAll(IMPORT_RE)].map((m) => m[1]),
    ...[...code.matchAll(DYNAMIC_IMPORT_RE)].map((m) => m[1]),
  ];
}

/**
 * Which files import `target`? Resolves every relative specifier to a repo-relative path, so
 * an importer inside the module's own directory (`./composeStateProse.js`) is seen as
 * readily as one six levels away. `files` is a list of `{rel, src}` so a PLANT can be driven
 * through this exact function without writing a file into the tree.
 * @param {string} target repo-relative path of the imported module
 * @param {ReadonlyArray<{rel: string, src: string}>} files
 * @returns {string[]} the importers, sorted
 */
function importersOf(target, files) {
  const found = [];
  for (const file of files) {
    if (file.rel === target) continue;
    const from = dirname(join(ROOT, file.rel));
    for (const specifier of specifiersIn(file.src)) {
      if (!specifier.startsWith('.')) continue;
      if (relative(ROOT, resolve(from, specifier)).replace(/\\/g, '/') === target) {
        found.push(file.rel);
        break;
      }
    }
  }
  return found.sort();
}

/**
 * Which banned locale APIs does this source reach for?
 * @param {string} source
 * @returns {string[]} the API names, sorted
 */
function bannedApisIn(source) {
  const code = codeOnly(source);
  return BANNED_APIS.filter(([, re]) => re.test(code)).map(([name]) => name).sort();
}

/** The live tree, in the shape `importersOf` reads. */
const LIVE_FILES = SRC_FILES.map((rel) => ({ rel, src: read(rel) }));

describe('the composer\'s import fence (ARCH §4.1, car 3a)', () => {
  test('⭐ THE COMPOSER IMPORTS THE KERNEL, AND NOTHING ELSE IT IS NOT LICENSED TO', () => {
    const specifiers = specifiersIn(read(COMPOSER));
    // The allowlist is JOINED to the module's own roster rather than transcribed here: a
    // fourth dependency has to be declared in `CAR_4_LEAF_SPECIFIERS` before it can pass,
    // and that roster is frozen at three by the domain suite.
    const allowed = new Set([KERNEL, ...CAR_4_LEAF_SPECIFIERS]);
    expect(specifiers.filter((s) => !allowed.has(s)), 'an unlicensed import in the composer')
      .toEqual([]);
    // TODAY it is the kernel AND THE CONNECTIVES LEAF. Pinned exactly, so the day another is
    // imported this line moves with it and a reader sees the seam widen.
    //
    // ⭐ THE ONE THAT WIDENED IT, AND WHY IT IS A CURE (REWRITE car 8a-11, SITTING §U c-5).
    // Car 3a landed ahead of car 4, so all three leaves were carried as FLOOR CONSTANTS and
    // this line read `[KERNEL]`. Car 8a-9 then authored the connectives leaf to its floors of
    // three while the composer's constant stayed at 1/1/0/0, so the estate held the lists in
    // TWO HOMES that disagreed, and every sentence written about "the leaf" by a reader of the
    // constant became false about the leaf. The composer now reads the leaf ARCH §4.1 names.
    // MEASURED before it landed (`scripts/lib/module-closure.mjs`): the closure moves 2 files /
    // 74,847 B to 3 / 76,893 B — one file, 2,046 bytes — against the four files and 150,231
    // bytes a `src/domain/prose/` lexicon was priced at and refused at car 8a-4. The other two
    // leaves are still floors, each for its own measured reason.
    expect(specifiers, 'the composer\'s whole import list at this car')
      .toEqual([KERNEL, CAR_4_LEAF_SPECIFIERS[0]]);
    expect(CAR_4_LEAF_SPECIFIERS[0], 'and the one that widened it is the CONNECTIVES leaf')
      .toBe('../../../data/dossierConnectives.generated.js');
    expect(CAR_4_LEAF_SPECIFIERS.length, 'and the licensed roster is three, frozen').toBe(3);
  });

  test('⭐ EXACTLY THE ROUTED DESKS IMPORT THE COMPOSER — one desk per car, and no other reach', () => {
    expect(importersOf(COMPOSER, LIVE_FILES), 'car 3a landed the seam unwired; 3b–3g wire ONE'
      + ' DESK EACH, so a manifest drift is diagnosable against one desk\'s diff')
      .toEqual([...ROUTED_COMPOSERS]);
    // AND NOBODY ELSE AT ALL: a component, a hook or a second desk reaching the composer
    // directly would compose outside a desk's one law, and the roster above would not say so
    // on its own — this is the same answer read as a whole-tree fact.
    expect(importersOf(COMPOSER, LIVE_FILES).filter((rel) => !/StateProse\.js$/.test(rel)),
      'only a DESK composes').toEqual([]);
  });

  test('⭐ EXACTLY THE ROUTED DESKS IMPORT A CANDIDATES LEAF, AND ONLY THEIR OWN', () => {
    const wired = CANDIDATE_LEAVES.flatMap((leaf) => importersOf(leaf, LIVE_FILES)
      .map((rel) => `${rel} -> ${leaf}`));
    expect(wired, 'a desk that called a candidates leaf before its own car, or another desk\'s')
      .toEqual(ROUTED_DESKS.map(({ desk }) => `src/domain/display/stateProse/${desk}StateProse.js`
        + ` -> src/domain/display/stateProse/${desk}StateProseCandidates.js`).sort());
    expect(ROUTED_LEAVES.length, 'one leaf per routed desk').toBe(ROUTED_DESKS.length);
    // ⛔⛔ AND THE SECOND ARGUMENT OF EVERY CANDIDATES CALL IS A BARE IDENTIFIER, NEVER AN
    // OBJECT LITERAL. This is a MEASURED defect, caught at car 3f and cured before it landed:
    // the wiring census's PRODUCER INDEX reads every object-literal key under `src/domain/**`
    // and `src/generators/**` as a WRITE, including a shorthand one. A desk that wrapped its
    // locals to hand them over (`candidates: fn('DS-DEF-2', { dp, compound, forces })`) minted
    // those names into the index, and the census's `absent` column moved on rows belonging to
    // other desks entirely: `measured 370 -> 378`, `not-produced 60 -> 52`, with eight rows
    // reclassified on `forces` and `structureKey` alone. A desk hands over a reading it
    // ALREADY HOLDS, under the name it already has.
    for (const { desk } of ROUTED_DESKS) {
      const code = codeOnly(read(`src/domain/display/stateProse/${desk}StateProse.js`));
      const calls = [...code.matchAll(/StateProseCandidates\s*\(\s*[^,]+,\s*([^)]*)\)/g)]
        .map((m) => m[1].trim());
      expect(calls.length, `${desk} calls its candidates leaf`).toBeGreaterThan(0);
      expect(calls.filter((arg) => !/^[A-Za-z_$][\w$]*$/.test(arg)),
        `${desk} hands its candidates leaf a fresh object literal, which mints producer-index keys`)
        .toEqual([]);
    }
    // ⛔ AND THE OTHER SIDE OF THE FENCE, IN THE SAME ARM SO IT CANNOT BE READ ALONE: a desk
    // whose car has not run yet reaches NEITHER the composer nor any leaf. Without this the
    // roster could be satisfied by a tree in which every desk was wired and the scanner had
    // gone dark — the empty answer and the exact answer would look the same.
    const routed = new Set(ROUTED_DESKS.map(({ desk }) => desk));
    const waiting = ['defense', 'economy', 'general', 'power', 'stressors', 'warFaith']
      .filter((desk) => !routed.has(desk));
    expect(waiting.length, 'six desks, less the ones landed cars have routed')
      .toBe(6 - ROUTED_DESKS.length);
    for (const desk of waiting) {
      const specifiers = specifiersIn(read(`src/domain/display/stateProse/${desk}StateProse.js`));
      expect(specifiers.filter((s) => /composeStateProse|StateProseCandidates/.test(s)),
        `${desk} is not routed yet and reaches neither the composer nor a leaf`).toEqual([]);
    }
  });

  test('⛔ A PLANTED EAGER IMPORT REDS, driven through the live scanner', () => {
    // Three shapes, because the fence must not be blind to any of them: a desk importing the
    // composer from inside the same directory; a component reaching down six levels; and a
    // DYNAMIC import, which a `from '…'` reader alone would miss entirely.
    const planted = [
      { rel: 'src/domain/display/stateProse/generalStateProse.js', src: "import { composeStateProse } from './composeStateProse.js';" },
      { rel: 'src/components/tabs/OverviewTab.jsx', src: "import { composeStateProse } from '../../domain/display/stateProse/composeStateProse.js';" },
      { rel: 'src/domain/display/stateProse/powerStateProse.js', src: "const m = await import('./composeStateProse.js');" },
    ];
    expect(importersOf(COMPOSER, planted), 'every shape of wiring is seen').toEqual([
      'src/components/tabs/OverviewTab.jsx',
      'src/domain/display/stateProse/generalStateProse.js',
      'src/domain/display/stateProse/powerStateProse.js',
    ]);
    // AND THE OTHER DIRECTION, so the scanner is not a rubber stamp: a same-named module in
    // another tree, and a bare-word specifier, are not this module.
    expect(importersOf(COMPOSER, [
      { rel: 'src/domain/other/__probe.js', src: "import { x } from './composeStateProse.js';" },
      { rel: 'src/domain/display/stateProse/__probe.js', src: "import { y } from 'composeStateProse';" },
    ]), 'a neighbour with the same basename is a different module').toEqual([]);
    // AND A COMMENT IS NOT AN IMPORT: the composer's own header names the wiring cars.
    expect(importersOf(COMPOSER, [
      { rel: 'src/domain/display/stateProse/__probe.js', src: "// import { z } from './composeStateProse.js';\nexport const a = 1;" },
    ]), 'a commented-out import is not a live edge').toEqual([]);
    // THE ANTI-VACUITY FLOOR: the scanner really does find real edges in the real tree, or
    // the empty answers above would be free. ⚠ THE WITNESS IS `legibilityRung`, NOT THE
    // KERNEL, and the reason is this car: every desk imported the kernel to call
    // `readStateProse`, and a desk routed through the composer stops doing so, so the
    // kernel's importer count SHRINKS as 3b–3g land. A floor keyed on it would fail for the
    // best possible reason, which makes it the wrong floor. `legibilityRung` is imported by
    // all six desks and this car touches none of those edges.
    expect(importersOf('src/domain/display/stateProse/legibilityRung.js', LIVE_FILES),
      'the rung constructor has live importers, so the scan is not simply blind').toEqual([
      'src/domain/display/stateProse/defenseStateProse.js',
      'src/domain/display/stateProse/economyStateProse.js',
      'src/domain/display/stateProse/generalStateProse.js',
      'src/domain/display/stateProse/powerStateProse.js',
      'src/domain/display/stateProse/stressorsStateProse.js',
      'src/domain/display/stateProse/warFaithStateProse.js',
    ]);
    // AND THE SHRINK ITSELF, ASSERTED RATHER THAN LEFT AS A SIDE EFFECT: a routed desk no
    // longer reaches the kernel directly. It reaches it through the composer, which is what
    // "the desk maps state to keys and nothing else" means once the seam exists.
    const kernelImporters = importersOf('src/domain/display/stateProse/stateProseKernel.js', LIVE_FILES);
    expect(kernelImporters, 'the composer is a live kernel importer').toContain(COMPOSER);
    expect(kernelImporters.filter((rel) => ROUTED_COMPOSERS.includes(rel)),
      'a routed desk reaches the kernel through the composer, never directly').toEqual([]);
  });
});

describe('the composer\'s locale-API ban (ARCH §4.1, P-F7)', () => {
  test('⭐ THE COMPOSER REACHES NO LOCALE API', () => {
    expect(bannedApisIn(read(COMPOSER)), 'a locale collation would order two candidate keys'
      + ' differently on two devices and compose two different sentences').toEqual([]);
    // The comparator it uses instead, pinned by shape so a lane cannot swap it quietly.
    expect(codeOnly(read(COMPOSER))).toMatch(/return a\.key < b\.key \? -1 : 1;/);
  });

  test('⭐ NOR DOES ANY CANDIDATES LEAF', () => {
    const offenders = CANDIDATE_LEAVES
      .flatMap((leaf) => bannedApisIn(read(leaf)).map((api) => `${leaf}: ${api}`));
    expect(offenders).toEqual([]);
  });

  test('⛔ A PLANTED LOCALE CALL REDS, in all three spellings', () => {
    expect(bannedApisIn('const s = list.sort((a, b) => a.key.localeCompare(b.key));'))
      .toEqual(['localeCompare']);
    expect(bannedApisIn('const c = new Intl.Collator("en").compare;')).toEqual(['Intl']);
    expect(bannedApisIn('const t = value.toLocaleUpperCase();')).toEqual(['toLocale*']);
    expect(bannedApisIn('Intl.NumberFormat().format(n) + x.toLocaleString() + a.localeCompare(b)'),
      'all three at once').toEqual(['Intl', 'localeCompare', 'toLocale*']);
    // ⛔ AND THE DOCUMENTATION EXEMPTION, WHICH IS THE REASON THE SCAN STRIPS COMMENTS: the
    // composer's header explains the ban in the words the ban forbids, and a scanner that
    // counted prose would force the guard to be undocumented in order to pass.
    expect(bannedApisIn('// never a.localeCompare(b), never Intl.Collator\nexport const x = 1;'))
      .toEqual([]);
    expect(bannedApisIn('/* Intl.Collator is banned here */\nexport const y = 2;')).toEqual([]);
    // A same-named property is not the global: `x.Intl.y` is somebody's data, not the API.
    expect(bannedApisIn('const v = payload.Intl.thing;')).toEqual([]);
  });
});

/**
 * ⛔⛔ THE ONE CANDIDATES LEAF THAT MAY IMPORT, AND EXACTLY WHAT (TASTE car M-3).
 *
 * "IMPORT NOTHING" WAS TRUE WHILE EVERY LIST WAS EMPTY, and it stops being the right rule the
 * moment a predicate is authored: a candidate function answers about the world, and the world
 * is read by modules. ARCH §6.3 makes `compromisedSecurityInstitutions` the reading of
 * DS-DEF-11's two `watch:` pools, and ARCH §5.3 gates that read on a MEASURED closure with a
 * refusal above the 293,079 B precedent — measured at 6 files / 150,985 B (52 per cent) and
 * ADMITTED, and re-measured on every run by
 * `tests/lint/proseTasteCorruption.walker.test.js`. So the fence narrows rather than lifts: a
 * leaf may import the modules NAMED HERE and nothing else, one row per leaf.
 *
 * ⚠ `./defenseStateProse.js` IS A CYCLE, DECLARED. The desk imports its candidates leaf and
 * the leaf reads `measuredMonsterFamily` back from the desk. The alternative was a SECOND home
 * for the family map — the drift class the estate refuses everywhere else — and both entry
 * orders are driven in `proseTasteCandidates.walker.test.js`. It costs no bundle byte: the
 * leaf is imported ONLY by that desk.
 *
 * ⛔ AND THE TABLE IS EMPTY AT THIS TIP, WHICH IS THE POINT (REWRITE car 8a-3). The taste's
 * dock carries that row because it landed DS-DEF-11's candidate function; this car lands the
 * taste's INSTRUMENTS and refuses its seven candidate functions to 8b with the desk sections
 * they serve, so every one of the six leaves still imports nothing. The row is deliberately
 * NOT parked here as a standing permission: the arm below asserts the licence is exact in BOTH
 * directions, so a licence for an import nobody makes reds exactly as loudly as an import
 * nobody licensed. 8b lands the row and the function it licenses in one commit, or neither.
 * @type {Readonly<Record<string, ReadonlyArray<string>>>}
 */
const LICENSED_LEAF_IMPORTS = Object.freeze({});

describe('the six candidates leaves are PURE HEADLESS LEAVES (ARCH §4.1, M-F7)', () => {
  test('all six exist and import ONLY what is licensed by name', () => {
    const importing = CANDIDATE_LEAVES
      .map((leaf) => ({ leaf, specifiers: specifiersIn(read(leaf)) }))
      .filter(({ leaf, specifiers }) => specifiers
        .some((spec) => !(LICENSED_LEAF_IMPORTS[leaf] || []).includes(spec)))
      .map(({ leaf, specifiers }) => `${leaf}: ${specifiers.join(', ')}`);
    expect(importing, 'a candidates leaf that grew an UNLICENSED dependency').toEqual([]);
    expect(CANDIDATE_LEAVES.length, 'one leaf per desk').toBe(6);
    for (const leaf of CANDIDATE_LEAVES) {
      expect(read(leaf).length, `${leaf} is empty`).toBeGreaterThan(200);
    }
    // ⭐ AND THE LICENCE IS EXACT IN BOTH DIRECTIONS: a leaf the licence does not name imports
    // NOTHING, and a leaf it does name imports exactly what it names — no more, and no fewer,
    // so a licence row for an import somebody removed reds here rather than standing as a dead
    // permission. The count is DERIVED from the licence table so the two move together, and
    // pinned as an integer beside it so a table that emptied itself cannot pass silently.
    const pure = CANDIDATE_LEAVES.filter((leaf) => specifiersIn(read(leaf)).length === 0);
    expect(pure.length, 'leaves that import nothing at all, derived from the licence table')
      .toBe(CANDIDATE_LEAVES.length - Object.keys(LICENSED_LEAF_IMPORTS).length);
    expect(pure.length, 'and the integer at this tip: no candidate function has landed yet').toBe(6);
    for (const [leaf, licensed] of Object.entries(LICENSED_LEAF_IMPORTS)) {
      expect(specifiersIn(read(leaf)).sort(), `${leaf} imports exactly its licence`)
        .toEqual([...licensed].sort());
    }
  });

  test('⛔ NONE OF THEM ITERATES A BLOCK\'S `pools` (P-F12) — a pool key is not a predicate', () => {
    // Building candidates by walking `pools` would offer every key the projector happened to
    // emit, including the block's own spines, and would push the desk's job onto the
    // composer's attach filter. The leaves must therefore reach `pools` NOWHERE IN CODE —
    // they take readings, not a corpus.
    const reaching = CANDIDATE_LEAVES
      .filter((leaf) => /\bpools\b/.test(codeOnly(read(leaf))));
    expect(reaching, 'a candidates leaf reaching for a pools table').toEqual([]);
    // The scanner is live: the same predicate SEES the word in a file that really has it.
    expect(/\bpools\b/.test(codeOnly(read('src/domain/display/stateProse/stateProseKernel.js'))),
      'the kernel does read pools, so the scan is not blind').toBe(true);
  });
});
