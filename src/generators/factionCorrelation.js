// factionCorrelation.js — Item 16: Power-economy correlation
// Faction presence modulates institution probability bidirectionally.
// Dominant factions get extra institution chances in their category,
// constrained by tier caps so small settlements don't over-inflate.

import { institutionalCatalog } from '../data/institutionalCatalog.js';
import { getBaseChance } from './institutionProbability.js';
import { chance } from './helpers.js';
import { ARCANE_INST_TAGS, ARCANE_INST_KW } from '../domain/magicFilter.js';

// Faction category → catalog category keys
const FACTION_TO_CATALOG = {
  military:   ['Defense'],
  religious:  ['Religious'],
  criminal:   ['Criminal'],
  magic:      ['Magic'],
  economy:    ['Economy', 'Crafts'],
  government: ['Government'],
};

// How many institutions a faction boost can add, by tier
const TIER_BOOST_CAPS = {
  thorp:    0,
  hamlet:   0,   // no faction boost at hamlet — too small
  village:  0,   // ditto
  town:     1,   // one signature institution max
  city:     1,
  metropolis: 2,
};

// Power thresholds: faction must exceed these to trigger boosts
const _STRONG_THRESHOLD = 35;  // top-decile dominance — adds ONE signature institution
const _MILD_THRESHOLD   = 28;  // present but not triggering signature

/**
 * deriveFactionBoosts — compute boost descriptors from a factions array.
 * Returns [{factionCategory, catalogCategories, strength, factionName}]
 * Only factions exceeding MILD_THRESHOLD trigger boosts.
 */
export function deriveFactionBoosts(factions, tier) {
  if (TIER_BOOST_CAPS[tier] === 0) return [];

  const boosts = [];
  const seen = new Set(); // one boost per catalog category

  // Sort by power descending — most dominant faction wins each category
  const sorted = [...factions].sort((a, b) => (b.power||0) - (a.power||0));

  // Category-calibrated thresholds — each faction type has different power ceilings
  // set by the power generator. Metropolis gets a 3-point discount (more faction dilution).
  const tierDiscount = tier === 'metropolis' ? 3 : 0;
  const CATEGORY_THRESHOLDS = {
    economy:    28 - tierDiscount,
    military:   20 - tierDiscount,
    religious:  18 - tierDiscount,
    criminal:   13 - tierDiscount,  // caps at 16 (town/city), 12 (metro)
    magic:      16 - tierDiscount,
    government: 99,
  };

  // Only non-governing factions: the governing faction's category already
  // shapes institutions in the first pass. We want the pressure faction.
  sorted.forEach(faction => {
    if (faction.isGoverning) return;
    const fcat_pre = faction.category || 'government';
    if (fcat_pre === 'government') return; // skip government — handled by governing faction
    const power = faction.power || 0;
    const catThreshold = CATEGORY_THRESHOLDS[fcat_pre] || 99;
    if (power < catThreshold) return; // not dominant enough for this category

    const fcat = fcat_pre;
    const catalogCats = FACTION_TO_CATALOG[fcat] || [];
    if (catalogCats.length === 0) return;

    // Skip if this catalog category already has a boost from a stronger faction
    const key = catalogCats.join(',');
    if (seen.has(key)) return;
    seen.add(key);

    boosts.push({
      factionCategory: fcat,
      factionName:     faction.faction,
      power,
      catalogCategories: catalogCats,
      strength: power >= (catThreshold * 1.15) ? 'strong' : 'mild',
    });
  });

  return boosts;
}

/**
 * applyFactionInstitutionBoosts — run a capped second-chance pass for
 * institution categories weighted by dominant factions.
 * Returns new institutions to add (not already present).
 */
