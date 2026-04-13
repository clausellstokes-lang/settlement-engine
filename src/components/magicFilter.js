// magicFilter.js — shared utility for magic=0 filtering across all panels
// When priorityMagic === 0 ("Magic in the World" = off), arcane institutions,
// their services, related goods, and the magical node resource are hidden.

export const ARCANE_INST_TAGS = ['arcane', 'planar', 'alchemy', 'enchanting'];
export const ARCANE_INST_KW   = [
  // Arcane practitioners and institutions
  'wizard', 'mage', 'alchemist', 'enchant', 'spell', 'arcane',
  'scroll scribe', 'scroll', 'rune',
  // Magical infrastructure
  'teleportation', 'planar', 'dream parlor', 'airship',
  'message network', 'academy of magic',
  // Named magic institutions
  "mages' guild", "mages' district", 'alchemist quarter', 'enchanter',
  'druid circle', 'elder grove council', 'elder grove',
  'hedge wizard', 'traveling hedge wizard', 'warden',
  // Divine / supernatural healing
  'healer (divine', 'wandering healer', 'divine healer',
  // Specific named institutions (belt-and-suspenders alongside category filter)
  'alchemist shop', 'teleportation circle', 'planar embassy', 'great library',
  // Constructed / undead supernatural labor
  'golem', 'undead labor', 'undead', 'skeletal',
  // Fantastical creatures
  'dragon resident', 'dragon',
  // Scrying and divination
  'scrying',
];

/** Returns true if this institution is arcane-dependent and should be hidden at magic=0 */
function isArcaneInst(name, category, tags) {
  const n = (name     || '').toLowerCase();
  const c = (category || '').toLowerCase();
  const t = Array.isArray(tags) ? tags : [];
  // Entire Magic and Exotic categories are suppressed in no-magic worlds
  if (c === 'magic' || c === 'exotic') return true;
  if (t.some(tag => ARCANE_INST_TAGS.includes(tag))) return true;
  if (ARCANE_INST_KW.some(kw => n.includes(kw)))     return true;
  return false;
}

/** Returns true if magic content should be completely hidden.
 *  Triggered by magicExists===false OR priorityMagic===0. */
function noMagicWorld(config) {
  if (!config) return false;
  if (config.magicExists === false) return true;
  const pm = typeof config === 'number' ? config : (config.priorityMagic ?? 50);
  return pm === 0;
}

/** Returns true if this institution should be hidden given the current magic state */
function isMagicFiltered(name, category, tags, config) {
  if (!noMagicWorld(config)) return false;
  return isArcaneInst(name, category, tags);
}

/** Filter a catalog tier object, removing arcane institutions when magic is off */
export function filterCatalogForMagic(catalog, config) {
  if (!noMagicWorld(config)) return catalog;
  // Support legacy call: filterCatalogForMagic(catalog, number)
  const cfg = typeof config === 'number' ? { priorityMagic: config } : config;
  if (!noMagicWorld(cfg)) return catalog;
  const out = {};
  for (const [cat, insts] of Object.entries(catalog || {})) {
    const filtered = {};
    for (const [name, def] of Object.entries(insts || {})) {
      if (!isArcaneInst(name, cat, def.tags || [])) {
        filtered[name] = def;
      }
    }
    if (Object.keys(filtered).length > 0) out[cat] = filtered;
  }
  return out;
}

/** Filter a services map, removing entries for arcane institutions when magic = 0 */
function filterServicesForMagic(services, config) {
  if (!noMagicWorld(config)) return services;
  const out = {};
  for (const [instName, svcDef] of Object.entries(services || {})) {
    if (!isArcaneInst(instName, '', [])) out[instName] = svcDef;
  }
  return out;
}

/** Filter goods list, removing magic-dependent goods when magic = 0 */
const ARCANE_GOODS = [
  'Magical services', 'Enchanted items', 'Spell components', 'Arcane supplies',
  'Teleportation fees', 'Planar goods', 'Magic item consignment', 'Alchemical reagents',
  'Potions', 'Scrolls', 'Enchanted weapons', 'Magical textiles', 'Alchemical goods',
  'Dream parlor services', 'Airship transport',
];
function filterGoodsForMagic(goods, config) {
  if (!noMagicWorld(config)) return goods;
  return (goods || []).filter(g => !ARCANE_GOODS.some(ag =>
    (typeof g === 'string' ? g : g.name || '').toLowerCase().includes(ag.toLowerCase())
  ));
}

/** Returns true if the magical_node resource should be hidden */
function isMagicalNodeFiltered(resourceKey, config) {
  if (!noMagicWorld(config)) return false;
  return resourceKey === 'magical_node';
}
