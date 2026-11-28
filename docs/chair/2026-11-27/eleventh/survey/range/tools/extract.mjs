// RANGE-MEASURE: every prose literal of src (tests excluded), grouped into KEYS.
// node extract.mjs <tree> <out.json>
// A KEY is (1) an array literal holding >= 1 prose element (a string, a template, or an object whose prose field is
// `text`/`line`/... ): the elements are the variants drawn under the key; or (2) a prose string that is a property value
// in module-scope data (a table cell): a key of ONE line. Any other prose literal (inside a function, a ternary, a
// concatenation) is CODE: composed by code. Nothing in the tree is written.
import { createRequire } from 'node:module';
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
const TREE = process.argv[2]; const OUT = process.argv[3];
const require = createRequire(join(process.argv[4] || TREE, 'package.json'));
const { parse } = require('@babel/parser');

const files = [];
(function walk(d) {
  for (const n of readdirSync(d)) {
    const p = join(d, n); const s = statSync(p);
    if (s.isDirectory()) { if (!/__tests__|node_modules/.test(n)) walk(p); }
    else if (/\.(jsx?|mjs)$/.test(n) && !/\.test\./.test(n)) files.push(p);
  }
})(join(TREE, 'src'));

const SLOT = '\u0001';
const words = (s) => s.replace(new RegExp(SLOT, 'g'), ' X ').replace(/\{[^}]*\}/g, ' X ').split(/\s+/).filter((w) => /[a-z]/i.test(w));
const isProse = (s) => {
  if (typeof s !== 'string') return false;
  const t = s.replace(new RegExp(SLOT, 'g'), 'X').replace(/\{[^}]*\}/g, 'X');
  if (words(s).length < 4) return false;
  if (!/[a-z]{2}/.test(t)) return false;
  if (!/\s/.test(t.trim()) ) return false; // identifiers, paths
  if (/^(import|export|const|function|return)\b/.test(t)) return false;
  if (/\b(px|rem|rgba?|flex|grid|var\(--)/.test(t) && !/[.!?]$/.test(t.trim())) return false;
  if (/^[a-z][\w-]*( [a-z][\w-]*)*$/.test(t) && /-/.test(t)) return false; // class lists
  return true;
};
const PROSE_FIELDS = ['text', 'line', 'sentence', 'prose', 'phrase', 'desc', 'description', 'body', 'hook', 'value'];
const DECL_FIELDS = ['needs', 'excludes', 'marks', 'crisis', 'twinOf', 'colour', 'requires', 'when', 'unless', 'gate', 'only', 'notIf', 'tier', 'tiers', 'minTier', 'maxTier', 'weight', 'condition', 'if'];
const ID_FIELDS = ['id', 'key', 'name', 'type', 'label', 'title', 'kind'];

const unwrap = (n) => { while (n && n.type === 'CallExpression' && n.arguments.length === 1 && /^(Object\.freeze|freeze|deepFreeze|frozen|Object\.freeze)$/.test(n.callee.type === 'MemberExpression' ? `${n.callee.object.name}.${n.callee.property.name}` : n.callee.name || '')) n = n.arguments[0]; while (n && (n.type === 'TSAsExpression' || n.type === 'ParenthesizedExpression')) n = n.expression; return n; };
function strOf(node) {
  node = unwrap(node);
  if (!node) return null;
  if (node.type === 'ArrowFunctionExpression' && node.body && node.body.type !== 'BlockStatement') return strOf(node.body);
  if (node.type === 'StringLiteral') return node.value;
  if (node.type === 'TemplateLiteral') return node.quasis.map((q) => q.value.cooked ?? q.value.raw).join(SLOT);
  if (node.type === 'BinaryExpression' && node.operator === '+') {
    const a = strOf(node.left); const b = strOf(node.right);
    return `${a ?? SLOT}${b ?? SLOT}`;
  }
  return null;
}
const propName = (p) => p.key?.type === 'Identifier' ? p.key.name : p.key?.type === 'StringLiteral' ? p.key.value : p.key?.type === 'NumericLiteral' ? String(p.key.value) : '[computed]';

