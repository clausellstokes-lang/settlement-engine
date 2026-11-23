// 13G: the control r2r-city-5 born as tests/generators/bar8Powers.test.js births it (its configOf over DEFAULT_CONFIG,
// through birthConfig), written as JSON so the tree before and after the cure can be diffed.
// usage: TREE=<tree root> node control13g.mjs <out.json>
import { writeFileSync } from 'node:fs';
const R = process.env.TREE + '/src/';
const { generateSettlementPipeline } = await import(R + 'generators/generateSettlementPipeline.js');
const { birthConfig, loadGenerationLawPayloads } = await import(R + 'domain/density/densityCreateBoundary.js');
const { DEFAULT_CONFIG } = await import(R + 'store/configSlice.js');
await loadGenerationLawPayloads();
const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
const seed = 'r2r-city-5';
writeFileSync(process.argv[2], JSON.stringify(generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...dials, settType: 'city' }), null, { seed, customContent: {} }), null, 1));
