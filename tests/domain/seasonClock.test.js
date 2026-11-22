/**
 * seasonClock.test.js — SEASONS-A item 1: the season clock is a PURE function
 * of the canonical week tick, agreeing with the calendar law by construction
 * (worldState.js owns both; the 13-week quarters ARE the seasons).
 */
import { describe, expect, test } from 'vitest';

import { advanceWorldCalendar, seasonForTick } from '../../src/domain/worldPulse/worldState.js';

describe('seasonForTick — the pure season clock over the 4-4-5 week grid', () => {
  test('the four 13-week quarters: spring 1-13, summer 14-26, autumn 27-39, winter 40-52', () => {
    // weekTick N = N elapsed weeks; the label covers the week ENDING at N+1.
    expect(seasonForTick(0)).toEqual({ season: 'spring', weekOfYear: 1, weekOfSeason: 1, year: 1 });
    expect(seasonForTick(12)).toEqual({ season: 'spring', weekOfYear: 13, weekOfSeason: 13, year: 1 });
    expect(seasonForTick(13)).toEqual({ season: 'summer', weekOfYear: 14, weekOfSeason: 1, year: 1 });
    expect(seasonForTick(26)).toEqual({ season: 'autumn', weekOfYear: 27, weekOfSeason: 1, year: 1 });
    expect(seasonForTick(38)).toEqual({ season: 'autumn', weekOfYear: 39, weekOfSeason: 13, year: 1 });
    expect(seasonForTick(39)).toEqual({ season: 'winter', weekOfYear: 40, weekOfSeason: 1, year: 1 });
    expect(seasonForTick(51)).toEqual({ season: 'winter', weekOfYear: 52, weekOfSeason: 13, year: 1 });
  });

  test('the year rolls at week 52 and the clock is periodic', () => {
    expect(seasonForTick(52)).toEqual({ season: 'spring', weekOfYear: 1, weekOfSeason: 1, year: 2 });
    expect(seasonForTick(52 * 7 + 40)).toEqual({ season: 'winter', weekOfYear: 41, weekOfSeason: 2, year: 8 });
  });

  test('total on garbage: negative/NaN clamp to week 0', () => {
    expect(seasonForTick(-3)).toEqual(seasonForTick(0));
    expect(seasonForTick(NaN)).toEqual(seasonForTick(0));
    expect(seasonForTick(12.9).weekOfYear).toBe(13); // floors to integer weeks
  });

  test('agrees with the calendar law for every week of a year (no second season derivation)', () => {
    let calendar = { elapsedWeeks: 0 };
    for (let w = 1; w <= 52 * 2; w += 1) {
      calendar = advanceWorldCalendar(calendar, 'one_week');
      expect(seasonForTick(calendar.elapsedWeeks).season).toBe(calendar.season);
    }
  });
});
