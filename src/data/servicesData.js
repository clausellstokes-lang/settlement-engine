// servicesData.js — Static service data (institution → service overrides).
// Extracted from servicesGenerator.js (was inline module-scope data)

// ── Locale service overrides ──────────────────────────────────────────────────
// Maps institution name variants → canonical INSTITUTION_SERVICES key.
//
// FALLBACK ONLY: getServicesForInstitution resolves a dedicated
// INSTITUTION_SERVICES entry (exact name, case-insensitive) BEFORE consulting
// this table, so a row here is live only while its source institution has no
// dedicated entry. Two invariants, enforced by tests/joins/services.test.js:
//   1. every target must exist as an INSTITUTION_SERVICES key;
//   2. no source may shadow a dedicated INSTITUTION_SERVICES entry — such a
//      row is dead weight and must be deleted (give the institution its own
//      entry instead of redirecting it).

// Shared phrases hoisted once (train EM-T16's worker buy-back, judgment 214c): each is spelled here and referenced below; every emitted value is byte-identical.
const SPELLCASTING_SERVICES = "Spellcasting Services";

// ⚠ A PROXY IS NOT A PROVIDER (RS-19, 2026-10-30; lane REVIEW-INTAKE unit 2, 2026-11-06).
// The housing/water/farm/prison rows that once borrowed an inn's, a courthouse's or a mill's
// menu here (PROXY_SERVICE_HOSTS) now own their entries in INSTITUTION_SERVICES, so a
// service row's `institution` is always the house that really offers it. Do not re-add a
// redirect for a house that offers nothing: give it its own (possibly empty) entry.

export const LOCALE_SERVICE_OVERRIDES = {
  // Lodging & hospitality variants
  "hospitality district": "Inn/Tavern District",
  tavern: "Inn/Tavern",
  alehouse: "Inn/Tavern",
  "wayside inn": "Inn/Tavern",
  // Religious variants
  "multiple cathedrals": "Church/Temple",
  "resurrection services (10,000+ only)": "Church/Temple",
  "curse breaking": "Church/Temple",
  shrine: "Church/Temple",
  // Markets & trade
  "international trade center": "Market",
  "district markets (5-10)": "Market",
  "periodic market": "Market",
  "merchant guilds (50-100+)": "Guild Hall",
  "merchant guilds (100+)": "Guild Hall",
  "specialist craftsmen quarters": "Specialist Craftsmen",
  "magical banking (high magic)": "Banking district",
  "stock exchange (early)": "Banking district",
  // Law, defence & hire
  "multiple courthouses": "Courthouse",
  "professional guard (hundreds)": "Garrison",
  "mercenary company hq": "Mercenary quarter",
  "navy (if coastal)": "Navy",
  "adventurers' guild hall": "Adventurers Guild",
  // Arcane
  "multiple wizard towers": "Wizard Tower",
  "spellcasting services (1st-4th level)": SPELLCASTING_SERVICES,
  "spellcasting services (1st-6th level)": SPELLCASTING_SERVICES,
  "spellcasting services (1st-8th level)": SPELLCASTING_SERVICES,
  "magic item consignment": "Magic Item",
  // Entertainment & learning
  "professional arena": "Arena",
  "sage/library": "Great library",
};
