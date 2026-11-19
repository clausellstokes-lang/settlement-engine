// historyData.js — Settlement history + power-role tables.
// Extracted from economicGenerator.js where they were misplaced.
//
// This file holds two unrelated datasets:
//   1. POWER_ROLES_BY_CATEGORY — the catalog of notable power-holder roles
//      (mayor, high priest, guild master, crime lord, …) keyed by domain,
//      tier/institution-gated by economy/upgradeOpportunities.js.
//   2. The genuine history-generation data (AGE_BY_TIER, HISTORICAL_EVENTS_DATA,
//      EVENT_TYPE_NAMES) consumed by historyGenerator.js.

import { HISTORY_DESC_VARIANTS } from './historyDescVariants.js';
import { pickVariant } from '../kernel/proseHash.js'; import { migrationDirectionOfConfig } from '../domain/migrationDirection.js'; import { resolveSibling } from '../domain/facts/drawDeclared.js';

// Notable power-holder roles by domain (government, religious, crafts,
// military, economy, criminal, magic, other). Each entry describes a role that
// can hold influence in a settlement and the conditions under which it appears.
// Consumed by getUpgradeOpportunities to surface tier-appropriate roles.
export const POWER_ROLES_BY_CATEGORY = {
  government: [
    {
      role: "Mayor",
      title: "mayor",
      priority: 10,
      minTier: "village",
      goalCategories: ["power", "protection"],
    },
    {
      role: "Lord",
      title: "lord",
      priority: 10,
      minTier: "town",
      goalCategories: ["power", "wealth"],
    },
    {
      role: "Governor",
      title: "mayor",
      priority: 10,
      minTier: "city",
      goalCategories: ["power", "political"],
    },
    {
      role: "Duke/Viceroy",
      title: "mayor",
      priority: 10,
      minTier: "metropolis",
      goalCategories: ["power", "political"],
      requiresInstKeyword: ['palace', 'royal seat', "noble governor"],
    },
    {
      role: "Grand Chancellor",
      title: "council",
      priority: 9,
      minTier: "metropolis",
      goalCategories: ["power", "knowledge"],
      requiresInstKeyword: ['palace', 'royal seat', 'multiple court', "government complex"],
    },
    {
      role: "Master of Coin",
      title: "guild_master",
      priority: 8,
      minTier: "metropolis",
      goalCategories: ["wealth", "power"],
    },
    {
      role: "Spymaster",
      title: "captain",
      priority: 8,
      minTier: "metropolis",
      goalCategories: ["power", "personal"],
      requiresInstKeyword: ['palace', 'royal seat', "noble governor", 'city-state', "government complex"],
    },
    {
      role: "Foreign Ambassador",
      title: "council",
      priority: 7,
      minTier: "metropolis",
      goalCategories: ["political", "personal"],
      requiresInstKeyword: ['palace', 'royal seat', "government complex", 'guild consortium', 'city-state'],
    },
    {
      role: "Council Member",
      title: "council",
      priority: 7,
      minTier: "town",
      goalCategories: ["power", "reform"],
    },
    {
      role: "Tax Collector",
      title: "tax_collector",
      priority: 5,
      minTier: "village",
      goalCategories: ["wealth", "power"],
    },
    {
      role: "Chief Magistrate",
      title: "magistrate",
      priority: 7,
      minTier: "town",
      goalCategories: ["justice", "power"],
      requiresInstKeyword: ['court', 'town hall', 'city hall', 'prison'],
    },
    {
      role: "City Clerk",
      title: "clerk",
      priority: 3,
      minTier: "town",
      goalCategories: ["knowledge", "personal"],
      requiresInstKeyword: ['town hall', 'city hall', 'court'],
    },
    {
      role: "Harbor Master",
      title: "harbor_master",
      priority: 6,
      minTier: "town",
      goalCategories: ["wealth", "power"],
      requiresPort: !0,
    },
    {
      role: 'Reeve',
      title: 'overseer',
      priority: 6,
      minTier: 'hamlet',
      goalCategories: ['justice', 'wealth'],
    },
    {
      role: 'Herald/Town Crier',
      title: 'clerk',
      priority: 4,
      minTier: 'village',
      goalCategories: ['knowledge', 'personal'],
    },
    {
      role: 'Notary/Scrivener',
      title: 'clerk',
      priority: 5,
      minTier: 'town',
      goalCategories: ['knowledge', 'wealth'],
    },
    {
      role: 'Customs Inspector',
      title: 'overseer',
      priority: 5,
      minTier: 'town',
      goalCategories: ['justice', 'wealth'],
      requiresInstKeyword: ['customs', 'harbour', 'harbor', 'dock', 'assay'],
    },
    {
      role: 'Prison Warden',
      title: 'warden',
      priority: 5,
      minTier: 'city',
      goalCategories: ['justice', 'power'],
      requiresInstKeyword: ['prison', 'stocks', 'workhouse'],
    },
    {
      role: 'Royal Envoy',
      title: 'advisor',
      priority: 7,
      minTier: 'city',
      goalCategories: ['power', 'knowledge'],
      requiresInstKeyword: ['palace', 'royal seat', "noble governor", "lord's"],
    },
    {
      role: 'Alderman',
      title: 'council',
      priority: 5,
      minTier: 'town',
      goalCategories: ['wealth', 'justice'],
    },
    // ── Noble / feudal leadership ────────────────────────────────────────────
    // Merged from the former POWER_ROLES_BY_CATEGORY.noble bucket. 'noble' was a
    // dead bucket key: getUpgradeOpportunities (economy/upgradeOpportunities.js)
    // surfaces a bucket's roles only when some institution carries
    // priorityCategory/category equal to the bucket key, but no catalog entry
    // uses 'noble' on either axis and the closed-set category vocabulary
    // (src/data/categoryVocabulary.js) never admits one — so the bucket never
    // matched a settlement. The domain layer already aliases 'noble' to
    // 'government' (deriveNpcProfile maps noble leverage to government; see
    // src/domain/npcProfile.js, pinned by tests/domain/wave1CohesionFixes.test.js),
    // so these feudal leadership roles belong in the reachable 'government'
    // bucket, where they now surface for any settlement with a government
    // institution at the right tier. goalCategories and the requiresInstKeyword
    // coherence gates are preserved exactly as they stood in the noble bucket.
    // SEAM-CULTURE (2026-11-17, BRIEF-BAR6-SEAM item 1; the chair's SV1): the title names a lord, so it declares the
    // `sovereign` atom (`domain/facts/sovereign.js`, frozen). The role draw does not read the declaration (the cast is born
    // after the houses, and at that draw the leaf knows only the houses and the crisis); it holds wherever the title
    // prints because it prints only as a person's role, and the leaf reads the cast's roles ("a person", SV1). Guarded:
    // tests/domain/bar6CultureLines.test.js (every town of the 720 that seats it reads `sovereign`).
    {
      role: 'Lord/Lady of the Manor',
      title: 'noble',
      priority: 8,
      minTier: 'village',
      goalCategories: ['power', 'wealth'],
      needs: ['sovereign'],
    },
    {
      role: 'Baron/Baroness',
      title: 'noble',
      priority: 9,
      minTier: 'town',
      goalCategories: ['power', 'wealth'],
    },
    {
      role: 'Court Advisor',
      title: 'advisor',
      priority: 7,
      minTier: 'town',
      goalCategories: ['power', 'knowledge'],
    },
    {
      role: 'House Steward',
      title: 'steward',
      priority: 6,
      minTier: 'village',
      goalCategories: ['wealth', 'personal'],
    },
    {
      role: 'Noble Heir',
      title: 'noble',
      priority: 5,
      minTier: 'hamlet',
      goalCategories: ['personal', 'power'],
    },
    {
      role: 'Land Agent',
      title: 'agent',
      priority: 5,
      minTier: 'village',
      goalCategories: ['wealth', 'personal'],
    },
    {
      role: 'Knight/Dame',
      title: 'knight',
      priority: 7,
      minTier: 'village',
      goalCategories: ['protection', 'personal'],
    },
    {
      role: 'Duke/Duchess',
      title: 'noble',
      priority: 10,
      minTier: 'metropolis',
      goalCategories: ['power', 'wealth'],
      requiresInstKeyword: ['palace', 'royal seat', "noble governor", "government complex"],
    },
    {
      role: 'Royal Chamberlain',
      title: 'noble',
      priority: 8,
      minTier: 'city',
      goalCategories: ['power', 'personal'],
      requiresInstKeyword: ['palace', 'royal seat', "government complex"],
    },
  ],
  religious: [
    {
      role: "High Priest",
      title: "priest",
      priority: 9,
      minTier: "village",
      goalCategories: ["spiritual", "power"],
    },
    {
      role: "Abbot/Abbess",
      title: "priest",
      priority: 8,
      minTier: "town",
      goalCategories: ["spiritual", "knowledge"],
      requiresInstKeyword: ['monastery', 'friary', 'monastic'],
    },
    {
      role: "Inquisitor",
      title: "inquisitor",
      priority: 7,
      minTier: "city",
      goalCategories: ["spiritual", "justice"],
      requiresInstKeyword: ['monastery', 'cathedral', 'friary'],
    },
    {
      role: "Archbishop/Patriarch",
      title: "priest",
      priority: 10,
      minTier: "metropolis",
      goalCategories: ["power", "religion"],
      requiresInstKeyword: ['cathedral', 'great cathedral', 'parish churches'],
    },
    {
      role: "Temple Guard Commander",
      title: "templar",
      priority: 7,
      minTier: "city",
      goalCategories: ["spiritual", "protection"],
      requiresInstKeyword: ['barracks', 'garrison', 'monastery', 'cathedral'],
    },
    {
      role: "Priest",
      title: "priest",
      priority: 6,
      minTier: "hamlet",
      goalCategories: ["spiritual", "personal"],
    },
    {
      role: "Monastery Archivist",
      title: "clerk",
      priority: 4,
      minTier: "town",
      goalCategories: ["knowledge", "spiritual"],
      requiresInstKeyword: ['monastery', 'friary', 'great library'],
    },
    {
      role: 'Shrine Keeper',
      title: 'priest',
      priority: 5,
      minTier: 'thorp',
      goalCategories: ['spiritual', 'personal'],
      requiresInstKeyword: ['shrine', 'wayside', 'temple', 'church'],
    },
    {
      role: 'Wandering Monk',
      title: 'priest',
      priority: 5,
      minTier: 'hamlet',
      goalCategories: ['spiritual', 'personal'],
    },
    {
      role: 'Temple Healer',
      title: 'healer',
      priority: 6,
      minTier: 'village',
      goalCategories: ['spiritual', 'protection'],
      requiresInstKeyword: ['hospital', 'church', 'monastery', 'shrine'],
    },
    {
      role: 'Under-Chaplain',
      title: 'priest',
      priority: 4,
      minTier: 'hamlet',
      goalCategories: ['spiritual', 'personal'],
      requiresInstKeyword: ['church', 'parish', 'cathedral', 'monastery'],
    },
    {
      role: 'Chaplain',
      title: 'priest',
      priority: 5,
      minTier: 'village',
      goalCategories: ['spiritual', 'protection'],
      requiresInstKeyword: ['barracks', 'garrison', 'church', 'monastery', "noble governor", 'palace'],
    },
    {
      role: 'Prophet/Seer',
      title: 'priest',
      priority: 7,
      minTier: 'town',
      goalCategories: ['spiritual', 'knowledge'],
    },
    {
      role: 'Head of the Faithful',
      title: 'priest',
      priority: 8,
      minTier: 'city',
      goalCategories: ['power', 'spiritual'],
      requiresInstKeyword: ['cathedral', 'monastery', 'great cathedral', 'parish churches'],
    },
    {
      role: 'Exorcist',
      title: 'inquisitor',
      priority: 6,
      minTier: 'town',
      goalCategories: ['spiritual', 'justice'],
      requiresInstKeyword: ['monastery', 'cathedral', 'friary'],
    },
  ],
  crafts: [
    {
      role: 'Master Blacksmith',
      title: 'master',
      priority: 7,
      minTier: 'hamlet',
      goalCategories: ['wealth', 'personal'],
    },
    {
      role: 'Master Carpenter',
      title: 'master',
      priority: 6,
      minTier: 'hamlet',
      goalCategories: ['wealth', 'personal'],
    },
    {
      role: 'Master Weaver',
      title: 'master',
      priority: 6,
      minTier: 'village',
      goalCategories: ['wealth', 'personal'],
    },
    {
      role: 'Master Tanner',
      title: 'master',
      priority: 5,
      minTier: 'village',
      goalCategories: ['wealth', 'personal'],
    },
    {
      role: 'Head Brewer',
      title: 'guild',
      priority: 5,
      minTier: 'hamlet',
      goalCategories: ['wealth', 'personal'],
    },
    {
      role: 'Guild Warden',
      title: 'guild',
      priority: 7,
      minTier: 'town',
      goalCategories: ['power', 'wealth'],
      requiresGuild: true,
    },
    {
      role: 'Journeyman Overseer',
      title: 'overseer',
      priority: 5,
      minTier: 'town',
      goalCategories: ['wealth', 'personal'],
      requiresGuild: true,
    },
    {
      role: 'Craft Guild Representative',
      title: 'guild',
      priority: 6,
      minTier: 'city',
      goalCategories: ['power', 'wealth'],
      requiresGuild: true,
    },
    {
      role: 'Master Potter',
      title: 'master',
      priority: 4,
      minTier: 'village',
      goalCategories: ['wealth', 'personal'],
    },
    {
      role: 'Master Glassblower',
      title: 'master',
      priority: 5,
      minTier: 'town',
      goalCategories: ['wealth', 'personal'],
    },
  ],
  military: [
    {
      role: "Guard Captain",
      title: "guard",
      priority: 8,
      minTier: "village",
      goalCategories: ["protection", "justice"],
    },
    {
      role: "Garrison Commander",
      title: "guard",
      priority: 8,
      minTier: "town",
      goalCategories: ["military", "power"],
    },
    {
      role: "City Watch Chief",
      title: "guard",
      priority: 8,
      minTier: "city",
      goalCategories: ["protection", "justice"],
    },
    {
      role: "Mercenary Captain",
      title: "captain",
      priority: 6,
      minTier: "town",
      goalCategories: ["wealth", "power"],
      requiresInstKeyword: ['mercenary', 'free company', 'charter', 'hireling'],
    },
    {
      role: "Master of Arms",
      title: "master",
      priority: 6,
      minTier: "city",
      goalCategories: ["protection", "personal"],
      requiresInstKeyword: ['barracks', 'garrison', 'citadel'],
    },
    {
      role: "Military Quartermaster",
      title: "overseer",
      priority: 5,
      minTier: "town",
      goalCategories: ["wealth", "military"],
    },
    {
      role: 'Scout/Ranger',
      title: 'guard',
      priority: 6,
      minTier: 'hamlet',
      goalCategories: ['protection', 'personal'],
    },
    {
      role: 'Siege Engineer',
      title: 'master',
      priority: 6,
      minTier: 'city',
      goalCategories: ['military', 'knowledge'],
      requiresInstKeyword: ['wall', 'citadel', 'fortif', 'barracks', 'garrison'],
    },
    {
      role: 'Border Warden',
      title: 'warden',
      priority: 6,
      minTier: 'town',
      goalCategories: ['protection', 'justice'],
    },
    {
      role: 'Veteran Soldier',
      title: 'guard',
      priority: 5,
      minTier: 'hamlet',
      goalCategories: ['personal', 'protection'],
    },
    {
      role: 'Cavalry Commander',
      title: 'captain',
      priority: 7,
      minTier: 'city',
      goalCategories: ['military', 'power'],
      requiresInstKeyword: ['stable', 'barracks', 'garrison', 'knight'],
    },
    {
      role: 'Armourer',
      title: 'master',
      priority: 5,
      minTier: 'town',
      goalCategories: ['wealth', 'military'],
      requiresInstKeyword: ['blacksmith', 'smith', 'metalwork', 'specialized metal'],
    },
    {
      role: 'Naval Commander',
      title: 'captain',
      priority: 8,
      minTier: 'city',
      goalCategories: ['military', 'power'],
      requiresPort: true,
    },
  ],
  economy: [
    {
      role: "Wealthiest Merchant",
      title: "merchant",
      priority: 8,
      minTier: "town",
      goalCategories: ["wealth", "power"],
    },
    {
      role: "Guild Master",
      title: "guild",
      priority: 8,
      minTier: "village",
      goalCategories: ["power", "wealth"],
      requiresGuild: !0,
    },
    {
      role: "Master Craftsman",
      title: "master",
      priority: 6,
      minTier: "village",
      goalCategories: ["wealth", "personal"],
    },
    {
      role: "Moneylender",
      title: "banker",
      priority: 7,
      minTier: "town",
      goalCategories: ["wealth", "power"],
      requiresInstKeyword: ['money', 'bank', 'pawnbroker', 'exchange', 'credit'],
    },
    {
      role: "Market Overseer",
      title: "overseer",
      priority: 5,
      minTier: "village",
      goalCategories: ["wealth", "justice"],
    },
    {
      role: "Trade Factor",
      title: "merchant",
      priority: 5,
      minTier: "town",
      goalCategories: ["wealth", "knowledge"],
    },
    {
      role: "Master Shipwright",
      title: "master",
      priority: 5,
      minTier: "town",
      goalCategories: ["wealth", "personal"],
      requiresPort: !0,
    },
    {
      role: 'Traveling Merchant',
      title: 'merchant',
      priority: 5,
      minTier: 'thorp',
      goalCategories: ['wealth', 'personal'],
    },
    {
      role: 'Ship Captain',
      title: 'captain',
      priority: 7,
      minTier: 'town',
      goalCategories: ['wealth', 'personal'],
      requiresPort: true,
    },
    {
      role: 'Warehouse Master',
      title: 'overseer',
      priority: 5,
      minTier: 'town',
      goalCategories: ['wealth', 'personal'],
      requiresInstKeyword: ['warehouse', 'granary', 'storage'],
    },
    {
      role: 'Grain Factor',
      title: 'merchant',
      priority: 6,
      minTier: 'village',
      goalCategories: ['wealth', 'protection'],
      requiresInstKeyword: ['granary', 'grain', 'mill', 'market'],
    },
    {
      role: 'Auctioneer',
      title: 'merchant',
      priority: 5,
      minTier: 'town',
      goalCategories: ['wealth', 'knowledge'],
    },
    {
      role: 'Caravan Master',
      title: 'merchant',
      priority: 6,
      minTier: 'village',
      goalCategories: ['wealth', 'personal'],
      requiresInstKeyword: ['caravan', 'coaching', 'stable', 'waystation'],
    },
    {
      role: 'Banking Agent',
      title: 'banker',
      priority: 6,
      minTier: 'city',
      goalCategories: ['wealth', 'power'],
      requiresInstKeyword: ['bank', 'banking', 'money changer', 'mint', 'assay'],
    },
  ],
  criminal: [
    {
      role: "Local Fence",
      title: "fence",
      priority: 7,
      minTier: "thorp",
      goalCategories: ["wealth", "personal"],
    },
    {
      role: "Bandit Contact",
      title: "contact",
      priority: 6,
      minTier: "thorp",
      goalCategories: ["protection", "wealth"],
    },
    {
      role: "Smuggler",
      title: "smuggler",
      priority: 6,
      minTier: "hamlet",
      goalCategories: ["wealth", "personal"],
    },
    {
      role: "Thieves' Guild Master",
      title: "guild_master",
      priority: 8,
      minTier: "town",
      goalCategories: ["power", "wealth"],
    },
    {
      role: "Black Market Fence",
      title: "fence",
      priority: 6,
      minTier: "town",
      goalCategories: ["wealth", "knowledge"],
    },
    {
      role: "Smuggler Chief",
      title: "smuggler",
      priority: 6,
      minTier: "town",
      goalCategories: ["wealth", "personal"],
    },
    {
      role: "Crime Lord",
      title: "lord",
      priority: 9,
      minTier: "city",
      goalCategories: ["power", "wealth"],
    },
    {
      role: "Shadow Council Leader",
      title: "lord",
      priority: 10,
      minTier: "metropolis",
      goalCategories: ["wealth", "power"],
    },
    {
      role: "Assassin Guildmaster",
      title: "master",
      priority: 7,
      minTier: "city",
      goalCategories: ["power", "wealth"],
    },
    {
      role: "Corrupt Official",
      title: "overseer",
      priority: 5,
      minTier: "town",
      goalCategories: ["wealth", "power"],
    },
    {
      role: 'Cutpurse/Pickpocket',
      title: 'fence',
      priority: 4,
      minTier: 'thorp',
      goalCategories: ['wealth', 'personal'],
    },
    {
      role: 'Racketeer',
      title: 'contact',
      priority: 6,
      minTier: 'town',
      goalCategories: ['wealth', 'power'],
    },
    {
      role: 'Spy/Informant',
      title: 'contact',
      priority: 6,
      minTier: 'village',
      goalCategories: ['wealth', 'personal'],
    },
    {
      role: 'Counterfeiter',
      title: 'fence',
      priority: 6,
      minTier: 'town',
      goalCategories: ['wealth', 'knowledge'],
      requiresInstKeyword: ['bank', 'mint', 'money', 'assay', 'banking'],
    },
    {
      role: 'Gang Leader',
      title: 'lord',
      priority: 7,
      minTier: 'town',
      goalCategories: ['power', 'wealth'],
    },
    {
      role: 'Underground Broker',
      title: 'merchant',
      priority: 6,
      minTier: 'city',
      goalCategories: ['wealth', 'knowledge'],
    },
  ],
  magic: [
    {
      role: "Tower Wizard",
      title: "wizard",
      priority: 8,
      minTier: "city",
      goalCategories: ["knowledge", "power"],
      requiresInstKeyword: ["wizard's tower", 'wizard'],
    },
    {
      role: "Guild Archmage",
      title: "archmage",
      priority: 9,
      minTier: "city",
      goalCategories: ["knowledge", "power"],
    },
    {
      role: "Grand Magister",
      title: "archmage",
      priority: 10,
      minTier: "metropolis",
      goalCategories: ["power", "knowledge"],
      requiresInstKeyword: ['academy', "mages' district", "mages' guild", 'great library'],
    },
    {
      role: "Court Sorcerer",
      title: "sorcerer",
      priority: 7,
      minTier: "town",
      goalCategories: ["knowledge", "personal"],
      requiresInstKeyword: ['wizard', 'mage', 'alchemist', 'enchant'],
    },
    {
      role: "Alchemist",
      title: "alchemist",
      priority: 6,
      minTier: "town",
      goalCategories: ["knowledge", "wealth"],
      requiresInstKeyword: ['alchemist', 'alchemy'],
    },
    {
      role: "Hedge Wizard",
      title: "wizard",
      priority: 5,
      minTier: "village",
      goalCategories: ["knowledge", "personal"],
    },
    {
      role: "Arcane Archivist",
      title: "clerk",
      priority: 4,
      minTier: "city",
      goalCategories: ["knowledge", "spiritual"],
      requiresInstKeyword: ['great library', "mages' guild", 'academy', "mages' district"],
    },
    {
      role: 'Diviner/Seer',
      title: 'wizard',
      priority: 5,
      minTier: 'village',
      goalCategories: ['knowledge', 'wealth'],
    },
    {
      role: 'Runesmith',
      title: 'master',
      priority: 6,
      minTier: 'town',
      goalCategories: ['knowledge', 'wealth'],
    },
    {
      role: 'Enchanter',
      title: 'wizard',
      priority: 6,
      minTier: 'town',
      goalCategories: ['knowledge', 'wealth'],
      requiresInstKeyword: ['enchant'],
    },
    {
      role: 'Conjurer',
      title: 'wizard',
      priority: 5,
      minTier: 'village',
      goalCategories: ['knowledge', 'personal'],
    },
    {
      role: 'Druid Elder',
      title: 'druid',
      priority: 7,
      minTier: 'village',
      goalCategories: ['spiritual', 'protection'],
      requiresInstKeyword: ['druid', 'elder grove'], // J33: Warden's Lodge is defence, not druid (the owner, 2026-10-01)
    },
    {
      role: 'Warlock/Bargain-Sworn',
      title: 'sorcerer',
      priority: 6,
      minTier: 'town',
      goalCategories: ['power', 'personal'],
    },
    {
      role: 'Artificer',
      title: 'master',
      priority: 6,
      minTier: 'city',
      goalCategories: ['knowledge', 'wealth'],
      requiresInstKeyword: ['arcane', 'mage', 'enchant', 'golem', 'academy'],
    },
    {
      role: 'Apprentice Mage',
      title: 'wizard',
      priority: 4,
      minTier: 'town',
      goalCategories: ['knowledge', 'personal'],
    },
  ],
  other: [
    {
      role: "Tavern Owner",
      title: "owner",
      priority: 5,
      minTier: "hamlet",
      goalCategories: ["wealth", "knowledge"],
    },
    {
      role: "Sage/Scholar",
      title: "sage",
      priority: 6,
      minTier: "town",
      goalCategories: ["knowledge", "personal"],
    },
    {
      role: "Healer",
      title: "healer",
      priority: 7,
      minTier: "village",
      goalCategories: ["protection", "spiritual"],
    },
    {
      role: "Master Builder",
      title: "master",
      priority: 6,
      minTier: "town",
      goalCategories: ["wealth", "personal"],
    },
    {
      role: "Bard/Chronicler",
      title: "sage",
      priority: 4,
      minTier: "town",
      goalCategories: ["knowledge", "personal"],
    },
    {
      role: "Retired Adventurer",
      title: "owner",
      priority: 4,
      minTier: "village",
      goalCategories: ["personal", "protection"],
    },
    {
      role: "Miller",
      title: "owner",
      category: "economy",
      priority: 8,
      minTier: "thorp",
      goalCategories: ["wealth", "personal"],
    },
    {
      role: "Elder",
      title: "elder",
      category: "government",
      priority: 7,
      minTier: "thorp",
      goalCategories: ["protection", "personal"],
    },
    {
      role: "Hedge Witch",
      title: "healer",
      priority: 5,
      minTier: "thorp",
      goalCategories: ["knowledge", "spiritual"],
    },
    {
      role: "Innkeeper",
      title: "owner",
      category: "economy",
      priority: 6,
      minTier: "thorp",
      goalCategories: ["wealth", "knowledge"],
    },
    {
      role: "Wandering Peddler",
      title: "merchant",
      priority: 4,
      minTier: "thorp",
      goalCategories: ["wealth", "knowledge"],
    },
    {
      role: "Shepherd",
      title: "owner",
      priority: 3,
      minTier: "thorp",
      goalCategories: ["personal", "protection"],
    },
    {
      role: "Woodcutter",
      title: "owner",
      priority: 3,
      minTier: "thorp",
      goalCategories: ["personal", "protection"],
    },
    {
      role: "Blacksmith",
      title: "master",
      priority: 6,
      minTier: "thorp",
      goalCategories: ["wealth", "personal"],
    },
    {
      role: "Widowed Farmer",
      title: "elder",
      priority: 4,
      minTier: "thorp",
      goalCategories: ["personal", "protection"],
    },
    {
      role: "Wounded Soldier",
      title: "guard",
      priority: 4,
      minTier: "thorp",
      goalCategories: ["personal", "protection"],
    },
    {
      role: "Village Priest",
      title: "priest",
      priority: 5,
      minTier: "thorp",
      goalCategories: ["spiritual", "personal"],
    },
    {
      role: 'Midwife',
      title: 'healer',
      priority: 5,
      minTier: 'thorp',
      goalCategories: ['protection', 'personal'],
    },
    {
      role: 'Apothecary',
      title: 'healer',
      priority: 6,
      minTier: 'hamlet',
      goalCategories: ['knowledge', 'wealth'],
    },
    {
      role: 'Cartographer',
      title: 'clerk',
      priority: 5,
      minTier: 'town',
      goalCategories: ['knowledge', 'wealth'],
    },
    {
      role: 'Rat Catcher',
      title: 'agent',
      priority: 3,
      minTier: 'hamlet',
      goalCategories: ['wealth', 'personal'],
    },
    {
      role: 'Gravedigger',
      title: 'agent',
      priority: 3,
      minTier: 'hamlet',
      goalCategories: ['personal', 'spiritual'],
    },
    {
      role: 'Fisherman',
      title: 'agent',
      priority: 4,
      minTier: 'thorp',
      goalCategories: ['wealth', 'personal'],
    },
    {
      role: 'Debt-Ridden Noble',
      title: 'noble',
      priority: 4,
      minTier: 'town',
      goalCategories: ['wealth', 'personal'],
    },
    {
      role: 'Disgraced Official',
      title: 'overseer',
      priority: 4,
      minTier: 'town',
      goalCategories: ['personal', 'justice'],
    },
    {
      role: 'Street Preacher',
      title: 'priest',
      priority: 4,
      minTier: 'hamlet',
      goalCategories: ['spiritual', 'personal'],
    },
    {
      role: 'Mercenary-for-Hire',
      title: 'guard',
      priority: 4,
      minTier: 'hamlet',
      goalCategories: ['wealth', 'personal'],
    },
    {
      role: 'Dockworker/Stevedore',
      title: 'agent',
      priority: 3,
      minTier: 'town',
      goalCategories: ['wealth', 'personal'],
      requiresPort: true,
    },
    {
      role: 'Travelling Performer',
      title: 'bard',
      priority: 4,
      minTier: 'hamlet',
      goalCategories: ['personal', 'wealth'],
    },
    {
      role: 'Debt Collector',
      title: 'agent',
      priority: 5,
      minTier: 'town',
      goalCategories: ['wealth', 'justice'],
    },
    {
      role: 'Escaped Slave/Serf',
      title: 'agent',
      priority: 4,
      minTier: 'hamlet',
      goalCategories: ['personal', 'protection'],
    },
  ],
};


