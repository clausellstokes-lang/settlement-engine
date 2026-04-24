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

  // Resources can arrive as plain strings (`'iron_ore'`, from nearbyResources),
  // or as objects `{id, name}` from custom/edited settlements. Handle both.
  // The canonical list lives on `nearbyResources`; older code wrote `resources`.
  const normRes = (r) => {
    if (typeof r === 'string') return r.toLowerCase();
    if (r && typeof r === 'object') return (r.id || r.name || '').toLowerCase();
    return '';
  };
  // The canonical location on a generated settlement is
  // `settlement.config.nearbyResources` (set at generateSettlement.js:1031
  // when spreading effectiveConfig). Fall back to a handful of other shapes
  // for custom-edited or imported saves.
  const resListA = settlementA?.config?.nearbyResources
    || settlementA?.nearbyResources
    || settlementA?.resources
    || [];
  const resListB = settlementB?.config?.nearbyResources
    || settlementB?.nearbyResources
    || settlementB?.resources
    || [];
  const resourcesA = new Set(resListA.map(normRes).filter(Boolean));
  const resourcesB = new Set(resListB.map(normRes).filter(Boolean));

  const normInst = (i) => (i?.id || i?.name || '').toLowerCase();
  const instsA = new Set((settlementA?.institutions || []).map(normInst).filter(Boolean));
  const instsB = new Set((settlementB?.institutions || []).map(normInst).filter(Boolean));

  // Institution names in the catalog include parenthetical size suffixes
  // (e.g. "Carpenter (part-time)", "Taverns (5-20)", "Siege Works"). The
  // chain-def consumer tokens are bare singulars ('carpenter', 'tavern',
  // 'siege_works'). Treat either as matching if the consumer token appears
  // as a substring of a catalog name, with "_" mapped to space.
  const hasInst = (set, consumer) => {
    if (set.has(consumer)) return true;
    const needleSpaced = consumer.replace(/_/g, ' ');
    for (const inst of set) {
      if (inst.includes(needleSpaced)) return true;
    }
    return false;
  };

  for (const chain of CHAIN_DEFS) {
    const aProduces = chain.resources.some(r => resourcesA.has(r));
    const bConsumes = chain.consumers.some(c => hasInst(instsB, c));
    const bProduces = chain.resources.some(r => resourcesB.has(r));
    const aConsumes = chain.consumers.some(c => hasInst(instsA, c));

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
