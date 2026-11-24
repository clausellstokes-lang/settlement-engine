// node dl.mjs <tree> <C|V> <seed...>: the Daily Life slot texts of each birth (outsider + all), one JSON line a seed
const [tree, corpus, ...seeds] = process.argv.slice(2);
const R = `${tree}/src/`;
const { generateSettlementPipeline } = await import(R + 'generators/generateSettlementPipeline.js');
const { birthConfig, loadGenerationLawPayloads } = await import(R + 'domain/density/densityCreateBoundary.js');
const { DEFAULT_CONFIG } = await import(R + 'store/configSlice.js');
const { deriveDailyLife } = await import(R + 'domain/dailyLife.js');
await loadGenerationLawPayloads();
for (const seed of seeds) {
  const settType = seed.split('-')[1];
  const config = corpus === 'C' ? { settType } : { ...DEFAULT_CONFIG, settType, _randomizePriorities: true };
  const s = generateSettlementPipeline(birthConfig(config), null, { seed, customContent: {} });
  const slots = deriveDailyLife(s, { audience: 'owner' }).slots;
  console.log(JSON.stringify({ seed, slots: Object.fromEntries(Object.entries(slots).map(([k, v]) => [k, v?.text || ''])) }));
}
