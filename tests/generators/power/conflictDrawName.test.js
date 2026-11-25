/**
 * conflictDrawName.test.js — C1's DRAW-KEY ALIAS (CLOSE-7 BATCH; the chair's RULING-R24 R24l (d)): the table holds EXACTLY the three
 * birth names R24g (2) introduced, each keyed by the form it replaced, and nothing else, so the alias cannot grow by habit; a later
 * rename comes to the chair. A display name may change; the key a draw was dealt on does not.
 */
import { describe, expect, test } from 'vitest';
import { CONFLICT_DRAW_KEY_OF, conflictDrawName } from '../../../src/generators/power/conflicts.js';

describe('R24l: the conflict draw key of a renamed form', () => {
  test('the table is exactly the three birth names of R24g (2), each to the form it replaced, and frozen', () => {
    expect({ ...CONFLICT_DRAW_KEY_OF }).toEqual({
      'Council of Aldermen': 'Corrupt Council',
      'Council of Syndics': 'Corrupt City Council',
      Senate: 'Shadow Senate',
    });
    expect(Object.isFrozen(CONFLICT_DRAW_KEY_OF)).toBe(true);
  });
  test('it keys a renamed form by its old form, and every other power by its own name (an absent name as the template read it)', () => {
    expect(conflictDrawName({ name: 'Council of Aldermen' })).toBe('Corrupt Council');
    expect(conflictDrawName({ name: 'Senate' })).toBe('Shadow Senate');
    expect(conflictDrawName({ name: 'Arcane Senate' })).toBe('Arcane Senate');
    expect(conflictDrawName({ name: 'Town Council' })).toBe('Town Council');
    expect(`${conflictDrawName({})}`).toBe(`${({}).name}`);
  });
});
