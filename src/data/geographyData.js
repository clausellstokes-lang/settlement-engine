// INSTITUTION_TAGS — institution tag constants (matching institutionalCatalog.js)
const INSTITUTION_TAGS = {
  TRADE: "trade",
  MARKET: "market",
  GUILD: "guild",
  BANKING: "banking",
  PORT: "port",
  WAREHOUSE: "warehouse",
  DEFENSE: "defense",
  MILITARY: "military",
  FORTIFICATION: "fortification",
  LAW_ENFORCEMENT: "law_enforcement",
  RELIGIOUS: "religious",
  CHURCH: "church",
  MONASTERY: "monastery",
  HEALING: "healing",
  ARCANE: "arcane",
  ALCHEMY: "alchemy",
  ENCHANTING: "enchanting",
  PLANAR: "planar",
  DIVINE: "divine",
  CRIMINAL: "criminal",
  SMUGGLING: "smuggling",
  UNDERGROUND: "underground",
  WATER: "water",
  SANITATION: "sanitation",
  CIVIC: "civic",
  LEGAL: "legal",
  EDUCATION: "education",
  METALWORK: "metalwork",
  TEXTILE: "textile",
  FOOD: "food",
  LEATHER: "leather",
  LUXURY: "luxury",
  ESSENTIAL: "essential",
  HOUSING: "housing",
  AGRICULTURE: "agriculture",
  TRANSPORT: "transport",
  SHIPBUILDING: "shipbuilding",
  KNOWLEDGE: "knowledge",
  LODGING: "lodging",
  ENTERTAINMENT: "entertainment",
  ADVENTURING: "adventuring",
  EXOTIC: "exotic"
};

// geographyData.js — extracted from bundle
// De-minified from original minified identifiers

