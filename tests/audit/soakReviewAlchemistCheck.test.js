/**
 * A-04's ALCHEMIST (2026-11-04, under the owner's delegation): the catalogue licenses the Alchemist
 * shop and quarter 'none' — a chemical trade the dead-magic world keeps (MF-CH2B) — so the battery
 * counts only an alchemist whose licence needs magic, or one the catalogue does not license.
 */
import { describe, expect, it } from 'vitest';
import { magicAlchemist } from '../../scripts/audit/soak-review/checks.mjs';

describe('A-04, the alchemist', () => {
  it('an Alchemist shop (licence none) is no finding; an unlicensed alchemist is', () => {
    expect(magicAlchemist([{ name: 'Alchemist shop' }, { name: 'Alchemist quarter' }])).toBeUndefined();
    expect(magicAlchemist([{ name: 'Wandering alchemist' }])?.name).toBe('Wandering alchemist');
  });
});
