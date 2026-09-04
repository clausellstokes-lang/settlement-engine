/* eslint-disable */
// lane VACUITY — read-only AST scan for assertions that cannot fail.
// Runs from inside the read tree so @babel/parser resolves. Writes JSON to stdout.
const fs = require('fs');
const path = require('path');
const parser = require(process.env.SF_TREE + '/node_modules/@babel/parser');

const ROOT = process.argv[2];
const FILES = fs.readFileSync(process.argv[3], 'utf8').split('\n').filter(Boolean);

const PARSE_OPTS = {
  sourceType: 'module',
  allowReturnOutsideFunction: true,
  allowAwaitOutsideFunction: true,
  errorRecovery: true,
  plugins: ['jsx', 'typescript', 'importAssertions', 'topLevelAwait'],
};

function parseFile(code) {
  return parser.parse(code, PARSE_OPTS);
}
function parseExpr(src) {
  const ast = parser.parse(`(${src})`, PARSE_OPTS);
  return ast.program.body[0].expression;
}

// ---------- generic walker ----------
function walk(node, visit, parent = null) {
  if (!node || typeof node !== 'object') return;
  if (Array.isArray(node)) { for (const n of node) walk(n, visit, parent); return; }
  if (typeof node.type !== 'string') return;
  visit(node, parent);
  for (const k of Object.keys(node)) {
    if (k === 'loc' || k === 'leadingComments' || k === 'trailingComments' || k === 'innerComments' || k === 'extra') continue;
    walk(node[k], visit, node);
  }
}

const norm = (s) => s.replace(/\s+/g, ' ').trim();

// ---------- reduction engine ----------
// Repeatedly rewrites an expression source string by:
//   * inlining single-expression local arrow helpers  f(a) -> body[a/param]
//   * inlining unambiguous local const bindings       NAME -> init
//   * folding a numeric index over an array literal   [x, ...y][0] -> x
// Sound modulo nondeterminism / intervening mutation, which is why every hit is hand-checked.
const INLINE_CONSTS = process.env.VAC_INLINE_CONSTS === '1';
const MAX_DEPTH = 10;
const MAX_LEN = 4000;

function buildScopeMaps(ast, code) {
  const consts = new Map();   // name -> {src, count, isArrowExprBody, params, bodySrc}
  // Any name that is ever reassigned or ++/--'d is NOT a stable binding and must never
  // be inlined: `let fired = false; for (...) fired = true; expect(fired).toBe(false)`
  // is a live assertion, not a tautology.
  const reassigned = new Set();
  walk(ast, (n) => {
    if (n.type === 'AssignmentExpression' && n.left.type === 'Identifier') reassigned.add(n.left.name);
    if (n.type === 'UpdateExpression' && n.argument.type === 'Identifier') reassigned.add(n.argument.name);
    if (n.type === 'AssignmentExpression' && n.left.type === 'MemberExpression') {
      let o = n.left.object; while (o && o.type === 'MemberExpression') o = o.object;
      if (o && o.type === 'Identifier') reassigned.add(o.name);
    }
  });
  walk(ast, (n, par) => {
    if (n.type !== 'VariableDeclarator' || !n.init) return;
    if (n.id.type !== 'Identifier') return;
    if (par && par.type === 'VariableDeclaration' && par.kind !== 'const') { consts.set(n.id.name, { ambiguous: true }); return; }
    if (reassigned.has(n.id.name)) { consts.set(n.id.name, { ambiguous: true }); return; }
    const name = n.id.name;
    const initSrc = code.slice(n.init.start, n.init.end);
    const prev = consts.get(name);
    if (prev) { prev.count += 1; if (prev.src !== initSrc) prev.ambiguous = true; return; }
    const rec = { src: initSrc, count: 1, ambiguous: false, node: n.init };
    if ((n.init.type === 'ArrowFunctionExpression' || n.init.type === 'FunctionExpression')
        && n.init.body && n.init.body.type !== 'BlockStatement'
        && n.init.params.every((p) => p.type === 'Identifier')) {
      rec.isArrowExprBody = true;
      rec.params = n.init.params.map((p) => p.name);
      rec.bodySrc = code.slice(n.init.body.start, n.init.body.end);
      rec.bodyNode = n.init.body;
    }
    consts.set(name, rec);
  });
  // function declarations with a single return statement
  walk(ast, (n) => {
    if (n.type !== 'FunctionDeclaration' || !n.id) return;
    const body = n.body && n.body.body;
    if (!body || body.length !== 1 || body[0].type !== 'ReturnStatement' || !body[0].argument) return;
    if (!n.params.every((p) => p.type === 'Identifier')) return;
    const name = n.id.name;
    if (consts.has(name)) { consts.get(name).ambiguous = true; return; }
    consts.set(name, {
      src: null, count: 1, ambiguous: false,
      isArrowExprBody: true,
      params: n.params.map((p) => p.name),
      bodySrc: code.slice(body[0].argument.start, body[0].argument.end),
    });
  });
  return consts;
}

