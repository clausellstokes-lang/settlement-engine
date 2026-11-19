/**
 * domain/facts/monsterFrontier.js — THE BEASTS THE PAGE ITSELF CALLS A THREAT (BAR6-DEFDESK, LAW 7's `7a-nothreat`;
 * BRIEF-BAR6 B6: a new atom beside `danger coming`, vetoable by the owner, on the veto list as new vocabulary).
 *
 * A REGIONAL MONSTER THREAT IS A FRONTIER CONDITION AND NO CRISIS: the crisis record's threat family (`no threat`)
 * does not see it, and neither does the history's external-threat tension (`danger coming`). The page states it in
 * two places, and this leaf reads both, once:
 *   - plagued country: the Power tab's stability label "Tense — regional monster threat"
 *     (`governanceNarrative.js :: annotateMonsterThreat`), whatever the town keeps against it;
 *   - frontier country under a Beasts & Monsters band the Defense tab prints Weak or Critical
 *     (`threatAssessment.js`: `scoreBand(scores.monster)`), read here as below `SCORE_BAND_CUTS.adequate` (`scoreBandCuts.js`).
 * A line that says nothing threatens the town that a wall would keep out presumes its absence (REVIEW-WIDE-6, the
 * 7a rows: "Ribatchowk has no wall, and nothing threatens it now that a wall would keep out." beside
 * "Beasts & Monsters · Critical" in frontier country).
 *
 *   monsterFrontierOf(record)  THE ONE READER: true where the page itself prints the beasts as a threat
 *
 * Layer 3 (the config, layer 0, and the defence profile's monster score, layer 2). Pure: no randomness, no clock,
 * no write.
 *
 * @enforced-by tests/domain/bar6DefDeskGuards.test.js
 */
import { normalizeMonsterThreat } from '../../data/monsterThreat.js';
import { SCORE_BAND_CUTS } from './scoreBandCuts.js'; // the chair's ruling EG1: the cuts, zero-import (no pinned module)

/**
 * Does the page itself print the country's beasts as a threat to the town?
 * @param {unknown} record the settlement record
 * @returns {boolean}
 */
export function monsterFrontierOf(record) {
  const r = record && typeof record === 'object'
    ? /** @type {{ config?: { monsterThreat?: unknown }, defenseProfile?: { scores?: { monster?: unknown } } }} */ (record) : {};
  const raw = r.config?.monsterThreat;
  if (typeof raw !== 'string' || !raw) return false; // no recorded country: the page names no beasts (`measuredMonsterFamily`)
  const family = normalizeMonsterThreat(raw);
  if (family === 'plagued') return true;
  if (family !== 'frontier') return false;
  const score = r.defenseProfile?.scores?.monster;
  // Weak or Critical as `defenseScoreBands.js :: scoreBand` prints it: below the Adequate cut
  return (typeof score === 'number' && Number.isFinite(score) ? score : 0) < SCORE_BAND_CUTS.adequate;
}
