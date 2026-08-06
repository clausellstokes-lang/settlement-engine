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
 *   2. THE TEST MUST RUN — only the closed running TEST grammar keeps its title.
 *   3. THE SUITE MUST RUN — a file is refused WHOLE unless every suite it opens is one
 *      this walker can PROVE runs.
 *   4. SELF-EXCLUSION — this walker never vouches for itself (it names every marker by
 *      import).
 *
 * ── DOOR 3, FIFTH AND FINAL STATEMENT: CLASSIFICATION IS BY PARSE ───────────────
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
 *   • PARK is the DEFAULT. Any other suite-rooted callee shape, any binding of a suite
 *     word, and any Identifier reference to a suite word outside a credited call all park
 *     the file whole.
 *   • A FILE THAT FAILS TO PARSE PARKS WHOLE. Fail-closed at the parser door.
 *   • ENUMERATION SURVIVES ONLY ON THE CREDIT SIDE, which is the side that was always
 *     closed: the running grammars, and an explicit CREDIT-BACK LIST of two benign
 *     reference positions (a `vitest` import specifier; a bare suite value assigned to a
 *     member target, which is how four estate files wire eslint's RuleTester). Each is
 *     pinned individually, and each has an executed mutant below.
 *
 * WHAT WOULD FALSIFY THIS: a suite this walker CREDITS that vitest does not RUN. Inventing
 * a spelling cannot do it, because a spelling is not a thing the parser sees.
 *
 * THE RESIDUAL, NAMED AND NOT CLAIMED AWAY (J-ES-4-F, unchanged). A suite word that
 * reaches its call site through a value this file cannot follow — a helper module's
 * export, an object property, a function return — is invisible to a reader that does not
 * EXECUTE the file. The alias half is closed at the binding (any binding whose init
 * mentions a suite word parks, and so does any unaccounted reference); the FACTORY half is
 * not, and no prevalence figure is claimed for it because prevalence is exactly what a
 * static reader cannot measure there. Two estate files spell `RuleTester.itOnly = it.only`,
 * which is that shape at TEST level; it is inert here because no estate RuleTester case
 * sets `only: true` (measured, zero occurrences), and it is recorded rather than smoothed.
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
 *   • a suite word BOUND anywhere in the file (a declaration, a parameter, a destructure, a
 *     non-vitest import) is either a rebind or a shadow, and a reader without a scope
 *     resolver cannot tell which — so the word is treated as OPAQUE, and if the same word is
 *     also used to open a would-be-credited suite the file parks as AMBIGUOUS;
 *   • every suite-rooted call that is not in the running grammar parks the file;
 *   • every suite-word reference that is not the root of a credited call and not on the
 *     two-entry credit-back list parks the file;
 *   • every test-rooted call outside BOTH test grammars parks the file, because an
 *     unrecognised test modifier may be `only` and `only` silences its siblings.
 * @param {string} src @returns {{reasons: string[], titles: string[]}}
 */
function classifySource(src) {
  let ast;
  try { ast = parse(src, PARSE_OPTIONS); } catch (err) { return { reasons: [`PARSE:${err.message}`], titles: [] }; }

  const shadowed = new Set();
  const suiteCalls = [];
  const suiteRefs = [];
  const reasons = [];
  const titles = [];
  const creditedRoots = new Set();

  const stack = [{ node: ast, parent: null, key: null }];
  while (stack.length) {
    const { node, parent, key } = stack.pop();
    if (!node || typeof node !== 'object' || typeof node.type !== 'string') continue;

    if (node.type === 'ImportDeclaration' && node.source.value !== 'vitest') {
      for (const spec of node.specifiers) if (SUITE_ROOTS.has(spec.local.name)) shadowed.add(spec.local.name);
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
        if (running) titleArgs(node, titles);
        else if (!known) reasons.push(`TEST_UNCLASSIFIED:${root}${steps.map(stepText).join('')}`);
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

  for (const word of shadowed) {
    if (suiteCalls.some((call) => call.word === word && call.running)) reasons.push(`SUITE_SHADOW_AMBIGUOUS:${word}`);
  }
  // THE `call.running` CONDITION ON THE TITLE READ IS A DEFENCE-IN-DEPTH PAIR WITH THE PARK
  // BELOW IT, AND THAT IS RECORDED RATHER THAN LEFT TO BE DISCOVERED. A non-running suite
  // also pushes `SUITE_NOT_RUNNING`, and a file with any reason returns NO titles at all, so
  // reading a parked suite's own title here could not change a verdict — MEASURED: the
  // mutant that reads titles from every suite-rooted call ran 24 passed. It stays because it
  // is the clause that keeps this loop honest if the park is ever loosened, and it is named
  // here because a guard that cannot fire is this program's own hazard class.
  for (const call of suiteCalls) {
    if (shadowed.has(call.word)) continue;
    if (call.running) { creditedRoots.add(call.rootNode); titleArgs(call.node, titles); continue; }
    creditedRoots.add(call.rootNode);
    reasons.push(`SUITE_NOT_RUNNING:${call.shape}`);
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
  for (const id of ids) if (SUITE_ROOTS.has(id.name)) shadowed.add(id.name);
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
    expect(Object.keys(escapes), 'an escape spelling was dropped from the arm').toHaveLength(28);
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
    expect(Object.keys(forgeries), 'a proven forgery was dropped from the arm').toHaveLength(11);
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
    // than fatal. One estate file does exactly this — `for (const suite of MONEY_PATH_DENO_SUITES)`
    // in tests/edgeFunctions/contracts.test.js — and its 225 titles survive.
    expect(carries(`for (const suite of paths) {\n  it(\`${PROBE} \${suite}\`, () => {});\n}\n`),
      'a loop variable that happens to be called `suite` parked a live file').toBe(true);
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
    const parked = TEST_FILES.filter(({ src }) => parkReasonsFor(src).length > 0);
    expect(TEST_FILES.length - parked.length,
      'the credited-file count collapsed — admission is anchored again').toBeGreaterThan(2000);
    // …and the park side has not collapsed the other way into crediting everything: the
    // estate really does hold parked files, and they are the conditional-suite ones.
    expect(parked.length, 'nothing parks any more — the polarity has inverted').toBeGreaterThan(50);
    expect(parked.length, 'the parked set has grown past the conditional-suite family')
      .toBeLessThan(200);
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
