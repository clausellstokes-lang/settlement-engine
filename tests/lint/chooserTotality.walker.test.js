/**
 * chooserTotality.walker.test.js — HB-1. THE CHOOSER-TOTALITY STOP LAW, MADE MACHINERY,
 * and the owner's named-domain checklist asserted three separate ways.
 *
 * ⛔ THE LAW: every weighted decision fork in `src/domain` is classified in the habit fork
 * registry. A fork that lands unclassified REDS, and a wave that finds one STOPS.
 *
 * ── THE PARTITION HAS TWO HALVES AND ONE OF THEM IS BLIND ───────────────────────
 *
 * `discovered` is what the FOUR idiom signatures find: the softmax-and-sample pair, the
 * keyed race, an inline extremum over a computed score array, and the explicit register of
 * guard-chain choosers. `classified` is every registry row that is not a checklist row.
 * The two are asserted EXACTLY equal, both directions.
 *
 * ⚠ THE WALKER'S OWN BLIND SPOT, DECLARED rather than discovered later: an argmin over a
 * cost computed in a helper the scan cannot follow, a Bernoulli chance gate, and any fork
 * expressed as an if/else ladder over thresholds are NOT discoverable by signature. Those
 * are covered by the registry's hand-maintained checklist rows, which carry their own
 * totality assertion below — a declared blind spot with a second instrument beside it,
 * never a silent hole.
 *
 * ⭐⭐ THE ROOT-SET SELF-ASSERTION (and it earned its keep on its first run). The scan roots
 * are DECLARED here and then checked against the tree: any `src/domain/*` directory holding
 * a live idiom signature must be one of them. The failure mode this closes was never a
 * missed file, it was a missed PLACE — a totality walker whose roots miss a whole domain
 * directory does not report a gap, it reports SUCCESS. The volume widened its roots once
 * already, for a faith fork living outside them; this arm caught a second directory the
 * widening had missed, holding the very contest one of the owner-named rows depends on.
 *
 * ⭐ THE ONE NORMALIZATION POINT. The registry stores EXTENSIONLESS module ids so that it
 * cannot read as an importer to a raw-source scan keyed on a filename. `moduleFile()` below
 * is the single place the `.js` suffix is appended, and the guard-the-guard case proves the
 * append is real work rather than a no-op — an id that already carried the suffix would make
 * this function silently idempotent and the siting cure silently undone.
 *
 * ⚠ DERIVE, DON'T RESTATE. Every denominator below is a QUERY over the registry or the
 * tree. The only hand-written numbers are the two frozen ceilings, which exist precisely so
 * that moving them is a reviewable act rather than a silent one.
 *
 * @enforced-by itself (a source scan plus a registry query; no runtime coupling)
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join, relative } from 'node:path';
import { describe, expect, test } from 'vitest';

import { codeOnly as blankCommentsAndStrings } from '../helpers/codeOnlySource.js';

import {
  FORK_ARITIES,
  FORK_CLASS_VOCABULARY,
  FORK_DISPOSITIONS,
  HABIT_FORK_REGISTRY,
  NAMED_DOMAIN_LABELS,
  OWNER_DOMAIN_MAPPING,
} from '../../src/domain/worldPulse/habitForkRegistry.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

/**
 * THE DECLARED ROOTS. Checked against the tree below, never trusted.
 * @type {readonly string[]}
 */
const SCAN_ROOTS = Object.freeze([
  'src/domain/worldPulse',
  'src/domain/spatial',
  'src/domain/traditions',
  'src/domain/region',
]);

