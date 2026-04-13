/**
 * TRADE GOODS & SERVICES DATABASE
 * Comprehensive database of all tradeable goods and services by settlement tier
 * Supports granular toggle system for user control
 */

/**
 * Trade goods categories for organization
 */
export const GOODS_CATEGORIES = {
  AGRICULTURAL: 'agricultural',
  RAW_MATERIALS: 'raw_materials',
  MANUFACTURED: 'manufactured',
  LUXURY: 'luxury',
  SERVICES: 'services',
  FOOD_PROCESSED: 'food_processed'
};

/**
 * Export goods available by settlement tier
 * Each good has:
 * - category: GOODS_CATEGORIES type
 * - p: 0-1 probability if institution exists
 * - requiredInstitution: institution name that enables this (optional)
 * - on: whether this appears in generation by default
 */
const EXPORT_GOODS_BY_TIER = {
  thorp: {
    "Eggs": { 
      category: GOODS_CATEGORIES.AGRICULTURAL, 
      p: 0.9, 
      on: true,
      desc: "Fresh eggs from household chickens"
    },
    "Small game": { 
      category: GOODS_CATEGORIES.AGRICULTURAL, 
      p: 0.6, 
      on: true,
      desc: "Rabbits, fowl from local hunting"
    },
    "Foraged goods": { 
      category: GOODS_CATEGORIES.AGRICULTURAL, 
      p: 0.7, 
      on: true,
      desc: "Mushrooms, berries, herbs"
    }
  },

  hamlet: {
    "Grain surplus": { 
      category: GOODS_CATEGORIES.AGRICULTURAL, 
      p: 0.8, 
      on: true,
      desc: "Wheat, barley, oats beyond subsistence needs"
    },
    "Raw wool": { 
      category: GOODS_CATEGORIES.RAW_MATERIALS, 
      p: 0.7, 
      on: true,
      desc: "Unprocessed wool from sheep"
    },
    "Dairy products": { 
      category: GOODS_CATEGORIES.FOOD_PROCESSED, 
      p: 0.6, 
      on: true,
      desc: "Cheese, butter, milk"
    },
    "Livestock": { 
      category: GOODS_CATEGORIES.AGRICULTURAL, 
      p: 0.5, 
      on: true,
      desc: "Cattle, sheep, pigs for sale"
    },
    "Honey and beeswax": { 
      category: GOODS_CATEGORIES.FOOD_PROCESSED, 
      p: 0.4, 
      on: true,
      desc: "Local beekeeping products"
    }
  },

  village: {
    "Agricultural surplus": { 
      category: GOODS_CATEGORIES.AGRICULTURAL, 
      p: 0.9, 
      on: true,
      desc: "Grain, wheat, barley in quantity"
    },
    "Raw wool and hides": { 
      category: GOODS_CATEGORIES.RAW_MATERIALS, 
      p: 0.8, 
      on: true,
      desc: "Bulk unprocessed animal products"
    },
    "Livestock": { 
      category: GOODS_CATEGORIES.AGRICULTURAL, 
      p: 0.7, 
      on: true,
      desc: "Cattle, sheep, pigs in regular supply"
    },
    "Eggs and dairy": { 
      category: GOODS_CATEGORIES.FOOD_PROCESSED, 
      p: 0.8, 
      on: true,
      desc: "Regular production for market"
    },
    "Honey and beeswax": { 
      category: GOODS_CATEGORIES.FOOD_PROCESSED, 
      p: 0.5, 
      on: true,
      desc: "Established beekeeping"
    },
    "Milled flour": { 
      category: GOODS_CATEGORIES.FOOD_PROCESSED, 
      p: 0.9, 
      requiredInstitution: "Mill",
      on: true,
      desc: "Ground grain for bread-making"
    },
    "Basic metalwork": { 
      category: GOODS_CATEGORIES.MANUFACTURED, 
      p: 0.6, 
      requiredInstitution: "Blacksmith",
      on: true,
      desc: "Horseshoes, nails, simple tools"
    }
  },

  town: {
    "Enslaved persons": { 
      category: GOODS_CATEGORIES.TRADE,
      p: 0.15, 
      on: false,
      desc: "Human beings bought and sold as property. War captives, debt slaves, and trafficked persons. High value, restricted to settlements with slave markets.",
      requiresInstitution: "Slave market"
    },
    "Guild-manufactured goods": { 
      category: GOODS_CATEGORIES.MANUFACTURED, 
      p: 0.9, 
      requiredInstitution: "Craft guilds",
      on: true,
      desc: "Cloth, leather goods, metalwork"
    },
    "Processed textiles": { 
      category: GOODS_CATEGORIES.MANUFACTURED, 
      p: 0.8, 
      requiredInstitution: "Weavers' guild",
      on: true,
      desc: "Woven cloth, finished fabrics"
    },
    "Quality tools and weapons": { 
      category: GOODS_CATEGORIES.MANUFACTURED, 
      p: 0.7, 
      requiredInstitution: "Smiths' guild",
      on: true,
      desc: "Well-crafted implements and basic arms"
    },
    "Baked goods": { 
      category: GOODS_CATEGORIES.FOOD_PROCESSED, 
      p: 0.8, 
      requiredInstitution: "Bakers' guild",
      on: true,
      desc: "Bread, pastries for market"
    },
    "Preserved foods": { 
      category: GOODS_CATEGORIES.FOOD_PROCESSED, 
      p: 0.6, 
      on: true,
      desc: "Salted meats, pickled vegetables"
    },
    "Barrels and containers": { 
      category: GOODS_CATEGORIES.MANUFACTURED, 
      p: 0.5, 
      requiredInstitution: "Coopers' guild",
      on: true,
      desc: "Wooden casks for storage/transport"
    },
    "Leather goods": { 
      category: GOODS_CATEGORIES.MANUFACTURED, 
      p: 0.7, 
      requiredInstitution: "Tanners' guild",
      on: true,
      desc: "Tanned hides, leather products"
    },
    "Pottery and ceramics": { 
      category: GOODS_CATEGORIES.MANUFACTURED, 
      p: 0.6, 
      requiredInstitution: "Potters' guild",
      on: true,
      desc: "Household vessels and tiles"
    },
    "Rope and cordage": { 
      category: GOODS_CATEGORIES.MANUFACTURED, 
      p: 0.5, 
      requiredInstitution: "Ropemakers' guild",
      on: true,
      desc: "Essential for shipping and construction"
    }
  },

  city: {
    "Enslaved persons": { 
      category: GOODS_CATEGORIES.TRADE,
      p: 0.2, 
      on: false,
      desc: "Large-scale slave trade through licensed markets. War captives, imports from slave-taking regions, debt bondage.",
      requiresInstitution: "Slave market district"
    },
    "Luxury manufactured goods": { 
      category: GOODS_CATEGORIES.LUXURY, 
      p: 0.8, 
      on: true,
      desc: "High-quality crafted items"
    },
    "Fine metalwork and jewelry": { 
      category: GOODS_CATEGORIES.LUXURY, 
      p: 0.7, 
      requiredInstitution: "Goldsmiths' guild",
      on: true,
      desc: "Precious metal goods, gemstone work"
    },
    "Legal services": { 
      category: GOODS_CATEGORIES.SERVICES, 
      p: 0.9, 
      requiredInstitution: "Courthouse",
      on: true,
      desc: "Contracts, court access, legal expertise"
    },
    "Financial services": { 
      category: GOODS_CATEGORIES.SERVICES, 
      p: 0.7, 
      requiredInstitution: "Banking houses",
      on: true,
      desc: "Letters of credit, money changing"
    },
    "Specialized guild crafts": { 
      category: GOODS_CATEGORIES.MANUFACTURED, 
      p: 0.9, 
      requiredInstitution: "Guild halls",
      on: true,
      desc: "50+ specializations available"
    },
    "Books and manuscripts": { 
      category: GOODS_CATEGORIES.LUXURY, 
      p: 0.6, 
      requiredInstitution: "Scriptorium",
      on: true,
      desc: "Hand-copied texts, illuminated works"
    },
    "Advanced weapons and armor": { 
      category: GOODS_CATEGORIES.MANUFACTURED, 
      p: 0.6, 
      requiredInstitution: "Armory",
      on: true,
      desc: "Professional military equipment"
    },
    "Fine textiles": { 
      category: GOODS_CATEGORIES.LUXURY, 
      p: 0.7, 
      requiredInstitution: "Weavers' guild",
      on: true,
      desc: "Silk, velvet, high-quality woolens"
    },
    "Dyed cloth": { 
      category: GOODS_CATEGORIES.MANUFACTURED, 
      p: 0.8, 
      requiredInstitution: "Dyers' guild",
      on: true,
      desc: "Colored fabrics, specialty dyes"
    },
    "Glassware": { 
      category: GOODS_CATEGORIES.MANUFACTURED, 
      p: 0.5, 
      requiredInstitution: "Glassblowers' guild",
      on: true,
      desc: "Windows, vessels, decorative glass"
    }
  },

  metropolis: {
    "International banking services": { 
      category: GOODS_CATEGORIES.SERVICES, 
      p: 0.9, 
      requiredInstitution: "Banking district",
      on: true,
      desc: "Letters of credit, international finance"
    },
    "Extreme luxury goods": { 
      category: GOODS_CATEGORIES.LUXURY, 
      p: 0.8, 
      on: true,
      desc: "Rare items, masterwork crafts"
    },
    "High art and culture": { 
      category: GOODS_CATEGORIES.SERVICES, 
      p: 0.7, 
      on: true,
      desc: "Theater, music, commissioned art"
    },
    "Educational services": { 
      category: GOODS_CATEGORIES.SERVICES, 
      p: 0.8, 
      requiredInstitution: "University",
      on: true,
      desc: "University degrees, advanced training"
    },
    "Political influence": { 
      category: GOODS_CATEGORIES.SERVICES, 
      p: 0.9, 
      on: true,
      desc: "Access to power, legal frameworks"
    },
    "Rare spices and dyes": { 
      category: GOODS_CATEGORIES.LUXURY, 
      p: 0.7, 
      on: true,
      desc: "Imported exotic materials"
    },
    "Master-crafted weapons": { 
      category: GOODS_CATEGORIES.LUXURY, 
      p: 0.6, 
      requiredInstitution: "Master weaponsmiths",
      on: true,
      desc: "Legendary quality arms and armor"
    },
    "Architectural services": { 
      category: GOODS_CATEGORIES.SERVICES, 
      p: 0.7, 
      requiredInstitution: "Masons' guild",
      on: true,
      desc: "Cathedral design, fortress planning"
    },
    "Printing services": { 
      category: GOODS_CATEGORIES.SERVICES, 
      p: 0.5, 
      requiredInstitution: "Printing press",
      on: true,
      desc: "Mass-produced texts (if technology exists)"
    }
  }
};

