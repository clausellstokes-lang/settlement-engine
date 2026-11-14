/**
 * foodEnduranceSaysTheStores.test.js — UPKEEP-8, step 4 (the chair's ruling of 2026-11-13, 22:42: #34 #43 #75 #86 #103
 * #114 #137 #146 #184 #226 #233 #290 #296, and the increment's rww-village-religious_conversion-1 and rww-village-calm-1).
 * The Food endurance line (`defenseDisplay.js :: foodEnduranceLine`, `monthsInWords`): the words contain the figure they
 * stand for; what a siege WOULD do is said only where none is in force, and what it HAS done only where one is; an
 * arithmetic the line states adds up from the record's own stored months (the one home, `storesMonthsOf`).
 * Red at the lane's base (995293e81).
 */
import { describe, expect, test } from 'vitest';
import { foodEnduranceLine } from '../../src/domain/display/defenseDisplay.js';

/** A place with a food record and no granary. @param {number} months @param {number} grownPct @param {boolean} [siege] */
const place = (months, grownPct, siege = false) => ({ tier: 'village', economicState: { foodSecurity: { hasSiege: siege, storageMonths: months, foodRecord: { storageMonths: months, grownPct, hasGranary: false } } } });

describe('the Food endurance line says the stores', () => {
  test('three days of stores are "a few days", never "a few weeks" (#43 #86 #296)', () => {
    const t = foodEnduranceLine(place(0.1, 60))?.sentence;
    expect(t).toMatch(/for a few days at full rations/);
    expect(t).not.toMatch(/a few weeks/); // anchored: the days asserted on the line above
  });
  test('the months add up from the stored months: 2.1 months is about two at full rations, about four on half (rww-village-calm-1)', () => {
    const t = foodEnduranceLine(place(2.1, 60))?.sentence;
    expect(t).toMatch(/for about two months at full rations, about four months on half/);
    expect(t).toMatch(/what is still harvested would stretch them further\.$/);
  });
  test('no siege in force: what a siege WOULD do; a siege in force: what it HAS done', () => {
    const calm = foodEnduranceLine(place(1.8, 40))?.sentence;
    expect(calm).toMatch(/^No granary: under siege the outlying fields would be lost; household stores would carry the village/);
    const besieged = foodEnduranceLine(place(1.8, 40, true))?.sentence;
    expect(besieged).toMatch(/^No granary: the siege has taken the outlying fields; household stores carry the village/);
    expect(besieged).not.toMatch(/\bwould\b/); // anchored: the present tense asserted on the line above
  });
});
