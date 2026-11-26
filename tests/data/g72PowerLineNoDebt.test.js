/**
 * g72PowerLineNoDebt.test.js — G72 (2): THE POWER LINE THAT STATED A DEBT NO FACT HOLDS.
 *
 * DS-POW-5 `merchant_league` v2 (street, no mark) said the people who run the place are "the people it owes money to"; it
 * is dealt to any merchant-league place, and no fact of the record holds the debt. Its words are corrected in place
 * (WORD_CORRECTIONS row, ruling G72): the same vid, the same slots, no mark, so no pick moves.
 *
 * RED FIRST (ef10a71f3a's leaf): "the merchant-league street line says trade, not debt" failed: the leaf held
 * "The people who run {settlement} are also the people it owes money to, and they do not keep the two apart."
 */
import { describe, expect, test } from 'vitest';
import { DOSSIER_STATE_PROSE_POWER } from '../../src/data/dossierStateProse/power.generated.js';

const pool = /** @type {Array<{ vid: number, angle: string, text: string, slots: string[], marks?: string[] }>} */ (
  /** @type {any} */ (DOSSIER_STATE_PROSE_POWER)['DS-POW-5'].pools.merchant_league);

describe('G72 (2): DS-POW-5 merchant_league v2', () => {
  test('the merchant-league street line says trade, not debt', () => {
    const v2 = pool.find((v) => v.vid === 2);
    expect(v2?.text).toBe('The people who run {settlement} are also the people who trade in it, and they do not keep the two apart.');
  });
  test('the same vid, the same slots, no mark: no pick moves', () => {
    const v2 = pool.find((v) => v.vid === 2);
    expect({ angle: v2?.angle, slots: v2?.slots, marks: v2?.marks }).toEqual({ angle: 'street', slots: ['settlement'], marks: undefined });
    expect(pool.map((v) => v.vid)).toEqual([1, 2, 3, 4]);
  });
  test('no line of the pool says the place owes money', () => {
    for (const v of pool) expect(v.text, `v${v.vid}`).not.toMatch(/\bowes?\b|\bdebt/i);
  });
});
