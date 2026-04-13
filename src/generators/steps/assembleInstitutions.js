/**
 * Step 5: assembleInstitutions
 *
 * Iterates the institutional catalog, applies toggles, exclusive groups,
 * probabilistic generation, out-of-tier forced institutions, and upgrade
 * chain deduplication.
 *
 * Extracted from generateSettlement.js lines 442–625.
 */

import { registerStep } from '../pipeline.js';
import { TIER_ORDER } from '../../data/constants.js';
import { institutionalCatalog } from '../../data/institutionalCatalog.js';
import { TERRAIN_DATA } from '../../data/geographyData.js';
import { RESOURCE_DATA } from '../../data/resourceData.js';
import { getBaseChance, checkStructuralValidity } from '../structuralValidator.js';
import { getTerrainType } from '../terrainHelpers.js';

// Merge city+metropolis catalogs
function mergeCatalogs(base, override) {
  const merged = {};
  Object.entries(base).forEach(([cat, insts]) => { merged[cat] = { ...insts }; });
  Object.entries(override).forEach(([cat, insts]) => {
    merged[cat] = merged[cat] ? { ...merged[cat], ...insts } : { ...insts };
  });
  return merged;
}

// Resource multiplier for institution base chances
function getResourceMultiplier(instTags, instName, nearbyResources, instModifiers, tier) {
  let multiplier = 1;
  const name = instName.toLowerCase();

  for (const mod of instModifiers) {
    if ((mod.tags && instTags && mod.tags.some(t => instTags.includes(t))) ||
        (mod.name && name.includes(mod.name.toLowerCase()))) {
      multiplier *= mod.modifier;
    }
  }

  const TIER_SCALE = { thorp: 0.6, hamlet: 0.75, village: 0.9, town: 1.0, city: 1.15, metropolis: 1.3 };
  const tierScale = TIER_SCALE[tier] || 1.0;

  const res = nearbyResources || [];
  res.forEach(resourceKey => {
    const rd = RESOURCE_DATA[resourceKey];
    if (!rd?.instBoosts) return;
    Object.entries(rd.instBoosts).forEach(([boostKey, boostVal]) => {
      if (!name.includes(boostKey)) return;
      const scaledBoost = 1 + (boostVal - 1) * tierScale;
      multiplier *= scaledBoost;
    });
  });

  const EXTRACTION_BOOSTS = {
    'iron_deposits':     { 'mine (open cast)': 2.5, 'mine': 2.0 },
    'stone_quarry':      { 'stone quarry': 2.5, 'stonemason': 1.8 },
    'coal_deposits':     { 'peat cutter': 2.0, 'charcoal burner': 1.8 },
    'precious_metals':   { 'mine (open cast)': 2.2, 'mint': 2.5 },
    'gemstone_deposits': { 'mine (open cast)': 2.0 },
    'fishing_grounds':   { "fisher's landing": 2.0, 'fish market': 1.8, 'fishmonger': 1.8 },
    'river_fish':        { "fisher's landing": 1.8, 'fish market': 1.6, 'fishmonger': 1.5 },
    'managed_forest':    { "woodcutter's camp": 2.0, 'charcoal burner': 1.8 },
    'hunting_grounds':   { "hunter's lodge": 2.5 },
    'deep_harbour':      { 'docks/port': 2.0, 'harbour master': 1.8 },
    'ancient_ruins':     { "adventurers' charter": 1.8, "adventurers' guild": 1.6 },
    'hot_springs':       { 'healer (divine': 1.8 },
    'mountain_timber':   { "woodcutter's camp": 1.8, 'charcoal burner': 1.6 },
  };
  res.forEach(resourceKey => {
    const exactBoosts = EXTRACTION_BOOSTS[resourceKey];
    if (!exactBoosts) return;
    Object.entries(exactBoosts).forEach(([fragment, boost]) => {
      if (name.includes(fragment)) {
        multiplier *= 1 + (boost - 1) * tierScale;
      }
    });
  });

  return Math.min(multiplier, 5);
}

