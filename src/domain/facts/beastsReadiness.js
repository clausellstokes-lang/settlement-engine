/**
 * domain/facts/beastsReadiness.js — THE DEFENCE AGAINST BEASTS, AGAINST THE THREAT (W2-A-LEAVES, 2026-11-12; the
 * class table's pattern 9: a "Critical" beasts grade printed over the settled-country reassurance).
 *
 * Two homes answered one question: the threat is the config's family (plagued, frontier, settled: the beasts row's
 * key, `defenseStateProse.js :: measuredMonsterFamily`), the readiness is the defence profile's monster score and
 * the band the page prints for it (`defenseScoreBands.js :: scoreBand`). This leaf reads both, once, so a line
 * about the beasts reads the grade it is printed under. `settledAndWeak` is the case the corpus has no line for
 * (the hand cure's authored situation reads it).
 *
 * Layer 3 (the defence profile, layer 2, and the base). Pure: no randomness, no clock, no write.
 */
import { measuredMonsterFamily } from '../display/stateProse/defenseStateProse.js';
import { scoreBand } from '../display/defenseScoreBands.js';

/**
 * @param {unknown} record a settlement record
 * @returns {{ family: string|null, score: number, grade: string, settledAndWeak: boolean }}
 */
export function beastsReadinessOf(record) {
  const r = record && typeof record === 'object' ? /** @type {{ config?: { monsterThreat?: unknown }, defenseProfile?: { scores?: { monster?: unknown } } }} */ (record) : {};
  const family = measuredMonsterFamily(r.config?.monsterThreat);
  const raw = r.defenseProfile?.scores?.monster;
  const score = typeof raw === 'number' && Number.isFinite(raw) ? raw : 0;
  const grade = scoreBand(score);
  return { family, score, grade, settledAndWeak: family === 'settled' && (grade === 'WEAK' || grade === 'CRITICAL') };
}
