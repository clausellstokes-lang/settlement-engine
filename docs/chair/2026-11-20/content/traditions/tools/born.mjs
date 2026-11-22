// born.mjs <repoRoot> <outFile>: births the golden master's corpus and censusPlan('r2'), one JSON line a document.
import { writeFileSync } from 'node:fs';
const [, , root, outFile] = process.argv;
const { generateSettlementPipeline } = await import(root + '/src/generators/generateSettlementPipeline.js');
const { goldenCorpus } = await import(root + '/tests/helpers/goldenMasterCorpus.js');
const { censusPlan, configOf } = await import(root + '/tests/components/pageCensusWalk.shared.mjs');
const { birthConfig, loadGenerationLawPayloads } = await import(root + '/src/domain/density/densityCreateBoundary.js');
const { DEFAULT_CONFIG } = await import(root + '/src/store/configSlice.js');
const out = [];
for (const row of goldenCorpus()) {
  const { _seed, ...cfg } = row;
  out.push(JSON.stringify(['gm', row, generateSettlementPipeline(cfg, null, { seed: _seed, customContent: {} })]));
}
await loadGenerationLawPayloads();
for (const row of censusPlan('r2')) {
  out.push(JSON.stringify(['r2', row, generateSettlementPipeline(configOf(row, DEFAULT_CONFIG, birthConfig), null, { seed: row.seed, customContent: {} })]));
}
writeFileSync(outFile, out.join('\n') + '\n');
console.log(`documents=${out.length}`);
