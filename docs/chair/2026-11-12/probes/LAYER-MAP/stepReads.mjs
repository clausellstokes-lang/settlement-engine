// LAYER-MAP stepReads.mjs — STATIC (regex shape count): declared atoms in generator-time pools against the step that
// draws them. A line drawn at a pipeline step can read only what exists there: stored layers ≤ the step's ceiling,
// so facts of layer ≤ ceiling+1. An atom whose fact's measured layer (perturb.json, `atom <dim>`) is higher is a
// declaration answered from a PARTIAL record (birthFactsOf) and re-asserted only at the end: a read of a higher layer.
// Run: TREE=<tree> PERTURB=perturb.json node stepReads.mjs > stepReads.json
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, dirname, resolve, relative } from 'node:path';
const T = process.env.TREE || process.cwd();
const { parseAtom } = await import(T + '/src/domain/facts/factVocabulary.js');
const P = JSON.parse(readFileSync(process.env.PERTURB, 'utf8'));
const atomLayer = Object.fromEntries(P.facts.filter((f) => f.fact.startsWith('atom ')).map((f) => [f.fact.slice(5), f.layer]));
// band atoms (and two presences) the perturbation could not test bare (no comparator): their home fact's measured layer
Object.assign(atomLayer, { tier: 1, population: 1, 'magic level': 1, magic: 1, food: 2, stores: 2, prosperity: 2, crime: 3, priest: 3 });
const files = []; const walk = (d) => { for (const n of readdirSync(d)) { const p = join(d, n); if (statSync(p).isDirectory()) walk(p); else if (/\.(m?js|jsx)$/.test(n)) files.push(p); } };
walk(join(T, 'src'));
const src = Object.fromEntries(files.map((f) => [f, readFileSync(f, 'utf8')]));
const resolveImp = (from, spec) => { if (!spec.startsWith('.')) return null; const p = resolve(dirname(from), spec); for (const c of [p, p + '.js', p + '.jsx', p + '.mjs', join(p, 'index.js')]) if (existsSync(c) && statSync(c).isFile()) return c; return null; };
const deps = {}; for (const f of files) { deps[f] = new Set(); for (const m of src[f].matchAll(/(?:from\s+|import\s*\(\s*|import\s+)['"]([^'"]+)['"]/g)) { const r = resolveImp(f, m[1]); if (r) deps[f].add(r); } }
const closure = (s) => { const seen = new Set([s]); const st = [s]; while (st.length) { const x = st.pop(); for (const y of deps[x] || []) if (!seen.has(y)) { seen.add(y); st.push(y); } } return seen; };
const STEP_LAYER = { resolveConfig: 0, buildGenerationContext: 0, resolveResources: 0, resolveStress: 0, resolveNeighbour: 0, assembleInstitutions: 0, subsumptionPass: 0, cascadePass: 0, isolationPass: 0, stressConfirmPass: 0, generateEconomy: 0, generatePower: 1, neighbourFactions: 1, factionCorrelationPass: 2, coherenceRepairPass: 0, economyReconcilePass: 1, powerEconomyReconcilePass: 1, structuralValidationPass: 0, generatePopulation: 2, generateNarratives: 2, assembleSettlement: 3, resolveCrisisCast: 4 };
const stepOf = {};
for (const [step, ceil] of Object.entries(STEP_LAYER)) { const f = join(T, 'src/generators/steps', step + '.js'); if (!existsSync(f)) continue; for (const g of closure(f)) { const r = relative(T, g); if (!stepOf[r] || stepOf[r].ceil > ceil) stepOf[r] = { step, ceil }; } }
const out = { atomLayer, files: {}, totals: { atoms: 0, aboveCeiling: 0, displayTime: 0 }, byDim: {} };
for (const f of files) {
  const r = relative(T, f); if (!(r.startsWith('src/data/') || r.startsWith('src/generators/'))) continue;
  if (r.startsWith('src/data/dossierStateProse')) continue;
  const at = stepOf[r];
  for (const m of src[f].matchAll(/\b(?:needs|excludes|tags|requires|poolDeclares)\s*:\s*\[([^\]]*)\]/g)) {
    for (const q of m[1].matchAll(/['"]([^'"]+)['"]/g)) {
      const a = parseAtom(q[1]); if (!a) continue;
      const dim = a.dimension; const lay = atomLayer[dim];
      out.totals.atoms++;
      const row = (out.files[r] ||= { step: at ? at.step : 'display-time', ceil: at ? at.ceil : null, atoms: 0, above: 0, dims: {} });
      row.atoms++; row.dims[dim] = (row.dims[dim] || 0) + 1;
      const b = (out.byDim[dim] ||= { layer: lay, atoms: 0, above: 0 }); b.atoms++;
      if (!at) { out.totals.displayTime++; continue; }
      if (lay != null && lay > at.ceil + 1) { row.above++; b.above++; out.totals.aboveCeiling++; }
    }
  }
}
console.log(JSON.stringify(out, null, 1));
