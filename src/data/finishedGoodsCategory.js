// finishedGoodsCategory.js — the FINISHED-GOODS demand cluster + its label→category
// classifier, split out of economicData.js as the EAGER first-paint leaf.
//
// FIRST-PAINT SEAM (FP-G4): the only first-paint edge into economicData.js was
// domain/region/tradeLinks.js importing `finishedGoodsCategoryOf`. That function
// needs INSTITUTION_FINISHED_GOODS_DEMAND (via the derived index) but NOT the far
// larger TRADE_DEPENDENCY_NEEDS raw-material table (~21 kB of the source). Moving
// this small surface to a zero-import leaf lets economicData.js (TRADE_DEPENDENCY_
// NEEDS) leave the first-paint static closure entirely — its remaining consumers
// (the economy generators + the finished-goods-demand test) are all lazy. This is
// the npcData → npcTraitWeights idiom: economicData.js re-exports the two public
// symbols verbatim so its lazy consumers stay byte-identical.
// @enforced-by tests/build/vendorPdfLazy.test.js (first-paint byte budget).
//
// Maps institution categories to finished goods they CONSUME at operating scale.
// Unlike TRADE_DEPENDENCY_NEEDS (which fires when raw materials are absent),
// this table fires when demand for finished goods exceeds local production
// capacity — even when raw materials are present.
//
// demandLevel:         How much finished goods consumed (1=minimal, 5=bulk)
// supplyKeywords:      Institution name fragments that cover this demand locally
// supplyPerKeyword:    How much supply each keyword provides (matches demandLevel scale)
// importLabels:        [small gap, medium gap, large gap] — scaled import labels
// exportBonus:         Export label when supply significantly exceeds demand
//
export const INSTITUTION_FINISHED_GOODS_DEMAND = {

  // ── Military arms & equipment ──────────────────────────────────────────────
  // Military institutions consume weapons, armour, and equipment continuously.
  // Local smithing supply may or may not cover the demand depending on scale.
  military: {
    consumers: {
      'citizen militia':          { demand: 1 },
      'palisade or earthworks':   { demand: 1 },
      'veteran\'s lodge':         { demand: 1 },
      'town watch':               { demand: 2 },
      'professional city watch':  { demand: 3 },
      'barracks':                 { demand: 3 },
      'free company hall':        { demand: 3 },
      'warden\'s lodge':          { demand: 2 },
      'garrison':                 { demand: 4 },
      'multiple garrisons':       { demand: 5 },
      'mercenary quarter':        { demand: 4 },
      'citadel':                  { demand: 3 },
      'massive walls':            { demand: 2 },  // iron fittings, maintenance
      'adventurers\' charter hall': { demand: 1 },
      'multiple adventurers\'':   { demand: 2 },
    },
    suppliers: {
      'resident smith':           { supply: 1 },
      'blacksmith':               { supply: 2 },
      'blacksmiths (3-10)':       { supply: 3 },
      'smelter':                  { supply: 1 },   // additive
      'specialized metalworkers': { supply: 5 },
      'specialized metal':        { supply: 5 },
      'dungeon delving supply':   { supply: 1 },   // handles adventuring demand
    },
    importLabels: [
      'Replacement arms and basic equipment',
      'Quality weapons and armour',
      'Advanced weapons and armour (bulk contract)',
    ],
    exportBonus: 'Quality tools and weapons',
    // Only fire imports at hamlet+ (thorps can't be armed commercially)
    minTier: 'hamlet',
  },

  // ── Religious consumables ──────────────────────────────────────────────────
  // Religious institutions consume incense, candles, ritual oil, vestment
  // materials, and vellum at operating scale. These are almost never produced
  // locally — they are imported luxury/specialty goods by default.
  religious: {
    consumers: {
      'parish church':            { demand: 1 },
      'parish churches (2-5)':    { demand: 2 },
      'parish churches (10-30)':  { demand: 3 },
      'parish churches (50-100+)':{ demand: 4 },
      'monastery or friary':      { demand: 2 },
      'major monasteries':        { demand: 3 },
      'great cathedral':          { demand: 4 },
      'cathedral (10,000+':       { demand: 3 },
      'small hospital':           { demand: 1 },   // linen, herbs already in dep table; add ritual
      'major hospital':           { demand: 2 },
      'hospital network':         { demand: 3 },
    },
    suppliers: {
      // Local beeswax covers candles
      'beekeeper':                { supply: 1 },
      // Local chandler covers candles + some ritual supplies
      'chandler':                 { supply: 2 },
      // Apothecary covers some herbal ritual ingredients
      'apothecary':               { supply: 1 },
    },
    importLabels: [
      'Incense and votive candles',
      'Incense, ritual oil, and vestment materials',
      'Incense, ritual oil, sacred texts, and vestment cloth (bulk)',
    ],
    exportBonus: null,   // religious institutions don't generate arms-type export surplus
    minTier: 'hamlet',
  },

  // ── Maritime operational supplies ─────────────────────────────────────────
  // Ships, docks, and port infrastructure consume cordage, sailcloth, tar,
  // and timber continuously. Timber deps are in TRADE_DEPENDENCY_NEEDS;
  // these cover the FINISHED operational supplies (rope, canvas, pitch).
  maritime: {
    consumers: {
      'docks/port facilities':          { demand: 2 },
      'harbour master\'s office':       { demand: 1 },
      'barge and river transport':      { demand: 2 },
      'shipyard':                       { demand: 3 },
      'river boatyard':                 { demand: 2 },
      'river ferry':                    { demand: 1 },
    },
    suppliers: {
      // Ropemaker covers cordage demand
      'ropemaker':                      { supply: 2 },
      // Local managed forest partially covers timber-based supplies
      'managed_forest':                 { supply: 1 },  // resource key check
    },
    importLabels: [
      'Rope, oakum, and rigging supplies',
      'Cordage, canvas, and vessel-maintenance supplies',
      'Cordage, tar, timber fittings, and bulk vessel supplies',
    ],
    exportBonus: null,
    minTier: 'hamlet',
    routeRequired: ['port', 'river'],   // only fires if trade route is water-based
  },

  // ── Luxury fabric & dye consumption ──────────────────────────────────────
  // Luxury goods quarters, nobility, and entertainment districts consume
  // silk, fine dye, and imported cloth that local wool cannot substitute.
  luxury: {
    consumers: {
      'luxury goods quarter':           { demand: 3 },
      'slave market district':          { demand: 1 },  // luxury garments for buyers
      'auction house':                  { demand: 1 },
      'opera house':                    { demand: 2 },
      'theaters':                       { demand: 1 },
      'bardic college':                 { demand: 1 },
    },
    suppliers: {
      'weavers':                        { supply: 1 },
      'tailor':                         { supply: 1 },
      'dyer':                           { supply: 2 },
      'luxury goods':                   { supply: 3 },
    },
    importLabels: [
      'Luxury textiles and exotic goods',
      'Silk, fine dyes, and imported cloth',
      'Silk, fine dyes, exotic textiles, and finished luxury garments',
    ],
    exportBonus: null,
    minTier: 'town',
  },

  // ── Alchemical & scholarly reagents ──────────────────────────────────────
  // Alchemist quarters, academies, and scribes consume specialty reagents,
  // inks, binding materials, and rare ingredients at operating scale.
  alchemical: {
    consumers: {
      'alchemist shop':                 { demand: 1 },
      'alchemist quarter':              { demand: 3 },
      'academy of magic':               { demand: 2 },
      'scroll scribe':                  { demand: 1 },
      'great library':                  { demand: 2 },
      'sage\'s quarter':                { demand: 1 },
      'printing house':                 { demand: 2 },
      'enchanter\'s shop':              { demand: 1 },
    },
    suppliers: {
      'apothecary':                     { supply: 1 },
      'apothecary district':            { supply: 2 },
      'foraging_areas':                 { supply: 1 },  // resource key (herbs); was dead 'foraging' — no '_' so it took the institution-name path and matched nothing
      'magical_node':                   { supply: 1 },  // resource key check
    },
    importLabels: [
      'Alchemical reagents and scribal supplies',
      'Alchemical reagents, rare minerals, and imported inks',
      'Alchemical reagents, rare minerals, inks, and binding materials (bulk)',
    ],
    exportBonus: 'Alchemical trade (potions, reagents)',
    minTier: 'hamlet',
  },
};

