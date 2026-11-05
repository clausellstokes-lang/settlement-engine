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

// ── DECLARED SIBLINGS, CARRIED (CENSUS-5b unit 2, 2026-11-05; the chair's ruling R-C) ────────
// A faction NAME that names a force or a house presumes it ("The Garrison Bloc" where no garrison
// stands). The names stay strings above (the dedup pass, the arcane detector and the first-unused
// reader all read strings); each is declared here, keyed by the name. NO CONSUMER READS THIS YET:
// `generateFactions` draws through a draw-count-VARIABLE retry loop and `applyDensityLaw` and
// `stressFactions :: firstUnusedPoolName` read by position — CENSUS-1d's R sites, never filtered
// before the draw. No twin: a twin name is an addition that moves the R stream's births (R-G, the
// chair's to price). Measured on the 1,000: "The Garrison Bloc" and "The Order of the Watch"
// printed in 29 places each, false in none. The magic pools' names presume magic that works.
/** @param {string} text @param {string[]} needs */
const declaredName = (text, needs) => Object.freeze([Object.freeze({ text, needs: Object.freeze(needs) })]);
export const FACTION_NAME_SIBLINGS = Object.freeze({
  'The Garrison Bloc': declaredName('The Garrison Bloc', ['garrison']),
  'The Order of the Watch': declaredName('The Order of the Watch', ['watch']),
  'The Garrison Order': declaredName('The Garrison Order', ['garrison']),
  "The Watchmen's Company": declaredName("The Watchmen's Company", ['watch']),
  'The Mercenary Compact': declaredName('The Mercenary Compact', ['mercenary']),
  "The Soldiers' League": declaredName("The Soldiers' League", ['soldiers']),
  'The Temple Union': declaredName('The Temple Union', ['temple']),
  'The Arcane Circle': declaredName('The Arcane Circle', ['magic']),
  "The Mages' Compact": declaredName("The Mages' Compact", ['magic']),
  'The Enlightened': declaredName('The Enlightened', ['magic']),
  'The Tower Alliance': declaredName('The Tower Alliance', ['magic']),
  "The Mages' Conclave": declaredName("The Mages' Conclave", ['magic']),
  'The Arcane Order': declaredName('The Arcane Order', ['magic']),
  "The Wizards' League": declaredName("The Wizards' League", ['magic']),
  'The Tower Union': declaredName('The Tower Union', ['magic']),
  "The Alchemists' Circle": declaredName("The Alchemists' Circle", ['magic']),
  "The Sorcerers' Compact": declaredName("The Sorcerers' Compact", ['magic']),
});
