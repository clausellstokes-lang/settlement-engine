// node moved-why.mjs <treeA> <treeB> <plan.json> <seeds.txt> : per seed, carrier? (A's record names a C1 form) and the
// record paths (depth 2) that differ A -> B.
import { readFileSync } from 'node:fs';
const [A, Bt, planFile, seedsFile] = process.argv.slice(2);
const load = async (T) => { const g = await import(T + '/src/generators/generateSettlementPipeline.js'); const d = await import(T + '/src/domain/density/densityCreateBoundary.js'); await d.loadGenerationLawPayloads(); return (c, seed) => g.generateSettlementPipeline(d.birthConfig(c), null, { seed, customContent: {} }); };
const ga = await load(A); const gb = await load(Bt);
const plan = Object.fromEntries(JSON.parse(readFileSync(planFile, 'utf8')).map((r) => [r.seed, r]));
const FORMS = ['Corrupt City Council', 'Corrupt Council', 'Shadow Senate'];
const diff = (x, y, p, out, d) => { if (JSON.stringify(x) === JSON.stringify(y)) return; if (d >= 2 || typeof x !== 'object' || typeof y !== 'object' || !x || !y) { out.push(p); return; }
  for (const k of new Set([...Object.keys(x), ...Object.keys(y)])) diff(x[k], y[k], p + '.' + k, out, Array.isArray(x) ? d : d + 1); };
const tally = {};
for (const seed of readFileSync(seedsFile, 'utf8').trim().split('\n')) {
  const { config } = plan[seed]; const a = ga(config, seed); const b = gb(config, seed);
  const sa = JSON.stringify(a); const form = FORMS.find((f) => sa.includes(f)) || '-';
  const out = []; diff(a, b, '', out, 0);
  const keys = [...new Set(out.map((p) => p.split('.').slice(0, 2).join('.')))];
  tally[form === '-' ? 'non-carrier' : 'carrier'] = (tally[form === '-' ? 'non-carrier' : 'carrier'] || 0) + 1;
  console.log([seed, form, keys.slice(0, 8).join(' ')].join('\t'));
}
console.log('TALLY', JSON.stringify(tally));
