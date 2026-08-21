/**
 * domain/deityConstants.js — dependency-free deity tuning constants.
 *
 * SINGLE SOURCE of DEITY_RANK_AUTHORITY (major/minor/cult → religious_authority
 * lift). A TRUE LEAF like deterministicSort.js: it imports NOTHING — not from
 * display/, not from worldPulse/, not from any other domain module — so both of
 * its consumers can read it without creating an import cycle:
 *
 *   - domain/causalState.js (the engine application: deriveReligiousAuthority's
 *     deity term) imports it here directly. Importing via display/deityEffects.js
 *     instead would close the causalState > deityEffects > magicProfile >
 *     causalState cycle (deityEffects re-exports magicProfile's deity-magic
 *     constants, and magicProfile reads deriveCausalState) — the exact widening
 *     the shrink-only layer-boundary baseline refused.
 *   - domain/display/deityEffects.js RE-EXPORTS it for display consumers (the
 *     Compendium effect-preview / dossier Faith-Effects surface), exactly like it
 *     re-exports the other engine couplings. Existing display-side imports are
 *     unchanged, and the referential-identity pin in
 *     tests/domain/display/deityEffects.test.js proves the re-export is this
 *     object, never a hand-copied drift.
 *
 * Semantics: a major god is a pillar of the pantheon; a cult is a fringe
 * following. A rankAxis absent from this map contributes NO deity term (the
 * dormancy guarantee — a deity-free settlement never reads any of this).
 *
 * Pure data — frozen so a typo'd key reads as `undefined`, not a silent miss.
 */

export const DEITY_RANK_AUTHORITY = Object.freeze({ major: 18, minor: 10, cult: 5 });
