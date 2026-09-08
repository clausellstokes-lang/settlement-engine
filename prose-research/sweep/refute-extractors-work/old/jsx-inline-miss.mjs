// Do .jsx files hold authored STRING LITERALS (not JSX text) that no register holds?
// X3 parses only src/**/*.js; X4 reads .jsx through the estate's JSX-prose walker.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { admit, norm } from './registers.mjs';

const D = process.argv[2];
const require = createRequire(path.join(D, 'package.json'));
const espree = require('espree');
const corpus = JSON.parse(readFileSync('corpus.json', 'utf8'));
const held = new Set(corpus.map((r) => norm(r.text)));

const files = [];
const rec = (r) => {
  for (const e of readdirSync(path.join(D, r))) {
    const p = path.join(r, e);
    if (statSync(path.join(D, p)).isDirectory()) rec(p);
    else if (e.endsWith('.jsx')) files.push(p);
  }
};
rec('src');

let parsed = 0, fails = 0;
const missed = [];
for (const f of files) {
  let ast;
  try {
    ast = espree.parse(readFileSync(path.join(D, f), 'utf8'), { ecmaVersion: 'latest', sourceType: 'module', ecmaFeatures: { jsx: true } });
    parsed++;
  } catch { fails++; continue; }
  const out = [];
  const walk = (n, inFn) => {
    if (!n || typeof n !== 'object') return;
    if (Array.isArray(n)) { n.forEach((c) => walk(c, inFn)); return; }
    const isFn = /^(FunctionDeclaration|FunctionExpression|ArrowFunctionExpression)$/.test(n.type);
    const f2 = inFn || isFn;
    if (n.type === 'ImportDeclaration') return;
    if (n.type === 'Literal' && typeof n.value === 'string' && f2) out.push(n.value);
    if (n.type === 'TemplateLiteral' && f2) out.push(n.quasis.map((q) => q.value.cooked).join('{x}'));
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
    missed.push([f, t]);
  }
}
console.log('# .jsx files parsed:', parsed, 'fails:', fails);
console.log('# ADMITTED in-function string literals in .jsx that NO register holds:', missed.length);
const byFile = {};
for (const [f] of missed) byFile[f] = (byFile[f] || 0) + 1;
const top = Object.entries(byFile).sort((a, b) => b[1] - a[1]).slice(0, 12);
for (const [f, n] of top) console.log(String(n).padStart(4), f);
console.log('# em dashes among them:', missed.filter(([, t]) => /[—–]/.test(t)).length,
  ' exclamations:', missed.filter(([, t]) => /!/.test(t)).length);
console.log('--- samples ---');
for (const [f, t] of missed.slice(0, 15)) console.log('  ', f.replace('src/', ''), '::', t.slice(0, 110));
