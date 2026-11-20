// R3-CURE (VR36): THE LARGEST BORN TOWN regenerated (r5-born.probe.jsx's R5_BIG pick: seed v11-ties-metropolis-infiltrated-6,
// the browser's dials, publicProse composed), written to RV9_OUT for big-cost.mjs.
import { it, vi } from 'vitest';
import { writeFileSync } from 'node:fs';
const SRC = process.env.RV6_SRC;
vi.mock(`${process.env.RV6_SRC}/src/lib/supabase.js`, () => ({ supabase: { rpc: async () => ({ data: null, error: null }) }, isConfigured: true }));
it('big town', async () => {
  const { generateSettlementPipeline: gen } = await import(`${SRC}/src/generators/generateSettlementPipeline.js`);
  const density = await import(`${SRC}/src/domain/density/densityCreateBoundary.js`);
  await density.loadGenerationLawPayloads();
  const { DEFAULT_CONFIG } = await import(`${SRC}/src/store/configSlice.js`);
  const { composePublicProse: compose } = await import(`${SRC}/src/components/new/publicProseCompose.js`);
  const BROWSER = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
  const cfg = { ...DEFAULT_CONFIG, ...BROWSER, settType: 'metropolis', selectedStresses: ['infiltrated'], selectedStressesRandom: false };
  const born = gen(density.birthConfig(cfg), null, { seed: 'v11-ties-metropolis-infiltrated-6', customContent: {} });
  writeFileSync(process.env.RV9_OUT, JSON.stringify({ ...born, publicProse: compose(born) }));
}, 600000);