// substitute param identifiers inside a helper body with the argument sources
function substitute(bodySrc, params, argSrcs) {
  if (params.length === 0) return bodySrc;
  let body;
  try { body = parseExpr(bodySrc); } catch { return null; }
  const edits = [];
  const OFFSET = 1; // for the wrapping paren in parseExpr
  walk(body, (n, parent) => {
    if (n.type !== 'Identifier') return;
    const i = params.indexOf(n.name);
    if (i === -1) return;
    // skip non-computed member property, object literal key, etc.
    if (parent && parent.type === 'MemberExpression' && parent.property === n && !parent.computed) return;
    if (parent && (parent.type === 'ObjectProperty' || parent.type === 'Property') && parent.key === n && !parent.computed) return;
    edits.push({ start: n.start - OFFSET, end: n.end - OFFSET, text: i < argSrcs.length ? `(${argSrcs[i]})` : 'undefined' });
  });
  edits.sort((a, b) => b.start - a.start);
  let out = bodySrc;
  for (const e of edits) {
    if (e.start < 0 || e.end > out.length) return null;
    out = out.slice(0, e.start) + e.text + out.slice(e.end);
  }
  return out;
}

function reduceOnce(src, consts, guard) {
  let expr;
  try { expr = parseExpr(src); } catch { return null; }
  const OFFSET = 1;
  let found = null;
  walk(expr, (n) => {
    if (found) return;
    // fold [a, b, ...c][K]
    if (n.type === 'MemberExpression' && n.computed
        && n.object.type === 'ArrayExpression'
        && n.property.type === 'NumericLiteral') {
      const idx = n.property.value;
      const els = n.object.elements;
      if (Number.isInteger(idx) && idx >= 0 && idx < els.length
          && els.slice(0, idx + 1).every((e) => e && e.type !== 'SpreadElement')) {
        found = { start: n.start - OFFSET, end: n.end - OFFSET, text: `(${src.slice(els[idx].start - OFFSET, els[idx].end - OFFSET)})` };
        return;
      }
    }
    // inline helper call
    if (n.type === 'CallExpression' && n.callee.type === 'Identifier') {
      const rec = consts.get(n.callee.name);
      if (rec && rec.isArrowExprBody && !rec.ambiguous && !guard.has('fn:' + n.callee.name)) {
        const argSrcs = n.arguments.map((a) => (a.type === 'SpreadElement' ? null : src.slice(a.start - OFFSET, a.end - OFFSET)));
        if (argSrcs.every((a) => a !== null)) {
          const sub = substitute(rec.bodySrc, rec.params, argSrcs);
          if (sub !== null) {
            found = { start: n.start - OFFSET, end: n.end - OFFSET, text: `(${sub})`, guard: 'fn:' + n.callee.name };
            return;
          }
        }
      }
    }
  });
  if (found) {
    if (found.guard) guard.add(found.guard);
    return src.slice(0, found.start) + found.text + src.slice(found.end);
  }
  // second pass: inline a plain const identifier (lower priority than structural folds)
  if (!INLINE_CONSTS) return null;
  let idFound = null;
  walk(expr, (n, parent) => {
    if (idFound) return;
    if (n.type !== 'Identifier') return;
    if (parent && parent.type === 'MemberExpression' && parent.property === n && !parent.computed) return;
    if (parent && (parent.type === 'ObjectProperty' || parent.type === 'Property') && parent.key === n && !parent.computed) return;
    if (parent && parent.type === 'CallExpression' && parent.callee === n) return;
    const rec = consts.get(n.name);
    if (!rec || rec.ambiguous || !rec.src || rec.isArrowExprBody) return;
    if (guard.has('id:' + n.name)) return;
    if (rec.src.length > 300) return;
    idFound = { start: n.start - OFFSET, end: n.end - OFFSET, text: `(${rec.src})`, name: n.name };
  });
  if (idFound) {
    guard.add('id:' + idFound.name);
    return src.slice(0, idFound.start) + idFound.text + src.slice(idFound.end);
  }
  return null;
}