// getUpgradeOpportunities


// ── History generator data (extracted from historyGenerator.js) ──────────────

export const AGE_BY_TIER = {
  thorp:      { min: 15,  max: 300 },
  hamlet:     { min: 30,  max: 120 },
  village:    { min: 30,  max: 250 },
  town:       { min: 50,  max: 300 },
  city:       { min: 100, max: 500 },
  metropolis: { min: 200, max: 800 },
}

/**
 * DECLARED HOOKS (CENSUS-3d unit 6, 2026-11-05; `docs/DESIGN_POOL_CENSUS.md` §3.1, the sibling
 * column). A `plotHooks` row that presumes a fact its event does not guarantee is `{ text, needs?,
 * excludes? }`; a bare string presumes only what the event is. The ONE reader of the rows is
 * `historyGenerator.js :: generateEventNarrative`, which draws over the full list as before and
 * resolves through `drawDeclared` (a refused hook gives way to the event's highest-hashed admitted
 * hook, no roll), storing the TEXT only. The event's own past (the newcomers of a friction event)
 * is its key and is not declared; a live crisis atom would misread it.
 */
export const HISTORICAL_EVENTS_DATA = [
  {
    type: 'succession_crisis',
    description: 'The ruler of the time was aging or ill, and potential heirs jockeyed for position',
    factions: ['Legitimate heir', 'Popular candidate', 'Power behind throne'],
    lastingEffects: [
      'Rival claimant bloodlines still contest ceremonial precedence',
      'Succession now governed by a charter drafted in the aftermath',
    ],
    plotHooks: [
      "A would-be heir approaches outsiders to investigate a rival's past",
      { text: 'The ailing ruler wants a final errand completed before naming a successor', excludes: ['ruler: council', 'ruler: elder', 'crisis: succession_void'] }, // CENSUS-3d unit 6; W2-FIX-DATA-5 (ww-544): no living ruler while the seat stands empty; W2-FIX-DATA-HISTORY item G (pf-160): an elders' council has no one ruler to name a successor
      { text: 'Someone is poisoning the ruler slowly, and someone in the household knows', excludes: ['ruler: council', 'ruler: elder', 'crisis: succession_void'] }, // CENSUS-3d unit 6; W2-FIX-DATA-5 (ww-545's sibling): the same; W2-FIX-DATA-HISTORY item G: the twin carries its sibling's conditions
    ],
    // TAIL-HISTORY Y13 (the chair's ruling, 2026-11-15: Y5 widened to every type; READ-ALL's aftermath shape): the words where the timeline holds no event of this type (historyGenerator.js :: tensionByMemory): a live quarrel, present tense, no past event (VETOABLE wording, the owner's)
    byMemory: { unanchored: { description: 'Who will lead next is the quarrel of the day, and the would-be successors are each gathering support' } },
    severity: ['minor', 'major'],
  },
  {
    type: 'economic_disparity',
    description: 'The merchants are getting richer and the labourers are not, and the labourers have noticed',
    factions: ['Wealthy merchants', 'Poor workers', 'Moderate reformers'],
    lastingEffects: [
      'Wage disputes settled by a standing arbitration council since founded',
      "The merchant quarter and the labourers' quarter remain walled apart",
    ],
    plotHooks: [
      'A reformer has been found hanged in their own house, and their papers are missing',
      { text: "A hidden ledger documenting wage theft is circulating in the workers' quarter", needs: ['tier: >= town'] }, // CENSUS-3d unit 6
      'A merchant is funding both the reform movement and the suppression of it',
    ],
    severity: ['minor', 'major'],
  },
  {
    type: 'religious_tension',
    description: 'Different faiths or interpretations competed for influence and converts',
    factions: ['Orthodox believers', 'Reformists', 'Secular camp'],
    lastingEffects: [
      "Two rival congregations still divide the settlement's faithful",
      'Public preaching restricted to licensed grounds after the unrest',
    ],
    plotHooks: [
      'A relic claimed by both sides has resurfaced in a private collection',
      'The reformist leader is being blackmailed into silence',
      'Someone is staging miracles for one side, and whoever is paying for them has not been named',
    ],
    // TAIL-HISTORY Y13 (the chair's ruling, 2026-11-15: Y5 widened to every type; READ-ALL's aftermath shape): the words where the timeline holds no event of this type (historyGenerator.js :: tensionByMemory): a live quarrel, present tense, no past event (VETOABLE wording, the owner's)
    byMemory: { unanchored: { description: 'Different faiths or interpretations compete for influence and converts' } },
    severity: ['minor', 'major'],
  },
  {
    type: 'guild_conflict',
    description: 'Rival guilds fought over who may sell what, and over a say in how the place is run',
    factions: ['Established guilds', 'Upstart guilds', 'Non-guild workers'],
    lastingEffects: [
      'Guild membership rolls now audited by an outside adjudicator',
      "One guild's charter was revoked and never fully restored",
    ],
    plotHooks: [
      { text: "A guild master's records have gone missing ahead of an audit", needs: ['guild'] }, // W2-FIX-DATA: the guild homed (facts/guild.js)
      { text: 'A journeyman denied mastership has proof the exam was rigged', needs: ['guild'] }, // W2-FIX-DATA: no mastership without a guild (c10)
      { text: 'Someone is sabotaging both guilds to destabilize the market for a third party', needs: ['market', 'guild'] }, // CENSUS-3d unit 6; BAR3-PLACES-3 (C13868): "both guilds" presumes a guild, as its siblings declare (both copies; a declaration, no draw moved: the past guild war is born only where a guild stands)
    ],
    // TAIL-HISTORY Y13 (the chair's ruling, 2026-11-15: Y5 widened to every type; READ-ALL's aftermath shape): the words where the timeline holds no event of this type (historyGenerator.js :: tensionByMemory): a live quarrel, present tense, no past event (VETOABLE wording, the owner's)
    byMemory: { unanchored: { description: 'Guild and non-guild traders are fighting over who may sell what, and over a say in how the place is run',
        factions: ['Guild members', 'Those who would trade outside the guild', 'Non-guild workers'],
        plotHooks: [{ text: "A guild master's records have gone missing ahead of an audit", needs: ['guild'] }, { text: 'A journeyman denied mastership has proof the exam was rigged', needs: ['guild'] }, { text: 'Someone is sabotaging both sides to destabilize the market for a third party', needs: ['market', 'guild'] }] } },
    severity: ['minor', 'major'],
  },
  {
    type: 'external_threat',
    description: 'News of approaching danger divided the community on how to respond',
    factions: ['Prepare for war', 'Seek diplomacy', 'Flee/hide'],
    lastingEffects: [
      'Watch towers and muster drills maintained since the alarm',
      'A standing levy roster kept ready in the town archive',
    ],
    plotHooks: [
      { text: 'The threat is being exaggerated by someone who profits from wartime contracts', excludes: ['war: peace'] }, // TAIL-HISTORY batch 1 (the chair's Y1; READ-ALL 22261, 02538, B02462): a war's words, where a war is in force
      { text: 'A diplomatic channel exists that the war party is suppressing', excludes: ['war: peace'] }, // TAIL-HISTORY batch 1 (the chair's Y1; READ-ALL 22261, 02538, B02462): a war's words, where a war is in force
      'The threat has an agent already inside the settlement',
    ],
    // TAIL-HISTORY Y13 (the chair's ruling, 2026-11-15: Y5 widened to every type; READ-ALL's aftermath shape): the words where the timeline holds no event of this type (historyGenerator.js :: tensionByMemory): a live quarrel, present tense, no past event (VETOABLE wording, the owner's)
    byMemory: { unanchored: { description: 'News of approaching danger divides the community on how to respond' } },
    severity: ['major', 'catastrophic'],
  },
  {
    type: 'resource_scarcity',
    description: 'A critical resource became scarce, causing hoarding and price gouging',
    factions: ['Hoarders', 'Desperate poor', 'Price regulators'],
    lastingEffects: [
      'Emergency grain reserves mandated by ordinance since the shortage',
      'Price ceilings on the affected goods still enforced in lean seasons',
    ],
    plotHooks: [
      { text: 'A store of the scarce goods is being kept off the market on purpose', needs: ['market'] }, // CENSUS-3d unit 6; W2-FIX-DATA-HISTORY item G (ww-1230): the goods, not a warehouse the roster may lack (was "A warehouse full of ...")
      'The scarcity was engineered. Someone destroyed the competing supply route',
      'An alternative source exists but the information is being suppressed',
    ],
    // TAIL-HISTORY Y13 (the chair's ruling, 2026-11-15: Y5 widened to every type; READ-ALL's aftermath shape): the words where the timeline holds no event of this type (historyGenerator.js :: tensionByMemory): a live quarrel, present tense, no past event (VETOABLE wording, the owner's)
    byMemory: { unanchored: { description: 'A critical resource is running short, and some are hoarding it while others cannot pay the prices asked',
        factions: ['Those hoarding what they can', 'Those who cannot pay the prices', 'Those who would fix a fair price'] } },
    severity: ['minor', 'major'],
  },
  {
    type: 'crime_wave',
    description: 'A surge in criminal activity overwhelmed the authorities; vigilantes began to form',
    factions: ['Official guards', 'Vigilantes', 'Criminal organisations'],
    lastingEffects: [
      'An expanded watch and a night curfew survive from the crackdown',
      'Vigilante bands never fully disbanded and still operate quietly',
    ],
    plotHooks: [
      'The crime wave is coordinated. Someone is directing it to create a pretext',
      { text: 'A guard captain is on the payroll of the criminal network', needs: ['watch'] }, // CENSUS-3d unit 6; W2-FIX-DATA: a captain of the guard needs a watch, not a household levy (c04)
      'The vigilantes have begun targeting innocents based on bad information',
    ],
    // TAIL-HISTORY Y13 (the chair's ruling, 2026-11-15: Y5 widened to every type; READ-ALL's aftermath shape): the words where the timeline holds no event of this type (historyGenerator.js :: tensionByMemory): a live quarrel, present tense, no past event (VETOABLE wording, the owner's)
    byMemory: { unanchored: { description: 'Crime is rising faster than those in charge can answer it, and some talk of taking the law into their own hands',
        factions: ['Official guards', 'Those who would take the law into their own hands', 'Criminal organisations'],
        plotHooks: ['The crime wave is coordinated. Someone is directing it to create a pretext', { text: 'A guard captain is on the payroll of the criminal network', needs: ['watch'] }, 'Those who would take the law into their own hands have picked out a culprit on bad information'] } },
    severity: ['minor', 'major'],
  },
  {
    type: 'magical_controversy',
    description: 'Debate over the role and regulation of magic divided the community',
    factions: ['Pro-magic', 'Anti-magic', 'Regulation advocates'],
    lastingEffects: [
      'Spellcasting now requires a licence from the local authority',
      'The site of the disputed working remains cordoned and warded',
    ],
    plotHooks: [
      'A recent magical accident was covered up and the victims silenced',
      'An anti-magic agitator is secretly using magic themselves',
      'Something was sealed away using magic years ago and the seal is weakening',
    ],
    // TAIL-HISTORY Y13 (the chair's ruling, 2026-11-15: Y5 widened to every type; READ-ALL's aftermath shape): the words where the timeline holds no event of this type (historyGenerator.js :: tensionByMemory): a live quarrel, present tense, no past event (VETOABLE wording, the owner's)
    byMemory: { unanchored: { description: 'Debate over the role and regulation of magic divides the community' } },
    severity: ['minor', 'major'],
  },
  {
    type: 'generational_divide',
    description: 'The young want to change how things are done, and the old will not let them',
    factions: ['Traditionalists', 'Progressives', 'Pragmatic middle'],
    lastingEffects: [
      'Council seats now formally split between the old guard and the young',
      'A youth assembly won a permanent advisory voice in the aftermath',
    ],
    plotHooks: [
      "A traditional practice conceals something the elders don't want examined",
      "A young reformer has uncovered records that undermine the old guard's legitimacy",
      "The 'new idea' being promoted was actually tried once before, and failed badly",
    ],
    severity: ['minor'],
  },
  {
    type: 'corruption_scandal',
    description: 'Evidence of official corruption has surfaced but powerful figures resist investigation',
    factions: ['Corrupt officials', 'Reformers', 'Complicit beneficiaries'],
    lastingEffects: [
      'An oversight office was established to audit officials afterward',
      'Several old families carry names still quietly disgraced',
    ],
    plotHooks: [
      'The investigator who uncovered the corruption has received a death threat',
      "A key witness can be found, but won't speak without protection",
      'The corruption goes higher than anyone yet suspects; those pressing to expose it are being used', // BAR7-LINES (LOW hook-party, 7 of the 720): names no party the town may not hold
    ],
    severity: ['major'],
  },
  {
    type: 'outside_debt',
    description: 'The settlement owed a significant debt to an external power that was preparing to collect',
    factions: [
      'Debtors who took the loans',
      'Those who will bear the cost',
      'Those who profited and escaped',
    ],
    lastingEffects: [
      'Tribute payments to the external creditor continue on a schedule',
      'Municipal borrowing now capped by a charter clause',
    ],
    plotHooks: [
      'The original loan documents contain a clause that was never disclosed publicly',
      { text: "A creditor's agent is in town conducting a quiet assessment before enforcement", excludes: ['crisis: under_siege'] }, // TAIL-HISTORY-5 (the chair's Y17, 2026-11-15; the exports' read X9 03015): no agent comes in under a siege; the timeline's hook gives way draw-free, the tension's list drops it (1 of 71 towns)
      'The debt could be voided, if someone can prove it was obtained through fraud',
    ],
    // TAIL-HISTORY Y13 (the chair's ruling, 2026-11-15: Y5 widened to every type; READ-ALL's aftermath shape): the words where the timeline holds no event of this type (historyGenerator.js :: tensionByMemory): a live quarrel, present tense, no past event (VETOABLE wording, the owner's)
    byMemory: { unanchored: { description: 'The settlement owes a heavy debt to an outside power, and the power is preparing to collect',
        factions: ['Those who took the loans', 'Those who will bear the cost', 'Those who profited and want no questions asked'] } },
    severity: ['major'],
  },
  {
    type: 'occupation_legacy',
    description:
      'A previous occupation ended, but collaborators and resisters continued to live side by side, their history unresolved',
    factions: [
      'Former collaborators',
      'Former resistance',
      'New generation wanting to move on',
    ],
    // URBAN-FIX D-1: the tension's words when its own event sits on the timeline older than 80 years (historyGenerator.js :: tensionByMemory)
    byMemory: { dated: { description: 'The occupation ended long ago, but the families who collaborated and the families who resisted still keep apart', factions: ['Collaborator families', 'Resistance families', 'Those who want it forgotten'] },
      // URBAN-FIX D-1b: the words when the timeline holds no occupation at all: the template's own lasting effects, naming no past event
      unanchored: { description: 'Collaborator and resistance families still keep apart, and old property seizures remain legally unresolved', factions: ['Collaborator families', 'Resistance families', 'Those who want it forgotten'] } },
    lastingEffects: [
      'Collaborator and resistance families still keep apart',
      'Wartime property seizures remain legally unresolved',
    ],
    plotHooks: [
      "A collaborator family's wartime fortune was built on betrayals that are finally surfacing",
      'Resistance fighters kept records that would expose people still in power',
      { text: 'A former occupier officer has returned under a false identity', excludes: ['crisis: occupied'] }, // W2-FIX-DATA-HISTORY item C: "former" says the occupation is over; not under one in force
    ],
    severity: ['major', 'catastrophic'],
  },
  {
    type: 'infiltration_fear',
    description:
      'Rumours (some true) of enemy agents within the settlement caused suspicion and denunciations',
    factions: [
      'Security hardliners',
      'Civil libertarians',
      'Actual agents exploiting the confusion',
    ],
    lastingEffects: [
      'A standing security office and informant network persist',
      'Denunciation records from the panic remain sealed in the archive',
    ],
    plotHooks: [
      'One of the loudest voices warning about infiltration is themselves an agent',
      'An innocent person has been identified as a spy and is about to be executed',
      "The agents' handler is someone the town trusts, and the players have already met them",
    ],
    // TAIL-HISTORY Y13 (the chair's ruling, 2026-11-15: Y5 widened to every type; READ-ALL's aftermath shape): the words where the timeline holds no event of this type (historyGenerator.js :: tensionByMemory): a live quarrel, present tense, no past event (VETOABLE wording, the owner's)
    byMemory: { unanchored: { description: 'Rumours (some true) of enemy agents within the settlement are stirring suspicion and denunciations' } },
    severity: ['major'],
  },
  {
    type: 'disputed_land',
    description:
      'A land claim from an old charter contradicts current occupation, with both sides legally plausible',
    factions: [
      'Original claimants',
      'Current occupants',
      'Legal class profiting from ambiguity',
    ],
    lastingEffects: [
      'The contested parcel remains legally unassigned and unbuilt',
      'Rival charters over the land are both still lodged with the court',
    ],
    plotHooks: [
      'The original charter is held in a private archive whose owner has gone missing',
      'Something of value was found on the disputed land, which is why the claim is suddenly being pressed',
      "A forged document is about to be introduced as evidence; someone knows it's fake",
    ],
    severity: ['minor', 'major'],
  },
  {
    type: 'population_friction',
    description:
      'A recently arrived group and the established population fell into sustained, low-level conflict',
    factions: [
      'Old families',
      'Newcomers',
      'Merchants who benefit from cheap newcomer labour',
    ],
    lastingEffects: [
      'Newcomer and old-family districts remain socially distinct',
      'A resettlement compact governs where new arrivals may hold property',
    ],
    plotHooks: [
      'The newcomers fled something, and that something has sent agents after them',
      "A series of 'accidents' targeting newcomers is being attributed to chance",
      'An old family is deliberately inflaming tensions to drive out a newcomer who knows something',
    ],
    // TAIL-HISTORY Y13 (the chair's ruling, 2026-11-15: Y5 widened to every type; READ-ALL's aftermath shape): the words where the timeline holds no event of this type (historyGenerator.js :: tensionByMemory): a live quarrel, present tense, no past event (VETOABLE wording, the owner's)
    byMemory: { unanchored: { description: 'A recently arrived group and the established population are locked in sustained, low-level conflict' } },
    severity: ['minor', 'major'],
  },
  {
    type: 'leadership_vacuum',
    description:
      'The last strong leader died or left, and no one has yet consolidated their position',
    factions: [
      'Multiple weak claimants',
      'Pragmatists who want stability',
      'Those who prefer the vacuum',
    ],
    lastingEffects: [
      'Rival claimants still hold competing partial authority',
      'A regency council formed in the interim never fully dissolved',
    ],
    plotHooks: [
      "The departed leader left a sealed document designating a successor, and someone wants it destroyed before it's read",
      'One claimant has manufactured evidence of a mandate they actually lack',
      'The vacuum is being maintained deliberately by an outside power that benefits from the instability',
    ],
    // TAIL-HISTORY Y13 (the chair's ruling, 2026-11-15: Y5 widened to every type; READ-ALL's aftermath shape): the words where the timeline holds no event of this type (historyGenerator.js :: tensionByMemory): a live quarrel, present tense, no past event (VETOABLE wording, the owner's)
    byMemory: { unanchored: { description: 'No one holds a firm grip on the leadership, and those who would take it are each too weak to win it',
        factions: ['Rival claimants, none strong enough to win', 'Pragmatists who want stability', 'Those who prefer things unsettled'],
        plotHooks: ['A sealed document naming who should lead has turned up, and someone wants it destroyed before it is read', 'One claimant has manufactured evidence of a mandate they actually lack', 'The vacuum is being maintained deliberately by an outside power that benefits from the instability'] } },
    severity: ['major', 'catastrophic'],
  },
  // ── generators-domain-6: additional timeline templates ─────────────────────
  // Authored to give city/metropolis timelines enough distinct arcs to reach
  // their event budget (the old category-keyed dedup capped every settlement at
  // ~8 events) and to deepen the thin disaster/religious/magical categories.
  // Same voice/shape as the arcs above: one-line setup, three factions, three
  // present-tense hooks, a severity band. Tokens ({resource}, {location}, etc.)
  // resolve through the history renderer for both timelines and current tensions.
  {
    type: 'market_crash',
    description: 'A speculative frenzy in {resource} and property collapsed almost overnight, ruining fortunes and hardening class resentment for a generation',
    factions: ['Ruined speculators', 'Creditors calling in debts', 'Those who sold in time'],
    plotHooks: [
      { text: 'A ledger names who was warned to sell before the collapse, and who was not', needs: ['market'] }, // CENSUS-3d unit 6
      'A ruined family blames a rival for engineering the panic, and wants proof',
      'The debts that survived the crash were quietly bought up by a single hidden buyer',
    ],
    // TAIL-HISTORY Y5 (the chair's ruling, 2026-11-15; READ-ALL's aftermath shape): the words where the timeline holds no event of this type (historyGenerator.js :: tensionByMemory): a live quarrel, present tense, no past event (VETOABLE wording, the owner's)
    byMemory: { unanchored: { description: 'Talk of a coming crash in {resource} sets neighbour against neighbour: some buy as if prices can only rise, others are calling in what they are owed',
        factions: ['Those buying as if prices can only rise', 'Creditors calling in debts', 'Those who have sold and are waiting'],
        plotHooks: [
          { text: 'A ledger names who has been warned to sell, and who has not', needs: ['market'] },
          'A family on the brink of ruin blames a rival for stirring the panic, and wants proof',
          'Someone is quietly buying up other people\'s debts, and nobody knows who',
        ] } },
    severity: ['minor', 'major'],
  },
  {
    type: 'trade_collapse',
    description: 'The {route_type} trade the settlement was built upon failed, and the wealth it once carried drained away within a few hard years',
    factions: ['Displaced traders', 'Workers left without wages', 'Rivals who profited from the diversion'],
    plotHooks: [
      'The route could be reopened, but someone with power prefers it stay closed',
      'A caravan master swears the collapse was arranged, and kept the correspondence to prove it',
      'An old contract still obliges a distant partner to trade here, if anyone can enforce it',
    ],
    // TAIL-HISTORY Y5 (the chair's ruling, 2026-11-15; READ-ALL's aftermath shape): the words where the timeline holds no event of this type (historyGenerator.js :: tensionByMemory): a live quarrel, present tense, no past event (VETOABLE wording, the owner's)
    byMemory: { unanchored: { description: 'Whether the trade the settlement lives on is about to fail is the quarrel of the day: some see buyers going elsewhere, others see nothing but rumour',
        factions: ['Traders who fear the buyers are going elsewhere', 'Workers afraid for their wages', 'Rivals who would gain if the trade moved'],
        plotHooks: [
          'Someone with power would rather the trade went elsewhere, and is quietly making it harder',
          'A trader swears a rival is spreading rumours to drive the buyers away, and has the letters to prove it',
          'An old contract obliges a distant partner to trade here, if anyone can enforce it',
        ] } },
    severity: ['major'],
  },
  {
    type: 'great_fire',
    description: 'A fire that began in {location} consumed {building_type} across whole districts before it could be checked',
    factions: ['Survivors seeking someone to blame', 'Rebuilders and profiteers', 'Those accused of setting it'], byMemory: { dated: { factions: ['Families still seeking someone to blame', 'Rebuilders and profiteers', 'Those accused of setting it'] },
      // TAIL-HISTORY Y5 (the chair's ruling, 2026-11-15; READ-ALL's aftermath shape): the words where the timeline holds no event of this type (historyGenerator.js :: tensionByMemory): a live quarrel, present tense, no past event (VETOABLE wording, the owner's)
      unanchored: { description: 'Fire is the settlement\'s standing fear, and who may build in timber and thatch, who keeps watch at night and who pays for it are argued over every season',
        factions: ['Those who want timber and thatch forbidden', 'Households who cannot afford to build in anything else', 'Those who say the danger is overblown'],
        plotHooks: [
          'Small fires keep starting at the same few houses, and nobody believes it is chance',
          'Someone is quietly buying the houses most at risk of fire, cheaply, before any rule is made',
          'A rule against thatch is being pressed by one household, and it would ruin exactly its rivals',
        ] } }, // URBAN-FIX D-1 (historyGenerator.js :: tensionByMemory)
    plotHooks: [
      'The fire spared exactly the houses one power wanted cleared, and nobody believes it was chance',
      'A confession was extracted from a scapegoat; the real arsonist still lives in town',
      'Rebuilding uncovered something in the ashes that predates the settlement',
    ],
    severity: ['major', 'catastrophic'],
  },
  {
    type: 'plague_years',
    description: 'A sickness moved through the settlement for {duration} seasons, thinning families and testing every institution to its limit',
    factions: ['Quarantine hardliners', 'The bereaved and the blamed', 'Healers and charlatans alike'],
    plotHooks: [
      { text: 'A healer who profited enormously during the plague is being asked how they stayed untouched', needs: ['healer'] }, // W2-FIX-DATA-HISTORY item E (CENSUS-2 kind a): the healer is asked now, so one practises here
      'The plague pit holds a body that matches no one on the list of the dead',
      'The quarantine was used to settle old scores, and the survivors remember exactly who',
    ],
    // TAIL-HISTORY Y5 (the chair's ruling, 2026-11-15; READ-ALL's aftermath shape): the words where the timeline holds no event of this type (historyGenerator.js :: tensionByMemory): a live quarrel, present tense, no past event (VETOABLE wording, the owner's)
    byMemory: { unanchored: { description: 'Fear of sickness runs through the settlement, and every fever reopens the quarrel over who is shut indoors, who is kept away, and who has the right to decide',
        factions: ['Those who would shut the sick away', 'Families who refuse to be shut in', 'Those who trust to prayer and old remedies'],
        plotHooks: [
          { text: 'A healer is accused of hiding a fever in a household, to spare it from being shut in', needs: ['healer'] },
          'A family taken by fever swears it came in with a traveller off the road, and wants that traveller found',
          'Someone is using the fear of fever to keep a rival household shut indoors, and out of a bargain',
        ] } },
    severity: ['major', 'catastrophic'],
  },
  {
    type: 'great_flood',
    description: 'Waters rose with little warning and reshaped {location}, drowning livelihoods and redrawing who owned what',
    factions: ['Displaced families', 'Landowners pressing newly-convenient claims', 'Those who profited from the redrawing'],
    plotHooks: [
      'The old property boundaries washed away, and the new map favours whoever drew it',
      { text: 'A structure meant to hold back the water had been quietly left to rot, and someone knew', needs: ['navigable'] }, // CENSUS-3d unit 6
      { text: 'The flood uncovered an old foundation under the mud, and someone has been digging there at night', needs: ['navigable'] }, // CENSUS-3d unit 6
    ],
    // TAIL-HISTORY Y5 (the chair's ruling, 2026-11-15; READ-ALL's aftermath shape): the words where the timeline holds no event of this type (historyGenerator.js :: tensionByMemory): a live quarrel, present tense, no past event (VETOABLE wording, the owner's)
    byMemory: { unanchored: { description: 'Rising water is the settlement\'s standing fear, and every wet season reopens the quarrel over who must dig the ditches, who keeps the low ground, and who pays for both',
        factions: ['Households on the low ground', 'Landowners on the high ground', 'Those who say the water will never come'],
        plotHooks: [
          'The ditches that carry off the water are choked, and the household bound to clear them refuses',
          { text: 'A bank meant to hold back the water is being quietly left to rot, and someone knows why', needs: ['navigable'] },
          'Someone is buying the low ground cheaply from frightened owners, and seems very sure the water will not come',
        ] } },
    severity: ['major', 'catastrophic'],
  },
  {
    type: 'heresy_trial',
    description: 'An accusation of heresy against a prominent figure split the faithful and drew in the secular authorities on both sides',
    factions: ['The accusers', 'The accused and their sympathizers', 'Authorities exploiting the rift'],
    plotHooks: [
      'The evidence that convicted the heretic was fabricated, and a witness is finally willing to say so',
      "The condemned doctrine is quietly practised still, by more of the town's leaders than would admit it",
      { text: 'A relic seized during the trial never reached the vault it was bound for', needs: ['institution: temple'] }, // CENSUS-3d unit 6
    ],
    // TAIL-HISTORY Y5 (the chair's ruling, 2026-11-15; READ-ALL's aftermath shape): the words where the timeline holds no event of this type (historyGenerator.js :: tensionByMemory): a live quarrel, present tense, no past event (VETOABLE wording, the owner's)
    byMemory: { unanchored: { description: 'An accusation of heresy against a prominent figure is splitting the faithful, and those in authority are being pressed to take a side',
        factions: ['The accusers', 'The accused and their sympathizers', 'Those in authority who would exploit the rift'],
        plotHooks: [
          'The evidence against the accused is fabricated, and a witness is almost ready to say so',
          'The doctrine under accusation is quietly practised by more of the leading households than would admit it',
          'A relic held as evidence against the accused has gone missing, and each side blames the other',
        ] } },
    severity: ['minor', 'major'],
  },
  {
    type: 'pilgrimage_surge',
    description: 'A claimed miracle or relic drew pilgrims in numbers the settlement was never built to hold, and the flood of coin and strangers changed it for good',
    factions: ['Temple beneficiaries', 'Overwhelmed old residents', 'Sceptics who doubt the miracle'],
    plotHooks: [
      'The miracle can be explained mundanely, and the person who can explain it is being kept quiet',
      { text: 'The pilgrim trade made one family rich enough to buy the office that authenticates relics', needs: ['institution: temple'] }, // CENSUS-3d unit 6
      { text: 'A rival shrine claims the relic is theirs, stolen, and has sent someone to recover it', needs: ['institution: temple'] }, // CENSUS-3d unit 6
    ],
    // TAIL-HISTORY Y5 (the chair's ruling, 2026-11-15; READ-ALL's aftermath shape): the words where the timeline holds no event of this type (historyGenerator.js :: tensionByMemory): a live quarrel, present tense, no past event (VETOABLE wording, the owner's)
    byMemory: { unanchored: { description: 'A claimed miracle is splitting the settlement: some would proclaim it and welcome the pilgrims it could bring, others call it a fraud that will bring nothing but strangers',
        factions: ['Those who would proclaim the miracle', 'Residents who want no crowds of strangers', 'Sceptics who doubt the miracle'],
        plotHooks: [
          'The miracle can be explained mundanely, and the person who can explain it is being kept quiet',
          { text: 'One family hopes to buy the office that would authenticate the miracle, and the profits that would follow', needs: ['institution: temple'] },
          { text: 'A rival shrine claims the relic at the heart of the miracle is theirs, stolen, and has sent someone to recover it', needs: ['institution: temple'] },
        ] } },
    severity: ['minor', 'major'],
  },
  {
    type: 'popular_uprising',
    description: 'The common people rose against the ruling powers over {demands}, and the settlement has never entirely closed the account',
    factions: ['Former rebels', 'The restored order', 'Those who changed sides at the right moment'],
    plotHooks: [
      'A list of everyone who informed on the rebels survived, and it names people still in office',
      'The uprising was funded by an outside hand that has come back to collect on the favour',
      'A concession won in the revolt is being quietly rolled back, and the old anger is stirring again',
    ],
    // TAIL-HISTORY Y5 (the chair's ruling, 2026-11-15; READ-ALL's aftermath shape): the words where the timeline holds no event of this type (historyGenerator.js :: tensionByMemory): a live quarrel, present tense, no past event (VETOABLE wording, the owner's)
    byMemory: { unanchored: { description: 'The common people are pressing those in charge over {demands}, and each dispute grows louder than the last',
        factions: ['Those pressing their demands', 'Those in charge, who will not give way', 'Those waiting to see which side wins'],
        plotHooks: [
          'Someone is keeping a list of who speaks loudest for the demands, and passing it to those in charge',
          'An outside hand is quietly paying for the agitation, and will want something for it',
          'A concession has been promised to the common people, and someone in authority means to break the promise',
        ] } },
    severity: ['major', 'catastrophic'],
  },
  {
    type: 'tyranny',
    description: 'A single figure seized power through {method} and ruled without check for a time, and the memory still shapes who is trusted with authority',
    factions: ['Old loyalists', 'Those who suffered under the regime', 'Beneficiaries who kept their gains'],
    byMemory: { dated: { factions: ['Loyalist families', 'Families the regime wronged', "Families who kept the regime's gains"] },
      // TAIL-HISTORY Y5 (the chair's ruling, 2026-11-15; READ-ALL's aftermath shape): the words where the timeline holds no event of this type (historyGenerator.js :: tensionByMemory): a live quarrel, present tense, no past event (VETOABLE wording, the owner's)
      unanchored: { description: 'Whether one person is taking more power than anyone granted is the quarrel of the day, and every new rule is read as a step toward tyranny',
        factions: ['Those who want a strong hand', 'Those who fear a tyrant in the making', 'Those who will serve whoever wins'],
        plotHooks: [
          'Someone close to authority is gathering powers no one granted, and keeps the papers that show it locked away',
          'A household that spoke out against the new rules has had its goods seized on a pretext, and wants them back',
          'Someone is paying for praise of a strong hand in the street, and stands to profit if it comes',
        ] } }, // URBAN-FIX D-1 (historyGenerator.js :: tensionByMemory)
    plotHooks: [
      "The tyrant's private records survived, and they implicate respectable families in the worst of it",
      'A fortune the regime confiscated was never returned, and the rightful heirs have surfaced',
      'Someone is deliberately rehabilitating the tyrant’s reputation, and profiting from it',
    ],
    severity: ['major', 'catastrophic'],
  },
  {
    type: 'wild_magic',
    description: 'An uncontrolled surge of magic left its mark on {quarter} and on the people who were there, and the effects have never fully faded',
    factions: ['The changed and their descendants', 'Those who fear them', 'Scholars studying the residue'],
    plotHooks: [
      'The surge was no accident. An experiment went wrong, and the notes were hidden, not destroyed',
      'A bloodline touched by the surge is now manifesting something the family cannot conceal',
      { text: 'The affected district is slowly spreading its strangeness, and the authorities are pretending otherwise', needs: ['tier: ≥ town'] }, // W2-FIX-DATA-HISTORY item E (CENSUS-2 kind c): a district is a town's
    ],
    // TAIL-HISTORY Y5 (the chair's ruling, 2026-11-15; READ-ALL's aftermath shape): the words where the timeline holds no event of this type (historyGenerator.js :: tensionByMemory): a live quarrel, present tense, no past event (VETOABLE wording, the owner's)
    byMemory: { unanchored: { description: 'Strange flares of magic come without warning, and what causes them, and what to do about the people they touch, is argued over by everyone',
        factions: ['Those touched by the flares', 'Those who fear them', 'Those who would study the flares'],
        plotHooks: [
          'The flares are no accident: someone is working magic they cannot control, and hiding the notes',
          'A child touched by a flare is showing something the family cannot conceal',
          'The flares come more often in one part of the settlement, and those in charge are pretending otherwise',
        ] } },
    severity: ['minor', 'major'],
  },
  // ── generators-domain-1: tension templates the STRESS_TO_TENSION map targets ──
  // insurgency/religious_conversion/slave_revolt → legitimacy_crisis; mass_migration
  // → demographic_pressure; a trade-partner neighbour → trade_dispute. These three
  // types were referenced by name but had no template, so the find() silently
  // dropped the tension — the settlement's active stress never reached its history.
  {
    type: 'legitimacy_crisis',
    description: 'The right of the current authority to rule was openly and widely questioned, and no one could agree on who, if anyone, held a legitimate claim',
    factions: ['The sitting authority', 'Those who deny its mandate', 'Pragmatists who want any stable answer'],
    plotHooks: [
      'A document that would settle the question of legitimacy exists, and both sides would rather it stayed lost',
      'Those in power are paying people to speak for them at the gatherings, because no one will do it for free',
      'A third party is keeping the question open on purpose, because an unsettled claim is easier to bargain with',
    ],
    // TAIL-HISTORY Y13 (the chair's ruling, 2026-11-15: Y5 widened to every type; READ-ALL's aftermath shape): the words where the timeline holds no event of this type (historyGenerator.js :: tensionByMemory): a live quarrel, present tense, no past event (VETOABLE wording, the owner's)
    byMemory: { unanchored: { description: 'The right of the current authority to rule is openly and widely questioned, and no one can agree on who, if anyone, holds a legitimate claim' } },
    severity: ['major', 'catastrophic'],
  },
  {
    type: 'demographic_pressure',
    description: 'Newcomers have come faster than they can be housed or given work, and the old families and the new now compete for the same jobs',
    // #20 (STYLE-RULINGS §1(b), WAVE-RULINGS item 8; W4 PEOPLE second seat 2026-11-07): one description per
    // direction, never the both-ways hedge; the live tension reads its own (`tensionDescription`).
    descriptionByDirection: {
      arrivals: 'Newcomers have come faster than they can be housed or given work, and the old families and the new now compete for the same jobs',
      departures: 'Season after season families have moved away, and the houses, fields and posts they left are hard to fill',
    },
    factions: ['Established residents', 'The newly arrived or departing', 'Those profiting from the churn'],
    // CENSUS-3e (R-AA): one template, two directions, is two lines. The migration direction is
    // homed (`facts/migration.js`), so each hook declares the direction it presumes, and a tension's
    // list (kind A) prints only the hooks of the live direction.
    plotHooks: [
      { text: 'The relief meant for the newcomers is being skimmed, and the shortfall is being blamed on the newcomers', needs: ['migration: influx'] },
      { text: 'An old family is quietly buying the properties the departed left behind, before anyone can return to claim them', needs: ['migration: exodus'] },
      { text: 'The newcomers fled something, and that something has followed them here', needs: ['migration: influx'] },
    ],
    severity: ['minor', 'major'],
  },
  {
    type: 'trade_dispute',
    description: 'A dispute over the terms of trade with a partner settlement soured into something that touched every merchant and every purse in town',
    factions: ['Merchants tied to the old partner', 'Those who want new partners', 'Authorities caught between them'],
    plotHooks: [
      'The dispute is being kept alive by someone who profits from the uncertainty on both sides',
      'A contract clause that could end the dispute has been deliberately misfiled',
      'The partner settlement is applying pressure through a debt no one here wants to acknowledge',
    ],
    // TAIL-HISTORY Y13 (the chair's ruling, 2026-11-15: Y5 widened to every type; READ-ALL's aftermath shape): the words where the timeline holds no event of this type (historyGenerator.js :: tensionByMemory): a live quarrel, present tense, no past event (VETOABLE wording, the owner's)
    byMemory: { unanchored: { description: 'A dispute over the terms of trade with a partner settlement is souring, and it touches every merchant and every purse in the place',
        factions: ['Merchants who trade with the partner', 'Those who want new partners', 'Authorities caught between them'] } },
    severity: ['minor', 'major'],
  },
]

