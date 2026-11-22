/**
 * moduleScopeCwdRatchet.test.js — THE MODULE-SCOPE WORKING-DIRECTORY RATCHET.
 *
 * THE CLASS, AND IT HAS BITTEN THREE TIMES THIS WEEK. A walker or ratchet that finds the
 * repository by reading the WORKING DIRECTORY at module scope —
 *   const ROOT = process.cwd();
 * — is evaluated at MODULE LOAD, so a harness that imports it from any other directory walks
 * the HARNESS's tree instead of its own and reports a SILENT ZERO: no error, no empty-set
 * complaint, just a green instrument measuring a foreign estate. Judgment 111 names the two
 * pre-proof lanes it bit on 2026-09-21 (EM-A2a v6's and EM-A2b's); TOOL-31 (`dbfb9596b`)
 * reproduced the false zero against a control in two scratch estates and cured ONE member,
 * and recorded that the member belonged to a class of two hundred and eleven files across
 * `tests/`. A one-file cure leaves the habitat standing. This is the habitat's guard for the
 * two directories where the estate keeps its instruments.
 *
 * THE SURFACE, STATED BEFORE THE ARMS. Every `.js` / `.jsx` / `.mjs` / `.cjs` file under
 * `tests/build` and `tests/lint` — the two trees that hold the walkers, ratchets, censuses
 * and build pins whose whole job is to measure THIS repository. The population is FILES, not
 * sites: one file may carry several roots (today `migrationSearchPathPin.test.js` carries
 * two) and the cure is per-file either way.
 *
 * THE PREDICATE, EXACTLY. A `process.cwd()` CALL, in comment-stripped source, whose NEAREST
 * COLUMN-ZERO NON-BLANK LINE at or above it is a module-scope binding head — `const`, `let`,
 * `var`, optionally `export`ed. The backward scan is what makes a MULTI-LINE declaration
 * count (`const SQL = readFileSync(` with its root on the indented line beneath, live today
 * in `founderSeatsMigration.test.js`) while a FUNCTION BODY does not: a body's nearest
 * column-zero line is its own `function` or the `describe(` that opens the suite, neither of
 * which is a binding head. Every one of those cases is driven against the live detector in
 * A1 and A2 rather than asserted here.
 *
 * ⛔ WHY `codeOnly` AND NOT ITS SIBLING `commentsOnly`, WHICH THIS LANE'S BRIEF NAMED. Both
 * are the shared strips from `tests/helpers/codeOnlySource.js` — no second stripper is
 * written here, which is the rule that matters. The choice between them is the one that file's
 * own header settles: a detector making a USE claim must read CODE, "because a call cannot
 * execute from inside a quoted literal". `commentsOnly` keeps literal text, and this file MUST
 * hold `process.cwd()` inside literals — every planted control in A1 and A2 is one — so under
 * `commentsOnly` the ratchet would convict ITSELF, which A6 proves it does not. It would also
 * count three live non-calls inside string literals in `densityCreateBoundary.walker.test.js`
 * (135, 147, 267). MEASURED, so the swap is contract and not arithmetic: on this predicate the
 * two strips produce the IDENTICAL 47-file population at the as-of sha. One identifier flips it.
 *
 * ⚠ WHAT IT CANNOT SEE, DOCUMENTED AT THE GUARD AS AN ACCEPTED COST. A root reached without
 * the literal call — an imported helper that returns the working directory, `process.env.PWD`,
 * a bare `resolve('dist')` whose implicit base IS the working directory (measured at the as-of
 * sha: ZERO module-scope instances of that last form in either directory) — is invisible here.
 * So is a root computed inside a function the module then calls at load. The population is a
 * FLOOR on the class, never a proof that the class is empty.
 *
 * SHRINK-ONLY, EXACT IN BOTH DIRECTIONS. The banked counts below are a MEASUREMENT of what
 * the estate already is. More reds; fewer reds too, so a repair banks its win in the SAME
 * commit instead of silently restoring the headroom it just bought (the estate's
 * `domainAnyCastBaseline` / `tuningRegister` idiom). Raising a number here is not a repair.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';
import { describe, expect, test } from 'vitest';
import { codeOnly } from '../helpers/codeOnlySource.js';

/** The cure, spelled in this file's own root so the guard obeys the rule it enforces. */
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const SELF_REL = relative(ROOT, fileURLToPath(import.meta.url)).replace(/\\/g, '/');

