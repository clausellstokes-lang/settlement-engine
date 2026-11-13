/**
 * presumedThings.shared.mjs — THE WORD-TO-THING WALKER's rule book (COHERENCE-PRESUME, the chair's
 * charter `docs/chair/2026-11-11/CHARTERS-COHERENCE-2026-11-11.md` §1; the pool census's "false
 * presumption", `docs/DESIGN_POOL_CENSUS.md`).
 *
 * A line that names a thing presumes the town has it. Each THING below has its words, written once,
 * beside the vocabulary atoms that answer for it (`src/domain/facts/factVocabulary.js ::
 * FACT_DIMENSIONS`), the way `src/domain/foodways.js :: SOURCE_WORDS` gives the food sources theirs.
 *
 *   ARM 1 (source)  every string literal of three words or more under ARM1_ROOTS that uses a REGISTERED
 *                   WORD's words (a thing, and since W2-B-DECLARE item 3 a state, a size or a count:
 *                   `registeredWords.js :: REGISTERED_WORDS`) either DECLARES it (an atom of `atoms`, on its needs or its excludes,
 *                   in a declaration around it that a draw door enforces — `needs`, `excludes`,
 *                   `poolDeclares`, a state variant's `marks`, a tagged table's `tags`; `DECL_PROPS` —
 *                   or an array handed to the same call) or stands in a register under a named reason.
 *   ARM 2 (printed) every sentence of a generated record that uses a thing's words, printed in a town
 *                   where the vocabulary's own readers (`factsOf`) say the thing is ABSENT, is listed;
 *                   a listed line stands in the register under a named reason, or the walker reds.
 * Arm 2 is what finds the lines that code pushes; arm 1 is what finds the lines no corpus reached.
 *
 * WHAT ARM 1 DOES NOT READ (`ARM1_NOT_PRINTED`, COHERENCE-AGREE-4, the chair's ruling of 2026-11-12): arm 2's
 * NOT_PRINTED on the source side, one site, keyed by file + callee + argument position exactly — the `detail`
 * of `generationCoherence.js :: finding(path, detail, evidence)` is the coherence receipt's finding, a check's
 * own diagnostic, never a line about a town. Its pin (the walker's "no reader prints a finding's words")
 * holds that no printing file reads a finding's detail; were one to, the exemption would be false.
 *
 * The register (`tests/lint/presumedThings.register.json`) is SHRINK-ONLY: a row is never added to
 * absorb a new line. A cure removes its row in the same commit.
 *
 * Pure apart from the file reads of arm 1; arm 2 reads the records it is handed.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { createRequire } from 'node:module';

import { timeBandOf } from '../../src/domain/display/heraldCausalGrammar.js';
import {
  REGISTERED_WORDS, THINGS, newWordsNamedIn, sentencesOf, thingsNamedIn, thingsDeniedIn, presentForDenial,
} from '../../src/domain/facts/registeredWords.js';
import { CRISIS_KIND_ALIASES, MARK_DIMENSION_ATOM } from '../../src/domain/facts/factVocabulary.js';

const require = createRequire(import.meta.url);
const ts = require('typescript');

export const REGISTER_REL = 'tests/lint/presumedThings.register.json';

/**
 * THE WIDENED REGISTER (W2-B-DECLARE, 2026-11-12): the habitat a widening of this walker newly sees — a
 * carrier no door enforces (item 1), a new root or a new word (item 3) — banked shrink-only beside the first
 * register, through its door `scripts/presumed-things-door.mjs` (`--shrink`; `--bank <reason> --base <rev>`
 * banks only a literal that already stood at the widening's base, so no new line is ever banked).
 */
export const WIDENED_REGISTER_REL = 'tests/lint/presumedThings.widened.register.json';

/** A strip site's key in the widened register: file and receiver. @param {string} file @param {string} receiver */
export const stripKey = (file, receiver) => `${file} :: ${receiver}`;

/** An arm-1 hit's key in either register: file, thing, the literal's first 120 characters. */
export const hitKey = (file, thing, text) => `${file}\t${thing}\t${String(text).slice(0, 120)}`;

/** The arm-1 keys a register banks. @param {{ arm1: Record<string, Array<[string, string, string]>> }} register */
export const bankedKeys = (register) => new Set(Object.entries(register.arm1).flatMap(([f, rows]) => rows.map((r) => hitKey(f, r[0], r[2]))));

