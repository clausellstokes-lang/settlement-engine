import { it, vi } from 'vitest';
import { writeFileSync } from 'node:fs';
const SRC = process.env.RV6_SRC; const GEN = process.env.RV10_GEN || SRC;
vi.mock(`${process.env.RV6_SRC}/src/lib/supabase.js`, () => ({ supabase: { rpc: async () => ({ data: null, error: null }) }, isConfigured: true }));
it('unstamped', async () => {
  const { generateSettlementPipeline } = await import(`${GEN}/src/generators/generateSettlementPipeline.js`);
  const { birthConfig, loadGenerationLawPayloads } = await import(`${GEN}/src/domain/density/densityCreateBoundary.js`);
  const { DEFAULT_CONFIG } = await import(`${GEN}/src/store/configSlice.js`);
  await loadGenerationLawPayloads();
  const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
  const tally = {}; let towns = 0; let townsWith = 0; let crimTotal = 0;
  for (let k = 0; k < 2; k += 1) for (const size of ['village', 'town', 'city', 'metropolis']) for (const crisis of ['none', 'infiltrated', 'insurgency', 'occupied', 'indebted', 'none', 'wartime', 'under_siege', 'politically_fractured', 'none']) {
    const A = JSON.parse(JSON.stringify(generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...dials, settType: size, ...(crisis !== 'none' ? { selectedStresses: [crisis], selectedStressesRandom: false } : {}) }), null, { seed: `rv10-us-${size}-${crisis}-${k}-${towns}`, customContent: {} })));
    towns += 1; const crim = (A.institutions || []).filter((h) => /criminal/i.test(h.category || '') || (h.tags || []).includes('criminal')); crimTotal += crim.length;
    const un = crim.filter((h) => !h.catalogId); if (un.length) townsWith += 1;
    for (const h of un) { const t = tally[`${h.name} (source ${h.source || '-'})`] = tally[`${h.name} (source ${h.source || '-'})`] || 0; tally[`${h.name} (source ${h.source || '-'})`] = t + 1; }
  }
  writeFileSync(process.env.RV10_OUT, JSON.stringify({ towns, crimTotal, townsWithUnstampedCriminal: townsWith, tally }, null, 1));
}, 3600000);