// §14 — map a good LABEL to the finished-goods demand category it belongs to
// (military / religious / maritime / luxury / alchemical). Matches against each
// category's importLabels + exportBonus first, then a keyword fallback. Lets the
// cross-settlement trade matcher bridge a specific good (a neighbour's "Advanced
// weapons and armour" import) to a category (our Dragonbone Greatswords, which
// `satisfies: military`). Returns null when nothing matches.
const _FINISHED_GOODS_CATEGORY_INDEX = (() => {
  const idx = [];
  for (const [cat, cfg] of Object.entries(INSTITUTION_FINISHED_GOODS_DEMAND)) {
    for (const l of (cfg.importLabels || [])) idx.push([cat, String(l).toLowerCase()]);
    if (cfg.exportBonus) idx.push([cat, String(cfg.exportBonus).toLowerCase()]);
  }
  return idx;
})();

/** @type {Array<[string, RegExp]>} */
const _FINISHED_GOODS_KEYWORDS = [
  ['military', /\b(weapon|armou?r|blade|sword|arms|siege|polearm|shield)\b/],
  ['religious', /\b(incense|ritual|vestment|sacred|votive|candle|reliquary)\b/],
  ['maritime', /\b(cordage|sailcloth|rope|tar|pitch|naval|rigging|canvas)\b/],
  ['luxury', /\b(luxur|silk|spice|jewel|gem|fine|perfume|ivory)\b/],
  ['alchemical', /\b(potion|reagent|alchem|elixir|ink|scribal)\b/],
];

export function finishedGoodsCategoryOf(label) {
  if (!label) return null;
  const s = String(label).toLowerCase();
  for (const [cat, l] of _FINISHED_GOODS_CATEGORY_INDEX) {
    if (s.includes(l) || l.includes(s)) return cat;
  }
  for (const [cat, re] of _FINISHED_GOODS_KEYWORDS) {
    if (re.test(s)) return cat;
  }
  return null;
}