/** The two instrument trees. Everything under them is scanned. */
const GUARDED_DIRS = Object.freeze(['tests/build', 'tests/lint']);

/**
 * THE BANKED POPULATION — a MEASUREMENT, taken by executing the predicate below over the
 * tree, never a target and never a guess.
 *
 * AS OF `80e855f269a1e8ca3dbcefa0a68a28507ecb339a` (train EM-T11's tip — this ratchet's
 * RE-CUT at this sha; the count below is measured FRESH here, not carried over arithmetic
 * from the prior as-of sha): tests/build 30 · tests/lint 17 · 47 files in all, out of 244
 * scanned.
 *
 * ⛔ TO LOWER IT: cure a file (derive its root from `import.meta.url`) and drop the number by
 * one IN THE SAME COMMIT. ⛔ NEVER RAISE IT — a new instrument spells its root the cured way.
 * TOOL-31's cure of `tests/build/domainGeneratorsBoundary.test.js` IS PRESENT in this tree,
 * content-verified: the file derives its root from `import.meta.url`, not `process.cwd()`.
 * It landed here as `e343ca859` — a re-committed equivalent carrying TOOL-31's identical
 * title and diff — because the lane hash `dbfb9596b` this file previously cited is ITSELF
 * still not a literal ancestor of this sha (`git merge-base --is-ancestor dbfb9596b
 * 80e855f26` exits non-zero); this banking trusts the FILE CONTENT, not the hash. tests/build
 * is 30 for that reason.
 * ⚠ tests/lint is 17, not the prior tip's 16: TOOL-30 added
 * `tests/lint/snapshotPromotion.census.walker.test.js` since then, and its ROOT is an IIFE
 * with a working-directory fallback (`catch { return process.cwd(); }`) — exactly the shape
 * A1 plants and this detector exists to catch. A NEW instrument can arrive already carrying
 * the class this ratchet refuses; the FIRST banking at a tip absorbs it rather than exempting
 * it.
 * THE GENERAL LESSON, independent of either hash or either directory: a cured file lowers the
 * bank, and the cure lowers the literal in THE SAME COMMIT — never leave the old ceiling
 * standing above the truth.
 */
const POPULATION_CEILING = Object.freeze({
  'tests/build': 30,
  'tests/lint': 17,
});
const CEILING_AS_OF_SHA = '80e855f269a1e8ca3dbcefa0a68a28507ecb339a';

/**
 * The anti-vacuity floor on the WALK itself, well below the 244 files scanned at the as-of
 * sha. A rename, a bad glob or a moved directory would drop the scan toward zero, and every
 * arm beneath it would then pass on nothing at all.
 */
const SCANNED_FLOOR = 200;

const DECL_HEAD = /^(?:export\s+)?(?:const|let|var)\s/;
const CWD_CALL = /(?:^|[^A-Za-z0-9_$.])process\s*\.\s*cwd\s*\(\s*\)/;

/** Named once so the failure messages and the header cannot drift apart. */
const CURE = [
  'THE CURE, one line, and it is the shape TOOL-31 landed (dbfb9596b, judgment 111):',
  "    const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');",
  'A root taken from the working directory is read at MODULE LOAD, so an importer sitting in',
  'another directory measures THAT tree and the instrument reports a silent zero.',
].join('\n');

/**
 * THE DETECTOR. Returns the 1-based line numbers, in `source`, of every module-scope
 * working-directory root. Driven directly by A1 and A2 against planted controls, so no arm
 * below rests on a claim about it.
 */
