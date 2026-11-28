const W = process.argv[2];
const sh = await import(W + '/tests/lint/presumedThings.shared.mjs');
const { generateSettlementPipeline } = await import(W + '/src/generators/generateSettlementPipeline.js');
const { loadGenerationLawPayloads } = await import(W + '/src/domain/density/densityCreateBoundary.js');
const { createHash } = await import('node:crypto');
await loadGenerationLawPayloads();
for (const { tier, seed } of sh.corpusSeeds()) {
  const s = generateSettlementPipeline({ ...sh.corpusConfig(tier) }, null, { seed, customContent: {} });
  const { pressureSentence, ...rest } = s;
  console.log(seed, createHash('sha1').update(JSON.stringify(rest)).digest('hex').slice(0, 10), pressureSentence);
}
