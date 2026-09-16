/**
 * defenseScoreBands — THE ONE ladder for a 0-100 defence-system score.
 *
 * Wave R-5b item #20 (stat-bars: bands over raw numbers). Every surface that
 * shows a `defenseProfile.scores.*` value reads its BAND WORD and its colour
 * from here, so the same number can never read as two different verdicts on
 * two different tabs. Before this leaf existed the ladder was spelled three
 * times with two different threshold sets: DefenseTab's local scoreBadge /
 * scoreColor (65/40/20), defenseDisplay's private twins (65/40/20), and the
 * OverviewTab + SummaryTab colour-only ladders (70/45/25). The 65/40/20 set
 * wins because it is the one the PDF already prints through
 * deriveDefenseReadiness, so adopting it moved the screen to the PDF rather
 * than the other way round.
 *
 * LEGIBILITY LAW: the reader gets the word, never the digit. The bar keeps
 * carrying the magnitude visually; the label carries the meaning. The four
 * words are the EXISTING readiness vocabulary (they are what the Threat
 * Assessment badges and the PDF readiness rows have always printed) — this
 * leaf moves them, it does not mint them.
 *
 * Pure, dependency-free, and deliberately tiny: it is imported by three lazy
 * dossier chunks plus defenseDisplay, and pulling the much larger
 * defenseDisplay (and its threatAssessment dependency) into OverviewTab's
 * chunk just to reach two arrow functions would be a chunking regression.
 */

/**
 * Band colour for a 0-100 defence-system score.
 * @type {(n: number) => string}
 */
export const scoreColor = (n) =>
  n >= 65 ? '#1a5a28' : n >= 40 ? '#a0762a' : n >= 20 ? '#8a4010' : '#8b1a1a';

/**
 * Band word for a 0-100 defence-system score. The frozen four; never extend.
 * @type {(n: number) => string}
 */
export const scoreBand = (n) =>
  n >= 65 ? 'STRONG' : n >= 40 ? 'ADEQUATE' : n >= 20 ? 'WEAK' : 'CRITICAL';