export const EVENT_TYPE_NAMES = {
  succession_crisis:   'The Succession Crisis',
  economic_disparity:  'The Economic Divide',
  outside_debt:        'The Debt Crisis',
  resource_scarcity:   'The Shortage',
  guild_conflict:      'The Guild War',
  corruption_scandal:  'The Scandal',
  crime_wave:          'The Crime Wave',
  // infiltration_fear is a paranoia/denunciation arc (enemy agents, suspicion,
  // denunciations) — NOT an occupation. It previously collided with
  // occupation_legacy on 'The Occupation'; 'The Purge' names its actual theme
  // (the internal hunt for infiltrators) and keeps the title set unique.
  infiltration_fear:   'The Purge',
  leadership_vacuum:   'The Interregnum',
  occupation_legacy:   'The Occupation',
  disputed_land:       'The Land Dispute',
  population_friction: 'The Migration',
  generational_divide: 'The Schism',
  external_threat:     'The Siege',
  religious_tension:   'The Religious Conflict',
  magical_controversy: 'The Arcane Incident',
  exile_return:        'The Return',
  // generators-domain-6 additional timeline arcs (titles kept unique + on-theme).
  market_crash:        'The Crash',
  trade_collapse:      'The Trade Collapse',
  great_fire:          'The Great Fire',
  plague_years:        'The Plague Years',
  great_flood:         'The Flood',
  heresy_trial:        'The Heresy Trials',
  pilgrimage_surge:    'The Pilgrimage',
  popular_uprising:    'The Uprising',
  tyranny:             'The Tyranny',
  wild_magic:          'The Wild Magic',
  // generators-domain-1 tension arcs (STRESS_TO_TENSION targets).
  legitimacy_crisis:   'The Mandate',
  demographic_pressure: 'The Influx',
  trade_dispute:       'The Trade Dispute',
}

