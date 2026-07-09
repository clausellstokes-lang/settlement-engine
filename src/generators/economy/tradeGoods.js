/**
 * economy/tradeGoods.js — trade-goods streams: local commodities, necessity imports, entrepot detection, tier export/upgrade goods, and salt-preservation classification.
 */

import { random as _rng } from '../rngContext.js';
import { customDeps as _customDeps } from '../../lib/dependencyEngine.js';
import { COMMODITY_CATEGORY_MAP, GOODS_CATEGORIES, GOODS_MODIFIERS_BY_TIER } from '../../data/tradeGoodsData.js';
import { RESOURCE_DATA } from '../../data/resourceData.js';


// deriveLocalCommodities
const deriveLocalCommodities = (nearbyResources = [], institutions = []) => {
  const instNames = institutions.map((i) => (i.name || '').toLowerCase());
  const commodities = new Set();
  getCommoditiesForResources(nearbyResources).forEach((commodity) => {
    const mapped = COMMODITY_CATEGORY_MAP[commodity];
    if (mapped) commodities.add(mapped);
    commodities.add(commodity.toLowerCase());
  });
  // Institution-driven commodity bonus keywords
  if (instNames.some((n) => n.includes('mill') || n.includes('baker'))) commodities.add('flour');
  if (instNames.some((n) => n.includes('smith') || n.includes('metalwork'))) commodities.add('ironwork');
  if (instNames.some((n) => n.includes('tanner') || n.includes('leather'))) commodities.add('leather');
  if (instNames.some((n) => n.includes('weaver') || n.includes('textile'))) commodities.add('cloth');
  if (instNames.some((n) => n.includes('butcher'))) commodities.add('meat');
  if (instNames.some((n) => n.includes('carpenter') || n.includes('sawmill'))) commodities.add('lumber');
  if (instNames.some((n) => n.includes('dock') || n.includes('port') || n.includes('fishmonger')))
    commodities.add('salt');
  return [...commodities];
};


// getCommoditiesForResources
const getCommoditiesForResources = (resources = []) => {
  const commodities = new Set();
  resources.forEach((resource) => {
    const resourceData = RESOURCE_DATA[resource];
    resourceData && resourceData.commodities.forEach((commodity) => commodities.add(commodity));
  });
  return [...commodities];
};


// deriveNecessityImports
const deriveNecessityImports = (tier, route, localProduction, institutions = [], nearbyResources = []) => {
  // Isolated settlements cannot import anything — they are self-contained by definition.
  // Return empty to avoid showing imports that contradict the "no external trade" description.
  if (route === 'isolated') return [];

  const instNames = institutions.map((i) => (i.name || '').toLowerCase());
  const needed = [];
  const isPort = route === 'port';
  const isRiver = route === 'river';
  const hasSalt = nearbyResources.some(
    (r) => r.includes('salt_flat') || r.includes('salt_deposit') || r.includes('salt_mine')
  );
  if (!localProduction.includes('salt') && !isPort && !isRiver && !hasSalt) needed.push('Salt');
  if (
    !localProduction.includes('iron') &&
    !instNames.some((n) => n.includes('smith') || n.includes('metalwork')) &&
    ['city', 'metropolis'].includes(tier)
  )
    needed.push('Iron');
  if (
    !localProduction.includes('grain') &&
    (isPort || ['city', 'metropolis'].includes(tier)) &&
    !instNames.some((n) => n.includes('farm') || n.includes('granar'))
  )
    needed.push('Grain');
  if (
    !localProduction.includes('timber') &&
    ['city', 'metropolis'].includes(tier) &&
    !instNames.some((n) => n.includes('carpenter') || n.includes('sawmill'))
  )
    needed.push('Timber');
  return needed;
};


// deriveIsEntrepot
const deriveIsEntrepot = (route, institutions = []) => {
  const instNames = institutions.map((inst) => (inst.name || '').toLowerCase());
  return (
    route === 'crossroads' ||
    (route === 'port' && instNames.some((name) => name.includes('international trade') || name.includes('warehouse district')))
  );
};


// isSaltPreserved
export const isSaltPreserved = (goodName) =>
  SALT_PRESERVATIVES.some((keyword) => (goodName || '').toLowerCase().includes(keyword));

const hasEconomicKeyword = isSaltPreserved;


// SALT_PRESERVATIVES
const SALT_PRESERVATIVES = ['preserv', 'salted', 'pickled', 'cured', 'smoked', 'brined', 'salt fish', 'salt meat'];


