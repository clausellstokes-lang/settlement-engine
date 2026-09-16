import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { createRequire } from 'node:module';
const ROOT = process.argv[2];
const require = createRequire(join(ROOT, 'package.json'));
const { Linter } = require('eslint');
const linter = new Linter({ configType: 'flat' });
const LANG = { ecmaVersion: 'latest', sourceType: 'module', parserOptions: { ecmaFeatures: { jsx: true } } };
function eff(p) {
  const code = readFileSync(p, 'utf8');
  const msgs = linter.verify(code, { languageOptions: LANG, rules: { 'max-lines': ['error', { max: 1, skipBlankLines: true, skipComments: true }] } });
  const m = msgs.find((x) => x.ruleId === 'max-lines');
  return m ? Number(String(m.message).match(/\((\d+)\)/)[1]) : 1;
}
function ceilingFor(rel) {
  if (/^src\/components\/.*\.jsx$/.test(rel)) return 600;
  if (/^src\/components\/.*\.js$/.test(rel)) return 800;
  if (/^src\/[^/]+\.jsx$/.test(rel)) return 600;
  if (/^src\/[^/]+\.js$/.test(rel)) return 800;
  if (/^src\/generators\/.*\.js$/.test(rel)) return 800;
  if (/^src\/domain\/.*\.js$/.test(rel)) return 800;
  if (/^src\/(store|pdf|lib|hooks|utils)\/.*\.(js|jsx)$/.test(rel)) return 800;
  return null;
}
function walk(d, out=[]) { for (const e of readdirSync(d)) { const p = join(d, e); if (statSync(p).isDirectory()) walk(p, out); else out.push(p); } return out; }
const raw = JSON.parse(readFileSync(join(ROOT, 'scripts/.size-baseline.json'), 'utf8'));
const rows = [];
for (const p of walk(join(ROOT, 'src'))) {
  const rel = relative(ROOT, p);
  if (!/\.(js|jsx)$/.test(rel) || /\.test\./.test(rel)) continue;
  const c = ceilingFor(rel); if (c == null) continue;
  const e = eff(p);
  const cap = raw[rel] ?? c;
  const slack = cap - e;
  if (slack <= 20) rows.push([slack, e, cap, rel, raw[rel] ? 'BASELINED' : 'layer']);
}
rows.sort((a,b)=>a[0]-b[0]);
console.log('FILES WITHIN 20 EFF LINES OF THEIR CEILING:', rows.length);
for (const r of rows) console.log(`slack ${String(r[0]).padStart(3)}  ${r[1]}/${r[2]}  ${r[3]}  (${r[4]})`);