function moduleScopeCwdLines(source) {
  const lines = codeOnly(source).split('\n');
  const hits = [];
  let head = null;
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    if (line.trim() !== '' && !/^\s/.test(line)) head = line;
    if (CWD_CALL.test(line) && head !== null && DECL_HEAD.test(head)) hits.push(i + 1);
  }
  return hits;
}

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) walk(path, out);
    else out.push(path);
  }
  return out;
}

const SCANNED = GUARDED_DIRS
  .flatMap((dir) => walk(join(ROOT, dir)))
  .map((path) => relative(ROOT, path).replace(/\\/g, '/'))
  .filter((rel) => /\.(js|jsx|mjs|cjs)$/.test(rel))
  .sort();

const OFFENDERS = SCANNED
  .map((rel) => ({ rel, lines: moduleScopeCwdLines(readFileSync(join(ROOT, rel), 'utf8')) }))
  .filter(({ lines }) => lines.length > 0);

const countsByDir = (rows) => Object.fromEntries(
  GUARDED_DIRS.map((dir) => [dir, rows.filter(({ rel }) => rel.startsWith(`${dir}/`)).length]),
);
const LIVE_COUNTS = countsByDir(OFFENDERS);

/** THE TWO COMPARATORS — one per direction, both driven by their own controls in A3. */
const overrunsOf = (counts, ceiling) => GUARDED_DIRS
  .filter((dir) => (counts[dir] ?? 0) > ceiling[dir])
  .map((dir) => `${dir}: ${counts[dir]} module-scope working-directory roots, banked at ${ceiling[dir]}`);

const underrunsOf = (counts, ceiling) => GUARDED_DIRS
  .filter((dir) => (counts[dir] ?? 0) < ceiling[dir])
  .map((dir) => `${dir}: ${counts[dir]} module-scope working-directory roots, banked at ${ceiling[dir]} — LOWER the literal to ${counts[dir]}`);

const addressesOf = (dir) => OFFENDERS
  .filter(({ rel }) => rel.startsWith(`${dir}/`))
  .map(({ rel, lines }) => `  ${rel}:${lines.join(',')}`)
  .join('\n');