export const TERRAIN_DATA = {
  coastal: {
    name: "Coastal",
    description: "Settlement on the ocean coast with beach or cliff access",
    allowedResources: [
      "fish",
      "salt",
      "shellfish",
      "seaweed",
      "pearls",
      "coral",
      "sand",
      "limestone",
      "timber",
      "game",
      "berries"
    ],
    impliedTradeAccess: "port",
    agricultureCapacity: .8,
    architectureModifiers: {
      stoneAvailability: "medium",
      timberAvailability: "medium",
      specialMaterials: [
        "coral",
        "shell-lime mortar"
      ]
    },
    institutionModifiers: [
      {
        tags: [INSTITUTION_TAGS.PORT],
        modifier: 2,
        reason: "Natural harbor access"
      },
      {
        tags: [INSTITUTION_TAGS.TRADE],
        modifier: 1.5,
        reason: "Maritime trade hub"
      },
      {
        tags: [INSTITUTION_TAGS.FOOD],
        modifier: 1.3,
        reason: "Fish processing industry"
      },
      {
        tags: [INSTITUTION_TAGS.WAREHOUSE],
        modifier: 1.4,
        reason: "Cargo storage needs"
      },
      {
        tags: [INSTITUTION_TAGS.AGRICULTURE],
        modifier: .7,
        reason: "Poor soil, salt exposure"
      },
      {
        tags: [INSTITUTION_TAGS.MILITARY],
        modifier: 1.2,
        reason: "Naval defense needed"
      }
    ],
    mustImport: [
      "grain",
      "timber (for large vessels)"
    ],
    naturalFeatures: [
      "harbor",
      "lighthouse site",
      "fishing grounds",
      "salt flats",
      "shipwreck sites"
    ],
    economicStrengths: [
      "Maritime trade",
      "Fishing industry",
      "Salt production",
      "Shipbuilding"
    ],
    strategicValue: "High - controls sea routes and naval access"
  },
  riverside: {
    name: "Riverside",
    description: "Settlement along a navigable river or at a river crossing",
    allowedResources: [
      "freshwater fish",
      "waterfowl",
      "reeds",
      "clay",
      "river stones",
      "timber",
      "grain",
      "vegetables",
      "livestock",
      "peat"
    ],
    impliedTradeAccess: "river",
    agricultureCapacity: 1.3,
    architectureModifiers: {
      stoneAvailability: "low",
      timberAvailability: "high",
      specialMaterials: [
        "brick (from clay)",
        "wattle-and-daub"
      ]
    },
    institutionModifiers: [
      {
        tags: [INSTITUTION_TAGS.AGRICULTURE],
        modifier: 1.5,
        reason: "Fertile floodplain"
      },
      {
        tags: [INSTITUTION_TAGS.TRADE],
        modifier: 1.3,
        reason: "River commerce"
      },
      {
        tags: [INSTITUTION_TAGS.FOOD],
        modifier: 1.2,
        reason: "Agricultural surplus"
      },
      {
        name: "Mill",
        modifier: 2,
        reason: "Water-powered milling"
      },
      {
        name: "Tannery",
        modifier: 1.5,
        reason: "Water for leather processing"
      },
      {
        name: "Brewery",
        modifier: 1.3,
        reason: "Clean water supply"
      },
      {
        tags: [INSTITUTION_TAGS.METALWORK],
        modifier: .8,
        reason: "Limited ore access"
      }
    ],
    mustImport: [
      "stone (for major construction)",
      "metals",
      "luxury goods"
    ],
    naturalFeatures: [
      "ford",
      "bridge site",
      "mill site",
      "fishing weirs",
      "ferry crossing"
    ],
    economicStrengths: [
      "Agriculture",
      "Milling",
      "River trade",
      "Brewing"
    ],
    strategicValue: "Medium - controls river crossing and inland trade"
  },
  mountain: {
    name: "Mountain",
    description: "Settlement in mountainous terrain, possibly in a valley or on slopes",
    allowedResources: [
      "iron_deposits",
      "stone_quarry",
      "precious_metals",
      "gemstone_deposits",
      "coal_deposits",
      "alpine_pasture",
      "mountain_timber",
      "hot_springs_mineral",
      "hunting_grounds",
      "defended_pass",
      "ancient_ruins"
    ],
    impliedTradeAccess: "road",
    agricultureCapacity: .4,
    architectureModifiers: {
      stoneAvailability: "very high",
      timberAvailability: "medium",
      specialMaterials: [
        "marble",
        "slate roofing",
        "granite blocks"
      ]
    },
    institutionModifiers: [
      {
        tags: [INSTITUTION_TAGS.METALWORK],
        modifier: 2.5,
        reason: "Direct ore access"
      },
      {
        name: "Mine",
        modifier: 3,
        reason: "Rich mineral deposits"
      },
      {
        name: "Quarry",
        modifier: 2.5,
        reason: "Stone extraction"
      },
      {
        name: "Smelter",
        modifier: 2,
        reason: "Ore processing"
      },
      {
        name: "Stonemasons' guild",
        modifier: 2,
        reason: "Stone abundance"
      },
      {
        name: "Jewelers' guild",
        modifier: 1.8,
        reason: "Gemstone access"
      },
      {
        tags: [INSTITUTION_TAGS.AGRICULTURE],
        modifier: .3,
        reason: "Steep, infertile terrain"
      },
      {
        tags: [INSTITUTION_TAGS.FOOD],
        modifier: .5,
        reason: "Limited arable land"
      },
      {
        tags: [INSTITUTION_TAGS.TRADE],
        modifier: .7,
        reason: "Remote location"
      }
    ],
    mustImport: [
      "Bulk grain and flour",
      "Quality textiles",
      "Charcoal and fuel",
      "Preserved provisions for winter"
    ],
    naturalFeatures: [
      "mine entrance",
      "quarry",
      "mountain pass",
      "hidden valley",
      "cave system"
    ],
    economicStrengths: [
      "Mining",
      "Metalworking",
      "Stoneworking",
      "Gemcutting"
    ],
    strategicValue: "High - defensible position, controls mountain passes, mineral wealth"
  },
  forest: {
    name: "Forest",
    description: "Settlement within or at the edge of dense woodlands",
    allowedResources: [
      "timber",
      "hardwood",
      "softwood",
      "game",
      "furs",
      "berries",
      "mushrooms",
      "nuts",
      "medicinal herbs",
      "honey",
      "charcoal"
    ],
    impliedTradeAccess: "road",
    agricultureCapacity: .6,
    architectureModifiers: {
      stoneAvailability: "low",
      timberAvailability: "very high",
      specialMaterials: [
        "hardwood beams",
        "charcoal"
      ]
    },
    institutionModifiers: [
      {
        name: "Sawmill",
        modifier: 3,
        reason: "Timber processing"
      },
      {
        name: "Carpenters' guild",
        modifier: 2,
        reason: "Abundant timber"
      },
      {
        name: "Foresters' guild",
        modifier: 2.5,
        reason: "Forest management"
      },
      {
        name: "Tanner",
        modifier: 1.8,
        reason: "Hunting and trapping"
      },
      {
        name: "Furrier",
        modifier: 2,
        reason: "Fur trade"
      },
      {
        name: "Bowyer/Fletcher",
        modifier: 1.8,
        reason: "Wood and game access"
      },
      {
        name: "Charcoal burner",
        modifier: 2.5,
        reason: "Wood charcoal production"
      },
      {
        name: "Herbalist",
        modifier: 1.5,
        reason: "Medicinal plants"
      },
      {
        tags: [INSTITUTION_TAGS.AGRICULTURE],
        modifier: .6,
        reason: "Forest land"
      },
      {
        tags: [INSTITUTION_TAGS.METALWORK],
        modifier: 1.2,
        reason: "Charcoal for forges"
      },
      {
        tags: [INSTITUTION_TAGS.LUXURY],
        modifier: .7,
        reason: "Rural location"
      }
    ],
    mustImport: [
      "grain",
      "metals",
      "stone",
      "salt"
    ],
    naturalFeatures: [
      "ancient grove",
      "lumber camp",
      "hunting grounds",
      "hermit's clearing",
      "druid circle"
    ],
    economicStrengths: [
      "Timber trade",
      "Fur trade",
      "Woodcraft",
      "Hunting"
    ],
    strategicValue: "Low-Medium - provides timber and game, difficult to besiege"
  },
  plains: {
    name: "Plains",
    description: "Settlement on open grassland or prairie",
    allowedResources: [
      "grain",
      "wheat",
      "barley",
      "oats",
      "livestock",
      "wool",
      "leather",
      "dairy",
      "vegetables",
      "hay",
      "clay"
    ],
    impliedTradeAccess: "crossroads",
    agricultureCapacity: 1.5,
    architectureModifiers: {
      stoneAvailability: "very low",
      timberAvailability: "low",
      specialMaterials: [
        "sod",
        "adobe",
        "fired brick",
        "thatch"
      ]
    },
    institutionModifiers: [
      {
        tags: [INSTITUTION_TAGS.AGRICULTURE],
        modifier: 2,
        reason: "Ideal farmland"
      },
      {
        name: "Mill",
        modifier: 1.8,
        reason: "Grain processing"
      },
      {
        name: "granar",
        modifier: 2,
        reason: "Crop storage"
      },
      {
        name: "Livestock market",
        modifier: 2,
        reason: "Grazing land"
      },
      {
        name: "Weavers' guild",
        modifier: 1.5,
        reason: "Wool from sheep"
      },
      {
        name: "Tanners' guild",
        modifier: 1.5,
        reason: "Livestock hides"
      },
      {
        name: "Cheesemaker",
        modifier: 1.5,
        reason: "Dairy production"
      },
      {
        tags: [INSTITUTION_TAGS.FOOD],
        modifier: 1.6,
        reason: "Agricultural surplus"
      },
      {
        tags: [INSTITUTION_TAGS.TRADE],
        modifier: 1.3,
        reason: "Central location"
      },
      {
        tags: [INSTITUTION_TAGS.METALWORK],
        modifier: .6,
        reason: "No ore deposits"
      },
      {
        tags: [INSTITUTION_TAGS.DEFENSE],
        modifier: .8,
        reason: "Open, hard to defend"
      }
    ],
    mustImport: [
      "timber",
      "stone",
      "metals",
      "luxury goods"
    ],
    naturalFeatures: [
      "wide grazing lands",
      "grain fields",
      "windmill site",
      "market crossroads"
    ],
    economicStrengths: [
      "Grain production",
      "Livestock",
      "Wool and textiles",
      "Central trade hub"
    ],
    strategicValue: "Medium - agricultural heartland, but exposed to raids"
  },
  hills: {
    name: "Hills",
    description: "Settlement in rolling hills or highland terrain",
    allowedResources: [
      "stone",
      "clay",
      "iron ore",
      "copper",
      "livestock",
      "wool",
      "grain",
      "timber",
      "game",
      "quarried stone",
      "slate"
    ],
    impliedTradeAccess: "road",
    agricultureCapacity: .9,
    architectureModifiers: {
      stoneAvailability: "high",
      timberAvailability: "medium",
      specialMaterials: [
        "field stone",
        "slate",
        "limestone"
      ]
    },
    institutionModifiers: [
      {
        name: "Quarry",
        modifier: 1.8,
        reason: "Stone extraction"
      },
      {
        name: "Stonemasons' guild",
        modifier: 1.5,
        reason: "Local stone"
      },
      {
        name: "Shepherds' guild",
        modifier: 2,
        reason: "Hill grazing"
      },
      {
        name: "Weavers' guild",
        modifier: 1.4,
        reason: "Wool from hillside sheep"
      },
      {
        name: "Mine",
        modifier: 1.5,
        reason: "Moderate ore deposits"
      },
      {
        tags: [INSTITUTION_TAGS.AGRICULTURE],
        modifier: .9,
        reason: "Terraced farming"
      },
      {
        tags: [INSTITUTION_TAGS.METALWORK],
        modifier: 1.3,
        reason: "Some ore access"
      },
      {
        tags: [INSTITUTION_TAGS.DEFENSE],
        modifier: 1.4,
        reason: "Elevated position"
      },
      {
        tags: [INSTITUTION_TAGS.TRADE],
        modifier: .9,
        reason: "Off main routes"
      }
    ],
    mustImport: [
      "luxury goods",
      "spices",
      "fine textiles"
    ],
    naturalFeatures: [
      "hilltop fort site",
      "terraced fields",
      "stone circle",
      "valley crossroads"
    ],
    economicStrengths: [
      "Stone quarrying",
      "Sheep herding",
      "Wool production",
      "Mining"
    ],
    strategicValue: "Medium-High - defensible terrain, good visibility"
  },
  desert: {
    name: "Desert/Arid",
    description: "Settlement in arid or desert terrain, typically near an oasis",
    allowedResources: [
      "oasis_water",
      "date_palms",
      "glass_sand",
      "desert_salt",
      "camel_herds",
      "salt_flats",
      "precious_metals",
      "gemstone_deposits",
      "foraging_areas"
    ],
    impliedTradeAccess: "crossroads",
    agricultureCapacity: .3,
    architectureModifiers: {
      stoneAvailability: "medium",
      timberAvailability: "very low",
      specialMaterials: [
        "adobe",
        "sandstone",
        "mudbrick",
        "palm wood"
      ]
    },
    institutionModifiers: [
      {
        name: "Glassblower",
        modifier: 2.5,
        reason: "High-quality sand"
      },
      {
        name: "Salt merchant",
        modifier: 2,
        reason: "Salt deposits"
      },
      {
        name: "Jewelers' guild",
        modifier: 1.5,
        reason: "Gem deposits"
      },
      {
        name: "Caravanserai",
        modifier: 3,
        reason: "Trade route junction"
      },
      {
        name: "Water merchant",
        modifier: 2,
        reason: "Scarce water"
      },
      {
        tags: [INSTITUTION_TAGS.TRADE],
        modifier: 1.8,
        reason: "Caravan trade"
      },
      {
        tags: [INSTITUTION_TAGS.LUXURY],
        modifier: 1.5,
        reason: "Exotic goods trade"
      },
      {
        tags: [INSTITUTION_TAGS.AGRICULTURE],
        modifier: .2,
        reason: "Extreme aridity"
      },
      {
        tags: [INSTITUTION_TAGS.FOOD],
        modifier: .4,
        reason: "Water scarcity"
      },
      {
        tags: [INSTITUTION_TAGS.TEXTILE],
        modifier: .5,
        reason: "Limited livestock"
      }
    ],
    mustImport: [
      "Bulk grain and foodstuffs",
      "Timber and building wood",
      "Quality textiles and cloth",
      "Livestock for meat and draft"
    ],
    naturalFeatures: [
      "oasis",
      "salt flat",
      "ancient ruins",
      "sand dunes",
      "trade route junction"
    ],
    economicStrengths: [
      "Trade hub",
      "Glass and gems",
      "Salt trade",
      "Exotic goods"
    ],
    strategicValue: "Medium - controls caravan routes, water sources are strategic"
  }
};

// TERRAIN_PENALTIES computed from STRESS_TYPES — see stressTypes.js
