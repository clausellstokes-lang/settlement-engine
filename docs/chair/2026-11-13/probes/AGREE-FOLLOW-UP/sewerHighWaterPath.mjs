// AGREE-FOLLOW-UP probe 7 — HIGH_WATER_POPULATION's rung lifts in the sewer arm (42 roster-free
// births x s_pros_0..7), tallied by rungSource and high-water tier: is the lift the weighted score
// (DERIVED->DERIVED) or the tier floor (->TIER_FLOOR)? usage: node sewerHighWaterPath.mjs <tree root>
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
const root = resolve(process.argv[2]);
const imp = (p) => import(pathToFileURL(join(root, p)).href);
const { generateSettlementPipeline } = await imp('src/generators/generateSettlementPipeline.js');
const { TIER_ORDER } = await imp('src/data/constants.js');
const { SANITATION_LADDER, sanitationRosterOf } = await imp('src/domain/undercity/strataExistence.js');
const { deriveSewerLadder } = await imp('src/domain/undercity/sewerDerivation.js');
const TR = { plains: 'road', hills: 'road', forest: 'isolated', riverside: 'river', coastal: 'port', mountain: 'road', desert: 'road' };
const free = TIER_ORDER.flatMap((t) => Object.keys(TR).map((terrain) => generateSettlementPipeline({ settType: t, culture: 'germanic', terrainOverride: terrain, tradeRouteAccess: TR[terrain], monsterThreat: 'civilized' }, null, { seed: `uc1-acc-${t}-${terrain}`, customContent: {} }))).map((s) => ({ ...s, institutions: s.institutions.filter((i) => !sanitationRosterOf([i]).length) }));
const lo = (s) => ({ ...s, config: { ...s.config, peakTier: undefined } }), hi = (s) => ({ ...s, config: { ...s.config, peakTier: 'metropolis' } });
const tally = {};
for (const s of free) for (let n = 0; n < 8; n++) { const x = { ...s, id: `s_pros_${n}` }; const a = deriveSewerLadder(lo(x)), b = deriveSewerLadder(hi(x));
  if (SANITATION_LADDER.indexOf(b.rung) > SANITATION_LADDER.indexOf(a.rung)) { const k = `${a.rungSource}->${b.rungSource} tier ${a.highWaterTier}->${b.highWaterTier}`; tally[k] = (tally[k] || 0) + 1; } }
console.log(JSON.stringify(tally));
