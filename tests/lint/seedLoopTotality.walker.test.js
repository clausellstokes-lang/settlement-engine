/**
 * seedLoopTotality.walker.test.js — habitat removal for the LOWER-BOUND SEED LOOP
 * class (epistemic prevention, wave EP-1).
 *
 * THE CLASS: a `for` loop over seeds inside ONE `it()` reports a LOWER BOUND, never a
 * count. The first failing seed throws, the loop dies, and vitest reports exactly one
 * failure — so a 30-of-100 breakage and a 1-of-100 breakage look identical in the
 * output. Worse, the seeds after the casualty never ran, so the fix that clears seed #7
 * can be "verified" against a corpus that never reached seed #8. Every seeded suite in
 * the estate has been quietly reporting floors (`unreachable-predicate-conjunction`,
 * 2026-07-26).
 *
 * THE WALK: scan the WHOLE tests/ corpus for `for` / `for…of` loops whose HEADER names a
 * seed (`seed`, `seeds`, `SEED`) and whose BODY contains a bare `expect(`. Those are the
 * loops that die early. (SCOPE, 2026-07-30: the walk covered four generation-facing trees
 * and the class lived on unguarded in the other twenty; it now walks `tests` itself, so a
 * new tree is covered the day it lands. The four swept trees are held at EXACT zero —
 * they may not even take a frozen row — while the newly-visible habitat is enumerated in
 * FROZEN_BARE_SEED_LOOPS below, shrink-only.) Exemptions, in the order checked:
 *   1. the file imports/uses `collectSeedFailures` — it has adopted the truthful idiom
 *      (tests/helpers/seedFailures.js), so its loops run every case by construction;
 *   2. the file header (first 40 lines) carries `// seed-loop: collected` — a file-wide
 *      justification, read by a reviewer;
 *   3. the loop line, or the line immediately above it, carries `// seed-loop: collected`
 *      — a per-loop justification;
 *   4. a case REGISTRATION reached before any assertion — `for (const seed of SEEDS) {
 *      it(…) }` — is exempt BY SHAPE, the same reason `it.each` / `test.each` are:
 *      vitest registers one case per item, runs every one, and reports the true count,
 *      so there is no early exit to hide. An assertion that precedes the registration
 *      still counts.
 * Surviving bare loops are frozen below, SHRINK-ONLY, and swept by wave EP-2.
 *
 * WHY THE HEADER, NOT THE BODY, decides seed-ness: a body-wide match ("this loop
 * mentions a seed somewhere") also catches loops over trade routes or threat levels
 * that merely pass a seed through, which are a broader class than this wave is staffed
 * to sweep. The header rule is the program's contract. The broader population is a
 * recorded finding, not a silent omission — see FINDING below.
 *
 * FINDING (2026-07-27, for the owner queue): the same early-exit defect afflicts ANY
 * multi-case `for` loop inside one `it()`, not only seed loops. A body-mentions-seed
 * scan of the same trees finds 29 files / 54 sites against this walker's 19 / 32. That
 * widening would RAISE frozen numbers, which a shrink-only ratchet cannot absorb, so it
 * must be a deliberate re-freeze after the EP-2 sweep — not a quiet edit here.
 *
 * KNOWN EDGES (line-scan heuristic, accepted; the spatialLedgerCoverage idiom):
 *   - Body extent is found by brace counting over lines with `//` comments and quoted
 *     string bodies stripped. A brace inside a regex literal or a nested template
 *     expression can mis-balance the count; the scan caps at 400 lines and falls back
 *     to a 3-line lookahead for a braceless single-statement loop. A mis-balanced body
 *     over-counts (one extra allowlist row) rather than missing a site.
 *   - A loop header split across lines is matched at the `for (` line; a seed named
 *     only on the continuation line is missed. None exist today.
 *   - `.forEach(seed => …)` and `.map` are NOT scanned. They share the early-exit
 *     defect, and they belong to the same widening decision recorded in FINDING above.
 *   - The `collectSeedFailures` exemption is file-wide: a file that converts ONE loop
 *     exempts its siblings too. Deliberate — EP-2 converts a file at a time, and the
 *     per-file count drops to 0 in one step, which is what shrink-only wants.
 *
 * REGENERATION: `UPDATE_EPISTEMIC_ALLOWLIST=1 npx vitest run tests/lint/seedLoopTotality.walker.test.js`
 * PRINTS a fresh literal and FAILS with instructions. It never writes a file — the
 * allowlist is a reviewed artifact, and a self-updating ratchet ratchets nothing.
 */
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';
import { describe, expect, test } from 'vitest';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

