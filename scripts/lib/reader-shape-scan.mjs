/**
 * reader-shape-scan.mjs — THE READER SIDE of the reader-with-no-writer walker.
 *
 * Given the EXECUTED key census (scripts/lib/observed-shape-corpus.mjs), this
 * resolves each property read in `src/` to the record SHAPE its receiver holds,
 * and reports every read whose key no run of the real producers ever wrote.
 *
 * ── WHY A RESOLVER AND NOT A REGEX ─────────────────────────────────────────
 * The class needs SHAPE attribution, and the three ground-truth defects prove a
 * name-matching scanner cannot supply it. `faction?.id` (rulingPower.js) names
 * its shape; `governing.id` (warSeatBooks.js) does not — `governing` comes back
 * from `governingFactionOf`, two modules away; `satellite.foundingTier`
 * (lineageMemberBirth.js) is a DESTRUCTURED PARAMETER whose only shape evidence
 * is its call site, one module away, through an array the ledger reader built.
 * Anything less than a resolver misses two of the three.
 *
 * Resolution is DELIBERATELY PARTIAL AND SILENT. A receiver that does not
 * resolve yields no finding: this walker never guesses. That is the honest
 * trade — coverage is bounded by the resolver, and the resolver's reach is
 * measured (`stats.resolved` / `stats.unresolved`) rather than claimed.
 *
 * ── THE RULES, AND WHERE EACH ONE IS LOAD-BEARING ───────────────────────────
 *   member access `X.p`      → shape `p` when `p` names an observed container
 *   element access `X[e]`    → X's element shape (arrays and id-keyed maps alike)
 *   alias `const y = <e>`    → e's shape
 *   `a ? b : c`, `||`,`&&`,`??` → the union of the arms (this is what carries
 *                              `Array.isArray(ps.factions) ? ps.factions : []`)
 *   `[a, b, c]`              → the union of the elements (TCD-2's three probed
 *                              containers arrive as one array literal)
 *   `{...x, k: v}`           → x's shape (TCD-3's `{ ...rec, backing01 }`)
 *   `arr.find/filter/at/…`   → arr's element shape
 *   `arr.map(cb)`            → cb's return shape
 *   callback / for-of params → the receiver's element shape
 *   `f(...)`                 → f's return shape, resolved into the DECLARING
 *                              module (local or one import hop, to a fixed
 *                              point). Identity wrappers (`asObject`) fall out
 *                              of this automatically via param sentinels.
 *   parameters               → the union of the arguments at f's CALL SITES,
 *                              including one property of a destructured object
 *                              parameter. This is the hop TCD-3 needs.
 *
 * ── ARRAYNESS IS TRACKED, AND THAT IS NOT COSMETIC ──────────────────────────
 * A shape token carries `[]` when the corpus observed that container as an
 * array. Reads on an ARRAY token are never findings — otherwise every
 * `factions.map(...)` and `.length` in the estate would be reported as a key no
 * writer produces, which is precisely the false-positive flood that gets a
 * walker turned off.
 *
 * ── KNOWN EVASIONS, RECORDED RATHER THAN HIDDEN ─────────────────────────────
 * These are accepted costs of a bounded resolver, not oversights:
 *   • computed reads (`row[key]`) are invisible — the key is not a literal;
 *   • a receiver crossing a boundary the rules above do not model (a Map value,
 *     a JSON round trip, a re-export chain deeper than the fixed point) stays
 *     unresolved and is silently skipped;
 *   • a function whose parameters have NO call site in `src/` (an entry point
 *     called only from tests or the app shell) cannot have its params resolved;
 *   • the builtin-member list below is language surface, not domain data: a
 *     domain key that collides with it (`name`… no; `length`, `map`, `filter`…)
 *     would be skipped. Nothing in the measured corpus collides.
 */
import ts from 'typescript';
import { readFileSync } from 'node:fs';
import { dirname, resolve as resolvePath } from 'node:path';

/** Object/array/string/function surface — skipped so array and prototype reads
 *  are never mistaken for domain keys. Language surface, not domain data. */
