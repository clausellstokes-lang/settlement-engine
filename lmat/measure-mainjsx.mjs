import { readFileSync, existsSync, statSync } from 'node:fs';
import { resolve, dirname, join, relative } from 'node:path';
const ROOT = process.argv[2];
const SRC = join(ROOT, 'src');
const resolveRel = (from, spec) => {
  if (!spec.startsWith('.')) return null;
  const base = resolve(dirname(from), spec);
  for (const c of [base, `${base}.js`, `${base}.jsx`, join(base, 'index.js'), join(base, 'index.jsx')])
    if (existsSync(c) && statSync(c).isFile()) return c;
  return null;
};
const importsOf = (file) => {
  const code = readFileSync(file, 'utf8')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/^\s*\/\/.*$/gm, '');
  const specs = [];
  for (const m of code.matchAll(/(?:^|[^.\w])import\s+(?:[^'"()]*?\sfrom\s+)?['"]([^'"]+)['"]/g)) specs.push(m[1]);
  for (const m of code.matchAll(/(?:^|[^.\w])export\s+[^'"]*?\sfrom\s+['"]([^'"]+)['"]/g)) specs.push(m[1]);
  return specs.map((s) => resolveRel(file, s)).filter(Boolean);
};
const entry = join(SRC, 'main.jsx');
const seen = new Set([entry]);
const queue = [entry];
while (queue.length) {
  const f = queue.shift();
  for (const dep of importsOf(f)) if (!seen.has(dep)) { seen.add(dep); queue.push(dep); }
}
const rel = [...seen].map(p => relative(ROOT, p)).sort();
console.log('MAINJSX_CLOSURE=' + rel.length);
for (const p of ['src/domain/density/densityCreateBoundary.js','src/domain/density/densityLaw.js','src/store/settlementSliceHelpers.js','src/domain/content/livingContentLaw.js','src/domain/content/livingContentLawVersion.js'])
  console.log('IN[' + p + ']=' + rel.includes(p));
if (process.env.DUMP === '1') for (const e of rel) console.log('M ' + e);
