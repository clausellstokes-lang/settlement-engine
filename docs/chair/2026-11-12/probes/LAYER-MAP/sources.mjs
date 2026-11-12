// LAYER-MAP sources.mjs — STATIC (regex shape counts): the lines that are not the state-prose corpus.
// (1) every src file's 3+-word string literals (a regex shape count, like the class table's);
// (2) the import graph: which pipeline STEP's import closure reaches each file under src/data and src/generators,
//     so a generator-time pool's layer CEILING is the step that can draw it (it can read only what exists there);
// (3) files reached by no step are display-time (they read the finished record: any layer).
// Run: TREE=<tree> node sources.mjs > sources.json
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, dirname, resolve, relative } from 'node:path';
const T = process.env.TREE || process.cwd();
const files = []; const walk = (d) => { for (const n of readdirSync(d)) { const p = join(d, n); const st = statSync(p); if (st.isDirectory()) walk(p); else if (/\.(m?js|jsx)$/.test(n)) files.push(p); } };
walk(join(T, 'src'));
const rel = (p) => relative(T, p);
const src = Object.fromEntries(files.map((f) => [f, readFileSync(f, 'utf8')]));
const resolveImp = (from, spec) => { if (!spec.startsWith('.')) return null; let p = resolve(dirname(from), spec); for (const c of [p, p + '.js', p + '.jsx', p + '.mjs', join(p, 'index.js')]) if (existsSync(c) && statSync(c).isFile()) return c; return null; };
const deps = {}; for (const f of files) { deps[f] = new Set(); for (const m of src[f].matchAll(/(?:from\s+|import\s*\(\s*|import\s+)['"]([^'"]+)['"]/g)) { const r = resolveImp(f, m[1]); if (r) deps[f].add(r); } }
const closure = (start) => { const seen = new Set([start]); const st = [start]; while (st.length) { const x = st.pop(); for (const y of deps[x] || []) if (!seen.has(y)) { seen.add(y); st.push(y); } } return seen; };
// step -> layer of what exists when it runs (the highest stored layer it may read): from steps.json's contract
const STEP_LAYER = { resolveConfig: 0, buildGenerationContext: 0, resolveResources: 0, resolveStress: 0, resolveNeighbour: 0, assembleInstitutions: 0, subsumptionPass: 0, cascadePass: 0, isolationPass: 0, stressConfirmPass: 0, generateEconomy: 0, generatePower: 1, neighbourFactions: 1, factionCorrelationPass: 2, coherenceRepairPass: 0, economyReconcilePass: 1, powerEconomyReconcilePass: 1, structuralValidationPass: 0, generatePopulation: 2, generateNarratives: 2, assembleSettlement: 3, resolveCrisisCast: 4 };
const stepOf = {}; // file -> lowest step-ceiling that reaches it
for (const [step, ceil] of Object.entries(STEP_LAYER)) {
  const f = join(T, 'src/generators/steps', step + '.js'); if (!existsSync(f)) continue;
  for (const g of closure(f)) { const r = rel(g); if (!stepOf[r] || stepOf[r].ceil > ceil) stepOf[r] = { step, ceil }; }
}
// 3+-word string literals: '…', "…", `…` (template text with ${} counted as one literal), not followed by ':' (an object key)
const LIT = /'((?:[^'\\\n]|\\.)*)'|"((?:[^"\\\n]|\\.)*)"|`((?:[^`\\]|\\.)*)`/g;
const words = (s) => s.replace(/\$\{[^}]*\}/g, ' X ').trim().split(/\s+/).filter((w) => /[a-z]/i.test(w)).length;
const strip = (s) => s.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' ')).replace(/(^|[^:'"`\\])\/\/[^\n]*/g, '$1');
const perFile = {};
for (const f of files) {
  const code = strip(src[f]); let n = 0;
  for (const m of code.matchAll(LIT)) { const s = m[1] ?? m[2] ?? m[3] ?? ''; const after = code.slice(m.index + m[0].length).match(/^\s*:/); if (!after && words(s) >= 3 && !/^\s*(?:import|export)\b/.test(s)) n++; }
  // JSX text of 3+ words
  if (f.endsWith('.jsx')) for (const m of code.matchAll(/>\s*([A-Za-z][^<>{}\n]{6,})\s*</g)) if (words(m[1]) >= 3) n++;
  perFile[rel(f)] = n;
}
const roots = ['src/data', 'src/generators', 'src/domain', 'src/components'];
const out = { files: files.length, byRoot: {} };
for (const r of roots) {
  const b = out.byRoot[r] = { literals: 0, byCeiling: {}, displayTime: 0, files: 0 };
  for (const [f, n] of Object.entries(perFile)) if (f.startsWith(r + '/')) {
    b.literals += n; b.files++;
    if (f.startsWith('src/domain/display/stateProse') || f.startsWith('src/data/dossierStateProse')) { b.stateProseFiles = (b.stateProseFiles || 0) + n; continue; }
    const s = stepOf[f];
    if (s) { const k = `L${s.ceil} (${s.step})`; b.byCeiling[k] = (b.byCeiling[k] || 0) + n; } else b.displayTime += n;
  }
}
out.topFilesByCeiling = Object.entries(perFile).filter(([f, n]) => n >= 40 && (f.startsWith('src/data') || f.startsWith('src/generators'))).map(([f, n]) => ({ f, n, at: stepOf[f] ? `L${stepOf[f].ceil} ${stepOf[f].step}` : 'display-time' })).sort((a, b) => b.n - a.n).slice(0, 40);
console.log(JSON.stringify(out, null, 1));
