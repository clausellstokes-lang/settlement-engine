import path from 'node:path';
const tree = path.resolve(process.argv[2]); const imp = (p) => import(path.join(tree, p));
const { generateSettlementPipeline } = await imp('src/generators/generateSettlementPipeline.js');
const { factsOf } = await imp('src/domain/facts/factsOf.js');
const { liveInstitutionNames } = await imp('src/domain/facts/institutions.js');
const SH = await imp('tests/lint/presumedThings.shared.mjs');
const { birthConfig, loadGenerationLawPayloads } = await imp('src/domain/density/densityCreateBoundary.js');
await loadGenerationLawPayloads();
const seeds = SH.corpusSeeds().map(x => ({ ...x, cfg: SH.corpusConfig(x.tier) }));
const TIERS = ['thorp','hamlet','village','town','city','metropolis'];
const DIALS = SH.corpusConfig('town');
for (const t of TIERS) for (let i = 0; i < 150; i++) seeds.push({ tier: t, seed: `critique-${t}-${i}`, cfg: birthConfig({ ...DIALS, settType: t }) });
import('node:fs');
const STR = Object.keys((await imp('src/data/stressTypes.js')).STRESS_TYPE_MAP);
for (const st of STR) for (const t of TIERS) for (let i = 0; i < 20; i++) seeds.push({ tier: t, seed: `l2-${st}-${t}-${i}`, cfg: birthConfig({ ...DIALS, settType: t, selectedStresses: [st], selectedStressesRandom: false }) });
let printedAny = 0, absent = [];
for (const x of seeds) {
  const r = generateSettlementPipeline(x.cfg, null, { seed: x.seed, customContent: {} });
  if (JSON.stringify(r).includes("counting-house.")) printedAny++;
  for (const h of SH.printedAbsent(r, factsOf(r), liveInstitutionNames(r))) if (h.thing === 'bank' && /counting-house/.test(h.sentence)) absent.push(x.seed + ' ' + h.path);
}
console.log('births', seeds.length, 'printed', printedAny, 'absent', absent.length, absent.slice(0, 10));
