/**
 * supplyChains.js — Supply chain definitions for map overlays.
 *
 * Each chain connects resource production to consumption across settlements.
 * The WorldMap component uses these to draw overlay lines between linked burgs.
 */

export const CHAIN_DEFS = [
  {
    id: 'iron',
    name: 'Iron & Metalwork',
    color: '#6b7a8a',
    resources: ['iron_ore', 'copper_ore', 'tin_ore'],
    consumers: ['smithy', 'armorer', 'weaponsmith'],
    description: 'Ore extraction to metalworking institutions',
  },
  {
    id: 'grain',
    name: 'Grain & Food',
    color: '#8a7a2a',
    resources: ['grain', 'wheat', 'barley', 'livestock'],
    consumers: ['bakery', 'brewery', 'tavern', 'market'],
    description: 'Agricultural production to food processing',
  },
  {
    id: 'timber',
    name: 'Timber & Construction',
    color: '#4a7a3a',
    resources: ['timber', 'hardwood', 'softwood'],
    consumers: ['carpenter', 'shipwright', 'siege_works'],
    description: 'Forestry to construction and shipbuilding',
  },
  {
    id: 'textile',
    name: 'Textiles & Leather',
    color: '#7a3a5a',
    resources: ['wool', 'flax', 'silk', 'hides'],
    consumers: ['tailor', 'tanner', 'weaver'],
    description: 'Fiber and hide production to finished goods',
  },
  {
    id: 'stone',
    name: 'Stone & Masonry',
    color: '#8a8a7a',
    resources: ['quarry_stone', 'marble', 'granite'],
    consumers: ['mason', 'sculptor', 'cathedral'],
    description: 'Quarrying to construction and monuments',
  },
  {
    id: 'luxury',
    name: 'Luxury Goods',
    color: '#a0762a',
    resources: ['gems', 'gold_ore', 'silver_ore', 'spices', 'rare_herbs'],
    consumers: ['jeweler', 'goldsmith', 'apothecary', 'perfumer'],
    description: 'Rare materials to luxury crafts and trade',
  },
];

/**
 * Build supply chain edges between two linked settlements.
 * Returns an array of { chainId, from, to, resources } for chains
 * where one settlement produces and the other consumes.
 */
export function buildChainEdges(settlementA, settlementB) {
  const edges = [];

  const resourcesA = new Set((settlementA.resources || []).map(r => r.id || r.name?.toLowerCase()));
  const resourcesB = new Set((settlementB.resources || []).map(r => r.id || r.name?.toLowerCase()));
  const instsA = new Set((settlementA.institutions || []).map(i => (i.id || i.name || '').toLowerCase()));
  const instsB = new Set((settlementB.institutions || []).map(i => (i.id || i.name || '').toLowerCase()));

  for (const chain of CHAIN_DEFS) {
    const aProduces = chain.resources.some(r => resourcesA.has(r));
    const bConsumes = chain.consumers.some(c => instsB.has(c));
    const bProduces = chain.resources.some(r => resourcesB.has(r));
    const aConsumes = chain.consumers.some(c => instsA.has(c));

    if (aProduces && bConsumes) {
      edges.push({
        chainId: chain.id,
        from: settlementA.name,
        to: settlementB.name,
        direction: 'A→B',
      });
    }
    if (bProduces && aConsumes) {
      edges.push({
        chainId: chain.id,
        from: settlementB.name,
        to: settlementA.name,
        direction: 'B→A',
      });
    }
  }

  return edges;
}