/** The WHOLE test corpus. Scanning `tests` itself rather than a list of trees removes
 *  the scope-drift class outright: a new tree is covered the day it lands. */
const SCAN_ROOTS = ['tests'];

/** The four trees the EP-1/EP-2 sweep drove to zero. They stay at EXACT zero: no frozen
 *  row may name a file here, so the banked win cannot be quietly spent. */
const GENERATION_FACING_ROOTS = ['tests/generators', 'tests/joins', 'tests/property', 'tests/simulation'];

const inGenerationTree = (rel) => GENERATION_FACING_ROOTS.some((root) => rel.startsWith(`${root}/`));

const FOR_HEADER_RE = /\bfor\s*\(/;
// Case-insensitive on purpose: the estate spells the loop variable `seed`, `SEEDS`, and
// `_seed` (a destructured config field). `\bseeds?\b` alone misses `_seed`, because `_`
// is a word character and kills the boundary — and that spelling is real
// (tests/generators/servicesSeverityPlaceholder.test.js:54).
const SEED_WORD_RE = /\bseeds?\b|SEED/i;
const EXPECT_RE = /\bexpect\s*\(/;
// A vitest case REGISTRATION opening inside the loop body — `it(`, `test(`, `it.each(`,
// `test.skip(`. A loop that REGISTERS one case per item is exempt for the same reason
// `it.each` is: vitest runs every case and reports the true count, so nothing exits
// early. The leading `[^.\w]` keeps `re.test(x)` / `s.it` from posing as a registration.
const CASE_REGISTRATION_RE = /(?:^|[^.\w])(?:it|test)\s*(?:\.\w+)*\s*\(/;
const COLLECTED_MARKER_RE = /\/\/\s*seed-loop:\s*collected/;
const ADOPTED_HELPER_RE = /collectSeedFailures/;
const HEADER_LOOKBACK_LINES = 40;
const BODY_SCAN_CAP = 400;

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

/**
 * Remove line comments and the CONTENTS of quoted strings so brace counting is not
 * confused by punctuation inside prose. Quotes are replaced by empty pairs rather than
 * deleted, so an assertion's shape survives for the `expect(` test.
 */
function stripNoise(line) {
  return line
    .replace(/\/\/.*$/, '')
    .replace(/'(?:[^'\\]|\\.)*'/g, `''`)
    .replace(/"(?:[^"\\]|\\.)*"/g, `""`)
    .replace(/`(?:[^`\\]|\\.)*`/g, '``');
}

/**
 * Count bare seed loops per file.
 * @returns {Record<string, { count: number, lines: number[] }>}
 */
function scanBareSeedLoops() {
  /** @type {Record<string, { count: number, lines: number[] }>} */
  const found = {};
  for (const root of SCAN_ROOTS) {
    const absRoot = join(ROOT, root);
    if (!existsSync(absRoot)) continue;
    for (const filePath of walk(absRoot)) {
      const rel = relative(ROOT, filePath).replace(/\\/g, '/');
      if (!/\.test\.(js|jsx)$/.test(rel)) continue;
      const source = readFileSync(filePath, 'utf8');
      // Exemption 1: the file has adopted the truthful idiom.
      if (ADOPTED_HELPER_RE.test(source)) continue;
      const lines = source.split(`\n`);
      // Exemption 2: a file-wide justification in the header.
      if (COLLECTED_MARKER_RE.test(lines.slice(0, HEADER_LOOKBACK_LINES).join(`\n`))) continue;
      const hits = [];
      for (let i = 0; i < lines.length; i += 1) {
        const stripped = stripNoise(lines[i]);
        if (!FOR_HEADER_RE.test(stripped)) continue;
        if (!SEED_WORD_RE.test(stripped)) continue;
        // Exemption 3: a per-loop justification.
        if (COLLECTED_MARKER_RE.test(lines[i])) continue;
        if (i > 0 && COLLECTED_MARKER_RE.test(lines[i - 1])) continue;
        if (loopBodyAsserts(lines, i)) hits.push(i + 1);
      }
      if (hits.length) found[rel] = { count: hits.length, lines: hits };
    }
  }
  return found;
}

/**
 * Index just past the `for (…)` header's matching close paren, or -1 when the parens do
 * not balance on this line (a header split across lines). Finding the real end of the
 * header matters: `for (const { _seed, ...cfg } of SWEEP) {` opens a brace INSIDE the
 * parens, and treating that destructuring brace as the body brace mis-slices the body.
 */
function forHeaderEnd(stripped) {
  const at = stripped.search(FOR_HEADER_RE);
  if (at < 0) return -1;
  let depth = 0;
  for (let i = stripped.indexOf('(', at); i >= 0 && i < stripped.length; i += 1) {
    if (stripped[i] === '(') depth += 1;
    else if (stripped[i] === ')') {
      depth -= 1;
      if (depth === 0) return i + 1;
    }
  }
  return -1;
}

/**
 * Does the loop that starts at `startIndex` contain a bare `expect(` in its body?
 * Brace counting from the body brace; a braceless single-statement loop is read directly
 * (on the header line, or on the first non-empty line after it). A case REGISTRATION
 * reached before any assertion ends the walk: that loop builds vitest cases, so it
 * carries no early-exit defect (exemption 4, the `it.each` rule by another spelling).
 */
function loopBodyAsserts(lines, startIndex) {
  const header = stripNoise(lines[startIndex]);
  const headerEnd = forHeaderEnd(header);
  const afterHeader = headerEnd >= 0 ? header.slice(headerEnd) : '';

  // Braceless, body on the header line: `for (const seed of SEEDS) expect(…);`
  if (!afterHeader.includes('{') && afterHeader.trim().length > 0) {
    return !CASE_REGISTRATION_RE.test(afterHeader) && EXPECT_RE.test(afterHeader);
  }

  let depth = 0;
  let opened = false;
  for (let j = startIndex; j < lines.length && j - startIndex < BODY_SCAN_CAP; j += 1) {
    // On the header line only the text after the close paren is body.
    const stripped = j === startIndex ? afterHeader : stripNoise(lines[j]);
    for (const ch of stripped) {
      if (ch === '{') { depth += 1; opened = true; } else if (ch === '}') depth -= 1;
    }
    if (opened) {
      // Registration wins on a shared line: `for (…) it('x', () => { expect(…) })` is
      // one vitest case per item, not one assertion the first failure kills.
      if (CASE_REGISTRATION_RE.test(stripped)) return false;
      if (EXPECT_RE.test(stripped)) return true;
      if (depth <= 0) return false;
    } else if (j > startIndex && stripped.trim().length > 0) {
      // Reached a non-empty line with no brace yet: braceless body on its own line.
      return !CASE_REGISTRATION_RE.test(stripped) && EXPECT_RE.test(stripped);
    }
  }
  return false;
}

/** Render the current scan as a paste-ready FROZEN_BARE_SEED_LOOPS literal. */
function renderLiteral(found) {
  const rows = Object.keys(found)
    .sort()
    .map((file) => `  '${file}': ${found[file].count},`)
    .join(`\n`);
  return `const FROZEN_BARE_SEED_LOOPS = Object.freeze({\n${rows}\n});`;
}

/**
 * FROZEN 2026-07-27 from this walker's own scan at composite-r4 d0fdcf7c (19 files /
 * 32 bare loops) over four trees, RE-FROZEN the same day after the EP-2 sweep converted
 * or justified every one.
 *
 * RE-FROZEN 2026-07-30 at the SCOPE WIDENING: the walk now covers the whole tests/
 * corpus, not four trees, and the newly-visible habitat is enumerated below — 10 files /
 * 13 loops, every one a genuine lower-bound loop inside a single `it()`. The four
 * generation-facing trees stay at EXACT zero and may never take a row here (enforced
 * below), so the EP-2 win cannot be spent to pay for a new offender elsewhere.
 *
 * To bank a win: convert the loop to collectSeedFailures + expectNoSeedFailures
 * (tests/helpers/seedFailures.js), which exempts the whole file and drops its row to 0
 * — delete the row. A loop that is truthful for some other reason takes the
 * `// seed-loop: collected — <justification>` marker instead. Never raise a number;
 * never add a file. A new file needing a row means a new lower-bound loop was authored,
 * which is the thing this gate exists to stop.
 */
const FROZEN_BARE_SEED_LOOPS = Object.freeze({
  'tests/data/foundingSeeds.test.js': 1,
  'tests/design/organicOrnament.test.js': 1,
  'tests/domain/autonomy/signalRegistry.walker.test.js': 1,
  'tests/domain/causeConjunctionContent.test.js': 1,
  'tests/domain/coalitionDissentCoupSoak.m9d.test.js': 1,
  'tests/domain/npc/npcBank.test.js': 1,
  'tests/domain/settlementStrategy.test.js': 3,
  'tests/domain/warMachineObeysPolitics.test.js': 2,
  'tests/kernel/proseHash.test.js': 1,
  'tests/pdf/countersealStructuredPath.test.js': 1,
});

describe('seed-loop totality walker (habitat removal)', () => {
  const found = scanBareSeedLoops();
  const scannedFileCount = SCAN_ROOTS.reduce((total, root) => {
    const abs = join(ROOT, root);
    if (!existsSync(abs)) return total;
    return total + walk(abs).filter((filePath) => /\.test\.(js|jsx)$/.test(filePath)).length;
  }, 0);

  if (process.env.UPDATE_EPISTEMIC_ALLOWLIST) {
    test('REGENERATION MODE: prints the fresh literal and fails on purpose', () => {
      // Printed, never written. The allowlist is a reviewed artifact: an auto-writing
      // ratchet silently absorbs the regressions it exists to surface.
      console.log(`\n${renderLiteral(found)}\n`);
      expect(
        false,
        `UPDATE_EPISTEMIC_ALLOWLIST is set: the fresh FROZEN_BARE_SEED_LOOPS literal was printed`
        + ` above. Review every changed row, paste it into this file by hand, and re-run WITHOUT`
        + ` the env var. This mode always fails so it can never be mistaken for a pass.`,
      ).toBe(true);
    });
    return;
  }

  test('no NEW bare seed loop in the generation-facing test trees', () => {
    const violations = [];
    for (const [file, { count, lines }] of Object.entries(found)) {
      const ceiling = FROZEN_BARE_SEED_LOOPS[file] ?? 0;
      if (count > ceiling) {
        violations.push(
          `${file}: ${count} bare seed loop(s) at line(s) ${lines.join(`, `)} (frozen ceiling`
          + ` ${ceiling}). A seed loop that asserts inline stops at the FIRST failing seed, so`
          + ` its failure count is a lower bound and every later seed goes unrun — the fix you`
          + ` verify against it may never have reached the seeds that still fail. Collect`
          + ` instead: const failures = collectSeedFailures(SEEDS, (seed) => { … });`
          + ` expectNoSeedFailures(failures, '<what this proves>')`
          + ` (tests/helpers/seedFailures.js). Already truthful for another reason? Say why:`
          + ` // seed-loop: collected — <justification>.`,
        );
      }
    }
    expect(violations).toEqual([]);
  });

  test('inventory honesty: every frozen row still exists and still offends at its count', () => {
    const stale = [];
    for (const [file, ceiling] of Object.entries(FROZEN_BARE_SEED_LOOPS)) {
      const actual = found[file]?.count ?? 0;
      if (!existsSync(join(ROOT, file))) {
        stale.push(`${file}: deleted or moved — remove its FROZEN_BARE_SEED_LOOPS row`);
      } else if (actual < ceiling) {
        stale.push(
          `${file}: ${actual} bare seed loop(s) found, ceiling ${ceiling} — a loop was converted;`
          + ` LOWER the row to ${actual} (delete it at 0) to bank the win`,
        );
      }
    }
    expect(stale).toEqual([]);
  });

  test('the scan is not vacuous (it sees the frozen population)', () => {
    const totalFound = Object.values(found).reduce((n, { count }) => n + count, 0);
    const totalFrozen = Object.values(FROZEN_BARE_SEED_LOOPS).reduce((a, b) => a + b, 0);
    expect(
      totalFound,
      'the scan found fewer bare seed loops than the frozen inventory — either loops were'
      + ' converted (lower their rows) or the scanner broke',
    ).toBeGreaterThanOrEqual(totalFrozen);
    expect(scannedFileCount, 'test files visited across the whole corpus').toBeGreaterThanOrEqual(1500);
  });

  test('the four generation-facing trees stay at EXACT zero (the EP-2 win is not spendable)', () => {
    // The widening enumerates habitat elsewhere; it may never re-admit any here. Both
    // halves matter: no live offender, and no frozen row that could legalise one.
    const live = Object.keys(found).filter(inGenerationTree).sort();
    expect(live, 'a bare seed loop landed back in a generation-facing tree').toEqual([]);
    const frozenRows = Object.keys(FROZEN_BARE_SEED_LOOPS).filter(inGenerationTree).sort();
    expect(frozenRows, 'the frozen roster may not carry a generation-facing file').toEqual([]);
  });

  // ── GUARD-THE-GUARD: the detector, on fixtures ─────────────────────────────
  // A scanner regression reads as "no offenders", which is indistinguishable from
  // success. `countIn` mirrors the per-file logic of scanBareSeedLoops exactly, so a
  // change to one that is not made to the other reds here.
  const countIn = (source) => {
    if (ADOPTED_HELPER_RE.test(source)) return 0;
    const lines = source.split(`\n`);
    if (COLLECTED_MARKER_RE.test(lines.slice(0, HEADER_LOOKBACK_LINES).join(`\n`))) return 0;
    let n = 0;
    for (let i = 0; i < lines.length; i += 1) {
      const stripped = stripNoise(lines[i]);
      if (!FOR_HEADER_RE.test(stripped)) continue;
      if (!SEED_WORD_RE.test(stripped)) continue;
      if (COLLECTED_MARKER_RE.test(lines[i])) continue;
      if (i > 0 && COLLECTED_MARKER_RE.test(lines[i - 1])) continue;
      if (loopBodyAsserts(lines, i)) n += 1;
    }
    return n;
  };

  test('the detector fires on every bare seed-loop spelling', () => {
    expect(
      countIn(`for (const seed of SEEDS) {\n  const w = gen(seed);\n  expect(w.factions.length).toBeGreaterThan(0);\n}`),
      'for…of over seeds',
    ).toBe(1);
    expect(
      countIn(`for (let i = 0; i < SEEDS.length; i++) {\n  expect(gen(SEEDS[i])).toBeTruthy();\n}`),
      'indexed loop naming SEEDS in the header',
    ).toBe(1);
    expect(
      countIn(`for (const seed of ['a', 'b']) expect(gen(seed)).toBeTruthy();`),
      'braceless single-statement loop',
    ).toBe(1);
    expect(
      countIn(`for (const seed of SEEDS) {\n  const w = gen(seed);\n  for (const f of w.factions) {\n    expect(f.name).toBeTruthy();\n  }\n}`),
      'assertion nested inside an inner loop still belongs to the seed loop',
    ).toBe(1);
    expect(
      countIn(`for (const seed of A) {\n  expect(gen(seed)).toBeTruthy();\n}\nfor (const seed of B) {\n  expect(gen(seed)).toBeTruthy();\n}`),
      'two sibling loops count twice',
    ).toBe(2);
  });

  test('the detector stays silent on truthful and non-asserting loops', () => {
    expect(
      countIn(`import { collectSeedFailures } from '../helpers/seedFailures.js';\nfor (const seed of SEEDS) {\n  expect(gen(seed)).toBeTruthy();\n}`),
      'file has adopted the helper',
    ).toBe(0);
    expect(
      countIn(`// seed-loop: collected — the loop only builds a corpus\nfor (const seed of SEEDS) {\n  expect(gen(seed)).toBeTruthy();\n}`),
      'file-header marker',
    ).toBe(0);
    expect(
      countIn(`const x = 1;\nfor (const seed of SEEDS) { // seed-loop: collected — see below\n  expect(gen(seed)).toBeTruthy();\n}`),
      'same-line marker',
    ).toBe(0);
    expect(
      countIn(`for (const seed of SEEDS) {\n  corpus.push(gen(seed));\n}\nexpect(corpus).toHaveLength(40);`),
      'corpus-building loop asserts nothing inside the body',
    ).toBe(0);
    expect(
      countIn(`for (const tier of TIERS) {\n  expect(gen(tier)).toBeTruthy();\n}`),
      'the header names no seed',
    ).toBe(0);
    expect(
      countIn(`it.each(SEEDS)('seed %s', (seed) => {\n  expect(gen(seed)).toBeTruthy();\n});`),
      'it.each is exempt by shape — vitest reports the true count itself',
    ).toBe(0);
    expect(
      countIn(`for (const seed of SEEDS) {\n  it(\`seed \${seed}\`, () => {\n    expect(gen(seed)).toBeTruthy();\n  });\n}`),
      'a loop that REGISTERS one case per seed runs them all — same shape as it.each',
    ).toBe(0);
    expect(
      countIn(`for (const seed of SEEDS) {\n  test('x', () => {\n    expect(gen(seed)).toBeTruthy();\n  });\n}`),
      'test() registration too',
    ).toBe(0);
    expect(
      countIn(`for (const seed of SEEDS) it('x', () => { expect(gen(seed)).toBeTruthy(); });`),
      'braceless registration on the header line',
    ).toBe(0);
  });

  test('the registration exemption is TIGHT (it does not mute a real bare loop)', () => {
    // The exemption exists because vitest runs every registered case. An assertion that
    // fires BEFORE the registration is still the early-exit defect, and a `.test(` method
    // call is not a registration at all — either mistake would silently empty this walker.
    expect(
      countIn(`for (const seed of SEEDS) {\n  expect(gen(seed)).toBeTruthy();\n  it('x', () => {});\n}`),
      'assert-then-register is still a bare loop',
    ).toBe(1);
    expect(
      countIn(`for (const seed of SEEDS) {\n  expect(RE.test(seed)).toBe(true);\n}`),
      'a .test( method call is not a case registration',
    ).toBe(1);
  });

  test('a marker two lines above does NOT exempt (the escape hatch stays tight)', () => {
    // Padded past the 40-line header window so the FILE-WIDE exemption cannot apply;
    // what is under test is the per-loop lookback, which is one line and no more. A
    // reason must sit where a reader of the loop will see it.
    const padding = Array.from({ length: HEADER_LOOKBACK_LINES + 1 }, (_, i) => `const pad${i} = ${i};`);
    const body = [
      `// seed-loop: collected — too far above the loop to count`,
      `const SEEDS = ['a', 'b'];`,
      `for (const seed of SEEDS) {`,
      `  expect(gen(seed)).toBeTruthy();`,
      `}`,
    ];
    expect(countIn([...padding, ...body].join(`\n`))).toBe(1);
  });
});
