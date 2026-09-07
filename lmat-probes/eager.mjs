import { readFileSync, existsSync, statSync } from 'node:fs';
import { resolve, dirname, join, relative } from 'node:path';
const ROOT = process.argv[2];
const SUPPRESS = process.argv[3] || ''; // "from::specifier" edge to suppress
const SRC = resolve(ROOT, 'src');
const strip = code => code.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
function staticSpecifiers(file) {
  const code = strip(readFileSync(file, 'utf8'));
  const out = new Set();
  for (const m of code.matchAll(/(?:^|[^.\w])import\s+(?:[^'"()]*?\sfrom\s+)?['"]([^'"]+)['"]/g)) out.add(m[1]);
  for (const m of code.matchAll(/(?:^|[^.\w])export\s+[^'"]*?\sfrom\s+['"]([^'"]+)['"]/g)) out.add(m[1]);
  return [...out];
}
function resolveRelative(from, specifier) {
  if (!specifier.startsWith('.')) return null;
  const base = resolve(dirname(from), specifier);
  for (const candidate of [base, `${base}.js`, `${base}.jsx`, join(base, 'index.js'), join(base, 'index.jsx')])
    if (existsSync(candidate) && statSync(candidate).isFile()) return candidate;
  return null;
}
const entry = resolve(SRC, 'main.jsx');
const seen = new Set([entry]); const queue = [entry];
while (queue.length) {
  const file = queue.shift();
  for (const spec of staticSpecifiers(file)) {
    const dep = resolveRelative(file, spec);
    if (!dep || seen.has(dep)) continue;
    if (SUPPRESS && `${relative(ROOT, file)}::${relative(ROOT, dep)}` === SUPPRESS) continue;
    seen.add(dep); queue.push(dep);
  }
}
const rels = [...seen].map(f => relative(ROOT, f)).sort();
console.log('SIZE', rels.length);
for (const probe of ['src/domain/density/densityCreateBoundary.js','src/domain/density/densityLaw.js','src/store/settlementSliceHelpers.js','src/store/settlementSlice.js','src/domain/content/livingContentLaw.js','src/domain/content/livingContentLawVersion.js','src/domain/content/livingContentSeam.js','src/domain/content/livingContentRoster.js','src/store/settlementGenerateAction.js','src/lib/instantWorld/composeInstantWorld.js','src/generators/generateSettlementPipeline.js','src/domain/content/settlementContentProvenance.js'])
  console.log((rels.includes(probe) ? 'EAGER    ' : 'not-eager') , probe);
if (process.env.DUMP) console.log(rels.join('\n'));
