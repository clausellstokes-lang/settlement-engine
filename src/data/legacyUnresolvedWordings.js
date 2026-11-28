/**
 * legacyUnresolvedWordings.js — THE LEGACY GENERATOR'S OWN "NEVER PUT RIGHT" WORDINGS, in one frozen list (FORTUNE U5a,
 * the chair's condition 4 and ruling (B) of 2026-11-20 18:38 UTC).
 *
 * `src/generators/legacyGenerator.js :: annotationBody` builds its unresolved line ("… left trouble that has never
 * been put right: …") FROM this list and re-exports it; `src/domain/fortune/fortuneMerits.js` reads an annotation as
 * unresolved only by this list (no regex, no copy), so a re-voiced line is read by both or by neither. A leaf below
 * both layers, because a domain module may not import a generator (tests/build/domainGeneratorsBoundary.test.js).
 *
 * ⛔ CHANGING A WORDING MOVES BORN TEXT (every unresolved legacy line) AND, UNDER THE FORTUNE LAW, STANDING: it is a
 * golden-moving edit, never a tidy-up. Pinned by tests/domain/fortuneMeritsPredicates.test.js (arm (e)).
 *
 * Pure data. Imports nothing.
 */

/** The unresolved arm's wordings, today one. @type {ReadonlyArray<string>} */
export const UNRESOLVED_LEGACY_WORDINGS = Object.freeze(['left trouble that has never been put right']);
