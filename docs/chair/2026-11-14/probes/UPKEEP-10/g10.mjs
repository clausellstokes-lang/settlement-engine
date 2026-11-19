// UPKEEP-10: one birth in the income test's reader shape (rr2s/rww), its grain line, failed source, exports.
const T = process.env.TREE;
const { DEFAULT_CONFIG } = await import(T + '/src/store/configSlice.js');
const { birthConfig, loadGenerationLawPayloads } = await import(T + '/src/domain/density/densityCreateBoundary.js');
const { generateSettlementPipeline } = await import(T + '/src/generators/generateSettlementPipeline.js');
await loadGenerationLawPayloads();
function cfgFor(seed) {
  const m = /^(rr2s|rww)-(\w+?)-([a-z_+]+?)(?:-(rand|port))?-(\d+)$/.exec(seed);
  return birthConfig({ ...DEFAULT_CONFIG, ...(m[4] === 'port' ? { tradeRouteAccess: 'port' } : {}), settType: m[2],
    selectedStressesRandom: false, selectedStresses: m[3] === 'calm' ? [] : m[3].split('+'), _randomizePriorities: true });
}
for (const seed of process.argv.slice(2)) {
  const s = generateSettlementPipeline(cfgFor(seed), null, { seed, customContent: {} });
  const es = s.economicState;
  const g = es.incomeSources.filter((e) => /Grain|Agricultur|Farm/i.test(e.source)).map((e) => `${e.source}: ${e.desc}`);
  console.log(seed, '| failed', es.foodSecurity?.foodRecord?.failedSource, '| exports', JSON.stringify(es.primaryExports.filter((x) => /flour|grain/i.test(x))), '|', JSON.stringify(g));
}
