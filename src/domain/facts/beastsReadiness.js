/**
 * domain/facts/beastsReadiness.js — THE BEASTS GRADE, READ AGAINST THE NEED (the tenth chair's RULING G22 on C6 (A), "P9";
 * the class table's pattern 9: a "Critical" beasts grade printed over the settled-country reassurance; first built by
 * W2-A-LEAVES, 2026-11-12, as the reader of both sides).
 *
 * The defence profile's monster score is a READINESS: the forces that stand, plus a ground and a penalty the threat tier
 * sets (`defenseGenerator.js`; `data/defenceWeights.js :: DEFENCE_TUNING.threat`, which gives settled country neither).
 * A quiet heartland place with nobody under arms scores 0 and printed CRITICAL beside the line that says, truly, that
 * its country sends little a wall would be wanted for: a rating low because the place is small and its country quiet is
 * no danger. So IN SETTLED COUNTRY THE GRADE IS READ AGAINST THE NEED: no lower than ADEQUATE (the country itself meets
 * what it asks). Frontier and plagued country are read as stored; a place with real forces keeps its higher grade; the
 * STORED score never moves (nothing the simulator reads changes).
 *
 * THE ONE READER of the beasts grade for every printer (the Defense tab's row, `threatAssessment.js`, `defenseDisplay.js`
 * for the PDF, the Overview's Monster Defense bar, DS-GEN-3's band key, the PDF overview's scores): enforced by
 * `tests/lint/beastsGradeOneReader.walker.test.js`. The 2026-11-12 ruling's "own authored situation" for settled
 * country graded weak is withdrawn by G22: no new words, and no `settledAndWeak` branch.
 *
 * Layer 3 (the config, layer 0, and the defence profile, layer 2). Pure: no randomness, no clock, no write. Its imports
 * are the threat tier's own data and the score ladder (no state-prose corpus).
 */
import { normalizeMonsterThreat } from '../../data/monsterThreat.js';
import { SCORE_BAND_CUTS } from './scoreBandCuts.js';
import { scoreBand } from '../display/defenseScoreBands.js';

/**
 * @typedef {{ config?: { monsterThreat?: unknown }, defenseProfile?: { scores?: Record<string, unknown> } }} BeastsRecord
 */

/**
 * @param {unknown} record a settlement record
 * @returns {{ settled: boolean, score: number, shownScore: number, grade: string }} `score` as stored; `shownScore` and
 *   `grade` as every printer prints them
 */
export function beastsReadinessOf(record) {
  const r = record && typeof record === 'object' ? /** @type {BeastsRecord} */ (record) : {};
  const raw = r.config?.monsterThreat;
  // settled country: the tier the corpus calls settled (`defenseStateProse.js :: measuredMonsterFamily`: heartland);
  // no recorded tier reads as no country, as that reader reads it
  const settled = typeof raw === 'string' && raw !== '' && normalizeMonsterThreat(raw) === 'heartland';
  const stored = r.defenseProfile?.scores?.monster;
  const score = typeof stored === 'number' && Number.isFinite(stored) ? stored : 0;
  const shownScore = settled ? Math.max(score, SCORE_BAND_CUTS.adequate) : score;
  return { settled, score, shownScore, grade: scoreBand(shownScore) };
}

/**
 * The defence profile's scores as the page prints them: the same bag with the monster score read against the need, for
 * a printer that bands every score (the Overview's Systems Health, DS-GEN-3, the PDF overview). A record with no scores
 * gives what it holds (no bag is invented).
 * @template {Record<string, unknown> | null | undefined} S
 * @param {unknown} record @param {S} scores the record's `defenseProfile.scores` @returns {S}
 */
export function scoresAsShown(record, scores) {
  if (!scores || typeof scores !== 'object' || !('monster' in scores)) return scores;
  // P9b-2 (the tenth chair's G68 (P2)): a stored monster score that is not a number is passed through as it is, never made
  // one (settled country read it as 0 and printed the adequate cut, so a mean that was null became 40 and the PDF's
  // defence headline spoke where it was silent)
  const stored = /** @type {Record<string, unknown>} */ (scores).monster;
  if (typeof stored !== 'number' || !Number.isFinite(stored)) return scores;
  const { shownScore, score } = beastsReadinessOf(record);
  return shownScore === score ? scores : /** @type {S} */ ({ ...scores, monster: shownScore });
}
