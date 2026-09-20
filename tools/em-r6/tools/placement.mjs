/**
 * placement.mjs — EM-R6: where `factionRename.js` sits in every budgeted closure,
 * measured two ways (the repo's OWN eager derivation, and an independent
 * static+dynamic graph walk), plus the edge-shared INPUT membership check.
 */
import { readFileSync, existsSync, statSync, readdirSync } from 'node:fs';
import { resolve, dirname, join, relative } from 'node:path';

const TREE = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/923472dc-319b-4b73-9e42-fa911739df78/scratchpad/read-tip-ad7ddf2c9';
process.chdir(TREE);

const TARGETS = [
  'src/domain/factionRename.js',
  'src/domain/clone.js',
  'src/domain/rulingPower.js',
  'src/lib/narrativeMutations.js',
  'src/domain/townMap/anchors.js',
];

// ── Method A: the repo's own eager derivation ──
let eagerRel = null;
try {
  const cfg = await import(`${TREE}/vite.config.js`);
  eagerRel = new Set([...cfg.EAGER_FIRST_PAINT_MODULES].map(a => relative(TREE, a).split('\\').join('/')));
  console.log(`METHOD A — vite.config.js EAGER_FIRST_PAINT_MODULES: ${eagerRel.size} modules`);
  console.log('  control src/store/settlementSlice.js eager?', eagerRel.has('src/store/settlementSlice.js'));
  for (const t of TARGETS) console.log(`  ${t} eager?`, eagerRel.has(t));
} catch (e) {
  console.log('METHOD A FAILED:', e.message);
}

// ── Method B: independent static (+optionally dynamic) closure from any entry ──
const resolveRel = (from, spec) => {
  if (!spec.startsWith('.')) return null;
  const base = resolve(dirname(from), spec);
  for (const c of [base, `${base}.js`, `${base}.jsx`, join(base, 'index.js'), join(base, 'index.jsx')]) {
    if (existsSync(c) && statSync(c).isFile()) return c;
  }
  return null;
};
function importsOf(file, { dynamic }) {
  const code = readFileSync(file, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
  const specs = [];
  for (const m of code.matchAll(/(?:^|[^.\w])import\s+(?:[^'"()]*?\sfrom\s+)?['"]([^'"]+)['"]/g)) specs.push(m[1]);
  for (const m of code.matchAll(/(?:^|[^.\w])export\s+[^'"]*?\sfrom\s+['"]([^'"]+)['"]/g)) specs.push(m[1]);
  if (dynamic) for (const m of code.matchAll(/import\(\s*['"]([^'"]+)['"]\s*\)/g)) specs.push(m[1]);
  return specs.map(s => resolveRel(file, s)).filter(Boolean);
}
function closure(entries, { dynamic }) {
  const seen = new Set(); const q = [];
  for (const e of entries) { const a = resolve(TREE, e); if (existsSync(a)) { seen.add(a); q.push(a); } }
  while (q.length) {
    const f = q.shift();
    for (const d of importsOf(f, { dynamic })) if (!seen.has(d)) { seen.add(d); q.push(d); }
  }
  return new Set([...seen].map(a => relative(TREE, a).split('\\').join('/')));
}

const report = (label, entries, dynamic) => {
  const c = closure(entries, { dynamic });
  console.log(`\nMETHOD B — ${label} (${dynamic ? 'static+dynamic' : 'static only'}): ${c.size} modules`);
  for (const t of TARGETS) console.log(`  ${t}:`, c.has(t) ? '⛔ IN CLOSURE' : 'absent');
  return c;
};

report('generation worker', ['src/workers/generation.worker.js'], false);
report('generation worker', ['src/workers/generation.worker.js'], true);
report('app entry', ['src/main.jsx'], false);

// ── the lazy `engine` chunk rule: id.includes('/src/generators/') ──
console.log('\nENGINE CHUNK RULE — a module lands in `engine` iff its id contains /src/generators/:');
for (const t of TARGETS) console.log(`  ${t}:`, t.includes('src/generators/') ? 'IN engine' : 'not in engine');

// ── edge-shared INPUT membership (§P2 row 10) ──
const sharedDir = join(TREE, 'supabase/functions/_shared');
if (existsSync(sharedDir)) {
  const metas = readdirSync(sharedDir).filter(f => f.endsWith('.meta.json'));
  console.log(`\nEDGE-SHARED — ${metas.length} metas:`);
  let totalInputs = 0;
  for (const m of metas) {
    const j = JSON.parse(readFileSync(join(sharedDir, m), 'utf8'));
    const inputs = j.inputs || j.files || [];
    totalInputs += inputs.length;
    const hits = TARGETS.filter(t => inputs.some(i => String(i).includes(t)));
    console.log(`  ${m}: ${inputs.length} inputs; hits: ${hits.length ? hits.join(', ') : 'NONE'}`);
  }
  console.log(`  total inputs across all metas: ${totalInputs}`);
}

// ── who would import an institutionRename.js: the declared consumers ──
console.log('\nDECLARED FUTURE CONSUMERS — do src/domain/edit/** modules exist at this tip?');
const editDir = join(TREE, 'src/domain/edit');
console.log('  src/domain/edit exists?', existsSync(editDir), existsSync(editDir) ? readdirSync(editDir) : '');
