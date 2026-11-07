/**
 * tests/domain/facts/rulerKind.test.js — CENSUS-1 wave 0, fact 8: THE RULER-KIND HOME.
 * A new reader (none existed), so its test is its definition: every label the engine writes reads
 * one kind, and the table's labels read the kinds their archetypes mean.
 * @enforced-by npx vitest run tests/domain/facts/rulerKind.test.js
 */
import { describe, expect, it } from 'vitest';
import { rulerKindOf, rulerKindOfLabel, RULER_KINDS } from '../../../src/domain/facts/rulerKind.js';
import { governmentLabelFor } from '../../../src/domain/rulingPower.js';

describe('the ruler-kind home (CENSUS-1 fact 8)', () => {
  it('reads the born vocabulary (soak1k-0..999) to one kind each', () => {
    const cases = {
      'Elder Council': 'elder', "Headman's Authority": 'elder', 'Household Council': 'elder', 'Free Elder Council': 'elder',
      'Feudal Stewardship': 'lord', 'Royal Authority': 'lord', 'Noble Governorship': 'lord', 'Ducal Governorship': 'lord', 'Feudal Appointee': 'lord',
      'Priestly Guidance': 'priest', 'Church Council': 'priest', 'High Theocratic Council': 'priest', 'Ecclesiastical Council': 'priest',
      'Town Mayor': 'mayor', 'Elected Reeve': 'mayor',
      'Merchant oligarchy': 'council', 'Guild Council': 'council', 'Democratic assembly': 'council', 'Shadow Senate': 'council', 'Military Council': 'council',
    };
    for (const [label, kind] of Object.entries(cases)) expect([label, rulerKindOfLabel(label)]).toEqual([label, kind]);
  });

  it('the rulingPower table reads by archetype', () => {
    expect(rulerKindOfLabel(governmentLabelFor('occupation', 'town'))).toBe('occupier');
    expect(rulerKindOf({ powerStructure: { government: 'Town Council' } })).toBe('council');
    expect(rulerKindOf({})).toBe(null);
    expect(RULER_KINDS).toContain(rulerKindOfLabel('Arcane Senate'));
  });
});
