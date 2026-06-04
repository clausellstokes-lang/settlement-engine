// institutionProbability.js — Institution base chance calculation
// Extracted from structuralValidator.js.
// Pure function: given a base chance, applies priority/resource/config multipliers.

import {TIER_ORDER} from '../data/constants.js';
import {GOODS_MODIFIERS_BY_TIER} from '../data/tradeGoodsData.js';

const getPriorityModifiers = (tier, goodsToggles = {}) => {
  const tierGoods = GOODS_MODIFIERS_BY_TIER[tier] || {};
  const penalties = {};
  Object.entries(tierGoods).forEach(([goodName, good]) => {
    if (goodsToggles[`${tier}_good_${goodName}`] === false && good.institutionKeywords) {
      good.institutionKeywords.forEach(keyword => {
        penalties[keyword] = (penalties[keyword] || 1) * 0.35;
      });
    }
  });
  return penalties;
};

export const getBaseChance = (
  baseChance,
  category,
  name,
  config,
  neighbor,
  goodsToggles = {},
) => {
  const cat  = category.toLowerCase();
  const inst = name.toLowerCase();
  let chance = baseChance;

  // ── Priority-based category multipliers ───────────────────────────────────

  // Economy institutions scale with economy priority
  if (cat.includes('economy') || inst.includes('market') || inst.includes('guild') ||
      inst.includes('merchant') || inst.includes('bank')) {
    chance *= config.priorityEconomy / 50;
  }

  // Government institutions scale differently by gov type
  if (cat.includes('government')) {
    if (inst.includes("lord's") || inst.includes('noble') || inst.includes('royal seat')) {
      // Feudal gov: high military, low economy
      const milMult  = config.priorityMilitary / 50;
      const econMod  = Math.max(0.4, 1 - (config.priorityEconomy - 50) / 150);
      chance *= milMult * econMod;
    } else if (inst.includes('guild') || inst.includes('merchant oligarchy') || inst.includes('mayor and council')) {
      // Merchant/democratic gov: high economy, low military
      const econMult = config.priorityEconomy / 50;
      const milMod   = Math.max(0.4, 1 - (config.priorityMilitary - 50) / 150);
      chance *= econMult * milMod;
    } else if (inst.includes('cathedral') || inst.includes('prelate')) {
      // Theocratic gov: religion priority
      chance *= config.priorityReligion / 50;
    } else if (inst.includes('democratic') || inst.includes('city-state')) {
      // Democratic: economy-leaning
      chance *= Math.max(0.5, config.priorityEconomy / 70);
    }
  }

  // Defense/military institutions scale with military priority
  if (cat.includes('defense') || cat.includes('military') ||
      inst.includes('wall') || inst.includes('garrison') || inst.includes('watch') ||
      inst.includes('guard') || inst.includes('fortif') || inst.includes('citadel') ||
      inst.includes('barracks') || inst.includes('armory')) {
    chance *= config.priorityMilitary / 50;
  }

  // Magic institutions scale with magic priority
  // Small tiers need higher magic priority to support arcane infrastructure
  if (cat.includes('magic') || inst.includes('wizard') || inst.includes('mage') ||
      inst.includes('alchemist') || inst.includes('enchant') || inst.includes('spell') ||
      inst.includes('arcane') || inst.includes('teleportation') || inst.includes('planar')) {
    const magicMult = config.priorityMagic / 50;
    // Small settlements need magic priority well above average to sustain arcane institutions
    const tierMagicPenalty = {
      thorp: 0.15, hamlet: 0.25, village: 0.40, town: 0.75, city: 1.0, metropolis: 1.0
    }[config.settType || config.tier || 'town'] ?? 0.75;
    chance *= magicMult * tierMagicPenalty;

    // Druid/nature institutions: boost on natural routes, but not excluded from others
    // A sewer druid or urban grove druid can exist anywhere — just less likely
    const isDruidInst = inst.includes('druid') || inst.includes('grove shrine') ||
                        inst.includes("warden's lodge") || inst.includes('sacred grove') ||
                        inst.includes('elder grove');
    if (isDruidInst) {
      const route = config.tradeRouteAccess || 'road';
      const hasMagicalNode = (config.nearbyResources || []).includes('magical_node');
      const routeBoost = { isolated: 1.8, road: 1.4, river: 1.5, crossroads: 0.9, port: 0.8 }[route] ?? 1.0;
      const nodeBoost = hasMagicalNode ? 1.5 : 1.0;
      chance *= routeBoost * nodeBoost;
    }
  }

  // Religious institutions scale with religion priority
  if (cat.includes('religious') || inst.includes('church') || inst.includes('cathedral') ||
      inst.includes('monastery') || inst.includes('temple') || inst.includes('priest') ||
      inst.includes('shrine') || inst.includes('abbey') || inst.includes('friary') ||
      inst.includes('hospital')) {
    chance *= config.priorityReligion / 50;
  }

  // Criminal institutions scale with criminal priority
  if (cat.includes('criminal') || inst.includes('thieves') || inst.includes('assassin') ||
      inst.includes('smuggl') || inst.includes('black market') || inst.includes('fence') ||
      inst.includes('underground') || inst.includes('criminal') || inst.includes('outlaw') ||
      inst.includes('bandit')) {
    chance *= config.priorityCriminal / 50;
  }

  // ── Trade route modifiers ─────────────────────────────────────────────────

  // Port/crossroads boost commercial institutions
  if ((config.tradeRouteAccess === 'port' || config.tradeRouteAccess === 'crossroads') &&
      (inst.includes('market') || inst.includes('merchant') || inst.includes('warehouse') ||
       inst.includes('dock') || inst.includes('customs'))) {
    chance *= 1.5;
  }

  // Isolated settlements penalise trade-facing institutions
  if (config.tradeRouteAccess === 'isolated' &&
      (inst.includes('market') || inst.includes('merchant') ||
       inst.includes('international') || inst.includes('bank'))) {
    chance *= 0.3;
  }

  // Isolated high-magic settlements: heavily boost teleportation/planar infrastructure
  // This allows isolated town+ to self-resolve via magic — the violation check will
  // detect the infrastructure and downgrade from critical to warning.
  const isHighMagicIsolated = config.tradeRouteAccess === 'isolated' &&
    (config.priorityMagic || 0) >= 70 &&
    ['town','city','metropolis'].includes(config.settType || config.tier || '');
  if (isHighMagicIsolated &&
      (inst.includes('teleportation') || inst.includes('planar') || inst.includes('airship'))) {
    chance = Math.min(1, chance * 4); // 4× boost for isolation-solving magic infra
  }

  // Port boosts maritime institutions
  if (config.tradeRouteAccess === 'port' &&
      (inst.includes('dock') || inst.includes('port') || inst.includes('ship') ||
       inst.includes('warehouse') || inst.includes('navy'))) {
    chance *= 2;
  }

  // Non-port removes port-only institutions
  if (config.tradeRouteAccess !== 'port' &&
      (inst === 'major port' || inst === 'navy (if coastal)')) {
    chance *= 0;
  }
  if (config.tradeRouteAccess !== 'port' && config.tradeRouteAccess !== 'river' &&
      inst === 'docks/port facilities') {
    chance *= 0;
  }

  // ── Magic priority gates ──────────────────────────────────────────────────
  // Institutions requiring high magic are zeroed out below the threshold
  const magPriority = config.priorityMagic ?? 50;
  const hiMagicInsts = [
    'airship', 'golem', 'undead labor', 'dream parlor', 'magical banking',
    'message network', 'planar', 'teleportation', 'magic item consignment',
    'enchanting quarter', 'high magic',
  ];
  if (magPriority < 66 && hiMagicInsts.some(kw => inst.includes(kw))) {
    chance *= 0;
  }

  // Exotic institutions: only magic-dependent ones scale with magic
  // Dragon resident and Underground city are geographical, not magical
  const NON_MAGIC_EXOTICS = ['dragon resident', 'underground city'];
  const isNonMagicExotic = NON_MAGIC_EXOTICS.some(kw => inst.includes(kw));
  const isMagicOrExoticCategory = (cat.includes('magic') || cat === 'exotic') && !isNonMagicExotic;
  if (magPriority >= 66 && isMagicOrExoticCategory) {
    chance *= 1.8;
  } else if (magPriority <= 25 && isMagicOrExoticCategory) {
    chance *= 0.3;
  }

  // ── Adventurers' hall / monster threat ───────────────────────────────────
  if (inst.includes("adventurers' charter hall")) {
    chance *= config.monsterThreat === 'plagued'   ? 5   :
              config.monsterThreat === 'frontier'  ? 3   : 0.3;
  }

  // ── Monster threat modifiers ──────────────────────────────────────────────
  if (config.monsterThreat === 'plagued') {
    if (cat.includes('defense') || inst.includes('wall') || inst.includes('garrison') ||
        inst.includes('barracks') || inst.includes('citadel')) {
      chance *= 2;
    }
    if (inst.includes('adventurer') || inst.includes('hireling')) {
      chance *= 1.5;
    }
  } else if (config.monsterThreat === 'frontier') {
    if (cat.includes('defense') || inst.includes('wall') || inst.includes('garrison')) {
      chance *= 1.35;
    }
  } else if (config.monsterThreat === 'heartland') {
    if (cat.includes('defense')) {
      chance *= 0.5;
    }
  }

  // ── Neighbour relationship modifiers ──────────────────────────────────────
  if (neighbor) {
    // Support both legacy raw neighbour objects and new neighbourProfile format
    const profile = neighbor.dynamics ? neighbor : null; // neighbourProfile has .dynamics
    if (profile) {
      const dyn = profile.dynamics || {};
      const ownTier    = config.settType === 'custom' ? 'village' : (config.settType || 'village');
      const tierDiff   = TIER_ORDER.indexOf(ownTier) - TIER_ORDER.indexOf(profile.tier || 'village');

      // Tier-based government suppression (patron is much larger)
      if (tierDiff < -1 &&
          (cat.includes('government') || inst.includes('court') || inst.includes('mint'))) {
        chance *= 0.4;
      }

      // Defense / military
      if (cat.includes('defense') || cat.includes('military') ||
          inst.includes('garrison') || inst.includes('barracks') ||
          inst.includes('fortif') || inst.includes('guard')) {
        chance *= (dyn.defense || 1.0) * (0.7 + (profile.militaryStrength || 0.5) * 0.6);
      }

      // Market / economy
      if (cat.includes('economy') || inst.includes('market') ||
          inst.includes('guild') || inst.includes('merchant')) {
        chance *= (dyn.market || 1.0) * (0.8 + (profile.economicStrength || 0.5) * 0.4);
      }

      // Craft
      if (cat.includes('craft') || inst.includes('workshop') || inst.includes('smith') ||
          inst.includes('weaver') || inst.includes('tanner')) {
        chance *= (dyn.craft || 1.0);
      }

      // Criminal / espionage
      if (cat.includes('criminal') || inst.includes('thieves') || inst.includes('smuggl')) {
        chance *= (dyn.criminal || 1.0) * (dyn.espionage || 1.0);
      }

      // Government / administration
      if (cat.includes('government') || cat.includes('administration') ||
          inst.includes('council') || inst.includes('court')) {
        chance *= (dyn.government || 1.0);
      }

    } else {
      // Legacy path: raw neighbour object (old format)
      const neighborTier = neighbor.tier || 'village';
      const ownTier      = config.settType === 'custom' ? 'village' : (config.settType || 'village');
      const tierDiff     = TIER_ORDER.indexOf(ownTier) - TIER_ORDER.indexOf(neighborTier);
      const relType      = (neighbor?.relationshipType || neighbor?.neighborRelationship?.relationshipType || '').toLowerCase();
      if (tierDiff < -1 && (cat.includes('government') || inst.includes('court'))) chance *= 0.4;
      if (Math.abs(tierDiff) <= 1 && cat.includes('defense')) chance *= 1.5;
      if ((relType.includes('hostile') || relType.includes('rival') || relType.includes('cold_war')) &&
          (cat.includes('defense') || cat.includes('military'))) chance *= 1.4;
    }
  }

  // ── Goods-toggle penalties ────────────────────────────────────────────────
  const modifiers = getPriorityModifiers(
    config.settType === 'custom' ? 'town' : (config.settType || 'town'),
    goodsToggles
  );
  Object.entries(modifiers).forEach(([keyword, multiplier]) => {
    if (inst.includes(keyword)) chance *= multiplier;
  });

  return Math.min(Math.max(chance, 0), 1);
};