/**
 * Import goods needed by settlement tier
 * Structured by what tier needs from what tier
 */
const IMPORT_GOODS_BY_TIER = {
  thorp: {
    basic: [
      { name: "Salt", category: GOODS_CATEGORIES.FOOD_PROCESSED, on: true, desc: "Food preservation" },
      { name: "Metal tools", category: GOODS_CATEGORIES.MANUFACTURED, on: true, desc: "Simple implements" },
      { name: "Cloth", category: GOODS_CATEGORIES.MANUFACTURED, on: true, desc: "Basic textiles" }
    ]
  },

  hamlet: {
    basic: [
      { name: "Metal goods", category: GOODS_CATEGORIES.MANUFACTURED, on: true, desc: "Tools, nails, horseshoes" },
      { name: "Salt", category: GOODS_CATEGORIES.FOOD_PROCESSED, on: true, desc: "Food preservation" },
      { name: "Quality cloth", category: GOODS_CATEGORIES.MANUFACTURED, on: true, desc: "Better textiles" }
    ]
  },

  village: {
    basic: [
      { name: "Metal goods", category: GOODS_CATEGORIES.MANUFACTURED, on: true, desc: "Tools, nails, horseshoes" },
      { name: "Quality cloth and clothing", category: GOODS_CATEGORIES.MANUFACTURED, on: true, desc: "Finished garments" },
      { name: "Salt for preservation", category: GOODS_CATEGORIES.FOOD_PROCESSED, on: true, desc: "Essential preservative" },
      { name: "Specialized tools", category: GOODS_CATEGORIES.MANUFACTURED, on: true, desc: "Advanced implements" }
    ],
    fromHigher: [
      { name: "Legal services", category: GOODS_CATEGORIES.SERVICES, on: true, desc: "Contracts, court access" },
      { name: "Advanced medical care", category: GOODS_CATEGORIES.SERVICES, on: true, desc: "Skilled physicians" },
      { name: "Manufactured goods", category: GOODS_CATEGORIES.MANUFACTURED, on: true, desc: "Wide variety of crafts" }
    ]
  },

  town: {
    "Enslaved persons": { 
      category: GOODS_CATEGORIES.TRADE,
      desc: "Slaves imported from war fronts, pirate suppliers, and distant slave-holding regions."
    },
    fromCityOrMetropolis: [
      { name: "Luxury textiles", category: GOODS_CATEGORIES.LUXURY, on: true, desc: "Fine cloth, silk" },
      { name: "Spices and exotic dyes", category: GOODS_CATEGORIES.LUXURY, on: true, desc: "Imported rarities" },
      { name: "Banking services", category: GOODS_CATEGORIES.SERVICES, on: true, desc: "Letters of credit" },
      { name: "Advanced legal expertise", category: GOODS_CATEGORIES.SERVICES, on: true, desc: "Specialized law" },
      { name: "Rare materials", category: GOODS_CATEGORIES.LUXURY, on: true, desc: "Exotic goods" }
    ],
    fromHinterland: [
      { name: "Food surplus", category: GOODS_CATEGORIES.AGRICULTURAL, on: true, desc: "Agricultural hinterland" },
      { name: "Raw wool and hides", category: GOODS_CATEGORIES.RAW_MATERIALS, on: true, desc: "For processing" },
      { name: "Timber", category: GOODS_CATEGORIES.RAW_MATERIALS, on: true, desc: "Construction material" }
    ]
  },

  city: {
    fromMetropolis: [
      { name: "International banking", category: GOODS_CATEGORIES.SERVICES, on: true, desc: "Global connections" },
      { name: "Highest luxury goods", category: GOODS_CATEGORIES.LUXURY, on: true, desc: "Rarities and masterworks" },
      { name: "Political legitimacy", category: GOODS_CATEGORIES.SERVICES, on: true, desc: "Royal/imperial connections" }
    ],
    fromHinterland: [
      { name: "Bulk food", category: GOODS_CATEGORIES.AGRICULTURAL, on: true, desc: "Massive agricultural needs" },
      { name: "Raw materials", category: GOODS_CATEGORIES.RAW_MATERIALS, on: true, desc: "Ore, timber, wool" },
      { name: "Basic goods for resale", category: GOODS_CATEGORIES.MANUFACTURED, on: true, desc: "Market redistribution" }
    ]
  },

  metropolis: {
    basic: [
      { name: "Massive food requirements", category: GOODS_CATEGORIES.AGRICULTURAL, on: true, desc: "Regional network" },
      { name: "Raw materials", category: GOODS_CATEGORIES.RAW_MATERIALS, on: true, desc: "Entire regional supply" },
      { name: "Luxury imports", category: GOODS_CATEGORIES.LUXURY, on: true, desc: "From distant lands" }
    ]
  }
};