/**
 * The trees arm 1 reads. W2-B-DECLARE item 3 (record 288, ruling 1, B (i)): the display and the components joined
 * the pool data and the generators, so a line written in code is read where it is written; their habitat at the
 * widening is banked in the widened register under `root`, shrink-only.
 */
export const ARM1_ROOTS = Object.freeze(['src/data', 'src/generators', 'src/domain', 'src/components']);

/**
 * THE THINGS AND THEIR MATCHER live in ONE home, `src/domain/facts/registeredWords.js` (W2-B-DECLARE,
 * 2026-11-12), moved there verbatim so the page arm (`coherence/vocabularyPageFindings.js`) reads the same
 * matcher as both arms here. Re-exported, so every reader of this rule book reads them as before.
 */
export {
  COURT_HOUSES, THINGS, THING_IDS, negates, sentencesOf, thingsNamedIn, deniesExistence, thingsDeniedIn, presentForDenial,
} from '../../src/domain/facts/registeredWords.js';

// ── ARM 1: the source ─────────────────────────────────────────────────────────────────────────

/**
 * THE CARRIERS ARM 1 CREDITS ARE THE CARRIERS A DOOR ENFORCES (W2-B-DECLARE item 1; the chair's record 294,
 * ruling 5: "the walker accepts three carriers of a declaration that the draw does not enforce"). A literal
 * counts as declared only where the declaration around it is one a draw door READS:
 *   `needs`, `excludes`  the generator door, `drawDeclared` / `filterDeclared` (`factVocabulary.js :: declarationOf`);
 *   `poolDeclares`       both doors' pool-level atoms (`drawDeclared`'s option; the kernel's `eligibleVariants`);
 *   `marks`              the corpus door, and ONLY on a state variant (an object with a numeric `vid`): the
 *                        kernel reads a variant's marks as atoms there alone (`stateProseKernel.js ::
 *                        variantFactDeclaration`; the causal register's marks are open arm names);
 *   `tags`               ONLY in a file whose table a door draws `{ tagged: true }` (`TAGGED_TABLE_FILES`):
 *                        the vocabulary reads `tags` at no other site (`declarationOf`).
 * `cast` (`conflictIssues.js`) and `requires` (`spatialData.js`, `resourceData.js`) are read by their own
 * tables' code and by no draw door, so they declare nothing here. A literal they alone covered is banked in
 * `presumedThings.widened.register.json` under `carrier`, or cured by a door's declaration.
 */
const DECL_PROPS = new Set(['needs', 'excludes', 'poolDeclares']);

/**
 * The files whose tables a door draws `{ tagged: true }`, each with its site: `tags` declares there and
 * nowhere else. The walker's pin holds this list equal to the `tagged: true` sites in `src`.
 */
export const TAGGED_TABLE_FILES = Object.freeze({
  'src/generators/npcStructure.js': 'NPC_STRUCTURE (`T`), resolved by `resolveDeclared(T[looked], { tagged: true, … })`',
});

/** Does this object literal carry a numeric `vid` (a state-prose variant: the kernel reads its marks)? @param {any} obj */
function isStateVariant(obj) {
  return obj.properties.some((p) => ts.isPropertyAssignment(p) && p.name
    && (ts.isIdentifier(p.name) || ts.isStringLiteral(p.name)) && p.name.text === 'vid' && ts.isNumericLiteral(p.initializer));
}

/**
 * The declaration properties of one object literal that a door enforces (`DECL_PROPS`, and `marks` / `tags`
 * under their conditions above), their strings collected into `out`. @param {any} obj @param {string} rel @param {string[]} out
 */
function collectCredited(obj, rel, out) {
  for (const p of obj.properties) {
    const name = p.name && (ts.isIdentifier(p.name) || ts.isStringLiteral(p.name)) ? p.name.text : null;
    if (!name || !ts.isPropertyAssignment(p)) continue;
    const credited = DECL_PROPS.has(name)
      || (name === 'marks' && isStateVariant(obj))
      || (name === 'tags' && Object.prototype.hasOwnProperty.call(TAGGED_TABLE_FILES, rel));
    if (credited) {
      /** @type {string[]} */ const words = []; collectStrings(p.initializer, words);
      for (const w of words) {
        out.push(w);
        // a kernel family mark (`threat`, `no hunger`) is its crisis atom (`factVocabulary.js :: MARK_DIMENSION_ATOM`)
        const fam = MARK_DIMENSION_ATOM[w.trim().replace(/^no\s+/i, '')];
        if (name === 'marks' && fam) out.push(fam);
      }
    } else if (name === 'crisis') {
      // the generator door's crisis carrier (`declarationOf` reads `crisis`): each value is its crisis atom
      /** @type {string[]} */ const words = []; collectStrings(p.initializer, words);
      for (const w of words) for (const v of w.replace(/^crisis:\s*/i, '').split(',')) out.push(`crisis: ${CRISIS_KIND_ALIASES[v.trim()] || v.trim()}`);
    }
  }
}