/**
 * CONTENT-GT-FINAL (Charge 1): choose a historical-event description among the catalog
 * canonical (index 0) + its authored variants (historyDescVariants.js), by a pure fnv
 * hash of a stable per-event seed — ZERO rng draws (kernel/proseHash.pickVariant,
 * canonical-at-zero). A falsy seed, or a type with no variants, returns the canonical.
 * Lives here (not in the code-capped historyGenerator.js) and folds into that file's
 * existing historyData import — the hot-file "lazy leaf" rule.
 * @param {{type?: string, description: string}} eventTemplate
 * @param {string|number|null} [seed]
 * @returns {string}
 */
/**
 * #20 (W4 PEOPLE second seat, 2026-11-07): a live tension's description, in the migration direction the
 * config's projection declares (`config.migrationDirection`, W0) where its template is keyed by direction;
 * else the template's own. Departures only where the record says so; arrivals is the ruled default.
 * @param {{description: string, descriptionByDirection?: {arrivals: string, departures: string}}} tension
 * @param {unknown} config
 * @returns {string}
 */
export const tensionDescription = (tension, config) => {
  const byDirection = tension?.descriptionByDirection;
  if (!byDirection) return tension.description;
  return byDirection[migrationDirectionOfConfig(/** @type {any} */ (config)) === 'departures' ? 'departures' : 'arrivals'] || tension.description;
};

