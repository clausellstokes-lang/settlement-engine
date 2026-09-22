// spatialData.js — extracted from bundle

// Shared phrases hoisted once (train EM-T14's worker buy-back, judgment 191): each is spelled here and referenced below; the exported tables are byte-identical.
const ADVANCED_WATER_INFRASTRUCTURE = "Advanced water infrastructure";
const ADVENTURERS_CHARTER_HALL = "Adventurers' charter hall";
const AIRSHIP_DOCKING_HIGH_MAGIC = "Airship docking (high magic)";
const AQUEDUCT_OR_WATER_SYSTEM = "Aqueduct or water system";
const CATHEDRAL_10_000_ONLY = "Cathedral (10,000+ only)";
const CITY_WALLS_AND_GATES = "City walls and gates";
const COMMON_GRAZING_LAND = "Common grazing land";
const CRAFT_GUILDS_30_80 = "Craft guilds (30-80)";
const CRAFT_GUILDS_5_15 = "Craft guilds (5-15)";
const DISTRICT_MARKETS_5_10 = "District markets (5-10)";
const DOCKS_PORT_FACILITIES = "Docks/port facilities";
const MASSIVE_WALLS_AND_FORTIFICATIONS = "Massive walls and fortifications";
const MERCHANT_GUILDS_15_40 = "Merchant guilds (15-40)";
const MERCHANT_GUILDS_3_8 = "Merchant guilds (3-8)";
const MONASTERY_OR_FRIARY = "Monastery or friary";
const MULTIPLE_ADVENTURERS_GUILDS = "Multiple adventurers' guilds";
const MULTIPLE_COURT_BUILDINGS = "Multiple court buildings";
const MULTIPLE_CRIMINAL_FACTIONS = "Multiple criminal factions";
const MULTIPLE_MARKET_SQUARES = "Multiple market squares";
const MULTIPLE_MONASTERIES = "Multiple monasteries";
const MULTIPLE_WATER_SOURCES = "Multiple water sources";
const PARISH_CHURCHES_10_30 = "Parish churches (10-30)";
const PARISH_CHURCHES_2_5 = "Parish churches (2-5)";
const PARISH_CHURCHES_50_100 = "Parish churches (50-100+)";
const PROFESSIONAL_CITY_WATCH = "Professional city watch";
const SMUGGLING_OPERATION = "Smuggling operation";
const SUBSISTENCE_FARMING = "Subsistence farming";
const TELEPORTATION_CIRCLE = "Teleportation circle";
const THIEVES_GUILD_CHAPTER = "Thieves' guild chapter";
const THIEVES_GUILD_POWERFUL = "Thieves' guild (powerful)";
const WAREHOUSE_DISTRICT = "Warehouse district";

export const INSTITUTION_SPATIAL = [
  {
    institution: "Major port",
    requiredAccess: ["port"],
    reason: "A major port requires ocean or deep-water coastal access.",
    note: "A river settlement can have docks but not a major seaport."
  },
  {
    institution: "Navy (if coastal)",
    requiredAccess: ["port"],
    reason: "A navy requires ocean access. River communities can have patrol boats, not a navy."
  },
  {
    institution: DOCKS_PORT_FACILITIES,
    requiredAccess: ["port", "river"],
    exception: AIRSHIP_DOCKING_HIGH_MAGIC,
    reason: "Dock facilities require navigable water: ocean coast or navigable river."
  },
  {
    institution: "Fishmonger",
    requiredAccess: ["port", "river", "crossroads", "road"],
    reason: "A fishmonger requires access to fresh fish: coastal, river, or trade route supply."
  }
];

// Non-institution evidence intentionally named by a gate. Keep this list
// explicit and tiny so catalog typos cannot masquerade as "derived" features.
export const GATE_DERIVED_REQUIREMENTS = Object.freeze([
  "Managed forest",
]);