function reduceFull(src, consts) {
  const guard = new Set();
  const trail = [norm(src)];
  let cur = src;
  for (let i = 0; i < MAX_DEPTH; i += 1) {
    const next = reduceOnce(cur, consts, guard);
    if (next === null || next.length > MAX_LEN) break;
    cur = next;
    trail.push(norm(cur));
  }
  return { final: norm(cur), trail, steps: trail.length - 1 };
}

// strip redundant parens for comparison
function canon(s) {
  let t = s;
  for (let i = 0; i < 12; i += 1) {
    const u = t.replace(/\(\s*([A-Za-z_$][\w$.]*(?:\([^()]*\))?)\s*\)/g, '$1');
    if (u === t) break;
    t = u;
  }
  return norm(t);
}

// ---------- expect chain extraction ----------
function expectSites(ast, code) {
  const sites = [];
  walk(ast, (n) => {
    if (n.type !== 'CallExpression') return;
    if (n.callee.type !== 'Identifier' || n.callee.name !== 'expect') return;
    sites.push(n);
  });
  return sites;
}

function chainOf(expectNode, parents) {
  // find the outermost member/call chain containing expectNode as the head
  let cur = expectNode;
  const mods = [];
  let matcher = null;
  let matcherCall = null;
  for (;;) {
    const p = parents.get(cur);
    if (!p) break;
    if (p.type === 'MemberExpression' && p.object === cur && !p.computed && p.property.type === 'Identifier') {
      const name = p.property.name;
      const pp = parents.get(p);
      if (pp && pp.type === 'CallExpression' && pp.callee === p) {
        matcher = name; matcherCall = pp; cur = pp; break;
      }
      mods.push(name); cur = p; continue;
    }
    break;
  }
  return { mods, matcher, matcherCall, tail: cur, parents };
}

// ---------- per-file analysis ----------
const results = [];
const parseFails = [];
let scanned = 0;

const EQ = new Set(['toBe', 'toEqual', 'toStrictEqual', 'toBeCloseTo', 'toContain', 'toContainEqual', 'toMatch', 'toMatchObject', 'toHaveLength', 'toBeGreaterThan', 'toBeGreaterThanOrEqual', 'toBeLessThan', 'toBeLessThanOrEqual', 'toSatisfy']);
const NOARG_TRUTHY = new Set(['toBeDefined', 'toBeTruthy', 'toBeInstanceOf']);

