// TAIL-TITLES: every moved string is the title word: node backsub.mjs <tree> <before> <after>
// walks every string leaf of every town (but simulationTrace/receipt); a moved leaf passes when the AFTER string with each
// holder form put back to its face equals BEFORE. Prints the counts and every leaf that fails.
import { createRequire } from 'node:module'; const require = createRequire(import.meta.url);
const L = require('./load.cjs'); const [T, A, B] = process.argv.slice(2);
const { HOLDER_TITLE_FORMS } = await import(T + '/src/data/holderTitleForms.js');
const pairs = []; for (const [face, f] of Object.entries(HOLDER_TITLE_FORMS)) for (const form of Object.values(f)) pairs.push([form, face]);
pairs.sort((x, y) => y[0].length - x[0].length);
const cap = (w) => w.replace(/^the /, 'The ');
const back = (s) => { let o = s; for (const [form, face] of pairs) { o = o.split(form).join(face); o = o.split(cap(form)).join(cap(face)); } return o; };
const a = Object.fromEntries(L(A).map((r) => [r.seed, r.s]));
const SKIP = new Set(['simulationTrace', 'generationCoherenceReceipt']);
let moved = 0, ok = 0; const bad = [], byPath = {};
const walk = (x, y, path, seed) => {
  if (x === y) return;
  if (typeof x === 'string' && typeof y === 'string') { moved++; const p = path.replace(/\[\d+\]/g, '[]'); byPath[p] = (byPath[p] || 0) + 1; if (back(y) === x) ok++; else bad.push(`${seed} ${path}: ${x.slice(0, 120)} => ${y.slice(0, 120)}`); return; }
  if (!x || !y || typeof x !== 'object' || typeof y !== 'object') { if (JSON.stringify(x) !== JSON.stringify(y)) bad.push(`${seed} ${path}: ${JSON.stringify(x)?.slice(0, 100)} => ${JSON.stringify(y)?.slice(0, 100)}`); return; }
  if (Array.isArray(x)) { if (x.length !== y.length) { bad.push(`${seed} ${path}: length ${x.length} => ${y.length}`); return; } x.forEach((v, i) => walk(v, y[i], `${path}[${i}]`, seed)); return; }
  for (const k of new Set([...Object.keys(x), ...Object.keys(y)])) if (!(path === '' && SKIP.has(k))) walk(x[k], y[k], path ? `${path}.${k}` : k, seed);
};
for (const { seed, s } of L(B)) walk(a[seed], s, '', seed);
console.log(`moved string leaves ${moved}; back-substitute ${ok}; FAIL ${bad.length}`);
for (const [p, n] of Object.entries(byPath).sort((x, y) => y[1] - x[1])) console.log(`  ${n}\t${p}`);
bad.slice(0, 30).forEach((l) => console.log('FAIL ' + l));
