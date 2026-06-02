/**
 * domain/region/goodsCatalog.js
 *
 * Canonical goods/services vocabulary for campaign-scale regional causality.
 * Existing settlement output uses human labels ("Bulk grain and foodstuffs",
 * "Milled flour", "Financial services"). The regional graph needs stable ids
 * so channels can compare exports/imports without brittle prose matching.
 *
 * Unknown labels are preserved as custom.<slug> ids. That keeps user content
 * and future packs lossless while still letting the P0 engine reason over
 * known staples.
 */

export const REGIONAL_GOOD_CATEGORIES = Object.freeze([
  'food',
  'raw_material',
  'fuel',
  'finished_good',
  'luxury',
  'service',
  'arcane',
  'military',
  'transport',
  'other',
]);

export const GOOD_CATALOG = Object.freeze({
  grain: {
    id: 'grain',
    label: 'Grain',
    kind: 'good',
    category: 'food',
    criticality: 0.95,
    aliases: ['bulk grain', 'bulk grain and foodstuffs', 'grain and malt', 'wheat', 'barley', 'foodstuffs'],
  },
  flour: {
    id: 'flour',
    label: 'Milled flour',
    kind: 'good',
    category: 'food',
    criticality: 0.9,
    aliases: ['milled flour', 'processed grain', 'bread flour', 'flour'],
  },
  fish: {
    id: 'fish',
    label: 'Fish',
    kind: 'good',
    category: 'food',
    criticality: 0.82,
    aliases: ['fish', 'river fish', 'salt fish', 'preserved fish'],
  },
  livestock: {
    id: 'livestock',
    label: 'Livestock and dairy',
    kind: 'good',
    category: 'food',
    criticality: 0.78,
    aliases: ['livestock', 'dairy products', 'meat', 'hides and meat', 'livestock and dairy'],
  },
  provisions: {
    id: 'provisions',
    label: 'Preserved provisions',
    kind: 'good',
    category: 'food',
    criticality: 0.84,
    aliases: ['preserved provisions', 'salted meat', 'bread', 'rations', 'food preserves'],
  },
  salt: {
    id: 'salt',
    label: 'Salt',
    kind: 'good',
    category: 'food',
    criticality: 0.72,
    aliases: ['salt', 'desert salt', 'salt flats'],
  },
  timber: {
    id: 'timber',
    label: 'Timber',
    kind: 'good',
    category: 'raw_material',
    criticality: 0.62,
    aliases: ['timber', 'milled timber', 'milled lumber', 'hardwood beams', 'shipbuilding timber', 'lumber'],
  },
  stone: {
    id: 'stone',
    label: 'Dressed stone',
    kind: 'good',
    category: 'raw_material',
    criticality: 0.5,
    aliases: ['stone', 'cut stone', 'dressed stone', 'masonry', 'building materials', 'marble', 'granite'],
  },
  clay: {
    id: 'clay',
    label: 'Clay and ceramics',
    kind: 'good',
    category: 'raw_material',
    criticality: 0.38,
    aliases: ['clay', 'clay and ceramics materials', 'fired brick', 'pottery and ceramics', 'roof tiles'],
  },
  iron: {
    id: 'iron',
    label: 'Iron',
    kind: 'good',
    category: 'raw_material',
    criticality: 0.72,
    aliases: ['iron', 'iron ore', 'refined iron', 'iron ore (local mines exhausted)', 'basic metalwork'],
  },
  fuel: {
    id: 'fuel',
    label: 'Fuel and charcoal',
    kind: 'good',
    category: 'fuel',
    criticality: 0.68,
    aliases: ['fuel', 'charcoal', 'charcoal and fuel', 'coal', 'peat', 'firewood'],
  },
  textiles: {
    id: 'textiles',
    label: 'Textiles',
    kind: 'good',
    category: 'finished_good',
    criticality: 0.46,
    aliases: ['textiles', 'wool', 'cloth', 'fulled cloth', 'luxury textiles', 'silk', 'linen'],
  },
  leather: {
    id: 'leather',
    label: 'Leather goods',
    kind: 'good',
    category: 'finished_good',
    criticality: 0.48,
    aliases: ['leather', 'leather goods', 'tanned leather', 'leather armour', 'boots and shoes', 'saddles and harness'],
  },
  arms: {
    id: 'arms',
    label: 'Weapons and armour',
    kind: 'good',
    category: 'military',
    criticality: 0.76,
    aliases: ['weapons and armour', 'weapons and armor', 'arms', 'armour', 'armor', 'military equipment'],
  },
  luxury_goods: {
    id: 'luxury_goods',
    label: 'Luxury goods',
    kind: 'good',
    category: 'luxury',
    criticality: 0.28,
    aliases: ['luxury goods', 'jewellery', 'jewelry', 'cut gemstones', 'gems', 'spices', 'exotic goods'],
  },
  arcane_reagents: {
    id: 'arcane_reagents',
    label: 'Arcane reagents',
    kind: 'good',
    category: 'arcane',
    criticality: 0.58,
    aliases: ['arcane reagents', 'alchemical reagents', 'rare herbs', 'magical components', 'planar energy'],
  },
  alchemical_goods: {
    id: 'alchemical_goods',
    label: 'Alchemical goods',
    kind: 'good',
    category: 'arcane',
    criticality: 0.44,
    aliases: ['alchemical trade', 'potions', 'reagents', 'alchemical products and services'],
  },
  financial_services: {
    id: 'financial_services',
    label: 'Financial services',
    kind: 'service',
    category: 'service',
    criticality: 0.35,
    aliases: ['financial services', 'letters of credit', 'banking fees', 'banking and finance'],
  },
  legal_services: {
    id: 'legal_services',
    label: 'Legal services',
    kind: 'service',
    category: 'service',
    criticality: 0.32,
    aliases: ['legal services', 'contracts', 'notarial'],
  },
  religious_services: {
    id: 'religious_services',
    label: 'Religious services',
    kind: 'service',
    category: 'service',
    criticality: 0.45,
    aliases: ['religious services', 'pilgrimage', 'pilgrimage and religious tourism', 'temple authority'],
  },
  education_services: {
    id: 'education_services',
    label: 'Educational services',
    kind: 'service',
    category: 'service',
    criticality: 0.25,
    aliases: ['higher education', 'educational services', 'degrees', 'training'],
  },
  medical_services: {
    id: 'medical_services',
    label: 'Medical services',
    kind: 'service',
    category: 'service',
    criticality: 0.7,
    aliases: ['medical services', 'surgical services', 'healing services', 'medicinal herbs'],
  },
  military_services: {
    id: 'military_services',
    label: 'Military contract services',
    kind: 'service',
    category: 'military',
    criticality: 0.66,
    aliases: ['military contract services', 'armed escort', 'mercenary hire', 'military contracts'],
  },
  transport_services: {
    id: 'transport_services',
    label: 'Transport and logistics',
    kind: 'service',
    category: 'transport',
    criticality: 0.74,
    aliases: ['warehousing and logistics services', 'port and maritime services', 'maritime services', 'cargo', 'pilotage'],
  },
  arcane_services: {
    id: 'arcane_services',
    label: 'Arcane services',
    kind: 'service',
    category: 'arcane',
    criticality: 0.5,
    aliases: ['arcane services', 'spellcasting services', 'identification', 'enchanting', 'magical services'],
  },
});