const BUILTIN_MEMBERS = new Set([
  'length', 'map', 'filter', 'find', 'findIndex', 'findLast', 'findLastIndex', 'forEach',
  'reduce', 'reduceRight', 'some', 'every', 'slice', 'splice', 'concat', 'join', 'sort',
  'reverse', 'includes', 'indexOf', 'lastIndexOf', 'flat', 'flatMap', 'push', 'pop',
  'shift', 'unshift', 'at', 'fill', 'keys', 'values', 'entries', 'toString', 'valueOf',
  'hasOwnProperty', 'constructor', 'then', 'catch', 'finally', 'call', 'apply', 'bind',
  'trim', 'split', 'replace', 'replaceAll', 'toLowerCase', 'toUpperCase', 'startsWith',
  'endsWith', 'padStart', 'padEnd', 'repeat', 'match', 'matchAll', 'charAt', 'charCodeAt',
  'codePointAt', 'normalize', 'localeCompare', 'substring', 'substr', 'size', 'get', 'set',
  'has', 'add', 'delete', 'clear', 'add', 'toFixed', 'prototype', 'default',
]);

/** Array methods that hand the callback ONE ELEMENT of the receiver. */
const ELEMENT_CB_METHODS = new Set(['map', 'filter', 'find', 'findLast', 'forEach', 'some', 'every', 'flatMap', 'sort']);
/** Array methods whose RESULT is the receiver's element. */
const ELEMENT_RESULT_METHODS = new Set(['find', 'findLast', 'at', 'pop', 'shift']);
/** Array methods whose RESULT is the receiver itself (still an array). */
const ARRAY_RESULT_METHODS = new Set(['filter', 'sort', 'slice', 'concat', 'reverse', 'flat']);

const ARR = '[]';
const asArray = (t) => (t.endsWith(ARR) ? t : t + ARR);
const asElem = (t) => (t.endsWith(ARR) ? t.slice(0, -ARR.length) : t);
const isArrayToken = (t) => t.endsWith(ARR);

/** @param {string} file @returns {ts.SourceFile} */
function parse(file) {
  return ts.createSourceFile(
    file, readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true,
    file.endsWith('.jsx') ? ts.ScriptKind.JSX : ts.ScriptKind.JS,
  );
}

const unwrap = (n) => {
  let cur = n;
  for (;;) {
    if (ts.isParenthesizedExpression(cur) || ts.isAsExpression(cur) || ts.isNonNullExpression(cur)
      || ts.isTypeAssertionExpression?.(cur) || ts.isSatisfiesExpression?.(cur)) { cur = cur.expression; continue; }
    return cur;
  }
};

/** Nearest enclosing scope node (source file, function-like, block, for-of). */
function scopeOf(node) {
  let cur = node.parent;
  while (cur) {
    if (ts.isSourceFile(cur) || ts.isBlock(cur) || ts.isFunctionLike(cur) || ts.isForOfStatement(cur)
      || ts.isForStatement(cur) || ts.isCaseBlock(cur)) return cur;
    cur = cur.parent;
  }
  return null;
}

/**
 * Build the whole-tree index: parsed files, per-file scope→binding maps, import
 * maps, declared functions, and the call-site index parameters resolve through.
 * @param {string[]} files absolute paths
 */
