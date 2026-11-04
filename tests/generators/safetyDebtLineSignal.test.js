/**
 * THE DEBT-EVASION LINE NAMES NO NETWORK WHERE NONE EXISTS (lane RUNG1B-F4 unit 4b, 2026-11-04;
 * docs/F4_CRIME_SIGNAL_2026-11-04.md §1).
 *
 * The indebted stress's safety-profile line "Residents fleeing creditor obligations, transferring
 * assets fraudulently, or using criminal networks to avoid collection." printed on the Defense tab
 * beside "No criminal infrastructure has been identified" in places with no criminal faction and
 * no criminal house (38 of 1,000; nine of A-06's 16, soak1k-276 among them). Assembly settles it
 * from the crime signal's one home: the clause is dropped where none exists, no word is added,
 * and beside a network the line is unchanged.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { birth, ensureLaws } from '../../scripts/audit/soak-review/corpus.mjs';
import { settleCrimeLinesToSignal } from '../../src/generators/safetyProfile.js';

const FULL = 'Residents fleeing creditor obligations, transferring assets fraudulently, or using criminal networks to avoid collection.';
const PLAIN = 'Residents fleeing creditor obligations or transferring assets fraudulently to avoid collection.';
const debt = (economicState) => economicState.safetyProfile.crimeTypes.find((c) => c.type === 'debt evasion');

describe('the debt-evasion line reads the crime signal', () => {
  beforeAll(async () => { await ensureLaws(); });

  it('soak1k-276: an indebted thorp with no network names none', () => {
    const { settlement } = birth(276);
    expect(debt(settlement.economicState)?.desc).toBe(PLAIN);
  });

  it('beside a criminal house the line keeps its network', () => {
    const economicState = { safetyProfile: { crimeTypes: [{ type: 'debt evasion', desc: FULL }] } };
    const house = [{ name: 'Smuggling ring', category: 'Criminal' }];
    expect(settleCrimeLinesToSignal(economicState, { seats: [], estate: house })).toBe(economicState);
  });
});