describe('module-scope working-directory ratchet (tests/build, tests/lint)', () => {
  test('A1 — THE DETECTOR IS LIVE: every shape of a module-scope working-directory root is convicted', () => {
    const planted = {
      'the plain root': 'const ROOT = process.cwd();',
      'a derived directory': "const MIG_DIR = resolve(process.cwd(), 'supabase/migrations');",
      'an exported root': "export const SRC = join(process.cwd(), 'src');",
      'a let binding': 'let repoRoot = process.cwd();',
      'a MULTI-LINE declaration, the root on the indented line':
        "const SQL = readFileSync(\n  resolve(process.cwd(), 'supabase/migrations/137.sql'),\n  'utf8',\n);",
      'an IIFE root with a working-directory fallback':
        'const ROOT = (() => {\n  try { return fromUrl(); } catch { return process.cwd(); }\n})();',
      'a one-line arrow reader bound at module scope':
        "const read = (p) => readFileSync(resolve(process.cwd(), p), 'utf-8');",
    };
    const missed = Object.entries(planted)
      .filter(([, source]) => moduleScopeCwdLines(source).length === 0)
      .map(([name]) => name);
    expect(
      missed,
      `the detector did not fire on a planted module-scope working-directory root — it is dark, and every count below it is meaningless:\n${missed.join('\n')}`,
    ).toEqual([]);
    // …and it reports the TRUE line, so a red is an address rather than a shrug.
    expect(moduleScopeCwdLines(planted['a MULTI-LINE declaration, the root on the indented line'])).toEqual([2]);
  });

  test('A2 — AND IT REFUSES THE NEAR-MISSES: a function body, a callback, a comment, a literal, the cure', () => {
    const refused = {
      'a function body': 'function readTree() {\n  const root = process.cwd();\n  return root;\n}',
      'a test callback': "test('reads the tree', () => {\n  const root = process.cwd();\n  expect(root).toBeTruthy();\n});",
      'a suite body': "describe('suite', () => {\n  const ROOT = process.cwd();\n});",
      'a line comment': '// const ROOT = process.cwd();',
      'a block comment': '/**\n * falls back to `process.cwd()`, which vitest sets to the project root.\n */',
      'a module-scope STRING literal': 'const FIXTURE = "const ROOT = process.cwd();";',
      'a module-scope TEMPLATE literal': 'const FIXTURE = `\nconst ROOT = process.cwd();\n`;',
      'the cure itself': "const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');",
    };
    const wrongly = Object.entries(refused)
      .filter(([, source]) => moduleScopeCwdLines(source).length > 0)
      .map(([name]) => name);
    expect(
      wrongly,
      `the detector convicted a near-miss, so its counts are noise rather than debt:\n${wrongly.join('\n')}`,
    ).toEqual([]);
  });

  test('A3 — THE SCAN IS NOT VACUOUS, and both comparators convict a population they should', () => {
    expect(
      SCANNED.length,
      `the walk over ${GUARDED_DIRS.join(' and ')} collapsed to ${SCANNED.length} files (floor ${SCANNED_FLOOR}) — every arm below would pass on nothing`,
    ).toBeGreaterThanOrEqual(SCANNED_FLOOR);
    for (const dir of GUARDED_DIRS) {
      expect(
        SCANNED.filter((rel) => rel.startsWith(`${dir}/`)).length,
        `${dir} contributed no scanned file — the directory moved or the walk is broken`,
      ).toBeGreaterThan(0);
    }
    expect(
      OFFENDERS.length,
      'the detector found NOTHING in either instrument tree. That is either the day the class was fully burned down — in which case lower both banked numbers to 0 in this commit — or the detector went dark.',
    ).toBeGreaterThan(0);

    // THE CONTROLS, driving the SAME two comparators the live arms drive. A re-implementation
    // here would prove nothing about the comparators.
    const empty = Object.fromEntries(GUARDED_DIRS.map((dir) => [dir, 0]));
    expect(
      underrunsOf(empty, POPULATION_CEILING).length,
      'a population of ZERO against a non-zero banked count must RED — the anti-vacuity floor',
    ).toBe(GUARDED_DIRS.length);
    expect(
      overrunsOf(empty, POPULATION_CEILING),
      'a population of zero may never be reported as an OVERRUN',
    ).toEqual([]);
    // ⛔ THE TWO DIRECTION CONTROLS ARE MEASURED AGAINST THE LIVE COUNTS AS THEIR OWN
    // CEILING, never against POPULATION_CEILING. Keyed to the banked literal they would move
    // with it, so this arm would go red beside A4 or A5 under exactly the plant that proves
    // those arms — an arm that cannot survive its own red-first is not a control.
    const oneMore = { ...LIVE_COUNTS, 'tests/build': LIVE_COUNTS['tests/build'] + 1 };
    expect(overrunsOf(oneMore, LIVE_COUNTS).length, 'one file MORE than banked must RED').toBe(1);
    const oneFewer = { ...LIVE_COUNTS, 'tests/build': LIVE_COUNTS['tests/build'] - 1 };
    expect(underrunsOf(oneFewer, LIVE_COUNTS).length, 'one file FEWER than banked must RED').toBe(1);
    expect(underrunsOf(LIVE_COUNTS, LIVE_COUNTS), 'the live counts against themselves are exact').toEqual([]);
    expect(overrunsOf(LIVE_COUNTS, LIVE_COUNTS), 'the live counts against themselves are exact').toEqual([]);
  });

  test('A4 — NO GUARDED DIRECTORY CARRIES MORE MODULE-SCOPE WORKING-DIRECTORY ROOTS THAN BANKED', () => {
    const overruns = overrunsOf(LIVE_COUNTS, POPULATION_CEILING);
    expect(
      overruns,
      `\n${overruns.join('\n')}\n\n`
      + `A NEW instrument under ${GUARDED_DIRS.join(' or ')} finds the repository by reading the working\n`
      + `directory. The banked numbers only SHRINK: do not widen them.\n\n${CURE}\n\n`
      + `The population as it stands (banked at ${CEILING_AS_OF_SHA}), file:line:\n`
      + `${GUARDED_DIRS.map((dir) => `${dir} (${LIVE_COUNTS[dir]} of ${POPULATION_CEILING[dir]} banked):\n${addressesOf(dir)}`).join('\n')}\n`,
    ).toEqual([]);
  });

  test('A5 — AND NONE CARRIES FEWER: a cure banks its win in the SAME commit', () => {
    const underruns = underrunsOf(LIVE_COUNTS, POPULATION_CEILING);
    expect(
      underruns,
      `\n${underruns.join('\n')}\n\n`
      + `A file left this population, which is the good direction — but a ceiling left standing above\n`
      + `the truth silently restores the headroom the cure just bought, and the next instrument spends\n`
      + `it. Lower the literal in POPULATION_CEILING to the measured number in THIS commit, and move\n`
      + `CEILING_AS_OF_SHA to the sha you measured at.\n\n${CURE}\n\n`
      + `⚠ TOOL-31's cure of tests/build/domainGeneratorsBoundary.test.js is ALREADY reflected in\n`
      + `the banking above (CEILING_AS_OF_SHA = ${CEILING_AS_OF_SHA}) — a red on THIS arm now means\n`
      + `a FURTHER file left the population since that sha, not TOOL-31's.\n`,
    ).toEqual([]);
  });

  test('A6 — THE RATCHET IS NOT IN ITS OWN POPULATION: it derives its root from its own address', () => {
    expect(
      SCANNED,
      'the ratchet is not inside the trees it walks — the walk or the file moved',
    ).toContain(SELF_REL);
    // ── THE LIVENESS ANCHOR FOR THE EXCLUSION BELOW (tests/helpers/anchoredNegatives.js).
    // An exclusion asserted alone reads TRUE for two different reasons — this file is
    // correctly absent, or the population drifted out from under the arm and is empty.
    // ⛔ NEITHER HELPER FITS, and the reason is this ratchet's own design: every member of
    // OFFENDERS is a file the ratchet exists to CURE, so a named anchor sibling would red on
    // the day it is repaired, and an anchor drawn from the collection itself is circular. The
    // two properties a sibling would have bought are pinned HERE instead: the arm above proves
    // SELF_REL is spelled in the walk's own key space and reachable by the walk, and the arm
    // below proves the population is live. A3 pins the same non-emptiness, and the duplication
    // is deliberate — a reason must sit in the arm it anchors, where a reader of the exclusion
    // will see it, rather than one test away.
    const offenderRels = OFFENDERS.map(({ rel }) => rel);
    expect(
      offenderRels.length,
      'the offender population is EMPTY, so the exclusion below cannot tell "correctly absent" from "the detector went dark" — cure the detector, and never delete the exclusion to get green',
    ).toBeGreaterThan(0);
    expect(
      offenderRels,
      `${SELF_REL} convicts itself. Its planted controls are LITERALS, which the shared \`codeOnly\` strip blanks; a self-conviction means the strip changed under it and every count above is noise.`,
    ).not.toContain(SELF_REL); // anchored: the arms above pin SELF_REL in the walk's key space and the population non-empty
    // The positive half: this file really does spell the cure, so A6 cannot pass by the file
    // merely having no roots at all.
    const own = codeOnly(readFileSync(join(ROOT, SELF_REL), 'utf8'));
    expect(
      own.split('\n').some((line) => DECL_HEAD.test(line) && line.includes('fileURLToPath(import.meta.url)')),
      'this file must itself derive its root from import.meta.url at module scope',
    ).toBe(true);
  });
});