/**
 * THE SOURCE SITES ARM 1 DOES NOT READ, each with its reason (the header's "WHAT ARM 1 DOES NOT READ"). A literal
 * is out of reach only when it is EXACTLY argument `argument` (0-based) of a call to the bare identifier `callee`
 * in `file`; the same words anywhere else, in another position or another file, are read as ever.
 */
export const ARM1_NOT_PRINTED = Object.freeze([
  Object.freeze({
    file: 'src/generators/generationCoherence.js', callee: 'finding', argument: 1,
    reason: 'the coherence receipt\'s finding detail: a check\'s own diagnostic, read by no printing file (the receipt is NOT_PRINTED in arm 2; the pin "no reader prints a finding\'s words" holds it)',
  }),
]);

/**
 * THE RULE BOOK'S OWN DATA (W2-B-DECLARE second seat, F10): the files whose literals are the vocabulary itself — a
 * word's pattern, its atoms, the leaf it reads — never a line about a town. Read by no printing file: the pin "the rule
 * book is read only by its checks" holds the files that import it. Exempt by its SITE, so no row of the register ever
 * banks a string of the rule book.
 */
export const ARM1_RULE_BOOK = Object.freeze({
  'src/domain/facts/registeredWords.js': 'the registered words, their atoms and their leaves: the walker\'s and the page check\'s rule book, imported by no printing file',
});

/** Is this literal one of ARM1_NOT_PRINTED's sites? @param {string} rel @param {any} node */
function isNotPrintedSite(rel, node) {
  const call = node.parent;
  if (!call || !ts.isCallExpression(call) || !ts.isIdentifier(call.expression)) return false;
  return ARM1_NOT_PRINTED.some((site) => site.file === rel && site.callee === call.expression.text
    && call.arguments[site.argument] === node);
}

/**
 * Does a declaration answer a registered word? One of the word's atoms is declared (either side); an atom
 * written `dimension:` is answered by any band of that dimension (`population: ≥ middling`).
 * @param {ReadonlyArray<string>} atoms @param {string[]} declared the declaration words around the literal
 */
export function answers(atoms, declared) {
  const want = atoms.map((a) => a.toLowerCase());
  return declared.some((w) => want.some((a) => (a.endsWith(':') ? w.startsWith(a) : w === a)));
}

/** The atom a declaration word answers (`no X` → X), lower-cased. @param {string} w */
const atomWord = (w) => w.trim().replace(/^no\s+/i, '').toLowerCase();

/**
 * Every string a declaration around `node` carries: the declaration properties of each object
 * literal on the way up (four levels), and the array arguments of each call on the way up (a
 * `declaredSet(text, ['watch'])`).
 * @param {any} node
 */
function declarationWordsAround(node, rel) {
  /** @type {string[]} */ const out = [];
  const strings = (n) => collectStrings(n, out);
  let cur = node.parent;
  for (let depth = 0; cur && depth < 5; depth++, cur = cur.parent) {
    if (ts.isObjectLiteralExpression(cur)) {
      collectCredited(cur, rel, out);
    } else if (ts.isCallExpression(cur)) {
      for (const a of cur.arguments) if (ts.isArrayLiteralExpression(a)) strings(a);
    }
    if (ts.isVariableStatement(cur) || ts.isFunctionDeclaration(cur) || ts.isSourceFile(cur)) break;
  }
  return out.map(atomWord);
}

/** Is this literal a property NAME (a sibling table's key: its line is declared beside it), or a `twinOf`? */
function isKeyOrTwinOf(node) {
  const p = node.parent;
  if (p && ts.isPropertyAssignment(p) && p.name === node) return true;
  if (p && ts.isPropertyAssignment(p) && ts.isIdentifier(p.name) && p.name.text === 'twinOf') return true;
  return false;
}