/** The FOUR idiom signatures. The fourth is a register rather than a scan, by design. */
const IDIOM_SIGNATURES = Object.freeze({
  SOFTMAX_SAMPLE: /\b(?:softmaxWeights|stableSampleByWeight)\s*\(/,
  KEYED_RACE: /\bhash01\s*\(/,
  SCORE_EXTREMUM: /\.sort\(\s*\([^)]*\)\s*=>[^;]*?\b[A-Za-z_$][\w$]*\s*\.\s*(?:[A-Za-z_$][\w$]*)?(?:[Ss]core|[Cc]ost|[Ww]eight)\b[^;]*?\)\s*\[\s*0\s*\]/,
});

/**
 * THE FOURTH SIGNATURE: guard-chain choosers cannot be found by shape, because a chain of
 * early returns looks like any other chain. One member today, and it is registered rather
 * than omitted because it was carried as a learning site in one table while two others
 * already ruled it deterministic.
 */
const GUARD_CHAIN_CHOOSERS = Object.freeze([
  'src/domain/worldPulse/espionage/espionageMath.js#deliberationRead',
]);

/** A module that DECLARES an idiom helper is not using it. */
const DECLARES_IDIOM = /(?:export\s+)?function\s+(?:hash01|softmaxWeights|stableSampleByWeight)\s*\(/;

/**
 * THE DEFER CEILING, exact in BOTH directions. Growth means a fork JOINED the defer list,
 * which the stop law forbids — a newly discovered fork is a chair-sized event, not an
 * automatic deferral. A shrink means a row found its close, and the number moves DOWN in
 * that same commit so the win is banked and the slot cannot be refilled unreviewed. This is
 * the argued-roster idiom, and it is why the constant is a COUNT rather than a list: a list
 * would restate what the registry already answers.
 */
// 29 -> 30 at IN-1c-a (HBF-33, ODQ §85.1); 30 -> 31 at WF-8a (HBF-34, ODQ §350); 31 -> 35 at ENC-1 (HBF-36..HBF-41, ODQ §885.7); 35 -> 36 at
// ENC-4 (HBF-42, the ROAD B ruling) — each move a chair-authorized registry mint landing its
// fork row, never a lane absorbing a discovery. ⭐ HBF-42 is the FOURTH member of the HBF-07 /
// HBF-33 / HBF-34 prose-pick family: the same cured `hash01` pick, copied verbatim a fourth
// time, taking its siblings' disposition rather than a fresh reading. Filing it STAY would rule
// for CHANCE_MEETING alone the question all three leave open, so the four close together.
// 36 -> 77 at EM-E0 (HBF-43..HBF-86, design §19 ruling 1 over the SIM-SEALS survey's Table 4
// "R") — the SAME chair-authorized-mint move as the four above and the largest of them, not a
// lane absorbing anything: the forty-four were found by a chair-commissioned survey, ruled
// registration-owed in the design, and land as forty-one deferrals plus three measured STAYs.
// ⛔ THE CEILING'S MEANING IS UNCHANGED — it is still every DEFER row in both directions — and
// the registration is pinned SEPARATELY below (SURVEY_REGISTRATION_ROWS and its split), so a
// row leaking between the two populations reds even though this one total would absorb it.
const DEFER_CEILING = 77;

/** The named-domain checklist's row count, asserted rather than read off. */
const NAMED_DOMAIN_ROWS = 14;

/**
 * ⭐⭐ EM-E0 — THE REGISTRATION'S ROSTER IS THE SURVEY'S, AND IT IS PARSED RATHER THAN RESTATED.
 * Design §19 ruling 1 rules that the draws Table 4 marks "R" become registry rows. Restating
 * those forty-four here would make this arm a copy of the thing it checks; the walker reads the
 * survey markdown and derives them, so the survey and the registry are held equal to each other
 * rather than each to a third transcription.
 */
const SURVEY_SOURCE = 'docs/implementation/surveys/SIM-SEALS-SURVEY-2026-09-19.md';

/** `| U-NN | `symbol` · `path:lines` | draws | R? | lands |` — Table 4's row shape. */
const SURVEY_TABLE4_ROW = /^\|\s*(U-\d+)\s*\|\s*`([A-Za-z_$][\w$]*)`[^|]*?·\s*`([^`]+)`\s*\|\s*(\d+)\s*\|([^|]*)\|/gm;

/** The survey's own stated totals, so a parser that silently stopped matching cannot pass. */
const SURVEY_SYMBOLS = 51;
const SURVEY_REGISTRATION_ROWS = 44;

/** Of the forty-four: three are measured NON-choosers (rng readers and weighted-sample helpers). */
const SURVEY_DEFERRED = 41;
const SURVEY_SETTLED = 3;

/** How many rows in the WHOLE registry declare an outcome vocabulary. Exact, both directions. */
const ROWS_WITH_ACTION_VOCABULARY = 5;

/** Table 4's rows as `module.js#symbol`, split by the "R" (registration owed) column. */
function surveyTable4() {
  const raw = readFileSync(join(ROOT, SURVEY_SOURCE), 'utf8');
  const all = [...raw.matchAll(SURVEY_TABLE4_ROW)];
  const owed = all
    .filter((m) => /^\*\*R\*\*/.test(m[5].trim()))
    .map((m) => `src/domain/${m[3].replace(/:.*$/, '')}#${m[2]}`);
  return { all, owed: [...owed].sort() };
}