/**
 * COHERENCE-PRESUME: a template's authored description variants (none → empty), for the current tension
 * that must not repeat its own past event word for word (historyGenerator.js :: apartFromOwnEvent).
 * @param {string} type @returns {ReadonlyArray<string>}
 */
export const historyDescVariantsOf = (type) => HISTORY_DESC_VARIANTS[type] || [];

export const historyDescription = (eventTemplate, seed) => {
  const variants = HISTORY_DESC_VARIANTS[eventTemplate.type];
  return variants
    ? pickVariant([eventTemplate.description, ...variants], seed)
    : eventTemplate.description;
};

// ─── W2-FIX-DATA-2 item 1 (2026-11-13; the REVIEW-W2B cold list, rows 3, 7, 29, 204, 282): THE HISTORY'S PLACE WORDS ───
// The place a flood, a fire or a surge of magic touched was named by districts and quarters in a thorp of six, and by a
// waterfront in a town with no water. Each word now declares what makes it false; a place of village size or smaller
// takes a small-place word in its stead. No roll is added: the timeline's one pick of `{quarter}` is kept, and a
// refused word resolves through the declared door (its twin, else the hash argmax over the admitted words).

/**
 * THE TIMELINE'S `{quarter}` (generateEventNarrative's default, printed by wild_magic): the four words in their
 * drawn order, each declaring the size and the house it presumes; each twin, reached only by resolution, is a
 * small-place word (VETOABLE wording, the owner's).
 */
