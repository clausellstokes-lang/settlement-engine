/**
 * data/categoryVocabulary.js — the two institution classification axes.
 *
 * SettlementForge classifies an institution on TWO independent axes, and they
 * are independent ON PURPOSE — they are NOT a single vocabulary that has drifted,
 * so do not "reconcile" or collapse them into one:
 *
 *   1. GROUPING  (institution.category, TitleCase) — the *shelf*: how the
 *      institution is grouped for display and cascade seeding (Economy, Crafts,
 *      Religious, Defense, …). Set from the catalog's second-level key
 *      (institutionalCatalog[tier][GROUPING]).
 *
 *   2. PRIORITY CATEGORY  (institution.priorityCategory, lowercase) — the
 *      *political / economic faction role* the institution actually plays
 *      (economy, government, military, religion, …). Hand-typed per catalog
 *      entry because it does NOT follow from the shelf: a Crafts-grouped masons'
 *      guild can be a 'government' faction; an Economy-grouped armoury can be
 *      'military'. ~1/3 of catalog entries deliberately diverge from their
 *      grouping on this axis — that divergence is data, not drift.
 *
 * Faction roles (powerData.FACTION_DESCRIPTORS) are matched against EITHER axis
 * — see the OR-chain in economicGenerator.js (`i.priorityCategory === role ||
 * i.category?.toLowerCase() === role`). Clause 1 matches the semantic
 * priorityCategory; clause 2 matches the grouping. BOTH clauses are required:
 * some roles name the GROUPING token while the entry's priorityCategory uses a
 * different token — e.g. the 'religious' role is carried by the 'Religious'
 * GROUPING (entries there are priorityCategory 'religion', which would never
 * match 'religious'), while the 'military' role is carried by priorityCategory
 * 'military' (the grouping is 'Defense', which would never match 'military').
 * Collapsing the two axes into one token would silently drop those matches.
 *
 * This file is the canonical declaration of both vocabularies; the catalog,
 * the cascade grouping list (cascadeGenerator CATS), and the faction-role set
 * are all pinned to conform to it by tests/data/categoryGovernance.test.js, so
 * a freelance grouping key, a typo'd priorityCategory, or a faction role that
 * can no longer match any institution is caught at the gate instead of silently
 * producing an empty match.
 */

// Axis 1 — the display/cascade "shelf". Exactly the second-level keys the
// institutionalCatalog uses. (cascadeGenerator's CATS additionally reserves
// 'Essential', a key no catalog tier currently populates — a documented
// superset, pinned as such.)
export const INSTITUTION_GROUPINGS = Object.freeze([
  'Adventuring',
  'Crafts',
  'Criminal',
  'Defense',
  'Economy',
  'Entertainment',
  'Exotic',
  'Government',
  'Infrastructure',
  'Magic',
  'Religious',
]);

// Axis 2 — the political/economic faction role. Every catalog entry's
// priorityCategory (when present) must be one of these. A handful of pure
// physical-structure entries (e.g. "Palisade or earthworks") carry NO
// priorityCategory by design — they are fortifications, not factions — and are
// allowlisted in the governance pin rather than forced onto this axis.
export const PRIORITY_CATEGORIES = Object.freeze([
  'adventuring',
  'crafts',
  'criminal',
  // 'defense' is a deliberate one-off: a single Infrastructure-grouped entry is
  // classed 'defense' rather than 'military' (the roadmap's "lone outlier").
  // It is a valid faction-role token, distinct from the 'Defense' GROUPING.
  'defense',
  'economy',
  'entertainment',
  'exotic',
  'government',
  'infrastructure',
  'magic',
  'military',
  'religion',
]);
