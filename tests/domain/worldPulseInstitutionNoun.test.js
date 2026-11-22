/**
 * tests/domain/worldPulseInstitutionNoun.test.js — A POWER-MOVE LINE NAMES AN
 * INSTITUTION AS A NOUN, NEVER AS ITS CATALOGUE KEY.
 *
 * The pulse's capture/suppression lines (factionCompetition.js ::
 * POWER_ACTION_SUMMARY) fill `{target}` with an institution. They used to drop
 * the raw catalogue key in: "Control of Cnocby's multiple water sources is
 * passing to Elder Council", "…'s dwellings (15-100)", "…'s parish church"
 * (VISIBLE-BUGS item 3a, 2026-11-12; 47 of 121 lines over seeds lf-001..040).
 * The fill is now institutionSentenceNoun. This walks EVERY catalogue name.
 */
import { describe, it, expect } from 'vitest';
import { institutionSentenceNoun } from '../../src/domain/display/institutionSentenceNoun.js';
import { catalogInstitutionNames } from '../../src/domain/arcaneInstitutionIdentity.js';

/** What a catalogue key carries that a sentence noun must not. */
const KEY_SHAPE = /\(|\)|\/|^(multiple|massive)\s|\bparish\b/i;

describe('institutionSentenceNoun: the catalogue key never reaches the sentence', () => {
  it('no catalogue name fills {target} with a count, a condition, a slash, "multiple" or a seam-mapped word', () => {
    const names = catalogInstitutionNames();
    expect(names.length).toBeGreaterThan(100);
    const leaks = names
      .map((n) => [n, institutionSentenceNoun(n)])
      .filter(([, said]) => !said || KEY_SHAPE.test(said))
      .map(([n, said]) => `${n} → ${said}`);
    expect(leaks).toEqual([]);
  });

  it('the landing line reads as a noun', () => {
    expect(institutionSentenceNoun('Multiple water sources')).toBe('water sources');
    expect(institutionSentenceNoun('Dwellings (15-100)')).toBe('dwellings');
    expect(institutionSentenceNoun('Docks/port facilities')).toBe('docks');
    expect(institutionSentenceNoun('Parish church')).toBe('house of worship');
    expect(institutionSentenceNoun('Mill')).toBe('mill');
    expect(institutionSentenceNoun("Carriers' guild")).toBe("carriers' guild");
  });
});
