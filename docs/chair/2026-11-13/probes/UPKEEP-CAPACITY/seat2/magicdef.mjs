const [T] = process.argv.slice(2);
const { generateSettlementPipeline } = await import(T + '/src/generators/generateSettlementPipeline.js');
const { goldenCorpus, keyOf } = await import(T + '/tests/helpers/goldenMasterCorpus.js');
const { loadGenerationLawPayloads } = await import(T + '/src/domain/density/densityCreateBoundary.js');
await loadGenerationLawPayloads();
const multi = [];
for (const config of goldenCorpus()) { const { _seed, ...cfg } = config; const s = generateSettlementPipeline(cfg, null, { seed: _seed, customContent: {} });
  const m = s.defenseProfile.institutions.magicDef; if (m.length > 1) multi.push([keyOf(config), m.map((i) => `${i.name}:${i.baseChance}`).join(', '), m.reduce((a, i) => a + (i.baseChance || 0), 0)]); }
console.log(multi.length, JSON.stringify(multi));