/**
 * Institution-provided services (what each institution offers)
 * This enables granular control over what services are available
 */

// INSTITUTION_SERVICES moved to institutionServices.js
export { INSTITUTION_SERVICES } from './institutionServices.js';


export const GOODS_MODIFIERS_BY_TIER = {thorp:{Eggs:{category:GOODS_CATEGORIES.AGRICULTURAL,p:.9,on:!0,desc:"Fresh eggs from household chickens"},"Small game":{category:GOODS_CATEGORIES.AGRICULTURAL,p:.6,on:!0,desc:"Rabbits, fowl from local hunting"},"Foraged goods":{category:GOODS_CATEGORIES.AGRICULTURAL,p:.7,on:!0,desc:"Mushrooms, berries, herbs"}},hamlet:{"Grain surplus":{category:GOODS_CATEGORIES.AGRICULTURAL,p:.8,on:!0,desc:"Wheat, barley, oats beyond subsistence needs"},"Raw wool":{category:GOODS_CATEGORIES.RAW_MATERIALS,p:.7,on:!0,desc:"Unprocessed wool from sheep"},"Dairy products":{category:GOODS_CATEGORIES.FOOD_PROCESSED,p:.6,on:!0,desc:"Cheese, butter, milk"},Livestock:{category:GOODS_CATEGORIES.AGRICULTURAL,p:.5,on:!0,desc:"Cattle, sheep, pigs for sale"},"Honey and beeswax":{category:GOODS_CATEGORIES.FOOD_PROCESSED,p:.4,on:!0,desc:"Local beekeeping products"},"Game meat":{category:GOODS_CATEGORIES.FOOD_PROCESSED,p:.4,requiredInstitution:"Hunter's Lodge",on:!0,desc:"Venison, boar, rabbit from local hunters"},"Charcoal":{category:GOODS_CATEGORIES.RAW_MATERIALS,p:.35,requiredInstitution:"Charcoal Burner",on:!0,desc:"Kiln-fired fuel for smithing and heating"},"Malted barley":{category:GOODS_CATEGORIES.RAW_MATERIALS,p:.25,requiredInstitution:"Maltster",on:!0,desc:"Sprouted barley for brewing"},"Peat fuel":{category:GOODS_CATEGORIES.RAW_MATERIALS,p:.3,requiredInstitution:"Peat Cutter",on:!0,desc:"Dried peat blocks for domestic fuel"},"Fresh fish":{category:GOODS_CATEGORIES.FOOD_PROCESSED,p:.35,requiredInstitution:"Fisher's Landing",on:!0,desc:"Catch of the day from local waters"}},village:{"Agricultural surplus":{category:GOODS_CATEGORIES.AGRICULTURAL,p:.9,on:!0,desc:"Grain, wheat, barley in quantity"},"Raw wool and hides":{category:GOODS_CATEGORIES.RAW_MATERIALS,p:.8,on:!0,desc:"Bulk unprocessed animal products"},Livestock:{category:GOODS_CATEGORIES.AGRICULTURAL,p:.7,on:!0,desc:"Cattle, sheep, pigs in regular supply"},"Eggs and dairy":{category:GOODS_CATEGORIES.FOOD_PROCESSED,p:.8,on:!0,desc:"Regular production for market"},"Honey and beeswax":{category:GOODS_CATEGORIES.FOOD_PROCESSED,p:.5,on:!0,desc:"Established beekeeping"},"Milled flour":{category:GOODS_CATEGORIES.FOOD_PROCESSED,p:.9,requiredInstitution:"Mill",on:!0,desc:"Ground grain for bread-making"},"Basic metalwork":{category:GOODS_CATEGORIES.MANUFACTURED,p:.6,requiredInstitution:"Blacksmith",on:!0,desc:"Horseshoes, nails, simple tools"},"Ale (barrel)":{category:GOODS_CATEGORIES.FOOD_PROCESSED,p:.6,requiredInstitution:"Brewer",on:!0,desc:"Barrel ale from the village brewer"},"Tanned leather":{category:GOODS_CATEGORIES.RAW_MATERIALS,p:.5,requiredInstitution:"Tannery",on:!0,desc:"Oak-bark processed hides"},"Milled timber":{category:GOODS_CATEGORIES.RAW_MATERIALS,p:.55,requiredInstitution:"Sawmill",on:!0,desc:"Planks and beams to dimension"},"Pottery and ceramics":{category:GOODS_CATEGORIES.MANUFACTURED,p:.4,requiredInstitution:"Potter",on:!0,desc:"Domestic pottery from local clay"},"Salted fish":{category:GOODS_CATEGORIES.FOOD_PROCESSED,p:.4,requiredInstitution:"Fishmonger",on:!0,desc:"Salt-cured fish for travel and winter"},"Fresh milk and dairy":{category:GOODS_CATEGORIES.FOOD_PROCESSED,p:.4,requiredInstitution:"Dairy Farmer",on:!0,desc:"Milk, butter, soft cheese from cattle"}},town:{"Enslaved persons":{institutions:["Slave market","Slave market district","Human trafficking network"],tradeRoutes:["port","crossroads","river"],resourceBoost:0,institutionBoost:0.3,routeBoost:0.15},"Guild-manufactured goods":{category:GOODS_CATEGORIES.MANUFACTURED,p:.9,requiredInstitution:"Craft guilds (5-15)",on:!0,desc:"Cloth, leather goods, metalwork"},"Processed textiles":{category:GOODS_CATEGORIES.MANUFACTURED,p:.8,requiredInstitution:"Weavers/Textile workers",on:!0,desc:"Woven cloth, finished fabrics"},"Quality tools and weapons":{category:GOODS_CATEGORIES.MANUFACTURED,p:.7,requiredInstitution:"Blacksmiths (3-10)",on:!0,desc:"Well-crafted implements and basic arms"},"Baked goods":{category:GOODS_CATEGORIES.FOOD_PROCESSED,p:.8,requiredInstitution:"Bakers (5-15)",on:!0,desc:"Bread, pastries for market"},"Preserved foods":{category:GOODS_CATEGORIES.FOOD_PROCESSED,p:.6,on:!0,desc:"Salted meats, pickled vegetables"},"Barrels and containers":{category:GOODS_CATEGORIES.MANUFACTURED,p:.5,requiredInstitution:"Craft guilds (5-15)",on:!0,desc:"Wooden casks for storage/transport"},"Leather goods":{category:GOODS_CATEGORIES.MANUFACTURED,p:.7,requiredInstitution:"Tanners",on:!0,desc:"Tanned hides, leather products"},"Pottery and ceramics":{category:GOODS_CATEGORIES.MANUFACTURED,p:.6,requiredInstitution:"Craft guilds (5-15)",on:!0,desc:"Household vessels and tiles"},"Rope and cordage":{category:GOODS_CATEGORIES.MANUFACTURED,p:.5,requiredInstitution:"Craft guilds (5-15)",on:!0,desc:"Essential for shipping and construction"},"Ale (wholesale)":{category:GOODS_CATEGORIES.FOOD_PROCESSED,p:.7,requiredInstitution:"Brewery",on:!0,desc:"Commercial ale in barrel from the town brewery"},"Refined iron ingots":{category:GOODS_CATEGORIES.RAW_MATERIALS,p:.55,requiredInstitution:"Smelter",on:!0,desc:"Smelted iron ready for the smith"},"Quality boots and shoes":{category:GOODS_CATEGORIES.MANUFACTURED,p:.6,requiredInstitution:"Cobbler's Guild",on:!0,desc:"Guild-certified footwear"},"Finished garments":{category:GOODS_CATEGORIES.MANUFACTURED,p:.6,requiredInstitution:"Tailor's Guild",on:!0,desc:"Ready-made and bespoke clothing"},"Glassware":{category:GOODS_CATEGORIES.MANUFACTURED,p:.35,requiredInstitution:"Glassblower",on:!0,desc:"Bottles, flasks, and window glass"},"Candles and soap":{category:GOODS_CATEGORIES.MANUFACTURED,p:.5,requiredInstitution:"Chandler",on:!0,desc:"Tallow and beeswax candles, lye soap"}},city:{"Luxury manufactured goods":{category:GOODS_CATEGORIES.LUXURY,p:.8,on:!0,desc:"High-quality crafted items"},"Fine metalwork and jewelry":{category:GOODS_CATEGORIES.LUXURY,p:.7,requiredInstitution:"Specialized metalworkers",on:!0,desc:"Precious metal goods, gemstone work"},"Legal services":{category:GOODS_CATEGORIES.SERVICES,p:.9,requiredInstitution:"Multiple courthouses",on:!0,desc:"Contracts, court access, legal expertise"},"Financial services":{category:GOODS_CATEGORIES.SERVICES,p:.7,requiredInstitution:"Banking houses",on:!0,desc:"Letters of credit, money changing"},"Specialized guild crafts":{category:GOODS_CATEGORIES.MANUFACTURED,p:.9,requiredInstitution:"Craft guilds (30-80)",on:!0,desc:"50+ specializations available"},"Books and manuscripts":{category:GOODS_CATEGORIES.LUXURY,p:.6,requiredInstitution:"Craft guilds (30-80)",on:!0,desc:"Hand-copied texts, illuminated works"},"Advanced weapons and armor":{category:GOODS_CATEGORIES.MANUFACTURED,p:.6,requiredInstitution:"Specialized metalworkers",on:!0,desc:"Professional military equipment"},"Fine textiles":{category:GOODS_CATEGORIES.LUXURY,p:.7,requiredInstitution:"Craft guilds (30-80)",on:!0,desc:"Silk, velvet, high-quality woolens"},"Dyed cloth":{category:GOODS_CATEGORIES.MANUFACTURED,p:.8,requiredInstitution:"Craft guilds (30-80)",on:!0,desc:"Colored fabrics, specialty dyes"},Glassware:{category:GOODS_CATEGORIES.MANUFACTURED,p:.5,requiredInstitution:"Glassmakers",on:!0,desc:"Windows, vessels, decorative glass"}},metropolis:{"International banking services":{category:GOODS_CATEGORIES.SERVICES,p:.9,requiredInstitution:"Banking district",on:!0,desc:"Letters of credit, international finance"},"Extreme luxury goods":{category:GOODS_CATEGORIES.LUXURY,p:.8,on:!0,desc:"Rare items, masterwork crafts"},"High art and culture":{category:GOODS_CATEGORIES.SERVICES,p:.7,on:!0,desc:"Theater, music, commissioned art"},"Educational services":{category:GOODS_CATEGORIES.SERVICES,p:.8,requiredInstitution:"Academy of magic",on:!0,desc:"University degrees, advanced training"},"Political influence":{category:GOODS_CATEGORIES.SERVICES,p:.9,on:!0,desc:"Access to power, legal frameworks"},"Rare spices and dyes":{category:GOODS_CATEGORIES.LUXURY,p:.7,on:!0,desc:"Imported exotic materials"},"Master-crafted weapons":{category:GOODS_CATEGORIES.LUXURY,p:.6,requiredInstitution:"Specialized metalworkers",on:!0,desc:"Legendary quality arms and armor"},"Architectural services":{category:GOODS_CATEGORIES.SERVICES,p:.7,requiredInstitution:"Craft guilds (100-150+)",on:!0,desc:"Cathedral design, fortress planning"},"Printing services":{category:GOODS_CATEGORIES.SERVICES,p:.5,on:!0,desc:"Mass-produced texts (if technology exists)"}}};
// COMMODITY_CATEGORY_MAP — maps resource keys to commodity categories
export const COMMODITY_CATEGORY_MAP = {fish:"fish",salt:"salt",salt_flat:"salt",iron:"iron",metalwork:"iron",stone:"stone",pottery:"stone",timber:"timber",grain:"grain",flour:"grain",livestock:"grain",dairy:"grain","game meat":"grain","forest herbs":"herbs",wool:"textile",flax:"textile","silk cocoons":"luxury",clay:"craft","raw leather":"craft",coal:"fuel",peat:"fuel","candle wax":"craft",silver:"precious_metal",gold:"precious_metal",amber:"luxury","sea salt":"salt","rock salt":"salt","clay pots":"craft","baked bricks":"craft","rough timber":"timber","cut lumber":"timber"};
