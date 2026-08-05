/**
 * sovereigntyLightingContract.walker.test.js — THE INSTRUMENT THAT REPLACES THE PHANTOM.
 *
 * Five doc homes stated `sovereigntyTradeEnabled`'s green condition as "SP-B + SP-B2 +
 * ES-4 landed" and pointed at a WR-9 certification lighting-order row as if it were an
 * artifact. It never was — re-measured across src/, tests/ and docs/ at the fold head
 * `32cc17f7` and again at this landing. This file, with `SOVEREIGNTY_LIGHTING_EVIDENCE`
 * in src/domain/certification/warConvergenceContract.js, is the artifact: the contract
 * declares the three wave evidences and their addresses, and this walker MEASURES whether
 * each has arrived.
 *
 * ── WHY IT MUST STAY GREEN TODAY, AND WHAT THAT COSTS IT ────────────────────────
 * ES-4 is unbuilt, so the condition reads `UNSATISFIED_TRACKED`. A walker that failed on
 * that would red the base suite for the crime of the build order being the build order,
 * and the first thing anyone would do is delete it. So the assertions are chosen so that
 * BOTH build states pass:
 *
 *   • RATCHET — SP-B's and SP-B2's evidence must be PRESENT. Those waves have landed;
 *     if either regresses this reds, and that is a correct red.
 *   • BICONDITIONAL — the condition reads SATISFIED if and only if ES-4's marker is
 *     found. Green in both worlds, and it proves the state is driven by the measurement
 *     rather than by a constant.
 *   • MUTANTS — the evaluator is driven with injected presence maps: all-three ⇒
 *     SATISFIED (the flip, proven without waiting for ES-4), and each row absent in turn
 *     ⇒ UNSATISFIED_TRACKED naming exactly that wave (the discrimination).
 *   • NEGATIVE CONTROL — a fabricated marker finds nothing, so "found" is a real read
 *     and not a substring that always hits.
 *
 * ── THE ADDRESS RULE, TIGHTENED 2026-08-05 (chair ruling, ES-4 lane) ────────────
 * The first cut of this file measured a TEST_MARKER row with `src.includes(marker)` over
 * every test file. That read is VACUOUS IN THE ONLY DIRECTION THAT MATTERS, and it was
 * proven so by execution before this edit: a one-line file whose entire content was
 * `// ES-4-DISTANT-SOURCE-EVIDENCE` — a bare comment asserting nothing — flipped the ES-4
 * row to present and the whole condition to `SATISFIED / satisfiable true / missing []`,
 * with this walker still reporting 9 passed. An instrument whose green condition can be
 * forged by a comment is a worse artifact than the phantom row it replaced, because the
 * phantom was at least visibly absent.
 *
 * SO A MARKER IS EVIDENCE ONLY WHERE IT STANDS IN THE TITLE OF A TEST THAT WILL ACTUALLY
 * RUN. This is not a new law — the ES volume's §5 seam row 6 already spelled it ("the
 * marker `ES-4-DISTANT-SOURCE-EVIDENCE` in the pin's TITLE") and the contract row's own
 * `why` says to "put it in the test NAME rather than a comment, so deleting the pin
 * removes the evidence". This file simply stopped taking that on trust and started
 * measuring it. FOUR DOORS, each pinned individually below because a second door silently
 * covering a deleted first is this program's most-repeated verification failure:
 *   1. TITLE POSITION — the marker must sit inside the first quoted argument of a
 *      `describe` / `test` / `it` call that OPENS ITS OWN LINE. A comment, a string
 *      constant, an `expect(...)` argument and a mid-line call are all refused.
 *   2. THE TEST MUST RUN — `.skip`, `.todo` and `.failing` titles are refused. A parked
 *      pin proves exactly as much as a comment does.
 *   3. THE SUITE MUST RUN — a file is refused WHOLE unless every suite it opens is one
 *      this walker can PROVE runs. Line scanning cannot see block nesting, so refusing
 *      the file is the only honest verdict available for a title a parked suite would
 *      never reach. REPAIRED 2026-08-05 — THE FIRST CUT HAD THIS DOOR'S POLARITY
 *      BACKWARDS and shipped the very forgery this file exists to close, one spelling
 *      narrower. It refused a file only where one line matched BOTH a `describe(` opener
 *      AND the literal dotted `.skip`/`.todo`/`.failing`, so `describe.skipIf(true)`,
 *      `describe['skip']`, `describe . skip` and `xdescribe` were every one read as a LIVE
 *      suite and their inner titles credited. THREE OF THE FOUR ARE LIVE FORGERIES,
 *      executed end to end at the broken commit: a file whose only pin sat inside each of
 *      `describe.skipIf(true)`, `describe['skip']` and `describe . skip` reported
 *      `Test Files 1 skipped (1) / Tests 1 skipped (1)` — nothing ran, the pin's body was
 *      a deliberate `expect(1).toBe(2)` — while the instrument read SATISFIED / missing [].
 *      `xdescribe` is the fourth and is NOT one, and the difference is recorded rather
 *      than smoothed over: vitest exports no `xdescribe` and defines no such global, so
 *      that file dies with `xdescribe is not a function` (imported) or `is not defined`
 *      (bare) instead of quietly crediting. It is refused here as defence in depth against
 *      a jest-compat global or a local shim, not as a hole that was open. The door is now
 *      a CLOSED ALLOWLIST: a suite runs
 *      only when it is spelled bare (`describe(` / `suite(`) or carries a tightly-dotted
 *      chain drawn entirely from `RUNNING_SUITE_MODIFIERS`. An `x`/`f` prefix, a computed
 *      member, a space-broken member, a CONDITIONAL modifier (this estate spells
 *      `describe.runIf` 117 times and `describe.skipIf` 3 — those suites genuinely may
 *      not run) and `only` (which runs its own block by PARKING its siblings) are all
 *      refused. 92 of the estate's 2,314 test files park under this rule; none of them
 *      carries a marker, and the SP-B2 carrier is not among them.
 *   4. SELF-EXCLUSION — this walker never vouches for itself (it names every marker by
 *      import). Retained, and pinned as belt-and-braces rather than as the thing holding
 *      the line: door 1 already refuses every position this file spells a marker in.
 *
 * WHERE THAT LEAVES THE FAIL-CLOSED CLAIM — stated exactly as narrowly as it has been
 * executed, because the sentence that used to stand here ("EVERY REFUSAL FAILS CLOSED …
 * can never manufacture a lit market") was FALSE for door 3 and is the reason this repair
 * exists. Within the suite vocabulary this walker recognises — `describe` and `suite`,
 * with or without an `x`/`f` prefix — an unrecognised modifier spelling PARKS, and doors 1
 * and 2 refuse by construction, because an unrecognised modifier breaks the quote anchor
 * the title read is built on (`it.skipIf(true)('M', …)` and `xit('M', …)` both simply fail
 * to match). What that costs is one honest line in a title; what it buys is that no
 * spelling in that vocabulary can manufacture a lit market. It is NOT a claim about a
 * suite opened through some OTHER identifier: a bespoke `describeMatrix(…)` factory
 * wrapping a parked block is outside anything line scanning can see, and no assertion
 * below pretends otherwise.
 *
 * ── WHAT THIS FILE DELIBERATELY IS NOT ──────────────────────────────────────────
 * It is not a second gate scanner. `ENGINE_GATED_VIRTUAL_RULE_KEYS` is the estate's own
 * register of virtual keys that have a real gate — the CQ5 one-commit law puts a key
 * there in the SAME commit as its first gate read — so joining against it is an exact
 * mechanical read of build state that costs no new machinery. The trade sibling's R6
 * repair is the precedent, and its lesson is the reason no row here declares its own
 * build state: a table that asserts what it is supposed to be measuring can only ever
 * agree with itself.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';
import { describe, expect, test } from 'vitest';

import {
  SOVEREIGNTY_LIGHTING_EVIDENCE,
  SOVEREIGNTY_LIGHTING_FLAG,
  SOVEREIGNTY_LIGHTING_STATES,
  WAR_RULINGS_FLAG_KEYS,
  evaluateSovereigntyLighting,
} from '../../src/domain/certification/warConvergenceContract.js';
import { ENGINE_GATED_VIRTUAL_RULE_KEYS } from '../../src/domain/worldPulse/simulationRules.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

/** Every test file in the estate, read once. The marker addresses are measured here. */
const TEST_FILES = walk(join(ROOT, 'tests'))
  .filter((p) => /\.test\.(js|jsx)$/.test(p))
  .map((p) => ({ rel: relative(ROOT, p).replace(/\\/g, '/'), src: readFileSync(p, 'utf8') }))
  .sort((a, b) => a.rel.localeCompare(b.rel));