/**
 * ⭐ THE PARTITION KEY, DERIVED FROM ONE FACT rather than from a second roster. A checklist row
 * WITH an owner-named domain is the owner's named-domain instrument; a checklist row WITHOUT one
 * is EM-E0's registration. Nothing else in the registry has that shape, which is what lets both
 * populations be counted without either being restated here.
 */
const SURVEY_ROWS = HABIT_FORK_REGISTRY
  .filter((row) => row.discovery === 'checklist' && row.domain === null);
const VOCABULARY_ROWS = HABIT_FORK_REGISTRY.filter((row) => row.actionVocabulary !== null);

/**
 * ⭐ THE ONE NORMALIZATION POINT between the registry's extensionless ids and the tree's
 * real filenames. Nothing else in this file appends a suffix.
 * @param {{ module: string }} row @returns {string}
 */
function moduleFile(row) {
  return `${row.module}.js`;
}

/**
 * A repo-relative module path as an ABSOLUTE file URL, for the vocabulary arm's dynamic import.
 * ⛔ NOT a second normalization point — it appends no suffix and takes a path `moduleFile()`
 * already made. It exists because a bare `import(\`../../${p}\`)` carries no static extension,
 * which the bundler's dynamic-import analysis cannot follow and warns on; an absolute file URL
 * is resolved by the runtime alone and is what the import really means.
 * @param {string} rel @returns {string}
 */
function moduleUrl(rel) {
  return pathToFileURL(join(ROOT, rel)).href;
}

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.js$/.test(p) && !/\.test\./.test(p)) out.push(p);
  }
  return out;
}

/**
 * ⛔ THE STRIP IS THE ESTATE'S OWN, NOT A SECOND SPELLING OF IT — and the first cut of this
 * cure WAS that second spelling, which is why the retirement is recorded rather than
 * quietly done. `codeOnly` already existed, already blanked comments AND string text with
 * offsets preserved, already kept template `${...}` interpolations standing, and was
 * already imported by ten files; it lived in a `.test.js`, so adopting it cost a lighting
 * census re-freeze (a test-file import re-registers that file's suites). The body moved to
 * `tests/helpers/codeOnlySource.js`, the old home re-exports it, and this walker imports it
 * — one guard, one spelling, no register moved.
 *
 * ⛔ WHY THIS WALKER NEEDS IT AT ALL, AND IT IS THIS ESTATE'S OWN LAW AT ITS SEVENTH SITE.
 * The claim here is a USE claim ("does this module INVOKE a weighted-chooser idiom"), and
 * for a use claim a string is a CITATION: a call cannot execute from inside a quoted
 * literal. The comment strip already conceded that for prose. The registry is the file that
 * proves the concession was incomplete — `habitForkRegistry.js` lives inside a scan root and
 * every row DESCRIBES an idiom in a `reason` string, so the moment a row quoted a call with
 * its own open paren the totality walker CONVICTED ITS OWN REGISTRY, minting
 * `habitForkRegistry.js#HABIT_FORK_REGISTRY` as a "discovered fork" that can never be
 * classified because it is not a fork. Three earlier rows escaped only by punctuation — they
 * spell the name with the paren on the wrong side — so the hole was live and invisible from
 * the registry's first commit.
 */

/**
 * Comments, string-literal text and import specifiers blanked, OFFSETS AND LINES PRESERVED.
 * Without this the scan reads a JSDoc mention, a quoted citation and an import line as uses —
 * the narrower-than-claim defect class in its other direction.
 *
 * ⛔ HORIZONTAL WHITESPACE ONLY, AND THE CLASS `[ \t]` IS THE WHOLE CURE. The mask replaces its
 * match with spaces of the same LENGTH, so any newline it swallows comes back as a SPACE.
 * Anchored `^\s*` under the multiline flag it swallowed the blank line standing above an
 * import — `\s` matches `\n` — and the blanked blob lost lines while keeping every offset, so
 * the length pin in the arm above stayed green over it. `[^\n]*?` already holds the body to
 * one line; the two `\s` classes were the whole leak. MEASURED before the cure, over every
 * file this walker reads: 26,345 newlines destroyed across 700 of 1,057 files, with the
 * walker's FINDINGS identical either way. Pinned by the line-structure arm below.
 * @param {string} src @returns {string}
 */