const TOKEN_STOPWORDS = new Set([
  'and', 'the', 'for', 'from', 'with', 'via', 'local', 'bulk', 'trade',
  'imports', 'exports', 'import', 'export', 'taxed', 'transit', 'only',
  'naval', 'route', 'routes',
]);

function stripAnnotations(value) {
  return String(value || '')
    .replace(/\([^)]*\)/g, ' ')
    .replace(/[&/+]/g, ' ')
    .replace(/['"]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function slugifyGood(value) {
  return String(value || 'unknown')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 64) || 'unknown';
}

function comparable(value) {
  return stripAnnotations(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function tokensOf(value) {
  return comparable(value)
    .split(' ')
    .filter(t => t.length > 2 && !TOKEN_STOPWORDS.has(t));
}

function buildAliasIndex() {
  const index = new Map();
  for (const entry of Object.values(GOOD_CATALOG)) {
    index.set(comparable(entry.id), entry);
    index.set(comparable(entry.label), entry);
    for (const alias of entry.aliases || []) {
      index.set(comparable(alias), entry);
    }
  }
  return index;
}

const ALIAS_INDEX = buildAliasIndex();

function fuzzyMatch(label) {
  const labelTokens = tokensOf(label);
  if (!labelTokens.length) return null;
  let best = null;
  let bestScore = 0;

  for (const entry of Object.values(GOOD_CATALOG)) {
    const candidates = [entry.id, entry.label, ...(entry.aliases || [])];
    for (const candidate of candidates) {
      const candidateTokens = tokensOf(candidate);
      if (!candidateTokens.length) continue;
      const overlap = labelTokens.filter(t =>
        candidateTokens.some(c => c === t || c.startsWith(t) || t.startsWith(c))
      ).length;
      const score = overlap / Math.max(labelTokens.length, candidateTokens.length);
      if (score > bestScore) {
        best = entry;
        bestScore = score;
      }
    }
  }

  return bestScore >= 0.42 ? best : null;
}

/**
 * Convert any label/object into a canonical regional good/service entry.
 */
export function normalizeGood(value) {
  if (value == null) return null;
  if (typeof value === 'object' && value.id && GOOD_CATALOG[value.id]) {
    const entry = GOOD_CATALOG[value.id];
    return { ...entry, sourceLabel: value.label || value.name || entry.label };
  }

  const raw = typeof value === 'object'
    ? (value.label || value.name || value.product || value.chain || value.output || value.exportLabel || value.id)
    : value;
  const label = stripAnnotations(raw);
  if (!label) return null;

  const exact = ALIAS_INDEX.get(comparable(label));
  const entry = exact || fuzzyMatch(label);
  if (entry) {
    return { ...entry, sourceLabel: String(raw || label) };
  }

  const customId = `custom.${slugifyGood(label)}`;
  return {
    id: customId,
    label,
    sourceLabel: String(raw || label),
    kind: 'good',
    category: 'other',
    criticality: 0.35,
    aliases: [],
    custom: true,
  };
}

export function normalizeGoodsList(values = []) {
  const list = Array.isArray(values) ? values : [values];
  const out = [];
  const seen = new Set();
  for (const value of list) {
    const good = normalizeGood(value);
    if (!good || seen.has(good.id)) continue;
    seen.add(good.id);
    out.push(good);
  }
  return out;
}

export function goodCriticality(goodOrId) {
  const id = typeof goodOrId === 'string' ? goodOrId : goodOrId?.id;
  if (!id) return 0.35;
  return GOOD_CATALOG[id]?.criticality ?? goodOrId?.criticality ?? 0.35;
}

export function goodsIntersect(left = [], right = []) {
  const leftGoods = normalizeGoodsList(left);
  const rightGoods = normalizeGoodsList(right);
  const rightById = new Map(rightGoods.map(g => [g.id, g]));
  const matches = [];
  for (const good of leftGoods) {
    if (rightById.has(good.id)) {
      matches.push({ ...good, matchedLabel: rightById.get(good.id).sourceLabel });
    }
  }
  return matches;
}

export function summarizeGoods(goods = []) {
  return normalizeGoodsList(goods).map(g => g.label);
}
