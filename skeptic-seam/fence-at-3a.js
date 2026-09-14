/**
 * composeStateProseFence.test.js — ARCH-COMPOSED-PROSE car 3a: THE IMPORT FENCE AND THE
 * LOCALE-API BAN around the composer.
 *
 * ── THE TWO CLASSES THIS FILE EXISTS FOR ────────────────────────────────────────────
 *
 * 1. THE SEAM MUST BE REACHABLE FROM NOTHING, AND STAY THAT WAY UNTIL A CAR ROUTES IT.
 *    Car 3a lands the composer and six candidate leaves and proves the corpus cannot move,
 *    on the strength of one fact: nothing calls them. Cars 3b–3g then route ONE DESK EACH,
 *    each ending on its own zero-drift manifest run, "so a drift is diagnosed against one
 *    desk's diff, not six" (ARCH §2.7). A lane that wires a second desk in the same commit
 *    destroys that property silently — the manifest would still be green if both routings
 *    happen to be byte-identical, and nobody would learn which one to blame when they are
 *    not. And an EAGER import is worse than early: the prose corpus rides the lazy data
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
    // TODAY it is exactly the kernel: the three leaves do not exist until car 4 and the
    // composer carries their floors as constants instead. Pinned exactly, so the day one is
    // imported this line moves with it and a reader sees the seam widen.
    expect(specifiers, 'the composer\'s whole import list at this car').toEqual([KERNEL]);
    expect(CAR_4_LEAF_SPECIFIERS.length, 'and the licensed roster is three, frozen').toBe(3);
  });

  test('⭐ NOTHING IN `src/` IMPORTS THE COMPOSER — the seam is reachable from nothing', () => {
    expect(importersOf(COMPOSER, LIVE_FILES), 'car 3a lands the seam unwired; 3b–3g wire ONE'
      + ' DESK EACH, so a manifest drift is diagnosable against one desk\'s diff').toEqual([]);
  });

  test('⭐ NOTHING IN `src/` IMPORTS A CANDIDATES LEAF EITHER', () => {
    const wired = CANDIDATE_LEAVES.flatMap((leaf) => importersOf(leaf, LIVE_FILES)
      .map((rel) => `${rel} -> ${leaf}`));
    expect(wired, 'a desk that started calling its candidates leaf before its own car')
      .toEqual([]);
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
    // the empty answers above would be free.
    expect(importersOf('src/domain/display/stateProse/stateProseKernel.js', LIVE_FILES).length,
      'the kernel has live importers, so the scan is not simply blind').toBeGreaterThan(3);
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

describe('the six candidates leaves are PURE HEADLESS LEAVES (ARCH §4.1, M-F7)', () => {
  test('all six exist and import NOTHING', () => {
    const importing = CANDIDATE_LEAVES
      .map((leaf) => `${leaf}: ${specifiersIn(read(leaf)).join(', ')}`)
      .filter((row) => !row.endsWith(': '));
    expect(importing, 'a candidates leaf that grew a dependency').toEqual([]);
    expect(CANDIDATE_LEAVES.length, 'one leaf per desk').toBe(6);
    for (const leaf of CANDIDATE_LEAVES) {
      expect(read(leaf).length, `${leaf} is empty`).toBeGreaterThan(200);
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
