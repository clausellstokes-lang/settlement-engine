// factionCorrelation.js — Item 16: Power-economy correlation
// Faction presence modulates institution probability bidirectionally.
// Dominant factions get extra institution chances in their category,
// constrained by tier caps so small settlements don't over-inflate.

import { institutionalCatalog } from '../data/institutionalCatalog.js';
import { getBaseChance } from './institutionProbability.js';
import { chance } from './helpers.js';
import { ARCANE_INST_TAGS, ARCANE_INST_KW } from '../components/magicFilter.js';

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
const STRONG_THRESHOLD = 35;  // top-decile dominance — adds ONE signature institution
const MILD_THRESHOLD   = 28;  // present but not triggering signature

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
      // Check category toggle
      const catKey = `${tier}_${catalogCat}`;
      if (categoryToggles[catKey] === false) continue;

      // When magic doesn't exist in the world, skip the entire Magic catalog category
      if (config?.magicExists === false && catalogCat === 'Magic') continue;

      // Collect eligible institutions not already present
      const eligible = Object.entries(catInsts)
        .filter(([name]) => !existingNames.has(name.toLowerCase()))
        .filter(([name, def]) => {
          const toggle = institutionToggles[name];
          if (toggle === 'exclude' || toggle === false) return false;
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

      // Sort by baseChance descending — boost most likely candidates first
      eligible.sort((a, b) => (b[1].p || 0.5) - (a[1].p || 0.5));

      for (const [name, def] of eligible) {
        if (additions.length >= cap) break;

        // Boost multiplier: strong faction gets 1.5x, mild gets 1.2x
        const multiplier = boost.strength === 'strong' ? 1.3 : 1.1;
        const boostedChance = getBaseChance(
          (def.p || 0.5) * multiplier,
          catalogCat, name, config, null, {}
        );

        if (chance(Math.min(boostedChance, 0.85))) {
          additions.push({
            name,
            category: catalogCat,
            tier,
            source: 'faction_boost',
            factionSource: boost.factionName,
            p: def.p || 0.5,
            desc: def.desc || '',
          });
          existingNames.add(name.toLowerCase());
        }
      }
    }
  }

  return additions;
}
