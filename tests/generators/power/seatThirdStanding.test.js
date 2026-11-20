/**
 * tests/generators/power/seatThirdStanding.test.js — PEOPLE-2 builder B2, the chair's F2 of 18:14 UTC (on PEOPLE-2 seat M6's
 * §F.2): at rank 2 the GOVERNING seat prints neither `atTable` ("They are always at the table, but cannot set their own
 * terms.") nor `worthBuying` ("Close enough to the two above that their support is worth buying; …"): the seat sets the
 * terms it governs by. The "… powers stand almost level" line STAYS (it speaks of the place). No new sentence. A power
 * that does not govern keeps both lines (the control).
 */
import { describe, expect, it } from 'vitest';
import { annotateFactionStanding } from '../../../src/generators/power/factionStanding.js';

const AT_TABLE = 'They are always at the table, but cannot set their own terms.';
const WORTH_BUYING = /Close enough to the two above that their support is worth buying/;

/** a roster of four powers, the third (rank 2) at `third`, governing or not */
const roster = (powers, governsThird) => powers.map((power, i) => ({
  faction: ['Merchant Guilds', 'Military/Guard', 'Town Council', 'Craft Guilds'][i],
  power, isGoverning: governsThird ? i === 2 : i === 0, desc: 'Line.',
}));
const third = (powers, governs) => { const f = roster(powers, governs); annotateFactionStanding(f); return f[2].desc; };

describe('the governing seat at rank 2 (F2)', () => {
  it('prints no atTable line within five of the powers above and below (not three level)', () => {
    expect(third([40, 34, 30, 26], false)).toContain(AT_TABLE); // the control
    expect(third([40, 34, 30, 26], true)).not.toContain(AT_TABLE);
  });
  it('prints no worthBuying line 6 to 10 below the power above', () => {
    expect(third([40, 36, 28, 10], false)).toMatch(WORTH_BUYING); // the control
    expect(third([40, 36, 28, 10], true)).not.toMatch(WORTH_BUYING);
  });
  it('prints no atTable line more than 10 below the power above', () => {
    expect(third([45, 40, 20, 10], false)).toContain(AT_TABLE); // the control
    expect(third([45, 40, 20, 10], true)).not.toContain(AT_TABLE);
  });
  it('keeps the level line: three or more powers almost level speak of the place', () => {
    expect(third([30, 28, 27, 26], true)).toMatch(/powers stand almost level here, and no one leads/);
  });
});
