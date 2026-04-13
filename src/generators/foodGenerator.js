/**
 * foodGenerator.js
 * Computes a structured foodSecurity object from settlement inputs.
 *
 * Inputs:  tier, institutions, config (includes _population, tradeRouteAccess,
 *          terrainType, nearbyResources, priorityMagic, magicExists, stressTypes,
 *          monsterThreat, priorityEconomy)
 *
 * Output:  foodSecurity object with label, ratio, source chains, storage,
 *          import dependency, magic supplement, prosperity modifier.
 *
 * This feeds into:
 *   - Prosperity calculation (floor/cap/bonus via prosperityMod)
 *   - Viability warnings (deficit/dependency flags)
 *   - Defense Disasters & Famine score (storageMonths × diversityScore)
 *   - Economics tab UI
 */

// ── Constants (match buildFactionList in economicGenerator) ────────────────
const PER_CAPITA_NEED        = 2;    // lbs/day per person
const FARMER_PRODUCTION      = 6;    // lbs/day per farming worker
const AGRICULTURAL_WORKFORCE = 0.4;  // fraction of population that farms

// ── Terrain agriculture capacities (matches TERRAIN_DATA) ─────────────────
const TERRAIN_AGRI = {
  plains: 1.0, coastal: 0.7, riverside: 0.9, forest: 0.5,
  hills: 0.6, desert: 0.3, mountain: 0.4,
};

