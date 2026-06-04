// Shared magic=0 filtering rules for generators, selectors, and UI panels.
// When magic is absent, arcane institutions and their derived goods/services
// are hidden from both generated output and user-facing catalogs.

export const ARCANE_INST_TAGS = ['arcane', 'planar', 'alchemy', 'enchanting'];
export const ARCANE_INST_KW   = [
  'wizard', 'mage', 'alchemist', 'enchant', 'spell', 'arcane',
  'scroll scribe', 'scroll', 'rune',
  'teleportation', 'planar', 'dream parlor', 'airship',
  'message network', 'academy of magic',
  "mages' guild", "mages' district", 'alchemist quarter', 'enchanter',
  'druid circle', 'elder grove council', 'elder grove',
  'hedge wizard', 'traveling hedge wizard', 'warden',
  'healer (divine', 'wandering healer', 'divine healer',
  'alchemist shop', 'teleportation circle', 'planar embassy', 'great library',
  'golem', 'undead labor', 'undead', 'skeletal',
  'dragon resident', 'dragon',
  'scrying',
];

const ARCANE_GOODS = [
  'Magical services', 'Enchanted items', 'Spell components', 'Arcane supplies',
  'Teleportation fees', 'Planar goods', 'Magic item consignment', 'Alchemical reagents',
  'Potions', 'Scrolls', 'Enchanted weapons', 'Magical textiles', 'Alchemical goods',
  'Dream parlor services', 'Airship transport',
];

/** Returns true if this institution is arcane-dependent and should be hidden at magic=0. */
function isArcaneInst(name, category, tags) {
  const n = (name     || '').toLowerCase();
  const c = (category || '').toLowerCase();
  const t = Array.isArray(tags) ? tags : [];
  if (c === 'magic' || c === 'exotic') return true;
  if (t.some(tag => ARCANE_INST_TAGS.includes(tag))) return true;
  if (ARCANE_INST_KW.some(kw => n.includes(kw))) return true;
  return false;
}

/** Returns true when magic content should be completely hidden. */
function noMagicWorld(config) {
  if (!config) return false;
  if (config.magicExists === false) return true;
  const pm = typeof config === 'number' ? config : (config.priorityMagic ?? 50);
  return pm === 0;
}

/** Filter a catalog tier object, removing arcane institutions when magic is off. */
export function filterCatalogForMagic(catalog, config) {
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

/** Filter a services map, removing arcane institutions when magic is off. */
export function filterServicesForMagic(services, config) {
  if (!noMagicWorld(config)) return services;
  const out = {};
  for (const [instName, svcDef] of Object.entries(services || {})) {
    if (!isArcaneInst(instName, '', [])) out[instName] = svcDef;
  }
  return out;
}

/** Filter goods list, removing magic-dependent goods when magic is off. */
export function filterGoodsForMagic(goods, config) {
  if (!noMagicWorld(config)) return goods;
  return (goods || []).filter(g => !ARCANE_GOODS.some(ag =>
    (typeof g === 'string' ? g : g.name || '').toLowerCase().includes(ag.toLowerCase())
  ));
}

/** Returns true if the magical_node resource should be hidden. */
export function isMagicalNodeFiltered(resourceKey, config) {
  if (!noMagicWorld(config)) return false;
  return resourceKey === 'magical_node';
}
