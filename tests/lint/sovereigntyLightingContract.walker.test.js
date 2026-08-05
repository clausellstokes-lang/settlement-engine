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
 *      never reach. REPAIRED THREE TIMES ON 2026-08-05, and the fourth cut — this one —
 *      stops repairing SPELLINGS and states a POLARITY instead, because the first three
 *      each closed the spellings that had been found and each was falsified within hours
 *      by a spelling nobody had thought of. Cut one refused a file only where ONE line
 *      matched both a `describe(` opener and a literal dotted `.skip`/`.todo`/`.failing`,
 *      so `describe.skipIf(true)`, `describe['skip']`, `describe . skip` and `xdescribe`
 *      were read as LIVE suites. Cut two fixed that with a closed allowlist but read
 *      PHYSICAL lines, so the same spellings walked back in with a newline inside them.
 *      Cut three welded a dangling head before scanning — but its head detector and its
 *      opener detector shared the character class `[^\]\n]`, so an UNTERMINATED computed
 *      member (`describe[` ending a line) was invisible to both, and TEN more spellings
 *      walked through. NINE of those ten join the earlier rounds in the eighteen-spelling
 *      escape battery below; the tenth — a comment written between the members — sits in
 *      the polarity arm beside the routes that are not spellings at all.
 *   4. SELF-EXCLUSION — this walker never vouches for itself (it names every marker by
 *      import). Retained, and pinned as belt-and-braces rather than as the thing holding
 *      the line: door 1 already refuses every position this file spells a marker in.
 *
 * ── WHAT DOOR 3 CLAIMS — A POLARITY, NOT A REACH (fourth statement, chair ruling) ──
 * The three statements before this one were all of the same KIND: they described what the
 * detector could SEE, and each was falsified by a spelling outside that description. A
 * claim of the form "I recognise every parked spelling" is refuted by inventing one, and
 * the forgery game is unwinnable while the claim has that shape. So this one is about
 * DIRECTION rather than reach, and it is what the code now implements:
 *
 *   ON ANY LINE WHERE A SUITE-OPENER TOKEN APPEARS — `describe` or `suite`, with or
 *   without an `x`/`f` prefix, however it is punctuated afterwards — THE FILE IS PARKED
 *   UNLESS THAT LINE RESOLVES, ON ITS OWN LOGICAL LINE AND AT ITS OWN LINE START, TO A
 *   HEAD THIS WALKER POSITIVELY RECOGNISES AS RUNNING. Recognition credits; everything
 *   else parks; there is no third bucket. This file therefore makes NO claim to recognise
 *   every spelling a parked suite can be written in, and inventing a new one CANNOT
 *   falsify it, because an unrecognised spelling is a REFUSAL. What would falsify it is a
 *   suite this walker CREDITS that vitest does not RUN.
 *
 * The positive side is a CLOSED grammar, `RUNNING_SUITE_HEAD`: bare `describe(` / `suite(`,
 * or a chain whose every member is spelled with a tight dot and drawn from
 * `RUNNING_SUITE_MODIFIERS`, at the start of its own logical line. Nothing else has a route
 * to credit. Doors 1 and 2 fail closed the same way and by the same construction — an
 * unrecognised modifier breaks the quote anchor the title read is built on, so
 * `it.skipIf(true)('M', …)` and `xit('M', …)` simply fail to match — and a line-broken TEST
 * head loses its title rather than gaining one.
 *
 * WHERE A CREDITED NON-RUNNING SUITE COULD STILL COME FROM, stated as the falsifier class
 * rather than as a reach boundary, because that is the only thing left that can break the
 * sentence above. It is a suite opened through an IDENTIFIER THAT IS NOT A SUITE WORD — an
 * alias (`const d = describe.skip; d('outer', …)`) or a factory (`describeMatrix(…)`) —
 * because the CALL SITE carries no suite-opener token for any line reader to admit, so the
 * polarity never gets a chance to apply. THE ALIAS HALF IS NOW CLOSED, at the BINDING rather
 * than at the call, since that is where the suite word is still visible
 * (`SUITE_VALUE_BOUND`); and closing it corrected a
 * measurement the previous cut got wrong: it called this residual prevalence-zero, and the
 * estate has ONE — `tests/security/customContentLockOrder.postgres.test.js`, whose single
 * title was CREDITED while its suite is `describe.skip` wherever `ROOT_DATABASE_URL` is
 * unset. That file is the ONE census move this repair makes, 92 parked to 93. THE FACTORY
 * HALF REMAINS OPEN and cannot be closed by a line reader at all: a name bound to a suite
 * word through a helper module, an object property or a function return is invisible to
 * text. NO PREVALENCE FIGURE IS CLAIMED FOR IT, and that refusal is deliberate — its
 * prevalence is exactly what a text scanner cannot measure, which is what makes it the
 * residual rather than a spelling. What IS measured, and is all that honestly can be: no
 * estate file binds a bare suite word to a new name by declaration (zero across the 2,314
 * files), and the one binding that did exist is the modified-value form this repair parks.
 * This is the thing to look for first if the polarity above is ever broken again.
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
 * DOOR 3's ADMISSION TEST — the lines this door judges at all. A suite-opener token at the
 * head of its own line: `describe` or `suite`, with or without an `x`/`f` prefix, and then
 * WHATEVER punctuation follows — a member dot, a computed bracket, the call paren, a
 * comment, or nothing at all because the head runs on to the next line. Admission is not a
 * verdict. Everything admitted here PARKS unless `RUNNING_SUITE_HEAD` below can positively
 * classify it, which is the whole polarity: this regex may be as generous as it likes,
 * because generosity now costs a file marker-carrying rights rather than buying it credit.
 */