function codeOnly(src) {
  return blankCommentsAndStrings(src).replace(
    /^[ \t]*(?:import|export)\b[^\n]*?from[ \t]*['"][^'"]*['"];?[^\n]*$/gm,
    (m) => ' '.repeat(m.length),
  );
}

/** The nearest preceding top-level declaration name at an offset. */
function enclosingSymbol(code, index) {
  const decl = /^(?:export\s+)?(?:async\s+)?function\s+([A-Za-z_$][\w$]*)|^(?:export\s+)?const\s+([A-Za-z_$][\w$]*)\s*=/gm;
  let best = null;
  for (const m of [...code.matchAll(decl)]) {
    if (m.index > index) break;
    best = m[1] || m[2];
  }
  return best;
}

const DOMAIN_FILES = walk(join(ROOT, 'src/domain'))
  .map((p) => relative(ROOT, p).replace(/\\/g, '/'))
  .sort();

const IN_ROOTS = DOMAIN_FILES.filter((rel) => SCAN_ROOTS.some((r) => rel.startsWith(`${r}/`)));

/** Every `module#symbol` a signature finds inside the declared roots. */
function scanIdiomForks(files) {
  const found = new Set();
  for (const rel of files) {
    const code = codeOnly(readFileSync(join(ROOT, rel), 'utf8'));
    if (DECLARES_IDIOM.test(code)) continue;
    for (const re of Object.values(IDIOM_SIGNATURES)) {
      for (const m of code.matchAll(new RegExp(re.source, 'g'))) {
        found.add(`${rel}#${enclosingSymbol(code, m.index) || '<module>'}`);
      }
    }
  }
  return [...found].sort();
}

const DISCOVERED = [...new Set([...scanIdiomForks(IN_ROOTS), ...GUARD_CHAIN_CHOOSERS])].sort();
const CLASSIFIED = HABIT_FORK_REGISTRY
  .filter((row) => row.discovery !== 'checklist')
  .map((row) => `${moduleFile(row)}#${row.symbol}`)
  .sort();
const CHECKLIST_ROWS = HABIT_FORK_REGISTRY.filter((row) => row.discovery === 'checklist');
const DOMAIN_ROWS = HABIT_FORK_REGISTRY.filter((row) => row.domain !== null);

/** module#symbol -> its rows, for the two uniqueness arms. */
const BY_SYMBOL = new Map();
for (const row of HABIT_FORK_REGISTRY) {
  if (!row.symbol) continue;
  const key = `${moduleFile(row)}#${row.symbol}`;
  BY_SYMBOL.set(key, [...(BY_SYMBOL.get(key) || []), row]);
}

