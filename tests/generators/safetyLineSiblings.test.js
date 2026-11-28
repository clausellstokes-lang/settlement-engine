/**
 * CENSUS-1e unit 2 (Appendix B item 23, the inline T branches of `safetyProfile.js`): the lines
 * CENSUS-5b declared in `SAFETY_LINE_SIBLINGS` resolve at the branch that prints them. Where the
 * live roster holds the atom the original prints byte-identical and is noted in the ledger; where
 * it does not, the declared twin prints. Draw-free (a T site): the profile's other fields are equal.
 */
import { describe, expect, it } from 'vitest';
import { generateSafetyProfile } from '../../src/generators/safetyProfile.js';
import { defenceOf } from '../../src/domain/facts/defence.js';
import { withPresumptionLedger } from '../../src/domain/facts/presumptionLedger.js';

const ORIGINAL = 'Authority is contested. The watch is uncertain whose orders to follow. Opportunistic crime is rising in the gap.';
const TWIN = 'Authority is contested. Whoever keeps order is uncertain whose orders to follow. Opportunistic crime is rising in the gap.';
const WITH_WATCH = [{ name: 'Town watch', category: 'Defense' }, { name: 'Market square', category: 'Economy' }];
const WITHOUT = [{ name: 'Market square', category: 'Economy' }];
const config = { stressTypes: ['succession_void'], monsterThreat: 'frontier' };

describe('safetyProfile SAFETY_LINE_SIBLINGS (CENSUS-1e unit 2)', () => {
  it('the rosters are what the arms say they are', () => {
    expect(defenceOf({ institutions: WITH_WATCH }).watch).toBe(true);
    expect(defenceOf({ institutions: WITHOUT }).watch).toBe(false);
  });

  it('(a) a watch on the roster: the original prints, noted with its atom', () => {
    const { result, ledger } = withPresumptionLedger(() => generateSafetyProfile(config, 'town', WITH_WATCH));
    expect(result.safetyDesc).toContain(ORIGINAL);
    const rows = ledger.filter((e) => e.pool === 'safetyProfile:SAFETY_LINE_SIBLINGS');
    expect(rows).toEqual([expect.objectContaining({ atoms: ['watch'], resolvedBy: 'drawn', drawKind: 'T' })]);
  });

  it('(b) no watch: the declared twin prints in its place', () => {
    const { result, ledger } = withPresumptionLedger(() => generateSafetyProfile(config, 'town', WITHOUT));
    expect(result.safetyDesc).toContain(TWIN);
    expect(result.safetyDesc).not.toContain('The watch is uncertain'); // anchored: the twin is matched in this same desc on the line above
    expect(ledger.filter((e) => e.pool === 'safetyProfile:SAFETY_LINE_SIBLINGS')).toEqual([expect.objectContaining({ resolvedBy: 'twin' })]);
  });
});
