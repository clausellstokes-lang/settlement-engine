/**
 * power/factionCategories.js — map a faction NAME to its category via keyword
 * lists, for power/economy correlation and faction tagging.
 */

// inferFactionCategory — map faction name → category for economy correlation
const FACTION_CATEGORY_KEYWORDS = {
  military: [
    'Military',
    'Guard',
    'War Council',
    'Garrison',
    'Mercenary',
    'Occupation',
    'Resistance',
    'Monster Hunter',
    'Adventurer',
    'Charter',
    'Watch',
    'Knight',
    'Soldier',
    'Huscarl',
    'Huskarl',
    'Hird',
  ],
  religious: [
    'Religious',
    'Faith',
    'Church',
    'Temple',
    'Congregation',
    'Shrine',
    'Clergy',
    'Conversion',
    'Old Faith',
    'Ecclesiastical',
    'Diocese',
    'Bishop',
    'Patriarch',
    'Holy',
    'Theocrat',
    'Priestly',
    'Devout',
    'Friar',
    'Monastery',
    'Cathedral',
  ],
  criminal: [
    'Thiev',
    'Criminal',
    'Smuggl',
    'Underground',
    'Cartel',
    'Corrupt',
    'Bandit',
    'Assassin',
    'Shadow',
    'Hidden Hand',
    'Black Circle',
    'Underworld',
  ],
  magic: ['Arcane', 'Mage', 'Wizard', 'Sorcerer', 'Alchemist', 'Occult', 'Hedge', 'Enchant', 'Tower', 'Spellcast'],
  economy: [
    'Merchant',
    'Craft',
    'Guild',
    'Trade',
    'Market',
    'Banking',
    'Grain',
    'Farmer',
    'Cloth',
    'Commerce',
    'Factor',
    'Artisan',
    'Ledger',
    'Compact',
    'Consortium',
    'Oligarch',
  ],
  government: [
    'Council',
    'Authority',
    'Administration',
    'Governor',
    'Steward',
    'Assembly',
    'Senate',
    'Civic',
    'Municipal',
    'Electoral',
    'Democratic',
    'Alderman',
    'Magistrate',
    'Court',
    'Chancery',
  ],
  noble: [
    'Noble',
    'Aristocrat',
    'Lord',
    'Lady',
    'Manor',
    'Landed',
    'Gentry',
    'Feudal',
    'Ducal',
    'Royal',
    'House',
    'Estate',
    'Heritage',
    // domain-7: succession/political blocs the stress injector mints — 'Bloc' was
    // dropped from economy (it shadowed 'Noble'), so the claimant/loyalist
    // succession factions now classify as the aristocratic-political factions they
    // are ('Claimant Bloc A/B', 'Loyalist Noble Bloc') instead of 'economy'.
    'Claimant',
    'Loyalist',
  ],
};

export const inferFactionCategory = (factionName) => {
  for (const [cat, keywords] of Object.entries(FACTION_CATEGORY_KEYWORDS)) {
    if (keywords.some((kw) => factionName.includes(kw))) return cat;
  }
  return 'other'; // changed: 'other' not 'government' — prevents governing dump
};
