/**
 * R2-CODE-B-SIDE item 7 — THE WALK TO THE NEXT VILLAGE'S CHURCH IS NOT SAID UNDER A SIEGE THAT BARS THE ROAD (the
 * increment's rww-thorp-under_siege-1: "The thorp has no church of its own; its people walk to the next village's
 * parish church for the rites" while "Enemies are camped around Belovich, and nothing comes in by road"). The access
 * is read from the roster (item 6b, ffe89ab39); the siege from the one crisis reader (facts/crisisKind.js :: crisisOf).
 */
import { describe, expect, test } from 'vitest';
import { faithLinesOf, faithReadingOf } from '../../src/domain/dossier/faithReading.js';

const THORP = { tier: 'thorp', institutions: [{ name: 'Access to parish church' }, { name: 'Dwellings (1-8)' }] };
const SIEGE = { ...THORP, stress: { type: 'under_siege', label: 'Under Siege' } };

describe('the access line and the siege', () => {
  test('under a siege the people do not walk to the next village', () => {
    const lines = faithLinesOf(faithReadingOf(SIEGE), { tierNoun: 'thorp' }).join(' ');
    expect(lines).toContain('no church of its own');
    expect(lines).not.toMatch(/walk to the next village/);
    expect(lines).toContain('the siege keeps its people from the next village’s parish church');
  });
  test('the guard: in calm the walk is said', () => {
    const lines = faithLinesOf(faithReadingOf(THORP), { tierNoun: 'thorp' }).join(' ');
    expect(lines).toContain('its people walk to the next village’s parish church for the rites');
  });
  test('item 6b reaches a thorp with no access row (rww-thorp-famine-1): no walk is said', () => {
    const lines = faithLinesOf(faithReadingOf({ tier: 'thorp', institutions: [{ name: 'Access to external mill' }] }), { tierNoun: 'thorp' }).join(' ');
    expect(lines).not.toMatch(/next village/);
  });
});
