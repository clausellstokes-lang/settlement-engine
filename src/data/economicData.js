// economicData.js — Trade dependency lookup table
// Extracted from generateEconomicState (was inline anonymous block)
// Maps institution/service name → { resources, label, detail, svcs }
//
// CONSTRAINT: keys are looked up by EXACT institution name
// (TRADE_DEPENDENCY_NEEDS[inst.name] in economicGenerator), so every key must
// be an exact institutionalCatalog.js name — enforced by tests/joins/goods.test.js.

export const TRADE_DEPENDENCY_NEEDS = {
      "Access to external mill": {
        resources: [
          "grain_fields",
          "fertile_floodplain"
        ],
        label: "Grain",
        detail: "grain for milling",
        svcs: [
          "flour milling",
          "grain processing"
        ]
      },
      Mill: {
        resources: [
          "grain_fields",
          "fertile_floodplain",
          "river_mills"
        ],
        label: "Grain",
        detail: "grain for milling",
        svcs: [
          "flour milling",
          "grain processing",
          "flour purchase"
        ]
      },
      "Mills (2-5)": {
        resources: [
          "grain_fields",
          "fertile_floodplain",
          "river_mills"
        ],
        label: "Grain + water power",
        detail: "grain and mill sites for water-powered milling",
        svcs: [
          "flour milling",
          "grain processing",
          "flour purchase"
        ]
      },
      "Town granary": {
        resources: [
          "grain_fields",
          "fertile_floodplain"
        ],
        label: "Grain",
        detail: "grain reserves for storage",
        svcs: [
          "grain storage",
          "emergency reserves"
        ]
      },
      "City granaries": {
        resources: [
          "grain_fields",
          "fertile_floodplain"
        ],
        label: "Grain",
        detail: "grain reserves at scale",
        svcs: [
          "grain storage",
          "emergency reserves",
          "rationing"
        ]
      },
      "State granary complex": {
        resources: [
          "grain_fields",
          "fertile_floodplain"
        ],
        label: "Grain",
        detail: "grain at metropolitan scale",
        svcs: [
          "grain storage",
          "emergency reserves",
          "rationing",
          "strategic reserve"
        ]
      },
      "Subsistence farming": {
        resources: [
          "grain_fields",
          "fertile_floodplain",
          "grazing_land"
        ],
        label: "Farmland",
        detail: "arable land for subsistence crops",
        svcs: [
          "basic food production"
        ]
      },
      "Common grazing land": {
        resources: [
          "grazing_land",
          "fertile_floodplain"
        ],
        label: "Grazing land",
        detail: "pasture for common livestock",
        svcs: [
          "livestock grazing",
          "dairy",
          "wool"
        ]
      },
      "Bakers (5-15)": {
        resources: [
          "grain_fields",
          "fertile_floodplain"
        ],
        label: "Grain",
        detail: "grain for baking",
        svcs: [
          "bread and pastry",
          "rations"
        ]
      },
      Alehouse: {
        resources: [
          "grain_fields",
          "fertile_floodplain"
        ],
        label: "Grain",
        detail: "grain for brewing",
        svcs: [
          "ale",
          "basic food"
        ]
      },
      "Ale house": {
        resources: [
          "grain_fields",
          "fertile_floodplain"
        ],
        label: "Grain",
        detail: "grain for brewing",
        svcs: [
          "ale",
          "basic food"
        ]
      },
      "Taverns (5-20)": {
        resources: [
          "grain_fields",
          "fertile_floodplain"
        ],
        label: "Grain",
        detail: "grain for brewing and baking",
        svcs: [
          "meals",
          "ale",
          "lodging"
        ]
      },
      "Inns and taverns (district)": {
        resources: [
          "grain_fields",
          "fertile_floodplain"
        ],
        label: "Grain",
        detail: "grain for district-scale hospitality",
        svcs: [
          "meals",
          "ale",
          "lodging"
        ]
      },
      "Resident smith (part-time)": {
        resources: [
          "iron_deposits",
          "coal_deposits"
        ],
        label: "Iron + fuel",
        detail: "iron ore and charcoal for smithing",
        svcs: [
          "tool repair",
          "basic metalwork",
          "horseshoes"
        ]
      },
      "Blacksmiths (3-10)": {
        resources: [
          "iron_deposits",
          "coal_deposits"
        ],
        label: "Iron + fuel",
        detail: "iron ore and fuel for forging at scale",
        svcs: [
          "weapon repair",
          "tool sharpening",
          "armour fitting",
          "horseshoes",
          "metalwork commission"
        ]
      },
      "Specialized metalworkers": {
        resources: [
          "iron_deposits",
          "coal_deposits",
          "precious_metals"
        ],
        label: "Metal ore + fuel",
        detail: "iron and precious metals for specialist work",
        svcs: [
          "fine metalwork",
          "armour crafting",
          "weapon commission",
          "jewellery"
        ]
      },
      "Craft guilds (100-150+)": {
        resources: [
          "iron_deposits",
          "coal_deposits",
          "precious_metals",
          "gemstone_deposits"
        ],
        label: "Metal ore + gems",
        detail: "metal and gemstones for specialist production",
        svcs: [
          "luxury goods",
          "specialist commission",
          "fine jewellery"
        ]
      },
      "Citizen militia": {
        resources: [
          "iron_deposits"
        ],
        label: "Iron",
        detail: "iron for weapons and basic armour",
        svcs: [
          "settlement defence",
          "border patrol"
        ]
      },
      "Town watch": {
        resources: [
          "iron_deposits"
        ],
        label: "Iron",
        detail: "iron for weapons and equipment",
        svcs: [
          "law enforcement",
          "patrol",
          "gate control"
        ]
      },
      "Professional city watch": {
        resources: [
          "iron_deposits",
          "coal_deposits"
        ],
        label: "Iron + fuel",
        detail: "iron for equipment, fuel for maintenance forges",
        svcs: [
          "law enforcement",
          "patrol",
          "investigation",
          "gate control"
        ]
      },
      Barracks: {
        resources: [
          "iron_deposits",
          "grain_fields",
          "coal_deposits"
        ],
        label: "Iron + grain + fuel",
        detail: "iron for armaments, grain for soldiers, fuel for forges",
        svcs: [
          "military garrison",
          "armed response",
          "siege defence"
        ]
      },
      Garrison: {
        resources: [
          "iron_deposits",
          "grain_fields",
          "coal_deposits"
        ],
        label: "Iron + grain + fuel",
        detail: "iron, grain, and fuel for garrison operations",
        svcs: [
          "military garrison",
          "armed response",
          "siege defence",
          "patrol"
        ]
      },
      "Multiple garrisons": {
        resources: [
          "iron_deposits",
          "grain_fields",
          "coal_deposits"
        ],
        label: "Iron + grain + fuel",
        detail: "iron, grain, and fuel for multiple garrisons",
        svcs: [
          "city defence",
          "armed response",
          "riot control"
        ]
      },
      "Free company hall": {
        resources: [
          "iron_deposits",
          "grain_fields"
        ],
        label: "Iron + grain",
        detail: "iron for armaments and grain for provisioning",
        svcs: [
          "mercenary hire",
          "armed escort",
          "siege support"
        ]
      },
      "Mercenary quarter": {
        resources: [
          "iron_deposits",
          "grain_fields"
        ],
        label: "Iron + grain",
        detail: "iron and grain for mercenary provisioning",
        svcs: [
          "mercenary hire",
          "armed escort",
          "contract soldiers"
        ]
      },
      "Town walls": {
        resources: [
          "stone_quarry"
        ],
        label: "Stone",
        detail: "quarried stone for wall construction and repair",
        svcs: [
          "settlement defence",
          "gate control"
        ]
      },
      "City walls and gates": {
        resources: [
          "stone_quarry"
        ],
        label: "Stone",
        detail: "stone for city wall maintenance",
        svcs: [
          "city defence",
          "gate control",
          "customs inspection"
        ]
      },
      "Massive walls and fortifications": {
        resources: [
          "stone_quarry",
          "iron_deposits"
        ],
        label: "Stone + iron",
        detail: "stone and iron for metropolitan fortifications",
        svcs: [
          "city defence",
          "siege resistance",
          "gate control"
        ]
      },
      Citadel: {
        resources: [
          "stone_quarry",
          "iron_deposits",
          "grain_fields"
        ],
        label: "Stone + iron + grain",
        detail: "stone, iron, and grain for citadel operations",
        svcs: [
          "last-resort defence",
          "command post",
          "long siege endurance"
        ]
      },
      "Cathedral (10,000+ only)": {
        resources: [
          "stone_quarry"
        ],
        label: "Stone",
        detail: "quarried stone for cathedral maintenance",
        svcs: [
          "religious services",
          "pilgrimage",
          "theological education"
        ]
      },
      "Great cathedral": {
        resources: [
          "stone_quarry"
        ],
        label: "Stone",
        detail: "stone for metropolitan cathedral maintenance",
        svcs: [
          "religious services",
          "pilgrimage centre",
          "diocesan administration"
        ]
      },
      "Carpenter (part-time)": {
        resources: [
          "managed_forest",
          "shipbuilding_timber"
        ],
        label: "Timber",
        detail: "raw timber for carpentry",
        svcs: [
          "basic construction",
          "furniture",
          "tool handles"
        ]
      },
      "Carpenters (5-15)": {
        resources: [
          "managed_forest",
          "shipbuilding_timber"
        ],
        label: "Timber",
        detail: "raw timber for carpentry at scale",
        svcs: [
          "construction",
          "furniture",
          "barrel making",
          "wagon repair"
        ]
      },
      "Docks/port facilities": {
        resources: [
          "shipbuilding_timber",
          "managed_forest"
        ],
        label: "Timber",
        detail: "timber for dock construction and maintenance",
        svcs: [
          "ship berthing",
          "cargo handling",
          "dock repair"
        ]
      },
      Shipyard: {
        resources: [
          "shipbuilding_timber",
          "managed_forest",
          "iron_deposits"
        ],
        label: "Timber + iron",
        detail: "timber and iron for ship construction",
        svcs: [
          "ship construction",
          "ship repair",
          "vessel fitting"
        ]
      },
      "Printing house": {
        resources: [
          "managed_forest"
        ],
        label: "Timber/rags (paper)",
        detail: "wood pulp and rags for paper production",
        svcs: [
          "printed documents",
          "books",
          "pamphlets"
        ]
      },
      "Great library": {
        resources: [
          "managed_forest",
          "ancient_ruins"
        ],
        label: "Paper + knowledge sources",
        detail: "paper for ongoing collection and ancient texts",
        svcs: [
          "research",
          "document copying",
          "archival access"
        ]
      },
      "Sage's quarter": {
        resources: [
          "managed_forest"
        ],
        label: "Paper materials",
        detail: "paper for scribal and research work",
        svcs: [
          "research",
          "document copying",
          "sage consultation"
        ]
      },
      "Butchers (3-8)": {
        resources: [
          "grazing_land",
          "hunting_grounds",
          "fertile_floodplain"
        ],
        label: "Livestock / game",
        detail: "live animals for slaughter",
        svcs: [
          "fresh meat",
          "rendered fat"
        ]
      },
      "Weavers/Textile workers": {
        resources: [
          "grazing_land",
          "grain_fields"
        ],
        label: "Wool / flax",
        detail: "raw wool from livestock or flax from fields",
        svcs: [
          "cloth purchase",
          "garment tailoring",
          "textile dyeing"
        ]
      },
      "Luxury goods quarter": {
        resources: [
          "grazing_land",
          "precious_metals",
          "gemstone_deposits",
          "managed_forest"
        ],
        label: "Luxury materials",
        detail: "fine wool, metals, gems for luxury production",
        svcs: [
          "luxury clothing",
          "fine jewellery",
          "decorative goods"
        ]
      },
      "Alchemist shop": {
        resources: [
          "foraging_areas",
          "ancient_grove",
          "managed_forest"
        ],
        label: "Medicinal herbs",
        detail: "foraged herbs and botanical ingredients",
        svcs: [
          "potions",
          "alchemical components",
          "reagents"
        ]
      },
      "Alchemist quarter": {
        resources: [
          "foraging_areas",
          "ancient_grove",
          "managed_forest",
          "precious_metals"
        ],
        label: "Herbs + metals",
        detail: "herbs and metals for alchemical production at scale",
        svcs: [
          "potions",
          "alchemical components",
          "transmutation"
        ]
      },
      "Small hospital": {
        resources: [
          "foraging_areas",
          "ancient_grove"
        ],
        label: "Medicinal herbs",
        detail: "herbs for medicines and treatments",
        svcs: [
          "healing",
          "surgical care",
          "long-term recovery"
        ]
      },
      "Major hospital": {
        resources: [
          "foraging_areas",
          "ancient_grove",
          "managed_forest"
        ],
        label: "Medicinal herbs + supplies",
        detail: "herbs and materials for hospital operations",
        svcs: [
          "healing",
          "surgical care",
          "long-term recovery",
          "quarantine"
        ]
      },
      "Hospital network": {
        resources: [
          "foraging_areas",
          "ancient_grove",
          "managed_forest"
        ],
        label: "Medicinal herbs + supplies",
        detail: "herbs and materials for city-wide hospital network",
        svcs: [
          "healing",
          "surgical care",
          "quarantine",
          "epidemic response"
        ]
      },
      "Healer (divine, 1st level)": {
        resources: [
          "foraging_areas",
          "ancient_grove"
        ],
        label: "Medicinal herbs",
        detail: "herbs to supplement divine healing",
        svcs: [
          "basic healing",
          "minor treatments"
        ]
      },
      "Wizard's tower": {
        resources: [
          "magical_node"
        ],
        label: "Magical ley lines",
        detail: "arcane energy for sustained magical research",
        svcs: [
          "spellcasting",
          "magical research",
          "arcane consultation"
        ]
      },
      "Mages' guild": {
        resources: [
          "magical_node"
        ],
        label: "Magical ley lines",
        detail: "arcane energy for guild operations",
        svcs: [
          "spellcasting",
          "arcane training",
          "magical licensing"
        ]
      },
      "Mages' district": {
        resources: [
          "magical_node"
        ],
        label: "Magical ley lines",
        detail: "arcane energy for district-scale magical operations",
        svcs: [
          "high-level spellcasting",
          "arcane research",
          "enchanting",
          "magical item trade"
        ]
      },
      "Academy of magic": {
        resources: [
          "magical_node"
        ],
        label: "Magical ley lines",
        detail: "arcane energy for magical academy",
        svcs: [
          "arcane training",
          "magical research",
          "spell development"
        ]
      },
      "Teleportation circle": {
        resources: [
          "magical_node"
        ],
        label: "Magical ley lines",
        detail: "stable ley line for permanent teleportation circle",
        svcs: [
          "teleportation",
          "magical transit"
        ]
      },
      "Planar embassy": {
        resources: [
          "magical_node"
        ],
        label: "Magical ley lines",
        detail: "planar resonance for extraplanar contact",
        svcs: [
          "planar diplomacy",
          "extraplanar trade"
        ]
      },
      "Banking houses": {
        resources: [
          "precious_metals"
        ],
        label: "Precious metals",
        detail: "gold and silver for banking reserves",
        svcs: [
          "currency exchange",
          "loans",
          "letters of credit"
        ]
      },
      "Banking district": {
        resources: [
          "precious_metals"
        ],
        label: "Precious metals",
        detail: "gold and silver for banking reserves at scale",
        svcs: [
          "currency exchange",
          "loans",
          "investment",
          "letters of credit"
        ]
      },
      "Caravan masters' exchange": {
        resources: [
          "precious_metals",
          "crossroads_position"
        ],
        label: "Capital + trade access",
        detail: "precious metals and trade access for exchange operations",
        svcs: [
          "caravan finance",
          "commodity contracts",
          "freight brokerage"
        ]
      },
      "Money changers": {
        resources: [
          "precious_metals"
        ],
        label: "Precious metals",
        detail: "gold and silver for currency exchange",
        svcs: [
          "currency exchange",
          "foreign coin valuation"
        ]
      },
      "Periodic market": {
        resources: [
          "crossroads_position",
          "grain_fields"
        ],
        label: "Trade access + grain",
        detail: "crossroads position and grain as primary traded commodity",
        svcs: [
          "market day trade",
          "commodity exchange"
        ]
      },
      "Weekly market": {
        resources: [
          "crossroads_position",
          "grain_fields"
        ],
        label: "Trade access + grain",
        detail: "trade access and grain for regular market",
        svcs: [
          "market day trade",
          "commodity exchange",
          "craft sales"
        ]
      },
      "Market square": {
        resources: [
          "crossroads_position",
          "grain_fields"
        ],
        label: "Trade access",
        detail: "trade access for permanent market",
        svcs: [
          "daily trade",
          "commodity exchange",
          "craft sales"
        ]
      },
      "Multiple market squares": {
        resources: [
          "crossroads_position",
          "grain_fields",
          "iron_deposits"
        ],
        label: "Trade access + commodities",
        detail: "trade access and commodities for city markets",
        svcs: [
          "daily trade",
          "commodity exchange",
          "wholesale",
          "retail"
        ]
      },
      "Daily markets": {
        resources: [
          "crossroads_position",
          "grain_fields"
        ],
        label: "Trade access + grain",
        detail: "trade access and grain for daily market operations",
        svcs: [
          "daily trade",
          "fresh produce",
          "commodity exchange"
        ]
      },
      "District markets (5-10)": {
        resources: [
          "crossroads_position",
          "grain_fields"
        ],
        label: "Trade access + commodities",
        detail: "trade access and commodities for district markets",
        svcs: [
          "district-level trade",
          "wholesale",
          "specialist markets"
        ]
      },
      "International trade center": {
        resources: [
          "crossroads_position",
          "deep_harbour"
        ],
        label: "Trade access + harbour",
        detail: "crossroads or harbour for international trade",
        svcs: [
          "international trade",
          "currency exchange",
          "trade finance"
        ]
      },
      "Harbour master's office": {
        resources: [
          "fishing_grounds",
          "river_fish",
          "shipbuilding_timber",
          "managed_forest"
        ],
        label: "Fishing + timber",
        detail: "fishing grounds and timber for port operations",
        svcs: [
          "large vessel berthing",
          "cargo handling",
          "port administration"
        ]
      }
    };

// ── Finished goods demand vs. local supply capacity ──────────────────────────
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
      'Sailcloth, cordage, and naval stores',
      'Sailcloth, cordage, tar, and bulk naval stores',
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
      'foraging':                       { supply: 1 },  // partial: covers herbs not minerals
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
  const s = String(label).trim().toLowerCase();
  if (s.length < 3) return null;
  for (const [cat, l] of _FINISHED_GOODS_CATEGORY_INDEX) {
    if (s.includes(l)) return cat;
  }
  for (const [cat, re] of _FINISHED_GOODS_KEYWORDS) {
    if (re.test(s)) return cat;
  }
  return null;
}
