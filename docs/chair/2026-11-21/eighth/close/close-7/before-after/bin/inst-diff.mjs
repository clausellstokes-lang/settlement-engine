import { readFileSync } from 'node:fs';
const [A, Bt, planFile, seedsFile] = process.argv.slice(2);
const load = async (T) => { const g = await import(T + '/src/generators/generateSettlementPipeline.js'); const d = await import(T + '/src/domain/density/densityCreateBoundary.js'); await d.loadGenerationLawPayloads(); return (c, seed) => g.generateSettlementPipeline(d.birthConfig(c), null, { seed, customContent: {} }); };
const ga = await load(A); const gb = await load(Bt);
const plan = Object.fromEntries(JSON.parse(readFileSync(planFile, 'utf8')).map((r) => [r.seed, r]));
const names = (s) => (s.institutions || []).map((i) => i.name);
const tally = {};
for (const seed of readFileSync(seedsFile, 'utf8').trim().split('\n')) {
  const { config } = plan[seed]; const a = names(ga(config, seed)); const b = names(gb(config, seed));
  const lost = a.filter((n) => !b.includes(n)); const got = b.filter((n) => !a.includes(n));
  const k = `-[${lost.join(', ')}] +[${got.join(', ')}]`; tally[k] = (tally[k] || 0) + 1;
  console.log(seed + '\t' + k);
}
console.log('TALLY ' + JSON.stringify(tally));