export function generateFoodSecurity(tier, institutions, config) {
  const instNames     = (institutions || []).map(i => (i.name||'').toLowerCase());
  const resources     = config.nearbyResources || [];
  const route         = config.tradeRouteAccess || 'road';
  const terrain       = config.terrainType || 'plains';
  const threat        = config.monsterThreat || 'heartland';
  const stresses      = config.stressTypes || (config.stressType ? [config.stressType] : []);
  const priorityMagic = config.priorityMagic ?? 0;
  const magicExists   = config.magicExists !== false;
  const population    = config._population || tierDefaultPop(tier);

  const hasInst  = (...keys) => instNames.some(n => keys.some(k => n.includes(k)));
  const hasRes   = (...keys) => resources.some(r => keys.some(k => r.includes(k)));

  // ── Institution flags ─────────────────────────────────────────────────────
  const hasSubsistence    = hasInst('subsistence', 'common field', 'household farm', 'farming community');
  const hasFarmland       = hasInst('farmland', 'grain field', 'managed farmland');
  const hasMill           = hasInst('mill', 'miller', 'windmill', 'watermill');
  const hasGranary        = hasInst('town granary', 'village granary', 'granary');
  const hasCityGranary    = hasInst('city granari');
  const hasStateGranary   = hasInst('state granary');
  const hasFishing        = hasInst('fish', 'fishing') || hasRes('fishing_grounds', 'river_fish');
  const hasPastoral       = hasInst('pastoral', 'grazing', 'livestock', 'shepherd', 'common graz');
  const hasHunting        = hasInst('hunting', 'managed forest', 'woodcutter');
  const hasOrchard        = hasInst('orchard', 'kitchen garden', 'herb garden');
  const hasMarket         = hasInst('market', 'marketplace', 'daily market', 'district market');
  const hasBakery         = hasInst('baker', 'bakery');
  const hasDruid          = hasInst('druid', 'grove', 'elder grove', 'sacred grove', 'warden');
  const hasDivine         = hasInst('cathedral', 'monastery', 'great cathedral', 'parish church');
  const hasArcane         = hasInst('mage', 'wizard', 'arcane', 'spellcasting');

  // ── Teleportation check (used in chains AND importCoverageRate) ─────────────
  const hasTeleport = instNames.some(n =>
    n.includes('teleportation') || n.includes('airship') || n.includes('planar')
  );

  // ── Source chain diversity ────────────────────────────────────────────────
  // Each independent chain is a fallback when others fail.
  const chains = {
    'Grain & agriculture': hasSubsistence || hasFarmland || hasRes('grain_fields', 'fertile_floodplain') || hasInst('granary', 'grain', 'mill', 'bakery', 'brewery', 'distillery'),
    'Pastoral & livestock': hasPastoral || hasRes('grazing_land') || hasInst('butcher', 'livestock', 'slaughter', 'dairy', 'cheese', 'tanner', 'tannery'),
    'Fishing & water':      hasFishing,
    'Hunting & foraging':   hasHunting || hasOrchard || hasRes('hunting_grounds', 'foraging_areas'),
    'Trade & imports':      (route !== 'isolated' || hasTeleport) && hasMarket,
  };
  const activeChains      = Object.entries(chains).filter(([,v])=>v).map(([k])=>k);
  const activeChainsCount = activeChains.length;
  const diversityScore    = Math.min(1, activeChainsCount / 3); // 0–1 normalized

  // ── Storage buffer (months of food security) ──────────────────────────────
  const baseStorage = hasStateGranary ? (tier === 'metropolis' ? 12 : 8)
                    : hasCityGranary  ? (tier === 'city' ? 7 : 5)
                    : hasGranary      ? (tier === 'town' ? 5 : tier === 'village' ? 3.5 : 2.5)
                    : (['thorp','hamlet'].includes(tier) ? 1.5 : 1.0);
  // Mill extends storage — flour lasts longer than grain
  const storageMonths = Math.round((hasMill ? baseStorage * 1.25 : baseStorage) * 10) / 10;

  // ── Import dependency ─────────────────────────────────────────────────────
  // How much of caloric needs can the settlement import, and does it need to?
  const importCapacity = { isolated:0, road:0.20, river:0.28, crossroads:0.42, port:0.58 }[route] ?? 0.15;
  const tierImportNeed = { thorp:0, hamlet:0, village:0.05, town:0.20, city:0.38, metropolis:0.52 }[tier] ?? 0;
  const importDependency = Math.min(importCapacity, tierImportNeed + (hasMarket ? 0.04 : 0));
  const importPct        = Math.round(importDependency * 100);

  // ── Magic food supplement ─────────────────────────────────────────────────
  // Tier-scaled: negligible at thorp/hamlet, meaningful at town+, significant at metro
  const magicActive    = magicExists && priorityMagic > 25;
  const magicTierScale = { thorp:0, hamlet:0, village:0.12, town:0.28, city:0.52, metropolis:0.78 }[tier] ?? 0;
  const magicInstMult  = hasDruid ? 1.5 : hasDivine ? 1.1 : hasArcane ? 0.8 : 0.4;
  const magicSupplement = magicActive
    ? Math.min(0.35, Math.max(0, (priorityMagic - 25) / 75) * magicTierScale * magicInstMult)
    : 0;
  // magicSupplement: 0 → 0.35 fraction of food pressure relieved by magic

  // ── Physics-based caloric calculation ────────────────────────────────────
  // Use the same constants as buildFactionList for consistency
  const terrainAgri    = TERRAIN_AGRI[terrain] ?? 1.0;
  let agriMod = 0;
  if ((hasSubsistence || hasFarmland) && hasRes('grain_fields','fertile_floodplain')) agriMod += 0.25;
  if (hasFarmland && hasRes('fertile_floodplain'))  agriMod += 0.10;
  if (hasPastoral  && hasRes('grazing_land'))        agriMod += 0.10;
  if (hasFishing   && hasRes('fishing_grounds','river_fish')) agriMod += 0.09;
  if (hasMill      && hasRes('river_mills'))         agriMod += 0.08;
  agriMod = Math.min(agriMod, 0.5);
  const effectiveAgri = Math.min(terrainAgri + agriMod, 2.0);

  // Stress modifiers
  const stressFamine  = stresses.includes('famine');
  const stressSiege   = stresses.includes('under_siege');
  const stressPlague  = stresses.includes('plague_onset');
  const stressOccupied= stresses.includes('occupied');
  let productionMult  = 1;
  let consumptionMult = 1;
  let effectiveRoute  = route;
  if (stressFamine)   { productionMult  *= 0.35; }
  if (stressSiege)    { productionMult  *= 0.60; effectiveRoute = 'isolated'; }
  if (stressPlague)   { productionMult  *= 0.75; }
  if (stressOccupied) { consumptionMult *= 1.20; }

  const dailyNeed       = population * PER_CAPITA_NEED * consumptionMult;
  const dailyProduction = Math.floor(population * AGRICULTURAL_WORKFORCE) * FARMER_PRODUCTION
                          * effectiveAgri * productionMult / 1.3; // /1.3 = STORAGE_BUFFER constant
  const rawSurplus      = dailyProduction - dailyNeed;
  const rawDeficit      = Math.max(0, -rawSurplus);
  // Magic trade bypass: isolated settlements with teleportation get import coverage
  // at ~road level — real but expensive; extraordinary cost is reflected in lower coverage
  // than a physical road (0.35), but still meaningful food security.
  const hasMagicTradeImport = effectiveRoute === 'isolated' && hasTeleport && config.magicExists !== false;
  // Terrain-aware import coverage: mountain/desert settlements structurally
  // depend on food imports — they import more efficiently (specialized trade infrastructure)
  const _isLowAgriTerrain = ['mountain','desert','hills'].includes(config.terrainType || '');
  const _terrainImportBoost = _isLowAgriTerrain && effectiveRoute !== 'isolated' ? 0.15 : 0;
  const importCoverageRate = hasMagicTradeImport     ? 0.30  // magic trade: real but expensive
                           : effectiveRoute === 'isolated'   ? 0
                           : effectiveRoute === 'port'       ? 0.70
                           : effectiveRoute === 'crossroads' ? 0.60
                           : effectiveRoute === 'river'      ? 0.50
                           : (0.35 + _terrainImportBoost);  // road: 0.35, or 0.50 for low-agri terrain
  const importCoverage  = rawDeficit > 0 ? Math.min(rawDeficit, rawDeficit * importCoverageRate) : 0;

  // Magic food offset
  let magicOffset = 0;
  const remaining = rawDeficit - importCoverage;
  if (magicActive && remaining > 0) {
    if (hasDruid  && priorityMagic >= 30) magicOffset = Math.max(magicOffset, remaining * 0.65);
    else if (hasDivine && config.priorityReligion >= 55) magicOffset = Math.max(magicOffset, remaining * 0.40);
    else if (hasArcane && priorityMagic >= 50)          magicOffset = Math.max(magicOffset, remaining * 0.30);
  }

  const deficit       = Math.max(0, rawDeficit - importCoverage - magicOffset);
  const deficitPct    = dailyNeed > 0 ? deficit / dailyNeed * 100 : 0;
  const surplusPct    = dailyNeed > 0 ? Math.max(0, rawSurplus / dailyNeed * 100) : 0;

  // Normalized food ratio — 1.0 = exactly adequate
  const localRatio    = dailyProduction / Math.max(1, dailyNeed);
  const importedRatio = importCoverage / Math.max(1, dailyNeed);
  const magicRatio    = magicOffset / Math.max(1, dailyNeed);
  const foodRatio     = Math.min(2.0, localRatio + importedRatio + magicRatio);

  // ── Food security label ───────────────────────────────────────────────────
  let label, color, bg;
  if (stressFamine) {
    label = 'Deficit — Active Famine';
    color = '#8b1a1a'; bg = '#fdf4f4';
  } else if (deficitPct > 40) {
    label = 'Deficit';
    color = '#8b1a1a'; bg = '#fdf4f4';
  } else if (deficitPct > 15) {
    label = 'Import-Dependent';
    color = '#8a3010'; bg = '#fdf0e8';
  } else if (deficitPct > 5) {
    label = 'Pressured';
    color = '#7a5010'; bg = '#faf8e8';
  } else if (surplusPct > 40) {
    label = 'Surplus';
    color = '#1a5a28'; bg = '#f0faf4';
  } else {
    label = 'Secure';
    color = '#2a6a38'; bg = '#f4fbf6';
  }

  // ── Prosperity modifier ───────────────────────────────────────────────────
  // Food security floors or caps prosperity before other modifiers apply
  let prosperityMod = null;
  // Magic-trade isolated settlements can import food at extraordinary cost — soften caps to penalties
  const _magicFoodMitigated = hasTeleport && config.magicExists !== false && effectiveRoute === 'isolated';
  // Terrain-structural deficits: mountain/desert settlements import food by economic design.
  // A mountain mining town or desert caravan hub with road trade access is NOT in crisis
  // just because it can't grow grain locally. Treat as structural dependency, not crisis cap.
  const _terrainStructural = (terrain === 'mountain' || terrain === 'desert' || terrain === 'hills')
    && effectiveRoute !== 'isolated';

  if (stressFamine) {
    prosperityMod = { type: 'cap', value: 0, reason: 'Active famine: food production collapsed, prosperity cannot exceed Struggling' };
  } else if (deficitPct > 40) {
    if (_terrainStructural) {
      // Mountain/desert: severe deficit is normal — penalty not hard cap, imports cover it
      prosperityMod = { type: 'penalty', value: -1, reason: 'Terrain requires significant food imports — structural dependency, not crisis' };
    } else if (_magicFoodMitigated) {
      prosperityMod = { type: 'cap', value: 2, reason: 'Severe food deficit mitigated by magical imports — prosperity capped at Moderate' };
    } else {
      prosperityMod = { type: 'cap', value: 1, reason: 'Severe structural food deficit caps prosperity at Poor' };
    }
  } else if (deficitPct > 20) {
    if (_terrainStructural) {
      // Minor penalty only — importing food is normal for these terrains
      prosperityMod = null; // no modifier — structural import is priced into economy
    } else if (_magicFoodMitigated) {
      prosperityMod = { type: 'penalty', value: -1, reason: 'Food imports via magical infrastructure are reliable but costly' };
    } else {
      prosperityMod = { type: 'cap', value: 1, reason: 'Food deficit caps prosperity at Poor' };
    }
  } else if (deficitPct > 8) {
    prosperityMod = { type: 'penalty', value: -1, reason: 'Food pressure reduces prosperity by one level' };
  } else if (surplusPct > 40 && activeChainsCount >= 3 && (hasGranary || hasCityGranary || hasStateGranary)) {
    prosperityMod = { type: 'bonus', value: 0.4, reason: 'Agricultural surplus with reserves provides modest prosperity bonus' };
  }

  // ── Descriptive narrative ─────────────────────────────────────────────────
  const diversityNote = activeChainsCount >= 4 ? 'highly diversified diet'
                      : activeChainsCount === 3 ? 'three food source types'
                      : activeChainsCount === 2 ? 'two food source types'
                      : activeChainsCount === 1 ? 'single food source'
                      : 'no established food chains';

  const storageNote = storageMonths >= 8 ? `${storageMonths} months strategic reserve`
                    : storageMonths >= 4 ? `${storageMonths} months buffer`
                    : storageMonths >= 2 ? 'seasonal buffer only'
                    : 'minimal storage — vulnerable to disruption';

  const magicNote = magicSupplement > 0.2 ? 'Significant magical food supplement'
                  : magicSupplement > 0.1 ? 'Modest magical food supplement'
                  : magicSupplement > 0 ? 'Trace magical food contribution'
                  : null;

  const importNote = importPct >= 40 ? `${importPct}% import-dependent — trade disruption = immediate crisis`
                   : importPct >= 20 ? `${importPct}% imported — meaningful external dependency`
                   : importPct >= 5  ? `${importPct}% supplemented by imports`
                   : null;

  return {
    label, color, bg,

    // Core metrics
    foodRatio:       Math.round(foodRatio * 100) / 100,
    deficitPct:      Math.round(deficitPct),
    surplusPct:      Math.round(surplusPct),
    dailyNeed:       Math.round(dailyNeed),
    dailyProduction: Math.round(dailyProduction),

    // Source chains
    chains,
    activeChains,
    activeChainsCount,
    diversityNote,

    // Storage
    storageMonths,
    storageNote,

    // Import dependency
    importPct,
    importDependency,
    importNote,

    // Magic
    magicSupplement: Math.round(magicSupplement * 100),  // as % of pressure
    magicNote,

    // Stress flags
    isDeficit:        deficitPct > 20 || stressFamine,
    isPressured:      deficitPct > 5 && deficitPct <= 20,
    isSecure:         deficitPct <= 5 && surplusPct <= 40,
    isSurplus:        surplusPct > 40,
    hasFamine:        stressFamine,
    hasSiege:         stressSiege,

    // Prosperity modifier to apply before base calculation
    prosperityMod,

    // For defense Disasters & Famine score
    resilienceScore: Math.round(
      (storageMonths / 12 * 35)          // storage weight
      + (diversityScore * 30)             // diversity weight
      + (importDependency < 0.2 ? 15 : importDependency < 0.4 ? 8 : 0) // low dependency bonus
      + (deficitPct < 5 ? 20 : deficitPct < 20 ? 10 : 0)               // adequacy bonus
    ),
  };
}

function tierDefaultPop(tier) {
  return { thorp:40, hamlet:200, village:600, town:3000, city:12000, metropolis:40000 }[tier] ?? 500;
}
