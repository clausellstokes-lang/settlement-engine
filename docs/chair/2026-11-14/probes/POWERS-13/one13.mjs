// one13.mjs <tree> <seed> : born in the census's shape (r2r-<size>-<i> | r2s-<crisis>-<size>-<i> | p8-<size>-<i>); prints JSON of a picked view to stdout via VIEW js expr
import path from 'node:path';
const [TREE, seed, view] = process.argv.slice(2);
const imp=(p)=>import(path.join(TREE,p));
const { generateSettlementPipeline } = await imp('src/generators/generateSettlementPipeline.js');
const { birthConfig, loadGenerationLawPayloads } = await imp('src/domain/density/densityCreateBoundary.js');
const { DEFAULT_CONFIG } = await imp('src/store/configSlice.js');
await loadGenerationLawPayloads();
const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
const calm = seed.match(/^(?:r2r|p8)-(\w+)-\d+$/);
const forced = seed.match(/^r2s-(\w+)-(thorp|hamlet|village|town|city|metropolis)-\d+$/);
const cfg = calm ? { ...DEFAULT_CONFIG, ...DIALS, settType: calm[1] } : { ...DEFAULT_CONFIG, ...DIALS, settType: forced[2], selectedStresses: [forced[1]], selectedStressesRandom: false };
const s = generateSettlementPipeline(birthConfig(cfg), null, { seed, customContent: {} });
const out = new Function('s', 'return (' + view + ')')(s);
console.log(typeof out === 'string' ? out : JSON.stringify(out, null, 1));
