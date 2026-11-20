import { it, vi } from 'vitest';
import { writeFileSync } from 'node:fs';
vi.mock(`${process.env.RV6_SRC}/src/lib/supabase.js`, () => ({ supabase: { rpc: async () => ({ data: null, error: null }) }, isConfigured: true }));
it('present', async () => {
  const SRC = process.env.RV6_SRC;
  const { generateSettlementPipeline: gen } = await import(`${SRC}/src/generators/generateSettlementPipeline.js`);
  const density = await import(`${SRC}/src/domain/density/densityCreateBoundary.js`);
  const { DEFAULT_CONFIG } = await import(`${SRC}/src/store/configSlice.js`);
  const V = await import(`${SRC}/src/domain/display/galleryVeil.js`);
  const S = await import(`${SRC}/src/domain/display/criminalVeilSwitch.js`);
  await density.loadGenerationLawPayloads();
  const BROWSER = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
  const out = {};
  for (const [seed, tier] of [['vs-thorp-0','thorp'],['vs-thorp-3','thorp'],['vs-hamlet-0','hamlet'],['vs-hamlet-1','hamlet'],['vs-village-0','village'],['vs-village-2','village'],['vs-town-0','town'],['vs-town-2','town'],['vs-city-0','city'],['vs-city-1','city'],['vs-metropolis-0','metropolis'],['vs-metropolis-1','metropolis']]) {
    const born = gen(density.birthConfig({ ...DEFAULT_CONFIG, ...BROWSER, settType: tier }), null, { seed, customContent: {} });
    for (const shareDm of [false, true]) {
      const pub = V.galleryPayloadFor(born, { shareDm });
      const d = V.defaultVeilFor(pub);
      const present = S.presentCriminalGroupings(pub);
      const model = V.curateModelFor(pub, []);
      out[`${seed}${shareDm ? ' dm' : ''}`] = { present: [...present].sort(), parts: S.criminalPartsOf(d, [], present, model).length, state: S.criminalSwitchStateOf(d, [], present, model) };
    }
  }
  // a hand town with people and no criminal content under any grouping
  const quiet = { name: 'Quietford', tier: 'hamlet', institutions: [{ id: 'inst-mill', name: 'Mill', category: 'Economy' }], npcs: [{ id: 'n1', name: 'Ada', role: 'Miller' }] };
  const qp = S.presentCriminalGroupings(quiet);
  out.quietfordWithAPerson = { present: [...qp], state: S.criminalSwitchStateOf(V.defaultVeilFor(quiet), [], qp, V.curateModelFor(quiet, [])) };
  writeFileSync(process.env.RV9_OUT, JSON.stringify(out, null, 1));
}, 3600000);
