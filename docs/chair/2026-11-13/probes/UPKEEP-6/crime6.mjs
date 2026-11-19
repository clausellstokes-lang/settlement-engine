// Ruling 3 measure: the Crime part and readiness with the stress removed from the crime reading only.
const root = process.argv[2]; const imp = (p) => import(`${root}/${p}`);
const { DEFAULT_CONFIG } = await imp('src/store/configSlice.js');
const { birthConfig, loadGenerationLawPayloads } = await imp('src/domain/density/densityCreateBoundary.js');
const { generateSettlementPipeline } = await imp('src/generators/generateSettlementPipeline.js');
const { generateDefenseProfile, defencePartsOf } = await imp('src/generators/defenseGenerator.js');
const { keepOfRecord } = await imp('src/domain/facts/keep.js');
const { getInstFlags } = await imp('src/generators/priorityHelpers.js');
await loadGenerationLawPayloads();
const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
const TIERS = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const [shard, shards] = [Number(process.argv[3] || 0), Number(process.argv[4] || 1)];
const rows = [];
for (const stress of ['famine', 'under_siege', 'wartime', 'succession_void']) for (const tier of TIERS) for (let i = 0; i < 30; i++) rows.push({ key: `crime6-${stress}-${tier}-${i}`, tier, stress });
for (let r = shard; r < rows.length; r += shards) {
  const row = rows[r];
  const s = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: row.tier, selectedStresses: [row.stress], selectedStressesRandom: false }), null, { seed: row.key, customContent: {} });
  const k = keepOfRecord(s.economicState);
  const calmCrime = { ...s, config: { ...s.config, stressTypes: [], stressType: undefined } };
  const a = defencePartsOf(s, k).find((p) => p.id === 'crime')?.points ?? 0;
  const b = defencePartsOf(calmCrime, k).find((p) => p.id === 'crime')?.points ?? 0;
  const sa = generateDefenseProfile(s, k).readiness.score, sb = generateDefenseProfile(calmCrime, k).readiness.score;
  const fa = getInstFlags(s.config, s.institutions).criminalEffective, fb = getInstFlags(calmCrime.config, s.institutions).criminalEffective;
  const n = s.config.magicExists === false ? 4 : 5;
  console.log(JSON.stringify({ key: row.key, stress: row.stress, tier: s.tier, crimeA: a, crimeB: b, intDelta: Math.round((b - a) * n * 10) / 10, scoreA: sa, scoreB: sb, critA: fa, critB: fb }));
}
