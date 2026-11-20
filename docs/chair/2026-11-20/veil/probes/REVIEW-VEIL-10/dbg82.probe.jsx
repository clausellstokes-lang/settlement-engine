import { it, vi } from 'vitest';
import { writeFileSync } from 'node:fs';
const SRC = process.env.RV6_SRC;
vi.mock(`${process.env.RV6_SRC}/src/lib/supabase.js`, () => ({ supabase: { rpc: async () => ({ data: null, error: null }) }, isConfigured: true }));
it('dbg', async () => {
  const { generateSettlementPipeline } = await import(`${SRC}/src/generators/generateSettlementPipeline.js`);
  const { birthConfig, loadGenerationLawPayloads } = await import(`${SRC}/src/domain/density/densityCreateBoundary.js`);
  const { DEFAULT_CONFIG } = await import(`${SRC}/src/store/configSlice.js`);
  await loadGenerationLawPayloads();
  const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
  const A = JSON.parse(JSON.stringify(generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...dials, settType: 'city' }), null, { seed: 'rv10-sw-city-none-18', customContent: {} })));
  const out = { crim: (A.institutions || []).filter((h) => /criminal/i.test(h.category || '') || (h.tags || []).includes('criminal')).map((h) => ({ name: h.name, cid: h.catalogId, cat: h.category, tags: h.tags })),
    bm: (A.institutions || []).filter((h) => /black/i.test(h.name)).map((h) => ({ name: h.name, cid: h.catalogId, cat: h.category })),
    chains: (A.economicState?.activeChains || []).filter((c) => /black/i.test(JSON.stringify(c))).map((c) => ({ id: c.chainId || c.id, label: c.label, proc: c.processingInstitutions })),
    situ: A.economicState?.situationDesc };
  writeFileSync('/var/tmp/v16/rv10/dbg82.json', JSON.stringify(out, null, 1));
}, 600000);
