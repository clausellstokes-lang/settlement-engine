/**
 * firstHundred.test.js — the R-29 THE FIRST HUNDRED guard.
 *
 * The load-bearing pin is CLAIMS-PARITY: the roll ships EMPTY and carries only real,
 * named, opted-in people. No placeholder names, ever. Also pins the cohort cap, the
 * validity filter, and that this cohort is DISTINCT from the thirty Founder seats.
 */
import { describe, it, expect } from 'vitest';
import {
  FIRST_HUNDRED,
  FIRST_HUNDRED_CAP,
  isValidHonoree,
  listedHonorees,
  firstHundredCount,
  firstHundredRemaining,
} from '../../src/config/firstHundred.js';
import { FOUNDER_SEAT_CAP } from '../../src/lib/founderSeats.js';

describe('CLAIMS-PARITY: the roll is honest', () => {
  it('ships EMPTY (no fake or placeholder names)', () => {
    expect(FIRST_HUNDRED).toEqual([]);
    expect(firstHundredCount()).toBe(0);
    expect(firstHundredRemaining()).toBe(FIRST_HUNDRED_CAP);
  });

  it('a valid honoree needs a real display name', () => {
    expect(isValidHonoree({ name: 'A. Real Person' })).toBe(true);
    expect(isValidHonoree({ name: '' })).toBe(false);
    expect(isValidHonoree({ name: '   ' })).toBe(false);
    expect(isValidHonoree({ note: 'no name' })).toBe(false);
    expect(isValidHonoree(null)).toBe(false);
  });

  it('listedHonorees filters invalid entries and caps at the cohort size', () => {
    const messy = [
      { name: 'One' }, { name: '' }, { note: 'x' }, { name: 'Two', note: 'thanks', since: '2026-07' },
    ];
    const listed = listedHonorees(messy);
    expect(listed.map((h) => h.name)).toEqual(['One', 'Two']);
    // Even an over-long list can never render past the cap.
    const tooMany = Array.from({ length: FIRST_HUNDRED_CAP + 25 }, (_, i) => ({ name: `Member ${i}` }));
    expect(listedHonorees(tooMany).length).toBe(FIRST_HUNDRED_CAP);
  });
});

describe('the cohort cap', () => {
  it('is exactly one hundred', () => {
    expect(FIRST_HUNDRED_CAP).toBe(100);
  });

  it('is DISTINCT from the thirty Founder seats (not the same list)', () => {
    expect(FOUNDER_SEAT_CAP).toBe(30);
    expect(FIRST_HUNDRED_CAP).not.toBe(FOUNDER_SEAT_CAP);
  });
});