// generateTradeIncomeStreams
export const generateTradeIncomeStreams = (tier, institutions = [], route = 'road', goodsToggles = {}, config = {}) => {
  const localProduction = deriveLocalCommodities(config.nearbyResources || [], institutions);
  const necessityImports = deriveNecessityImports(
    tier,
    route,
    localProduction,
    institutions,
    config.nearbyResources || []
  );
  const isEntrepot = deriveIsEntrepot(route, institutions);
  const hasSaltLocal = necessityImports.some((i) => i.toLowerCase() === 'salt');
  const exports = getGoodsModifiers(tier, institutions, goodsToggles)
    .filter((item) => !necessityImports.includes(item.name))
    .filter((item) => {
      const name = typeof item === 'string' ? item : item?.name || '';
      return !(hasSaltLocal && !isEntrepot && hasEconomicKeyword(name));
    });
  const imports = getUpgradeChain(tier, route, false, goodsToggles);
  const bonuses = [];
  if (isEntrepot && route === 'crossroads' && !['thorp', 'hamlet'].includes(tier))
    bonuses.push({
      source: 'Entrepôt Trade',
      percentage: tier === 'metropolis' ? 25 : tier === 'city' ? 20 : 18,
      desc: 'Transit duties, warehouse fees, and re-export premiums from goods passing through the crossroads position.',
    });
  if (route === 'port' && institutions.some((i) => i.name.toLowerCase().includes('international trade')))
    bonuses.push({
      source: 'International Commerce',
      percentage: 25,
      desc: 'Revenue from international trade: licensing fees, currency exchange, and commodity brokerage.',
    });
  return {
    exports,
    imports,
    isEntrepot,
    transit: isEntrepot ? imports.filter((i) => !necessityImports.includes(i)).slice(0, 4) : [],
    incomeBonuses: bonuses,
    localProduction,
    necessityImports,
  };
};


// getGoodsModifiers
const getGoodsModifiers = (tier, institutions = [], goodsToggles = {}) => {
  const tierData = GOODS_MODIFIERS_BY_TIER[tier] || {};
  const exports = [];
  Object.entries(tierData).forEach(([goodName, spec]) => {
    const toggleKey = `${tier}_good_${goodName}`;
    // Custom-content extension: resolve `requiredInstitution` refIds
    const reqInst = spec.requiredInstitution
      ? _customDeps.resolveInstitutionRequirement(spec.requiredInstitution)
      : '';
    (goodsToggles[toggleKey] !== void 0 ? goodsToggles[toggleKey] : spec.on) &&
      ((reqInst &&
        !institutions.some((inst) => inst.name === reqInst || inst.name.includes(reqInst))) ||
        (_rng() < spec.p && exports.push(goodName)));
  });
  return exports;
};