export function buildIndex(files) {
  /** @type {Map<string, ts.SourceFile>} */
  const sources = new Map();
  for (const f of files) { try { sources.set(f, parse(f)); } catch { /* unparsable: skipped */ } }

  /** @type {Map<string, Map<string, {file:string, name:string}>>} */
  const imports = new Map();
  /** @type {Map<string, Map<string, ts.Node>>} */
  const declaredFns = new Map();
  /** @type {Map<ts.Node, Map<string, object>>} */
  const bindings = new Map();
  /** @type {Map<ts.Node, {file:string, args:ts.Node[]}[]>} */
  const callSites = new Map();
  /** @type {Map<string, Map<string, {file:string, name:string}>>} */
  const reExports = new Map();

  const bind = (node, name, info) => {
    const sc = scopeOf(node) || sources.get(node.getSourceFile().fileName);
    if (!sc) return;
    let m = bindings.get(sc);
    if (!m) { m = new Map(); bindings.set(sc, m); }
    if (!m.has(name)) m.set(name, info);
  };

  const resolveSpec = (file, spec) => {
    if (!spec.startsWith('.')) return null;
    const abs = resolvePath(dirname(file), spec);
    return sources.has(abs) ? abs : null;
  };

  for (const [file, sf] of sources) {
    const imp = new Map();
    const fns = new Map();
    imports.set(file, imp);
    declaredFns.set(file, fns);
    const rex = new Map();
    reExports.set(file, rex);

    const visit = (node) => {
      if (ts.isImportDeclaration(node) && ts.isStringLiteral(node.moduleSpecifier)) {
        const target = resolveSpec(file, node.moduleSpecifier.text);
        const clause = node.importClause;
        if (target && clause?.namedBindings && ts.isNamedImports(clause.namedBindings)) {
          for (const el of clause.namedBindings.elements) {
            imp.set(el.name.text, { file: target, name: (el.propertyName || el.name).text });
          }
        }
      }
      if (ts.isExportDeclaration(node) && node.moduleSpecifier && ts.isStringLiteral(node.moduleSpecifier)) {
        const target = resolveSpec(file, node.moduleSpecifier.text);
        if (target && node.exportClause && ts.isNamedExports(node.exportClause)) {
          for (const el of node.exportClause.elements) {
            rex.set(el.name.text, { file: target, name: (el.propertyName || el.name).text });
          }
        }
      }
      if (ts.isFunctionDeclaration(node) && node.name) fns.set(node.name.text, node);
      if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name)) {
        const init = node.initializer ? unwrap(node.initializer) : null;
        if (init && (ts.isArrowFunction(init) || ts.isFunctionExpression(init))) fns.set(node.name.text, init);
        else if (node.initializer) bind(node, node.name.text, { k: 'expr', node: node.initializer, file });
      }
      if (ts.isForOfStatement(node)) {
        const d = node.initializer;
        if (ts.isVariableDeclarationList(d) && d.declarations.length === 1 && ts.isIdentifier(d.declarations[0].name)) {
          bind(d.declarations[0], d.declarations[0].name.text, { k: 'elem', node: node.expression, file });
        }
      }
      if (ts.isFunctionLike(node) && node.parameters) {
        // A function used as an array-method callback takes ONE element.
        let cbArray = null;
        const p = node.parent;
        if (p && ts.isCallExpression(p) && p.arguments[0] === node
          && ts.isPropertyAccessExpression(p.expression) && ELEMENT_CB_METHODS.has(p.expression.name.text)) {
          cbArray = p.expression.expression;
        }
        node.parameters.forEach((param, index) => {
          if (ts.isIdentifier(param.name)) {
            if (cbArray && index === 0) bind(param, param.name.text, { k: 'elem', node: cbArray, file });
            else bind(param, param.name.text, { k: 'param', fn: node, index, file });
          } else if (ts.isObjectBindingPattern(param.name)) {
            for (const el of param.name.elements) {
              if (!ts.isIdentifier(el.name) || el.dotDotDotToken) continue;
              const prop = (el.propertyName && ts.isIdentifier(el.propertyName) ? el.propertyName.text : el.name.text);
              bind(param, el.name.text, { k: 'param', fn: node, index, prop, file });
            }
          }
        });
      }
      ts.forEachChild(node, visit);
    };
    visit(sf);
  }

  // Call-site index — built after every declaration is known.
  const lookupFn = (file, name, hops = 0) => {
    if (hops > 6) return null;
    const local = declaredFns.get(file)?.get(name);
    if (local) return { fn: local, file };
    const im = imports.get(file)?.get(name);
    if (im) return lookupFn(im.file, im.name, hops + 1);
    const rx = reExports.get(file)?.get(name);
    if (rx) return lookupFn(rx.file, rx.name, hops + 1);
    return null;
  };

  for (const [file, sf] of sources) {
    const visit = (node) => {
      if (ts.isCallExpression(node)) {
        const callee = unwrap(node.expression);
        if (ts.isIdentifier(callee)) {
          const target = lookupFn(file, callee.text);
          if (target) {
            let list = callSites.get(target.fn);
            if (!list) { list = []; callSites.set(target.fn, list); }
            if (list.length < 40) list.push({ file, args: [...node.arguments] });
          }
        }
      }
      ts.forEachChild(node, visit);
    };
    visit(sf);
  }

  return { sources, imports, declaredFns, bindings, callSites, reExports, lookupFn };
}

/**
 * @param {object} idx from buildIndex
 * @param {Record<string, {rows:number, keys:string[]}>} shapes the EXECUTED corpus
 * @param {string[]} arrayShapes shape names observed as arrays
 * @param {number} minRows a shape seen fewer times than this is too thin to judge against
 */