/**
 * The TEXT-KEYED declarations of one source text: a table whose key is a line's own text and whose
 * value declares it (`DESC_VARIANT_DECLARATIONS`, a sibling set `'<text>': declaredSet(…)`). Text →
 * the declaration words. Read over the whole tree first, because a line and its declaration may
 * live in two files (`rulingStructure.js` prints what `powerSiblings.js` declares).
 * @param {string} rel @param {string} src
 * @returns {Map<string, string[]>}
 */
export function keyedDeclarations(rel, src) {
  const sf = ts.createSourceFile(rel, src, ts.ScriptTarget.Latest, true, ts.ScriptKind.JSX);
  /** @type {Map<string, string[]>} */ const out = new Map();
  const visit = (n) => {
    if (ts.isPropertyAssignment(n) && (ts.isStringLiteral(n.name) || ts.isNoSubstitutionTemplateLiteral(n.name))) {
      const words = [];
      const read = (m) => {
        if (ts.isObjectLiteralExpression(m)) collectCredited(m, rel, words);
        if (ts.isCallExpression(m)) for (const a of m.arguments) if (ts.isArrayLiteralExpression(a)) collectStrings(a, words);
        ts.forEachChild(m, read);
      };
      read(n.initializer);
      if (words.length) out.set(n.name.text, [...(out.get(n.name.text) || []), ...words.map(atomWord)]);
    }
    ts.forEachChild(n, visit);
  };
  visit(sf);
  return out;
}

/** @param {any} n @param {string[]} out */
function collectStrings(n, out) {
  if (ts.isStringLiteral(n) || ts.isNoSubstitutionTemplateLiteral(n)) out.push(n.text);
  ts.forEachChild(n, (m) => collectStrings(m, out));
}

/**
 * Arm 1 over one source text: one hit per (literal, thing) that is NOT declared.
 * @param {string} rel the file's path from the repository root
 * @param {string} src
 * @param {Map<string, string[]>} [keyed] the tree's text-keyed declarations (`keyedDeclarations`)
 * @returns {Array<{ file: string, thing: string, text: string }>}
 */
export function scanSource(rel, src, keyed = keyedDeclarations(rel, src)) {
  if (Object.hasOwn(ARM1_RULE_BOOK, rel)) return [];
  const sf = ts.createSourceFile(rel, src, ts.ScriptTarget.Latest, true, ts.ScriptKind.JSX);
  /** @type {Array<{ file: string, thing: string, text: string }>} */ const hits = [];
  const visit = (n) => {
    // a JSX text node is a line written in a component (W2-B-DECLARE item 3: the components are a root); its
    // white space is folded as a browser folds it
    const jsx = ts.isJsxText(n) ? n.text.replace(/\s+/g, ' ').trim() : null;
    const isText = jsx !== null || ts.isStringLiteral(n) || ts.isNoSubstitutionTemplateLiteral(n) || ts.isTemplateHead(n) || ts.isTemplateMiddle(n) || ts.isTemplateTail(n);
    const text = jsx ?? n.text;
    if (isText && text.trim().split(/\s+/).length >= 3 && !isKeyOrTwinOf(n) && !isNotPrintedSite(rel, n)) {
      let declared = null;
      for (const sentence of sentencesOf(text)) {
        for (const thing of [...thingsNamedIn(sentence), ...newWordsNamedIn(sentence)]) {
          declared ??= [...declarationWordsAround(n, rel), ...(keyed.get(text) || [])];
          if (answers(REGISTERED_WORDS[thing].atoms, declared)) continue;
          if (!hits.some((h) => h.thing === thing && h.text === text)) hits.push({ file: rel, thing, text });
        }
      }
    }
    ts.forEachChild(n, visit);
  };
  visit(sf);
  return hits;
}

/** @param {string} root the repository root @returns {string[]} the files arm 1 reads */
export function listFiles(root) {
  /** @type {string[]} */ const files = [];
  const walk = (rel) => {
    for (const e of readdirSync(join(root, rel)).sort()) {
      const p = `${rel}/${e}`;
      if (statSync(join(root, p)).isDirectory()) walk(p);
      else if (/\.(?:js|jsx|mjs)$/.test(e)) files.push(p);
    }
  };
  for (const r of ARM1_ROOTS) walk(r);
  return files;
}

