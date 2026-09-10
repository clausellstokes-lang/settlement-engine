// MISS PROBE — apply the probe's OWN admission predicate to reader-facing prose homes
// that live OUTSIDE src/**/*.{js,jsx} and docs/content/RECEIPT_POOLS_*.md.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { admit, norm } from './registers.mjs';

const D = process.argv[2];
const require = createRequire(path.join(D, 'package.json'));
const espree = require('espree');

const jsStrings = (file) => {
  const src = readFileSync(path.join(D, file), 'utf8');
  const out = [];
  let ast;
  try {
    ast = espree.parse(src, { ecmaVersion: 'latest', sourceType: 'module', loc: false });
  } catch { return out; }
  const walk = (n) => {
    if (!n || typeof n !== 'object') return;
    if (Array.isArray(n)) { n.forEach(walk); return; }
    if (n.type === 'Literal' && typeof n.value === 'string') out.push(n.value);
    if (n.type === 'TemplateLiteral') out.push(n.quasis.map((q) => q.value.cooked).join('{x}'));
    for (const k of Object.keys(n)) if (k !== 'type' && k !== 'loc' && k !== 'range') walk(n[k]);
  };
  walk(ast);
  return out;
};

const htmlStrings = (file) => {
  const src = readFileSync(path.join(D, file), 'utf8');
  const out = [];
  // text nodes outside script/style
  const stripped = src.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ');
  for (const m of stripped.matchAll(/>([^<>]{8,})</g)) out.push(m[1].trim());
  // meta content= and title
  for (const m of src.matchAll(/(?:content|alt|title|placeholder|aria-label)="([^"]{8,})"/g)) out.push(m[1].trim());
  for (const m of src.matchAll(/<title>([^<]+)<\/title>/g)) out.push(m[1].trim());
  return out;
};

const walkDir = (rel, exts) => {
  const out = [];
  const rec = (r) => {
    let ents; try { ents = readdirSync(path.join(D, r)); } catch { return; }
    for (const e of ents) {
      const p = path.join(r, e);
      const s = statSync(path.join(D, p));
      if (s.isDirectory()) { if (e !== 'node_modules' && e !== '.git') rec(p); }
      else if (exts.some((x) => e.endsWith(x))) out.push(p);
    }
  };
  rec(rel);
  return out;
};

const HOMES = [
  ...['index.html'].map((f) => [f, 'html']),
  ...walkDir('public', ['.html']).map((f) => [f, 'html']),
  ...walkDir('api', ['.js']).map((f) => [f, 'js']),
  ...walkDir('mcp-server/src', ['.js']).map((f) => [f, 'js']),
  ...walkDir('mcp-server/bin', ['.js']).map((f) => [f, 'js']),
  ...walkDir('foundry-module/scripts', ['.js']).map((f) => [f, 'js']),
];

const seen = new Set();
let total = 0;
const perFile = [];
const em = [];
const excl = [];
for (const [f, kind] of HOMES) {
  const strs = kind === 'html' ? htmlStrings(f) : jsStrings(f);
  let n = 0;
  const kept = [];
  for (const t of strs) {
    if (!admit(t, 'sentence')) continue;
    const k = norm(t);
    if (seen.has(k)) continue;
    seen.add(k);
    n++; total++;
    kept.push(t);
    if (/[—–]/.test(t)) em.push([f, t]);
    if (/!/.test(t)) excl.push([f, t]);
  }
  if (n) perFile.push([f, n, kept]);
}
perFile.sort((a, b) => b[1] - a[1]);
console.log('# OUT-OF-SCOPE reader-facing homes, scored with the probe\'s OWN admit():');
for (const [f, n] of perFile) console.log(String(n).padStart(5), f);
console.log('# TOTAL admitted rows no register holds:', total, 'across', perFile.length, 'files');
console.log('# em dashes among them:', em.length, ' exclamation points:', excl.length);
console.log('--- em-dash examples ---');
for (const [f, t] of em.slice(0, 8)) console.log('  ', f, '::', t.slice(0, 120));
console.log('--- exclamation examples ---');
for (const [f, t] of excl.slice(0, 5)) console.log('  ', f, '::', t.slice(0, 120));
console.log('--- top file samples ---');
for (const [f, n, kept] of perFile.slice(0, 6)) {
  console.log('==', f, `(${n})`);
  for (const t of kept.slice(0, 5)) console.log('   ', t.slice(0, 140));
}