export const GATE_FEATURES = {
  "Gates (if walled)": {
    suggestionOnly: true,
    requires: ["Town walls", CITY_WALLS_AND_GATES, MASSIVE_WALLS_AND_FORTIFICATIONS],
    reason: "Gates are entry points in walls. Walls must exist first."
  },
  Citadel: {
    requires: [CITY_WALLS_AND_GATES, MASSIVE_WALLS_AND_FORTIFICATIONS],
    reason: "Inner fortress requires outer defenses."
  },
  Garrison: {
    reason: "A garrison provides its own quarters and replaces the citizen militia."
  },
  "Navy (if coastal)": {
    requires: [DOCKS_PORT_FACILITIES],
    requiresAccess: ["port"],
    reason: "Naval forces require port infrastructure. A river militia is not a navy.",
    accessViolationReason: "A navy requires coastal or ocean access. This settlement is landlocked. It can have river patrols but not a navy."
  },
  "Multiple garrisons": {
    minTier: "city",
    requires: ["Garrison", "Barracks", PROFESSIONAL_CITY_WATCH],
    reason: "Multiple garrison facilities require city-scale population and military investment."
  },
  [PROFESSIONAL_CITY_WATCH]: {
    minTier: "city",
    requires: ["Garrison", "Barracks", "Town watch"],
    reason: "Hundreds of professional guards require established military infrastructure."
  },
  "Mercenary quarter": {
    minTier: "city",
    requires: ["Hireling hall"],
    reason: "Sellsword district requires military infrastructure and sustained demand."
  },
  [AQUEDUCT_OR_WATER_SYSTEM]: {
    minTier: "city",
    reason: "Engineered water supply requires population density to justify the massive cost."
  },
  [ADVANCED_WATER_INFRASTRUCTURE]: {
    minTier: "metropolis",
    reason: "Complex multi-district water distribution requires metropolis-scale population and resources."
  },
  "Sewage system": {
    minTier: "city",
    requires: [AQUEDUCT_OR_WATER_SYSTEM, ADVANCED_WATER_INFRASTRUCTURE, MULTIPLE_WATER_SOURCES],
    reason: "Sewage infrastructure requires engineered water supply for flushing and drainage."
  },
  Tanners: {
    requires: ["Water source", MULTIPLE_WATER_SOURCES, AQUEDUCT_OR_WATER_SYSTEM],
    reason: "Tanning requires massive amounts of water for hide processing."
  },
  "Market square": {
    minTier: "village",
    reason: "A market square at village scale is the weekly market clearing. Town-scale gets a formal paved square with a royal charter."
  },
  "Weekly market": {
    minTier: "village",
    requires: ["Market square", COMMON_GRAZING_LAND],
    reason: "Regular markets require a designated space. Cannot hold a weekly market without a square."
  },
  [MULTIPLE_MARKET_SQUARES]: {
    minTier: "city",
    requires: ["Market square", "Daily markets"],
    reason: "Multiple permanent market squares require city-scale trade volume."
  },
  "Daily markets": {
    minTier: "city",
    requires: ["Market square", "Weekly market"],
    reason: "Daily trading requires a substantial permanent merchant class."
  },
  [DISTRICT_MARKETS_5_10]: {
    minTier: "metropolis",
    requires: [MULTIPLE_MARKET_SQUARES, "Daily markets"],
    reason: "Specialized district markets emerge from growth of general markets across multiple city districts."
  },
  [MERCHANT_GUILDS_3_8]: {
    minTier: "town",
    requires: ["Weekly market", "Annual fair", "Market square"],
    reason: "Merchant guilds require regular trade to justify organization."
  },
  [MERCHANT_GUILDS_15_40]: {
    minTier: "city",
    requires: [MERCHANT_GUILDS_3_8, "Daily markets"],
    reason: "Large guild networks require established merchant class and daily trading."
  },
  "Merchant guilds (50-100+)": {
    minTier: "metropolis",
    requires: [MERCHANT_GUILDS_15_40, DISTRICT_MARKETS_5_10],
    reason: "Extreme specialization requires metropolis-scale trade volume."
  },
  [WAREHOUSE_DISTRICT]: {
    minTier: "city",
    requires: ["Daily markets", DOCKS_PORT_FACILITIES, "Market square"],
    reason: "Bulk storage requires major trade volume from markets or port access."
  },
  "International trade center": {
    minTier: "metropolis",
    requires: [WAREHOUSE_DISTRICT, "Banking houses"],
    reason: "Global trade requires major trade infrastructure: port access or substantial overland networksstructure with banking."
  },
  [DOCKS_PORT_FACILITIES]: {
    requiresAccess: ["port", "river"],
    reason: "Docking facilities require waterfront access: ocean port or navigable river.",
    accessViolationReason: "Docks require water access. This settlement has no river or coastal access."
  },
  "Major port": {
    requiresAccess: ["port"],
    requires: [DOCKS_PORT_FACILITIES],
    reason: "A major port requires both ocean access and existing dock infrastructure.",
    accessViolationReason: "A major port requires coastal ocean access. River docks serve river trade only. They cannot become a major port."
  },
  "Money changers": {
    minTier: "town",
    requires: ["Weekly market", "Annual fair", "Market square"],
    reason: "Currency exchange requires regular merchant traffic."
  },
  "Banking houses": {
    minTier: "city",
    requires: ["Money changers", MERCHANT_GUILDS_3_8, MERCHANT_GUILDS_15_40],
    reason: "Formal banking grows from established money-changing and merchant activity."
  },
  "Banking district": {
    minTier: "metropolis",
    requires: ["Banking houses"],
    reason: "Concentration of banks requires enormous trade volume."
  },
  "Priest (resident)": {
    minTier: "hamlet",
    reason: "A resident priest requires a community large enough to support one."
  },
  "Parish church": {
    minTier: "village",
    reason: "Villages are legally defined by a congregation. Hamlets rely on circuit priests."
  },
  [PARISH_CHURCHES_2_5]: {
    minTier: "town",
    requires: ["Parish church", "Priest (resident)"],
    reason: "Multiple congregations require town-scale population."
  },
  [PARISH_CHURCHES_10_30]: {
    minTier: "city",
    requires: [PARISH_CHURCHES_2_5],
    reason: "An extensive network of them requires city-scale population."
  },
  [PARISH_CHURCHES_50_100]: {
    minTier: "metropolis",
    requires: [PARISH_CHURCHES_10_30],
    reason: "A metropolitan network of them requires tens of thousands of residents."
  },
  [MONASTERY_OR_FRIARY]: {
    minTier: "village",
    reason: "Monastic communities require enough surrounding population to support them."
  },
  [MULTIPLE_MONASTERIES]: {
    minTier: "city",
    requires: [MONASTERY_OR_FRIARY],
    reason: "Multiple religious houses require city-scale wealth and population."
  },
  "Major monasteries (5-10)": {
    minTier: "metropolis",
    requires: [MULTIPLE_MONASTERIES],
    reason: "Concentration of major religious houses requires metropolis resources."
  },
  "Small hospital": {
    requires: ["Parish church", MONASTERY_OR_FRIARY, "Priest (resident)"],
    reason: "Medieval hospitals were run by religious orders as acts of charity."
  },
  "Major hospital": {
    minTier: "city",
    requires: [CATHEDRAL_10_000_ONLY, MULTIPLE_MONASTERIES, PARISH_CHURCHES_2_5],
    reason: "Large hospitals require wealthy religious backing and multiple orders."
  },
  "Hospital network": {
    minTier: "metropolis",
    requires: ["Major hospital", "Great cathedral", MULTIPLE_MONASTERIES],
    reason: "Network of facilities requires central cathedral authority and multiple orders."
  },
  [CATHEDRAL_10_000_ONLY]: {
    minTier: "city",
    requires: [PARISH_CHURCHES_2_5, PARISH_CHURCHES_10_30],
    reason: "A bishop's seat requires 10,000+ population and an established congregational structure."
  },
  "Great cathedral": {
    minTier: "metropolis",
    requires: [CATHEDRAL_10_000_ONLY, PARISH_CHURCHES_10_30, PARISH_CHURCHES_50_100],
    reason: "Architectural marvel requires massive wealth, metropolitan population, and deep congregational roots."
  },
  "Great library": {
    minTier: "city",
    requires: ["Sage's quarter", CATHEDRAL_10_000_ONLY, MULTIPLE_MONASTERIES],
    reason: "Major collections require wealthy religious or civic patronage to fund acquisition."
  },
  "Sage's quarter": {
    minTier: "city",
    requires: ["Great library", "Bardic college"],
    reason: "Concentration of scholars requires educational infrastructure to attract them."
  },
  "Bardic college": {
    minTier: "city",
    requires: ["Theaters", "Great library"],
    reason: "Formal bardic training requires cultural infrastructure."
  },
  "Town hall": {
    minTier: "town",
    reason: "Formal civic administration requires town-scale governance."
  },
  "City hall": {
    minTier: "city",
    reason: "City-scale civic administration."
  },
  Courthouse: {
    minTier: "town",
    requires: ["Town hall", "Mayor and council", "Village reeve"],
    reason: "Formal courts require civic authority to enforce judgments."
  },
  [MULTIPLE_COURT_BUILDINGS]: {
    minTier: "city",
    requires: ["Courthouse", "City hall"],
    reason: "Specialized courts require large population and complex legal needs."
  },
  "Large prison": {
    requires: ["Courthouse", "City hall"],
    reason: "Large-scale incarceration requires an active judicial system."
  },
  "Massive prison": {
    minTier: "metropolis",
    requires: ["Large prison", MULTIPLE_COURT_BUILDINGS],
    reason: "Vast prisons require metropolitan-scale criminal justice system."
  },
  "Palace/government complex": {
    minTier: "metropolis",
    reason: "Grand civic architecture requires metropolitan resources and centuries of institutional development."
  },
  [CRAFT_GUILDS_5_15]: {
    minTier: "town",
    requires: ["Weekly market", "Market square"],
    reason: "Craft guilds require regular trade to justify organization."
  },
  [CRAFT_GUILDS_30_80]: {
    minTier: "city",
    requires: [CRAFT_GUILDS_5_15, "Daily markets"],
    reason: "Large craft networks require established guild tradition."
  },
  "Craft guilds (100-150+)": {
    minTier: "metropolis",
    requires: [CRAFT_GUILDS_30_80],
    reason: "Every conceivable trade requires metropolis-scale population."
  },
  "Specialized metalworkers": {
    requires: ["Blacksmiths (3-10)", CRAFT_GUILDS_30_80, CRAFT_GUILDS_5_15],
    reason: "Specialization emerges from established metalworking tradition."
  },
  "Printing house": {
    minTier: "city",
    requires: ["Great library", CRAFT_GUILDS_30_80],
    reason: "Printing requires paper supply, literate market, and skilled craft workers."
  },
  Glassmakers: {
    minTier: "city",
    requires: [CRAFT_GUILDS_30_80, CRAFT_GUILDS_5_15],
    reason: "Glassmaking requires high-temperature kilns and specialized knowledge."
  },
  Mill: {
    minTier: "village",
    requires: ["Farmland", SUBSISTENCE_FARMING, "Market square", "Weekly market"],
    reason: "A miller needs grain: either from local farmland or via market access."
  },
  "Mills (2-5)": {
    minTier: "town",
    requires: ["Mill", "Market square"],
    reason: "Multiple mills require established grain supply chain."
  },
  "Weavers/Textile workers": {
    requires: ["Farmland", SUBSISTENCE_FARMING, "Weekly market", "Market square"],
    reason: "Weavers need wool or flax from local pastoral farming or market imports."
  },
  Sawmill: {
    requiresAny: [
      "Market square",
      "Weekly market",
      DOCKS_PORT_FACILITIES,
      MERCHANT_GUILDS_3_8,
      "Managed forest",
      "Farmland",
      SUBSISTENCE_FARMING,
      COMMON_GRAZING_LAND
    ],
    reason: "A sawmill needs timber access: local forest, a market, or an agricultural economy to source bulk timber commercially."
  },
  Theaters: {
    minTier: "city",
    reason: "Professional performance requires wealthy audience and cultural sophistication."
  },
  "Multiple theaters": {
    minTier: "metropolis",
    requires: ["Theaters"],
    reason: "Multiple venues require enormous population to sustain."
  },
  "Opera house": {
    minTier: "metropolis",
    requires: ["Multiple theaters", "Bardic college"],
    reason: "Opera requires extremely wealthy patronage and professional musical tradition."
  },
  "Colosseum/arena": {
    minTier: "metropolis",
    requires: ["Fighting pits"],
    reason: "Colosseum-scale entertainment requires enormous investment and audience."
  },
  "Gambling district": {
    minTier: "metropolis",
    requires: ["Gambling halls", "Gambling den"],
    reason: "A district requires concentrated and institutionalized gambling infrastructure."
  },
  "Gambling halls": {
    minTier: "city",
    requires: ["Gambling den", "Ale house"],
    reason: "Organized gambling halls grow from informal establishments."
  },
  "Street gang": {
    minTier: "town",
    reason: "Organized territorial gangs require enough population density to establish territory."
  },
  [THIEVES_GUILD_CHAPTER]: {
    minTier: "city",
    requires: ["Street gang", "Black market", "Gambling den", "Front businesses"],
    reason: "Organized guild structure requires criminal infrastructure to coordinate."
  },
  [THIEVES_GUILD_POWERFUL]: {
    minTier: "metropolis",
    requires: [THIEVES_GUILD_CHAPTER, MULTIPLE_CRIMINAL_FACTIONS, "Black market"],
    reason: "Powerful criminal organization requires extensive existing criminal infrastructure."
  },
  [MULTIPLE_CRIMINAL_FACTIONS]: {
    minTier: "city",
    requires: ["Street gang", THIEVES_GUILD_CHAPTER, SMUGGLING_OPERATION],
    reason: "Multiple competing criminal organizations require city-scale population."
  },
  "Black market bazaar": {
    minTier: "city",
    requires: ["Black market", MULTIPLE_CRIMINAL_FACTIONS, "Underground city"],
    reason: "Large-scale illegal market requires extensive criminal networks and hidden spaces."
  },
  "Underground city": {
    minTier: "city",
    reason: "Extensive underground networks require large population and old infrastructure."
  },
  "Assassins' guild": {
    minTier: "metropolis",
    requires: [THIEVES_GUILD_POWERFUL, "Underground city"],
    reason: "Contract killing organizations require 50,000+ population or regional operations."
  },
  [SMUGGLING_OPERATION]: {
    minTier: "town",
    reason: "Organized smuggling requires sufficient trade volume to hide contraband within."
  },
  "Smuggling network": {
    minTier: "city",
    requires: [SMUGGLING_OPERATION, WAREHOUSE_DISTRICT],
    reason: "Network-scale smuggling requires an established operation and storage infrastructure. Port access is a bonus but not required for overland networks."
  },
  "Front businesses": {
    minTier: "town",
    requires: ["Street gang", "Gambling den", "Black market"],
    reason: "Criminal fronts require existing criminal operation to launder."
  },
  [ADVENTURERS_CHARTER_HALL]: {
    minTier: "hamlet",
    reason: "A charter hall operates under regional authority and can exist in smaller settlements, especially on dangerous frontiers."
  },
  [MULTIPLE_ADVENTURERS_GUILDS]: {
    minTier: "city",
    requires: [ADVENTURERS_CHARTER_HALL],
    reason: "Competing guilds require metropolis-scale adventuring demand."
  },
  "Dungeon delving supply district": {
    minTier: "city",
    requires: [ADVENTURERS_CHARTER_HALL, MULTIPLE_ADVENTURERS_GUILDS],
    reason: "Specialized gear suppliers follow adventurer concentration."
  },
  "Traveling hedge wizard": {
    minTier: "thorp",
    reason: "A traveling practitioner needs only a large enough community to offer services."
  },
  "Hedge wizard": {
    minTier: "village",
    reason: "A resident hedge wizard requires a village large enough to support one."
  },
  "Wizard's tower": {
    minTier: "town",
    reason: "A tower-dwelling wizard establishes their own supply chain at this scale."
  },
  "Alchemist shop": {
    minTier: "town",
    requires: ["Weekly market", "Market square"],
    reason: "An alchemist requires reagent supply from regular trade."
  },
  "Scroll scribe": {
    minTier: "town",
    requires: ["Wizard's tower", "Hedge wizard", "Alchemist shop"],
    reason: "Professional scroll production requires a magical practitioner to supervise."
  },
  "Enchanter's shop": {
    minTier: "city",
    requires: ["Wizard's tower", "Alchemist shop"],
    reason: "Enchantment services require established arcane infrastructure."
  },
  "Mages' guild": {
    minTier: "city",
    requires: ["Wizard's tower"],
    reason: "Organized magical guild requires established tower infrastructure."
  },
  "Academy of magic": {
    minTier: "city",
    requires: ["Mages' guild", "Mages' district"],
    reason: "Formal magical education requires organized guild and district infrastructure."
  },
  "Mages' district": {
    minTier: "city",
    requires: ["Wizard's tower", "Mages' guild"],
    reason: "A mages' district requires concentration of practitioners and guild organization."
  },
  [TELEPORTATION_CIRCLE]: {
    minTier: "town",
    reason: "Permanent teleportation requires substantial magical investment. Cost: 18,250 in gold to create."
  },
  "Golem workforce": {
    minTier: "city",
    requires: ["Academy of magic", "Mages' guild"],
    reason: "Construct creation requires high-level magical expertise and institutional oversight."
  },
  "Undead labor": {
    minTier: "city",
    requires: ["Mages' guild", "Academy of magic"],
    reason: "Necromantic labor requires organized magical community for control and containment."
  },
  "Dream parlors (high magic)": {
    minTier: "metropolis",
    requires: ["Mages' district", "Academy of magic"],
    reason: "Dream-walking magic services require metropolis population (25,000+) and powerful casters."
  },
  [AIRSHIP_DOCKING_HIGH_MAGIC]: {
    minTier: "metropolis",
    requires: ["Mages' guild", "Academy of magic"],
    reason: "Airship docking requires major magical infrastructure to operate. Without a mages' guild or academy, there is no magical expertise to maintain the mooring fields or weather protection."
  },
  "Message network (high magic)": {
    minTier: "metropolis",
    requires: ["Mages' guild", "Banking houses"],
    reason: "Speaking Stone networks require institutional coordination and 250\u201310,000 in gold per station."
  },
  "Planar embassy": {
    minTier: "metropolis",
    requires: [TELEPORTATION_CIRCLE],
    reason: "Stable planar contact requires a permanent teleportation circle. No circle, no embassy."
  },
  "Planar traders": {
    minTier: "metropolis",
    requires: [TELEPORTATION_CIRCLE],
    reason: "Extraplanar commerce arrives through a permanent teleportation circle. No circle, no planar trade."
  },
  "Dragon resident": {
    minTier: "metropolis",
    reason: "Only the largest, wealthiest cities can negotiate with or survive the presence of a dragon."
  }
};


// GOVERNMENT_INSTITUTIONS — valid government institutions by settlement type
export const GOVERNMENT_INSTITUTIONS = {
  government: [
    "Head-of-household consensus",
    "Informal elder consensus",
    "Village reeve",
    "Lord's steward",
    "Lord's appointee",
    "Mayor and council",
    "Guild governance",
    "Guild consortium",
    "Noble governor",
    "Merchant oligarchy",
    "Democratic assembly",
    "City-state government",
    "Royal seat"
  ],
  marketScale: [
    "Weekly market",
    "Daily markets",
    DISTRICT_MARKETS_5_10
  ],
  criminalPower: [
    THIEVES_GUILD_CHAPTER,
    THIEVES_GUILD_POWERFUL,
    MULTIPLE_CRIMINAL_FACTIONS
  ],
  defenseLevel: [
    "Town walls",
    CITY_WALLS_AND_GATES,
    MASSIVE_WALLS_AND_FORTIFICATIONS
  ]
};
