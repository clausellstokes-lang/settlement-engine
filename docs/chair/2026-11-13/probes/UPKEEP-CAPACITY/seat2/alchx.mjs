// alchx.mjs <scratch tree with computeDefenseScores exported>: Ioannoakra, shop against quarter, every score unrounded
const T = process.argv[2];
const { generateSettlementPipeline } = await import(T + '/src/generators/generateSettlementPipeline.js');
const { birthConfig, loadGenerationLawPayloads } = await import(T + '/src/domain/density/densityCreateBoundary.js');
const { DEFAULT_CONFIG } = await import(T + '/src/store/configSlice.js');
const { computeDefenseScores } = await import(T + '/src/generators/defenseGenerator.js');
const { keepOfRecord } = await import(T + '/src/domain/facts/keep.js');
await loadGenerationLawPayloads();
const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
const s = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: 'town', selectedStresses: ['wartime'], selectedStressesRandom: false }), null, { seed: 'cold-wartime-town-75', customContent: {} });
const q = { ...s, institutions: s.institutions.map((i) => (i.name === 'Alchemist shop' ? { ...i, name: 'Alchemist quarter' } : i)) };
const k = keepOfRecord(s.economicState);
for (const [lab, x] of [['shop', s], ['quarter', q]]) {
  const r = computeDefenseScores(x, k);
  const sus = r.parts.filter((p) => p.group === 'SUSTAINS').map((p) => `${p.id} raw ${JSON.stringify(Object.fromEntries(Object.entries(p.raw).map(([d, v]) => [d, +v.toFixed(2)])))} held ${JSON.stringify(Object.fromEntries(Object.entries(p.dims).map(([d, v]) => [d, +v.toFixed(2)])))}`);
  console.log(`== ${lab}: dims ${JSON.stringify(Object.fromEntries(Object.entries(r.dims).map(([d, v]) => [d, +v.toFixed(3)])))} sustainsHeld ${r.sustainsHeld.toFixed(3)} total ${r.total.toFixed(3)}`);
  for (const l of sus) console.log('   ' + l);
}
