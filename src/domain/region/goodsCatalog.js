/**
 * domain/region/goodsCatalog.js
 *
 * Canonical goods/services vocabulary for campaign-scale regional causality.
 * Existing settlement output uses human labels ("Bulk grain and foodstuffs",
 * "Milled flour", "Financial services"). The regional graph needs stable ids
 * so channels can compare exports/imports without brittle prose matching.
 *
 * Unknown labels are preserved as custom.<slug> ids. That keeps user content
 * and future packs lossless while still letting the engine reason over
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
    aliases: ['bulk grain', 'bulk grain and foodstuffs', 'grain and malt', 'wheat', 'barley', 'foodstuffs',
      'grain surplus', 'grain export', 'agricultural surplus', 'agricultural produce', 'surplus food', 'bulk food exports'],
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
    aliases: ['livestock', 'dairy products', 'meat', 'hides and meat', 'livestock and dairy', 'raw hides and animal products'],
  },
  provisions: {
    id: 'provisions',
    label: 'Preserved provisions',
    kind: 'good',
    category: 'food',
    criticality: 0.84,
    aliases: ['preserved provisions', 'salted meat', 'bread', 'rations', 'food preserves', 'preserved foods', 'salted provisions'],
  },
  salt: {
    id: 'salt',
    label: 'Salt',
    kind: 'good',
    category: 'food',
    criticality: 0.72,
    aliases: ['salt', 'desert salt', 'salt flats', 'sea salt', 'rock salt', 'salt blocks', 'evaporated salt', 'salt for preservation'],
  },
  timber: {
    id: 'timber',
    label: 'Timber',
    kind: 'good',
    category: 'raw_material',
    criticality: 0.62,
    aliases: ['timber', 'milled timber', 'milled lumber', 'hardwood beams', 'shipbuilding timber', 'lumber', 'structural timber', 'hewn timber'],
  },
  stone: {
    id: 'stone',
    label: 'Dressed stone',
    kind: 'good',
    category: 'raw_material',
    criticality: 0.5,
    aliases: ['stone', 'cut stone', 'dressed stone', 'masonry', 'building materials', 'marble', 'granite', 'cut stone and masonry', 'quarried stone'],
  },
  clay: {
    id: 'clay',
    label: 'Clay and ceramics',
    kind: 'good',
    category: 'raw_material',
    criticality: 0.38,
    aliases: ['clay', 'clay and ceramics materials', 'fired brick', 'pottery and ceramics', 'roof tiles', 'clay and raw materials'],
  },
  iron: {
    id: 'iron',
    label: 'Iron',
    kind: 'good',
    category: 'raw_material',
    criticality: 0.72,
    aliases: ['iron', 'iron ore', 'refined iron', 'iron ore (local mines exhausted)', 'basic metalwork', 'refined iron and metalwork', 'metal ore', 'metal goods'],
  },
  fuel: {
    id: 'fuel',
    label: 'Fuel and charcoal',
    kind: 'good',
    category: 'fuel',
    criticality: 0.68,
    aliases: ['fuel', 'charcoal', 'charcoal and fuel', 'coal', 'peat', 'firewood', 'fuel wood', 'peat fuel', 'coal and fuel'],
  },
  textiles: {
    id: 'textiles',
    label: 'Textiles',
    kind: 'good',
    category: 'finished_good',
    criticality: 0.46,
    aliases: ['textiles', 'wool', 'cloth', 'fulled cloth', 'luxury textiles', 'silk', 'linen', 'raw cloth', 'raw wool and hides', 'quality cloth'],
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
    aliases: ['luxury goods', 'jewellery', 'jewelry', 'cut gemstones', 'gems', 'spices', 'exotic goods',
      'luxury textiles and exotic goods', 'luxury imports', 'luxury'],
  },
  furs: {
    id: 'furs',
    label: 'Furs and pelts',
    kind: 'good',
    category: 'raw_material',
    criticality: 0.4,
    aliases: ['furs', 'pelts', 'furs and pelts', 'raw furs and pelts', 'quality furs', 'fur garments'],
  },
  raw_materials: {
    id: 'raw_materials',
    label: 'Bulk raw materials',
    kind: 'good',
    category: 'raw_material',
    criticality: 0.55,
    aliases: ['raw materials', 'bulk raw materials', 'bulk raw materials and agricultural goods', 'industrial inputs'],
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

/** @param {any} value */
function stripAnnotations(value) {
  return String(value || '')
    .replace(/\([^)]*\)/g, ' ')
    .replace(/[&/+]/g, ' ')
    .replace(/['"]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/** @param {any} value */
export function slugifyGood(value) {
  return String(value || 'unknown')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 64) || 'unknown';
}

/** @param {any} value */
function comparable(value) {
  return stripAnnotations(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** @param {any} value */
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

/** @param {any} label */
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

// Exact-alias resolution for subsumption/reconciliation: a catalog entry only
// when the (annotation-stripped) label is a VERBATIM id/label/alias hit.
// normalizeGood's fuzzy fallback is right for the regional graph ("does this
// prose roughly mean grain?") but wrong as a merge key — token overlap calls
// "Baked goods" iron (via "metal goods") and "Smoked seafood" salt (via "sea
// salt"), and merging on a guess erases real exports.
/** @param {any} label */
function exactCatalogEntry(label) {
  const key = comparable(label);
  return (key && ALIAS_INDEX.get(key)) || null;
}

/**
 * Exact-alias canonical good id for a trade label, or null when the label is
 * unrecognized, a service, or only fuzzy-matchable. The safe COMPARISON key
 * for display predicates: subsumption renames within a canonical good
 * ('Boots and shoes' surviving as 'Leather goods') stay matchable by id where
 * first-word/substring text checks snap.
 * @param {any} label
 */
export function exactGoodId(label) {
  const entry = exactCatalogEntry(label);
  return entry && entry.kind === 'good' ? entry.id : null;
}

/**
 * Convert any label/object into a canonical regional good/service entry.
 * @param {any} value
 */
export function normalizeGood(value) {
  if (value == null) return null;
  if (typeof value === 'object' && value.id && /** @type {Record<string, any>} */ (GOOD_CATALOG)[value.id]) {
    const entry = /** @type {Record<string, any>} */ (GOOD_CATALOG)[value.id];
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

/** @param {any} [values] */
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

const ANNOTATION_RE = /\([^)]*\)/;

// Within one canonical-id group, the surviving label is the one that carries
// the most information: an annotated label ("(local fields depleted)",
// "(transit)") explains why the entry exists and drives display pills; the
// catalog's own label ("Grain") beats catch-all phrasings ("Bulk grain and
// foodstuffs"); shorter beats longer; first-seen breaks ties.
/**
 * @param {string} a
 * @param {string} b
 * @param {any} entry
 */
function preferTradeLabel(a, b, entry) {
  // '(transit)' outranks every other annotation: reconcileTradeLists spares
  // transit re-exports by that marker, so a merge that erased it ("Refined
  // iron (transit) (taxed by occupation)" losing to the shorter "Iron ore
  // (taxed by occupation)") would hand the survivor to the import
  // contradiction check it was supposed to be spared from.
  const aTransit = /\(transit\)/i.test(a);
  const bTransit = /\(transit\)/i.test(b);
  if (aTransit !== bTransit) return aTransit ? a : b;
  const aAnn = ANNOTATION_RE.test(a);
  const bAnn = ANNOTATION_RE.test(b);
  if (aAnn !== bAnn) return aAnn ? a : b;
  if (entry && !entry.custom) {
    const canon = comparable(entry.label);
    const aCanon = comparable(a) === canon;
    const bCanon = comparable(b) === canon;
    if (aCanon !== bCanon) return aCanon ? a : b;
  }
  if (a.length !== b.length) return a.length < b.length ? a : b;
  return a;
}

/**
 * Collapse generic/specific duplicates inside one trade-goods list
 * ("Grain" + "Bulk grain and foodstuffs" + "Grain and malt" → "Grain")
 * while preserving order and annotated labels.
 *
 * Only catalog GOODS merge across different spellings, and only on an EXACT
 * alias hit — a fuzzy token-overlap match is a guess, not an identity, so a
 * fuzzy-only label stays verbatim like an unrecognized one. Services
 * collapse only on identical text: "Spellcasting (1st-3rd level)" and
 * "Magical identification" both canonicalize to arcane_services, but they
 * are genuinely distinct exports — merging them would erase real variety.
 * Unrecognized labels get the same identical-text-only rule, annotations
 * included ("Healing crystals (raw)" never merges with "Healing crystals
 * (cut)").
 *
 * opts.opaque — Set of lowercased labels that must never merge or be
 * renamed (user-authored custom trade goods; the dossier's gold tint
 * matches them by exact label).
 * @param {any} [labels]
 * @param {{ opaque?: any }} [opts]
 */
export function subsumeTradeGoods(labels = [], opts = {}) {
  const opaque = opts.opaque || null;
  const list = Array.isArray(labels) ? labels : [labels];
  const groups = new Map();
  const order = [];
  for (const raw of list) {
    if (raw == null || raw === '') continue;
    const label = String(raw);
    const isOpaque = opaque ? opaque.has(label.toLowerCase()) : false;
    const good = isOpaque ? null : exactCatalogEntry(label);
    const mergeable = !!good && good.kind === 'good';
    const key = mergeable ? good.id : `raw.${label.toLowerCase()}`;
    const existing = groups.get(key);
    if (!existing) {
      groups.set(key, { label, entry: mergeable ? good : null });
      order.push(key);
    } else {
      existing.label = preferTradeLabel(existing.label, label, existing.entry);
    }
  }
  return order.map(key => groups.get(key).label);
}

/**
 * Drop exports that the settlement simultaneously imports (same canonical
 * good): "Grain surplus" exported beside a "Bulk grain and foodstuffs"
 * import is a contradiction, not an economy. Transit re-exports are spared —
 * importing a good and re-selling it onward is what an entrepôt does.
 * Matching is exact-alias only: a fuzzy resemblance is not a contradiction,
 * and dropping an export on a guess erases a real economy line.
 * @param {any[]} [exports]
 * @param {any[]} [imports]
 */
export function reconcileTradeLists(exports = [], imports = []) {
  const importIds = new Set();
  for (const label of imports) {
    const good = exactCatalogEntry(label);
    if (good && good.kind === 'good') importIds.add(good.id);
  }
  return exports.filter(label => {
    if (/\(transit\)/i.test(String(label))) return true;
    const good = exactCatalogEntry(label);
    if (!good || good.kind !== 'good') return true;
    return !importIds.has(good.id);
  });
}

/** @param {any} goodOrId */
export function goodCriticality(goodOrId) {
  const id = typeof goodOrId === 'string' ? goodOrId : goodOrId?.id;
  if (!id) return 0.35;
  return /** @type {Record<string, any>} */ (GOOD_CATALOG)[id]?.criticality ?? goodOrId?.criticality ?? 0.35;
}

/**
 * @param {any[]} [left]
 * @param {any[]} [right]
 */
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

/** @param {any[]} [goods] */
export function summarizeGoods(goods = []) {
  return normalizeGoodsList(goods).map(g => g.label);
}