export function applyFactionInstitutionBoosts(
  boosts, existingInstitutions, tier, config,
  institutionToggles = {}, categoryToggles = {}
) {
  const cap      = TIER_BOOST_CAPS[tier] || 0;
  if (cap === 0 || boosts.length === 0) return [];

  const existingNames = new Set(
    existingInstitutions.map(i => (i.name || '').toLowerCase())
  );
  // Exact names + exclusive groups already seated — a faction pull must not
  // seat a second member of an exclusive group (same contract as cascade).
  const existingExact = new Set(existingInstitutions.map(i => i.name));
  const takenGroups   = new Set(existingInstitutions.map(i => i.exclusiveGroup).filter(Boolean));
  const TIER_ORD      = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
  const tierIdx       = TIER_ORD.indexOf(tier);
  const tradeRoute    = config?.tradeRouteAccess || null;
  const terrainType   = config?.terrainType || null;

  // Same exclusion semantics as assembleInstitutions' toggle sweep — toggles
  // are keyed `${tier}::${category}::${name}` (or legacy underscore form) and
  // valued {allow, require, forceExclude}. A DM's explicit exclusion survives
  // the faction pull; a dominant faction must not resurrect it. The bare-name
  // string/boolean forms are kept for legacy callers.
  const toggleExcluded = (name, cat) => {
    const toggle = institutionToggles[`${tier}::${cat}::${name}`]
                || institutionToggles[`${tier}_${cat}_${name}`]
                || institutionToggles[`all::${cat}::${name}`]
                || institutionToggles[`all_${cat}_${name}`]
                || institutionToggles[name];
    if (!toggle) return false;
    if (toggle === 'exclude' || toggle === false) return true;
    return toggle.forceExclude === true || toggle.allow === false;
  };

  const tierCatalog = institutionalCatalog[tier] || {};
  const additions   = [];

  // Only the single most dominant faction gets a signature institution
  const primaryBoost = boosts[0];
  if (!primaryBoost) return [];  // threshold already applied in deriveFactionBoosts
  for (const boost of [primaryBoost]) {
    if (additions.length >= cap) break;

    for (const catalogCat of boost.catalogCategories) {
      if (additions.length >= cap) break;

      const catInsts = tierCatalog[catalogCat] || {};
      // Check category toggle (both keying vocabularies in circulation)
      if (categoryToggles[`${tier}_${catalogCat}`]  === false) continue;
      if (categoryToggles[`${tier}::${catalogCat}`] === false) continue;
      if (categoryToggles[`all_${catalogCat}`]      === false) continue;
      if (categoryToggles[`all::${catalogCat}`]     === false) continue;

      // When magic doesn't exist in the world, skip the entire Magic catalog category
      if (config?.magicExists === false && catalogCat === 'Magic') continue;

      // Collect eligible institutions not already present
      const eligible = Object.entries(catInsts)
        .filter(([name]) => !existingNames.has(name.toLowerCase()))
        .filter(([name, def]) => {
          if (toggleExcluded(name, catalogCat)) return false;
          // Geography/exclusivity gates — same contract as assemble/cascade:
          // a dominant faction cannot legalise an institution the settlement's
          // trade route, terrain, tier floor, or exclusive-group seating refused.
          if (def.minTier && TIER_ORD.indexOf(def.minTier) > tierIdx) return false;
          if (tradeRoute && def.tradeRouteRequired) {
            const routeOk   = def.tradeRouteRequired.includes(tradeRoute);
            const terrainOk = !!(terrainType && def.terrainAccess?.includes(terrainType));
            if (!routeOk && !terrainOk) return false;
          }
          if (tradeRoute && def.forbiddenTradeRoutes?.includes(tradeRoute)) return false;
          if (terrainType && def.terrainRequired && !def.terrainRequired.includes(terrainType)) return false;
          if (def.exclusiveGroup && takenGroups.has(def.exclusiveGroup)) return false;
          if (def.exclusionConditions?.some(ex => existingExact.has(ex))) return false;
          // Skip arcane-tagged institutions when magic doesn't exist
          if (config?.magicExists === false) {
            const n = name.toLowerCase();
            const tags = def.tags || [];
            if (tags.some(t => t && ARCANE_INST_TAGS.includes(t))) return false;
            if (ARCANE_INST_KW.some(kw => n.includes(kw))) return false;
          }
          return true;
        });

      if (eligible.length === 0) continue;

      // Sort by baseChance descending — boost most likely candidates first.
      // Catalog probability field is `baseChance`; the catalog defines no `p`
      // field, so any other read silently collapses all rarity to a constant.
      eligible.sort((a, b) => (b[1].baseChance || 0) - (a[1].baseChance || 0));

      for (const [name, def] of eligible) {
        if (additions.length >= cap) break;

        // Boost multiplier: strong faction gets 1.3x, mild gets 1.1x —
        // a dampened nudge on the institution's REAL catalog rarity, run
        // through the same config-aware getBaseChance the assemble path uses.
        const multiplier = boost.strength === 'strong' ? 1.3 : 1.1;
        const boostedChance = getBaseChance(
          (def.baseChance || 0) * multiplier,
          catalogCat, name, config, null, {}
        );

        if (chance(Math.min(boostedChance, 0.85))) {
          // Carry the full catalog def (desc/tags/priorityCategory/...) like
          // the assemble + cascade paths do — downstream passes classify by
          // tags, and metadata stubs are invisible to tag-keyed consumers.
          additions.push({
            category: catalogCat,
            name,
            ...def,
            tier,
            source: 'faction_boost',
            factionSource: boost.factionName,
          });
          existingNames.add(name.toLowerCase());
          existingExact.add(name);
          if (def.exclusiveGroup) takenGroups.add(def.exclusiveGroup);
        }
      }
    }
  }

  return additions;
}
