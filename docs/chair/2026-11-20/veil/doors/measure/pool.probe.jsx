// VEIL-DOORS — a pool of born towns for the list cost rows (RV_OUT: a JSON array of stored towns, RV_N per tier x crisis).
import { it, vi } from 'vitest';
import { writeFileSync } from 'node:fs';
vi.mock(`${process.env.RV6_SRC}/src/lib/supabase.js`, () => ({ supabase: { rpc: async () => ({ data: null, error: null }) }, isConfigured: true }));
it('VEIL-DOORS: the born pool', async () => {
  const SRC = process.env.RV6_SRC;
  const { generateSettlementPipeline } = await import(`${SRC}/src/generators/generateSettlementPipeline.js`);
  const { birthConfig, loadGenerationLawPayloads } = await import(`${SRC}/src/domain/density/densityCreateBoundary.js`);
  const { DEFAULT_CONFIG } = await import(`${SRC}/src/store/configSlice.js`);
  const { composePublicProse } = await import(`${SRC}/src/components/new/publicProseCompose.js`);
  const { withPublicProse } = await import(`${SRC}/src/domain/display/publicProse.js`);
  await loadGenerationLawPayloads();
  const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
  const out = [];
  for (const size of ['village', 'town', 'city', 'metropolis', 'town']) for (const crisis of ['none', 'infiltrated', 'insurgency', 'indebted', 'none', 'wartime', 'none', 'occupied', 'none', 'politically_fractured']) {
    const cfg = { ...DEFAULT_CONFIG, ...dials, settType: size, ...(crisis !== 'none' ? { selectedStresses: [crisis], selectedStressesRandom: false } : {}) };
    let t = generateSettlementPipeline(birthConfig(cfg), null, { seed: `doors-pool-${size}-${crisis}-${out.length}`, customContent: {} });
    t = { ...t }; delete t.publicProse; t = withPublicProse(t, composePublicProse(t));
    out.push(JSON.parse(JSON.stringify(t)));
  }
  writeFileSync(process.env.RV_OUT, JSON.stringify(out));
}, 3_600_000);