export function makeResolver(idx, shapes, arrayShapes, minRows, singleHome = [], rootShapes = []) {
  const arraySet = new Set(arrayShapes);
  const known = new Set(Object.keys(shapes).filter((n) => shapes[n].rows >= minRows));
  const unique = new Set(singleHome.filter((n) => known.has(n)));
  const roots = new Set(rootShapes.filter((n) => known.has(n)));
  const token = (name) => (arraySet.has(name) ? asArray(name) : name);

  const memoFn = new Map();
  const memoParam = new Map();
  const inFlight = new Set();
  const EMPTY = new Set();
  /** Functions whose RETURN is currently being analysed, mapped to their own
   *  parameter sentinels. Without this frame a wrapper's parameter resolves to
   *  the union of EVERY call site in the estate, so `asObject(npc).category`
   *  arrives carrying four unrelated shapes and mints a finding against all of
   *  them (measured, 2026-08-07). Inside a return analysis a parameter stands
   *  for its ARGUMENT, and only the caller may fill it in. */
  const sentinelFrames = new Map();

  const lookupBinding = (id) => {
    for (let sc = scopeOf(id); sc; sc = scopeOf(sc)) {
      const hit = idx.bindings.get(sc)?.get(id.text);
      if (hit) return hit;
    }
    return null;
  };

  /** @returns {Set<string>} shape tokens */
  function resolve(node, file, depth = 0) {
    if (!node || depth > 24) return EMPTY;
    const n = unwrap(node);

    if (ts.isIdentifier(n)) {
      const b = lookupBinding(n);
      let viaBinding = EMPTY;
      if (b && b.k === 'param' && sentinelFrames.has(b.fn)) {
        const s = sentinelFrames.get(b.fn).get(n.text);
        return s ? new Set([s]) : EMPTY;
      }
      if (b) {
        const key = `${b.k}:${b.file}:${b.node ? b.node.pos : b.fn.pos}:${b.index ?? ''}:${b.prop ?? ''}`;
        if (inFlight.has(key)) return EMPTY;
        inFlight.add(key);
        try {
          if (b.k === 'expr') viaBinding = resolve(b.node, b.file, depth + 1);
          else if (b.k === 'elem') {
            viaBinding = new Set();
            for (const t of resolve(b.node, b.file, depth + 1)) viaBinding.add(asElem(t));
          } else if (b.k === 'param') viaBinding = resolveParam(b, depth + 1);
        } finally { inFlight.delete(key); }
      }
      if (viaBinding.size) return viaBinding;
      // ROOT NAME PRIOR, last resort only: a variable the rules above could not
      // follow whose identifier IS one of the corpus walk's ROOTS (`settlement`,
      // `worldState`, `save`, `campaign`). Deliberately EXACT and deliberately
      // narrow. Widening it to every container name binds `window`, `raw`,
      // `plan` and `outcome` to unrelated shapes; adding singular/plural
      // morphology binds `satellite` to the parent-keyed satellites MAP and
      // mints a false finding for every real SatelliteRecord read.
      return roots.has(n.text) ? new Set([token(n.text)]) : EMPTY;
    }

    if (ts.isPropertyAccessExpression(n)) {
      const p = n.name.text;
      if (!known.has(p)) return EMPTY;
      // A receiver that resolved only to PARAMETER SENTINELS is symbolic, not
      // grounded: the shape it will hold depends on a call site the caller
      // substitutes later. Treating it as grounded checked `shapes['@param0']`,
      // found nothing, and silently killed the whole satellites chain — which is
      // how TCD-3 escaped the first spelling of this scanner.
      const recv = new Set([...resolve(n.expression, file, depth + 1)].filter((t) => !t.startsWith('@param')));
      if (recv.size) {
        // GROUNDED: the receiver resolved, so `p` must be a key it was observed
        // carrying. This is what keeps `command.params.plan` from binding to the
        // corpus's unrelated `plan`.
        return [...recv].some((t) => shapes[asElem(t)]?.keys.includes(p)) ? new Set([token(p)]) : EMPTY;
      }
      // UNGROUNDED: only a name with exactly one home in the corpus is
      // unambiguous enough to bind (`entry.steadings` — the hop TCD-3 needs,
      // where the ledger arrives through a string-keyed spatial read no static
      // rule can follow).
      return unique.has(p) ? new Set([token(p)]) : EMPTY;
    }

    if (ts.isElementAccessExpression(n)) {
      const arg = unwrap(n.argumentExpression);
      if (ts.isStringLiteral(arg) && known.has(arg.text)) return new Set([token(arg.text)]);
      const out = new Set();
      for (const t of resolve(n.expression, file, depth + 1)) out.add(asElem(t));
      return out;
    }

    if (ts.isBinaryExpression(n)) {
      const op = n.operatorToken.kind;
      if (op === ts.SyntaxKind.BarBarToken || op === ts.SyntaxKind.AmpersandAmpersandToken
        || op === ts.SyntaxKind.QuestionQuestionToken) {
        return union(resolve(n.left, file, depth + 1), resolve(n.right, file, depth + 1));
      }
      return EMPTY;
    }

    if (ts.isConditionalExpression(n)) {
      return union(resolve(n.whenTrue, file, depth + 1), resolve(n.whenFalse, file, depth + 1));
    }

    if (ts.isArrayLiteralExpression(n)) {
      let out = EMPTY;
      for (const el of n.elements) out = union(out, resolve(el, file, depth + 1));
      return out;
    }

    if (ts.isObjectLiteralExpression(n)) {
      let out = EMPTY;
      for (const p of n.properties) {
        if (ts.isSpreadAssignment(p)) out = union(out, resolve(p.expression, file, depth + 1));
      }
      return out;
    }

    if (ts.isCallExpression(n)) return resolveCall(n, file, depth + 1);

    return EMPTY;
  }

  function resolveCall(call, file, depth) {
    const callee = unwrap(call.expression);
    if (ts.isPropertyAccessExpression(callee)) {
      const m = callee.name.text;
      if (m === 'map' || m === 'flatMap') {
        const cb = call.arguments[0] ? unwrap(call.arguments[0]) : null;
        if (cb && (ts.isArrowFunction(cb) || ts.isFunctionExpression(cb))) {
          const out = new Set();
          for (const t of returnsOf(cb, file, depth)) out.add(asArray(t));
          return out;
        }
        return EMPTY;
      }
      if (ELEMENT_RESULT_METHODS.has(m)) {
        const out = new Set();
        for (const t of resolve(callee.expression, file, depth)) out.add(asElem(t));
        return out;
      }
      if (ARRAY_RESULT_METHODS.has(m)) {
        const out = new Set();
        for (const t of resolve(callee.expression, file, depth)) out.add(asArray(t));
        return out;
      }
      if (ts.isIdentifier(callee.expression) && callee.expression.text === 'Object'
        && (m === 'values' || m === 'assign')) {
        let out = EMPTY;
        for (const a of call.arguments) out = union(out, resolve(a, file, depth));
        const arr = new Set();
        for (const t of out) arr.add(m === 'values' ? asArray(t) : t);
        return arr;
      }
      return EMPTY;
    }
    if (!ts.isIdentifier(callee)) return EMPTY;
    const target = idx.lookupFn(file, callee.text);
    if (!target) return EMPTY;
    const raw = fnReturns(target.fn, target.file, depth);
    if (!raw.size) return EMPTY;
    // Resolve parameter sentinels against THIS call's arguments.
    const out = new Set();
    for (const t of raw) {
      const m = /^@param(\d+)(\[\])?$/.exec(t);
      if (!m) { out.add(t); continue; }
      const arg = call.arguments[Number(m[1])];
      if (!arg) continue;
      for (const at of resolve(arg, file, depth + 1)) out.add(m[2] ? asArray(at) : at);
    }
    return out;
  }

  /** All shapes a function-like node's `return` expressions resolve to, with its
   *  own parameters standing in as `@paramN` sentinels the caller substitutes. */
  function fnReturns(fn, file, depth) {
    if (memoFn.has(fn)) return memoFn.get(fn);
    if (inFlight.has(fn)) return EMPTY;
    inFlight.add(fn);
    memoFn.set(fn, EMPTY);
    try {
      const sentinels = new Map();
      fn.parameters?.forEach((p, i) => { if (ts.isIdentifier(p.name)) sentinels.set(p.name.text, `@param${i}`); });
      sentinelFrames.set(fn, sentinels);
      const out = returnsOf(fn, file, depth, sentinels);
      memoFn.set(fn, out);
      return out;
    } finally { inFlight.delete(fn); sentinelFrames.delete(fn); }
  }

  function returnsOf(fn, file, depth, sentinels = null) {
    const exprs = [];
    if (ts.isArrowFunction(fn) && fn.body && !ts.isBlock(fn.body)) exprs.push(fn.body);
    else {
      const visit = (node) => {
        if (ts.isFunctionLike(node) && node !== fn) return;
        if (ts.isReturnStatement(node) && node.expression) exprs.push(node.expression);
        ts.forEachChild(node, visit);
      };
      if (fn.body) visit(fn.body);
    }
    let out = EMPTY;
    for (const e of exprs) {
      if (sentinels) {
        const u = unwrap(e);
        if (ts.isIdentifier(u) && sentinels.has(u.text)) { out = union(out, new Set([sentinels.get(u.text)])); continue; }
      }
      out = union(out, resolve(e, file, depth + 1));
      if (out.size > 6) break;
    }
    return out;
  }

  /** A parameter's shape is the union of the ARGUMENTS at its call sites — the
   *  hop `satellite.foundingTier` needs, since its only evidence is one module
   *  away in settlementLifecycleKernel's `satellite: next`. */
  function resolveParam(b, depth) {
    // Node positions restart in every source file. Without the file identity,
    // unrelated same-offset functions share one cached parameter shape.
    const key = `${b.file}:${b.fn.pos}:${b.index}:${b.prop ?? ''}`;
    if (memoParam.has(key)) return memoParam.get(key);
    memoParam.set(key, EMPTY);
    const sites = idx.callSites.get(b.fn) || [];
    let out = EMPTY;
    for (const site of sites) {
      const arg = site.args[b.index];
      if (!arg) continue;
      if (b.prop) {
        const a = unwrap(arg);
        if (!ts.isObjectLiteralExpression(a)) continue;
        for (const p of a.properties) {
          if (ts.isPropertyAssignment(p) && ts.isIdentifier(p.name) && p.name.text === b.prop) {
            out = union(out, resolve(p.initializer, site.file, depth + 1));
          } else if (ts.isShorthandPropertyAssignment(p) && p.name.text === b.prop) {
            out = union(out, resolve(p.name, site.file, depth + 1));
          }
        }
      } else {
        out = union(out, resolve(arg, site.file, depth + 1));
      }
      if (out.size > 4) break;
    }
    memoParam.set(key, out);
    return out;
  }

  return { resolve, known, token };
}

