/**
 * traditionAlmanac.test.js — THE TRADITIONS wave (T-5). The realm "coming this season"
 * read-model reads the settlement.traditions MIRROR only: absent ⇒ available:false (the
 * caller renders nothing, byte-identical), present ⇒ the upcoming in-season observances.
 */
import { describe, it, expect } from 'vitest';
import { deriveTraditionAlmanac, seasonOfWeek, clockOfTick } from '../../src/domain/traditions/almanac.js';

/** A member save carrying a traditions mirror. */
const save = (id, name, traditions) => ({ id, name, settlement: { name, traditions } });
/** A minimal mirror record (only the fields the almanac reads). */
const rec = (name, startWeekOfYear, extra = {}) => ({
  id: `t.${name}`, name, coreMotif: { element: 'harvest', act: 'feast' },
  window: { startWeekOfYear, weeks: 1 }, scaleBand: 3, suppressedBy: null, ...extra,
});

describe('traditionAlmanac — the 4-4-5 season clock (mirrors seasonForTick)', () => {
  it('maps weeks to seasons on the 13-week grid', () => {
    expect(seasonOfWeek(1)).toBe('spring');
    expect(seasonOfWeek(13)).toBe('spring');
    expect(seasonOfWeek(14)).toBe('summer');
    expect(seasonOfWeek(27)).toBe('autumn');
    expect(seasonOfWeek(40)).toBe('winter');
    expect(seasonOfWeek(52)).toBe('winter');
  });
  it('derives the current season + 1-based week-of-year from an elapsed-week tick', () => {
    expect(clockOfTick(0)).toEqual({ season: 'spring', weekOfYear: 1 });
    expect(clockOfTick(26)).toEqual({ season: 'autumn', weekOfYear: 27 });
    expect(clockOfTick(52)).toEqual({ season: 'spring', weekOfYear: 1 }); // wraps the year
  });
});

describe('traditionAlmanac — deriveTraditionAlmanac', () => {
  it('absent mirror (dark/aspatial) ⇒ available:false, display null (caller renders nothing)', () => {
    expect(deriveTraditionAlmanac({ settlements: [], weekTick: 0 })).toMatchObject({ available: false, count: 0, display: null });
    expect(deriveTraditionAlmanac({ settlements: [save('a', 'Ashford', null)], weekTick: 0 }))
      .toMatchObject({ available: false, display: null });
    expect(deriveTraditionAlmanac({})).toMatchObject({ available: false });
  });

  it('surfaces observances whose window opens later THIS season', () => {
    // week tick 0 ⇒ spring, week-of-year 1. Two spring rites ahead (weeks 5, 9), one already
    // passed is impossible at week 1; a summer rite (week 20) is not this season.
    const out = deriveTraditionAlmanac({
      settlements: [save('a', 'Ashford', [rec('The Green Feast', 9), rec('The Seed Feast', 5), rec('The Long Sun', 20)])],
      weekTick: 0,
    });
    expect(out.available).toBe(true);
    expect(out.count).toBe(2);                       // only the two spring rites
    expect(out.coming.map((c) => c.name)).toEqual(['The Seed Feast', 'The Green Feast']); // sorted by week
    expect(out.season).toBe('spring');
  });

  it('excludes observances already PAST this year and SUPPRESSED rites', () => {
    // week tick 8 ⇒ spring, week-of-year 9. Week-5 rite has passed; week-11 is upcoming;
    // a suppressed week-13 rite does not occur.
    const out = deriveTraditionAlmanac({
      settlements: [save('a', 'Ashford', [
        rec('Past Rite', 5),
        rec('Coming Rite', 11),
        rec('Traded Away', 13, { suppressedBy: { overlordId: 'b', sinceYear: 2, traded: {} } }),
      ])],
      weekTick: 8,
    });
    expect(out.count).toBe(1);
    expect(out.coming[0].name).toBe('Coming Rite');
  });

  it('a single upcoming rite names it; several give a count', () => {
    const one = deriveTraditionAlmanac({ settlements: [save('a', 'A', [rec('Solo Rite', 6)])], weekTick: 0 });
    expect(one.display).toBe('Solo Rite coming this season');
    const many = deriveTraditionAlmanac({ settlements: [save('a', 'A', [rec('R1', 4), rec('R2', 7)])], weekTick: 0 });
    expect(many.display).toBe('2 festivals coming this season');
  });

  it('is deterministic + settlement-name-stable across the realm', () => {
    const settlements = [save('a', 'Ashford', [rec('R1', 4)]), save('b', 'Briar', [rec('R2', 4)])];
    const a = deriveTraditionAlmanac({ settlements, weekTick: 0 });
    const b = deriveTraditionAlmanac({ settlements, weekTick: 0 });
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
    expect(a.coming.map((c) => c.settlementName)).toEqual(['Ashford', 'Briar']); // codepoint tie-break on equal week
  });
});