/** @param {string} root @returns {Array<{ file: string, thing: string, text: string }>} */
export function scanTree(root) {
  const files = listFiles(root).map((rel) => [rel, readFileSync(join(root, rel), 'utf8')]);
  /** @type {Map<string, string[]>} */ const keyed = new Map();
  for (const [rel, src] of files) for (const [k, v] of keyedDeclarations(rel, src)) keyed.set(k, [...(keyed.get(k) || []), ...v]);
  return files.flatMap(([rel, src]) => scanSource(rel, src, keyed));
}

// ── ARM 3: the strip ban (W2-B-DECLARE item 3) ────────────────────────────────────────────────────

/**
 * THE STRIP BAN (the chair's record 288, ruling 1, B (iii); the procedure §5.3: "no stripping a declaration
 * before a draw"). A pool whose lines carry declarations is selected only through a door (`drawDeclared`,
 * `filterDeclared`); unwrapping its lines to their text first (`.map(textOf)`, `.map(lineText)`,
 * `.map((l) => l.text)`) throws the declarations away, and the bare pick after it is refused nowhere.
 * Every strip-shaped call in `src` is listed by its identity — file and receiver text — and stands in the
 * widened register's `strips` under a named reason (`strip-before-draw`, to cure; `not-a-draw`, a dedupe, a
 * join, a check or a list printed whole), or the walker reds. Written only through the register's door. A new strip is red in the lane that writes it.
 */
export const STRIP_ROOTS = Object.freeze(['src']);

/** Is this `.map` argument an unwrap to text? @param {any} arg */
function isUnwrap(arg) {
  if (ts.isIdentifier(arg)) return arg.text === 'textOf' || arg.text === 'lineText';
  if (ts.isArrowFunction(arg) && arg.parameters.length === 1 && ts.isIdentifier(arg.parameters[0].name)) {
    const p = arg.parameters[0].name.text;
    const body = ts.isParenthesizedExpression(arg.body) ? arg.body.expression : arg.body;
    return ts.isPropertyAccessExpression(body) && body.name.text === 'text' && ts.isIdentifier(body.expression) && body.expression.text === p;
  }
  return false;
}

/**
 * The strip-shaped calls of one source text: `{ file, receiver }`, the receiver's source text (whitespace
 * folded, its first 100 characters) being the site's identity. @param {string} rel @param {string} src
 * @returns {Array<{ file: string, receiver: string }>}
 */
export function stripSites(rel, src) {
  const sf = ts.createSourceFile(rel, src, ts.ScriptTarget.Latest, true, ts.ScriptKind.JSX);
  /** @type {Array<{ file: string, receiver: string }>} */ const out = [];
  const visit = (n) => {
    if (ts.isCallExpression(n) && ts.isPropertyAccessExpression(n.expression) && n.expression.name.text === 'map'
      && n.arguments.length === 1 && isUnwrap(n.arguments[0])) {
      out.push({ file: rel, receiver: n.expression.expression.getText(sf).replace(/\s+/g, ' ').slice(0, 100) });
    }
    ts.forEachChild(n, visit);
  };
  visit(sf);
  return out;
}

/** @param {string} root @returns {Array<{ file: string, receiver: string }>} every strip-shaped call under STRIP_ROOTS */
export function stripTree(root) {
  /** @type {string[]} */ const files = [];
  const walk = (rel) => {
    for (const e of readdirSync(join(root, rel)).sort()) {
      const p = `${rel}/${e}`;
      if (statSync(join(root, p)).isDirectory()) walk(p);
      else if (/\.(?:js|jsx|mjs)$/.test(e)) files.push(p);
    }
  };
  for (const r of STRIP_ROOTS) walk(r);
  return files.flatMap((rel) => stripSites(rel, readFileSync(join(root, rel), 'utf8')));
}

// ── ARM 2: the printed record ─────────────────────────────────────────────────────────────────

/**
 * Record paths that are NOT printed, each with its reason. A path matches when it starts with one
 * of these (or equals it).
 */
export const NOT_PRINTED = Object.freeze({
  '.generationCoherenceReceipt': 'the birth receipt: a component reads its verdict (generalDeskRead.js :: recordCleanOf), never its findings, whose evidence quotes lines listed at their own paths',
  '.simulationTrace': 'the simulation trace: ids and targets for the engine',
});

/**
 * LICENSED ROWS (the chair's ruling of 2026-11-11, point 2): a chain's service output and a service
 * menu row are answered by their OWN institution — where the row stands, the service is offered.
 * Arm 2 does not read their words; instead `unlicensedServiceRows` asserts each row's institution is
 * live on the roster.
 */