const UPGRADE_CHAINS = [
  ["Parish church","Parish churches (2-5)"],["Parish church","Parish churches (10-30)"],
  ["Parish churches (2-5)","Parish churches (10-30)"],["Wayside shrine","Parish church"],
  ["Water source","Multiple water sources"],["Citizen militia","Town watch"],
  ["Citizen militia","Professional city watch"],["Town watch","Professional city watch"],
  ["Palisade or earthworks","Town walls"],["Town walls","City walls and gates"],
  ["Barracks","Garrison"],["Street gang","Multiple criminal factions"],
  ["Gambling den","Gambling halls"],["Gambling halls","Gambling district"],
  ["Gambling den","Gambling district"],["Traveling performers","Theaters"],
  ["Theaters","Multiple theaters"],["Traveling performers","Multiple theaters"],
  ["River boatyard","Shipyard"],["Hedge wizard","Wizard's tower"],
  ["Traveling hedge wizard","Hedge wizard"],["Alchemist shop","Alchemist quarter"],
  ["Wizard's tower","Mages' guild"],["Town granary","City granaries"],
  ["Town hall","City hall"],["Blacksmith","Blacksmiths (3-10)"],
  ["Carpenter","Carpenters (5-15)"],["Docks/port facilities","Warehouse district"],
  ["Carriers' hiring hall","Carriers' guild"],["Carriers' guild","Caravan masters' exchange"],
  ["Carriers' hiring hall","Caravan masters' exchange"],["Small prison/stocks","Large prison"],
  ["Courthouse","Multiple courthouses"],["Craft guilds (5-15)","Craft guilds (30-80)"],
  ["Merchant guilds (3-8)","Merchant guilds (15-40)"],
  ["Adventurers' charter hall","Multiple adventurers' guilds"],
  ["Bowyers & fletchers (guild)","Dungeon delving supply district"],
  ["Apothecary","Apothecary (established)"],["Apothecary (established)","Apothecary district"],
  ["Apothecary","Apothecary district"],["Cartographer's workshop","Cartographer's guild"],
  ["Bowyer & fletcher","Bowyers & fletchers (guild)"],["Small hospital","Major hospital"],
  ["Slave market","Slave market district"],
];

