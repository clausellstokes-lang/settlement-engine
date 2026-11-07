/**
 * The rung-2 window (2026-11-04), the chair's ruling on F13 FAMINE-STORES: the Defense tab's
 * "Food endurance" line reads the same `foodRecord.storesHeld` fact F13's unit 1 added. Where an
 * active famine holds the granary shut, the endurance line says so, in the stores words' one
 * home (`defenseFacts.js :: HELD_STORES_WORDS`, which `tonightSheet.js :: foodStoresWords`
 * speaks too), and never says the held granary simply "carries" the place.
 *
 * Red first on `soak1k-3605` (metropolis, famine; record: granary, 12.1 months, storesHeld): the
 * Economy tab printed "Stores: a granary of twelve months that the hall will not open." while the
 * Defense tab printed "…the granary carries the metropolis for more than a year at full rations,
 * more than two years on half."
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { birth, ensureLaws } from '../../scripts/audit/soak-review/corpus.mjs';
import * as FACTS from '../../src/domain/defense/defenseFacts.js';
import { foodEnduranceLine } from '../../src/domain/display/defenseDisplay.js';
import { foodStoresWords } from '../../src/domain/summary/tonightSheet.js';

/** @type {any} */
let s3605;
beforeAll(async () => {
  await ensureLaws();
  s3605 = birth(3605).settlement;
}, 120_000);

/** @param {Record<string, unknown>} record @param {string} [tier] */
const placeWith = (record, tier = 'town') => ({ tier, economicState: { foodSecurity: { foodRecord: { grownPct: 40, hasGranary: true, ...record } } } });

describe('rung-2 window · the Food endurance line reads the held stores', () => {
  it('soak1k-3605: the famine holds the granary, and the endurance line says so', () => {
    const record = s3605.economicState.foodSecurity.foodRecord;
    expect(record).toMatchObject({ band: 'famine', hasGranary: true, storesHeld: true });
    const line = foodEnduranceLine(s3605);
    expect(line?.sentence).toContain(FACTS.HELD_STORES_WORDS);
    expect(line?.sentence).not.toMatch(/\bthe granary carries\b/); // anchored: the held-stores words are matched in this same sentence on the line above
    expect(line?.door).toBe('the granary');
  });

  it('the stores words have one home: the Economy row and the endurance line speak the same clause', () => {
    expect(typeof FACTS.HELD_STORES_WORDS).toBe('string');
    expect(foodStoresWords({ storageMonths: 12.1, hasGranary: true, storesHeld: true })).toContain(FACTS.HELD_STORES_WORDS);
    expect(FACTS.foodEnduranceOf(placeWith({ storageMonths: 12, storesHeld: true }))?.storesHeld).toBe(true);
  });

  it('an open granary reads as it did: it carries the place', () => {
    const line = foodEnduranceLine(placeWith({ storageMonths: 12 }));
    expect(line?.sentence).toMatch(/\bthe granary carries the town\b/);
    expect(line?.sentence).not.toContain(FACTS.HELD_STORES_WORDS); // anchored: 'the granary carries the town' is matched in this same sentence on the line above
  });

  it('a held granary that the harvest alone would cover still says the hall holds it', () => {
    const line = foodEnduranceLine(placeWith({ storageMonths: 8, storesHeld: true, grownPct: 400 }));
    expect(line?.sentence).toContain(FACTS.HELD_STORES_WORDS);
  });
});
