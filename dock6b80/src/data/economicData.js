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

// ── Finished goods demand + label→category classifier ───────────────────────
// Split into the zero-import leaf data/finishedGoodsCategory.js (FP-G4): the
// only first-paint edge into this file was tradeLinks.js reaching
// finishedGoodsCategoryOf, which needs INSTITUTION_FINISHED_GOODS_DEMAND but not
// the far larger TRADE_DEPENDENCY_NEEDS table above. Re-exported verbatim so the
// lazy consumers here (economy generators + the finishedGoodsDemand join test)
// stay byte-identical while TRADE_DEPENDENCY_NEEDS leaves the first-paint closure.
export { INSTITUTION_FINISHED_GOODS_DEMAND, finishedGoodsCategoryOf } from './finishedGoodsCategory.js';