for (const rel of FILES) {
  const abs = path.join(ROOT, rel);
  let code;
  try { code = fs.readFileSync(abs, 'utf8'); } catch (e) { parseFails.push({ rel, err: 'read: ' + e.message }); continue; }
  let ast;
  try { ast = parseFile(code); } catch (e) { parseFails.push({ rel, err: 'parse: ' + String(e.message).slice(0, 120) }); continue; }
  scanned += 1;
  const consts = buildScopeMaps(ast, code);
  const PARENTS = new Map();
  walk(ast, (n, p) => { if (p) PARENTS.set(n, p); });
  const lineOf = (pos) => code.slice(0, pos).split('\n').length;
  const stmtSrc = (n) => norm(code.slice(n.start, n.end)).slice(0, 400);

  const titleOf = (node) => {
    const titles = [];
    let cur = node;
    for (let i = 0; i < 60; i += 1) {
      const p = PARENTS.get(cur);
      if (!p) break;
      if (p.type === 'CallExpression' && p.arguments[0]
          && (p.arguments[0].type === 'StringLiteral' || p.arguments[0].type === 'TemplateLiteral')) {
        const cal = p.callee;
        let nm = null;
        if (cal.type === 'Identifier') nm = cal.name;
        else if (cal.type === 'MemberExpression' && cal.object.type === 'Identifier') nm = cal.object.name;
        else if (cal.type === 'CallExpression' && cal.callee.type === 'MemberExpression'
                 && cal.callee.object.type === 'Identifier') nm = cal.callee.object.name;
        if (nm === 'it' || nm === 'test' || nm === 'describe') {
          titles.unshift(nm + ': ' + norm(code.slice(p.arguments[0].start, p.arguments[0].end)).slice(0, 200));
        }
      }
      cur = p;
    }
    return titles;
  };
  const push = (kind, node, extra) => {
    results.push({ rel, line: lineOf(node.start), kind, src: stmtSrc(node), titles: titleOf(node), ...extra });
  };

  // --- A: tautological equality / reduction to identity ---
  for (const ex of expectSites(ast, code)) {
    const { mods, matcher, matcherCall } = chainOf(ex, PARENTS);
    if (!matcher) {
      // J: expect(...) with no matcher at all
      push('NO_MATCHER', ex, {});
      continue;
    }
    if (!EQ.has(matcher)) {
      if (NOARG_TRUTHY.has(matcher) && ex.arguments.length) {
        const a = ex.arguments[0];
        if (a.type === 'Identifier') {
          const rec = consts.get(a.name);
          const litStart = rec && !rec.ambiguous && rec.src && /^(\[|\{|'|"|`|new |Object\.freeze\()/.test(rec.src.trim());
          // A trailing .find()/.at()/[i]/?. can still yield undefined — only a binding that
          // ENDS as a literal/constructor is guaranteed truthy.
          const endsLiteral = litStart && /(\]|\}|'|"|`|\))\s*$/.test(rec.src.trim()) && !/\.(find|at|pop|shift|get|match|exec|closest|querySelector|find[A-Za-z]*)\s*\([^]*\)\s*$/.test(rec.src.trim());
          if (endsLiteral) {
            push('TRIVIAL_TRUTHY', matcherCall, { matcher, binding: rec.src.slice(0, 160) });
          }
        } else if (['ArrayExpression', 'ObjectExpression', 'StringLiteral', 'NumericLiteral', 'NewExpression'].includes(a.type)) {
          push('TRIVIAL_TRUTHY', matcherCall, { matcher, binding: '<literal argument>' });
        }
      }
      continue;
    }
    if (!ex.arguments.length || !matcherCall.arguments.length) continue;
    const actualNode = ex.arguments[0];
    const expectedNode = matcherCall.arguments[0];
    if (actualNode.type === 'SpreadElement' || expectedNode.type === 'SpreadElement') continue;
    const aSrc = code.slice(actualNode.start, actualNode.end);
    const eSrc = code.slice(expectedNode.start, expectedNode.end);
    const negated = mods.includes('not');
    // fast path: textually identical
    if (canon(aSrc) === canon(eSrc)) {
      push('SELF_COMPARE_DIRECT', matcherCall, { matcher, negated, actual: norm(aSrc).slice(0, 200), expected: norm(eSrc).slice(0, 200), steps: 0 });
      continue;
    }
    if (matcher !== 'toBe' && matcher !== 'toEqual' && matcher !== 'toStrictEqual') continue;
    // reduction path
    if (aSrc.length > 400 || eSrc.length > 400) continue;
    const ra = reduceFull(aSrc, consts);
    const re = reduceFull(eSrc, consts);
    if (canon(ra.final) === canon(re.final) && (ra.steps > 0 || re.steps > 0)) {
      push('SELF_COMPARE_REDUCED', matcherCall, {
        matcher, negated,
        actual: norm(aSrc).slice(0, 200), expected: norm(eSrc).slice(0, 200),
        reducedTo: ra.final.slice(0, 300), steps: ra.steps + re.steps,
      });
    }
  }

  // --- B: loops over provably-empty iterables ---
  walk(ast, (n) => {
    const emptyLit = (node) => {
      if (!node) return false;
      if (node.type === 'ArrayExpression' && node.elements.length === 0) return true;
      if (node.type === 'CallExpression' && node.callee.type === 'MemberExpression'
          && !node.callee.computed && node.callee.property.name === 'freeze'
          && node.arguments[0] && node.arguments[0].type === 'ArrayExpression'
          && node.arguments[0].elements.length === 0) return true;
      if (node.type === 'Identifier') {
        const rec = consts.get(node.name);
        if (rec && !rec.ambiguous && rec.src && /^\s*(\[\s*\]|Object\.freeze\(\s*\[\s*\]\s*\))\s*$/.test(rec.src)) {
          // An array declared empty is only PROVABLY empty if nothing ever fills it and it
          // is never handed to something that could. `const perTick = []; run(perTick);` and
          // `rows.push(x)` both make it live.
          const nm = node.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          if (new RegExp(`\\b${nm}\\s*\\.\\s*(push|unshift|splice|fill|copyWithin|sort|length\\s*=)`).test(code)) return false;
          if (new RegExp(`[(,]\\s*${nm}\\s*[),]`).test(code)) return false;
          if (new RegExp(`\\.\\.\\.\\s*${nm}\\b`).test(code)) return false;
          if (new RegExp(`\\b${nm}\\s*\\[\\s*\\d`).test(code)) return false;
          return true;
        }
      }
      return false;
    };
    if ((n.type === 'ForOfStatement' || n.type === 'ForInStatement') && emptyLit(n.right)) {
      const hasExpect = JSON.stringify(code.slice(n.start, n.end)).includes('expect');
      if (hasExpect) push('EMPTY_LOOP', n, { iterable: norm(code.slice(n.right.start, n.right.end)).slice(0, 120) });
    }
    if (n.type === 'CallExpression' && n.callee.type === 'MemberExpression' && !n.callee.computed
        && ['forEach', 'every', 'map', 'some'].includes(n.callee.property.name)
        && emptyLit(n.callee.object)) {
      if (code.slice(n.start, n.end).includes('expect')) {
        push('EMPTY_ITERATION', n, { iterable: norm(code.slice(n.callee.object.start, n.callee.object.end)).slice(0, 120) });
      }
    }
    // it.each([]) / describe.each([])
    if (n.type === 'CallExpression' && n.callee.type === 'CallExpression'
        && n.callee.callee.type === 'MemberExpression' && !n.callee.callee.computed
        && n.callee.callee.property.name === 'each'
        && n.callee.arguments[0] && n.callee.arguments[0].type === 'ArrayExpression'
        && n.callee.arguments[0].elements.length === 0) {
      push('EMPTY_EACH', n, {});
    }
  });

  // --- E: try/catch swallowing the assertion ---
  walk(ast, (n) => {
    if (n.type !== 'TryStatement' || !n.handler) return;
    const blockSrc = code.slice(n.block.start, n.block.end);
    if (!/\bexpect\s*\(/.test(blockSrc)) return;
    const hSrc = code.slice(n.handler.body.start, n.handler.body.end);
    const rethrows = /\bthrow\b/.test(hSrc);
    const hasAssert = /\bexpect\s*\(/.test(hSrc) || /\bassert\b/.test(hSrc);
    const finallyThrows = n.finalizer ? /\bthrow\b|\bexpect\s*\(/.test(code.slice(n.finalizer.start, n.finalizer.end)) : false;
    if (!rethrows && !hasAssert && !finallyThrows) {
      push('SWALLOWING_CATCH', n, { handler: norm(hSrc).slice(0, 200) });
    }
  });

  // --- F: un-awaited rejects/resolves ---
  walk(ast, (n, parent) => {
    if (n.type !== 'MemberExpression' || n.computed) return;
    if (n.property.name !== 'rejects' && n.property.name !== 'resolves') return;
    if (!(n.object.type === 'CallExpression' && n.object.callee.type === 'Identifier' && n.object.callee.name === 'expect')) return;
    // find enclosing statement
    const parents = PARENTS;
    let awaited = false, returned = false, stmt = null;
    let node = n;
    for (let i = 0; i < 12; i += 1) {
      const pp = parents.get(node);
      if (!pp) break;
      if (pp.type === 'AwaitExpression') { awaited = true; break; }
      if (pp.type === 'ReturnStatement') { returned = true; break; }
      if (pp.type === 'ExpressionStatement') { stmt = pp; break; }
      if (pp.type === 'ArrayExpression' || pp.type === 'CallExpression') { node = pp; continue; }
      node = pp;
    }
    // `const a = expect(p).rejects.toThrow(...); await tick(); await a;` is the correct
    // fake-timer idiom — the promise IS observed, one statement later.
    let bound = null;
    { let q = n; for (let i = 0; i < 8; i += 1) { const pp = parents.get(q); if (!pp) break;
        if (pp.type === 'VariableDeclarator' && pp.id.type === 'Identifier') { bound = pp.id.name; break; } q = pp; } }
    if (bound && new RegExp(`await\\s+${bound}\\b|return\\s+${bound}\\b`).test(code)) return;
    if (!awaited && !returned && (stmt || bound)) push('UNAWAITED_ASYNC_MATCHER', stmt || n, { kind2: n.property.name });
  });

  // --- G/H: it() bodies with no assertion at all ---
  // A test may assert through a locally-defined helper (`inert(...)`, `proveParity(...)`,
  // `smokeChapter(...)`). Resolve those transitively before calling a body assertion-free.
  const fnBodies = new Map();
  walk(ast, (n) => {
    let nm = null, fn = null;
    if (n.type === 'FunctionDeclaration' && n.id) { nm = n.id.name; fn = n; }
    else if (n.type === 'VariableDeclarator' && n.id.type === 'Identifier' && n.init
             && (n.init.type === 'ArrowFunctionExpression' || n.init.type === 'FunctionExpression')) { nm = n.id.name; fn = n.init; }
    if (nm && fn) fnBodies.set(nm, code.slice(fn.start, fn.end));
  });
  const asserting = new Set();
  for (let pass = 0; pass < 6; pass += 1) {
    let grew = false;
    for (const [nm, b] of fnBodies) {
      if (asserting.has(nm)) continue;
      if (/\bexpect\s*\(|\bexpect\w+\s*\(|\bassert\w*\s*\(|\.toThrow|\btoMatchSnapshot|\bexpectTypeOf|\btoHaveBeen/.test(b)
          || [...asserting].some((a) => new RegExp(`\\b${a.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*\\(`).test(b))) {
        asserting.add(nm); grew = true;
      }
    }
    if (!grew) break;
  }
  walk(ast, (n) => {
    if (n.type !== 'CallExpression') return;
    const cal = n.callee;
    let name = null;
    if (cal.type === 'Identifier') name = cal.name;
    else if (cal.type === 'MemberExpression' && !cal.computed && cal.object.type === 'Identifier') name = cal.object.name;
    else if (cal.type === 'CallExpression' && cal.callee.type === 'MemberExpression'
             && cal.callee.object.type === 'Identifier') name = cal.callee.object.name;
    if (name !== 'it' && name !== 'test') return;
    const fn = n.arguments.find((a) => a && (a.type === 'ArrowFunctionExpression' || a.type === 'FunctionExpression'));
    if (!fn) return;
    const body = code.slice(fn.start, fn.end);
    // A named assertion helper (expectInBothCopies, assertNoDrift, verifyX, checkY) is a
    // real assertion site; only a body with NO assertion vocabulary at all is a candidate.
    if (/\bexpect\w*\s*\(|\bassert\w*\s*\(|\.toThrow|\btoMatchSnapshot|\bexpectTypeOf|\btoHaveBeen/.test(body)) return;
    if ([...asserting].some((a) => new RegExp(`\\b${a.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*\\(`).test(body))) return;
    if (/\.skip|\.todo/.test(code.slice(n.callee.start, n.callee.end))) return;
    push('IT_WITHOUT_ASSERTION', n, { title: (n.arguments[0] && n.arguments[0].type === 'StringLiteral') ? n.arguments[0].value.slice(0, 120) : '<dynamic>' });
  });
  // --- I: every assertion in the test is GATED (inside an if) or LOOPED (inside a
  // for/forEach), so a fixture that never satisfies the gate asserts nothing at all.
  walk(ast, (n) => {
    if (n.type !== 'CallExpression') return;
    const cal = n.callee;
    let nm = null;
    if (cal.type === 'Identifier') nm = cal.name;
    else if (cal.type === 'MemberExpression' && cal.object.type === 'Identifier') nm = cal.object.name;
    else if (cal.type === 'CallExpression' && cal.callee.type === 'MemberExpression'
             && cal.callee.object.type === 'Identifier') nm = cal.callee.object.name;
    if (nm !== 'it' && nm !== 'test') return;
    if (cal.type === 'MemberExpression' && ['beforeEach','afterEach','beforeAll','afterAll','describe','step','use','extend','skip','todo','fail','slow','setTimeout'].includes(cal.property.name)) return;
    const fn = n.arguments.find((a) => a && (a.type === 'ArrowFunctionExpression' || a.type === 'FunctionExpression'));
    if (!fn) return;
    const sites = [];
    walk(fn, (x) => { if (x.type === 'CallExpression' && x.callee.type === 'Identifier' && x.callee.name === 'expect') sites.push(x); });
    if (!sites.length) return;
    const classify = (site) => {
      let cur = site, gated = false, looped = false;
      for (let i = 0; i < 40; i += 1) {
        const par = PARENTS.get(cur);
        if (!par || par === fn) break;
        if (par.type === 'IfStatement' && (par.consequent === cur || par.alternate === cur)) gated = true;
        if (par.type === 'ConditionalExpression' && par.test !== cur) gated = true;
        if (par.type === 'LogicalExpression' && par.right === cur) gated = true;
        if (['ForStatement', 'ForOfStatement', 'ForInStatement', 'WhileStatement'].includes(par.type)) looped = true;
        if (par.type === 'ArrowFunctionExpression' || par.type === 'FunctionExpression') {
          const pp = PARENTS.get(par);
          if (pp && pp.type === 'CallExpression' && pp.callee.type === 'MemberExpression'
              && ['forEach', 'map', 'filter', 'every', 'some', 'flatMap'].includes(pp.callee.property.name)) looped = true;
        }
        cur = par;
      }
      return { gated, looped };
    };
    const cls = sites.map(classify);
    const title = (n.arguments[0] && n.arguments[0].type === 'StringLiteral') ? n.arguments[0].value.slice(0, 140) : '<dynamic>';
    if (cls.every((c) => c.gated)) push('ALL_ASSERTIONS_GATED', n, { title, sites: sites.length });
    else if (cls.every((c) => c.looped)) push('ALL_ASSERTIONS_LOOPED', n, { title, sites: sites.length });
  });
}

process.stdout.write(JSON.stringify({ scanned, total: FILES.length, parseFails, results }, null, 1));
