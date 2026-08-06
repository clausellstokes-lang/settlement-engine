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
 * ── THE ADDRESS RULE ───────────────────────────────────────────────────────────
 * The first cut of this file measured a TEST_MARKER row with `src.includes(marker)` over
 * every test file. That read is VACUOUS IN THE ONLY DIRECTION THAT MATTERS, and it was
 * proven so by execution: a one-line file whose entire content was the bare comment
 * `// ES-4-DISTANT-SOURCE-EVIDENCE` flipped the ES-4 row to present and the whole
 * condition to `SATISFIED / satisfiable true / missing []`. An instrument whose green
 * condition can be forged by a comment is a worse artifact than the phantom row it
 * replaced, because the phantom was at least visibly absent.
 *
 * SO A MARKER IS EVIDENCE ONLY WHERE IT STANDS IN THE TITLE OF A TEST THAT WILL ACTUALLY
 * RUN. FOUR DOORS, each pinned individually below because a second door silently covering
 * a deleted first is this program's most-repeated verification failure:
 *   1. TITLE POSITION — the marker must sit in the first argument of an `it`/`test` (or
 *      `describe`/`suite`) call, and that argument must be a static string. A comment, a
 *      string constant and an `expect(...)` argument are all refused.
 *   2. THE TEST MUST RUN, AND MUST BE STATICALLY REGISTERED — only the closed running TEST
 *      grammar keeps its title, only through a word this file has not seen BOUND, and only
 *      where the call stands as a direct statement of the module body or of a credited
 *      suite's block. A test in a helper, a loop, a conditional or a callback registers
 *      nothing that a syntax tree can prove, so it keeps nothing.
 *   3. THE SUITE MUST RUN — a file is refused WHOLE unless every suite it opens is one
 *      this walker can PROVE runs, through a word it has not seen bound, at a position it
 *      can prove is reached.
 *   4. SELF-EXCLUSION — this walker never vouches for itself (it names every marker by
 *      import).
 *
 * ── DOOR 3, FIFTH STATEMENT: CLASSIFICATION IS BY PARSE ────────────────────────
 * Four cuts of door 3 were REGEX classifiers over TEXT, and all four were falsified the
 * same way. Cut one read one line and one literal `.skip`. Cut two added a closed
 * allowlist but read PHYSICAL lines, so the same spellings walked back in with a newline
 * inside them. Cut three welded a dangling head, but its head detector and its opener
 * detector shared a character class, so `describe[` ending a line was invisible to both.
 * Cut four stated a POLARITY instead of a reach — and was falsified on its own stated
 * falsifier by NINE executed credited-non-running suites in three classes: a leading
 * block comment on the opener line, a computed or destructured alias binding, and any
 * line prefix outside the three-character class the mid-line arm enumerated. The root
 * cause was structural and not three misses: admission was `^\s*`-anchored and narrow
 * while the DEFAULT was credit, which is the opposite polarity from the one the header
 * claimed.
 *
 * THE FIFTH CUT STOPS READING TEXT. Every test file is PARSED with `espree` — eslint's
 * own parser, which this repository already declares as a direct dependency and already
 * uses for three other AST walkers — and every verdict is taken from the syntax tree:
 *
 *   • A SUITE is any CallExpression whose callee chain ROOTS in a suite word. Dotted,
 *     computed, comment-interrupted, line-broken, parenthesised, prefixed by `void` or
 *     `await` or `&&` — the parser makes all of these ONE shape, so there is no spelling
 *     left to enumerate and none left to miss. Comments and line breaks cease to exist.
 *   • CREDIT is a CLOSED GRAMMAR of AST shapes (`RUNNING_SUITE_MODIFIERS`), stated below
 *     and MEASURED against vitest 4.1.8 rather than assumed.
 *   • PARK is the DEFAULT. Any other suite-rooted callee shape, and any Identifier
 *     reference to a suite word outside a credited call and off the two-entry credit-back
 *     list, park the file whole. A BINDING IS NOT ITSELF A PARK — see the sixth statement
 *     below, which is where the fifth cut's stated polarity was WRONG and said so in two
 *     places at once.
 *   • A FILE THAT FAILS TO PARSE PARKS WHOLE. Fail-closed at the parser door.
 *   • ENUMERATION SURVIVES ONLY ON THE CREDIT SIDE, which is the side that was always
 *     closed: the running grammars, and an explicit CREDIT-BACK LIST of two benign
 *     reference positions (a `vitest` import specifier; a bare suite value assigned to a
 *     member target, which is how four estate files wire eslint's RuleTester). Each is
 *     pinned individually, and each has an executed mutant below.
 *
 * ── DOOR 3, SIXTH STATEMENT: THE SEMANTIC LAYER ────────────────────────────────
 * THE FIFTH CUT'S LEXICAL LAYER HELD COMPLETELY AND IS UNCHANGED BELOW. The proving lane
 * drove 39 shipped battery entries plus 20 newly invented spellings — unicode-escaped
 * identifiers AND properties, optional chaining computed and dotted, U+2028 inside the
 * chain, two bidi/trojan-source comments (one whose comment reads `.concurrent` while the
 * code says `.skip`), `.bind` re-heads, comma-expression heads, hashbangs, ASI splits,
 * tagged-template heads, class static blocks, `Reflect.apply` re-heads — and every one
 * parked or fail-parse-parked. All 59 are pinned below. Inventing a SPELLING cannot
 * falsify this door, and that half of the fifth cut's claim survived intact.
 *
 * INVENTING A BINDING COULD, and did, in one line. THREE SEMANTIC HOLES WERE EXECUTED
 * against the fifth cut and all three are closed here:
 *
 *   B1 — THE SHADOW-SWALLOW. The suite loop skipped every call whose root word was BOUND
 *     *before* it pushed `SUITE_NOT_RUNNING`, so a bound suite word was not opaque, it was
 *     MUTE: it DELETED the park for every non-running suite opened through it.
 *     `import * as V from 'vitest'; const { describe, it } = V; describe.skip(…)` around
 *     the live marker read SATISFIED / satisfiable true / missing [] off a file vitest
 *     reported as `1 skipped`. The skip is now conditioned on the call being in the RUNNING
 *     grammar, where `SUITE_SHADOW_AMBIGUOUS` already speaks. Cost, MEASURED: one estate
 *     file, tests/edgeFunctions/contracts.test.js, whose `for (const suite of …)` loop
 *     variable is a STRING and whose `suite.replace(…)` is a suite-rooted non-running call.
 *   B2 — TEST-WORD BINDINGS WERE NOT TRACKED AT ALL. `markShadowed` and the non-vitest
 *     import clause both keyed on SUITE_ROOTS, so `function it(name, fn) {}` — a no-op
 *     shadow that registers nothing — kept full title credit beside a real `describe`, and
 *     the file ran green. Both families now shadow (`OPENER_ROOTS`). Cost: 25 estate files.
 *   B3 — REACHABILITY, named nowhere before. A real vitest `it`, squarely inside the
 *     running grammar, that is never invoked: `function never() { it(…) }`,
 *     `cases.forEach((c) => it(…))`, `if (false) { it(…) }`, `for (…) { it(…) }`. All were
 *     credited; vitest registered none. Registration is now STATIC — a direct statement of
 *     the module body, or of the block a credited suite opens, recursively. Dynamic
 *     registration is statically undecidable, so it parks: the cost of parking is a
 *     reformat to `it.each`, which IS in the running grammar, and the cost of crediting is
 *     a lie. Cost: 121 estate files, ENUMERATED in the landing commit as reformat debt.
 *
 * WHAT WOULD FALSIFY THIS, stated as narrowly as it has been executed: a suite or test this
 * walker CREDITS that vitest does not RUN. Inventing a spelling cannot do it, because a
 * spelling is not a thing the parser sees. Inventing a binding cannot do it, because both
 * opener families now shadow and shadowing never deletes a park. Inventing a registration
 * site cannot do it, because credit is granted only at statement positions the parser can
 * reach from the module body.
 *
 * THE RESIDUALS, NAMED AND NOT CLAIMED AWAY.
 * (a) `test.extend({})` — vitest's first-class fixture API, EXECUTED under 4.1.8 and it
 *     RUNS, while this walker parks the whole file on `TEST_UNCLASSIFIED:test.extend`. That
 *     is the correct DIRECTION (a title cost, never a credit) but it is a real cost, and it
 *     is named here rather than left to be discovered by the first fixture-using suite to
 *     lose its titles. Zero estate instances today, measured. `describe.skipIf(false)` and
 *     `it.runIf(true)` are the same shape and the same deliberate refusal.
 * (b) THE FACTORY ROUTE (J-ES-4-F, unchanged). A suite word that reaches its call site
 *     through a value this file cannot follow — a helper module's export, an object
 *     property, a function return — is invisible to a reader that does not EXECUTE the
 *     file. STATED EXACTLY, because the fifth cut's version of this sentence was the second
 *     of its two overstatements: the ALIAS half is closed not by the binding but by the
 *     reference rules AROUND it — an unaccounted Identifier reference to a suite word parks
 *     (`SUITE_REF`), a bound word is OPAQUE so every call through it parks as
 *     `SUITE_SHADOW_AMBIGUOUS` or `SUITE_NOT_RUNNING`, and a call at an unreachable
 *     position parks as `*_UNREGISTERED`. A binding on its own parks nothing, and must not
 *     — one estate file names a loop variable `suite` and opens no suite at all. The
 *     FACTORY half is not closed, and no prevalence figure is claimed for it because
 *     prevalence is exactly what a static reader cannot measure there. Two estate files
 *     spell `RuleTester.itOnly = it.only`, which is that shape at TEST level; it is inert
 *     here because no estate RuleTester case sets `only: true` (measured, zero
 *     occurrences), and it is recorded rather than smoothed.
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
import { parse } from 'espree';
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
 * THE PARSER DOOR. These options are eslint.config.js's base `languageOptions` spelled
 * back: `ecmaVersion: 'latest'`, `sourceType: 'module'`, `ecmaFeatures.jsx`. That parity is
 * the reason espree was chosen over acorn — both are direct dependencies of this
 * repository, but espree IS eslint's parser, so a file the estate's lint gate can read is a
 * file this walker can read, and a file this walker cannot parse could not have passed
 * lint. `range` is on because a title's source offset is what puts the titles of one file
 * into source order.
 */
const PARSE_OPTIONS = Object.freeze({
  ecmaVersion: 'latest',
  sourceType: 'module',
  ecmaFeatures: { jsx: true },
  range: true,
});

/** The two words vitest really exports as suite openers. `suite` is measured, not assumed. */
const SUITE_WORDS = Object.freeze(['describe', 'suite']);
/** The two it exports as test openers. */
const TEST_WORDS = Object.freeze(['it', 'test']);
/**
 * …and the jest-compat prefixes, which vitest neither exports nor globals. They are here
 * so a local shim or a stray global cannot open a suite this walker says nothing about:
 * a call rooted in one of these is outside the running grammar, so it PARKS.
 */
const SUITE_ROOTS = new Set([...SUITE_WORDS, 'xdescribe', 'fdescribe', 'xsuite', 'fsuite']);
const TEST_ROOTS = new Set([...TEST_WORDS, 'xit', 'fit', 'xtest', 'ftest']);
/**
 * BOTH FAMILIES SHADOW. The fifth cut tracked bindings of SUITE words only, and the
 * proving lane executed the hole that left: a locally declared, destructured, aliased or
 * shim-imported `it` kept FULL title credit while registering nothing, so
 * `function it(name, fn) {}` beside a real `describe` forged a title in a file that ran
 * green. A binding is a binding at either level, so the shadow set is keyed on this union.
 */
const OPENER_ROOTS = new Set([...SUITE_ROOTS, ...TEST_ROOTS]);

/**
 * DOOR 3's RUNNING GRAMMAR — the ONLY suite modifiers read as running, MEASURED against
 * vitest 4.1.8 in a git-archive tree rather than taken from documentation. Each of these
 * ran its block unconditionally (`describe.concurrent`, `.sequential`, `.shuffle`,
 * `.each([1])(…)`, `.for([1])(…)` all reported a passing leaf; bare `describe(` and bare
 * `suite(` likewise).
 *
 * `only` is deliberately ABSENT even though its own block runs, and that is a measurement
 * too: in the same archive `describe.only` in one file left its SAME-FILE sibling reported
 * `↓ skipped` while a NEIGHBOURING file ran whole. Focus is therefore a FILE-scope fact,
 * exactly as a parked suite is, so a file that focuses anything is a parked file by another
 * route. `runIf`/`skipIf` are absent because their argument is evaluated at run time —
 * measured both ways, `runIf(true)` ran and `runIf(false)` skipped — and this walker reads
 * a syntax tree, not a run.
 */
const RUNNING_SUITE_MODIFIERS = Object.freeze(['concurrent', 'sequential', 'shuffle', 'each', 'for']);

/**
 * DOOR 2's RUNNING GRAMMAR, the same idea one level in. Measured in the same archive:
 * `it.concurrent`, `it.sequential`, `it.each([1])(…)`, `it.for([1])(…)` all passed.
 */
const RUNNING_TEST_MODIFIERS = Object.freeze(['concurrent', 'sequential', 'each', 'for']);

/**
 * THE KNOWN NON-FOCUSING TEST MODIFIERS — a test that does not run and does not silence
 * its siblings. Its own title is refused (door 2) while the file keeps its other titles,
 * because a skipped test proves nothing about itself and nothing about its neighbours.
 * Measured: `.skip` and `.skipIf(true)` reported `↓ skipped`, `.todo` reported a todo, and
 * `.fails` RAN its body and reported `1 expected fail` — running, but running to prove a
 * throw, so it is refused as evidence rather than credited. `.failing` IS NOT A VITEST
 * MODIFIER AT ALL in 4.1.8 (`TypeError: it.failing is not a function`, executed); it is
 * kept here as defence in depth against a jest-compat shim, and the file it appears in
 * would die loudly rather than forge anything.
 *
 * THIS LIST IS AN ENUMERATION AND IT IS ON THE SAFE SIDE OF THE POLARITY. Anything rooted
 * in a test word and outside BOTH grammars parks the file whole, so a modifier nobody has
 * thought of costs a file its titles rather than buying one credit.
 */
const NON_FOCUSING_TEST_MODIFIERS = Object.freeze(['skip', 'todo', 'failing', 'fails', 'skipIf', 'runIf']);

/**
 * The modifiers that return a FUNCTION rather than opening a block — `describe.each(table)`
 * is not a suite until the returned function is called with a name. A chain that ends on
 * one of these without its call has registered NOTHING, so it can never be credited.
 */
const TABLE_MODIFIERS = new Set(['each', 'for', 'skipIf', 'runIf']);

const RUNNING_SUITE_SET = new Set(RUNNING_SUITE_MODIFIERS);
const RUNNING_TEST_SET = new Set(RUNNING_TEST_MODIFIERS);
const KNOWN_TEST_SET = new Set([...RUNNING_TEST_MODIFIERS, ...NON_FOCUSING_TEST_MODIFIERS]);

/**
 * THE CALLEE CHAIN, FLATTENED. Walks down `.object` / `.callee` / `.tag` to the identifier
 * the chain roots in, recording each link on the way. A computed member is recorded as
 * `computed` WITHOUT reading what is inside it: `describe['sk' + 'ip']` and
 * `describe[someVariable]` are the same shape to this walker, which is the point — the
 * grammar cannot express a computed member at all, so both park.
 * @param {any} node @returns {{root: string|null, rootNode: any, steps: Array<any>}}
 */
function chainOf(node) {
  const steps = [];
  let cur = node;
  for (;;) {
    if (cur.type === 'MemberExpression') {
      steps.unshift(cur.computed ? { kind: 'computed' } : { kind: 'dot', name: cur.property.name });
      cur = cur.object;
    } else if (cur.type === 'CallExpression') { steps.unshift({ kind: 'call' }); cur = cur.callee; }
    else if (cur.type === 'TaggedTemplateExpression') { steps.unshift({ kind: 'call' }); cur = cur.tag; }
    else if (cur.type === 'Identifier') return { root: cur.name, rootNode: cur, steps };
    else return { root: null, rootNode: null, steps };
  }
}

/**
 * THE CLOSED GRAMMAR, AS A PREDICATE OVER CHAIN LINKS. Every link must be a tight dotted
 * member drawn from `allowed`, or a call that immediately follows a table modifier; and
 * every table modifier must be followed by its call. A computed link fails outright, and so
 * does a chain that ends on a table modifier without calling it.
 * @param {Array<any>} steps @param {Set<string>} allowed @returns {boolean}
 */
function grammarAccepts(steps, allowed) {
  for (let i = 0; i < steps.length; i += 1) {
    const step = steps[i];
    if (step.kind === 'dot') {
      if (!allowed.has(step.name)) return false;
      if (TABLE_MODIFIERS.has(step.name) && (!steps[i + 1] || steps[i + 1].kind !== 'call')) return false;
      continue;
    }
    if (step.kind !== 'call') return false;
    const prev = steps[i - 1];
    if (!prev || prev.kind !== 'dot' || !TABLE_MODIFIERS.has(prev.name)) return false;
  }
  return true;
}

/**
 * THE TITLE READ, FROM THE TREE. A title is the FIRST argument of a credited call and it
 * must be STATIC: a string Literal, or the static segments of a template literal. An
 * interpolated segment is not read, so `it(`${x} MARKER`)` credits `MARKER` while a marker
 * split ACROSS an interpolation is credited to neither half — which is the honest read,
 * because such a marker is not in the file.
 * @param {any} node @param {Array<[number, string]>} out
 */
function titleArgs(node, out) {
  const first = node.arguments && node.arguments[0];
  if (!first) return;
  if (first.type === 'Literal' && typeof first.value === 'string') { out.push([first.range[0], first.value]); return; }
  if (first.type !== 'TemplateLiteral') return;
  for (const quasi of first.quasis) if (quasi.value.cooked) out.push([quasi.range[0], quasi.value.cooked]);
}

/** Every identifier a binding pattern introduces — destructuring, defaults and rest included. */
function patternIds(node, out) {
  if (!node || typeof node !== 'object') return;
  if (node.type === 'Identifier') { out.push(node); return; }
  if (node.type === 'ObjectPattern') {
    for (const p of node.properties) patternIds(p.type === 'RestElement' ? p.argument : p.value, out);
    return;
  }
  if (node.type === 'ArrayPattern') { for (const e of node.elements) patternIds(e, out); return; }
  if (node.type === 'AssignmentPattern') { patternIds(node.left, out); return; }
  if (node.type === 'RestElement') patternIds(node.argument, out);
}

/**
 * An inner link of a longer chain — `describe.each([1])` inside `describe.each([1])('n', f)`.
 * Only the OUTERMOST node of a chain is classified; classifying the links as well would park
 * every table-driven suite in the estate for the crime of being written in two calls.
 */
const isChainLink = (parent, key) => !!parent
  && ((parent.type === 'CallExpression' && key === 'callee')
    || (parent.type === 'TaggedTemplateExpression' && key === 'tag')
    || (parent.type === 'MemberExpression' && key === 'object'));

/** A static member/property NAME that happens to spell a suite word — `RuleTester.describe`. */
const isNameNotReference = (parent, key) => !!parent
  && ((parent.type === 'MemberExpression' && key === 'property' && !parent.computed)
    || ((parent.type === 'Property' || parent.type === 'MethodDefinition' || parent.type === 'PropertyDefinition')
      && key === 'key' && !parent.computed));

/**
 * CREDIT-BACK 1 — an import specifier. Both halves of `import { describe } from 'vitest'`
 * are Identifier nodes spelling a suite word, and every test file in the estate has one, so
 * without this clause the polarity would park the whole tree. IT IS PINNED, and its mutant
 * is the chair's own stated verification: delete it and the estate census moves from 93
 * parked files to 2,312 (MEASURED). A specifier whose ImportDeclaration names any source
 * OTHER than 'vitest' is NOT credited back — it is treated as a rebind of the word, and the
 * file parks, because a shim module is exactly the factory route.
 */
const isImportSpecifierId = (parent) => !!parent
  && (parent.type === 'ImportSpecifier' || parent.type === 'ImportDefaultSpecifier'
    || parent.type === 'ImportNamespaceSpecifier' || parent.type === 'ExportSpecifier');

/**
 * CREDIT-BACK 2 — `RuleTester.describe = describe;`, four estate files. A BARE suite value
 * assigned to a member target can only ever alias a suite that RUNS, so parking it would buy
 * nothing and cost four files their marker rights. A MODIFIED value (`RuleTester.d =
 * describe.skip`) is not this shape and is not credited back. Mutant: delete this clause and
 * those four files park (93 → 97, MEASURED).
 */
const isBareSuiteValueOnMemberTarget = (ref) => {
  const p = ref.parent;
  return !!p && p.type === 'AssignmentExpression' && ref.key === 'right'
    && p.left.type === 'MemberExpression' && SUITE_WORDS.includes(ref.node.name);
};

/**
 * DOOR 3'S VERDICT FOR ONE SOURCE, STRUCTURAL. Returns the park reasons (empty when the file
 * keeps its titles) and the titles of the tests that will actually run.
 *
 * THE ORDER OF THE CLAUSES IS THE ARGUMENT, and every one of them defaults to PARK:
 *   • the file must PARSE, or it parks whole with reason `PARSE`;
 *   • an OPENER word — suite or test — BOUND anywhere in the file (a declaration, a
 *     parameter, a destructure, a catch binding, a function name, a non-vitest import) is
 *     either a rebind or a shadow, and a reader without a scope resolver cannot tell which,
 *     so the word is treated as OPAQUE. A BINDING IS NOT ITSELF A PARK — it must not be, or
 *     a loop variable named `suite` would cost a file its titles — but IT NEVER DELETES ONE
 *     EITHER, which is the clause the fifth cut got backwards. Every call through an opaque
 *     word parks: as `*_SHADOW_AMBIGUOUS` when the call would otherwise have been credited,
 *     and by the ordinary rules below when it would not;
 *   • every suite-rooted call that is not in the running grammar parks the file — with no
 *     exception for a bound root, which is precisely what the sixth cut repaired;
 *   • every suite-word reference that is not the root of a credited call and not on the
 *     two-entry credit-back list parks the file;
 *   • every test-rooted call outside BOTH test grammars parks the file, because an
 *     unrecognised test modifier may be `only` and `only` silences its siblings;
 *   • every suite- or test-rooted call that is not STATICALLY REGISTERED parks the file —
 *     one that stands anywhere but as a direct statement of the module body or of a
 *     credited suite's block, because a call in a helper, a loop, a conditional or a
 *     callback may register nothing at all and a syntax tree cannot say which.
 * @param {string} src @returns {{reasons: string[], titles: string[]}}
 */
function classifySource(src) {
  let ast;
  try { ast = parse(src, PARSE_OPTIONS); } catch (err) { return { reasons: [`PARSE:${err.message}`], titles: [] }; }

  const shadowed = new Set();
  const suiteCalls = [];
  const testCalls = [];
  const suiteRefs = [];
  const reasons = [];
  const titles = [];
  const creditedRoots = new Set();

  const stack = [{ node: ast, parent: null, key: null }];
  while (stack.length) {
    const { node, parent, key } = stack.pop();
    if (!node || typeof node !== 'object' || typeof node.type !== 'string') continue;

    if (node.type === 'ImportDeclaration' && node.source.value !== 'vitest') {
      for (const spec of node.specifiers) if (OPENER_ROOTS.has(spec.local.name)) shadowed.add(spec.local.name);
    }
    if (node.type === 'VariableDeclarator') markShadowed(node.id, shadowed);
    if (node.type === 'FunctionDeclaration' || node.type === 'FunctionExpression'
      || node.type === 'ArrowFunctionExpression' || node.type === 'ClassDeclaration'
      || node.type === 'ClassExpression') {
      if (node.id) markShadowed(node.id, shadowed);
      for (const param of (node.params || [])) markShadowed(param, shadowed);
    }
    if (node.type === 'CatchClause' && node.param) markShadowed(node.param, shadowed);

    if ((node.type === 'CallExpression' || node.type === 'TaggedTemplateExpression') && !isChainLink(parent, key)) {
      const head = node.type === 'CallExpression' ? node.callee : node.tag;
      const { root, rootNode, steps } = chainOf(head);
      if (root && SUITE_ROOTS.has(root)) {
        const running = node.type === 'CallExpression' && SUITE_WORDS.includes(root)
          && grammarAccepts(steps, RUNNING_SUITE_SET);
        suiteCalls.push({ word: root, running, rootNode, node, shape: `${root}${steps.map(stepText).join('')}` });
      } else if (root && TEST_ROOTS.has(root)) {
        const running = node.type === 'CallExpression' && TEST_WORDS.includes(root)
          && grammarAccepts(steps, RUNNING_TEST_SET);
        const known = TEST_WORDS.includes(root) && grammarAccepts(steps, KNOWN_TEST_SET);
        // THE TEST-SIDE VERDICT IS DEFERRED, exactly as the suite side already deferred it,
        // and that deferral is the whole reason doors 2 and 3 can now be shadow-aware. The
        // fifth cut read the title INLINE here while `shadowed` was still being built, so a
        // patch that consulted `shadowed` at this point was decided by DFS ORDER — measured
        // failing to close the forgery it was written for. Nothing is credited or refused
        // until the tree has been walked whole.
        testCalls.push({ word: root, running, known, node, shape: `${root}${steps.map(stepText).join('')}` });
      }
    }

    if (node.type === 'Identifier' && SUITE_ROOTS.has(node.name)
      && !isNameNotReference(parent, key) && !isImportSpecifierId(parent)) {
      suiteRefs.push({ node, parent, key, word: node.name });
    }

    for (const childKey of Object.keys(node)) {
      if (childKey === 'loc' || childKey === 'range') continue;
      const value = node[childKey];
      if (!value || typeof value !== 'object') continue;
      if (Array.isArray(value)) {
        for (const child of value) if (child && typeof child === 'object') stack.push({ node: child, parent: node, key: childKey });
      } else stack.push({ node: value, parent: node, key: childKey });
    }
  }

  // THE REGISTRATION WALK, top-down from the module body, after `shadowed` is closed.
  const registered = new Set();
  markRegistered(ast.body, registered, shadowed);

  for (const word of shadowed) {
    if (suiteCalls.some((call) => call.word === word && call.running)) reasons.push(`SUITE_SHADOW_AMBIGUOUS:${word}`);
    if (testCalls.some((call) => call.word === word && call.running)) reasons.push(`TEST_SHADOW_AMBIGUOUS:${word}`);
  }
  // SHADOWING NEVER DELETES A PARK — THAT WAS THE SIXTH CUT'S ONE HOLE, AND IT IS THE
  // CLAUSE ORDER THAT FIXES IT. The fifth cut skipped every call whose root was bound
  // BEFORE the `SUITE_NOT_RUNNING` push, so binding a suite word anywhere in a file did not
  // make it opaque — it made it MUTE, deleting the park for every non-running suite opened
  // through it. Two lines put the live marker inside a `describe.skip` and this walker read
  // SATISFIED off a file vitest reported as `1 skipped`. So the skip is now conditioned on
  // the call being in the RUNNING grammar, where a park would have said nothing that
  // `SUITE_SHADOW_AMBIGUOUS` above does not already say. A bound word is OPAQUE, never mute.
  for (const call of suiteCalls) {
    creditedRoots.add(call.rootNode);
    if (call.running && shadowed.has(call.word)) continue;
    if (call.running && registered.has(call.node)) { titleArgs(call.node, titles); continue; }
    reasons.push(call.running ? `SUITE_UNREGISTERED:${call.shape}` : `SUITE_NOT_RUNNING:${call.shape}`);
  }
  // DOOR 2, THE SAME THREE LAWS ONE LEVEL IN: a test opened through a BOUND word parks (the
  // word is not vitest's), a test that is not STATICALLY REGISTERED parks (it may never be
  // invoked at all), and a test outside both grammars parks (it may be `only`). Only a
  // running, unbound, registered call keeps its title.
  for (const call of testCalls) {
    if (call.running && !shadowed.has(call.word) && registered.has(call.node)) {
      titleArgs(call.node, titles);
      continue;
    }
    if (call.running && shadowed.has(call.word)) continue;
    if (call.running) { reasons.push(`TEST_UNREGISTERED:${call.shape}`); continue; }
    if (!call.known) reasons.push(`TEST_UNCLASSIFIED:${call.shape}`);
  }
  for (const ref of suiteRefs) {
    if (shadowed.has(ref.word) || creditedRoots.has(ref.node)) continue;
    if (isBareSuiteValueOnMemberTarget(ref)) continue;
    reasons.push(`SUITE_REF:${ref.parent ? ref.parent.type : 'Program'}.${ref.key}`);
  }

  titles.sort((a, b) => a[0] - b[0]);
  return { reasons, titles: reasons.length > 0 ? [] : titles.map(([, text]) => text) };
}

function markShadowed(pattern, shadowed) {
  const ids = [];
  patternIds(pattern, ids);
  for (const id of ids) if (OPENER_ROOTS.has(id.name)) shadowed.add(id.name);
}

/**
 * DOOR 2's REGISTRATION RULE — the callback body of a suite that is CREDITED. Returns the
 * statement list a credited suite opens, or null for anything else: a non-suite call, a
 * shadowed word, a chain outside the running grammar, or a callback with no block body.
 * @param {any} node @param {Set<string>} shadowed @returns {Array<any>|null}
 */
function creditedSuiteBody(node, shadowed) {
  if (node.type !== 'CallExpression') return null;
  const { root, steps } = chainOf(node.callee);
  if (!root || !SUITE_WORDS.includes(root) || shadowed.has(root)) return null;
  if (!grammarAccepts(steps, RUNNING_SUITE_SET)) return null;
  for (let i = node.arguments.length - 1; i >= 0; i -= 1) {
    const arg = node.arguments[i];
    if ((arg.type === 'FunctionExpression' || arg.type === 'ArrowFunctionExpression')
      && arg.body.type === 'BlockStatement') return arg.body.body;
  }
  return null;
}

/**
 * THE STATIC REGISTRATION WALK — door 2's reachability half, and the ONLY top-down pass in
 * this file. A call is REGISTERED when it stands as a direct statement of the module body,
 * or as a direct statement of the block a credited suite opens, recursively. Nothing else
 * is: not a call in a helper function, not one in a loop or a conditional, not one in a
 * `forEach` callback, not one under a suite this walker did not credit. Descent is the
 * argument — an unregistered suite opens no registered scope, so a whole subtree of tests
 * under a never-invoked `describe` is unregistered too.
 * @param {Array<any>} statements @param {Set<any>} registered @param {Set<string>} shadowed
 */
function markRegistered(statements, registered, shadowed) {
  for (const stmt of statements) {
    if (!stmt || stmt.type !== 'ExpressionStatement') continue;
    const expr = stmt.expression;
    if (!expr || (expr.type !== 'CallExpression' && expr.type !== 'TaggedTemplateExpression')) continue;
    registered.add(expr);
    const inner = creditedSuiteBody(expr, shadowed);
    if (inner) markRegistered(inner, registered, shadowed);
  }
}

const stepText = (step) => (step.kind === 'dot' ? `.${step.name}` : (step.kind === 'call' ? '()' : '[]'));

/**
 * One parse per distinct source, held for the run. Without it the estate is re-parsed once
 * per census and the walker's wall time multiplies by the number of arms.
 */
const CLASSIFIED = new Map();
function classify(src) {
  let hit = CLASSIFIED.get(src);
  if (!hit) { hit = classifySource(src); CLASSIFIED.set(src, hit); }
  return hit;
}

/** THE ADDRESS READ — the titles of the tests in one source that will actually run. */
const liveTitlesIn = (src) => classify(src).titles;

/** Why one source was refused, so the parser door can be told apart from the grammar. */
const parkReasonsFor = (src) => classify(src).reasons;

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
  /**
   * THE BATTERY LEDGER. Each group asserts its own size against this table and the table's
   * SUM is asserted once, so a group that shrinks reds twice — at the group and at the
   * total. A battery that can quietly shrink is a battery that can quietly reopen, and four
   * cuts of this door were falsified by a spelling somebody had already thought of.
   */
  const BATTERY = Object.freeze({ escapes: 28, provingLane: 11, invented: 18, parserDoor: 2 });
  const carries = (src) => titledIn(src, PROBE);
  /** A source is only a forgery if it is a source at all — every refusal below is asserted
   *  to PARSE, so the parser door can never be the thing doing the work by accident. */
  const parses = (src) => !parkReasonsFor(src).some((reason) => reason.startsWith('PARSE:'));
  const body = `\n  it('${PROBE} — a pin that never runs', () => { expect(1).toBe(2); });\n});\n`;
  const inner = `\n  it('${PROBE} — a real body', () => {});\n});\n`;

  test('DOOR 1 ACCEPTS: the marker in the title of a describe / test / it that runs', () => {
    expect(carries(`  it('${PROBE} — a real pin', () => { expect(1).toBe(1); });\n`)).toBe(true);
    expect(carries(`test('${PROBE} — a real pin', () => {});\n`)).toBe(true);
    expect(carries(`describe('${PROBE} — a real suite', () => {});\n`)).toBe(true);
    // Quote style is not the point, so all three spellings are admitted.
    expect(carries(`  it("${PROBE} — double quoted", () => {});\n`)).toBe(true);
    expect(carries(`  it(\`${PROBE} — templated\`, () => {});\n`)).toBe(true);
    // A modifier that still runs the test keeps the evidence.
    expect(carries(`  it.concurrent('${PROBE} — a real pin', () => {});\n`)).toBe(true);
    // THREE POSITIONS THE FOUR TEXT CUTS ALL LOST, and the AST reads without effort. A
    // table-driven title (the estate spells `it.each`/`test.each` 189 times), a title on a
    // line the reader would have had to rejoin, and a call reopened after another
    // statement — all of these RUN, and all of them are now credited.
    expect(carries(`it.each([1])('${PROBE} — %s', () => {});\n`)).toBe(true);
    expect(carries(`it\n  ('${PROBE} — a real pin, line-broken', () => {});\n`)).toBe(true);
    expect(carries(`describe('a', () => {\n  it('b', () => {});\n}); it('${PROBE} — reopened', () => {});\n`)).toBe(true);
    // …and the static SEGMENTS of an interpolated title are read, so an interpolation in
    // the middle of a title cannot hide the marker standing beside it.
    expect(carries(`it(\`\${prefix} ${PROBE} — interpolated\`, () => {});\n`)).toBe(true);
  });

  test('DOOR 1 REFUSES: a BARE COMMENT no longer flips the condition — the chair control', () => {
    // THE EXECUTED DEFECT THIS INSTRUMENT CLOSES. Under the old `src.includes` read every
    // one of these returned true, and a file containing only the first line read as a
    // landed wave. The paired `mentionedIn` assertion is what makes that a proof rather
    // than a story: the refused read still accepts them, so the two reads really differ.
    const comment = `// ${PROBE}\n`;
    expect(carries(comment)).toBe(false);
    expect(mentionedIn(comment, PROBE)).toBe(true);

    const jsdoc = `/**\n * ${PROBE} — named in a header\n */\n`;
    expect(carries(jsdoc)).toBe(false);
    expect(mentionedIn(jsdoc, PROBE)).toBe(true);

    // A `describe`/`it` spelled inside a comment is still a comment — and under the AST it
    // is not merely unanchored, it does not EXIST.
    const commentedPin = `/**\n * it('${PROBE} — what the pin will say one day')\n */\n`;
    expect(carries(commentedPin)).toBe(false);
    expect(mentionedIn(commentedPin, PROBE)).toBe(true);

    // A string constant is not a title, and neither is another call's argument.
    const constant = `const marker = '${PROBE}';\n`;
    expect(carries(constant)).toBe(false);
    expect(mentionedIn(constant, PROBE)).toBe(true);

    const argument = `    expect(filesTitling('${PROBE}')).toEqual([]);\n`;
    expect(carries(argument)).toBe(false);
    expect(mentionedIn(argument, PROBE)).toBe(true);

    // A NON-STATIC title carries nothing: the marker is not in the file, it is in whatever
    // the expression evaluates to, and this walker does not run the file.
    const computedTitle = `it(marker, () => {});\n`;
    expect(carries(computedTitle)).toBe(false);
  });

  test('DOOR 2 REFUSES: a parked pin proves as little as a comment does', () => {
    for (const modifier of ['skip', 'todo', 'failing', 'fails']) {
      const parked = `  it.${modifier}('${PROBE} — parked', () => {});\n`;
      expect(carries(parked), `it.${modifier} was credited as evidence`).toBe(false);
      expect(mentionedIn(parked, PROBE)).toBe(true);
      expect(parses(parked)).toBe(true);
    }
    // The CONDITIONAL pair, whose argument is evaluated at run time. Measured both ways in
    // a git-archive tree: `runIf(true)` ran and `runIf(false)` skipped, so neither polarity
    // is readable from a syntax tree and both are refused.
    for (const conditional of ['skipIf(true)', 'runIf(true)', 'skipIf(cond)', 'runIf(cond)']) {
      const parked = `  it.${conditional}('${PROBE} — conditional', () => {});\n`;
      expect(carries(parked), `it.${conditional} was credited as evidence`).toBe(false);
    }
    // …and a NON-FOCUSING modifier costs only its OWN title: the file keeps the rest.
    const mixed = `it.skip('${PROBE} — parked', () => {});\nit('${PROBE} — live', () => {});\n`;
    expect(liveTitlesIn(mixed)).toEqual([`${PROBE} — live`]);
  });

  test('DOOR 2 PARKS THE FILE for a test modifier outside BOTH grammars', () => {
    // An unrecognised TEST modifier may be `only`, and `only` silences its siblings — so
    // the fail-closed verdict is the whole file, not just that title. This is the arm that
    // makes the test-side grammar closed rather than a skip-list.
    //
    // `extend({})` IS A NAMED RESIDUAL AND NOT A DEFECT, and it is called out here because
    // the header alone would not be found by whoever trips it. `test.extend({})` is
    // vitest's first-class fixture API, EXECUTED under 4.1.8 and it RUNS — so parking the
    // whole file on it is a TITLE COST, never a credit, which is the safe direction. Zero
    // estate instances today (`grep -rl '\.extend('` over tests/*.test.js|jsx = 0). The day
    // a fixture-using suite lands, this list is where it must be reconciled — by MEASURING
    // the shape under vitest and moving it to a grammar, not by loosening the default.
    for (const shape of ['only', 'onlyIf(true)', 'extend({})', 'invented']) {
      const src = `it.${shape}('elsewhere', () => {});\ndescribe('outer', () => {${inner}`;
      expect(carries(src), `it.${shape} did not park the file`).toBe(false);
      expect(parses(src)).toBe(true);
    }
    // …and the jest-compat prefixes vitest does not export park the same way.
    for (const word of ['xit', 'fit', 'xtest', 'ftest']) {
      expect(carries(`${word}('elsewhere', () => {});\ndescribe('outer', () => {${inner}`),
        `${word} did not park the file`).toBe(false);
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

  test('DOOR 3 REFUSES THE WHOLE ESCAPE BATTERY — four cuts of forgeries, all parseable', () => {
    // THE BATTERY IS KEPT WHOLE rather than rewritten each time a cut lands, so that no
    // earlier round can silently reopen. Every spelling below was CREDITED by the walker at
    // some commit in this file's history, and every one is now a refusal.
    //
    // ROUND ONE (four): door 3 refused a file only where ONE line matched both a
    // `describe(` opener AND a literal dotted `.skip`/`.todo`/`.failing`.
    // ROUND TWO (five): the allowlist was right but read PHYSICAL lines, so the same
    // spellings walked back in with a newline inside them.
    // ROUND THREE (nine): the dangling-head join closed round two, but its head detector
    // and the opener detector shared the character class `[^\]\n]`, so an unterminated
    // computed member walked through both.
    // ROUND FOUR (the polarity's own): the arms that were not spellings at all.
    //
    // UNDER A PARSER NONE OF THESE IS A CATEGORY. They are kept because a battery that
    // shrinks is a battery that can be reopened, and because each one is now ALSO asserted
    // to PARSE — without that, a source refused at the parser door would look exactly like
    // a source refused by the grammar, and this arm would be crediting the wrong door.
    const escapes = {
      'describe.skipIf(true)': `describe.skipIf(true)('parked by skipIf', () => {${body}`,
      "describe['skip']": `describe['skip']('parked by computed member', () => {${body}`,
      'describe . skip (spaced)': `describe . skip ('parked by spaced member', () => {${body}`,
      xdescribe: `xdescribe('parked by the x prefix', () => {${body}`,
      'describe / newline / .skip(': `describe\n  .skip('parked across a line', () => {${body}`,
      'describe. / newline / skip(': `describe.\n  skip('parked across a line', () => {${body}`,
      'describe.skipIf / newline / (true)(': `describe.skipIf\n  (true)('parked across a line', () => {${body}`,
      "describe / newline / ['skip'](": `describe\n  ['skip']('parked across a line', () => {${body}`,
      'describe / newline / .only(': `describe\n  .only('focused across a line', () => {});\ndescribe('outer', () => {${body}`,
      "describe / newline / [ / newline / 'skip' / newline / ](": `describe\n[\n'skip'\n]('bracket walked down', () => {${body}`,
      "describe / newline / ['skip' / newline / ](": `describe\n['skip'\n]('bracket walked down', () => {${body}`,
      "describe[ / newline / 'skip'](": `describe[\n'skip']('the attester spelling', () => {${body}`,
      'describe.concurrent[ / newline / \'skip\'](': `describe.concurrent[\n'skip']('allowlisted, then a bracket', () => {${body}`,
      'describe[ / newline / templated member](': `describe[\n\`skip\`]('a templated member', () => {${body}`,
      "describe['sk' + / newline / 'ip'](": `describe['sk' +\n'ip']('a concatenated member', () => {${body}`,
      "xdescribe[ / newline / 'each'](": `xdescribe[\n'each']('the x prefix plus a bracket', () => {${body}`,
      "suite[ / newline / 'skip'](": `suite[\n'skip']('the suite word', () => {${body}`,
      "describe[ / newline / 'only'](": `describe[\n'only']('focused elsewhere', () => {\n  it('a sibling that really runs', () => {});\n});\ndescribe('outer', () => {${body}`,
      'describe.runIf(true)': `describe.runIf(true)('parked by runIf', () => {${body}`,
      'it / newline / .only(': `it\n  .only('focused elsewhere', () => {});\ndescribe('outer', () => {${body}`,
      'describe / blank lines / .skip(': `describe\n\n\n\n\n  .skip('parked far below', () => {${body}`,
      'describe.skipIf / newline / tagged template': `describe.skipIf\n\`t\`('tagged across a line', () => {${body}`,
      'a suite head that never opens a suite': `  it('${PROBE} — the pin above a bare head', () => {});\ndescribe\n`,
      'the comment-interrupted modifier': `describe/* c */.skip('comment-interrupted', () => {${body}`,
      'a parked suite reopened after });': `describe('live', () => {\n  it('a', () => {});\n});\ndescribe.skip('parked after a close', () => {${body}`,
      'a parked suite introduced by if (x)': `if (x) describe.skip('parked mid-line', () => {${body}`,
      'a ternary-aliased describe.skip': `const d = COND ? describe : describe.skip;\nd('outer', () => {${body}`,
      'a plainly-aliased describe.skip': `const d = describe.skip;\nd('outer', () => {${body}`,
    };
    expect(Object.keys(escapes), 'an escape spelling was dropped from the arm').toHaveLength(BATTERY.escapes);
    for (const [spelling, src] of Object.entries(escapes)) {
      expect(carries(src), `${spelling} was credited — door 3 fails OPEN for it`).toBe(false);
      expect(parses(src), `${spelling} was refused at the PARSER door, not by the grammar`).toBe(true);
      // …and each really is a forgery rather than a source that says nothing: the refused
      // read swallows it whole, so the two reads genuinely disagree on every one.
      expect(mentionedIn(src, PROBE), `${spelling} never carried the marker at all`).toBe(true);
    }
  });

  test('DOOR 3 REFUSES THE PROVING LANE\'S NINE FORGERIES, in the three classes it found', () => {
    // EVERY ONE OF THESE WAS EXECUTED AGAINST THE FOURTH CUT AND CREDITED BY IT: planted as
    // a real .test.js in a git-archive tree, vitest reported `Tests 1 skipped (1)` with the
    // pin body a deliberate `expect(1).toBe(2)`, and eslint exited 0 for seven of the nine.
    // They are the reason this file stopped classifying text. Each is asserted to PARSE, so
    // none of them is refused by the parser door.
    const forgeries = {
      // CLASS 1 — a leading block comment on the opener line. Named nowhere in the fourth
      // cut, which pinned only a comment BETWEEN the members.
      'a leading block comment, then describe.skip': `/* c */ describe.skip('outer', () => {${body}`,
      'a leading block comment, then a focused sibling': `/* c */ describe.only('elsewhere', () => {});\ndescribe('outer', () => {${body}`,
      'a leading block comment, then describe.skipIf': `/* c */ describe.skipIf(true)('outer', () => {${body}`,
      'an indented block comment, then xdescribe': `  /*c*/ xdescribe('outer', () => {${body}`,
      // CLASS 2 — a computed or destructured alias binding, which the fourth cut's header
      // declared CLOSED. Its `SUITE_VALUE_BOUND` required a DOTTED chain, so every
      // non-dotted way of taking the same modified value walked through.
      'a computed alias binding': `const d = describe['skip'];\nd('outer', () => {${body}`,
      'a let alias assigned a computed member': `let d;\nd = describe["skip"];\nd('outer', () => {${body}`,
      'a destructured alias binding': `const { skip: d } = describe;\nd('outer', () => {${body}`,
      // CLASS 3 — any line prefix outside the three-character class `[;})]` the fourth
      // cut's mid-line arm enumerated. An enumeration is exactly what that cut claimed to
      // have abandoned.
      'a logical-and prefix': `true && describe.skip('outer', () => {${body}`,
      'a void prefix': `void describe.skip('outer', () => {${body}`,
      'a comma-operator prefix': `0, describe.skip('outer', () => {${body}`,
      'an await prefix': `await describe.skip('outer', () => {${body}`,
    };
    expect(Object.keys(forgeries), 'a proven forgery was dropped from the arm').toHaveLength(BATTERY.provingLane);
    for (const [spelling, src] of Object.entries(forgeries)) {
      expect(carries(src), `${spelling} was credited — the parse classifier fails OPEN for it`).toBe(false);
      expect(parses(src), `${spelling} was refused at the PARSER door, not by the grammar`).toBe(true);
      expect(mentionedIn(src, PROBE), `${spelling} never carried the marker at all`).toBe(true);
    }
  });

  test('DOOR 3 PARSER DOOR: a file this walker cannot parse parks WHOLE', () => {
    // FAIL-CLOSED AT THE PARSER, and pinned as its own door because it is the one refusal
    // the grammar has no part in. A source that does not parse cannot be classified, and an
    // unclassifiable file is exactly the file whose titles must not be believed.
    const unterminated = `describe[\n  it('${PROBE} — the pin below an unclosed head', () => {});\n`;
    expect(carries(unterminated)).toBe(false);
    expect(parkReasonsFor(unterminated).some((r) => r.startsWith('PARSE:')),
      'an unparseable source was refused for some other reason').toBe(true);

    const truncated = `describe('outer', () => {\n  it('${PROBE} — a pin', () => {});\n`;
    expect(carries(truncated)).toBe(false);
    expect(parkReasonsFor(truncated).some((r) => r.startsWith('PARSE:'))).toBe(true);

    // …and the parser door is not swallowing the estate: every real test file parses.
    const unparseable = TEST_FILES.filter(({ src }) => parkReasonsFor(src).some((r) => r.startsWith('PARSE:')));
    expect(unparseable.map(({ rel }) => rel), 'a real estate test file failed to parse').toEqual([]);
  });

  test('DOOR 3 BINDINGS: a suite word bound to a name is opaque, and an ambiguous file parks', () => {
    // A BINDING IS WHERE THE SUITE WORD IS STILL VISIBLE, and the AST makes every spelling
    // of it one shape: declaration, destructure, parameter, non-vitest import.
    expect(carries(`const describe = shim.skip;\ndescribe('outer', () => {${inner}`),
      'the global suite word was rebound and the file was still credited').toBe(false);
    expect(carries(`import { describe } from './shim.js';\ndescribe('outer', () => {${inner}`),
      'a suite word imported from a shim was credited').toBe(false);
    expect(carries(`function open(describe) {\n  describe('outer', () => {${inner}}\nopen(realDescribe);\n`),
      'a suite word taken as a parameter was credited').toBe(false);
    // …AND THE OTHER POLARITY, which is what stops this from parking the estate: a suite
    // word used as an ORDINARY NAME, with no suite ever opened through it, is opaque rather
    // than fatal. A binding on its own must cost nothing — one estate file names a loop
    // variable `suite` — so this arm is the one that would red if the blanket rule (any
    // binding parks the file) were ever adopted in place of the per-word one.
    expect(carries(`const suite = paths[0];\nit('${PROBE} — beside an ordinary name', () => {});\n`),
      'a local binding that happens to be called `suite` parked a live file').toBe(true);
  });

  test('DOOR 3 B1 — THE SHADOW-SWALLOW: a bound word is OPAQUE, and NEVER MUTE', () => {
    // THE SIXTH CUT'S REPAIR, PINNED ON THE CLAUSE ITSELF. The fifth cut skipped every call
    // whose root was bound BEFORE pushing `SUITE_NOT_RUNNING`, so binding a suite word
    // DELETED the park for every non-running suite opened through it. The proving lane
    // executed it: the spelling below read SATISFIED / satisfiable true / missing [] while
    // vitest 4.1.8 reported `1 skipped`, and eslint exited 0 on it.
    const swallow = `import * as V from 'vitest';\nconst { describe, it } = V;\n\n`
      + `describe.skip('the espionage confirmer lane', () => {\n`
      + `  it('${PROBE} — a distant source is confirmed by a covert asset', () => {});\n});\n`;
    expect(carries(swallow), 'the shadow-swallow still credits a suite vitest skips').toBe(false);
    expect(parses(swallow)).toBe(true);
    expect(mentionedIn(swallow, PROBE)).toBe(true);

    // …AND THE CLAUSE IS PINNED ALONE, not merely through `carries`. B3 also parks that
    // source (the inner `it` is not registered, because a skipped suite opens no credited
    // block), so a `carries` assertion alone would be a guard that cannot fire — this
    // program's own hazard class, reproduced inside the repair for it. The REASON is the
    // discriminator: revert the `&& call.running` and `SUITE_NOT_RUNNING` disappears.
    expect(parkReasonsFor(swallow), 'B1\'s own park vanished — the shadow is mute again')
      .toContain('SUITE_NOT_RUNNING:describe.skip');

    // THE FULL 6 x 3 MATRIX THE PROVING LANE EXECUTED. The shipped pin covered only the
    // bound-word + RUNNING-opener corner (`SUITE_SHADOW_AMBIGUOUS`); its complement — bound
    // word + NON-RUNNING opener — was the leak, in all six binder spellings.
    const binders = {
      'a const declaration': 'const describe = shim.thing;\n',
      'a destructure from a namespace': `import * as V from 'vitest';\nconst { describe } = V;\n`,
      'a non-vitest import specifier': `import { describe } from './shim.js';\n`,
      'a function parameter': 'function open(describe) { return describe; }\n',
      'a catch parameter': 'try { x(); } catch (describe) { void describe; }\n',
      'a function declaration id': 'function describe(n, f) {}\n',
    };
    const openers = ['describe(', 'describe.skip(', 'describe.only('];
    expect(Object.keys(binders)).toHaveLength(6);
    for (const [label, binder] of Object.entries(binders)) {
      for (const opener of openers) {
        const src = `${binder}${opener}'outer', () => {${inner}`;
        expect(carries(src), `${label} + ${opener} was CREDITED — the matrix leaks again`).toBe(false);
        expect(parses(src), `${label} + ${opener} was refused at the PARSER door`).toBe(true);
        expect(mentionedIn(src, PROBE)).toBe(true);
      }
    }
    // …and the two halves park for DIFFERENT stated reasons, which is what makes this a
    // pair of guards rather than one guard counted twice.
    expect(parkReasonsFor(`const describe = shim.thing;\ndescribe('outer', () => {${inner}`))
      .toContain('SUITE_SHADOW_AMBIGUOUS:describe');
    expect(parkReasonsFor(`const describe = shim.thing;\ndescribe.skip('outer', () => {${inner}`))
      .toContain('SUITE_NOT_RUNNING:describe.skip');
  });

  test('DOOR 2 B2 — TEST-WORD BINDINGS: a bound `it`/`test` is opaque exactly as a suite is', () => {
    // THE SECOND SEMANTIC HOLE, EXECUTED AGAINST THE FIFTH CUT. `markShadowed` and the
    // non-vitest import clause both keyed on SUITE_ROOTS, so TEST_ROOTS never entered the
    // shadow set at all and a locally declared, destructured, aliased or shim-imported
    // `it`/`test` kept FULL title credit while registering nothing. The proving lane ran the
    // source below: the walker read the forged title, vitest reported only the real anchor,
    // the file was GREEN and eslint exited 0.
    const noOpShadow = `import { describe, expect, it as vitestIt } from 'vitest';\n`
      + 'function it(name, fn) {}\n'
      + `describe('outer', () => {\n`
      + `  vitestIt('a real anchor so the file is not empty', () => { expect(1).toBe(1); });\n`
      + `  it('${PROBE} — forged', () => { throw new Error('THIS RAN'); });\n});\n`;
    expect(carries(noOpShadow), 'a no-op local `it` still forges a title').toBe(false);
    expect(parses(noOpShadow)).toBe(true);
    expect(mentionedIn(noOpShadow, PROBE)).toBe(true);
    // …and it is B2's OWN clause that does it, alone: the forged call sits at a registered
    // position inside a credited suite, so neither B1 nor B3 is in a position to speak.
    expect(parkReasonsFor(noOpShadow)).toContain('TEST_SHADOW_AMBIGUOUS:it');

    // THE OTHER SPELLINGS THE PROVING LANE MEASURED, each independently credited before.
    const bindings = {
      'a shim import of it': `import { it } from './shim.js';\nit('${PROBE} — forged', () => {});\n`,
      'a destructured it': `const { it } = helpers;\nit('${PROBE} — forged', () => {});\n`,
      'a const-declared test': `const test = shim.t;\ntest('${PROBE} — forged', () => {});\n`,
      'a callback parameter named test': `rows.forEach((test) => test('${PROBE} — forged', () => {}));\n`,
      'a catch parameter named it': `try { x(); } catch (it) { void it; }\nit('${PROBE} — forged', () => {});\n`,
      'a function declaration named test': `function test(n, f) {}\ntest('${PROBE} — forged', () => {});\n`,
    };
    expect(Object.keys(bindings), 'a measured test-word binding was dropped').toHaveLength(6);
    for (const [label, src] of Object.entries(bindings)) {
      expect(carries(src), `${label} was CREDITED — the test door is not shadow-aware`).toBe(false);
      expect(parses(src), `${label} was refused at the PARSER door`).toBe(true);
      expect(mentionedIn(src, PROBE)).toBe(true);
    }
    // …AND THE OTHER POLARITY AGAIN, which is what keeps this from parking the estate on
    // sight: 29 estate files bind a test word today (tests/domain/coalitionTrust.test.js
    // spells `const snap = (it) => ({ settlements: [it] });`), and a binding with NO test
    // opened through that word must stay opaque rather than fatal.
    expect(carries(`const snap = (it) => ({ settlements: [it] });\n`
      + `describe('${PROBE} — a suite title beside a bound test word', () => {});\n`),
      'a helper parameter named `it` parked a file that opens no test through it').toBe(true);
    expect(carries(`const its = rows.map((row) => row.it);\nit('${PROBE} — beside a property read', () => {});\n`),
      'reading a PROPERTY called `it` was treated as a binding').toBe(true);
  });

  test('DOOR 2 B3 — STATIC REGISTRATION: a test that is never invoked is never evidence', () => {
    // THE THIRD SEMANTIC HOLE, NAMED NOWHERE BEFORE. Every source here is a real vitest
    // `it`, squarely inside the running grammar, that vitest REGISTERS NOTHING FOR — the
    // proving lane ran each as a real .test.js and each file was green with the title
    // absent. Door 2's old law was a GRAMMAR claim; reachability is a separate claim and it
    // is now made, conservatively: credit only at statement positions the parser can reach.
    const unreachable = {
      'a never-invoked function declaration': `function never() { it('${PROBE} — forged', () => {}); }\n`,
      'a forEach callback over an array': `const cases = [];\ncases.forEach((c) => it(\`${PROBE} \${c}\`, () => {}));\n`,
      'a for-of loop body': `for (const c of cases) {\n  it(\`${PROBE} \${c}\`, () => {});\n}\n`,
      'an if (false) block': `if (false) { it('${PROBE} — forged', () => {}); }\n`,
      'an if (cond) block that may never run': `if (cond) { it('${PROBE} — forged', () => {}); }\n`,
      'a while loop body': `while (more()) { it('${PROBE} — forged', () => {}); }\n`,
      'a try block': `try { it('${PROBE} — forged', () => {}); } catch (e) { void e; }\n`,
      'a nested arrow that is never called': `const run = () => { it('${PROBE} — forged', () => {}); };\n`,
      'a loop INSIDE a credited suite': `describe('outer', () => {\n  for (const c of cases) {\n`
        + `    it(\`${PROBE} \${c}\`, () => {});\n  }\n});\n`,
      'a helper called from inside a credited suite': `function add() { it('${PROBE} — forged', () => {}); }\n`
        + `describe('outer', () => { add(); });\n`,
      'a suite opened inside a helper': `function mk() { describe('${PROBE} — forged', () => {}); }\n`,
      'a suite opened inside a loop': `for (const c of cases) { describe(\`${PROBE} \${c}\`, () => {}); }\n`,
      'a test under a suite that is itself unregistered': `function mk() {\n  describe('outer', () => {\n`
        + `    it('${PROBE} — forged', () => {});\n  });\n}\n`,
    };
    expect(Object.keys(unreachable), 'an unreachable shape was dropped from the arm').toHaveLength(13);
    for (const [label, src] of Object.entries(unreachable)) {
      expect(carries(src), `${label} was CREDITED but vitest registers nothing for it`).toBe(false);
      expect(parses(src), `${label} was refused at the PARSER door, not by the rule`).toBe(true);
      expect(mentionedIn(src, PROBE)).toBe(true);
    }
    // B3's clause pinned ALONE, on its own reason, in a source no other clause touches: no
    // binding anywhere, a running grammar, a parseable file.
    expect(parkReasonsFor(`function never() { it('${PROBE} — forged', () => {}); }\n`))
      .toEqual(['TEST_UNREGISTERED:it']);
    expect(parkReasonsFor(`function mk() { describe('${PROBE} — forged', () => {}); }\n`))
      .toEqual(['SUITE_UNREGISTERED:describe']);

    // …AND THE ACCURACY HALF, without which this rule would be a way to park the estate.
    // Every registered position vitest really runs is still credited.
    const registered = {
      'a top-level test': `it('${PROBE} — real', () => {});\n`,
      'a test in a credited suite': `describe('outer', () => {\n  it('${PROBE} — real', () => {});\n});\n`,
      'a test in a NESTED credited suite': `describe('a', () => {\n  describe('b', () => {\n`
        + `    it('${PROBE} — real', () => {});\n  });\n});\n`,
      'a function-expression callback': `describe('outer', function () {\n  it('${PROBE} — real', () => {});\n});\n`,
      'a table-driven test': `it.each([1])('${PROBE} — %s', () => {});\n`,
      'a table-driven SUITE': `describe.each([1])('outer %s', () => {\n  it('${PROBE} — real', () => {});\n});\n`,
      'a concurrent suite': `describe.concurrent('outer', () => {\n  it('${PROBE} — real', () => {});\n});\n`,
      'a test beside statements in the same block': `describe('outer', () => {\n  const x = 1;\n`
        + `  beforeEach(() => { void x; });\n  it('${PROBE} — real', () => {});\n});\n`,
    };
    expect(Object.keys(registered), 'a running shape was dropped from the accuracy half').toHaveLength(8);
    for (const [label, src] of Object.entries(registered)) {
      expect(carries(src), `${label} was PARKED but vitest really registers it`).toBe(true);
    }
    // THE REFORMAT THIS RULE COSTS, AND THE ONE IT ACCEPTS, side by side — the loop form
    // parks and its `it.each` rewrite does not, which is the whole remedy for the 121
    // estate files enumerated in the landing commit.
    expect(carries(`describe('outer', () => {\n  for (const c of cases) {\n`
      + `    it(\`${PROBE} \${c}\`, () => {});\n  }\n});\n`)).toBe(false);
    expect(carries(`describe('outer', () => {\n  it.each(cases)(\`${PROBE} %s\`, () => {});\n});\n`)).toBe(true);
  });

  test('DOOR 3 REFUSES TWENTY INVENTED SPELLINGS — the lexical layer, independently probed', () => {
    // THE PROVING LANE'S OWN INVENTIONS, kept as executed controls beside the shipped
    // battery. None of these was ever credited by the fifth cut — they are here because the
    // one claim of that cut which SURVIVED adversarial pressure was the lexical one, and a
    // surviving claim that is not pinned is a claim that can be quietly reopened. Every
    // entry below carries the marker under the refused read and parks under the accepted
    // one, and each is asserted to PARSE so the parser door is not doing the work.
    const LINE_SEPARATOR = String.fromCharCode(0x2028);
    const RLO = String.fromCharCode(0x202e);
    const PDI = String.fromCharCode(0x2069);
    const invented = {
      'a unicode-escaped IDENTIFIER': `d\\u0065scribe.skip('escaped identifier', () => {${body}`,
      'a unicode-escaped PROPERTY': `describe.sk\\u0069p('escaped property', () => {${body}`,
      'an optional-chained modifier': `describe?.skip('optional chain', () => {${body}`,
      'an optional-chained COMPUTED modifier': `describe?.['skip']('optional computed', () => {${body}`,
      'a LINE SEPARATOR inside the chain': `describe${LINE_SEPARATOR}.skip('U+2028 mid-chain', () => {${body}`,
      'a parenthesised head': `(((describe))).skip('parenthesised head', () => {${body}`,
      'a bidi trojan-source comment': `/* ${RLO}piks.${PDI} */ describe.skip('trojan source', () => {${body}`,
      'a comment that READS .concurrent while the code says .skip':
        `describe/* ${RLO}tnerrucnoc.${PDI} */.skip('a lying comment', () => {${body}`,
      'a .bind re-head': `describe.skip.bind(null)('rebound head', () => {${body}`,
      'a comma-expression head, BARE': `(0, describe)('comma head', () => {${body}`,
      'a comma-expression head, MODIFIED': `(0, describe.skip)('comma head modified', () => {${body}`,
      'a hashbang prefix': `#!/usr/bin/env node\ndescribe.skip('below a hashbang', () => {${body}`,
      'an ASI split': `const a = 1\ndescribe.skip('after an ASI split', () => {${body}`,
      'a tagged-template head': `describe.skip\`t\`('tagged head', () => {${body}`,
      'numeric-separator noise': `const n = 1_000_000;\ndescribe.skip('after a separator', () => {${body}`,
      'a class static block': `class C { static { describe.skip('in a static block', () => {${body} } }\n`,
      'an optional chain, computed, across line breaks': `describe\n  ?.\n  ['skip']('walked down', () => {${body}`,
      'a Reflect.apply re-head': `Reflect.apply(describe.skip, null, ['reflected', () => {\n`
        + `  it('${PROBE} — a pin that never runs', () => {});\n}]);\n`,
    };
    expect(Object.keys(invented), 'an invented spelling was dropped from the arm').toHaveLength(BATTERY.invented);
    for (const [spelling, src] of Object.entries(invented)) {
      expect(carries(src), `${spelling} was credited — the lexical layer fails OPEN for it`).toBe(false);
      expect(parses(src), `${spelling} was refused at the PARSER door, not by the grammar`).toBe(true);
      expect(mentionedIn(src, PROBE), `${spelling} never carried the marker at all`).toBe(true);
    }
    // …and the two that die at the PARSER door instead, which is the fail-closed half.
    const parserDoor = {
      'an HTML comment open': `<!-- describe('outer', () => {${body}`,
      'a malformed Reflect.apply': `Reflect.apply(describe.skip, null, ['broken', () => {${body}`,
    };
    expect(Object.keys(parserDoor)).toHaveLength(BATTERY.parserDoor);
    for (const [spelling, src] of Object.entries(parserDoor)) {
      expect(carries(src), `${spelling} was credited`).toBe(false);
      expect(parses(src), `${spelling} parsed — it belongs in the grammar half of this arm`).toBe(false);
    }
    // THE WHOLE BATTERY IS 59 ENTRIES — 28 escapes + 11 proving-lane forgeries + 18 newly
    // invented spellings + 2 that die at the parser door — and the total is asserted here
    // so that dropping a group reds even if its own arm is deleted with it.
    expect(Object.values(BATTERY).reduce((a, b) => a + b, 0),
      'the refusal battery shrank — a closed round has been reopened').toBe(59);
  });

  test('DOOR 3 CREDIT-BACK: the two benign reference positions, and nothing else', () => {
    // THE ACCURACY HALF OF THE POLARITY. Enumeration is safe HERE and fatal on the park
    // side, so the credit-back list is exactly two entries and each is pinned alone.
    // (1) A vitest import specifier. Without it the polarity parks the whole tree — the
    // executed mutant moves the estate census from 93 parked files to 2,312.
    expect(carries(`import {\n  describe,\n  expect,\n  it,\n} from 'vitest';\ndescribe('outer', () => {${inner}`),
      'a multi-line vitest import parked a live file').toBe(true);
    expect(carries(`import { describe, it } from 'vitest';\ndescribe('outer', () => {${inner}`),
      'a single-line vitest import parked a live file').toBe(true);
    // (2) A BARE suite value on a member target — four estate files wire eslint's RuleTester
    // this way. A bare value can only ever alias a suite that RUNS. Mutant: delete the
    // clause and those four files park (93 to 97, measured).
    expect(carries(`RuleTester.describe = describe;\nRuleTester.it = it;\ndescribe('outer', () => {${inner}`),
      'the RuleTester binding parked a live file').toBe(true);
    // …and the MODIFIED form of the same shape is NOT credited back, which is what keeps
    // entry (2) from being a hole the size of the alias class.
    expect(carries(`RuleTester.describe = describe.skip;\ndescribe('outer', () => {${inner}`),
      'a MODIFIED suite value on a member target was credited back').toBe(false);
    // …and prose is not a category at all any more: a header sentence ending in the word
    // `suite`, which the fourth cut needed a whole COMMENT_LINE guard to survive, is simply
    // not in the tree.
    expect(carries(`/**\n * exercised in the domain suite. This\n */\ndescribe('outer', () => {${inner}`),
      'a prose full stop after the word suite parked a live file').toBe(true);
  });

  test('DOOR 3 RUNNING GRAMMAR: only a suite MEASURED to run keeps its titles', () => {
    // The positive half, without which the door could be refusing everything and every arm
    // above would still be green. Every opener here was RUN under vitest 4.1.8 in a
    // git-archive tree and reported a passing leaf.
    for (const opener of ['describe(', 'suite(', 'describe.concurrent(', 'describe.sequential(',
      'describe.shuffle(', 'describe.each([1])(', 'describe.for([1])(']) {
      expect(carries(`${opener}'outer', () => {${inner}`), `${opener} was parked but it runs`)
        .toBe(true);
    }
    // A head broken across lines, or interrupted by a comment, is the SAME head to a parser.
    expect(carries(`describe\n  ('outer', () => {${inner}`)).toBe(true);
    expect(carries(`describe\n  .concurrent('outer', () => {${inner}`)).toBe(true);
    expect(carries(`describe/* c */.concurrent('outer', () => {${inner}`)).toBe(true);
    // …and the grammar is CLOSED, not a substring test: an unknown-but-plausible modifier
    // parks, a computed member parks, and a chain that mixes a running modifier with a
    // conditional one parks.
    expect(carries(`describe.eachly('outer', () => {${inner}`)).toBe(false);
    expect(carries(`describe.concurrent.skipIf(x)('outer', () => {${inner}`)).toBe(false);
    for (const mod of RUNNING_SUITE_MODIFIERS) {
      const opened = TABLE_MODIFIERS.has(mod) ? `describe.${mod}([1])(` : `describe.${mod}(`;
      expect(carries(`${opened}'outer', () => {${inner}`),
        `describe.${mod} is in the running grammar but was parked`).toBe(true);
      expect(carries(`describe['${mod}']('outer', () => {${inner}`),
        `a COMPUTED describe['${mod}'] was credited — the grammar admits brackets`).toBe(false);
    }
    // A TABLE MODIFIER WITHOUT ITS CALL REGISTERS NOTHING, and this is the arm that says so.
    // `describe.each('outer', fn)` returns a function and opens no suite at all; crediting
    // its first argument as a title would be a credited suite that vitest never ran.
    for (const mod of ['each', 'for']) {
      expect(carries(`describe.${mod}('outer', () => {${inner}`),
        `describe.${mod} without its table call was credited, but it opens no suite`).toBe(false);
      expect(carries(`it.${mod}('${PROBE} — never registered', () => {});\n`),
        `it.${mod} without its table call was credited, but it registers no test`).toBe(false);
    }
    // Focus parks the file at BOTH levels — MEASURED: in a git-archive tree a
    // `describe.only` left its SAME-FILE sibling `↓ skipped` while a neighbouring file ran
    // whole, so focus is a file-scope fact exactly as a parked suite is.
    expect(carries(`describe.only('elsewhere', () => {});\ndescribe('outer', () => {${inner}`)).toBe(false);
    expect(carries(`it.only('elsewhere', () => {});\ndescribe('outer', () => {${inner}`)).toBe(false);
    expect(carries(`fdescribe('elsewhere', () => {});\ndescribe('outer', () => {${inner}`)).toBe(false);
    expect(carries(`fit('elsewhere', () => {});\ndescribe('outer', () => {${inner}`)).toBe(false);
    // The estate's own dominant conditional spelling parks 93 of 2,314 files under this
    // rule, and the one file that actually carries a marker is not among them — asserted,
    // not assumed.
    expect(carries(`describe.runIf(distExists)('outer', () => {${inner}`)).toBe(false);
    expect(filesTitling('SP-B2-LEG-SUPPLY-EVIDENCE'))
      .toEqual(['tests/domain/sovereigntyMarketStageWr10w.test.js']);
  });

  test('THE CENSUS FLOOR: admission is not anchored — most of the estate is CREDITED', () => {
    // THE CHAIR'S OWN STATED VERIFICATION, PINNED PERMANENTLY RATHER THAN RUN ONCE. If the
    // credit-back list is deleted, or admission ever becomes narrow again, this collapses:
    // the measured mutant that removes the vitest-import credit-back moves the estate from
    // 93 parked files to 2,312, and this floor reds on the first one of them.
    //
    // THE CEILING IS RE-RECORDED AT THE SIXTH CUT AND THE SHIFT IS STATED RATHER THAN LET
    // TO RIDE. Closing the three semantic holes moves the estate from 93 parked / 27,855
    // titles to 240 parked / 25,376 titles, and every one of the 147 is a file this walker can no
    // longer PROVE runs what it says: +1 for B1 (tests/edgeFunctions/contracts.test.js,
    // whose `suite` loop variable is a string), +25 for B2 (files that bind a test word and
    // open a test through it), +121 for B3 (files that register tests from a loop, a helper
    // or a conditional). The B3 set is enumerated in the landing commit as reformat debt —
    // `it.each` is in the running grammar and buys every one of them back.
    const parked = TEST_FILES.filter(({ src }) => parkReasonsFor(src).length > 0);
    expect(TEST_FILES.length - parked.length,
      'the credited-file count collapsed — admission is anchored again').toBeGreaterThan(2000);
    // …and the park side has not collapsed the other way into crediting everything: the
    // estate really does hold parked files, and they are the conditional-suite, bound-word
    // and dynamically-registered ones.
    expect(parked.length, 'nothing parks any more — the polarity has inverted').toBeGreaterThan(50);
    expect(parked.length, 'the parked set has grown past the measured 240 — a new refusal'
      + ' class has appeared, or a rule widened past what the sixth cut costed')
      .toBeLessThan(300);
    // …and the three refusal classes the sixth cut added are all really present in the
    // estate, so none of B1/B2/B3 is a rule that fires only on synthetic sources.
    const reasonKinds = new Set(parked.flatMap(({ src }) => parkReasonsFor(src).map((r) => r.split(':')[0])));
    for (const kind of ['SUITE_NOT_RUNNING', 'TEST_SHADOW_AMBIGUOUS', 'TEST_UNREGISTERED', 'SUITE_UNREGISTERED']) {
      expect(reasonKinds.has(kind), `${kind} fires on no estate file — the rule is synthetic-only`)
        .toBe(true);
    }
  });

  test('DOOR 4: this walker is excluded, and does not depend on that exclusion', () => {
    const self = TEST_FILES.find(({ rel }) => rel === SELF_REL);
    expect(self, 'the walker no longer finds itself — the exclusion joins on a stale path')
      .toBeDefined();
    // Belt: the exclusion is applied to every census this file performs.
    expect(filesTitling(PROBE)).toEqual([]);
    expect(filesMentioning(PROBE)).toEqual([]);
    // Braces: the exclusion is not what holds the line TODAY. This file never spells a
    // live marker in a title, so door 1 would refuse it even with the exclusion gone.
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
    // …and the walker's own titles are READ rather than lost: under the four text cuts this
    // file parked itself on the escape spellings quoted in its own arms, which meant door 4
    // was being held up by an accident. The parser sees those spellings as STRINGS, so this
    // file is credited like any other and the exclusion is doing the work alone.
    expect(liveTitlesIn(self.src).length, 'the walker reads none of its own titles')
      .toBeGreaterThan(10);
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

      // …and a PARKED-SUITE forgery, which is the shape four cuts of this door leaked.
      const parkedForgery = [{
        rel: 'tests/domain/parkedEvidence.test.js',
        src: `describe.skip('outer', () => {\n  it('${row.marker} — parked', () => {});\n});\n`,
      }];
      expect(measure(row, parkedForgery), `${row.wave}'s evidence can be forged by a parked suite`)
        .toBe(false);

      // …and the THREE SEMANTIC forgeries, driven through the real `measure` rather than
      // asserted through `carries` alone. These are the shapes the sixth cut closed, and
      // this is the arm that says the CONDITION — not merely the classifier — refuses them.
      const semantic = {
        'a shadow-swallowed parked suite': `import * as V from 'vitest';\nconst { describe, it } = V;\n`
          + `describe.skip('outer', () => {\n  it('${row.marker} — forged', () => {});\n});\n`,
        'a no-op local `it`': `import { describe, expect, it as vitestIt } from 'vitest';\n`
          + 'function it(name, fn) {}\n'
          + `describe('outer', () => {\n  vitestIt('anchor', () => { expect(1).toBe(1); });\n`
          + `  it('${row.marker} — forged', () => {});\n});\n`,
        'a test that is never invoked': `function never() { it('${row.marker} — forged', () => {}); }\n`,
      };
      for (const [label, src] of Object.entries(semantic)) {
        expect(measure(row, [{ rel: 'tests/domain/semanticForgery.test.js', src }]),
          `${row.wave}'s evidence can be forged by ${label}`).toBe(false);
        expect(filesMentioning(row.marker, [{ rel: 'tests/domain/semanticForgery.test.js', src }]),
          `${label} never carried ${row.wave}'s marker at all`).toHaveLength(1);
      }

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
