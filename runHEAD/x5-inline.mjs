// X5 — THE INLINE-PROSE EXTRACTOR (espree AST).
// Authored sentences that live as literals INSIDE function bodies have no export to
// walk, so the import walk (X2) cannot see them. This parses every src/**/*.js with the
// estate's own parser dependency and collects string Literals and TemplateLiterals whose
// nearest enclosing scope is a function (i.e. NOT a module-level data table, which X2 owns).
// TemplateLiteral quasis are joined with the interpolation normalised to {x}.
// Usage: node x5-inline.mjs <DOCK> <OUT.json>
import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const D = process.argv[2];
const OUT = process.argv[3];
const require = createRequire(path.join(D, 'package.json'));
const espree = require('espree');

const EXCLUDE = [
  /^src\/domain\/certification\//,
  /^src\/domain\/compendium\/generated\//,
  /^src\/copy\/pseudo\.js$/,
  /^src\/data\/sampleDossier/,
  /\.test\.m?js$/,
  /__mocks__/,
];

const files = [];
(function walkDir(p) {
  for (const e of readdirSync(p)) {
    const q = path.join(p, e);
    const st = statSync(q);
    if (st.isDirectory()) walkDir(q);
    else if (/\.m?js$/.test(q)) files.push(q);
  }
})(path.join(D, 'src'));

const FN = new Set(['FunctionDeclaration', 'FunctionExpression', 'ArrowFunctionExpression']);
const rows = [];
const parseFails = [];

for (const abs of files) {
  const rel = path.relative(D, abs);
  if (EXCLUDE.some((r) => r.test(rel))) continue;
  let ast;
  try {
    ast = espree.parse(readFileSync(abs, 'utf8'), { ecmaVersion: 'latest', sourceType: 'module', loc: true });
  } catch (e) { parseFails.push(rel + ': ' + String(e.message).slice(0, 80)); continue; }
  const stack = [];
  const visit = (node, parent) => {
    if (!node || typeof node.type !== 'string') return;
    const isFn = FN.has(node.type);
    if (isFn) stack.push(node);
    if (stack.length) {
      if (node.type === 'Literal' && typeof node.value === 'string') {
        // skip import specifiers, property KEYS and comparison operands that are keys
        if (!(parent && parent.type === 'ImportDeclaration')
          && !(parent && parent.type === 'Property' && parent.key === node && !parent.computed)) {
          rows.push({ file: rel, line: node.loc.start.line, shape: 'inline-literal', text: node.value.replace(/\s+/g, ' ').trim() });
        }
      } else if (node.type === 'TemplateLiteral') {
        const t = node.quasis.map((q) => q.value.cooked ?? '').join('{x}').replace(/\s+/g, ' ').trim();
        if (t) rows.push({ file: rel, line: node.loc.start.line, shape: 'inline-template', text: t });
      }
    }
    for (const k of Object.keys(node)) {
      if (k === 'loc' || k === 'range' || k === 'parent') continue;
      const v = node[k];
      if (Array.isArray(v)) { for (const c of v) if (c && typeof c.type === 'string') visit(c, node); }
      else if (v && typeof v.type === 'string') visit(v, node);
    }
    if (isFn) stack.pop();
  };
  visit(ast, null);
}

const kept = rows.filter((r) => r.text.length >= 12 && r.text.length <= 2000);
writeFileSync(OUT, JSON.stringify(kept));
console.log('# files parsed:', files.length, ' parse failures:', parseFails.length, ' in-function literals >=12ch:', kept.length);
for (const p of parseFails.slice(0, 10)) console.log('  PARSE FAIL', p);
const per = {};
for (const r of kept) per[r.file] = (per[r.file] || 0) + 1;
for (const [f, n] of Object.entries(per).sort((a, b) => b[1] - a[1]).slice(0, 20)) console.log(String(n).padStart(6), f);
