/**
 * Choose the second mandatory thorp NPC from the settlement's material facts.
 *
 * Institution evidence wins over broad terrain defaults because it proves the
 * livelihood actually materialized in this generation. The fallback order is
 * intentionally stable and draw-free.
 */
import {
  nativeSemanticNames,
} from '../../domain/content/customContentSemanticAuthority.js';
import { isTradeRouteDisconnected } from '../../domain/tradeRouteSemantics.js';

export function deriveThorpSecondRole(settlement, config = {}) {
  const route = config.tradeRouteAccess || 'road';
  const terrain = config.terrainType || 'plains';
  const institutions = nativeSemanticNames(settlement.institutions)
    .map(name => name.toLowerCase());

  if (institutions.some(name => name.includes('fishing'))) return 'Fisherman';
  if (institutions.some(name => name.includes('woodcutter'))) return 'Woodcutter';
  if (institutions.some(name => name.includes('shepherd'))) return 'Shepherd';
  if (route === 'port' || terrain === 'coastal') return 'Fisherman';
  if (terrain === 'forest' || isTradeRouteDisconnected(route)) {
    return 'Woodcutter';
  }
  if (terrain === 'plains' || terrain === 'hills') return 'Shepherd';
  if (route === 'river' || terrain === 'riverside') return 'Fisherman';
  return 'Miller';
}
