/**
 * domain/facts/scoreBandCuts.js — THE DEFENCE SCORE'S THREE CUT POINTS, ZERO-IMPORT (BAR6-DEFDESK; the chair's ruling EG1).
 *
 * The frozen table `display/defenseScoreBands.js :: SCORE_BAND_CUTS` was written in (ODQ §934.14: written once, because
 * spelling the cuts twice is how they drifted), moved here VERBATIM so that a fact home in the eager engine core can read
 * the band a defence score prints without reaching the lazily pinned display leaf (`tests/architecture/engineCoreLazyEdge
 * .test.js`). `defenseScoreBands.js` re-exports this same object; `scoreBand`, `scoreColor` and every reader of the
 * table there read it unchanged. Read here by `monsterFrontier.js`.
 *
 * Pure data: no randomness, no clock, no write.
 *
 * @type {Readonly<{ strong: number, adequate: number, weak: number }>}
 */
export const SCORE_BAND_CUTS = Object.freeze({ strong: 65, adequate: 40, weak: 20 });
