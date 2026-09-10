// The 145 modules X2 could not import: X3 only takes FUNCTION-scoped literals, so a
// MODULE-LEVEL table in one of them is seen by neither. Measure the residue.
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { admit, norm } from './registers.mjs';
const D = process.argv[2];
const require = createRequire(path.join(D, 'package.json'));
const espree = require('espree');
const F = JSON.parse(readFileSync('walk.failures.json', 'utf8'));
const corpus = JSON.parse(readFileSync('corpus.json', 'utf8'));
const held = new Set(corpus.map((r) => norm(r.text)));
let lost = [];
for (const f of Object.keys(F)) {
  let ast;
  try { ast = espree.parse(readFileSync(path.join(D, f), 'utf8'), { ecmaVersion: 'latest', sourceType: 'module', ecmaFeatures: { jsx: true } }); }
  catch { continue; }
  const out = [];
  const walk = (n, inFn) => {
    if (!n || typeof n !== 'object') return;
    if (Array.isArray(n)) { n.forEach((c) => walk(c, inFn)); return; }
    const isFn = /^(FunctionDeclaration|FunctionExpression|ArrowFunctionExpression)$/.test(n.type);
    const f2 = inFn || isFn;
    if (n.type === 'ImportDeclaration') return;
    if (!f2) {
      if (n.type === 'Literal' && typeof n.value === 'string') out.push(n.value);
      if (n.type === 'TemplateLiteral') out.push(n.quasis.map((q) => q.value.cooked).join('{x}'));
    }
    for (const k of Object.keys(n)) {
      if (k === 'type' || k === 'loc' || k === 'range') continue;
      if (n.type === 'Property' && k === 'key' && !n.computed) continue;
      walk(n[k], f2);
    }
  };
  walk(ast, false);
  for (const t of out) {
    if (!admit(t, 'sentence')) continue;
    const k = norm(t);
    if (held.has(k)) continue;
    held.add(k);
    lost.push([f, t]);
  }
}
console.log('# failed-import modules scanned:', Object.keys(F).length);
console.log('# ADMITTED MODULE-LEVEL strings in them that NO register holds:', lost.length);
const byF = {}; for (const [f] of lost) byF[f] = (byF[f] || 0) + 1;
for (const [f, n] of Object.entries(byF).sort((a, b) => b[1] - a[1]).slice(0, 10)) console.log(String(n).padStart(4), f);
for (const [f, t] of lost.slice(0, 12)) console.log('   ', f.replace('src/', ''), '::', t.slice(0, 110));
