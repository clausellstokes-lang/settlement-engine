// powerData.js — extracted from bundle
//
// THE AUTHORED FACTION-NAME CATALOG. Both pools below are AUTHORED CONTENT keyed by
// category, and the category key IS the authored tag: a name filed under `magic` is an
// arcane faction because a human said so, which is why domain/arcaneIdentity.js reads
// these tables instead of guessing from a name regex (chair ruling R-BLD-5).

export const FACTION_DESCRIPTORS = {
  economy: [
    "The Trade Compact",
    "The Merchant Bloc",
    "The Guild Alliance",
    "The Commercial Circle",
  ],
  government: [
    "The Governing Council",
    "The Establishment",
    "The Civic Authority",
    "The Administrative Circle",
  ],
  military: [
    "The Garrison Bloc",
    "The Order of the Watch",
    "The Martial Alliance",
    "The Shield Compact",
  ],
  religious: [
    "The Faithful Assembly",
    "The Devout Circle",
    "The Clergy Alliance",
    "The Holy Compact",
  ],
  magic: [
    "The Arcane Circle",
    "The Mages' Compact",
    "The Enlightened",
    "The Tower Alliance",
  ],
  criminal: [
    "The Hidden Hand",
    "The Shadow Compact",
    "The Underground",
    "The Black Circle",
  ],
  crafts: [
    "The Artisans' Compact",
    "The Craftsmen's League",
    "The Makers' Guild-Alliance",
    "The Artificers' Circle",
  ],
  noble: [
    "The Highborn Circle",
    "The Peerage",
    "The Old Houses",
    "The Landed Bloc",
  ],
  other: [
    "The Independent Bloc",
    "The Free Alliance",
    "The Common Interest",
    "The Grey Council",
  ],
};

// ── THE WIDENED, DEDUP-ONLY POOL ─────────────────────────────────────────────
// Authored for lib/instantWorld/factionDedup.js (which re-exports it), and read here by
// domain/arcaneIdentity.js for its authored category tag.
//
// ⚠️ DEDUP-ONLY, NEVER MERGED INTO FACTION_DESCRIPTORS ABOVE: generateFactions draws
// per-settlement names from FACTION_DESCRIPTORS through a draw-count-VARIABLE retry loop,
// so widening THAT table would perturb the per-settlement rng stream and cascade the
// generator golden. The dedup pass is rng-free and runs only on the composed bundle, so
// these extras touch nothing in per-settlement generation. Living in the data layer beside
// the pool they widen changes neither fact — it only lets the canonical arcane detector
// read the same authored tag the dedup pass reads.
//
// Each extra contains its OWN category keyword (or, for 'other'/crafts, no other
// category's keyword) so inferFactionCategory(name) stays in {thatCategory, 'other'} —
// a rename never mis-assigns a faction to a WRONG specific category (guarded by a test).
export const FACTION_DESCRIPTORS_EXTRA = Object.freeze({
  economy: ["The Merchants' Consortium", 'The Trade Syndicate', 'The Market Guild', 'The Ledger Houses', 'The Commerce League', "The Factors' Union"],
  government: ['The Civic Assembly', 'The Municipal Council', "The Magistrates' Court", 'The Chancery Bench', "The Aldermen's Board", "The Governors' Seat"],
  military: ['The Guard Union', 'The Garrison Order', "The Knights' Charter", "The Soldiers' League", "The Watchmen's Company", 'The Mercenary Compact'],
  religious: ['The Temple Union', 'The Congregation League', 'The Ecclesiastical Council', 'The Faithful Order', 'The Devout League', 'The Clergy Chapter'],
  magic: ["The Mages' Conclave", 'The Arcane Order', "The Wizards' League", 'The Tower Union', "The Alchemists' Circle", "The Sorcerers' Compact"],
  criminal: ["The Thieves' Union", 'The Shadow League', 'The Underworld Compact', "The Smugglers' Ring", 'The Cartel', "The Assassins' Circle"],
  crafts: ["The Craftsmen's Union", "The Artisans' League", "The Makers' Compact", 'The Guild of Artificers', 'The Craft Consortium', "The Journeymen's Circle"],
  noble: ['The Noble Houses', 'The Landed Gentry', 'The Manor Bloc', 'The Aristocratic Circle', 'The Feudal Order', 'The Heritage Houses'],
  other: ['The Independent Circle', 'The Free League', 'The Common Union', 'The Neutral Bloc', 'The Popular Front', 'The Unaligned Bloc'],
});