registerStep('assembleInstitutions', {
  deps: ['resolveConfig', 'resolveResources', 'resolveStress', 'resolveNeighbour'],
  provides: ['institutions', 'catalogForTier', 'structural'],
  phase: 'institutions',
}, (ctx, rng) => {
  const {
    tier, tradeRoute, effectiveConfig, nearbyResources,
    institutionToggles, categoryToggles, goodsToggles,
    neighbourProfile,
  } = ctx;
  const config = ctx.config || {};
  const importedNeighbor = ctx.importedNeighbour || null;

  const isCategoryEnabled = (cat) => {
    const t = config.settType || 'all';
    return categoryToggles[`${t}::${cat}`] !== false
        && categoryToggles[`${t}_${cat}`]  !== false;
  };

  // Build catalog for tier
  const catalogForTier = tier === 'metropolis'
    ? mergeCatalogs(institutionalCatalog['city'] || {}, institutionalCatalog['metropolis'] || {})
    : institutionalCatalog[tier] || {};

  const institutions = [];
  const exclusiveGroups = {};
  const tierIndex = TIER_ORDER.indexOf(tier);
  const terrainType = getTerrainType(tradeRoute, effectiveConfig.terrainOverride || null);
  const instModifiers = (TERRAIN_DATA[terrainType] || {}).institutionModifiers || [];

  // Main catalog iteration
  Object.entries(catalogForTier).forEach(([category, categoryInsts]) => {
    Object.entries(categoryInsts).forEach(([name, inst]) => {
      if (inst.minTier && tierIndex < TIER_ORDER.indexOf(inst.minTier)) return;

      const toggle = institutionToggles[`${tier}::${category}::${name}`]
                  || institutionToggles[`${tier}_${category}_${name}`]
                  || institutionToggles[`all::${category}::${name}`]
                  || institutionToggles[`all_${category}_${name}`]
                  || { allow: true, require: false };

      const catEnabled = isCategoryEnabled(category);
      const forceExclude = inst.required && toggle.forceExclude === true;

      // Required or explicitly forced
      if ((inst.required && !forceExclude) || (catEnabled && (toggle.require ?? false))) {
        if (inst.exclusiveGroup && exclusiveGroups[inst.exclusiveGroup]) {
          const existingName = exclusiveGroups[inst.exclusiveGroup];
          const existingIdx = institutions.findIndex(i => i.name === existingName);
          if (existingIdx >= 0 && institutions[existingIdx].source !== 'required') {
            institutions.splice(existingIdx, 1);
          } else if (existingIdx >= 0) {
            return;
          }
        }
        if (toggle.require && !inst.required && inst.exclusiveGroup && exclusiveGroups[inst.exclusiveGroup]) {
          const existingName = exclusiveGroups[inst.exclusiveGroup];
          const existingIdx = institutions.findIndex(i => i.name === existingName);
          if (existingIdx >= 0 && institutions[existingIdx].source !== 'required') {
            institutions.splice(existingIdx, 1);
          } else if (existingIdx >= 0) {
            return;
          }
        }
        if (inst.exclusiveGroup) exclusiveGroups[inst.exclusiveGroup] = name;
        institutions.push({ category, name, ...inst, source: inst.required ? 'required' : 'forced' });

      } else if (!forceExclude && catEnabled && (toggle.allow ?? true)) {
        if (inst.exclusiveGroup && exclusiveGroups[inst.exclusiveGroup]) return;
        if (inst.exclusionConditions?.some(ex => institutions.some(i => i.name === ex))) return;

        if (inst.tradeRouteRequired) {
          const routeOk = inst.tradeRouteRequired.includes(tradeRoute);
          const terrainOk = inst.terrainAccess && inst.terrainAccess.includes(terrainType);
          if (!routeOk && !terrainOk) return;
        }
        if (inst.forbiddenTradeRoutes && inst.forbiddenTradeRoutes.includes(tradeRoute)) return;
        if (inst.terrainRequired && !inst.terrainRequired.includes(terrainType)) return;

        const baseChance = getBaseChance(
          inst.baseChance, category, name, effectiveConfig, neighbourProfile || importedNeighbor, goodsToggles
        );
        const resourceMult = getResourceMultiplier(inst.tags || [], name, nearbyResources, instModifiers, tier);

        if (rng.chance(baseChance * resourceMult)) {
          if (inst.exclusiveGroup) exclusiveGroups[inst.exclusiveGroup] = name;
          institutions.push({ category, name, ...inst, source: 'generated' });
        }
      }
    });
  });

  // Forced-required from toggles (not in catalog)
  Object.entries(institutionToggles).forEach(([key, toggle]) => {
    if (!toggle?.require) return;
    const parts = key.split('_');
    if (parts.length < 3) return;
    const instName = parts.slice(2).join('_');
    if (institutions.some(i => i.name === instName)) return;
    for (const [cat, catInsts] of Object.entries(catalogForTier)) {
      if (catInsts[instName]) {
        const inst = catInsts[instName];
        if (inst.exclusiveGroup) {
          if (exclusiveGroups[inst.exclusiveGroup]) {
            const existIdx = institutions.findIndex(i => i.name === exclusiveGroups[inst.exclusiveGroup]);
            if (existIdx >= 0 && institutions[existIdx].source !== 'required') institutions.splice(existIdx, 1);
            else if (existIdx >= 0) return;
          }
          exclusiveGroups[inst.exclusiveGroup] = instName;
        }
        institutions.push({ category: cat, name: instName, ...inst, source: 'forced' });
        break;
      }
    }
  });

  // Out-of-tier forced institutions
  const fullCatalogAllTiers = (() => {
    const all = {};
    ['thorp','hamlet','village','town','city'].forEach(t => {
      const tc = institutionalCatalog[t] || {};
      Object.entries(tc).forEach(([cat, insts]) => {
        if (!all[cat]) all[cat] = {};
        Object.entries(insts).forEach(([name, def]) => {
          if (!all[cat][name]) all[cat][name] = { ...def, nativeTier: t };
        });
      });
    });
    return all;
  })();

  Object.entries(institutionToggles).forEach(([key, toggle]) => {
    if (!toggle?.require) return;
    const parts = key.split('::');
    if (parts.length < 3) return;
    const [, category, instName] = parts;
    if (institutions.some(i => i.name === instName)) return;
    const catInsts = fullCatalogAllTiers[category];
    if (!catInsts || !catInsts[instName]) return;
    const inst = catInsts[instName];
    const isInTier = !!((catalogForTier[category] || {})[instName]);
    if (isInTier) return;

    if (inst.exclusiveGroup && exclusiveGroups[inst.exclusiveGroup]) {
      const existIdx = institutions.findIndex(i => i.name === exclusiveGroups[inst.exclusiveGroup]);
      if (existIdx >= 0 && institutions[existIdx].source === 'required') {
        // Both co-exist
      } else if (existIdx >= 0) {
        institutions.splice(existIdx, 1);
      }
    }
    if (inst.exclusiveGroup) exclusiveGroups[inst.exclusiveGroup] = instName;
    institutions.push({
      category, name: instName, ...inst, source: 'forced',
      outOfTier: true, nativeTier: inst.nativeTier || 'unknown',
    });
  });

  // Dedup upgrade chains
  const presentNames = new Set(institutions.map(i => i.name));
  UPGRADE_CHAINS.forEach(([lesser, greater]) => {
    if (presentNames.has(lesser) && presentNames.has(greater)) {
      const idx = institutions.findIndex(i => i.name === lesser && i.source !== 'required');
      if (idx >= 0) { institutions.splice(idx, 1); presentNames.delete(lesser); }
    }
  });

  // Apply toggle exclusions
  for (let i = institutions.length - 1; i >= 0; i--) {
    const inst = institutions[i];
    const toggle = institutionToggles[`${tier}::${inst.category}::${inst.name}`]
                || institutionToggles[`${tier}_${inst.category}_${inst.name}`]
                || institutionToggles[`all::${inst.category}::${inst.name}`]
                || institutionToggles[`all_${inst.category}_${inst.name}`];
    if (!toggle) continue;
    if (toggle.forceExclude === true || (toggle.allow === false && !inst.required && !toggle.require && inst.source !== 'forced')) {
      institutions.splice(i, 1);
    }
  }

  // Structural validation
  const _preDerivedMagicTrade = ctx.townPlus && tradeRoute === 'isolated'
    && effectiveConfig.magicExists !== false;
  const structural = checkStructuralValidity(institutions, {
    tier, tradeRouteAccess: tradeRoute, magicLevel: ctx.magicLevel,
    monsterThreat: ctx.threat,
    priorityMilitary: effectiveConfig.priorityMilitary,
    priorityMagic: effectiveConfig.priorityMagic,
    nearbyResources: effectiveConfig.nearbyResources,
    _magicTradeOnly: effectiveConfig._magicTradeOnly || _preDerivedMagicTrade,
  });

  return { institutions, catalogForTier, structural };
});