describe('HB-1 — the chooser-totality partition and the named-domain checklist', () => {
  test('the scan, the roots, the registry and the normalization are all real (guard the guard)', () => {
    // Every absence and every equality below is worthless if the walk, the detectors or the
    // registry silently emptied. The positive control is a chooser everyone agrees is
    // there: the estate's anchor softmax.
    expect(DOMAIN_FILES.length).toBeGreaterThan(400);
    expect(IN_ROOTS.length).toBeGreaterThan(300);
    expect(HABIT_FORK_REGISTRY.length).toBeGreaterThan(20);
    expect(Object.keys(IDIOM_SIGNATURES)).toHaveLength(3);
    expect(DISCOVERED).toContain('src/domain/worldPulse/settlementStrategy.js#evaluateSettlementStrategyRules');
    expect(DISCOVERED.length).toBeGreaterThan(GUARD_CHAIN_CHOOSERS.length);
    // ⭐ THE STRING STRIP IS PINNED IN BOTH DIRECTIONS, because a strip that blanked one
    // character too many would silently DELETE discoveries and this whole walker would
    // report SUCCESS for the same reason a missed root does. The registry's own row shape
    // is the negative case (it convicted `habitForkRegistry.js#HABIT_FORK_REGISTRY` before
    // the strip existed); a plain call and an INTERPOLATED call are the two positives.
    const stripped = codeOnly(`const reason = 'a keyed hash01(principalId) race';`);
    // anchored: the subject is a LITERAL built on the line above and the length arm below proves the strip returned that exact string rather than nothing
    expect(stripped, 'a quoted CITATION still reads as a use').not.toMatch(/\bhash01\s*\(/);
    expect(stripped, 'the strip changed the line length — offsets no longer line up')
      .toHaveLength(`const reason = 'a keyed hash01(principalId) race';`.length);
    expect(codeOnly(`const roll = hash01(seed);`), 'a REAL call stopped minting')
      .toMatch(/\bhash01\s*\(/);
    expect(
      codeOnly('const key = `${hash01(seed)}`;'),
      'a template INTERPOLATION is code, not text — blanking it would hide a real use',
    ).toMatch(/\bhash01\s*\(/);
    expect(
      codeOnly(`const s = 'it\\'s quoted'; const roll = softmaxWeights(w);`),
      'an ESCAPED quote ended the literal early and swallowed the code after it',
    ).toMatch(/\bsoftmaxWeights\s*\(/);
    // ⭐ THE NORMALIZATION IS REAL WORK, not a no-op. If a row ever carried its own suffix
    // this function would be silently idempotent for it, the registry would read as an
    // importer to every filename-keyed source scan, and the siting cure would be undone
    // without a single assertion changing. Both halves are checked: the append CHANGES the
    // string, and the result RESOLVES to a file on disk.
    for (const row of HABIT_FORK_REGISTRY) {
      expect(moduleFile(row), `${row.forkId} already carried a file extension`).not.toBe(row.module);
      expect(
        existsSync(join(ROOT, moduleFile(row))),
        `${row.forkId} names a module that does not resolve: ${moduleFile(row)}`,
      ).toBe(true);
    }
  });

  test('the import mask keeps the source\'s LINE STRUCTURE, not merely its length', () => {
    // ⛔ THE OTHER HALF OF THE OFFSET PIN ABOVE, AND IT WAS MISSING FOR AS LONG AS THE MASK HAS
    // EXISTED. The strip is LENGTH-preserving, which is all `enclosingSymbol` needs, so the arm
    // above passed while the mask quietly destroyed LINES: it was anchored `^\s*` under the
    // multiline flag, and `\s` MATCHES A NEWLINE, so a blank line standing above an import was
    // swallowed into the match and came back as a SPACE. Offsets survived; the blob stopped
    // being line-addressable. MEASURED at this tip over every file this walker reads: 26,345
    // newlines destroyed across 700 of 1,057 files. `lawBandTable.walker.test.js` docketed the
    // same defect from the outside and named it HB-1's own one-character fix; this is that fix's
    // instrument, and it lives here so the mask cannot silently re-acquire a vertical class.
    const fixture = [
      'const first = 1;',
      '',
      "  import { thing } from './thing.js';",
      'const roll = hash01(seed);',
      '',
    ].join('\n');
    const blanked = codeOnly(fixture);
    expect(blanked, 'the mask stopped preserving offsets').toHaveLength(fixture.length);
    expect(
      blanked.split('\n'),
      'the mask ate the newline of the blank line above the import. Every ^-anchored read of the'
      + ' blanked source below that point is now aimed at the wrong line, and a length-only pin'
      + ' cannot see it: blank the indentation with HORIZONTAL whitespace only.',
    ).toHaveLength(fixture.split('\n').length);
    expect(blanked.split('\n')[2].trim(), 'the import line itself was left unmasked').toBe('');
    expect(blanked.split('\n')[3], 'a real call under a masked import stopped being readable')
      .toBe('const roll = hash01(seed);');
  });

  test('⭐ THE ROOT SET is asserted against the tree — no domain directory with a live idiom escapes it', () => {
    const declared = new Set(SCAN_ROOTS);
    const missed = new Set();
    for (const rel of DOMAIN_FILES) {
      const directory = rel.split('/').slice(0, 3).join('/');
      if (declared.has(directory)) continue;
      const code = codeOnly(readFileSync(join(ROOT, rel), 'utf8'));
      if (DECLARES_IDIOM.test(code)) continue;
      if (Object.values(IDIOM_SIGNATURES).some((re) => re.test(code))) missed.add(directory);
    }
    expect(
      [...missed].sort(),
      'a src/domain directory holds a live idiom signature and is NOT in SCAN_ROOTS. A'
      + ' totality walker whose roots miss a whole domain directory does not report a gap —'
      + ' it reports SUCCESS. Widen SCAN_ROOTS and classify what the widening discovers.',
    ).toEqual([]);
  });

  test('⭐⭐ THE PARTITION: every discovered fork is classified, and every classified fork is discovered', () => {
    const unclassified = DISCOVERED.filter((key) => !CLASSIFIED.includes(key));
    expect(
      unclassified,
      'an unclassified weighted decision fork is live in the tree. THE STOP LAW: a wave that'
      + ' finds one STOPS — it does not file it as a deferral on the way past.',
    ).toEqual([]);
    const phantom = CLASSIFIED.filter((key) => !DISCOVERED.includes(key));
    expect(
      phantom,
      'the registry classifies a fork no signature finds. Either the symbol moved and the'
      + ' row must be re-aimed, or the row belongs on the CHECKLIST half, which is the'
      + ' hand-maintained instrument for forks no signature can see.',
    ).toEqual([]);
    expect(CLASSIFIED).toEqual(DISCOVERED);
  });

  test('no symbol carries TWO dispositions, and none carries TWO arities', () => {
    // Two assertions over two fields, because a guard over one cannot police the other.
    // The arity arm exists on an executed instance: one chooser read as flatly dyadic in one
    // table and per-action in two others, while all three agreed on the disposition — so the
    // disposition arm passed green on a record that told an implementer to bind a
    // counterpart to ten moves that have none.
    const symbolsWithTwoDispositions = [...BY_SYMBOL]
      .filter(([, rows]) => new Set(rows.map((r) => r.disposition)).size > 1)
      .map(([key]) => key).sort();
    expect(symbolsWithTwoDispositions).toEqual([]);
    const symbolsWithTwoArities = [...BY_SYMBOL]
      .filter(([, rows]) => new Set(rows.filter((r) => r.arity).map((r) => r.arity)).size > 1)
      .map(([key]) => key).sort();
    expect(symbolsWithTwoArities).toEqual([]);
    for (const row of HABIT_FORK_REGISTRY) {
      expect(FORK_DISPOSITIONS).toContain(row.disposition);
      if (row.arity !== null) expect(FORK_ARITIES).toContain(row.arity);
      for (const cls of row.circumstanceClasses) expect(FORK_CLASS_VOCABULARY).toContain(cls);
    }
  });

  test('every DEFER row carries a written close owed, and the defer list is exact', () => {
    const deferred = HABIT_FORK_REGISTRY.filter((row) => row.disposition === 'DEFER');
    const silent = deferred
      .filter((row) => !row.closeOwed || String(row.closeOwed).trim().length < 20)
      .map((row) => row.forkId);
    expect(
      silent,
      'a deferred fork carries no written close owed. An absent reason is how a blind spot'
      + ' signs its own clearance — the deferral has to say what would have to exist.',
    ).toEqual([]);
    expect(
      deferred.length,
      'the defer list CHANGED SIZE. If it GREW, a fork joined it — the stop law forbids that:'
      + ' a newly discovered fork is a chair conversation, not an automatic deferral. If it'
      + ' SHRANK, a row found its close: lower DEFER_CEILING in this same commit so the win'
      + ' is banked and the slot cannot be refilled unreviewed.',
    ).toBe(DEFER_CEILING);
    expect(new Set(HABIT_FORK_REGISTRY.map((row) => row.forkId)).size)
      .toBe(HABIT_FORK_REGISTRY.length);
    // ⛔ NOT ONE ROW SAYS LEARN AT THIS WAVE. The registry is born seeing the whole surface.
    expect(HABIT_FORK_REGISTRY.filter((row) => row.disposition === 'LEARN')).toEqual([]);
  });

  test('J-HB-23 (a) — FOURTEEN named-domain rows, each with a disposition and a non-empty reason', () => {
    expect(
      DOMAIN_ROWS.length,
      'the named-domain checklist changed size. The owner named these domains BY NAME, and a'
      + ' row inside another table is a row that gets lost — a table edit and its count are'
      + ' ONE edit.',
    ).toBe(NAMED_DOMAIN_ROWS);
    for (const row of DOMAIN_ROWS) {
      expect(FORK_DISPOSITIONS, `${row.forkId} has no recognised disposition`).toContain(row.disposition);
      expect(String(row.reason || '').length, `${row.forkId} is dispositioned without a reason`)
        .toBeGreaterThan(40);
    }
    // The checklist half is the declared blind spot's instrument, so it must be non-empty
    // independently of the idiom half — otherwise the "second instrument" is a sentence.
    expect(CHECKLIST_ROWS.length).toBeGreaterThan(0);
  });

  test('J-HB-23 (b) — the label set is SET-EQUAL both directions to the closed explicit eight', () => {
    const used = [...new Set(DOMAIN_ROWS.map((row) => row.domain))].sort();
    // ⛔ A DISTINCT-STRING COUNT IS THE VACUOUS FORM AND IS REFUSED: it passes green on a
    // table that dropped one label and misspelled another twice. This is set equality.
    expect(used).toEqual([...NAMED_DOMAIN_LABELS].sort());
    expect(NAMED_DOMAIN_LABELS).toHaveLength(8);
    expect(new Set(NAMED_DOMAIN_LABELS).size).toBe(NAMED_DOMAIN_LABELS.length);
  });

  test('J-HB-23 (c) — the owner\'s SEVEN spoken domains map TOTAL onto those eight labels', () => {
    const spoken = Object.keys(OWNER_DOMAIN_MAPPING);
    expect(spoken).toHaveLength(7);
    const covered = new Set();
    for (const [domain, labels] of Object.entries(OWNER_DOMAIN_MAPPING)) {
      expect(labels.length, `the owner domain "${domain}" maps to nothing`).toBeGreaterThan(0);
      for (const label of labels) {
        expect(NAMED_DOMAIN_LABELS, `"${domain}" maps to an unknown label ${label}`).toContain(label);
        covered.add(label);
      }
    }
    // TOTAL in both directions: every label is reached by some spoken domain, and the one
    // domain that reaches TWO is exactly why the label count is eight while the owner's is
    // seven. Writing the mapping down is what stops a later round "correcting" one into the
    // other.
    expect([...covered].sort()).toEqual([...NAMED_DOMAIN_LABELS].sort());
    expect(Object.values(OWNER_DOMAIN_MAPPING).filter((labels) => labels.length > 1)).toHaveLength(1);
  });

  test('⭐⭐ EM-E0 (a) — the SURVEY\'S Table 4 "R" roster and the registration are SET-EQUAL, both directions', () => {
    const { all, owed } = surveyTable4();
    // GUARD THE GUARD FIRST. A parser that stopped matching would make the equality below
    // vacuously true against an empty roster, which is the same failure a missed scan root is:
    // it does not report a gap, it reports SUCCESS. Both of the survey's own stated totals are
    // asserted before anything is compared, so the regex cannot quietly drift off the table.
    expect(all, `${SURVEY_SOURCE} — Table 4 stopped parsing`).toHaveLength(SURVEY_SYMBOLS);
    expect(owed, 'the "R" column stopped parsing').toHaveLength(SURVEY_REGISTRATION_ROWS);
    const registered = SURVEY_ROWS.map((row) => `${moduleFile(row)}#${row.symbol}`).sort();
    expect(
      registered,
      'the registration and the survey disagree. A key the SURVEY found and the registry lacks'
      + ' is a draw design §19 ruling 1 rules registration-owed and this file forgot; a key the'
      + ' REGISTRY carries and the survey never found is a row invented here, which is the same'
      + ' defect pointing the other way. The roster belongs to the survey, not to this file.',
    ).toEqual(owed);
    // The registration is DISJOINT from the two instruments that already existed: it adds no
    // owner-named domain row, and it adds nothing a signature can see (all forty-four were
    // found over a WIDER idiom set and WIDER roots than this walker scans, which is exactly
    // why they are checklist rows rather than idiom ones).
    expect(DOMAIN_ROWS.length, 'the registration moved the named-domain checklist').toBe(NAMED_DOMAIN_ROWS);
    expect(registered.filter((key) => DISCOVERED.includes(key)), 'a registered draw IS signature-visible — it belongs on the idiom half').toEqual([]);
  });

  test('⭐ EM-E0 (b) — every declared actionVocabulary RESOLVES BY IMPORT to a non-empty export, and only ONE row\'s lives off its own module', async () => {
    // ⛔ RESOLVED, NOT SPELLED. §16 claimed forty-two forks each carried a typed outcome
    // vocabulary; the survey measured ONE. A name checked against a name would have passed on
    // that claim too, so this arm IMPORTS and reads the binding. A vocabulary that moved
    // module, lost its export or emptied out reds here by fork id.
    expect(
      VOCABULARY_ROWS.length,
      'the count of rows declaring an outcome vocabulary MOVED. Growth means a fork learned to'
      + ' name its own outcomes, which is a win to bank in this same commit; a shrink means a'
      + ' vocabulary was dropped or invented away. Either way it is a reviewable act.',
    ).toBe(ROWS_WITH_ACTION_VOCABULARY);
    /** fork id -> where the words actually live, collected then asserted once. */
    const offModule = [];
    for (const row of VOCABULARY_ROWS) {
      const name = String(row.actionVocabulary);
      // Exactly ONE module may DEFINE the name — the cross-volume collision contract's own
      // claim, checked here rather than trusted. A re-export is not a second definition.
      const definers = DOMAIN_FILES.filter(
        (rel) => new RegExp(`^export\\s+const\\s+${name}\\s*=`, 'm').test(readFileSync(join(ROOT, rel), 'utf8')),
      );
      expect(
        definers,
        `${row.forkId} declares ${name}: exactly one src/domain module must define it, or the`
        + ' registry is naming a word two volumes spell differently.',
      ).toHaveLength(1);
      const own = /** @type {Record<string, unknown>} */ (await import(moduleUrl(moduleFile(row))));
      const onOwnModule = Object.prototype.hasOwnProperty.call(own, name);
      if (!onOwnModule) offModule.push(`${row.forkId}: ${definers[0]}`);
      const mod = onOwnModule ? own : /** @type {Record<string, unknown>} */ (await import(moduleUrl(definers[0])));
      const value = mod[name];
      const size = Array.isArray(value) ? value.length : Object.keys(/** @type {object} */ (value)).length;
      expect(size, `${row.forkId} declares ${name} and it is EMPTY`).toBeGreaterThan(0);
    }
    // ⭐⭐ THE MEASURED DIFFERENCE, PINNED RATHER THAN FLATTENED — and it was this arm's own
    // first run that found it. The estate's ONE pre-EM-E0 declaration names a vocabulary its
    // draw's module does not export and does not even mention: the strategy moves are minted
    // as a DEPENDENCY-FREE leaf by the cross-volume collision contract while the fork spells
    // its branches as literals, which is the estate's design rather than a defect. EM-E0's
    // four are held to the STRICTER form below, so the register is one row long and a second
    // arrival is a chair conversation rather than a paste.
    expect(
      offModule,
      'a row declares an outcome vocabulary that its own draw module does not export. Outside'
      + ' the one registered case that is how a seal comes to name words the module drawing'
      + ' them never types (FINITE-SEMANTICS) — the row owes a measurement, not a declaration.',
    ).toEqual(['HBF-17: src/domain/worldPulse/strategyMoves.js']);
    // …and EM-E0's own four resolve from the DRAW'S OWN MODULE, which is the form design §19
    // ruling 1 asks of a pin: the words a fork is sealed over are typed where it draws them.
    for (const row of SURVEY_ROWS.filter((r) => r.actionVocabulary !== null)) {
      const mod = /** @type {Record<string, unknown>} */ (await import(moduleUrl(moduleFile(row))));
      expect(
        Object.prototype.hasOwnProperty.call(mod, String(row.actionVocabulary)),
        `${row.forkId} declares ${row.actionVocabulary}, which ${moduleFile(row)} does not export`,
      ).toBe(true);
    }
  });

  test('⭐ EM-E0 (c) — the totality figures RE-DERIVED: the registry, the defer list and the registration\'s own split', () => {
    // Every number here is a QUERY, and each one is exact in both directions so that moving it
    // is a reviewable act. The registration's split is pinned SEPARATELY from DEFER_CEILING
    // because one total would absorb a row leaking between the two populations: forty-four rows
    // arriving while forty-four older ones quietly left would leave the total untouched.
    expect(HABIT_FORK_REGISTRY.length).toBe(DISCOVERED.length + CHECKLIST_ROWS.length);
    expect(SURVEY_ROWS.length, 'the registration changed size').toBe(SURVEY_REGISTRATION_ROWS);
    expect(
      SURVEY_ROWS.filter((row) => row.disposition === 'DEFER').length,
      'the registration\'s DEFER count moved. It is born deferring: this wave registers the'
      + ' forks, it does not dispose them.',
    ).toBe(SURVEY_DEFERRED);
    expect(
      SURVEY_ROWS.filter((row) => row.disposition === 'STAY').length,
      'the registration\'s SETTLED count moved. The three are MEASURED non-choosers — an rng'
      + ' reader and two weighted-sample helpers — recorded rather than dropped, on the'
      + ' guard-chain row\'s precedent. A fourth is a chair conversation, not a lane\'s call.',
    ).toBe(SURVEY_SETTLED);
    // …and the registration really is the WHOLE of the checklist half that carries no
    // owner-named domain, derived rather than pinned, so the partition key above cannot
    // silently acquire a third population that neither instrument would then count.
    expect(CHECKLIST_ROWS.length)
      .toBe(CHECKLIST_ROWS.filter((row) => row.domain !== null).length + SURVEY_ROWS.length);
  });
});