// UPGRADE_GOODS_BY_TIER — goods available as upgrades per tier
const UPGRADE_GOODS_BY_TIER = {
  thorp: {
    basic: [
      {
        name: 'Salt',
        category: GOODS_CATEGORIES.FOOD_PROCESSED,
        on: true,
        desc: 'Food preservation',
      },
      {
        name: 'Metal tools',
        category: GOODS_CATEGORIES.MANUFACTURED,
        on: true,
        desc: 'Simple implements',
      },
      {
        name: 'Cloth',
        category: GOODS_CATEGORIES.MANUFACTURED,
        on: true,
        desc: 'Basic textiles',
      },
    ],
  },
  hamlet: {
    basic: [
      {
        name: 'Metal goods',
        category: GOODS_CATEGORIES.MANUFACTURED,
        on: true,
        desc: 'Tools, nails, horseshoes',
      },
      {
        name: 'Salt',
        category: GOODS_CATEGORIES.FOOD_PROCESSED,
        on: true,
        desc: 'Food preservation',
      },
      {
        name: 'Quality cloth',
        category: GOODS_CATEGORIES.MANUFACTURED,
        on: true,
        desc: 'Better textiles',
      },
    ],
  },
  village: {
    basic: [
      {
        name: 'Metal goods',
        category: GOODS_CATEGORIES.MANUFACTURED,
        on: true,
        desc: 'Tools, nails, horseshoes',
      },
      {
        name: 'Quality cloth and clothing',
        category: GOODS_CATEGORIES.MANUFACTURED,
        on: true,
        desc: 'Finished garments',
      },
      {
        name: 'Salt for preservation',
        category: GOODS_CATEGORIES.FOOD_PROCESSED,
        on: true,
        desc: 'Essential preservative',
      },
      {
        name: 'Specialized tools',
        category: GOODS_CATEGORIES.MANUFACTURED,
        on: true,
        desc: 'Advanced implements',
      },
    ],
    fromHigher: [
      {
        name: 'Legal services',
        category: GOODS_CATEGORIES.SERVICES,
        on: true,
        desc: 'Contracts, court access',
      },
      {
        name: 'Advanced medical care',
        category: GOODS_CATEGORIES.SERVICES,
        on: true,
        desc: 'Skilled physicians',
      },
      {
        name: 'Manufactured goods',
        category: GOODS_CATEGORIES.MANUFACTURED,
        on: true,
        desc: 'Wide variety of crafts',
      },
    ],
  },
  town: {
    fromCityOrMetropolis: [
      {
        name: 'Luxury textiles',
        category: GOODS_CATEGORIES.LUXURY,
        on: true,
        desc: 'Fine cloth, silk',
      },
      {
        name: 'Spices and exotic dyes',
        category: GOODS_CATEGORIES.LUXURY,
        on: true,
        desc: 'Imported rarities',
      },
      {
        name: 'Banking services',
        category: GOODS_CATEGORIES.SERVICES,
        on: true,
        desc: 'Letters of credit',
      },
      {
        name: 'Advanced legal expertise',
        category: GOODS_CATEGORIES.SERVICES,
        on: true,
        desc: 'Specialized law',
      },
      {
        name: 'Rare materials',
        category: GOODS_CATEGORIES.LUXURY,
        on: true,
        desc: 'Exotic goods',
      },
    ],
    fromHinterland: [
      {
        name: 'Food surplus',
        category: GOODS_CATEGORIES.AGRICULTURAL,
        on: true,
        desc: 'Agricultural hinterland',
      },
      {
        name: 'Raw wool and hides',
        category: GOODS_CATEGORIES.RAW_MATERIALS,
        on: true,
        desc: 'For processing',
      },
      {
        name: 'Timber',
        category: GOODS_CATEGORIES.RAW_MATERIALS,
        on: true,
        desc: 'Construction material',
      },
    ],
  },
  city: {
    fromMetropolis: [
      {
        name: 'International banking',
        category: GOODS_CATEGORIES.SERVICES,
        on: true,
        desc: 'Global connections',
      },
      {
        name: 'Highest luxury goods',
        category: GOODS_CATEGORIES.LUXURY,
        on: true,
        desc: 'Rarities and masterworks',
      },
      {
        name: 'Political legitimacy',
        category: GOODS_CATEGORIES.SERVICES,
        on: true,
        desc: 'Royal/imperial connections',
      },
    ],
    fromHinterland: [
      {
        name: 'Bulk food',
        category: GOODS_CATEGORIES.AGRICULTURAL,
        on: true,
        desc: 'Massive agricultural needs',
      },
      {
        name: 'Raw materials',
        category: GOODS_CATEGORIES.RAW_MATERIALS,
        on: true,
        desc: 'Ore, timber, wool',
      },
      {
        name: 'Basic goods for resale',
        category: GOODS_CATEGORIES.MANUFACTURED,
        on: true,
        desc: 'Market redistribution',
      },
    ],
  },
  metropolis: {
    basic: [
      {
        name: 'Massive food requirements',
        category: GOODS_CATEGORIES.AGRICULTURAL,
        on: true,
        desc: 'Regional network',
      },
      {
        name: 'Raw materials',
        category: GOODS_CATEGORIES.RAW_MATERIALS,
        on: true,
        desc: 'Entire regional supply',
      },
      {
        name: 'Luxury imports',
        category: GOODS_CATEGORIES.LUXURY,
        on: true,
        desc: 'From distant lands',
      },
    ],
  },
};


// getUpgradeChain
const getUpgradeChain = (tier, route, isFromHigher = false, goodsToggles = {}) => {
  // Isolated settlements have no trade access — no upgrade goods come in from outside
  if (route === 'isolated') return [];
  const tierData = UPGRADE_GOODS_BY_TIER[tier] || {};
  const result = [];
  let source = 'basic';
  if (isFromHigher && tierData.fromHigher) source = 'fromHigher';
  else if ((route === 'city' || route === 'metropolis') && tierData.fromCityOrMetropolis)
    source = 'fromCityOrMetropolis';
  else if (tierData.fromHinterland) source = 'fromHinterland';
  else if (tierData.fromMetropolis && route === 'metropolis') source = 'fromMetropolis';
  (tierData[source] || []).forEach((item) => {
    const toggleKey = `${tier}_import_${item.name}`;
    const isService =
      item.category === 'services' ||
      item.category === 'SERVICES' ||
      (item.category?.key || item.category) === 'services';
    if (!isService && (goodsToggles[toggleKey] !== undefined ? goodsToggles[toggleKey] : item.on))
      result.push(item.name);
  });
  return result;
};