export const LICENSED = Object.freeze(['.economicState.institutionalServices', '.availableServices']);

/**
 * The service rows whose licensing institution is NOT on the live roster (names lower-cased).
 * @param {any} record @param {string[]} names the live roster's names
 * @returns {string[]}
 */
export function unlicensedServiceRows(record, names) {
  const live = new Set(names.map((n) => n.toLowerCase()));
  /** @type {string[]} */ const out = [];
  for (const row of record?.economicState?.institutionalServices || []) {
    const insts = Array.isArray(row?.institutions) ? row.institutions : [];
    if (!insts.length || !insts.some((n) => live.has(String(n).toLowerCase()))) out.push(`institutionalServices :: ${row?.output} :: ${insts.join(', ')}`);
  }
  for (const [cat, rows] of Object.entries(record?.availableServices || {})) {
    for (const row of Array.isArray(rows) ? rows : []) {
      // a parenthetical house ('(covert)', '(street gang)', '(lawless)') is the criminal structure's
      // houseless service, stated as such: it names no institution to stand
      if (/^\(.*\)$/.test(String(row?.institution ?? '').trim())) continue;
      if (!row?.institution || !live.has(String(row.institution).toLowerCase())) out.push(`availableServices.${cat} :: ${row?.name} :: ${row?.institution}`);
    }
  }
  return out;
}

/** The ids and keys a record carries beside its prose. */
const ID_PATH = /(?:\.id|\.key|\.family|targetId|\.inst\.names\[\])$/;

/** @param {string} path */
const under = (path, p) => path === p || path.startsWith(p + '.') || path.startsWith(p + '[');
export const isPrinted = (path) => !ID_PATH.test(path) && !Object.keys(NOT_PRINTED).some((p) => under(path, p));
/** @param {string} path a licensed row's path (`LICENSED`) */
export const isLicensed = (path) => LICENSED.some((p) => under(path, p));

/** @param {unknown} v @param {string} p @param {Array<[string, string]>} out */
function leaves(v, p, out) {
  if (typeof v === 'string') out.push([p, v]);
  else if (Array.isArray(v)) for (const x of v) leaves(x, `${p}[]`, out);
  else if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) leaves(x, `${p}.${k}`, out);
  return out;
}

/**
 * Arm 2 over one record: each (thing, path, sentence) printed while the thing is absent, and (the
 * chair's ruling A) each sentence printed DENYING a thing the town has, marked `denies: true`. The
 * denial side reads the licensed service rows too: a houseless row ('(lawless)') is answered by no
 * institution, so nothing licenses what it denies.
 * @param {object} record @param {object} facts `factsOf(record)` @param {string[]} names the live roster's names
 * @returns {Array<{ thing: string, path: string, sentence: string, denies?: true }>}
 */
export function printedAbsent(record, facts, names) {
  /** @type {Map<string, boolean>} */ const absent = new Map();
  const isAbsent = (thing) => {
    if (!absent.has(thing)) absent.set(thing, !!THINGS[thing].absent(facts, names));
    return absent.get(thing);
  };
  /** @type {Array<{ thing: string, path: string, sentence: string }>} */ const out = [];
  const seen = new Set();
  for (const [path, text] of leaves(record, '', [])) {
    if (text.length < 15 || !isPrinted(path)) continue;
    const licensed = isLicensed(path);
    for (const sentence of sentencesOf(text)) {
      if (!licensed && text.length >= 20) {
        for (const thing of thingsNamedIn(sentence)) {
          if (!isAbsent(thing)) continue;
          const k = `${thing}\t${path}\t${sentence}`;
          if (!seen.has(k)) { seen.add(k); out.push({ thing, path, sentence }); }
        }
      }
      for (const thing of thingsDeniedIn(sentence)) {
        if (!presentForDenial(thing, facts, names)) continue;
        const k = `denies\t${thing}\t${path}\t${sentence}`;
        if (!seen.has(k)) { seen.add(k); out.push({ thing, path, sentence, denies: true }); }
      }
    }
  }
  return out;
}

// ── TIME: a line can presume its witnesses (the chair's ruling B of 2026-11-11) ──────────────────

/**
 * The words that put the people who LIVED THROUGH an event among the living ("those who lived
 * through it are still here", "within living memory", "as if it were last year", "first-hand").
 * The fact vocabulary has no atom for time, so a line cannot DECLARE it: this reading answers it
 * from the record's own dates instead.
 */