const SUITE_TOKEN_LINE = /^\s*(?:x|f)?(?:describe|suite)\s*(?:[.[(/]|$)/;

/**
 * …and the same token standing after a statement terminator, admitted on the PARK side
 * ALONE, because credit is line-start-only. `}); describe.skip(…)` and
 * `if (x) describe.skip(…)` — two of the three shapes the previous cut NAMED as residuals
 * it could not reach — park the file here. Their prevalence is zero across the estate
 * (measured), so this closes a latent route at no cost to any file's reading.
 */
const SUITE_TOKEN_MIDLINE = /[;})]\s*(?:x|f)?(?:describe|suite)\s*(?:[.[(/]|$)/;

/**
 * DOOR 3's ALIAS ARM — a suite word whose MODIFIED value is handed to a name instead of
 * called: `const d = cond ? describe : describe.skip;`. A line reader cannot follow `d` to
 * its use, so the honest verdict for the whole file is refusal.
 *
 * THIS ONE IS NOT LATENT, AND THE PREVIOUS CUT SAID IT WAS. That cut named "a suite opened
 * through ANOTHER IDENTIFIER" as a residual with "zero occurrences across the 2,314 test
 * files". MEASURED HERE AND FALSE: `tests/security/customContentLockOrder.postgres.test.js`
 * spells exactly that on its line 44, and its one title — `two backends resolve the same
 * command id without 40P01` — was CREDITED at the previous commit, while the suite holding
 * it is `describe.skip` on every machine with no `ROOT_DATABASE_URL`. That file is the ONE
 * census move this repair makes, 92 parked to 93, and it is a correction rather than a
 * cost. A BARE value (`RuleTester.describe = describe;`, four estate files) is deliberately
 * NOT caught: it can only ever alias a suite that runs, so parking it would buy nothing.
 */
const SUITE_VALUE_BOUND = /(?:^|[^\w$.'"`])(?:x|f)?(?:describe|suite)(?:\s*\.\s*[A-Za-z$_][\w$]*)+\s*(?:[;,:)\]}]|$)/;

/**
 * …and the two arms above are the only ones in this file that read a line ANYWHERE rather
 * than at its start, so this is what keeps them out of the estate's prose. Every other door
 * is `^\s*`-anchored and a comment could never reach it; these two can, and a header
 * sentence ending `…exercised in the domain suite. This` would otherwise park a file for a
 * full stop. It removes no refusal that existed before it: an anchored door never matched a
 * comment line in the first place.
 */
const COMMENT_LINE = /^\s*(?:\/\/|\/\*|\*)/;

/**
 * DOOR 3's POSITIVE GRAMMAR — the ONLY shape that credits, and it is CLOSED. A bare
 * `describe(` / `suite(`, or a chain whose every member is spelled with a TIGHT dot and
 * drawn from `RUNNING_SUITE_MODIFIERS`, at the start of its own logical line. An `x`/`f`
 * prefix, a computed member, a space-broken member, a comment between members and a
 * conditional modifier are not refused by clauses that enumerate them — the grammar simply
 * CANNOT EXPRESS THEM, so they have nowhere to land but the park side.
 */
const RUNNING_SUITE_HEAD = /^\s*(?:describe|suite)((?:\.[A-Za-z$_][\w$]*)*)\s*\(/;

/**
 * DOOR 3's CLOSED ALLOWLIST — the only suite modifiers read as RUNNING. Each of these runs
 * its block UNCONDITIONALLY. `only` is deliberately absent: it runs its own block by
 * silencing every sibling, so a file that focuses anything is a parked file by another
 * route. `runIf`/`skipIf` are absent because their argument is evaluated at run time and
 * this walker reads text.
 */
const RUNNING_SUITE_MODIFIERS = Object.freeze(['concurrent', 'sequential', 'shuffle', 'each', 'for']);

/**
 * The chain tokens of a head the GRAMMAR has already accepted, split on its dots. The
 * previous cut leaned on this split to refuse computed and space-broken access, reasoning
 * that such an access could never produce a bare identifier; `RUNNING_SUITE_HEAD` now
 * refuses those forms outright by being unable to MATCH them, so on every input this walker
 * can receive, the split only ever sees tight dotted identifiers.
 *
 * WHICH MAKES THE TWO A DEFENCE-IN-DEPTH PAIR OVER ONE JOB, AND THAT IS RECORDED RATHER
 * THAN LEFT TO BE DISCOVERED. Opening either lock alone changes NO verdict — measured:
 * widening the grammar to capture a computed member leaves the split refusing the bracketed
 * token, and teaching the split to unwrap brackets leaves the grammar unable to capture one;
 * both mutants ran 21 passed. Only opening BOTH credits `describe['concurrent'](`, and that
 * joint mutant reds the allowlist arm. So neither is pinned alone below, because neither CAN
 * be; they are pinned as the pair they are.
 */
const chainModifiers = (chain) => chain.replace(/^\./, '').split('.');

/**
 * DOOR 3's OTHER HALF — focus, at suite OR test level. `describe.only` / `it.only` /
 * `fdescribe` / `fit` park every block they do not name, which is a FILE-scope fact
 * exactly as a parked suite is, so it belongs to the same whole-file refusal.
 */
const FOCUSED = /^\s*(?:f(?:describe|it)\s*\(|(?:describe|suite|test|it)\s*[.[][^(\n]*\bonly\b)/;

/**
 * AN UNRESOLVED HEAD — a line that is NOTHING BUT a suite or test head so far: the
 * identifier, whatever members it has reached, and no `(` yet. It is NOT a third verdict
 * bucket; it is the statement that this physical line is not yet a LOGICAL line, so its
 * verdict is owed by the join below rather than by the line itself.
 *
 * UNDER THE POLARITY THIS IS AN ESCAPE HATCH, NOT A DETECTOR, and the direction matters
 * enough to state: deferring is the ONLY way a line carrying a suite-opener token avoids an
 * immediate park, so this pattern wants to be as NARROW as accuracy allows rather than as
 * wide as possible. It exists to stop `describe`<NL>`('outer'` and
 * `describe`<NL>`.concurrent(` — two heads that really do run — from being parked for
 * arriving in pieces. Nothing else needs it.
 *
 * SO THE VERIFIER'S PROPOSED REMEDY IS DELIBERATELY NOT TAKEN, and the reason is executed
 * rather than argued. The bracket family's root cause was that this pattern required its
 * computed members CLOSED (`\[[^\]\n]*\]`) while the opener detector it fed shared the same
 * character class, so `describe[` ending a line was invisible to both. Widening this tail to
 * accept an unterminated member does close that family — inside the OLD architecture. Under
 * the polarity it changes no verdict at all: `describe[` now carries a suite-opener token
 * that the running grammar cannot classify, so it parks at ADMISSION, and a deferral that
 * begins with a bracket can never rejoin into anything `RUNNING_SUITE_HEAD` matches.
 * MEASURED, not reasoned: the widened tail was planted here and the whole battery — all
 * eighteen escapes, the bracket family included — stayed green at 21 passed. A widening that
 * cannot change a verdict is a guard that cannot fire, which is this program's own named
 * hazard class, so the narrow tail stays and the polarity carries the family.
 */
const UNRESOLVED_SUITE_HEAD = /^\s*(?:x|f)?(?:describe|suite|test|it)(?:\s*\.\s*[A-Za-z$_][\w$]*|\s*\[[^\]\n]*\])*\s*\.?\s*$/;

/**
 * DOOR 3's VERDICT FOR ONE LOGICAL LINE — `true` when this line forces the whole file to be
 * refused. THE POLARITY IN CODE, and the order of the clauses is the argument: prose is
 * excluded, the two file-scope facts (focus, an aliased modifier) park outright, an
 * unresolved head defers to its join, a token after a terminator parks because credit is
 * line-start-only, and only then does a line that carries a suite-opener token get its ONE
 * chance to be positively recognised. Fall out of that grammar by any route — an unknown
 * modifier, a computed member, a prefix, a comment, punctuation nobody has thought of yet —
 * and the file parks. A line carrying no suite-opener token at all is not this door's
 * business and returns `false`.
 * @param {string} line @returns {boolean}
 */
function suiteParksTheFile(line) {
  if (COMMENT_LINE.test(line)) return false;
  if (FOCUSED.test(line)) return true;
  if (SUITE_VALUE_BOUND.test(line)) return true;
  if (UNRESOLVED_SUITE_HEAD.test(line)) return false;
  if (SUITE_TOKEN_MIDLINE.test(line)) return true;
  if (!SUITE_TOKEN_LINE.test(line)) return false;
  const m = RUNNING_SUITE_HEAD.exec(line);
  if (!m) return true;              // a suite token this grammar cannot classify — PARK
  if (m[1] === '') return false;    // bare `describe(` / `suite(` — the one zero-modifier form
  return !chainModifiers(m[1]).every((mod) => RUNNING_SUITE_MODIFIERS.includes(mod));
}

/**
 * DOOR 3's FILE VERDICT — every physical line judged on its own, PLUS the continuation-
 * joined form of every line that dangles a head. Surrounding whitespace is dropped as the
 * lines are welded, so `describe`<NL>`  .concurrent(` rejoins as `describe.concurrent(` and
 * is recognised as running instead of parking on a chain token that is nothing but spaces.
 *
 * ADDITIVE IS THE WHOLE SAFETY ARGUMENT. The physical lines are judged exactly as they were
 * before any welding, so the join can only ever ADD refusals: it cannot silently UN-park a
 * file the way a consuming join could, by welding a bare `describe` onto the real
 * `describe.skip(` opener beneath it and dissolving that file's refusal. That is a
 * fail-OPEN the repair itself would have introduced, and it is PINNED below rather than
 * asserted here.
 *
 * BLANK LINES ARE STEPPED OVER RATHER THAN ENDING THE CHASE, and NO line budget bounds it,
 * because both of those are how a bounded chase leaks: `describe`, five blank lines,
 * `.skip(` is one expression to JavaScript, and a limit of four would have handed that
 * spelling straight back the hole this join closes. Nothing here can run away — the head
 * only GROWS on a line that contributes text, and the moment the accumulated text stops
 * being an unresolved head the walk breaks.
 *
 * A HEAD THAT NEVER RESOLVES PARKS, which is the last hole the polarity would otherwise
 * leave: a file ending in `describe[` reaches the end of its lines still unresolved, and a
 * scan that only judged resolved forms would credit it by saying nothing at all.
 * @param {string[]} lines @returns {boolean}
 */
function suitesParkTheFile(lines) {
  for (let i = 0; i < lines.length; i += 1) {
    if (suiteParksTheFile(lines[i])) return true;
    // No COMMENT_LINE clause here, deliberately: `UNRESOLVED_SUITE_HEAD` and `COMMENT_LINE`
    // are both anchored at `^\s*` and demand disjoint next characters, so a comment line can
    // never dangle a head. A clause guarding against it could not fire, and a guard that
    // cannot fire is this program's own named hazard class.
    if (!UNRESOLVED_SUITE_HEAD.test(lines[i])) continue;
    let head = lines[i].trim();
    let resolved = false;
    for (let j = i + 1; j < lines.length; j += 1) {
      const next = lines[j].trim();
      if (next === '') continue;
      head = `${head}${next}`;
      if (UNRESOLVED_SUITE_HEAD.test(head)) continue;
      resolved = true;
      if (suiteParksTheFile(head)) return true;
      break;
    }
    if (!resolved && SUITE_TOKEN_LINE.test(lines[i])) return true;
  }
  return false;
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
  // Door 3 judges the physical lines AND their continuation-joined forms. Doors 1 and 2
  // read the physical lines alone: a line-broken TEST head simply loses its title, which
  // is the fail-closed direction and is pinned as such below.
  if (suitesParkTheFile(lines)) return [];
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

  test('DOOR 3 REFUSES THE EIGHTEEN ESCAPE SPELLINGS — three cuts of forgeries', () => {
    // THE REPAIRED DEFECT, IN THREE ROUNDS, and the battery is kept whole rather than
    // rewritten each time so that no earlier round can silently reopen. Every spelling
    // below was CREDITED by the walker at the commit that preceded its round.
    //
    // ROUND ONE (four): door 3 refused a file only where ONE line matched both a
    // `describe(` opener AND a literal dotted `.skip`/`.todo`/`.failing`.
    // ROUND TWO (five): the allowlist was right but read PHYSICAL lines, so the same
    // spellings walked back in with a newline inside them.
    // ROUND THREE (nine): the dangling-head join closed round two, but its head detector
    // and the opener detector shared the character class `[^\]\n]` — a bracket that spans
    // a physical line matched NEITHER — so an unterminated computed member walked through
    // both. This round is the reason the fail-closed claim is now a POLARITY: the hole was
    // not a spelling anyone forgot, it was the same blindness in the detector and in the
    // repair meant to compensate for it.
    //
    // GROUND TRUTH, EXECUTED for round three at the previous commit in a git-archive tree —
    // the NINE below plus the comment-interrupted tenth pinned in the polarity arm, ten
    // plants in all, each read through the walker's own code and each then run:
    //   • ALL TEN read `SATISFIED / satisfiable true / missing []` at that commit.
    //   • NINE OF THE TEN ARE LIVE FORGERIES — vitest reported `Tests 1 skipped (1)` with
    //     the pin body a deliberate `expect(1).toBe(2)`, and for the bracketed `only`,
    //     `Test Files 1 passed (1) | Tests 1 passed | 1 skipped (2)` (the focused sibling
    //     ran, the marker's own suite did not).
    //   • EIGHT OF THE TEN ARE ESLINT-CLEAN, exit 0 measured per file; only the two that
    //     break the line BEFORE the bracket opens trip `no-unexpected-multiline`. So for
    //     eight of them no other gate in this repository would have caught anything.
    // The bracketed `xdescribe` is the one non-forgery and is pinned as defence in depth,
    // exactly as bare `xdescribe` is: vitest neither exports nor globals it, so that file
    // dies loudly (`Test Files 1 failed (1) | Tests no tests`) instead of quietly crediting.
    const body = `\n  it('${PROBE} — a pin that never runs', () => { expect(1).toBe(2); });\n});\n`;
    const escapes = {
      // ── ROUND ONE: one line, an unrecognised modifier ───────────────────────────
      'describe.skipIf(true)': `describe.skipIf(true)('parked by skipIf', () => {${body}`,
      "describe['skip']": `describe['skip']('parked by computed member', () => {${body}`,
      'describe . skip (spaced)': `describe . skip ('parked by spaced member', () => {${body}`,
      xdescribe: `xdescribe('parked by the x prefix', () => {${body}`,
      // ── ROUND TWO: the SAME vocabulary, broken across PHYSICAL LINES ────────────
      // The split-then-scan hole. All five read SATISFIED at that commit, and THREE OF THE
      // FIVE — the `.skip`, the trailing-dot and the `.only` — are also ESLINT-CLEAN
      // (exit 0, measured); only the `(true)` and `['skip']` continuations trip
      // `no-unexpected-multiline`. Closed by rejoining a dangling head, not by widening a
      // regex: the detector was generous enough about whitespace, it simply never saw the
      // one whitespace character it was split on.
      'describe / newline / .skip(': `describe\n  .skip('parked across a line', () => {${body}`,
      'describe. / newline / skip(': `describe.\n  skip('parked across a line', () => {${body}`,
      'describe.skipIf / newline / (true)(': `describe.skipIf\n  (true)('parked across a line', () => {${body}`,
      "describe / newline / ['skip'](": `describe\n  ['skip']('parked across a line', () => {${body}`,
      'describe / newline / .only(': `describe\n  .only('focused across a line', () => {});\ndescribe('outer', () => {${body}`,
      // ── ROUND THREE: A COMPUTED MEMBER BROKEN ACROSS PHYSICAL LINES ─────────────
      // The bracket family. The first four walk the bracket down the file one piece at a
      // time; the next two put the break INSIDE the member; the last three prove the route
      // defeats the other doors too — an allowlisted modifier ahead of it, the `x` prefix,
      // the `suite` word, and FOCUSED.
      "describe / newline / [ / newline / 'skip' / newline / ](": `describe\n[\n'skip'\n]('bracket walked down', () => {${body}`,
      "describe / newline / ['skip' / newline / ](": `describe\n['skip'\n]('bracket walked down', () => {${body}`,
      "describe[ / newline / 'skip'](": `describe[\n'skip']('the attester spelling', () => {${body}`,
      'describe.concurrent[ / newline / \'skip\'](': `describe.concurrent[\n'skip']('allowlisted, then a bracket', () => {${body}`,
      'describe[ / newline / templated member](': `describe[\n\`skip\`]('a templated member', () => {${body}`,
      "describe['sk' + / newline / 'ip'](": `describe['sk' +\n'ip']('a concatenated member', () => {${body}`,
      "xdescribe[ / newline / 'each'](": `xdescribe[\n'each']('the x prefix plus a bracket', () => {${body}`,
      "suite[ / newline / 'skip'](": `suite[\n'skip']('the suite word', () => {${body}`,
      "describe[ / newline / 'only'](": `describe[\n'only']('focused elsewhere', () => {\n  it('a sibling that really runs', () => {});\n});\ndescribe('outer', () => {${body}`,
    };
    expect(Object.keys(escapes), 'an escape spelling was dropped from the arm').toHaveLength(18);
    for (const [spelling, src] of Object.entries(escapes)) {
      expect(carries(src), `${spelling} was credited — door 3 fails OPEN for it`).toBe(false);
      // …and each really is a forgery rather than a source that says nothing: the refused
      // read swallows it whole, so the two reads genuinely disagree on every one.
      expect(mentionedIn(src, PROBE), `${spelling} never carried the marker at all`).toBe(true);
    }
    // The conditional's other polarity is refused too — this walker reads TEXT, so it can
    // no more prove `runIf(true)` runs than it can prove `runIf(distExists)` does.
    expect(carries(`describe.runIf(true)('parked by runIf', () => {${body}`)).toBe(false);
    // TEST-LEVEL focus is line-broken exactly as easily, and `FOCUSED` owns `test`/`it`
    // as well as the suite words — so the rejoin carries the same vocabulary it does.
    // Without `test|it` in the dangling head this line credits a pin vitest never runs.
    expect(carries(`it\n  .only('focused elsewhere', () => {});\ndescribe('outer', () => {${body}`),
      'a line-broken it.only focused the file and the marker was still credited').toBe(false);
    // …and BLANK LINES DO NOT END THE CHASE. This arm is here because the first draft of
    // the rejoin carried a four-line budget, and this exact source — one expression to
    // JavaScript, and skipped by vitest — walked through it. A line budget is how a
    // rejoin hands the hole back.
    expect(carries(`describe\n\n\n\n\n  .skip('parked far below', () => {${body}`),
      'a head separated from its modifier by blank lines escaped the rejoin').toBe(false);
    // A TAGGED-TEMPLATE continuation reaches no `(` at all, so the ONLY thing that refuses
    // it is the polarity — an admitted token that the running grammar cannot classify.
    expect(carries(`describe.skipIf\n\`t\`('tagged across a line', () => {${body}`),
      'a tagged-template continuation escaped the polarity').toBe(false);
    // A HEAD THAT NEVER RESOLVES, which is the ONE arm the EOF clause owns. `describe` on a
    // line of its own is legal JavaScript and a legal deferral, so it escapes the immediate
    // park — and if the file then ends, no joined form is ever classified. A scan that
    // judged only RESOLVED forms would credit this file by saying nothing at all. Delete
    // `if (!resolved …)` and this line reds while every other arm stays green, MEASURED.
    expect(carries(`  it('${PROBE} — the pin above a head that never closes', () => {});\ndescribe\n`),
      'a suite head that never closes was credited by silence').toBe(false);
    // …and the bracketed shape of the same thing, which parks one door earlier — at
    // ADMISSION, since `describe[` is a token the running grammar cannot classify.
    expect(carries(`describe[\n  it('${PROBE} — the pin below an unclosed head', () => {});\n`),
      'an unterminated computed member was credited').toBe(false);
  });

  test('DOOR 3 POLARITY: the routes that are not spellings at all', () => {
    // THE ARMS THE POLARITY BUYS OVER AND ABOVE THE BATTERY. Each of these was named as an
    // unreachable RESIDUAL by the previous cut and each is now a refusal, because a
    // suite-opener token that cannot be positively classified parks rather than escaping.
    const body = `\n  it('${PROBE} — a pin that never runs', () => { expect(1).toBe(2); });\n});\n`;
    // A MODIFIER INTERRUPTED BY A COMMENT. Executed at the previous commit: CREDITED by the
    // instrument, `Tests 1 skipped (1)` under vitest, eslint exit 0 — a live, clean forgery.
    expect(carries(`describe/* c */.skip('comment-interrupted', () => {${body}`),
      'a comment between describe and its modifier escaped the polarity').toBe(false);
    // AN OPENER SHARING ITS LINE WITH OTHER CODE, both shapes the previous cut named. The
    // `^\s*` anchor does not reach them, so they are admitted on the PARK side alone —
    // credit stays line-start-only, which is why this cannot become a new credit route.
    expect(carries(`describe('live', () => {});\n}); describe.skip('parked mid-line', () => {${body}`),
      'a reopened parked suite after }); escaped the polarity').toBe(false);
    expect(carries(`if (x) describe.skip('parked mid-line', () => {${body}`),
      'a parked suite introduced by if (x) escaped the polarity').toBe(false);
    // A SUITE WORD ALIASED AT ITS BINDING. This is the residual the previous cut called
    // prevalence-zero and the estate has ONE of; it is closed where the VALUE is taken,
    // since the call site carries no suite word for any line reader to see.
    expect(carries(`const d = COND ? describe : describe.skip;\nd('outer', () => {${body}`),
      'a ternary-aliased describe.skip escaped the polarity').toBe(false);
    expect(carries(`const d = describe.skip;\nd('outer', () => {${body}`),
      'a plainly-aliased describe.skip escaped the polarity').toBe(false);
    // …and every one of them really carried the marker, so none of these is a source that
    // proves nothing.
    for (const src of [`describe/* c */.skip('x', () => {${body}`,
      `if (x) describe.skip('x', () => {${body}`,
      `const d = describe.skip;\nd('x', () => {${body}`]) {
      expect(mentionedIn(src, PROBE)).toBe(true);
    }
  });

  test('DOOR 3 POLARITY: the benign shapes it must NOT park', () => {
    // THE ACCURACY HALF OF THE TWO NON-ANCHORED ARMS, and the reason `COMMENT_LINE` exists.
    // `SUITE_VALUE_BOUND` and `SUITE_TOKEN_MIDLINE` are the only doors in this file that
    // read a line anywhere rather than at its start, so they are the only ones prose can
    // reach — and this estate writes essays in its headers. Without these three arms the
    // alias closure would quietly park a large slice of the tree and the census would be
    // the only thing that noticed.
    const inner = `\n  it('${PROBE} — a real body', () => {});\n});\n`;
    // A header sentence that happens to end a clause with the word `suite`.
    expect(carries(` * exercised in the domain suite. This\ndescribe('outer', () => {${inner}`),
      'a prose full stop after the word suite parked a live file').toBe(true);
    // A MULTI-LINE vitest import, whose continuation line is nothing but `describe,`.
    expect(carries(`import {\n  describe,\n  expect,\n  it,\n} from 'vitest';\ndescribe('outer', () => {${inner}`),
      'a multi-line vitest import parked a live file').toBe(true);
    // The BARE-value binding the estate really uses — four files wire eslint's RuleTester
    // this way. A bare value can only ever alias a suite that RUNS, so parking it would buy
    // nothing and cost four files their marker rights.
    expect(carries(`RuleTester.describe = describe;\nRuleTester.it = it;\ndescribe('outer', () => {${inner}`),
      'the RuleTester binding parked a live file').toBe(true);
  });

  test('DOOR 3 REJOIN: a head broken across lines is still read for what it IS', () => {
    // THE ACCURACY HALF, without which the rejoin could be parking every line-broken
    // suite in the estate and every arm above would still be green. A `describe` whose
    // opening paren or whose unconditional modifier merely sits on the next line RUNS,
    // and vitest agrees — both of these were executed and reported `Tests 1 passed (1)`.
    const inner = `\n  it('${PROBE} — a real body', () => {});\n});\n`;
    expect(carries(`describe\n  ('outer', () => {${inner}`),
      'a bare describe with its paren on the next line was parked, but it runs').toBe(true);
    expect(carries(`describe\n  .concurrent('outer', () => {${inner}`),
      'a line-broken describe.concurrent was parked, but it runs').toBe(true);
    // The join is ADDITIVE — the physical lines are still scanned — so a file that was
    // already parked on a physical line stays parked no matter what follows it.
    expect(carries(`describe.skip('outer', () => {${inner}`)).toBe(false);
    // …and ADDITIVE is load-bearing rather than a word in a comment. Here the rejoin
    // welds a bare `describe` onto the real opener beneath it and produces
    // `describedescribe.skip(`, which matches NOTHING; the refusal survives only because
    // the physical line is still in the scan. Substitute the joined forms for the lines
    // they came from — the natural way to write this repair — and this file's refusal
    // dissolves. `describe` on its own line is a complete statement, so the source below
    // is exactly as legal as the forgeries above it.
    expect(carries(`describe\ndescribe.skip('outer', () => {${inner}`),
      'a rejoin that CONSUMED its lines let a real parked opener out of the scan')
      .toBe(false);
    // DOORS 1 AND 2 KEEP THEIR PHYSICAL-LINE ANCHORS, and that is the fail-closed
    // direction: a line-broken TEST head loses its title rather than gaining one. This
    // understates evidence (the pin below really runs) and is pinned so the day someone
    // rejoins door 1's input as well, they meet a decision rather than a surprise.
    expect(carries(`it\n  ('${PROBE} — a real pin, line-broken', () => {});\n`)).toBe(false);
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
    // THE ALLOWLIST'S REACH, PINNED ON BEHAVIOUR RATHER THAN ON THE SHAPE OF ITS MEMBERS.
    // The previous cut pinned that every member is a bare identifier, reasoning that a
    // computed or space-broken access therefore could not produce one and so would park.
    // True, but it pinned a CONSTANT where the question is about a VERDICT — so this loop
    // drives the real read instead: the same modifier, credited tightly dotted and refused
    // in the two access forms the previous cuts leaked.
    // TWO LOCKS HOLD THESE, AND THE ARM IS HONEST ABOUT PINNING THEM AS A PAIR. The grammar
    // cannot capture a bracket or a space, and `chainModifiers` would not recognise the
    // token if it did. Opening either alone changes nothing — both single mutants ran 21
    // passed, MEASURED — so no assertion here can be attributed to one lock. Opening BOTH
    // (a grammar that captures `['concurrent']` plus a split that unwraps it) reds this arm,
    // and that joint mutant is what makes the pair load-bearing rather than decorative.
    for (const mod of RUNNING_SUITE_MODIFIERS) {
      expect(carries(`describe.${mod}('outer', () => {${inner}`),
        `describe.${mod} is on the allowlist but was parked`).toBe(true);
      expect(carries(`describe['${mod}']('outer', () => {${inner}`),
        `a COMPUTED describe['${mod}'] was credited — the grammar admits brackets`).toBe(false);
      expect(carries(`describe . ${mod} ('outer', () => {${inner}`),
        `a SPACE-BROKEN describe . ${mod} was credited — the grammar admits spaces`).toBe(false);
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
    // The estate's own dominant conditional spelling parks 93 of 2,314 files under this
    // repair (92 before it, plus the one alias file the polarity now reaches), and the one
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
