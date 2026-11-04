/**
 * tests/domain/facts/famine.test.js — CENSUS-1 wave 0, fact 6: THE FAMINE HOME.
 *
 * RED-FIRST. Hook-truth licensed "starving" by the food security LABEL while the stress-secret
 * pool and the food-words instrument read the food record's BAND (`recordAllowsStarving`). The
 * two agree at birth, but a pulsed save can move one without the other (the stockpile tick
 * rewrites the deficit, not the label): a record whose label still says Deficit while its record
 * reads secure kept its "starving" hook. Red at the window tip through `settlementHookFacts`.
 *
 * @enforced-by npx vitest run tests/domain/facts/famine.test.js
 */
import { describe, expect, it } from 'vitest';
import { settlementHookFacts } from '../../../src/domain/coherence/hookTruth.js';
import { FOOD_SECURITY_BANDS } from '../../../src/data/bandLadders.js';

const record = (label, band, months = 1) => ({
  tier: 'town',
  economicState: { foodSecurity: { label, storageMonths: months, foodRecord: band ? { band, storageMonths: months } : undefined } },
});

describe('the famine home (CENSUS-1 fact 6)', () => {
  it('RED-FIRST: hook-truth reads the food record band, not a drifted label', () => {
    expect(settlementHookFacts(record(FOOD_SECURITY_BANDS.deficit.label, 'secure')).famineLicensed).toBe(false);
    expect(settlementHookFacts(record(FOOD_SECURITY_BANDS.secure.label, 'deficit')).famineLicensed).toBe(true);
  });

  it('the months half is still the stores atom (two months or more refuses)', () => {
    expect(settlementHookFacts(record(FOOD_SECURITY_BANDS.famine.label, 'famine', 3)).famineLicensed).toBe(false);
  });

  it('the one rule, with the legacy answers for a record that carries no food record', async () => {
    const { famineOf } = await import('../../../src/domain/facts/famine.js');
    expect(famineOf(record(null, 'deficit'))).toMatchObject({ band: 'deficit', starvingAllowed: true, famine: false });
    expect(famineOf(record(null, 'pressured')).starvingAllowed).toBe(false);
    expect(famineOf(record(FOOD_SECURITY_BANDS.famine.label, null))).toMatchObject({ starvingAllowed: true, famine: true });
    expect(famineOf(record(FOOD_SECURITY_BANDS.secure.label, null)).starvingAllowed).toBe(false);
    expect(famineOf({})).toMatchObject({ known: false, starvingAllowed: true });
  });
});
