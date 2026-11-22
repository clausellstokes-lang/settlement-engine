const T = process.argv[2];
const { DEFAULT_CONFIG } = await import(`${T}/src/store/configSlice.js`);
const { generateSettlementPipeline } = await import(`${T}/src/generators/generateSettlementPipeline.js`);
const { birthConfig, loadGenerationLawPayloads } = await import(`${T}/src/domain/density/densityCreateBoundary.js`);
const { defencePartsOf } = await import(`${T}/src/generators/defenseGenerator.js`);
await loadGenerationLawPayloads();
const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
const ARMED = new Set(['garrison', 'militia', 'watch', 'company', 'charter', 'households', 'wardens']);
for (const lit of [false, true]) {
  const base = birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: 'village' });
  const s = generateSettlementPipeline(lit ? { ...base, _fortuneLawVersion: 2 } : base, null, { seed: 'v3build-village-3', customContent: {} });
  globalThis.__X4 = [];
  const parts = defencePartsOf(s);
  const x4 = globalThis.__X4; globalThis.__X4 = null;
  const will = parts.find((p) => p.id === 'will');
  const armed = parts.filter((p) => ARMED.has(p.id)).reduce((a, p) => a + p.points, 0);
  console.log(`=== ${lit ? 'LIT' : 'DARK'} prosp=${s.economicState?.prosperity} parts=${parts.length} will.points=${will?.points} will.held=${will?.held} armed=${armed} bound=${armed + 0.1 * parts.length}`);
  console.log('  parts', JSON.stringify(parts.map((p) => [p.id, p.group, +p.points.toFixed(4), p.dims])));
  console.log('  X4', JSON.stringify(x4));
}
