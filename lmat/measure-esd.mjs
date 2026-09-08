import { readFileSync, existsSync, statSync, readdirSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
const ROOT = process.argv[2];
const SRC = join(ROOT, 'src');
const walk = (d, out = []) => {
  if (!existsSync(d)) return out;
  for (const e of readdirSync(d)) {
    const p = join(d, e);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.jsx?$/.test(e)) out.push(p);
  }
  return out;
};
const resolveRel = (from, spec) => {
  if (!spec.startsWith('.')) return null;
  const base = resolve(dirname(from), spec);
  for (const c of [base, `${base}.js`, `${base}.jsx`, join(base, 'index.js'), join(base, 'index.jsx')])
    if (existsSync(c) && statSync(c).isFile()) return c;
  return null;
};
const importsOf = (file) => {
  const code = readFileSync(file, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
  const specs = [];
  for (const m of code.matchAll(/(?:^|[^.\w])import\s+(?:[^'"]*?\sfrom\s+)?['"]([^'"]+)['"]/g)) specs.push(m[1]);
  for (const m of code.matchAll(/(?:^|[^.\w])export\s+[^'"]*?\sfrom\s+['"]([^'"]+)['"]/g)) specs.push(m[1]);
  return specs.map((s) => resolveRel(file, s)).filter(Boolean);
};
const DOMAIN = `${join(SRC, 'domain')}/`;
const seed = new Set();
for (const g of walk(join(SRC, 'generators')))
  for (const dep of importsOf(g)) if (dep.startsWith(DOMAIN)) seed.add(dep);
const seen = new Set(seed);
const queue = [...seed];
while (queue.length) {
  const f = queue.shift();
  for (const dep of importsOf(f)) if (dep.startsWith(DOMAIN) && !seen.has(dep)) { seen.add(dep); queue.push(dep); }
}
const frags = new Set([...seen].map((p) => p.slice(ROOT.length)));
console.log('ESD_RAW_MEMBERS=' + frags.size);
for (const p of ['/src/domain/density/densityCreateBoundary.js','/src/domain/density/densityLaw.js','/src/domain/content/livingContentLaw.js','/src/domain/content/livingContentLawVersion.js','/src/domain/content/livingContentSeam.js','/src/domain/content/livingContentRoster.js','/src/domain/content/settlementContentProvenance.js','/src/domain/content/customDefinitionIdentityProjection.js','/src/domain/content/customContentManifest.js'])
  console.log('ESD_RAW[' + p + ']=' + frags.has(p));