const keys = []; const code = [];
let fileRel = '';
function objProse(o) {
  // the object's main prose field and its declaration fields
  const props = o.properties.filter((p) => p.type === 'ObjectProperty');
  let main = null; const decl = []; const dv = {}; let ids = 0; let proseFields = 0;
  for (const p of props) {
    const n = propName(p); const s = strOf(p.value);
    if (s != null && isProse(s)) { proseFields++; if (!main || PROSE_FIELDS.indexOf(n) >= 0 && (PROSE_FIELDS.indexOf(main.f) < 0 || PROSE_FIELDS.indexOf(n) < PROSE_FIELDS.indexOf(main.f))) main = { f: n, s, line: p.loc.start.line }; }
    if (DECL_FIELDS.includes(n)) { decl.push(n); const flat = []; (function f(v) { v = unwrap(v); if (!v) return; if (v.type === 'StringLiteral') flat.push(v.value); else if (v.type === 'ArrayExpression') v.elements.forEach(f); else if (v.type === 'BooleanLiteral' || v.type === 'NumericLiteral') flat.push(String(v.value)); else if (v.type === 'ObjectExpression') v.properties.forEach((q) => { if (q.type === 'ObjectProperty') { flat.push(propName(q)); f(q.value); } }); })(p.value); dv[n] = flat; }
    if (ID_FIELDS.includes(n) && n !== 'id') ids++;
  }
  return { main, decl, dv, ids, proseFields };
}
function visit(node, path, inFn, isVariant = false) {
  node = unwrap(node);
  if (!node || typeof node.type !== 'string') return;
  const fnHere = /Function|ArrowFunction|ClassMethod|ObjectMethod/.test(node.type);
  if (node.type === 'ArrayExpression') {
    const els = node.elements.filter(Boolean).map(unwrap);
    const items = [];
    let catalog = 0;
    els.forEach((e, i) => {
      const s = strOf(e);
      if (s != null) { if (isProse(s)) items.push({ i, s, line: e.loc.start.line, decl: [] }); return; }
      if (e.type === 'ObjectExpression') {
        const o = objProse(e);
        if (o.main && (o.proseFields > 1 || o.ids > 0) && !PROSE_FIELDS.includes(o.main.f)) catalog++;
        else if (o.main && PROSE_FIELDS.includes(o.main.f)) items.push({ i, s: o.main.s, line: o.main.line, decl: o.decl, dv: o.dv, field: o.main.f });
      }
    });
    if (items.length >= 1 && catalog === 0 && items.length >= els.length / 2) {
      keys.push({ key: `${fileRel} :: ${path.join('.')}`, file: fileRel, kind: 'array', inFn, lines: items.map((x) => ({ text: x.s, site: `${fileRel}:${x.line}`, decl: x.decl, dv: x.dv })) });
      // still walk non-prose children (objects may hold nested arrays)
      els.forEach((e, i) => { if (e.type === 'ObjectExpression') visit(e, [...path, i], inFn, true); });
      return;
    }
    els.forEach((e, i) => visit(e, [...path, i], inFn));
    return;
  }
  if (node.type === 'ObjectExpression') {
    for (const p of node.properties) {
      if (p.type !== 'ObjectProperty') { visit(p, path, inFn); continue; }
      const n = propName(p); const s = strOf(p.value);
      if (s != null) {
        if (isProse(s)) {
          if (isVariant) continue;
          if (!inFn) keys.push({ key: `${fileRel} :: ${[...path, n].join('.')}`, file: fileRel, kind: 'cell', inFn, lines: [{ text: s, site: `${fileRel}:${p.loc.start.line}`, decl: [] }] });
          else code.push({ text: s, site: `${fileRel}:${p.loc.start.line}`, home: `${fileRel} :: ${path.join('.')}` });
        }
        continue;
      }
      visit(p.value, [...path, n], inFn);
    }
    return;
  }
  if (node.type === 'JSXText') { const t = node.value.replace(/\s+/g, ' ').trim(); if (isProse(t)) code.push({ text: t, site: `${fileRel}:${node.loc.start.line}`, home: `${fileRel} :: ${path.join('.')}`, jsx: true }); return; }
  // a prose literal anywhere else is code-composed
  const s = (node.type === 'StringLiteral' || node.type === 'TemplateLiteral') ? strOf(node) : null;
  if (s != null) { if (isProse(s)) code.push({ text: s, site: `${fileRel}:${node.loc.start.line}`, home: `${fileRel} :: ${path.join('.')}` }); return; }
  let nextPath = path;
  if (node.type === 'VariableDeclarator' && node.id?.type === 'Identifier') nextPath = [node.id.name];
  else if (node.type === 'FunctionDeclaration' && node.id) nextPath = [`${node.id.name}()`];
  else if (node.type === 'AssignmentExpression' && node.left?.type === 'MemberExpression') nextPath = [...path, '='];
  for (const k of Object.keys(node)) {
    if (k === 'loc' || k === 'start' || k === 'end' || k === 'leadingComments' || k === 'trailingComments' || k === 'innerComments' || k === 'extra') continue;
    const v = node[k];
    if (Array.isArray(v)) v.forEach((c) => c && typeof c.type === 'string' && visit(c, nextPath, inFn || fnHere));
    else if (v && typeof v.type === 'string') visit(v, nextPath, inFn || fnHere);
  }
}
let failed = 0;
for (const f of files) {
  fileRel = relative(TREE, f);
  let ast;
  try { ast = parse(readFileSync(f, 'utf8'), { sourceType: 'module', plugins: ['jsx', 'importAttributes'], errorRecovery: true }); } catch { failed++; continue; }
  visit(ast.program, [], false);
}
writeFileSync(OUT, JSON.stringify({ keys, code }));
const multi = keys.filter((k) => k.lines.length >= 2);
console.log(`files ${files.length} failed ${failed}; keys ${keys.length} (2+ lines ${multi.length}, lines in them ${multi.reduce((a, k) => a + k.lines.length, 0)}); code literals ${code.length}`);
