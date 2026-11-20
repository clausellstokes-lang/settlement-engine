// VR47: TREE=<tree> node voidbirths.mjs -> one line per birth: seed, sha256 of the born record, the seat row's keeper line.
// The only generator-closure reach of honorificOfTitle is rulingChainOf -> seatKeeperLineOf (crisisCast.js, seatHolderFindings.js
// read only the chain's npc and absence.kind), live only where the seat stands EMPTY: so the corpus is succession_void births
// (seatKeeper.test.js's f7g seeds, six sizes x six). Run at the old tree and the new: the shas must be equal, the lines may move.
import path from 'node:path'; import crypto from 'node:crypto';
const imp = (p) => import(path.join(process.env.TREE, p));
const { generateSettlementPipeline } = await imp('src/generators/generateSettlementPipeline.js');
const { birthConfig, loadGenerationLawPayloads } = await imp('src/domain/density/densityCreateBoundary.js');
const { seatKeeperLineOf } = await imp('src/domain/people/seatKeeper.js');
await loadGenerationLawPayloads();
const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
for (const settType of ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis']) for (let i = 0; i < 6; i++) {
  const seed = `f7g-${settType}-${i}`;
  const s = generateSettlementPipeline(birthConfig({ ...DIALS, settType, selectedStresses: ['succession_void'], selectedStressesRandom: false }), null, { seed, customContent: {} });
  console.log([seed, crypto.createHash('sha256').update(JSON.stringify(s)).digest('hex'), seatKeeperLineOf(s)].join('\t'));
}