export const HISTORY_QUARTER_WORDS = Object.freeze([
  Object.freeze({ text: "the merchants' quarter", needs: Object.freeze(['market', 'tier: ≥ town']) }),
  Object.freeze({ text: 'the residential district', needs: Object.freeze(['tier: ≥ town']) }),
  Object.freeze({ text: 'the waterfront', needs: Object.freeze(['navigable', 'tier: ≥ village']) }),
  Object.freeze({ text: 'the temple district', needs: Object.freeze(['institution: temple', 'tier: ≥ town']) }),
  Object.freeze({ text: 'the low ground', twinOf: "the merchants' quarter", needs: Object.freeze(['tier: ≤ village']) }),
  Object.freeze({ text: 'the houses', twinOf: 'the residential district', needs: Object.freeze(['tier: ≤ village']) }),
  Object.freeze({ text: 'the edge of the fields', twinOf: 'the waterfront', needs: Object.freeze(['tier: ≤ village']) }),
  Object.freeze({ text: 'the yards behind the houses', twinOf: 'the temple district', needs: Object.freeze(['tier: ≤ village']) }),
]);

/**
 * THE ROUTE'S PLACE WORD AT VILLAGE SIZE AND BELOW (`historyRouteContext.js :: smallPlaceWordsOf`): the route
 * context names the harbour districts, the riverside quarter, the mill and lumber district or the lower districts;
 * a place of village size or smaller takes the word of its water in their stead (`{location}` and `{quarter}`).
 * Keyed by the route context's `disasterProfile`; every other profile reads `inland`. VETOABLE wording.
 */
export const HISTORY_SMALL_PLACE_WORDS = Object.freeze({
  coastal: Object.freeze({ text: 'the houses nearest the shore', needs: Object.freeze(['coast', 'tier: ≤ village']) }),
  river: Object.freeze({ text: 'the houses nearest the river', needs: Object.freeze(['river', 'tier: ≤ village']) }),
  inland: Object.freeze({ text: 'the low ground', needs: Object.freeze(['tier: ≤ village']) }),
});

/**
 * BAR4-HISTORY T1 (C24951, 2026-11-16): THE PLACE A PAST EVENT'S OWN SENTENCE GAVE IT, read back draw-free, so that the
 * current tension of the same type places it there too (`historyGenerator.js :: buildHistoricalEvent`, through
 * `placedTensionTokens`: the tension's `{quarter}` and `{location}` take that place; the timeline drew `{quarter}` from
 * HISTORY_QUARTER_WORDS while the tension read the route's word, and one surge was told in two districts). The place is
 * read by aligning the event's sentence against its type's authored forms (the catalog's and HISTORY_DESC_VARIANTS'), the
 * place token's span the place. Null where the timeline holds no event of the type, or no form aligns.
 * @param {string} type @param {ReadonlyArray<any>} timeline @returns {string|null}
 */
export const ownEventPlace = (type, timeline) => {
  const own = (Array.isArray(timeline) ? timeline : []).find((e) => e?.templateType === type);
  if (!own) return null;
  const said = String(own.description ?? '');
  const forms = [HISTORICAL_EVENTS_DATA.find((e) => e.type === type)?.description, ...(HISTORY_DESC_VARIANTS[type] || [])];
  for (const form of forms) {
    if (typeof form !== 'string' || !/\{(quarter|location)\}/.test(form)) continue;
    const parts = form.split(/(\{[a-z_]+\})/);
    let placed = false;
    const src = parts.map((part) => {
      if (!/^\{[a-z_]+\}$/.test(part)) return part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      if (!placed && (part === '{quarter}' || part === '{location}')) { placed = true; return '(.+?)'; }
      return '.+?';
    }).join('');
    const m = new RegExp(`^${src}$`).exec(said);
    if (m && m[1]) return m[1];
  }
  return null;
};
/**
 * BAR6-CULTURE (LAW 10, rule 10g-span; C133674, 2026-11-16): THE LENGTH A PAST EVENT'S OWN SENTENCE GAVE IT, read back
 * draw-free as `ownEventPlace` reads its place, so that the current tension of the same type lasts as long. The timeline
 * drew `{duration}` (`historyGenerator.js :: generateEventNarrative`, one to five) while the tensions' shared tokens fix
 * it at "three" (`historyTemplate.js :: buildCurrentTensionTokens`), and one plague was told on one tab as lasting two
 * seasons and three. Null where the timeline holds no event of the type, or no form with a length aligns.
 * @param {string} type @param {ReadonlyArray<any>} timeline @returns {string|null}
 */
export const ownEventDuration = (type, timeline) => {
  const own = (Array.isArray(timeline) ? timeline : []).find((e) => e?.templateType === type);
  if (!own) return null;
  const said = String(own.description ?? '');
  const forms = [HISTORICAL_EVENTS_DATA.find((e) => e.type === type)?.description, ...(HISTORY_DESC_VARIANTS[type] || [])];
  for (const form of forms) {
    if (typeof form !== 'string' || !form.includes('{duration}')) continue;
    const src = form.split(/(\{[a-z_]+\})/).map((part) => {
      if (!/^\{[a-z_]+\}$/.test(part)) return part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      return part === '{duration}' ? '(\\d+|[a-z]+)' : '.+?';
    }).join('');
    const m = new RegExp(`^${src}$`).exec(said);
    if (m && m[1]) return m[1];
  }
  return null;
};
/**
 * The current tension's tokens with its own past event's place (ownEventPlace) and length (ownEventDuration), where the
 * timeline holds that event.
 * @param {Record<string, unknown>} tokens the tensions' shared tokens @param {string} type @param {ReadonlyArray<any>} timeline
 * @returns {Record<string, unknown>}
 */
export const placedTensionTokens = (tokens, type, timeline) => {
  const place = ownEventPlace(type, timeline);
  const duration = ownEventDuration(type, timeline);
  const placed = place ? { ...tokens, '{quarter}': place, '{location}': place } : tokens;
  return duration ? { ...placed, '{duration}': duration } : placed;
};

/**
 * W2-FIX-DATA-5 (2026-11-13; ROUND-3-CUT #331): THE HISTORY TEXTS THAT PRESUME A PLACE'S SIZE, AND THEIR SMALL-PLACE TWINS
 * (`historyGenerator.js :: sizedHistoryText`, at the timeline's description and the tension's). The great fire burns
 * "across whole districts", "across entire districts", "street by street until whole quarters were gone", through
 * warehouses and wharves: districts, quarters and streets are a size error in a place of village size or smaller (the
 * chair's ruling of 2026-11-13). Keyed by the raw template text; each twin names no district, street or building type.
 * VETOABLE wording (the owner's).
 */
