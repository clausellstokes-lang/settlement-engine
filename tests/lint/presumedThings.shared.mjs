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
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, posix } from 'node:path';
import { createRequire } from 'node:module';

import { timeBandOf } from '../../src/domain/display/heraldCausalGrammar.js';
import {
  THINGS, declarationImplies, newWordsDeniedIn, newWordsNamedIn, sentencesOf, thingsNamedIn, thingsDeniedIn, presentForDenial,
} from '../../src/domain/facts/registeredWords.js';
import { CRISIS_KIND_ALIASES, declarationOfMarks, declarationOfTags } from '../../src/domain/facts/factVocabulary.js';

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

/**
 * A literal's identity: the sha-256 of its WHOLE text, 16 hex characters (F4 of REVIEW-W2B's second read: a key of the
 * first 120 characters let a false sentence appended to a banked line pass). Any edit to a banked line is a fresh hit.
 * @param {string} text
 */
export const literalHash = (text) => createHash('sha256').update(String(text)).digest('hex').slice(0, 16);

/** An arm-1 hit's key in either register: file, thing, the hash of the whole literal. */
export const hitKey = (file, thing, text) => `${file}\t${thing}\t${literalHash(text)}`;

/**
 * A banked row is `[thing, reason, the literal's first 120 characters (a label, read by no key), hash]`. The hash is one
 * string, or a list for a row banked before F4 over several literals that share their first 120 characters (5 such
 * rows at the re-key: the row still covers exactly the literals it covered, no more). A row with no hash covers nothing.
 * @param {string} file @param {Array<any>} row @returns {string[]}
 */
export const rowKeys = (file, row) => (Array.isArray(row[3]) ? row[3] : row[3] ? [row[3]] : []).map((h) => `${file}\t${row[0]}\t${h}`);

/** The arm-1 keys a register banks. @param {{ arm1: Record<string, Array<Array<any>>> }} register */
export const bankedKeys = (register) => new Set(Object.entries(register.arm1).flatMap(([f, rows]) => rows.flatMap((r) => rowKeys(f, r))));

