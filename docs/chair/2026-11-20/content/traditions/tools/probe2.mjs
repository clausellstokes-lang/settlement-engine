import { generateSettlementPipeline } from '../../../../../../src/generators/generateSettlementPipeline.js';
import { deriveFoundingTraditions } from '../../../../../../src/domain/traditions/genesis.js';
import { toPublicSafe } from '../../../../../../src/domain/display/publicSafe.js';
let same = 0, diff = 0;
for (let i = 0; i < 20; i++) {
  const s = generateSettlementPipeline({ settType: 'town', culture: 'germanic', terrainOverride: 'auto', tradeRouteAccess: 'random_trade', monsterThreat: 'civilized' }, null, { seed: 'trad-probe-' + i, customContent: {} });
  const own = deriveFoundingTraditions(s).map(r => r.name).join(' / ');
  const pub = deriveFoundingTraditions(toPublicSafe(s)).map(r => r.name).join(' / ');
  if (own === pub) same++; else { diff++; if (diff < 3) console.log('OWN', own, '\nPUB', pub); }
}
console.log({ same, diff });