export const WITNESS_WORDS = /\blived through it\b|\bliving memory\b|\bstill here to tell\b|\bas if it were last year\b|\bfirst-hand\b/i;

/**
 * Is an event older than its bearers? The estate's own time ladder answers it
 * (`heraldCausalGrammar.js :: TIME_BANDS`: past "a generation", sixty years, the band is "older
 * than its bearers"). @param {unknown} yearsAgo
 */
export const olderThanBearers = (yearsAgo) => typeof yearsAgo === 'number' && timeBandOf(yearsAgo, 52).id === 'older_than_bearers';

/** An event's name as a sentence names it ("The Siege" → "siege"), lower-cased. @param {unknown} name */
const bareName = (name) => String(name ?? '').replace(/^(?:the|a|an)\s+/i, '').trim().toLowerCase();

/**
 * Arm 2's TIME reading over one record. Listed, each as { thing: 'time', path, sentence, why }:
 *   • 'witness'  a sentence claiming living witnesses, printed under an event older than its
 *     bearers (the event's own prose), or naming only such events (anywhere else);
 *   • 'echo'     a current tension whose sentence is word for word a past event's in the same town.
 * @param {any} record
 * @returns {Array<{ thing: 'time', path: string, sentence: string, why: 'witness'|'echo' }>}
 */
export function printedOutOfTime(record) {
  const events = Array.isArray(record?.history?.historicalEvents) ? record.history.historicalEvents : [];
  /** @type {Array<{ thing: 'time', path: string, sentence: string, why: 'witness'|'echo' }>} */ const out = [];
  const seen = new Set();
  const push = (path, sentence, why) => {
    const k = `${why}\t${path}\t${sentence}`;
    if (!seen.has(k)) { seen.add(k); out.push({ thing: 'time', path, sentence, why }); }
  };
  for (const e of events) {
    if (!olderThanBearers(e?.yearsAgo)) continue;
    for (const [path, text] of leaves(e, '.history.historicalEvents[]', [])) {
      if (!isPrinted(path)) continue;
      for (const sentence of sentencesOf(text)) if (WITNESS_WORDS.test(sentence)) push(path, sentence, 'witness');
    }
  }
  const named = events.map((e) => ({ name: bareName(e?.name), old: olderThanBearers(e?.yearsAgo) })).filter((e) => e.name.length > 2);
  for (const [path, text] of leaves(record, '', [])) {
    if (path.startsWith('.history.historicalEvents') || !isPrinted(path)) continue;
    for (const sentence of sentencesOf(text)) {
      if (!WITNESS_WORDS.test(sentence)) continue;
      const lower = sentence.toLowerCase();
      // the event the sentence is ABOUT is the one it names first ("The Siege is still present in
      // living memory: a previous occupation ended …" is about the siege)
      let first = null;
      for (const e of named) {
        const at = lower.search(new RegExp(`\\b${e.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`));
        if (at >= 0 && (first === null || at < first.at)) first = { at, old: e.old };
      }
      if (first?.old) push(path, sentence, 'witness');
    }
  }
  const past = new Set(events.map((e) => e?.description).filter((d) => typeof d === 'string' && d.length >= 20));
  for (const t of Array.isArray(record?.history?.currentTensions) ? record.history.currentTensions : []) {
    if (past.has(t?.description)) push('.history.currentTensions[].description', t.description, 'echo');
  }
  return out;
}

/** THE CORPUS (the charter §0.4): the configuration a real browser sends, every dial on random. */
export const CORPUS_PLAN = Object.freeze([['village', 60], ['town', 160], ['city', 100], ['metropolis', 40]]);
export const corpusConfig = (tier) => ({
  settType: tier, tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat',
  nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded',
});
export const corpusSeeds = () => CORPUS_PLAN.flatMap(([tier, n]) => Array.from({ length: n }, (_, i) => ({ tier, seed: `presume-${tier}-${i}` })));

/**
 * Does a register row cover this arm-2 listing? A row names its thing, its path and a stable
 * fragment of the sentence (`text`; names vary between towns, so the fragment leaves them out).
 * @param {{ thing: string, path: string, text: string }} row
 * @param {{ thing: string, path: string, sentence: string }} hit
 */
export const rowCovers = (row, hit) => row.thing === hit.thing && row.path === hit.path && hit.sentence.includes(row.text)
  && !!row.denies === !!hit.denies;