/** The row the door banks for a hit. @param {{ thing: string, text: string }} hit @param {string} reason */
export const bankRow = (hit, reason) => [hit.thing, reason, String(hit.text).slice(0, 120), literalHash(hit.text)];

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
 * THE CARRIERS ARM 1 CREDITS ARE THE CARRIERS A DOOR ENFORCES, ON AN OBJECT A DOOR DRAWS (W2-B-DECLARE item 1; the
 * chair's record 294, ruling 5; the second seat, F3: "credit a carrier only on an object a door draws — an element of a
 * pool handed to the declared draw, or a kernel pool"). A literal counts as declared only where the declaration around
 * it is one a draw door READS, on an object a door is HANDED:
 *   `needs`, `excludes`, `crisis`  the generator door (`factVocabulary.js :: declarationOf`);
 *   `poolDeclares`       the door's pool-level atoms;
 *   `marks`              the corpus door, on a state variant (an object with a numeric `vid`) in a kernel pool file;
 *   `tags`               ONLY in a file whose table a door draws `{ tagged: true }` (`TAGGED_TABLE_FILES`);
 *   a BUILDER's array    a call to a function of the file whose returned rows put that argument on `needs` or
 *                        `excludes` (a sibling set's `declaredSet(text, needs, twin)`), inside a drawn table.
 * WHAT A DOOR DRAWS (`drawnRanges`): the pool and sibling arguments of every door call in the walker's roots, followed
 * back through local variables, a function's parameters to its callers, a function's returns and imports, to the
 * top-level tables they read; and every state variant of a kernel pool file. An object outside them declares nothing,
 * whatever it carries: `{ needs: ['militia'], blurb }` printed by `X.blurb` is undeclared.
 */
const DECL_PROPS = new Set(['needs', 'excludes', 'poolDeclares', 'crisis']);

/** THE DOORS and the argument positions that hand them lines (`drawDeclared.js`). */
export const DOOR_ARGS = Object.freeze({
  drawDeclared: [0], filterDeclared: [0], resolveDeclared: [0], resolveSibling: [1], resolveSiblingSentences: [1], noteDeclared: [1],
});

/** The kernel's pool files: their state variants are drawn by `stateProseKernel.js :: eligibleVariants`. */
export const KERNEL_POOL_FILE = /^src\/data\/dossierStateProse\/[^/]+\.generated\.js$/;

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

/** @param {any} p a property's name node @returns {string|null} */
const propName = (p) => (p && (ts.isIdentifier(p) || ts.isStringLiteral(p)) ? p.text : null);

/** @param {string} from the importing file @param {string} spec @param {Set<string>} known @returns {string|null} */
function resolveSpec(from, spec, known) {
  if (!spec.startsWith('.')) return null;
  const base = posix.normalize(posix.join(posix.dirname(from), spec));
  for (const c of [base, `${base}.js`, `${base}/index.js`, `${base}.jsx`]) if (known.has(c)) return c;
  return null;
}

/**
 * THE DRAWN RANGES: per file, the source ranges a door is handed (see the header above). Static and conservative:
 * a whole top-level table is drawn when any of it is handed to a door.
 * @param {ReadonlyArray<[string, string]>} files [rel, source] of every file the walker reads
 * @returns {Map<string, Array<[number, number]>>}
 */
export function drawnRanges(files) {
  const known = new Set(files.map(([rel]) => rel));
  /** @type {Map<string, any>} */ const mods = new Map();
  for (const [rel, src] of files) {
    const sf = ts.createSourceFile(rel, src, ts.ScriptTarget.Latest, true, ts.ScriptKind.JSX);
    const top = new Map(); const imports = new Map(); const exports = new Map(); const calls = [];
    for (const st of sf.statements) {
      if (ts.isVariableStatement(st)) for (const d of st.declarationList.declarations) { if (ts.isIdentifier(d.name)) top.set(d.name.text, d); }
      else if (ts.isFunctionDeclaration(st) && st.name) top.set(st.name.text, st);
      if ((ts.isVariableStatement(st) || ts.isFunctionDeclaration(st)) && st.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)) {
        if (ts.isVariableStatement(st)) for (const d of st.declarationList.declarations) { if (ts.isIdentifier(d.name)) exports.set(d.name.text, { rel, name: d.name.text }); }
        else if (st.name) exports.set(st.name.text, { rel, name: st.name.text });
      }
      if (ts.isImportDeclaration(st) && ts.isStringLiteral(st.moduleSpecifier)) {
        const from = resolveSpec(rel, st.moduleSpecifier.text, known);
        const cl = st.importClause;
        if (from && cl?.namedBindings && ts.isNamedImports(cl.namedBindings)) for (const e of cl.namedBindings.elements) imports.set(e.name.text, { rel: from, name: (e.propertyName || e.name).text });
        if (from && cl?.namedBindings && ts.isNamespaceImport(cl.namedBindings)) imports.set(cl.namedBindings.name.text, { rel: from, name: '*' });
      }
      if (ts.isExportDeclaration(st) && st.exportClause && ts.isNamedExports(st.exportClause)) {
        const from = st.moduleSpecifier && ts.isStringLiteral(st.moduleSpecifier) ? resolveSpec(rel, st.moduleSpecifier.text, known) : rel;
        for (const e of st.exportClause.elements) if (from) exports.set(e.name.text, { rel: from, name: (e.propertyName || e.name).text, via: from !== rel });
      }
    }
    const visit = (n) => { if (ts.isCallExpression(n)) calls.push(n); ts.forEachChild(n, visit); };
    visit(sf);
    mods.set(rel, { sf, top, imports, exports, calls });
  }
  /** @type {Map<string, Array<[number, number]>>} */ const ranges = new Map();
  const mark = (rel, node) => { (ranges.get(rel) || ranges.set(rel, []).get(rel)).push([node.pos, node.end]); };
  const seen = new Set();
  /** the exported name's own file and top-level name, through re-exports */
  const exported = (rel, name, hops = 0) => {
    const m = mods.get(rel); const e = m?.exports.get(name);
    if (!e) return m?.top.has(name) ? { rel, name } : null;
    return e.via && hops < 4 ? exported(e.rel, e.name, hops + 1) : { rel: e.rel, name: e.name };
  };
  const callsTo = (rel, name) => {
    /** @type {Array<[string, any]>} */ const out = [];
    for (const [r, m] of mods) for (const c of m.calls) {
      if (!ts.isIdentifier(c.expression)) continue;
      const callee = c.expression.text;
      if (r === rel && callee === name && m.top.has(name)) out.push([r, c]);
      const imp = m.imports.get(callee);
      if (imp) { const t = exported(imp.rel, imp.name); if (t && t.rel === rel && t.name === name) out.push([r, c]); }
    }
    return out;
  };
  const markTop = (rel, name, depth) => {
    const k = `${rel}::${name}`; if (seen.has(k)) return; seen.add(k);
    const d = mods.get(rel)?.top.get(name); if (!d) return;
    mark(rel, d);
    if (ts.isVariableDeclaration(d) && d.initializer) trace(rel, d.initializer, depth + 1, false);
    else if (ts.isFunctionDeclaration(d)) traceReturns(rel, d, depth + 1);
  };
  const traceReturns = (rel, fn, depth) => {
    if (fn.body && !ts.isBlock(fn.body)) { trace(rel, fn.body, depth, true); return; }
    const visit = (n) => { if (ts.isReturnStatement(n) && n.expression) trace(rel, n.expression, depth, true); if (!ts.isFunctionLike(n)) ts.forEachChild(n, visit); };
    if (fn.body) ts.forEachChild(fn.body, visit);
  };
  /** the declaration of an identifier in scope at `at`: a top-level name, a local variable, a parameter, an import */
  const declOf = (rel, at, name) => {
    for (let cur = at.parent; cur; cur = cur.parent) {
      if (ts.isFunctionLike(cur)) {
        const i = (cur.parameters || []).findIndex((p) => ts.isIdentifier(p.name) && p.name.text === name);
        if (i >= 0) return { kind: 'param', fn: cur, index: i };
      }
      if ((ts.isForOfStatement(cur) || ts.isForInStatement(cur)) && ts.isVariableDeclarationList(cur.initializer)
        && cur.initializer.declarations.some((d) => ts.isIdentifier(d.name) && d.name.text === name)) return { kind: 'local', init: cur.expression };
      const stmts = ts.isSourceFile(cur) || ts.isBlock(cur) || ts.isModuleBlock(cur) || ts.isCaseClause(cur) ? cur.statements : null;
      if (!stmts) continue;
      for (const st of stmts) {
        if (ts.isVariableStatement(st)) for (const d of st.declarationList.declarations) {
          const binds = ts.isIdentifier(d.name) ? [d.name.text] : [];
          if (!ts.isIdentifier(d.name)) { const v = (b) => { if (ts.isIdentifier(b)) binds.push(b.text); else ts.forEachChild(b, v); }; ts.forEachChild(d.name, v); }
          if (binds.includes(name)) return ts.isSourceFile(cur) ? { kind: 'top' } : { kind: 'local', init: d.initializer };
        }
        if (ts.isFunctionDeclaration(st) && st.name?.text === name) return ts.isSourceFile(cur) ? { kind: 'top' } : { kind: 'localFn', fn: st };
      }
    }
    return mods.get(rel)?.imports.has(name) ? { kind: 'import' } : null;
  };
  const fnName = (fn) => {
    if (ts.isFunctionDeclaration(fn) && fn.name) return fn.name.text;
    if (fn.parent && ts.isVariableDeclaration(fn.parent) && ts.isIdentifier(fn.parent.name)) return fn.parent.name.text;
    return null;
  };
  /** follow every name an expression reads to the tables behind it */
  function trace(rel, expr, depth, owned) {
    if (!expr || depth > 8) return;
    if (owned) mark(rel, expr);
    const m = mods.get(rel);
    const visit = (n) => {
      if (ts.isIdentifier(n)) {
        const p = n.parent;
        if (p && ts.isPropertyAccessExpression(p) && p.name === n) return;
        if (p && (ts.isPropertyAssignment(p) || ts.isMethodDeclaration(p)) && p.name === n) return;
        const d = declOf(rel, n, n.text);
        if (!d) return;
        if (d.kind === 'top') markTop(rel, n.text, depth);
        else if (d.kind === 'local') trace(rel, d.init, depth + 1, true);
        else if (d.kind === 'localFn') traceReturns(rel, d.fn, depth + 1);
        else if (d.kind === 'import') {
          const imp = m.imports.get(n.text);
          if (imp.name === '*') { if (p && ts.isPropertyAccessExpression(p) && p.expression === n) { const t = exported(imp.rel, p.name.text); if (t) markTop(t.rel, t.name, depth); } }
          else { const t = exported(imp.rel, imp.name); if (t) markTop(t.rel, t.name, depth); }
        } else if (d.kind === 'param') {
          const name = fnName(d.fn);
          const k = `${rel}::param::${d.fn.pos}::${d.index}`;
          if (!name || seen.has(k)) return; seen.add(k);
          const owner = mods.get(rel).top.has(name) ? [rel, name] : null;
          for (const [r, c] of owner ? callsTo(owner[0], owner[1]) : mods.get(rel).calls.filter((c) => ts.isIdentifier(c.expression) && c.expression.text === name).map((c) => [rel, c])) {
            if (c.arguments[d.index]) trace(r, c.arguments[d.index], depth + 1, true);
          }
        }
        return;
      }
      ts.forEachChild(n, visit);
    };
    visit(expr);
  }
  for (const [rel, m] of mods) {
    for (const c of m.calls) {
      const callee = ts.isIdentifier(c.expression) ? c.expression.text : ts.isPropertyAccessExpression(c.expression) ? c.expression.name.text : null;
      for (const i of (callee && Object.hasOwn(DOOR_ARGS, callee) ? DOOR_ARGS[callee] : [])) if (c.arguments[i]) trace(rel, c.arguments[i], 0, true);
    }
    if (KERNEL_POOL_FILE.test(rel)) mark(rel, m.sf);
  }
  return ranges;
}

/** Is this node inside a range a door draws? @param {Map<string, Array<[number, number]>>} drawn @param {string} rel @param {any} node */
const isDrawn = (drawn, rel, node) => (drawn.get(rel) || []).some(([a, b]) => node.pos >= a && node.end <= b);

/**
 * THE BUILDERS of one file: a top-level function whose returned rows put a parameter on `text`, `needs` or `excludes`
 * (a sibling set's `declaredSet(text, needs, twin)`). name → the rows, each `{ text, needs, excludes }` as parameter
 * positions. @param {any} sf @returns {Map<string, Array<{ text: number, needs: number, excludes: number }>>}
 */
function buildersOf(sf) {
  /** @type {Map<string, Array<{ text: number, needs: number, excludes: number }>>} */ const out = new Map();
  for (const st of sf.statements) {
    const decls = ts.isVariableStatement(st) ? st.declarationList.declarations.map((d) => [d.name, d.initializer]) : ts.isFunctionDeclaration(st) ? [[st.name, st]] : [];
    for (const [name, fn] of decls) {
      if (!name || !ts.isIdentifier(name) || !fn || !ts.isFunctionLike(fn)) continue;
      const params = fn.parameters.map((p) => (ts.isIdentifier(p.name) ? p.name.text : null));
      const rows = [];
      const visit = (n) => {
        if (ts.isObjectLiteralExpression(n)) {
          const at = (prop) => {
            const p = n.properties.find((x) => propName(x.name) === prop);
            const v = p && (ts.isShorthandPropertyAssignment(p) ? p.name : ts.isPropertyAssignment(p) && ts.isIdentifier(p.initializer) ? p.initializer : null);
            return v ? params.indexOf(v.text) : -1;
          };
          const row = { text: at('text'), needs: at('needs'), excludes: at('excludes') };
          if (row.text >= 0 && (row.needs >= 0 || row.excludes >= 0)) rows.push(row);
        }
        ts.forEachChild(n, visit);
      };
      visit(fn);
      if (rows.length) out.set(name.text, rows);
    }
  }
  return out;
}

/** @returns {{ needs: string[], excludes: string[], crisis: string[] }} */
const emptyDecl = () => ({ needs: [], excludes: [], crisis: [] });
/** @param {{ needs: string[], excludes: string[], crisis: string[] }} into @param {{ needs: ReadonlyArray<string>, excludes: ReadonlyArray<string>, crisis: ReadonlyArray<string> }} d */
const addDecl = (into, d) => { into.needs.push(...d.needs); into.excludes.push(...d.excludes); into.crisis.push(...d.crisis); };

/**
 * The declaration properties of one DRAWN object literal that a door enforces, folded into `out` in the door's own
 * reading (`needs` / `excludes` as written; `crisis` values; `poolDeclares` and a tagged table's `tags` as the tag slot
 * reads them; a state variant's `marks` as the kernel reads them).
 * @param {any} obj @param {string} rel @param {{ needs: string[], excludes: string[], crisis: string[] }} out
 */
function collectCredited(obj, rel, out) {
  for (const p of obj.properties) {
    const name = propName(p.name);
    if (!name || !ts.isPropertyAssignment(p)) continue;
    /** @type {string[]} */ const words = [];
    if (DECL_PROPS.has(name) || name === 'marks' || name === 'tags') collectStrings(p.initializer, words);
    if (name === 'needs') out.needs.push(...words);
    else if (name === 'excludes') out.excludes.push(...words);
    else if (name === 'crisis') for (const w of words) out.crisis.push(...w.replace(/^crisis:\s*/i, '').split(',').map((v) => v.trim()).filter(Boolean).map((v) => CRISIS_KIND_ALIASES[v] || v));
    else if (name === 'poolDeclares') addDecl(out, declarationOfTags(words));
    else if (name === 'marks' && isStateVariant(obj) && KERNEL_POOL_FILE.test(rel)) {
      // as the kernel reads them (`stateProseKernel.js :: variantFactDeclaration` reads the atom marks as the tag slot
      // does; its law 5 reads the family marks through `declarationOfMarks`)
      addDecl(out, declarationOfTags(words)); addDecl(out, declarationOfMarks(words));
    }
    else if (name === 'tags' && Object.prototype.hasOwnProperty.call(TAGGED_TABLE_FILES, rel)) addDecl(out, declarationOfTags(words));
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
 * The declaration around a literal: each DRAWN object literal on the way up (five levels), and, where the literal is
 * an argument of a BUILDER call inside a drawn table, the arrays the builder puts on its row's `needs` / `excludes`.
 * @param {any} node @param {string} rel @param {Map<string, Array<[number, number]>>} drawn @param {Map<string, any>} builders
 */
function declarationAround(node, rel, drawn, builders) {
  const out = emptyDecl();
  let cur = node.parent; let child = node;
  for (let depth = 0; cur && depth < 5; depth++, child = cur, cur = cur.parent) {
    if (ts.isObjectLiteralExpression(cur) && (isDrawn(drawn, rel, cur) || (isStateVariant(cur) && KERNEL_POOL_FILE.test(rel)))) collectCredited(cur, rel, out);
    else if (ts.isCallExpression(cur) && ts.isIdentifier(cur.expression) && builders.has(cur.expression.text) && isDrawn(drawn, rel, cur)) {
      const at = cur.arguments.indexOf(child);
      for (const row of builders.get(cur.expression.text)) {
        if (row.text !== at) continue;
        if (row.needs >= 0 && cur.arguments[row.needs]) collectStrings(cur.arguments[row.needs], out.needs);
        if (row.excludes >= 0 && cur.arguments[row.excludes]) collectStrings(cur.arguments[row.excludes], out.excludes);
      }
    }
    if (ts.isVariableStatement(cur) || ts.isFunctionDeclaration(cur) || ts.isSourceFile(cur)) break;
  }
  return out;
}

/** Is this literal a property NAME (a sibling table's key: its line is declared beside it), or a `twinOf`? */
function isKeyOrTwinOf(node) {
  const p = node.parent;
  if (p && ts.isPropertyAssignment(p) && p.name === node) return true;
  if (p && ts.isPropertyAssignment(p) && ts.isIdentifier(p.name) && p.name.text === 'twinOf') return true;
  return false;
}

/**
 * The TEXT-KEYED declarations of one source text: a DRAWN table whose key is a line's own text and whose value
 * declares it (a sibling set `'<text>': declaredSet(…)` handed to `resolveSibling`). Text → the declaration. Read over
 * the whole tree first, because a line and its declaration may live in two files (`rulingStructure.js` prints what
 * `powerSiblings.js` declares).
 * @param {string} rel @param {string} src @param {Map<string, Array<[number, number]>>} [drawn]
 * @returns {Map<string, { needs: string[], excludes: string[], crisis: string[] }>}
 */
export function keyedDeclarations(rel, src, drawn = drawnRanges([[rel, src]])) {
  const sf = ts.createSourceFile(rel, src, ts.ScriptTarget.Latest, true, ts.ScriptKind.JSX);
  const builders = buildersOf(sf);
  /** @type {Map<string, { needs: string[], excludes: string[], crisis: string[] }>} */ const out = new Map();
  const visit = (n) => {
    if (ts.isPropertyAssignment(n) && (ts.isStringLiteral(n.name) || ts.isNoSubstitutionTemplateLiteral(n.name)) && isDrawn(drawn, rel, n)) {
      const d = emptyDecl();
      const read = (m) => {
        if (ts.isObjectLiteralExpression(m)) {
          // the row that prints the key's own text (an original), not its twin
          const text = m.properties.find((x) => propName(x.name) === 'text');
          if (!text || (ts.isPropertyAssignment(text) && (ts.isStringLiteral(text.initializer) || ts.isNoSubstitutionTemplateLiteral(text.initializer)) && text.initializer.text === n.name.text)) collectCredited(m, rel, d);
        }
        if (ts.isCallExpression(m) && ts.isIdentifier(m.expression) && builders.has(m.expression.text)) {
          for (const row of builders.get(m.expression.text)) {
            const t = m.arguments[row.text];
            if (!t || !(ts.isStringLiteral(t) || ts.isNoSubstitutionTemplateLiteral(t)) || t.text !== n.name.text) continue;
            if (row.needs >= 0 && m.arguments[row.needs]) collectStrings(m.arguments[row.needs], d.needs);
            if (row.excludes >= 0 && m.arguments[row.excludes]) collectStrings(m.arguments[row.excludes], d.excludes);
          }
        }
        ts.forEachChild(m, read);
      };
      read(n.initializer);
      if (d.needs.length || d.excludes.length || d.crisis.length) {
        const prev = out.get(n.name.text) || emptyDecl(); addDecl(prev, d); out.set(n.name.text, prev);
      }
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
 * @param {Map<string, { needs: string[], excludes: string[], crisis: string[] }>} [keyed] the tree's text-keyed declarations (`keyedDeclarations`)
 * @param {Map<string, Array<[number, number]>>} [drawn] the ranges a door draws (`drawnRanges`)
 * @returns {Array<{ file: string, thing: string, text: string }>}
 */
export function scanSource(rel, src, keyed, drawn = drawnRanges([[rel, src]])) {
  if (Object.hasOwn(ARM1_RULE_BOOK, rel)) return [];
  keyed ??= keyedDeclarations(rel, src, drawn);
  const sf = ts.createSourceFile(rel, src, ts.ScriptTarget.Latest, true, ts.ScriptKind.JSX);
  const builders = buildersOf(sf);
  /** @type {Array<{ file: string, thing: string, text: string }>} */ const hits = [];
  const visit = (n) => {
    // a JSX text node is a line written in a component (W2-B-DECLARE item 3: the components are a root); its
    // white space is folded as a browser folds it
    const jsx = ts.isJsxText(n) ? n.text.replace(/\s+/g, ' ').trim() : null;
    const isText = jsx !== null || ts.isStringLiteral(n) || ts.isNoSubstitutionTemplateLiteral(n) || ts.isTemplateHead(n) || ts.isTemplateMiddle(n) || ts.isTemplateTail(n);
    const text = jsx ?? n.text;
    if (isText && text.trim().split(/\s+/).length >= 3 && !isKeyOrTwinOf(n) && !isNotPrintedSite(rel, n)) {
      /** @type {{ needs: string[], excludes: string[], crisis: string[] } | null} */ let declared = null;
      for (const sentence of sentencesOf(text)) {
        const named = [...thingsNamedIn(sentence), ...newWordsNamedIn(sentence)].map((id) => [id, 'names']);
        const denied = [...thingsDeniedIn(sentence), ...newWordsDeniedIn(sentence)].map((id) => [id, 'denies']);
        for (const [thing, side] of [...named, ...denied]) {
          if (!declared) { declared = declarationAround(n, rel, drawn, builders); const k = keyed.get(text); if (k) addDecl(declared, k); }
          if (declarationImplies(thing, declared, side)) continue;
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
  const files = /** @type {Array<[string, string]>} */ (listFiles(root).map((rel) => [rel, readFileSync(join(root, rel), 'utf8')]));
  const drawn = drawnRanges(files);
  /** @type {Map<string, { needs: string[], excludes: string[], crisis: string[] }>} */ const keyed = new Map();
  for (const [rel, src] of files) for (const [k, v] of keyedDeclarations(rel, src, drawn)) { const prev = keyed.get(k) || emptyDecl(); addDecl(prev, v); keyed.set(k, prev); }
  return files.flatMap(([rel, src]) => scanSource(rel, src, keyed, drawn));
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

/** The doors: a `.text` taken off their draw is the door's own, never a strip. */
const STRIP_DOORS = new Set(['drawDeclared', 'filterDeclared', 'resolveDeclared']);
const UNWRAP_FNS = new Set(['textOf', 'lineText']);

/** @param {any} e @returns {any} the expression under parentheses, `as`/satisfies, non-null and `String(…)` */
function bare(e) {
  for (;;) {
    if (ts.isParenthesizedExpression(e) || ts.isAsExpression(e) || ts.isNonNullExpression(e) || (ts.isSatisfiesExpression && ts.isSatisfiesExpression(e))) e = e.expression;
    else if (ts.isCallExpression(e) && ts.isIdentifier(e.expression) && e.expression.text === 'String' && e.arguments.length === 1) e = e.arguments[0];
    else return e;
  }
}

/**
 * How a callback's parameter binds the line: `l` (its name) or `{ text }` / `{ text: t }` (the names the text is bound
 * to). @param {any} name @returns {{ p: string | null, aliases: Set<string> } | null}
 */
function lineBinding(name) {
  if (!name) return null;
  if (ts.isIdentifier(name)) return { p: name.text, aliases: new Set() };
  if (ts.isObjectBindingPattern(name)) {
    const aliases = new Set(name.elements.filter((el) => (el.propertyName || el.name).getText() === 'text' && ts.isIdentifier(el.name)).map((el) => el.name.text));
    return aliases.size ? { p: null, aliases } : null;
  }
  return null;
}

/**
 * Does `e` take the text of the line bound by `b` ANYWHERE in it, wrapped or not (F3 of REVIEW-W2B's second read: a
 * template, `.trim()`, `l && l.text`, a conditional, `[...acc, l.text]`, `String(…)`)? Read: `p.text`, `p?.text`,
 * `p['text']`, a name the text is bound to, `textOf(p)` / `lineText(p)` / a local helper of the same shape. Not read: a
 * nested function, and an object that carries the line whole (`{ ...l, text: … }` keeps its declarations).
 * @param {any} e @param {{ p: string | null, aliases: Set<string> }} b @param {Set<string>} helpers
 */
function takesText(e, b, helpers) {
  let found = false;
  const isP = (/** @type {any} */ x) => !!b.p && ts.isIdentifier(bare(x)) && bare(x).text === b.p;
  const visit = (/** @type {any} */ n) => {
    if (found || ts.isFunctionLike(n)) return;
    if (ts.isObjectLiteralExpression(n) && n.properties.some((pr) => ts.isSpreadAssignment(pr) && isP(pr.expression))) return;
    if (ts.isIdentifier(n) && b.aliases.has(n.text)) {
      const par = n.parent;
      const isName = par && ((ts.isPropertyAccessExpression(par) && par.name === n) || (ts.isPropertyAssignment(par) && par.name === n));
      if (!isName) { found = true; return; }
    }
    if ((ts.isPropertyAccessExpression(n) && n.name.text === 'text' && isP(n.expression))
      || (ts.isElementAccessExpression(n) && ts.isStringLiteralLike(n.argumentExpression) && n.argumentExpression.text === 'text' && isP(n.expression))
      || (ts.isCallExpression(n) && ts.isIdentifier(n.expression) && (UNWRAP_FNS.has(n.expression.text) || helpers.has(n.expression.text))
        && n.arguments.length >= 1 && isP(n.arguments[0]))) { found = true; return; }
    ts.forEachChild(n, visit);
  };
  visit(e);
  return found;
}

/**
 * The expressions a body hands on, outside nested functions: `return`s (`mode` 'return'), or what it pushes, adds or
 * yields (`mode` 'push', a loop's or a `forEach`'s). @param {any} body @param {'return' | 'push'} mode @returns {any[]}
 */
function sinksOf(body, mode) {
  /** @type {any[]} */ const out = [];
  const visit = (/** @type {any} */ n) => {
    if (ts.isFunctionLike(n)) return;
    if (mode === 'return' && ts.isReturnStatement(n) && n.expression) out.push(n.expression);
    if (mode === 'push' && ts.isCallExpression(n) && ts.isPropertyAccessExpression(n.expression) && ['push', 'unshift', 'add'].includes(n.expression.name.text)) out.push(...n.arguments);
    if (mode === 'push' && ts.isYieldExpression(n) && n.expression) out.push(n.expression);
    ts.forEachChild(n, visit);
  };
  visit(body);
  return out;
}

/**
 * The names a block binds to the line's text (`const said = l.text;`), added to the binding, so `return said` reads.
 * @param {any} body @param {{ p: string | null, aliases: Set<string> }} b @param {Set<string>} helpers
 */
function withLocalAliases(body, b, helpers) {
  const out = { p: b.p, aliases: new Set(b.aliases) };
  for (let pass = 0; pass < 2; pass += 1) {
    const visit = (/** @type {any} */ n) => {
      if (ts.isFunctionLike(n)) return;
      if (ts.isVariableDeclaration(n) && ts.isIdentifier(n.name) && n.initializer && takesText(n.initializer, out, helpers)) out.aliases.add(n.name.text);
      ts.forEachChild(n, visit);
    };
    visit(body);
  }
  return out;
}

/**
 * Does a callback (an arrow or a function expression) take the text of its `idx`-th parameter into what it hands on?
 * @param {any} fn @param {number} idx @param {Set<string>} helpers @param {'return' | 'push'} mode
 */
function callbackTakes(fn, idx, helpers, mode) {
  if (!fn || !(ts.isArrowFunction(fn) || ts.isFunctionExpression(fn) || ts.isFunctionDeclaration(fn)) || fn.parameters.length <= idx || !fn.body) return false;
  const b = lineBinding(fn.parameters[idx].name);
  if (!b) return false;
  if (!ts.isBlock(fn.body)) return mode === 'return' ? takesText(fn.body, b, helpers) : sinksOf(fn.body, mode).some((x) => takesText(x, b, helpers));
  const bb = withLocalAliases(fn.body, b, helpers);
  return sinksOf(fn.body, mode).some((x) => takesText(x, bb, helpers));
}

/**
 * Is this `.map` / `.flatMap` / `Array.from` argument an unwrap to text (a callback whose returned expression takes its
 * line's text, `textOf` / `lineText`, or a local helper that does)? @param {any} arg @param {Set<string>} helpers
 */
function isUnwrap(arg, helpers) {
  if (ts.isIdentifier(arg)) return UNWRAP_FNS.has(arg.text) || helpers.has(arg.text);
  return callbackTakes(arg, 0, helpers, 'return');
}

/** The local helpers of a file that unwrap a line (`const getText = (l) => l.text;`, `function getText(l) {…}`). @param {any} sf */
function unwrapHelpers(sf) {
  /** @type {Set<string>} */ const helpers = new Set();
  for (let pass = 0; pass < 2; pass += 1) {
    const visit = (/** @type {any} */ n) => {
      if (ts.isFunctionDeclaration(n) && n.name && callbackTakes(n, 0, helpers, 'return')) helpers.add(n.name.text);
      if (ts.isVariableDeclaration(n) && ts.isIdentifier(n.name) && n.initializer && (ts.isArrowFunction(n.initializer) || ts.isFunctionExpression(n.initializer))
        && callbackTakes(n.initializer, 0, helpers, 'return')) helpers.add(n.name.text);
      ts.forEachChild(n, visit);
    };
    visit(sf);
  }
  return helpers;
}

/**
 * The strip-shaped calls of one source text: `{ file, receiver }`, the receiver's source text (whitespace
 * folded, its first 100 characters) being the site's identity. The shapes (F5; F3 of the second read): `R.map(unwrap)` /
 * `R.flatMap(unwrap)` with any extra argument (`map(textOf, ctx)`); `Array.from(R, unwrap)`; `R.reduce(fn)` whose
 * returned expression takes its line's text; `R.forEach(fn)` and `for (const l of R)` that push, add or yield it;
 * `for (let i …) … push(R[i].text)`; and `pick(R).text`, a `.text` taken off any call but a door's, whose first argument
 * is the receiver. An unwrap is any member access `text` of the line in the handed-on expression, wrapped or not.
 * @param {string} rel @param {string} src @returns {Array<{ file: string, receiver: string }>}
 */
export function stripSites(rel, src) {
  const sf = ts.createSourceFile(rel, src, ts.ScriptTarget.Latest, true, ts.ScriptKind.JSX);
  const helpers = unwrapHelpers(sf);
  /** @type {Array<{ file: string, receiver: string }>} */ const out = [];
  const text = (/** @type {any} */ n) => n.getText(sf).replace(/\s+/g, ' ').slice(0, 100);
  const method = (/** @type {any} */ n) => (ts.isCallExpression(n) && ts.isPropertyAccessExpression(n.expression) ? n.expression.name.text : '');
  const visit = (/** @type {any} */ n) => {
    const m = method(n);
    if (['map', 'flatMap'].includes(m) && n.arguments.length >= 1 && isUnwrap(n.arguments[0], helpers)) {
      out.push({ file: rel, receiver: text(n.expression.expression) });
    } else if (m === 'from' && ts.isIdentifier(n.expression.expression) && n.expression.expression.text === 'Array' && n.arguments.length >= 2 && isUnwrap(n.arguments[1], helpers)) {
      out.push({ file: rel, receiver: text(n.arguments[0]) });
    } else if (['reduce', 'reduceRight'].includes(m) && n.arguments.length >= 1 && callbackTakes(n.arguments[0], 1, helpers, 'return')) {
      out.push({ file: rel, receiver: text(n.expression.expression) });
    } else if (m === 'forEach' && n.arguments.length >= 1 && callbackTakes(n.arguments[0], 0, helpers, 'push')) {
      out.push({ file: rel, receiver: text(n.expression.expression) });
    } else if (ts.isForOfStatement(n) && ts.isVariableDeclarationList(n.initializer) && n.initializer.declarations.length === 1) {
      const b = lineBinding(n.initializer.declarations[0].name);
      if (b) {
        const bb = withLocalAliases(n.statement, b, helpers);
        if (sinksOf(n.statement, 'push').some((x) => takesText(x, bb, helpers))) out.push({ file: rel, receiver: text(n.expression) });
      }
    } else if (ts.isForStatement(n) && n.initializer && ts.isVariableDeclarationList(n.initializer) && n.initializer.declarations.length === 1
      && ts.isIdentifier(n.initializer.declarations[0].name)) {
      const i = n.initializer.declarations[0].name.text;
      /** @type {any} */ let recv = null;
      const inner = (/** @type {any} */ x) => {
        if (recv || ts.isFunctionLike(x)) return;
        if (ts.isPropertyAccessExpression(x) && x.name.text === 'text' && ts.isElementAccessExpression(bare(x.expression))
          && ts.isIdentifier(bare(x.expression).argumentExpression) && bare(x.expression).argumentExpression.text === i) { recv = bare(x.expression).expression; return; }
        ts.forEachChild(x, inner);
      };
      for (const sink of sinksOf(n.statement, 'push')) inner(sink);
      if (recv) out.push({ file: rel, receiver: text(recv) });
    } else if (ts.isPropertyAccessExpression(n) && n.name.text === 'text' && ts.isCallExpression(bare(n.expression))) {
      const call = bare(n.expression);
      const callee = ts.isIdentifier(call.expression) ? call.expression.text : ts.isPropertyAccessExpression(call.expression) ? call.expression.name.text : '';
      if (call.arguments.length >= 1 && callee && !STRIP_DOORS.has(callee) && !UNWRAP_FNS.has(callee)
        && (ts.isIdentifier(call.arguments[0]) || ts.isArrayLiteralExpression(call.arguments[0]) || ts.isPropertyAccessExpression(call.arguments[0]))) {
        out.push({ file: rel, receiver: text(call.arguments[0]) });
      }
    }
    ts.forEachChild(n, visit);
  };
  visit(sf);
  return out;
}

/**
 * F5 (the third seat; REVIEW-W2B: "its key lets a new strip on an already-banked receiver pass"): a file's sites COUNT
 * PER RECEIVER — the first site of a receiver keeps its receiver, the n-th is `receiver #n` — so a second strip of a
 * banked receiver is a fresh key and reds. @param {Array<{ file: string, receiver: string }>} sites
 * @returns {Array<{ file: string, receiver: string }>}
 */
export function withOrdinals(sites) {
  /** @type {Map<string, number>} */ const seen = new Map();
  return sites.map((x) => { const k = stripKey(x.file, x.receiver); const n = (seen.get(k) || 0) + 1; seen.set(k, n); return n === 1 ? x : { ...x, receiver: `${x.receiver} #${n}` }; });
}

/** @param {string} root @returns {Array<{ file: string, receiver: string }>} every strip-shaped call under STRIP_ROOTS, counted per receiver */
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
  return withOrdinals(files.flatMap((rel) => stripSites(rel, readFileSync(join(root, rel), 'utf8'))));
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
