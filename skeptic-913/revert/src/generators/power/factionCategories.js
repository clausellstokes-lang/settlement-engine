/**
 * power/factionCategories.js — map a faction NAME to its category via keyword
 * lists, for power/economy correlation and faction tagging.
 *
 * MG-3h (chair ruling R-BLD-5): the `magic` bucket specifically no longer decides by raw
 * keyword. domain/arcaneIdentity.js is the canonical detector — the authored faction
 * catalog's category key is the tag, and keywords are a fallback for non-catalog names
 * only, split into a certain tier and an ambiguous one. Every other bucket is untouched.
 */

import {
  factionCatalogArcaneTag,
  resolveArcaneIdentity,
} from '../../domain/arcaneIdentity.js';

/** Tokens that mean arcane on their own — the unambiguous half of the old magic list. */
const MAGIC_CERTAIN_KEYWORDS = [
  'Arcane', 'Mage', 'Wizard', 'Sorcerer', 'Alchemist', 'Occult', 'Hedge', 'Enchant', 'Spellcast',
];

/** Tokens that are arcane only where the text also asserts magic works. */
const MAGIC_AMBIGUOUS_KEYWORDS = ['Tower'];

// Deliberately CASE-SENSITIVE, exactly as `factionName.includes(kw)` was: these keywords
// are authored Title-Case tokens, and adding an `i` flag here would silently widen every
// bucket's matching. The split is the only change to this vocabulary.
const MAGIC_CERTAIN_RE = new RegExp(MAGIC_CERTAIN_KEYWORDS.join('|'));
const MAGIC_AMBIGUOUS_RE = new RegExp(MAGIC_AMBIGUOUS_KEYWORDS.join('|'));

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
  // MG-3h / R-BLD-5: this list is SPLIT, not shortened. MAGIC_CERTAIN_KEYWORDS below
  // carries every token that means arcane on its own; 'Tower' moved to the ambiguous tier
  // (a tower is masonry) and now classifies only for a NON-CATALOG name whose text also
  // asserts that magic works. The membership of the union is unchanged.
  magic: MAGIC_CERTAIN_KEYWORDS,
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
  const catalogTag = factionCatalogArcaneTag(factionName);
  for (const [cat, keywords] of Object.entries(FACTION_CATEGORY_KEYWORDS)) {
    // The magic bucket keeps its ORDERING slot (it is tested before economy, so an
    // "Alchemists' Guild" is magic and not a guild) but the authored catalog tag answers
    // first. A catalog faction filed under any other category is MUNDANE here no matter
    // what its name contains; a non-catalog name falls through to the certain/ambiguous
    // keyword law, where 'Tower' alone no longer makes a stonemasons' bloc arcane.
    if (cat === 'magic') {
      if (resolveArcaneIdentity(catalogTag, factionName, {
        certain: MAGIC_CERTAIN_RE,
        ambiguous: MAGIC_AMBIGUOUS_RE,
      })) return cat;
      continue;
    }
    if (keywords.some((kw) => factionName.includes(kw))) return cat;
  }
  return 'other'; // changed: 'other' not 'government' — prevents governing dump
};