export const HISTORY_DESC_SIBLINGS = Object.freeze({
  "A fire that began in {location} consumed {building_type} across whole districts before it could be checked": Object.freeze([
    Object.freeze({ text: "A fire that began in {location} consumed {building_type} across whole districts before it could be checked", needs: Object.freeze(['tier: ≥ town']) }),
    Object.freeze({ text: "A fire that began in {location} burned through the houses and their outbuildings before it could be checked", twinOf: "A fire that began in {location} consumed {building_type} across whole districts before it could be checked", needs: Object.freeze(['tier: ≤ village']) }),
  ]),
  "A fire out of {location} spread through {building_type} across entire districts before anyone could bring it under control": Object.freeze([
    Object.freeze({ text: "A fire out of {location} spread through {building_type} across entire districts before anyone could bring it under control", needs: Object.freeze(['tier: ≥ town']) }),
    Object.freeze({ text: "A fire out of {location} spread from roof to roof before anyone could bring it under control", twinOf: "A fire out of {location} spread through {building_type} across entire districts before anyone could bring it under control", needs: Object.freeze(['tier: ≤ village']) }),
  ]),
  "Beginning in {location}, the blaze took {building_type} street by street until whole quarters were gone": Object.freeze([
    Object.freeze({ text: "Beginning in {location}, the blaze took {building_type} street by street until whole quarters were gone", needs: Object.freeze(['tier: ≥ town']) }),
    Object.freeze({ text: "Beginning in {location}, the blaze took house after house before it was put out", twinOf: "Beginning in {location}, the blaze took {building_type} street by street until whole quarters were gone", needs: Object.freeze(['tier: ≤ village']) }),
  ]),  // W2-FIX-DATA-HISTORY item E (2026-11-13; CENSUS-2's historyGenerator.js :: generateRelationshipEvent writer; ROUND-3-CUT-INCREMENT
  // ww-26, ww-90): THE RESOURCE EVENTS' TEXTS, resolved where the event is written (`sizedResourceEvent`, below): the Great
  // Construction's civic buildings or cathedral, and its quarrymen's guild with civic influence now; the Harvest Compact's
  // merchant guilds; the Arcane Incident's district and its regulatory body; the Iron Dispute's extraction to this day and its
  // mining contract. A text with no twin is dropped where it is refused (a lasting effect, a hook). The Great Construction
  // holds a third member, no twin: a town with no house of worship takes it by the door's argmax (its civic buildings, no
  // cathedral). VETOABLE wording.
  "A period of ambitious stone construction transformed the settlement's character. Walls, civic buildings, or a cathedral raised from local quarry stone. The quarry workers became a political force.": Object.freeze([
    Object.freeze({ text: "A period of ambitious stone construction transformed the settlement's character. Walls, civic buildings, or a cathedral raised from local quarry stone. The quarry workers became a political force.", needs: Object.freeze(['tier: ≥ town', 'institution: temple']) }),
    Object.freeze({ text: "A period of ambitious stone construction transformed the settlement's character. Its walls and civic buildings were raised from local quarry stone. The quarry workers became a political force.", needs: Object.freeze(['tier: ≥ town']), excludes: Object.freeze(['institution: temple']) }),
    Object.freeze({ text: "A period of ambitious stone building transformed the settlement's character, its walls and its larger houses raised from local quarry stone. The quarry workers became a political force.", twinOf: "A period of ambitious stone construction transformed the settlement's character. Walls, civic buildings, or a cathedral raised from local quarry stone. The quarry workers became a political force.", needs: Object.freeze(['tier: ≤ village']) }),
  ]),
  "A period of ambitious stone construction transformed the settlement's character. Civic buildings or a cathedral raised from local quarry stone. The quarry workers became a political force.": Object.freeze([
    Object.freeze({ text: "A period of ambitious stone construction transformed the settlement's character. Civic buildings or a cathedral raised from local quarry stone. The quarry workers became a political force.", needs: Object.freeze(['tier: ≥ town', 'institution: temple']) }),
    Object.freeze({ text: "A period of ambitious stone construction transformed the settlement's character. Its civic buildings were raised from local quarry stone. The quarry workers became a political force.", needs: Object.freeze(['tier: ≥ town']), excludes: Object.freeze(['institution: temple']) }),
    Object.freeze({ text: "A period of ambitious stone building transformed the settlement's character, its larger houses raised from local quarry stone. The quarry workers became a political force.", twinOf: "A period of ambitious stone construction transformed the settlement's character. Civic buildings or a cathedral raised from local quarry stone. The quarry workers became a political force.", needs: Object.freeze(['tier: ≤ village']) }),
  ]),
  "Quarrymen's guild retains unusual civic influence": Object.freeze([
    Object.freeze({ text: "Quarrymen's guild retains unusual civic influence", needs: Object.freeze(['guild']) }),
    Object.freeze({ text: "The quarrymen's families retain unusual civic influence", twinOf: "Quarrymen's guild retains unusual civic influence", excludes: Object.freeze(['guild']) }),
  ]),
  "After years of disputed grain prices, the major farming families and the guilds negotiated a formal compact regulating grain sale and storage. It held for a generation.": Object.freeze([
    Object.freeze({ text: "After years of disputed grain prices, the major farming families and the guilds negotiated a formal compact regulating grain sale and storage. It held for a generation.", needs: Object.freeze(['guild']) }),
    Object.freeze({ text: "After years of disputed grain prices, the major farming families agreed a formal compact regulating grain sale and storage. It held for a generation.", twinOf: "After years of disputed grain prices, the major farming families and the guilds negotiated a formal compact regulating grain sale and storage. It held for a generation.", excludes: Object.freeze(['guild']) }),
  ]),
  "A catastrophic or transformative event tied to the local ley line concentration occurred, permanently altering a district of the settlement and the lives of its inhabitants.": Object.freeze([
    Object.freeze({ text: "A catastrophic or transformative event tied to the local ley line concentration occurred, permanently altering a district of the settlement and the lives of its inhabitants.", needs: Object.freeze(['tier: ≥ town']) }),
    Object.freeze({ text: "A catastrophic or transformative event tied to the local ley line concentration occurred, permanently altering part of the settlement and the lives of its inhabitants.", twinOf: "A catastrophic or transformative event tied to the local ley line concentration occurred, permanently altering a district of the settlement and the lives of its inhabitants.", needs: Object.freeze(['tier: ≤ village']) }),
  ]),
  "Affected district retains residual magical effects": Object.freeze([
    Object.freeze({ text: "Affected district retains residual magical effects", needs: Object.freeze(['tier: ≥ town']) }),
    Object.freeze({ text: "The affected ground retains residual magical effects", twinOf: "Affected district retains residual magical effects", needs: Object.freeze(['tier: ≤ village']) }),
  ]),
  "Arcane regulatory body established with unusual local authority": Object.freeze([
    Object.freeze({ text: "Arcane regulatory body established with unusual local authority", needs: Object.freeze(['tier: ≥ town']) }),
  ]),
  "Rights to the local iron deposits became the subject of a prolonged dispute between the settlement and a rival lord. The outcome shaped who controls extraction to this day.": Object.freeze([
    // BAR7-LINES (the culture seat's rows 137 and 138, left by name; LAW 6e, the chair's SV2): the event is resolved at the birth,
    // where no sovereign is known, so neither form names a lord; "a rival claimant" says the dispute and presumes no realm
    Object.freeze({ text: "Rights to the iron in the local ground became the subject of a prolonged dispute between the settlement and a rival claimant. The outcome shaped who controls extraction to this day.", needs: Object.freeze(['institution: mine']) }),
    Object.freeze({ text: "Rights to the iron in the local ground became the subject of a prolonged dispute between the settlement and a rival claimant. The outcome shaped who holds those rights to this day.", twinOf: "Rights to the iron in the local ground became the subject of a prolonged dispute between the settlement and a rival claimant. The outcome shaped who controls extraction to this day.", excludes: Object.freeze(['institution: mine']) }),
  ]),
  "A rival family claims their ancestor was cheated out of the original mining contract": Object.freeze([
    Object.freeze({ text: "A rival family claims their ancestor was cheated out of the original mining contract", needs: Object.freeze(['institution: mine']) }),
    Object.freeze({ text: "A rival family claims their ancestor was cheated out of the original rights to the deposits", twinOf: "A rival family claims their ancestor was cheated out of the original mining contract", excludes: Object.freeze(['institution: mine']) }),
  ]),
  "Fortified extraction sites established during the dispute": Object.freeze([
    Object.freeze({ text: "Fortified extraction sites established during the dispute", needs: Object.freeze(['institution: mine']) }),
  ]),
  // W2-FIX-DATA-13 (2026-11-14; the chair's 12:11 ruling on REVIEW-W2-FIX-DATA-4's HIGH, r2r-thorp-58 and r2s-indebted-thorp-0):
  // QUARTERS AND DISTRICTS BELONG TO A TOWN OR LARGER, whatever the head count. The two lasting effects of the event
  // tables that name them (the migration's districts, the economic divide's quarters) take the size. The chair's 12:50
  // ruling: A TIER TWIN where the event can be said of a small place in its own words, ELSE SILENCE; resolved draw-free
  // (`generators/history/sizedLastingEffects.js`). VETOABLE wording (the owner's).
  "Newcomer and old-family districts remain socially distinct": Object.freeze([
    Object.freeze({ text: "Newcomer and old-family districts remain socially distinct", needs: Object.freeze(['tier: ≥ town']) }),
    Object.freeze({ text: "Newcomers and the old families still keep apart", twinOf: "Newcomer and old-family districts remain socially distinct", needs: Object.freeze(['tier: ≤ village']) }),
  ]),
  "The merchant quarter and the labourers' quarter remain walled apart": Object.freeze([
    Object.freeze({ text: "The merchant quarter and the labourers' quarter remain walled apart", needs: Object.freeze(['tier: ≥ town']) }),
    Object.freeze({ text: "The merchant families and the labouring families still keep apart", twinOf: "The merchant quarter and the labourers' quarter remain walled apart", needs: Object.freeze(['tier: ≤ village']) }),
  ]),
  // TAIL-HISTORY-4 batch 5 (the chair's Y16, 2026-11-15; the exports' read X9 30563, 07927, 03878, 03872-03877, 00590, 29930,
  // 08729): THE LASTING EFFECTS THAT NAME A FORCE, AN OFFICE, AN ARCHIVE OR AN ORDINANCE take the place that can hold them
  // (measured on the census's 720 by `factsOf` + `atomHolds`; the atoms read the same at the history's write as on the
  // final record). The watch towers and the muster drills need a force of some kind; a standing office, an archive, a
  // standing council and a levy roster kept in an archive are a town's; two rival congregations need more than a thorp;
  // grain reserves mandated by ordinance are a village's or larger, and under a famine they have not held (the set's
  // second member, reached by the door's argmax as the stone construction's third is). Each takes a twin true where it
  // is refused, on the same slot: draw-free (`generators/history/sizedLastingEffects.js`), the tabs'
  // event card and the exports' history section print the one record field. VETOABLE wording (the owner's).
  "Watch towers and muster drills maintained since the alarm": Object.freeze([
    Object.freeze({ text: "Watch towers and muster drills maintained since the alarm", needs: Object.freeze(['guardPresence']) }),
    Object.freeze({ text: "Every household still knows where to run if the alarm is raised again", twinOf: "Watch towers and muster drills maintained since the alarm", excludes: Object.freeze(['guardPresence']) }),
  ]),
  "A standing levy roster kept ready in the town archive": Object.freeze([
    Object.freeze({ text: "A standing levy roster kept ready in the town archive", needs: Object.freeze(['tier: ≥ town']) }),
    Object.freeze({ text: "The heads of the families still keep count of who could be called on to fight", twinOf: "A standing levy roster kept ready in the town archive", needs: Object.freeze(['tier: ≤ village']) }),
  ]),
  "A standing security office and informant network persist": Object.freeze([
    Object.freeze({ text: "A standing security office and informant network persist", needs: Object.freeze(['tier: ≥ town']) }),
    Object.freeze({ text: "Neighbours still watch one another, and the old informers are not forgotten", twinOf: "A standing security office and informant network persist", needs: Object.freeze(['tier: ≤ village']) }),
  ]),
  "Denunciation records from the panic remain sealed in the archive": Object.freeze([
    Object.freeze({ text: "Denunciation records from the panic remain sealed in the archive", needs: Object.freeze(['tier: ≥ town']) }),
    Object.freeze({ text: "The names denounced in the panic are still remembered, and not forgiven", twinOf: "Denunciation records from the panic remain sealed in the archive", needs: Object.freeze(['tier: ≤ village']) }),
  ]),
  "Two rival congregations still divide the settlement's faithful": Object.freeze([
    Object.freeze({ text: "Two rival congregations still divide the settlement's faithful", needs: Object.freeze(['tier: ≥ hamlet']) }),
    Object.freeze({ text: "The faithful are still divided over how they ought to worship", twinOf: "Two rival congregations still divide the settlement's faithful", needs: Object.freeze(['tier: ≤ thorp']) }),
  ]),
  "Wage disputes settled by a standing arbitration council since founded": Object.freeze([
    Object.freeze({ text: "Wage disputes settled by a standing arbitration council since founded", needs: Object.freeze(['tier: ≥ town']) }),
    Object.freeze({ text: "Wage disputes are still settled by the heads of the families, as they have been since the founding", twinOf: "Wage disputes settled by a standing arbitration council since founded", needs: Object.freeze(['tier: ≤ village']) }),
  ]),
  "Emergency grain reserves mandated by ordinance since the shortage": Object.freeze([
    Object.freeze({ text: "Emergency grain reserves mandated by ordinance since the shortage", needs: Object.freeze(['tier: ≥ village']), excludes: Object.freeze(['crisis: famine']) }),
    Object.freeze({ text: "Grain was put by against lean years after the shortage, and it has not been enough", needs: Object.freeze(['crisis: famine']) }),
    Object.freeze({ text: "Every household has put grain by against lean years since the shortage", twinOf: "Emergency grain reserves mandated by ordinance since the shortage", needs: Object.freeze(['tier: ≤ hamlet']), excludes: Object.freeze(['crisis: famine']) }),
  ]),
  // TAIL-HISTORY-5 batch 6 (the chair's Y17, 2026-11-15; the exports' read X9, the smaller lasting effects): batch 5's form.
  // Price ceilings are a market's (no market: 26 of 51 printing towns); formal council seats, an oversight office, charters
  // lodged with a court and a regency council are a town's (below a town: 7 of 29, 4 of 30, 5 of 25, 6 of 30). Measured on
  // the census's 720 at d7921a40c by `factsOf` + `atomHolds`. Each takes a twin true where it is refused, on the same slot
  // (draw-free: `generators/history/sizedLastingEffects.js`). VETOABLE wording (the owner's).
  "Price ceilings on the affected goods still enforced in lean seasons": Object.freeze([
    Object.freeze({ text: "Price ceilings on the affected goods still enforced in lean seasons", needs: Object.freeze(['market']) }),
    Object.freeze({ text: "In lean seasons the affected goods are still shared out by agreement, not sold to whoever pays most", twinOf: "Price ceilings on the affected goods still enforced in lean seasons", excludes: Object.freeze(['market']) }),
  ]),
  "Council seats now formally split between the old guard and the young": Object.freeze([
    Object.freeze({ text: "Council seats now formally split between the old guard and the young", needs: Object.freeze(['tier: ≥ town']) }),
    Object.freeze({ text: "The old families and the young still quarrel over who speaks for the place", twinOf: "Council seats now formally split between the old guard and the young", needs: Object.freeze(['tier: ≤ village']) }),
  ]),
  "An oversight office was established to audit officials afterward": Object.freeze([
    Object.freeze({ text: "An oversight office was established to audit officials afterward", needs: Object.freeze(['tier: ≥ town']) }),
    Object.freeze({ text: "Since then, whoever handles the common purse has had to show the accounts to the heads of the families", twinOf: "An oversight office was established to audit officials afterward", needs: Object.freeze(['tier: ≤ village']) }),
  ]),
  "Rival charters over the land are both still lodged with the court": Object.freeze([
    Object.freeze({ text: "Rival charters over the land are both still lodged with the court", needs: Object.freeze(['tier: ≥ town']) }),
    Object.freeze({ text: "Rival claims to the land are both still pressed, and no one here has the standing to settle them", twinOf: "Rival charters over the land are both still lodged with the court", needs: Object.freeze(['tier: ≤ village']) }),
  ]),
  "A regency council formed in the interim never fully dissolved": Object.freeze([
    Object.freeze({ text: "A regency council formed in the interim never fully dissolved", needs: Object.freeze(['tier: ≥ town']) }),
    Object.freeze({ text: "Those who held the place in the interim have never quite stopped expecting to be consulted", twinOf: "A regency council formed in the interim never fully dissolved", needs: Object.freeze(['tier: ≤ village']) }),
  ]),
  // TAIL-HISTORY-5 (the chair's Y17 (1), 2026-11-15; the bar's readers at 5d1e3096b, HIGH): THE OCCUPATION'S PAST EVENT
  // UNDER AN OCCUPATION IN FORCE. The timeline keeps an occupation the town lived through (`historyGenerator.js ::
  // HISTORY_TEMPLATE_RECORD_DECLARATIONS`: the past event keeps its account), but the variant "When the occupiers left"
  // says no occupier stands in the town now: under the occupied crisis it takes its twin, which speaks of the LAST
  // occupiers, on the same slot (draw-free: `sizedHistoryText`). Measured on the census's 720 at d7921a40c: 4 of 107
  // printing towns. VETOABLE wording (the owner's).
  "When the occupiers left, they left behind a town of former collaborators and former resisters, none of it ever settled": Object.freeze([
    Object.freeze({ text: "When the occupiers left, they left behind a town of former collaborators and former resisters, none of it ever settled", excludes: Object.freeze(['crisis: occupied']) }),
    Object.freeze({ text: "When the last occupiers left, they left behind a town of former collaborators and former resisters, and none of it was settled before the new occupation came", twinOf: "When the occupiers left, they left behind a town of former collaborators and former resisters, none of it ever settled", needs: Object.freeze(['crisis: occupied']) }),
  ]),
});

