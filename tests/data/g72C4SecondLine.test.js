/**
 * g72C4SecondLine.test.js — G72 (5): C4's SECOND LINE SAYS WHAT THE GATE KNOWS.
 *
 * DS-ECO-1 `COMBINATION C4` v8 said "being easy to reach" beside "the roads are dangerous" (8 of the 119 pages printing
 * it): the gate knows a working trade route, not a safe road. Its words are corrected in place (WORD_CORRECTIONS row,
 * ruling G72): the same vid, no slot added, no mark changed.
 *
 * RED FIRST (ef10a71f3a's leaf): "C4 v8 says well placed for trade" failed: the leaf held
 * "{settlement} is poor, and being easy to reach has not changed that."
 */
import { describe, expect, test } from 'vitest';
import { DOSSIER_STATE_PROSE_ECONOMY } from '../../src/data/dossierStateProse/economy.generated.js';

const pool = /** @type {Array<{ vid: number, angle: string, text: string, slots: string[], marks?: string[] }>} */ (
  /** @type {any} */ (DOSSIER_STATE_PROSE_ECONOMY)['DS-ECO-1'].pools['COMBINATION C4: a low rung on a working approach']);

describe('G72 (5): DS-ECO-1 COMBINATION C4 v8', () => {
  const v8 = pool.find((v) => v.vid === 8);
  test('C4 v8 says well placed for trade', () => {
    expect(v8?.text).toBe('{settlement} is poor, and being well placed for trade has not changed that.');
  });
  test('the same vid, no slot added, no mark changed', () => {
    expect({ angle: v8?.angle, slots: v8?.slots, marks: v8?.marks })
      .toEqual({ angle: 'street', slots: ['settlement'], marks: ['no crisis: under_siege', 'no crisis: plague_onset'] });
  });
});