/** This walker's own address — door 4, and the one file that may never be a carrier. */
const SELF_REL = 'tests/lint/sovereigntyLightingContract.walker.test.js';

/**
 * DOOR 1 — a `describe`/`test`/`it` call opening its own line, capturing its modifier
 * chain (group 1) and its first quoted argument (group 3, quote-agnostic and
 * escape-aware). Anchored at line start through whitespace only, so a comment, a JSDoc
 * line, an argument to some other call and a mid-line reopen are all outside it.
 */
const TITLE_LINE = /^\s*(?:describe|test|it)((?:\.[A-Za-z$_][\w$]*)*)\s*\(\s*(['"`])((?:\\.|(?!\2)[^\\])*)\2/;

/** DOOR 2 — the modifier spellings under which a title never executes. */
const NON_RUNNING = /\.(?:skip|todo|failing)\b/;

/**
 * DOOR 3's DETECTOR — any line that opens a suite, in any access form this estate can
 * spell: an `x`/`f` prefix (group 1), the base word (group 2), and everything between it
 * and the opening paren (group 3 — dotted members, computed members, whitespace anywhere).
 * Deliberately GENEROUS, because it is only the detector: `suiteParksTheFile` below is the
 * verdict, so a spelling this misses is the ONLY way a parked suite can escape, and a
 * spelling it over-catches costs a file nothing but the right to carry a marker.
 */
const SUITE_OPENER = /^\s*(x|f)?(describe|suite)((?:\s*\.\s*[A-Za-z$_][\w$]*|\s*\[[^\]\n]*\])*)\s*\(/;

/**
 * DOOR 3's CLOSED ALLOWLIST — the only suite modifiers read as RUNNING. Each of these runs
 * its block UNCONDITIONALLY. `only` is deliberately absent: it runs its own block by
 * silencing every sibling, so a file that focuses anything is a parked file by another
 * route. `runIf`/`skipIf` are absent because their argument is evaluated at run time and
 * this walker reads text.
 */
const RUNNING_SUITE_MODIFIERS = Object.freeze(['concurrent', 'sequential', 'shuffle', 'each', 'for']);

/**
 * The chain's modifier tokens, split on DOTS ALONE and on nothing else. That is the whole
 * trick, and it is why no second "is this tightly dotted?" clause appears below: a
 * computed member (`['skip']`), a space-broken member (` . skip`) and an empty segment all
 * surface as tokens that are NOT bare identifiers, and `RUNNING_SUITE_MODIFIERS` holds
 * nothing but bare identifiers — a property this file PINS rather than assumes, since it
 * is the only thing standing between a non-dotted access and the allowlist. A separate
 * dotted-chain guard was written first and then removed: no input could make it change the
 * verdict, and a guard that cannot fire is this program's own named hazard class.
 */
const chainModifiers = (chain) => chain.replace(/^\./, '').split('.');

/**
 * DOOR 3's OTHER HALF — focus, at suite OR test level. `describe.only` / `it.only` /
 * `fdescribe` / `fit` park every block they do not name, which is a FILE-scope fact
 * exactly as a parked suite is, so it belongs to the same whole-file refusal.
 */
const FOCUSED = /^\s*(?:f(?:describe|it)\s*\(|(?:describe|suite|test|it)\s*[.[][^(\n]*\bonly\b)/;

/**
 * DOOR 3's VERDICT FOR ONE LINE — `true` when this line forces the whole file to be
 * refused. FAIL-CLOSED BY CONSTRUCTION: a detected suite opener is parked unless it is
 * positively proven to run, so an unrecognised spelling parks rather than credits. A line
 * that opens no suite at all is not this door's business and returns `false`.
 * @param {string} line @returns {boolean}
 */
function suiteParksTheFile(line) {
  if (FOCUSED.test(line)) return true;
  const m = SUITE_OPENER.exec(line);
  if (!m) return false;
  if (m[1]) return true;            // xdescribe / fdescribe — never a running suite
  if (m[3] === '') return false;    // bare `describe(` / `suite(` — the one zero-modifier form
  return !chainModifiers(m[3]).every((mod) => RUNNING_SUITE_MODIFIERS.includes(mod));
}

/**
 * THE ADDRESS READ — the titles of the tests in one source that will actually run.
 * Returns `[]` for a file holding a suite this walker cannot prove runs (door 3): line
 * scanning cannot see block nesting, and crediting a title inside a parked `describe` is
 * the same vacuity one level in.
 * @param {string} src @returns {string[]}
 */
function liveTitlesIn(src) {
  const lines = src.split('\n');
  if (lines.some((line) => suiteParksTheFile(line))) return [];
  const titles = [];
  for (const line of lines) {
    const m = TITLE_LINE.exec(line);
    if (m && !NON_RUNNING.test(m[1])) titles.push(m[3]);
  }
  return titles;
}

/** THE REFUSED READ, kept executable so the tightening is PROVEN and not merely claimed:
 *  any occurrence anywhere in the file. Used only by the side-by-side control below. */
const mentionedIn = (src, marker) => src.includes(marker);

/** THE ACCEPTED READ — the marker stands in a title that runs. */
const titledIn = (src, marker) => liveTitlesIn(src).some((title) => title.includes(marker));

/** Test files whose LIVE TITLES carry a marker token, this walker excluded (door 4).
 *  The corpus is a PARAMETER with the tree as its default, which is what lets the mutant
 *  below drive a forged corpus through the real `measure` — a tightening that could only
 *  be checked against the tree would be uncheckable on any day the tree agreed. */
const filesTitling = (marker, corpus = TEST_FILES) => corpus
  .filter(({ rel, src }) => rel !== SELF_REL && titledIn(src, marker))
  .map(({ rel }) => rel);

/** The same census under the REFUSED read — the control arm, never the measurement. */
const filesMentioning = (marker, corpus = TEST_FILES) => corpus
  .filter(({ rel, src }) => rel !== SELF_REL && mentionedIn(src, marker))
  .map(({ rel }) => rel);

/** THE MEASUREMENT — one wave row to one boolean, by the row's own declared kind. */
function measure(row, corpus = TEST_FILES) {
  if (row.kind === 'FLAG_MANIFEST') {
    return row.manifestFlags.length > 0
      && row.manifestFlags.every((flag) => ENGINE_GATED_VIRTUAL_RULE_KEYS.includes(flag));
  }
  return filesTitling(row.marker, corpus).length > 0;
}

const measured = Object.fromEntries(SOVEREIGNTY_LIGHTING_EVIDENCE.map((row) => [row.wave, measure(row)]));

describe('the sovereignty lighting condition — the contract is well-formed', () => {
  test('guard the guard: the tables this walker joins are all live and non-empty', () => {
    // Every claim below is worthless if one of these silently emptied.
    expect(TEST_FILES.length, 'the test-file scan found nothing').toBeGreaterThan(300);
    expect(ENGINE_GATED_VIRTUAL_RULE_KEYS.length, 'the CQ5 manifest is empty').toBeGreaterThan(3);
    expect(SOVEREIGNTY_LIGHTING_EVIDENCE).toHaveLength(3);
  });

  test('the flag it gates is a REAL war flag, and the three waves are named once each', () => {
    expect(WAR_RULINGS_FLAG_KEYS).toContain(SOVEREIGNTY_LIGHTING_FLAG);
    const waves = SOVEREIGNTY_LIGHTING_EVIDENCE.map((row) => row.wave);
    expect(waves).toEqual(['SP-B', 'SP-B2', 'ES-4']);
    expect(new Set(waves).size, 'a wave named twice would be counted twice').toBe(3);
    // Each row supplies a DIFFERENT part of the condition — surfaces, seam, source. Two
    // rows supplying the same thing would mean one of them is not load-bearing.
    expect(new Set(SOVEREIGNTY_LIGHTING_EVIDENCE.map((r) => r.supplies)).size).toBe(3);
  });

  test('every row carries exactly one kind of address, and a written reason', () => {
    const problems = [];
    for (const row of SOVEREIGNTY_LIGHTING_EVIDENCE) {
      const hasFlags = row.manifestFlags.length > 0;
      const hasMarker = row.marker.length > 0;
      if (row.kind === 'FLAG_MANIFEST' && (!hasFlags || hasMarker)) {
        problems.push(`${row.wave}: a FLAG_MANIFEST row names manifest flags and no marker`);
      }
      if (row.kind === 'TEST_MARKER' && (hasFlags || !hasMarker)) {
        problems.push(`${row.wave}: a TEST_MARKER row names a marker and no manifest flags`);
      }
      if (row.why.length < 40) problems.push(`${row.wave}: admitted without a reason`);
    }
    expect(problems, 'the evidence table is malformed').toEqual([]);
  });
});

describe('the sovereignty lighting condition — MEASURED against the tree', () => {
  test('RATCHET: SP-B and SP-B2 have landed, and their evidence is really there', () => {
    // These two waves are IN the tree. Their evidence going missing is a regression, and
    // this is the arm that says so. ES-4 is deliberately not asserted here.
    expect(measured['SP-B'], 'SP-B\'s two family flags are no longer both in the CQ5 manifest'
      + ' — either a flag was dropped or the row\'s spelling drifted').toBe(true);
    expect(measured['SP-B2'], 'no live test carries the SP-B2 leg-supply marker — the pin was'
      + ' renamed past its join key, or deleted').toBe(true);
    // …and the SP-B2 marker sits in exactly one place, so the join cannot be satisfied by
    // a stray copy in a file that proves nothing.
    const spb2 = SOVEREIGNTY_LIGHTING_EVIDENCE.find((row) => row.wave === 'SP-B2');
    expect(filesTitling(spb2.marker)).toEqual(['tests/domain/sovereigntyMarketStageWr10w.test.js']);
  });

  test('THE CONDITION READS SATISFIED IF AND ONLY IF ES-4\'s evidence is found', () => {
    const verdict = evaluateSovereigntyLighting(measured);
    const es4 = SOVEREIGNTY_LIGHTING_EVIDENCE.find((row) => row.wave === 'ES-4');
    const sourceLanded = filesTitling(es4.marker).length > 0;

    // Green in BOTH build states, which is the point: this walker tracks a condition, it
    // does not fail a build for the condition not yet being met.
    expect(SOVEREIGNTY_LIGHTING_STATES).toContain(verdict.state);
    expect(verdict.satisfiable, 'the state disagrees with the measurement that produced it')
      .toBe(sourceLanded);
    expect(verdict.missing, 'SP-B and SP-B2 are landed, so ES-4 is the only wave that may be'
      + ' missing — anything else here is a regression the ratchet above should have caught')
      .toEqual(sourceLanded ? [] : ['ES-4']);
    expect(verdict.flag).toBe(SOVEREIGNTY_LIGHTING_FLAG);
    expect(String(verdict.message).length).toBeGreaterThan(40);
  });

  test('THE NEGATIVE CONTROL: a fabricated marker finds nothing, so "found" is a real read', () => {
    // If the scan were a substring that always hit, every arm above would be theatre.
    expect(filesTitling('SV-0-LIGHTING-MARKER-THAT-NOTHING-CARRIES')).toEqual([]);
    // …and the live marker DOES hit, so the two halves are a real discrimination.
    expect(filesTitling('SP-B2-LEG-SUPPLY-EVIDENCE').length).toBeGreaterThan(0);
    // The line above spells a live marker in an `expect` argument, which is exactly the
    // position door 1 refuses — so this file mentions it without ever carrying it.
    expect(filesMentioning('SP-B2-LEG-SUPPLY-EVIDENCE')).toEqual(filesTitling('SP-B2-LEG-SUPPLY-EVIDENCE'));
  });
});

/**
 * THE ADDRESS RULE — the doors, one pin each. These run against SYNTHETIC sources rather
 * than the tree, so they keep discriminating on the day every wave has landed and the
 * tree can no longer supply a negative case of its own.
 */
describe('the sovereignty lighting condition — a marker is EVIDENCE only in a live title', () => {
  // A token no repository file carries, so a stray tree hit can never green these arms.
  const PROBE = 'ZZ-SYNTHETIC-ADDRESS-PROBE';
  const carries = (src) => titledIn(src, PROBE);

  test('DOOR 1 ACCEPTS: the marker in the title of a describe / test / it that runs', () => {
    expect(carries(`  it('${PROBE} — a real pin', () => { expect(1).toBe(1); });\n`)).toBe(true);
    expect(carries(`test('${PROBE} — a real pin', () => {});\n`)).toBe(true);
    expect(carries(`describe('${PROBE} — a real suite', () => {});\n`)).toBe(true);
    // Quote style is not the point, so all three spellings are admitted.
    expect(carries(`  it("${PROBE} — double quoted", () => {});\n`)).toBe(true);
    expect(carries(`  it(\`${PROBE} — templated\`, () => {});\n`)).toBe(true);
    // A modifier that still runs the test keeps the evidence.
    expect(carries(`  it.concurrent('${PROBE} — a real pin', () => {});\n`)).toBe(true);
  });

  test('DOOR 1 REFUSES: a BARE COMMENT no longer flips the condition — the chair control', () => {
    // THE EXECUTED DEFECT THIS EDIT CLOSES. Under the old `src.includes` read every one
    // of these returned true, and a file containing only the first line read as a landed
    // wave. The paired `mentionedIn` assertion is what makes that a proof rather than a
    // story: the refused read still accepts them, so the two reads really differ.
    const comment = `// ${PROBE}\n`;
    expect(carries(comment)).toBe(false);
    expect(mentionedIn(comment, PROBE)).toBe(true);

    const jsdoc = ` * ${PROBE} — named in a header\n`;
    expect(carries(jsdoc)).toBe(false);
    expect(mentionedIn(jsdoc, PROBE)).toBe(true);

    // A `describe`/`it` spelled inside a comment is still a comment.
    const commentedPin = ` * it('${PROBE} — what the pin will say one day')\n`;
    expect(carries(commentedPin)).toBe(false);
    expect(mentionedIn(commentedPin, PROBE)).toBe(true);

    // A string constant is not a title, and neither is another call's argument.
    const constant = `const marker = '${PROBE}';\n`;
    expect(carries(constant)).toBe(false);
    expect(mentionedIn(constant, PROBE)).toBe(true);

    const argument = `    expect(filesTitling('${PROBE}')).toEqual([]);\n`;
    expect(carries(argument)).toBe(false);
    expect(mentionedIn(argument, PROBE)).toBe(true);

    // A call reopened mid-line is refused too: door 1 is anchored at line start through
    // whitespace, and an unrecognised spelling fails CLOSED.
    const midLine = `}); it('${PROBE} — reopened', () => {});\n`;
    expect(carries(midLine)).toBe(false);
    expect(mentionedIn(midLine, PROBE)).toBe(true);
  });

  test('DOOR 2 REFUSES: a parked pin proves as little as a comment does', () => {
    for (const modifier of ['skip', 'todo', 'failing']) {
      const parked = `  it.${modifier}('${PROBE} — parked', () => {});\n`;
      expect(carries(parked), `it.${modifier} was credited as evidence`).toBe(false);
      expect(mentionedIn(parked, PROBE)).toBe(true);
    }
  });

  test('DOOR 3 REFUSES: a title inside a parked SUITE, and the whole file with it', () => {
    const parkedSuite = `describe.skip('outer', () => {\n  it('${PROBE} — a real body', () => {});\n});\n`;
    expect(carries(parkedSuite)).toBe(false);
    expect(mentionedIn(parkedSuite, PROBE)).toBe(true);
    // …and the refusal is the SUITE's doing, not the inner line's: the same inner line
    // under a live suite IS evidence. Without this arm door 3 could be refusing for the
    // wrong reason and nothing would say so.
    const liveSuite = `describe('outer', () => {\n  it('${PROBE} — a real body', () => {});\n});\n`;
    expect(carries(liveSuite)).toBe(true);
  });

  test('DOOR 3 REFUSES THE FOUR ESCAPE SPELLINGS — the forgeries the first cut credited', () => {
    // THE REPAIRED DEFECT. Door 3's first cut refused a file only where ONE line matched
    // both a `describe(` opener AND a literal dotted `.skip`/`.todo`/`.failing`. Every
    // spelling below was CREDITED before this repair, and the first three are LIVE
    // forgeries proven by running vitest on them: each reported `Tests 1 skipped (1)`
    // — the body is a deliberate `expect(1).toBe(2)` that never executes — while the
    // instrument read SATISFIED / missing []. `describe.skipIf` is a first-class vitest
    // API, not an exotic spelling. `xdescribe` is the exception and is pinned as defence
    // in depth rather than as a closed hole: vitest neither exports nor globals it, so
    // that file dies loudly instead of crediting. Refusing it costs nothing and covers a
    // jest-compat global or a local shim arriving later.
    const body = `\n  it('${PROBE} — a pin that never runs', () => { expect(1).toBe(2); });\n});\n`;
    const escapes = {
      'describe.skipIf(true)': `describe.skipIf(true)('parked by skipIf', () => {${body}`,
      "describe['skip']": `describe['skip']('parked by computed member', () => {${body}`,
      'describe . skip (spaced)': `describe . skip ('parked by spaced member', () => {${body}`,
      xdescribe: `xdescribe('parked by the x prefix', () => {${body}`,
    };
    for (const [spelling, src] of Object.entries(escapes)) {
      expect(carries(src), `${spelling} was credited — door 3 fails OPEN for it`).toBe(false);
      // …and each really is a forgery rather than a source that says nothing: the refused
      // read swallows it whole, so the two reads genuinely disagree on every one.
      expect(mentionedIn(src, PROBE), `${spelling} never carried the marker at all`).toBe(true);
    }
    // The conditional's other polarity is refused too — this walker reads TEXT, so it can
    // no more prove `runIf(true)` runs than it can prove `runIf(distExists)` does.
    expect(carries(`describe.runIf(true)('parked by runIf', () => {${body}`)).toBe(false);
  });

  test('DOOR 3 ALLOWLIST: only a suite PROVEN to run keeps its titles', () => {
    // The positive half, without which the door could be refusing everything and every
    // arm above would still be green. Bare openers and the unconditional modifiers run.
    const inner = `\n  it('${PROBE} — a real body', () => {});\n});\n`;
    for (const opener of ['describe(', 'suite(', 'describe.concurrent(', 'describe.sequential(',
      'describe.shuffle(', 'describe.each([1])(']) {
      expect(carries(`${opener}'outer', () => {${inner}`), `${opener} was parked but it runs`)
        .toBe(true);
    }
    // …and the allowlist is CLOSED, not a substring test: an unknown-but-plausible
    // modifier parks, which is the fail-closed direction.
    expect(carries(`describe.eachly('outer', () => {${inner}`)).toBe(false);
    expect(carries(`describe.concurrent.skipIf(x)('outer', () => {${inner}`)).toBe(false);
    // THE PROPERTY THE DOT-SPLIT RESTS ON, pinned rather than assumed. `chainModifiers`
    // splits on dots and nothing else, so a computed or space-broken access only parks
    // because every allowlist member is a BARE IDENTIFIER and such an access can never
    // produce one. Admit a member spelled with a bracket or a space and that reasoning
    // silently dies — this arm is what stops it dying quietly.
    for (const mod of RUNNING_SUITE_MODIFIERS) {
      expect(mod, `${JSON.stringify(mod)} is not a bare identifier — the dot-split no`
        + ' longer refuses computed and space-broken access').toMatch(/^[A-Za-z$_][\w$]*$/);
    }
    // Focus parks the file at BOTH levels: `only` runs its own block by silencing the
    // siblings, so a title outside it is exactly as unexecuted as one in a skipped suite.
    expect(carries(`describe.only('elsewhere', () => {});\ndescribe('outer', () => {${inner}`))
      .toBe(false);
    expect(carries(`it.only('elsewhere', () => {});\ndescribe('outer', () => {${inner}`))
      .toBe(false);
    expect(carries(`fdescribe('elsewhere', () => {});\ndescribe('outer', () => {${inner}`))
      .toBe(false);
    // `fit` is the ONE spelling FOCUSED's `f(describe|it)` arm uniquely owns — `fdescribe`
    // is caught a second time by the detector's own `x|f` prefix. Without this line that
    // arm was a guard that could not fire: deleting it left all 18 arms green, MEASURED,
    // which is exactly how door 4's first cut failed one commit ago. Neither `fit` nor
    // `fdescribe` exists in vitest, so both are defence in depth, not closed holes.
    expect(carries(`fit('elsewhere', () => {});\ndescribe('outer', () => {${inner}`))
      .toBe(false);
    // The estate's own dominant conditional spelling parks 92 of 2,314 files, and the one
    // file that actually carries a marker is not among them — asserted, not assumed.
    expect(carries(`describe.runIf(distExists)('outer', () => {${inner}`)).toBe(false);
    expect(filesTitling('SP-B2-LEG-SUPPLY-EVIDENCE'))
      .toEqual(['tests/domain/sovereigntyMarketStageWr10w.test.js']);
  });

  test('DOOR 4: this walker is excluded, and does not depend on that exclusion', () => {
    const self = TEST_FILES.find(({ rel }) => rel === SELF_REL);
    expect(self, 'the walker no longer finds itself — the exclusion joins on a stale path')
      .toBeDefined();
    // Belt: the exclusion is applied to every census this file performs.
    expect(filesTitling(PROBE)).toEqual([]);
    expect(filesMentioning(PROBE)).toEqual([]);
    // Braces: the exclusion is not what holds the line TODAY. This file never spells a
    // live marker in a title, so door 1 would refuse it even with the exclusion gone —
    // MEASURED, by deleting the exclusion and finding this file's other arms all green.
    for (const row of SOVEREIGNTY_LIGHTING_EVIDENCE) {
      if (row.kind !== 'TEST_MARKER') continue;
      expect(liveTitlesIn(self.src).some((title) => title.includes(row.marker)),
        `this walker titles ${row.wave}'s marker and would vouch for its own evidence`)
        .toBe(false);
      // So door 4 gets its own forged corpus, or it would be a guard that cannot fire:
      // the ONLY file is this walker, carrying a title that would otherwise be evidence.
      // Delete the exclusion and this arm reds — which is what makes it a door at all.
      const selfCorpus = [{
        rel: SELF_REL,
        src: `  it('${row.marker} — a title this file must never be credited for', () => {});\n`,
      }];
      expect(filesTitling(row.marker, selfCorpus),
        `this walker would vouch for ${row.wave} if it ever titled the marker`).toEqual([]);
      // …and the corpus is a real positive under any OTHER address, so the empty result
      // above is the exclusion talking and not a corpus that could never match.
      expect(filesTitling(row.marker, [{ ...selfCorpus[0], rel: 'tests/domain/other.test.js' }]))
        .toEqual(['tests/domain/other.test.js']);
    }
  });

  test('THE MUTANT: `measure` driven on a FORGED corpus refuses it and accepts a real pin', () => {
    // THE ARM THAT MAKES THE TIGHTENING LOAD-BEARING, and the reason the corpus is a
    // parameter. Comparing the two reads against the TREE proves nothing today — on a
    // clean tree they agree, so a revert to `src.includes` would slip through green. Here
    // the real `measure` is driven with corpora built to disagree, so the revert reds.
    for (const row of SOVEREIGNTY_LIGHTING_EVIDENCE) {
      if (row.kind !== 'TEST_MARKER') continue;

      const forged = [{ rel: 'tests/domain/forgedEvidence.test.js', src: `// ${row.marker}\n` }];
      expect(measure(row, forged), `${row.wave}'s evidence can be forged by a bare comment`)
        .toBe(false);
      // …and the forgery IS a forgery: the refused read swallows it whole.
      expect(filesMentioning(row.marker, forged)).toHaveLength(1);

      const real = [{
        rel: 'tests/domain/realEvidence.test.js',
        src: `  it('${row.marker} — the pin the row is an address for', () => {});\n`,
      }];
      expect(measure(row, real), `${row.wave}'s row cannot be satisfied by a real live pin —`
        + ' the SATISFIED arm would be unreachable and the instrument permanently dark')
        .toBe(true);
    }
  });

  test('THE MEASUREMENT USES THE TIGHT READ: every TEST_MARKER row agrees with it', () => {
    // The join between the module-level `measured` map and the address rule, asserted
    // rather than assumed — this is the tree-side half of the mutant above.
    for (const row of SOVEREIGNTY_LIGHTING_EVIDENCE) {
      if (row.kind !== 'TEST_MARKER') continue;
      expect(measured[row.wave], `${row.wave}'s measurement is no longer the titled read`)
        .toBe(filesTitling(row.marker).length > 0);
    }
  });
});

describe('the sovereignty lighting condition — the evaluator can flip, proven by injection', () => {
  test('SIMULATED EVIDENCE: with all three present the condition flips SATISFIED', () => {
    // THE FLIP, PROVEN WITHOUT WAITING FOR ES-4. The day ES-4 lands its marker, the
    // measured map above becomes exactly this one and the tree reaches this state on its
    // own. Pinning it by injection is what stops the SATISFIED arm from being an
    // unreachable branch for however many waves ES-4 is away.
    const all = Object.fromEntries(SOVEREIGNTY_LIGHTING_EVIDENCE.map((row) => [row.wave, true]));
    const verdict = evaluateSovereigntyLighting(all);
    expect(verdict.state).toBe('SATISFIED');
    expect(verdict.satisfiable).toBe(true);
    expect(verdict.missing).toEqual([]);
    expect(verdict.rows.every((row) => row.present)).toBe(true);
  });

  test('EACH row is load-bearing: dropping any ONE reads UNSATISFIED_TRACKED, naming it', () => {
    for (const dropped of SOVEREIGNTY_LIGHTING_EVIDENCE) {
      const presence = Object.fromEntries(
        SOVEREIGNTY_LIGHTING_EVIDENCE.map((row) => [row.wave, row.wave !== dropped.wave]),
      );
      const verdict = evaluateSovereigntyLighting(presence);
      expect(verdict.state, `${dropped.wave} dropped and the condition still read satisfied`)
        .toBe('UNSATISFIED_TRACKED');
      expect(verdict.missing).toEqual([dropped.wave]);
      expect(verdict.message, 'the failure names the wave that is missing').toContain(dropped.wave);
    }
  });

  test('DARK-NEVER-PERMISSIVE: only strict `true` counts as evidence', () => {
    // A scanner that broke and returned `undefined`, a truthy string, or a 1 must never
    // read as a landed wave — the same law the flag tables stand on.
    for (const impostor of [undefined, null, 1, 'true', {}, []]) {
      const presence = Object.fromEntries(
        SOVEREIGNTY_LIGHTING_EVIDENCE.map((row) => [row.wave, impostor]),
      );
      const verdict = evaluateSovereigntyLighting(presence);
      expect(verdict.state, `${String(impostor)} was accepted as evidence`).toBe('UNSATISFIED_TRACKED');
      expect(verdict.missing).toHaveLength(3);
    }
    // A non-object measurement is the all-dark reading, which is the honest one.
    expect(evaluateSovereigntyLighting(null).missing).toHaveLength(3);
  });
});