/**
 * BAR4-HISTORY C26792 (the chair's grant of 2026-11-16, 07:54): A SEAT THE TOWN ACCEPTS IS NOT "WIDELY QUESTIONED". The
 * legitimacy tension's two forms say the right to rule is openly and widely questioned and that no one can agree who holds a
 * claim, and its hook says no one will speak for those in power unpaid; where the record's own legitimacy reads the seat
 * approved or endorsed (`powerStructure.publicLegitimacy.isApproved`, true of every endorsed seat), each takes its twin,
 * which says what is true there: most accept the seat, and the quarrel is a minority's. VETOABLE wording (the owner's).
 */
export const LEGITIMACY_HELD_TWINS = Object.freeze({
  'The right of the current authority to rule was openly and widely questioned, and no one could agree on who, if anyone, held a legitimate claim':
    'The right of the current authority to rule was openly questioned, and though most here came to accept it, the doubters never quite let the question drop',
  'The right of the current authority to rule is openly and widely questioned, and no one can agree on who, if anyone, holds a legitimate claim':
    "Most here accept the current authority's right to rule, but some question it openly and will not let the question drop",
  'Those in power are paying people to speak for them at the gatherings, because no one will do it for free':
    'Those in power are paying people to speak for them at the gatherings, so that their backers sound louder than the doubters',
});
/** Each twin back to its form (a seat the record does not call approved). */
const LEGITIMACY_HELD_FORMS = Object.freeze(Object.fromEntries(Object.entries(LEGITIMACY_HELD_TWINS).map(([form, twin]) => [twin, form])));
/**
 * The tensions with the legitimacy tension's words read against the seat: its twins where the seat is approved or endorsed,
 * its own forms where it is not (a one-to-one swap, so a later reading undoes an earlier one); the same array where nothing
 * moves. Read at the history step and its section regeneration (`historyGenerator.js :: generateHistory`, the power
 * structure it is handed) and again at assembly, where the legitimacy is final (`power/rosterText.js :: settleTensionsToRoster`).
 * @template {Record<string, any>} T
 * @param {T[]} tensions @param {{ publicLegitimacy?: { isApproved?: boolean } } | null | undefined} powerStructure @returns {T[]}
 */
export const legitimacyHeldTensions = (tensions, powerStructure) => {
  /** @type {Readonly<Record<string, string>>} */
  const swap = powerStructure?.publicLegitimacy?.isApproved === true ? LEGITIMACY_HELD_TWINS : LEGITIMACY_HELD_FORMS;
  let moved = false;
  const next = tensions.map((t) => {
    if (t?.type !== 'legitimacy_crisis') return t;
    const description = swap[String(t.description)] ?? t.description;
    const hooks = Array.isArray(t.plotHooks) ? t.plotHooks.map((/** @type {unknown} */ h) => swap[String(h)] ?? h) : t.plotHooks;
    if (description === t.description && (!Array.isArray(hooks) || hooks.every((h, i) => h === t.plotHooks[i]))) return t;
    moved = true;
    return { ...t, description, ...(Array.isArray(hooks) ? { plotHooks: hooks } : {}) };
  });
  return moved ? next : tensions;
};

/**
 * W2-FIX-DATA-HISTORY item C (2026-11-13; the review of the data lane, L4; ROUND-3-CUT-INCREMENT ww-254, ww-724, ww-752,
 * ww-754, ww-755, ww-756): A TENSION THAT IS ITS OWN PAST'S LEGACY NEEDS THAT PAST ON THE TIMELINE. The occupation's
 * legacy speaks of collaborators and resisters, of wartime fortunes and records kept by resistance fighters, and of a
 * former occupier officer: every one of its words presumes an occupation the town lived through. Where the town's own
 * timeline holds no occupation it printed all the same (a thorp of five under a siege; a city whose past is a religious
 * conflict, an economic divide and a great fire). The chair's ruling: a history line speaks of an event only where the
 * town's own timeline holds it. Such a tension is set aside at the selection exactly as a refused template is (the
 * selection's own loop, R-Q), read by the event's identity on the timeline (`templateType`, as
 * `historyGenerator.js :: tensionByMemory` reads it). Its memory words for an absent event (`byMemory.unanchored`) are
 * kept in the table and reached by no town.
 */
export const TENSIONS_THAT_NEED_THEIR_OWN_EVENT = Object.freeze(['occupation_legacy']);

/**
 * May this tension stand beside this timeline? @param {{ type?: string }} tmpl @param {ReadonlyArray<any>} timeline
 * @returns {boolean}
 */
export const tensionHeldByTimeline = (tmpl, timeline) => !TENSIONS_THAT_NEED_THEIR_OWN_EVENT.includes(String(tmpl?.type))
  || (Array.isArray(timeline) ? timeline : []).some((e) => e?.templateType === tmpl.type);

/**
 * W2-FIX-DATA-HISTORY item L (2026-11-13; the first cut's #267, round two's #368; ROUND-3-CUT-INCREMENT ww-1489): THE
 * SHORTAGE'S LEAD READS THE INCOME SHARES. "Life here runs mostly on the timber trade" printed where timber was 8 per cent
 * of the town's income, and "mostly on the wool trade" in a thorp that earns nothing from wool: the commodity is the first
 * export's (`tradeCommodity.js :: deriveTradeCommodity`), and the lead never read what the town lives on. The chair's
 * ruling: a lead that says what a town lives on reads the record's own income shares (`economicState.incomeSources`,
 * each a source and its percentage); "mostly" only where that source is the largest and more than half; the largest
 * named as the largest where it is half or less; "among the trades" where it is a lesser one; where no income source is
 * the commodity's trade, no lead (the issue that follows stands alone). Draw-free. VETOABLE wording (the owner's).
 * Each commodity's own income source, by the economy's labels (`economy/economicState.js`).
 */
export const LIVELIHOOD_INCOME_SOURCE = Object.freeze({
  timber: /^Timber Trade$/, grain: /^Grain Sales$/, fish: /^Fish & /, wool: /^Wool & Textile Trade$/, iron: /^Iron & Metalwork$/,
  stone: /^Stone Quarrying$/, alchemy: /^Apothecary & Alchemy$/, 'medicinal herbs': /^Herbalist & Apothecary$/,
});

/**
 * @param {string | null | undefined} commodity the first export's commodity
 * @param {ReadonlyArray<{ source?: unknown, percentage?: unknown }> | null | undefined} incomeSources
 * @returns {string} the lead, or '' where the town's income holds no source of that trade
 */
export const livelihoodLead = (commodity, incomeSources) => {
  const own = commodity ? LIVELIHOOD_INCOME_SOURCE[/** @type {keyof typeof LIVELIHOOD_INCOME_SOURCE} */ (commodity)] : null;
  const rows = (Array.isArray(incomeSources) ? incomeSources : []).filter((r) => typeof r?.source === 'string' && Number.isFinite(Number(r?.percentage)));
  const mine = own ? rows.filter((r) => own.test(String(r.source))) : [];
  if (!mine.length) return '';
  const share = Math.max(...mine.map((r) => Number(r.percentage)));
  const largest = Math.max(...rows.map((r) => Number(r.percentage)));
  if (share < largest) return `Among the trades the place lives by, the ${commodity} trade is under strain.`;
  return share > 50 ? `Life here runs mostly on the ${commodity} trade, and that trade is under strain.` : `The ${commodity} trade is the largest the place lives by, and it is under strain.`;
};

/**
 * W2-FIX-DATA-HISTORY item E: a resource event's texts, each resolved through the declared door over
 * `HISTORY_DESC_SIBLINGS` against the history's facts: the description takes its twin where refused; a lasting effect or a
 * hook takes its twin, else is dropped. Draw-free (the event was drawn already). Called where the event is written
 * (`historyGenerator.js :: generateRelationshipEvent`).
 * @template {{ description?: string, lastingEffects?: string[], plotHooks?: string[] }} E
 * @param {E} event @param {object | (() => object) | null} facts @returns {E}
 */
export const sizedResourceEvent = (event, facts) => {
  const opts = { facts, poolId: 'historyData:HISTORY_DESC_SIBLINGS', surface: 'history', drawKind: /** @type {const} */ ('T') };
  const list = (/** @type {unknown} */ xs) => (Array.isArray(xs) ? xs.map((x) => resolveSibling(x, HISTORY_DESC_SIBLINGS, { ...opts, dropRefused: true })).filter((x) => x != null) : xs);
  return { ...event, description: resolveSibling(event.description, HISTORY_DESC_SIBLINGS, opts), lastingEffects: list(event.lastingEffects), plotHooks: list(event.plotHooks) };
};