function union(a, b) {
  if (!a.size) return b;
  if (!b.size) return a;
  const out = new Set(a);
  for (const x of b) out.add(x);
  return out;
}

/** True when this property access is the TARGET of a write, not a read. */
function isWriteTarget(node) {
  const p = node.parent;
  if (!p) return false;
  if (ts.isBinaryExpression(p) && p.left === node) {
    const k = p.operatorToken.kind;
    return k === ts.SyntaxKind.EqualsToken || (k >= ts.SyntaxKind.FirstCompoundAssignment && k <= ts.SyntaxKind.LastCompoundAssignment);
  }
  if (ts.isDeleteExpression(p)) return true;
  if ((ts.isPrefixUnaryExpression(p) || ts.isPostfixUnaryExpression(p)) && p.operand === node) return true;
  return false;
}

/**
 * Scan every property read in `files` against the executed corpus.
 * @returns {{ findings: object[], stats: object }}
 */
export function scanReaders({ files, shapes, arrayShapes, singleHome, rootShapes, minRows = 8, root }) {
  const idx = buildIndex(files);
  const { resolve, known } = makeResolver(idx, shapes, arrayShapes, minRows, singleHome, rootShapes);
  const findings = [];
  let reads = 0;
  let resolved = 0;

  for (const [file, sf] of idx.sources) {
    const rel = file.startsWith(root) ? file.slice(root.length + 1).split('\\').join('/') : file;
    const visit = (node) => {
      if (ts.isPropertyAccessExpression(node) && ts.isIdentifier(node.name)) {
        const key = node.name.text;
        if (!BUILTIN_MEMBERS.has(key) && !isWriteTarget(node)) {
          reads += 1;
          const tokens = resolve(node.expression, file);
          if (tokens.size) {
            resolved += 1;
            const objects = [...tokens].filter((t) => !isArrayToken(t) && known.has(t));
            // EXACTLY ONE shape. An ambiguous receiver is not evidence: a union
            // of unrelated shapes trivially fails to contain any key, so a
            // multi-shape resolution would mint a finding for every read it
            // could not pin down — the inverse of what this walker is for.
            if (objects.length === 1 && !shapes[objects[0]].keys.includes(key)) {
              const { line } = sf.getLineAndCharacterOfPosition(node.name.getStart(sf));
              findings.push({
                file: rel, line: line + 1, key, shapes: objects.sort(),
                text: node.getText(sf).slice(0, 80).replace(/\s+/g, ' '),
              });
            }
          }
        }
      }
      ts.forEachChild(node, visit);
    };
    visit(sf);
  }
  findings.sort((a, b) => (a.file.localeCompare(b.file) || a.line - b.line || a.key.localeCompare(b.key)));
  return { findings, stats: { files: idx.sources.size, reads, resolved, unresolved: reads - resolved } };
}
